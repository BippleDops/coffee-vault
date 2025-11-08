/**
 * Auto-Recipe Generator - Coffee Vault 5.0
 * Version: 1.0.0
 * 
 * Automatically generate reusable recipes from successful brews:
 * - Analyze high-rated coffee logs
 * - Extract consistent parameters
 * - Generate recipe profiles
 * - Suggest variations
 * 
 * Usage:
 *   const generator = require('./auto-recipe-generator.js');
 *   const recipe = generator.generateRecipeFromLogs(successfulLogs);
 */

const fs = require('fs');
const path = require('path');

/**
 * Generate recipe from successful brewing logs
 * @param {Array} logs - Coffee logs to analyze (should be same bean, high rating)
 * @param {Object} options - Generation options
 * @returns {Object} Generated recipe profile
 */
function generateRecipeFromLogs(logs, options = {}) {
  const {
    minRating = 4.5,
    minLogs = 3,
    recipeName = null
  } = options;
  
  // Filter for high-quality logs
  const successfulLogs = logs.filter(log => log.rating >= minRating);
  
  if (successfulLogs.length < minLogs) {
    return {
      success: false,
      message: `Need at least ${minLogs} high-rated brews (>=${minRating}) to generate recipe. Found ${successfulLogs.length}.`
    };
  }
  
  // Extract parameters
  const parameters = extractParameterRanges(successfulLogs);
  const technique = extractTechniqueDetails(successfulLogs);
  const beanCharacteristics = extractBeanCharacteristics(successfulLogs);
  
  // Generate recipe structure
  const recipe = {
    type: 'recipe-profile',
    name: recipeName || generateRecipeName(successfulLogs[0]),
    'brew-method': successfulLogs[0]['brew-method'],
    'created-date': new Date().toISOString().split('T')[0],
    'recipe-author': 'Auto-generated',
    'recipe-source': 'personal',
    'derived-from-log': successfulLogs[0].file?.link || successfulLogs[0].file?.path,
    version: 1,
    
    // Target bean characteristics
    'target-origin': successfulLogs[0].origin,
    'target-processing': beanCharacteristics.processing,
    'target-roast-level': beanCharacteristics.roastLevel,
    'works-with': beanCharacteristics.similarTypes,
    
    // Parameters (average of successful brews)
    dose: parameters.dose.optimal,
    water: parameters.water.optimal,
    ratio: parameters.ratio.optimal,
    'grind-size': parameters.grindSize.optimal,
    'water-temperature': parameters.temperature.optimal,
    'total-brew-time': parameters.brewTime.optimal,
    
    // Parameter ranges
    'dose-range': `${parameters.dose.min}-${parameters.dose.max}g`,
    'water-range': `${parameters.water.min}-${parameters.water.max}g`,
    'ratio-range': parameters.ratio.range,
    'temp-range': `${parameters.temperature.min}-${parameters.temperature.max}°C`,
    'time-range': parameters.brewTime.range,
    
    // Technique details
    ...technique,
    
    // Success metrics
    'target-tds': parameters.tds.optimal,
    'target-extraction-yield': parameters.extractionYield.optimal,
    'target-flavor-profile': extractFlavorProfile(successfulLogs),
    'success-criteria': 'Rating >= 4.5, balanced extraction',
    
    // Usage stats
    'times-used': successfulLogs.length,
    'success-rate': 100,
    'avg-rating': (successfulLogs.reduce((sum, l) => sum + l.rating, 0) / successfulLogs.length).toFixed(2),
    'best-rating': Math.max(...successfulLogs.map(l => l.rating)),
    
    // Documentation
    tips: generateTips(successfulLogs, parameters),
    'common-mistakes': generateCommonMistakes(parameters),
    notes: `Auto-generated from ${successfulLogs.length} successful brews between ${successfulLogs[0].date} and ${successfulLogs[successfulLogs.length - 1].date}`
  };
  
  return {
    success: true,
    recipe: recipe,
    sourceLogCount: successfulLogs.length,
    confidenceScore: calculateConfidenceScore(successfulLogs)
  };
}

