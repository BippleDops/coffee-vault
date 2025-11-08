/**
 * Sample Data Generator for Coffee Vault Testing
 * Version: 4.0.0
 *
 * Generates realistic coffee brewing data for testing dashboards,
 * visualizations, and analytics features.
 *
 * Usage:
 * const generator = require('./sample-data-generator.js');
 * const logs = generator.generateSampleLogs(100);
 * await generator.saveSampleVault('./test-vault', 100);
 */

const fs = require('fs').promises;
const path = require('path');

// ============================================
// CONFIGURATION DATA
// ============================================

const BEANS = [
  { name: 'Ethiopian Yirgacheffe', origin: 'Ethiopia', roastLevel: 'light', price: 18.50 },
  { name: 'Colombian Huila', origin: 'Colombia', roastLevel: 'medium-light', price: 15.00 },
  { name: 'Kenya AA', origin: 'Kenya', roastLevel: 'light', price: 22.00 },
  { name: 'Brazil Santos', origin: 'Brazil', roastLevel: 'medium-dark', price: 12.00 },
  { name: 'Sumatra Mandheling', origin: 'Indonesia', roastLevel: 'dark', price: 16.50 },
  { name: 'Guatemala Antigua', origin: 'Guatemala', roastLevel: 'medium', price: 17.00 },
  { name: 'Costa Rica Tarrazu', origin: 'Costa Rica', roastLevel: 'medium', price: 19.00 },
  { name: 'Panama Geisha', origin: 'Panama', roastLevel: 'light', price: 45.00 },
  { name: 'Yemen Mokha', origin: 'Yemen', roastLevel: 'medium', price: 35.00 },
  { name: 'Rwanda Bourbon', origin: 'Rwanda', roastLevel: 'medium-light', price: 16.00 }
];

const ROASTERS = [
  'Onyx Coffee Lab',
  'Counter Culture',
  'Intelligentsia',
  'Blue Bottle',
  'Stumptown',
  'Heart Roasters',
  'Tim Wendelboe',
  'The Coffee Collective',
  'James Gourmet Coffee',
  'Local Artisan Roastery'
];

const BREW_METHODS = [
  { name: 'v60', defaultDose: 15, defaultWater: 250, defaultTemp: 94, defaultTime: '2:30', defaultGrind: 'medium-fine' },
  { name: 'chemex', defaultDose: 42, defaultWater: 700, defaultTemp: 93, defaultTime: '4:00', defaultGrind: 'medium' },
  { name: 'aeropress', defaultDose: 17, defaultWater: 220, defaultTemp: 91, defaultTime: '1:45', defaultGrind: 'fine' },
  { name: 'french-press', defaultDose: 30, defaultWater: 500, defaultTemp: 92, defaultTime: '4:00', defaultGrind: 'coarse' },
  { name: 'espresso', defaultDose: 18, defaultWater: 36, defaultTemp: 93, defaultTime: '0:28', defaultGrind: 'extra-fine' },
  { name: 'cold-brew', defaultDose: 100, defaultWater: 1000, defaultTemp: 20, defaultTime: '14:00', defaultGrind: 'extra-coarse' }
];

