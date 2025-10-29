/**
 * Monthly Report Generator for Coffee Vault
 * Version: 1.0.0
 * Last Updated: 2025-10-26
 *
 * Automatically generates comprehensive monthly coffee brewing reports
 * with deep analytics, comparisons, insights, and year-over-year trends.
 *
 * Dependencies: stats-utils.js
 * Usage: Can be called from Templater, Datacore, or run directly
 *
 * @example
 * const monthlyReport = require('./monthly-report-generator.js');
 * const report = await monthlyReport.generateMonthlyReport(dv, '2025-10');
 * console.log(monthlyReport.formatAsMarkdown(report));
 */

const stats = require('./stats-utils.js');

// ============================================
// MAIN REPORT GENERATION
// ============================================

/**
 * Generate comprehensive monthly report
 * @param {Object} dv - Dataview API instance
 * @param {string} monthString - Month in YYYY-MM format (e.g., "2025-10")
 * @returns {Promise<Object>} Complete monthly report data
 *
 * @example
 * const report = await generateMonthlyReport(dv, '2025-10');
 * // Returns: { month: '2025-10', totalSessions: 45, ratings: {...}, ... }
 */
async function generateMonthlyReport(dv, monthString) {
  try {
    const { monthStart, monthEnd } = getMonthDates(monthString);

    // Query all coffee logs for the month
    const logs = dv.pages('"Coffee Logs"')
      .where(p =>
        p.type === "coffee-log" &&
        p.date >= monthStart.toISOString().split('T')[0] &&
        p.date <= monthEnd.toISOString().split('T')[0]
      )
      .array();

    if (logs.length === 0) {
      return {
        error: "No coffee logs found for this month",
        month: monthString,
        totalSessions: 0
      };
    }

    // Extract data arrays
    const ratings = logs.map(l => l.rating).filter(r => r != null);
    const doses = logs.map(l => l.dose).filter(d => d != null);
    const brewTimes = logs.map(l => l["brew-time"]).filter(t => t != null);
    const brewMethods = logs.map(l => l["brew-method"]).filter(m => m);
    const beans = logs.map(l => l.beans).filter(b => b);
    const origins = logs.map(l => l.origin).filter(o => o);
    const roasters = logs.map(l => l.roaster).filter(r => r);
    const grindSizes = logs.map(l => l["grind-size"]).filter(g => g);
    const waterTemps = logs.map(l => l["water-temp"]).filter(t => t != null);

    // Build comprehensive report
    const report = {
      // Basic information
      month: monthString,
      monthStart: monthStart.toISOString().split('T')[0],
      monthEnd: monthEnd.toISOString().split('T')[0],
      totalSessions: logs.length,
      daysActive: countActiveDays(logs),
      averageSessionsPerDay: logs.length / getDaysInMonth(monthStart),

      // Rating statistics
      ratings: {
        average: stats.mean(ratings),
        median: stats.median(ratings),
        mode: stats.mode(ratings),
        min: Math.min(...ratings),
        max: Math.max(...ratings),
        std: stats.standardDeviation(ratings),
        variance: stats.variance(ratings),
        consistency: stats.consistencyScore(ratings),
        quartiles: stats.quartiles(ratings),
        distribution: stats.histogram(ratings, 5)
      },

      // Dose statistics
      doses: {
        average: stats.mean(doses),
        median: stats.median(doses),
        total: doses.reduce((sum, d) => sum + d, 0),
        min: Math.min(...doses),
        max: Math.max(...doses),
        std: stats.standardDeviation(doses),
        estimatedCost: estimateMonthlyCost(doses, dv)
      },

      // Brew time analysis
      brewTimes: {
        average: stats.mean(brewTimes),
        median: stats.median(brewTimes),
        min: Math.min(...brewTimes),
        max: Math.max(...brewTimes)
      },

      // Water temperature analysis
      waterTemps: waterTemps.length > 0 ? {
        average: stats.mean(waterTemps),
        median: stats.median(waterTemps),
        min: Math.min(...waterTemps),
        max: Math.max(...waterTemps)
      } : null,

      // Frequency analysis
      topBrewMethods: stats.topN(brewMethods, 5),
      topBeans: stats.topN(beans, 10),
      topOrigins: stats.topN(origins, 5),
      topRoasters: stats.topN(roasters, 5),
      topGrindSizes: stats.topN(grindSizes, 5),

      // Best and worst sessions
      bestSessions: getBestSessions(logs, 5),
      worstSessions: getWorstSessions(logs, 3),

      // Weekly breakdown
      weeklyBreakdown: getWeeklyBreakdown(logs, monthStart),

      // Correlation analysis
      correlations: calculateCorrelations(logs),

      // Trends over the month
      trends: calculateMonthlyTrends(logs),

      // Month-over-month comparison
      momComparison: await compareWithPreviousMonth(dv, logs, monthString),

      // Year-over-year comparison
      yoyComparison: await compareWithPreviousYear(dv, logs, monthString),

      // Insights and patterns
      insights: generateInsights(logs, ratings, doses, brewMethods)
    };

    // Generate personalized recommendations
    report.recommendations = generateRecommendations(report);

    // Calculate quality metrics
    report.qualityMetrics = calculateQualityMetrics(report);

    return report;

  } catch (error) {
    console.error("Error generating monthly report:", error);
    return {
      error: error.message,
      month: monthString
    };
  }
}

