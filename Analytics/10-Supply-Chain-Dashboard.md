---
title: Supply Chain Transparency Dashboard
type: analytics-dashboard
category: supply-chain
created: 2025-10-28
tags: [analytics, supply-chain, transparency, coffee-vault-5.0]
---

# Supply Chain Transparency Dashboard

> Complete supply chain tracking, producer relationships, and sustainability metrics

## Producer Relationships

```dataviewjs
const producers = dv.pages('"Producers"')
  .where(p => p.type === "producer-profile")
  .array();

if (producers.length > 0) {
  dv.header(3, "🌱 Producer Partners");
  
  dv.table(
    ["Producer", "Country", "Certifications", "Sustainability", "Relationship"],
    producers.map(p => [
      p.file.link,
      p.country || "Unknown",
      p.certifications ? p.certifications.length : 0,
      p["sustainability-rating"] || "N/A",
      p["relationship-quality"] || "N/A"
    ])
  );
} else {
  dv.paragraph("No producer profiles found. Add producer profiles to track supply chain transparency.");
}
```

## Beans by Producer

```dataviewjs
const beans = dv.pages('"Beans Library"')
  .where(p => p.type === "bean-profile" && p["producer-link"])
  .array();

if (beans.length > 0) {
  dv.header(3, "🫘 Beans Linked to Producers");
  
  // Group by producer
  const byProducer = {};
  beans.forEach(bean => {
    const producer = bean["producer-link"];
    if (!byProducer[producer]) {
      byProducer[producer] = [];
    }
    byProducer[producer].push(bean);
  });
  
  dv.table(
    ["Producer", "Beans Count", "Avg Rating", "Total Spent"],
    Object.entries(byProducer).map(([producer, producerBeans]) => {
      const ratings = producerBeans.map(b => b["avg-rating"] || 0).filter(r => r > 0);
      const avgRating = ratings.length > 0 
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
        : "N/A";
      
      const totalSpent = producerBeans.reduce((sum, b) => {
        return sum + (b["purchase-price"] || 0);
      }, 0);
      
      return [
        producer,
        producerBeans.length,
        avgRating !== "N/A" ? `${avgRating}⭐` : "N/A",
        `$${totalSpent.toFixed(2)}`
      ];
    })
  );
} else {
  dv.paragraph("No beans linked to producers. Link beans to producer profiles to track supply chain.");
}
```

## Certification Tracking

```dataviewjs
const allBeans = dv.pages('"Beans Library"')
  .where(p => p.type === "bean-profile")
  .array();

if (allBeans.length > 0) {
  dv.header(3, "✅ Certification Analysis");
  
  const certCounts = {};
  const certBeans = {};
  
  allBeans.forEach(bean => {
    if (bean.certifications && bean.certifications.length > 0) {
      bean.certifications.forEach(cert => {
        certCounts[cert] = (certCounts[cert] || 0) + 1;
        if (!certBeans[cert]) certBeans[cert] = [];
        certBeans[cert].push(bean.file.name);
      });
    }
  });
  
  if (Object.keys(certCounts).length > 0) {
    dv.table(
      ["Certification", "Beans Count", "Percentage"],
      Object.entries(certCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([cert, count]) => [
          cert,
          count,
          `${((count / allBeans.length) * 100).toFixed(1)}%`
        ])
    );
    
    const certifiedCount = allBeans.filter(b => b.certifications && b.certifications.length > 0).length;
    dv.paragraph(`**Certified Beans**: ${certifiedCount} of ${allBeans.length} (${((certifiedCount / allBeans.length) * 100).toFixed(1)}%)`);
  } else {
    dv.paragraph("No certifications tracked. Add certification data to bean profiles.");
  }
}
```

## Sustainability Metrics

```dataviewjs
const producers = dv.pages('"Producers"')
  .where(p => p.type === "producer-profile")
  .array();

if (producers.length > 0) {
  dv.header(3, "🌍 Sustainability Overview");
  
  const sustainabilityData = producers.map(p => ({
    name: p.file.name,
    environmental: p["environmental-impact-score"] || 0,
    social: p["social-impact-score"] || 0,
    rating: p["sustainability-rating"] || "N/A",
    certifications: p.certifications ? p.certifications.length : 0
  }));
  
  const avgEnvironmental = sustainabilityData.filter(d => d.environmental > 0).length > 0
    ? (sustainabilityData.filter(d => d.environmental > 0).reduce((sum, d) => sum + d.environmental, 0) / 
       sustainabilityData.filter(d => d.environmental > 0).length).toFixed(1)
    : "N/A";
  
  const avgSocial = sustainabilityData.filter(d => d.social > 0).length > 0
    ? (sustainabilityData.filter(d => d.social > 0).reduce((sum, d) => sum + d.social, 0) / 
       sustainabilityData.filter(d => d.social > 0).length).toFixed(1)
    : "N/A";
  
  dv.table(
    ["Metric", "Average Score", "Status"],
    [
      ["Environmental Impact", avgEnvironmental !== "N/A" ? `${avgEnvironmental}/10` : "N/A", avgEnvironmental !== "N/A" && avgEnvironmental >= 7 ? "✅" : "⚠️"],
      ["Social Impact", avgSocial !== "N/A" ? `${avgSocial}/10` : "N/A", avgSocial !== "N/A" && avgSocial >= 7 ? "✅" : "⚠️"],
      ["Total Certifications", sustainabilityData.reduce((sum, d) => sum + d.certifications, 0), "📊"]
    ]
  );
  
  dv.header(4, "Producer Sustainability Ratings");
  dv.table(
    ["Producer", "Environmental", "Social", "Overall Rating", "Certifications"],
    sustainabilityData.map(d => [
      d.name,
      d.environmental > 0 ? `${d.environmental}/10` : "N/A",
      d.social > 0 ? `${d.social}/10` : "N/A",
      d.rating,
      d.certifications
    ])
  );
}
```

## Price Premium Analysis

```dataviewjs
const beans = dv.pages('"Beans Library"')
  .where(p => p.type === "bean-profile" && p["producer-link"])
  .array();

if (beans.length > 0) {
  dv.header(3, "💰 Price Premium Analysis");
  
  const producerPremiums = {};
  
  beans.forEach(bean => {
    const producer = bean["producer-link"];
    if (!producerPremiums[producer]) {
      producerPremiums[producer] = [];
    }
    
    const producerProfile = dv.page(`Producers/${producer}`);
    if (producerProfile && producerProfile["price-premium"]) {
      producerPremiums[producer].push({
        bean: bean.file.name,
        premium: producerProfile["price-premium"],
        price: bean["purchase-price"] || 0
      });
    }
  });
  
  if (Object.keys(producerPremiums).length > 0) {
    dv.table(
      ["Producer", "Price Premium", "Beans Count", "Avg Bean Price"],
      Object.entries(producerPremiums).map(([producer, data]) => {
        const avgPrice = data.reduce((sum, d) => sum + d.price, 0) / data.length;
        const avgPremium = data[0].premium; // Assuming same premium for all beans from producer
        
        return [
          producer,
          `${avgPremium}%`,
          data.length,
          `$${avgPrice.toFixed(2)}`
        ];
      })
    );
  } else {
    dv.paragraph("Price premium data not available. Add price premium information to producer profiles.");
  }
}
```

## Direct Trade Relationships

