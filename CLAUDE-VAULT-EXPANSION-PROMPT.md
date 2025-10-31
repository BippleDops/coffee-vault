# ☕ Coffee Vault Expansion: Complete Automation Prompt

**Objective**: Expand Coffee Vault from 536 → 1000+ entries in a single session  
**Context**: Well-structured Obsidian vault with scientific foundations and bidirectional linking  
**Timeframe**: Complete expansion and quality assurance in one day

---

## 🎯 PRIMARY OBJECTIVE

You are expanding a specialty coffee knowledge vault from 536 files to 1000+ comprehensive, well-researched entries. Each entry must:

1. Be factually accurate and well-sourced
2. Use proper YAML frontmatter
3. Include bidirectional wikilinks
4. Follow established templates
5. Be cross-referenced with related entries
6. Maintain consistent formatting

---

## 📂 VAULT STRUCTURE (Current: 536 files)

```
Coffee Vault/
├── Scientific References/ (160) - MAINTAIN
├── Beans Library/ (106) → Expand to 200
├── Origins/ (54) → Expand to 80
├── Roasters/ (62) → Expand to 120
├── Recipes/ (2) → Expand to 100 ⭐ HIGHEST PRIORITY
├── Producers/ (2) → Expand to 100 ⭐ HIGHEST PRIORITY
├── Equipment Models/ (2) → Expand to 80 ⭐ HIGHEST PRIORITY
├── Coffee Logs/ (50) - MAINTAIN
├── Brewing Guides/ (41) - MAINTAIN
├── Coffee Goals/ (2) → Expand to 30
├── Cupping Sessions/ (2) → Expand to 30
├── Coffee Events/ (2) → Expand to 30
└── Views/ & Templates/ - MAINTAIN
```

**Total needed: 464 new files**

---

## 🤖 AUTOMATION STRATEGY

### Phase 1: Template-Based Generation (Automated)

**Use existing vault as reference**. Browse Scientific References and Beans Library to understand:

1. YAML frontmatter structure
2. Wikilink patterns
3. Content depth and quality
4. Cross-referencing style
5. Formatting consistency

**Create files in batches** following this priority order:

#### Batch 1: Recipes (98 files) - Start Here
**File naming**: `Recipes/[Method]-[Variation]-[Roast-Level].md`  
**Template structure**:
```markdown
---
type: recipe
method: [V60/Chemex/AeroPress/French-Press/Moka-Pot/Turkish/Siphon/etc]
difficulty: [Beginner/Intermediate/Advanced]
time-minutes: [2-30]
coffee-g: [15-60]
water-ml: [150-1000]
temperature-c: [85-96]
grind-size: [extra-fine/fine/medium-fine/medium/medium-coarse/coarse]
tools-required: [list]
origin-recommended: [[Origins/Country-Region]]
roast-level-recommended: [Light/Medium/Dark]
tags: [method, difficulty, roast-level, region]
date: 2025-10-28
status: complete
---

# [Method] - [Variation] - [Roast Level] Recipe

**Method**: [Method]  
**Difficulty**: [Level]  
**Best for**: [Target audience/profile]

## 📋 Overview

[2-3 sentence description of this specific recipe variation]

## ⚙️ Equipment Needed

- [Method brewer]
- [Specific filter if needed]
- Scale (grams)
- Kettle with temperature control
- Timer
- [Any other specific tools]

## 📊 Recipe Parameters

- **Coffee**: [X] grams
- **Water**: [X] ml
- **Ratio**: 1:[X]
- **Temperature**: [X]°C
- **Grind**: [Size]
- **Total Time**: [X] minutes

## 🎯 Step-by-Step Instructions

1. [Preheat/Setup step]
2. [Bloom step]
3. [Main pour steps]
4. [Final extraction]
5. [Serve]

## 💡 Key Techniques

[2-3 specific techniques for this recipe]

## 🎨 Adjustments

**For Lighter Roasts**: [Modification]  
**For Darker Roasts**: [Modification]  
**To Increase Body**: [Modification]  
**To Increase Brightness**: [Modification]

## ⚠️ Common Mistakes

- [Mistake 1 and why it's bad]
- [Mistake 2 and why it's bad]
- [Mistake 3 and why it's bad]

## 🔗 Related Content

**Try These**: [[Recipes/...]]  
**Learn About**: [[Brewing Guides/Method Guide|Complete Method Guide]]  
**Best Beans**: [[Beans Library/...]]  
**Origins**: [[Origins/...]]

---

**Last Updated**: 2025-10-28  
**Version**: 1.0
```

