---
type: scientific-reference
category: Grinding
difficulty: Intermediate
priority: high
related-entities: [equipment-model, coffee-log, recipe-profile]
tags: [grinding, particle-size, distribution, measurement, sieving, fines, boulders]
created: 2025-11-06
version: 6.0.0
---

# Particle Size Distribution: Measurement and Optimization

## Overview

Particle size distribution (PSD)—the range of particle sizes produced by a grinder—is one of the most critical yet often overlooked factors in coffee extraction. While most brewers focus on average grind size, the distribution of particles from fine "fines" (<100 μm) to large "boulders" (>800 μm) dramatically affects extraction uniformity, flow rate, and flavor.

High-quality grinders produce narrow, unimodal distributions (most particles clustered around a target size), while lower-quality grinders produce wide, bimodal distributions (peaks at both fine and coarse extremes). Understanding and measuring PSD enables grinder selection, burr alignment assessment, and troubleshooting extraction problems.

This guide provides practical methods for measuring particle distribution using sieves, understanding distribution curves, and optimizing grind quality for better coffee.

## Key Concepts

### What Is Particle Size Distribution?

**Definition**: The statistical spread of particle sizes in a ground coffee sample.

**Key metrics**:
- **D50 (median)**: 50% of particles smaller, 50% larger
- **D10**: 10% of particles are smaller (fine end)
- **D90**: 90% of particles are smaller (coarse end)
- **Span**: (D90 - D10) / D50 (measure of width)

**Distribution quality**:
- **Narrow distribution**: Span < 1.5 (high-end grinders)
- **Moderate distribution**: Span 1.5-2.5 (mid-range grinders)
- **Wide distribution**: Span > 2.5 (blade grinders, low-quality burrs)

### Fines vs. Boulders

**Fines** (<100 μm for pour-over, <20 μm for espresso):
- **Extraction**: Over-extract quickly (high surface area)
- **Flow**: Clog filters, slow flow rate
- **Flavor**: Bitterness, astringency, muddiness
- **Ideal percentage**: <15% of total mass

**Boulders** (>800 μm for pour-over, >60 μm for espresso):
- **Extraction**: Under-extract (low surface area)
- **Flow**: Minimal impact (large voids)
- **Flavor**: Sourness, lack of sweetness
- **Ideal percentage**: <10% of total mass

**Sweet spot** (200-600 μm for pour-over, 20-40 μm for espresso):
- **Extraction**: Balanced, uniform
- **Optimal**: 75-85% of grind mass in this range

### Unimodal vs. Bimodal Distributions

**Unimodal distribution** (single peak):
- **Characteristic**: Most particles near target size
- **Grinders**: High-quality flat burrs (SSP, EG-1)
- **Extraction**: Uniform, consistent
- **Result**: Clean, balanced flavor

**Bimodal distribution** (two peaks):
- **Characteristic**: Peaks at fine and coarse extremes
- **Grinders**: Conical burrs (some), worn burrs
- **Extraction**: Uneven (fines over-extract, boulders under-extract)
- **Result**: Muddy body, simultaneous sour and bitter

**Why distribution matters**:
Even if two grinders have the same D50 (median), different distributions produce different extraction results. A narrow distribution extracts more uniformly than a wide distribution.

## The Science

### Sieving Theory

**How sieving works**:
1. **Stack sieves**: Largest mesh on top, smallest on bottom
2. **Add coffee**: Ground sample (20-30g)
3. **Agitate**: Shake for 5-10 minutes (mechanical or manual)
4. **Weigh fractions**: Measure retained coffee in each sieve
5. **Calculate percentages**: Weight retained / total weight × 100

**Common sieve sizes** (ASTM standard):
- **1000 μm** (very coarse, French Press)
- **850 μm** (coarse/medium boundary)
- **600 μm** (medium, pour-over)
- **425 μm** (medium/fine boundary)
- **250 μm** (fine, Aeropress)
- **150 μm** (very fine, espresso)
- **75 μm** (ultra-fine, Turkish)

**Practical sieve set** (4-5 sieves):
- **For pour-over**: 850, 600, 425, 250, 150 μm
- **For espresso**: 250, 150, 75, 53, pan (catch-all)

### Calculating Distribution Metrics

**From sieve data**:

Example sieve results (30g sample):
- \>850 μm (Boulders): 2.1g (7%)
- 600-850 μm: 8.4g (28%)
- 425-600 μm: 12.3g (41%)
- 250-425 μm: 5.4g (18%)
- <250 μm (Fines): 1.8g (6%)

