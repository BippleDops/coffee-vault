---
<%*
# Load helper functions for intelligent suggestions
let helpers;
try {
  helpers = await tp.user.require("Scripts/template-helpers.js");
} catch (error) {
  console.log("Helper functions not available, using defaults");
}

# Get smart suggestions from vault history
let recentBeans = [];
let topMethods = ["Pour Over", "French Press", "Espresso", "Aeropress", "Cold Brew"];
let suggestedBean = "";
let suggestedRoaster = "";

if (helpers) {
  try {
    const beans = await helpers.getRecentBeans(app, 30);
    if (beans && beans.length > 0) {
      recentBeans = beans;
      suggestedBean = beans[0].name || "";
      suggestedRoaster = beans[0].roaster ? beans[0].roaster.replace("Beans Library/", "").replace(".md", "") : "";
    }

    const methods = await helpers.getTopBrewMethods(app, 5);
    if (methods && methods.length > 0) {
      topMethods = methods.map(m => helpers.formatBrewMethod(m));
    }
  } catch (error) {
    console.log("Error loading suggestions:", error);
  }
}

# Prompt for required properties with smart defaults
const beanName = await tp.system.prompt("Bean name/blend", suggestedBean);
const roasterName = await tp.system.prompt("Roaster name", suggestedRoaster);
const origin = await tp.system.suggester(
  ["Ethiopia", "Colombia", "Guatemala", "Kenya", "Brazil", "Costa Rica", "Peru", "Honduras", "Rwanda", "Panama", "Other"],
  ["Ethiopia", "Colombia", "Guatemala", "Kenya", "Brazil", "Costa Rica", "Peru", "Honduras", "Rwanda", "Panama", ""]
);
const roastLevel = await tp.system.suggester(
  ["Light", "Medium-Light", "Medium", "Medium-Dark", "Dark"],
  ["light", "medium-light", "medium", "medium-dark", "dark"]
);

# Brew method with personalized suggestions
const brewMethodDisplay = await tp.system.suggester(
  topMethods.concat(["Moka Pot", "Chemex", "Siphon", "V60"]),
  topMethods.map(m => m.toLowerCase().replace(" ", "-")).concat(["moka-pot", "chemex", "siphon", "v60"])
);

# Get intelligent grind size suggestion
let suggestedGrind = "medium-fine";
if (helpers) {
  suggestedGrind = await helpers.getRecommendedGrindSize(app, brewMethodDisplay) || helpers.getDefaultGrindSize(brewMethodDisplay);
}

const grindSize = await tp.system.suggester(
  ["Extra Fine", "Fine", "Medium-Fine", "Medium", "Medium-Coarse", "Coarse", "Extra Coarse"],
  ["extra-fine", "fine", "medium-fine", "medium", "medium-coarse", "coarse", "extra-coarse"],
);

# Get intelligent temperature and time suggestions
let suggestedTemp = "200";
let suggestedTime = "3.5";
let suggestedRatio = "1:16";

if (helpers) {
  suggestedTemp = String(helpers.getRecommendedWaterTemp(roastLevel, brewMethodDisplay));
  suggestedTime = String(helpers.getRecommendedBrewTime(brewMethodDisplay));
  suggestedRatio = helpers.getRecommendedRatio(brewMethodDisplay);
}

const waterTemp = await tp.system.prompt("Water temperature (°F)", suggestedTemp);
const brewTime = await tp.system.prompt("Brew time (minutes)", suggestedTime);
const ratio = await tp.system.prompt("Coffee:Water ratio", suggestedRatio);
const rating = await tp.system.prompt("Rating (1-5)", "4.0");

# Validate rating
const validatedRating = helpers ? helpers.validateRating(rating) : parseFloat(rating);
%>
date: <% tp.date.now("YYYY-MM-DD") %>
time: <% tp.date.now("HH:mm") %>
type: coffee-log
beans: <% beanName %>
roaster: "[[<%  roasterName  %>]"]
origin: <% origin %>
roast-level: <% roastLevel %>
brew-method: <% brewMethodDisplay %>
grind-size: <% grindSize %>
water-temp: <% waterTemp %>
brew-time: <% brewTime %>
ratio: <% ratio %>
rating: <% validatedRating %>
cups-brewed: 1
flavor-notes: []
would-rebuy: false
tags: "[coffee, <%  tp.date.now("YYYY/MM")  %>]"
status: draft
---

# ☕ Coffee Log: <% tp.file.title %>

**Date**: <% tp.frontmatter.date %> at <% tp.frontmatter.time %>
**Beans**: "[[<%  tp.frontmatter.beans  %>]"]
**Roaster**: <% tp.frontmatter.roaster %>
**Origin**: <% tp.frontmatter.origin %>
**Rating**: <% helpers ? helpers.formatRating(tp.frontmatter.rating) : '⭐ ' + tp.frontmatter.rating %>/5

---

## 🎯 Tasting Notes

<% tp.file.cursor() %>

## ⚙️ Brewing Parameters

- **Method**: <% helpers ? helpers.formatBrewMethod(tp.frontmatter["brew-method"]) : tp.frontmatter["brew-method"] %>
- **Grind Size**: <% tp.frontmatter["grind-size"] %>
- **Water Temperature**: <% tp.frontmatter["water-temp"] %>°F
- **Brew Time**: <% tp.frontmatter["brew-time"] %> minutes
- **Coffee:Water Ratio**: <% tp.frontmatter.ratio %>

## 🌈 Flavor Profile

**Primary Notes**:
-
-
-

**Secondary Notes**:
-
-

**Overall Character**: (body, acidity, sweetness, finish)

## 📊 Assessment

**What I Loved**:
-

**What Could Be Better**:
-

**Would I Buy Again?**: <% tp.frontmatter["would-rebuy"] ? "✅ Yes" : "❌ Not likely" %>

## 🔗 Related

**Other Logs from This Roaster**:
```dataview
TABLE rating as "⭐", date as "Date", brew-method as "Method"
FROM "Coffee Logs"
WHERE roaster = this.roaster AND file.name != this.file.name
SORT date DESC
LIMIT 5
```

**Other Logs from This Origin**:
```dataview
TABLE rating as "⭐", beans as "Beans", roaster as "Roaster", date as "Date"
FROM "Coffee Logs"
WHERE origin = this.origin AND file.name != this.file.name
SORT rating DESC
LIMIT 5
```

**Similar Brew Methods (Rated 4+)**:
```dataview
TABLE rating as "⭐", beans as "Beans", date as "Date", grind-size as "Grind"
FROM "Coffee Logs"
WHERE brew-method = this.brew-method AND rating >= 4.0 AND file.name != this.file.name
SORT rating DESC
LIMIT 5
```

---

← [[<% tp.date.now("YYYY-MM-DD", -1) %>]] | [[Daily Notes/<% tp.date.now("YYYY-MM-DD") %>|Today]] | [[<% tp.date.now("YYYY-MM-DD", 1) %>]] →
