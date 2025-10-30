---
type: graph-view
title: Entity Relationship Graph
category: relationships
version: 5.0.0
tags: [graph, relationships, visualization]
---

# 🕸️ Entity Relationship Graph

**Visualize connections between all Coffee Vault entities**

**Coffee Vault 5.0** - Graph-based data exploration

---

## 📊 Relationship Overview

```dataviewjs
// Count total relationships across vault
const entities = dv.pages()
  .where(p => p.relationships)
  .array();

const totalEntities = entities.length;
const totalRelationships = entities.reduce((sum, e) => {
  const rels = e.relationships || {};
  return sum + Object.values(rels).flat().filter(Boolean).length;
}, 0);

dv.paragraph(`
**Entities with Relationships**: ${totalEntities}  
**Total Relationship Links**: ${totalRelationships}  
**Average Connections per Entity**: ${totalEntities > 0 ? (totalRelationships / totalEntities).toFixed(1) : 0}
`);
```

---

## 🔗 Most Connected Entities

```dataviewjs
const entities = dv.pages()
  .where(p => p.relationships)
  .map(p => {
    const rels = p.relationships || {};
    const connectionCount = Object.values(rels).flat().filter(Boolean).length;
    const relationshipTypes = Object.keys(rels).length;
    
    return {
      entity: p.file.link,
      type: p.type,
      connections: connectionCount,
      relationshipTypes: relationshipTypes
    };
  })
  .sort(p => p.connections, 'desc')
  .slice(0, 15);

dv.table(["Entity", "Type", "Total Connections", "Relationship Types"],
  entities.map(e => [e.entity, e.type, e.connections, e.relationshipTypes])
);
```

---

## 🫘 Bean Relationship Network

```dataviewjs
// Show all beans and what they're connected to
const beans = dv.pages('"Beans Library"')
  .where(p => p.type === "bean-profile")
  .array();

const beanConnections = beans.map(bean => {
  // Count logs using this bean
  const logs = dv.pages('"Coffee Logs"')
    .where(log => log.type === "coffee-log" && log.beans === bean.name)
    .length;
  
  // Find recipes using this bean
  const recipes = dv.pages('"Recipes"')
    .where(r => 
      r.type === "recipe-profile" &&
      r.relationships &&
      r.relationships["uses-bean"] &&
      r.relationships["uses-bean"].some(b => b.path === bean.file.path)
    )
    .length;
  
  return {
    bean: bean.file.link,
    origin: bean.origin,
    producer: bean["producer-link"] || "Unknown",
    usedInLogs: logs,
    usedInRecipes: recipes,
    totalConnections: logs + recipes + (bean["producer-link"] ? 1 : 0)
  };
}).sort((a, b) => b.totalConnections - a.totalConnections)
  .slice(0, 20);

dv.table(["Bean", "Origin", "Producer", "Logs", "Recipes", "Total Connections"],
  beanConnections.map(b => [b.bean, b.origin, b.producer, b.usedInLogs, b.usedInRecipes, b.totalConnections])
);
```

---

## 🌱 Producer → Bean → Log Chain

```dataviewjs
// Show complete supply chain relationships
const producers = dv.pages('"Producers"')
  .where(p => p.type === "producer-profile")
  .array();

producers.forEach(producer => {
  dv.header(3, `${producer.name} Supply Chain`);
  
  // Find beans from this producer
  const beans = dv.pages('"Beans Library"')
    .where(b => 
      b.type === "bean-profile" &&
      (b["producer-link"] === producer.name || b.producer === producer.name)
    )
    .array();
  
  if (beans.length > 0) {
    beans.forEach(bean => {
      const logCount = dv.pages('"Coffee Logs"')
        .where(log => log.type === "coffee-log" && log.beans === bean.name)
        .length;
      
      dv.paragraph(`
**Bean**: ${bean.file.link}  
→ **Brews**: ${logCount} sessions  
→ **Rating**: ${bean.avgRating || "Not yet rated"}⭐
      `);
    });
  } else {
    dv.paragraph("*No beans linked yet - add `producer-link` to bean profiles*");
  }
});
```

---

## 🎯 Goal → Progress → Achievement Network

```dataviewjs
const goals = dv.pages('"Coffee Goals"')
  .where(p => p.type === "coffee-goal")
  .array();

dv.header(3, `${goals.length} Goals Tracked`);

goals.forEach(goal => {
  const status = goal.status || "unknown";
  const progress = goal["progress-percentage"] || 0;
  const icon = status === "completed" ? "✅" :
               status === "in-progress" ? "🏃" :
               status === "planned" ? "📋" : "⏸️";
  
  dv.paragraph(`
${icon} **${goal.file.link}**  
→ Status: ${status} | Progress: ${progress}%  
→ Related logs: ${goal["related-logs"] ? goal["related-logs"].length : 0}
  `);
});
```

---

## 🔀 Similar Beans (Semantic Relationships)

