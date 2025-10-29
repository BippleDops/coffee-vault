/**
 * Coffee Vault - Equipment Maintenance Reminder (Standalone)
 * Track equipment maintenance schedules and generate reminders
 * @module maintenance-reminder
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Default maintenance intervals in days
 * @const
 */
const DEFAULT_INTERVALS = {
  grinder: {
    cleaning: 7,
    deepClean: 30,
    burReplacement: 365,
    calibration: 90
  },
  espressoMachine: {
    groupHeadClean: 7,
    backflush: 14,
    descale: 90,
    waterFilter: 60,
    gasket: 365
  },
  brewer: {
    cleaning: 14,
    deepClean: 30,
    descale: 90
  },
  kettle: {
    descale: 60,
    deepClean: 30
  },
  scale: {
    calibration: 90,
    battery: 180
  }
};

/**
 * Validates maintenance configuration
 * @private
 * @param {Object} config - Maintenance configuration
 * @throws {Error} If configuration is invalid
 */
function validateMaintenanceConfig(config) {
  if (!config || typeof config !== 'object') {
    throw new Error('Configuration must be an object');
  }

  if (!config.equipment || !Array.isArray(config.equipment)) {
    throw new Error('Configuration must include equipment array');
  }

  config.equipment.forEach((item, index) => {
    if (!item.name || typeof item.name !== 'string') {
      throw new Error(`Equipment item ${index} must have a name`);
    }
    if (!item.type || typeof item.type !== 'string') {
      throw new Error(`Equipment item ${index} must have a type`);
    }
  });
}

/**
 * Loads maintenance configuration
 * @async
 * @param {string} configPath - Path to maintenance configuration JSON
 * @returns {Promise<Object>} Maintenance configuration
 * @throws {Error} If file cannot be read
 *
 * @example
 * const config = await loadMaintenanceConfig('/path/to/maintenance-config.json');
 */
async function loadMaintenanceConfig(configPath) {
  try {
    if (!configPath || typeof configPath !== 'string') {
      throw new Error('configPath is required and must be a string');
    }

    const content = await fs.readFile(configPath, 'utf8');
    const config = JSON.parse(content);

    validateMaintenanceConfig(config);

    // Convert date strings to Date objects
    if (config.maintenanceHistory) {
      config.maintenanceHistory = config.maintenanceHistory.map(record => ({
        ...record,
        date: new Date(record.date)
      }));
    }

    return config;

  } catch (error) {
    if (error.code === 'ENOENT') {
      // Return default configuration if file doesn't exist
      return {
        equipment: [],
        maintenanceHistory: [],
        customIntervals: {}
      };
    }
    throw new Error(`Failed to load maintenance config: ${error.message}`);
  }
}

/**
 * Saves maintenance configuration
 * @async
 * @param {string} configPath - Path to maintenance configuration JSON
 * @param {Object} config - Maintenance configuration
 * @returns {Promise<void>}
 * @throws {Error} If file cannot be written
 *
 * @example
 * await saveMaintenanceConfig('/path/to/maintenance-config.json', config);
 */
async function saveMaintenanceConfig(configPath, config) {
  try {
    if (!configPath || typeof configPath !== 'string') {
      throw new Error('configPath is required and must be a string');
    }

    validateMaintenanceConfig(config);

    await fs.mkdir(path.dirname(configPath), { recursive: true });
    await fs.writeFile(
      configPath,
      JSON.stringify(config, null, 2),
      'utf8'
    );

  } catch (error) {
    throw new Error(`Failed to save maintenance config: ${error.message}`);
  }
}

/**
 * Adds equipment to maintenance tracking
 * @async
 * @param {Object} options - Equipment options
 * @param {string} options.configPath - Path to configuration file
 * @param {string} options.name - Equipment name
 * @param {string} options.type - Equipment type
 * @param {Date|string} [options.purchaseDate] - Purchase date
 * @param {Object} [options.customIntervals] - Custom maintenance intervals
 * @returns {Promise<Object>} Added equipment
 *
 * @example
 * const equipment = await addEquipment({
 *   configPath: '/path/to/maintenance-config.json',
 *   name: 'Baratza Encore',
 *   type: 'grinder',
 *   purchaseDate: new Date('2025-01-15'),
 *   customIntervals: { cleaning: 5 }
 * });
 */
