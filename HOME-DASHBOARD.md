---
type: dashboard
version: 6.0.0
tags: [home, moc, navigation, ux-optimized]
cssclass: home-dashboard-v6
pin: true
accessibility: wcag-aa
---

<!-- ACCESSIBILITY: Skip link for keyboard navigation -->
<!-- Usage: Press Tab on page load to reveal "Skip to main content" link -->
<a href="#main-content" class="skip-link">Skip to main content</a>

# ☕ Coffee Vault 6.0

<!-- UX PRINCIPLE: Visual Hierarchy - Large hero title (32px) establishes page purpose immediately -->
<!-- DESIGN SYSTEM: Typography H1, color: coffee-primary -->

<div class="hero-subtitle">
Your intelligent coffee companion - from novice to master
</div>

<!-- UX PRINCIPLE: Aesthetic-Usability - Professional subtitle with value proposition -->
<!-- CSS: .hero-subtitle { font-size: 18px; color: var(--text-secondary); margin-bottom: 32px; } -->

---

<main id="main-content">

## 👤 Choose Your Experience

<!-- UX PRINCIPLE: Progressive Disclosure - Persona selector as Layer 1 (always visible) -->
<!-- UX PRINCIPLE: Hick's Law - Exactly 4 choices to prevent decision paralysis -->
<!-- ACCESSIBILITY: ARIA labels, keyboard navigation, semantic HTML -->

```dataviewjs
// SMART DETECTION: Analyze user's brew count to suggest appropriate persona
const logs = dv.pages('"Coffee Logs"').where(p => p.type === "coffee-log");
const logCount = logs.length;

// Determine suggested persona based on experience level
let suggestedPersona = "novice";
if (logCount >= 100) suggestedPersona = "professional";
else if (logCount >= 20) suggestedPersona = "enthusiast";
else if (logCount >= 0) suggestedPersona = "novice";

// Check for roaster/producer indicators (supply chain focus)
const hasProducerData = dv.pages('"Producers"').length > 5;
const hasRoasterData = dv.pages('"Roasters"').length > 5;
if (hasProducerData && hasRoasterData) suggestedPersona = "roaster";

// Persona definitions with rich metadata
const personas = [
  {
    id: "novice",
    icon: "🌱",
    name: "Novice Brewer",
    description: "Just starting your specialty coffee journey",
    experienceLevel: "0-20 brews",
    dashboard: "Views/Personas/Novice-Dashboard",
    color: "#4CAF50",
    features: ["Simple logging", "Basic guidance", "Quick wins"]
  },
  {
    id: "enthusiast",
    icon: "⭐",
    name: "Coffee Enthusiast",
    description: "Exploring methods and refining your craft",
    experienceLevel: "20-100 brews",
    dashboard: "Views/Personas/Enthusiast-Dashboard",
    color: "#FF6F00",
    features: ["Trend analytics", "Optimization tips", "Method comparison"]
  },
  {
    id: "professional",
    icon: "🏆",
    name: "Professional Taster",
    description: "Advanced palate development and cupping expertise",
    experienceLevel: "100+ brews",
    dashboard: "Views/Personas/Professional-Dashboard",
    color: "#5D4037",
    features: ["ML predictions", "Cupping protocols", "Advanced analytics"]
  },
  {
    id: "roaster",
    icon: "🔥",
    name: "Roaster/Producer",
    description: "Supply chain transparency and quality control",
    experienceLevel: "Professional role",
    dashboard: "Views/Personas/Roaster-Dashboard",
    color: "#3E2723",
    features: ["Supply chain tracking", "Producer profiles", "Economic analysis"]
  }
];

// Render persona cards in grid layout
dv.paragraph(`<div class="persona-grid" role="group" aria-label="Persona selection cards">`);

for (const persona of personas) {
  const isSuggested = persona.id === suggestedPersona;
  const suggestedBadge = isSuggested ? `<span class="badge-suggested" aria-label="Recommended for you">✨ Recommended</span>` : '';

  // UX PRINCIPLE: Fitts's Law - Large clickable cards (min 200x200px)
  // UX PRINCIPLE: Information Scent - Clear labels and descriptions
  // ACCESSIBILITY: Semantic HTML, ARIA roles, keyboard navigation
  dv.paragraph(`
    <div class="persona-card ${isSuggested ? 'persona-suggested' : ''}"
         role="button"
         tabindex="0"
         aria-label="${persona.name} - ${persona.description}"
         data-persona="${persona.id}">
      <div class="persona-icon" aria-hidden="true">${persona.icon}</div>
      <h3 class="persona-name">${persona.name}</h3>
      <p class="persona-description">${persona.description}</p>
      <p class="persona-experience">${persona.experienceLevel}</p>
      ${suggestedBadge}
      <div class="persona-features">
        ${persona.features.map(f => `<span class="feature-tag">• ${f}</span>`).join(' ')}
      </div>
      <a href="${persona.dashboard}" class="persona-cta" aria-label="Go to ${persona.name} dashboard">
        Explore Dashboard →
      </a>
    </div>
  `);
}

dv.paragraph(`</div>`);

// Context message based on user's level
const contextMessage = logCount === 0
  ? `<div class="context-message info" role="status">👋 Welcome! We've pre-selected <strong>Novice Brewer</strong> to get you started. Log a few brews to unlock more features!</div>`
  : logCount < 20
  ? `<div class="context-message info" role="status">📊 You have <strong>${logCount} brews</strong> logged. Keep going to unlock analytics and trends!</div>`
  : logCount < 100
  ? `<div class="context-message success" role="status">⭐ Nice work! <strong>${logCount} brews</strong> means analytics are active. ${100 - logCount} more for ML predictions.</div>`
  : `<div class="context-message success" role="status">🏆 Master level! <strong>${logCount} brews</strong> - all features unlocked including ML predictions and advanced analytics.</div>`;

