#!/usr/bin/env node

/**
 * Scheduled Maintenance Orchestrator for Coffee Vault 7.0
 * Version: 1.0.0
 *
 * Orchestrates all automation scripts in a coordinated workflow.
 *
 * Workflow:
 * 1. Run CI checks (vault-ci.js)
 * 2. Check content quality (content-quality-scorer.js)
 * 3. Suggest links (link-suggester-ai.js)
 * 4. Detect duplicates (duplicate-detector.js)
 * 5. Suggest tags (auto-tagger.js)
 * 6. Generate accessibility report (accessibility-audit.js)
 * 7. Generate daily report (daily-report-generator.js)
 * 8. Generate combined summary report
 *
 * Schedules:
 * - Daily: CI checks, quality scoring, link suggestions
 * - Weekly: Duplicate detection, tag suggestions, accessibility
 * - Monthly: Full comprehensive report with all checks
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VAULT_ROOT = path.resolve(__dirname, '..');

/**
 * Task definitions
 */
const TASKS = {
  ci: {
    name: 'CI Validation',
    script: 'vault-ci.js',
    args: [],
    schedule: ['daily', 'weekly', 'monthly']
  },
  quality: {
    name: 'Quality Scoring',
    script: 'content-quality-scorer.js',
    args: [],
    schedule: ['daily', 'weekly', 'monthly']
  },
  links: {
    name: 'Link Suggestions',
    script: 'link-suggester-ai.js',
    args: ['--report-only'],
    schedule: ['daily', 'weekly', 'monthly']
  },
  duplicates: {
    name: 'Duplicate Detection',
    script: 'duplicate-detector.js',
    args: ['--report-only'],
    schedule: ['weekly', 'monthly']
  },
  tags: {
    name: 'Tag Suggestions',
    script: 'auto-tagger.js',
    args: ['--dry-run'],
    schedule: ['weekly', 'monthly']
  },
  accessibility: {
    name: 'Accessibility Audit',
    script: 'accessibility-audit.js',
    args: [],
    schedule: ['weekly', 'monthly']
  },
  daily: {
    name: 'Daily Report',
    script: 'daily-report-generator.js',
    args: [],
    schedule: ['daily', 'weekly', 'monthly']
  }
};

/**
 * Results tracker
 */
class MaintenanceResults {
  constructor() {
    this.tasks = [];
    this.startTime = new Date();
    this.endTime = null;
  }

  addTask(taskName, status, duration, output, error) {
    this.tasks.push({
      name: taskName,
      status, // 'success', 'failed', 'skipped'
      duration,
      output: output || '',
      error: error || null
    });
  }

  finish() {
    this.endTime = new Date();
  }

  getTotalDuration() {
    return this.endTime - this.startTime;
  }

  getSuccessCount() {
    return this.tasks.filter(t => t.status === 'success').length;
  }

  getFailedCount() {
    return this.tasks.filter(t => t.status === 'failed').length;
  }
}

/**
 * Run a single task
 * @param {string} taskId - Task identifier
 * @param {Object} task - Task definition
 * @returns {Promise<Object>} - Task result
 */
function runTask(taskId, task) {
  return new Promise((resolve) => {
    console.log(`\n🔄 Running: ${task.name}...`);
    const startTime = Date.now();

    const scriptPath = path.join(__dirname, task.script);

    // Check if script exists
    if (!fs.existsSync(scriptPath)) {
      console.log(`⚠️  Skipped: ${task.name} (script not found)`);
      resolve({
        status: 'skipped',
        duration: 0,
        output: '',
        error: 'Script not found'
      });
      return;
    }

    const child = spawn('node', [scriptPath, ...task.args], {
      cwd: VAULT_ROOT,
      stdio: 'pipe'
    });

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('close', (code) => {
      const duration = Date.now() - startTime;

      if (code === 0 || code === 1) {
        // 0 = success, 1 = warnings (still considered success)
        console.log(`✅ Completed: ${task.name} (${(duration / 1000).toFixed(2)}s)`);
        resolve({
          status: 'success',
          duration,
          output,
          error: null
        });
      } else {
        console.log(`❌ Failed: ${task.name} (exit code: ${code})`);
        resolve({
          status: 'failed',
          duration,
          output,
          error: errorOutput || `Exit code: ${code}`
        });
      }
    });

    child.on('error', (err) => {
      const duration = Date.now() - startTime;
      console.log(`❌ Error: ${task.name} - ${err.message}`);
      resolve({
        status: 'failed',
        duration,
        output: '',
        error: err.message
      });
    });
  });
}

/**
 * Run maintenance workflow
 * @param {string} schedule - Schedule type (daily, weekly, monthly)
 * @param {Array<string>} specificTasks - Specific tasks to run
 * @returns {Promise<MaintenanceResults>} - Results
 */
async function runMaintenance(schedule, specificTasks = null) {
  const results = new MaintenanceResults();

  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     Coffee Vault 7.0 - Scheduled Maintenance              ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`\n📅 Schedule: ${schedule}`);
  console.log(`⏰ Started: ${results.startTime.toISOString()}\n`);

  // Determine which tasks to run
  const tasksToRun = [];

  for (const [taskId, task] of Object.entries(TASKS)) {
    // If specific tasks provided, only run those
    if (specificTasks && !specificTasks.includes(taskId)) {
      continue;
    }

    // Check if task is scheduled for this run
    if (task.schedule.includes(schedule)) {
      tasksToRun.push({ id: taskId, ...task });
    }
  }

  console.log(`📋 Tasks to run: ${tasksToRun.length}`);
  console.log('─'.repeat(60));

  // Run tasks sequentially
  for (const task of tasksToRun) {
    const result = await runTask(task.id, task);
    results.addTask(task.name, result.status, result.duration, result.output, result.error);
  }

  results.finish();

  console.log('\n' + '─'.repeat(60));
  console.log('✅ Maintenance workflow complete!\n');

  return results;
}

