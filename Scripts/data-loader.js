#!/usr/bin/env node

/**
 * Data Loader - Coffee Vault 7.0
 * Production-ready data extraction pipeline
 * Transforms markdown files into queryable JSON
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import {
  CacheManager,
  JSONExporter,
  PerformanceMonitor,
  scanDirectory,
  extractEntity,
  calculateFileHash,
  formatFileSize,
  ensureDirectoryExists
} from './data-loader-lib.js';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VAULT_ROOT = path.resolve(__dirname, '..');

// Entity type configuration
const ENTITY_CONFIGS = {
  'coffee-logs': {
    folder: 'Coffee Logs',
    outputFile: 'coffee-logs.json',
    entityType: 'coffee-log',
    key: 'logs'
  },
  'beans': {
    folder: 'Beans Library',
    outputFile: 'beans.json',
    entityType: 'bean-profile',
    key: 'beans'
  },
  'origins': {
    folder: 'Origins',
    outputFile: 'origins.json',
    entityType: 'origin-profile',
    key: 'origins'
  },
  'recipes': {
    folder: 'Recipes',
    outputFile: 'recipes.json',
    entityType: 'recipe-profile',
    key: 'recipes'
  },
  'equipment': {
    folder: 'Equipment Models',
    outputFile: 'equipment.json',
    entityType: 'equipment-model',
    key: 'equipment'
  },
  'cupping-sessions': {
    folder: 'Cupping Sessions',
    outputFile: 'cupping-sessions.json',
    entityType: 'cupping-session',
    key: 'sessions'
  }
};

/**
 * Main extraction function
 * @param {Object} options - Extraction options
 * @returns {Promise<Object>} - Extraction results
 */
