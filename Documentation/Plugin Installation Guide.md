---
type: guide
tags: [setup, plugins, configuration, getting-started]
---

# 🔌 Plugin Installation & Configuration Guide

**Complete setup guide for your Coffee Tracking Vault**

This guide walks you through installing and configuring essential plugins to unlock the full power of your coffee tracking system.

---

## 📋 Quick Start Checklist

- [ ] Enable Community Plugins
- [ ] Install Templater
- [ ] Configure Templater folder templates
- [ ] Install Dataview
- [ ] Install Tracker
- [ ] Install Advanced Tables (optional)
- [ ] Test templates and queries

**Estimated Setup Time**: 15-20 minutes

---

## ⚙️ Core Plugins (Already Enabled)

These are built into Obsidian and should already be enabled:

### Properties
✅ **Status**: Enabled by default in Obsidian v1.4+  
**Purpose**: Manage metadata (YAML frontmatter) with visual interface  
**Location**: Settings → Core Plugins → Properties

**No configuration needed** - Already set up in `.obsidian/types.json`

### Daily Notes
✅ **Status**: Configured  
**Purpose**: Create date-based journal entries  
**Settings**:
- Folder: `Daily Notes/`
- Date format: `YYYY-MM-DD`
- Template: `Templates/Daily Note.md`

**To use**: Cmd/Ctrl + D or click calendar icon

### Templates
✅ **Status**: Configured  
**Purpose**: Basic template insertion  
**Settings**:
- Template folder: `Templates/`
- Date format: `YYYY-MM-DD`
- Time format: `HH:mm`

**To use**: Cmd/Ctrl + P → "Templates: Insert template"

---

##1️⃣ Enable Community Plugins

**REQUIRED FIRST STEP**

### Steps:

1. **Open Settings**
   - Click gear icon (⚙️) in left sidebar
   - Or: Cmd/Ctrl + ,

2. **Navigate to Community Plugins**
   - Settings → Community Plugins

3. **Turn Off Restricted Mode**
   - Click "Turn on community plugins"
   - Read and accept warning

4. **Click "Browse"**
   - Opens community plugin browser

You're now ready to install plugins!

---

## 2️⃣ Install Templater (ESSENTIAL)

**Priority**: 🔴 Critical - Required for vault functionality

Templater is an advanced templating plugin that adds dynamic capabilities like prompts, date calculations, and JavaScript execution.

### Installation

1. Settings → Community Plugins → Browse
2. Search: "Templater"
3. Click "Install"
4. Click "Enable"

### Configuration

#### Basic Settings

**Settings → Templater → General Settings**:

- ✅ **Enable Templater**: ON
- ✅ **Trigger Templater on new file creation**: ON
- **Template folder location**: `Templates`
- **Syntax**: `<% %>`
- ✅ **Automatic jump to cursor**: ON (recommended)

#### Folder Templates (IMPORTANT)

**Settings → Templater → Folder Templates**:

Click "Add New" for each folder:

| Folder Path | Template Path |
|-------------|---------------|
| `Coffee Logs/` | `Templates/Coffee Log.md` |
| `Beans Library/` | `Templates/Bean Profile.md` |
| `Daily Notes/` | `Templates/Daily Note.md` |
| `Roasters/` | `Templates/Roaster Profile.md` |
| `Brewing Guides/` | `Templates/Brewing Guide.md` |

**What this does**: Automatically applies the correct template when you create a new note in each folder!

#### User Scripts (Optional - Advanced)

**Settings → Templater → User Script Functions**:

- **Script files folder location**: Leave empty for now
- Use this later for custom JavaScript functions

### Testing Templater

1. Create new note in `Coffee Logs/` folder
2. Template should auto-apply
3. Prompts should appear asking for coffee details
4. Fill in prompts - note is generated!

**Troubleshooting**:
- If prompts don't appear: Check "Trigger on new file creation" is ON
- If template doesn't apply: Verify folder template paths are correct
- If syntax errors: Ensure templates use `<% %>` tags

