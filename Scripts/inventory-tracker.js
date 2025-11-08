/**
 * Coffee Vault - Inventory Tracker (Standalone)
 * Track bean stock levels, freshness, and roast dates
 * @module inventory-tracker
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Validates inventory item structure
 * @private
 * @param {Object} item - Inventory item
 * @throws {Error} If item structure is invalid
 */
function validateInventoryItem(item) {
  if (!item || typeof item !== 'object') {
    throw new Error('Inventory item must be an object');
  }

  const required = ['name', 'weight', 'roastDate'];
  for (const field of required) {
    if (!item[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  if (typeof item.name !== 'string') {
    throw new Error('Item name must be a string');
  }

  if (typeof item.weight !== 'number' || item.weight < 0) {
    throw new Error('Item weight must be a positive number');
  }

  if (!(item.roastDate instanceof Date) && typeof item.roastDate !== 'string') {
    throw new Error('Roast date must be a Date object or ISO string');
  }
}

/**
 * Loads inventory from JSON file
 * @async
 * @param {string} inventoryPath - Path to inventory JSON file
 * @returns {Promise<Array>} Array of inventory items
 * @throws {Error} If file cannot be read or parsed
 *
 * @example
 * const inventory = await loadInventory('/path/to/inventory.json');
 * console.log(`Found ${inventory.length} items`);
 */
async function loadInventory(inventoryPath) {
  try {
    if (!inventoryPath || typeof inventoryPath !== 'string') {
      throw new Error('inventoryPath is required and must be a string');
    }

    const content = await fs.readFile(inventoryPath, 'utf8');
    const inventory = JSON.parse(content);

    if (!Array.isArray(inventory)) {
      throw new Error('Inventory file must contain an array');
    }

    // Convert date strings to Date objects
    return inventory.map(item => ({
      ...item,
      roastDate: new Date(item.roastDate),
      purchaseDate: item.purchaseDate ? new Date(item.purchaseDate) : null,
      openedDate: item.openedDate ? new Date(item.openedDate) : null
    }));

  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return empty inventory
      return [];
    }
    throw new Error(`Failed to load inventory: ${error.message}`);
  }
}

/**
 * Saves inventory to JSON file
 * @async
 * @param {string} inventoryPath - Path to inventory JSON file
 * @param {Array} inventory - Array of inventory items
 * @returns {Promise<void>}
 * @throws {Error} If file cannot be written
 *
 * @example
 * await saveInventory('/path/to/inventory.json', inventoryItems);
 */
async function saveInventory(inventoryPath, inventory) {
  try {
    if (!inventoryPath || typeof inventoryPath !== 'string') {
      throw new Error('inventoryPath is required and must be a string');
    }

    if (!Array.isArray(inventory)) {
      throw new Error('Inventory must be an array');
    }

    await fs.mkdir(path.dirname(inventoryPath), { recursive: true });
    await fs.writeFile(
      inventoryPath,
      JSON.stringify(inventory, null, 2),
      'utf8'
    );

  } catch (error) {
    throw new Error(`Failed to save inventory: ${error.message}`);
  }
}

/**
 * Adds new item to inventory
 * @async
 * @param {Object} options - Configuration options
 * @param {string} options.inventoryPath - Path to inventory JSON file
 * @param {string} options.name - Bean name/description
 * @param {number} options.weight - Weight in grams
 * @param {Date|string} options.roastDate - Roast date
 * @param {string} [options.origin] - Bean origin
 * @param {string} [options.roaster] - Roaster name
 * @param {string} [options.processMethod] - Processing method
 * @param {Date|string} [options.purchaseDate] - Purchase date
 * @returns {Promise<Object>} Added inventory item with ID
 * @throws {Error} If validation fails or save fails
 *
 * @example
 * const item = await addInventoryItem({
 *   inventoryPath: '/path/to/inventory.json',
 *   name: 'Ethiopia Yirgacheffe',
 *   weight: 340,
 *   roastDate: new Date('2025-10-20'),
 *   origin: 'Ethiopia',
 *   roaster: 'Local Roastery',
 *   processMethod: 'Washed'
 * });
 */
async function addInventoryItem(options) {
  try {
    if (!options || typeof options !== 'object') {
      throw new Error('Options object is required');
    }

    const {
      inventoryPath,
      name,
      weight,
      roastDate,
      origin,
      roaster,
      processMethod,
      purchaseDate
    } = options;

    // Create item object
    const item = {
      id: Date.now().toString(),
      name,
      weight,
      initialWeight: weight,
      roastDate: roastDate instanceof Date ? roastDate : new Date(roastDate),
      origin: origin || null,
      roaster: roaster || null,
      processMethod: processMethod || null,
      purchaseDate: purchaseDate ? (purchaseDate instanceof Date ? purchaseDate : new Date(purchaseDate)) : null,
      openedDate: null,
      status: 'unopened',
      notes: []
    };

    // Validate item
    validateInventoryItem(item);

    // Load existing inventory
    const inventory = await loadInventory(inventoryPath);

    // Add new item
    inventory.push(item);

    // Save updated inventory
    await saveInventory(inventoryPath, inventory);

    return item;

  } catch (error) {
    throw new Error(`Failed to add inventory item: ${error.message}`);
  }
}

/**
 * Updates inventory item weight (consumption tracking)
 * @async
 * @param {Object} options - Configuration options
 * @param {string} options.inventoryPath - Path to inventory JSON file
 * @param {string} options.itemId - Item ID to update
 * @param {number} options.weightUsed - Weight consumed in grams
 * @returns {Promise<Object>} Updated item
 * @throws {Error} If item not found or validation fails
 *
 * @example
 * const updated = await updateInventoryWeight({
 *   inventoryPath: '/path/to/inventory.json',
 *   itemId: '1729123456789',
 *   weightUsed: 18
 * });
 * console.log(`Remaining: ${updated.weight}g`);
 */
async function updateInventoryWeight(options) {
  try {
    if (!options || typeof options !== 'object') {
      throw new Error('Options object is required');
    }

    const { inventoryPath, itemId, weightUsed } = options;

    if (!itemId || typeof itemId !== 'string') {
      throw new Error('itemId is required and must be a string');
    }

    if (typeof weightUsed !== 'number' || weightUsed <= 0) {
      throw new Error('weightUsed must be a positive number');
    }

    const inventory = await loadInventory(inventoryPath);
    const item = inventory.find(i => i.id === itemId);

    if (!item) {
      throw new Error(`Item not found: ${itemId}`);
    }

    // Update weight
    item.weight -= weightUsed;

    if (item.weight < 0) {
      item.weight = 0;
    }

    // Mark as opened if first use
    if (!item.openedDate) {
      item.openedDate = new Date();
      item.status = 'opened';
    }

    // Mark as empty if depleted
    if (item.weight === 0) {
      item.status = 'empty';
      item.depletedDate = new Date();
    }

    await saveInventory(inventoryPath, inventory);

    return item;

  } catch (error) {
    throw new Error(`Failed to update inventory weight: ${error.message}`);
  }
}

/**
 * Calculates freshness metrics for inventory items
 * @async
 * @param {string} inventoryPath - Path to inventory JSON file
 * @param {Object} [options] - Options for freshness calculation
 * @param {number} [options.peakDays=14] - Days after roast for peak freshness
 * @param {number} [options.staleDays=60] - Days after roast considered stale
 * @returns {Promise<Array>} Inventory items with freshness data
 * @throws {Error} If inventory cannot be loaded
 *
 * @example
 * const items = await checkInventoryFreshness('/path/to/inventory.json', {
 *   peakDays: 14,
 *   staleDays: 60
 * });
 *
 * items.forEach(item => {
 *   console.log(`${item.name}: ${item.freshnessStatus}`);
 * });
 */
async function checkInventoryFreshness(inventoryPath, options = {}) {
  try {
    if (!inventoryPath || typeof inventoryPath !== 'string') {
      throw new Error('inventoryPath is required and must be a string');
    }

    const { peakDays = 14, staleDays = 60 } = options;

    const inventory = await loadInventory(inventoryPath);
    const now = new Date();

    return inventory.map(item => {
      const roastDate = new Date(item.roastDate);
      const daysOld = Math.floor((now - roastDate) / (1000 * 60 * 60 * 24));

      let freshnessStatus;
      let freshnessScore;

      if (daysOld <= peakDays) {
        freshnessStatus = 'peak';
        freshnessScore = 100;
      } else if (daysOld <= peakDays * 2) {
        freshnessStatus = 'good';
        freshnessScore = 80;
      } else if (daysOld <= staleDays) {
        freshnessStatus = 'acceptable';
        freshnessScore = 60;
      } else {
        freshnessStatus = 'stale';
        freshnessScore = 30;
      }

      return {
        ...item,
        daysOld,
        freshnessStatus,
        freshnessScore,
        useBySuggestion: new Date(roastDate.getTime() + staleDays * 24 * 60 * 60 * 1000)
      };
    });

  } catch (error) {
    throw new Error(`Failed to check inventory freshness: ${error.message}`);
  }
}

/**
 * Generates inventory report with stock levels and freshness
 * @async
 * @param {Object} options - Configuration options
 * @param {string} options.inventoryPath - Path to inventory JSON file
 * @param {string} [options.outputPath] - Path to save report
 * @param {boolean} [options.includeEmpty=false] - Include empty items
 * @returns {Promise<Object>} Inventory report
 *
 * @example
 * const report = await generateInventoryReport({
 *   inventoryPath: '/path/to/inventory.json',
 *   outputPath: '/path/to/reports/inventory.md',
 *   includeEmpty: false
 * });
 */
async function generateInventoryReport(options) {
  try {
    if (!options || typeof options !== 'object') {
      throw new Error('Options object is required');
    }

    const {
      inventoryPath,
      outputPath,
      includeEmpty = false
    } = options;

    // Load inventory with freshness data
    let items = await checkInventoryFreshness(inventoryPath);

    // Filter out empty items if requested
    if (!includeEmpty) {
      items = items.filter(item => item.status !== 'empty');
    }

    // Sort by freshness score and weight
    items.sort((a, b) => {
      if (a.freshnessScore !== b.freshnessScore) {
        return a.freshnessScore - b.freshnessScore;
      }
      return b.weight - a.weight;
    });

    // Calculate summary statistics
    const summary = {
      totalItems: items.length,
      totalWeight: items.reduce((sum, item) => sum + item.weight, 0),
      freshItems: items.filter(i => i.freshnessStatus === 'peak').length,
      staleItems: items.filter(i => i.freshnessStatus === 'stale').length,
      openedItems: items.filter(i => i.status === 'opened').length,
      unopenedItems: items.filter(i => i.status === 'unopened').length
    };

    // Generate markdown report
    const report = formatInventoryReport(items, summary);

    // Save if output path provided
    if (outputPath) {
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, report, 'utf8');
    }

    return {
      items,
      summary,
      report,
      generatedAt: new Date().toISOString()
    };

  } catch (error) {
    throw new Error(`Failed to generate inventory report: ${error.message}`);
  }
}

/**
 * Formats inventory data into markdown report
 * @private
 * @param {Array} items - Inventory items with freshness data
 * @param {Object} summary - Summary statistics
 * @returns {string} Formatted markdown report
 */
function formatInventoryReport(items, summary) {
  let report = `# Coffee Vault - Inventory Report\n\n`;
  report += `**Generated:** ${new Date().toISOString().split('T')[0]}\n\n`;
  report += `---\n\n`;

  // Summary
  report += `## Summary\n\n`;
  report += `- **Total Items:** ${summary.totalItems}\n`;
  report += `- **Total Weight:** ${summary.totalWeight}g\n`;
  report += `- **Fresh Items:** ${summary.freshItems}\n`;
  report += `- **Stale Items:** ${summary.staleItems}\n`;
  report += `- **Opened:** ${summary.openedItems}\n`;
  report += `- **Unopened:** ${summary.unopenedItems}\n\n`;

  // Priority items (stale beans that need to be used)
  const priorityItems = items.filter(i => i.freshnessStatus === 'stale' && i.weight > 0);
  if (priorityItems.length > 0) {
    report += `## Priority - Use Soon\n\n`;
    priorityItems.forEach(item => {
      report += `### ${item.name}\n`;
      report += `- **Weight:** ${item.weight}g / ${item.initialWeight}g\n`;
      report += `- **Roast Date:** ${item.roastDate.toISOString().split('T')[0]}\n`;
      report += `- **Days Old:** ${item.daysOld} days\n`;
      report += `- **Status:** ${item.status}\n`;
      if (item.origin) report += `- **Origin:** ${item.origin}\n`;
      if (item.roaster) report += `- **Roaster:** ${item.roaster}\n`;
      report += `\n`;
    });
  }

  // Active inventory
  report += `## Active Inventory\n\n`;
  const activeItems = items.filter(i => i.weight > 0 && i.freshnessStatus !== 'stale');

  if (activeItems.length === 0) {
    report += `*No active inventory items*\n\n`;
  } else {
    activeItems.forEach(item => {
      const percentage = ((item.weight / item.initialWeight) * 100).toFixed(0);

      report += `### ${item.name}\n`;
      report += `- **Weight:** ${item.weight}g / ${item.initialWeight}g (${percentage}%)\n`;
      report += `- **Roast Date:** ${item.roastDate.toISOString().split('T')[0]} (${item.daysOld} days old)\n`;
      report += `- **Freshness:** ${item.freshnessStatus} (${item.freshnessScore}/100)\n`;
      report += `- **Status:** ${item.status}\n`;
      if (item.origin) report += `- **Origin:** ${item.origin}\n`;
      if (item.roaster) report += `- **Roaster:** ${item.roaster}\n`;
      if (item.processMethod) report += `- **Process:** ${item.processMethod}\n`;
      if (item.openedDate) {
        report += `- **Opened:** ${item.openedDate.toISOString().split('T')[0]}\n`;
      }
      report += `\n`;
    });
  }

  return report;
}

/**
 * Gets low stock alert items
 * @async
 * @param {string} inventoryPath - Path to inventory JSON file
 * @param {number} [threshold=50] - Low stock threshold in grams
 * @returns {Promise<Array>} Items below threshold
 *
 * @example
 * const lowStock = await getLowStockItems('/path/to/inventory.json', 50);
 * lowStock.forEach(item => console.log(`Low: ${item.name} - ${item.weight}g`));
 */
async function getLowStockItems(inventoryPath, threshold = 50) {
  try {
    if (!inventoryPath || typeof inventoryPath !== 'string') {
      throw new Error('inventoryPath is required and must be a string');
    }

    if (typeof threshold !== 'number' || threshold < 0) {
      throw new Error('threshold must be a non-negative number');
    }

    const inventory = await loadInventory(inventoryPath);

    return inventory.filter(item =>
      item.weight > 0 &&
      item.weight <= threshold &&
      item.status !== 'empty'
    );

  } catch (error) {
    throw new Error(`Failed to get low stock items: ${error.message}`);
  }
}

module.exports = {
  loadInventory,
  saveInventory,
  addInventoryItem,
  updateInventoryWeight,
  checkInventoryFreshness,
  generateInventoryReport,
  getLowStockItems
};

/**
 * Usage Examples:
 *
 * const {
 *   addInventoryItem,
 *   updateInventoryWeight,
 *   generateInventoryReport,
 *   getLowStockItems
 * } = require('./inventory-tracker');
 *
 * // Add new beans to inventory
 * const item = await addInventoryItem({
 *   inventoryPath: '/Users/jonsussmanstudio/Desktop/CodingObsidian/Data/inventory.json',
 *   name: 'Ethiopia Yirgacheffe',
 *   weight: 340,
 *   roastDate: new Date('2025-10-20'),
 *   origin: 'Ethiopia',
 *   roaster: 'Local Roastery',
 *   processMethod: 'Washed'
 * });
 *
 * // Update weight after brewing
 * await updateInventoryWeight({
 *   inventoryPath: '/Users/jonsussmanstudio/Desktop/CodingObsidian/Data/inventory.json',
 *   itemId: item.id,
 *   weightUsed: 18
 * });
 *
 * // Generate inventory report
 * const report = await generateInventoryReport({
 *   inventoryPath: '/Users/jonsussmanstudio/Desktop/CodingObsidian/Data/inventory.json',
 *   outputPath: '/Users/jonsussmanstudio/Desktop/CodingObsidian/Reports/inventory.md'
 * });
 *
 * // Check low stock
 * const lowStock = await getLowStockItems(
 *   '/Users/jonsussmanstudio/Desktop/CodingObsidian/Data/inventory.json',
 *   50
 * );
 */
