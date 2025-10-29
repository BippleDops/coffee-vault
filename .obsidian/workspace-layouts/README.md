---
type: configuration-guide
title: Workspace Layouts Guide
version: 5.0.0
tags: [workspace, layouts, configuration]
---

# 🖥️ Workspace Layouts Guide

**Pre-configured workspace layouts for different Coffee Vault workflows**

**Coffee Vault 5.0** - Optimal layouts for every task

---

## 📋 Available Layouts

### 1. Daily Brewing Layout

**File**: `daily-brewing-layout.json`  
**Purpose**: Daily coffee logging and brewing workflow  
**Ideal For**: Morning coffee routine, consistent logging, immediate feedback

**Layout**:
- **Left**: HOME-DASHBOARD (quick stats)
- **Center Top**: Coffee Log template (for logging)
- **Center Bottom**: Real-Time Brewing Assistant
- **Right**: Calendar + Backlinks

**When to Use**: Every morning when logging your daily coffee

---

### 2. Analytics & Analysis Layout

**File**: `analytics-layout.json`  
**Purpose**: Deep data analysis and insights exploration  
**Ideal For**: Weekly review, monthly analysis, pattern discovery

**Layout**:
- **Left Tabs**: Multiple analytics dashboards (1, 2, 10, 11)
- **Right**: Advanced Analytics Base (complex queries)
- **Sidebar**: Graph view + Outline

**When to Use**: Sunday weekly review, end-of-month analysis

---

### 3. Learning & Education Layout

**File**: `learning-layout.json`  
**Purpose**: Reading scientific references and learning coffee science  
**Ideal For**: Weekend learning, deep dives, goal tracking

**Layout**:
- **Left**: File explorer (browse references)
- **Center Top**: Scientific Content Index
- **Center Main**: Current reference reading
- **Right Top**: Learning Development Dashboard
- **Right Bottom**: Current goal tracking

**When to Use**: Study sessions, educational deep dives

---

### 4. Supply Chain & Transparency Layout

**File**: `supply-chain-layout.json`  
**Purpose**: Supply chain research and ethical sourcing  
**Ideal For**: Producer research, transparency tracking, certification verification

**Layout**:
- **Left Tabs**: Supply Chain Dashboard + Visualization Base
- **Center Top**: Example producer profile
- **Center Bottom**: Producer Profile template
- **Right**: Supply Chain Transparency Kanban + Backlinks

**When to Use**: Researching beans, building producer profiles

---

## 🔧 How to Use Layouts

### Method 1: Manual Setup (Obsidian)

1. **Open Obsidian**
2. **Arrange windows** as shown in layout description
3. **Save layout**: Settings → Workspaces → Manage workspaces → Save current layout
4. **Name it**: e.g., "Daily Brewing"
5. **Load later**: Workspaces menu → Select saved layout

### Method 2: Import JSON (Advanced)

1. **Copy layout JSON** from files above
2. **Obsidian settings** → Workspaces
3. **Import** workspace configuration
4. **Name and save**

**Note**: Exact method depends on Obsidian version and Workspaces plugin

---

## 🎯 Recommended Workflow

### Daily

**Use**: Daily Brewing Layout  
**Switch to**: Analytics Layout (weekly)

### Weekly

**Use**: Analytics & Analysis Layout  
**Switch to**: Learning Layout (if studying)

### As Needed

**Supply Chain Research**: Supply Chain Layout  
**Learning**: Learning & Education Layout

---

## 💡 Layout Best Practices

### Window Organization

**3-Column Pattern**:
- **Left** (25%): Navigation, file tree, or dashboard
- **Center** (50%): Main content, active editing
- **Right** (25%): Reference, analytics, or tools

**2-Column Pattern**:
- **Main** (70%): Primary content
- **Sidebar** (30%): Supporting info, tools

### Tab Groups

**Group Related**:
- All analytics dashboards in one tab group
- Scientific references together
- Templates grouped

**Benefits**:
- Reduce clutter
- Quick switching
- Focused work