**Cumulative distribution**:
- D10 ≈ 350 μm (interpolate from data)
- D50 ≈ 550 μm (median)
- D90 ≈ 800 μm
- **Span** = (800 - 350) / 550 = 0.82 (narrow, excellent)

**Interpretation**:
This grinder produces excellent distribution: narrow span, low fines (<10%), minimal boulders (<10%), most particles in sweet spot (41+18+28 = 87%).

### Grinder Quality and Distribution

**High-end flat burrs** (Monolith, Weber EG-1, DF64 w/ SSP):
- **D50**: 400-600 μm (pour-over)
- **Span**: 0.6-1.2 (very narrow)
- **Fines**: 3-8%
- **Boulders**: 2-5%
- **Character**: Unimodal, tight

**Mid-range conical** (Baratza Vario, Niche Zero):
- **D50**: 400-600 μm
- **Span**: 1.2-1.8 (moderate)
- **Fines**: 8-15%
- **Boulders**: 5-10%
- **Character**: Slightly bimodal

**Budget blade** (spice grinder):
- **D50**: Highly variable
- **Span**: 3.0-5.0 (very wide)
- **Fines**: 20-30%
- **Boulders**: 15-25%
- **Character**: Random, chaotic

**Impact on extraction**:
- High-end: Consistent 19-22% EY, clean cup
- Mid-range: 18-21% EY, some muddiness
- Blade: 15-18% EY, very muddy, uneven

## Practical Applications

### For Home Brewers

**DIY sieve testing** (without equipment):

**The 500 μm test** (pour-over grind):
1. **Grind 20g** coffee at normal setting
2. **Use tea strainer** or **fine-mesh sieve** (~500 μm)
3. **Shake 2-3 minutes** over bowl
4. **Weigh what passes through** (should be 30-50% for pour-over)
5. **Evaluate**:
   - <20% passes: Too coarse
   - 30-50% passes: Good range
   - >60% passes: Too fine or too many fines

**Visual assessment**:
- **Uniform**: Particles similar size, consistent color
- **Poor**: Wide range of sizes, dusty fines visible

**Taste indicators of poor distribution**:

**Excessive fines**:
- Bitter, astringent
- Muddy, heavy body
- Slow flow (pour-over), high pressure (espresso)
- **Fix**: Sieve out fines (<250 μm) before brewing

**Excessive boulders**:
- Sour, weak
- Thin body
- Fast flow
- **Fix**: Re-grind coarse fractions, or accept loss

**Balanced distribution**:
- Sweet, clear
- Balanced body
- Moderate flow
- **Goal**: Upgrade grinder if current produces poor distribution

### For Professionals

**Comprehensive sieving protocol**:

**Equipment needed**:
- **Sieve set**: ASTM standard, 4-6 sieves
- **Mechanical shaker**: RX-29 (industry standard) or DIY
- **Precision scale**: 0.01g resolution
- **Spreadsheet**: For data tracking

**Testing procedure**:
1. **Grind 30g** sample at target setting
2. **Stack sieves** (largest to smallest)
3. **Add coffee** to top sieve
4. **Shake 5-10 minutes** (mechanical) or 10-15 minutes (manual)
5. **Weigh fractions** (record to 0.01g)
6. **Calculate percentages**
7. **Plot distribution** (histogram or cumulative curve)

**Frequency**:
- **New grinder**: Baseline test
- **After burr alignment**: Verify improvement
- **Every 100-200 lbs ground**: Monitor burr wear
- **Troubleshooting**: When extraction inconsistent

**Comparing grinders**:

Test multiple grinders at same D50 (median):
- Measure full distribution
- Calculate span, fines%, boulders%
- Brew identical coffee with each
- Taste blind, correlate to PSD data

**Insight**: Grinder with narrowest distribution (lowest span) produces cleanest, most consistent cup—even at same median size.

### Optimizing Distribution

**Burr alignment**:
- Misaligned burrs produce wider distribution
- Proper alignment narrows distribution by 20-40%
- Test before/after alignment (sieve analysis)

**RPM adjustment** (if available):
- **Slower grinding**: Narrower distribution (less burr chatter)
- **Faster grinding**: Wider distribution (more fines from heat, vibration)
- Optimal: 400-600 RPM for most grinders

**Retention management**:
- **Seasoning grinder**: Grind 50-100g to stabilize
- **Single dosing**: Prevents aged coffee contamination
- **Consistent dose**: Same dose size maintains distribution

**Sieving fines out**:
- **Kruve sifter**: Remove <200 μm fines for pour-over
- **Effect**: Cleaner cup, faster flow, reduced astringency
- **Trade-off**: Lose 5-10% of coffee mass
- **When**: Very fresh coffee (high fines from brittleness)

