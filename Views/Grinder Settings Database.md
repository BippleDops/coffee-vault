---
type: reference-view
title: Grinder Settings Database
tags: [grinder, settings, reference, brewing-parameters]
last-updated: 2025-10-25
---

# ⚙️ Grinder Settings Database

**Purpose**: Index and reference successful grinder settings by method, bean characteristics, and grinder type. Provides intelligent starting points for dialing in new beans.

---

## 🎯 Quick Lookup

Use this database to find optimal grinder settings based on:
- Brewing method
- Bean roast level
- Bean origin characteristics
- Your specific grinder

**How to Use**:
1. Find your brewing method section below
2. Look for similar bean characteristics (roast level, origin)
3. Use the suggested setting as your starting point
4. Fine-tune and document your results

---

## 📊 Highest Rated Settings by Method

### Espresso Settings (Rating 4.5+)

```dataview
TABLE
  beans as "Beans",
  roast-level as "Roast",
  grind-size as "Grind Size",
  rating as "⭐ Rating",
  brew-time as "Time (min)",
  ratio as "Ratio",
  date as "Date"
FROM "Coffee Logs"
WHERE brew-method = "espresso" AND rating >= 4.5
SORT rating DESC, date DESC
LIMIT 10
```

**Common Successful Patterns**:
- Light roasts: Fine to Medium-Fine
- Dark roasts: Fine
- Typical extraction time: 25-30 seconds (0.4-0.5 minutes)

---

### Pour Over Settings (Rating 4.5+)

```dataview
TABLE
  beans as "Beans",
  roast-level as "Roast",
  grind-size as "Grind Size",
  rating as "⭐ Rating",
  water-temp as "Temp (°F)",
  brew-time as "Time (min)",
  ratio as "Ratio"
FROM "Coffee Logs"
WHERE (brew-method = "pour-over" OR brew-method = "v60") AND rating >= 4.5
SORT rating DESC, date DESC
LIMIT 10
```

**Common Successful Patterns**:
- Light roasts: Medium-Fine, 205°F, 2.5-3.5 minutes
- Medium roasts: Medium-Fine to Medium, 200°F, 3-4 minutes
- Dark roasts: Medium, 195°F, 3-4 minutes

---

### French Press Settings (Rating 4.5+)

```dataview
TABLE
  beans as "Beans",
  roast-level as "Roast",
  grind-size as "Grind Size",
  rating as "⭐ Rating",
  water-temp as "Temp (°F)",
  brew-time as "Time (min)",
  ratio as "Ratio"
FROM "Coffee Logs"
WHERE brew-method = "french-press" AND rating >= 4.5
SORT rating DESC, date DESC
LIMIT 10
```

**Common Successful Patterns**:
- All roast levels: Coarse grind
- Standard brew time: 4 minutes
- Ratio: 1:15 to 1:16

---

### Aeropress Settings (Rating 4.5+)

```dataview
TABLE
  beans as "Beans",
  roast-level as "Roast",
  grind-size as "Grind Size",
  rating as "⭐ Rating",
  water-temp as "Temp (°F)",
  brew-time as "Time (min)",
  ratio as "Ratio"
FROM "Coffee Logs"
WHERE brew-method = "aeropress" AND rating >= 4.5
SORT rating DESC, date DESC
LIMIT 10
```

**Common Successful Patterns**:
- Fine to Medium-Fine grind
- Water temp: 175-200°F (varies widely)
- Brew time: 1-2 minutes
- Ratio: 1:14 to 1:16

---

### Cold Brew Settings (Rating 4.5+)

```dataview
TABLE
  beans as "Beans",
  roast-level as "Roast",
  grind-size as "Grind Size",
  rating as "⭐ Rating",
  brew-time as "Time (min)",
  ratio as "Ratio"
FROM "Coffee Logs"
WHERE brew-method = "cold-brew" AND rating >= 4.5
SORT rating DESC, date DESC
LIMIT 10
```