// ============================================
// ANALYSIS FUNCTIONS
// ============================================

/**
 * Count number of days with at least one brewing session
 * @param {Array} logs - Coffee log entries
 * @returns {number} Number of active days
 */
function countActiveDays(logs) {
  const uniqueDates = new Set(logs.map(l => l.date));
  return uniqueDates.size;
}

/**
 * Get number of days in a month
 * @param {Date} date - Any date in the month
 * @returns {number} Days in month
 */
function getDaysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

/**
 * Get best brewing sessions
 * @param {Array} logs - Coffee log entries
 * @param {number} count - Number of sessions to return
 * @returns {Array} Top rated sessions
 */
function getBestSessions(logs, count = 5) {
  return logs
    .filter(l => l.rating != null)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, count)
    .map(l => ({
      date: l.date,
      beans: l.beans,
      rating: l.rating,
      method: l["brew-method"],
      dose: l.dose,
      grindSize: l["grind-size"],
      notes: l.notes
    }));
}

/**
 * Get worst brewing sessions
 * @param {Array} logs - Coffee log entries
 * @param {number} count - Number of sessions to return
 * @returns {Array} Lowest rated sessions
 */
function getWorstSessions(logs, count = 3) {
  return logs
    .filter(l => l.rating != null)
    .sort((a, b) => (a.rating || 0) - (b.rating || 0))
    .slice(0, count)
    .map(l => ({
      date: l.date,
      beans: l.beans,
      rating: l.rating,
      method: l["brew-method"],
      issue: l.notes || "No notes provided"
    }));
}

/**
 * Break down sessions by week
 * @param {Array} logs - Coffee log entries
 * @param {Date} monthStart - First day of month
 * @returns {Array} Weekly statistics
 */
function getWeeklyBreakdown(logs, monthStart) {
  const weeks = [];
  let weekNum = 1;
  let currentWeekStart = new Date(monthStart);

  while (currentWeekStart.getMonth() === monthStart.getMonth()) {
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const weekLogs = logs.filter(l => {
      const logDate = new Date(l.date);
      return logDate >= currentWeekStart && logDate <= weekEnd;
    });

    if (weekLogs.length > 0) {
      const ratings = weekLogs.map(l => l.rating).filter(r => r != null);
      weeks.push({
        week: weekNum,
        startDate: currentWeekStart.toISOString().split('T')[0],
        endDate: weekEnd.toISOString().split('T')[0],
        sessions: weekLogs.length,
        averageRating: stats.mean(ratings),
        consistency: stats.consistencyScore(ratings)
      });
    }

    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    weekNum++;
  }

  return weeks;
}

/**
 * Calculate correlations between brewing parameters
 * @param {Array} logs - Coffee log entries
 * @returns {Object} Correlation matrix
 */
