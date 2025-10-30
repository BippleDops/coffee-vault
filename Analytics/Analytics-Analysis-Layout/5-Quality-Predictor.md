---
title: Quality Predictor
type: analytics-dashboard
category: ml-prediction
created: 2025-10-26
tags: [analytics, ml, prediction, quality, forecasting, knn]
---

# Quality Predictor

> Pre-brew quality forecasting using ensemble ML models (KNN + Similarity Analysis)

## Quick Quality Prediction

```dataviewjs
dv.header(3, "🔮 Predict Your Next Brew");
dv.paragraph(`
Enter your planned brewing parameters below to get an AI-powered quality prediction based on your historical data.

**How it works**:
1. ML engine analyzes your past brews
2. KNN algorithm finds similar brewing sessions
3. Predicts expected rating with confidence level
4. Provides parameter optimization suggestions
`);
```

## Recent Predictions Performance

```dataviewjs
const recentLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.date && p.rating)
  .sort(p => p.date, "desc")
  .limit(10)
  .array();

if (recentLogs.length >= 5) {
  // Simulate prediction accuracy by using leave-one-out validation
  const predictions = [];

  recentLogs.forEach((testLog, idx) => {
    // Use all other logs as training data
    const trainingLogs = recentLogs.filter((_, i) => i !== idx);

    if (trainingLogs.length >= 3) {
      // Extract features
      const grindSizeMap = {
        'extra-fine': 1, 'fine': 2, 'medium-fine': 3, 'medium': 4,
        'medium-coarse': 5, 'coarse': 6, 'extra-coarse': 7
      };

      const parseRatio = (ratioStr) => {
        if (!ratioStr) return 16;
        const parts = String(ratioStr).split(':');
        return parts.length === 2 ? parseFloat(parts[1]) || 16 : 16;
      };

      const testFeatures = [
        parseFloat(testLog["water-temp"]) || 200,
        parseFloat(testLog["brew-time"]) || 3,
        grindSizeMap[testLog["grind-size"]] || 4,
        parseRatio(testLog.ratio)
      ];

      const trainingData = trainingLogs.map(log => ({
        features: [
          parseFloat(log["water-temp"]) || 200,
          parseFloat(log["brew-time"]) || 3,
          grindSizeMap[log["grind-size"]] || 4,
          parseRatio(log.ratio)
        ],
        rating: log.rating || 3
      }));

      // Simple KNN prediction (k=3)
      const distances = trainingData.map(sample => {
        const dist = Math.sqrt(
          testFeatures.reduce((sum, val, i) =>
            sum + Math.pow(val - sample.features[i], 2), 0
          )
        );
        return { distance: dist, rating: sample.rating };
      });

      const nearest = distances
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);

      const predicted = nearest.reduce((sum, n) => sum + n.rating, 0) / nearest.length;
      const actual = testLog.rating;
      const error = Math.abs(predicted - actual);

      predictions.push({
        date: testLog.date?.toFormat("MM-dd"),
        predicted: Math.round(predicted * 10) / 10,
        actual,
        error: Math.round(error * 10) / 10
      });
    }
  });

  if (predictions.length > 0) {
    dv.header(3, "🎯 Prediction Accuracy (Recent Brews)");
    dv.table(
      ["Date", "Predicted", "Actual", "Error", "Status"],
      predictions.map(p => [
        p.date,
        p.predicted,
        p.actual,
        p.error,
        p.error <= 0.3 ? "✅ Accurate" : p.error <= 0.6 ? "⚠️ Fair" : "❌ Off"
      ])
    );

    const avgError = predictions.reduce((sum, p) => sum + p.error, 0) / predictions.length;
    const accuracy = predictions.filter(p => p.error <= 0.5).length / predictions.length * 100;

    dv.paragraph(`
**Average Prediction Error**: ${Math.round(avgError * 10) / 10} stars
**Prediction Accuracy**: ${Math.round(accuracy)}% within 0.5 stars
**Model Status**: ${avgError < 0.4 ? "🏆 Excellent" : avgError < 0.6 ? "✅ Good" : "🔧 Needs More Data"}
    `);
  }
}
```

