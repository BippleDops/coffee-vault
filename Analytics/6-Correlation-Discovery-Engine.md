---
title: Correlation Discovery Engine
type: analytics-dashboard
category: ml-correlation
created: 2025-10-26
tags: [analytics, ml, correlation, relationships, discovery]
---

# Correlation Discovery Engine

> Auto-detect parameter relationships and hidden patterns using statistical analysis

## Parameter Correlation Matrix

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.rating && p["water-temp"] && p["brew-time"])
  .array();

if (allLogs.length < 10) {
  dv.paragraph("📊 Need at least 10 complete logs to perform correlation analysis.");
} else {
  // Calculate Pearson correlation coefficient
  const calculateCorrelation = (x, y) => {
    if (x.length !== y.length || x.length === 0) return 0;

    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  };

  // Extract parameters
  const grindSizeMap = {
    'extra-fine': 1, 'fine': 2, 'medium-fine': 3, 'medium': 4,
    'medium-coarse': 5, 'coarse': 6, 'extra-coarse': 7
  };

  const parseRatio = (ratioStr) => {
    if (!ratioStr) return 16;
    const parts = String(ratioStr).split(':');
    return parts.length === 2 ? parseFloat(parts[1]) || 16 : 16;
  };

  const ratings = allLogs.map(p => p.rating || 0);
  const temps = allLogs.map(p => parseFloat(p["water-temp"]) || 200);
  const times = allLogs.map(p => parseFloat(p["brew-time"]) || 3);
  const grinds = allLogs.map(p => grindSizeMap[p["grind-size"]] || 4);
  const ratios = allLogs.map(p => parseRatio(p.ratio));

  // Calculate all correlations with rating
  const correlations = {
    "Water Temp": calculateCorrelation(temps, ratings),
    "Brew Time": calculateCorrelation(times, ratings),
    "Grind Size": calculateCorrelation(grinds, ratings),
    "Coffee:Water Ratio": calculateCorrelation(ratios, ratings)
  };

  // Parameter-to-parameter correlations
  const crossCorrelations = {
    "Temp ↔ Time": calculateCorrelation(temps, times),
    "Temp ↔ Grind": calculateCorrelation(temps, grinds),
    "Temp ↔ Ratio": calculateCorrelation(temps, ratios),
    "Time ↔ Grind": calculateCorrelation(times, grinds),
    "Time ↔ Ratio": calculateCorrelation(times, ratios),
    "Grind ↔ Ratio": calculateCorrelation(grinds, ratios)
  };

  dv.header(3, "🔗 Parameter-to-Quality Correlations");
  dv.table(
    ["Parameter", "Correlation", "Strength", "Relationship", "Actionable Insight"],
    Object.entries(correlations)
      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
      .map(([param, corr]) => {
        const strength = Math.abs(corr) > 0.7 ? "Very Strong" :
                        Math.abs(corr) > 0.5 ? "Strong" :
                        Math.abs(corr) > 0.3 ? "Moderate" :
                        Math.abs(corr) > 0.1 ? "Weak" : "Very Weak";

        const relationship = corr > 0 ? "Positive ↗" : corr < 0 ? "Negative ↘" : "None —";

        const insight = Math.abs(corr) > 0.3 ?
          (corr > 0 ? `Increasing ${param} improves quality` :
                      `Decreasing ${param} improves quality`) :
          `${param} has minimal impact`;

        return [
          param,
          Math.round(corr * 100) / 100,
          strength,
          relationship,
          insight
        ];
      })
  );

  dv.header(3, "🔀 Inter-Parameter Relationships");
  dv.table(
    ["Parameter Pair", "Correlation", "Strength", "Interpretation"],
    Object.entries(crossCorrelations)
      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
      .map(([pair, corr]) => {
        const strength = Math.abs(corr) > 0.7 ? "Very Strong" :
                        Math.abs(corr) > 0.5 ? "Strong" :
                        Math.abs(corr) > 0.3 ? "Moderate" :
                        Math.abs(corr) > 0.1 ? "Weak" : "Very Weak";

        const interpretation = Math.abs(corr) > 0.5 ?
          (corr > 0 ? "These parameters tend to change together" :
                      "When one increases, the other tends to decrease") :
          "These parameters are largely independent";

        return [
          pair,
          Math.round(corr * 100) / 100,
          strength,
          interpretation
        ];
      })
  );

  dv.paragraph(`
**Correlation Scale**:
- **+0.7 to +1.0**: Very strong positive relationship
- **+0.5 to +0.7**: Strong positive relationship
- **+0.3 to +0.5**: Moderate positive relationship
- **-0.3 to +0.3**: Weak or no relationship
- **-0.5 to -0.3**: Moderate negative relationship
- **-0.7 to -0.5**: Strong negative relationship
- **-1.0 to -0.7**: Very strong negative relationship
  `);
}
```

## Discovered Patterns & Insights

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.rating)
  .array();

if (allLogs.length >= 10) {
  dv.header(3, "🔍 Auto-Discovered Patterns");

  const patterns = [];

  // Pattern 1: Temperature sweet spot
  const temps = allLogs.filter(p => p["water-temp"]).map(p => ({
    temp: parseFloat(p["water-temp"]),
    rating: p.rating
  }));

  if (temps.length >= 5) {
    const highRatedTemps = temps.filter(t => t.rating >= 4.0);
    if (highRatedTemps.length >= 3) {
      const avgOptimalTemp = Math.round(
        highRatedTemps.reduce((sum, t) => sum + t.temp, 0) / highRatedTemps.length
      );
      const tempRange = {
        min: Math.min(...highRatedTemps.map(t => t.temp)),
        max: Math.max(...highRatedTemps.map(t => t.temp))
      };

      patterns.push({
        pattern: "Temperature Sweet Spot",
        finding: `Optimal range: ${Math.round(tempRange.min)}°F - ${Math.round(tempRange.max)}°F`,
        confidence: highRatedTemps.length >= 10 ? "High" : highRatedTemps.length >= 5 ? "Medium" : "Low",
        recommendation: `Target ${avgOptimalTemp}°F for best results`
      });
    }
  }

  // Pattern 2: Brew time correlation with method
  const methodTimes = {};
  allLogs.forEach(log => {
    if (log["brew-method"] && log["brew-time"] && log.rating >= 4.0) {
      const method = log["brew-method"];
      if (!methodTimes[method]) methodTimes[method] = [];
      methodTimes[method].push(parseFloat(log["brew-time"]));
    }
  });

  Object.entries(methodTimes).forEach(([method, times]) => {
    if (times.length >= 3) {
      const avgTime = Math.round((times.reduce((a, b) => a + b, 0) / times.length) * 10) / 10;
      patterns.push({
        pattern: `${method} Optimal Time`,
        finding: `Best results at ${avgTime} minutes`,
        confidence: times.length >= 7 ? "High" : times.length >= 4 ? "Medium" : "Low",
        recommendation: `Use ${avgTime}min for ${method}`
      });
    }
  });

  // Pattern 3: Bean freshness (if dates available)
  const logsWithDates = allLogs.filter(p => p.date);
  if (logsWithDates.length >= 20) {
    const recentLogs = logsWithDates
      .sort((a, b) => b.date - a.date)
      .slice(0, 10);

    const recentAvg = recentLogs.reduce((sum, p) => sum + p.rating, 0) / recentLogs.length;

    const olderLogs = logsWithDates
      .sort((a, b) => b.date - a.date)
      .slice(10, 20);

    const olderAvg = olderLogs.reduce((sum, p) => sum + p.rating, 0) / olderLogs.length;

    const improvement = recentAvg - olderAvg;

    if (Math.abs(improvement) > 0.3) {
      patterns.push({
        pattern: "Skill Progression",
        finding: improvement > 0 ?
          `Quality improved by ${Math.round(improvement * 10) / 10} stars recently` :
          `Quality declined by ${Math.round(Math.abs(improvement) * 10) / 10} stars recently`,
        confidence: "High",
        recommendation: improvement > 0 ?
          "Keep your current approach - you're improving!" :
          "Review recent changes - something shifted"
      });
    }
  }

  // Pattern 4: Grind size patterns
  const grindSizeMap = {
    'extra-fine': 1, 'fine': 2, 'medium-fine': 3, 'medium': 4,
    'medium-coarse': 5, 'coarse': 6, 'extra-coarse': 7
  };

  const grindStats = {};
  allLogs.forEach(log => {
    if (log["grind-size"] && log.rating >= 4.0) {
      const grind = log["grind-size"];
      if (!grindStats[grind]) grindStats[grind] = { count: 0, totalRating: 0 };
      grindStats[grind].count++;
      grindStats[grind].totalRating += log.rating;
    }
  });

  const topGrind = Object.entries(grindStats)
    .sort((a, b) => (b[1].totalRating / b[1].count) - (a[1].totalRating / a[1].count))[0];

  if (topGrind && topGrind[1].count >= 3) {
    patterns.push({
      pattern: "Optimal Grind Size",
      finding: `${topGrind[0]} yields best results`,
      confidence: topGrind[1].count >= 7 ? "High" : topGrind[1].count >= 4 ? "Medium" : "Low",
      recommendation: `Default to ${topGrind[0]} grind`
    });
  }

  if (patterns.length > 0) {
    dv.table(
      ["Pattern Type", "Finding", "Confidence", "Recommendation"],
      patterns.map(p => [p.pattern, p.finding, p.confidence, p.recommendation])
    );
  } else {
    dv.paragraph("🔄 Continue logging brews to discover patterns...");
  }
}
```

