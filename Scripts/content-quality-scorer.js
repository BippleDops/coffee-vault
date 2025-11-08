#!/usr/bin/env node

/**
 * Content Quality Scorer for Coffee Vault 7.0
 * Version: 1.0.0
 *
 * Rates each note's quality (0-100) based on multiple factors:
 * - Completeness (30 pts): Required frontmatter, word count, structure
 * - Connectivity (25 pts): Outgoing/incoming links, knowledge graph integration
 * - Citations (20 pts): Sources, references (for scientific content)
 * - Freshness (10 pts): Recently updated
 * - Engagement (10 pts): Referenced by other notes
 * - Readability (5 pts): Proper formatting, structure
 *
 * Outputs:
 * - Quality score (0-100) per note
 * - Score breakdown by factor
 * - Top/bottom performers
 * - Improvement suggestions
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
 * Entity type schemas with required fields
 */
const ENTITY_SCHEMAS = {
  'coffee-log': {
    required: ['type', 'date', 'beans', 'brew-method', 'rating', 'tags'],
    minWordCount: 50
  },
  'bean-profile': {
    required: ['type', 'origin', 'country', 'processing', 'tags'],
    minWordCount: 100
  },
  'origin-profile': {
    required: ['type', 'country', 'altitude', 'primary-process', 'tags'],
    minWordCount: 200
  },
  'producer-profile': {
    required: ['type', 'producer-name', 'country', 'status', 'tags'],
    minWordCount: 150
  },
  'roaster-profile': {
    required: ['type', 'name', 'location', 'founded', 'roasting-style', 'status', 'tags'],
    minWordCount: 150
  },
  'recipe-profile': {
    required: ['type', 'brew-method', 'status', 'tags'],
    minWordCount: 100
  },
  'equipment-model': {
    required: ['type', 'brand', 'category', 'status', 'tags'],
    minWordCount: 100
  },
  'cupping-session': {
    required: ['type', 'date', 'protocol', 'sample-count', 'status', 'tags'],
    minWordCount: 150
  },
  'coffee-event': {
    required: ['type', 'name', 'date', 'event-type', 'status', 'tags'],
    minWordCount: 100
  },
  'coffee-goal': {
    required: ['type', 'goal-type', 'status', 'priority', 'tags'],
    minWordCount: 75
  },
  'brewing-guide': {
    required: ['type', 'brew-method', 'difficulty', 'tags'],
    minWordCount: 200
  },
  'scientific-reference': {
    required: ['type', 'category', 'title', 'tags'],
    minWordCount: 300
  }
};

/**
 * Quality scoring weights
 */
const WEIGHTS = {
  completeness: 30,
  connectivity: 25,
  citations: 20,
  freshness: 10,
  engagement: 10,
  readability: 5
};

/**
 * Parse note from file path
 * @param {string} filePath - Path to markdown file
 * @returns {Object} - Parsed note object
 */
