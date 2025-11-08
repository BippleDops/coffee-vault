---
type: training-plan
plan-name: <% tp.system.prompt("Training plan name") %>
plan-id: <% tp.date.now("YYYYMMDDHHmmss") %>-<% Math.random().toString(36).substring(2, 8) %>
created-date: <% tp.date.now("YYYY-MM-DD") %>

# Training Overview
training-category: <% tp.system.suggester(["Sensory development", "Brewing mastery", "Roasting skills", "Cupping & evaluation", "Coffee knowledge", "Equipment proficiency", "Barista skills", "Quality control", "Processing methods", "Coffee science"], ["sensory-development", "brewing-mastery", "roasting-skills", "cupping-evaluation", "coffee-knowledge", "equipment-proficiency", "barista-skills", "quality-control", "processing-methods", "coffee-science"]) %>

focus-area: <% tp.system.prompt("Specific focus area", "Pour-over technique") %>
# What specific skill or knowledge domain?

skill-level: <% tp.system.suggester(["Beginner", "Intermediate", "Advanced", "Expert"], ["beginner", "intermediate", "advanced", "expert"]) %>
# Current proficiency level

target-level: <% tp.system.suggester(["Intermediate", "Advanced", "Expert", "Professional", "Master"], ["intermediate", "advanced", "expert", "professional", "master"]) %>
# Desired proficiency level

# Timeline
start-date: <% tp.date.now("YYYY-MM-DD") %>
target-completion-date: <% tp.system.prompt("Target completion date (YYYY-MM-DD)", tp.date.now("YYYY-MM-DD", 90)) %>
estimated-duration: <% tp.system.prompt("Estimated duration (weeks)", "12") %>
time-commitment: <% tp.system.prompt("Weekly time commitment (hours)", "5-7") %>

# Progress Tracking
status: <% tp.system.suggester(["not-started", "in-progress", "paused", "completed", "archived"], ["not-started", "in-progress", "paused", "completed", "archived"]) %>
progress-percentage: 0
# 0-100 (updated as milestones are completed)

current-phase: <% tp.system.prompt("Current phase/stage", "Phase 1") %>
completion-date: ""
# Actual completion date (filled when status = completed)

# Learning Style & Preferences
learning-style: <% tp.system.suggester(["Visual", "Hands-on", "Reading/Research", "Structured", "Experimental", "Mixed"], ["visual", "hands-on", "reading", "structured", "experimental", "mixed"]) %>
preferred-resources: []
# Books, videos, courses, mentors, etc.

practice-frequency: <% tp.system.suggester(["Daily", "3-4x per week", "2-3x per week", "Weekly", "As available"], ["daily", "3-4x-week", "2-3x-week", "weekly", "flexible"]) %>

# Motivation & Goals
primary-motivation: <% tp.system.prompt("Why pursue this training?", "Improve daily coffee quality") %>
# Why are you pursuing this training?

success-criteria: []
# How will you know you've achieved your goal?

# Resources & Support
budget: <% tp.system.prompt("Training budget (optional)", "$0-500") %>
equipment-needed: []
materials-needed: []
mentor-coach: <% tp.system.prompt("Mentor/coach (optional)", "Self-directed") %>

# Relationships
relationships:
  related-goals: [[<% tp.system.prompt("Related goal (optional)", "") %>]]
  experiments: []
  practice-logs: []
  reference-materials: []

# Metadata
tags: [training-plan, <% tp.frontmatter["training-category"] %>, <% tp.frontmatter["skill-level"] %>-to-<% tp.frontmatter["target-level"] %>, <% tp.date.now("YYYY-MM") %>]
priority: <% tp.system.suggester(["high", "medium", "low"], ["high", "medium", "low"]) %>

---

# 🎓 Training Plan: <% tp.frontmatter["plan-name"] %>

**Category**: <% tp.frontmatter["training-category"] %>
**Focus**: <% tp.frontmatter["focus-area"] %>
**Level**: <% tp.frontmatter["skill-level"] %> → <% tp.frontmatter["target-level"] %>
**Status**: <% tp.frontmatter.status %>
**Progress**: <% tp.frontmatter["progress-percentage"] %>%

**Duration**: <% tp.frontmatter["estimated-duration"] %> weeks (<% tp.frontmatter["start-date"] %> - <% tp.frontmatter["target-completion-date"] %>)
**Time Commitment**: <% tp.frontmatter["time-commitment"] %> hours/week

---

## 🎯 Learning Objectives

