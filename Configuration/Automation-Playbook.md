---
title: Coffee Vault Automation Playbook
type: documentation
category: automation
version: 1.0
date: 2025-11-06
status: comprehensive
tags: [automation, documentation, ci-cd, quality-assurance, testing]
---

# Coffee Vault Automation Playbook

**Version**: 1.0.0
**Last Updated**: 2025-11-06
**Maintainer**: Automation Engineering Team

This playbook provides comprehensive documentation for the Coffee Vault 6.0 automation infrastructure, including setup instructions, usage guides, and best practices.

---

## Table of Contents

1. [Overview](#overview)
2. [Installation & Setup](#installation--setup)
3. [Script Reference](#script-reference)
4. [Configuration](#configuration)
5. [Usage Examples](#usage-examples)
6. [CI/CD Integration](#cicd-integration)
7. [Troubleshooting](#troubleshooting)
8. [Best Practices](#best-practices)

---

## Overview

### Automation Suite Components

The Coffee Vault automation infrastructure consists of four primary scripts:

| Script | Purpose | Frequency | Exit Codes |
|--------|---------|-----------|------------|
| `vault-ci.js` | Continuous Integration validation | On commit / Daily | 0=pass, 1=warnings, 2=errors |
| `accessibility-audit.js` | WCAG 2.1 AA compliance checker | Weekly / On HTML changes | 0=pass, 1=issues, 2=critical |
| `daily-report-generator.js` | Daily vault health dashboard | Daily (9 AM UTC) | 0=success, 1=failure |
| `user-journey-simulator.js` | Navigation testing | Before releases / Weekly | 0=pass, 1=warnings, 2=failed |

### Key Features

- ✅ **Automated Quality Assurance**: Static analysis, link validation, frontmatter checking
- ♿ **Accessibility Compliance**: WCAG 2.1 AA/AAA standards verification
- 📊 **Health Monitoring**: Daily vault statistics and coverage metrics
- 🚀 **User Experience Testing**: Simulated user journeys and navigation paths
- 📝 **Comprehensive Reporting**: Markdown reports with charts and actionable todos

---

## Installation & Setup

### Prerequisites

```bash
# Node.js 18+ required
node --version  # Should be v18.0.0 or higher

# Required npm packages
npm install glob gray-matter chalk yargs cheerio
```

### Initial Setup

1. **Verify Scripts Directory**
   ```bash
   cd /home/user/coffee-vault/Scripts
   ls -la *.js
   ```

2. **Make Scripts Executable**
   ```bash
   chmod +x vault-ci.js
   chmod +x accessibility-audit.js
   chmod +x daily-report-generator.js
   chmod +x user-journey-simulator.js
   ```

3. **Create Reports Directory**
   ```bash
   mkdir -p /home/user/coffee-vault/.vault-meta/reports
   ```

4. **Verify Configuration**
   ```bash
   cat /home/user/coffee-vault/.vault-meta/automation-config.json
   ```

### Testing Installation

Run each script with the `--help` flag to verify:

```bash
node Scripts/vault-ci.js --help
node Scripts/accessibility-audit.js --help
node Scripts/daily-report-generator.js --help
node Scripts/user-journey-simulator.js --help
```

---

## Script Reference

### 1. vault-ci.js - Vault Continuous Integration

**Purpose**: Static analysis and validation for the entire vault.

#### Features

- Scans all markdown files for broken wikilinks
- Validates frontmatter required fields by entity type
- Detects orphaned files (no incoming links)
- Identifies duplicate file names
- Validates YAML syntax
- Checks HTML visualizations for accessibility and structure
- Validates against ontology rules

#### Usage

```bash
# Basic CI run
node Scripts/vault-ci.js

# Verbose output
node Scripts/vault-ci.js --verbose

# Generate report without console output
node Scripts/vault-ci.js --report-only

# Auto-fix issues (experimental)
node Scripts/vault-ci.js --fix
```

#### Options

| Option | Alias | Type | Description |
|--------|-------|------|-------------|
| `--fix` | `-f` | boolean | Auto-fix issues where possible |
| `--verbose` | `-v` | boolean | Show detailed output |
| `--report-only` | `-r` | boolean | Generate report without console output |
| `--help` | `-h` | - | Show help |

#### Output

- **Console**: Summary of errors and warnings
- **Report**: `.vault-meta/reports/ci-YYYYMMDD.md`
- **Exit Code**: 0 (pass), 1 (warnings), 2 (errors)

#### Example Report Structure

```markdown
# Coffee Vault CI Report

**Generated**: 2025-11-06T10:30:00.000Z
**Files Scanned**: 247

## Summary
- 🔴 Errors: 3
- 🟡 Warnings: 12
- 🟢 Passed: 232

## Statistics
| Metric | Count |
|--------|-------|
| Broken Links | 3 |
| Missing Frontmatter | 8 |
| Orphaned Files | 15 |
| Duplicate Files | 2 |
...
```

---

### 2. accessibility-audit.js - HTML Accessibility Checker

**Purpose**: WCAG 2.1 AA/AAA compliance verification for HTML dashboards.

#### Features

- Scans all HTML files in `Visualizations/` and root
- Checks color contrast ratios (4.5:1 minimum for AA)
- Validates alt text on images
- Checks ARIA labels on interactive elements
- Verifies keyboard navigation support
- Validates semantic HTML usage
- Checks form label associations
- Validates heading hierarchy

#### Usage

```bash
# Audit all HTML files (AA standard)
node Scripts/accessibility-audit.js

# Audit single file
node Scripts/accessibility-audit.js --file Visualizations/VISUALIZATION-HUB.html

# Use AAA standard (stricter)
node Scripts/accessibility-audit.js --strict

# Verbose output with details
node Scripts/accessibility-audit.js --verbose
```

#### Options

| Option | Alias | Type | Description |
|--------|-------|------|-------------|
| `--file` | - | string | Audit a single HTML file |
| `--strict` | - | boolean | Use WCAG 2.1 AAA standard |
| `--verbose` | `-v` | boolean | Show detailed output |
| `--help` | `-h` | - | Show help |

#### Output

- **Console**: Summary of accessibility issues by severity
- **Report**: `.vault-meta/reports/accessibility-YYYYMMDD.md`
- **Exit Code**: 0 (no issues), 1 (has issues), 2 (critical issues)

#### WCAG Rules Checked

| Rule | Level | Description |
|------|-------|-------------|
| 1.1.1 | A | Non-text Content (alt text) |
| 1.3.1 | A | Info and Relationships (heading hierarchy) |
| 1.4.3 | AA | Contrast (color contrast ratios) |
| 2.4.1 | A | Bypass Blocks (skip navigation) |
| 2.4.2 | A | Page Titled |
| 2.4.3 | A | Focus Order (tabindex) |
| 2.4.4 | A | Link Purpose (link text) |
| 3.1.1 | A | Language of Page |
| 3.3.2 | A | Labels or Instructions (form labels) |
| 4.1.2 | A | Name, Role, Value (ARIA) |

---

### 3. daily-report-generator.js - Daily QA Dashboard

**Purpose**: Automated daily vault health report.

#### Features

- Aggregates vault statistics by entity type
- Tracks new/modified files in last 24 hours
- Reports broken links count
- Identifies orphaned files
- Calculates coverage metrics (beans linked to origins, etc.)
- Runs mini CI checks
- Generates actionable todo list
- Creates markdown report with emoji charts
- Calculates vault health score (0-100)

#### Usage

```bash
# Generate daily report
node Scripts/daily-report-generator.js

# Verbose output
node Scripts/daily-report-generator.js --verbose

# Custom time window (48 hours)
node Scripts/daily-report-generator.js --hours 48
```

#### Options

| Option | Alias | Type | Description |
|--------|-------|------|-------------|
| `--verbose` | `-v` | boolean | Show detailed output |
| `--hours` | - | number | Hours threshold for "recent" files (default: 24) |
| `--help` | `-h` | - | Show help |

#### Output

- **Console**: Summary statistics and health score
- **Report**: `.vault-meta/reports/daily-YYYYMMDD.md`
- **Exit Code**: 0 (success), 1 (failure)

#### Health Score Calculation

```
Starting Score: 100

Deductions:
- Broken Links: -2 points each (max -30)
- Orphaned Files: -1 point each (max -20)
- High Priority Todos: -5 points each (max -25)

Final Score: max(0, 100 - deductions)

Thresholds:
- 90-100: 🟢 Excellent
- 75-89:  🟡 Good
- 50-74:  🟠 Needs Attention
- 0-49:   🔴 Critical
```

#### Coverage Metrics

The report tracks:

1. **Beans with Origins**: Percentage of bean profiles linked to origin profiles
2. **Beans with Roasters**: Percentage of bean profiles linked to roaster profiles
3. **Logs with Equipment**: Percentage of coffee logs mentioning equipment
4. **Recipes with Equipment**: Percentage of recipes with equipment requirements

---

### 4. user-journey-simulator.js - Navigation Testing

**Purpose**: Automated testing of key user workflows.

#### Features

- Simulates common user journeys through the vault
- Validates that all links in journey exist
- Checks files contain expected sections
- Verifies navigation completes in ≤3 clicks
- Validates required frontmatter present
- Generates test results report

#### Predefined Journeys

1. **New User Onboarding**: START-HERE → Coffee Log template → Log first coffee
2. **Bean Exploration**: Bean profile → Origin profile → Scientific references
3. **Visualization Exploration**: Visualization hub → 3D view → Home dashboard
4. **Analytics Workflow**: Monthly analytics → Brewing optimizer → Recipe recommendations

#### Usage

```bash
# Test all journeys
node Scripts/user-journey-simulator.js

# Test specific journey
node Scripts/user-journey-simulator.js --journey 1

# Verbose output
node Scripts/user-journey-simulator.js --verbose

# Interactive mode (future feature)
node Scripts/user-journey-simulator.js --interactive
```

#### Options

| Option | Alias | Type | Description |
|--------|-------|------|-------------|
| `--journey` | - | string | Test specific journey (1-4) |
| `--verbose` | `-v` | boolean | Show detailed output |
| `--interactive` | `-i` | boolean | Interactive mode (not yet implemented) |
| `--help` | `-h` | - | Show help |

#### Output

- **Console**: Journey status and issues found
- **Report**: `.vault-meta/reports/user-journeys-YYYYMMDD.md`
- **Exit Code**: 0 (all passed), 1 (warnings), 2 (failures)

---

## Configuration

### Configuration File Location

`/home/user/coffee-vault/.vault-meta/automation-config.json`

### Key Configuration Sections

#### CI Configuration

```json
{
  "ci": {
    "enabled": true,
    "scanDirectories": ["Coffee Logs", "Bean Library", ...],
    "excludePatterns": ["node_modules/**", ".git/**"],
    "brokenLinkThreshold": 10,
    "orphanThreshold": 20,
    "autoFix": false
  }
}
```

#### Accessibility Configuration

```json
{
  "accessibility": {
    "enabled": true,
    "standard": "AA",
    "contrastRatio": {
      "normalText": 4.5,
      "largeText": 3.0
    },
    "checkColorContrast": true,
    "checkAltText": true
  }
}
```

#### Daily Report Configuration

```json
{
  "dailyReport": {
    "enabled": true,
    "schedule": "0 9 * * *",
    "hoursThreshold": 24,
    "generateTodos": true,
    "healthScore": {
      "enabled": true,
      "thresholds": {
        "excellent": 90,
        "good": 75
      }
    }
  }
}
```

#### User Journeys Configuration

```json
{
  "userJourneys": {
    "enabled": true,
    "journeys": [
      {
        "id": 1,
        "name": "New User Onboarding",
        "enabled": true,
        "critical": true
      }
    ],
    "clickLimit": 3
  }
}
```

---

## Usage Examples

### Daily Workflow

**Morning Routine** (9:00 AM UTC):

```bash
# Run daily report to see overnight changes
node Scripts/daily-report-generator.js

# Check report
cat .vault-meta/reports/daily-$(date +%Y%m%d).md
```

### Before Committing Changes

```bash
# Run full CI validation
node Scripts/vault-ci.js --verbose

# If HTML files changed, run accessibility audit
node Scripts/accessibility-audit.js

# Fix any errors before committing
git add .
git commit -m "Your commit message"
```

### Weekly Quality Check

```bash
# Full CI scan
node Scripts/vault-ci.js --verbose > ci-results.txt

# Accessibility audit (AAA standard)
node Scripts/accessibility-audit.js --strict

# User journey testing
node Scripts/user-journey-simulator.js --verbose

# Review all reports
ls -lt .vault-meta/reports/
```

### Before Release

```bash
# Run complete test suite
echo "Running full automation suite..."

echo "1. CI Validation..."
node Scripts/vault-ci.js --verbose

echo "2. Accessibility Audit (AAA)..."
node Scripts/accessibility-audit.js --strict

echo "3. User Journey Testing..."
node Scripts/user-journey-simulator.js

echo "4. Generating Daily Report..."
node Scripts/daily-report-generator.js

echo "✅ All checks complete. Review reports in .vault-meta/reports/"
```

---

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/vault-ci.yml`:

```yaml
name: Coffee Vault CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM UTC

jobs:
  vault-validation:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install Dependencies
        run: npm install glob gray-matter chalk yargs cheerio

      - name: Run Vault CI
        run: node Scripts/vault-ci.js --verbose

      - name: Run Accessibility Audit
        if: always()
        run: node Scripts/accessibility-audit.js

      - name: Run User Journey Tests
        if: always()
        run: node Scripts/user-journey-simulator.js

      - name: Upload Reports
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: automation-reports
          path: .vault-meta/reports/

      - name: Fail on Errors
        run: |
          if [ $(node Scripts/vault-ci.js) -eq 2 ]; then
            echo "CI validation failed"
            exit 1
          fi
```

### Local Git Hooks

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash

echo "Running Coffee Vault pre-commit checks..."

# Run CI validation
node Scripts/vault-ci.js --report-only

EXIT_CODE=$?

if [ $EXIT_CODE -eq 2 ]; then
  echo "❌ CI validation failed. Fix errors before committing."
  exit 1
elif [ $EXIT_CODE -eq 1 ]; then
  echo "⚠️  CI validation passed with warnings."
  exit 0
else
  echo "✅ CI validation passed."
  exit 0
fi
```

Make executable:
```bash
chmod +x .git/hooks/pre-commit
```

### Cron Jobs (Linux/Mac)

Edit crontab:
```bash
crontab -e
```

Add daily report generation:
```cron
# Coffee Vault Daily Report (9 AM UTC)
0 9 * * * cd /home/user/coffee-vault && node Scripts/daily-report-generator.js

# Weekly CI validation (Monday 6 AM UTC)
0 6 * * 1 cd /home/user/coffee-vault && node Scripts/vault-ci.js --verbose

# Weekly accessibility audit (Friday 3 PM UTC)
0 15 * * 5 cd /home/user/coffee-vault && node Scripts/accessibility-audit.js --strict
```

---

## Troubleshooting

### Common Issues

#### Issue: "Cannot find module 'glob'"

**Solution**:
```bash
npm install glob gray-matter chalk yargs cheerio
```

#### Issue: "Permission denied" when running scripts

**Solution**:
```bash
chmod +x Scripts/*.js
```

Or run with `node` explicitly:
```bash
node Scripts/vault-ci.js
```

#### Issue: Scripts not finding vault files

**Solution**: Verify you're running from the vault root:
```bash
cd /home/user/coffee-vault
node Scripts/vault-ci.js
```

#### Issue: High number of orphaned files reported

**Explanation**: Orphaned files are those with no incoming links. This is normal for:
- Templates
- Configuration files
- Documentation
- Recent files not yet linked

**Action**: Review the orphaned files list and create links where appropriate.

#### Issue: Broken links to files that exist

**Cause**: Case sensitivity or path mismatch

**Solution**: Ensure wikilinks use exact file names:
```markdown
❌ [[Ethiopia]]
✅ [[Ethiopia-Yirgacheffe]]
```

### Debug Mode

For detailed debugging, set Node.js debug mode:

```bash
NODE_ENV=development node Scripts/vault-ci.js
```

### Getting Help

1. Check script help: `node Scripts/[script-name].js --help`
2. Review configuration: `cat .vault-meta/automation-config.json`
3. Check recent reports: `ls -lt .vault-meta/reports/`
4. Review script code: `cat Scripts/[script-name].js | head -100`

---

## Best Practices

### Development Workflow

1. **Before Starting Work**
   - Run daily report to see current vault state
   - Check for broken links or issues

2. **During Development**
   - Add frontmatter to new files immediately
   - Use templates for consistency
   - Link new files to related entities

3. **Before Committing**
   - Run `vault-ci.js` to validate changes
   - Fix any errors or warnings
   - Update documentation if needed

4. **Weekly**
   - Review daily reports for trends
   - Run accessibility audit on visualizations
   - Test user journeys after major changes

### Content Creation Guidelines

**Always Include**:
- Valid YAML frontmatter with `type` field
- Required fields for entity type (see ontology)
- At least one incoming link (except for entry points)
- Descriptive file names following naming conventions

**Link Strategy**:
- Link beans to origins and roasters
- Link logs to beans, recipes, and equipment
- Link recipes to equipment and guides
- Cross-reference related entities

### Monitoring & Maintenance

**Daily** (Automated):
- Daily report generation
- Health score tracking

**Weekly** (Manual):
- Review accumulated reports
- Address high-priority todos
- Check coverage metrics trends

**Monthly** (Manual):
- Full vault audit
- Archive old reports
- Update configuration if needed
- Review and refactor automation scripts

### Performance Optimization

**For Large Vaults** (1000+ files):

1. **Exclude unnecessary directories**:
   ```json
   "excludePatterns": [
     "Archives/**",
     "Old/**",
     "node_modules/**"
   ]
   ```

2. **Reduce concurrent processing**:
   ```json
   "performance": {
     "maxConcurrentFiles": 25
   }
   ```

3. **Enable caching**:
   ```json
   "performance": {
     "cacheEnabled": true,
     "cacheTTL": 3600
   }
   ```

4. **Run specific checks only**:
   ```bash
   # Just check broken links
   node Scripts/vault-ci.js --report-only
   ```

---

## Appendix

### Exit Code Reference

| Exit Code | Meaning | Action |
|-----------|---------|--------|
| 0 | Success / Pass | Continue normally |
| 1 | Warnings | Review and address when convenient |
| 2 | Errors / Failures | Fix immediately before proceeding |

### Report Locations

All reports are saved to: `.vault-meta/reports/`

| Report Type | Filename Pattern | Retention |
|-------------|------------------|-----------|
| CI | `ci-YYYYMMDD.md` | 30 days |
| Accessibility | `accessibility-YYYYMMDD.md` | 30 days |
| Daily | `daily-YYYYMMDD.md` | 60 days |
| User Journeys | `user-journeys-YYYYMMDD.md` | 30 days |

### Useful Commands

```bash
# Find all reports from last 7 days
find .vault-meta/reports/ -name "*.md" -mtime -7

# Count files by entity type
grep -r "^type:" --include="*.md" | cut -d: -f3 | sort | uniq -c

# Find files without frontmatter
grep -L "^---" **/*.md

# Check vault health score trend
grep "Health Score" .vault-meta/reports/daily-*.md | tail -10

# Archive old reports
mv .vault-meta/reports/daily-202410*.md .vault-meta/reports/archive/
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-11-06 | Initial release with 4 automation scripts |

---

**Maintained by**: Coffee Vault Automation Team
**Last Updated**: 2025-11-06
**Questions**: See [Documentation/README.md](../Documentation/README.md)

---

*End of Automation Playbook*