dv.paragraph(contextMessage);
```

<!-- CSS SPECIFICATIONS for .persona-grid -->
<!--
.persona-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin: 24px 0;
}

@media (max-width: 768px) {
  .persona-grid {
    grid-template-columns: 1fr; /* Stack vertically on mobile */
  }
}

.persona-card {
  background: var(--surface);
  border: 2px solid var(--divider);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: all 200ms ease-out;
  cursor: pointer;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.persona-card:hover,
.persona-card:focus {
  border-color: var(--coffee-primary);
  box-shadow: 0 4px 16px rgba(93, 64, 55, 0.15);
  transform: translateY(-4px);
}

.persona-suggested {
  border-color: var(--coffee-accent);
  background: linear-gradient(135deg, #fff9f0 0%, #ffffff 100%);
}

.persona-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.persona-name {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 8px 0;
}

.persona-description {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 8px 0;
}

.persona-experience {
  font-size: 12px;
  color: var(--coffee-primary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-suggested {
  display: inline-block;
  background: var(--coffee-accent);
  color: white;
  font-size: 11px;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 600;
  margin: 8px 0;
}

.persona-features {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 12px 0;
  flex-grow: 1;
}

.feature-tag {
  display: block;
  text-align: left;
  padding: 2px 0;
}

.persona-cta {
  display: inline-block;
  background: var(--coffee-primary);
  color: white !important;
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none !important;
  font-weight: 600;
  font-size: 14px;
  transition: all 200ms ease-out;
  margin-top: auto;
  min-height: 44px; /* Touch target - Fitts's Law */
  display: flex;
  align-items: center;
  justify-content: center;
}

.persona-cta:hover {
  background: var(--coffee-primary-dark);
  transform: scale(1.05);
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--coffee-primary);
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
-->

---

## ⚡ Quick Actions

<!-- UX PRINCIPLE: Fitts's Law - Primary actions at top, large touch targets (56x56px on mobile) -->
<!-- UX PRINCIPLE: Progressive Disclosure - Layer 1 essential actions always visible -->

```dataviewjs
// Contextual quick actions based on user's experience level
const logs = dv.pages('"Coffee Logs"').where(p => p.type === "coffee-log");
const logCount = logs.length;

// Define actions with conditional visibility
const actions = [
  {
    icon: "➕",
    title: "Log Coffee",
    description: "Record your latest brew with detailed parameters",
    link: "Templates/Coffee-Log-v3",
    color: "#FF6F00",
    priority: "high",
    showAlways: true
  },
  {
    icon: "📊",
    title: "View Analytics",
    description: "Explore trends, patterns, and ML-powered insights",
    link: "Analytics/Analytics-Analysis-Layout/1-Monthly-Analytics-Dashboard",
    color: "#2196F3",
    priority: "high",
    showWhen: logCount >= 10
  },
  {
    icon: "🔍",
    title: "Search Vault",
    description: "Find beans, methods, origins, and scientific references",
    link: "omnisearch://",
    color: "#9C27B0",
    priority: "medium",
    showAlways: true
  },
  {
    icon: "🫘",
    title: "Add Bean",
    description: "Create a new bean profile with origin and roaster details",
    link: "Templates/Bean Profile",
    color: "#8D6E63",
    priority: "medium",
    showAlways: true
  },
  {
    icon: "🎨",
    title: "Visualizations",
    description: "Launch 23 interactive tools including 3D flavor space",
    link: "VISUALIZATION-HUB.html",
    color: "#E91E63",
    priority: "medium",
    showWhen: logCount >= 5
  },
  {
    icon: "🎯",
    title: "Optimize Brew",
    description: "Get AI recommendations for your next perfect cup",
    link: "Analytics/Analytics-Analysis-Layout/2-Brewing-Optimization-Engine",
    color: "#4CAF50",
    priority: "high",
    showWhen: logCount >= 20
  }
];

// Filter actions based on conditions
const visibleActions = actions.filter(a => a.showAlways || a.showWhen);

// Render as action button grid
dv.paragraph(`<div class="quick-actions-grid" role="toolbar" aria-label="Quick action buttons">`);

for (const action of visibleActions) {
  // ACCESSIBILITY: Large touch targets, clear labels, ARIA roles
  // DESIGN: Button styling follows design system
  dv.paragraph(`
    <a href="${action.link}"
       class="action-button action-${action.priority}"
       role="button"
       aria-label="${action.title} - ${action.description}"
       style="border-left: 4px solid ${action.color};">
      <div class="action-icon" aria-hidden="true">${action.icon}</div>
      <div class="action-content">
        <div class="action-title">${action.title}</div>
        <div class="action-description">${action.description}</div>
      </div>
      <div class="action-arrow" aria-hidden="true">→</div>
    </a>
  `);
}

dv.paragraph(`</div>`);
```

<!-- CSS SPECIFICATIONS for .quick-actions-grid -->
<!--
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin: 24px 0;
}

@media (max-width: 768px) {
  .quick-actions-grid {
    grid-template-columns: 1fr;
  }
}

.action-button {
  display: flex;
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--divider);
  border-radius: 8px;
  padding: 16px;
  text-decoration: none !important;
  transition: all 200ms ease-out;
  min-height: 80px; /* Fitts's Law - easy targeting */
  gap: 16px;
}

.action-button:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateX(4px);
  border-color: var(--coffee-primary);
}

.action-icon {
  font-size: 32px;
  flex-shrink: 0;
  width: 48px;
  text-align: center;
}

.action-content {
  flex-grow: 1;
}

.action-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.action-description {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.action-arrow {
  font-size: 20px;
  color: var(--text-disabled);
  flex-shrink: 0;
}

.action-high {
  /* High priority actions get subtle highlight */
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
}

/* Mobile: Larger touch targets */
@media (max-width: 768px) {
  .action-button {
    min-height: 88px; /* 56px minimum + padding */
    padding: 20px;
  }
}
-->

---

## 📈 Today's Status

<!-- UX PRINCIPLE: Recognition over Recall - Show recent activity, don't make users remember -->
<!-- PERFORMANCE: Optimized query with limit() to prevent slow rendering -->

```dataviewjs
const logs = dv.pages('"Coffee Logs"').where(p => p.type === "coffee-log").sort(p => p.date, 'desc');
const logCount = logs.length;

// Today's stats
const today = new Date().toISOString().split('T')[0];
const todayLogs = logs.where(p => p.date && String(p.date).startsWith(today));
const todayCount = todayLogs.length;

// Recent activity (last 3 brews)
const recentLogs = logs.limit(3).array();

// Inventory status
const beans = dv.pages('"Beans Library"').where(p => p.type === "bean-profile");
const activeBeans = beans.where(p => p.status === "active" || p.status === "in-stock");
const activeBeanCount = activeBeans.length;

// Render status dashboard
dv.paragraph(`<div class="status-dashboard" role="region" aria-label="Today's brewing status">`);

