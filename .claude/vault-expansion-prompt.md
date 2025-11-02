# Coffee Vault Expansion - Parallel Agentic Prompt Template

## Mission
You are expanding a comprehensive Obsidian-based Coffee Vault from 536 to 1000+ files. The user has explicitly chosen **ULTRA-HIGH QUALITY over speed** (Approach A). Every file must be 700-1,000+ lines with rich detail, extensive cross-references, and professional-grade content.

## Critical Quality Standards

### File Length Requirements
- **Minimum**: 700 lines per file
- **Target**: 800-1,000+ lines per file
- **Do NOT make concise** - the user explicitly wants comprehensive, detailed files
- Previous feedback: "maintain quality approach no need to make it more concise"

### Content Structure (ALL files must include)

1. **YAML Frontmatter** (30-50 lines)
   - Comprehensive metadata
   - All relevant fields for the category
   - Tags for cross-referencing
   - Status tracking
   - Dates, locations, ratings as applicable

2. **Overview/Introduction** (80-120 lines)
   - Detailed background and context
   - Historical significance
   - Cultural importance
   - Industry positioning
   - Geographic/origin context (if applicable)

3. **Main Content Sections** (400-600 lines)
   - **For Producers**: Organization, Location, Cultivation, Processing, Varieties, Quality, Social Impact, Environmental Sustainability, Challenges, Future Outlook
   - **For Equipment**: Specifications, Performance, Build Quality, Pricing, Reviews, Comparisons (8-10 competitors), Compatibility, Technical Notes
   - **For Bean Library**: Origin details, Variety information, Processing method, Flavor profile (extensive), Roast recommendations, Brewing methods, Tasting notes
   - **For Roasters**: Company history, Philosophy, Sourcing practices, Roasting approach, Product lines, Quality standards, Sustainability
   - **For Origins**: Geography, Climate, History, Growing regions, Varieties, Processing traditions, Cup characteristics, Market position
   - **For Recipes**: Equipment needed, Detailed step-by-step, Parameters, Timing, Troubleshooting, Variations, Expected results
   - **For Goals/Sessions/Events**: Context, Objectives, Details, Outcomes, Learnings, Related notes

4. **Cross-References Section** (50-100 lines)
   - Extensive [[wikilinks]] throughout the document
   - Related notes section at bottom
   - Links to: Origins, Producers, Equipment, Recipes, Methods, Parameters, Scientific References
   - Minimum 15-30 wikilinks per file

5. **Technical/Research Notes** (100-200 lines)
   - Deep dive into specifics
   - Scientific/technical details
   - Historical context
   - Expert insights
   - Industry analysis
   - Sustainability considerations
   - Innovation and future trends

6. **Personal Assessment/Analysis** (80-150 lines)
   - Comprehensive evaluation
   - Strengths and weaknesses
   - Use cases and recommendations
   - Value proposition
   - Who should/shouldn't engage with this
   - Final ratings or conclusions

## Categories to Expand

### Current Progress
- ✅ Recipes: 23/98 complete
- ✅ Producers: 62/98 complete (63.3%)
- 🔄 Equipment Models: 64/78 complete (82%)
- ⏳ Bean Library: Need 94 additional files
- ⏳ Roasters: Need 58 additional files
- ⏳ Origins: Need 26 additional files
- ⏳ Coffee Goals: Need 28 files
- ⏳ Cupping Sessions: Need 28 files
- ⏳ Coffee Events: Need 28 files

### File Naming Convention
- Use hyphens for spaces: `Finca-El-Bosque-Guatemala.md`
- Be specific and descriptive
- Include key identifying information
- Follow existing vault patterns

## Batch Processing Workflow

### Step 1: Create Files (4-6 per batch)
Create 4-6 comprehensive files per batch to manage token limits while maintaining quality.

### Step 2: Quality Checklist (each file must have)
- ✅ 700-1,000+ lines
- ✅ YAML frontmatter complete
- ✅ 15-30+ [[wikilinks]]
- ✅ All major sections comprehensive
- ✅ Technical depth and detail
- ✅ Cross-category connections
- ✅ Real-world context and examples

