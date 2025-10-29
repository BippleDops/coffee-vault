/**
 * Daily Summary Generator for Coffee Vault
 * Version: 1.0.0
 *
 * Automatically generates comprehensive daily summaries from coffee logs
 * Can be run manually or scheduled via Templater or other automation
 */

/**
 * Configuration object for summary generation
 */
const DEFAULT_CONFIG = {
  verbosity: 'detailed', // 'brief', 'standard', 'detailed'
  includeMoodAnalysis: true,
  includeEquipmentTracking: true,
  includeExperiments: true,
  minCupsForSummary: 1, // Minimum cups to generate summary
  targetFolder: 'Daily Notes'
};

/**
 * Generate daily summary for a specific date
 * @param {Object} app - Obsidian app instance
 * @param {string} dateString - Date in YYYY-MM-DD format (defaults to today)
 * @param {Object} config - Configuration options
 * @returns {Object} Summary object with statistics and formatted text
 */
async function generateDailySummary(app, dateString = null, config = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const dv = app.plugins.plugins.dataview?.api;

  if (!dv) {
    throw new Error("Dataview plugin is required for daily summary generation");
  }

  // Use today if no date specified
  const targetDate = dateString || new Date().toISOString().split('T')[0];

  try {
    // Query all coffee logs for the target date
    const logs = dv.pages('"Coffee Logs"')
      .where(p => p.date && p.date.toString() === targetDate);

    const logArray = logs.values || [];

    // Check minimum cups threshold
    const totalCups = logArray.reduce((sum, log) => sum + (log["cups-brewed"] || 1), 0);

    if (totalCups < finalConfig.minCupsForSummary) {
      return {
        hasData: false,
        message: `Only ${totalCups} cup(s) logged for ${targetDate}. Minimum ${finalConfig.minCupsForSummary} required.`
      };
    }

    // Calculate statistics
    const stats = calculateDailyStats(logArray);

    // Generate formatted summary text
    const summaryText = formatSummary(stats, finalConfig, targetDate);

    return {
      hasData: true,
      date: targetDate,
      stats,
      summaryText,
      logCount: logArray.length
    };

  } catch (error) {
    console.error("Error generating daily summary:", error);
    throw error;
  }
}

/**
 * Calculate daily statistics from log array
 * @param {Array} logs - Array of coffee log pages
 * @returns {Object} Statistics object
 */
function calculateDailyStats(logs) {
  const stats = {
    totalSessions: logs.length,
    totalCups: 0,
    averageRating: 0,
    highestRating: 0,
    lowestRating: 5,
    bestSession: null,
    methods: {},
    origins: {},
    roasters: {},
    beans: [],
    experiments: [],
    equipment: new Set(),
    ratings: []
  };

  logs.forEach(log => {
    // Cup counts
    const cups = log["cups-brewed"] || 1;
    stats.totalCups += cups;

    // Ratings
    const rating = parseFloat(log.rating) || 0;
    stats.ratings.push(rating);

    if (rating > stats.highestRating) {
      stats.highestRating = rating;
      stats.bestSession = log;
    }
    if (rating < stats.lowestRating && rating > 0) {
      stats.lowestRating = rating;
    }

    // Methods frequency
    const method = log["brew-method"];
    if (method) {
      stats.methods[method] = (stats.methods[method] || 0) + 1;
    }

    // Origins
    const origin = log.origin;
    if (origin) {
      stats.origins[origin] = (stats.origins[origin] || 0) + 1;
    }

    // Roasters
    const roaster = log.roaster;
    if (roaster) {
      const roasterName = typeof roaster === 'object' ? roaster.path : roaster;
      stats.roasters[roasterName] = (stats.roasters[roasterName] || 0) + 1;
    }

    // Beans
    const beanName = log.beans;
    if (beanName && !stats.beans.includes(beanName)) {
      stats.beans.push(beanName);
    }

    // Experiments (sessions marked as experiments or with unusually low/high ratings)
    const sessionType = log["session-type"];
    if (sessionType === "experiment") {
      stats.experiments.push({
        bean: beanName,
        method: method,
        rating: rating,
        notes: log.notes || "Experimental brewing session"
      });
    }

    // Equipment tracking
    const equipment = log.equipment;
    if (equipment && Array.isArray(equipment)) {
      equipment.forEach(item => stats.equipment.add(item));
    }
  });

  // Calculate average rating
  if (stats.ratings.length > 0) {
    stats.averageRating = stats.ratings.reduce((a, b) => a + b, 0) / stats.ratings.length;
  }

  // Find primary method (most used)
  if (Object.keys(stats.methods).length > 0) {
    stats.primaryMethod = Object.entries(stats.methods)
      .sort((a, b) => b[1] - a[1])[0][0];
  }

  return stats;
}

