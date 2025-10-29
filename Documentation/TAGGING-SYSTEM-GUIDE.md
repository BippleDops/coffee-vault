---
type: documentation
title: Coffee Vault 5.0 - Tagging System Guide
version: 5.0.0
date: 2025-10-28
tags: [documentation, coffee-vault-5.0, tagging]
---

# Coffee Vault 5.0 - Hierarchical Tagging System Guide

**Purpose**: Complete guide to the multi-dimensional hierarchical tagging system

**Version**: 5.0.0  
**Last Updated**: 2025-10-28

---

## Overview

Coffee Vault 5.0 introduces a **6-level hierarchical tagging system** that enables powerful filtering, discovery, and organization. Tags are automatically inferred from entity properties while allowing manual customization.

---

## Tag Hierarchy Structure

### Level 1: Primary Categories
Identifies the entity type:
- `category:coffee-log`
- `category:bean-profile`
- `category:roaster-profile`
- `category:origin-profile`
- `category:cupping-session`
- `category:recipe-profile`
- `category:equipment-model`
- `category:coffee-event`
- `category:coffee-goal`

### Level 2: Subcategories
Groups by method, origin, roaster, etc.:
- `method:v60`, `method:chemex`, `method:espresso`
- `origin:ethiopia`, `origin:colombia`, `origin:kenya`
- `roaster:onyx`, `roaster:blue-bottle`

### Level 3: Attributes
Describes characteristics:
- `roast:light`, `roast:medium`, `roast:dark`
- `processing:natural`, `processing:washed`, `processing:honey`
- `variety:gesha`, `variety:bourbon`, `variety:caturra`

### Level 4: Quality Markers
Indicates quality/status:
- `quality:excellent`, `quality:good`, `quality:fair`, `quality:poor`
- `dialed-in:true`, `needs-improvement:true`
- `specialty-grade:true`

### Level 5: Personal Markers
Personal preferences and status:
- `personal:favorite`
- `personal:to-rebuy`
- `personal:disappointment`
- `personal:experiment`
- `personal:reference`
- `personal:learning`

### Level 6: Temporal
Time-based organization:
- `month:2025-10`, `month:2025-11`
- `year:2025`
- `season:fall`, `season:winter`, `season:spring`, `season:summer`

---

## Tag Naming Convention

**Format**: `level:value`

- Use lowercase with hyphens
- Colon (`:`) separates level from value
- No spaces (use hyphens)
- Consistent values across vault

**Examples**:
- ✅ `category:coffee-log`
- ✅ `origin:ethiopia-yirgacheffe`
- ✅ `roast:light-medium`
- ❌ `Category:Coffee Log` (uppercase, spaces)
- ❌ `origin ethiopia` (no colon separator)

---

## Smart Tag Inference

Tags are automatically generated from entity properties:

### Coffee Log Tags
```yaml
# Auto-generated from properties
brew-method: v60 → method:v60
origin: Ethiopia → origin:ethiopia
roast-level: light → roast:light
rating: 4.5 → quality:excellent
date: 2025-10-28 → month:2025-10, year:2025, season:fall
is-favorite: true → personal:favorite
is-dialed-in: true → dialed-in:true
```

### Bean Profile Tags
```yaml
# Auto-generated from properties
origin: Colombia → origin:colombia
roaster: Onyx Coffee Lab → roaster:onyx-coffee-lab
roast-level: light → roast:light
processing: natural → processing:natural
variety: Gesha → variety:gesha
score: 88 → quality:excellent, specialty-grade:true
would-rebuy: true → personal:to-rebuy
```

### Recipe Profile Tags
```yaml
# Auto-generated from properties
brew-method: v60 → method:v60
target-origin: Ethiopia → origin:ethiopia
target-roast-level: light → roast:light
success-rate: 85 → quality:excellent
times-used: 15 → personal:favorite
```

---

## Usage Examples

### Manual Tag Addition

Add tags manually in frontmatter:

```yaml
---
type: coffee-log
date: 2025-10-28
tags: [category:coffee-log, method:v60, origin:ethiopia, quality:excellent, personal:favorite]
---
```

### Automatic Tag Inference

Tags are automatically generated when using templates:

