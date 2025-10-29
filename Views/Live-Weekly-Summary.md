---
type: dashboard
category: analytics
auto-update: true
created: 2025-10-27
---

# 📊 Weekly Summary - Live Dashboard

**Auto-generated weekly brewing summary**

---

## Current Week Statistics

```dataviewjs
const stats = await dv.app.vault.adapter.read('Scripts/stats-utils.js')
  .then(code => {
    const module = { exports: {} };
    eval(code);
    return module.exports;
  });

// Get current week dates
const now = new Date();
const dayOfWeek = now.getDay();
const weekStart = new Date(now);
weekStart.setDate(now.getDate() - dayOfWeek);
weekStart.setHours(0, 0, 0, 0);

const weekEnd = new Date(weekStart);
weekEnd.setDate(weekStart.getDate() + 6);
weekEnd.setHours(23, 59, 59, 999);

// Format dates
const formatDate = (d) => d.toISOString().split('T')[0];

// Query coffee logs for this week
const logs = dv.pages('"Coffee Logs"')
  .where(p =>
    p.type === "coffee-log" &&
    p.date >= formatDate(weekStart) &&
    p.date <= formatDate(weekEnd)
  )
  .array();

dv.header(3, `Week of ${formatDate(weekStart)} to ${formatDate(weekEnd)}`);

if (logs.length === 0) {
  dv.paragraph("⚠️ No coffee logs found for this week. Start brewing!");
} else {
  // Extract data
  const ratings = logs.map(l => l.rating).filter(r => r != null);
  const doses = logs.map(l => l.dose).filter(d => d != null);
  const methods = logs.map(l => l["brew-method"]).filter(m => m);
  const beans = logs.map(l => l.beans).filter(b => b);

  // Calculate statistics
  const totalSessions = logs.length;
  const avgRating = ratings.length > 0 ? stats.mean(ratings) : 0;
  const totalDose = doses.reduce((sum, d) => sum + d, 0);
  const avgDose = doses.length > 0 ? stats.mean(doses) : 0;

  // Method breakdown
  const methodCounts = stats.frequencyDistribution(methods);
  const topMethod = methodCounts.length > 0 ? methodCounts[0] : { value: "N/A", count: 0 };

  // Bean breakdown
  const beanCounts = stats.frequencyDistribution(beans);
  const topBean = beanCounts.length > 0 ? beanCounts[0] : { value: "N/A", count: 0 };

  // Display metrics
  dv.paragraph(`
**📈 Overview**
- **Total Sessions**: ${totalSessions}
- **Average Rating**: ${avgRating.toFixed(2)}/5.0
- **Total Coffee Used**: ${totalDose.toFixed(1)}g
- **Average Dose**: ${avgDose.toFixed(1)}g per session

**☕ Most Used**
- **Method**: ${topMethod.value} (${topMethod.count} times)
- **Bean**: ${topBean.value} (${beanCounts[0]?.count || 0} times)
  `);

  // Ratings distribution
  dv.header(3, "📊 Rating Distribution");
  const ratingDist = {
    "5.0 ⭐⭐⭐⭐⭐": ratings.filter(r => r >= 4.5).length,
    "4.0-4.5 ⭐⭐⭐⭐": ratings.filter(r => r >= 4.0 && r < 4.5).length,
    "3.0-4.0 ⭐⭐⭐": ratings.filter(r => r >= 3.0 && r < 4.0).length,
    "< 3.0 ⭐⭐": ratings.filter(r => r < 3.0).length
  };

  for (const [range, count] of Object.entries(ratingDist)) {
    if (count > 0) {
      dv.paragraph(`${range}: ${"█".repeat(count)} (${count})`);
    }
  }

  // Top sessions
  dv.header(3, "🏆 Top Sessions This Week");
  const topLogs = logs
    .filter(l => l.rating != null)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3);

  dv.table(["Date", "Bean", "Method", "Rating"],
    topLogs.map(l => [
      l.date,
      l.beans || "Unknown",
      l["brew-method"] || "Unknown",
      `${l.rating}/5.0`
    ])
  );

  // Recommendations
  dv.header(3, "💡 Recommendations");
  if (avgRating >= 4.5) {
    dv.paragraph("🎉 **Excellent week!** You're brewing consistently high-quality coffee.");
  } else if (avgRating >= 4.0) {
    dv.paragraph("✅ **Good week!** Consider experimenting with parameters to reach 4.5+");
  } else if (avgRating >= 3.0) {
    dv.paragraph("⚠️ **Room for improvement.** Review your best sessions and replicate those parameters.");
  } else {
    dv.paragraph("🔧 **Time to troubleshoot.** Check grind size, water temperature, and freshness.");
  }

  if (totalSessions < 5) {
    dv.paragraph("📅 **Goal**: Try to log at least 5 sessions per week for better insights.");
  }
}
```

---

## Method Breakdown

```dataviewjs
const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .array();

if (logs.length > 0) {
  const methods = logs.map(l => l["brew-method"]).filter(m => m);
  const methodStats = {};

  methods.forEach(method => {
    if (!methodStats[method]) {
      methodStats[method] = { count: 0, ratings: [] };
    }
    methodStats[method].count++;
  });

  logs.forEach(l => {
    const method = l["brew-method"];
    if (method && l.rating != null) {
      if (!methodStats[method]) methodStats[method] = { count: 0, ratings: [] };
      methodStats[method].ratings.push(l.rating);
    }
  });

  const methodData = Object.entries(methodStats).map(([method, data]) => {
    const avgRating = data.ratings.length > 0
      ? (data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length).toFixed(2)
      : "N/A";
    return [method, data.count, avgRating];
  }).sort((a, b) => b[1] - a[1]);

  dv.table(["Method", "Total Uses", "Avg Rating"],
    methodData
  );
}
```

---

**Auto-refreshes when you reopen this note**
*Part of Coffee Vault 4.0 Analytics Suite*
