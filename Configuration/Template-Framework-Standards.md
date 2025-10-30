---
type: configuration-document
title: Template Framework Standards
version: 5.1.0
date: 2025-10-28
status: authoritative
---

# 📝 Template Framework Standards - Version 5.1

**Purpose**: This document defines authoritative standards for creating and maintaining Templater templates within the Coffee Vault. All template developers must follow these conventions to ensure consistency, maintainability, and user experience quality.

**Status**: **AUTHORITATIVE** - All templates must conform to this specification

**Version**: 5.1.0 Production Edition

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Template Architecture](#template-architecture)
3. [Property Initialization](#property-initialization)
4. [Cursor Positioning Strategy](#cursor-positioning-strategy)
5. [Error Handling](#error-handling)
6. [Datacore Query Integration](#datacore-query-integration)
7. [JavaScript in Templates](#javascript-in-templates)
8. [User Experience Patterns](#user-experience-patterns)
9. [Naming Conventions](#naming-conventions)
10. [Testing and Validation](#testing-and-validation)
11. [Examples](#examples)
12. [Troubleshooting](#troubleshooting)

---

## Overview

### Design Philosophy

Coffee Vault templates are built on three core principles:

1. **Consistency**: All templates follow identical structural patterns
2. **Intelligence**: Templates provide smart defaults and suggestions
3. **Efficiency**: Users can create notes in < 60 seconds

### Template Types

The Coffee Vault includes these template categories:

| Category | Templates | Purpose |
|----------|-----------|---------|
| **Daily Practice** | Coffee Log, Daily Note, Quick Capture | Session tracking |
| **Reference** | Bean Profile, Roaster Profile, Origin Profile, Equipment Profile | Entity documentation |
| **Guides** | Brewing Guide, Scientific Reference, Processing Method | Educational content |
| **Aggregation** | Weekly Summary, Monthly Report | Analytics and review |
| **Sensory** | Sensory Evaluation, Cupping Session | Quality assessment |

### Technology Stack

**Primary**: Templater Plugin (JavaScript-based templating)
**Supporting**:
- Datacore Plugin (data aggregation)
- Moment.js (date handling)
- JavaScript ES6+ (logic and automation)

---

## Template Architecture

### Standard Template Structure

All templates MUST follow this exact structure:

```markdown
<%*
// ============================================
// TEMPLATE: [Template Name]
// VERSION: 3.0.0
// PURPOSE: [Brief description]
// ============================================

// SECTION 1: Configuration and Imports
// SECTION 2: Helper Functions (if needed)
// SECTION 3: Data Gathering and Suggestions
// SECTION 4: Property Initialization
// SECTION 5: Cursor Positioning (ONCE ONLY)
%>
---
[YAML Frontmatter Properties]
---

# [Note Title with Dynamic Elements]

[Main Content Structure]

## [Sections with headings]

[Footer/Metadata]
```

### Detailed Section Breakdown

#### Section 1: Configuration and Imports

**Purpose**: Set up the template environment

```javascript
<%*
// ============================================
// TEMPLATE: Coffee Log Enhanced
// VERSION: 3.0.0
// PURPOSE: Daily coffee brewing session tracking with intelligent suggestions
// ============================================

// SECTION 1: Configuration and Imports
const moment = tp.date.now;
const currentDate = tp.file.creation_date("YYYY-MM-DD");
const currentTime = tp.file.creation_date("HH:mm");

// Import utility functions (if available)
let helpers;
try {
  helpers = await tp.user.require("Scripts/template-helpers.js");
} catch (e) {
  // Fallback if helpers not available
  helpers = null;
}
%>
```

**Requirements**:
- Always include template header comment block
- Version number must match vault version
- Purpose description in one line
- Import dependencies with try-catch
- Use `const` for immutable values, `let` for mutable

#### Section 2: Helper Functions

**Purpose**: Define template-specific utility functions

```javascript
<%*
// SECTION 2: Helper Functions

/**
 * Calculate brew ratio from dose and water
 * @param {number} dose - Coffee dose in grams
 * @param {number} water - Water in grams/ml
 * @returns {string} Ratio in "1:X" format
 */
function calculateRatio(dose, water) {
  if (!dose || !water) return "";
  const ratio = (water / dose).toFixed(1);
  return `1:${ratio}`;
}

/**
 * Generate star rating display
 * @param {number} rating - Rating value (1-5)
 * @returns {string} Star string
 */
function starRating(rating) {
  if (!rating) return "";
  const fullStars = Math.floor(rating);
  const halfStar = (rating % 1) >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  return "★".repeat(fullStars) + (halfStar ? "½" : "") + "☆".repeat(emptyStars);
}
%>
```

**Requirements**:
- Use JSDoc comments for all functions
- Include parameter and return type documentation
- Handle edge cases (null, undefined, zero)
- Keep functions pure (no side effects)
- Limit to template-specific logic only

#### Section 3: Data Gathering and Suggestions

**Purpose**: Intelligently suggest values based on user history

```javascript
<%*
// SECTION 3: Data Gathering and Suggestions

// Get user's recent coffee logs
const recentLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .sort(p => p.date, 'desc')
  .limit(10)
  .array();

// Suggest most frequently used bean
const beanCounts = {};
recentLogs.forEach(log => {
  if (log.beans) {
    beanCounts[log.beans] = (beanCounts[log.beans] || 0) + 1;
  }
});

const suggestedBean = Object.keys(beanCounts).length > 0
  ? Object.keys(beanCounts).reduce((a, b) => beanCounts[a] > beanCounts[b] ? a : b)
  : "";

// Suggest most common brew method
const methodCounts = {};
recentLogs.forEach(log => {
  if (log["brew-method"]) {
    methodCounts[log["brew-method"]] = (methodCounts[log["brew-method"]] || 0) + 1;
  }
});

const suggestedMethod = Object.keys(methodCounts).length > 0
  ? Object.keys(methodCounts).reduce((a, b) => methodCounts[a] > methodCounts[b] ? a : b)
  : "v60";

// Get last used parameters for suggested bean
const lastBeanLog = recentLogs.find(log => log.beans === suggestedBean);
const suggestedDose = lastBeanLog?.dose || 15;
const suggestedWater = lastBeanLog?.water || 250;
const suggestedGrind = lastBeanLog?.["grind-size"] || "medium";
const suggestedTemp = lastBeanLog?.["water-temperature"] || 93;
%>
```

**Requirements**:
- Always use Datacore queries for data access
- Limit query results for performance (`.limit(10)` or `.limit(50)`)
- Provide sensible defaults if no history exists
- Use optional chaining (`?.`) for safe property access
- Cache query results to avoid duplicate queries

#### Section 4: Property Initialization

**Purpose**: Set frontmatter properties with smart defaults

```javascript
<%*
// SECTION 4: Property Initialization

// Frontmatter will be populated below using these values
const properties = {
  type: "coffee-log",
  date: currentDate,
  time: currentTime,
  beans: suggestedBean,
  "brew-method": suggestedMethod,
  dose: suggestedDose,
  water: suggestedWater,
  "brew-ratio": calculateRatio(suggestedDose, suggestedWater),
  "grind-size": suggestedGrind,
  "water-temperature": suggestedTemp,
  rating: null,  // User will fill
  notes: ""
};

// Note: Frontmatter is inserted below in YAML block
%>
```

**Requirements**:
- Create `properties` object with all required fields
- Use Property Schema as authoritative source
- Initialize required properties (never null/undefined)
- Leave user-input properties as null or empty string
- Calculate derived properties (like brew-ratio)

#### Section 5: Cursor Positioning

**Purpose**: Place cursor at optimal position for user input

```javascript
<%*
// SECTION 5: Cursor Positioning
// CRITICAL: Use tp.file.cursor() EXACTLY ONCE per template

// Cursor will be placed in Notes section below
%>
```

**Requirements**:
- Call `tp.file.cursor()` EXACTLY ONCE per template
- Never call multiple times (unpredictable behavior)
- Position after required fields, before optional
- Typically in main content area, not frontmatter
- Mark position clearly with comment

### Frontmatter Section

**Purpose**: Define note properties in YAML format

```markdown
---
type: <%= properties.type %>
date: <%= properties.date %>
time: <%= properties.time %>
beans: <%= properties.beans %>
brew-method: <%= properties["brew-method"] %>
dose: <%= properties.dose %>
water: <%= properties.water %>
brew-ratio: <%= properties["brew-ratio"] %>
grind-size: <%= properties["grind-size"] %>
water-temperature: <%= properties["water-temperature"] %>
rating:
notes: ""
tags: [coffee-log, <%= properties["brew-method"] %>]
---
```

**Requirements**:
- Use `<%= %>` for dynamic values
- Reference `properties` object consistently
- Leave user-input fields with cursor-ready format
- Use proper YAML syntax (quotes for strings with special chars)
- Include type property (required for all notes)
- Add appropriate tags for discoverability

### Content Section

**Purpose**: Provide structured content with guidance

```markdown
# ☕ Coffee Log - <%= tp.date.now("MMMM D, YYYY") %>

**Bean**: [[<%= properties.beans || "Select Bean" %>]]
**Method**: <%= properties["brew-method"] %>
**Rating**: ⭐⭐⭐⭐⭐ (rate below)

---

## 📊 Brewing Parameters

- **Dose**: <%= properties.dose %>g
- **Water**: <%= properties.water %>g
- **Ratio**: <%= properties["brew-ratio"] %>
- **Grind**: <%= properties["grind-size"] %>
- **Temperature**: <%= properties["water-temperature"] %>°C
- **Brew Time**: _:__

---

## 🎯 Tasting Notes

**Rating**: `<% tp.file.cursor() %>` / 5.0

**Aroma**:

**Flavor**:

**Acidity**:

**Body**:

**Finish**:

**Notes**:
```

**Requirements**:
- Use emoji for visual appeal (but sparingly)
- Include dynamic date/time formatting
- Create WikiLinks for relationships
- Use markdown formatting for structure
- Place cursor position for primary user input
- Provide inline hints (e.g., `_:__` for time)

---

## Property Initialization

### Initialization Patterns

#### Pattern 1: Simple Static Value

```javascript
const properties = {
  type: "coffee-log",  // Fixed value, never changes
  created: tp.file.creation_date("YYYY-MM-DD HH:mm")  // Dynamic but static once set
};
```

**Use when**: Property has one correct value

#### Pattern 2: Suggested with Fallback

```javascript
const suggestedBean = recentLogs.length > 0 ? recentLogs[0].beans : "";
const properties = {
  beans: suggestedBean || "Select a bean"  // Suggestion with user-friendly fallback
};
```

**Use when**: Want to suggest but allow easy override

#### Pattern 3: Calculated from Other Properties

```javascript
const properties = {
  dose: 15,
  water: 250,
  "brew-ratio": `1:${(250/15).toFixed(1)}`  // Calculated
};
```

**Use when**: Property derives from other values

#### Pattern 4: Conditional Logic

```javascript
const isEspresso = suggestedMethod === "espresso";
const properties = {
  "brew-method": suggestedMethod,
  dose: isEspresso ? 18 : 15,  // Conditional
  water: isEspresso ? 36 : 250
};
```

**Use when**: Values depend on context

#### Pattern 5: User Prompt

```javascript
const userName = await tp.system.prompt("Enter your name");
const properties = {
  author: userName || "Anonymous"  // User input with fallback
};
```

**Use when**: Must get user input during template execution

**WARNING**: Use sparingly! Prompts interrupt flow.

### Property Validation

Always validate property values before assignment:

```javascript
/**
 * Validate and sanitize dose value
 */
function validateDose(dose) {
  const parsed = parseFloat(dose);
  if (isNaN(parsed) || parsed <= 0) return 15;  // Default
  if (parsed < 5) return 5;    // Minimum
  if (parsed > 100) return 100;  // Maximum
  return parsed;
}

const properties = {
  dose: validateDose(suggestedDose)
};
```

**Validation Rules**:
- Always provide default for invalid input
- Enforce minimums and maximums from Property Schema
- Return same type as expected (number, string, boolean)
- Log warnings for unexpected values (development only)

---

## Cursor Positioning Strategy

### The One Cursor Rule

**CRITICAL**: Every template MUST call `tp.file.cursor()` EXACTLY ONCE.

**Why?**:
- Multiple calls create unpredictable cursor placement
- Templater doesn't support multiple cursor positions
- User experience depends on consistent cursor location

### Optimal Cursor Placement

**Decision Tree**:

1. **Is there critical frontmatter user must fill?**
   → Yes: Place cursor at first empty required field in frontmatter
   → No: Continue

2. **Is there a primary content input area?**
   → Yes: Place cursor there (most common)
   → No: Continue

3. **Are there multiple optional fields?**
   → Yes: Place cursor at first optional field
   → No: Place at end of document

### Placement Examples

#### Example 1: Main Content Area (Most Common)

```markdown
## Notes

<% tp.file.cursor() %>

## Tags
```

**Use case**: Standard notes where main value is in content

#### Example 2: Critical Frontmatter Field

```markdown
---
type: bean-profile
name: <% tp.file.cursor() %>
roaster:
origin:
---
```

**Use case**: Note type depends on name being set first

#### Example 3: First Data Entry Point

```markdown
## Tasting Notes

**Rating**: <% tp.file.cursor() %> / 5.0

**Flavor**:
```

**Use case**: User's primary task is entering rating

### Cursor Markers

When cursor cannot be placed immediately, use markers:

```markdown
## Notes

[TYPE YOUR NOTES HERE]
```

or

```markdown
## Notes

_Enter your observations..._
```

**Not recommended** but acceptable if cursor placement impossible.

---

## Error Handling

### Error Handling Philosophy

1. **Fail Gracefully**: Never break template execution
2. **Provide Defaults**: Always have fallback values
3. **Silent Recovery**: Don't show errors to user unless critical
4. **Log for Debugging**: Console.log errors in development

### Try-Catch Pattern

**Standard Pattern**:

```javascript
let helpers = null;
try {
  helpers = await tp.user.require("Scripts/template-helpers.js");
} catch (e) {
  console.log("Template helpers not available, using fallback functions");
  // Define inline fallbacks
  helpers = {
    formatDate: (date) => date,
    calculateRatio: (dose, water) => `1:${(water/dose).toFixed(1)}`
  };
}
```

**When to use**:
- External script imports
- File system operations
- Complex calculations that might fail
- Any operation that could throw an error

### Null/Undefined Safety

**Always use optional chaining and nullish coalescing**:

```javascript
// ❌ BAD - Will throw error if property missing
const roaster = beanProfile.roaster;

// ✅ GOOD - Safe access with fallback
const roaster = beanProfile?.roaster ?? "Unknown";

// ✅ GOOD - Array operations
const avgRating = recentLogs?.reduce((sum, log) => sum + (log?.rating ?? 0), 0) / (recentLogs?.length || 1);
```

### Data Query Safety

**Always validate query results**:

```javascript
const recentLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .limit(10)
  .array();

// ✅ Check if results exist
if (!recentLogs || recentLogs.length === 0) {
  // Handle empty case
  const suggestedBean = "";
  const suggestedMethod = "v60";
} else {
  // Process results
  const suggestedBean = recentLogs[0].beans;
  const suggestedMethod = recentLogs[0]["brew-method"];
}
```

### Validation Functions

**Create dedicated validation functions**:

```javascript
/**
 * Validate rating value
 * @param {any} rating - Rating to validate
 * @returns {number|null} - Valid rating or null
 */
function validateRating(rating) {
  if (rating === null || rating === undefined) return null;
  const num = parseFloat(rating);
  if (isNaN(num)) return null;
  if (num < 1) return 1;
  if (num > 5) return 5;
  return Math.round(num * 2) / 2;  // Round to nearest 0.5
}
```

---

## Datacore Query Integration

### Query Structure

**Standard Datacore Query Pattern**:

```javascript
const pages = dv.pages(source)
  .where(filterFunction)
  .sort(sortFunction, direction)
  .limit(maxResults)
  .array();
```

### Source Specifications

| Source Type | Syntax | Example |
|-------------|--------|---------|
| Folder | `"FolderName"` | `dv.pages('"Coffee Logs"')` |
| Tag | `#tagname` | `dv.pages('#coffee-log')` |
| Type Property | Combine with where | `dv.pages().where(p => p.type === "coffee-log")` |
| Multiple Sources | Array | `dv.pages(['"Folder1"', '"Folder2"'])` |

### Filter Functions

**Common Filter Patterns**:

```javascript
// By property value
.where(p => p.type === "coffee-log")

// By date range
.where(p => p.date >= "2025-10-01" && p.date <= "2025-10-31")

// By rating threshold
.where(p => p.rating && p.rating >= 4.0)

// By existence of property
.where(p => p.beans && p.beans !== "")

// Complex conditions
.where(p =>
  p.type === "coffee-log" &&
  p.rating >= 4.0 &&
  p["brew-method"] === "v60"
)
```

### Sort Functions

**Common Sort Patterns**:

```javascript
// By date descending (most recent first)
.sort(p => p.date, 'desc')

// By rating ascending
.sort(p => p.rating, 'asc')

// By multiple criteria
.sort((a, b) => {
  // Sort by rating desc, then date desc
  if (a.rating !== b.rating) return b.rating - a.rating;
  return b.date - a.date;
})

// By computed value
.sort(p => p.dose / p.water, 'desc')  // By strength
```

### Aggregation Patterns

**Common Aggregations**:

```javascript
// Count
const totalSessions = pages.length;

// Sum
const totalCoffee = pages.reduce((sum, p) => sum + (p.dose || 0), 0);

// Average
const avgRating = pages.reduce((sum, p) => sum + (p.rating || 0), 0) / pages.length;

// Group by
const byMethod = pages.reduce((groups, p) => {
  const method = p["brew-method"] || "unknown";
  groups[method] = (groups[method] || []).concat(p);
  return groups;
}, {});

// Find max/min
const bestRated = pages.reduce((best, p) =>
  (p.rating > best.rating) ? p : best
, pages[0]);
```

### Performance Considerations

**Optimization Rules**:

1. **Always use `.limit()`**:
```javascript
// ❌ BAD - Could return thousands
const allLogs = dv.pages('"Coffee Logs"').array();

// ✅ GOOD - Limit to what you need
const recentLogs = dv.pages('"Coffee Logs"')
  .limit(10)
  .array();
```

2. **Filter before sort**:
```javascript
// ❌ BAD - Sort everything then filter
dv.pages('"Coffee Logs"')
  .sort(p => p.date, 'desc')
  .where(p => p.rating >= 4.0)

// ✅ GOOD - Filter first
dv.pages('"Coffee Logs"')
  .where(p => p.rating >= 4.0)
  .sort(p => p.date, 'desc')
```

3. **Cache query results**:
```javascript
// ❌ BAD - Query multiple times
const avgV60 = dv.pages('"Coffee Logs"').where(...).reduce(...);
const avgChemex = dv.pages('"Coffee Logs"').where(...).reduce(...);

// ✅ GOOD - Query once, filter in JavaScript
const allLogs = dv.pages('"Coffee Logs"').array();
const avgV60 = allLogs.filter(p => p["brew-method"] === "v60").reduce(...);
const avgChemex = allLogs.filter(p => p["brew-method"] === "chemex").reduce(...);
```

---

## JavaScript in Templates

### ES6+ Features

**Supported Features**:

```javascript
// Template literals
const greeting = `Hello, ${userName}`;

// Arrow functions
const double = x => x * 2;

// Destructuring
const { dose, water, rating } = lastLog;

// Spread operator
const allProperties = { ...defaultProps, ...userProps };

// Optional chaining
const roaster = bean?.roaster?.name;

// Nullish coalescing
const dose = userDose ?? defaultDose ?? 15;

// Array methods
const topRated = logs
  .filter(l => l.rating >= 4.5)
  .map(l => l.beans)
  .slice(0, 5);
```

### Async/Await

**Template scripts are async by default**:

```javascript
<%*
// Can use await directly
const helpers = await tp.user.require("Scripts/helpers.js");
const userName = await tp.system.prompt("Name?");

// Can define async functions
async function fetchData() {
  const data = await someAsyncOperation();
  return data;
}

const result = await fetchData();
%>
```

### Module Imports

**Importing Custom Scripts**:

```javascript
<%*
// Import entire module
const helpers = await tp.user.require("Scripts/template-helpers.js");
helpers.formatDate(new Date());

// Import with destructuring
const { calculateRatio, formatRating } = await tp.user.require("Scripts/template-helpers.js");
calculateRatio(15, 250);
%>
```

**Creating Reusable Modules** (`Scripts/template-helpers.js`):

```javascript
/**
 * Template Helper Functions
 * Reusable utilities for Templater templates
 */

/**
 * Calculate brew ratio
 */
function calculateRatio(dose, water) {
  if (!dose || !water) return "";
  return `1:${(water / dose).toFixed(1)}`;
}

/**
 * Format rating as stars
 */
function formatRating(rating) {
  if (!rating) return "";
  const full = Math.floor(rating);
  const half = (rating % 1) >= 0.5;
  return "★".repeat(full) + (half ? "☆" : "") + "☆".repeat(5 - full - (half ? 1 : 0));
}

/**
 * Calculate days since date
 */
function daysSince(date) {
  const then = new Date(date);
  const now = new Date();
  const diff = now - then;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// Export all functions
module.exports = {
  calculateRatio,
  formatRating,
  daysSince
};
```

### Moment.js Integration

**Templater provides Moment.js access**:

```javascript
<%*
// Current date/time
const now = tp.date.now("YYYY-MM-DD");
const time = tp.date.now("HH:mm");

// Formatted dates
const prettyDate = tp.date.now("MMMM D, YYYY");  // "October 25, 2025"
const isoDate = tp.date.now("YYYY-MM-DD");        // "2025-10-25"

// Relative dates
const yesterday = tp.date.now("YYYY-MM-DD", -1);  // Yesterday
const nextWeek = tp.date.now("YYYY-MM-DD", 7);    // 7 days from now

// Custom date formatting
const weekday = tp.date.now("dddd");  // "Friday"
const monthName = tp.date.now("MMMM");  // "October"
%>
```

---

## User Experience Patterns

### Progressive Disclosure

**Show complexity only when needed**:

```markdown
## Basic Brewing Parameters

- Dose: <%= dose %>g
- Water: <%= water %>g
- Ratio: <%= ratio %>

<details>
<summary>⚙️ Advanced Parameters (click to expand)</summary>

- Grind Clicks:
- Bloom Time:
- Pour Count:
- Agitation:
- TDS:

</details>
```

### Guided Input

**Provide inline help**:

```markdown
## Tasting Notes

**Aroma** (e.g., floral, fruity, nutty): <% tp.file.cursor() %>

**Flavor** (dominant flavor):

**Acidity** (low/medium/high):

**Body** (light/medium/full):
```

### Smart Defaults

**Learn from user history**:

```javascript
// Get user's average dose for this method
const avgDose = recentLogs
  .filter(l => l["brew-method"] === suggestedMethod)
  .reduce((sum, l) => sum + (l.dose || 0), 0) / recentLogs.length;

const properties = {
  dose: avgDose || 15  // Use average or default
};
```

### Contextual Suggestions

**Adapt to current context**:

```javascript
// If it's morning, suggest lighter roasts
const hour = parseInt(tp.date.now("HH"));
const isMorning = hour >= 6 && hour < 12;

const suggestedRoast = isMorning ? "light" : "medium";
```

### Validation Hints

**Show valid ranges inline**:

```markdown
**Rating** (1.0 - 5.0): <% tp.file.cursor() %>

**Water Temperature** (85-100°C):

**Dose** (10-30g typical):
```

---

## Naming Conventions

### Template File Names

**Format**: `[Type]-[Variant].md`

**Examples**:
- `Coffee-Log-Enhanced.md`
- `Bean-Profile-Standard.md`
- `Monthly-Report-Detailed.md`
- `Quick-Capture-Mobile.md`

**Rules**:
- Use Title Case with hyphens
- Include variant if multiple versions exist
- Extension always `.md`
- No special characters except hyphens

### Variable Naming

**JavaScript Variables**:

```javascript
// Use camelCase
const suggestedBean = "";
const brewMethod = "v60";
const waterTemperature = 93;

// Boolean prefixes: is, has, should
const isEspresso = method === "espresso";
const hasGrinder = grinder !== "";
const shouldSuggest = recentLogs.length > 0;

// Arrays: plural nouns
const recentLogs = [];
const topBeans = [];
const methodCounts = {};

// Functions: verb + noun
function calculateRatio(dose, water) {}
function formatRating(rating) {}
function validateDose(dose) {}
```

**Property Names** (follow Property Schema):

```javascript
// Use kebab-case (matches Property Schema)
const properties = {
  "brew-method": "v60",
  "grind-size": "medium",
  "water-temperature": 93,
  "brew-ratio": "1:16.7"
};
```

### Function Naming

**Verb-first naming**:

| Purpose | Verb | Example |
|---------|------|---------|
| Retrieve | get | `getRecentLogs()` |
| Create | create, make | `createProperties()` |
| Validate | validate, check | `validateDose()` |
| Calculate | calculate, compute | `calculateRatio()` |
| Format | format | `formatDate()` |
| Transform | convert, transform | `convertToGrams()` |

---

## Testing and Validation

### Pre-Release Checklist

Before deploying a template, verify:

- [ ] Executes without errors
- [ ] All required properties initialized
- [ ] Cursor positioned optimally
- [ ] Suggestions working (test with/without history)
- [ ] Fallbacks functional (test with no data)
- [ ] No console errors
- [ ] Property names match Property Schema
- [ ] Documentation comment blocks complete
- [ ] Follows template structure standard

### Manual Testing Scenarios

**Test Case 1: New User (No History)**
- Delete all coffee logs
- Execute template
- Verify: Sensible defaults, no errors, helpful hints

**Test Case 2: Experienced User (Rich History)**
- Create 10+ varied coffee logs
- Execute template
- Verify: Accurate suggestions, recent preferences used

**Test Case 3: Edge Cases**
- Test with missing properties
- Test with invalid values
- Test with empty strings
- Verify: Graceful degradation, no crashes

### Common Issues and Fixes

**Issue**: Cursor doesn't appear

```javascript
// ❌ Problem: Called cursor multiple times
<% tp.file.cursor() %>
...
<% tp.file.cursor() %>

// ✅ Solution: Call only once
<% tp.file.cursor() %>
```

**Issue**: Properties not initializing

```javascript
// ❌ Problem: Using undefined variable
beans: <%= suggestedBean %>  // If suggestedBean not defined

// ✅ Solution: Always define with fallback
const suggestedBean = recentLogs[0]?.beans ?? "";
```

**Issue**: Datacore query fails

```javascript
// ❌ Problem: No error handling
const logs = dv.pages('"Coffee Logs"').array();

// ✅ Solution: Validate results
const logs = dv.pages('"Coffee Logs"').array();
if (!logs || logs.length === 0) {
  // Handle empty case
}
```

---

## Examples

### Example 1: Simple Template (Bean Profile)

```markdown
<%*
// ============================================
// TEMPLATE: Bean Profile Standard
// VERSION: 3.0.0
// PURPOSE: Document coffee bean information
// ============================================

// SECTION 1: Configuration
const currentDate = tp.file.creation_date("YYYY-MM-DD");

// SECTION 2: No helper functions needed for simple template

// SECTION 3: No data gathering (new profile)

// SECTION 4: Property Initialization
const properties = {
  type: "bean-profile",
  date: currentDate,
  name: "",
  roaster: "",
  origin: "",
  "roast-level": "medium",
  "roast-date": "",
  "purchase-date": currentDate,
  tags: ["bean-profile"]
};
%>
---
type: <%= properties.type %>
date: <%= properties.date %>
name:
roaster:
origin:
roast-level: <%= properties["roast-level"] %>
roast-date:
purchase-date: <%= properties["purchase-date"] %>
tags: [bean-profile]
---

# 🌱 Bean Profile: <% tp.file.cursor() %>

**Roaster**: [[]]
**Origin**: [[]]
**Roast Level**: Medium
**Roast Date**:
**Purchase Date**: <%= properties["purchase-date"] %>

---

## Description



## Tasting Notes

**Primary Flavors**:

**Acidity**:

**Body**:

**Processing**:

---

## Brewing Recommendations

**Best Method**:

**Recommended Ratio**:

**Notes**:
```

### Example 2: Intelligent Template (Coffee Log Enhanced)

```markdown
<%*
// ============================================
// TEMPLATE: Coffee Log Enhanced
// VERSION: 3.0.0
// PURPOSE: Daily coffee brewing session with intelligent suggestions
// ============================================

// SECTION 1: Configuration and Imports
const moment = tp.date.now;
const currentDate = tp.file.creation_date("YYYY-MM-DD");
const currentTime = tp.file.creation_date("HH:mm");

let helpers;
try {
  helpers = await tp.user.require("Scripts/template-helpers.js");
} catch (e) {
  helpers = {
    calculateRatio: (d, w) => `1:${(w/d).toFixed(1)}`,
    formatRating: (r) => "★".repeat(Math.floor(r)) + "☆".repeat(5-Math.floor(r))
  };
}

// SECTION 2: Helper Functions
function getMostFrequent(array, property) {
  if (!array || array.length === 0) return null;
  const counts = {};
  array.forEach(item => {
    const value = item[property];
    if (value) counts[value] = (counts[value] || 0) + 1;
  });
  return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, null);
}

// SECTION 3: Data Gathering
const recentLogs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .sort(p => p.date, 'desc')
  .limit(10)
  .array();

const suggestedBean = getMostFrequent(recentLogs, "beans") || "";
const suggestedMethod = getMostFrequent(recentLogs, "brew-method") || "v60";

const lastLog = recentLogs.find(l => l.beans === suggestedBean) || recentLogs[0] || {};
const suggestedDose = lastLog?.dose || 15;
const suggestedWater = lastLog?.water || 250;
const suggestedGrind = lastLog?.["grind-size"] || "medium";
const suggestedTemp = lastLog?.["water-temperature"] || 93;

// SECTION 4: Property Initialization
const properties = {
  type: "coffee-log",
  date: currentDate,
  time: currentTime,
  beans: suggestedBean,
  "brew-method": suggestedMethod,
  dose: suggestedDose,
  water: suggestedWater,
  "brew-ratio": helpers.calculateRatio(suggestedDose, suggestedWater),
  "grind-size": suggestedGrind,
  "water-temperature": suggestedTemp,
  rating: null,
  notes: ""
};
%>
---
type: <%= properties.type %>
date: <%= properties.date %>
time: <%= properties.time %>
beans: <%= properties.beans %>
brew-method: <%= properties["brew-method"] %>
dose: <%= properties.dose %>
water: <%= properties.water %>
brew-ratio: <%= properties["brew-ratio"] %>
grind-size: <%= properties["grind-size"] %>
water-temperature: <%= properties["water-temperature"] %>
rating:
notes: ""
tags: [coffee-log, <%= properties["brew-method"] %>]
---

# ☕ Coffee Log - <%= tp.date.now("MMMM D, YYYY") %>

**Bean**: [[<%= properties.beans || "Select Bean" %>]]
**Method**: <%= properties["brew-method"] %>
**Time**: <%= properties.time %>

---

## 📊 Brewing Parameters

- **Dose**: <%= properties.dose %>g
- **Water**: <%= properties.water %>g
- **Ratio**: <%= properties["brew-ratio"] %>
- **Grind**: <%= properties["grind-size"] %>
- **Temperature**: <%= properties["water-temperature"] %>°C
- **Brew Time**: _:__

---

## 🎯 Tasting Notes

**Rating**: <% tp.file.cursor() %> / 5.0

**Aroma**:

**Flavor**:

**Acidity**:

**Body**:

**Finish**:

**Notes**:
```

---

## Troubleshooting

### Common Errors

**Error**: `ReferenceError: dv is not defined`

**Cause**: Datacore plugin not installed/enabled

**Fix**: Install Datacore plugin or add fallback:
```javascript
let dv;
try {
  dv = app.plugins.plugins.datacore.api;
} catch {
  console.log("Datacore not available");
  // Provide fallback or skip suggestions
}
```

**Error**: `Cannot read property 'X' of undefined`

**Cause**: Accessing property on undefined object

**Fix**: Use optional chaining:
```javascript
// ❌ const roaster = lastLog.beans.roaster;
// ✅ const roaster = lastLog?.beans?.roaster ?? "Unknown";
```

**Error**: Template executes but cursor disappears

**Cause**: Multiple `tp.file.cursor()` calls

**Fix**: Search template for all cursor calls, keep only one

**Error**: Properties not showing in frontmatter

**Cause**: Invalid YAML syntax

**Fix**: Validate YAML formatting, quote strings with special characters

### Debug Mode

**Enable logging for debugging**:

```javascript
<%*
const DEBUG = true;  // Set to false for production

if (DEBUG) {
  console.log("Recent logs:", recentLogs.length);
  console.log("Suggested bean:", suggestedBean);
  console.log("Properties:", properties);
}
%>
```

**View logs**: Developer Tools > Console (Ctrl+Shift+I)

---

## Summary

### Must Follow Rules

1. **Structure**: Follow standard template structure exactly
2. **Cursor**: Call `tp.file.cursor()` exactly once
3. **Properties**: Reference Property Schema for all property names
4. **Errors**: Handle all errors gracefully with try-catch
5. **Queries**: Limit Datacore queries with `.limit()`
6. **Validation**: Validate all user inputs and query results
7. **Documentation**: Include header comment block with version
8. **Naming**: Follow naming conventions (camelCase JS, kebab-case properties)
9. **Testing**: Test with no data, partial data, and full data
10. **Fallbacks**: Always provide sensible defaults

### Best Practices

✅ **DO**:
- Use optional chaining (`?.`) everywhere
- Provide helpful inline hints
- Suggest based on user history
- Cache query results
- Keep functions pure
- Document with JSDoc
- Test edge cases

❌ **DON'T**:
- Call cursor multiple times
- Use prompts unless necessary
- Query without limits
- Access properties without validation
- Ignore errors
- Hardcode values that should be dynamic
- Create templates without fallbacks

---

## Version History

### Version 3.0.0 (2025-10-25)
- Complete rewrite for Coffee Vault 3.0
- Enhanced intelligent suggestions
- Improved error handling standards
- Mobile template optimization guidelines
- Comprehensive examples

### Version 2.0.0 (Previous)
- Basic template structure
- Simple property initialization
- Limited suggestion capabilities

---

**Version**: 3.0.0
**Last Updated**: 2025-10-25
**Status**: Authoritative
**Maintainer**: Coffee Vault Development Team

*For questions about template development, consult this document first. For Property Schema questions, see Configuration/Property-Schema.md.*