function calculateCorrelations(logs) {
  const validLogs = logs.filter(l =>
    l.rating != null && l.dose != null && l["brew-time"] != null
  );

  if (validLogs.length < 5) {
    return { available: false, reason: "Insufficient data for correlation analysis" };
  }

  const data = {
    rating: validLogs.map(l => l.rating),
    dose: validLogs.map(l => l.dose),
    brewTime: validLogs.map(l => l["brew-time"])
  };

  // Add water temp if available
  const withTemp = validLogs.filter(l => l["water-temp"] != null);
  if (withTemp.length >= 5) {
    data.waterTemp = withTemp.map(l => l["water-temp"]);
  }

  const matrix = stats.correlationMatrix(data);

  // Interpret key correlations
  const interpretations = {};
  if (matrix.rating) {
    interpretations.doseVsRating = {
      correlation: matrix.rating.dose,
      interpretation: stats.interpretCorrelation(matrix.rating.dose)
    };
    interpretations.brewTimeVsRating = {
      correlation: matrix.rating.brewTime,
      interpretation: stats.interpretCorrelation(matrix.rating.brewTime)
    };
    if (data.waterTemp) {
      interpretations.waterTempVsRating = {
        correlation: matrix.rating.waterTemp,
        interpretation: stats.interpretCorrelation(matrix.rating.waterTemp)
      };
    }
  }

  return {
    available: true,
    matrix,
    interpretations,
    sampleSize: validLogs.length
  };
}

/**
 * Calculate trends over the month
 * @param {Array} logs - Coffee log entries
 * @returns {Object} Trend analysis
 */
function calculateMonthlyTrends(logs) {
  const sortedLogs = logs.sort((a, b) => a.date.localeCompare(b.date));
  const ratings = sortedLogs.map(l => l.rating).filter(r => r != null);

  if (ratings.length < 3) {
    return { available: false, reason: "Insufficient data for trend analysis" };
  }

  const indices = ratings.map((_, i) => i);
  const regression = stats.linearRegression(indices, ratings);
  const trend = stats.detectTrend(ratings);
  const movingAvg = stats.movingAverage(ratings, 5);

  return {
    available: true,
    direction: trend.direction,
    strength: trend.strength,
    slope: regression.slope,
    rSquared: regression.rSquared,
    interpretation: trend.interpretation,
    movingAverage: movingAvg,
    startRating: ratings[0],
    endRating: ratings[ratings.length - 1],
    totalChange: ratings[ratings.length - 1] - ratings[0]
  };
}

/**
 * Compare with previous month
 * @param {Object} dv - Dataview API instance
 * @param {Array} currentLogs - Current month logs
 * @param {string} monthString - Current month (YYYY-MM)
 * @returns {Promise<Object>} Month-over-month comparison
 */
async function compareWithPreviousMonth(dv, currentLogs, monthString) {
  try {
    const [year, month] = monthString.split('-').map(Number);
    const prevDate = new Date(year, month - 2, 1); // month - 2 because months are 0-indexed
    const prevMonthString = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

    const { monthStart, monthEnd } = getMonthDates(prevMonthString);

    const prevLogs = dv.pages('"Coffee Logs"')
      .where(p =>
        p.type === "coffee-log" &&
        p.date >= monthStart.toISOString().split('T')[0] &&
        p.date <= monthEnd.toISOString().split('T')[0]
      )
      .array();

    if (prevLogs.length === 0) {
      return { available: false, reason: "No data for previous month" };
    }

    const currentRatings = currentLogs.map(l => l.rating).filter(r => r != null);
    const prevRatings = prevLogs.map(l => l.rating).filter(r => r != null);
    const currentDoses = currentLogs.map(l => l.dose).filter(d => d != null);
    const prevDoses = prevLogs.map(l => l.dose).filter(d => d != null);

    const comparison = stats.compareGroups(currentRatings, prevRatings);

    return {
      available: true,
      previousMonth: prevMonthString,
      sessionChange: currentLogs.length - prevLogs.length,
      sessionChangePercent: ((currentLogs.length - prevLogs.length) / prevLogs.length) * 100,
      ratingChange: comparison.difference,
      ratingChangePercent: comparison.percentDifference,
      effectSize: comparison.effectSize,
      significant: comparison.significant,
      consistency: {
        current: stats.consistencyScore(currentRatings),
        previous: stats.consistencyScore(prevRatings),
        change: stats.consistencyScore(currentRatings) - stats.consistencyScore(prevRatings)
      },
      doseChange: {
        average: stats.mean(currentDoses) - stats.mean(prevDoses),
        total: currentDoses.reduce((a, b) => a + b, 0) - prevDoses.reduce((a, b) => a + b, 0)
      }
    };
  } catch (error) {
    console.error("Error in MoM comparison:", error);
    return { available: false, reason: error.message };
  }
}

