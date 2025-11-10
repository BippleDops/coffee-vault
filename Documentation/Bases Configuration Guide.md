---
type: guide
tags: [bases, database, configuration, tutorial]
---

# 📊 Bases Configuration Guide

**Create powerful database views with Obsidian's native Bases feature**

Bases is Obsidian's built-in database plugin (v1.9.0+) that transforms your notes into queryable, editable databases with no community plugins required!

**Prerequisites**: Obsidian v1.9.0+ (released May 2025)

---

## 🎯 What are Bases?

### Overview

Bases turns any collection of notes into a **database** with:
- ✅ Table and list views
- ✅ Inline editing (change properties without opening notes)
- ✅ Filtering and sorting
- ✅ Grouping by any property
- ✅ Formula-based calculated columns
- ✅ Aggregation (sum, average, count, min, max)
- ✅ Multiple views per folder

### Why Use Bases?

**Native Integration**: No plugins needed, built into Obsidian  
**Performance**: Fast, optimized for large vaults  
**Reliability**: Officially maintained by Obsidian team  
**Simplicity**: Visual interface, no code required  
**Power**: Formula system for calculations

---

## 🚀 Creating Your First Base

### Step 1: Open Command Palette

- **Mac**: Cmd + P
- **Windows/Linux**: Ctrl + P
- Or click Command Palette icon

### Step 2: Search for "Create new base"

Type: `create new base` and press Enter

### Step 3: Configure Source

Choose where data comes from:

**Option A: Folder-Based**
- Select `Coffee Logs/` folder
- Includes all notes in folder
- Auto-updates when you add notes

**Option B: Query-Based**
- Advanced: Use Dataview-like query
- Example: `FROM "Coffee Logs" WHERE rating >= 4`
- More control over filtering

**Recommendation**: Start with folder-based, it's simpler!

### Step 4: Add Columns

Click "+ Add Column" for each property you want to display:

**Essential Columns**:
- `date` - When you brewed
- `beans` - Coffee name
- `rating` - Your score
- `brew-method` - How you brewed
- `origin` - Country
- `roaster` - Who roasted it

**Optional Columns**:
- `cups-brewed` - Quantity
- `flavor-notes` - Tasting notes
- `would-rebuy` - Purchase again?

### Step 5: Configure Each Column

For each column:
- **Label**: Display name (e.g., "⭐ Rating")
- **Property**: Source property (e.g., `rating`)
- **Width**: Auto or custom
- **Alignment**: Left, center, right

### Step 6: Save Your Base

- Choose location: `Views/` folder recommended
- Name it: `All Coffee Logs.base`
- Click "Create"

**🎉 Your first base is created!**

---

## 📋 Recommended Base Views

### 1. All Coffee Logs (Master Database)

**Purpose**: Complete chronological record

**Configuration**:
- **Source**: `Coffee Logs/` folder
- **Columns**: date, beans, rating, brew-method, origin, roaster
- **Sort**: date (descending)
- **Name**: `Views/All Coffee Logs.base`

### 2. Top Rated Coffees

**Purpose**: Your best brews

**Configuration**:
- **Source**: Query: `FROM "Coffee Logs" WHERE rating >= 4.5`
- **Columns**: rating, beans, roaster, origin, date
- **Sort**: rating (descending), then date (descending)
- **Name**: `Views/Top Rated.base`

### 3. By Roaster (Grouped)

**Purpose**: Compare roaster performance

**Configuration**:
- **Source**: `Coffee Logs/` folder
- **Columns**: beans, rating, origin, date
- **Group By**: roaster
- **Sort**: rating (descending)
- **Name**: `Views/By Roaster.base`

### 4. By Origin (Grouped)

**Purpose**: Explore regional preferences

**Configuration**:
- **Source**: `Coffee Logs/` folder
- **Columns**: beans, roaster, rating, date
- **Group By**: origin
- **Sort**: rating (descending)
- **Name**: `Views/By Origin.base`

### 5. By Method (Grouped)

**Purpose**: Analyze brewing techniques

**Configuration**:
- **Source**: `Coffee Logs/` folder
- **Columns**: beans, rating, origin, date
- **Group By**: brew-method
- **Sort**: date (descending)
- **Name**: `Views/By Method.base`

### 6. This Month

**Purpose**: Current month activity

**Configuration**:
- **Source**: Query: `FROM "Coffee Logs" WHERE date >= date(today) - dur(30 days)`
- **Columns**: date, beans, rating, brew-method
- **Sort**: date (descending)
- **Name**: `Views/This Month.base`

### 7. Beans to Rebuy

**Purpose**: Shopping list

**Configuration**:
- **Source**: `Beans Library/` folder, Query: `WHERE would-rebuy = true AND status = "finished"`
- **Columns**: bean-name, roaster, origin, price
- **Sort**: purchase-date (descending)
- **Name**: `Views/Beans to Rebuy.base`

---

## 🔧 Advanced Features

### Grouping

**What it does**: Organizes rows by property value

