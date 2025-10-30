---
type: database-view
title: Producer Database View
category: producers
created: 2025-10-28
tags: [view, producers, supply-chain]
---

# 🌱 Producer Database View

**Complete database of coffee producers, farms, cooperatives, and supply chain partners**

---

## All Producers

```datacore
TABLE
  file.link AS "Producer",
  category AS "Type",
  country AS "Country",
  hectares AS "Size (ha)",
  certifications AS "Certifications",
  "sustainability-rating" AS "Sustainability",
  "relationship-strength" AS "Relationship"
FROM "Producers"
WHERE type = "producer-profile"
SORT country ASC, name ASC
```

---

## By Country

```datacore
TABLE
  country AS "Country",
  length(rows) AS "Producers",
  list(rows.file.link) AS "Producers List"
FROM "Producers"
WHERE type = "producer-profile"
GROUP BY country
SORT length(rows) DESC
```

---

## High Sustainability Producers

```datacore
TABLE
  file.link AS "Producer",
  country AS "Country",
  "environmental-impact-score" AS "Environmental",
  "social-impact-score" AS "Social",
  "sustainability-rating" AS "Overall"
FROM "Producers"
WHERE type = "producer-profile"
  AND "sustainability-rating" != null
SORT "environmental-impact-score" DESC, "social-impact-score" DESC
```

---

## Direct Trade Relationships

```datacore
TABLE
  file.link AS "Producer",
  country AS "Country",
  "roaster-partners" AS "Partners",
  "relationship-years" AS "Years",
  "price-premium" AS "Premium %"
FROM "Producers"
WHERE type = "producer-profile"
  AND "direct-trade-verified" = true
SORT "relationship-years" DESC
```

---

## Certifications Overview

```datacore
TABLE
  file.link AS "Producer",
  country AS "Country",
  certifications AS "Certifications",
  "organic-percentage" AS "Organic %"
FROM "Producers"
WHERE type = "producer-profile"
  AND certifications != null
SORT length(certifications) DESC
```

---

**Coffee Vault 5.0** - Complete producer transparency

