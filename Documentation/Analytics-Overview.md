---
type: documentation
category: analytics
version: 1.0.0
last-updated: 2025-10-25
tags: [documentation, analytics, guide]
---

# Coffee Vault Analytics System - Complete Documentation

**Version**: 1.0.0
**Last Updated**: 2025-10-25
**Status**: Production Ready

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Analytics Components](#analytics-components)
3. [Statistical Toolkit](#statistical-toolkit)
4. [Dashboard Usage](#dashboard-usage)
5. [Data Requirements](#data-requirements)
6. [Integration Guide](#integration-guide)
7. [Customization](#customization)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)

---

## System Overview

### Purpose

The Coffee Vault Analytics System provides comprehensive data analysis capabilities for coffee enthusiasts to:

- **Track Performance**: Monitor brewing quality, consistency, and improvement over time
- **Optimize Parameters**: Identify optimal brewing parameters through correlation analysis
- **Manage Finances**: Track spending, calculate ROI, and optimize purchasing decisions
- **Develop Palate**: Measure sensory skill growth and flavor vocabulary expansion
- **Generate Insights**: Automatically identify patterns, trends, and recommendations

### Architecture

```
Coffee Vault Analytics
├── Scripts/
│   └── stats-utils.js          # Statistical analysis library
├── Analytics/
│   ├── Monthly Dashboard.md    # Comprehensive monthly analytics
│   ├── Brewing Optimizer.md    # Parameter optimization engine
│   ├── Cost Intelligence.md    # Financial tracking & analysis
│   └── Palate Development.md   # Sensory skill tracking
├── Documentation/
│   ├── Analytics-Overview.md   # This document
│   └── Analytics-API.md        # (Future) API reference
└── Examples/
    └── Analytics-Examples.md   # Usage examples & tutorials
```

### Technology Stack

- **Query Engine**: Dataview plugin for Obsidian
- **Computation**: DataviewJS with custom JavaScript
- **Statistics**: stats-utils.js (custom library)
- **Visualization**: CSS-based charts and tables
- **Data Source**: Property Schema-compliant markdown files

---

## Analytics Components

### 1. Monthly Dashboard

**Location**: `Analytics/Monthly Dashboard.md`

**Purpose**: Comprehensive monthly overview of all coffee activities

**Key Features**:
- Volume metrics (cups, sessions, caffeine)
- Quality distribution and top performers
- Brewing method performance analysis
- Origin diversity tracking
- Financial summary with recent purchases
- Temporal patterns (day of week analysis)
- Flavor profile trending
- Statistical summaries
- Automated insights and recommendations

**Best Used For**:
- Monthly review sessions
- Identifying trends over time
- Tracking overall progress
- Generating monthly reports

**Data Requirements**:
- Coffee Logs with dates and ratings
- Bean profiles with purchase information
- Flavor notes (optional but recommended)

### 2. Brewing Optimizer

**Location**: `Analytics/Brewing Optimizer.md`

**Purpose**: Identify optimal brewing parameters and predict quality outcomes

**Key Features**:
- Parameter correlation analysis (temperature, time, grind)
- Optimal range identification by method
- Sweet spot analysis for parameter combinations
- Method-specific recommendations
- Consistency scoring for bean + method pairs
- Predictive quality modeling
- Experiment tracking
- Actionable improvement suggestions

**Best Used For**:
- Improving brewing technique
- Troubleshooting low-quality sessions
- Planning experiments
- Method comparison

**Data Requirements**:
- Coffee Logs with brewing parameters (water-temp, brew-time, grind-size)
- Minimum 10 sessions for meaningful correlations
- Multiple methods for comparison (recommended)

### 3. Cost Intelligence

**Location**: `Analytics/Cost Intelligence.md`

**Purpose**: Comprehensive financial tracking and optimization

**Key Features**:
- Lifetime and monthly spending tracking
- Cost per cup calculation
- Price per pound averaging
- Monthly spending trends with forecasts
- Category-based analysis (roaster, origin, roast level)
- Value analysis (cost vs quality)
- Purchase optimization recommendations
- Budget planning tools
- ROI analysis
- Savings vs commercial coffee calculation

**Best Used For**:
- Budget planning
- Purchase decisions
- Value optimization
- Financial reporting

**Data Requirements**:
- Bean profiles with price and weight
- Coffee Logs with cups-brewed
- Purchase dates for trend analysis

### 4. Palate Development Tracker

**Location**: `Analytics/Palate Development.md`

**Purpose**: Track sensory skill development and flavor vocabulary growth

**Key Features**:
- Flavor vocabulary size tracking
- Descriptor diversity analysis
- Flavor category distribution
- Most common descriptors identification
- Rating consistency measurement
- Complexity scoring (flavors per session)
- Flavor discovery timeline
- Calibration exercise suggestions
- Development recommendations

**Best Used For**:
- Tracking sensory improvement
- Identifying palate biases
- Planning tasting exercises
- Building flavor vocabulary

**Data Requirements**:
- Coffee Logs with flavor-notes arrays
- Multiple sessions with same beans (for consistency)
- Dates for evolution tracking

---

## Statistical Toolkit

### Location

`Scripts/stats-utils.js`

### Overview

Comprehensive JavaScript library providing statistical analysis functions for use in DataviewJS queries.

### Function Categories

#### Descriptive Statistics

```javascript
mean(values)                    // Average
median(values)                  // Median value
mode(values)                    // Most frequent value
standardDeviation(values)       // Standard deviation
variance(values)               // Variance
coefficientOfVariation(values) // Relative variability (%)
quartiles(values)              // Q1, Q2, Q3, IQR
findOutliers(values)           // Identify outliers using IQR method
```

#### Correlation Analysis

```javascript
pearsonCorrelation(x, y)       // Correlation coefficient (-1 to 1)
interpretCorrelation(r)        // Human-readable interpretation
correlationMatrix(data)        // Correlation matrix for multiple variables
```

#### Distribution Analysis

```javascript
histogram(values, numBins)     // Histogram with configurable bins
skewness(values)              // Distribution asymmetry
kurtosis(values)              // Distribution tailedness
```

#### Trend Analysis

```javascript
linearRegression(x, y)        // Slope, intercept, R²
predict(regression, x)        // Predict y from x
movingAverage(values, window) // Smoothed trend line
detectTrend(values)           // Automatic trend detection
interpretTrend(slope, rSq)    // Trend interpretation
```

#### Consistency Metrics

```javascript
consistencyScore(values)           // 0-100 consistency score
rollingConsistency(values, window) // Consistency over time
```

#### Comparative Analysis

```javascript
compareGroups(group1, group2)  // T-test approximation
interpretEffectSize(d)         // Cohen's d interpretation
```

#### Percentiles & Rankings

```javascript
percentile(values, percentile) // Calculate percentile value
percentileRank(values, value)  // Rank a value
```

#### Frequency Analysis

```javascript
frequencyDistribution(values)  // Count occurrences
topN(values, n)               // Top N most frequent
```

### Usage Example

```javascript
// In a DataviewJS block
const stats = await this.app.plugins.plugins.dataview.api.require("Scripts/stats-utils.js");

const ratings = logs.map(p => p.rating);
const temps = logs.map(p => p["water-temp"]);

const avgRating = stats.mean(ratings);
const correlation = stats.pearsonCorrelation(temps, ratings);
const interpretation = stats.interpretCorrelation(correlation);

dv.paragraph(`Average: ${avgRating.toFixed(2)}`);
dv.paragraph(`Temp-Rating correlation: ${interpretation}`);
```

### Error Handling

All functions include:
- Null/undefined value filtering
- Empty array handling
- Division by zero protection
- Type checking for numeric operations

---

## Dashboard Usage

### Opening Dashboards

1. Navigate to the `Analytics/` folder in Obsidian
2. Click on desired dashboard
3. Allow DataviewJS to execute (if prompted)
4. Dashboards auto-update when underlying data changes

### Interpreting Results

#### Rating Distributions

- **5.0 stars**: Exceptional, reference-quality sessions
- **4.5-4.9**: Excellent, consistently reproducible
- **4.0-4.4**: Very good, minor improvements possible
- **3.5-3.9**: Good, some inconsistency or parameter issues
- **3.0-3.4**: Adequate, needs optimization
- **< 3.0**: Poor, significant issues to address

#### Correlation Coefficients

- **r > 0.7**: Strong positive relationship
- **r = 0.5-0.7**: Moderate positive relationship
- **r = 0.3-0.5**: Weak positive relationship
- **r = -0.3 to 0.3**: No significant relationship
- **r < -0.3**: Negative relationship (inverse)

#### Consistency Scores

- **90-100%**: Exceptional consistency
- **80-90%**: Very consistent
- **70-80%**: Moderately consistent
- **60-70%**: Some variability
- **< 60%**: High variability, focus area

### Monthly Dashboard Workflow

**Recommended Monthly Review Process**:

1. **Open Dashboard**: View current month automatically
2. **Review Overview**: Check total sessions, average rating, spending
3. **Analyze Quality**: Examine rating distribution and top performers
4. **Method Performance**: Identify which methods work best
5. **Financial Check**: Review spending vs budget
6. **Read Insights**: Review automated recommendations
7. **Plan Next Month**: Adjust based on insights

### Customizing Time Periods

Most dashboards default to current month. To analyze a different period:

1. Edit dashboard frontmatter:
   ```yaml
   month: "2025-09"
   ```
2. Queries will automatically filter to that month

### Exporting Data

To export dashboard results:

1. **PDF Export**: File → Export to PDF (preserves formatting)
2. **Copy Tables**: Select and copy table data to spreadsheet
3. **Screenshot**: Capture visual charts for reports

---

## Data Requirements

### Minimum Data for Each Dashboard

#### Monthly Dashboard
- **Minimum**: 1 Coffee Log with date and rating
- **Recommended**: 10+ logs per month
- **Optional**: flavor-notes, cost-per-cup, brewing parameters

#### Brewing Optimizer
- **Minimum**: 10 Coffee Logs with brewing parameters
- **Recommended**: 20+ logs across multiple methods
- **Required Fields**: rating, brew-method, water-temp OR brew-time

#### Cost Intelligence
- **Minimum**: 1 Bean Profile with price and weight
- **Recommended**: 5+ bean purchases
- **Required Fields**: price, weight, purchase-date

#### Palate Development
- **Minimum**: 5 Coffee Logs with flavor-notes
- **Recommended**: 20+ logs with detailed flavor notes
- **Required Fields**: flavor-notes (array), date

### Data Quality Guidelines

**Complete Required Properties**:
```yaml
# Coffee Log minimum
date: 2025-10-25
rating: 4.5
brew-method: pour-over
beans: "Ethiopian Yirgacheffe"
```

**Add Optional Enhancement Data**:
```yaml
# Enhanced tracking
water-temp: 200
brew-time: 3.5
grind-size: medium-fine
flavor-notes: [chocolate, blueberry, floral]
cost-per-cup: 1.50
```

**Maintain Consistency**:
- Use exact values from Property Schema
- Don't abbreviate method names
- Use consistent date formats (YYYY-MM-DD)
- Keep rating scale 1-5

---

## Integration Guide

### With Templates

Analytics dashboards consume data from templates. Ensure templates populate required fields:

```markdown
# In Coffee Log template
---
date: <% tp.date.now("YYYY-MM-DD") %>
rating: <% tp.system.prompt("Rating (1-5)", "4") %>
brew-method: <% tp.system.suggester(...) %>
water-temp: <% tp.system.prompt("Temp (°F)", "200") %>
---
```

### With Other Dashboards

Create navigation links between related views:

```markdown
## Related Analytics
- [[Monthly Dashboard|Monthly Overview]]
- [[Brewing Optimizer|Parameter Analysis]]
- [[Cost Intelligence|Financial Reports]]
```

### With External Tools

Export data for external analysis:

1. **Dataview Query**: Generate CSV-style output
2. **Copy to Spreadsheet**: Use in Excel/Google Sheets
3. **Chart Tools**: Import into visualization software

### Embedding Analytics

Embed analytics sections in other notes:

```markdown
![[Monthly Dashboard#Overview Metrics]]
```

This displays just the Overview Metrics section.

---

## Customization

### Modifying Dashboard Queries

All dashboards use DataviewJS. To customize:

1. **Find the section** to modify
2. **Locate the DataviewJS block** (```dataviewjs)
3. **Edit the JavaScript** code
4. **Test changes** by viewing dashboard

### Adding New Metrics

Example: Add "most used origin" to Monthly Dashboard:

```javascript
// Get most common origin
const originFreq = {};
logs.forEach(log => {
  const origin = log.origin || "Unknown";
  originFreq[origin] = (originFreq[origin] || 0) + 1;
});

const topOrigin = Object.entries(originFreq)
  .sort((a, b) => b[1] - a[1])[0];

dv.paragraph(`**Most Used Origin**: ${topOrigin[0]} (${topOrigin[1]} sessions)`);
```

### Creating Custom Dashboards

1. **Create new file** in `Analytics/` folder
2. **Add frontmatter**:
   ```yaml
   ---
   type: analytics-dashboard
   dashboard-type: custom
   ---
   ```
3. **Add DataviewJS queries** using existing dashboards as templates
4. **Use stats-utils.js** for calculations
5. **Apply CSS classes** from coffee-vault-theme.css

### Styling Customization

Dashboards use CSS classes from `CSS/coffee-vault-theme.css`:

- `.coffee-dashboard`: Grid layout container
- `.coffee-stat`: Metric card with label/value
- `.coffee-table`: Styled data tables
- `.coffee-badge`: Status indicators

Modify CSS file to change appearance globally.

---

## Troubleshooting

### Common Issues

#### Dashboard Shows "No Data"

**Cause**: No files match query criteria

**Solution**:
1. Check folder paths in queries match your structure
2. Verify property names match Property Schema exactly
3. Ensure files have `type` property set correctly
4. Check date formats are YYYY-MM-DD

#### "Dataview/DataviewJS not enabled"

**Cause**: Plugin not installed or disabled

**Solution**:
1. Install Dataview plugin
2. Enable JavaScript queries in settings:
   - Settings → Dataview → Enable JavaScript Queries

#### Calculations Return 0 or NaN

**Cause**: Missing or incorrect data types

**Solution**:
1. Verify numeric fields are numbers (not quoted strings)
2. Check for null/undefined values
3. Ensure array fields use proper YAML syntax:
   ```yaml
   flavor-notes: [chocolate, berry]  # Correct
   flavor-notes: chocolate, berry     # Incorrect
   ```

#### Performance Issues (Slow Loading)

**Cause**: Too many files or complex queries

**Solution**:
1. Add `.limit()` to queries
2. Use more specific WHERE clauses
3. Consider caching results for large vaults
4. Split complex dashboards into smaller ones

### Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Cannot read property 'x'" | Missing property | Add property or use optional chaining (?.) |
| "filter is not a function" | Variable is not array | Check data type, convert if needed |
| "Division by zero" | Empty dataset | Add guards: `if (count > 0)` |
| "Maximum call stack" | Infinite loop | Check for circular references |

### Getting Help

1. **Check Examples**: See `Examples/Analytics-Examples.md`
2. **Review Documentation**: This file and Property Schema
3. **Inspect Queries**: Use console.log() for debugging
4. **Validate Data**: Ensure Property Schema compliance

---

## Best Practices

### Data Entry

**Be Consistent**:
- Log sessions regularly (ideally every brewing)
- Use same terminology (Property Schema values)
- Fill required fields completely
- Add optional fields when possible

**Be Accurate**:
- Measure parameters precisely (temperature, time)
- Rate immediately after tasting
- Record actual observations, not expectations
- Include negative results (learn from failures)

**Be Detailed**:
- Add multiple flavor notes
- Include contextual information
- Document experiments clearly
- Note equipment changes

### Analysis Workflow

**Weekly**: Quick check of recent sessions
```markdown
- Review last 7 days of logs
- Check for any outliers or issues
- Adjust parameters if needed
```

**Monthly**: Comprehensive review using Monthly Dashboard
```markdown
- Generate monthly report
- Review all metrics and trends
- Identify improvement areas
- Plan next month's experiments
```

**Quarterly**: Deep dive with all dashboards
```markdown
- Cost Intelligence: Budget review
- Brewing Optimizer: Parameter refinement
- Palate Development: Skill assessment
- Set quarterly goals
```

### Interpretation Guidelines

**Don't Over-Interpret**:
- Need adequate sample size (10+ for trends)
- Correlation ≠ causation
- Consider confounding variables

**Look for Patterns**:
- Consistent issues → systematic problem
- Random variation → normal
- Gradual trends → meaningful change

**Take Action**:
- Use insights to make changes
- Test recommendations systematically
- Document results of changes
- Iterate based on data

### Privacy & Backup

**Sensitive Data**:
- Financial information is local only
- No cloud sync of purchasing data (unless you choose)
- Personal tasting notes remain private

**Backup Strategy**:
```markdown
1. Regular Obsidian vault backups
2. Export important analytics as PDF monthly
3. Keep raw data (logs) as source of truth
4. Version control using git (optional)
```

---

## Advanced Topics

### Statistical Significance

Most dashboards don't perform formal significance testing. Guidelines:

- **Correlation**: |r| > 0.5 with n > 20 likely meaningful
- **Trends**: Check R² > 0.5 for reliable predictions
- **Comparisons**: Effect size > 0.5 suggests real difference

### Custom Statistical Functions

Extend stats-utils.js with domain-specific functions:

```javascript
// Add to stats-utils.js
function extractionYield(tds, yield, dose) {
  return (tds * yield) / dose * 100;
}

module.exports = {
  // existing exports...
  extractionYield
};
```

### Performance Optimization

For large vaults (1000+ logs):

1. **Index frequently used fields**
2. **Cache expensive calculations**
3. **Limit query scope** (date ranges)
4. **Use async/await** for complex operations
5. **Consider pre-aggregation** for summaries

### API Integration (Future)

Planned features:
- Export to JSON API
- Import from other coffee apps
- Sync with brewing equipment
- Cloud analytics dashboards

---

## Changelog

### Version 1.0.0 (2025-10-25)

**Initial Release**:
- Monthly Dashboard with comprehensive metrics
- Brewing Optimizer with correlation analysis
- Cost Intelligence financial tracking
- Palate Development sensory tracking
- Statistical utilities library (stats-utils.js)
- Complete documentation
- Example workflows

---

## Credits & License

**Developed for**: Coffee Vault Obsidian system
**Author**: Analytics Sub-Agent
**Version**: 1.0.0
**License**: MIT (use freely, attribution appreciated)

**Dependencies**:
- Obsidian.md
- Dataview plugin
- Property Schema v1.0.0
- CSS Theme v1.0.0

---

## Next Steps

1. **Start Logging**: Use Coffee Log templates consistently
2. **Build Dataset**: Aim for 20+ sessions before heavy analysis
3. **Explore Dashboards**: Open each analytics dashboard
4. **Run Examples**: Follow tutorials in Analytics-Examples.md
5. **Customize**: Adapt dashboards to your specific needs
6. **Share Insights**: Use analytics to improve your coffee game!

---

*For detailed usage examples, see [[Analytics-Examples]]*
*For property specifications, see [[Property Schema]]*
*For template integration, see [[Template Framework Standards]]*