**How to use**:
1. Open base view
2. Click "Group by" dropdown
3. Select property (e.g., "origin")
4. Rows organized into collapsible groups

**Use cases**:
- Group by origin → See all Ethiopian, Colombian, etc.
- Group by roaster → Compare roaster offerings
- Group by rating → Quality tiers (5-star, 4-star, etc.)
- Group by brew-method → Technique comparison

### Filtering

**What it does**: Show only matching rows

**How to use**:
1. Click column header
2. Select "Filter"
3. Choose condition:
   - Equals, not equals
   - Greater than, less than
   - Contains, doesn't contain
   - Is empty, is not empty

**Examples**:
- rating > 4 → Only good coffees
- origin = "Ethiopia" → Single country
- would-rebuy = true → Repurchase candidates
- brew-method contains "press" → French Press logs

### Sorting

**What it does**: Order rows by column value

**How to use**:
- Click column header once → Sort ascending (A-Z, 0-9, old-new)
- Click twice → Sort descending (Z-A, 9-0, new-old)
- Hold Shift + click → Multi-column sort

**Common sorts**:
- Date descending → Newest first
- Rating descending → Best first
- Beans ascending → Alphabetical

### Table Summaries

**What it does**: Calculate statistics

**How to use**:
1. Right-click column header
2. Select "Add summary"
3. Choose function:
   - **Sum** - Total (great for cups-brewed)
   - **Average** - Mean (perfect for rating)
   - **Count** - Number of entries
   - **Min/Max** - Range
   - **Custom formula** - Advanced calculations

**Examples**:
- cups-brewed column → Sum = total consumption
- rating column → Average = mean quality
- date column → Count = total sessions

---

## 📐 Formula System

### What are Formulas?

Formulas create **calculated columns** - values computed from other properties.

### Basic Formula Syntax

Formulas use JavaScript-like syntax:

**Access properties**:
- `file.name` - Note filename
- `date` - Date property
- `rating` - Rating property
- `property-name` - Any property (use quotes for spaces)

**Basic operations**:
- `+` `-` `*` `/` - Math
- `>` `<` `>=` `<=` `==` `!=` - Comparison
- `&&` `||` - Logical AND/OR
- `? :` - Conditional (ternary operator)

### Useful Formulas for Coffee Tracking

#### Days Since Brew

```javascript
(today() - date).days()
```

**Use**: See how old each log is

#### Quality Badge

```javascript
rating >= 4.5 ? "⭐ Excellent" : rating >= 3.5 ? "☕ Good" : "Fair"
```

**Use**: Visual quality indicators

#### Cost Per Cup (if tracking price)

```javascript
price / (cups-brewed > 0 ? cups-brewed : 1)
```

**Use**: Calculate value per cup

#### Average Rating by Roaster

```javascript
notes.filter(n => n.roaster == this.roaster).average(n => n.rating)
```

**Use**: Roaster performance score

#### Brewing Consistency

```javascript
abs(rating - 4.0) < 0.5 ? "Consistent" : "Variable"
```

**Use**: Identify reliable beans/methods

#### Days Until Stale (if tracking roast date)

```javascript
14 - (today() - roast-date).days()
```

**Use**: Freshness countdown

### Adding Formula Columns

1. In base view, click "+ Add column"
2. Select "Formula" as property type
3. Enter formula in formula field
4. Give column a label
5. Save

---

## 🎨 Customization Tips

### Column Display

**Rename Columns**:
- Use emoji: "⭐ Rating", "☕ Beans", "🌍 Origin"
- Keep short: "Method" instead of "Brewing Method"
- Be consistent across bases

**Column Widths**:
- Auto (default) - Adjusts to content
- Fixed - Set specific pixel width
- Flexible - Takes remaining space

**Alignment**:
- Numbers: Right-aligned (looks cleaner)
- Text: Left-aligned (standard)
- Ratings: Center-aligned (optional)

### Color Coding (via formula)

Use emoji for visual indicators:

**Rating badges**:
```javascript
rating == 5 ? "⭐⭐⭐⭐⭐" : 
rating == 4 ? "⭐⭐⭐⭐" : 
rating == 3 ? "⭐⭐⭐" : "⭐⭐"
```

**Status indicators**:
```javascript
status == "active" ? "🟢 Active" : "🔴 Finished"
```

### View Modes

**Table View** (default):
- Spreadsheet-like
- Best for desktop
- Sortable columns
- Group headers

**List View**:
- Simplified display
- Better for mobile
- Less cluttered
- Quick scanning

---

## 🔗 Linking Bases Together

### Dashboard with Multiple Bases

Create a note that embeds multiple base views:

```markdown
# Coffee Analytics Dashboard

## All Recent Logs

![[Coffee Log]]

## Top Performers

![[Views/Top Rated.base]]

## By Origin

![[Views/By Origin.base]]
```

### Quick Links to Bases

In any note:
```markdown
View in: [[Coffee Log|Full Database]] | [[Views/Top Rated.base|Top Rated]]
```