## Measurement & Testing

### Building a Distribution Database

**Track grinder performance**:

Create log with:
- Date, coffee roasted date
- Grind setting
- Sieve fractions (%)
- D50, Span
- Brew method, EY, taste notes

**What to discover**:
- Optimal grind setting for your grinder
- How distribution changes with roast age
- When burrs need replacement (widening distribution)
- Consistency of grinder (same setting, same distribution)

### Comparing Roast Levels

**Experiment**: Test same grinder, three roast levels:
1. **Light roast** (denser, more brittle)
2. **Medium roast**
3. **Dark roast** (more porous, less brittle)

**Hypothesis**: Light roasts produce more fines (brittleness causes fracturing).

**Method**:
- Grind 30g each at same setting
- Sieve each sample
- Compare fines percentage

**Expected result**:
- Light: 12-18% fines
- Medium: 8-12% fines
- Dark: 5-10% fines

**Implication**: Light roasts may benefit from coarser grind to compensate for increased fines production.

## Common Misconceptions

### "All grinders at the same setting produce the same grind"

**Reality**: Grind setting numbers are arbitrary. "5" on one grinder ≠ "5" on another. Particle size distribution varies enormously between grinders even at nominally similar settings.

### "Fines are always bad"

**Reality**: Some fines (5-10%) contribute positively to extraction, providing body and mouthfeel. Excessive fines (>20%) cause problems. Zero fines would produce thin, weak coffee.

### "Conical burrs are inferior to flat burrs"

**Reality**: High-quality conical burrs (Monolith, Weber, Kafatek) produce excellent distributions. Low-quality flat burrs can be worse than good conicals. Burr quality matters more than geometry.

### "You need expensive equipment to measure PSD"

**Reality**: Basic sieves ($30-100) provide actionable data. Professional laser diffraction analysis ($10,000+ equipment) offers precision but isn't necessary for most users.

### "Once set, grinders maintain the same distribution"

**Reality**: Burr wear, misalignment, and retention contamination change distribution over time. Regular testing (every 3-6 months or 100-200 lbs) reveals changes.

## Related Concepts

- [[Grind-Size-and-Extraction-Kinetics]] - How particle size affects extraction
- [[Grinder-Thermal-Dynamics]] - Heat effects on particles
- [[Burr-Alignment-and-Maintenance]] - Optimizing distribution through alignment
- [[Static-Electricity-in-Grinding]] - Static causes clumping, affects distribution perception
- [[Espresso-Channeling-Prevention]] - Distribution's role in channeling
- [[Percolation-Flow-Dynamics]] - How PSD affects flow

## Further Reading

- Uman, E. et al. (2016). "The Effect of Bean Origin and Temperature on Grinding Roasted Coffee" - *Scientific Reports*
- Smrke, S. et al. (2018). "Differentiation of Degrees of Ripeness Using GC × GC-TOFMS" - *Food Research International*
- Kruve Inc. "Coffee Sifter Research Reports" - White papers on distribution effects
- Barista Hustle "Grind Size Distribution" - Practical grinding science

## Dataview Queries

### Grinder Performance Logs
```dataview
TABLE grinder, grind-setting, fines-percentage, boulders-percentage, rating
FROM "Coffee Logs"
WHERE fines-percentage != null
SORT date DESC
LIMIT 15
```

### Distribution Experiments
```dataview
TABLE date, grinder, span, d50 as "D50 (μm)", extraction-yield as "EY%"
FROM "Coffee Logs"
WHERE span != null
SORT rating DESC
```

## Summary

- **Distribution matters more than median**: Two grinders with same average grind size but different distributions produce dramatically different extraction results
- **Fines and boulders create problems**: Target <15% fines, <10% boulders for optimal extraction; excessive fines cause bitterness/astringency, boulders cause sourness
- **Narrow distribution is quality indicator**: Span <1.5 indicates high-quality grinder; unimodal distributions extract more uniformly than bimodal
- **Sieving enables measurement**: Simple 4-5 sieve stack ($50-150) provides actionable data about grinder performance and distribution quality
- **Burr alignment affects distribution**: Proper alignment narrows distribution by 20-40%, dramatically improving extraction consistency
- **Light roasts produce more fines**: Dense, brittle light roasts fracture more during grinding, producing 20-40% more fines than dark roasts at same setting
- **Distribution tracking reveals burr wear**: Widening span over time (200-500 lbs ground) indicates burr degradation requiring replacement or alignment

---

**Last Updated**: 2025-11-06
**Status**: Active
**Priority**: High
**Word Count**: ~1,490 words
