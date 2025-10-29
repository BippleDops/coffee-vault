---
type: reference
tags: [tracker, visualization, charts, reference]
---

# 📈 Tracker Visualization Examples

**Copy-paste tracker configurations for your coffee data**

This guide provides ready-to-use Tracker plugin configurations to visualize your coffee journey. Simply copy the code blocks into any note!

---

## 📋 Tracker Basics

### How Tracker Works

1. **Insert code block** with tracker configurations
2. **Preview mode** renders the visualization
3. **Auto-updates** when you add new data
4. **Export** visualizations as images if needed

### Basic Syntax

````markdown
```tracker
searchType: frontmatter | yaml | text
searchTarget: property-name
folder: Folder Path
[visualization type]:
    [parameters]
```
````

---

## 📅 Calendar Visualizations

### Coffee Consumption Calendar (GitHub-Style)

````markdown
```tracker
searchType: frontmatter
searchTarget: cups-brewed
folder: Coffee Logs
month:
    mode: circle
    threshold: 2
    color: saddlebrown
    showCircle: true
    dimNotInMonth: false
```
````

**Shows**: Daily coffee consumption as circles  
**Color Intensity**: Darker = more cups  
**Use Case**: Track drinking habits over time

### Rating Calendar

````markdown
```tracker
searchType: frontmatter
searchTarget: rating
folder: Coffee Logs
month:
    mode: circle
    threshold: 4.0
    color: orange
    showCircle: true
    dimNotInMonth: true
```
````

**Shows**: Daily ratings (highlights 4+ star days)  
**Use Case**: See when you had great coffee

### Brewing Frequency Calendar

````markdown
```tracker
searchType: frontmatter
searchTarget: date
folder: Coffee Logs
month:
    mode: annotation
    color: brown
    dimNotInMonth: false
```
````

**Shows**: Which days you logged coffee  
**Use Case**: Track consistency of logging

---

## 📊 Line Charts

### Rating Trend Over Time

````markdown
```tracker
searchType: frontmatter
searchTarget: rating
folder: Coffee Logs
startDate: 2025-01-01
endDate: 2025-12-31
line:
    title: Coffee Rating Trends
    yAxisLabel: Rating (1-5)
    yMin: 0
    yMax: 5
    lineColor: orange
    showLegend: true
    showPoint: true
```
````

**Shows**: How ratings change over time  
**Use Case**: See if palate is improving

### Daily Consumption Trend

````markdown
```tracker
searchType: frontmatter
searchTarget: cups-brewed
folder: Coffee Logs
line:
    title: Daily Coffee Consumption
    yAxisLabel: Cups
    yMin: 0
    yMax: 6
    lineColor: saddlebrown
    fillGap: true
    showLegend: false
```
````

**Shows**: Cups consumed per day  
**Use Case**: Monitor caffeine intake

### Moving Average Rating

````markdown
```tracker
searchType: frontmatter
searchTarget: rating
folder: Coffee Logs
line:
    title: 7-Day Average Rating
    yAxisLabel: Avg Rating
    yMin: 0
    yMax: 5
    lineColor: '#FF6B35'
    showLegend: true
    smooth: true
```
````

**Shows**: Smoothed rating trends  
**Use Case**: See overall quality patterns

---

## 📊 Bar Charts

### Brew Methods Used (Monthly)

````markdown
```tracker
searchType: yaml
searchTarget: brew-method
folder: Coffee Logs
startDate: 2025-10-01
endDate: 2025-10-31
bar:
    title: Brewing Methods This Month
    xAxisLabel: Method
    yAxisLabel: Sessions
    orientation: vertical
```
````

**Shows**: Bar chart of method frequency  
**Use Case**: See which methods you use most

### Origins Tried (Horizontal Bars)

````markdown
```tracker
searchType: yaml
searchTarget: origin
folder: Coffee Logs
bar:
    title: Coffee Origins Tried
    xAxisLabel: Sessions
    yAxisLabel: Origin
    orientation: horizontal
```
````

**Shows**: Which origins you log most  
**Use Case**: Identify favorite regions

---

## 🥧 Pie Charts

### Brew Method Distribution

````markdown
```tracker
searchType: yaml
searchTarget: brew-method
folder: Coffee Logs
pie:
    title: Brewing Methods Distribution
    data: brew-method
    colors: ['#8B4513', '#A0522D', '#D2691E', '#CD853F', '#DEB887']
    showLegend: true
    showLabel: true
```
````

