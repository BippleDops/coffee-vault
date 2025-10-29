/**
 * Smart Notification System for Coffee Vault
 * Version: 1.0.0
 * Last Updated: 2025-10-26
 *
 * Intelligent alert and reminder system that monitors vault data
 * and generates contextual notifications based on user patterns.
 *
 * Features:
 * - Smart brewing reminders
 * - Bean freshness alerts
 * - Maintenance reminders
 * - Achievement notifications
 * - Low inventory warnings
 * - Quality trend alerts
 *
 * Dependencies: stats-utils.js
 * Usage: Import in Dataview/Datacore queries or run as scheduled task
 *
 * @example
 * const notifier = require('./notification-system.js');
 * const notifications = await notifier.getAllNotifications(dv);
 * console.log(notifier.formatNotifications(notifications));
 */

const stats = require('./stats-utils.js');

// ============================================
// CONFIGURATION
// ============================================

/**
 * Notification priority levels
 */
const PRIORITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  INFO: 'info'
};

/**
 * Notification categories
 */
const CATEGORY = {
  BREWING: 'brewing',
  INVENTORY: 'inventory',
  MAINTENANCE: 'maintenance',
  ACHIEVEMENT: 'achievement',
  QUALITY: 'quality',
  FRESHNESS: 'freshness',
  REMINDER: 'reminder'
};

/**
 * Notification thresholds and settings
 */
const NOTIFICATION_CONFIG = {
  // Brewing patterns
  inactivityDays: 3,              // Days without brewing to trigger reminder
  streakDaysForAchievement: 7,    // Consecutive days to celebrate

  // Bean freshness
  peakFreshnessDays: 7,           // Peak freshness window
  goodFreshnessDays: 14,          // Good freshness window
  agingWarningDays: 21,           // Start warning about aging
  staleWarningDays: 30,           // Stale beans warning

  // Quality alerts
  ratingDropThreshold: 0.5,       // Rating drop to trigger alert
  consecutiveLowRatings: 3,       // Low ratings in a row to alert
  lowRatingThreshold: 3.0,        // What counts as "low"

  // Inventory
  lowInventoryCups: 5,            // Cups remaining to warn
  criticalInventoryCups: 2,       // Critical inventory level

  // Achievements
  totalSessionsMilestones: [10, 25, 50, 100, 250, 500, 1000],
  highRatingStreakTarget: 5,      // 5 consecutive 4+ ratings
  perfectRatingTarget: 5.0
};

// ============================================
// MAIN NOTIFICATION FUNCTIONS
// ============================================

/**
 * Get all active notifications
 * @param {Object} dv - Dataview API instance
 * @param {Object} options - Notification options
 * @returns {Promise<Object>} Categorized notifications
 *
 * @example
 * const notifications = await getAllNotifications(dv, {
 *   includeLowPriority: false,
 *   maxAge: 7
 * });
 */
async function getAllNotifications(dv, options = {}) {
  const {
    includeLowPriority = true,
    maxAge = 30,              // Only show notifications from last N days
    categories = null         // Filter by specific categories
  } = options;

  try {
    const notifications = {
      generated: new Date().toISOString(),
      summary: {
        total: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      },
      byCategory: {},
      allNotifications: []
    };

    // Generate notifications for each category
    const generators = [
      { name: CATEGORY.BREWING, fn: generateBrewingNotifications },
      { name: CATEGORY.INVENTORY, fn: generateInventoryNotifications },
      { name: CATEGORY.MAINTENANCE, fn: generateMaintenanceNotifications },
      { name: CATEGORY.ACHIEVEMENT, fn: generateAchievementNotifications },
      { name: CATEGORY.QUALITY, fn: generateQualityNotifications },
      { name: CATEGORY.FRESHNESS, fn: generateFreshnessNotifications }
    ];

    for (const generator of generators) {
      if (categories && !categories.includes(generator.name)) {
        continue;
      }

      const categoryNotifications = await generator.fn(dv);
      notifications.byCategory[generator.name] = categoryNotifications;
      notifications.allNotifications.push(...categoryNotifications);
    }

    // Filter by priority
    if (!includeLowPriority) {
      notifications.allNotifications = notifications.allNotifications.filter(
        n => n.priority !== PRIORITY.LOW && n.priority !== PRIORITY.INFO
      );
    }

    // Sort by priority and date
    notifications.allNotifications.sort((a, b) => {
      const priorityOrder = {
        [PRIORITY.CRITICAL]: 0,
        [PRIORITY.HIGH]: 1,
        [PRIORITY.MEDIUM]: 2,
        [PRIORITY.LOW]: 3,
        [PRIORITY.INFO]: 4
      };

      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;

      return new Date(b.created) - new Date(a.created);
    });

    // Update summary
    notifications.allNotifications.forEach(n => {
      notifications.summary.total++;
      if (n.priority === PRIORITY.CRITICAL) notifications.summary.critical++;
      else if (n.priority === PRIORITY.HIGH) notifications.summary.high++;
      else if (n.priority === PRIORITY.MEDIUM) notifications.summary.medium++;
      else if (n.priority === PRIORITY.LOW) notifications.summary.low++;
    });

    return notifications;

  } catch (error) {
    console.error('Error generating notifications:', error);
    throw error;
  }
}

// ============================================
// CATEGORY-SPECIFIC GENERATORS
// ============================================

/**
 * Generate brewing activity notifications
 * @param {Object} dv - Dataview API instance
 * @returns {Promise<Array>} Brewing notifications
 */
async function generateBrewingNotifications(dv) {
  const notifications = [];
  const today = new Date();

  try {
    const logs = dv.pages('"Coffee Logs"')
      .where(p => p.type === 'coffee-log')
      .sort(p => p.date, 'desc')
      .array();

    if (logs.length === 0) {
      notifications.push(createNotification(
        CATEGORY.BREWING,
        PRIORITY.MEDIUM,
        'Start Your Coffee Journey',
        'Create your first coffee log to begin tracking your brewing journey!',
        null
      ));
      return notifications;
    }

    const lastLog = logs[0];
    const lastBrewDate = new Date(lastLog.date);
    const daysSinceLastBrew = Math.floor((today - lastBrewDate) / (1000 * 60 * 60 * 24));

    // Inactivity reminder
    if (daysSinceLastBrew >= NOTIFICATION_CONFIG.inactivityDays) {
      const priority = daysSinceLastBrew >= 7 ? PRIORITY.HIGH : PRIORITY.MEDIUM;
      notifications.push(createNotification(
        CATEGORY.BREWING,
        priority,
        'Time to Brew!',
        `It's been ${daysSinceLastBrew} days since your last brew. Time to make some coffee!`,
        { daysSinceLastBrew }
      ));
    }

    // Check for brewing streak
    const streak = calculateBrewingStreak(logs);
    if (streak >= NOTIFICATION_CONFIG.streakDaysForAchievement) {
      notifications.push(createNotification(
        CATEGORY.BREWING,
        PRIORITY.INFO,
        'Brewing Streak!',
        `Amazing! You're on a ${streak}-day brewing streak. Keep it up!`,
        { streak }
      ));
    }

    // Daily brewing suggestion (if user typically brews daily)
    const averageDaysBetweenBrews = calculateAverageDaysBetweenBrews(logs);
    if (averageDaysBetweenBrews <= 1.5 && daysSinceLastBrew >= 1) {
      notifications.push(createNotification(
        CATEGORY.BREWING,
        PRIORITY.LOW,
        'Daily Brew Reminder',
        'Based on your pattern, you typically brew daily. Ready for today\'s cup?',
        null
      ));
    }

  } catch (error) {
    console.error('Error generating brewing notifications:', error);
  }

  return notifications;
}

/**
 * Generate inventory notifications
 * @param {Object} dv - Dataview API instance
 * @returns {Promise<Array>} Inventory notifications
 */
