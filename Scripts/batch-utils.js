/**
 * Coffee Vault - Batch Utilities (Standalone)
 * Bulk editing and data management utilities for coffee logs
 * @module batch-utils
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Validates batch operation options
 * @private
 * @param {Object} options - Operation options
 * @throws {Error} If options are invalid
 */
function validateBatchOptions(options) {
  if (!options || typeof options !== 'object') {
    throw new Error('Options object is required');
  }

  if (!options.dataPath || typeof options.dataPath !== 'string') {
    throw new Error('dataPath is required and must be a string');
  }
}

/**
 * Batch updates a property across multiple log files
 * @async
 * @param {Object} options - Update options
 * @param {string} options.dataPath - Path to coffee logs directory
 * @param {Function} options.filter - Filter function to select files
 * @param {string} options.property - Property to update
 * @param {any} options.value - New value for property
 * @param {boolean} [options.dryRun=true] - Preview changes without applying
 * @returns {Promise<Object>} Update results
 * @throws {Error} If update fails
 *
 * @example
 * const result = await batchUpdateProperty({
 *   dataPath: '/path/to/coffee-logs',
 *   filter: (log) => log.bean === 'Ethiopia Yirgacheffe',
 *   property: 'origin',
 *   value: 'Ethiopia',
 *   dryRun: false
 * });
 */
async function batchUpdateProperty(options) {
  try {
    validateBatchOptions(options);

    const {
      dataPath,
      filter,
      property,
      value,
      dryRun = true
    } = options;

    if (!property || typeof property !== 'string') {
      throw new Error('property is required and must be a string');
    }

    if (!filter || typeof filter !== 'function') {
      throw new Error('filter must be a function');
    }

    // Load all logs
    const logs = await loadAllLogs(dataPath);

    const results = {
      totalFiles: logs.length,
      processed: 0,
      skipped: 0,
      errors: [],
      changes: [],
      dryRun
    };

    for (const logFile of logs) {
      try {
        const entries = logFile.entries.filter(filter);

        if (entries.length === 0) {
          results.skipped++;
          continue;
        }

        // Update matching entries
        entries.forEach(entry => {
          const oldValue = entry[property];
          entry[property] = value;

          results.changes.push({
            file: logFile.filename,
            property,
            oldValue,
            newValue: value
          });
        });

        if (!dryRun) {
          // Save updated file
          await saveLogFile(
            path.join(dataPath, logFile.filename),
            logFile.entries,
            logFile.format
          );
          results.processed++;
        }

      } catch (error) {
        results.errors.push({
          file: logFile.filename,
          error: error.message
        });
      }
    }

    results.message = dryRun
      ? `Dry run: Would update ${results.changes.length} entries across ${results.processed} files`
      : `Updated ${results.changes.length} entries across ${results.processed} files`;

    return results;

  } catch (error) {
    throw new Error(`Failed to batch update property: ${error.message}`);
  }
}

/**
 * Batch renames a property across all log files
 * @async
 * @param {Object} options - Rename options
 * @param {string} options.dataPath - Path to coffee logs directory
 * @param {string} options.oldProperty - Current property name
 * @param {string} options.newProperty - New property name
 * @param {boolean} [options.dryRun=true] - Preview changes without applying
 * @returns {Promise<Object>} Rename results
 *
 * @example
 * const result = await batchRenameProperty({
 *   dataPath: '/path/to/coffee-logs',
 *   oldProperty: 'coffee-bean',
 *   newProperty: 'bean',
 *   dryRun: false
 * });
 */
async function batchRenameProperty(options) {
  try {
    validateBatchOptions(options);

    const {
      dataPath,
      oldProperty,
      newProperty,
      dryRun = true
    } = options;

    if (!oldProperty || !newProperty) {
      throw new Error('oldProperty and newProperty are required');
    }

    const logs = await loadAllLogs(dataPath);

    const results = {
      totalFiles: logs.length,
      processed: 0,
      skipped: 0,
      errors: [],
      changes: [],
      dryRun
    };

    for (const logFile of logs) {
      try {
        let hasChanges = false;

        logFile.entries.forEach(entry => {
          if (entry.hasOwnProperty(oldProperty)) {
            entry[newProperty] = entry[oldProperty];
            delete entry[oldProperty];
            hasChanges = true;

            results.changes.push({
              file: logFile.filename,
              oldProperty,
              newProperty
            });
          }
        });

        if (hasChanges) {
          if (!dryRun) {
            await saveLogFile(
              path.join(dataPath, logFile.filename),
              logFile.entries,
              logFile.format
            );
            results.processed++;
          }
        } else {
          results.skipped++;
        }

      } catch (error) {
        results.errors.push({
          file: logFile.filename,
          error: error.message
        });
      }
    }

    results.message = dryRun
      ? `Dry run: Would rename '${oldProperty}' to '${newProperty}' in ${results.changes.length} entries`
      : `Renamed '${oldProperty}' to '${newProperty}' in ${results.changes.length} entries`;

    return results;

  } catch (error) {
    throw new Error(`Failed to batch rename property: ${error.message}`);
  }
}

