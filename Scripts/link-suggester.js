/**
 * Cross-Reference Link Suggester for Coffee Vault
 * Version: 1.0.0
 *
 * Scans notes for phrases matching existing note titles and suggests link insertion
 * Helps build a connected knowledge graph automatically
 */

/**
 * Configuration for link suggestions
 */
const DEFAULT_CONFIG = {
  minMatchLength: 3, // Minimum characters for a match
  caseSensitive: false,
  excludeFolders: ['.obsidian', 'Attachments', 'Templates'],
  excludePatterns: ['daily-note', 'weekly-summary', 'monthly-report'],
  maxSuggestionsPerNote: 20,
  requireWholeWord: true, // Only match complete words
  skipExistingLinks: true // Don't suggest links for already-linked text
};

/**
 * Find potential link suggestions in a note
 * @param {Object} app - Obsidian app instance
 * @param {Object} file - File to analyze
 * @param {Object} config - Configuration options
 * @returns {Object} Suggestions object
 */
async function findLinkSuggestions(app, file, config = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  try {
    // Read file content
    const content = await app.vault.read(file);

    // Get all note titles in vault (potential link targets)
    const allFiles = app.vault.getMarkdownFiles();
    const targetNotes = buildTargetNoteIndex(allFiles, finalConfig);

    // Find matches in content
    const suggestions = findMatches(content, targetNotes, file, finalConfig);

    return {
      file: file.path,
      fileName: file.name,
      totalSuggestions: suggestions.length,
      suggestions: suggestions.slice(0, finalConfig.maxSuggestionsPerNote)
    };

  } catch (error) {
    console.error(`Error analyzing ${file.path}:`, error);
    throw error;
  }
}

/**
 * Build index of all potential link targets
 * @param {Array} files - Array of TFile objects
 * @param {Object} config - Configuration
 * @returns {Array} Array of target note objects
 */
function buildTargetNoteIndex(files, config) {
  const targets = [];

  files.forEach(file => {
    // Skip excluded folders
    if (config.excludeFolders.some(folder => file.path.includes(folder))) {
      return;
    }

    // Get note title (filename without extension)
    const title = file.basename;

    // Skip if matches excluded patterns
    if (config.excludePatterns.some(pattern => title.toLowerCase().includes(pattern))) {
      return;
    }

    // Skip very short titles
    if (title.length < config.minMatchLength) {
      return;
    }

    targets.push({
      title: title,
      path: file.path,
      folder: file.parent?.name || 'root',
      aliases: [] // Could be extended to include aliases from frontmatter
    });
  });

  return targets;
}

/**
 * Find matches in content
 * @param {string} content - Note content
 * @param {Array} targets - Array of target notes
 * @param {Object} currentFile - Current file being analyzed
 * @param {Object} config - Configuration
 * @returns {Array} Array of match objects
 */
function findMatches(content, targets, currentFile, config) {
  const matches = [];

  // Remove frontmatter
  const contentWithoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');

  // Remove existing links to avoid suggesting duplicates
  let searchContent = contentWithoutFrontmatter;
  if (config.skipExistingLinks) {
    searchContent = searchContent.replace(/\[\[.*?\]\]/g, '');
  }

  targets.forEach(target => {
    // Don't suggest linking to self
    if (target.path === currentFile.path) {
      return;
    }

    const searchTerm = target.title;
    const pattern = config.requireWholeWord
      ? new RegExp(`\\b${escapeRegex(searchTerm)}\\b`, config.caseSensitive ? 'g' : 'gi')
      : new RegExp(escapeRegex(searchTerm), config.caseSensitive ? 'g' : 'gi');

    let match;
    while ((match = pattern.exec(searchContent)) !== null) {
      // Get context around match
      const contextStart = Math.max(0, match.index - 40);
      const contextEnd = Math.min(searchContent.length, match.index + searchTerm.length + 40);
      const context = searchContent.substring(contextStart, contextEnd);

      matches.push({
        text: match[0],
        targetNote: target.title,
        targetPath: target.path,
        targetFolder: target.folder,
        position: match.index,
        context: '...' + context + '...',
        confidence: calculateConfidence(match[0], target, context)
      });
    }
  });

  // Sort by confidence and position
  return matches.sort((a, b) => {
    if (b.confidence !== a.confidence) {
      return b.confidence - a.confidence;
    }
    return a.position - b.position;
  });
}

