---
type: documentation
title: Coffee Vault 5.0 - Enhanced Properties Guide
version: 5.0.0
date: 2025-10-28
tags: [documentation, coffee-vault-5.0, properties]
---

# Coffee Vault 5.0 - Enhanced Properties Guide

**Purpose**: Complete guide to enhanced properties added to existing entities in Coffee Vault 5.0

**Version**: 5.0.0  
**Last Updated**: 2025-10-28

---

## Overview

Coffee Vault 5.0 adds **150+ new properties** to existing entity types, enhancing:

1. **Coffee Log** - Precision measurements, environmental/physiological context, media documentation
2. **Bean Profile** - Supply chain transparency, ethical sourcing tracking
3. **Origin Profile** - Infrastructure, climate change impact, market access

---

## Coffee Log Enhancements

### Precision Measurements

New properties for advanced extraction tracking:

```yaml
# Extraction Precision
extraction-mass: number # Grams of extracted liquid
extraction-percentage-precise: number # Calculated precise %
first-drop-time: duration # Time to first drop
peak-extraction-time: duration # When extraction peaks
end-extraction-signal: text # How you knew to stop
slurry-temperature: number # Coffee slurry temperature
coffee-ground-temperature: number # Ground temp before brew

# Flow Metrics
flow-rate: number # ml/second
pour-velocity: text # slow, moderate, fast, aggressive
drain-rate: text # slow, moderate, fast, very-fast

# Weight Measurements
total-output-weight: number # Grams of brewed coffee
water-retention: number # Grams retained in grounds
brew-loss: number # Grams lost to evaporation
```

### Environmental Context

Enhanced weather and environment tracking:

```yaml
# Weather & Environment
weather-condition: text # sunny, cloudy, rainy, etc.
barometric-pressure: number # mbar (980-1050)
ambient-noise-level: text # quiet, moderate, noisy
distractions-present: boolean
air-quality: text # fresh, stale, smoky, fragrant

# Lighting
lighting-condition: text # natural, artificial, dim, bright
```

### Physiological Context

Track how your body state affects perception:

```yaml
# Physical State
sleep-hours-previous: number # Hours slept night before
hydration-level: text # well-hydrated, normal, dehydrated
meal-timing: text # before-meal, after-meal, fasted
caffeine-tolerance-state: text # low, normal, high
energy-level: text # tired, normal, energetic
stress-level: text # low, moderate, high

# Palate State
palate-state: text # fresh, normal, fatigued, compromised
recent-food: text # Food consumed before tasting
```

### Media Documentation

Link photos, videos, and audio notes:

```yaml
# Media Links
video-link: text # URL to brewing video
audio-notes-link: text # Voice memo link
photo-links: list # Photos of setup, process, result
setup-photo: text # Photo of brewing setup
bloom-photo: text # Photo of bloom phase
extraction-photo: text # Photo during extraction
final-cup-photo: text # Photo of final cup
timelapse-link: text # Timelapse video URL
```

---

## Bean Profile Enhancements

### Supply Chain Transparency

Complete supply chain tracking:

```yaml
# Supply Chain Links
producer-link: link # Link to producer profile
farm-link: link # Specific farm profile
cooperative-link: link # Cooperative profile
washing-station: text # Washing station name
exporter: text # Export company
importer: text # Import company
supply-chain-map: text # Full chain description
supply-chain-verified: boolean # Fully documented
traceability-level: text # low, medium, high, complete

# Lot Information
lot-number: text # Batch/lot identifier
harvest-year-season: text # Specific harvest period
```

### Contract & Pricing Details

Track ethical sourcing and pricing:

```yaml
# Contract Information
contract-type: text # direct-trade, fair-trade, spot-market
price-paid-to-farmer: number # Price per kg to farmer
price-premium-vs-commodity: number # % above commodity
profit-sharing: boolean # Farmer profit participation
long-term-contract: boolean # Multi-year contract
relationship-years: integer # Years of relationship

# Transparency & Ethics
transparency-score: number # 1-10 based on knowledge
ethical-rating: number # 1-10 ethical sourcing rating
```

