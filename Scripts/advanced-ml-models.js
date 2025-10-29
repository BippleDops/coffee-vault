/**
 * Coffee Vault 5.0 - Advanced ML Models
 * Version: 5.0.0
 *
 * New ML models for Coffee Vault 5.0:
 * - Flavor Profile Predictor
 * - Enhanced Optimal Parameter Predictor (context-aware)
 * - Advanced Quality Anomaly Detector (real-time)
 * - Advanced Palate Development Tracker
 * - Cost Optimization Engine
 * - Pairing Recommender
 */

const ml = require('./ml-engine.js');
const stats = require('./stats-utils.js');

// ============================================
// FLAVOR PROFILE PREDICTOR
// ============================================

/**
 * Predicts flavor profile from bean characteristics
 * Input: origin, variety, processing, roast level
 * Output: Predicted flavor notes, intensity scores, sensory profile
 */
class FlavorProfilePredictor {
  constructor() {
    this.flavorPatterns = this.buildFlavorPatterns();
  }

  /**
   * Build flavor pattern database from historical data
   */
  buildFlavorPatterns() {
    // Pattern matching database built from bean profiles and coffee logs
    // Structure: { origin_variety_processing_roast: { flavors: [...], intensities: {...} } }
    return {};
  }

  /**
   * Predict flavor profile for a bean
   * @param {Object} beanCharacteristics - { origin, variety, processing, roast-level }
   * @param {Array} historicalData - Historical bean profiles with flavor notes
   * @returns {Object} Predicted flavor profile
   */
  predict(beanCharacteristics, historicalData) {
    const { origin, variety, processing, 'roast-level': roastLevel } = beanCharacteristics;
    
    // Find similar beans in historical data
    const similarBeans = this.findSimilarBeans(beanCharacteristics, historicalData);
    
    // Extract flavor patterns
    const predictedFlavors = this.extractFlavorPatterns(similarBeans);
    const intensityScores = this.calculateIntensities(similarBeans);
    const sensoryProfile = this.predictSensoryProfile(similarBeans);
    
    return {
      primaryFlavors: predictedFlavors.slice(0, 3),
      secondaryFlavors: predictedFlavors.slice(3, 6),
      intensityScores,
      sensoryProfile,
      confidence: this.calculateConfidence(similarBeans.length),
      similarBeansCount: similarBeans.length
    };
  }

  findSimilarBeans(characteristics, data) {
    return data.filter(bean => {
      let similarity = 0;
      if (bean.origin === characteristics.origin) similarity += 3;
      if (bean.variety === characteristics.variety) similarity += 2;
      if (bean.processing === characteristics.processing) similarity += 2;
      if (bean['roast-level'] === characteristics['roast-level']) similarity += 1;
      return similarity >= 4; // Minimum similarity threshold
    });
  }

  extractFlavorPatterns(similarBeans) {
    const flavorCounts = {};
    
    similarBeans.forEach(bean => {
      const flavors = [
        ...(bean['primary-notes'] || []),
        ...(bean['secondary-notes'] || []),
        ...(bean['roaster-descriptors'] || []),
        ...(bean['personal-descriptors'] || [])
      ];
      
      flavors.forEach(flavor => {
        flavorCounts[flavor] = (flavorCounts[flavor] || 0) + 1;
      });
    });
    
    return Object.entries(flavorCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([flavor]) => flavor);
  }

  calculateIntensities(similarBeans) {
    const intensities = {
      acidity: { low: 0, medium: 0, high: 0 },
      body: { light: 0, medium: 0, full: 0 },
      sweetness: { low: 0, medium: 0, high: 0 }
    };
    
    similarBeans.forEach(bean => {
      if (bean.acidity) intensities.acidity[bean.acidity] = (intensities.acidity[bean.acidity] || 0) + 1;
      if (bean.body) intensities.body[bean.body] = (intensities.body[bean.body] || 0) + 1;
      if (bean.sweetness) intensities.sweetness[bean.sweetness] = (intensities.sweetness[bean.sweetness] || 0) + 1;
    });
    
    // Find most common
    return {
      acidity: this.findMostCommon(intensities.acidity),
      body: this.findMostCommon(intensities.body),
      sweetness: this.findMostCommon(intensities.sweetness)
    };
  }

