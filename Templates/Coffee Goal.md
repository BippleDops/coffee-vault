---
type: coffee-goal
goal-type: <% tp.system.suggester(["Learn Method", "Explore Origin", "Achieve Rating", "Complete Course", "Master Technique", "Visit Destination", "Purchase Equipment", "Try Beans Count", "Complete Certification", "Other"], ["learn-method", "explore-origin", "achieve-rating", "complete-course", "master-technique", "visit-destination", "purchase-equipment", "try-beans-count", "complete-certification", "other"]) %>
target-date: <% tp.system.prompt("Target completion date (YYYY-MM-DD)", tp.date.now("YYYY-MM-DD", 30)) %>
status: <% tp.system.suggester(["Planned", "In Progress", "Paused", "Completed", "Abandoned"], ["planned", "in-progress", "paused", "completed", "abandoned"]) %>
created-date: <% tp.date.now("YYYY-MM-DD") %>
priority: <% tp.system.suggester(["Low", "Medium", "High", "Critical"], ["low", "medium", "high", "critical"]) %>
tags: [coffee-goal, <% tp.frontmatter["goal-type"] %>]
---

# 🎯 Goal: <% tp.system.prompt("Goal title", "Coffee Goal") %>

**Goal Type**: <% tp.frontmatter["goal-type"] %>  
**Status**: <% tp.frontmatter.status %>  
**Priority**: <% tp.frontmatter.priority %>  
**Target Date**: <% tp.frontmatter["target-date"] %>  
**Created**: <% tp.frontmatter["created-date"] %>

---

## 📋 Goal Information

**Title**:  
**Description**:  


**Category**:  
**Start Date**:  

---

## 🎯 Target Metrics

**Specific Objectives**:  


**Quantitative Target**:  
**Qualitative Target**:  


**Success Criteria**:  


**Milestones**:
- [ ] 
- [ ] 
- [ ] 

**Current Progress**:  %  
**Progress Percentage**:  %

---

## 📚 Goal-Specific Details

### Learning Goals (if goal-type: learn-method, master-technique, complete-course)

**Method to Learn**:  
**Technique to Master**:  
**Course Name**:  
**Learning Resources**:
- 

**Practice Sessions Required**:  
**Practice Sessions Completed**:  

### Exploration Goals (if goal-type: explore-origin, try-beans-count)

**Origin to Explore**:  
**Beans to Try Count**:  
**Beans Tried Count**:  
**Origins Explored**:
- 

**Beans Discovered**:
- 

### Achievement Goals (if goal-type: achieve-rating, complete-certification)

**Target Rating**:  /5  
**Current Best Rating**:  /5  
**Certification Type**:  
**Certification Body**:  
**Exam Date**:  
**Study Hours Needed**:  
**Study Hours Completed**:  

### Equipment Goals (if goal-type: purchase-equipment)

**Equipment to Purchase**:  
**Budget**: $  
**Savings Needed**: $  
**Purchase Date Target**:  

### Travel Goals (if goal-type: visit-destination)

**Destination**:  
**Travel Budget**: $  
**Travel Dates Planned**:  

---

## 📊 Progress Tracking

**Progress Updates**:
- 

**Last Update**:  
**Next Checkpoint**:  
**Checkpoints Completed**:  /  

**Related Logs**:
- 

**Related Beans**:
- 

**Related Equipment**:
- 

**Related Resources**:
- 

---

## 📖 Resources & Support

**Learning Resources**:
- 

**Study Materials**:
- 

**Tools Needed**:
- 

**Mentor/Coach**:  
**Study Group**:  

**Related Guides**:
- 

**Related References**:
- 

**Related Beans**:
- 

**Related Roasters**:
- 

**Related Origins**:
- 

---

## ⏰ Timeline & Deadlines

**Created Date**: <% tp.frontmatter["created-date"] %>  
**Start Date**:  
**Target Date**: <% tp.frontmatter["target-date"] %>  
**Completed Date**:  
**Estimated Duration**:  
**Actual Duration**:  
**Deadline Approaching**: [ ] Yes / [ ] No  
**Deadline Overdue**: [ ] Yes / [ ] No

---

## ✅ Outcomes

**Completed**: [ ] Yes / [ ] No  
**Completion Date**:  
**Achievement Level**:  
**Actual Outcome**:  


**Lessons Learned**:  


**Challenges Faced**:  


**Success Factors**:  


**Improvements Needed**:  


---

## 🎉 Celebration

**Celebrated**: [ ] Yes / [ ] No  
**Celebration Notes**:  


**Next Goal**:  

---

## 💭 Notes

<% tp.file.cursor() %>

---

**Tags**: <% tp.frontmatter.tags.join(", ") %>

