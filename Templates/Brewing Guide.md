---
type: brewing-guide
brew-method: <% tp.system.prompt("Brewing method") %>
difficulty: <% tp.system.suggester(["Beginner", "Intermediate", "Advanced"], ["beginner", "intermediate", "advanced"]) %>
source: <% tp.system.prompt("Source (URL, book, or person)", "Personal experimentation") %>
date-created: <% tp.date.now("YYYY-MM-DD") %>
tags: "[brewing-guide, <%  tp.frontmatter["brew-method"].toLowerCase().replace(/\s+/g, '-')  %>]"
---

# ☕ <% tp.frontmatter["brew-method"] %> Brewing Guide

**Difficulty**: <% tp.frontmatter.difficulty %>  
**Source**: <% tp.frontmatter.source %>  
**Last Updated**: <% tp.date.now("YYYY-MM-DD") %>

---

## 📋 Overview

**Best For**: (type of beans, flavor profiles, occasions)


**Time Required**: 

**Equipment Needed**:
- 
- 
- 

<% tp.file.cursor() %>

---

## ⚙️ Standard Recipe

### Basic Parameters

| Parameter | Value | Notes |
|-----------|-------|-------|
| Coffee Dose | g | |
| Water | g/ml | |
| Ratio | 1:__ | |
| Grind Size | | |
| Water Temp | °F / °C | |
| Total Time | minutes | |

---

## 📝 Step-by-Step Instructions

### Preparation

1. 
2. 
3. 

### Brewing Process

1. **0:00** - 
2. **0:30** - 
3. **1:00** - 
4. Continue...

### Finishing

1. 
2. 

---

## 🎯 Tips & Tricks

**For Better Extraction**:
- 

**Common Mistakes to Avoid**:
- 

**Adjustments for Different Beans**:
- Light roasts: 
- Medium roasts: 
- Dark roasts: 

---

## 🔧 Troubleshooting

| Problem | Possible Cause | Solution |
|---------|----------------|----------|
| Too bitter | | |
| Too sour | | |
| Weak/watery | | |
| Too strong | | |

---

## 📊 My Results Using This Method

```dataview
TABLE 
  beans as "Beans",
  rating as "⭐ Rating",
  date as "Date",
  notes as "Quick Notes"
FROM "Coffee Logs"
WHERE brew-method = this.brew-method
SORT rating DESC
LIMIT 10
```

### Average Rating

```dataview
TABLE WITHOUT ID
  round(average(rows.rating), 2) as "Avg Rating",
  length(rows) as "Times Used"
FROM "Coffee Logs"
WHERE brew-method = this.brew-method
```

---

## 🔗 Resources

**Video Tutorials**:
- 

**Articles**:
- 

**Related Techniques**:
- 

---

## 💭 Personal Notes & Modifications

**What I've Learned**:


**My Preferred Variations**:


**Next Experiments**:

