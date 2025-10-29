---
title: Learning & Development Dashboard
type: analytics-dashboard
category: learning-development
created: 2025-10-28
tags: [analytics, learning, development, coffee-vault-5.0]
---

# Learning & Development Dashboard

> Track knowledge growth, identify learning gaps, and recommend educational paths

## Knowledge Gaps Analysis

```dataviewjs
dv.header(3, "📚 Knowledge Gaps");

// Analyze what you've explored vs. what's available
const beans = dv.pages('"Beans Library"')
  .where(p => p.type === "bean-profile")
  .array();

const origins = dv.pages('"Origins"')
  .where(p => p.type === "origin-profile")
  .array();

const methods = dv.pages('"Brewing Guides"')
  .where(p => p.type === "brewing-guide")
  .array();

const scientificRefs = dv.pages('"Scientific References"')
  .where(p => p.type === "scientific-reference")
  .array();

// Origins explored
const originsTried = new Set();
beans.forEach(b => {
  if (b.origin) originsTried.add(b.origin);
});

const originsCoverage = originsTried.size / origins.length * 100;
const originsMissing = origins.filter(o => !originsTried.has(o.name));

// Methods explored
const methodsTried = new Set();
dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p["brew-method"])
  .forEach(log => methodsTried.add(log["brew-method"]));

const methodsCoverage = methodsTried.size / methods.length * 100;

// Scientific references read (would need read-status property)
const refsRead = scientificRefs.filter(r => r["read-status"] === "read").length;
const refsCoverage = scientificRefs.length > 0 ? (refsRead / scientificRefs.length * 100) : 0;

dv.table(
  ["Category", "Coverage", "Gaps", "Recommendation"],
  [
    ["Origins", `${originsCoverage.toFixed(1)}%`, originsMissing.length, originsMissing.length > 0 ? `Try ${originsMissing[0].file.name}` : "Complete"],
    ["Methods", `${methodsCoverage.toFixed(1)}%`, methods.length - methodsTried.size, `Try ${methods.length - methodsTried.size} new methods`],
    ["Scientific References", `${refsCoverage.toFixed(1)}%`, scientificRefs.length - refsRead, `Read ${scientificRefs.length - refsRead} more references`]
  ]
);
```

## Skill Development Tracking

```dataviewjs
dv.header(3, "📈 Skill Development");

const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .sort(p => p.date, 'asc')
  .array();

if (logs.length >= 10) {
  // Divide into periods
  const periodSize = Math.ceil(logs.length / 3);
  const periods = [
    logs.slice(0, periodSize),
    logs.slice(periodSize, periodSize * 2),
    logs.slice(periodSize * 2)
  ];
  
  const skillMetrics = periods.map((period, idx) => {
    const ratings = period.map(l => l.rating).filter(Boolean);
    const descriptors = period.flatMap(l => [
      ...(l.descriptors || []),
      ...(l["primary-flavor"] ? [l["primary-flavor"]] : []),
      ...(l["secondary-flavors"] || [])
    ]);
    const uniqueDescriptors = new Set(descriptors);
    
    return {
      period: `Period ${idx + 1}`,
      avgRating: ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : "N/A",
      descriptorCount: uniqueDescriptors.size,
      methodsUsed: new Set(period.map(l => l["brew-method"]).filter(Boolean)).size,
      consistency: ratings.length > 0 ? (1 - stats.standardDeviation(ratings) / stats.mean(ratings)).toFixed(2) : "N/A"
    };
  });
  
  dv.table(
    ["Period", "Avg Rating", "Descriptor Vocabulary", "Methods Used", "Consistency"],
    skillMetrics.map(m => [
      m.period,
      m.avgRating !== "N/A" ? `${m.avgRating}⭐` : "N/A",
      m.descriptorCount,
      m.methodsUsed,
      m.consistency !== "N/A" ? `${(parseFloat(m.consistency) * 100).toFixed(0)}%` : "N/A"
    ])
  );
  
  // Calculate improvement
  if (skillMetrics.length >= 2) {
    const firstAvg = parseFloat(skillMetrics[0].avgRating);
    const lastAvg = parseFloat(skillMetrics[skillMetrics.length - 1].avgRating);
    const improvement = lastAvg - firstAvg;
    
    dv.paragraph(`**Rating Improvement**: ${improvement > 0 ? '+' : ''}${improvement.toFixed(2)} points`);
    dv.paragraph(`**Vocabulary Growth**: ${skillMetrics[skillMetrics.length - 1].descriptorCount - skillMetrics[0].descriptorCount} new descriptors`);
  }
} else {
  dv.paragraph("Need at least 10 coffee logs to track skill development. Keep brewing!");
}
```

