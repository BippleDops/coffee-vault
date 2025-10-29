/**
 * Pairing Recommender - Coffee Vault 5.0
 * Version: 1.0.0
 * 
 * Recommends optimal bean-method-equipment combinations based on:
 * - Current beans available
 * - Available equipment
 * - User preferences and historical success
 * - Collaborative filtering
 * - Constraint satisfaction
 * 
 * Usage:
 *   const recommender = require('./pairing-recommender.js');
 *   const recommendations = recommender.recommendPairings(context);
 */

/**
 * Pairing compatibility matrix
 * Scores how well different elements pair together
 */
const PAIRING_MATRIX = {
  // Origin-Method compatibility
  originMethod: {
    'ethiopia-v60': 95,
    'ethiopia-chemex': 90,
    'ethiopia-aeropress': 85,
    'kenya-v60': 95,
    'kenya-chemex': 88,
    'colombia-french-press': 85,
    'colombia-aeropress': 90,
    'brazil-french-press': 95,
    'brazil-espresso': 92,
    'guatemala-chemex': 90
  },
  
  // Processing-Method compatibility
  processingMethod: {
    'natural-french-press': 90,
    'natural-cold-brew': 88,
    'washed-v60': 95,
    'washed-chemex': 93,
    'honey-aeropress': 90,
    'honey-clever': 88,
    'anaerobic-v60': 85
  },
  
  // Roast-Method compatibility
  roastMethod: {
    'light-v60': 95,
    'light-chemex': 93,
    'light-aeropress': 88,
    'medium-aeropress': 92,
    'medium-french-press': 90,
    'medium-espresso': 85,
    'dark-french-press': 95,
    'dark-espresso': 93,
    'dark-moka-pot': 90
  }
};

/**
 * Recommend optimal pairings
 * @param {Object} context - Current context (beans, equipment, preferences)
 * @returns {Array} Ranked recommendations
 */
function recommendPairings(context) {
  const {
    availableBeans = [],
    availableEquipment = [],
    preferences = {},
    historicalData = []
  } = context;
  
  const recommendations = [];
  
  // Generate all possible combinations
  availableBeans.forEach(bean => {
    const compatibleMethods = getCompatibleMethods(bean);
    
    compatibleMethods.forEach(method => {
      const requiredEquipment = getRequiredEquipment(method);
      const hasEquipment = requiredEquipment.every(eq => 
        availableEquipment.some(avail => avail.type === eq)
      );
      
      if (hasEquipment) {
        const score = calculatePairingScore(bean, method, historicalData, preferences);
        
        recommendations.push({
          bean: bean,
          method: method,
          equipment: requiredEquipment,
          score: score,
          confidence: calculateConfidence(bean, method, historicalData),
          reasoning: generateReasoning(bean, method, score)
        });
      }
    });
  });
  
  // Sort by score
  return recommendations.sort((a, b) => b.score - a.score);
}

/**
 * Get compatible methods for a bean
 */
function getCompatibleMethods(bean) {
  const { origin, processing, roastLevel } = bean;
  
  // All methods are technically compatible, but some are better
  const allMethods = ['v60', 'chemex', 'aeropress', 'french-press', 'espresso', 'moka-pot', 'clever', 'kalita-wave'];
  
  // Filter based on roast level
  if (roastLevel === 'light') {
    return ['v60', 'chemex', 'aeropress', 'clever', 'kalita-wave'];
  } else if (roastLevel === 'dark') {
    return ['french-press', 'espresso', 'moka-pot', 'cold-brew'];
  }
  
  return allMethods;
}

/**
 * Calculate pairing score
 */
