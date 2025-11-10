---
# =============================================================================
# BASE ENTITY TEMPLATE - Coffee Vault Schema Documentation
# =============================================================================
# This template demonstrates all YAML schema patterns used in Coffee Vault
# Use this as a reference when creating new entity types
# =============================================================================

# --- CORE IDENTIFICATION FIELDS ---
type: <% tp.system.suggester(["bean-profile", "coffee-log", "recipe-profile", "equipment-model", "cupping-session", "coffee-goal", "coffee-event", "producer-profile", "roaster-profile", "origin-profile", "processing-playbook", "sensory-experiment", "training-plan"], ["bean-profile", "coffee-log", "recipe-profile", "equipment-model", "cupping-session", "coffee-goal", "coffee-event", "producer-profile", "roaster-profile", "origin-profile", "processing-playbook", "sensory-experiment", "training-plan"]) %>
# type: string - Primary entity classifier for queries and organization

entity-name: <% tp.system.prompt("Entity name (unique identifier)") %>
# entity-name: string - Human-readable unique name for this entity

entity-id: <% tp.date.now("YYYYMMDDHHmmss") %>-<% Math.random().toString(36).substring(2, 8) %>
# entity-id: string - Auto-generated unique identifier (timestamp + random hash)

# --- TEMPORAL FIELDS ---
created-date: <% tp.date.now("YYYY-MM-DD") %>
# created-date: date (YYYY-MM-DD) - When entity was created

created-time: <% tp.date.now("HH:mm:ss") %>
# created-time: time (HH:mm:ss) - Time of entity creation

modified-date: <% tp.file.last_modified_date("YYYY-MM-DD") %>
# modified-date: date (YYYY-MM-DD) - Last modification date (auto-updated)

event-date: <% tp.system.prompt("Event/Activity date (YYYY-MM-DD)", tp.date.now("YYYY-MM-DD")) %>
# event-date: date (YYYY-MM-DD) - When the event/activity occurred (may differ from created-date)

# --- STATUS & LIFECYCLE FIELDS ---
status: <% tp.system.suggester(["active", "archived", "draft", "in-progress", "completed", "planned", "cancelled"], ["active", "archived", "draft", "in-progress", "completed", "planned", "cancelled"]) %>
# status: enum - Current lifecycle state
#   - active: Currently in use
#   - archived: Historical record, no longer active
#   - draft: Work in progress, not finalized
#   - in-progress: Currently being executed
#   - completed: Finished successfully
#   - planned: Scheduled for future
#   - cancelled: Abandoned/discontinued

priority: <% tp.system.suggester(["high", "medium", "low"], ["high", "medium", "low"]) %>
# priority: enum - Importance level (high/medium/low)

visibility: <% tp.system.suggester(["public", "private", "shared"], ["public", "private", "shared"]) %>
# visibility: enum - Access control level

# --- RATING & QUALITY FIELDS ---
rating: <% tp.system.prompt("Rating (0-5 scale)", "4.0") %>
# rating: number (0-5, decimals allowed) - Overall quality score

confidence-level: <% tp.system.prompt("Confidence level (1-5)", "3") %>
# confidence-level: integer (1-5) - How confident/reliable is this data
#   1 = very uncertain, 5 = highly confident

score: <% tp.system.prompt("Detailed score (0-100)", "85") %>
# score: number (0-100) - Precision scoring (e.g., SCA cupping scores)

# --- CATEGORICAL FIELDS ---
category: <% tp.system.suggester(["brewing", "equipment", "education", "sensory", "analysis", "planning", "documentation"], ["brewing", "equipment", "education", "sensory", "analysis", "planning", "documentation"]) %>
# category: string - Primary classification category

sub-category: <% tp.system.prompt("Sub-category (optional)") %>
# sub-category: string - Secondary classification

