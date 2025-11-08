#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import matter from 'gray-matter';

console.log('🔬 Scientific Reference Citation Audit\n');

const results = {
  totalFiles: 0,
  withCitations: 0,
  withoutCitations: 0,
  verified: 0,
  needsFactCheck: [],
  needsCitations: [],
  hasCitationsGood: [],
  byCategory: {}
};

// Find all scientific reference files
const files = glob.sync('Scientific References/**/*.md', {
  cwd: '/home/user/coffee-vault',
  ignore: ['**/00-*.md', '**/.md']
});

console.log(`📚 Found ${files.length} scientific reference files\n`);

for (const file of files) {
  const filePath = path.join('/home/user/coffee-vault', file);
  const content = fs.readFileSync(filePath, 'utf8');

  let frontmatter, body;
  try {
    const parsed = matter(content);
    frontmatter = parsed.data;
    body = parsed.content;
  } catch (e) {
    console.log(`⚠️  Error parsing ${file}: ${e.message}`);
    continue;
  }

  results.totalFiles++;

  // Extract category
  const category = file.split('/')[1] || 'Unknown';
  if (!results.byCategory[category]) {
    results.byCategory[category] = {
      total: 0,
      withCitations: 0,
      withoutCitations: 0
    };
  }
  results.byCategory[category].total++;

  // Check for verification
  if (frontmatter.verified) {
    results.verified++;
  }

  // Check for citations in content
  const hasFurtherReading = body.includes('## 📚 Further Reading') ||
                            body.includes('## Further Reading') ||
                            body.includes('## References') ||
                            body.includes('## Sources') ||
                            body.includes('## Citations');

  const hasURLs = /https?:\/\/[^\s\)]+/.test(body);
  const hasDOI = /doi\.org|DOI:/.test(body);
  const hasBooks = /\*.*\*.*by.*|ISBN/.test(body);
  const hasPapers = /\(\d{4}\)|\[.*\]\(http/.test(body);

  const citationScore = [hasFurtherReading, hasURLs, hasDOI, hasBooks, hasPapers].filter(Boolean).length;

  const fileInfo = {
    file: file,
    category: category,
    verified: frontmatter.verified || false,
    hasFurtherReading: hasFurtherReading,
    hasURLs: hasURLs,
    hasDOI: hasDOI,
    hasBooks: hasBooks,
    hasPapers: hasPapers,
    citationScore: citationScore,
    wordCount: body.split(/\s+/).length
  };

  if (citationScore >= 2) {
    results.withCitations++;
    results.byCategory[category].withCitations++;
    results.hasCitationsGood.push(fileInfo);
  } else {
    results.withoutCitations++;
    results.byCategory[category].withoutCitations++;
    results.needsCitations.push(fileInfo);
  }

  if (!frontmatter.verified) {
    results.needsFactCheck.push(fileInfo);
  }
}

// Print results
console.log('📊 AUDIT RESULTS\n');
console.log(`Total Scientific References: ${results.totalFiles}`);
console.log(`With Good Citations (score ≥2): ${results.withCitations} (${(results.withCitations/results.totalFiles*100).toFixed(1)}%)`);
console.log(`Needs Citations (score <2): ${results.withoutCitations} (${(results.withoutCitations/results.totalFiles*100).toFixed(1)}%)`);
console.log(`Already Verified: ${results.verified} (${(results.verified/results.totalFiles*100).toFixed(1)}%)`);
console.log(`Needs Fact-Checking: ${results.needsFactCheck.length} (${(results.needsFactCheck.length/results.totalFiles*100).toFixed(1)}%)`);

console.log('\n📂 BY CATEGORY:\n');
for (const [category, stats] of Object.entries(results.byCategory)) {
  const pct = (stats.withCitations / stats.total * 100).toFixed(0);
  console.log(`${category}: ${stats.total} files, ${stats.withCitations} with citations (${pct}%)`);
}

console.log('\n❌ TOP 20 FILES NEEDING CITATIONS:\n');
results.needsCitations
  .sort((a, b) => b.wordCount - a.wordCount)
  .slice(0, 20)
  .forEach((f, i) => {
    console.log(`${i+1}. ${f.file.split('/').pop()} (${f.wordCount} words, score: ${f.citationScore})`);
  });

