/**
 * Machine Learning Engine for Coffee Vault
 * Version: 1.0.0
 *
 * Advanced ML capabilities for predictive analytics, clustering,
 * classification, and pattern recognition in coffee brewing data.
 *
 * Implements:
 * - K-Nearest Neighbors (KNN) for quality prediction
 * - K-Means clustering for flavor profile grouping
 * - Decision tree approximation for parameter recommendations
 * - Anomaly detection using statistical methods
 * - Time series forecasting
 */

const stats = require('./stats-utils.js');

// ============================================
// K-NEAREST NEIGHBORS (KNN)
// ============================================

/**
 * Normalize features to 0-1 range
 * @param {Array} data - Array of feature objects
 * @param {Array} features - Feature names to normalize
 * @returns {Object} Normalized data and normalization params
 */
function normalizeFeatures(data, features) {
  const ranges = {};

  features.forEach(feature => {
    const values = data.map(d => d[feature]).filter(v => v != null && !isNaN(v));
    if (values.length > 0) {
      ranges[feature] = {
        min: Math.min(...values),
        max: Math.max(...values),
        range: Math.max(...values) - Math.min(...values)
      };
    }
  });

  const normalized = data.map(item => {
    const norm = { ...item };
    features.forEach(feature => {
      const val = item[feature];
      if (val != null && !isNaN(val) && ranges[feature]) {
        const r = ranges[feature];
        norm[feature] = r.range === 0 ? 0 : (val - r.min) / r.range;
      }
    });
    return norm;
  });

  return { normalized, ranges };
}

/**
 * Calculate Euclidean distance between two feature vectors
 */
function euclideanDistance(point1, point2, features) {
  let sum = 0;
  features.forEach(feature => {
    const v1 = point1[feature] || 0;
    const v2 = point2[feature] || 0;
    sum += Math.pow(v1 - v2, 2);
  });
  return Math.sqrt(sum);
}

/**
 * KNN prediction for quality rating
 * @param {Object} testPoint - Point to predict
 * @param {Array} trainingData - Historical data with ratings
 * @param {Array} features - Features to use
 * @param {number} k - Number of neighbors
 * @returns {Object} Prediction and confidence
 */
function knnPredict(testPoint, trainingData, features, k = 5) {
  if (!trainingData || trainingData.length === 0) {
    return { prediction: 0, confidence: 0, neighbors: [] };
  }

  // Normalize data
  const allData = [...trainingData, testPoint];
  const { normalized, ranges } = normalizeFeatures(allData, features);

  const normalizedTest = normalized[normalized.length - 1];
  const normalizedTraining = normalized.slice(0, -1);

  // Calculate distances
  const distances = normalizedTraining.map((point, idx) => ({
    distance: euclideanDistance(normalizedTest, point, features),
    rating: trainingData[idx].rating,
    data: trainingData[idx]
  }));

  // Sort by distance and take k nearest
  distances.sort((a, b) => a.distance - b.distance);
  const neighbors = distances.slice(0, Math.min(k, distances.length));

  // Weighted average based on inverse distance
  let totalWeight = 0;
  let weightedSum = 0;

  neighbors.forEach(neighbor => {
    // Add small epsilon to avoid division by zero
    const weight = 1 / (neighbor.distance + 0.001);
    weightedSum += neighbor.rating * weight;
    totalWeight += weight;
  });

  const prediction = totalWeight > 0 ? weightedSum / totalWeight : 0;

  // Confidence based on neighbor agreement
  const neighborRatings = neighbors.map(n => n.rating);
  const stdDev = stats.standardDeviation(neighborRatings);
  const confidence = Math.max(0, Math.min(100, 100 - (stdDev / stats.mean(neighborRatings) * 100)));

  return {
    prediction: Math.round(prediction * 100) / 100,
    confidence: Math.round(confidence),
    neighbors: neighbors.slice(0, 3).map(n => ({
      rating: n.rating,
      distance: n.distance.toFixed(3)
    })),
    ranges
  };
}

// ============================================
// K-MEANS CLUSTERING
// ============================================

/**
 * Initialize centroids using k-means++
 */