/**
 * Batch deletes entries matching criteria
 * @async
 * @param {Object} options - Delete options
 * @param {string} options.dataPath - Path to coffee logs directory
 * @param {Function} options.filter - Filter function to select entries to delete
 * @param {boolean} [options.dryRun=true] - Preview changes without applying
 * @param {boolean} [options.createBackup=true] - Create backup before deleting
 * @returns {Promise<Object>} Delete results
 *
 * @example
 * const result = await batchDeleteEntries({
 *   dataPath: '/path/to/coffee-logs',
 *   filter: (log) => log.rating < 3,
 *   dryRun: false,
 *   createBackup: true
 * });
 */
async function batchDeleteEntries(options) {
  try {
    validateBatchOptions(options);

    const {
      dataPath,
      filter,
      dryRun = true,
      createBackup = true
    } = options;

    if (!filter || typeof filter !== 'function') {
      throw new Error('filter must be a function');
    }

    // Create backup if requested
    if (!dryRun && createBackup) {
      await createDataBackup(dataPath);
    }

    const logs = await loadAllLogs(dataPath);

    const results = {
      totalFiles: logs.length,
      processed: 0,
      skipped: 0,
      deleted: 0,
      errors: [],
      deletedEntries: [],
      dryRun
    };

    for (const logFile of logs) {
      try {
        const originalCount = logFile.entries.length;
        const remainingEntries = logFile.entries.filter(entry => !filter(entry));
        const deletedCount = originalCount - remainingEntries.length;

        if (deletedCount === 0) {
          results.skipped++;
          continue;
        }

        logFile.entries.forEach((entry, index) => {
          if (filter(entry)) {
            results.deletedEntries.push({
              file: logFile.filename,
              index,
              entry: { ...entry }
            });
          }
        });

        results.deleted += deletedCount;

        if (!dryRun) {
          if (remainingEntries.length > 0) {
            await saveLogFile(
              path.join(dataPath, logFile.filename),
              remainingEntries,
              logFile.format
            );
          } else {
            // Delete file if no entries remain
            await fs.unlink(path.join(dataPath, logFile.filename));
          }
          results.processed++;
        }

      } catch (error) {
        results.errors.push({
          file: logFile.filename,
          error: error.message
        });
      }
    }

    results.message = dryRun
      ? `Dry run: Would delete ${results.deleted} entries from ${results.processed} files`
      : `Deleted ${results.deleted} entries from ${results.processed} files`;

    if (createBackup && !dryRun) {
      results.backupCreated = true;
    }

    return results;

  } catch (error) {
    throw new Error(`Failed to batch delete entries: ${error.message}`);
  }
}

/**
 * Batch validates and normalizes data
 * @async
 * @param {Object} options - Validation options
 * @param {string} options.dataPath - Path to coffee logs directory
 * @param {Object} [options.rules] - Validation rules
 * @param {boolean} [options.fix=false] - Automatically fix issues
 * @param {boolean} [options.dryRun=true] - Preview changes without applying
 * @returns {Promise<Object>} Validation results
 *
 * @example
 * const result = await batchValidateAndNormalize({
 *   dataPath: '/path/to/coffee-logs',
 *   rules: {
 *     rating: { min: 1, max: 10 },
 *     date: { format: 'YYYY-MM-DD' }
 *   },
 *   fix: true,
 *   dryRun: false
 * });
 */
