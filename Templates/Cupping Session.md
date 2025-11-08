---
type: cupping-session
date: <% tp.date.now("YYYY-MM-DD") %>
protocol: <% tp.system.suggester(["SCA", "COE", "CQI", "Informal", "Custom", "Professional", "Training"], ["SCA", "COE", "CQI", "informal", "custom", "professional", "training"]) %>
session-type: <% tp.system.suggester(["Formal Cupping", "Comparison", "Blind Cupping", "Training", "Evaluation", "Competition", "Casual"], ["formal-cupping", "comparison", "blind-cupping", "training", "evaluation", "competition", "casual"]) %>
location: <% tp.system.prompt("Location", "Home") %>
status: active
tags: "[cupping-session, <%  tp.date.now("YYYY-MM")  %>]"
---

# ☕ Cupping Session - <% tp.date.now("MMMM DD, YYYY") %>

**Protocol**: <% tp.frontmatter.protocol %>  
**Session Type**: <% tp.frontmatter["session-type"] %>  
**Location**: <% tp.frontmatter.location %>  
**Date**: <% tp.frontmatter.date %>

---

## 👥 Participants

**Participants**:
- 

**Participant Count**:  
**Cupper Names**:  
**Cupper Levels**:  

---

## ☕ Samples Evaluated

**Samples**:
- 

**Sample Count**:  
**Blind Cupping**: [ ] Yes / [ ] No  
**Sample Labels** (if blind):  
- 
- 

**Reference Sample**:  

### Sample Preparation

**Roast Level Target**:  
**Roast Uniformity Check**: [ ] Yes / [ ] No  
**Grind Size**:  
**Grind Uniformity Check**: [ ] Yes / [ ] No  
**Sample Weight**: 12g (standard)  
**Cups per Sample**: 5 (standard)

---

## ⚙️ Cupping Setup

**Water**:
- **Temperature**:  °C (typically 93-96)
- **Water Type**:  
- **TDS**:  ppm

**Environment**:
- **Room Temperature**:  °C
- **Room Humidity**:  %
- **Lighting**:  
- **Distractions**: [ ] Yes / [ ] No

**Equipment**:
- **Cupping Spoons**:  
- **Cups Used**:  
- **Scoring Sheets**:  
- **Timer Used**: [ ] Yes / [ ] No
- **Scale Used**: [ ] Yes / [ ] No

---

## 📊 SCA Scoring Results

**Scoring System**: <% tp.frontmatter.protocol %>  
**Scores Recorded**: [ ] Yes / [ ] No  
**Consensus Scoring**: [ ] Yes / [ ] No

### Sample Scores & Rankings

| Sample | Score | Ranking | Specialty Grade? |
|--------|-------|---------|------------------|
|        |       |         |                  |
|        |       |         |                  |
|        |       |         |                  |

**Top Sample**:  
**Top Score**:  /100  
**Specialty Grade Count** (80+):  

---

## 🔍 Session Outcomes

### Key Discoveries

<% tp.file.cursor() %>

### Standout Samples

- 

### Surprises

- 

### Disappointments

- 

### Comparative Analysis

- **Best Value**:  
- **Most Complex**:  
- **Best Balance**:  
- **Most Unique**:  
- **Consensus Favorite**:  

### Recommendations

**Would Purchase**:
- 

**Would Not Purchase**:
- 

**Blending Potential**:  


**Roasting Recommendations**:  


---

## 📸 Documentation

**Cupping Sheets Photos**:  
- 

**Video Recording**:  
**Audio Notes**:  
**Photos**:  
- 

---

## 📝 Session Notes

**General Observations**:  


**Protocol Deviations**:  


**Environmental Factors**:  


**Learning Points**:  


**Next Steps**:  


---

## ⏱️ Session Details

**Duration**:  
**Intensity**:  
**Quality of Session**:  
**Would Repeat**: [ ] Yes / [ ] No

---

**Tags**: <% tp.frontmatter.tags.join(", ") %>

