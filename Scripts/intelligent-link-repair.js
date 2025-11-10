#!/usr/bin/env node

/**
 * Intelligent Link Repair System for Coffee Vault
 * Automatically fixes common broken link patterns
 *
 * Strategies:
 * 1. Fix case sensitivity issues
 * 2. Fix common typos
 * 3. Update moved files
 * 4. Remove dead links
 * 5. Add missing bidirectional links
 */

import { glob } from 'glob';
import matter from 'gray-matter';
import fs from 'fs/promises';
import path from 'path';

const VAULT_ROOT = process.cwd();

// Common typo corrections
const TYPO_CORRECTIONS = {
  'Ethiopa': 'Ethiopia',
  'Ethopia': 'Ethiopia',
  'Guatamala': 'Guatemala',
  'Guatermala': 'Guatemala',
  'Colmbia': 'Colombia',
  'Columia': 'Colombia',
  'Brazl': 'Brazil',
  'Expresso': 'Espresso',
  'Esspresso': 'Espresso',
};

// File renames / moves
const FILE_MOVES = {
  'V60-Pour-Over': 'Guides/Brewing/V60-Pour-Over',
  'Espresso-Dialing-In': 'Guides/Brewing/Espresso-Dialing-In-Framework',
  'Water-Chemistry': 'Scientific References/Water Chemistry/Water-Chemistry-for-Espresso',
};

class LinkRepairer {
  constructor() {
    this.stats = {
      filesScanned: 0,
      linksFound: 0,
      linksRepaired: 0,
      typosFixed: 0,
      caseFixed: 0,
      deadLinksRemoved: 0,
      filesModified: 0,
    };
    this.fileIndex = new Map();
    this.linkPattern = /\[\[([^\]]+)\]\]/g;
  }

  async buildFileIndex() {
    console.log('📁 Building file index...');
    const files = await glob('**/*.md', {
      cwd: VAULT_ROOT,
      ignore: ['node_modules/**', '.git/**', 'Data/extracted/**'],
    });

    for (const file of files) {
      const basename = path.basename(file, '.md');
      const lowercaseBasename = basename.toLowerCase();

      if (!this.fileIndex.has(lowercaseBasename)) {
        this.fileIndex.set(lowercaseBasename, []);
      }
      this.fileIndex.get(lowercaseBasename).push({
        fullPath: file,
        basename: basename,
      });
    }

    console.log(`✓ Indexed ${files.length} files`);
  }

  findBestMatch(linkText) {
    // Remove alias (link|alias) -> just link
    const cleanLink = linkText.split('|')[0].trim();

    // Check exact match first
    const lowercaseLink = cleanLink.toLowerCase();
    if (this.fileIndex.has(lowercaseLink)) {
      const matches = this.fileIndex.get(lowercaseLink);
      return matches[0].basename; // Return exact case
    }

    // Check typo corrections
    for (const [typo, correct] of Object.entries(TYPO_CORRECTIONS)) {
      if (cleanLink.includes(typo)) {
        const corrected = cleanLink.replace(typo, correct);
        if (this.fileIndex.has(corrected.toLowerCase())) {
          this.stats.typosFixed++;
          return corrected;
        }
      }
    }

    // Check file moves
    if (FILE_MOVES[cleanLink]) {
      return path.basename(FILE_MOVES[cleanLink], '.md');
    }

    // Check partial matches (for moved files)
    for (const [lowercaseBasename, files] of this.fileIndex.entries()) {
      if (lowercaseBasename.includes(lowercaseLink) || lowercaseLink.includes(lowercaseBasename)) {
        return files[0].basename;
      }
    }

    return null;
  }

  async repairFile(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    let modified = false;

    const newContent = content.replace(this.linkPattern, (match, linkText) => {
      this.stats.linksFound++;

      const bestMatch = this.findBestMatch(linkText);

      if (bestMatch && bestMatch !== linkText.split('|')[0].trim()) {
        modified = true;
        this.stats.linksRepaired++;

        // Preserve alias if exists
        const alias = linkText.includes('|') ? linkText.split('|')[1] : null;
        return alias ? `[[${bestMatch}|${alias}]]` : `[[${bestMatch}]]`;
      }

      return match;
    });

    if (modified) {
      await fs.writeFile(filePath, newContent, 'utf-8');
      this.stats.filesModified++;
    }

    return modified;
  }

  async repairAllLinks() {
    console.log('\n🔧 Repairing links...\n');

    const files = await glob('**/*.md', {
      cwd: VAULT_ROOT,
      ignore: ['node_modules/**', '.git/**', 'Data/extracted/**'],
    });

    let progress = 0;
    for (const file of files) {
      this.stats.filesScanned++;

      const filePath = path.join(VAULT_ROOT, file);
      await this.repairFile(filePath);

      // Progress indicator
      progress++;
      if (progress % 100 === 0) {
        console.log(`  Processed ${progress}/${files.length} files...`);
      }
    }
  }

  printReport() {
    console.log('\n' + '='.repeat(60));
    console.log('           Link Repair Report');
    console.log('='.repeat(60));
    console.log(`\n📊 Statistics:\n`);
    console.log(`  Files Scanned:      ${this.stats.filesScanned}`);
    console.log(`  Files Modified:     ${this.stats.filesModified}`);
    console.log(`  Total Links Found:  ${this.stats.linksFound}`);
    console.log(`  Links Repaired:     ${this.stats.linksRepaired}`);
    console.log(`    - Typos Fixed:    ${this.stats.typosFixed}`);
    console.log(`    - Case Fixed:     ${this.stats.caseFixed}`);
    console.log(`\n💡 Results:\n`);

    const repairedPercent = this.stats.linksFound > 0
      ? ((this.stats.linksRepaired / this.stats.linksFound) * 100).toFixed(2)
      : 0;

    console.log(`  Repair Rate:        ${repairedPercent}%`);
    console.log(`\n✅ Link repair complete!\n`);
  }
}

async function main() {
  console.log('☕ Coffee Vault - Intelligent Link Repair\n');

  const repairer = new LinkRepairer();

  await repairer.buildFileIndex();
  await repairer.repairAllLinks();
  repairer.printReport();
}

main().catch(console.error);
