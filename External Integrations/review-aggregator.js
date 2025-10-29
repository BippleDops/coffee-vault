/**
 * Coffee Review Aggregation System
 *
 * Automatically queries professional coffee review sites and matches beans
 * in the user's library with published reviews. Respects robots.txt,
 * implements rate limiting, and caches responses locally.
 *
 * Sources:
 * - Coffee Review (coffeereview.com)
 * - Perfect Daily Grind (perfectdailygrind.com)
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
const BEANS_FOLDER = path.join(VAULT_PATH, 'Beans Library');
const REVIEWS_FOLDER = path.join(VAULT_PATH, config.integrations.reviewAggregator.outputFolder);
const CACHE_DIR = path.join(__dirname, config.cache.path);
const LOG_DIR = path.join(__dirname, config.logging.path);

const RATE_LIMIT_MS = config.integrations.reviewAggregator.rateLimit;
const CACHE_DURATION = config.integrations.reviewAggregator.cacheDuration;
const MIN_SCORE = config.integrations.reviewAggregator.minScore;

// Initialize cache
const cache = new NodeCache({ stdTTL: CACHE_DURATION });

// ============================================================================
// Utilities
// ============================================================================

/**
 * Sleep for specified milliseconds
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Log message with timestamp
 */
function log(level, message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  console.log(logMessage);

  if (config.logging.enabled) {
    appendLog(logMessage);
  }
}

/**
 * Append to log file
 */
async function appendLog(message) {
  try {
    await fs.mkdir(LOG_DIR, { recursive: true });
    const logFile = path.join(LOG_DIR, `review-aggregator-${new Date().toISOString().split('T')[0]}.log`);
    await fs.appendFile(logFile, message + '\n');
  } catch (err) {
    console.error('Failed to write log:', err);
  }
}

/**
 * Check robots.txt for a domain
 */
async function checkRobotsTxt(domain) {
  try {
    const robotsUrl = `https://${domain}/robots.txt`;
    const response = await axios.get(robotsUrl, { timeout: 10000 });

    // Simple robots.txt parser - check for User-agent: * rules
    const lines = response.data.split('\n');
    let disallowedPaths = [];
    let isRelevantAgent = false;

    for (let line of lines) {
      line = line.trim();
      if (line.startsWith('User-agent: *')) {
        isRelevantAgent = true;
      } else if (line.startsWith('User-agent:')) {
        isRelevantAgent = false;
      } else if (isRelevantAgent && line.startsWith('Disallow:')) {
        const path = line.substring('Disallow:'.length).trim();
        disallowedPaths.push(path);
      }
    }

    log('info', `robots.txt for ${domain}: ${disallowedPaths.length} disallowed paths`);
    return disallowedPaths;
  } catch (err) {
    log('warn', `Could not fetch robots.txt for ${domain}: ${err.message}`);
    return [];
  }
}

/**
 * Check if path is allowed by robots.txt
 */
function isPathAllowed(urlPath, disallowedPaths) {
  for (let disallowed of disallowedPaths) {
    if (disallowed && urlPath.startsWith(disallowed)) {
      return false;
    }
  }
  return true;
}

/**
 * Make HTTP request with rate limiting and user agent
 */
async function fetchWithRateLimit(url, disallowedPaths = []) {
  // Check cache first
  const cached = cache.get(url);
  if (cached) {
    log('info', `Cache hit: ${url}`);
    return cached;
  }

  // Check robots.txt
  const urlObj = new URL(url);
  if (!isPathAllowed(urlObj.pathname, disallowedPaths)) {
    log('warn', `Path disallowed by robots.txt: ${url}`);
    return null;
  }

  // Rate limiting
  await sleep(RATE_LIMIT_MS);

  try {
    log('info', `Fetching: ${url}`);
    const response = await axios.get(url, {
      timeout: config.network.timeout,
      headers: {
        'User-Agent': config.network.userAgent
      }
    });

    // Cache response
    cache.set(url, response.data);

    return response.data;
  } catch (err) {
    log('error', `Failed to fetch ${url}: ${err.message}`);
    return null;
  }
}

// ============================================================================
// Bean Library Parser
// ============================================================================

/**
 * Parse frontmatter from markdown file
 */
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

    // Remove quotes
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Remove wiki links
    value = value.replace(/\[\[([^\]]+)\]\]/g, '$1');

    properties[key] = value;
  }

  return properties;
}

/**
 * Load all bean profiles from vault
 */