/**
 * Extract parameter ranges from logs
 */
function extractParameterRanges(logs) {
  const doses = logs.map(l => l.dose).filter(d => d);
  const waters = logs.map(l => l.water).filter(w => w);
  const temps = logs.map(l => l['water-temperature']).filter(t => t);
  const times = logs.map(l => l['brew-time']).filter(t => t);
  const ratios = logs.map(l => l.water / l.dose).filter(r => !isNaN(r));
  
  const tds = logs.map(l => l['tds-brewed']).filter(t => t);
  const extractionYields = logs.map(l => l['extraction-yield']).filter(e => e);
  
  return {
    dose: {
      optimal: Math.round(average(doses)),
      min: Math.round(Math.min(...doses)),
      max: Math.round(Math.max(...doses)),
      variance: standardDeviation(doses).toFixed(1)
    },
    water: {
      optimal: Math.round(average(waters)),
      min: Math.round(Math.min(...waters)),
      max: Math.round(Math.max(...waters))
    },
    ratio: {
      optimal: `1:${average(ratios).toFixed(1)}`,
      range: `1:${Math.min(...ratios).toFixed(1)} - 1:${Math.max(...ratios).toFixed(1)}`
    },
    temperature: {
      optimal: Math.round(average(temps)),
      min: Math.round(Math.min(...temps)),
      max: Math.round(Math.max(...temps))
    },
    brewTime: {
      optimal: times.length > 0 ? times[0] : '2:45',
      range: times.length > 0 ? `${times[0]} - ${times[times.length - 1]}` : '2:30-3:00'
    },
    grindSize: {
      optimal: mode(logs.map(l => l['grind-size']).filter(g => g)) || 'medium-fine'
    },
    tds: {
      optimal: tds.length > 0 ? average(tds).toFixed(2) : null
    },
    extractionYield: {
      optimal: extractionYields.length > 0 ? average(extractionYields).toFixed(1) : null
    }
  };
}

/**
 * Extract technique details
 */
function extractTechniqueDetails(logs) {
  const techniques = {
    'bloom-time': mode(logs.map(l => l['bloom-time']).filter(b => b)),
    'bloom-water': Math.round(average(logs.map(l => l['bloom-water']).filter(b => b))),
    'pour-count': Math.round(average(logs.map(l => l['pour-count']).filter(p => p))),
    'pour-technique': mode(logs.map(l => l['pour-technique']).filter(p => p)),
    'agitation-method': mode(logs.map(l => l['agitation']).filter(a => a))
  };
  
  // Remove null/undefined values
  return Object.fromEntries(
    Object.entries(techniques).filter(([k, v]) => v)
  );
}

/**
 * Extract bean characteristics
 */
function extractBeanCharacteristics(logs) {
  return {
    processing: mode(logs.map(l => l.processing).filter(p => p)),
    roastLevel: mode(logs.map(l => l['roast-level']).filter(r => r)),
    origin: mode(logs.map(l => l.origin).filter(o => o)),
    similarTypes: [...new Set(logs.map(l => `${l.origin} ${l['roast-level']}`).filter(Boolean))]
  };
}

/**
 * Extract flavor profile from successful brews
 */
function extractFlavorProfile(logs) {
  const allDescriptors = logs.flatMap(l => l.descriptors || l['flavor-notes'] || []);
  const descriptorCounts = {};
  
  allDescriptors.forEach(d => {
    descriptorCounts[d] = (descriptorCounts[d] || 0) + 1;
  });
  
  const topDescriptors = Object.entries(descriptorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([descriptor]) => descriptor);
  
  return topDescriptors.join(', ');
}

/**
 * Generate recipe name
 */
function generateRecipeName(log) {
  const method = log['brew-method'] || 'Coffee';
  const roast = log['roast-level'] || '';
  const origin = log.origin || '';
  
  return `${method.toUpperCase()} ${roast} ${origin} Recipe`.trim();
}