function initializeCentroids(data, k, features) {
  if (data.length === 0) return [];

  const centroids = [];

  // Choose first centroid randomly
  centroids.push({ ...data[Math.floor(Math.random() * data.length)] });

  // Choose remaining centroids with probability proportional to distance
  while (centroids.length < k) {
    const distances = data.map(point => {
      const minDist = Math.min(...centroids.map(centroid =>
        euclideanDistance(point, centroid, features)
      ));
      return minDist * minDist;
    });

    const totalDist = distances.reduce((sum, d) => sum + d, 0);
    const rand = Math.random() * totalDist;

    let cumulative = 0;
    for (let i = 0; i < data.length; i++) {
      cumulative += distances[i];
      if (cumulative >= rand) {
        centroids.push({ ...data[i] });
        break;
      }
    }
  }

  return centroids;
}

/**
 * K-Means clustering for flavor profiles or parameter grouping
 * @param {Array} data - Data points to cluster
 * @param {Array} features - Features to use for clustering
 * @param {number} k - Number of clusters
 * @param {number} maxIterations - Max iterations
 * @returns {Object} Cluster assignments and centroids
 */
function kMeansClustering(data, features, k = 3, maxIterations = 100) {
  if (!data || data.length === 0 || k <= 0) {
    return { clusters: [], centroids: [], assignments: [] };
  }

  // Normalize data
  const { normalized } = normalizeFeatures(data, features);

  // Initialize centroids
  let centroids = initializeCentroids(normalized, Math.min(k, normalized.length), features);
  let assignments = new Array(normalized.length).fill(0);
  let iterations = 0;
  let changed = true;

  while (changed && iterations < maxIterations) {
    changed = false;

    // Assign points to nearest centroid
    normalized.forEach((point, idx) => {
      const distances = centroids.map(centroid =>
        euclideanDistance(point, centroid, features)
      );
      const nearest = distances.indexOf(Math.min(...distances));

      if (assignments[idx] !== nearest) {
        changed = true;
        assignments[idx] = nearest;
      }
    });

    // Update centroids
    const newCentroids = [];
    for (let i = 0; i < centroids.length; i++) {
      const clusterPoints = normalized.filter((_, idx) => assignments[idx] === i);

      if (clusterPoints.length > 0) {
        const newCentroid = {};
        features.forEach(feature => {
          const values = clusterPoints.map(p => p[feature]).filter(v => v != null);
          newCentroid[feature] = values.length > 0 ? stats.mean(values) : 0;
        });
        newCentroids.push(newCentroid);
      } else {
        newCentroids.push(centroids[i]);
      }
    }

    centroids = newCentroids;
    iterations++;
  }

  // Group data by cluster
  const clusters = [];
  for (let i = 0; i < k; i++) {
    const clusterData = data.filter((_, idx) => assignments[idx] === i);
    clusters.push({
      id: i,
      size: clusterData.length,
      data: clusterData,
      centroid: centroids[i]
    });
  }

  return { clusters, centroids, assignments, iterations };
}

// ============================================
// DECISION TREE APPROXIMATION
// ============================================

/**
 * Calculate information gain for a feature split
 */
function calculateEntropy(data, targetField = 'rating') {
  if (!data || data.length === 0) return 0;

  const values = data.map(d => d[targetField]).filter(v => v != null);
  if (values.length === 0) return 0;

  // Discretize continuous ratings into bins
  const bins = {
    low: values.filter(v => v < 3.5).length,
    medium: values.filter(v => v >= 3.5 && v < 4.5).length,
    high: values.filter(v => v >= 4.5).length
  };

  const total = values.length;
  let entropy = 0;

  Object.values(bins).forEach(count => {
    if (count > 0) {
      const p = count / total;
      entropy -= p * Math.log2(p);
    }
  });

  return entropy;
}

/**
 * Build simple decision rules from data
 * @param {Array} data - Training data
 * @param {Array} features - Features to consider
 * @returns {Array} Decision rules
 */
