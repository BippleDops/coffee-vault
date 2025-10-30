---
title: Palate Development Tracker
type: analytics-dashboard
category: sensory-analysis
created: 2025-10-26
tags: [analytics, palate, flavor, sensory, progression]
---

# Palate Development Tracker

> Track your flavor sophistication progression and sensory skill development over time

## Palate Sophistication Score

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.date)
  .sort(p => p.date, "asc")
  .array();

if (allLogs.length === 0) {
  dv.paragraph("Start logging brews with detailed tasting notes to track palate development!");
} else {
  // Calculate sophistication metrics
  const uniqueOrigins = new Set(allLogs.map(p => p.origin).filter(o => o)).size;
  const uniqueMethods = new Set(allLogs.map(p => p["brew-method"]).filter(m => m)).size;
  const uniqueBeans = new Set(allLogs.map(p => p.beans).filter(b => b)).size;
  const uniqueRoasters = new Set(allLogs.map(p => p.roaster).filter(r => r)).size;

  // Rating variance (lower = more consistent = more developed palate)
  const ratings = allLogs.map(p => p.rating || 0);
  const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  const variance = ratings.reduce((sum, r) => sum + Math.pow(r - avgRating, 2), 0) / ratings.length;
  const consistencyScore = Math.max(0, (1 - variance) * 100);

  // Calculate sophistication score (0-100)
  const experienceScore = Math.min(100, (allLogs.length / 100) * 100); // Max at 100 brews
  const diversityScore = ((uniqueOrigins * 5) + (uniqueMethods * 10) + (uniqueBeans * 2)) / 2;
  const qualityScore = (avgRating / 5.0) * 100;

  const sophisticationScore = Math.round(
    (experienceScore * 0.3) +
    (Math.min(100, diversityScore) * 0.3) +
    (qualityScore * 0.2) +
    (consistencyScore * 0.2)
  );

  dv.header(3, "🎓 Overall Palate Sophistication");
  dv.paragraph(`
**Sophistication Score**: ${sophisticationScore}/100
**Level**: ${sophisticationScore >= 80 ? "🏆 Master" :
              sophisticationScore >= 60 ? "⭐ Advanced" :
              sophisticationScore >= 40 ? "✅ Intermediate" :
              sophisticationScore >= 20 ? "🌱 Developing" :
              "🔰 Beginner"}
  `);

  const progressBar = "█".repeat(Math.floor(sophisticationScore / 5)) + "░".repeat(20 - Math.floor(sophisticationScore / 5));
  dv.paragraph(`[${progressBar}] ${sophisticationScore}%`);

  dv.header(4, "Component Scores");
  dv.table(
    ["Component", "Score", "Status"],
    [
      ["Experience", `${Math.round(experienceScore)}%`, `${allLogs.length} total brews`],
      ["Diversity", `${Math.round(Math.min(100, diversityScore))}%`,
       `${uniqueOrigins} origins, ${uniqueMethods} methods`],
      ["Quality Detection", `${Math.round(qualityScore)}%`, `${avgRating.toFixed(2)} avg rating`],
      ["Consistency", `${Math.round(consistencyScore)}%`, variance < 0.3 ? "Excellent" : variance < 0.6 ? "Good" : "Developing"]
    ]
  );
}
```

## Flavor Vocabulary Expansion

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p["flavor-notes"])
  .array();

if (allLogs.length > 0) {
  // Extract all flavor notes
  const allFlavors = [];
  allLogs.forEach(log => {
    if (Array.isArray(log["flavor-notes"])) {
      allFlavors.push(...log["flavor-notes"]);
    }
  });

  const uniqueFlavors = new Set(allFlavors);
  const flavorCount = {};

  allFlavors.forEach(flavor => {
    flavorCount[flavor] = (flavorCount[flavor] || 0) + 1;
  });

  dv.header(3, "📚 Flavor Vocabulary");
  dv.paragraph(`