  predictSensoryProfile(similarBeans) {
    if (similarBeans.length === 0) {
      return { complexity: 'moderate', balance: 'balanced' };
    }
    
    const complexity = stats.mode(similarBeans.map(b => b.complexity || 'moderate'));
    const balance = stats.mode(similarBeans.map(b => b.balance || 'balanced'));
    
    return { complexity, balance };
  }

  findMostCommon(obj) {
    return Object.entries(obj).sort((a, b) => b[1] - a[1])[0]?.[0] || 'medium';
  }

  calculateConfidence(similarCount) {
    if (similarCount >= 10) return 0.9;
    if (similarCount >= 5) return 0.7;
    if (similarCount >= 2) return 0.5;
    return 0.3;
  }
}

// ============================================
// ENHANCED OPTIMAL PARAMETER PREDICTOR
// ============================================

/**
 * Context-aware parameter prediction
 * Considers: bean profile, time of day, weather, physiological state
 */
class EnhancedParameterPredictor {
  /**
   * Predict optimal parameters with context awareness
   * @param {Object} context - { bean, timeOfDay, weather, physiologicalState }
   * @param {Array} historicalData - Coffee logs with ratings
   * @returns {Object} Optimal parameters with confidence
   */
  predict(context, historicalData) {
    const { bean, timeOfDay, weather, physiologicalState } = context;
    
    // Find successful brews with similar context
    const similarBrews = this.findSimilarBrews(context, historicalData);
    
    // Base parameters from similar brews
    const baseParams = this.calculateBaseParameters(similarBrews);
    
    // Context adjustments
    const adjustments = this.calculateContextAdjustments(context, similarBrews);
    
    // Apply adjustments
    const optimalParams = this.applyAdjustments(baseParams, adjustments);
    
    return {
      dose: optimalParams.dose,
      water: optimalParams.water,
      ratio: optimalParams.ratio,
      grindSize: optimalParams.grindSize,
      temperature: optimalParams.temperature,
      brewTime: optimalParams.brewTime,
      confidence: this.calculateConfidence(similarBrews.length),
      adjustments: adjustments,
      reasoning: this.generateReasoning(context, adjustments)
    };
  }

  findSimilarBrews(context, data) {
    return data.filter(brew => {
      if (!brew.rating || brew.rating < 4.0) return false; // Only successful brews
      
      let similarity = 0;
      if (brew.beans === context.bean) similarity += 5;
      if (brew['time-of-day'] === context.timeOfDay) similarity += 2;
      if (brew['weather-condition'] === context.weather) similarity += 1;
      
      return similarity >= 5; // Bean match required
    });
  }

  calculateBaseParameters(similarBrews) {
    if (similarBrews.length === 0) {
      return { dose: 18, water: 300, ratio: '1:16.7', grindSize: 'medium-fine', temperature: 93, brewTime: '3:00' };
    }
    
    const doses = similarBrews.map(b => b.dose).filter(Boolean);
    const waters = similarBrews.map(b => b.water).filter(Boolean);
    const temps = similarBrews.map(b => b['water-temperature']).filter(Boolean);
    const grindSizes = similarBrews.map(b => b['grind-size']).filter(Boolean);
    
    return {
      dose: stats.mean(doses) || 18,
      water: stats.mean(waters) || 300,
      ratio: this.calculateRatio(stats.mean(doses), stats.mean(waters)),
      grindSize: stats.mode(grindSizes) || 'medium-fine',
      temperature: stats.mean(temps) || 93,
      brewTime: this.calculateAverageBrewTime(similarBrews)
    };
  }

