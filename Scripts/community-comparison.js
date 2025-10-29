/**
 * Coffee Vault 5.0 - Community Comparison
 * Version: 5.0.0
 *
 * Compares user preferences with community averages:
 * - Rating comparisons
 * - Method preferences
 * - Origin preferences
 * - Flavor profile similarities
 */

/**
 * Compare user stats with community
 * @param {Array} userLogs - User's coffee logs
 * @param {Array} userBeans - User's bean profiles
 * @param {Object} communityData - Community aggregated data (conceptual)
 * @returns {Object} Comparison results
 */
function compareWithCommunity(userLogs, userBeans, communityData = {}) {
  const comparison = {
    ratings: compareRatings(userLogs, communityData),
    methods: compareMethods(userLogs, communityData),
    origins: compareOrigins(userLogs, userBeans, communityData),
    flavors: compareFlavors(userLogs, communityData),
    trends: compareTrends(userLogs, communityData)
  };
  
  return comparison;
}

/**
 * Compare ratings
 */
function compareRatings(userLogs, communityData) {
  const userRatings = userLogs.map(l => l.rating).filter(Boolean);
  const userAvg = userRatings.length > 0
    ? userRatings.reduce((a, b) => a + b, 0) / userRatings.length
    : 0;
  
  const communityAvg = communityData.avgRating || 4.1; // Placeholder
  
  const difference = userAvg - communityAvg;
  const percentile = calculatePercentile(userAvg, communityData.ratingDistribution || []);
  
  return {
    userAverage: userAvg.toFixed(2),
    communityAverage: communityAvg.toFixed(2),
    difference: difference.toFixed(2),
    differencePercent: ((difference / communityAvg) * 100).toFixed(1),
    percentile: percentile,
    interpretation: difference > 0.2 ? 'above average' :
                   difference < -0.2 ? 'below average' : 'average'
  };
}

/**
 * Compare method preferences
 */
function compareMethods(userLogs, communityData) {
  const userMethodCounts = {};
  userLogs.forEach(log => {
    const method = log['brew-method'];
    if (method) {
      userMethodCounts[method] = (userMethodCounts[method] || 0) + 1;
    }
  });
  
  const userTotal = Object.values(userMethodCounts).reduce((a, b) => a + b, 0);
  const userMethodPercentages = {};
  Object.keys(userMethodCounts).forEach(method => {
    userMethodPercentages[method] = (userMethodCounts[method] / userTotal) * 100;
  });
  
  const communityMethods = communityData.methods || {
    v60: 35,
    chemex: 20,
    aeropress: 15,
    espresso: 15,
    'french-press': 10,
    other: 5
  };
  
  const comparisons = {};
  Object.keys(userMethodPercentages).forEach(method => {
    const userPct = userMethodPercentages[method];
    const communityPct = communityMethods[method] || 0;
    const difference = userPct - communityPct;
    
    comparisons[method] = {
      user: userPct.toFixed(1) + '%',
      community: communityPct.toFixed(1) + '%',
      difference: difference.toFixed(1) + '%',
      interpretation: difference > 10 ? 'much more popular' :
                     difference > 5 ? 'more popular' :
                     difference < -10 ? 'much less popular' :
                     difference < -5 ? 'less popular' : 'similar'
    };
  });
  
  return comparisons;
}

/**
 * Compare origin preferences
 */
function compareOrigins(userLogs, userBeans, communityData) {
  const userOriginCounts = {};
  userLogs.forEach(log => {
    const origin = log.origin;
    if (origin) {
      userOriginCounts[origin] = (userOriginCounts[origin] || 0) + 1;
    }
  });
  
  const userTotal = Object.values(userOriginCounts).reduce((a, b) => a + b, 0);
  const topUserOrigins = Object.entries(userOriginCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([origin, count]) => ({
      origin,
      count,
      percentage: (count / userTotal) * 100
    }));
  
  const communityOrigins = communityData.origins || [
    { origin: 'Ethiopia', percentage: 25 },
    { origin: 'Colombia', percentage: 18 },
    { origin: 'Kenya', percentage: 12 },
    { origin: 'Brazil', percentage: 10 },
    { origin: 'Guatemala', percentage: 8 }
  ];
  
  const comparisons = topUserOrigins.map(userOrigin => {
    const communityOrigin = communityOrigins.find(c => c.origin === userOrigin.origin);
    const communityPct = communityOrigin ? communityOrigin.percentage : 0;
    
    return {
      origin: userOrigin.origin,
      user: userOrigin.percentage.toFixed(1) + '%',
      community: communityPct.toFixed(1) + '%',
      difference: (userOrigin.percentage - communityPct).toFixed(1) + '%'
    };
  });
  
  return comparisons;
}

/**
 * Compare flavor profiles
 */
function compareFlavors(userLogs, communityData) {
  const userDescriptors = userLogs.flatMap(l => [
    ...(l.descriptors || []),
    ...(l['primary-flavor'] ? [l['primary-flavor']] : []),
    ...(l['secondary-flavors'] || [])
  ]);
  
  const userDescriptorCounts = {};
  userDescriptors.forEach(d => {
    userDescriptorCounts[d] = (userDescriptorCounts[d] || 0) + 1;
  });
  
  const topUserDescriptors = Object.entries(userDescriptorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([descriptor]) => descriptor);
  
  const communityDescriptors = communityData.descriptors || [
    'chocolate', 'caramel', 'fruity', 'nutty', 'floral',
    'citrus', 'berry', 'caramel', 'honey', 'winey'
  ];
  
  const shared = topUserDescriptors.filter(d => communityDescriptors.includes(d));
  const unique = topUserDescriptors.filter(d => !communityDescriptors.includes(d));
  
  return {
    topDescriptors: topUserDescriptors,
    sharedWithCommunity: shared,
    uniqueToUser: unique,
    similarityScore: (shared.length / Math.max(topUserDescriptors.length, 1)) * 100
  };
}

/**
 * Compare trends
 */
function compareTrends(userLogs, communityData) {
  // Analyze last 3 months vs previous 3 months
  const now = new Date();
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
  
  const recent = userLogs.filter(l => new Date(l.date) >= threeMonthsAgo);
  const previous = userLogs.filter(l => {
    const date = new Date(l.date);
    return date >= sixMonthsAgo && date < threeMonthsAgo;
  });
  
  const recentAvg = recent.length > 0
    ? recent.map(l => l.rating).filter(Boolean).reduce((a, b) => a + b, 0) / recent.length
    : 0;
  
  const previousAvg = previous.length > 0
    ? previous.map(l => l.rating).filter(Boolean).reduce((a, b) => a + b, 0) / previous.length
    : 0;
  
  return {
    recentAverage: recentAvg.toFixed(2),
    previousAverage: previousAvg.toFixed(2),
    trend: recentAvg > previousAvg ? 'improving' :
          recentAvg < previousAvg ? 'declining' : 'stable',
    change: (recentAvg - previousAvg).toFixed(2)
  };
}

/**
 * Calculate percentile
 */
function calculatePercentile(value, distribution) {
  if (!distribution || distribution.length === 0) return 50;
  
  const sorted = [...distribution].sort((a, b) => a - b);
  const below = sorted.filter(v => v < value).length;
  
  return Math.round((below / sorted.length) * 100);
}

/**
 * Find similar tasters
 */
function findSimilarTasters(userProfile, communityProfiles) {
  // This would compare flavor preferences, method preferences, etc.
  // For now, placeholder implementation
  return [];
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    compareWithCommunity,
    compareRatings,
    compareMethods,
    compareOrigins,
    compareFlavors,
    compareTrends,
    findSimilarTasters
  };
}

