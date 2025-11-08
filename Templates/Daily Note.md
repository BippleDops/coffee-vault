---
date: <% tp.date.now("YYYY-MM-DD") %>
day-of-week: <% tp.date.now("dddd") %>
tags: "[daily-note, <%  tp.date.now("YYYY/MM")  %>]"
---

# <% moment(tp.file.title,'YYYY-MM-DD').format("dddd, MMMM DD, YYYY") %>

<< [[<% tp.date.now("YYYY-MM-DD", -1) %>|← Yesterday]] | [[<% tp.date.now("YYYY-MM-DD", 1) %>|Tomorrow →]] >>

---

## ☕ Coffee Today

**Quick Log**:
- Cups consumed: 
- Beans: 
- Mood: 😊 / 😐 / 😞

**Notable Brews**: 
- 

<% tp.file.cursor() %>

---

## 📝 Today's Coffee Sessions

```dataview
TABLE 
  beans as "Beans",
  rating as "⭐",
  brew-method as "Method",
  time as "Time"
FROM "Coffee Logs"
WHERE date = date("<% tp.date.now("YYYY-MM-DD") %>")
SORT time ASC
```

---

## 💭 Daily Notes



---

## ✅ Tasks

```tasks
not done
due on <% tp.date.now("YYYY-MM-DD") %>
```

---

## 📌 Quick Captures

- 

---

## 🔗 Coffee Experiments to Try

- [ ] 

---

## 📊 Weekly Overview (if Monday)

<% if (tp.date.now("dddd") === "Monday") { %>
```dataview
TABLE 
  length(rows) as "Sessions",
  round(average(rows.rating), 2) as "Avg Rating",
  sum(rows.cups-brewed) as "Total Cups"
FROM "Coffee Logs"
WHERE date >= date("<% tp.date.now("YYYY-MM-DD", -7) %>") 
  AND date <= date("<% tp.date.now("YYYY-MM-DD") %>")
```
<% } %>

