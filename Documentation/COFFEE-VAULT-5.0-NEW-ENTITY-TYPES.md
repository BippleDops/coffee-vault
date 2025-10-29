---
type: documentation
title: Coffee Vault 5.0 - New Entity Types Guide
version: 5.0.0
date: 2025-10-28
tags: [documentation, coffee-vault-5.0, entity-types]
---

# Coffee Vault 5.0 - New Entity Types Guide

**Purpose**: Comprehensive guide to the 6 new entity types introduced in Coffee Vault 5.0

**Version**: 5.0.0  
**Last Updated**: 2025-10-28

---

## Overview

Coffee Vault 5.0 introduces **6 new entity types** that expand the vault's capabilities for comprehensive coffee intelligence:

1. **Producer/Farm Profile** - Supply chain transparency and producer relationships
2. **Cupping Session** - Formal cupping and comparative evaluation
3. **Recipe Profile** - Reusable brewing recipes with success tracking
4. **Equipment Model** - Equipment database with specifications and reviews
5. **Coffee Event** - Coffee experiences beyond brewing
6. **Coffee Goal** - Personal development and goal tracking

---

## 1. Producer/Farm Profile (`type: producer-profile`)

### Purpose

Track complete supply chain information, producer relationships, certifications, and sustainability metrics. Build a comprehensive database of coffee producers, farms, cooperatives, and their characteristics.

### Key Use Cases

- Document producer relationships from roasters
- Track certifications and sustainability metrics
- Build supply chain transparency
- Record producer visits and personal connections
- Monitor quality profiles and consistency

### Key Properties

- **Basic Info**: Name, category, location, contact information
- **Farm Characteristics**: Altitude, size, terrain, production capacity
- **Certifications**: Organic, Fair Trade, Rainforest Alliance, etc.
- **Direct Trade**: Roaster partnerships, contract terms, price premiums
- **Quality Profile**: Typical grades, cupping scores, consistency
- **Social Impact**: Economic metrics, community programs

### Template Location

`Templates/Producer Profile.md`

### Example Queries

```datacore
TABLE 
  name AS "Producer",
  country AS "Country",
  certifications AS "Certifications",
  sustainability-rating AS "Sustainability"
FROM "Producers"
WHERE type = "producer-profile"
SORT sustainability-rating DESC
```

---

## 2. Cupping Session (`type: cupping-session`)

### Purpose

Document formal cupping sessions, comparative evaluations, blind cuppings, and professional tasting sessions. Track samples evaluated, SCA scoring, and session outcomes.

### Key Use Cases

- Record formal cupping sessions
- Compare multiple coffees side-by-side
- Track blind cupping results
- Document professional cupping events
- Analyze comparative results

### Key Properties

- **Session Info**: Date, protocol (SCA/COE/CQI), participants, location
- **Samples**: List of coffees evaluated, blind labels, sample preparation
- **Setup**: Water specifications, environment, equipment used
- **Scoring**: SCA scores, rankings, specialty grade count
- **Outcomes**: Discoveries, recommendations, comparative analysis

### Template Location

`Templates/Cupping Session.md`

### Example Queries

```datacore
TABLE 
  date AS "Date",
  protocol AS "Protocol",
  sample-count AS "Samples",
  top-score AS "Top Score"
FROM "Cupping Sessions"
WHERE type = "cupping-session"
SORT date DESC
```

---

## 3. Recipe Profile (`type: recipe-profile`)

### Purpose

Create reusable brewing recipes with success tracking. Document optimal parameters, step-by-step instructions, and track recipe performance across multiple uses.

### Key Use Cases

- Save successful brewing parameters as reusable recipes
- Track recipe success rates and best bean matches
- Document recipe variations and adjustments
- Create method-specific recipe libraries
- Share recipes with others

### Key Properties

- **Recipe Info**: Name, method, author, source, version
- **Target Beans**: Ideal origin, varieties, processing, roast level
- **Equipment**: Required and optional equipment
- **Parameters**: Dose, water, ratio, grind, temperature, time (with ranges)
- **Instructions**: Step-by-step with timing and techniques
- **Success Metrics**: Target TDS, extraction yield, success criteria
- **Usage Stats**: Times used, success rate, average rating

### Template Location

`Templates/Recipe Profile.md`

### Example Queries

```datacore
TABLE 
  name AS "Recipe",
  brew-method AS "Method",
  times-used AS "Uses",
  success-rate AS "Success %",
  avg-rating AS "Rating"
FROM "Recipes"
WHERE type = "recipe-profile"
SORT success-rate DESC
```

---

## 4. Equipment Model (`type: equipment-model`)

### Purpose

Build a comprehensive equipment database with specifications, pricing, reviews, and compatibility information. Research equipment before purchase and track community ratings.

### Key Use Cases

- Research equipment before purchasing
- Compare models and specifications
- Track pricing and availability
- Aggregate community reviews and ratings
- Document compatibility information

### Key Properties

- **Basic Info**: Name, brand, model number, category, specifications
- **Pricing**: MSRP, current price, price history, availability
- **Reviews**: Community ratings, professional reviews, performance metrics
- **Comparisons**: Competitors, advantages/disadvantages, upgrade paths
- **Compatibility**: Compatible equipment, requirements, accessories