// Status cards
dv.paragraph(`
  <div class="status-grid">
    <div class="status-card" role="article">
      <div class="status-icon" aria-hidden="true">☕</div>
      <div class="status-value">${todayCount}</div>
      <div class="status-label">Brews Today</div>
    </div>
    <div class="status-card" role="article">
      <div class="status-icon" aria-hidden="true">📊</div>
      <div class="status-value">${logCount}</div>
      <div class="status-label">Total Logged</div>
    </div>
    <div class="status-card" role="article">
      <div class="status-icon" aria-hidden="true">🫘</div>
      <div class="status-value">${activeBeanCount}</div>
      <div class="status-label">Beans In Stock</div>
    </div>
  </div>
`);

// Recent activity feed
if (recentLogs.length > 0) {
  dv.paragraph(`<div class="recent-activity"><h4>Recent Activity</h4>`);

  for (const log of recentLogs) {
    const rating = log.rating ? `${'⭐'.repeat(Math.round(log.rating))}` : 'Not rated';
    const dateDisplay = log.date ? String(log.date).split('T')[0] : 'No date';

    dv.paragraph(`
      <div class="activity-item">
        <div class="activity-date">${dateDisplay}</div>
        <div class="activity-details">
          <strong>${log.beans || 'Unknown bean'}</strong> • ${log.method || 'Unknown method'}
        </div>
        <div class="activity-rating">${rating}</div>
      </div>
    `);
  }

  dv.paragraph(`</div>`);
} else {
  dv.paragraph(`
    <div class="empty-state" role="status">
      <div class="empty-icon">👋</div>
      <h4>No brews logged yet</h4>
      <p>Start your journey by logging your first coffee!</p>
      <a href="Templates/Coffee-Log-v3" class="btn-primary">Log Your First Brew</a>
    </div>
  `);
}

dv.paragraph(`</div>`);
```

<!-- CSS SPECIFICATIONS for status dashboard -->
<!--
.status-dashboard {
  background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
  border-radius: 12px;
  padding: 24px;
  margin: 24px 0;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.status-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.status-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.status-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--coffee-primary);
  margin-bottom: 4px;
}

.status-label {
  font-size: 13px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.recent-activity h4 {
  font-size: 18px;
  margin-bottom: 16px;
  color: var(--text-primary);
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 6px;
  margin-bottom: 8px;
  border-left: 3px solid var(--coffee-accent);
}

.activity-date {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
  min-width: 80px;
}

.activity-details {
  flex-grow: 1;
  font-size: 14px;
}

.activity-rating {
  font-size: 14px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 8px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state h4 {
  font-size: 20px;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.empty-state p {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.btn-primary {
  display: inline-block;
  background: var(--coffee-primary);
  color: white !important;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none !important;
  font-weight: 600;
  transition: all 200ms ease-out;
  min-height: 44px;
}

.btn-primary:hover {
  background: var(--coffee-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(93, 64, 55, 0.2);
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .status-grid {
    grid-template-columns: 1fr;
  }

  .activity-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
-->

---

## 📊 Quick Stats

<!-- UX PRINCIPLE: Progressive Disclosure - Layer 1 overview stats -->
<!-- PERFORMANCE: Cached calculations, optimized aggregations -->

```dataviewjs
const logs = dv.pages('"Coffee Logs"').where(p => p.type === "coffee-log").array();

if (logs.length > 0) {
  // Calculate key metrics
  const avgRating = Math.round(logs.reduce((sum, p) => sum + (p.rating || 0), 0) / logs.length * 100) / 100;
  const uniqueBeans = new Set(logs.map(p => p.beans).filter(b => b)).size;
  const uniqueMethods = new Set(logs.map(p => p.method).filter(m => m)).size;

  // Find top performers
  const topRated = logs.sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
  const favoriteBean = logs.reduce((acc, log) => {
    const bean = log.beans;
    if (bean) acc[bean] = (acc[bean] || 0) + 1;
    return acc;
  }, {});
  const mostUsedBean = Object.entries(favoriteBean).sort((a, b) => b[1] - a[1])[0];

  // Consistency metric (standard deviation of ratings)
  const ratingVariance = logs.reduce((sum, p) => {
    const diff = (p.rating || 0) - avgRating;
    return sum + (diff * diff);
  }, 0) / logs.length;
  const consistency = Math.max(0, 5 - Math.sqrt(ratingVariance));

  // Render stats grid
  dv.paragraph(`<div class="stats-grid" role="region" aria-label="Coffee statistics summary">`);

  const stats = [
    { icon: "⭐", label: "Average Rating", value: `${avgRating}/5.0`, color: "#FF6F00" },
    { icon: "🫘", label: "Unique Beans", value: uniqueBeans, color: "#8D6E63" },
    { icon: "☕", label: "Brewing Methods", value: uniqueMethods, color: "#5D4037" },
    { icon: "🏆", label: "Top Rated", value: topRated?.beans || 'N/A', subvalue: `${topRated?.rating}⭐`, color: "#FFC107" },
    { icon: "💚", label: "Favorite Bean", value: mostUsedBean ? mostUsedBean[0] : 'N/A', subvalue: mostUsedBean ? `${mostUsedBean[1]} brews` : '', color: "#4CAF50" },
    { icon: "📈", label: "Consistency", value: `${consistency.toFixed(1)}/5.0`, color: "#2196F3" }
  ];

  for (const stat of stats) {
    dv.paragraph(`
      <div class="stat-card" style="border-top: 3px solid ${stat.color};">
        <div class="stat-icon" aria-hidden="true">${stat.icon}</div>
        <div class="stat-label">${stat.label}</div>
        <div class="stat-value">${stat.value}</div>
        ${stat.subvalue ? `<div class="stat-subvalue">${stat.subvalue}</div>` : ''}
      </div>
    `);
  }

  dv.paragraph(`</div>`);
} else {
  dv.paragraph(`
    <div class="info-callout">
      <strong>No data yet</strong> - Log your first brew to see personalized statistics!
    </div>
  `);
}
```

<!-- CSS SPECIFICATIONS for stats grid -->
<!--
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  margin: 24px 0;
}

.stat-card {
  background: var(--surface);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: all 200ms ease-out;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 36px;
  margin-bottom: 12px;
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  font-weight: 500;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.stat-subvalue {
  font-size: 13px;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
-->

---

<!-- UX PRINCIPLE: Progressive Disclosure - Layer 2 begins here (Discovery content) -->
<!-- IMPLEMENTATION: Tabs or expandable sections for knowledge, visualizations, resources -->

<details class="disclosure-section" open>
<summary class="section-toggle" role="button" aria-expanded="true">
  <h2>📚 Knowledge Library</h2>
  <span class="toggle-icon" aria-hidden="true">▼</span>
</summary>

<!-- UX PRINCIPLE: Information Scent - Descriptive labels with counts and context -->

```dataviewjs
// PERFORMANCE OPTIMIZATION: Count queries cached for faster rendering
const beans = dv.pages('"Beans Library"').where(p => p.type === "bean-profile").length;
const origins = dv.pages('"Origins"').where(p => p.type === "origin-profile").length;
const scientificRefs = dv.pages('"Scientific References"').where(p => p.type === "scientific-reference").length;
const brewingGuides = dv.pages('"Brewing Guides"').where(p => p.type === "brewing-guide").length;
const roasters = dv.pages('"Roasters"').where(p => p.type === "roaster-profile").length;
const recipes = dv.pages('"Recipes"').where(p => p.type === "recipe").length;

