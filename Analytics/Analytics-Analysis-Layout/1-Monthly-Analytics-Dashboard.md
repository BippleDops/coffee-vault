---
title: Monthly Analytics Dashboard
type: analytics-dashboard
category: comprehensive-statistics
created: 2025-10-26
tags: [analytics, monthly, statistics, overview]
---

# Monthly Analytics Dashboard

> Comprehensive monthly statistics with trend analysis and performance insights

## Current Month Overview

```dataviewjs
const currentMonth = dv.date("now").toFormat("yyyy-MM");
const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.date && p.date.toFormat("yyyy-MM") === currentMonth);

const totalBrews = logs.length;
const avgRating = logs.length > 0
  ? Math.round(logs.array().reduce((sum, p) => sum + (p.rating || 0), 0) / logs.length * 10) / 10
  : 0;

const topRated = logs.sort(p => p.rating, "desc").limit(1).array()[0];
const uniqueBeans = new Set(logs.array().map(p => p.beans)).size;
const uniqueMethods = new Set(logs.array().map(p => p["brew-method"])).size;

dv.header(3, "📊 Key Metrics");
dv.paragraph(`
**Total Brews**: ${totalBrews} cups ☕
**Average Rating**: ${avgRating}/5.0 ⭐
**Unique Beans**: ${uniqueBeans} varieties
**Brewing Methods**: ${uniqueMethods} different methods
**Best Brew**: ${topRated ? topRated.beans + " (" + topRated.rating + "⭐)" : "N/A"}
`);
```

## Rating Distribution Analysis

```dataviewjs
const currentMonth = dv.date("now").toFormat("yyyy-MM");
const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.date && p.date.toFormat("yyyy-MM") === currentMonth)
  .array();

if (logs.length === 0) {
  dv.paragraph("No coffee logs found for this month. Start brewing!");
} else {
  // Rating distribution
  const ratingBuckets = {
    "5.0": 0, "4.5-4.9": 0, "4.0-4.4": 0, "3.5-3.9": 0, "3.0-3.4": 0, "< 3.0": 0
  };

  logs.forEach(log => {
    const rating = log.rating || 0;
    if (rating === 5.0) ratingBuckets["5.0"]++;
    else if (rating >= 4.5) ratingBuckets["4.5-4.9"]++;
    else if (rating >= 4.0) ratingBuckets["4.0-4.4"]++;
    else if (rating >= 3.5) ratingBuckets["3.5-3.9"]++;
    else if (rating >= 3.0) ratingBuckets["3.0-3.4"]++;
    else ratingBuckets["< 3.0"]++;
  });

  dv.header(4, "Rating Breakdown");
  dv.table(
    ["Rating Range", "Count", "Percentage", "Visual"],
    Object.entries(ratingBuckets).map(([range, count]) => {
      const pct = Math.round((count / logs.length) * 100);
      const bar = "█".repeat(Math.floor(pct / 5));
      return [range, count, `${pct}%`, bar];
    })
  );

  // Quality score
  const excellentCount = ratingBuckets["5.0"] + ratingBuckets["4.5-4.9"];
  const qualityScore = Math.round((excellentCount / logs.length) * 100);

  dv.paragraph(`**Quality Score**: ${qualityScore}% of brews rated 4.5+ ⭐`);
}
```

## Brewing Method Performance

```dataviewjs
const currentMonth = dv.date("now").toFormat("yyyy-MM");
const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.date && p.date.toFormat("yyyy-MM") === currentMonth)
  .array();

if (logs.length > 0) {
  // Group by brew method
  const methodStats = {};

  logs.forEach(log => {
    const method = log["brew-method"] || "Unknown";
    if (!methodStats[method]) {
      methodStats[method] = { count: 0, totalRating: 0, ratings: [] };
    }
    methodStats[method].count++;
    methodStats[method].totalRating += log.rating || 0;
    methodStats[method].ratings.push(log.rating || 0);
  });

  // Calculate averages and consistency
  const methodAnalysis = Object.entries(methodStats).map(([method, stats]) => {
    const avgRating = Math.round((stats.totalRating / stats.count) * 10) / 10;
    const variance = stats.ratings.reduce((sum, r) => {
      const diff = r - avgRating;
      return sum + (diff * diff);
    }, 0) / stats.count;
    const consistency = Math.round((1 - Math.min(variance, 1)) * 100);

    return {
      method,
      count: stats.count,
      avgRating,
      consistency: `${consistency}%`
    };
  }).sort((a, b) => b.avgRating - a.avgRating);

  dv.header(4, "Method Performance Ranking");
  dv.table(
    ["Brew Method", "Brews", "Avg Rating", "Consistency", "Recommendation"],
    methodAnalysis.map(m => {
      const rec = m.avgRating >= 4.3 ? "🏆 Excellent" :
                  m.avgRating >= 3.8 ? "✅ Good" :
                  "🔧 Needs tuning";
      return [m.method, m.count, m.avgRating, m.consistency, rec];
    })
  );
}
```

