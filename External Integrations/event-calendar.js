/**
 * Event Calendar Integration
 *
 * Import coffee industry events from SCA calendars, World Coffee Events,
 * and regional listings. Creates event notes with dates, locations, and
 * maintains personal attendance tracking.
 *
 * Data Sources:
 * - SCA (Specialty Coffee Association) event calendar
 * - World Coffee Events (WCE) competition schedules
 * - Regional coffee event listings
 * - iCalendar (.ics) subscriptions
 *
 * @version 1.0.0
 * @license MIT
 */

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const ical = require('ical.js');

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
const EVENTS_FOLDER = path.join(VAULT_PATH, config.integrations.eventCalendar.notesFolder || 'Events');
const LOG_DIR = path.join(__dirname, config.logging.path);

const LOOK_AHEAD_DAYS = config.integrations.eventCalendar.lookAheadDays;
const CREATE_NOTES = config.integrations.eventCalendar.createNotes;
const REMINDER_DAYS = config.integrations.eventCalendar.reminderDays || 7;

// Sample coffee events database (for demonstration)
const COFFEE_EVENTS_DB = [
  {
    title: "World Barista Championship 2026",
    type: "competition",
    organizer: "World Coffee Events",
    startDate: "2026-05-15",
    endDate: "2026-05-18",
    location: "Melbourne, Australia",
    description: "The premier global coffee competition showcasing the world's best baristas.",
    website: "https://worldcoffeeevents.org/wbc",
    tags: ["competition", "wbc", "barista"]
  },
  {
    title: "Specialty Coffee Expo 2026",
    type: "conference",
    organizer: "SCA",
    startDate: "2026-04-10",
    endDate: "2026-04-13",
    location: "Boston, MA",
    description: "The largest specialty coffee event in the world with exhibitions, lectures, and competitions.",
    website: "https://www.coffeeexpo.org",
    tags: ["conference", "expo", "sca"]
  },
  {
    title: "World Coffee Roasting Championship 2026",
    type: "competition",
    organizer: "World Coffee Events",
    startDate: "2026-06-20",
    endDate: "2026-06-22",
    location: "Copenhagen, Denmark",
    description: "Competition celebrating the art and science of coffee roasting.",
    website: "https://worldcoffeeevents.org/wcrc",
    tags: ["competition", "roasting", "wcrc"]
  },
  {
    title: "Cup of Excellence 2026 - Ethiopia",
    type: "auction",
    organizer: "Alliance for Coffee Excellence",
    startDate: "2026-03-15",
    endDate: "2026-03-17",
    location: "Addis Ababa, Ethiopia",
    description: "Premium coffee auction showcasing Ethiopia's finest microlots.",
    website: "https://allianceforcoffeeexcellence.org",
    tags: ["auction", "coe", "ethiopia"]
  },
  {
    title: "Re:co Symposium 2026",
    type: "symposium",
    organizer: "SCA",
    startDate: "2026-04-09",
    endDate: "2026-04-10",
    location: "Boston, MA",
    description: "Research-focused event exploring coffee sustainability and science.",
    website: "https://www.recosymposium.org",
    tags: ["symposium", "research", "sustainability"]
  },
  {
    title: "World Brewers Cup 2026",
    type: "competition",
    organizer: "World Coffee Events",
    startDate: "2026-05-16",
    endDate: "2026-05-17",
    location: "Melbourne, Australia",
    description: "Competition highlighting manual coffee brewing methods and skills.",
    website: "https://worldcoffeeevents.org/wbrc",
    tags: ["competition", "brewing", "wbrc"]
  },
  {
    title: "World Latte Art Championship 2026",
    type: "competition",
    organizer: "World Coffee Events",
    startDate: "2026-05-17",
    endDate: "2026-05-18",
    location: "Melbourne, Australia",
    description: "Global competition celebrating creativity and skill in latte art.",
    website: "https://worldcoffeeevents.org/wlac",
    tags: ["competition", "latte-art", "wlac"]
  },
  {
    title: "Amsterdam Coffee Festival 2026",
    type: "festival",
    organizer: "Amsterdam Coffee Festival",
    startDate: "2026-03-06",
    endDate: "2026-03-08",
    location: "Amsterdam, Netherlands",
    description: "Europe's premier coffee festival with tastings, workshops, and exhibitions.",
    website: "https://www.amsterdamcoffeefestival.com",
    tags: ["festival", "europe", "tastings"]
  },
  {
    title: "London Coffee Festival 2026",
    type: "festival",
    organizer: "Allegra Events",
    startDate: "2026-04-23",
    endDate: "2026-04-26",
    location: "London, UK",
    description: "UK's largest coffee event featuring roasters, equipment, and barista competitions.",
    website: "https://www.londoncoffeefestival.com",
    tags: ["festival", "uk", "barista"]
  },
  {
    title: "Coffee Fest Portland 2026",
    type: "trade-show",
    organizer: "Coffee Fest",
    startDate: "2026-09-25",
    endDate: "2026-09-27",
    location: "Portland, OR",
    description: "Regional trade show for coffee professionals with workshops and competitions.",
    website: "https://www.coffeefest.com",
    tags: ["trade-show", "portland", "workshops"]
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
    const logFile = path.join(LOG_DIR, `event-calendar-${new Date().toISOString().split('T')[0]}.log`);
    await fs.appendFile(logFile, message + '\n');
  } catch (err) {
    console.error('Failed to write log:', err);
  }
}

