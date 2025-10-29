---
type: reference
tags: [dataview, queries, reference, guide]
---

# 📊 Dataview Queries Reference Guide

**Quick reference for common coffee tracking queries**

This guide provides copy-paste ready Dataview queries for analyzing your coffee data. Customize them to your needs!

---

## 🎯 Query Basics

### Query Structure

```dataview
QUERY_TYPE field1, field2, field3
FROM "Folder Path" OR #tag
WHERE condition
SORT field ORDER
LIMIT number
```

### Query Types

- **TABLE**: Displays data in table format
- **LIST**: Bullet list of matching pages
- **TASK**: Shows tasks from notes
- **CALENDAR**: Calendar view of dated entries

### Common Operators

- `=` Equal to
- `!=` Not equal to
- `>` Greater than
- `<` Less than
- `>=` Greater than or equal
- `<=` Less than or equal
- `AND` Both conditions true
- `OR` Either condition true

---

## ☕ Coffee Log Queries

### All Coffee Logs (Basic)

```dataview
TABLE rating, beans, brew-method, date
FROM "Coffee Logs"
SORT date DESC
```

### Top Rated Coffees

```dataview
TABLE 
  beans as "☕ Beans",
  roaster as "Roaster",
  rating as "⭐",
  date as "Date"
FROM "Coffee Logs"
WHERE rating >= 4.5
SORT rating DESC, date DESC
LIMIT 10
```

### Recent Sessions (Last 7 Days)

```dataview
TABLE 
  beans,
  rating,
  brew-method,
  date
FROM "Coffee Logs"
WHERE date >= date(today) - dur(7 days)
SORT date DESC
```

### This Month's Logs

```dataview
TABLE beans, rating, brew-method, date
FROM "Coffee Logs"
WHERE date.month = date(today).month AND date.year = date(today).year
SORT date DESC
```

### Logs by Specific Date

```dataview
TABLE beans, rating, brew-method, time
FROM "Coffee Logs"
WHERE date = date("2025-10-24")
SORT time ASC
```

---

## 📈 Statistical Queries

### Average Rating Overall

```dataview
TABLE WITHOUT ID
  round(average(rows.rating), 2) as "Average Rating",
  length(rows) as "Total Sessions"
FROM "Coffee Logs"
WHERE rating > 0
```

### Total Cups Consumed

```dataview
TABLE WITHOUT ID
  sum(rows.cups-brewed) as "Total Cups",
  length(rows) as "Sessions"
FROM "Coffee Logs"
```

### Monthly Statistics

```dataview
TABLE 
  length(rows) as "Sessions",
  sum(rows.cups-brewed) as "Cups",
  round(average(rows.rating), 2) as "Avg ⭐"
FROM "Coffee Logs"
WHERE date >= date(today) - dur(30 days)
```

### This Year's Summary

```dataview
TABLE WITHOUT ID
  date.year as "Year",
  length(rows) as "Total Logs",
  sum(rows.cups-brewed) as "Total Cups",
  round(average(rows.rating), 2) as "Avg Rating"
FROM "Coffee Logs"
WHERE date.year = date(today).year
```

---

## 🌍 Origin-Based Queries

### All Logs by Origin

```dataview
TABLE 
  beans,
  roaster,
  rating,
  date
FROM "Coffee Logs"
WHERE origin = "Ethiopia"
SORT rating DESC
```

### Average Rating by Origin

```dataview
TABLE 
  length(rows) as "Sessions",
  round(average(rows.rating), 2) as "Avg ⭐",
  min(rows.rating) as "Low",
  max(rows.rating) as "High"
FROM "Coffee Logs"
WHERE origin
GROUP BY origin
SORT round(average(rows.rating), 2) DESC
```

### Origin Distribution

```dataview
TABLE 
  length(rows) as "Count",
  round(length(rows) * 100.0 / length(this.file.inlinks), 1) + "%" as "Percentage"
FROM "Coffee Logs"
WHERE origin
GROUP BY origin
SORT length(rows) DESC
```

### Compare Two Origins

```dataview
TABLE 
  round(average(rows.rating), 2) as "Avg Rating",
  length(rows) as "Sessions"
FROM "Coffee Logs"
WHERE origin = "Ethiopia" OR origin = "Colombia"
GROUP BY origin
```

---