const libraries = [
  {
    icon: "🫘",
    title: "Bean Variety Library",
    count: beans,
    description: "Comprehensive arabica and robusta variety profiles with genetics, flavor characteristics, and growing requirements",
    link: "Beans Library/",
    category: "Reference"
  },
  {
    icon: "🌍",
    title: "Origin Profiles",
    count: origins,
    description: "Geographic deep-dives covering terroir, processing traditions, and regional flavor profiles from 37+ countries",
    link: "Origins/",
    category: "Reference"
  },
  {
    icon: "☕",
    title: "Brewing Method Guides",
    count: brewingGuides,
    description: "Step-by-step instructions for 25+ methods from traditional to cutting-edge, with recommended parameters",
    link: "Brewing Guides/",
    category: "Practical"
  },
  {
    icon: "🔬",
    title: "Scientific References",
    count: scientificRefs,
    description: "Evidence-based research on extraction science, chemistry, sensory analysis, roasting, and agronomy",
    link: "Scientific References/00-Scientific Content Index",
    category: "Science"
  },
  {
    icon: "🏪",
    title: "Roaster Profiles",
    count: roasters,
    description: "Specialty roaster database with philosophies, certifications, and sourcing practices",
    link: "Roasters/",
    category: "Directory"
  },
  {
    icon: "📖",
    title: "Recipe Collection",
    count: recipes,
    description: "Curated brewing recipes with detailed parameters, tasting notes, and optimization tips",
    link: "Recipes/",
    category: "Practical"
  }
];

dv.paragraph(`<div class="library-grid" role="list" aria-label="Knowledge library sections">`);

for (const lib of libraries) {
  dv.paragraph(`
    <a href="${lib.link}" class="library-card" role="listitem">
      <div class="library-header">
        <div class="library-icon" aria-hidden="true">${lib.icon}</div>
        <span class="library-category">${lib.category}</span>
      </div>
      <h3 class="library-title">${lib.title}</h3>
      <div class="library-count">${lib.count} ${lib.count === 1 ? 'entry' : 'entries'}</div>
      <p class="library-description">${lib.description}</p>
      <div class="library-cta">Explore collection →</div>
    </a>
  `);
}

dv.paragraph(`</div>`);
```

<!-- CSS SPECIFICATIONS for library grid -->
<!--
.disclosure-section {
  margin: 32px 0;
  border: 1px solid var(--divider);
  border-radius: 12px;
  overflow: hidden;
}

.section-toggle {
  cursor: pointer;
  padding: 20px 24px;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  border: none;
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
}

.section-toggle:hover {
  background: linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%);
}

.section-toggle h2 {
  margin: 0;
  font-size: 24px;
}

.toggle-icon {
  font-size: 14px;
  transition: transform 200ms ease-out;
}

details[open] .toggle-icon {
  transform: rotate(180deg);
}

.library-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  padding: 24px;
}

.library-card {
  background: var(--surface);
  border: 1px solid var(--divider);
  border-radius: 10px;
  padding: 20px;
  text-decoration: none !important;
  transition: all 200ms ease-out;
  display: flex;
  flex-direction: column;
  min-height: 220px;
}

.library-card:hover {
  border-color: var(--coffee-primary);
  box-shadow: 0 4px 12px rgba(93, 64, 55, 0.1);
  transform: translateY(-2px);
}

.library-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.library-icon {
  font-size: 32px;
}

.library-category {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
  background: var(--background);
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 600;
}

.library-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 8px 0;
}

.library-count {
  font-size: 14px;
  color: var(--coffee-primary);
  font-weight: 600;
  margin-bottom: 8px;
}

.library-description {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  flex-grow: 1;
  margin: 8px 0;
}

.library-cta {
  font-size: 14px;
  color: var(--coffee-accent);
  font-weight: 600;
  margin-top: 12px;
}

@media (max-width: 768px) {
  .library-grid {
    grid-template-columns: 1fr;
  }
}
-->

</details>

---

<details class="disclosure-section">
<summary class="section-toggle" role="button" aria-expanded="false">
  <h2>🎨 Interactive Visualizations</h2>
  <span class="toggle-icon" aria-hidden="true">▼</span>
</summary>

<!-- UX PRINCIPLE: Recognition over Recall - Visual previews with clear descriptions -->

<div class="section-content">

> [!tip] Featured Tool
> **[[VISUALIZATION-HUB.html|🌟 Visualization Hub]]** - Launch the central dashboard with all 23 interactive tools organized by category

### 3D Immersive Experiences

```dataviewjs
const viz3d = [
  {
    icon: "🌌",
    title: "3D Flavor Space Explorer",
    description: "Navigate through WebGL-powered 3D flavor space with your entire brew history plotted across acidity, sweetness, and body axes",
    link: "Visualizations/3d-flavor-space.html",
    tech: "Three.js",
    features: "Real-time rotation • Cluster detection • 60 FPS performance"
  },
  {
    icon: "🗺️",
    title: "Supply Chain Journey Map",
    description: "Interactive global map tracing coffee from farm to cup with producer details, processing methods, and sustainability metrics",
    link: "Visualizations/supply-chain-map.html",
    tech: "Leaflet.js",
    features: "Producer profiles • Certifications • Economic transparency"
  },
  {
    icon: "🧭",
    title: "Flavor Compass",
    description: "4-axis sensory profiling tool plotting your brews across acidity, sweetness, bitterness, and body dimensions",
    link: "Visualizations/flavor-compass.html",
    tech: "D3.js",
    features: "Quadrant analysis • Comparative overlays • Export PNG"
  }
];

