/**
 * Palate Development Tracker - Coffee Vault 5.0
 * Version: 1.0.0
 * 
 * Tracks palate sophistication and development over time:
 * - Descriptor complexity analysis
 * - Sensory development trajectory
 * - Flavor recognition improvement
 * - Personalized learning recommendations
 * 
 * Usage:
 *   const tracker = require('./palate-development-tracker.js');
 *   const analysis = tracker.analyzePalateDevelopment(coffeeLogHistory);
 */

/**
 * Flavor descriptor complexity scoring
 * More specific descriptors = higher complexity
 */
const DESCRIPTOR_COMPLEXITY = {
  // Basic descriptors (Level 1)
  basic: ['chocolate', 'nutty', 'sweet', 'bitter', 'sour', 'fruity', 'floral'],
  
  // Intermediate descriptors (Level 2)
  intermediate: ['caramel', 'citrus', 'berry', 'stone-fruit', 'tea', 'honey', 'cocoa', 'almond'],
  
  // Advanced descriptors (Level 3)
  advanced: ['bergamot', 'jasmine', 'blueberry', 'black-currant', 'peach', 'apricot', 'orange-blossom', 'chamomile'],
  
  // Expert descriptors (Level 4)
  expert: ['yuzu', 'lychee', 'passion-fruit', 'hibiscus', 'earl-grey', 'nectarine', 'cherry-blossom', 'sake']
};

/**
 * Analyze palate development from coffee log history
 * @param {Array} logs - Array of coffee log objects
 * @returns {Object} Development analysis
 */
function analyzePalateDevelopment(logs) {
  if (!logs || logs.length === 0) {
    return {
      stage: 'beginner',
      sophisticationScore: 0,
      trajectory: 'not-enough-data'
    };
  }
  
  // Sort logs by date
  const sortedLogs = logs.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Analyze descriptor usage over time
  const descriptorEvolution = analyzeDescriptorComplexity(sortedLogs);
  
  // Analyze rating consistency (more consistent = more refined palate)
  const consistencyAnalysis = analyzeRatingConsistency(sortedLogs);
  
  // Analyze sensory discrimination (can you detect subtle differences?)
  const discriminationScore = analyzeSensoryDiscrimination(sortedLogs);
  
  // Calculate overall sophistication score
  const sophisticationScore = calculateSophisticationScore({
    descriptorComplexity: descriptorEvolution.currentComplexity,
    consistency: consistencyAnalysis.consistencyScore,
    discrimination: discriminationScore
  });
  
  // Determine development stage
  const stage = determineDevelopmentStage(sophisticationScore, logs.length);
  
  // Calculate trajectory
  const trajectory = calculateTrajectory(descriptorEvolution);
  
  // Generate personalized recommendations
  const recommendations = generatePalateRecommendations(stage, descriptorEvolution, logs);
  
  return {
    sophisticationScore: Math.round(sophisticationScore),
    stage: stage,
    trajectory: trajectory,
    descriptorEvolution: descriptorEvolution,
    consistency: consistencyAnalysis,
    discrimination: discriminationScore,
    recommendations: recommendations,
    totalBrews: logs.length,
    experienceMonths: calculateExperienceMonths(sortedLogs)
  };
}

/**
 * Analyze descriptor complexity over time
 */
