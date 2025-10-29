---
type: brewing-guide
brew-method: Espresso
difficulty: advanced
source: Multiple professional barista resources
date-created: 2025-10-24
tags: [brewing-guide, espresso]
---

# ☕ Espresso Brewing Guide

**Difficulty**: Advanced  
**Source**: Multiple professional barista resources  
**Last Updated**: 2025-10-24

---

## 📋 Overview

**Best For**: Concentrated, intense coffee experience; base for milk drinks; showcasing bean complexity in a small package

Espresso is the foundation of modern coffee culture. This pressurized brewing method forces hot water through finely-ground coffee, creating a concentrated shot with complex flavors, syrupy body, and signature crema. It's technically demanding but incredibly rewarding.

**Time Required**: 25-30 seconds extraction time (plus prep)

**Equipment Needed**:
- Espresso machine (minimum 9 bars pressure)
- Espresso grinder (burr grinder, preferably with small adjustments)
- Tamper (58mm or 54mm depending on portafilter)
- Scale (0.1g precision)
- Timer
- Distribution tool (optional but helpful)
- Knock box for spent pucks

---

## ⚙️ Standard Recipe

### Basic Parameters

| Parameter | Value | Notes |
|-----------|-------|-------|
| Coffee Dose | 18g | For double shot, 58mm basket |
| Yield | 36g | Output weight in cup |
| Ratio | 1:2 | Traditional ristretto to normale range |
| Grind Size | Very fine | Like powdered sugar, espresso-specific |
| Water Temp | 200-203°F / 93-95°C | Depends on roast level |
| Pressure | 9 bars | Standard for most machines |
| Total Time | 25-30 seconds | From first drip to target weight |

### Alternative Ratios

- **Ristretto**: 1:1.5 (18g in, 27g out) - More concentrated, sweeter
- **Normale**: 1:2 (18g in, 36g out) - Balanced, traditional
- **Lungo**: 1:3 (18g in, 54g out) - Longer, more volume, less intense

---

## 📝 Step-by-Step Instructions

### Preparation

1. **Preheat everything** - Run blank shot through machine, warm cup
2. **Purge group head** - Flush water to stabilize temperature
3. **Check portafilter** - Dry and clean basket
4. **Weigh and grind** - 18g coffee, grind fresh into portafilter

### Coffee Distribution & Tamping

1. **Distribute grounds**
   - WDT (Weiss Distribution Technique): Use thin needle/tool to break clumps
   - Or tap sides gently and shake to level
   - Goal: Even, fluffy bed with no clumps

2. **Tamp firmly**
   - Place on flat surface
   - Apply 30lbs pressure (~14kg), straight down
   - Polish with slight twist
   - Ensure level tamp (no angles)
   - Wipe rim of basket clean

3. **Lock portafilter**
   - Insert into group head
   - Lock firmly in place
   - Place cup on scale, tare

### Extraction

1. **Start timer and extraction simultaneously**
   - Begin flow immediately after locking in
   - Watch for first drips (should appear within 3-10 seconds)

2. **0:00-0:10 - Initial flow**
   - Espresso should begin as dark drops
   - Then form thin, continuous stream(s)
   - Color: Dark brown to reddish-brown

3. **0:10-0:20 - Main extraction**
   - Stream becomes lighter, golden-brown
   - Should look like "mouse tail" consistency
   - Crema forms on surface

4. **0:20-0:30 - Final phase**
   - Watch scale, stop at target weight (36g)
   - Last few grams extract quickly
   - Color blonde/pale at end

### Finishing

1. **Stop at 36g output** (25-30 seconds)
2. **Remove cup immediately**
3. **Knock out puck** - Should be firm, dry on top
4. **Rinse group head** - Flush with water
5. **Serve immediately** - Espresso degrades quickly

---

## 🎯 Tips & Tricks

**For Better Extraction**:
- Dose consistency is critical - use scale every time
- Fresh coffee (7-21 days off roast) extracts best
- Grind immediately before brewing
- WDT distribution technique dramatically improves consistency
- Puck prep matters more than tamping pressure

**Common Mistakes to Avoid**:
- Uneven distribution - causes channeling
- Dosing by volume instead of weight - inconsistent results
- Old/stale coffee - flat, lifeless shots
- Wrong grind size - most common issue
- Not purging between shots - temperature instability
- Over-tamping (>30lbs) - can crack puck

**Adjustments for Different Beans**:
- **Light roasts**: Higher temp (202-204°F), potentially longer ratio (1:2.5)
- **Medium roasts**: Standard recipe works well
- **Dark roasts**: Lower temp (198-200°F), shorter ratio (1:1.5-1:2)
- **Single origins**: Often prefer 1:2.5-1:3 ratios for clarity
- **Blends**: Traditional 1:2 ratio usually optimal

---

## 🔧 Troubleshooting

