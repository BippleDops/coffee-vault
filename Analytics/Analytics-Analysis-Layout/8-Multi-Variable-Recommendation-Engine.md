---
title: Multi-Variable Recommendation Engine
type: analytics-dashboard
category: ml-recommendation
created: 2025-10-26
tags: [analytics, ml, ai, recommendations, ensemble, integrated]
---

# Multi-Variable Recommendation Engine

> Integrated AI insights combining all ML algorithms for comprehensive brewing recommendations

## AI-Powered Personalized Recommendations

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.rating)
  .array();

if (allLogs.length < 10) {
  dv.header(3, "🤖 AI Recommendation Engine");
  dv.paragraph(`
**Status**: Gathering data...

**Current Logs**: ${allLogs.length}
**Required**: 10 minimum (50+ recommended for best results)

Keep brewing! Once you have 10+ logs with complete parameters, the AI will generate personalized recommendations across multiple dimensions:
- Optimal brewing parameters
- Bean selection guidance
- Method recommendations
- Quality optimization strategies
- Cost-effectiveness insights
  `);
} else {
  dv.header(3, "🤖 AI Status");
  dv.paragraph(`
✅ **AI Engine Ready**
- Training Data: ${allLogs.length} brews
- Confidence Level: ${allLogs.length >= 50 ? "Very High" : allLogs.length >= 30 ? "High" : "Moderate"}
- Algorithms Active: KNN, K-Means, Linear Regression, Anomaly Detection
  `);
}
```

## Top Priority Recommendations

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.rating)
  .sort(p => p.date, "desc")
  .array();

if (allLogs.length >= 10) {
  dv.header(3, "🎯 High-Priority Actions");

  const recommendations = [];
  const recentLogs = allLogs.slice(0, 20);

  // 1. Quality Assessment
  const avgRating = recentLogs.reduce((sum, p) => sum + p.rating, 0) / recentLogs.length;
  const allTimeAvg = allLogs.reduce((sum, p) => sum + p.rating, 0) / allLogs.length;

  if (avgRating < 3.8) {
    recommendations.push({
      priority: 1,
      category: "Quality Optimization",
      issue: `Recent average (${Math.round(avgRating * 10) / 10}⭐) below target`,
      action: "Review optimal parameters in Brewing Optimization Engine",
      impact: "High",
      urgency: "Immediate"
    });
  }

  // 2. Consistency Check
  const ratings = recentLogs.map(p => p.rating || 0);
  const variance = ratings.reduce((sum, r) => {
    const diff = r - avgRating;
    return sum + (diff * diff);
  }, 0) / ratings.length;

  if (variance > 0.6) {
    recommendations.push({
      priority: 2,
      category: "Consistency",
      issue: `High variance detected (σ² = ${Math.round(variance * 100) / 100})`,
      action: "Standardize brewing process and measure parameters precisely",
      impact: "High",
      urgency: "Soon"
    });
  }

  // 3. Parameter Optimization
  const topRatedLogs = allLogs.filter(p => p.rating >= 4.3);
  if (topRatedLogs.length >= 5) {
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

    const optimalTemp = Math.round(
      topRatedLogs.reduce((sum, p) => sum + (parseFloat(p["water-temp"]) || 200), 0) / topRatedLogs.length
    );

    const optimalTime = Math.round(
      topRatedLogs.reduce((sum, p) => sum + (parseFloat(p["brew-time"]) || 3), 0) / topRatedLogs.length * 10
    ) / 10;

    // Check if recent brews deviate from optimal
    const recentWithParams = recentLogs.filter(p => p["water-temp"] && p["brew-time"]);
    if (recentWithParams.length >= 3) {
      const recentAvgTemp = recentWithParams.reduce((sum, p) =>
        sum + parseFloat(p["water-temp"]), 0
      ) / recentWithParams.length;

      const tempDeviation = Math.abs(recentAvgTemp - optimalTemp);

      if (tempDeviation > 10) {
        recommendations.push({
          priority: 3,
          category: "Parameter Adjustment",
          issue: `Water temp ${Math.round(tempDeviation)}°F from optimal`,
          action: `Target ${optimalTemp}°F (currently averaging ${Math.round(recentAvgTemp)}°F)`,
          impact: "Medium",
          urgency: "Next Brew"
        });
      }
    }
  }

  // 4. Bean Diversity
  const uniqueBeans = new Set(recentLogs.map(p => p.beans).filter(b => b)).size;
  if (uniqueBeans < 2 && recentLogs.length > 10) {
    recommendations.push({
      priority: 4,
      category: "Experimentation",
      issue: "Limited bean variety in recent brews",
      action: "Try new origins or roasters to expand palate",
      impact: "Low",
      urgency: "When Convenient"
    });
  }

  // 5. Cost Efficiency
  const estimatedCostPerBrew = 2.50;
  const qualityBrews = recentLogs.filter(p => p.rating >= 4.0).length;
  const wastedCost = (recentLogs.length - qualityBrews) * estimatedCostPerBrew;

  if (wastedCost > 15 && qualityBrews / recentLogs.length < 0.5) {
    recommendations.push({
      priority: 5,
      category: "Cost Optimization",
      issue: `~$${wastedCost.toFixed(2)} on sub-4.0 brews recently`,
      action: "Follow optimal parameters to reduce waste",
      impact: "Medium",
      urgency: "Ongoing"
    });
  }

  // 6. Skill Development
  const trend = avgRating - allTimeAvg;
  if (trend < -0.3) {
    recommendations.push({
      priority: 2,
      category: "Skill Regression",
      issue: `Recent quality down ${Math.round(Math.abs(trend) * 10) / 10}⭐ from average`,
      action: "Return to proven methods and review technique",
      impact: "High",
      urgency: "Immediate"
    });
  } else if (trend > 0.3) {
    recommendations.push({
      priority: 6,
      category: "Progress Recognition",
      issue: `Quality improved ${Math.round(trend * 10) / 10}⭐ recently!`,
      action: "Document what's working and maintain consistency",
      impact: "Positive",
      urgency: "Celebrate"
    });
  }

  if (recommendations.length > 0) {
    // Sort by priority
    recommendations.sort((a, b) => a.priority - b.priority);

    dv.table(
      ["Priority", "Category", "Issue", "Recommended Action", "Impact", "Urgency"],
      recommendations.map(r => [
        r.priority,
        r.category,
        r.issue,
        r.action,
        r.impact === "High" ? "🔴 High" :
        r.impact === "Medium" ? "🟡 Medium" :
        r.impact === "Low" ? "🟢 Low" : "✨ Positive",
        r.urgency
      ])
    );
  } else {
    dv.paragraph("🎉 **All Systems Optimal!** No critical recommendations. Keep brewing!");
  }
}
```

