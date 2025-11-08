---
type: persona-dashboard
persona: enthusiast
skill-level: intermediate
brew-count-range: 20-100
version: 6.0.0
created: 2025-11-06
tags: [persona, enthusiast, intermediate, dashboard, optimization, discovery]
---

# ⭐ Enthusiast Coffee Hub

**Welcome to Your Coffee Intelligence Center**

You've built solid brewing fundamentals and you're ready to optimize, explore, and discover new dimensions in your coffee journey. This hub gives you the tools to refine your craft and expand your palate.

---

## 📊 Your Coffee Intelligence

### Performance Overview

```dataview
TABLE WITHOUT ID
    "**Total Brews**" as "Metric",
    length(rows) as "Value"
FROM "Coffee Logs"
WHERE type = "coffee-log"
GROUP BY true
```

```dataview
TABLE WITHOUT ID
    "**Average Rating**" as "Metric",
    round(average(rows.rating), 2) + " / 5.0" as "Value"
FROM "Coffee Logs"
WHERE type = "coffee-log" AND rating
GROUP BY true
```

```dataview
TABLE WITHOUT ID
    "**Consistency Score**" as "Metric",
    choice(stdev < 0.5, "🎯 Excellent (" + round(5 - stdev, 1) + "/5)",
           stdev < 1.0, "✅ Good (" + round(5 - stdev, 1) + "/5)",
           stdev < 1.5, "📈 Improving (" + round(5 - stdev, 1) + "/5)",
           "🎲 Highly Variable (" + round(5 - stdev, 1) + "/5)") as "Value"
FROM "Coffee Logs"
WHERE type = "coffee-log" AND rating
FLATTEN round(sqrt(sum((rating - average(rating))^2) / length(rows)), 2) as stdev
GROUP BY true
LIMIT 1
```

```dataview
TABLE WITHOUT ID
    "**Favorite Method**" as "Metric",
    brew-method as "Value"
FROM "Coffee Logs"
WHERE type = "coffee-log"
GROUP BY brew-method
SORT length(rows) DESC
LIMIT 1
```

```dataview
TABLE WITHOUT ID
    "**Best Performing Origin**" as "Metric",
    origin + " (avg: " + round(average(rows.rating), 1) + ")" as "Value"
FROM "Coffee Logs"
WHERE type = "coffee-log" AND origin AND rating
GROUP BY origin
SORT average(rows.rating) DESC
LIMIT 1
```

### Trend Snapshot (Last 30 Days)

```dataview
TABLE WITHOUT ID
    dateformat(date, "MMM dd") as "Date",
    beans as "Coffee",
    brew-method as "Method",
    rating as "Rating",
    choice(rating >= 4.5, "🌟 Excellent",
           rating >= 4.0, "⭐ Great",
           rating >= 3.5, "✅ Good",
           rating >= 3.0, "📈 Learning",
           "🔧 Needs Work") as "Performance"
FROM "Coffee Logs"
WHERE type = "coffee-log" AND date >= date(today) - dur(30 days)
SORT date DESC
LIMIT 10
```

### Quality Over Time (Visual)

```dataview
TABLE WITHOUT ID
    dateformat(date, "MM/dd") as "Date",
    rating as "Rating",
    repeat("⭐", round(rating)) as "Visual"
FROM "Coffee Logs"
WHERE type = "coffee-log" AND rating AND date >= date(today) - dur(60 days)
SORT date ASC
```

### Method Distribution

```dataview
TABLE WITHOUT ID
    brew-method as "Method",
    length(rows) as "Count",
    round(average(rows.rating), 2) as "Avg Rating",
    round(length(rows) / total * 100, 1) + "%" as "% of Total"
FROM "Coffee Logs"
WHERE type = "coffee-log"
FLATTEN (SELECT length(file.lists) FROM "Coffee Logs" WHERE type = "coffee-log")[0] as total
GROUP BY brew-method
SORT length(rows) DESC
```

### Cost Per Cup Calculator

```dataview
TABLE WITHOUT ID
    "**Total Invested**" as "Metric",
    "$" + sum(rows.price-paid) as "Amount"
FROM "Bean Library"
WHERE type = "bean-profile" AND price-paid
GROUP BY true
```