  calculateContextAdjustments(context, similarBrews) {
    const adjustments = {};
    
    // Weather adjustments
    if (context.weather === 'rainy' || context.weather === 'cloudy') {
      adjustments.temperature = +1; // Slightly warmer
    }
    
    // Time of day adjustments
    if (context.timeOfDay === 'morning') {
      adjustments.dose = +1; // Slightly stronger
    } else if (context.timeOfDay === 'evening') {
      adjustments.dose = -1; // Slightly weaker
    }
    
    // Physiological state adjustments
    if (context.physiologicalState?.energyLevel === 'tired') {
      adjustments.dose = +1; // Need more caffeine
    }
    
    return adjustments;
  }

  applyAdjustments(baseParams, adjustments) {
    const adjusted = { ...baseParams };
    
    if (adjustments.dose) adjusted.dose += adjustments.dose;
    if (adjustments.temperature) adjusted.temperature += adjustments.temperature;
    if (adjustments.dose) adjusted.water = adjusted.dose * parseFloat(adjusted.ratio.split(':')[1]);
    if (adjustments.dose) adjusted.ratio = `1:${(adjusted.water / adjusted.dose).toFixed(1)}`;
    
    return adjusted;
  }

  calculateRatio(dose, water) {
    if (!dose || !water) return '1:16.7';
    return `1:${(water / dose).toFixed(1)}`;
  }

  calculateAverageBrewTime(brews) {
    const times = brews.map(b => b['brew-time']).filter(Boolean);
    if (times.length === 0) return '3:00';
    
    // Convert MM:SS to seconds, average, convert back
    const seconds = times.map(t => {
      const [min, sec] = t.split(':').map(Number);
      return min * 60 + (sec || 0);
    });
    
    const avgSeconds = stats.mean(seconds);
    const minutes = Math.floor(avgSeconds / 60);
    const secs = Math.round(avgSeconds % 60);
    
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  calculateConfidence(count) {
    if (count >= 10) return 0.9;
    if (count >= 5) return 0.7;
    if (count >= 2) return 0.5;
    return 0.3;
  }

  generateReasoning(context, adjustments) {
    const reasons = [];
    
    if (adjustments.dose) {
      reasons.push(`Dose adjusted by ${adjustments.dose > 0 ? '+' : ''}${adjustments.dose}g based on ${context.timeOfDay || 'context'}`);
    }
    
    if (adjustments.temperature) {
      reasons.push(`Temperature adjusted by ${adjustments.temperature > 0 ? '+' : ''}${adjustments.temperature}°C based on weather`);
    }
    
    return reasons.join('. ') || 'Using base parameters from similar successful brews';
  }
}

// ============================================
// ADVANCED QUALITY ANOMALY DETECTOR
// ============================================

/**
 * Real-time quality anomaly detection using Statistical Process Control
 */
class QualityAnomalyDetector {
  /**
   * Detect anomalies in real-time brewing parameters
   * @param {Object} currentParams - Current brewing parameters
   * @param {Array} historicalData - Historical successful brews
   * @returns {Object} Anomaly detection results
   */
  detect(currentParams, historicalData) {
    const successfulBrews = historicalData.filter(b => b.rating >= 4.0);
    
    if (successfulBrews.length < 5) {
      return { isAnomaly: false, confidence: 0, warnings: [] };
    }
    
    const checks = [
      this.checkDose(currentParams, successfulBrews),
      this.checkTemperature(currentParams, successfulBrews),
      this.checkGrindSize(currentParams, successfulBrews),
      this.checkRatio(currentParams, successfulBrews)
    ];
    
    const warnings = checks.filter(c => c.isAnomaly);
    const isAnomaly = warnings.length > 0;
    const confidence = this.calculateConfidence(warnings);
    
    return {
      isAnomaly,
      confidence,
      warnings: warnings.map(w => w.message),
      suggestions: warnings.map(w => w.suggestion)
    };
  }

  checkDose(params, historical) {
    const doses = historical.map(b => b.dose).filter(Boolean);
    if (doses.length === 0) return { isAnomaly: false };
    
    const mean = stats.mean(doses);
    const stdDev = stats.standardDeviation(doses);
    const zScore = Math.abs((params.dose - mean) / stdDev);
    
    if (zScore > 2) {
      return {
        isAnomaly: true,
        message: `Dose (${params.dose}g) is ${zScore > 3 ? 'significantly' : 'moderately'} outside normal range (${mean.toFixed(1)}g ± ${stdDev.toFixed(1)}g)`,
        suggestion: `Consider adjusting dose to ${mean.toFixed(0)}g`
      };
    }
    
    return { isAnomaly: false };
  }

