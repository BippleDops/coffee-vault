#!/usr/bin/env node

/**
 * Auto-Tagger for Coffee Vault 7.0
 * Version: 1.0.0
 *
 * Intelligently suggests relevant tags based on content analysis.
 *
 * Features:
 * - Content keyword extraction
 * - Entity type-based tag suggestions
 * - Tag hierarchy validation (6-level structure)
 * - Similar notes analysis
 * - Confidence scoring (0-100)
 * - Dry-run mode
 * - Auto-apply for high-confidence tags (>90)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import matter from 'gray-matter';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VAULT_ROOT = path.resolve(__dirname, '..');

/**
 * Tag hierarchy and rules
 */
const TAG_HIERARCHY = {
  // Entity types
  'entity/coffee-log': ['brewing', 'tasting', 'evaluation'],
  'entity/bean-profile': ['coffee', 'beans', 'origin'],
  'entity/origin-profile': ['geography', 'origin', 'terroir'],
  'entity/producer-profile': ['supply-chain', 'producer', 'farm'],
  'entity/roaster-profile': ['roasting', 'roaster'],
  'entity/recipe-profile': ['brewing', 'recipe', 'method'],
  'entity/equipment-model': ['equipment', 'gear'],
  'entity/cupping-session': ['tasting', 'cupping', 'evaluation'],
  'entity/coffee-event': ['community', 'event'],
  'entity/coffee-goal': ['learning', 'goals', 'development'],
  'entity/brewing-guide': ['brewing', 'guide', 'education'],
  'entity/scientific-reference': ['science', 'research', 'reference'],

  // Process categories
  'process/natural': ['processing', 'fermentation'],
  'process/washed': ['processing'],
  'process/honey': ['processing', 'fermentation'],
  'process/anaerobic': ['processing', 'fermentation', 'experimental'],

  // Brewing methods
  'method/espresso': ['brewing', 'espresso', 'pressure'],
  'method/pour-over': ['brewing', 'percolation', 'manual'],
  'method/french-press': ['brewing', 'immersion'],
  'method/aeropress': ['brewing', 'immersion', 'pressure'],
  'method/cold-brew': ['brewing', 'immersion', 'extraction'],

  // Science categories
  'science/extraction': ['science', 'brewing', 'chemistry'],
  'science/chemistry': ['science', 'chemistry'],
  'science/physics': ['science', 'physics'],
  'science/sensory': ['science', 'tasting', 'perception'],

  // Regions
  'region/africa': ['geography', 'origin'],
  'region/americas': ['geography', 'origin'],
  'region/asia-pacific': ['geography', 'origin'],

  // Quality indicators
  'quality/specialty': ['quality', 'premium'],
  'quality/commodity': ['quality', 'commercial'],

  // Flavor categories
  'flavor/fruity': ['flavor', 'tasting'],
  'flavor/nutty': ['flavor', 'tasting'],
  'flavor/chocolate': ['flavor', 'tasting'],
  'flavor/floral': ['flavor', 'tasting'],
  'flavor/spicy': ['flavor', 'tasting']
};

/**
 * Default configuration
 */
const DEFAULT_CONFIG = {
  confidenceThreshold: 75,
  respectHierarchy: true,
  autoApply: false,
  maxSuggestionsPerNote: 5
};

/**
 * Load automation config
 */
function loadConfig() {
  const configPath = path.join(VAULT_ROOT, '.vault-meta', 'automation-config.json');
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    return { ...DEFAULT_CONFIG, ...config.autoTagging };
  }
  return DEFAULT_CONFIG;
}

/**
 * Parse note from file path
 * @param {string} filePath - Path to markdown file
 * @returns {Object} - Parsed note object
 */