# --- ARRAY FIELDS (Multiple Values) ---
tags: "[<%  tp.frontmatter.type %>, <% tp.frontmatter.category %>, <% tp.date.now("YYYY-MM") %>, year: "<%  tp.date.now("YYYY")   %>]""
# tags: array[string] - Multiple labels for filtering and search
# Convention: Use kebab-case, include temporal tags (YYYY-MM, year:YYYY)
# Example: [bean-profile, ethiopia, natural-process, 2025-01, year:2025]

aliases: []
# aliases: array[string] - Alternative names for this entity
# Example: ["Ethiopian Yirg", "Yirgacheffe Natural", "Gedeb Lot 47"]

keywords: []
# keywords: array[string] - Search terms and metadata
# Example: ["floral", "bergamot", "jasmine", "stone-fruit"]

# --- LINK FIELDS (Relationships) ---
relationships:
  # Single link (one-to-one)
  uses-equipment: "[[<%  tp.system.prompt("Equipment name (optional)", "")  %>]"]
  # uses-equipment: link - Reference to single related entity

  # Multiple links (one-to-many)
  related-beans: []
  # related-beans: array[link] - Multiple entity references
  # Example: [[Brazil-Santos]], [[Colombia-Huila]], [[Ethiopia]]

  related-logs: []
  # related-logs: array[link] - Backlinks to related logs

  parent-entity: "[[<%  tp.system.prompt("Parent entity (optional)", "")  %>]"]
  # parent-entity: link - Hierarchical parent reference

  child-entities: []
  # child-entities: array[link] - Hierarchical children references

# --- OBJECT FIELDS (Nested Structures) ---
location:
  country: <% tp.system.prompt("Country (optional)", "") %>
  region: <% tp.system.prompt("Region (optional)", "") %>
  specific-location: <% tp.system.prompt("Specific location (optional)", "") %>
  coordinates: ""
# location: object - Nested structured data for geographic information
#   - All subfields are strings
#   - coordinates: "latitude,longitude" format

parameters:
  temperature: <% tp.system.prompt("Temperature (°C)", "") %>
  duration: <% tp.system.prompt("Duration (format: MM:SS)", "") %>
  quantity: <% tp.system.prompt("Quantity/amount", "") %>
  unit: <% tp.system.prompt("Unit of measure", "") %>
# parameters: object - Nested structured data for measurements/settings

metrics:
  value: 0
  unit: ""
  measurement-method: ""
  accuracy: ""
# metrics: object - Nested structured data for quantitative measurements

# --- NUMERIC FIELDS ---
quantity: <% tp.system.prompt("Quantity (numeric)", "1") %>
# quantity: number - General numeric value (integer or decimal)

dose: <% tp.system.prompt("Dose in grams (optional)", "18") %>
# dose: number - Weight measurement (grams)

temperature: <% tp.system.prompt("Temperature (°C, optional)", "93") %>
# temperature: number - Temperature value (Celsius)

price: <% tp.system.prompt("Price (USD, optional)", "0.00") %>
# price: number - Monetary value (2 decimal places)

percentage: 0
# percentage: number (0-100) - Percentage value

count: 0
# count: integer - Whole number count

# --- TEXT FIELDS ---
short-description: <% tp.system.prompt("Short description (1 line)", "") %>
# short-description: string - Brief summary (1-2 sentences, < 150 chars)

long-description: ""
# long-description: string - Extended description (multi-paragraph)

notes: ""
# notes: string - Free-form annotations and observations

url: ""
# url: string - Web link/reference

# --- BOOLEAN FIELDS ---
is-favorite: false
# is-favorite: boolean - Flag for favorites/starred items

is-public: false
# is-public: boolean - Public visibility flag

is-verified: false
# is-verified: boolean - Verification/validation status

has-media: false
# has-media: boolean - Indicates attached images/videos

# --- VALIDATION HINTS ---
# ✓ Date format: YYYY-MM-DD (ISO 8601)
# ✓ Time format: HH:mm:ss (24-hour)
# ✓ Links: [[Entity Name]] or [[Folder/Entity Name]]
# ✓ Arrays: [item1, item2, item3] or multi-line with "- item"
# ✓ Numbers: No quotes, use decimals for precision
# ✓ Strings: Quote if contains special chars, otherwise optional
# ✓ Booleans: true/false (lowercase, no quotes)
# ✓ Null values: Leave empty "" or omit field

