/**
 * Data Validation Framework for Coffee Vault
 * Version: 1.0.0
 *
 * Validates vault data integrity:
 * - Checks required properties exist
 * - Verifies value ranges and types
 * - Validates date consistency
 * - Detects duplicates
 * - Checks reference integrity
 * - Generates data quality dashboard
 */

/**
 * Property schema definitions (from Property Schema.md)
 */
const PROPERTY_SCHEMAS = {
  'coffee-log': {
    required: ['date', 'time', 'type', 'beans', 'roaster', 'origin', 'roast-level',
               'brew-method', 'grind-size', 'water-temp', 'brew-time', 'ratio', 'rating', 'cups-brewed'],
    types: {
      'date': 'date',
      'time': 'text',
      'type': 'text',
      'beans': 'text',
      'roaster': 'link',
      'origin': 'text',
      'roast-level': 'text',
      'brew-method': 'text',
      'grind-size': 'text',
      'water-temp': 'number',
      'brew-time': 'number',
      'ratio': 'text',
      'rating': 'number',
      'cups-brewed': 'number',
      'flavor-notes': 'list',
      'would-rebuy': 'boolean',
      'tags': 'list'
    },
    ranges: {
      'rating': { min: 1, max: 5 },
      'water-temp': { min: 32, max: 212 },
      'brew-time': { min: 0.1, max: 1440 },
      'cups-brewed': { min: 1, max: 20 }
    },
    enums: {
      'roast-level': ['light', 'medium-light', 'medium', 'medium-dark', 'dark'],
      'brew-method': ['pour-over', 'french-press', 'espresso', 'aeropress', 'cold-brew',
                      'moka-pot', 'chemex', 'siphon', 'v60', 'turkish'],
      'grind-size': ['extra-fine', 'fine', 'medium-fine', 'medium', 'medium-coarse',
                     'coarse', 'extra-coarse']
    }
  },
  'bean-profile': {
    required: ['type', 'bean-name', 'roaster', 'origin', 'roast-level', 'roast-date',
               'purchase-date', 'price', 'weight', 'status'],
    types: {
      'type': 'text',
      'bean-name': 'text',
      'roaster': 'link',
      'origin': 'text',
      'roast-level': 'text',
      'roast-date': 'date',
      'purchase-date': 'date',
      'price': 'number',
      'weight': 'number',
      'status': 'text'
    },
    ranges: {
      'price': { min: 0, max: 500 },
      'weight': { min: 1, max: 10000 }
    },
    enums: {
      'status': ['active', 'finished', 'aging', 'archived'],
      'roast-level': ['light', 'medium-light', 'medium', 'medium-dark', 'dark']
    }
  },
  'roaster-profile': {
    required: ['type', 'roaster-name', 'location', 'first-tried'],
    types: {
      'type': 'text',
      'roaster-name': 'text',
      'location': 'text',
      'first-tried': 'date',
      'website': 'text',
      'tags': 'list'
    }
  }
};

/**
 * Validation result structure
 */
class ValidationResult {
  constructor(file, noteType) {
    this.file = file;
    this.noteType = noteType;
    this.errors = [];
    this.warnings = [];
    this.isValid = true;
  }

  addError(property, message, value = null) {
    this.errors.push({ property, message, value });
    this.isValid = false;
  }

  addWarning(property, message, value = null) {
    this.warnings.push({ property, message, value });
  }

  get errorCount() {
    return this.errors.length;
  }

  get warningCount() {
    return this.warnings.length;
  }
}

/**
 * Validate a single note
 * @param {Object} app - Obsidian app instance
 * @param {Object} file - File to validate
 * @returns {ValidationResult} Validation result
 */
async function validateNote(app, file) {
  try {
    const content = await app.vault.read(file);
    const frontmatter = extractFrontmatter(content);

    if (!frontmatter) {
      const result = new ValidationResult(file.path, 'unknown');
      result.addError('frontmatter', 'No frontmatter found in note');
      return result;
    }

    const noteType = frontmatter.type || 'unknown';
    const result = new ValidationResult(file.path, noteType);

    const schema = PROPERTY_SCHEMAS[noteType];

    if (!schema) {
      result.addWarning('type', `Unknown note type: ${noteType}`);
      return result;
    }

    // Check required properties
    validateRequiredProperties(frontmatter, schema, result);

    // Check property types
    validatePropertyTypes(frontmatter, schema, result);

    // Check value ranges
    validateValueRanges(frontmatter, schema, result);

    // Check enum values
    validateEnumValues(frontmatter, schema, result);

    // Special validations
    performSpecialValidations(frontmatter, noteType, result);

    return result;

  } catch (error) {
    const result = new ValidationResult(file.path, 'unknown');
    result.addError('system', `Error validating note: ${error.message}`);
    return result;
  }
}

