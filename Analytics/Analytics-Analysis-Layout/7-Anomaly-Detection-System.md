---
title: Anomaly Detection System
type: analytics-dashboard
category: ml-anomaly-detection
created: 2025-10-26
tags: [analytics, ml, anomaly, outlier, detection]
---

# Anomaly Detection System

> Identify outliers and unusual brewing patterns using statistical methods and ML

## Recent Anomalies Detected

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.rating && p.date)
  .sort(p => p.date, "desc")
  .array();

if (allLogs.length < 10) {
  dv.paragraph("📊 Need at least 10 logs to detect anomalies. Current logs: " + allLogs.length);
} else {
  dv.header(3, "⚠️ Detected Outliers (Last 30 Brews)");

  const recent = allLogs.slice(0, 30);

  // Calculate Z-scores for rating
  const ratings = recent.map(p => p.rating || 0);
  const mean = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  const variance = ratings.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / ratings.length;
  const stdDev = Math.sqrt(variance);

  const anomalies = [];

  recent.forEach((log, idx) => {
    const zScore = stdDev === 0 ? 0 : (log.rating - mean) / stdDev;

    // Flag if |z-score| > 2 (roughly 2 standard deviations)
    if (Math.abs(zScore) > 2) {
      anomalies.push({
        date: log.date?.toFormat("yyyy-MM-dd"),
        beans: log.beans || "Unknown",
        rating: log.rating,
        zScore: Math.round(zScore * 100) / 100,
        type: zScore > 0 ? "Exceptionally High" : "Unusually Low",
        deviation: Math.round(Math.abs(log.rating - mean) * 10) / 10
      });
    }
  });

  if (anomalies.length > 0) {
    dv.table(
      ["Date", "Beans", "Rating", "Z-Score", "Type", "Deviation from Avg"],
      anomalies.map(a => [
        a.date,
        a.beans,
        `${a.rating} ⭐`,
        a.zScore,
        a.type === "Exceptionally High" ? "🌟 High" : "⚠️ Low",
        `${a.deviation > 0 ? "+" : ""}${a.deviation}`
      ])
    );

    dv.paragraph(`
**Analysis**: ${anomalies.length} outlier${anomalies.length > 1 ? "s" : ""} detected in recent brews.
**Baseline**: ${Math.round(mean * 10) / 10} ⭐ average rating (σ = ${Math.round(stdDev * 100) / 100})
    `);
  } else {
    dv.paragraph("✅ No significant outliers detected. Your brewing is consistent!");
  }
}
```

## Parameter Anomalies

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p["water-temp"] && p["brew-time"])
  .array();

if (allLogs.length >= 10) {
  dv.header(3, "🔬 Parameter-Level Anomalies");

  // Calculate Z-scores for each parameter
  const calculateZScores = (values) => {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    return values.map((v, idx) => ({
      index: idx,
      value: v,
      zScore: stdDev === 0 ? 0 : (v - mean) / stdDev
    }));
  };

  const temps = allLogs.map(p => parseFloat(p["water-temp"]) || 200);
  const times = allLogs.map(p => parseFloat(p["brew-time"]) || 3);

  const tempZScores = calculateZScores(temps);
  const timeZScores = calculateZScores(times);

  const paramAnomalies = [];

  // Find temperature anomalies
  tempZScores.forEach(t => {
    if (Math.abs(t.zScore) > 2.5) {
      const log = allLogs[t.index];
      paramAnomalies.push({
        date: log.date?.toFormat("yyyy-MM-dd"),
        parameter: "Water Temp",
        value: `${t.value}°F`,
        zScore: Math.round(t.zScore * 100) / 100,
        rating: log.rating,
        impact: Math.abs(t.zScore) > 3 ? "Extreme" : "High"
      });
    }
  });

  // Find brew time anomalies
  timeZScores.forEach(t => {
    if (Math.abs(t.zScore) > 2.5) {
      const log = allLogs[t.index];
      paramAnomalies.push({
        date: log.date?.toFormat("yyyy-MM-dd"),
        parameter: "Brew Time",
        value: `${t.value} min`,
        zScore: Math.round(t.zScore * 100) / 100,
        rating: log.rating,
        impact: Math.abs(t.zScore) > 3 ? "Extreme" : "High"
      });
    }
  });

  if (paramAnomalies.length > 0) {
    // Sort by date
    paramAnomalies.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    dv.table(
      ["Date", "Parameter", "Value", "Z-Score", "Impact", "Rating"],
      paramAnomalies.slice(0, 10).map(a => [
        a.date,
        a.parameter,
        a.value,
        a.zScore,
        a.impact === "Extreme" ? "🔴 Extreme" : "🟡 High",
        `${a.rating} ⭐`
      ])
    );

    dv.paragraph(`
