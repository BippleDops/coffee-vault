#!/usr/bin/env node

/**
 * Daily Report Generator
 * Version: 1.0.0
 *
 * Automated daily vault health report and QA dashboard.
 *
 * Features:
 * - Aggregates vault statistics by entity type
 * - Tracks new/modified files in last 24 hours
 * - Reports broken links count
 * - Identifies orphaned files
 * - Calculates coverage metrics (beans linked to origins, etc.)
 * - Runs mini CI checks (quick validation)
 * - Generates actionable todo list
 * - Creates markdown report with emoji charts
 * - Designed for daily cron/GitHub Actions execution
 *
 * Output: .vault-meta/reports/daily-YYYYMMDD.md
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
 * Daily report data aggregator
 */
class DailyReportData {
  constructor() {
    this.stats = {
      totalFiles: 0,
      byType: {},
      newFiles24h: [],
      modifiedFiles24h: [],
      brokenLinks: 0,
      orphanedFiles: [],
      coverageMetrics: {}
    };
    this.todos = [];
    this.healthScore = 100;
  }

  addTodo(priority, task) {
    this.todos.push({ priority, task });
  }

  calculateHealthScore() {
    let score = 100;

    // Deduct points for issues
    score -= Math.min(this.stats.brokenLinks * 2, 30);
    score -= Math.min(this.stats.orphanedFiles.length * 1, 20);
    score -= Math.min(this.todos.filter(t => t.priority === 'high').length * 5, 25);

    this.healthScore = Math.max(score, 0);
    return this.healthScore;
  }
}

/**
 * Get file modification time
 * @param {string} filePath - Path to file
 * @returns {Date} - Modification time
 */
function getFileModTime(filePath) {
  const stats = fs.statSync(filePath);
  return stats.mtime;
}

/**
 * Check if file was modified in last N hours
 * @param {string} filePath - Path to file
 * @param {number} hours - Hours threshold
 * @returns {boolean} - True if modified within threshold
 */
function isRecentlyModified(filePath, hours = 24) {
  const modTime = getFileModTime(filePath);
  const now = new Date();
  const threshold = new Date(now - hours * 60 * 60 * 1000);

  return modTime > threshold;
}

/**
 * Count files by entity type
 * @param {Array<string>} files - All markdown files
 * @returns {Object} - Count by type
 */
async function countByEntityType(files) {
  const counts = {};

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const parsed = matter(content);
      const type = parsed.data.type || 'unknown';

      counts[type] = (counts[type] || 0) + 1;
    } catch (error) {
      counts['parse-error'] = (counts['parse-error'] || 0) + 1;
    }
  }

  return counts;
}

/**
 * Extract wikilinks from markdown
 * @param {string} content - Markdown content
 * @returns {Array<string>} - Array of link targets
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
 * Check if link target exists
 * @param {string} target - Link target
 * @param {Array<string>} allFiles - All markdown files
 * @returns {boolean} - True if exists
 */
function linkExists(target, allFiles) {
  const cleanTarget = target.split('/').pop();

  return allFiles.some(file => {
    const baseName = path.basename(file, '.md');
    return baseName === cleanTarget || baseName === target;
  });
}

/**
 * Find broken links in all files
 * @param {Array<string>} files - All markdown files
 * @returns {number} - Count of broken links
 */
async function findBrokenLinks(files) {
  let brokenCount = 0;

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const parsed = matter(content);
      const links = extractWikilinks(parsed.content);

      for (const link of links) {
        if (!linkExists(link, files)) {
          brokenCount++;
        }
      }
    } catch (error) {
      // Skip files with errors
    }
  }

  return brokenCount;
}

/**
 * Find orphaned files (no incoming links)
 * @param {Array<string>} files - All markdown files
 * @returns {Array<string>} - Orphaned files
 */
async function findOrphanedFiles(files) {
  const linkedFiles = new Set();

  // Build set of all linked files
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const parsed = matter(content);
      const links = extractWikilinks(parsed.content);

      for (const link of links) {
        linkedFiles.add(link);
      }
    } catch (error) {
      // Skip
    }
  }

  // Find files not in linkedFiles set
  const orphans = [];
  for (const file of files) {
    const relativePath = path.relative(VAULT_ROOT, file);

    // Skip special directories
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
    if (!linkedFiles.has(baseName)) {
      orphans.push(relativePath);
    }
  }

  return orphans;
}