## Recommended Learning Path

```dataviewjs
dv.header(3, "🎓 Recommended Learning Path");

const recommendations = [];

// Check what you've tried
const beans = dv.pages('"Beans Library"')
  .where(p => p.type === "bean-profile")
  .array();
const originsTried = new Set(beans.map(b => b.origin).filter(Boolean));
const methodsTried = new Set(dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .map(p => p["brew-method"])
  .filter(Boolean)
);

// Origin exploration
const allOrigins = dv.pages('"Origins"')
  .where(p => p.type === "origin-profile")
  .array();
const untriedOrigins = allOrigins.filter(o => !originsTried.has(o.name));

if (untriedOrigins.length > 0) {
  recommendations.push({
    type: "Origin Exploration",
    priority: "High",
    action: `Explore ${untriedOrigins[0].file.name}`,
    reason: `${untriedOrigins.length} origins not yet tried`,
    resources: [`[[${untriedOrigins[0].file.path}]]`, "Try beans from this origin"]
  });
}

// Method learning
const allMethods = dv.pages('"Brewing Guides"')
  .where(p => p.type === "brewing-guide")
  .array();
const untriedMethods = allMethods.filter(m => !methodsTried.has(m.method));

if (untriedMethods.length > 0) {
  recommendations.push({
    type: "Method Learning",
    priority: "Medium",
    action: `Learn ${untriedMethods[0].method} method`,
    reason: `${untriedMethods.length} methods not yet tried`,
    resources: [`[[${untriedMethods[0].file.path}]]`, `Practice ${untriedMethods[0].method} brewing`]
  });
}

// Scientific knowledge
const scientificRefs = dv.pages('"Scientific References"')
  .where(p => p.type === "scientific-reference" && p.difficulty === "beginner")
  .array();

if (scientificRefs.length > 0) {
  recommendations.push({
    type: "Scientific Learning",
    priority: "Medium",
    action: `Read ${scientificRefs[0].file.name}`,
    reason: "Build foundational coffee science knowledge",
    resources: [`[[${scientificRefs[0].file.path}]]`, "Complete reading and apply learnings"]
  });
}

if (recommendations.length > 0) {
  recommendations.forEach(rec => {
    dv.header(4, `${rec.priority === "High" ? "🔴" : "🟡"} ${rec.type}`);
    dv.paragraph(`**Action**: ${rec.action}`);
    dv.paragraph(`**Why**: ${rec.reason}`);
    dv.list(rec.resources);
  });
} else {
  dv.paragraph("✅ **Excellent progress!** Continue exploring new areas.");
}
```

## Goal Progress Tracking

```dataviewjs
dv.header(3, "🎯 Goal Progress");

const goals = dv.pages('"Coffee Goals"')
  .where(p => p.type === "coffee-goal" && p.status !== "completed")
  .sort(p => p.priority === "high" ? 0 : p.priority === "medium" ? 1 : 2)
  .sort(p => p["target-date"], 'asc')
  .array();

if (goals.length > 0) {
  dv.table(
    ["Goal", "Type", "Progress", "Target Date", "Status"],
    goals.map(g => [
      g.file.link,
      g["goal-type"] || "N/A",
      g["progress-percentage"] ? `${g["progress-percentage"]}%` : "0%",
      g["target-date"] || "N/A",
      g.status === "in-progress" ? "🟢" : g.status === "paused" ? "🟡" : "⚪"
    ])
  );
  
  // Upcoming deadlines
  const upcoming = goals.filter(g => {
    if (!g["target-date"]) return false;
    const target = new Date(g["target-date"]);
    const today = new Date();
    const daysUntil = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return daysUntil <= 7 && daysUntil >= 0;
  });
  
  if (upcoming.length > 0) {
    dv.header(4, "⏰ Upcoming Deadlines (Next 7 Days)");
    dv.list(upcoming.map(g => `[[${g.file.path}]] - Due ${g["target-date"]}`));
  }
} else {
  dv.paragraph("No active goals. Create new goals to track your learning journey!");
}
```

