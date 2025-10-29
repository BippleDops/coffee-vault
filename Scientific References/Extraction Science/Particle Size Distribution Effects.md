---
type: scientific-reference
category: extraction-science
topic: grind-distribution
difficulty: advanced
tags: [grind, particle-size, extraction, grinder, uniformity, fines]
related-topics: [grind-size, extraction-kinetics, grinders, brew-method]
---

# Particle Size Distribution Effects

**How Grind Uniformity Impacts Extraction Quality**

Grind size isn't just about average particle size - the distribution of particle sizes (from ultra-fine "fines" to large "boulders") profoundly affects extraction uniformity, flow rate, and final cup quality. Understanding particle size distribution (PSD) is essential for optimizing coffee brewing.

---

## 📊 Understanding Particle Size Distribution

### What Is PSD?

**Definition**: The range and frequency of particle sizes in a ground coffee sample.

**Not Just Average**: Two grinds with the same average particle size can produce drastically different coffee if their distributions differ.

**Measurement**:
- Particle analyzers (laser diffraction, sieve analysis)
- D10, D50, D90 values (10th, 50th, 90th percentile sizes)
- Standard deviation (σ) indicates spread

### Key Distribution Metrics

**D50 (Median)**:
- 50% of particles smaller, 50% larger
- Represents "average" particle size
- Example: D50 = 400μm (medium grind)

**D10 and D90**:
- D10: 10% of particles are smaller than this
- D90: 90% of particles are smaller than this
- Range (D90 - D10) indicates distribution width

**Standard Deviation (σ)**:
- Narrow distribution: σ = 100-200μm (professional grinders)
- Wide distribution: σ = 300-500μm (blade grinders)

**Example Comparison**:

| Grinder Type | D50 (μm) | D10 (μm) | D90 (μm) | Spread |
|--------------|----------|----------|----------|--------|
| High-End Flat Burr | 400 | 250 | 600 | Narrow |
| Conical Burr | 400 | 150 | 700 | Moderate |
| Blade Grinder | 400 | 50 | 900 | Very Wide |

All have the same D50, but vastly different distributions.

---

## 🔬 Components of Ground Coffee

### Fines

**Definition**: Ultra-small particles, typically < 100-200μm

**Creation**:
- Fractured during grinding
- More common in lower-quality grinders
- Unavoidable but controllable

**Effects on Brewing**:
- **Positive**: Extract quickly, contribute body and sweetness early
- **Negative**: Over-extract easily, cause bitterness, clog filters
- **Flow**: Create resistance, slow water flow

**Percentage**:
- Blade grinder: 30-40% fines
- Entry burr grinder: 15-25% fines
- High-end burr grinder: 10-15% fines
- Ultra-premium grinders (EG-1, Titus, Weber): 5-10% fines

### Boulders

**Definition**: Large particles, typically > 800-1000μm

**Creation**:
- Particles that escaped full grinding
- Pass through burrs without sufficient fracture
- More common in worn or misaligned burrs

**Effects on Brewing**:
- Extract slowly and incompletely
- Contribute under-extracted, sour notes
- Can taste grassy, vegetal
- Waste potential coffee flavor

**Percentage**:
- High-quality grinder: 5-10% boulders
- Lower-quality grinder: 15-25% boulders

### Target Particles

**Definition**: Particles in the intended size range

**Size Range** (method-dependent):
- Espresso: 200-400μm
- Pour over: 400-800μm
- French press: 700-1200μm

**Ideal Scenario**:
- Maximum percentage in target range
- Minimum fines and boulders
- Narrow distribution curve

---

## 📐 Particle Size by Brew Method

### Espresso (Very Fine)

**Target Range**: 200-400μm median
**D50**: ~250-350μm
**Distribution**: Narrow is critical

**Why It Matters**:
- High pressure magnifies distribution effects
- Fines create channeling
- Boulders create gushers (fast flow)
- Uniformity = even extraction

**Grinder Requirements**:
- Flat burr often preferred (narrower distribution)
- Alignment crucial
- Fresh burrs important

### Pour Over / Drip (Medium-Fine to Medium)

**Target Range**: 400-800μm median
**D50**: ~500-700μm
**Distribution**: Moderate tolerance

**Why It Matters**:
- Fines slow flow, extend brew time
- Boulders under-extract
- Wider distribution more tolerable than espresso
- Flow rate is key consideration

