---
type: database-view
title: Enhanced Bean Library Base
category: beans
version: 5.0.0
tags: [view, beans, advanced, filtering]
---

# 🫘 Enhanced Bean Library Base

**Advanced bean queries with filtering, sorting, and insights**

**Coffee Vault 5.0** - Professional bean database

---

## 🌟 All Beans (Enhanced View)

```datacore
TABLE WITHOUT ID
  choice(status = "active", "✅", choice(status = "archived", "📦", "❓")) AS "",
  file.link AS "Bean",
  origin AS "Origin",
  variety AS "Variety",
  processing AS "Process",
  "roast-level" AS "Roast",
  choice("purchase-date" != null AND (date(today) - "purchase-date").days <= 14, "🆕", "") AS "New",
  choice("transparency-score" >= 8, "🌟", "") AS "Trans"
FROM "Beans Library"
WHERE type = "bean-profile"
SORT status ASC, "purchase-date" DESC
LIMIT 100
```

**Legend**: ✅ Active | 📦 Archived | 🆕 New (<14 days) | 🌟 High Transparency

---

## ⭐ Top Performers (Multi-Criteria)

```datacore
TABLE WITHOUT ID
  file.link AS "Bean",
  origin AS "Origin",
  "avg-rating" AS "Avg ⭐",
  "total-sessions" AS "Brews",
  choice("would-rebuy" = true, "✅ Yes", "❌ No") AS "Rebuy",
  "transparency-score" AS "Transp",
  choice("ethical-rating" >= 8, "💚", "") AS "Ethical"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND "avg-rating" >= 4.3
  AND "total-sessions" >= 3
SORT "avg-rating" DESC, "total-sessions" DESC
LIMIT 20
```

---

## 🔍 Advanced Filtering Examples

### Light Roast Ethiopians (High Rated)

```datacore
TABLE WITHOUT ID
  file.link AS "Bean",
  region AS "Region",
  processing AS "Processing",
  "avg-rating" AS "Rating",
  "roast-date" AS "Roasted"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND origin = "Ethiopia"
  AND "roast-level" = "light"
  AND "avg-rating" >= 4.0
SORT "avg-rating" DESC
```

### Washed Process, High Altitude

```datacore
TABLE WITHOUT ID
  file.link AS "Bean",
  origin AS "Origin",
  altitude AS "Altitude (m)",
  processing AS "Process",
  "avg-rating" AS "Rating"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND processing = "washed"
  AND altitude >= 1700
SORT altitude DESC
```

### Natural Process by Origin

```datacore
TABLE
  origin AS "Origin",
  length(rows) AS "Naturals Count",
  round(sum(rows."avg-rating") / length(rows), 2) AS "Avg Rating",
  list(rows.file.link, 3) AS "Examples"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND (processing = "natural" OR processing = "Natural")
GROUP BY origin
SORT sum(rows."avg-rating") / length(rows) DESC
```

---

## 💎 Hidden Gems (Underrated Value)

```datacore
TABLE WITHOUT ID
  file.link AS "Bean",
  origin AS "Origin",
  "cost-per-100g" AS "$/100g",
  "avg-rating" AS "Rating",
  round("avg-rating" / "cost-per-100g", 2) AS "Value Score"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND "cost-per-100g" != null
  AND "cost-per-100g" < 15
  AND "avg-rating" >= 4.0
SORT ("avg-rating" / "cost-per-100g") DESC
LIMIT 15
```

**Purpose**: Find excellent beans at reasonable prices (high quality per dollar)

---

## 🆕 Recent Acquisitions (Last 30 Days)

```datacore
TABLE WITHOUT ID
  file.link AS "Bean",
  roaster AS "Roaster",
  "purchase-date" AS "Purchased",
  round((date(today) - "purchase-date").days, 0) AS "Days Ago",
  "total-sessions" AS "Brews",
  "avg-rating" AS "Rating"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND "purchase-date" >= date(today) - dur(30 days)
SORT "purchase-date" DESC
```

---

## ⚠️ Freshness Alert (Aging Beans)

```datacore
TABLE WITHOUT ID
  file.link AS "Bean",
  "roast-date" AS "Roasted",
  round((date(today) - "roast-date").days, 0) AS "Days Old",
  "current-weight" AS "Remaining (g)",
  choice((date(today) - "roast-date").days > 28, "⚠️ Use Soon", choice((date(today) - "roast-date").days > 21, "⏰ Aging", "✅ Fresh")) AS "Status"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND status = "active"
  AND "roast-date" != null
  AND (date(today) - "roast-date").days > 14
SORT (date(today) - "roast-date").days DESC
```

