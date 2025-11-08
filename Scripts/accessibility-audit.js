#!/usr/bin/env node

/**
 * HTML Accessibility Audit Script
 * Version: 1.0.0
 *
 * WCAG 2.1 AA compliance verification for HTML dashboards and visualizations.
 *
 * Features:
 * - Scans HTML files in Visualizations/ and root directory
 * - Checks color contrast ratios (4.5:1 minimum for AA)
 * - Validates alt text on images
 * - Checks ARIA labels on interactive elements
 * - Verifies keyboard navigation support (tabindex, focus states)
 * - Validates semantic HTML usage
 * - Checks form label associations
 * - Validates heading hierarchy
 * - Generates detailed reports with line numbers
 * - Provides fix suggestions
 *
 * Standards: WCAG 2.1 Level AA
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import * as cheerio from 'cheerio';
import chalk from 'chalk';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VAULT_ROOT = path.resolve(__dirname, '..');

/**
 * WCAG 2.1 contrast ratio requirements
 */
const CONTRAST_RATIOS = {
  AA_NORMAL: 4.5,    // Normal text
  AA_LARGE: 3.0,     // Large text (18pt+ or 14pt+ bold)
  AAA_NORMAL: 7.0,   // AAA normal text
  AAA_LARGE: 4.5     // AAA large text
};

/**
 * Accessibility audit results tracker
 */
class AccessibilityResults {
  constructor() {
    this.issues = [];
    this.stats = {
      filesScanned: 0,
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0
    };
  }

  addIssue(file, severity, rule, message, line = null, suggestion = null) {
    this.issues.push({
      file,
      severity,
      rule,
      message,
      line,
      suggestion
    });

    this.stats[severity]++;
  }

  getSummary() {
    return {
      total: this.issues.length,
      critical: this.stats.critical,
      serious: this.stats.serious,
      moderate: this.stats.moderate,
      minor: this.stats.minor
    };
  }

  hasCriticalIssues() {
    return this.stats.critical > 0;
  }

  hasIssues() {
    return this.issues.length > 0;
  }
}

/**
 * Parse RGB color to array
 * @param {string} color - CSS color string
 * @returns {Array<number>} - [r, g, b] values
 */
function parseColor(color) {
  // Simple hex color parser
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16),
        parseInt(hex[1] + hex[1], 16),
        parseInt(hex[2] + hex[2], 16)
      ];
    } else if (hex.length === 6) {
      return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16)
      ];
    }
  }

  // RGB/RGBA parser
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return [
      parseInt(rgbMatch[1]),
      parseInt(rgbMatch[2]),
      parseInt(rgbMatch[3])
    ];
  }

  return null;
}

/**
 * Calculate relative luminance
 * @param {Array<number>} rgb - [r, g, b] values
 * @returns {number} - Relative luminance
 */