```dataview
TABLE WITHOUT ID
    "**Estimated Cost Per Cup**" as "Metric",
    "$" + round(total-cost / brew-count, 2) as "Amount"
FROM "Coffee Logs"
WHERE type = "coffee-log"
FLATTEN length(rows) as brew-count
FLATTEN (SELECT sum(price-paid) FROM "Bean Library" WHERE type = "bean-profile")[0] as total-cost
GROUP BY true
LIMIT 1
```

> **Smart insight**: Track bean costs and brewing frequency to optimize your coffee budget!

---

## 🎯 Brewing Optimization

### ML-Powered Recommendations

**🤖 [[Analytics/Analytics-Analysis-Layout/2-Brewing-Optimization-Engine|Brewing Optimization Engine]]**
Get intelligent recommendations based on your brewing history and preferences.

**What it does:**
- Analyzes all your logs to find patterns
- Suggests optimal parameters for each bean
- Predicts best methods for new origins
- Identifies your sweet spot ratios

```dataview
TABLE WITHOUT ID
    choice(count >= 50, "✅ ML Predictions Active - Click above for recommendations",
           count >= 20, "📊 Collecting data - " + (50 - count) + " more brews for full ML features",
           "🌱 Keep logging - Basic patterns available at 20 brews") as "Status"
FROM "Coffee Logs"
WHERE type = "coffee-log"
FLATTEN length(rows) as count
GROUP BY true
LIMIT 1
```

### Parameter Sweet Spots

**Find your optimal settings for each bean:**

```dataview
TABLE WITHOUT ID
    beans as "Bean",
    brew-method as "Method",
    brew-ratio as "Best Ratio",
    grind-size as "Grind",
    water-temperature as "Temp (°C)",
    rating as "Rating"
FROM "Coffee Logs"
WHERE type = "coffee-log" AND rating >= 4.0
SORT rating DESC, date DESC
LIMIT 8
```

> **Pro Tip**: When you find a winning combination, create a [[Templates/Recipe Profile|Recipe Profile]] to reuse it!

### Consistency Analysis

**How consistent are you with each method?**

```dataview
TABLE WITHOUT ID
    brew-method as "Method",
    round(average(rows.rating), 2) as "Avg Rating",
    round(min(rows.rating), 1) + " - " + round(max(rows.rating), 1) as "Range",
    choice(stdev < 0.5, "🎯 Very Consistent",
           stdev < 1.0, "✅ Consistent",
           "📈 Variable") as "Consistency"
FROM "Coffee Logs"
WHERE type = "coffee-log" AND rating
FLATTEN round(sqrt(sum((rating - average(rating))^2) / length(rows)), 2) as stdev
GROUP BY brew-method
SORT stdev ASC
```

**Interpretation:**
- **🎯 Very Consistent**: You've mastered this method!
- **✅ Consistent**: Solid technique, minor variations
- **📈 Variable**: Opportunity to dial in your technique

### Outlier Detection

**Your unusual brews - learn from extremes:**

```dataview
TABLE WITHOUT ID
    date as "Date",
    beans as "Bean",
    brew-method as "Method",
    rating as "Rating",
    choice(rating >= 4.8, "🌟 Exceptional - What did you do right?",
           rating <= 2.5, "🔧 Troubleshoot - What went wrong?",
           "🎯 Outlier") as "Analysis"
FROM "Coffee Logs"
WHERE type = "coffee-log" AND (rating >= 4.8 OR rating <= 2.5)
SORT rating DESC, date DESC
LIMIT 5
```

---

## 🔍 Discovery Zone

### Try This Next

**Coffees you haven't explored yet:**

#### Untried Origins

```dataview
TABLE WITHOUT ID
    file.link as "Origin",
    country as "Country",
    primary-varieties as "Varieties",
    flavor-profile as "Flavor Profile"
FROM "Origins"
WHERE type = "origin-profile"
AND !contains(tried-origins, file.name)
SORT country ASC
LIMIT 5
```

> **Expand your palate**: Try origins from different continents for diverse flavor experiences!

#### Methods to Explore

```dataview
LIST
FROM "Brewing Guides"
WHERE type = "brewing-guide"
AND !contains(tried-methods, brew-method)
LIMIT 5
```

#### Beans in Your Library (Not Yet Brewed)

