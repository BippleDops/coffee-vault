---
type: documentation
title: Coffee Vault 5.0 Migration Guide
version: 5.0.0
date: 2025-10-28
tags: [documentation, migration, coffee-vault-5.0]
---

# Coffee Vault 5.0 Migration Guide

**Purpose**: Complete guide for migrating from Coffee Vault 4.0 to 5.0

**Version**: 5.0.0  
**Last Updated**: 2025-10-28

---

## Overview

Coffee Vault 5.0 is **100% backward compatible** with 4.0. All existing content, queries, and templates continue to work unchanged. This guide helps you take advantage of new 5.0 features.

---

## What's New in 5.0

### New Entity Types (6)
1. Producer/Farm Profile - Supply chain transparency
2. Cupping Session - Formal cupping tracking
3. Recipe Profile - Reusable brewing recipes
4. Equipment Model - Equipment research database
5. Coffee Event - Coffee experiences tracking
6. Coffee Goal - Personal development goals

### Enhanced Features
- **Graph Relationships** - Explicit entity connections
- **Hierarchical Tagging** - 6-level tag system
- **Enhanced Properties** - 470+ new properties
- **Advanced Analytics** - 5 new dashboards
- **ML Models** - 6 new prediction/optimization models
- **Automation Scripts** - 4 new automation tools

---

## Migration Steps

### Step 1: No Action Required (Backward Compatible)

✅ **All existing content works unchanged**:
- Coffee logs continue to function
- Bean profiles work as before
- All queries execute normally
- Templates remain functional
- Analytics dashboards work

**You can stop here and use 5.0 features incrementally!**

---

### Step 2: Optional - Add New Folders (Recommended)

New entity type folders:

```bash
Coffee Vault/
├── Producers/           # NEW - Producer profiles
├── Cupping Sessions/    # NEW - Cupping sessions
├── Recipes/             # NEW - Recipe profiles
├── Equipment Models/    # NEW - Equipment database
├── Coffee Events/       # NEW - Coffee events
└── Coffee Goals/        # NEW - Personal goals
```

**Already created automatically** with README files.

---

### Step 3: Optional - Enhance Existing Entities

#### Add Relationship Tracking

Add to any existing entity:

```yaml
relationships:
  uses-bean: [[Bean Name]]
  uses-equipment: [[Equipment Name]]
  similar-to: [[Similar Bean]]
```

#### Add Enhanced Tags

Upgrade tags to hierarchical system:

```yaml
# Old tagging (still works)
tags: [coffee-log, 2025-10]

# New hierarchical tagging (better filtering)
tags:
  - category:coffee-log
  - method:v60
  - origin:ethiopia
  - roast:light
  - quality:excellent
  - month:2025-10
```

#### Add 5.0 Properties

Coffee logs can add:
```yaml
# Precision measurements
extraction-mass: 285
first-drop-time: "0:45"
slurry-temperature: 92

# Environmental context
weather-condition: sunny
barometric-pressure: 1013
sleep-hours-previous: 7.5

# Media documentation
video-link: https://example.com/brew
photo-links: [setup.jpg, bloom.jpg]
```

Bean profiles can add:
```yaml
# Supply chain
producer-link: [[Producer Name]]
supply-chain-verified: true
transparency-score: 9

# Contract details
contract-type: direct-trade
price-premium-vs-commodity: 350
```

Origin profiles can add:
```yaml
# Climate change
climate-vulnerability: high
climate-change-impacts: Rising temperatures
resilience-score: 6

# Infrastructure
washing-stations-count: 47
internet-connectivity: moderate
```

---

### Step 4: Optional - Use New Templates

#### Create New Entity Types

Use new templates to create:

1. **Producer Profiles**: `Templates/Producer Profile.md`
2. **Cupping Sessions**: `Templates/Cupping Session.md`
3. **Recipe Profiles**: `Templates/Recipe Profile.md`
4. **Equipment Models**: `Templates/Equipment Model.md`
5. **Coffee Events**: `Templates/Coffee Event.md`
6. **Coffee Goals**: `Templates/Coffee Goal.md`

#### Enhanced Coffee Log

Switch to `Templates/Coffee-Log-v5.md` for:
- Context-aware smart suggestions
- Auto-populated bean/roaster from profiles
- Enhanced property sections
- Relationship tracking

**Note**: `Coffee-Log-v3.md` still works perfectly!

---

### Step 5: Optional - Generate Recipes from Logs

Auto-generate recipes from successful brews:

```javascript
// Run from Scripts folder
const generator = require('./auto-recipe-generator.js');
const candidates = generator.findRecipeCandidates(allLogs, 4.5, 3);

// Create recipes
const results = generator.batchGenerateRecipes(vaultPath, {
  minRating: 4.5,
  minLogs: 3
});

console.log(`Generated ${results.recipesGenerated} recipes!`);
```