async function extractVaultData(options) {
  const monitor = new PerformanceMonitor();
  monitor.start('total');

  const outputDir = options.outputDir || path.join(VAULT_ROOT, 'Data', 'extracted');
  const cacheDir = path.join(outputDir, 'cache');
  const cacheFile = path.join(cacheDir, 'file-hashes.json');

  // Ensure directories exist
  ensureDirectoryExists(outputDir);
  ensureDirectoryExists(cacheDir);

  // Initialize cache manager
  const cacheManager = new CacheManager(cacheFile);
  if (options.force) {
    if (options.verbose) {
      console.log(chalk.yellow('Force mode: Clearing cache...'));
    }
    cacheManager.clearCache();
  }

  // Initialize JSON exporter
  const jsonExporter = new JSONExporter(outputDir);

  // Results tracking
  const results = {
    totalFiles: 0,
    processedFiles: 0,
    skippedFiles: 0,
    errorFiles: 0,
    entities: {},
    errors: [],
    performance: {}
  };

  // Process each entity type
  for (const [entityName, config] of Object.entries(ENTITY_CONFIGS)) {
    if (options.verbose) {
      console.log(chalk.blue(`\n📂 Processing ${config.folder}...`));
    }

    monitor.start(entityName);

    // Scan directory
    const files = await scanDirectory(config.folder, VAULT_ROOT);

    // Filter out README files
    const markdownFiles = files.filter(f =>
      !f.endsWith('README.md') && f.endsWith('.md')
    );

    results.totalFiles += markdownFiles.length;

    // Extract entities
    const entities = [];
    let processedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const filepath of markdownFiles) {
      try {
        // Check cache
        if (!options.force && !cacheManager.isChanged(filepath)) {
          skippedCount++;
          if (options.verbose && options.dryRun) {
            console.log(chalk.gray(`  ⏭️  Skipped (cached): ${path.basename(filepath)}`));
          }
          continue;
        }

        // Extract entity
        const entity = extractEntity(filepath, config.entityType);

        if (!entity) {
          errorCount++;
          results.errors.push({
            file: filepath,
            error: 'Failed to parse frontmatter'
          });
          if (options.verbose) {
            console.log(chalk.red(`  ❌ Error: ${path.basename(filepath)}`));
          }
          continue;
        }

        entities.push(entity);
        processedCount++;

        // Update cache
        if (!options.dryRun) {
          const hash = calculateFileHash(filepath);
          cacheManager.updateCache(filepath, hash);
        }

        if (options.verbose) {
          console.log(chalk.green(`  ✓ Processed: ${path.basename(filepath)}`));
        }
      } catch (error) {
        errorCount++;
        results.errors.push({
          file: filepath,
          error: error.message
        });
        if (options.verbose) {
          console.log(chalk.red(`  ❌ Error: ${path.basename(filepath)} - ${error.message}`));
        }
      }
    }

    const elapsed = monitor.end(entityName);

    // Store results
    results.entities[entityName] = {
      total: markdownFiles.length,
      processed: processedCount,
      skipped: skippedCount,
      errors: errorCount,
      timeMs: elapsed
    };

    results.processedFiles += processedCount;
    results.skippedFiles += skippedCount;
    results.errorFiles += errorCount;

    // Write JSON output
    if (!options.dryRun && entities.length > 0) {
      const outputData = {
        extractedAt: new Date().toISOString(),
        version: '7.0.0',
        count: entities.length,
        [config.key]: entities
      };

      try {
        const filepath = jsonExporter.write(outputData, config.outputFile, true);
        const stats = fs.statSync(filepath);

        if (options.verbose) {
          console.log(chalk.cyan(`  💾 Written: ${config.outputFile} (${formatFileSize(stats.size)})`));
        }
      } catch (error) {
        console.error(chalk.red(`  ❌ Failed to write ${config.outputFile}: ${error.message}`));
        results.errors.push({
          file: config.outputFile,
          error: error.message
        });
      }
    }

    if (options.verbose) {
      console.log(chalk.gray(`  ⏱️  ${elapsed}ms (${(elapsed / 1000).toFixed(2)}s)`));
    }
  }

  // Save cache
  if (!options.dryRun) {
    cacheManager.saveCache();
  }

  // Generate metadata
  const totalTime = monitor.end('total');
  results.performance = {
    totalTimeMs: totalTime,
    totalTimeSec: (totalTime / 1000).toFixed(2),
    ...monitor.getAll()
  };

  if (!options.dryRun) {
    const metadata = {
      extractedAt: new Date().toISOString(),
      version: '7.0.0',
      vaultRoot: VAULT_ROOT,
      totalFiles: results.totalFiles,
      processedFiles: results.processedFiles,
      skippedFiles: results.skippedFiles,
      errorFiles: results.errorFiles,
      entities: Object.fromEntries(
        Object.entries(results.entities).map(([key, val]) => [key, val.total])
      ),
      performance: results.performance
    };

    try {
      jsonExporter.write(metadata, 'metadata.json', true);
    } catch (error) {
      console.error(chalk.red(`Failed to write metadata: ${error.message}`));
    }
  }

  return results;
}

/**
 * Print extraction report
 * @param {Object} results - Extraction results
 * @param {Object} options - CLI options
 */
