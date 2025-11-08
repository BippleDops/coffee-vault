/**
 * Coffee Vault - Data Exporter
 * Export coffee data to CSV, JSON, and PDF formats
 * @module data-exporter
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Validates export options
 * @private
 * @param {Object} options - Export options
 * @throws {Error} If options are invalid
 */
function validateExportOptions(options) {
  if (!options || typeof options !== 'object') {
    throw new Error('Options object is required');
  }

  if (!options.dataPath || typeof options.dataPath !== 'string') {
    throw new Error('dataPath is required and must be a string');
  }

  if (!options.outputPath || typeof options.outputPath !== 'string') {
    throw new Error('outputPath is required and must be a string');
  }

  const validFormats = ['csv', 'json', 'pdf'];
  if (!options.format || !validFormats.includes(options.format)) {
    throw new Error(`format must be one of: ${validFormats.join(', ')}`);
  }
}

/**
 * Exports coffee data to CSV format
 * @async
 * @param {Object} options - Export options
 * @param {string} options.dataPath - Path to coffee logs directory
 * @param {string} options.outputPath - Path to save CSV file
 * @param {Date} [options.startDate] - Start date filter
 * @param {Date} [options.endDate] - End date filter
 * @param {Array<string>} [options.fields] - Fields to include
 * @returns {Promise<Object>} Export result
 * @throws {Error} If export fails
 *
 * @example
 * await exportToCSV({
 *   dataPath: '/path/to/coffee-logs',
 *   outputPath: '/path/to/exports/coffee-data.csv',
 *   startDate: new Date('2025-10-01'),
 *   endDate: new Date('2025-10-31'),
 *   fields: ['date', 'bean', 'method', 'rating']
 * });
 */
async function exportToCSV(options) {
  try {
    validateExportOptions({ ...options, format: 'csv' });

    const { dataPath, outputPath, startDate, endDate, fields } = options;

    // Load data
    const logs = await loadCoffeeLogs(dataPath, startDate, endDate);

    if (logs.length === 0) {
      throw new Error('No data found to export');
    }

    // Determine fields to export
    const exportFields = fields || Object.keys(logs[0]);

    // Generate CSV content
    let csv = exportFields.join(',') + '\n';

    logs.forEach(log => {
      const row = exportFields.map(field => {
        let value = log[field] || '';

        // Handle dates
        if (value instanceof Date) {
          value = value.toISOString().split('T')[0];
        }

        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          value = `"${value.replace(/"/g, '""')}"`;
        }

        return value;
      });

      csv += row.join(',') + '\n';
    });

    // Save CSV file
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, csv, 'utf8');

    return {
      success: true,
      format: 'csv',
      recordCount: logs.length,
      outputPath,
      fileSize: Buffer.byteLength(csv, 'utf8')
    };

  } catch (error) {
    throw new Error(`Failed to export to CSV: ${error.message}`);
  }
}

/**
 * Exports coffee data to JSON format
 * @async
 * @param {Object} options - Export options
 * @param {string} options.dataPath - Path to coffee logs directory
 * @param {string} options.outputPath - Path to save JSON file
 * @param {Date} [options.startDate] - Start date filter
 * @param {Date} [options.endDate] - End date filter
 * @param {boolean} [options.pretty=true] - Pretty print JSON
 * @returns {Promise<Object>} Export result
 * @throws {Error} If export fails
 *
 * @example
 * await exportToJSON({
 *   dataPath: '/path/to/coffee-logs',
 *   outputPath: '/path/to/exports/coffee-data.json',
 *   startDate: new Date('2025-10-01'),
 *   endDate: new Date('2025-10-31'),
 *   pretty: true
 * });
 */
