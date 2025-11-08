/**
 * Equipment Maintenance Scheduler for Coffee Vault
 * Version: 1.0.0
 * Last Updated: 2025-10-26
 *
 * Automated equipment maintenance tracking and reminders.
 * Monitors equipment usage, generates maintenance schedules,
 * and provides alerts for overdue maintenance tasks.
 *
 * Dependencies: None (pure JavaScript)
 * Usage: Import in Dataview/Datacore queries or run via Templater
 *
 * @example
 * const scheduler = require('./maintenance-scheduler.js');
 * const schedule = await scheduler.getMaintenanceSchedule(dv);
 * console.log(scheduler.formatScheduleAsMarkdown(schedule));
 */

// ============================================
// CONFIGURATION
// ============================================

/**
 * Default maintenance intervals (in days or uses)
 */
const MAINTENANCE_INTERVALS = {
  grinder: {
    deepClean: { days: 30, uses: null, priority: 'high' },
    burReplacement: { days: 365, uses: null, priority: 'medium' },
    calibration: { days: 90, uses: null, priority: 'medium' }
  },
  espressoMachine: {
    groupHeadClean: { days: 7, uses: 50, priority: 'high' },
    backflush: { days: 14, uses: 100, priority: 'high' },
    descale: { days: 90, uses: null, priority: 'high' },
    waterFilterChange: { days: 60, uses: null, priority: 'medium' },
    gasketReplacement: { days: 365, uses: null, priority: 'low' }
  },
  pourOver: {
    deepClean: { days: 30, uses: null, priority: 'medium' },
    filterReplace: { days: null, uses: 50, priority: 'low' }
  },
  frenchPress: {
    deepClean: { days: 14, uses: null, priority: 'medium' },
    meshInspection: { days: 90, uses: null, priority: 'low' }
  },
  aeropress: {
    sealReplacement: { days: 180, uses: 200, priority: 'medium' },
    deepClean: { days: 30, uses: null, priority: 'low' }
  },
  kettle: {
    descale: { days: 60, uses: null, priority: 'high' },
    deepClean: { days: 30, uses: null, priority: 'medium' }
  },
  scale: {
    calibration: { days: 90, uses: null, priority: 'medium' },
    batteryCheck: { days: 180, uses: null, priority: 'low' }
  }
};

/**
 * Warning thresholds (days before due)
 */
const WARNING_THRESHOLDS = {
  urgent: 0,      // Overdue or due today
  high: 3,        // Due within 3 days
  medium: 7,      // Due within 1 week
  low: 14         // Due within 2 weeks
};

// ============================================
// MAIN FUNCTIONS
// ============================================

/**
 * Get complete maintenance schedule for all equipment
 * @param {Object} dv - Dataview API instance
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} Complete maintenance schedule
 *
 * @example
 * const schedule = await getMaintenanceSchedule(dv, {
 *   includeCompleted: false,
 *   daysAhead: 30
 * });
 */