## ML-Powered Trend Analysis

```dataviewjs
const currentMonth = dv.date("now").toFormat("yyyy-MM");
const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.date)
  .sort(p => p.date, "asc")
  .array();

if (logs.length >= 5) {
  // Calculate rolling average (7-day window)
  const currentMonthLogs = logs.filter(p => p.date.toFormat("yyyy-MM") === currentMonth);

  if (currentMonthLogs.length >= 3) {
    const ratings = currentMonthLogs.map(p => p.rating || 0);
    const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;

    // Simple linear regression for trend
    const n = ratings.length;
    const xValues = ratings.map((_, i) => i);
    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = ratings.reduce((a, b) => a + b, 0);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * ratings[i], 0);
    const sumX2 = xValues.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

    const trend = slope > 0.05 ? "📈 Improving" :
                  slope < -0.05 ? "📉 Declining" :
                  "➡️ Stable";

    const trendValue = Math.round(slope * 100) / 100;

    dv.header(4, "Quality Trend Analysis");
    dv.paragraph(`
**Trend Direction**: ${trend}
**Trend Coefficient**: ${trendValue}
**Current Average**: ${Math.round(avgRating * 10) / 10}/5.0
**Interpretation**: ${slope > 0.05 ? "Your brewing skills are improving! Keep it up." :
                      slope < -0.05 ? "Consider reviewing your technique or trying new beans." :
                      "Consistent quality - maintain your current approach."}
    `);
  }
}
```

## Bean Performance Rankings

```dataviewjs
const currentMonth = dv.date("now").toFormat("yyyy-MM");
const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.date && p.date.toFormat("yyyy-MM") === currentMonth)
  .array();

if (logs.length > 0) {
  // Group by bean
  const beanStats = {};

  logs.forEach(log => {
    const bean = log.beans || "Unknown";
    if (!beanStats[bean]) {
      beanStats[bean] = {
        count: 0,
        totalRating: 0,
        roaster: log.roaster || "N/A",
        origin: log.origin || "N/A"
      };
    }
    beanStats[bean].count++;
    beanStats[bean].totalRating += log.rating || 0;
  });

  const beanRankings = Object.entries(beanStats)
    .map(([bean, stats]) => ({
      bean,
      roaster: stats.roaster,
      origin: stats.origin,
      count: stats.count,
      avgRating: Math.round((stats.totalRating / stats.count) * 10) / 10
    }))
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 10);

  dv.header(4, "Top Performing Beans");
  dv.table(
    ["Bean", "Origin", "Roaster", "Brews", "Avg Rating"],
    beanRankings.map(b => [b.bean, b.origin, b.roaster, b.count, `${b.avgRating} ⭐`])
  );
}
```

## Parameter Optimization Insights

```dataviewjs
const currentMonth = dv.date("now").toFormat("yyyy-MM");
const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.date && p.date.toFormat("yyyy-MM") === currentMonth)
  .array();

if (logs.length >= 5) {
  // Analyze high-rated brews (4.0+)
  const topBrews = logs.filter(p => p.rating >= 4.0);

  if (topBrews.length > 0) {
    // Calculate optimal parameters
    const avgTemp = Math.round(
      topBrews.reduce((sum, p) => sum + (parseFloat(p["water-temp"]) || 200), 0) / topBrews.length
    );

    const avgTime = Math.round(
      topBrews.reduce((sum, p) => sum + (parseFloat(p["brew-time"]) || 3), 0) / topBrews.length * 10
    ) / 10;

    // Most common grind size
    const grindCounts = {};
    topBrews.forEach(p => {
      const grind = p["grind-size"] || "unknown";
      grindCounts[grind] = (grindCounts[grind] || 0) + 1;
    });
    const optimalGrind = Object.entries(grindCounts).sort((a, b) => b[1] - a[1])[0][0];

    dv.header(4, "Optimal Parameters (from 4.0+ rated brews)");
    dv.paragraph(`
