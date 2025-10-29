---
type: scientific-reference
category: extraction-science
topic: tds-extraction
difficulty: intermediate
tags: [tds, extraction, measurement, refractometer, brewing-science]
related-topics: [brewing-control-chart, solubility, brew-ratio]
---

# TDS and Extraction Yield Relationships

**Understanding the Core Metrics of Coffee Brewing**

Total Dissolved Solids (TDS) and Extraction Yield are the two fundamental measurements in coffee brewing science. While TDS tells you the *strength* of your coffee, extraction yield tells you *how much* of the coffee was dissolved. Understanding their relationship is key to brewing optimization.

---

## 📊 Fundamental Definitions

### Total Dissolved Solids (TDS)

**Definition**: The percentage of dissolved coffee compounds in the final beverage.

$$\text{TDS (\%)} = \frac{\text{Mass of Dissolved Solids (g)}}{\text{Total Beverage Mass (g)}} \times 100$$

**What It Measures**:
- Brew strength/concentration
- How "strong" coffee tastes
- Direct sensory perception of intensity

**Typical Ranges**:
- **Filter Coffee**: 1.15% - 1.35%
- **French Press**: 1.20% - 1.45%
- **Espresso**: 8% - 12%
- **Cold Brew Concentrate**: 3% - 6%
- **Iced Coffee**: 0.8% - 1.2% (diluted with ice)

**Perceptual Thresholds**:
- Below 1.0%: Tastes thin, watery, weak
- 1.0-1.15%: Light but acceptable
- 1.15-1.35%: Optimal balance (SCA standard)
- 1.35-1.50%: Strong, intense
- Above 1.50%: Very strong, potentially overwhelming

### Extraction Yield

**Definition**: The percentage of the coffee's mass that dissolved into the water.

$$\text{Extraction Yield (\%)} = \frac{\text{TDS (\%)} \times \text{Beverage Mass (g)}}{\text{Coffee Dose (g)}} \times 100$$

**What It Measures**:
- How much coffee was extracted
- Brewing efficiency
- Balance of flavors (under/ideal/over)

**Typical Ranges**:
- **Under-extracted**: Below 18%
- **Ideal Range**: 18% - 22%
- **Over-extracted**: Above 22%

**Important Note**: Maximum possible extraction is approximately 28-30% of coffee's mass. Beyond this, only insoluble cellulose and carbon remain.

---

## 🔬 The Relationship Between TDS and Extraction

### Mathematical Connection

These two measurements are inherently linked through the brew ratio:

$$\text{Extraction Yield} = \frac{\text{TDS} \times \text{Beverage Weight}}{\text{Coffee Dose}}$$

Rearranged:

$$\text{TDS} = \frac{\text{Extraction Yield} \times \text{Coffee Dose}}{\text{Beverage Weight}}$$

**Key Insight**: For a given brew ratio, TDS and extraction are directly proportional.

### Independent Variables vs Dependent Variables

**Independent Variables** (what you control):
- Coffee dose
- Water volume
- Grind size
- Brew time
- Water temperature
- Turbulence/agitation

**Dependent Variables** (what you measure):
- TDS
- Extraction yield

**Critical Understanding**:
- You can have high extraction with low TDS (dilute but well-extracted)
- You can have low extraction with high TDS (concentrated but under-extracted)
- Ideal brewing achieves both targets simultaneously

---

## 📐 Working with Brew Ratios

### Standard Brew Ratio Formula

$$\text{Brew Ratio} = \frac{\text{Water Mass (g)}}{\text{Coffee Mass (g)}}$$

Expressed as **1:X** where X is the water-to-coffee ratio.

### How Ratio Affects TDS and Extraction

**Scenario 1: Changing Ratio (Constant Extraction)**

If extraction stays at 20% but you change the ratio:

| Ratio | Coffee (g) | Water (g) | Expected TDS |
|-------|------------|-----------|--------------|
| 1:12 | 20 | 240 | 1.67% |
| 1:15 | 20 | 300 | 1.33% |
| 1:17 | 20 | 340 | 1.18% |
| 1:20 | 20 | 400 | 1.00% |

**Observation**: Weaker ratio = lower TDS (assuming extraction constant)

**Scenario 2: Changing Grind (Constant Ratio)**

At 1:16 ratio (20g:320g) with different extraction levels:

