---
type: configuration-document
title: Coffee Vault Property Schema
version: 5.0.0
date: 2025-10-28
status: authoritative
---

# ☕ Coffee Vault Property Schema - Version 5.0

**Purpose**: This document serves as the authoritative specification for all properties used throughout the Coffee Vault. Every template, query, and script must reference this schema to ensure consistency and compatibility.

**Status**: **AUTHORITATIVE** - All vault components must conform to this specification

**Version**: 5.0.0 Enhanced Edition (Coffee Vault 5.0)

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

# Weather & Environment (Coffee Vault 5.0 Enhanced)
weather-condition: text (select: sunny, cloudy, rainy, overcast, foggy, stormy, clear, partly-cloudy)
barometric-pressure: number (mbar, typical range 980-1050)
ambient-noise-level: text (select: quiet, moderate, noisy, very-noisy)
distractions-present: boolean (distractions during brewing/tasting)
air-quality: text (select: fresh, stale, smoky, fragrant, neutral)

# Physiological Context (Coffee Vault 5.0 Enhanced)
sleep-hours-previous: number (hours slept night before, 0-12)
hydration-level: text (select: well-hydrated, normal, dehydrated, very-dehydrated)
meal-timing: text (select: before-meal, after-meal, fasted, during-meal)
caffeine-tolerance-state: text (select: low, normal, high, very-high)
energy-level: text (select: tired, normal, energetic, very-energetic)
stress-level: text (select: low, moderate, high, very-high)

# Sensory Context (Coffee Vault 5.0 Enhanced)
tasting-setup: text (description of tasting environment)
professional-cupping: boolean (formal cupping vs casual tasting)
tasting-companions: list (who tasted with you)
consensus-rating: number (if multiple tasters, average rating)
palate-state: text (select: fresh, normal, fatigued, compromised)
recent-food: text (food consumed before tasting that might affect perception)

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

**Precision Measurements (Coffee Vault 5.0 New)**:
```yaml
# Extraction Precision
extraction-mass: number (grams of coffee extracted, if measured)
extraction-percentage-precise: number (calculated precise extraction %, 15-25)
first-drop-time: duration (time to first drop in pour-over)
peak-extraction-time: duration (when extraction peaks, if measured)
end-extraction-signal: text (how you knew to stop: time, visual, taste, other)
slurry-temperature: number (coffee slurry temperature during brew, Celsius)
coffee-ground-temperature: number (ground coffee temperature before brew, Celsius)

# Flow Rate Measurements
flow-rate: number (ml/second, if measured)
pour-velocity: text (select: slow, moderate, fast, aggressive)
drain-rate: text (select: slow, moderate, fast, very-fast)

# Weight Measurements
total-output-weight: number (grams of brewed coffee output)
water-retention: number (grams of water retained in grounds)
brew-loss: number (grams lost to evaporation/retention)
```

**Video/Audio Documentation (Coffee Vault 5.0 New)**:
```yaml
# Media Documentation
video-link: text (URL to brewing video)
audio-notes-link: text (voice memo link)
photo-links: list (photos of setup, process, result)
setup-photo: text (photo of brewing setup)
process-photo: text (photo during brewing process)
result-photo: text (photo of final brew)
video-notes: text (notes about video documentation)
photo-notes: text (notes about photos)
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
producer-link: link (link to producer-profile if available, Coffee Vault 5.0)
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

# Supply Chain Transparency (Coffee Vault 5.0)
producer-link: link (link to producer-profile)
farm-link: link (specific farm profile)
cooperative-link: link (cooperative profile)
import-company: text (importer name)
export-company: text (exporter name)
supply-chain-map: text (full chain visualization/description)
lot-number: text (batch/lot identifier)
harvest-year-season: text (specific harvest period)
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

**Supply Chain & Transparency (Coffee Vault 5.0)**:
```yaml
# Supply Chain Tracking
producer-link: text/link (link to producer profile)
farm-link: text/link (specific farm profile)
cooperative-link: text/link (cooperative profile if applicable)
washing-station: text (washing station name if known)
exporter: text (export company name)
importer: text (import company name)
supply-chain-map: text (description of full chain)
supply-chain-verified: boolean (supply chain fully documented)
traceability-level: text (select: low, medium, high, complete)

# Contract & Pricing Details
contract-type: text (direct-trade, fair-trade, spot-market, relationship)
price-paid-to-farmer: number (price per kg paid to farmer if known)
price-premium-vs-commodity: number (% above commodity price)
profit-sharing: boolean (farmer participates in profit)
long-term-contract: boolean (multi-year contract)
relationship-years: integer (years of relationship with producer)

# Transparency Scores
transparency-score: number (1-10, based on supply chain knowledge)
ethical-rating: number (1-10, ethical sourcing rating)
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

**Supply Chain Transparency (Coffee Vault 5.0 New)**:
```yaml
# Producer & Farm Links
producer-link: link (link to producer-profile)
farm-link: link (link to specific farm profile if separate)
cooperative-link: link (link to cooperative profile if applicable)
import-company: text (importer name)
export-company: text (exporter name)
supply-chain-map: text (full supply chain visualization or notes)
supply-chain-transparency: text (select: low, medium, high, very-high)

# Traceability
lot-number: text (batch/lot identifier)
traceability-code: text (traceability code if available)
traceability-link: text (URL to traceability information)
can-trace-to-farm: boolean (can trace to specific farm)
can-trace-to-producer: boolean (can trace to specific producer)
```

**Quality Metrics (Coffee Vault 5.0 Enhanced)**:
```yaml
# Official Quality Scores
sca-score-official: number (official SCA cupping score, 80-100)
coa-link: text (certificate of analysis URL)
coa-available: boolean (certificate of analysis available)
harvest-year-season: text (specific harvest period, e.g., "2024-2025")
post-harvest-quality: text (quality at various stages: green, roasted, brewed)
producer-score: number (producer's internal quality score)
importer-score: number (importer's quality score)
roaster-score: number (roaster's cupping score)

# Quality Documentation
quality-certificates: list (links to quality certificates)
cupping-sheets: list (links to cupping sheets)
coffee-review-link: text (Coffee Review URL if reviewed)
competition-results: list (competition placements/results)
```

