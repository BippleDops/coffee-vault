---
type: dashboard
category: inventory
auto-update: true
created: 2025-10-27
---

# 🫘 Bean Inventory Status - Live

**Real-time bean inventory tracking and alerts**

---

## Current Inventory

```dataviewjs
// Get all bean profiles
const beans = dv.pages('"Beans Library"')
  .where(p => p.type === "bean-profile")
  .array();

// Get all coffee logs
const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .array();

if (beans.length === 0) {
  dv.paragraph("⚠️ No bean profiles found. Create bean profiles in the Beans Library folder.");
} else {
  const inventory = [];

  for (const bean of beans) {
    const beanName = bean["bean-name"] || bean.file.name.replace(/\.md$/, '').replace(/-/g, ' ');
    const weight = bean.weight || 250; // Default 250g
    const roastDate = bean["roast-date"] ? new Date(bean["roast-date"]) : null;
    const price = parseFloat(bean.price) || 0;

    // Find logs using this bean
    const beanLogs = logs.filter(l => {
      const logBean = l.beans;
      return logBean && (
        logBean.toLowerCase().includes(beanName.toLowerCase()) ||
        beanName.toLowerCase().includes(logBean.toLowerCase())
      );
    });

    // Calculate usage
    const totalDose = beanLogs.reduce((sum, l) => sum + (l.dose || 18), 0);
    const remaining = weight - totalDose;
    const percentRemaining = (remaining / weight) * 100;
    const avgRating = beanLogs.length > 0
      ? beanLogs.reduce((sum, l) => sum + (l.rating || 0), 0) / beanLogs.length
      : 0;

    // Calculate age
    const daysOld = roastDate
      ? Math.floor((new Date() - roastDate) / (1000 * 60 * 60 * 24))
      : null;

    // Determine status
    let status = "✅ Active";
    if (remaining <= 0) {
      status = "🚫 Finished";
    } else if (remaining < 50) {
      status = "⚠️ Low";
    } else if (daysOld && daysOld > 35) {
      status = "⏰ Stale";
    } else if (daysOld && daysOld > 21) {
      status = "📉 Aging";
    }

    inventory.push({
      bean: beanName,
      remaining: remaining.toFixed(0),
      percent: percentRemaining.toFixed(0),
      sessions: beanLogs.length,
      avgRating: avgRating.toFixed(1),
      daysOld: daysOld || "N/A",
      status: status,
      price: price.toFixed(2),
      wouldRebuy: avgRating >= 4.0 && beanLogs.length >= 3
    });
  }

  // Sort by remaining percentage (low to high for alerts)
  inventory.sort((a, b) => parseFloat(a.percent) - parseFloat(b.percent));

  dv.header(3, "📦 All Beans");
  dv.table(
    ["Bean", "Remaining", "%", "Sessions", "Avg Rating", "Days Old", "Status"],
    inventory.map(i => [
      i.bean,
      `${i.remaining}g`,
      `${i.percent}%`,
      i.sessions,
      `${i.avgRating}/5.0`,
      i.daysOld,
      i.status
    ])
  );

  // Alerts
  const lowStock = inventory.filter(i => parseFloat(i.remaining) > 0 && parseFloat(i.remaining) < 50);
  const stale = inventory.filter(i => i.status.includes("Stale"));
  const reorderCandidates = inventory.filter(i => i.wouldRebuy && parseFloat(i.remaining) < 100);

  if (lowStock.length > 0) {
    dv.header(3, "⚠️ Low Stock Alert");
    dv.paragraph(`**${lowStock.length} bean(s)** running low:`);
    lowStock.forEach(i => {
      dv.paragraph(`- **${i.bean}**: ${i.remaining}g remaining (${i.percent}%)`);
    });
  }

  if (stale.length > 0) {
    dv.header(3, "⏰ Aging/Stale Beans");
    dv.paragraph(`**${stale.length} bean(s)** past prime:`);
    stale.forEach(i => {
      dv.paragraph(`- **${i.bean}**: ${i.daysOld} days old`);
    });
  }

  if (reorderCandidates.length > 0) {
    dv.header(3, "🔄 Reorder Suggestions");
    dv.paragraph("Based on high ratings (4.0+) and low stock:");
    reorderCandidates.forEach(i => {
      dv.paragraph(`- **${i.bean}** - Avg: ${i.avgRating}/5.0, Remaining: ${i.remaining}g, $${i.price}`);
    });
  }
}
```

---

## Cost Summary

```dataviewjs
const beans = dv.pages('"Beans Library"')
  .where(p => p.type === "bean-profile")
  .array();

const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .array();

if (beans.length > 0 && logs.length > 0) {
  let totalSpent = 0;
  let totalDoseUsed = 0;

  beans.forEach(bean => {
    const price = parseFloat(bean.price) || 0;
    totalSpent += price;
  });

  logs.forEach(log => {
    totalDoseUsed += log.dose || 18;
  });

  const avgCostPerGram = totalSpent / totalDoseUsed;
  const avgCostPerSession = avgCostPerGram * 18; // Assuming 18g average

  dv.paragraph(`
**💰 Financial Overview**
- **Total Spent on Beans**: $${totalSpent.toFixed(2)}
- **Total Coffee Brewed**: ${totalDoseUsed.toFixed(0)}g
- **Avg Cost per Gram**: $${avgCostPerGram.toFixed(3)}
- **Avg Cost per Session**: $${avgCostPerSession.toFixed(2)}
- **Total Sessions**: ${logs.length}
  `);
}
```

---

## Shopping List

```dataviewjs
const beans = dv.pages('"Beans Library"')
  .where(p => p.type === "bean-profile")
  .array();

const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .array();

const shoppingList = [];

beans.forEach(bean => {
  const beanName = bean["bean-name"] || bean.file.name.replace(/\.md$/, '').replace(/-/g, ' ');
  const weight = bean.weight || 250;
  const roaster = bean.roaster || "Unknown";
  const price = parseFloat(bean.price) || 0;

  const beanLogs = logs.filter(l => {
    const logBean = l.beans;
    return logBean && (
      logBean.toLowerCase().includes(beanName.toLowerCase()) ||
      beanName.toLowerCase().includes(logBean.toLowerCase())
    );
  });

  const totalDose = beanLogs.reduce((sum, l) => sum + (l.dose || 18), 0);
  const remaining = weight - totalDose;
  const avgRating = beanLogs.length > 0
    ? beanLogs.reduce((sum, l) => sum + (l.rating || 0), 0) / beanLogs.length
    : 0;

  // Add to shopping list if: low stock AND high rating OR completely finished with high rating
  if ((remaining < 50 && remaining > 0 && avgRating >= 4.0) ||
      (remaining <= 0 && avgRating >= 4.5 && beanLogs.length >= 3)) {
    shoppingList.push({
      bean: beanName,
      roaster: roaster,
      price: `$${price.toFixed(2)}`,
      rating: avgRating.toFixed(1),
      reason: remaining <= 0 ? "Finished - Excellent" : "Low Stock - Good"
    });
  }
});

if (shoppingList.length > 0) {
  dv.table(
    ["Bean", "Roaster", "Price", "Your Rating", "Reason"],
    shoppingList.map(i => [i.bean, i.roaster, i.price, `${i.rating}/5.0`, i.reason])
  );
} else {
  dv.paragraph("✅ No beans need reordering at this time.");
}
```

---

**Auto-updates when you reopen this note**
*Part of Coffee Vault 4.0 Inventory Management*
