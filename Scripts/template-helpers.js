/**
 * Template Helper Functions for Coffee Vault
 * Version: 1.0.0
 *
 * Provides intelligent automation for Templater templates
 * - Smart suggestions based on vault history
 * - Data formatting utilities
 * - Calculation helpers
 */

/**
 * Query vault for recent active beans
 * @param {Object} app - Obsidian app instance
 * @param {number} limit - Maximum number of beans to return
 * @returns {Array} Array of active bean names
 */
async function getActiveBeans(app, limit = 10) {
  try {
    const dv = app.plugins.plugins.dataview?.api;
    if (!dv) {
      console.warn("Dataview not available for getActiveBeans");
      return [];
    }

    const beans = dv.pages('"Beans Library"')
      .where(p => p.status === "active")
      .sort(p => p["purchase-date"], 'desc')
      .limit(limit)
      .map(p => p["bean-name"]);

    return beans.values || [];
  } catch (error) {
    console.error("Error fetching active beans:", error);
    return [];
  }
}

/**
 * Get recently purchased beans for smart suggestions
 * @param {Object} app - Obsidian app instance
 * @param {number} daysBack - How many days to look back
 * @returns {Array} Array of {name, roaster, origin} objects
 */
async function getRecentBeans(app, daysBack = 30) {
  try {
    const dv = app.plugins.plugins.dataview?.api;
    if (!dv) return [];

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);
    const cutoff = cutoffDate.toISOString().split('T')[0];

    const beans = dv.pages('"Beans Library"')
      .where(p => p["purchase-date"] && p["purchase-date"] >= cutoff)
      .sort(p => p["purchase-date"], 'desc')
      .map(p => ({
        name: p["bean-name"],
        roaster: p.roaster ? p.roaster.path : null,
        origin: p.origin
      }));

    return beans.values || [];
  } catch (error) {
    console.error("Error fetching recent beans:", error);
    return [];
  }
}

/**
 * Get most frequently used brewing methods from history
 * @param {Object} app - Obsidian app instance
 * @param {number} limit - Number of top methods to return
 * @returns {Array} Array of brew method strings, sorted by frequency
 */