/**
 * Calculate confidence score for a match
 * @param {string} matchText - The matched text
 * @param {Object} target - Target note object
 * @param {string} context - Surrounding context
 * @returns {number} Confidence score 0-1
 */
function calculateConfidence(matchText, target, context) {
  let confidence = 0.5; // Base confidence

  // Exact case match increases confidence
  if (matchText === target.title) {
    confidence += 0.2;
  }

  // Match in heading increases confidence
  if (context.includes('#')) {
    confidence += 0.1;
  }

  // Match in list item increases confidence
  if (context.trim().startsWith('-') || context.trim().startsWith('*')) {
    confidence += 0.05;
  }

  // Longer matches are more likely to be intentional
  if (matchText.length > 10) {
    confidence += 0.1;
  }

  // Bean names, roaster names, origins are high confidence
  if (target.folder === 'Beans Library' || target.folder === 'Roasters' || target.folder === 'Origins') {
    confidence += 0.15;
  }

  return Math.min(1.0, confidence);
}

/**
 * Escape regex special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Apply suggested links to a note
 * @param {Object} app - Obsidian app instance
 * @param {Object} file - File to modify
 * @param {Array} suggestions - Array of suggestions to apply
 * @param {boolean} dryRun - If true, only show what would change
 * @returns {Object} Result object
 */
