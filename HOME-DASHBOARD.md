---
type: dashboard
tags: [home, moc, navigation]
cssclass: home-dashboard
pin: true
---

# ☕ Coffee Vault 5.0 - Home

**Welcome to your complete coffee intelligence platform**

> **New in 5.0**: Supply chain transparency • Personal development goals • Enhanced ML • Real-time brewing assistance

---

## 🚀 Quick Start

```dataviewjs
const logs = dv.pages('"Coffee Logs"').where(p => p.type === "coffee-log");
const logCount = logs.length;

const message = logCount === 0 ? "👋 Start your coffee journey by logging your first brew!" :
                logCount < 10 ? `📊 You have ${logCount} brews logged. ${10 - logCount} more to unlock analytics!` :
                logCount < 50 ? `⭐ ${logCount} brews! Analytics active. ${50 - logCount} more for ML predictions.` :
                `🏆 ${logCount} brews! All features unlocked. You're a Coffee Vault master!`;

dv.paragraph(message);
```

---

## 📊 My Coffee Stats

```dataviewjs
const logs = dv.pages('"Coffee Logs"').where(p => p.type === "coffee-log").array();

if (logs.length > 0) {
  const avgRating = Math.round(logs.reduce((sum, p) => sum + (p.rating || 0), 0) / logs.length * 100) / 100;
  const totalCups = logs.reduce((sum, p) => sum + (p["cups-brewed"] || 0), 0);
  const uniqueBeans = new Set(logs.map(p => p.beans).filter(b => b)).size;
  const topRated = logs.sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];

  dv.table(
    ["Metric", "Value"],
    [
      ["⭐ Average Rating", `${avgRating}/5.0`],
      ["☕ Total Brews", logs.length],
      ["🫘 Unique Beans", uniqueBeans],
      ["🏆 Best Brew", `${topRated?.beans} (${topRated?.rating}⭐)`]
    ]
  );
}
```

---

## 🎯 Essential Links

### Core Dashboards
- **[[Views/Coffee Dashboard|📊 Main Coffee Dashboard]]** - Your central hub
- **[[Views/Interactive-Visualizations-Dashboard|🎨 Visualizations]]** - Interactive charts
- **[[Analytics/1-Monthly-Analytics-Dashboard|📈 Monthly Analytics]]** - Comprehensive stats
- **[[Analytics/2-Brewing-Optimization-Engine|🎯 Brewing Optimizer]]** - ML recommendations

### Quick Actions
- **[[Templates/Coffee-Log-v3|➕ New Coffee Log]]** - Log a brew
- **[[Templates/Bean Profile|🫘 New Bean Profile]]** - Add beans
- **[[Templates/Quick Coffee Capture|⚡ Quick Capture]]** - Fast logging

### Database Views (Bases)
- **[[Views/All-Coffee-Logs.base|📋 All Logs]]** - Sortable, filterable database
- **[[Views/Top-Rated-Brews.base|⭐ Top Rated]]** - Best brews
- **[[Views/By-Origin.base|🌍 By Origin]]** - Grouped by origin
- **[[Views/By-Roaster.base|☕ By Roaster]]** - Grouped by roaster

---

## 📚 Knowledge Library

```dataviewjs
// OPTIMIZED: Dynamic content counts reflecting vault expansion
const beans = dv.pages('"Beans Library"').where(p => p.type === "bean-profile").length;
const origins = dv.pages('"Origins"').where(p => p.type === "origin-profile").length;
const scientificRefs = dv.pages('"Scientific References"').where(p => p.type === "scientific-reference").length;
const brewingGuides = dv.pages('"Brewing Guides"').where(p => p.type === "brewing-guide").length;
const roasters = dv.pages('"Roasters"').where(p => p.type === "roaster-profile").length;