function printReport(results, options) {
  console.log('\n' + chalk.bold.cyan('═══════════════════════════════════════════════════'));
  console.log(chalk.bold.cyan('        Coffee Vault Data Extraction Report        '));
  console.log(chalk.bold.cyan('═══════════════════════════════════════════════════') + '\n');

  // Overall stats
  console.log(chalk.bold('📊 Overall Statistics:'));
  console.log(`  Total Files Found:     ${chalk.yellow(results.totalFiles)}`);
  console.log(`  Files Processed:       ${chalk.green(results.processedFiles)}`);
  console.log(`  Files Skipped (cache): ${chalk.gray(results.skippedFiles)}`);
  console.log(`  Files with Errors:     ${chalk.red(results.errorFiles)}`);

  // Entity breakdown
  console.log('\n' + chalk.bold('📁 Entity Breakdown:'));
  for (const [entityName, stats] of Object.entries(results.entities)) {
    const config = ENTITY_CONFIGS[entityName];
    console.log(`\n  ${chalk.cyan(config.folder)}:`);
    console.log(`    Total:     ${stats.total}`);
    console.log(`    Processed: ${chalk.green(stats.processed)}`);
    console.log(`    Skipped:   ${chalk.gray(stats.skipped)}`);
    console.log(`    Errors:    ${stats.errors > 0 ? chalk.red(stats.errors) : stats.errors}`);
    console.log(`    Time:      ${stats.timeMs}ms`);
  }

  // Performance
  console.log('\n' + chalk.bold('⏱️  Performance:'));
  console.log(`  Total Time:            ${chalk.yellow(results.performance.totalTimeSec + 's')} (${results.performance.totalTimeMs}ms)`);

  const filesPerSec = (results.processedFiles / (results.performance.totalTimeMs / 1000)).toFixed(2);
  console.log(`  Processing Speed:      ${chalk.green(filesPerSec)} files/sec`);

  // Performance targets
  const targetFull = 2000; // 2 seconds
  const targetIncremental = 200; // 200ms
  const isIncremental = results.skippedFiles > results.processedFiles;
  const target = isIncremental ? targetIncremental : targetFull;
  const targetMet = results.performance.totalTimeMs <= target;

  console.log(`\n  Performance Target:    ${target}ms (${isIncremental ? 'incremental' : 'full'} extraction)`);
  console.log(`  Target Met:            ${targetMet ? chalk.green('✓ YES') : chalk.red('✗ NO')}`);

  // Errors
  if (results.errors.length > 0) {
    console.log('\n' + chalk.bold.red('❌ Errors:'));
    results.errors.slice(0, 10).forEach(err => {
      console.log(`  ${chalk.red('•')} ${path.basename(err.file)}: ${err.error}`);
    });
    if (results.errors.length > 10) {
      console.log(chalk.gray(`  ... and ${results.errors.length - 10} more errors`));
    }
  }

  // Success message
  if (results.errorFiles === 0) {
    console.log('\n' + chalk.green.bold('✓ Extraction completed successfully!'));
  } else {
    console.log('\n' + chalk.yellow.bold('⚠ Extraction completed with warnings'));
  }

  if (options.dryRun) {
    console.log(chalk.yellow('\n⚠️  DRY RUN - No files were written'));
  }

  console.log(chalk.cyan('\n═══════════════════════════════════════════════════\n'));
}

/**
 * Main CLI function
 */
async function main() {
  const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 [options]')
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Verbose output',
      default: false
    })
    .option('dry-run', {
      type: 'boolean',
      description: 'Dry run (no files written)',
      default: false
    })
    .option('force', {
      alias: 'f',
      type: 'boolean',
      description: 'Force re-extraction (ignore cache)',
      default: false
    })
    .option('output-dir', {
      alias: 'o',
      type: 'string',
      description: 'Output directory',
      default: path.join(VAULT_ROOT, 'Data', 'extracted')
    })
    .example('$0', 'Extract all data (incremental)')
    .example('$0 --force', 'Force full re-extraction')
    .example('$0 --verbose', 'Extract with verbose output')
    .example('$0 --dry-run', 'Preview extraction without writing files')
    .help()
    .alias('help', 'h')
    .version('7.0.0')
    .alias('version', 'V')
    .argv;

  try {
    console.log(chalk.bold.cyan('\n🚀 Coffee Vault Data Extraction Pipeline'));
    console.log(chalk.gray('Version 7.0.0\n'));

    if (argv.dryRun) {
      console.log(chalk.yellow('⚠️  DRY RUN MODE - No files will be written\n'));
    }

    if (argv.force) {
      console.log(chalk.yellow('⚡ FORCE MODE - Ignoring cache, re-extracting all files\n'));
    }

    // Run extraction
    const results = await extractVaultData(argv);

    // Print report
    printReport(results, argv);

    // Exit with appropriate code
    process.exit(results.errorFiles > 0 ? 1 : 0);
  } catch (error) {
    console.error(chalk.red.bold('\n❌ Fatal Error:'));
    console.error(chalk.red(error.message));
    if (argv.verbose) {
      console.error(chalk.gray(error.stack));
    }
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { extractVaultData, printReport };
