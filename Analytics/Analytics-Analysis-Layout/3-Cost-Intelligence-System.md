---
title: Cost Intelligence System
type: analytics-dashboard
category: financial-analysis
created: 2025-10-26
tags: [analytics, cost, roi, budget, financial]
---

# Cost Intelligence System

> ROI analysis, budget tracking, and cost-per-cup optimization with ML insights

## Current Month Financial Overview

```dataviewjs
const currentMonth = dv.date("now").toFormat("yyyy-MM");
const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.date && p.date.toFormat("yyyy-MM") === currentMonth)
  .array();

// Default cost assumptions (user can customize in Coffee Logs)
const estimatedCostPerBrew = 2.50; // Average cost per brew
const totalBrews = logs.length;
const estimatedMonthlySpend = totalBrews * estimatedCostPerBrew;

dv.header(3, "💰 Monthly Spending Analysis");
dv.paragraph(`
**Total Brews**: ${totalBrews} cups
**Estimated Monthly Spend**: $${estimatedMonthlySpend.toFixed(2)}
**Average Cost per Cup**: $${estimatedCostPerBrew.toFixed(2)}
**Days This Month**: ${new Date().getDate()}
**Daily Average**: ${(totalBrews / new Date().getDate()).toFixed(1)} cups/day
`);

if (totalBrews > 0) {
  const avgRating = Math.round(
    logs.reduce((sum, p) => sum + (p.rating || 0), 0) / logs.length * 10
  ) / 10;

  const valueScore = (avgRating / 5.0) / estimatedCostPerBrew;

  dv.paragraph(`
**Quality Score**: ${avgRating}/5.0 ⭐
**Value Ratio**: ${valueScore.toFixed(3)} (quality per dollar)
**ROI Status**: ${valueScore > 0.8 ? "🏆 Excellent Value" : valueScore > 0.5 ? "✅ Good Value" : "💡 Room for Optimization"}
  `);
}
```

## Cost-per-Quality Analysis

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.date)
  .array();

if (allLogs.length > 0) {
  const estimatedCostPerBrew = 2.50;

  // Group by rating tiers
  const qualityTiers = {
    "Exceptional (4.5-5.0)": allLogs.filter(p => p.rating >= 4.5),
    "Excellent (4.0-4.4)": allLogs.filter(p => p.rating >= 4.0 && p.rating < 4.5),
    "Good (3.5-3.9)": allLogs.filter(p => p.rating >= 3.5 && p.rating < 4.0),
    "Fair (3.0-3.4)": allLogs.filter(p => p.rating >= 3.0 && p.rating < 3.5),
    "Below Average (<3.0)": allLogs.filter(p => p.rating < 3.0)
  };

  dv.header(3, "📊 Quality Tier Investment");
  dv.table(
    ["Quality Tier", "Brews", "Total Cost", "Avg Rating", "Value Score"],
    Object.entries(qualityTiers).map(([tier, brews]) => {
      if (brews.length === 0) return [tier, 0, "$0.00", "N/A", "N/A"];
      const totalCost = brews.length * estimatedCostPerBrew;
      const avgRating = brews.reduce((sum, p) => sum + (p.rating || 0), 0) / brews.length;
      const valueScore = avgRating / estimatedCostPerBrew;
      return [
        tier,
        brews.length,
        `$${totalCost.toFixed(2)}`,
        avgRating.toFixed(2),
        valueScore.toFixed(3)
      ];
    })
  );

  const totalSpent = allLogs.length * estimatedCostPerBrew;
  const qualityBrews = allLogs.filter(p => p.rating >= 4.0).length;
  const wastedSpend = (allLogs.length - qualityBrews) * estimatedCostPerBrew;

  dv.paragraph(`
**Total Investment**: $${totalSpent.toFixed(2)}
**Quality Brews (4.0+)**: ${qualityBrews} (${Math.round((qualityBrews / allLogs.length) * 100)}%)
**Potential Waste**: $${wastedSpend.toFixed(2)} on sub-4.0 brews
**Optimization Opportunity**: ${wastedSpend > 50 ? "🔴 High" : wastedSpend > 20 ? "🟡 Moderate" : "🟢 Low"}
  `);
}
```

## Bean ROI Rankings

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.beans)
  .array();

if (allLogs.length > 0) {
  const estimatedBeanCost = {
    // Default costs - can be customized per bean
    default: 18.00 // per 12oz bag
  };

  const beansPerBrew = 18; // grams average
  const gramsPerBag = 340; // 12oz
  const costPerBrew = (estimatedBeanCost.default / gramsPerBag) * beansPerBrew;

  // Group by bean
  const beanStats = {};

  allLogs.forEach(log => {
    const bean = log.beans || "Unknown";
    if (!beanStats[bean]) {
      beanStats[bean] = {
        brews: 0,
        totalRating: 0,
        ratings: []
      };
    }
    beanStats[bean].brews++;
    beanStats[bean].totalRating += log.rating || 0;
    beanStats[bean].ratings.push(log.rating || 0);
  });

  const beanAnalysis = Object.entries(beanStats)
    .map(([bean, stats]) => {
      const avgRating = stats.totalRating / stats.brews;
      const totalCost = stats.brews * costPerBrew;
      const roi = avgRating / costPerBrew; // Quality per dollar

      // Consistency score
      const variance = stats.ratings.reduce((sum, r) => {
        const diff = r - avgRating;
        return sum + (diff * diff);
      }, 0) / stats.brews;
      const consistency = Math.max(0, 1 - variance) * 100;

      return {
        bean,
        brews: stats.brews,
        avgRating: Math.round(avgRating * 10) / 10,
        totalCost: totalCost.toFixed(2),
        roi: roi.toFixed(2),
        consistency: Math.round(consistency)
      };
    })
    .sort((a, b) => b.roi - a.roi)
    .slice(0, 15);

  dv.header(3, "☕ Bean ROI Rankings");
  dv.table(
    ["Bean", "Brews", "Avg Rating", "Total Cost", "ROI Score", "Consistency"],
    beanAnalysis.map(b => [
      b.bean,
      b.brews,
      `${b.avgRating} ⭐`,
      `$${b.totalCost}`,
      b.roi,
      `${b.consistency}%`
    ])
  );

  dv.paragraph(`