### Primary Goal
<% tp.frontmatter["primary-motivation"] %>

<% tp.file.cursor() %>

### Specific Objectives
By the end of this training, I will be able to:
1.
2.
3.
4.
5.

### Success Criteria
How I'll know I've achieved my goal:
<%* if (tp.frontmatter["success-criteria"] && tp.frontmatter["success-criteria"].length > 0) { %>
<% tp.frontmatter["success-criteria"].map(criterion => "- [ ] " + criterion).join("\n") %>
<%* } else { %>
- [ ]
- [ ]
- [ ]
<%* } %>

---

## 📚 Knowledge Foundation

### Prerequisites
**Required Knowledge**:
-

**Required Skills**:
-

**Required Equipment**:
<%* if (tp.frontmatter["equipment-needed"] && tp.frontmatter["equipment-needed"].length > 0) { %>
<% tp.frontmatter["equipment-needed"].map(eq => "- " + eq).join("\n") %>
<%* } else { %>
-
<%* } %>

### Current Assessment

**What I Already Know**:
-

**Knowledge Gaps**:
-

**Skills to Develop**:
-

**Baseline Performance**: ___ (measured by ___)

---

## 🗺️ Learning Path

### Phase 1: Foundation (Weeks 1-4)

**Objectives**:
- [ ]
- [ ]
- [ ]

**Key Concepts to Learn**:
1.
2.
3.

**Activities**:
- **Week 1**:
  - [ ]
  - [ ]
  - [ ]

- **Week 2**:
  - [ ]
  - [ ]
  - [ ]

- **Week 3**:
  - [ ]
  - [ ]
  - [ ]

- **Week 4**:
  - [ ]
  - [ ]
  - [ ]

**Resources**:
-

**Assessment**:
- [ ] Phase 1 checkpoint completed
- [ ] Skills demonstrated: ___
- [ ] Ready to advance: Yes / No

---

### Phase 2: Skill Building (Weeks 5-8)

**Objectives**:
- [ ]
- [ ]
- [ ]

**Key Concepts to Learn**:
1.
2.
3.

**Activities**:
- **Week 5**:
  - [ ]
  - [ ]
  - [ ]

- **Week 6**:
  - [ ]
  - [ ]
  - [ ]

- **Week 7**:
  - [ ]
  - [ ]
  - [ ]

- **Week 8**:
  - [ ]
  - [ ]
  - [ ]

**Practice Exercises**:
1.
2.
3.

**Resources**:
-

**Assessment**:
- [ ] Phase 2 checkpoint completed
- [ ] Skills demonstrated: ___
- [ ] Ready to advance: Yes / No

---

### Phase 3: Mastery & Refinement (Weeks 9-12)

**Objectives**:
- [ ]
- [ ]
- [ ]

**Key Concepts to Learn**:
1.
2.
3.

**Activities**:
- **Week 9**:
  - [ ]
  - [ ]
  - [ ]

- **Week 10**:
  - [ ]
  - [ ]
  - [ ]

- **Week 11**:
  - [ ]
  - [ ]
  - [ ]

- **Week 12**:
  - [ ]
  - [ ]
  - [ ]

**Advanced Practice**:
1.
2.
3.

**Resources**:
-

**Assessment**:
- [ ] Phase 3 checkpoint completed
- [ ] Skills demonstrated: ___
- [ ] Final assessment passed: Yes / No

---

## 📖 Resource Library

### Books & Publications
<%* if (tp.frontmatter["training-category"] === "sensory-development") { %>
**Recommended**:
- [ ] _The Coffee Taster's Flavor Wheel_ (SCA)
- [ ] _The World Atlas of Coffee_ by James Hoffmann
- [ ] _Sensory Evaluation of Food: Principles and Practices_ by Harry T. Lawless
- [ ] _Coffee: A Comprehensive Guide to the Bean, the Beverage, and the Industry_ by Robert W. Thurston
<%* } else if (tp.frontmatter["training-category"] === "brewing-mastery") { %>
**Recommended**:
- [ ] _The Coffee Brewing Handbook_ by Ted R. Lingle
- [ ] _Water for Coffee_ by Maxwell Colonna-Dashwood
- [ ] _Everything But Espresso_ by Scott Rao
- [ ] _The Physics of Filter Coffee_ by Jonathan Gagne
<%* } else { %>
**Recommended**:
- [ ]
- [ ]
- [ ]
<%* } %>

### Online Courses & Videos
-

### Scientific Papers & Articles
-

### Equipment Manuals & Guides
-