| Grind | Extraction | TDS |
|-------|------------|-----|
| Very Fine | 24% | 1.50% |
| Fine | 21% | 1.31% |
| Medium | 19% | 1.19% |
| Coarse | 16% | 1.00% |

**Observation**: Finer grind = higher extraction = higher TDS (ratio constant)

---

## 🧮 Practical Calculation Examples

### Example 1: Standard Pour Over

**Setup**:
- Coffee dose: 20g
- Water added: 320g
- Beverage collected: 300g (20g absorbed by grounds)
- Measured TDS: 1.25%

**Calculate Extraction**:

$$\text{Extraction} = \frac{1.25 \times 300}{20} \times 100 = 18.75\%$$

**Interpretation**: Slightly under-extracted. Target 19-21% for this ratio.

**Adjustment**: Grind slightly finer or increase brew time 15-30 seconds.

### Example 2: Espresso

**Setup**:
- Coffee dose: 18g
- Liquid espresso: 36g
- Measured TDS: 10.5%

**Calculate Extraction**:

$$\text{Extraction} = \frac{10.5 \times 36}{18} \times 100 = 21.0\%$$

**Interpretation**: Perfectly extracted espresso at 1:2 ratio.

### Example 3: French Press

**Setup**:
- Coffee dose: 30g
- Water: 400g
- Final beverage: 390g (10g absorbed)
- Measured TDS: 1.42%

**Calculate Extraction**:

$$\text{Extraction} = \frac{1.42 \times 390}{30} \times 100 = 18.46\%$$

**Interpretation**: Under-extracted but strong. Common with French press.

**Adjustment**: Increase brew time from 4 to 5 minutes, or grind slightly finer.

### Example 4: Reverse Calculation (No Refractometer)

**Goal**: Achieve 20% extraction at 1:16 ratio

**Setup**:
- Coffee: 25g
- Water: 400g
- Beverage: ~380g (assuming 20g absorption)
- Target extraction: 20%

**Calculate Required TDS**:

$$\text{TDS} = \frac{20 \times 25}{380} \times 100 = 1.32\%$$

**Interpretation**: Without refractometer, aim for 1:16 ratio and dial in by taste.

---

## 📊 Absorption and Beverage Weight

### Coffee Absorption Rates

**Dry Coffee Absorbs Water**:
- **Coarse grind**: ~1.5-2.0x its weight
- **Medium grind**: ~1.8-2.2x its weight
- **Fine grind**: ~2.0-2.5x its weight

**Typical Absorption**: Approximately 2g water per 1g coffee

**Example**:
- 20g coffee + 320g water
- ~40g water absorbed by grounds
- Final beverage: ~280g

**Why It Matters**: Beverage weight (not water added) is used in extraction calculation.

### Measuring Beverage Weight

**Method 1: Direct Measurement** (Most Accurate)
1. Tare scale with empty server
2. Brew coffee
3. Record final beverage weight
4. Accounts for actual absorption and evaporation

**Method 2: Estimation**
- Assume 2x absorption ratio
- Example: 20g coffee absorbs ~40g water
- 320g water - 40g absorbed = 280g beverage

**Method 3: Refractometer Apps**
- Many apps calculate based on input water and dose
- Use typical absorption factors
- VST Coffee Tools, MoJoToGo, etc.

---

## 🎯 Target Zones by Brew Method

### Filter Methods (Pour Over, Batch Brew)

**Target TDS**: 1.15% - 1.35%
**Target Extraction**: 18% - 22%
**Optimal Ratio**: 1:15 to 1:17

**Relationship**:
- At 1:16 ratio with 20% extraction → TDS = 1.25%
- Dialing in: Adjust grind for extraction, dose for strength

### Immersion Methods (French Press, Clever)

**Target TDS**: 1.20% - 1.45%
**Target Extraction**: 18% - 22%
**Optimal Ratio**: 1:12 to 1:15

**Characteristics**:
- Often stronger (higher TDS) than pour over
- Similar extraction targets
- Full immersion extracts differently

### Espresso

**Target TDS**: 8% - 12%
**Target Extraction**: 18% - 22%
**Optimal Ratio**: 1:1.5 to 1:3

**Unique Considerations**:
- Very high TDS due to low water volume
- Same extraction target as filter
- Grind and pressure are primary variables

### Cold Brew

**Concentrate**:
- **Target TDS**: 3% - 6%
- **Target Extraction**: 20% - 25%
- **Ratio**: 1:4 to 1:8