/**
 * Compare with same month previous year
 * @param {Object} dv - Dataview API instance
 * @param {Array} currentLogs - Current month logs
 * @param {string} monthString - Current month (YYYY-MM)
 * @returns {Promise<Object>} Year-over-year comparison
 */
async function compareWithPreviousYear(dv, currentLogs, monthString) {
  try {
    const [year, month] = monthString.split('-').map(Number);
    const prevYearString = `${year - 1}-${String(month).padStart(2, '0')}`;

    const { monthStart, monthEnd } = getMonthDates(prevYearString);

    const prevYearLogs = dv.pages('"Coffee Logs"')
      .where(p =>
        p.type === "coffee-log" &&
        p.date >= monthStart.toISOString().split('T')[0] &&
        p.date <= monthEnd.toISOString().split('T')[0]
      )
      .array();

    if (prevYearLogs.length === 0) {
      return { available: false, reason: "No data for same month last year" };
    }

    const currentRatings = currentLogs.map(l => l.rating).filter(r => r != null);
    const prevRatings = prevYearLogs.map(l => l.rating).filter(r => r != null);

    const comparison = stats.compareGroups(currentRatings, prevRatings);

    return {
      available: true,
      previousYear: prevYearString,
      sessionChange: currentLogs.length - prevYearLogs.length,
      ratingChange: comparison.difference,
      improvement: comparison.difference > 0,
      yearlyProgress: comparison.interpretation
    };
  } catch (error) {
    return { available: false, reason: error.message };
  }
}

/**
 * Generate insights from data patterns
 * @param {Array} logs - Coffee log entries
 * @param {Array} ratings - Rating values
 * @param {Array} doses - Dose values
 * @param {Array} brewMethods - Brew method values
 * @returns {Array} Array of insights
 */
function generateInsights(logs, ratings, doses, brewMethods) {
  const insights = [];

  // Rating distribution insight
  const { q1, q3 } = stats.quartiles(ratings);
  if (q3 - q1 < 0.5) {
    insights.push({
      category: "consistency",
      message: "Excellent consistency! Your ratings are very tightly clustered.",
      impact: "positive"
    });
  }

  // Method performance insight
  const methodPerformance = {};
  logs.forEach(log => {
    const method = log["brew-method"];
    if (method && log.rating != null) {
      if (!methodPerformance[method]) {
        methodPerformance[method] = [];
      }
      methodPerformance[method].push(log.rating);
    }
  });

  let bestMethod = null;
  let bestAvg = 0;
  for (const [method, methodRatings] of Object.entries(methodPerformance)) {
    const avg = stats.mean(methodRatings);
    if (avg > bestAvg && methodRatings.length >= 3) {
      bestAvg = avg;
      bestMethod = method;
    }
  }

  if (bestMethod) {
    insights.push({
      category: "method",
      message: `Your ${bestMethod} brews average ${bestAvg.toFixed(2)}/5.0 - your best performing method!`,
      impact: "positive"
    });
  }

  // Dose consistency insight
  const doseCV = stats.coefficientOfVariation(doses);
  if (doseCV < 5) {
    insights.push({
      category: "precision",
      message: "Your dosing is highly consistent (CV < 5%), showing excellent technique.",
      impact: "positive"
    });
  } else if (doseCV > 15) {
    insights.push({
      category: "precision",
      message: "Dose variation is high. Consider weighing more carefully for consistency.",
      impact: "negative"
    });
  }

  // Weekend vs weekday insight
  const weekendLogs = logs.filter(l => {
    const date = new Date(l.date);
    const day = date.getDay();
    return day === 0 || day === 6;
  });
  const weekdayLogs = logs.filter(l => {
    const date = new Date(l.date);
    const day = date.getDay();
    return day >= 1 && day <= 5;
  });

  if (weekendLogs.length >= 3 && weekdayLogs.length >= 3) {
    const weekendRatings = weekendLogs.map(l => l.rating).filter(r => r != null);
    const weekdayRatings = weekdayLogs.map(l => l.rating).filter(r => r != null);
    const weekendAvg = stats.mean(weekendRatings);
    const weekdayAvg = stats.mean(weekdayRatings);

    if (Math.abs(weekendAvg - weekdayAvg) > 0.3) {
      const better = weekendAvg > weekdayAvg ? "weekend" : "weekday";
      insights.push({
        category: "timing",
        message: `Your ${better} brews score ${Math.abs(weekendAvg - weekdayAvg).toFixed(2)} points higher on average.`,
        impact: "neutral"
      });
    }
  }

  return insights;
}

