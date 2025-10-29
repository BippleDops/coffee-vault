---
type: database-view
title: Advanced Analytics Base - Enhanced Queries
category: analytics
version: 5.0.0
tags: [view, analytics, advanced, datacore]
---

# 📊 Advanced Analytics Base

**Enhanced Datacore queries with aggregations, calculations, and insights**

**Coffee Vault 5.0** - Professional-grade database views

---

## 📈 Performance Metrics (Aggregated)

```datacore
TABLE WITHOUT ID
  beans AS "🫘 Bean",
  length(rows) AS "Sessions",
  round(sum(rows.rating) / length(rows), 2) AS "Avg ⭐",
  max(rows.rating) AS "Best",
  min(rows.rating) AS "Worst",
  round((max(rows.rating) - min(rows.rating)), 2) AS "Range",
  round(sqrt(sum((rows.rating - (sum(rows.rating) / length(rows)))^2) / length(rows)), 2) AS "σ"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND beans != null
  AND rating != null
GROUP BY beans
HAVING length(rows) >= 3
SORT sum(rows.rating) / length(rows) DESC
LIMIT 20
```

**Columns Explained**:
- **Sessions**: Number of brews
- **Avg**: Average rating (higher = better)
- **Best/Worst**: Rating range
- **Range**: Spread (lower = more consistent)
- **σ (Sigma)**: Standard deviation (lower = more consistent)

---

## 🎯 Consistency Leaders (Low Variance, High Quality)

```datacore
TABLE WITHOUT ID
  beans AS "Bean",
  length(rows) AS "Brews",
  round(sum(rows.rating) / length(rows), 2) AS "Avg Rating",
  round(sqrt(sum((rows.rating - (sum(rows.rating) / length(rows)))^2) / length(rows)), 3) AS "Std Dev"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND beans != null
  AND rating != null
GROUP BY beans
HAVING length(rows) >= 5
  AND sum(rows.rating) / length(rows) >= 4.0
SORT sqrt(sum((rows.rating - (sum(rows.rating) / length(rows)))^2) / length(rows)) ASC
LIMIT 10
```

**Purpose**: Find beans with consistent high quality (low std dev + high avg rating)

---

## 💰 Value Champions (Quality per Dollar)

```datacore
TABLE WITHOUT ID
  beans AS "Bean",
  length(rows) AS "Brews",
  round(sum(rows.rating) / length(rows), 2) AS "Avg Rating",
  "Medium" AS "Price Range",
  round((sum(rows.rating) / length(rows)) / 1.5, 2) AS "Value Score"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND beans != null
  AND rating != null
GROUP BY beans
HAVING length(rows) >= 3
  AND sum(rows.rating) / length(rows) >= 4.0
SORT (sum(rows.rating) / length(rows)) DESC
LIMIT 15
```

**Note**: In production, would calculate from actual bean prices  
**Value Score**: Rating / (Price per 100g) - higher = better value

---

## 🔥 Hot Streak (Recent Excellence)

```datacore
TABLE WITHOUT ID
  file.link AS "Recent Brews",
  date AS "Date",
  beans AS "Bean",
  brew-method AS "Method",
  rating AS "⭐",
  "🔥" AS "Streak"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND rating >= 4.5
  AND date >= date(today) - dur(14 days)
SORT date DESC
```

**Purpose**: Celebrate recent excellent brews (4.5+ in last 2 weeks)

---

## 📊 Method Proficiency Matrix

```datacore
TABLE
  brew-method AS "☕ Method",
  length(rows) AS "Total Uses",
  round(sum(rows.rating) / length(rows), 2) AS "Avg Rating",
  count(rows.rating >= 4.5) AS "Excellent",
  round((count(rows.rating >= 4.5) / length(rows)) * 100, 0) AS "Excellence %"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND brew-method != null
GROUP BY brew-method
SORT sum(rows.rating) / length(rows) DESC
```

**Purpose**: See which methods you've mastered (high avg + high excellence %)

---

## 🌍 Origin Performance with Statistics

```datacore
TABLE WITHOUT ID
  origin AS "Origin",
  length(rows) AS "Brews",
  round(sum(rows.rating) / length(rows), 2) AS "Avg",
  max(rows.rating) AS "Peak",
  count(rows.rating >= 4.5) AS "Excellent",
  list(rows.beans)[0] AS "Top Bean"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND origin != null
  AND rating != null
GROUP BY origin
HAVING length(rows) >= 2
SORT sum(rows.rating) / length(rows) DESC
```

---

## 🔬 Extraction Analysis (For Measured Brews)

```datacore
TABLE WITHOUT ID
  file.link AS "Brew",
  beans AS "Bean",
  dose AS "Dose",
  water AS "Water",
  "extraction-yield" AS "EY %",
  "tds-brewed" AS "TDS %",
  rating AS "Rating"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND "extraction-yield" != null
  AND "tds-brewed" != null
SORT rating DESC
LIMIT 20
```

**Purpose**: Analyze measured extractions (requires TDS meter data)

---

## 📅 Temporal Patterns