function analyzeDescriptorComplexity(logs) {
  const timeSegments = divideIntoTimeSegments(logs, 4); // Divide into 4 quarters
  
  const segmentComplexity = timeSegments.map((segment, index) => {
    const allDescriptors = segment
      .flatMap(log => log.descriptors || log['flavor-notes'] || [])
      .map(d => d.toLowerCase());
    
    const basicCount = allDescriptors.filter(d => 
      DESCRIPTOR_COMPLEXITY.basic.some(b => d.includes(b))
    ).length;
    
    const intermediateCount = allDescriptors.filter(d =>
      DESCRIPTOR_COMPLEXITY.intermediate.some(i => d.includes(i))
    ).length;
    
    const advancedCount = allDescriptors.filter(d =>
      DESCRIPTOR_COMPLEXITY.advanced.some(a => d.includes(a))
    ).length;
    
    const expertCount = allDescriptors.filter(d =>
      DESCRIPTOR_COMPLEXITY.expert.some(e => d.includes(e))
    ).length;
    
    const totalDescriptors = allDescriptors.length;
    const complexityScore = (
      basicCount * 1 +
      intermediateCount * 2 +
      advancedCount * 3 +
      expertCount * 4
    ) / (totalDescriptors || 1);
    
    return {
      period: `Q${index + 1}`,
      basicCount,
      intermediateCount,
      advancedCount,
      expertCount,
      totalDescriptors,
      complexityScore: complexityScore.toFixed(2),
      uniqueDescriptors: new Set(allDescriptors).size
    };
  });
  
  return {
    byPeriod: segmentComplexity,
    currentComplexity: segmentComplexity[segmentComplexity.length - 1]?.complexityScore || 0,
    initialComplexity: segmentComplexity[0]?.complexityScore || 0,
    improvement: segmentComplexity.length > 1
      ? parseFloat(segmentComplexity[segmentComplexity.length - 1].complexityScore) - 
        parseFloat(segmentComplexity[0].complexityScore)
      : 0
  };
}

/**
 * Analyze rating consistency
 */
function analyzeRatingConsistency(logs) {
  const ratings = logs.map(l => l.rating).filter(r => r);
  
  if (ratings.length < 5) {
    return { consistencyScore: 0, interpretation: 'insufficient-data' };
  }
  
  // Calculate standard deviation
  const mean = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
  const variance = ratings.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / ratings.length;
  const stdDev = Math.sqrt(variance);
  
  // Lower std dev = more consistent = more refined palate
  // Normalize to 0-100 scale (inverted, so lower stdDev = higher score)
  const consistencyScore = Math.max(0, 100 - (stdDev * 50));
  
  let interpretation = 'developing';
  if (consistencyScore >= 80) interpretation = 'highly-consistent';
  else if (consistencyScore >= 60) interpretation = 'moderately-consistent';
  else if (consistencyScore < 40) interpretation = 'highly-variable';
  
  return {
    consistencyScore: Math.round(consistencyScore),
    standardDeviation: stdDev.toFixed(2),
    meanRating: mean.toFixed(2),
    interpretation: interpretation
  };
}

/**
 * Analyze sensory discrimination ability
 */
function analyzeSensoryDiscrimination(logs) {
  // Can the user detect subtle differences between similar coffees?
  // Measured by rating variance within bean types
  
  const beanGroups = {};
  logs.forEach(log => {
    const key = `${log.origin}-${log.roastLevel}`;
    if (!beanGroups[key]) beanGroups[key] = [];
    beanGroups[key].push(log.rating);
  });
  
  // Groups with multiple logs show discrimination ability
  const discriminationScores = Object.entries(beanGroups)
    .filter(([key, ratings]) => ratings.length >= 3)
    .map(([key, ratings]) => {
      const mean = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
      const variance = ratings.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / ratings.length;
      return Math.sqrt(variance);
    });
  
  if (discriminationScores.length === 0) {
    return 50; // Neutral score
  }
  
  const avgDiscrimination = discriminationScores.reduce((sum, s) => sum + s, 0) / discriminationScores.length;
  
  // Higher variance within category = better discrimination
  return Math.min(100, Math.round(avgDiscrimination * 40));
}

/**
 * Calculate overall sophistication score
 */
function calculateSophisticationScore({ descriptorComplexity, consistency, discrimination }) {
  const complexityWeight = 0.4;
  const consistencyWeight = 0.3;
  const discriminationWeight = 0.3;
  
  const score = (
    parseFloat(descriptorComplexity) * 25 * complexityWeight +
    consistency * consistencyWeight +
    discrimination * discriminationWeight
  );
  
  return Math.min(100, score);
}