---

## 3️⃣ Install Dataview

**Priority**: 🟡 Highly Recommended - Powers queries and analytics

Dataview turns your vault into a database, allowing powerful queries to analyze your coffee data.

### Installation

1. Settings → Community Plugins → Browse
2. Search: "Dataview"
3. Click "Install"
4. Click "Enable"

### Configuration

**Settings → Dataview**:

- ✅ **Enable JavaScript Queries**: ON (required for DataviewJS)
- ✅ **Enable Inline Queries**: ON
- ✅ **Enable Inline Field Highlighting**: ON (optional, helps see fields)
- **Refresh Interval**: 2000ms (default is fine)

### Testing Dataview

1. Open `Views/Coffee Dashboard.md`
2. Queries should render as tables
3. If you see code blocks instead of tables: Check Dataview is enabled
4. Add a coffee log and dashboard should update

### Common Dataview Queries

**All coffee logs with rating ≥ 4**:
```dataview
TABLE rating, beans, brew-method, date
FROM "Coffee Logs"
WHERE rating >= 4
SORT date DESC
```

**Average rating by origin**:
```dataview
TABLE 
  round(average(rows.rating), 2) as "Avg Rating",
  length(rows) as "Count"
FROM "Coffee Logs"
GROUP BY origin
SORT round(average(rows.rating), 2) DESC
```

**This month's stats**:
```dataview
TABLE WITHOUT ID
  length(rows) as "Sessions",
  sum(rows.cups-brewed) as "Cups",
  round(average(rows.rating), 2) as "Avg ⭐"
FROM "Coffee Logs"
WHERE date.month = date(today).month
```

---

## 4️⃣ Install Tracker

**Priority**: 🟡 Recommended - Visualizations and charts

Tracker creates visual charts, calendars, and graphs from your coffee data.

### Installation

1. Settings → Community Plugins → Browse
2. Search: "Tracker"
3. Click "Install"
4. Click "Enable"

### Configuration

**Settings → Tracker**:

- Default settings work well
- **Month View Render Type**: Circle (recommended)
- **Render X Months**: 12 (shows full year)

### Example Tracker Blocks

**Consumption Calendar** (GitHub-style):
```tracker
searchType: frontmatter
searchTarget: cups-brewed
folder: Coffee Logs
month:
    mode: circle
    threshold: 2
    color: saddlebrown
    showCircle: true
```

**Rating Trend Line**:
```tracker
searchType: frontmatter
searchTarget: rating
folder: Coffee Logs
line:
    title: Coffee Rating Trends
    yAxisLabel: Rating
    yMin: 0
    yMax: 5
    lineColor: orange
```

**Brew Method Distribution** (Pie Chart):
```tracker
searchType: yaml
searchTarget: brew-method
folder: Coffee Logs
pie:
    title: Brewing Methods Used
```

### Using Tracker

1. Create note or use existing
2. Insert tracker code block
3. Preview mode will render visualization
4. Updates automatically as you add logs

See `Tracker Examples.md` (create this) for more configurations.

---

## 5️⃣ Optional but Useful Plugins

### Advanced Tables

**Purpose**: Excel-like table editing with formulas  
**Installation**: Community Plugins → Browse → "Advanced Tables"

**Configuration**:
- Settings → Advanced Tables
- ✅ Enable all shortcuts
- ✅ Auto-format tables: ON

**Usage**: 
- Tab key to move between cells
- Formula support: `| =sum() |` etc.
- Sorts, aligns, and formats automatically

### Calendar

**Purpose**: Visual calendar sidebar for Daily Notes  
**Installation**: Community Plugins → Browse → "Calendar"

**Configuration**:
- Automatically syncs with Daily Notes settings
- Click any date to open/create daily note

**Usage**: Calendar icon appears in right sidebar

### Habit Tracker

