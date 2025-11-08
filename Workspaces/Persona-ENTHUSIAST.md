---
type: workspace-configuration
persona: enthusiast
skill-level: intermediate
brew-count-range: 20-100
version: 6.0.0
created: 2025-11-06
tags: [workspace, configuration, persona, enthusiast, intermediate, optimization, discovery]
---

# Enthusiast Workspace Configuration

**Target User**: Coffee enthusiasts with 20-100 brews, exploring optimization
**Philosophy**: Balance discovery with efficiency, surface insights, enable exploration
**Core Principle**: Unlock power features while maintaining usability

---

## Overview

The Enthusiast workspace is designed for coffee lovers who've mastered the basics and are ready to optimize, explore, and discover deeper insights. This layout provides powerful tools for analysis, comparison, and experimentation while maintaining an intuitive, organized interface.

**Key Design Goals**:
- **Enable discovery**: Surface insights from your growing dataset
- **Support optimization**: Easy access to analytics and recommendations
- **Facilitate exploration**: Quick navigation between related concepts
- **Balance complexity**: Show useful features without overwhelming

**What's Different from Novice**:
- Multi-pane layouts (reference + work simultaneously)
- Graph view for discovering connections
- Full analytics access (20+ brews unlocked features)
- Advanced search and filtering
- Tag-based navigation

---

## Workspace Layout

### Visual Layout Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│ Top Bar: Coffee Vault - Enthusiast Hub                              │
├──────────────┬───────────────────────────────────┬───────────────────┤
│              │                                   │                   │
│ Left Sidebar │       Main Pane                   │  Right Sidebar    │
│    (20%)     │         (50%)                     │      (30%)        │
│              │                                   │                   │
│ 📁 Explorer  │  ┌──────────────────────────┐    │  🔍 Local Graph   │
│  ⭐Starred   │  │ Top Pane (60%)           │    │  ┌──────────────┐ │
│  - Dashboard │  │ Persona-ENTHUSIAST-      │    │  │   ●──●       │ │
│  - Analytics │  │   Dashboard.md           │    │  │  ╱│  │╲      │ │
│  - Logs      │  │                          │    │  │ ●─●──●─●     │ │
│              │  │ ⭐ Coffee Intelligence   │    │  │   │    │      │ │
│ 🔍 Search    │  │ Performance Overview     │    │  │   ●────●     │ │
│  - Full text │  │ ML Recommendations       │    │  └──────────────┘ │
│  - Tags      │  │                          │    │                   │
│  - Queries   │  └──────────────────────────┘    │  🔗 Backlinks     │
│              │  ┌──────────────────────────┐    │  - Related notes  │
│ 🏷️ Tags     │  │ Bottom Pane (Optional)   │    │  - Connections    │
│  - Origins   │  │ Split for comparison     │    │                   │
│  - Methods   │  │ or reference guides      │    │  📊 Dataview      │
│  - Beans     │  └──────────────────────────┘    │  - Live queries   │
│              │                                   │  - Analytics      │
│ 🕒 Recent    │  [Tabs: Dashboard, Logs, Notes]  │                   │
│  - Last 5    │  [Edit ⟷ Preview toggle]         │  📅 Calendar      │
│              │                                   │  - Brew tracking  │
│              │                                   │                   │
└──────────────┴───────────────────────────────────┴───────────────────┘
```

**Layout Philosophy**:
- **Balanced three-pane**: Navigation | Work | Context
- **Flexible main area**: Support tabs and optional splits
- **Discovery tools**: Graph view and backlinks for exploration
- **Efficiency**: Quick access to analytics and recent work

---

## Pane Configuration

### 1. Left Sidebar (20% width)

**Purpose**: Powerful navigation and discovery tools

**Sections to Display**:

#### File Explorer with Starred Folders (Top Priority)
**Starred/Favorite Folders**:
- ⭐ **Views** → Persona-ENTHUSIAST-Dashboard.md
- ⭐ **Analytics** → All analytics dashboards (unlocked!)
- ⭐ **Coffee Logs** → Your brewing history
- ⭐ **Bean Library** → Bean profiles and ratings
- ⭐ **Templates** → Logging templates and recipes
- ⭐ **Brewing Guides** → All difficulty levels
- ⭐ **Origins** → Origin profiles for exploration

**All Folders** (accessible but collapsed):
- Scientific References
- Coffee Goals
- Equipment Models
- Roasters
- Producers
- Configuration

**Display Settings**:
- Show folder note counts: Yes (e.g., "Coffee Logs (47)")
- Show file icons: Yes
- Indent guides: Yes (show hierarchy)
- Sort order: Alphabetical within starred, then rest

---

#### Advanced Search Pane (Critical for Enthusiasts)
**Search Features**:
- **Full-text search**: Find any content across vault
- **Regex support**: Advanced pattern matching (optional)
- **Filter by folder**: Search within specific locations
- **Filter by tag**: Find all #washed or #ethiopian notes
- **Filter by type**: Show only coffee-log type notes

**Search Interface**:
```
┌─────────────────────────────┐
│ Search: ethiopian washed    │
├─────────────────────────────┤
│ 📁 Coffee Logs        (12)  │
│ 📁 Bean Library       (4)   │
│ 📁 Origins            (1)   │
│                             │
│ Filters:                    │
│ ☑ Coffee Logs               │
│ ☐ Scientific References     │
│ ☐ Brewing Guides            │
│                             │
│ Tags: #ethiopian #washed    │
└─────────────────────────────┘
```

**Quick Search Patterns**:
- `tag:#ethiopian` - All Ethiopian coffee notes
- `path:"Coffee Logs" rating:4.5` - High-rated logs only
- `type:coffee-log method:v60` - All V60 brews

