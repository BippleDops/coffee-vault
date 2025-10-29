---
type: configuration-guide
title: Workspace & Plugin Configuration Guide
version: 5.0.0
date: 2025-10-28
tags: [configuration, workspace, plugins]
---

# ⚙️ Workspace & Plugin Configuration Guide

**Complete guide to configuring Coffee Vault workspace and plugins**

**Coffee Vault 5.0** - Optimal configuration for maximum productivity

---

## 🎯 Quick Setup (10 Minutes)

### Step 1: Core Plugins

**Required** (Install from Community Plugins):

1. **Datacore** ✅
   - Purpose: Powers all queries and analytics
   - Settings: Enable JavaScript queries, Enable inline queries
   - Refresh interval: 2000ms

2. **Templater** ✅
   - Purpose: Intelligent templates
   - Settings: Template folder: "Templates"
   - Enable: Trigger Templater on new file creation
   - Enable: Automatic jump to cursor

3. **Calendar** ⭐
   - Purpose: Visual date navigation
   - Settings: Show week numbers, Start week on Monday/Sunday
   - Daily notes folder: "Daily Notes"

**Optional but Recommended**:

4. **Tasks**
   - Purpose: Task management in goals and Kanbans
   - Settings: Global filter, completion tracking

5. **Periodic Notes**
   - Purpose: Daily/weekly/monthly notes
   - Settings: Daily folder: "Daily Notes", Use templates

6. **Kanban**
   - Purpose: Workflow boards
   - Settings: Archive with date, Lane width: 300px

---

### Step 2: Workspace Layouts

**Install Pre-Configured Layouts**:

1. **Enable Workspaces** (Core plugin):
   - Settings → Core Plugins → Workspaces: ON

2. **Load Layouts**:
   - Layouts provided in `.obsidian/workspace-layouts/`
   - 4 pre-configured layouts ready to use

3. **Set Hotkeys** (Recommended):
   - Settings → Hotkeys → Workspaces
   - Assign: Cmd/Ctrl+1-4 for quick switching

**Available Layouts**:
- Daily Brewing (Cmd/Ctrl+1)
- Analytics & Analysis (Cmd/Ctrl+2)
- Learning & Education (Cmd/Ctrl+3)
- Supply Chain & Transparency (Cmd/Ctrl+4)

---

### Step 3: CSS Themes

**Enable Coffee Vault Themes**:

1. **Settings** → Appearance → CSS Snippets
2. **Enable**:
   - coffee-vault-theme.css ✅
   - mobile-responsive.css ✅
   - advanced-query-styling.css ✅

3. **Result**: Professional coffee-themed appearance

---

### Step 4: Essential Hotkeys

**Set These Hotkeys** (Settings → Hotkeys):

| Action | Recommended Hotkey | Plugin |
|--------|-------------------|--------|
| Open HOME-DASHBOARD | Cmd/Ctrl+H | Core |
| New Coffee Log | Cmd/Ctrl+N | Templater |
| Quick Switcher | Cmd/Ctrl+O | Core |
| Search All | Cmd/Ctrl+Shift+F | Core |
| Daily Note | Cmd/Ctrl+T | Periodic Notes |
| Visualization Hub | Cmd/Ctrl+Shift+V | Core |

---

## 🔧 Detailed Plugin Configuration

### Datacore Configuration

**Settings → Datacore**:

```json
{
  "enableDatacoreJS": true,
  "enableInlineDatacore": true,
  "enableInlineDatacoreJS": true,
  "refreshInterval": 2000,
  "defaultDateFormat": "YYYY-MM-DD",
  "maxRecursiveDepth": 4,
  "renderNullAs": "—",
  "tableGroupFoldLevel": 1
}
```

**Performance**:
- Refresh interval: 2000ms (balance responsiveness/performance)
- Max depth: 4 (prevent infinite loops)
- Table fold: 1 (keep compact)

---

### Templater Configuration

**Settings → Templater**:

```json
{
  "templatesFolder": "Templates",
  "triggerOnFileCreation": true,
  "enableFolderTemplates": true,
  "syntaxHighlighting": true,
  "enableSystemCommands": false,
  "shellPath": "/bin/bash",
  "userScriptFolder": "Scripts",
  "enableUserScripts": true
}
```

