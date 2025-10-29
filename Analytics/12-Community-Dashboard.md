---
title: Social & Community Dashboard
type: analytics-dashboard
category: social-community
created: 2025-10-28
tags: [analytics, social, community, coffee-vault-5.0]
---

# Social & Community Dashboard

> Compare your preferences with community averages and discover popular combinations

## Your Stats vs. Community Averages

```dataviewjs
dv.header(3, "📊 Your Stats vs. Community (Conceptual)");

const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .array();

if (logs.length > 0) {
  const ratings = logs.map(l => l.rating).filter(Boolean);
  const avgRating = ratings.length > 0 
    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
    : 0;
  
  // Community averages (would come from external data or aggregated vault data)
  // For now, using placeholder values
  const communityAvgRating = 4.1; // Placeholder
  
  dv.table(
    ["Metric", "Your Average", "Community Average", "Difference"],
    [
      ["Rating", `${avgRating}⭐`, `${communityAvgRating}⭐`, 
       parseFloat(avgRating) > communityAvgRating ? `+${(parseFloat(avgRating) - communityAvgRating).toFixed(2)}` : 
       `${(parseFloat(avgRating) - communityAvgRating).toFixed(2)}`],
      ["Sessions per Month", `${(logs.length / 12).toFixed(1)}`, "15", "N/A"],
      ["Favorite Method", stats.mode(logs.map(l => l["brew-method"]).filter(Boolean)), "V60", "N/A"],
      ["Favorite Origin", stats.mode(logs.map(l => l.origin).filter(Boolean)) || "N/A", "Ethiopia", "N/A"]
    ]
  );
  
  const ratingDiff = parseFloat(avgRating) - communityAvgRating;
  if (Math.abs(ratingDiff) > 0.2) {
    dv.paragraph(ratingDiff > 0 
      ? `✅ **Above average!** Your average rating is ${ratingDiff.toFixed(2)} points higher than community average.`
      : `📊 **Below average** - Room for improvement. Your average is ${Math.abs(ratingDiff).toFixed(2)} points lower.`);
  } else {
    dv.paragraph("📊 **In line with community** - Your preferences align with average coffee enthusiasts.");
  }
}
```

## Popular Combinations

```dataviewjs
dv.header(3, "🔥 Popular Bean-Method Combinations");

const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.rating >= 4.0)
  .array();

if (logs.length > 0) {
  // Group by bean-method combination
  const combinations = {};
  
  logs.forEach(log => {
    const key = `${log.beans || "Unknown"} + ${log["brew-method"] || "Unknown"}`;
    if (!combinations[key]) {
      combinations[key] = {
        bean: log.beans,
        method: log["brew-method"],
        count: 0,
        totalRating: 0,
        ratings: []
      };
    }
    
    combinations[key].count++;
    combinations[key].ratings.push(log.rating);
    combinations[key].totalRating += log.rating || 0;
  });
  
  const sortedCombos = Object.values(combinations)
    .map(combo => ({
      ...combo,
      avgRating: combo.ratings.reduce((a, b) => a + b, 0) / combo.ratings.length
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  dv.table(
    ["Combination", "Uses", "Avg Rating", "Popularity"],
    sortedCombos.map(combo => [
      `${combo.bean} + ${combo.method}`,
      combo.count,
      `${combo.avgRating.toFixed(2)}⭐`,
      combo.count >= 5 ? "🔥 Very Popular" : combo.count >= 3 ? "⭐ Popular" : "📊 Common"
    ])
  );
  
  dv.paragraph(`**Most Popular**: ${sortedCombos[0].bean} + ${sortedCombos[0].method} (${sortedCombos[0].count} successful brews)`);
}
```

## Trend Analysis

```dataviewjs
dv.header(3, "📈 Trending Preferences");

const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .sort(p => p.date, 'desc')
  .array();

if (logs.length >= 20) {
  // Analyze last 3 months vs previous 3 months
  const now = new Date();
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
  
  const recent = logs.filter(l => {
    const logDate = new Date(l.date);
    return logDate >= threeMonthsAgo;
  });
  
  const previous = logs.filter(l => {
    const logDate = new Date(l.date);
    return logDate >= sixMonthsAgo && logDate < threeMonthsAgo;
  });
  
  // Method trends
  const recentMethods = {};
  recent.forEach(l => {
    const method = l["brew-method"];
    if (method) recentMethods[method] = (recentMethods[method] || 0) + 1;
  });
  
  const previousMethods = {};
  previous.forEach(l => {
    const method = l["brew-method"];
    if (method) previousMethods[method] = (previousMethods[method] || 0) + 1;
  });
  
  const methodTrends = Object.keys({ ...recentMethods, ...previousMethods })
    .map(method => {
      const recentCount = recentMethods[method] || 0;
      const previousCount = previousMethods[method] || 0;
      const change = recentCount - previousCount;
      const changePercent = previousCount > 0 ? (change / previousCount * 100).toFixed(0) : 0;
      
      return {
        method,
        recent: recentCount,
        previous: previousCount,
        change,
        changePercent,
        trend: change > 0 ? "📈 Trending Up" : change < 0 ? "📉 Declining" : "➡️ Stable"
      };
    })
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
    .slice(0, 5);
  
  dv.table(
    ["Method", "Recent (3mo)", "Previous (3mo)", "Change", "Trend"],
    methodTrends.map(t => [
      t.method,
      t.recent,
      t.previous,
      `${t.change > 0 ? '+' : ''}${t.change} (${t.changePercent}%)`,
      t.trend
    ])
  );
  
  // Origin trends
  const recentOrigins = {};
  recent.forEach(l => {
    const origin = l.origin;
    if (origin) recentOrigins[origin] = (recentOrigins[origin] || 0) + 1;
  });
  
  const previousOrigins = {};
  previous.forEach(l => {
    const origin = l.origin;
    if (origin) previousOrigins[origin] = (previousOrigins[origin] || 0) + 1;
  });
  
  const originTrends = Object.keys({ ...recentOrigins, ...previousOrigins })
    .map(origin => {
      const recentCount = recentOrigins[origin] || 0;
      const previousCount = previousOrigins[origin] || 0;
      const change = recentCount - previousCount;
      
      return {
        origin,
        recent: recentCount,
        previous: previousCount,
        change,
        trend: change > 0 ? "📈 Trending Up" : change < 0 ? "📉 Declining" : "➡️ Stable"
      };
    })
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
    .slice(0, 5);
  
  dv.header(4, "Origin Trends");
  dv.table(
    ["Origin", "Recent", "Previous", "Change", "Trend"],
    originTrends.map(t => [
      t.origin,
      t.recent,
      t.previous,
      `${t.change > 0 ? '+' : ''}${t.change}`,
      t.trend
    ])
  );
}
```