## ☕ Roaster-Based Queries

### All Logs from Specific Roaster

```dataview
TABLE 
  beans,
  rating,
  brew-method,
  date
FROM "Coffee Logs"
WHERE contains(roaster, "Blue Bottle")
SORT date DESC
```

### Average Rating by Roaster

```dataview
TABLE 
  length(rows) as "Sessions",
  round(average(rows.rating), 2) as "Avg ⭐",
  min(rows.rating) as "Low",
  max(rows.rating) as "High"
FROM "Coffee Logs"
WHERE roaster
GROUP BY roaster
SORT round(average(rows.rating), 2) DESC
```

### Most-Used Roasters

```dataview
TABLE 
  length(rows) as "Times Purchased"
FROM "Coffee Logs"
GROUP BY roaster
SORT length(rows) DESC
LIMIT 10
```

---

## 🔧 Brew Method Analysis

### Logs by Brew Method

```dataview
TABLE 
  beans,
  rating,
  date
FROM "Coffee Logs"
WHERE brew-method = "pour-over"
SORT rating DESC
```

### Average Rating by Brew Method

```dataview
TABLE 
  length(rows) as "Times Used",
  round(average(rows.rating), 2) as "Avg ⭐"
FROM "Coffee Logs"
WHERE brew-method
GROUP BY brew-method
SORT round(average(rows.rating), 2) DESC
```

### Most-Used Brew Methods

```dataview
TABLE 
  length(rows) as "Sessions",
  round(average(rows.rating), 2) as "Avg Rating"
FROM "Coffee Logs"
GROUP BY brew-method
SORT length(rows) DESC
```

### Method Usage This Month

```dataview
TABLE 
  length(rows) as "Times Used"
FROM "Coffee Logs"
WHERE date >= date(today) - dur(30 days)
GROUP BY brew-method
SORT length(rows) DESC
```

---

## 🫘 Bean Library Queries

### All Active Beans

```dataview
TABLE 
  bean-name,
  origin,
  roaster,
  purchase-date,
  status
FROM "Beans Library"
WHERE status = "active"
SORT purchase-date DESC
```

### Beans to Rebuy

```dataview
LIST
FROM "Beans Library"
WHERE would-rebuy = true
SORT purchase-date DESC
```

### Finished Beans

```dataview
TABLE 
  bean-name,
  origin,
  purchase-date
FROM "Beans Library"
WHERE status = "finished"
SORT purchase-date DESC
```

### Beans Needing Review

Find beans you've purchased but haven't logged yet:

```dataview
LIST
FROM "Beans Library"
WHERE status = "active" 
  AND !contains(file.outlinks, "Coffee Logs")
```

### Most Expensive Beans

```dataview
TABLE 
  bean-name,
  origin,
  price + " (" + round(price/(weight/28.35), 2) + "/oz)" as "Price"
FROM "Beans Library"
SORT price DESC
LIMIT 10
```

---

## 🎯 Quality & Rating Queries

### Only 5-Star Coffees

```dataview
TABLE 
  beans,
  roaster,
  origin,
  date
FROM "Coffee Logs"
WHERE rating = 5
SORT date DESC
```

### Ratings Distribution

```dataview
TABLE 
  rating + " stars" as "Rating",
  length(rows) as "Count"
FROM "Coffee Logs"
WHERE rating > 0
GROUP BY rating
SORT rating DESC
```

### Below Average Coffees

Find coffees to avoid:

```dataview
TABLE 
  beans,
  roaster,
  rating,
  date
FROM "Coffee Logs"
WHERE rating < 3
SORT date DESC
```

### Improving Ratings Over Time

See if your palate is getting more discerning:

```dataview
TABLE 
  dateformat(date, "yyyy-MM") as "Month",
  round(average(rows.rating), 2) as "Avg Rating"
FROM "Coffee Logs"
WHERE rating > 0
GROUP BY dateformat(date, "yyyy-MM")
SORT dateformat(date, "yyyy-MM") DESC
LIMIT 12
```

---

## 📅 Time-Based Queries

### Today's Coffee

```dataview
TABLE 
  beans,
  rating,
  brew-method,
  time
FROM "Coffee Logs"
WHERE date = date(today)
SORT time ASC
```

### This Week's Logs

