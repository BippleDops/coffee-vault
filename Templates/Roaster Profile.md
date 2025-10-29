---
type: roaster-profile
roaster-name: <% tp.system.prompt("Roaster name") %>
location: <% tp.system.prompt("City, State/Country", "Portland, OR") %>
website: <% tp.system.prompt("Website URL (optional)", "") %>
specialty: <% tp.system.suggester(["Single Origin", "Blends", "Espresso", "Light Roasts", "Dark Roasts", "Variety"], ["single-origin", "blends", "espresso", "light-roasts", "dark-roasts", "variety"]) %>
first-tried: <% tp.date.now("YYYY-MM-DD") %>
tags: [roaster, coffee]
---

# ☕ <% tp.frontmatter["roaster-name"] %>

**Location**: <% tp.frontmatter.location %>  
**Specialty**: <% tp.frontmatter.specialty %>  
**First Tried**: <% tp.frontmatter["first-tried"] %>  
<% tp.frontmatter.website ? `**Website**: [${tp.frontmatter.website}](${tp.frontmatter.website})` : "" %>

---

## 📖 About the Roaster

<% tp.file.cursor() %>

## 🌟 Philosophy & Approach

**Roasting Style**:


**Sourcing Practices**:


**What Makes Them Unique**:


## 🫘 Beans I've Tried

```dataview
TABLE 
  bean-name as "Bean",
  origin as "Origin",
  purchase-date as "Purchased",
  status as "Status"
FROM "Beans Library"
WHERE contains(roaster, this.roaster-name)
SORT purchase-date DESC
```

## ☕ All Coffee Logs

```dataview
TABLE 
  beans as "Beans",
  rating as "⭐ Rating",
  brew-method as "Method",
  date as "Date"
FROM "Coffee Logs"
WHERE contains(roaster, this.roaster-name)
SORT date DESC
```

## 📊 Statistics

```dataview
TABLE WITHOUT ID
  length(rows) as "Total Sessions",
  round(average(rows.rating), 2) as "Avg Rating",
  min(rows.rating) as "Low",
  max(rows.rating) as "High"
FROM "Coffee Logs"
WHERE contains(roaster, this.roaster-name)
```

## 💭 Overall Impression

**Consistency**: 

**Value for Money**: 

**Favorite Offerings**:
- 

**Would I Buy From Again?**: 

## 🔗 Links & Resources

**Social Media**:
- Instagram: 
- Twitter: 

**Where to Buy**:
- 

**Notes**:

