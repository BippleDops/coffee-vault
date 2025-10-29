---
type: database-view
title: Supply Chain Visualization Base
category: supply-chain
version: 5.0.0
tags: [view, supply-chain, producers, transparency]
---

# 🌱 Supply Chain Visualization Base

**Complete supply chain queries and relationship tracking**

**Coffee Vault 5.0** - From farm to cup transparency

---

## 🗺️ Complete Supply Chains

```datacore
TABLE WITHOUT ID
  file.link AS "Bean",
  "producer-link" AS "🌱 Producer",
  "washing-station" AS "🏭 Processing",
  exporter AS "🚢 Export",
  importer AS "📦 Import",
  roaster AS "🔥 Roaster",
  "transparency-score" AS "Score"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND "supply-chain-verified" = true
SORT "transparency-score" DESC
```

---

## 📊 Transparency Scorecard

```datacore
TABLE
  choice("transparency-score" >= 9, "🟢 Excellent", choice("transparency-score" >= 7, "🟡 Good", choice("transparency-score" >= 5, "🟠 Fair", "🔴 Poor"))) AS "Rating",
  length(rows) AS "Bean Count",
  list(rows.file.link, 5) AS "Examples"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND "transparency-score" != null
GROUP BY choice("transparency-score" >= 9, "🟢 Excellent", choice("transparency-score" >= 7, "🟡 Good", choice("transparency-score" >= 5, "🟠 Fair", "🔴 Poor")))
SORT choice("transparency-score" >= 9, 4, choice("transparency-score" >= 7, 3, choice("transparency-score" >= 5, 2, 1))) DESC
```

---

## 🤝 Producer Relationships

```datacore
TABLE WITHOUT ID
  file.link AS "Producer",
  country AS "Country",
  certifications AS "Certs",
  "roaster-partners" AS "Partners",
  "relationship-years" AS "Years",
  "sustainability-rating" AS "Sustainability"
FROM "Producers"
WHERE type = "producer-profile"
SORT "relationship-years" DESC, "sustainability-rating" DESC
```

---

## 💰 Price Premium Analysis

```datacore
TABLE WITHOUT ID
  file.link AS "Bean",
  roaster AS "Roaster",
  "price-premium-vs-commodity" AS "Premium %",
  "price-paid-to-farmer" AS "Farmer $/kg",
  "contract-type" AS "Contract",
  "transparency-score" AS "Transparency"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND "price-premium-vs-commodity" != null
SORT "price-premium-vs-commodity" DESC
LIMIT 20
```

---

## ✅ Certification Matrix

```datacore
TABLE
  certification AS "Certification",
  length(rows) AS "Bean Count",
  round((length(rows) / (SELECT length(rows) FROM "Beans Library" WHERE type = "bean-profile")) * 100, 0) AS "% of Beans"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND certification != null
FLATTEN certification
GROUP BY certification
SORT length(rows) DESC
```

---

## 🌍 Producer Geographic Distribution

```datacore
TABLE
  country AS "Country",
  length(rows) AS "Producers",
  list(rows.file.link) AS "Producer List",
  list(rows.certifications, 3) AS "Common Certs"
FROM "Producers"
WHERE type = "producer-profile"
GROUP BY country
SORT length(rows) DESC
```

---

## 🔗 Bean → Producer → Origin Links

```dataviewjs
// Trace complete relationships
const beans = dv.pages('"Beans Library"')
  .where(p => p.type === "bean-profile" && p["producer-link"])
  .array();

if (beans.length > 0) {
  dv.header(3, `${beans.length} Beans with Producer Links`);
  
  beans.forEach(bean => {
    const producerName = bean["producer-link"];
    const producer = dv.page(`Producers/${producerName}`);
    const origin = bean.origin;
    
    dv.paragraph(`
**${bean.name}**  
→ Producer: ${producerName} ${producer ? `(${producer.country})` : ""}  
→ Origin: ${origin}  
→ Transparency: ${bean["transparency-score"] || "Not scored"}/10
    `);
  });
} else {
  dv.paragraph("*No beans linked to producers yet. Add `producer-link` to bean profiles for supply chain tracking.*");
}
```

---

## 📈 Transparency Trends

```datacore
TABLE WITHOUT ID
  dateformat("purchase-date", "yyyy-MM") AS "Month",
  length(rows) AS "Beans Purchased",
  round(sum(rows."transparency-score") / length(rows), 1) AS "Avg Transparency",
  count(rows."transparency-score" >= 8) AS "High Transparency"
FROM "Beans Library"
WHERE type = "bean-profile"
  AND "purchase-date" != null
  AND "transparency-score" != null
GROUP BY dateformat("purchase-date", "yyyy-MM")
SORT dateformat("purchase-date", "yyyy-MM") DESC
LIMIT 12
```

---

## 🎯 Transparency Goals

**Target Metrics**:
- 80%+ beans with transparency score 7+
- 50%+ beans with verified supply chain
- 100% awareness of producer for favorite beans
- Track certifications for all purchases

**Current Progress**:

```dataviewjs
const beans = dv.pages('"Beans Library"').where(p => p.type === "bean-profile").array();
const withScore = beans.filter(b => b["transparency-score"]);
const highTransparency = withScore.filter(b => b["transparency-score"] >= 7);
const verified = beans.filter(b => b["supply-chain-verified"]);

const totalBeans = beans.length;

dv.paragraph(`
- **Total Beans**: ${totalBeans}
- **With Transparency Score**: ${withScore.length} (${Math.round(withScore.length / totalBeans * 100)}%)
- **High Transparency (7+)**: ${highTransparency.length} (${Math.round(highTransparency.length / totalBeans * 100)}%)
- **Verified Supply Chain**: ${verified.length} (${Math.round(verified.length / totalBeans * 100)}%)
`);
```

---

**Coffee Vault 5.0** - Complete supply chain visibility

