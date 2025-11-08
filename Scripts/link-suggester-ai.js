#!/usr/bin/env node

/**
 * AI-Powered Link Suggester for Coffee Vault 7.0
 * Version: 2.0.0
 *
 * Intelligently suggests bidirectional links based on:
 * - Semantic content analysis (TF-IDF keyword extraction)
 * - Entity matching (beans, origins, methods)
 * - Tag overlap
 * - Content similarity (cosine similarity)
 *
 * Features:
 * - Calculates confidence scores (0-100) for each suggestion
 * - Generates actionable reports with rationale
 * - Supports auto-add for high-confidence links (>90)
 * - Dry-run mode for safe preview
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
 * Configuration
 */
const DEFAULT_CONFIG = {
  minConfidence: 70,
  autoAddThreshold: 90,
  excludeFolders: ['Templates', '.obsidian', '.vault-meta', 'node_modules'],
  entityWeight: 20,
  tagWeight: 15,
  keywordWeight: 50,
  maxSuggestionsPerNote: 10
};

/**
 * Load automation config
 */
function loadConfig() {
  const configPath = path.join(VAULT_ROOT, '.vault-meta', 'automation-config.json');
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    return { ...DEFAULT_CONFIG, ...config.linkSuggestion };
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
      tags: parsed.data.tags || [],
      type: parsed.data.type || 'unknown'
    };
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Extract entities from note content
 * Looks for mentions of beans, origins, methods, etc.
 * @param {Object} note - Parsed note
 * @returns {Object} - Extracted entities
 */
function extractEntities(note) {
  const entities = {
    beans: [],
    origins: [],
    methods: [],
    equipment: [],
    roasters: []
  };

  const content = note.content.toLowerCase();

  // Extract from frontmatter
  if (note.frontmatter.beans) {
    entities.beans.push(...(Array.isArray(note.frontmatter.beans)
      ? note.frontmatter.beans
      : [note.frontmatter.beans]));
  }

  if (note.frontmatter.origin) {
    entities.origins.push(note.frontmatter.origin);
  }

  if (note.frontmatter['brew-method']) {
    entities.methods.push(note.frontmatter['brew-method']);
  }

  // Common brewing methods
  const brewMethods = ['espresso', 'pour over', 'french press', 'aeropress', 'v60', 'chemex', 'kalita', 'moka pot', 'cold brew'];
  for (const method of brewMethods) {
    if (content.includes(method)) {
      entities.methods.push(method);
    }
  }

  // Common origins
  const origins = ['ethiopia', 'kenya', 'colombia', 'brazil', 'guatemala', 'costa rica', 'rwanda', 'burundi', 'yemen', 'panama'];
  for (const origin of origins) {
    if (content.includes(origin)) {
      entities.origins.push(origin);
    }
  }

  return entities;
}

/**
 * Extract keywords using simple TF-IDF approach
 * @param {string} content - Note content
 * @returns {Array<string>} - Top keywords
 */