**Found**: ${paramAnomalies.length} unusual parameter setting${paramAnomalies.length > 1 ? "s" : ""}
**Interpretation**: These values deviate significantly (>2.5σ) from your typical brewing parameters.
    `);
  } else {
    dv.paragraph("✅ All brewing parameters within normal range.");
  }
}
```

## Quality Drop Detection

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.date && p.rating)
  .sort(p => p.date, "asc")
  .array();

if (allLogs.length >= 15) {
  dv.header(3, "📉 Quality Drop Analysis");

  // Calculate rolling average (window of 5)
  const windowSize = 5;
  const rollingAvgs = [];

  for (let i = windowSize - 1; i < allLogs.length; i++) {
    const window = allLogs.slice(i - windowSize + 1, i + 1);
    const avg = window.reduce((sum, p) => sum + p.rating, 0) / windowSize;
    rollingAvgs.push({
      index: i,
      date: allLogs[i].date?.toFormat("yyyy-MM-dd"),
      avg: Math.round(avg * 100) / 100,
      currentRating: allLogs[i].rating
    });
  }

  // Detect significant drops (current rating much lower than rolling avg)
  const qualityDrops = rollingAvgs.filter(r =>
    (r.avg - r.currentRating) > 0.8
  );

  if (qualityDrops.length > 0) {
    dv.table(
      ["Date", "Rating", "5-Brew Avg", "Drop Size", "Severity"],
      qualityDrops.map(d => {
        const drop = d.avg - d.currentRating;
        return [
          d.date,
          `${d.currentRating} ⭐`,
          `${d.avg} ⭐`,
          `-${Math.round(drop * 10) / 10}`,
          drop > 1.5 ? "🔴 Severe" : drop > 1.0 ? "🟡 Moderate" : "🟢 Mild"
        ];
      })
    );

    dv.paragraph(`
**Alert**: ${qualityDrops.length} significant quality drop${qualityDrops.length > 1 ? "s" : ""} detected.
**Action**: Review these brews to identify what went wrong.
    `);
  } else {
    dv.paragraph("✅ No significant quality drops detected. Consistent performance!");
  }
}
```

## Bean Performance Anomalies

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.beans && p.rating)
  .array();

if (allLogs.length >= 10) {
  dv.header(3, "☕ Unusual Bean Performance");

  const beanStats = {};

  allLogs.forEach(log => {
    const bean = log.beans || "Unknown";
    if (!beanStats[bean]) {
      beanStats[bean] = { ratings: [], count: 0, totalRating: 0 };
    }
    beanStats[bean].ratings.push(log.rating);
    beanStats[bean].count++;
    beanStats[bean].totalRating += log.rating;
  });

  // Find beans with high variance (inconsistent performance)
  const beanAnomalies = Object.entries(beanStats)
    .filter(([_, data]) => data.count >= 3)
    .map(([bean, data]) => {
      const avg = data.totalRating / data.count;
      const variance = data.ratings.reduce((sum, r) =>
        sum + Math.pow(r - avg, 2), 0
      ) / data.count;
      const stdDev = Math.sqrt(variance);

      // Calculate coefficient of variation (CV)
      const cv = (stdDev / avg) * 100;

      return {
        bean,
        count: data.count,
        avg: Math.round(avg * 10) / 10,
        stdDev: Math.round(stdDev * 100) / 100,
        cv: Math.round(cv),
        minRating: Math.min(...data.ratings),
        maxRating: Math.max(...data.ratings),
        range: Math.max(...data.ratings) - Math.min(...data.ratings)
      };
    })
    .sort((a, b) => b.cv - a.cv) // Sort by coefficient of variation
    .slice(0, 8);

  if (beanAnomalies.length > 0) {
    dv.table(
      ["Bean", "Brews", "Avg Rating", "Std Dev", "Range", "Consistency"],
      beanAnomalies.map(b => [
        b.bean,
        b.count,
        `${b.avg} ⭐`,
        b.stdDev,
        `${b.minRating} - ${b.maxRating}`,
        b.stdDev < 0.3 ? "✅ Consistent" :
        b.stdDev < 0.6 ? "⚠️ Variable" : "🔴 Highly Variable"
      ])
    );

    const highVariance = beanAnomalies.filter(b => b.stdDev >= 0.6);

    if (highVariance.length > 0) {
      dv.paragraph(`
