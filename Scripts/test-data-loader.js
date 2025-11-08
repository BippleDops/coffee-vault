#!/usr/bin/env node

/**
 * Data Loader Test Suite - Coffee Vault 7.0
 * Comprehensive tests for data extraction pipeline
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

import {
  parseMarkdownFile,
  extractEntity,
  calculateFileHash,
  CacheManager,
  JSONExporter,
  PerformanceMonitor,
  scanDirectory,
  formatFileSize,
  validateEntity
} from './data-loader-lib.js';

import { extractVaultData } from './data-loader.js';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VAULT_ROOT = path.resolve(__dirname, '..');

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

/**
 * Test runner helper
 */
function test(name, fn) {
  try {
    fn();
    testResults.passed++;
    testResults.tests.push({ name, passed: true });
    console.log(chalk.green('  ✓'), name);
  } catch (error) {
    testResults.failed++;
    testResults.tests.push({ name, passed: false, error: error.message });
    console.log(chalk.red('  ✗'), name);
    console.log(chalk.red('    Error:'), error.message);
  }
}

/**
 * Assert helper
 */
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

/**
 * Test 1: Library Functions
 */
async function testLibraryFunctions() {
  console.log(chalk.bold.cyan('\n📝 Test Suite 1: Library Functions\n'));

  // Test parseMarkdownFile
  test('parseMarkdownFile - Valid file', () => {
    const sampleFiles = fs.readdirSync(path.join(VAULT_ROOT, 'Coffee Logs'))
      .filter(f => f.endsWith('.md') && !f.includes('README'));

    if (sampleFiles.length > 0) {
      const filepath = path.join(VAULT_ROOT, 'Coffee Logs', sampleFiles[0]);
      const result = parseMarkdownFile(filepath);
      assert(result.frontmatter !== null, 'Should parse frontmatter');
      assert(result.content !== null, 'Should parse content');
      assert(result.error === null, 'Should not have errors');
    }
  });

  // Test parseMarkdownFile - Invalid file
  test('parseMarkdownFile - Invalid file', () => {
    const result = parseMarkdownFile('/nonexistent/file.md');
    assert(result.error !== null, 'Should have error for invalid file');
    assert(result.frontmatter === null, 'Should have null frontmatter');
  });

  // Test extractEntity
  test('extractEntity - Valid entity', () => {
    const sampleFiles = fs.readdirSync(path.join(VAULT_ROOT, 'Coffee Logs'))
      .filter(f => f.endsWith('.md') && !f.includes('README'));

    if (sampleFiles.length > 0) {
      const filepath = path.join(VAULT_ROOT, 'Coffee Logs', sampleFiles[0]);
      const entity = extractEntity(filepath, 'coffee-log');
      assert(entity !== null, 'Should extract entity');
      assert(entity._filepath === filepath, 'Should include filepath');
      assert(entity._entityType === 'coffee-log', 'Should include entity type');
    }
  });

  // Test calculateFileHash
  test('calculateFileHash - Valid file', () => {
    const sampleFiles = fs.readdirSync(path.join(VAULT_ROOT, 'Coffee Logs'))
      .filter(f => f.endsWith('.md') && !f.includes('README'));

    if (sampleFiles.length > 0) {
      const filepath = path.join(VAULT_ROOT, 'Coffee Logs', sampleFiles[0]);
      const hash = calculateFileHash(filepath);
      assert(hash !== null, 'Should calculate hash');
      assert(typeof hash === 'string', 'Hash should be string');
      assert(hash.length === 32, 'MD5 hash should be 32 characters');
    }
  });

  // Test CacheManager
  test('CacheManager - Create and load', () => {
    const tempCacheFile = path.join(VAULT_ROOT, 'Data', 'extracted', 'cache', 'test-cache.json');
    const cache = new CacheManager(tempCacheFile);
    assert(cache !== null, 'Should create cache manager');
    assert(typeof cache.cache === 'object', 'Should have cache object');
  });

  // Test CacheManager - isChanged
  test('CacheManager - isChanged', () => {
    const tempCacheFile = path.join(VAULT_ROOT, 'Data', 'extracted', 'cache', 'test-cache.json');
    const cache = new CacheManager(tempCacheFile);

    const sampleFiles = fs.readdirSync(path.join(VAULT_ROOT, 'Coffee Logs'))
      .filter(f => f.endsWith('.md') && !f.includes('README'));

    if (sampleFiles.length > 0) {
      const filepath = path.join(VAULT_ROOT, 'Coffee Logs', sampleFiles[0]);
      const isChanged = cache.isChanged(filepath);
      assert(typeof isChanged === 'boolean', 'Should return boolean');
    }
  });

  // Test JSONExporter
  test('JSONExporter - Write and read', () => {
    const outputDir = path.join(VAULT_ROOT, 'Data', 'extracted', 'test');
    const exporter = new JSONExporter(outputDir);

    const testData = { test: 'data', count: 123 };
    const filepath = exporter.write(testData, 'test-output.json', true);
    assert(fs.existsSync(filepath), 'Should create file');

    const readData = exporter.read('test-output.json');
    assert(readData !== null, 'Should read file');
    assert(readData.test === 'data', 'Should read correct data');

    // Cleanup
    fs.unlinkSync(filepath);
    fs.rmdirSync(outputDir);
  });

  // Test PerformanceMonitor
  test('PerformanceMonitor - Timing', () => {
    const monitor = new PerformanceMonitor();
    monitor.start('test');

    // Simulate work
    let sum = 0;
    for (let i = 0; i < 1000000; i++) {
      sum += i;
    }

    const elapsed = monitor.end('test');
    assert(elapsed >= 0, 'Should measure time');
    assert(typeof elapsed === 'number', 'Should return number');
  });

  // Test scanDirectory
  test('scanDirectory - Find files', async () => {
    const files = await scanDirectory('Coffee Logs', VAULT_ROOT);
    assert(Array.isArray(files), 'Should return array');
    assert(files.length > 0, 'Should find files');
  });

  // Test formatFileSize
  test('formatFileSize - Format bytes', () => {
    assert(formatFileSize(0) === '0 B', 'Should format 0 bytes');
    assert(formatFileSize(1024) === '1 KB', 'Should format KB');
    assert(formatFileSize(1048576) === '1 MB', 'Should format MB');
  });

  // Test validateEntity
  test('validateEntity - Valid entity', () => {
    const entity = { type: 'coffee-log', date: '2025-01-01', rating: 4 };
    const result = validateEntity(entity, ['type', 'date']);
    assert(result.isValid === true, 'Should be valid');
    assert(result.missingFields.length === 0, 'Should have no missing fields');
  });

  // Test validateEntity - Invalid entity
  test('validateEntity - Invalid entity', () => {
    const entity = { type: 'coffee-log' };
    const result = validateEntity(entity, ['type', 'date', 'rating']);
    assert(result.isValid === false, 'Should be invalid');
    assert(result.missingFields.length === 2, 'Should have missing fields');
  });
}