**Folder Templates**:
- Coffee Logs/ → Coffee-Log-v5.md
- Beans Library/ → Bean Profile.md
- Producers/ → Producer Profile.md
- Recipes/ → Recipe Profile.md
- Coffee Goals/ → Coffee Goal.md
- Cupping Sessions/ → Cupping Session.md
- Coffee Events/ → Coffee Event.md

---

### Calendar Configuration

**Settings → Calendar**:

```json
{
  "showWeeklyNote": true,
  "weekStart": "monday",
  "wordsPerDot": 250,
  "dailyNoteFolder": "Daily Notes",
  "dailyNoteFormat": "YYYY-MM-DD",
  "weeklyNoteFolder": "Daily Notes/Weekly",
  "weeklyNoteFormat": "YYYY-[W]WW"
}
```

---

### Tasks Configuration

**Settings → Tasks**:

```json
{
  "globalFilter": "#task",
  "removeGlobalFilter": false,
  "completionDateFormat": "YYYY-MM-DD",
  "prioritySymbols": {
    "highest": "⏫",
    "high": "🔼",
    "medium": "🔽",
    "low": "⏬"
  }
}
```

**Task Locations**:
- Coffee Goals/ (goal tasks)
- Kanban boards (workflow tasks)
- Daily Notes (daily tasks)

---

### Kanban Configuration

**Settings → Kanban**:

```json
{
  "laneWidth": 300,
  "defaultWidth": "100%",
  "archiveWithDate": true,
  "defaultArchiveDate": "YYYY-MM-DD",
  "markdownOnly": true,
  "newCardInsertionMethod": "top"
}
```

**Board Locations**:
- Plugin Configurations/Kanban/ (8 boards)

---

## 🎨 Appearance Configuration

### Theme Settings

**Settings → Appearance**:

**Base Theme**: Adapt to system OR Dark (recommended)

**CSS Snippets** (Enable all):
- ✅ coffee-vault-theme.css
- ✅ mobile-responsive.css
- ✅ advanced-query-styling.css

**Accent Color**: Custom coffee brown or gold

**Font**:
- Text font: System default or Inter
- Monospace: JetBrains Mono or Fira Code (for code blocks)

---

### Custom CSS Classes

**Apply to notes**:

```yaml
---
cssclass: home-dashboard
---
```

**Available Classes**:
- `home-dashboard` - HOME-DASHBOARD styling
- `navigation-map` - Navigation guides
- `visualizations-dashboard` - Visualization index

---

## 📱 Mobile Configuration

### Mobile Settings

**Settings → Mobile**:

**Quick Capture**:
- Template: Quick Coffee Capture.md
- Hotkey: Configure mobile gesture

**Sidebar**:
- Show: File explorer, Search, Starred
- Hide: Graph (performance)

**Sync**:
- Enable Obsidian Sync or Git sync
- Sync across desktop and mobile

---

### Mobile Optimizations

**Mobile-Specific Templates**:
- Templates/Mobile Quick Capture.md
- Minimal fields
- Voice input ready
- Touch-optimized

**Mobile Dashboard**:
- Mobile Optimizations/mobile-dashboard.md
- Simplified queries
- Touch-friendly

---

## 🔗 Plugin Synergy

### Plugin Combinations

**Best Together**:
- Datacore + Templater = Intelligent data-driven templates
- Calendar + Periodic Notes = Automated daily tracking
- Tasks + Kanban = Comprehensive task management
- Workspaces + Hotkeys = Instant layout switching

### Plugin Workflows

**Daily Logging Workflow**:
1. Calendar (select date)
2. Templater (create log)
3. Datacore (auto-populate from history)
4. Tasks (add brewing tasks if needed)

**Analysis Workflow**:
1. Workspaces (switch to Analytics layout)
2. Datacore (run complex queries)
3. Export results (if needed)

---

## 🎯 Recommended Plugin Settings

### Core Plugins (Enable)

✅ File Explorer  
✅ Search  
✅ Quick Switcher  
✅ Graph View  
✅ Backlinks  
✅ Outgoing Links  
✅ Tag Pane  
✅ Page Preview  
✅ Starred  
✅ Templates (if not using Templater)  
✅ Daily Notes  
✅ Command Palette  
✅ Workspaces  

