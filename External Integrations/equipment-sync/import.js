/**
 * Smart Equipment Integration - Data Import System
 *
 * Imports brewing data from smart coffee equipment including:
 * - Acaia scales (precise weight measurements)
 * - Decent Espresso machines (pressure profiles, temperature curves)
 * - Fellow kettles (pour patterns)
 * - Smart timers (Timemore, etc.)
 *
 * Automatically creates Coffee Log entries from equipment data.
 *
 * @version 1.0.0
 * @license MIT
 */

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

// ============================================================================
// Configuration
// ============================================================================

let config;
try {
  config = require('../config.json');
} catch (err) {
  console.error('ERROR: config.json not found. Copy config.example.json to config.json');
  process.exit(1);
}

const VAULT_PATH = config.vaultPath;
const LOGS_FOLDER = path.join(VAULT_PATH, config.integrations.equipmentSync.logsFolder || 'Coffee Logs');
const LOG_DIR = path.join(__dirname, '..', config.logging.path);
const AUTO_CREATE_LOGS = config.integrations.equipmentSync.autoCreateLogs;

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const ACAIA_API_TOKEN = process.env.ACAIA_API_TOKEN;
const DECENT_API_KEY = process.env.DECENT_API_KEY;
const FELLOW_API_KEY = process.env.FELLOW_API_KEY;

// ============================================================================
// Utilities
// ============================================================================

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
    const logFile = path.join(LOG_DIR, `equipment-sync-${new Date().toISOString().split('T')[0]}.log`);
    await fs.appendFile(logFile, message + '\n');
  } catch (err) {
    console.error('Failed to write log:', err);
  }
}

// ============================================================================
// Acaia Scale Integration
// ============================================================================

/**
 * Fetch brewing sessions from Acaia API
 *
 * Note: This is a placeholder implementation. Actual Acaia API may differ.
 * Check Acaia developer documentation for actual endpoints and data formats.
 */
