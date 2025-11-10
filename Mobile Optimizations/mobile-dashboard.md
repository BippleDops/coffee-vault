---
type: mobile-dashboard
title: Mobile Coffee Dashboard
tags: [dashboard, mobile, overview]
---

# 📱 Mobile Coffee Dashboard

> **Optimized for mobile viewing** - All sections collapse for easy navigation on small screens

---

## 📊 Quick Stats

```dataviewjs
// Mobile-optimized stats grid
const logs = dv.pages('"Coffee Logs"').where(p => p.type === "coffee-log");
const thisMonth = logs.where(p => {
  const logDate = dv.date(p.date);
  const now = dv.date("now");
  return logDate.month === now.month && logDate.year === now.year;
});

const stats = [
  {
    label: "Total Logs",
    value: logs.length,
    icon: "☕"
  },
  {
    label: "This Month",
    value: thisMonth.length,
    icon: "📅"
  },
  {
    label: "Avg Rating",
    value: logs.rating ? (logs.rating.reduce((a, b) => a + b, 0) / logs.length).toFixed(1) : "N/A",
    icon: "⭐"
  },
  {
    label: "Methods",
    value: new Set(logs.map(p => p["brew-method"])).size,
    icon: "⚙️"
  }
];

dv.container.innerHTML = `
  <div class="mobile-stat-grid">
    ${stats.map(stat => `
      <div class="mobile-stat-card">
        <div style="font-size: 24px; margin-bottom: 8px;">${stat.icon}</div>
        <div class="mobile-stat-value">${stat.value}</div>
        <div class="mobile-stat-label">${stat.label}</div>
      </div>
    `).join('')}
  </div>
`;
```

---

<div class="mobile-collapsible">
<div class="mobile-collapsible-header" onclick="this.parentElement.classList.toggle('expanded')">
<span class="mobile-collapsible-title">⭐ Recent Favorites (4+ Stars)</span>
<span class="mobile-collapsible-icon">▼</span>
</div>
<div class="mobile-collapsible-content">

```dataviewjs
// Show as mobile cards
const recentFavorites = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.rating >= 4)
  .sort(p => p.date, 'desc')
  .limit(5);

if (recentFavorites.length === 0) {
  dv.container.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 20px;">No high-rated logs yet</div>';
} else {
  const renderer = new window.MobileCoffeeComponents.MobileCardRenderer();
  const logs = recentFavorites.map(p => ({
    beans: p.beans,
    rating: p.rating,
    date: p.date,
    'brew-method': p['brew-method'],
    origin: p.origin,
    'flavor-notes': p['flavor-notes'] || [],
    roaster: p.roaster,
    'grind-size': p['grind-size'],
    'water-temp': p['water-temp'],
    'brew-time': p['brew-time'],
    ratio: p.ratio
  }));
  dv.container.innerHTML = renderer.renderCollection(logs);
}
```

</div>
</div>

---

<div class="mobile-collapsible">
<div class="mobile-collapsible-header" onclick="this.parentElement.classList.toggle('expanded')">
<span class="mobile-collapsible-title">🫘 Active Beans</span>
<span class="mobile-collapsible-icon">▼</span>
</div>
<div class="mobile-collapsible-content">

```dataviewjs
// Show active beans as cards
const activeBeans = dv.pages('"Beans Library"')
  .where(p => p.type === "bean-profile" && p.status === "active")
  .sort(p => p['purchase-date'], 'desc');

if (activeBeans.length === 0) {
  dv.container.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 20px;">No active beans</div>';
} else {
  const renderer = new window.MobileCoffeeComponents.BeanCardRenderer();
  const beans = activeBeans.map(p => ({
    'bean-name': p['bean-name'],
    roaster: p.roaster,
    origin: p.origin,
    'roast-level': p['roast-level'],
    'roast-date': p['roast-date'],
    price: p.price,
    weight: p.weight,
    status: p.status,
    'flavor-profile': p['flavor-profile'] || []
  }));
  dv.container.innerHTML = renderer.renderCollection(beans);
}
```

</div>
</div>

---

<div class="mobile-collapsible">
<div class="mobile-collapsible-header" onclick="this.parentElement.classList.toggle('expanded')">
<span class="mobile-collapsible-title">📈 Brewing Methods</span>
<span class="mobile-collapsible-icon">▼</span>
</div>
<div class="mobile-collapsible-content">

```dataviewjs
// Method usage statistics
const logs = dv.pages('"Coffee Logs"').where(p => p.type === "coffee-log");
const methodCounts = {};

logs.forEach(log => {
  const method = log['brew-method'];
  if (method) {
    methodCounts[method] = (methodCounts[method] || 0) + 1;
  }
});

const sortedMethods = Object.entries(methodCounts)
  .sort((a, b) => b[1] - a[1])
  .map(([method, count]) => ({
    title: method.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    subtitle: `${count} ${count === 1 ? 'log' : 'logs'}`,
    icon: '☕'
  }));

const renderer = new window.MobileCoffeeComponents.MobileListRenderer();
dv.container.innerHTML = renderer.renderList(sortedMethods, {
  actionIcon: count
});
```

</div>
</div>

---