**Common Successful Patterns**:
- Extra-Coarse to Coarse grind
- Brew time: 12-18 hours (720-1080 minutes)
- Ratio: 1:8 to 1:10 (concentrate)

---

## 🌍 Settings by Origin

### Ethiopian Beans

```dataview
TABLE
  beans as "Beans",
  brew-method as "Method",
  roast-level as "Roast",
  grind-size as "Grind Size",
  rating as "⭐ Rating",
  water-temp as "Temp"
FROM "Coffee Logs"
WHERE origin = "Ethiopia" AND rating >= 4.0
SORT rating DESC
LIMIT 8
```

**Typical Characteristics**: Bright, floral, fruity
**Best Methods**: Pour over, V60, Chemex
**Recommended Grind**: Medium-Fine for pour over

---

### Colombian Beans

```dataview
TABLE
  beans as "Beans",
  brew-method as "Method",
  roast-level as "Roast",
  grind-size as "Grind Size",
  rating as "⭐ Rating",
  water-temp as "Temp"
FROM "Coffee Logs"
WHERE origin = "Colombia" AND rating >= 4.0
SORT rating DESC
LIMIT 8
```

**Typical Characteristics**: Balanced, nutty, caramel
**Best Methods**: Versatile - works with most methods
**Recommended Grind**: Medium for French Press, Medium-Fine for pour over

---

### Kenyan Beans

```dataview
TABLE
  beans as "Beans",
  brew-method as "Method",
  roast-level as "Roast",
  grind-size as "Grind Size",
  rating as "⭐ Rating",
  water-temp as "Temp"
FROM "Coffee Logs"
WHERE origin = "Kenya" AND rating >= 4.0
SORT rating DESC
LIMIT 8
```

**Typical Characteristics**: Bold, wine-like, berry notes
**Best Methods**: Pour over, French Press
**Recommended Grind**: Medium-Fine for pour over, Coarse for French Press

---

## 🔥 Settings by Roast Level

### Light Roasts - Optimal Settings

```dataview
TABLE
  beans as "Beans",
  brew-method as "Method",
  grind-size as "Grind Size",
  rating as "⭐ Rating",
  water-temp as "Temp",
  brew-time as "Time (min)"
FROM "Coffee Logs"
WHERE (roast-level = "light" OR roast-level = "medium-light") AND rating >= 4.5
SORT rating DESC
LIMIT 10
```

**Key Insights**:
- Light roasts need higher water temperatures (203-206°F)
- Slightly finer grind than medium roasts
- Longer extraction times for full flavor development

---

### Medium Roasts - Optimal Settings

```dataview
TABLE
  beans as "Beans",
  brew-method as "Method",
  grind-size as "Grind Size",
  rating as "⭐ Rating",
  water-temp as "Temp",
  brew-time as "Time (min)"
FROM "Coffee Logs"
WHERE roast-level = "medium" AND rating >= 4.5
SORT rating DESC
LIMIT 10
```

**Key Insights**:
- Most versatile roast level
- Standard water temperatures (195-202°F)
- Medium grind for most methods

---

### Dark Roasts - Optimal Settings

```dataview
TABLE
  beans as "Beans",
  brew-method as "Method",
  grind-size as "Grind Size",
  rating as "⭐ Rating",
  water-temp as "Temp",
  brew-time as "Time (min)"
FROM "Coffee Logs"
WHERE (roast-level = "dark" OR roast-level = "medium-dark") AND rating >= 4.5
SORT rating DESC
LIMIT 10
```

**Key Insights**:
- Dark roasts need lower water temperatures (190-198°F)
- Avoid over-extraction (bitterness)
- Slightly coarser grind can help

---

## 📈 Grind Size Success Rate Analysis

### Grind Size Performance by Method

```dataview
TABLE WITHOUT ID
  grind-size as "Grind Size",
  length(rows) as "Sessions",
  round(average(rows.rating), 2) as "Avg Rating",
  round(sum(rows.rating >= 4.5) / length(rows) * 100, 1) + "%" as "Success Rate (4.5+)"
FROM "Coffee Logs"
WHERE brew-method = "pour-over"
GROUP BY grind-size
SORT average(rows.rating) DESC
```

