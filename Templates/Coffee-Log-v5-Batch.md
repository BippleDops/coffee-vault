---
<%*
// ============================================
// TEMPLATE: Batch Coffee Log v5.0
// VERSION: 5.0.0
// PURPOSE: Log multiple brewing sessions at once
// FEATURES: Multi-session tracking, comparison notes
// ============================================

const currentDate = tp.file.creation_date("YYYY-MM-DD");
const currentTime = tp.file.creation_date("HH:mm");

// Get current bean
const currentBean = dv.pages('"Beans Library"')
  .where(p => p.type === "bean-profile" && p["is-current"])
  .array()[0];

const beanName = currentBean ? currentBean.name : "";
const sessions = [1, 2, 3]; // Default 3 sessions, user can add more

// Generate tags
const tagInference = await tp.user.require("Scripts/tag-inference.js").catch(() => null);
const tags = tagInference 
  ? tagInference.inferTags({
      type: "coffee-log",
      date: currentDate,
      beans: beanName
    })
  : ["category:coffee-log"];

let output = `---
type: coffee-log
date: ${currentDate}
beans: ${beanName}
brew-method: 
batch-session: true
session-count: ${sessions.length}

tags: ${JSON.stringify(tags)}
---

# Batch Brewing Session - ${currentDate}

**Bean**: ${beanName || "Select bean"}
**Total Sessions**: ${sessions.length}

---

## Session Overview

| Session | Method | Parameters | Rating | Notes |
|---------|--------|------------|--------|-------|
`;

sessions.forEach((session, idx) => {
  output += `| ${idx + 1} |  |  |  |  |\n`;
});

output += `\n---\n\n`;

sessions.forEach((session, idx) => {
  output += `## Session ${idx + 1}\n\n`;
  output += `**Date/Time**: ${currentDate} \n`;
  output += `**Method**: \n`;
  output += `**Dose**: g | **Water**: g | **Temp**: °C\n`;
  output += `**Grind**: \n\n`;
  output += `### Parameters\n`;
  output += `- Dose: g\n`;
  output += `- Water: g\n`;
  output += `- Ratio: \n`;
  output += `- Temperature: °C\n`;
  output += `- Grind Size: \n`;
  output += `- Brew Time: \n\n`;
  output += `### Results\n`;
  output += `- Rating: /5\n`;
  output += `- Descriptors: \n`;
  output += `- Notes: \n\n`;
  output += `---\n\n`;
});

output += `## Comparative Analysis\n\n`;
output += `**Best Session**: \n`;
output += `**Key Differences**: \n`;
output += `**Learning**: \n\n`;
output += `## Overall Notes\n\n`;

return output;
%>

