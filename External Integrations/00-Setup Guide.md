# External Integrations - Setup Guide

**Version**: 1.0.0
**Last Updated**: 2025-10-25
**Purpose**: Complete setup instructions for all Coffee Vault external integrations

---

## Overview

The External Integrations system connects your Coffee Vault to external coffee ecosystem services, providing automated data enrichment, professional reviews, equipment synchronization, and social sharing capabilities.

### Integration Components

1. **Coffee Review Aggregation** - Import professional reviews from Coffee Review, Perfect Daily Grind
2. **Roaster Database Sync** - Connect to SCA roaster databases and community lists
3. **Event Calendar** - Track SCA events, competitions, conferences
4. **Social Sharing** - Publish curated notes with privacy controls
5. **Smart Equipment** - Import data from Acaia scales, Decent espresso machines, Fellow kettles

---

## Prerequisites

### Required Software

- **Node.js** (v18 or higher): For JavaScript integrations
- **Python** (v3.9 or higher): For data processing scripts
- **npm**: Node package manager (included with Node.js)

### Required Obsidian Plugins

- **Dataview**: For querying vault data
- **Templater**: For dynamic template processing
- **Periodic Notes**: For event calendar integration

### Optional Tools

- **Git**: For version control of static site
- **VS Code**: For editing integration scripts

---

## Installation Steps

### 1. Install Node.js Dependencies

Navigate to the External Integrations folder and install required packages:

```bash
cd "/path/to/vault/External Integrations"
npm init -y
npm install axios cheerio node-cache puppeteer ical.js gray-matter markdown-it
npm install --save-dev dotenv
```

### 2. Install Python Dependencies

Install Python packages for data processing:

```bash
pip3 install requests beautifulsoup4 lxml python-dateutil icalendar
```

### 3. Create Configuration File

Copy the configuration template:

```bash
cp config.example.json config.json
```

Edit `config.json` with your settings:

```json
{
  "vaultPath": "/absolute/path/to/vault",
  "integrations": {
    "reviewAggregator": {
      "enabled": true,
      "sources": ["coffeereview", "perfectdailygrind"],
      "cacheDuration": 604800,
      "rateLimit": 1000
    },
    "roasterSync": {
      "enabled": true,
      "sources": ["sca", "community"],
      "updateInterval": 86400
    },
    "eventCalendar": {
      "enabled": true,
      "subscriptions": [],
      "lookAheadDays": 365
    },
    "socialSharing": {
      "enabled": false,
      "outputPath": "./public",
      "domain": "mycoffee.example.com"
    },
    "equipmentSync": {
      "enabled": false,
      "devices": []
    }
  },
  "privacy": {
    "stripPersonalData": true,
    "excludeProperties": ["email", "phone", "address"]
  },
  "cache": {
    "enabled": true,
    "path": "./.cache"
  }
}
```

### 4. Create Environment Variables

Create `.env` file for sensitive credentials:

```bash
# External Integrations Environment Variables
# DO NOT commit this file to version control

# Review Aggregation (if API keys become available)
COFFEE_REVIEW_API_KEY=
PERFECT_DAILY_GRIND_API_KEY=

# Social Sharing
NETLIFY_DEPLOY_KEY=
GITHUB_TOKEN=

# Equipment Integration
ACAIA_API_TOKEN=
DECENT_API_KEY=
FELLOW_API_KEY=

# General
USER_AGENT="CoffeeVault/1.0 (Personal Coffee Tracking)"
```

**IMPORTANT**: Add `.env` to your `.gitignore` to prevent committing secrets!

---

## Privacy and Ethics

### Web Scraping Guidelines

All web scraping integrations follow these principles:

1. **robots.txt Compliance**: Always check and respect robots.txt
2. **Rate Limiting**: Minimum 1-second delay between requests
3. **User Agent**: Identify as personal coffee tracking tool
4. **Caching**: Cache responses to minimize requests
5. **Attribution**: Always credit sources and link back
6. **Fair Use**: Only scrape publicly available data
7. **No Circumvention**: Don't bypass paywalls or authentication

### Data Privacy

1. **Personal Data Protection**: Never share personal information without explicit consent
2. **Opt-in Sharing**: Social sharing is disabled by default
3. **Data Stripping**: Remove personal properties before publishing
4. **Local First**: All data stored locally, external sharing optional
5. **Transparent**: Clear documentation of what each integration shares

### API Usage

When APIs are available:

1. **API Keys**: Store securely in .env file
2. **Rate Limits**: Respect published rate limits
3. **Terms of Service**: Follow each service's TOS
4. **Attribution**: Credit data sources as required

---

## Integration Configuration

### Review Aggregator

Enable automated review imports:

```json
"reviewAggregator": {
  "enabled": true,
  "sources": ["coffeereview", "perfectdailygrind"],
  "cacheDuration": 604800,  // 7 days in seconds
  "rateLimit": 1000,         // milliseconds between requests
  "autoMatch": true,         // Auto-match beans to reviews
  "minScore": 90             // Only import reviews scoring 90+
}
```

### Roaster Sync

Keep roaster information up-to-date:

```json
"roasterSync": {
  "enabled": true,
  "sources": ["sca", "community"],
  "updateInterval": 86400,   // Check daily
  "autoUpdate": false,       // Manual review before updating
  "createNew": true          // Create new roaster profiles
}
```

### Event Calendar

Track coffee industry events:

