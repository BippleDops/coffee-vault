---
type: documentation
title: Coffee Vault 5.0 - Hierarchical Tagging System
version: 5.0.0
date: 2025-10-28
tags: [documentation, coffee-vault-5.0, tagging, organization]
---

# Coffee Vault 5.0 - Hierarchical Tagging System

**Purpose**: Complete guide to the 6-level hierarchical tagging system in Coffee Vault 5.0

**Version**: 5.0.0  
**Last Updated**: 2025-10-28

---

## Overview

Coffee Vault 5.0 introduces a **6-level hierarchical tagging system** that provides multi-dimensional organization and powerful filtering capabilities. Tags are structured in layers from broad categories to specific attributes.

---

## Tag Hierarchy

### Level 1: Primary Categories

Top-level entity classification:

```yaml
tags:
  - category:coffee-log
  - category:bean-profile
  - category:origin-profile
  - category:roaster-profile
  - category:producer-profile
  - category:cupping-session
  - category:recipe-profile
  - category:equipment-model
  - category:coffee-event
  - category:coffee-goal
  - category:brewing-guide
  - category:scientific-reference
```

**Purpose**: Entity type identification  
**Usage**: Filter by entity type in queries  
**Format**: `category:type-name`

---

### Level 2: Subcategories

Second-level classification within entity types:

```yaml
# Coffee Logs
tags:
  - category:coffee-log
  - method:v60
  - method:chemex
  - method:aeropress
  - method:espresso

# Bean Profiles
tags:
  - category:bean-profile
  - origin:ethiopia
  - origin:colombia
  - origin:kenya

# Scientific References
tags:
  - category:scientific-reference
  - subject:extraction-science
  - subject:coffee-chemistry
  - subject:roasting
```

**Purpose**: Primary classification dimension  
**Usage**: Filter within entity types  
**Format**: `method:name`, `origin:name`, `subject:name`

---

### Level 3: Attributes

Specific characteristics and properties:

```yaml
# Roast Levels
tags:
  - roast:light
  - roast:medium
  - roast:dark

# Processing Methods
tags:
  - processing:natural
  - processing:washed
  - processing:honey
  - processing:anaerobic

# Equipment Categories
tags:
  - equipment:grinder
  - equipment:brewer
  - equipment:scale

# Event Types
tags:
  - event:cafe-visit
  - event:workshop
  - event:competition
```

**Purpose**: Attribute-based filtering  
**Usage**: Filter by specific characteristics  
**Format**: `attribute:value`

---

### Level 4: Quality Markers

Quality and performance indicators:

```yaml
# Quality Ratings
tags:
  - quality:excellent    # Rating >= 4.5
  - quality:very-good    # Rating 4.0-4.4
  - quality:good         # Rating 3.5-3.9
  - quality:fair         # Rating 3.0-3.4
  - quality:poor         # Rating < 3.0

# Performance States
tags:
  - dialed-in:true
  - dialed-in:false
  - specialty-grade:true
  - specialty-grade:false
```

**Purpose**: Quality-based filtering and discovery  
**Usage**: Find high-quality entities  
**Format**: `quality:level`, `state:boolean`

---

### Level 5: Personal Markers

Personal preference and status markers:

```yaml
# Preferences
tags:
  - personal:favorite
  - personal:to-try
  - personal:avoid
  - personal:rebuy
  - personal:explore-more

# Purchase Intent
tags:
  - to-rebuy:true
  - to-rebuy:false
  - would-recommend:true
  - would-recommend:false

# Learning Status
tags:
  - learning:beginner
  - learning:practicing
  - learning:mastered
```

**Purpose**: Personal organization and tracking  
**Usage**: Track preferences and goals  
**Format**: `personal:marker`, `intent:value`

---

### Level 6: Temporal Tags

Time-based organization:

```yaml
# Month Tags
tags:
  - month:2025-10
  - month:2025-11

# Season Tags
tags:
  - season:spring
  - season:summer
  - season:fall
  - season:winter

# Year Tags
tags:
  - year:2025
  - year:2026

# Quarter Tags
tags:
  - quarter:2025-Q4
  - quarter:2026-Q1
```

**Purpose**: Temporal filtering and tracking  
**Usage**: Find entities by time period  
**Format**: `month:YYYY-MM`, `season:name`, `year:YYYY`

---

## Smart Tag Inference

Coffee Vault 5.0 automatically infers tags based on properties:

### Automatic Tag Generation

