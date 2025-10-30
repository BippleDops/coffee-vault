---
type: analytics-dashboard
title: Real-Time Brewing Assistant
category: brewing-optimization
created: 2025-10-28
version: 5.0.0
tags: [analytics, brewing, real-time, coffee-vault-5.0]
---

# Real-Time Brewing Assistant

> Live parameter monitoring, real-time extraction calculations, deviation alerts, and corrective action suggestions during brewing.

**Coffee Vault 5.0** - Advanced real-time brewing guidance system

---

## 🎯 Dashboard Purpose

Provide **real-time guidance during brewing** to:
- Monitor parameters as you brew
- Calculate extraction metrics live
- Alert when deviating from optimal ranges
- Suggest corrective actions immediately
- Track brewing consistency

---

## 📊 Current Brew Status

```dataviewjs
// Get most recent in-progress brew (simulation - would be live in production)
const recentBrew = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .sort(p => p.date, 'desc')
  .limit(1)
  .array()[0];

if (recentBrew) {
  dv.header(3, "Last Brew: " + recentBrew.beans);
  
  // Status indicators
  const dose = recentBrew.dose || 0;
  const water = recentBrew.water || 0;
  const ratio = water / dose;
  const temp = recentBrew["water-temperature"] || 0;
  const brewTime = recentBrew["brew-time"] || "";
  
  // Optimal ranges (would be personalized based on bean/method)
  const optimalRatio = { min: 15, max: 17 };
  const optimalTemp = { min: 90, max: 96 };
  
  // Status checks
  const ratioStatus = ratio >= optimalRatio.min && ratio <= optimalRatio.max ? "✅ Optimal" : "⚠️ Outside range";
  const tempStatus = temp >= optimalTemp.min && temp <= optimalTemp.max ? "✅ Optimal" : "⚠️ Outside range";
  
  dv.table(["Parameter", "Value", "Optimal Range", "Status"],
    [
      ["Dose", `${dose}g`, "15-20g", dose >= 15 && dose <= 20 ? "✅" : "⚠️"],
      ["Water", `${water}g`, `${Math.round(dose * 15)}-${Math.round(dose * 17)}g`, ratioStatus],
      ["Ratio", `1:${ratio.toFixed(1)}`, "1:15-1:17", ratioStatus],
      ["Temperature", `${temp}°C`, "90-96°C", tempStatus],
      ["Brew Time", brewTime, "2:30-3:30", "✅"]
    ]
  );
} else {
  dv.paragraph("**No brewing session in progress.** Start a new brew to see live guidance.");
}
```

---

## 🔴 Live Brewing Mode

**How to Use**:
1. Start brewing and update parameters in real-time
2. Check this dashboard for instant feedback
3. Follow deviation alerts and suggestions
4. Adjust on-the-fly for optimal extraction

**Real-Time Parameters** (would update live):
- ⏱️ **Elapsed Time**: 0:00
- ⚖️ **Current Output**: 0g
- 🌡️ **Current Temp**: --°C
- 💧 **Flow Rate**: -- ml/s
- 📊 **Extraction %**: --

---

## ⚠️ Deviation Alerts

```dataviewjs
// Simulated deviation detection
const alerts = [];

const recentBrew = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .sort(p => p.date, 'desc')
  .limit(1)
  .array()[0];

if (recentBrew) {
  const dose = recentBrew.dose || 0;
  const water = recentBrew.water || 0;
  const ratio = water / dose;
  const temp = recentBrew["water-temperature"] || 0;
  
  // Check for deviations
  if (ratio < 15) {
    alerts.push({
      severity: "⚠️ Warning",
      parameter: "Brew Ratio",
      issue: `Too concentrated (1:${ratio.toFixed(1)})`,
      suggestion: "Add more water or reduce dose to reach 1:15-1:17 ratio"
    });
  }
  
  if (ratio > 17) {
    alerts.push({
      severity: "⚠️ Warning",
      parameter: "Brew Ratio",
      issue: `Too diluted (1:${ratio.toFixed(1)})`,
      suggestion: "Reduce water or increase dose to reach 1:15-1:17 ratio"
    });
  }
  
  if (temp < 90) {
    alerts.push({
      severity: "🔴 Alert",
      parameter: "Water Temperature",
      issue: `Temperature too low (${temp}°C)`,
      suggestion: "Increase water temperature to 90-96°C for better extraction"
    });
  }
  
  if (temp > 96) {
    alerts.push({
      severity: "🔴 Alert",
      parameter: "Water Temperature",
      issue: `Temperature too high (${temp}°C)`,
      suggestion: "Reduce water temperature to 90-96°C to avoid over-extraction"
    });
  }
}

if (alerts.length > 0) {
  dv.header(3, "Active Alerts");
  dv.table(["Severity", "Parameter", "Issue", "Suggestion"],
    alerts.map(a => [a.severity, a.parameter, a.issue, a.suggestion])
  );
} else {
  dv.paragraph("✅ **No deviations detected.** All parameters within optimal ranges.");
}
```

---

## 💡 Corrective Actions

### Temperature Adjustments

**Too Hot** (>96°C):
- Wait 30 seconds before pouring
- Use cooler kettle or let water sit
- Check kettle calibration

**Too Cold** (<90°C):
- Preheat equipment thoroughly
- Use fresher boiled water
- Check for heat loss points

### Ratio Adjustments

**Too Concentrated** (<1:15):
- Add small amounts of water incrementally
- Adjust for next brew: reduce dose or increase water
- Target: 1:15-1:17 range

**Too Diluted** (>1:17):
- Cannot fix mid-brew
- Next brew: increase dose or reduce water
- Consider shorter brew time

### Flow Rate

**Too Fast**:
- Grind finer for next pour
- Reduce pour velocity
- Check for channeling

