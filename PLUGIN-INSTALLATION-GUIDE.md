# 🔌 Coffee Vault - Manual Plugin Installation Guide

## Overview
Coffee Vault requires several community plugins to function properly. This guide provides step-by-step instructions for manual installation.

## Required Plugins

### 1. Datacore (CRITICAL)
**Purpose**: Powers all analytics, queries, and data visualization
**Why required**: All dashboards and data queries depend on Datacore

**Installation Steps**:
1. Open Obsidian
2. Settings → Community Plugins
3. Turn ON "Community Plugins" if not already enabled
4. Click "Browse"
5. Search: `Datacore`
6. Click "Install" on the `Datacore` plugin by hawkrives
7. Click "Enable"

**Configuration**:
- Settings → Datacore
- ✅ Enable JavaScript Queries: ON
- ✅ Enable Inline Queries: ON
- ✅ Enable Caching: ON (recommended for performance)
- Cache Interval: 2000ms (default)

**Verify Installation**:
Create a test note with this query:
```datacore
table date, beans, rating
from "Coffee Logs"
limit 5
```
Should display a table of coffee logs.

---

### 2. Templater (CRITICAL)
**Purpose**: Enables smart templates with prompts and auto-suggestions
**Why required**: All template-based workflows depend on Templater

**Installation Steps**:
1. Community Plugins → Browse
2. Search: `Templater`
3. Install plugin by `SilentVoid`
4. Enable plugin

**Configuration**:
- Settings → Templater → General Settings:
  - ✅ Enable Templater: ON
  - ✅ Trigger Templater on new file creation: ON
  - Template folder location: `Templates`
  - Syntax: `<% %>`
  - ✅ Automatic jump to cursor: ON

- Settings → Templater → Folder Templates:
  Add folder templates:
  - `Coffee Logs/` → `Templates/Coffee Log.md`
  - `Beans Library/` → `Templates/Bean Profile.md`
  - `Daily Notes/` → `Templates/Daily Note.md`
  - `Roasters/` → `Templates/Roaster Profile.md`

**Verify Installation**:
Create a new note in `Coffee Logs/` - template should auto-apply.

---

### 3. Calendar (RECOMMENDED)
**Purpose**: Visual date navigation for daily notes
**Why recommended**: Makes daily coffee logging easier

**Installation Steps**:
1. Community Plugins → Browse
2. Search: `Calendar`
3. Install plugin by `Liam Cain`
4. Enable plugin

**Configuration**:
- Settings → Calendar:
  - ✅ Show week number: ON
  - Weekly note format: `YYYY-[W]ww`
  - ✅ Confirm before creating: ON

**Verify Installation**:
Calendar icon appears in right sidebar.

---

### 4. Tasks (RECOMMENDED)
**Purpose**: Todo management for brewing experiments and maintenance
**Why recommended**: Track brewing goals and equipment maintenance

**Installation Steps**:
1. Community Plugins → Browse
2. Search: `Tasks`
3. Install plugin by `Martin Schenck and Clare Macrae`
4. Enable plugin

**Configuration**:
- Settings → Tasks:
  - Use filename in daily notes: OFF (for Coffee Vault)
  - Global filter: Leave default

**Verify Installation**:
Open a note with `- [ ] Task` - should render as checkbox.

---

### 5. Periodic Notes (RECOMMENDED)
**Purpose**: Automatic daily/weekly/monthly note creation
**Why recommended**: Streamlines workflow for coffee tracking

**Installation Steps**:
1. Community Plugins → Browse
2. Search: `Periodic Notes`
3. Install plugin by `Liam Cain`
4. Enable plugin

**Configuration**:
- Settings → Periodic Notes:
  - Daily: Template `Templates/Daily Note.md`
  - Weekly: Template `Templates/Weekly Summary.md`
  - Monthly: Template `Templates/Monthly Report.md`

**Verify Installation**:
Create daily note via Calendar - template should apply.

---

## Optional but Useful Plugins

### 6. Advanced Tables
**Purpose**: Excel-like table editing
**Install**: Community Plugins → Browse → `Advanced Tables`

### 7. Kanban
**Purpose**: Manage coffee experiments and projects
**Install**: Community Plugins → Browse → `Kanban`

### 8. Excalidraw
**Purpose**: Draw brewing setup diagrams
**Install**: Community Plugins → Browse → `Excalidraw`

---

## Installation Checklist

- [ ] Enable Community Plugins in Settings
- [ ] Install Datacore
- [ ] Configure Datacore (JavaScript queries ON)
- [ ] Install Templater
- [ ] Configure Templater (folder templates set)
- [ ] Test template auto-apply
- [ ] Install Calendar
- [ ] Install Tasks
- [ ] Install Periodic Notes
- [ ] Configure all plugin settings
- [ ] Test dashboard queries
- [ ] Test template creation

---

## Troubleshooting

**Plugins won't enable?**
- Restart Obsidian after installation
- Check Obsidian version (requires 1.4.0+)

**Templates don't work?**
- Verify Templater is installed and enabled
- Check folder template paths match exactly
- Ensure "Trigger on new file creation" is ON

**Queries don't render?**
- Ensure Datacore is installed
- Check you're in Preview mode (not Source mode)
- Verify "Enable JavaScript Queries" is ON

**Need help?**
- Check [START-HERE.md](START-HERE.md)
- See [Configuration/User-Configuration-Guide.md](Configuration/User-Configuration-Guide.md)
- Review plugin documentation in Obsidian

---

**Installation Time**: ~10 minutes
**Difficulty**: Easy
**System**: All plugins work on desktop and mobile
