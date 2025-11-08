---
<%*
# ============================================
# TEMPLATE: Quick Capture Coffee Log v5.0
# VERSION: 5.0.0
# PURPOSE: Fast logging for quick sessions
# FEATURES: Minimal fields, auto-fill, voice-friendly
# ============================================

const currentDate = tp.file.creation_date("YYYY-MM-DD");
const currentTime = tp.file.creation_date("HH:mm");
const currentHour = parseInt(currentTime.split(':')[0]);
const timeOfDay = currentHour >= 5 && currentHour < 12 ? "morning" :
                   currentHour >= 12 && currentHour < 17 ? "afternoon" :
                   currentHour >= 17 && currentHour < 21 ? "evening" : "night";

# Get current bean
const currentBean = dv.pages('"Beans Library"')
  .where(p => p.type === "bean-profile" && p["is-current"])
  .array()[0] || 
  dv.pages('"Beans Library"')
    .where(p => p.type === "bean-profile")
    .sort(p => p.date, 'desc')
    .array()[0];

const beanName = currentBean ? currentBean.name : "";
const beanOrigin = currentBean ? currentBean.origin : "";

# Get most recent method
const recentLog = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .sort(p => p.date, 'desc')
  .array()[0];

const defaultMethod = recentLog ? recentLog["brew-method"] : "v60";

# Generate tags
const tagInference = await tp.user.require("Scripts/tag-inference.js").catch(() => null);
const tags = tagInference 
  ? tagInference.inferTags({
      type: "coffee-log",
      date: currentDate,
      beans: beanName,
      "brew-method": defaultMethod,
      "time-of-day": timeOfDay
    })
  : ["category:coffee-log"];

return `---
type: coffee-log
date: ${currentDate}
beans: ${beanName}
brew-method: ${defaultMethod}
rating: 

# Quick Parameters
dose: 
water: 
water-temperature: 
grind-size: 

# Quick Notes
notes: 

# Context
time-of-day: ${timeOfDay}

tags: ${JSON.stringify(tags)}
---

# Quick Log - ${currentDate}

**Bean**: ${beanName || "?"} | **Method**: ${defaultMethod} | **Time**: ${timeOfDay}

## Quick Info
- **Rating**: /5
- **Key Notes**: 

## Bean
- **Origin**: ${beanOrigin || "?"}

---

*Quick capture template - expand later if needed*
`;
%>

