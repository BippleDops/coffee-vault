/**
 * Brewing Optimization Engine for Coffee Vault
 * Version: 3.0.0
 *
 * Analyzes brewing history and provides intelligent parameter recommendations
 * based on machine learning-style pattern recognition.
 *
 * Usage: Import into Datacore queries or Templater templates
 */

const stats = require('./stats-utils.js');

/**
 * Analyze brewing history and generate optimized parameter suggestions
 * @param {Object} dv - Dataview API
 * @param {Object} context - Current brewing context (bean, method, etc.)
 * @returns {Object} Optimization recommendations
 */
function optimizeBrewingParameters(dv, context = {}) {
  const {
    beans = null,
    brewMethod = null,
    roastLevel = null,
    origin = null,
    targetRating = 4.5
  } = context;

  // Query relevant brewing history
  let historicalLogs = dv.pages('"Coffee Logs"')
    .where(p => p.type === "coffee-log" && p.rating != null)
    .sort(p => p.date, 'desc')
    .limit(100)
    .array();

  // Filter by context
  if (beans) {
    historicalLogs = historicalLogs.filter(l =>
      l.beans && l.beans.toLowerCase().includes(beans.toLowerCase())
    );
  }

  if (brewMethod) {
    historicalLogs = historicalLogs.filter(l => l["brew-method"] === brewMethod);
  }

  if (roastLevel) {
    historicalLogs = historicalLogs.filter(l => l["roast-level"] === roastLevel);
  }

  if (origin) {
    historicalLogs = historicalLogs.filter(l => l.origin === origin);
  }

  if (historicalLogs.length === 0) {
    return generateDefaultRecommendations(context);
  }

  // Analyze high-performing brews (4.0+ rating)
  const highPerformers = historicalLogs.filter(l => l.rating >= 4.0);
  const allBrews = historicalLogs;

  const recommendations = {
    context: context,
    dataPoints: allBrews.length,
    highPerformers: highPerformers.length,
    confidence: calculateConfidence(allBrews.length, highPerformers.length),

    // Parameter recommendations
    dose: analyzeDose(highPerformers, allBrews),
    waterTemperature: analyzeWaterTemp(highPerformers, allBrews),
    grindSize: analyzeGrindSize(highPerformers, allBrews),
    brewTime: analyzeBrewTime(highPerformers, allBrews),
    ratio: analyzeRatio(highPerformers, allBrews),

    // Correlation insights
    insights: generateInsights(allBrews),

    // Specific recommendations
    nextSteps: generateNextSteps(allBrews, context)
  };

  return recommendations;
}

/**
 * Calculate confidence score based on data availability
 */
function calculateConfidence(totalBrews, highPerformers) {
  if (totalBrews === 0) return 0;
  if (totalBrews < 5) return 25;
  if (totalBrews < 10) return 50;
  if (highPerformers < 3) return 60;
  if (totalBrews >= 20 && highPerformers >= 5) return 95;
  return 75;
}

/**
 * Analyze optimal dose based on high performers
 */
function analyzeDose(highPerformers, allBrews) {
  if (highPerformers.length === 0) {
    return { recommended: 18, confidence: 0, reason: "No data available" };
  }

  const doses = highPerformers.map(l => l.dose).filter(d => d != null);
  const allDoses = allBrews.map(l => l.dose).filter(d => d != null);

  if (doses.length === 0) {
    return { recommended: 18, confidence: 0, reason: "No dose data" };
  }

  const avgDose = stats.mean(doses);
  const medianDose = stats.median(doses);
  const stdev = stats.standardDeviation(doses);

  // Check if there's a correlation between dose and rating
  const ratings = highPerformers.map(l => l.rating).filter((r, i) => doses[i] != null);
  const correlation = stats.pearsonCorrelation(doses, ratings);

  return {
    recommended: Math.round(medianDose * 2) / 2, // Round to nearest 0.5
    average: avgDose.toFixed(1),
    range: [Math.max(10, avgDose - stdev), Math.min(30, avgDose + stdev)],
    consistency: stats.consistencyScore(doses),
    correlation: correlation.toFixed(2),
    reason: correlation > 0.5 ?
      "Strong positive correlation with quality" :
      correlation < -0.5 ?
        "Higher doses may reduce quality" :
        "Dose shows moderate impact on quality"
  };
}

/**
 * Analyze optimal water temperature
 */
function analyzeWaterTemp(highPerformers, allBrews) {
  const temps = highPerformers.map(l => l["water-temperature"]).filter(t => t != null);

  if (temps.length === 0) {
    return { recommended: 92, confidence: 0, reason: "No temperature data" };
  }

  const avgTemp = stats.mean(temps);
  const medianTemp = stats.median(temps);
  const mode = stats.mode(temps);

  return {
    recommended: Math.round(medianTemp),
    average: avgTemp.toFixed(1),
    mode: mode,
    range: [Math.round(avgTemp - 2), Math.round(avgTemp + 2)],
    reason: `Based on ${temps.length} high-quality brews`
  };
}