async function batchValidateAndNormalize(options) {
  try {
    validateBatchOptions(options);

    const {
      dataPath,
      rules = {},
      fix = false,
      dryRun = true
    } = options;

    const logs = await loadAllLogs(dataPath);

    const results = {
      totalFiles: logs.length,
      totalEntries: 0,
      validEntries: 0,
      invalidEntries: 0,
      fixed: 0,
      issues: [],
      dryRun
    };

    for (const logFile of logs) {
      try {
        let hasChanges = false;

        logFile.entries.forEach((entry, index) => {
          results.totalEntries++;

          const entryIssues = validateEntry(entry, rules);

          if (entryIssues.length > 0) {
            results.invalidEntries++;

            entryIssues.forEach(issue => {
              results.issues.push({
                file: logFile.filename,
                entryIndex: index,
                ...issue
              });

              // Auto-fix if enabled
              if (fix && issue.fixable) {
                applyFix(entry, issue);
                hasChanges = true;
                results.fixed++;
              }
            });
          } else {
            results.validEntries++;
          }
        });

        if (hasChanges && !dryRun) {
          await saveLogFile(
            path.join(dataPath, logFile.filename),
            logFile.entries,
            logFile.format
          );
        }

      } catch (error) {
        results.issues.push({
          file: logFile.filename,
          type: 'file-error',
          message: error.message
        });
      }
    }

    results.message = `Validated ${results.totalEntries} entries. ` +
                     `Valid: ${results.validEntries}, Invalid: ${results.invalidEntries}` +
                     (fix ? `, Fixed: ${results.fixed}` : '');

    return results;

  } catch (error) {
    throw new Error(`Failed to batch validate: ${error.message}`);
  }
}

/**
 * Validates a single entry against rules
 * @private
 * @param {Object} entry - Log entry
 * @param {Object} rules - Validation rules
 * @returns {Array} Array of issues
 */
function validateEntry(entry, rules) {
  const issues = [];

  // Check required fields
  if (rules.required) {
    rules.required.forEach(field => {
      if (!entry[field]) {
        issues.push({
          type: 'missing-field',
          field,
          message: `Missing required field: ${field}`,
          fixable: false
        });
      }
    });
  }

  // Check numeric ranges
  if (rules.rating) {
    const rating = parseFloat(entry.rating);
    if (entry.rating && (rating < rules.rating.min || rating > rules.rating.max)) {
      issues.push({
        type: 'out-of-range',
        field: 'rating',
        value: entry.rating,
        message: `Rating ${rating} out of range [${rules.rating.min}, ${rules.rating.max}]`,
        fixable: true,
        fix: {
          value: Math.max(rules.rating.min, Math.min(rules.rating.max, rating))
        }
      });
    }
  }

  // Check date format
  if (rules.date && entry.date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(entry.date)) {
      issues.push({
        type: 'invalid-format',
        field: 'date',
        value: entry.date,
        message: `Invalid date format: ${entry.date}`,
        fixable: false
      });
    }
  }

  return issues;
}

/**
 * Applies fix to entry
 * @private
 * @param {Object} entry - Log entry
 * @param {Object} issue - Issue with fix
 */
function applyFix(entry, issue) {
  if (issue.fix && issue.field) {
    entry[issue.field] = issue.fix.value;
  }
}

/**
 * Creates backup of data directory
 * @async
 * @private
 * @param {string} dataPath - Path to data directory
 * @returns {Promise<string>} Backup path
 */
async function createDataBackup(dataPath) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const backupPath = `${dataPath}-backup-${timestamp}`;

    await fs.mkdir(backupPath, { recursive: true });

    const files = await fs.readdir(dataPath);

    for (const file of files) {
      const srcPath = path.join(dataPath, file);
      const destPath = path.join(backupPath, file);
      const stat = await fs.stat(srcPath);

      if (stat.isFile()) {
        await fs.copyFile(srcPath, destPath);
      }
    }

    return backupPath;

  } catch (error) {
    throw new Error(`Failed to create backup: ${error.message}`);
  }
}

/**
 * Loads all log files from directory
 * @async
 * @private
 * @param {string} dataPath - Path to logs directory
 * @returns {Promise<Array>} Array of log file objects
 */
async function loadAllLogs(dataPath) {
  try {
    const files = await fs.readdir(dataPath);
    const logs = [];

    for (const file of files) {
      if (file.endsWith('.md') || file.endsWith('.json')) {
        const filePath = path.join(dataPath, file);
        const content = await fs.readFile(filePath, 'utf8');

        const format = file.endsWith('.json') ? 'json' : 'markdown';
        const entries = format === 'json'
          ? JSON.parse(content)
          : parseMarkdownLogs(content);

        logs.push({
          filename: file,
          format,
          entries: Array.isArray(entries) ? entries : [entries]
        });
      }
    }

    return logs;

  } catch (error) {
    throw new Error(`Failed to load logs: ${error.message}`);
  }
}

/**
 * Saves log file
 * @async
 * @private
 * @param {string} filePath - Path to log file
 * @param {Array} entries - Log entries
 * @param {string} format - File format ('json' or 'markdown')
 * @returns {Promise<void>}
 */