```dataview
TABLE WITHOUT ID
    file.link as "Bean",
    origin as "Origin",
    processing as "Process",
    roast-level as "Roast",
    status as "Status"
FROM "Bean Library"
WHERE type = "bean-profile" AND status = "active"
SORT purchase-date DESC
LIMIT 5
```

### Flavor Profile Comparison Tool

**Compare your favorite beans side-by-side:**

```dataview
TABLE WITHOUT ID
    beans as "Bean",
    origin as "Origin",
    processing as "Process",
    round(average(rows.rating), 1) as "Your Rating",
    list(rows.flavor-notes[0]) as "Primary Flavors"
FROM "Coffee Logs"
WHERE type = "coffee-log" AND rating >= 4.0 AND flavor-notes
GROUP BY beans, origin, processing
SORT average(rows.rating) DESC
LIMIT 8
```

### Origin Exploration Map

**Track which regions you've explored:**

```dataview
TABLE WITHOUT ID
    country as "Country",
    length(rows) as "Brews",
    round(average(rows.rating), 1) as "Avg Rating",
    choice(length(rows) >= 10, "🗺️ Well Explored",
           length(rows) >= 5, "⭐ Familiar",
           length(rows) >= 2, "👀 Exploring",
           "🌱 First Visit") as "Exploration Level"
FROM "Coffee Logs"
WHERE type = "coffee-log" AND origin
GROUP BY country
SORT length(rows) DESC
```

**Achievement Progress:**
- **🗺️ Well Explored** (10+ brews): You know this origin well
- **⭐ Familiar** (5-9 brews): Strong foundation
- **👀 Exploring** (2-4 brews): Building knowledge
- **🌱 First Visit** (1 brew): Welcome to the region!

### Processing Method Deep Dive

**Compare how processing affects your experience:**

```dataview
TABLE WITHOUT ID
    processing as "Processing",
    length(rows) as "Times Tried",
    round(average(rows.rating), 2) as "Avg Rating",
    list(distinct(rows.origin))[0] + ", " + list(distinct(rows.origin))[1] as "Origins Tried"
FROM "Coffee Logs"
WHERE type = "coffee-log" AND processing
GROUP BY processing
SORT average(rows.rating) DESC
```

**Processing Characteristics:**
- **Washed**: Clean, bright, clarity of origin
- **Natural**: Fruity, wine-like, fuller body
- **Honey**: Sweet, balanced, complex
- **Experimental**: Unique, unpredictable, exotic

---

## 📚 Your Coffee Library

### All Beans with Ratings

```dataview
TABLE WITHOUT ID
    file.link as "Bean",
    origin as "Origin",
    processing as "Process",
    roast-level as "Roast",
    round(avg-rating, 1) as "Rating",
    brew-count as "Brews",
    status as "Status"
FROM "Bean Library"
WHERE type = "bean-profile"
FLATTEN (SELECT round(average(rows.rating), 1) FROM "Coffee Logs" WHERE beans = this.name)[0] as avg-rating
FLATTEN (SELECT length(rows) FROM "Coffee Logs" WHERE beans = this.name)[0] as brew-count
SORT avg-rating DESC, brew-count DESC
```

### Top 5 Performers

```dataview
TABLE WITHOUT ID
    beans as "Bean",
    origin as "Origin",
    round(average(rows.rating), 2) as "Avg Rating",
    max(rows.rating) as "Best Brew",
    length(rows) as "Times Brewed"
FROM "Coffee Logs"
WHERE type = "coffee-log" AND rating
GROUP BY beans, origin
SORT average(rows.rating) DESC
LIMIT 5
```

> **Consider**: Beans with high ratings AND multiple brews are your consistent winners!

### Beans to Revisit

**Great beans you haven't brewed recently:**

```dataview
TABLE WITHOUT ID
    beans as "Bean",
    max(rows.date) as "Last Brewed",
    round(average(rows.rating), 1) as "Avg Rating",
    length(rows) as "Times Brewed"
FROM "Coffee Logs"
WHERE type = "coffee-log" AND rating >= 4.0
GROUP BY beans
HAVING max(rows.date) < date(today) - dur(30 days)
SORT max(rows.date) ASC
LIMIT 5
```

### Inventory Tracker

**Beans running low or finished:**

