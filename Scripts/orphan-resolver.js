#!/usr/bin/env node

/**
 * Orphan Resolver for Coffee Vault
 * Automatically connects orphaned files to index pages and related content
 */

import { glob } from 'glob';
import matter from 'gray-matter';
import fs from 'fs/promises';
import path from 'path';

const VAULT_ROOT = process.cwd();

// Index pages to link orphans to
const INDEX_PAGES = {
  'Scientific References': 'Scientific References/00-Scientific-Content-Index.md',
  'Origins': 'Origins/00-Origins-Index.md',
  'Beans': 'Beans/00-Beans-Index.md',
  'Equipment': 'Equipment/00-Equipment-Index.md',
  'Recipes': 'Recipes/00-Recipe-Index.md',
  'Roasters': 'Roasters/00-Roaster-Index.md',
  'Coffee Logs': 'Coffee Logs/00-Coffee-Log-Index.md',
  'Guides': 'Guides/00-Guides-Index.md',
};

class OrphanResolver {
  constructor() {
    this.stats = {
      orphansFound: 0,
      orphansResolved: 0,
      linksAdded: 0,
      indexesUpdated: 0,
    };
    this.linkGraph = new Map();
  }

  async buildLinkGraph() {
    console.log('📊 Building link graph...');
    const files = await glob('**/*.md', {
      cwd: VAULT_ROOT,
      ignore: ['node_modules/**', '.git/**', 'Data/extracted/**'],
    });

    for (const file of files) {
      this.linkGraph.set(file, { incoming: 0, outgoing: 0 });
    }

    // Count incoming links
    for (const file of files) {
      const content = await fs.readFile(path.join(VAULT_ROOT, file), 'utf-8');
      const linkPattern = /\[\[([^\]]+)\]\]/g;
      let match;

      while ((match = linkPattern.exec(content)) !== null) {
        const linkText = match[1].split('|')[0].trim();
        const basename = linkText + '.md';

        // Find matching file
        for (const targetFile of files) {
          if (path.basename(targetFile) === basename || targetFile.includes(linkText)) {
            const stats = this.linkGraph.get(targetFile);
            if (stats) {
              stats.incoming++;
            }
            break;
          }
        }

        const sourceStats = this.linkGraph.get(file);
        if (sourceStats) {
          sourceStats.outgoing++;
        }
      }
    }

    console.log(`✓ Analyzed ${files.length} files`);
  }

  async findOrphans() {
    const orphans = [];

    for (const [file, stats] of this.linkGraph.entries()) {
      // Orphan = no incoming links and not an index file
      if (stats.incoming === 0 && !file.includes('00-') && !file.includes('README') && !file.includes('HOME')) {
        orphans.push({
          file,
          category: this.categorizeFile(file),
          stats,
        });
      }
    }

    this.stats.orphansFound = orphans.length;
    console.log(`\n🔍 Found ${orphans.length} orphaned files`);

    return orphans;
  }

  categorizeFile(filePath) {
    if (filePath.startsWith('Scientific References')) return 'Scientific References';
    if (filePath.startsWith('Origins')) return 'Origins';
    if (filePath.startsWith('Beans')) return 'Beans';
    if (filePath.startsWith('Equipment')) return 'Equipment';
    if (filePath.startsWith('Recipes')) return 'Recipes';
    if (filePath.startsWith('Roasters')) return 'Roasters';
    if (filePath.startsWith('Coffee Logs')) return 'Coffee Logs';
    if (filePath.startsWith('Guides')) return 'Guides';
    return 'Uncategorized';
  }

  async linkToIndex(orphan) {
    const { file, category } = orphan;
    const indexFile = INDEX_PAGES[category];

    if (!indexFile) {
      return false; // No index for this category
    }

    const indexPath = path.join(VAULT_ROOT, indexFile);

    // Check if index exists
    try {
      await fs.access(indexPath);
    } catch {
      return false; // Index doesn't exist
    }

    // Read index
    let indexContent = await fs.readFile(indexPath, 'utf-8');
    const basename = path.basename(file, '.md');

    // Check if already linked
    if (indexContent.includes(`[[${basename}]]`)) {
      return false; // Already linked
    }

    // Add to index
    const linkToAdd = `- [[${basename}]]`;

    // Find appropriate section or add to end
    if (indexContent.includes('## Uncategorized') || indexContent.includes('### Other')) {
      indexContent = indexContent.replace(
        /## Uncategorized|### Other/,
        `$&\n${linkToAdd}`
      );
    } else {
      indexContent += `\n\n## Recently Added\n${linkToAdd}`;
    }

    await fs.writeFile(indexPath, indexContent, 'utf-8');
    return true;
  }

  async resolveOrphans(orphans) {
    console.log('\n🔗 Resolving orphans...\n');

    for (const orphan of orphans) {
      const resolved = await this.linkToIndex(orphan);

      if (resolved) {
        this.stats.orphansResolved++;
        this.stats.linksAdded++;

        if (this.stats.orphansResolved % 50 === 0) {
          console.log(`  Resolved ${this.stats.orphansResolved}/${this.stats.orphansFound} orphans...`);
        }
      }
    }
  }

  printReport() {
    console.log('\n' + '='.repeat(60));
    console.log('           Orphan Resolution Report');
    console.log('='.repeat(60));
    console.log(`\n📊 Statistics:\n`);
    console.log(`  Orphans Found:      ${this.stats.orphansFound}`);
    console.log(`  Orphans Resolved:   ${this.stats.orphansResolved}`);
    console.log(`  Links Added:        ${this.stats.linksAdded}`);
    console.log(`\n💡 Results:\n`);

    const resolvedPercent = this.stats.orphansFound > 0
      ? ((this.stats.orphansResolved / this.stats.orphansFound) * 100).toFixed(2)
      : 0;

    const remaining = this.stats.orphansFound - this.stats.orphansResolved;

    console.log(`  Resolution Rate:    ${resolvedPercent}%`);
    console.log(`  Remaining Orphans:  ${remaining}`);
    console.log(`\n✅ Orphan resolution complete!\n`);
  }
}

async function main() {
  console.log('☕ Coffee Vault - Orphan Resolver\n');

  const resolver = new OrphanResolver();

  await resolver.buildLinkGraph();
  const orphans = await resolver.findOrphans();
  await resolver.resolveOrphans(orphans);
  resolver.printReport();
}

main().catch(console.error);