async function generateInventoryNotifications(dv) {
  const notifications = [];

  try {
    const beans = dv.pages('"Beans Library"')
      .where(p => p.status === 'active')
      .array();

    for (const bean of beans) {
      const beanName = bean['bean-name'];
      const weight = parseFloat(bean.weight) || 340;
      const doseGrams = 18;

      // Calculate usage
      const logs = dv.pages('"Coffee Logs"')
        .where(p => p.beans === beanName)
        .array();

      const cupsBrewed = logs.length;
      const initialCups = Math.floor(weight / doseGrams);
      const cupsRemaining = Math.max(0, initialCups - cupsBrewed);

      // Low inventory warning
      if (cupsRemaining <= NOTIFICATION_CONFIG.criticalInventoryCups) {
        notifications.push(createNotification(
          CATEGORY.INVENTORY,
          PRIORITY.CRITICAL,
          'Critical: Almost Out of Beans',
          `${beanName} has only ${cupsRemaining} cup(s) remaining!`,
          { beanName, cupsRemaining }
        ));
      } else if (cupsRemaining <= NOTIFICATION_CONFIG.lowInventoryCups) {
        notifications.push(createNotification(
          CATEGORY.INVENTORY,
          PRIORITY.HIGH,
          'Low Bean Inventory',
          `${beanName} is running low with ${cupsRemaining} cups remaining. Consider reordering.`,
          { beanName, cupsRemaining }
        ));
      }

      // High-rated bean finishing soon
      const ratings = logs.map(l => l.rating).filter(r => r != null);
      if (ratings.length >= 3) {
        const avgRating = stats.mean(ratings);
        if (avgRating >= 4.2 && cupsRemaining <= 10) {
          notifications.push(createNotification(
            CATEGORY.INVENTORY,
            PRIORITY.MEDIUM,
            'Favorite Bean Running Low',
            `${beanName} (${avgRating.toFixed(1)}/5 avg) has ${cupsRemaining} cups left. You'll want to reorder this one!`,
            { beanName, avgRating, cupsRemaining }
          ));
        }
      }
    }

    // No active beans warning
    if (beans.length === 0) {
      notifications.push(createNotification(
        CATEGORY.INVENTORY,
        PRIORITY.HIGH,
        'No Active Beans',
        'You don\'t have any active beans in your inventory. Time to order more!',
        null
      ));
    }

  } catch (error) {
    console.error('Error generating inventory notifications:', error);
  }

  return notifications;
}

/**
 * Generate maintenance notifications
 * @param {Object} dv - Dataview API instance
 * @returns {Promise<Array>} Maintenance notifications
 */
async function generateMaintenanceNotifications(dv) {
  const notifications = [];

  try {
    // This is a simplified version - would integrate with maintenance-scheduler.js
    const logs = dv.pages('"Coffee Logs"')
      .where(p => p.type === 'coffee-log')
      .array();

    const totalBrews = logs.length;

    // Grinder cleaning reminder (every 50 uses)
    if (totalBrews % 50 === 0 && totalBrews > 0) {
      notifications.push(createNotification(
        CATEGORY.MAINTENANCE,
        PRIORITY.MEDIUM,
        'Grinder Maintenance Due',
        `You've reached ${totalBrews} total brews. Time to clean your grinder!`,
        { totalBrews }
      ));
    }

    // Espresso machine backflush (for espresso users)
    const espressoLogs = logs.filter(l => l['brew-method'] === 'espresso');
    if (espressoLogs.length % 100 === 0 && espressoLogs.length > 0) {
      notifications.push(createNotification(
        CATEGORY.MAINTENANCE,
        PRIORITY.HIGH,
        'Espresso Machine Backflush',
        `${espressoLogs.length} espresso shots pulled. Time to backflush your machine!`,
        { espressoShots: espressoLogs.length }
      ));
    }

  } catch (error) {
    console.error('Error generating maintenance notifications:', error);
  }

  return notifications;
}

/**
 * Generate achievement notifications
 * @param {Object} dv - Dataview API instance
 * @returns {Promise<Array>} Achievement notifications
 */