dv.header(3, "📊 Vault Library Statistics");
dv.list([
  `🫘 **${beans} Bean Variety Profiles** - Comprehensive variety database`,
  `🌍 **${origins} Origin Profiles** - Countries and regions worldwide`,
  `☕ **${brewingGuides} Brewing Method Guides** - Traditional to cutting-edge`,
  `🔬 **${scientificRefs} Scientific References** - Coffee science deep-dives`,
  `🏪 **${roasters} Roaster Profiles** - Specialty roaster database`
]);
```

### Scientific References
- **[[Scientific References/00-Scientific Content Index|🔬 Scientific Index]]** - Complete catalog
- **[[Scientific References/Extraction Science/|⚗️ Extraction Science]]** - Brewing science fundamentals
- **[[Scientific References/Coffee Chemistry/|🧪 Chemistry]]** - Chemical deep-dives
- **[[Scientific References/Roasting/|🔥 Roasting Science]]** - Roast development
- **[[Scientific References/Sensory Science/|👅 Sensory Science]]** - Tasting expertise
- **[[Scientific References/Processing/|🏭 Processing Methods]]** - Post-harvest techniques
- **[[Scientific References/Agronomy/|🌱 Agronomy]]** - Cultivation science
- **[[Scientific References/Grinding/|⚙️ Grinding Science]]** - Grinder fundamentals

### Practical Guides
- **[[Brewing Guides/|☕ Brewing Guides]]** - 25+ method-specific instructions
- **[[Origins/|🌍 Origin Profiles]]** - 37+ geographic deep-dives
- **[[Beans Library/|🫘 Bean Library]]** - 67+ variety profiles
- **[[Roasters/|🏪 Roaster Profiles]]** - Specialty roaster database
- **[[Configuration/Property-Schema|📋 Property Schema]]** - Complete reference

---

## 🛠️ System Resources

### Configuration
- **[[VAULT-SYNTAX-AND-STANDARDS|📖 Syntax & Standards]]** - **NEW!** Complete reference
- **[[Configuration/User-Configuration-Guide|⚙️ Configuration Guide]]** - Setup help
- **[[PLUGIN-INSTALLATION-GUIDE|🔌 Plugin Guide]]** - Installation instructions
- **[[Configuration/Template-Framework-Standards|📐 Template Standards]]** - Development guide

### Analytics Dashboards (All 13)
1. **[[Analytics/1-Monthly-Analytics-Dashboard|📊 Monthly Analytics]]**
2. **[[Analytics/2-Brewing-Optimization-Engine|🎯 Brewing Optimizer]]**
3. **[[Analytics/3-Cost-Intelligence-System|💰 Cost Intelligence]]**
4. **[[Analytics/4-Palate-Development-Tracker|👅 Palate Tracker]]**
5. **[[Analytics/5-Quality-Predictor|🔮 Quality Predictor]]**
6. **[[Analytics/6-Correlation-Discovery-Engine|🔗 Correlations]]**
7. **[[Analytics/7-Anomaly-Detection-System|🚨 Anomaly Detector]]**
8. **[[Analytics/8-Multi-Variable-Recommendation-Engine|🤖 Recommendations]]**
9. **[[Analytics/9-Real-Time-Brewing-Assistant|⚡ Real-Time Assistant]]** - NEW 5.0
10. **[[Analytics/10-Supply-Chain-Transparency-Dashboard|🌱 Supply Chain]]** - NEW 5.0
11. **[[Analytics/11-Learning-Development-Dashboard|🎓 Learning Path]]** - NEW 5.0
12. **[[Analytics/12-Community-Comparison-Dashboard|👥 Community]]** - NEW 5.0
13. **[[Analytics/13-Equipment-Maintenance-Dashboard|🔧 Maintenance]]** - NEW 5.0

---

## 🎨 Interactive Visualizations

**🌟 [[VISUALIZATION-HUB.html|🎨 VISUALIZATION HUB - Launch Central Dashboard]]** ⭐ NEW

Professional webapp with all 18 tools organized and accessible:
- **[[Visualizations/interactive-brewing-dashboard.html|📊 Interactive Dashboard]]** - Chart.js analytics
- **[[Visualizations/brewing-triangle.html|📐 Brewing Triangle]]** - Extraction science
- **[[Visualizations/flavor-compass.html|🧭 Flavor Compass]]** - 4-axis profiling
- **[[Visualizations/3d-flavor-space.html|🌌 3D Flavor Space]]** - WebGL exploration
- **[[Visualizations/supply-chain-map.html|🌱 Supply Chain Map]]** - Transparency tracking

**Complete Index**: [[Views/Interactive-Visualizations-Dashboard|📋 All 18 Tools]]

---

## 📱 Mobile & Quick Access

### Mobile Templates
- **[[Templates/Mobile Quick Capture|📱 Mobile Capture]]** - Phone-optimized
- **[[Templates/Quick Coffee Capture|⚡ Quick Log]]** - Fast entry

### CSS Themes
- Coffee Vault Theme: Enabled ✅
- Mobile Responsive: Enabled ✅
- Custom coffee colors and styling

---

## 🎓 Learning Resources

### Getting Started
- **[[START-HERE|🚀 Start Here]]** - 5-minute quick start
- **[[README|📖 README]]** - System overview
- **[[VAULT-EXCELLENCE-ROADMAP|🗺️ Excellence Roadmap]]** - Implementation guide

### Advanced
- **[[Documentation/VAULT-ARCHITECTURE-REFERENCE|🏗️ Architecture]]** - Technical deep-dive
- **[[Scripts/AUTOMATION_MODULES_README|🤖 Automation]]** - 22 scripts explained
- **[[Documentation/Analytics-Overview|📊 Analytics Guide]]** - ML features

---

## ⚡ Automation Scripts

**Run from Terminal** (in Scripts folder):
```bash
npm run generate-weekly    # Weekly summary
npm run generate-monthly   # Monthly report
npm run optimize-brewing   # Brewing optimizer
npm run check-inventory    # Inventory status
npm run validate           # Data validation
```

---

## 📈 Your Progress

```dataviewjs
const logs = dv.pages('"Coffee Logs"').where(p => p.type === "coffee-log").array();

