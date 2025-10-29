---
type: dashboard
title: Origin Explorer - Geographic Coffee Database
category: exploration
tags: [dashboard, origins, geography, exploration]
date: 2025-10-28
---

# 🌍 Origin Explorer Dashboard

**Explore coffee by geographic origin**

---

## 🗺️ All Coffee Origins

```datacore
TABLE WITHOUT ID
  file.link AS "Origin/Region",
  country AS "Country",
  altitude-range AS "Altitude (MASL)",
  flavor-profile AS "Typical Flavors"
FROM "Origins"
WHERE type = "origin-profile"
SORT country ASC, file.name ASC
LIMIT 100
```

---

## 📊 Origins by Continent

```datacore
TABLE WITHOUT ID
  region AS "🌏 Continent/Region",
  length(rows) AS "# Countries Profiled"
FROM "Origins"
WHERE type = "origin-profile"
  AND region != null
GROUP BY region
SORT length(rows) DESC
```

---

## ⭐ High-Altitude Origins (Premium Quality)

```datacore
TABLE WITHOUT ID
  file.link AS "Origin",
  altitude-range AS "Altitude",
  flavor-profile AS "Character"
FROM "Origins"
WHERE type = "origin-profile"
  AND altitude-range != null
SORT file.name
```

---

## 🫘 Beans Available from Each Origin

```datacore
TABLE WITHOUT ID
  origin AS "🌍 Origin",
  length(rows) AS "Varieties in Library"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND origin != null
GROUP BY origin
SORT length(rows) DESC
LIMIT 30
```

---

**Complete geographic coffee exploration tool**