**Processing Details (Coffee Vault 5.0 Enhanced)**:
```yaml
# Processing Facility & Timeline
processing-facility: text (where processed: farm, cooperative, washing-station)
processing-facility-location: text (location of processing facility)
processing-date-start: date (processing start date)
processing-date-end: date (processing end date)
processing-duration: number (days in processing)

# Fermentation Details
fermentation-ph: number (pH during fermentation, typically 3.5-5.5)
fermentation-temperature: number (Celsius during fermentation)
fermentation-duration: number (hours/days of fermentation)
fermentation-method: text (aerobic, anaerobic, carbonic, etc.)
fermentation-vessel: text (type of vessel used)
fermentation-monitoring: text (how fermentation was monitored)

# Drying Details
drying-duration: number (days on drying beds/patio)
drying-location: text (patio, raised-beds, mechanical, greenhouse)
drying-method: text (sun-dried, mechanical, hybrid)
drying-temperature: text (temperature range during drying)
final-moisture-content: number (final moisture % after drying)
drying-uniformity: text (select: inconsistent, variable, consistent, very-consistent)

# Processing Supervisor
processing-supervisor: text (who managed processing)
processing-notes-detailed: text (detailed processing observations)
processing-quality-control: text (QC measures during processing)
```

**Storage & Shipping (Coffee Vault 5.0 New)**:
```yaml
# Storage Conditions
storage-conditions-green: text (how green coffee was stored)
storage-temperature-green: number (temperature during green storage, Celsius)
storage-humidity-green: number (humidity during storage, %)
storage-duration-green: number (days/months stored as green)
storage-location-green: text (where stored: origin, importer, roaster)

# Shipping Information
shipping-method: text (how transported: ocean, air, land)
shipping-duration: number (days in transit)
shipping-container: text (container type: jute, grainpro, vacuum)
shipping-temperature: text (temperature during shipping if known)
shipping-conditions: text (conditions during shipping)

# Timeline
time-from-harvest-to-roast: duration (total time from harvest to roast)
time-from-roast-to-purchase: duration (time from roast to your purchase)
time-from-purchase-to-open: duration (time from purchase to opening bag)
freshness-window: text (optimal freshness window in days)
```

**Certification & Ethics (Coffee Vault 5.0 Enhanced)**:
```yaml
# Expanded Certifications
certifications: list (organic, fair-trade, rainforest-alliance, bird-friendly, shade-grown, carbon-neutral, b-corp, direct-trade-verified, rfa, utz, c.a.f.e-practices, smbc, ethical-certified)
certification-numbers: text (certificate IDs with certificate types)
certification-dates: list (certification issue dates)
certification-expiry-dates: list (certification expiry dates)
certification-verification: list (verification links/URLs)

# Social Impact Metrics
social-impact-score: number (1-10, if calculated)
environmental-impact-score: number (1-10, if calculated)
farmer-income-premium: number (% above commodity price paid to farmers)
price-premium-percentage: number (% premium over commodity price)
supply-chain-ethics: text (select: unknown, standard, good, excellent, exceptional)

# Sustainability Details
carbon-footprint: number (kg CO2 per kg coffee, if known)
water-usage: number (liters water per kg coffee, if known)
waste-reduction: text (waste reduction measures)
biodiversity-impact: text (biodiversity considerations)
community-benefits: text (community benefits provided)
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

**Infrastructure & Market Access (Coffee Vault 5.0)**:
```yaml
# Infrastructure
washing-stations-count: integer (number of washing stations)
processing-facilities: list (major processing facilities)
transportation-infrastructure: text (road quality, port access, logistics)
storage-capacity: text (storage infrastructure availability)
cupping-labs: list (quality control labs in region)
research-institutions: list (agronomic research facilities)
internet-connectivity: text (select: none, limited, moderate, good, excellent)
electricity-access: text (select: none, limited, intermittent, reliable)

# Market Access & Support
export-infrastructure: text (export capabilities and infrastructure)
government-support: text (select: none, minimal, moderate, strong)
ngo-presence: boolean (NGOs supporting coffee sector)
technical-assistance-available: boolean (technical support programs)
financing-access: text (select: none, limited, moderate, good)
price-transparency: text (select: low, moderate, high)
market-information-access: text (select: poor, fair, good, excellent)
```

**Climate Change Impact (Coffee Vault 5.0)**:
```yaml
# Climate Vulnerability
climate-vulnerability: text (select: low, medium, high, critical)
climate-change-impacts: text (observed changes: temperature, rainfall, etc.)
adaptation-strategies: text (how region/farmers are adapting)
altitude-shift-observed: boolean (farms moving to higher altitudes)
rainfall-changes: text (precipitation pattern changes)
temperature-trends: text (temperature trend observations)
drought-frequency: text (select: rare, occasional, frequent, severe)
frost-risk: text (select: none, low, moderate, high)

# Adaptation & Resilience
shade-tree-programs: boolean (shade tree planting initiatives)
drought-resistant-varieties: boolean (drought-resistant varieties adopted)
water-management-systems: boolean (water conservation systems)
climate-research-active: boolean (active climate research)
carbon-sequestration: boolean (carbon sequestration programs)
adaptation-funding: text (funding for climate adaptation)
resilience-score: number (1-10, climate resilience rating)
future-viability: text (select: declining, stable, improving, uncertain)
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

**Economic & Market (Coffee Vault 5.0 Enhanced)**:
```yaml
# Market Data
commodity-price-history: text (price trends over time)
specialty-price-premium: number (% above commodity price)
market-position: text (commodity, specialty, ultra-specialty)
export-volume-history: list (historical export data)
domestic-consumption-trends: text (local market trends)
market-volatility: text (select: stable, moderate, volatile, very-volatile)

# Pricing Analysis
avg-price-per-kg: number (average price per kg)
price-range: text (typical price range)
premium-coffee-price: number (high-end coffee price)
commodity-coffee-price: number (commodity coffee price)
price-factors: text (factors affecting pricing)
```

**Infrastructure (Coffee Vault 5.0 New)**:
```yaml
# Processing Infrastructure
washing-stations-count: integer (number of washing stations)
processing-facilities: list (major processing facilities)
processing-capacity: text (total processing capacity)
facility-quality: text (select: poor, adequate, good, excellent)
facility-modernization: text (select: traditional, mixed, modern, state-of-the-art)

# Transportation Infrastructure
transportation-infrastructure: text (road quality, port access, etc.)
road-quality: text (select: poor, adequate, good, excellent)
port-access: text (select: no-port, nearby-port, direct-port-access)
airport-access: text (select: no-airport, nearby-airport, direct-access)
shipping-capability: text (capability for shipping coffee)

# Storage Infrastructure
storage-capacity: text (storage infrastructure description)
warehouse-facilities: list (major storage facilities)
storage-quality: text (select: poor, adequate, good, excellent)
climate-controlled-storage: boolean (climate-controlled storage available)

# Quality Control Infrastructure
cupping-labs: list (quality control labs)
lab-quality: text (select: basic, standard, professional, world-class)
research-institutions: list (agronomic research facilities)
extension-services: boolean (farmer extension services available)
```