async function getTopBrewMethods(app, limit = 5) {
  try {
    const dv = app.plugins.plugins.dataview?.api;
    if (!dv) return ["pour-over", "espresso", "french-press"];

    const logs = dv.pages('"Coffee Logs"')
      .where(p => p["brew-method"]);

    // Count frequency of each method
    const methodCounts = {};
    for (const log of logs) {
      const method = log["brew-method"];
      methodCounts[method] = (methodCounts[method] || 0) + 1;
    }

    // Sort by frequency
    const sorted = Object.entries(methodCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(entry => entry[0]);

    return sorted.length > 0 ? sorted : ["pour-over", "espresso", "french-press"];
  } catch (error) {
    console.error("Error fetching top brew methods:", error);
    return ["pour-over", "espresso", "french-press"];
  }
}

/**
 * Get recommended grind size based on brew method and success history
 * @param {Object} app - Obsidian app instance
 * @param {string} brewMethod - The brewing method
 * @returns {string} Recommended grind size
 */
async function getRecommendedGrindSize(app, brewMethod) {
  try {
    const dv = app.plugins.plugins.dataview?.api;
    if (!dv) return getDefaultGrindSize(brewMethod);

    // Find highest rated logs with this method
    const logs = dv.pages('"Coffee Logs"')
      .where(p => p["brew-method"] === brewMethod && p.rating >= 4.0)
      .sort(p => p.rating, 'desc')
      .limit(10);

    // Count grind sizes in successful brews
    const grindCounts = {};
    for (const log of logs) {
      if (log["grind-size"]) {
        const grind = log["grind-size"];
        grindCounts[grind] = (grindCounts[grind] || 0) + 1;
      }
    }

    // Return most common successful grind size
    if (Object.keys(grindCounts).length > 0) {
      const mostCommon = Object.entries(grindCounts)
        .sort((a, b) => b[1] - a[1])[0][0];
      return mostCommon;
    }

    return getDefaultGrindSize(brewMethod);
  } catch (error) {
    console.error("Error getting recommended grind size:", error);
    return getDefaultGrindSize(brewMethod);
  }
}

/**
 * Get default grind size for a brewing method
 * @param {string} brewMethod - The brewing method
 * @returns {string} Default grind size
 */
function getDefaultGrindSize(brewMethod) {
  const defaults = {
    "espresso": "fine",
    "aeropress": "fine",
    "pour-over": "medium-fine",
    "v60": "medium-fine",
    "chemex": "medium",
    "french-press": "coarse",
    "cold-brew": "extra-coarse",
    "moka-pot": "fine",
    "siphon": "medium-fine",
    "turkish": "extra-fine"
  };

  return defaults[brewMethod] || "medium";
}

/**
 * Get recommended water temperature based on roast level and method
 * @param {string} roastLevel - Roast level (light, medium, dark, etc.)
 * @param {string} brewMethod - Brewing method
 * @returns {number} Temperature in Fahrenheit
 */
function getRecommendedWaterTemp(roastLevel, brewMethod) {
  // Espresso typically uses lower temps
  if (brewMethod === "espresso") {
    return roastLevel === "light" ? 201 :
           roastLevel === "medium" ? 198 : 195;
  }

  // Pour over and other methods
  if (roastLevel === "light" || roastLevel === "medium-light") {
    return 205;
  } else if (roastLevel === "dark" || roastLevel === "medium-dark") {
    return 195;
  } else {
    return 200;
  }
}

/**
 * Get recommended brew time based on method
 * @param {string} brewMethod - Brewing method
 * @returns {number} Time in minutes
 */
function getRecommendedBrewTime(brewMethod) {
  const defaults = {
    "espresso": 0.5,
    "aeropress": 1.5,
    "pour-over": 3.0,
    "v60": 2.5,
    "chemex": 4.0,
    "french-press": 4.0,
    "cold-brew": 720, // 12 hours
    "moka-pot": 5.0,
    "siphon": 3.0,
    "turkish": 4.0
  };

  return defaults[brewMethod] || 3.0;
}

/**
 * Get recommended coffee to water ratio
 * @param {string} brewMethod - Brewing method
 * @returns {string} Ratio in "1:X" format
 */
function getRecommendedRatio(brewMethod) {
  const defaults = {
    "espresso": "1:2",
    "aeropress": "1:15",
    "pour-over": "1:16",
    "v60": "1:16",
    "chemex": "1:15",
    "french-press": "1:15",
    "cold-brew": "1:8",
    "moka-pot": "1:10",
    "siphon": "1:16",
    "turkish": "1:12"
  };

  return defaults[brewMethod] || "1:16";
}

/**
 * Calculate cost per ounce
 * @param {number} price - Price in dollars
 * @param {number} weightGrams - Weight in grams
 * @returns {string} Cost per ounce formatted as string
 */
function costPerOunce(price, weightGrams) {
  const priceNum = parseFloat(price);
  const weightNum = parseFloat(weightGrams);

  if (isNaN(priceNum) || isNaN(weightNum) || weightNum === 0) {
    return "0.00";
  }

  return (priceNum / (weightNum / 28.35)).toFixed(2);
}

/**
 * Calculate cost per cup
 * @param {number} price - Bean price in dollars
 * @param {number} weightGrams - Total bean weight in grams
 * @param {number} doseGrams - Dose per cup in grams
 * @returns {string} Cost per cup formatted as string
 */
function costPerCup(price, weightGrams, doseGrams = 18) {
  const priceNum = parseFloat(price);
  const weightNum = parseFloat(weightGrams);
  const doseNum = parseFloat(doseGrams);

  if (isNaN(priceNum) || isNaN(weightNum) || isNaN(doseNum) || weightNum === 0) {
    return "0.00";
  }

  return ((priceNum / weightNum) * doseNum).toFixed(2);
}

/**
 * Calculate days since a date
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {number} Number of days
 */
function daysSince(dateString) {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch (error) {
    return 0;
  }
}

/**
 * Format rating as stars
 * @param {number} rating - Rating from 1-5
 * @returns {string} Star representation
 */
function formatRating(rating) {
  const num = parseFloat(rating);
  if (isNaN(num)) return "☆☆☆☆☆";

  const fullStars = Math.floor(num);
  const hasHalf = (num % 1) >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return '⭐'.repeat(fullStars) +
         (hasHalf ? '✨' : '') +
         '☆'.repeat(Math.max(0, emptyStars));
}

/**
 * Calculate estimated cups remaining based on weight and typical dose
 * @param {number} weightGrams - Current bean weight in grams
 * @param {number} doseGrams - Typical dose per cup (default 18g)
 * @returns {number} Estimated cups remaining
 */
function estimateCupsRemaining(weightGrams, doseGrams = 18) {
  const weight = parseFloat(weightGrams);
  const dose = parseFloat(doseGrams);

  if (isNaN(weight) || isNaN(dose) || dose === 0) {
    return 0;
  }

  return Math.floor(weight / dose);
}

/**
 * Get bean freshness status
 * @param {string} roastDate - Roast date in YYYY-MM-DD format
 * @returns {Object} {status: string, days: number, emoji: string}
 */
function getBeanFreshness(roastDate) {
  const days = daysSince(roastDate);

  if (days <= 7) {
    return { status: "Peak Freshness", days, emoji: "🌟" };
  } else if (days <= 14) {
    return { status: "Optimal", days, emoji: "✨" };
  } else if (days <= 21) {
    return { status: "Good", days, emoji: "☕" };
  } else if (days <= 30) {
    return { status: "Aging", days, emoji: "⏰" };
  } else {
    return { status: "Stale", days, emoji: "⚠️" };
  }
}

/**
 * Validate rating is in acceptable range
 * @param {number} rating - Rating to validate
 * @returns {number} Valid rating (clamped to 1-5)
 */
function validateRating(rating) {
  const num = parseFloat(rating);
  if (isNaN(num)) return 3.0;
  return Math.max(1, Math.min(5, num));
}

/**
 * Format display name for brew method
 * @param {string} brewMethod - Method slug (e.g., "pour-over")
 * @returns {string} Display name (e.g., "Pour Over")
 */
function formatBrewMethod(brewMethod) {
  const names = {
    "pour-over": "Pour Over",
    "french-press": "French Press",
    "espresso": "Espresso",
    "aeropress": "Aeropress",
    "cold-brew": "Cold Brew",
    "moka-pot": "Moka Pot",
    "chemex": "Chemex",
    "siphon": "Siphon",
    "v60": "V60",
    "turkish": "Turkish"
  };

  return names[brewMethod] || brewMethod.charAt(0).toUpperCase() + brewMethod.slice(1);
}

// Export all functions
module.exports = {
  getActiveBeans,
  getRecentBeans,
  getTopBrewMethods,
  getRecommendedGrindSize,
  getDefaultGrindSize,
  getRecommendedWaterTemp,
  getRecommendedBrewTime,
  getRecommendedRatio,
  costPerOunce,
  costPerCup,
  daysSince,
  formatRating,
  estimateCupsRemaining,
  getBeanFreshness,
  validateRating,
  formatBrewMethod
};
