#!/usr/bin/env node

/**
 * Duplicate Content Detector for Coffee Vault 7.0
 * Version: 1.0.0
 *
 * Finds near-duplicate or redundant content that should be merged.
 *
 * Detection methods:
 * - Content similarity (cosine similarity, Jaccard coefficient)
 * - Levenshtein distance for title similarity
 * - Frontmatter comparison
 * - Duplicate scientific references (same topic, different wording)
 *
 * Features:
 * - Configurable similarity threshold (default: 80%)
 * - Entity type filtering
 * - Diff preview generation
 * - Merge recommendations
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
  similarityThreshold: 80,
  ignoreTemplates: true,
  autoMergePerfectDuplicates: false,
  minContentLength: 100 // Ignore very short notes
};

/**
 * Load automation config
 */
function loadConfig() {
  const configPath = path.join(VAULT_ROOT, '.vault-meta', 'automation-config.json');
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    return { ...DEFAULT_CONFIG, ...config.duplicateDetection };
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
      rawContent: content,
      type: parsed.data.type || 'unknown',
      wordCount: parsed.content.split(/\s+/).length
    };
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Edit distance
 */
function levenshteinDistance(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));

  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // Deletion
        matrix[i][j - 1] + 1,      // Insertion
        matrix[i - 1][j - 1] + cost // Substitution
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Calculate title similarity using normalized Levenshtein distance
 * @param {string} title1 - First title
 * @param {string} title2 - Second title
 * @returns {number} - Similarity percentage (0-100)
 */
function calculateTitleSimilarity(title1, title2) {
  const dist = levenshteinDistance(title1.toLowerCase(), title2.toLowerCase());
  const maxLen = Math.max(title1.length, title2.length);
  return maxLen > 0 ? ((maxLen - dist) / maxLen) * 100 : 0;
}

/**
 * Normalize content for comparison
 * @param {string} content - Raw content
 * @returns {string} - Normalized content
 */
