---
type: coffee-log
date: <% tp.date.now("YYYY-MM-DD") %>
time: <% tp.date.now("HH:mm") %>
beans: <%*
// Smart bean suggestion from recent purchases
const beans = dv.pages('"Beans Library"')
  .where(p => p.type === "bean-profile" && p.status === "active")
  .sort(p => p["purchase-date"], 'desc')
  .map(p => p.name)
  .array()
  .slice(0, 10);

const selectedBean = beans.length > 0 
  ? await tp.system.suggester(beans, beans)
  : await tp.system.prompt("Bean name");

tR += selectedBean;
%>
roaster: <%*
// Auto-populate roaster from selected bean
const beanProfile = dv.pages('"Beans Library"')
  .where(p => p.name === tp.frontmatter.beans)
  .array()[0];

tR += beanProfile?.roaster || await tp.system.prompt("Roaster");
%>
origin: <% beanProfile?.origin || tp.system.prompt("Origin") %>
roast-level: <% beanProfile ? beanProfile["roast-level"] : tp.system.suggester(["Light", "Medium", "Dark"], ["light", "medium", "dark"]) %>
brew-method: <%*
// Suggest based on most used methods
const recentLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .sort(p => p.date, 'desc')
  .limit(20)
  .array();

const methodCounts = {};
recentLogs.forEach(log => {
  const method = log["brew-method"];
  methodCounts[method] = (methodCounts[method] || 0) + 1;
});

const topMethods = Object.keys(methodCounts)
  .sort((a, b) => methodCounts[b] - methodCounts[a])
  .slice(0, 5);

const allMethods = ["V60", "Chemex", "Aeropress", "French Press", "Espresso", "Moka Pot", "Clever", "Kalita Wave"];
const suggestedMethods = topMethods.length > 0 ? topMethods.map(m => m.toUpperCase()) : allMethods;

tR += await tp.system.suggester(suggestedMethods, suggestedMethods.map(m => m.toLowerCase()));
%>
grind-size: <%*
// Smart grind suggestion based on method and bean
const method = tp.frontmatter["brew-method"];
const grindSuggestions = {
  'v60': 'medium-fine',
  'chemex': 'medium',
  'aeropress': 'medium-fine',
  'french-press': 'coarse',
  'espresso': 'fine',
  'moka-pot': 'fine',
  'clever': 'medium-coarse'
};

const suggestedGrind = grindSuggestions[method] || 'medium-fine';
tR += await tp.system.suggester(
  ["Extra Fine", "Fine", "Medium-Fine", "Medium", "Medium-Coarse", "Coarse", "Extra-Coarse"],
  ["extra-fine", "fine", "medium-fine", "medium", "medium-coarse", "coarse", "extra-coarse"],
  false,
  suggestedGrind
) || suggestedGrind;
%>
dose: <% tp.system.prompt("Dose (grams)", "18") %>
water: <% tp.system.prompt("Water (grams)", "300") %>
brew-ratio: <%* 
const dose = parseFloat(tp.frontmatter.dose) || 18;
const water = parseFloat(tp.frontmatter.water) || 300;
tR += `1:${(water / dose).toFixed(1)}`;
%>
water-temperature: <%*
// Smart temperature based on roast level
const roast = tp.frontmatter["roast-level"];
const tempSuggestions = {
  'light': 94,
  'light-medium': 93,
  'medium': 92,
  'medium-dark': 91,
  'dark': 90
};
const suggestedTemp = tempSuggestions[roast] || 93;
tR += await tp.system.prompt("Water temperature (°C)", suggestedTemp.toString());
%>
brew-time: <% tp.system.prompt("Brew time (MM:SS)", "2:45") %>
rating: <% tp.system.prompt("Rating (1-5)", "4.0") %>
cups-brewed: <% tp.system.prompt("Cups brewed", "1") %>
status: active
tags: [coffee-log, <% tp.frontmatter.origin.toLowerCase() %>, <% tp.frontmatter["brew-method"] %>, <% tp.date.now("YYYY-MM") %>, year:<% tp.date.now("YYYY") %>]
relationships:
  uses-bean: [[<% tp.frontmatter.beans %>]]
---

# ☕ Coffee Log: <% tp.frontmatter.beans %> | <% tp.frontmatter.date %>

**Brew Method**: <% tp.frontmatter["brew-method"] %>  
**Rating**: <% "⭐".repeat(Math.floor(parseFloat(tp.frontmatter.rating))) %> (<% tp.frontmatter.rating %>/5)  
**Date**: <% tp.frontmatter.date %> at <% tp.frontmatter.time %>

---

## 🫘 Bean Information

**Bean**: [[<% tp.frontmatter.beans %>]]  
**Roaster**: <% tp.frontmatter.roaster %>  
**Origin**: [[Origins/<% tp.frontmatter.origin %>]]  
**Roast Level**: <% tp.frontmatter["roast-level"] %>  
**Days Off Roast**: <% beanProfile ? beanProfile["days-off-roast"] || "Unknown" : "Unknown" %>

---

## ⚙️ Brewing Parameters

| Parameter | Value |
|-----------|-------|
| **Dose** | <% tp.frontmatter.dose %>g |
| **Water** | <% tp.frontmatter.water %>g |
| **Ratio** | <% tp.frontmatter["brew-ratio"] %> |
| **Grind Size** | <% tp.frontmatter["grind-size"] %> |
| **Water Temp** | <% tp.frontmatter["water-temperature"] %>°C |
| **Brew Time** | <% tp.frontmatter["brew-time"] %> |
| **Cups** | <% tp.frontmatter["cups-brewed"] %> |

---

## 🎨 Flavor Notes

**Primary Flavors**:
<% tp.file.cursor() %>

**Tasting Notes**:


**Acidity**:  
**Body**:  
**Sweetness**:  
**Aftertaste**:

---

## 📊 Precision Measurements (Optional - Coffee Vault 5.0)

**Extraction Metrics**:
- **Extraction Mass**: g
- **First Drop Time**: : 
- **Total Output Weight**: g
- **Water Retention**: g

**Flow Metrics**:
- **Flow Rate**: ml/s
- **Drawdown Time**: : 

---

## 🌤️ Context & Environment (Optional - Coffee Vault 5.0)

**Weather**:
- **Condition**:  
- **Barometric Pressure**: mbar

**Personal State**:
- **Sleep Hours**: hours
- **Hydration**: 
- **Energy Level**:  
- **Palate State**: 

---

## 💭 Notes & Observations

**Brewing Notes**:


**What Worked Well**:


**Adjustments for Next Time**:


---

## 📸 Media Documentation

**Photos**: 
**Video**: 
**Audio Notes**:

---

## 🎯 Session Rating

**Overall**: <% tp.frontmatter.rating %>/5 ⭐

**Detailed Ratings** (optional):
- **Aroma**: /5
- **Flavor**: /5
- **Acidity**: /5
- **Body**: /5
- **Balance**: /5
- **Sweetness**: /5

**Would Brew Again**: [ ] Yes / [ ] No  
**Dialed In**: [ ] Yes / [ ] No

---

**Tags**: <% tp.frontmatter.tags.join(", ") %>

---

*Coffee Vault 5.0 - Enhanced intelligent logging*

