/**
 * Coffee Vault - Monthly Report Generator
 * Comprehensive monthly analysis of coffee brewing activities
 * @module monthly-report
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Validates month and year parameters
 * @private
 * @param {number} month - Month (1-12)
 * @param {number} year - Year (e.g., 2025)
 * @throws {Error} If month or year are invalid
 */
function validateMonthYear(month, year) {
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error('Month must be an integer between 1 and 12');
  }
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    throw new Error('Year must be a valid integer between 2000 and 2100');
  }
}

/**
 * Generates comprehensive monthly report
 * @async
 * @param {Object} options - Configuration options
 * @param {number} options.month - Month (1-12)
 * @param {number} options.year - Year (e.g., 2025)
 * @param {string} options.dataPath - Path to coffee logs directory
 * @param {string} [options.outputPath] - Path to save the report
 * @param {boolean} [options.includeCharts=false] - Include ASCII charts
 * @returns {Promise<Object>} Monthly report data
 * @throws {Error} If parameters are invalid or operations fail
 *
 * @example
 * const report = await generateMonthlyReport({
 *   month: 10,
 *   year: 2025,
 *   dataPath: '/path/to/coffee-logs',
 *   outputPath: '/path/to/reports/2025-10.md',
 *   includeCharts: true
 * });
 */
async function generateMonthlyReport(options) {
  try {
    // Input validation
    if (!options || typeof options !== 'object') {
      throw new Error('Options object is required');
    }

    const {
      month,
      year,
      dataPath,
      outputPath,
      includeCharts = false
    } = options;

    if (!dataPath || typeof dataPath !== 'string') {
      throw new Error('dataPath is required and must be a string');
    }

    validateMonthYear(month, year);

    // Calculate date range for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    // Read and process logs
    const logs = await readMonthlyLogs(dataPath, startDate, endDate);

    // Calculate comprehensive statistics
    const stats = calculateMonthlyStats(logs, startDate, endDate);

    // Generate report
    const report = formatMonthlyReport(stats, month, year, includeCharts);

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
    throw new Error(`Failed to generate monthly report: ${error.message}`);
  }
}

/**
 * Reads coffee logs for a specific month
 * @async
 * @private
 * @param {string} dataPath - Path to coffee logs directory
 * @param {Date} startDate - Month start date
 * @param {Date} endDate - Month end date
 * @returns {Promise<Array>} Array of coffee log entries
 */
