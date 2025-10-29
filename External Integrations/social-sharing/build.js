/**
 * Social Sharing Framework - Static Site Builder
 *
 * Generates static web pages from Obsidian notes tagged for sharing.
 * Implements strict privacy controls, stripping personal information
 * before publication. Creates RSS feeds and standalone HTML pages.
 *
 * Privacy-First Design:
 * - Opt-in only (disabled by default)
 * - Requires explicit "share" tag
 * - Strips sensitive properties
 * - No tracking or analytics
 * - Complete user control
 *
 * @version 1.0.0
 * @license MIT
 */

const fs = require('fs').promises;
const path = require('path');
const grayMatter = require('gray-matter');
const MarkdownIt = require('markdown-it');

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
const OUTPUT_PATH = path.join(__dirname, config.integrations.socialSharing.outputPath || './public');
const LOG_DIR = path.join(__dirname, '..', config.logging.path);

const SHARE_TAG = config.integrations.socialSharing.requireTag;
const SHARE_TYPES = config.integrations.socialSharing.shareTypes;
const STRIP_PROPERTIES = config.integrations.socialSharing.stripProperties;
const SITE_NAME = config.integrations.socialSharing.siteName;
const SITE_DESCRIPTION = config.integrations.socialSharing.siteDescription;
const DOMAIN = config.integrations.socialSharing.domain;
const GENERATE_RSS = config.integrations.socialSharing.generateRSS;

// Initialize Markdown parser
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

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
    const logFile = path.join(LOG_DIR, `social-sharing-${new Date().toISOString().split('T')[0]}.log`);
    await fs.appendFile(logFile, message + '\n');
  } catch (err) {
    console.error('Failed to write log:', err);
  }
}

// ============================================================================
// Privacy & Data Stripping
// ============================================================================

/**
 * Remove sensitive properties from frontmatter
 */
function stripPersonalData(frontmatter) {
  const cleaned = { ...frontmatter };

  // Remove properties specified in config
  for (let prop of STRIP_PROPERTIES) {
    delete cleaned[prop];
  }

  // Additional privacy safeguards
  const sensitiveKeywords = ['password', 'api', 'key', 'token', 'secret', 'private'];
  for (let key of Object.keys(cleaned)) {
    if (sensitiveKeywords.some(keyword => key.toLowerCase().includes(keyword))) {
      delete cleaned[key];
      log('warn', `Stripped potentially sensitive property: ${key}`);
    }
  }

  return cleaned;
}

/**
 * Remove sensitive content from markdown body
 */
function stripPersonalContent(content) {
  let cleaned = content;

  // Remove personal notes sections (anything between specific markers)
  cleaned = cleaned.replace(/<!-- PRIVATE START -->[\s\S]*?<!-- PRIVATE END -->/g, '');

  // Remove email addresses
  cleaned = cleaned.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[email removed]');

  // Remove phone numbers (basic pattern)
  cleaned = cleaned.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[phone removed]');

  return cleaned;
}

// ============================================================================
// File Scanner
// ============================================================================

/**
 * Recursively find all markdown files in vault
 */
async function findMarkdownFiles(dir, fileList = []) {
  const files = await fs.readdir(dir);

  for (let file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      // Skip hidden directories and certain folders
      if (!file.startsWith('.') && file !== 'node_modules') {
        await findMarkdownFiles(filePath, fileList);
      }
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  }

  return fileList;
}

/**
 * Check if note should be shared
 */
function shouldShare(frontmatter, content) {
  // Must have share tag
  if (!frontmatter.tags) return false;

  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [frontmatter.tags];
  if (!tags.includes(SHARE_TAG)) return false;

  // Must be allowed type
  if (SHARE_TYPES && SHARE_TYPES.length > 0) {
    if (!SHARE_TYPES.includes(frontmatter.type)) {
      return false;
    }
  }

  return true;
}