/**
 * Estimate monthly coffee cost
 * @param {Array} doses - Dose values in grams
 * @param {Object} dv - Dataview API instance
 * @returns {number} Estimated cost
 */
function estimateMonthlyCost(doses, dv) {
  const totalGrams = doses.reduce((sum, d) => sum + d, 0);
  // Estimate average cost at $0.70 per 18g dose (~$22 per 12oz bag)
  const estimatedCostPerGram = 0.70 / 18;
  return totalGrams * estimatedCostPerGram;
}

/**
 * Calculate quality metrics score
 * @param {Object} report - Generated report
 * @returns {Object} Quality metrics
 */
function calculateQualityMetrics(report) {
  const metrics = {
    overall: 0,
    components: {}
  };

  // Rating quality (40% weight)
  const ratingScore = (report.ratings.average / 5) * 100;
  metrics.components.rating = ratingScore;

  // Consistency (30% weight)
  metrics.components.consistency = report.ratings.consistency;

  // Engagement (20% weight)
  const engagementScore = Math.min(100, (report.totalSessions / 30) * 100);
  metrics.components.engagement = engagementScore;

  // Data completeness (10% weight)
  const completenessScore = (report.totalSessions > 0 ? 100 : 0);
  metrics.components.completeness = completenessScore;

  // Calculate weighted overall score
  metrics.overall = (
    ratingScore * 0.4 +
    metrics.components.consistency * 0.3 +
    engagementScore * 0.2 +
    completenessScore * 0.1
  );

  metrics.grade =
    metrics.overall >= 90 ? 'A+' :
    metrics.overall >= 85 ? 'A' :
    metrics.overall >= 80 ? 'B+' :
    metrics.overall >= 75 ? 'B' :
    metrics.overall >= 70 ? 'C+' :
    metrics.overall >= 65 ? 'C' : 'D';

  return metrics;
}

// ============================================
// RECOMMENDATIONS
// ============================================

/**
 * Generate personalized recommendations
 * @param {Object} report - Generated report
 * @returns {Array} Recommendations
 */