```dataview
TABLE beans, rating, brew-method, date
FROM "Coffee Logs"
WHERE date >= date(today) - dur(7 days)
SORT date DESC
```

### Weekend Coffees

```dataview
TABLE beans, rating, brew-method, date
FROM "Coffee Logs"
WHERE day-of-week = "Saturday" OR day-of-week = "Sunday"
SORT date DESC
LIMIT 20
```

### Coffee Logs by Year

```dataview
TABLE 
  length(rows) as "Sessions",
  sum(rows.cups-brewed) as "Cups"
FROM "Coffee Logs"
GROUP BY date.year
SORT date.year DESC
```

### Seasonal Patterns

```dataview
TABLE 
  length(rows) as "Logs",
  round(average(rows.rating), 2) as "Avg ⭐"
FROM "Coffee Logs"
GROUP BY date.month
SORT length(rows) DESC
```

---

## 🔍 Advanced Filtering

### Multiple Conditions (AND)

```dataview
TABLE beans, rating, date
FROM "Coffee Logs"
WHERE origin = "Ethiopia" 
  AND rating >= 4 
  AND brew-method = "pour-over"
SORT date DESC
```

### Multiple Conditions (OR)

```dataview
TABLE beans, origin, rating
FROM "Coffee Logs"
WHERE origin = "Ethiopia" OR origin = "Kenya"
SORT rating DESC
```

### Contains Matching

```dataview
TABLE beans, roaster, rating
FROM "Coffee Logs"
WHERE contains(beans, "Ethiopian") OR contains(beans, "Yirgacheffe")
SORT rating DESC
```

### Excluding Items

```dataview
TABLE beans, rating, date
FROM "Coffee Logs"
WHERE origin != "Unknown" AND rating > 0
SORT date DESC
```

### Range Queries

```dataview
TABLE beans, rating, date
FROM "Coffee Logs"
WHERE rating >= 3.5 AND rating < 4.5
SORT date DESC
```

---

## 📊 Grouped Summaries

### By Origin with Stats

```dataview
TABLE 
  length(rows.file.name) as "Sessions",
  round(average(rows.rating), 2) as "Avg ⭐",
  sum(rows.cups-brewed) as "Cups"
FROM "Coffee Logs"
WHERE origin
GROUP BY origin
SORT length(rows.file.name) DESC
```

### By Roaster with Details

```dataview
TABLE 
  length(rows) as "Logs",
  round(average(rows.rating), 2) as "Avg Rating",
  min(rows.date) as "First Try",
  max(rows.date) as "Latest"
FROM "Coffee Logs"
WHERE roaster
GROUP BY roaster
SORT round(average(rows.rating), 2) DESC
```

### By Brew Method with Cups

```dataview
TABLE 
  length(rows) as "Sessions",
  sum(rows.cups-brewed) as "Total Cups",
  round(average(rows.rating), 2) as "Avg ⭐"
FROM "Coffee Logs"
GROUP BY brew-method
SORT sum(rows.cups-brewed) DESC
```

---

## 🎨 Formatted Output

### Custom Column Names

```dataview
TABLE 
  beans as "☕ Coffee",
  rating as "⭐ Stars",
  brew-method as "🔧 Method",
  date as "📅 Date"
FROM "Coffee Logs"
SORT date DESC
LIMIT 10
```

### Calculated Fields

```dataview
TABLE 
  beans,
  rating,
  (today() - date).days() + " days ago" as "Age"
FROM "Coffee Logs"
SORT date DESC
LIMIT 10
```

### Conditional Formatting

```dataview
TABLE 
  beans,
  choice(rating >= 4.5, "⭐⭐⭐⭐⭐", choice(rating >= 3.5, "⭐⭐⭐⭐", "⭐⭐⭐")) as "Rating",
  date
FROM "Coffee Logs"
SORT date DESC
```

### Concatenated Fields

```dataview
TABLE 
  beans + " (" + origin + ")" as "Coffee",
  rating + "/5 - " + brew-method as "Details"
FROM "Coffee Logs"
SORT rating DESC
LIMIT 10
```

---

## 📋 LIST Queries

### Simple List of Beans Tried

```dataview
LIST
FROM "Coffee Logs"
SORT date DESC
LIMIT 20
```

### List with Custom Text

```dataview
LIST rating + " stars - " + beans + " (" + brew-method + ")"
FROM "Coffee Logs"
WHERE rating >= 4
SORT date DESC
```

