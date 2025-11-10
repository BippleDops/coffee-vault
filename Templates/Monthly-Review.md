---
type: monthly-report
year: <% tp.date.now("YYYY") %>
month: <% tp.date.now("MM") %>
month-name: <% tp.date.now("MMMM") %>
date: <% tp.date.now("YYYY-MM-DD") %>
tags: "[monthly-report, <%  tp.date.now("YYYY-MM")  %>]"
---

# 📅 Monthly Coffee Review - <% tp.date.now("MMMM YYYY") %>

**Monthly Report for <% tp.date.now("MMMM YYYY") %>**

---

## 📊 Month at a Glance

```dataviewjs
const month = dv.current().month.toString().padStart(2, '0');
const year = dv.current().year;
const monthStr = `${year}-${month}`;

const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.date && p.date.toFormat("yyyy-MM") === monthStr)
  .array();

const totalSessions = logs.length;
const avgRating = logs.length > 0 
  ? (logs.reduce((sum, p) => sum + (p.rating || 0), 0) / logs.length).toFixed(2)
  : 0;

const uniqueBeans = new Set(logs.map(p => p.beans).filter(Boolean)).size;
const uniqueMethods = new Set(logs.map(p => p["brew-method"]).filter(Boolean)).size;

dv.table(["Metric", "Value"],
  [
    ["Total Brewing Sessions", totalSessions],
    ["Average Rating", `${avgRating}⭐`],
    ["Unique Beans Tried", uniqueBeans],
    ["Methods Used", uniqueMethods],
    ["Days with Coffee", new Set(logs.map(p => p.date?.toFormat("yyyy-MM-DD"))).size]
  ]
);
```

---

## ⭐ Top Rated Brews

```dataviewjs
const month = dv.current().month.toString().padStart(2, '0');
const year = dv.current().year;
const monthStr = `${year}-${month}`;

const topBrews = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.date && p.date.toFormat("yyyy-MM") === monthStr)
  .sort(p => p.rating, 'desc')
  .limit(5);

dv.table(["Date", "Bean", "Method", "Rating"],
  topBrews.map(p => [p.date, p.beans, p["brew-method"], `${p.rating}⭐`])
);
```

---

## 🫘 Best Beans This Month

```dataviewjs
const month = dv.current().month.toString().padStart(2, '0');
const year = dv.current().year;
const monthStr = `${year}-${month}`;

const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.date && p.date.toFormat("yyyy-MM") === monthStr);

const beanStats = {};
logs.forEach(log => {
  const bean = log.beans;
  if (!beanStats[bean]) {
    beanStats[bean] = { total: 0, count: 0 };
  }
  beanStats[bean].total += log.rating || 0;
  beanStats[bean].count++;
});

const beanRankings = Object.entries(beanStats)
  .map(([bean, stats]) => ({
    bean: bean,
    avgRating: (stats.total / stats.count).toFixed(2),
    uses: stats.count
  }))
  .sort((a, b) => b.avgRating - a.avgRating)
  .slice(0, 5);

dv.table(["Bean", "Avg Rating", "Times Used"],
  beanRankings.map(b => [b.bean, `${b.avgRating}⭐`, b.uses])
);
```

---

## ☕ Brewing Method Performance

```dataviewjs
const month = dv.current().month.toString().padStart(2, '0');
const year = dv.current().year;
const monthStr = `${year}-${month}`;

const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.date && p.date.toFormat("yyyy-MM") === monthStr);

const methodStats = {};
logs.forEach(log => {
  const method = log["brew-method"];
  if (!methodStats[method]) {
    methodStats[method] = { total: 0, count: 0 };
  }
  methodStats[method].total += log.rating || 0;
  methodStats[method].count++;
});

const methodRankings = Object.entries(methodStats)
  .map(([method, stats]) => ({
    method: method,
    avgRating: (stats.total / stats.count).toFixed(2),
    uses: stats.count
  }))
  .sort((a, b) => b.uses - a.uses);

dv.table(["Method", "Uses", "Avg Rating"],
  methodRankings.map(m => [m.method, m.uses, `${m.avgRating}⭐`])
);
```

---

## 💰 Monthly Spending

**Beans Purchased This Month**:

```dataviewjs
const month = dv.current().month.toString().padStart(2, '0');
const year = dv.current().year;
const monthStr = `${year}-${month}`;

const beans = dv.pages('"Beans Library"')
  .where(p => 
    p.type === "bean-profile" && 
    p["purchase-date"] && 
    p["purchase-date"].toFormat("yyyy-MM") === monthStr
  );

const totalSpent = beans.array().reduce((sum, b) => sum + (b["purchase-price"] || 0), 0);
const avgPrice = beans.length > 0 ? (totalSpent / beans.length).toFixed(2) : 0;

dv.paragraph(`**Total Spent**: $${totalSpent.toFixed(2)}`);
dv.paragraph(`**Beans Purchased**: ${beans.length}`);
dv.paragraph(`**Average Price**: $${avgPrice}`);

if (beans.length > 0) {
  dv.table(["Bean", "Roaster", "Price"],
    beans.map(b => [b.file.link, b.roaster, `$${b["purchase-price"] || 0}`])
  );
}
```

---

## 🎯 Goal Progress

```dataviewjs
const goals = dv.pages('"Coffee Goals"')
  .where(p => p.type === "coffee-goal" && p.status != "completed");

if (goals.length > 0) {
  dv.table(["Goal", "Status", "Progress"],
    goals.map(g => [
      g.file.link,
      g.status,
      `${g["progress-percentage"] || 0}%`
    ])
  );
} else {
  dv.paragraph("*No active goals. Set a goal to track progress!*");
}
```

---

## 📈 Quality Trends

**Rating Distribution**:

```dataviewjs
const month = dv.current().month.toString().padStart(2, '0');
const year = dv.current().year;
const monthStr = `${year}-${month}`;

const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p.date && p.date.toFormat("yyyy-MM") === monthStr)
  .array();

const buckets = {
  "5.0": 0,
  "4.5-4.9": 0,
  "4.0-4.4": 0,
  "3.5-3.9": 0,
  "<3.5": 0
};

logs.forEach(log => {
  const r = log.rating || 0;
  if (r === 5.0) buckets["5.0"]++;
  else if (r >= 4.5) buckets["4.5-4.9"]++;
  else if (r >= 4.0) buckets["4.0-4.4"]++;
  else if (r >= 3.5) buckets["3.5-3.9"]++;
  else buckets["<3.5"]++;
});

const total = logs.length || 1;

dv.table(["Rating Range", "Count", "%"],
  Object.entries(buckets).map(([range, count]) => [
    range,
    count,
    `${Math.round(count / total * 100)}%`
  ])
);
```

---

## 💡 Insights & Discoveries

**What I Learned This Month**:

<% tp.file.cursor() %>

**Best Discovery**:


**Biggest Challenge**:


**Parameter Adjustments That Worked**:


---

## 🔄 Compared to Last Month

```dataviewjs
const currentMonth = parseInt(dv.current().month);
const currentYear = parseInt(dv.current().year);

const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

const currentLogs = dv.pages('"Coffee Logs"')
  .where(p => 
    p.type === "coffee-log" && 
    p.date && 
    p.date.year === currentYear && 
    p.date.month === currentMonth
  );

const lastMonthLogs = dv.pages('"Coffee Logs"')
  .where(p => 
    p.type === "coffee-log" && 
    p.date && 
    p.date.year === lastMonthYear && 
    p.date.month === lastMonth
  );

const currentAvg = currentLogs.length > 0
  ? currentLogs.array().reduce((sum, p) => sum + (p.rating || 0), 0) / currentLogs.length
  : 0;

const lastAvg = lastMonthLogs.length > 0
  ? lastMonthLogs.array().reduce((sum, p) => sum + (p.rating || 0), 0) / lastMonthLogs.length
  : 0;

const change = currentAvg - lastAvg;
const trend = change > 0.1 ? "📈 Improving" : change < -0.1 ? "📉 Declining" : "➡️ Stable";

dv.paragraph(`**This Month**: ${currentAvg.toFixed(2)}⭐ (${currentLogs.length} brews)`);
dv.paragraph(`**Last Month**: ${lastAvg.toFixed(2)}⭐ (${lastMonthLogs.length} brews)`);
dv.paragraph(`**Change**: ${change >= 0 ? "+" : ""}${change.toFixed(2)} ${trend}`);
```

---

## 🎯 Next Month Goals

**Focus Areas**:
- 

**Beans to Try**:
- 

**Skills to Develop**:
- 

**Equipment Considerations**:
- 

---

## 📝 Notes & Reflections

**Overall Month Assessment**:


**Highlights**:


**Challenges Faced**:


**What I'm Grateful For**:


---

**Tags**: monthly-report, <% tp.date.now("YYYY-MM") %>

---

*Generated from [[Monthly-Review]]*

