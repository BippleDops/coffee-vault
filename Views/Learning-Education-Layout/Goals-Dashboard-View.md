---
type: database-view
title: Goals Dashboard View
category: goals
created: 2025-10-28
tags: [view, goals, development]
---

# 🎯 Goals Dashboard View

**Track your coffee learning and development goals**

---

## Active Goals

```datacore
TABLE
  file.link AS "Goal",
  "goal-type" AS "Type",
  priority AS "Priority",
  "progress-percentage" AS "Progress %",
  "target-date" AS "Target Date"
FROM "Coffee Goals"
WHERE type = "coffee-goal"
  AND (status = "in-progress" OR status = "planned")
SORT priority DESC, "target-date" ASC
```

---

## In Progress

```datacore
TABLE
  file.link AS "Goal",
  "goal-type" AS "Type",
  "progress-percentage" AS "Progress",
  "checkpoints-completed" AS "Checkpoints",
  "checkpoints-total" AS "Total"
FROM "Coffee Goals"
WHERE type = "coffee-goal"
  AND status = "in-progress"
SORT "progress-percentage" DESC
```

---

## Completed Goals

```datacore
TABLE
  file.link AS "Goal",
  "goal-type" AS "Type",
  "completion-date" AS "Completed",
  "achievement-level" AS "Achievement",
  "actual-duration" AS "Duration"
FROM "Coffee Goals"
WHERE type = "coffee-goal"
  AND status = "completed"
SORT "completion-date" DESC
```

---

## Learning Goals

```datacore
TABLE
  file.link AS "Goal",
  "method-to-learn" AS "Method/Technique",
  "practice-sessions-completed" AS "Sessions",
  "practice-sessions-required" AS "Required",
  "progress-percentage" AS "Progress %"
FROM "Coffee Goals"
WHERE type = "coffee-goal"
  AND ("goal-type" = "learn-method" OR "goal-type" = "master-technique")
  AND status != "completed"
SORT "progress-percentage" DESC
```

---

## Exploration Goals

```datacore
TABLE
  file.link AS "Goal",
  "origin-to-explore" AS "Origin",
  "beans-tried-count" AS "Beans Tried",
  "beans-to-try-count" AS "Target",
  "progress-percentage" AS "Progress %"
FROM "Coffee Goals"
WHERE type = "coffee-goal"
  AND "goal-type" = "explore-origin"
  AND status != "completed"
SORT "progress-percentage" DESC
```

---

## Overdue Goals

```datacore
TABLE
  file.link AS "Goal",
  "goal-type" AS "Type",
  "target-date" AS "Target Date",
  "progress-percentage" AS "Progress",
  status AS "Status"
FROM "Coffee Goals"
WHERE type = "coffee-goal"
  AND "target-date" < date(today)
  AND status != "completed"
SORT "target-date" ASC
```

---

## Goals by Priority

```datacore
TABLE
  priority AS "Priority",
  length(rows) AS "Count",
  list(rows.file.link) AS "Goals"
FROM "Coffee Goals"
WHERE type = "coffee-goal"
  AND status != "completed"
GROUP BY priority
SORT priority DESC
```

---

**Coffee Vault 5.0** - Track your coffee journey

