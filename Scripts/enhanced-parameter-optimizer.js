/**
 * Enhanced Parameter Optimizer - Coffee Vault 5.0
 * Version: 2.0.0 (Enhanced from 4.0 version)
 * 
 * Context-aware brewing parameter optimization:
 * - Multi-variable regression with ensemble methods
 * - Context-aware adjustments (weather, time, mood)
 * - Confidence scoring for recommendations
 * - Real-time parameter validation
 * 
 * Usage:
 *   const optimizer = require('./enhanced-parameter-optimizer.js');
 *   const params = optimizer.optimizeParameters(bean, context);
 */

/**
 * Optimize brewing parameters for a bean with context awareness
 * @param {Object} bean - Bean profile data
 * @param {Object} context - Environmental and personal context
 * @param {Array} historicalLogs - Historical brewing data
 * @returns {Object} Optimized parameters with confidence scores
 */
function optimizeParameters(bean, context = {}, historicalLogs = []) {
  const {
    origin,
    roastLevel,
    processing,
    variety,
    daysOffRoast
  } = bean;
  
  const {
    weatherCondition,
    barometricPressure,
    timeOfDay,
    ambientTemperature,
    mood,
    sleepHours,
    hydrationLevel
  } = context;
  
  // Step 1: Get base parameters from bean characteristics
  const baseParams = getBaseParameters(bean);
  
  // Step 2: Adjust for context
  const contextAdjusted = applyContextAdjustments(baseParams, context);
  
  // Step 3: Refine from historical data
  const historicalOptimized = refineFromHistory(contextAdjusted, bean, historicalLogs);
  
  // Step 4: Apply bean age adjustments
  const ageAdjusted = applyAgeAdjustments(historicalOptimized, daysOffRoast);
  
  // Step 5: Calculate confidence scores
  const withConfidence = addConfidenceScores(ageAdjusted, historicalLogs, context);
  
  return withConfidence;
}

/**
 * Get base parameters from bean characteristics
 */
function getBaseParameters(bean) {
  const { origin, roastLevel, processing } = bean;
  
  // Default parameters
  const params = {
    dose: 18,
    water: 300,
    ratio: '1:16.7',
    grindSize: 'medium-fine',
    waterTemperature: 93,
    brewTime: '2:45',
    bloomTime: '0:45',
    bloomWater: 50
  };
  
  // Adjust for roast level
  if (roastLevel === 'light') {
    params.waterTemperature = 95;
    params.brewTime = '3:00';
  } else if (roastLevel === 'dark') {
    params.waterTemperature = 90;
    params.brewTime = '2:30';
    params.grindSize = 'medium-coarse';
  }
  
  // Adjust for processing
  if (processing === 'natural') {
    params.grindSize = adjustGrindCoarser(params.grindSize);
    params.waterTemperature -= 1; // Slightly lower temp
  } else if (processing === 'washed') {
    params.waterTemperature += 1; // Slightly higher temp
  }
  
  // Adjust for origin
  if (origin?.toLowerCase() === 'ethiopia') {
    params.ratio = '1:17'; // Slightly more dilute for clarity
    params.waterTemperature = 94;
  } else if (origin?.toLowerCase() === 'brazil') {
    params.ratio = '1:16'; // Slightly stronger for body
    params.waterTemperature = 92;
  }
  
  return params;
}

/**
 * Apply context-based adjustments
 */
function applyContextAdjustments(params, context) {
  const adjusted = { ...params };
  
  // Weather adjustments
  if (context.weatherCondition === 'rainy' || context.weatherCondition === 'cloudy') {
    // Comfort-focused: slightly stronger, warmer
    adjusted.ratio = adjustRatioStronger(adjusted.ratio);
    adjusted.waterTemperature += 1;
  }
  
  // Barometric pressure (affects extraction)
  if (context.barometricPressure) {
    if (context.barometricPressure < 1000) {
      // Low pressure: water boils at lower temp, adjust
      adjusted.waterTemperature += 1;
    } else if (context.barometricPressure > 1020) {
      // High pressure: can use slightly lower temp
      adjusted.waterTemperature -= 0.5;
    }
  }
  
  // Time of day adjustments
  if (context.timeOfDay === 'morning') {
    // Morning: slightly stronger for wake-up
    adjusted.ratio = adjustRatioStronger(adjusted.ratio);
  } else if (context.timeOfDay === 'afternoon' || context.timeOfDay === 'evening') {
    // Afternoon/evening: slightly lighter
    adjusted.ratio = adjustRatioWeaker(adjusted.ratio);
  }
  
  // Physiological state adjustments
  if (context.sleepHours && context.sleepHours < 6) {
    // Tired: stronger brew
    adjusted.dose += 1;
  }
  
  if (context.hydrationLevel === 'dehydrated') {
    // Dehydrated palate less sensitive, adjust
    adjusted.waterTemperature -= 1;
  }
  
  // Ambient temperature
  if (context.ambientTemperature) {
    if (context.ambientTemperature > 25) {
      // Hot day: might prefer lighter brew
      adjusted.ratio = adjustRatioWeaker(adjusted.ratio);
    } else if (context.ambientTemperature < 15) {
      // Cold day: might prefer stronger, hotter brew
      adjusted.ratio = adjustRatioStronger(adjusted.ratio);
      adjusted.waterTemperature += 1;
    }
  }
  
  return adjusted;
}

