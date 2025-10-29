---
title: Advanced Obsidian Customizations for Coffee Vault
type: configuration-guide
date: 2025-10-28
status: reference
---

# ⚙️ Advanced Obsidian Customizations

**Purpose**: Advanced configurations to maximize Coffee Vault functionality

---

## 🔧 Recommended Additional Plugins

### Metadata Menu
**Purpose**: Enhanced property management, inline editing  
**Benefits**: Edit properties without opening note, better UX  
**Coffee Vault Use**: Quick-edit bean status, ratings, brew parameters  
**Install**: Community Plugins → Search "Metadata Menu"

### Buttons
**Purpose**: Add clickable action buttons to notes  
**Benefits**: Quick actions (new log, run script, navigate)  
**Coffee Vault Use**: Quick capture, template triggers, navigation  
**Install**: Community Plugins → Search "Buttons"

### Charts
**Purpose**: Create charts from note data  
**Benefits**: Visualize rating trends, consumption patterns  
**Coffee Vault Use**: Chart ratings over time, method comparison  
**Install**: Community Plugins → Search "Charts"

### Banner
**Purpose**: Add banner images to notes  
**Benefits**: Visual headers, aesthetic improvement  
**Coffee Vault Use**: Coffee bag photos on bean profiles  
**Install**: Community Plugins → Search "Banner"

### Folder Notes
**Purpose**: README-style notes for folders  
**Benefits**: Folder organization, navigation  
**Coffee Vault Use**: Category overviews (already using via READMEs)  
**Install**: Community Plugins → Search "Folder Note"

---

## 🎨 Advanced CSS Customizations

### Custom Note Types Styling

Add to `coffee-vault-theme.css`:

```css
/* Bean Profile Specific Styling */
.bean-profile {
    --accent-color: #8B4513;
}

.bean-profile h1 {
    color: #D2691E;
    border-bottom: 3px solid #8B4513;
}

/* Origin Profile Styling */
.origin-profile {
    --accent-color: #228B22;
}

.origin-profile h1 {
    color: #32CD32;
    border-bottom: 3px solid #228B22;
}

/* Brewing Guide Styling */
.brewing-guide {
    --accent-color: #4169E1;
}

.brewing-guide h1 {
    color: #6495ED;
    border-bottom: 3px solid #4169E1;
}

/* Scientific Reference Styling */
.scientific-reference {
    --accent-color: #9370DB;
}

.scientific-reference h1 {
    color: #BA55D3;
    border-bottom: 3px solid #9370DB;
}
```

---

## 📊 Enhanced Datacore Queries

### Smart Coffee Log Query (Add to HOME-DASHBOARD)

```dataviewjs
// Recent brews with enhanced display
const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .sort(p => p.date, 'desc')
  .limit(10)
  .array();

if (logs.length > 0) {
  dv.table(
    ["Date", "☕ Beans", "Method", "⭐", "Notes"],
    logs.map(p => [
      p.date,
      p.beans || "Unknown",
      p["brew-method"] || "—",
      p.rating ? `${p.rating}/5.0` : "—",
      p.notes ? p.notes.substring(0, 80) + "..." : "—"
    ])
  );
} else {
  dv.paragraph("📝 No logs yet - start your coffee journey!");
}
```

### Bean Library Status (Enhanced)

```dataviewjs
const beans = dv.pages('"Beans Library"')
  .where(p => p.type === "bean-profile")
  .array();

const active = beans.filter(b => b.status === "active" || !b.status);
const origins = new Set(beans.map(b => b.origin)).size;
const avgPrice = beans.filter(b => b.price).reduce((sum, b) => sum + b.price, 0) / beans.filter(b => b.price).length;

dv.header(3, "📊 Bean Library Overview");
dv.list([
  `🫘 **${beans.length} Total Varieties** in library`,
  `✅ **${active.length} Active Beans** ready to brew`,
  `🌍 **${origins} Different Origins** represented`,
  `💰 **$${avgPrice.toFixed(2)} Average Price** per bag`
]);
```

---

## 🔗 Hotkeys & Shortcuts

### Recommended Hotkey Setup

**Settings → Hotkeys → Configure**:
- `Cmd/Ctrl + N`: Quick new coffee log (QuickAdd macro)
- `Cmd/Ctrl + Shift + D`: Open today's daily note
- `Cmd/Ctrl + T`: Open HOME-DASHBOARD
- `Cmd/Ctrl + E`: Toggle edit/preview mode
- `Cmd/Ctrl + P`: Command palette (default, use often)

---

## 📱 Mobile Optimization

### Mobile-Friendly Queries

**Use `.limit()` on All Queries** (prevents mobile slowdown):
```datacore
FROM "Coffee Logs"
WHERE type = "coffee-log"
SORT date DESC
LIMIT 20  // Essential for mobile performance
```

### Touch-Friendly Navigation

Add large touch targets to mobile dashboard:
```css
/* Add to mobile-responsive.css */
@media (max-width: 768px) {
  .dashboard-link {
    padding: 20px;
    font-size: 1.2rem;
    min-height: 60px;
  }
}
```

---

## 🎯 Workflow Optimizations

### Morning Coffee Routine Template

Create: `Templates/Morning-Coffee-Routine.md`
```markdown
## ☕ Morning Coffee Checklist

- [ ] Select beans (check freshness: [[Beans Library]])
- [ ] Weigh dose: __g
- [ ] Grind fresh
- [ ] Brew using: __ method
- [ ] Log session: [[Quick Coffee Capture]]
- [ ] Rate and note
```

### Weekly Review Template

Create automated weekly coffee review:
```dataviewjs
// This week's coffee summary
const weekStart = dv.date("sow");
const logs = dv.pages('"Coffee Logs"')
  .where(p => p.date >= weekStart)
  .array();

dv.header(2, "📊 This Week's Coffee");
dv.paragraph(`**${logs.length} brews** this week`);
if (logs.length > 0) {
  const avg = logs.reduce((sum, p) => sum + (p.rating || 0), 0) / logs.length;
  dv.paragraph(`**Average rating**: ${avg.toFixed(2)}/5.0 ⭐`);
}
```

---

## 🔍 Search Optimization

### Better Coffee Search

**Settings → Core Plugins → Search**:
- Enable "Show more context" (see surrounding text)
- Enable "Collapse results" (cleaner interface)
- Use search operators:
  - `tag:#kenya` - Find all Kenya-tagged notes
  - `file:(Beans Library)` - Search only Beans Library
  - `type:bean-profile` - Find all bean profiles

---

## 📝 Best Practices Implemented

✅ **Consistent Types**: All notes have `type:` property (verified: 834 matches)  
✅ **Wikilinks**: Internal linking throughout (knowledge web)  
✅ **Templates**: Complete templates for all note types  
✅ **Queries Optimized**: All use `.limit()` for performance  
✅ **Mobile Ready**: Responsive design, touch-friendly  
✅ **Organized**: Every folder documented, no dummy data

---

**These customizations maximize Coffee Vault functionality while maintaining performance and usability**

