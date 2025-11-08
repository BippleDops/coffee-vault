---
type: processing-playbook
playbook-name: <% tp.system.prompt("Processing experiment name") %>
playbook-id: <% tp.date.now("YYYYMMDDHHmmss") %>-<% Math.random().toString(36).substring(2, 8) %>
date: <% tp.date.now("YYYY-MM-DD") %>

# Experiment Overview
experiment-type: <% tp.system.suggester(["Fermentation trial", "Drying method", "Processing comparison", "Time variation", "Temperature study", "Microbial inoculation", "Hybrid process", "Full protocol", "Single variable"], ["fermentation-trial", "drying-method", "processing-comparison", "time-variation", "temperature-study", "microbial-inoculation", "hybrid-process", "full-protocol", "single-variable"]) %>

processing-method: <% tp.system.suggester(["Natural", "Washed", "Honey", "Wet-hulled", "Anaerobic", "Carbonic maceration", "Extended fermentation", "Double fermentation", "Experimental", "Hybrid"], ["natural", "washed", "honey", "wet-hulled", "anaerobic", "carbonic-maceration", "extended-fermentation", "double-fermentation", "experimental", "hybrid"]) %>

objective: <% tp.system.prompt("Primary objective/question") %>
# What are you trying to achieve or learn?

hypothesis: ""
# What outcome do you expect?

# Coffee Details
coffee-origin: <% tp.system.suggester(["Ethiopia", "Colombia", "Kenya", "Guatemala", "Brazil", "Costa Rica", "Panama", "Rwanda", "Burundi", "Indonesia", "Honduras", "Other"], ["Ethiopia", "Colombia", "Kenya", "Guatemala", "Brazil", "Costa Rica", "Panama", "Rwanda", "Burundi", "Indonesia", "Honduras", "Other"]) %>
varietal: <% tp.system.prompt("Coffee varietal(s)", "Bourbon") %>
harvest-date: <% tp.system.prompt("Harvest date (YYYY-MM)", tp.date.now("YYYY-MM")) %>
harvest-season: <% tp.system.suggester(["Main crop", "Fly crop", "Early", "Late", "Peak"], ["main", "fly", "early", "late", "peak"]) %>

cherry-quality: <% tp.system.suggester(["Excellent", "Good", "Fair", "Mixed"], ["excellent", "good", "fair", "mixed"]) %>
cherry-ripeness: <% tp.system.prompt("Ripeness distribution (%)", "90% ripe, 10% over-ripe") %>
defect-rate: <% tp.system.prompt("Estimated defect rate (%)", "< 1") %>

# Processing Location
farm-producer: [[<% tp.system.prompt("Farm/Producer name (optional)", "") %>]]
processing-station: <% tp.system.prompt("Processing station/mill name", "") %>
location-altitude: <% tp.system.prompt("Altitude (masl)", "") %>
location-region: <% tp.system.prompt("Region", "") %>

# Environmental Conditions
ambient-temperature:
  daytime-avg: <% tp.system.prompt("Daytime temperature (°C)", "28") %>
  nighttime-avg: <% tp.system.prompt("Nighttime temperature (°C)", "18") %>
  range: ""
# Temperature during processing period

ambient-humidity:
  avg: <% tp.system.prompt("Average humidity (%)", "65") %>
  range: ""
# Relative humidity during processing

altitude: <% tp.system.prompt("Processing altitude (masl)", "1600") %>
weather-conditions: <% tp.system.suggester(["Sunny", "Partly cloudy", "Rainy", "Variable", "Dry season", "Wet season"], ["sunny", "partly-cloudy", "rainy", "variable", "dry-season", "wet-season"]) %>