## Similar Taster Profiles

```dataviewjs
dv.header(3, "👥 Similar Taster Profiles (Conceptual)");

// This would compare your flavor preferences with others
// For now, showing your flavor profile

const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.rating >= 4.0)
  .array();

if (logs.length > 0) {
  // Your flavor profile
  const descriptors = logs.flatMap(l => [
    ...(l.descriptors || []),
    ...(l["primary-flavor"] ? [l["primary-flavor"]] : []),
    ...(l["secondary-flavors"] || [])
  ]);
  
  const descriptorCounts = {};
  descriptors.forEach(d => {
    descriptorCounts[d] = (descriptorCounts[d] || 0) + 1;
  });
  
  const topDescriptors = Object.entries(descriptorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([descriptor, count]) => descriptor);
  
  dv.paragraph("**Your Flavor Profile**:");
  dv.list(topDescriptors.map(d => `${d} (${descriptorCounts[d]} times)`));
  
  dv.paragraph("💡 *In a full implementation, this would match you with similar tasters based on flavor preferences*");
}
```

## Community Discoveries

```dataviewjs
dv.header(3, "🔍 Community Discoveries");

const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.rating >= 4.5)
  .array();

if (logs.length > 0) {
  // Find exceptional brews
  const exceptional = logs
    .filter(l => l.rating >= 4.5)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);
  
  dv.header(4, "⭐ Exceptional Brews Worth Sharing");
  dv.table(
    ["Bean", "Method", "Rating", "Key Parameters"],
    exceptional.map(l => [
      l.beans || "Unknown",
      l["brew-method"] || "Unknown",
      `${l.rating}⭐`,
      `${l.dose || "?"}g / ${l["water-temperature"] || "?"}°C / ${l["grind-size"] || "?"}`
    ])
  );
  
  // Unique combinations
  const uniqueCombos = new Set();
  logs.forEach(l => {
    if (l.beans && l["brew-method"]) {
      uniqueCombos.add(`${l.beans} + ${l["brew-method"]}`);
    }
  });
  
  dv.header(4, "💎 Unique Combinations Discovered");
  dv.paragraph(`You've tried **${uniqueCombos.size}** unique bean-method combinations`);
}
```

## Recommendations Based on Community

```dataviewjs
dv.header(3, "💡 Community-Based Recommendations");

const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .array();

const recommendations = [];

// Find methods you haven't tried that are popular
const methodsTried = new Set(logs.map(l => l["brew-method"]).filter(Boolean));
const allMethods = dv.pages('"Brewing Guides"')
  .where(p => p.type === "brewing-guide")
  .array();
const untriedMethods = allMethods.filter(m => !methodsTried.has(m.method));

if (untriedMethods.length > 0) {
  recommendations.push({
    type: "Method",
    suggestion: `Try ${untriedMethods[0].method} method`,
    reason: "Popular method you haven't tried yet",
    link: untriedMethods[0].file.link
  });
}

// Find origins you haven't tried
const originsTried = new Set(logs.map(l => l.origin).filter(Boolean));
const allOrigins = dv.pages('"Origins"')
  .where(p => p.type === "origin-profile")
  .array();
const untriedOrigins = allOrigins.filter(o => !originsTried.has(o.name));

if (untriedOrigins.length > 0) {
  recommendations.push({
    type: "Origin",
    suggestion: `Explore ${untriedOrigins[0].file.name}`,
    reason: `${untriedOrigins.length} origins not yet explored`,
    link: untriedOrigins[0].file.link
  });
}

if (recommendations.length > 0) {
  recommendations.forEach(rec => {
    dv.header(4, `${rec.type} Recommendation`);
    dv.paragraph(`**${rec.suggestion}**`);
    dv.paragraph(`*${rec.reason}*`);
    dv.paragraph(`→ ${rec.link}`);
  });
} else {
  dv.paragraph("✅ **Excellent exploration!** You've tried a wide variety of methods and origins.");
}
```

---

**Usage**: Compare your coffee preferences with community averages and discover popular combinations.

**Note**: Community data would come from aggregated vault data or external sources in a full implementation.

---

**Tags**: [analytics, social, community, coffee-vault-5.0]