```dataviewjs
// Find beans marked as similar to each other
const beans = dv.pages('"Beans Library"')
  .where(p => 
    p.type === "bean-profile" &&
    p.relationships &&
    p.relationships["similar-to"]
  )
  .array();

if (beans.length > 0) {
  dv.header(3, "Similar Bean Clusters");
  
  beans.forEach(bean => {
    const similar = bean.relationships["similar-to"] || [];
    if (similar.length > 0) {
      dv.paragraph(`
**${bean.name}** is similar to:  
${similar.map(s => `→ ${s}`).join('  \n')}
      `);
    }
  });
} else {
  dv.paragraph("*No similarity relationships defined yet. Add `relationships: { similar-to: [[Bean Name]] }` to bean profiles.*");
}
```

---

## 🔍 Recipe Derivation Tree

```dataviewjs
// Show recipes and what logs they were derived from
const recipes = dv.pages('"Recipes"')
  .where(p => p.type === "recipe-profile")
  .array();

dv.header(3, `${recipes.length} Recipes Created`);

recipes.forEach(recipe => {
  const derivedFrom = recipe["derived-from-log"];
  const usedCount = recipe["times-used"] || 0;
  const successRate = recipe["success-rate"] || 0;
  
  dv.paragraph(`
📖 **${recipe.file.link}**  
→ Derived from: ${derivedFrom || "Manual creation"}  
→ Used: ${usedCount} times  
→ Success rate: ${successRate}%  
→ Avg rating: ${recipe["avg-rating"] || "N/A"}⭐
  `);
});

if (recipes.length === 0) {
  dv.paragraph("*No recipes yet. Create with `Templates/Recipe Profile.md` or auto-generate from successful brews.*");
}
```

---

## 🎨 Graph View Configuration

### Recommended Filters for Obsidian Graph View

**In Obsidian Graph View Settings**:

**Groups** (Color by entity type):
- Coffee Logs: `tag:#coffee-log` - Blue
- Beans: `tag:#bean-profile` - Green
- Producers: `tag:#producer-profile` - Orange
- Recipes: `tag:#recipe-profile` - Purple
- Goals: `tag:#coffee-goal` - Yellow
- Origins: `tag:#origin-profile` - Red

**Filters**:
- Show only high-rated: `tag:#quality:excellent`
- Show only recent: `tag:#month:2025-10`
- Show specific origin: `tag:#origin:ethiopia`
- Show method: `tag:#method:v60`

**Display**:
- Node size: By links (more connections = larger)
- Arrows: Show direction of relationships
- Labels: Show on hover or always
- Orphans: Hide nodes with no connections

---

## 💡 Relationship Query Patterns

### Find All Uses of a Bean

```dataviewjs
const currentBean = dv.current(); // Get current note
const beanName = currentBean.name || currentBean.file.name;

const logs = dv.pages('"Coffee Logs"')
  .where(log => log.type === "coffee-log" && log.beans === beanName);

dv.header(4, `${logs.length} logs using this bean`);
dv.table(["Date", "Method", "Rating"],
  logs.map(log => [log.date, log["brew-method"], log.rating])
);
```

### Find Path Between Entities

```dataviewjs
// Find connection path from Producer → Bean → Log
function findPath(startEntity, targetEntity, maxDepth = 3) {
  // Breadth-first search through relationships
  const queue = [[startEntity]];
  const visited = new Set();
  
  while (queue.length > 0 && queue[0].length <= maxDepth) {
    const path = queue.shift();
    const current = path[path.length - 1];
    
    if (current.file?.path === targetEntity.file?.path) {
      return path;
    }
    
    visited.add(current.file?.path);
    
    const rels = current.relationships || {};
    Object.values(rels).flat().filter(Boolean).forEach(link => {
      const next = dv.page(link.path);
      if (next && !visited.has(next.file.path)) {
        queue.push([...path, next]);
      }
    });
  }
  
  return null; // No path found
}

// Example usage (commented out):
// const producer = dv.page("Producers/Kochere-Cooperative");
// const log = dv.page("Coffee Logs/2025-10-28-Ethiopia-Guji");
// const path = findPath(producer, log);
```

---

## 🌐 Network Statistics

```dataviewjs
// Calculate network metrics
const allPages = dv.pages().where(p => p.relationships).array();

// Calculate degree distribution
const degrees = allPages.map(p => {
  const rels = p.relationships || {};
  return Object.values(rels).flat().filter(Boolean).length;
});

const avgDegree = degrees.reduce((sum, d) => sum + d, 0) / degrees.length;
const maxDegree = Math.max(...degrees);
const minDegree = Math.min(...degrees);

dv.paragraph(`
**Network Statistics**:  
- Average connections: ${avgDegree.toFixed(1)}  
- Most connected: ${maxDegree} links  
- Least connected: ${minDegree} links  
- Network density: ${totalEntities > 1 ? ((totalRelationships / (totalEntities * (totalEntities - 1))) * 100).toFixed(2) : 0}%
`);
```

---

## 🎯 Using This View

**Graph View**: Use Obsidian's built-in graph to visualize relationships  
**Queries**: Use DataviewJS queries above to explore connections  
**Filters**: Apply filters to focus on specific relationship types  
**Analysis**: Track how entities connect and influence each other

**Coffee Vault 5.0** - Your data is a living, connected graph