  checkTemperature(params, historical) {
    const temps = historical.map(b => b['water-temperature']).filter(Boolean);
    if (temps.length === 0) return { isAnomaly: false };
    
    const mean = stats.mean(temps);
    const stdDev = stats.standardDeviation(temps);
    const zScore = Math.abs((params['water-temperature'] - mean) / stdDev);
    
    if (zScore > 2) {
      return {
        isAnomaly: true,
        message: `Temperature (${params['water-temperature']}°C) is ${zScore > 3 ? 'significantly' : 'moderately'} outside normal range (${mean.toFixed(1)}°C ± ${stdDev.toFixed(1)}°C)`,
        suggestion: `Consider adjusting temperature to ${mean.toFixed(0)}°C`
      };
    }
    
    return { isAnomaly: false };
  }

  checkGrindSize(params, historical) {
    const grindSizes = historical.map(b => b['grind-size']).filter(Boolean);
    if (grindSizes.length === 0) return { isAnomaly: false };
    
    const mostCommon = stats.mode(grindSizes);
    if (params['grind-size'] !== mostCommon) {
      return {
        isAnomaly: true,
        message: `Grind size (${params['grind-size']}) differs from most successful brews (${mostCommon})`,
        suggestion: `Consider using ${mostCommon} grind size`
      };
    }
    
    return { isAnomaly: false };
  }

  checkRatio(params, historical) {
    const ratios = historical.map(b => {
      if (b['brew-ratio']) {
        const ratio = b['brew-ratio'].split(':')[1];
        return parseFloat(ratio);
      }
      return null;
    }).filter(Boolean);
    
    if (ratios.length === 0) return { isAnomaly: false };
    
    const meanRatio = stats.mean(ratios);
    const currentRatio = parseFloat(params['brew-ratio']?.split(':')[1] || (params.water / params.dose));
    const diff = Math.abs(currentRatio - meanRatio);
    
    if (diff > 1.0) {
      return {
        isAnomaly: true,
        message: `Brew ratio (1:${currentRatio.toFixed(1)}) differs significantly from optimal (1:${meanRatio.toFixed(1)})`,
        suggestion: `Consider adjusting to 1:${meanRatio.toFixed(1)} ratio`
      };
    }
    
    return { isAnomaly: false };
  }

  calculateConfidence(warnings) {
    if (warnings.length >= 3) return 0.9;
    if (warnings.length === 2) return 0.7;
    if (warnings.length === 1) return 0.5;
    return 0;
  }
}

// ============================================
// ADVANCED PALATE DEVELOPMENT TRACKER
// ============================================

/**
 * Tracks palate sophistication and development over time
 */
class PalateDevelopmentTracker {
  /**
   * Analyze palate development from historical ratings and descriptors
   * @param {Array} coffeeLogs - Historical coffee logs
   * @returns {Object} Palate development metrics
   */
  analyze(coffeeLogs) {
    const sortedLogs = coffeeLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Divide into time periods
    const periods = this.divideIntoPeriods(sortedLogs, 3); // 3 periods
    
    const metrics = {
      descriptorComplexity: this.analyzeDescriptorComplexity(periods),
      ratingDistribution: this.analyzeRatingDistribution(periods),
      descriptorVocabulary: this.analyzeVocabularyGrowth(periods),
      sophisticationScore: this.calculateSophisticationScore(periods),
      trend: this.detectTrend(periods)
    };
    
    return {
      ...metrics,
      recommendations: this.generateRecommendations(metrics),
      progress: this.calculateProgress(periods)
    };
  }

  divideIntoPeriods(logs, numPeriods) {
    const periodSize = Math.ceil(logs.length / numPeriods);
    const periods = [];
    
    for (let i = 0; i < numPeriods; i++) {
      const start = i * periodSize;
      const end = Math.min(start + periodSize, logs.length);
      periods.push(logs.slice(start, end));
    }
    
    return periods;
  }