### Mentor/Expert Resources
**Mentor**: <% tp.frontmatter["mentor-coach"] %>
**Contact**: ___
**Availability**: ___

---

## 🏋️ Practice Exercises

### Daily Practice Routine

**Morning Routine** (15-20 minutes):
1.
2.
3.

**Focus Practice** (30-45 minutes):
1.
2.
3.

**Reflection** (10 minutes):
- Document observations
- Note improvements
- Identify challenges

### Weekly Practice Goals

**Week 1-4**:
- Frequency: <% tp.frontmatter["practice-frequency"] %>
- Focus: ___
- Exercises:
  1.
  2.
  3.

**Week 5-8**:
- Frequency: <% tp.frontmatter["practice-frequency"] %>
- Focus: ___
- Exercises:
  1.
  2.
  3.

**Week 9-12**:
- Frequency: <% tp.frontmatter["practice-frequency"] %>
- Focus: ___
- Exercises:
  1.
  2.
  3.

### Practice Log Template

Use this format to document practice sessions:
```
Date: YYYY-MM-DD
Duration: ___ minutes
Focus: ___
What I practiced:
-
-
What went well:
-
What needs work:
-
Next session plan:
-
```

---

## 📊 Assessment Criteria

### Skill Progression Checklist

**Beginner Level** ✓:
- [ ] Understands basic concepts
- [ ] Can perform fundamental techniques
- [ ] Recognizes major differences
- [ ] Follows standard procedures
- [ ] Asks informed questions

**Intermediate Level**:
- [ ] Demonstrates consistent technique
- [ ] Identifies subtle differences
- [ ] Troubleshoots common problems
- [ ] Adapts methods to context
- [ ] Explains concepts to others

**Advanced Level**:
- [ ] Executes techniques with precision
- [ ] Recognizes complex patterns
- [ ] Innovates and experiments
- [ ] Teaches others effectively
- [ ] Contributes to community knowledge

**Expert/Professional Level**:
- [ ] Masters multiple techniques
- [ ] Detects minute variations
- [ ] Develops new methodologies
- [ ] Mentors and coaches
- [ ] Publishes or shares expertise widely

### Evaluation Methods

**Self-Assessment**:
- Weekly reflection journal
- Progress photos/videos
- Skill checklist review

**Objective Measures**:
<%* if (tp.frontmatter["training-category"] === "sensory-development") { %>
- Triangle test accuracy (target: 70%+)
- Cupping score consistency (±2 points)
- Flavor identification accuracy
- Calibration with reference standards
<%* } else if (tp.frontmatter["training-category"] === "brewing-mastery") { %>
- Extraction yield consistency (±0.5%)
- TDS variance (±0.1%)
- Brew time consistency (±10 seconds)
- Taste test ratings
<%* } else { %>
-
-
-
<%* } %>

**External Validation**:
- Mentor feedback
- Peer evaluation
- Certification exams (if applicable)
- Competition performance

---

## 🎯 Milestone Tracking

### Major Milestones

| Milestone | Target Date | Status | Completion Date | Notes |
|-----------|-------------|--------|-----------------|-------|
| Complete Phase 1 | Week 4 | ⏳ | | |
| First checkpoint assessment | Week 4 | ⏳ | | |
| Complete Phase 2 | Week 8 | ⏳ | | |
| Mid-program evaluation | Week 8 | ⏳ | | |
| Complete Phase 3 | Week 12 | ⏳ | | |
| Final assessment | Week 12 | ⏳ | | |
| Achieve target level | Week 12 | ⏳ | | |

### Weekly Progress Log

**Week 1**:
- Progress: ___%
- Accomplishments: ___
- Challenges: ___
- Adjustments: ___

**Week 2**:
- Progress: ___%
- Accomplishments: ___
- Challenges: ___
- Adjustments: ___

**Week 3**:
- Progress: ___%
- Accomplishments: ___
- Challenges: ___
- Adjustments: ___

_(Continue for all weeks)_

---

## 🔬 Related Experiments & Practice

### Sensory Experiments
```dataview
TABLE date as "Date", experiment-type as "Type", accuracy as "Accuracy", status as "Status"
FROM "Sensory Experiments"
WHERE contains(relationships.related-training-plan, [[<% tp.file.title %>]])
SORT date DESC
```

### Practice Logs
```dataview
TABLE date as "Date", type as "Type", rating as "Rating"
FROM "Coffee Logs"
WHERE contains(relationships.training-plan, [[<% tp.file.title %>]])
SORT date DESC
LIMIT 20
```

