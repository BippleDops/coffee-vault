<%*
// SCA Cupping Form Template
// Based on official SCA protocols
// Version: 1.0.0

const tp = this.app.plugins.plugins.templater.templater.current_functions_object;
const currentDate = tp.file.creation_date("YYYY-MM-DD");
const currentTime = tp.file.creation_date("HH:mm");
const fileName = `Cupping-${currentDate}-${tp.file.creation_date("HHmmss")}`;

// Rename file
await tp.file.rename(fileName);

// Input cupping session details
const roaster = await tp.system.prompt("Roaster/Producer", "");
const sampleId = await tp.system.prompt("Sample ID/Code", "");
const coffeeType = await tp.system.prompt("Coffee Type (variety/region)", "");

%>---
type: cupping-form
protocol: SCA
date: <%= currentDate %>
time: <%= currentTime %>
roaster: <%= roaster %>
sample-id: <%= sampleId %>
coffee-type: <%= coffeeType %>
status: active
tags: [cupping, SCA, evaluation]
---

# ☕ SCA Cupping Form

**Session**: <%= currentDate %> at <%= currentTime %>
**Sample**: <%= sampleId %> - <%= coffeeType %>
**Roaster/Producer**: <%= roaster %>

---

## Sample Information

- **Sample ID**: <%= sampleId %>
- **Coffee Name**: <%= coffeeType %>
- **Roaster/Producer**: <%= roaster %>
- **Roast Date**:
- **Cupping Date**: <%= currentDate %>
- **Cupper**:
- **Roast Level**: [ ] Light [ ] Medium [ ] Dark
- **Process**: [ ] Washed [ ] Natural [ ] Honey [ ] Other: ___

---

## Dry Fragrance/Aroma (Scale: 6.00-10.00)

**Instructions**: Evaluate the smell of the dry grounds immediately after grinding.

**Intensity**: [ ] Low [ ] Medium [ ] High

**Descriptors**:
- [ ] Floral
- [ ] Fruity
- [ ] Herbal/Spicy
- [ ] Nutty/Cocoa
- [ ] Caramel/Sweet
- [ ] Other: _______________

**Score**: _____ / 10.00

**Notes**:


---

## Wet Aroma (Scale: 6.00-10.00)

**Instructions**: Evaluate the smell of the coffee after adding hot water, during the crust phase.

**Intensity**: [ ] Low [ ] Medium [ ] High

**Descriptors**:
- [ ] Floral
- [ ] Fruity
- [ ] Berry
- [ ] Citrus
- [ ] Chocolate
- [ ] Nutty
- [ ] Spicy
- [ ] Other: _______________

**Score**: _____ / 10.00

**Notes**:


---

## Flavor (Scale: 6.00-10.00)

**Instructions**: Evaluate the flavor characteristics, including taste and retronasal aroma. Rate at cupping temperature (160-140°F / 71-60°C).

**Primary Flavors** (select all that apply):
- [ ] Berry (specify: _________)
- [ ] Citrus (specify: _________)
- [ ] Stone Fruit (specify: _________)
- [ ] Tropical Fruit (specify: _________)
- [ ] Floral (specify: _________)
- [ ] Chocolate
- [ ] Caramel
- [ ] Nuts
- [ ] Spices (specify: _________)
- [ ] Other: _______________

**Complexity**: [ ] Simple [ ] Moderate [ ] Complex

**Score**: _____ / 10.00

**Notes**:


---

## Aftertaste (Scale: 6.00-10.00)

**Instructions**: Evaluate the length and quality of flavor that remains after swallowing or expectorating.

**Length**: [ ] Short [ ] Medium [ ] Long

**Quality**: [ ] Unpleasant [ ] Neutral [ ] Pleasant [ ] Very Pleasant

**Descriptors**:


**Score**: _____ / 10.00

**Notes**:


---

## Acidity (Scale: 6.00-10.00)

**Instructions**: Evaluate the intensity AND quality of acidity. High-quality acidity is pleasant and adds liveliness.

**Intensity**:
[ ] Low  [ ] Medium-Low  [ ] Medium  [ ] Medium-High  [ ] High

**Quality**:
[ ] Unpleasant/Sour  [ ] Neutral  [ ] Pleasant  [ ] Vibrant  [ ] Sparkling

**Type**:
- [ ] Malic (apple-like)
- [ ] Citric (citrus-like)
- [ ] Tartaric (wine-like)
- [ ] Acetic (vinegar-like, if present)
- [ ] Lactic (creamy, yogurt-like)
- [ ] Phosphoric (bright, cola-like)

**Score**: _____ / 10.00

**Notes**:


---

## Body (Scale: 6.00-10.00)

**Instructions**: Evaluate the tactile feeling (weight/viscosity/texture) of the coffee in the mouth.

**Weight**:
[ ] Light  [ ] Medium-Light  [ ] Medium  [ ] Medium-Heavy  [ ] Heavy