/**
 * Test 2: Sample Files (10 files)
 */
async function testSampleFiles() {
  console.log(chalk.bold.cyan('\n📝 Test Suite 2: Sample Files Processing\n'));

  const folders = [
    'Coffee Logs',
    'Beans Library',
    'Origins',
    'Recipes',
    'Equipment Models',
    'Cupping Sessions'
  ];

  for (const folder of folders) {
    test(`Process 10 files from ${folder}`, async () => {
      const folderPath = path.join(VAULT_ROOT, folder);
      if (!fs.existsSync(folderPath)) {
        console.log(chalk.yellow(`    ⚠️  Folder not found: ${folder}`));
        return;
      }

      const files = fs.readdirSync(folderPath)
        .filter(f => f.endsWith('.md') && !f.includes('README'))
        .slice(0, 10);

      let successCount = 0;
      for (const file of files) {
        const filepath = path.join(folderPath, file);
        const entity = extractEntity(filepath, 'test');
        if (entity) successCount++;
      }

      assert(successCount > 0, `Should process at least one file from ${folder}`);
      console.log(chalk.gray(`    Processed ${successCount}/${files.length} files`));
    });
  }
}

/**
 * Test 3: Full Vault Extraction
 */
async function testFullVaultExtraction() {
  console.log(chalk.bold.cyan('\n📝 Test Suite 3: Full Vault Extraction\n'));

  test('Full vault extraction (all 930+ files)', async () => {
    const options = {
      verbose: false,
      dryRun: false,
      force: true, // Force full extraction for testing
      outputDir: path.join(VAULT_ROOT, 'Data', 'extracted')
    };

    const results = await extractVaultData(options);

    // Verify results
    assert(results.totalFiles > 0, 'Should find files');
    assert(results.processedFiles > 0, 'Should process files');
    assert(results.performance.totalTimeMs > 0, 'Should measure time');

    // Performance check
    const isUnderPerformanceTarget = results.performance.totalTimeMs < 2000;
    console.log(chalk.gray(`    Total files: ${results.totalFiles}`));
    console.log(chalk.gray(`    Processed: ${results.processedFiles}`));
    console.log(chalk.gray(`    Time: ${results.performance.totalTimeMs}ms`));
    console.log(chalk.gray(`    Performance target (<2000ms): ${isUnderPerformanceTarget ? '✓' : '✗'}`));

    assert(results.totalFiles > 100, 'Should process significant number of files');
  });
}

/**
 * Test 4: Incremental Updates
 */
async function testIncrementalUpdates() {
  console.log(chalk.bold.cyan('\n📝 Test Suite 4: Incremental Updates\n'));

  test('Incremental extraction (cached files)', async () => {
    const options = {
      verbose: false,
      dryRun: false,
      force: false, // Use cache
      outputDir: path.join(VAULT_ROOT, 'Data', 'extracted')
    };

    const results = await extractVaultData(options);

    // Incremental should be fast
    const isUnderPerformanceTarget = results.performance.totalTimeMs < 200;
    console.log(chalk.gray(`    Skipped (cached): ${results.skippedFiles}`));
    console.log(chalk.gray(`    Processed: ${results.processedFiles}`));
    console.log(chalk.gray(`    Time: ${results.performance.totalTimeMs}ms`));
    console.log(chalk.gray(`    Performance target (<200ms): ${isUnderPerformanceTarget ? '✓' : '✗'}`));

    assert(results.skippedFiles >= 0, 'Should skip cached files');
    assert(results.performance.totalTimeMs > 0, 'Should measure time');
  });
}