---

#### Tag Pane (Navigation by Concept)
**Tag Categories** (organized hierarchically):
```
🏷️ Tags
├─ 🌍 Origins
│  ├─ #ethiopian (15)
│  ├─ #colombian (12)
│  ├─ #kenyan (8)
│  └─ ...
├─ ⚙️ Methods
│  ├─ #v60 (25)
│  ├─ #aeropress (18)
│  ├─ #french-press (10)
│  └─ ...
├─ 🌿 Processing
│  ├─ #washed (30)
│  ├─ #natural (20)
│  ├─ #honey (12)
│  └─ ...
├─ 🎯 Quality
│  ├─ #4-5-stars (20)
│  ├─ #experimental (8)
│  └─ ...
└─ 📚 Content Type
   ├─ #coffee-log (47)
   ├─ #bean-profile (15)
   └─ #cupping-session (3)
```

**Tag Navigation Benefits**:
- Click tag to see all matching notes
- Discover patterns (e.g., all washed Ethiopian coffees)
- Filter search by tag
- Visual organization of concepts

---

#### Recent Files (Last 5)
**Display**:
- Last 5 opened files
- Show file type icons
- Show relative timestamps
- Quick click to reopen

**Example**:
```
🕒 Recent Files
☕ Coffee Log - Nov 6          (1 hour ago)
📊 Monthly Analytics           (2 hours ago)
🌍 Ethiopian Yirgacheffe       (Yesterday)
⚙️ V60 Brewing Guide           (2 days ago)
📈 Brewing Optimization Engine (2 days ago)
```

---

**Left Sidebar Configuration**:
```json
{
  "file-explorer": {
    "starred": [
      "Views/Persona-ENTHUSIAST-Dashboard.md",
      "Analytics/",
      "Coffee Logs/",
      "Bean Library/",
      "Templates/",
      "Brewing Guides/",
      "Origins/"
    ],
    "showCounts": true,
    "showIcons": true,
    "indentGuides": true
  },
  "search": {
    "enableRegex": true,
    "enableFilters": true,
    "showFileType": true,
    "liveSearch": true
  },
  "tags": {
    "showHierarchy": true,
    "showCounts": true,
    "sortAlphabetical": true,
    "collapseNested": false
  },
  "recent-files": {
    "maxFiles": 5,
    "showTimestamps": true,
    "showIcons": true
  }
}
```

---

### 2. Main Pane (50% width, flexible)

**Purpose**: Primary workspace with multi-document support

**Layout Options**:

#### Single Pane Mode (Default)
- One document at a time
- Tabs for quick switching (max 5 tabs recommended)
- Full focus on current work

#### Split Pane Mode (When Needed)
- **Horizontal split**: Dashboard (top) + Reference (bottom)
- **Vertical split**: Log (left) + Guide (right)
- **Use cases**:
  - Logging coffee while reading brewing guide
  - Dashboard + specific analytics deep-dive
  - Comparing two bean profiles side-by-side

**Tab Management**:
- Show tabs at top (max 5 visible)
- Tab switcher: `Ctrl+Tab` to cycle
- Close tab: `Ctrl+W`
- Pin important tabs (dashboard, analytics)

**Display Modes**:
- **Preview mode** for reading (dashboards, guides)
- **Edit mode** for logging (coffee logs, notes)
- **Edit + Preview side-by-side** for reference while editing
- Toggle: `Ctrl+E` (edit/preview), `Ctrl+Shift+E` (split edit/preview)

**Startup Configuration**:
- Open Persona-ENTHUSIAST-Dashboard.md
- 2-3 recent tabs (last session)
- Preview mode default for dashboard
- Enable tab history (back/forward navigation)

**Configuration**:
```json
{
  "main-pane": {
    "defaultMode": "preview",
    "enableTabs": true,
    "maxTabs": 5,
    "allowSplits": true,
    "defaultSplit": "horizontal",
    "splitRatio": 0.6,
    "fontSize": 15,
    "readableLineLength": false,
    "lineHeight": 1.5,
    "startupFile": "Views/Persona-ENTHUSIAST-Dashboard.md",
    "restoreSession": true,
    "maxSessionTabs": 3
  }
}
```

---

### 3. Right Sidebar (30% width, always visible)

**Purpose**: Contextual information and discovery tools

**Sections** (top to bottom):

#### Local Graph View (Top)
**What It Shows**:
- Current note and its connections (2 levels deep)
- Related coffee logs, beans, origins, methods
- Visual relationship mapping

**Example**:
```
Current: Ethiopian Yirgacheffe Bean Profile
         ↓
Connected to:
- Coffee Log (Nov 6) ← brew using this bean
- Coffee Log (Nov 4)
- Ethiopian Origin Profile ← geographic connection
- Washed Processing Guide ← processing method
- V60 Guide ← common brewing method
```

**Settings**:
- Depth: 2 levels
- Show orphans: No
- Show attachments: No
- Filter: Show only coffee-related types
- Color code: By type (logs blue, beans green, origins orange)

