/**
 * Data Export Pipeline for Coffee Vault
 * Version: 1.0.0
 * Last Updated: 2025-10-26
 *
 * Comprehensive data export system supporting multiple formats:
 * - CSV (for spreadsheet analysis)
 * - JSON (for data interchange and backup)
 * - PDF (for sharing and printing) - requires HTML conversion
 * - Markdown (for documentation)
 *
 * Dependencies: None (pure JavaScript)
 * Usage: Import in Dataview/Datacore queries or run via Templater
 *
 * @example
 * const exporter = require('./data-export-pipeline.js');
 * const data = await exporter.exportCoffeeLogs(dv, 'csv');
 * console.log(data);
 */

// ============================================
// CONFIGURATION
// ============================================

/**
 * Export configuration defaults
 */
const EXPORT_CONFIG = {
  csv: {
    delimiter: ',',
    linebreak: '\n',
    quoteChar: '"',
    escapeChar: '"',
    includeHeaders: true,
    dateFormat: 'YYYY-MM-DD'
  },
  json: {
    pretty: true,
    indent: 2,
    includeMetadata: true
  },
  markdown: {
    includeYAML: true,
    tableFormat: true,
    includeStats: true
  }
};

/**
 * Field configurations for different data types
 */
const FIELD_CONFIGS = {
  coffeeLogs: [
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'beans', label: 'Beans', type: 'string' },
    { key: 'brew-method', label: 'Brew Method', type: 'string' },
    { key: 'dose', label: 'Dose (g)', type: 'number' },
    { key: 'water-temp', label: 'Water Temp (°F)', type: 'number' },
    { key: 'brew-time', label: 'Brew Time', type: 'string' },
    { key: 'grind-size', label: 'Grind Size', type: 'string' },
    { key: 'rating', label: 'Rating', type: 'number' },
    { key: 'notes', label: 'Notes', type: 'string' }
  ],
  beans: [
    { key: 'bean-name', label: 'Bean Name', type: 'string' },
    { key: 'roaster', label: 'Roaster', type: 'string' },
    { key: 'origin', label: 'Origin', type: 'string' },
    { key: 'roast-level', label: 'Roast Level', type: 'string' },
    { key: 'roast-date', label: 'Roast Date', type: 'date' },
    { key: 'purchase-date', label: 'Purchase Date', type: 'date' },
    { key: 'weight', label: 'Weight (g)', type: 'number' },
    { key: 'price', label: 'Price ($)', type: 'number' },
    { key: 'status', label: 'Status', type: 'string' },
    { key: 'tasting-notes', label: 'Tasting Notes', type: 'string' }
  ],
  equipment: [
    { key: 'name', label: 'Equipment Name', type: 'string' },
    { key: 'type', label: 'Type', type: 'string' },
    { key: 'brand', label: 'Brand', type: 'string' },
    { key: 'model', label: 'Model', type: 'string' },
    { key: 'purchase-date', label: 'Purchase Date', type: 'date' },
    { key: 'price', label: 'Price ($)', type: 'number' },
    { key: 'status', label: 'Status', type: 'string' }
  ]
};

// ============================================
// MAIN EXPORT FUNCTIONS
// ============================================

/**
 * Export coffee logs to specified format
 * @param {Object} dv - Dataview API instance
 * @param {string} format - Export format: 'csv', 'json', 'markdown'
 * @param {Object} options - Export options
 * @returns {Promise<string>} Exported data as string
 *
 * @example
 * const csv = await exportCoffeeLogs(dv, 'csv', {
 *   dateRange: { start: '2025-01', end: '2025-03' },
 *   includeStats: true
 * });
 */
async function exportCoffeeLogs(dv, format = 'csv', options = {}) {
  try {
    const {
      dateRange = null,
      brewMethod = null,
      minRating = null,
      includeStats = false,
      sortBy = 'date',
      sortOrder = 'desc'
    } = options;

    // Query coffee logs
    let query = dv.pages('"Coffee Logs"')
      .where(p => p.type === 'coffee-log');

    // Apply filters
    if (dateRange) {
      if (dateRange.start) {
        query = query.where(p => p.date >= dateRange.start);
      }
      if (dateRange.end) {
        query = query.where(p => p.date <= dateRange.end);
      }
    }

    if (brewMethod) {
      query = query.where(p => p['brew-method'] === brewMethod);
    }

    if (minRating !== null) {
      query = query.where(p => p.rating >= minRating);
    }

    // Sort
    query = query.sort(p => p[sortBy], sortOrder);

    const logs = query.array();

    if (logs.length === 0) {
      throw new Error('No coffee logs found matching the specified criteria');
    }

    // Extract data
    const data = logs.map(log => extractFields(log, FIELD_CONFIGS.coffeeLogs));

    // Generate export based on format
    let exported;
    switch (format.toLowerCase()) {
      case 'csv':
        exported = exportToCSV(data, FIELD_CONFIGS.coffeeLogs, options);
        break;
      case 'json':
        exported = exportToJSON(data, {
          ...options,
          metadata: includeStats ? generateStats(logs) : null
        });
        break;
      case 'markdown':
        exported = exportToMarkdown(data, FIELD_CONFIGS.coffeeLogs, {
          ...options,
          title: 'Coffee Brewing Logs',
          stats: includeStats ? generateStats(logs) : null
        });
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }

    return exported;

  } catch (error) {
    console.error('Error exporting coffee logs:', error);
    throw error;
  }
}