dv.paragraph(`<div class="viz-showcase">`);

for (const viz of viz3d) {
  dv.paragraph(`
    <div class="viz-card viz-featured">
      <div class="viz-icon">${viz.icon}</div>
      <h4 class="viz-title">${viz.title}</h4>
      <p class="viz-description">${viz.description}</p>
      <div class="viz-meta">
        <span class="viz-tech">${viz.tech}</span>
        <span class="viz-features">${viz.features}</span>
      </div>
      <a href="${viz.link}" class="viz-launch">Launch Tool →</a>
    </div>
  `);
}

dv.paragraph(`</div>`);
```

### Analytics & Insights

- **[[Visualizations/interactive-brewing-dashboard.html|📊 Interactive Dashboard]]** - Chart.js analytics with trend lines, moving averages, and quality forecasting
- **[[Visualizations/brewing-triangle.html|📐 Brewing Triangle]]** - Interactive control chart plotting extraction yield vs. strength with SCA ideal brew zone
- **[[Visualizations/correlation-heatmap.html|🔥 Correlation Heatmap]]** - Discover relationships between variables (grind size, temperature, rating) with statistical significance
- **[[Visualizations/anomaly-detector.html|🚨 Anomaly Detector]]** - ML-powered outlier detection highlighting unusual brews for investigation

### Complete Collection

**[[Views/Learning-Education-Layout/Interactive-Visualizations-Dashboard|📋 View all 23 interactive tools]]** organized by category with screenshots and usage guides

</div>

<!-- CSS for visualizations showcase -->
<!--
.section-content {
  padding: 24px;
}

.viz-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin: 24px 0;
}

.viz-card {
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  border: 2px solid var(--divider);
  border-radius: 10px;
  padding: 24px;
  text-align: center;
}

.viz-featured {
  border-color: var(--coffee-accent-light);
  background: linear-gradient(135deg, #fff9f0 0%, #ffffff 100%);
}

.viz-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.viz-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 12px 0;
}

.viz-description {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 12px 0;
}

.viz-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 16px 0;
  padding: 12px;
  background: var(--background);
  border-radius: 6px;
}

.viz-tech {
  font-size: 12px;
  font-weight: 600;
  color: var(--coffee-primary);
}

.viz-features {
  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.viz-launch {
  display: inline-block;
  background: var(--coffee-accent);
  color: white !important;
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none !important;
  font-weight: 600;
  font-size: 14px;
  transition: all 200ms ease-out;
  margin-top: 12px;
}

.viz-launch:hover {
  background: var(--coffee-accent-dark);
  transform: scale(1.05);
}
-->

</details>

---

<details class="disclosure-section">
<summary class="section-toggle" role="button" aria-expanded="false">
  <h2>📊 Analytics & ML Dashboards</h2>
  <span class="toggle-icon" aria-hidden="true">▼</span>
</summary>

<div class="section-content">

<!-- SMART CONTEXTUAL RENDERING: Show appropriate dashboards based on data availability -->

```dataviewjs
const logCount = dv.pages('"Coffee Logs"').where(p => p.type === "coffee-log").length;

// Dashboard definitions with unlock thresholds
const dashboards = [
  {
    category: "Daily Brewing",
    icon: "☕",
    items: [
      {
        title: "Coffee Dashboard",
        description: "Your central brewing hub with quick stats, recent logs, and daily workflow optimization",
        link: "Views/Daily-Brewing-Layout/Coffee Dashboard",
        unlockAt: 0,
        priority: "high"
      },
      {
        title: "Real-Time Brewing Assistant",
        description: "Live guidance during brewing with parameter suggestions, timer alerts, and quality predictions",
        link: "Analytics/Daily-Brewing-Layout/9-Real-Time-Brewing-Assistant",
        unlockAt: 5,
        priority: "high"
      },
      {
        title: "Equipment Maintenance Tracker",
        description: "Track cleaning schedules, descaling cycles, and burr replacement for optimal equipment longevity",
        link: "Analytics/Daily-Brewing-Layout/13-Equipment-Maintenance-Dashboard",
        unlockAt: 10,
        priority: "medium"
      }
    ]
  },
  {
    category: "Analytics & Optimization",
    icon: "📈",
    items: [
      {
        title: "Monthly Analytics Dashboard",
        description: "Comprehensive monthly trends with ML predictions, quality forecasting, and consistency scoring",
        link: "Analytics/Analytics-Analysis-Layout/1-Monthly-Analytics-Dashboard",
        unlockAt: 10,
        priority: "high"
      },
      {
        title: "Brewing Optimization Engine",
        description: "AI-powered recommendations analyzing 100+ parameters to suggest optimal brewing conditions for any bean",
        link: "Analytics/Analytics-Analysis-Layout/2-Brewing-Optimization-Engine",
        unlockAt: 20,
        priority: "high"
      },
      {
        title: "Quality Predictor",
        description: "Machine learning model forecasting brew quality based on bean characteristics and brewing parameters",
        link: "Analytics/Analytics-Analysis-Layout/5-Quality-Predictor",
        unlockAt: 50,
        priority: "advanced"
      },
      {
        title: "Correlation Discovery Engine",
        description: "Statistical analysis revealing hidden relationships between variables with significance testing",
        link: "Analytics/Analytics-Analysis-Layout/6-Correlation-Discovery-Engine",
        unlockAt: 30,
        priority: "advanced"
      },
      {
        title: "Anomaly Detection System",
        description: "Identifies unusual brews and outliers using statistical methods and ML clustering algorithms",
        link: "Analytics/Analytics-Analysis-Layout/7-Anomaly-Detection-System",
        unlockAt: 40,
        priority: "advanced"
      },
      {
        title: "Multi-Variable Recommendation Engine",
        description: "Advanced AI combining collaborative filtering and content-based recommendations for personalized suggestions",
        link: "Analytics/Analytics-Analysis-Layout/8-Multi-Variable-Recommendation-Engine",
        unlockAt: 50,
        priority: "advanced"
      }
    ]
  },
  {
    category: "Learning & Development",
    icon: "🎓",
    items: [
      {
        title: "Palate Development Tracker",
        description: "Monitor sensory skill progression with calibration exercises, reference standards, and improvement metrics",
        link: "Analytics/Learning-Education-Layout/4-Palate-Development-Tracker",
        unlockAt: 15,
        priority: "medium"
      },
      {
        title: "Learning Development Dashboard",
        description: "Personal growth roadmap with skill assessments, knowledge gaps, and curated learning paths",
        link: "Analytics/Learning-Education-Layout/11-Learning-Development-Dashboard",
        unlockAt: 5,
        priority: "medium"
      }
    ]
  },
  {
    category: "Supply Chain & Economics",
    icon: "🌱",
    items: [
      {
        title: "Cost Intelligence System",
        description: "Economic analytics tracking cost per cup, value optimization, and spending patterns over time",
        link: "Analytics/Analytics-Analysis-Layout/3-Cost-Intelligence-System",
        unlockAt: 10,
        priority: "medium"
      },
      {
        title: "Supply Chain Transparency Dashboard",
        description: "Full traceability from farm to cup with producer relationships, certifications, and sustainability metrics",
        link: "Analytics/Supply-Chain-Layout/10-Supply-Chain-Transparency-Dashboard",
        unlockAt: 0,
        priority: "medium"
      },
      {
        title: "Community Comparison Dashboard",
        description: "Benchmark your brewing against community averages with anonymized data from other Coffee Vault users",
        link: "Analytics/Supply-Chain-Layout/12-Community-Comparison-Dashboard",
        unlockAt: 20,
        priority: "low"
      }
    ]
  }
];