**Benefits**:
- Discover related notes you forgot about
- See connections between beans, origins, methods
- Navigate by clicking nodes
- Understand your coffee knowledge graph

---

#### Backlinks Panel (Middle)
**What It Shows**:
- Notes that link to current note
- Context snippets (paragraph with link)
- Unlinked mentions (potential connections)

**Example**:
```
🔗 Backlinks (5)

Coffee Log - Nov 6
"Brewed the [[Ethiopian Yirgacheffe]]
with V60, fantastic clarity and acidity"

Coffee Log - Nov 4
"Second brew of [[Ethiopian Yirgacheffe]]
trying different grind size"

📎 Unlinked Mentions (2)
"The Ethiopian coffee from last week..."
```

**Benefits**:
- Track how often you've used a bean
- Find related brewing experiments
- Create missing connections
- Build knowledge web

---

#### Dataview Query Panel (Live Analytics)
**Custom Queries for Current Context**:
- If viewing bean: Show all logs using this bean
- If viewing origin: Show all beans from this origin
- If viewing method: Show average rating, brew count
- If viewing log: Show similar brews (same bean/method)

**Example Queries**:
```dataview
/* Live query based on current note */
TABLE rating, brew-method, notes
FROM "Coffee Logs"
WHERE beans = this.name
SORT date DESC
LIMIT 5
```

**Benefits**:
- Instant analytics without switching views
- Context-aware insights
- Live updating as you create logs

---

#### Calendar (Bottom, Optional)
**Purpose**: Track brewing frequency and consistency

**Display**:
- Monthly view
- Dots on days with coffee logs
- Color intensity = number of brews that day
- Click date to see logs from that day

**Benefits**:
- Visualize brewing streaks
- Identify gaps in logging
- Quick date-based navigation
- Gamification (maintain streaks!)

---

**Right Sidebar Configuration**:
```json
{
  "right-sidebar": {
    "defaultState": "visible",
    "panels": [
      "local-graph",
      "backlinks",
      "dataview-query",
      "calendar"
    ],
    "localGraph": {
      "depth": 2,
      "showOrphans": false,
      "colorByType": true,
      "filters": ["type:coffee-log", "type:bean-profile", "type:origin-profile"]
    },
    "backlinks": {
      "showContext": true,
      "showUnlinked": true,
      "contextLines": 2
    },
    "calendar": {
      "showDots": true,
      "dotColor": "#5D4037",
      "colorIntensity": true
    }
  }
}
```

---

## Plugin Configuration

### Required Plugins

#### 1. **Templater** (Essential)
**Purpose**: Advanced template automation with dynamic content

**Settings for Enthusiasts**:
- **Templates folder**: `/Templates`
- **User scripts folder**: `/Scripts` (for custom automation)
- **Enable system commands**: Yes
- **Enable user scripts**: Yes (for advanced templates)
- **Trigger on new file creation**: Yes
- **Show icon in ribbon**: Yes

**Advanced Template Features**:
- Dynamic date calculations (roast age, days since last brew)
- Auto-suggest recent beans and methods
- Pre-fill common parameters
- Create recipe profiles with variable calculations

**Hotkeys**:
- `Ctrl+Shift+T` - Insert template
- `Alt+T` - Jump to next template field

**Configuration**:
```json
{
  "templater": {
    "templatesFolder": "Templates",
    "userScriptsFolder": "Scripts",
    "enableSystemCommands": true,
    "enableUserScripts": true,
    "triggerOnFileCreation": true,
    "showVariables": true
  }
}
```

---

#### 2. **Datacore** (Essential - Full Power)
**Purpose**: Advanced queries and live analytics

**Enthusiast Features Enabled**:
- Inline queries with complex logic
- DataviewJS support (JavaScript in queries)
- Custom functions and calculations
- Live-updating analytics
- Query performance monitoring

**Settings**:
- **Enable inline queries**: Yes
- **Enable DataviewJS**: Yes (for advanced analytics)
- **Auto-refresh interval**: 10 seconds (faster than novice)
- **Show query execution time**: Yes (optimize slow queries)
- **Cache queries**: Yes (performance)

**Advanced Usage**:
- Correlation analysis queries
- Trend calculations
- Multi-table joins (logs + beans + origins)
- Statistical functions (average, stdev, percentiles)

**Configuration**:
```json
{
  "datacore": {
    "enableInlineQueries": true,
    "enableDataviewJS": true,
    "autoRefresh": 10,
    "showExecutionTime": true,
    "enableCaching": true,
    "maxQueryTime": 3000
  }
}
```

---

#### 3. **Calendar** (Recommended)
**Purpose**: Visual tracking and date-based navigation

**Enhanced Features for Enthusiasts**:
- Streak tracking
- Multiple dots per day (multiple brews)
- Color intensity based on brew count
- Quick add from calendar view

**Configuration**:
```json
{
  "calendar": {
    "weekStart": "sunday",
    "showDots": true,
    "dotColor": "#5D4037",
    "multipleDots": true,
    "intensityLevels": 5,
    "quickAdd": true
  }
}
```

---

#### 4. **Graph View** (Enable Full Feature)
**Purpose**: Discover connections and navigate knowledge