async function generateAchievementNotifications(dv) {
  const notifications = [];

  try {
    const logs = dv.pages('"Coffee Logs"')
      .where(p => p.type === 'coffee-log')
      .array();

    const totalSessions = logs.length;

    // Milestone achievements
    NOTIFICATION_CONFIG.totalSessionsMilestones.forEach(milestone => {
      if (totalSessions === milestone) {
        notifications.push(createNotification(
          CATEGORY.ACHIEVEMENT,
          PRIORITY.INFO,
          `Milestone: ${milestone} Brewing Sessions!`,
          `Congratulations! You've logged ${milestone} coffee brewing sessions. Keep up the great work!`,
          { milestone }
        ));
      }
    });

    // Perfect rating achievement
    const recentLogs = logs.slice(0, 10);
    const perfectRatings = recentLogs.filter(l => l.rating === 5.0);
    if (perfectRatings.length >= 3) {
      notifications.push(createNotification(
        CATEGORY.ACHIEVEMENT,
        PRIORITY.INFO,
        'Perfect Brews Streak',
        `Amazing! You've achieved ${perfectRatings.length} perfect 5.0 ratings recently!`,
        { perfectCount: perfectRatings.length }
      ));
    }

    // High rating streak
    const recentRatings = logs.slice(0, NOTIFICATION_CONFIG.highRatingStreakTarget)
      .map(l => l.rating)
      .filter(r => r != null);

    if (recentRatings.length >= NOTIFICATION_CONFIG.highRatingStreakTarget &&
        recentRatings.every(r => r >= 4.0)) {
      notifications.push(createNotification(
        CATEGORY.ACHIEVEMENT,
        PRIORITY.INFO,
        'Quality Streak!',
        `Excellent! Your last ${recentRatings.length} brews all rated 4.0 or higher!`,
        { streakLength: recentRatings.length }
      ));
    }

    // Variety achievement
    const uniqueBeans = new Set(logs.map(l => l.beans).filter(b => b));
    if (uniqueBeans.size === 10 || uniqueBeans.size === 25 || uniqueBeans.size === 50) {
      notifications.push(createNotification(
        CATEGORY.ACHIEVEMENT,
        PRIORITY.INFO,
        'Coffee Explorer',
        `You've tried ${uniqueBeans.size} different beans. You're a true coffee explorer!`,
        { uniqueBeans: uniqueBeans.size }
      ));
    }

  } catch (error) {
    console.error('Error generating achievement notifications:', error);
  }

  return notifications;
}

/**
 * Generate quality trend notifications
 * @param {Object} dv - Dataview API instance
 * @returns {Promise<Array>} Quality notifications
 */
async function generateQualityNotifications(dv) {
  const notifications = [];

  try {
    const logs = dv.pages('"Coffee Logs"')
      .where(p => p.type === 'coffee-log' && p.rating != null)
      .sort(p => p.date, 'desc')
      .array();

    if (logs.length < 5) return notifications;

    const recentRatings = logs.slice(0, 10).map(l => l.rating);
    const olderRatings = logs.slice(10, 20).map(l => l.rating);

    if (olderRatings.length >= 5) {
      const recentAvg = stats.mean(recentRatings);
      const olderAvg = stats.mean(olderRatings);
      const diff = recentAvg - olderAvg;

      // Quality decline alert
      if (diff < -NOTIFICATION_CONFIG.ratingDropThreshold) {
        notifications.push(createNotification(
          CATEGORY.QUALITY,
          PRIORITY.HIGH,
          'Quality Decline Detected',
          `Your recent brews are averaging ${recentAvg.toFixed(2)}, down ${Math.abs(diff).toFixed(2)} points. Review your technique and bean freshness.`,
          { recentAvg, olderAvg, diff }
        ));
      }

      // Quality improvement celebration
      if (diff > NOTIFICATION_CONFIG.ratingDropThreshold) {
        notifications.push(createNotification(
          CATEGORY.QUALITY,
          PRIORITY.INFO,
          'Quality Improvement!',
          `Great progress! Your recent brews are ${diff.toFixed(2)} points higher than before. Keep it up!`,
          { recentAvg, olderAvg, diff }
        ));
      }
    }

    // Consecutive low ratings
    const recentLowRatings = logs.slice(0, NOTIFICATION_CONFIG.consecutiveLowRatings)
      .filter(l => l.rating < NOTIFICATION_CONFIG.lowRatingThreshold);

    if (recentLowRatings.length >= NOTIFICATION_CONFIG.consecutiveLowRatings) {
      notifications.push(createNotification(
        CATEGORY.QUALITY,
        PRIORITY.HIGH,
        'Consistency Issue',
        `Your last ${recentLowRatings.length} brews rated below ${NOTIFICATION_CONFIG.lowRatingThreshold}. Time to troubleshoot your process.`,
        { consecutiveLow: recentLowRatings.length }
      ));
    }

    // Inconsistency alert
    const consistencyScore = stats.consistencyScore(recentRatings);
    if (consistencyScore < 60) {
      notifications.push(createNotification(
        CATEGORY.QUALITY,
        PRIORITY.MEDIUM,
        'Inconsistent Results',
        `Your brewing consistency is at ${consistencyScore.toFixed(0)}%. Focus on standardizing your process.`,
        { consistencyScore }
      ));
    }

  } catch (error) {
    console.error('Error generating quality notifications:', error);
  }

  return notifications;
}

