---
type: equipment-maintenance
equipment: <% tp.system.prompt("Equipment name") %>
maintenance-type: <% tp.system.suggester(["Cleaning", "Calibration", "Burr Replacement", "Descaling", "General Maintenance", "Repair"], ["cleaning", "calibration", "burr-replacement", "descaling", "general-maintenance", "repair"]) %>
date: <% tp.date.now("YYYY-MM-DD") %>
cost: <% tp.system.prompt("Cost (if any)", "0") %>
tags: "[equipment-maintenance, <%  tp.date.now("YYYY-MM")  %>]"
---

# 🔧 Equipment Maintenance: <% tp.frontmatter.equipment %>

**Maintenance Type**: <% tp.frontmatter["maintenance-type"] %>  
**Date**: <% tp.frontmatter.date %>  
**Cost**: $<% tp.frontmatter.cost %>

---

## 🛠️ Maintenance Details

**Equipment**: "[[Equipment/<%  tp.frontmatter.equipment  %>]"]  
**Last Maintenance**: (Check equipment profile)  
**Maintenance Frequency**: (From equipment profile)  
**Total Uses Since Last**: 

**Maintenance Type**: <% tp.frontmatter["maintenance-type"] %>

---

## ✅ Tasks Completed

- [ ] <% tp.file.cursor() %>
- [ ] 
- [ ] 

**Time Spent**: 

**Tools Used**:
- 

**Supplies Used**:
- 

---

## 📝 Observations

**Before Maintenance**:


**During Maintenance**:


**After Maintenance**:


**Issues Found**:


**Parts Replaced**:


---

## 📊 Performance Impact

**Before Maintenance**:
- Grind quality: /10
- Consistency: /10
- Speed: /10

**After Maintenance**:
- Grind quality: /10
- Consistency: /10
- Speed: /10

**Improvement**: 

---

## 💰 Cost Breakdown

**Labor**: $0 (DIY) or $<% tp.frontmatter.cost %>  
**Parts**: $  
**Supplies**: $  
**Total**: $<% tp.frontmatter.cost %>

---

## 📅 Next Maintenance

**Recommended Date**: <% tp.date.now("YYYY-MM-DD", 30) %> (30 days)  
**Based On**: Usage frequency, manufacturer recommendations  
**Set Reminder**: 

---

## 📸 Documentation

**Photos**:
- 

**Videos**:
- 

**Receipts**:
- 

---

## 💭 Notes

**What Went Well**:


**Challenges**:


**Tips for Next Time**:


**Resources Used**:


---

## 🔗 Related

**Equipment Profile**: "[[Equipment/<%  tp.frontmatter.equipment  %>]"]  
**Previous Maintenance**: (Link to last maintenance log)  
**Maintenance Schedule**: [[Analytics/Daily-Brewing-Layout/13-Equipment-Maintenance-Dashboard]]

---

**Tags**: equipment-maintenance, <% tp.date.now("YYYY-MM") %>