---

## Origin Profile Enhancements

### Infrastructure & Market Access

Track infrastructure and support systems:

```yaml
# Infrastructure
washing-stations-count: integer # Number of washing stations
processing-facilities: list # Major facilities
transportation-infrastructure: text # Roads, ports, logistics
storage-capacity: text # Storage infrastructure
cupping-labs: list # Quality control labs
research-institutions: list # Research facilities
internet-connectivity: text # Connectivity level
electricity-access: text # Power access level

# Market Support
export-infrastructure: text # Export capabilities
government-support: text # Government support level
ngo-presence: boolean # NGO support
technical-assistance-available: boolean
financing-access: text # Access to financing
price-transparency: text # Price transparency level
market-information-access: text # Market info access
```

### Climate Change Impact

Track climate vulnerability and adaptation:

```yaml
# Climate Vulnerability
climate-vulnerability: text # low, medium, high, critical
climate-change-impacts: text # Observed changes
adaptation-strategies: text # How adapting
altitude-shift-observed: boolean # Farms moving higher
rainfall-changes: text # Precipitation changes
temperature-trends: text # Temperature trends
drought-frequency: text # Drought frequency
frost-risk: text # Frost risk level

# Adaptation & Resilience
shade-tree-programs: boolean # Shade initiatives
drought-resistant-varieties: boolean # Resistant varieties
water-management-systems: boolean # Water conservation
climate-research-active: boolean # Active research
carbon-sequestration: boolean # Carbon programs
adaptation-funding: text # Adaptation funding
resilience-score: number # 1-10 resilience rating
future-viability: text # declining, stable, improving
```

---

## Usage Examples

### Coffee Log with Enhanced Properties

```yaml
---
type: coffee-log
date: 2025-10-28
beans: Ethiopian Yirgacheffe
brew-method: v60
rating: 4.5

# Precision Measurements (5.0)
extraction-mass: 285
first-drop-time: "0:45"
slurry-temperature: 92
total-output-weight: 280
water-retention: 35

# Environmental Context (5.0)
weather-condition: sunny
barometric-pressure: 1013
ambient-noise-level: quiet
lighting-condition: natural

# Physiological Context (5.0)
sleep-hours-previous: 7.5
hydration-level: well-hydrated
palate-state: fresh
energy-level: energetic

# Media Documentation (5.0)
video-link: https://example.com/brew-video
photo-links:
  - setup-photo.jpg
  - bloom-photo.jpg
  - final-cup.jpg
---
```

### Bean Profile with Supply Chain Tracking

```yaml
---
type: bean-profile
name: Ethiopian Yirgacheffe Kochere
roaster: [[Onyx Coffee Lab]]
origin: [[Ethiopia]]

# Supply Chain Transparency (5.0)
producer-link: [[Kochere Cooperative]]
farm-link: [[Banko Gotiti Farm]]
cooperative-link: [[Kochere Cooperative]]
exporter: Moplaco
importer: Ally Coffee
supply-chain-verified: true
traceability-level: complete
lot-number: KO-2025-001

# Pricing Details (5.0)
contract-type: direct-trade
price-paid-to-farmer: 8.50
price-premium-vs-commodity: 350
long-term-contract: true
relationship-years: 5
transparency-score: 9
ethical-rating: 10
---
```

### Origin Profile with Climate Tracking

```yaml
---
type: origin-profile
name: Ethiopia Yirgacheffe
country: Ethiopia
region: Yirgacheffe

# Infrastructure (5.0)
washing-stations-count: 47
processing-facilities:
  - Kochere Washing Station
  - Banko Gotiti Mill
internet-connectivity: moderate
electricity-access: intermittent
government-support: moderate

# Climate Change Impact (5.0)
climate-vulnerability: high
climate-change-impacts: Rising temperatures, erratic rainfall
adaptation-strategies: Shade trees, drought-resistant varieties
altitude-shift-observed: true
rainfall-changes: Decreased during rainy season
drought-frequency: occasional
resilience-score: 6
future-viability: stable
---
```