---

## 🎨 Flavor Profile Clustering

```datacore
TABLE
  primary-notes AS "Primary Flavor",
  length(rows) AS "Bean Count",
  round(sum(rows."avg-rating") / length(rows), 2) AS "Avg Rating",
  list(rows.file.link, 3) AS "Examples"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND primary-notes != null
FLATTEN primary-notes
GROUP BY primary-notes
HAVING length(rows) >= 2
SORT sum(rows."avg-rating") / length(rows) DESC
```

---

## 🔄 Rebuy Queue (Would Rebuy + Not in Stock)

```datacore
TABLE WITHOUT ID
  file.link AS "Bean",
  roaster AS "Roaster",
  "avg-rating" AS "Rating",
  "total-sessions" AS "Brews",
  "bag-finished" AS "Finished",
  "rebuy-priority" AS "Priority"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND "would-rebuy" = true
  AND (status = "archived" OR "bag-finished" != null)
SORT "rebuy-priority" DESC, "avg-rating" DESC
```

---

## 🌍 Origin-Variety Matrix

```datacore
TABLE
  origin AS "Origin",
  variety AS "Variety",
  length(rows) AS "Count",
  round(sum(rows."avg-rating") / length(rows), 2) AS "Avg Rating"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND origin != null
  AND variety != null
GROUP BY origin, variety
HAVING length(rows) >= 2
SORT sum(rows."avg-rating") / length(rows) DESC
```

---

## 🏆 Best by Processing Method

```datacore
TABLE
  processing AS "Processing",
  length(rows) AS "Beans",
  round(sum(rows."avg-rating") / length(rows), 2) AS "Avg Rating",
  max(rows."avg-rating") AS "Best",
  list(choice(rows."avg-rating" = max(rows."avg-rating"), rows.file.link, null)) AS "Top Bean"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND processing != null
  AND "avg-rating" != null
GROUP BY processing
SORT sum(rows."avg-rating") / length(rows) DESC
```

---

## 📊 Roaster Performance Comparison

```datacore
TABLE
  roaster AS "Roaster",
  length(rows) AS "Beans",
  round(sum(rows."avg-rating") / length(rows), 2) AS "Avg Quality",
  round(sum(rows."cost-per-100g") / length(rows), 2) AS "Avg Price",
  list(rows.file.link, 3) AS "Top Beans"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND roaster != null
GROUP BY roaster
HAVING length(rows) >= 2
SORT sum(rows."avg-rating") / length(rows) DESC
```

---

## 🎯 Recommended Next Purchase

```dataviewjs
// ML-powered recommendation based on preferences
const beans = dv.pages('"Beans Library"')
  .where(p => p.type === "bean-profile")
  .array();

// Find top-rated beans
const topRated = beans
  .filter(b => b["avg-rating"] >= 4.5 && b["total-sessions"] >= 3)
  .sort((a, b) => b["avg-rating"] - a["avg-rating"])
  .slice(0, 5);

// Find similar beans to top-rated
dv.header(3, "Recommended Based on Your Preferences");

topRated.forEach(bean => {
  dv.paragraph(`
**Similar to ${bean.name}** (${bean["avg-rating"]}⭐):  
→ Try other ${bean.origin} ${bean.processing} coffees  
→ Look for ${bean.variety} variety  
→ Roast level: ${bean["roast-level"]}
  `);
});
```

---

## 💡 Query Techniques

### Complex Filtering

```datacore
WHERE type = "bean-profile"
  AND origin = "Ethiopia"
  AND processing = "washed"
  AND "roast-level" = "light"
  AND "avg-rating" >= 4.5
  AND altitude >= 1800
```

### Multiple Aggregations

```datacore
GROUP BY origin
HAVING length(rows) >= 3
  AND sum(rows."avg-rating") / length(rows) >= 4.0
```

### Conditional Display

```datacore
choice(condition, "if-true", "if-false")
choice("transparency-score" >= 8, "🌟 High", "⚠️ Low")
```

### Nested Queries

```datacore
FROM "Beans Library"
WHERE "avg-rating" > (
  SELECT avg("avg-rating")
  FROM "Beans Library"
  WHERE type = "bean-profile"
)
```

---

**Coffee Vault 5.0** - Professional-grade bean analytics