async function loadBeanProfiles() {
  try {
    const files = await fs.readdir(BEANS_FOLDER);
    const beans = [];

    for (let file of files) {
      if (!file.endsWith('.md')) continue;

      const filePath = path.join(BEANS_FOLDER, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const properties = parseFrontmatter(content);

      if (properties) {
        beans.push({
          filename: file,
          ...properties
        });
      }
    }

    log('info', `Loaded ${beans.length} bean profiles`);
    return beans;
  } catch (err) {
    log('error', `Failed to load bean profiles: ${err.message}`);
    return [];
  }
}

// ============================================================================
// Coffee Review Scraper
// ============================================================================

/**
 * Search Coffee Review for a specific bean
 */
async function searchCoffeeReview(bean, disallowedPaths) {
  const searchTerms = [];

  if (bean['bean-name']) searchTerms.push(bean['bean-name']);
  if (bean.roaster) searchTerms.push(bean.roaster);
  if (bean.origin) searchTerms.push(bean.origin);

  const query = searchTerms.join(' ');
  const searchUrl = `https://www.coffeereview.com/?s=${encodeURIComponent(query)}`;

  const html = await fetchWithRateLimit(searchUrl, disallowedPaths);
  if (!html) return [];

  const $ = cheerio.load(html);
  const results = [];

  // Parse search results - structure varies by site
  // This is a simplified example
  $('.review-item, .search-result').each((i, elem) => {
    const title = $(elem).find('.review-title, h2').text().trim();
    const score = $(elem).find('.review-score, .rating').text().trim();
    const link = $(elem).find('a').attr('href');

    if (title && link) {
      const scoreNum = parseInt(score);
      if (!isNaN(scoreNum) && scoreNum >= MIN_SCORE) {
        results.push({
          title,
          score: scoreNum,
          url: link.startsWith('http') ? link : `https://www.coffeereview.com${link}`,
          source: 'Coffee Review'
        });
      }
    }
  });

  return results;
}

/**
 * Fetch full review details
 */
async function fetchReviewDetails(reviewUrl, disallowedPaths) {
  const html = await fetchWithRateLimit(reviewUrl, disallowedPaths);
  if (!html) return null;

  const $ = cheerio.load(html);

  return {
    title: $('.review-title, h1').first().text().trim(),
    score: $('.review-score, .rating').first().text().trim(),
    roaster: $('.roaster-name, .review-meta .roaster').text().trim(),
    origin: $('.origin, .review-meta .origin').text().trim(),
    price: $('.price').text().trim(),
    reviewText: $('.review-content, .review-body').text().trim(),
    flavorNotes: $('.flavor-notes, .notes').text().trim(),
    reviewer: $('.reviewer, .author').text().trim(),
    date: $('.review-date, .published-date').text().trim()
  };
}

// ============================================================================
// Perfect Daily Grind Scraper
// ============================================================================

/**
 * Search Perfect Daily Grind for reviews
 */
async function searchPerfectDailyGrind(bean, disallowedPaths) {
  const searchTerms = [];

  if (bean['bean-name']) searchTerms.push(bean['bean-name']);
  if (bean.roaster) searchTerms.push(bean.roaster);
  if (bean.origin) searchTerms.push(bean.origin);

  const query = searchTerms.join(' ') + ' review';
  const searchUrl = `https://perfectdailygrind.com/?s=${encodeURIComponent(query)}`;

  const html = await fetchWithRateLimit(searchUrl, disallowedPaths);
  if (!html) return [];

  const $ = cheerio.load(html);
  const results = [];

  // Parse search results
  $('article, .search-result').each((i, elem) => {
    const title = $(elem).find('h2, .entry-title').text().trim();
    const link = $(elem).find('a').attr('href');
    const excerpt = $(elem).find('.excerpt, .entry-summary').text().trim();

    if (title && link && (title.toLowerCase().includes('review') || excerpt.toLowerCase().includes('review'))) {
      results.push({
        title,
        url: link,
        excerpt,
        source: 'Perfect Daily Grind'
      });
    }
  });

  return results.slice(0, 5); // Limit results
}

// ============================================================================
// Review Note Generator
// ============================================================================

/**
 * Create markdown note for aggregated reviews
 */
function generateReviewNote(bean, reviews) {
  const date = new Date().toISOString().split('T')[0];
  const beanName = bean['bean-name'] || 'Unknown Bean';
  const roaster = bean.roaster || 'Unknown Roaster';

  let markdown = `---
type: review-aggregate
bean: "${beanName}"
roaster: "${roaster}"
origin: "${bean.origin || ''}"
date: ${date}
sources: [${reviews.map(r => `"${r.source}"`).join(', ')}]
tags: [review, aggregated]
---

# Professional Reviews: ${beanName}

**Roaster**: ${roaster}
**Origin**: ${bean.origin || 'Unknown'}
**Aggregated**: ${date}

---

## Review Summary

Found ${reviews.length} professional review(s) for this coffee.

`;

  for (let review of reviews) {
    markdown += `
### ${review.source}

**Title**: ${review.title}
**Score**: ${review.score || 'N/A'}
**URL**: ${review.url}

${review.reviewText ? `**Review**:\n${review.reviewText}\n` : ''}
${review.flavorNotes ? `**Flavor Notes**: ${review.flavorNotes}\n` : ''}
${review.excerpt ? `**Excerpt**: ${review.excerpt}\n` : ''}

---
`;
  }

  markdown += `
## Attribution

All reviews aggregated from publicly available sources. Please visit the original URLs to read full reviews and support professional coffee reviewers.

## Related Notes

- Bean Profile: [[${beanName}]]
${bean.roaster ? `- Roaster: [[${bean.roaster}]]` : ''}

---

*Last Updated*: ${date}
*Aggregation Tool*: Coffee Vault Review Aggregator v1.0.0
`;

  return markdown;
}

/**
 * Save review note to vault
 */
async function saveReviewNote(bean, reviews) {
  try {
    await fs.mkdir(REVIEWS_FOLDER, { recursive: true });

    const beanName = bean['bean-name'] || 'Unknown Bean';
    const safeName = beanName.replace(/[^a-zA-Z0-9-_\s]/g, '').replace(/\s+/g, '-');
    const filename = `${safeName}-Reviews.md`;
    const filePath = path.join(REVIEWS_FOLDER, filename);

    const markdown = generateReviewNote(bean, reviews);
    await fs.writeFile(filePath, markdown);

    log('info', `Saved review note: ${filename}`);
    return filePath;
  } catch (err) {
    log('error', `Failed to save review note: ${err.message}`);
    return null;
  }
}

// ============================================================================
// Main Execution
// ============================================================================

/**
 * Main aggregation process
 */
async function aggregateReviews() {
  log('info', 'Starting Coffee Review Aggregation');

  // Check if enabled
  if (!config.integrations.reviewAggregator.enabled) {
    log('warn', 'Review aggregator is disabled in config.json');
    return;
  }

  // Load bean profiles
  const beans = await loadBeanProfiles();
  if (beans.length === 0) {
    log('warn', 'No bean profiles found to search for');
    return;
  }

  // Check robots.txt for sources
  const robotsRules = {};
  for (let source of config.integrations.reviewAggregator.sources) {
    if (source === 'coffeereview') {
      robotsRules.coffeereview = await checkRobotsTxt('www.coffeereview.com');
    } else if (source === 'perfectdailygrind') {
      robotsRules.perfectdailygrind = await checkRobotsTxt('perfectdailygrind.com');
    }
  }

  // Process each bean
  let totalReviews = 0;

  for (let i = 0; i < beans.length; i++) {
    const bean = beans[i];
    log('info', `Processing bean ${i + 1}/${beans.length}: ${bean['bean-name']}`);

    const allReviews = [];

    // Search Coffee Review
    if (config.integrations.reviewAggregator.sources.includes('coffeereview')) {
      const crReviews = await searchCoffeeReview(bean, robotsRules.coffeereview || []);
      allReviews.push(...crReviews);
    }

    // Search Perfect Daily Grind
    if (config.integrations.reviewAggregator.sources.includes('perfectdailygrind')) {
      const pdgReviews = await searchPerfectDailyGrind(bean, robotsRules.perfectdailygrind || []);
      allReviews.push(...pdgReviews);
    }

    // Save if reviews found
    if (allReviews.length > 0) {
      await saveReviewNote(bean, allReviews);
      totalReviews += allReviews.length;
      log('info', `Found ${allReviews.length} review(s) for ${bean['bean-name']}`);
    } else {
      log('info', `No reviews found for ${bean['bean-name']}`);
    }
  }

  log('info', `Review aggregation complete. Found ${totalReviews} total reviews for ${beans.length} beans.`);
}

// Run if called directly
if (require.main === module) {
  aggregateReviews()
    .then(() => {
      log('info', 'Review aggregation finished successfully');
      process.exit(0);
    })
    .catch(err => {
      log('error', `Review aggregation failed: ${err.message}`);
      console.error(err);
      process.exit(1);
    });
}

module.exports = { aggregateReviews, loadBeanProfiles };
