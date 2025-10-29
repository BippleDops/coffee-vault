---
type: brewing-guide
brew-method: Aeropress
difficulty: beginner
source: Aerobie official + competition recipes
date-created: 2025-10-24
tags: [brewing-guide, aeropress, versatile]
---

# ☕ Aeropress Brewing Guide

**Difficulty**: Beginner  
**Source**: Aerobie official + competition recipes  
**Last Updated**: 2025-10-24

---

## 📋 Overview

**Best For**: Versatile brewing; travel; experimentation; single servings; clean or full-bodied cups depending on recipe

The Aeropress is one of the most versatile and beloved coffee brewers. Invented in 2005, it uses air pressure to push water through coffee, creating a concentrate that can be diluted to taste. It's fast, forgiving, easy to clean, nearly indestructible, and produces everything from espresso-like shots to clean filter coffee.

**Time Required**: 1.5-3 minutes

**Equipment Needed**:
- Aeropress (standard or Go)
- Aeropress filters (paper or metal)
- Grinder
- Kettle
- Scale
- Timer
- Stirrer (included)
- Sturdy mug or carafe

---

## ⚙️ Standard Recipe (Classic Method)

### Basic Parameters

| Parameter | Value | Notes |
|-----------|-------|-------|
| Coffee Dose | 17g | For single serving |
| Water | 200g total | 60g bloom + 140g main |
| Ratio | 1:12 | Concentrated, dilute to taste |
| Grind Size | Medium-fine | Between espresso and pour-over |
| Water Temp | 185-195°F / 85-91°C | Lower than most methods |
| Brew Time | 2 minutes | Total time from water to press |
| Press Time | 20-30 seconds | Gentle, steady pressure |

### Orientation Options

- **Standard**: Chamber on top, plunger pushes down into cup
- **Inverted**: Flipped upside down, more immersion control

---

## 📝 Step-by-Step Instructions

### Preparation (Standard Method)

1. **Place filter in cap** - Paper filter, rinse with hot water
2. **Attach cap to chamber** - Screw on tightly
3. **Place on sturdy mug** - Ensure stable
4. **Add coffee** - 17g medium-fine grind

### Brewing Process

1. **0:00 - Bloom**
   - Start timer
   - Add 60g water (185-195°F)
   - Stir vigorously 5-10 times
   - Creates foam, releases CO2

2. **0:10 - Add remaining water**
   - Pour to 200g total (140g more)
   - Insert plunger about 1cm
   - Creates seal, prevents dripping

3. **0:10-1:30 - Steep**
   - Let sit undisturbed
   - Gentle swirl at 1:00 (optional)

4. **1:30-2:00 - Press**
   - Apply steady, gentle pressure
   - Should take 20-30 seconds
   - Stop when you hear hissing air

### Finishing

1. **Dilute to taste**
   - Produced concentrate (200ml)
   - Add 50-100ml hot water for Americano-style
   - Or drink as-is for strong cup

2. **Cleanup**
   - Unscrew cap over trash
   - Press plunger - puck ejects
   - Rinse parts - takes 10 seconds
   - Reassemble

---

## 🎯 Alternative Methods

### Inverted Method (More Control)

**Setup**:
1. Insert plunger to "4" mark on chamber
2. Flip upside down (plunger on counter)
3. Add coffee to chamber
4. Chamber now acts as container

**Process**:
1. Add all water at once (200g)
2. Stir at 0:10 and 1:00
3. Attach filter cap at 1:30
4. Flip onto mug at 1:40
5. Press at 2:00

**Advantages**: No drip-through, full immersion, longer steep time control

### Championship Recipe (2019 Winner - Wendelien van Bunnik)

- 30g coffee, medium-coarse grind
- 200g water at 176°F (80°C)
- Inverted method
- 2:00 steep with gentle swirls
- 30-second press
- Dilute with 100g water

**Result**: Incredibly clean, sweet, tea-like

### Cold Brew Aeropress

- 30g coarse coffee
- 200g room temp water
- Inverted method
- Steep 12-24 hours
- Press and dilute with ice
- Smooth, sweet cold brew in small batch

### Espresso-Style (Strong Shot)

- 18g coffee, fine grind
- 50g water at 200°F
- Standard method
- 1:00 steep
- Fast, firm press (15 seconds)
- Small, concentrated shot

---

## 🔧 Troubleshooting

| Problem | Possible Cause | Solution |
|---------|----------------|----------|
| Too bitter | Over-extraction, water too hot | Lower temp to 175-185°F, press sooner, coarser grind |
| Too sour | Under-extraction, water too cool | Hotter water (195°F), finer grind, longer steep |
| Weak/watery | Not enough coffee, too much dilution | Increase dose to 20g, less dilution water |
| Too strong | Too much coffee, under-diluted | Reduce dose or add more water after |
| Hard to press | Grind too fine, too much coffee | Grind coarser, reduce dose, press slower |
| Drips through quickly | Grind too coarse | Grind finer, press faster |
| Muddy/silty | Grind too fine, pressing too hard | Grind coarser, gentle pressure, paper filter |