### Related Goals
<%* if (tp.frontmatter.relationships && tp.frontmatter.relationships["related-goals"]) { %>
<% tp.frontmatter.relationships["related-goals"] %>
<%* } %>

---

## 💰 Budget & Resources

**Total Budget**: <% tp.frontmatter.budget %>

### Budget Allocation

| Category | Estimated Cost | Actual Cost | Status |
|----------|----------------|-------------|--------|
| Equipment | $0 | $0 | ⏳ |
| Materials | $0 | $0 | ⏳ |
| Books/Courses | $0 | $0 | ⏳ |
| Coffee samples | $0 | $0 | ⏳ |
| Certification | $0 | $0 | ⏳ |
| Mentorship | $0 | $0 | ⏳ |
| **Total** | **$0** | **$0** | |

### Equipment Inventory

**Have**:
-

**Need to Acquire**:
<%* if (tp.frontmatter["equipment-needed"] && tp.frontmatter["equipment-needed"].length > 0) { %>
<% tp.frontmatter["equipment-needed"].map(eq => "- [ ] " + eq).join("\n") %>
<%* } else { %>
- [ ]
<%* } %>

### Materials & Supplies

**Consumables Needed**:
<%* if (tp.frontmatter["materials-needed"] && tp.frontmatter["materials-needed"].length > 0) { %>
<% tp.frontmatter["materials-needed"].map(mat => "- " + mat).join("\n") %>
<%* } else { %>
-
<%* } %>

---

## 🤝 Community & Support

### Learning Community

**Online Communities**:
- r/Coffee (Reddit)
- Home-Barista forums
- Coffee enthusiast Discord servers
- SCA community

**Local Resources**:
- Local coffee shops offering workshops
- Coffee roasters with training programs
- Barista competitions and events
- Coffee meetup groups

### Accountability System

**Accountability Partner**: ___
**Check-in Frequency**: ___
**Progress Sharing**: ___

**Community Engagement**:
- [ ] Share progress on social media
- [ ] Participate in forums
- [ ] Attend local events
- [ ] Join study groups

---

## 📝 Reflection & Continuous Improvement

### Monthly Reflections

**Month 1** (<% tp.date.now("YYYY-MM") %>):
- **Progress**: ___
- **What worked well**: ___
- **Challenges faced**: ___
- **Adjustments made**: ___
- **Energy/motivation level**: ___ /10
- **Key learnings**: ___

**Month 2** (<% tp.date.now("YYYY-MM", 30) %>):
- **Progress**: ___
- **What worked well**: ___
- **Challenges faced**: ___
- **Adjustments made**: ___
- **Energy/motivation level**: ___ /10
- **Key learnings**: ___

**Month 3** (<% tp.date.now("YYYY-MM", 60) %>):
- **Progress**: ___
- **What worked well**: ___
- **Challenges faced**: ___
- **Adjustments made**: ___
- **Energy/motivation level**: ___ /10
- **Key learnings**: ___

### Learning Insights

**Best Learning Methods for Me**:
-

**Most Effective Practice Techniques**:
-

**Breakthrough Moments**:
-

**Persistent Challenges**:
-

---

## 🏆 Completion & Next Steps

### Final Assessment

**Completion Date**: <% tp.frontmatter["completion-date"] || "_In progress_" %>
**Final Level Achieved**: ___
**Overall Progress**: <% tp.frontmatter["progress-percentage"] %>%

**Success Criteria Met**:
- [ ]
- [ ]
- [ ]

**Skills Mastered**:
1.
2.
3.

**Skills Still Developing**:
1.
2.
3.

### Certification/Recognition

**Certifications Earned**:
-

**Achievements**:
-

### What's Next?

**Advanced Training Opportunities**:
1.
2.
3.

**Related Skills to Develop**:
1.
2.
3.

**New Training Plan**:
- [ ] Create follow-up training plan
- Focus: ___
- Start date: ___

---

## 📚 Appendix

### Glossary
_Key terms and definitions learned_


### Reference Formulas
_Important calculations and recipes_


### Quick Reference Guides
_Cheat sheets and summaries_


### Progress Photos/Videos
_Visual documentation of improvement_


---

**Tags**: <% (tp.frontmatter.tags || []).join(", ") %>
**Priority**: <% tp.frontmatter.priority %>
**Status**: <% tp.frontmatter.status %> (<% tp.frontmatter["progress-percentage"] %>%)

---

*Coffee Vault - Training Plan Template*
*Structured learning path for coffee skill development*
