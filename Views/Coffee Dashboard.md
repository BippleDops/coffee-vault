---
type: dashboard
tags: [moc, dashboard, coffee]
---

# ☕ Coffee Tracking Dashboard

*Your central hub for all things coffee*

---

## 📊 Current Stats

```dataviewjs
const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log");

const totalLogs = logs.length;
const avgRating = logs.length > 0
  ? Math.round(logs.array().reduce((sum, p) => sum + (p.rating || 0), 0) / logs.length * 100) / 100
  : 0;
const totalCups = logs.array().reduce((sum, p) => sum + (p["cups-brewed"] || 0), 0);

dv.table(
  ["Metric", "Value"],
  [
    ["**Total Logs**", totalLogs],
    ["**Average Rating**", avgRating + " / 5.0"],
    ["**Total Cups**", totalCups]
  ]
);
```

```dataviewjs
const beans = dv.pages('"Beans Library"')
  .where(p => p.status === "active");

dv.paragraph(`**Active Beans**: ${beans.length}`);
```

---

## 🌟 Top Rated Coffees (All Time)

```dataviewjs
const topRated = dv.pages('"Coffee Logs"')
  .where(p => p.rating >= 4.5)
  .sort(p => p.rating, "desc")
  .limit(15)
  .array();

if (topRated.length > 0) {
  dv.table(
    ["☕ Beans", "Roaster", "Origin", "⭐", "Date"],
    topRated.map(p => [
      p.beans || "Unknown",
      p.roaster || "Unknown",
      p.origin || "Unknown",
      p.rating,
      p.date
    ])
  );
} else {
  dv.paragraph("No highly-rated brews yet. Keep brewing!");
}
```

---

## 📅 Recent Sessions (Last 7 Days)

```dataviewjs
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

const recentSessions = dv.pages('"Coffee Logs"')
  .where(p => p.date && p.date >= dv.date(sevenDaysAgo))
  .sort(p => p.date, "desc")
  .array();

if (recentSessions.length > 0) {
  dv.table(
    ["Beans", "⭐", "Method", "Date"],
    recentSessions.map(p => [
      p.beans || "Unknown",
      p.rating,
      p["brew-method"] || "Unknown",
      p.date
    ])
  );
} else {
  dv.paragraph("No brews in the last 7 days. Time to make coffee!");
}
```

---

## 🫘 Bean Library Status

### Active Beans

```dataviewjs
const activeBeans = dv.pages('"Beans Library"')
  .where(p => p.status === "active")
  .sort(p => p["purchase-date"], "desc")
  .array();

if (activeBeans.length > 0) {
  dv.table(
    ["Bean", "Roaster", "Origin", "Purchased"],
    activeBeans.map(p => [
      p["bean-name"] || p.file.name,
      p.roaster || "Unknown",
      p.origin || "Unknown",
      p["purchase-date"] || "N/A"
    ])
  );
} else {
  dv.paragraph("No active beans. Add beans to your library!");
}
```

### Need to Try

```dataviewjs
const untried = dv.pages('"Beans Library"')
  .where(p => p.status === "active")
  .array()
  .filter(bean => {
    const logs = dv.pages('"Coffee Logs"')
      .where(p => p.beans === bean["bean-name"] || p.beans === bean.file.name)
      .length;
    return logs === 0;
  });

if (untried.length > 0) {
  dv.list(untried.map(p => p["bean-name"] || p.file.name));
} else {
  dv.paragraph("You've tried all your active beans!");
}
```

---

## 📈 This Month's Overview