  analyzeDescriptorComplexity(periods) {
    return periods.map(period => {
      const descriptors = period.flatMap(log => [
        ...(log.descriptors || []),
        ...(log['primary-flavor'] ? [log['primary-flavor']] : []),
        ...(log['secondary-flavors'] || [])
      ]);
      
      const uniqueDescriptors = new Set(descriptors);
      const avgDescriptorsPerLog = descriptors.length / period.length;
      
      return {
        uniqueCount: uniqueDescriptors.size,
        avgPerLog: avgDescriptorsPerLog,
        complexity: this.calculateComplexity(Array.from(uniqueDescriptors))
      };
    });
  }

  analyzeRatingDistribution(periods) {
    return periods.map(period => {
      const ratings = period.map(log => log.rating).filter(Boolean);
      return {
        mean: stats.mean(ratings),
        stdDev: stats.standardDeviation(ratings),
        range: { min: Math.min(...ratings), max: Math.max(...ratings) }
      };
    });
  }

  analyzeVocabularyGrowth(periods) {
    const vocabularies = [];
    let cumulativeVocab = new Set();
    
    periods.forEach(period => {
      const descriptors = period.flatMap(log => [
        ...(log.descriptors || []),
        ...(log['primary-flavor'] ? [log['primary-flavor']] : []),
        ...(log['secondary-flavors'] || [])
      ]);
      
      descriptors.forEach(d => cumulativeVocab.add(d));
      vocabularies.push(cumulativeVocab.size);
    });
    
    return vocabularies;
  }

  calculateComplexity(descriptors) {
    // Simple complexity: count of unique descriptors
    // Advanced: could weight by rarity, specificity, etc.
    return descriptors.length;
  }

  calculateSophisticationScore(periods) {
    const latest = periods[periods.length - 1];
    const complexity = this.analyzeDescriptorComplexity([latest])[0];
    const vocab = this.analyzeVocabularyGrowth(periods)[periods.length - 1];
    
    // Normalize scores (0-1 scale)
    const complexityScore = Math.min(complexity.uniqueCount / 50, 1); // Max 50 unique descriptors
    const vocabScore = Math.min(vocab / 100, 1); // Max 100 vocabulary words
    
    return (complexityScore * 0.6 + vocabScore * 0.4) * 10; // Scale to 0-10
  }

  detectTrend(periods) {
    const sophisticationScores = periods.map((_, idx) => {
      const period = periods.slice(0, idx + 1);
      return this.calculateSophisticationScore(period);
    });
    
    if (sophisticationScores.length < 2) return 'stable';
    
    const trend = stats.linearRegression(
      sophisticationScores.map((_, i) => i),
      sophisticationScores
    );
    
    if (trend.slope > 0.1) return 'improving';
    if (trend.slope < -0.1) return 'declining';
    return 'stable';
  }

  generateRecommendations(metrics) {
    const recommendations = [];
    
    if (metrics.descriptorVocabulary[metrics.descriptorVocabulary.length - 1] < 30) {
      recommendations.push('Try describing flavors more specifically - expand your flavor vocabulary');
    }
    
    if (metrics.sophisticationScore < 5) {
      recommendations.push('Explore more diverse origins and processing methods to develop palate');
    }
    
    if (metrics.trend === 'stable' && metrics.sophisticationScore < 7) {
      recommendations.push('Consider formal cupping sessions or coffee courses to advance palate');
    }
    
    return recommendations;
  }