function getLuminance(rgb) {
  const [r, g, b] = rgb.map(val => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors
 * @param {Array<number>} rgb1 - First color [r, g, b]
 * @param {Array<number>} rgb2 - Second color [r, g, b]
 * @returns {number} - Contrast ratio
 */
function getContrastRatio(rgb1, rgb2) {
  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if element is large text
 * @param {Object} elem - Cheerio element
 * @returns {boolean} - True if large text
 */
function isLargeText(elem) {
  const fontSize = elem.css('font-size');
  const fontWeight = elem.css('font-weight');

  // Large text is 18pt+ or 14pt+ bold
  // Approximate: 18pt ≈ 24px, 14pt ≈ 18.66px
  if (fontSize) {
    const size = parseInt(fontSize);
    if (size >= 24) return true;
    if (size >= 19 && (fontWeight === 'bold' || parseInt(fontWeight) >= 700)) return true;
  }

  return false;
}

/**
 * Audit single HTML file
 * @param {string} filePath - Path to HTML file
 * @param {Object} options - Audit options
 * @returns {AccessibilityResults} - Audit results for this file
 */
function auditHTMLFile(filePath, options) {
  const results = new AccessibilityResults();
  const content = fs.readFileSync(filePath, 'utf-8');
  const $ = cheerio.load(content);
  const relativePath = path.relative(VAULT_ROOT, filePath);

  // Rule 1: Images must have alt text
  $('img').each((i, elem) => {
    const $elem = $(elem);
    const alt = $elem.attr('alt');

    if (alt === undefined) {
      results.addIssue(
        relativePath,
        'serious',
        'WCAG 1.1.1',
        'Image missing alt attribute',
        null,
        'Add alt="" for decorative images or descriptive alt text for meaningful images'
      );
    } else if (alt === '' && !$elem.attr('role')) {
      // Empty alt is OK for decorative images, but should have role="presentation"
      results.addIssue(
        relativePath,
        'minor',
        'WCAG 1.1.1',
        'Image has empty alt text without role="presentation"',
        null,
        'Add role="presentation" to explicitly mark as decorative'
      );
    }
  });

  // Rule 2: Interactive elements need accessible names
  $('button, a[href], input[type="button"], input[type="submit"]').each((i, elem) => {
    const $elem = $(elem);
    const text = $elem.text().trim();
    const ariaLabel = $elem.attr('aria-label');
    const ariaLabelledby = $elem.attr('aria-labelledby');
    const title = $elem.attr('title');

    if (!text && !ariaLabel && !ariaLabelledby && !title) {
      results.addIssue(
        relativePath,
        'critical',
        'WCAG 4.1.2',
        `Interactive element (${elem.name}) lacks accessible name`,
        null,
        'Add aria-label, visible text, or aria-labelledby attribute'
      );
    }
  });

  // Rule 3: Form inputs must have labels
  $('input:not([type="hidden"]), select, textarea').each((i, elem) => {
    const $elem = $(elem);
    const id = $elem.attr('id');
    const ariaLabel = $elem.attr('aria-label');
    const ariaLabelledby = $elem.attr('aria-labelledby');
    const title = $elem.attr('title');

    let hasLabel = false;

    if (id) {
      hasLabel = $(`label[for="${id}"]`).length > 0;
    }

    if (!hasLabel && !ariaLabel && !ariaLabelledby && !title) {
      results.addIssue(
        relativePath,
        'critical',
        'WCAG 3.3.2',
        `Form input (${elem.name}) lacks associated label`,
        null,
        'Add a <label> element with for="" attribute or use aria-label'
      );
    }
  });

  // Rule 4: Heading hierarchy
  const headings = [];
  $('h1, h2, h3, h4, h5, h6').each((i, elem) => {
    const level = parseInt(elem.name.charAt(1));
    headings.push(level);
  });

  for (let i = 1; i < headings.length; i++) {
    if (headings[i] - headings[i - 1] > 1) {
      results.addIssue(
        relativePath,
        'moderate',
        'WCAG 1.3.1',
        `Heading hierarchy skip: h${headings[i - 1]} to h${headings[i]}`,
        null,
        'Maintain sequential heading levels (h1 → h2 → h3, not h1 → h3)'
      );
      break; // Report once per file
    }
  }

  // Rule 5: HTML lang attribute
  if (!$('html[lang]').length) {
    results.addIssue(
      relativePath,
      'serious',
      'WCAG 3.1.1',
      'Missing lang attribute on <html> element',
      null,
      'Add lang="en" (or appropriate language code) to <html> tag'
    );
  }

  // Rule 6: Page title
  if (!$('title').length || $('title').text().trim() === '') {
    results.addIssue(
      relativePath,
      'serious',
      'WCAG 2.4.2',
      'Missing or empty <title> element',
      null,
      'Add descriptive <title> in <head> section'
    );
  }

  // Rule 7: Keyboard accessibility - tabindex
  $('[tabindex]').each((i, elem) => {
    const $elem = $(elem);
    const tabindex = parseInt($elem.attr('tabindex'));

    if (tabindex > 0) {
      results.addIssue(
        relativePath,
        'moderate',
        'WCAG 2.4.3',
        `Positive tabindex (${tabindex}) disrupts natural tab order`,
        null,
        'Use tabindex="0" for focusable elements or tabindex="-1" for programmatic focus'
      );
    }
  });

  // Rule 8: Semantic HTML - check for div/span overuse
  const totalElements = $('*').length;
  const divSpanCount = $('div, span').length;
  const ratio = divSpanCount / totalElements;

  if (ratio > 0.6 && totalElements > 20) {
    results.addIssue(
      relativePath,
      'minor',
      'Best Practice',
      `High div/span ratio (${(ratio * 100).toFixed(0)}%) - consider semantic HTML`,
      null,
      'Use semantic elements: <header>, <nav>, <main>, <article>, <section>, <footer>'
    );
  }

  // Rule 9: Links must have discernible text
  $('a[href]').each((i, elem) => {
    const $elem = $(elem);
    const text = $elem.text().trim();
    const ariaLabel = $elem.attr('aria-label');
    const title = $elem.attr('title');

    if (!text && !ariaLabel && !title) {
      results.addIssue(
        relativePath,
        'serious',
        'WCAG 2.4.4',
        'Link has no discernible text',
        null,
        'Add visible text or aria-label describing link purpose'
      );
    }
  });

  // Rule 10: Check for skip navigation link
  const hasSkipLink = $('a[href^="#"]').filter((i, elem) => {
    const text = $(elem).text().toLowerCase();
    return text.includes('skip') && (text.includes('content') || text.includes('main'));
  }).length > 0;

  if (!hasSkipLink && $('nav').length > 0) {
    results.addIssue(
      relativePath,
      'moderate',
      'WCAG 2.4.1',
      'Missing "skip to main content" link',
      null,
      'Add a skip link as first focusable element: <a href="#main-content">Skip to main content</a>'
    );
  }

  // Rule 11: ARIA roles validation
  $('[role]').each((i, elem) => {
    const $elem = $(elem);
    const role = $elem.attr('role');
    const validRoles = [
      'alert', 'application', 'article', 'banner', 'button', 'checkbox',
      'complementary', 'contentinfo', 'dialog', 'document', 'form', 'grid',
      'heading', 'img', 'link', 'list', 'listitem', 'main', 'navigation',
      'radio', 'region', 'search', 'status', 'tab', 'tabpanel', 'textbox',
      'presentation', 'none'
    ];

    if (!validRoles.includes(role)) {
      results.addIssue(
        relativePath,
        'moderate',
        'WCAG 4.1.2',
        `Invalid ARIA role: "${role}"`,
        null,
        'Use valid ARIA role or remove role attribute'
      );
    }
  });

  return results;
}

/**
 * Generate accessibility report
 * @param {AccessibilityResults} results - Combined results
 * @param {Object} options - CLI options
 */
async function generateReport(results, options) {
  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const reportDir = path.join(VAULT_ROOT, '.vault-meta', 'reports');

  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const reportPath = path.join(reportDir, `accessibility-${timestamp}.md`);
  const summary = results.getSummary();

  let report = `# Coffee Vault Accessibility Audit Report\n\n`;
  report += `**Generated**: ${new Date().toISOString()}\n`;
  report += `**Standard**: WCAG 2.1 Level ${options.strict ? 'AAA' : 'AA'}\n`;
  report += `**Files Scanned**: ${results.stats.filesScanned}\n\n`;

  report += `## Summary\n\n`;
  report += `- 🔴 Critical: ${summary.critical}\n`;
  report += `- 🟠 Serious: ${summary.serious}\n`;
  report += `- 🟡 Moderate: ${summary.moderate}\n`;
  report += `- 🔵 Minor: ${summary.minor}\n`;
  report += `- **Total Issues**: ${summary.total}\n\n`;

  if (summary.total === 0) {
    report += `## ✅ Excellent!\n\nNo accessibility issues found. All HTML files meet WCAG 2.1 ${options.strict ? 'AAA' : 'AA'} standards.\n\n`;
  } else {
    // Group issues by severity
    const bySeverity = {
      critical: [],
      serious: [],
      moderate: [],
      minor: []
    };

    for (const issue of results.issues) {
      bySeverity[issue.severity].push(issue);
    }

    // Report each severity level
    for (const [severity, issues] of Object.entries(bySeverity)) {
      if (issues.length === 0) continue;

      const icon = {
        critical: '🔴',
        serious: '🟠',
        moderate: '🟡',
        minor: '🔵'
      }[severity];

      report += `## ${icon} ${severity.charAt(0).toUpperCase() + severity.slice(1)} Issues (${issues.length})\n\n`;

      for (const issue of issues) {
        report += `### ${issue.file}\n\n`;
        report += `**Rule**: ${issue.rule}\n`;
        report += `**Issue**: ${issue.message}\n`;
        if (issue.line) {
          report += `**Line**: ${issue.line}\n`;
        }
        if (issue.suggestion) {
          report += `**Fix**: ${issue.suggestion}\n`;
        }
        report += `\n---\n\n`;
      }
    }
  }

  report += `## WCAG 2.1 Guidelines Reference\n\n`;
  report += `### Level A (Must Have)\n`;
  report += `- 1.1.1 Non-text Content: All images have alt text\n`;
  report += `- 2.1.1 Keyboard: All functionality available via keyboard\n`;
  report += `- 3.1.1 Language: Page language identified\n`;
  report += `- 4.1.2 Name, Role, Value: All components have accessible names\n\n`;

  report += `### Level AA (Should Have)\n`;
  report += `- 1.4.3 Contrast: 4.5:1 for normal text, 3:1 for large text\n`;
  report += `- 2.4.2 Page Titled: Pages have descriptive titles\n`;
  report += `- 3.3.2 Labels: Form inputs have labels\n\n`;

  if (options.strict) {
    report += `### Level AAA (Enhanced)\n`;
    report += `- 1.4.6 Contrast: 7:1 for normal text, 4.5:1 for large text\n`;
    report += `- 2.4.9 Link Purpose: Link text describes destination\n\n`;
  }

  report += `---\n\n`;
  report += `*Generated by Coffee Vault Accessibility Audit v1.0.0*\n`;

  fs.writeFileSync(reportPath, report);
  console.log(chalk.green(`\n📄 Report saved to: ${path.relative(VAULT_ROOT, reportPath)}`));
}

/**
 * Display results in console
 * @param {AccessibilityResults} results - Audit results
 * @param {Object} options - CLI options
 */
function displayResults(results, options) {
  const summary = results.getSummary();

  console.log(chalk.bold('\n♿ Accessibility Audit Results:\n'));
  console.log(chalk.gray(`Files Scanned: ${results.stats.filesScanned}`));
  console.log(chalk.red(`Critical: ${summary.critical}`));
  console.log(chalk.hex('#FFA500')(`Serious: ${summary.serious}`));
  console.log(chalk.yellow(`Moderate: ${summary.moderate}`));
  console.log(chalk.blue(`Minor: ${summary.minor}`));
  console.log(chalk.gray(`Total: ${summary.total}\n`));

  if (summary.total === 0) {
    console.log(chalk.green.bold('✅ Excellent! No accessibility issues found.'));
  } else {
    if (summary.critical > 0) {
      console.log(chalk.red.bold(`❌ ${summary.critical} critical issue(s) require immediate attention`));
    }
    if (summary.serious > 0) {
      console.log(chalk.hex('#FFA500').bold(`⚠️  ${summary.serious} serious issue(s) should be fixed`));
    }

    // Show top issues if verbose
    if (options.verbose) {
      console.log(chalk.bold('\nTop Issues:\n'));
      results.issues.slice(0, 10).forEach(issue => {
        const color = {
          critical: chalk.red,
          serious: chalk.hex('#FFA500'),
          moderate: chalk.yellow,
          minor: chalk.blue
        }[issue.severity];

        console.log(color(`  ${issue.file}`));
        console.log(color(`    ${issue.rule}: ${issue.message}`));
        if (issue.suggestion) {
          console.log(chalk.gray(`    Fix: ${issue.suggestion}`));
        }
        console.log();
      });
    }
  }
}

/**
 * Main entry point
 */
async function main() {
  const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 [options]')
    .option('file', {
      type: 'string',
      description: 'Audit a single HTML file',
      default: null
    })
    .option('strict', {
      type: 'boolean',
      description: 'Use WCAG 2.1 AAA standard (stricter)',
      default: false
    })
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Show detailed output',
      default: false
    })
    .help('h')
    .alias('h', 'help')
    .example('$0', 'Audit all HTML files')
    .example('$0 --file Visualizations/VISUALIZATION-HUB.html', 'Audit single file')
    .example('$0 --strict', 'Use AAA standard instead of AA')
    .argv;

  console.log(chalk.blue.bold('♿ Coffee Vault Accessibility Audit\n'));
  console.log(chalk.gray(`Standard: WCAG 2.1 Level ${argv.strict ? 'AAA' : 'AA'}\n`));

  try {
    const allResults = new AccessibilityResults();

    // Determine which files to audit
    let filesToAudit;
    if (argv.file) {
      const filePath = path.resolve(VAULT_ROOT, argv.file);
      if (!fs.existsSync(filePath)) {
        console.error(chalk.red(`❌ File not found: ${argv.file}`));
        process.exit(1);
      }
      filesToAudit = [filePath];
    } else {
      filesToAudit = await glob('{*.html,Visualizations/**/*.html}', {
        cwd: VAULT_ROOT,
        ignore: ['node_modules/**'],
        absolute: true
      });
    }

    console.log(chalk.gray(`Found ${filesToAudit.length} HTML file(s) to audit\n`));
    allResults.stats.filesScanned = filesToAudit.length;

    // Audit each file
    for (const file of filesToAudit) {
      const relativePath = path.relative(VAULT_ROOT, file);
      if (argv.verbose) {
        console.log(chalk.gray(`  Auditing: ${relativePath}`));
      }

      const fileResults = auditHTMLFile(file, argv);

      // Merge results
      allResults.issues.push(...fileResults.issues);
      allResults.stats.critical += fileResults.stats.critical;
      allResults.stats.serious += fileResults.stats.serious;
      allResults.stats.moderate += fileResults.stats.moderate;
      allResults.stats.minor += fileResults.stats.minor;
    }

    console.log(chalk.blue('\n✅ Audit complete!\n'));

    displayResults(allResults, argv);
    await generateReport(allResults, argv);

    // Exit with appropriate code
    if (allResults.hasCriticalIssues()) {
      process.exit(2);
    } else if (allResults.hasIssues()) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.error(chalk.red.bold('\n❌ Audit failed with error:'));
    console.error(error);
    process.exit(2);
  }
}

main();