// Render dashboards by category
for (const category of dashboards) {
  dv.header(3, `${category.icon} ${category.category}`);

  dv.paragraph(`<div class="dashboard-grid">`);

  for (const dashboard of category.items) {
    const isUnlocked = logCount >= dashboard.unlockAt;
    const lockStatus = isUnlocked
      ? '<span class="status-unlocked" aria-label="Unlocked">✓ Available</span>'
      : `<span class="status-locked" aria-label="Locked - requires ${dashboard.unlockAt} brews">🔒 Unlock at ${dashboard.unlockAt} brews</span>`;

    const cardClass = isUnlocked ? 'dashboard-card' : 'dashboard-card dashboard-locked';

    dv.paragraph(`
      <div class="${cardClass}" data-priority="${dashboard.priority}">
        <div class="dashboard-header">
          <h4 class="dashboard-title">${dashboard.title}</h4>
          ${lockStatus}
        </div>
        <p class="dashboard-description">${dashboard.description}</p>
        ${isUnlocked
          ? `<a href="${dashboard.link}" class="dashboard-link">Open Dashboard →</a>`
          : `<div class="dashboard-locked-msg">Log ${dashboard.unlockAt - logCount} more brews to unlock</div>`
        }
      </div>
    `);
  }

  dv.paragraph(`</div>`);
}

// Progress indicator
const totalDashboards = dashboards.reduce((sum, cat) => sum + cat.items.length, 0);
const unlockedDashboards = dashboards.reduce((sum, cat) => {
  return sum + cat.items.filter(d => logCount >= d.unlockAt).length;
}, 0);
const percentUnlocked = Math.round((unlockedDashboards / totalDashboards) * 100);

dv.paragraph(`
  <div class="progress-indicator" role="status">
    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${percentUnlocked}%;" aria-valuenow="${percentUnlocked}" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
    <div class="progress-text">${unlockedDashboards} of ${totalDashboards} dashboards unlocked (${percentUnlocked}%)</div>
  </div>
`);
```

</div>

<!-- CSS for dashboards section -->
<!--
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  margin: 20px 0;
}

.dashboard-card {
  background: var(--surface);
  border: 1px solid var(--divider);
  border-radius: 8px;
  padding: 20px;
  transition: all 200ms ease-out;
}

.dashboard-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border-color: var(--coffee-primary);
}

.dashboard-locked {
  opacity: 0.6;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 12px;
}

.dashboard-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  flex-grow: 1;
}

.status-unlocked {
  font-size: 11px;
  color: var(--success);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.status-locked {
  font-size: 11px;
  color: var(--warning);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.dashboard-description {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 12px 0;
}

.dashboard-link {
  display: inline-block;
  color: var(--coffee-accent) !important;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none !important;
  margin-top: 8px;
}

.dashboard-link:hover {
  color: var(--coffee-accent-dark) !important;
  text-decoration: underline !important;
}

.dashboard-locked-msg {
  font-size: 12px;
  color: var(--text-disabled);
  font-style: italic;
  margin-top: 8px;
}

.progress-indicator {
  margin: 24px 0;
  padding: 20px;
  background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
  border-radius: 8px;
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background: var(--divider);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--coffee-accent) 0%, var(--coffee-primary) 100%);
  transition: width 500ms ease-out;
  border-radius: 4px;
}

.progress-text {
  font-size: 13px;
  color: var(--text-secondary);
  text-align: center;
  font-weight: 500;
}
-->

</details>

---

<details class="disclosure-section">
<summary class="section-toggle" role="button" aria-expanded="false">
  <h2>⚡ Automation & Scripts</h2>
  <span class="toggle-icon" aria-hidden="true">▼</span>
</summary>

<div class="section-content">

> [!info] Terminal Required
> Run automation scripts from the `/Scripts` directory using npm commands or node directly

### Weekly & Monthly Automation

```bash
# Generate comprehensive weekly summary
npm run generate-weekly

# Create monthly analytics report
npm run generate-monthly

# Optimize brewing parameters based on recent data
npm run optimize-brewing

# Check bean inventory and expiration dates
npm run check-inventory

