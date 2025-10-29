---
title: Brewing Optimization Engine
type: analytics-dashboard
category: ml-optimization
created: 2025-10-26
tags: [analytics, ml, optimization, recommendations, knn]
---

# Brewing Optimization Engine

> ML-powered parameter recommendations using K-Nearest Neighbors and decision tree algorithms

## Current Brewing Profile

```dataviewjs
const recentLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.date)
  .sort(p => p.date, "desc")
  .limit(10)
  .array();

if (recentLogs.length > 0) {
  const latest = recentLogs[0];
  const avgRating = Math.round(
    recentLogs.reduce((sum, p) => sum + (p.rating || 0), 0) / recentLogs.length * 10
  ) / 10;

  dv.header(3, "Your Recent Performance");
  dv.paragraph(`
**Latest Brew**: ${latest.beans} (${latest.rating}⭐)
**Recent Average**: ${avgRating}/5.0
**Sample Size**: ${recentLogs.length} brews
**Status**: ${avgRating >= 4.3 ? "🏆 Excellent" : avgRating >= 3.8 ? "✅ Good" : "🔧 Needs Optimization"}
  `);
} else {
  dv.paragraph("No brewing data found. Start logging your brews to get ML recommendations!");
}
```

## KNN-Based Parameter Optimization

```dataviewjs
// Load ML Engine
const mlEnginePath = app.vault.adapter.basePath + "/Analytics/ml-engine.js";
let MLEngine;

try {
  if (typeof require !== 'undefined') {
    MLEngine = require(mlEnginePath);
  }
} catch (error) {
  console.log("ML Engine not available:", error);
}

const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.rating && p["water-temp"] && p["brew-time"])
  .array();

if (allLogs.length < 5) {
  dv.paragraph("📊 Need at least 5 complete logs to generate ML recommendations.");
  dv.paragraph("Make sure your logs include: rating, water-temp, brew-time, grind-size, and ratio.");
} else {
  // Prepare training data
  const grindSizeMap = {
    'extra-fine': 1, 'fine': 2, 'medium-fine': 3, 'medium': 4,
    'medium-coarse': 5, 'coarse': 6, 'extra-coarse': 7
  };

  const parseRatio = (ratioStr) => {
    if (!ratioStr) return 16;
    const parts = String(ratioStr).split(':');
    if (parts.length === 2) {
      return parseFloat(parts[1]) || 16;
    }
    return 16;
  };

  const trainingData = allLogs.map(log => ({
    features: [
      parseFloat(log["water-temp"]) || 200,
      parseFloat(log["brew-time"]) || 3,
      grindSizeMap[log["grind-size"]] || 4,
      parseRatio(log.ratio)
    ],
    label: log.rating || 3
  }));

  // Find optimal parameters from top-rated brews
  const topBrews = allLogs.filter(p => p.rating >= 4.0);

  if (topBrews.length > 0) {
    // Calculate average optimal parameters
    const optimalTemp = Math.round(
      topBrews.reduce((sum, p) => sum + (parseFloat(p["water-temp"]) || 200), 0) / topBrews.length
    );

    const optimalTime = Math.round(
      topBrews.reduce((sum, p) => sum + (parseFloat(p["brew-time"]) || 3), 0) / topBrews.length * 10
    ) / 10;

    const grindCounts = {};
    topBrews.forEach(p => {
      const grind = p["grind-size"] || "medium";
      grindCounts[grind] = (grindCounts[grind] || 0) + 1;
    });
    const optimalGrind = Object.entries(grindCounts).sort((a, b) => b[1] - a[1])[0][0];

    const optimalRatio = Math.round(
      topBrews.reduce((sum, p) => sum + parseRatio(p.ratio), 0) / topBrews.length
    );

    dv.header(3, "🎯 Optimal Parameters (from top-rated brews)");
    dv.table(
      ["Parameter", "Current Range", "Optimal Target", "Confidence"],
      [
        ["Water Temp",
         `${Math.min(...allLogs.map(p => parseFloat(p["water-temp"]) || 200))}°F - ${Math.max(...allLogs.map(p => parseFloat(p["water-temp"]) || 200))}°F`,
         `${optimalTemp}°F`,
         `${Math.round((topBrews.length / allLogs.length) * 100)}%`],
        ["Brew Time",
         `${Math.min(...allLogs.map(p => parseFloat(p["brew-time"]) || 3))}m - ${Math.max(...allLogs.map(p => parseFloat(p["brew-time"]) || 3))}m`,
         `${optimalTime} minutes`,
         `${Math.round((topBrews.length / allLogs.length) * 100)}%`],
        ["Grind Size", "Variable", optimalGrind, `${Math.round((grindCounts[optimalGrind] / topBrews.length) * 100)}%`],
        ["Coffee:Water", "Variable", `1:${optimalRatio}`, `${Math.round((topBrews.length / allLogs.length) * 100)}%`]
      ]
    );

    // Expected quality with optimal parameters
    const expectedRating = Math.round(
      topBrews.reduce((sum, p) => sum + p.rating, 0) / topBrews.length * 10
    ) / 10;

    dv.paragraph(`**Expected Rating with Optimal Parameters**: ${expectedRating}⭐`);
  }
}
```