**Shows**: Percentage of each method used  
**Use Case**: Visual distribution of techniques

### Origin Distribution

````markdown
```tracker
searchType: yaml
searchTarget: origin
folder: Coffee Logs
pie:
    title: Coffee Origins
    data: origin
    colors: ['#6F4E37', '#A0522D', '#8B4513', '#D2691E', '#CD853F']
    showLegend: true
```
````

**Shows**: Proportion of each origin  
**Use Case**: See geographic preferences

### Roaster Distribution

````markdown
```tracker
searchType: yaml
searchTarget: roaster
folder: Coffee Logs
pie:
    title: Roasters Used
    data: roaster
    showLegend: true
    showLabel: false
```
````

**Shows**: Which roasters you buy from most  
**Use Case**: Identify go-to roasters

---

## 📊 Summary Statistics

### Monthly Summary Box

````markdown
```tracker
searchType: frontmatter
searchTarget: rating
folder: Coffee Logs
startDate: 2025-10-01
endDate: 2025-10-31
summary:
    template: "Logged {{sum()}} sessions with average rating of {{average()}} stars"
    style: "color: brown; font-size: 18px; font-weight: bold;"
```
````

**Shows**: Text summary with calculations  
**Use Case**: Quick monthly overview

### Year-to-Date Stats

````markdown
```tracker
searchType: frontmatter
searchTarget: cups-brewed
folder: Coffee Logs
startDate: 2025-01-01
summary:
    template: "☕ {{sum()}} cups in {{numTargets()}} sessions | Avg: {{average()}} cups/session"
    style: "font-size: 16px; padding: 10px; background: #f9f9f9; border-left: 4px solid #8B4513;"
```
````

**Shows**: Total consumption stats  
**Use Case**: Year-end summaries

---

## 🎯 Advanced Configurations

### Multi-Line Comparison

````markdown
```tracker
searchType: frontmatter
searchTarget: rating
folder: Coffee Logs
line:
    title: Rating by Brew Method
    yAxisLabel: Rating
    yMin: 0
    yMax: 5
    lineColor: orange
    showLegend: true
    separateDataPoints: true
```
````

**Shows**: Multiple lines (one per method)  
**Use Case**: Compare method performance

### Stacked Area Chart

````markdown
```tracker
searchType: frontmatter
searchTarget: cups-brewed
folder: Coffee Logs
area:
    title: Cumulative Consumption
    yAxisLabel: Total Cups
    fillGap: true
    startDate: 2025-01-01
```
````

**Shows**: Cumulative consumption over time  
**Use Case**: See total growth

### Bullet Graph (Goals)

````markdown
```tracker
searchType: frontmatter
searchTarget: rating
folder: Coffee Logs
bullet:
    title: Rating Goal Progress
    dataset: 0
    min: 0
    max: 5
    value: {{average()}}
    range1: 3
    range2: 4
    range3: 5
```
````

**Shows**: Progress toward rating goals  
**Use Case**: Track quality improvement

---

## 🎨 Customization Tips

### Colors

Common coffee-themed colors:
- `saddlebrown` / `#8B4513` - Coffee brown
- `#A0522D` - Medium roast
- `#D2691E` - Light roast
- `#CD853F` - Tan/latte
- `orange` / `#FF6B35` - Bright accent
- `#6F4E37` - Dark roast

### Date Ranges

```markdown
startDate: 2025-01-01
endDate: 2025-12-31
```

Or relative dates:
```markdown
startDate: {{date-30d}}  # Last 30 days
```

### Threshold Values

```markdown
threshold: 4.0  # Highlight values above 4
```

### Annotation Mode

Add notes to calendar cells:
```markdown
mode: annotation
showAnnotation: true
```

---

## 📊 Complete Dashboard Example

Combine multiple trackers in one note:

````markdown
# Coffee Analytics Dashboard

## This Month Overview

```tracker
searchType: frontmatter
searchTarget: rating
folder: Coffee Logs
startDate: {{date-30d}}
summary:
    template: "📊 {{numTargets()}} sessions | ⭐ {{average()}} avg rating | ☕ {{max()}} best"
```

## Consumption Calendar

```tracker
searchType: frontmatter
searchTarget: cups-brewed
folder: Coffee Logs
month:
    mode: circle
    threshold: 2
    color: saddlebrown
```