// Save detailed report
const reportPath = '/home/user/coffee-vault/.vault-meta/reports/citation-audit-v8.0.md';
let report = `# Citation Audit Report v8.0

**Generated**: ${new Date().toISOString()}
**Total Scientific References Analyzed**: ${results.totalFiles}

## Executive Summary

- ✅ **With Good Citations** (score ≥2): ${results.withCitations} (${(results.withCitations/results.totalFiles*100).toFixed(1)}%)
- ❌ **Needs Citations** (score <2): ${results.withoutCitations} (${(results.withoutCitations/results.totalFiles*100).toFixed(1)}%)
- 🔍 **Needs Fact-Checking**: ${results.needsFactCheck.length} (${(results.needsFactCheck.length/results.totalFiles*100).toFixed(1)}%)
- ✓ **Already Verified**: ${results.verified} (${(results.verified/results.totalFiles*100).toFixed(1)}%)

## Citation Scoring

Files are scored 0-5 based on presence of:
1. Further Reading / References section
2. URLs to sources
3. DOI links
4. Books cited
5. Papers cited (with years)

**Target**: All files should have score ≥2 (minimum 2 authoritative sources)

## By Category

| Category | Total | With Citations | % |
|----------|-------|----------------|---|
`;

for (const [category, stats] of Object.entries(results.byCategory).sort((a, b) => b[1].total - a[1].total)) {
  const pct = (stats.withCitations / stats.total * 100).toFixed(1);
  report += `| ${category} | ${stats.total} | ${stats.withCitations} | ${pct}% |\n`;
}

report += `\n## Files Needing Citations (${results.needsCitations.length} files)\n\n`;
report += '| File | Category | Word Count | Citation Score |\n';
report += '|------|----------|------------|----------------|\n';

results.needsCitations
  .sort((a, b) => b.wordCount - a.wordCount)
  .forEach(f => {
    report += `| ${f.file.split('/').pop()} | ${f.category} | ${f.wordCount} | ${f.citationScore} |\n`;
  });

report += `\n## Files With Good Citations (${results.hasCitationsGood.length} files)\n\n`;
report += '| File | Category | Citation Score |\n';
report += '|------|----------|----------------|\n';

results.hasCitationsGood
  .sort((a, b) => b.citationScore - a.citationScore)
  .forEach(f => {
    report += `| ${f.file.split('/').pop()} | ${f.category} | ${f.citationScore}/5 |\n`;
  });

report += `\n## Recommendations for v8.0

### Immediate Actions

1. **Add citations to ${results.needsCitations.length} files** lacking sufficient sources
   - Target: Minimum 2 authoritative sources per file
   - Priority: Files with highest word count (most substantial content)

2. **Fact-check all ${results.needsFactCheck.length} unverified files**
   - Verify scientific claims against authoritative sources
   - Add \`verified: true\` to frontmatter
   - Add \`verification-date: ${new Date().toISOString().split('T')[0]}\` to frontmatter

3. **Citation format standardization**
   - Use APA format for all citations
   - Include DOI where available
   - Link to accessible sources
   - Add publication dates

### Success Metrics for v8.0

- ✅ 100% of files have citation score ≥2
- ✅ 100% of files have \`verified: true\` in frontmatter
- ✅ All scientific claims backed by authoritative sources
- ✅ All URLs tested and working

### High-Priority Files for Citation Addition

Top 10 files by word count needing citations:
${results.needsCitations.slice(0, 10).map((f, i) => `${i+1}. ${f.file} (${f.wordCount} words)`).join('\n')}

---

**Report Generated**: ${new Date().toISOString()}
`;

fs.writeFileSync(reportPath, report);
console.log(`\n✅ Detailed report saved to: ${reportPath}`);

// Save JSON data for programmatic access
const jsonPath = '/home/user/coffee-vault/.vault-meta/reports/citation-audit-data.json';
fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
console.log(`✅ JSON data saved to: ${jsonPath}`);