/**
 * Export bean library to specified format
 * @param {Object} dv - Dataview API instance
 * @param {string} format - Export format
 * @param {Object} options - Export options
 * @returns {Promise<string>} Exported data
 */
async function exportBeans(dv, format = 'csv', options = {}) {
  try {
    const {
      status = null,
      origin = null,
      roaster = null,
      sortBy = 'bean-name'
    } = options;

    let query = dv.pages('"Beans Library"');

    if (status) {
      query = query.where(p => p.status === status);
    }

    if (origin) {
      query = query.where(p => p.origin === origin);
    }

    if (roaster) {
      query = query.where(p => p.roaster && p.roaster.path === roaster);
    }

    const beans = query.sort(p => p[sortBy]).array();

    if (beans.length === 0) {
      throw new Error('No beans found matching the specified criteria');
    }

    const data = beans.map(bean => extractFields(bean, FIELD_CONFIGS.beans));

    switch (format.toLowerCase()) {
      case 'csv':
        return exportToCSV(data, FIELD_CONFIGS.beans, options);
      case 'json':
        return exportToJSON(data, options);
      case 'markdown':
        return exportToMarkdown(data, FIELD_CONFIGS.beans, {
          ...options,
          title: 'Bean Library'
        });
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }

  } catch (error) {
    console.error('Error exporting beans:', error);
    throw error;
  }
}

/**
 * Export equipment inventory to specified format
 * @param {Object} dv - Dataview API instance
 * @param {string} format - Export format
 * @param {Object} options - Export options
 * @returns {Promise<string>} Exported data
 */
async function exportEquipment(dv, format = 'csv', options = {}) {
  try {
    const query = dv.pages('"Equipment"');
    const equipment = query.array();

    if (equipment.length === 0) {
      throw new Error('No equipment found');
    }

    const data = equipment.map(item => extractFields(item, FIELD_CONFIGS.equipment));

    switch (format.toLowerCase()) {
      case 'csv':
        return exportToCSV(data, FIELD_CONFIGS.equipment, options);
      case 'json':
        return exportToJSON(data, options);
      case 'markdown':
        return exportToMarkdown(data, FIELD_CONFIGS.equipment, {
          ...options,
          title: 'Equipment Inventory'
        });
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }

  } catch (error) {
    console.error('Error exporting equipment:', error);
    throw error;
  }
}

/**
 * Export complete vault data (all types)
 * @param {Object} dv - Dataview API instance
 * @param {string} format - Export format
 * @param {Object} options - Export options
 * @returns {Promise<Object>} Exported data by type
 */
async function exportAll(dv, format = 'json', options = {}) {
  try {
    const exports = {
      generated: new Date().toISOString(),
      format,
      data: {}
    };

    // Export all data types
    const coffeeLogs = await exportCoffeeLogs(dv, format, options);
    const beans = await exportBeans(dv, format, options);
    const equipment = await exportEquipment(dv, format, options);

    if (format === 'json') {
      exports.data.coffeeLogs = JSON.parse(coffeeLogs);
      exports.data.beans = JSON.parse(beans);
      exports.data.equipment = JSON.parse(equipment);
      return JSON.stringify(exports, null, 2);
    } else {
      // For CSV and Markdown, return separate sections
      return {
        coffeeLogs,
        beans,
        equipment
      };
    }

  } catch (error) {
    console.error('Error exporting all data:', error);
    throw error;
  }
}

// ============================================
// FORMAT-SPECIFIC EXPORT FUNCTIONS
// ============================================

/**
 * Export data to CSV format
 * @param {Array} data - Array of data objects
 * @param {Array} fieldConfig - Field configuration
 * @param {Object} options - CSV options
 * @returns {string} CSV formatted string
 */