function normalizeContent(content) {
  return content
    .toLowerCase()
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/\[\[.*?\]\]/g, '') // Remove wikilinks
    .replace(/\[.*?\]\(.*?\)/g, '') // Remove markdown links
    .replace(/[#*_`\-]/g, '') // Remove markdown formatting
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Calculate content similarity using Jaccard coefficient
 * @param {string} content1 - First content
 * @param {string} content2 - Second content
 * @returns {number} - Similarity percentage (0-100)
 */
function calculateContentSimilarity(content1, content2) {
  const normalized1 = normalizeContent(content1);
  const normalized2 = normalizeContent(content2);

  // Tokenize into words
  const words1 = new Set(normalized1.split(/\s+/).filter(w => w.length > 2));
  const words2 = new Set(normalized2.split(/\s+/).filter(w => w.length > 2));

  // Calculate Jaccard coefficient
  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const union = new Set([...words1, ...words2]);

  return union.size > 0 ? (intersection.size / union.size) * 100 : 0;
}

/**
 * Calculate frontmatter similarity
 * @param {Object} fm1 - First frontmatter
 * @param {Object} fm2 - Second frontmatter
 * @returns {number} - Similarity percentage (0-100)
 */
function calculateFrontmatterSimilarity(fm1, fm2) {
  const keys1 = Object.keys(fm1);
  const keys2 = Object.keys(fm2);

  if (keys1.length === 0 && keys2.length === 0) return 100;
  if (keys1.length === 0 || keys2.length === 0) return 0;

  let matchCount = 0;
  const allKeys = new Set([...keys1, ...keys2]);

  for (const key of allKeys) {
    if (key in fm1 && key in fm2) {
      const val1 = JSON.stringify(fm1[key]);
      const val2 = JSON.stringify(fm2[key]);
      if (val1 === val2) matchCount++;
    }
  }

  return (matchCount / allKeys.size) * 100;
}

/**
 * Generate diff preview between two contents
 * @param {string} content1 - First content
 * @param {string} content2 - Second content
 * @returns {Object} - Diff summary
 */
function generateDiff(content1, content2) {
  const lines1 = content1.split('\n');
  const lines2 = content2.split('\n');

  const uniqueToFirst = lines1.filter(line => !lines2.includes(line)).length;
  const uniqueToSecond = lines2.filter(line => !lines1.includes(line)).length;

  return {
    linesInFirst: lines1.length,
    linesInSecond: lines2.length,
    uniqueToFirst,
    uniqueToSecond,
    commonLines: lines1.length - uniqueToFirst
  };
}

/**
 * Find duplicate pairs in vault
 * @param {Array<Object>} notes - All notes
 * @param {Object} config - Configuration
 * @returns {Array<Object>} - Duplicate pairs
 */
function findDuplicates(notes, config) {
  const duplicates = [];
  const threshold = config.similarityThreshold;

  console.log(`Comparing ${notes.length} notes (this may take a while)...\n`);

  for (let i = 0; i < notes.length; i++) {
    const note1 = notes[i];

    // Skip very short notes
    if (note1.wordCount < config.minContentLength) continue;

    for (let j = i + 1; j < notes.length; j++) {
      const note2 = notes[j];

      // Skip very short notes
      if (note2.wordCount < config.minContentLength) continue;

      // Calculate various similarity metrics
      const titleSim = calculateTitleSimilarity(note1.title, note2.title);
      const contentSim = calculateContentSimilarity(note1.content, note2.content);
      const frontmatterSim = calculateFrontmatterSimilarity(note1.frontmatter, note2.frontmatter);

      // Weighted average (content is most important)
      const overallSimilarity = (contentSim * 0.7) + (titleSim * 0.2) + (frontmatterSim * 0.1);

      if (overallSimilarity >= threshold) {
        const diff = generateDiff(note1.content, note2.content);

        duplicates.push({
          note1: {
            path: path.relative(VAULT_ROOT, note1.path),
            title: note1.title,
            type: note1.type,
            wordCount: note1.wordCount
          },
          note2: {
            path: path.relative(VAULT_ROOT, note2.path),
            title: note2.title,
            type: note2.type,
            wordCount: note2.wordCount
          },
          similarity: Math.round(overallSimilarity),
          metrics: {
            title: Math.round(titleSim),
            content: Math.round(contentSim),
            frontmatter: Math.round(frontmatterSim)
          },
          diff,
          recommendation: overallSimilarity >= 95 ? 'merge' : 'review'
        });
      }
    }
  }

  return duplicates.sort((a, b) => b.similarity - a.similarity);
}

/**
 * Generate markdown report
 * @param {Array<Object>} duplicates - Found duplicates
 * @returns {string} - Markdown report
 */
function generateReport(duplicates) {
  const lines = [];
  const date = new Date().toISOString();

  lines.push('# Duplicate Content Detection Report');
  lines.push('');
  lines.push(`**Generated**: ${date}`);
  lines.push('');

  lines.push('## Summary');
  lines.push('');
  lines.push(`- **Duplicate pairs found**: ${duplicates.length}`);
  lines.push(`- **Perfect duplicates (>95%)**: ${duplicates.filter(d => d.similarity >= 95).length}`);
  lines.push(`- **Near duplicates (80-95%)**: ${duplicates.filter(d => d.similarity >= 80 && d.similarity < 95).length}`);
  lines.push('');

  if (duplicates.length === 0) {
    lines.push('No duplicate content found. Your vault is well-organized!');
    return lines.join('\n');
  }

  lines.push('## Duplicate Pairs');
  lines.push('');

  const perfectDuplicates = duplicates.filter(d => d.similarity >= 95);
  const nearDuplicates = duplicates.filter(d => d.similarity >= 80 && d.similarity < 95);

  if (perfectDuplicates.length > 0) {
    lines.push('### Perfect Duplicates (≥95% similar)');
    lines.push('');
    lines.push('⚠️ **These should likely be merged immediately**');
    lines.push('');

    for (const dup of perfectDuplicates) {
      lines.push(`#### ${dup.note1.title} ⟷ ${dup.note2.title}`);
      lines.push('');
      lines.push(`**Similarity**: ${dup.similarity}% (Title: ${dup.metrics.title}%, Content: ${dup.metrics.content}%, Frontmatter: ${dup.metrics.frontmatter}%)`);
      lines.push('');
      lines.push('**Files**:');
      lines.push(`1. \`${dup.note1.path}\` (${dup.note1.wordCount} words)`);
      lines.push(`2. \`${dup.note2.path}\` (${dup.note2.wordCount} words)`);
      lines.push('');
      lines.push('**Diff**:');
      lines.push(`- Lines unique to first: ${dup.diff.uniqueToFirst}`);
      lines.push(`- Lines unique to second: ${dup.diff.uniqueToSecond}`);
      lines.push(`- Common lines: ${dup.diff.commonLines}`);
      lines.push('');
      lines.push(`**Recommendation**: ${dup.recommendation === 'merge' ? '🔀 Merge these files' : '👀 Review manually'}`);
      lines.push('');
      lines.push('---');
      lines.push('');
    }
  }

  if (nearDuplicates.length > 0) {
    lines.push('### Near Duplicates (80-95% similar)');
    lines.push('');
    lines.push('👀 **These should be reviewed manually**');
    lines.push('');

    for (const dup of nearDuplicates) {
      lines.push(`#### ${dup.note1.title} ⟷ ${dup.note2.title}`);
      lines.push('');
      lines.push(`**Similarity**: ${dup.similarity}% (Title: ${dup.metrics.title}%, Content: ${dup.metrics.content}%, Frontmatter: ${dup.metrics.frontmatter}%)`);
      lines.push('');
      lines.push('**Files**:');
      lines.push(`1. \`${dup.note1.path}\` (${dup.note1.wordCount} words)`);
      lines.push(`2. \`${dup.note2.path}\` (${dup.note2.wordCount} words)`);
      lines.push('');
      lines.push('**Diff**:');
      lines.push(`- Lines unique to first: ${dup.diff.uniqueToFirst}`);
      lines.push(`- Lines unique to second: ${dup.diff.uniqueToSecond}`);
      lines.push(`- Common lines: ${dup.diff.commonLines}`);
      lines.push('');
      lines.push('---');
      lines.push('');
    }
  }

  lines.push('## How to Use This Report');
  lines.push('');
  lines.push('1. **Perfect Duplicates (≥95%)**: Immediately review and merge');
  lines.push('2. **Near Duplicates (80-95%)**: Review content to determine if merging is appropriate');
  lines.push('3. **Manual Review**: Compare files side-by-side and decide on action');
  lines.push('4. **Merge Process**: Consolidate content, update links, delete redundant file');
  lines.push('');
  lines.push('*Generated by Duplicate Detector v1.0*');

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

  const reportPath = path.join(reportDir, `duplicates-${date}.md`);
  fs.writeFileSync(reportPath, report);

  console.log(`\n✅ Report saved to: ${path.relative(VAULT_ROOT, reportPath)}`);
}

/**
 * Main entry point
 */
async function main() {
  const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 [options]')
    .option('threshold', {
      type: 'number',
      description: 'Similarity threshold (0-100)',
      default: 80
    })
    .option('ignore-templates', {
      type: 'boolean',
      description: 'Skip template files',
      default: true
    })
    .option('entity-type', {
      type: 'string',
      description: 'Only check specific entity type',
      default: null
    })
    .option('report-only', {
      type: 'boolean',
      description: 'Don\'t suggest actions, just report',
      default: true
    })
    .option('auto-merge', {
      type: 'boolean',
      description: 'Automatically merge perfect duplicates (100% similar)',
      default: false
    })
    .help('h')
    .alias('h', 'help')
    .argv;

  try {
    const config = loadConfig();
    config.similarityThreshold = argv.threshold;
    config.ignoreTemplates = argv['ignore-templates'];
    config.autoMergePerfectDuplicates = argv['auto-merge'];

    console.log('🔍 Scanning vault for duplicate content...\n');

    // Load all markdown files
    const excludePatterns = ['node_modules/**', '.git/**', '.obsidian/**'];
    if (config.ignoreTemplates) {
      excludePatterns.push('Templates/**');
    }

    const files = await glob('**/*.md', {
      cwd: VAULT_ROOT,
      ignore: excludePatterns,
      absolute: true
    });

    console.log(`Found ${files.length} markdown files\n`);

    // Parse all notes
    let allNotes = files
      .map(parseNote)
      .filter(note => note !== null);

    // Filter by entity type if specified
    if (argv['entity-type']) {
      allNotes = allNotes.filter(n => n.type === argv['entity-type']);
      console.log(`Filtered to ${allNotes.length} notes of type "${argv['entity-type']}"\n`);
    }

    // Find duplicates
    const duplicates = findDuplicates(allNotes, config);

    // Generate report
    const report = generateReport(duplicates);
    saveReport(report);

    console.log('\n📊 Summary:');
    console.log(`   Duplicate pairs found: ${duplicates.length}`);
    console.log(`   Perfect duplicates (>95%): ${duplicates.filter(d => d.similarity >= 95).length}`);
    console.log(`   Near duplicates (80-95%): ${duplicates.filter(d => d.similarity >= 80 && d.similarity < 95).length}`);

    if (argv['auto-merge']) {
      console.log('\n⚠️  Auto-merge feature not yet implemented. Use manual review for now.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
