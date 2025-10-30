---
type: analytics-dashboard
title: Community Comparison Dashboard
category: social-community
created: 2025-10-28
version: 5.0.0
tags: [analytics, community, comparison, trends, coffee-vault-5.0]
---

# Community Comparison Dashboard

> Compare with community averages, identify similar taster profiles, discover popular combinations, and analyze coffee trends.

**Coffee Vault 5.0** - See how your coffee journey compares to the community

---

## 📊 Your Profile vs Community

```dataviewjs
const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log");

const totalBrews = logs.length;
const avgRating = logs.length > 0 ? logs.array().reduce((sum, p) => sum + (p.rating || 0), 0) / logs.length : 0;
const uniqueBeans = new Set(logs.array().map(p => p.beans).filter(Boolean)).size;
const uniqueMethods = new Set(logs.array().map(p => p["brew-method"]).filter(Boolean)).size;

// Community averages (simulated - would come from shared database)
const communityAvg = {
  totalBrews: 127,
  avgRating: 3.8,
  uniqueBeans: 34,
  uniqueMethods: 4.2,
  monthlyBrews: 18
};

dv.header(3, "📈 Your Stats vs Community Average");
dv.table(["Metric", "You", "Community Avg", "Comparison"],
  [
    ["Total Brews", totalBrews, communityAvg.totalBrews, 
      totalBrews > communityAvg.totalBrews ? "⬆️ Above avg" : "⬇️ Below avg"],
    ["Average Rating", avgRating.toFixed(2), communityAvg.avgRating.toFixed(2),
      avgRating > communityAvg.avgRating ? "⬆️ Higher" : "⬇️ Lower"],
    ["Unique Beans", uniqueBeans, communityAvg.uniqueBeans,
      uniqueBeans > communityAvg.uniqueBeans ? "⬆️ More variety" : "⬇️ Less variety"],
    ["Methods Tried", uniqueMethods, communityAvg.uniqueMethods.toFixed(0),
      uniqueMethods > communityAvg.uniqueMethods ? "⬆️ More methods" : "⬇️ Fewer methods"]
  ]
);
```

---

## 👥 Similar Taster Profiles

```dataviewjs
// Find users with similar tasting preferences (simulated)
// In production, would compare with shared community database

const yourProfile = {
  favoriteOrigin: "Ethiopia",
  favoriteMethod: "v60",
  preferredRoast: "light",
  avgRating: 4.2
};

const similarUsers = [
  { name: "Coffee Enthusiast A", similarity: 87, favoriteOrigin: "Ethiopia", favoriteMethod: "v60", avgRating: 4.3 },
  { name: "Coffee Enthusiast B", similarity: 82, favoriteOrigin: "Kenya", favoriteMethod: "v60", avgRating: 4.1 },
  { name: "Coffee Enthusiast C", similarity: 79, favoriteOrigin: "Ethiopia", favoriteMethod: "chemex", avgRating: 4.4 }
];

dv.header(3, "🤝 Tasters Similar to You");
dv.table(["User", "Similarity", "Favorite Origin", "Favorite Method", "Avg Rating"],
  similarUsers.map(u => [u.name, `${u.similarity}%`, u.favoriteOrigin, u.favoriteMethod, u.avgRating])
);

dv.paragraph(`
> **Recommendation**: Check out what Coffee Enthusiast A is brewing - they have 87% taste similarity!
`);
```

---

## 🔥 Popular Combinations in Community

```dataviewjs
// Popular bean-method combinations (simulated community data)
const popularCombos = [
  { bean: "Ethiopian Yirgacheffe", method: "V60", users: 1247, avgRating: 4.6 },
  { bean: "Colombian Supremo", method: "Chemex", users: 892, avgRating: 4.3 },
  { bean: "Kenya AA", method: "V60", users: 743, avgRating: 4.7 },
  { bean: "Guatemala Antigua", method: "French Press", users: 621, avgRating: 4.2 },
  { bean: "Sumatra Mandheling", method: "French Press", users: 589, avgRating: 4.1 }
];

dv.header(3, "☕ Top Bean-Method Combinations");
dv.table(["Bean", "Method", "Community Users", "Avg Rating"],
  popularCombos.map(c => [c.bean, c.method, c.users, c.avgRating])
);
```

---

## 📈 Trending Now

```dataviewjs
// Coffee trends in the community (simulated)
const trends = [
  { category: "Origin", item: "Colombia Gesha", trend: "📈 Rising 32%", description: "New harvest gaining popularity" },
  { category: "Processing", item: "Anaerobic Fermentation", trend: "🔥 Hot 45%", description: "Experimental processing trending" },
  { category: "Method", item: "Osmotic Flow", trend: "🆕 New", description: "New method gaining attention" },
  { category: "Equipment", item: "Fellow Ode Gen 2", trend: "⭐ Popular", description: "Community favorite grinder" },
  { category: "Roaster", item: "Onyx Coffee Lab", trend: "👑 #1", description: "Top-rated specialty roaster" }
];

dv.header(3, "🌟 Community Trends");
dv.table(["Category", "Item", "Trend", "Description"],
  trends.map(t => [t.category, t.item, t.trend, t.description])
);
```