# Fermentation Parameters
fermentation:
  method: <% tp.system.suggester(["Aerobic", "Anaerobic", "Semi-aerobic", "Submerged", "Dry fermentation", "Mixed"], ["aerobic", "anaerobic", "semi-aerobic", "submerged", "dry-fermentation", "mixed"]) %>
  duration: <% tp.system.prompt("Fermentation duration (hours)", "48") %>
  temperature: <% tp.system.prompt("Fermentation temperature (°C)", "22") %>
  temperature-control: <% tp.system.suggester(["None", "Controlled", "Monitored", "Ambient"], ["none", "controlled", "monitored", "ambient"]) %>
  vessel-type: <% tp.system.prompt("Vessel type (tank, barrel, bag, etc.)", "Sealed tank") %>
  vessel-material: <% tp.system.prompt("Vessel material", "Food-grade plastic") %>
  pH-start: <% tp.system.prompt("Initial pH (optional)", "") %>
  pH-end: <% tp.system.prompt("Final pH (optional)", "") %>
  brix-start: <% tp.system.prompt("Initial Brix (optional)", "") %>
  brix-end: <% tp.system.prompt("Final Brix (optional)", "") %>

# Microbial Additions (if applicable)
microbial-inoculation:
  used: <% tp.system.suggester(["Yes", "No"], [true, false]) %>
  strain: ""
  concentration: ""
  timing: ""

# Drying Parameters
drying:
  method: <% tp.system.suggester(["Sun-dried", "Shade-dried", "Raised beds", "Patio", "Mechanical", "Greenhouse", "Hybrid"], ["sun-dried", "shade-dried", "raised-beds", "patio", "mechanical", "greenhouse", "hybrid"]) %>
  surface-type: <% tp.system.prompt("Drying surface", "Raised African beds") %>
  layer-thickness: <% tp.system.prompt("Layer thickness (cm)", "3-4") %>
  total-duration: <% tp.system.prompt("Total drying time (days)", "18") %>
  turning-frequency: <% tp.system.prompt("Turning frequency", "Every 2 hours") %>
  covered-at-night: <% tp.system.suggester(["Yes", "No"], [true, false]) %>
  covered-during-rain: <% tp.system.suggester(["Yes", "No"], [true, false]) %>
  final-moisture-content: <% tp.system.prompt("Final moisture content (%)", "10.5") %>
  moisture-measurement-method: <% tp.system.prompt("Moisture measurement", "Electronic meter") %>

# Drying Curve (moisture over time)
drying-curve: []
# Format: [{day: 1, moisture: 55}, {day: 5, moisture: 35}, {day: 10, moisture: 18}]

# Washing/Hulling (if applicable)
washing:
  pre-fermentation-soak: <% tp.system.suggester(["Yes", "No"], [true, false]) %>
  soak-duration: ""
  wash-cycles: <% tp.system.prompt("Number of wash cycles (if washed)", "3") %>
  water-quality: <% tp.system.prompt("Water source/quality", "Clean spring water") %>
  flotation-separation: <% tp.system.suggester(["Yes", "No"], [true, false]) %>

# Quality Control During Processing
quality-monitoring:
  visual-inspection-frequency: <% tp.system.prompt("Visual inspection schedule", "Twice daily") %>
  temperature-monitoring: <% tp.system.suggester(["Continuous", "Regular intervals", "Occasional", "None"], ["continuous", "regular", "occasional", "none"]) %>
  sampling-protocol: ""
  defect-removal: <% tp.system.suggester(["Before fermentation", "During drying", "Post-drying", "Multiple stages"], ["pre-fermentation", "during-drying", "post-drying", "multiple-stages"]) %>

# Post-Drying
resting-period: <% tp.system.prompt("Resting period (days)", "30") %>
storage-conditions: <% tp.system.prompt("Storage conditions", "Cool, dry, grain-pro bags") %>

# Control/Comparison Batch
control-batch:
  exists: <% tp.system.suggester(["Yes", "No"], [true, false]) %>
  processing-method: ""
  batch-id: ""
# Reference batch for comparison

# Results & Outcomes
results:
  green-bean-quality:
    appearance: ""
    moisture-content: ""
    water-activity: ""
    defect-count: ""
    screen-size: ""
  roasted-bean-quality:
    roast-level: ""
    roast-date: ""
    development-time: ""
    first-crack-temp: ""
  cupping-score: <% tp.system.prompt("Cupping score (if evaluated)", "") %>
  cupping-notes: []
  sensory-profile:
    acidity: ""
    body: ""
    sweetness: ""
    flavor-notes: []
    aftertaste: ""
    balance: ""
  overall-quality: <% tp.system.suggester(["Excellent", "Very good", "Good", "Fair", "Poor"], ["excellent", "very-good", "good", "fair", "poor"]) %>