function buildDecisionRules(data, features) {
  if (!data || data.length === 0) return [];

  const rules = [];

  features.forEach(feature => {
    const values = data.map(d => d[feature]).filter(v => v != null && !isNaN(v));
    if (values.length < 3) return;

    // Find threshold that best separates high vs low ratings
    const sorted = [...values].sort((a, b) => a - b);
    const q1 = stats.quartiles(values).q1;
    const q3 = stats.quartiles(values).q3;
    const median = stats.median(values);

    // Test different thresholds
    [q1, median, q3].forEach(threshold => {
      const above = data.filter(d => d[feature] != null && d[feature] >= threshold);
      const below = data.filter(d => d[feature] != null && d[feature] < threshold);

      if (above.length > 0 && below.length > 0) {
        const avgAbove = stats.mean(above.map(d => d.rating).filter(r => r != null));
        const avgBelow = stats.mean(below.map(d => d.rating).filter(r => r != null));
        const diff = Math.abs(avgAbove - avgBelow);

        if (diff > 0.3) { // Significant difference
          rules.push({
            feature,
            threshold,
            direction: avgAbove > avgBelow ? 'above' : 'below',
            impact: diff,
            avgAbove,
            avgBelow,
            confidence: Math.min(above.length, below.length) / data.length
          });
        }
      }
    });
  });

  // Sort by impact
  rules.sort((a, b) => b.impact - a.impact);

  return rules.slice(0, 10); // Top 10 rules
}

// ============================================
// ANOMALY DETECTION
// ============================================

/**
 * Detect anomalies using statistical methods (Z-score)
 * @param {Array} data - Data points
 * @param {string} field - Field to analyze
 * @param {number} threshold - Z-score threshold (default: 3)
 * @returns {Array} Anomalous data points
 */
function detectAnomalies(data, field, threshold = 3) {
  if (!data || data.length === 0) return [];

  const values = data.map(d => d[field]).filter(v => v != null && !isNaN(v));
  if (values.length < 5) return [];

  const mean = stats.mean(values);
  const stdDev = stats.standardDeviation(values);

  if (stdDev === 0) return [];

  const anomalies = [];

  data.forEach((point, idx) => {
    const value = point[field];
    if (value != null && !isNaN(value)) {
      const zScore = Math.abs((value - mean) / stdDev);
      if (zScore > threshold) {
        anomalies.push({
          index: idx,
          data: point,
          value,
          zScore: zScore.toFixed(2),
          deviation: value - mean
        });
      }
    }
  });

  return anomalies;
}

/**
 * Detect anomalies using multivariate approach
 */
function detectMultivariateAnomalies(data, features, threshold = 2.5) {
  if (!data || data.length === 0) return [];

  const { normalized } = normalizeFeatures(data, features);

  // Calculate centroid (mean point)
  const centroid = {};
  features.forEach(feature => {
    const values = normalized.map(d => d[feature]).filter(v => v != null);
    centroid[feature] = stats.mean(values);
  });

  // Calculate distances from centroid
  const distances = normalized.map((point, idx) => ({
    index: idx,
    data: data[idx],
    distance: euclideanDistance(point, centroid, features)
  }));

  const distanceValues = distances.map(d => d.distance);
  const meanDist = stats.mean(distanceValues);
  const stdDev = stats.standardDeviation(distanceValues);

  // Flag points beyond threshold
  const anomalies = distances.filter(d => {
    const zScore = Math.abs((d.distance - meanDist) / stdDev);
    return zScore > threshold;
  });

  return anomalies.map(a => ({
    ...a,
    distance: a.distance.toFixed(3)
  }));
}

// ============================================
// TIME SERIES FORECASTING
// ============================================

/**
 * Simple exponential smoothing for forecasting
 * @param {Array} timeSeries - Historical values
 * @param {number} alpha - Smoothing parameter (0-1)
 * @param {number} periods - Number of periods to forecast
 * @returns {Object} Forecasted values
 */
function exponentialSmoothing(timeSeries, alpha = 0.3, periods = 7) {
  if (!timeSeries || timeSeries.length === 0) {
    return { forecast: [], smoothed: [] };
  }

  const smoothed = [timeSeries[0]];

  // Calculate smoothed values
  for (let i = 1; i < timeSeries.length; i++) {
    const value = alpha * timeSeries[i] + (1 - alpha) * smoothed[i - 1];
    smoothed.push(value);
  }

  // Forecast future values
  const forecast = [];
  let lastSmoothed = smoothed[smoothed.length - 1];

  for (let i = 0; i < periods; i++) {
    forecast.push(lastSmoothed);
  }

  return { forecast, smoothed };
}

