#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

console.log('🔧 Fixing YAML errors in vault files...\n');

let fixedCount = 0;

// Fix 1: Recipe files with bad requires indentation
console.log('📝 Fixing Recipe files...');
const recipeFiles = glob.sync('Recipes/*.md', { cwd: '/home/user/coffee-vault' });

for (const file of recipeFiles) {
  const filePath = path.join('/home/user/coffee-vault', file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix the requires field - convert from flow array to proper YAML array
  // Match the entire line including all items
  const requiresRegex = /^(\s+)requires:\s*(.+)$/gm;

  if (content.includes('requires:')) {
    content = content.replace(requiresRegex, (match, indent, itemsLine) => {
      // Check if this line has wikilinks
      if (!itemsLine.includes('[[')) {
        return match; // Leave as-is if no wikilinks
      }

      // Extract all wikilink items
      const wikilinks = itemsLine.match(/\[\[([^\]]+)\]\]/g);
      if (!wikilinks || wikilinks.length === 0) {
        return match;
      }

      // Convert to proper YAML array
      const yamlArray = wikilinks.map(link => `${indent}  - "${link}"`).join('\n');
      return `${indent}requires:\n${yamlArray}`;
    });

    fs.writeFileSync(filePath, content);
    fixedCount++;
    console.log(`  ✓ Fixed ${file}`);
  }
}

// Fix 2: Producer files with duplicate type field
console.log('\n📝 Fixing Producer files...');
const producerFiles = glob.sync('Producers/*.md', { cwd: '/home/user/coffee-vault' });

for (const file of producerFiles) {
  const filePath = path.join('/home/user/coffee-vault', file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if there are two type: fields
  const typeMatches = content.match(/^type:\s+(.+)$/gm);

  if (typeMatches && typeMatches.length > 1) {
    // Replace the second occurrence with producer-category:
    let typeCount = 0;
    content = content.replace(/^type:\s+(.+)$/gm, (match, value) => {
      typeCount++;
      if (typeCount === 2) {
        return `producer-category: ${value}`;
      }
      return match;
    });

    fs.writeFileSync(filePath, content);
    fixedCount++;
    console.log(`  ✓ Fixed ${file}`);
  }
}

// Fix 3: Template files with various YAML errors
console.log('\n📝 Fixing Template files...');
const templateFiles = glob.sync('Templates/*.md', { cwd: '/home/user/coffee-vault' });

for (const file of templateFiles) {
  const filePath = path.join('/home/user/coffee-vault', file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Fix templater syntax in YAML (add quotes around templater expressions)
  // Pattern: value<% something %>]
  content = content.replace(/:\s*([^"\n]*?)<%(.*?)%>]/g, ': "$1<% $2 %>]"');

  // Fix comment lines in YAML frontmatter
  content = content.replace(/^(\s*)\/\//gm, '$1#');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    fixedCount++;
    console.log(`  ✓ Fixed ${file}`);
  }
}

console.log(`\n✅ Fixed ${fixedCount} files with YAML errors`);