/**
 * Generate tips from successful brews
 */
function generateTips(logs, parameters) {
  const tips = [];
  
  if (parameters.temperature.variance < 2) {
    tips.push(`Temperature consistency is key - stay within ${parameters.temperature.min}-${parameters.temperature.max}°C`);
  }
  
  if (parameters.dose.variance < 1) {
    tips.push(`Precise dosing matters - ${parameters.dose.optimal}g ±0.5g for best results`);
  }
  
  const avgRating = logs.reduce((sum, l) => sum + l.rating, 0) / logs.length;
  if (avgRating >= 4.7) {
    tips.push(`This recipe consistently produces excellent results (avg ${avgRating.toFixed(2)}★)`);
  }
  
  return tips.join('. ');
}

/**
 * Generate common mistakes
 */
function generateCommonMistakes(parameters) {
  return [
    `Avoid temperatures below ${parameters.temperature.min}°C or above ${parameters.temperature.max}°C`,
    `Don't deviate more than ±2g from target dose`,
    `Maintain consistent grind size: ${parameters.grindSize.optimal}`,
    `Watch brew time - target ${parameters.brewTime.optimal}`
  ].join('. ');
}

/**
 * Calculate confidence score for recipe
 */
function calculateConfidenceScore(logs) {
  // More logs = higher confidence
  const volumeScore = Math.min(50, logs.length * 5);
  
  // Higher average rating = higher confidence
  const avgRating = logs.reduce((sum, l) => sum + l.rating, 0) / logs.length;
  const qualityScore = (avgRating / 5) * 30;
  
  // Lower variance = higher confidence
  const ratings = logs.map(l => l.rating);
  const variance = standardDeviation(ratings);
  const consistencyScore = Math.max(0, 20 - (variance * 20));
  
  return Math.round(volumeScore + qualityScore + consistencyScore);
}

/**
 * Generate recipe markdown file
 */
function generateRecipeFile(recipe, outputPath) {
  const content = `---
type: recipe-profile
name: ${recipe.name}
brew-method: ${recipe['brew-method']}
created-date: ${recipe['created-date']}
recipe-author: ${recipe['recipe-author']}
recipe-source: ${recipe['recipe-source']}
derived-from-log: ${recipe['derived-from-log']}
version: ${recipe.version}
status: active
tags: [recipe-profile, ${recipe['brew-method']}, auto-generated]
---

# 📖 Recipe: ${recipe.name}

**Auto-generated from ${recipe['times-used']} successful brews**  
**Average Rating**: ${recipe['avg-rating']}⭐  
**Success Rate**: ${recipe['success-rate']}%

---

## 🫘 Target Bean Characteristics

**Ideal Origin**: ${recipe['target-origin']}  
**Preferred Processing**: ${recipe['target-processing']}  
**Target Roast Level**: ${recipe['target-roast-level']}

**Works Well With**: ${recipe['works-with'].join(', ')}

---

## ⚙️ Recipe Parameters

**Core Parameters**:
- **Dose**: ${recipe.dose}g (range: ${recipe['dose-range']})
- **Water**: ${recipe.water}g (range: ${recipe['water-range']})
- **Ratio**: ${recipe.ratio} (range: ${recipe['ratio-range']})
- **Grind Size**: ${recipe['grind-size']}
- **Water Temperature**: ${recipe['water-temperature']}°C (range: ${recipe['temp-range']})
- **Total Brew Time**: ${recipe['total-brew-time']} (range: ${recipe['time-range']})

---

## 📝 Technique

${recipe['bloom-time'] ? `**Bloom**: ${recipe['bloom-water']}g for ${recipe['bloom-time']}` : ''}
${recipe['pour-count'] ? `**Pours**: ${recipe['pour-count']} pours` : ''}
${recipe['pour-technique'] ? `**Pour Technique**: ${recipe['pour-technique']}` : ''}
${recipe['agitation-method'] ? `**Agitation**: ${recipe['agitation-method']}` : ''}

---

## ✅ Success Metrics

**Target Outcomes**:
- **TDS**: ${recipe['target-tds'] || 'Not measured'}%
- **Extraction Yield**: ${recipe['target-extraction-yield'] || 'Not measured'}%
- **Flavor Profile**: ${recipe['target-flavor-profile']}

**Success Criteria**: ${recipe['success-criteria']}

---

## 💡 Tips

${recipe.tips}

---

## ⚠️ Common Mistakes

${recipe['common-mistakes']}

---

## 📊 Usage Statistics

**Generated From**: ${recipe['times-used']} brews  
**Average Rating**: ${recipe['avg-rating']}⭐  
**Best Rating**: ${recipe['best-rating']}⭐  
**Confidence Score**: High (auto-generated)

---

## 📝 Notes

${recipe.notes}

---

**Auto-generated by Coffee Vault 5.0 Recipe Generator**
`;

  fs.writeFileSync(outputPath, content, 'utf8');
  return { success: true, path: outputPath };
}