```yaml
# From Bean Properties
origin: Ethiopia          → tags: [origin:ethiopia]
roast-level: light        → tags: [roast:light]
processing: natural       → tags: [processing:natural]

# From Quality
rating: 4.7               → tags: [quality:excellent]
rating: 4.2               → tags: [quality:very-good]
specialty-grade: true     → tags: [specialty-grade:true]

# From Date
date: 2025-10-28          → tags: [month:2025-10, year:2025, season:fall]

# From Method
brew-method: v60          → tags: [method:v60]
```

### Template Integration

Templates auto-populate tags based on user input:

```yaml
<%* 
// Auto-generate tags in template
const tags = [`category:${tp.frontmatter.type}`];

if (tp.frontmatter.origin) {
  tags.push(`origin:${tp.frontmatter.origin.toLowerCase()}`);
}

if (tp.frontmatter.rating >= 4.5) {
  tags.push('quality:excellent');
}

// Add date-based tags
const date = new Date(tp.frontmatter.date);
const month = date.toISOString().slice(0, 7);
tags.push(`month:${month}`);
%>
tags: [<% tags.join(', ') %>]
```

---

## Tag Naming Conventions

### Rules

1. **Lowercase**: All tags lowercase with hyphens
2. **Prefix Format**: `prefix:value`
3. **No Spaces**: Use hyphens for multi-word values
4. **Consistent Naming**: Use standard prefixes

### Standard Prefixes

| Prefix | Usage | Example |
|--------|-------|---------|
| `category` | Entity type | `category:coffee-log` |
| `method` | Brew method | `method:v60` |
| `origin` | Geographic origin | `origin:ethiopia` |
| `roast` | Roast level | `roast:light` |
| `processing` | Processing method | `processing:natural` |
| `quality` | Quality rating | `quality:excellent` |
| `personal` | Personal markers | `personal:favorite` |
| `month` | Month/date | `month:2025-10` |
| `season` | Season | `season:fall` |
| `year` | Year | `year:2025` |
| `subject` | Topic/subject | `subject:extraction` |
| `event` | Event type | `event:cafe-visit` |
| `equipment` | Equipment type | `equipment:grinder` |
| `goal` | Goal type | `goal:learn-method` |

---

## Query Examples

### Basic Tag Queries

```dataviewjs
// Find all V60 brews
const v60Brews = dv.pages()
  .where(p => p.tags && p.tags.includes("method:v60"));

dv.table(["Date", "Bean", "Rating"],
  v60Brews.map(p => [p.date, p.beans, p.rating])
);
```

### Multi-Level Tag Filtering

```dataviewjs
// Find excellent Ethiopian light roasts
const results = dv.pages()
  .where(p => 
    p.tags &&
    p.tags.includes("origin:ethiopia") &&
    p.tags.includes("roast:light") &&
    p.tags.includes("quality:excellent")
  );

dv.table(["Bean", "Roaster", "Rating"],
  results.map(p => [p.name, p.roaster, p.rating])
);
```

### Temporal + Quality Filtering

```dataviewjs
// Find favorites from this month
const thisMonth = dv.pages()
  .where(p =>
    p.tags &&
    p.tags.includes("month:2025-10") &&
    p.tags.includes("personal:favorite")
  );

dv.list(thisMonth.map(p => p.file.link));
```

### Tag Aggregation

```dataviewjs
// Count entities by origin
const origins = {};
dv.pages()
  .where(p => p.tags)
  .forEach(p => {
    p.tags.filter(t => t.startsWith("origin:")).forEach(tag => {
      const origin = tag.split(":")[1];
      origins[origin] = (origins[origin] || 0) + 1;
    });
  });

dv.table(["Origin", "Count"],
  Object.entries(origins)
    .sort((a, b) => b[1] - a[1])
    .map(([origin, count]) => [origin, count])
);
```

---

## Complete Tagging Examples

### Coffee Log

```yaml
---
type: coffee-log
date: 2025-10-28
beans: Ethiopian Yirgacheffe
brew-method: v60
rating: 4.7
tags:
  # Level 1: Category
  - category:coffee-log
  
  # Level 2: Subcategory
  - method:v60
  - origin:ethiopia
  
  # Level 3: Attributes
  - roast:light
  - processing:natural
  
  # Level 4: Quality
  - quality:excellent
  - dialed-in:true
  
  # Level 5: Personal
  - personal:favorite
  - to-rebuy:true
  
  # Level 6: Temporal
  - month:2025-10
  - season:fall
  - year:2025
---
```

