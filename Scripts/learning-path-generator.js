/**
 * Learning Path Generator - Coffee Vault 5.0
 * Version: 1.0.0
 * 
 * Personalized learning path generation:
 * - Identify knowledge gaps
 * - Generate customized learning paths
 * - Track reading progress
 * - Recommend next steps
 * 
 * Usage:
 *   const generator = require('./learning-path-generator.js');
 *   const path = generator.generateLearningPath(userData, preferences);
 */

/**
 * Learning curriculum structure
 * Organized by skill level and topic
 */
const CURRICULUM = {
  beginner: {
    extraction: [
      'Coffee Brewing Control Chart',
      'Understanding TDS and Extraction Yield',
      'The Coffee Compass',
      'Basic Grind Size Impact'
    ],
    brewing: [
      'Pour Over Fundamentals',
      'Immersion Brewing Basics',
      'Water Temperature Effects',
      'Brew Ratio Principles'
    ],
    tasting: [
      'Flavor Wheel Introduction',
      'Basic Taste Components',
      'Identifying Primary Flavors',
      'Rating Coffee Objectively'
    ]
  },
  
  intermediate: {
    extraction: [
      'Advanced Extraction Theory',
      'Flow Rate and Extraction Dynamics',
      'Solubility and Extraction Rates',
      'Channeling Prevention'
    ],
    brewing: [
      'Advanced Pour Techniques',
      'Bloom Chemistry',
      'Agitation Methods',
      'Temperature Stability'
    ],
    tasting: [
      'Flavor Wheel Mastery',
      'Acidity Types and Quality',
      'Body and Mouthfeel Analysis',
      'Defect Recognition'
    ],
    roasting: [
      'Roast Development Basics',
      'First Crack and Second Crack',
      'Roast Level Impact on Flavor',
      'Reading Roast Curves'
    ]
  },
  
  advanced: {
    extraction: [
      'Multi-Phase Extraction Modeling',
      'Advanced Flow Dynamics',
      'Particle Size Distribution',
      'Mathematical Extraction Models'
    ],
    brewing: [
      'Competition Brewing Techniques',
      'Water Chemistry Optimization',
      'Espresso Pressure Profiling',
      'Advanced Recipe Development'
    ],
    tasting: [
      'Professional Cupping Standards',
      'SCA Cupping Protocol Mastery',
      'Descriptor Precision Training',
      'Palate Calibration'
    ],
    roasting: [
      'Roast Curve Development',
      'Advanced Roast Profiling',
      'Roast Defects and Corrections',
      'Origin-Specific Roasting'
    ],
    chemistry: [
      'Maillard Reaction in Coffee',
      'Volatile Compound Formation',
      'Chlorogenic Acid Degradation',
      'Advanced Coffee Chemistry'
    ]
  }
};

/**
 * Generate personalized learning path
 * @param {Object} userData - User's current state and history
 * @param {Object} preferences - Learning preferences
 * @returns {Object} Customized learning path
 */
function generateLearningPath(userData, preferences = {}) {
  const {
    totalBrews = 0,
    currentLevel = 'beginner',
    interests = [],
    goalsSet = []
  } = userData;
  
  // Determine skill level
  const skillLevel = determineSkillLevel(totalBrews, userData);
  
  // Identify knowledge gaps
  const gaps = identifyKnowledgeGaps(userData);
  
  // Build learning path
  const path = buildLearningSequence(skillLevel, gaps, interests, preferences);
  
  // Estimate timeline
  const timeline = estimateLearningTimeline(path);
  
  return {
    skillLevel: skillLevel,
    knowledgeGaps: gaps,
    learningPath: path,
    estimatedTimeline: timeline,
    nextSteps: path.slice(0, 3),
    recommendations: generateLearningRecommendations(skillLevel, gaps)
  };
}

/**
 * Determine skill level based on experience
 */
function determineSkillLevel(totalBrews, userData) {
  if (totalBrews < 20) return 'beginner';
  if (totalBrews < 50) return 'developing';
  if (totalBrews < 100) return 'intermediate';
  if (totalBrews < 200) return 'advanced';
  return 'expert';
}

/**
 * Identify knowledge gaps
 */
function identifyKnowledgeGaps(userData) {
  const gaps = [];
  const {
    methodsUsed = [],
    scientificRefsRead = [],
    extractionMeasured = false,
    formalCuppingDone = false
  } = userData;
  
  // Method gaps
  const allMethods = ['v60', 'chemex', 'aeropress', 'french-press', 'espresso'];
  const methodGaps = allMethods.filter(m => !methodsUsed.includes(m));
  
  if (methodGaps.length > 0) {
    gaps.push({
      category: 'brewing-methods',
      description: `Haven't tried: ${methodGaps.join(', ')}`,
      priority: 'medium',
      resources: methodGaps.map(m => `Brewing Guides/${m}`)
    });
  }
  
  // Extraction knowledge
  if (!extractionMeasured) {
    gaps.push({
      category: 'extraction-science',
      description: 'No extraction measurements yet',
      priority: 'high',
      resources: ['Scientific References/Extraction Science/Coffee Brewing Control Chart']
    });
  }
  
  // Cupping experience
  if (!formalCuppingDone) {
    gaps.push({
      category: 'sensory-skills',
      description: 'No formal cupping experience',
      priority: 'medium',
      resources: ['Templates/Cupping Session', 'Scientific References/Sensory Science/']
    });
  }
  
  return gaps;
}

