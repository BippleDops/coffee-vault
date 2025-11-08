#!/usr/bin/env node

/**
 * Data Loader Library - Coffee Vault 7.0
 * Reusable functions for extracting data from markdown files
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import matter from 'gray-matter';
import { glob } from 'glob';

/**
 * Parse a markdown file and extract frontmatter + content
 * @param {string} filepath - Absolute path to markdown file
 * @returns {Object} - {frontmatter, content, error}
 */
export function parseMarkdownFile(filepath) {
  try {
    const fileContent = fs.readFileSync(filepath, 'utf-8');
    const parsed = matter(fileContent);

    return {
      frontmatter: parsed.data,
      content: parsed.content,
      error: null
    };
  } catch (error) {
    return {
      frontmatter: null,
      content: null,
      error: error.message
    };
  }
}

/**
 * Extract entity data from a parsed markdown file
 * @param {string} filepath - Absolute path to the file
 * @param {string} entityType - Type of entity (coffee-log, bean-profile, etc.)
 * @returns {Object|null} - Structured entity object or null
 */
export function extractEntity(filepath, entityType) {
  const parsed = parseMarkdownFile(filepath);

  if (parsed.error || !parsed.frontmatter) {
    return null;
  }

  const entity = {
    ...parsed.frontmatter,
    _filepath: filepath,
    _filename: path.basename(filepath),
    _entityType: entityType
  };

  return entity;
}

/**
 * Calculate MD5 hash of file content
 * @param {string} filepath - Path to file
 * @returns {string} - MD5 hash
 */
export function calculateFileHash(filepath) {
  try {
    const content = fs.readFileSync(filepath, 'utf-8');
    return crypto.createHash('md5').update(content).digest('hex');
  } catch (error) {
    return null;
  }
}

/**
 * Cache Manager - Manages file change detection
 */
export class CacheManager {
  constructor(cacheFilePath) {
    this.cacheFilePath = cacheFilePath;
    this.cache = this.loadCache();
  }

  /**
   * Load cache from disk
   * @returns {Object} - Cache object
   */
  loadCache() {
    try {
      if (fs.existsSync(this.cacheFilePath)) {
        const content = fs.readFileSync(this.cacheFilePath, 'utf-8');
        return JSON.parse(content);
      }
    } catch (error) {
      // Cache corrupted or unreadable, start fresh
    }
    return {};
  }

  /**
   * Check if file has changed since last extraction
   * @param {string} filepath - Path to file
   * @returns {boolean} - True if changed or new
   */
  isChanged(filepath) {
    const currentHash = calculateFileHash(filepath);
    if (!currentHash) return true; // File unreadable, consider changed

    const cachedHash = this.cache[filepath];
    return cachedHash !== currentHash;
  }

  /**
   * Update cache with new hash
   * @param {string} filepath - Path to file
   * @param {string} hash - File hash
   */
  updateCache(filepath, hash) {
    this.cache[filepath] = hash || calculateFileHash(filepath);
  }

  /**
   * Save cache to disk
   */
  saveCache() {
    try {
      const dir = path.dirname(this.cacheFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.cacheFilePath, JSON.stringify(this.cache, null, 2));
    } catch (error) {
      console.error('Failed to save cache:', error.message);
    }
  }

  /**
   * Clear all cache
   */
  clearCache() {
    this.cache = {};
    this.saveCache();
  }
}

/**
 * JSON Exporter - Writes JSON data to files
 */
export class JSONExporter {
  constructor(outputDir) {
    this.outputDir = outputDir;
  }

  /**
   * Write data to JSON file
   * @param {Object} data - Data to write
   * @param {string} filename - Output filename (without path)
   * @param {boolean} pretty - Pretty print JSON
   */
  write(data, filename, pretty = true) {
    try {
      if (!fs.existsSync(this.outputDir)) {
        fs.mkdirSync(this.outputDir, { recursive: true });
      }

      const filepath = path.join(this.outputDir, filename);
      const jsonContent = pretty
        ? JSON.stringify(data, null, 2)
        : JSON.stringify(data);

      fs.writeFileSync(filepath, jsonContent);
      return filepath;
    } catch (error) {
      throw new Error(`Failed to write ${filename}: ${error.message}`);
    }
  }

