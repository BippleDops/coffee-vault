---
type: configuration
category: datacore
purpose: base-definitions
created: 2025-10-27
---

# Datacore Bases Definitions

**Reusable data views for Coffee Vault analytics**

---

## Core Data Bases

### All Coffee Logs
```datacore
TABLE WITHOUT ID
  file.link AS "Log",
  date AS "Date",
  beans AS "Bean",
  brew-method AS "Method",
  rating AS "Rating"
FROM "Coffee Logs"
WHERE type = "coffee-log"
SORT date DESC
LIMIT 100
```

### Recent Coffee Logs (Last 30 Days)
```datacore
TABLE WITHOUT ID
  file.link AS "Log",
  date AS "Date",
  beans AS "Bean",
  rating AS "Rating",
  brew-method AS "Method"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND date >= date(today) - dur(30 days)
SORT date DESC
```

### This Week's Logs
```datacore
TABLE WITHOUT ID
  file.link AS "Log",
  date AS "Date",
  beans AS "Bean",
  rating AS "Rating"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND date >= date(sow)
SORT date DESC
```

### This Month's Logs
```datacore
TABLE WITHOUT ID
  file.link AS "Log",
  date AS "Date",
  beans AS "Bean",
  rating AS "Rating"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND date >= date(som)
SORT date DESC
```

### High-Rated Sessions (4.5+)
```datacore
TABLE WITHOUT ID
  file.link AS "Session",
  date AS "Date",
  beans AS "Bean",
  brew-method AS "Method",
  rating AS "⭐ Rating"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND rating >= 4.5
SORT rating DESC, date DESC
LIMIT 50
```

### Active Bean Profiles
```datacore
TABLE WITHOUT ID
  file.link AS "Bean",
  roaster AS "Roaster",
  origin AS "Origin",
  roast-level AS "Roast",
  price AS "Price"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND status = "active"
SORT bean-name ASC
```

---

## Analytics Bases

### Beans by Average Rating
```datacore
TABLE WITHOUT ID
  beans AS "Bean",
  length(rows) AS "Sessions",
  round(sum(rows.rating) / length(rows), 2) AS "Avg Rating"
FROM "Coffee Logs"
WHERE type = "coffee-log" AND beans != null
GROUP BY beans
SORT sum(rows.rating) / length(rows) DESC
```

### Methods by Usage
```datacore
TABLE WITHOUT ID
  brew-method AS "Method",
  length(rows) AS "Uses",
  round(sum(rows.rating) / length(rows), 2) AS "Avg Rating"
FROM "Coffee Logs"
WHERE type = "coffee-log" AND brew-method != null
GROUP BY brew-method
SORT length(rows) DESC
```

### Origins by Performance
```datacore
TABLE WITHOUT ID
  origin AS "Origin",
  length(rows) AS "Sessions",
  round(sum(rows.rating) / length(rows), 2) AS "Avg Rating"
FROM "Coffee Logs"
WHERE type = "coffee-log" AND origin != null
GROUP BY origin
SORT sum(rows.rating) / length(rows) DESC
```

### Roast Levels by Preference
```datacore
TABLE WITHOUT ID
  roast-level AS "Roast Level",
  length(rows) AS "Sessions",
  round(sum(rows.rating) / length(rows), 2) AS "Avg Rating"
FROM "Coffee Logs"
WHERE type = "coffee-log" AND roast-level != null
GROUP BY roast-level
SORT sum(rows.rating) / length(rows) DESC
```

---

## Time-Based Bases

### Daily Brewing Stats (Last 30 Days)
```datacore
TABLE WITHOUT ID
  date AS "Date",
  length(rows) AS "Sessions",
  round(sum(rows.rating) / length(rows), 2) AS "Avg Rating",
  sum(rows.dose) AS "Total Coffee (g)"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND date >= date(today) - dur(30 days)
GROUP BY date
SORT date DESC
```