/**
 * Analyze optimal grind size
 */
function analyzeGrindSize(highPerformers, allBrews) {
  const grinds = highPerformers.map(l => l["grind-size"]).filter(g => g);

  if (grinds.length === 0) {
    return { recommended: "medium-fine", confidence: 0, reason: "No grind data" };
  }

  const topGrinds = stats.topN(grinds, 1);
  const mostCommon = topGrinds[0];

  return {
    recommended: mostCommon.value,
    frequency: `${mostCommon.count}/${grinds.length}`,
    alternatives: stats.topN(grinds, 3).slice(1).map(g => g.value),
    reason: `Most successful grind size (${mostCommon.count} uses)`
  };
}

/**
 * Analyze optimal brew time
 */
function analyzeBrewTime(highPerformers, allBrews) {
  const times = highPerformers.map(l => l["brew-time"]).filter(t => t);

  if (times.length === 0) {
    return { recommended: "3:00", confidence: 0, reason: "No time data" };
  }

  const mode = stats.mode(times);
  const topTimes = stats.topN(times, 3);

  return {
    recommended: mode || topTimes[0].value,
    topChoices: topTimes.map(t => ({ time: t.value, count: t.count })),
    reason: `Most frequently successful time`
  };
}

/**
 * Analyze optimal brew ratio
 */
function analyzeRatio(highPerformers, allBrews) {
  const ratios = highPerformers.map(l => l["brew-ratio"]).filter(r => r);

  if (ratios.length === 0) {
    return { recommended: "1:16.5", confidence: 0, reason: "No ratio data" };
  }

  const mode = stats.mode(ratios);
  const topRatios = stats.topN(ratios, 3);

  return {
    recommended: mode || topRatios[0].value,
    topChoices: topRatios.map(r => ({ ratio: r.value, count: r.count })),
    reason: `Most successful ratio`
  };
}

/**
 * Generate correlation insights
 */
function generateInsights(allBrews) {
  const insights = [];

  // Extract parameter arrays
  const doses = allBrews.map(l => l.dose).filter(d => d != null);
  const temps = allBrews.map(l => l["water-temperature"]).filter(t => t != null);
  const ratings = allBrews.map(l => l.rating).filter(r => r != null);

  // Dose vs Rating correlation
  if (doses.length >= 5 && ratings.length >= 5) {
    const doseRatings = allBrews
      .filter(l => l.dose != null && l.rating != null)
      .map(l => ({ dose: l.dose, rating: l.rating }));

    if (doseRatings.length >= 5) {
      const correlation = stats.pearsonCorrelation(
        doseRatings.map(d => d.dose),
        doseRatings.map(d => d.rating)
      );

      insights.push({
        parameter: "Dose",
        correlation: correlation.toFixed(3),
        strength: stats.interpretCorrelation(correlation),
        interpretation: Math.abs(correlation) > 0.5 ?
          `${correlation > 0 ? 'Higher' : 'Lower'} doses tend to improve quality` :
          "Dose has moderate impact on quality"
      });
    }
  }

  // Temperature vs Rating
  if (temps.length >= 5) {
    const tempRatings = allBrews
      .filter(l => l["water-temperature"] != null && l.rating != null)
      .map(l => ({ temp: l["water-temperature"], rating: l.rating }));

    if (tempRatings.length >= 5) {
      const correlation = stats.pearsonCorrelation(
        tempRatings.map(t => t.temp),
        tempRatings.map(t => t.rating)
      );

      insights.push({
        parameter: "Water Temperature",
        correlation: correlation.toFixed(3),
        strength: stats.interpretCorrelation(correlation),
        interpretation: Math.abs(correlation) > 0.5 ?
          `${correlation > 0 ? 'Higher' : 'Lower'} temperatures improve quality` :
          "Temperature shows moderate correlation with quality"
      });
    }
  }

  // Trend analysis
  if (ratings.length >= 7) {
    const trend = stats.detectTrend(ratings);
    insights.push({
      parameter: "Overall Quality Trend",
      direction: trend.direction,
      strength: trend.strength.toFixed(2),
      interpretation: trend.interpretation
    });
  }

  return insights;
}

/**
 * Generate actionable next steps
 */
function generateNextSteps(allBrews, context) {
  const steps = [];

  // Recent performance analysis
  const recentBrews = allBrews.slice(0, 5);
  const recentRatings = recentBrews.map(l => l.rating).filter(r => r);

  if (recentRatings.length > 0) {
    const recentAvg = stats.mean(recentRatings);

    if (recentAvg < 3.5) {
      steps.push({
        priority: "high",
        action: "Review fundamentals",
        detail: "Recent ratings are below 3.5. Check grind size, water quality, and freshness."
      });
    } else if (recentAvg >= 4.5) {
      steps.push({
        priority: "low",
        action: "Maintain consistency",
        detail: "Recent brews are excellent. Keep your current parameters."
      });
    }
  }

  // Variability check
  if (recentRatings.length >= 3) {
    const consistency = stats.consistencyScore(recentRatings);
    if (consistency < 70) {
      steps.push({
        priority: "medium",
        action: "Improve consistency",
        detail: `Consistency is ${consistency.toFixed(0)}%. Focus on repeatable technique.`
      });
    }
  }

  // Experimentation suggestions
  const brewMethods = allBrews.map(l => l["brew-method"]).filter(m => m);
  const uniqueMethods = new Set(brewMethods);

  if (uniqueMethods.size === 1 && allBrews.length > 10) {
    steps.push({
      priority: "low",
      action: "Try different brew method",
      detail: "You've been using the same method consistently. Experiment with alternatives."
    });
  }

  return steps;
}

