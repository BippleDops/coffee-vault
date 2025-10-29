---
type: database-view
title: Processing Method Database and Comparison
category: reference
tags: [processing, database, comparison, washed, natural, honey]
date: 2025-10-28
---

# 🔄 Processing Method Database

**Explore coffee by processing method**

---

## 🌊 Washed Process Varieties

```datacore
TABLE WITHOUT ID
  file.link AS "Coffee",
  origin AS "Origin",
  flavor-profile AS "Profile"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND processing = "Washed"
SORT file.name
LIMIT 50
```

---

## ☀️ Natural Process Varieties

```datacore
TABLE WITHOUT ID
  file.link AS "Coffee",
  origin AS "Origin",
  flavor-profile AS "Profile"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND (processing = "Natural" OR contains(processing, "Natural"))
SORT file.name
LIMIT 50
```

---

## 🍯 Honey Process Varieties

```datacore
TABLE WITHOUT ID
  file.link AS "Coffee",
  origin AS "Origin",
  processing AS "Honey Type"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND contains(processing, "Honey")
SORT file.name
```

---

## 🧪 Experimental Processing

```datacore
TABLE WITHOUT ID
  file.link AS "Coffee",
  origin AS "Origin",
  processing AS "Method"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND (contains(processing, "Anaerobic") OR contains(processing, "Experimental"))
SORT file.name
```

---

## 📊 Processing Method Distribution

```datacore
TABLE WITHOUT ID
  processing AS "🔄 Processing Method",
  length(rows) AS "# Varieties"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND processing != null
GROUP BY processing
SORT length(rows) DESC
```

---

**Complete processing method exploration and comparison tool**

