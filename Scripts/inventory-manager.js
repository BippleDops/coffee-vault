/**
 * Bean Inventory Management System for Coffee Vault
 * Version: 1.0.0
 *
 * Automatically manages bean inventory tracking:
 * - Monitors cups brewed vs estimated capacity
 * - Auto-transitions bean status based on usage
 * - Generates low inventory warnings
 * - Suggests repurchase candidates
 * - Creates shopping lists
 */

/**
 * Configuration for inventory management
 */
const DEFAULT_CONFIG = {
  defaultDoseGrams: 18, // Default dose per cup
  lowInventoryThreshold: 5, // Cups remaining to trigger warning
  finishedThreshold: 1, // Cups remaining to auto-transition to "finished"
  agingDays: 21, // Days after roast to mark as "aging"
  staleDays: 35, // Days after roast to warn about staleness
  highRatingThreshold: 4.2, // Rating threshold for repurchase suggestions
  minSessionsForRepurchase: 3 // Minimum sessions before suggesting repurchase
};

/**
 * Calculate current bean inventory status
 * @param {Object} app - Obsidian app instance
 * @param {string} beanName - Name of the bean (optional, calculates for all if not provided)
 * @returns {Object} Inventory status
 */
async function calculateBeanInventory(app, beanName = null) {
  const dv = app.plugins.plugins.dataview?.api;

  if (!dv) {
    throw new Error("Dataview plugin is required for inventory management");
  }

  try {
    // Get bean profiles
    let beanQuery = dv.pages('"Beans Library"');

    if (beanName) {
      beanQuery = beanQuery.where(p => p["bean-name"] === beanName);
    }

    const beans = beanQuery.values || [];
    const inventory = [];

    for (const bean of beans) {
      const beanInfo = await analyzeBeanInventory(app, bean);
      inventory.push(beanInfo);
    }

    return {
      totalBeans: inventory.length,
      activeBeans: inventory.filter(b => b.status === 'active').length,
      lowInventoryBeans: inventory.filter(b => b.cupsRemaining <= DEFAULT_CONFIG.lowInventoryThreshold && b.status === 'active'),
      staleBeans: inventory.filter(b => b.daysSinceRoast > DEFAULT_CONFIG.staleDays && b.status === 'active'),
      inventory
    };

  } catch (error) {
    console.error("Error calculating bean inventory:", error);
    throw error;
  }
}

/**
 * Analyze inventory for a specific bean
 * @param {Object} app - Obsidian app instance
 * @param {Object} bean - Bean profile page object
 * @returns {Object} Detailed bean inventory analysis
 */
