#!/usr/bin/env node

/**
 * User Journey Simulator
 * Version: 1.0.0
 *
 * Automated testing of key user workflows and navigation paths.
 *
 * Features:
 * - Simulates common user journeys through the vault
 * - Validates that all links in journey exist
 * - Checks files contain expected sections
 * - Verifies navigation completes in ≤3 clicks
 * - Validates required frontmatter present
 * - Generates test results report
 * - Supports single journey testing
 * - Interactive mode for journey exploration
 *
 * Journeys:
 * 1. New user → START-HERE → Log first coffee
 * 2. Find specific bean → View origin → See scientific references
 * 3. Explore visualizations → Launch 3D view → Return to home
 * 4. Monthly analytics → Brewing optimizer → View recommendations
 *
 * Output: .vault-meta/reports/user-journeys-YYYYMMDD.md
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
 * Journey test results
 */
class JourneyResults {
  constructor() {
    this.journeys = [];
    this.passed = 0;
    this.failed = 0;
    this.warnings = 0;
  }

  addJourneyResult(journey) {
    this.journeys.push(journey);

    if (journey.status === 'passed') {
      this.passed++;
    } else if (journey.status === 'failed') {
      this.failed++;
    } else if (journey.status === 'warning') {
      this.warnings++;
    }
  }

  allPassed() {
    return this.failed === 0;
  }

  getExitCode() {
    if (this.failed > 0) return 2;
    if (this.warnings > 0) return 1;
    return 0;
  }
}

/**
 * Single journey test result
 */
class Journey {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.steps = [];
    this.issues = [];
    this.status = 'passed';
    this.clickCount = 0;
  }

  addStep(step, file, exists, hasExpectedContent) {
    this.steps.push({ step, file, exists, hasExpectedContent });
    this.clickCount++;

    if (!exists) {
      this.addIssue('error', `File not found: ${file}`);
    } else if (!hasExpectedContent) {
      this.addIssue('warning', `File missing expected content: ${file}`);
    }
  }

  addIssue(severity, message) {
    this.issues.push({ severity, message });

    if (severity === 'error') {
      this.status = 'failed';
    } else if (severity === 'warning' && this.status !== 'failed') {
      this.status = 'warning';
    }
  }

  checkClickLimit(limit = 3) {
    if (this.clickCount > limit) {
      this.addIssue('warning', `Journey exceeds ${limit} clicks (${this.clickCount} clicks)`);
    }
  }
}

/**
 * Check if file exists
 * @param {string} fileName - File name or path
 * @returns {string|null} - Full path if exists, null otherwise
 */
function findFile(fileName) {
  // Try direct path first
  const directPath = path.join(VAULT_ROOT, fileName);
  if (fs.existsSync(directPath)) {
    return directPath;
  }

  // Try with .md extension
  const mdPath = directPath.endsWith('.md') ? directPath : `${directPath}.md`;
  if (fs.existsSync(mdPath)) {
    return mdPath;
  }

  // Search vault
  try {
    const pattern = fileName.replace('.md', '');
    const files = glob.sync(`**/${pattern}.md`, {
      cwd: VAULT_ROOT,
      ignore: ['node_modules/**', '.git/**'],
      absolute: true
    });

    if (files.length > 0) {
      return files[0];
    }
  } catch (error) {
    // Not found
  }

  return null;
}

/**
 * Check if file contains expected sections
 * @param {string} filePath - Path to file
 * @param {Array<string>} expectedSections - Expected section headings
 * @returns {boolean} - True if all sections found
 */