⚠️ **High Variance Beans**: ${highVariance.map(b => b.bean).join(", ")}

These beans show inconsistent results. Possible causes:
- Brewing technique inconsistency
- Stale beans (quality degradation over time)
- Batch-to-batch variation from roaster
- Bean requires precise parameters

**Recommendation**: Standardize your process or switch to more consistent beans.
      `);
    }
  }
}
```

## Method-Specific Outliers

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p["brew-method"] && p.rating)
  .array();

if (allLogs.length >= 15) {
  dv.header(3, "🎯 Method-Specific Anomalies");

  const methodStats = {};

  allLogs.forEach(log => {
    const method = log["brew-method"] || "Unknown";
    if (!methodStats[method]) {
      methodStats[method] = { ratings: [], logs: [] };
    }
    methodStats[method].ratings.push(log.rating);
    methodStats[method].logs.push(log);
  });

  const methodOutliers = [];

  Object.entries(methodStats).forEach(([method, data]) => {
    if (data.ratings.length >= 5) {
      const mean = data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length;
      const variance = data.ratings.reduce((sum, r) =>
        sum + Math.pow(r - mean, 2), 0
      ) / data.ratings.length;
      const stdDev = Math.sqrt(variance);

      // Find outliers within this method
      data.logs.forEach(log => {
        const zScore = stdDev === 0 ? 0 : (log.rating - mean) / stdDev;

        if (Math.abs(zScore) > 2) {
          methodOutliers.push({
            date: log.date?.toFormat("yyyy-MM-dd"),
            method,
            beans: log.beans,
            rating: log.rating,
            methodAvg: Math.round(mean * 10) / 10,
            deviation: Math.round((log.rating - mean) * 10) / 10,
            type: zScore > 0 ? "Above Average" : "Below Average"
          });
        }
      });
    }
  });

  if (methodOutliers.length > 0) {
    // Sort by date (most recent first)
    methodOutliers.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    dv.table(
      ["Date", "Method", "Beans", "Rating", "Method Avg", "Deviation", "Type"],
      methodOutliers.slice(0, 10).map(o => [
        o.date,
        o.method,
        o.beans,
        `${o.rating} ⭐`,
        `${o.methodAvg} ⭐`,
        `${o.deviation > 0 ? "+" : ""}${o.deviation}`,
        o.type === "Above Average" ? "🌟" : "⚠️"
      ])
    );

    dv.paragraph(`
**Found**: ${methodOutliers.length} method-specific outlier${methodOutliers.length > 1 ? "s" : ""}
**Insight**: These brews performed unusually well or poorly for their respective methods.
    `);
  } else {
    dv.paragraph("✅ All methods showing consistent performance within expected ranges.");
  }
}
```

## Temporal Anomaly Detection

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.date && p.rating)
  .sort(p => p.date, "asc")
  .array();

if (allLogs.length >= 20) {
  dv.header(3, "📅 Temporal Pattern Anomalies");

  // Group by month
  const monthlyStats = {};

  allLogs.forEach(log => {
    const month = log.date.toFormat("yyyy-MM");
    if (!monthlyStats[month]) {
      monthlyStats[month] = { ratings: [], count: 0, totalRating: 0 };
    }
    monthlyStats[month].ratings.push(log.rating);
    monthlyStats[month].count++;
    monthlyStats[month].totalRating += log.rating;
  });

  const monthlyData = Object.entries(monthlyStats)
    .map(([month, data]) => ({
      month,
      count: data.count,
      avg: data.totalRating / data.count,
      variance: data.ratings.reduce((sum, r) => {
        const diff = r - (data.totalRating / data.count);
        return sum + (diff * diff);
      }, 0) / data.count
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  if (monthlyData.length >= 3) {
    // Calculate overall average
    const overallAvg = monthlyData.reduce((sum, m) => sum + m.avg, 0) / monthlyData.length;
    const avgVariance = monthlyData.reduce((sum, m) => sum + m.variance, 0) / monthlyData.length;
    const stdDev = Math.sqrt(avgVariance);

    // Find anomalous months
    const anomalousMonths = monthlyData.filter(m =>
      Math.abs(m.avg - overallAvg) > stdDev
    );

    if (anomalousMonths.length > 0) {
      dv.table(
        ["Month", "Brews", "Avg Rating", "Overall Avg", "Deviation", "Status"],
        anomalousMonths.map(m => {
          const deviation = m.avg - overallAvg;
          return [
            m.month,
            m.count,
            `${Math.round(m.avg * 10) / 10} ⭐`,
            `${Math.round(overallAvg * 10) / 10} ⭐`,
            `${deviation > 0 ? "+" : ""}${Math.round(deviation * 10) / 10}`,
            deviation > 0 ? "🌟 Above Avg" : "⚠️ Below Avg"
          ];
        })
      );

      dv.paragraph(`
