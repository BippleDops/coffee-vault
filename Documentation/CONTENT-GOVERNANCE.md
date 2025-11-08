---
type: documentation
category: governance
version: 6.0.0
status: active-standard
tags: [governance, standards, quality, editorial, content-management]
created: 2025-11-06
---

# Coffee Vault Content Governance Framework

**Purpose**: Establish editorial standards, quality guidelines, and content management processes to ensure Coffee Vault remains a world-class coffee knowledge system.

**Scope**: All content creation, updates, and maintenance across the vault
**Authority**: v6.0.0 official standards
**Review Cycle**: Quarterly

---

## 📋 Table of Contents

1. [Editorial Principles](#editorial-principles)
2. [Content Standards by Entity Type](#content-standards-by-entity-type)
3. [Quality Assurance Process](#quality-assurance-process)
4. [Update Cadence](#update-cadence)
5. [Sourcing Standards](#sourcing-standards)
6. [Contributor Guidelines](#contributor-guidelines)
7. [Review & Approval Workflow](#review--approval-workflow)
8. [Maintenance Procedures](#maintenance-procedures)
9. [Content Lifecycle](#content-lifecycle)
10. [Metrics & KPIs](#metrics--kpis)

---

## 🎯 Editorial Principles

### 1. **Quality Over Quantity**

**Principle**: Every note must provide genuine value. Better to have 100 excellent notes than 1,000 mediocre ones.

**Application**:
- Each scientific reference must cite sources or established research
- Coffee logs must include minimum metadata for usefulness
- Bean profiles require verification from multiple sources
- Origin profiles must include geographic, climatic, and cultural context

**Quality Gates**:
- ✅ Content adds unique value (not duplicating existing notes)
- ✅ Information is accurate and verifiable
- ✅ Writing is clear and accessible (8th grade reading level)
- ✅ Links are bidirectional and complete
- ✅ Frontmatter is complete and valid

### 2. **Accuracy & Verifiability**

**Principle**: All factual claims must be accurate and, where possible, verifiable through citations or reputable sources.

**Standards**:
- **Scientific References**: Cite peer-reviewed papers, books, or established experts
- **Origin Information**: Use World Coffee Research, SCA, or government agricultural data
- **Processing Details**: Reference coffee science literature or roaster documentation
- **Equipment Specs**: Use manufacturer specifications or verified reviews

**Verification Tiers**:
- **Tier 1 (Gold Standard)**: Peer-reviewed research, official standards
- **Tier 2 (Acceptable)**: Industry publications, expert books, reputable sites
- **Tier 3 (Use Carefully)**: Forums, blogs, anecdotal evidence (mark as such)
- **Tier 4 (Avoid)**: Unverified claims, marketing copy, rumors

### 3. **Accessibility & Inclusivity**

**Principle**: Content should be understandable to the target persona while maintaining technical accuracy.

**Reading Levels by Content Type**:
- **Beginner Guides**: 8th grade reading level
- **Scientific References**: 10-12th grade (acceptable technical terminology)
- **Professional Content**: College level acceptable

**Inclusive Language**:
- Avoid coffee snobbery or elitism
- Welcome all experience levels
- Use gender-neutral language
- Avoid cultural stereotypes about origins
- Respect producer and origin diversity

### 4. **Continuous Improvement**

**Principle**: Content is never "done"—regularly update based on new research, user feedback, and evolving standards.

**Update Triggers**:
- New scientific research published
- Changes to industry standards (SCA protocols, etc.)
- User feedback indicating confusion or errors
- Quarterly content audits revealing gaps
- Automated CI/QA script failures

---

## 📝 Content Standards by Entity Type

### Coffee Logs (User-Generated)

**Required Fields**:
- `type: coffee-log`
- `date: YYYY-MM-DD`
- `beans: [[Bean Profile Link]]`
- `method: brew-method`
- `rating: 1-5`

**Optional but Recommended**:
- Grind size, water temperature, brew time, coffee dose, water dose
- Tasting notes, flavor descriptors
- Photos or attachments
- Environmental notes (water source, etc.)

**Quality Standards**:
- Dates must be valid and in ISO format
- Ratings must be 1-5 (integers or .5 increments)
- Links to beans/equipment should resolve
- Avoid duplicate logs (same date, time, beans)

**Validation**: Automated via `vault-ci.js`

---

### Bean Profiles (Curated Content)

**Required Fields**:
```yaml
type: bean-profile
origin: [[Origin Profile Link]]
variety: botanical-variety
process: washed|natural|honey|anaerobic|etc
altitude: MASL-range
cupping-score: 82-100
flavor-notes: [primary, descriptors, list]
```

**Content Requirements**:
- **Minimum 300 words** including description, flavor profile, brewing recommendations
- **Verified Information**: Cross-check with roaster, importer, or producer
- **Sensory Description**: Use SCA flavor wheel terminology
- **Brewing Guidance**: Recommend suitable methods and parameters
- **Sourcing Context**: Link to origin, producer if known, and processing details

**Quality Checks**:
- Altitude ranges valid for origin region
- Flavor notes match process type expectations
- Cupping scores reasonable (specialty: 80+)
- All wikilinks resolve

**Review Cycle**: Annual or when new crop information available

---

### Scientific References (Expert Content)

**Required Fields**:
```yaml
type: scientific-reference
category: extraction|chemistry|roasting|etc
difficulty: beginner|intermediate|advanced
priority: high|medium|low
sources: [citations, or references]
```

**Content Requirements**:
- **Minimum 800 words, target 1,200-1,500 words**
- **Structured Sections**:
  - Overview (2-3 paragraphs)
  - Key Concepts (3-5 major topics)
  - The Science (technical deep-dive)
  - Practical Applications
  - Common Misconceptions
  - Related Concepts (5-10 wikilinks)
  - Summary (3-5 bullet points)
- **Citations**: Minimum 2 reputable sources per note
- **Dataview Integration**: Query showing related logs/recipes using concepts

**Writing Standards**:
- Technical accuracy paramount
- Explain jargon on first use
- Use analogies for complex concepts
- Include formulas where relevant (extraction yield, TDS, etc.)
- Avoid oversimplification that misleads

**Review Cycle**: Biannual or when new research published

---

### Origin Profiles (Geographic Content)

**Required Fields**:
```yaml
type: origin-profile
region: country-or-region
coordinates: [lat, lon]
elevation: altitude-range-MASL
climate: climate-description
harvest-season: month-to-month
```

**Content Requirements**:
- **Minimum 500 words**
- **Geographic Context**: Location, elevation, climate, soil
- **Coffee Characteristics**: Typical flavor profiles, varieties grown
- **Cultural Context**: Coffee history in region, farming practices
- **Production Data**: Approximate annual output, export statistics
- **Challenges**: Climate change impacts, economic factors, pests/diseases

**Sources**:
- World Coffee Research
- International Coffee Organization (ICO)
- Country-specific coffee associations
- Academic agricultural research

**Review Cycle**: Biannual

---

### Producer Profiles (Supply Chain Content)

**Required Fields**:
```yaml
type: producer-profile
producer-type: farm|cooperative|washing-station
location: [[Origin Link]]
established: year
certifications: [organic, fair-trade, etc]
```

**Content Requirements**:
- **Minimum 400 words**
- **Overview**: History, size, ownership structure
- **Production**: Annual output, varieties grown, processing capabilities
- **Sustainability**: Environmental practices, social programs
- **Quality**: Cupping scores, awards, recognition
- **Relationships**: Links to roasters, importers (if public information)

**Ethical Considerations**:
- Respect producer privacy (don't publish sensitive information)
- Verify certifications before listing
- Update relationship status regularly
- Accurately represent producer scale and capabilities

**Review Cycle**: Annual

---

### Brewing Guides (Instructional Content)

**Required Fields**:
```yaml
type: brewing-guide
method: v60|chemex|aeropress|espresso|etc
difficulty: beginner|intermediate|advanced
time-minutes: total-brew-time
equipment-required: [list]
```

**Content Requirements**:
- **Step-by-Step Instructions**: Numbered, clear, actionable
- **Visual Aids**: Diagrams or photos recommended
- **Troubleshooting**: Common mistakes and how to fix them
- **Variation Notes**: How to adjust for different beans/roasts
- **Science Integration**: Links to relevant extraction/brewing science references

**Writing Style**:
- Imperative voice ("Pour water in circular motion")
- Precise measurements and timings
- Anticipate questions and address them
- Assume beginner level unless marked advanced

**Review Cycle**: Biannual or when technique evolves

---

## ✅ Quality Assurance Process

### Pre-Publication Checklist

**Before creating new content:**
- [ ] Check if similar content exists (avoid duplication)
- [ ] Verify entity type matches ontology (VAULT-ONTOLOGY.md)
- [ ] Use appropriate template from Templates/
- [ ] Complete all required YAML frontmatter
- [ ] Write minimum word count for entity type
- [ ] Include 5-10 bidirectional wikilinks
- [ ] Add tags following 6-level hierarchy
- [ ] Proofread for spelling, grammar, clarity
- [ ] Verify all links resolve
- [ ] Run `vault-ci.js` to check compliance

**Scientific Content Additional Checks:**
- [ ] Minimum 2 citations or references included
- [ ] Technical accuracy verified
- [ ] Formulas correct (if applicable)
- [ ] Dataview query included and tested

**Persona-Specific Content:**
- [ ] Appropriate reading level for target persona
- [ ] Tone matches persona needs (encouraging for novice, technical for professional)

### Post-Publication Review

**Within 7 Days:**
1. Peer review (if collaborative vault)
2. User feedback collection (if applicable)
3. Link integrity check
4. Search indexing verification
5. Dataview query performance test

**Within 30 Days:**
1. Usage analytics (views, queries referencing note)
2. Quality score assessment (completeness, accuracy, usefulness)
3. Integration check (how well it connects to knowledge graph)

---

## 📅 Update Cadence

### Daily
- **Coffee Logs**: User-generated, continuous
- **Cupping Sessions**: As events occur
- **Equipment Logs**: Maintenance and usage

### Weekly
- **Goals**: Progress updates
- **Inventory**: Bean stock status
- **Analytics**: Review automated reports

### Monthly
- **New Content**: 2-5 new scientific references per month (based on gap analysis)
- **Brewing Guides**: Review one guide per month
- **Roaster Profiles**: Add 3-5 new roasters

### Quarterly
- **Scientific References**: Update top 20 most-viewed notes
- **Origin Profiles**: Review and update production data
- **Governance Review**: Review this document for needed updates

### Annually
- **Complete Audit**: All scientific references reviewed for accuracy
- **Producer Profiles**: Verify certifications and contact information
- **Bean Library**: Remove discontinued beans, add new crops
- **System Upgrade**: Major version updates (v6 → v7)

---

## 📚 Sourcing Standards

### Citation Formats

**Peer-Reviewed Research:**
```
Author, A. A. (Year). Title of paper. Journal Name, Volume(Issue), Pages.
```

**Books:**
```
Author, A. A. (Year). Book Title. Publisher.
```

**Industry Publications:**
```
Organization. (Year). Title of Publication. URL (if online)
```

**Expert Interviews:**
```
Expert Name, Title/Affiliation (Interview Date)
Note: "Personal communication with [Expert Name], Q Grader and coffee scientist, October 2025"
```

### Source Quality Hierarchy

**Tier 1 - Authoritative (Prefer These)**:
- Peer-reviewed coffee science journals
- SCA and World Coffee Research publications
- Academic textbooks on coffee
- Government agricultural research
- Established coffee science experts (e.g., Dr. Samo Smrke, James Hoffmann for practical)

**Tier 2 - Reputable (Good for General Info)**:
- Coffee Review, Barista Magazine, Perfect Daily Grind
- Manufacturer white papers (verified independently)
- Established coffee educators (reputable courses)
- Trade association publications

**Tier 3 - Use with Caution**:
- Coffee forums (r/Coffee, Home-Barista.com) — attribute to source
- Personal blogs (if expert-authored)
- Marketing materials (verify claims)

**Tier 4 - Avoid or Mark Clearly**:
- Unverified social media claims
- Anecdotal evidence without corroboration
- Marketing hype without substance
- Myths and coffee folklore (can document but debunk)

### When Sources Conflict

If reputable sources disagree:
1. Present both perspectives
2. Note the disagreement explicitly
3. Explain possible reasons (methodology, interpretation, context)
4. Recommend further reading
5. Update as consensus emerges

---

## 👥 Contributor Guidelines

### Single-User Vault

**You are both creator and curator:**
- Maintain consistent style and tone
- Follow templates rigorously
- Run QA scripts before committing changes
- Review your own work after 24 hours (fresh eyes)

### Collaborative Vault

**Roles & Responsibilities**:
- **Curator**: Reviews new content, ensures quality
- **Contributors**: Create content following standards
- **Technical Admin**: Manages automation, templates, plugins
- **Community Manager**: Gathers feedback, manages discussions (if public)

**Contribution Workflow**:
1. Contributor creates content using templates
2. Submits for review (Git PR or designated review process)
3. Curator reviews against checklist
4. Approve → Merge, or Request Changes → Revise
5. Post-merge: Automated CI/QA scripts run
6. Community feedback collected

### Attribution

**Collaborative Vaults:**
- Maintain contributor list in README
- Credit major contributions in note frontmatter: `author: [Name]`
- Respect intellectual property (don't plagiarize)

---

## 🔄 Review & Approval Workflow

### Self-Review Process (Single User)

**Before Saving:**
1. Spell check
2. Readability check (Hemingway App or similar)
3. Link validation (click every link)
4. Preview mode review
5. Mobile view check (if using Obsidian mobile)

**Before Committing (Git):**
1. Run `node Scripts/vault-ci.js`
2. Fix errors and warnings
3. Review changed files list
4. Write descriptive commit message
5. Commit

**Weekly Batch Review:**
1. Review all notes created/modified this week
2. Check for consistency
3. Ensure integration with knowledge graph
4. Verify dataview queries perform well

### Collaborative Review Process

**Lightweight Review (Minor Edits):**
- Quick proofreading by any contributor
- Approve if no issues
- Deploy immediately

**Standard Review (New Content):**
- Curator review against checklist
- 1-2 business day turnaround
- Approve or Request Changes
- Deploy after approval

**Rigorous Review (Major Changes):**
- Multiple curator review
- Technical expert review (for scientific content)
- Community feedback period (1 week)
- Consensus approval required
- Deploy after final approval

---

## 🛠️ Maintenance Procedures

### Routine Maintenance (Monthly)

**Automated (via scripts):**
```bash
# Run CI/QA suite
node Scripts/vault-ci.js --report-only

# Check accessibility
node Scripts/accessibility-audit.js

# Generate health report
node Scripts/daily-report-generator.js

# Identify orphaned files
# Check broken links
# Validate frontmatter
```

**Manual Review:**
1. Review QA reports from scripts
2. Fix high-priority issues (broken links, orphans)
3. Update outdated content (top 10 most-viewed notes)
4. Add new content based on gap analysis

### Quarterly Audit (Deep Maintenance)

**Content Audit:**
1. Run full vault statistics
2. Identify underutilized notes (low views, no links)
3. Identify missing content (gaps in ontology coverage)
4. Review content quality scores
5. Create action plan for next quarter

**Technical Audit:**
1. Review plugin versions and update if needed
2. Test all automation scripts
3. Optimize slow dataview queries
4. Check visualization performance
5. Clean up obsolete files

**User Experience Audit:**
1. Test user journeys (run user-journey-simulator.js)
2. Review persona dashboard effectiveness
3. Check navigation efficiency (≤3 clicks)
4. Mobile experience testing
5. Accessibility compliance verification

---

## 📈 Content Lifecycle

### Stage 1: Planning
- Identify content need (from gap analysis)
- Research topic thoroughly
- Gather sources and references
- Outline structure
- Choose appropriate template

### Stage 2: Creation
- Draft content following standards
- Include required frontmatter
- Add bidirectional links
- Insert dataview queries
- Proofread and self-review

### Stage 3: Review
- Run QA scripts
- Peer review (if collaborative)
- Revise based on feedback
- Final approval

### Stage 4: Publication
- Add to vault
- Link from relevant hub notes
- Update index pages
- Announce (if collaborative/public)

### Stage 5: Maintenance
- Monitor usage and feedback
- Update when new information available
- Refresh annually during audit
- Expand based on user needs

### Stage 6: Archival (If Needed)
- Mark as deprecated if outdated
- Redirect links to updated content
- Move to archive folder (don't delete)
- Document why archived

---

## 📊 Metrics & KPIs

### Content Quality Metrics

**Completeness Score (0-100):**
- All required fields: +40
- Recommended fields: +20
- Minimum word count: +10
- Bidirectional links (5+): +10
- Citations/sources (2+): +10
- Dataview query: +10

**Target**: >80 for all notes

### Vault Health Metrics

**From `daily-report-generator.js`:**
- **Total Notes**: Track growth over time (target: +50/month)
- **Broken Links**: <1% of total links
- **Orphaned Files**: <10% of total files
- **Ontology Coverage**: >90% (all entity types represented)
- **Health Score**: >70/100 (composite of above metrics)

### User Experience Metrics

**From `user-journey-simulator.js`:**
- **Navigation Efficiency**: All journeys ≤3 clicks
- **Journey Success Rate**: 100% (all journeys completable)
- **Template Usage**: >80% of notes use templates

### Content Coverage Metrics

**By Category:**
- **Scientific References**: 150+ notes (current: 179 ✅)
- **Bean Profiles**: 100+ notes
- **Origin Profiles**: 50+ notes
- **Brewing Guides**: 25+ notes
- **Producer Profiles**: 50+ notes

**Gap Analysis:**
- Run quarterly gap analysis
- Prioritize top 20 missing topics
- Create content plan for next quarter

### Performance Metrics

**From automation scripts:**
- **Script Execution Time**: <5 seconds for CI scripts
- **Dataview Query Performance**: <500ms average
- **Dashboard Render Time**: <1 second
- **3D Visualization FPS**: 60 FPS (on reference hardware)

---

## 🎯 Continuous Improvement

### Feedback Loops

**Automated Feedback:**
- CI/QA scripts provide immediate quality feedback
- Performance monitoring identifies slow queries
- Analytics show which content is most useful

**Manual Feedback:**
- User testing with personas (if collaborative)
- Personal usage patterns (what do you reference most?)
- Community feedback (if public)

### Iteration Cycle

**Weekly:** Review metrics, fix critical issues
**Monthly:** Implement small improvements based on feedback
**Quarterly:** Major feature additions or refactors
**Annually:** Strategic reassessment and major version updates

---

## 📖 Appendices

### A. Approved Terminology

**Use Standard Terms Consistently:**
- "Cupping" not "Tasting" (for formal SCA protocol)
- "Brewing" not "Making" or "Preparation"
- "Extraction" not "Brewing" (when referring to the chemical process)
- "TDS" (Total Dissolved Solids) not "Strength"
- "Yield" not "Extraction Percentage" (though both acceptable)

### B. Style Guide

**Dates**: ISO 8601 (YYYY-MM-DD)
**Temperatures**: Celsius (with Fahrenheit in parentheses on first use)
**Weights**: Grams (with ounces in parentheses if helpful)
**Time**: 24-hour format or AM/PM
**Abbreviations**: Define on first use

### C. Conflict Resolution

**If Standards Conflict with Usability:**
- Usability wins for user-facing content
- Standards win for metadata and automation

**If New Research Contradicts Vault Content:**
- Update content promptly
- Note the change in frontmatter: `last-updated-reason: new-research-2025`
- Link to research source

---

## 🌟 Summary

Content governance ensures Coffee Vault remains:
- **Accurate**: Verified, cited, scientifically sound
- **Accessible**: Clear writing, appropriate reading levels
- **Complete**: Comprehensive coverage of coffee knowledge
- **Consistent**: Unified templates, standards, terminology
- **Current**: Regular updates, reflects latest research
- **Quality**: High standards maintained through QA processes

**Everyone's Responsibility:**
- Follow templates
- Run QA scripts
- Maintain accuracy
- Write clearly
- Link bidirectionally
- Update regularly

---

**Coffee Vault 6.0** - Content Governance Framework
**Version**: 6.0.0
**Last Updated**: 2025-11-06
**Review Cycle**: Quarterly
**Next Review**: 2026-02-06
**Status**: Active Standard
