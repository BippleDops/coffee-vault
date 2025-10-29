---
type: bean-profile
bean-name: <% tp.system.prompt("Bean name") %>
roaster: [[<% tp.system.prompt("Roaster name") %>]]
origin: <% tp.system.suggester(["Ethiopia", "Colombia", "Guatemala", "Kenya", "Brazil", "Costa Rica", "Peru", "Honduras", "Rwanda", "Panama"], ["Ethiopia", "Colombia", "Guatemala", "Kenya", "Brazil", "Costa Rica", "Peru", "Honduras", "Rwanda", "Panama"]) %>
roast-level: <% tp.system.suggester(["Light", "Medium", "Dark", "Medium-Light", "Medium-Dark"], ["light", "medium", "dark", "medium-light", "medium-dark"]) %>
roast-date: <% tp.system.prompt("Roast date (YYYY-MM-DD)", tp.date.now("YYYY-MM-DD", -7)) %>
purchase-date: <% tp.date.now("YYYY-MM-DD") %>
price: <% tp.system.prompt("Price paid ($)", "18.00") %>
weight: <% tp.system.prompt("Weight (grams)", "340") %>
status: active
tags: [bean-profile, <% tp.frontmatter.origin.toLowerCase() %>]
---

# 🫘 <% tp.frontmatter["bean-name"] %>

**Roaster**: <% tp.frontmatter.roaster %>  
**Origin**: <% tp.frontmatter.origin %>  
**Roast Level**: <% tp.frontmatter["roast-level"] %>  
**Purchase Date**: <% tp.frontmatter["purchase-date"] %>  
**Price**: $<% tp.frontmatter.price %> (<% (parseFloat(tp.frontmatter.price) / (parseFloat(tp.frontmatter.weight) / 28.35)).toFixed(2) %>/oz)

---

## 📦 Bean Details

**Roast Date**: <% tp.frontmatter["roast-date"] %>  
**Weight**: <% tp.frontmatter.weight %>g (<% (parseFloat(tp.frontmatter.weight) / 28.35).toFixed(1) %>oz)  
**Status**: <% tp.frontmatter.status %>  
**Days Since Roast**: <% Math.floor((new Date(tp.frontmatter["purchase-date"]) - new Date(tp.frontmatter["roast-date"])) / (1000 * 60 * 60 * 24)) %> days

## ☕ Roaster's Description

<% tp.file.cursor() %>

## 🎨 Expected Flavor Profile

**Tasting Notes** (from roaster):
- 
- 
- 

**Processing Method**: 
**Varietal**: 
**Altitude**: 

## 📊 My Overall Assessment

**Cumulative Rating**: ⭐⭐⭐⭐⭐ (calculating from logs below)

**Flavor Experience**:
- 

**Best Brew Method for These Beans**:
- 

**Ideal Parameters**:
- Grind: 
- Temp: 
- Ratio: 

## 💭 Notes & Observations

### First Impressions


### After Multiple Brews


### Final Verdict


## 🔄 Would I Rebuy?

**Decision**: [ ] Yes / [ ] Maybe / [ ] No

**Reason**:


## 📝 All Brewing Logs

```dataview
TABLE 
  rating as "⭐ Rating",
  brew-method as "Method",
  date as "Date",
  would-rebuy as "Rebuy?"
FROM "Coffee Logs"
WHERE beans = this.bean-name OR contains(beans, this.bean-name)
SORT date DESC
```

## 📈 Statistics

```dataview
TABLE WITHOUT ID
  length(rows) as "Total Brews",
  round(average(rows.rating), 2) as "Avg Rating",
  sum(rows.cups-brewed) as "Total Cups"
FROM "Coffee Logs"
WHERE beans = this.bean-name OR contains(beans, this.bean-name)
```

---

**Related Beans**: (manually link similar beans here)
- 

**Origin Profile**: [[Origins/<% tp.frontmatter.origin %>]]  
**Roaster Profile**: <% tp.frontmatter.roaster %>

