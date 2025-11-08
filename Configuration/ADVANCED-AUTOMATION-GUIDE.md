# Advanced Automation Guide

**Version**: 1.0.0
**Last Updated**: 2025-11-08
**Coffee Vault Version**: 7.0

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Core Automation Scripts](#core-automation-scripts)
   - [Link Suggester AI](#link-suggester-ai)
   - [Duplicate Detector](#duplicate-detector)
   - [Content Quality Scorer](#content-quality-scorer)
   - [Auto-Tagger](#auto-tagger)
   - [Scheduled Maintenance](#scheduled-maintenance)
4. [Configuration](#configuration)
5. [Usage Examples](#usage-examples)
6. [Scheduling & Automation](#scheduling--automation)
7. [Interpreting Reports](#interpreting-reports)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Overview

Coffee Vault 7.0 includes a comprehensive suite of intelligent automation tools that enhance content management, improve vault quality, and reduce manual maintenance burden. These tools use advanced algorithms including:

- **TF-IDF keyword extraction**
- **Content similarity analysis** (Jaccard coefficient, Levenshtein distance)
- **Entity recognition** (beans, origins, methods)
- **Tag hierarchy validation**
- **Quality scoring algorithms**

### What's New in 7.0

The advanced automation suite includes 4 new intelligent scripts:

1. **Link Suggester AI** - Intelligent bidirectional link suggestions based on content analysis
2. **Duplicate Detector** - Finds near-duplicate content that should be merged
3. **Content Quality Scorer** - Rates each note's quality (0-100) with actionable feedback
4. **Auto-Tagger** - Suggests relevant tags based on content and hierarchy
5. **Scheduled Maintenance** - Orchestrates all automation in coordinated workflows

---

## Getting Started

### Prerequisites

- Node.js 16.0.0 or higher
- Coffee Vault installed and configured
- npm dependencies installed

### Installation

All scripts are pre-installed in the `Scripts/` directory. To verify:

```bash
cd Scripts
npm install
npm test
```

### Quick Start

Run a single script:

```bash
cd Scripts
npm run suggest-links        # Link suggestions
npm run detect-duplicates    # Find duplicates
npm run score-quality        # Quality scoring
npm run auto-tag             # Tag suggestions
```

Run scheduled maintenance:

```bash
npm run maintenance:daily    # Daily tasks
npm run maintenance:weekly   # Weekly tasks
npm run maintenance:monthly  # Monthly comprehensive
```

---

## Core Automation Scripts

### Link Suggester AI

**Script**: `link-suggester-ai.js`
**Purpose**: Intelligently suggest bidirectional links based on semantic content analysis.

#### Features

- Analyzes note content using TF-IDF keyword extraction
- Matches entities (beans, origins, methods) between notes
- Calculates tag overlap
- Computes content similarity using cosine similarity
- Generates confidence scores (0-100) with rationale

#### Usage

```bash
# Analyze entire vault
node link-suggester-ai.js --all

# Analyze single file
node link-suggester-ai.js --file "Scientific References/Espresso-Extraction-Science.md"

# Set minimum confidence threshold
node link-suggester-ai.js --min-confidence 80

# Dry run mode (preview changes)
node link-suggester-ai.js --dry-run

# Auto-add high-confidence links (>90)
node link-suggester-ai.js --auto-add

# Generate report only (default)
node link-suggester-ai.js --report-only
```

#### Algorithm

```javascript
confidence_score = (entity_overlap × 20) + (tag_overlap × 15) + (keyword_similarity × 50)
```

Where:
- **Entity overlap**: Shared beans, origins, methods (20 pts per match)
- **Tag overlap**: Shared tags (15 pts per tag)
- **Keyword similarity**: Jaccard coefficient of top keywords (0-50 pts)

#### Configuration

In `.vault-meta/automation-config.json`:

```json
{
  "linkSuggestion": {
    "enabled": true,
    "minConfidence": 70,
    "autoAddThreshold": 90,
    "excludeFolders": ["Templates", ".obsidian"],
    "entityWeight": 20,
    "tagWeight": 15,
    "keywordWeight": 50,
    "maxSuggestionsPerNote": 10
  }
}
```

#### Output

Report saved to: `.vault-meta/reports/link-suggestions-YYYYMMDD.md`

Example:

```markdown
## Scientific References/Espresso-Extraction-Science.md

### High Confidence Suggestions (>90)
- [95] → [[Espresso-Dialing-In-Framework]]
  Rationale: Shares 3 entities (espresso, TDS, yield), 5 shared tags, 78% keyword overlap
```

---

### Duplicate Detector

**Script**: `duplicate-detector.js`
**Purpose**: Find near-duplicate or redundant content that should be merged.

#### Features

- Content similarity using Jaccard coefficient
- Title similarity using Levenshtein distance
- Frontmatter comparison
- Diff preview generation
- Merge recommendations

#### Usage

```bash
# Detect duplicates with default threshold (80%)
node duplicate-detector.js

# Custom similarity threshold
node duplicate-detector.js --threshold 85

# Ignore template files
node duplicate-detector.js --ignore-templates

# Check specific entity type only
node duplicate-detector.js --entity-type scientific-reference

# Report only (default)
node duplicate-detector.js --report-only

# Auto-merge perfect duplicates (100% similar) - NOT YET IMPLEMENTED
node duplicate-detector.js --auto-merge
```

#### Algorithm

```javascript
overall_similarity = (content_similarity × 0.7) + (title_similarity × 0.2) + (frontmatter_similarity × 0.1)
```

Where:
- **Content similarity**: Jaccard coefficient of word sets
- **Title similarity**: Normalized Levenshtein distance
- **Frontmatter similarity**: Field-by-field comparison

#### Configuration

```json
{
  "duplicateDetection": {
    "enabled": true,
    "similarityThreshold": 80,
    "ignoreTemplates": true,
    "autoMergePerfectDuplicates": false,
    "minContentLength": 100
  }
}
```

#### Output

Report saved to: `.vault-meta/reports/duplicates-YYYYMMDD.md`

Example:

```markdown
### Perfect Duplicates (≥95% similar)

#### Espresso-Extraction-V1 ⟷ Espresso-Extraction-V2

**Similarity**: 96% (Title: 87%, Content: 98%, Frontmatter: 95%)

**Files**:
1. `Scientific References/Espresso-Extraction-V1.md` (324 words)
2. `Scientific References/Espresso-Extraction-V2.md` (318 words)

**Recommendation**: 🔀 Merge these files
```

---

### Content Quality Scorer

**Script**: `content-quality-scorer.js`
**Purpose**: Rate each note's quality (0-100) based on multiple factors.

#### Quality Factors

1. **Completeness (30 pts)**
   - All required frontmatter fields present
   - Meets minimum word count
   - Has summary/conclusion section

2. **Connectivity (25 pts)**
   - Number of outgoing links
   - Number of incoming links (backlinks)
   - Part of knowledge graph (not orphaned)

3. **Citations (20 pts)** - For scientific content only
   - Has citations/sources section
   - Number of citations
   - Links to external sources

4. **Freshness (10 pts)**
   - Recently updated (last 90 days: 10 pts, 180 days: 5 pts, older: 0 pts)

5. **Engagement (10 pts)**
   - Backlinks as proxy for engagement

6. **Readability (5 pts)**
   - Proper formatting (headers, lists)
   - No walls of text

#### Usage

```bash
# Score all notes
node content-quality-scorer.js

# Verbose output
node content-quality-scorer.js --verbose
```

#### Configuration

```json
{
  "qualityScoring": {
    "enabled": true,
    "weights": {
      "completeness": 30,
      "connectivity": 25,
      "citations": 20,
      "freshness": 10,
      "engagement": 10,
      "readability": 5
    },
    "thresholds": {
      "excellent": 90,
      "good": 70,
      "needsImprovement": 50
    }
  }
}
```

#### Output

Report saved to: `.vault-meta/reports/quality-scores-YYYYMMDD.md`

Example:

```markdown
## Top 10 Highest Quality Notes

### 1. Espresso-Extraction-Science (94/100)

**Path**: `Scientific References/Espresso-Extraction-Science.md`
**Type**: scientific-reference

**Breakdown**:
- Completeness: 30/30
- Connectivity: 24/25
- Citations: 20/20
- Freshness: 10/10
- Engagement: 8/10
- Readability: 5/5
```

---

### Auto-Tagger

**Script**: `auto-tagger.js`
**Purpose**: Suggest relevant tags based on content analysis.

#### Features

- Content keyword extraction
- Entity type-based suggestions
- Tag hierarchy validation (6-level structure)
- Similar notes analysis
- Confidence scoring (0-100)

#### Usage

```bash
# Generate tag suggestions
node auto-tagger.js --dry-run

# Auto-apply high-confidence tags (>90) - NOT YET IMPLEMENTED
node auto-tagger.js --auto-apply

# Custom confidence threshold
node auto-tagger.js --confidence-threshold 80

# Respect tag hierarchy (default)
node auto-tagger.js --respect-hierarchy
```

#### Tag Hierarchy

Tags follow a 6-level hierarchy:

```
entity/coffee-log → brewing, tasting, evaluation
entity/bean-profile → coffee, beans, origin
method/espresso → brewing, espresso, pressure
science/extraction → science, brewing, chemistry
```

#### Configuration

```json
{
  "autoTagging": {
    "enabled": true,
    "confidenceThreshold": 75,
    "respectHierarchy": true,
    "autoApply": false,
    "maxSuggestionsPerNote": 5
  }
}
```

#### Output

Report saved to: `.vault-meta/reports/auto-tagging-YYYYMMDD.md`

Example:

```markdown
### Espresso-Extraction-Science

**Current tags**: science, extraction

#### High Confidence (≥90)
- [92] `science/chemistry`
  - Rationale: Keyword match: "chemistry"

- [88] `method/espresso`
  - Rationale: Used by 12/15 similar notes
```

---

### Scheduled Maintenance

**Script**: `scheduled-maintenance.js`
**Purpose**: Orchestrate all automation scripts in a coordinated workflow.

#### Workflow

1. Run CI checks (`vault-ci.js`)
2. Check content quality (`content-quality-scorer.js`)
3. Suggest links (`link-suggester-ai.js`)
4. Detect duplicates (`duplicate-detector.js`)
5. Suggest tags (`auto-tagger.js`)
6. Generate accessibility report (`accessibility-audit.js`)
7. Generate daily report (`daily-report-generator.js`)
8. Generate combined summary report

#### Usage

```bash
# Daily maintenance (CI, quality, links, daily report)
node scheduled-maintenance.js --schedule daily

# Weekly maintenance (all tasks except monthly-specific)
node scheduled-maintenance.js --schedule weekly

# Monthly comprehensive maintenance (all tasks)
node scheduled-maintenance.js --schedule monthly

# Run specific tasks only
node scheduled-maintenance.js --tasks ci,quality,links
```

#### Configuration

```json
{
  "scheduledMaintenance": {
    "enabled": false,
    "schedules": {
      "daily": {
        "enabled": false,
        "time": "09:00",
        "tasks": ["ci", "quality", "links", "daily"]
      },
      "weekly": {
        "enabled": false,
        "dayOfWeek": "monday",
        "time": "09:00",
        "tasks": ["ci", "quality", "links", "duplicates", "tags", "accessibility", "daily"]
      },
      "monthly": {
        "enabled": false,
        "dayOfMonth": 1,
        "time": "09:00",
        "tasks": ["ci", "quality", "links", "duplicates", "tags", "accessibility", "daily"]
      }
    }
  }
}
```

#### Output

Report saved to: `.vault-meta/reports/maintenance-{schedule}-YYYYMMDD.md`

---

## Configuration

### Global Configuration File

All automation settings are centralized in `.vault-meta/automation-config.json`.

### Editing Configuration

1. Open `.vault-meta/automation-config.json`
2. Edit settings under the appropriate section
3. Save the file
4. Re-run scripts to apply new settings

### Key Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `linkSuggestion.minConfidence` | 70 | Minimum confidence for link suggestions (0-100) |
| `linkSuggestion.autoAddThreshold` | 90 | Auto-add links above this threshold |
| `duplicateDetection.similarityThreshold` | 80 | Minimum similarity to flag as duplicate (%) |
| `qualityScoring.thresholds.excellent` | 90 | Threshold for "excellent" quality rating |
| `autoTagging.confidenceThreshold` | 75 | Minimum confidence for tag suggestions |
| `autoTagging.respectHierarchy` | true | Only suggest tags that fit hierarchy |

---

## Usage Examples

### Example 1: Weekly Vault Cleanup

```bash
# Step 1: Run quality scoring to find low-quality notes
npm run score-quality

# Step 2: Detect duplicates
npm run detect-duplicates

# Step 3: Suggest links for orphaned files
npm run suggest-links --min-confidence 80

# Step 4: Review reports in .vault-meta/reports/
```

### Example 2: New Content Validation

After adding new scientific references:

```bash
# Step 1: Suggest tags based on content
npm run auto-tag --confidence-threshold 85

# Step 2: Suggest relevant links
npm run suggest-links --min-confidence 75

# Step 3: Run quality check
npm run score-quality
```

### Example 3: Monthly Comprehensive Review

```bash
# Run all maintenance tasks
npm run maintenance:monthly

# Review combined summary report
cat .vault-meta/reports/maintenance-monthly-YYYYMMDD.md
```

---

## Scheduling & Automation

### Setting Up Scheduled Tasks

#### On Linux/macOS (cron)

Edit crontab:

```bash
crontab -e
```

Add scheduled tasks:

```cron
# Daily at 9 AM
0 9 * * * cd /path/to/coffee-vault/Scripts && npm run maintenance:daily

# Weekly on Monday at 9 AM
0 9 * * 1 cd /path/to/coffee-vault/Scripts && npm run maintenance:weekly

# Monthly on 1st at 9 AM
0 9 1 * * cd /path/to/coffee-vault/Scripts && npm run maintenance:monthly
```

#### On Windows (Task Scheduler)

1. Open Task Scheduler
2. Create New Task
3. Set trigger (daily/weekly/monthly)
4. Action: Start a program
   - Program: `node`
   - Arguments: `scheduled-maintenance.js --schedule daily`
   - Start in: `C:\path\to\coffee-vault\Scripts`

---

## Interpreting Reports

### Link Suggestions Report

**Location**: `.vault-meta/reports/link-suggestions-YYYYMMDD.md`

**Key Sections**:
- **Summary**: Total files, suggestions, high/medium confidence counts
- **High Confidence (>90)**: Add these links immediately
- **Medium Confidence (70-90)**: Review and add if relevant

**Action**:
1. Review high-confidence suggestions
2. Manually add relevant wikilinks to notes
3. Re-run script to verify suggestions decrease

### Duplicate Detection Report

**Location**: `.vault-meta/reports/duplicates-YYYYMMDD.md`

**Key Sections**:
- **Perfect Duplicates (≥95%)**: Merge immediately
- **Near Duplicates (80-95%)**: Review manually
- **Diff**: Shows unique lines in each file

**Action**:
1. Compare files side-by-side
2. Consolidate content into single note
3. Update all links pointing to old note
4. Delete redundant file

### Quality Scores Report

**Location**: `.vault-meta/reports/quality-scores-YYYYMMDD.md`

**Key Sections**:
- **Summary**: Average scores, distribution
- **Top 10**: Best examples to emulate
- **Bottom 10**: Notes needing improvement

**Action**:
1. Focus on bottom 10 notes
2. Review improvement suggestions
3. Add missing frontmatter fields
4. Expand content, add links, citations
5. Re-run scorer to track improvement

### Auto-Tagging Report

**Location**: `.vault-meta/reports/auto-tagging-YYYYMMDD.md`

**Key Sections**:
- **Summary**: Notes with suggestions, confidence breakdown
- **High Confidence (≥90)**: Add these tags
- **Medium Confidence (75-89)**: Review before adding

**Action**:
1. Review high-confidence tag suggestions
2. Add relevant tags to frontmatter
3. Verify tags fit hierarchy
4. Re-run tagger to reduce suggestions

---

## Best Practices

### 1. Start with Reports

Always run scripts in **report-only** mode first:

```bash
npm run suggest-links --report-only
npm run detect-duplicates --report-only
```

Review reports before making any automated changes.

### 2. Incremental Adoption

Don't try to fix everything at once:

1. Week 1: Focus on high-confidence link suggestions (>90)
2. Week 2: Merge perfect duplicates (>95%)
3. Week 3: Improve bottom 10 quality scores
4. Week 4: Add high-confidence tags (>90)

### 3. Regular Maintenance Schedule

Establish a routine:

- **Daily**: CI checks, quality scoring (automated)
- **Weekly**: Link suggestions, duplicate detection (manual review)
- **Monthly**: Comprehensive review with all tools

### 4. Monitor Trends

Track improvement over time:

- Compare quality score averages month-over-month
- Monitor decrease in duplicate pairs
- Track increase in average link density

### 5. Customize Thresholds

Adjust thresholds based on your vault:

- Start conservative (high thresholds)
- Lower thresholds as vault matures
- Increase thresholds for auto-apply features

---

## Troubleshooting

### Script Fails to Run

**Error**: `Cannot find module`

**Solution**:
```bash
cd Scripts
npm install
```

### No Suggestions Generated

**Issue**: Scripts run but generate no suggestions

**Possible Causes**:
1. Confidence threshold too high
2. Vault already well-organized
3. Exclude folders covering most content

**Solution**:
- Lower confidence threshold: `--min-confidence 60`
- Check `.vault-meta/automation-config.json` exclude folders
- Run with `--verbose` to see detailed output

### Report Not Generated

**Issue**: Script runs successfully but no report saved

**Solution**:
1. Check `.vault-meta/reports/` directory exists
2. Verify write permissions
3. Look for error messages in console output

### Performance Issues

**Issue**: Scripts run very slowly on large vaults

**Solution**:
- Run on specific folders: `--entity-type scientific-reference`
- Increase `performance.maxConcurrentFiles` in config
- Run during off-hours
- Consider incremental runs (e.g., one entity type per day)

### High False Positive Rate

**Issue**: Suggestions/duplicates don't seem relevant

**Solution**:
- Increase confidence threshold
- Adjust weights in configuration:
  ```json
  {
    "linkSuggestion": {
      "entityWeight": 25,    // Increase entity importance
      "keywordWeight": 40    // Decrease keyword importance
    }
  }
  ```

### Auto-Features Not Working

**Issue**: `--auto-add` or `--auto-apply` not working

**Note**: These features are **not yet implemented** in v1.0. Use dry-run mode and manual review for now.

---

## Advanced Topics

### Custom Tag Hierarchies

Edit `TAG_HIERARCHY` in `auto-tagger.js` to add custom tags:

```javascript
const TAG_HIERARCHY = {
  'entity/custom-type': ['custom', 'tags', 'here'],
  // ... existing tags
};
```

### Extending Quality Scoring

Add custom quality factors in `content-quality-scorer.js`:

```javascript
function scoreCustomFactor(note) {
  // Your custom scoring logic
  return { score: 0-10, details: [] };
}
```

### Integration with CI/CD

Add to `.github/workflows/vault-ci.yml`:

```yaml
- name: Run Quality Checks
  run: |
    cd Scripts
    npm run score-quality
    npm run detect-duplicates
```

---

## Getting Help

### Resources

- Configuration: `.vault-meta/automation-config.json`
- Reports: `.vault-meta/reports/`
- Scripts: `Scripts/`
- Documentation: `Configuration/ADVANCED-AUTOMATION-GUIDE.md` (this file)

### Common Questions

**Q: Can I run scripts on specific folders only?**
A: Yes, use `--entity-type` parameter or edit `excludeFolders` in config.

**Q: How do I disable a script?**
A: Set `"enabled": false` for that script in `automation-config.json`.

**Q: Are my files safe? Will scripts modify them?**
A: By default, scripts run in **report-only** mode. They only generate reports, never modify files unless you explicitly use `--auto-add` or `--auto-apply` flags (which are not yet implemented in v1.0).

**Q: How often should I run maintenance?**
A: Daily for CI/quality checks, weekly for link/tag suggestions, monthly for comprehensive review.

---

## Version History

### v1.0.0 (2025-11-08)
- Initial release
- Link Suggester AI
- Duplicate Detector
- Content Quality Scorer
- Auto-Tagger
- Scheduled Maintenance orchestrator

---

**End of Guide**

For additional help, check individual script headers or configuration file comments.
