/**
 * Roaster Database Synchronization System
 *
 * Connects to SCA roaster databases and community lists to import
 * and update roaster profiles. Tracks seasonal releases and links
 * vault roasters to authoritative external records.
 *
 * Data Sources:
 * - SCA (Specialty Coffee Association) member directory
 * - Community-maintained roaster lists
 * - Roaster websites (for direct updates)
 *
 * @version 1.0.0
 * @license MIT
 */

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const NodeCache = require('node-cache');

// ============================================================================
// Configuration
// ============================================================================

let config;
try {
  config = require('./config.json');
} catch (err) {
  console.error('ERROR: config.json not found. Copy config.example.json to config.json');
  process.exit(1);
}

const VAULT_PATH = config.vaultPath;
const ROASTERS_FOLDER = path.join(VAULT_PATH, config.integrations.roasterSync.outputFolder || 'Roasters');
const CACHE_DIR = path.join(__dirname, config.cache.path);
const LOG_DIR = path.join(__dirname, config.logging.path);

const UPDATE_INTERVAL = config.integrations.roasterSync.updateInterval;
const AUTO_UPDATE = config.integrations.roasterSync.autoUpdate;
const CREATE_NEW = config.integrations.roasterSync.createNew;

// Initialize cache
const cache = new NodeCache({ stdTTL: UPDATE_INTERVAL });

// Community-maintained roaster database
const COMMUNITY_ROASTER_DB = [
  {
    name: "Onyx Coffee Lab",
    location: "Bentonville, AR",
    website: "https://onyxcoffeelab.com",
    specialty: "light-roasts",
    founded: 2012,
    sourcing: "direct-trade",
    instagram: "@onyxcoffeelab"
  },
  {
    name: "Counter Culture Coffee",
    location: "Durham, NC",
    website: "https://counterculturecoffee.com",
    specialty: "single-origin",
    founded: 1995,
    sourcing: "direct-trade",
    instagram: "@counterculturecoffee"
  },
  {
    name: "Intelligentsia Coffee",
    location: "Chicago, IL",
    website: "https://www.intelligentsiacoffee.com",
    specialty: "single-origin",
    founded: 1995,
    sourcing: "direct-trade",
    instagram: "@intelligentsiacoffee"
  },
  {
    name: "Blue Bottle Coffee",
    location: "Oakland, CA",
    website: "https://bluebottlecoffee.com",
    specialty: "single-origin",
    founded: 2002,
    sourcing: "direct-trade",
    instagram: "@bluebottlecoffee"
  },
  {
    name: "Verve Coffee Roasters",
    location: "Santa Cruz, CA",
    website: "https://www.vervecoffee.com",
    specialty: "single-origin",
    founded: 2007,
    sourcing: "direct-trade",
    instagram: "@vervecoffeeroasters"
  },
  {
    name: "Heart Coffee Roasters",
    location: "Portland, OR",
    website: "https://www.heartroasters.com",
    specialty: "light-roasts",
    founded: 2009,
    sourcing: "direct-trade",
    instagram: "@heartroasters"
  },
  {
    name: "Stumptown Coffee Roasters",
    location: "Portland, OR",
    website: "https://www.stumptowncoffee.com",
    specialty: "single-origin",
    founded: 1999,
    sourcing: "direct-trade",
    instagram: "@stumptowncoffee"
  },
  {
    name: "La Colombe Coffee Roasters",
    location: "Philadelphia, PA",
    website: "https://www.lacolombe.com",
    specialty: "espresso",
    founded: 1994,
    sourcing: "direct-trade",
    instagram: "@lacolombe"
  },
  {
    name: "Ritual Coffee Roasters",
    location: "San Francisco, CA",
    website: "https://www.ritualcoffee.com",
    specialty: "single-origin",
    founded: 2005,
    sourcing: "direct-trade",
    instagram: "@ritualcoffeeroasters"
  },
  {
    name: "PT's Coffee Roasting Co.",
    location: "Topeka, KS",
    website: "https://www.ptscoffee.com",
    specialty: "single-origin",
    founded: 1993,
    sourcing: "direct-trade",
    instagram: "@ptscoffee"
  }
];