**Climate Change Impact (Coffee Vault 5.0 New)**:
```yaml
# Climate Vulnerability
climate-vulnerability: text (select: low, medium, high, critical)
climate-change-impacts: text (observed changes: temperature, rainfall, pests, etc.)
adaptation-strategies: text (how region/farmers adapting to climate change)
altitude-sensitivity: text (altitude changes needed due to warming)
rainfall-changes: text (precipitation pattern changes observed)
temperature-changes: text (temperature changes observed)

# Future Projections
projected-climate-impact: text (projected future impacts)
vulnerability-assessment: text (vulnerability assessment results)
adaptation-priority: text (select: low, medium, high, critical)
adaptation-funding: text (adaptation funding/programs available)
resilience-building: text (resilience building initiatives)
```

**Producer Organizations (Coffee Vault 5.0 New)**:
```yaml
# Cooperative Information
cooperatives-list: list (major cooperatives with links)
cooperative-membership: integer (total cooperative members)
cooperative-coverage: text (% of farmers in cooperatives)
cooperative-quality: text (select: poor, fair, good, excellent)
cooperative-services: list (services provided by cooperatives)

# Farm Structure
farm-sizes-distribution: text (small, medium, large farms breakdown)
typical-farm-size: number (hectares, typical farm size)
small-farm-percentage: number (% of small farms)
large-estate-percentage: number (% of large estates)
family-farm-percentage: number (% of family farms)

# Farmer Support
farmer-training-programs: boolean (training programs available)
training-program-types: list (types of training available)
women-in-coffee: text (% women producers/workers)
gender-equity-programs: boolean (gender equity initiatives)
youth-in-coffee: text (% youth involved in coffee)
succession-planning: text (succession planning initiatives)
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

### Hierarchical Multi-Dimensional Tagging System (Coffee Vault 5.0)

**Purpose**: Structured, hierarchical tagging system for powerful filtering and discovery

**Tag Hierarchy** (6 levels):

```yaml
tags: 
  # Level 1: Primary Categories
  - category:coffee-log
  - category:bean-profile
  - category:roaster-profile
  - category:origin-profile
  - category:cupping-session
  - category:recipe-profile
  - category:equipment-model
  - category:coffee-event
  - category:coffee-goal
  
  # Level 2: Subcategories
  - method:v60
  - method:chemex
  - method:espresso
  - origin:ethiopia
  - origin:colombia
  - roaster:onyx
  - roaster:blue-bottle
  
  # Level 3: Attributes
  - roast:light
  - roast:medium
  - roast:dark
  - processing:natural
  - processing:washed
  - processing:honey
  - variety:gesha
  - variety:bourbon
  
  # Level 4: Quality Markers
  - quality:excellent
  - quality:good
  - quality:poor
  - dialed-in:true
  - needs-improvement:true
  - specialty-grade:true
  
  # Level 5: Personal Markers
  - personal:favorite
  - personal:to-rebuy
  - personal:disappointment
  - personal:experiment
  - personal:reference
  - personal:learning
  
  # Level 6: Temporal
  - month:2025-10
  - month:2025-11
  - year:2025
  - season:fall
  - season:winter
  - season:spring
  - season:summer
```

**Tag Naming Convention**:
- Format: `level:value` (e.g., `category:coffee-log`, `method:v60`)
- Use lowercase with hyphens: `origin:ethiopia-yirgacheffe`
- Consistent separators: colon (`:`) between level and value
- No spaces: use hyphens instead (`roast-level:light-medium`)

**Smart Tag Inference**:

Tags can be auto-generated from entity properties:

```yaml
# Auto-tag from properties
# Bean properties → auto-tag origin, roast, processing
origin: Ethiopia → tags: [origin:ethiopia]
roast-level: light → tags: [roast:light]
processing: natural → tags: [processing:natural]

# Ratings → auto-tag quality levels
rating: 4.5+ → tags: [quality:excellent]
rating: 3.0-3.9 → tags: [quality:fair]
rating: < 3.0 → tags: [quality:poor]

# Dates → auto-tag temporal
date: 2025-10-28 → tags: [month:2025-10, year:2025, season:fall]

# Relationships → auto-tag connection types
relationships.uses-bean → tags: [connected:beans]
relationships.similar-to → tags: [connected:similar]
```

**Tag Query Examples**:

```dataviewjs
// Find all light roast Ethiopians
const beans = dv.pages('"Beans Library"')
  .where(p => 
    p.type === "bean-profile" &&
    p.tags && 
    p.tags.includes("roast:light") &&
    p.tags.includes("origin:ethiopia")
  );

// Find excellent coffees from this month
const excellent = dv.pages('"Coffee Logs"')
  .where(p =>
    p.type === "coffee-log" &&
    p.tags &&
    p.tags.includes("quality:excellent") &&
    p.tags.includes("month:2025-10")
  );

// Find favorite V60 recipes
const recipes = dv.pages('"Recipes"')
  .where(p =>
    p.type === "recipe-profile" &&
    p.tags &&
    p.tags.includes("method:v60") &&
    p.tags.includes("personal:favorite")
  );