/**
 * Generate combined summary report
 * @param {MaintenanceResults} results - Maintenance results
 * @param {string} schedule - Schedule type
 * @returns {string} - Markdown report
 */
function generateSummaryReport(results, schedule) {
  const lines = [];

  lines.push('# Scheduled Maintenance Summary Report');
  lines.push('');
  lines.push(`**Schedule**: ${schedule}`);
  lines.push(`**Started**: ${results.startTime.toISOString()}`);
  lines.push(`**Completed**: ${results.endTime.toISOString()}`);
  lines.push(`**Duration**: ${(results.getTotalDuration() / 1000).toFixed(2)}s`);
  lines.push('');

  lines.push('## Summary');
  lines.push('');
  lines.push(`- **Total tasks**: ${results.tasks.length}`);
  lines.push(`- **Successful**: ${results.getSuccessCount()}`);
  lines.push(`- **Failed**: ${results.getFailedCount()}`);
  lines.push(`- **Skipped**: ${results.tasks.filter(t => t.status === 'skipped').length}`);
  lines.push('');

  lines.push('## Task Results');
  lines.push('');
  lines.push('| Task | Status | Duration |');
  lines.push('|------|--------|----------|');

  for (const task of results.tasks) {
    const statusIcon = task.status === 'success' ? '✅' : (task.status === 'failed' ? '❌' : '⚠️');
    const duration = `${(task.duration / 1000).toFixed(2)}s`;

    lines.push(`| ${task.name} | ${statusIcon} ${task.status} | ${duration} |`);
  }
  lines.push('');

  // Failed tasks details
  const failedTasks = results.tasks.filter(t => t.status === 'failed');
  if (failedTasks.length > 0) {
    lines.push('## Failed Tasks');
    lines.push('');

    for (const task of failedTasks) {
      lines.push(`### ${task.name}`);
      lines.push('');
      lines.push('**Error**:');
      lines.push('```');
      lines.push(task.error || 'Unknown error');
      lines.push('```');
      lines.push('');
    }
  }

  lines.push('## Individual Reports');
  lines.push('');
  lines.push('Check the following reports for detailed results:');
  lines.push('');

  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');

  lines.push('- CI Report: `.vault-meta/reports/ci-${date}.md`');
  lines.push('- Quality Scores: `.vault-meta/reports/quality-scores-${date}.md`');
  lines.push('- Link Suggestions: `.vault-meta/reports/link-suggestions-${date}.md`');
  lines.push('- Duplicates: `.vault-meta/reports/duplicates-${date}.md`');
  lines.push('- Tag Suggestions: `.vault-meta/reports/auto-tagging-${date}.md`');
  lines.push('- Accessibility: `.vault-meta/reports/accessibility-${date}.md`');
  lines.push('- Daily Report: `.vault-meta/reports/daily-report-${date}.md`');
  lines.push('');

  lines.push('---');
  lines.push('');
  lines.push('*Generated by Scheduled Maintenance v1.0*');

  return lines.join('\n');
}

/**
 * Save summary report
 * @param {string} report - Report content
 * @param {string} schedule - Schedule type
 */
function saveSummaryReport(report, schedule) {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const reportDir = path.join(VAULT_ROOT, '.vault-meta', 'reports');

  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const reportPath = path.join(reportDir, `maintenance-${schedule}-${date}.md`);
  fs.writeFileSync(reportPath, report);

  console.log(`📄 Summary report saved to: ${path.relative(VAULT_ROOT, reportPath)}`);
}

/**
 * Main entry point
 */
async function main() {
  const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 [options]')
    .option('schedule', {
      type: 'string',
      description: 'Schedule type',
      choices: ['daily', 'weekly', 'monthly'],
      default: 'daily'
    })
    .option('tasks', {
      type: 'string',
      description: 'Comma-separated list of specific tasks to run',
      default: null
    })
    .option('report-email', {
      type: 'string',
      description: 'Email address to send report (not yet implemented)',
      default: null
    })
    .help('h')
    .alias('h', 'help')
    .example('$0 --schedule daily', 'Run daily maintenance tasks')
    .example('$0 --schedule weekly', 'Run weekly maintenance tasks')
    .example('$0 --tasks ci,quality', 'Run only CI and quality scoring')
    .argv;

  try {
    const schedule = argv.schedule;
    const specificTasks = argv.tasks ? argv.tasks.split(',').map(t => t.trim()) : null;

    const results = await runMaintenance(schedule, specificTasks);

    // Generate and save summary report
    const summaryReport = generateSummaryReport(results, schedule);
    saveSummaryReport(summaryReport, schedule);

    // Console summary
    console.log('\n📊 Maintenance Summary:');
    console.log(`   Total tasks: ${results.tasks.length}`);
    console.log(`   Successful: ${results.getSuccessCount()}`);
    console.log(`   Failed: ${results.getFailedCount()}`);
    console.log(`   Duration: ${(results.getTotalDuration() / 1000).toFixed(2)}s`);

    if (argv['report-email']) {
      console.log(`\n📧 Email notification to ${argv['report-email']} (not yet implemented)`);
    }

    // Exit with error code if any tasks failed
    process.exit(results.getFailedCount() > 0 ? 1 : 0);

  } catch (error) {
    console.error('❌ Maintenance failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