  /**
   * Read JSON file
   * @param {string} filename - Filename to read
   * @returns {Object|null} - Parsed JSON or null
   */
  read(filename) {
    try {
      const filepath = path.join(this.outputDir, filename);
      if (fs.existsSync(filepath)) {
        const content = fs.readFileSync(filepath, 'utf-8');
        return JSON.parse(content);
      }
    } catch (error) {
      console.error(`Failed to read ${filename}:`, error.message);
    }
    return null;
  }
}

/**
 * Performance Monitor - Tracks and reports execution times
 */
export class PerformanceMonitor {
  constructor() {
    this.timers = new Map();
    this.results = new Map();
  }

  /**
   * Start timing an operation
   * @param {string} label - Operation label
   */
  start(label) {
    this.timers.set(label, Date.now());
  }

  /**
   * End timing an operation
   * @param {string} label - Operation label
   * @returns {number} - Elapsed time in ms
   */
  end(label) {
    const startTime = this.timers.get(label);
    if (!startTime) {
      console.warn(`No timer started for: ${label}`);
      return 0;
    }

    const elapsed = Date.now() - startTime;
    this.results.set(label, elapsed);
    this.timers.delete(label);
    return elapsed;
  }

  /**
   * Get timing result
   * @param {string} label - Operation label
   * @returns {number} - Elapsed time in ms
   */
  get(label) {
    return this.results.get(label) || 0;
  }

  /**
   * Get all results
   * @returns {Object} - All timing results
   */
  getAll() {
    return Object.fromEntries(this.results);
  }

  /**
   * Generate performance report
   * @returns {string} - Formatted report
   */
  report() {
    const lines = ['Performance Report:'];
    for (const [label, time] of this.results.entries()) {
      lines.push(`  ${label}: ${time}ms (${(time / 1000).toFixed(2)}s)`);
    }
    return lines.join('\n');
  }

  /**
   * Reset all timers and results
   */
  reset() {
    this.timers.clear();
    this.results.clear();
  }
}

/**
 * Scan directory for markdown files
 * @param {string} directory - Directory to scan
 * @param {string} vaultRoot - Vault root path
 * @returns {Promise<Array>} - Array of file paths
 */
export async function scanDirectory(directory, vaultRoot) {
  const pattern = path.join(vaultRoot, directory, '**/*.md');
  try {
    const files = await glob(pattern, {
      ignore: ['**/node_modules/**', '**/.git/**', '**/Templates/**'],
      absolute: true
    });
    return files;
  } catch (error) {
    console.error(`Error scanning ${directory}:`, error.message);
    return [];
  }
}

/**
 * Get file stats
 * @param {string} filepath - Path to file
 * @returns {Object|null} - File stats or null
 */
export function getFileStats(filepath) {
  try {
    const stats = fs.statSync(filepath);
    return {
      size: stats.size,
      modified: stats.mtime,
      created: stats.birthtime
    };
  } catch (error) {
    return null;
  }
}

/**
 * Format file size in human-readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Ensure directory exists
 * @param {string} dirPath - Directory path
 */
export function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Count files in array by extension
 * @param {Array} files - Array of file paths
 * @returns {Object} - Count by extension
 */
export function countFilesByExtension(files) {
  const counts = {};
  for (const file of files) {
    const ext = path.extname(file);
    counts[ext] = (counts[ext] || 0) + 1;
  }
  return counts;
}

/**
 * Validate entity data
 * @param {Object} entity - Entity object
 * @param {Array} requiredFields - Required field names
 * @returns {Object} - {isValid, missingFields}
 */
export function validateEntity(entity, requiredFields = []) {
  if (!entity || typeof entity !== 'object') {
    return { isValid: false, missingFields: ['entity'] };
  }

  const missingFields = requiredFields.filter(field => !(field in entity));
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

/**
 * Batch process files with progress callback
 * @param {Array} files - Array of file paths
 * @param {Function} processor - Function to process each file
 * @param {Function} progressCallback - Called with (current, total)
 * @returns {Promise<Array>} - Processing results
 */
export async function batchProcess(files, processor, progressCallback = null) {
  const results = [];

  for (let i = 0; i < files.length; i++) {
    const result = await processor(files[i], i);
    results.push(result);

    if (progressCallback) {
      progressCallback(i + 1, files.length);
    }
  }

  return results;
}

export default {
  parseMarkdownFile,
  extractEntity,
  calculateFileHash,
  CacheManager,
  JSONExporter,
  PerformanceMonitor,
  scanDirectory,
  getFileStats,
  formatFileSize,
  ensureDirectoryExists,
  countFilesByExtension,
  validateEntity,
  batchProcess
};
