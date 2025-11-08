/**
 * Coffee Vault - Weekly Summary Generator
 * Automatically generates weekly reports for coffee brewing activities
 * @module weekly-summary
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Validates date range parameters
 * @private
 * @param {Date} startDate - Start date of the week
 * @param {Date} endDate - End date of the week
 * @throws {Error} If dates are invalid
 */
function validateDateRange(startDate, endDate) {
  if (!(startDate instanceof Date) || isNaN(startDate)) {
    throw new Error('Invalid start date provided');
  }
  if (!(endDate instanceof Date) || isNaN(endDate)) {
    throw new Error('Invalid end date provided');
  }
  if (startDate > endDate) {
    throw new Error('Start date must be before end date');
  }
}

/**
 * Generates a weekly summary report for coffee brewing activities
 * @async
 * @param {Object} options - Configuration options
 * @param {Date} options.startDate - Start date of the week
 * @param {Date} options.endDate - End date of the week
 * @param {string} options.dataPath - Path to coffee logs directory
 * @param {string} [options.outputPath] - Path to save the report (optional)
 * @returns {Promise<Object>} Weekly summary statistics
 * @throws {Error} If parameters are invalid or file operations fail
 *
 * @example
 * const summary = await generateWeeklySummary({
 *   startDate: new Date('2025-10-20'),
 *   endDate: new Date('2025-10-26'),
 *   dataPath: '/path/to/coffee-logs',
 *   outputPath: '/path/to/reports/week-43.md'
 * });
 * console.log(`Total brews: ${summary.totalBrews}`);
 */
async function generateWeeklySummary(options) {
  try {
    // Input validation
    if (!options || typeof options !== 'object') {
      throw new Error('Options object is required');
    }

    const { startDate, endDate, dataPath, outputPath } = options;

    if (!dataPath || typeof dataPath !== 'string') {
      throw new Error('dataPath is required and must be a string');
    }

    validateDateRange(startDate, endDate);

    // Read coffee logs from the data path
    const logs = await readCoffeeLogs(dataPath, startDate, endDate);

    // Calculate statistics
    const stats = calculateWeeklyStats(logs);

    // Generate markdown report
    const report = formatWeeklyReport(stats, startDate, endDate);

    // Save report if output path provided
    if (outputPath) {
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, report, 'utf8');
    }

    return {
      ...stats,
      report,
      generatedAt: new Date().toISOString()
    };

  } catch (error) {
    throw new Error(`Failed to generate weekly summary: ${error.message}`);
  }
}

/**
 * Reads coffee logs from files within date range
 * @async
 * @private
 * @param {string} dataPath - Path to coffee logs directory
 * @param {Date} startDate - Start date filter
 * @param {Date} endDate - End date filter
 * @returns {Promise<Array>} Array of coffee log entries
 */