async function addEquipment(options) {
  try {
    if (!options || typeof options !== 'object') {
      throw new Error('Options object is required');
    }

    const {
      configPath,
      name,
      type,
      purchaseDate,
      customIntervals = {}
    } = options;

    if (!name || !type) {
      throw new Error('Equipment name and type are required');
    }

    const config = await loadMaintenanceConfig(configPath);

    // Check if equipment already exists
    const exists = config.equipment.find(e => e.name === name);
    if (exists) {
      throw new Error(`Equipment '${name}' already exists`);
    }

    const equipment = {
      id: Date.now().toString(),
      name,
      type,
      purchaseDate: purchaseDate ? (purchaseDate instanceof Date ? purchaseDate : new Date(purchaseDate)) : null,
      addedDate: new Date(),
      customIntervals
    };

    config.equipment.push(equipment);
    await saveMaintenanceConfig(configPath, config);

    return equipment;

  } catch (error) {
    throw new Error(`Failed to add equipment: ${error.message}`);
  }
}

/**
 * Records maintenance activity
 * @async
 * @param {Object} options - Maintenance record options
 * @param {string} options.configPath - Path to configuration file
 * @param {string} options.equipmentName - Equipment name
 * @param {string} options.taskType - Type of maintenance performed
 * @param {Date|string} [options.date] - Date of maintenance (defaults to today)
 * @param {string} [options.notes] - Additional notes
 * @returns {Promise<Object>} Maintenance record
 *
 * @example
 * const record = await recordMaintenance({
 *   configPath: '/path/to/maintenance-config.json',
 *   equipmentName: 'Baratza Encore',
 *   taskType: 'cleaning',
 *   date: new Date(),
 *   notes: 'Deep cleaned burrs and hopper'
 * });
 */
async function recordMaintenance(options) {
  try {
    if (!options || typeof options !== 'object') {
      throw new Error('Options object is required');
    }

    const {
      configPath,
      equipmentName,
      taskType,
      date = new Date(),
      notes = ''
    } = options;

    if (!equipmentName || !taskType) {
      throw new Error('Equipment name and task type are required');
    }

    const config = await loadMaintenanceConfig(configPath);

    // Verify equipment exists
    const equipment = config.equipment.find(e => e.name === equipmentName);
    if (!equipment) {
      throw new Error(`Equipment '${equipmentName}' not found`);
    }

    const record = {
      id: Date.now().toString(),
      equipmentName,
      equipmentId: equipment.id,
      taskType,
      date: date instanceof Date ? date : new Date(date),
      notes
    };

    if (!config.maintenanceHistory) {
      config.maintenanceHistory = [];
    }

    config.maintenanceHistory.push(record);
    await saveMaintenanceConfig(configPath, config);

    return record;

  } catch (error) {
    throw new Error(`Failed to record maintenance: ${error.message}`);
  }
}

/**
 * Generates maintenance schedule with due dates
 * @async
 * @param {Object} options - Schedule options
 * @param {string} options.configPath - Path to configuration file
 * @param {number} [options.daysAhead=30] - Days to look ahead
 * @returns {Promise<Object>} Maintenance schedule
 * @throws {Error} If configuration cannot be loaded
 *
 * @example
 * const schedule = await generateMaintenanceSchedule({
 *   configPath: '/path/to/maintenance-config.json',
 *   daysAhead: 30
 * });
 */
