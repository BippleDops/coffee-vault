---
type: analytics-dashboard
title: Learning & Development Dashboard
category: personal-growth
created: 2025-10-28
version: 5.0.0
tags: [analytics, learning, development, goals, coffee-vault-5.0]
---

# Learning & Development Dashboard

> Knowledge gaps identification, recommended learning paths, skill development tracking, and certification progress.

**Coffee Vault 5.0** - Your personalized coffee mastery roadmap

---

## 🎯 Learning Overview

```dataviewjs
const goals = dv.pages('"Coffee Goals"')
  .where(p => p.type === "coffee-goal");

const activeGoals = goals.where(p => p.status === "in-progress" || p.status === "planned");
const completedGoals = goals.where(p => p.status === "completed");
const learningGoals = goals.where(p => 
  p["goal-type"] === "learn-method" ||
  p["goal-type"] === "master-technique" ||
  p["goal-type"] === "complete-course"
);

dv.header(3, "📚 Learning Status");
dv.table(["Metric", "Count"],
  [
    ["Active Goals", activeGoals.length],
    ["Completed Goals", completedGoals.length],
    ["Learning-Focused Goals", learningGoals.length],
    ["Completion Rate", `${completedGoals.length > 0 ? Math.round(completedGoals.length / goals.length * 100) : 0}%`]
  ]
);
```

---

## 🎓 Active Learning Goals

```dataviewjs
const activeGoals = dv.pages('"Coffee Goals"')
  .where(p => 
    p.type === "coffee-goal" &&
    (p.status === "in-progress" || p.status === "planned")
  )
  .sort(p => p.priority, 'desc');

if (activeGoals.length > 0) {
  dv.header(3, `${activeGoals.length} Goals In Progress`);
  
  dv.table(["Goal", "Type", "Status", "Progress", "Target Date"],
    activeGoals.map(p => [
      p.file.link,
      p["goal-type"],
      p.status,
      `${p["progress-percentage"] || 0}%`,
      p["target-date"]
    ])
  );
} else {
  dv.paragraph("**No active learning goals.** Use `Templates/Coffee Goal.md` to set new goals!");
}
```

---

## 📊 Skill Development Tracking

```dataviewjs
// Analyze brewing method proficiency based on logs
const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log");

const methodStats = {};

logs.forEach(log => {
  const method = log["brew-method"] || "Unknown";
  if (!methodStats[method]) {
    methodStats[method] = {
      count: 0,
      totalRating: 0,
      ratings: [],
      recent: []
    };
  }
  
  methodStats[method].count++;
  methodStats[method].totalRating += (log.rating || 0);
  methodStats[method].ratings.push(log.rating || 0);
  
  // Track recent (last 5)
  if (methodStats[method].recent.length < 5) {
    methodStats[method].recent.push(log.rating || 0);
  }
});

// Calculate proficiency levels
const proficiency = Object.entries(methodStats).map(([method, stats]) => {
  const avgRating = stats.totalRating / stats.count;
  const recentAvg = stats.recent.reduce((a, b) => a + b, 0) / stats.recent.length;
  
  // Proficiency = sessions × avg rating
  const proficiencyScore = stats.count * avgRating;
  
  let level = "Beginner";
  if (proficiencyScore >= 100) level = "Master";
  else if (proficiencyScore >= 50) level = "Advanced";
  else if (proficiencyScore >= 20) level = "Intermediate";
  
  return {
    method: method,
    sessions: stats.count,
    avgRating: avgRating.toFixed(2),
    recentAvg: recentAvg.toFixed(2),
    level: level,
    trend: recentAvg > avgRating ? "📈 Improving" : recentAvg < avgRating ? "📉 Declining" : "➡️ Stable"
  };
});

dv.header(3, "Method Proficiency");
dv.table(["Method", "Sessions", "Avg Rating", "Recent Avg", "Level", "Trend"],
  proficiency
    .sort((a, b) => b.sessions - a.sessions)
    .map(p => [p.method, p.sessions, p.avgRating, p.recentAvg, p.level, p.trend])
);
```

---

## 🔍 Knowledge Gaps

```dataviewjs
// Identify brewing methods not yet mastered
const allMethods = ["v60", "chemex", "aeropress", "french-press", "espresso", "moka-pot", "clever", "kalita-wave", "siphon", "cold-brew"];

const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log");

const usedMethods = new Set(logs.array().map(p => p["brew-method"]).filter(Boolean));
const unusedMethods = allMethods.filter(m => !usedMethods.has(m));
const lowUsageMethods = allMethods.filter(m => {
  const count = logs.where(p => p["brew-method"] === m).length;
  return count > 0 && count < 5;
});

dv.header(3, "📚 Learning Opportunities");

if (unusedMethods.length > 0) {
  dv.paragraph("**Methods Not Yet Tried**:");
  dv.list(unusedMethods.map(m => `${m} - Consider exploring!`));
}

if (lowUsageMethods.length > 0) {
  dv.paragraph("**Methods Needing Practice** (< 5 brews):");
  dv.list(lowUsageMethods.map(m => {
    const count = logs.where(p => p["brew-method"] === m).length;
    return `${m} - Only ${count} brews so far`;
  }));
}
```

---

## 🗺️ Recommended Learning Path