function parseDate(dateString) {
  return new Date(dateString);
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function daysUntil(dateString) {
  const eventDate = parseDate(dateString);
  const today = new Date();
  const diffTime = eventDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function isWithinLookAhead(dateString) {
  const days = daysUntil(dateString);
  return days >= 0 && days <= LOOK_AHEAD_DAYS;
}

// ============================================================================
// iCalendar Parser
// ============================================================================

async function fetchICalendar(url) {
  try {
    log('info', `Fetching iCalendar: ${url}`);

    const response = await axios.get(url, {
      timeout: config.network.timeout,
      headers: {
        'User-Agent': config.network.userAgent
      }
    });

    return response.data;
  } catch (err) {
    log('error', `Failed to fetch iCalendar from ${url}: ${err.message}`);
    return null;
  }
}

function parseICalendar(icalData) {
  try {
    const jcalData = ical.parse(icalData);
    const comp = new ical.Component(jcalData);
    const vevents = comp.getAllSubcomponents('vevent');

    const events = [];

    for (let vevent of vevents) {
      const event = new ical.Event(vevent);

      // Extract event details
      const eventData = {
        title: event.summary,
        description: event.description || '',
        location: event.location || '',
        startDate: formatDate(event.startDate.toJSDate()),
        endDate: event.endDate ? formatDate(event.endDate.toJSDate()) : formatDate(event.startDate.toJSDate()),
        organizer: event.organizer || '',
        type: 'event',
        tags: ['calendar-import', 'coffee-event'],
        source: 'icalendar'
      };

      // Only include events within look-ahead window
      if (isWithinLookAhead(eventData.startDate)) {
        events.push(eventData);
      }
    }

    log('info', `Parsed ${events.length} events from iCalendar`);
    return events;
  } catch (err) {
    log('error', `Failed to parse iCalendar: ${err.message}`);
    return [];
  }
}

// ============================================================================
// Event Note Generator
// ============================================================================

function generateEventNote(event) {
  const days = daysUntil(event.startDate);
  const countdown = days >= 0 ? `${days} days` : `${Math.abs(days)} days ago`;

  let markdown = `---
type: coffee-event
title: "${event.title}"
event-type: ${event.type || 'event'}
organizer: "${event.organizer || ''}"
start-date: ${event.startDate}
end-date: ${event.endDate || event.startDate}
location: "${event.location || ''}"
website: ${event.website || ''}
tags: [${event.tags ? event.tags.join(', ') : 'event'}]
attending: false
attended: false
---

# ${event.title}

**Type**: ${event.type || 'Event'}
**Organizer**: ${event.organizer || 'Unknown'}
**Dates**: ${event.startDate}${event.endDate && event.endDate !== event.startDate ? ` to ${event.endDate}` : ''}
**Location**: ${event.location || 'TBD'}

${days >= 0 ? `\n> [!tip] Countdown\n> **${countdown}** until this event!\n` : ''}

---

## About

${event.description || 'Event information coming soon.'}

${event.website ? `\n**Official Website**: ${event.website}\n` : ''}

---

## My Plans

### Attendance

- [ ] Planning to attend
- [ ] Registered
- [ ] Travel booked
- [ ] Attended

### Preparation

- [ ] Research sessions/workshops
- [ ] Book accommodations
- [ ] Arrange transportation
- [ ] Pack equipment

### Notes

<!-- Add your event notes here -->

---

## Highlights

<!-- After attending, add highlights and key takeaways -->

---

## Photos & Memories

<!-- Add photos and memories from the event -->

---

## Related Events

\`\`\`dataview
TABLE
  title as "Event",
  start-date as "Date",
  location as "Location",
  event-type as "Type"
FROM "Events"
WHERE type = "coffee-event"
  AND start-date >= date("${event.startDate}") - dur(30 days)
  AND start-date <= date("${event.startDate}") + dur(30 days)
  AND file.name != this.file.name
SORT start-date ASC
\`\`\`

---

## Reminders

${days >= 0 && days <= REMINDER_DAYS ? `\n> [!warning] Upcoming Event\n> This event is happening soon! Make sure you're prepared.\n` : ''}

---

*Event imported*: ${new Date().toISOString().split('T')[0]}
*Source*: ${event.source || 'Manual Entry'}
`;

  return markdown;
}

async function saveEventNote(event) {
  try {
    await fs.mkdir(EVENTS_FOLDER, { recursive: true });

    // Create filename from title and date
    const safeName = event.title.replace(/[^a-zA-Z0-9-_\s]/g, '').replace(/\s+/g, '-');
    const filename = `${event.startDate}-${safeName}.md`;
    const filePath = path.join(EVENTS_FOLDER, filename);

    // Check if event already exists
    try {
      await fs.access(filePath);
      log('info', `Event already exists, skipping: ${filename}`);
      return null;
    } catch {
      // File doesn't exist, create it
    }

    const markdown = generateEventNote(event);
    await fs.writeFile(filePath, markdown);

    log('info', `Created event note: ${filename}`);
    return filePath;
  } catch (err) {
    log('error', `Failed to save event note: ${err.message}`);
    return null;
  }
}

// ============================================================================
// Event Calendar Synchronization
// ============================================================================

async function syncEventCalendar() {
  log('info', 'Starting Event Calendar Synchronization');

  if (!config.integrations.eventCalendar.enabled) {
    log('warn', 'Event calendar integration is disabled in config.json');
    return;
  }

  const allEvents = [];

  // Process static coffee events database
  log('info', `Processing ${COFFEE_EVENTS_DB.length} events from database`);

  for (let event of COFFEE_EVENTS_DB) {
    if (isWithinLookAhead(event.startDate)) {
      event.source = 'coffee-events-db';
      allEvents.push(event);
    }
  }

  log('info', `Found ${allEvents.length} events within ${LOOK_AHEAD_DAYS}-day look-ahead window`);

  // Process iCalendar subscriptions
  if (config.integrations.eventCalendar.subscriptions) {
    for (let subscriptionUrl of config.integrations.eventCalendar.subscriptions) {
      const icalData = await fetchICalendar(subscriptionUrl);

      if (icalData) {
        const events = parseICalendar(icalData);
        allEvents.push(...events);
        await sleep(1000); // Rate limiting
      }
    }
  }

  // Create event notes
  let createdCount = 0;

  if (CREATE_NOTES) {
    for (let event of allEvents) {
      const created = await saveEventNote(event);
      if (created) {
        createdCount++;
      }
    }
  }

  log('info', `Event calendar sync complete. Total events: ${allEvents.length}, Created notes: ${createdCount}`);

  return {
    totalEvents: allEvents.length,
    createdNotes: createdCount,
    upcomingEvents: allEvents.filter(e => daysUntil(e.startDate) >= 0 && daysUntil(e.startDate) <= 30)
  };
}

// ============================================================================
// Event Calendar Dashboard
// ============================================================================

async function generateEventDashboard() {
  const dashboardPath = path.join(EVENTS_FOLDER, '_Event Calendar Dashboard.md');

  const markdown = `---
type: dashboard
title: "Coffee Event Calendar"
tags: [dashboard, events]
---

# Coffee Event Calendar

Track upcoming coffee industry events, competitions, and conferences.

---

## Upcoming Events (Next 30 Days)

\`\`\`dataview
TABLE
  title as "Event",
  start-date as "Date",
  location as "Location",
  event-type as "Type",
  choice(attending, "✓ Yes", "- No") as "Attending"
FROM "Events"
WHERE type = "coffee-event"
  AND start-date >= date(today)
  AND start-date <= date(today) + dur(30 days)
SORT start-date ASC
\`\`\`

---

## Events This Year

\`\`\`dataview
TABLE
  title as "Event",
  start-date as "Date",
  location as "Location",
  organizer as "Organizer"
FROM "Events"
WHERE type = "coffee-event"
  AND start-date >= date(today)
  AND start-date <= date(today) + dur(365 days)
SORT start-date ASC
\`\`\`

---

## Events by Type

### Competitions

\`\`\`dataview
LIST
FROM "Events"
WHERE type = "coffee-event" AND event-type = "competition"
  AND start-date >= date(today)
SORT start-date ASC
\`\`\`

### Conferences & Expos

\`\`\`dataview
LIST
FROM "Events"
WHERE type = "coffee-event" AND (event-type = "conference" OR event-type = "festival")
  AND start-date >= date(today)
SORT start-date ASC
\`\`\`

---

## Events I'm Attending

\`\`\`dataview
TABLE
  title as "Event",
  start-date as "Date",
  location as "Location"
FROM "Events"
WHERE type = "coffee-event" AND attending = true
SORT start-date ASC
\`\`\`

---

## Past Events

\`\`\`dataview
TABLE
  title as "Event",
  start-date as "Date",
  location as "Location",
  choice(attended, "✓ Attended", "- Missed") as "Status"
FROM "Events"
WHERE type = "coffee-event" AND start-date < date(today)
SORT start-date DESC
LIMIT 10
\`\`\`

---

*Last Updated*: ${new Date().toISOString().split('T')[0]}
`;

  try {
    await fs.mkdir(EVENTS_FOLDER, { recursive: true });
    await fs.writeFile(dashboardPath, markdown);
    log('info', 'Generated Event Calendar Dashboard');
    return dashboardPath;
  } catch (err) {
    log('error', `Failed to generate dashboard: ${err.message}`);
    return null;
  }
}

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
  try {
    log('info', '=== Event Calendar Integration ===');

    // Sync events
    const results = await syncEventCalendar();

    // Generate dashboard
    await generateEventDashboard();

    if (results) {
      log('info', '=== Synchronization Summary ===');
      log('info', `Total events found: ${results.totalEvents}`);
      log('info', `Event notes created: ${results.createdNotes}`);
      log('info', `Upcoming events (30 days): ${results.upcomingEvents.length}`);

      if (results.upcomingEvents.length > 0) {
        log('info', '\nNext 3 upcoming events:');
        results.upcomingEvents.slice(0, 3).forEach(event => {
          log('info', `  - ${event.title} (${event.startDate}) - ${daysUntil(event.startDate)} days`);
        });
      }
    }

    return results;
  } catch (err) {
    log('error', `Event calendar integration failed: ${err.message}`);
    throw err;
  }
}

// Run if called directly
if (require.main === module) {
  main()
    .then(() => {
      log('info', 'Event calendar sync finished successfully');
      process.exit(0);
    })
    .catch(err => {
      log('error', `Event calendar sync failed: ${err.message}`);
      console.error(err);
      process.exit(1);
    });
}

module.exports = { syncEventCalendar, generateEventDashboard };
