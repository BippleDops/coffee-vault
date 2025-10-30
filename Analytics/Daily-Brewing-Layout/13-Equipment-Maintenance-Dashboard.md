---
type: analytics-dashboard
title: Equipment Maintenance Dashboard
category: equipment-management
created: 2025-10-28
version: 5.0.0
tags: [analytics, equipment, maintenance, coffee-vault-5.0]
---

# Equipment Maintenance Dashboard

> Equipment usage patterns, maintenance predictions, replacement timing suggestions, and cost of ownership analysis.

**Coffee Vault 5.0** - Predictive equipment maintenance and optimization

---

## ⚙️ Equipment Inventory

```dataviewjs
// Show all tracked equipment
const equipment = dv.pages()
  .where(p => p.type === "equipment-profile");

const equipmentCount = equipment.length;

if (equipmentCount > 0) {
  dv.header(3, `${equipmentCount} Equipment Items Tracked`);
  
  dv.table(["Equipment", "Category", "Status", "Last Used", "Total Uses"],
    equipment
      .sort(p => p["total-uses"], 'desc')
      .map(p => [
        p.file.link,
        p.category,
        p["current-status"] || "active",
        p["last-used"] || "Unknown",
        p["total-uses"] || 0
      ])
  );
} else {
  dv.paragraph("**No equipment profiles yet.** Create equipment profiles to track maintenance!");
}
```

---

## 🔧 Maintenance Due

```dataviewjs
// Equipment needing maintenance
const equipment = dv.pages()
  .where(p => p.type === "equipment-profile");

const today = dv.date("now");

const maintenanceDue = equipment.where(p => {
  if (!p["maintenance-due"]) return false;
  const dueDate = dv.date(p["maintenance-due"]);
  return dueDate && dueDate <= today;
});

const maintenanceSoon = equipment.where(p => {
  if (!p["maintenance-due"]) return false;
  const dueDate = dv.date(p["maintenance-due"]);
  const daysDiff = dueDate ? Math.floor((dueDate - today) / (1000 * 60 * 60 * 24)) : 999;
  return daysDiff > 0 && daysDiff <= 7;
});

if (maintenanceDue.length > 0) {
  dv.header(3, "🔴 Maintenance Overdue");
  dv.table(["Equipment", "Maintenance Type", "Due Date", "Days Overdue"],
    maintenanceDue.map(p => {
      const dueDate = dv.date(p["maintenance-due"]);
      const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
      return [
        p.file.link,
        p["maintenance-frequency"] || "Regular maintenance",
        p["maintenance-due"],
        daysOverdue
      ];
    })
  );
}

if (maintenanceSoon.length > 0) {
  dv.header(3, "⚠️ Maintenance Due Soon (7 days)");
  dv.table(["Equipment", "Maintenance Type", "Due Date", "Days Until Due"],
    maintenanceSoon.map(p => {
      const dueDate = dv.date(p["maintenance-due"]);
      const daysUntil = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
      return [
        p.file.link,
        p["maintenance-frequency"] || "Regular maintenance",
        p["maintenance-due"],
        daysUntil
      ];
    })
  );
}

if (maintenanceDue.length === 0 && maintenanceSoon.length === 0) {
  dv.paragraph("✅ **All equipment maintenance up to date!**");
}
```

---

## 📊 Usage Patterns

```dataviewjs
// Analyze equipment usage patterns
const equipment = dv.pages()
  .where(p => p.type === "equipment-profile" && p["total-uses"]);

if (equipment.length > 0) {
  dv.header(3, "Equipment Usage Statistics");
  
  dv.table(["Equipment", "Total Uses", "Total Coffee", "Uses/Week", "Lifespan Progress"],
    equipment
      .sort(p => p["total-uses"], 'desc')
      .map(p => {
        const uses = p["total-uses"] || 0;
        const coffee = p["total-coffee"] || 0;
        
        // Calculate uses per week (assuming first-use date)
        const firstUse = p["first-use"] ? dv.date(p["first-use"]) : null;
        const today = dv.date("now");
        const daysSince = firstUse ? Math.floor((today - firstUse) / (1000 * 60 * 60 * 24)) : 0;
        const weeksUsed = daysSince / 7;
        const usesPerWeek = weeksUsed > 0 ? (uses / weeksUsed).toFixed(1) : "N/A";
        
        // Lifespan progress (simulated)
        const expectedLifespan = 5000; // Expected uses
        const lifespanProgress = Math.round(uses / expectedLifespan * 100);
        
        return [
          p.file.link,
          uses,
          `${coffee}kg`,
          usesPerWeek,
          `${lifespanProgress}%`
        ];
      })
  );
}
```

---

## 🔮 Predictive Maintenance

