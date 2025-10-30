---
type: analytics-dashboard
title: Supply Chain Transparency Dashboard
category: sustainability-ethics
created: 2025-10-28
version: 5.0.0
tags: [analytics, supply-chain, transparency, sustainability, coffee-vault-5.0]
---

# Supply Chain Transparency Dashboard

> Producer relationships, certification tracking, price premium analysis, and sustainability metrics visualization.

**Coffee Vault 5.0** - Complete supply chain transparency and ethical sourcing tracker

---

## 🌍 Supply Chain Overview

```dataviewjs
const beans = dv.pages('"Beans Library"')
  .where(p => p.type === "bean-profile")
  .array();

const withProducer = beans.filter(b => b["producer-link"]);
const withSupplyChain = beans.filter(b => b["supply-chain-verified"]);
const withCertifications = beans.filter(b => b.certification && b.certification.length > 0);
const highTransparency = beans.filter(b => b["transparency-score"] >= 8);

dv.header(3, "📊 Transparency Metrics");
dv.table(["Metric", "Count", "Percentage"],
  [
    ["Total Beans Tracked", beans.length, "100%"],
    ["Beans with Producer Link", withProducer.length, `${Math.round(withProducer.length / beans.length * 100)}%`],
    ["Verified Supply Chain", withSupplyChain.length, `${Math.round(withSupplyChain.length / beans.length * 100)}%`],
    ["With Certifications", withCertifications.length, `${Math.round(withCertifications.length / beans.length * 100)}%`],
    ["High Transparency (8+)", highTransparency.length, `${Math.round(highTransparency.length / beans.length * 100)}%`]
  ]
);
```

---

## 🏆 Transparency Leaders

```dataviewjs
const beans = dv.pages('"Beans Library"')
  .where(p => p.type === "bean-profile" && p["transparency-score"])
  .sort(p => p["transparency-score"], 'desc')
  .limit(10);

dv.header(3, "Top 10 Most Transparent Beans");
dv.table(["Bean", "Roaster", "Origin", "Transparency", "Ethical Rating"],
  beans.map(p => [
    p.file.link,
    p.roaster,
    p.origin,
    `${p["transparency-score"]}/10`,
    `${p["ethical-rating"] || "N/A"}/10`
  ])
);
```

---

## 🌱 Producer Relationships

```dataviewjs
const producers = dv.pages('"Producers"')
  .where(p => p.type === "producer-profile");

const producerCount = producers.length;

if (producerCount > 0) {
  dv.header(3, `📍 ${producerCount} Producers Tracked`);
  
  dv.table(["Producer", "Country", "Category", "Certifications", "Relationship"],
    producers.map(p => [
      p.file.link,
      p.country,
      p.category,
      p.certifications ? p.certifications.slice(0, 3).join(", ") : "None",
      p["relationship-strength"] || "N/A"
    ])
  );
} else {
  dv.paragraph("**No producer profiles yet.** Use `Templates/Producer Profile.md` to start tracking producers.");
}
```

---

## ✅ Certification Tracking

```dataviewjs
const beans = dv.pages('"Beans Library"')
  .where(p => p.type === "bean-profile" && p.certification);

const certificationCounts = {};
beans.forEach(bean => {
  (bean.certification || []).forEach(cert => {
    certificationCounts[cert] = (certificationCounts[cert] || 0) + 1;
  });
});

const sortedCerts = Object.entries(certificationCounts)
  .sort((a, b) => b[1] - a[1]);

if (sortedCerts.length > 0) {
  dv.header(3, "Certifications Across Beans");
  dv.table(["Certification", "Bean Count", "Percentage"],
    sortedCerts.map(([cert, count]) => [
      cert,
      count,
      `${Math.round(count / beans.length * 100)}%`
    ])
  );
} else {
  dv.paragraph("**No certification data available.** Add certification info to bean profiles.");
}
```

---

## 💰 Price Premium Analysis

```dataviewjs
const beans = dv.pages('"Beans Library"')
  .where(p => p.type === "bean-profile" && p["price-premium-vs-commodity"]);

if (beans.length > 0) {
  dv.header(3, "Price Premium Distribution");
  
  const premiums = beans.array().map(b => b["price-premium-vs-commodity"]);
  const avgPremium = premiums.reduce((a, b) => a + b, 0) / premiums.length;
  const minPremium = Math.min(...premiums);
  const maxPremium = Math.max(...premiums);
  
  dv.paragraph(`**Average Premium**: ${Math.round(avgPremium)}% above commodity price`);
  dv.paragraph(`**Range**: ${Math.round(minPremium)}% - ${Math.round(maxPremium)}%`);
  
  // Show highest premium beans
  const topPremium = beans.sort(p => p["price-premium-vs-commodity"], 'desc').limit(5);
  
  dv.header(4, "Highest Premium Beans");
  dv.table(["Bean", "Roaster", "Premium %", "Contract Type"],
    topPremium.map(p => [
      p.file.link,
      p.roaster,
      `${p["price-premium-vs-commodity"]}%`,
      p["contract-type"] || "N/A"
    ])
  );
}
```