const FLAVOR_NOTES = [
  // Fruity
  'blueberry', 'strawberry', 'cherry', 'blackberry', 'raspberry', 'lemon', 'orange', 'apple', 'peach', 'mango',
  // Floral
  'jasmine', 'rose', 'lavender', 'hibiscus', 'chamomile',
  // Sweet
  'caramel', 'honey', 'brown sugar', 'maple syrup', 'vanilla', 'chocolate', 'molasses',
  // Nutty
  'almond', 'hazelnut', 'walnut', 'peanut', 'macadamia',
  // Spicy
  'cinnamon', 'nutmeg', 'clove', 'ginger', 'black pepper',
  // Earthy
  'cocoa', 'tobacco', 'cedar', 'leather', 'mushroom'
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get random element from array
 * @private
 */
function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get random integer between min and max (inclusive)
 * @private
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get random float between min and max
 * @private
 */
function randomFloat(min, max, decimals = 1) {
  const value = Math.random() * (max - min) + min;
  return parseFloat(value.toFixed(decimals));
}

/**
 * Get date N days ago from today
 * @private
 */
function daysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

/**
 * Format date as YYYY-MM-DD
 * @private
 */
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

/**
 * Format time as HH:MM
 * @private
 */
function formatTime(date) {
  return date.toTimeString().split(' ')[0].substring(0, 5);
}

/**
 * Calculate brew ratio
 * @private
 */
function calculateRatio(dose, water) {
  return `1:${(water / dose).toFixed(1)}`;
}

/**
 * Generate realistic rating with preference bias
 * @private
 */
function generateRating(bean, method, consistencyFactor = 0.7) {
  // Base rating from bean quality and method compatibility
  let baseRating = 3.5;

  // Premium beans get higher base
  if (bean.price > 30) baseRating = 4.2;
  else if (bean.price > 20) baseRating = 3.9;

  // Light roasts better with pour-over methods
  if ((bean.roastLevel === 'light' || bean.roastLevel === 'medium-light') &&
      (method.name === 'v60' || method.name === 'chemex')) {
    baseRating += 0.3;
  }

  // Dark roasts better with espresso/french press
  if ((bean.roastLevel === 'dark' || bean.roastLevel === 'medium-dark') &&
      (method.name === 'espresso' || method.name === 'french-press')) {
    baseRating += 0.3;
  }

  // Add some randomness but keep it realistic
  const variance = (1 - consistencyFactor) * 1.5;
  const rating = baseRating + randomFloat(-variance, variance, 1);

  // Clamp to 1.0-5.0 and round to nearest 0.5
  return Math.max(1.0, Math.min(5.0, Math.round(rating * 2) / 2));
}

// ============================================
// MAIN GENERATION FUNCTIONS
// ============================================

/**
 * Generate a single sample coffee log
 * @param {Object} options - Generation options
 * @returns {Object} Coffee log object
 */
function generateSingleLog(options = {}) {
  const {
    date = daysAgo(randomInt(0, 90)),
    preferredBeans = null,
    preferredMethod = null,
    skillLevel = 0.5 // 0 = beginner, 1 = expert
  } = options;

  const bean = preferredBeans || randomChoice(BEANS);
  const method = preferredMethod || randomChoice(BREW_METHODS);
  const roaster = randomChoice(ROASTERS);

  // Add skill-based variation to parameters
  const tempVariation = (1 - skillLevel) * 3; // Beginners vary temp more
  const doseVariation = (1 - skillLevel) * 2;

  const dose = method.defaultDose + randomFloat(-doseVariation, doseVariation, 0.5);
  const water = method.defaultWater + randomFloat(-doseVariation * 10, doseVariation * 10, 0);
  const temp = method.defaultTemp + randomFloat(-tempVariation, tempVariation, 0);

  const rating = generateRating(bean, method, skillLevel);

  // Select 2-5 flavor notes
  const numNotes = randomInt(2, 5);
  const flavorNotes = [];
  for (let i = 0; i < numNotes; i++) {
    const note = randomChoice(FLAVOR_NOTES);
    if (!flavorNotes.includes(note)) {
      flavorNotes.push(note);
    }
  }

  return {
    type: 'coffee-log',
    date: formatDate(date),
    time: formatTime(date),
    beans: bean.name,
    roaster: roaster,
    origin: bean.origin,
    'roast-level': bean.roastLevel,
    'brew-method': method.name,
    'grind-size': method.defaultGrind,
    dose: parseFloat(dose.toFixed(1)),
    water: Math.round(water),
    'brew-ratio': calculateRatio(dose, water),
    'water-temperature': Math.round(temp),
    'brew-time': method.defaultTime,
    rating: rating,
    'cups-brewed': randomInt(1, 2),
    'flavor-notes': flavorNotes,
    'would-rebuy': rating >= 4.0,
    status: 'active',
    tags: ['coffee-log', formatDate(date).substring(0, 7)]
  };
}

/**
 * Generate multiple sample coffee logs
 * @param {number} count - Number of logs to generate
 * @param {Object} options - Generation options
 * @returns {Array} Array of coffee log objects
 */
function generateSampleLogs(count = 100, options = {}) {
  const {
    startDate = daysAgo(90),
    endDate = new Date(),
    skillProgression = true, // Gradually improve over time
    favoriteBean = null,
    favoriteMethod = null
  } = options;

  const logs = [];
  const daysBetween = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));

  for (let i = 0; i < count; i++) {
    const progress = i / count;
    const daysOffset = Math.floor(progress * daysBetween);
    const logDate = new Date(startDate);
    logDate.setDate(logDate.getDate() + daysOffset);

    // Skill improves over time if enabled
    const skillLevel = skillProgression ? progress * 0.7 : 0.5;

    // Occasionally use favorite bean/method
    const useFavorite = Math.random() < 0.3;

    const log = generateSingleLog({
      date: logDate,
      preferredBeans: useFavorite ? favoriteBean : null,
      preferredMethod: useFavorite ? favoriteMethod : null,
      skillLevel: skillLevel
    });

    logs.push(log);
  }

  // Sort by date
  logs.sort((a, b) => new Date(a.date) - new Date(b.date));

  return logs;
}

/**
 * Generate sample bean profiles
 * @returns {Array} Array of bean profile objects
 */
