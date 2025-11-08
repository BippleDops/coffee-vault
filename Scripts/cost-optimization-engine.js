/**
 * Cost Optimization Engine - Coffee Vault 5.0
 * Version: 1.0.0
 * 
 * Multi-objective optimization for cost vs quality:
 * - Optimal purchasing strategy
 * - Value recommendations
 * - Subscription management
 * - Budget optimization
 * 
 * Usage:
 *   const optimizer = require('./cost-optimization-engine.js');
 *   const recommendations = optimizer.optimizeCostStrategy(userData, budget);
 */

/**
 * Calculate cost efficiency for a bean
 * Returns quality per dollar spent
 */
function calculateCostEfficiency(bean, usageData) {
  const {
    purchasePrice = 0,
    weightPurchased = 340,
    avgRating = 0,
    totalSessions = 0
  } = bean;
  
  if (purchasePrice === 0 || totalSessions === 0) {
    return 0;
  }
  
  const costPer100g = (purchasePrice / weightPurchased) * 100;
  const qualityPerDollar = avgRating / costPer100g;
  
  return {
    costPer100g: costPer100g.toFixed(2),
    costPerSession: (purchasePrice / totalSessions).toFixed(2),
    qualityPerDollar: qualityPerDollar.toFixed(4),
    efficiencyScore: Math.round(qualityPerDollar * 1000) // Normalized 0-100
  };
}

/**
 * Optimize purchasing strategy
 * @param {Object} userData - User's coffee consumption data
 * @param {Number} monthlyBudget - Monthly budget in dollars
 * @returns {Object} Optimized purchasing recommendations
 */
function optimizeCostStrategy(userData, monthlyBudget = 100) {
  const {
    beans = [],
    historicalConsumption = {},
    preferences = {}
  } = userData;
  
  // Calculate consumption patterns
  const avgSessionsPerMonth = historicalConsumption.avgSessionsPerMonth || 30;
  const avgDosePerSession = historicalConsumption.avgDosePerSession || 18; // grams
  const totalCoffeeNeededMonthly = avgSessionsPerMonth * avgDosePerSession; // grams
  
  // Sort beans by cost efficiency
  const beansWithEfficiency = beans.map(bean => ({
    ...bean,
    efficiency: calculateCostEfficiency(bean, bean)
  })).sort((a, b) => b.efficiency.efficiencyScore - a.efficiency.efficiencyScore);
  
  // Multi-objective optimization
  const recommendations = [];
  let remainingBudget = monthlyBudget;
  let remainingCoffeeNeeded = totalCoffeeNeededMonthly;
  
  // Strategy 1: 80/20 rule - 80% budget for high-quality favorites
  const budgetForPremium = monthlyBudget * 0.8;
  const budgetForExploration = monthlyBudget * 0.2;
  
  // Select premium beans (high rating, good efficiency)
  const premiumBeans = beansWithEfficiency.filter(b => 
    b.avgRating >= 4.0 && b.efficiency.efficiencyScore >= 30
  ).slice(0, 2);
  
  // Select value beans (good efficiency, moderate rating)
  const valueBeans = beansWithEfficiency.filter(b =>
    b.avgRating >= 3.5 && b.efficiency.efficiencyScore >= 40
  ).slice(0, 2);
  
  // Generate recommendation
  recommendations.push({
    strategy: '80/20 Quality-Value Balance',
    breakdown: {
      premium: {
        budget: budgetForPremium,
        beans: premiumBeans.map(b => b.name),
        expectedQuality: premiumBeans.length > 0 
          ? (premiumBeans.reduce((sum, b) => sum + b.avgRating, 0) / premiumBeans.length).toFixed(2)
          : 'N/A'
      },
      value: {
        budget: budgetForExploration,
        beans: valueBeans.map(b => b.name),
        expectedQuality: valueBeans.length > 0
          ? (valueBeans.reduce((sum, b) => sum + b.avgRating, 0) / valueBeans.length).toFixed(2)
          : 'N/A'
      }
    },
    estimatedMonthlyRating: calculateEstimatedRating(premiumBeans, valueBeans),
    coffeeVolume: estimateCoffeeVolume(monthlyBudget, beansWithEfficiency)
  });
  
  // Strategy 2: Maximum quality (budget allows)
  const maxQualityBeans = beansWithEfficiency
    .filter(b => b.avgRating >= 4.0)
    .slice(0, 3);
  
  recommendations.push({
    strategy: 'Maximum Quality',
    beans: maxQualityBeans.map(b => b.name),
    estimatedCost: calculateTotalCost(maxQualityBeans, totalCoffeeNeededMonthly),
    estimatedRating: maxQualityBeans.length > 0
      ? (maxQualityBeans.reduce((sum, b) => sum + b.avgRating, 0) / maxQualityBeans.length).toFixed(2)
      : 'N/A',
    budgetFit: 'May exceed budget'
  });
  
  // Strategy 3: Maximum value (stretch budget)
  const maxValueBeans = beansWithEfficiency.slice(0, 5);
  
  recommendations.push({
    strategy: 'Maximum Value',
    beans: maxValueBeans.map(b => b.name),
    estimatedCost: calculateTotalCost(maxValueBeans, totalCoffeeNeededMonthly),
    estimatedRating: maxValueBeans.length > 0
      ? (maxValueBeans.reduce((sum, b) => sum + b.avgRating, 0) / maxValueBeans.length).toFixed(2)
      : 'N/A',
    budgetFit: 'Within budget'
  });
  
  return recommendations;
}