// ============================================================================
// HTML Template Generator
// ============================================================================

function generateHTMLTemplate(title, htmlContent, frontmatter, filename) {
  const date = frontmatter.date || new Date().toISOString().split('T')[0];

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${frontmatter.description || SITE_DESCRIPTION}">
    <meta name="author" content="${SITE_NAME}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${frontmatter.description || SITE_DESCRIPTION}">
    <meta property="og:type" content="article">
    <title>${title} - ${SITE_NAME}</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <header>
        <div class="container">
            <h1 class="site-title"><a href="/index.html">${SITE_NAME}</a></h1>
            <p class="site-description">${SITE_DESCRIPTION}</p>
            <nav>
                <a href="/index.html">Home</a>
                <a href="/beans.html">Beans</a>
                <a href="/brewing.html">Brewing Guides</a>
                ${GENERATE_RSS ? '<a href="/feed.xml">RSS</a>' : ''}
            </nav>
        </div>
    </header>

    <main class="container">
        <article>
            <header class="article-header">
                <h1>${title}</h1>
                <div class="article-meta">
                    <time datetime="${date}">${date}</time>
                    ${frontmatter.type ? `<span class="type">${frontmatter.type}</span>` : ''}
                </div>
            </header>

            <div class="article-content">
                ${htmlContent}
            </div>

            <footer class="article-footer">
                <p><em>Shared from my personal coffee vault</em></p>
                ${frontmatter.tags ? `<div class="tags">${frontmatter.tags.filter(t => t !== SHARE_TAG).map(tag => `<span class="tag">${tag}</span>`).join(' ')}</div>` : ''}
            </footer>
        </article>
    </main>

    <footer class="site-footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${SITE_NAME}. No tracking. No ads. Just coffee.</p>
            <p>Generated with <a href="https://obsidian.md">Obsidian</a> and the Coffee Vault Social Sharing Framework.</p>
        </div>
    </footer>
</body>
</html>`;
}

// ============================================================================
// Site Builder
// ============================================================================

async function buildSite() {
  log('info', 'Starting Static Site Build');

  if (!config.integrations.socialSharing.enabled) {
    log('error', 'Social sharing is DISABLED in config.json (privacy protection)');
    log('info', 'To enable social sharing, set integrations.socialSharing.enabled = true');
    log('warn', 'WARNING: Enabling social sharing will publish your notes to the web');
    return;
  }

  // Create output directory
  await fs.mkdir(OUTPUT_PATH, { recursive: true });

  // Find all markdown files
  const allFiles = await findMarkdownFiles(VAULT_PATH);
  log('info', `Found ${allFiles.length} markdown files in vault`);

  // Process files
  const sharedNotes = [];
  let processedCount = 0;
  let skippedCount = 0;

  for (let filePath of allFiles) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const { data: frontmatter, content: markdownContent } = grayMatter(content);

      // Check if should be shared
      if (!shouldShare(frontmatter, markdownContent)) {
        skippedCount++;
        continue;
      }

      log('info', `Processing for sharing: ${path.basename(filePath)}`);

      // Strip personal data
      const cleanedFrontmatter = stripPersonalData(frontmatter);
      const cleanedContent = stripPersonalContent(markdownContent);

      // Convert to HTML
      const htmlContent = md.render(cleanedContent);

      // Generate filename
      const baseFilename = path.basename(filePath, '.md');
      const safeFilename = baseFilename.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
      const outputFilename = `${safeFilename}.html`;
      const outputPath = path.join(OUTPUT_PATH, outputFilename);

      // Generate HTML page
      const title = frontmatter.title || cleanedFrontmatter['bean-name'] || baseFilename;
      const html = generateHTMLTemplate(title, htmlContent, cleanedFrontmatter, outputFilename);

      // Write file
      await fs.writeFile(outputPath, html);

      sharedNotes.push({
        title,
        filename: outputFilename,
        date: cleanedFrontmatter.date || new Date().toISOString().split('T')[0],
        type: cleanedFrontmatter.type,
        description: cleanedFrontmatter.description || '',
        tags: cleanedFrontmatter.tags || []
      });

      processedCount++;
    } catch (err) {
      log('error', `Failed to process ${filePath}: ${err.message}`);
    }
  }

  log('info', `Processed ${processedCount} notes for sharing, skipped ${skippedCount}`);

  // Generate index page
  await generateIndexPage(sharedNotes);

  // Generate type-specific pages
  await generateTypePages(sharedNotes);

  // Generate CSS
  await generateCSS();

  // Generate RSS feed
  if (GENERATE_RSS) {
    await generateRSSFeed(sharedNotes);
  }

  // Generate deployment instructions
  await generateDeploymentGuide();

  log('info', `Site build complete. Output: ${OUTPUT_PATH}`);

  return {
    processedCount,
    skippedCount,
    totalFiles: allFiles.length,
    outputPath: OUTPUT_PATH
  };
}

// ============================================================================
// Index Page Generator
// ============================================================================

async function generateIndexPage(notes) {
  const sortedNotes = [...notes].sort((a, b) => new Date(b.date) - new Date(a.date));

  const notesHTML = sortedNotes.map(note => `
    <article class="note-preview">
        <h2><a href="/${note.filename}">${note.title}</a></h2>
        <div class="note-meta">
            <time datetime="${note.date}">${note.date}</time>
            ${note.type ? `<span class="type">${note.type}</span>` : ''}
        </div>
        ${note.description ? `<p>${note.description}</p>` : ''}
        <a href="/${note.filename}" class="read-more">Read more →</a>
    </article>
  `).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${SITE_DESCRIPTION}">
    <title>${SITE_NAME}</title>
    <link rel="stylesheet" href="/styles.css">
    ${GENERATE_RSS ? '<link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/feed.xml">' : ''}
</head>
<body>
    <header>
        <div class="container">
            <h1 class="site-title">${SITE_NAME}</h1>
            <p class="site-description">${SITE_DESCRIPTION}</p>
            <nav>
                <a href="/index.html">Home</a>
                <a href="/beans.html">Beans</a>
                <a href="/brewing.html">Brewing Guides</a>
                ${GENERATE_RSS ? '<a href="/feed.xml">RSS</a>' : ''}
            </nav>
        </div>
    </header>

    <main class="container">
        <div class="notes-list">
            <h2>Latest Notes</h2>
            ${notesHTML}
        </div>
    </main>

    <footer class="site-footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${SITE_NAME}. No tracking. No ads. Just coffee.</p>
            <p>Generated with <a href="https://obsidian.md">Obsidian</a>.</p>
        </div>
    </footer>
</body>
</html>`;

  await fs.writeFile(path.join(OUTPUT_PATH, 'index.html'), html);
  log('info', 'Generated index.html');
}