**Total Flavor Descriptors Used**: ${uniqueFlavors.size}
**Most Common Flavors**: ${Object.entries(flavorCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .map(([f, c]) => `${f} (${c}×)`)
  .join(", ")}
  `);

  // Categorize flavors (simplified)
  const fruitNotes = allFlavors.filter(f =>
    /berry|fruit|citrus|apple|cherry|grape|lemon|orange/i.test(f)
  ).length;

  const nutChocolate = allFlavors.filter(f =>
    /chocolate|cocoa|nut|almond|hazelnut|caramel/i.test(f)
  ).length;

  const floral = allFlavors.filter(f =>
    /floral|flower|jasmine|rose|lavender/i.test(f)
  ).length;

  const spice = allFlavors.filter(f =>
    /spice|cinnamon|clove|pepper|cardamom/i.test(f)
  ).length;

  if (uniqueFlavors.size >= 5) {
    dv.header(4, "Flavor Profile Distribution");
    dv.table(
      ["Category", "Count", "Percentage"],
      [
        ["Fruit/Berry Notes", fruitNotes, `${Math.round((fruitNotes / allFlavors.length) * 100)}%`],
        ["Chocolate/Nut", nutChocolate, `${Math.round((nutChocolate / allFlavors.length) * 100)}%`],
        ["Floral", floral, `${Math.round((floral / allFlavors.length) * 100)}%`],
        ["Spice", spice, `${Math.round((spice / allFlavors.length) * 100)}%`]
      ]
    );
  }

  // Vocabulary growth over time
  const monthlyVocab = {};
  allLogs.forEach(log => {
    if (log.date && Array.isArray(log["flavor-notes"])) {
      const month = log.date.toFormat("yyyy-MM");
      if (!monthlyVocab[month]) {
        monthlyVocab[month] = new Set();
      }
      log["flavor-notes"].forEach(f => monthlyVocab[month].add(f));
    }
  });

  const vocabGrowth = Object.entries(monthlyVocab)
    .map(([month, flavors]) => ({ month, count: flavors.size }))
    .sort((a, b) => a.month.localeCompare(b.month));

  if (vocabGrowth.length >= 3) {
    const firstMonth = vocabGrowth[0].count;
    const lastMonth = vocabGrowth[vocabGrowth.length - 1].count;
    const growth = lastMonth - firstMonth;

    dv.paragraph(`
**Vocabulary Growth**: ${growth > 0 ? "+" + growth : growth} descriptors since ${vocabGrowth[0].month}
**Trend**: ${growth > 0 ? "📈 Expanding" : growth < 0 ? "📉 Consolidating" : "➡️ Stable"}
    `);
  }
}
```

## Origin Exploration Progress

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.origin)
  .array();