```

**Tag Categories Reference**:

| Level | Category | Examples |
|-------|----------|----------|
| 1 | category | `category:coffee-log`, `category:bean-profile` |
| 2 | method | `method:v60`, `method:chemex`, `method:espresso` |
| 2 | origin | `origin:ethiopia`, `origin:colombia`, `origin:kenya` |
| 2 | roaster | `roaster:onyx`, `roaster:blue-bottle` |
| 3 | roast | `roast:light`, `roast:medium`, `roast:dark` |
| 3 | processing | `processing:natural`, `processing:washed`, `processing:honey` |
| 3 | variety | `variety:gesha`, `variety:bourbon`, `variety:caturra` |
| 4 | quality | `quality:excellent`, `quality:good`, `quality:poor` |
| 4 | status | `dialed-in:true`, `needs-work:true`, `specialty-grade:true` |
| 5 | personal | `personal:favorite`, `personal:to-rebuy`, `personal:reference` |
| 6 | temporal | `month:2025-10`, `year:2025`, `season:fall` |

### Graph Relationship Properties (Coffee Vault 5.0)

**Purpose**: Explicit bidirectional relationship tracking for graph-based queries and relationship visualization

All entities gain explicit relationship tracking properties:

```yaml
# Outgoing Relationships (explicit links)
relationships:
  # Usage relationships
  uses-bean: [list] # Links to bean profiles used
  uses-equipment: [list] # Links to equipment profiles used
  uses-recipe: [list] # Links to recipe profiles followed
  uses-method: [list] # Links to brewing guides/methods used
  
  # Entity relationships
  visited-roaster: [list] # Links to roaster profiles visited
  related-to-origin: [list] # Links to origin profiles
  part-of-session: [list] # Links to cupping sessions participated in
  part-of-event: [list] # Links to coffee events participated in
  related-to-producer: [list] # Links to producer profiles
  related-to-goal: [list] # Links to coffee goals
  
  # Hierarchical relationships
  parent-entity: link # Parent in hierarchy
  child-entities: [list] # Children in hierarchy
  
  # Semantic relationships (ML-generated or manually curated)
  similar-to: [list] # Similar entities (based on characteristics)
  influences: [list] # Entities this influences or affects
  pairs-well-with: [list] # Good combinations (bean-method, etc.)
  requires: [list] # Prerequisites (equipment, knowledge, etc.)
  enables: [list] # Enables/permits (what this makes possible)
  derived-from: [list] # Derived/recreated from (recipes from logs, etc.)
  preferred-with: [list] # Optimal combinations
  contraindicated-with: [list] # Poor combinations (what doesn't work well)

# Incoming Relationship Reverse Lookups (auto-calculated, optional)
# These are computed by queries, not stored directly in frontmatter
# Query examples provided in Relationships documentation
```

#### Relationship Types Vocabulary

Standardized relationship types for consistent querying:

| Relationship Type | Direction | Description | Example |
|-------------------|-----------|-------------|---------|
| `uses` | Outgoing | Equipment/bean/method usage | Coffee Log → Bean Profile |
| `produces` | Outgoing | Producer → Bean relationship | Producer → Bean Profile |
| `roasts` | Outgoing | Roaster → Bean relationship | Roaster → Bean Profile |
| `originates-from` | Outgoing | Bean → Origin relationship | Bean Profile → Origin Profile |
| `influences` | Bidirectional | One entity affects another | Bean characteristics → Flavor profile |
| `similar-to` | Bidirectional | Similarity relationships (ML-generated) | Bean A → Bean B (similar characteristics) |
| `part-of` | Outgoing | Hierarchical relationships | Cupping Sample → Cupping Session |
| `derived-from` | Outgoing | Derived/recreated from | Recipe → Coffee Log (successful brew) |
| `preferred-with` | Bidirectional | Optimal combinations | Bean → Method (optimal pairing) |
| `contraindicated-with` | Bidirectional | Poor combinations | Bean → Method (poor pairing) |
| `requires` | Outgoing | Prerequisites | Recipe → Equipment (required equipment) |
| `enables` | Outgoing | Enables/permits | Equipment → Method (enables method) |

#### Relationship Query Examples

**Basic Relationship Traversal**:
```javascript
// Find all beans used in coffee logs
const beans = dv.pages('"Beans Library"')
  .where(p => p.type === "bean-profile")
  .map(p => ({
    bean: p.name,
    usedIn: dv.pages('"Coffee Logs"')
      .where(log => log.type === "coffee-log" && log.beans === p.name)
      .length
  }));
```

**Graph Traversal**:
```javascript
// Find similar beans
const similarBeans = dv.pages('"Beans Library"')
  .where(p => p.type === "bean-profile" && p.relationships && p.relationships["similar-to"])
  .map(p => ({
    bean: p.name,
    similar: p.relationships["similar-to"]
  }));
```

**Relationship Aggregation**:
```javascript
// Find most connected entities
const connections = dv.pages()
  .where(p => p.relationships)
  .map(p => ({
    entity: p.file.name,
    connectionCount: Object.values(p.relationships || {})
      .flat()
      .filter(Boolean)
      .length
  }))
  .sort(c => c.connectionCount, 'desc');
```

#### Versioning & History System (Coffee Vault 5.0)

All entities gain optional version tracking:

```yaml
# Version Tracking
version: number (entity version number, starts at 1)
created-version: number (version when created, typically 1)
last-modified-version: number (version when last changed)
version-history: list (change log entries)

# Change Log Entry Format
changelog:
  - date: date (change date)
    version: number (version number)
    changes: text (what changed)
    reason: text (why changed)
    changed-by: text (who/what made change, user or system)
```

**Example Change Log**:
```yaml
changelog:
  - date: 2025-10-28
    version: 2
    changes: Added producer-link property, updated certifications list
    reason: Enhanced supply chain transparency
    changed-by: Coffee Vault 5.0 migration script
  - date: 2025-10-15
    version: 1
    changes: Initial creation
    reason: New bean added to vault
    changed-by: User
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

This Property Schema defines **500+ properties** across **17 note types** (11 original + 6 new in 5.0), providing comprehensive structure for:

- Daily coffee practice tracking
- Scientific coffee education
- Equipment and supplier management
- Quality assessment and cupping
- Analytics and optimization
- Personal coffee journey documentation
- Supply chain transparency (5.0)
- Recipe management (5.0)
- Event tracking (5.0)
- Goal tracking (5.0)

**Key Principles**:
- **Consistency**: Same property names, same meanings
- **Flexibility**: Required properties minimal, optional properties extensive
- **Queryability**: Designed for powerful Datacore queries
- **Extensibility**: Easy to add personal properties
- **Validation**: Clear rules with automated checking

**This schema is AUTHORITATIVE** - all templates, queries, scripts, and user documentation must conform to this specification.

---

---

## Note Type Specifications (Coffee Vault 5.0 Additions)

### 12. Producer/Farm Profile (`type: producer-profile`)

**Purpose**: Complete supply chain tracking and producer relationship management

**Required Properties**:
```yaml
type: producer-profile
name: text (producer/farm/cooperative name, required)
category: text (select: farm, cooperative, washing-station, exporter, importer, other)
```

**Basic Information**:
```yaml
# Identification
name: text (producer/farm/cooperative name)
category: text (farm, cooperative, washing-station, exporter, importer, other)
aliases: list (alternative names)
established: text (year established)

# Location
country: text (country name)
region: text (region/province)
subregion: text (micro-region/district)
city: text (nearest city)
coordinates: text (GPS coordinates, lat,lon format)
address: text (physical address if known)
map-reference: text (link to map)
```