### Bean Profile

```yaml
---
type: bean-profile
name: Ethiopian Yirgacheffe Kochere
origin: Ethiopia
roast-level: light
processing: natural
tags:
  # Level 1: Category
  - category:bean-profile
  
  # Level 2: Subcategory  
  - origin:ethiopia
  
  # Level 3: Attributes
  - roast:light
  - processing:natural
  - variety:heirloom
  
  # Level 4: Quality
  - specialty-grade:true
  - quality:excellent
  
  # Level 5: Personal
  - personal:favorite
  - to-rebuy:true
  
  # Level 6: Temporal
  - purchase:2025-10
  - year:2025
---
```

### Cupping Session

```yaml
---
type: cupping-session
date: 2025-10-28
protocol: SCA
tags:
  # Level 1: Category
  - category:cupping-session
  
  # Level 2: Subcategory
  - protocol:sca
  - session-type:formal-cupping
  
  # Level 3: Attributes
  - sample-count:5
  
  # Level 4: Quality
  - quality:excellent
  
  # Level 5: Personal
  - personal:learning
  
  # Level 6: Temporal
  - month:2025-10
  - year:2025
---
```

---

## Tag Maintenance

### Consistency Checks

Regular tag validation:

```dataviewjs
// Find inconsistent tags
const allTags = new Set();
dv.pages().forEach(p => {
  if (p.tags) {
    p.tags.forEach(tag => allTags.add(tag));
  }
});

// Group by prefix
const byPrefix = {};
allTags.forEach(tag => {
  const [prefix] = tag.split(":");
  if (!byPrefix[prefix]) byPrefix[prefix] = [];
  byPrefix[prefix].push(tag);
});

dv.table(["Prefix", "Count", "Tags"],
  Object.entries(byPrefix).map(([prefix, tags]) => [
    prefix,
    tags.length,
    tags.slice(0, 5).join(", ") + (tags.length > 5 ? "..." : "")
  ])
);
```

### Tag Cleanup

Remove unused tags:

```dataviewjs
// Find tags used only once
const tagCounts = {};
dv.pages().forEach(p => {
  if (p.tags) {
    p.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  }
});

const singleUse = Object.entries(tagCounts)
  .filter(([tag, count]) => count === 1)
  .map(([tag]) => tag);

dv.paragraph(`**Single-use tags** (consider removing or consolidating):`);
dv.list(singleUse);
```

---

## Best Practices

### DO

- ✅ Use consistent tag prefixes
- ✅ Auto-generate tags in templates
- ✅ Keep tags lowercase with hyphens
- ✅ Use all 6 levels for maximum discoverability
- ✅ Regularly validate tag consistency

### DON'T

- ❌ Mix naming conventions (origin:Ethiopia vs origin:ethiopia)
- ❌ Create redundant tags
- ❌ Use spaces in tag values
- ❌ Skip temporal tags
- ❌ Ignore auto-generated tag suggestions

---

## Migration

### Adding Tags to Existing Content

1. **Manual**: Edit frontmatter directly
2. **Template**: Use updated templates
3. **Script**: Bulk tag generation script

### Example Migration Script Concept

```javascript
// Conceptual: Auto-generate missing tags
const entities = getAllEntities();
entities.forEach(entity => {
  if (!entity.tags) entity.tags = [];
  
  // Add category tag
  if (!entity.tags.some(t => t.startsWith("category:"))) {
    entity.tags.push(`category:${entity.type}`);
  }
  
  // Add quality tag based on rating
  if (entity.rating >= 4.5 && !entity.tags.includes("quality:excellent")) {
    entity.tags.push("quality:excellent");
  }
  
  // Add date tags
  if (entity.date) {
    const month = entity.date.slice(0, 7);
    if (!entity.tags.includes(`month:${month}`)) {
      entity.tags.push(`month:${month}`);
    }
  }
  
  saveEntity(entity);
});
```

---

## Related Documentation

- **Property Schema**: `Configuration/Property-Schema.md` - Complete property reference
- **New Entity Types**: `Documentation/COFFEE-VAULT-5.0-NEW-ENTITY-TYPES.md` - Entity types
- **Enhanced Properties**: `Documentation/ENHANCED-PROPERTIES-5.0.md` - New properties

---

**Version**: 5.0.0  
**Last Updated**: 2025-10-28  
**Status**: Production