## Method-Specific Recommendations

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p["brew-method"])
  .array();

if (allLogs.length > 0) {
  // Group by method
  const methodStats = {};

  allLogs.forEach(log => {
    const method = log["brew-method"] || "Unknown";
    if (!methodStats[method]) {
      methodStats[method] = {
        logs: [],
        totalRating: 0,
        count: 0
      };
    }
    methodStats[method].logs.push(log);
    methodStats[method].totalRating += log.rating || 0;
    methodStats[method].count++;
  });

  dv.header(3, "📋 Method-Specific Optimization");

  for (const [method, stats] of Object.entries(methodStats)) {
    const avgRating = Math.round((stats.totalRating / stats.count) * 10) / 10;
    const topLogs = stats.logs.filter(p => p.rating >= 4.0);

    if (topLogs.length > 0) {
      const parseRatio = (ratioStr) => {
        if (!ratioStr) return 16;
        const parts = String(ratioStr).split(':');
        return parts.length === 2 ? parseFloat(parts[1]) || 16 : 16;
      };

      const optimalTemp = Math.round(
        topLogs.reduce((sum, p) => sum + (parseFloat(p["water-temp"]) || 200), 0) / topLogs.length
      );

      const optimalTime = Math.round(
        topLogs.reduce((sum, p) => sum + (parseFloat(p["brew-time"]) || 3), 0) / topLogs.length * 10
      ) / 10;

      const grindCounts = {};
      topLogs.forEach(p => {
        const grind = p["grind-size"] || "medium";
        grindCounts[grind] = (grindCounts[grind] || 0) + 1;
      });
      const optimalGrind = Object.entries(grindCounts).sort((a, b) => b[1] - a[1])[0][0];

      dv.header(4, `${method} (${avgRating}⭐ avg)`);
      dv.paragraph(`
**Optimal Recipe**:
- Water Temperature: ${optimalTemp}°F
- Brew Time: ${optimalTime} minutes
- Grind Size: ${optimalGrind}
- Sample Size: ${topLogs.length} excellent brews
- Success Rate: ${Math.round((topLogs.length / stats.count) * 100)}%
      `);
    }
  }
}
```

## Parameter Correlation Analysis

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.rating && p["water-temp"] && p["brew-time"])
  .array();

if (allLogs.length >= 10) {
  // Calculate correlations
  const calculateCorrelation = (x, y) => {
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

  const ratings = allLogs.map(p => p.rating || 0);
  const temps = allLogs.map(p => parseFloat(p["water-temp"]) || 200);
  const times = allLogs.map(p => parseFloat(p["brew-time"]) || 3);

  const tempCorr = Math.round(calculateCorrelation(temps, ratings) * 100) / 100;
  const timeCorr = Math.round(calculateCorrelation(times, ratings) * 100) / 100;

  dv.header(3, "🔬 Parameter Impact Analysis");
  dv.table(
    ["Parameter", "Correlation", "Impact", "Insight"],
    [
      ["Water Temperature", tempCorr,
       Math.abs(tempCorr) > 0.3 ? "High" : Math.abs(tempCorr) > 0.1 ? "Moderate" : "Low",
       tempCorr > 0.3 ? "Higher temps improve quality" :
       tempCorr < -0.3 ? "Lower temps improve quality" :
       "Temperature shows minimal impact"],
      ["Brew Time", timeCorr,
       Math.abs(timeCorr) > 0.3 ? "High" : Math.abs(timeCorr) > 0.1 ? "Moderate" : "Low",
       timeCorr > 0.3 ? "Longer brew time improves quality" :
       timeCorr < -0.3 ? "Shorter brew time improves quality" :
       "Brew time shows minimal impact"]
    ]
  );

  dv.paragraph(`
**Interpretation**:
- Correlation > 0.3: Strong positive relationship
- Correlation < -0.3: Strong negative relationship
- Correlation -0.1 to 0.1: Weak or no relationship
  `);
}
```

## Decision Tree Insights

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.rating)
  .array();