**ROI Score**: Quality rating divided by cost per brew
**Best Value**: Highest ROI indicates best quality-to-cost ratio
**💡 Tip**: Focus on high ROI + high consistency beans for best results
  `);
}
```

## Monthly Budget Tracking

```dataviewjs
const months = [];
const currentDate = dv.date("now");

// Get last 6 months
for (let i = 0; i < 6; i++) {
  const monthDate = currentDate.minus({ months: i });
  months.push(monthDate.toFormat("yyyy-MM"));
}

months.reverse();

const estimatedCostPerBrew = 2.50;
const monthlyData = [];

months.forEach(month => {
  const logs = dv.pages('"Coffee Logs"')
    .where(p => p.type === "coffee-log" && p.date && p.date.toFormat("yyyy-MM") === month)
    .array();

  const brews = logs.length;
  const cost = brews * estimatedCostPerBrew;
  const avgRating = logs.length > 0
    ? logs.reduce((sum, p) => sum + (p.rating || 0), 0) / logs.length
    : 0;

  monthlyData.push({
    month,
    brews,
    cost: cost.toFixed(2),
    avgRating: avgRating.toFixed(2),
    qualityBrews: logs.filter(p => p.rating >= 4.0).length
  });
});

dv.header(3, "📈 6-Month Spending Trend");
dv.table(
  ["Month", "Brews", "Estimated Cost", "Avg Rating", "Quality Brews (4.0+)", "Efficiency"],
  monthlyData.map(m => {
    const efficiency = m.brews > 0 ? Math.round((m.qualityBrews / m.brews) * 100) : 0;
    return [
      m.month,
      m.brews,
      `$${m.cost}`,
      m.avgRating,
      m.qualityBrews,
      `${efficiency}%`
    ];
  })
);

// Calculate total
const totalBrews = monthlyData.reduce((sum, m) => sum + m.brews, 0);
const totalCost = monthlyData.reduce((sum, m) => sum + parseFloat(m.cost), 0);

dv.paragraph(`
**6-Month Total**: ${totalBrews} brews / $${totalCost.toFixed(2)}
**Monthly Average**: ${Math.round(totalBrews / 6)} brews / $${(totalCost / 6).toFixed(2)}
  `);
```

## Cost Optimization Recommendations

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .array();

dv.header(3, "💡 ML-Powered Cost Optimization");