async function readCoffeeLogs(dataPath, startDate, endDate) {
  try {
    const files = await fs.readdir(dataPath);
    const logs = [];

    for (const file of files) {
      if (file.endsWith('.md') || file.endsWith('.json')) {
        const filePath = path.join(dataPath, file);
        const content = await fs.readFile(filePath, 'utf8');

        // Parse content based on file type
        const entries = file.endsWith('.json')
          ? JSON.parse(content)
          : parseMarkdownLogs(content);

        // Filter by date range
        const filteredEntries = entries.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= startDate && entryDate <= endDate;
        });

        logs.push(...filteredEntries);
      }
    }

    return logs;

  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Data path not found: ${dataPath}`);
    }
    throw error;
  }
}

/**
 * Parses markdown formatted coffee logs
 * @private
 * @param {string} content - Markdown content
 * @returns {Array} Parsed log entries
 */
function parseMarkdownLogs(content) {
  const logs = [];
  const dateRegex = /Date:\s*(\d{4}-\d{2}-\d{2})/gi;
  const beanRegex = /Bean:\s*([^\n]+)/gi;
  const methodRegex = /Method:\s*([^\n]+)/gi;
  const ratingRegex = /Rating:\s*(\d+)/gi;

  // Simple parser - can be enhanced based on actual format
  const lines = content.split('\n');
  let currentLog = {};

  for (const line of lines) {
    const dateMatch = line.match(/Date:\s*(\d{4}-\d{2}-\d{2})/i);
    const beanMatch = line.match(/Bean:\s*([^\n]+)/i);
    const methodMatch = line.match(/Method:\s*([^\n]+)/i);
    const ratingMatch = line.match(/Rating:\s*(\d+)/i);

    if (dateMatch) currentLog.date = dateMatch[1];
    if (beanMatch) currentLog.bean = beanMatch[1].trim();
    if (methodMatch) currentLog.method = methodMatch[1].trim();
    if (ratingMatch) currentLog.rating = parseInt(ratingMatch[1]);

    // If we have complete log entry, add it
    if (currentLog.date && currentLog.bean) {
      logs.push({ ...currentLog });
      currentLog = {};
    }
  }

  return logs;
}

/**
 * Calculates weekly statistics from coffee logs
 * @private
 * @param {Array} logs - Array of coffee log entries
 * @returns {Object} Statistical summary
 */
function calculateWeeklyStats(logs) {
  const stats = {
    totalBrews: logs.length,
    uniqueBeans: new Set(logs.map(log => log.bean)).size,
    methodBreakdown: {},
    averageRating: 0,
    topBeans: [],
    dailyBrews: {}
  };

  // Calculate method breakdown
  logs.forEach(log => {
    if (log.method) {
      stats.methodBreakdown[log.method] = (stats.methodBreakdown[log.method] || 0) + 1;
    }
  });

  // Calculate average rating
  const ratingsSum = logs.reduce((sum, log) => sum + (log.rating || 0), 0);
  stats.averageRating = logs.length > 0 ? (ratingsSum / logs.length).toFixed(2) : 0;

  // Count bean usage
  const beanCounts = {};
  logs.forEach(log => {
    if (log.bean) {
      beanCounts[log.bean] = (beanCounts[log.bean] || 0) + 1;
    }
  });

  // Get top 5 beans
  stats.topBeans = Object.entries(beanCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([bean, count]) => ({ bean, count }));

  // Daily brew counts
  logs.forEach(log => {
    if (log.date) {
      stats.dailyBrews[log.date] = (stats.dailyBrews[log.date] || 0) + 1;
    }
  });

  return stats;
}

/**
 * Formats statistics into markdown report
 * @private
 * @param {Object} stats - Weekly statistics
 * @param {Date} startDate - Week start date
 * @param {Date} endDate - Week end date
 * @returns {string} Formatted markdown report
 */
function formatWeeklyReport(stats, startDate, endDate) {
  const formatDate = (date) => date.toISOString().split('T')[0];

  let report = `# Coffee Vault - Weekly Summary\n\n`;
  report += `**Period:** ${formatDate(startDate)} to ${formatDate(endDate)}\n`;
  report += `**Generated:** ${new Date().toISOString().split('T')[0]}\n\n`;
  report += `---\n\n`;

  report += `## Overview\n\n`;
  report += `- **Total Brews:** ${stats.totalBrews}\n`;
  report += `- **Unique Beans:** ${stats.uniqueBeans}\n`;
  report += `- **Average Rating:** ${stats.averageRating}/10\n\n`;

  report += `## Brewing Methods\n\n`;
  Object.entries(stats.methodBreakdown)
    .sort((a, b) => b[1] - a[1])
    .forEach(([method, count]) => {
      const percentage = ((count / stats.totalBrews) * 100).toFixed(1);
      report += `- **${method}:** ${count} (${percentage}%)\n`;
    });

  report += `\n## Top 5 Beans\n\n`;
  stats.topBeans.forEach((item, index) => {
    report += `${index + 1}. **${item.bean}** - ${item.count} brews\n`;
  });

  report += `\n## Daily Breakdown\n\n`;
  Object.entries(stats.dailyBrews)
    .sort()
    .forEach(([date, count]) => {
      report += `- ${date}: ${count} brew${count > 1 ? 's' : ''}\n`;
    });

  return report;
}

/**
 * Generates weekly summary for the current week
 * @async
 * @param {string} dataPath - Path to coffee logs directory
 * @param {string} [outputPath] - Path to save the report
 * @returns {Promise<Object>} Weekly summary
 *
 * @example
 * const summary = await generateCurrentWeekSummary(
 *   '/path/to/coffee-logs',
 *   '/path/to/reports/current-week.md'
 * );
 */
async function generateCurrentWeekSummary(dataPath, outputPath) {
  try {
    if (!dataPath || typeof dataPath !== 'string') {
      throw new Error('dataPath is required and must be a string');
    }

    const now = new Date();
    const dayOfWeek = now.getDay();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - dayOfWeek);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(now);
    endDate.setHours(23, 59, 59, 999);

    return await generateWeeklySummary({
      startDate,
      endDate,
      dataPath,
      outputPath
    });

  } catch (error) {
    throw new Error(`Failed to generate current week summary: ${error.message}`);
  }
}

module.exports = {
  generateWeeklySummary,
  generateCurrentWeekSummary
};

/**
 * Usage Examples:
 *
 * // Generate summary for specific week
 * const { generateWeeklySummary } = require('./weekly-summary');
 *
 * const summary = await generateWeeklySummary({
 *   startDate: new Date('2025-10-20'),
 *   endDate: new Date('2025-10-26'),
 *   dataPath: '/Users/jonsussmanstudio/Desktop/CodingObsidian/CoffeeLogs',
 *   outputPath: '/Users/jonsussmanstudio/Desktop/CodingObsidian/Reports/week-43.md'
 * });
 *
 * console.log(`Generated report with ${summary.totalBrews} brews`);
 *
 * // Generate summary for current week
 * const { generateCurrentWeekSummary } = require('./weekly-summary');
 *
 * const currentSummary = await generateCurrentWeekSummary(
 *   '/Users/jonsussmanstudio/Desktop/CodingObsidian/CoffeeLogs',
 *   '/Users/jonsussmanstudio/Desktop/CodingObsidian/Reports/current-week.md'
 * );
 */