async function applySuggestions(app, file, suggestions, dryRun = true) {
  try {
    const content = await app.vault.read(file);
    let newContent = content;
    let appliedCount = 0;

    // Sort suggestions by position in reverse order
    // This ensures positions remain valid as we make replacements
    const sortedSuggestions = [...suggestions].sort((a, b) => b.position - a.position);

    sortedSuggestions.forEach(suggestion => {
      // Only apply high-confidence suggestions automatically
      if (suggestion.confidence >= 0.7) {
        const linkText = `[[${suggestion.targetNote}]]`;

        // Find and replace the specific occurrence
        // We need to be careful to only replace the exact match at the right position
        const beforeMatch = newContent.substring(0, suggestion.position);
        const matchText = newContent.substring(suggestion.position, suggestion.position + suggestion.text.length);
        const afterMatch = newContent.substring(suggestion.position + suggestion.text.length);

        if (matchText === suggestion.text) {
          newContent = beforeMatch + linkText + afterMatch;
          appliedCount++;
        }
      }
    });

    if (!dryRun && appliedCount > 0) {
      await app.vault.modify(file, newContent);
    }

    return {
      success: true,
      file: file.path,
      appliedCount,
      totalSuggestions: suggestions.length,
      dryRun,
      preview: dryRun ? newContent : null
    };

  } catch (error) {
    console.error("Error applying suggestions:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Scan entire vault for link suggestions
 * @param {Object} app - Obsidian app instance
 * @param {Object} options - Scan options
 * @returns {Object} Scan results
 */
async function scanVaultForSuggestions(app, options = {}) {
  const {
    includeFolder = null, // Scan only this folder
    excludeFolders = DEFAULT_CONFIG.excludeFolders,
    minConfidence = 0.6,
    maxNotesToScan = 100
  } = options;

  try {
    const allFiles = app.vault.getMarkdownFiles();
    const results = {
      scannedNotes: 0,
      totalSuggestions: 0,
      highConfidenceSuggestions: 0,
      noteResults: []
    };

    let filesToScan = allFiles;

    // Filter by folder if specified
    if (includeFolder) {
      filesToScan = filesToScan.filter(f => f.path.startsWith(includeFolder));
    }

    // Exclude specific folders
    filesToScan = filesToScan.filter(f =>
      !excludeFolders.some(folder => f.path.includes(folder))
    );

    // Limit number of notes to scan
    filesToScan = filesToScan.slice(0, maxNotesToScan);

    // Scan each file
    for (const file of filesToScan) {
      const suggestions = await findLinkSuggestions(app, file);

      const highConfidence = suggestions.suggestions.filter(s => s.confidence >= minConfidence);

      if (highConfidence.length > 0) {
        results.noteResults.push({
          file: file.path,
          fileName: file.name,
          totalSuggestions: suggestions.totalSuggestions,
          highConfidenceSuggestions: highConfidence.length,
          topSuggestions: highConfidence.slice(0, 5)
        });

        results.totalSuggestions += suggestions.totalSuggestions;
        results.highConfidenceSuggestions += highConfidence.length;
      }

      results.scannedNotes++;
    }

    // Sort results by number of high-confidence suggestions
    results.noteResults.sort((a, b) => b.highConfidenceSuggestions - a.highConfidenceSuggestions);

    return results;

  } catch (error) {
    console.error("Error scanning vault:", error);
    throw error;
  }
}

/**
 * Generate link suggestion report
 * @param {Object} scanResults - Results from scanVaultForSuggestions
 * @returns {string} Formatted report
 */
function generateSuggestionReport(scanResults) {
  const lines = [];

  lines.push('# 🔗 Link Suggestion Report');
  lines.push('');
  lines.push(`**Scan Date**: ${new Date().toISOString().split('T')[0]}`);
  lines.push('');

  lines.push('## Summary');
  lines.push('');
  lines.push(`- **Notes Scanned**: ${scanResults.scannedNotes}`);
  lines.push(`- **Total Suggestions**: ${scanResults.totalSuggestions}`);
  lines.push(`- **High Confidence Suggestions**: ${scanResults.highConfidenceSuggestions}`);
  lines.push(`- **Notes with Suggestions**: ${scanResults.noteResults.length}`);
  lines.push('');

  if (scanResults.noteResults.length === 0) {
    lines.push('No link suggestions found. Your vault is well-connected!');
    return lines.join('\n');
  }

  lines.push('## Notes Needing Links');
  lines.push('');

  scanResults.noteResults.slice(0, 20).forEach((noteResult, index) => {
    lines.push(`### ${index + 1}. ${noteResult.fileName}`);
    lines.push('');
    lines.push(`**Path**: \`${noteResult.file}\``);
    lines.push(`**High Confidence Suggestions**: ${noteResult.highConfidenceSuggestions}`);
    lines.push('');

    if (noteResult.topSuggestions.length > 0) {
      lines.push('**Top Suggestions**:');
      noteResult.topSuggestions.forEach(sugg => {
        lines.push(`- Link to **${sugg.targetNote}** (confidence: ${(sugg.confidence * 100).toFixed(0)}%)`);
        lines.push(`  - Context: \`${sugg.context}\``);
      });
      lines.push('');
    }
  });

  lines.push('---');
  lines.push('');
  lines.push('## How to Use This Report');
  lines.push('');
  lines.push('1. Review the suggested links above');
  lines.push('2. Manually add links where appropriate');
  lines.push('3. Or use the `applySuggestions()` function to auto-link high-confidence matches');
  lines.push('');
  lines.push('*Generated automatically by Link Suggester*');

  return lines.join('\n');
}

/**
 * Find and suggest disambiguation for ambiguous references
 * @param {Object} app - Obsidian app instance
 * @param {string} searchTerm - Term to disambiguate
 * @returns {Array} Array of possible targets
 */
async function findDisambiguationTargets(app, searchTerm) {
  const allFiles = app.vault.getMarkdownFiles();
  const matches = [];

  allFiles.forEach(file => {
    const title = file.basename.toLowerCase();
    const search = searchTerm.toLowerCase();

    if (title.includes(search) || search.includes(title)) {
      matches.push({
        title: file.basename,
        path: file.path,
        folder: file.parent?.name || 'root',
        exactMatch: title === search,
        partialMatch: title.includes(search)
      });
    }
  });

  // Sort: exact matches first, then partial matches
  return matches.sort((a, b) => {
    if (a.exactMatch && !b.exactMatch) return -1;
    if (!a.exactMatch && b.exactMatch) return 1;
    if (a.partialMatch && !b.partialMatch) return -1;
    if (!a.partialMatch && b.partialMatch) return 1;
    return a.title.localeCompare(b.title);
  });
}

// Export functions
module.exports = {
  findLinkSuggestions,
  applySuggestions,
  scanVaultForSuggestions,
  generateSuggestionReport,
  findDisambiguationTargets,
  DEFAULT_CONFIG
};