**Grinder Requirements**:
- Good burr grinder sufficient
- Conical or flat both work well
- More forgiving than espresso

### French Press (Coarse)

**Target Range**: 700-1200μm median
**D50**: ~800-1000μm
**Distribution**: Wide tolerance

**Why It Matters**:
- Immersion reduces flow concerns
- Fines contribute body but can cause silting
- Boulders under-extract but less noticeable
- Most forgiving of uneven distribution

**Grinder Requirements**:
- Any burr grinder adequate
- Blade grinder problematic (too many fines)

### Cold Brew (Extra Coarse)

**Target Range**: 1000-1500μm median
**D50**: ~1200μm
**Distribution**: Wide tolerance

**Why It Matters**:
- Long extraction time (12-24 hours)
- Fines over-extract, create bitterness
- Coarse grind limits fines
- Immersion method very forgiving

---

## ⚖️ Effects on Extraction Uniformity

### The Problem of Uneven Distribution

**Ideal Scenario**: All particles extract at the same rate to the same level

**Reality**: Different sizes extract at different rates

**Small Particles (Fines)**:
- High surface-area-to-volume ratio
- Extract quickly and completely
- Reach >25% extraction while boulders at 15%
- Contribute bitterness, astringency

**Large Particles (Boulders)**:
- Low surface-area-to-volume ratio
- Extract slowly and incompletely
- May only reach 12-15% extraction
- Contribute sourness, underextraction

**Target Particles**:
- Extract at intended rate
- Reach 18-22% extraction
- Balanced flavor contribution

### Mathematical Model

**Surface Area to Volume Ratio**:

$$\frac{\text{Surface Area}}{\text{Volume}} = \frac{6}{d}$$

Where $d$ is particle diameter.

**Implication**: A 100μm particle has 10x the surface-area-to-volume ratio of a 1000μm particle.

**Extraction Rate**: Proportional to surface area

$$\text{Extraction Rate} \propto \frac{1}{d}$$

Smaller particles extract exponentially faster.

### The "Unevenness" Problem

**Example Scenario**:

| Particle Type | Size (μm) | % of Mass | Extraction | Contribution |
|---------------|-----------|-----------|------------|--------------|
| Fines | 100 | 20% | 28% | Over-extracted |
| Target | 500 | 60% | 20% | Ideal |
| Boulders | 1000 | 20% | 14% | Under-extracted |

**Result**:
- Overall extraction: ~20% (appears ideal)
- But flavor is imbalanced (bitter + sour)
- Narrow distribution would improve balance

---

## 🔧 Grinder Types and Distribution

### Flat Burr Grinders

**Particle Distribution**: Narrow, uniform

**Mechanism**:
- Parallel grinding surfaces
- Particles ground between flat plates
- More consistent fracture patterns
- Less variation in particle size

**Characteristics**:
- Lower fines production
- Fewer boulders
- Tighter distribution (low σ)
- Better for espresso

**Examples**:
- Mazzer grinders
- Mahlkönig EK43 (large flat burrs)
- Fellow Ode (small flat burrs)
- Weber Workshops EG-1

**Typical PSD**:
- D50: 400μm
- D10: 250μm
- D90: 600μm
- σ: ~150μm

### Conical Burr Grinders

**Particle Distribution**: Moderate, bimodal

**Mechanism**:
- Cone-shaped burr inside ring burr
- Particles spiral down and out
- Multiple fracture points
- Some particles escape earlier (boulders)

**Characteristics**:
- Moderate fines production
- Some boulders
- Bimodal distribution (two peaks)
- Traditional espresso choice

**Examples**:
- Baratza Virtuoso/Encore
- Comandante hand grinder
- Niche Zero
- Eureka Mignon

**Typical PSD**:
- D50: 400μm
- D10: 150μm
- D90: 700μm
- σ: ~200μm

### Blade Grinders

**Particle Distribution**: Very wide, chaotic

**Mechanism**:
- Spinning blade chops coffee
- Random fracture
- No controlled particle size
- Time-based (longer = finer average)

**Characteristics**:
- Very high fines (30-40%)
- Many boulders
- Extremely wide distribution
- Inconsistent results

**Typical PSD**:
- D50: 400μm (but misleading)
- D10: 50μm
- D90: 900μm
- σ: ~400μm