/**
 * Generate bean freshness notifications
 * @param {Object} dv - Dataview API instance
 * @returns {Promise<Array>} Freshness notifications
 */
async function generateFreshnessNotifications(dv) {
  const notifications = [];
  const today = new Date();

  try {
    const beans = dv.pages('"Beans Library"')
      .where(p => p.status === 'active' && p['roast-date'])
      .array();

    for (const bean of beans) {
      const beanName = bean['bean-name'];
      const roastDate = new Date(bean['roast-date']);
      const daysSinceRoast = Math.floor((today - roastDate) / (1000 * 60 * 60 * 24));

      // Peak freshness notification
      if (daysSinceRoast >= 3 && daysSinceRoast <= NOTIFICATION_CONFIG.peakFreshnessDays) {
        notifications.push(createNotification(
          CATEGORY.FRESHNESS,
          PRIORITY.LOW,
          'Peak Freshness',
          `${beanName} is at peak freshness (${daysSinceRoast} days since roast). Perfect time to brew!`,
          { beanName, daysSinceRoast }
        ));
      }

      // Aging warning
      if (daysSinceRoast >= NOTIFICATION_CONFIG.agingWarningDays &&
          daysSinceRoast < NOTIFICATION_CONFIG.staleWarningDays) {
        notifications.push(createNotification(
          CATEGORY.FRESHNESS,
          PRIORITY.MEDIUM,
          'Beans Aging',
          `${beanName} is ${daysSinceRoast} days old. Use soon for best quality.`,
          { beanName, daysSinceRoast }
        ));
      }

      // Stale warning
      if (daysSinceRoast >= NOTIFICATION_CONFIG.staleWarningDays) {
        notifications.push(createNotification(
          CATEGORY.FRESHNESS,
          PRIORITY.HIGH,
          'Stale Beans Warning',
          `${beanName} is ${daysSinceRoast} days old and likely stale. Consider using for cold brew or replacing.`,
          { beanName, daysSinceRoast }
        ));
      }
    }

  } catch (error) {
    console.error('Error generating freshness notifications:', error);
  }

  return notifications;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Create a notification object
 * @param {string} category - Notification category
 * @param {string} priority - Priority level
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {Object} data - Additional data
 * @returns {Object} Notification object
 */
function createNotification(category, priority, title, message, data = null) {
  return {
    id: generateNotificationId(),
    created: new Date().toISOString(),
    category,
    priority,
    title,
    message,
    data,
    read: false,
    dismissed: false
  };
}

/**
 * Generate unique notification ID
 * @returns {string} Unique ID
 */
function generateNotificationId() {
  return `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate brewing streak (consecutive days)
 * @param {Array} logs - Sorted coffee logs (newest first)
 * @returns {number} Streak length in days
 */
function calculateBrewingStreak(logs) {
  if (logs.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let checkDate = new Date(today);

  for (const log of logs) {
    const logDate = new Date(log.date);
    logDate.setHours(0, 0, 0, 0);

    if (logDate.getTime() === checkDate.getTime()) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (logDate < checkDate) {
      break;
    }
  }

  return streak;
}

/**
 * Calculate average days between brews
 * @param {Array} logs - Coffee logs
 * @returns {number} Average days between brews
 */
function calculateAverageDaysBetweenBrews(logs) {
  if (logs.length < 2) return 0;

  const dates = logs.map(l => new Date(l.date)).sort((a, b) => a - b);
  const intervals = [];

  for (let i = 1; i < dates.length; i++) {
    const days = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
    intervals.push(days);
  }

  return stats.mean(intervals);
}

// ============================================
// FORMATTING FUNCTIONS
// ============================================

/**
 * Format notifications as Markdown
 * @param {Object} notifications - Notifications object
 * @returns {string} Formatted Markdown
 */
function formatNotifications(notifications) {
  let md = `# 🔔 Coffee Vault Notifications\n\n`;
  md += `**Generated**: ${new Date().toISOString().split('T')[0]}\n\n`;

  // Summary
  md += `## Summary\n\n`;
  md += `- **Total**: ${notifications.summary.total}\n`;
  md += `- **Critical**: ${notifications.summary.critical}\n`;
  md += `- **High Priority**: ${notifications.summary.high}\n`;
  md += `- **Medium Priority**: ${notifications.summary.medium}\n`;
  md += `- **Low Priority**: ${notifications.summary.low}\n\n`;

  if (notifications.allNotifications.length === 0) {
    md += `No notifications at this time. Everything looks good! ✅\n`;
    return md;
  }

  // Group by priority
  const grouped = {
    [PRIORITY.CRITICAL]: [],
    [PRIORITY.HIGH]: [],
    [PRIORITY.MEDIUM]: [],
    [PRIORITY.LOW]: [],
    [PRIORITY.INFO]: []
  };

  notifications.allNotifications.forEach(n => {
    grouped[n.priority].push(n);
  });

  // Display by priority
  const sections = [
    { priority: PRIORITY.CRITICAL, icon: '🔴', title: 'Critical' },
    { priority: PRIORITY.HIGH, icon: '🟠', title: 'High Priority' },
    { priority: PRIORITY.MEDIUM, icon: '🟡', title: 'Medium Priority' },
    { priority: PRIORITY.LOW, icon: '🟢', title: 'Low Priority' },
    { priority: PRIORITY.INFO, icon: 'ℹ️', title: 'Information' }
  ];

  sections.forEach(section => {
    const items = grouped[section.priority];
    if (items.length > 0) {
      md += `---\n\n`;
      md += `## ${section.icon} ${section.title}\n\n`;

      items.forEach(item => {
        md += `### ${item.title}\n`;
        md += `${item.message}\n\n`;
        if (item.data) {
          md += `<details>\n<summary>Details</summary>\n\n`;
          md += `\`\`\`json\n${JSON.stringify(item.data, null, 2)}\n\`\`\`\n\n`;
          md += `</details>\n\n`;
        }
      });
    }
  });

  md += `---\n\n`;
  md += `*Generated by Coffee Vault Notification System*\n`;

  return md;
}

/**
 * Format notifications as JSON
 * @param {Object} notifications - Notifications object
 * @returns {string} JSON string
 */
function formatAsJSON(notifications) {
  return JSON.stringify(notifications, null, 2);
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
  // Main functions
  getAllNotifications,

  // Category generators
  generateBrewingNotifications,
  generateInventoryNotifications,
  generateMaintenanceNotifications,
  generateAchievementNotifications,
  generateQualityNotifications,
  generateFreshnessNotifications,

  // Formatting
  formatNotifications,
  formatAsJSON,

  // Utilities
  createNotification,

  // Constants
  PRIORITY,
  CATEGORY,
  NOTIFICATION_CONFIG
};
