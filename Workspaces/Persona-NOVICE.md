---
type: workspace-configuration
persona: novice
skill-level: beginner
brew-count-range: 0-20
version: 6.0.0
created: 2025-11-06
tags: [workspace, configuration, persona, novice, beginner, simplicity]
---

# Novice Workspace Configuration

**Target User**: Beginner coffee enthusiasts with 0-20 brews
**Philosophy**: Simplicity, guidance, encouragement, and focus
**Core Principle**: Remove complexity, amplify confidence

---

## Overview

The Novice workspace is designed to eliminate overwhelm and provide a supportive, guided environment for coffee beginners. By hiding advanced features and emphasizing essential tools, this layout helps new users build confidence and consistency without distraction.

**Key Design Goals**:
- **Minimize cognitive load**: Show only what's immediately needed
- **Provide gentle guidance**: Visual cues and inline help everywhere
- **Encourage progress**: Clear milestones and achievement tracking
- **Focus on fundamentals**: Logging, basic learning, simple workflows

---

## Workspace Layout

### Visual Layout Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ Top Bar: Coffee Vault - Novice Journey                     │
├─────────────────┬───────────────────────────────────────────┤
│                 │                                           │
│  Left Sidebar   │          Main Pane                        │
│     (25%)       │            (75%)                          │
│                 │                                           │
│  📁 Explorer    │   ┌─────────────────────────────────┐    │
│    - Favorites  │   │  Persona-NOVICE-Dashboard.md    │    │
│    - Templates  │   │                                 │    │
│    - Logs       │   │  🌱 Novice Coffee Journey       │    │
│                 │   │                                 │    │
│  🕒 Recent      │   │  Your Progress: 5/20 brews      │    │
│    - Last 3     │   │  ▓▓▓░░░░░░░░░░░░░                │    │
│                 │   │                                 │    │
│  ⭐ Quick       │   │  🚀 Log Your Next Brew →        │    │
│    - Log Brew   │   │                                 │    │
│    - Start Here │   │  📚 Essential Learning          │    │
│                 │   │                                 │    │
│                 │   │  [Preview Mode - Readable]      │    │
│                 │   │                                 │    │
│                 │   └─────────────────────────────────┘    │
│                 │                                           │
│  Right Sidebar: HIDDEN by default                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Layout Philosophy**:
- **Narrow left sidebar**: Quick access without overwhelming options
- **Wide main pane**: Focus on content with large, readable text
- **Hidden right sidebar**: Reduce visual clutter (reveal as needed)
- **Single-pane default**: No splits, no tabs—one task at a time

---

## Pane Configuration

### 1. Left Sidebar (25% width)

**Purpose**: Essential navigation only, with clear favorites and shortcuts

**Sections to Display**:

#### File Explorer (Top Section)
- **Starred Folders** (always visible):
  - ⭐ **Templates** - Quick Coffee Capture, Coffee-Log-v5
  - ⭐ **Coffee Logs** - Recent brews
  - ⭐ **Brewing Guides** - Beginner guides only
  - ⭐ **START-HERE** - Quick start guide
- **Core folders only** (collapsed by default):
  - Views (for dashboard access)
  - Documentation
  - Scientific References (collapsed)
- **Hidden folders** (to reduce clutter):
  - Analytics (will unlock at 10+ brews)
  - Advanced references
  - Configuration files

#### Recent Files (Middle Section)
- Show **last 3 files** only
- Auto-update on file open
- Display with icons and timestamps
- Format: `☕ Coffee Log - Nov 6 (2 hours ago)`

#### Quick Actions (Bottom Section)
- **🎯 Log New Brew** → Quick Coffee Capture
- **📖 Start Here Guide** → START-HERE.md
- **🌱 My Dashboard** → Persona-NOVICE-Dashboard.md

**Configuration Settings**:
```json
{
  "file-explorer": {
    "sortOrder": "alphabetical",
    "showFolderCount": false,
    "collapseAllByDefault": true,
    "starred": [
      "Templates/Quick Coffee Capture",
      "Templates/Coffee-Log-v5",
      "Coffee Logs/",
      "Brewing Guides/",
      "START-HERE"
    ]
  },
  "recent-files": {
    "maxFiles": 3,
    "showTimestamp": true
  }
}
```