/**
 * Extract frontmatter from note content
 * @param {string} content - Note content
 * @returns {Object|null} Frontmatter object
 */
function extractFrontmatter(content) {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return null;

  const frontmatter = {};
  const lines = fmMatch[1].split('\n');

  lines.forEach(line => {
    const match = line.match(/^(\S+?):\s*(.*)$/);
    if (match) {
      const [, key, value] = match;
      frontmatter[key] = parseValue(value);
    }
  });

  return frontmatter;
}

/**
 * Parse YAML value
 * @param {string} value - Raw value string
 * @returns {any} Parsed value
 */
function parseValue(value) {
  value = value.trim();

  // Boolean
  if (value === 'true') return true;
  if (value === 'false') return false;

  // Number
  if (!isNaN(value) && value !== '') return parseFloat(value);

  // List (simple bracket notation)
  if (value.startsWith('[') && value.endsWith(']')) {
    return value.slice(1, -1).split(',').map(v => v.trim());
  }

  // Link
  if (value.startsWith('[[') && value.endsWith(']]')) {
    return value;
  }

  // Text
  return value;
}

/**
 * Validate required properties exist
 */
function validateRequiredProperties(frontmatter, schema, result) {
  schema.required.forEach(prop => {
    if (!(prop in frontmatter) || frontmatter[prop] === '' || frontmatter[prop] === null) {
      result.addError(prop, 'Required property is missing or empty');
    }
  });
}

/**
 * Validate property types
 */
function validatePropertyTypes(frontmatter, schema, result) {
  Object.keys(frontmatter).forEach(prop => {
    if (!schema.types[prop]) return; // Skip unknown properties

    const expectedType = schema.types[prop];
    const value = frontmatter[prop];

    switch (expectedType) {
      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          result.addError(prop, `Expected number, got ${typeof value}`, value);
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          result.addError(prop, `Expected boolean, got ${typeof value}`, value);
        }
        break;

      case 'list':
        if (!Array.isArray(value)) {
          result.addError(prop, `Expected array/list, got ${typeof value}`, value);
        }
        break;

      case 'date':
        if (typeof value !== 'string' || !value.match(/^\d{4}-\d{2}-\d{2}$/)) {
          result.addError(prop, 'Expected date in YYYY-MM-DD format', value);
        }
        break;

      case 'link':
        if (typeof value !== 'string' || (!value.startsWith('[[') && !value.endsWith(']]'))) {
          result.addWarning(prop, 'Expected internal link in [[brackets]]', value);
        }
        break;
    }
  });
}

/**
 * Validate value ranges
 */
function validateValueRanges(frontmatter, schema, result) {
  if (!schema.ranges) return;

  Object.keys(schema.ranges).forEach(prop => {
    if (!(prop in frontmatter)) return;

    const value = frontmatter[prop];
    const range = schema.ranges[prop];

    if (typeof value !== 'number') return;

    if (value < range.min || value > range.max) {
      result.addError(prop, `Value ${value} outside valid range ${range.min}-${range.max}`, value);
    }
  });
}

/**
 * Validate enum values
 */
function validateEnumValues(frontmatter, schema, result) {
  if (!schema.enums) return;

  Object.keys(schema.enums).forEach(prop => {
    if (!(prop in frontmatter)) return;

    const value = frontmatter[prop];
    const allowedValues = schema.enums[prop];

    if (!allowedValues.includes(value)) {
      result.addError(
        prop,
        `Invalid value "${value}". Allowed: ${allowedValues.join(', ')}`,
        value
      );
    }
  });
}

/**
 * Perform special validations
 */
function performSpecialValidations(frontmatter, noteType, result) {
  // Date consistency checks
  if (noteType === 'bean-profile') {
    if (frontmatter['roast-date'] && frontmatter['purchase-date']) {
      const roastDate = new Date(frontmatter['roast-date']);
      const purchaseDate = new Date(frontmatter['purchase-date']);

      if (purchaseDate < roastDate) {
        result.addError('purchase-date', 'Purchase date cannot be before roast date');
      }

      const daysDiff = (purchaseDate - roastDate) / (1000 * 60 * 60 * 24);
      if (daysDiff > 60) {
        result.addWarning('purchase-date', `Purchase was ${Math.floor(daysDiff)} days after roast (unusually long)`);
      }
    }
  }

  // Ratio format check
  if (frontmatter.ratio && typeof frontmatter.ratio === 'string') {
    if (!frontmatter.ratio.match(/^1:\d+$/)) {
      result.addWarning('ratio', 'Ratio should be in format "1:X" (e.g., "1:16")', frontmatter.ratio);
    }
  }

  // Time format check
  if (frontmatter.time && typeof frontmatter.time === 'string') {
    if (!frontmatter.time.match(/^\d{2}:\d{2}$/)) {
      result.addWarning('time', 'Time should be in format "HH:mm"', frontmatter.time);
    }
  }
}