/**
 * Optimize subscription management
 */
function optimizeSubscriptions(userData, preferences) {
  const {
    currentSubscriptions = [],
    monthlyConsumption = 540 // grams
  } = userData;
  
  const recommendations = [];
  
  // Calculate if subscription makes sense
  const avgPricePerKg = 45; // Average specialty coffee price
  const subscriptionDiscount = 0.15; // Typical 15% discount
  
  const standardCost = (monthlyConsumption / 1000) * avgPricePerKg;
  const subscriptionCost = standardCost * (1 - subscriptionDiscount);
  const monthlySavings = standardCost - subscriptionCost;
  
  recommendations.push({
    recommendation: monthlySavings > 5 ? 'Consider subscription' : 'One-off purchases better',
    monthlySavings: monthlySavings.toFixed(2),
    annualSavings: (monthlySavings * 12).toFixed(2),
    reasoning: monthlySavings > 5 
      ? 'Subscription would save you money based on your consumption'
      : 'Your consumption is low enough that subscriptions may not provide value'
  });
  
  return recommendations;
}

/**
 * Recommend best value beans from available options
 */
function recommendBestValue(beans, qualityThreshold = 3.5) {
  return beans
    .filter(b => b.avgRating >= qualityThreshold)
    .map(b => {
      const efficiency = calculateCostEfficiency(b, b);
      return { ...b, ...efficiency };
    })
    .sort((a, b) => b.efficiencyScore - a.efficiencyScore)
    .slice(0, 10);
}

/**
 * Budget allocation optimizer
 */
function allocateBudget(monthlyBudget, preferences) {
  const allocation = {
    beans: monthlyBudget * 0.70,           // 70% on beans
    equipment: monthlyBudget * 0.20,        // 20% equipment fund
    learning: monthlyBudget * 0.05,         // 5% courses/books
    exploration: monthlyBudget * 0.05       // 5% trying new things
  };
  
  // Adjust based on preferences
  if (preferences.focusOnEquipment) {
    allocation.equipment = monthlyBudget * 0.35;
    allocation.beans = monthlyBudget * 0.55;
  }
  
  if (preferences.focusOnLearning) {
    allocation.learning = monthlyBudget * 0.15;
    allocation.beans = monthlyBudget * 0.60;
  }
  
  return allocation;
}

/**
 * Helper: Calculate estimated rating
 */
function calculateEstimatedRating(premiumBeans, valueBeans) {
  const allBeans = [...premiumBeans, ...valueBeans];
  if (allBeans.length === 0) return 'N/A';
  
  const avgRating = allBeans.reduce((sum, b) => sum + (b.avgRating || 0), 0) / allBeans.length;
  return avgRating.toFixed(2);
}

/**
 * Helper: Estimate coffee volume from budget
 */
function estimateCoffeeVolume(budget, beans) {
  if (beans.length === 0) return 'N/A';
  
  const avgCostPer100g = beans.reduce((sum, b) => {
    const cost = b.efficiency ? parseFloat(b.efficiency.costPer100g) : 15;
    return sum + cost;
  }, 0) / beans.length;
  
  const gramsAffordable = (budget / avgCostPer100g) * 100;
  return `${Math.round(gramsAffordable)}g`;
}

/**
 * Helper: Calculate total cost
 */
function calculateTotalCost(beans, gramsNeeded) {
  if (beans.length === 0) return 0;
  
  const avgCostPer100g = beans.reduce((sum, b) => {
    const cost = b.efficiency ? parseFloat(b.efficiency.costPer100g) : 15;
    return sum + cost;
  }, 0) / beans.length;
  
  return ((gramsNeeded / 100) * avgCostPer100g).toFixed(2);
}

/**
 * Export all functions
 */
module.exports = {
  calculateCostEfficiency,
  optimizeCostStrategy,
  optimizeSubscriptions,
  recommendBestValue,
  allocateBudget
};

