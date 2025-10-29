---
type: documentation
title: Coffee Vault 5.0 - Relationship System Guide
version: 5.0.0
date: 2025-10-28
tags: [documentation, coffee-vault-5.0, relationships, graph]
---

# Coffee Vault 5.0 - Relationship System Guide

**Purpose**: Complete guide to the graph-based relationship tracking system in Coffee Vault 5.0

**Version**: 5.0.0  
**Last Updated**: 2025-10-28

---

## Overview

Coffee Vault 5.0 introduces a comprehensive **graph relationship tracking system** that enables explicit bidirectional connections between all entities. This system supports powerful graph queries, relationship visualization, and semantic connections between coffee-related entities.

---

## Core Concepts

### Relationship Structure

Relationships are stored in a `relationships` object in YAML frontmatter:

```yaml
relationships:
  uses-bean: [[Bean Profile Name]]
  uses-equipment: [[Equipment Profile Name]]
  similar-to: [[Similar Bean Profile]]
  pairs-well-with: [[Brewing Method]]
```

### Relationship Types

The system supports 10+ standardized relationship types:

1. **Usage Relationships**: `uses-bean`, `uses-equipment`, `uses-recipe`, `uses-method`
2. **Entity Relationships**: `visited-roaster`, `related-to-origin`, `part-of-session`, `part-of-event`
3. **Hierarchical**: `parent-entity`, `child-entities`
4. **Semantic**: `similar-to`, `influences`, `pairs-well-with`, `requires`, `enables`, `derived-from`, `preferred-with`, `contraindicated-with`

---

## Relationship Types Reference

### Usage Relationships

| Type | Direction | Example |
|------|-----------|---------|
| `uses-bean` | Coffee Log → Bean Profile | A coffee log uses an Ethiopian Yirgacheffe bean |
| `uses-equipment` | Coffee Log → Equipment Profile | A brew uses a Comandante grinder |
| `uses-recipe` | Coffee Log → Recipe Profile | A brew follows the "V60 Light Roast Recipe" |
| `uses-method` | Coffee Log → Brewing Guide | A brew uses the V60 method |

### Entity Relationships

| Type | Direction | Example |
|------|-----------|---------|
| `visited-roaster` | Coffee Event → Roaster Profile | Visit to Onyx Coffee Lab |
| `related-to-origin` | Bean Profile → Origin Profile | Ethiopian bean → Ethiopia origin |
| `part-of-session` | Bean Profile → Cupping Session | Bean evaluated in cupping session |
| `part-of-event` | Coffee Log → Coffee Event | Brew during cafe visit |

### Hierarchical Relationships

| Type | Direction | Example |
|------|-----------|---------|
| `parent-entity` | Child → Parent | Subregion → Region |
| `child-entities` | Parent → Children | Region → Subregions |

### Semantic Relationships

| Type | Direction | Example |
|------|-----------|---------|
| `similar-to` | Bidirectional | Two beans with similar flavor profiles |
| `influences` | Bidirectional | Bean processing → Flavor profile |
| `pairs-well-with` | Bidirectional | Bean → Optimal brewing method |
| `requires` | Outgoing | Recipe → Required equipment |
| `enables` | Outgoing | Equipment → Enables brewing method |
| `derived-from` | Outgoing | Recipe → Coffee Log (successful brew) |
| `preferred-with` | Bidirectional | Bean works best with specific method |
| `contraindicated-with` | Bidirectional | Bean doesn't work well with method |

---

## Usage Examples

### Adding Relationships Manually

```yaml
---
type: coffee-log
date: 2025-10-28
beans: Ethiopian Yirgacheffe
relationships:
  uses-bean: [[Ethiopian Yirgacheffe]]
  uses-equipment: [[Comandante C40]]
  uses-recipe: [[V60 Light Roast Recipe]]
  derived-from: [[Previous Successful Brew]]
---
```

### Querying Relationships

#### Find All Beans Used

```dataviewjs
const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.relationships)
  .flatMap(p => {
    const beans = p.relationships["uses-bean"] || [];
    return beans.map(bean => ({
      log: p.file.link,
      date: p.date,
      bean: bean
    }));
  });

dv.table(["Log", "Date", "Bean"], logs);
```

#### Find Similar Beans

```dataviewjs
const currentBean = dv.current();
const similarBeans = dv.pages('"Beans Library"')
  .where(p => 
    p.type === "bean-profile" && 
    p.relationships && 
    p.relationships["similar-to"] &&
    p.relationships["similar-to"].some(bean => 
      bean.path === currentBean.file.path
    )
  );

dv.list(similarBeans.map(p => p.file.link));
```

#### Find Recipe Usage

```dataviewjs
const recipe = dv.current();
const uses = dv.pages('"Coffee Logs"')
  .where(p => 
    p.type === "coffee-log" &&
    p.relationships &&
    p.relationships["uses-recipe"] &&
    p.relationships["uses-recipe"].some(r => r.path === recipe.file.path)
  );

dv.paragraph(`**Recipe used in ${uses.length} brews**`);
dv.table(["Date", "Bean", "Rating"], 
  uses.map(p => [p.date, p.beans, p.rating])
);
```