### Pinned Notes

**Pin These**:
- HOME-DASHBOARD (always visible)
- Current coffee log template
- Active analytics dashboard
- Current learning goal

**Don't Overpin**: Limit to 3-5 essential notes

---

## ⚙️ Workspace Plugin Settings

### Recommended Settings

**Obsidian Core**:
- Enable: Workspaces plugin
- Hotkeys: Assign keys to layouts
  - `Cmd/Ctrl+1`: Daily Brewing
  - `Cmd/Ctrl+2`: Analytics
  - `Cmd/Ctrl+3`: Learning
  - `Cmd/Ctrl+4`: Supply Chain

**Community Plugins**:
- Workspace Plus (if available): Enhanced workspace management
- Sliding Panes: Side-by-side pane viewing
- Pane Relief: Better pane management

---

## 🎨 Visual Workspace Enhancements

### Custom CSS for Workspaces

Add to `.obsidian/snippets/workspace-enhancements.css`:

```css
/* Workspace-specific styling */
.workspace-leaf[data-type="markdown"] {
  /* Style markdown panes */
}

.workspace-split.mod-vertical {
  /* Vertical split styling */
}

/* Dashboard-specific */
.markdown-preview-view:has(h1:contains("Dashboard")) {
  /* Dashboard styling */
}
```

---

## 📊 Layout Recommendations by Experience

### Beginner (0-10 logs)

**Use**: Daily Brewing Layout only  
**Focus**: Consistent logging  
**Avoid**: Complex multi-pane layouts

### Intermediate (10-50 logs)

**Use**: Daily Brewing + Analytics Layout  
**Rotate**: Weekly between layouts  
**Explore**: Learning Layout for education

### Advanced (50-100 logs)

**Use**: All 4 layouts as needed  
**Customize**: Create your own variations  
**Optimize**: Personal workflow layouts

### Master (100+ logs)

**Use**: Custom layouts  
**Share**: Contribute layouts to community  
**Teach**: Help others with workspace optimization

---

## 🔄 Switching Layouts Efficiently

### Quick Switch

**Workspaces Plugin**:
1. Click workspace icon (sidebar)
2. Select desired layout
3. Instant switch

**Hotkeys** (if configured):
- One-key press switches entire workspace
- No manual rearrangement needed

### Context-Based Switching

**Brewing**: Daily Brewing Layout  
**Reviewing**: Analytics Layout  
**Learning**: Education Layout  
**Researching**: Supply Chain Layout

**Smart**: Switch based on task, not time of day

---

## 💾 Backup & Sync

**Workspace Files**:
- Stored in `.obsidian/workspaces.json`
- Include in backups
- Sync across devices (Obsidian Sync)

**Layout Files**:
- Custom layouts in `workspace-layouts/`
- Version controlled in Git
- Shareable with others

---

## 🎯 Creating Custom Layouts

### Steps

1. **Arrange windows** as desired
2. **Open settings** → Workspaces
3. **Manage workspaces**
4. **Save current layout**
5. **Name descriptively**
6. **Export JSON** (optional, for sharing)

### Layout Design Tips

**Principles**:
- Primary content: Largest pane (50%+)
- Reference material: Sidebar (25-30%)
- Navigation: Left sidebar or tabs
- Tools: Right sidebar

**Avoid**:
- Too many panes (>4 splits = cluttered)
- Too small panes (<200px unusable)
- Deeply nested tabs (confusing)

---

## 📚 Related Documentation

- **Obsidian Workspaces**: Official Obsidian documentation
- **Navigation System**: `NAVIGATION-SYSTEM.md`
- **Quick Reference**: `COFFEE-VAULT-QUICK-REFERENCE.md`
- **Configuration Guide**: `Configuration/User-Configuration-Guide.md`

---

**Coffee Vault 5.0** - Optimized workspace layouts for every workflow

**4 Pre-Configured Layouts** + **Customization Guide**  
**Switch instantly** | **Hotkey support** | **Professional organization**