---

## 🎓 Advanced Tips & Tricks

**For Better Extraction**:
- Stir vigorously during bloom - breaks up clumps
- Lower water temperature than you think (180-190°F often ideal)
- Press gently - forcing creates bitterness
- Experiment with inverted vs standard
- Metal filters create fuller body, paper creates cleaner cup

**Competition Secrets**:
- Many champions use cooler water (175-185°F)
- Longer steeps (2-3 minutes) often win
- Coarser grinds than expected
- Multiple gentle swirls instead of stirring
- Bypass (dilution) is key to final cup quality

**Recipe Development**:
1. Start with standard recipe
2. Change ONE variable at a time
3. Grind size has biggest impact
4. Water temp changes character significantly
5. Dilution ratio is personal preference

**Travel Tips**:
- Aeropress Go is smaller, perfect for backpacking
- Pre-grind coffee in small containers
- Works great with hotel kettles
- Nearly indestructible
- Rinse-only cleaning acceptable for travel

---

## 📊 My Results Using This Method

```dataview
TABLE 
  beans as "Beans",
  rating as "⭐ Rating",
  date as "Date",
  grind-size as "Grind",
  water-temp as "Temp (°F)"
FROM "Coffee Logs"
WHERE brew-method = "aeropress" OR brew-method = "Aeropress"
SORT rating DESC
LIMIT 10
```

### Average Rating

```dataview
TABLE WITHOUT ID
  round(average(rows.rating), 2) as "Avg Rating",
  length(rows) as "Times Used"
FROM "Coffee Logs"
WHERE brew-method = "aeropress" OR brew-method = "Aeropress"
```

---

## 🔗 Resources

**Video Tutorials**:
- [James Hoffmann - Ultimate Aeropress Technique](https://www.youtube.com/watch?v=j6VlT_jUVPc)
- [World Aeropress Championship Recipes](https://www.youtube.com/results?search_query=world+aeropress+championship)
- [European Coffee Trip - Aeropress Comparison](https://www.youtube.com/watch?v=JsT_ZZvZcec)

**Articles**:
- [Aerobie Official Instructions](https://aeropress.com/pages/instructions)
- [World Aeropress Championship Results](https://worldaeropresschampionship.com/recipes/)
- [Perfect Daily Grind - Aeropress Guide](https://perfectdailygrind.com)

**Recipe Databases**:
- [Aeropress Timer App](https://aeropresstimer.com/) - Crowdsourced recipes
- [WAC Recipe Archive](https://aeroprecipe.com/) - Championship winning recipes

**Related Techniques**:
- [[Clever Dripper Guide]] - Similar versatility
- [[Espresso Guide]] - If using espresso-style recipe
- [[Travel Coffee Setup]] - Portable brewing

---

## 💭 Personal Notes & Modifications

**What I've Learned**:
- Lower temperatures (180-185°F) often taste better than hot
- Inverted method gives more control but standard works fine
- Cleanup is genuinely 30 seconds
- Metal filter completely changes cup profile
- Great for experimentation - forgiving and fast

**My Preferred Variations**:
- **Morning quick brew**: 17g, 200g water at 185°F, 1:30 steep, standard method
- **Strong afternoon**: 20g, 180g water at 195°F, inverted, 2:00 steep, no dilution
- **Cold days**: 17g, 150g water at 200°F, press into 100g hot water (hot Americano)

**Next Experiments**:
- Try prismo attachment (creates pressure, allows espresso-style)
- Test Fellow Prismo vs standard cap
- Experiment with multiple filter papers (2-3 stacked)
- Try ice bloom (add ice cubes to chamber before pressing)
- Compare different filter types (paper, metal, cloth)

---

## 🛠️ Accessories Worth Considering

**Essential**:
- Extra paper filters (official or aftermarket)
- Small scale that fits under Aeropress

**Nice to Have**:
- Metal filter (fuller body, no paper waste)
- Fellow Prismo (pressure valve for espresso-style)
- Funnel for loading coffee
- Carrying case for travel

**Experimental**:
- Flow control filter caps
- Reusable cloth filters
- Temperature strips
- Aeropress Timer app

---

## 📈 Why Aeropress?

**Pros**:
- Incredibly versatile (espresso to filter coffee)
- Fast brewing (1-3 minutes)
- Nearly indestructible
- Perfect for travel
- Easy cleanup (30 seconds)
- Affordable ($30-40)
- Forgiving and consistent
- Active community sharing recipes

**Cons**:
- Single serving only
- Requires some pressure/strength
- Can't walk away during brewing
- Inverted method has spill risk

**Best Use Cases**:
- Daily driver for single servings
- Travel and camping
- Office brewing
- Recipe experimentation
- When you want different styles
- First brewer for beginners

