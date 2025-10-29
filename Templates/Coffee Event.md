---
type: coffee-event
event-type: <% tp.system.suggester(["Cafe Visit", "Coffee Class", "Workshop", "Competition", "Festival", "Roastery Visit", "Cupping Event", "Coffee Tour", "Coffee Travel", "Other"], ["cafe-visit", "coffee-class", "workshop", "competition", "festival", "roastery-visit", "cupping-event", "coffee-tour", "coffee-travel", "other"]) %>
date: <% tp.date.now("YYYY-MM-DD") %>
name: <% tp.system.prompt("Event/Cafe/Experience name") %>
location: <% tp.system.prompt("Location") %>
status: active
tags: [coffee-event, <% tp.frontmatter["event-type"] %>, <% tp.date.now("YYYY-MM") %>]
---

# ☕ <% tp.frontmatter.name %>

**Event Type**: <% tp.frontmatter["event-type"] %>  
**Date**: <% tp.frontmatter.date %>  
**Location**: <% tp.frontmatter.location %>  
**Status**: <% tp.frontmatter.status %>

---

## 📍 Event Information

**Event Name**: <% tp.frontmatter.name %>  
**Event Type**: <% tp.frontmatter["event-type"] %>  
**Date**: <% tp.frontmatter.date %>  
**Time**:  
**Duration**:  
**Location**: <% tp.frontmatter.location %>  
**Address**:  
**City**:  
**Country**:  
**Coordinates**:  

---

## ☕ Cafe Visit Details (if event-type: cafe-visit)

**Cafe Name**:  
**Cafe Chain**: [ ] Yes / [ ] No  
**Roaster Affiliated**:  
**Atmosphere**:  
**Seating Capacity**:  
**WiFi Available**: [ ] Yes / [ ] No  
**Food Available**: [ ] Yes / [ ] No  
**Roasting On-Site**: [ ] Yes / [ ] No

**Coffees Tried**:
- 

**Beans Used**:
- 

**Roasters Featured**:
- 

**Methods Available**:
- 

**Barista Names**:
- 

---

## 🎓 Learning Experience (if event-type: coffee-class or workshop)

**Class Name**:  
**Instructor**:  
**Instructor Credentials**:  
**Class Level**:  
**Topics Covered**:
- 

**Skills Learned**:
- 

**Cost**: $  
**Certification Earned**: [ ] Yes / [ ] No  
**Certification Type**:  

---

## 🏆 Competition (if event-type: competition)

**Competition Name**:  
**Competition Type**:  
**Your Participation**:  
**Your Results**:  


**Winners**:
- 

**Learnings**:  


---

## 🎪 Festival/Event (if event-type: festival)

**Festival Name**:  
**Organizers**:
- 

**Vendors Present**:
- 

**Roasters Featured**:
- 

**Beans Discovered**:
- 

**Events Attended**:
- 

**Highlights**:  


---

## 🏭 Roastery Visit (if event-type: roastery-visit)

**Roastery Name**:  
**Roaster**:  
**Tour Taken**: [ ] Yes / [ ] No  
**Cupping Offered**: [ ] Yes / [ ] No  
**Beans Purchased**:
- 

**Equipment Seen**:
- 

**Roaster Met**:  
**Production Capacity**:  


---

## ✈️ Coffee Travel (if event-type: coffee-travel)

**Destination**:  
**Coffee Culture Observed**:  


**Local Methods**:
- 

**Coffee Shops Visited**:
- 

**Beans Purchased Abroad**:
- 

**Cultural Notes**:  


**Travel Photos**:
- 

---

## ⭐ Experience Assessment

**Overall Rating**: ⭐⭐⭐⭐⭐ (1-5)  
**Value Rating**: ⭐⭐⭐⭐⭐ (1-5)  
**Would Repeat**: [ ] Yes / [ ] No  
**Would Recommend**: [ ] Yes / [ ] No

**Highlights**:  


**Disappointments**:  


---

## 💰 Costs

**Total Cost**: $  
**Travel Cost**: $  
**Food Cost**: $  
**Coffee Cost**: $  

---

## 📸 Documentation

**Photos**:
- 

**Videos**:
- 

**Receipts**:
- 

**Swag Received**:
- 

**Contacts Made**:
- 

**Business Cards**:
- 

---

## 📝 Event Notes

<% tp.file.cursor() %>

**General Observations**:  


**Learnings**:  


**Insights**:  


**Follow-Up Actions**:
- 

---

**Tags**: <% tp.frontmatter.tags.join(", ") %>