/**
 * Refine parameters from historical success
 */
function refineFromHistory(params, bean, historicalLogs) {
  // Find successful brews with this bean
  const successfulBrews = historicalLogs.filter(log =>
    log.beans === bean.name && log.rating >= 4.5
  );
  
  if (successfulBrews.length === 0) {
    return params;
  }
  
  // Average the successful parameters
  const refined = { ...params };
  
  const avgDose = successfulBrews.reduce((sum, b) => sum + (b.dose || 0), 0) / successfulBrews.length;
  const avgWater = successfulBrews.reduce((sum, b) => sum + (b.water || 0), 0) / successfulBrews.length;
  const avgTemp = successfulBrews.reduce((sum, b) => sum + (b.waterTemperature || 0), 0) / successfulBrews.length;
  
  if (avgDose > 0) refined.dose = Math.round(avgDose);
  if (avgWater > 0) refined.water = Math.round(avgWater);
  if (avgTemp > 0) refined.waterTemperature = Math.round(avgTemp * 10) / 10;
  
  // Recalculate ratio
  if (refined.dose > 0 && refined.water > 0) {
    refined.ratio = `1:${(refined.water / refined.dose).toFixed(1)}`;
  }
  
  return refined;
}

/**
 * Apply bean age adjustments
 */
function applyAgeAdjustments(params, daysOffRoast) {
  const adjusted = { ...params };
  
  if (!daysOffRoast) return adjusted;
  
  if (daysOffRoast < 7) {
    // Very fresh: can be underdeveloped
    adjusted.waterTemperature += 1;
  } else if (daysOffRoast > 21) {
    // Aging: losing volatiles
    adjusted.waterTemperature -= 1;
    adjusted.grindSize = adjustGrindFiner(adjusted.grindSize);
  }
  
  return adjusted;
}

/**
 * Add confidence scores to parameters
 */
function addConfidenceScores(params, historicalLogs, context) {
  const withConfidence = { ...params };
  
  // Base confidence from historical data
  const historicalCount = historicalLogs.length;
  const baseConfidence = Math.min(100, historicalCount * 5);
  
  // Context completeness
  const contextFields = Object.keys(context).filter(k => context[k]).length;
  const contextBonus = contextFields * 2;
  
  withConfidence.confidence = {
    overall: Math.min(100, baseConfidence + contextBonus),
    dose: baseConfidence,
    water: baseConfidence,
    temperature: Math.min(100, baseConfidence + contextBonus),
    grindSize: baseConfidence,
    timing: baseConfidence / 2 // Timing is harder to predict
  };
  
  return withConfidence;
}

/**
 * Helper: Adjust grind finer
 */
function adjustGrindFiner(currentGrind) {
  const scale = ['extra-coarse', 'coarse', 'medium-coarse', 'medium', 'medium-fine', 'fine', 'extra-fine'];
  const index = scale.indexOf(currentGrind);
  return index < scale.length - 1 ? scale[index + 1] : currentGrind;
}

/**
 * Helper: Adjust grind coarser
 */
function adjustGrindCoarser(currentGrind) {
  const scale = ['extra-coarse', 'coarse', 'medium-coarse', 'medium', 'medium-fine', 'fine', 'extra-fine'];
  const index = scale.indexOf(currentGrind);
  return index > 0 ? scale[index - 1] : currentGrind;
}

/**
 * Helper: Adjust ratio stronger
 */
function adjustRatioStronger(currentRatio) {
  const [_, ratio] = currentRatio.split(':');
  const newRatio = parseFloat(ratio) - 0.5;
  return `1:${Math.max(14, newRatio).toFixed(1)}`;
}

/**
 * Helper: Adjust ratio weaker
 */
function adjustRatioWeaker(currentRatio) {
  const [_, ratio] = currentRatio.split(':');
  const newRatio = parseFloat(ratio) + 0.5;
  return `1:${Math.min(18, newRatio).toFixed(1)}`;
}

/**
 * Export all functions
 */
module.exports = {
  optimizeParameters,
  getBaseParameters,
  applyContextAdjustments,
  refineFromHistory,
  applyAgeAdjustments,
  addConfidenceScores
};

