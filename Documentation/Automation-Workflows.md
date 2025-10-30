---
title: Automation Workflows Guide
type: documentation
tags: [automation, workflows, guide]
version: 1.0.0
last-updated: 2025-10-25
---

# 🤖 Automation Workflows Guide

**Purpose**: Complete guide to automated workflows in the Coffee Vault, reducing manual effort and ensuring data quality.

---

## Table of Contents

1. [Overview](#overview)
2. [Intelligent Template System](#intelligent-template-system)
3. [Daily Summary Generator](#daily-summary-generator)
4. [Bean Inventory Management](#bean-inventory-management)
5. [Grinder Settings Database](#grinder-settings-database)
6. [Link Suggestion System](#link-suggestion-system)
7. [Data Validation Framework](#data-validation-framework)
8. [Configuration Options](#configuration-options)
9. [Troubleshooting](#troubleshooting)

---

## Overview

The Coffee Vault includes six major automation systems:

| System | Purpose | Automation Level | User Interaction |
|--------|---------|------------------|------------------|
| **Intelligent Templates** | Smart property pre-filling | Automatic | Template creation |
| **Daily Summaries** | Aggregate daily statistics | Manual/Scheduled | Run command |
| **Inventory Manager** | Track bean usage & alerts | Manual/Scheduled | Review reports |
| **Grinder Database** | Reference optimal settings | Automatic | View recommendations |
| **Link Suggester** | Auto-link related notes | Manual | Review suggestions |
| **Data Validator** | Ensure data quality | Manual | Fix issues |

---

## Intelligent Template System

### What It Does

The enhanced Coffee Log template automatically:
- Pre-fills bean names from recently purchased beans
- Suggests your most frequently used brewing methods
- Recommends grind sizes based on successful previous brews
- Provides intelligent water temperature and time defaults
- Validates rating inputs

### How to Use

1. **Create New Coffee Log**:
   - Use Templater command or hotkey
   - Select "Coffee Log" template
   - Template loads with smart suggestions

2. **Smart Prompts**:
   ```
   Bean name: [Recently purchased bean pre-filled]
   Roaster: [Roaster from recent beans]
   Brew method: [Your top 5 methods shown first]
   Grind size: [Optimal for selected method]
   Water temp: [Optimal for roast level + method]
   ```

3. **Template Features**:
   - **Recent beans**: Shows last 30 days of purchases
   - **Method ranking**: Sorts by your usage frequency
   - **Grind intelligence**: Analyzes 4.5+ rated logs for recommendations
   - **Rating validation**: Ensures ratings stay within 1-5 range
   - **Cursor placement**: Positioned at "Tasting Notes" for immediate input

### Behind the Scenes

The template uses `Scripts/template-helpers.js` functions:
- `getRecentBeans()` - Queries Beans Library for active beans
- `getTopBrewMethods()` - Analyzes Coffee Logs for frequency
- `getRecommendedGrindSize()` - Finds successful grind settings
- `getRecommendedWaterTemp()` - Calculates based on roast + method
- `validateRating()` - Ensures data quality

### Configuration

Edit `Scripts/template-helpers.js` to customize:
```javascript
// Days to look back for recent beans
getRecentBeans(app, 30)  // Change 30 to desired days

// Number of top methods to show
getTopBrewMethods(app, 5)  // Change 5 to desired count

// Rating threshold for grind recommendations
const logs = dv.pages('"Coffee Logs"')
  .where(p => p.rating >= 4.0)  // Change 4.0 threshold
```

---

## Daily Summary Generator

### What It Does

Automatically scans completed Coffee Logs and generates:
- Total cups brewed
- Average quality ratings
- Brewing methods used
- Beans tried
- Experiments performed
- Equipment usage

### How to Use

#### Manual Generation

Run from Templater or console:

```javascript
const generator = app.plugins.plugins.templater.templater.current_functions_object.user.require("Scripts/daily-summary-generator.js");

// Generate summary for today
const summary = await generator.generateDailySummary(app);
console.log(summary.summaryText);

// Generate for specific date
const summary = await generator.generateDailySummary(app, "2025-10-20");

// Insert into daily note
await generator.insertSummaryIntoDailyNote(app, "2025-10-20", {
  verbosity: 'detailed'
});
```

#### Automated Insertion

Add to Daily Note template:
```javascript
<%*
const generator = await tp.user.require("Scripts/daily-summary-generator.js");
const summary = await generator.generateDailySummary(app, tp.date.now("YYYY-MM-DD"));

if (summary.hasData) {
  tR += summary.summaryText;
}
%>
```

### Configuration Options

```javascript
const config = {
  verbosity: 'detailed',  // 'brief', 'standard', 'detailed'
  includeMoodAnalysis: true,
  includeEquipmentTracking: true,
  includeExperiments: true,
  minCupsForSummary: 1,  // Minimum cups to generate
  targetFolder: 'Daily Notes'
};

await generator.insertSummaryIntoDailyNote(app, date, config);
```

### Output Examples

**Brief**:
```markdown
## ☕ Daily Coffee Summary - 2025-10-25
**Quick Stats**: 3 session(s) • 3 cup(s) • ⭐⭐⭐⭐ avg rating
```

**Detailed**:
```markdown
## ☕ Daily Coffee Summary - 2025-10-25

### 📊 Overview
- Total Sessions: 3
- Total Cups Brewed: 3
- Average Rating: ⭐⭐⭐⭐ (4.2/5)
- Rating Range: 4.0 - 4.5

### ⚙️ Brewing Methods
- Pour Over: 2 session(s)
- Espresso: 1 session(s)

### ⭐ Highlight Session
**Rating**: ⭐⭐⭐⭐✨ 4.5/5
**Beans**: Ethiopian Yirgacheffe
**Method**: Pour Over
```

### Batch Generation

Generate summaries for date range:
```javascript
const results = await generator.generateSummariesForRange(
  app,
  "2025-10-01",
  "2025-10-31"
);
```

---

## Bean Inventory Management

### What It Does

Automatically:
- Calculates cups brewed vs. remaining capacity
- Generates low inventory warnings
- Recommends beans to repurchase based on ratings
- Tracks bean freshness and aging
- Auto-updates bean status (finished/aging)

### How to Use

#### Check Inventory Status

```javascript
const inventory = app.plugins.plugins.templater.templater.current_functions_object.user.require("Scripts/inventory-manager.js");

// Get full inventory overview
const status = await inventory.calculateBeanInventory(app);

console.log(`Active beans: ${status.activeBeans}`);
console.log(`Low inventory: ${status.lowInventoryBeans.length}`);
```

#### Generate Reports

```javascript
// Low inventory warnings
const warnings = await inventory.generateLowInventoryWarnings(app);
warnings.forEach(w => console.log(w.message));

// Repurchase recommendations
const recommendations = await inventory.generateRepurchaseRecommendations(app);

// Shopping list
const shoppingList = await inventory.generateShoppingList(app);
console.log(shoppingList.formattedList);
```

#### Auto-Update Bean Status

```javascript
// Dry run (preview changes)
const updates = await inventory.autoUpdateBeanStatus(app, true);
console.log(`Would update ${updates.updatesNeeded} beans`);

// Actually apply updates
const updates = await inventory.autoUpdateBeanStatus(app, false);
```

#### Inventory Dashboard

```javascript
const dashboard = await inventory.getInventoryDashboard(app);
// Creates formatted markdown dashboard
```

### Configuration

Edit `Scripts/inventory-manager.js`:
```javascript
const DEFAULT_CONFIG = {
  defaultDoseGrams: 18,  // Grams per cup
  lowInventoryThreshold: 5,  // Cups remaining for warning
  finishedThreshold: 1,  // Auto-mark as finished
  agingDays: 21,  // Days to mark as aging
  staleDays: 35,  // Days to warn about staleness
  highRatingThreshold: 4.2,  // Rating for repurchase
  minSessionsForRepurchase: 3  // Minimum brews before recommending
};
```

### Inventory Workflow

**Recommended Schedule**:
1. **Weekly**: Check inventory dashboard
2. **Bi-weekly**: Generate shopping list
3. **Monthly**: Auto-update bean statuses

### Example Output

```markdown
# 📊 Bean Inventory Dashboard

## Overview
- Total Beans: 5
- Active Beans: 3
- Low Inventory Alerts: 1
- Aging/Stale Beans: 1
- Repurchase Recommendations: 2

## Active Beans Status
| Bean | Cups Remaining | Usage | Avg Rating | Freshness |
|------|----------------|-------|------------|-----------|
| Ethiopian Yirgacheffe | 3 | 82.3% | 4.5/5 | 🌟 peak |
| Colombian Supremo | 8 | 52.9% | 4.2/5 | ✅ good |

## ⚠️ Alerts
- ⚠️ Low inventory: Ethiopian Yirgacheffe has only 3 cup(s) remaining

## ⭐ Repurchase Recommendations
- ⭐ Repurchase: Ethiopian Yirgacheffe (4.5/5 avg, 14 sessions)
```

---

## Grinder Settings Database

### What It Does

The Grinder Settings Database is an intelligent reference view that:
- Indexes all successful brewing sessions by grind size
- Organizes settings by method, origin, and roast level
- Provides starting points for new beans
- Tracks adjustment patterns during dial-in
- Shows success rates for different grind settings

### How to Use

1. **Access the Database**:
   - Open `Views/Daily-Brewing-Layout/Grinder Settings Database.md`
   - Automatically updates as you add coffee logs

2. **Find Starting Points**:
   - Navigate to your brewing method section
   - Look for beans with similar characteristics
   - Use suggested grind size as starting point

3. **Track Your Dial-In**:
   - Reference "Dial-In Tracking Template" section
   - Document your adjustment process
   - Build personal grinder-specific notes

### Key Sections

**Quick Lookup Tables**:
- Espresso Settings (4.5+ rated)
- Pour Over Settings (4.5+ rated)
- French Press Settings (4.5+ rated)
- Aeropress Settings (4.5+ rated)
- Cold Brew Settings (4.5+ rated)

**Origin-Based Settings**:
- Ethiopian beans optimal settings
- Colombian beans optimal settings
- Kenyan beans optimal settings

**Roast Level Settings**:
- Light roasts - higher temps, finer grinds
- Medium roasts - standard settings
- Dark roasts - lower temps, coarser grinds

**Analysis Tools**:
- Grind size success rates
- Performance by method
- Learning from experiments

### Adding Grinder-Specific Notes

Customize the "Grinder-Specific Notes" section:

```markdown
## 🛠️ Grinder-Specific Notes

### My Comandante C40
- **Espresso**: 8 clicks = fine
- **Pour Over V60**: 18 clicks = medium-fine
- **French Press**: 28 clicks = coarse
- **Aeropress**: 14 clicks = fine

### My Baratza Encore
- **Pour Over**: Setting 15 = medium-fine
- **French Press**: Setting 28 = coarse
- **Cold Brew**: Setting 35 = extra-coarse
```

---

## Link Suggestion System

### What It Does

Scans your notes for phrases matching other note titles and suggests creating internal links, helping build a connected knowledge graph.

### How to Use

#### Scan Single Note

```javascript
const linkSuggester = app.plugins.plugins.templater.templater.current_functions_object.user.require("Scripts/link-suggester.js");

const file = app.workspace.getActiveFile();
const suggestions = await linkSuggester.findLinkSuggestions(app, file);

console.log(`Found ${suggestions.totalSuggestions} potential links`);
suggestions.suggestions.forEach(s => {
  console.log(`Link "${s.text}" to ${s.targetNote} (${(s.confidence * 100).toFixed(0)}% confidence)`);
});
```

#### Scan Entire Vault

```javascript
const results = await linkSuggester.scanVaultForSuggestions(app, {
  minConfidence: 0.6,
  maxNotesToScan: 100
});

console.log(`Scanned ${results.scannedNotes} notes`);
console.log(`Found ${results.highConfidenceSuggestions} high-confidence suggestions`);
```

#### Generate Report

```javascript
const results = await linkSuggester.scanVaultForSuggestions(app);
const report = linkSuggester.generateSuggestionReport(results);

// Create new note with report
await app.vault.create("Link Suggestions Report.md", report);
```

#### Apply Suggestions (Auto-Link)

```javascript
// Dry run - preview changes
const file = app.workspace.getActiveFile();
const suggestions = await linkSuggester.findLinkSuggestions(app, file);

const result = await linkSuggester.applySuggestions(
  app,
  file,
  suggestions.suggestions,
  true  // dryRun = true
);

console.log(`Would apply ${result.appliedCount} links`);

// Actually apply
await linkSuggester.applySuggestions(app, file, suggestions.suggestions, false);
```

### Configuration

```javascript
const config = {
  minMatchLength: 3,  // Minimum characters to match
  caseSensitive: false,
  excludeFolders: ['.obsidian', 'Attachments', 'Templates'],
  excludePatterns: ['daily-note', 'weekly-summary'],
  maxSuggestionsPerNote: 20,
  requireWholeWord: true,  // Only match complete words
  skipExistingLinks: true  // Don't suggest for already-linked text
};

const suggestions = await linkSuggester.findLinkSuggestions(app, file, config);
```

### Confidence Scores

Links are scored 0-1 based on:
- **Exact case match**: +0.2
- **In heading**: +0.1
- **In list**: +0.05
- **Long match**: +0.1
- **High-value folder** (Beans, Roasters, Origins): +0.15

Only suggestions with confidence ≥ 0.7 are auto-applied.

### Best Practices

1. **Review before applying**: Always dry-run first
2. **Scan regularly**: Weekly scans keep vault connected
3. **High confidence first**: Start with ≥0.7 confidence suggestions
4. **Manual review**: Check medium-confidence (0.5-0.7) suggestions manually

---

## Data Validation Framework

### What It Does

Validates vault data integrity:
- Checks required properties exist
- Verifies property types and value ranges
- Validates date consistency
- Detects duplicate entries
- Finds broken links
- Generates quality dashboard

### How to Use

#### Validate Single Note

```javascript
const validator = app.plugins.plugins.templater.templater.current_functions_object.user.require("Scripts/data-validator.js");

const file = app.workspace.getActiveFile();
const result = await validator.validateNote(app, file);

if (!result.isValid) {
  console.log(`Found ${result.errorCount} errors`);
  result.errors.forEach(err => {
    console.log(`${err.property}: ${err.message}`);
  });
}
```

#### Validate Entire Vault

```javascript
const results = await validator.validateVault(app);

console.log(`Validated ${results.totalNotes} notes`);
console.log(`Valid: ${results.validNotes}`);
console.log(`Errors: ${results.totalErrors}`);
console.log(`Warnings: ${results.totalWarnings}`);
```

#### Validate Specific Folder

```javascript
const results = await validator.validateVault(app, "Coffee Logs");
```

#### Check for Duplicates

```javascript
const duplicates = await validator.checkForDuplicates(app);

duplicates.forEach(dup => {
  console.log(`Duplicate ${dup.type}: ${dup.value}`);
  console.log(`Found in ${dup.count} files`);
});
```

#### Check Reference Integrity

```javascript
const brokenLinks = await validator.checkReferenceIntegrity(app);

brokenLinks.forEach(link => {
  console.log(`Broken link in ${link.sourceFile}: ${link.targetLink}`);
});
```

#### Generate Dashboard

```javascript
const results = await validator.validateVault(app);
const duplicates = await validator.checkForDuplicates(app);
const brokenLinks = await validator.checkReferenceIntegrity(app);

const dashboard = validator.generateDataQualityDashboard(
  results,
  duplicates,
  brokenLinks
);

// Create dashboard note
await app.vault.create("Data Quality Dashboard.md", dashboard);
```

### Validation Rules

**Property Schemas** (from Property Schema.md):
- Coffee Log: 13 required properties
- Bean Profile: 10 required properties
- Roaster Profile: 4 required properties

**Type Checks**:
- Numbers: rating, water-temp, price, weight
- Dates: YYYY-MM-DD format
- Booleans: true/false
- Lists: array format
- Links: [[bracket]] format

**Range Validation**:
- Rating: 1-5
- Water temp: 32-212°F
- Brew time: 0.1-1440 minutes
- Price: 0-500
- Weight: 1-10000g

**Enum Validation**:
- Roast levels: light, medium-light, medium, medium-dark, dark
- Brew methods: pour-over, espresso, french-press, etc.
- Grind sizes: extra-fine to extra-coarse
- Bean status: active, finished, aging, archived

### Example Dashboard Output

```markdown
# 📊 Data Quality Dashboard

## Overall Health
🟢 **Health Score**: 94/100

## Summary Statistics
- Total Notes Validated: 150
- Valid Notes: 145 (96.7%)
- Notes with Errors: 5
- Total Errors: 8
- Total Warnings: 12
- Duplicate Entries: 1
- Broken Links: 2

## Most Common Errors
- rating: 3 occurrence(s)
- water-temp: 2 occurrence(s)
- roast-level: 2 occurrence(s)

## Recommendations
1. Fix validation errors in notes listed above
2. Review and merge or remove duplicate entries
3. Repair broken links or remove invalid references
```

### Recommended Workflow

**Monthly**: Full vault validation
**Weekly**: Check for duplicates and broken links
**After bulk imports**: Immediate validation

---

## Configuration Options

### Global Settings

Most scripts use similar configuration patterns:

```javascript
const DEFAULT_CONFIG = {
  // Feature toggles
  enableFeature: true,

  // Thresholds
  threshold: 5,

  // Folders
  targetFolder: 'Folder Name',
  excludeFolders: ['.obsidian', 'Templates'],

  // Limits
  maxItems: 20,
  minValue: 1
};
```

### Per-Script Configuration

Edit the script files in `Scripts/` folder:
- `template-helpers.js` - Template suggestions
- `daily-summary-generator.js` - Summary generation
- `inventory-manager.js` - Inventory thresholds
- `link-suggester.js` - Link detection rules
- `data-validator.js` - Validation schemas

### Configuration Best Practices

1. **Test changes**: Use dry-run modes before applying
2. **Document customizations**: Add comments to your changes
3. **Backup first**: Keep original configs commented out
4. **Gradual tuning**: Adjust one parameter at a time

---

## Troubleshooting

### Common Issues

#### Template Suggestions Not Working

**Problem**: Template shows empty suggestions

**Solutions**:
1. Ensure Dataview plugin is installed and enabled
2. Check that you have data in Beans Library and Coffee Logs
3. Verify script path: `Scripts/template-helpers.js` exists
4. Check console for JavaScript errors

#### Daily Summary Returns No Data

**Problem**: "No data found" message

**Solutions**:
1. Verify Coffee Logs exist for target date
2. Check that logs have `type: coffee-log` in frontmatter
3. Ensure date format is YYYY-MM-DD
4. Lower `minCupsForSummary` threshold

#### Inventory Calculations Incorrect

**Problem**: Wrong cups remaining count

**Solutions**:
1. Check bean weight in Bean Profile (should be in grams)
2. Verify `cups-brewed` property in Coffee Logs
3. Adjust `defaultDoseGrams` in config (default 18g)
4. Check bean name matches exactly between profile and logs

#### Link Suggestions Too Many/Few

**Problem**: Too many false positives or missing links

**Solutions**:
1. Adjust `minConfidence` threshold (default 0.6)
2. Enable/disable `requireWholeWord` option
3. Add exclusion patterns for common words
4. Adjust `minMatchLength` (default 3)

#### Validation Reports Too Strict

**Problem**: Too many warnings for acceptable data

**Solutions**:
1. Review `PROPERTY_SCHEMAS` in `data-validator.js`
2. Adjust range limits for properties
3. Add properties to optional list
4. Customize validation rules for your workflow

### Debug Mode

Enable detailed logging:

```javascript
// Add to script functions
console.log("Debug info:", variable);

// Check Obsidian console (Ctrl+Shift+I or Cmd+Option+I)
```

### Getting Help

1. Check script comments for inline documentation
2. Review Examples folder for working code
3. Verify Property Schema for correct formats
4. Test scripts with minimal data first
5. Check Obsidian community forums for similar issues

---

## Advanced Automation

### Scheduled Tasks

Use plugins like "Periodic Notes" or "Templater" with scheduling:

```javascript
// Auto-generate daily summary at end of day
// Add to Daily Note template

<%*
if (tp.date.now("HH") >= "22") {  // After 10 PM
  const generator = await tp.user.require("Scripts/daily-summary-generator.js");
  await generator.insertSummaryIntoDailyNote(app);
}
%>
```

### Batch Operations

Process multiple notes:

```javascript
// Validate all coffee logs
const files = app.vault.getMarkdownFiles()
  .filter(f => f.path.startsWith("Coffee Logs/"));

for (const file of files) {
  const result = await validator.validateNote(app, file);
  if (!result.isValid) {
    console.log(`${file.path}: ${result.errorCount} errors`);
  }
}
```

### Custom Workflows

Combine multiple automation systems:

```javascript
// Weekly maintenance workflow
async function weeklyMaintenance(app) {
  // 1. Validate vault
  const validation = await validator.validateVault(app);

  // 2. Check inventory
  const inventory = await inventoryManager.calculateBeanInventory(app);

  // 3. Generate shopping list
  if (inventory.lowInventoryBeans.length > 0) {
    const shoppingList = await inventoryManager.generateShoppingList(app);
    await app.vault.create("Shopping List.md", shoppingList.formattedList);
  }

  // 4. Update bean statuses
  await inventoryManager.autoUpdateBeanStatus(app, false);

  // 5. Scan for link suggestions
  const linkResults = await linkSuggester.scanVaultForSuggestions(app);
  const report = linkSuggester.generateSuggestionReport(linkResults);
  await app.vault.create("Link Report.md", report);
}
```

---

## Future Enhancements

Planned automation features:
- Automatic weekly/monthly summary generation
- Predictive bean ordering based on consumption patterns
- Machine learning-based grind recommendations
- OCR for importing roaster bag information
- Integration with external coffee databases
- Automated backup and export systems

---

**Document Version**: 1.0.0
**Last Updated**: 2025-10-25
**Maintained By**: Automation Sub-Agent

For examples and code samples, see [[Examples/Automation-Examples]].