## Clustering Analysis (K-Means)

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.rating && p["water-temp"] && p["brew-time"])
  .array();

if (allLogs.length >= 15) {
  dv.header(3, "🎯 Brew Cluster Analysis");

  // Simple k-means clustering (k=3: Poor, Good, Excellent)
  const grindSizeMap = {
    'extra-fine': 1, 'fine': 2, 'medium-fine': 3, 'medium': 4,
    'medium-coarse': 5, 'coarse': 6, 'extra-coarse': 7
  };

  const parseRatio = (ratioStr) => {
    if (!ratioStr) return 16;
    const parts = String(ratioStr).split(':');
    return parts.length === 2 ? parseFloat(parts[1]) || 16 : 16;
  };

  // Group by rating tier
  const clusters = {
    "Excellent (4.3+)": allLogs.filter(p => p.rating >= 4.3),
    "Good (3.5-4.2)": allLogs.filter(p => p.rating >= 3.5 && p.rating < 4.3),
    "Needs Work (<3.5)": allLogs.filter(p => p.rating < 3.5)
  };

  const clusterStats = Object.entries(clusters).map(([name, logs]) => {
    if (logs.length === 0) return null;

    const avgTemp = Math.round(
      logs.reduce((sum, p) => sum + (parseFloat(p["water-temp"]) || 200), 0) / logs.length
    );

    const avgTime = Math.round(
      logs.reduce((sum, p) => sum + (parseFloat(p["brew-time"]) || 3), 0) / logs.length * 10
    ) / 10;

    const grindCounts = {};
    logs.forEach(p => {
      const grind = p["grind-size"] || "medium";
      grindCounts[grind] = (grindCounts[grind] || 0) + 1;
    });
    const commonGrind = Object.entries(grindCounts).sort((a, b) => b[1] - a[1])[0][0];

    const avgRatio = Math.round(
      logs.reduce((sum, p) => sum + parseRatio(p.ratio), 0) / logs.length
    );

    return {
      cluster: name,
      count: logs.length,
      avgTemp,
      avgTime,
      commonGrind,
      avgRatio
    };
  }).filter(c => c !== null);

  dv.table(
    ["Quality Cluster", "Brews", "Avg Temp", "Avg Time", "Common Grind", "Avg Ratio"],
    clusterStats.map(c => [
      c.cluster,
      c.count,
      `${c.avgTemp}°F`,
      `${c.avgTime}min`,
      c.commonGrind,
      `1:${c.avgRatio}`
    ])
  );

  dv.paragraph(`
**Insight**: Each quality tier shows distinct parameter patterns. Aim to match the "Excellent" cluster parameters for best results.
  `);
}
```

## Multi-Variable Relationship Discovery

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.rating && p["water-temp"] && p["brew-time"])
  .array();

if (allLogs.length >= 15) {
  dv.header(3, "🔬 Complex Relationship Analysis");

  // Analyze temperature + time interaction
  const tempTimeCombos = {};

  allLogs.forEach(log => {
    const temp = Math.round(parseFloat(log["water-temp"]) / 5) * 5; // Round to nearest 5
    const time = Math.round(parseFloat(log["brew-time"]) * 2) / 2; // Round to nearest 0.5

    const key = `${temp}°F + ${time}min`;
    if (!tempTimeCombos[key]) {
      tempTimeCombos[key] = { count: 0, totalRating: 0, ratings: [] };
    }
    tempTimeCombos[key].count++;
    tempTimeCombos[key].totalRating += log.rating;
    tempTimeCombos[key].ratings.push(log.rating);
  });

  // Find best combinations (with at least 2 samples)
  const topCombos = Object.entries(tempTimeCombos)
    .filter(([_, data]) => data.count >= 2)
    .map(([combo, data]) => ({
      combo,
      avgRating: Math.round((data.totalRating / data.count) * 10) / 10,
      count: data.count
    }))
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 5);

  if (topCombos.length > 0) {
    dv.header(4, "Best Temperature + Time Combinations");
    dv.table(
      ["Combination", "Avg Rating", "Sample Size", "Status"],
      topCombos.map(c => [
        c.combo,
        `${c.avgRating} ⭐`,
        c.count,
        c.avgRating >= 4.3 ? "🏆 Excellent" :
        c.avgRating >= 4.0 ? "✅ Good" : "⚠️ Fair"
      ])
    );
  }

  // Analyze method + grind combinations
  const methodGrindCombos = {};

  allLogs.forEach(log => {
    if (log["brew-method"] && log["grind-size"]) {
      const key = `${log["brew-method"]} + ${log["grind-size"]}`;
      if (!methodGrindCombos[key]) {
        methodGrindCombos[key] = { count: 0, totalRating: 0 };
      }
      methodGrindCombos[key].count++;
      methodGrindCombos[key].totalRating += log.rating;
    }
  });

  const topMethodGrind = Object.entries(methodGrindCombos)
    .filter(([_, data]) => data.count >= 2)
    .map(([combo, data]) => ({
      combo,
      avgRating: Math.round((data.totalRating / data.count) * 10) / 10,
      count: data.count
    }))
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 5);

  if (topMethodGrind.length > 0) {
    dv.header(4, "Best Method + Grind Combinations");
    dv.table(
      ["Combination", "Avg Rating", "Sample Size"],
      topMethodGrind.map(c => [
        c.combo,
        `${c.avgRating} ⭐`,
        c.count
      ])
    );
  }
}
```