```dataviewjs
// Suggest next learning steps based on current proficiency
const logs = dv.pages('"Coffee Logs"').where(p => p.type === "coffee-log");
const totalBrews = logs.length;

dv.header(3, "Your Personalized Learning Path");

if (totalBrews < 20) {
  dv.paragraph(`
**Stage**: Beginner (${totalBrews} brews)

**Focus**:
1. Master one brewing method (V60 or Aeropress recommended)
2. Log every brew consistently
3. Read: [[Coffee Brewing Control Chart]]
4. Goal: Achieve 20 total brews with consistent technique

**Recommended Resources**:
- [[Brewing Guide]]
- [[Scientific References/Grinding/Grind Size Impact on Extraction]]
  `);
} else if (totalBrews < 50) {
  dv.paragraph(`
**Stage**: Intermediate (${totalBrews} brews)

**Focus**:
1. Explore second brewing method
2. Track extraction metrics (TDS, EY%)
3. Begin correlation analysis
4. Read: [[Scientific References/Coffee Chemistry/Solubility and Extraction Rates]]
5. Goal: Try 3 different origins, compare flavor profiles

**Recommended Resources**:
- [[6-Correlation-Discovery-Engine]]
- [[Scientific References/Sensory Science/Flavor Wheel Development]]
  `);
} else if (totalBrews < 100) {
  dv.paragraph(`
**Stage**: Advanced (${totalBrews} brews)

**Focus**:
1. Master 3+ brewing methods
2. Optimize parameters for each bean type
3. Formal cupping practice
4. Read: [[Scientific References/Roasting/Roast Curve Development]]
5. Consider SCA certification prep

**Recommended Resources**:
- [[5-Quality-Predictor]]
- [[Documentation/Advanced-Brewing-Techniques]]
  `);
} else {
  dv.paragraph(`
**Stage**: Master (${totalBrews} brews) 🏆

**Focus**:
1. Refine all techniques to perfection
2. Experiment with advanced methods
3. Share knowledge with community
4. Consider professional certification
5. Train others in coffee brewing

**Recommended Resources**:
- Advanced cupping protocols
- Competition brewing techniques
- Teaching and mentoring
  `);
}
```

---

## 📖 Scientific References Progress

```dataviewjs
const scientificRefs = dv.pages('"Scientific References"')
  .where(p => p.type === "scientific-reference");

const totalRefs = scientificRefs.length;

// Would track which references have been read (future feature)
dv.header(3, `📚 ${totalRefs} Scientific References Available`);

const byCategory = scientificRefs
  .groupBy(p => p.category)
  .map(g => ({
    category: g.key,
    count: g.rows.length
  }))
  .sort(p => p.count, 'desc');

dv.table(["Category", "Reference Count", "Status"],
  byCategory.map(c => [
    c.category,
    c.count,
    "📖 Available"
  ])
);
```

---

## 🏅 Achievements Unlocked

```dataviewjs
const logs = dv.pages('"Coffee Logs"').where(p => p.type === "coffee-log");
const totalBrews = logs.length;
const beans = dv.pages('"Beans Library"').where(p => p.type === "bean-profile").length;
const avgRating = logs.length > 0 ? logs.array().reduce((sum, p) => sum + (p.rating || 0), 0) / logs.length : 0;
const excellentBrews = logs.where(p => p.rating >= 4.5).length;

const achievements = [
  { name: "First Brew", icon: "☕", threshold: 1, metric: totalBrews, unlocked: totalBrews >= 1 },
  { name: "Analytics Unlocked", icon: "📊", threshold: 10, metric: totalBrews, unlocked: totalBrews >= 10 },
  { name: "Intermediate Brewer", icon: "📈", threshold: 20, metric: totalBrews, unlocked: totalBrews >= 20 },
  { name: "ML Predictions Active", icon: "🤖", threshold: 50, metric: totalBrews, unlocked: totalBrews >= 50 },
  { name: "Master Brewer", icon: "🏆", threshold: 100, metric: totalBrews, unlocked: totalBrews >= 100 },
  { name: "Excellent Average", icon: "⭐", threshold: 4.0, metric: avgRating, unlocked: avgRating >= 4.0 },
  { name: "Consistency Master", icon: "🎯", threshold: 10, metric: excellentBrews, unlocked: excellentBrews >= 10 },
  { name: "Bean Explorer", icon: "🫘", threshold: 25, metric: beans, unlocked: beans >= 25 },
  { name: "Bean Connoisseur", icon: "🌟", threshold: 50, metric: beans, unlocked: beans >= 50 }
];

dv.header(3, "🏅 Achievements");

const unlocked = achievements.filter(a => a.unlocked);
const locked = achievements.filter(a => !a.unlocked);

if (unlocked.length > 0) {
  dv.paragraph("**Unlocked**:");
  dv.list(unlocked.map(a => `${a.icon} ${a.name}`));
}

if (locked.length > 0) {
  dv.paragraph("**Locked** (coming soon):");
  dv.list(locked.map(a => 
    `${a.icon} ${a.name} - ${a.metric}/${a.threshold} (${Math.round(a.metric / a.threshold * 100)}%)`
  ));
}
```

---

## 📝 Learning Notes

**Track your coffee learning journey**:

- Recent discoveries:
- Skills improved this month:
- Questions to explore:
- Books/courses to complete:

---

**Coffee Vault 5.0** - From beginner to master, one brew at a time

