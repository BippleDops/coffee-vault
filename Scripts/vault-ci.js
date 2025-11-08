#!/usr/bin/env node

/**
 * Vault Continuous Integration (CI) Script
 * Version: 1.0.0
 *
 * Static analysis and validation for the entire Coffee Vault.
 *
 * Features:
 * - Scans all markdown files for broken wikilinks
 * - Validates frontmatter required fields by entity type
 * - Detects orphaned files (no incoming links)
 * - Identifies duplicate file names
 * - Validates YAML syntax
 * - Checks HTML visualizations for accessibility and structure
 * - Validates against ontology rules
 * - Generates comprehensive CI reports
 *
 * Exit codes:
 * - 0: Pass (no errors)
 * - 1: Warnings only
 * - 2: Errors found
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import matter from 'gray-matter';
import chalk from 'chalk';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VAULT_ROOT = path.resolve(__dirname, '..');

/**
 * Entity type schemas from VAULT-ONTOLOGY.md
 */
const ENTITY_SCHEMAS = {
  'coffee-log': {
    required: ['type', 'date', 'beans', 'brew-method', 'rating', 'tags']
  },
  'bean-profile': {
    required: ['type', 'origin', 'country', 'processing', 'tags']
  },
  'origin-profile': {
    required: ['type', 'country', 'altitude', 'primary-process', 'tags']
  },
  'producer-profile': {
    required: ['type', 'producer-name', 'country', 'type', 'status', 'tags']
  },
  'roaster-profile': {
    required: ['type', 'name', 'location', 'founded', 'roasting-style', 'status', 'tags']
  },
  'recipe-profile': {
    required: ['type', 'brew-method', 'status', 'tags']
  },
  'equipment-model': {
    required: ['type', 'brand', 'category', 'status', 'tags']
  },
  'cupping-session': {
    required: ['type', 'date', 'protocol', 'sample-count', 'status', 'tags']
  },
  'coffee-event': {
    required: ['type', 'name', 'date', 'event-type', 'status', 'tags']
  },
  'coffee-goal': {
    required: ['type', 'goal-type', 'status', 'priority', 'tags']
  },
  'brewing-guide': {
    required: ['type', 'brew-method', 'difficulty', 'tags']
  },
  'scientific-reference': {
    required: ['type', 'category', 'title', 'tags']
  }
};

/**
 * CI Results tracker
 */
class CIResults {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.passed = [];
    this.stats = {
      filesScanned: 0,
      brokenLinks: 0,
      missingFrontmatter: 0,
      orphanedFiles: 0,
      duplicateFiles: 0,
      invalidYAML: 0,
      htmlIssues: 0
    };
  }

  addError(file, message) {
    this.errors.push({ file, message, type: 'error' });
  }

  addWarning(file, message) {
    this.warnings.push({ file, message, type: 'warning' });
  }

  addPass(file, message) {
    this.passed.push({ file, message });
  }

  hasErrors() {
    return this.errors.length > 0;
  }

  hasWarnings() {
    return this.warnings.length > 0;
  }

  getExitCode() {
    if (this.hasErrors()) return 2;
    if (this.hasWarnings()) return 1;
    return 0;
  }
}

/**
 * Parse wikilinks from markdown content
 * @param {string} content - Markdown content
 * @returns {Array<string>} - Array of wikilink targets
 */
function extractWikilinks(content) {
  const wikilinkRegex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  const links = [];
  let match;

  while ((match = wikilinkRegex.exec(content)) !== null) {
    links.push(match[1]);
  }

  return links;
}

/**
 * Validate YAML frontmatter
 * @param {string} filePath - Path to markdown file
 * @returns {Object} - Parsed frontmatter and validation result
 */