**Ready-to-Drink**:
- **Target TDS**: 1.0% - 1.3%
- **Achieved by dilution** of concentrate
- Higher extraction acceptable due to cold extraction

---

## 🔬 Factors Affecting TDS and Extraction

### Grind Size

**Effect on Extraction**:
- **Finer grind** → More surface area → Higher extraction
- **Coarser grind** → Less surface area → Lower extraction

**Effect on TDS** (at constant ratio):
- Finer → Higher extraction → Higher TDS
- Coarser → Lower extraction → Lower TDS

**Mechanism**: Particle size determines rate of diffusion and total accessible surface area.

### Brew Time

**Effect on Extraction**:
- **Longer time** → More extraction (up to a limit)
- **Shorter time** → Less extraction

**Extraction Curve**:
- First 30 seconds: Rapid extraction (acids, aromatics)
- 30s - 2 minutes: Moderate extraction (sugars, balance)
- 2+ minutes: Slow extraction (bitter compounds)
- Diminishing returns after ~4-5 minutes

**Effect on TDS**:
- Longer time → Higher extraction → Higher TDS (if ratio constant)

### Water Temperature

**Effect on Extraction**:
- **Higher temp (200-205°F / 93-96°C)** → Faster, more complete extraction
- **Lower temp (185-195°F / 85-91°C)** → Slower, less extraction

**Solubility Relationship**:
- Many coffee compounds more soluble at higher temperatures
- Chlorogenic acids, caffeine, lipids more extractable when hot
- Sweet spot: 195-205°F (91-96°C) for most brewing

**Effect on TDS**:
- Higher temp → Higher extraction → Higher TDS (if ratio constant)

### Coffee Dose

**Effect on TDS** (primary effect):
- **More coffee** → Higher TDS (at constant water volume)
- **Less coffee** → Lower TDS

**Effect on Extraction** (secondary):
- More coffee → Slightly lower extraction (less water per gram)
- Less coffee → Slightly higher extraction (more water per gram)

**Example** (320g water constant):
- 20g coffee (1:16) → 20% extraction → 1.25% TDS
- 25g coffee (1:12.8) → 19% extraction → 1.48% TDS

### Water Volume/Ratio

**Effect on TDS** (primary effect):
- **More water** → Lower TDS (dilution)
- **Less water** → Higher TDS (concentration)

**Effect on Extraction** (secondary):
- More water → Slightly higher extraction potential
- Less water → Slightly lower extraction (saturation)

### Turbulence and Agitation

**Effect on Extraction**:
- **More agitation** → Faster, more even extraction
- **Less agitation** → Slower extraction, potential channeling

**Mechanisms**:
- Breaks up CO2 bubbles (bloom)
- Disrupts saturation boundary layer
- Promotes even contact between water and coffee
- Prevents channeling

**Effect on TDS**:
- More turbulence → Better extraction → Higher TDS
- Critical for even extraction

---

## 🧪 Measuring TDS Accurately

### Refractometer Types

**Optical Refractometers**:
- Measure refractive index of light through liquid
- Convert to TDS via calibration
- Examples: VST LAB Coffee III, Atago PAL-COFFEE

**Digital Refractometers**:
- Electronic sensors measure refraction
- Direct digital readout
- Examples: DiFluid R2 Extract, Hanna Instruments

**Comparison**:
- Optical: More expensive, very accurate, industry standard
- Digital: More affordable, good accuracy, portable

### Measurement Technique

**Step-by-Step**:
1. **Brew coffee** following method
2. **Stir thoroughly** to ensure even concentration
3. **Cool to room temperature** (or use temp compensation)
4. **Clean refractometer sensor** with distilled water
5. **Calibrate** to zero with distilled water
6. **Place 1-2 drops** of coffee on sensor
7. **Read TDS** value
8. **Clean sensor** immediately after
9. **Record** TDS, dose, beverage weight

**Common Errors**:
- Sample too hot (incorrect reading)
- Insufficient stirring (uneven concentration)
- Dirty sensor (contaminated reading)
- Incorrect beverage weight measurement
- Not calibrating before use

### Temperature Compensation

**Why It Matters**: Refractive index changes with temperature

**Solutions**:
- Wait for room temperature (~20°C / 68°F)
- Use refractometer with automatic temperature compensation (ATC)
- Apply temperature correction formula

