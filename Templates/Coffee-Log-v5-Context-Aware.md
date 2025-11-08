---
<%*
# ============================================
# TEMPLATE: Coffee Log v5.0 - Context-Aware
# VERSION: 5.0.0
# PURPOSE: Intelligent coffee logging with context awareness
# FEATURES: Context detection, ML suggestions, photo integration
# ============================================

# ============================================
# SECTION 1: Configuration and Imports
# ============================================

const currentDate = tp.file.creation_date("YYYY-MM-DD");
const currentTime = tp.file.creation_date("HH:mm");
const currentHour = parseInt(currentTime.split(':')[0]);
const currentDay = new Date().getDay();

# Load ML models and utilities
const ml = await tp.user.require("Scripts/advanced-ml-models.js").catch(() => null);
const stats = await tp.user.require("Scripts/stats-utils.js").catch(() => null);
const tagInference = await tp.user.require("Scripts/tag-inference.js").catch(() => null);

# ============================================
# SECTION 2: Context Detection
# ============================================

function detectTimeOfDay(hour) {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

function detectWeather() {
  # Would integrate with weather API in production
  # For now, prompt user
  return null; // Will prompt user
}

function detectCurrentBean() {
  const beans = dv.pages('"Beans Library"')
    .where(p => p.type === "bean-profile" && p["is-current"])
    .array();
  
  if (beans.length > 0) {
    return beans[0];
  }
  
  # Find most recent bean
  const recentBeans = dv.pages('"Beans Library"')
    .where(p => p.type === "bean-profile")
    .sort(p => p.date, 'desc')
    .limit(1)
    .array();
  
  return recentBeans.length > 0 ? recentBeans[0] : null;
}

function getContextualSuggestions(bean, timeOfDay, weather, physiologicalState) {
  if (!bean || !ml) return null;
  
  const context = {
    bean: bean,
    timeOfDay: timeOfDay,
    weather: weather,
    physiologicalState: physiologicalState
  };
  
  const historicalData = dv.pages('"Coffee Logs"')
    .where(p => p.type === "coffee-log")
    .array();
  
  const predictor = new ml.EnhancedParameterPredictor();
  return predictor.predict(context, historicalData);
}

# ============================================
# SECTION 3: Auto-Generated Values
# ============================================

const timeOfDay = detectTimeOfDay(currentHour);
const currentBean = detectCurrentBean();
const beanName = currentBean ? currentBean.name : "";
const beanOrigin = currentBean ? currentBean.origin : "";
const beanRoastLevel = currentBean ? currentBean["roast-level"] : "";
const beanProcessing = currentBean ? currentBean.processing : "";

# Get suggestions if available
const suggestions = currentBean ? getContextualSuggestions(
  currentBean,
  timeOfDay,
  null, // Weather - would be detected
  null  // Physiological - would be detected
) : null;

# ============================================
# SECTION 4: Generate Frontmatter
# ============================================

const frontmatter = {
  type: "coffee-log",
  date: currentDate,
  beans: beanName || "",
  "brew-method": "",
  rating: "",
  
  # Context (Coffee Vault 5.0)
  "time-of-day": timeOfDay,
  "weather-condition": null, // Will prompt
  "ambient-temperature": null,
  "ambient-humidity": null,
  
  # Physiological Context (Coffee Vault 5.0)
  "energy-level": "",
  "hydration-level": "",
  "sleep-hours-previous": null,
  "meal-timing": "",
  
  # Suggested Parameters (if available)
  dose: suggestions ? Math.round(suggestions.dose) : null,
  water: suggestions ? Math.round(suggestions.water) : null,
  "water-temperature": suggestions ? Math.round(suggestions.temperature) : null,
  "grind-size": suggestions ? suggestions.grindSize : "",
  
  # Metadata
  "session-number": null,
  "days-off-roast": currentBean && currentBean["roast-date"] 
    ? Math.floor((new Date(currentDate) - new Date(currentBean["roast-date"])) / (1000 * 60 * 60 * 24))
    : null,
  
  # Media (Coffee Vault 5.0)
  "photo-links": [],
  "video-link": null,
  "audio-notes-link": null,
  
  tags: []
};

# Generate tags
if (tagInference) {
  const inferredTags = tagInference.inferTags(frontmatter);
  frontmatter.tags = tagInference.mergeTags(frontmatter.tags, inferredTags);
}

# ============================================
# SECTION 5: Template Output
# ============================================

let output = `---
type: ${frontmatter.type}
date: ${frontmatter.date}
beans: ${frontmatter.beans}
brew-method: ${frontmatter["brew-method"]}
rating: ${frontmatter.rating}

# Context (Coffee Vault 5.0)
time-of-day: ${frontmatter["time-of-day"]}
weather-condition: ${frontmatter["weather-condition"] || ""}
ambient-temperature: ${frontmatter["ambient-temperature"] || ""}
ambient-humidity: ${frontmatter["ambient-humidity"] || ""}

# Physiological Context
energy-level: ${frontmatter["energy-level"]}
hydration-level: ${frontmatter["hydration-level"]}
sleep-hours-previous: ${frontmatter["sleep-hours-previous"] || ""}
meal-timing: ${frontmatter["meal-timing"]}

# Parameters`;
if (suggestions) {
  output += `\n# Suggested: ${suggestions.reasoning || "Based on similar successful brews"}`;
}
output += `
dose: ${frontmatter.dose || ""}
water: ${frontmatter.water || ""}
brew-ratio: ${suggestions ? `1:${(frontmatter.water / frontmatter.dose).toFixed(1)}` : ""}
water-temperature: ${frontmatter["water-temperature"] || ""}
grind-size: ${frontmatter["grind-size"]}

# Extraction & Quality
extraction-yield: 
tds-brewed: 
strength: 
rating-aroma: 
rating-flavor: 
rating-acidity: 
rating-body: 
rating-balance: 
rating-sweetness: 

# Sensory
descriptors: []
primary-flavor: 
secondary-flavors: []
acidity: 
acidity-type: 
body: 
body-texture: 
sweetness: 
bitterness: 
aftertaste: 
aftertaste-quality: 

# Precision Measurements (Coffee Vault 5.0)
extraction-mass: 
extraction-percentage-precise: 
first-drop-time: 
slurry-temperature: 
flow-rate: 
total-output-weight: 

# Media (Coffee Vault 5.0)
photo-links: []
setup-photo: 
process-photo: 
result-photo: 
video-link: 
audio-notes-link: 

# Notes
notes: 
adjustment-next: 
issues: 
highlights: 

# Metadata
session-number: ${frontmatter["session-number"] || ""}
days-off-roast: ${frontmatter["days-off-roast"] || ""}
is-favorite: false
is-dialed-in: false

tags: ${JSON.stringify(frontmatter.tags)}
---

# Coffee Log - ${currentDate}

## Quick Info

**Bean**: ${beanName || "Select bean"}
**Method**: ${frontmatter["brew-method"] || "Select method"}
**Time**: ${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}
${suggestions ? `**Confidence**: ${(suggestions.confidence * 100).toFixed(0)}%` : ""}

## Suggested Parameters`;

if (suggestions) {
  output += `\n\nBased on similar successful brews:\n\n`;
  output += `- **Dose**: ${suggestions.dose}g`;
  output += `- **Water**: ${suggestions.water}g`;
  output += `- **Ratio**: ${suggestions.ratio}`;
  output += `- **Temperature**: ${suggestions.temperature}°C`;
  output += `- **Grind**: ${suggestions.grindSize}`;
  output += `- **Brew Time**: ${suggestions.brewTime || "See method guide"}`;
  output += `\n\n**Reasoning**: ${suggestions.reasoning || "Based on similar successful brews"}`;
} else {
  output += `\n\n*No suggestions available. Fill in parameters manually.*`;
}

output += `\n\n## Bean Info`;

if (currentBean) {
  output += `\n\n**Origin**: ${beanOrigin}`;
  output += `\n**Roast Level**: ${beanRoastLevel}`;
  output += `\n**Processing**: ${beanProcessing}`;
  if (currentBean["roast-date"]) {
    output += `\n**Days Off Roast**: ${frontmatter["days-off-roast"]}`;
  }
} else {
  output += `\n\n*No current bean selected. Select a bean in the Beans Library to get suggestions.*`;
}

output += `\n\n## Brewing Session

### Setup
- **Equipment**: 
- **Grinder**: 
- **Grinder Setting**: 

### Process
- **Bloom Time**: 
- **Bloom Water**: 
- **Pour Count**: 
- **Pour Technique**: 
- **Agitation**: 

### Results
- **Total Output**: 
- **Brew Time**: 

## Sensory Notes

### Aroma
- 

### Taste
- 

### Aftertaste
- 

## Photos

${frontmatter["photo-links"].length > 0 
  ? frontmatter["photo-links"].map(p => `![](${p})`).join('\n')
  : "*Add photos: setup, process, result*"
}

## Notes

### What Worked Well
- 

### Issues Encountered
- 

### Adjustments for Next Time
- 

## Analysis

### Extraction Zone
- **Extraction Yield**: ${frontmatter["extraction-yield"] || "?"}%
- **TDS**: ${frontmatter["tds-brewed"] || "?"}

### Quality Assessment
- **Overall**: ${frontmatter.rating || "?"}/5
- **Aroma**: ${frontmatter["rating-aroma"] || "?"}/5
- **Flavor**: ${frontmatter["rating-flavor"] || "?"}/5
- **Balance**: ${frontmatter["rating-balance"] || "?"}/5

---

**Tags**: ${frontmatter.tags.join(', ')}

**Created**: ${currentDate} ${currentTime}`;

return output;
%>