## Integrated Brewing Recipe

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.rating >= 4.0)
  .array();

if (allLogs.length >= 5) {
  dv.header(3, "☕ AI-Generated Optimal Recipe");

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

  // Most successful method
  const methodStats = {};
  allLogs.forEach(log => {
    const method = log["brew-method"] || "Unknown";
    if (!methodStats[method]) {
      methodStats[method] = { count: 0, totalRating: 0 };
    }
    methodStats[method].count++;
    methodStats[method].totalRating += log.rating;
  });

  const bestMethod = Object.entries(methodStats)
    .sort((a, b) => (b[1].totalRating / b[1].count) - (a[1].totalRating / a[1].count))[0];

  // Best performing bean
  const beanStats = {};
  allLogs.forEach(log => {
    const bean = log.beans || "Unknown";
    if (!beanStats[bean]) {
      beanStats[bean] = { count: 0, totalRating: 0 };
    }
    beanStats[bean].count++;
    beanStats[bean].totalRating += log.rating;
  });

  const bestBean = Object.entries(beanStats)
    .filter(([_, data]) => data.count >= 2)
    .sort((a, b) => (b[1].totalRating / b[1].count) - (a[1].totalRating / a[1].count))[0];

  const expectedRating = Math.round(
    allLogs.reduce((sum, p) => sum + p.rating, 0) / allLogs.length * 10
  ) / 10;

  dv.paragraph(`
**Your Personalized Recipe** (Based on ${allLogs.length} excellent brews):

🔹 **Method**: ${bestMethod[0]}
🔹 **Water Temperature**: ${optimalTemp}°F
🔹 **Brew Time**: ${optimalTime} minutes
🔹 **Grind Size**: ${optimalGrind}
🔹 **Coffee:Water Ratio**: 1:${optimalRatio}
🔹 **Recommended Bean**: ${bestBean ? bestBean[0] : "Any from your top performers"}

**Expected Quality**: ${expectedRating} ⭐
**Success Rate**: ${Math.round((allLogs.length / dv.pages('"Coffee Logs"').where(p => p.type === "coffee-log").array().length) * 100)}%
**Confidence**: ${allLogs.length >= 20 ? "Very High ✅" : allLogs.length >= 10 ? "High ✅" : "Moderate ⚠️"}

💡 **Pro Tip**: Following this recipe should consistently yield ${expectedRating}+ rated cups!
  `);
}
```

## Method-Specific AI Recommendations

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p["brew-method"])
  .array();

if (allLogs.length >= 15) {
  dv.header(3, "🎯 Method-Specific Optimization");

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

  const methodRecommendations = Object.entries(methodStats)
    .filter(([_, data]) => data.count >= 3)
    .map(([method, data]) => {
      const avgRating = data.totalRating / data.count;
      const topLogs = data.logs.filter(p => p.rating >= 4.0);

      const parseRatio = (ratioStr) => {
        if (!ratioStr) return 16;
        const parts = String(ratioStr).split(':');
        return parts.length === 2 ? parseFloat(parts[1]) || 16 : 16;
      };

      let recommendation = "";

      if (topLogs.length >= 2) {
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

        recommendation = `${optimalTemp}°F, ${optimalTime}min, ${optimalGrind} grind`;
      } else {
        recommendation = "Need more data";
      }

      return {
        method,
        brews: data.count,
        avgRating: Math.round(avgRating * 10) / 10,
        topBrews: topLogs.length,
        recommendation,
        status: avgRating >= 4.2 ? "Mastered" :
                avgRating >= 3.8 ? "Proficient" :
                avgRating >= 3.3 ? "Learning" : "Needs Work"
      };
    })
    .sort((a, b) => b.avgRating - a.avgRating);

  if (methodRecommendations.length > 0) {
    dv.table(
      ["Method", "Brews", "Avg Rating", "Status", "Optimal Recipe"],
      methodRecommendations.map(m => [
        m.method,
        m.brews,
        `${m.avgRating} ⭐`,
        m.status === "Mastered" ? "🏆 Mastered" :
        m.status === "Proficient" ? "✅ Proficient" :
        m.status === "Learning" ? "📚 Learning" : "🔧 Needs Work",
        m.recommendation
      ])
    );
  }
}
```