function exportToCSV(data, fieldConfig, options = {}) {
  const config = { ...EXPORT_CONFIG.csv, ...options };
  const { delimiter, linebreak, quoteChar, escapeChar, includeHeaders } = config;

  let csv = '';

  // Add headers
  if (includeHeaders) {
    const headers = fieldConfig.map(field => escapeCSVValue(field.label, quoteChar, escapeChar));
    csv += headers.join(delimiter) + linebreak;
  }

  // Add data rows
  data.forEach(row => {
    const values = fieldConfig.map(field => {
      const value = row[field.key];
      return escapeCSVValue(formatValue(value, field.type), quoteChar, escapeChar);
    });
    csv += values.join(delimiter) + linebreak;
  });

  return csv;
}

/**
 * Export data to JSON format
 * @param {Array} data - Array of data objects
 * @param {Object} options - JSON options
 * @returns {string} JSON formatted string
 */
function exportToJSON(data, options = {}) {
  const config = { ...EXPORT_CONFIG.json, ...options };
  const { pretty, indent, includeMetadata, metadata } = config;

  const output = {
    exported: new Date().toISOString(),
    recordCount: data.length,
    data
  };

  if (includeMetadata && metadata) {
    output.metadata = metadata;
  }

  return pretty
    ? JSON.stringify(output, null, indent)
    : JSON.stringify(output);
}

/**
 * Export data to Markdown format
 * @param {Array} data - Array of data objects
 * @param {Array} fieldConfig - Field configuration
 * @param {Object} options - Markdown options
 * @returns {string} Markdown formatted string
 */
function exportToMarkdown(data, fieldConfig, options = {}) {
  const { title = 'Data Export', stats = null, includeYAML = true } = options;

  let md = '';

  // Add YAML frontmatter
  if (includeYAML) {
    md += `---\n`;
    md += `title: ${title}\n`;
    md += `exported: ${new Date().toISOString()}\n`;
    md += `recordCount: ${data.length}\n`;
    md += `---\n\n`;
  }

  // Add title
  md += `# ${title}\n\n`;
  md += `**Exported**: ${new Date().toISOString().split('T')[0]}\n`;
  md += `**Records**: ${data.length}\n\n`;

  // Add statistics if provided
  if (stats) {
    md += `## Statistics\n\n`;
    md += formatStatsAsMarkdown(stats);
    md += `\n`;
  }

  // Add data table
  md += `## Data\n\n`;
  md += formatDataAsTable(data, fieldConfig);
  md += `\n`;

  return md;
}

/**
 * Format data as Markdown table
 * @param {Array} data - Data array
 * @param {Array} fieldConfig - Field configuration
 * @returns {string} Markdown table
 */
function formatDataAsTable(data, fieldConfig) {
  let table = '';

  // Headers
  const headers = fieldConfig.map(f => f.label).join(' | ');
  table += `| ${headers} |\n`;

  // Separator
  const separator = fieldConfig.map(() => '---').join(' | ');
  table += `| ${separator} |\n`;

  // Data rows
  data.forEach(row => {
    const values = fieldConfig.map(field => {
      const value = row[field.key];
      return formatValue(value, field.type) || '';
    });
    table += `| ${values.join(' | ')} |\n`;
  });

  return table;
}

/**
 * Format statistics as Markdown
 * @param {Object} stats - Statistics object
 * @returns {string} Formatted statistics
 */
function formatStatsAsMarkdown(stats) {
  let md = '';

  if (stats.totalSessions !== undefined) {
    md += `- **Total Sessions**: ${stats.totalSessions}\n`;
  }
  if (stats.averageRating !== undefined) {
    md += `- **Average Rating**: ${stats.averageRating.toFixed(2)}/5.0\n`;
  }
  if (stats.totalCoffeeUsed !== undefined) {
    md += `- **Total Coffee Used**: ${stats.totalCoffeeUsed.toFixed(0)}g\n`;
  }
  if (stats.topMethod !== undefined) {
    md += `- **Top Brew Method**: ${stats.topMethod}\n`;
  }
  if (stats.dateRange !== undefined) {
    md += `- **Date Range**: ${stats.dateRange.start} to ${stats.dateRange.end}\n`;
  }

  return md;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Extract fields from a page object based on field configuration
 * @param {Object} page - Dataview page object
 * @param {Array} fieldConfig - Field configuration
 * @returns {Object} Extracted field data
 */
function extractFields(page, fieldConfig) {
  const extracted = {};

  fieldConfig.forEach(field => {
    let value = page[field.key];

    // Handle special cases
    if (field.key === 'name' && !value) {
      value = page.file?.name;
    }

    // Handle link objects
    if (value && typeof value === 'object' && value.path) {
      value = value.path.replace('.md', '').split('/').pop();
    }

    extracted[field.key] = value;
  });

  return extracted;
}

/**
 * Format value based on type
 * @param {any} value - Value to format
 * @param {string} type - Value type
 * @returns {string} Formatted value
 */
function formatValue(value, type) {
  if (value === null || value === undefined) {
    return '';
  }

  switch (type) {
    case 'date':
      return typeof value === 'string' ? value : new Date(value).toISOString().split('T')[0];
    case 'number':
      return typeof value === 'number' ? value.toString() : value;
    case 'string':
    default:
      return String(value);
  }
}

/**
 * Escape CSV value
 * @param {string} value - Value to escape
 * @param {string} quoteChar - Quote character
 * @param {string} escapeChar - Escape character
 * @returns {string} Escaped value
 */
function escapeCSVValue(value, quoteChar = '"', escapeChar = '"') {
  if (value === null || value === undefined) {
    return '';
  }

  const strValue = String(value);

  // Check if value needs quoting
  if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
    // Escape quote characters
    const escaped = strValue.replace(new RegExp(quoteChar, 'g'), escapeChar + quoteChar);
    return quoteChar + escaped + quoteChar;
  }

  return strValue;
}

