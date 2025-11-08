/**
 * Flavor Profile Predictor - Coffee Vault 5.0
 * Version: 1.0.0
 * 
 * Predicts flavor notes, intensity scores, and sensory profiles based on:
 * - Bean origin, variety, processing method, roast level
 * - Historical tasting data from coffee logs
 * - Pattern matching from vault history
 * 
 * Usage:
 *   const predictor = require('./flavor-profile-predictor.js');
 *   const prediction = predictor.predictFlavorProfile(beanCharacteristics);
 */

const fs = require('fs');
const path = require('path');

/**
 * Flavor Profile Database
 * Maps characteristics → flavor profiles from historical data
 */
const FLAVOR_PATTERNS = {
  // Origin-based flavor patterns
  origins: {
    'ethiopia': {
      typical: ['floral', 'bergamot', 'jasmine', 'blueberry', 'tea-like'],
      intensity: { acidity: 'high', body: 'light-medium', sweetness: 'high' },
      processing: {
        'washed': ['citrus', 'tea', 'floral', 'bright'],
        'natural': ['blueberry', 'strawberry', 'wine', 'tropical-fruit'],
        'honey': ['stone-fruit', 'honey', 'balanced-sweetness']
      }
    },
    'colombia': {
      typical: ['chocolate', 'caramel', 'nutty', 'orange', 'balanced'],
      intensity: { acidity: 'medium', body: 'medium-full', sweetness: 'medium-high' },
      processing: {
        'washed': ['clean', 'bright', 'citrus', 'chocolate'],
        'natural': ['fruity', 'wine', 'tropical'],
        'honey': ['caramel', 'honey', 'balanced']
      }
    },
    'kenya': {
      typical: ['blackcurrant', 'tomato', 'grapefruit', 'wine', 'intense'],
      intensity: { acidity: 'very-high', body: 'full', sweetness: 'high' },
      processing: {
        'washed': ['bright', 'juicy', 'complex', 'wine-like'],
        'natural': ['intense-fruit', 'berry', 'syrupy']
      }
    },
    'guatemala': {
      typical: ['chocolate', 'cocoa', 'apple', 'caramel', 'balanced'],
      intensity: { acidity: 'medium', body: 'full', sweetness: 'medium' },
      processing: {
        'washed': ['clean', 'balanced', 'chocolate', 'apple'],
        'natural': ['fruity', 'chocolate', 'wine']
      }
    },
    'brazil': {
      typical: ['chocolate', 'nutty', 'peanut', 'low-acidity', 'creamy'],
      intensity: { acidity: 'low-medium', body: 'full', sweetness: 'medium' },
      processing: {
        'natural': ['chocolate', 'nutty', 'sweet', 'low-acid'],
        'pulped-natural': ['fruity', 'sweet', 'chocolate']
      }
    }
  },
  
  // Roast level impact on flavor
  roastLevels: {
    'light': {
      enhances: ['floral', 'citrus', 'tea', 'fruit', 'acidity'],
      diminishes: ['chocolate', 'caramel', 'body', 'sweetness'],
      adds: ['bright', 'complex', 'origin-character']
    },
    'medium': {
      enhances: ['chocolate', 'caramel', 'balanced', 'sweetness'],
      diminishes: ['acidity', 'floral'],
      adds: ['body', 'balance', 'approachable']
    },
    'dark': {
      enhances: ['chocolate', 'nutty', 'roasted', 'body'],
      diminishes: ['acidity', 'fruit', 'origin-character'],
      adds: ['bitter', 'smoky', 'full-body', 'low-acid']
    }
  },
  
  // Processing method flavor impact
  processingImpact: {
    'washed': {
      characteristics: ['clean', 'bright', 'crisp', 'clear'],
      acidity: 'higher',
      body: 'lighter',
      sweetness: 'subtle'
    },
    'natural': {
      characteristics: ['fruity', 'wine-like', 'fermented', 'complex'],
      acidity: 'lower',
      body: 'heavier',
      sweetness: 'pronounced'
    },
    'honey': {
      characteristics: ['sweet', 'balanced', 'fruity', 'smooth'],
      acidity: 'medium',
      body: 'medium',
      sweetness: 'high'
    },
    'anaerobic': {
      characteristics: ['funky', 'unique', 'intense-fruit', 'experimental'],
      acidity: 'variable',
      body: 'full',
      sweetness: 'high'
    }
  }
};

/**
 * Predict flavor profile for a bean based on its characteristics
 * @param {Object} beanData - Bean characteristics
 * @returns {Object} Predicted flavor profile
 */