if (logs.length > 0) {
  const scientificDocs = dv.pages('"Scientific References"').where(p => p.type === "scientific-reference").length;
  const origins = dv.pages('"Origins"').where(p => p.type === "origin-profile").length;
  const beans = dv.pages('"Beans Library"').where(p => p.type === "bean-profile").length;

  dv.header(3, "📚 Content Library");
  dv.list([
    `☕ ${logs.length} Coffee Logs`,
    `🔬 ${scientificDocs} Scientific References`,
    `🌍 ${origins} Origin Profiles`,
    `🫘 ${beans} Bean Profiles`
  ]);

  // Progress milestones
  const milestones = [
    { threshold: 10, name: "Analytics Unlocked", icon: "📊" },
    { threshold: 20, name: "Trends Active", icon: "📈" },
    { threshold: 50, name: "ML Predictions Active", icon: "🤖" },
    { threshold: 100, name: "Master Level", icon: "🏆" }
  ];

  const achieved = milestones.filter(m => logs.length >= m.threshold);
  const next = milestones.find(m => logs.length < m.threshold);

  if (achieved.length > 0) {
    dv.header(4, "🎉 Achievements");
    dv.list(achieved.map(m => `${m.icon} ${m.name}`));
  }

  if (next) {
    dv.paragraph(`**Next Milestone**: ${next.icon} ${next.name} (${next.threshold - logs.length} brews away)`);
  }
}
```

---

## 🎯 Today's Actions

- [ ] Log today's coffee
- [ ] Review yesterday's brew
- [ ] Check active beans inventory
- [ ] Read one scientific reference
- [ ] Explore a new visualization

---

## 💡 Pro Tips

> [!tip] Daily Routine
> Log every brew immediately while details are fresh. 2-minute investment yields lifetime of insights.

> [!coffee] Quality Over Quantity
> 10 well-documented brews > 100 rushed entries. Focus on capturing what matters.

> [!science] Learning Path
> Start with [[Scientific References/Extraction Science/Coffee Brewing Control Chart|Brewing Control Chart]]—foundation of everything.

---

## 🔗 External Resources

- [SCA (Specialty Coffee Association)](https://sca.coffee)
- [World Coffee Research](https://worldcoffeeresearch.org)
- [Coffee Review](https://www.coffeereview.com)
- [Barista Hustle](https://www.baristahustle.com)

---

## ⚙️ System Status

```dataviewjs
// Check plugin status and system health
const plugins = [
  "Datacore",
  "Templater",
  "Calendar",
  "Tasks",
  "Periodic Notes"
];

dv.paragraph("**Plugins**: All " + plugins.length + " essential plugins configured ✅");
dv.paragraph("**CSS**: Coffee theme active ✅");
dv.paragraph("**Bases**: Database views available ✅");
dv.paragraph("**Visualizations**: 17 interactive tools ready ✅");
dv.paragraph("**Scripts**: 22 automation modules operational ✅");
```

---

**Coffee Vault 5.0** - Your complete coffee intelligence platform  
*Producer → Roaster → Brew → Optimize → Master*

---

## 🗺️ Site Map

<div class="sitemap-grid">

**Data Collection**
- Coffee Logs
- Bean Library
- Producers (NEW 5.0)
- Recipes (NEW 5.0)
- Events (NEW 5.0)
- Goals (NEW 5.0)

**Analytics**
- 13 ML Dashboards
- Real-Time Assistant
- Supply Chain Tracking
- Learning Development
- Community Comparison

**Knowledge**
- Scientific References
- Brewing Guides
- Origin Profiles
- Roaster Profiles

**Tools**
- 23+ Visualizations
- 28 Automation Scripts
- 13 Smart Templates

</div>

---

*This is your command center. Bookmark this page and start here every session.*

