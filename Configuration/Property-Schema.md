---
type: configuration-document
title: Coffee Vault Property Schema
version: 3.0.0
date: 2025-10-25
status: authoritative
---

# ☕ Coffee Vault Property Schema - Version 3.0

**Purpose**: This document serves as the authoritative specification for all properties used throughout the Coffee Vault. Every template, query, and script must reference this schema to ensure consistency and compatibility.

**Status**: **AUTHORITATIVE** - All vault components must conform to this specification

**Version**: 3.0.0 Enhanced Edition

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Property Naming Conventions](#property-naming-conventions)
3. [Data Types and Validation](#data-types-and-validation)
4. [Note Type Specifications](#note-type-specifications)
5. [Shared Properties](#shared-properties)
6. [Property Index](#property-index)
7. [Validation Rules](#validation-rules)
8. [Migration Guide](#migration-guide)

---

## Overview

### Design Principles

1. **Consistency**: Same property names mean same things across all note types
2. **Discoverability**: Clear, descriptive property names
3. **Queryability**: All properties designed for Datacore queries
4. **Extensibility**: Easy to add custom properties without breaking existing queries
5. **Validation**: Type constraints and value ranges clearly defined
6. **Interoperability**: Properties support linking and cross-referencing

### Property Architecture

**Three-Tier System**:
1. **Core Properties**: Required on all notes (type, date, status)
2. **Shared Properties**: Common across multiple note types (rating, tags, etc.)
3. **Specialized Properties**: Unique to specific note types (brew-ratio, roast-level, etc.)

---

## Property Naming Conventions

### Naming Rules

✅ **DO**:
- Use lowercase with hyphens: `brew-method`, `grind-size`
- Be descriptive: `water-temperature` not `water-temp`
- Use consistent terminology: always `brew-method` never `brewing-method` or `method`
- Keep units implicit in name: `water-temperature` (assumed Celsius), `dose` (assumed grams)

❌ **DON'T**:
- Use camelCase: ~~`brewMethod`~~
- Use underscores: ~~`brew_method`~~
- Abbreviate unnecessarily: ~~`temp`~~ instead of `temperature`
- Mix singular/plural: choose one and stick with it

### Reserved Prefixes

- `has-*`: Boolean flags (has-equipment, has-grinder)
- `is-*`: Status flags (is-favorite, is-archived)
- `total-*`: Aggregated values (total-cost, total-sessions)
- `avg-*`: Calculated averages (avg-rating, avg-extraction)
- `last-*`: Temporal references (last-used, last-updated)

---

## Data Types and Validation

### Type System

| Type | Description | Example | Validation |
|------|-------------|---------|------------|
| `text` | Free-form string | "Colombia Huila" | Max 500 chars |
| `number` | Numeric value | 93.5 | Any valid number |
| `integer` | Whole number | 18 | No decimals |
| `date` | ISO date format | 2025-10-25 | YYYY-MM-DD |
| `datetime` | ISO datetime | 2025-10-25T14:30 | YYYY-MM-DDTHH:mm |
| `boolean` | True/false flag | true | true or false |
| `link` | Internal wiki link | [[Origin Ethiopia]] | Valid note link |
| `list` | Array of values | [floral, citrus, tea] | YAML list format |
| `select` | Controlled vocabulary | light | From defined list |
| `duration` | Time period | 3:30 | MM:SS or HH:MM:SS |
| `rating` | Numeric scale | 4.5 | Range specified |

### Validation Levels

**Level 1 - Critical**: Must be valid or note is unusable
- `type`: Must match defined note types
- `date`: Must be valid ISO date
- Required fields for each note type

**Level 2 - Important**: Should be valid but won't break queries
- Numeric ranges (e.g., rating 1-5)
- Select field vocabularies
- Link validity

**Level 3 - Optional**: Best practices but not enforced
- Text length recommendations
- Date ranges (e.g., future dates)
- List item suggestions

---

## Note Type Specifications

### 1. Coffee Log (`type: coffee-log`)

**Purpose**: Daily coffee brewing session records

**Required Properties**:
- `type`: coffee-log (fixed)
- `date`: Date of session (YYYY-MM-DD)
- `beans`: Bean profile used (link or text)
- `brew-method`: Brewing method used (select)
- `rating`: Overall quality rating (1-5 scale)

**Core Brewing Properties**:
```yaml
# Method & Equipment
brew-method: text (select from: v60, chemex, aeropress, french-press, espresso, moka-pot, clever, kalita-wave, siphon, cold-brew, other)
grinder: text/link (grinder name or equipment profile)
grinder-model: text (specific model)
brewer: text/link (brewing device)

# Parameters - Dose
dose: number (coffee weight in grams, 10-100)
water: number (total water in grams, 100-1000)
brew-ratio: text (calculated, format "1:16.5")

# Parameters - Grind
grind-size: text (select from: extra-fine, fine, medium-fine, medium, medium-coarse, coarse, extra-coarse)
grind-setting: text (grinder-specific setting, e.g., "15" or "3.5")
grind-clicks: integer (for click-based grinders, 0-50)

# Parameters - Water
water-temperature: number (Celsius, 85-100)
water-type: text (tap, filtered, distilled, remineralized, bottled)
tds: number (total dissolved solids in ppm, 0-300)

# Parameters - Time
brew-time: duration (MM:SS format, e.g., "3:30")
bloom-time: duration (for pour-over, e.g., "0:45")
bloom-water: number (bloom water in grams, 0-100)

# Parameters - Technique
pour-count: integer (number of pours for pour-over, 1-10)
pour-technique: text (continuous, pulse, spiral, center, etc.)
agitation: text (none, swirl, stir, shake)
```

**Extraction & Quality Properties**:
```yaml
# Extraction Metrics
extraction-yield: number (percentage, 15-25)
tds-brewed: number (total dissolved solids of brewed coffee, 1.0-2.0)
strength: text (select: weak, light, balanced, strong, very-strong)

# Quality Assessment
rating: number (overall quality, 1.0-5.0, 0.5 increments)
rating-aroma: number (1.0-5.0)
rating-flavor: number (1.0-5.0)
rating-acidity: number (1.0-5.0)
rating-body: number (1.0-5.0)
rating-balance: number (1.0-5.0)
rating-sweetness: number (1.0-5.0)
```

**Sensory Properties**:
```yaml
# Flavor Profile
descriptors: list (flavor descriptors, e.g., [chocolate, caramel, orange])
primary-flavor: text (dominant flavor note)
secondary-flavors: list (supporting notes)
defects: list (off-flavors if present)

# Sensory Attributes
acidity: text (select: low, medium-low, medium, medium-high, high)
acidity-type: text (citric, malic, tartaric, phosphoric, acetic)
body: text (select: light, medium-light, medium, medium-full, full)
body-texture: text (tea-like, silky, creamy, syrupy, viscous)
sweetness: text (select: none, subtle, moderate, pronounced, intense)
bitterness: text (select: none, subtle, moderate, pronounced, intense)
aftertaste: text (select: short, medium, long, lingering)
aftertaste-quality: text (clean, pleasant, sweet, astringent, bitter)
```

**Session Context Properties**:
```yaml
# Environmental
ambient-temperature: number (Celsius, 10-40)
ambient-humidity: number (percentage, 0-100)
altitude: number (meters above sea level)

# Personal Context
mood: text (tired, energetic, focused, relaxed)
time-of-day: text (morning, afternoon, evening, night)
companions: list (who you shared with)
location: text (home, office, cafe, travel)

# Notes & Observations
notes: text (free-form brewing notes and observations)
adjustment-next: text (what to change next time)
issues: text (problems encountered)
highlights: text (what worked well)

# Metadata
session-number: integer (session count for this bag of beans)
days-off-roast: integer (days since roast date)
bag-age: integer (days since opening bag)
is-favorite: boolean (mark exceptional sessions)
is-dialed-in: boolean (optimal parameters found)
share: boolean (share publicly)
```

**Calculated Properties** (auto-generated by templates):
```yaml
brew-ratio: text (calculated from dose and water)
extraction-yield: number (if TDS measured)
cost-per-cup: number (calculated from bean cost and dose)
```

---

### 2. Bean Profile (`type: bean-profile`)

**Purpose**: Comprehensive coffee bean documentation

**Required Properties**:
```yaml
type: bean-profile
date: date (date added to vault)
name: text (bean name/label, required)
roaster: text/link (roaster name or profile link, required)
origin: text/link (country or origin profile link, required)
```

**Origin & Sourcing Properties**:
```yaml
# Geographic Origin
origin: text/link (country, e.g., "Ethiopia" or [[Origin Ethiopia]])
region: text (specific region, e.g., "Yirgacheffe")
subregion: text (micro-region, e.g., "Kochere")
farm: text (farm or co-op name)
producer: text (farmer or producer name)
altitude: number (meters above sea level, 500-3000)
coordinates: text (GPS coordinates if known)

# Variety & Processing
variety: text (coffee variety/cultivar, e.g., "Heirloom", "Gesha", "Bourbon")
varieties: list (if blend, list all varieties)
processing: text (select: washed, natural, honey, wet-hulled, anaerobic, carbonic-maceration, experimental)
processing-detail: text (detailed processing notes)
fermentation: text (fermentation method/duration)
drying: text (drying method: patio, raised-beds, mechanical)
```

**Roasting & Purchase Properties**:
```yaml
# Roaster Information
roaster: text/link (roaster name)
roaster-location: text (city, state/country)
roaster-website: text (URL)
roast-date: date (YYYY-MM-DD, when roasted)
purchase-date: date (when you purchased)
roast-level: text (select: light, light-medium, medium, medium-dark, dark)
roast-style: text (Nordic, American, Italian, etc.)
roaster-notes: text (roaster's tasting notes)

# Purchase & Cost
purchase-price: number (total price paid)
weight-purchased: number (grams purchased)
cost-per-100g: number (calculated or entered)
purchase-location: text (where purchased)
purchase-link: text (URL if ordered online)
subscription: boolean (is this from subscription?)
```

**Physical & Quality Properties**:
```yaml
# Bean Characteristics
bean-size: text (screen size, e.g., "17+")
density: text (low, medium, high)
moisture: number (percentage, typically 10-12%)
water-activity: number (Aw value, 0.40-0.60)
defect-count: integer (defects per 300g sample)
grade: text (quality grade, e.g., "AA", "SHB", "Grade 1")
certification: list (organic, fair-trade, rainforest-alliance, etc.)
score: number (cupping score if known, 80-100)

# Appearance
color: text (bean color description)
color-agtron: number (Agtron roast color, 25-95)
uniformity: text (low, medium, high)
has-quakers: boolean (presence of underdeveloped beans)
has-defects: boolean (visible defects present)
```

**Flavor & Sensory Properties**:
```yaml
# Primary Descriptors
primary-notes: list (main flavor descriptors, e.g., [chocolate, orange, honey])
secondary-notes: list (supporting notes)
roaster-descriptors: list (roaster's flavor notes)
personal-descriptors: list (your tasting notes)

# Sensory Profile
acidity: text (low, medium-low, medium, medium-high, high)
body: text (light, medium-light, medium, medium-full, full)
sweetness: text (low, medium, high)
complexity: text (simple, moderate, complex, very-complex)
balance: text (unbalanced, fair, balanced, well-balanced)
```

**Brewing & Recommendations**:
```yaml
# Optimal Parameters (learned over time)
recommended-method: text (best brew method for this bean)
recommended-ratio: text (e.g., "1:16")
recommended-grind: text (grind size that works best)
recommended-temp: number (water temperature Celsius)
optimal-off-roast: integer (ideal days after roast)
brewing-notes: text (tips for brewing this bean)

# Usage Tracking
bag-opened: date (when bag was opened)
bag-finished: date (when bag was consumed)
current-weight: number (grams remaining)
is-current: boolean (currently using this bean)
is-archived: boolean (bag finished)
is-favorite: boolean (marked as favorite)
would-rebuy: boolean (would purchase again)
rebuy-priority: text (low, medium, high, must-have)
```

**Session Statistics** (calculated):
```yaml
total-sessions: integer (number of brewing sessions)
avg-rating: number (average rating across sessions)
best-rating: number (highest rating achieved)
total-consumed: number (grams consumed)
cost-per-session: number (average cost per session)
sessions-list: list (links to all coffee-log entries)
```

**Notes & Documentation**:
```yaml
description: text (general bean description)
story: text (origin story or producer background)
harvest-year: text (crop year)
import-date: date (when imported)
importer: text (importing company)
processing-notes: text (detailed processing information)
tasting-notes: text (comprehensive cupping notes)
pairing-suggestions: text (food pairings)
personal-notes: text (your observations and experiences)
tags: list (categorization tags)
```

---

### 3. Roaster Profile (`type: roaster-profile`)

**Purpose**: Roasting company information and relationship tracking

**Required Properties**:
```yaml
type: roaster-profile
name: text (roaster name, required)
location: text (city, state/country)
```

**Company Information**:
```yaml
# Basic Info
name: text (company name)
founded: text (year founded)
location: text (primary location)
additional-locations: list (other locations/cafes)
website: text (URL)
email: text (contact email)
phone: text (phone number)

# Social & Online Presence
instagram: text (Instagram handle)
facebook: text (Facebook page)
twitter: text (Twitter handle)
online-shop: text (e-commerce URL)
subscription-available: boolean (offers subscription)
wholesale: boolean (wholesale available)

# Business Details
roaster-size: text (select: micro, small, medium, large, corporation)
roaster-type: text (select: specialty, commercial, both)
roasting-equipment: text (roaster make/model if known)
capacity: text (production capacity)
```

**Quality & Sourcing**:
```yaml
# Sourcing Philosophy
sourcing-approach: text (direct-trade, fair-trade, etc.)
relationship-driven: boolean (builds farmer relationships)
transparency: text (select: low, medium, high, very-high)
sustainability-focus: boolean (emphasis on sustainability)
organic-focus: boolean (primarily organic beans)

# Quality Profile
typical-roast-level: text (light, medium, dark, varies)
roasting-style: text (Nordic, American, Italian, etc.)
quality-focus: text (select: commodity, commercial, specialty, ultra-specialty)
avg-coffee-score: number (typical cupping scores, 80-95)
competition-roaster: boolean (competes in competitions)
awards: list (notable awards or recognition)
```

**Offerings & Experience**:
```yaml
# Product Range
single-origin-focus: boolean (emphasizes single origins)
blend-focus: boolean (known for blends)
espresso-offerings: boolean (espresso-specific roasts)
decaf-offerings: boolean (offers decaf)
special-processing: boolean (experimental processing)
coffee-count: integer (typical number of offerings)

# Pricing & Value
price-range: text (select: budget, moderate, premium, luxury)
value-rating: text (select: poor, fair, good, excellent)
typical-price-per-kg: number (approximate price per kg)

# Customer Experience
shipping-speed: text (select: slow, average, fast, very-fast)
packaging-quality: text (select: poor, adequate, good, excellent)
customer-service: text (select: poor, adequate, good, excellent)
educational-content: boolean (provides brewing education)
transparency-details: boolean (detailed bean information)
```

**Personal Relationship**:
```yaml
# Engagement
date-discovered: date (when you found this roaster)
first-purchase: date (first purchase date)
total-purchases: integer (number of purchases)
total-spent: number (total amount spent)
subscription-member: boolean (have subscription)
subscription-start: date (subscription start date)
loyalty-member: boolean (member of loyalty program)

# Assessment
personal-rating: number (your rating 1-5)
would-recommend: boolean (would recommend to others)
favorite-offerings: list (your favorite beans from them)
disappointments: list (beans that didn't work for you)
preferred-for: text (what they excel at)

# Status
is-current-roaster: boolean (currently buying from)
is-favorite-roaster: boolean (marked as favorite)
is-archived: boolean (no longer purchasing from)
```

**Notes & Documentation**:
```yaml
description: text (roaster overview)
philosophy: text (roasting philosophy)
story: text (company story)
specialties: text (what they're known for)
certifications: list (B-Corp, organic certified, etc.)
visit-date: date (if visited in person)
visit-notes: text (notes from visit)
personal-notes: text (your observations)
recommendations: text (beans to try)
tags: list (categorization)
```

---

### 4. Origin Profile (`type: origin-profile`)

**Purpose**: Coffee-producing region information and characteristics

**Required Properties**:
```yaml
type: origin-profile
name: text (country or region name, required)
category: text (select: country, region, subregion, farm)
```

**Geographic Information**:
```yaml
# Location
name: text (location name)
category: text (country, region, subregion, farm)
country: text (country name)
parent-region: text/link (larger region this belongs to)
coordinates: text (approximate GPS coordinates)
map-reference: text (link to map or map data)

# Physical Geography
altitude-min: number (minimum altitude in meters)
altitude-max: number (maximum altitude in meters)
altitude-typical: number (typical growing altitude)
terrain: text (mountain, highland, plateau, valley)
soil-type: text (volcanic, clay, loam, etc.)
microclimate: text (climate characteristics)
```

**Climate & Growing Conditions**:
```yaml
# Climate
climate-type: text (tropical, subtropical, etc.)
rainfall-annual: number (mm per year)
temperature-avg: number (average Celsius)
temperature-range: text (min-max range)
harvest-season: text (months, e.g., "October-March")
harvest-frequency: text (once, twice, continuous)

# Growing Conditions
growing-conditions: text (description)
challenges: text (growing challenges)
advantages: text (what makes this origin special)
```

**Coffee Characteristics**:
```yaml
# Varieties Grown
typical-varieties: list (commonly grown varieties)
heirloom-presence: boolean (heirloom varieties present)
hybrid-presence: boolean (hybrids grown)
variety-notes: text (notes on varieties)

# Processing Methods
typical-processing: text (most common processing)
processing-methods: list (all processing methods used)
processing-innovation: boolean (experimental processing done)
processing-notes: text (processing characteristics)

# Quality Profile
typical-grade: text (common quality grades)
specialty-production: boolean (produces specialty coffee)
commodity-production: boolean (commodity coffee produced)
quality-reputation: text (select: low, moderate, good, excellent, exceptional)
sca-score-range: text (typical SCA scores, e.g., "82-88")
```

**Flavor Profile**:
```yaml
# Typical Flavors
typical-profile: text (description of typical cup)
typical-descriptors: list (common flavor notes)
acidity-typical: text (low, medium, high)
acidity-character: text (type of acidity)
body-typical: text (light, medium, full)
sweetness-typical: text (low, medium, high)
complexity-typical: text (simple, moderate, complex)

# Processing Impact
washed-profile: text (flavor when washed)
natural-profile: text (flavor when natural)
honey-profile: text (flavor when honey processed)
```

**Production & Economics**:
```yaml
# Production
annual-production: number (bags or kg per year)
production-scale: text (small, medium, large, major)
export-volume: number (bags exported)
producers-count: integer (number of producers)
farm-size-typical: text (typical farm size)

# Industry Structure
cooperatives-present: boolean (coops operating)
major-cooperatives: list (notable coops)
private-farms: boolean (private estates present)
processing-centralized: boolean (centralized wet mills)
infrastructure: text (select: limited, developing, moderate, excellent)

# Economics
typical-price-premium: text (select: discount, standard, premium, ultra-premium)
fair-trade-presence: boolean (Fair Trade certified farms)
direct-trade-presence: boolean (direct trade relationships)
market-position: text (commodity, specialty, ultra-specialty)
economic-importance: text (importance to local economy)
```

**History & Culture**:
```yaml
# Historical
coffee-since: text (year coffee cultivation began)
coffee-history: text (historical overview)
historical-significance: text (notable history)
coffee-crisis-history: text (challenges faced)

# Cultural
cultural-importance: text (role in local culture)
coffee-ceremony: boolean (traditional ceremony exists)
local-consumption: text (select: low, moderate, high)
coffee-identity: boolean (strong coffee cultural identity)
```

**Organizations & Resources**:
```yaml
# Institutions
cooperatives: list (major cooperatives)
associations: list (industry associations)
research-stations: list (research facilities)
cupping-labs: list (quality control labs)
exporters: list (major exporters)

# Resources
resources: list (links, articles, research)
documentation: text (key reference materials)
contacts: text (useful contacts)
```

**Personal Experience**:
```yaml
# Experience
beans-tried: integer (number of beans from origin)
roasters-tried: list (roasters you've tried from here)
favorite-beans: list (favorite beans from origin)
avg-rating: number (your average rating for this origin)
first-tried: date (first time trying coffee from here)
would-revisit: boolean (want to try more)

# Assessment
personal-notes: text (your observations)
brewing-tips: text (tips for brewing this origin)
preferred-processing: text (which processing you prefer)
preferred-roaster: text/link (best roaster for this origin)
is-favorite: boolean (marked as favorite origin)
```

---

### 5. Brewing Guide (`type: brewing-guide`)

**Purpose**: Method-specific brewing instructions and recipes

**Required Properties**:
```yaml
type: brewing-guide
method: text (brewing method name, required)
title: text (guide title)
```

**Guide Properties**:
```yaml
# Basic Info
method: text (brewing method)
title: text (guide title)
author: text (guide creator)
date: date (creation/update date)
difficulty: text (select: beginner, intermediate, advanced, expert)
time-required: duration (total time)

# Equipment Requirements
required-equipment: list (essential equipment)
optional-equipment: list (nice-to-have equipment)
grinder-requirement: text (grinder type needed)
special-tools: list (any special tools)

# Recipe Parameters
dose: number (coffee in grams)
water: number (water in grams)
ratio: text (brew ratio, e.g., "1:16")
grind-size: text (grind recommendation)
water-temp: number (Celsius)
brew-time: duration (total brew time)

# Detailed Instructions
steps: text (step-by-step instructions)
tips: text (helpful tips)
common-mistakes: text (what to avoid)
troubleshooting: text (problem solving)

# Optimization
adjustment-notes: text (how to adjust)
grind-adjustment: text (grind tuning guidance)
temp-adjustment: text (temperature tuning)
ratio-adjustment: text (ratio tuning)

# Applications
best-for: text (what coffee types work best)
roast-recommendation: text (roast level)
origin-recommendations: list (origins that shine)
flavor-goal: text (target flavor profile)

# Documentation
photos: list (image links)
videos: list (video links)
references: list (reference materials)
related-guides: list (related brewing guides)
tags: list (categorization)
```

---

### 6. Equipment Profile (`type: equipment-profile`)

**Purpose**: Coffee equipment documentation and tracking

**Required Properties**:
```yaml
type: equipment-profile
name: text (equipment name, required)
category: text (equipment category, required)
```

**Equipment Details**:
```yaml
# Basic Info
name: text (product name)
brand: text (manufacturer)
model: text (model number)
category: text (select: grinder, brewer, kettle, scale, roaster, espresso-machine, accessories, other)
type: text (specific type within category)

# Purchase Info
purchase-date: date (when purchased)
purchase-price: number (cost)
purchase-location: text (where purchased)
purchase-link: text (product URL)
warranty-period: text (warranty length)
warranty-expires: date (expiration date)

# Specifications
capacity: text (size/capacity)
material: text (build materials)
power: text (power requirements)
dimensions: text (size measurements)
weight: number (kg)
color: text (color/finish)

# For Grinders
burr-type: text (flat, conical, none)
burr-size: number (mm diameter)
burr-material: text (steel, ceramic)
grind-range: text (grind size range)
grind-settings: integer (number of settings)
rpm: integer (rotation speed)
retention: number (grams retained)
stepless: boolean (stepless adjustment)

# For Brewers
brew-capacity: number (ml capacity)
filter-type: text (filter requirements)
material-contact: text (materials touching coffee/water)

# Usage Tracking
first-use: date (first use date)
total-uses: integer (times used)
total-coffee: number (kg of coffee through it)
current-status: text (select: active, backup, retired, broken)
maintenance-due: date (next maintenance)
last-cleaning: date (last cleaned)
last-calibration: date (last calibrated)

# Performance
performance-rating: number (your rating 1-5)
reliability: text (select: poor, fair, good, excellent)
ease-of-use: text (select: difficult, moderate, easy, very-easy)
consistency: text (select: poor, fair, good, excellent)
build-quality: text (select: poor, fair, good, excellent)

# Maintenance
cleaning-frequency: text (how often cleaned)
maintenance-frequency: text (maintenance schedule)
replacement-parts: list (parts that need replacing)
maintenance-cost: number (annual maintenance cost)
maintenance-notes: text (maintenance instructions)

# Notes
pros: list (advantages)
cons: list (disadvantages)
notes: text (general notes)
tips: text (usage tips)
issues: text (problems encountered)
upgrades: list (modifications made)
compatible-with: list (compatible equipment)
tags: list (categorization)
```

---

### 7. Daily Note (`type: daily-note`)

**Purpose**: Daily coffee tracking and aggregation

**Required Properties**:
```yaml
type: daily-note
date: date (YYYY-MM-DD, required)
```

**Daily Statistics** (auto-calculated):
```yaml
# Session Summary
sessions-count: integer (coffee sessions today)
sessions-list: list (links to session notes)
total-caffeine: number (estimated mg caffeine)

# Coffee Consumed
total-dose: number (grams of coffee)
total-water: number (ml of water)
beans-used: list (unique beans used)
methods-used: list (unique brew methods)

# Quality Metrics
avg-rating: number (average rating)
best-session: text/link (highest rated session)
worst-session: text/link (lowest rated session)
is-dialed-in: boolean (achieved dialed-in brew)

# Cost
daily-cost: number (cost of coffee consumed)

# Notes
daily-notes: text (general observations)
mood: text (overall mood/energy)
weather: text (weather conditions)
highlights: text (notable sessions)
discoveries: text (new learnings)
tags: list (categorization)
```

---

### 8. Weekly Summary (`type: weekly-summary`)

**Purpose**: Weekly aggregation and progress tracking

**Required Properties**:
```yaml
type: weekly-summary
week-start: date (Monday date, YYYY-MM-DD)
week-end: date (Sunday date)
year: integer (year)
week-number: integer (week of year)
```

**Weekly Statistics**:
```yaml
# Session Summary
total-sessions: integer (sessions this week)
sessions-per-day: number (average)
most-active-day: text (day with most sessions)

# Coffee Consumed
total-coffee-grams: number (total dose)
total-water-ml: number (total water)
unique-beans: integer (different beans tried)
unique-methods: integer (different methods used)
new-beans: integer (new beans tried this week)

# Quality Metrics
avg-rating: number (weekly average rating)
rating-trend: text (improving, declining, stable)
best-day: text/link (best daily average)
best-session: text/link (highest rated session)
consistency: number (standard deviation of ratings)

# Popular Choices
most-used-bean: text/link (bean used most)
most-used-method: text (method used most)
favorite-combination: text (best bean+method combo)

# Cost & Value
total-cost: number (spent on coffee)
cost-per-cup: number (average)
cost-per-gram: number (average)

# Progress & Learning
improvements: text (what improved)
challenges: text (difficulties encountered)
lessons-learned: text (key learnings)
next-week-goals: text (goals for next week)
experiments: text (experiments conducted)

# Notes
weekly-notes: text (general observations)
highlights: list (notable sessions)
favorite-moment: text (best coffee experience)
tags: list (categorization)
```

---

### 9. Monthly Report (`type: monthly-report`)

**Purpose**: Monthly analytics and comprehensive review

**Required Properties**:
```yaml
type: monthly-report
year: integer (year, required)
month: integer (month 1-12, required)
month-name: text (month name)
```

**Monthly Statistics**:
```yaml
# Session Summary
total-sessions: integer (sessions this month)
sessions-per-day: number (average)
total-days-with-coffee: integer (days brewed)
streak-longest: integer (consecutive days)
busiest-week: text/link (week with most sessions)

# Coffee Consumed
total-coffee-kg: number (kg of coffee)
total-water-liters: number (liters of water)
unique-beans-count: integer (different beans)
unique-methods-count: integer (different methods)
new-beans-tried: integer (new beans this month)
bags-finished: integer (bags consumed completely)

# Quality Metrics
avg-rating: number (monthly average)
rating-stdev: number (consistency measure)
rating-trend: text (trend direction)
best-week: text/link (highest average week)
best-session: text/link (top session)
sessions-above-4: integer (excellent sessions)
sessions-below-3: integer (poor sessions)
quality-improvement: number (change from last month)

# Popular Patterns
top-bean: text/link (most used bean)
top-method: text (most used method)
top-roaster: text/link (most used roaster)
top-origin: text/link (most used origin)
favorite-combo: text (best bean+method)
most-improved-bean: text/link (biggest rating increase)

# Method Breakdown
v60-sessions: integer (V60 sessions)
chemex-sessions: integer (Chemex sessions)
aeropress-sessions: integer (Aeropress sessions)
french-press-sessions: integer (French Press sessions)
espresso-sessions: integer (Espresso sessions)
other-methods: integer (other methods)

# Cost Analysis
total-spent: number (money spent)
cost-per-session: number (average)
cost-per-gram: number (average)
most-expensive-bean: text/link (highest cost)
best-value-bean: text/link (best rating/cost ratio)
spending-trend: text (increasing, decreasing, stable)

# Progress & Development
skill-improvement: text (areas of improvement)
palate-development: text (sensory improvements)
new-techniques: list (techniques learned)
equipment-added: list (new equipment)
goals-achieved: list (completed goals)
challenges: text (difficulties faced)

# Planning
next-month-goals: text (goals for next month)
beans-to-try: list (beans on wishlist)
techniques-to-learn: list (skills to develop)
equipment-wishlist: list (equipment desires)

# Notes
monthly-summary: text (overall summary)
highlights: list (memorable moments)
favorite-discovery: text (best finding)
disappointments: text (letdowns)
reflections: text (general reflections)
tags: list (categorization)
```

---

### 10. Scientific Reference (`type: scientific-reference`)

**Purpose**: Educational content and research documentation

**Required Properties**:
```yaml
type: scientific-reference
title: text (document title, required)
category: text (content category, required)
difficulty: text (select: beginner, intermediate, advanced)
```

**Reference Properties**:
```yaml
# Classification
category: text (select: extraction-science, coffee-chemistry, sensory-science, agronomy, processing, roasting, water-chemistry, equipment-science, brewing-science, other)
subcategory: text (more specific classification)
difficulty: text (beginner, intermediate, advanced, expert)
reading-time: duration (estimated reading time)

# Content
title: text (document title)
subtitle: text (subtitle if any)
summary: text (brief summary)
prerequisites: list (required prior knowledge)
learning-objectives: list (what reader will learn)
key-concepts: list (main concepts covered)

# Academic
sources: list (citations and references)
author: text (content author)
reviewed-by: text (technical reviewer)
peer-reviewed: boolean (peer review status)
original-source: text (primary source if adapted)
publication-date: date (original publication)
last-updated: date (last revision)

# Application
practical-applications: text (real-world applications)
related-techniques: list (related brewing techniques)
related-references: list (links to related documents)
difficulty-next: text/link (next difficulty level)

# Metadata
tags: list (categorization)
keywords: list (search keywords)
estimated-expertise-gain: text (skill level impact)
```

---

### 11. Sensory Evaluation (`type: sensory-evaluation`)

**Purpose**: Formal cupping and sensory assessment

**Required Properties**:
```yaml
type: sensory-evaluation
date: date (evaluation date, required)
coffee: text/link (coffee evaluated, required)
protocol: text (evaluation protocol used, required)
```

**Evaluation Setup**:
```yaml
# Session Info
date: date (evaluation date)
time: text (time of day)
evaluator: text (who evaluated)
protocol: text (select: SCA, COE, informal, custom)
session-type: text (select: cupping, evaluation, comparison, training)

# Coffee Info
coffee: text/link (coffee being evaluated)
roast-level: text (light, medium, dark)
days-off-roast: integer (days since roast)
sample-size: number (grams used)
grind-size: text (grind setting)

# Setup Parameters
water-temp: number (Celsius)
water-tds: number (ppm)
brew-ratio: text (coffee:water ratio)
steep-time: duration (steeping time)
environment-temp: number (room temperature)
cups-evaluated: integer (number of cups)
```

**SCA Scoring**:
```yaml
# Primary Scores (1-10 scale)
score-fragrance-aroma: number (dry and wet aroma, 6-10)
score-flavor: number (primary taste, 6-10)
score-aftertaste: number (finish length/quality, 6-10)
score-acidity: number (brightness quality, 6-10)
score-body: number (mouthfeel, 6-10)
score-balance: number (harmony, 6-10)
score-overall: number (holistic assessment, 6-10)

# Secondary Scores (2 points each)
score-clean-cup: integer (0-10, 2 pts per cup)
score-sweetness: integer (0-10, 2 pts per cup)
score-uniformity: integer (0-10, 2 pts per cup)

# Defects
defects-taint: integer (count of taints, -2 each)
defects-fault: integer (count of faults, -4 each)
defects-description: text (defect descriptions)

# Total Score
total-score: number (calculated, 0-100)
specialty-grade: boolean (>= 80 points)
grade-category: text (outstanding, excellent, very-good, good)
```

**Detailed Sensory Notes**:
```yaml
# Aroma
fragrance-dry: text (dry grounds aroma)
fragrance-intensity: text (subtle, moderate, strong)
aroma-wet: text (wet grounds aroma)
aroma-break: text (crust break aroma)
aroma-evolution: text (how aroma changes)

# Taste
flavor-primary: text (dominant flavor)
flavor-secondary: list (supporting flavors)
flavor-descriptors: list (all flavor notes)
flavor-complexity: text (simple, moderate, complex)
flavor-clarity: text (clear, muddled)

# Acidity
acidity-intensity: text (low, medium, high)
acidity-quality: text (bright, crisp, sharp, sour)
acidity-type: text (citric, malic, tartaric, phosphoric, acetic)

# Body
body-level: text (light, medium, full)
body-texture: text (tea-like, silky, creamy, syrupy)
body-smoothness: text (smooth, rough, astringent)

# Sweetness & Balance
sweetness-level: text (none, subtle, moderate, pronounced)
sweetness-type: text (honey, caramel, sugar, fruit)
balance-assessment: text (balance description)
harmony: text (how components integrate)

# Aftertaste
aftertaste-length: text (short, medium, long, lingering)
aftertaste-quality: text (clean, sweet, bitter, astringent)
aftertaste-evolution: text (how finish develops)
```

**Comparative Analysis**:
```yaml
# Comparison
compared-to: list (other coffees in session)
relative-ranking: integer (rank in session)
preferred: boolean (favorite of session)
differences: text (key differences from others)
similarities: text (shared characteristics)

# Processing Impact
processing-evident: boolean (processing clearly expressed)
processing-notes: text (how processing shows in cup)

# Roast Impact
roast-appropriate: boolean (roast level suits bean)
roast-notes: text (roast observations)
roast-development: text (under, optimal, over)
```

**Conclusions & Recommendations**:
```yaml
# Assessment
quality-level: text (commercial, specialty, exceptional)
would-rebuy: boolean (purchase again)
value-assessment: text (poor, fair, good, excellent)
best-use: text (espresso, filter, cold-brew, etc.)

# Brewing Recommendations
recommended-method: text (best brew method)
recommended-ratio: text (suggested ratio)
recommended-temp: number (water temp suggestion)
optimization-notes: text (how to improve brewing)

# Notes
strengths: text (what excels)
weaknesses: text (what could improve)
unique-characteristics: text (distinctive features)
overall-impression: text (summary)
evaluator-notes: text (personal observations)
tags: list (categorization)
```

---

## Shared Properties

### Universal Properties

Present on ALL note types:

```yaml
type: text (note type identifier, REQUIRED)
date: date (creation/relevance date, YYYY-MM-DD, REQUIRED)
tags: list (categorization tags, OPTIONAL but recommended)
status: text (active, archived, draft, OPTIONAL)
created: datetime (auto-generated by Obsidian)
modified: datetime (auto-generated by Obsidian)
```

### Common Optional Properties

Applicable across many note types:

```yaml
# Linking & Relationships
aliases: list (alternative names for this note)
related: list (related notes)
parent: text/link (parent note in hierarchy)
children: list (child notes)

# Quality & Assessment
rating: number (quality rating, scale varies by type)
is-favorite: boolean (marked as favorite)
is-archived: boolean (archived/inactive)

# Organization
project: text (associated project)
category: text (classification)
subcategory: text (sub-classification)

# Notes & Documentation
notes: text (free-form notes)
description: text (brief description)
summary: text (summary)

# Temporal
last-updated: date (last modification)
review-date: date (next review date)
expiry-date: date (expiration/end date)
```

---

## Property Index

### Alphabetical Property Reference

Complete alphabetical list of ALL properties with primary usage:

```yaml
acidity: sensory-evaluation, coffee-log, bean-profile
acidity-intensity: sensory-evaluation, coffee-log
acidity-type: sensory-evaluation, coffee-log, bean-profile
acidity-typical: origin-profile
adjustment-next: coffee-log
aftertaste: coffee-log, sensory-evaluation
aftertaste-length: sensory-evaluation
aftertaste-quality: sensory-evaluation, coffee-log
agitation: coffee-log
aliases: universal (optional)
altitude: bean-profile, origin-profile, coffee-log
altitude-max: origin-profile
altitude-min: origin-profile
altitude-typical: origin-profile
ambient-humidity: coffee-log
ambient-temperature: coffee-log
aroma-break: sensory-evaluation
aroma-evolution: sensory-evaluation
aroma-wet: sensory-evaluation
author: scientific-reference, brewing-guide
avg-coffee-score: roaster-profile
avg-rating: bean-profile, origin-profile, monthly-report

[... continues for all ~300+ unique properties ...]

```

---

## Validation Rules

### Critical Validations

**Type Enforcement**:
- `type` must exactly match defined note type
- No custom `type` values allowed
- Query: `dv.pages().where(p => !['coffee-log', 'bean-profile', ...].includes(p.type))`

**Date Format**:
- All `date` fields must be YYYY-MM-DD
- Use `datetime` for timestamps requiring time
- Validation: `Date.parse(date) !== NaN`

**Required Field Check**:
- Each note type has required fields
- Templates must initialize all required fields
- Missing required field = invalid note

**Numeric Range Validations**:
```javascript
// Rating scales
rating: 1.0 <= x <= 5.0
score-*: 6.0 <= x <= 10.0 (SCA attributes)
total-score: 0 <= x <= 100

// Brewing parameters
dose: 5 <= x <= 100 (grams)
water: 50 <= x <= 1000 (ml/grams)
water-temperature: 85 <= x <= 100 (Celsius)
extraction-yield: 15 <= x <= 25 (percentage)
tds-brewed: 1.0 <= x <= 2.0 (percentage)

// Physical properties
altitude: 0 <= x <= 3000 (meters)
humidity: 0 <= x <= 100 (percentage)
```

**Link Validity**:
- `[[WikiLink]]` format required for internal links
- Linked note should exist (soft validation)
- Use `text/link` type for flexible link or text entry

---

### Controlled Vocabularies

**Standardized Select Fields**:

```yaml
# Brew Methods
brew-method: [v60, chemex, aeropress, french-press, espresso, moka-pot, clever, kalita-wave, siphon, cold-brew, ibrik, other]

# Grind Sizes
grind-size: [extra-fine, fine, medium-fine, medium, medium-coarse, coarse, extra-coarse]

# Roast Levels
roast-level: [light, light-medium, medium, medium-dark, dark]

# Processing Methods
processing: [washed, natural, honey, semi-washed, wet-hulled, anaerobic, carbonic-maceration, experimental]

# Sensory Scales
acidity: [none, low, medium-low, medium, medium-high, high]
body: [light, medium-light, medium, medium-full, full, very-full]
sweetness: [none, subtle, moderate, pronounced, intense]

# Quality Levels
difficulty: [beginner, intermediate, advanced, expert]
quality-focus: [commodity, commercial, specialty, ultra-specialty]
quality-reputation: [poor, low, moderate, good, excellent, exceptional]
```

---

## Migration Guide

### Upgrading from Version 2.0 to 3.0

**New Properties Added**:
- Sensory evaluation properties (complete SCA scoring)
- Equipment tracking properties
- Enhanced cost analysis properties
- Palate development tracking
- External integration identifiers

**Deprecated Properties**:
- None (full backward compatibility maintained)

**Property Renames**:
- None (semantic consistency preserved)

**Migration Steps**:
1. No changes required for existing notes
2. New templates will include enhanced properties
3. Optional: run enhancement script to add new properties to old notes
4. Queries updated to leverage new properties automatically

**Backward Compatibility**:
- All 2.0 queries continue to work
- 2.0 templates compatible (will use defaults for new properties)
- Progressive enhancement approach: new features opt-in

---

## Usage in Queries

### Datacore Query Examples

**Basic Property Access**:
```javascript
// List all coffee logs with rating > 4
dv.table(["Date", "Beans", "Rating"],
  dv.pages('"Coffee Logs"')
    .where(p => p.type === "coffee-log" && p.rating > 4)
    .sort(p => p.date, 'desc')
    .map(p => [p.date, p.beans, p.rating])
)
```

**Aggregation with Properties**:
```javascript
// Monthly coffee consumption
const logs = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log" && p["date"].month === 10);

const totalDose = logs.array().reduce((sum, p) => sum + (p.dose || 0), 0);
const avgRating = logs.array().reduce((sum, p) => sum + (p.rating || 0), 0) / logs.length;
```

**Cross-Type Queries**:
```javascript
// Best bean-method combinations
const sessions = dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .groupBy(p => p.beans + " + " + p["brew-method"])
  .map(g => ({
    combo: g.key,
    count: g.rows.length,
    avgRating: g.rows.array().reduce((s, r) => s + r.rating, 0) / g.rows.length
  }))
  .sort(c => c.avgRating, 'desc')
  .limit(10);
```

---

## Extensibility

### Adding Custom Properties

**Guidelines for Custom Properties**:
1. Follow naming conventions (lowercase-with-hyphens)
2. Document in your personal schema extension
3. Use consistent types
4. Avoid name collisions with core properties
5. Consider using prefixes for personal properties (e.g., `my-property`)

**Custom Property Example**:
```yaml
# Personal preference tracking
my-mood-correlation: text (how mood affects perception)
my-brewing-difficulty: number (personal difficulty rating 1-5)
my-rebuy-notes: text (personal rebuy decision notes)
```

**Integration with Core Schema**:
- Custom properties coexist with core properties
- Queries can safely access custom properties with fallbacks
- Templates can conditionally include custom properties
- Share your custom schema extensions with community

---

## Validation Script

### Automated Schema Validation

A validation script is available at `Scripts/data-validator.js` to check your vault against this schema:

**Checks Performed**:
1. Required properties present
2. Property types correct
3. Numeric ranges valid
4. Date formats correct
5. Select field values from vocabulary
6. Link targets exist
7. Orphaned required properties

**Usage**:
```javascript
// In JavaScript
const validator = require('./Scripts/data-validator.js');
const results = validator.validateVault();
console.log(results);
```

**Output**:
- Errors: Critical issues (missing required fields, invalid types)
- Warnings: Best practice violations (recommended fields missing)
- Info: Suggestions for enhancement

---

## Summary

This Property Schema defines **300+ properties** across **11 note types**, providing comprehensive structure for:

- Daily coffee practice tracking
- Scientific coffee education
- Equipment and supplier management
- Quality assessment and cupping
- Analytics and optimization
- Personal coffee journey documentation

**Key Principles**:
- **Consistency**: Same property names, same meanings
- **Flexibility**: Required properties minimal, optional properties extensive
- **Queryability**: Designed for powerful Datacore queries
- **Extensibility**: Easy to add personal properties
- **Validation**: Clear rules with automated checking

**This schema is AUTHORITATIVE** - all templates, queries, scripts, and user documentation must conform to this specification.

---

**Version**: 3.0.0
**Last Updated**: 2025-10-25
**Status**: Production
**Maintainer**: Coffee Vault Development Team

*For questions or suggested additions, consult the community or extend locally following the guidelines above.*