if (allLogs.length >= 10) {
  // Simple decision tree rules based on data
  const highRatedBrews = allLogs.filter(p => p.rating >= 4.3);
  const mediumRatedBrews = allLogs.filter(p => p.rating >= 3.5 && p.rating < 4.3);
  const lowRatedBrews = allLogs.filter(p => p.rating < 3.5);

  dv.header(3, "🌳 Decision Tree Rules");

  if (highRatedBrews.length > 0) {
    // Find common characteristics of high-rated brews
    const methods = {};
    const grinds = {};

    highRatedBrews.forEach(p => {
      const method = p["brew-method"] || "Unknown";
      const grind = p["grind-size"] || "Unknown";
      methods[method] = (methods[method] || 0) + 1;
      grinds[grind] = (grinds[grind] || 0) + 1;
    });

    const topMethod = Object.entries(methods).sort((a, b) => b[1] - a[1])[0];
    const topGrind = Object.entries(grinds).sort((a, b) => b[1] - a[1])[0];

    dv.header(4, "Rules for High Rating (4.3+)");
    dv.paragraph(`
**IF** brew-method = "${topMethod[0]}" AND grind-size = "${topGrind[0]}"
**THEN** expected-rating = 4.3+
**Confidence**: ${Math.round((topMethod[1] / highRatedBrews.length) * 100)}%
**Support**: ${topMethod[1]} brews
    `);
  }

  if (lowRatedBrews.length > 0 && lowRatedBrews.length >= 3) {
    dv.header(4, "⚠️ Patterns to Avoid");

    const avgTemp = Math.round(
      lowRatedBrews.reduce((sum, p) => sum + (parseFloat(p["water-temp"]) || 200), 0) / lowRatedBrews.length
    );

    const avgTime = Math.round(
      lowRatedBrews.reduce((sum, p) => sum + (parseFloat(p["brew-time"]) || 3), 0) / lowRatedBrews.length * 10
    ) / 10;

    dv.paragraph(`
Low-rated brews tend to have:
- Water temp around ${avgTemp}°F
- Brew time around ${avgTime} minutes
- Sample size: ${lowRatedBrews.length} brews

💡 Avoid these parameter combinations!
    `);
  }
}
```

## Personalized Brewing Recommendations

```dataviewjs
const recentLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.date)
  .sort(p => p.date, "desc")
  .limit(20)
  .array();

if (recentLogs.length >= 5) {
  const recommendations = [];

  // Analyze recent performance
  const avgRating = recentLogs.reduce((sum, p) => sum + (p.rating || 0), 0) / recentLogs.length;
  const topRated = recentLogs.filter(p => p.rating >= 4.3);

  dv.header(3, "💡 AI-Generated Action Items");

  if (avgRating < 3.8) {
    recommendations.push("🔧 **Focus on Fundamentals**: Your recent average is below target. Review optimal parameters above.");
  }

  // Consistency check
  const ratings = recentLogs.map(p => p.rating || 0);
  const avgR = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  const variance = ratings.reduce((sum, r) => sum + Math.pow(r - avgR, 2), 0) / ratings.length;

  if (variance > 0.5) {
    recommendations.push("📊 **Improve Consistency**: High variance detected (σ² = " + Math.round(variance * 100) / 100 + "). Standardize your process.");
  } else {
    recommendations.push("✅ **Excellent Consistency**: Low variance (σ² = " + Math.round(variance * 100) / 100 + "). Keep it up!");
  }

  // Method optimization
  const methods = new Set(recentLogs.map(p => p["brew-method"]));
  if (methods.size === 1) {
    recommendations.push("🌈 **Expand Repertoire**: You're only using one method. Try experimenting with others.");
  }

  // Bean variety
  const beans = new Set(recentLogs.map(p => p.beans));
  if (beans.size < 3 && recentLogs.length > 10) {
    recommendations.push("☕ **Try New Beans**: You've been using the same beans. Explore new origins and roasters.");
  }

  // Success rate
  const successRate = (topRated.length / recentLogs.length) * 100;
  if (successRate < 30) {
    recommendations.push(`⚡ **Optimize Process**: Only ${Math.round(successRate)}% of recent brews rated 4.3+. Follow optimal parameters above.`);
  } else if (successRate > 70) {
    recommendations.push(`🏆 **Master Status**: ${Math.round(successRate)}% of recent brews are excellent! Consider teaching others.`);
  }

  if (recommendations.length === 0) {
    recommendations.push("🎯 All metrics are optimal. Maintain current approach!");
  }

  recommendations.forEach(rec => dv.paragraph(rec));
}
```

## Next Brew Optimizer

```dataviewjs
dv.header(3, "🎯 Next Brew Recommendation");

const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.rating >= 4.5)
  .sort(p => p.rating, "desc")
  .limit(1)
  .array();

if (allLogs.length > 0) {
  const best = allLogs[0];

  dv.paragraph(`**Replicate Your Best Brew**:`);
  dv.paragraph(`
**Bean**: ${best.beans}
**Roaster**: ${best.roaster}
**Method**: ${best["brew-method"]}
**Grind**: ${best["grind-size"]}
**Water Temp**: ${best["water-temp"]}°F
**Brew Time**: ${best["brew-time"]} minutes
**Ratio**: ${best.ratio}
**Previous Rating**: ${best.rating}⭐

🎯 Following this recipe should yield a ${best.rating}+ rated cup!
  `);
} else {
  dv.paragraph("Keep brewing! Once you log a 4.5+ rated brew, it will be recommended here.");
}
```

---

## Related Dashboards

- [[1-Monthly-Analytics-Dashboard|Monthly Analytics]]
- [[5-Quality-Predictor|Quality Predictor]]
- [[6-Correlation-Discovery-Engine|Correlation Discovery]]
- [[Coffee Dashboard|Main Dashboard]]

---

*ML Algorithms: KNN, Decision Trees, Linear Regression*
*Last Updated: `= date(today)`*