if (allLogs.length > 0) {
  // Group by origin
  const originStats = {};

  allLogs.forEach(log => {
    const origin = log.origin || "Unknown";
    if (!originStats[origin]) {
      originStats[origin] = {
        brews: 0,
        totalRating: 0,
        firstTry: log.date,
        lastTry: log.date
      };
    }
    originStats[origin].brews++;
    originStats[origin].totalRating += log.rating || 0;
    if (log.date < originStats[origin].firstTry) originStats[origin].firstTry = log.date;
    if (log.date > originStats[origin].lastTry) originStats[origin].lastTry = log.date;
  });

  const originAnalysis = Object.entries(originStats)
    .map(([origin, stats]) => ({
      origin,
      brews: stats.brews,
      avgRating: Math.round((stats.totalRating / stats.brews) * 10) / 10,
      firstTry: stats.firstTry?.toFormat("yyyy-MM-dd"),
      experience: stats.brews >= 10 ? "Expert" : stats.brews >= 5 ? "Experienced" : "Exploring"
    }))
    .sort((a, b) => b.brews - a.brews);

  dv.header(3, "🌍 Origin Exploration");
  dv.table(
    ["Origin", "Brews", "Avg Rating", "Experience Level", "First Tried"],
    originAnalysis.map(o => [
      o.origin,
      o.brews,
      `${o.avgRating} ⭐`,
      o.experience,
      o.firstTry
    ])
  );

  // Identify unexplored regions
  const majorOrigins = ["Ethiopia", "Colombia", "Kenya", "Guatemala", "Brazil", "Costa Rica", "Rwanda", "Peru"];
  const exploredOrigins = new Set(originAnalysis.map(o => o.origin));
  const unexplored = majorOrigins.filter(o => !exploredOrigins.has(o));

  if (unexplored.length > 0) {
    dv.paragraph(`
💡 **Expand Your Palate**: Try these origins: ${unexplored.join(", ")}
    `);
  } else {
    dv.paragraph("🏆 **World Traveler**: You've explored all major coffee origins!");
  }
}
```

## Brewing Method Mastery

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p["brew-method"])
  .array();

if (allLogs.length > 0) {
  const methodStats = {};

  allLogs.forEach(log => {
    const method = log["brew-method"] || "Unknown";
    if (!methodStats[method]) {
      methodStats[method] = {
        brews: 0,
        ratings: [],
        totalRating: 0
      };
    }
    methodStats[method].brews++;
    methodStats[method].ratings.push(log.rating || 0);
    methodStats[method].totalRating += log.rating || 0;
  });

  const methodMastery = Object.entries(methodStats)
    .map(([method, stats]) => {
      const avgRating = stats.totalRating / stats.brews;

      // Calculate consistency (inverse of variance)
      const variance = stats.ratings.reduce((sum, r) => {
        const diff = r - avgRating;
        return sum + (diff * diff);
      }, 0) / stats.brews;

      const consistency = Math.max(0, (1 - variance) * 100);

      // Mastery level based on experience + consistency + quality
      const experienceScore = Math.min(100, (stats.brews / 20) * 100);
      const qualityScore = (avgRating / 5.0) * 100;
      const masteryScore = Math.round(
        (experienceScore * 0.4) + (consistency * 0.3) + (qualityScore * 0.3)
      );

      return {
        method,
        brews: stats.brews,
        avgRating: Math.round(avgRating * 10) / 10,
        consistency: Math.round(consistency),
        mastery: masteryScore,
        level: masteryScore >= 80 ? "🏆 Master" :
               masteryScore >= 60 ? "⭐ Advanced" :
               masteryScore >= 40 ? "✅ Proficient" :
               "🌱 Learning"
      };
    })
    .sort((a, b) => b.mastery - a.mastery);

  dv.header(3, "☕ Brewing Method Mastery");
  dv.table(
    ["Method", "Brews", "Avg Rating", "Consistency", "Mastery Score", "Level"],
    methodMastery.map(m => [
      m.method,
      m.brews,
      `${m.avgRating} ⭐`,
      `${m.consistency}%`,
      m.mastery,
      m.level
    ])
  );

  // Learning recommendations
  const learningMethods = methodMastery.filter(m => m.mastery < 60);
  if (learningMethods.length > 0) {
    dv.paragraph(`
💡 **Continue Developing**: Focus on improving ${learningMethods[0].method} (${learningMethods[0].mastery} mastery score)
    `);
  }
}
```

## Rating Precision Evolution

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.date && p.rating)
  .sort(p => p.date, "asc")
  .array();