## Rating Trend

```tracker
searchType: frontmatter
searchTarget: rating
folder: Coffee Logs
startDate: {{date-90d}}
line:
    title: 3-Month Rating Trend
    yAxisLabel: Rating
    yMin: 0
    yMax: 5
    lineColor: orange
```

## Brew Methods

```tracker
searchType: yaml
searchTarget: brew-method
folder: Coffee Logs
pie:
    title: Methods Used
    showLegend: true
```
````

---

## 🔍 Troubleshooting

### Tracker Not Rendering?

1. **Check Preview Mode**: Must be in Preview/Reading view
2. **Plugin Installed**: Settings → Community Plugins → Tracker
3. **Syntax Correct**: Check for typos in configuration
4. **Data Exists**: Need notes with matching properties

### No Data Showing?

1. **Check searchTarget**: Must match property name exactly
2. **Check folder**: Path must match your structure
3. **Check date range**: May be filtering everything out
4. **Check property values**: Need valid data (numbers for charts)

### Chart Looks Wrong?

1. **Check yMin/yMax**: Adjust scale to fit data
2. **Check colors**: Some color names may not work, use hex
3. **Check threshold**: May be highlighting wrong range
4. **Try different chart type**: Some data works better with different visualizations

---

## 📚 Tracker Functions

### Available Functions

- `{{sum()}}` - Total of all values
- `{{average()}}` - Mean of all values
- `{{maxStreak()}}` - Longest consecutive streak
- `{{max()}}` - Highest value
- `{{min()}}` - Lowest value
- `{{numTargets()}}` - Count of entries
- `{{lastValue()}}` - Most recent value

### Expression Examples

```markdown
template: "Average: {{average()}} / Max: {{max()}}"
template: "{{numTargets()}} coffees, {{sum()}} cups total"
template: "Best streak: {{maxStreak()}} days"
```

---

## 🎯 Use Case Examples

### Track Caffeine Intake

````markdown
```tracker
searchType: frontmatter
searchTarget: cups-brewed
folder: Coffee Logs
month:
    mode: circle
    threshold: 3
    color: red
    dimNotInMonth: false
```
````

**Purpose**: Monitor high-caffeine days (3+ cups)

### Quality Improvement Journey

````markdown
```tracker
searchType: frontmatter
searchTarget: rating
folder: Coffee Logs
line:
    title: Palate Development
    yAxisLabel: Average Rating
    yMin: 2
    yMax: 5
    lineColor: orange
    smooth: true
```
````

**Purpose**: See if ratings improve as palate develops

### Brewing Consistency

````markdown
```tracker
searchType: frontmatter
searchTarget: rating
folder: Coffee Logs
startDate: {{date-30d}}
bar:
    title: Rating Distribution (Last 30 Days)
    xAxisLabel: Rating
    yAxisLabel: Count
```
````

**Purpose**: See rating consistency

---

## 🔗 Resources

**Official Documentation**:
- [Tracker Plugin Documentation](https://github.com/pyrochlore/obsidian-tracker)
- [Tracker Examples Repository](https://github.com/pyrochlore/obsidian-tracker/blob/master/docs/Examples.md)

**Community Examples**:
- [Obsidian Forum - Tracker Showcase](https://forum.obsidian.md/)
- [r/ObsidianMD Tracker Posts](https://www.reddit.com/r/ObsidianMD/search?q=tracker)

**Video Tutorials**:
- [Nicole van der Hoeven - Tracker Plugin Tutorial](https://www.youtube.com/watch?v=wSZJSdFHuWU)
- [Obsidian Office Hours - Data Visualization](https://www.youtube.com/c/Obsidian)

---

## 💡 Pro Tips

1. **Start Simple**: Begin with calendar view, add complexity later
2. **Use Templates**: Save favorite configurations as snippets
3. **Combine Charts**: Multiple trackers in one note tell better stories
4. **Export Images**: Right-click charts to save as PNG
5. **Mobile-Friendly**: Calendar and simple line charts work best on mobile
6. **Performance**: Limit date ranges for faster rendering
7. **Experimentation**: Try different chart types for same data

---

**Last Updated**: 2025-10-24  
**Tracker Version**: 1.10.0+  
**Requires**: Tracker plugin installed and enabled  
**Related**: [[Dataview Queries Reference]], [[Plugin Installation Guide]]