// ============================================================================
// Type-Specific Pages
// ============================================================================

async function generateTypePages(notes) {
  // Beans page
  const beans = notes.filter(n => n.type === 'bean-profile');
  if (beans.length > 0) {
    const html = generateTypeListingPage('Coffee Beans', 'bean-profile', beans);
    await fs.writeFile(path.join(OUTPUT_PATH, 'beans.html'), html);
    log('info', `Generated beans.html with ${beans.length} entries`);
  }

  // Brewing guides page
  const guides = notes.filter(n => n.type === 'brewing-guide');
  if (guides.length > 0) {
    const html = generateTypeListingPage('Brewing Guides', 'brewing-guide', guides);
    await fs.writeFile(path.join(OUTPUT_PATH, 'brewing.html'), html);
    log('info', `Generated brewing.html with ${guides.length} entries`);
  }
}

function generateTypeListingPage(title, type, notes) {
  const notesHTML = notes.map(note => `
    <article class="note-preview">
        <h2><a href="/${note.filename}">${note.title}</a></h2>
        ${note.description ? `<p>${note.description}</p>` : ''}
        <a href="/${note.filename}" class="read-more">Read more →</a>
    </article>
  `).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - ${SITE_NAME}</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <header>
        <div class="container">
            <h1 class="site-title"><a href="/index.html">${SITE_NAME}</a></h1>
            <nav>
                <a href="/index.html">Home</a>
                <a href="/beans.html">Beans</a>
                <a href="/brewing.html">Brewing Guides</a>
                ${GENERATE_RSS ? '<a href="/feed.xml">RSS</a>' : ''}
            </nav>
        </div>
    </header>

    <main class="container">
        <h1>${title}</h1>
        <div class="notes-list">
            ${notesHTML}
        </div>
    </main>

    <footer class="site-footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${SITE_NAME}</p>
        </div>
    </footer>
</body>
</html>`;
}

// ============================================================================
// CSS Generator
// ============================================================================

async function generateCSS() {
  const css = `/* Coffee Vault - Static Site Styles */

:root {
    --primary-color: #6F4E37;
    --secondary-color: #A67C52;
    --background: #FFFEF7;
    --text-color: #2C2416;
    --link-color: #8B6F47;
    --border-color: #E5D5C3;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    background-color: var(--background);
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
}

header {
    background-color: var(--primary-color);
    color: white;
    padding: 2rem 0;
    margin-bottom: 2rem;
}

.site-title {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.site-title a {
    color: white;
    text-decoration: none;
}

.site-description {
    font-size: 1.1rem;
    opacity: 0.9;
    margin-bottom: 1rem;
}

nav {
    margin-top: 1rem;
}

nav a {
    color: white;
    text-decoration: none;
    margin-right: 1.5rem;
    font-weight: 500;
}

nav a:hover {
    text-decoration: underline;
}

main {
    min-height: 60vh;
}

article {
    margin-bottom: 3rem;
}

.article-header {
    border-bottom: 2px solid var(--border-color);
    padding-bottom: 1rem;
    margin-bottom: 2rem;
}

.article-header h1 {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
}

.article-meta {
    color: #666;
    font-size: 0.9rem;
}

.article-meta time {
    margin-right: 1rem;
}

.article-meta .type {
    background-color: var(--secondary-color);
    color: white;
    padding: 0.2rem 0.6rem;
    border-radius: 3px;
    font-size: 0.8rem;
}

.article-content {
    font-size: 1.1rem;
    line-height: 1.8;
}

.article-content h2 {
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--primary-color);
}

.article-content h3 {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
}

.article-content a {
    color: var(--link-color);
    text-decoration: none;
    border-bottom: 1px solid var(--link-color);
}

.article-content a:hover {
    border-bottom: 2px solid var(--link-color);
}

.article-content ul, .article-content ol {
    margin-left: 2rem;
    margin-bottom: 1rem;
}

.article-content blockquote {
    border-left: 4px solid var(--secondary-color);
    padding-left: 1rem;
    margin: 1rem 0;
    font-style: italic;
    color: #555;
}

.article-footer {
    margin-top: 3rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
}

.tags {
    margin-top: 1rem;
}

.tag {
    display: inline-block;
    background-color: var(--border-color);
    padding: 0.3rem 0.6rem;
    border-radius: 3px;
    font-size: 0.85rem;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
}

.note-preview {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--border-color);
}