# Economic Analysis
cost-analysis:
  labor-hours: <% tp.system.prompt("Total labor hours", "") %>
  infrastructure-cost: ""
  variable-costs: ""
  time-investment: ""
  yield-efficiency: ""
# Cost per kg or total cost

# Status & Tracking
status: <% tp.system.suggester(["planned", "in-progress", "processing-complete", "drying-complete", "resting", "roasted", "evaluated", "completed", "archived"], ["planned", "in-progress", "processing-complete", "drying-complete", "resting", "roasted", "evaluated", "completed", "archived"]) %>
success-rating: <% tp.system.prompt("Success rating (1-5)", "4") %>
would-repeat: <% tp.system.suggester(["Yes", "With modifications", "No"], ["yes", "with-modifications", "no"]) %>

# Relationships
relationships:
  source-beans: [[<% tp.system.prompt("Bean profile link (optional)", "") %>]]
  producer: [[<% tp.frontmatter["farm-producer"] %>]]
  related-experiments: []
  cupping-sessions: []
  scientific-references: []
  coffee-logs: []

# Metadata
tags: [processing-playbook, <% tp.frontmatter["processing-method"] %>, <% tp.frontmatter["coffee-origin"].toLowerCase() %>, <% tp.frontmatter["experiment-type"] %>, <% tp.date.now("YYYY-MM") %>]
priority: <% tp.system.suggester(["high", "medium", "low"], ["high", "medium", "low"]) %>

---

# 🧪 Processing Playbook: <% tp.frontmatter["playbook-name"] %>

**Method**: <% tp.frontmatter["processing-method"] %>
**Type**: <% tp.frontmatter["experiment-type"] %>
**Status**: <% tp.frontmatter.status %>
**Date**: <% tp.frontmatter.date %>
**Success Rating**: <% "⭐".repeat(Math.floor(parseFloat(tp.frontmatter["success-rating"] || 0))) %> (<% tp.frontmatter["success-rating"] || "N/A" %>/5)

---

## 🎯 Experiment Design

### Objective
<% tp.frontmatter.objective %>

### Hypothesis
<% tp.frontmatter.hypothesis || "_State your expected outcome_" %>

