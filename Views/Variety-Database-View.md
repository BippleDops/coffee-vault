---
type: database-view
title: Complete Coffee Variety Database
category: reference
tags: [database, varieties, comparison, reference]
date: 2025-10-28
---

# 🫘 Complete Coffee Variety Database

**Comprehensive variety reference with sortable comparisons**

---

## 🔍 All Coffee Varieties

```datacore
TABLE WITHOUT ID
  file.link AS "Variety",
  origin AS "Origin/Region",
  variety AS "Type",
  body AS "Body",
  acidity AS "Acidity",
  flavor-profile AS "Flavor Notes"
FROM "Beans Library"
WHERE type = "bean-profile"
SORT file.name ASC
LIMIT 200
```

---

## ⭐ Varieties by Complexity

```datacore
TABLE WITHOUT ID
  file.link AS "Variety",
  origin AS "Origin",
  tags AS "Tags"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND contains(flavor-profile, "complex")
SORT file.name ASC
```

---

## 🌍 Varieties by Origin

```datacore
TABLE WITHOUT ID
  origin AS "🌍 Origin",
  length(rows) AS "# Varieties"
FROM "Beans Library"
WHERE type = "bean-profile"
GROUP BY origin
SORT length(rows) DESC
```

---

## 🍓 Fruit-Forward Varieties

```datacore
TABLE WITHOUT ID
  file.link AS "Variety",
  origin AS "Origin",
  flavor-profile AS "Flavors"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND (contains(flavor-profile, "berry") OR contains(flavor-profile, "fruit"))
SORT file.name
```

---

## 🍫 Chocolate-Forward Varieties

```datacore
TABLE WITHOUT ID
  file.link AS "Variety",
  origin AS "Origin",
  body AS "Body"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND contains(flavor-profile, "chocolate")
SORT file.name
```

---

**Complete variety database for exploration and comparison**