**Why They're Problematic**:
- Powder-like fines over-extract, bitter
- Chunks under-extract, sour
- Impossible to dial in consistently
- Not recommended for quality brewing

### Roller Mills

**Particle Distribution**: Very narrow, controlled

**Mechanism**:
- Coffee passes through multiple roller pairs
- Progressively smaller gaps
- Controlled fracture
- Industrial/commercial scale

**Characteristics**:
- Extremely low fines
- Minimal boulders
- Very tight distribution
- Expensive, large-scale equipment

**Applications**:
- Commercial roasteries
- Some high-end cafes
- Pre-ground coffee production

---

## 🌊 Flow Rate and Extraction Time

### How PSD Affects Flow

**Fines Impact**:
- Fill gaps between larger particles
- Reduce permeability
- Increase resistance to water flow
- Slow brew time

**Formula (Kozeny-Carman Equation)**:

$$\Delta P = \frac{\mu \cdot v \cdot L}{K \cdot A}$$

Where:
- ΔP = Pressure drop
- μ = Water viscosity
- v = Flow velocity
- L = Bed depth
- K = Permeability (affected by particle size and distribution)

**Permeability Relationship**:

$$K \propto d^2$$

Smaller particles dramatically reduce permeability (flow).

### Practical Implications

**Pour Over**:
- More fines → Slower drawdown
- Slower drawdown → Longer contact time → More extraction
- Must adjust grind coarser to compensate
- Ideal drawdown: 2:30-3:30 for V60

**Espresso**:
- Fines create "mud" layer
- Causes channeling (water finds paths around fines)
- Uneven extraction
- Shot time variation

**French Press**:
- Fines pass through metal filter
- Create sediment/"mud" in cup
- No flow restriction during brew
- But affects drinkability

### Compensating for PSD

**If High Fines Content**:
- Grind coarser than expected
- Reduce brew time
- Increase turbulence to prevent clogging
- Consider sifting

**If High Boulder Content**:
- Grind finer than expected
- Increase brew time
- Accept some under-extraction
- Consider sifting

---

## 🔬 Advanced Techniques: Sifting

### What Is Sifting?

**Process**: Passing ground coffee through mesh screens to separate particle sizes

**Purpose**:
- Remove fines (use coarser screen)
- Remove boulders (use finer screen)
- Narrow distribution
- Improve extraction uniformity

### Sifting Methods

**Single Screen (Fines Removal)**:
- Common mesh: 400-500μm
- Removes particles below threshold
- Reduces bitterness, improves clarity
- Loss: 10-20% of coffee (fines discarded)

**Double Screen (Fines and Boulders)**:
- Coarse screen removes boulders (>800μm)
- Fine screen removes fines (<300μm)
- Keep middle fraction
- Loss: 20-40% of coffee

**Kruve Sifter**:
- Popular consumer sifting tool
- Multiple screen sizes
- Precision separation
- Used in competition brewing

### When to Sift

**Beneficial Scenarios**:
- Lower-quality grinder (wide distribution)
- Competition brewing (perfection required)
- Light roast pour over (clarity critical)
- Experimental brewing

**Not Recommended**:
- High-quality grinder (already narrow distribution)
- Daily brewing (wasteful, time-consuming)
- Dark roasts (distribution less critical)

**Sifting for Espresso**:
- Remove both fines and boulders
- Target 250-400μm range
- Improves flow consistency
- Reduces channeling

---

## 📊 Measuring Your Grind Distribution

### DIY Methods

**Visual Inspection**:
- Spread grounds on white paper
- Look for powder (fines) and chunks (boulders)
- Qualitative assessment

**Pinch Test**:
- Rub grounds between fingers
- Should feel mostly uniform
- Dusty = high fines
- Gritty chunks = boulders

**Sifter Analysis**:
- Use Kruve or similar
- Weigh fractions from each screen
- Calculate percentages
- Approximate PSD curve

### Professional Methods

**Laser Diffraction**:
- Gold standard for PSD measurement
- Measures particles 0.1-3000μm
- Generates full distribution curve
- Expensive equipment ($10,000+)

**Sieve Stack Analysis**:
- Multiple mesh screens, stacked
- Vibrate to separate sizes
- Weigh each fraction
- Create distribution histogram
- More accessible than laser

**Microscopy**:
- Image analysis of particles
- Manual or automated counting
- Shape analysis in addition to size
- Research applications

---

## 🎯 Practical Optimization Strategies