### Core Plugins (Disable if Unused)

❌ Audio Recorder  
❌ Slides  
❌ Format Converter  
❌ Sync (unless using Obsidian Sync)  

---

## 🔍 Search & Navigation Settings

### Core Settings

**Settings → Files & Links**:
- Default location: Root folder
- Link format: Shortest path
- Use [[Wikilinks]]: ON
- Automatically update links: ON
- Detect all file extensions: ON

**Settings → Editor**:
- Spell check: ON
- Strict line breaks: OFF
- Auto pair brackets: ON
- Auto pair Markdown: ON
- Smart indent lists: ON
- Fold heading: ON
- Fold indent: ON

---

## 📊 Performance Optimization

### For 780+ Files

**Recommendations**:

1. **Index Optimization**:
   - Let Datacore fully index on first load (may take 30-60 seconds)
   - Subsequent loads much faster

2. **Query Performance**:
   - All queries use LIMIT clauses ✅
   - Efficient WHERE filters ✅
   - Avoid deeply nested queries

3. **Graph View**:
   - Filter by tags (reduce node count)
   - Hide orphans (cleaner view)
   - Adjust forces for clarity

4. **File Explorer**:
   - Collapse unused folders
   - Use Quick Switcher instead (faster)

---

## 🎨 Workspace Customization

### Create Your Own Layouts

**Process**:
1. Arrange windows perfectly for your workflow
2. Save as workspace (Settings → Workspaces)
3. Name descriptively
4. Assign hotkey
5. Use regularly

**Ideas**:
- Cupping Layout (cupping-focused)
- Recipe Development (recipe creation)
- Bean Research (bean shopping)
- Goal Tracking (development focus)

---

## 📋 Configuration Checklist

**Essential Setup** (Required):
- [x] Install Datacore plugin
- [x] Install Templater plugin
- [x] Configure Templater folder: "Templates"
- [x] Enable CSS snippets (all 3)
- [x] Set template folder triggers

**Recommended Setup** (Better Experience):
- [x] Install Calendar plugin
- [x] Install Tasks plugin
- [x] Install Kanban plugin
- [x] Enable Workspaces plugin
- [x] Set hotkeys for common actions
- [x] Pin essential notes (HOME-DASHBOARD)
- [x] Configure workspace layouts

**Optional Setup** (Power Users):
- [ ] Install Workspace Plus
- [ ] Install Sliding Panes
- [ ] Set up Obsidian Sync
- [ ] Configure advanced hotkeys
- [ ] Create custom CSS
- [ ] Build custom workspace layouts

---

## 🔧 Troubleshooting

### Plugins Not Working

**Datacore**:
- Check: Plugin enabled in settings
- Verify: Queries use correct syntax
- Test: Simple query first
- Refresh: Reload Obsidian

**Templater**:
- Check: Template folder set correctly
- Verify: Trigger on file creation enabled
- Test: Manual template insertion
- Error: Check JavaScript console

**Workspaces**:
- Check: Plugin enabled
- Verify: Saved layouts exist
- Test: Switch manually first
- Hotkeys: Verify hotkey assignments

---

### Performance Issues

**Slow Queries**:
- Add LIMIT clauses
- Simplify WHERE conditions
- Avoid recursive queries

**Slow Loading**:
- Disable unused plugins
- Reduce open panes
- Clear cache (restart Obsidian)
- Check for large files

---

## 🎯 Optimal Configuration Summary

**Result of Following This Guide**:
- ✅ All essential plugins installed and configured
- ✅ 4 pre-configured workspace layouts
- ✅ Hotkeys for instant access
- ✅ CSS themes for professional appearance
- ✅ Optimized performance for 780+ files
- ✅ Mobile-ready configuration
- ✅ Production-ready Coffee Vault

**Time to Configure**: 10-15 minutes  
**Benefit**: Professional, optimized coffee intelligence platform

---

**Coffee Vault 5.0** - Professionally configured and ready to use

**Configuration Version**: 5.0.0  
**Last Updated**: 2025-10-28  
**Status**: Production Ready

