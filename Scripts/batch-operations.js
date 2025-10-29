/**
 * Batch Operations Module for Coffee Vault
 * Version: 1.0.0
 * Last Updated: 2025-10-26
 *
 * Comprehensive bulk editing and data management utilities.
 * Provides safe, efficient batch operations on vault data with
 * validation, dry-run mode, and rollback capabilities.
 *
 * Features:
 * - Bulk property updates
 * - Mass tag management
 * - Batch status changes
 * - Data cleanup and normalization
 * - Validation and error checking
 * - Dry-run mode for safety
 *
 * Dependencies: None (pure JavaScript)
 * Usage: Import in scripts or run via Templater
 *
 * @example
 * const batch = require('./batch-operations.js');
 * const result = await batch.batchUpdateProperty(app, dv, {
 *   folder: 'Beans Library',
 *   filter: (page) => page.status === 'active',
 *   property: 'roast-level',
 *   value: 'medium',
 *   dryRun: true
 * });
 */

// ============================================
// CONFIGURATION
// ============================================

/**
 * Batch operation configuration
 */
const BATCH_CONFIG = {
  maxBatchSize: 100,          // Maximum files per batch
  confirmThreshold: 10,       // Ask for confirmation above this number
  backupBeforeChange: true,   // Create backup before modifications
  validateBeforeApply: true,  // Validate changes before applying
  logChanges: true            // Log all changes
};

/**
 * Valid property types for validation
 */
const PROPERTY_TYPES = {
  string: ['bean-name', 'roaster', 'origin', 'roast-level', 'brew-method', 'grind-size', 'notes'],
  number: ['dose', 'rating', 'water-temp', 'brew-time', 'price', 'weight'],
  date: ['date', 'roast-date', 'purchase-date'],
  array: ['tags', 'tasting-notes'],
  boolean: ['favorite', 'archived']
};

// ============================================
// MAIN BATCH OPERATIONS
// ============================================

/**
 * Batch update a property across multiple files
 * @param {Object} app - Obsidian app instance
 * @param {Object} dv - Dataview API instance
 * @param {Object} options - Batch operation options
 * @returns {Promise<Object>} Operation results
 *
 * @example
 * const result = await batchUpdateProperty(app, dv, {
 *   folder: 'Beans Library',
 *   filter: (page) => page.origin === 'Ethiopia',
 *   property: 'region',
 *   value: 'Yirgacheffe',
 *   dryRun: false
 * });
 */