/**
 * Determine development stage
 */
function determineDevelopmentStage(sophisticationScore, totalBrews) {
  if (totalBrews < 20 || sophisticationScore < 30) {
    return 'beginner';
  } else if (totalBrews < 50 || sophisticationScore < 50) {
    return 'developing';
  } else if (totalBrews < 100 || sophisticationScore < 70) {
    return 'intermediate';
  } else if (sophisticationScore < 85) {
    return 'advanced';
  } else {
    return 'expert';
  }
}

/**
 * Calculate development trajectory
 */
function calculateTrajectory(descriptorEvolution) {
  const improvement = descriptorEvolution.improvement;
  
  if (improvement > 0.5) return 'rapidly-improving';
  if (improvement > 0.2) return 'improving';
  if (improvement > -0.2) return 'stable';
  return 'needs-focus';
}

/**
 * Generate personalized palate development recommendations
 */
function generatePalateRecommendations(stage, evolution, logs) {
  const recommendations = [];
  
  if (stage === 'beginner') {
    recommendations.push({
      focus: 'Build flavor vocabulary',
      action: 'Try 10 different origins to build reference points',
      resources: ['Flavor wheel exercises', 'Side-by-side comparisons']
    });
  }
  
  if (stage === 'developing') {
    recommendations.push({
      focus: 'Refine discrimination',
      action: 'Cup same coffee with different brew parameters',
      resources: ['Formal cupping practice', 'Sensory science reading']
    });
  }
  
  if (stage === 'intermediate' || stage === 'advanced') {
    recommendations.push({
      focus: 'Expand descriptor range',
      action: 'Try experimental processing and rare origins',
      resources: ['Advanced cupping protocols', 'SCA certification prep']
    });
  }
  
  // Specific recommendations based on evolution
  if (evolution.currentComplexity < 2) {
    recommendations.push({
      focus: 'Use more specific descriptors',
      action: 'Instead of "fruity", identify specific fruits (blueberry, peach, etc.)',
      resources: ['Coffee flavor wheel', 'Descriptor training exercises']
    });
  }
  
  return recommendations;
}

/**
 * Helper: Divide logs into time segments
 */
function divideIntoTimeSegments(logs, segments) {
  const logsPerSegment = Math.ceil(logs.length / segments);
  const divided = [];
  
  for (let i = 0; i < segments; i++) {
    const start = i * logsPerSegment;
    const end = Math.min((i + 1) * logsPerSegment, logs.length);
    divided.push(logs.slice(start, end));
  }
  
  return divided.filter(seg => seg.length > 0);
}

/**
 * Helper: Calculate experience in months
 */
function calculateExperienceMonths(logs) {
  if (logs.length < 2) return 0;
  
  const firstLog = new Date(logs[0].date);
  const lastLog = new Date(logs[logs.length - 1].date);
  const monthsDiff = (lastLog - firstLog) / (1000 * 60 * 60 * 24 * 30);
  
  return Math.max(1, Math.round(monthsDiff));
}

/**
 * Track flavor recognition accuracy
 * Compares predicted vs actual flavors over time
 */
function trackFlavorRecognition(logs) {
  // Future: Compare roaster's notes vs. user's notes
  // Measure accuracy of identifying flavors over time
  
  return {
    accuracyTrend: 'improving',
    currentAccuracy: 75, // Simulated
    targetAccuracy: 85
  };
}

/**
 * Export all functions
 */
module.exports = {
  analyzePalateDevelopment,
  analyzeDescriptorComplexity,
  analyzeRatingConsistency,
  analyzeSensoryDiscrimination,
  determineDevelopmentStage,
  generatePalateRecommendations,
  trackFlavorRecognition,
  DESCRIPTOR_COMPLEXITY
};