function generateRecommendations(report) {
  const recs = [];

  // Performance recommendations
  if (report.ratings.average < 3.5) {
    recs.push({
      type: "improvement",
      priority: "high",
      message: "Average rating is below 3.5. Review your brewing fundamentals and consider experimenting with grind size and water temperature."
    });
  } else if (report.ratings.average >= 4.3) {
    recs.push({
      type: "excellence",
      priority: "low",
      message: `Outstanding month! Average rating of ${report.ratings.average.toFixed(2)}/5.0 shows mastery.`
    });
  }

  // Consistency recommendations
  if (report.ratings.consistency < 65) {
    recs.push({
      type: "consistency",
      priority: "high",
      message: `Consistency is at ${report.ratings.consistency.toFixed(1)}%. Focus on standardizing your process: use a timer, measure precisely, and keep water temperature constant.`
    });
  } else if (report.ratings.consistency >= 85) {
    recs.push({
      type: "excellence",
      priority: "low",
      message: `Excellent consistency score of ${report.ratings.consistency.toFixed(1)}%!`
    });
  }

  // Variety recommendations
  if (report.topBeans.length <= 2 && report.totalSessions > 15) {
    recs.push({
      type: "variety",
      priority: "medium",
      message: "Limited bean variety this month. Explore different origins and roasters to expand your palate."
    });
  }

  // Method recommendations
  if (report.topBrewMethods.length === 1 && report.totalSessions > 10) {
    recs.push({
      type: "exploration",
      priority: "low",
      message: `You exclusively used ${report.topBrewMethods[0].value}. Try experimenting with different brew methods.`
    });
  }

  // Trend-based recommendations
  if (report.trends.available) {
    if (report.trends.direction === "declining" && report.trends.strength > 0.5) {
      recs.push({
        type: "alert",
        priority: "high",
        message: `Strong declining trend detected (slope: ${report.trends.slope.toFixed(3)}). Review recent parameter changes.`
      });
    } else if (report.trends.direction === "improving" && report.trends.strength > 0.5) {
      recs.push({
        type: "celebration",
        priority: "low",
        message: "Strong improvement trend! Whatever you changed is working."
      });
    }
  }

  // MoM comparison recommendations
  if (report.momComparison.available) {
    if (report.momComparison.significant && report.momComparison.ratingChange < -0.5) {
      recs.push({
        type: "alert",
        priority: "high",
        message: `Ratings dropped significantly from last month (${Math.abs(report.momComparison.ratingChange).toFixed(2)} points). Consider what changed.`
      });
    } else if (report.momComparison.ratingChange > 0.5) {
      recs.push({
        type: "progress",
        priority: "medium",
        message: `Great progress! Ratings improved by ${report.momComparison.ratingChange.toFixed(2)} points from last month.`
      });
    }
  }

  // Correlation insights
  if (report.correlations.available) {
    const interp = report.correlations.interpretations;
    if (interp.doseVsRating && Math.abs(interp.doseVsRating.correlation) > 0.5) {
      recs.push({
        type: "insight",
        priority: "medium",
        message: `Dose shows ${interp.doseVsRating.interpretation} correlation with rating. Pay attention to your dosing.`
      });
    }
  }

  // Engagement recommendations
  if (report.totalSessions < 10) {
    recs.push({
      type: "engagement",
      priority: "low",
      message: "Low session count this month. More data helps identify patterns and improve consistency."
    });
  }

  return recs;
}

// ============================================
// FORMATTING
// ============================================

/**
 * Format report as comprehensive Markdown
 * @param {Object} report - Generated report
 * @returns {string} Formatted Markdown
 */
