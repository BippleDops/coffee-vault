---
type: dashboard
category: master
auto-update: true
created: 2025-10-27
---

# ☕ Master Coffee Dashboard

**Your complete brewing intelligence at a glance**

---

## 📊 Current Status

### This Week

```datacore
TABLE WITHOUT ID
  date AS "Date",
  beans AS "Bean",
  brew-method AS "Method",
  rating AS "⭐"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND date >= date(sow)
SORT date DESC
LIMIT 50
```

### Quick Stats

```datacore
TABLE WITHOUT ID
  "Total Sessions" AS "Metric",
  length(rows) AS "Count"
FROM "Coffee Logs"
WHERE type = "coffee-log"
```

```datacore
TABLE WITHOUT ID
  "Average Rating" AS "Metric",
  round(sum(rows.rating) / length(rows), 2) AS "Value"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND rating != null
```

```datacore
TABLE WITHOUT ID
  "Total Coffee Used" AS "Metric",
  round(sum(rows.dose), 1) + " g" AS "Amount"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND dose != null
```

---

## 🏆 Top Performers

### Best Beans (by Average Rating)

```datacore
TABLE WITHOUT ID
  beans AS "🫘 Bean",
  length(rows) AS "Sessions",
  round(sum(rows.rating) / length(rows), 2) AS "⭐ Avg"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND beans != null
  AND rating != null
GROUP BY beans
SORT sum(rows.rating) / length(rows) DESC
LIMIT 5
```

### Best Methods (by Average Rating)

```datacore
TABLE WITHOUT ID
  brew-method AS "☕ Method",
  length(rows) AS "Uses",
  round(sum(rows.rating) / length(rows), 2) AS "⭐ Avg"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND brew-method != null
  AND rating != null
GROUP BY brew-method
SORT sum(rows.rating) / length(rows) DESC
```

### Top 10 Sessions Ever

```datacore
TABLE WITHOUT ID
  file.link AS "Session",
  date AS "Date",
  beans AS "Bean",
  rating AS "⭐"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND rating != null
SORT rating DESC, date DESC
LIMIT 10
```

---

## 📈 Trends

### Last 30 Days Performance

```datacore
TABLE WITHOUT ID
  date AS "Date",
  length(rows) AS "Sessions",
  round(sum(rows.rating) / length(rows), 2) AS "Avg ⭐",
  sum(rows.dose) AS "Coffee (g)"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND date >= date(today) - dur(30 days)
GROUP BY date
SORT date DESC
LIMIT 30
```

### Monthly Summary

```datacore
TABLE WITHOUT ID
  dateformat(date, "yyyy-MM") AS "Month",
  length(rows) AS "Sessions",
  round(sum(rows.rating) / length(rows), 2) AS "Avg ⭐",
  round(sum(rows.dose), 0) AS "Total Coffee (g)"
FROM "Coffee Logs"
WHERE type = "coffee-log"
GROUP BY dateformat(date, "yyyy-MM")
SORT dateformat(date, "yyyy-MM") DESC
LIMIT 6
```

---

## 🫘 Inventory Status

### Active Beans

```datacore
TABLE WITHOUT ID
  file.link AS "Bean",
  roaster AS "Roaster",
  origin AS "Origin",
  roast-level AS "Roast",
  price AS "💰"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND (status = "active" OR status = null)
SORT bean-name ASC
```

### Fresh Beans (< 14 days old)

```datacore
TABLE WITHOUT ID
  file.link AS "Bean",
  roast-date AS "Roasted",
  round((date(today) - roast-date).days, 0) AS "Days Old"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND roast-date != null
  AND (date(today) - roast-date).days <= 14
SORT roast-date DESC
```

### ⚠️ Aging Beans (> 21 days old)

```datacore
TABLE WITHOUT ID
  file.link AS "Bean",
  roast-date AS "Roasted",
  round((date(today) - roast-date).days, 0) AS "⏰ Days Old"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND roast-date != null
  AND (date(today) - roast-date).days > 21
SORT (date(today) - roast-date).days DESC
```

