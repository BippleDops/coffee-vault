---
date: <% tp.date.now("YYYY-MM-DD") %>
time: <% tp.date.now("HH:mm") %>
type: coffee-quick
rating: <% tp.system.prompt("Quick rating (1-5)", "3") %>
tags: [coffee, quick-log]
---

# Quick Coffee - <% tp.date.now("MMM DD, HH:mm") %>

**Rating**: ⭐ <% tp.frontmatter.rating %>/5

**Quick notes**: <% tp.file.cursor() %>

---

*Convert to full log?* → Use "Coffee Log" template

