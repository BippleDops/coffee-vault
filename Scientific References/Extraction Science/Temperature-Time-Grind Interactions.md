---
type: scientific-reference
category: extraction-science
topic: brewing-variables
difficulty: intermediate
tags: [temperature, time, grind, extraction, brewing-optimization]
related-topics: [extraction-kinetics, brewing-control-chart, optimization]
---

# Temperature-Time-Grind Interactions

**The Three Primary Variables of Coffee Extraction**

Temperature, time, and grind size are the three fundamental variables that control coffee extraction. While each can be understood individually, their interactions create the complexity (and art) of coffee brewing. Mastering these relationships enables precise control over extraction and flavor.

---

## 🔺 The Extraction Triangle

### Three Interconnected Variables

**Grind Size** → Surface area → Extraction rate
**Temperature** → Solubility → Extraction speed
**Time** → Contact duration → Total extraction

**Core Principle**: For any target extraction (e.g., 20%), multiple combinations of these variables can achieve the same yield but different flavors.

### Fixed vs Adjustable Variables

**Fixed by Method**:
- **Espresso**: Time mostly fixed (~25-30s), adjust grind and temp
- **French Press**: Time mostly fixed (~4min), adjust grind and temp
- **Pour Over**: Time varies with grind, adjust grind primarily

**Freely Adjustable**:
- **Aeropress**: All three variables highly flexible
- **Batch Brewer**: Can adjust all within limits
- **Cold Brew**: Time and grind main variables (temp fixed)

---

## 🌡️ Temperature Effects

### Solubility and Extraction Rate

**Temperature increases both**:
- Solubility of coffee compounds
- Diffusion rate through coffee matrix
- Reaction kinetics

**Arrhenius Equation** (simplified):

$$k = A \cdot e^{-E_a/RT}$$

Rate doubles approximately every 10°C increase.

**Practical Temperature Ranges**:
- **Cold Brew**: 4-25°C (room temp or refrigerated)
- **Low Temp Brewing**: 85-90°C (185-194°F)
- **Standard**: 91-96°C (195-205°F)
- **High Temp**: 96-100°C (205-212°F)

**Flavor Impact by Temperature**:
- **< 85°C**: Under-extracts, sour, thin, grassy
- **85-90°C**: Highlights sweetness, reduces bitterness
- **91-96°C**: Balanced, SCA standard
- **96-100°C**: High extraction, can be bitter/harsh
- **100°C (boiling)**: Over-extraction risk, harsh

### Temperature Stability

**Temperature Loss**:
- Water loses ~5-10°C from kettle to coffee bed
- Brewing vessel preheating critical
- Ambient temperature affects loss
- Smaller brews lose more heat proportionally

**Professional Solutions**:
- Thermal carafes
- Preheating vessels
- Insulated brewers
- Temperature-stable kettles

---

## ⏱️ Time Effects

### Contact Time vs Extraction

**Linear Relationship** (early phase):
- First 30s: Rapid extraction (8-12%)
- 30s-2min: Moderate rate (12-18%)
- 2-4min: Slower rate (18-22%)
- 4min+: Diminishing returns (22-28% max)

**Extraction Curve**:

$$E(t) = E_{max}(1 - e^{-kt})$$

Asymptotic approach to maximum (~28-30%).

### Method-Specific Time Ranges

**Espresso**: 20-35 seconds
- Very short, relies on pressure
- Grind and pressure compensate for short time

**Pour Over**: 2:30-4:00 minutes
- Moderate time, gravity-driven
- Grind controls flow rate (and thus time)

**French Press**: 4-5 minutes
- Fixed immersion time
- Plunge doesn't stop extraction immediately

**Aeropress**: 1-3 minutes
- Highly variable technique-dependent
- Shorter = finer grind, longer = coarser grind

**Cold Brew**: 12-24 hours
- Extremely long time compensates for low temp
- Coarse grind prevents over-extraction

---

## ⚙️ Grind Size Effects

### Surface Area Control