---

## 🎯 Recommendations

### Beans to Reorder (High rated, multiple sessions)

```datacore
TABLE WITHOUT ID
  beans AS "Bean",
  length(rows) AS "Sessions",
  round(sum(rows.rating) / length(rows), 2) AS "⭐ Avg"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND beans != null
  AND rating != null
GROUP BY beans
HAVING sum(rows.rating) / length(rows) >= 4.5
  AND length(rows) >= 3
SORT sum(rows.rating) / length(rows) DESC
LIMIT 5
```

### Recent Experiments (Last 7 days)

```datacore
TABLE WITHOUT ID
  file.link AS "Log",
  date AS "Date",
  beans AS "Bean",
  rating AS "⭐"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND date >= date(today) - dur(7 days)
SORT date DESC
LIMIT 20
```

---

## 🔍 Quick Analysis

### Origins Performance

```datacore
TABLE WITHOUT ID
  origin AS "🌍 Origin",
  length(rows) AS "Sessions",
  round(sum(rows.rating) / length(rows), 2) AS "⭐ Avg"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND origin != null
  AND rating != null
GROUP BY origin
HAVING length(rows) >= 2
SORT sum(rows.rating) / length(rows) DESC
LIMIT 20
```

### Roast Level Preference

```datacore
TABLE WITHOUT ID
  roast-level AS "Roast",
  length(rows) AS "Sessions",
  round(sum(rows.rating) / length(rows), 2) AS "⭐ Avg"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND roast-level != null
  AND rating != null
GROUP BY roast-level
SORT sum(rows.rating) / length(rows) DESC
```

### Grind Size Distribution

```datacore
TABLE WITHOUT ID
  grind-size AS "Grind",
  length(rows) AS "Uses",
  round(sum(rows.rating) / length(rows), 2) AS "⭐ Avg"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND grind-size != null
  AND rating != null
GROUP BY grind-size
SORT length(rows) DESC
```

---

## 📅 Recent Activity

### Last 10 Sessions

```datacore
TABLE WITHOUT ID
  file.link AS "Session",
  date AS "Date",
  beans AS "Bean",
  brew-method AS "Method",
  rating AS "⭐"
FROM "Coffee Logs"
WHERE type = "coffee-log"
SORT date DESC
LIMIT 10
```

---

## 💰 Cost Intelligence

### Beans by Price

```datacore
TABLE WITHOUT ID
  file.link AS "Bean",
  roaster AS "Roaster",
  price AS "💰 Price",
  weight AS "Weight (g)"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND price != null
SORT price DESC
```

### Value Champions (High rating, lower price)

```datacore
TABLE WITHOUT ID
  beans AS "Bean",
  length(rows) AS "Sessions",
  round(sum(rows.rating) / length(rows), 2) AS "⭐ Avg"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND beans != null
  AND rating != null
GROUP BY beans
HAVING sum(rows.rating) / length(rows) >= 4.0
  AND length(rows) >= 3
SORT sum(rows.rating) / length(rows) DESC
LIMIT 10
```

---

## 🎓 Learning Resources

**Quick Links:**
- [[START-HERE]] - Quick start guide
- [[Property-Schema]] - All properties
- [[Bases-Definitions]] - Datacore queries
- [[VAULT-ARCHITECTURE-REFERENCE]] - Technical reference

**Analytics Dashboards:**
- [[1-Monthly-Analytics-Dashboard]] - Comprehensive stats
- [[2-Brewing-Optimization-Engine]] - ML recommendations
- [[Live-Weekly-Summary]] - This week's performance
- [[Live-Inventory-Status]] - Bean inventory

---

**Last Updated**: Auto-refreshes on open
**Data Source**: Coffee Logs & Beans Library
**Query Engine**: Datacore v1.0+

*Your complete brewing intelligence system*