**Too Slow**:
- Grind coarser for next pour
- Increase pour velocity
- Check for blockage

---

## 📈 Extraction Calculator

```dataviewjs
// Real-time extraction yield calculator
const recentBrew = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .sort(p => p.date, 'desc')
  .limit(1)
  .array()[0];

if (recentBrew) {
  dv.header(3, "Extraction Metrics");
  
  const dose = recentBrew.dose || 18;
  const water = recentBrew.water || 300;
  const tds = recentBrew["tds-brewed"] || 1.35; // Example TDS
  const output = recentBrew["total-output-weight"] || 280;
  
  // Calculate extraction yield
  // EY% = (TDS% × Coffee Output in grams) / Dose in grams
  const extractionYield = (tds * output) / dose;
  
  // Brew strength
  const brewStrength = tds;
  
  // Optimal ranges
  const optimalEY = { min: 18, max: 22 };
  const optimalTDS = { min: 1.15, max: 1.55 };
  
  dv.table(["Metric", "Value", "Optimal Range", "Status"],
    [
      ["TDS (Brew Strength)", `${brewStrength.toFixed(2)}%`, "1.15-1.55%", 
        brewStrength >= optimalTDS.min && brewStrength <= optimalTDS.max ? "✅ Optimal" : "⚠️"],
      ["Extraction Yield", `${extractionYield.toFixed(1)}%`, "18-22%",
        extractionYield >= optimalEY.min && extractionYield <= optimalEY.max ? "✅ Optimal" : "⚠️"],
      ["Coffee Output", `${output}g`, `${Math.round(dose * 14)}-${Math.round(dose * 18)}g`, "✅"],
      ["Water Retention", `${water - output}g`, "20-40g", "✅"]
    ]
  );
  
  // Recommendations based on extraction
  if (extractionYield < 18) {
    dv.paragraph("**Under-extracted** ⬇️ - Try: finer grind, higher temperature, or longer brew time");
  } else if (extractionYield > 22) {
    dv.paragraph("**Over-extracted** ⬆️ - Try: coarser grind, lower temperature, or shorter brew time");
  } else {
    dv.paragraph("✅ **Optimal extraction** - Great brew!");
  }
}
```

---

## 🎯 Target Parameters (Bean-Specific)

```dataviewjs
// Would pull from recipe or historical data for the current bean
const currentBean = "Ethiopian Yirgacheffe"; // Would be dynamic

dv.header(3, `Optimal Parameters for ${currentBean}`);

// Simulated optimal parameters from historical data
dv.table(["Parameter", "Optimal Value", "Range", "Based On"],
  [
    ["Dose", "18g", "17-19g", "Avg of top-rated brews"],
    ["Water", "300g", "285-315g", "1:16 ratio (best results)"],
    ["Ratio", "1:16.7", "1:15.8-1:17.5", "Consistency analysis"],
    ["Temperature", "94°C", "92-95°C", "Peak flavor extraction"],
    ["Grind", "Medium-fine", "22-24 clicks", "Comandante C40"],
    ["Brew Time", "2:45", "2:30-3:00", "Optimal extraction window"],
    ["TDS Target", "1.35%", "1.25-1.45%", "Balanced strength"]
  ]
);
```

---

## 📊 Consistency Tracking

```dataviewjs
// Track consistency of last 5 brews
const recentBrews = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .sort(p => p.date, 'desc')
  .limit(5)
  .array();

if (recentBrews.length >= 3) {
  dv.header(3, "Recent Brew Consistency");
  
  const ratios = recentBrews.map(b => (b.water || 0) / (b.dose || 1)).filter(r => r > 0);
  const temps = recentBrews.map(b => b["water-temperature"]).filter(t => t);
  const ratings = recentBrews.map(b => b.rating).filter(r => r);
  
  // Calculate standard deviation
  const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
  const std = arr => {
    const mean = avg(arr);
    return Math.sqrt(avg(arr.map(x => Math.pow(x - mean, 2))));
  };
  
  const ratioStd = std(ratios);
  const tempStd = std(temps);
  const ratingStd = std(ratings);
  
  dv.table(["Parameter", "Avg", "Std Dev", "Consistency"],
    [
      ["Brew Ratio", `1:${avg(ratios).toFixed(1)}`, `±${ratioStd.toFixed(2)}`, ratioStd < 0.5 ? "✅ Consistent" : "⚠️ Variable"],
      ["Temperature", `${avg(temps).toFixed(1)}°C`, `±${tempStd.toFixed(1)}°C`, tempStd < 2 ? "✅ Consistent" : "⚠️ Variable"],
      ["Rating", `${avg(ratings).toFixed(2)}⭐`, `±${ratingStd.toFixed(2)}`, ratingStd < 0.3 ? "✅ Consistent" : "⚠️ Variable"]
    ]
  );
}
```

---

## 🔔 Brewing Tips

> [!tip] Real-Time Best Practices
> - Monitor first drop time (should be 35-50s for V60)
> - Check for even extraction (no dry patches)
> - Observe drawdown time (should complete in optimal window)
> - Note any channeling or uneven flow

> [!warning] Common Issues
> - **Channeling**: Uneven water flow creating paths
> - **Fines Migration**: Coffee fines clogging filter
> - **Temperature Drop**: Heat loss during brewing
> - **Pour Turbulence**: Aggressive pouring disturbing bed

---

## 📝 Session Notes

**Use this section to record real-time observations**:

- First impressions during bloom:
- Flow rate observations:
- Extraction appearance:
- Immediate taste notes:
- Adjustments needed for next time:

---

**Last Updated**: Real-time  
**Next Brew**: Ready when you are!  
**Dialed In**: Track your path to perfection

---

*Part of Coffee Vault 5.0 Advanced Analytics Suite*