async function readMonthlyLogs(dataPath, startDate, endDate) {
  try {
    const files = await fs.readdir(dataPath);
    const logs = [];

    for (const file of files) {
      if (file.endsWith('.md') || file.endsWith('.json')) {
        const filePath = path.join(dataPath, file);
        const content = await fs.readFile(filePath, 'utf8');

        const entries = file.endsWith('.json')
          ? JSON.parse(content)
          : parseMarkdownLogs(content);

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
  const lines = content.split('\n');
  let currentLog = {};

  for (const line of lines) {
    const dateMatch = line.match(/Date:\s*(\d{4}-\d{2}-\d{2})/i);
    const beanMatch = line.match(/Bean:\s*([^\n]+)/i);
    const methodMatch = line.match(/Method:\s*([^\n]+)/i);
    const ratingMatch = line.match(/Rating:\s*(\d+)/i);
    const grindMatch = line.match(/Grind:\s*([^\n]+)/i);
    const doseMatch = line.match(/Dose:\s*(\d+\.?\d*)/i);
    const waterMatch = line.match(/Water:\s*(\d+)/i);
    const tempMatch = line.match(/Temperature:\s*(\d+)/i);

    if (dateMatch) currentLog.date = dateMatch[1];
    if (beanMatch) currentLog.bean = beanMatch[1].trim();
    if (methodMatch) currentLog.method = methodMatch[1].trim();
    if (ratingMatch) currentLog.rating = parseInt(ratingMatch[1]);
    if (grindMatch) currentLog.grind = grindMatch[1].trim();
    if (doseMatch) currentLog.dose = parseFloat(doseMatch[1]);
    if (waterMatch) currentLog.water = parseInt(waterMatch[1]);
    if (tempMatch) currentLog.temperature = parseInt(tempMatch[1]);

    if (currentLog.date && currentLog.bean) {
      logs.push({ ...currentLog });
      currentLog = {};
    }
  }

  return logs;
}

/**
 * Calculates comprehensive monthly statistics
 * @private
 * @param {Array} logs - Coffee log entries
 * @param {Date} startDate - Month start date
 * @param {Date} endDate - Month end date
 * @returns {Object} Comprehensive statistics
 */
function calculateMonthlyStats(logs, startDate, endDate) {
  const stats = {
    period: {
      month: startDate.getMonth() + 1,
      year: startDate.getFullYear(),
      daysInMonth: endDate.getDate()
    },
    overview: {
      totalBrews: logs.length,
      uniqueBeans: new Set(logs.map(log => log.bean)).size,
      averageBrewsPerDay: 0,
      mostActiveDay: null
    },
    methods: {},
    beans: {},
    ratings: {
      average: 0,
      highest: 0,
      lowest: 10,
      distribution: {}
    },
    brewing: {
      averageDose: 0,
      averageWater: 0,
      averageTemperature: 0,
      commonGrindSize: null
    },
    trends: {
      weeklyBrews: {},
      dailyDistribution: {},
      topPerformers: []
    }
  };

  // Calculate overview stats
  const daysWithBrews = new Set(logs.map(log => log.date)).size;
  stats.overview.averageBrewsPerDay = (logs.length / stats.period.daysInMonth).toFixed(2);

  // Daily brew counts for most active day
  const dailyCounts = {};
  logs.forEach(log => {
    dailyCounts[log.date] = (dailyCounts[log.date] || 0) + 1;
  });

  const maxBrewsDay = Object.entries(dailyCounts).sort((a, b) => b[1] - a[1])[0];
  if (maxBrewsDay) {
    stats.overview.mostActiveDay = {
      date: maxBrewsDay[0],
      brews: maxBrewsDay[1]
    };
  }

  // Method breakdown
  logs.forEach(log => {
    if (log.method) {
      if (!stats.methods[log.method]) {
        stats.methods[log.method] = { count: 0, totalRating: 0, avgRating: 0 };
      }
      stats.methods[log.method].count++;
      stats.methods[log.method].totalRating += (log.rating || 0);
    }
  });

  // Calculate average ratings per method
  Object.keys(stats.methods).forEach(method => {
    const methodData = stats.methods[method];
    methodData.avgRating = (methodData.totalRating / methodData.count).toFixed(2);
  });

  // Bean statistics
  logs.forEach(log => {
    if (log.bean) {
      if (!stats.beans[log.bean]) {
        stats.beans[log.bean] = {
          count: 0,
          totalRating: 0,
          avgRating: 0,
          methods: new Set()
        };
      }
      stats.beans[log.bean].count++;
      stats.beans[log.bean].totalRating += (log.rating || 0);
      if (log.method) {
        stats.beans[log.bean].methods.add(log.method);
      }
    }
  });

  // Calculate average ratings per bean
  Object.keys(stats.beans).forEach(bean => {
    const beanData = stats.beans[bean];
    beanData.avgRating = (beanData.totalRating / beanData.count).toFixed(2);
    beanData.methods = Array.from(beanData.methods);
  });

  // Rating statistics
  const ratings = logs.filter(log => log.rating).map(log => log.rating);
  if (ratings.length > 0) {
    stats.ratings.average = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2);
    stats.ratings.highest = Math.max(...ratings);
    stats.ratings.lowest = Math.min(...ratings);

    // Rating distribution
    ratings.forEach(rating => {
      stats.ratings.distribution[rating] = (stats.ratings.distribution[rating] || 0) + 1;
    });
  }

  // Brewing parameters
  const doses = logs.filter(log => log.dose).map(log => log.dose);
  const waters = logs.filter(log => log.water).map(log => log.water);
  const temps = logs.filter(log => log.temperature).map(log => log.temperature);

  if (doses.length > 0) {
    stats.brewing.averageDose = (doses.reduce((a, b) => a + b, 0) / doses.length).toFixed(1);
  }
  if (waters.length > 0) {
    stats.brewing.averageWater = Math.round(waters.reduce((a, b) => a + b, 0) / waters.length);
  }
  if (temps.length > 0) {
    stats.brewing.averageTemperature = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length);
  }

  // Most common grind size
  const grinds = {};
  logs.forEach(log => {
    if (log.grind) {
      grinds[log.grind] = (grinds[log.grind] || 0) + 1;
    }
  });
  const topGrind = Object.entries(grinds).sort((a, b) => b[1] - a[1])[0];
  if (topGrind) {
    stats.brewing.commonGrindSize = topGrind[0];
  }

  // Top performers (beans with high ratings and multiple brews)
  stats.trends.topPerformers = Object.entries(stats.beans)
    .filter(([_, data]) => data.count >= 3)
    .sort((a, b) => b[1].avgRating - a[1].avgRating)
    .slice(0, 5)
    .map(([bean, data]) => ({
      bean,
      count: data.count,
      avgRating: data.avgRating
    }));

  return stats;
}

/**
 * Formats monthly statistics into markdown report
 * @private
 * @param {Object} stats - Monthly statistics
 * @param {number} month - Month number
 * @param {number} year - Year
 * @param {boolean} includeCharts - Include ASCII charts
 * @returns {string} Formatted markdown report
 */
function formatMonthlyReport(stats, month, year, includeCharts) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  let report = `# Coffee Vault - Monthly Report\n\n`;
  report += `## ${monthNames[month - 1]} ${year}\n\n`;
  report += `**Generated:** ${new Date().toISOString().split('T')[0]}\n\n`;
  report += `---\n\n`;

  // Overview Section
  report += `## Overview\n\n`;
  report += `- **Total Brews:** ${stats.overview.totalBrews}\n`;
  report += `- **Unique Beans:** ${stats.overview.uniqueBeans}\n`;
  report += `- **Average Brews/Day:** ${stats.overview.averageBrewsPerDay}\n`;
  if (stats.overview.mostActiveDay) {
    report += `- **Most Active Day:** ${stats.overview.mostActiveDay.date} (${stats.overview.mostActiveDay.brews} brews)\n`;
  }
  report += `\n`;

  // Rating Statistics
  report += `## Rating Statistics\n\n`;
  report += `- **Average Rating:** ${stats.ratings.average}/10\n`;
  report += `- **Highest Rating:** ${stats.ratings.highest}/10\n`;
  report += `- **Lowest Rating:** ${stats.ratings.lowest}/10\n\n`;

  if (includeCharts && Object.keys(stats.ratings.distribution).length > 0) {
    report += `### Rating Distribution\n\n`;
    const maxCount = Math.max(...Object.values(stats.ratings.distribution));
    Object.entries(stats.ratings.distribution)
      .sort((a, b) => b[0] - a[0])
      .forEach(([rating, count]) => {
        const barLength = Math.round((count / maxCount) * 30);
        const bar = '█'.repeat(barLength);
        report += `${rating}/10: ${bar} ${count}\n`;
      });
    report += `\n`;
  }

  // Brewing Methods
  report += `## Brewing Methods\n\n`;
  Object.entries(stats.methods)
    .sort((a, b) => b[1].count - a[1].count)
    .forEach(([method, data]) => {
      const percentage = ((data.count / stats.overview.totalBrews) * 100).toFixed(1);
      report += `### ${method}\n`;
      report += `- Brews: ${data.count} (${percentage}%)\n`;
      report += `- Avg Rating: ${data.avgRating}/10\n\n`;
    });

  // Top Beans
  report += `## Top Beans\n\n`;
  const topBeans = Object.entries(stats.beans)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10);

  topBeans.forEach(([bean, data], index) => {
    report += `### ${index + 1}. ${bean}\n`;
    report += `- Total Brews: ${data.count}\n`;
    report += `- Avg Rating: ${data.avgRating}/10\n`;
    report += `- Methods Used: ${data.methods.join(', ')}\n\n`;
  });

  // Brewing Parameters
  report += `## Brewing Parameters\n\n`;
  if (stats.brewing.averageDose > 0) {
    report += `- **Average Dose:** ${stats.brewing.averageDose}g\n`;
  }
  if (stats.brewing.averageWater > 0) {
    report += `- **Average Water:** ${stats.brewing.averageWater}ml\n`;
  }
  if (stats.brewing.averageTemperature > 0) {
    report += `- **Average Temperature:** ${stats.brewing.averageTemperature}°C\n`;
  }
  if (stats.brewing.commonGrindSize) {
    report += `- **Most Common Grind:** ${stats.brewing.commonGrindSize}\n`;
  }
  report += `\n`;

  // Top Performers
  if (stats.trends.topPerformers.length > 0) {
    report += `## Top Performers\n\n`;
    report += `*Beans with 3+ brews, sorted by average rating*\n\n`;
    stats.trends.topPerformers.forEach((performer, index) => {
      report += `${index + 1}. **${performer.bean}** - ${performer.avgRating}/10 (${performer.count} brews)\n`;
    });
    report += `\n`;
  }

  // Insights
  report += `## Insights & Recommendations\n\n`;
  report += generateInsights(stats);

  return report;
}