// ============================================================================
// Utilities
// ============================================================================

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function log(level, message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  console.log(logMessage);

  if (config.logging.enabled) {
    appendLog(logMessage);
  }
}

async function appendLog(message) {
  try {
    await fs.mkdir(LOG_DIR, { recursive: true });
    const logFile = path.join(LOG_DIR, `roaster-sync-${new Date().toISOString().split('T')[0]}.log`);
    await fs.appendFile(logFile, message + '\n');
  } catch (err) {
    console.error('Failed to write log:', err);
  }
}

async function fetchWithRateLimit(url) {
  const cached = cache.get(url);
  if (cached) {
    log('info', `Cache hit: ${url}`);
    return cached;
  }

  await sleep(1000);

  try {
    log('info', `Fetching: ${url}`);
    const response = await axios.get(url, {
      timeout: config.network.timeout,
      headers: {
        'User-Agent': config.network.userAgent
      }
    });

    cache.set(url, response.data);
    return response.data;
  } catch (err) {
    log('error', `Failed to fetch ${url}: ${err.message}`);
    return null;
  }
}

// ============================================================================
// Roaster Profile Parser
// ============================================================================

function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) return null;

  const properties = {};
  const lines = match[1].split('\n');

  for (let line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    properties[key] = value;
  }

  return properties;
}