### Weekly Aggregation
```datacore
TABLE WITHOUT ID
  dateformat(date, "yyyy-'W'WW") AS "Week",
  length(rows) AS "Sessions",
  round(sum(rows.rating) / length(rows), 2) AS "Avg Rating"
FROM "Coffee Logs"
WHERE type = "coffee-log"
GROUP BY dateformat(date, "yyyy-'W'WW")
SORT dateformat(date, "yyyy-'W'WW") DESC
LIMIT 12
```

### Monthly Aggregation
```datacore
TABLE WITHOUT ID
  dateformat(date, "yyyy-MM") AS "Month",
  length(rows) AS "Sessions",
  round(sum(rows.rating) / length(rows), 2) AS "Avg Rating",
  round(sum(rows.dose), 1) AS "Total Coffee (g)"
FROM "Coffee Logs"
WHERE type = "coffee-log"
GROUP BY dateformat(date, "yyyy-MM")
SORT dateformat(date, "yyyy-MM") DESC
LIMIT 12
```

---

## Quality & Performance Bases

### Top 10 Sessions Ever
```datacore
TABLE WITHOUT ID
  file.link AS "Session",
  date AS "Date",
  beans AS "Bean",
  brew-method AS "Method",
  rating AS "⭐"
FROM "Coffee Logs"
WHERE type = "coffee-log"
SORT rating DESC, date DESC
LIMIT 10
```

### Consistency Leaders (Std Dev < 0.5)
```datacore
TABLE WITHOUT ID
  beans AS "Bean",
  length(rows) AS "Sessions"
FROM "Coffee Logs"
WHERE type = "coffee-log"
  AND beans != null
  AND length(rows) >= 3
GROUP BY beans
SORT length(rows) DESC
```

### Recent Improvements (Last 10 vs Previous 10)
```datacore
TABLE WITHOUT ID
  date AS "Date",
  beans AS "Bean",
  rating AS "Rating",
  "Recent" AS "Period"
FROM "Coffee Logs"
WHERE type = "coffee-log"
SORT date DESC
LIMIT 10
```

---

## Inventory & Cost Bases

### Beans Sorted by Price
```datacore
TABLE WITHOUT ID
  file.link AS "Bean",
  roaster AS "Roaster",
  price AS "Price",
  weight AS "Weight (g)"
FROM "Beans Library"
WHERE type = "bean-profile"
SORT price DESC
```

### Fresh Beans (Roasted < 14 days)
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

### Aging Beans (Roasted > 21 days)
```datacore
TABLE WITHOUT ID
  file.link AS "Bean",
  roast-date AS "Roasted",
  round((date(today) - roast-date).days, 0) AS "Days Old"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND roast-date != null
  AND (date(today) - roast-date).days > 21
SORT (date(today) - roast-date).days DESC
```

---

## Usage Instructions

### How to Use Bases

1. **Copy any base query** from above
2. **Paste into any note** in a datacore code block:
   ````markdown
   ```datacore
   [paste query here]
   ```
   ````
3. **Query updates automatically** when you open the note

### Creating Custom Bases

You can modify these bases by:
- Changing the `LIMIT` value
- Adding `WHERE` conditions
- Modifying `SORT` order
- Selecting different fields

### Performance Tips

- Always use `LIMIT` for large datasets
- Use `WHERE` to filter before `GROUP BY`
- Index frequently queried fields in Property Schema
- Use `date()` functions for dynamic date filtering

---

## Base Naming Conventions

**Use this format when creating new bases:**
- `[Subject]-by-[Metric]` (e.g., "Beans-by-Rating")
- `[Time-Period]-[Subject]` (e.g., "Recent-Coffee-Logs")
- `[Filter]-[Subject]` (e.g., "High-Rated-Sessions")

---

**Created**: 2025-10-27
**Version**: 1.0.0
**Compatible**: Datacore v1.0+
