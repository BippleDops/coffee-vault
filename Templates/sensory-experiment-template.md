---
type: sensory-experiment
experiment-name: <% tp.system.prompt("Experiment name") %>
experiment-id: <% tp.date.now("YYYYMMDDHHmmss") %>-<% Math.random().toString(36).substring(2, 8) %>
date: <% tp.date.now("YYYY-MM-DD") %>
time: <% tp.date.now("HH:mm") %>

# Experiment Design
experiment-type: <% tp.system.suggester(["triangle-test", "duo-trio-test", "paired-comparison", "blind-tasting", "calibration-session", "threshold-test", "discrimination-test", "descriptive-analysis", "ranking-test"], ["triangle-test", "duo-trio-test", "paired-comparison", "blind-tasting", "calibration-session", "threshold-test", "discrimination-test", "descriptive-analysis", "ranking-test"]) %>
# triangle-test: Identify the different sample among 3 (2 identical, 1 different)
# duo-trio-test: Match unknown to one of two reference samples
# paired-comparison: Compare two samples on specific attribute
# blind-tasting: Identify samples without prior knowledge
# calibration-session: Align sensory perceptions with standards
# threshold-test: Determine detection/recognition limits
# discrimination-test: Detect differences between samples
# descriptive-analysis: Describe sensory characteristics in detail
# ranking-test: Order samples by intensity or preference

protocol: <% tp.system.suggester(["SCA", "COE", "CQI", "Custom", "ASTM-E679", "ISO-8586", "Informal"], ["SCA", "COE", "CQI", "custom", "ASTM-E679", "ISO-8586", "informal"]) %>

objective: <% tp.system.prompt("Primary objective of experiment") %>
# What specific sensory skill or perception are you testing/training?

hypothesis: ""
# What do you expect to learn or validate?

# Session Details
session-number: <% tp.system.prompt("Session number (if part of series)", "1") %>
is-part-of-series: <% tp.system.suggester(["Yes", "No"], [true, false]) %>
series-name: <% tp.system.prompt("Series name (if applicable)", "") %>
session-duration: <% tp.system.prompt("Duration (minutes)", "45") %>

# Participants
primary-taster: <% tp.system.prompt("Your name", "Self") %>
participant-count: <% tp.system.prompt("Number of participants", "1") %>
participants: []
# List additional participants if group session

experience-level: <% tp.system.suggester(["Beginner", "Intermediate", "Advanced", "Expert"], ["beginner", "intermediate", "advanced", "expert"]) %>

# Sample Configuration
sample-count: <% tp.system.prompt("Number of samples", "3") %>
sample-presentation: <% tp.system.suggester(["Blind", "Semi-blind", "Open", "Sequential", "Simultaneous"], ["blind", "semi-blind", "open", "sequential", "simultaneous"]) %>
sample-temperature: <% tp.system.prompt("Serving temperature (°C)", "70") %>
sample-coding: <% tp.system.suggester(["Three-digit random", "Letters", "Colors", "Sequential numbers", "Custom"], ["random-3digit", "letters", "colors", "sequential", "custom"]) %>

# Environmental Controls
location: <% tp.system.prompt("Location", "Home") %>
room-temperature: <% tp.system.prompt("Room temperature (°C)", "22") %>
room-humidity: <% tp.system.prompt("Humidity (%)", "50") %>
lighting: <% tp.system.suggester(["Natural", "White LED", "Warm light", "Controlled", "Daylight"], ["natural", "white-LED", "warm", "controlled", "daylight"]) %>
distractions-present: false
time-of-day: <% tp.system.suggester(["Morning", "Afternoon", "Evening"], ["morning", "afternoon", "evening"]) %>

# Palate Preparation
palate-cleansed: <% tp.system.suggester(["Yes", "No"], [true, false]) %>
cleansing-method: <% tp.system.suggester(["Water", "Plain crackers", "Sparkling water", "Nothing", "Custom"], ["water", "crackers", "sparkling-water", "none", "custom"]) %>
time-since-last-meal: <% tp.system.prompt("Hours since last meal", "2") %>
time-since-last-coffee: <% tp.system.prompt("Hours since last coffee", "4") %>

