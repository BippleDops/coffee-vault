# Coffee Vault 4.0 - Start Here

**Welcome!** This is your complete coffee tracking and optimization system.

---

## What is Coffee Vault?

Coffee Vault 4.0 transforms Obsidian into an intelligent brewing companion that:

- **Tracks every brew** with detailed parameters
- **Learns your preferences** and suggests optimal settings
- **Analyzes your data** using machine learning
- **Visualizes your journey** with interactive charts
- **Educates** with scientific coffee references

**From beginner to expert** - the system grows with you.

---

## Quick Start (5 Minutes)

### Step 1: Install Required Plugins

Open Obsidian → Settings → Community Plugins → Browse

**Required**:
- Datacore - Powers all analytics and queries
- Templater - Enables smart templates

**Recommended**:
- Calendar - Visual date navigation
- Tasks - Brewing reminders

### Step 2: Log Your First Coffee

1. Press `Cmd/Ctrl + P` → "Templater: Create new note from template"
2. Select `Coffee-Log-v3.md`
3. Fill in:
   - Bean name (e.g., "Ethiopian Yirgacheffe")
   - Dose: 18g
   - Water: 300g
   - Method: v60
   - Rating: 4.0/5.0

4. The template auto-calculates brew ratio and other metrics
5. Save - you're tracking coffee!

### Step 3: Explore Your Vault

After logging 5+ brews, check out:

**Analytics Dashboards**:
- `Analytics/1-Monthly-Analytics-Dashboard.md` - Overall statistics
- `Analytics/2-Brewing-Optimization-Engine.md` - ML recommendations
- `Analytics/3-Cost-Intelligence-System.md` - Financial tracking

**Interactive Visualizations**:
- `Visualizations/flavor-compass.html` - 4-axis flavor profiling
- `Visualizations/brewing-triangle.html` - Extraction science
- `Visualizations/grind-size-calculator.html` - Multi-grinder tool

**Configuration**:
- `Configuration/Property-Schema.md` - All available properties
- `Configuration/User-Configuration-Guide.md` - Detailed setup

---

## What's Included

### Core Folders

| Folder | Purpose |
|--------|---------|
| **Coffee Logs/** | Your brew records |
| **Beans Library/** | Bean profiles and tracking |
| **Templates/** | Smart templates for quick logging |
| **Analytics/** | 8 ML-powered dashboards |
| **Visualizations/** | 17 interactive HTML tools |
| **Scripts/** | 22 automation utilities |
| **Configuration/** | System setup and standards |
| **Scientific References/** | Coffee science education |
| **Documentation/** | Guides and references |

### Key Features

**Machine Learning**:
- Quality prediction (KNN algorithm)
- Pattern discovery (K-Means clustering)
- Parameter optimization recommendations
- Anomaly detection for outlier brews

**Statistical Analysis**:
- 25+ functions (mean, correlation, regression)
- Trend detection and forecasting
- Multi-variable relationship analysis

**Automation**:
- Weekly/monthly report generation
- Inventory management with alerts
- Batch operations on historical data
- Data export (CSV/JSON/PDF)

**Progressive Disclosure**:
- **Beginner** (1-20 logs): Basic tracking, consistency
- **Intermediate** (20-50 logs): Correlations, trends
- **Advanced** (50+ logs): ML predictions, clustering

---

## Your First Week

**Day 1**: Install plugins, log first 2-3 brews
**Day 2-3**: Continue logging, try different beans or methods
**Day 4**: Review your first analytics dashboard
**Day 5**: Experiment with flavor compass visualization
**Day 6-7**: Log 2-3 more brews, total goal: 10 logs

**After 10 logs**: The system has enough data to start showing patterns and making suggestions!

---

## Common Tasks

### Find Your Best Bean

Add this query to any note:

```dataviewjs
const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .groupBy(p => p.beans);

const avgRatings = logs.map(g => ({
  bean: g.key,
  avg: g.rows.map(r => r.rating).reduce((a,b) => a+b, 0) / g.rows.length,
  count: g.rows.length
})).sort((a,b) => b.avg - a.avg);

dv.table(["Bean", "Avg Rating", "Brews"],
  avgRatings.slice(0, 5).map(b => [b.bean, b.avg.toFixed(2), b.count])
);
```

### Generate Test Data

Want to explore features without waiting? Generate 50 realistic sample brews:

```bash
node -e "const gen = require('./Scripts/sample-data-generator.js'); gen.saveSampleVault('./TEST-VAULT', 50);"
```

### Run Automation

```javascript
// Weekly summary
const weekly = require('./Scripts/weekly-summary-generator.js');
weekly.generateWeeklySummary();

// Brewing optimizer (needs 20+ logs)
const optimizer = require('./Scripts/brewing-optimizer.js');
optimizer.optimizeForBean('Ethiopian Yirgacheffe');

// Inventory check
const inventory = require('./Scripts/inventory-manager.js');
inventory.checkLowStock();
```

---

## Troubleshooting

**Templates don't work**:
- Install Templater plugin
- Set template folder to "Templates" in settings
- Restart Obsidian

**Queries show nothing**:
- Install Datacore plugin
- Ensure coffee logs have `type: coffee-log` in frontmatter
- Property names use `kebab-case`: `brew-method` not `brewMethod`

**ML predictions inaccurate**:
- Need minimum 20 logs
- Optimal: 50+ logs across varied beans/methods
- Check confidence score (below 50% = insufficient data)

**Visualizations won't load**:
- Open HTML files in web browser, not Obsidian
- Enable JavaScript in browser
- Check browser console for errors

---

## Next Steps

1. Log 10 brews this week
2. Review monthly analytics dashboard
3. Try 2-3 visualizations
4. Read scientific references (optional)
5. Set up automation scripts (optional)
6. Customize property schema (optional)

---

## Documentation

- **This file** - Quick start for new users
- `Configuration/User-Configuration-Guide.md` - Detailed configuration
- `Configuration/Property-Schema.md` - All available properties
- `Documentation/COFFEE-VAULT-4.0-COMPLETE-DELIVERY.md` - Complete feature documentation
- `Documentation/VAULT-ARCHITECTURE-REFERENCE.md` - Technical reference for developers

---

## Version Info

**Version**: 4.0.0
**Release**: October 26, 2025
**Status**: Production Ready

---

**Happy brewing! Your coffee journey starts now.**

*The vault learns with every brew you log - start tracking today to unlock insights tomorrow.*