async function generateMaintenanceSchedule(options) {
  try {
    if (!options || typeof options !== 'object') {
      throw new Error('Options object is required');
    }

    const {
      configPath,
      daysAhead = 30
    } = options;

    const config = await loadMaintenanceConfig(configPath);
    const today = new Date();
    const schedule = {
      generated: today.toISOString().split('T')[0],
      daysAhead,
      tasks: [],
      overdue: [],
      upcoming: []
    };

    // Process each equipment item
    for (const equipment of config.equipment) {
      const intervals = {
        ...DEFAULT_INTERVALS[equipment.type],
        ...equipment.customIntervals
      };

      if (!intervals) {
        console.warn(`No maintenance intervals defined for type: ${equipment.type}`);
        continue;
      }

      // Generate tasks for each maintenance type
      for (const [taskType, intervalDays] of Object.entries(intervals)) {
        const lastMaintenance = getLastMaintenance(
          config.maintenanceHistory || [],
          equipment.name,
          taskType
        );

        const task = calculateMaintenanceTask(
          equipment,
          taskType,
          intervalDays,
          lastMaintenance,
          today
        );

        if (task) {
          schedule.tasks.push(task);

          // Categorize tasks
          if (task.daysUntilDue < 0) {
            schedule.overdue.push(task);
          } else if (task.daysUntilDue <= daysAhead) {
            schedule.upcoming.push(task);
          }
        }
      }
    }

    // Sort tasks by due date
    schedule.tasks.sort((a, b) => a.daysUntilDue - b.daysUntilDue);
    schedule.overdue.sort((a, b) => a.daysUntilDue - b.daysUntilDue);
    schedule.upcoming.sort((a, b) => a.daysUntilDue - b.daysUntilDue);

    return schedule;

  } catch (error) {
    throw new Error(`Failed to generate maintenance schedule: ${error.message}`);
  }
}

/**
 * Calculates maintenance task details
 * @private
 * @param {Object} equipment - Equipment item
 * @param {string} taskType - Task type
 * @param {number} intervalDays - Interval in days
 * @param {Object|null} lastMaintenance - Last maintenance record
 * @param {Date} today - Current date
 * @returns {Object} Task details
 */
function calculateMaintenanceTask(equipment, taskType, intervalDays, lastMaintenance, today) {
  const lastDate = lastMaintenance
    ? new Date(lastMaintenance.date)
    : equipment.purchaseDate
    ? new Date(equipment.purchaseDate)
    : new Date(today.getFullYear(), today.getMonth(), today.getDate() - intervalDays);

  const dueDate = new Date(lastDate);
  dueDate.setDate(dueDate.getDate() + intervalDays);

  const daysUntilDue = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));

  let status;
  if (daysUntilDue < 0) {
    status = 'overdue';
  } else if (daysUntilDue === 0) {
    status = 'due-today';
  } else if (daysUntilDue <= 3) {
    status = 'urgent';
  } else if (daysUntilDue <= 7) {
    status = 'upcoming';
  } else {
    status = 'scheduled';
  }

  return {
    equipmentName: equipment.name,
    equipmentType: equipment.type,
    taskType: formatTaskType(taskType),
    taskKey: taskType,
    dueDate: dueDate.toISOString().split('T')[0],
    daysUntilDue,
    status,
    intervalDays,
    lastPerformed: lastMaintenance ? lastMaintenance.date.toISOString().split('T')[0] : 'Never',
    lastNotes: lastMaintenance ? lastMaintenance.notes : null
  };
}

/**
 * Gets last maintenance record for equipment and task type
 * @private
 * @param {Array} history - Maintenance history
 * @param {string} equipmentName - Equipment name
 * @param {string} taskType - Task type
 * @returns {Object|null} Last maintenance record
 */