### Step 3: Git Commit (after each batch)
```
Add [Category] Batch [N]: [X] comprehensive profiles ([total]/[target] complete - [%]%)

Files created:
- [File 1]: [Description] - [line count] lines - [key features]
- [File 2]: [Description] - [line count] lines - [key features]
[continue for all files]

Categories/Themes: [breakdown]
Total lines: [sum]
Average: [avg] lines per file

Progress: [specific progress notes]
Quality: 700-1,000+ lines per file, extensive cross-references

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Step 4: Return Summary
After completing batch, return:
- Number of files created with individual line counts
- Total lines created
- Categories/themes covered
- Progress: X/Y complete (percentage)
- Quality metrics
- Any challenges encountered

## Cross-Reference Patterns

### Common Wikilinks to Include
- `[[Origins/Country-Region]]`
- `[[Producers/Producer-Name]]`
- `[[Bean Library/Bean-Name]]`
- `[[Equipment Models/Equipment-Name]]`
- `[[Recipes/Recipe-Name]]`
- `[[Brewing Methods/Method]]`
- `[[Brewing Parameters/Parameter]]`
- `[[Scientific References/Topic]]`
- `[[Roasters/Roaster-Name]]`
- `[[Processing Methods/Method]]`
- `[[Coffee Varieties/Variety]]`

### Integration Examples
- Equipment files should reference compatible beans, recipes, methods
- Producer files should link to origins, varieties, processing methods
- Bean library files should link to producers, origins, roasters, recipes
- Recipe files should link to equipment, beans, methods, parameters

## Diversity and Coverage Requirements

### Geographic Diversity
- Cover all major coffee-producing regions
- Include emerging origins
- Represent different terroirs and microclimates
- Balance established and experimental regions

### Production Models
- Cooperatives, estates, family farms, washing stations
- Small-scale and large-scale operations
- Traditional and innovative approaches
- Various certification levels

### Price Points and Accessibility
- Budget/entry-level options
- Mid-range quality
- Premium/specialty
- Ultra-premium/competition-grade

### Processing Methods
- Washed, natural, honey (all variants)
- Experimental (anaerobic, carbonic maceration, etc.)
- Traditional regional methods
- Innovative processing

### Social and Environmental Themes
- Women's empowerment
- Indigenous communities
- Post-conflict recovery
- Environmental conservation
- Fair Trade and Direct Trade
- Organic and regenerative agriculture
- Climate adaptation

## Example File Structures

### Producer Profile Template
```markdown
---
type: producer-profile
producer-name: [Name]
country: [[Origins/Country]]
region: [[Origins/Country-Region]]
type: [Cooperative/Estate/etc]
established: [Year]
varieties: [List]
processing-methods: [List]
certifications: [List]
altitude: [Range]
harvest-season: [Months]
annual-production: [Amount]
member-count: [Number]
status: complete
---

# [Producer Name]

[Comprehensive 80-120 line overview with background, significance, positioning]

## Location & Geography
[Detailed 100+ lines on terroir, climate, elevation, soil, etc.]

## Historical Context
[100+ lines on founding, evolution, regional coffee history]

## Organization & Structure
[80+ lines on governance, membership, operations]

## Cultivation Practices
[100+ lines on farming methods, shade systems, inputs, etc.]

## Coffee Varieties
[80+ lines on varieties grown, characteristics, selection rationale]

## Processing Methods
[150+ lines on detailed processing steps, innovations, quality control]

## Quality & Certifications
[80+ lines on quality systems, cupping scores, certifications]

## Market Position & Distribution
[80+ lines on buyers, markets, pricing, positioning]

## Social Impact
[100+ lines on community development, education, healthcare, etc.]

## Environmental Sustainability
[100+ lines on conservation, water management, biodiversity, etc.]

## Challenges & Opportunities
[80+ lines on obstacles faced and future potential]

## Related Notes
[Extensive wikilinks to related vault content]