  calculateProgress(periods) {
    if (periods.length < 2) return 0;
    
    const first = this.calculateSophisticationScore([periods[0]]);
    const latest = this.calculateSophisticationScore([periods[periods.length - 1]]);
    
    return latest - first;
  }
}

// ============================================
// COST OPTIMIZATION ENGINE
// ============================================

/**
 * Multi-objective optimization for coffee purchasing
 * Balances quality vs. cost
 */
class CostOptimizationEngine {
  /**
   * Optimize coffee purchasing strategy
   * @param {Array} consumptionHistory - Historical consumption patterns
   * @param {Array} beanInventory - Current beans and prices
   * @param {Object} preferences - User preferences (quality threshold, budget)
   * @returns {Object} Optimization recommendations
   */
  optimize(consumptionHistory, beanInventory, preferences) {
    const { qualityThreshold = 4.0, monthlyBudget = 100 } = preferences;
    
    // Analyze consumption patterns
    const patterns = this.analyzeConsumption(consumptionHistory);
    
    // Score beans by value (quality/cost ratio)
    const beanScores = this.scoreBeans(beanInventory, consumptionHistory, qualityThreshold);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(patterns, beanScores, monthlyBudget);
    
    return {
      optimalBeans: beanScores.slice(0, 5),
      monthlyRecommendation: recommendations,
      valueAnalysis: this.analyzeValue(consumptionHistory, beanInventory),
      savingsPotential: this.calculateSavings(patterns, recommendations)
    };
  }

  analyzeConsumption(history) {
    const monthly = {};
    
    history.forEach(log => {
      const month = log.date.slice(0, 7); // YYYY-MM
      if (!monthly[month]) monthly[month] = { logs: 0, grams: 0, cost: 0 };
      
      monthly[month].logs++;
      monthly[month].grams += log.dose || 0;
      if (log['cost-per-cup']) monthly[month].cost += log['cost-per-cup'];
    });
    
    const months = Object.values(monthly);
    return {
      avgMonthlyGrams: stats.mean(months.map(m => m.grams)),
      avgMonthlyCost: stats.mean(months.map(m => m.cost)),
      avgCostPerGram: stats.mean(months.map(m => m.cost / m.grams))
    };
  }

  scoreBeans(beans, history, qualityThreshold) {
    return beans.map(bean => {
      // Find logs for this bean
      const logs = history.filter(log => log.beans === bean.name);
      const avgRating = logs.length > 0 
        ? stats.mean(logs.map(l => l.rating).filter(Boolean))
        : bean.score ? bean.score / 20 : 3.5; // Convert SCA score to 1-5 scale
      
      const costPerGram = bean['cost-per-100g'] ? bean['cost-per-100g'] / 100 : 0;
      const valueScore = avgRating / costPerGram; // Quality per dollar
      
      return {
        bean: bean.name,
        avgRating,
        costPerGram,
        valueScore: costPerGram > 0 ? valueScore : 0,
        meetsThreshold: avgRating >= qualityThreshold,
        logs: logs.length
      };
    }).sort((a, b) => b.valueScore - a.valueScore);
  }

  generateRecommendations(patterns, beanScores, budget) {
    const optimalBeans = beanScores.filter(b => b.meetsThreshold).slice(0, 3);
    const gramsNeeded = patterns.avgMonthlyGrams;
    
    const recommendation = {
      beans: optimalBeans.map(b => ({ name: b.bean, grams: Math.ceil(gramsNeeded / 3) })),
      estimatedCost: optimalBeans.reduce((sum, b) => sum + (b.costPerGram * gramsNeeded / 3), 0),
      estimatedRating: stats.mean(optimalBeans.map(b => b.avgRating)),
      underBudget: optimalBeans.reduce((sum, b) => sum + (b.costPerGram * gramsNeeded / 3), 0) <= budget
    };
    
    return recommendation;
  }

  analyzeValue(history, beans) {
    const valueRatios = history.map(log => {
      const bean = beans.find(b => b.name === log.beans);
      if (!bean || !log.rating) return null;
      
      const costPerGram = bean['cost-per-100g'] ? bean['cost-per-100g'] / 100 : 0;
      return costPerGram > 0 ? log.rating / costPerGram : 0;
    }).filter(Boolean);
    
    return {
      avgValueRatio: stats.mean(valueRatios),
      bestValueRatio: Math.max(...valueRatios),
      worstValueRatio: Math.min(...valueRatios)
    };
  }