if (allLogs.length < 10) {
  dv.paragraph("📊 Need at least 10 brews to generate cost optimization insights.");
} else {
  const recommendations = [];
  const estimatedCostPerBrew = 2.50;

  // Analyze quality distribution
  const qualityBrews = allLogs.filter(p => p.rating >= 4.0).length;
  const qualityRate = qualityBrews / allLogs.length;

  if (qualityRate < 0.5) {
    const wastedCost = (allLogs.length - qualityBrews) * estimatedCostPerBrew;
    recommendations.push(`💸 **High Waste Alert**: Only ${Math.round(qualityRate * 100)}% of brews are quality (4.0+). You've spent ~$${wastedCost.toFixed(2)} on subpar brews. Focus on optimization.`);
  } else if (qualityRate > 0.7) {
    recommendations.push(`🏆 **Excellent Efficiency**: ${Math.round(qualityRate * 100)}% of brews are high quality. Your investment is well-optimized!`);
  }

  // Method cost-effectiveness
  const methodStats = {};
  allLogs.forEach(log => {
    const method = log["brew-method"] || "Unknown";
    if (!methodStats[method]) {
      methodStats[method] = { brews: 0, totalRating: 0 };
    }
    methodStats[method].brews++;
    methodStats[method].totalRating += log.rating || 0;
  });

  const methodROI = Object.entries(methodStats)
    .map(([method, stats]) => ({
      method,
      roi: (stats.totalRating / stats.brews) / estimatedCostPerBrew
    }))
    .sort((a, b) => b.roi - a.roi);

  if (methodROI.length > 0) {
    recommendations.push(`🎯 **Best Value Method**: ${methodROI[0].method} offers the best quality-to-cost ratio (ROI: ${methodROI[0].roi.toFixed(2)}).`);
  }

  // Identify expensive low-performers
  const poorPerformers = allLogs.filter(p => p.rating < 3.5).length;
  if (poorPerformers > 5) {
    const wastedOnPoor = poorPerformers * estimatedCostPerBrew;
    recommendations.push(`⚠️ **Eliminate Low Performers**: ${poorPerformers} brews rated below 3.5 cost you $${wastedOnPoor.toFixed(2)}. Review and avoid those parameters.`);
  }

  // Budget projection
  const currentMonthBrews = dv.pages('"Coffee Logs"')
    .where(p => p.type === "coffee-log" && p.date && p.date.toFormat("yyyy-MM") === dv.date("now").toFormat("yyyy-MM"))
    .array().length;

  const dailyAverage = currentMonthBrews / new Date().getDate();
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const projectedMonthlyBrews = Math.round(dailyAverage * daysInMonth);
  const projectedCost = projectedMonthlyBrews * estimatedCostPerBrew;

  recommendations.push(`📊 **Monthly Projection**: Based on current pace (${dailyAverage.toFixed(1)} cups/day), you'll spend ~$${projectedCost.toFixed(2)} this month.`);

  if (recommendations.length === 0) {
    recommendations.push("✅ All cost metrics are optimal!");
  }

  recommendations.forEach(rec => dv.paragraph(rec));
}
```

## Cost vs Quality Scatter Analysis

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.beans)
  .array();

if (allLogs.length >= 10) {
  // Group by bean and calculate stats
  const beanStats = {};

  allLogs.forEach(log => {
    const bean = log.beans || "Unknown";
    if (!beanStats[bean]) {
      beanStats[bean] = { count: 0, totalRating: 0 };
    }
    beanStats[bean].count++;
    beanStats[bean].totalRating += log.rating || 0;
  });

  const estimatedBagCost = 18.00;
  const beansPerBrew = 18;
  const gramsPerBag = 340;
  const costPerBrew = (estimatedBagCost / gramsPerBag) * beansPerBrew;

  // Identify sweet spot
  const sweetSpotBeans = Object.entries(beanStats)
    .filter(([_, stats]) => {
      const avgRating = stats.totalRating / stats.count;
      return avgRating >= 4.2 && stats.count >= 3;
    })
    .map(([bean, stats]) => ({
      bean,
      avgRating: Math.round((stats.totalRating / stats.count) * 10) / 10,
      brews: stats.count
    }))
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 5);

  if (sweetSpotBeans.length > 0) {
    dv.header(3, "🎯 Quality Sweet Spot (4.2+ rating, 3+ brews)");
    dv.table(
      ["Bean", "Avg Rating", "Brews", "Est. Cost/Brew"],
      sweetSpotBeans.map(b => [
        b.bean,
        `${b.avgRating} ⭐`,
        b.brews,
        `$${costPerBrew.toFixed(2)}`
      ])
    );

    dv.paragraph("💰 **Value Recommendation**: These beans offer the best quality-to-cost ratio. Prioritize them for consistent, cost-effective results.");
  }
}
```

