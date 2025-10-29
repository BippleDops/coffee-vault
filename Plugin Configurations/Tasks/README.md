# Tasks Plugin Integration for Coffee Vault

**Purpose**: Manage recurring maintenance, coffee-related tasks, and integrate tasks across daily notes and dashboard views.

## Overview

The Tasks plugin enables powerful task management with due dates, recurrence, priorities, and advanced queries. This configuration provides coffee-specific task templates, maintenance schedules, and dashboard views for tracking all coffee-related tasks.

## Installation Steps

1. **Install Tasks Plugin**
   - Open Obsidian Settings → Community Plugins
   - Browse and search for "Tasks"
   - Install and enable the plugin

2. **Configure Plugin Settings**
   - Go to Settings → Tasks
   - **Global Task Format**: Use emoji style
   - **Set Symbols**:
     - Due date: 📅
     - Scheduled: ⏳
     - Start: 🛫
     - Done: ✅
     - Priority: ⏫ 🔼 🔽
     - Recurrence: 🔁
   - **Enable**: Auto-suggest
   - **Enable**: Create or edit dialog

3. **Configure Task Storage**
   - Tasks can be in any note
   - Daily Notes ideal for recurring tasks
   - Dedicated task notes for projects
   - Coffee Logs can include follow-up tasks

## Task Template Library

### Recurring Maintenance Tasks

#### Weekly Grinder Cleaning
```markdown
- [ ] Clean coffee grinder (remove burrs, brush grounds) ⚙️ 🔁 every week on Sunday 📅 2025-10-27 #coffee-maintenance #grinder
```

#### Monthly Deep Cleaning
```markdown
- [ ] Deep clean espresso machine (backflush, descale) ⚙️ 🔁 every month on 1st 📅 2025-11-01 #coffee-maintenance #espresso
- [ ] Clean pour-over equipment (descale kettle, wash brewers) ⚙️ 🔁 every month on 1st 📅 2025-11-01 #coffee-maintenance
- [ ] Organize and clean coffee station ⚙️ 🔁 every month on 1st 📅 2025-11-01 #coffee-maintenance
```

#### Quarterly Tasks
```markdown
- [ ] Inventory coffee equipment and supplies 📦 🔁 every 3 months on 1st 📅 2026-01-01 #coffee-inventory
- [ ] Review and purge old coffee beans 🫘 🔁 every 3 months on 1st 📅 2026-01-01 #coffee-inventory
- [ ] Replace water filters 💧 🔁 every 3 months on 1st 📅 2026-01-01 #coffee-maintenance
```

#### Annual Tasks
```markdown
- [ ] Annual gear assessment and upgrade planning 🎯 🔁 every year on January 1st 📅 2026-01-01 #coffee-planning
- [ ] Coffee journey retrospective 📖 🔁 every year on December 31st 📅 2025-12-31 #coffee-reflection
- [ ] Organize coffee vault and archive old notes 📁 🔁 every year on January 1st 📅 2026-01-01 #coffee-admin
```

### Bean Management Tasks

```markdown
- [ ] Order new coffee beans from [[Roaster Name]] 🛒 📅 2025-10-30 #bean-acquisition
- [ ] Research new roasters for next order 🔍 📅 2025-11-05 #bean-research
- [ ] Create Bean Profile for [[New Bean Name]] 🫘 📅 2025-10-26 #bean-documentation
- [ ] Review and rate completed bean: [[Bean Name]] ⭐ 📅 2025-10-28 #bean-review
```

### Learning and Development Tasks

```markdown
- [ ] Watch James Hoffmann video on espresso dialing ⏫ 📺 📅 2025-10-28 #learning
- [ ] Practice V60 pour technique (10 brews) ☕ 📅 2025-11-01 #practice
- [ ] Read chapter 3 of Coffee Brewing Handbook 📚 📅 2025-10-29 #learning
- [ ] Create brewing guide for French Press 📝 📅 2025-11-03 #documentation
```

### Equipment Tasks

```markdown
- [ ] Research scale upgrade options 🔍 📅 2025-11-10 #equipment-research
- [ ] Order Baratza Encore ESP grinder 🛒 ⏫ 📅 2025-10-28 #equipment-purchase
- [ ] Set up and test new kettle ⚙️ 📅 2025-10-30 #equipment-setup
- [ ] Write review of [[Equipment Name]] 📝 📅 2025-11-05 #equipment-review
```

### Experimentation Tasks

```markdown
- [ ] Test lower temperature on Ethiopian light roast ☕ 📅 2025-10-27 #experiment
- [ ] Compare grind sizes for V60 (side-by-side) ☕ 📅 2025-10-28 #experiment
- [ ] Document findings from bloom timing experiment 📝 📅 2025-10-29 #documentation
```

## Task Queries for Dashboard

### Today's Coffee Tasks
```markdown
## Coffee Tasks Today

\`\`\`tasks
not done
(due today) OR (scheduled today)
(tags include #coffee OR path includes Coffee)
sort by priority
\`\`\`
```