/**
 * Generates insights based on monthly statistics
 * @private
 * @param {Object} stats - Monthly statistics
 * @returns {string} Insights section
 */
function generateInsights(stats) {
  let insights = '';

  // Most used method
  const topMethod = Object.entries(stats.methods).sort((a, b) => b[1].count - a[1].count)[0];
  if (topMethod) {
    insights += `- Your preferred brewing method this month was **${topMethod[0]}** with ${topMethod[1].count} brews.\n`;
  }

  // Bean variety
  if (stats.overview.uniqueBeans < 5) {
    insights += `- Consider exploring more variety - you only tried ${stats.overview.uniqueBeans} different beans this month.\n`;
  } else if (stats.overview.uniqueBeans > 15) {
    insights += `- Great variety! You explored ${stats.overview.uniqueBeans} different beans this month.\n`;
  }

  // Rating trends
  if (parseFloat(stats.ratings.average) >= 8) {
    insights += `- Excellent month with an average rating of ${stats.ratings.average}/10!\n`;
  } else if (parseFloat(stats.ratings.average) < 6) {
    insights += `- Average rating of ${stats.ratings.average}/10 suggests room for improvement. Consider adjusting brewing parameters.\n`;
  }

  // Top performer recommendation
  if (stats.trends.topPerformers.length > 0) {
    const best = stats.trends.topPerformers[0];
    insights += `- **${best.bean}** was your top performer with ${best.avgRating}/10 rating. Consider stocking up!\n`;
  }

  return insights || '- No specific insights for this month.\n';
}