async function getMaintenanceSchedule(dv, options = {}) {
  const {
    includeCompleted = false,
    daysAhead = 30,
    equipmentFilter = null
  } = options;

  try {
    // Get all equipment from vault
    const equipment = await getEquipmentList(dv);

    // Get maintenance history
    const maintenanceHistory = await getMaintenanceHistory(dv);

    // Calculate equipment usage from coffee logs
    const usageStats = await calculateEquipmentUsage(dv);

    const schedule = {
      generated: new Date().toISOString().split('T')[0],
      daysAhead,
      equipment: [],
      tasks: [],
      alerts: {
        overdue: [],
        urgent: [],
        upcoming: []
      },
      summary: {
        totalTasks: 0,
        overdueTasks: 0,
        upcomingTasks: 0,
        completedThisMonth: 0
      }
    };

    // Process each equipment item
    for (const item of equipment) {
      const equipmentType = normalizeEquipmentType(item.type);
      const intervals = MAINTENANCE_INTERVALS[equipmentType];

      if (!intervals) {
        console.warn(`No maintenance schedule defined for equipment type: ${equipmentType}`);
        continue;
      }

      if (equipmentFilter && item.name !== equipmentFilter) {
        continue;
      }

      const equipmentTasks = [];
      const usage = usageStats[item.name] || { totalUses: 0, lastUsed: null };

      // Generate tasks for each maintenance type
      for (const [taskType, interval] of Object.entries(intervals)) {
        const lastMaintenance = getLastMaintenance(
          maintenanceHistory,
          item.name,
          taskType
        );

        const task = calculateNextMaintenance(
          item.name,
          equipmentType,
          taskType,
          interval,
          lastMaintenance,
          usage
        );

        if (task) {
          // Check if task is within our timeframe
          const daysUntilDue = task.daysUntilDue;

          if (!includeCompleted && task.status === 'completed') {
            continue;
          }

          if (daysUntilDue <= daysAhead || task.status === 'overdue') {
            equipmentTasks.push(task);
            schedule.tasks.push(task);

            // Categorize alerts
            if (task.status === 'overdue') {
              schedule.alerts.overdue.push(task);
              schedule.summary.overdueTasks++;
            } else if (daysUntilDue <= WARNING_THRESHOLDS.high) {
              schedule.alerts.urgent.push(task);
            } else if (daysUntilDue <= WARNING_THRESHOLDS.medium) {
              schedule.alerts.upcoming.push(task);
            }

            schedule.summary.totalTasks++;
            if (task.status === 'upcoming') {
              schedule.summary.upcomingTasks++;
            }
          }
        }
      }

      if (equipmentTasks.length > 0) {
        schedule.equipment.push({
          name: item.name,
          type: equipmentType,
          usage: usage.totalUses,
          lastUsed: usage.lastUsed,
          tasks: equipmentTasks
        });
      }
    }

    // Calculate completed tasks this month
    const thisMonth = new Date().toISOString().slice(0, 7);
    schedule.summary.completedThisMonth = maintenanceHistory.filter(
      h => h.date && h.date.startsWith(thisMonth)
    ).length;

    // Sort tasks by due date
    schedule.tasks.sort((a, b) => {
      if (a.status === 'overdue' && b.status !== 'overdue') return -1;
      if (b.status === 'overdue' && a.status !== 'overdue') return 1;
      return a.daysUntilDue - b.daysUntilDue;
    });

    return schedule;

  } catch (error) {
    console.error("Error generating maintenance schedule:", error);
    throw error;
  }
}

/**
 * Calculate next maintenance due date
 * @param {string} equipmentName - Name of equipment
 * @param {string} equipmentType - Type of equipment
 * @param {string} taskType - Type of maintenance task
 * @param {Object} interval - Maintenance interval configuration
 * @param {Object|null} lastMaintenance - Last maintenance record
 * @param {Object} usage - Equipment usage statistics
 * @returns {Object|null} Maintenance task details
 */
function calculateNextMaintenance(
  equipmentName,
  equipmentType,
  taskType,
  interval,
  lastMaintenance,
  usage
) {
  const today = new Date();
  let dueDate = null;
  let basedOn = null;

  // Calculate due date based on days interval
  if (interval.days) {
    const lastDate = lastMaintenance
      ? new Date(lastMaintenance.date)
      : new Date(today.getFullYear(), today.getMonth(), today.getDate() - interval.days);

    dueDate = new Date(lastDate);
    dueDate.setDate(dueDate.getDate() + interval.days);
    basedOn = 'days';
  }

  // Calculate due date based on uses (if applicable and more urgent)
  if (interval.uses && usage.totalUses > 0) {
    const usesSinceLastMaintenance = lastMaintenance
      ? usage.totalUses - (lastMaintenance.usesAtMaintenance || 0)
      : usage.totalUses;

    if (usesSinceLastMaintenance >= interval.uses) {
      // Overdue based on uses
      dueDate = today;
      basedOn = 'uses';
    } else if (usesSinceLastMaintenance > interval.uses * 0.8) {
      // Calculate estimated date based on usage pattern
      const avgUsesPerDay = usage.totalUses /
        Math.max(1, Math.floor((today - new Date(usage.lastUsed)) / (1000 * 60 * 60 * 24)));
      const usesRemaining = interval.uses - usesSinceLastMaintenance;
      const daysUntilDue = Math.floor(usesRemaining / avgUsesPerDay);

      const estimatedDueDate = new Date(today);
      estimatedDueDate.setDate(estimatedDueDate.getDate() + daysUntilDue);

      if (!dueDate || estimatedDueDate < dueDate) {
        dueDate = estimatedDueDate;
        basedOn = 'uses';
      }
    }
  }

  if (!dueDate) return null;

  // Calculate days until due
  const daysUntilDue = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));

  // Determine status
  let status = 'upcoming';
  if (daysUntilDue < 0) {
    status = 'overdue';
  } else if (daysUntilDue === 0) {
    status = 'due-today';
  }

  return {
    equipment: equipmentName,
    equipmentType,
    taskType: formatTaskName(taskType),
    taskKey: taskType,
    dueDate: dueDate.toISOString().split('T')[0],
    daysUntilDue,
    status,
    priority: interval.priority,
    basedOn,
    lastCompleted: lastMaintenance ? lastMaintenance.date : 'Never',
    interval: interval.days ? `${interval.days} days` : `${interval.uses} uses`
  };
}