```dataview
TABLE WITHOUT ID
    file.link as "Bean",
    bag-size + "g" as "Bag Size",
    roast-date as "Roast Date",
    choice(status = "finished", "⚠️ Reorder if you liked it!",
           status = "active", "✅ Still available",
           status) as "Status"
FROM "Bean Library"
WHERE type = "bean-profile"
SORT roast-date DESC
LIMIT 10
```

---

## 🎓 Learning Path

### Scientific References Matched to Your Interests

```dataview
TABLE WITHOUT ID
    file.link as "Reference",
    category as "Category",
    difficulty-level as "Level"
FROM "Scientific References"
WHERE type = "scientific-reference"
AND difficulty-level IN ["beginner", "intermediate"]
SORT category, difficulty-level
LIMIT 10
```

**Recommended reading for enthusiasts:**
- **[[Scientific References/Extraction Science/Extraction-Yield-Measurement|Extraction Yield]]** - Measure your coffee strength
- **[[Scientific References/Sensory Science/Retronasal-Olfaction-and-Flavor-Perception|Flavor Perception]]** - How we taste coffee
- **[[Scientific References/Water Chemistry/Water-Temperature-and-Extraction|Water Chemistry]]** - The foundation of brewing

### Advanced Brewing Guides

```dataview
TABLE WITHOUT ID
    file.link as "Guide",
    brew-method as "Method",
    difficulty as "Level",
    time-required as "Time"
FROM "Brewing Guides"
WHERE difficulty IN ["intermediate", "advanced"]
SORT difficulty, brew-method
LIMIT 8
```

### Cupping Introduction

**Ready to formal taste?**

Learn professional coffee evaluation:
- **[[Templates/SCA-Cupping-Form|SCA Cupping Form]]** - Official protocol
- **[[Templates/Cupping Session|Cupping Session Template]]** - Setup your first session
- **[[Scientific References/Sensory Science/SCA-Cupping-Protocol-Step-by-Step|Cupping Protocol]]** - Step-by-step guide

**Why cup?**
- Develop your palate systematically
- Compare coffees objectively
- Learn professional evaluation standards
- Join the specialty coffee community

### Sensory Training Experiments

**Build your tasting skills:**

```dataview
LIST
FROM "Templates"
WHERE file.name = "sensory-experiment-template"
```

**Suggested experiments:**
1. **Triangle Test**: Can you identify the different coffee?
2. **Water Comparison**: Taste the impact of water on flavor
3. **Temperature Tasting**: How flavor changes as coffee cools
4. **Blind Method Test**: Can you identify your favorite method blind?

---

## 💰 Cost Intelligence

### Monthly Spending Summary

```dataview
TABLE WITHOUT ID
    "**This Month**" as "Period",
    "$" + sum(rows.price-paid) as "Spent on Beans"
FROM "Bean Library"
WHERE type = "bean-profile"
AND purchase-date >= date(today) - dur(30 days)
GROUP BY true
```

```dataview
TABLE WITHOUT ID
    "**Last 3 Months**" as "Period",
    "$" + sum(rows.price-paid) as "Spent on Beans"
FROM "Bean Library"
WHERE type = "bean-profile"
AND purchase-date >= date(today) - dur(90 days)
GROUP BY true
```

```dataview
TABLE WITHOUT ID
    "**This Year**" as "Period",
    "$" + sum(rows.price-paid) as "Spent on Beans"
FROM "Bean Library"
WHERE type = "bean-profile"
AND purchase-date >= date(today) - dur(365 days)
GROUP BY true
```

### Cost Per Brew by Method

```dataview
TABLE WITHOUT ID
    brew-method as "Method",
    length(rows) as "Brews",
    "$" + round(avg-cost, 2) as "Avg Cost/Brew"
FROM "Coffee Logs"
WHERE type = "coffee-log"
FLATTEN (SELECT sum(price-paid) FROM "Bean Library" WHERE type = "bean-profile")[0] / length(rows) as avg-cost
GROUP BY brew-method
SORT length(rows) DESC
```

### Value Analysis (Rating vs. Cost)