```dataviewjs
// Predict when maintenance will be needed based on usage patterns
const equipment = dv.pages()
  .where(p => p.type === "equipment-profile" && p["total-uses"]);

if (equipment.length > 0) {
  dv.header(3, "🔮 Predicted Maintenance Schedule");
  
  equipment.forEach(item => {
    const uses = item["total-uses"] || 0;
    const firstUse = item["first-use"] ? dv.date(item["first-use"]) : null;
    const today = dv.date("now");
    
    if (firstUse) {
      const daysSince = Math.floor((today - firstUse) / (1000 * 60 * 60 * 24));
      const usesPerDay = daysSince > 0 ? uses / daysSince : 0;
      
      // Predict next maintenance (every 500 uses for grinders)
      const maintenanceInterval = item.category === "grinder" ? 500 : 200;
      const usesSinceLastMaintenance = uses % maintenanceInterval;
      const usesUntilMaintenance = maintenanceInterval - usesSinceLastMaintenance;
      const daysUntilMaintenance = usesPerDay > 0 ? Math.round(usesUntilMaintenance / usesPerDay) : "N/A";
      
      dv.paragraph(`
**${item.name}**:  
- Uses until maintenance: ${usesUntilMaintenance}  
- Estimated days: ${daysUntilMaintenance}  
- Recommended action: ${usesUntilMaintenance < 50 ? "Schedule maintenance soon" : "No action needed"}
      `);
    }
  });
}
```

---

## 💰 Cost of Ownership Analysis

```dataviewjs
// Calculate total cost of ownership for equipment
const equipment = dv.pages()
  .where(p => p.type === "equipment-profile" && p["purchase-price"]);

if (equipment.length > 0) {
  dv.header(3, "💵 Total Cost of Ownership");
  
  dv.table(["Equipment", "Purchase Price", "Maintenance Cost", "Total Uses", "Cost per Use"],
    equipment.map(p => {
      const purchasePrice = p["purchase-price"] || 0;
      const maintenanceCost = p["maintenance-cost"] || 0;
      const totalUses = p["total-uses"] || 1;
      const costPerUse = ((purchasePrice + maintenanceCost) / totalUses).toFixed(2);
      
      return [
        p.file.link,
        `$${purchasePrice}`,
        `$${maintenanceCost}`,
        totalUses,
        `$${costPerUse}`
      ];
    })
  );
}
```

---

## 🔄 Replacement Recommendations

```dataviewjs
// Suggest equipment replacements based on age and usage
const equipment = dv.pages()
  .where(p => p.type === "equipment-profile");

const replacementNeeded = equipment.where(p => {
  const uses = p["total-uses"] || 0;
  const performance = p["performance-rating"] || 5;
  
  // Replacement criteria
  return uses > 3000 || performance < 3;
}).array();

const replacementSoon = equipment.where(p => {
  const uses = p["total-uses"] || 0;
  const performance = p["performance-rating"] || 5;
  
  return (uses > 2000 && uses <= 3000) || (performance >= 3 && performance < 3.5);
}).array();

if (replacementNeeded.length > 0) {
  dv.header(3, "🔴 Replacement Recommended");
  dv.table(["Equipment", "Reason", "Upgrade To"],
    replacementNeeded.map(p => [
      p.file.link,
      p["total-uses"] > 3000 ? "High usage" : "Low performance",
      "Research upgrade options"
    ])
  );
}

if (replacementSoon.length > 0) {
  dv.header(3, "⚠️ Consider Replacement Soon");
  dv.table(["Equipment", "Total Uses", "Performance", "Status"],
    replacementSoon.map(p => [
      p.file.link,
      p["total-uses"],
      `${p["performance-rating"]}/5`,
      "Monitor closely"
    ])
  );
}

if (replacementNeeded.length === 0 && replacementSoon.length === 0) {
  dv.paragraph("✅ **All equipment in good condition!** No replacements needed.");
}
```

---

## 📅 Maintenance Calendar

### This Week
- Check grinder burrs for wear
- Clean brewer thoroughly
- Descale kettle if needed

### This Month
- Deep clean all equipment
- Calibrate scale
- Inspect seals and gaskets

### This Quarter
- Professional grinder alignment check
- Replace worn filters/parts
- Update equipment profiles

---

## 💡 Maintenance Tips

> [!tip] Grinder Maintenance
> - Clean daily: Remove grounds after each use
> - Weekly deep clean: Brush burrs thoroughly
> - Monthly: Run cleaning tablets if applicable
> - Quarterly: Check burr wear, alignment

> [!tip] Brewer Maintenance
> - Rinse after each use
> - Weekly: Deep clean with coffee cleaner
> - Monthly: Check for mineral buildup
> - Descale when needed

> [!tip] Scale Maintenance
> - Weekly: Clean platform
> - Monthly: Calibrate with test weight
> - Check battery regularly
> - Keep dry and clean

---

## 📈 Equipment ROI Analysis

**Value Metrics**:
- Average cost per brew across all equipment
- Most valuable equipment (lowest cost per use)
- Equipment efficiency ratings
- Upgrade impact analysis

---

**Coffee Vault 5.0** - Keep your equipment performing at peak