**Distribution for 98 recipes**:
- V60: 20 recipes (light/medium/dark × variations)
- Chemex: 15 recipes
- AeroPress: 20 recipes
- French Press: 10 recipes
- Moka Pot: 8 recipes
- Kalita Wave: 8 recipes
- Turkish: 5 recipes
- Siphon: 5 recipes
- Clever: 5 recipes
- Cold Brew: 2 recipes

#### Batch 2: Producers (98 files)
**File naming**: `Producers/[Name]-[Country]-[Type].md`  
**Template**:
```markdown
---
type: producer-profile
producer-name: [Full name]
country: [[Origins/Country]]
region: [[Origins/Country-Region]]
type: [Farm/Cooperative/Washing-Station]
established: [Year]
varieties: [Typica/Bourbon/SL-28/etc]
processing-methods: [Washed/Natural/Honey]
certifications: [Organic/Fair-Trade/Direct-Trade]
annual-production: [Bags/year]
altitude: [MASL]
harvest-season: [Months]
status: complete
tags: [country, region, type]
date: 2025-10-28
---

# [Producer Name]

**Type**: [Farm/Cooperative/Washing Station]  
**Location**: [[Origins/Country-Region|Region, Country]]  
**Established**: [Year]

## 📋 Overview

[2-3 sentences about producer history and significance]

## 🌍 Location & Terroir

**Country**: [[Origins/Country]]  
**Region**: [[Origins/Country-Region]]  
**Altitude**: [X] MASL  
**Climate**: [Description]  
**Soil**: [Description]

## 👥 Operations

**Type**: [Ownership structure]  
**Workers**: [Number]  
**Focus**: [Quality/Volume/Mission statement]

## ☕ Coffee Production

**Varieties Grown**: [List]  
**Processing Methods**: [List]  
**Certifications**: [List]  
**Annual Production**: [Quantity]

## 🏆 Quality & Recognition

[C Notable achievements, cupping scores, awards]

## 🔗 Relationships

**Importers**: [List]  
**Roasters**: [[Roasters/...]]  
**Exports**: [Regions]

## 📊 Notable Offerings

- [Coffee 1 with link to beans]
- [Coffee 2 with link to beans]
- [Coffee 3 with link to beans]

## 🔗 Related Content

**Location**: [[Origins/Country-Region]]  
**Beans**: [[Beans Library/...]]  
**Roasters**: [[Roasters/...]]  
**Processing**: [[Scientific References/Processing/...]]

---

**Last Updated**: 2025-10-28
```

**Distribution for 98 producers**:
- Ethiopia: 20 (washing stations, cooperatives)
- Kenya: 15 (cooperatives, AA growers)
- Colombia: 15 (producer groups)
- Guatemala: 12 (family farms)
- Costa Rica: 10 (micro-mills)
- Honduras: 8
- Nicaragua: 5
- Panama: 5
- Brazil: 4
- Peru: 4

#### Batch 3: Equipment Models (78 files)
**File naming**: `Equipment Models/[Manufacturer]-[Model].md`  
**Template**:
```markdown
---
type: equipment-model
manufacturer: [Brand]
model: [Specific Model]
category: [Grinder/Brewer/Accessory]
price-range: $[Low]-$[High]
availability: [Global/North-America/Europe/etc]
rating: [Stars]/5
best-for: [Use case]
tags: [category, manufacturer, price-range]
date: 2025-10-28
status: complete
---

# [Manufacturer] [Model]

**Type**: [Category]  
**Price**: $[Range]  
**Rating**: [X]/5

## 📋 Overview

[2-3 sentences describing equipment]

## ⚙️ Specifications

**Type**: [Detailed category]  
**Dimensions**: [Measurements]  
**Weight**: [Weight]  
**Power**: [If applicable]  
**Materials**: [Construction materials]

## ✨ Key Features

- [Feature 1]
- [Feature 2]
- [Feature 3]
- [Feature 4]

## 🎯 Best For

[Primary use cases]

## 💰 Price & Availability

**Price**: $[Range]  
**Availability**: [Where to buy]  
**Value**: [Assessment]

## 🔧 Maintenance

[Care requirements]

## ⭐ Pros & Cons

**Pros**:
- [Positive 1]
- [Positive 2]

**Cons**:
- [Negative 1]
- [Negative 2]

## 🔗 Related Content

**Recipes**: [[Recipes/...]]  
**Guides**: [[Brewing Guides/...]]  
**Comparisons**: [[Equipment Models/...]]

---

**Last Updated**: 2025-10-28
```