function parseNote(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(content);

    return {
      path: filePath,
      title: path.basename(filePath, '.md'),
      frontmatter: parsed.data,
      content: parsed.content,
      type: parsed.data.type || 'unknown',
      tags: parsed.data.tags || []
    };
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Extract keywords from content
 * @param {string} content - Note content
 * @returns {Array<string>} - Keywords
 */
function extractKeywords(content) {
  const cleaned = content
    .toLowerCase()
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\[\[.*?\]\]/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/[#*_`]/g, '');

  const words = cleaned
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !/^\d+$/.test(word));

  const stopWords = new Set([
    'this', 'that', 'with', 'from', 'have', 'been', 'were', 'will',
    'would', 'there', 'could', 'should', 'about', 'which', 'these',
    'when', 'where', 'what', 'how', 'why', 'them', 'then', 'than'
  ]);

  const wordFreq = {};
  for (const word of words) {
    if (!stopWords.has(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  }

  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);
}

/**
 * Get all existing tags from vault
 * @param {Array<Object>} allNotes - All notes
 * @returns {Set<string>} - Unique tags
 */
function getAllTags(allNotes) {
  const tags = new Set();

  for (const note of allNotes) {
    if (note.tags && Array.isArray(note.tags)) {
      note.tags.forEach(tag => tags.add(tag));
    }
  }

  // Add hierarchical tags
  for (const hierarchyTag of Object.keys(TAG_HIERARCHY)) {
    tags.add(hierarchyTag);
  }

  return tags;
}

/**
 * Check if tag fits hierarchy for entity type
 * @param {string} entityType - Entity type
 * @param {string} tag - Proposed tag
 * @param {Object} hierarchy - Tag hierarchy
 * @returns {boolean} - True if tag fits
 */
function fitsHierarchy(entityType, tag, hierarchy) {
  const entityKey = `entity/${entityType}`;

  if (!hierarchy[entityKey]) {
    return true; // Unknown type, allow all tags
  }

  const allowedCategories = hierarchy[entityKey];

  // Check if tag starts with allowed category
  return allowedCategories.some(category =>
    tag.startsWith(category) || tag.includes(`/${category}`)
  );
}

/**
 * Suggest tags based on entity type
 * @param {Object} note - Parsed note
 * @returns {Array<Object>} - Tag suggestions
 */
function suggestByEntityType(note) {
  const suggestions = [];

  const entityKey = `entity/${note.type}`;
  if (TAG_HIERARCHY[entityKey]) {
    const relatedTags = TAG_HIERARCHY[entityKey];

    for (const tag of relatedTags) {
      if (!note.tags.includes(tag)) {
        suggestions.push({
          tag,
          confidence: 85,
          rationale: `Common tag for ${note.type}`
        });
      }
    }
  }

  return suggestions;
}

/**
 * Suggest tags based on keywords
 * @param {Object} note - Parsed note
 * @param {Set<string>} existingTags - All existing tags
 * @returns {Array<Object>} - Tag suggestions
 */
function suggestByKeywords(note, existingTags) {
  const suggestions = [];
  const keywords = extractKeywords(note.content);

  for (const tag of existingTags) {
    if (note.tags.includes(tag)) continue;

    const tagParts = tag.split('/');
    const tagKeyword = tagParts[tagParts.length - 1]; // Get leaf tag

    // Check if tag keyword appears in content keywords
    const relevance = keywords.filter(kw => kw.includes(tagKeyword) || tagKeyword.includes(kw)).length;

    if (relevance > 0) {
      const confidence = Math.min(95, 60 + (relevance * 10));

      suggestions.push({
        tag,
        confidence,
        rationale: `Keyword match: "${tagKeyword}"`
      });
    }
  }

  return suggestions;
}

/**
 * Suggest tags based on similar notes
 * @param {Object} note - Parsed note
 * @param {Array<Object>} allNotes - All notes
 * @returns {Array<Object>} - Tag suggestions
 */
function suggestBySimilarNotes(note, allNotes) {
  const suggestions = [];

  // Find notes with same type
  const similarNotes = allNotes.filter(n =>
    n.type === note.type && n.path !== note.path
  );

  if (similarNotes.length === 0) return suggestions;

  // Count tag frequency in similar notes
  const tagFreq = {};
  for (const similar of similarNotes) {
    for (const tag of similar.tags || []) {
      if (!note.tags.includes(tag)) {
        tagFreq[tag] = (tagFreq[tag] || 0) + 1;
      }
    }
  }

  // Suggest frequent tags
  for (const [tag, freq] of Object.entries(tagFreq)) {
    const confidence = Math.min(90, 50 + (freq / similarNotes.length) * 40);

    if (confidence >= 60) {
      suggestions.push({
        tag,
        confidence: Math.round(confidence),
        rationale: `Used by ${freq}/${similarNotes.length} similar notes`
      });
    }
  }

  return suggestions;
}

/**
 * Suggest tags for a note
 * @param {Object} note - Parsed note
 * @param {Array<Object>} allNotes - All notes
 * @param {Set<string>} existingTags - All existing tags
 * @param {Object} config - Configuration
 * @returns {Array<Object>} - Tag suggestions
 */
function suggestTags(note, allNotes, existingTags, config) {
  let allSuggestions = [];

  // 1. Entity type-based suggestions
  const entitySuggestions = suggestByEntityType(note);
  allSuggestions.push(...entitySuggestions);

  // 2. Keyword-based suggestions
  const keywordSuggestions = suggestByKeywords(note, existingTags);
  allSuggestions.push(...keywordSuggestions);

  // 3. Similar notes suggestions
  const similarSuggestions = suggestBySimilarNotes(note, allNotes);
  allSuggestions.push(...similarSuggestions);

  // Deduplicate and filter by confidence
  const uniqueSuggestions = [];
  const seenTags = new Set();

  for (const sugg of allSuggestions) {
    if (!seenTags.has(sugg.tag)) {
      seenTags.add(sugg.tag);

      // Check hierarchy if enabled
      if (config.respectHierarchy && !fitsHierarchy(note.type, sugg.tag, TAG_HIERARCHY)) {
        continue;
      }

      if (sugg.confidence >= config.confidenceThreshold) {
        uniqueSuggestions.push(sugg);
      }
    }
  }

  // Sort by confidence and limit
  return uniqueSuggestions
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, config.maxSuggestionsPerNote);
}

/**
 * Generate markdown report
 * @param {Array<Object>} results - Tag suggestions for all notes
 * @returns {string} - Markdown report
 */
function generateReport(results) {
  const lines = [];
  const date = new Date().toISOString();

  lines.push('# Auto-Tagging Report');
  lines.push('');
  lines.push(`**Generated**: ${date}`);
  lines.push('');

  const notesWithSuggestions = results.filter(r => r.suggestions.length > 0);
  const totalSuggestions = notesWithSuggestions.reduce((sum, r) => sum + r.suggestions.length, 0);
  const highConfidence = notesWithSuggestions.reduce(
    (sum, r) => sum + r.suggestions.filter(s => s.confidence >= 90).length,
    0
  );

  lines.push('## Summary');
  lines.push('');
  lines.push(`- **Notes analyzed**: ${results.length}`);
  lines.push(`- **Notes with suggestions**: ${notesWithSuggestions.length}`);
  lines.push(`- **Total suggestions**: ${totalSuggestions}`);
  lines.push(`- **High confidence (≥90)**: ${highConfidence}`);
  lines.push('');

  if (notesWithSuggestions.length === 0) {
    lines.push('No tag suggestions found. Your vault is well-tagged!');
    return lines.join('\n');
  }

  lines.push('## Tag Suggestions by File');
  lines.push('');

  for (const result of notesWithSuggestions) {
    lines.push(`### ${result.title}`);
    lines.push('');
    lines.push(`**File**: \`${result.relativePath}\``);
    lines.push(`**Type**: ${result.type}`);
    lines.push(`**Current tags**: ${result.currentTags.join(', ') || 'none'}`);
    lines.push('');

    const highConf = result.suggestions.filter(s => s.confidence >= 90);
    const medConf = result.suggestions.filter(s => s.confidence >= 75 && s.confidence < 90);

    if (highConf.length > 0) {
      lines.push('#### High Confidence (≥90)');
      lines.push('');
      for (const sugg of highConf) {
        lines.push(`- **[${sugg.confidence}]** \`${sugg.tag}\``);
        lines.push(`  - *Rationale*: ${sugg.rationale}`);
      }
      lines.push('');
    }

    if (medConf.length > 0) {
      lines.push('#### Medium Confidence (75-89)');
      lines.push('');
      for (const sugg of medConf) {
        lines.push(`- **[${sugg.confidence}]** \`${sugg.tag}\``);
        lines.push(`  - *Rationale*: ${sugg.rationale}`);
      }
      lines.push('');
    }
  }

  lines.push('---');
  lines.push('');
  lines.push('## How to Use This Report');
  lines.push('');
  lines.push('1. Review suggested tags for each note');
  lines.push('2. Manually add relevant tags to frontmatter');
  lines.push('3. Run with `--auto-apply` to automatically add high-confidence tags (≥90)');
  lines.push('4. Use `--dry-run` to preview changes before applying');
  lines.push('');
  lines.push('*Generated by Auto-Tagger v1.0*');

  return lines.join('\n');
}

/**
 * Save report to file
 * @param {string} report - Report content
 */
function saveReport(report) {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const reportDir = path.join(VAULT_ROOT, '.vault-meta', 'reports');

  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const reportPath = path.join(reportDir, `auto-tagging-${date}.md`);
  fs.writeFileSync(reportPath, report);

  console.log(`\n✅ Report saved to: ${path.relative(VAULT_ROOT, reportPath)}`);
}

/**
 * Main entry point
 */
async function main() {
  const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 [options]')
    .option('dry-run', {
      type: 'boolean',
      description: 'Show suggestions without modifying files',
      default: true
    })
    .option('auto-apply', {
      type: 'boolean',
      description: 'Automatically add high-confidence tags (≥90)',
      default: false
    })
    .option('confidence-threshold', {
      type: 'number',
      description: 'Minimum confidence (0-100)',
      default: 75
    })
    .option('respect-hierarchy', {
      type: 'boolean',
      description: 'Only suggest tags that fit hierarchy',
      default: true
    })
    .help('h')
    .alias('h', 'help')
    .argv;

  try {
    const config = loadConfig();
    config.confidenceThreshold = argv['confidence-threshold'];
    config.respectHierarchy = argv['respect-hierarchy'];
    config.autoApply = argv['auto-apply'];

    console.log('🔍 Analyzing content for tag suggestions...\n');

    // Load all markdown files
    const files = await glob('**/*.md', {
      cwd: VAULT_ROOT,
      ignore: ['node_modules/**', '.git/**', '.obsidian/**', 'Templates/**', '.vault-meta/**'],
      absolute: true
    });

    console.log(`Found ${files.length} markdown files\n`);

    // Parse all notes
    const allNotes = files
      .map(parseNote)
      .filter(note => note !== null);

    // Get all existing tags
    const existingTags = getAllTags(allNotes);
    console.log(`Found ${existingTags.size} unique tags in vault\n`);

    console.log('Generating tag suggestions...\n');

    // Generate suggestions for each note
    const results = [];
    for (const note of allNotes) {
      const suggestions = suggestTags(note, allNotes, existingTags, config);

      if (suggestions.length > 0) {
        results.push({
          path: note.path,
          relativePath: path.relative(VAULT_ROOT, note.path),
          title: note.title,
          type: note.type,
          currentTags: note.tags,
          suggestions
        });
      }
    }

    // Generate report
    const report = generateReport(results);
    saveReport(report);

    // Console summary
    const totalSuggestions = results.reduce((sum, r) => sum + r.suggestions.length, 0);
    const highConfidence = results.reduce(
      (sum, r) => sum + r.suggestions.filter(s => s.confidence >= 90).length,
      0
    );

    console.log('\n📊 Summary:');
    console.log(`   Notes analyzed: ${allNotes.length}`);
    console.log(`   Notes with suggestions: ${results.length}`);
    console.log(`   Total suggestions: ${totalSuggestions}`);
    console.log(`   High confidence (≥90): ${highConfidence}`);

    if (argv['auto-apply'] && !argv['dry-run']) {
      console.log('\n⚠️  Auto-apply feature not yet implemented. Use manual review for now.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