/**
 * Validate entire vault or folder
 * @param {Object} app - Obsidian app instance
 * @param {string} folder - Folder to validate (null for entire vault)
 * @returns {Object} Validation summary
 */
async function validateVault(app, folder = null) {
  const allFiles = app.vault.getMarkdownFiles();
  let filesToValidate = allFiles;

  if (folder) {
    filesToValidate = filesToValidate.filter(f => f.path.startsWith(folder));
  }

  // Exclude certain folders
  filesToValidate = filesToValidate.filter(f =>
    !f.path.includes('.obsidian') &&
    !f.path.includes('Templates') &&
    !f.path.includes('Attachments')
  );

  const results = {
    totalNotes: filesToValidate.length,
    validNotes: 0,
    invalidNotes: 0,
    totalErrors: 0,
    totalWarnings: 0,
    noteResults: [],
    errorsByType: {},
    warningsByType: {}
  };

  for (const file of filesToValidate) {
    const result = await validateNote(app, file);

    if (result.isValid && result.warningCount === 0) {
      results.validNotes++;
    } else {
      results.invalidNotes++;
    }

    results.totalErrors += result.errorCount;
    results.totalWarnings += result.warningCount;

    // Count errors by type
    result.errors.forEach(err => {
      const key = err.property;
      results.errorsByType[key] = (results.errorsByType[key] || 0) + 1;
    });

    result.warnings.forEach(warn => {
      const key = warn.property;
      results.warningsByType[key] = (results.warningsByType[key] || 0) + 1;
    });

    if (!result.isValid || result.warningCount > 0) {
      results.noteResults.push(result);
    }
  }

  // Sort notes by error count
  results.noteResults.sort((a, b) => b.errorCount - a.errorCount);

  return results;
}

/**
 * Check for duplicate notes
 * @param {Object} app - Obsidian app instance
 * @returns {Array} Array of duplicate groups
 */
async function checkForDuplicates(app) {
  const dv = app.plugins.plugins.dataview?.api;
  if (!dv) {
    throw new Error("Dataview required for duplicate detection");
  }

  const duplicates = [];

  // Check for duplicate bean names
  const beans = dv.pages('"Beans Library"');
  const beanNames = {};

  beans.forEach(bean => {
    const name = bean['bean-name'];
    if (name) {
      if (!beanNames[name]) {
        beanNames[name] = [];
      }
      beanNames[name].push(bean.file.path);
    }
  });

  Object.entries(beanNames).forEach(([name, files]) => {
    if (files.length > 1) {
      duplicates.push({
        type: 'bean-name',
        value: name,
        files: files,
        count: files.length
      });
    }
  });

  // Check for duplicate coffee logs (same date/time/beans)
  const logs = dv.pages('"Coffee Logs"');
  const logKeys = {};

  logs.forEach(log => {
    const key = `${log.date}_${log.time}_${log.beans}`;
    if (!logKeys[key]) {
      logKeys[key] = [];
    }
    logKeys[key].push(log.file.path);
  });

  Object.entries(logKeys).forEach(([key, files]) => {
    if (files.length > 1) {
      duplicates.push({
        type: 'coffee-log',
        value: key,
        files: files,
        count: files.length
      });
    }
  });

  return duplicates;
}

/**
 * Check reference integrity (broken links)
 * @param {Object} app - Obsidian app instance
 * @returns {Array} Array of broken references
 */
async function checkReferenceIntegrity(app) {
  const brokenLinks = [];
  const allFiles = app.vault.getMarkdownFiles();

  for (const file of allFiles) {
    const content = await app.vault.read(file);
    const frontmatter = extractFrontmatter(content);

    if (!frontmatter) continue;

    // Check link properties
    ['roaster', 'beans'].forEach(prop => {
      if (frontmatter[prop] && typeof frontmatter[prop] === 'string') {
        const link = frontmatter[prop];
        if (link.startsWith('[[') && link.endsWith(']]')) {
          const targetName = link.slice(2, -2);
          const targetFile = app.metadataCache.getFirstLinkpathDest(targetName, file.path);

          if (!targetFile) {
            brokenLinks.push({
              sourceFile: file.path,
              property: prop,
              targetLink: targetName,
              type: 'missing-target'
            });
          }
        }
      }
    });
  }

  return brokenLinks;
}

