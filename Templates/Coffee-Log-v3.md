---
<%*
# ============================================
# TEMPLATE: Coffee Log Enhanced v3.0
# VERSION: 3.0.0
# PURPOSE: Daily coffee brewing session with intelligent suggestions
# FOLLOWS: Template Framework Standards v3.0
# ============================================

# ============================================
# SECTION 1: Configuration and Imports
# ============================================

const currentDate = tp.file.creation_date("YYYY-MM-DD");
const currentTime = tp.file.creation_date("HH:mm");
const stats = await tp.user.require("Scripts/stats-utils.js").catch(() => null);

# ============================================
# SECTION 2: Helper Functions
# ============================================

function calculateRatio(dose, water) {
  if (!dose || !water || isNaN(dose) || isNaN(water)) return "1:16.5";
  const ratio = (water / dose).toFixed(1);
  return `1:${ratio}`;
}

function validateRating(rating) {
  const num = parseFloat(rating);
  if (isNaN(num) || num < 1 || num > 5) return 3.0;
  return Math.round(num * 2) / 2; // Round to nearest 0.5
}

function getDefaultTemp(roastLevel, brewMethod) {
  const temps = {
    'light': { 'v60': 96, 'chemex': 95, 'aeropress': 93, 'default': 94 },
    'medium-light': { 'v60': 94, 'chemex': 93, 'aeropress': 91, 'default': 92 },
    'medium': { 'v60': 92, 'chemex': 91, 'aeropress': 89, 'default': 90 },
    'medium-dark': { 'v60': 90, 'chemex': 89, 'aeropress': 87, 'default': 88 },
    'dark': { 'v60': 88, 'chemex': 87, 'aeropress': 85, 'default': 86 }
  };
  return temps[roastLevel]?.[brewMethod] ?? temps[roastLevel]?.default ?? 92;
}

function getDefaultGrindSize(brewMethod) {
  const grinds = {
    'v60': 'medium-fine',
    'chemex': 'medium',
    'aeropress': 'fine',
    'french-press': 'coarse',
    'espresso': 'extra-fine',
    'cold-brew': 'extra-coarse'
  };
  return grinds[brewMethod] ?? 'medium';
}

function getDefaultBrewTime(brewMethod) {
  const times = {
    'v60': '2:30-3:00',
    'chemex': '4:00-4:30',
    'aeropress': '1:30-2:00',
    'french-press': '4:00',
    'espresso': '0:25-0:30',
    'cold-brew': '12:00-16:00'
  };
  return times[brewMethod] ?? '3:00';
}

# ============================================
# SECTION 3: Data Gathering and Suggestions
# ============================================

# Safely query recent coffee logs with Datacore/Dataview
let recentLogs = [];
let suggestedBean = "";
let suggestedRoaster = "";
let suggestedDose = 18;
let suggestedWater = 300;
let topMethods = ["V60", "Chemex", "Aeropress", "French Press", "Espresso"];

try {
  # Use Datacore if available, fallback to Dataview
  const pages = dv?.pages('"Coffee Logs"')
    .where(p => p.type === "coffee-log")
    .sort(p => p.date, 'desc')
    .limit(10)
    .array() ?? [];

  recentLogs = pages;

  if (pages.length > 0) {
    const lastLog = pages[0];
    suggestedBean = lastLog.beans ?? "";
    suggestedRoaster = lastLog.roaster ?? "";
    suggestedDose = lastLog.dose ?? 18;
    suggestedWater = lastLog.water ?? 300;
  }

  # Calculate top brew methods
  if (stats && pages.length > 0) {
    const methods = pages.map(p => p["brew-method"]).filter(m => m);
    const methodCounts = stats.frequencyDistribution(methods);
    const topMethodsList = stats.topN(methods, 3).map(m => m.value);
    if (topMethodsList.length > 0) {
      topMethods = topMethodsList;
    }
  }
} catch (error) {
  # Silently fallback to defaults
  console.log("Data query failed, using defaults");
}

# ============================================
# SECTION 4: User Input with Smart Defaults
# ============================================

const beanName = await tp.system.prompt("Bean name", suggestedBean || "Ethiopian Yirgacheffe");
const roasterName = await tp.system.prompt("Roaster", suggestedRoaster || "Local Roaster");

const brewMethod = await tp.system.suggester(
  ["V60", "Chemex", "Aeropress", "French Press", "Espresso", "Cold Brew", "Moka Pot"],
  ["v60", "chemex", "aeropress", "french-press", "espresso", "cold-brew", "moka-pot"]
);

const roastLevel = await tp.system.suggester(
  ["Light", "Medium-Light", "Medium", "Medium-Dark", "Dark"],
  ["light", "medium-light", "medium", "medium-dark", "dark"]
);

const defaultGrind = getDefaultGrindSize(brewMethod);
const grindSize = await tp.system.suggester(
  ["Extra Fine", "Fine", "Medium-Fine", "Medium", "Medium-Coarse", "Coarse", "Extra Coarse"],
  ["extra-fine", "fine", "medium-fine", "medium", "medium-coarse", "coarse", "extra-coarse"]
);