---

# 📋 <% tp.frontmatter["entity-name"] %>

**Type**: <% tp.frontmatter.type %>
**Status**: <% tp.frontmatter.status %>
**Created**: <% tp.frontmatter["created-date"] %> at <% tp.frontmatter["created-time"] %>
**ID**: `<% tp.frontmatter["entity-id"] %>`

---

## 🎯 Overview

**Category**: <% tp.frontmatter.category %>
**Priority**: <% tp.frontmatter.priority %>
**Rating**: <% "⭐".repeat(Math.floor(parseFloat(tp.frontmatter.rating || 0))) %> (<% tp.frontmatter.rating || "N/A" %>/5)

<% tp.frontmatter["short-description"] %>

---

## 📝 Detailed Description

<% tp.file.cursor() %>

---

## 🔗 Relationships

### Related Entities

```dataview
TABLE type as "Type", status as "Status", rating as "Rating"
FROM [[<% tp.file.title %>]]
WHERE file.name != "<% tp.file.title %>"
SORT file.mtime DESC
LIMIT 10
```

### Usage in Logs

```dataview
TABLE date as "Date", type as "Type", rating as "Rating"
FROM "Coffee Logs"
WHERE contains(file.outlinks, [[<% tp.file.title %>]])
SORT date DESC
LIMIT 10
```

---

## 📊 Statistics

```dataview
TABLE WITHOUT ID
  length(rows) as "Total References",
  round(average(rows.rating), 2) as "Avg Rating",
  max(rows.date) as "Last Used"
FROM ""
WHERE contains(file.outlinks, [[<% tp.file.title %>]])
```

---

## 📸 Media & Documentation

**Attachments**:
**Photos**:
**Videos**:
**Documents**:

---

## 💭 Notes & Observations

**Key Insights**:


**Lessons Learned**:


**Future Considerations**:


---

## 🏷️ Metadata

**Tags**: <% (tp.frontmatter.tags || []).join(", ") %>
**Aliases**: <% (tp.frontmatter.aliases || []).join(", ") %>
**Modified**: <% tp.file.last_modified_date("YYYY-MM-DD HH:mm") %>

---

## 📚 Entity Type Examples

### Bean Profile Example
```yaml
type: bean-profile
bean-name: "Ethiopia Yirgacheffe Gedeb Natural"
roaster: [[Local Roastery]]
origin: Ethiopia
roast-level: light
roast-date: 2025-01-15
rating: 4.5
tags: [bean-profile, ethiopia, natural-process, floral]
```

### Coffee Log Example
```yaml
type: coffee-log
date: 2025-01-20
beans: [[Ethiopia]]
brew-method: v60
dose: 18
water: 300
brew-ratio: 1:16.7
rating: 4.0
tags: [coffee-log, v60, ethiopia, 2025-01]
```

### Equipment Model Example
```yaml
type: equipment-model
equipment-name: "Baratza Encore"
equipment-type: grinder
brand: Baratza
model: "Encore"
purchase-date: 2024-06-15
status: active
rating: 4.0
tags: [equipment, grinder, baratza]
```

### Cupping Session Example
```yaml
type: cupping-session
date: 2025-01-20
protocol: SCA
session-type: formal-cupping
location: Home
status: completed
tags: [cupping-session, SCA, 2025-01]
relationships:
  cupped-beans: [[Bean A]], [[Bean B]], [[Bean C]]
```

### Coffee Goal Example
```yaml
type: coffee-goal
goal-name: "Master Pour-Over Technique"
goal-type: skill-development
priority: high
status: in-progress
target-date: 2025-06-01
progress: 45
tags: [coffee-goal, skill, brewing, pour-over]
```

---

*Coffee Vault - Base Entity Template*
*Use this template to understand schema patterns and create new entity types*
