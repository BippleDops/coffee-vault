---
type: brewing-guide
brew-method: Pour Over V60
difficulty: intermediate
source: James Hoffmann Ultimate V60 Technique
date-created: 2025-10-24
tags: [brewing-guide, pour-over, v60]
---

# ☕ Pour Over V60 Brewing Guide

**Difficulty**: Intermediate  
**Source**: James Hoffmann Ultimate V60 Technique  
**Last Updated**: 2025-10-24

---

## 📋 Overview

**Best For**: Light to medium roasts, single origins with complex flavor profiles, clarity-focused brews

The V60 is one of the most popular pour-over methods, known for producing clean, bright cups that highlight the unique characteristics of each coffee. The cone shape and spiral ribs allow for excellent water flow and extraction control.

**Time Required**: 3-4 minutes

**Equipment Needed**:
- Hario V60 dripper (size 02 recommended)
- V60 paper filters
- Gooseneck kettle
- Scale with timer
- Carafe or mug
- Grinder

---

## ⚙️ Standard Recipe

### Basic Parameters

| Parameter | Value | Notes |
|-----------|-------|-------|
| Coffee Dose | 15g | Adjust proportionally for more/less |
| Water | 250g/ml | Final brew weight |
| Ratio | 1:16.6 | Classic ratio for balanced extraction |
| Grind Size | Medium-fine | Like sea salt or granulated sugar |
| Water Temp | 200°F / 93°C | Hotter for light roasts, cooler for dark |
| Total Time | 2:30-3:30 | Target 3 minutes total |

---

## 📝 Step-by-Step Instructions

### Preparation

1. **Rinse filter** - Place filter in V60, rinse with hot water to remove paper taste and preheat dripper
2. **Discard rinse water** - Remove water from carafe
3. **Add coffee** - Add 15g ground coffee to filter, create flat bed by gently shaking
4. **Tare scale** - Place setup on scale, tare to zero, start timer

### Brewing Process

1. **0:00 - Bloom** 
   - Pour 40-50g water (3x coffee weight) in spiral motion from center outward
   - Ensure all grounds are saturated
   - Gentle swirl to even out bed
   - Wait until 0:45

2. **0:45 - First Pour** 
   - Pour continuously in slow spiral to 150g total
   - Pour rate: ~7-10g/second
   - Keep water level consistent, don't let it drop to grounds

3. **1:15 - Second Pour**
   - Pour to 250g total (100g added)
   - Continue spiral pattern
   - Maintain steady flow

4. **1:45 - Drawdown**
   - All water should be added by now
   - Allow coffee to drain completely
   - Gentle swirl at end to flatten bed (optional)

### Finishing

1. **2:30-3:30 - Complete**
   - All water should drain through
   - Grounds should form flat bed in filter
   - Discard filter and grounds

2. **Swirl and Serve**
   - Swirl carafe to mix brew
   - Pour and enjoy

---

## 🎯 Tips & Tricks

**For Better Extraction**:
- Pour in the center for higher extraction, edges for lower
- Higher pours (6-8 inches) increase agitation and extraction
- Gentle pours close to surface reduce agitation
- Swirl after bloom creates flat bed for even extraction

**Common Mistakes to Avoid**:
- Pouring too aggressively - creates channels and uneven extraction
- Letting water level drop to grounds between pours - causes stalling
- Pouring on the sides/filter - water bypasses coffee
- Not rinsing filter - imparts papery taste

**Adjustments for Different Beans**:
- **Light roasts**: Hotter water (205°F), slightly finer grind, longer contact time
- **Medium roasts**: Standard recipe works perfectly
- **Dark roasts**: Cooler water (195°F), slightly coarser grind, faster drawdown

---

## 🔧 Troubleshooting

| Problem | Possible Cause | Solution |
|---------|----------------|----------|
| Too bitter | Over-extraction, grind too fine | Grind coarser, lower water temp, pour faster |
| Too sour | Under-extraction, grind too coarse | Grind finer, increase water temp, slower pours |
| Weak/watery | Grind too coarse, pour too fast | Grind finer, slow down pour rate |
| Too strong | Grind too fine, channeling | Grind coarser, pour more evenly |
| Slow drawdown (>4min) | Grind too fine, bed clogged | Grind coarser, don't over-agitate |
| Fast drawdown (<2:30) | Grind too coarse | Grind finer |
| Astringent | Water too hot, over-agitation | Lower temp to 195-200°F, pour gently |

---

## 📊 My Results Using This Method

```dataview
TABLE 
  beans as "Beans",
  rating as "⭐ Rating",
  date as "Date",
  grind-size as "Grind",
  brew-time as "Time (min)"
FROM "Coffee Logs"
WHERE brew-method = "pour-over" OR brew-method = "Pour Over"
SORT rating DESC
LIMIT 10
```

### Average Rating

```dataview
TABLE WITHOUT ID
  round(average(rows.rating), 2) as "Avg Rating",
  length(rows) as "Times Used"
FROM "Coffee Logs"
WHERE brew-method = "pour-over" OR brew-method = "Pour Over"
```

---

## 🔗 Resources

**Video Tutorials**:
- [James Hoffmann - Ultimate V60 Technique](https://www.youtube.com/watch?v=AI4ynXzkSQo)
- [Tetsu Kasuya 4:6 Method](https://www.youtube.com/watch?v=wmCW8xSWGZY)
- [Scott Rao V60 Method](https://www.youtube.com/watch?v=c0Qe_ASxfNM)

**Articles**:
- [Perfect Daily Grind - V60 Brewing Guide](https://perfectdailygrind.com)
- [Hario Official Brewing Guide](https://www.hario-usa.com)

**Related Techniques**:
- [[Chemex Guide]] - Similar pour-over, thicker filters
- [[Kalita Wave Guide]] - Flat-bottom pour-over
- [[Clever Dripper Guide]] - Immersion/pour-over hybrid

---

## 💭 Personal Notes & Modifications

**What I've Learned**:
- Bloom phase is crucial - proper saturation sets up the rest of the brew
- Grind size has the biggest impact on taste
- Water temperature matters more than I initially thought
- Consistency in pour rate produces more repeatable results

**My Preferred Variations**:
- For fruity Ethiopians: 205°F water, slightly finer grind, gentle pours
- For chocolatey Colombians: 200°F water, standard grind, normal technique
- Weekend slow-brew: 20g coffee, 330g water, take 4-5 minutes

**Next Experiments**:
- Try the 4:6 method (4 pours: 40% bloom/first, 60% subsequent)
- Experiment with pulse pouring vs continuous
- Test different filter brands (Cafec, Fellow)
- Try freezing beans before grinding