---

### 2. Main Pane (75% width)

**Purpose**: Focused, distraction-free content viewing and editing

**Default View**: Persona-NOVICE-Dashboard.md (on startup)

**Display Settings**:
- **Mode**: Markdown Preview (NOT source mode)
  - Hides syntax, shows rendered content
  - More beginner-friendly than raw markdown
  - Can toggle to edit mode with `Ctrl+E`
- **Font Size**: 16-18px (larger for readability)
- **Line Width**: Readable line length ON (max 45em)
- **Line Spacing**: 1.6 (comfortable reading)
- **Tabs**: Hidden by default (single document focus)
- **Splits**: Disabled (prevent accidental complexity)

**Behavior**:
- Opens dashboard on startup
- Single note at a time (no tabs unless user creates them)
- Preview mode by default
- Large click targets for links
- Smooth scrolling enabled

**Configuration**:
```json
{
  "main-pane": {
    "defaultMode": "preview",
    "fontSize": 17,
    "readableLineLength": true,
    "lineHeight": 1.6,
    "showTabs": false,
    "allowSplits": false,
    "startupFile": "Views/Persona-NOVICE-Dashboard.md"
  }
}
```

---

### 3. Right Sidebar (Hidden by Default)

**Purpose**: Occasional tools, revealed only when needed

**When to Reveal**:
- User explicitly clicks sidebar toggle
- Quick Capture template suggests revealing it
- Backlinks requested during learning

**Contents (when revealed)**:
- **Quick Capture Panel**: Templater sidebar for quick logging
- **Backlinks**: Shows related notes (helpful for connecting concepts)
- **Calendar** (optional): If Calendar plugin enabled

**Default State**: Collapsed/Hidden

**Configuration**:
```json
{
  "right-sidebar": {
    "defaultState": "collapsed",
    "showOnStartup": false,
    "panels": ["templater", "backlinks"],
    "calendarOptional": true
  }
}
```

---

## Plugin Configuration

### Required Plugins

#### 1. **Templater** (Essential)
**Purpose**: Quick Coffee Capture template automation

**Settings**:
- **Templates folder**: `/Templates`
- **Enable system commands**: Yes (for date/time)
- **Trigger on new file creation**: Yes
- **Syntax highlighting**: Disabled (hide complexity)
- **Show icon in ribbon**: Yes (quick access)

**Template shortcuts for novices**:
- `Ctrl+Shift+T` → Open template picker
- Quick Coffee Capture appears first

**Configuration**:
```json
{
  "templater": {
    "templatesFolder": "Templates",
    "enableSystemCommands": true,
    "triggerOnFileCreation": true,
    "syntaxHighlighting": false,
    "hotkeys": {
      "insertTemplate": "Ctrl+Shift+T"
    }
  }
}
```

---

#### 2. **Datacore** (Essential for Queries)
**Purpose**: Powers dashboard queries (automatic coffee log summaries)

**Settings**:
- **Enable inline queries**: Yes
- **Auto-refresh**: Every 30 seconds
- **Show query syntax**: No (hide from novices)
- **Query timeout**: 5 seconds

**User doesn't need to write queries**—they're pre-built in dashboard.

**Configuration**:
```json
{
  "datacore": {
    "enableInlineQueries": true,
    "autoRefresh": 30,
    "showQuerySource": false,
    "queryTimeout": 5000
  }
}
```

---

#### 3. **Calendar** (Optional)
**Purpose**: Visual logging by date (helpful for daily consistency)

