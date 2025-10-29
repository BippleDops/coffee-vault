---
type: database-view
title: Recipe Database View
category: recipes
created: 2025-10-28
tags: [view, recipes, brewing]
---

# 📖 Recipe Database View

**Complete database of reusable brewing recipes with success tracking**

---

## All Recipes

```datacore
TABLE
  file.link AS "Recipe",
  "brew-method" AS "Method",
  "times-used" AS "Uses",
  "success-rate" AS "Success %",
  "avg-rating" AS "Avg Rating",
  "best-rating" AS "Best"
FROM "Recipes"
WHERE type = "recipe-profile"
SORT "avg-rating" DESC, "times-used" DESC
```

---

## By Brewing Method

```datacore
TABLE
  "brew-method" AS "Method",
  length(rows) AS "Recipes",
  list(rows.file.link) AS "Recipe List"
FROM "Recipes"
WHERE type = "recipe-profile"
GROUP BY "brew-method"
SORT length(rows) DESC
```

---

## High Success Recipes

```datacore
TABLE
  file.link AS "Recipe",
  "brew-method" AS "Method",
  "success-rate" AS "Success %",
  "avg-rating" AS "Rating",
  "times-used" AS "Uses"
FROM "Recipes"
WHERE type = "recipe-profile"
  AND "success-rate" >= 85
SORT "success-rate" DESC, "avg-rating" DESC
```

---

## Recently Used

```datacore
TABLE
  file.link AS "Recipe",
  "brew-method" AS "Method",
  "last-used" AS "Last Used",
  "avg-rating" AS "Rating"
FROM "Recipes"
WHERE type = "recipe-profile"
  AND "last-used" != null
SORT "last-used" DESC
LIMIT 10
```

---

## By Target Origin

```datacore
TABLE
  "target-origin" AS "Origin",
  length(rows) AS "Recipes",
  list(rows.file.link) AS "Recipe List"
FROM "Recipes"
WHERE type = "recipe-profile"
  AND "target-origin" != null
GROUP BY "target-origin"
SORT length(rows) DESC
```

---

## Auto-Generated Recipes

```datacore
TABLE
  file.link AS "Recipe",
  "brew-method" AS "Method",
  "derived-from-log" AS "Source Log",
  "created-date" AS "Created",
  "avg-rating" AS "Rating"
FROM "Recipes"
WHERE type = "recipe-profile"
  AND "recipe-source" = "personal"
SORT "created-date" DESC
```

---

**Coffee Vault 5.0** - Your recipe library