/**
 * Generate statistics from coffee logs
 * @param {Array} logs - Coffee log entries
 * @returns {Object} Statistics
 */
function generateStats(logs) {
  const ratings = logs.map(l => l.rating).filter(r => r != null);
  const doses = logs.map(l => l.dose).filter(d => d != null);
  const methods = logs.map(l => l['brew-method']).filter(m => m);
  const dates = logs.map(l => l.date).filter(d => d).sort();

  // Count method frequency
  const methodCounts = {};
  methods.forEach(m => {
    methodCounts[m] = (methodCounts[m] || 0) + 1;
  });
  const topMethod = Object.entries(methodCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return {
    totalSessions: logs.length,
    averageRating: ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0,
    totalCoffeeUsed: doses.reduce((a, b) => a + b, 0),
    topMethod,
    dateRange: dates.length > 0
      ? { start: dates[0], end: dates[dates.length - 1] }
      : { start: 'N/A', end: 'N/A' }
  };
}

/**
 * Generate filename for export
 * @param {string} type - Data type (coffeeLogs, beans, equipment)
 * @param {string} format - Export format
 * @returns {string} Filename
 */
function generateFilename(type, format) {
  const timestamp = new Date().toISOString().split('T')[0];
  return `coffee-vault-${type}-${timestamp}.${format}`;
}

/**
 * Save export to file (for use with Obsidian filesystem)
 * @param {Object} app - Obsidian app instance
 * @param {string} content - Content to save
 * @param {string} filename - Filename
 * @param {string} folder - Folder path (default: 'Exports')
 * @returns {Promise<void>}
 */
async function saveExport(app, content, filename, folder = 'Exports') {
  try {
    // Ensure folder exists
    const folderPath = folder;
    if (!await app.vault.adapter.exists(folderPath)) {
      await app.vault.createFolder(folderPath);
    }

    // Create file
    const filePath = `${folderPath}/${filename}`;
    await app.vault.create(filePath, content);

    console.log(`Export saved to: ${filePath}`);
    return filePath;

  } catch (error) {
    console.error('Error saving export:', error);
    throw error;
  }
}

// ============================================
// BATCH EXPORT FUNCTIONS
// ============================================

/**
 * Export data by date range
 * @param {Object} dv - Dataview API instance
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @param {string} format - Export format
 * @returns {Promise<string>} Exported data
 */
async function exportByDateRange(dv, startDate, endDate, format = 'csv') {
  return await exportCoffeeLogs(dv, format, {
    dateRange: { start: startDate, end: endDate },
    includeStats: true
  });
}

/**
 * Export monthly data
 * @param {Object} dv - Dataview API instance
 * @param {string} month - Month in YYYY-MM format
 * @param {string} format - Export format
 * @returns {Promise<string>} Exported data
 */
async function exportMonth(dv, month, format = 'csv') {
  const [year, monthNum] = month.split('-').map(Number);
  const startDate = `${year}-${String(monthNum).padStart(2, '0')}-01`;
  const endDate = new Date(year, monthNum, 0).toISOString().split('T')[0];

  return await exportByDateRange(dv, startDate, endDate, format);
}

/**
 * Export yearly data
 * @param {Object} dv - Dataview API instance
 * @param {number} year - Year (e.g., 2025)
 * @param {string} format - Export format
 * @returns {Promise<string>} Exported data
 */
async function exportYear(dv, year, format = 'csv') {
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  return await exportByDateRange(dv, startDate, endDate, format);
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
  // Main export functions
  exportCoffeeLogs,
  exportBeans,
  exportEquipment,
  exportAll,

  // Batch exports
  exportByDateRange,
  exportMonth,
  exportYear,

  // Format-specific
  exportToCSV,
  exportToJSON,
  exportToMarkdown,

  // Utilities
  generateFilename,
  saveExport,
  generateStats,

  // Configuration
  EXPORT_CONFIG,
  FIELD_CONFIGS
};
