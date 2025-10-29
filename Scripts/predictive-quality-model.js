/**
 * Predictive Quality Model for Coffee Vault
 * Version: 1.0.0
 *
 * Implements advanced predictive models for quality forecasting
 * using ensemble methods and feature engineering.
 */

const stats = require('./stats-utils.js');
const ml = require('./ml-engine.js');

/**
 * Feature engineering: Extract relevant features from brewing session
 * @param {Object} session - Brewing session data
 * @returns {Object} Engineered features
 */
function extractFeatures(session) {
  const features = {};

  // Numeric features
  if (session['water-temp']) features.waterTemp = parseFloat(session['water-temp']);
  if (session['brew-time']) features.brewTime = parseFloat(session['brew-time']);
  if (session.dose) features.dose = parseFloat(session.dose);
  if (session.ratio) {
    // Convert ratio string like "1:16" to numeric
    const match = session.ratio.toString().match(/1:(\d+\.?\d*)/);
    features.ratio = match ? parseFloat(match[1]) : 16;
  }

  // Categorical features encoded as numeric
  const grindSizeMap = {
    'extra-fine': 1,
    'fine': 2,
    'medium-fine': 3,
    'medium': 4,
    'medium-coarse': 5,
    'coarse': 6,
    'extra-coarse': 7
  };

  if (session['grind-size']) {
    features.grindSize = grindSizeMap[session['grind-size']] || 4;
  }

  const roastLevelMap = {
    'light': 1,
    'medium-light': 2,
    'medium': 3,
    'medium-dark': 4,
    'dark': 5
  };

  if (session['roast-level']) {
    features.roastLevel = roastLevelMap[session['roast-level']] || 3;
  }

  // Derived features
  if (features.waterTemp && features.roastLevel) {
    // Interaction: temperature appropriateness for roast
    const idealTemp = 92 + (3 - features.roastLevel); // Lighter roasts need hotter water
    features.tempRoastMatch = 10 - Math.abs(features.waterTemp - idealTemp);
  }

  if (features.grindSize && features.brewTime) {
    // Interaction: grind/time consistency
    features.grindTimeBalance = Math.abs(features.grindSize - features.brewTime * 2);
  }

  return features;
}

/**
 * Build comprehensive quality prediction model
 * @param {Object} dv - Dataview API
 * @returns {Object} Trained model
 */
function buildQualityModel(dv) {
  // Get all coffee logs
  const logs = dv.pages('"Coffee Logs"')
    .where(p => p.type === "coffee-log" && p.rating != null)
    .sort(p => p.date, 'desc')
    .limit(200)
    .array();

  if (logs.length < 10) {
    return {
      ready: false,
      dataPoints: logs.length,
      message: "Need at least 10 logged sessions to build model"
    };
  }

  // Extract features from all sessions
  const trainingData = logs.map(log => ({
    ...extractFeatures(log),
    rating: log.rating,
    date: log.date,
    beans: log.beans,
    method: log['brew-method']
  }));

  // Identify important features
  const numericFeatures = ['waterTemp', 'brewTime', 'dose', 'ratio', 'grindSize', 'roastLevel'];
  const availableFeatures = numericFeatures.filter(f =>
    trainingData.filter(d => d[f] != null).length > logs.length * 0.3
  );

  // Build decision rules
  const rules = ml.buildDecisionRules(trainingData, availableFeatures);

  // Calculate feature importance
  const featureImportance = calculateFeatureImportance(trainingData, availableFeatures);

  // Identify optimal parameter clusters
  const optimalCombinations = ml.findOptimalCombinations(
    trainingData,
    availableFeatures,
    4.5
  );

  return {
    ready: true,
    dataPoints: logs.length,
    features: availableFeatures,
    rules,
    featureImportance,
    optimalCombinations,
    trainingData: trainingData.map(d => ({
      ...d,
      rawData: null // Don't store raw data in model
    }))
  };
}

/**
 * Calculate feature importance using correlation with rating
 */