| Problem | Possible Cause | Solution |
|---------|----------------|----------|
| Sour taste | Under-extraction, grind too coarse | Grind finer, increase temp, check for channeling |
| Bitter taste | Over-extraction, grind too fine | Grind coarser, lower temp, pull shorter ratio |
| Extraction too fast (<20s) | Grind too coarse, low dose | Grind finer, increase dose, check basket size |
| Extraction too slow (>35s) | Grind too fine, overdosing | Grind coarser, reduce dose, check for clumps |
| Weak/watery | Channeling, uneven distribution | WDT distribution, check tamp level, clean basket |
| Spraying/spurting | Channeling, puck damage | Improve distribution, careful tamping, clean shower screen |
| Little to no crema | Stale coffee, wrong pressure | Use fresh coffee (7-21 days), check machine pressure |
| Astringent | Over-extraction, too hot | Lower temp, grind coarser, pull shorter |
| Puck soupy/muddy | Over-extraction, too fine | Grind coarser, reduce ratio |
| Puck stuck to shower screen | Dosing too high, grind too fine | Reduce dose, grind slightly coarser |

---

## 🎓 Advanced Techniques

### Dialing In New Coffee

1. **Start conservative**: 18g in, 36g out, 25-30 seconds
2. **Taste and adjust**: Too sour → grind finer; Too bitter → grind coarser
3. **Make small changes**: 1-2 settings at a time on grinder
4. **Season the grinder**: Grind 5-10g to purge previous coffee
5. **Take notes**: Record settings that work

### Pressure Profiling (if machine supports)

- **Pre-infusion**: Low pressure (2-4 bars) for 5-10 seconds, then ramp to 9
- **Declining profile**: Start 9 bars, gradually reduce to 6 bars
- **Gentle profile**: 6-7 bars throughout for delicate light roasts

### Temperature Surfing (non-PID machines)

- Flush group → wait 30 seconds → pull shot (catches temp on downswing)
- Practice to find sweet spot on your specific machine

---

## 📊 My Results Using This Method

```dataview
TABLE 
  beans as "Beans",
  rating as "⭐ Rating",
  date as "Date",
  ratio as "Ratio",
  brew-time as "Time (sec)"
FROM "Coffee Logs"
WHERE brew-method = "espresso" OR brew-method = "Espresso"
SORT rating DESC
LIMIT 10
```

### Average Rating

```dataview
TABLE WITHOUT ID
  round(average(rows.rating), 2) as "Avg Rating",
  length(rows) as "Times Used"
FROM "Coffee Logs"
WHERE brew-method = "espresso" OR brew-method = "Espresso"
```

---

## 🔗 Resources

**Video Tutorials**:
- [James Hoffmann - Understanding Espresso](https://www.youtube.com/watch?v=d0g8umpINBU)
- [Lance Hedrick - Espresso Dialing In](https://www.youtube.com/watch?v=jfElZfrX31c)
- [Barista Hustle - Espresso Compass](https://www.youtube.com/watch?v=FmpkKO3omYs)

**Articles**:
- [Barista Hustle - Espresso Recipes](https://www.baristahustle.com)
- [Scott Rao - The Coffee Refractometer Book](https://www.scottrao.com)
- [Socratic Coffee - Espresso Fundamentals](https://socraticcoffee.com)

**Related Techniques**:
- [[Milk Steaming Guide]] - For cappuccinos and lattes
- [[Latte Art Guide]] - Pour patterns
- [[Grinder Calibration]] - Maintaining equipment

---

## 💭 Personal Notes & Modifications

**What I've Learned**:
- Distribution matters more than I thought - WDT is essential
- Fresh coffee (7-14 days) makes the biggest difference
- Small grind adjustments have huge impact
- Consistency comes from routine and ritual
- Every variable affects the shot

**My Preferred Variations**:
- Morning shots: 18g→36g, 28 seconds, 202°F - classic and reliable
- Milk drinks: 18g→40g, 25 seconds - more volume, cuts through milk
- Straight shots: 18g→32g, 32 seconds - concentrated, syrupy

**Next Experiments**:
- Try turbo shots (1:3 ratio in 15-20 seconds with coarse grind)
- Test different baskets (VST, IMS precision)
- Experiment with pre-infusion timing
- Compare blooming vs non-blooming beans
- Track extraction yield with refractometer

---

## 🧪 Equipment Notes

**Grinder Matters Most**:
- Espresso requires grinder that can make small, precise adjustments
- Stepless > stepped for espresso
- Single-dose grinders reduce retention

**Machine Considerations**:
- Temperature stability > raw power
- PID control highly recommended
- Pressure gauge or profiling adds control

**Accessories Worth Having**:
- Precision scale (0.1g)
- WDT tool (can DIY with needles and cork)
- Puck screen (reduces channeling)
- Dosing funnel (reduces mess)