### Nested Lists by Origin

```dataview
LIST rows.beans
FROM "Coffee Logs"
WHERE origin
GROUP BY origin
```

---

## 💡 Pro Tips

### Handling Missing Data

```dataview
TABLE 
  beans,
  choice(rating, rating, "Not rated") as "Rating",
  choice(origin, origin, "Unknown") as "Origin"
FROM "Coffee Logs"
SORT date DESC
```

### Date Formatting

```dataview
TABLE 
  beans,
  dateformat(date, "MMMM dd, yyyy") as "Date",
  dateformat(date, "dddd") as "Day"
FROM "Coffee Logs"
SORT date DESC
LIMIT 10
```

### Rounding Numbers

```dataview
TABLE WITHOUT ID
  round(average(rows.rating), 2) as "Average Rating",
  round(sum(rows.price), 2) as "Total Spent"
FROM "Coffee Logs"
```

---

## 🔗 DataviewJS (Advanced)

### Monthly Summary with Calculations

````javascript
```dataviewjs
const coffees = dv.pages('"Coffee Logs"')
  .where(p => p.date >= dv.date("2025-10-01") && p.date <= dv.date("2025-10-31"));

const totalCups = coffees.array().reduce((sum, log) => sum + (log.cups || 0), 0);
const avgRating = coffees.array().reduce((sum, log) => sum + log.rating, 0) / coffees.length;

dv.paragraph(`**October 2025 Stats**`);
dv.paragraph(`Cups: ${totalCups} | Avg Rating: ${avgRating.toFixed(2)}/5 | Sessions: ${coffees.length}`);
```
````

### Dynamic Top Roasters

````javascript
```dataviewjs
const logs = dv.pages('"Coffee Logs"')
  .where(p => p.roaster);

const roasterStats = {};
logs.forEach(log => {
  const roaster = log.roaster;
  if (!roasterStats[roaster]) {
    roasterStats[roaster] = { count: 0, totalRating: 0 };
  }
  roasterStats[roaster].count++;
  roasterStats[roaster].totalRating += log.rating;
});

const sorted = Object.entries(roasterStats)
  .map(([name, stats]) => ({
    roaster: name,
    sessions: stats.count,
    avgRating: (stats.totalRating / stats.count).toFixed(2)
  }))
  .sort((a, b) => b.avgRating - a.avgRating)
  .slice(0, 10);

dv.table(["Roaster", "Sessions", "Avg ⭐"], 
  sorted.map(r => [r.roaster, r.sessions, r.avgRating])
);
```
````

---

## 🔍 Query Troubleshooting

### Query Not Showing Results?

1. **Check folder path**: Must match exactly (case-sensitive)
2. **Check property names**: Use exact names from frontmatter
3. **Check WHERE condition**: May be filtering everything out
4. **Check data exists**: Need at least one matching note

### Showing Code Instead of Table?

1. **Preview mode**: Must be in Preview/Reading view
2. **Dataview enabled**: Check plugin is installed and active
3. **Syntax error**: Check for typos in query

### Slow Queries?

1. **Limit results**: Add `LIMIT 50` to queries
2. **Specific folders**: Use `FROM "Folder"` instead of searching all
3. **Reduce WHERE complexity**: Simpler conditions = faster queries

---

## 📚 Resources

**Official Documentation**:
- [Dataview Documentation](https://blacksmithgu.github.io/obsidian-dataview/)
- [Dataview Query Language Reference](https://blacksmithgu.github.io/obsidian-dataview/queries/structure/)
- [DataviewJS API](https://blacksmithgu.github.io/obsidian-dataview/api/intro/)

**Community Examples**:
- [Obsidian Forum - Dataview](https://forum.obsidian.md/c/dataview/29)
- [r/ObsidianMD - Dataview Examples](https://www.reddit.com/r/ObsidianMD/search?q=dataview)

**Video Tutorials**:
- [SkepticMystic - Dataview Crash Course](https://www.youtube.com/watch?v=8yjNuiSBSAM)
- [Obsidian Office Hours - Dataview Deep Dive](https://www.youtube.com/c/Obsidian)

---

**Last Updated**: 2025-10-24  
**Dataview Version**: 0.5.0+  
**Requires**: Dataview plugin installed and enabled