/**
 * Generate data quality dashboard
 * @param {Object} validationResults - Results from validateVault
 * @param {Array} duplicates - Results from checkForDuplicates
 * @param {Array} brokenLinks - Results from checkReferenceIntegrity
 * @returns {string} Formatted dashboard
 */
function generateDataQualityDashboard(validationResults, duplicates, brokenLinks) {
  const lines = [];

  lines.push('# 📊 Data Quality Dashboard');
  lines.push('');
  lines.push(`**Generated**: ${new Date().toISOString().split('T')[0]}`);
  lines.push('');

  // Overall health score
  const totalIssues = validationResults.totalErrors + duplicates.length + brokenLinks.length;
  const healthScore = Math.max(0, 100 - (totalIssues * 2));
  const healthEmoji = healthScore >= 90 ? '🟢' : healthScore >= 70 ? '🟡' : '🔴';

  lines.push('## Overall Health');
  lines.push('');
  lines.push(`${healthEmoji} **Health Score**: ${healthScore}/100`);
  lines.push('');

  // Summary stats
  lines.push('## Summary Statistics');
  lines.push('');
  lines.push(`- **Total Notes Validated**: ${validationResults.totalNotes}`);
  lines.push(`- **Valid Notes**: ${validationResults.validNotes} (${((validationResults.validNotes / validationResults.totalNotes) * 100).toFixed(1)}%)`);
  lines.push(`- **Notes with Errors**: ${validationResults.invalidNotes}`);
  lines.push(`- **Total Errors**: ${validationResults.totalErrors}`);
  lines.push(`- **Total Warnings**: ${validationResults.totalWarnings}`);
  lines.push(`- **Duplicate Entries**: ${duplicates.length}`);
  lines.push(`- **Broken Links**: ${brokenLinks.length}`);
  lines.push('');

  // Top errors
  if (Object.keys(validationResults.errorsByType).length > 0) {
    lines.push('## Most Common Errors');
    lines.push('');

    const sortedErrors = Object.entries(validationResults.errorsByType)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    sortedErrors.forEach(([prop, count]) => {
      lines.push(`- **${prop}**: ${count} occurrence(s)`);
    });
    lines.push('');
  }

  // Notes needing attention
  if (validationResults.noteResults.length > 0) {
    lines.push('## Notes Needing Attention');
    lines.push('');

    validationResults.noteResults.slice(0, 10).forEach(result => {
      lines.push(`### ${result.file}`);
      lines.push('');
      lines.push(`**Type**: ${result.noteType}`);
      lines.push(`**Errors**: ${result.errorCount} | **Warnings**: ${result.warningCount}`);
      lines.push('');

      if (result.errors.length > 0) {
        lines.push('**Errors**:');
        result.errors.forEach(err => {
          lines.push(`- ${err.property}: ${err.message}`);
        });
        lines.push('');
      }
    });
  }

  // Duplicates
  if (duplicates.length > 0) {
    lines.push('## Duplicate Entries');
    lines.push('');

    duplicates.forEach(dup => {
      lines.push(`- **${dup.type}**: "${dup.value}" appears in ${dup.count} files`);
      dup.files.forEach(file => {
        lines.push(`  - ${file}`);
      });
    });
    lines.push('');
  }

  // Broken links
  if (brokenLinks.length > 0) {
    lines.push('## Broken Links');
    lines.push('');

    brokenLinks.slice(0, 20).forEach(link => {
      lines.push(`- **${link.sourceFile}**: ${link.property} → [[${link.targetLink}]] (missing)`);
    });
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('## Recommendations');
  lines.push('');

  if (validationResults.totalErrors > 0) {
    lines.push('1. Fix validation errors in notes listed above');
  }
  if (duplicates.length > 0) {
    lines.push('2. Review and merge or remove duplicate entries');
  }
  if (brokenLinks.length > 0) {
    lines.push('3. Repair broken links or remove invalid references');
  }
  if (totalIssues === 0) {
    lines.push('✅ Your vault data quality is excellent! No issues detected.');
  }

  lines.push('');
  lines.push('*Generated automatically by Data Validation Framework*');

  return lines.join('\n');
}

// Export functions
module.exports = {
  validateNote,
  validateVault,
  checkForDuplicates,
  checkReferenceIntegrity,
  generateDataQualityDashboard,
  ValidationResult,
  PROPERTY_SCHEMAS
};
