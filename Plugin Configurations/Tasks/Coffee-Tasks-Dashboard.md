---
type: dashboard
tags: [coffee, tasks, dashboard]
---

# ☕ Coffee Tasks Dashboard

**Purpose**: Centralized view of all coffee-related tasks across your vault.

---

## 🔴 Overdue Tasks

*Tasks that need immediate attention*

```tasks
not done
due before today
(tags include #coffee OR path includes Coffee OR tags include #bean OR tags include #equipment)
sort by due
```

*If no tasks appear above, you're all caught up!*

---

## 📅 Today's Tasks

*What needs to be done today*

```tasks
not done
(due today) OR (scheduled today)
(tags include #coffee OR path includes Coffee OR tags include #bean OR tags include #equipment)
sort by priority
```

---

## 📆 This Week

*Coming up in the next 7 days*

```tasks
not done
due after today
due before in 7 days
(tags include #coffee OR path includes Coffee OR tags include #bean OR tags include #equipment)
sort by due
```

---

## 🔧 Maintenance Tasks

*Equipment care and upkeep*

```tasks
not done
tags include #coffee-maintenance
sort by due
```

---

## 🫘 Bean Management

*Bean research, purchasing, and documentation*

```tasks
not done
(tags include #bean-acquisition OR tags include #bean-research OR tags include #bean-documentation OR tags include #bean-review)
sort by priority, due
```

---

## ⚙️ Equipment Tasks

*Gear research, purchases, and setup*

```tasks
not done
(tags include #equipment-research OR tags include #equipment-purchase OR tags include #equipment-setup OR tags include #equipment-review)
sort by priority, due
```

---

## 📚 Learning & Development

*Educational activities and skill practice*

```tasks
not done
(tags include #learning OR tags include #practice OR tags include #experiment)
sort by due
limit 10
```

---

## 📝 Documentation Tasks

*Creating guides, notes, and reviews*

```tasks
not done
tags include #documentation
sort by due
```

---

## 🎯 High Priority

*Important tasks across all categories*

```tasks
not done
priority is high
(tags include #coffee OR path includes Coffee OR tags include #bean OR tags include #equipment)
sort by due
```

---

## 🔮 Someday / Maybe

*Tasks without due dates - ideas to explore*

```tasks
not done
no due date
(tags include #coffee OR path includes Coffee OR tags include #bean OR tags include #equipment)
(tags include #someday OR tags include #maybe)
limit 15
```

---

## ✅ Recently Completed

*What you've accomplished lately*

```tasks
done
done after 7 days ago
(tags include #coffee OR path includes Coffee OR tags include #bean OR tags include #equipment)
sort by done reverse
limit 20
```

---

## 📊 Task Statistics

*Create custom statistics with Dataview if desired:*

### Completion This Week
```dataview
TABLE WITHOUT ID
  length(rows) as "Completed Tasks"
FROM "Coffee Logs" OR "Beans Library" OR "Daily Notes" OR "Brewing Guides"
WHERE completion >= date(today) - dur(7 days)
```

---

## 🚀 Quick Add Tasks

**Quick Task Templates** (copy and customize):

```markdown
- [ ] Order coffee beans from [[Roaster Profile]] 🛒 📅 YYYY-MM-DD #bean-acquisition
- [ ] Clean grinder ⚙️ 📅 YYYY-MM-DD #coffee-maintenance
- [ ] Practice V60 technique ☕ 📅 YYYY-MM-DD #practice
- [ ] Research [[Equipment Name]] 🔍 📅 YYYY-MM-DD #equipment-research
- [ ] Create Bean Profile for [[Bean Name]] 🫘 📅 YYYY-MM-DD #bean-documentation
- [ ] Watch video on [[Topic]] 📺 📅 YYYY-MM-DD #learning
- [ ] Test grind size variation ☕ 📅 YYYY-MM-DD #experiment
- [ ] Write brewing guide for [[V60-Quick-3-Pour-Method]] 📝 📅 YYYY-MM-DD #documentation
```

---

## 💡 Tips for Using This Dashboard

1. **Review Daily**: Check this dashboard each morning with your first coffee
2. **Update Immediately**: Check off tasks as you complete them
3. **Add Context**: Link tasks to relevant notes using `[[Note Name]]`
4. **Use Tags**: Consistent tagging makes filtering work perfectly
5. **Set Due Dates**: Tasks with dates get done; vague tasks linger
6. **Prioritize**: Not everything is high priority
7. **Batch Tasks**: Do similar tasks together (all maintenance at once)
8. **Celebrate**: Review "Recently Completed" to see your progress!

---

## 🔄 Maintenance

**Dashboard Maintenance Tasks**:
- Weekly: Archive completed tasks older than 2 weeks
- Monthly: Review "Someday/Maybe" tasks
- Quarterly: Assess task categories and adjust tags
- Annually: Review task workflow and optimize

---

**Dashboard Version**: 1.0.0
**Created**: 2025-10-25
**Location**: `/Plugin Configurations/Tasks/Coffee-Tasks-Dashboard.md`
**Copy to**: `/Views/Coffee-Tasks-Dashboard.md` (or wherever you prefer)