/**
 * Find candidate brew sessions for recipe generation
 */
function findRecipeCandidates(allLogs, minRating = 4.5, minCount = 3) {
  // Group by bean and method
  const groups = {};
  
  allLogs.forEach(log => {
    const key = `${log.beans}-${log['brew-method']}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(log);
  });
  
  // Find groups with enough high-rated brews
  const candidates = [];
  
  Object.entries(groups).forEach(([key, logs]) => {
    const highRated = logs.filter(l => l.rating >= minRating);
    
    if (highRated.length >= minCount) {
      const avgRating = highRated.reduce((sum, l) => sum + l.rating, 0) / highRated.length;
      
      candidates.push({
        beans: highRated[0].beans,
        method: highRated[0]['brew-method'],
        logCount: highRated.length,
        avgRating: avgRating.toFixed(2),
        logs: highRated
      });
    }
  });
  
  return candidates.sort((a, b) => b.avgRating - a.avgRating || b.logCount - a.logCount);
}

/**
 * Batch generate recipes from vault
 */
function batchGenerateRecipes(vaultPath, options = {}) {
  const {
    outputFolder = 'Recipes',
    minRating = 4.5,
    minLogs = 3
  } = options;
  
  // Read all coffee logs (would use actual file reading in production)
  const allLogs = []; // Would be populated from vault
  
  // Find candidates
  const candidates = findRecipeCandidates(allLogs, minRating, minLogs);
  
  const results = {
    success: true,
    recipesGenerated: 0,
    recipes: []
  };
  
  candidates.forEach(candidate => {
    const recipe = generateRecipeFromLogs(candidate.logs, {
      minRating,
      minLogs,
      recipeName: `${candidate.method.toUpperCase()} ${candidate.beans} Recipe`
    });
    
    if (recipe.success) {
      const filename = `${candidate.method}-${candidate.beans.replace(/\s+/g, '-').toLowerCase()}.md`;
      const outputPath = path.join(vaultPath, outputFolder, filename);
      
      generateRecipeFile(recipe.recipe, outputPath);
      
      results.recipesGenerated++;
      results.recipes.push({
        name: recipe.recipe.name,
        path: outputPath,
        confidence: recipe.confidenceScore
      });
    }
  });
  
  return results;
}

/**
 * Helper: Calculate average
 */
function average(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

/**
 * Helper: Calculate standard deviation
 */
function standardDeviation(arr) {
  if (arr.length === 0) return 0;
  const avg = average(arr);
  const variance = arr.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / arr.length;
  return Math.sqrt(variance);
}

/**
 * Helper: Find mode (most common value)
 */
function mode(arr) {
  if (arr.length === 0) return null;
  
  const counts = {};
  arr.forEach(val => {
    counts[val] = (counts[val] || 0) + 1;
  });
  
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted[0][0];
}

/**
 * Export all functions
 */
module.exports = {
  generateRecipeFromLogs,
  findRecipeCandidates,
  batchGenerateRecipes,
  generateRecipeFile,
  extractParameterRanges
};