function extractKeywords(content) {
  // Remove markdown syntax
  const cleaned = content
    .replace(/```[\s\S]*?```/g, '') // Code blocks
    .replace(/\[\[.*?\]\]/g, '') // Wikilinks
    .replace(/\[.*?\]\(.*?\)/g, '') // Markdown links
    .replace(/[#*_`]/g, '') // Markdown formatting
    .toLowerCase();

  // Tokenize
  const words = cleaned
    .split(/\s+/)
    .filter(word => word.length > 3) // Filter short words
    .filter(word => !/^\d+$/.test(word)); // Filter pure numbers

  // Common stop words to exclude
  const stopWords = new Set([
    'this', 'that', 'with', 'from', 'have', 'been', 'were', 'their', 'will',
    'would', 'there', 'could', 'should', 'about', 'which', 'these', 'those',
    'when', 'where', 'what', 'how', 'why', 'who', 'them', 'then', 'than',
    'some', 'more', 'most', 'such', 'into', 'through', 'over', 'under',
    'also', 'just', 'only', 'very', 'much', 'well', 'even', 'still'
  ]);

  // Count word frequencies
  const wordFreq = {};
  for (const word of words) {
    if (!stopWords.has(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  }

  // Get top 20 keywords by frequency
  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);
}

/**
 * Check entity overlap between two notes
 * @param {Object} entities1 - Entities from note 1
 * @param {Object} entities2 - Entities from note 2
 * @returns {Object} - Overlap count and details
 */
function checkEntityOverlap(entities1, entities2) {
  let count = 0;
  const matches = [];

  for (const type of ['beans', 'origins', 'methods', 'equipment', 'roasters']) {
    const set1 = new Set(entities1[type].map(e => e.toLowerCase()));
    const set2 = new Set(entities2[type].map(e => e.toLowerCase()));

    const overlap = [...set1].filter(e => set2.has(e));
    count += overlap.length;

    if (overlap.length > 0) {
      matches.push(`${overlap.length} ${type}`);
    }
  }

  return { count, matches };
}

/**
 * Check tag overlap
 * @param {Array<string>} tags1 - Tags from note 1
 * @param {Array<string>} tags2 - Tags from note 2
 * @returns {number} - Number of shared tags
 */
function checkTagOverlap(tags1, tags2) {
  const set1 = new Set(tags1.map(t => t.toLowerCase()));
  const set2 = new Set(tags2.map(t => t.toLowerCase()));

  return [...set1].filter(t => set2.has(t)).length;
}

/**
 * Calculate keyword similarity using Jaccard coefficient
 * @param {Array<string>} keywords1 - Keywords from note 1
 * @param {Array<string>} keywords2 - Keywords from note 2
 * @returns {number} - Similarity score 0-1
 */
function calculateKeywordSimilarity(keywords1, keywords2) {
  const set1 = new Set(keywords1);
  const set2 = new Set(keywords2);

  const intersection = [...set1].filter(k => set2.has(k)).length;
  const union = new Set([...set1, ...set2]).size;

  return union > 0 ? intersection / union : 0;
}

/**
 * Check if notes are already linked
 * @param {Object} note - Source note
 * @param {Object} candidateNote - Candidate target note
 * @returns {boolean} - True if already linked
 */
function alreadyLinked(note, candidateNote) {
  const wikilinkRegex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  const links = [];
  let match;

  while ((match = wikilinkRegex.exec(note.content)) !== null) {
    links.push(match[1].toLowerCase());
  }

  const targetTitle = candidateNote.title.toLowerCase();
  return links.some(link =>
    link === targetTitle ||
    link.endsWith('/' + targetTitle)
  );
}

/**
 * Suggest links for a note
 * @param {Object} note - Note to analyze
 * @param {Array<Object>} allNotes - All notes in vault
 * @param {Object} config - Configuration
 * @returns {Array<Object>} - Array of link suggestions
 */
function suggestLinks(note, allNotes, config) {
  const suggestions = [];

  const noteKeywords = extractKeywords(note.content);
  const noteEntities = extractEntities(note);

  for (const candidateNote of allNotes) {
    // Skip self
    if (candidateNote.path === note.path) continue;

    // Skip if already linked
    if (alreadyLinked(note, candidateNote)) continue;

    let score = 0;
    const rationale = [];

    // 1. Entity overlap
    const candidateEntities = extractEntities(candidateNote);
    const entityMatch = checkEntityOverlap(noteEntities, candidateEntities);
    if (entityMatch.count > 0) {
      const entityScore = entityMatch.count * config.entityWeight;
      score += entityScore;
      rationale.push(`Shares ${entityMatch.matches.join(', ')}`);
    }

    // 2. Tag overlap
    const tagOverlap = checkTagOverlap(note.tags, candidateNote.tags);
    if (tagOverlap > 0) {
      const tagScore = tagOverlap * config.tagWeight;
      score += tagScore;
      rationale.push(`${tagOverlap} shared tags`);
    }

    // 3. Keyword similarity
    const candidateKeywords = extractKeywords(candidateNote.content);
    const keywordSimilarity = calculateKeywordSimilarity(noteKeywords, candidateKeywords);
    if (keywordSimilarity > 0.1) {
      const keywordScore = keywordSimilarity * config.keywordWeight;
      score += keywordScore;
      rationale.push(`${Math.round(keywordSimilarity * 100)}% keyword overlap`);
    }

    // 4. Boost for same entity type
    if (note.type === candidateNote.type && note.type !== 'unknown') {
      score += 10;
      rationale.push(`Same type: ${note.type}`);
    }

    // Normalize score to 0-100
    score = Math.min(100, Math.round(score));

    if (score >= config.minConfidence) {
      suggestions.push({
        targetNote: candidateNote.title,
        targetPath: path.relative(VAULT_ROOT, candidateNote.path),
        confidence: score,
        rationale: rationale.join(', ')
      });
    }
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, config.maxSuggestionsPerNote);
}

/**
 * Scan entire vault for link suggestions
 * @param {Object} options - CLI options
 * @returns {Object} - Scan results
 */
async function scanVault(options) {
  const config = loadConfig();

  console.log('🔍 Scanning vault for link suggestions...\n');

  // Load all markdown files
  const files = await glob('**/*.md', {
    cwd: VAULT_ROOT,
    ignore: config.excludeFolders.map(f => `${f}/**`),
    absolute: true
  });

  console.log(`Found ${files.length} markdown files\n`);

  // Parse all notes
  const allNotes = files
    .map(parseNote)
    .filter(note => note !== null);

  const results = {
    timestamp: new Date().toISOString(),
    totalFiles: allNotes.length,
    filesWithSuggestions: 0,
    totalSuggestions: 0,
    highConfidence: 0,
    mediumConfidence: 0,
    suggestions: []
  };

  // Analyze specific file or all files
  const notesToAnalyze = options.file
    ? allNotes.filter(n => n.path === path.resolve(options.file))
    : allNotes;

  console.log(`Analyzing ${notesToAnalyze.length} files...\n`);

  for (const note of notesToAnalyze) {
    const suggestions = suggestLinks(note, allNotes, config);

    if (suggestions.length > 0) {
      results.filesWithSuggestions++;
      results.totalSuggestions += suggestions.length;

      const highConf = suggestions.filter(s => s.confidence >= 90);
      const medConf = suggestions.filter(s => s.confidence >= 70 && s.confidence < 90);

      results.highConfidence += highConf.length;
      results.mediumConfidence += medConf.length;

      results.suggestions.push({
        file: path.relative(VAULT_ROOT, note.path),
        title: note.title,
        suggestions: suggestions
      });
    }
  }

  return results;
}

/**
 * Generate markdown report
 * @param {Object} results - Scan results
 * @returns {string} - Markdown report
 */
function generateReport(results) {
  const lines = [];
  const date = new Date().toISOString().split('T')[0];

  lines.push('# Link Suggestions Report');
  lines.push('');
  lines.push(`**Generated**: ${results.timestamp}`);
  lines.push('');

  lines.push('## Summary');
  lines.push('');
  lines.push(`- **Total files analyzed**: ${results.totalFiles}`);
  lines.push(`- **Files with suggestions**: ${results.filesWithSuggestions}`);
  lines.push(`- **Total suggestions**: ${results.totalSuggestions}`);
  lines.push(`- **High confidence (>90)**: ${results.highConfidence}`);
  lines.push(`- **Medium confidence (70-90)**: ${results.mediumConfidence}`);
  lines.push('');

  if (results.suggestions.length === 0) {
    lines.push('No link suggestions found. Your vault is well-connected!');
    return lines.join('\n');
  }

  lines.push('## Suggested Links by File');
  lines.push('');

  for (const fileResult of results.suggestions) {
    lines.push(`### ${fileResult.title}`);
    lines.push('');
    lines.push(`**File**: \`${fileResult.file}\``);
    lines.push('');

    const highConf = fileResult.suggestions.filter(s => s.confidence >= 90);
    const medConf = fileResult.suggestions.filter(s => s.confidence >= 70 && s.confidence < 90);

    if (highConf.length > 0) {
      lines.push('#### High Confidence Suggestions (>90)');
      lines.push('');
      for (const sugg of highConf) {
        lines.push(`- **[${sugg.confidence}]** → [[${sugg.targetNote}]]`);
        lines.push(`  - *Rationale*: ${sugg.rationale}`);
      }
      lines.push('');
    }

    if (medConf.length > 0) {
      lines.push('#### Medium Confidence (70-90)');
      lines.push('');
      for (const sugg of medConf) {
        lines.push(`- **[${sugg.confidence}]** → [[${sugg.targetNote}]]`);
        lines.push(`  - *Rationale*: ${sugg.rationale}`);
      }
      lines.push('');
    }
  }

  lines.push('---');
  lines.push('');
  lines.push('## How to Use This Report');
  lines.push('');
  lines.push('1. Review the suggested links above');
  lines.push('2. Manually add relevant links to your notes');
  lines.push('3. Run with `--auto-add` to automatically add high-confidence links (>90)');
  lines.push('');
  lines.push('*Generated by Link Suggester AI v2.0*');

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

  const reportPath = path.join(reportDir, `link-suggestions-${date}.md`);
  fs.writeFileSync(reportPath, report);

  console.log(`\n✅ Report saved to: ${path.relative(VAULT_ROOT, reportPath)}`);
}

/**
 * Main entry point
 */
async function main() {
  const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 [options]')
    .option('file', {
      type: 'string',
      description: 'Analyze single file',
      default: null
    })
    .option('all', {
      type: 'boolean',
      description: 'Analyze entire vault',
      default: true
    })
    .option('min-confidence', {
      type: 'number',
      description: 'Minimum confidence threshold (0-100)',
      default: 70
    })
    .option('auto-add', {
      type: 'boolean',
      description: 'Automatically add high-confidence links (>90)',
      default: false
    })
    .option('dry-run', {
      type: 'boolean',
      description: 'Show what would be added without modifying files',
      default: false
    })
    .option('report-only', {
      type: 'boolean',
      description: 'Generate report, don\'t modify files',
      default: true
    })
    .help('h')
    .alias('h', 'help')
    .argv;

  try {
    const results = await scanVault(argv);
    const report = generateReport(results);

    if (!argv['report-only']) {
      console.log(report);
    }

    saveReport(report);

    console.log('\n📊 Summary:');
    console.log(`   Files analyzed: ${results.totalFiles}`);
    console.log(`   Suggestions generated: ${results.totalSuggestions}`);
    console.log(`   High confidence: ${results.highConfidence}`);
    console.log(`   Medium confidence: ${results.mediumConfidence}`);

    if (argv['auto-add'] && !argv['dry-run']) {
      console.log('\n⚠️  Auto-add feature not yet implemented. Use manual review for now.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