/**
 * Get list of all equipment from vault
 * @param {Object} dv - Dataview API instance
 * @returns {Promise<Array>} Array of equipment items
 */
async function getEquipmentList(dv) {
  try {
    const equipmentPages = dv.pages('"Equipment"').values || [];

    return equipmentPages.map(page => ({
      name: page.file.name,
      type: page.type || page['equipment-type'] || 'unknown',
      purchaseDate: page['purchase-date'],
      model: page.model,
      file: page.file
    }));
  } catch (error) {
    console.warn("Could not find Equipment folder, using defaults");
    return getDefaultEquipment();
  }
}

/**
 * Get default equipment if no Equipment folder exists
 * @returns {Array} Default equipment list
 */
function getDefaultEquipment() {
  return [
    { name: 'Grinder', type: 'grinder', purchaseDate: null },
    { name: 'Espresso Machine', type: 'espressoMachine', purchaseDate: null },
    { name: 'V60', type: 'pourOver', purchaseDate: null },
    { name: 'Kettle', type: 'kettle', purchaseDate: null },
    { name: 'Scale', type: 'scale', purchaseDate: null }
  ];
}

/**
 * Get maintenance history from vault
 * @param {Object} dv - Dataview API instance
 * @returns {Promise<Array>} Array of maintenance records
 */
async function getMaintenanceHistory(dv) {
  try {
    const maintenanceLogs = dv.pages('"Maintenance"')
      .where(p => p.type === 'maintenance-log')
      .values || [];

    return maintenanceLogs.map(log => ({
      equipment: log.equipment,
      taskType: log['task-type'] || log.task,
      date: log.date,
      notes: log.notes,
      usesAtMaintenance: log['uses-at-maintenance'] || 0,
      file: log.file
    }));
  } catch (error) {
    console.warn("No maintenance history found");
    return [];
  }
}

/**
 * Calculate equipment usage from coffee logs
 * @param {Object} dv - Dataview API instance
 * @returns {Promise<Object>} Usage statistics by equipment
 */
async function calculateEquipmentUsage(dv) {
  const usage = {};

  try {
    const coffeeLogs = dv.pages('"Coffee Logs"')
      .where(p => p.type === 'coffee-log')
      .values || [];

    coffeeLogs.forEach(log => {
      const method = log['brew-method'];
      const date = log.date;

      // Map brew method to equipment
      const equipment = mapBrewMethodToEquipment(method);

      equipment.forEach(eq => {
        if (!usage[eq]) {
          usage[eq] = { totalUses: 0, lastUsed: null };
        }

        usage[eq].totalUses++;

        if (!usage[eq].lastUsed || date > usage[eq].lastUsed) {
          usage[eq].lastUsed = date;
        }
      });

      // Always count grinder usage
      if (!usage['Grinder']) {
        usage['Grinder'] = { totalUses: 0, lastUsed: null };
      }
      usage['Grinder'].totalUses++;
      if (!usage['Grinder'].lastUsed || date > usage['Grinder'].lastUsed) {
        usage['Grinder'].lastUsed = date;
      }

      // Always count scale usage
      if (!usage['Scale']) {
        usage['Scale'] = { totalUses: 0, lastUsed: null };
      }
      usage['Scale'].totalUses++;
      if (!usage['Scale'].lastUsed || date > usage['Scale'].lastUsed) {
        usage['Scale'].lastUsed = date;
      }
    });

    return usage;

  } catch (error) {
    console.error("Error calculating equipment usage:", error);
    return {};
  }
}

/**
 * Map brew method to equipment
 * @param {string} method - Brew method name
 * @returns {Array} Array of equipment names
 */
function mapBrewMethodToEquipment(method) {
  const mapping = {
    'espresso': ['Espresso Machine'],
    'pour-over': ['V60', 'Kettle'],
    'v60': ['V60', 'Kettle'],
    'chemex': ['Chemex', 'Kettle'],
    'aeropress': ['Aeropress', 'Kettle'],
    'french-press': ['French Press', 'Kettle'],
    'cold-brew': ['Cold Brew Maker']
  };

  return mapping[method] || [];
}