function calculateFeatureImportance(data, features) {
  const importance = [];

  features.forEach(feature => {
    const values = data.map(d => d[feature]).filter(v => v != null);
    const ratings = data
      .filter(d => d[feature] != null && d.rating != null)
      .map(d => d.rating);

    if (values.length >= 5) {
      const correlation = Math.abs(stats.pearsonCorrelation(values, ratings));
      importance.push({
        feature,
        importance: correlation,
        strength: stats.interpretCorrelation(correlation)
      });
    }
  });

  importance.sort((a, b) => b.importance - a.importance);
  return importance;
}

/**
 * Predict quality for a new brewing session
 * @param {Object} session - New session parameters
 * @param {Object} model - Trained model
 * @param {number} k - Number of neighbors for KNN
 * @returns {Object} Prediction results
 */
function predictQuality(session, model, k = 7) {
  if (!model || !model.ready) {
    return {
      prediction: 0,
      confidence: 0,
      message: "Model not ready"
    };
  }

  const features = extractFeatures(session);
  const testPoint = { ...features };

  // KNN prediction
  const knnResult = ml.knnPredict(
    testPoint,
    model.trainingData,
    model.features,
    k
  );

  // Rule-based adjustments
  let ruleAdjustment = 0;
  const matchedRules = [];

  model.rules.forEach(rule => {
    const value = features[rule.feature];
    if (value != null) {
      if (rule.direction === 'above' && value >= rule.threshold) {
        ruleAdjustment += rule.impact * 0.1;
        matchedRules.push(rule);
      } else if (rule.direction === 'below' && value < rule.threshold) {
        ruleAdjustment += rule.impact * 0.1;
        matchedRules.push(rule);
      }
    }
  });

  // Ensemble prediction (weighted average of KNN and rules)
  const ensemblePrediction = Math.min(5,
    knnResult.prediction * 0.8 + ruleAdjustment
  );

  // Find most similar historical session
  const similarSessions = ml.findSimilarSessions(
    testPoint,
    model.trainingData.filter(d => d.rating != null),
    model.features,
    3
  );

  return {
    prediction: Math.round(ensemblePrediction * 100) / 100,
    confidence: knnResult.confidence,
    knnPrediction: knnResult.prediction,
    ruleAdjustment: Math.round(ruleAdjustment * 100) / 100,
    matchedRules: matchedRules.slice(0, 3),
    nearestNeighbors: knnResult.neighbors,
    similarSessions: similarSessions.map(s => ({
      rating: s.session.rating,
      similarity: (s.similarity * 100).toFixed(1) + '%',
      beans: s.session.beans,
      method: s.session.method
    }))
  };
}

/**
 * Generate recommendations to improve quality
 * @param {Object} currentSession - Current parameters
 * @param {Object} model - Trained model
 * @returns {Array} Recommendations
 */
function generateImprovementRecommendations(currentSession, model) {
  if (!model || !model.ready) return [];

  const recommendations = [];
  const current = extractFeatures(currentSession);

  // Check against optimal combinations
  if (model.optimalCombinations && model.optimalCombinations.length > 0) {
    const bestCombo = model.optimalCombinations[0];

    model.features.forEach(feature => {
      if (current[feature] != null && bestCombo.profile[feature]) {
        const optimal = parseFloat(bestCombo.profile[feature].mean);
        const diff = Math.abs(current[feature] - optimal);

        if (diff > optimal * 0.15) { // More than 15% difference
          const direction = current[feature] < optimal ? 'increase' : 'decrease';
          recommendations.push({
            parameter: feature,
            current: current[feature].toFixed(2),
            recommended: optimal.toFixed(2),
            action: `${direction} ${feature}`,
            priority: diff > optimal * 0.3 ? 'high' : 'medium'
          });
        }
      }
    });
  }

  // Check against decision rules
  model.rules.slice(0, 5).forEach(rule => {
    const value = current[rule.feature];
    if (value != null) {
      const shouldBeAbove = rule.direction === 'above';
      const isAbove = value >= rule.threshold;

      if (shouldBeAbove !== isAbove) {
        recommendations.push({
          parameter: rule.feature,
          current: value.toFixed(2),
          recommended: rule.threshold.toFixed(2),
          action: shouldBeAbove
            ? `Increase ${rule.feature} to above ${rule.threshold.toFixed(2)}`
            : `Decrease ${rule.feature} to below ${rule.threshold.toFixed(2)}`,
          priority: rule.impact > 0.5 ? 'high' : 'medium',
          expectedImpact: `+${rule.impact.toFixed(2)} rating points`
        });
      }
    }
  });

  // Deduplicate and prioritize
  const uniqueRecs = [];
  const seen = new Set();

  recommendations.forEach(rec => {
    if (!seen.has(rec.parameter)) {
      seen.add(rec.parameter);
      uniqueRecs.push(rec);
    }
  });

  uniqueRecs.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return uniqueRecs.slice(0, 5);
}