async function analyzeBeanInventory(app, bean) {
  const dv = app.plugins.plugins.dataview?.api;
  const beanName = bean["bean-name"];

  // Get all logs for this bean
  const logs = dv.pages('"Coffee Logs"')
    .where(p => p.beans === beanName || (p.beans && p.beans.includes && p.beans.includes(beanName)));

  const logArray = logs.values || [];

  // Calculate cups brewed
  let cupsBrewed = 0;
  let totalRating = 0;
  let sessionCount = 0;
  let lastBrewDate = null;

  logArray.forEach(log => {
    cupsBrewed += log["cups-brewed"] || 1;

    if (log.rating) {
      totalRating += parseFloat(log.rating);
      sessionCount++;
    }

    if (log.date) {
      const logDate = new Date(log.date);
      if (!lastBrewDate || logDate > lastBrewDate) {
        lastBrewDate = logDate;
      }
    }
  });

  // Calculate remaining capacity
  const initialWeight = parseFloat(bean.weight) || 340;
  const doseGrams = DEFAULT_CONFIG.defaultDoseGrams;
  const initialCups = Math.floor(initialWeight / doseGrams);
  const cupsRemaining = Math.max(0, initialCups - cupsBrewed);
  const percentageUsed = ((cupsBrewed / initialCups) * 100).toFixed(1);

  // Calculate average rating
  const avgRating = sessionCount > 0 ? (totalRating / sessionCount) : 0;

  // Days since roast
  const roastDate = bean["roast-date"] ? new Date(bean["roast-date"]) : null;
  const daysSinceRoast = roastDate ? Math.floor((new Date() - roastDate) / (1000 * 60 * 60 * 24)) : 0;

  // Determine freshness status
  let freshnessStatus = 'unknown';
  if (roastDate) {
    if (daysSinceRoast <= 14) {
      freshnessStatus = 'peak';
    } else if (daysSinceRoast <= 21) {
      freshnessStatus = 'good';
    } else if (daysSinceRoast <= 30) {
      freshnessStatus = 'aging';
    } else {
      freshnessStatus = 'stale';
    }
  }

  // Suggest new status
  let suggestedStatus = bean.status;
  if (cupsRemaining <= DEFAULT_CONFIG.finishedThreshold && bean.status === 'active') {
    suggestedStatus = 'finished';
  } else if (daysSinceRoast > DEFAULT_CONFIG.agingDays && bean.status === 'active' && freshnessStatus === 'aging') {
    suggestedStatus = 'aging';
  }

  // Repurchase recommendation
  const shouldRepurchase = avgRating >= DEFAULT_CONFIG.highRatingThreshold &&
                           sessionCount >= DEFAULT_CONFIG.minSessionsForRepurchase;

  return {
    beanName,
    file: bean.file,
    status: bean.status,
    suggestedStatus,
    statusNeedsUpdate: suggestedStatus !== bean.status,
    initialWeight,
    initialCups,
    cupsBrewed,
    cupsRemaining,
    percentageUsed: parseFloat(percentageUsed),
    sessionCount,
    avgRating: avgRating.toFixed(2),
    lastBrewDate,
    roastDate,
    daysSinceRoast,
    freshnessStatus,
    shouldRepurchase,
    lowInventoryWarning: cupsRemaining <= DEFAULT_CONFIG.lowInventoryThreshold,
    isFinished: cupsRemaining <= DEFAULT_CONFIG.finishedThreshold,
    isStale: daysSinceRoast > DEFAULT_CONFIG.staleDays,
    origin: bean.origin,
    roaster: bean.roaster,
    price: bean.price
  };
}

/**
 * Auto-update bean status based on inventory analysis
 * @param {Object} app - Obsidian app instance
 * @param {boolean} dryRun - If true, only report what would be changed
 * @returns {Object} Update results
 */
async function autoUpdateBeanStatus(app, dryRun = true) {
  try {
    const inventory = await calculateBeanInventory(app);
    const updates = [];

    for (const bean of inventory.inventory) {
      if (bean.statusNeedsUpdate) {
        if (!dryRun) {
          // Actually update the file
          const file = app.vault.getAbstractFileByPath(bean.file.path);
          if (file) {
            const content = await app.vault.read(file);

            // Replace status in frontmatter
            const updatedContent = content.replace(
              /^status:\s*\w+$/m,
              `status: ${bean.suggestedStatus}`
            );

            await app.vault.modify(file, updatedContent);

            updates.push({
              bean: bean.beanName,
              oldStatus: bean.status,
              newStatus: bean.suggestedStatus,
              reason: bean.isFinished ? 'finished' :
                      bean.isStale ? 'stale' : 'aging',
              updated: true
            });
          }
        } else {
          updates.push({
            bean: bean.beanName,
            oldStatus: bean.status,
            newStatus: bean.suggestedStatus,
            reason: bean.isFinished ? 'finished' :
                    bean.isStale ? 'stale' : 'aging',
            updated: false
          });
        }
      }
    }

    return {
      totalChecked: inventory.totalBeans,
      updatesNeeded: updates.length,
      updates,
      dryRun
    };

  } catch (error) {
    console.error("Error auto-updating bean status:", error);
    throw error;
  }
}

/**
 * Generate low inventory warnings
 * @param {Object} app - Obsidian app instance
 * @returns {Array} Array of warnings
 */