---

## Migration Guide

### Adding Enhanced Properties

1. **Incremental Addition**: Add properties as you collect information
2. **Batch Updates**: Use scripts to add common properties
3. **Template Updates**: New templates include enhanced properties

### Optional Properties

All enhanced properties are **optional**. Add them when:
- You have the information available
- The data adds value to your tracking
- You want deeper insights

### Data Collection

Enhanced properties support:
- **Manual Entry**: Add via templates or direct editing
- **API Integration**: Import from external sources (future)
- **Auto-Calculation**: Some properties calculated automatically

---

## Best Practices

### Coffee Log

- Add precision measurements when available (not required)
- Track environmental factors that affect perception
- Document physiological state for palate development tracking
- Link media for future reference

### Bean Profile

- Complete supply chain info when purchasing from transparent roasters
- Track ethical sourcing for informed purchasing decisions
- Use transparency scores to compare sourcing practices

### Origin Profile

- Update climate impact annually
- Track infrastructure changes over time
- Monitor resilience and adaptation strategies

---

## Query Examples

### Find High Transparency Beans

```dataviewjs
const highTransparency = dv.pages('"Beans Library"')
  .where(p => 
    p.type === "bean-profile" &&
    p["transparency-score"] >= 8
  )
  .sort(p => p["transparency-score"], 'desc');

dv.table(["Bean", "Transparency", "Ethical Rating", "Producer"],
  highTransparency.map(p => [
    p.file.link,
    p["transparency-score"],
    p["ethical-rating"],
    p["producer-link"]
  ])
);
```

### Analyze Environmental Impact on Brewing

```dataviewjs
const logs = dv.pages('"Coffee Logs"')
  .where(p => 
    p.type === "coffee-log" &&
    p["barometric-pressure"] &&
    p.rating
  );

// Group by pressure ranges
const lowPressure = logs.where(p => p["barometric-pressure"] < 1000);
const normalPressure = logs.where(p => p["barometric-pressure"] >= 1000 && p["barometric-pressure"] <= 1020);
const highPressure = logs.where(p => p["barometric-pressure"] > 1020);

dv.paragraph(`**Low Pressure**: ${lowPressure.length} brews, avg rating ${Math.round(lowPressure.avg(p => p.rating) * 10) / 10}`);
dv.paragraph(`**Normal Pressure**: ${normalPressure.length} brews, avg rating ${Math.round(normalPressure.avg(p => p.rating) * 10) / 10}`);
dv.paragraph(`**High Pressure**: ${highPressure.length} brews, avg rating ${Math.round(highPressure.avg(p => p.rating) * 10) / 10}`);
```

### Climate Vulnerable Origins

```dataviewjs
const vulnerable = dv.pages('"Origins"')
  .where(p => 
    p.type === "origin-profile" &&
    p["climate-vulnerability"] === "high" ||
    p["climate-vulnerability"] === "critical"
  );

dv.table(["Origin", "Vulnerability", "Resilience", "Future Viability"],
  vulnerable.map(p => [
    p.file.link,
    p["climate-vulnerability"],
    p["resilience-score"],
    p["future-viability"]
  ])
);
```

---

## Related Documentation

- **Property Schema**: `Configuration/Property-Schema.md` - Complete property reference
- **New Entity Types**: `Documentation/COFFEE-VAULT-5.0-NEW-ENTITY-TYPES.md` - New entities
- **Relationship System**: `Documentation/RELATIONSHIP-SYSTEM-GUIDE.md` - Relationship tracking

---

**Version**: 5.0.0  
**Last Updated**: 2025-10-28  
**Status**: Production