function formatAsMarkdown(report) {
  if (report.error) {
    return `# Monthly Report Error\n\n${report.error}`;
  }

  let md = `# ☕ Monthly Coffee Report\n\n`;
  md += `**Month**: ${report.month}\n`;
  md += `**Period**: ${report.monthStart} to ${report.monthEnd}\n`;
  md += `**Quality Grade**: ${report.qualityMetrics.grade} (${report.qualityMetrics.overall.toFixed(1)}/100)\n\n`;

  md += `---\n\n`;

  // Overview section
  md += `## 📊 Overview\n\n`;
  md += `- **Total Sessions**: ${report.totalSessions}\n`;
  md += `- **Active Days**: ${report.daysActive} / ${getDaysInMonth(new Date(report.monthStart))}\n`;
  md += `- **Avg Sessions/Day**: ${report.averageSessionsPerDay.toFixed(2)}\n`;
  md += `- **Total Coffee Used**: ${report.doses.total.toFixed(0)}g (~${(report.doses.total / 28.35).toFixed(1)} oz)\n`;
  md += `- **Estimated Cost**: $${report.doses.estimatedCost.toFixed(2)}\n\n`;

  // Performance metrics
  md += `---\n\n`;
  md += `## ⭐ Performance Metrics\n\n`;
  md += `### Ratings\n`;
  md += `- **Average**: ${report.ratings.average.toFixed(2)} / 5.0\n`;
  md += `- **Median**: ${report.ratings.median.toFixed(2)}\n`;
  md += `- **Mode**: ${report.ratings.mode}\n`;
  md += `- **Range**: ${report.ratings.min} - ${report.ratings.max}\n`;
  md += `- **Std Dev**: ${report.ratings.std.toFixed(3)}\n`;
  md += `- **Consistency Score**: ${report.ratings.consistency.toFixed(1)}%\n`;
  md += `- **Quartiles**: Q1=${report.ratings.quartiles.q1.toFixed(2)}, Q2=${report.ratings.quartiles.q2.toFixed(2)}, Q3=${report.ratings.quartiles.q3.toFixed(2)}\n\n`;

  md += `### Brewing Parameters\n`;
  md += `- **Avg Dose**: ${report.doses.average.toFixed(1)}g\n`;
  md += `- **Dose Range**: ${report.doses.min}g - ${report.doses.max}g\n`;
  md += `- **Avg Brew Time**: ${report.brewTimes.average.toFixed(1)} min\n`;
  if (report.waterTemps) {
    md += `- **Avg Water Temp**: ${report.waterTemps.average.toFixed(1)}°F\n`;
  }
  md += `\n`;

  // Top performers
  md += `---\n\n`;
  md += `## 🏆 Top Performers\n\n`;

  md += `### Brew Methods\n`;
  report.topBrewMethods.forEach((method, i) => {
    md += `${i + 1}. **${method.value}** - ${method.count} sessions\n`;
  });

  md += `\n### Favorite Beans\n`;
  report.topBeans.slice(0, 5).forEach((bean, i) => {
    md += `${i + 1}. ${bean.value} - ${bean.count}x\n`;
  });

  md += `\n### Top Origins\n`;
  report.topOrigins.forEach((origin, i) => {
    md += `${i + 1}. ${origin.value} - ${origin.count} brews\n`;
  });

  md += `\n`;

  // Best and worst sessions
  md += `---\n\n`;
  md += `## 🌟 Best Sessions\n\n`;
  report.bestSessions.forEach((session, i) => {
    md += `${i + 1}. **${session.beans}** - ${session.rating}/5.0\n`;
    md += `   - Date: ${session.date}\n`;
    md += `   - Method: ${session.method}\n`;
    md += `   - Dose: ${session.dose}g\n\n`;
  });

  md += `## ⚠️ Sessions to Review\n\n`;
  report.worstSessions.forEach((session, i) => {
    md += `${i + 1}. **${session.beans}** - ${session.rating}/5.0 (${session.date})\n`;
    md += `   - Issue: ${session.issue}\n\n`;
  });

  // Weekly breakdown
  if (report.weeklyBreakdown.length > 0) {
    md += `---\n\n`;
    md += `## 📅 Weekly Breakdown\n\n`;
    md += `| Week | Sessions | Avg Rating | Consistency |\n`;
    md += `|------|----------|------------|-------------|\n`;
    report.weeklyBreakdown.forEach(week => {
      md += `| ${week.week} | ${week.sessions} | ${week.averageRating.toFixed(2)} | ${week.consistency.toFixed(1)}% |\n`;
    });
    md += `\n`;
  }

  // Trends
  if (report.trends.available) {
    md += `---\n\n`;
    md += `## 📈 Trends\n\n`;
    const trendIcon = report.trends.direction === 'increasing' ? '↑' :
                      report.trends.direction === 'decreasing' ? '↓' : '→';
    md += `- **Direction**: ${trendIcon} ${report.trends.direction}\n`;
    md += `- **Strength**: ${(report.trends.strength * 100).toFixed(1)}% (R² = ${report.trends.rSquared.toFixed(3)})\n`;
    md += `- **Interpretation**: ${report.trends.interpretation}\n`;
    md += `- **Total Change**: ${report.trends.totalChange >= 0 ? '+' : ''}${report.trends.totalChange.toFixed(2)} points\n`;
    md += `- **Slope**: ${report.trends.slope.toFixed(4)} points/session\n\n`;
  }

  // Correlations
  if (report.correlations.available) {
    md += `---\n\n`;
    md += `## 🔗 Correlation Analysis\n\n`;
    const interp = report.correlations.interpretations;
    if (interp.doseVsRating) {
      md += `- **Dose vs Rating**: ${interp.doseVsRating.correlation.toFixed(3)} (${interp.doseVsRating.interpretation})\n`;
    }
    if (interp.brewTimeVsRating) {
      md += `- **Brew Time vs Rating**: ${interp.brewTimeVsRating.correlation.toFixed(3)} (${interp.brewTimeVsRating.interpretation})\n`;
    }
    if (interp.waterTempVsRating) {
      md += `- **Water Temp vs Rating**: ${interp.waterTempVsRating.correlation.toFixed(3)} (${interp.waterTempVsRating.interpretation})\n`;
    }
    md += `\n*Sample size: ${report.correlations.sampleSize} sessions*\n\n`;
  }

  // Month-over-month comparison
  if (report.momComparison.available) {
    md += `---\n\n`;
    md += `## 📊 Month-over-Month Comparison\n\n`;
    md += `Comparing to ${report.momComparison.previousMonth}:\n\n`;
    md += `- **Sessions**: ${report.momComparison.sessionChange >= 0 ? '+' : ''}${report.momComparison.sessionChange} (${report.momComparison.sessionChangePercent >= 0 ? '+' : ''}${report.momComparison.sessionChangePercent.toFixed(1)}%)\n`;
    md += `- **Avg Rating**: ${report.momComparison.ratingChange >= 0 ? '+' : ''}${report.momComparison.ratingChange.toFixed(2)} points\n`;
    md += `- **Consistency**: ${report.momComparison.consistency.change >= 0 ? '+' : ''}${report.momComparison.consistency.change.toFixed(1)}%\n`;
    md += `- **Statistical Significance**: ${report.momComparison.significant ? 'Yes' : 'No'} (effect size: ${report.momComparison.effectSize.toFixed(2)})\n\n`;
  }

  // Year-over-year comparison
  if (report.yoyComparison.available) {
    md += `---\n\n`;
    md += `## 📆 Year-over-Year Comparison\n\n`;
    md += `Comparing to ${report.yoyComparison.previousYear}:\n\n`;
    md += `- **Sessions**: ${report.yoyComparison.sessionChange >= 0 ? '+' : ''}${report.yoyComparison.sessionChange}\n`;
    md += `- **Rating Change**: ${report.yoyComparison.ratingChange >= 0 ? '+' : ''}${report.yoyComparison.ratingChange.toFixed(2)}\n`;
    md += `- **Yearly Progress**: ${report.yoyComparison.yearlyProgress}\n\n`;
  }

  // Insights
  if (report.insights.length > 0) {
    md += `---\n\n`;
    md += `## 💡 Insights\n\n`;
    report.insights.forEach(insight => {
      const icon = insight.impact === 'positive' ? '✅' :
                   insight.impact === 'negative' ? '⚠️' : 'ℹ️';
      md += `${icon} **${insight.category.toUpperCase()}**: ${insight.message}\n\n`;
    });
  }

  // Recommendations
  md += `---\n\n`;
  md += `## 🎯 Recommendations\n\n`;
  report.recommendations.forEach(rec => {
    const icon = rec.priority === 'high' ? '🔴' :
                 rec.priority === 'medium' ? '🟡' : '🟢';
    md += `${icon} **${rec.type.toUpperCase()}**: ${rec.message}\n\n`;
  });

  md += `---\n\n`;
  md += `*Report generated on ${new Date().toISOString().split('T')[0]}*\n`;

  return md;
}

/**
 * Format report as JSON
 * @param {Object} report - Generated report
 * @returns {string} JSON string
 */
function formatAsJSON(report) {
  return JSON.stringify(report, null, 2);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get month start and end dates
 * @param {string} monthString - Month in YYYY-MM format
 * @returns {Object} {monthStart, monthEnd} Date objects
 */
function getMonthDates(monthString) {
  const [year, month] = monthString.split('-').map(Number);

  const monthStart = new Date(year, month - 1, 1);
  monthStart.setHours(0, 0, 0, 0);

  const monthEnd = new Date(year, month, 0);
  monthEnd.setHours(23, 59, 59, 999);

  return { monthStart, monthEnd };
}

/**
 * Get current month string
 * @returns {string} Current month in YYYY-MM format
 */
function getCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
  generateMonthlyReport,
  formatAsMarkdown,
  formatAsJSON,
  getMonthDates,
  getCurrentMonth,
  calculateCorrelations,
  calculateMonthlyTrends,
  generateRecommendations,
  generateInsights
};