  calculateSavings(patterns, recommendation) {
    const currentCost = patterns.avgMonthlyCost;
    const optimizedCost = recommendation.estimatedCost;
    
    return {
      potentialSavings: currentCost - optimizedCost,
      savingsPercentage: currentCost > 0 ? ((currentCost - optimizedCost) / currentCost * 100) : 0
    };
  }
}

// ============================================
// PAIRING RECOMMENDER
// ============================================

/**
 * Recommends optimal bean-method-equipment combinations
 */
class PairingRecommender {
  /**
   * Recommend optimal pairings
   * @param {Object} context - { bean, availableEquipment, preferences }
   * @param {Array} historicalData - Coffee logs with successful combinations
   * @returns {Object} Pairing recommendations
   */
  recommend(context, historicalData) {
    const { bean, availableEquipment, preferences } = context;
    
    // Find successful pairings for similar beans
    const similarBeans = this.findSimilarBeans(bean, historicalData);
    const successfulPairings = this.extractSuccessfulPairings(similarBeans);
    
    // Score pairings
    const scoredPairings = this.scorePairings(successfulPairings, availableEquipment);
    
    // Generate recommendations
    return {
      topPairings: scoredPairings.slice(0, 5),
      methodRecommendations: this.recommendMethods(scoredPairings),
      equipmentRecommendations: this.recommendEquipment(scoredPairings, availableEquipment),
      confidence: this.calculateConfidence(similarBeans.length)
    };
  }

  findSimilarBeans(bean, data) {
    return data.filter(log => {
      return log.beans === bean.name || 
             (log.origin === bean.origin && 
              log['roast-level'] === bean['roast-level'] &&
              log.rating >= 4.0);
    });
  }

  extractSuccessfulPairings(logs) {
    const pairings = {};
    
    logs.forEach(log => {
      const key = `${log['brew-method']}_${log.grinder || 'unknown'}`;
      if (!pairings[key]) {
        pairings[key] = {
          method: log['brew-method'],
          equipment: log.grinder,
          ratings: [],
          count: 0
        };
      }
      
      pairings[key].ratings.push(log.rating);
      pairings[key].count++;
    });
    
    return Object.values(pairings).map(p => ({
      ...p,
      avgRating: stats.mean(p.ratings)
    }));
  }

  scorePairings(pairings, availableEquipment) {
    return pairings.map(p => {
      let score = p.avgRating * p.count; // Weight by frequency and rating
      
      // Boost if equipment is available
      if (availableEquipment.includes(p.equipment)) {
        score *= 1.2;
      }
      
      return { ...p, score };
    }).sort((a, b) => b.score - a.score);
  }

  recommendMethods(scoredPairings) {
    const methodScores = {};
    
    scoredPairings.forEach(p => {
      if (!methodScores[p.method]) {
        methodScores[p.method] = { totalScore: 0, count: 0 };
      }
      methodScores[p.method].totalScore += p.score;
      methodScores[p.method].count++;
    });
    
    return Object.entries(methodScores)
      .map(([method, data]) => ({
        method,
        score: data.totalScore / data.count
      }))
      .sort((a, b) => b.score - a.score);
  }

  recommendEquipment(scoredPairings, availableEquipment) {
    const equipmentScores = {};
    
    scoredPairings.forEach(p => {
      if (!equipmentScores[p.equipment]) {
        equipmentScores[p.equipment] = { totalScore: 0, count: 0 };
      }
      equipmentScores[p.equipment].totalScore += p.score;
      equipmentScores[p.equipment].count++;
    });
    
    return Object.entries(equipmentScores)
      .map(([equipment, data]) => ({
        equipment,
        score: data.totalScore / data.count,
        available: availableEquipment.includes(equipment)
      }))
      .sort((a, b) => b.score - a.score);
  }

  calculateConfidence(count) {
    if (count >= 20) return 0.9;
    if (count >= 10) return 0.7;
    if (count >= 5) return 0.5;
    return 0.3;
  }
}

// Export all models
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    FlavorProfilePredictor,
    EnhancedParameterPredictor,
    QualityAnomalyDetector,
    PalateDevelopmentTracker,
    CostOptimizationEngine,
    PairingRecommender
  };
}