async function generateLowInventoryWarnings(app) {
  try {
    const inventory = await calculateBeanInventory(app);
    const warnings = [];

    inventory.lowInventoryBeans.forEach(bean => {
      warnings.push({
        type: 'low-inventory',
        beanName: bean.beanName,
        cupsRemaining: bean.cupsRemaining,
        avgRating: bean.avgRating,
        message: `⚠️ Low inventory: ${bean.beanName} has only ${bean.cupsRemaining} cup(s) remaining`,
        priority: bean.shouldRepurchase ? 'high' : 'medium'
      });
    });

    inventory.staleBeans.forEach(bean => {
      warnings.push({
        type: 'stale',
        beanName: bean.beanName,
        daysSinceRoast: bean.daysSinceRoast,
        cupsRemaining: bean.cupsRemaining,
        message: `⏰ Stale beans: ${bean.beanName} is ${bean.daysSinceRoast} days old`,
        priority: 'low'
      });
    });

    return warnings.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  } catch (error) {
    console.error("Error generating warnings:", error);
    throw error;
  }
}

/**
 * Generate repurchase recommendations
 * @param {Object} app - Obsidian app instance
 * @returns {Array} Array of recommended beans to repurchase
 */
async function generateRepurchaseRecommendations(app) {
  try {
    const inventory = await calculateBeanInventory(app);
    const recommendations = [];

    inventory.inventory.forEach(bean => {
      if (bean.shouldRepurchase) {
        recommendations.push({
          beanName: bean.beanName,
          avgRating: bean.avgRating,
          sessionCount: bean.sessionCount,
          cupsRemaining: bean.cupsRemaining,
          status: bean.status,
          origin: bean.origin,
          roaster: bean.roaster,
          lastPrice: bean.price,
          priority: bean.cupsRemaining <= DEFAULT_CONFIG.lowInventoryThreshold ? 'urgent' :
                   bean.cupsRemaining <= 10 ? 'high' : 'normal',
          message: `⭐ Repurchase: ${bean.beanName} (${bean.avgRating}/5 avg, ${bean.sessionCount} sessions)`
        });
      }
    });

    return recommendations.sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, normal: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return parseFloat(b.avgRating) - parseFloat(a.avgRating);
    });

  } catch (error) {
    console.error("Error generating repurchase recommendations:", error);
    throw error;
  }
}

/**
 * Generate shopping list based on inventory and recommendations
 * @param {Object} app - Obsidian app instance
 * @param {Object} options - Options for shopping list generation
 * @returns {Object} Shopping list with formatted text
 */
async function generateShoppingList(app, options = {}) {
  const {
    includeRepurchases = true,
    includeLowInventory = true,
    maxItems = 10
  } = options;

  try {
    const recommendations = includeRepurchases ? await generateRepurchaseRecommendations(app) : [];
    const warnings = includeLowInventory ? await generateLowInventoryWarnings(app) : [];

    const shoppingList = {
      date: new Date().toISOString().split('T')[0],
      items: [],
      formattedList: []
    };

    // Add repurchase recommendations
    recommendations.slice(0, maxItems).forEach(rec => {
      shoppingList.items.push({
        bean: rec.beanName,
        roaster: rec.roaster,
        origin: rec.origin,
        priority: rec.priority,
        reason: `Highly rated (${rec.avgRating}/5)`,
        estimatedPrice: rec.lastPrice
      });
    });

    // Format as markdown
    const lines = [];
    lines.push('# 🛒 Coffee Shopping List');
    lines.push('');
    lines.push(`*Generated: ${shoppingList.date}*`);
    lines.push('');

    if (shoppingList.items.length === 0) {
      lines.push('No items to purchase at this time.');
    } else {
      lines.push('## Recommended Purchases');
      lines.push('');

      shoppingList.items.forEach((item, index) => {
        const priorityEmoji = item.priority === 'urgent' ? '🔴' :
                             item.priority === 'high' ? '🟡' : '🟢';
        lines.push(`${index + 1}. ${priorityEmoji} **${item.bean}**`);
        lines.push(`   - Roaster: ${item.roaster || 'Unknown'}`);
        lines.push(`   - Origin: ${item.origin || 'Unknown'}`);
        lines.push(`   - Reason: ${item.reason}`);
        if (item.estimatedPrice) {
          lines.push(`   - Last paid: $${item.estimatedPrice}`);
        }
        lines.push('');
      });
    }

    // Add warnings section
    if (warnings.length > 0) {
      lines.push('## Inventory Warnings');
      lines.push('');
      warnings.forEach(warning => {
        lines.push(`- ${warning.message}`);
      });
      lines.push('');
    }

    lines.push('---');
    lines.push('');
    lines.push('*Generated automatically by Bean Inventory Manager*');

    shoppingList.formattedList = lines.join('\n');

    return shoppingList;

  } catch (error) {
    console.error("Error generating shopping list:", error);
    throw error;
  }
}