*Change the brew-method in the query above to analyze different methods*

---

## 🎓 Learning From Experiments

### Recent High-Rated Experiments

```dataview
TABLE
  beans as "Beans",
  brew-method as "Method",
  grind-size as "Grind Size",
  rating as "⭐ Rating",
  notes as "What Worked"
FROM "Coffee Logs"
WHERE session-type = "experiment" AND rating >= 4.5
SORT date DESC
LIMIT 5
```

### Recent Failed Experiments (Learning Opportunities)

```dataview
TABLE
  beans as "Beans",
  brew-method as "Method",
  grind-size as "Grind Size",
  rating as "⭐ Rating",
  notes as "What Went Wrong"
FROM "Coffee Logs"
WHERE session-type = "experiment" AND rating < 3.0
SORT date DESC
LIMIT 5
```

---

## 🔍 Grind Size Reference Chart

| Grind Size | Particle Size | Best For | Brew Time |
|------------|---------------|----------|-----------|
| **Extra Fine** | Powdery, like flour | Turkish coffee, some espresso | 20-30 seconds (espresso) |
| **Fine** | Like table salt | Espresso, Aeropress (inverted) | 25-35 seconds |
| **Medium-Fine** | Like fine sand | Pour over (V60, Kalita), Aeropress | 2-4 minutes |
| **Medium** | Like regular sand | Drip coffee makers, Chemex, Siphon | 4-6 minutes |
| **Medium-Coarse** | Like coarse sand | Clever dripper, Chemex (some prefer) | 4-6 minutes |
| **Coarse** | Like sea salt | French Press, Percolator | 4-5 minutes |
| **Extra Coarse** | Like peppercorns | Cold brew | 12-24 hours |

---

## 📝 Dial-In Tracking Template

When dialing in new beans, use this as a guide:

**Starting Point** (based on method and roast level):
- Method: [Your method]
- Roast Level: [Light/Medium/Dark]
- Suggested Grind: [From database above]
- Suggested Temp: [From database above]
- Suggested Time: [From database above]

**Adjustment Log**:
1. **Session 1**: [grind setting] - [result] - [adjust finer/coarser?]
2. **Session 2**: [grind setting] - [result] - [adjust temp/time?]
3. **Session 3**: [grind setting] - [SUCCESS!] - [lock it in]

---

## 🛠️ Grinder-Specific Notes

### Common Grinders

Add your own grinder-specific click counts or settings below:

**Hand Grinders** (e.g., Comandante, 1Zpresso):
- Track your click settings for each method
- Example: "Comandante 18 clicks = Medium-Fine for V60"

**Electric Burr Grinders** (e.g., Baratza Encore, Fellow Ode):
- Track your dial settings
- Example: "Baratza Encore setting 15 = Medium for French Press"

**Commercial Grinders** (e.g., Mahlkönig, Mazzer):
- Track your settings by method
- Example: "Mazzer setting 3.5 = Fine for espresso"

*Add your custom grinder settings here as you dial them in*

---

## 🔗 Related Resources

**Brewing Guides**:
- [[Brewing Guides/Pour Over V60 Guide]]
- [[Brewing Guides/Espresso Guide]]
- [[Brewing Guides/French Press Guide]]

**Reference Materials**:
- [[Coffee Science & Extraction]]
- [[Master Coffee Reference]]

**Analytics**:
- [[Views/Coffee Dashboard]] - View all your brewing statistics

---

## 💡 Tips for Using This Database

1. **Always start with successful settings** from similar beans/methods
2. **Document your adjustments** in your coffee logs
3. **Look for patterns** in your highest-rated sessions
4. **Consider bean age** - older beans may need finer grinding
5. **Water quality matters** - filtered water produces more consistent results
6. **Temperature affects extraction** - hotter water extracts faster
7. **Grind consistency** is more important than exact size

---

*This database automatically updates as you add new coffee logs. Check back regularly to see new patterns and successful settings!*

**Last Updated**: 2025-10-25