/**
 * Calculate coverage metrics
 * @param {Array<string>} files - All markdown files
 * @returns {Object} - Coverage metrics
 */
async function calculateCoverageMetrics(files) {
  const metrics = {
    beansWithOrigins: { total: 0, linked: 0, percentage: 0 },
    beansWithRoasters: { total: 0, linked: 0, percentage: 0 },
    logsWithEquipment: { total: 0, linked: 0, percentage: 0 },
    recipesWithEquipment: { total: 0, linked: 0, percentage: 0 }
  };

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const parsed = matter(content);
      const type = parsed.data.type;

      if (type === 'bean-profile') {
        metrics.beansWithOrigins.total++;
        if (parsed.data.origin) {
          metrics.beansWithOrigins.linked++;
        }

        metrics.beansWithRoasters.total++;
        if (parsed.data.roaster) {
          metrics.beansWithRoasters.linked++;
        }
      }

      if (type === 'coffee-log') {
        metrics.logsWithEquipment.total++;
        const links = extractWikilinks(parsed.content);
        if (links.some(link => link.toLowerCase().includes('equipment') ||
                               link.toLowerCase().includes('grinder') ||
                               link.toLowerCase().includes('scale'))) {
          metrics.logsWithEquipment.linked++;
        }
      }

      if (type === 'recipe-profile') {
        metrics.recipesWithEquipment.total++;
        if (parsed.data.relationships?.requires) {
          metrics.recipesWithEquipment.linked++;
        }
      }
    } catch (error) {
      // Skip
    }
  }

  // Calculate percentages
  for (const [key, value] of Object.entries(metrics)) {
    if (value.total > 0) {
      value.percentage = Math.round((value.linked / value.total) * 100);
    }
  }

  return metrics;
}

/**
 * Generate emoji chart
 * @param {number} percentage - Percentage value
 * @param {number} barLength - Length of bar
 * @returns {string} - Emoji chart
 */
function generateEmojiChart(percentage, barLength = 10) {
  const filled = Math.round((percentage / 100) * barLength);
  const empty = barLength - filled;

  let bar = '🟩'.repeat(filled) + '⬜'.repeat(empty);
  return `${bar} ${percentage}%`;
}

/**
 * Generate mermaid pie chart
 * @param {Object} data - Data object
 * @returns {string} - Mermaid chart markdown
 */
function generateMermaidPieChart(data) {
  let chart = '```mermaid\npie title Entity Distribution\n';

  for (const [label, value] of Object.entries(data)) {
    if (value > 0 && label !== 'unknown' && label !== 'parse-error') {
      chart += `  "${label}" : ${value}\n`;
    }
  }

  chart += '```\n';
  return chart;
}

/**
 * Generate daily report
 * @param {DailyReportData} data - Report data
 * @param {Object} options - CLI options
 */