.note-preview h2 {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
}

.note-preview h2 a {
    color: var(--primary-color);
    text-decoration: none;
}

.note-preview h2 a:hover {
    text-decoration: underline;
}

.note-meta {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
}

.read-more {
    color: var(--link-color);
    text-decoration: none;
    font-weight: 500;
}

.site-footer {
    background-color: var(--primary-color);
    color: white;
    padding: 2rem 0;
    margin-top: 4rem;
    text-align: center;
}

.site-footer a {
    color: white;
    text-decoration: underline;
}

@media (max-width: 768px) {
    .article-header h1 {
        font-size: 2rem;
    }

    nav a {
        display: block;
        margin-bottom: 0.5rem;
    }
}
`;

  await fs.writeFile(path.join(OUTPUT_PATH, 'styles.css'), css);
  log('info', 'Generated styles.css');
}

// ============================================================================
// RSS Feed Generator
// ============================================================================

async function generateRSSFeed(notes) {
  const sortedNotes = [...notes].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 20);

  const items = sortedNotes.map(note => `
    <item>
      <title>${escapeXML(note.title)}</title>
      <link>https://${DOMAIN}/${note.filename}</link>
      <guid>https://${DOMAIN}/${note.filename}</guid>
      <pubDate>${new Date(note.date).toUTCString()}</pubDate>
      <description>${escapeXML(note.description || '')}</description>
    </item>
  `).join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXML(SITE_NAME)}</title>
    <link>https://${DOMAIN}</link>
    <description>${escapeXML(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://${DOMAIN}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  await fs.writeFile(path.join(OUTPUT_PATH, 'feed.xml'), rss);
  log('info', 'Generated RSS feed');
}

function escapeXML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ============================================================================
// Deployment Guide
// ============================================================================

async function generateDeploymentGuide() {
  const guide = `# Deployment Guide