<div class="mobile-collapsible">
<div class="mobile-collapsible-header" onclick="this.parentElement.classList.toggle('expanded')">
<span class="mobile-collapsible-title">🌍 Origins Explored</span>
<span class="mobile-collapsible-icon">▼</span>
</div>
<div class="mobile-collapsible-content">

```dataviewjs
// Origin statistics
const logs = dv.pages('"Coffee Logs"').where(p => p.type === "coffee-log" && p.origin);
const originStats = {};

logs.forEach(log => {
  const origin = log.origin;
  if (!originStats[origin]) {
    originStats[origin] = {
      count: 0,
      totalRating: 0,
      ratings: []
    };
  }
  originStats[origin].count++;
  if (log.rating) {
    originStats[origin].totalRating += log.rating;
    originStats[origin].ratings.push(log.rating);
  }
});

const sortedOrigins = Object.entries(originStats)
  .sort((a, b) => b[1].count - a[1].count)
  .map(([origin, stats]) => {
    const avgRating = stats.ratings.length > 0
      ? (stats.totalRating / stats.ratings.length).toFixed(1)
      : 'N/A';
    return {
      title: origin,
      subtitle: `${stats.count} logs • Avg: ${avgRating} ⭐`,
      icon: '🌍'
    };
  });

const renderer = new window.MobileCoffeeComponents.MobileListRenderer();
dv.container.innerHTML = renderer.renderList(sortedOrigins);
```

</div>
</div>

---

<div class="mobile-collapsible">
<div class="mobile-collapsible-header" onclick="this.parentElement.classList.toggle('expanded')">
<span class="mobile-collapsible-title">📅 This Week</span>
<span class="mobile-collapsible-icon">▼</span>
</div>
<div class="mobile-collapsible-content">

```dataviewjs
// This week's logs
const now = dv.date("now");
const weekAgo = now.minus({ days: 7 });

const thisWeek = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && dv.date(p.date) >= weekAgo)
  .sort(p => p.date, 'desc');

if (thisWeek.length === 0) {
  dv.container.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 20px;">No logs this week</div>';
} else {
  const renderer = new window.MobileCoffeeComponents.MobileCardRenderer();
  const logs = thisWeek.map(p => ({
    beans: p.beans,
    rating: p.rating,
    date: p.date,
    'brew-method': p['brew-method'],
    origin: p.origin,
    'flavor-notes': p['flavor-notes'] || [],
    roaster: p.roaster
  }));
  dv.container.innerHTML = renderer.renderCollection(logs);
}
```

</div>
</div>

---

<div class="mobile-collapsible">
<div class="mobile-collapsible-header" onclick="this.parentElement.classList.toggle('expanded')">
<span class="mobile-collapsible-title">🎯 Quick Actions</span>
<span class="mobile-collapsible-icon">▼</span>
</div>
<div class="mobile-collapsible-content">

<div class="mobile-action-row">
  <button class="mobile-action-button primary" onclick="window.location.href='obsidian://new?vault=Coffee%20Vault&file=Templates/Mobile%20Quick%20Capture'">
    ☕ Quick Log
  </button>
</div>

<div class="mobile-action-row" style="margin-top: 12px;">
  <button class="mobile-action-button secondary" onclick="window.location.href='obsidian://open?vault=Coffee%20Vault&file=Coffee%20Logs'">
    📁 All Logs
  </button>
  <button class="mobile-action-button secondary" onclick="window.location.href='obsidian://open?vault=Coffee%20Vault&file=Beans%20Library'">
    🫘 Beans
  </button>
</div>

</div>
</div>

---

## 💡 Mobile Tips

- **Pull down** to refresh dashboard data
- **Tap sections** to expand/collapse
- **Long press** cards for more options
- **Swipe left** on cards to archive
- **Swipe right** on cards to share

---

## 🔗 Quick Links

- [[Mobile Quick Capture|📱 Quick Log]]
- [[Coffee Log|📚 All Logs]]
- [[Beans Library/|🫘 Bean Library]]
- [[Mobile-Guide|📖 Mobile Guide]]

---

<style>
/* Mobile dashboard specific styles */
.mobile-collapsible {
  border: 1px solid var(--border-light);
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
  background: var(--bg-secondary);
}

.mobile-collapsible-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  user-select: none;
  background: var(--bg-secondary);
  min-height: 56px;
}

.mobile-collapsible-header:active {
  background: var(--bg-tertiary);
}

.mobile-collapsible-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.mobile-collapsible-icon {
  font-size: 20px;
  transition: transform 0.3s;
  color: var(--text-muted);
}

.mobile-collapsible.expanded .mobile-collapsible-icon {
  transform: rotate(180deg);
}

.mobile-collapsible-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.mobile-collapsible.expanded .mobile-collapsible-content {
  max-height: 2000px;
  padding: 16px;
  border-top: 1px solid var(--border-light);
}
</style>

<script>
// Initialize mobile components when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Auto-collapse all sections on mobile initially
  if (window.innerWidth <= 767) {
    document.querySelectorAll('.mobile-collapsible').forEach(section => {
      section.classList.remove('expanded');
    });
  }

  // Load mobile components if available
  if (window.MobileCoffeeComponents) {
    console.log('Mobile components loaded');
  }
});
</script>