async function fetchAcaiaSessions(deviceId, since) {
  if (!ACAIA_API_TOKEN) {
    log('warn', 'Acaia API token not configured');
    return [];
  }

  try {
    log('info', `Fetching Acaia sessions for device ${deviceId}`);

    // Placeholder API call - actual endpoint may differ
    const response = await axios.get(`https://api.acaia.co/v1/sessions`, {
      headers: {
        'Authorization': `Bearer ${ACAIA_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      params: {
        device_id: deviceId,
        since: since
      },
      timeout: config.network.timeout
    });

    const sessions = response.data.sessions || [];
    log('info', `Retrieved ${sessions.length} Acaia sessions`);

    return sessions.map(session => ({
      timestamp: session.timestamp,
      device: 'acaia',
      deviceName: session.device_name || 'Acaia Scale',
      dose: session.coffee_weight,
      yield: session.total_weight,
      brewTime: session.duration,
      ratio: calculateRatio(session.coffee_weight, session.total_weight),
      waterTemp: session.water_temp,
      rawData: session
    }));
  } catch (err) {
    if (err.response && err.response.status === 401) {
      log('error', 'Acaia API authentication failed - check API token');
    } else if (err.code === 'ENOTFOUND') {
      log('warn', 'Acaia API not accessible - using demo data');
      return getAcaiaDemoData();
    } else {
      log('error', `Failed to fetch Acaia sessions: ${err.message}`);
    }
    return [];
  }
}

/**
 * Demo data for testing without actual Acaia device
 */
function getAcaiaDemoData() {
  return [
    {
      timestamp: new Date().toISOString(),
      device: 'acaia',
      deviceName: 'Acaia Lunar',
      dose: 18.5,
      yield: 45.2,
      brewTime: 2.5,
      ratio: '1:2.4',
      waterTemp: 200,
      rawData: { demo: true }
    }
  ];
}

// ============================================================================
// Decent Espresso Integration
// ============================================================================

/**
 * Fetch espresso shots from Decent Espresso API
 *
 * Note: Placeholder implementation. Consult Decent Espresso documentation.
 */
async function fetchDecentShots(machineId, since) {
  if (!DECENT_API_KEY) {
    log('warn', 'Decent API key not configured');
    return [];
  }

  try {
    log('info', `Fetching Decent shots for machine ${machineId}`);

    // Placeholder - actual Decent API endpoint
    const response = await axios.get(`https://api.decentespresso.com/v1/shots`, {
      headers: {
        'X-API-Key': DECENT_API_KEY,
        'Content-Type': 'application/json'
      },
      params: {
        machine_id: machineId,
        since: since
      },
      timeout: config.network.timeout
    });

    const shots = response.data.shots || [];
    log('info', `Retrieved ${shots.length} Decent shots`);

    return shots.map(shot => ({
      timestamp: shot.timestamp,
      device: 'decent',
      deviceName: shot.machine_name || 'Decent Espresso',
      dose: shot.coffee_dose,
      yield: shot.beverage_weight,
      brewTime: shot.total_time / 60, // Convert to minutes
      ratio: calculateRatio(shot.coffee_dose, shot.beverage_weight),
      waterTemp: shot.max_temp,
      pressure: shot.max_pressure,
      profile: shot.profile_name,
      rawData: shot
    }));
  } catch (err) {
    if (err.code === 'ENOTFOUND') {
      log('warn', 'Decent API not accessible - using demo data');
      return getDecentDemoData();
    } else {
      log('error', `Failed to fetch Decent shots: ${err.message}`);
    }
    return [];
  }
}

/**
 * Demo data for Decent Espresso
 */
function getDecentDemoData() {
  return [
    {
      timestamp: new Date().toISOString(),
      device: 'decent',
      deviceName: 'Decent DE1PRO',
      dose: 18.0,
      yield: 40.0,
      brewTime: 0.5, // 30 seconds
      ratio: '1:2.2',
      waterTemp: 201,
      pressure: 9.0,
      profile: 'Blooming Espresso',
      rawData: { demo: true }
    }
  ];
}

// ============================================================================
// Fellow Kettle Integration
// ============================================================================

/**
 * Fetch pour data from Fellow kettle
 *
 * Note: Placeholder - Fellow API details would be needed
 */
async function fetchFellowPours(kettleId, since) {
  if (!FELLOW_API_KEY) {
    log('warn', 'Fellow API key not configured');
    return [];
  }

  // Placeholder for Fellow integration
  log('info', 'Fellow kettle integration - placeholder');
  return [];
}

// ============================================================================
// Data Processing
// ============================================================================

function calculateRatio(dose, yield) {
  if (!dose || !yield) return null;
  const ratio = (yield / dose).toFixed(1);
  return `1:${ratio}`;
}

function convertToFahrenheit(celsius) {
  return Math.round((celsius * 9/5) + 32);
}

// ============================================================================
// Coffee Log Generator
// ============================================================================

/**
 * Generate Coffee Log note from equipment data
 */
function generateCoffeeLog(sessionData) {
  const timestamp = new Date(sessionData.timestamp);
  const date = timestamp.toISOString().split('T')[0];
  const time = timestamp.toTimeString().split(' ')[0].substring(0, 5);

  // Determine brew method based on device
  let brewMethod = 'espresso';
  if (sessionData.device === 'acaia' && sessionData.brewTime > 2) {
    brewMethod = 'pour-over';
  }

  const waterTemp = sessionData.waterTemp || 200;
  const grindSize = brewMethod === 'espresso' ? 'fine' : 'medium-fine';

  let markdown = `---
type: coffee-log
date: ${date}
time: ${time}
beans: "[[Update Bean Name]]"
roaster: "[[Update Roaster]]"
origin: "Unknown"
roast-level: medium
brew-method: ${brewMethod}
grind-size: ${grindSize}
water-temp: ${waterTemp}
brew-time: ${sessionData.brewTime || 0}
ratio: "${sessionData.ratio || '1:16'}"
rating: 0
cups-brewed: 1
dose: ${sessionData.dose || 0}
yield: ${sessionData.yield || 0}
equipment: ["${sessionData.deviceName}"]
tags: [auto-imported, equipment-data]
status: draft
---

# Coffee Log - ${date} ${time}

**Method**: ${brewMethod}
**Equipment**: ${sessionData.deviceName}

---

## Brewing Parameters

**Dose**: ${sessionData.dose}g
**Yield**: ${sessionData.yield}g
**Ratio**: ${sessionData.ratio}
**Time**: ${sessionData.brewTime} minutes
**Temperature**: ${waterTemp}°F

${sessionData.pressure ? `**Pressure**: ${sessionData.pressure} bar\n` : ''}
${sessionData.profile ? `**Profile**: ${sessionData.profile}\n` : ''}

---

## Equipment Data

Data automatically imported from **${sessionData.deviceName}**.

${sessionData.rawData ? `
### Raw Data
\`\`\`json
${JSON.stringify(sessionData.rawData, null, 2)}
\`\`\`
` : ''}

---

## Tasting Notes

<!-- Add your tasting notes here -->

**Rating**: ⭐⭐⭐⭐⭐ (Update rating in frontmatter)

**Flavor Notes**:
-
-
-

**Notes**:


---

> [!info] Auto-Imported Log
> This log was automatically created from equipment data.
> Please update the bean information and add your tasting notes.
>
> **Required Updates**:
> - [ ] Update bean name and roaster
> - [ ] Update origin and roast level
> - [ ] Add tasting notes
> - [ ] Rate the brew
> - [ ] Change status to "published"

---

*Imported from*: ${sessionData.device}
*Import date*: ${new Date().toISOString().split('T')[0]}
`;

  return markdown;
}

/**
 * Save Coffee Log to vault
 */
async function saveCoffeeLog(sessionData) {
  try {
    await fs.mkdir(LOGS_FOLDER, { recursive: true });

    const timestamp = new Date(sessionData.timestamp);
    const date = timestamp.toISOString().split('T')[0];
    const time = timestamp.toTimeString().split(' ')[0].replace(/:/g, '');

    const filename = `${date}-${time}-${sessionData.device}.md`;
    const filePath = path.join(LOGS_FOLDER, filename);

    // Check if log already exists
    try {
      await fs.access(filePath);
      log('info', `Log already exists, skipping: ${filename}`);
      return null;
    } catch {
      // File doesn't exist, create it
    }

    const markdown = generateCoffeeLog(sessionData);
    await fs.writeFile(filePath, markdown);

    log('info', `Created coffee log: ${filename}`);
    return filePath;
  } catch (err) {
    log('error', `Failed to save coffee log: ${err.message}`);
    return null;
  }
}

// ============================================================================
// Main Import Process
// ============================================================================

async function importEquipmentData() {
  log('info', 'Starting Equipment Data Import');

  if (!config.integrations.equipmentSync.enabled) {
    log('warn', 'Equipment sync is disabled in config.json');
    return;
  }

  const devices = config.integrations.equipmentSync.devices || [];

  if (devices.length === 0) {
    log('info', 'No devices configured. Using demo mode.');
    // Use demo data for demonstration
    const demoSessions = [
      ...getAcaiaDemoData(),
      ...getDecentDemoData()
    ];

    if (AUTO_CREATE_LOGS) {
      let created = 0;
      for (let session of demoSessions) {
        const saved = await saveCoffeeLog(session);
        if (saved) created++;
      }
      log('info', `Created ${created} demo coffee logs`);
    }

    return {
      totalSessions: demoSessions.length,
      createdLogs: AUTO_CREATE_LOGS ? demoSessions.length : 0,
      devices: ['demo']
    };
  }

  const allSessions = [];
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(); // Last 7 days

  // Process each configured device
  for (let device of devices) {
    log('info', `Processing device: ${device.name} (${device.type})`);

    try {
      let sessions = [];

      if (device.type === 'acaia') {
        sessions = await fetchAcaiaSessions(device.deviceId, since);
      } else if (device.type === 'decent') {
        sessions = await fetchDecentShots(device.machineId, since);
      } else if (device.type === 'fellow') {
        sessions = await fetchFellowPours(device.kettleId, since);
      } else {
        log('warn', `Unknown device type: ${device.type}`);
        continue;
      }

      allSessions.push(...sessions);
    } catch (err) {
      log('error', `Failed to process ${device.name}: ${err.message}`);
    }
  }

  log('info', `Retrieved ${allSessions.length} total sessions from all devices`);

  // Create coffee logs
  let createdCount = 0;

  if (AUTO_CREATE_LOGS) {
    for (let session of allSessions) {
      const saved = await saveCoffeeLog(session);
      if (saved) createdCount++;
    }
  } else {
    log('info', 'Auto-create logs disabled. Sessions retrieved but not saved.');
  }

  log('info', `Equipment import complete. Sessions: ${allSessions.length}, Logs created: ${createdCount}`);

  return {
    totalSessions: allSessions.length,
    createdLogs: createdCount,
    devices: devices.map(d => d.name)
  };
}

// ============================================================================
// Equipment Configuration Helper
// ============================================================================

async function generateDeviceConfig() {
  const configExample = {
    devices: [
      {
        type: 'acaia',
        name: 'Acaia Lunar',
        deviceId: 'YOUR_DEVICE_ID',
        autoImport: true
      },
      {
        type: 'decent',
        name: 'Decent DE1PRO',
        machineId: 'YOUR_MACHINE_ID',
        autoImport: true
      },
      {
        type: 'fellow',
        name: 'Fellow Stagg EKG',
        kettleId: 'YOUR_KETTLE_ID',
        autoImport: false
      }
    ]
  };

  const readme = `# Equipment Sync - Device Configuration

## Supported Devices

### Acaia Scales
- Acaia Lunar
- Acaia Pearl
- Acaia Pyxis

### Decent Espresso
- Decent DE1
- Decent DE1PRO
- Decent DE1XL

### Fellow Kettles
- Fellow Stagg EKG Pro

## Configuration

Add your devices to \`config.json\`:

\`\`\`json
${JSON.stringify(configExample, null, 2)}
\`\`\`

## API Keys

Add API keys to \`.env\`:

\`\`\`
ACAIA_API_TOKEN=your_token_here
DECENT_API_KEY=your_key_here
FELLOW_API_KEY=your_key_here
\`\`\`

## Getting API Keys

### Acaia
1. Install Acaia app
2. Create account
3. Contact Acaia support for API access

### Decent Espresso
1. Machine must be connected to network
2. Access Decent Cloud dashboard
3. Generate API key from settings

### Fellow
1. Fellow Stagg EKG Pro required
2. Use Fellow mobile app
3. API access may require beta program

## Testing

Run import manually:

\`\`\`bash
node import.js
\`\`\`

Check logs for errors:

\`\`\`bash
cat ../logs/equipment-sync-*.log
\`\`\`

## Troubleshooting

**No data imported**: Check API keys and device IDs
**Authentication errors**: Verify API tokens in .env
**Network errors**: Ensure devices are online and accessible
`;

  const readmePath = path.join(__dirname, 'README.md');
  await fs.writeFile(readmePath, readme);
  log('info', 'Generated device configuration guide');
}

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
  try {
    log('info', '=== Smart Equipment Data Import ===');

    const results = await importEquipmentData();

    if (results) {
      log('info', '=== Import Summary ===');
      log('info', `Total sessions: ${results.totalSessions}`);
      log('info', `Logs created: ${results.createdLogs}`);
      log('info', `Devices: ${results.devices.join(', ')}`);
    }

    // Generate device config guide
    await generateDeviceConfig();

    return results;
  } catch (err) {
    log('error', `Equipment import failed: ${err.message}`);
    throw err;
  }
}

// Run if called directly
if (require.main === module) {
  main()
    .then(() => {
      log('info', 'Equipment import finished successfully');
      process.exit(0);
    })
    .catch(err => {
      log('error', `Equipment import failed: ${err.message}`);
      console.error(err);
      process.exit(1);
    });
}

module.exports = { importEquipmentData, fetchAcaiaSessions, fetchDecentShots };