```json
"eventCalendar": {
  "enabled": true,
  "subscriptions": [
    "https://sca.coffee/events/feed",
    "https://worldcoffeeevents.org/events.ical"
  ],
  "lookAheadDays": 365,
  "createNotes": true,
  "notesFolder": "Events"
}
```

### Social Sharing

Publish curated notes (DISABLED by default):

```json
"socialSharing": {
  "enabled": false,           // Must explicitly enable
  "outputPath": "./public",
  "domain": "mycoffee.example.com",
  "shareTypes": ["bean-profile", "brewing-guide"],
  "requireTag": "share",      // Only share notes tagged "share"
  "stripProperties": ["email", "phone", "cost", "address"],
  "generateRSS": true
}
```

### Equipment Sync

Import data from smart coffee equipment:

```json
"equipmentSync": {
  "enabled": false,
  "devices": [
    {
      "type": "acaia",
      "name": "Acaia Lunar",
      "apiEndpoint": "https://api.acaia.com",
      "autoImport": true,
      "createLogs": true
    }
  ],
  "importInterval": 3600      // Check hourly
}
```

---

## Running Integrations

### Manual Execution

Run individual integrations manually:

```bash
# Review aggregation
node review-aggregator.js

# Roaster sync
node roaster-sync.js

# Event calendar update
node event-calendar.js

# Social sharing build
node social-sharing/build.js

# Equipment data import
node equipment-sync/import.js
```

### Automated Scheduling

#### macOS/Linux (cron)

Edit crontab:

```bash
crontab -e
```

Add scheduled tasks:

```cron
# Review aggregation - Weekly on Sunday at 2am
0 2 * * 0 cd /path/to/vault/External\ Integrations && node review-aggregator.js

# Roaster sync - Daily at 3am
0 3 * * * cd /path/to/vault/External\ Integrations && node roaster-sync.js

# Event calendar - Daily at 1am
0 1 * * * cd /path/to/vault/External\ Integrations && node event-calendar.js

# Equipment sync - Every 6 hours
0 */6 * * * cd /path/to/vault/External\ Integrations && node equipment-sync/import.js
```

#### Windows (Task Scheduler)

Create scheduled tasks using Windows Task Scheduler:

1. Open Task Scheduler
2. Create Basic Task
3. Set trigger (daily, weekly, etc.)
4. Action: Start a program
5. Program: `node.exe`
6. Arguments: `C:\path\to\vault\External Integrations\review-aggregator.js`
7. Start in: `C:\path\to\vault\External Integrations`

---

## Troubleshooting

### Common Issues

#### "Cannot find module" errors

**Solution**: Install dependencies:

```bash
npm install
pip3 install -r requirements.txt
```

#### Rate limiting / 429 errors

**Solution**: Increase rate limit delay in config.json:

```json
"rateLimit": 2000  // Increase to 2 seconds
```

#### Cache not working

**Solution**: Ensure cache directory exists:

```bash
mkdir .cache
```

#### Integration not finding vault files

**Solution**: Check vaultPath in config.json is absolute path:

```json
"vaultPath": "/Users/yourname/Documents/CoffeeVault"
```

### Logs and Debugging

Enable detailed logging:

```bash
DEBUG=* node review-aggregator.js
```

Log files are written to `logs/` folder with timestamp:

```
logs/
  review-aggregator-2025-10-25.log
  roaster-sync-2025-10-25.log
  equipment-sync-2025-10-25.log
```

---

## Security Best Practices

### API Keys and Credentials

1. **Never commit .env file** - Add to .gitignore
2. **Use environment variables** - Not hardcoded values
3. **Rotate keys regularly** - Update API keys periodically
4. **Limit permissions** - Use read-only keys where possible

### Network Security

1. **HTTPS only** - All external requests use SSL
2. **Verify certificates** - Don't disable SSL verification
3. **Timeout requests** - Set reasonable timeout values
4. **Validate responses** - Check data before processing

### Data Security

1. **Local storage** - Data cached locally only
2. **No tracking** - Integrations don't phone home
3. **Privacy first** - Personal data never shared
4. **Audit sharing** - Review what social sharing publishes

---

## Integration Status

Track which integrations are active:

| Integration | Status | Last Updated | Notes |
|------------|---------|--------------|-------|
| Review Aggregator | ⚪ Not configured | - | Requires setup |
| Roaster Sync | ⚪ Not configured | - | Requires setup |
| Event Calendar | ⚪ Not configured | - | Requires setup |
| Social Sharing | ⚪ Disabled | - | Privacy: opt-in only |
| Equipment Sync | ⚪ Not configured | - | Requires devices |

Update this table after configuration.

---

## Next Steps

1. ✅ Read this setup guide
2. ⬜ Install Node.js and Python dependencies
3. ⬜ Create config.json with your settings
4. ⬜ Create .env file with credentials (if needed)
5. ⬜ Test individual integrations manually
6. ⬜ Configure automated scheduling
7. ⬜ Review privacy settings
8. ⬜ Enable desired integrations

---

## Support and Documentation

- **Integration Guide**: `Documentation/External-Integration-Guide.md`
- **API Documentation**: See individual integration folders
- **Privacy Policy**: Review before enabling social sharing
- **Issue Tracking**: Document issues in vault

---

**Important**: All external integrations are optional. The vault functions perfectly without any external connections. Only enable integrations that provide value for your workflow.