**Texture**:
- [ ] Watery
- [ ] Silky
- [ ] Smooth
- [ ] Creamy
- [ ] Syrupy
- [ ] Coating
- [ ] Other: _______________

**Score**: _____ / 10.00

**Notes**:


---

## Balance (Scale: 6.00-10.00)

**Instructions**: How well do the flavor, aftertaste, acidity, and body work together?

**Assessment**:
- [ ] Unbalanced (one aspect dominates negatively)
- [ ] Somewhat balanced
- [ ] Well balanced
- [ ] Harmonious (all aspects complement each other)

**Score**: _____ / 10.00

**Notes**:


---

## Uniformity (Scale: 0, 2, 4, 6, 8, 10)

**Instructions**: Evaluate consistency across the 5 cups. Score 2 points for each uniform cup.

**Cup 1**: [ ] Uniform [ ] Non-uniform
**Cup 2**: [ ] Uniform [ ] Non-uniform
**Cup 3**: [ ] Uniform [ ] Non-uniform
**Cup 4**: [ ] Uniform [ ] Non-uniform
**Cup 5**: [ ] Uniform [ ] Non-uniform

**Score**: _____ / 10.00

**Notes on variations**:


---

## Clean Cup (Scale: 0, 2, 4, 6, 8, 10)

**Instructions**: Evaluate the absence of off-flavors and defects from first ingestion to aftertaste. Score 2 points for each clean cup.

**Cup 1**: [ ] Clean [ ] Taint [ ] Fault
**Cup 2**: [ ] Clean [ ] Taint [ ] Fault
**Cup 3**: [ ] Clean [ ] Taint [ ] Fault
**Cup 4**: [ ] Clean [ ] Taint [ ] Fault
**Cup 5**: [ ] Clean [ ] Taint [ ] Fault

**Score**: _____ / 10.00

**Defects noted**:


---

## Sweetness (Scale: 0, 2, 4, 6, 8, 10)

**Instructions**: Evaluate the fullness of sweetness and lack of harshness. Score 2 points for each sweet cup.

**Cup 1**: [ ] Sweet [ ] Not Sweet
**Cup 2**: [ ] Sweet [ ] Not Sweet
**Cup 3**: [ ] Sweet [ ] Not Sweet
**Cup 4**: [ ] Sweet [ ] Not Sweet
**Cup 5**: [ ] Sweet [ ] Not Sweet

**Score**: _____ / 10.00

**Notes**:


---

## Defects

**Instructions**: Note any defects found and their intensity.

**Taints** (1-2 points deduction per cup):
- Number of cups affected: _____
- Type: _______________
- **Deduction**: - _____ points

**Faults** (2-4 points deduction per cup):
- Number of cups affected: _____
- Type: _______________
- **Deduction**: - _____ points

**Common Defects**:
- [ ] Fermented/Overripe
- [ ] Moldy/Musty
- [ ] Phenolic/Medicinal
- [ ] Rubber
- [ ] Onion/Garlic
- [ ] Petroleum/Diesel
- [ ] Earthy/Dirty
- [ ] Other: _______________

---

## Overall Assessment (Scale: 6.00-10.00)

**Instructions**: Your personal assessment of the coffee quality, considering all aspects holistically.

**Score**: _____ / 10.00

**General Impression**:


---

## Final Score Calculation

| Attribute | Score |
|-----------|-------|
| Fragrance/Aroma | _____ |
| Flavor | _____ |
| Aftertaste | _____ |
| Acidity | _____ |
| Body | _____ |
| Balance | _____ |
| Uniformity | _____ |
| Clean Cup | _____ |
| Sweetness | _____ |
| Overall | _____ |
| **Subtotal** | **_____** |
| **Defects** | **- _____** |
| **FINAL SCORE** | **_____** |

---

## Score Interpretation

- **90-100**: Outstanding - Exceptional specialty coffee
- **85-89.99**: Excellent - Specialty grade, high quality
- **80-84.99**: Very Good - Specialty grade
- **75-79.99**: Good - Premium commercial quality
- **70-74.99**: Fair - Average commercial quality
- **< 70**: Below Specialty - Not recommended

**This coffee scores**: _____ (**_____** Grade)

---

## Cupping Protocol Details

**Sample Preparation**:
- Roast Level: _______________
- Sample Weight: 8.25g per cup (or 55g per liter)
- Grind Setting: _______________
- Grind Time: _______________
- Water Temperature: 200°F (93°C)
- Bloom Time: 3-5 minutes
- Number of Cups: 5

**Water Specifications**:
- Source: _______________
- TDS: _______________
- Hardness: _______________

**Environment**:
- Room Temperature: _______________
- Humidity: _______________

---

## Additional Notes

<% tp.file.cursor() %>

---

## Cupper Information

**Name**: _______________
**Q Grader ID** (if applicable): _______________
**Certification Date**: _______________
**Organization**: _______________

---

**Form Version**: SCA 1.0
**Protocol**: Specialty Coffee Association Cupping Protocol (Revised 2015/2023)
**Created**: <%= currentDate %>