**VST Standard**: Samples should be 20°C ± 2°C

---

## 📈 Using TDS to Dial In Coffee

### Systematic Dialing Process

**Step 1: Establish Baseline**
- Choose brew method
- Select standard ratio (e.g., 1:16 for pour over)
- Use medium grind as starting point
- Brew and measure TDS

**Step 2: Calculate Extraction**
- Measure beverage weight
- Calculate extraction yield
- Plot on brewing control chart

**Step 3: Adjust Based on Position**

**If Under-Extracted (< 18%)**:
- Grind finer
- Increase brew time
- Raise water temperature
- Increase turbulence

**If Over-Extracted (> 22%)**:
- Grind coarser
- Decrease brew time
- Lower water temperature
- Reduce turbulence

**If Weak (TDS < 1.15%)**:
- Increase coffee dose
- Decrease water volume

**If Strong (TDS > 1.35%)**:
- Decrease coffee dose
- Increase water volume

**Step 4: Iterate**
- Change ONE variable at a time
- Measure after each change
- Track results in log

**Step 5: Validate by Taste**
- Sensory evaluation confirms measurements
- Personal preference may vary from targets
- Use measurements as guide, taste as judge

---

## 🌍 Real-World Applications

### Coffee Shop Quality Control

**Daily Calibration**:
- Measure first batch of the day
- Target: 1.20-1.30% TDS, 19-21% extraction
- Adjust grind if out of range
- Document in QC log

**Consistency Across Baristas**:
- Same dose, ratio, grind setting
- TDS measurement confirms consistency
- Reduces variation in customer experience

### Home Brewing Optimization

**Finding Your Preference**:
1. Start with SCA standards (18-22%, 1.15-1.35%)
2. Brew multiple cups with slight variations
3. Measure TDS of each
4. Taste and rate each brew
5. Identify your preferred TDS and extraction range
6. Recreate consistently

**Recipe Development**:
- Document TDS and extraction for favorite brews
- Replicate across different beans
- Adjust for roast level (light vs dark)

### Competitor Preparation

**Target Precision**:
- Competition coffees often target 20-21% extraction
- TDS may vary based on presentation format
- Multiple iterations to nail exact profile
- Measurement removes guesswork

---

## 🔗 Related Concepts

### Scientific References
- [[Coffee Brewing Control Chart]]
- [[Grind Size and Extraction Kinetics]]
- [[Water Temperature and Solubility]]
- [[Particle Size Distribution Effects]]
- [[Water Chemistry and Extraction]]

### Practical Guides
- [[How to Use a Refractometer]]
- [[Dialing In Espresso]]
- [[Pour Over Optimization]]
- [[Troubleshooting Extraction Issues]]

### Sensory Science
- [[Taste Perception and Extraction]]
- [[Sensory Attributes by Extraction Level]]
- [[Cupping Score vs Extraction Yield]]

---

## 📚 Further Reading

### Research Papers
- Melrose, J., et al. (2020). "Systematically Improving Espresso" - Matter Journal
- Batali, M., et al. (2020). "Exploring espresso extraction kinetics"
- Spiess, E. (2019). "The effect of grind size on coffee extraction"

### Books
- *The Coffee Roaster's Companion* - Scott Rao (Chapter on Extraction)
- *The Physics of Filter Coffee* - Jonathan Gagné
- *Everything But Espresso* - Scott Rao

### Online Resources
- Barista Hustle: "Extraction and TDS"
- SCA Brewing Standards
- VST Coffee Tools Documentation
- Coffee Ad Astra Blog (Jonathan Gagné)

---

## 💡 Key Takeaways

1. **TDS measures strength**, extraction measures efficiency - both matter

2. **They're mathematically linked** through brew ratio but are independent sensory attributes

3. **You can change one without the other**: Grind affects extraction, dose affects TDS

4. **Target 18-22% extraction** regardless of TDS preference

5. **TDS 1.15-1.35% is standard** for filter, but 8-12% for espresso

6. **Refractometer removes guesswork** - measure rather than guess

7. **Dial systematically**: One variable at a time, measure, iterate

8. **Taste is the final judge** - measurements guide you to optimal range

---

**Last Updated**: 2025-10-25
**See Also**: [[Coffee Brewing Control Chart]], [[Grind Size and Extraction Kinetics]], [[Particle Size Distribution Effects]]