```dataview
TABLE WITHOUT ID
    beans as "Bean",
    "$" + price-paid as "Cost",
    round(average(rows.rating), 1) as "Avg Rating",
    choice(average(rows.rating) >= 4.5 AND price-paid <= 20, "🎯 Great Value!",
           average(rows.rating) >= 4.0 AND price-paid <= 25, "✅ Good Value",
           average(rows.rating) >= 4.5, "⭐ Premium Quality",
           "📊 Standard") as "Value Assessment"
FROM "Coffee Logs"
WHERE type = "coffee-log" AND rating
LEFT JOIN "Bean Library" ON beans = Bean-Library.name
GROUP BY beans, price-paid
SORT average(rows.rating) DESC
LIMIT 10
```

### Budget Planning

```dataview
TABLE WITHOUT ID
    "**Projected Monthly Cost**" as "Metric",
    "$" + round(total-spent / months * 1, 0) as "Amount"
FROM "Bean Library"
WHERE type = "bean-profile" AND purchase-date
FLATTEN sum(rows.price-paid) as total-spent
FLATTEN (date(today) - min(rows.purchase-date)).days / 30 as months
GROUP BY true
LIMIT 1
```

**Budgeting tips:**
- Most enthusiasts spend $40-80/month on beans
- Buying in bulk from favorite roasters saves 10-20%
- Subscriptions offer convenience but less control

**See detailed cost analysis**: [[Analytics/Analytics-Analysis-Layout/3-Cost-Intelligence-System|Cost Intelligence System]]

---

## 📊 Visualizations for You

### 3D Flavor Space

**Your brews mapped in flavor dimensions:**

> Navigate to **[[Analytics/Analytics-Analysis-Layout/6-Correlation-Discovery-Engine|Correlation Discovery Engine]]** for interactive flavor space visualization.