if (allLogs.length >= 20) {
  // Split into early and recent periods
  const splitPoint = Math.floor(allLogs.length / 2);
  const earlyLogs = allLogs.slice(0, splitPoint);
  const recentLogs = allLogs.slice(splitPoint);

  // Calculate variance for each period
  const calcVariance = (logs) => {
    const ratings = logs.map(p => p.rating || 0);
    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    return ratings.reduce((sum, r) => sum + Math.pow(r - avg, 2), 0) / ratings.length;
  };

  const earlyVariance = calcVariance(earlyLogs);
  const recentVariance = calcVariance(recentLogs);

  const earlyAvg = Math.round(earlyLogs.reduce((sum, p) => sum + p.rating, 0) / earlyLogs.length * 10) / 10;
  const recentAvg = Math.round(recentLogs.reduce((sum, p) => sum + p.rating, 0) / recentLogs.length * 10) / 10;

  dv.header(3, "🎯 Rating Precision Development");
  dv.table(
    ["Period", "Avg Rating", "Variance", "Precision"],
    [
      ["Early Brews (First Half)", earlyAvg, earlyVariance.toFixed(3),
       earlyVariance < 0.3 ? "High" : earlyVariance < 0.6 ? "Moderate" : "Low"],
      ["Recent Brews (Second Half)", recentAvg, recentVariance.toFixed(3),
       recentVariance < 0.3 ? "High" : recentVariance < 0.6 ? "Moderate" : "Low"]
    ]
  );

  const varianceChange = ((recentVariance - earlyVariance) / earlyVariance) * 100;

  dv.paragraph(`
**Precision Improvement**: ${varianceChange > 0 ? "+" : ""}${Math.round(varianceChange)}%
**Interpretation**: ${recentVariance < earlyVariance ?
  "🎯 Your rating precision is improving! You're better at distinguishing quality." :
  "💡 Focus on consistent evaluation criteria to improve precision."}
  `);
}
```

## Palate Development Timeline

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.date)
  .sort(p => p.date, "asc")
  .array();

if (allLogs.length >= 10) {
  // Create monthly aggregations
  const monthlyData = {};

  allLogs.forEach(log => {
    const month = log.date.toFormat("yyyy-MM");
    if (!monthlyData[month]) {
      monthlyData[month] = {
        brews: 0,
        totalRating: 0,
        origins: new Set(),
        methods: new Set(),
        beans: new Set()
      };
    }

    monthlyData[month].brews++;
    monthlyData[month].totalRating += log.rating || 0;
    if (log.origin) monthlyData[month].origins.add(log.origin);
    if (log["brew-method"]) monthlyData[month].methods.add(log["brew-method"]);
    if (log.beans) monthlyData[month].beans.add(log.beans);
  });

  const timeline = Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      brews: data.brews,
      avgRating: Math.round((data.totalRating / data.brews) * 10) / 10,
      diversity: data.origins.size + data.methods.size + data.beans.size
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6); // Last 6 months

  dv.header(3, "📈 6-Month Development Timeline");
  dv.table(
    ["Month", "Brews", "Avg Rating", "Diversity Score", "Trend"],
    timeline.map((m, i) => {
      const trend = i > 0 ?
        (m.avgRating > timeline[i-1].avgRating ? "📈" :
         m.avgRating < timeline[i-1].avgRating ? "📉" : "➡️") :
        "—";
      return [m.month, m.brews, `${m.avgRating} ⭐`, m.diversity, trend];
    })
  );

  // Overall trend
  if (timeline.length >= 3) {
    const firstAvg = timeline[0].avgRating;
    const lastAvg = timeline[timeline.length - 1].avgRating;
    const improvement = lastAvg - firstAvg;

    dv.paragraph(`
**Overall Trend**: ${improvement > 0.2 ? "📈 Significant Improvement" :
                     improvement > 0 ? "📈 Slight Improvement" :
                     improvement < -0.2 ? "📉 Declining" : "➡️ Stable"}
**Rating Change**: ${improvement > 0 ? "+" : ""}${improvement.toFixed(2)} over 6 months
    `);
  }
}
```

## ML-Powered Development Insights

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .array();

dv.header(3, "🧠 AI Development Recommendations");