function calculatePairingScore(bean, method, historicalData, preferences) {
  let score = 50; // Base score
  
  // Check origin-method compatibility
  const originMethodKey = `${bean.origin?.toLowerCase()}-${method}`;
  if (PAIRING_MATRIX.originMethod[originMethodKey]) {
    score += PAIRING_MATRIX.originMethod[originMethodKey] * 0.3;
  }
  
  // Check processing-method compatibility
  const processingMethodKey = `${bean.processing?.toLowerCase()}-${method}`;
  if (PAIRING_MATRIX.processingMethod[processingMethodKey]) {
    score += PAIRING_MATRIX.processingMethod[processingMethodKey] * 0.25;
  }
  
  // Check roast-method compatibility
  const roastMethodKey = `${bean.roastLevel?.toLowerCase()}-${method}`;
  if (PAIRING_MATRIX.roastMethod[roastMethodKey]) {
    score += PAIRING_MATRIX.roastMethod[roastMethodKey] * 0.25;
  }
  
  // Historical success bonus
  const historicalMatch = historicalData.filter(h => 
    h.beans === bean.name && h.method === method && h.rating >= 4.5
  );
  if (historicalMatch.length > 0) {
    const avgHistoricalRating = historicalMatch.reduce((sum, h) => sum + h.rating, 0) / historicalMatch.length;
    score += avgHistoricalRating * 5;
  }
  
  // User preference bonus
  if (preferences.favoriteMethod === method) {
    score += 10;
  }
  if (preferences.favoriteOrigin === bean.origin) {
    score += 10;
  }
  
  return Math.min(100, Math.round(score));
}

/**
 * Calculate confidence in recommendation
 */
function calculateConfidence(bean, method, historicalData) {
  const matchCount = historicalData.filter(h => 
    h.beans === bean.name || h.method === method
  ).length;
  
  if (matchCount === 0) return 'low';
  if (matchCount < 5) return 'medium';
  return 'high';
}

/**
 * Generate human-readable reasoning
 */
function generateReasoning(bean, method, score) {
  const reasons = [];
  
  if (score >= 90) {
    reasons.push('Exceptional pairing');
  } else if (score >= 80) {
    reasons.push('Excellent pairing');
  } else if (score >= 70) {
    reasons.push('Good pairing');
  }
  
  // Add specific reasons based on characteristics
  if (bean.roastLevel === 'light' && (method === 'v60' || method === 'chemex')) {
    reasons.push('Light roast clarity shines in pour-over');
  }
  
  if (bean.processing === 'natural' && method === 'french-press') {
    reasons.push('Natural process body enhanced by immersion');
  }
  
  if (bean.origin === 'Ethiopia' && method === 'v60') {
    reasons.push('Ethiopian florals perfect for V60');
  }
  
  return reasons.join('. ');
}

/**
 * Get required equipment for method
 */
function getRequiredEquipment(method) {
  const equipmentMap = {
    'v60': ['grinder', 'brewer', 'kettle', 'scale'],
    'chemex': ['grinder', 'brewer', 'kettle', 'scale'],
    'aeropress': ['grinder', 'brewer', 'kettle'],
    'french-press': ['grinder', 'brewer', 'kettle'],
    'espresso': ['grinder', 'espresso-machine', 'scale'],
    'moka-pot': ['grinder', 'brewer'],
    'clever': ['grinder', 'brewer', 'kettle', 'scale']
  };
  
  return equipmentMap[method] || ['grinder', 'brewer'];
}

/**
 * Recommend food pairings (bonus feature)
 */
function recommendFoodPairings(flavorProfile) {
  const pairings = [];
  
  const flavors = flavorProfile.predictedFlavors || [];
  
  if (flavors.includes('chocolate') || flavors.includes('cocoa')) {
    pairings.push('Dark chocolate', 'Chocolate croissant', 'Brownies');
  }
  
  if (flavors.includes('fruit') || flavors.includes('berry')) {
    pairings.push('Fresh berries', 'Fruit tarts', 'Scones with jam');
  }
  
  if (flavors.includes('nutty') || flavors.includes('caramel')) {
    pairings.push('Biscotti', 'Caramel desserts', 'Almond croissant');
  }
  
  if (flavors.includes('floral') || flavors.includes('tea')) {
    pairings.push('Light pastries', 'Pound cake', 'Shortbread');
  }
  
  return pairings;
}

/**
 * Export all functions
 */
module.exports = {
  recommendPairings,
  calculatePairingScore,
  getCompatibleMethods,
  recommendFoodPairings,
  PAIRING_MATRIX
};