**Water Temperature**: ${avgTemp}°F
**Brew Time**: ${avgTime} minutes
**Grind Size**: ${optimalGrind}
**Sample Size**: ${topBrews.length} excellent brews

💡 **Recommendation**: Use these parameters as your baseline for consistent quality.
    `);
  }
}
```

## Month-over-Month Comparison

```dataviewjs
const currentMonth = dv.date("now").toFormat("yyyy-MM");
const lastMonth = dv.date("now").minus({ months: 1 }).toFormat("yyyy-MM");

const currentLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.date && p.date.toFormat("yyyy-MM") === currentMonth)
  .array();

const lastLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.date && p.date.toFormat("yyyy-MM") === lastMonth)
  .array();

if (currentLogs.length > 0 || lastLogs.length > 0) {
  const currentAvg = currentLogs.length > 0
    ? Math.round(currentLogs.reduce((sum, p) => sum + (p.rating || 0), 0) / currentLogs.length * 10) / 10
    : 0;

  const lastAvg = lastLogs.length > 0
    ? Math.round(lastLogs.reduce((sum, p) => sum + (p.rating || 0), 0) / lastLogs.length * 10) / 10
    : 0;

  const brewChange = currentLogs.length - lastLogs.length;
  const ratingChange = currentAvg - lastAvg;

  dv.header(4, "Performance vs Last Month");
  dv.table(
    ["Metric", "Last Month", "This Month", "Change"],
    [
      ["Total Brews", lastLogs.length, currentLogs.length,
       `${brewChange >= 0 ? '+' : ''}${brewChange} ${brewChange >= 0 ? '📈' : '📉'}`],
      ["Avg Rating", lastAvg, currentAvg,
       `${ratingChange >= 0 ? '+' : ''}${Math.round(ratingChange * 10) / 10} ${ratingChange >= 0 ? '⬆️' : '⬇️'}`],
      ["Unique Beans",
       new Set(lastLogs.map(p => p.beans)).size,
       new Set(currentLogs.map(p => p.beans)).size,
       new Set(currentLogs.map(p => p.beans)).size - new Set(lastLogs.map(p => p.beans)).size]
    ]
  );
}
```

## ML-Generated Recommendations

```dataviewjs
const currentMonth = dv.date("now").toFormat("yyyy-MM");
const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.date && p.date.toFormat("yyyy-MM") === currentMonth)
  .array();

dv.header(4, "AI-Powered Insights");

if (logs.length < 5) {
  dv.paragraph("📊 Brew at least 5 cups this month to unlock ML-powered recommendations!");
} else {
  const recommendations = [];

  // Consistency analysis
  const ratings = logs.map(p => p.rating || 0);
  const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  const variance = ratings.reduce((sum, r) => sum + Math.pow(r - avgRating, 2), 0) / ratings.length;

  if (variance > 0.5) {
    recommendations.push("🎯 High variance detected. Focus on consistency by standardizing your process.");
  }

  // Method diversity
  const methods = new Set(logs.map(p => p["brew-method"])).size;
  if (methods === 1) {
    recommendations.push("🌈 Consider experimenting with different brewing methods to expand your skills.");
  } else if (methods > 4) {
    recommendations.push("🎓 Great method diversity! You're exploring different brewing techniques.");
  }

  // Quality improvement
  const topRated = logs.filter(p => p.rating >= 4.5).length;
  const qualityRatio = topRated / logs.length;

  if (qualityRatio < 0.3) {
    recommendations.push("⚡ Less than 30% of brews rated 4.5+. Review optimal parameters above.");
  } else if (qualityRatio > 0.6) {
    recommendations.push("🏆 Outstanding! Over 60% of brews are excellent quality.");
  }

  // Bean experimentation
  const uniqueBeans = new Set(logs.map(p => p.beans)).size;
  if (uniqueBeans < 3 && logs.length > 10) {
    recommendations.push("☕ Try new beans to discover different flavor profiles.");
  }

  if (recommendations.length === 0) {
    recommendations.push("✅ All systems optimal! Keep brewing at this level.");
  }

  recommendations.forEach(rec => dv.paragraph(rec));
}
```

---

## Quick Actions

- [[2-Brewing-Optimization-Engine|Optimize Your Brewing]]
- [[3-Cost-Intelligence-System|View Cost Analysis]]
- [[5-Quality-Predictor|Predict Next Brew Quality]]
- [[Coffee Dashboard|Back to Main Dashboard]]

---

*Last Updated: `= date(today)`*
*Data Source: Coffee Logs folder*
*ML Engine: v1.0*