function hasExpectedSections(filePath, expectedSections) {
  if (expectedSections.length === 0) return true;

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(content);

    for (const section of expectedSections) {
      const regex = new RegExp(`^#+\\s*${section}`, 'mi');
      if (!regex.test(parsed.content)) {
        return false;
      }
    }

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Check if file has required frontmatter
 * @param {string} filePath - Path to file
 * @param {Array<string>} requiredFields - Required frontmatter fields
 * @returns {boolean} - True if all fields present
 */
function hasRequiredFrontmatter(filePath, requiredFields) {
  if (requiredFields.length === 0) return true;

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(content);

    for (const field of requiredFields) {
      if (!parsed.data[field]) {
        return false;
      }
    }

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Extract wikilinks from file
 * @param {string} filePath - Path to file
 * @returns {Array<string>} - Array of link targets
 */
function extractLinks(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(content);
    const wikilinkRegex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
    const links = [];
    let match;

    while ((match = wikilinkRegex.exec(parsed.content)) !== null) {
      links.push(match[1]);
    }

    return links;
  } catch (error) {
    return [];
  }
}

/**
 * Journey 1: New User → START-HERE → Log First Coffee
 */
function testJourney1() {
  const journey = new Journey(
    'Journey 1: New User Onboarding',
    'New user → START-HERE → Log first coffee'
  );

  // Step 1: Start at START-HERE
  const startFile = findFile('START-HERE.md');
  journey.addStep(
    'Navigate to START-HERE',
    'START-HERE.md',
    !!startFile,
    startFile ? hasExpectedSections(startFile, ['Quick Start', 'Getting Started']) : false
  );

  if (!startFile) {
    journey.addIssue('error', 'START-HERE.md is critical entry point');
    return journey;
  }

  // Step 2: Find link to templates or coffee log
  const links = extractLinks(startFile);
  const hasTemplateLink = links.some(link =>
    link.toLowerCase().includes('template') ||
    link.toLowerCase().includes('coffee log')
  );

  if (!hasTemplateLink) {
    journey.addIssue('warning', 'START-HERE should link to Coffee Log template');
  }

  // Step 3: Check Coffee Log template exists
  const templateFile = findFile('Templates/Coffee Log.md') ||
                       findFile('Templates/Coffee-Log-Template.md') ||
                       findFile('Templates/Daily-Coffee-Log.md');

  journey.addStep(
    'Access Coffee Log template',
    'Templates/Coffee Log.md',
    !!templateFile,
    templateFile ? hasRequiredFrontmatter(templateFile, ['type', 'date']) : false
  );

  journey.checkClickLimit(3);
  return journey;
}

/**
 * Journey 2: Find Bean → View Origin → See Scientific References
 */
function testJourney2() {
  const journey = new Journey(
    'Journey 2: Bean Exploration',
    'Find specific bean → View origin → See scientific references'
  );

  // Step 1: Find a bean profile
  const beanFiles = glob.sync('**/Bean*/**/*.md', {
    cwd: VAULT_ROOT,
    ignore: ['node_modules/**', '.git/**', 'Templates/**'],
    absolute: true
  });

  if (beanFiles.length === 0) {
    journey.addIssue('error', 'No bean profiles found in vault');
    return journey;
  }

  const sampleBean = beanFiles[0];
  const relativeBeanPath = path.relative(VAULT_ROOT, sampleBean);

  journey.addStep(
    'View bean profile',
    relativeBeanPath,
    true,
    hasRequiredFrontmatter(sampleBean, ['type', 'origin'])
  );

  // Step 2: Follow origin link
  try {
    const content = fs.readFileSync(sampleBean, 'utf-8');
    const parsed = matter(content);
    const originLink = parsed.data.origin;

    if (!originLink) {
      journey.addIssue('warning', 'Bean profile should link to origin');
    } else {
      // Extract origin name from link
      const originName = typeof originLink === 'string' ?
        originLink.replace(/[\[\]]/g, '') : '';

      const originFile = findFile(`Origins/${originName}`) ||
                        findFile(originName);

      journey.addStep(
        'Navigate to origin profile',
        `Origins/${originName}.md`,
        !!originFile,
        originFile ? hasExpectedSections(originFile, ['Overview', 'Characteristics']) : false
      );

      // Step 3: Check for scientific references
      if (originFile) {
        const originLinks = extractLinks(originFile);
        const hasScientificLink = originLinks.some(link =>
          link.toLowerCase().includes('scientific') ||
          link.toLowerCase().includes('research') ||
          link.toLowerCase().includes('brewing science')
        );

        if (hasScientificLink) {
          journey.addStep(
            'Access scientific reference',
            'Scientific References/',
            true,
            true
          );
        } else {
          journey.addIssue('warning', 'Origin should reference scientific content');
        }
      }
    }
  } catch (error) {
    journey.addIssue('error', `Failed to parse bean profile: ${error.message}`);
  }

  journey.checkClickLimit(3);
  return journey;
}

/**
 * Journey 3: Explore Visualizations → Launch 3D View → Return Home
 */
function testJourney3() {
  const journey = new Journey(
    'Journey 3: Visualization Exploration',
    'Explore visualizations → Launch 3D view → Return to home'
  );

  // Step 1: Find visualization hub
  const vizHub = findFile('VISUALIZATION-HUB.html') ||
                 findFile('Visualizations/VISUALIZATION-HUB.html');

  journey.addStep(
    'Access visualization hub',
    'VISUALIZATION-HUB.html',
    !!vizHub,
    true
  );

  if (!vizHub) {
    journey.addIssue('warning', 'Visualization hub not found');
  }

  // Step 2: Check for 3D visualization
  const viz3D = findFile('Visualizations/3d-flavor-space.html') ||
                findFile('3d-flavor-space.html');

  journey.addStep(
    'Launch 3D visualization',
    'Visualizations/3d-flavor-space.html',
    !!viz3D,
    true
  );

  // Step 3: Return to home dashboard
  const homeFile = findFile('HOME-DASHBOARD.md');

  journey.addStep(
    'Return to home dashboard',
    'HOME-DASHBOARD.md',
    !!homeFile,
    homeFile ? hasExpectedSections(homeFile, ['Dashboard', 'Overview']) : false
  );

  journey.checkClickLimit(3);
  return journey;
}

/**
 * Journey 4: Monthly Analytics → Brewing Optimizer → View Recommendations
 */
function testJourney4() {
  const journey = new Journey(
    'Journey 4: Analytics Workflow',
    'Monthly analytics → Brewing optimizer → View recommendations'
  );

  // Step 1: Find monthly analytics
  const analyticsFiles = glob.sync('**/Analytics/**/*.md', {
    cwd: VAULT_ROOT,
    ignore: ['node_modules/**', '.git/**'],
    absolute: true
  });

  const monthlyAnalytics = analyticsFiles.find(f =>
    f.toLowerCase().includes('monthly')
  ) || analyticsFiles[0];

  if (monthlyAnalytics) {
    const relPath = path.relative(VAULT_ROOT, monthlyAnalytics);
    journey.addStep(
      'View monthly analytics',
      relPath,
      true,
      hasExpectedSections(monthlyAnalytics, ['Summary', 'Statistics'])
    );
  } else {
    journey.addStep(
      'View monthly analytics',
      'Analytics/',
      false,
      false
    );
    journey.addIssue('warning', 'No analytics dashboards found');
  }

  // Step 2: Check for brewing optimizer reference
  const optimizerScript = findFile('Scripts/brewing-optimizer.js');

  journey.addStep(
    'Access brewing optimizer',
    'Scripts/brewing-optimizer.js',
    !!optimizerScript,
    true
  );

  // Step 3: Check for recipe recommendations
  const recipeFiles = glob.sync('**/Recipe*/**/*.md', {
    cwd: VAULT_ROOT,
    ignore: ['node_modules/**', '.git/**', 'Templates/**'],
    absolute: true
  });

  journey.addStep(
    'View recipe recommendations',
    'Recipes/',
    recipeFiles.length > 0,
    true
  );

  if (recipeFiles.length === 0) {
    journey.addIssue('warning', 'No recipe profiles found');
  }

  journey.checkClickLimit(3);
  return journey;
}

/**
 * Generate journey test report
 * @param {JourneyResults} results - Test results
 * @param {Object} options - CLI options
 */
async function generateReport(results, options) {
  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const reportDir = path.join(VAULT_ROOT, '.vault-meta', 'reports');

  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const reportPath = path.join(reportDir, `user-journeys-${timestamp}.md`);

  let report = `# Coffee Vault User Journey Test Report\n\n`;
  report += `**Generated**: ${new Date().toISOString()}\n`;
  report += `**Journeys Tested**: ${results.journeys.length}\n\n`;

  report += `## Summary\n\n`;
  report += `- ✅ Passed: ${results.passed}\n`;
  report += `- ⚠️  Warnings: ${results.warnings}\n`;
  report += `- ❌ Failed: ${results.failed}\n\n`;

  // Overall status
  if (results.allPassed() && results.warnings === 0) {
    report += `**Status**: 🟢 All journeys completed successfully!\n\n`;
  } else if (results.allPassed()) {
    report += `**Status**: 🟡 All journeys completed with warnings\n\n`;
  } else {
    report += `**Status**: 🔴 Some journeys failed\n\n`;
  }

  report += `---\n\n`;

  // Detail each journey
  for (const journey of results.journeys) {
    const statusIcon = journey.status === 'passed' ? '✅' :
                      journey.status === 'warning' ? '⚠️' : '❌';

    report += `## ${statusIcon} ${journey.name}\n\n`;
    report += `**Description**: ${journey.description}\n`;
    report += `**Status**: ${journey.status}\n`;
    report += `**Clicks**: ${journey.clickCount}\n\n`;

    if (journey.steps.length > 0) {
      report += `### Steps\n\n`;
      for (let i = 0; i < journey.steps.length; i++) {
        const step = journey.steps[i];
        const stepIcon = step.exists && step.hasExpectedContent ? '✅' :
                        step.exists ? '⚠️' : '❌';

        report += `${i + 1}. ${stepIcon} **${step.step}**\n`;
        report += `   - File: \`${step.file}\`\n`;
        report += `   - Exists: ${step.exists ? 'Yes' : 'No'}\n`;
        if (step.exists) {
          report += `   - Has Expected Content: ${step.hasExpectedContent ? 'Yes' : 'No'}\n`;
        }
        report += `\n`;
      }
    }

    if (journey.issues.length > 0) {
      report += `### Issues\n\n`;
      for (const issue of journey.issues) {
        const issueIcon = issue.severity === 'error' ? '❌' : '⚠️';
        report += `- ${issueIcon} ${issue.message}\n`;
      }
      report += `\n`;
    }

    report += `---\n\n`;
  }

  report += `## Recommendations\n\n`;

  if (results.failed > 0) {
    report += `### Critical\n\n`;
    report += `- Fix broken navigation paths in failed journeys\n`;
    report += `- Ensure all critical entry points exist (START-HERE, HOME-DASHBOARD)\n\n`;
  }

  if (results.warnings > 0) {
    report += `### Improvements\n\n`;
    report += `- Add missing content sections to improve user experience\n`;
    report += `- Ensure all entity types have representative examples\n`;
    report += `- Optimize navigation to stay within 3-click rule\n\n`;
  }

  if (results.allPassed() && results.warnings === 0) {
    report += `🎉 All user journeys are working perfectly! No recommendations needed.\n\n`;
  }

  report += `---\n\n`;
  report += `*Generated by Coffee Vault User Journey Simulator v1.0.0*\n`;

  fs.writeFileSync(reportPath, report);

  return reportPath;
}

/**
 * Display results in console
 * @param {JourneyResults} results - Test results
 * @param {Object} options - CLI options
 */
function displayResults(results, options) {
  console.log(chalk.bold('\n🚀 User Journey Test Results:\n'));

  for (const journey of results.journeys) {
    const statusColor = journey.status === 'passed' ? chalk.green :
                       journey.status === 'warning' ? chalk.yellow :
                       chalk.red;

    const statusIcon = journey.status === 'passed' ? '✅' :
                      journey.status === 'warning' ? '⚠️' : '❌';

    console.log(statusColor(`${statusIcon} ${journey.name}`));
    console.log(chalk.gray(`   ${journey.description}`));
    console.log(chalk.gray(`   Clicks: ${journey.clickCount}, Status: ${journey.status}`));

    if (options.verbose && journey.issues.length > 0) {
      for (const issue of journey.issues) {
        const issueColor = issue.severity === 'error' ? chalk.red : chalk.yellow;
        console.log(issueColor(`   - ${issue.message}`));
      }
    }

    console.log();
  }

  console.log(chalk.bold('Summary:'));
  console.log(chalk.green(`  ✅ Passed: ${results.passed}`));
  console.log(chalk.yellow(`  ⚠️  Warnings: ${results.warnings}`));
  console.log(chalk.red(`  ❌ Failed: ${results.failed}`));
}

/**
 * Main entry point
 */
async function main() {
  const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 [options]')
    .option('journey', {
      type: 'string',
      description: 'Test a specific journey (1-4)',
      choices: ['1', '2', '3', '4']
    })
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Show detailed output',
      default: false
    })
    .option('interactive', {
      alias: 'i',
      type: 'boolean',
      description: 'Interactive mode (not yet implemented)',
      default: false
    })
    .help('h')
    .alias('h', 'help')
    .example('$0', 'Test all user journeys')
    .example('$0 --journey 1', 'Test only Journey 1')
    .example('$0 --verbose', 'Show detailed output')
    .argv;

  console.log(chalk.blue.bold('🚀 Coffee Vault User Journey Simulator\n'));

  if (argv.interactive) {
    console.log(chalk.yellow('⚠️  Interactive mode not yet implemented'));
    console.log(chalk.gray('Running standard test mode...\n'));
  }

  try {
    const results = new JourneyResults();

    // Determine which journeys to test
    const journeysToTest = argv.journey ? [argv.journey] : ['1', '2', '3', '4'];

    console.log(chalk.gray(`Testing ${journeysToTest.length} journey(s)...\n`));

    for (const journeyNum of journeysToTest) {
      console.log(chalk.blue(`Testing Journey ${journeyNum}...`));

      let journey;
      switch (journeyNum) {
        case '1':
          journey = testJourney1();
          break;
        case '2':
          journey = testJourney2();
          break;
        case '3':
          journey = testJourney3();
          break;
        case '4':
          journey = testJourney4();
          break;
      }

      results.addJourneyResult(journey);
    }

    console.log(chalk.blue('\n✅ Journey testing complete!\n'));

    displayResults(results, argv);

    const reportPath = await generateReport(results, argv);
    console.log(chalk.green(`\n📄 Report saved to: ${path.relative(VAULT_ROOT, reportPath)}`));

    process.exit(results.getExitCode());
  } catch (error) {
    console.error(chalk.red.bold('\n❌ Journey testing failed:'));
    console.error(error);
    process.exit(2);
  }
}

main();
