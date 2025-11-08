---
type: coffee-log
date: <% tp.date.now("YYYY-MM-DD") %>
time: <% tp.date.now("HH:mm") %>
beans: <% tp.system.prompt("Bean name") %>
roaster: <% tp.system.prompt("Roaster") %>
origin: <% tp.system.suggester(["Ethiopia", "Colombia", "Kenya", "Guatemala", "Brazil", "Costa Rica", "Other"], ["Ethiopia", "Colombia", "Kenya", "Guatemala", "Brazil", "Costa Rica", "Other"]) %>
roast-level: <% tp.system.suggester(["Light", "Medium", "Dark", "Light-Medium", "Medium-Dark"], ["light", "medium", "dark", "light-medium", "medium-dark"]) %>
brew-method: <% tp.system.suggester(["V60", "Chemex", "Aeropress", "French Press", "Espresso", "Moka Pot", "Clever", "Kalita Wave", "Siphon", "Cold Brew"], ["v60", "chemex", "aeropress", "french-press", "espresso", "moka-pot", "clever", "kalita-wave", "siphon", "cold-brew"]) %>
grind-size: <% tp.system.suggester(["Extra Fine", "Fine", "Medium-Fine", "Medium", "Medium-Coarse", "Coarse", "Extra-Coarse"], ["extra-fine", "fine", "medium-fine", "medium", "medium-coarse", "coarse", "extra-coarse"]) %>
dose: <% tp.system.prompt("Dose (grams)", "18") %>
water: <% tp.system.prompt("Water (grams)", "300") %>
brew-ratio: <%* 
const dose = parseFloat(tp.frontmatter.dose) || 18;
const water = parseFloat(tp.frontmatter.water) || 300;
tR += `1:${(water / dose).toFixed(1)}`;
%>
water-temperature: <% tp.system.prompt("Water temperature (°C)", "93") %>
brew-time: <% tp.system.prompt("Brew time (MM:SS)", "2:45") %>
rating: <% tp.system.prompt("Rating (1-5)", "4.0") %>
cups-brewed: <% tp.system.prompt("Cups brewed", "1") %>
status: active
tags: "[coffee-log, <%  tp.frontmatter.origin.toLowerCase() %>, <% tp.frontmatter["brew-method"] %>, <% tp.date.now("YYYY-MM") %>, year: "<%  tp.date.now("YYYY")   %>]""
relationships: "uses-bean: "[[<%   tp.frontmatter.beans   %>]""]
---

# ☕ Coffee Log: <% tp.frontmatter.beans %> | <% tp.frontmatter.date %>

**Brew Method**: <% tp.frontmatter["brew-method"] %>  
**Rating**: <% "⭐".repeat(Math.floor(parseFloat(tp.frontmatter.rating))) %> (<% tp.frontmatter.rating %>/5)  
**Date**: <% tp.frontmatter.date %> at <% tp.frontmatter.time %>

---

## 🫘 Bean Information

**Bean**: "[[<%  tp.frontmatter.beans  %>]"]  
**Roaster**: <% tp.frontmatter.roaster %>  
**Origin**: "[[Origins/<%  tp.frontmatter.origin  %>]"]  
**Roast Level**: <% tp.frontmatter["roast-level"] %>  
**Days Off Roast**: (Check bean profile)

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