**Configuration for Enthusiasts**:
- **Local graph**: Show in right sidebar (always visible)
- **Global graph**: Available via command palette or hotkey
- **Filters**: Show coffee-related types, hide configuration
- **Color coding**: By file type
- **Physics**: Balanced (readable but dynamic)
- **Depth**: Local = 2 levels, Global = 3 levels

**Features to Enable**:
- Arrows on links (show directionality)
- Labels on hover
- Highlight current note
- Filter by tags
- Filter by type

**Hotkeys**:
- `Ctrl+G` - Open global graph view
- `Ctrl+Shift+G` - Focus on current note in graph

**Configuration**:
```json
{
  "graph": {
    "localGraph": {
      "enabled": true,
      "location": "right-sidebar",
      "depth": 2,
      "showArrows": true,
      "colorByType": true
    },
    "globalGraph": {
      "enabled": true,
      "depth": 3,
      "filters": [
        "path:Coffee Logs",
        "path:Bean Library",
        "path:Origins",
        "path:Brewing Guides"
      ],
      "excludeFolders": ["Configuration", ".obsidian"]
    }
  }
}
```

---

#### 5. **Kanban** (Optional - Goal Tracking)
**Purpose**: Visual goal and project management

**Use Cases**:
- Track coffee goals (To Do | In Progress | Done)
- Manage bean inventory (To Buy | Active | Finished)
- Plan cupping sessions
- Training plan progress

**Configuration**:
```json
{
  "kanban": {
    "defaultBoard": "Coffee Goals/Current Goals",
    "showLaneCount": true,
    "enableArchive": true,
    "dateFormat": "YYYY-MM-DD"
  }
}
```

---

#### 6. **Tasks** (Optional - ToDo Management)
**Purpose**: Track brewing tasks and experiments

**Features**:
- Query all uncompleted tasks across vault
- Due dates and priorities
- Filter by tag or folder
- Progress tracking

**Configuration**:
```json
{
  "tasks": {
    "showPriority": true,
    "showDueDate": true,
    "globalTaskQuery": true
  }
}
```

---

#### 7. **Excalidraw** (Optional - Sketching)
**Purpose**: Sketch brew setups, equipment layouts, processing flows

**Use Cases**:
- Draw your brew station setup
- Sketch processing methods
- Diagram flavor profiles
- Create visual brew recipes

---

### Plugins to KEEP DISABLED

**Not Yet Needed** (save for Professional level):
- Advanced Tables (unless doing heavy data work)
- Database folder (complexity)
- Custom plugins for ML (wait until 100+ brews)

---

## Recommended Hotkeys

**Philosophy**: Efficiency without overwhelming complexity

### Essential Hotkeys

| Hotkey | Action | Purpose |
|--------|--------|---------|
| `Ctrl+N` | New note from template | Quick logging |
| `Ctrl+O` | Quick switcher | Find any file fast |
| `Ctrl+P` | Command palette | Access all commands |
| `Ctrl+Shift+F` | Global search | Find text across vault |
| `Ctrl+E` | Toggle edit/preview | Switch modes |
| `Ctrl+Shift+E` | Split editor (edit + preview) | Reference while editing |
| `Ctrl+G` | Open graph view | Explore connections |
| `Ctrl+H` | Toggle left sidebar | More screen space |
| `Ctrl+Shift+H` | Toggle right sidebar | Hide/show context |
| `Ctrl+\` | Split pane vertically | Side-by-side comparison |
| `Ctrl+Shift+\` | Split pane horizontally | Top-bottom split |
| `Ctrl+W` | Close active pane | Clean up workspace |
| `Ctrl+Tab` | Cycle through tabs | Navigate open notes |
| `Alt+Left` | Go back in history | Navigate history |
| `Alt+Right` | Go forward in history | Navigate history |
| `Ctrl+Shift+T` | Insert template | Templater |
| `F5` | Refresh Dataview queries | Force update analytics |

### Advanced Hotkeys (Optional)

| Hotkey | Action | Purpose |
|--------|--------|---------|
| `Ctrl+K` | Insert link | Quick wikilink creation |
| `Ctrl+Shift+K` | Delete current line | Fast editing |
| `Alt+Up/Down` | Move line up/down | Reorder content |
| `Ctrl+D` | Duplicate line | Fast duplication |
| `Ctrl+F` | Search in current file | Find text |
| `F11` | Toggle focus mode | Distraction-free |

**Custom Hotkey Configuration**:
```json
{
  "hotkeys": {
    "templater:insert-template": "Ctrl+Shift+T",
    "graph:open-local": "Ctrl+G",
    "editor:split-vertical": "Ctrl+\\",
    "editor:split-horizontal": "Ctrl+Shift+\\",
    "dataview:refresh": "F5",
    "workspace:toggle-left-sidebar": "Ctrl+H",
    "workspace:toggle-right-sidebar": "Ctrl+Shift+H",
    "editor:toggle-source": "Ctrl+E",
    "editor:toggle-split": "Ctrl+Shift+E"
  }
}
```

---

## Theme & Appearance

### Visual Settings

**Goal**: Professional, data-dense, efficient interface

#### Typography
- **Font family**: System default (professional)
- **Base font size**: 14-16px (smaller than novice, fit more content)
- **Line height**: 1.5 (balanced for reading and data)
- **Editor font size**: 15px (comfortable for editing)
- **Monospace font**: For code blocks and queries

#### Colors (Coffee Vault CSS - Full Palette)
- **Primary**: Coffee brown (#5D4037)
- **Accent**: Orange (#FF6F00)
- **Secondary**: Light brown (#8D6E63)
- **Background**: Off-white (#FAFAFA)
- **Text**: Dark gray (#212121)
- **Success**: Green (#4CAF50)
- **Warning**: Yellow (#FFC107)
- **Info**: Blue (#2196F3)
- **Data viz**: Multi-color palette for charts

#### Layout Settings
- **Readable line length**: OFF (use full width for data tables)
- **Compact mode**: ON (fit more content)
- **Show inline title**: Yes
- **Show frontmatter**: Minimal (collapsed by default)

#### Advanced Appearance
- **Tab animations**: Smooth (200ms)
- **Hover effects**: Enabled (interactive feel)
- **Focus indicators**: Visible (accessibility)
- **Graph physics**: Balanced (readable connections)

### CSS Customizations (Enthusiast Theme)

```css
/* Enthusiast-optimized appearance */