```datacore
TABLE WITHOUT ID
  dateformat(date, "yyyy-MM") AS "Month",
  length(rows) AS "Brews",
  round(sum(rows.rating) / length(rows), 2) AS "Avg Rating",
  round(sum(rows.dose), 0) AS "Coffee Used (g)",
  count(rows.rating >= 4.5) AS "Excellent Brews"
FROM "Coffee Logs"
WHERE type = "coffee-log"
GROUP BY dateformat(date, "yyyy-MM")
SORT dateformat(date, "yyyy-MM") DESC
LIMIT 12
```

**Purpose**: Track performance trends over time

---

## 🏆 Personal Bests

```datacore
TABLE WITHOUT ID
  choice(rating = 5.0, "🏆", choice(rating >= 4.8, "🥇", choice(rating >= 4.5, "🥈", "🥉"))) AS "",
  file.link AS "Session",
  date AS "Date",
  beans AS "Bean",
  brew-method AS "Method",
  rating AS "Rating"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND rating >= 4.5
SORT rating DESC, date DESC
LIMIT 25
```

**Purpose**: Your greatest brewing achievements with medals!

---

## 🔄 Brew Again Queue (High-Rated, Long Time Ago)

```datacore
TABLE WITHOUT ID
  beans AS "Bean to Rebrew",
  max(rows.date) AS "Last Brewed",
  round((date(today) - max(rows.date)).days, 0) AS "Days Ago",
  round(sum(rows.rating) / length(rows), 2) AS "Avg Rating",
  length(rows) AS "Past Brews"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND beans != null
  AND rating != null
GROUP BY beans
HAVING sum(rows.rating) / length(rows) >= 4.3
  AND (date(today) - max(rows.date)).days > 30
SORT sum(rows.rating) / length(rows) DESC
LIMIT 10
```

**Purpose**: Find great beans you haven't brewed recently (rebuy candidates!)

---

## 📊 Grind Size Distribution by Method

```datacore
TABLE
  brew-method AS "Method",
  "grind-size" AS "Grind",
  length(rows) AS "Uses",
  round(sum(rows.rating) / length(rows), 2) AS "Avg Rating"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND brew-method != null
  AND "grind-size" != null
GROUP BY brew-method, "grind-size"
SORT brew-method ASC, sum(rows.rating) / length(rows) DESC
```

**Purpose**: Find optimal grind size for each method

---

## 🌡️ Temperature Sweet Spots

```datacore
TABLE WITHOUT ID
  "water-temperature" AS "Temp (°C)",
  length(rows) AS "Brews",
  round(sum(rows.rating) / length(rows), 2) AS "Avg Rating",
  list(rows.beans, 3) AS "Beans Used"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND "water-temperature" != null
  AND rating != null
GROUP BY "water-temperature"
HAVING length(rows) >= 3
SORT sum(rows.rating) / length(rows) DESC
```

**Purpose**: Find your optimal brewing temperatures

---

## 🎨 Flavor Profile Tracking

```datacore
TABLE WITHOUT ID
  beans AS "Bean",
  origin AS "Origin",
  descriptors AS "Flavors Noted",
  round(sum(rows.rating) / length(rows), 2) AS "Avg Rating"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND descriptors != null
GROUP BY beans, origin, descriptors
HAVING length(rows) >= 2
SORT sum(rows.rating) / length(rows) DESC
LIMIT 15
```

**Purpose**: Track which flavor profiles you enjoy most

---

## 🔗 Relationship Tracking (5.0 Feature)

```datacore
TABLE WITHOUT ID
  file.link AS "Log",
  date AS "Date",
  relationships."uses-bean" AS "Bean Link",
  relationships."uses-equipment" AS "Equipment",
  rating AS "Rating"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND relationships != null
SORT date DESC
LIMIT 20
```

**Purpose**: Visualize entity relationships (Coffee Vault 5.0)

---

## 📋 Data Quality Check

```datacore
TABLE WITHOUT ID
  file.link AS "Log",
  date AS "Date",
  choice(beans = null, "❌ Missing", "✓") AS "Bean",
  choice(brew-method = null, "❌ Missing", "✓") AS "Method",
  choice(dose = null, "❌ Missing", "✓") AS "Dose",
  choice(rating = null, "❌ Missing", "✓") AS "Rating"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND (beans = null OR brew-method = null OR dose = null OR rating = null)
SORT date DESC
LIMIT 20
```

**Purpose**: Find incomplete logs that need data entry

---

## 💡 Query Tips

### Advanced Filtering

Use `HAVING` for aggregated conditions:
```datacore
HAVING length(rows) >= 5
  AND sum(rows.rating) / length(rows) >= 4.0
```

### Calculated Fields

```datacore
round(sum(rows.rating) / length(rows), 2) AS "Average"
```

### Conditional Display

```datacore
choice(rating >= 4.5, "Excellent", choice(rating >= 4.0, "Good", "Fair"))
```

### Date Math

```datacore
WHERE date >= date(today) - dur(30 days)
```

---

**Coffee Vault 5.0** - Professional-grade analytics queries