## Reading Progress

```dataviewjs
dv.header(3, "📖 Reading Progress");

const scientificRefs = dv.pages('"Scientific References"')
  .where(p => p.type === "scientific-reference")
  .array();

if (scientificRefs.length > 0) {
  // Group by difficulty
  const byDifficulty = {
    beginner: scientificRefs.filter(r => r.difficulty === "beginner"),
    intermediate: scientificRefs.filter(r => r.difficulty === "intermediate"),
    advanced: scientificRefs.filter(r => r.difficulty === "advanced")
  };
  
  dv.table(
    ["Difficulty", "Total", "Read", "Remaining", "Progress"],
    Object.entries(byDifficulty).map(([diff, refs]) => {
      const read = refs.filter(r => r["read-status"] === "read").length;
      const remaining = refs.length - read;
      const progress = refs.length > 0 ? (read / refs.length * 100).toFixed(1) : 0;
      
      return [
        diff.charAt(0).toUpperCase() + diff.slice(1),
        refs.length,
        read,
        remaining,
        `${progress}%`
      ];
    })
  );
  
  // Recommended next read
  const unread = scientificRefs.filter(r => r["read-status"] !== "read");
  if (unread.length > 0) {
    const nextRead = unread.filter(r => r.difficulty === "beginner")[0] || unread[0];
    dv.header(4, "📚 Recommended Next Read");
    dv.paragraph(`**[[${nextRead.file.path}]]**`);
    dv.paragraph(`Difficulty: ${nextRead.difficulty || "Unknown"}`);
    if (nextRead["reading-time"]) {
      dv.paragraph(`Estimated time: ${nextRead["reading-time"]}`);
    }
  }
} else {
  dv.paragraph("No scientific references found.");
}
```

## Achievement Milestones

```dataviewjs
dv.header(3, "🏆 Achievement Milestones");

const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .array();

const milestones = [
  { threshold: 10, name: "Getting Started", icon: "🌱", achieved: logs.length >= 10 },
  { threshold: 25, name: "Consistent Brewer", icon: "☕", achieved: logs.length >= 25 },
  { threshold: 50, name: "Coffee Enthusiast", icon: "🔥", achieved: logs.length >= 50 },
  { threshold: 100, name: "Coffee Master", icon: "👑", achieved: logs.length >= 100 },
  { threshold: 200, name: "Coffee Legend", icon: "🌟", achieved: logs.length >= 200 }
];

const achieved = milestones.filter(m => m.achieved);
const next = milestones.find(m => !m.achieved);

dv.table(
  ["Milestone", "Threshold", "Status"],
  milestones.map(m => [
    `${m.icon} ${m.name}`,
    `${m.threshold} logs`,
    m.achieved ? "✅ Achieved" : (m === next ? "⏳ Next" : "🔒 Locked")
  ])
);

if (next) {
  dv.paragraph(`**Next Milestone**: ${next.icon} ${next.name} - ${next.threshold - logs.length} more logs to go!`);
}

// Method mastery milestones
const methodsTried = new Set(logs.map(l => l["brew-method"]).filter(Boolean));
if (methodsTried.size >= 5) {
  dv.paragraph(`🎉 **Method Explorer**: Tried ${methodsTried.size} different brewing methods!`);
}

// Origin explorer milestones
const originsTried = new Set(logs.map(l => l.origin).filter(Boolean));
if (originsTried.size >= 10) {
  dv.paragraph(`🌍 **World Traveler**: Explored ${originsTried.size} different origins!`);
}
```

---

**Usage**: Track your coffee learning journey, identify knowledge gaps, and follow recommended learning paths.

---

**Tags**: [analytics, learning, development, coffee-vault-5.0]