async function exportToJSON(options) {
  try {
    validateExportOptions({ ...options, format: 'json' });

    const { dataPath, outputPath, startDate, endDate, pretty = true } = options;

    // Load data
    const logs = await loadCoffeeLogs(dataPath, startDate, endDate);

    if (logs.length === 0) {
      throw new Error('No data found to export');
    }

    // Create export object
    const exportData = {
      exportDate: new Date().toISOString(),
      recordCount: logs.length,
      dateRange: {
        start: startDate ? startDate.toISOString() : null,
        end: endDate ? endDate.toISOString() : null
      },
      data: logs
    };

    // Generate JSON content
    const json = pretty
      ? JSON.stringify(exportData, null, 2)
      : JSON.stringify(exportData);

    // Save JSON file
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, json, 'utf8');

    return {
      success: true,
      format: 'json',
      recordCount: logs.length,
      outputPath,
      fileSize: Buffer.byteLength(json, 'utf8')
    };

  } catch (error) {
    throw new Error(`Failed to export to JSON: ${error.message}`);
  }
}

/**
 * Exports coffee data to PDF format (markdown-based)
 * @async
 * @param {Object} options - Export options
 * @param {string} options.dataPath - Path to coffee logs directory
 * @param {string} options.outputPath - Path to save PDF/markdown file
 * @param {Date} [options.startDate] - Start date filter
 * @param {Date} [options.endDate] - End date filter
 * @param {string} [options.title] - Report title
 * @param {boolean} [options.includeStats=true] - Include statistics
 * @returns {Promise<Object>} Export result
 * @throws {Error} If export fails
 *
 * @example
 * await exportToPDF({
 *   dataPath: '/path/to/coffee-logs',
 *   outputPath: '/path/to/exports/coffee-report.md',
 *   startDate: new Date('2025-10-01'),
 *   endDate: new Date('2025-10-31'),
 *   title: 'October Coffee Report',
 *   includeStats: true
 * });
 */
async function exportToPDF(options) {
  try {
    validateExportOptions({ ...options, format: 'pdf' });

    const {
      dataPath,
      outputPath,
      startDate,
      endDate,
      title = 'Coffee Vault Export',
      includeStats = true
    } = options;

    // Load data
    const logs = await loadCoffeeLogs(dataPath, startDate, endDate);

    if (logs.length === 0) {
      throw new Error('No data found to export');
    }

    // Generate markdown/PDF content
    let content = `# ${title}\n\n`;
    content += `**Generated:** ${new Date().toISOString().split('T')[0]}\n`;

    if (startDate || endDate) {
      content += `**Date Range:** `;
      if (startDate) content += `${startDate.toISOString().split('T')[0]}`;
      content += ` to `;
      if (endDate) content += `${endDate.toISOString().split('T')[0]}`;
      content += `\n`;
    }

    content += `**Total Records:** ${logs.length}\n\n`;
    content += `---\n\n`;

    // Include statistics if requested
    if (includeStats) {
      const stats = calculateStats(logs);
      content += formatStats(stats);
      content += `---\n\n`;
    }

    // Add detailed records
    content += `## Detailed Records\n\n`;

    logs.forEach((log, index) => {
      content += `### ${index + 1}. ${log.bean || 'Unknown Bean'}\n\n`;
      content += `- **Date:** ${log.date || 'N/A'}\n`;
      if (log.method) content += `- **Method:** ${log.method}\n`;
      if (log.grind) content += `- **Grind:** ${log.grind}\n`;
      if (log.dose) content += `- **Dose:** ${log.dose}g\n`;
      if (log.water) content += `- **Water:** ${log.water}ml\n`;
      if (log.temperature) content += `- **Temperature:** ${log.temperature}°C\n`;
      if (log.rating) content += `- **Rating:** ${log.rating}/10\n`;
      if (log.notes) content += `- **Notes:** ${log.notes}\n`;
      content += `\n`;
    });

    // Save file
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, content, 'utf8');

    return {
      success: true,
      format: 'pdf',
      recordCount: logs.length,
      outputPath,
      fileSize: Buffer.byteLength(content, 'utf8'),
      note: 'Generated as Markdown (convert to PDF using pandoc or similar tool)'
    };

  } catch (error) {
    throw new Error(`Failed to export to PDF: ${error.message}`);
  }
}