```javascript
// In template
<%*
const tags = inferTags(tp.frontmatter);
tp.frontmatter.tags = mergeTags(tp.frontmatter.tags, tags);
%>
```

### Tag-Based Queries

Query by tags:

```dataviewjs
// Find all excellent V60 brews from Ethiopia
const excellent = dv.pages('"Coffee Logs"')
  .where(p =>
    p.type === "coffee-log" &&
    p.tags &&
    p.tags.includes("method:v60") &&
    p.tags.includes("origin:ethiopia") &&
    p.tags.includes("quality:excellent")
  );

dv.table(["Date", "Bean", "Rating"], 
  excellent.map(p => [p.date, p.beans, p.rating])
);
```

---

## Tag Categories Reference

Complete reference of all tag categories:

| Level | Category | Values | Example |
|-------|----------|--------|---------|
| 1 | category | coffee-log, bean-profile, roaster-profile, etc. | `category:coffee-log` |
| 2 | method | v60, chemex, aeropress, espresso, etc. | `method:v60` |
| 2 | origin | ethiopia, colombia, kenya, etc. | `origin:ethiopia` |
| 2 | roaster | roaster names (lowercase) | `roaster:onyx` |
| 3 | roast | light, medium, dark, etc. | `roast:light` |
| 3 | processing | natural, washed, honey, etc. | `processing:natural` |
| 3 | variety | gesha, bourbon, caturra, etc. | `variety:gesha` |
| 4 | quality | excellent, good, fair, poor | `quality:excellent` |
| 4 | status | dialed-in, needs-work, specialty-grade | `dialed-in:true` |
| 5 | personal | favorite, to-rebuy, reference, etc. | `personal:favorite` |
| 6 | temporal | month:YYYY-MM, year:YYYY, season | `month:2025-10` |

---

## Best Practices

### 1. Use Consistent Tag Values
- Always use lowercase
- Use hyphens for multi-word values
- Follow established patterns

### 2. Leverage Auto-Inference
- Let templates generate tags automatically
- Add manual tags only for special cases
- Review and refine tags periodically

### 3. Tag Maintenance
- Remove outdated tags
- Consolidate similar tags
- Use queries to validate tag consistency

### 4. Tag Discovery
- Use tag-based queries for filtering
- Create tag-based views
- Tag browsing for exploration

---

## Query Patterns

### Find by Single Tag
```dataviewjs
dv.pages()
  .where(p => p.tags && p.tags.includes("quality:excellent"))
```

### Find by Multiple Tags (AND)
```dataviewjs
dv.pages()
  .where(p => 
    p.tags && 
    p.tags.includes("method:v60") &&
    p.tags.includes("origin:ethiopia") &&
    p.tags.includes("quality:excellent")
  )
```

### Find by Tag Pattern (OR)
```dataviewjs
dv.pages()
  .where(p => 
    p.tags && 
    (p.tags.some(t => t.startsWith("origin:")) ||
     p.tags.some(t => t.startsWith("roaster:")))
  )
```

### Tag Frequency Analysis
```dataviewjs
const allTags = [];
dv.pages()
  .where(p => p.tags)
  .forEach(p => allTags.push(...p.tags));

const tagCounts = {};
allTags.forEach(tag => {
  tagCounts[tag] = (tagCounts[tag] || 0) + 1;
});

const sorted = Object.entries(tagCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20);

dv.table(["Tag", "Count"], sorted);
```

---

## Migration

### Adding Tags to Existing Entities

1. **Manual**: Add tags section to frontmatter
2. **Script**: Use tag inference script to auto-generate
3. **Template**: New entities get tags automatically

### Tag Cleanup

Use queries to find entities missing tags or with inconsistent tags:

```dataviewjs
// Find entities without category tag
dv.pages()
  .where(p => !p.tags || !p.tags.some(t => t.startsWith("category:")))
```

---

## Related Documentation

- **Property Schema**: `Configuration/Property-Schema.md` - Complete property reference
- **Tag Inference Script**: `Scripts/tag-inference.js` - Auto-tagging implementation
- **Relationship System**: `Documentation/RELATIONSHIP-SYSTEM-GUIDE.md` - Relationship tracking

---

**Version**: 5.0.0  
**Last Updated**: 2025-10-28  
**Status**: Production