**Finer Grind**:
- More surface area per gram
- Faster extraction rate
- Reaches target extraction sooner
- Higher resistance to flow (longer contact time in percolation)

**Coarser Grind**:
- Less surface area per gram
- Slower extraction rate
- Needs longer time for target extraction
- Lower resistance to flow (shorter contact time in percolation)

**The Paradox**: In pour over, finer grind both extracts faster (surface area) AND increases brew time (flow resistance) - double extraction boost.

---

## 🔄 Two-Variable Interactions

### Grind × Time

**Inverse Relationship for Fixed Extraction**:

| Grind | Time Needed (for 20% extraction) |
|-------|----------------------------------|
| Fine (400μm) | 2 minutes |
| Medium (700μm) | 4 minutes |
| Coarse (1000μm) | 7 minutes |

**Example - Pour Over**:
- Grind finer → Slower flow → Longer time → More extraction (double effect)
- Must compensate: Finer grind needs shorter intended time or over-extracts

**Example - Immersion**:
- Grind finer → 3min immersion → Higher extraction
- Grind coarser → 3min immersion → Lower extraction
- Time is independent variable

### Temperature × Time

**Compensatory Relationship**:

| Temperature | Time Needed (for 20% extraction, medium grind) |
|-------------|------------------------------------------------|
| 85°C | 5 minutes |
| 91°C | 3.5 minutes |
| 96°C | 2.5 minutes |

**Practical Application**:
- Cooler water → Brew longer
- Hotter water → Brew shorter
- Aeropress: 85°C for 2min OR 95°C for 1min

### Temperature × Grind

**Compensatory Relationship**:

| Temperature | Grind Needed (for 20% extraction, 3min brew) |
|-------------|----------------------------------------------|
| 85°C | Fine (450μm) |
| 91°C | Medium (600μm) |
| 96°C | Coarse (750μm) |

**Practical Application**:
- Lower temp → Grind finer to compensate
- Higher temp → Grind coarser to avoid over-extraction

---

## 🎯 Three-Way Optimization

### The Optimization Space

**3D Space**: Every brew exists at coordinates (Temperature, Time, Grind)

**Iso-Extraction Surfaces**: Multiple combinations achieve same extraction:
- (96°C, 2min, 700μm) = 20% extraction
- (91°C, 3min, 600μm) = 20% extraction
- (85°C, 4min, 500μm) = 20% extraction

**But flavors differ!**

### Flavor Profiles by Parameter Emphasis

**High Temp, Short Time, Coarse Grind**:
- Bright, clean, high clarity
- Less body, lighter mouthfeel
- Emphasizes acidity
- Example: Light roast pour over at 96°C, 2:30min

**Low Temp, Long Time, Fine Grind**:
- Fuller body, heavier mouthfeel
- More sweetness, less acidity
- Darker flavor notes
- Example: Aeropress at 85°C, 2:30min, fine grind

**Medium Everything**:
- Balanced profile
- SCA Golden Cup approach
- Safe, consistent
- Example: Batch brewer, 93°C, 3:30min, medium grind

---

## 🧪 Practical Optimization Strategies

### Method 1: Fix Two, Vary One

**Starting Point**:
1. Choose standard temp (93°C) and time (3min)
2. Vary grind until target extraction (20%)
3. Taste and adjust

**Then Optimize**:
- Too bitter → Lower temp OR shorten time
- Too sour → Raise temp OR lengthen time
- Keep grind that achieved 20%

### Method 2: Recipe Ratios

**Define Relationship**:
- For espresso: Temp ↑ 3°C = Grind ↑ 50μm (coarser)
- For pour over: Time ↑ 30s = Grind ↓ 50μm (finer)

**Example Workflow**:
1. Start: 93°C, medium grind
2. Drawdown too slow (4min) → Too fine
3. Grind coarser by 100μm
4. Drawdown now 2:30 → Too fast
5. Split difference: 50μm coarser than start
6. Result: 3min drawdown, balanced extraction