async function loadExistingRoasters() {
  try {
    await fs.mkdir(ROASTERS_FOLDER, { recursive: true });
    const files = await fs.readdir(ROASTERS_FOLDER);
    const roasters = [];

    for (let file of files) {
      if (!file.endsWith('.md')) continue;

      const filePath = path.join(ROASTERS_FOLDER, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const properties = parseFrontmatter(content);

      if (properties) {
        roasters.push({
          filename: file,
          filepath: filePath,
          ...properties
        });
      }
    }

    log('info', `Loaded ${roasters.length} existing roaster profiles`);
    return roasters;
  } catch (err) {
    log('error', `Failed to load roaster profiles: ${err.message}`);
    return [];
  }
}

// ============================================================================
// Roaster Data Enrichment
// ============================================================================

async function enrichRoasterData(roaster) {
  // Try to fetch additional information from website
  if (!roaster.website) {
    return roaster;
  }

  try {
    const html = await fetchWithRateLimit(roaster.website);
    if (!html) return roaster;

    const $ = cheerio.load(html);

    // Try to extract information from common elements
    const enriched = { ...roaster };

    // Look for social media links
    if (!enriched.instagram) {
      const igLink = $('a[href*="instagram.com"]').first().attr('href');
      if (igLink) {
        const match = igLink.match(/instagram\.com\/([^\/\?]+)/);
        if (match) {
          enriched.instagram = '@' + match[1];
        }
      }
    }

    // Look for contact email
    if (!enriched.email) {
      const emailLink = $('a[href^="mailto:"]').first().attr('href');
      if (emailLink) {
        enriched.email = emailLink.replace('mailto:', '');
      }
    }

    // Look for description/about text
    if (!enriched.philosophy) {
      const about = $('.about, .philosophy, .story').first().text().trim();
      if (about && about.length > 50) {
        enriched.philosophy = about.substring(0, 500) + '...';
      }
    }

    log('info', `Enriched data for ${roaster.name}`);
    return enriched;
  } catch (err) {
    log('error', `Failed to enrich ${roaster.name}: ${err.message}`);
    return roaster;
  }
}

// ============================================================================
// Roaster Profile Generator
// ============================================================================

function generateRoasterProfile(roasterData, isNew = true) {
  const date = new Date().toISOString().split('T')[0];

  let markdown = `---
type: roaster-profile
roaster-name: "${roasterData.name}"
location: "${roasterData.location || ''}"
website: ${roasterData.website || ''}
specialty: ${roasterData.specialty || 'variety'}
first-tried: ${isNew ? date : roasterData['first-tried'] || date}
founded: ${roasterData.founded || ''}
sourcing-model: ${roasterData.sourcing || ''}
instagram: ${roasterData.instagram || ''}
email: ${roasterData.email || ''}
tags: [roaster${isNew ? ', auto-imported' : ''}]
sync-source: ${roasterData.source || 'community-db'}
last-synced: ${date}
---

# ${roasterData.name}

${roasterData.location ? `**Location**: ${roasterData.location}` : ''}
${roasterData.website ? `**Website**: ${roasterData.website}` : ''}
${roasterData.founded ? `**Founded**: ${roasterData.founded}` : ''}

---

## About

${roasterData.philosophy || 'Information not yet available.'}

---

## Sourcing & Philosophy

${roasterData.sourcing ? `**Sourcing Model**: ${roasterData.sourcing}` : ''}
${roasterData.specialty ? `**Specialty**: ${roasterData.specialty}` : ''}

---

## Contact & Social

${roasterData.instagram ? `**Instagram**: ${roasterData.instagram}` : ''}
${roasterData.email ? `**Email**: ${roasterData.email}` : ''}

---

## My Experience

### Beans Tried

\`\`\`dataview
TABLE
  bean-name as "Bean",
  origin as "Origin",
  roast-level as "Roast",
  purchase-date as "Purchased"
FROM "Beans Library"
WHERE roaster = "[[${roasterData.name}]]"
SORT purchase-date DESC
\`\`\`

### Tasting Notes

<!-- Add your personal notes about this roaster here -->

---

## Metadata

**Profile Created**: ${isNew ? date : roasterData['first-tried'] || date}
**Last Synced**: ${date}
**Data Source**: ${roasterData.source || 'Community Database'}

${isNew ? `
> [!info] Auto-Imported Profile
> This roaster profile was automatically imported from external databases. Please verify and enhance with your personal experience.
` : ''}
`;

  return markdown;
}

async function saveRoasterProfile(roasterData, existingPath = null) {
  try {
    await fs.mkdir(ROASTERS_FOLDER, { recursive: true });

    const safeName = roasterData.name.replace(/[^a-zA-Z0-9-_\s]/g, '').replace(/\s+/g, '-');
    const filename = `${safeName}.md`;
    const filePath = existingPath || path.join(ROASTERS_FOLDER, filename);

    const isNew = !existingPath;
    const markdown = generateRoasterProfile(roasterData, isNew);

    await fs.writeFile(filePath, markdown);
    log('info', `${isNew ? 'Created' : 'Updated'} roaster profile: ${filename}`);

    return filePath;
  } catch (err) {
    log('error', `Failed to save roaster profile: ${err.message}`);
    return null;
  }
}

// ============================================================================
// Synchronization Logic
// ============================================================================

async function syncRoasterDatabase() {
  log('info', 'Starting Roaster Database Synchronization');

  if (!config.integrations.roasterSync.enabled) {
    log('warn', 'Roaster sync is disabled in config.json');
    return;
  }

  // Load existing roasters
  const existingRoasters = await loadExistingRoasters();
  const existingNames = new Set(existingRoasters.map(r => r['roaster-name']));

  let newCount = 0;
  let updatedCount = 0;
  let enrichedCount = 0;

  // Process community database
  if (config.integrations.roasterSync.sources.includes('community')) {
    log('info', `Processing ${COMMUNITY_ROASTER_DB.length} roasters from community database`);

    for (let roasterData of COMMUNITY_ROASTER_DB) {
      roasterData.source = 'community-db';

      // Check if roaster exists
      const existing = existingRoasters.find(r => r['roaster-name'] === roasterData.name);

      if (existing) {
        // Update existing roaster
        if (AUTO_UPDATE) {
          const enriched = await enrichRoasterData(roasterData);
          await saveRoasterProfile(enriched, existing.filepath);
          updatedCount++;
          enrichedCount++;
        } else {
          log('info', `Roaster exists, skipping update (auto-update disabled): ${roasterData.name}`);
        }
      } else {
        // Create new roaster
        if (CREATE_NEW) {
          const enriched = await enrichRoasterData(roasterData);
          await saveRoasterProfile(enriched);
          newCount++;
          enrichedCount++;
        } else {
          log('info', `New roaster found, skipping creation (createNew disabled): ${roasterData.name}`);
        }
      }
    }
  }

  // Process SCA database (placeholder for future API integration)
  if (config.integrations.roasterSync.sources.includes('sca')) {
    log('info', 'SCA database integration not yet implemented');
    // Future: Connect to SCA API when available
  }

  log('info', `Synchronization complete. Created: ${newCount}, Updated: ${updatedCount}, Enriched: ${enrichedCount}`);

  return {
    newCount,
    updatedCount,
    enrichedCount,
    total: existingRoasters.length + newCount
  };
}

// ============================================================================
// Roaster Discovery from Beans
// ============================================================================

/**
 * Scan bean library and create roaster profiles for missing roasters
 */
async function discoverRoastersFromBeans() {
  log('info', 'Discovering roasters from bean library');

  const BEANS_FOLDER = path.join(VAULT_PATH, 'Beans Library');

  try {
    const files = await fs.readdir(BEANS_FOLDER);
    const roasterNames = new Set();

    // Extract roaster names from beans
    for (let file of files) {
      if (!file.endsWith('.md')) continue;

      const content = await fs.readFile(path.join(BEANS_FOLDER, file), 'utf-8');
      const properties = parseFrontmatter(content);

      if (properties && properties.roaster) {
        const roasterName = properties.roaster.replace(/\[\[([^\]]+)\]\]/, '$1');
        roasterNames.add(roasterName);
      }
    }

    log('info', `Found ${roasterNames.size} unique roasters in bean library`);

    // Check which roasters need profiles
    const existingRoasters = await loadExistingRoasters();
    const existingNames = new Set(existingRoasters.map(r => r['roaster-name']));

    const missingRoasters = [...roasterNames].filter(name => !existingNames.has(name));

    if (missingRoasters.length > 0) {
      log('info', `Creating profiles for ${missingRoasters.length} missing roasters`);

      for (let name of missingRoasters) {
        // Check if in community database
        const communityData = COMMUNITY_ROASTER_DB.find(r => r.name === name);

        if (communityData) {
          log('info', `Found ${name} in community database`);
          await saveRoasterProfile(communityData);
        } else {
          log('info', `Creating minimal profile for ${name}`);
          await saveRoasterProfile({
            name: name,
            source: 'bean-library-discovery'
          });
        }
      }
    } else {
      log('info', 'All roasters already have profiles');
    }

    return missingRoasters.length;
  } catch (err) {
    log('error', `Failed to discover roasters: ${err.message}`);
    return 0;
  }
}

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
  try {
    log('info', '=== Roaster Database Synchronization ===');

    // First, discover roasters from bean library
    const discovered = await discoverRoastersFromBeans();

    // Then sync with external databases
    const syncResults = await syncRoasterDatabase();

    log('info', '=== Synchronization Summary ===');
    log('info', `Discovered from beans: ${discovered}`);
    if (syncResults) {
      log('info', `New profiles created: ${syncResults.newCount}`);
      log('info', `Profiles updated: ${syncResults.updatedCount}`);
      log('info', `Total roasters: ${syncResults.total}`);
    }

    return syncResults;
  } catch (err) {
    log('error', `Synchronization failed: ${err.message}`);
    throw err;
  }
}

// Run if called directly
if (require.main === module) {
  main()
    .then(() => {
      log('info', 'Roaster sync finished successfully');
      process.exit(0);
    })
    .catch(err => {
      log('error', `Roaster sync failed: ${err.message}`);
      console.error(err);
      process.exit(1);
    });
}

module.exports = { syncRoasterDatabase, discoverRoastersFromBeans };