/**
 * Analyze prediction accuracy using cross-validation
 * @param {Object} model - Trained model
 * @param {number} folds - Number of CV folds
 * @returns {Object} Accuracy metrics
 */
function validateModel(model, folds = 5) {
  if (!model || !model.ready || model.trainingData.length < folds * 2) {
    return { valid: false, message: "Insufficient data for validation" };
  }

  const data = model.trainingData.filter(d => d.rating != null);
  const foldSize = Math.floor(data.length / folds);

  const errors = [];
  const absoluteErrors = [];

  for (let i = 0; i < folds; i++) {
    const testStart = i * foldSize;
    const testEnd = i === folds - 1 ? data.length : (i + 1) * foldSize;

    const testSet = data.slice(testStart, testEnd);
    const trainSet = [...data.slice(0, testStart), ...data.slice(testEnd)];

    // Create temporary model
    const tempModel = {
      ...model,
      trainingData: trainSet
    };

    testSet.forEach(testPoint => {
      const prediction = predictQuality(testPoint, tempModel);
      const error = prediction.prediction - testPoint.rating;
      errors.push(error);
      absoluteErrors.push(Math.abs(error));
    });
  }

  const mae = stats.mean(absoluteErrors);
  const rmse = Math.sqrt(stats.mean(errors.map(e => e * e)));
  const bias = stats.mean(errors);

  return {
    valid: true,
    meanAbsoluteError: mae.toFixed(3),
    rootMeanSquaredError: rmse.toFixed(3),
    bias: bias.toFixed(3),
    accuracy: Math.max(0, (1 - mae / 5) * 100).toFixed(1) + '%',
    interpretation: mae < 0.3
      ? "Excellent prediction accuracy"
      : mae < 0.5
        ? "Good prediction accuracy"
        : mae < 0.8
          ? "Moderate prediction accuracy"
          : "Low prediction accuracy - need more data"
  };
}

/**
 * Forecast quality trend for upcoming sessions
 * @param {Object} dv - Dataview API
 * @param {number} periods - Number of periods to forecast
 * @returns {Object} Forecast results
 */
function forecastQualityTrend(dv, periods = 7) {
  const logs = dv.pages('"Coffee Logs"')
    .where(p => p.type === "coffee-log" && p.rating != null)
    .sort(p => p.date, 'asc')
    .array();

  if (logs.length < 14) {
    return {
      ready: false,
      message: "Need at least 14 sessions for trend forecasting"
    };
  }

  const ratings = logs.map(l => l.rating);
  const dates = logs.map(l => l.date);

  // Exponential smoothing forecast
  const { forecast, smoothed } = ml.exponentialSmoothing(ratings, 0.3, periods);

  // Trend analysis
  const trend = stats.detectTrend(ratings);

  // Calculate confidence intervals (simple approach)
  const recentErrors = [];
  for (let i = 7; i < smoothed.length; i++) {
    recentErrors.push(Math.abs(ratings[i] - smoothed[i]));
  }
  const avgError = stats.mean(recentErrors);

  return {
    ready: true,
    forecast: forecast.map((pred, idx) => ({
      period: idx + 1,
      prediction: Math.round(pred * 100) / 100,
      lowerBound: Math.max(0, Math.round((pred - avgError * 1.96) * 100) / 100),
      upperBound: Math.min(5, Math.round((pred + avgError * 1.96) * 100) / 100)
    })),
    trend: trend.direction,
    trendStrength: trend.strength.toFixed(2),
    currentAverage: stats.mean(ratings.slice(-7)).toFixed(2),
    historicalData: ratings.slice(-14),
    smoothedData: smoothed.slice(-14)
  };
}

module.exports = {
  buildQualityModel,
  predictQuality,
  generateImprovementRecommendations,
  validateModel,
  forecastQualityTrend,
  extractFeatures
};