**Tags**: [comprehensive tagging]
```

### Equipment Model Template
```markdown
---
type: equipment-model
name: [Model Name]
brand: [Brand]
model-number: [Number]
category: [grinder/brewer/etc]
release-year: [Year]
status: active
tags: [comprehensive tags]
community-rating: [Rating]
price-range: [Range]
---

# [Brand] [Model Name]

[Overview and positioning]

## Basic Information
[Company background, product development, design philosophy - 80+ lines]

## Manufacturer Specifications
[Exhaustive technical specs - 150-250 lines]

## Pricing & Availability
[Regional pricing, retailers, value analysis - 100+ lines]

## Reviews & Ratings
[Professional and community reviews - 150-200 lines]

## Comparisons
[8-10 competitors detailed - 150-200 lines]

## Compatibility
[Equipment pairings, accessories - 80+ lines]

## Research & Documentation
[Resources and links - 60+ lines]

## Notes
### Research Notes [100-150 lines]
### Technical Notes [100-150 lines]
### Known Issues [50+ lines]

## Personal Assessment
[Comprehensive evaluation - 150-200 lines]

## Related Notes
[Extensive wikilinks]
```

### Bean Library Template
```markdown
---
type: bean-library
name: [Bean Name]
origin: [[Origins/Country]]
region: [[Origins/Country-Region]]
producer: [[Producers/Producer-Name]]
variety: [Variety]
processing: [Method]
altitude: [Range]
harvest-date: [Date]
roaster: [[Roasters/Roaster-Name]]
roast-level: [Level]
purchase-date: [Date]
status: [Status]
rating: [Rating]
---

# [Bean Name]

[Comprehensive overview - 80-100 lines]

## Origin Details
[Geography, terroir, producer background - 100+ lines]

## Variety Information
[Botanical details, characteristics, history - 80+ lines]

## Processing Method
[Detailed processing description - 100+ lines]

## Flavor Profile
[Extensive tasting notes, evolution - 150+ lines]

## Roasting Analysis
[Roast development, recommendations - 80+ lines]

## Brewing Recommendations
[Multiple methods detailed - 100+ lines]

## Cupping Notes
[Professional cupping scores and analysis - 80+ lines]

## Value & Market Position
[Pricing, availability, value proposition - 60+ lines]

## Related Notes
[Extensive wikilinks]
```

## Save Locations
- Producers: `/Users/jonsussmanstudio/Desktop/Coffee Vault/Producers/`
- Equipment Models: `/Users/jonsussmanstudio/Desktop/Coffee Vault/Equipment Models/`
- Bean Library: `/Users/jonsussmanstudio/Desktop/Coffee Vault/Bean Library/`
- Roasters: `/Users/jonsussmanstudio/Desktop/Coffee Vault/Roasters/`
- Origins: `/Users/jonsussmanstudio/Desktop/Coffee Vault/Origins/`
- Recipes: `/Users/jonsussmanstudio/Desktop/Coffee Vault/Recipes/`
- Coffee Goals: `/Users/jonsussmanstudio/Desktop/Coffee Vault/Coffee Goals/`
- Cupping Sessions: `/Users/jonsussmanstudio/Desktop/Coffee Vault/Cupping Sessions/`
- Coffee Events: `/Users/jonsussmanstudio/Desktop/Coffee Vault/Coffee Events/`

## Final Reminders
1. **Quality over quantity** - Every file must be comprehensive
2. **User wants 700-1,000+ lines** - Do not make concise
3. **Extensive cross-referencing** - Minimum 15-30 wikilinks per file
4. **Git commit after each batch** - Detailed commit messages
5. **Return comprehensive summaries** - Show progress and quality metrics
6. **Maintain consistency** - Follow established vault patterns
7. **Cultural sensitivity** - Respect origins, communities, traditions
8. **Professional grade** - Each file should read like expert documentation

## Success Metrics
- ✅ Every file 700-1,000+ lines
- ✅ Comprehensive coverage of topic
- ✅ Extensive wikilinks (15-30+)
- ✅ All major sections complete
- ✅ Professional quality content
- ✅ Git commits with detailed messages
- ✅ Progress tracking and reporting