## Annual Spending Projection

```dataviewjs
const allLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.date)
  .array();

if (allLogs.length >= 30) {
  const estimatedCostPerBrew = 2.50;

  // Calculate daily average
  const sortedLogs = allLogs.sort((a, b) => a.date - b.date);
  const firstDate = sortedLogs[0].date;
  const lastDate = sortedLogs[sortedLogs.length - 1].date;
  const daysDiff = Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24)) || 1;

  const dailyAverage = allLogs.length / daysDiff;
  const annualProjection = dailyAverage * 365;
  const annualCost = annualProjection * estimatedCostPerBrew;

  // Compare to cafe costs
  const cafeCostPerCup = 5.00;
  const cafeCost = annualProjection * cafeCostPerCup;
  const savings = cafeCost - annualCost;

  dv.header(3, "📅 Annual Projection");
  dv.paragraph(`
**Daily Average**: ${dailyAverage.toFixed(2)} cups
**Projected Annual Brews**: ${Math.round(annualProjection)} cups
**Projected Annual Cost**: $${annualCost.toFixed(2)}

**Comparison to Cafe Prices**:
- Cafe cost: $${cafeCost.toFixed(2)} (@ $${cafeCostPerCup}/cup)
- Home brewing: $${annualCost.toFixed(2)}
- **Annual Savings**: $${savings.toFixed(2)} 💰

🎉 You save ${Math.round((savings / cafeCost) * 100)}% by brewing at home!
  `);

  // Break even analysis
  const equipmentCost = 300; // Estimated total equipment investment
  const monthsToBreakEven = equipmentCost / ((savings / 12));

  if (monthsToBreakEven < 24) {
    dv.paragraph(`
**Break-Even Analysis**:
Assuming $${equipmentCost} equipment investment, you'll break even in ~${Math.round(monthsToBreakEven)} months!
    `);
  }
}
```

## Budget Alerts & Goals

```dataviewjs
const currentMonth = dv.date("now").toFormat("yyyy-MM");
const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.date && p.date.toFormat("yyyy-MM") === currentMonth)
  .array();

const estimatedCostPerBrew = 2.50;
const monthlyBudget = 100.00; // Default budget - customize as needed
const currentSpend = logs.length * estimatedCostPerBrew;
const remaining = monthlyBudget - currentSpend;
const percentUsed = (currentSpend / monthlyBudget) * 100;

dv.header(3, "🎯 Budget Goals");
dv.paragraph(`
**Monthly Budget**: $${monthlyBudget.toFixed(2)}
**Current Spend**: $${currentSpend.toFixed(2)}
**Remaining**: $${remaining.toFixed(2)}
**Budget Used**: ${Math.round(percentUsed)}%
`);

const progressBar = "█".repeat(Math.floor(percentUsed / 5)) + "░".repeat(20 - Math.floor(percentUsed / 5));
dv.paragraph(`[${progressBar}] ${Math.round(percentUsed)}%`);

const daysLeft = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate();
const breweriesLeft = Math.floor(remaining / estimatedCostPerBrew);

if (percentUsed > 90) {
  dv.paragraph("⚠️ **Budget Alert**: You've used over 90% of your monthly budget!");
} else if (percentUsed > 75) {
  dv.paragraph("⚡ **Budget Warning**: Approaching budget limit. Monitor spending.");
} else {
  dv.paragraph(`✅ **On Track**: You can brew ~${breweriesLeft} more cups this month within budget.`);
}
```

---

## Related Dashboards

- [[1-Monthly-Analytics-Dashboard|Monthly Analytics]]
- [[2-Brewing-Optimization-Engine|Brewing Optimizer]]
- [[4-Palate-Development-Tracker|Palate Development]]
- [[Coffee Dashboard|Main Dashboard]]

---

*Cost estimates are configurable in individual Coffee Logs*
*Last Updated: `= date(today)`*