**Purpose**: Track daily coffee habits with checkboxes and streaks  
**Installation**: Community Plugins → Browse → "Habit Tracker"

**Setup**:
- Create habits in Daily Notes
- Track with checkboxes
- View streaks and statistics

### Obsidian Charts

**Purpose**: Advanced charting (alternative to Tracker)  
**Installation**: Community Plugins → Browse → "Obsidian Charts"

**Usage**: More flexible than Tracker but more complex setup

### MetaEdit

**Purpose**: Quick property editing with buttons  
**Installation**: Community Plugins → Browse → "MetaEdit"

**Usage**: Update properties without opening note

### DB Folder

**Purpose**: Inline table editing of notes  
**Installation**: Community Plugins → Browse → "DB Folder"

**Requirement**: Requires Dataview  
**Usage**: Turn folder into editable database table

---

## 🎨 Bases (Core Plugin - v1.9.0+)

**Status**: Native feature in Obsidian v1.9.0+ (May 2025)

### What are Bases?

Bases transforms folders of notes into powerful database views with:
- Table and list views
- Inline editing
- Filtering and sorting
- Grouping
- Formula-based columns
- Aggregation (sum, average, count)

### Creating Your First Base

1. **Open Command Palette**: Cmd/Ctrl + P
2. **Search**: "Create new base"
3. **Choose Source**:
   - Folder-based: Select `Coffee Logs/`
   - Or Query-based: Use Dataview query
4. **Configure Columns**:
   - Add: `date`, `beans`, `rating`, `brew-method`, `origin`
5. **Save Base**: Save in `Views/` folder as `All Coffee Logs.base`

### Recommended Base Views

**All Coffee Logs**:
- Source: `Coffee Logs/` folder
- Columns: date, beans, rating, brew-method, roaster, origin
- Sort: date descending

**Top Rated**:
- Source: Query: `FROM "Coffee Logs" WHERE rating >= 4`
- Columns: rating, beans, roaster, origin, date
- Sort: rating descending

**By Roaster** (with Grouping):
- Source: `Coffee Logs/` folder
- Group By: roaster
- Columns: beans, rating, date
- Sort: rating descending

**By Origin** (with Grouping):
- Source: `Coffee Logs/` folder
- Group By: origin
- Columns: beans, roaster, rating, date

### Base Formulas

Add calculated columns:

**Days since brew**:
```javascript
(today() - date).days()
```

**Quality badge**:
```javascript
rating >= 4.5 ? "⭐ Excellent" : rating >= 3.5 ? "☕ Good" : "Fair"
```

**Cost per cup** (if tracking):
```javascript
price / cups-brewed
```

### Table Summaries

Right-click column headers:
- **Sum**: Total cups consumed
- **Average**: Mean rating
- **Count**: Number of sessions
- **Min/Max**: Rating range

---

## 🔧 Troubleshooting Common Issues

### Templates Not Working

**Problem**: Template doesn't insert or prompts don't appear

**Solutions**:
1. Check Templater is installed and enabled
2. Verify "Trigger on new file creation" is ON
3. Check folder template paths match exactly
4. Try manual insertion: Cmd/Ctrl + P → "Templater: Insert Template"

### Dataview Queries Not Rendering

**Problem**: See code block instead of table

**Solutions**:
1. Ensure Dataview plugin is installed and enabled
2. Check you're in Preview/Reading mode (not Source mode)
3. Verify "Enable JavaScript Queries" is ON (for DataviewJS)
4. Check folder paths in queries match your structure

### Tracker Not Displaying

**Problem**: Tracker code block shows as text

**Solutions**:
1. Ensure Tracker plugin installed and enabled
2. Must be in Preview mode to render
3. Check searchTarget matches property name exactly
4. Verify folder path exists and has data

### Properties Not Auto-Suggesting

**Problem**: Property suggestions don't appear when typing

**Solutions**:
1. Properties plugin enabled (should be default)
2. Check `.obsidian/types.json` exists
3. Use exact property names from templates
4. Properties panel: Settings → Editor → "Show inline title"