/**
 * Generates report for current month
 * @async
 * @param {string} dataPath - Path to coffee logs directory
 * @param {string} [outputPath] - Path to save report
 * @param {boolean} [includeCharts=false] - Include ASCII charts
 * @returns {Promise<Object>} Monthly report
 *
 * @example
 * const report = await generateCurrentMonthReport(
 *   '/path/to/coffee-logs',
 *   '/path/to/reports/current-month.md',
 *   true
 * );
 */
async function generateCurrentMonthReport(dataPath, outputPath, includeCharts = false) {
  try {
    if (!dataPath || typeof dataPath !== 'string') {
      throw new Error('dataPath is required and must be a string');
    }

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    return await generateMonthlyReport({
      month,
      year,
      dataPath,
      outputPath,
      includeCharts
    });

  } catch (error) {
    throw new Error(`Failed to generate current month report: ${error.message}`);
  }
}

module.exports = {
  generateMonthlyReport,
  generateCurrentMonthReport
};

/**
 * Usage Examples:
 *
 * // Generate report for specific month
 * const { generateMonthlyReport } = require('./monthly-report');
 *
 * const report = await generateMonthlyReport({
 *   month: 10,
 *   year: 2025,
 *   dataPath: '/Users/jonsussmanstudio/Desktop/CodingObsidian/CoffeeLogs',
 *   outputPath: '/Users/jonsussmanstudio/Desktop/CodingObsidian/Reports/2025-10.md',
 *   includeCharts: true
 * });
 *
 * console.log(`Total brews: ${report.overview.totalBrews}`);
 * console.log(`Average rating: ${report.ratings.average}`);
 *
 * // Generate report for current month
 * const { generateCurrentMonthReport } = require('./monthly-report');
 *
 * const currentReport = await generateCurrentMonthReport(
 *   '/Users/jonsussmanstudio/Desktop/CodingObsidian/CoffeeLogs',
 *   '/Users/jonsussmanstudio/Desktop/CodingObsidian/Reports/current-month.md',
 *   true
 * );
 */