```dataviewjs
const producers = dv.pages('"Producers"')
  .where(p => p.type === "producer-profile" && p["direct-trade-verified"])
  .array();

if (producers.length > 0) {
  dv.header(3, "🤝 Direct Trade Partners");
  
  dv.table(
    ["Producer", "Roaster Partners", "Relationship Start", "Contract Type", "Price Premium"],
    producers.map(p => [
      p.file.link,
      p["roaster-partners"] ? p["roaster-partners"].length : 0,
      p["partnership-start"] || "N/A",
      p["contract-type"] || "N/A",
      p["price-premium"] ? `${p["price-premium"]}%` : "N/A"
    ])
  );
  
  const totalPremiums = producers
    .filter(p => p["price-premium"])
    .reduce((sum, p) => sum + p["price-premium"], 0);
  const avgPremium = producers.filter(p => p["price-premium"]).length > 0
    ? totalPremiums / producers.filter(p => p["price-premium"]).length
    : 0;
  
  dv.paragraph(`**Average Price Premium**: ${avgPremium.toFixed(1)}% above commodity price`);
} else {
  dv.paragraph("No direct trade relationships tracked. Add direct trade information to producer profiles.");
}
```

## Supply Chain Map

```dataviewjs
// Visual representation of supply chain connections
const beans = dv.pages('"Beans Library"')
  .where(p => p.type === "bean-profile")
  .limit(10)
  .array();

if (beans.length > 0) {
  dv.header(3, "🗺️ Supply Chain Connections");
  
  const chain = beans
    .filter(b => b["producer-link"] || b.origin || b.roaster)
    .map(bean => {
      const chainLinks = [];
      
      if (bean["producer-link"]) chainLinks.push(`Producer: ${bean["producer-link"]}`);
      if (bean.origin) chainLinks.push(`Origin: ${bean.origin}`);
      if (bean.roaster) chainLinks.push(`Roaster: ${bean.roaster}`);
      
      return {
        bean: bean.file.name,
        chain: chainLinks.join(" → ")
      };
    });
  
  if (chain.length > 0) {
    dv.table(
      ["Bean", "Supply Chain"],
      chain.map(c => [c.bean, c.chain])
    );
  }
}
```

## Recommendations

```dataviewjs
dv.header(3, "💡 Recommendations");

const recommendations = [];

// Check certification coverage
const beans = dv.pages('"Beans Library"')
  .where(p => p.type === "bean-profile")
  .array();
const certifiedCount = beans.filter(b => b.certifications && b.certifications.length > 0).length;
const certPercentage = beans.length > 0 ? (certifiedCount / beans.length) * 100 : 0;

if (certPercentage < 50) {
  recommendations.push({
    priority: "Medium",
    action: "Increase certification coverage",
    details: `Only ${certPercentage.toFixed(1)}% of beans have certifications. Consider prioritizing certified coffees.`
  });
}

// Check producer relationships
const beansWithProducers = beans.filter(b => b["producer-link"]).length;
const producerPercentage = beans.length > 0 ? (beansWithProducers / beans.length) * 100 : 0;

if (producerPercentage < 30) {
  recommendations.push({
    priority: "High",
    action: "Link more beans to producers",
    details: `Only ${producerPercentage.toFixed(1)}% of beans are linked to producer profiles. Track supply chain transparency.`
  });
}

// Check sustainability data
const producers = dv.pages('"Producers"')
  .where(p => p.type === "producer-profile")
  .array();
const producersWithSustainability = producers.filter(p => p["sustainability-rating"]).length;

if (producers.length > 0 && producersWithSustainability < producers.length * 0.5) {
  recommendations.push({
    priority: "Medium",
    action: "Complete sustainability assessments",
    details: `Only ${producersWithSustainability} of ${producers.length} producers have sustainability ratings.`
  });
}

if (recommendations.length > 0) {
  recommendations.forEach(rec => {
    dv.header(4, `${rec.priority === "High" ? "🔴" : "🟡"} ${rec.action}`);
    dv.paragraph(rec.details);
  });
} else {
  dv.paragraph("✅ **Excellent supply chain transparency!** All metrics are well-tracked.");
}
```

---

**Usage**: Monitor supply chain transparency, producer relationships, certifications, and sustainability metrics.

---

**Tags**: [analytics, supply-chain, transparency, coffee-vault-5.0]