Your static site has been built successfully in the \`public/\` directory.

## Deployment Options

### Option 1: Netlify (Recommended)

1. Install Netlify CLI:
   \`\`\`bash
   npm install -g netlify-cli
   \`\`\`

2. Deploy:
   \`\`\`bash
   cd public
   netlify deploy --prod
   \`\`\`

### Option 2: GitHub Pages

1. Create a new repository on GitHub
2. Push the \`public/\` directory contents to the repository
3. Enable GitHub Pages in repository settings
4. Your site will be live at: https://yourusername.github.io/repository-name

### Option 3: Vercel

1. Install Vercel CLI:
   \`\`\`bash
   npm install -g vercel
   \`\`\`

2. Deploy:
   \`\`\`bash
   cd public
   vercel --prod
   \`\`\`

### Option 4: Traditional Web Hosting

Upload the contents of the \`public/\` directory to your web host via FTP/SFTP.

## Custom Domain

Update \`config.json\` with your domain:

\`\`\`json
{
  "integrations": {
    "socialSharing": {
      "domain": "yourcustomdomain.com"
    }
  }
}
\`\`\`

## Rebuilding

Run the build script again to update your site:

\`\`\`bash
node build.js
\`\`\`

## Privacy Reminder

This site contains ONLY notes you explicitly tagged with "${SHARE_TAG}".
All personal information has been stripped according to your privacy settings.
Review your site before deploying!
`;

  await fs.writeFile(path.join(OUTPUT_PATH, 'DEPLOYMENT.md'), guide);
  log('info', 'Generated deployment guide');
}

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
  try {
    log('info', '=== Social Sharing Framework - Static Site Builder ===');

    const results = await buildSite();

    if (results) {
      log('info', '=== Build Summary ===');
      log('info', `Total files scanned: ${results.totalFiles}`);
      log('info', `Notes published: ${results.processedCount}`);
      log('info', `Notes skipped: ${results.skippedCount}`);
      log('info', `Output directory: ${results.outputPath}`);
      log('info', '\nTo deploy your site, see: public/DEPLOYMENT.md');
    }

    return results;
  } catch (err) {
    log('error', `Site build failed: ${err.message}`);
    throw err;
  }
}

// Run if called directly
if (require.main === module) {
  main()
    .then(() => {
      log('info', 'Site build finished successfully');
      process.exit(0);
    })
    .catch(err => {
      log('error', `Site build failed: ${err.message}`);
      console.error(err);
      process.exit(1);
    });
}

module.exports = { buildSite };