```dataviewjs
const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

const thisMonth = dv.pages('"Coffee Logs"')
  .where(p => {
    if (!p.date) return false;
    const logDate = new Date(p.date.toString());
    return logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear;
  })
  .array();

if (thisMonth.length > 0) {
  const methodGroups = {};
  thisMonth.forEach(log => {
    const method = log["brew-method"] || "Unknown";
    if (!methodGroups[method]) {
      methodGroups[method] = { count: 0, totalRating: 0, totalCups: 0 };
    }
    methodGroups[method].count++;
    methodGroups[method].totalRating += log.rating || 0;
    methodGroups[method].totalCups += log["cups-brewed"] || 0;
  });

  const methodStats = Object.entries(methodGroups)
    .map(([method, stats]) => [
      method,
      stats.count,
      Math.round((stats.totalRating / stats.count) * 10) / 10,
      stats.totalCups
    ])
    .sort((a, b) => b[1] - a[1]);

  dv.table(
    ["Brew Method", "Sessions", "Avg ⭐", "Cups"],
    methodStats
  );
} else {
  dv.paragraph("No brews this month yet. Start logging!");
}
```

---

## 🌍 By Origin

```dataviewjs
const logs = dv.pages('"Coffee Logs"').where(p => p.origin).array();

if (logs.length > 0) {
  const originGroups = {};
  logs.forEach(log => {
    const origin = log.origin || "Unknown";
    if (!originGroups[origin]) {
      originGroups[origin] = { count: 0, totalRating: 0 };
    }
    originGroups[origin].count++;
    originGroups[origin].totalRating += log.rating || 0;
  });

  const originStats = Object.entries(originGroups)
    .map(([origin, stats]) => [
      origin,
      stats.count,
      Math.round((stats.totalRating / stats.count) * 100) / 100
    ])
    .sort((a, b) => b[1] - a[1]);

  dv.table(["Origin", "Logs", "Avg ⭐"], originStats);
}
```

---

## ☕ By Roaster

```dataviewjs
const logs = dv.pages('"Coffee Logs"').where(p => p.roaster).array();

if (logs.length > 0) {
  const roasterGroups = {};
  logs.forEach(log => {
    const roaster = log.roaster || "Unknown";
    if (!roasterGroups[roaster]) {
      roasterGroups[roaster] = { count: 0, totalRating: 0 };
    }
    roasterGroups[roaster].count++;
    roasterGroups[roaster].totalRating += log.rating || 0;
  });

  const roasterStats = Object.entries(roasterGroups)
    .map(([roaster, stats]) => [
      roaster,
      stats.count,
      Math.round((stats.totalRating / stats.count) * 100) / 100
    ])
    .sort((a, b) => b[2] - a[2]);

  dv.table(["Roaster", "Logs", "Avg ⭐"], roasterStats);
}
```

---

## 🎯 Quick Actions

**New Entry**:
- [[Coffee Log Template|+ New Coffee Log]]
- [[Bean Profile Template|+ New Bean Profile]]
- [[Roaster Profile Template|+ New Roaster]]
- [[Quick Coffee Capture|⚡ Quick Capture]]

**Views**:
- [[Views/All Coffee Logs.base|📋 All Logs (Base)]]
- [[Views/Top Rated.base|⭐ Top Rated (Base)]]
- [[Views/By Roaster.base|☕ By Roaster (Base)]]
- [[Views/By Origin.base|🌍 By Origin (Base)]]

**References**:
- [[Brewing Guides/|🔧 Brewing Guides]]
- [[Origins/|🌍 Origin Profiles]]
- [[Roasters/|☕ Roaster Directory]]

---

## 🎲 Random Discoveries

```dataviewjs
const goodBrews = dv.pages('"Coffee Logs"')
  .where(p => p.rating >= 4)
  .sort(p => p.file.name, "desc")
  .limit(3)
  .array();

if (goodBrews.length > 0) {
  dv.list(goodBrews.map(p =>
    `${p.rating} stars - ${p.beans} (${p["brew-method"] || "Unknown method"})`
  ));
}
```

---

## 📝 Notes & Goals

**Current Experiments**:
- 

**Beans to Try**:
- 

**Techniques to Master**:
- 

**Roasters to Explore**:
- 

---

*Dashboard updated with Datacore queries - all data now live and accurate*