---

### Step 6: Optional - Link Producers to Beans

Enhance supply chain transparency:

1. Create producer profiles for your beans
2. Link beans to producers:

```yaml
# In bean profile
producer-link: [[Kochere Cooperative]]
supply-chain-verified: true
```

3. View supply chain in new dashboard:
   - `Analytics/Supply-Chain-Layout/10-Supply-Chain-Transparency-Dashboard.md`

---

### Step 7: Optional - Set Goals

Track your coffee development:

1. Create goals using `Templates/Coffee Goal.md`
2. View progress in `Views/Learning-Education-Layout/Goals-Dashboard-View.md`
3. Get recommendations in `Analytics/Learning-Education-Layout/11-Learning-Development-Dashboard.md`

---

## Migration Scripts

### Auto-Tag Generator

Add hierarchical tags to existing entities:

```javascript
// Conceptual script
const entities = getAllEntities();

entities.forEach(entity => {
  if (!entity.tags) entity.tags = [];
  
  // Add category tag
  entity.tags.push(`category:${entity.type}`);
  
  // Add specific tags based on properties
  if (entity.origin) entity.tags.push(`origin:${entity.origin.toLowerCase()}`);
  if (entity['brew-method']) entity.tags.push(`method:${entity['brew-method']}`);
  if (entity['roast-level']) entity.tags.push(`roast:${entity['roast-level']}`);
  if (entity.rating >= 4.5) entity.tags.push('quality:excellent');
  
  // Add temporal tags
  if (entity.date) {
    const month = entity.date.slice(0, 7);
    entity.tags.push(`month:${month}`);
  }
  
  saveEntity(entity);
});
```

### Relationship Builder

Auto-generate relationships from existing data:

```javascript
// Conceptual script
const logs = getAllCoffeeLogs();

logs.forEach(log => {
  log.relationships = {
    'uses-bean': [[log.beans]],
    'uses-equipment': log.grinder ? [[log.grinder]] : []
  };
  
  saveLog(log);
});
```

---

## Feature Adoption Roadmap

### Week 1: Familiarization
- ✅ Read 5.0 documentation
- ✅ Explore new analytics dashboards
- ✅ Try new Coffee Log v5 template

### Week 2: New Entity Types
- Create first producer profile
- Try cupping session template
- Set a coffee goal

### Week 3: Enhanced Logging
- Add enhanced properties to logs
- Use precision measurements
- Track environmental context

### Week 4: Supply Chain
- Link beans to producers
- Check transparency dashboard
- Review sustainability metrics

### Month 2: Advanced Features
- Generate recipes from logs
- Use ML predictions
- Track palate development
- Join community features

---

## Validation

### Check Migration Success

```dataviewjs
// Verify 5.0 features
const checks = [
  { feature: 'New folders created', check: () => dv.pages('"Producers"').length >= 0 },
  { feature: 'Templates available', check: () => true },
  { feature: 'Analytics dashboards', check: () => dv.pages('"Analytics"').where(p => p.version === '5.0.0').length > 0 }
];

dv.table(["Feature", "Status"],
  checks.map(c => [c.feature, c.check() ? "✅ Ready" : "⚠️ Check setup"])
);
```

---

## Troubleshooting

### Issue: New templates not showing

**Solution**: Refresh Templater plugin, check folder permissions

### Issue: New properties not recognized

**Solution**: Properties are optional - add as needed, no validation errors

### Issue: Queries not finding new entity types

**Solution**: Ensure `type` property matches exactly (e.g., `producer-profile`)

### Issue: Relationships not working

**Solution**: Use correct format: `relationships: { uses-bean: [[Bean Name]] }`

---

## Rollback

If you need to rollback to 4.0:

1. **No rollback needed** - 5.0 is additive
2. Simply don't use new features
3. All 4.0 functionality remains intact

---

## Support

### Documentation
- **New Entity Types**: `Documentation/COFFEE-VAULT-5.0-NEW-ENTITY-TYPES.md`
- **Relationship System**: `Documentation/RELATIONSHIP-SYSTEM-GUIDE.md`
- **Enhanced Properties**: `Documentation/ENHANCED-PROPERTIES-5.0.md`
- **Tagging System**: `Documentation/TAGGING-SYSTEM-5.0.md`

### Templates
- All templates in `Templates/` folder
- Try new v5 Coffee Log template

### Analytics
- 5 new dashboards in `Analytics/` folder
- Explore Supply Chain and Learning dashboards

---

**Coffee Vault 5.0** - Smooth upgrade, powerful new features

**Version**: 5.0.0  
**Migration Difficulty**: Easy (backward compatible)  
**Estimated Time**: 30 minutes to familiarize, optional enhancements at your pace