**Alert**: ${anomalousMonths.length} month${anomalousMonths.length > 1 ? "s" : ""} with unusual performance detected.
**Analysis**: These months deviated significantly from your typical brewing quality.
      `);
    } else {
      dv.paragraph("✅ Consistent quality across all months!");
    }
  }
}
```

## Multi-Dimensional Anomaly Score

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.rating && p["water-temp"] && p["brew-time"])
  .sort(p => p.date, "desc")
  .limit(20)
  .array();

if (allLogs.length >= 10) {
  dv.header(3, "🎯 Composite Anomaly Scores");

  // Calculate normalized features
  const grindSizeMap = {
    'extra-fine': 1, 'fine': 2, 'medium-fine': 3, 'medium': 4,
    'medium-coarse': 5, 'coarse': 6, 'extra-coarse': 7
  };

  const parseRatio = (ratioStr) => {
    if (!ratioStr) return 16;
    const parts = String(ratioStr).split(':');
    return parts.length === 2 ? parseFloat(parts[1]) || 16 : 16;
  };

  // Extract features
  const features = allLogs.map(log => [
    parseFloat(log["water-temp"]) || 200,
    parseFloat(log["brew-time"]) || 3,
    grindSizeMap[log["grind-size"]] || 4,
    parseRatio(log.ratio),
    log.rating || 3
  ]);

  // Calculate means and std devs
  const numFeatures = features[0].length;
  const means = Array(numFeatures).fill(0);
  const stdDevs = Array(numFeatures).fill(0);

  // Calculate means
  features.forEach(f => {
    f.forEach((val, i) => means[i] += val);
  });
  means.forEach((_, i) => means[i] /= features.length);

  // Calculate std devs
  features.forEach(f => {
    f.forEach((val, i) => {
      stdDevs[i] += Math.pow(val - means[i], 2);
    });
  });
  stdDevs.forEach((_, i) => stdDevs[i] = Math.sqrt(stdDevs[i] / features.length));

  // Calculate anomaly scores (Mahalanobis-like distance)
  const anomalyScores = features.map((f, idx) => {
    const score = f.reduce((sum, val, i) => {
      const zScore = stdDevs[i] === 0 ? 0 : Math.abs(val - means[i]) / stdDevs[i];
      return sum + (zScore * zScore);
    }, 0);

    return {
      log: allLogs[idx],
      score: Math.sqrt(score),
      rating: allLogs[idx].rating
    };
  }).sort((a, b) => b.score - a.score);

  dv.table(
    ["Date", "Beans", "Rating", "Anomaly Score", "Status"],
    anomalyScores.slice(0, 10).map(a => [
      a.log.date?.toFormat("yyyy-MM-dd"),
      a.log.beans || "Unknown",
      `${a.rating} ⭐`,
      Math.round(a.score * 100) / 100,
      a.score > 3 ? "🔴 High Anomaly" :
      a.score > 2 ? "🟡 Moderate" : "🟢 Normal"
    ])
  );

  dv.paragraph(`
**Anomaly Score**: Measures how unusual a brew is across all parameters simultaneously.
- **> 3.0**: Highly unusual combination of parameters
- **2.0-3.0**: Moderately unusual
- **< 2.0**: Within normal range

**Highest anomaly**: ${anomalyScores[0].log.beans} (score: ${Math.round(anomalyScores[0].score * 100) / 100})
  `);
}
```

## Anomaly Recommendations

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.rating)
  .array();

if (allLogs.length >= 10) {
  dv.header(3, "💡 Anomaly Insights & Recommendations");

  const recommendations = [];

  // Calculate baseline statistics
  const ratings = allLogs.map(p => p.rating || 0);
  const mean = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  const variance = ratings.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / ratings.length;
  const stdDev = Math.sqrt(variance);

  // High variance warning
  if (stdDev > 0.7) {
    recommendations.push(`⚠️ **High Variability Detected**: Your brewing quality varies significantly (σ = ${Math.round(stdDev * 100) / 100}). Focus on process standardization.`);
  } else if (stdDev < 0.3) {
    recommendations.push(`✅ **Excellent Consistency**: Low variability (σ = ${Math.round(stdDev * 100) / 100}) indicates well-controlled process.`);
  }

  // Check for recent outliers
  const recent = allLogs.filter(p => p.date).sort((a, b) => b.date - a.date).slice(0, 10);
  const recentOutliers = recent.filter(log => {
    const zScore = stdDev === 0 ? 0 : Math.abs(log.rating - mean) / stdDev;
    return zScore > 2;
  });

  if (recentOutliers.length >= 3) {
    recommendations.push(`🔔 **Recent Instability**: ${recentOutliers.length} outliers in last 10 brews. Review your recent technique changes.`);
  }

  // Bean consistency check
  const beanStats = {};
  allLogs.forEach(log => {
    const bean = log.beans || "Unknown";
    if (!beanStats[bean]) beanStats[bean] = [];
    beanStats[bean].push(log.rating);
  });

  const inconsistentBeans = Object.entries(beanStats)
    .filter(([_, ratings]) => ratings.length >= 3)
    .filter(([_, ratings]) => {
      const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      const v = ratings.reduce((sum, r) => sum + Math.pow(r - avg, 2), 0) / ratings.length;
      return Math.sqrt(v) > 0.8;
    });

  if (inconsistentBeans.length > 0) {
    recommendations.push(`☕ **Inconsistent Beans**: ${inconsistentBeans[0][0]} shows high variance. Consider switching or refining technique.`);
  }

  // Success rate
  const excellentBrews = allLogs.filter(p => p.rating >= 4.3).length;
  const successRate = (excellentBrews / allLogs.length) * 100;

  if (successRate < 30) {
    recommendations.push(`📊 **Low Success Rate**: Only ${Math.round(successRate)}% of brews rated 4.3+. Review optimal parameters in other dashboards.`);
  } else if (successRate > 70) {
    recommendations.push(`🏆 **High Success Rate**: ${Math.round(successRate)}% excellent brews! Maintain your current approach.`);
  }

  if (recommendations.length === 0) {
    recommendations.push("✅ No significant anomalies or concerns detected. Keep brewing!");
  }

  recommendations.forEach(rec => dv.paragraph(rec));
}
```

---

## Related Dashboards

- [[5-Quality-Predictor|Quality Predictor]]
- [[6-Correlation-Discovery-Engine|Correlation Discovery]]
- [[8-Multi-Variable-Recommendation-Engine|AI Recommendations]]
- [[Coffee Dashboard|Main Dashboard]]

---

*Detection Methods: Z-Score Analysis, Rolling Averages, Multi-Dimensional Distance*
*Threshold: 2σ for standard anomalies, 2.5σ for parameter anomalies*
*Last Updated: `= date(today)`*