### Grinder Maintenance

**Fresh Burrs**:
- Worn burrs produce more fines and boulders
- Replace based on manufacturer recommendations
- Typically every 500-1000 lbs for home use

**Alignment**:
- Misaligned burrs create uneven distribution
- Professional alignment services available
- DIY alignment for some models (shim kits)

**Cleanliness**:
- Old coffee oils and fines buildup
- Affects particle flow through burrs
- Clean regularly (weekly for daily use)

### Grinder Settings

**Stepless vs Stepped**:
- Stepless allows micro-adjustments
- Important for narrowing in on optimal grind
- Stepped is fine for most applications

**RPM/Speed**:
- Slower grinding can reduce fines (less heat, less shattering)
- Some grinders offer speed control
- Trade-off: Time vs quality

### Choosing the Right Grinder

**For Espresso**:
- Prioritize narrow distribution
- Flat burr often preferred
- Budget: $300+ (Baratza Sette, Eureka Mignon)
- High-end: $1000+ (Niche, Lagom, Weber)

**For Pour Over**:
- Moderate distribution acceptable
- Conical or flat both excellent
- Budget: $150+ (Baratza Encore)
- High-end: $500+ (Fellow Ode, Comandante)

**For French Press/Cold Brew**:
- Wide distribution tolerated
- Any burr grinder adequate
- Budget: $50+ (Hario Mini Mill)
- Premium: $150+ (Baratza Virtuoso)

### Brewing Adjustments

**Account for Your Grinder**:
- Wide distribution → Grind slightly coarser, shorter time
- Narrow distribution → Can push extraction higher
- High fines → Faster flow methods, coarser grind
- High boulders → Finer grind, longer time

**Method Selection**:
- Espresso: Demands narrow distribution
- Pour over: Moderate tolerance
- Immersion: High tolerance

---

## 🔗 Related Concepts

### Extraction Science
- [[Grind Size and Extraction Kinetics]]
- [[TDS and Extraction Yield Relationships]]
- [[Water Temperature and Solubility]]
- [[Coffee Brewing Control Chart]]

### Equipment
- [[Grinder Types Comparison]]
- [[Burr Geometry and Performance]]
- [[Grinder Maintenance Guide]]

### Brewing Methods
- [[Espresso Brewing Science]]
- [[Pour Over Optimization]]
- [[French Press Technique]]

---

## 📚 Further Reading

### Research Papers
- Uman, E., et al. (2016). "The effect of bean origin and temperature on grinding roasted coffee" - Nature Scientific Reports
- Melrose, J., et al. (2018). "Systematically Improving Espresso" - Matter Journal
- Corrochano, B., et al. (2015). "A new methodology to estimate the steady-state permeability of roast and ground coffee in packed beds"

### Books
- *The Physics of Filter Coffee* - Jonathan Gagné
- *Espresso Extraction: Measurement and Mastery* - Scott Rao
- *The Coffee Roaster's Companion* - Scott Rao

### Online Resources
- Barista Hustle: "Grind Size and Extraction"
- Socratic Coffee: "Particle Size Distribution in Coffee"
- Coffee Ad Astra (Jonathan Gagné): "Grinding Coffee: An In-Depth Analysis"
- Home-Barista.com Forums: Grinder discussions

---

## 💡 Key Takeaways

1. **Distribution matters as much as average size** - two grinds with same D50 can taste completely different

2. **Fines over-extract, boulders under-extract** - wide distribution creates simultaneous bitter and sour notes

3. **Grinder quality determines distribution** - flat burrs typically narrower than conical, both far better than blade

4. **Espresso demands narrow distribution** - pressure magnifies distribution problems

5. **Pour over tolerates moderate variation** - but benefits from quality grinder

6. **Immersion methods are forgiving** - French press, cold brew less sensitive to distribution

7. **Sifting can improve results** - but only necessary with lower-quality grinders or competition brewing

8. **Grinder maintenance is critical** - worn burrs, misalignment, and buildup widen distribution

9. **Flow rate reveals distribution** - slow flow indicates high fines, fast flow indicates coarse/boulder-heavy grind

10. **Invest in the grinder** - single biggest impact on brewing consistency and quality

---

**Last Updated**: 2025-10-25
**See Also**: [[Grind Size and Extraction Kinetics]], [[Coffee Brewing Control Chart]], [[Grinder Types Comparison]]