/**
 * Get last maintenance record for equipment/task
 * @param {Array} history - Maintenance history
 * @param {string} equipment - Equipment name
 * @param {string} taskType - Task type
 * @returns {Object|null} Last maintenance record
 */
function getLastMaintenance(history, equipment, taskType) {
  const matches = history.filter(
    h => h.equipment === equipment && h.taskType === taskType
  ).sort((a, b) => b.date.localeCompare(a.date));

  return matches.length > 0 ? matches[0] : null;
}

/**
 * Normalize equipment type for lookup
 * @param {string} type - Equipment type string
 * @returns {string} Normalized type
 */
function normalizeEquipmentType(type) {
  const normalized = type.toLowerCase().replace(/[^a-z]/g, '');

  const mapping = {
    'grinder': 'grinder',
    'espressomachine': 'espressoMachine',
    'espresso': 'espressoMachine',
    'pourover': 'pourOver',
    'v60': 'pourOver',
    'chemex': 'pourOver',
    'frenchpress': 'frenchPress',
    'aeropress': 'aeropress',
    'kettle': 'kettle',
    'scale': 'scale'
  };

  return mapping[normalized] || type;
}

/**
 * Format task name for display
 * @param {string} taskKey - Task key
 * @returns {string} Formatted task name
 */
function formatTaskName(taskKey) {
  return taskKey
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

// ============================================
// REMINDER FUNCTIONS
// ============================================

/**
 * Get tasks due today
 * @param {Object} dv - Dataview API instance
 * @returns {Promise<Array>} Tasks due today
 */
async function getTasksDueToday(dv) {
  const schedule = await getMaintenanceSchedule(dv, { daysAhead: 0 });
  return schedule.tasks.filter(t => t.daysUntilDue <= 0);
}

/**
 * Get overdue tasks
 * @param {Object} dv - Dataview API instance
 * @returns {Promise<Array>} Overdue tasks
 */
async function getOverdueTasks(dv) {
  const schedule = await getMaintenanceSchedule(dv);
  return schedule.alerts.overdue;
}

/**
 * Get upcoming tasks (next 7 days)
 * @param {Object} dv - Dataview API instance
 * @returns {Promise<Array>} Upcoming tasks
 */
async function getUpcomingTasks(dv) {
  const schedule = await getMaintenanceSchedule(dv, { daysAhead: 7 });
  return schedule.tasks.filter(t => t.daysUntilDue > 0 && t.daysUntilDue <= 7);
}

/**
 * Create maintenance reminder notification
 * @param {Array} tasks - Tasks to remind about
 * @returns {string} Formatted reminder message
 */
function createReminder(tasks) {
  if (tasks.length === 0) {
    return "No maintenance tasks require attention today.";
  }

  let message = `🔧 Equipment Maintenance Reminder\n\n`;
  message += `You have ${tasks.length} task${tasks.length > 1 ? 's' : ''} requiring attention:\n\n`;

  tasks.forEach((task, i) => {
    const icon = task.status === 'overdue' ? '🔴' :
                 task.status === 'due-today' ? '🟡' : '🟢';
    const statusText = task.status === 'overdue'
      ? `OVERDUE by ${Math.abs(task.daysUntilDue)} days`
      : task.status === 'due-today'
      ? 'DUE TODAY'
      : `Due in ${task.daysUntilDue} days`;

    message += `${i + 1}. ${icon} ${task.equipment} - ${task.taskType}\n`;
    message += `   Status: ${statusText}\n`;
    message += `   Priority: ${task.priority.toUpperCase()}\n\n`;
  });

  return message;
}

// ============================================
// FORMATTING FUNCTIONS
// ============================================

/**
 * Format schedule as Markdown
 * @param {Object} schedule - Maintenance schedule
 * @returns {string} Formatted Markdown
 */
function formatScheduleAsMarkdown(schedule) {
  let md = `# 🔧 Equipment Maintenance Schedule\n\n`;
  md += `**Generated**: ${schedule.generated}\n\n`;

  // Summary
  md += `## 📊 Summary\n\n`;
  md += `- **Total Tasks**: ${schedule.summary.totalTasks}\n`;
  md += `- **Overdue**: ${schedule.summary.overdueTasks}\n`;
  md += `- **Upcoming**: ${schedule.summary.upcomingTasks}\n`;
  md += `- **Completed This Month**: ${schedule.summary.completedThisMonth}\n\n`;

  // Alerts
  if (schedule.alerts.overdue.length > 0) {
    md += `---\n\n`;
    md += `## 🔴 Overdue Tasks\n\n`;
    schedule.alerts.overdue.forEach(task => {
      md += `- **${task.equipment}** - ${task.taskType}\n`;
      md += `  - Overdue by: ${Math.abs(task.daysUntilDue)} days\n`;
      md += `  - Priority: ${task.priority}\n`;
      md += `  - Last completed: ${task.lastCompleted}\n\n`;
    });
  }

  if (schedule.alerts.urgent.length > 0) {
    md += `---\n\n`;
    md += `## 🟡 Urgent (Due Within 3 Days)\n\n`;
    schedule.alerts.urgent.forEach(task => {
      md += `- **${task.equipment}** - ${task.taskType}\n`;
      md += `  - Due: ${task.dueDate} (${task.daysUntilDue} days)\n`;
      md += `  - Priority: ${task.priority}\n\n`;
    });
  }

  // Full schedule by equipment
  md += `---\n\n`;
  md += `## 📅 Full Schedule\n\n`;

  schedule.equipment.forEach(eq => {
    md += `### ${eq.name}\n\n`;
    md += `- **Type**: ${eq.type}\n`;
    md += `- **Total Uses**: ${eq.usage}\n`;
    if (eq.lastUsed) {
      md += `- **Last Used**: ${eq.lastUsed}\n`;
    }
    md += `\n**Maintenance Tasks:**\n\n`;

    eq.tasks.forEach(task => {
      const icon = task.status === 'overdue' ? '🔴' :
                   task.status === 'due-today' ? '🟡' : '🟢';
      md += `${icon} **${task.taskType}**\n`;
      md += `  - Due: ${task.dueDate} (${task.daysUntilDue >= 0 ? `in ${task.daysUntilDue} days` : `${Math.abs(task.daysUntilDue)} days overdue`})\n`;
      md += `  - Interval: ${task.interval}\n`;
      md += `  - Last completed: ${task.lastCompleted}\n`;
      md += `  - Priority: ${task.priority}\n\n`;
    });

    md += `\n`;
  });

  md += `---\n\n`;
  md += `*Generated by Equipment Maintenance Scheduler*\n`;

  return md;
}

/**
 * Format schedule as JSON
 * @param {Object} schedule - Maintenance schedule
 * @returns {string} JSON string
 */
function formatScheduleAsJSON(schedule) {
  return JSON.stringify(schedule, null, 2);
}

/**
 * Format schedule as calendar events (iCal format)
 * @param {Object} schedule - Maintenance schedule
 * @returns {string} iCal formatted string
 */
function formatScheduleAsICalendar(schedule) {
  let ical = `BEGIN:VCALENDAR\n`;
  ical += `VERSION:2.0\n`;
  ical += `PRODID:-//Coffee Vault//Maintenance Scheduler//EN\n`;
  ical += `CALSCALE:GREGORIAN\n`;

  schedule.tasks.forEach((task, i) => {
    const uid = `maintenance-${i}-${Date.now()}@coffeevault.local`;
    const dtstamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const dtstart = task.dueDate.replace(/-/g, '');

    ical += `BEGIN:VEVENT\n`;
    ical += `UID:${uid}\n`;
    ical += `DTSTAMP:${dtstamp}\n`;
    ical += `DTSTART;VALUE=DATE:${dtstart}\n`;
    ical += `SUMMARY:${task.equipment} - ${task.taskType}\n`;
    ical += `DESCRIPTION:Priority: ${task.priority}\\nInterval: ${task.interval}\\nLast completed: ${task.lastCompleted}\n`;
    ical += `STATUS:CONFIRMED\n`;
    ical += `PRIORITY:${task.priority === 'high' ? '1' : task.priority === 'medium' ? '5' : '9'}\n`;
    ical += `END:VEVENT\n`;
  });

  ical += `END:VCALENDAR\n`;

  return ical;
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
  // Main functions
  getMaintenanceSchedule,
  getTasksDueToday,
  getOverdueTasks,
  getUpcomingTasks,
  createReminder,

  // Formatting
  formatScheduleAsMarkdown,
  formatScheduleAsJSON,
  formatScheduleAsICalendar,

  // Utilities
  calculateEquipmentUsage,
  getMaintenanceHistory,
  getEquipmentList,

  // Configuration
  MAINTENANCE_INTERVALS,
  WARNING_THRESHOLDS
};