---

## 🤝 Direct Trade Relationships

```dataviewjs
const directTrade = dv.pages('"Beans Library"')
  .where(p => 
    p.type === "bean-profile" &&
    p["contract-type"] === "direct-trade"
  );

const directTradeCount = directTrade.length;
const totalBeans = dv.pages('"Beans Library"').where(p => p.type === "bean-profile").length;
const directTradePercentage = totalBeans > 0 ? Math.round(directTradeCount / totalBeans * 100) : 0;

dv.header(3, `🤝 Direct Trade: ${directTradeCount} beans (${directTradePercentage}%)`);

if (directTradeCount > 0) {
  dv.table(["Bean", "Producer", "Relationship Years", "Price Premium"],
    directTrade.map(p => [
      p.file.link,
      p["producer-link"] || "N/A",
      p["relationship-years"] || "N/A",
      p["price-premium-vs-commodity"] ? `${p["price-premium-vs-commodity"]}%` : "N/A"
    ])
  );
}
```

---

## 🌿 Sustainability Scores

```dataviewjs
const producers = dv.pages('"Producers"')
  .where(p => p.type === "producer-profile" && p["sustainability-rating"]);

if (producers.length > 0) {
  dv.header(3, "Producer Sustainability Ratings");
  
  dv.table(["Producer", "Country", "Environmental", "Social", "Overall Rating"],
    producers.map(p => [
      p.file.link,
      p.country,
      `${p["environmental-impact-score"] || "N/A"}/10`,
      `${p["social-impact-score"] || "N/A"}/10`,
      p["sustainability-rating"]
    ])
  );
}
```

---

## 📊 Traceability Levels

```dataviewjs
const beans = dv.pages('"Beans Library"')
  .where(p => p.type === "bean-profile");

const traceability = {
  complete: 0,
  high: 0,
  medium: 0,
  low: 0,
  none: 0
};

beans.forEach(bean => {
  const level = bean["traceability-level"] || "none";
  traceability[level] = (traceability[level] || 0) + 1;
});

dv.header(3, "Traceability Distribution");
dv.table(["Level", "Count", "Percentage"],
  Object.entries(traceability).map(([level, count]) => [
    level.charAt(0).toUpperCase() + level.slice(1),
    count,
    `${Math.round(count / beans.length * 100)}%`
  ])
);
```

---

## 🎯 Supply Chain Goals

**Recommendations**:
- ✅ Aim for 80%+ beans with producer links
- ✅ Target 50%+ verified supply chains
- ✅ Seek transparency scores of 7+
- ✅ Support direct trade relationships
- ✅ Prioritize certified and sustainable producers

---

## 🗺️ Supply Chain Map

```dataviewjs
// Visualize complete supply chain for recent beans
const recentBeans = dv.pages('"Beans Library"')
  .where(p => p.type === "bean-profile" && p["supply-chain-verified"])
  .sort(p => p["purchase-date"], 'desc')
  .limit(3);

if (recentBeans.length > 0) {
  dv.header(3, "Complete Supply Chains");
  
  recentBeans.forEach(bean => {
    dv.header(4, bean.name);
    dv.paragraph(`
🌱 **Producer**: ${bean["producer-link"] || "Unknown"}  
🏭 **Washing Station**: ${bean["washing-station"] || "Unknown"}  
🚢 **Exporter**: ${bean["exporter"] || "Unknown"}  
📦 **Importer**: ${bean["importer"] || "Unknown"}  
🔥 **Roaster**: ${bean.roaster}  
☕ **You**: Coffee enthusiast
    `);
  });
}
```

---

## 📈 Impact Metrics

**Your Ethical Coffee Sourcing Impact**:

```dataviewjs
const beans = dv.pages('"Beans Library"')
  .where(p => p.type === "bean-profile");

const ethicalBeans = beans.where(p => p["ethical-rating"] >= 7).length;
const certifiedBeans = beans.where(p => p.certification && p.certification.length > 0).length;
const directTrade = beans.where(p => p["contract-type"] === "direct-trade").length;

const ethicalPercentage = Math.round(ethicalBeans / beans.length * 100);
const certifiedPercentage = Math.round(certifiedBeans / beans.length * 100);
const directTradePercentage = Math.round(directTrade / beans.length * 100);

dv.paragraph(`
**Ethical Sourcing Score**: ${ethicalPercentage}%  
**Certified Coffees**: ${certifiedPercentage}%  
**Direct Trade**: ${directTradePercentage}%  

**Overall Impact**: ${(ethicalPercentage + certifiedPercentage + directTradePercentage) / 3}% - ${
  ((ethicalPercentage + certifiedPercentage + directTradePercentage) / 3) >= 75 ? "Excellent! 🌟" :
  ((ethicalPercentage + certifiedPercentage + directTradePercentage) / 3) >= 50 ? "Good progress 👍" :
  "Room for improvement 📈"
}
`);
```

---

**Coffee Vault 5.0** - Brew with transparency, support with intention