async function generateDailyReport(data, options) {
  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const reportDir = path.join(VAULT_ROOT, '.vault-meta', 'reports');

  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const reportPath = path.join(reportDir, `daily-${timestamp}.md`);
  const now = new Date();

  let report = `# Coffee Vault Daily Report\n\n`;
  report += `**Generated**: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}\n`;
  report += `**Vault Health Score**: ${data.healthScore}/100 `;

  if (data.healthScore >= 90) {
    report += `🟢 Excellent\n\n`;
  } else if (data.healthScore >= 75) {
    report += `🟡 Good\n\n`;
  } else if (data.healthScore >= 50) {
    report += `🟠 Needs Attention\n\n`;
  } else {
    report += `🔴 Critical\n\n`;
  }

  report += `---\n\n`;

  // Overview Statistics
  report += `## 📊 Overview Statistics\n\n`;
  report += `| Metric | Count |\n`;
  report += `|--------|-------|\n`;
  report += `| Total Files | ${data.stats.totalFiles} |\n`;
  report += `| New Files (24h) | ${data.stats.newFiles24h.length} |\n`;
  report += `| Modified Files (24h) | ${data.stats.modifiedFiles24h.length} |\n`;
  report += `| Broken Links | ${data.stats.brokenLinks} |\n`;
  report += `| Orphaned Files | ${data.stats.orphanedFiles.length} |\n\n`;

  // Entity Distribution
  report += `## 📚 Entity Distribution\n\n`;
  report += `| Entity Type | Count |\n`;
  report += `|-------------|-------|\n`;

  const sortedTypes = Object.entries(data.stats.byType)
    .sort((a, b) => b[1] - a[1]);

  for (const [type, count] of sortedTypes) {
    report += `| ${type} | ${count} |\n`;
  }
  report += `\n`;

  // Mermaid chart
  report += generateMermaidPieChart(data.stats.byType);
  report += `\n`;

  // Recent Activity
  if (data.stats.newFiles24h.length > 0) {
    report += `## 🆕 New Files (Last 24 Hours)\n\n`;
    for (const file of data.stats.newFiles24h.slice(0, 10)) {
      report += `- ${file}\n`;
    }
    if (data.stats.newFiles24h.length > 10) {
      report += `\n*...and ${data.stats.newFiles24h.length - 10} more*\n`;
    }
    report += `\n`;
  }

  if (data.stats.modifiedFiles24h.length > 0) {
    report += `## ✏️ Modified Files (Last 24 Hours)\n\n`;
    for (const file of data.stats.modifiedFiles24h.slice(0, 10)) {
      report += `- ${file}\n`;
    }
    if (data.stats.modifiedFiles24h.length > 10) {
      report += `\n*...and ${data.stats.modifiedFiles24h.length - 10} more*\n`;
    }
    report += `\n`;
  }

  // Coverage Metrics
  report += `## 🎯 Coverage Metrics\n\n`;

  for (const [metric, metricData] of Object.entries(data.stats.coverageMetrics)) {
    const label = metric
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());

    report += `### ${label}\n\n`;
    report += generateEmojiChart(metricData.percentage);
    report += `\n\n`;
    report += `${metricData.linked} of ${metricData.total} linked\n\n`;
  }

  // Orphaned Files
  if (data.stats.orphanedFiles.length > 0) {
    report += `## 🔗 Orphaned Files (No Incoming Links)\n\n`;
    for (const file of data.stats.orphanedFiles.slice(0, 15)) {
      report += `- ${file}\n`;
    }
    if (data.stats.orphanedFiles.length > 15) {
      report += `\n*...and ${data.stats.orphanedFiles.length - 15} more*\n`;
    }
    report += `\n`;
  }

  // Todos
  if (data.todos.length > 0) {
    report += `## ✅ Action Items\n\n`;

    const highPriority = data.todos.filter(t => t.priority === 'high');
    const mediumPriority = data.todos.filter(t => t.priority === 'medium');
    const lowPriority = data.todos.filter(t => t.priority === 'low');

    if (highPriority.length > 0) {
      report += `### 🔴 High Priority\n\n`;
      for (const todo of highPriority) {
        report += `- [ ] ${todo.task}\n`;
      }
      report += `\n`;
    }

    if (mediumPriority.length > 0) {
      report += `### 🟡 Medium Priority\n\n`;
      for (const todo of mediumPriority) {
        report += `- [ ] ${todo.task}\n`;
      }
      report += `\n`;
    }

    if (lowPriority.length > 0) {
      report += `### 🔵 Low Priority\n\n`;
      for (const todo of lowPriority) {
        report += `- [ ] ${todo.task}\n`;
      }
      report += `\n`;
    }
  }

  report += `---\n\n`;
  report += `*Generated by Coffee Vault Daily Report Generator v1.0.0*\n`;
  report += `*Next report: ${new Date(now.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString()}*\n`;

  fs.writeFileSync(reportPath, report);

  return reportPath;
}

/**
 * Main entry point
 */