### Template Location

`Templates/Equipment Model.md`

### Example Queries

```datacore
TABLE 
  name AS "Equipment",
  brand AS "Brand",
  category AS "Category",
  current-price AS "Price",
  community-rating AS "Rating"
FROM "Equipment Models"
WHERE type = "equipment-model"
  AND category = "grinder"
SORT community-rating DESC
```

---

## 5. Coffee Event (`type: coffee-event`)

### Purpose

Document coffee experiences beyond brewing: cafe visits, classes, workshops, competitions, festivals, roastery visits, and coffee travel experiences.

### Key Use Cases

- Document cafe visits and experiences
- Track coffee classes and workshops attended
- Record competition participation
- Document festival and event experiences
- Log coffee travel experiences

### Key Properties

- **Event Info**: Name, type, date, location, duration
- **Cafe Specific**: Atmosphere, coffees tried, baristas met
- **Learning**: Instructor, topics, skills learned, certifications
- **Competition**: Competition type, results, learnings
- **Travel**: Destination, coffee culture, local methods
- **Assessment**: Ratings, costs, highlights, learnings

### Template Location

`Templates/Coffee Event.md`

### Example Queries

```datacore
TABLE 
  name AS "Event",
  event-type AS "Type",
  date AS "Date",
  location AS "Location",
  overall-rating AS "Rating"
FROM "Coffee Events"
WHERE type = "coffee-event"
SORT date DESC
```

---

## 6. Coffee Goal (`type: coffee-goal`)

### Purpose

Track personal development goals, learning objectives, exploration targets, and achievement milestones. Monitor progress and celebrate accomplishments.

### Key Use Cases

- Set learning goals (methods, techniques, courses)
- Track exploration goals (origins, beans to try)
- Achieve rating targets
- Complete certifications
- Purchase equipment goals
- Plan coffee travel

### Key Properties

- **Goal Info**: Type, title, description, status, priority, target date
- **Target Metrics**: Specific objectives, success criteria, milestones
- **Goal-Specific**: Varies by goal type (method to learn, beans to try, etc.)
- **Progress**: Updates, checkpoints, related activities
- **Resources**: Learning materials, guides, references
- **Outcomes**: Completion status, lessons learned, next goals

### Template Location

`Templates/Coffee Goal.md`

### Example Queries

```datacore
TABLE 
  title AS "Goal",
  goal-type AS "Type",
  status AS "Status",
  progress-percentage AS "Progress %",
  target-date AS "Target Date"
FROM "Coffee Goals"
WHERE type = "coffee-goal"
  AND status != "completed"
SORT priority DESC, target-date ASC
```

---

## Integration with Existing Entities

### Relationships

All new entity types integrate seamlessly with existing Coffee Vault entities:

- **Producer Profiles** link to Bean Profiles (`producer-link`)
- **Cupping Sessions** link to Bean Profiles (`samples`)
- **Recipe Profiles** link to Coffee Logs (`derived-from-log`)
- **Equipment Models** link to Equipment Profiles (user equipment)
- **Coffee Events** link to Roaster Profiles, Bean Profiles
- **Coffee Goals** link to Coffee Logs, Bean Profiles, Guides

### Data Flow

- Coffee Logs → Recipe Profiles (auto-generate recipes from successful brews)
- Bean Profiles → Producer Profiles (link to producers)
- Coffee Logs → Coffee Goals (track goal progress)
- Cupping Sessions → Bean Profiles (evaluation results)

---

## Best Practices

### When to Create Each Entity Type

1. **Producer Profile**: When you have information about a producer/farm from beans you purchase
2. **Cupping Session**: When doing formal cuppings or comparing multiple coffees
3. **Recipe Profile**: After achieving a successful brew you want to repeat
4. **Equipment Model**: When researching equipment or documenting specifications
5. **Coffee Event**: After visiting cafes, attending classes, or coffee-related events
6. **Coffee Goal**: When setting personal development or exploration objectives

### Template Usage

- Use templates from `Templates/` folder via Templater plugin
- Templates auto-populate required fields
- Optional fields can be filled incrementally
- Templates include Dataview queries for related content

### Data Consistency

- Use consistent naming conventions (kebab-case for properties)
- Link related entities using wiki-style links `[[Entity Name]]`
- Tag appropriately for discoverability
- Update related entities when new information is available

---

## Migration Notes

### Backward Compatibility

- All existing entity types (coffee-log, bean-profile, etc.) remain fully functional
- New entity types are additive - no breaking changes
- Existing queries continue to work
- New properties can be added to existing entities incrementally

### Upgrading Existing Content

- No migration required for existing content
- New entity types can be created immediately
- Optional: Link existing beans to new producer profiles
- Optional: Convert successful brews to recipe profiles

---

## Related Documentation

- **Property Schema**: `Configuration/Property-Schema.md` - Complete property reference
- **Template Standards**: `Configuration/Template-Framework-Standards.md` - Template development guide
- **Architecture Reference**: `Documentation/VAULT-ARCHITECTURE-REFERENCE.md` - System architecture

---

**Version**: 5.0.0  
**Last Updated**: 2025-10-28  
**Status**: Production