if (allLogs.length < 10) {
  dv.paragraph("📊 Log at least 10 brews to unlock palate development insights!");
} else {
  const recommendations = [];

  // Experience level
  if (allLogs.length < 30) {
    recommendations.push(`📚 **Build Experience**: You have ${allLogs.length} brews logged. Aim for 50+ to develop a strong baseline.`);
  } else if (allLogs.length >= 100) {
    recommendations.push("🏆 **Experienced Cupper**: 100+ brews logged! You have extensive tasting experience.");
  }

  // Origin diversity
  const uniqueOrigins = new Set(allLogs.filter(p => p.origin).map(p => p.origin)).size;
  if (uniqueOrigins < 4) {
    recommendations.push(`🌍 **Expand Origins**: You've tried ${uniqueOrigins} origins. Explore more for broader palate development.`);
  } else if (uniqueOrigins >= 8) {
    recommendations.push(`🌎 **Global Explorer**: ${uniqueOrigins} origins explored! Excellent diversity.`);
  }

  // Method diversity
  const uniqueMethods = new Set(allLogs.filter(p => p["brew-method"]).map(p => p["brew-method"])).size;
  if (uniqueMethods < 3) {
    recommendations.push(`☕ **Try New Methods**: You primarily use ${uniqueMethods} method(s). Each method reveals different flavor aspects.`);
  } else if (uniqueMethods >= 5) {
    recommendations.push(`🎓 **Method Master**: ${uniqueMethods} brewing methods mastered!`);
  }

  // Quality trajectory
  const sortedByDate = allLogs.filter(p => p.date).sort((a, b) => a.date - b.date);
  if (sortedByDate.length >= 20) {
    const recent20 = sortedByDate.slice(-20);
    const recentAvg = recent20.reduce((sum, p) => sum + (p.rating || 0), 0) / 20;

    if (recentAvg >= 4.2) {
      recommendations.push(`⭐ **High Standards**: Recent average of ${recentAvg.toFixed(2)} shows you're consistently achieving quality.`);
    } else if (recentAvg < 3.8) {
      recommendations.push(`🔧 **Optimize Technique**: Recent average of ${recentAvg.toFixed(2)}. Review top-rated brews for improvement.`);
    }
  }

  // Flavor vocabulary
  const logsWithFlavors = allLogs.filter(p => p["flavor-notes"] && Array.isArray(p["flavor-notes"]));
  if (logsWithFlavors.length > 0) {
    const allFlavors = new Set();
    logsWithFlavors.forEach(p => {
      p["flavor-notes"].forEach(f => allFlavors.add(f));
    });

    if (allFlavors.size < 10) {
      recommendations.push(`📖 **Expand Vocabulary**: ${allFlavors.size} flavor descriptors. Study coffee tasting wheels to identify more nuances.`);
    } else if (allFlavors.size >= 20) {
      recommendations.push(`📚 **Rich Vocabulary**: ${allFlavors.size} flavor descriptors! Your sensory analysis is sophisticated.`);
    }
  } else {
    recommendations.push("📝 **Add Tasting Notes**: Start documenting flavor notes to track palate development.");
  }

  if (recommendations.length === 0) {
    recommendations.push("✅ Your palate development is progressing excellently across all dimensions!");
  }

  recommendations.forEach(rec => dv.paragraph(rec));
}
```

## Suggested Next Steps

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .array();

if (allLogs.length >= 5) {
  const exploredOrigins = new Set(allLogs.filter(p => p.origin).map(p => p.origin));
  const exploredMethods = new Set(allLogs.filter(p => p["brew-method"]).map(p => p["brew-method"]));

  dv.header(3, "🎯 Recommended Next Experiences");

  const nextSteps = [];

  // Suggest unexplored origins
  const allOrigins = ["Ethiopia", "Colombia", "Kenya", "Guatemala", "Brazil", "Costa Rica"];
  const newOrigins = allOrigins.filter(o => !exploredOrigins.has(o));
  if (newOrigins.length > 0) {
    nextSteps.push(`🌍 Try coffee from: ${newOrigins[0]}`);
  }

  // Suggest unexplored methods
  const allMethods = ["Pour Over", "French Press", "Espresso", "Aeropress", "Chemex"];
  const newMethods = allMethods.filter(m => !exploredMethods.has(m) && !exploredMethods.has(m.toLowerCase()));
  if (newMethods.length > 0) {
    nextSteps.push(`☕ Experiment with: ${newMethods[0]}`);
  }

  // Suggest revisiting high-rated combinations
  const topRated = allLogs.filter(p => p.rating >= 4.5).sort((a, b) => b.rating - a.rating)[0];
  if (topRated) {
    nextSteps.push(`🏆 Revisit your best: ${topRated.beans} (${topRated.rating}⭐)`);
  }

  if (nextSteps.length > 0) {
    nextSteps.forEach(step => dv.paragraph(step));
  } else {
    dv.paragraph("🎓 You're exploring comprehensively! Continue your journey.");
  }
}
```

---

## Related Dashboards

- [[1-Monthly-Analytics-Dashboard|Monthly Analytics]]
- [[6-Correlation-Discovery-Engine|Correlation Discovery]]
- [[8-Multi-Variable-Recommendation-Engine|AI Recommendations]]
- [[Coffee Dashboard|Main Dashboard]]

---

*Palate development is a journey. Track, experiment, and enjoy!*
*Last Updated: `= date(today)`*
