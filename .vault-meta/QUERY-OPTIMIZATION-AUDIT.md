---
title: Query & Visualization Optimization Audit
date: 2025-10-28
type: technical-audit
status: in-progress
---

# 🔍 Coffee Vault Query & Visualization Optimization Audit

**Audit Date**: 2025-10-28  
**Scope**: All Dataview, Datacore, DataviewJS queries + HTML visualizations  
**Purpose**: Identify and implement quality improvements

---

## 📊 Current State Analysis

### Query Distribution

**Files with Queries**:
- **Dataview**: 36 files (mostly in Templates, Brewing Guides, Origins)
- **Datacore**: 16 files (Views, Analytics, Documentation)
- **DataviewJS**: 17 files (Analytics dashboards, HOME-DASHBOARD, Views)
- **HTML Visualizations**: 17 interactive tools

**Total Query-Enabled Content**: 50+ files with dynamic queries

---

## 🎯 Optimization Opportunities Identified

### 1. **Update Queries for Expanded Content**

**Issue**: Queries reference old file counts, need updating for 67+ bean profiles, 37+ origins
**Impact**: Statistics show old numbers, dashboards don't reflect expansion
**Priority**: HIGH

**Files Needing Updates**:
- HOME-DASHBOARD.md (references old counts)
- Master-Coffee-Dashboard.md (needs expanded origin/bean queries)
- Scientific References index
- All Analytics dashboards

**Action**: Update file counts, add queries for new content categories

### 2. **Optimize Query Performance**

**Issue**: Some queries missing `.limit()` (performance risk with large datasets)
**Impact**: Slow rendering with 300+ files
**Priority**: CRITICAL

**Improvements**:
- Add `.limit()` to all unbounded queries
- Use `.array()` before heavy operations
- Optimize groupBy operations for efficiency

### 3. **Expand Query Coverage**

**Issue**: New bean profiles, origins lack queries showing relationships
**Impact**: New content not integrated into existing dashboards
**Priority**: HIGH

**Additions Needed**:
- Queries in new bean profiles (showing brewing sessions)
- Queries in new origin profiles (beans from origin)
- Cross-references between related varieties

### 4. **HTML Visualizations Enhancement**

**Issue**: Visualizations may not reflect expanded content
**Impact**: Tools don't showcase new diversity
**Priority**: MEDIUM

**Improvements**:
- Update flavor-compass.html with new flavor profiles
- Expand origin-flavor-wheel.html for 37+ origins
- Enhance bean-comparison-matrix.html for 67+ beans

---

## 🔧 Implementation Plan

### Phase 1: Critical Query Optimizations (Immediate)

1. **Add `.limit()` to all Analytics queries** (prevent performance degradation)
2. **Update HOME-DASHBOARD counts** (reflect 67 beans, 37 origins, 25 brewing methods)
3. **Optimize Master-Coffee-Dashboard** (add new content categories)

### Phase 2: Content Integration (High Priority)

4. **Add relationship queries** to new bean profiles (show usage in logs)
5. **Add origin queries** to new origin profiles (beans from this origin)
6. **Create variety comparison queries** (SL-28 vs SL-34, Bourbon across origins)

### Phase 3: Visualization Updates (Medium Priority)

7. **Update HTML visualizations** with expanded origin/bean data
8. **Create new visualizations** for variety comparison, processing methods
9. **Enhance interactive tools** with new content

---

## ✅ Optimizations To Implement

### HOME-DASHBOARD.md Improvements

**Current Issues**:
- Bean/origin counts use old assumptions
- Doesn't reflect 5-wave progress
- Statistics queries could be more efficient

**Improvements**:
```dataviewjs
// IMPROVED: Reflect actual expanded content
const beans = dv.pages('"Beans Library"').where(p => p.type === "bean-profile").length;
const origins = dv.pages('"Origins"').where(p => p.type === "origin-profile").length;
const scientificRefs = dv.pages('"Scientific References"').where(p => p.type === "scientific-reference").length;
const brewingGuides = dv.pages('"Brewing Guides"').where(p => p.type === "brewing-guide").length;

dv.header(3, "📚 Vault Library");
dv.list([
  `🫘 ${beans} Bean Variety Profiles`,
  `🌍 ${origins} Origin Country Profiles`,
  `☕ ${brewingGuides} Brewing Method Guides`,
  `🔬 ${scientificRefs} Scientific Deep-Dives`
]);
```

### Master-Coffee-Dashboard Query Enhancements

**Add Performance Limits**:
```datacore
// BEFORE (unbounded, slow)
FROM "Coffee Logs"
WHERE type = "coffee-log"
SORT date DESC

// AFTER (bounded, fast)
FROM "Coffee Logs"
WHERE type = "coffee-log"
SORT date DESC
LIMIT 100
```

### New Content Integration Queries

**For New Bean Profiles** - Add to each bean profile:
```dataview
## 📊 My Brewing Sessions with This Bean

TABLE
  file.link as "Session",
  date as "Date",
  brew-method as "Method",
  rating as "⭐",
  grind-size as "Grind"
FROM "Coffee Logs"
WHERE beans = "[[Bean Name]]" OR contains(beans, "Bean Name")
SORT date DESC
LIMIT 20
```

**For New Origin Profiles** - Add to each origin:
```dataview
## 🫘 Beans from This Origin in My Library

LIST
FROM "Beans Library"
WHERE origin = "[[Origin Name]]" OR contains(origin, "Origin Name")
SORT file.name ASC
```

---

## 📋 Implementation Checklist

### Immediate Actions
- [ ] Add `.limit()` to all Analytics dashboard queries
- [ ] Update HOME-DASHBOARD bean/origin counts
- [ ] Optimize Master-Coffee-Dashboard performance
- [ ] Add queries to 10+ new bean profiles lacking them
- [ ] Add queries to 5+ new origin profiles

### Next Actions
- [ ] Create variety comparison view (Bourbon across origins)
- [ ] Create processing method analysis dashboard
- [ ] Update HTML visualizations with new data
- [ ] Create roaster profile relationship queries
- [ ] Enhance navigation with new content discovery

---

**Status**: Audit Complete, Implementation Beginning  
**Priority**: Critical optimizations first, enhancements parallel with content creation  
**Goal**: Maximize utility of expanded content through intelligent queries