function validateFrontmatter(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(content);
    return { success: true, data: parsed.data, content: parsed.content };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Check if file exists in vault
 * @param {string} linkTarget - Wikilink target
 * @param {Array<string>} allFiles - All markdown files in vault
 * @returns {boolean} - True if file exists
 */
function linkTargetExists(linkTarget, allFiles) {
  // Remove directory path if present
  const cleanTarget = linkTarget.split('/').pop();

  return allFiles.some(file => {
    const baseName = path.basename(file, '.md');
    return baseName === cleanTarget || baseName === linkTarget;
  });
}

/**
 * Validate required frontmatter fields for entity type
 * @param {Object} frontmatter - Parsed frontmatter
 * @param {string} filePath - File path for error reporting
 * @returns {Array<string>} - Array of missing required fields
 */
function validateRequiredFields(frontmatter, filePath) {
  const type = frontmatter.type;
  const missing = [];

  if (!type) {
    return ['type (required for all entities)'];
  }

  const schema = ENTITY_SCHEMAS[type];
  if (!schema) {
    // Unknown type, can't validate
    return [];
  }

  for (const field of schema.required) {
    if (!frontmatter[field]) {
      missing.push(field);
    }
  }

  return missing;
}

/**
 * Check HTML file for basic issues
 * @param {string} filePath - Path to HTML file
 * @returns {Array<Object>} - Array of issues found
 */
function validateHTMLFile(filePath) {
  const issues = [];
  const content = fs.readFileSync(filePath, 'utf-8');

  // Check for missing alt text on images
  const imgRegex = /<img(?![^>]*alt=)[^>]*>/gi;
  const imagesWithoutAlt = content.match(imgRegex);
  if (imagesWithoutAlt) {
    issues.push({
      severity: 'warning',
      message: `Found ${imagesWithoutAlt.length} image(s) without alt text`
    });
  }

  // Check for missing ARIA labels on buttons/interactive elements
  const buttonRegex = /<button(?![^>]*aria-label=)(?![^>]*>.*<\/button>)[^>]*\/>/gi;
  const buttonsWithoutAria = content.match(buttonRegex);
  if (buttonsWithoutAria) {
    issues.push({
      severity: 'warning',
      message: `Found ${buttonsWithoutAria.length} button(s) without ARIA labels`
    });
  }

  // Check for broken script references
  const scriptRegex = /<script[^>]+src=["']([^"']+)["']/gi;
  let scriptMatch;
  while ((scriptMatch = scriptRegex.exec(content)) !== null) {
    const scriptSrc = scriptMatch[1];
    if (!scriptSrc.startsWith('http') && !scriptSrc.startsWith('//')) {
      const scriptPath = path.resolve(path.dirname(filePath), scriptSrc);
      if (!fs.existsSync(scriptPath)) {
        issues.push({
          severity: 'error',
          message: `Broken script reference: ${scriptSrc}`
        });
      }
    }
  }

  // Check for basic HTML structure
  if (!content.includes('<!DOCTYPE') && !content.includes('<!doctype')) {
    issues.push({
      severity: 'warning',
      message: 'Missing DOCTYPE declaration'
    });
  }

  if (!/<html[^>]*lang=/i.test(content)) {
    issues.push({
      severity: 'warning',
      message: 'Missing lang attribute on <html> tag'
    });
  }

  return issues;
}

/**
 * Find duplicate file names in vault
 * @param {Array<string>} files - All files in vault
 * @returns {Object} - Object with duplicate basenames and their paths
 */
function findDuplicateFiles(files) {
  const baseNames = {};
  const duplicates = {};

  for (const file of files) {
    const baseName = path.basename(file);
    if (!baseNames[baseName]) {
      baseNames[baseName] = [];
    }
    baseNames[baseName].push(file);
  }

  for (const [name, paths] of Object.entries(baseNames)) {
    if (paths.length > 1) {
      duplicates[name] = paths;
    }
  }

  return duplicates;
}

/**
 * Find orphaned files (no incoming links)
 * @param {Array<string>} allFiles - All markdown files
 * @param {Object} linkGraph - Graph of all links
 * @returns {Array<string>} - Files with no incoming links
 */
function findOrphanedFiles(allFiles, linkGraph) {
  const orphans = [];
  const linkedFiles = new Set(Object.values(linkGraph).flat());

  for (const file of allFiles) {
    const relativePath = path.relative(VAULT_ROOT, file);

    // Skip special files
    if (relativePath.includes('Templates/') ||
        relativePath.includes('.vault-meta/') ||
        relativePath.includes('Configuration/') ||
        relativePath.includes('Documentation/') ||
        relativePath === 'HOME-DASHBOARD.md' ||
        relativePath === 'START-HERE.md' ||
        relativePath === 'README.md') {
      continue;
    }

    const baseName = path.basename(file, '.md');
    if (!linkedFiles.has(baseName) && !linkedFiles.has(file)) {
      orphans.push(file);
    }
  }

  return orphans;
}

/**
 * Main CI validation function
 * @param {Object} options - CLI options
 * @returns {CIResults} - Validation results
 */
async function runCI(options) {
  const results = new CIResults();
  const { verbose, fix } = options;

  console.log(chalk.blue.bold('🔍 Coffee Vault CI - Starting validation...\n'));

  // Scan all markdown files
  const markdownFiles = await glob('**/*.md', {
    cwd: VAULT_ROOT,
    ignore: ['node_modules/**', '.git/**', '.obsidian/**'],
    absolute: true
  });

  results.stats.filesScanned = markdownFiles.length;
  console.log(chalk.gray(`Found ${markdownFiles.length} markdown files\n`));

  // Build link graph
  const linkGraph = {};
  const allBasenames = markdownFiles.map(f => path.basename(f, '.md'));

  // Phase 1: Validate frontmatter and extract links
  console.log(chalk.blue('📋 Phase 1: Validating frontmatter and extracting links...'));
  for (const file of markdownFiles) {
    const relativePath = path.relative(VAULT_ROOT, file);

    // Validate YAML frontmatter
    const fmValidation = validateFrontmatter(file);
    if (!fmValidation.success) {
      results.addError(relativePath, `Invalid YAML: ${fmValidation.error}`);
      results.stats.invalidYAML++;
      continue;
    }

    // Check required fields
    const missingFields = validateRequiredFields(fmValidation.data, file);
    if (missingFields.length > 0) {
      results.addWarning(
        relativePath,
        `Missing required frontmatter: ${missingFields.join(', ')}`
      );
      results.stats.missingFrontmatter++;
    }

    // Extract wikilinks
    const links = extractWikilinks(fmValidation.content);
    linkGraph[file] = links;
  }

  // Phase 2: Validate wikilinks
  console.log(chalk.blue('🔗 Phase 2: Validating wikilinks...'));
  for (const [file, links] of Object.entries(linkGraph)) {
    const relativePath = path.relative(VAULT_ROOT, file);

    for (const link of links) {
      if (!linkTargetExists(link, markdownFiles)) {
        results.addError(relativePath, `Broken wikilink: [[${link}]]`);
        results.stats.brokenLinks++;
      }
    }
  }

  // Phase 3: Find duplicates
  console.log(chalk.blue('📑 Phase 3: Checking for duplicate files...'));
  const duplicates = findDuplicateFiles(markdownFiles);
  for (const [name, paths] of Object.entries(duplicates)) {
    const relativePaths = paths.map(p => path.relative(VAULT_ROOT, p));
    results.addWarning(
      name,
      `Duplicate file name found in:\n  - ${relativePaths.join('\n  - ')}`
    );
    results.stats.duplicateFiles++;
  }

  // Phase 4: Find orphaned files
  console.log(chalk.blue('🔍 Phase 4: Finding orphaned files...'));
  const orphans = findOrphanedFiles(markdownFiles, linkGraph);
  for (const orphan of orphans) {
    const relativePath = path.relative(VAULT_ROOT, orphan);
    results.addWarning(relativePath, 'Orphaned file (no incoming links)');
    results.stats.orphanedFiles++;
  }

  // Phase 5: Validate HTML visualizations
  console.log(chalk.blue('🌐 Phase 5: Validating HTML files...'));
  const htmlFiles = await glob('**/*.html', {
    cwd: VAULT_ROOT,
    ignore: ['node_modules/**', '.git/**'],
    absolute: true
  });

  for (const htmlFile of htmlFiles) {
    const relativePath = path.relative(VAULT_ROOT, htmlFile);
    const issues = validateHTMLFile(htmlFile);

    for (const issue of issues) {
      if (issue.severity === 'error') {
        results.addError(relativePath, issue.message);
        results.stats.htmlIssues++;
      } else {
        results.addWarning(relativePath, issue.message);
      }
    }
  }

  console.log(chalk.blue('\n✅ CI validation complete!\n'));

  return results;
}

/**
 * Generate CI report
 * @param {CIResults} results - CI results
 * @param {Object} options - CLI options
 */
async function generateReport(results, options) {
  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const reportDir = path.join(VAULT_ROOT, '.vault-meta', 'reports');

  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const reportPath = path.join(reportDir, `ci-${timestamp}.md`);

  let report = `# Coffee Vault CI Report\n\n`;
  report += `**Generated**: ${new Date().toISOString()}\n`;
  report += `**Files Scanned**: ${results.stats.filesScanned}\n\n`;

  report += `## Summary\n\n`;
  report += `- 🔴 Errors: ${results.errors.length}\n`;
  report += `- 🟡 Warnings: ${results.warnings.length}\n`;
  report += `- 🟢 Passed: ${results.passed.length}\n\n`;

  report += `## Statistics\n\n`;
  report += `| Metric | Count |\n`;
  report += `|--------|-------|\n`;
  report += `| Broken Links | ${results.stats.brokenLinks} |\n`;
  report += `| Missing Frontmatter | ${results.stats.missingFrontmatter} |\n`;
  report += `| Orphaned Files | ${results.stats.orphanedFiles} |\n`;
  report += `| Duplicate Files | ${results.stats.duplicateFiles} |\n`;
  report += `| Invalid YAML | ${results.stats.invalidYAML} |\n`;
  report += `| HTML Issues | ${results.stats.htmlIssues} |\n\n`;

  if (results.errors.length > 0) {
    report += `## Errors\n\n`;
    for (const error of results.errors) {
      report += `- **${error.file}**: ${error.message}\n`;
    }
    report += `\n`;
  }

  if (results.warnings.length > 0) {
    report += `## Warnings\n\n`;
    for (const warning of results.warnings) {
      report += `- **${warning.file}**: ${warning.message}\n`;
    }
    report += `\n`;
  }

  report += `## Exit Code\n\n`;
  report += `${results.getExitCode()} (0=pass, 1=warnings, 2=errors)\n`;

  fs.writeFileSync(reportPath, report);
  console.log(chalk.green(`📄 Report saved to: ${path.relative(VAULT_ROOT, reportPath)}`));
}

/**
 * Display results in console
 * @param {CIResults} results - CI results
 * @param {Object} options - CLI options
 */
function displayResults(results, options) {
  console.log(chalk.bold('\n📊 Validation Results:\n'));

  console.log(chalk.gray(`Files Scanned: ${results.stats.filesScanned}`));
  console.log(chalk.red(`Errors: ${results.errors.length}`));
  console.log(chalk.yellow(`Warnings: ${results.warnings.length}\n`));

  if (options.verbose) {
    if (results.errors.length > 0) {
      console.log(chalk.red.bold('Errors:'));
      results.errors.slice(0, 10).forEach(err => {
        console.log(chalk.red(`  ❌ ${err.file}: ${err.message}`));
      });
      if (results.errors.length > 10) {
        console.log(chalk.red(`  ... and ${results.errors.length - 10} more`));
      }
      console.log();
    }

    if (results.warnings.length > 0) {
      console.log(chalk.yellow.bold('Warnings:'));
      results.warnings.slice(0, 10).forEach(warn => {
        console.log(chalk.yellow(`  ⚠️  ${warn.file}: ${warn.message}`));
      });
      if (results.warnings.length > 10) {
        console.log(chalk.yellow(`  ... and ${results.warnings.length - 10} more`));
      }
      console.log();
    }
  }

  const exitCode = results.getExitCode();
  if (exitCode === 0) {
    console.log(chalk.green.bold('✅ All checks passed!'));
  } else if (exitCode === 1) {
    console.log(chalk.yellow.bold('⚠️  Warnings found (non-critical)'));
  } else {
    console.log(chalk.red.bold('❌ Errors found (requires attention)'));
  }

  console.log(chalk.gray(`\nExit code: ${exitCode}`));
}

/**
 * Main entry point
 */
async function main() {
  const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 [options]')
    .option('fix', {
      alias: 'f',
      type: 'boolean',
      description: 'Auto-fix issues where possible',
      default: false
    })
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Show detailed output',
      default: false
    })
    .option('report-only', {
      alias: 'r',
      type: 'boolean',
      description: 'Generate report without console output',
      default: false
    })
    .help('h')
    .alias('h', 'help')
    .argv;

  try {
    const results = await runCI(argv);

    if (!argv['report-only']) {
      displayResults(results, argv);
    }

    await generateReport(results, argv);

    process.exit(results.getExitCode());
  } catch (error) {
    console.error(chalk.red.bold('❌ CI failed with error:'));
    console.error(error);
    process.exit(2);
  }
}

main();
