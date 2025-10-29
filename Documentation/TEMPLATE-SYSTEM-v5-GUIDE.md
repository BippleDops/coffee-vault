---
type: documentation
title: Coffee Vault 5.0 - Template System Guide
version: 5.0.0
date: 2025-10-28
tags: [documentation, coffee-vault-5.0, templates]
---

# Coffee Vault 5.0 - Template System Guide

**Purpose**: Complete guide to the intelligent template system v5.0

**Version**: 5.0.0  
**Last Updated**: 2025-10-28

---

## Overview

Coffee Vault 5.0 introduces an **intelligent template system** with context-aware suggestions, ML-powered recommendations, and specialized templates for different use cases.

---

## Template Types

### 1. Context-Aware Coffee Log (`Coffee-Log-v5-Context-Aware.md`)

**Purpose**: Full-featured logging with intelligent suggestions

**Features**:
- Automatic context detection (time of day, current bean)
- ML-powered parameter suggestions
- Weather and physiological context tracking
- Photo/video integration
- Precision measurements
- Auto-generated tags

**Usage**: Use for detailed brewing sessions where you want optimal parameters suggested.

**How it works**:
1. Detects current time of day
2. Finds your current bean
3. Analyzes similar successful brews
4. Suggests optimal parameters
5. Generates appropriate tags

### 2. Quick Capture (`Coffee-Log-v5-Quick-Capture.md`)

**Purpose**: Fast logging for quick sessions

**Features**:
- Minimal fields
- Auto-fills current bean and recent method
- Voice-friendly format
- Quick rating and notes

**Usage**: Use when you need to log quickly without detailed analysis.

**Ideal for**:
- Morning rush
- Quick tastings
- Mobile logging
- Voice-to-text input

### 3. Batch Logging (`Coffee-Log-v5-Batch.md`)

**Purpose**: Multiple sessions in one document

**Features**:
- Track multiple brewing sessions
- Comparative analysis
- Side-by-side comparison
- Parameter variations

**Usage**: Use when brewing multiple variations or testing parameters.

**Ideal for**:
- Parameter testing
- Side-by-side comparisons
- Cupping sessions
- Method comparisons

---

## Context Detection

### Automatic Context

The templates automatically detect:

1. **Time of Day**
   - Morning (5-12)
   - Afternoon (12-17)
   - Evening (17-21)
   - Night (21-5)

2. **Current Bean**
   - Looks for `is-current: true` in bean profiles
   - Falls back to most recent bean

3. **Recent Parameters**
   - Uses your most recent brew method
   - Suggests based on successful brews

### Manual Context

Templates prompt for:

- Weather conditions
- Physiological state
- Energy level
- Hydration level
- Sleep hours

---

## ML-Powered Suggestions

### Parameter Suggestions

The context-aware template uses ML models to suggest:

- **Optimal Dose**: Based on bean, method, and successful brews
- **Water Amount**: Calculated from dose and ratio
- **Temperature**: Adjusted for roast level and method
- **Grind Size**: Method-specific recommendations
- **Brew Time**: Method-specific timing

### Confidence Scores

Each suggestion includes:
- **Confidence Level**: 0-100% based on data quality
- **Reasoning**: Why these parameters were suggested
- **Similar Brews**: Number of similar successful brews used

---

## Smart Tag Generation

Templates automatically generate hierarchical tags:

### Auto-Generated Tags

From **Coffee Log**:
- `category:coffee-log`
- `method:[method]`
- `origin:[origin]`
- `roast:[roast-level]`
- `quality:[quality-level]`
- `month:[YYYY-MM]`
- `year:[YYYY]`
- `season:[season]`

### Tag Inference

Tags are inferred from:
- Entity properties
- Ratings
- Dates
- Relationships

---

## Photo Integration

### Photo Fields

Templates include fields for:
- `setup-photo`: Brewing setup
- `process-photo`: During brewing
- `result-photo`: Final brew
- `photo-links`: Array of photo URLs

### Usage

1. Take photos during brewing
2. Add photo links to frontmatter
3. Photos display in log

**Pro Tip**: Use Obsidian's image embedding or link to attachments folder.

---

## Voice Input Support

### Quick Capture Template

Optimized for voice input:
- Short field names
- Simple structure
- Natural language friendly

### Voice Commands

Example voice inputs:
- "Four point five stars"
- "Ethiopian light roast"
- "Twenty grams coffee"
- "V60 method"

---

## Template Customization

### Adding Context

Customize templates to include:
- Additional context fields
- Custom ML suggestions
- Specific workflows

### Example Customization

```javascript
// Add custom context detection
function detectMood() {
  const hour = new Date().getHours();
  if (hour < 10) return "tired";
  if (hour < 16) return "focused";
  return "relaxed";
}
```

---

## Best Practices

### 1. Choose the Right Template

- **Detailed Session**: Use Context-Aware
- **Quick Log**: Use Quick Capture
- **Comparison**: Use Batch Logging

### 2. Fill Context Fields

- Complete physiological context
- Add weather if known
- Include photos when possible

### 3. Review Suggestions

- Check ML suggestions
- Adjust based on experience
- Note what worked

### 4. Expand Quick Logs

- Start with Quick Capture
- Expand to full log later
- Link related sessions

---

## Template Workflow

### Morning Routine

1. Open Quick Capture template
2. Voice input or quick fill
3. Capture essential data
4. Expand later if needed

### Detailed Session

1. Open Context-Aware template
2. Review ML suggestions
3. Add context (weather, mood)
4. Take photos
5. Complete sensory notes

### Parameter Testing

1. Open Batch Logging template
2. Set up 3-5 variations
3. Log each session
4. Compare results

---

## Integration with Other Systems

### ML Models

Templates integrate with:
- `EnhancedParameterPredictor`
- `FlavorProfilePredictor`
- `QualityAnomalyDetector`

### Tagging System

Templates use:
- `tag-inference.js`
- Hierarchical tag system
- Smart tag inference

### Analytics

Templates feed into:
- Real-Time Brewing Assistant
- Learning Dashboard
- Quality Analytics

---

## Troubleshooting

### No Suggestions Available

**Cause**: Insufficient historical data

**Solution**: 
- Log more sessions
- Ensure ratings are >= 4.0
- Add bean profiles

### Tags Not Generated

**Cause**: Tag inference script not loaded

**Solution**:
- Check script path
- Verify script exists
- Use manual tags

### Context Not Detected

**Cause**: No current bean set

**Solution**:
- Set `is-current: true` on bean
- Or select bean manually

---

## Future Enhancements

Planned features:
- **Weather API Integration**: Auto-detect weather
- **Calendar Integration**: Schedule-aware suggestions
- **Photo OCR**: Extract data from photos
- **Voice Assistant**: Full voice control
- **Smart Reminders**: Prompt for logging

---

## Related Documentation

- **Property Schema**: `Configuration/Property-Schema.md`
- **ML Models**: `Scripts/advanced-ml-models.js`
- **Tagging System**: `Documentation/TAGGING-SYSTEM-GUIDE.md`
- **Workflow Automation**: `Documentation/WORKFLOW-AUTOMATION-GUIDE.md`

---

**Version**: 5.0.0  
**Last Updated**: 2025-10-28  
**Status**: Production