function generateBeanProfiles() {
  return BEANS.map(bean => {
    const roastDate = daysAgo(randomInt(5, 20));
    const purchaseDate = daysAgo(randomInt(0, 15));

    return {
      type: 'bean-profile',
      'bean-name': bean.name,
      roaster: randomChoice(ROASTERS),
      origin: bean.origin,
      'roast-level': bean.roastLevel,
      'roast-date': formatDate(roastDate),
      'purchase-date': formatDate(purchaseDate),
      price: bean.price.toFixed(2),
      weight: randomChoice([250, 340, 500]),
      status: 'active',
      tags: ['bean-profile', bean.origin.toLowerCase()]
    };
  });
}

/**
 * Convert log object to markdown frontmatter format
 * @private
 */
function logToMarkdown(log) {
  let md = '---\n';

  // Add properties
  for (const [key, value] of Object.entries(log)) {
    if (Array.isArray(value)) {
      md += `${key}: [${value.map(v => `"${v}"`).join(', ')}]\n`;
    } else if (typeof value === 'string') {
      md += `${key}: ${value}\n`;
    } else {
      md += `${key}: ${value}\n`;
    }
  }

  md += '---\n\n';
  md += `# ☕ Coffee Log: ${log.beans} | ${log.date}\n\n`;
  md += `**Rating**: ⭐ ${log.rating}/5.0\n`;
  md += `**Method**: ${log['brew-method'].toUpperCase()}\n`;
  md += `**Date**: ${log.date} at ${log.time}\n\n`;
  md += '---\n\n';
  md += '## 🎯 Tasting Notes\n\n';
  md += `${log['flavor-notes'].join(', ')}\n\n`;
  md += '---\n\n';
  md += '## ⚙️ Brewing Parameters\n\n';
  md += `- **Coffee Dose**: ${log.dose}g\n`;
  md += `- **Water**: ${log.water}g\n`;
  md += `- **Ratio**: ${log['brew-ratio']}\n`;
  md += `- **Grind Size**: ${log['grind-size']}\n`;
  md += `- **Water Temperature**: ${log['water-temperature']}°C\n`;
  md += `- **Brew Time**: ${log['brew-time']}\n\n`;

  return md;
}

/**
 * Save sample logs to vault structure
 * @param {string} vaultPath - Path to create vault
 * @param {number} logCount - Number of logs to generate
 */
async function saveSampleVault(vaultPath, logCount = 100) {
  try {
    // Create directories
    const logsPath = path.join(vaultPath, 'Coffee Logs');
    const beansPath = path.join(vaultPath, 'Beans Library');

    await fs.mkdir(logsPath, { recursive: true });
    await fs.mkdir(beansPath, { recursive: true });

    // Generate and save logs
    const logs = generateSampleLogs(logCount);

    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];
      const filename = `${log.date}-${log.beans.replace(/\s/g, '-')}-${i}.md`;
      const filepath = path.join(logsPath, filename);
      const markdown = logToMarkdown(log);

      await fs.writeFile(filepath, markdown, 'utf-8');
    }

    // Generate and save bean profiles
    const beans = generateBeanProfiles();

    for (const bean of beans) {
      const filename = `${bean['bean-name'].replace(/\s/g, '-')}.md`;
      const filepath = path.join(beansPath, filename);

      let md = '---\n';
      for (const [key, value] of Object.entries(bean)) {
        if (Array.isArray(value)) {
          md += `${key}: [${value.join(', ')}]\n`;
        } else {
          md += `${key}: ${value}\n`;
        }
      }
      md += '---\n\n';
      md += `# 🫘 ${bean['bean-name']}\n\n`;
      md += `**Origin**: ${bean.origin}\n`;
      md += `**Roast Level**: ${bean['roast-level']}\n`;
      md += `**Price**: $${bean.price}\n`;

      await fs.writeFile(filepath, md, 'utf-8');
    }

    console.log(`✅ Generated sample vault at ${vaultPath}`);
    console.log(`   - ${logCount} coffee logs`);
    console.log(`   - ${beans.length} bean profiles`);

    return {
      success: true,
      logsCreated: logCount,
      beansCreated: beans.length,
      path: vaultPath
    };

  } catch (error) {
    console.error('Error creating sample vault:', error);
    throw error;
  }
}

/**
 * Generate sample data as JSON (no file operations)
 * @param {number} count - Number of logs
 * @returns {Object} Sample data
 */
function generateSampleData(count = 100) {
  return {
    logs: generateSampleLogs(count),
    beans: generateBeanProfiles(),
    metadata: {
      generated: new Date().toISOString(),
      logCount: count,
      beanCount: BEANS.length,
      dateRange: {
        start: formatDate(daysAgo(90)),
        end: formatDate(new Date())
      }
    }
  };
}

// ============================================
// EXPORT
// ============================================

module.exports = {
  generateSingleLog,
  generateSampleLogs,
  generateBeanProfiles,
  generateSampleData,
  saveSampleVault,

  // Export constants for external use
  BEANS,
  ROASTERS,
  BREW_METHODS,
  FLAVOR_NOTES
};
