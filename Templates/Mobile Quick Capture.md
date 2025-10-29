---
<%*
/* MOBILE QUICK CAPTURE TEMPLATE
 * Optimized for rapid coffee logging on mobile devices
 * Features:
 * - Minimal keyboard input required
 * - Large touch targets for all interactions
 * - Smart defaults based on time of day and history
 * - Voice memo placeholder support
 * - Photo capture ready
 * - Streamlined property set
 */

// Smart time-based defaults
let currentHour = parseInt(tp.date.now("HH"));
let defaultMethod = currentHour < 12 ? "pour-over" : "espresso";
let defaultTemp = currentHour < 12 ? "200" : "195";
%>
date: <% tp.date.now("YYYY-MM-DD") %>
time: <% tp.date.now("HH:mm") %>
type: coffee-log
beans: <% tp.system.suggester(
  ["Select from recent...", "Quick Entry (type name)"],
  ["recent", "manual"]
) == "recent" ?
  tp.system.suggester(
    ["Recent Bean 1", "Recent Bean 2", "Recent Bean 3"],
    ["Recent Bean 1", "Recent Bean 2", "Recent Bean 3"]
  ) :
  tp.system.prompt("Bean name (quick)")
%>
brew-method: <% tp.system.suggester(
  ["☕ Pour Over", "☕ Espresso", "☕ French Press", "☕ Aeropress", "☕ Cold Brew"],
  ["pour-over", "espresso", "french-press", "aeropress", "cold-brew"],
  false,
  "Brewing method"
) %>
rating: <% tp.system.suggester(
  ["⭐⭐⭐⭐⭐ Exceptional (5)", "⭐⭐⭐⭐ Great (4)", "⭐⭐⭐ Good (3)", "⭐⭐ Okay (2)", "⭐ Not great (1)"],
  ["5", "4", "3", "2", "1"],
  false,
  "Quick rating"
) %>
roaster: [[<% tp.system.prompt("Roaster (optional)", "") %>]]
origin: <% tp.system.suggester(
  ["🌍 Ethiopia", "🌍 Colombia", "🌍 Guatemala", "🌍 Kenya", "🌍 Brazil", "🌍 Other/Skip"],
  ["Ethiopia", "Colombia", "Guatemala", "Kenya", "Brazil", ""],
  false,
  "Origin (optional)"
) %>
roast-level: <% tp.system.suggester(
  ["Light", "Medium", "Dark", "Skip"],
  ["light", "medium", "dark", ""],
  false,
  "Roast level"
) %>
grind-size: medium-fine
water-temp: <% defaultTemp %>
brew-time: 3.5
ratio: 1:16
cups-brewed: 1
flavor-notes: []
would-rebuy: false
tags: [coffee, mobile, quick-log, <% tp.date.now("YYYY/MM") %>]
status: draft
photo: ""
session-type: routine
---

# ☕ <% tp.date.now("MMM DD, HH:mm") %> - Quick Log

**Rating**: ⭐ <% tp.frontmatter.rating %>/5
**Beans**: <% tp.frontmatter.beans %>
**Method**: <% tp.frontmatter["brew-method"] %>

---

## 📱 Quick Notes

<% tp.file.cursor() %>

> 💡 **Voice memo**: Use iOS dictation or voice typing for quick notes

---

## 📸 Photo

<!-- Tap to add photo from camera or library -->
![[]]

> 🎯 **Tip**: Take a photo of the bag label, your setup, or the final cup

---

## 🎯 Fast Flavor Notes (Optional)

Tap to add quick flavor descriptors:

**Common notes**:
- [ ] Fruity
- [ ] Chocolatey
- [ ] Nutty
- [ ] Floral
- [ ] Citrus
- [ ] Caramel
- [ ] Berry
- [ ] Earthy

**Character**:
- [ ] Bright acidity
- [ ] Full body
- [ ] Sweet finish
- [ ] Clean cup
- [ ] Complex

---

## ⚙️ Parameters (Auto-filled)

Already set with smart defaults based on your method choice:
- **Grind**: <% tp.frontmatter["grind-size"] %>
- **Water**: <% tp.frontmatter["water-temp"] %>°F
- **Time**: <% tp.frontmatter["brew-time"] %> min
- **Ratio**: <% tp.frontmatter.ratio %>

> 📝 **Edit later**: Open full Coffee Log template to add detailed parameters

---

## 🔄 Next Steps

**Want to add more detail?**
1. ✏️ Tap "More options" (⋯) in Obsidian
2. 📋 Copy this note's content
3. 🆕 Create new note with "Coffee Log" template
4. 📥 Paste quick notes into full template
5. 🗑️ Archive this quick log

**Happy with quick log?**
- ✅ You're done! This captures the essentials
- 🔍 Find it in Coffee Logs folder
- 📊 Stats will appear in dashboards

---

## 💡 Mobile Tips

**Voice Input**:
- iOS: Tap microphone on keyboard
- Android: Tap mic in Google Keyboard
- Perfect for tasting notes while brewing

**Photo Capture**:
- Best lighting: Natural, indirect light
- Capture bag label for reference
- Show your brew setup

**Save Time**:
- Rating is the most important field
- Add flavor notes later if needed
- Photo jogs memory for details

**Upgrade Later**:
- Mark `would-rebuy: true` if you love it
- Add to `flavor-notes` array when you have time
- Complete parameters if experimenting

---

← [[Daily Notes/<% tp.date.now("YYYY-MM-DD") %>|Today's Note]]