/**
 * Exports coffee data to multiple formats simultaneously
 * @async
 * @param {Object} options - Export options
 * @param {string} options.dataPath - Path to coffee logs directory
 * @param {string} options.outputDir - Directory to save export files
 * @param {Array<string>} options.formats - Formats to export ('csv', 'json', 'pdf')
 * @param {Date} [options.startDate] - Start date filter
 * @param {Date} [options.endDate] - End date filter
 * @param {string} [options.baseFilename='coffee-export'] - Base filename
 * @returns {Promise<Object>} Export results
 * @throws {Error} If export fails
 *
 * @example
 * const results = await exportMultipleFormats({
 *   dataPath: '/path/to/coffee-logs',
 *   outputDir: '/path/to/exports',
 *   formats: ['csv', 'json', 'pdf'],
 *   startDate: new Date('2025-10-01'),
 *   endDate: new Date('2025-10-31'),
 *   baseFilename: 'october-2025'
 * });
 */
async function exportMultipleFormats(options) {
  try {
    if (!options || typeof options !== 'object') {
      throw new Error('Options object is required');
    }

    const {
      dataPath,
      outputDir,
      formats,
      startDate,
      endDate,
      baseFilename = 'coffee-export'
    } = options;

    if (!Array.isArray(formats) || formats.length === 0) {
      throw new Error('formats must be a non-empty array');
    }

    const results = {
      success: true,
      exports: [],
      errors: []
    };

    // Create output directory
    await fs.mkdir(outputDir, { recursive: true });

    // Export to each format
    for (const format of formats) {
      try {
        let result;
        const outputPath = path.join(outputDir, `${baseFilename}.${format === 'pdf' ? 'md' : format}`);

        switch (format) {
          case 'csv':
            result = await exportToCSV({
              dataPath,
              outputPath,
              startDate,
              endDate
            });
            break;

          case 'json':
            result = await exportToJSON({
              dataPath,
              outputPath,
              startDate,
              endDate
            });
            break;

          case 'pdf':
            result = await exportToPDF({
              dataPath,
              outputPath,
              startDate,
              endDate,
              title: `Coffee Export - ${baseFilename}`
            });
            break;

          default:
            throw new Error(`Unsupported format: ${format}`);
        }

        results.exports.push(result);

      } catch (error) {
        results.errors.push({
          format,
          error: error.message
        });
        results.success = false;
      }
    }

    return results;

  } catch (error) {
    throw new Error(`Failed to export multiple formats: ${error.message}`);
  }
}

/**
 * Loads coffee logs from directory
 * @async
 * @private
 * @param {string} dataPath - Path to coffee logs directory
 * @param {Date} [startDate] - Start date filter
 * @param {Date} [endDate] - End date filter
 * @returns {Promise<Array>} Array of coffee logs
 */
async function loadCoffeeLogs(dataPath, startDate, endDate) {
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

        // Filter by date range if provided
        let filteredEntries = entries;
        if (startDate || endDate) {
          filteredEntries = entries.filter(entry => {
            const entryDate = new Date(entry.date);
            if (startDate && entryDate < startDate) return false;
            if (endDate && entryDate > endDate) return false;
            return true;
          });
        }

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
    const notesMatch = line.match(/Notes:\s*([^\n]+)/i);

    if (dateMatch) currentLog.date = dateMatch[1];
    if (beanMatch) currentLog.bean = beanMatch[1].trim();
    if (methodMatch) currentLog.method = methodMatch[1].trim();
    if (ratingMatch) currentLog.rating = parseInt(ratingMatch[1]);
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
 * Calculates statistics from logs
 * @private
 * @param {Array} logs - Coffee logs
 * @returns {Object} Statistics
 */
function calculateStats(logs) {
  const stats = {
    totalBrews: logs.length,
    uniqueBeans: new Set(logs.map(log => log.bean)).size,
    methods: {},
    avgRating: 0,
    avgDose: 0,
    avgWater: 0
  };

  logs.forEach(log => {
    if (log.method) {
      stats.methods[log.method] = (stats.methods[log.method] || 0) + 1;
    }
  });

  const ratings = logs.filter(log => log.rating).map(log => log.rating);
  if (ratings.length > 0) {
    stats.avgRating = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2);
  }

  const doses = logs.filter(log => log.dose).map(log => log.dose);
  if (doses.length > 0) {
    stats.avgDose = (doses.reduce((a, b) => a + b, 0) / doses.length).toFixed(1);
  }

  const waters = logs.filter(log => log.water).map(log => log.water);
  if (waters.length > 0) {
    stats.avgWater = Math.round(waters.reduce((a, b) => a + b, 0) / waters.length);
  }

  return stats;
}

