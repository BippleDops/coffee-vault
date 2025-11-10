---
title: Buttons Plugin Configuration Guide
type: plugin-configuration
plugin: buttons
date: 2025-10-28
---

# 🔘 Buttons Plugin Configuration

**Plugin**: Buttons (Obsidian Button Plugin)  
**Purpose**: Add clickable buttons to notes for quick actions

---

## 📋 Common Button Uses in Coffee Vault

### Quick Actions

**Create New Coffee Log**:
```button
name: ➕ New Coffee Log
type: template
action: Coffee-Log-v3
```

**Quick Capture**:
```button
name: ⚡ Quick Capture
type: template
action: Quick Coffee Capture
```

**Open Today's Daily Note**:
```button
name: 📅 Today's Note
type: command
action: Daily notes: Open today's daily note
```

### Navigation Buttons

**Go to HOME**:
```button
name: 🏠 Home
type: link
action: [[HOME-DASHBOARD]]
```

**View Analytics**:
```button
name: 📊 Analytics
type: link
action: [[1-Monthly-Analytics-Dashboard]]
```

### Utility Buttons

**Run Validation Script**:
```button
name: ✅ Validate Data
type: command
action: Run validation script
```

**Generate Weekly Summary**:
```button
name: 📈 Weekly Summary
type: command
action: Run weekly summary
```

---

## 💡 Button Syntax

**Basic Template**:
\`\`\`button
name: Button Label
type: [template|command|link|calculate]
action: [template-name|command-id|link-target|calculation]
\`\`\`

**Example in Coffee Log Template**:
Add to template for quick re-logging same coffee:
\`\`\`button
name: ☕ Brew Again
type: template
action: Coffee-Log-v3
\`\`\`

---

## 🎯 Recommended Button Locations

**HOME-DASHBOARD**: Quick create buttons  
**Templates**: Action buttons for workflows  
**Views**: Navigation buttons  
**Daily Notes**: Quick capture, navigation

---

*Configure buttons for streamlined Coffee Vault workflows*

