---
type: recipe-profile
name: <% tp.system.prompt("Recipe name") %>
brew-method: <% tp.system.suggester(["V60", "Chemex", "Aeropress", "French Press", "Espresso", "Moka Pot", "Clever", "Kalita Wave", "Siphon", "Cold Brew", "Other"], ["v60", "chemex", "aeropress", "french-press", "espresso", "moka-pot", "clever", "kalita-wave", "siphon", "cold-brew", "other"]) %>
created-date: <% tp.date.now("YYYY-MM-DD") %>
recipe-author: <% tp.system.prompt("Recipe author (your name)", "Me") %>
status: active
tags: [recipe-profile, <% tp.frontmatter["brew-method"] %>]
---

# 📖 Recipe: <% tp.frontmatter.name %>

**Brew Method**: <% tp.frontmatter["brew-method"] %>  
**Author**: <% tp.frontmatter["recipe-author"] %>  
**Created**: <% tp.frontmatter["created-date"] %>  
**Version**: 1.0

---

## 📋 Recipe Information

**Description**:  


**Recipe Source**:  
**Derived From**:  
**Based On**:  

---

## 🫘 Target Bean Characteristics

**Ideal Origin**:  
**Preferred Varieties**:
- 

**Preferred Processing**:  
**Target Roast Level**:  
**Target Roast Style**:  

**Works Well With**:
- 

**Avoid With**:
- 

---

## 🛠️ Equipment Requirements

**Required Equipment**:
- 
- 

**Brewer Model**:  
**Grinder Required**: [ ] Yes / [ ] No  
**Grinder Type**:  
**Filter Type**:  
**Scale Needed**: [ ] Yes / [ ] No  
**Timer Needed**: [ ] Yes / [ ] No  
**Gooseneck Kettle**: [ ] Yes / [ ] No  

**Optional Equipment**:
- 

---

## ⚙️ Recipe Parameters

**Core Parameters**:
- **Dose**:  g
- **Water**:  g/ml
- **Ratio**: 1:
- **Grind Size**:  
- **Grind Setting**:  
- **Water Temperature**:  °C
- **Total Brew Time**:  : 

**Parameter Ranges** (flexible adjustments):
- **Dose Range**:  -  g
- **Water Range**:  -  g/ml
- **Ratio Range**: 1:  - 1:
- **Grind Range**:  -  
- **Temp Range**:  -  °C
- **Time Range**:  :  -  :

---

## 📝 Step-by-Step Instructions

### Detailed Steps

<% tp.file.cursor() %>

### Timed Steps

| Time | Action |
|------|--------|
| 0:00 |  |
|      |  |
|      |  |

### Technique Notes

**Pour Technique**:  
**Agitation Method**:  
**Bloom Time**:  :  
**Bloom Water**:  g  
**Pour Count**:  
**Pour Pattern**:  

---

## ✅ Success Metrics

**Target Outcomes**:
- **Target TDS**:  %
- **Target Extraction Yield**:  %
- **Target Strength**:  
- **Target Flavor Profile**:  

**Success Criteria**:  


**Signs of Success**:
- 
- 

**Signs of Failure**:
- 
- 

**Troubleshooting Cues**:  


---

## 🔄 Recipe Variations

**Variations**:
- 

**When to Use Variations**:  


**Alternative Ratios**:
- 

**Alternative Temperatures**:
- 

**Winter Version**:  


**Summer Version**:  


---

## 📊 Usage Statistics

**Times Used**: 0  
**Success Rate**:  %  
**Average Rating**: ⭐⭐⭐⭐⭐  
**Best Rating**: ⭐⭐⭐⭐⭐  
**Last Used**:  
**First Used**:  

**Beans Used With**:
- 

**Best Bean Match**:  
**Most Used With**:  

---

## 💡 Tips & Troubleshooting

**Tips**:  


**Common Mistakes**:  


**Adjustment Guide**:  


**Troubleshooting**:  


---

## 📝 Notes

<% tp.frontmatter.name %> works best when...


---

**Tags**: <% tp.frontmatter.tags.join(", ") %>