**Farm Characteristics**:
```yaml
# Physical Characteristics
altitude-min: number (minimum altitude in meters)
altitude-max: number (maximum altitude in meters)
altitude-typical: number (typical growing altitude)
hectares: number (farm size in hectares)
terrain: text (mountain, highland, plateau, valley)
soil-type: text (volcanic, clay, loam, alluvial)
microclimate: text (climate characteristics)

# Production Capacity
annual-production: number (kg or bags per year)
production-volume: text (small, medium, large, very-large)
peak-season: text (primary harvest season)
harvest-frequency: text (once, twice, continuous)
varieties-grown: list (coffee varieties cultivated)
processing-capability: list (processing methods available)
```

**Organization Structure**:
```yaml
# Organizational Type
organization-type: text (select: individual-farm, family-farm, cooperative, washing-station, exporter, importer, other)
membership-count: integer (cooperative members if applicable)
farmers-count: integer (number of farmers)
workers-count: integer (number of workers)
women-farmers: integer (women farmers count)
women-workers: integer (women workers count)

# Leadership
owner-name: text (owner/founder name)
manager-name: text (manager/administrator)
contact-person: text (primary contact)
contact-email: text (email address)
contact-phone: text (phone number)
website: text (URL if available)
```

**Certifications & Sustainability**:
```yaml
# Certifications
certifications: list (organic, fair-trade, rainforest-alliance, bird-friendly, shade-grown, carbon-neutral, b-corp, direct-trade-verified, rfa, utz, c.a.f.e-practices, smbc)
certification-numbers: text (certificate IDs)
certification-dates: list (certification issue dates)
certification-expiry: list (expiry dates)

# Sustainability Metrics
environmental-impact-score: number (1-10, if calculated)
social-impact-score: number (1-10, if calculated)
sustainability-rating: text (select: poor, fair, good, excellent, outstanding)
organic-percentage: number (% of production organic)
sustainable-practices: list (specific practices)
carbon-footprint: number (kg CO2 per kg coffee, if known)
water-conservation: boolean (water conservation practices)
soil-conservation: boolean (soil conservation practices)
biodiversity-protection: boolean (biodiversity initiatives)
```

**Direct Trade Relationships**:
```yaml
# Roaster Connections
roaster-partners: list (links to roaster profiles)
partnership-start: date (when relationship began)
contract-terms: text (contract details if known)
price-premium: number (% above commodity price)
direct-trade-verified: boolean (verified direct trade)
relationship-quality: text (select: new, developing, strong, long-term)

# Contract Details
contract-type: text (multi-year, annual, seasonal, spot)
price-mechanism: text (fixed, floating, quality-based)
quality-requirements: text (quality standards)
payment-terms: text (payment schedule)
```

**Quality Profile**:
```yaml
# Quality Characteristics
typical-quality-grade: text (common quality grades produced)
specialty-grade-percentage: number (% specialty grade)
cupping-score-range: text (typical SCA scores, e.g., "83-88")
quality-consistency: text (select: inconsistent, variable, consistent, very-consistent)
quality-reputation: text (select: unknown, developing, good, excellent, exceptional)

# Quality Control
cupping-labs: boolean (has cupping lab)
quality-control-program: boolean (QC program in place)
traceability-system: boolean (traceability tracking)
lot-tracking: boolean (lot-level tracking)
```

**Economic & Social Impact**:
```yaml
# Economic Metrics
farmer-income-premium: number (% above commodity price paid)
price-per-kg: number (typical price per kg)
annual-revenue: number (if known)
employment-created: integer (jobs created)
local-economic-impact: text (impact on local economy)

# Social Programs
education-programs: boolean (farmer education)
healthcare-access: boolean (healthcare provided)
housing-improvements: boolean (housing support)
infrastructure-development: boolean (infrastructure projects)
community-investment: text (community investment details)
```

**Personal Relationship**:
```yaml
# Engagement History
date-discovered: date (when you learned about producer)
first-contact: date (first communication)
visits-count: integer (number of visits)
last-visit: date (most recent visit)
visit-notes: text (visit observations)

# Relationship Assessment
relationship-strength: text (select: none, casual, developing, strong, deep)
communication-frequency: text (select: none, rare, occasional, regular, frequent)
personal-connection: boolean (personal relationship exists)
would-support: boolean (would continue supporting)
recommendation: text (would recommend to others)

# Notes
producer-story: text (background story)
personal-notes: text (your observations)
relationship-notes: text (relationship details)
tags: list (categorization)
```

---

### 13. Cupping Session (`type: cupping-session`)

**Purpose**: Formal cupping and comparative evaluation sessions

**Required Properties**:
```yaml
type: cupping-session
date: date (session date, required)
protocol: text (cupping protocol used, required)
session-type: text (session type, required)
```

**Session Information**:
```yaml
# Basic Info
date: date (session date)
time: text (time of day)
location: text (where cupping took place)
protocol: text (select: SCA, COE, CQI, informal, custom, professional, training)
session-type: text (select: formal-cupping, comparison, blind-cupping, training, evaluation, competition, casual)
purpose: text (reason for cupping)

# Participants
participants: list (who participated)
participant-count: integer (number of participants)
cupper-names: list (names of cuppers)
cupper-levels: list (skill levels: professional, advanced, intermediate, beginner)
```

**Samples Evaluated**:
```yaml
# Coffee Samples
samples: list (links to bean profiles evaluated)
sample-count: integer (number of coffees cupped)
sample-labels: list (blind labels if blind cupping)
blind-cupping: boolean (were samples blind)
sample-order: list (order evaluated)
reference-sample: text/link (reference coffee if used)

# Sample Preparation
roast-level-target: text (target roast level)
roast-uniformity-check: boolean (roast uniformity verified)
grind-size: text (grind setting used)
grind-uniformity-check: boolean (grind uniformity verified)
sample-weight: number (grams per cup, typically 12g)
cup-count-per-sample: integer (number of cups per sample, typically 5)
```

**Cupping Setup**:
```yaml
# Water & Environment
water-temperature: number (Celsius, typically 93-96)
water-type: text (filtered, remineralized, distilled, tap)
water-tds: number (ppm)
water-chemistry-notes: text (water chemistry details)
room-temperature: number (ambient temperature Celsius)
room-humidity: number (relative humidity %)
lighting: text (natural, artificial, dim, bright)
distractions: boolean (distractions present)

# Equipment
cupping-spoons: text (spoon type/material)
cups-used: text (cup type/size)
scoring-sheets: text (SCA sheets, digital, custom)
timer-used: boolean (timed protocol)
scale-used: boolean (weighed samples)
```