### Variables Being Tested
**Independent Variables** (what you're changing):
-

**Dependent Variables** (what you're measuring):
-

**Controlled Variables** (keeping constant):
-

<% tp.file.cursor() %>

---

## ☕ Coffee Source Information

**Origin**: <% tp.frontmatter["coffee-origin"] %>
**Region**: <% tp.frontmatter["location-region"] %>
**Varietal**: <% tp.frontmatter.varietal %>
**Farm/Producer**: <% tp.frontmatter["farm-producer"] || "Not specified" %>

**Harvest Details**:
- **Harvest Date**: <% tp.frontmatter["harvest-date"] %>
- **Harvest Season**: <% tp.frontmatter["harvest-season"] %>
- **Altitude**: <% tp.frontmatter["location-altitude"] %> masl

**Cherry Quality Assessment**:
- **Overall Quality**: <% tp.frontmatter["cherry-quality"] %>
- **Ripeness**: <% tp.frontmatter["cherry-ripeness"] %>
- **Defect Rate**: <% tp.frontmatter["defect-rate"] %>%

**Batch Size**: ___ kg cherry / ___ kg parchment / ___ kg green

---

## 🌡️ Environmental Conditions

**Processing Location**: <% tp.frontmatter["processing-station"] %>
**Altitude**: <% tp.frontmatter.altitude %> masl
**Weather**: <% tp.frontmatter["weather-conditions"] %>

**Temperature**:
- Daytime average: <% tp.frontmatter["ambient-temperature"]["daytime-avg"] %>°C
- Nighttime average: <% tp.frontmatter["ambient-temperature"]["nighttime-avg"] %>°C
- Range: <% tp.frontmatter["ambient-temperature"]["range"] || "±3°C" %>

**Humidity**:
- Average: <% tp.frontmatter["ambient-humidity"]["avg"] %>%
- Range: <% tp.frontmatter["ambient-humidity"]["range"] || "50-75%" %>

**Climate Notes**:


---

## 🔬 Processing Protocol

### Phase 1: Reception & Preparation

**Date Started**: <% tp.system.prompt("Start date", tp.date.now("YYYY-MM-DD")) %>
**Cherry Reception Time**: <% tp.system.prompt("Reception time", "08:00") %>
**Time Since Harvest**: ___ hours

**Initial Processing**:
- [ ] Visual inspection completed
- [ ] Floaters removed
- [ ] Unripe cherries sorted
- [ ] Damaged cherries removed
- [ ] Initial weight recorded: ___ kg

**Sorting Criteria**:


---

### Phase 2: Fermentation

<%* if (tp.frontmatter.fermentation) { %>
**Fermentation Method**: <% tp.frontmatter.fermentation.method %>
**Duration**: <% tp.frontmatter.fermentation.duration %> hours
**Temperature**: <% tp.frontmatter.fermentation.temperature %>°C
**Temperature Control**: <% tp.frontmatter.fermentation["temperature-control"] %>

**Fermentation Vessel**:
- **Type**: <% tp.frontmatter.fermentation["vessel-type"] %>
- **Material**: <% tp.frontmatter.fermentation["vessel-material"] %>
- **Volume**: ___ liters
- **Fill Level**: ___%

**Chemical Parameters**:
| Measurement | Start | Middle | End | Target |
|-------------|-------|--------|-----|--------|
| pH          | <% tp.frontmatter.fermentation["pH-start"] || "" %> | | <% tp.frontmatter.fermentation["pH-end"] || "" %> | 4.5-5.0 |
| Brix        | <% tp.frontmatter.fermentation["brix-start"] || "" %> | | <% tp.frontmatter.fermentation["brix-end"] || "" %> | |
| Temperature | | | | |

<%* if (tp.frontmatter["microbial-inoculation"] && tp.frontmatter["microbial-inoculation"].used) { %>
**Microbial Inoculation**:
- **Strain**: <% tp.frontmatter["microbial-inoculation"].strain %>
- **Concentration**: <% tp.frontmatter["microbial-inoculation"].concentration %>
- **Timing**: <% tp.frontmatter["microbial-inoculation"].timing %>
<%* } %>

**Fermentation Timeline**:

| Hour | Temp (°C) | pH | Observation | Action Taken |
|------|-----------|----|--------------|--------------|
| 0    |           |    | Start        |              |
| 12   |           |    |              |              |
| 24   |           |    |              |              |
| 36   |           |    |              |              |
| 48   |           |    |              |              |
|      |           |    | End          |              |

**Sensory Checks During Fermentation**:
- **Hour 0** (start): Aroma: ___
- **Hour 24**: Aroma: ___ / Mucilage texture: ___
- **Hour 48** (end): Aroma: ___ / Mucilage texture: ___

**Fermentation Endpoint Criteria**:
- [ ] Target time reached
- [ ] Mucilage fully broken down
- [ ] Desired pH achieved
- [ ] Sensory markers present
- [ ] No off-odors detected

**Fermentation Notes**:


<%* } else { %>
**No fermentation stage** (e.g., natural process may skip active fermentation)
<%* } %>

---

### Phase 3: Washing (if applicable)

<%* if (tp.frontmatter.washing && tp.frontmatter["processing-method"] !== "natural") { %>
**Pre-fermentation Soak**: <% tp.frontmatter.washing["pre-fermentation-soak"] ? "Yes" : "No" %>
<%* if (tp.frontmatter.washing["pre-fermentation-soak"]) { %>
- Duration: <% tp.frontmatter.washing["soak-duration"] %>
<%* } %>

**Washing Protocol**:
- **Number of Cycles**: <% tp.frontmatter.washing["wash-cycles"] %>
- **Water Quality**: <% tp.frontmatter.washing["water-quality"] %>
- **Water Temperature**: ___ °C
- **Flotation Separation**: <% tp.frontmatter.washing["flotation-separation"] ? "Yes" : "No" %>

**Wash Cycle Details**:
| Cycle | Duration | Agitation | Water Exchange | Floaters Removed |
|-------|----------|-----------|----------------|------------------|
| 1     |          |           |                |                  |
| 2     |          |           |                |                  |
| 3     |          |           |                |                  |

**Washing Endpoint**:
- [ ] Water runs clear
- [ ] No mucilage remaining
- [ ] Parchment feels clean
- [ ] Specific gravity check passed

<%* } else { %>
**No washing stage** (natural/dry process)
<%* } %>

---

### Phase 4: Drying

**Drying Method**: <% tp.frontmatter.drying.method %>
**Surface Type**: <% tp.frontmatter.drying["surface-type"] %>
**Layer Thickness**: <% tp.frontmatter.drying["layer-thickness"] %> cm
**Covered at Night**: <% tp.frontmatter.drying["covered-at-night"] ? "Yes" : "No" %>
**Covered During Rain**: <% tp.frontmatter.drying["covered-during-rain"] ? "Yes" : "No" %>

**Drying Schedule**:
- **Start Date**: ___
- **End Date**: ___
- **Total Duration**: <% tp.frontmatter.drying["total-duration"] %> days
- **Turning Frequency**: <% tp.frontmatter.drying["turning-frequency"] %>

**Drying Curve** (Moisture Content Over Time):

| Day | Moisture % | Temp (°C) | Humidity % | Weather | Turning Count | Notes |
|-----|------------|-----------|------------|---------|---------------|-------|
| 0   | ~55%       |           |            |         | 0             | Start |
| 1   |            |           |            |         |               |       |
| 3   |            |           |            |         |               |       |
| 5   |            |           |            |         |               |       |
| 7   |            |           |            |         |               |       |
| 10  |            |           |            |         |               |       |
| 14  |            |           |            |         |               |       |
| 18  | ~10.5%     |           |            |         |               | End   |

**Target Moisture**: <% tp.frontmatter.drying["final-moisture-content"] %>%
**Measurement Method**: <% tp.frontmatter.drying["moisture-measurement-method"] %>

**Drying Observations**:
- **Early Stage** (Days 1-5):

- **Middle Stage** (Days 6-12):

- **Final Stage** (Days 13+):


**Challenges Encountered**:
- [ ] Rain delays
- [ ] Uneven drying
- [ ] Overheating
- [ ] Mold/defects
- [ ] Other: ___

---

### Phase 5: Post-Drying & Storage

**Resting Period**: <% tp.frontmatter["resting-period"] %> days
**Storage Location**: ___
**Storage Conditions**: <% tp.frontmatter["storage-conditions"] %>

**Final Parchment Weight**: ___ kg
**Yield Calculation**:
- Cherry to parchment ratio: 1 : ___
- Cherry to green ratio: 1 : ___

**Storage Monitoring**:
| Week | Moisture % | Condition | Water Activity | Notes |
|------|------------|-----------|----------------|-------|
| 1    |            |           |                |       |
| 2    |            |           |                |       |
| 4    |            |           |                |       |

---

## 🎛️ Quality Control & Monitoring

**Inspection Frequency**: <% tp.frontmatter["quality-monitoring"]["visual-inspection-frequency"] %>
**Temperature Monitoring**: <% tp.frontmatter["quality-monitoring"]["temperature-monitoring"] %>
**Defect Removal**: <% tp.frontmatter["quality-monitoring"]["defect-removal"] %>

### Quality Checkpoints

**During Fermentation**:
- [ ] No off-odors developing
- [ ] Temperature in range
- [ ] pH tracking as expected
- [ ] No contamination visible

**During Drying**:
- [ ] Drying evenly
- [ ] No mold formation
- [ ] Turning on schedule
- [ ] Moisture reducing steadily

**Post-Drying**:
- [ ] Target moisture achieved
- [ ] Uniform appearance
- [ ] No visible defects
- [ ] Proper storage conditions

### Defects Monitoring

| Defect Type | Count per 350g | Severity | Cause | Prevention |
|-------------|----------------|----------|-------|------------|
|             |                |          |       |            |

---

## 🔬 Control Batch Comparison

<%* if (tp.frontmatter["control-batch"] && tp.frontmatter["control-batch"].exists) { %>
**Control Method**: <% tp.frontmatter["control-batch"]["processing-method"] %>
**Batch ID**: <% tp.frontmatter["control-batch"]["batch-id"] %>

**Side-by-Side Comparison**:

| Parameter | Experimental | Control | Difference |
|-----------|--------------|---------|------------|
| Processing Method | <% tp.frontmatter["processing-method"] %> | <% tp.frontmatter["control-batch"]["processing-method"] %> | |
| Fermentation Time | | | |
| Drying Time | | | |
| Final Moisture | | | |
| Cupping Score | | | |
| Overall Quality | | | |

<%* } else { %>
**No control batch** - single experimental lot
<%* } %>

---

## 📊 Results & Evaluation

### Green Bean Analysis

**Physical Characteristics**:
- **Appearance**: <% tp.frontmatter.results["green-bean-quality"].appearance %>
- **Moisture Content**: <% tp.frontmatter.results["green-bean-quality"]["moisture-content"] %>%
- **Water Activity**: <% tp.frontmatter.results["green-bean-quality"]["water-activity"] %>
- **Screen Size**: <% tp.frontmatter.results["green-bean-quality"]["screen-size"] %>
- **Defect Count**: <% tp.frontmatter.results["green-bean-quality"]["defect-count"] %> per 350g

**Green Bean Grading**: ___ (SCA or local standard)

### Roasting Profile

<%* if (tp.frontmatter.results["roasted-bean-quality"]) { %>
**Roast Date**: <% tp.frontmatter.results["roasted-bean-quality"]["roast-date"] %>
**Roast Level**: <% tp.frontmatter.results["roasted-bean-quality"]["roast-level"] %>
**Development Time**: <% tp.frontmatter.results["roasted-bean-quality"]["development-time"] %>
**First Crack**: <% tp.frontmatter.results["roasted-bean-quality"]["first-crack-temp"] %>°C

**Roasting Behavior**:


**Roast Development Notes**:

<%* } %>

### Sensory Evaluation

**Cupping Score**: <% tp.frontmatter.results["cupping-score"] %>/100
<%* if (tp.frontmatter.results["sensory-profile"]) { %>
**Sensory Profile**:
- **Acidity**: <% tp.frontmatter.results["sensory-profile"].acidity %> /10
- **Body**: <% tp.frontmatter.results["sensory-profile"].body %> /10
- **Sweetness**: <% tp.frontmatter.results["sensory-profile"].sweetness %> /10
- **Balance**: <% tp.frontmatter.results["sensory-profile"].balance %> /10
- **Aftertaste**: <% tp.frontmatter.results["sensory-profile"].aftertaste %> /10

**Flavor Notes**:
<%* if (tp.frontmatter.results["sensory-profile"]["flavor-notes"] && tp.frontmatter.results["sensory-profile"]["flavor-notes"].length > 0) { %>
<% tp.frontmatter.results["sensory-profile"]["flavor-notes"].map(note => "- " + note).join("\n") %>
<%* } %>
<%* } %>

**Cupping Notes**: <% tp.frontmatter.results["cupping-notes"].join(", ") || "_Add cupping notes_" %>

**Overall Quality Assessment**: <% tp.frontmatter.results["overall-quality"] %>

### Defects & Issues

**Primary Defects**: (Category 1)


**Secondary Defects**: (Category 2)


**Processing-Related Issues**:


---

## 💰 Economic Analysis

<%* if (tp.frontmatter["cost-analysis"]) { %>
**Labor Requirements**:
- **Total Hours**: <% tp.frontmatter["cost-analysis"]["labor-hours"] %>
- **Cost per Hour**: $___
- **Total Labor Cost**: $___

**Infrastructure Costs**:
<% tp.frontmatter["cost-analysis"]["infrastructure-cost"] || "_Calculate infrastructure costs_" %>

**Variable Costs**:
<% tp.frontmatter["cost-analysis"]["variable-costs"] || "_Calculate variable costs (water, energy, materials)_" %>

**Total Processing Cost**: $___
**Cost per kg Green**: $___ /kg

**Yield Efficiency**: <% tp.frontmatter["cost-analysis"]["yield-efficiency"] || "___ %" %>

**Scalability Analysis**:


**Return on Investment**:


<%* } %>

---

## 🔍 Analysis & Insights

### What Worked Well

**Successes**:
1.
2.
3.

**Positive Surprises**:


### Challenges & Problems

**Issues Encountered**:
1.
2.
3.

**Root Causes**:


### Key Learnings

**Technical Insights**:


**Process Improvements Identified**:


**Scientific Observations**:


---

## 🔄 Recommendations & Next Steps

### Would You Repeat This Process?
**Decision**: <% tp.frontmatter["would-repeat"] %>

**Reasoning**:


### Suggested Modifications

**For Next Trial**:
1.
2.
3.

**Parameters to Adjust**:


**New Questions to Explore**:


### Scaling Considerations

**Scalability**: ___ (Low/Medium/High)

**Requirements for Scaling**:
-

**Potential Challenges**:
-

---

## 📚 Scientific Context

### Related Research

**Relevant Studies**:
<%* if (tp.frontmatter.relationships && tp.frontmatter.relationships["scientific-references"] && tp.frontmatter.relationships["scientific-references"].length > 0) { %>
<% tp.frontmatter.relationships["scientific-references"].join("\n") %>
<%* } %>


**Theoretical Background**:


### Chemical/Biological Processes

**Fermentation Chemistry**:


**Microbial Activity**:


**Enzymatic Reactions**:


**Flavor Development Mechanisms**:


---

## 📸 Documentation

**Process Photos**:
- [ ] Cherry reception
- [ ] Fermentation vessel setup
- [ ] Fermentation progress
- [ ] Washing stages
- [ ] Drying bed layout
- [ ] Drying progress (weekly)
- [ ] Final parchment
- [ ] Green beans
- [ ] Roasted samples

**Videos**:
- [ ] Fermentation stirring
- [ ] Washing process
- [ ] Drying turning technique

**Data Files**:
- [ ] Temperature logs
- [ ] pH measurements
- [ ] Moisture readings
- [ ] Cupping forms

---

## 🔗 Related Content

### Related Experiments
```dataview
TABLE date as "Date", processing-method as "Method", cupping-score as "Score", status as "Status"
FROM "Processing Playbooks"
WHERE file.name != this.file.name AND (contains(coffee-origin, "<% tp.frontmatter["coffee-origin"] %>") OR contains(processing-method, "<% tp.frontmatter["processing-method"] %>"))
SORT date DESC
```

### Related Cupping Sessions
```dataview
TABLE date as "Date", protocol as "Protocol", session-type as "Type"
FROM "Cupping Sessions"
WHERE contains(file.outlinks, [[<% tp.file.title %>]])
SORT date DESC
```

### Coffee Logs Using These Beans
```dataview
TABLE date as "Date", brew-method as "Method", rating as "Rating"
FROM "Coffee Logs"
WHERE contains(beans, "<% tp.frontmatter["playbook-name"] %>")
SORT date DESC
```

---

## 📝 Processing Log Notes

**Daily Observations**:


**Unexpected Events**:


**Communication with Producer**:


**Lessons for Future Processing**:


---

**Tags**: <% (tp.frontmatter.tags || []).join(", ") %>
**Priority**: <% tp.frontmatter.priority %>
**Success Rating**: <% tp.frontmatter["success-rating"] %>/5
**Would Repeat**: <% tp.frontmatter["would-repeat"] %>

---

*Coffee Vault - Processing Playbook Template*
*Document, analyze, and optimize post-harvest processing methods*