function predictFlavorProfile(beanData) {
  const {
    origin,
    variety,
    processing,
    roastLevel,
    altitude
  } = beanData;
  
  const prediction = {
    predictedFlavors: [],
    confidenceScore: 0,
    sensoryProfile: {},
    flavorIntensity: {},
    recommendations: []
  };
  
  // Step 1: Get base flavors from origin
  const originKey = origin ? origin.toLowerCase() : null;
  const originData = FLAVOR_PATTERNS.origins[originKey];
  
  if (originData) {
    prediction.predictedFlavors = [...originData.typical];
    prediction.sensoryProfile = { ...originData.intensity };
    prediction.confidenceScore += 30;
    
    // Modify based on processing
    const processingKey = processing ? processing.toLowerCase() : null;
    if (processingKey && originData.processing[processingKey]) {
      prediction.predictedFlavors = [
        ...prediction.predictedFlavors,
        ...originData.processing[processingKey]
      ];
      prediction.confidenceScore += 25;
    }
  }
  
  // Step 2: Apply roast level modifications
  const roastKey = roastLevel ? roastLevel.toLowerCase() : null;
  const roastImpact = FLAVOR_PATTERNS.roastLevels[roastKey];
  
  if (roastImpact) {
    // Enhance certain flavors
    prediction.predictedFlavors = prediction.predictedFlavors.filter(flavor => 
      !roastImpact.diminishes.some(d => flavor.includes(d))
    );
    prediction.predictedFlavors.push(...roastImpact.enhances);
    prediction.predictedFlavors.push(...roastImpact.adds);
    prediction.confidenceScore += 20;
  }
  
  // Step 3: Processing method impact
  const processingData = FLAVOR_PATTERNS.processingImpact[processing?.toLowerCase()];
  if (processingData) {
    prediction.predictedFlavors.push(...processingData.characteristics);
    prediction.confidenceScore += 15;
  }
  
  // Step 4: Altitude impact (higher = more acidity and complexity)
  if (altitude) {
    if (altitude > 1800) {
      prediction.predictedFlavors.push('complex', 'bright', 'floral');
      prediction.sensoryProfile.acidity = 'high';
      prediction.confidenceScore += 10;
    } else if (altitude < 1200) {
      prediction.predictedFlavors.push('smooth', 'mild', 'balanced');
      prediction.sensoryProfile.acidity = 'low-medium';
    }
  }
  
  // Step 5: Remove duplicates and prioritize
  prediction.predictedFlavors = [...new Set(prediction.predictedFlavors)];
  
  // Step 6: Generate recommendations
  prediction.recommendations = generateBrewingRecommendations(beanData, prediction);
  
  return prediction;
}

/**
 * Generate brewing recommendations based on predicted profile
 */
function generateBrewingRecommendations(beanData, prediction) {
  const recommendations = [];
  const { roastLevel, processing, origin } = beanData;
  const { sensoryProfile } = prediction;
  
  // Method recommendations
  if (sensoryProfile.acidity === 'high' || sensoryProfile.acidity === 'very-high') {
    recommendations.push({
      category: 'method',
      suggestion: 'V60 or Chemex',
      reason: 'High acidity benefits from clarity of pour-over methods'
    });
  }
  
  if (sensoryProfile.body === 'full' || sensoryProfile.body === 'very-full') {
    recommendations.push({
      category: 'method',
      suggestion: 'French Press or Clever',
      reason: 'Full body enhanced by immersion brewing'
    });
  }
  
  // Temperature recommendations
  if (roastLevel === 'light') {
    recommendations.push({
      category: 'temperature',
      suggestion: '93-96°C',
      reason: 'Light roasts need higher temps for proper extraction'
    });
  } else if (roastLevel === 'dark') {
    recommendations.push({
      category: 'temperature',
      suggestion: '88-92°C',
      reason: 'Dark roasts risk bitterness at high temps'
    });
  }
  
  // Grind recommendations
  if (processing === 'natural') {
    recommendations.push({
      category: 'grind',
      suggestion: 'Slightly coarser than washed',
      reason: 'Natural process can clog filters, coarser grind prevents over-extraction'
    });
  }
  
  return recommendations;
}

/**
 * Learn from historical brewing data
 * Analyzes vault logs to improve predictions
 */
function learnFromHistory(vaultPath) {
  // Read all coffee logs
  const logsPath = path.join(vaultPath, 'Coffee Logs');
  
  // This would analyze all logs and extract patterns
  // For each bean: origin + processing + roast → actual flavors experienced
  // Build ML model from this data
  
  const learningData = {
    patterns: [],
    accuracy: 0,
    sampleSize: 0
  };
  
  // Future: Implement actual machine learning here
  // For now, uses predefined patterns
  
  return learningData;
}

/**
 * Compare predicted vs actual flavors
 * Helps improve prediction accuracy
 */
function comparePredictedVsActual(prediction, actualLog) {
  const {
    predictedFlavors,
    sensoryProfile: predictedSensory
  } = prediction;
  
  const actualFlavors = actualLog.descriptors || actualLog['flavor-notes'] || [];
  const actualSensory = {
    acidity: actualLog.acidity,
    body: actualLog.body,
    sweetness: actualLog.sweetness
  };
  
  // Calculate accuracy
  const matchedFlavors = predictedFlavors.filter(pf => 
    actualFlavors.some(af => af.toLowerCase().includes(pf.toLowerCase()) || pf.toLowerCase().includes(af.toLowerCase()))
  );
  
  const flavorAccuracy = predictedFlavors.length > 0 
    ? (matchedFlavors.length / predictedFlavors.length) * 100 
    : 0;
  
  const sensoryMatch = {
    acidity: predictedSensory.acidity === actualSensory.acidity,
    body: predictedSensory.body === actualSensory.body,
    sweetness: predictedSensory.sweetness === actualSensory.sweetness
  };
  
  const sensoryAccuracy = Object.values(sensoryMatch).filter(Boolean).length / 3 * 100;
  
  return {
    flavorAccuracy: Math.round(flavorAccuracy),
    sensoryAccuracy: Math.round(sensoryAccuracy),
    overallAccuracy: Math.round((flavorAccuracy + sensoryAccuracy) / 2),
    matchedFlavors: matchedFlavors,
    missedFlavors: actualFlavors.filter(af => 
      !predictedFlavors.some(pf => pf.toLowerCase().includes(af.toLowerCase()) || af.toLowerCase().includes(pf.toLowerCase()))
    )
  };
}

module.exports = {
  predictFlavorProfile,
  learnFromHistory,
  comparePredictedVsActual,
  FLAVOR_PATTERNS
};