### Overdue Coffee Tasks
```markdown
## Overdue

\`\`\`tasks
not done
due before today
(tags include #coffee OR path includes Coffee)
sort by due
\`\`\`
```

### Upcoming This Week
```markdown
## This Week

\`\`\`tasks
not done
due after today
due before in 7 days
(tags include #coffee OR path includes Coffee)
sort by due
\`\`\`
```

### Maintenance Due Soon
```markdown
## Maintenance Due

\`\`\`tasks
not done
tags include #coffee-maintenance
(due before in 14 days) OR (no due date)
sort by due
\`\`\`
```

### High Priority Coffee Tasks
```markdown
## High Priority

\`\`\`tasks
not done
(tags include #coffee OR path includes Coffee)
priority is high
sort by due
\`\`\`
```

### Tasks by Category
```markdown
## Bean Acquisition

\`\`\`tasks
not done
tags include #bean-acquisition
sort by due
\`\`\`

## Equipment

\`\`\`tasks
not done
tags include #equipment
sort by due
\`\`\`

## Learning

\`\`\`tasks
not done
tags include #learning
sort by due
\`\`\`

## Experiments

\`\`\`tasks
not done
tags include #experiment
sort by due
\`\`\`
```

### Recently Completed
```markdown
## Completed This Week

\`\`\`tasks
done
done after 7 days ago
(tags include #coffee OR path includes Coffee)
sort by done reverse
limit 10
\`\`\`
```

## Task Dashboard Template

Create a dedicated task dashboard note:

**File**: `/Users/jonsussmanstudio/Desktop/CodingObsidian/Views/Coffee-Tasks-Dashboard.md`

```markdown
---
type: dashboard
tags: [coffee, tasks, dashboard]
---

# ☕ Coffee Tasks Dashboard

**Last Updated**: <% tp.date.now("YYYY-MM-DD HH:mm") %>

---

## 🔴 Overdue

\`\`\`tasks
not done
due before today
(tags include #coffee OR path includes Coffee)
sort by due
\`\`\`

---

## 📅 Today

\`\`\`tasks
not done
(due today) OR (scheduled today)
(tags include #coffee OR path includes Coffee)
sort by priority
\`\`\`

---

## 📆 This Week

\`\`\`tasks
not done
due after today
due before in 7 days
(tags include #coffee OR path includes Coffee)
sort by due
\`\`\`

---

## 🔧 Maintenance

\`\`\`tasks
not done
tags include #coffee-maintenance
sort by due
\`\`\`

---

## 🫘 Bean Management

\`\`\`tasks
not done
tags include #bean
sort by due
\`\`\`

---

## 📚 Learning & Practice

\`\`\`tasks
not done
tags include #learning OR tags include #practice
sort by due
limit 10
\`\`\`

---

## ⚙️ Equipment

\`\`\`tasks
not done
tags include #equipment
sort by priority, due
\`\`\`

---

## ✅ Recently Completed

\`\`\`tasks
done
done after 7 days ago
(tags include #coffee OR path includes Coffee)
sort by done reverse
limit 15
\`\`\`
```

## Integration with Daily Notes

Add task sections to your Daily Note template:

```markdown
## ☕ Coffee Tasks

### New Tasks
- [ ]

### Tasks Due Today

\`\`\`tasks
not done
due today
(tags include #coffee OR path includes Coffee)
\`\`\`

### Completed Today

\`\`\`tasks
done today
(tags include #coffee OR path includes Coffee)
\`\`\`
```

## Task Organization Strategies

### Tag Hierarchy

**Primary Categories**:
- `#coffee-maintenance` - Equipment upkeep
- `#bean-acquisition` - Buying beans
- `#bean-research` - Researching beans
- `#bean-documentation` - Creating bean profiles
- `#equipment-research` - Researching gear
- `#equipment-purchase` - Buying gear
- `#equipment-setup` - Setting up gear
- `#learning` - Educational activities
- `#practice` - Skill development
- `#experiment` - Testing variables
- `#documentation` - Creating guides/notes
- `#coffee-planning` - Planning and goals

**Secondary Tags**:
- `#quick` - 15 minutes or less
- `#medium` - 30-60 minutes
- `#long` - 1+ hours
- `#waiting` - Waiting on external factor
- `#someday` - No urgency

### Priority Levels

- **High Priority** (⏫): Time-sensitive, important
  - Equipment failure needs fixing
  - Bean order before running out
  - Competition prep

- **Medium Priority** (🔼): Important but flexible
  - Regular maintenance
  - Documentation tasks
  - Learning activities

- **Low Priority** (🔽): Nice to have
  - Research for future
  - Optional optimizations
  - Exploratory experiments

### Due Date Guidelines

**Immediate** (today/tomorrow):
- Critical maintenance
- Time-sensitive orders
- Scheduled practice

**Near-term** (this week):
- Regular maintenance
- Active learning tasks
- Current experiments

**Future** (beyond week):
- Planning tasks
- Long-term goals
- Quarterly reviews