async function saveLogFile(filePath, entries, format) {
  try {
    let content;

    if (format === 'json') {
      content = JSON.stringify(entries, null, 2);
    } else {
      content = formatAsMarkdown(entries);
    }

    await fs.writeFile(filePath, content, 'utf8');

  } catch (error) {
    throw new Error(`Failed to save log file: ${error.message}`);
  }
}

/**
 * Parses markdown formatted logs
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
    const ratingMatch = line.match(/Rating:\s*(\d+\.?\d*)/i);
    const grindMatch = line.match(/Grind:\s*([^\n]+)/i);
    const doseMatch = line.match(/Dose:\s*(\d+\.?\d*)/i);
    const waterMatch = line.match(/Water:\s*(\d+)/i);
    const tempMatch = line.match(/Temperature:\s*(\d+)/i);
    const notesMatch = line.match(/Notes:\s*([^\n]+)/i);

    if (dateMatch) currentLog.date = dateMatch[1];
    if (beanMatch) currentLog.bean = beanMatch[1].trim();
    if (methodMatch) currentLog.method = methodMatch[1].trim();
    if (ratingMatch) currentLog.rating = parseFloat(ratingMatch[1]);
    if (grindMatch) currentLog.grind = grindMatch[1].trim();
    if (doseMatch) currentLog.dose = parseFloat(doseMatch[1]);
    if (waterMatch) currentLog.water = parseInt(waterMatch[1]);
    if (tempMatch) currentLog.temperature = parseInt(tempMatch[1]);
    if (notesMatch) currentLog.notes = notesMatch[1].trim();

    if (currentLog.date && currentLog.bean) {
      logs.push({ ...currentLog });
      currentLog = {};
    }
  }

  return logs;
}

/**
 * Formats entries as markdown
 * @private
 * @param {Array} entries - Log entries
 * @returns {string} Markdown formatted content
 */
function formatAsMarkdown(entries) {
  let markdown = '';

  entries.forEach((entry, index) => {
    if (index > 0) markdown += '\n---\n\n';

    markdown += `## Entry ${index + 1}\n\n`;
    if (entry.date) markdown += `Date: ${entry.date}\n`;
    if (entry.bean) markdown += `Bean: ${entry.bean}\n`;
    if (entry.method) markdown += `Method: ${entry.method}\n`;
    if (entry.grind) markdown += `Grind: ${entry.grind}\n`;
    if (entry.dose) markdown += `Dose: ${entry.dose}g\n`;
    if (entry.water) markdown += `Water: ${entry.water}ml\n`;
    if (entry.temperature) markdown += `Temperature: ${entry.temperature}°C\n`;
    if (entry.rating) markdown += `Rating: ${entry.rating}\n`;
    if (entry.notes) markdown += `Notes: ${entry.notes}\n`;
  });

  return markdown;
}

module.exports = {
  batchUpdateProperty,
  batchRenameProperty,
  batchDeleteEntries,
  batchValidateAndNormalize
};

/**
 * Usage Examples:
 *
 * const {
 *   batchUpdateProperty,
 *   batchRenameProperty,
 *   batchDeleteEntries,
 *   batchValidateAndNormalize
 * } = require('./batch-utils');
 *
 * // Update property across all matching logs
 * const updateResult = await batchUpdateProperty({
 *   dataPath: '/path/to/coffee-logs',
 *   filter: (log) => log.bean === 'Ethiopia Yirgacheffe',
 *   property: 'origin',
 *   value: 'Ethiopia',
 *   dryRun: false
 * });
 *
 * // Rename a property everywhere
 * const renameResult = await batchRenameProperty({
 *   dataPath: '/path/to/coffee-logs',
 *   oldProperty: 'coffee-bean',
 *   newProperty: 'bean',
 *   dryRun: false
 * });
 *
 * // Delete low-rated entries
 * const deleteResult = await batchDeleteEntries({
 *   dataPath: '/path/to/coffee-logs',
 *   filter: (log) => log.rating < 3,
 *   dryRun: false,
 *   createBackup: true
 * });
 *
 * // Validate and fix data issues
 * const validateResult = await batchValidateAndNormalize({
 *   dataPath: '/path/to/coffee-logs',
 *   rules: {
 *     required: ['date', 'bean', 'method'],
 *     rating: { min: 1, max: 10 },
 *     date: { format: 'YYYY-MM-DD' }
 *   },
 *   fix: true,
 *   dryRun: false
 * });
 *
 * console.log(`Updated: ${updateResult.changes.length} entries`);
 * console.log(`Renamed: ${renameResult.changes.length} properties`);
 * console.log(`Deleted: ${deleteResult.deleted} entries`);
 * console.log(`Validated: ${validateResult.totalEntries} entries, Fixed: ${validateResult.fixed}`);
 */