### Method 3: Deliberate Imbalance

**Technique**: Intentionally skew one variable for specific effect

**Cold Brew**:
- Extreme time (18hr) + extreme coarse + low temp
- Result: Smooth, low-acid, sweet

**Turbo Espresso**:
- Very short time (15s) + very coarse + high temp
- Result: Bright, clean, less bitter

**Immersion Hybrid** (James Hoffmann Method):
- Long bloom (4min) + single pour + medium-fine
- Result: High extraction (22%+), balanced, complex

---

## 📊 Real-World Examples

### Example 1: Dialing In Pour Over

**Starting Recipe**:
- 20g coffee, 320g water (1:16)
- 93°C water temperature
- Medium grind (Baratza Encore setting 15)
- Result: 4:30 drawdown, tastes sour

**Analysis**: Under-extracted (too fast flow OR temp too low)

**Adjustment 1** - Grind finer to slow flow:
- Grind to setting 12 (finer)
- Result: 3:00 drawdown, tastes balanced but slightly weak

**Refinement** - Increase dose slightly:
- 22g coffee, same grind
- Result: 3:15 drawdown, tastes excellent

**Final Recipe**: 22g, 320g water, 93°C, setting 12, ~3:15 drawdown

### Example 2: Espresso Adjustment for Light Roast

**Starting Recipe**:
- 18g in, 36g out (1:2)
- 93°C temperature
- 28 seconds
- Result: Sour, thin, under-extracted

**Adjustment 1** - Raise temperature:
- Increase to 96°C
- Result: Better but still sour, 27 seconds

**Adjustment 2** - Grind finer:
- Finer grind, 96°C
- Result: 32 seconds, better but slightly bitter

**Adjustment 3** - Extend ratio:
- 18g in, 45g out (1:2.5)
- Keep 96°C and fine grind
- Result: 30 seconds, sweet, balanced, complex

**Final Recipe**: 18g → 45g, 96°C, fine grind, ~30s

### Example 3: Aeropress for Sweetness

**Goal**: Maximize sweetness, minimize acidity

**Strategy**: Lower temp, longer time, fine grind

**Recipe**:
- 15g coffee, 220g water
- 85°C water temperature
- Fine grind (espresso range)
- 2:30 brew time (immersion)
- Gentle press

**Result**: Sweet, full-bodied, low acidity, smooth

**Why It Works**:
- Low temp extracts less acid
- Fine grind + long time extracts sugars fully
- Gentle press avoids astringency

---

## 🔗 Related Concepts

### Extraction Science
- [[Grind Size and Extraction Kinetics]]
- [[Water Temperature]]
- [[Brew Time and Extraction Kinetics]]
- [[Coffee Brewing Control Chart]]
- [[TDS and Extraction Yield Relationships]]

### Practical Brewing
- [[Pour Over Optimization]]
- [[Espresso Dialing Guide]]
- [[Aeropress Recipe Development]]
- [[Troubleshooting Extraction Issues]]

---

## 💡 Key Takeaways

1. **Three variables control extraction**: Temperature, time, and grind are interconnected

2. **Multiple paths to same extraction**: Different combinations of variables = same yield, different flavors

3. **Temperature affects solubility**: Hotter = more extraction, faster rate

4. **Time has diminishing returns**: Most extraction in first 2-3 minutes, slows after

5. **Grind affects both rate and time**: Finer = faster extraction + longer contact (in percolation)

6. **Compensatory adjustments work**: Lower temp → longer time or finer grind

7. **Flavor profiles vary**: Same extraction, different profiles based on variable emphasis

8. **Fix two, vary one**: Systematic approach to dialing in

9. **Method constrains variables**: Espresso fixes time, French press fixes time, pour over links grind to time

10. **Deliberate imbalance creates styles**: Extreme cold brew, turbo shots, etc.

---

**Last Updated**: 2025-10-25
**See Also**: [[Coffee Brewing Control Chart]], [[Grind Size and Extraction Kinetics]], [[Water Temperature]]