## Bean Selection AI

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.beans && p.rating)
  .array();

if (allLogs.length >= 10) {
  dv.header(3, "☕ Smart Bean Selection");

  const beanStats = {};

  allLogs.forEach(log => {
    const bean = log.beans || "Unknown";
    if (!beanStats[bean]) {
      beanStats[bean] = {
        ratings: [],
        count: 0,
        totalRating: 0,
        origin: log.origin,
        roaster: log.roaster
      };
    }
    beanStats[bean].ratings.push(log.rating);
    beanStats[bean].count++;
    beanStats[bean].totalRating += log.rating;
  });

  const beanRecommendations = Object.entries(beanStats)
    .filter(([_, data]) => data.count >= 2)
    .map(([bean, data]) => {
      const avgRating = data.totalRating / data.count;

      // Calculate consistency
      const variance = data.ratings.reduce((sum, r) => {
        const diff = r - avgRating;
        return sum + (diff * diff);
      }, 0) / data.count;
      const consistency = Math.round(Math.max(0, (1 - variance)) * 100);

      // Calculate value score (quality per estimated cost)
      const estimatedCost = 2.50;
      const valueScore = avgRating / estimatedCost;

      return {
        bean,
        origin: data.origin || "Unknown",
        roaster: String(data.roaster || "Unknown").replace(/\[\[|\]\]/g, ""),
        brews: data.count,
        avgRating: Math.round(avgRating * 10) / 10,
        consistency,
        valueScore: Math.round(valueScore * 100) / 100,
        recommendation: avgRating >= 4.3 && consistency >= 70 ? "Highly Recommended" :
                       avgRating >= 4.0 && consistency >= 60 ? "Recommended" :
                       avgRating >= 3.5 ? "Acceptable" : "Consider Alternatives"
      };
    })
    .sort((a, b) => {
      // Sort by combination of rating and consistency
      const scoreA = a.avgRating * (a.consistency / 100);
      const scoreB = b.avgRating * (b.consistency / 100);
      return scoreB - scoreA;
    })
    .slice(0, 10);

  dv.table(
    ["Bean", "Origin", "Brews", "Avg Rating", "Consistency", "AI Recommendation"],
    beanRecommendations.map(b => [
      b.bean,
      b.origin,
      b.brews,
      `${b.avgRating} ⭐`,
      `${b.consistency}%`,
      b.recommendation === "Highly Recommended" ? "🏆 Highly Recommended" :
      b.recommendation === "Recommended" ? "✅ Recommended" :
      b.recommendation === "Acceptable" ? "⚠️ Acceptable" : "❌ Consider Alternatives"
    ])
  );

  dv.paragraph(`
**Bean Selection Strategy**:
- 🏆 **Highly Recommended**: 4.3+ rating with 70%+ consistency
- ✅ **Recommended**: 4.0+ rating with 60%+ consistency
- ⚠️ **Acceptable**: 3.5+ rating but may be inconsistent
- ❌ **Consider Alternatives**: Below 3.5 or highly inconsistent
  `);
}
```

## Predictive Quality Forecast

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.rating && p["water-temp"] && p["brew-time"])
  .array();

if (allLogs.length >= 10) {
  dv.header(3, "🔮 Next Brew Quality Forecast");

  const grindSizeMap = {
    'extra-fine': 1, 'fine': 2, 'medium-fine': 3, 'medium': 4,
    'medium-coarse': 5, 'coarse': 6, 'extra-coarse': 7
  };

  const parseRatio = (ratioStr) => {
    if (!ratioStr) return 16;
    const parts = String(ratioStr).split(':');
    return parts.length === 2 ? parseFloat(parts[1]) || 16 : 16;
  };

  // Prepare training data
  const trainingData = allLogs.map(log => ({
    features: [
      parseFloat(log["water-temp"]) || 200,
      parseFloat(log["brew-time"]) || 3,
      grindSizeMap[log["grind-size"]] || 4,
      parseRatio(log.ratio)
    ],
    rating: log.rating || 3
  }));

  // Test prediction with optimal parameters
  const topRated = allLogs.filter(p => p.rating >= 4.0);
  if (topRated.length >= 3) {
    const optimalParams = [
      Math.round(topRated.reduce((sum, p) => sum + parseFloat(p["water-temp"]), 0) / topRated.length),
      Math.round(topRated.reduce((sum, p) => sum + parseFloat(p["brew-time"]), 0) / topRated.length * 10) / 10,
      Math.round(topRated.reduce((sum, p) => sum + (grindSizeMap[p["grind-size"]] || 4), 0) / topRated.length),
      Math.round(topRated.reduce((sum, p) => sum + parseRatio(p.ratio), 0) / topRated.length)
    ];

    // KNN prediction (k=5)
    const distances = trainingData.map(sample => {
      const dist = Math.sqrt(
        optimalParams.reduce((sum, val, i) =>
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

    // Calculate confidence
    const avgPredicted = predicted;
    const variance = nearest.reduce((sum, n) =>
      sum + Math.pow(n.rating - avgPredicted, 2), 0
    ) / nearest.length;
    const confidence = Math.round(Math.max(0, (1 - variance) * 100));

    const reverseGrindMap = {
      1: 'extra-fine', 2: 'fine', 3: 'medium-fine', 4: 'medium',
      5: 'medium-coarse', 6: 'coarse', 7: 'extra-coarse'
    };

    dv.paragraph(`