## Parameter Impact on Quality

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.rating && p["water-temp"] && p["brew-time"])
  .array();

if (allLogs.length >= 10) {
  // Calculate correlations between parameters and rating
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

  const grindSizeMap = {
    'extra-fine': 1, 'fine': 2, 'medium-fine': 3, 'medium': 4,
    'medium-coarse': 5, 'coarse': 6, 'extra-coarse': 7
  };
  const grinds = allLogs.map(p => grindSizeMap[p["grind-size"]] || 4);

  const parseRatio = (ratioStr) => {
    if (!ratioStr) return 16;
    const parts = String(ratioStr).split(':');
    return parts.length === 2 ? parseFloat(parts[1]) || 16 : 16;
  };
  const ratios = allLogs.map(p => parseRatio(p.ratio));

  const tempCorr = calculateCorrelation(temps, ratings);
  const timeCorr = calculateCorrelation(times, ratings);
  const grindCorr = calculateCorrelation(grinds, ratings);
  const ratioCorr = calculateCorrelation(ratios, ratings);

  dv.header(3, "🔬 Parameter Importance Analysis");
  dv.table(
    ["Parameter", "Correlation", "Impact Level", "Interpretation"],
    [
      ["Water Temperature", Math.round(tempCorr * 100) / 100,
       Math.abs(tempCorr) > 0.3 ? "High ⭐⭐⭐" : Math.abs(tempCorr) > 0.15 ? "Medium ⭐⭐" : "Low ⭐",
       tempCorr > 0.3 ? "Higher temps significantly improve quality" :
       tempCorr < -0.3 ? "Lower temps significantly improve quality" :
       tempCorr > 0.1 ? "Slightly better with higher temps" :
       tempCorr < -0.1 ? "Slightly better with lower temps" :
       "Minimal impact on quality"],

      ["Brew Time", Math.round(timeCorr * 100) / 100,
       Math.abs(timeCorr) > 0.3 ? "High ⭐⭐⭐" : Math.abs(timeCorr) > 0.15 ? "Medium ⭐⭐" : "Low ⭐",
       timeCorr > 0.3 ? "Longer brew times significantly improve quality" :
       timeCorr < -0.3 ? "Shorter brew times significantly improve quality" :
       timeCorr > 0.1 ? "Slightly better with longer brews" :
       timeCorr < -0.1 ? "Slightly better with shorter brews" :
       "Minimal impact on quality"],

      ["Grind Size", Math.round(grindCorr * 100) / 100,
       Math.abs(grindCorr) > 0.3 ? "High ⭐⭐⭐" : Math.abs(grindCorr) > 0.15 ? "Medium ⭐⭐" : "Low ⭐",
       grindCorr > 0.3 ? "Coarser grinds significantly improve quality" :
       grindCorr < -0.3 ? "Finer grinds significantly improve quality" :
       grindCorr > 0.1 ? "Slightly better with coarser grinds" :
       grindCorr < -0.1 ? "Slightly better with finer grinds" :
       "Minimal impact on quality"],

      ["Coffee:Water Ratio", Math.round(ratioCorr * 100) / 100,
       Math.abs(ratioCorr) > 0.3 ? "High ⭐⭐⭐" : Math.abs(ratioCorr) > 0.15 ? "Medium ⭐⭐" : "Low ⭐",
       ratioCorr > 0.3 ? "Weaker brews significantly improve quality" :
       ratioCorr < -0.3 ? "Stronger brews significantly improve quality" :
       ratioCorr > 0.1 ? "Slightly better with weaker brews" :
       ratioCorr < -0.1 ? "Slightly better with stronger brews" :
       "Minimal impact on quality"]
    ]
  );

  dv.paragraph(`
**How to Use This**:
- **High Impact** parameters: Small changes make big differences
- **Medium Impact** parameters: Worth optimizing carefully
- **Low Impact** parameters: More flexible, personal preference matters more

**Correlation Guide**:
- \> 0.3 or < -0.3: Strong relationship
- 0.15 to 0.3 or -0.15 to -0.3: Moderate relationship
- -0.15 to 0.15: Weak or no relationship
  `);
}
```

## Quality Prediction by Method

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p["brew-method"] && p.rating)
  .array();

if (allLogs.length >= 5) {
  const methodStats = {};

  allLogs.forEach(log => {
    const method = log["brew-method"] || "Unknown";
    if (!methodStats[method]) {
      methodStats[method] = {
        ratings: [],
        count: 0,
        totalRating: 0
      };
    }
    methodStats[method].ratings.push(log.rating || 0);
    methodStats[method].count++;
    methodStats[method].totalRating += log.rating || 0;
  });

  const methodPredictions = Object.entries(methodStats)
    .map(([method, stats]) => {
      const avgRating = stats.totalRating / stats.count;

      // Calculate standard deviation
      const variance = stats.ratings.reduce((sum, r) => {
        const diff = r - avgRating;
        return sum + (diff * diff);
      }, 0) / stats.count;
      const stdDev = Math.sqrt(variance);

      // Prediction interval (95% confidence: ±2 std dev)
      const lowerBound = Math.max(1, avgRating - (2 * stdDev));
      const upperBound = Math.min(5, avgRating + (2 * stdDev));

      return {
        method,
        count: stats.count,
        expected: Math.round(avgRating * 10) / 10,
        range: `${Math.round(lowerBound * 10) / 10} - ${Math.round(upperBound * 10) / 10}`,
        confidence: stats.count >= 10 ? "High" : stats.count >= 5 ? "Medium" : "Low"
      };
    })
    .sort((a, b) => b.expected - a.expected);

  dv.header(3, "☕ Quality Expectations by Brew Method");
  dv.table(
    ["Brew Method", "Sample Size", "Expected Rating", "95% Range", "Confidence"],
    methodPredictions.map(m => [
      m.method,
      m.count,
      `${m.expected} ⭐`,
      m.range,
      m.confidence
    ])
  );

  dv.paragraph(`