**SCA Scoring Results**:
```yaml
# Scoring Method
scoring-system: text (SCA-100-point, COE, custom, informal)
scores-recorded: boolean (formal scores recorded)
consensus-scoring: boolean (consensus scores reached)

# Sample Scores (can be array of scores for each sample)
sample-scores: list (total scores for each sample, 0-100)
sample-rankings: list (rankings of samples, 1-N)
top-sample: text/link (highest scoring sample)
top-score: number (highest score achieved)
specialty-grade-count: integer (samples scoring 80+)
```

**Session Outcomes**:
```yaml
# Discoveries
key-discoveries: text (major findings)
standout-samples: list (exceptional coffees)
surprises: text (unexpected results)
disappointments: text (samples that didn't meet expectations)

# Comparative Analysis
best-value: text/link (best value coffee)
most-complex: text/link (most complex coffee)
best-balance: text/link (best balanced coffee)
most-unique: text/link (most unique/different coffee)
consensus-favorite: text/link (group favorite)

# Recommendations
would-purchase: list (samples to purchase)
would-not-purchase: list (samples to avoid)
blending-potential: text (blending suggestions)
roasting-recommendations: text (roast level suggestions)
```

**Documentation**:
```yaml
# Media
cupping-sheets-photos: list (photos of scoring sheets)
video-recording: text (video link if recorded)
audio-notes: text (voice memo link)
photos: list (session photos)

# Notes
session-notes: text (general observations)
protocol-deviations: text (deviations from standard protocol)
environmental-factors: text (environmental impacts)
learning-points: text (what was learned)
next-steps: text (follow-up actions)

# Metadata
duration: duration (session duration)
intensity: text (select: light, moderate, intensive, exhausting)
quality-of-session: text (select: poor, fair, good, excellent)
would-repeat: boolean (would do again)
tags: list (categorization)
```

---

### 14. Recipe Profile (`type: recipe-profile`)

**Purpose**: Reusable brewing recipes with success tracking

**Required Properties**:
```yaml
type: recipe-profile
name: text (recipe name, required)
brew-method: text (brewing method, required)
created-date: date (creation date, required)
```

**Recipe Information**:
```yaml
# Basic Info
name: text (recipe name/identifier)
description: text (recipe description)
brew-method: text (select: v60, chemex, aeropress, french-press, espresso, moka-pot, clever, kalita-wave, siphon, cold-brew, other)
recipe-author: text (who created this recipe)
created-date: date (when recipe created)
last-modified: date (last modification)
version: number (recipe version number)
recipe-source: text (origin: personal, adapted, from-roaster, from-barista, competition)

# Derived From
derived-from-log: text/link (coffee log that inspired this)
derived-from-recipe: text/link (recipe this was adapted from)
based-on: text (what this recipe is based on)
```

**Target Bean Characteristics**:
```yaml
# Ideal Bean Profile
target-origin: text/link (preferred origin)
target-varieties: list (preferred varieties)
target-processing: text (preferred processing method)
target-roast-level: text (select: light, light-medium, medium, medium-dark, dark)
target-roast-style: text (Nordic, American, Italian, etc.)
bean-characteristics: text (ideal bean characteristics)
works-with: list (coffee types this works well with)
avoid-with: list (coffee types to avoid)
```

**Equipment Requirements**:
```yaml
# Required Equipment
required-equipment: list (essential equipment needed)
brewer-model: text (specific brewer if applicable)
grinder-required: boolean (grinder needed)
grinder-type: text (preferred grinder type)
filter-type: text (filter requirements)
accessories: list (other accessories needed)

# Optional Equipment
optional-equipment: list (nice-to-have equipment)
scale-needed: boolean (scale required)
timer-needed: boolean (timer required)
gooseneck-kettle: boolean (gooseneck kettle needed)
water-kettle-type: text (kettle requirements)
```

**Recipe Parameters**:
```yaml
# Core Parameters
dose: number (coffee in grams)
water: number (water in grams/ml)
ratio: text (brew ratio, e.g., "1:16")
grind-size: text (select: extra-fine, fine, medium-fine, medium, medium-coarse, coarse, extra-coarse)
grind-setting: text (grinder-specific setting)
water-temperature: number (Celsius)
total-brew-time: duration (total time MM:SS)

# Parameter Ranges (flexible adjustments)
dose-range: text (adjustable range, e.g., "15-20g")
water-range: text (adjustable range)
ratio-range: text (adjustable ratio range)
grind-range: text (adjustable grind range)
temp-range: text (adjustable temperature range)
time-range: text (adjustable time range)
```

**Step-by-Step Instructions**:
```yaml
# Brewing Steps
steps: text (detailed step-by-step instructions)
timed-steps: list (steps with specific timing)
technique-notes: text (special techniques)
pour-technique: text (pouring method if applicable)
agitation-method: text (stirring/swirling technique)
bloom-time: duration (bloom duration if applicable)
bloom-water: number (bloom water in grams)
pour-count: integer (number of pours)
pour-timing: list (timing for each pour)
pour-pattern: text (pour pattern description)
```

**Success Metrics**:
```yaml
# Target Outcomes
target-tds: number (target TDS %)
target-extraction-yield: number (target extraction %)
target-strength: text (target strength level)
target-flavor-profile: text (desired flavor characteristics)
success-criteria: text (how to know recipe succeeded)

# Quality Indicators
signs-of-success: list (indicators of good brew)
signs-of-failure: list (indicators of poor brew)
troubleshooting-cues: text (when to adjust)
```

**Recipe Variations**:
```yaml
# Variations
variations: list (alternative approaches)
variation-notes: text (when to use variations)
alternative-ratios: list (alternative ratios)
alternative-temps: list (alternative temperatures)
winter-version: text (winter adjustment)
summer-version: text (summer adjustment)
```

**Usage Statistics**:
```yaml
# Performance Tracking
times-used: integer (number of times recipe used)
success-rate: number (percentage of successful brews)
avg-rating: number (average rating when using recipe)
best-rating: number (highest rating achieved)
last-used: date (most recent use)
first-used: date (first use)

# Bean Usage
beans-used-with: list (beans successfully used with recipe)
best-bean-match: text/link (best bean match)
most-used-with: text/link (most frequently used bean)
```

**Recipe Notes**:
```yaml
# Documentation
tips: text (helpful tips for success)
common-mistakes: text (what to avoid)
adjustment-guide: text (how to adjust for different coffees)
troubleshooting: text (problem solving)
notes: text (general notes)
tags: list (categorization)
```