/* Compact but readable */
body {
  --font-text-size: 15px;
  --line-height-normal: 1.5;
  --file-margins: 20px;
}

/* Sidebar optimizations */
.nav-folder-title {
  font-size: 13px;
  padding: 4px 8px;
}

/* Tag styling */
.tag {
  background: var(--coffee-primary-light);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

/* Graph view enhancements */
.graph-view.color-fill-tag {
  opacity: 0.8;
}

.graph-view.color-line {
  opacity: 0.6;
}

/* Analytics table styling */
table {
  width: 100%;
  font-size: 14px;
  border-collapse: collapse;
}

table th {
  background: var(--coffee-primary);
  color: white;
  padding: 8px;
  text-align: left;
}

table td {
  padding: 6px 8px;
  border-bottom: 1px solid var(--divider);
}

/* Callout enhancements */
.callout {
  border-radius: 8px;
  padding: 12px 16px;
  margin: 12px 0;
}

/* Query result highlights */
.dataview.result-group {
  background: var(--background-secondary);
  padding: 12px;
  border-radius: 6px;
  margin: 8px 0;
}
```

**Configuration**:
```json
{
  "appearance": {
    "baseFontSize": 15,
    "theme": "coffee-vault-enthusiast",
    "cssSnippets": ["enthusiast-optimized.css"],
    "readableLineLength": false,
    "showInlineTitle": true,
    "foldHeading": true,
    "foldIndent": true
  }
}
```

---

## Startup Behavior

### On Obsidian Launch

**What Opens**:
1. **Persona-ENTHUSIAST-Dashboard.md** in main pane (preview mode)
2. **Last 2-3 tabs** from previous session (if relevant)
3. **Left sidebar**: Visible with starred folders expanded
4. **Right sidebar**: Visible with local graph active

**Session Restoration**:
- Restore recent tabs (max 3)
- Restore pane layout (if split)
- Restore scroll position in dashboard
- Don't restore more than 5 total panes (prevent clutter)

**Smart Startup Logic**:
```
IF last session < 24 hours ago:
  → Restore last session (tabs + layout)
ELSE:
  → Fresh start with dashboard only
```

**Configuration**:
```json
{
  "startup": {
    "openFile": "Views/Persona-ENTHUSIAST-Dashboard.md",
    "openMode": "preview",
    "leftSidebar": "visible",
    "rightSidebar": "visible",
    "restoreSession": true,
    "maxSessionTabs": 3,
    "sessionTimeout": 86400,
    "restoreScrollPosition": true
  }
}
```

---

## Setup Instructions

### Prerequisites

- [ ] Obsidian installed (version 1.4.0+)
- [ ] Coffee Vault loaded
- [ ] 20+ coffee logs created (to unlock analytics)
- [ ] Comfortable with basic Obsidian navigation

### Required Plugins

**Install and enable**:

1. **Templater** (advanced templates)
2. **Datacore** (powerful queries)
3. **Calendar** (date tracking)
4. **Graph View** (enable core plugin)

**Optional but recommended**:

5. **Kanban** (goal tracking)
6. **Tasks** (todo management)
7. **Excalidraw** (sketching)

### Step-by-Step Setup

#### Step 1: Install Core Plugins

1. Open Settings → Community Plugins → Browse
2. Install:
   - Templater
   - Datacore
   - Calendar
   - Kanban (optional)
   - Tasks (optional)
   - Excalidraw (optional)
3. Enable each after installation

---

#### Step 2: Enable Core Plugin: Graph View

1. Settings → Core Plugins
2. **Enable**: Graph View
3. **Enable**: Backlinks
4. **Enable**: File Explorer
5. **Enable**: Search
6. **Enable**: Tags

---

#### Step 3: Configure Templater (Advanced)

1. Settings → Templater
2. **Template folder**: `Templates`
3. **User scripts folder**: `Scripts` (if exists)
4. **Enable system commands**: Yes
5. **Enable user scripts**: Yes
6. **Trigger on new file**: Yes
7. **Show variables in preview**: Yes
8. Set hotkey `Ctrl+Shift+T` for insert template

---

#### Step 4: Configure Datacore (Full Power)

1. Settings → Datacore
2. **Enable inline queries**: Yes
3. **Enable DataviewJS**: Yes
4. **Auto-refresh interval**: 10 seconds
5. **Show execution time**: Yes
6. **Enable caching**: Yes
7. **Max query timeout**: 3000ms

---

#### Step 5: Configure Graph View

1. Settings → Graph View
2. **Local Graph**:
   - Depth: 2
   - Show orphans: No
   - Show arrows: Yes
   - Color by file type: Yes
3. **Global Graph**:
   - Depth: 3
   - Filters: Add coffee-related paths
   - Exclude: Configuration, .obsidian
4. **Display**:
   - Show labels: On hover
   - Force settings: Balanced
   - Animate: Yes

Set hotkeys:
- `Ctrl+G` → Open global graph
- `Ctrl+Shift+G` → Reveal current note in graph

---

#### Step 6: Configure Appearance

1. Settings → Appearance
2. **Base font size**: 15
3. **Readable line length**: OFF (use full width)
4. **Show inline title**: Yes
5. **Theme**: Coffee Vault Enthusiast (or default)
6. **CSS snippets**: Enable `enthusiast-optimized.css`
7. **Native menus**: Off (better Obsidian experience)

---

#### Step 7: Configure Workspace Layout

1. **Left Sidebar**:
   - Star/favorite key folders (Analytics, Logs, Beans, etc.)
   - Enable Search panel
   - Enable Tags panel
   - Set width: ~20%

2. **Main Pane**:
   - Open Persona-ENTHUSIAST-Dashboard.md
   - Set to preview mode
   - Allow tabs (max 5)
   - Allow splits

3. **Right Sidebar**:
   - Enable Local Graph (top)
   - Enable Backlinks (middle)
   - Enable Calendar (bottom)
   - Set width: ~30%

4. Save workspace:
   - Settings → Workspaces → Save current as "Enthusiast"

---

#### Step 8: Set Hotkeys

Configure these essential hotkeys:

**Navigation**:
- `Ctrl+O` → Quick switcher
- `Ctrl+Shift+F` → Global search
- `Alt+Left/Right` → Navigate history

**Views**:
- `Ctrl+G` → Global graph
- `Ctrl+E` → Toggle edit/preview
- `Ctrl+Shift+E` → Split edit+preview

**Layout**:
- `Ctrl+\` → Split vertical
- `Ctrl+Shift+\` → Split horizontal
- `Ctrl+W` → Close pane
- `Ctrl+H` → Toggle left sidebar
- `Ctrl+Shift+H` → Toggle right sidebar

**Templates**:
- `Ctrl+Shift+T` → Insert template

**Other**:
- `F5` → Refresh Dataview queries

---

#### Step 9: Organize Tags

1. Review your coffee logs
2. Ensure consistent tagging:
   - Origins: `#ethiopian`, `#colombian`, etc.
   - Methods: `#v60`, `#aeropress`, `#french-press`
   - Processing: `#washed`, `#natural`, `#honey`
   - Quality: `#4-5-stars`, `#experimental`

3. Use tag panel to navigate by concept
4. Create tag MOCs (Maps of Content) if desired

---

#### Step 10: Test the Workspace

1. Close and reopen Obsidian
2. Verify:
   - [ ] Enthusiast dashboard opens
   - [ ] Left sidebar shows starred folders, search, tags
   - [ ] Right sidebar shows local graph, backlinks, calendar
   - [ ] Analytics dashboards are accessible (unlocked at 20+ brews)
   - [ ] Graph view shows connections
   - [ ] Hotkeys work as expected

3. Test workflows:
   - Log a new coffee brew
   - Search for a specific bean
   - Navigate via graph
   - Compare two bean profiles (split pane)
   - Check analytics dashboard

---

### Troubleshooting

#### Analytics dashboards show empty data
**Solution**:
- Ensure you have 20+ coffee logs
- Check logs have proper YAML frontmatter
- Verify `type: coffee-log` in each log
- Refresh queries with `F5`

#### Graph view doesn't show connections
**Solution**:
- Use wikilinks: `[[Bean Name]]` not plain text
- Enable "Detect all file extensions" in Settings
- Check graph filters aren't excluding coffee files
- Restart Obsidian

#### Right sidebar panels not showing
**Solution**:
- Click right sidebar toggle (or `Ctrl+Shift+H`)
- Settings → Core Plugins → Enable Graph View, Backlinks
- Verify Calendar plugin is installed and enabled

#### Datacore queries too slow
**Solution**:
- Enable caching in Datacore settings
- Increase query timeout (3000ms → 5000ms)
- Optimize complex queries (limit results, narrow scope)
- Check query execution time (should be <500ms)

#### Too many tabs/panes open
**Solution**:
- Close tabs: `Ctrl+W`
- Limit session restore: Settings → max 3 tabs
- Use tab groups for organization
- Pin only essential tabs (dashboard, analytics)

---

## Advanced Features

### Power User Workflows

#### 1. Comparison Workflow
**Use split panes to compare**:
- Two bean profiles side-by-side
- Brewing guide + coffee log
- Dashboard + analytics deep-dive

**How to**:
1. Open first note
2. `Ctrl+\` to split vertical
3. Open second note in split
4. Navigate independently in each pane

---

#### 2. Research Workflow
**Combine graph + backlinks + search**:
1. Find origin profile (e.g., Ethiopian)
2. View local graph → see all connected beans
3. Check backlinks → find all brew logs
4. Search for specific descriptors within results

---

#### 3. Analytics Workflow
**Dashboard → Query → Visualize → Export**:
1. Open Monthly Analytics Dashboard
2. Identify interesting pattern
3. Write custom Datacore query to dig deeper
4. Export results as table or chart
5. Document findings in note

---

#### 4. Goal Tracking Workflow
**Use Kanban + Tasks**:
1. Create Coffee Goal note
2. Add to Kanban board (To Do | In Progress | Done)
3. Break down into tasks with `- [ ]`
4. Track progress with Tasks plugin
5. Move card on Kanban as you progress

---

### Custom Query Examples

#### Find Best Performing Beans by Origin

```dataview
TABLE WITHOUT ID
    beans as "Bean",
    round(average(rows.rating), 2) as "Avg Rating",
    length(rows) as "Brews"
FROM "Coffee Logs"
WHERE type = "coffee-log" AND origin = "Ethiopia"
GROUP BY beans
SORT average(rows.rating) DESC
LIMIT 10
```

---

#### Brewing Consistency Analysis

```dataview
TABLE WITHOUT ID
    brew-method as "Method",
    round(average(rows.rating), 2) as "Avg",
    round(min(rows.rating), 1) + " - " + round(max(rows.rating), 1) as "Range",
    round(stdev(rows.rating), 2) as "Std Dev"
FROM "Coffee Logs"
WHERE type = "coffee-log"
GROUP BY brew-method
```

---

#### Cost Per Brew Analysis

```dataviewjs
const logs = dv.pages('"Coffee Logs"').where(p => p.type === "coffee-log");
const beans = dv.pages('"Bean Library"').where(p => p["type"] === "bean-profile");

const totalCost = beans.map(b => b["price-paid"] || 0).reduce((a, b) => a + b, 0);
const brewCount = logs.length;
const costPerBrew = totalCost / brewCount;

dv.paragraph(`**Total Invested**: $${totalCost.toFixed(2)}`);
dv.paragraph(`**Total Brews**: ${brewCount}`);
dv.paragraph(`**Cost Per Brew**: $${costPerBrew.toFixed(2)}`);
```

---

## ⚡ Quality of Life Features (v7.0)

Coffee Vault 7.0 brings powerful QoL enhancements for enthusiasts to work faster and iterate more efficiently.

### Floating Action Bar

**What it does**: Persistent quick-access menu for power users.

**Enthusiast-specific actions**:
- ☕ New Standard Log
- 📊 Monthly Analytics
- 🔬 Scientific References
- 🌱 Beans Library
- ⚙️ Run Data Extraction
- 📈 Visualization Hub

**Power tip**: Press `Shift + Space` anywhere, even while editing, to access quick actions without breaking flow.

---

### Recent Items Sidebar

**Power user benefits**:
- **Pin active experiments**: Keep your current bean profile, recipe, and goal pinned
- **Compare logs**: Quickly switch between recent brews for comparison
- **Research flow**: Pin scientific references while developing techniques

**Workflow example**:
1. Pin current bean profile
2. Pin target recipe
3. Log multiple iterations
4. Compare results in Recent Items
5. Update recipe based on findings

---

### Keyboard Shortcuts for Enthusiasts

Master these for maximum efficiency:

| Shortcut | Action | Workflow |
|----------|--------|----------|
| `Cmd/Ctrl + Shift + L` | New standard log | Quick iteration logging |
| `Cmd/Ctrl + Shift + E` | Extract data | Update analytics |
| `Cmd/Ctrl + Shift + V` | Visualization hub | Review trends |
| `Cmd/Ctrl + Shift + M` | Monthly analytics | Deep dive analysis |
| `Alt + 2` | Standard template | Fast logging |
| `?` | Shortcuts overlay | Quick reference |

**Full power user guide**: [[Configuration/KEYBOARD-SHORTCUTS|Complete Shortcuts Reference]]

---

### Template Variants for Experimentation

**Quick (1 min)**: Daily consistency tracking
- Use for rapid iteration (5+ brews/day)
- Track only essential variables
- [[Templates/Coffee-Log-Quick]]

**Standard (3-5 min)**: Balanced exploration (recommended)
- Full parameter tracking
- Equipment logging
- Flavor profiling
- [[Templates/Coffee-Log-Standard]]

**Detailed (10+ min)**: Competition prep & special sessions
- Full SCA cupping protocol
- TDS and extraction yield
- Environmental factors
- [[Templates/Coffee-Log-Detailed]]

**Pro workflow**: Use Quick for daily, Standard for refinement, Detailed for competitions.

---

### Advanced Search for Data Discovery

**Enthusiast-level searches**:

**Find optimization opportunities**:
```
[rating:<4] [brew-method:v60]
```
→ V60 brews to improve

**Track extraction trends**:
```
[tds:>0] [extraction-yield:>0]
```
→ All measured extractions

**Bean performance analysis**:
```
[origin:ethiopia] [rating:>0]
```
→ Compare Ethiopian coffees

**Method comparison**:
```
(v60 OR aeropress) [rating:>=4]
```
→ Top brews by method

**Complex analysis**:
```
[date:>2025-11-01] [rating:>=4] [brew-method:v60]
```
→ Recent successful V60 brews

**Master search**: [[Configuration/SEARCH-TIPS|Advanced Search Guide]]

---

### Dashboard Quick Actions

Enthusiast Dashboard includes:
- ☕ **Standard Log** - Balanced template
- 📊 **View Analytics** - Monthly insights
- 🔬 **Explore Science** - Research library
- 🌱 **Beans Library** - Current inventory

**Customization**: Edit [[Views/Persona-ENTHUSIAST-Dashboard]] to add your own quick actions.

---

### CSS & Visual Enhancements

**New in v7.0**:

**Loading states**: No more waiting for dataview queries - see skeleton screens

**Toast notifications**: Confirm data extractions, exports, and actions

**Enhanced search results**: Color-coded highlights and better previews

**Progress indicators**: Visual feedback for long-running operations

**Smooth transitions**: Polished animations between views

**Chart enhancements**: Better hover states and interactive elements

**Enable all features**:
```
Settings → Appearance → CSS Snippets:
- coffee-vault-design-system-v6.css ✓
- floating-actions.css ✓
- coffee-vault-animations.css ✓
```

---

### Data Extraction Workflow Enhancement

**New workflow**:
1. Log multiple brews throughout the day
2. Press `Cmd/Ctrl + Shift + E` to extract
3. View toast notification confirming extraction
4. Navigate to analytics with `Cmd/Ctrl + Shift + M`
5. See updated trends and insights

**Automation tip**: Set up automatic extraction on schedule (see [[Configuration/Automation-Playbook]])

---

### Visualization Shortcuts

When visualization is focused:

| Shortcut | Action | Use Case |
|----------|--------|----------|
| `Arrow Keys` | Rotate view | Explore 3D data |
| `+` / `-` | Zoom in/out | Focus on clusters |
| `R` | Reset view | Return to default |
| `E` | Export PNG | Share insights |
| `D` | Dark mode toggle | Match environment |
| `G` | Toggle grid | Better depth perception |
| `L` | Toggle labels | Clean vs. detailed view |

**3D navigation tip**: Hold `Shift` while dragging for pan instead of rotate.

---

### Mobile Optimization for Enthusiasts

**On-the-go logging**:
- Large 64px FAB button for easy tapping
- Responsive quick actions grid
- Touch-optimized search
- Swipe gestures for Recent Items

**Mobile workflow**:
1. Brew coffee
2. Quick Log on phone (1 min)
3. Sync to desktop
4. Extract data and analyze later

---

### Getting Started with v7.0 Features

**Day 1**: Set up keyboard shortcuts
- Configure `Cmd/Ctrl + Shift + L` for new log
- Configure `Cmd/Ctrl + Shift + E` for extraction
- Practice `Shift + Space` for quick access

**Week 1**: Master template variants
- Try all three templates
- Find your sweet spot
- Develop consistent workflow

**Week 2**: Advanced search mastery
- Practice complex queries
- Create saved searches
- Build custom dashboards with Dataview

**Month 1**: Full v7.0 integration
- FAB becomes muscle memory
- Recent Items optimized for your workflow
- Custom shortcuts for all common tasks
- Extraction and analytics automated

---

## Related Resources

### Essential Dashboards

- **[[Views/Persona-ENTHUSIAST-Dashboard|Enthusiast Dashboard]]** - Your home base
- **[[Analytics/Analytics-Analysis-Layout/1-Monthly-Analytics-Dashboard|Monthly Analytics]]** - Performance tracking
- **[[Analytics/Analytics-Analysis-Layout/2-Brewing-Optimization-Engine|Optimization Engine]]** - ML recommendations
- **[[Analytics/Analytics-Analysis-Layout/3-Cost-Intelligence-System|Cost Intelligence]]** - Budget tracking

### Learning Paths

- **[[Scientific References/|Science Library]]** - Deep knowledge
- **[[Brewing Guides/|Brewing Guides]]** - Technique refinement
- **[[Coffee Goals/|Coffee Goals]]** - Structured learning
- **[[Templates/Cupping Session|Cupping Sessions]]** - Palate development

### Configuration

- **[[Configuration/User-Configuration-Guide|Configuration Guide]]** - Advanced settings
- **[[Configuration/Plugin-Setup|Plugin Setup]]** - Plugin deep-dives
- **[[HOME-DASHBOARD|Main Dashboard]]** - Vault home

### Next Level

- **[[Views/Persona-PROFESSIONAL-Dashboard|Professional Dashboard]]** - When you hit 100+ brews
- **[[Workspaces/Persona-PROFESSIONAL|Professional Workspace]]** - Advanced layout

---

## Workspace Philosophy Summary

**The Enthusiast Workspace empowers discovery and optimization.**

By providing powerful tools for analysis, comparison, and exploration while maintaining organization and usability, this workspace helps intermediate users:
- Discover insights from their growing dataset
- Optimize brewing parameters systematically
- Explore new origins, methods, and techniques
- Track progress toward mastery
- Build deep coffee knowledge

**You've unlocked the full power of Coffee Vault. Now explore, experiment, and optimize!**

---

**Version**: 6.0.0 - Enthusiast Workspace Configuration
**Last Updated**: 2025-11-06
**Target Persona**: Enthusiast (20-100 brews)
**Design Philosophy**: Discovery, Optimization, Exploration, Balance

**Questions?** See [[Configuration/User-Configuration-Guide|Configuration Help]]