#### Relationship Graph Traversal

```dataviewjs
// Find all entities connected to a bean
const bean = dv.current();
const connections = [];

// Find logs using this bean
const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.beans === bean.name);
connections.push(...logs.map(p => ({ type: "coffee-log", entity: p.file.link })));

// Find recipes derived from logs
const recipes = dv.pages('"Recipes"')
  .where(p => 
    p.type === "recipe-profile" &&
    p.relationships &&
    p.relationships["derived-from"] &&
    p.relationships["derived-from"].some(log => 
      logs.some(l => l.file.path === log.path)
    )
  );
connections.push(...recipes.map(p => ({ type: "recipe-profile", entity: p.file.link })));

dv.table(["Type", "Entity"], connections);
```

---

## Advanced Patterns

### Bidirectional Relationship Management

For bidirectional relationships like `similar-to`, maintain both directions:

```yaml
# Bean A
relationships:
  similar-to: [[Bean B]]

# Bean B  
relationships:
  similar-to: [[Bean A]]
```

### Relationship Aggregation

Find entities with most connections:

```dataviewjs
const entityConnections = dv.pages()
  .where(p => p.relationships)
  .map(p => {
    const rels = p.relationships || {};
    const totalConnections = Object.values(rels)
      .flat()
      .filter(Boolean)
      .length;
    
    return {
      entity: p.file.name,
      type: p.type,
      connections: totalConnections,
      relationshipTypes: Object.keys(rels).length
    };
  })
  .sort(p => p.connections, 'desc')
  .limit(10);

dv.table(["Entity", "Type", "Connections", "Relationship Types"], entityConnections);
```

### Relationship Path Finding

Find connection paths between entities:

```dataviewjs
function findPath(start, target, visited = new Set(), path = []) {
  if (start.file.path === target.file.path) {
    return path;
  }
  
  visited.add(start.file.path);
  const rels = start.relationships || {};
  
  for (const [relType, links] of Object.entries(rels)) {
    for (const link of links || []) {
      const next = dv.page(link.path);
      if (next && !visited.has(next.file.path)) {
        const result = findPath(next, target, visited, [...path, relType]);
        if (result) return result;
      }
    }
  }
  
  return null;
}

// Example usage
const beanA = dv.page("Beans Library/Ethiopian Yirgacheffe");
const beanB = dv.page("Beans Library/Kenya AA");
const path = findPath(beanA, beanB);
dv.paragraph(`Path: ${path ? path.join(" → ") : "No path found"}`);
```

---

## Best Practices

### 1. Consistent Naming

- Use wiki-style links: `[[Entity Name]]`
- Use full paths if ambiguous: `[[Beans Library/Ethiopian Yirgacheffe]]`
- Keep relationship names lowercase-with-hyphens

### 2. Bidirectional Relationships

For semantic relationships (`similar-to`, `pairs-well-with`), add both directions:

```yaml
# Bean A
relationships:
  pairs-well-with: [[V60 Method]]

# V60 Method  
relationships:
  pairs-well-with: [[Bean A]]
```

### 3. Relationship Maintenance

- Update relationships when entities change
- Remove broken/outdated relationships
- Use queries to validate relationship integrity

### 4. Performance

- Limit relationship depth in queries (avoid infinite loops)
- Cache relationship lookups for frequently accessed entities
- Use indexes for common relationship queries

---

## Migration Guide

### Adding Relationships to Existing Entities

1. **Manual Addition**: Add `relationships` section to frontmatter
2. **Script-Based**: Use migration script to auto-generate relationships
3. **Incremental**: Add relationships as you work with entities

### Example Migration Script Concept

```javascript
// Conceptual: Auto-generate uses-bean relationships
const logs = getAllCoffeeLogs();
logs.forEach(log => {
  if (log.beans && !log.relationships) {
    log.relationships = {
      "uses-bean": [[log.beans]]
    };
    saveLog(log);
  }
});
```

---

## Relationship Visualization

### Graph View Ideas

1. **Entity Network Graph**: Visualize all entity connections
2. **Bean Journey Map**: Track bean from producer → roaster → brew
3. **Recipe Evolution**: Show recipe derivation from logs
4. **Supply Chain Map**: Producer → Roaster → Bean → Brew

### Tools

- Obsidian Graph View (enhanced with relationship properties)
- Custom HTML visualizations using relationship data
- External graph visualization tools (export relationship data)

---

## Troubleshooting

### Common Issues

**Issue**: Relationships not showing in queries
- **Solution**: Ensure relationships property exists and is properly formatted as YAML list

**Issue**: Circular references
- **Solution**: Use bidirectional relationships carefully, validate with queries

**Issue**: Broken links
- **Solution**: Use relationship validation queries to find and fix broken links

---

## Related Documentation

- **Property Schema**: `Configuration/Property-Schema.md` - Complete property reference
- **New Entity Types**: `Documentation/COFFEE-VAULT-5.0-NEW-ENTITY-TYPES.md` - Entity type guide
- **Query Examples**: `Configuration/Bases-Definitions.md` - Datacore query examples

---

**Version**: 5.0.0  
**Last Updated**: 2025-10-28  
**Status**: Production