/**
 * Build learning sequence
 */
function buildLearningSequence(skillLevel, gaps, interests, preferences) {
  const sequence = [];
  const curriculum = CURRICULUM[skillLevel] || CURRICULUM.beginner;
  
  // Prioritize based on gaps
  gaps.forEach(gap => {
    gap.resources.forEach(resource => {
      sequence.push({
        type: 'resource',
        category: gap.category,
        resource: resource,
        priority: gap.priority,
        estimatedTime: '30 minutes'
      });
    });
  });
  
  // Add curriculum items based on interests
  interests.forEach(interest => {
    const topicItems = curriculum[interest] || [];
    topicItems.forEach(item => {
      sequence.push({
        type: 'curriculum',
        category: interest,
        resource: item,
        priority: 'medium',
        estimatedTime: '45 minutes'
      });
    });
  });
  
  // Add next-level preview if advanced
  if (skillLevel === 'intermediate') {
    sequence.push({
      type: 'preview',
      category: 'next-level',
      resource: 'Preview of advanced topics',
      priority: 'low',
      estimatedTime: '20 minutes'
    });
  }
  
  return sequence;
}

/**
 * Estimate learning timeline
 */
function estimateLearningTimeline(learningPath) {
  const totalMinutes = learningPath.reduce((sum, item) => {
    const minutes = parseInt(item.estimatedTime) || 30;
    return sum + minutes;
  }, 0);
  
  const hours = (totalMinutes / 60).toFixed(1);
  const weeks = Math.ceil(totalMinutes / (60 * 7)); // Assuming 1 hour per week
  
  return {
    totalHours: hours,
    estimatedWeeks: weeks,
    itemCount: learningPath.length,
    dailyTime: '10-15 minutes recommended'
  };
}

/**
 * Generate learning recommendations
 */
function generateLearningRecommendations(skillLevel, gaps) {
  const recommendations = [];
  
  if (skillLevel === 'beginner') {
    recommendations.push({
      focus: 'Foundation building',
      action: 'Focus on one brewing method, master the basics',
      timeline: '2-3 months',
      resources: ['Brewing Guides', 'Scientific References/Extraction Science']
    });
  }
  
  if (skillLevel === 'intermediate') {
    recommendations.push({
      focus: 'Breadth and depth',
      action: 'Expand to 3 brewing methods, study extraction science',
      timeline: '3-6 months',
      resources: ['Advanced Brewing Guides', 'Extraction Science', 'Sensory Training']
    });
  }
  
  if (skillLevel === 'advanced') {
    recommendations.push({
      focus: 'Mastery and specialization',
      action: 'Consider SCA certification, competition brewing',
      timeline: '6-12 months',
      resources: ['Professional cupping', 'Roasting science', 'Advanced chemistry']
    });
  }
  
  // Gap-specific recommendations
  gaps.forEach(gap => {
    if (gap.category === 'extraction-science') {
      recommendations.push({
        focus: 'Extraction measurement',
        action: 'Purchase TDS meter, start measuring extraction',
        timeline: '1 month',
        resources: gap.resources
      });
    }
  });
  
  return recommendations;
}

/**
 * Track reading progress
 */
function trackReadingProgress(scientificRefs, readRefs) {
  const total = scientificRefs.length;
  const read = readRefs.length;
  const percentage = Math.round((read / total) * 100);
  
  const byCategory = {};
  scientificRefs.forEach(ref => {
    const cat = ref.category || 'other';
    if (!byCategory[cat]) {
      byCategory[cat] = { total: 0, read: 0 };
    }
    byCategory[cat].total++;
    
    if (readRefs.some(r => r === ref.title || r === ref.file)) {
      byCategory[cat].read++;
    }
  });
  
  return {
    totalReferences: total,
    referencesRead: read,
    percentageComplete: percentage,
    byCategory: byCategory,
    estimatedTimeRemaining: `${Math.round((total - read) * 0.5)} hours`
  };
}

/**
 * Suggest reading for today
 */
function suggestDailyReading(userData, availableTime = 15) {
  // Suggest one reference based on:
  // - Current skill level
  // - Knowledge gaps
  // - Available time
  // - Recently read (avoid duplicates)
  
  const suggestions = [];
  
  if (availableTime >= 45) {
    suggestions.push({
      type: 'in-depth',
      resource: 'Advanced extraction science article',
      estimatedTime: '45 minutes',
      benefit: 'Deep understanding of extraction dynamics'
    });
  } else if (availableTime >= 20) {
    suggestions.push({
      type: 'focused',
      resource: 'Specific brewing technique guide',
      estimatedTime: '20 minutes',
      benefit: 'Practical improvement in one area'
    });
  } else {
    suggestions.push({
      type: 'quick',
      resource: 'Quick tip or single concept',
      estimatedTime: '10 minutes',
      benefit: 'Small improvement, easy to implement'
    });
  }
  
  return suggestions;
}

/**
 * Export all functions
 */
module.exports = {
  generateLearningPath,
  identifyKnowledgeGaps,
  buildLearningSequence,
  generateLearningRecommendations,
  trackReadingProgress,
  suggestDailyReading,
  CURRICULUM
};