**No Due Date**:
- Someday/maybe tasks
- Ideas to explore
- Low-priority items

## Recurrence Patterns

### Common Patterns

**Daily**:
```markdown
🔁 every day
```

**Weekly**:
```markdown
🔁 every week on Sunday
🔁 every 7 days
```

**Bi-weekly**:
```markdown
🔁 every 2 weeks on Monday
```

**Monthly**:
```markdown
🔁 every month on 1st
🔁 every month on last day
```

**Quarterly**:
```markdown
🔁 every 3 months on 1st
```

**Annually**:
```markdown
🔁 every year on January 1st
```

### Advanced Patterns

**Weekdays only**:
```markdown
🔁 every weekday
```

**Multiple days per week**:
```markdown
🔁 every week on Monday, Wednesday, Friday
```

**Month-end tasks**:
```markdown
🔁 every month on last Sunday
```

## Task Creation Workflows

### Quick Capture
1. Open Daily Note
2. Add task in New Tasks section
3. Add due date, priority, tags
4. Process daily

### Planned Tasks
1. Create in Coffee Tasks Dashboard
2. Add full context and details
3. Link to related notes
4. Set appropriate due date

### From Coffee Logs
When brewing reveals a task:
```markdown
## Follow-up Tasks
- [ ] Order more of this bean 🛒 📅 2025-11-05 #bean-acquisition
- [ ] Adjust grinder burrs (slight inconsistency noticed) ⚙️ 📅 2025-10-28 #maintenance
```

### From Equipment Notes
Track equipment-related tasks:
```markdown
## Maintenance Schedule
- [ ] Clean burrs 🔁 every 2 weeks 📅 2025-11-03 #maintenance
- [ ] Descale 🔁 every 3 months 📅 2026-01-01 #maintenance
```

## Best Practices

### Task Writing
- **Be specific**: "Clean grinder burrs" not "Clean grinder"
- **Actionable**: Start with verb
- **Context**: Add relevant tags
- **Links**: Connect to related notes
- **Time estimate**: Add time tags when helpful

### Task Management
- **Daily review**: Check dashboard each morning
- **Weekly planning**: Sunday evening task review
- **Capture immediately**: Don't rely on memory
- **Complete promptly**: Check off finished tasks
- **Archive regularly**: Review and clean up

### Avoiding Overwhelm
- **Limit daily tasks**: 3-5 coffee tasks max per day
- **Prioritize ruthlessly**: Not everything is high priority
- **Batch similar tasks**: Clean all equipment at once
- **Delegate/automate**: Some tasks can be simplified
- **Maintain momentum**: Small consistent progress

## Advanced Features

### Task Dependencies
Use scheduled dates for dependencies:
```markdown
- [ ] Order grinder 🛒 📅 2025-10-28 #equipment
- [ ] Set up grinder ⚙️ ⏳ 2025-11-03 #equipment
```
(Scheduled for after likely arrival)

### Task Templates with Templater
Create template for recurring task patterns:
```markdown
- [ ] Brew and log: <% tp.system.prompt("Bean name") %> ☕ 📅 <% tp.date.now("YYYY-MM-DD") %> #logging
```

### Task Tracking Metrics
Create queries to track:
- Tasks completed per week
- Most common task categories
- Average completion time
- Overdue task patterns

### Integration with Other Plugins
- **Calendar**: Visualize tasks on calendar
- **Kanban**: Some tasks might work better on boards
- **Dataview**: Create custom task analytics
- **QuickAdd**: Quick task capture macros

## Mobile Optimization

Tasks plugin works great on mobile:
- Quick task creation
- Checkbox completion
- Dashboard viewing
- Task editing on the go

**Mobile Tips**:
- Keep task descriptions short
- Use emojis for quick scanning
- Pin Coffee Tasks Dashboard
- Use quick capture in Daily Notes

## Troubleshooting

**Tasks not appearing in queries**:
- Check task format (must have `- [ ]`)
- Verify tags are correct
- Ensure due dates are formatted properly
- Refresh query (edit and save)

**Recurrence not working**:
- Use exact format: `🔁 every [period]`
- Check Tasks plugin settings
- Complete task (don't just check off)

**Query performance slow**:
- Limit query scope (specific paths/tags)
- Use LIMIT on large result sets
- Avoid complex nested queries
- Consider splitting into multiple queries

**Tasks duplicating**:
- Don't manually copy recurring tasks
- Let plugin handle recurrence
- Complete old task before creating new

## Resources

- [Tasks Plugin Documentation](https://publish.obsidian.md/tasks/)
- [Task Format Reference](https://publish.obsidian.md/tasks/Reference/Task+Formats/Task+Format)
- [Query Examples](https://publish.obsidian.md/tasks/Queries/Query+Examples)
- Coffee Vault Documentation/Plugin-Setup-Guide.md

---

**Version**: 1.0.0
**Last Updated**: 2025-10-25
**Maintained by**: Coffee Vault Plugin Integration Sub-Agent