/**
 * Calculate trend and seasonal components (simplified)
 */
function decomposeTimeSeries(timeSeries, seasonalPeriod = 7) {
  if (!timeSeries || timeSeries.length < seasonalPeriod * 2) {
    return { trend: [], seasonal: [], residual: [] };
  }

  // Calculate trend using moving average
  const trend = stats.movingAverage(timeSeries, seasonalPeriod);

  // Detrend
  const detrended = timeSeries.map((val, idx) =>
    trend[idx] != null ? val - trend[idx] : null
  );

  // Calculate seasonal component
  const seasonal = new Array(timeSeries.length).fill(0);
  for (let i = 0; i < seasonalPeriod; i++) {
    const values = [];
    for (let j = i; j < detrended.length; j += seasonalPeriod) {
      if (detrended[j] != null) values.push(detrended[j]);
    }
    const seasonalAvg = stats.mean(values);
    for (let j = i; j < seasonal.length; j += seasonalPeriod) {
      seasonal[j] = seasonalAvg;
    }
  }

  // Calculate residual
  const residual = timeSeries.map((val, idx) =>
    (trend[idx] != null && seasonal[idx] != null)
      ? val - trend[idx] - seasonal[idx]
      : null
  );

  return { trend, seasonal, residual };
}

// ============================================
// PATTERN RECOGNITION
// ============================================

/**
 * Find similar brewing sessions based on parameters
 * @param {Object} targetSession - Session to match
 * @param {Array} allSessions - All historical sessions
 * @param {Array} features - Features to compare
 * @param {number} topN - Number of similar sessions to return
 * @returns {Array} Similar sessions
 */
function findSimilarSessions(targetSession, allSessions, features, topN = 5) {
  if (!allSessions || allSessions.length === 0) return [];

  const allData = [...allSessions, targetSession];
  const { normalized } = normalizeFeatures(allData, features);

  const targetNorm = normalized[normalized.length - 1];
  const sessionsNorm = normalized.slice(0, -1);

  const similarities = sessionsNorm.map((session, idx) => ({
    session: allSessions[idx],
    distance: euclideanDistance(targetNorm, session, features),
    similarity: 1 / (1 + euclideanDistance(targetNorm, session, features))
  }));

  similarities.sort((a, b) => b.similarity - a.similarity);

  return similarities.slice(0, topN);
}

/**
 * Identify optimal parameter combinations
 */
function findOptimalCombinations(data, features, targetRating = 4.5) {
  if (!data || data.length === 0) return [];

  // Filter high-quality sessions
  const highQuality = data.filter(d => d.rating >= targetRating);

  if (highQuality.length < 3) return [];

  // Cluster high-quality sessions
  const { clusters } = kMeansClustering(highQuality, features, Math.min(3, highQuality.length));

  // Describe each cluster
  const combinations = clusters.map((cluster, idx) => {
    const profile = {};

    features.forEach(feature => {
      const values = cluster.data.map(d => d[feature]).filter(v => v != null && !isNaN(v));
      if (values.length > 0) {
        profile[feature] = {
          mean: stats.mean(values).toFixed(2),
          range: [Math.min(...values).toFixed(2), Math.max(...values).toFixed(2)]
        };
      }
    });

    const avgRating = stats.mean(cluster.data.map(d => d.rating));

    return {
      id: idx + 1,
      size: cluster.size,
      avgRating: avgRating.toFixed(2),
      profile
    };
  });

  combinations.sort((a, b) => b.avgRating - a.avgRating);

  return combinations;
}

// ============================================
// EXPORT MODULE
// ============================================

module.exports = {
  // KNN
  knnPredict,
  normalizeFeatures,
  euclideanDistance,

  // Clustering
  kMeansClustering,

  // Decision trees
  buildDecisionRules,
  calculateEntropy,

  // Anomaly detection
  detectAnomalies,
  detectMultivariateAnomalies,

  // Time series
  exponentialSmoothing,
  decomposeTimeSeries,

  // Pattern recognition
  findSimilarSessions,
  findOptimalCombinations
};