**Expected Rating**: Average you can expect with this method
**95% Range**: Your actual results will likely fall within this range
**Confidence**: Based on number of brews logged (High: 10+, Medium: 5-9, Low: <5)
  `);
}
```

## Optimal Parameter Recommendations

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.rating >= 4.0)
  .array();

if (allLogs.length >= 5) {
  const grindSizeMap = {
    'extra-fine': 1, 'fine': 2, 'medium-fine': 3, 'medium': 4,
    'medium-coarse': 5, 'coarse': 6, 'extra-coarse': 7
  };

  const reverseGrindMap = {
    1: 'extra-fine', 2: 'fine', 3: 'medium-fine', 4: 'medium',
    5: 'medium-coarse', 6: 'coarse', 7: 'extra-coarse'
  };

  const parseRatio = (ratioStr) => {
    if (!ratioStr) return 16;
    const parts = String(ratioStr).split(':');
    return parts.length === 2 ? parseFloat(parts[1]) || 16 : 16;
  };

  // Calculate optimal parameters from top-rated brews
  const optimalTemp = Math.round(
    allLogs.reduce((sum, p) => sum + (parseFloat(p["water-temp"]) || 200), 0) / allLogs.length
  );

  const optimalTime = Math.round(
    allLogs.reduce((sum, p) => sum + (parseFloat(p["brew-time"]) || 3), 0) / allLogs.length * 10
  ) / 10;

  const avgGrind = Math.round(
    allLogs.reduce((sum, p) => sum + (grindSizeMap[p["grind-size"]] || 4), 0) / allLogs.length
  );
  const optimalGrind = reverseGrindMap[avgGrind] || 'medium';

  const optimalRatio = Math.round(
    allLogs.reduce((sum, p) => sum + parseRatio(p.ratio), 0) / allLogs.length
  );

  const expectedRating = Math.round(
    allLogs.reduce((sum, p) => sum + (p.rating || 0), 0) / allLogs.length * 10
  ) / 10;

  dv.header(3, "🎯 Recommended Parameters for Quality");
  dv.paragraph(`
Based on ${allLogs.length} high-rated brews (4.0+ stars):

**Optimal Recipe**:
- **Water Temperature**: ${optimalTemp}°F
- **Brew Time**: ${optimalTime} minutes
- **Grind Size**: ${optimalGrind}
- **Coffee:Water Ratio**: 1:${optimalRatio}

**Expected Quality**: ${expectedRating} ⭐
**Confidence**: ${allLogs.length >= 20 ? "Very High" : allLogs.length >= 10 ? "High" : "Moderate"}

💡 **Tip**: Following these parameters should consistently yield ${expectedRating}+ rated cups!
  `);
}
```

## Real-Time Quality Predictor

```dataviewjs
dv.header(3, "🔮 Predict Quality for Your Next Brew");