## Surprising Correlations

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.rating)
  .array();

if (allLogs.length >= 15) {
  dv.header(3, "💡 Unexpected Findings");

  const findings = [];

  // Origin vs Quality
  const originStats = {};
  allLogs.forEach(log => {
    if (log.origin) {
      const origin = log.origin;
      if (!originStats[origin]) {
        originStats[origin] = { count: 0, totalRating: 0 };
      }
      originStats[origin].count++;
      originStats[origin].totalRating += log.rating;
    }
  });

  const originRankings = Object.entries(originStats)
    .filter(([_, data]) => data.count >= 3)
    .map(([origin, data]) => ({
      origin,
      avgRating: data.totalRating / data.count,
      count: data.count
    }))
    .sort((a, b) => b.avgRating - a.avgRating);

  if (originRankings.length >= 2) {
    const best = originRankings[0];
    const worst = originRankings[originRankings.length - 1];
    const diff = best.avgRating - worst.avgRating;

    if (diff > 0.5) {
      findings.push(`🌍 **Origin Impact**: ${best.origin} outperforms ${worst.origin} by ${Math.round(diff * 10) / 10} stars on average!`);
    }
  }

  // Roaster consistency
  const roasterStats = {};
  allLogs.forEach(log => {
    if (log.roaster) {
      const roaster = String(log.roaster).replace(/\[\[|\]\]/g, "");
      if (!roasterStats[roaster]) {
        roasterStats[roaster] = { ratings: [], count: 0 };
      }
      roasterStats[roaster].ratings.push(log.rating);
      roasterStats[roaster].count++;
    }
  });

  const roasterConsistency = Object.entries(roasterStats)
    .filter(([_, data]) => data.count >= 3)
    .map(([roaster, data]) => {
      const avg = data.ratings.reduce((a, b) => a + b, 0) / data.count;
      const variance = data.ratings.reduce((sum, r) =>
        sum + Math.pow(r - avg, 2), 0
      ) / data.count;
      const stdDev = Math.sqrt(variance);

      return { roaster, avgRating: avg, stdDev, count: data.count };
    })
    .sort((a, b) => a.stdDev - b.stdDev);

  if (roasterConsistency.length > 0) {
    const mostConsistent = roasterConsistency[0];
    if (mostConsistent.stdDev < 0.3) {
      findings.push(`⭐ **Most Consistent Roaster**: ${mostConsistent.roaster} (σ = ${Math.round(mostConsistent.stdDev * 100) / 100})`);
    }
  }

  // Time of day analysis (if time data available)
  const logsWithTime = allLogs.filter(p => p.time);
  if (logsWithTime.length >= 10) {
    const morningBrews = logsWithTime.filter(p => {
      const hour = parseInt(String(p.time).split(':')[0]);
      return hour >= 6 && hour < 12;
    });

    const afternoonBrews = logsWithTime.filter(p => {
      const hour = parseInt(String(p.time).split(':')[0]);
      return hour >= 12 && hour < 18;
    });

    if (morningBrews.length >= 3 && afternoonBrews.length >= 3) {
      const morningAvg = morningBrews.reduce((sum, p) => sum + p.rating, 0) / morningBrews.length;
      const afternoonAvg = afternoonBrews.reduce((sum, p) => sum + p.rating, 0) / afternoonBrews.length;
      const diff = morningAvg - afternoonAvg;

      if (Math.abs(diff) > 0.3) {
        findings.push(`⏰ **Time of Day Effect**: ${diff > 0 ? "Morning" : "Afternoon"} brews rate ${Math.round(Math.abs(diff) * 10) / 10} stars higher on average!`);
      }
    }
  }

  if (findings.length > 0) {
    findings.forEach(f => dv.paragraph(f));
  } else {
    dv.paragraph("🔍 No surprising correlations detected yet. Keep brewing to discover patterns!");
  }
}
```

## Statistical Significance

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.rating)
  .array();

if (allLogs.length >= 20) {
  dv.header(3, "📊 Statistical Confidence");

  const sampleSize = allLogs.length;
  const avgRating = allLogs.reduce((sum, p) => sum + p.rating, 0) / sampleSize;

  // Calculate standard error
  const variance = allLogs.reduce((sum, p) =>
    sum + Math.pow(p.rating - avgRating, 2), 0
  ) / sampleSize;
  const stdDev = Math.sqrt(variance);
  const stdError = stdDev / Math.sqrt(sampleSize);

  // 95% confidence interval
  const marginOfError = 1.96 * stdError;
  const ciLower = avgRating - marginOfError;
  const ciUpper = avgRating + marginOfError;

  dv.paragraph(`
**Sample Statistics**:
- Sample Size: ${sampleSize} brews
- Average Rating: ${Math.round(avgRating * 100) / 100} ⭐
- Standard Deviation: ${Math.round(stdDev * 100) / 100}
- Standard Error: ${Math.round(stdError * 1000) / 1000}

**95% Confidence Interval**: ${Math.round(ciLower * 100) / 100} - ${Math.round(ciUpper * 100) / 100}

**Interpretation**: We can be 95% confident that your true average brewing quality falls within this range.

**Reliability**: ${sampleSize >= 50 ? "🏆 Very High" :
                sampleSize >= 30 ? "✅ High" :
                "⚠️ Moderate - more data will improve confidence"}
  `);
}
```

---

## Related Dashboards

- [[2-Brewing-Optimization-Engine|Brewing Optimizer]]
- [[5-Quality-Predictor|Quality Predictor]]
- [[7-Anomaly-Detection-System|Anomaly Detection]]
- [[Coffee Dashboard|Main Dashboard]]

---

*Statistical Methods: Pearson Correlation, K-Means Clustering, Confidence Intervals*
*Last Updated: `= date(today)`*