---

### 15. Equipment Model (`type: equipment-model`)

**Purpose**: Equipment database with specifications and community reviews

**Required Properties**:
```yaml
type: equipment-model
name: text (equipment name/model, required)
brand: text (manufacturer brand, required)
category: text (equipment category, required)
```

**Basic Information**:
```yaml
# Identification
name: text (model name/product name)
brand: text (manufacturer brand)
model-number: text (specific model number)
category: text (select: grinder, brewer, kettle, scale, roaster, espresso-machine, accessories, filter, other)
subcategory: text (more specific type)
sku: text (SKU/part number)
release-year: text (year released)
discontinued: boolean (still in production)
discontinued-year: text (year discontinued)
```

**Manufacturer Specifications**:
```yaml
# Specifications Database
capacity: text (size/capacity specifications)
dimensions: text (size measurements)
weight: number (kg)
material: text (build materials)
color-options: list (available colors/finishes)
power-requirements: text (electrical requirements)
warranty-period: text (warranty length)
country-of-origin: text (manufacturing country)

# For Grinders
burr-type: text (flat, conical, blade, none)
burr-size: number (mm diameter)
burr-material: text (steel, ceramic, titanium)
grind-range: text (grind size range capability)
grind-settings: integer (number of settings)
stepless: boolean (stepless adjustment)
rpm: integer (rotation speed)
retention: number (grams retained)
dose-capacity: number (grinding capacity)

# For Brewers
brew-capacity: number (ml capacity)
filter-type: text (filter requirements)
material-contact: text (materials touching coffee/water)
thermal-properties: text (heat retention)
flow-rate: text (water flow characteristics)

# For Scales
precision: number (precision in grams)
max-weight: number (maximum weight capacity)
auto-tare: boolean (auto-tare feature)
timer-included: boolean (built-in timer)
battery-type: text (battery requirements)
```

**Pricing & Availability**:
```yaml
# Price Tracking
msrp: number (manufacturer suggested retail price)
current-price: number (current market price)
price-history: list (historical pricing data)
price-trend: text (select: stable, increasing, decreasing, volatile)
deal-alerts: boolean (track deals)
availability-status: text (select: in-stock, low-stock, backordered, discontinued, limited)
retailers: list (where to purchase)
online-retailers: list (online vendors)
best-price-current: number (current best price)
best-price-retailer: text (retailer with best price)
```

**Reviews & Ratings**:
```yaml
# Community Ratings
community-rating: number (aggregated community rating 1-5)
review-count: integer (number of reviews aggregated)
user-reviews: list (links to user reviews)
professional-reviews: list (professional review links)
rating-breakdown: text (rating distribution)

# Performance Ratings
build-quality-rating: number (1-5)
reliability-rating: number (1-5)
ease-of-use-rating: number (1-5)
value-rating: number (1-5)
consistency-rating: number (1-5)

# Vault Usage
times-used-in-vault: integer (usage in this vault)
avg-rating-in-vault: number (average rating in vault)
vault-users-count: integer (users in vault who own this)
```

**Comparisons**:
```yaml
# Model Comparisons
competitors: list (competitive models)
comparison-notes: text (comparison details)
advantages-over-competitors: list (advantages)
disadvantages-vs-competitors: list (disadvantages)
upgrade-from: list (models this upgrades from)
upgrade-to: list (models to upgrade to)
alternative-options: list (alternative equipment)
```

**Compatibility**:
```yaml
# Compatibility Matrix
compatible-with: list (compatible equipment)
requires: list (required accessories/equipment)
works-with: list (works well with)
not-compatible-with: list (doesn't work with)
replacement-parts: list (available replacement parts)
accessories-available: list (available accessories)
```

**Research & Documentation**:
```yaml
# Resources
manufacturer-website: text (URL)
manual-link: text (manual/documentation URL)
video-reviews: list (video review links)
written-reviews: list (article review links)
specification-sheet: text (spec sheet URL)
community-forums: list (relevant forum discussions)

# Notes
research-notes: text (research findings)
technical-notes: text (technical details)
known-issues: list (known problems/issues)
recalls: list (product recalls if any)
firmware-updates: boolean (firmware update capability)
tags: list (categorization)
```

---

### 16. Coffee Event (`type: coffee-event`)

**Purpose**: Coffee experiences beyond brewing (cafes, classes, festivals, etc.)

**Required Properties**:
```yaml
type: coffee-event
event-type: text (event type, required)
date: date (event date, required)
name: text (event/cafe/experience name, required)
```

**Event Information**:
```yaml
# Basic Info
name: text (event/cafe/experience name)
event-type: text (select: cafe-visit, coffee-class, workshop, competition, festival, roastery-visit, cupping-event, coffee-tour, coffee-travel, other)
date: date (event date)
time: text (time of day)
duration: duration (how long event lasted)
location: text (location name)
address: text (physical address)
city: text (city)
country: text (country)
coordinates: text (GPS coordinates)
```

**Cafe Visit Specific**:
```yaml
# Cafe Details (if event-type: cafe-visit)
cafe-name: text (cafe name)
cafe-chain: boolean (part of chain)
roaster-affiliated: text/link (affiliated roaster)
atmosphere: text (select: cozy, modern, industrial, minimalist, busy, quiet)
seating-capacity: text (seating description)
wifi-available: boolean
food-available: boolean
roasting-on-site: boolean

# Coffee Tried
coffees-tried: list (coffees sampled)
beans-used: list (bean profiles if known)
roasters-featured: list (roasters featured)
methods-available: list (brewing methods offered)
barista-names: list (baristas names if noted)
```

**Learning Experience Specific**:
```yaml
# Classes/Workshops (if event-type: coffee-class or workshop)
class-name: text (class/workshop name)
instructor: text (instructor name)
instructor-credentials: text (instructor background)
class-level: text (select: beginner, intermediate, advanced, professional)
topics-covered: list (topics discussed)
skills-learned: list (skills acquired)
cost: number (cost to attend)
certification-earned: boolean (certification received)
certification-type: text (type of certification)
```

**Competition Specific**:
```yaml
# Competitions (if event-type: competition)
competition-name: text (competition name)
competition-type: text (barista, cupping, roasting, latte-art, other)
your-participation: text (select: competitor, judge, spectator, volunteer)
your-results: text (your results if competed)
winners: list (competition winners)
learnings: text (what you learned)
```