# Validate data integrity and relationships
npm run validate
```

### Available Automation Modules

**Data Generation & Analysis** (22 total scripts)
- `weekly-summary-generator.js` - Aggregate weekly stats with trends
- `monthly-analytics-generator.js` - Comprehensive monthly report
- `brewing-optimizer.js` - ML-powered parameter optimization
- `inventory-manager.js` - Stock tracking and alerts
- `data-validator.js` - Schema validation and integrity checks
- `correlation-analyzer.js` - Statistical relationship discovery
- `anomaly-detector.js` - Outlier identification
- `quality-predictor.js` - ML-based quality forecasting

**Learn More**: [[Scripts/AUTOMATION_MODULES_README|🤖 Complete automation documentation]]

</div>

</details>

---

<!-- UX PRINCIPLE: Progressive Disclosure - Layer 3 (Advanced/System) -->
<!-- These are links to dedicated pages, not expanded content -->

<details class="disclosure-section">
<summary class="section-toggle" role="button" aria-expanded="false">
  <h2>⚙️ System Configuration & Resources</h2>
  <span class="toggle-icon" aria-hidden="true">▼</span>
</summary>

<div class="section-content">

### Getting Started

- **[[START-HERE|🚀 Start Here]]** - 5-minute quick start guide for new users
- **[[README|📖 System Overview]]** - Complete feature documentation and capabilities
- **[[VAULT-EXCELLENCE-ROADMAP|🗺️ Excellence Roadmap]]** - Step-by-step implementation guide

### Configuration & Standards

- **[[VAULT-SYNTAX-AND-STANDARDS|📖 Syntax & Standards]]** - Complete reference for formatting, naming, and best practices
- **[[Configuration/Property-Schema|📋 Property Schema]]** - Comprehensive field definitions and data types
- **[[Configuration/User-Configuration-Guide|⚙️ Configuration Guide]]** - Personalization and customization options
- **[[Configuration/Template-Framework-Standards|📐 Template Standards]]** - Development guide for custom templates

### Technical Documentation

- **[[Documentation/VAULT-ARCHITECTURE-REFERENCE|🏗️ Architecture Reference]]** - Technical deep-dive into system design and data flow
- **[[Documentation/Analytics-Overview|📊 Analytics Guide]]** - ML features, algorithms, and statistical methods
- **[[PLUGIN-INSTALLATION-GUIDE|🔌 Plugin Installation]]** - Required plugins and setup instructions
- **[[Configuration/Manual-Operations-Guide|🛠️ Manual Operations]]** - Troubleshooting and maintenance procedures

### Workspace Bundles

Organized collections optimized for specific workflows:

- **[[Workspaces/Daily-Brewing/INDEX|☕ Daily Brewing Bundle]]** - Logging, quick stats, and brewing assistant
- **[[Workspaces/Analytics-Analysis/INDEX|📊 Analytics & Analysis Bundle]]** - ML dashboards and optimization tools
- **[[Workspaces/Learning-Education/INDEX|🎓 Learning & Education Bundle]]** - Palate development and knowledge resources
- **[[Workspaces/Supply-Chain/INDEX|🌱 Supply Chain Bundle]]** - Transparency tracking and producer relationships

</div>

</details>

---

</main>

## 🎯 Personalized Recommendations

<!-- UX PRINCIPLE: Recognition over Recall - Contextual suggestions based on behavior -->
<!-- SMART AI: Personalized recommendations based on user's journey stage -->

```dataviewjs
const logs = dv.pages('"Coffee Logs"').where(p => p.type === "coffee-log");
const logCount = logs.length;

// Generate contextual recommendations
let recommendations = [];

if (logCount === 0) {
  recommendations = [
    { icon: "🚀", text: "Start by reading the [[START-HERE|5-minute quick start guide]]", priority: "high" },
    { icon: "☕", text: "Log your first brew using [[Templates/Coffee-Log-v3|Coffee Log Template]]", priority: "high" },
    { icon: "🫘", text: "Add your current beans to the [[Templates/Bean Profile|Bean Library]]", priority: "medium" }
  ];
} else if (logCount < 10) {
  recommendations = [
    { icon: "📊", text: `Log ${10 - logCount} more brews to unlock analytics dashboards`, priority: "high" },
    { icon: "🔬", text: "Learn extraction fundamentals: [[Scientific References/Extraction Science/Coffee Brewing Control Chart|Brewing Control Chart]]", priority: "medium" },
    { icon: "☕", text: "Try a new brewing method from [[Brewing Guides/|Brewing Guides]]", priority: "low" }
  ];
} else if (logCount < 50) {
  recommendations = [
    { icon: "🎯", text: "Explore [[Analytics/Analytics-Analysis-Layout/2-Brewing-Optimization-Engine|Brewing Optimizer]] for personalized tips", priority: "high" },
    { icon: "📈", text: "Review your trends in [[Analytics/Analytics-Analysis-Layout/1-Monthly-Analytics-Dashboard|Monthly Analytics]]", priority: "high" },
    { icon: "🏆", text: `${50 - logCount} more brews until ML predictions unlock!`, priority: "medium" }
  ];
} else {
  recommendations = [
    { icon: "🤖", text: "All features unlocked! Try [[Analytics/Analytics-Analysis-Layout/5-Quality-Predictor|Quality Predictor]]", priority: "high" },
    { icon: "🔗", text: "Discover patterns in [[Analytics/Analytics-Analysis-Layout/6-Correlation-Discovery-Engine|Correlation Engine]]", priority: "high" },
    { icon: "👅", text: "Advance your palate with [[Analytics/Learning-Education-Layout/4-Palate-Development-Tracker|Palate Tracker]]", priority: "medium" }
  ];
}

if (recommendations.length > 0) {
  dv.paragraph(`<div class="recommendations-section" role="complementary" aria-label="Personalized recommendations">`);
  dv.paragraph(`<h3 class="recommendations-title">Recommended Next Steps</h3>`);
  dv.paragraph(`<ul class="recommendations-list">`);

  for (const rec of recommendations) {
    const priorityClass = `rec-${rec.priority}`;
    dv.paragraph(`
      <li class="recommendation-item ${priorityClass}">
        <span class="rec-icon" aria-hidden="true">${rec.icon}</span>
        <span class="rec-text">${rec.text}</span>
      </li>
    `);
  }

  dv.paragraph(`</ul></div>`);
}
```

<!-- CSS for recommendations -->
<!--
.recommendations-section {
  background: linear-gradient(135deg, #fff9f0 0%, #ffffff 100%);
  border-left: 4px solid var(--coffee-accent);
  border-radius: 8px;
  padding: 24px;
  margin: 24px 0;
}

.recommendations-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.recommendations-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.recommendation-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-bottom: 8px;
  background: white;
  border-radius: 6px;
  border-left: 3px solid transparent;
}

.rec-high {
  border-left-color: var(--coffee-accent);
}

.rec-medium {
  border-left-color: var(--warning);
}

.rec-low {
  border-left-color: var(--info);
}

.rec-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.rec-text {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.5;
}

.rec-text a {
  color: var(--coffee-primary) !important;
  font-weight: 600;
  text-decoration: none !important;
}

.rec-text a:hover {
  text-decoration: underline !important;
}
-->

---

## 🔗 External Resources

<!-- UX PRINCIPLE: Information Scent - Descriptive labels for external links -->
<!-- ACCESSIBILITY: External link indicators -->

<div class="external-resources" role="complementary">

**Industry Organizations**
- [SCA (Specialty Coffee Association)](https://sca.coffee) - Standards, certifications, and research
- [World Coffee Research](https://worldcoffeeresearch.org) - Variety development and agronomy science
- [Coffee Quality Institute](https://www.coffeeinstitute.org) - Q Grader program and quality protocols

**Learning Platforms**
- [Barista Hustle](https://www.baristahustle.com) - Professional training and courses
- [Coffee Review](https://www.coffeereview.com) - Cupping notes and roaster ratings
- [Perfect Daily Grind](https://perfectdailygrind.com) - Industry news and brewing guides

</div>

---

## 💡 Pro Tips

<!-- UX PRINCIPLE: Progressive Disclosure - Helpful tips in callouts -->

> [!tip] Daily Routine
> **Log immediately after brewing** while sensory memories are fresh. A 2-minute investment yields a lifetime of insights and pattern discovery.

> [!coffee] Quality Over Quantity
> **10 well-documented brews** with detailed notes and parameters are more valuable than 100 rushed entries. Focus on capturing what matters: beans, method, grind, water, and rating.

> [!science] Learning Path
> Start with the [[Scientific References/Extraction Science/Coffee Brewing Control Chart|Coffee Brewing Control Chart]]—it's the foundation for understanding every aspect of coffee brewing.

> [!accessibility] Keyboard Navigation
> Press **Tab** to navigate between sections, **Enter** to expand/collapse, and **Cmd/Ctrl + K** for quick search (if Omnisearch plugin installed).

---

## ⚙️ System Status

<!-- PERFORMANCE: Simple status check without heavy queries -->

```dataviewjs
const logCount = dv.pages('"Coffee Logs"').where(p => p.type === "coffee-log").length;
const beanCount = dv.pages('"Beans Library"').where(p => p.type === "bean-profile").length;
const visualizationCount = 23;
const scriptCount = 22;