**If you brew with optimal parameters**:

📋 **Parameters**:
- Water Temp: ${optimalParams[0]}°F
- Brew Time: ${optimalParams[1]} minutes
- Grind Size: ${reverseGrindMap[optimalParams[2]]}
- Ratio: 1:${optimalParams[3]}

🎯 **Predicted Quality**: ${Math.round(predicted * 10) / 10} ⭐
📊 **Confidence**: ${confidence}%
🔍 **Based on**: ${k} similar historical brews

${predicted >= 4.5 ? "🏆 **Excellent!** This should produce an outstanding cup!" :
  predicted >= 4.0 ? "✅ **Great!** This should be a very good brew." :
  predicted >= 3.5 ? "⚠️ **Good.** Solid quality expected." :
  "🔧 **Fair.** Consider reviewing parameters."}
    `);
  }
}
```

## Learning Progress & Trajectory

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.date && p.rating)
  .sort(p => p.date, "asc")
  .array();

if (allLogs.length >= 20) {
  dv.header(3, "📈 Your Coffee Journey Analytics");

  // Calculate trend using linear regression
  const ratings = allLogs.map((p, i) => ({ x: i, y: p.rating }));

  const n = ratings.length;
  const sumX = ratings.reduce((sum, p) => sum + p.x, 0);
  const sumY = ratings.reduce((sum, p) => sum + p.y, 0);
  const sumXY = ratings.reduce((sum, p) => sum + p.x * p.y, 0);
  const sumX2 = ratings.reduce((sum, p) => sum + p.x * p.x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Project next 10 brews
  const nextBrew = n;
  const projected = slope * nextBrew + intercept;

  const trend = slope > 0.01 ? "Improving" :
                slope < -0.01 ? "Declining" : "Stable";

  // Calculate milestones
  const excellentBrews = allLogs.filter(p => p.rating >= 4.5).length;
  const goodBrews = allLogs.filter(p => p.rating >= 4.0).length;
  const avgRating = allLogs.reduce((sum, p) => sum + p.rating, 0) / allLogs.length;

  dv.paragraph(`
**Journey Statistics**:
- Total Brews: ${allLogs.length}
- Average Rating: ${Math.round(avgRating * 10) / 10} ⭐
- Excellent Brews (4.5+): ${excellentBrews} (${Math.round((excellentBrews / allLogs.length) * 100)}%)
- Good Brews (4.0+): ${goodBrews} (${Math.round((goodBrews / allLogs.length) * 100)}%)

**Trend Analysis**:
- Direction: ${trend === "Improving" ? "📈 Improving" :
              trend === "Declining" ? "📉 Declining" : "➡️ Stable"}
- Slope: ${Math.round(slope * 1000) / 1000} per brew
- Projected Next Brew: ${Math.round(Math.min(5, Math.max(1, projected)) * 10) / 10} ⭐

**Milestone Progress**:
${excellentBrews >= 50 ? "🏆 Master Brewer (50+ excellent brews)" :
  excellentBrews >= 25 ? "⭐ Expert Brewer (25+ excellent brews)" :
  excellentBrews >= 10 ? "✅ Skilled Brewer (10+ excellent brews)" :
  "🌱 Developing Skills"}

**Next Milestone**: ${excellentBrews < 10 ? `${10 - excellentBrews} excellent brews to Skilled Brewer` :
                      excellentBrews < 25 ? `${25 - excellentBrews} excellent brews to Expert` :
                      excellentBrews < 50 ? `${50 - excellentBrews} excellent brews to Master` :
                      "All milestones achieved! 🎉"}
  `);
}
```

## Comprehensive Action Plan

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .array();

if (allLogs.length >= 10) {
  dv.header(3, "📋 30-Day Action Plan");

  const plan = [];

  // Analyze current state
  const recentLogs = allLogs.filter(p => p.date).sort((a, b) => b.date - a.date).slice(0, 15);
  const avgRating = recentLogs.reduce((sum, p) => sum + p.rating, 0) / recentLogs.length;

  // Week 1: Foundation
  plan.push({
    week: "Week 1",
    focus: "Establish Baseline",
    actions: [
      "Brew 5+ cups using current method",
      "Measure and log all parameters precisely",
      "Document tasting notes for each brew"
    ]
  });

  // Week 2: Optimization
  if (avgRating < 4.0) {
    plan.push({
      week: "Week 2",
      focus: "Parameter Optimization",
      actions: [
        "Review optimal parameters from Brewing Optimization Engine",
        "Adjust water temp to optimal range",
        "Fine-tune grind size based on recommendations"
      ]
    });
  } else {
    plan.push({
      week: "Week 2",
      focus: "Consistency Building",
      actions: [
        "Replicate your best brew 3 times",
        "Measure variance in results",
        "Refine technique for repeatability"
      ]
    });
  }

  // Week 3: Experimentation
  const uniqueMethods = new Set(allLogs.map(p => p["brew-method"])).size;
  plan.push({
    week: "Week 3",
    focus: uniqueMethods < 3 ? "Method Exploration" : "Bean Exploration",
    actions: uniqueMethods < 3 ? [
      "Try a new brewing method",
      "Compare results to your primary method",
      "Document differences in flavor profile"
    ] : [
      "Purchase beans from new origin",
      "Compare to your top-rated beans",
      "Identify flavor differences and preferences"
    ]
  });

  // Week 4: Mastery
  plan.push({
    week: "Week 4",
    focus: "Consolidation & Mastery",
    actions: [
      "Brew with optimal recipe 5 times",
      "Achieve 80%+ consistency (4.0+ rating)",
      "Document your perfected technique"
    ]
  });

  dv.table(
    ["Week", "Focus Area", "Action Items"],
    plan.map(p => [
      p.week,
      p.focus,
      p.actions.map(a => `• ${a}`).join("\n")
    ])
  );

  dv.paragraph(`
**Success Metrics** (End of 30 Days):
- [ ] Average rating 4.0+
- [ ] 70%+ of brews rated 4.0+
- [ ] Variance < 0.5 (consistent quality)
- [ ] 3+ brewing methods explored
- [ ] 5+ different beans tried
- [ ] Documented optimal recipe

**Review this plan weekly and adjust based on progress!**
  `);
}
```

## AI Confidence Score

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .array();

if (allLogs.length > 0) {
  dv.header(3, "🤖 AI System Confidence");

  const completeLogs = allLogs.filter(p =>
    p.rating && p["water-temp"] && p["brew-time"] && p["grind-size"] && p.ratio
  );

  const recentLogs = allLogs.filter(p => {
    if (!p.date) return false;
    const monthsAgo = Math.floor((dv.date("now") - p.date) / (1000 * 60 * 60 * 24 * 30));
    return monthsAgo <= 2;
  });

  const scores = {
    dataVolume: Math.min(100, (allLogs.length / 50) * 100),
    dataQuality: (completeLogs.length / allLogs.length) * 100,
    dataRecency: (recentLogs.length / allLogs.length) * 100,
    diversity: Math.min(100, (new Set(allLogs.map(p => p.beans)).size * 5))
  };

  const overallConfidence = Math.round(
    Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length
  );

  dv.table(
    ["Component", "Score", "Status"],
    [
      ["Data Volume", `${Math.round(scores.dataVolume)}%`,
       scores.dataVolume >= 80 ? "✅ Excellent" :
       scores.dataVolume >= 50 ? "✅ Good" : "⚠️ Building"],
      ["Data Quality", `${Math.round(scores.dataQuality)}%`,
       scores.dataQuality >= 80 ? "✅ High" :
       scores.dataQuality >= 60 ? "✅ Good" : "⚠️ Incomplete"],
      ["Data Recency", `${Math.round(scores.dataRecency)}%`,
       scores.dataRecency >= 60 ? "✅ Fresh" :
       scores.dataRecency >= 30 ? "✅ Recent" : "⚠️ Outdated"],
      ["Bean Diversity", `${Math.round(scores.diversity)}%`,
       scores.diversity >= 80 ? "✅ Excellent" :
       scores.diversity >= 40 ? "✅ Good" : "⚠️ Limited"]
    ]
  );

  dv.paragraph(`
**Overall AI Confidence**: ${overallConfidence}%

${overallConfidence >= 80 ? "🏆 **Very High** - AI recommendations are highly reliable" :
  overallConfidence >= 60 ? "✅ **High** - AI recommendations are dependable" :
  overallConfidence >= 40 ? "⚠️ **Moderate** - AI recommendations are reasonable but improving" :
  "🔧 **Building** - Continue logging to improve AI accuracy"}

**To Improve Confidence**:
${scores.dataVolume < 80 ? "- Log more brews (target: 50+)\n" : ""}${scores.dataQuality < 80 ? "- Complete all parameters in each log\n" : ""}${scores.dataRecency < 60 ? "- Brew more frequently for fresh data\n" : ""}${scores.diversity < 80 ? "- Try more bean varieties\n" : ""}${overallConfidence >= 80 ? "✅ All factors optimized!" : ""}
  `);
}
```

---

## Dashboard Navigation

### Core Analytics
- [[1-Monthly-Analytics-Dashboard|Monthly Analytics]] - Monthly statistics and trends
- [[2-Brewing-Optimization-Engine|Brewing Optimizer]] - Parameter recommendations
- [[3-Cost-Intelligence-System|Cost Intelligence]] - ROI and budget tracking

### ML & Prediction
- [[4-Palate-Development-Tracker|Palate Development]] - Sensory skill progression
- [[5-Quality-Predictor|Quality Predictor]] - Pre-brew forecasting
- [[6-Correlation-Discovery-Engine|Correlation Discovery]] - Parameter relationships
- [[7-Anomaly-Detection-System|Anomaly Detection]] - Outlier identification

### Main Dashboard
- [[Coffee Dashboard|Coffee Dashboard]] - Return to main dashboard

---

*AI Engine: Multi-algorithm ensemble (KNN, K-Means, Linear Regression, Anomaly Detection)*
*Updates in real-time based on your brewing data*
*Last Updated: `= date(today)`*