# Status & Results
status: <% tp.system.suggester(["planned", "in-progress", "completed", "cancelled"], ["planned", "in-progress", "completed", "cancelled"]) %>
accuracy: 0
# Percentage of correct responses (calculated after experiment)

statistical-significance: ""
# p-value or confidence level (if calculated)

passed: ""
# Did results meet success criteria? (true/false/pending)

# Relationships
relationships:
  related-beans: []
  related-training-plan: [[<% tp.system.prompt("Training plan (optional)", "") %>]]
  scientific-references: []
  previous-session: [[<% tp.system.prompt("Previous session (optional)", "") %>]]
  next-session: [[<% tp.system.prompt("Next planned session (optional)", "") %>]]

# Metadata
tags: [sensory-experiment, <% tp.frontmatter["experiment-type"] %>, <% tp.frontmatter["experience-level"] %>, <% tp.date.now("YYYY-MM") %>]
priority: <% tp.system.suggester(["high", "medium", "low"], ["high", "medium", "low"]) %>

---

# 🔬 Sensory Experiment: <% tp.frontmatter["experiment-name"] %>

**Type**: <% tp.frontmatter["experiment-type"] %>
**Protocol**: <% tp.frontmatter.protocol %>
**Date**: <% tp.frontmatter.date %> at <% tp.frontmatter.time %>
**Status**: <% tp.frontmatter.status %>
**ID**: `<% tp.frontmatter["experiment-id"] %>`