---

## ⚡ Performance Tips

### For Large Vaults (500+ Logs)

1. **Use queries instead of full folders**
   - Limits data loaded
   - Example: `FROM "Coffee Logs" WHERE date >= date(today) - dur(90 days)`

2. **Limit displayed columns**
   - Only show essential properties
   - Add more when needed

3. **Use pagination**
   - Bases automatically pages long tables
   - Configure page size in settings

4. **Archive old logs**
   - Move to `Coffee Logs/Archive/` folder
   - Create separate base for archives

### For Mobile

1. **Prefer List view over Table**
   - More readable on small screens
   - Less horizontal scrolling

2. **Fewer columns**
   - 3-4 columns max for mobile
   - Most important info only

3. **Larger touch targets**
   - Wider columns for easier tapping

---

## 🔍 Troubleshooting

### Base Not Showing Data

**Check**:
- ✅ Notes have frontmatter with properties
- ✅ Property names match exactly (case-sensitive)
- ✅ Source folder/query is correct
- ✅ Notes exist in specified location

### Formula Not Working

**Common Issues**:
- Property name has spaces → Use `["property-name"]`
- Accessing null value → Use `property ? property : 0`
- Syntax error → Check parentheses, quotes
- Wrong function → See formula reference

### Can't Edit in Base

**Editing requires**:
- Column is editable (not formula)
- Property exists in note frontmatter
- Note is not read-only

### Performance Slow

**Solutions**:
- Use query to limit scope
- Reduce number of columns
- Remove complex formulas
- Archive old data

---

## 📊 Example Base Configurations

### Copy-Paste Ready

#### All Coffee Logs Base

```
Source: Folder
Folder: Coffee Logs/
Columns:
  - date (Date, descending sort)
  - beans (Text)
  - rating (Number)
  - brew-method (Text)
  - origin (Text)
  - roaster (Link)
```

#### Top Rated Base

```
Source: Query
Query: FROM "Coffee Logs" WHERE rating >= 4.5
Columns:
  - rating (Number, descending sort)
  - beans (Text)
  - roaster (Link)
  - origin (Text)
  - date (Date)
```

#### Monthly Analysis Base

```
Source: Query
Query: FROM "Coffee Logs" WHERE date >= date(today) - dur(30 days)
Columns:
  - date (Date)
  - beans (Text)
  - rating (Number)
  - brew-method (Text)
Group By: brew-method
Summary: Average (rating column)
```

---

## 🎓 Advanced Use Cases

### Coffee Inventory Management

**Base**: Active beans with status tracking
- Show roast date, days since roast
- Formula: `(today() - roast-date).days()`
- Alert when beans getting old

### Roaster Performance Tracker

**Base**: Grouped by roaster with stats
- Average rating per roaster
- Total purchases
- Rebuy percentage

### Brewing Method Optimizer

**Base**: Method comparison with formulas
- Success rate (% of 4+ ratings)
- Average extraction time
- Cups per session

### Budget Tracker

**Base**: Cost analysis
- Total spent (sum price column)
- Cost per cup (formula)
- Value rating (price vs rating)

---

## 🔗 Resources

**Official Documentation**:
- [Obsidian Help - Bases](https://help.obsidian.md/Plugins/Bases)
- [Bases Formula Reference](https://help.obsidian.md/Plugins/Bases/Formula+reference)
- [Obsidian Forum - Bases Discussion](https://forum.obsidian.md/tag/bases)

**Video Tutorials**:
- [Obsidian Office Hours - Bases Intro](https://www.youtube.com/c/Obsidian)
- [Nicole van der Hoeven - Bases Walkthrough](https://www.youtube.com/c/nicolevdh)

**Related Guides**:
- [[Datacore Examples]] - Alternative query system
- [[Plugin Installation Guide]] - General setup
- [[Coffee Dashboard]] - Dashboard integration

---

## ✅ Quick Start Checklist

- [ ] Verify Obsidian v1.9.0+ (Settings → About)
- [ ] Create first base: `All Coffee Logs.base`
- [ ] Add 5-6 essential columns
- [ ] Try grouping by origin or roaster
- [ ] Add table summary (average rating)
- [ ] Create second base: `Top Rated.base`
- [ ] Experiment with formulas
- [ ] Embed in [[Coffee Dashboard]]

---

## 💡 Pro Tips

1. **Start Simple**: One base, essential columns only
2. **Iterate**: Add features as you understand them
3. **Templates**: Copy working bases, modify for new views
4. **Link**: Embed bases in dashboard notes
5. **Formula Library**: Save useful formulas for reuse
6. **Mobile**: Create separate mobile-optimized bases
7. **Backup**: Bases are just files - git or sync them
8. **Experiment**: Try different groupings and formulas

---

**Last Updated**: 2025-10-24  
**Obsidian Version**: v1.9.0+ required  
**Bases**: Native core plugin (no installation needed)

---

**Master your coffee data with Bases!** 📊☕