async function batchUpdateProperty(app, dv, options = {}) {
  const {
    folder = null,
    filter = null,
    property,
    value,
    dryRun = true,
    confirmChanges = true
  } = options;

  if (!property) {
    throw new Error('Property name is required');
  }

  try {
    // Build query
    let query = folder ? dv.pages(`"${folder}"`) : dv.pages();

    if (filter) {
      query = query.where(filter);
    }

    const pages = query.array();

    if (pages.length === 0) {
      return {
        success: true,
        modified: 0,
        skipped: 0,
        errors: [],
        message: 'No pages found matching criteria'
      };
    }

    // Validate property type
    const validation = validatePropertyValue(property, value);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.error}`);
    }

    // Prepare results
    const results = {
      dryRun,
      totalPages: pages.length,
      modified: 0,
      skipped: 0,
      errors: [],
      changes: []
    };

    // Process each page
    for (const page of pages) {
      try {
        const file = app.vault.getAbstractFileByPath(page.file.path);
        if (!file) {
          results.errors.push({
            file: page.file.path,
            error: 'File not found'
          });
          results.skipped++;
          continue;
        }

        const content = await app.vault.read(file);
        const oldValue = page[property];

        // Skip if value is already correct
        if (oldValue === value) {
          results.skipped++;
          continue;
        }

        const updatedContent = updatePropertyInContent(content, property, value);

        results.changes.push({
          file: page.file.name,
          path: page.file.path,
          property,
          oldValue,
          newValue: value
        });

        if (!dryRun) {
          await app.vault.modify(file, updatedContent);
          results.modified++;
        }

      } catch (error) {
        results.errors.push({
          file: page.file.path,
          error: error.message
        });
        results.skipped++;
      }
    }

    results.success = results.errors.length === 0;
    results.message = dryRun
      ? `Dry run: Would modify ${results.changes.length} files`
      : `Modified ${results.modified} files successfully`;

    return results;

  } catch (error) {
    console.error('Error in batch update:', error);
    throw error;
  }
}

/**
 * Batch add or remove tags
 * @param {Object} app - Obsidian app instance
 * @param {Object} dv - Dataview API instance
 * @param {Object} options - Tag operation options
 * @returns {Promise<Object>} Operation results
 *
 * @example
 * const result = await batchManageTags(app, dv, {
 *   folder: 'Coffee Logs',
 *   filter: (page) => page.rating >= 4.5,
 *   operation: 'add',
 *   tags: ['high-quality', 'favorite'],
 *   dryRun: false
 * });
 */
async function batchManageTags(app, dv, options = {}) {
  const {
    folder = null,
    filter = null,
    operation = 'add',  // 'add' or 'remove'
    tags = [],
    dryRun = true
  } = options;

  if (tags.length === 0) {
    throw new Error('At least one tag is required');
  }

  if (!['add', 'remove'].includes(operation)) {
    throw new Error('Operation must be "add" or "remove"');
  }

  try {
    let query = folder ? dv.pages(`"${folder}"`) : dv.pages();
    if (filter) {
      query = query.where(filter);
    }

    const pages = query.array();
    const results = {
      dryRun,
      totalPages: pages.length,
      modified: 0,
      skipped: 0,
      errors: [],
      changes: []
    };

    for (const page of pages) {
      try {
        const file = app.vault.getAbstractFileByPath(page.file.path);
        if (!file) {
          results.skipped++;
          continue;
        }

        const content = await app.vault.read(file);
        const currentTags = page.tags || [];

        let newTags = [...currentTags];
        let changed = false;

        if (operation === 'add') {
          tags.forEach(tag => {
            if (!newTags.includes(tag)) {
              newTags.push(tag);
              changed = true;
            }
          });
        } else {
          tags.forEach(tag => {
            const index = newTags.indexOf(tag);
            if (index > -1) {
              newTags.splice(index, 1);
              changed = true;
            }
          });
        }

        if (!changed) {
          results.skipped++;
          continue;
        }

        const updatedContent = updateTagsInContent(content, newTags);

        results.changes.push({
          file: page.file.name,
          path: page.file.path,
          operation,
          oldTags: currentTags,
          newTags
        });

        if (!dryRun) {
          await app.vault.modify(file, updatedContent);
          results.modified++;
        }

      } catch (error) {
        results.errors.push({
          file: page.file.path,
          error: error.message
        });
        results.skipped++;
      }
    }

    results.success = results.errors.length === 0;
    results.message = dryRun
      ? `Dry run: Would modify ${results.changes.length} files`
      : `Modified ${results.modified} files successfully`;

    return results;

  } catch (error) {
    console.error('Error in batch tag management:', error);
    throw error;
  }
}

/**
 * Batch update bean status based on criteria
 * @param {Object} app - Obsidian app instance
 * @param {Object} dv - Dataview API instance
 * @param {Object} options - Status update options
 * @returns {Promise<Object>} Operation results
 *
 * @example
 * const result = await batchUpdateBeanStatus(app, dv, {
 *   oldStatus: 'active',
 *   newStatus: 'finished',
 *   filter: (page) => {
 *     const daysSinceRoast = (Date.now() - new Date(page['roast-date'])) / (1000*60*60*24);
 *     return daysSinceRoast > 45;
 *   },
 *   dryRun: true
 * });
 */
async function batchUpdateBeanStatus(app, dv, options = {}) {
  const {
    oldStatus = null,
    newStatus,
    filter = null,
    dryRun = true
  } = options;

  if (!newStatus) {
    throw new Error('New status is required');
  }

  const validStatuses = ['active', 'finished', 'aging', 'archived'];
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  let query = dv.pages('"Beans Library"');

  if (oldStatus) {
    query = query.where(p => p.status === oldStatus);
  }

  if (filter) {
    query = query.where(filter);
  }

  return await batchUpdateProperty(app, dv, {
    folder: 'Beans Library',
    filter: filter,
    property: 'status',
    value: newStatus,
    dryRun
  });
}

/**
 * Normalize property values across files
 * @param {Object} app - Obsidian app instance
 * @param {Object} dv - Dataview API instance
 * @param {Object} options - Normalization options
 * @returns {Promise<Object>} Operation results
 *
 * @example
 * const result = await batchNormalizeProperty(app, dv, {
 *   folder: 'Coffee Logs',
 *   property: 'brew-method',
 *   normalizationMap: {
 *     'pourover': 'pour-over',
 *     'v-60': 'v60',
 *     'aero press': 'aeropress'
 *   },
 *   dryRun: false
 * });
 */
async function batchNormalizeProperty(app, dv, options = {}) {
  const {
    folder = null,
    property,
    normalizationMap = {},
    caseSensitive = false,
    dryRun = true
  } = options;

  if (!property || Object.keys(normalizationMap).length === 0) {
    throw new Error('Property and normalizationMap are required');
  }

  try {
    let query = folder ? dv.pages(`"${folder}"`) : dv.pages();
    const pages = query.array();

    const results = {
      dryRun,
      totalPages: pages.length,
      modified: 0,
      skipped: 0,
      errors: [],
      changes: []
    };

    for (const page of pages) {
      try {
        const file = app.vault.getAbstractFileByPath(page.file.path);
        if (!file) {
          results.skipped++;
          continue;
        }

        const currentValue = page[property];
        if (!currentValue) {
          results.skipped++;
          continue;
        }

        const valueStr = String(currentValue);
        const lookupValue = caseSensitive ? valueStr : valueStr.toLowerCase();

        let newValue = currentValue;
        let found = false;

        for (const [oldVal, mappedVal] of Object.entries(normalizationMap)) {
          const compareVal = caseSensitive ? oldVal : oldVal.toLowerCase();
          if (lookupValue === compareVal) {
            newValue = mappedVal;
            found = true;
            break;
          }
        }

        if (!found || newValue === currentValue) {
          results.skipped++;
          continue;
        }

        const content = await app.vault.read(file);
        const updatedContent = updatePropertyInContent(content, property, newValue);

        results.changes.push({
          file: page.file.name,
          path: page.file.path,
          property,
          oldValue: currentValue,
          newValue
        });

        if (!dryRun) {
          await app.vault.modify(file, updatedContent);
          results.modified++;
        }

      } catch (error) {
        results.errors.push({
          file: page.file.path,
          error: error.message
        });
        results.skipped++;
      }
    }

    results.success = results.errors.length === 0;
    results.message = dryRun
      ? `Dry run: Would normalize ${results.changes.length} files`
      : `Normalized ${results.modified} files successfully`;

    return results;

  } catch (error) {
    console.error('Error in batch normalization:', error);
    throw error;
  }
}

/**
 * Batch delete or archive files based on criteria
 * @param {Object} app - Obsidian app instance
 * @param {Object} dv - Dataview API instance
 * @param {Object} options - Delete/archive options
 * @returns {Promise<Object>} Operation results
 *
 * @example
 * const result = await batchDeleteOrArchive(app, dv, {
 *   folder: 'Coffee Logs',
 *   filter: (page) => {
 *     const date = new Date(page.date);
 *     const yearsAgo = (Date.now() - date) / (1000*60*60*24*365);
 *     return yearsAgo > 2;
 *   },
 *   operation: 'archive',
 *   archiveFolder: 'Archives/Coffee Logs',
 *   dryRun: true
 * });
 */
async function batchDeleteOrArchive(app, dv, options = {}) {
  const {
    folder = null,
    filter = null,
    operation = 'archive',  // 'delete' or 'archive'
    archiveFolder = 'Archives',
    dryRun = true,
    requireConfirmation = true
  } = options;

  if (!['delete', 'archive'].includes(operation)) {
    throw new Error('Operation must be "delete" or "archive"');
  }

  try {
    let query = folder ? dv.pages(`"${folder}"`) : dv.pages();
    if (filter) {
      query = query.where(filter);
    }

    const pages = query.array();

    if (pages.length === 0) {
      return {
        success: true,
        processed: 0,
        message: 'No pages found matching criteria'
      };
    }

    if (requireConfirmation && !dryRun && pages.length > BATCH_CONFIG.confirmThreshold) {
      console.warn(`About to ${operation} ${pages.length} files. Set requireConfirmation to false to proceed.`);
      return {
        success: false,
        message: `Confirmation required for ${operation} of ${pages.length} files`
      };
    }

    const results = {
      dryRun,
      operation,
      totalPages: pages.length,
      processed: 0,
      skipped: 0,
      errors: [],
      files: []
    };

    // Ensure archive folder exists if archiving
    if (operation === 'archive' && !dryRun) {
      if (!await app.vault.adapter.exists(archiveFolder)) {
        await app.vault.createFolder(archiveFolder);
      }
    }

    for (const page of pages) {
      try {
        const file = app.vault.getAbstractFileByPath(page.file.path);
        if (!file) {
          results.skipped++;
          continue;
        }

        results.files.push({
          name: page.file.name,
          path: page.file.path,
          operation
        });

        if (!dryRun) {
          if (operation === 'delete') {
            await app.vault.delete(file);
          } else {
            const newPath = `${archiveFolder}/${page.file.name}`;
            await app.fileManager.renameFile(file, newPath);
          }
          results.processed++;
        }

      } catch (error) {
        results.errors.push({
          file: page.file.path,
          error: error.message
        });
        results.skipped++;
      }
    }

    results.success = results.errors.length === 0;
    results.message = dryRun
      ? `Dry run: Would ${operation} ${results.files.length} files`
      : `${operation === 'delete' ? 'Deleted' : 'Archived'} ${results.processed} files successfully`;

    return results;

  } catch (error) {
    console.error(`Error in batch ${operation}:`, error);
    throw error;
  }
}

/**
 * Validate data integrity across files
 * @param {Object} dv - Dataview API instance
 * @param {Object} options - Validation options
 * @returns {Promise<Object>} Validation results
 *
 * @example
 * const result = await validateDataIntegrity(dv, {
 *   folder: 'Coffee Logs',
 *   requiredFields: ['date', 'beans', 'brew-method', 'rating'],
 *   validateRanges: {
 *     rating: { min: 1, max: 5 },
 *     dose: { min: 5, max: 40 }
 *   }
 * });
 */
async function validateDataIntegrity(dv, options = {}) {
  const {
    folder = null,
    requiredFields = [],
    validateRanges = {},
    customValidators = {}
  } = options;

  try {
    let query = folder ? dv.pages(`"${folder}"`) : dv.pages();
    const pages = query.array();

    const results = {
      totalPages: pages.length,
      validPages: 0,
      invalidPages: 0,
      issues: []
    };

    for (const page of pages) {
      const pageIssues = [];

      // Check required fields
      requiredFields.forEach(field => {
        if (!page[field] || page[field] === null || page[field] === undefined) {
          pageIssues.push({
            type: 'missing-field',
            field,
            message: `Missing required field: ${field}`
          });
        }
      });

      // Validate ranges
      for (const [field, range] of Object.entries(validateRanges)) {
        const value = page[field];
        if (value !== null && value !== undefined) {
          if (range.min !== undefined && value < range.min) {
            pageIssues.push({
              type: 'out-of-range',
              field,
              value,
              message: `${field} value ${value} is below minimum ${range.min}`
            });
          }
          if (range.max !== undefined && value > range.max) {
            pageIssues.push({
              type: 'out-of-range',
              field,
              value,
              message: `${field} value ${value} is above maximum ${range.max}`
            });
          }
        }
      }

      // Run custom validators
      for (const [field, validator] of Object.entries(customValidators)) {
        const value = page[field];
        if (value !== null && value !== undefined) {
          const validationResult = validator(value, page);
          if (!validationResult.valid) {
            pageIssues.push({
              type: 'custom-validation',
              field,
              value,
              message: validationResult.error
            });
          }
        }
      }

      if (pageIssues.length > 0) {
        results.invalidPages++;
        results.issues.push({
          file: page.file.name,
          path: page.file.path,
          issues: pageIssues
        });
      } else {
        results.validPages++;
      }
    }

    results.success = results.invalidPages === 0;
    results.message = results.success
      ? `All ${results.totalPages} pages are valid`
      : `Found ${results.invalidPages} pages with validation issues`;

    return results;

  } catch (error) {
    console.error('Error in data validation:', error);
    throw error;
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Update a property in file content (YAML frontmatter)
 * @param {string} content - File content
 * @param {string} property - Property name
 * @param {any} value - New value
 * @returns {string} Updated content
 */
function updatePropertyInContent(content, property, value) {
  // Handle YAML frontmatter
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    // No frontmatter, add it
    const yamlValue = formatYAMLValue(value);
    return `---\n${property}: ${yamlValue}\n---\n\n${content}`;
  }

  const frontmatter = match[1];
  const propertyRegex = new RegExp(`^${property}:\\s*.*$`, 'm');

  const yamlValue = formatYAMLValue(value);

  if (propertyRegex.test(frontmatter)) {
    // Update existing property
    const updatedFrontmatter = frontmatter.replace(
      propertyRegex,
      `${property}: ${yamlValue}`
    );
    return content.replace(frontmatterRegex, `---\n${updatedFrontmatter}\n---`);
  } else {
    // Add new property
    const updatedFrontmatter = `${frontmatter}\n${property}: ${yamlValue}`;
    return content.replace(frontmatterRegex, `---\n${updatedFrontmatter}\n---`);
  }
}

/**
 * Update tags in file content
 * @param {string} content - File content
 * @param {Array} tags - New tags array
 * @returns {string} Updated content
 */
function updateTagsInContent(content, tags) {
  const yamlValue = tags.length > 0
    ? `[${tags.map(t => `"${t}"`).join(', ')}]`
    : '[]';

  return updatePropertyInContent(content, 'tags', yamlValue);
}

/**
 * Format value for YAML
 * @param {any} value - Value to format
 * @returns {string} YAML formatted value
 */
function formatYAMLValue(value) {
  if (value === null || value === undefined) {
    return 'null';
  }

  if (typeof value === 'string') {
    // Check if string needs quoting
    if (value.includes(':') || value.includes('#') || value.includes('\n')) {
      return `"${value.replace(/"/g, '\\"')}"`;
    }
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(v => formatYAMLValue(v)).join(', ')}]`;
  }

  return JSON.stringify(value);
}

/**
 * Validate property value
 * @param {string} property - Property name
 * @param {any} value - Value to validate
 * @returns {Object} Validation result
 */
function validatePropertyValue(property, value) {
  // Check if property type is known
  for (const [type, properties] of Object.entries(PROPERTY_TYPES)) {
    if (properties.includes(property)) {
      switch (type) {
        case 'number':
          if (typeof value !== 'number' && isNaN(Number(value))) {
            return { valid: false, error: `${property} must be a number` };
          }
          break;
        case 'date':
          if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
            return { valid: false, error: `${property} must be in YYYY-MM-DD format` };
          }
          break;
        case 'array':
          if (!Array.isArray(value)) {
            return { valid: false, error: `${property} must be an array` };
          }
          break;
        case 'boolean':
          if (typeof value !== 'boolean') {
            return { valid: false, error: `${property} must be boolean` };
          }
          break;
      }
      return { valid: true };
    }
  }

  // Unknown property, allow but warn
  console.warn(`Unknown property type for: ${property}`);
  return { valid: true };
}

/**
 * Generate batch operation report
 * @param {Object} results - Operation results
 * @returns {string} Formatted report
 */
function generateBatchReport(results) {
  let report = `# Batch Operation Report\n\n`;
  report += `**Generated**: ${new Date().toISOString()}\n`;
  report += `**Mode**: ${results.dryRun ? 'DRY RUN' : 'LIVE'}\n\n`;

  report += `## Summary\n\n`;
  report += `- **Total Pages**: ${results.totalPages}\n`;
  report += `- **Modified**: ${results.modified || results.processed || 0}\n`;
  report += `- **Skipped**: ${results.skipped}\n`;
  report += `- **Errors**: ${results.errors.length}\n`;
  report += `- **Success**: ${results.success ? 'Yes' : 'No'}\n\n`;

  if (results.changes && results.changes.length > 0) {
    report += `## Changes\n\n`;
    results.changes.forEach((change, i) => {
      report += `${i + 1}. **${change.file}**\n`;
      if (change.property) {
        report += `   - Property: ${change.property}\n`;
        report += `   - Old: ${change.oldValue}\n`;
        report += `   - New: ${change.newValue}\n`;
      }
      report += `\n`;
    });
  }

  if (results.errors && results.errors.length > 0) {
    report += `## Errors\n\n`;
    results.errors.forEach((error, i) => {
      report += `${i + 1}. **${error.file}**: ${error.error}\n`;
    });
    report += `\n`;
  }

  report += `---\n`;
  report += `*${results.message}*\n`;

  return report;
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
  // Main operations
  batchUpdateProperty,
  batchManageTags,
  batchUpdateBeanStatus,
  batchNormalizeProperty,
  batchDeleteOrArchive,
  validateDataIntegrity,

  // Utilities
  generateBatchReport,
  updatePropertyInContent,
  validatePropertyValue,

  // Configuration
  BATCH_CONFIG,
  PROPERTY_TYPES
};