**What it shows:**
- Each brew as a point in 3D space
- Clusters of similar flavor profiles
- Your flavor preferences and patterns
- Discovery opportunities (areas you haven't explored)

### Brewing Methods Radar Chart

**Compare your performance across methods:**

```dataview
TABLE WITHOUT ID
    brew-method as "Method",
    round(average(rows.rating), 2) as "Avg Rating",
    length(rows) as "Experience (Brews)",
    round(min(rows.rating), 1) + " - " + round(max(rows.rating), 1) as "Range"
FROM "Coffee Logs"
WHERE type = "coffee-log" AND rating
GROUP BY brew-method
SORT average(rows.rating) DESC
```

### Bean Comparison Matrix

**Side-by-side analysis of your beans:**

```dataview
TABLE WITHOUT ID
    beans as "Bean",
    origin as "Origin",
    processing as "Process",
    round(avg-rating, 1) as "Rating",
    brew-count as "Brews",
    favorite-notes as "Flavor"
FROM "Bean Library"
WHERE type = "bean-profile"
FLATTEN (SELECT round(average(rows.rating), 1) FROM "Coffee Logs" WHERE beans = this.name)[0] as avg-rating
FLATTEN (SELECT length(rows) FROM "Coffee Logs" WHERE beans = this.name)[0] as brew-count
FLATTEN taste-notes[0] as favorite-notes
SORT avg-rating DESC
LIMIT 10
```

### Supply Chain Map

**Trace your coffee from origin to cup:**

```dataview
TABLE WITHOUT ID
    beans as "Bean",
    origin as "Origin",
    producer as "Producer",
    roaster as "Roaster",
    choice(producer, "✅ Full Traceability", "📍 Partial Traceability") as "Transparency"
FROM "Bean Library"
WHERE type = "bean-profile"
SORT origin
```

---

## 🌐 Community & Sharing

### Export Your Data

**Share your coffee journey:**

- **[[Configuration/Export-Guide|Data Export Guide]]** - Download your logs as CSV
- Generate monthly summary reports
- Create shareable brew cards
- Export for portfolio or blog

### Generate Brew Cards for Sharing

**Create beautiful cards for your best brews:**

```dataview
TABLE WITHOUT ID
    date as "Date",
    beans as "Bean",
    brew-method as "Method",
    rating as "Rating",
    "[Generate Card]" as "Action"
FROM "Coffee Logs"
WHERE type = "coffee-log" AND rating >= 4.5
SORT date DESC
LIMIT 5
```

> **Feature**: Click to generate Instagram-ready brew cards (coming soon in Visualizations)

### Monthly Summary Report

**Your coffee stats summarized:**

```dataview
TABLE WITHOUT ID
    "**Brews This Month**" as "Metric",
    length(rows) as "Value"
FROM "Coffee Logs"
WHERE type = "coffee-log"
AND date >= date(today) - dur(30 days)
GROUP BY true
```

```dataview
TABLE WITHOUT ID
    "**Average Rating (Month)**" as "Metric",
    round(average(rows.rating), 2) as "Value"
FROM "Coffee Logs"
WHERE type = "coffee-log" AND rating
AND date >= date(today) - dur(30 days)
GROUP BY true
```

```dataview
TABLE WITHOUT ID
    "**New Origins Tried**" as "Metric",
    length(list(distinct(rows.origin))) as "Value"
FROM "Coffee Logs"
WHERE type = "coffee-log"
AND date >= date(today) - dur(30 days)
GROUP BY true
```

### Achievement Badges

**Your coffee accomplishments:**

```dataview
TASK
WHERE file.path = this.file.path
```

**Enthusiast Achievements:**
- [ ] 20 brews logged ✅
- [ ] 5 different origins explored
- [ ] 3 brew methods mastered
- [ ] First 4.5+ star brew
- [ ] Cost tracking enabled
- [ ] ML recommendations accessed
- [ ] First recipe profile created
- [ ] One cupping session completed
- [ ] Shared a brew card
- [ ] 100 brews (Professional level!)

---

## 🎯 Next Level Goals

### Set Your First Coffee Goal

**Structure your learning:**

**[[Templates/Coffee Goal|Create a Coffee Goal]]**

**Popular enthusiast goals:**
- Master a specific brewing method
- Explore all African origins
- Complete sensory training
- Host a cupping session
- Build espresso setup
- Achieve consistent 4+ star ratings

### Plan a Cupping Session

**Host your first formal tasting:**

1. **[[Templates/Cupping Session|Create Cupping Session]]**
2. Select 3-5 coffees to compare
3. Use **[[Templates/SCA-Cupping-Form|SCA Cupping Protocol]]**
4. Invite friends or taste solo
5. Document findings

**Why cup?**
- Develops palate faster than anything else
- Professional evaluation method
- Compare coffees objectively
- Join specialty coffee community

### Track Palate Development

**Monitor your tasting evolution:**

**[[Analytics/Learning-Education-Layout/4-Palate-Development-Tracker|Palate Development Tracker]]**

Features:
- Flavor vocabulary expansion
- Descriptor accuracy tracking
- Sensory skill progression
- Blind tasting results

### Master a New Method

**Pick a method and go deep:**

```dataview
TABLE WITHOUT ID
    file.link as "Guide",
    brew-method as "Method",
    difficulty as "Difficulty",
    choice(tried = true, "📚 Review", "🎯 New Challenge") as "Status"
FROM "Brewing Guides"
WHERE difficulty IN ["intermediate", "advanced"]
SORT difficulty, brew-method
LIMIT 5
```

---

## 🔗 Quick Access

**Daily Actions:**
- [[Templates/Coffee-Log-v5|Log New Brew]]
- [[Analytics/Daily-Brewing-Layout/9-Real-Time-Brewing-Assistant|Brewing Assistant]]
- [[HOME-DASHBOARD|Main Dashboard]]

**Optimization:**
- [[Analytics/Analytics-Analysis-Layout/2-Brewing-Optimization-Engine|Optimization Engine]]
- [[Analytics/Analytics-Analysis-Layout/1-Monthly-Analytics-Dashboard|Monthly Analytics]]
- [[Analytics/Analytics-Analysis-Layout/3-Cost-Intelligence-System|Cost Intelligence]]

**Learning:**
- [[Scientific References/|Science Library]]
- [[Brewing Guides/|Brewing Guides]]
- [[Coffee Goals/|Your Goals]]

**Discovery:**
- [[Origins/|Origin Profiles]]
- [[Bean Library/|Bean Library]]
- [[Roasters/|Roaster Profiles]]

---

**Keep exploring, optimizing, and enjoying your coffee journey!** ⭐

*You're in the sweet spot - building expertise while still discovering new dimensions of coffee.*

---

**Dashboard Version**: 6.0.0 - Enthusiast Experience
**Last Updated**: 2025-11-06
**Persona**: Enthusiast (20-100 brews)
**Design Philosophy**: Discovery, Optimization, Exploration