/**
 * Generate default recommendations when no data is available
 */
function generateDefaultRecommendations(context) {
  const { brewMethod = "v60", roastLevel = "medium" } = context;

  return {
    context: context,
    dataPoints: 0,
    highPerformers: 0,
    confidence: 0,

    dose: {
      recommended: 18,
      reason: "Standard starting point"
    },

    waterTemperature: {
      recommended: roastLevel === "light" ? 94 : roastLevel === "dark" ? 88 : 92,
      reason: `Default for ${roastLevel} roast`
    },

    grindSize: {
      recommended: brewMethod === "v60" ? "medium-fine" :
        brewMethod === "chemex" ? "medium" :
          brewMethod === "aeropress" ? "fine" :
            brewMethod === "french-press" ? "coarse" :
              "medium",
      reason: `Standard for ${brewMethod}`
    },

    brewTime: {
      recommended: brewMethod === "v60" ? "2:30-3:00" :
        brewMethod === "chemex" ? "4:00" :
          brewMethod === "aeropress" ? "1:30" :
            "3:00",
      reason: "Standard timing"
    },

    ratio: {
      recommended: "1:16.5",
      reason: "Golden ratio starting point"
    },

    insights: [],

    nextSteps: [
      {
        priority: "high",
        action: "Start logging consistently",
        detail: "Create more brewing logs to enable personalized recommendations"
      }
    ]
  };
}

/**
 * Format recommendations as markdown
 */
function formatRecommendations(recs) {
  let md = `# 🎯 Brewing Optimization Report\n\n`;

  md += `**Context**: ${recs.context.brewMethod || 'All methods'} | ${recs.context.roastLevel || 'All roasts'}\n`;
  md += `**Data Points**: ${recs.dataPoints} total brews (${recs.highPerformers} high-quality)\n`;
  md += `**Confidence**: ${recs.confidence}%\n\n`;

  md += `---\n\n`;

  md += `## 📊 Recommended Parameters\n\n`;

  md += `### Coffee Dose\n`;
  md += `- **Recommended**: ${recs.dose.recommended}g\n`;
  md += `- **Reason**: ${recs.dose.reason}\n`;
  if (recs.dose.range) {
    md += `- **Range**: ${recs.dose.range[0].toFixed(1)}-${recs.dose.range[1].toFixed(1)}g\n`;
  }
  md += `\n`;

  md += `### Water Temperature\n`;
  md += `- **Recommended**: ${recs.waterTemperature.recommended}°C\n`;
  md += `- **Reason**: ${recs.waterTemperature.reason}\n`;
  if (recs.waterTemperature.range) {
    md += `- **Range**: ${recs.waterTemperature.range[0]}-${recs.waterTemperature.range[1]}°C\n`;
  }
  md += `\n`;

  md += `### Grind Size\n`;
  md += `- **Recommended**: ${recs.grindSize.recommended}\n`;
  md += `- **Reason**: ${recs.grindSize.reason}\n`;
  md += `\n`;

  md += `### Brew Time\n`;
  md += `- **Recommended**: ${recs.brewTime.recommended}\n`;
  md += `- **Reason**: ${recs.brewTime.reason}\n`;
  md += `\n`;

  md += `### Brew Ratio\n`;
  md += `- **Recommended**: ${recs.ratio.recommended}\n`;
  md += `- **Reason**: ${recs.ratio.reason}\n`;
  md += `\n`;

  if (recs.insights.length > 0) {
    md += `---\n\n`;
    md += `## 💡 Insights\n\n`;
    recs.insights.forEach(insight => {
      md += `### ${insight.parameter}\n`;
      md += `- **Correlation**: ${insight.correlation} (${insight.strength})\n`;
      md += `- **Interpretation**: ${insight.interpretation}\n\n`;
    });
  }

  md += `---\n\n`;
  md += `## 🚀 Next Steps\n\n`;
  recs.nextSteps.forEach(step => {
    const icon = step.priority === 'high' ? '🔴' : step.priority === 'medium' ? '🟡' : '🟢';
    md += `${icon} **${step.action}**\n`;
    md += `   ${step.detail}\n\n`;
  });

  return md;
}

module.exports = {
  optimizeBrewingParameters,
  formatRecommendations,
  generateDefaultRecommendations
};