### Bases Not Working

**Problem**: Can't create or view Bases

**Solutions**:
1. Check Obsidian version: Settings → About (need v1.9.0+)
2. Update Obsidian if on older version
3. Try command palette: "Create new base"
4. Check notes have proper frontmatter with properties

---

## ⚡ Performance Tips

### Optimize Large Vaults

If you have hundreds of coffee logs:

1. **Dataview**: Increase refresh interval to 5000ms
2. **Tracker**: Limit date ranges (`startDate`, `endDate`)
3. **Bases**: Use queries instead of full folder scans
4. **Indexing**: Let Obsidian finish indexing before using queries

### Mobile Performance

- Dataview works on mobile but slower
- Tracker visualizations work on mobile
- Templater works but prompts may be cumbersome
- Bases List view better than Table view on mobile

---

## 📱 Mobile Setup

### Installing on Mobile (iOS/Android)

1. Install Obsidian from App Store/Play Store
2. Open vault (sync via iCloud, Obsidian Sync, or other)
3. Settings → Community Plugins → Enable
4. Install same plugins as desktop

### Mobile-Optimized Workflow

**Quick Logging**:
- Use `Quick Coffee Capture.md` template
- Fewer fields, faster entry
- Convert to full log later on desktop

**Viewing**:
- Bases List view works well on mobile
- Dataview queries readable
- Tracker charts display but may be small

---

## 🎓 Next Steps

Now that plugins are installed:

1. ✅ **Create Your First Coffee Log**
   - Use template in `Coffee Logs/` folder
   - Fill in tasting notes
   - See it appear in Dashboard

2. ✅ **Open the Coffee Dashboard**
   - Navigate to `Views/Coffee Dashboard.md`
   - Watch queries populate with your data

3. ✅ **Experiment with a Base View**
   - Create base from `Coffee Logs/` folder
   - Try grouping by origin or roaster
   - Add formulas and summaries

4. ✅ **Customize Templates**
   - Edit templates to match your workflow
   - Add/remove properties as needed
   - Create shortcuts for frequently used values

5. ✅ **Set Up Daily Notes**
   - Create today's note: Cmd/Ctrl + D
   - Quick-log daily coffee consumption
   - Link to detailed logs

---

## 🔗 Plugin Documentation Links

**Official Documentation**:
- [Templater Documentation](https://silentvoid13.github.io/Templater/)
- [Dataview Documentation](https://blacksmithgu.github.io/obsidian-dataview/)
- [Tracker Documentation](https://github.com/pyrochlore/obsidian-tracker)
- [Obsidian Help - Bases](https://help.obsidian.md/Plugins/Bases)
- [Obsidian Help - Properties](https://help.obsidian.md/Editing+and+formatting/Properties)

**Community Resources**:
- [Obsidian Forum - Plugins](https://forum.obsidian.md/)
- [Obsidian Discord - #plugin-advice](https://discord.gg/obsidianmd)
- [r/ObsidianMD](https://www.reddit.com/r/ObsidianMD/)

**Video Tutorials**:
- [Linking Your Thinking - Templater Tutorial](https://www.youtube.com/c/LinkingYourThinking)
- [Obsidian Office Hours - Plugin Guides](https://www.youtube.com/c/Obsidian)

---

## ✅ Installation Complete!

Your vault is now fully configured and ready to track your coffee journey!

**Recommended First Actions**:
1. Log your first coffee session
2. Create a bean profile
3. Explore the dashboard
4. Customize templates to your preferences

**Need Help?**: 
- Check [[README]] for usage guides
- See [[Dataview Queries Reference]] for query examples
- Visit [[Tracker Examples]] for visualization configs

---

**Last Updated**: 2025-10-24  
**Obsidian Version**: v1.10.1+ recommended  
**Required Plugins**: Templater, Dataview (Tracker optional but recommended)