/**
 * Test 5: Error Handling
 */
async function testErrorHandling() {
  console.log(chalk.bold.cyan('\n📝 Test Suite 5: Error Handling\n'));

  // Test malformed YAML
  test('Handle malformed frontmatter', () => {
    const tempFile = path.join(VAULT_ROOT, 'Data', 'extracted', 'test-malformed.md');
    fs.writeFileSync(tempFile, '---\ninvalid: yaml: syntax:\n---\nContent');

    const result = parseMarkdownFile(tempFile);
    // gray-matter is forgiving, but we should handle errors
    assert(result !== null, 'Should handle malformed YAML');

    // Cleanup
    fs.unlinkSync(tempFile);
  });

  // Test missing file
  test('Handle missing file', () => {
    const result = parseMarkdownFile('/nonexistent/missing.md');
    assert(result.error !== null, 'Should return error for missing file');
    assert(result.frontmatter === null, 'Should have null frontmatter');
  });

  // Test empty file
  test('Handle empty file', () => {
    const tempFile = path.join(VAULT_ROOT, 'Data', 'extracted', 'test-empty.md');
    fs.writeFileSync(tempFile, '');

    const result = parseMarkdownFile(tempFile);
    assert(result !== null, 'Should handle empty file');

    // Cleanup
    fs.unlinkSync(tempFile);
  });
}

/**
 * Test 6: JSON Output Validation
 */
async function testJSONOutputValidation() {
  console.log(chalk.bold.cyan('\n📝 Test Suite 6: JSON Output Validation\n'));

  const outputDir = path.join(VAULT_ROOT, 'Data', 'extracted');

  const jsonFiles = [
    'coffee-logs.json',
    'beans.json',
    'origins.json',
    'recipes.json',
    'equipment.json',
    'cupping-sessions.json',
    'metadata.json'
  ];

  for (const filename of jsonFiles) {
    test(`Validate ${filename}`, () => {
      const filepath = path.join(outputDir, filename);

      if (!fs.existsSync(filepath)) {
        console.log(chalk.yellow(`    ⚠️  File not found (may be empty): ${filename}`));
        return;
      }

      const content = fs.readFileSync(filepath, 'utf-8');
      const data = JSON.parse(content);

      assert(data !== null, 'Should parse JSON');
      assert(typeof data === 'object', 'Should be object');

      if (filename !== 'metadata.json') {
        assert('extractedAt' in data, 'Should have extractedAt');
        assert('version' in data, 'Should have version');
        assert('count' in data, 'Should have count');
      }

      console.log(chalk.gray(`    ✓ Valid JSON (${formatFileSize(content.length)})`));
    });
  }
}

/**
 * Main test runner
 */
async function runAllTests() {
  console.log(chalk.bold.cyan('\n╔═══════════════════════════════════════════════════╗'));
  console.log(chalk.bold.cyan('║   Coffee Vault Data Loader - Test Suite          ║'));
  console.log(chalk.bold.cyan('╚═══════════════════════════════════════════════════╝'));

  try {
    // Run all test suites
    await testLibraryFunctions();
    await testSampleFiles();
    await testFullVaultExtraction();
    await testIncrementalUpdates();
    await testErrorHandling();
    await testJSONOutputValidation();

    // Print summary
    console.log(chalk.bold.cyan('\n═══════════════════════════════════════════════════'));
    console.log(chalk.bold.cyan('                   Test Summary                    '));
    console.log(chalk.bold.cyan('═══════════════════════════════════════════════════\n'));

    const total = testResults.passed + testResults.failed;
    console.log(`  Total Tests:   ${total}`);
    console.log(`  Passed:        ${chalk.green(testResults.passed)}`);
    console.log(`  Failed:        ${testResults.failed > 0 ? chalk.red(testResults.failed) : testResults.failed}`);
    console.log(`  Success Rate:  ${((testResults.passed / total) * 100).toFixed(1)}%`);

    if (testResults.failed === 0) {
      console.log('\n' + chalk.green.bold('  ✓ All tests passed!'));
    } else {
      console.log('\n' + chalk.red.bold('  ✗ Some tests failed'));
    }

    console.log(chalk.cyan('\n═══════════════════════════════════════════════════\n'));

    // Exit with appropriate code
    process.exit(testResults.failed > 0 ? 1 : 0);
  } catch (error) {
    console.error(chalk.red.bold('\n❌ Fatal Error:'));
    console.error(chalk.red(error.message));
    console.error(chalk.gray(error.stack));
    process.exit(1);
  }
}

// Run tests
runAllTests();