function getLastMaintenance(history, equipmentName, taskType) {
  const matches = history
    .filter(record =>
      record.equipmentName === equipmentName &&
      record.taskType === taskType
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return matches.length > 0 ? matches[0] : null;
}

/**
 * Formats task type for display
 * @private
 * @param {string} taskType - Task type key
 * @returns {string} Formatted task type
 */
function formatTaskType(taskType) {
  return taskType
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

/**
 * Generates maintenance reminders
 * @async
 * @param {Object} options - Reminder options
 * @param {string} options.configPath - Path to configuration file
 * @param {number} [options.urgentDays=3] - Days threshold for urgent reminders
 * @returns {Promise<Object>} Reminder data
 *
 * @example
 * const reminders = await generateMaintenanceReminders({
 *   configPath: '/path/to/maintenance-config.json',
 *   urgentDays: 3
 * });
 */
async function generateMaintenanceReminders(options) {
  try {
    const { configPath, urgentDays = 3 } = options;

    const schedule = await generateMaintenanceSchedule({
      configPath,
      daysAhead: urgentDays
    });

    const reminders = {
      hasReminders: false,
      overdueCount: schedule.overdue.length,
      upcomingCount: schedule.upcoming.length,
      overdueTasks: schedule.overdue,
      upcomingTasks: schedule.upcoming,
      message: ''
    };

    reminders.hasReminders = reminders.overdueCount > 0 || reminders.upcomingCount > 0;

    if (reminders.hasReminders) {
      reminders.message = formatReminderMessage(reminders);
    } else {
      reminders.message = 'No maintenance tasks require attention.';
    }

    return reminders;

  } catch (error) {
    throw new Error(`Failed to generate reminders: ${error.message}`);
  }
}

/**
 * Formats reminder message
 * @private
 * @param {Object} reminders - Reminder data
 * @returns {string} Formatted message
 */
function formatReminderMessage(reminders) {
  let message = 'Equipment Maintenance Reminders\n\n';

  if (reminders.overdueCount > 0) {
    message += `Overdue Tasks (${reminders.overdueCount}):\n`;
    reminders.overdueTasks.forEach((task, index) => {
      message += `${index + 1}. ${task.equipmentName} - ${task.taskType}\n`;
      message += `   Overdue by: ${Math.abs(task.daysUntilDue)} days\n`;
    });
    message += `\n`;
  }

  if (reminders.upcomingCount > 0) {
    message += `Upcoming Tasks (${reminders.upcomingCount}):\n`;
    reminders.upcomingTasks.forEach((task, index) => {
      message += `${index + 1}. ${task.equipmentName} - ${task.taskType}\n`;
      message += `   Due: ${task.dueDate} (${task.daysUntilDue} days)\n`;
    });
  }

  return message;
}

/**
 * Generates maintenance schedule report
 * @async
 * @param {Object} options - Report options
 * @param {string} options.configPath - Path to configuration file
 * @param {string} [options.outputPath] - Path to save report
 * @param {number} [options.daysAhead=30] - Days to look ahead
 * @returns {Promise<Object>} Report data
 *
 * @example
 * const report = await generateMaintenanceReport({
 *   configPath: '/path/to/maintenance-config.json',
 *   outputPath: '/path/to/reports/maintenance.md',
 *   daysAhead: 30
 * });
 */
async function generateMaintenanceReport(options) {
  try {
    const {
      configPath,
      outputPath,
      daysAhead = 30
    } = options;

    const schedule = await generateMaintenanceSchedule({
      configPath,
      daysAhead
    });

    const report = formatMaintenanceReport(schedule);

    if (outputPath) {
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, report, 'utf8');
    }

    return {
      schedule,
      report,
      generatedAt: new Date().toISOString()
    };

  } catch (error) {
    throw new Error(`Failed to generate maintenance report: ${error.message}`);
  }
}

/**
 * Formats maintenance schedule as markdown
 * @private
 * @param {Object} schedule - Maintenance schedule
 * @returns {string} Formatted markdown report
 */
function formatMaintenanceReport(schedule) {
  let report = `# Coffee Vault - Maintenance Schedule\n\n`;
  report += `**Generated:** ${schedule.generated}\n`;
  report += `**Days Ahead:** ${schedule.daysAhead}\n\n`;
  report += `---\n\n`;

  // Summary
  report += `## Summary\n\n`;
  report += `- **Total Tasks:** ${schedule.tasks.length}\n`;
  report += `- **Overdue:** ${schedule.overdue.length}\n`;
  report += `- **Upcoming:** ${schedule.upcoming.length}\n\n`;

  // Overdue tasks
  if (schedule.overdue.length > 0) {
    report += `## Overdue Tasks\n\n`;
    schedule.overdue.forEach((task, index) => {
      report += `### ${index + 1}. ${task.equipmentName} - ${task.taskType}\n`;
      report += `- **Overdue by:** ${Math.abs(task.daysUntilDue)} days\n`;
      report += `- **Due Date:** ${task.dueDate}\n`;
      report += `- **Last Performed:** ${task.lastPerformed}\n`;
      report += `- **Interval:** Every ${task.intervalDays} days\n`;
      if (task.lastNotes) {
        report += `- **Last Notes:** ${task.lastNotes}\n`;
      }
      report += `\n`;
    });
  }

  // Upcoming tasks
  if (schedule.upcoming.length > 0) {
    report += `## Upcoming Tasks\n\n`;
    schedule.upcoming.forEach((task, index) => {
      report += `### ${index + 1}. ${task.equipmentName} - ${task.taskType}\n`;
      report += `- **Due Date:** ${task.dueDate} (${task.daysUntilDue} days)\n`;
      report += `- **Status:** ${task.status}\n`;
      report += `- **Last Performed:** ${task.lastPerformed}\n`;
      report += `- **Interval:** Every ${task.intervalDays} days\n`;
      report += `\n`;
    });
  }

  // All scheduled tasks
  report += `## All Scheduled Tasks\n\n`;
  report += `| Equipment | Task | Due Date | Days Until Due | Status |\n`;
  report += `|-----------|------|----------|----------------|--------|\n`;

  schedule.tasks.forEach(task => {
    const statusIcon = task.status === 'overdue' ? '🔴' :
                       task.status === 'urgent' ? '🟡' : '🟢';
    report += `| ${task.equipmentName} | ${task.taskType} | ${task.dueDate} | ${task.daysUntilDue} | ${statusIcon} ${task.status} |\n`;
  });

  report += `\n`;
  return report;
}

module.exports = {
  loadMaintenanceConfig,
  saveMaintenanceConfig,
  addEquipment,
  recordMaintenance,
  generateMaintenanceSchedule,
  generateMaintenanceReminders,
  generateMaintenanceReport,
  DEFAULT_INTERVALS
};

/**
 * Usage Examples:
 *
 * const {
 *   addEquipment,
 *   recordMaintenance,
 *   generateMaintenanceSchedule,
 *   generateMaintenanceReminders,
 *   generateMaintenanceReport
 * } = require('./maintenance-reminder');
 *
 * // Add equipment
 * await addEquipment({
 *   configPath: '/path/to/maintenance-config.json',
 *   name: 'Baratza Encore',
 *   type: 'grinder',
 *   purchaseDate: new Date('2025-01-15')
 * });
 *
 * // Record maintenance
 * await recordMaintenance({
 *   configPath: '/path/to/maintenance-config.json',
 *   equipmentName: 'Baratza Encore',
 *   taskType: 'cleaning',
 *   notes: 'Deep cleaned burrs'
 * });
 *
 * // Generate schedule
 * const schedule = await generateMaintenanceSchedule({
 *   configPath: '/path/to/maintenance-config.json',
 *   daysAhead: 30
 * });
 *
 * // Get reminders
 * const reminders = await generateMaintenanceReminders({
 *   configPath: '/path/to/maintenance-config.json',
 *   urgentDays: 3
 * });
 * console.log(reminders.message);
 *
 * // Generate report
 * await generateMaintenanceReport({
 *   configPath: '/path/to/maintenance-config.json',
 *   outputPath: '/path/to/reports/maintenance.md',
 *   daysAhead: 30
 * });
 */