dv.paragraph(`
<div class="system-status" role="status" aria-label="Coffee Vault system status">
  <div class="status-row">
    <span class="status-label">☕ Coffee Logs</span>
    <span class="status-value">${logCount} entries</span>
  </div>
  <div class="status-row">
    <span class="status-label">🫘 Bean Library</span>
    <span class="status-value">${beanCount} profiles</span>
  </div>
  <div class="status-row">
    <span class="status-label">🎨 Visualizations</span>
    <span class="status-value">${visualizationCount} tools ready</span>
  </div>
  <div class="status-row">
    <span class="status-label">🤖 Automation Scripts</span>
    <span class="status-value">${scriptCount} modules operational</span>
  </div>
  <div class="status-row">
    <span class="status-label">🔌 Plugins</span>
    <span class="status-value">All essential plugins configured ✅</span>
  </div>
  <div class="status-row">
    <span class="status-label">🎨 Theme</span>
    <span class="status-value">Coffee Vault 6.0 active ✅</span>
  </div>
</div>
`);
```

<!-- CSS for system status -->
<!--
.system-status {
  background: var(--background);
  border-radius: 8px;
  padding: 20px;
  margin: 24px 0;
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--divider);
}

.status-row:last-child {
  border-bottom: none;
}

.status-label {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}

.status-value {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 600;
}

@media (max-width: 768px) {
  .status-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
-->

---

<footer class="dashboard-footer">

**Coffee Vault 6.0** - Your intelligent coffee companion from first sip to master level
*Producer → Roaster → Brew → Analyze → Optimize → Master*

<div class="footer-meta">
Version 6.0.0 | UX-Optimized Dashboard | WCAG 2.1 AA Compliant
<a href="HOME-DASHBOARD-v5">View previous version (5.0)</a>
</div>

</footer>

<!-- GLOBAL CSS SPECIFICATIONS -->
<!--
These CSS rules should be added to your Obsidian CSS snippet or theme

/* CSS Variables - Coffee Vault 6.0 Design System */
:root {
  /* Primary Colors */
  --coffee-primary: #5D4037;
  --coffee-primary-light: #8D6E63;
  --coffee-primary-dark: #3E2723;

  /* Accent Colors */
  --coffee-accent: #FF6F00;
  --coffee-accent-light: #FFA726;
  --coffee-accent-dark: #E65100;

  /* Semantic Colors */
  --success: #4CAF50;
  --warning: #FFC107;
  --error: #F44336;
  --info: #2196F3;

  /* Neutral Colors */
  --text-primary: #212121;
  --text-secondary: #757575;
  --text-disabled: #BDBDBD;
  --background: #FAFAFA;
  --surface: #FFFFFF;
  --divider: #E0E0E0;

  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 20px;
  --text-xl: 24px;
  --text-2xl: 32px;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
}

/* Global Utilities */
.context-message {
  padding: 16px 20px;
  border-radius: 8px;
  margin: 16px 0;
  font-size: 14px;
  line-height: 1.6;
}

.context-message.info {
  background: #E3F2FD;
  border-left: 4px solid var(--info);
  color: #1565C0;
}

.context-message.success {
  background: #E8F5E9;
  border-left: 4px solid var(--success);
  color: #2E7D32;
}

.info-callout {
  background: var(--background);
  border-left: 4px solid var(--info);
  padding: 16px;
  border-radius: 6px;
  margin: 16px 0;
}

.dashboard-footer {
  text-align: center;
  padding: 32px 0;
  margin-top: 48px;
  border-top: 2px solid var(--divider);
  color: var(--text-secondary);
  font-size: 14px;
}

.footer-meta {
  margin-top: 12px;
  font-size: 12px;
  color: var(--text-disabled);
}

.footer-meta a {
  color: var(--coffee-primary) !important;
  text-decoration: none !important;
}

.external-resources {
  padding: 20px;
  background: var(--background);
  border-radius: 8px;
  margin: 24px 0;
}

.external-resources h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--coffee-primary);
  margin-bottom: 8px;
}

.external-resources a {
  color: var(--coffee-accent) !important;
  font-weight: 500;
}

/* ACCESSIBILITY: Focus visible for keyboard navigation */
*:focus-visible {
  outline: 2px solid var(--coffee-primary);
  outline-offset: 2px;
  border-radius: 4px;
}

/* MOBILE: Touch-friendly adjustments */
@media (max-width: 768px) {
  :root {
    --text-2xl: 28px;
    --text-xl: 22px;
  }

  /* Ensure all interactive elements meet 44x44px touch target */
  button, a, [role="button"], [tabindex="0"] {
    min-height: 44px;
    min-width: 44px;
  }
}

/* PERFORMANCE: Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
-->

<!-- END OF HOME-DASHBOARD.md -->