/**
 * Format summary statistics as readable text
 * @param {Object} stats - Statistics object from calculateDailyStats
 * @param {Object} config - Configuration object
 * @param {string} date - Date string
 * @returns {string} Formatted summary text
 */
function formatSummary(stats, config, date) {
  const lines = [];

  // Header
  lines.push(`## ☕ Daily Coffee Summary - ${date}`);
  lines.push('');

  // Brief summary line
  lines.push(`**Quick Stats**: ${stats.totalSessions} session(s) • ${stats.totalCups} cup(s) • ${formatRating(stats.averageRating)} avg rating`);
  lines.push('');

  if (config.verbosity === 'brief') {
    return lines.join('\n');
  }

  // Standard and Detailed sections
  lines.push('### 📊 Overview');
  lines.push('');
  lines.push(`- **Total Sessions**: ${stats.totalSessions}`);
  lines.push(`- **Total Cups Brewed**: ${stats.totalCups}`);
  lines.push(`- **Average Rating**: ${formatRating(stats.averageRating)} (${stats.averageRating.toFixed(2)}/5)`);
  lines.push(`- **Rating Range**: ${stats.lowestRating.toFixed(1)} - ${stats.highestRating.toFixed(1)}`);
  lines.push('');

  // Methods breakdown
  if (Object.keys(stats.methods).length > 0) {
    lines.push('### ⚙️ Brewing Methods');
    lines.push('');
    Object.entries(stats.methods)
      .sort((a, b) => b[1] - a[1])
      .forEach(([method, count]) => {
        const methodDisplay = formatBrewMethod(method);
        lines.push(`- **${methodDisplay}**: ${count} session(s)`);
      });
    lines.push('');
  }

  // Origins and beans
  if (stats.beans.length > 0) {
    lines.push('### 🌍 Beans & Origins');
    lines.push('');
    lines.push(`**Beans Tried**: ${stats.beans.join(', ')}`);
    lines.push('');

    if (Object.keys(stats.origins).length > 0) {
      const originsList = Object.entries(stats.origins)
        .sort((a, b) => b[1] - a[1])
        .map(([origin, count]) => `${origin} (${count})`)
        .join(', ');
      lines.push(`**Origins**: ${originsList}`);
      lines.push('');
    }
  }

  // Best session
  if (stats.bestSession) {
    lines.push('### ⭐ Highlight Session');
    lines.push('');
    const best = stats.bestSession;
    lines.push(`**Rating**: ${formatRating(best.rating)} ${best.rating}/5`);
    lines.push(`**Beans**: ${best.beans}`);
    lines.push(`**Method**: ${formatBrewMethod(best["brew-method"])}`);
    if (best.notes) {
      lines.push(`**Notes**: ${best.notes}`);
    }
    lines.push('');
  }

  // Detailed sections
  if (config.verbosity === 'detailed') {
    // Experiments
    if (config.includeExperiments && stats.experiments.length > 0) {
      lines.push('### 🧪 Experiments');
      lines.push('');
      stats.experiments.forEach(exp => {
        lines.push(`- **${exp.bean}** via ${formatBrewMethod(exp.method)} - Rating: ${exp.rating}/5`);
        if (exp.notes) {
          lines.push(`  - ${exp.notes}`);
        }
      });
      lines.push('');
    }

    // Equipment tracking
    if (config.includeEquipmentTracking && stats.equipment.size > 0) {
      lines.push('### 🛠️ Equipment Used');
      lines.push('');
      Array.from(stats.equipment).forEach(item => {
        lines.push(`- ${item}`);
      });
      lines.push('');
    }
  }

  lines.push('---');
  lines.push('');
  lines.push('*Generated automatically by Daily Summary Generator*');

  return lines.join('\n');
}