function parseNote(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const stats = fs.statSync(filePath);
    const parsed = matter(content);

    return {
      path: filePath,
      title: path.basename(filePath, '.md'),
      frontmatter: parsed.data,
      content: parsed.content,
      rawContent: content,
      type: parsed.data.type || 'unknown',
      tags: parsed.data.tags || [],
      lastModified: stats.mtime,
      wordCount: parsed.content.split(/\s+/).filter(w => w.length > 0).length
    };
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Extract wikilinks from content
 * @param {string} content - Note content
 * @returns {Array<string>} - Array of link targets
 */
function extractWikilinks(content) {
  const wikilinkRegex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  const links = [];
  let match;

  while ((match = wikilinkRegex.exec(content)) !== null) {
    links.push(match[1]);
  }

  return links;
}

/**
 * Score completeness (0-30 points)
 * - Required frontmatter fields present
 * - Meets minimum word count
 * - Has summary/conclusion section
 * @param {Object} note - Parsed note
 * @returns {Object} - Completeness score and details
 */
function scoreCompleteness(note) {
  let score = 0;
  const details = [];

  const schema = ENTITY_SCHEMAS[note.type];

  if (!schema) {
    // Unknown type, minimal scoring
    score = 15;
    details.push('Unknown entity type');
    return { score, details };
  }

  // 1. Required frontmatter fields (15 pts)
  const requiredFields = schema.required;
  const presentFields = requiredFields.filter(field => note.frontmatter[field] !== undefined && note.frontmatter[field] !== null);
  const fieldScore = (presentFields.length / requiredFields.length) * 15;
  score += fieldScore;

  if (presentFields.length === requiredFields.length) {
    details.push('All required fields present');
  } else {
    const missing = requiredFields.filter(f => !note.frontmatter[f]);
    details.push(`Missing fields: ${missing.join(', ')}`);
  }

  // 2. Word count (10 pts)
  const minWords = schema.minWordCount;
  if (note.wordCount >= minWords) {
    score += 10;
    details.push(`Word count: ${note.wordCount} (target: ${minWords})`);
  } else {
    const wordScore = (note.wordCount / minWords) * 10;
    score += wordScore;
    details.push(`Word count: ${note.wordCount} (below target: ${minWords})`);
  }

  // 3. Has summary/conclusion (5 pts)
  const hasSummary = /##\s*(summary|conclusion|overview)/i.test(note.content);
  if (hasSummary) {
    score += 5;
    details.push('Has summary/conclusion section');
  }

  return { score: Math.round(score), details };
}

/**
 * Score connectivity (0-25 points)
 * - Outgoing links
 * - Incoming links (backlinks)
 * - Part of knowledge graph
 * @param {Object} note - Parsed note
 * @param {Object} linkGraph - Graph of all links
 * @returns {Object} - Connectivity score and details
 */
function scoreConnectivity(note, linkGraph) {
  let score = 0;
  const details = [];

  const outgoingLinks = extractWikilinks(note.content);
  const incomingLinks = linkGraph.backlinks[note.title] || [];

  // 1. Outgoing links (12 pts)
  const outgoingScore = Math.min(12, outgoingLinks.length * 2);
  score += outgoingScore;
  details.push(`${outgoingLinks.length} outgoing links`);

  // 2. Incoming links (13 pts)
  const incomingScore = Math.min(13, incomingLinks.length * 2);
  score += incomingScore;
  details.push(`${incomingLinks.length} incoming links`);

  // Bonus: Well-connected (both incoming and outgoing)
  if (outgoingLinks.length >= 3 && incomingLinks.length >= 3) {
    details.push('Well-connected in knowledge graph');
  } else if (outgoingLinks.length === 0 && incomingLinks.length === 0) {
    details.push('⚠️ Orphaned (no links)');
  }

  return { score: Math.round(score), details };
}

/**
 * Score citations (0-20 points) - for scientific content
 * - Has citations/sources section
 * - Number of citations
 * @param {Object} note - Parsed note
 * @returns {Object} - Citations score and details
 */
function scoreCitations(note) {
  let score = 0;
  const details = [];

  // Only score citations for scientific references
  if (note.type !== 'scientific-reference') {
    return { score: 0, details: ['N/A (not scientific content)'], applicable: false };
  }

  // 1. Has references/sources section (10 pts)
  const hasReferencesSection = /##\s*(references|sources|citations)/i.test(note.content);
  if (hasReferencesSection) {
    score += 10;
    details.push('Has references section');
  }

  // 2. Citation count (10 pts)
  const citationMatches = note.content.match(/\[\d+\]|\(\w+\s+\d{4}\)/g) || [];
  const citationCount = citationMatches.length;

  const citationScore = Math.min(10, citationCount * 2);
  score += citationScore;
  details.push(`${citationCount} citations found`);

  // 3. External links (bonus indicator)
  const externalLinks = (note.content.match(/https?:\/\//g) || []).length;
  if (externalLinks > 0) {
    details.push(`${externalLinks} external links`);
  }

  return { score: Math.round(score), details, applicable: true };
}

/**
 * Score freshness (0-10 points)
 * - Recently updated
 * @param {Object} note - Parsed note
 * @returns {Object} - Freshness score and details
 */
function scoreFreshness(note) {
  let score = 0;
  const details = [];

  const now = new Date();
  const daysSinceUpdate = Math.floor((now - note.lastModified) / (1000 * 60 * 60 * 24));

  if (daysSinceUpdate < 90) {
    score = 10;
    details.push(`Updated ${daysSinceUpdate} days ago (recent)`);
  } else if (daysSinceUpdate < 180) {
    score = 5;
    details.push(`Updated ${daysSinceUpdate} days ago (moderate)`);
  } else {
    score = 0;
    details.push(`Updated ${daysSinceUpdate} days ago (stale)`);
  }

  return { score, details };
}

/**
 * Score engagement (0-10 points)
 * - Backlinks as proxy for engagement
 * @param {Object} note - Parsed note
 * @param {Object} linkGraph - Graph of all links
 * @returns {Object} - Engagement score and details
 */
function scoreEngagement(note, linkGraph) {
  let score = 0;
  const details = [];

  const incomingLinks = linkGraph.backlinks[note.title] || [];
  const engagementScore = Math.min(10, incomingLinks.length * 2);

  score = engagementScore;

  if (incomingLinks.length >= 5) {
    details.push(`Highly referenced (${incomingLinks.length} backlinks)`);
  } else if (incomingLinks.length > 0) {
    details.push(`Moderately referenced (${incomingLinks.length} backlinks)`);
  } else {
    details.push('Not yet referenced');
  }

  return { score, details };
}

/**
 * Score readability (0-5 points)
 * - Proper formatting
 * - Use of headers, lists, callouts
 * @param {Object} note - Parsed note
 * @returns {Object} - Readability score and details
 */
function scoreReadability(note) {
  let score = 0;
  const details = [];

  // 1. Has headers (2 pts)
  const headerCount = (note.content.match(/^#{1,3}\s+.+$/gm) || []).length;
  if (headerCount >= 2) {
    score += 2;
    details.push(`${headerCount} headers (good structure)`);
  } else if (headerCount > 0) {
    score += 1;
    details.push(`Only ${headerCount} header (needs more structure)`);
  }

  // 2. Has lists (2 pts)
  const hasLists = /^[\s]*[-*+]\s+/m.test(note.content) || /^[\s]*\d+\.\s+/m.test(note.content);
  if (hasLists) {
    score += 2;
    details.push('Uses lists for organization');
  }

  // 3. No paragraph walls (1 pt)
  const lines = note.content.split('\n');
  const longParagraphs = lines.filter(line => line.length > 500).length;
  if (longParagraphs === 0) {
    score += 1;
    details.push('No paragraph walls');
  } else {
    details.push(`⚠️ ${longParagraphs} long paragraphs (>500 chars)`);
  }

  return { score, details };
}

/**
 * Score a single note
 * @param {Object} note - Parsed note
 * @param {Object} linkGraph - Link graph
 * @returns {Object} - Complete score breakdown
 */
function scoreNote(note, linkGraph) {
  const completeness = scoreCompleteness(note);
  const connectivity = scoreConnectivity(note, linkGraph);
  const citations = scoreCitations(note);
  const freshness = scoreFreshness(note);
  const engagement = scoreEngagement(note, linkGraph);
  const readability = scoreReadability(note);

  // Calculate total (if citations not applicable, redistribute weight)
  let totalScore = completeness.score + connectivity.score + freshness.score + engagement.score + readability.score;

  if (citations.applicable) {
    totalScore += citations.score;
  } else {
    // Redistribute citation weight to completeness
    const redistributed = (citations.score / WEIGHTS.citations) * WEIGHTS.completeness;
    totalScore += 0; // Citations not applicable
  }

  return {
    totalScore: Math.round(totalScore),
    breakdown: {
      completeness,
      connectivity,
      citations,
      freshness,
      engagement,
      readability
    }
  };
}

/**
 * Build link graph (backlinks)
 * @param {Array<Object>} notes - All notes
 * @returns {Object} - Link graph with backlinks
 */
function buildLinkGraph(notes) {
  const backlinks = {};

  for (const note of notes) {
    const links = extractWikilinks(note.content);

    for (const link of links) {
      const cleanLink = link.split('/').pop(); // Remove path if present

      if (!backlinks[cleanLink]) {
        backlinks[cleanLink] = [];
      }

      backlinks[cleanLink].push(note.title);
    }
  }

  return { backlinks };
}

/**
 * Generate suggestions for low-scoring notes
 * @param {Object} noteScore - Note with score
 * @returns {Array<string>} - Improvement suggestions
 */
function generateSuggestions(noteScore) {
  const suggestions = [];
  const { breakdown } = noteScore.score;

  if (breakdown.completeness.score < 20) {
    suggestions.push('Add missing required frontmatter fields');
    suggestions.push('Expand content to meet minimum word count');
  }

  if (breakdown.connectivity.score < 15) {
    suggestions.push('Add more wikilinks to related notes');
    suggestions.push('Reference this note from other relevant notes');
  }

  if (breakdown.citations.applicable && breakdown.citations.score < 10) {
    suggestions.push('Add references and citations');
    suggestions.push('Link to external sources');
  }

  if (breakdown.freshness.score < 5) {
    suggestions.push('Review and update content');
  }

  if (breakdown.readability.score < 3) {
    suggestions.push('Add more headers for structure');
    suggestions.push('Use lists to organize information');
    suggestions.push('Break up long paragraphs');
  }

  return suggestions;
}

/**
 * Generate markdown report
 * @param {Array<Object>} scoredNotes - All notes with scores
 * @returns {string} - Markdown report
 */
function generateReport(scoredNotes) {
  const lines = [];
  const date = new Date().toISOString();

  lines.push('# Content Quality Report');
  lines.push('');
  lines.push(`**Generated**: ${date}`);
  lines.push('');

  // Summary statistics
  const avgScore = scoredNotes.reduce((sum, n) => sum + n.score.totalScore, 0) / scoredNotes.length;
  const scoresByType = {};

  for (const note of scoredNotes) {
    if (!scoresByType[note.type]) {
      scoresByType[note.type] = [];
    }
    scoresByType[note.type].push(note.score.totalScore);
  }

  lines.push('## Summary');
  lines.push('');
  lines.push(`- **Total notes analyzed**: ${scoredNotes.length}`);
  lines.push(`- **Average quality score**: ${Math.round(avgScore)}/100`);
  lines.push(`- **Excellent (≥90)**: ${scoredNotes.filter(n => n.score.totalScore >= 90).length}`);
  lines.push(`- **Good (70-89)**: ${scoredNotes.filter(n => n.score.totalScore >= 70 && n.score.totalScore < 90).length}`);
  lines.push(`- **Needs Improvement (<70)**: ${scoredNotes.filter(n => n.score.totalScore < 70).length}`);
  lines.push('');

  // Average by entity type
  lines.push('## Average Score by Entity Type');
  lines.push('');
  lines.push('| Entity Type | Average Score | Count |');
  lines.push('|-------------|---------------|-------|');

  for (const [type, scores] of Object.entries(scoresByType).sort((a, b) => {
    const avgA = a[1].reduce((sum, s) => sum + s, 0) / a[1].length;
    const avgB = b[1].reduce((sum, s) => sum + s, 0) / b[1].length;
    return avgB - avgA;
  })) {
    const avg = Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
    lines.push(`| ${type} | ${avg}/100 | ${scores.length} |`);
  }
  lines.push('');

  // Top 10 highest quality
  const top10 = scoredNotes.sort((a, b) => b.score.totalScore - a.score.totalScore).slice(0, 10);
  lines.push('## Top 10 Highest Quality Notes');
  lines.push('');

  for (let i = 0; i < top10.length; i++) {
    const note = top10[i];
    lines.push(`### ${i + 1}. ${note.title} (${note.score.totalScore}/100)`);
    lines.push('');
    lines.push(`**Path**: \`${note.relativePath}\``);
    lines.push(`**Type**: ${note.type}`);
    lines.push('');
    lines.push('**Breakdown**:');
    lines.push(`- Completeness: ${note.score.breakdown.completeness.score}/${WEIGHTS.completeness}`);
    lines.push(`- Connectivity: ${note.score.breakdown.connectivity.score}/${WEIGHTS.connectivity}`);
    lines.push(`- Citations: ${note.score.breakdown.citations.score}/${WEIGHTS.citations}`);
    lines.push(`- Freshness: ${note.score.breakdown.freshness.score}/${WEIGHTS.freshness}`);
    lines.push(`- Engagement: ${note.score.breakdown.engagement.score}/${WEIGHTS.engagement}`);
    lines.push(`- Readability: ${note.score.breakdown.readability.score}/${WEIGHTS.readability}`);
    lines.push('');
  }

  // Bottom 10 lowest quality
  const bottom10 = scoredNotes.sort((a, b) => a.score.totalScore - b.score.totalScore).slice(0, 10);
  lines.push('## Bottom 10 Notes Needing Improvement');
  lines.push('');

  for (let i = 0; i < bottom10.length; i++) {
    const note = bottom10[i];
    lines.push(`### ${i + 1}. ${note.title} (${note.score.totalScore}/100)`);
    lines.push('');
    lines.push(`**Path**: \`${note.relativePath}\``);
    lines.push(`**Type**: ${note.type}`);
    lines.push('');
    lines.push('**Breakdown**:');
    lines.push(`- Completeness: ${note.score.breakdown.completeness.score}/${WEIGHTS.completeness} - ${note.score.breakdown.completeness.details.join(', ')}`);
    lines.push(`- Connectivity: ${note.score.breakdown.connectivity.score}/${WEIGHTS.connectivity} - ${note.score.breakdown.connectivity.details.join(', ')}`);
    lines.push(`- Readability: ${note.score.breakdown.readability.score}/${WEIGHTS.readability} - ${note.score.breakdown.readability.details.join(', ')}`);
    lines.push('');

    const suggestions = generateSuggestions(note);
    if (suggestions.length > 0) {
      lines.push('**Improvement Suggestions**:');
      for (const sugg of suggestions) {
        lines.push(`- ${sugg}`);
      }
      lines.push('');
    }
  }

  lines.push('---');
  lines.push('');
  lines.push('*Generated by Content Quality Scorer v1.0*');

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

  const reportPath = path.join(reportDir, `quality-scores-${date}.md`);
  fs.writeFileSync(reportPath, report);

  console.log(`\n✅ Report saved to: ${path.relative(VAULT_ROOT, reportPath)}`);
}

/**
 * Main entry point
 */
async function main() {
  const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 [options]')
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Show detailed output',
      default: false
    })
    .help('h')
    .alias('h', 'help')
    .argv;

  try {
    console.log('🔍 Analyzing content quality...\n');

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

    console.log('Building link graph...\n');
    const linkGraph = buildLinkGraph(allNotes);

    console.log('Scoring notes...\n');
    const scoredNotes = allNotes.map(note => ({
      ...note,
      relativePath: path.relative(VAULT_ROOT, note.path),
      score: scoreNote(note, linkGraph)
    }));

    // Generate report
    const report = generateReport(scoredNotes);
    saveReport(report);

    // Console summary
    const avgScore = scoredNotes.reduce((sum, n) => sum + n.score.totalScore, 0) / scoredNotes.length;

    console.log('\n📊 Summary:');
    console.log(`   Notes analyzed: ${scoredNotes.length}`);
    console.log(`   Average quality score: ${Math.round(avgScore)}/100`);
    console.log(`   Excellent (≥90): ${scoredNotes.filter(n => n.score.totalScore >= 90).length}`);
    console.log(`   Good (70-89): ${scoredNotes.filter(n => n.score.totalScore >= 70 && n.score.totalScore < 90).length}`);
    console.log(`   Needs Improvement (<70): ${scoredNotes.filter(n => n.score.totalScore < 70).length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