---

## 🎯 Your Taste Profile

```dataviewjs
// Analyze your taste preferences
const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log");

const topRatedLogs = logs.where(p => p.rating >= 4.5).array();

// Find common characteristics in top-rated brews
const originCounts = {};
const methodCounts = {};
const roastCounts = {};

topRatedLogs.forEach(log => {
  const origin = log.origin || "Unknown";
  const method = log["brew-method"] || "Unknown";
  const roast = log["roast-level"] || "Unknown";
  
  originCounts[origin] = (originCounts[origin] || 0) + 1;
  methodCounts[method] = (methodCounts[method] || 0) + 1;
  roastCounts[roast] = (roastCounts[roast] || 0) + 1;
});

dv.header(3, "🎨 Your Taste Preferences (from top-rated brews)");

const favoriteOrigin = Object.entries(originCounts).sort((a, b) => b[1] - a[1])[0];
const favoriteMethod = Object.entries(methodCounts).sort((a, b) => b[1] - a[1])[0];
const favoriteRoast = Object.entries(roastCounts).sort((a, b) => b[1] - a[1])[0];

if (favoriteOrigin && favoriteMethod && favoriteRoast) {
  dv.paragraph(`
**Favorite Origin**: ${favoriteOrigin[0]} (${favoriteOrigin[1]} excellent brews)  
**Favorite Method**: ${favoriteMethod[0]} (${favoriteMethod[1]} excellent brews)  
**Favorite Roast**: ${favoriteRoast[0]} (${favoriteRoast[1]} excellent brews)

**Your Signature**: ${favoriteRoast[0]} ${favoriteOrigin[0]} via ${favoriteMethod[0]}
  `);
}
```

---

## 🌍 Origin Popularity Comparison

```dataviewjs
// Compare your origin preferences with community
const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log");

const yourOrigins = {};
logs.forEach(log => {
  const origin = log.origin || "Unknown";
  yourOrigins[origin] = (yourOrigins[origin] || 0) + 1;
});

// Community popularity (simulated)
const communityOrigins = {
  "Ethiopia": 28,
  "Colombia": 22,
  "Kenya": 15,
  "Guatemala": 12,
  "Brazil": 8,
  "Costa Rica": 7,
  "Peru": 5,
  "Rwanda": 3
};

dv.header(3, "🗺️ Origin Preferences");

const comparison = Object.keys(communityOrigins).map(origin => {
  const yourCount = yourOrigins[origin] || 0;
  const yourPct = logs.length > 0 ? Math.round(yourCount / logs.length * 100) : 0;
  const communityPct = communityOrigins[origin];
  
  return {
    origin: origin,
    you: `${yourPct}%`,
    community: `${communityPct}%`,
    comparison: yourPct > communityPct ? "⬆️" : yourPct < communityPct ? "⬇️" : "="
  };
});

dv.table(["Origin", "Your Usage", "Community", ""],
  comparison.map(c => [c.origin, c.you, c.community, c.comparison])
);
```

---

## 💡 Recommendations Based on Community

```dataviewjs
// Suggest beans/methods popular in community that you haven't tried
const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log");

const triedOrigins = new Set(logs.array().map(p => p.origin).filter(Boolean));
const triedMethods = new Set(logs.array().map(p => p["brew-method"]).filter(Boolean));

dv.header(3, "🎯 Community Recommendations for You");

// Popular origins you haven't tried (simulated)
const popularUntried = ["Kenya", "Panama Gesha", "Yemen"];
const untried = popularUntried.filter(o => !triedOrigins.has(o));

if (untried.length > 0) {
  dv.paragraph("**Popular Origins to Try**:");
  dv.list(untried.map(o => `${o} - Highly rated in community`));
}

// Popular methods you haven't mastered
const popularMethods = ["aeropress", "chemex", "clever"];
const methodsToTry = popularMethods.filter(m => !triedMethods.has(m) || logs.where(p => p["brew-method"] === m).length < 5);

if (methodsToTry.length > 0) {
  dv.paragraph("**Methods to Explore More**:");
  dv.list(methodsToTry.map(m => `${m} - Community favorite`));
}
```

---

## 📊 Your Impact on Community

**Your Contributions** (future feature):
- Recipes shared: 0
- Reviews published: 0
- Community engagement: 0 interactions

**Reputation Score**: Building... (engage with community to grow)

---

## 🌐 Community Features (Coming Soon)

- [ ] Share your best brews with community
- [ ] Follow similar tasters
- [ ] Join cupping groups
- [ ] Compare brewing techniques
- [ ] Participate in challenges
- [ ] Rate community recipes

---

**Coffee Vault 5.0** - Part of a global coffee community