**Settings**:
- **Week starts on**: Sunday (or user preference)
- **Show dots on days with logs**: Yes
- **Dot color**: Coffee brown (#5D4037)
- **Location**: Right sidebar (when revealed)

**Benefits for novices**:
- Visual streak tracking
- Date-based navigation
- Encourages daily habits

**Configuration**:
```json
{
  "calendar": {
    "weekStart": "sunday",
    "showDots": true,
    "dotColor": "#5D4037",
    "location": "right-sidebar"
  }
}
```

---

### Plugins to DISABLE or Hide

**Goal**: Reduce complexity for beginners

**Disable These**:
- **Graph View**: Too abstract for novices (re-enable at 20+ brews)
- **Slides**: Not needed
- **Publish**: Advanced feature
- **Daily Notes**: Can confuse coffee logging workflow
- **Advanced Tables**: Not needed yet

**Configuration**:
```json
{
  "disabledPlugins": [
    "graph",
    "slides",
    "publish",
    "daily-notes",
    "advanced-tables"
  ]
}
```

---

## Recommended Hotkeys

**Philosophy**: Keep it simple, focus on essentials

### Core Hotkeys

| Hotkey | Action | Why It Matters |
|--------|--------|----------------|
| `Ctrl+N` | New note from template | Quick logging |
| `Ctrl+E` | Toggle edit/preview mode | Switch to editing |
| `Ctrl+P` | Quick switcher (find files) | Fast navigation |
| `Ctrl+,` | Open settings | Get help |
| `Ctrl+H` | Toggle left sidebar | More screen space |
| `Ctrl+Shift+T` | Insert template | Quick Coffee Capture |

### Avoid These (Don't Teach Yet)

- Graph view toggles
- Split pane commands
- Workspace switchers
- Plugin developer tools

**Custom Hotkeys to Add**:
```json
{
  "hotkeys": {
    "templater:insert-template": "Ctrl+Shift+T",
    "editor:toggle-mode": "Ctrl+E",
    "app:go-to-previous": "Alt+Left",
    "app:go-to-next": "Alt+Right",
    "app:toggle-left-sidebar": "Ctrl+H"
  }
}
```

---

## Theme & Appearance

### Visual Settings

**Goal**: Comfortable, readable, inviting interface

#### Typography
- **Font family**: System default (Segoe UI, San Francisco, etc.)
- **Base font size**: 16-18px (larger than default 14px)
- **Line height**: 1.6 (breathing room)
- **Monospace font**: For code blocks (minimal use)

#### Colors (Coffee Vault CSS)
- **Primary**: Coffee brown (#5D4037)
- **Accent**: Warm orange (#FF6F00)
- **Background**: Soft off-white (#FAFAFA)
- **Text**: Dark gray (#212121)
- **Success**: Green (#4CAF50) for achievements

#### Layout
- **Readable line length**: ON (max 45em or ~650px)
- **Larger click targets**: 44px minimum (easy clicking)
- **Comfortable spacing**: 16-24px padding on cards
- **No dense mode**: Use default spacing

#### Effects
- **Smooth animations**: 200ms transitions (polished feel)
- **Hover states**: Subtle color shifts
- **Focus indicators**: Visible blue outline (accessibility)

### CSS Snippet (Coffee Vault Novice Theme)

```css
/* Novice-friendly appearance tweaks */
.markdown-preview-view {
  font-size: 17px;
  line-height: 1.6;
  max-width: 45em;
  padding: 2rem;
}

.markdown-preview-view h1 {
  font-size: 32px;
  color: var(--coffee-primary);
  margin-top: 2rem;
}

.markdown-preview-view h2 {
  font-size: 24px;
  margin-top: 1.5rem;
}

/* Larger buttons for easy clicking */
button, .clickable-icon {
  min-height: 44px;
  min-width: 44px;
}

/* Hide complexity */
.graph-view-container { display: none; }
.frontmatter-container { opacity: 0.3; } /* De-emphasize YAML */
```

**Configuration**:
```json
{
  "appearance": {
    "baseFontSize": 17,
    "theme": "coffee-vault-novice",
    "cssSnippets": ["novice-friendly.css"],
    "readableLineLength": true,
    "nativeMenus": false,
    "showInlineTitle": true
  }
}
```

---

## Startup Behavior

### On Obsidian Launch

**What Opens**:
1. **Persona-NOVICE-Dashboard.md** in main pane (preview mode)
2. Left sidebar visible with Favorites expanded
3. Right sidebar hidden
4. No extra tabs or panes

**Benefits**:
- Immediate orientation (dashboard welcomes user)
- Clear "what's next" guidance
- No decision paralysis
- Familiar starting point every time

**Configuration**:
```json
{
  "startup": {
    "openFile": "Views/Persona-NOVICE-Dashboard.md",
    "openMode": "preview",
    "leftSidebar": "visible",
    "rightSidebar": "hidden",
    "restoreTabs": false,
    "maxRecentFiles": 3
  }
}
```

### Session Management

**Recent Files**:
- Show last 3 files only (prevent clutter)
- Don't auto-restore 10+ tabs from last session
- Fresh start each time (reduces confusion)

**Focus Mode**:
- Default: OFF (sidebars visible for guidance)
- User can toggle with `F11` if desired
- Not recommended for novices (hides navigation)

---

## Setup Instructions

### Prerequisites

Before setting up the Novice workspace, ensure:

- [ ] Obsidian installed (version 1.4.0+)
- [ ] Coffee Vault loaded as active vault
- [ ] Basic familiarity with Obsidian (5-minute intro)

### Required Plugins

Install these community plugins:

1. **Templater** (by SilentVoid13)
   - Open Settings → Community Plugins → Browse
   - Search "Templater"
   - Install and Enable

2. **Datacore** (by Zachatoo)
   - Search "Datacore"
   - Install and Enable

3. **Calendar** (Optional, by Liam Cain)
   - Search "Calendar"
   - Install and Enable

### Step-by-Step Setup

#### Step 1: Install Required Plugins

1. Open Obsidian Settings (`Ctrl+,`)
2. Navigate to **Community Plugins**
3. Click **Browse** and install:
   - Templater
   - Datacore
   - Calendar (optional)
4. Enable each plugin after installation

---

#### Step 2: Configure Templater

1. Open Settings → Templater
2. Set **Template folder location**: `Templates`
3. Enable **Trigger Templater on new file creation**
4. Enable **Automatic jump to cursor**
5. Disable **Syntax highlighting** (reduce complexity)
6. Click **Save**

**Screenshot description**: *Settings panel showing Templater configuration with Templates folder set and relevant options enabled.*

---

#### Step 3: Configure Datacore

1. Open Settings → Datacore
2. Enable **Inline Queries**
3. Set **Auto-refresh interval**: 30 seconds
4. Disable **Show query source** (hide complexity)
5. Click **Save**

---

#### Step 4: Disable Graph View and Advanced Features

1. Open Settings → Core Plugins
2. **Disable** these plugins:
   - Graph View
   - Slides
   - Publish
   - Daily Notes (if conflicts with coffee logging)
3. Leave enabled:
   - File Explorer
   - Search
   - Quick Switcher
   - Command Palette
   - Settings

---

#### Step 5: Configure Appearance

1. Open Settings → Appearance
2. Set **Base font size**: 17
3. Enable **Readable line length**
4. Set **Theme**: Coffee Vault (if available) or Default
5. Under **CSS Snippets**, enable `novice-friendly.css` (if created)

---

#### Step 6: Set Hotkeys

1. Open Settings → Hotkeys
2. Search for and set:
   - **Templater: Insert Template** → `Ctrl+Shift+T`
   - **Toggle edit/preview mode** → `Ctrl+E`
   - **Toggle left sidebar** → `Ctrl+H`
3. Click **Save**

---

#### Step 7: Configure Startup Behavior

1. Open Settings → General
2. **Files & Links** section:
   - Set **Default location for new notes**: `Coffee Logs`
   - Enable **Use [[Wikilinks]]**
   - Disable **Detect all file extensions**
3. **Behavior** section:
   - Disable **Always update internal links**
   - Enable **Confirm file deletion**
4. Set **Default view for new tabs**: Preview

---

#### Step 8: Set Startup File

1. Open Settings → Core Plugins → Workspaces
2. If Workspaces plugin exists:
   - Enable it
   - Create new workspace: "Novice"
   - Open `Views/Persona-NOVICE-Dashboard.md`
   - Save workspace layout
3. Alternative (if no Workspaces plugin):
   - Manually open dashboard each time
   - Pin it as favorite

---

#### Step 9: Organize Sidebar

1. In File Explorer:
   - Right-click **Templates** folder → Star/Favorite
   - Right-click **Coffee Logs** folder → Star/Favorite
   - Right-click **Brewing Guides** folder → Star/Favorite
   - Right-click **START-HERE.md** → Star/Favorite
2. Collapse all other folders
3. Drag favorites to top of sidebar

---

#### Step 10: Test the Workspace

1. Close and reopen Obsidian
2. Verify:
   - [ ] Dashboard opens automatically
   - [ ] Left sidebar shows favorites
   - [ ] Right sidebar is hidden
   - [ ] Preview mode is active (not edit mode)
   - [ ] Font is comfortable to read (17px)
   - [ ] No graph view visible
3. Test Quick Coffee Capture:
   - Press `Ctrl+Shift+T`
   - Select "Quick Coffee Capture"
   - Verify template loads correctly

---

### Troubleshooting Common Issues

#### Dashboard doesn't open on startup
**Solution**:
- Manually open `Views/Persona-NOVICE-Dashboard.md`
- Star/favorite it
- If using Workspaces plugin, re-save workspace layout

#### Templater not working
**Solution**:
- Verify plugin is enabled (Settings → Community Plugins)
- Check Templates folder path is correct: `Templates`
- Try restarting Obsidian
- Check template files exist in Templates folder

#### Datacore queries not showing data
**Solution**:
- Ensure coffee logs have proper YAML frontmatter (`type: coffee-log`)
- Check logs are in `Coffee Logs` folder
- Wait 30 seconds for auto-refresh
- Manually refresh: `Ctrl+R`

#### Font too small or too large
**Solution**:
- Settings → Appearance → Base font size
- Adjust to 15-19px range
- Preview changes live

#### Right sidebar keeps appearing
**Solution**:
- Close it manually: Click X or press `Ctrl+Shift+H`
- Settings → Core Plugins → disable unwanted sidebar plugins
- Save workspace layout with sidebar hidden

#### Graph view showing
**Solution**:
- Settings → Core Plugins → Disable "Graph View"
- Remove graph view icon from ribbon
- Restart Obsidian

---

## Advanced Features (When Ready)

### Graduating to Enthusiast Level

**After 20+ brews**, consider:

1. **Enable Graph View**: See connections between notes
2. **Use tabs**: Open multiple notes simultaneously
3. **Explore Analytics**: Monthly Analytics Dashboard unlocks
4. **Advanced Templates**: Switch from Quick Capture to full Coffee-Log-v5
5. **Goal Setting**: Create your first Coffee Goal

**Migration guide**: [[Persona-ENTHUSIAST|Enthusiast Dashboard]]

---

### Optional Enhancements

#### Enable Calendar Streaks
1. Install Calendar plugin
2. View in right sidebar
3. Track daily logging consistency

#### Add Custom CSS
1. Create custom CSS snippet for personal preferences
2. Settings → Appearance → CSS Snippets

#### Explore Brewing Guides
1. Navigate to `Brewing Guides` folder
2. Read beginner-friendly guides:
   - French Press Guide
   - V60 Pour-Over Guide
   - AeroPress Guide

---

## Troubleshooting

### Common Issues and Solutions

#### Q: I can't find the Templates folder
**A**:
- Check File Explorer (left sidebar)
- If not visible, enable Settings → Files & Links → Show hidden folders
- Verify Coffee Vault is fully downloaded

---

#### Q: Dashboard shows empty queries (no data)
**A**:
- You need at least 1 coffee log for data to appear
- Create your first log: `Ctrl+Shift+T` → Quick Coffee Capture
- Queries will populate after first log is saved

---

#### Q: How do I create a new coffee log?
**A**:
1. Press `Ctrl+Shift+T` (Insert Template)
2. Select "Quick Coffee Capture" or "Coffee-Log-v5"
3. Fill in the fields
4. Save (`Ctrl+S`)

---

#### Q: The layout looks different than the diagram
**A**:
- Close right sidebar if open
- Reset sidebar widths: Drag divider to ~25% left, 75% main
- Close any extra tabs or split panes
- Restart Obsidian

---

#### Q: Where are my coffee logs saved?
**A**:
- Default location: `Coffee Logs` folder
- Check Settings → Files & Links → Default location for new notes
- You can move logs manually to this folder if saved elsewhere

---

#### Q: Preview mode doesn't show my edits
**A**:
- Switch to edit mode: `Ctrl+E`
- Make changes
- Switch back to preview: `Ctrl+E` again
- Changes save automatically

---

#### Q: I want to see more advanced features
**A**:
- You're ready to graduate! See [[Persona-ENTHUSIAST|Enthusiast Dashboard]]
- Enable Graph View: Settings → Core Plugins → Graph View
- Explore Analytics folder (after 10+ brews)

---

## ⚡ Quality of Life Features (v7.0)

Coffee Vault 7.0 introduces several quality-of-life enhancements designed to make your daily workflows faster, smoother, and more enjoyable.

### Floating Action Bar

**What it is**: A sticky action button in the bottom-right corner that expands to show quick actions.

**How to use**:
- Click the coffee icon (☕) in bottom-right corner
- Press `Shift + Space` anywhere to toggle menu
- Select action from expanded menu

**Available actions**:
- ☕ New Coffee Log (Quick Capture)
- 🔍 Search Vault
- 🕐 Recent Files (last 10)
- 🏠 Jump to Dashboard
- 📊 View Progress

**Why you'll love it**: One-click access to common tasks without navigating menus or remembering complex shortcuts.

---

### Recent Items Sidebar

**What it is**: A sidebar showing your last 10 viewed files with pin/favorite capability.

**How to access**:
- Click the recent items icon in top-right
- Files auto-update as you browse
- Pin favorites to keep them at the top

**Benefits**:
- Quick return to recently logged brews
- Pin your "current bean" profile for easy reference
- Persists across sessions (no need to search)

---

### Keyboard Shortcuts

**Essential shortcuts for novices**:

| Shortcut | Action | When to Use |
|----------|--------|-------------|
| `Cmd/Ctrl + O` | Quick switcher | Find any note fast |
| `Cmd/Ctrl + Shift + L` | New coffee log | Log a brew quickly |
| `Shift + Space` | Quick actions menu | Access common actions |
| `Cmd/Ctrl + F` | Search in file | Find text in current log |
| `?` | Show shortcuts | View all shortcuts |

**Full reference**: See [[KEYBOARD-SHORTCUTS|Complete Keyboard Shortcuts Guide]]

---

### Template Variants

Choose the logging level that fits your time and detail needs:

**Quick (1 minute)** - [[Coffee-Log-Quick|Coffee-Log-Quick.md]]
- 5 essential fields only
- Perfect for daily logging
- Best for: Building consistency

**Standard (3-5 minutes)** - [[Coffee-Log-Standard|Coffee-Log-Standard.md]]
- 12 balanced fields
- Recommended for most users
- Best for: Tracking progress

**Detailed (10+ minutes)** - [[Coffee-Log-Detailed|Coffee-Log-Detailed.md]]
- 25+ comprehensive fields
- Competition-level tracking
- Best for: Special sessions (unlock at 20+ brews)

**Pro tip**: Start with Quick, graduate to Standard as you build the habit.

---

### Enhanced Search

**Search tips for beginners**:

**Basic search**:
```
ethiopian
```
→ Find all notes mentioning "ethiopian"

**Exact phrase**:
```
"pour over"
```
→ Find exact phrase "pour over"

**Filter by rating**:
```
[rating:5]
```
→ Find your 5-star brews

**Combine filters**:
```
ethiopian [rating:>4]
```
→ Find high-rated Ethiopian coffees

**Full search guide**: [[SEARCH-TIPS|Search Tips & Tricks]]

---

### Dashboard Quick Actions

Every persona dashboard now includes quick action buttons at the top:
- ☕ **Log Coffee** - One-click to appropriate template
- 🔍 **Search Vault** - Instant search access
- 📚 **Brewing Guides** - Jump to learning resources
- 🏠 **Home Dashboard** - Return to main hub

Look for the colorful buttons at the top of your [[Persona-NOVICE|Novice Dashboard]].

---

### CSS Polish & Visual Enhancements

Coffee Vault 7.0 includes visual polish for a smoother experience:

**Loading states**: See skeleton screens while data loads (no more blank screens)

**Toast notifications**: Friendly popups confirm actions (e.g., "Brew logged successfully!")

**Smooth transitions**: Page changes and animations feel more polished

**Better search highlighting**: Search results stand out with orange highlights

**Progress bars**: Visual indicators for achievements and milestones

**How to enable**:
1. Settings → Appearance → CSS Snippets
2. Enable `coffee-vault-design-system-v6.css`
3. Enable `floating-actions.css`
4. Restart Obsidian to see changes

---

### Mobile Optimization

All QoL features work on mobile:
- **Larger touch targets**: 64px buttons for easy tapping
- **Responsive layouts**: Stack vertically on small screens
- **Swipe-friendly**: Recent items sidebar slides in smoothly
- **Touch-optimized FAB**: Floating action bar sized for thumbs

---

### Accessibility Enhancements

v7.0 prioritizes accessibility:
- **Keyboard navigation**: Everything accessible without mouse
- **Screen reader support**: Proper labels and ARIA attributes
- **Focus indicators**: Clear visual focus for keyboard users
- **Reduced motion**: Respects system accessibility settings
- **High contrast**: Better visibility in all lighting

---

### Getting Started with QoL Features

**Week 1**: Learn keyboard shortcuts
- Practice `Cmd/Ctrl + O` for quick switcher
- Try `Shift + Space` for quick actions
- Bookmark [[KEYBOARD-SHORTCUTS|Shortcuts Guide]]

**Week 2**: Explore template variants
- Try Quick template for daily logs
- Use Standard for special sessions
- Compare which feels better

**Week 3**: Master search
- Practice basic searches
- Try property filters like `[rating:5]`
- Read [[SEARCH-TIPS|Search Tips]]

**Week 4**: Customize your workflow
- Pin frequently-used files in Recent Items
- Set up custom keyboard shortcuts
- Adjust CSS to your preferences

---

## Related Resources

### Essential Starting Points

- **[[START-HERE|Start Here Guide]]** - Complete beginner walkthrough
- **[[Persona-NOVICE|Novice Dashboard]]** - Your personalized home
- **[[Quick Coffee Capture|Quick Coffee Capture]]** - Simplest logging template
- **[[Coffee-Log-v5|Standard Coffee Log]]** - Full logging template

### Learning Resources

- **[[Brewing Guide|All Brewing Guides]]** - Step-by-step instructions
- **[[Scientific References/Extraction Science/Coffee-Brewing-Control-Chart|Brewing Control Chart]]** - Visual extraction guide
- **[[GLOSSARY|Coffee Glossary]]** - Common terms explained
- **[[Documentation/Beginner-Equipment-Guide|Equipment Guide]]** - What to buy first

### Configuration Help

- **[[User-Configuration-Guide|User Configuration Guide]]** - Detailed settings help
- **[[Configuration/Plugin-Setup|Plugin Setup Guide]]** - Plugin configuration
- **[[HOME-DASHBOARD|Main Dashboard]]** - Coffee Vault home

### Next Steps

- **[[Persona-ENTHUSIAST|Enthusiast Dashboard]]** - When you're ready (20+ brews)
- **[[Coffee Goal|Coffee Goals]]** - Set structured learning goals
- **[[1-Monthly-Analytics-Dashboard|Monthly Analytics]]** - Unlocks at 10 brews

---

## Workspace Philosophy Summary

**The Novice Workspace removes barriers to entry.**

By hiding complexity, emphasizing essentials, and providing gentle guidance at every step, this workspace helps beginners:
- Build confidence through early wins
- Develop consistent logging habits
- Learn fundamentals without overwhelm
- Progress naturally to advanced features

**Remember**: Every expert was once a beginner. This workspace meets you where you are and grows with you.

---

**Version**: 6.0.0 - Novice Workspace Configuration
**Last Updated**: 2025-11-06
**Target Persona**: Novice Brewer (0-20 brews)
**Design Philosophy**: Simplicity, Guidance, Encouragement, Focus

**Questions?** See [[User-Configuration-Guide|Configuration Help]] or [[START-HERE|Start Here]]