**Festival/Event Specific**:
```yaml
# Festivals/Events (if event-type: festival)
festival-name: text (festival/event name)
organizers: list (event organizers)
vendors-present: list (vendors/roasters present)
roasters-featured: list (featured roasters)
beans-discovered: list (new beans discovered)
events-attended: list (sub-events attended)
highlights: text (event highlights)
```

**Roastery Visit Specific**:
```yaml
# Roastery Visits (if event-type: roastery-visit)
roastery-name: text (roastery name)
roaster-link: text/link (roaster profile)
tour-taken: boolean (took tour)
cupping-offered: boolean (cupping participated)
beans-purchased: list (beans purchased)
equipment-seen: list (equipment observed)
roaster-met: text (roaster met)
production-capacity: text (production observations)
```

**Travel Coffee Specific**:
```yaml
# Coffee Travel (if event-type: coffee-travel)
destination: text (travel destination)
coffee-culture-observed: text (local coffee culture)
local-methods: list (local brewing methods)
coffee-shops-visited: list (cafes visited)
beans-purchased-abroad: list (beans bought)
cultural-notes: text (cultural observations)
travel-photos: list (photo links)
```

**General Event Properties**:
```yaml
# Experience Assessment
overall-rating: number (overall experience rating 1-5)
value-rating: number (value for money 1-5)
would-repeat: boolean (would do again)
would-recommend: boolean (would recommend)
highlights: text (best parts)
disappointments: text (letdowns)

# Costs
cost: number (total cost)
travel-cost: number (travel expenses if applicable)
food-cost: number (food expenses)
coffee-cost: number (coffee purchases)
total-cost: number (total event cost)

# Documentation
photos: list (event photos)
videos: list (video links)
receipts: list (receipt/document links)
swag-received: list (items received)
contacts-made: list (people met)
business-cards: list (contacts collected)

# Notes
event-notes: text (general observations)
learnings: text (what was learned)
insights: text (key insights)
follow-up-actions: list (follow-up items)
tags: list (categorization)
```

---

### 17. Coffee Goal (`type: coffee-goal`)

**Purpose**: Personal development and goal tracking

**Required Properties**:
```yaml
type: coffee-goal
goal-type: text (goal category, required)
target-date: date (target completion date, required)
status: text (goal status, required)
```

**Goal Information**:
```yaml
# Basic Info
goal-type: text (select: learn-method, explore-origin, achieve-rating, complete-course, master-technique, visit-destination, purchase-equipment, try-beans-count, complete-certification, other)
title: text (goal title/name)
description: text (goal description)
target-date: date (target completion date)
start-date: date (goal start date)
status: text (select: planned, in-progress, paused, completed, abandoned)
priority: text (select: low, medium, high, critical)
category: text (learning, exploration, achievement, equipment, certification)
```

**Target Metrics**:
```yaml
# Specific Objectives
target-metrics: text (specific measurable objectives)
quantitative-target: number (numeric target if applicable)
qualitative-target: text (qualitative objective)
success-criteria: text (how to know goal achieved)
milestones: list (intermediate milestones)
current-progress: number (current progress indicator)
progress-percentage: number (percentage complete)
```

**Goal-Specific Properties**:
```yaml
# Learning Goals (if goal-type: learn-method, master-technique, complete-course)
method-to-learn: text (brewing method to learn)
technique-to-master: text (technique to master)
course-name: text (course to complete)
learning-resources: list (resources needed)
practice-sessions-required: integer (sessions needed)
practice-sessions-completed: integer (sessions done)

# Exploration Goals (if goal-type: explore-origin, try-beans-count)
origin-to-explore: text/link (origin to explore)
beans-to-try-count: integer (number of beans to try)
beans-tried-count: integer (beans tried so far)
origins-explored: list (origins explored)
beans-discovered: list (beans discovered)

# Achievement Goals (if goal-type: achieve-rating, complete-certification)
target-rating: number (rating to achieve)
current-best-rating: number (current best rating)
certification-type: text (certification to earn)
certification-body: text (certifying organization)
exam-date: date (exam/certification date)
study-hours-needed: number (study hours required)
study-hours-completed: number (study hours done)

# Equipment Goals (if goal-type: purchase-equipment)
equipment-to-purchase: text/link (equipment model)
budget: number (budget available)
savings-needed: number (savings required)
purchase-date-target: date (target purchase date)

# Travel Goals (if goal-type: visit-destination)
destination: text (coffee destination to visit)
travel-budget: number (travel budget)
travel-dates-planned: date (planned travel dates)
```

**Progress Tracking**:
```yaml
# Progress Updates
progress-updates: list (progress update entries)
last-update: date (last progress update)
next-checkpoint: date (next milestone date)
checkpoints-completed: integer (milestones achieved)
checkpoints-total: integer (total milestones)

# Activities Related
related-logs: list (coffee logs related to goal)
related-beans: list (beans tried for goal)
related-equipment: list (equipment used for goal)
related-resources: list (resources used)
```

**Resources & Support**:
```yaml
# Learning Resources
learning-resources: list (books, courses, videos)
study-materials: list (materials needed)
tools-needed: list (tools/equipment needed)
mentor-coach: text (mentor/coach if applicable)
study-group: text (study group if applicable)

# Related Content
related-guides: list (guides to read)
related-references: list (scientific references)
related-beans: list (beans to try)
related-roasters: list (roasters to explore)
related-origins: list (origins to explore)
```

**Timeline & Deadlines**:
```yaml
# Timeline
created-date: date (goal created)
start-date: date (actual start date)
target-date: date (target completion)
completed-date: date (actual completion if done)
estimated-duration: duration (estimated time needed)
actual-duration: duration (actual time taken)
deadline-approaching: boolean (deadline soon)
deadline-overdue: boolean (deadline passed)
```

**Outcomes**:
```yaml
# Completion Details
completed: boolean (goal completed)
completion-date: date (when completed)
achievement-level: text (select: exceeded, met, partial, not-met)
actual-outcome: text (what actually happened)
lessons-learned: text (what was learned)
challenges-faced: text (challenges encountered)
success-factors: text (what contributed to success)
improvements-needed: text (what could be improved)

# Celebration
celebrated: boolean (achievement celebrated)
celebration-notes: text (how celebrated)
next-goal: text/link (related next goal)
tags: list (categorization)
```

---

**Version**: 5.0.0
**Last Updated**: 2025-10-28
**Status**: Production (5.0 Additions)
**Maintainer**: Coffee Vault Development Team

*For questions or suggested additions, consult the community or extend locally following the guidelines above.*