async function main() {
  const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 [options]')
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Show detailed output',
      default: false
    })
    .option('hours', {
      type: 'number',
      description: 'Hours threshold for "recent" files',
      default: 24
    })
    .help('h')
    .alias('h', 'help')
    .argv;

  console.log(chalk.blue.bold('📊 Coffee Vault Daily Report Generator\n'));

  try {
    const data = new DailyReportData();

    // Find all markdown files
    console.log(chalk.gray('Scanning vault...'));
    const markdownFiles = await glob('**/*.md', {
      cwd: VAULT_ROOT,
      ignore: ['node_modules/**', '.git/**', '.obsidian/**'],
      absolute: true
    });

    data.stats.totalFiles = markdownFiles.length;
    console.log(chalk.gray(`Found ${markdownFiles.length} markdown files\n`));

    // Count by entity type
    console.log(chalk.blue('📋 Analyzing entity types...'));
    data.stats.byType = await countByEntityType(markdownFiles);

    // Find recent files
    console.log(chalk.blue('🆕 Finding recent files...'));
    for (const file of markdownFiles) {
      if (isRecentlyModified(file, argv.hours)) {
        const relativePath = path.relative(VAULT_ROOT, file);

        // Check if it's a new file (created in last 24h)
        const stats = fs.statSync(file);
        const created = stats.birthtime;
        const now = new Date();
        const threshold = new Date(now - argv.hours * 60 * 60 * 1000);

        if (created > threshold) {
          data.stats.newFiles24h.push(relativePath);
        } else {
          data.stats.modifiedFiles24h.push(relativePath);
        }
      }
    }

    // Check for broken links
    console.log(chalk.blue('🔗 Checking for broken links...'));
    data.stats.brokenLinks = await findBrokenLinks(markdownFiles);

    // Find orphaned files
    console.log(chalk.blue('🔍 Finding orphaned files...'));
    data.stats.orphanedFiles = await findOrphanedFiles(markdownFiles);

    // Calculate coverage metrics
    console.log(chalk.blue('🎯 Calculating coverage metrics...'));
    data.stats.coverageMetrics = await calculateCoverageMetrics(markdownFiles);

    // Generate todos based on findings
    if (data.stats.brokenLinks > 0) {
      data.addTodo('high', `Fix ${data.stats.brokenLinks} broken wikilink(s)`);
    }

    if (data.stats.orphanedFiles.length > 10) {
      data.addTodo('medium', `Review and link ${data.stats.orphanedFiles.length} orphaned files`);
    }

    if (data.stats.coverageMetrics.beansWithOrigins.percentage < 80) {
      data.addTodo('medium', 'Link more beans to their origins (currently ' +
                   `${data.stats.coverageMetrics.beansWithOrigins.percentage}%)`);
    }

    if (data.stats.newFiles24h.length === 0 && data.stats.modifiedFiles24h.length === 0) {
      data.addTodo('low', 'No activity in last 24 hours - consider logging coffee sessions');
    }

    // Calculate health score
    data.calculateHealthScore();

    console.log(chalk.blue('📝 Generating report...\n'));

    // Generate report
    const reportPath = await generateDailyReport(data, argv);

    // Display summary
    console.log(chalk.bold('Summary:\n'));
    console.log(chalk.gray(`Total Files: ${data.stats.totalFiles}`));
    console.log(chalk.green(`New Files (24h): ${data.stats.newFiles24h.length}`));
    console.log(chalk.yellow(`Modified Files (24h): ${data.stats.modifiedFiles24h.length}`));

    if (data.stats.brokenLinks > 0) {
      console.log(chalk.red(`Broken Links: ${data.stats.brokenLinks}`));
    } else {
      console.log(chalk.green(`Broken Links: 0`));
    }

    if (data.stats.orphanedFiles.length > 0) {
      console.log(chalk.yellow(`Orphaned Files: ${data.stats.orphanedFiles.length}`));
    }

    console.log(chalk.bold(`\nVault Health Score: ${data.healthScore}/100`));

    if (data.healthScore >= 90) {
      console.log(chalk.green.bold('🟢 Excellent!'));
    } else if (data.healthScore >= 75) {
      console.log(chalk.yellow.bold('🟡 Good'));
    } else if (data.healthScore >= 50) {
      console.log(chalk.hex('#FFA500').bold('🟠 Needs Attention'));
    } else {
      console.log(chalk.red.bold('🔴 Critical'));
    }

    console.log(chalk.green(`\n✅ Report saved to: ${path.relative(VAULT_ROOT, reportPath)}`));

    process.exit(0);
  } catch (error) {
    console.error(chalk.red.bold('\n❌ Report generation failed:'));
    console.error(error);
    process.exit(1);
  }
}

main();