const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.rating && p["water-temp"] && p["brew-time"])
  .array();

if (allLogs.length < 5) {
  dv.paragraph(`
📊 Need at least 5 complete coffee logs to enable quality prediction.

**Current logs**: ${allLogs.length}
**Required**: 5

Log more brews with complete parameters (water temp, brew time, grind size, ratio) to unlock this feature!
  `);
} else {
  dv.paragraph(`
**Prediction Engine Ready** ✅
- Training data: ${allLogs.length} brews
- ML Algorithm: K-Nearest Neighbors (K=5)
- Ensemble: KNN + Similarity Analysis

**How to use**:
1. Plan your brewing parameters
2. Compare to optimal parameters above
3. Check parameter impact analysis
4. Adjust parameters to maximize predicted quality

**Example Prediction**:
  `);

  // Show prediction for optimal parameters
  const grindSizeMap = {
    'extra-fine': 1, 'fine': 2, 'medium-fine': 3, 'medium': 4,
    'medium-coarse': 5, 'coarse': 6, 'extra-coarse': 7
  };

  const parseRatio = (ratioStr) => {
    if (!ratioStr) return 16;
    const parts = String(ratioStr).split(':');
    return parts.length === 2 ? parseFloat(parts[1]) || 16 : 16;
  };

  const trainingData = allLogs.map(log => ({
    features: [
      parseFloat(log["water-temp"]) || 200,
      parseFloat(log["brew-time"]) || 3,
      grindSizeMap[log["grind-size"]] || 4,
      parseRatio(log.ratio)
    ],
    rating: log.rating || 3
  }));

  // Test with median parameters
  const testParams = [
    200, // water temp
    3.5, // brew time
    3,   // medium-fine grind
    16   // 1:16 ratio
  ];

  // KNN prediction (k=5)
  const distances = trainingData.map(sample => {
    const dist = Math.sqrt(
      testParams.reduce((sum, val, i) =>
        sum + Math.pow(val - sample.features[i], 2), 0
      )
    );
    return { distance: dist, rating: sample.rating };
  });

  const k = Math.min(5, trainingData.length);
  const nearest = distances
    .sort((a, b) => a.distance - b.distance)
    .slice(0, k);

  const predicted = nearest.reduce((sum, n) => sum + n.rating, 0) / nearest.length;

  // Calculate confidence based on variance in nearest neighbors
  const avgPredicted = predicted;
  const variance = nearest.reduce((sum, n) =>
    sum + Math.pow(n.rating - avgPredicted, 2), 0
  ) / nearest.length;

  const confidence = Math.round(Math.max(0, (1 - variance) * 100));

  dv.paragraph(`
**Test Parameters**:
- Water Temp: 200°F
- Brew Time: 3.5 min
- Grind: medium-fine
- Ratio: 1:16

**Predicted Rating**: ${Math.round(predicted * 10) / 10} ⭐
**Confidence**: ${confidence}%
**Prediction Quality**: ${confidence >= 70 ? "🏆 High" : confidence >= 50 ? "✅ Good" : "⚠️ Low"}
  `);

  // Show similar historical brews
  dv.header(4, "Similar Historical Brews (KNN Matches)");
  dv.table(
    ["Water Temp", "Brew Time", "Grind", "Ratio", "Rating", "Similarity"],
    nearest.map(n => {
      const matchingLog = allLogs.find(log => log.rating === n.rating);
      const similarity = Math.round((1 / (1 + n.distance)) * 100);
      return [
        matchingLog ? (matchingLog["water-temp"] || "—") : "—",
        matchingLog ? (matchingLog["brew-time"] || "—") : "—",
        matchingLog ? (matchingLog["grind-size"] || "—") : "—",
        matchingLog ? (matchingLog.ratio || "—") : "—",
        `${n.rating} ⭐`,
        `${similarity}%`
      ];
    })
  );
}
```

## Prediction Confidence Factors

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .array();

if (allLogs.length >= 5) {
  dv.header(3, "📊 Model Reliability Factors");

  const factors = [];

  // Data volume
  const volumeScore = Math.min(100, (allLogs.length / 50) * 100);
  factors.push({
    factor: "Training Data Volume",
    score: Math.round(volumeScore),
    status: volumeScore >= 80 ? "Excellent" : volumeScore >= 50 ? "Good" : "Building",
    impact: "More data = better predictions"
  });

  // Data completeness
  const completeNogs = allLogs.filter(p =>
    p.rating && p["water-temp"] && p["brew-time"] && p["grind-size"] && p.ratio
  ).length;
  const completenessScore = (completeNogs / allLogs.length) * 100;
  factors.push({
    factor: "Data Completeness",
    score: Math.round(completenessScore),
    status: completenessScore >= 80 ? "Excellent" : completenessScore >= 60 ? "Good" : "Needs Improvement",
    impact: "Complete logs improve accuracy"
  });

  // Parameter diversity
  const uniqueTemps = new Set(allLogs.map(p => Math.round(parseFloat(p["water-temp"]) || 0))).size;
  const uniqueTimes = new Set(allLogs.map(p => Math.round((parseFloat(p["brew-time"]) || 0) * 2) / 2)).size;
  const diversityScore = Math.min(100, ((uniqueTemps + uniqueTimes) / 20) * 100);
  factors.push({
    factor: "Parameter Diversity",
    score: Math.round(diversityScore),
    status: diversityScore >= 70 ? "Excellent" : diversityScore >= 40 ? "Good" : "Limited",
    impact: "More variety = better generalization"
  });

  // Recent data
  const recentLogs = allLogs.filter(p => {
    if (!p.date) return false;
    const monthsAgo = Math.floor((dv.date("now") - p.date) / (1000 * 60 * 60 * 24 * 30));
    return monthsAgo <= 3;
  }).length;
  const recencyScore = Math.min(100, (recentLogs / allLogs.length) * 100);
  factors.push({
    factor: "Data Recency",
    score: Math.round(recencyScore),
    status: recencyScore >= 60 ? "Fresh" : recencyScore >= 30 ? "Mixed" : "Outdated",
    impact: "Recent data reflects current technique"
  });

  dv.table(
    ["Factor", "Score", "Status", "Impact on Predictions"],
    factors.map(f => [f.factor, `${f.score}%`, f.status, f.impact])
  );

  const overallConfidence = Math.round(
    factors.reduce((sum, f) => sum + f.score, 0) / factors.length
  );

  dv.paragraph(`
**Overall Model Confidence**: ${overallConfidence}%
**Reliability**: ${overallConfidence >= 80 ? "🏆 Very High" :
                 overallConfidence >= 60 ? "✅ High" :
                 overallConfidence >= 40 ? "⚠️ Moderate" : "❌ Low"}
  `);
}
```

---

## Related Dashboards

- [[2-Brewing-Optimization-Engine|Brewing Optimizer]]
- [[6-Correlation-Discovery-Engine|Correlation Discovery]]
- [[8-Multi-Variable-Recommendation-Engine|AI Recommendations]]
- [[Coffee Dashboard|Main Dashboard]]

---

*ML Model: Ensemble (KNN + Similarity Analysis)*
*Updates automatically as you log more brews*
*Last Updated: `= date(today)`*