const dose = parseFloat(await tp.system.prompt("Coffee dose (g)", String(suggestedDose)));
const water = parseFloat(await tp.system.prompt("Water (g)", String(suggestedWater)));
const brewRatio = calculateRatio(dose, water);

const defaultTemp = getDefaultTemp(roastLevel, brewMethod);
const waterTemp = parseFloat(await tp.system.prompt("Water temp (°C)", String(defaultTemp)));

const defaultTime = getDefaultBrewTime(brewMethod);
const brewTime = await tp.system.prompt("Brew time", defaultTime);

const rating = validateRating(await tp.system.prompt("Rating (1-5)", "4.0"));

const origin = await tp.system.suggester(
  ["Ethiopia", "Colombia", "Guatemala", "Kenya", "Brazil", "Costa Rica", "Peru", "Honduras", "Rwanda", "Panama", "Yemen", "Indonesia", "Unknown"],
  ["Ethiopia", "Colombia", "Guatemala", "Kenya", "Brazil", "Costa Rica", "Peru", "Honduras", "Rwanda", "Panama", "Yemen", "Indonesia", ""]
) || "";

# ============================================
# SECTION 5: Property Initialization
# ============================================

const properties = {
  type: "coffee-log",
  date: currentDate,
  time: currentTime,
  beans: beanName,
  roaster: roasterName,
  origin: origin,
  "roast-level": roastLevel,
  "brew-method": brewMethod,
  "grind-size": grindSize,
  dose: dose,
  water: water,
  "brew-ratio": brewRatio,
  "water-temperature": waterTemp,
  "brew-time": brewTime,
  rating: rating,
  "cups-brewed": 1,
  "flavor-notes": [],
  "would-rebuy": null,
  status: "active",
  tags: ["coffee-log", currentDate.substring(0, 7)]
};
%>
type: <%= properties.type %>
date: <%= properties.date %>
time: <%= properties.time %>
beans: <%= properties.beans %>
roaster: <%= properties.roaster %>
origin: <%= properties.origin %>
roast-level: <%= properties["roast-level"] %>
brew-method: <%= properties["brew-method"] %>
grind-size: <%= properties["grind-size"] %>
dose: <%= properties.dose %>
water: <%= properties.water %>
brew-ratio: <%= properties["brew-ratio"] %>
water-temperature: <%= properties["water-temperature"] %>
brew-time: <%= properties["brew-time"] %>
rating: <%= properties.rating %>
cups-brewed: <%= properties["cups-brewed"] %>
flavor-notes: <%= JSON.stringify(properties["flavor-notes"]) %>
would-rebuy: <%= properties["would-rebuy"] %>
status: <%= properties.status %>
tags: <%= JSON.stringify(properties.tags) %>
---

# ☕ Coffee Log: <%= beanName %> | <%= currentDate %>

**Rating**: ⭐ <%= rating %>/5.0
**Method**: <%= brewMethod.toUpperCase() %>
**Date**: <%= currentDate %> at <%= currentTime %>

---

## 🎯 Tasting Notes

<% tp.file.cursor() %>

---

## ⚙️ Brewing Parameters

| Parameter | Value |
|-----------|-------|
| **Brew Method** | <%= brewMethod %> |
| **Coffee Dose** | <%= dose %>g |
| **Water** | <%= water %>g |
| **Ratio** | <%= brewRatio %> |
| **Grind Size** | <%= grindSize %> |
| **Water Temperature** | <%= waterTemp %>°C (<%= Math.round(waterTemp * 9/5 + 32) %>°F) |
| **Brew Time** | <%= brewTime %> |

---

## 🌈 Flavor Profile

**Primary Flavor Notes**:
-
-
-

**Secondary Notes**:
-
-

**Sensory Attributes**:
- **Acidity**: (1-10)
- **Sweetness**: (1-10)
- **Body**: (1-10)
- **Finish**: (short/medium/long)

---

## 📊 Assessment

**What Worked Well**:
-

**What Could Be Improved**:
-

**Next Time, Try**:
-

**Would I Buy Again?**: [ ] Yes / [ ] Maybe / [ ] No

---

## 🔗 Related Brewing Sessions

**Recent logs from this roaster**:
```dataview
TABLE rating as "⭐", date as "Date", brew-method as "Method", beans as "Beans"
FROM "Coffee Logs"
WHERE roaster = this.roaster AND file.name != this.file.name
SORT date DESC
LIMIT 5
```

**Best brews with this method (4.0+)**:
```dataview
TABLE rating as "⭐", beans as "Beans", roaster as "Roaster", date as "Date"
FROM "Coffee Logs"
WHERE brew-method = this.brew-method AND rating >= 4.0 AND file.name != this.file.name
SORT rating DESC, date DESC
LIMIT 5
```

**Similar origins**:
```dataview
TABLE rating as "⭐", beans as "Beans", roaster as "Roaster", brew-method as "Method"
FROM "Coffee Logs"
WHERE origin = this.origin AND file.name != this.file.name
SORT rating DESC
LIMIT 5
```

---

**Navigation**: ← [[Coffee Log]] | [[Analytics/Monthly Dashboard|Dashboard]] | [[Daily Note|Today]] →