**Distribution for 78 equipment**:
- Hand grinders: 15 models
- Electric grinders: 15 models
- Espresso machines: 10 models
- Pour over brewers: 15 models
- Immersion brewers: 10 models
- Accessories: 13 items

#### Batch 4: Beans (94 additional)
Reference existing Beans Library to match format exactly

#### Batch 5: Roasters (58 additional)
Reference existing Roasters to match format exactly

#### Batch 6: Goals (28 files), Cupping Sessions (28), Events (28)
Use similar structured approach

---

## 🔗 CRITICAL: Bidirectional Linking

**For EVERY file created**:

1. **Extract entities** from content:
   - Country/region names → Link to [[Origins/...]]
   - Method names → Link to [[Brewing Guides/...]]
   - Bean names → Link to [[Beans Library/...]]
   - Roasters → Link to [[Roasters/...]]
   - Scientific concepts → Link to [[Scientific References/...]]

2. **Create reciprocal links**:
   - When you link [[Origins/Colombia]], add "## Links" section to Colombia
   - When you link [[Recipes/V60]], add link back
   - When you link [[Producers/Finca]], add link to producer profile

3. **Use existing files** as reference:
   - Check what already exists before linking
   - Follow established patterns
   - Maintain consistency

---

## ✅ QUALITY CHECKLIST (Per File)

Before considering a file complete:

- [ ] YAML frontmatter is complete and accurate
- [ ] File has substantive content (not just template)
- [ ] All wikilinks point to existing files OR will be created
- [ ] Consistent formatting with vault standards
- [ ] Proper categorization
- [ ] Date stamp: 2025-10-28
- [ ] Status: complete
- [ ] No placeholder text like [Insert X]
- [ ] Factually accurate information
- [ ] Reciprocal links added where referenced

---

## 🚨 ANTICIPATED CHALLENGES & SOLUTIONS

**Challenge 1**: Creating 464 files is overwhelming  
**Solution**: Work in batches of 10-20 files, complete a batch before moving on

**Challenge 2**: Losing track of what's been linked  
**Solution**: Keep a running list of files created, check off as reciprocal links are added

**Challenge 3**: Inconsistent quality  
**Solution**: Use templates strictly, review first 3 files in each batch before continuing

**Challenge 4**: Broken or missing links  
**Solution**: Check all links before finishing each batch, verify files exist

**Challenge 5**: Repetitive content  
**Solution**: Each recipe/producer/equipment MUST be unique with specific details

---

## 🎯 SUCCESS CRITERIA

**You're done when**:
1. ✅ 464 new files created
2. ✅ All files have proper frontmatter
3. ✅ All files have bidirectional links
4. ✅ Zero placeholder text remaining
5. ✅ Total file count is 1000+
6. ✅ Git commit with clear summary

---

## 🚀 EXECUTION PLAN

**Start Sequence**:
1. Read VAULT-EXPANSION-STRATEGY.md to understand full context
2. Browse 3-5 existing files in each category to learn patterns
3. Begin with Recipes (highest impact)
4. Create 10-20 files per batch
5. After each batch, commit with message
6. Progress through all batches systematically
7. Final quality check
8. Git push

**Git Commits**:
```
Commit 1: "Add 20 V60 recipes with bidirectional links"
Commit 2: "Add 20 Chemex recipes with bidirectional links"
...continue with descriptive commits
Final: "Complete vault expansion: 464 new entries → 1000+ total files"
```

---

## 💡 REMEMBER

1. **Quality > Speed**: Better to do 300 excellent files than 464 mediocre ones
2. **Bidirectional Links**: This is your vault's superpower - maintain it
3. **Consistency**: Follow templates exactly
4. **Accuracy**: Research-based content only
5. **Patience**: This is a marathon, not a sprint

**You have everything you need in the vault structure**. Use existing files as perfect templates. Follow the patterns already established. The vault knows what it wants to be - help it get there systematically.

**Good luck! ☕ Make this the best coffee knowledge vault in the world.**