/**
 * Formats statistics into markdown
 * @private
 * @param {Object} stats - Statistics
 * @returns {string} Formatted statistics
 */
function formatStats(stats) {
  let content = `## Statistics\n\n`;
  content += `- **Total Brews:** ${stats.totalBrews}\n`;
  content += `- **Unique Beans:** ${stats.uniqueBeans}\n`;
  if (stats.avgRating > 0) content += `- **Average Rating:** ${stats.avgRating}/10\n`;
  if (stats.avgDose > 0) content += `- **Average Dose:** ${stats.avgDose}g\n`;
  if (stats.avgWater > 0) content += `- **Average Water:** ${stats.avgWater}ml\n`;

  content += `\n### Methods Used\n\n`;
  Object.entries(stats.methods)
    .sort((a, b) => b[1] - a[1])
    .forEach(([method, count]) => {
      const percentage = ((count / stats.totalBrews) * 100).toFixed(1);
      content += `- **${method}:** ${count} (${percentage}%)\n`;
    });

  content += `\n`;
  return content;
}

module.exports = {
  exportToCSV,
  exportToJSON,
  exportToPDF,
  exportMultipleFormats
};

/**
 * Usage Examples:
 *
 * const {
 *   exportToCSV,
 *   exportToJSON,
 *   exportToPDF,
 *   exportMultipleFormats
 * } = require('./data-exporter');
 *
 * // Export to CSV
 * await exportToCSV({
 *   dataPath: '/Users/jonsussmanstudio/Desktop/CodingObsidian/CoffeeLogs',
 *   outputPath: '/Users/jonsussmanstudio/Desktop/CodingObsidian/Exports/coffee-data.csv',
 *   startDate: new Date('2025-10-01'),
 *   endDate: new Date('2025-10-31')
 * });
 *
 * // Export to JSON
 * await exportToJSON({
 *   dataPath: '/Users/jonsussmanstudio/Desktop/CodingObsidian/CoffeeLogs',
 *   outputPath: '/Users/jonsussmanstudio/Desktop/CodingObsidian/Exports/coffee-data.json',
 *   pretty: true
 * });
 *
 * // Export to PDF (markdown)
 * await exportToPDF({
 *   dataPath: '/Users/jonsussmanstudio/Desktop/CodingObsidian/CoffeeLogs',
 *   outputPath: '/Users/jonsussmanstudio/Desktop/CodingObsidian/Exports/coffee-report.md',
 *   title: 'Monthly Coffee Report',
 *   includeStats: true
 * });
 *
 * // Export to multiple formats at once
 * const results = await exportMultipleFormats({
 *   dataPath: '/Users/jonsussmanstudio/Desktop/CodingObsidian/CoffeeLogs',
 *   outputDir: '/Users/jonsussmanstudio/Desktop/CodingObsidian/Exports',
 *   formats: ['csv', 'json', 'pdf'],
 *   baseFilename: 'october-2025'
 * });
 *
 * console.log(`Exported ${results.exports.length} files`);
 */