/**
 * Format rating as stars
 * @param {number} rating - Rating value
 * @returns {string} Star representation
 */
function formatRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = (rating % 1) >= 0.5;
  return '⭐'.repeat(fullStars) + (hasHalf ? '✨' : '');
}

/**
 * Format brew method display name
 * @param {string} method - Method slug
 * @returns {string} Display name
 */
function formatBrewMethod(method) {
  const names = {
    "pour-over": "Pour Over",
    "french-press": "French Press",
    "espresso": "Espresso",
    "aeropress": "Aeropress",
    "cold-brew": "Cold Brew",
    "moka-pot": "Moka Pot",
    "chemex": "Chemex",
    "siphon": "Siphon",
    "v60": "V60",
    "turkish": "Turkish"
  };
  return names[method] || method.charAt(0).toUpperCase() + method.slice(1);
}

/**
 * Insert summary into daily note
 * @param {Object} app - Obsidian app instance
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @param {Object} config - Configuration options
 * @returns {Object} Result object
 */
async function insertSummaryIntoDailyNote(app, dateString = null, config = {}) {
  const targetDate = dateString || new Date().toISOString().split('T')[0];
  const targetFolder = config.targetFolder || DEFAULT_CONFIG.targetFolder;

  try {
    // Generate summary
    const summary = await generateDailySummary(app, targetDate, config);

    if (!summary.hasData) {
      return {
        success: false,
        message: summary.message
      };
    }

    // Find or create daily note
    const dailyNotePath = `${targetFolder}/${targetDate}.md`;
    const file = app.vault.getAbstractFileByPath(dailyNotePath);

    if (!file) {
      return {
        success: false,
        message: `Daily note not found at ${dailyNotePath}. Please create it first.`
      };
    }

    // Read current content
    const content = await app.vault.read(file);

    // Check if summary already exists
    if (content.includes('## ☕ Daily Coffee Summary')) {
      // Replace existing summary
      const regex = /## ☕ Daily Coffee Summary[\s\S]*?(?=\n## |\n---\n\n|\Z)/;
      const newContent = content.replace(regex, summary.summaryText);
      await app.vault.modify(file, newContent);

      return {
        success: true,
        message: `Summary updated in ${dailyNotePath}`,
        stats: summary.stats
      };
    } else {
      // Append summary (before the last section or at the end)
      const newContent = content + '\n\n' + summary.summaryText;
      await app.vault.modify(file, newContent);

      return {
        success: true,
        message: `Summary inserted into ${dailyNotePath}`,
        stats: summary.stats
      };
    }

  } catch (error) {
    console.error("Error inserting summary into daily note:", error);
    return {
      success: false,
      message: `Error: ${error.message}`
    };
  }
}

/**
 * Batch generate summaries for a date range
 * @param {Object} app - Obsidian app instance
 * @param {string} startDate - Start date YYYY-MM-DD
 * @param {string} endDate - End date YYYY-MM-DD
 * @param {Object} config - Configuration options
 * @returns {Array} Array of summary results
 */
async function generateSummariesForRange(app, startDate, endDate, config = {}) {
  const results = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  const currentDate = new Date(start);
  while (currentDate <= end) {
    const dateString = currentDate.toISOString().split('T')[0];

    try {
      const summary = await generateDailySummary(app, dateString, config);
      results.push({
        date: dateString,
        success: summary.hasData,
        summary: summary.hasData ? summary : null
      });
    } catch (error) {
      results.push({
        date: dateString,
        success: false,
        error: error.message
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return results;
}

// Export functions
module.exports = {
  generateDailySummary,
  insertSummaryIntoDailyNote,
  generateSummariesForRange,
  DEFAULT_CONFIG
};