<%* if (tp.frontmatter["is-part-of-series"]) { %>
**Series**: <% tp.frontmatter["series-name"] %> (Session #<% tp.frontmatter["session-number"] %>)
<%* } %>

---

## 🎯 Experiment Design

### Objective
<% tp.frontmatter.objective %>

### Hypothesis
<% tp.frontmatter.hypothesis || "_State your expected outcome or what you're testing_" %>

### Success Criteria
<%* if (tp.frontmatter["experiment-type"] === "triangle-test") { %>
**Triangle Test**: Correctly identify the different sample in ≥ 7 out of 10 trials (70% accuracy)
- Random guessing success rate: 33.3%
- Statistical significance at α=0.05 requires 7+ correct responses
<%* } else if (tp.frontmatter["experiment-type"] === "calibration-session") { %>
**Calibration**: Align perception with reference standards within acceptable range
- Goal: Identify all reference standards correctly
- Secondary: Describe attributes using standardized vocabulary
<%* } else if (tp.frontmatter["experiment-type"] === "threshold-test") { %>
**Threshold Test**: Determine minimum detectable concentration
- Detection threshold: Can you sense something?
- Recognition threshold: Can you identify what it is?
<%* } else { %>
**Success Metric**: <% tp.system.prompt("Define success metric", "Define your success criteria here") %>
<%* } %>

---

## 👥 Session Information

**Primary Taster**: <% tp.frontmatter["primary-taster"] %>
**Experience Level**: <% tp.frontmatter["experience-level"] %>
**Participants**: <% tp.frontmatter["participant-count"] %>
<%* if (tp.frontmatter.participants && tp.frontmatter.participants.length > 0) { %>
- <% tp.frontmatter.participants.join("\n- ") %>
<%* } %>

**Duration**: <% tp.frontmatter["session-duration"] %> minutes
**Time of Day**: <% tp.frontmatter["time-of-day"] %>

---

## ☕ Sample Configuration

**Number of Samples**: <% tp.frontmatter["sample-count"] %>
**Presentation**: <% tp.frontmatter["sample-presentation"] %>
**Coding System**: <% tp.frontmatter["sample-coding"] %>
**Serving Temperature**: <% tp.frontmatter["sample-temperature"] %>°C

### Sample Details

<%* if (tp.frontmatter["experiment-type"] === "triangle-test") { %>
| Code | Sample Identity | Position | Actual Identity (Hidden) |
|------|----------------|----------|--------------------------|
| <% tp.system.prompt("Sample code 1", "173") %> | A | 1 | <% tp.system.prompt("True identity 1", "Sample A") %> |
| <% tp.system.prompt("Sample code 2", "524") %> | B | 2 | <% tp.system.prompt("True identity 2", "Sample A") %> |
| <% tp.system.prompt("Sample code 3", "891") %> | C | 3 | <% tp.system.prompt("True identity 3", "Sample B") %> |

**Triangle Configuration**:
- Two samples are identical: _______
- One sample is different: _______
- Odd sample is at position: _______
<%* } else { %>
| Code | Sample Label | True Identity | Preparation Notes |
|------|-------------|---------------|-------------------|
|      |             |               |                   |
|      |             |               |                   |
|      |             |               |                   |
<%* } %>

### Sample Preparation

**Brew Method**: <% tp.system.prompt("Brew method", "V60") %>
**Brew Parameters**:
- Dose: <% tp.system.prompt("Dose (g)", "18") %>g
- Water: <% tp.system.prompt("Water (g)", "300") %>g
- Ratio: 1:<% (parseFloat(tp.system.prompt("Water (g)", "300")) / parseFloat(tp.system.prompt("Dose (g)", "18"))).toFixed(1) %>
- Temperature: <% tp.system.prompt("Water temp (°C)", "93") %>°C
- Time: <% tp.system.prompt("Brew time", "2:45") %>

**Uniformity Checks**:
- [ ] All samples brewed identically
- [ ] Grind size consistent across samples
- [ ] Water temperature verified
- [ ] Timing recorded accurately
- [ ] Serving vessels identical

<% tp.file.cursor() %>

---

## 🌡️ Environmental Conditions

**Location**: <% tp.frontmatter.location %>
**Room Temperature**: <% tp.frontmatter["room-temperature"] %>°C
**Humidity**: <% tp.frontmatter["room-humidity"] %>%
**Lighting**: <% tp.frontmatter.lighting %>
**Distractions**: <% tp.frontmatter["distractions-present"] ? "Yes - note below" : "None" %>

### Palate Preparation

**Cleansed**: <% tp.frontmatter["palate-cleansed"] ? "Yes" : "No" %>
**Method**: <% tp.frontmatter["cleansing-method"] %>
**Time Since Last Meal**: <% tp.frontmatter["time-since-last-meal"] %> hours
**Time Since Last Coffee**: <% tp.frontmatter["time-since-last-coffee"] %> hours

**Personal State**:
- [ ] Well-rested
- [ ] Hydrated
- [ ] Calm and focused
- [ ] No illness affecting senses
- [ ] No strong flavors consumed recently

---

## 🧪 Experiment Protocol

<%* if (tp.frontmatter["experiment-type"] === "triangle-test") { %>
### Triangle Test Procedure

**Setup**:
1. Prepare 3 coded samples (2 identical, 1 different)
2. Randomize presentation order
3. Serve simultaneously at same temperature
4. Provide tasting protocol and recording sheet

**Execution**:
1. **Observation** (30 seconds per sample)
   - Aroma evaluation without tasting
   - Visual inspection
2. **First Taste** (sequential, small sips)
   - Taste sample 1, cleanse palate
   - Taste sample 2, cleanse palate
   - Taste sample 3, cleanse palate
3. **Comparison** (return to samples as needed)
   - Compare samples side-by-side
   - Note differences in any sensory dimension
4. **Decision** (record before revealing)
   - Identify the odd sample
   - Note confidence level (guessing/uncertain/confident/very confident)

**Repeat**: Conduct multiple trials (minimum 5, recommended 10)
<%* } else if (tp.frontmatter["experiment-type"] === "calibration-session") { %>
### Calibration Session Procedure

**Setup**:
1. Prepare reference standards with known characteristics
2. Blind code samples
3. Prepare sensory lexicon/wheel
4. Set up neutral environment

**Execution**:
1. **Reference Review**
   - Taste each reference standard
   - Discuss/note expected characteristics
   - Calibrate understanding with reference materials
2. **Blind Testing**
   - Evaluate coded samples
   - Describe using standardized vocabulary
   - Rate intensity of key attributes
3. **Reveal & Compare**
   - Check answers against known standards
   - Discuss discrepancies
   - Recalibrate perceptions

**Focus Areas**:
- Acidity levels and types
- Body/mouthfeel descriptors
- Sweetness intensity
- Specific flavor notes
- Aftertaste characteristics
<%* } else if (tp.frontmatter["experiment-type"] === "blind-tasting") { %>
### Blind Tasting Procedure

**Setup**:
1. Prepare samples without visual cues
2. Use random coding system
3. Remove all identifying information
4. Prepare evaluation form

**Execution**:
1. **Pure Assessment**
   - Evaluate each sample independently
   - Note all sensory characteristics
   - Rate quality and appeal
   - Avoid comparison thinking initially
2. **Comparative Analysis**
   - Compare samples on key dimensions
   - Rank preferences
   - Identify standouts
3. **Identity Guessing** (optional)
   - Guess origin, roaster, process
   - State confidence level
4. **Reveal & Reflection**
   - Review actual identities
   - Compare to expectations
   - Note surprises and learning

<%* } else { %>
### Experiment Procedure

**Setup**:
[Describe your setup protocol]

**Execution Steps**:
1.
2.
3.

**Recording Protocol**:
- [ ] Data capture method prepared
- [ ] Scoring sheets ready
- [ ] Timing device available
- [ ] Backup recording method available
<%* } %>

---

## 📊 Results & Data

### Trial Results

<%* if (tp.frontmatter["experiment-type"] === "triangle-test") { %>
| Trial | Code 1 | Code 2 | Code 3 | Selected Odd | Correct? | Confidence |
|-------|--------|--------|--------|--------------|----------|------------|
| 1     |        |        |        |              |          |            |
| 2     |        |        |        |              |          |            |
| 3     |        |        |        |              |          |            |
| 4     |        |        |        |              |          |            |
| 5     |        |        |        |              |          |            |
| 6     |        |        |        |              |          |            |
| 7     |        |        |        |              |          |            |
| 8     |        |        |        |              |          |            |
| 9     |        |        |        |              |          |            |
| 10    |        |        |        |              |          |            |

**Summary Statistics**:
- **Total Trials**: 10
- **Correct Responses**: ___ / 10
- **Accuracy**: ____%
- **Expected by Chance**: 33.3%
- **Statistical Significance**: ___ (p-value)

**Interpretation**:
- [ ] Results exceed chance performance
- [ ] Statistically significant at α=0.05
- [ ] Can reliably discriminate these samples
- [ ] Need more training

<%* } else { %>
| Trial | Sample Code | Observation | Rating/Score | Correct? | Notes |
|-------|-------------|-------------|--------------|----------|-------|
|       |             |             |              |          |       |
|       |             |             |              |          |       |
|       |             |             |              |          |       |

**Summary Statistics**:
- **Total Trials**: ___
- **Correct Responses**: ___ / ___
- **Accuracy**: ____%
- **Mean Score**: ___
- **Standard Deviation**: ___
<%* } %>

### Performance Metrics

**Overall Accuracy**: <% tp.frontmatter.accuracy %>%
**Confidence Level**: ___ (1-5 scale)
**Consistency**: ___ (variation across trials)
**Speed**: ___ (time per decision)

**Strengths Identified**:
-

**Weaknesses Identified**:
-

---

## 🔍 Sensory Observations

### Qualitative Findings

**Aroma Characteristics**:


**Flavor Dimensions**:
- **Acidity**:
- **Body**:
- **Sweetness**:
- **Bitterness**:
- **Flavor Notes**:


**Texture/Mouthfeel**:


**Aftertaste**:


### Discrimination Factors

**What made samples different?**
1.
2.
3.

**Most noticeable differences**:


**Subtle differences**:


**Confounding factors**:


---

## 📈 Statistical Analysis

### Significance Testing

<%* if (tp.frontmatter["experiment-type"] === "triangle-test") { %>
**Triangle Test Statistics**:
- N (number of trials): <% tp.system.prompt("Number of trials", "10") %>
- X (correct responses): <% tp.system.prompt("Correct responses", "7") %>
- Probability of correct by chance: 0.333
- p-value: ___ (use binomial test calculator)
- α (significance level): 0.05

**Critical Values for Triangle Test** (α=0.05):
- 5 trials: need 4 correct (80%)
- 10 trials: need 7 correct (70%)
- 15 trials: need 10 correct (67%)
- 20 trials: need 12 correct (60%)

**Conclusion**:
- [ ] Reject null hypothesis (can discriminate)
- [ ] Fail to reject null hypothesis (cannot discriminate)
- [ ] Inconclusive - need more trials
<%* } %>

**Statistical Significance**: <% tp.frontmatter["statistical-significance"] || "Not calculated" %>

**Confidence Interval**:
**Effect Size**:

### Power Analysis

**Achieved Power**: ___ (probability of detecting real difference)
**Required Sample Size**: ___ (for desired power)

---

## 💭 Interpretation & Insights

### Key Findings

**What did you learn?**


**Surprising results**:


**Expected results**:


**Unexpected challenges**:


### Sensory Development

**Skills Demonstrated**:
- [ ] Can detect subtle differences
- [ ] Can describe sensory characteristics accurately
- [ ] Can use standardized vocabulary
- [ ] Can maintain consistency across trials
- [ ] Can avoid bias and preconceptions

**Skills Needing Development**:
-

**Progress vs. Previous Sessions**:


---

## 🎓 Scientific Context

### Related Research

**Scientific References**:
<%* if (tp.frontmatter.relationships && tp.frontmatter.relationships["scientific-references"]) { %>
<% tp.frontmatter.relationships["scientific-references"].join("\n") %>
<%* } %>


**Relevant Studies**:
-

### Theoretical Background

**Sensory Science Principles**:


**Perceptual Thresholds**:
- Detection threshold:
- Recognition threshold:


---

## 🔄 Next Steps & Recommendations

### Training Plan Updates

**Mastered Skills**:
-

**Skills to Practice**:
1.
2.
3.

**Recommended Next Experiments**:
- [ ] Repeat this protocol with new samples
- [ ] Increase difficulty level
- [ ] Focus on specific sensory dimension
- [ ] Try different experiment type
- [ ] Conduct series over time to track improvement

### Future Sessions

**Next Session Plan**:
- **Type**:
- **Focus**:
- **Samples**:
- **Target Date**:

**Long-term Goals**:


---

## 📸 Documentation

**Photos**:
- [ ] Setup photos
- [ ] Sample preparation
- [ ] Results sheets
- [ ] Data analysis

**Videos**:
- [ ] Experiment procedure
- [ ] Sample preparation

**Attachments**:
- [ ] Raw data sheets
- [ ] Statistical analysis files
- [ ] Protocol documents

---

## 📝 Session Notes

**Process Observations**:


**Protocol Deviations**:


**Improvements for Next Time**:


**Technical Issues**:


**Personal Reflections**:


---

## 🔗 Related Content

### Training Plan
<%* if (tp.frontmatter.relationships && tp.frontmatter.relationships["related-training-plan"]) { %>
This experiment is part of: <% tp.frontmatter.relationships["related-training-plan"] %>
<%* } %>

### Series Navigation
<%* if (tp.frontmatter["is-part-of-series"]) { %>
**Previous Session**: <% tp.frontmatter.relationships["previous-session"] || "N/A" %>
**Next Session**: <% tp.frontmatter.relationships["next-session"] || "Plan next session" %>
<%* } %>

### Related Beans
```dataview
TABLE origin as "Origin", roast-level as "Roast", rating as "Rating"
FROM [[<% tp.file.title %>]]
WHERE type = "bean-profile"
```

---

## 📚 Resources

### Protocols & Standards
- **ASTM E679**: Standard Practice for Triangle Test
- **ISO 8586**: Sensory analysis - General guidelines for selection, training and monitoring of assessors
- **SCA Sensory Protocols**: Cupping and evaluation standards

### Statistical Tools
- **Binomial Test Calculator**: For triangle test significance
- **Chi-Square Test**: For contingency tables
- **R Statistical Package**: For advanced analysis

### Sensory Lexicons
- **Coffee Taster's Flavor Wheel** (SCA)
- **World Coffee Research Sensory Lexicon**
- **Le Nez du Café** Aroma Kit references

---

**Tags**: <% (tp.frontmatter.tags || []).join(", ") %>
**Priority**: <% tp.frontmatter.priority %>
**Passed**: <% tp.frontmatter.passed || "Pending evaluation" %>

---

*Coffee Vault - Sensory Experiment Template*
*Systematic sensory training and skill development*