/**
 * Get inventory dashboard summary
 * @param {Object} app - Obsidian app instance
 * @returns {string} Formatted dashboard text
 */
async function getInventoryDashboard(app) {
  try {
    const inventory = await calculateBeanInventory(app);
    const warnings = await generateLowInventoryWarnings(app);
    const recommendations = await generateRepurchaseRecommendations(app);

    const lines = [];
    lines.push('# 📊 Bean Inventory Dashboard');
    lines.push('');
    lines.push(`**Last Updated**: ${new Date().toISOString().split('T')[0]}`);
    lines.push('');

    // Overview
    lines.push('## Overview');
    lines.push('');
    lines.push(`- **Total Beans**: ${inventory.totalBeans}`);
    lines.push(`- **Active Beans**: ${inventory.activeBeans}`);
    lines.push(`- **Low Inventory Alerts**: ${inventory.lowInventoryBeans.length}`);
    lines.push(`- **Aging/Stale Beans**: ${inventory.staleBeans.length}`);
    lines.push(`- **Repurchase Recommendations**: ${recommendations.length}`);
    lines.push('');

    // Active beans detail
    if (inventory.activeBeans > 0) {
      lines.push('## Active Beans Status');
      lines.push('');
      lines.push('| Bean | Cups Remaining | Usage | Avg Rating | Freshness |');
      lines.push('|------|----------------|-------|------------|-----------|');

      inventory.inventory
        .filter(b => b.status === 'active')
        .sort((a, b) => a.cupsRemaining - b.cupsRemaining)
        .forEach(bean => {
          const freshnessEmoji = bean.freshnessStatus === 'peak' ? '🌟' :
                                bean.freshnessStatus === 'good' ? '✅' :
                                bean.freshnessStatus === 'aging' ? '⏰' : '⚠️';
          lines.push(`| ${bean.beanName} | ${bean.cupsRemaining} | ${bean.percentageUsed}% | ${bean.avgRating}/5 | ${freshnessEmoji} ${bean.freshnessStatus} |`);
        });
      lines.push('');
    }

    // Warnings
    if (warnings.length > 0) {
      lines.push('## ⚠️ Alerts');
      lines.push('');
      warnings.slice(0, 5).forEach(warning => {
        lines.push(`- ${warning.message}`);
      });
      lines.push('');
    }

    // Recommendations
    if (recommendations.length > 0) {
      lines.push('## ⭐ Repurchase Recommendations');
      lines.push('');
      recommendations.slice(0, 5).forEach(rec => {
        lines.push(`- ${rec.message}`);
      });
      lines.push('');
    }

    lines.push('---');
    lines.push('');
    lines.push('*Generated automatically by Bean Inventory Manager*');

    return lines.join('\n');

  } catch (error) {
    console.error("Error generating inventory dashboard:", error);
    throw error;
  }
}

// Export functions
module.exports = {
  calculateBeanInventory,
  analyzeBeanInventory,
  autoUpdateBeanStatus,
  generateLowInventoryWarnings,
  generateRepurchaseRecommendations,
  generateShoppingList,
  getInventoryDashboard,
  DEFAULT_CONFIG
};
