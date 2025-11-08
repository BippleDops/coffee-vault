/**
 * Statistical Analysis Toolkit for Coffee Vault
 * Version: 1.0.0
 * Last Updated: 2025-10-25
 *
 * Comprehensive statistical utilities for analyzing coffee brewing data.
 * Provides correlation analysis, distribution metrics, trend detection,
 * and predictive modeling capabilities.
 *
 * Dependencies: None (pure JavaScript)
 * Usage: Import functions as needed in Dataview/Datacore queries
 */

// ============================================
// DESCRIPTIVE STATISTICS
// ============================================

/**
 * Calculate mean (average) of an array of numbers
 * @param {number[]} values - Array of numeric values
 * @returns {number} Mean value
 */
function mean(values) {
  if (!values || values.length === 0) return 0;
  const filtered = values.filter(v => v != null && !isNaN(v));
  if (filtered.length === 0) return 0;
  return filtered.reduce((sum, val) => sum + val, 0) / filtered.length;
}

/**
 * Calculate median of an array of numbers
 * @param {number[]} values - Array of numeric values
 * @returns {number} Median value
 */
function median(values) {
  if (!values || values.length === 0) return 0;
  const filtered = values.filter(v => v != null && !isNaN(v)).sort((a, b) => a - b);
  if (filtered.length === 0) return 0;

  const mid = Math.floor(filtered.length / 2);
  return filtered.length % 2 === 0
    ? (filtered[mid - 1] + filtered[mid]) / 2
    : filtered[mid];
}

/**
 * Calculate mode (most frequent value) of an array
 * @param {any[]} values - Array of values
 * @returns {any} Most frequent value
 */
function mode(values) {
  if (!values || values.length === 0) return null;

  const frequency = {};
  let maxFreq = 0;
  let modeValue = null;

  values.forEach(val => {
    if (val == null) return;
    frequency[val] = (frequency[val] || 0) + 1;
    if (frequency[val] > maxFreq) {
      maxFreq = frequency[val];
      modeValue = val;
    }
  });

  return modeValue;
}

/**
 * Calculate standard deviation
 * @param {number[]} values - Array of numeric values
 * @returns {number} Standard deviation
 */
function standardDeviation(values) {
  if (!values || values.length === 0) return 0;
  const filtered = values.filter(v => v != null && !isNaN(v));
  if (filtered.length === 0) return 0;

  const avg = mean(filtered);
  const squareDiffs = filtered.map(value => Math.pow(value - avg, 2));
  const avgSquareDiff = mean(squareDiffs);
  return Math.sqrt(avgSquareDiff);
}

/**
 * Calculate variance
 * @param {number[]} values - Array of numeric values
 * @returns {number} Variance
 */
function variance(values) {
  const sd = standardDeviation(values);
  return sd * sd;
}

/**
 * Calculate coefficient of variation (CV)
 * Measures relative variability
 * @param {number[]} values - Array of numeric values
 * @returns {number} CV as percentage
 */
function coefficientOfVariation(values) {
  const avg = mean(values);
  if (avg === 0) return 0;
  const sd = standardDeviation(values);
  return (sd / avg) * 100;
}

/**
 * Calculate quartiles and interquartile range
 * @param {number[]} values - Array of numeric values
 * @returns {Object} Q1, Q2 (median), Q3, IQR
 */
function quartiles(values) {
  if (!values || values.length === 0) {
    return { q1: 0, q2: 0, q3: 0, iqr: 0 };
  }

  const sorted = values.filter(v => v != null && !isNaN(v)).sort((a, b) => a - b);
  if (sorted.length === 0) {
    return { q1: 0, q2: 0, q3: 0, iqr: 0 };
  }

  const q2 = median(sorted);
  const mid = Math.floor(sorted.length / 2);

  const lowerHalf = sorted.slice(0, mid);
  const upperHalf = sorted.length % 2 === 0
    ? sorted.slice(mid)
    : sorted.slice(mid + 1);

  const q1 = median(lowerHalf);
  const q3 = median(upperHalf);
  const iqr = q3 - q1;

  return { q1, q2, q3, iqr };
}

/**
 * Identify outliers using IQR method
 * @param {number[]} values - Array of numeric values
 * @returns {Object} Array of outliers and their indices
 */
function findOutliers(values) {
  if (!values || values.length === 0) {
    return { outliers: [], indices: [] };
  }

  const { q1, q3, iqr } = quartiles(values);
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  const outliers = [];
  const indices = [];

  values.forEach((val, idx) => {
    if (val != null && !isNaN(val) && (val < lowerBound || val > upperBound)) {
      outliers.push(val);
      indices.push(idx);
    }
  });

  return { outliers, indices, lowerBound, upperBound };
}

// ============================================
// CORRELATION ANALYSIS
// ============================================

/**
 * Calculate Pearson correlation coefficient
 * Measures linear relationship between two variables
 * @param {number[]} x - First variable array
 * @param {number[]} y - Second variable array
 * @returns {number} Correlation coefficient (-1 to 1)
 */
function pearsonCorrelation(x, y) {
  if (!x || !y || x.length !== y.length || x.length === 0) return 0;

  // Filter out null/undefined pairs
  const pairs = x.map((xVal, i) => ({ x: xVal, y: y[i] }))
    .filter(pair => pair.x != null && pair.y != null && !isNaN(pair.x) && !isNaN(pair.y));

  if (pairs.length === 0) return 0;

  const xVals = pairs.map(p => p.x);
  const yVals = pairs.map(p => p.y);

  const xMean = mean(xVals);
  const yMean = mean(yVals);

  let numerator = 0;
  let xDenominator = 0;
  let yDenominator = 0;

  for (let i = 0; i < pairs.length; i++) {
    const xDiff = xVals[i] - xMean;
    const yDiff = yVals[i] - yMean;
    numerator += xDiff * yDiff;
    xDenominator += xDiff * xDiff;
    yDenominator += yDiff * yDiff;
  }

  const denominator = Math.sqrt(xDenominator * yDenominator);
  return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * Interpret correlation strength
 * @param {number} r - Correlation coefficient
 * @returns {string} Interpretation
 */
function interpretCorrelation(r) {
  const absR = Math.abs(r);
  let strength;

  if (absR >= 0.9) strength = "very strong";
  else if (absR >= 0.7) strength = "strong";
  else if (absR >= 0.5) strength = "moderate";
  else if (absR >= 0.3) strength = "weak";
  else strength = "very weak";

  const direction = r >= 0 ? "positive" : "negative";
  return `${strength} ${direction}`;
}

/**
 * Calculate correlation matrix for multiple variables
 * @param {Object} data - Object with variable names as keys, arrays as values
 * @returns {Object} Correlation matrix
 */
function correlationMatrix(data) {
  const variables = Object.keys(data);
  const matrix = {};

  variables.forEach(var1 => {
    matrix[var1] = {};
    variables.forEach(var2 => {
      matrix[var1][var2] = var1 === var2
        ? 1
        : pearsonCorrelation(data[var1], data[var2]);
    });
  });

  return matrix;
}

// ============================================
// DISTRIBUTION ANALYSIS
// ============================================

/**
 * Calculate histogram bins
 * @param {number[]} values - Array of numeric values
 * @param {number} numBins - Number of bins (default: 10)
 * @returns {Array} Array of bin objects with range and count
 */
function histogram(values, numBins = 10) {
  if (!values || values.length === 0) return [];

  const filtered = values.filter(v => v != null && !isNaN(v));
  if (filtered.length === 0) return [];

  const min = Math.min(...filtered);
  const max = Math.max(...filtered);
  const binWidth = (max - min) / numBins;

  const bins = [];
  for (let i = 0; i < numBins; i++) {
    const binMin = min + i * binWidth;
    const binMax = min + (i + 1) * binWidth;
    const count = filtered.filter(v =>
      v >= binMin && (i === numBins - 1 ? v <= binMax : v < binMax)
    ).length;

    bins.push({
      min: binMin,
      max: binMax,
      midpoint: (binMin + binMax) / 2,
      count: count,
      frequency: count / filtered.length
    });
  }

  return bins;
}

/**
 * Calculate skewness (measure of distribution asymmetry)
 * @param {number[]} values - Array of numeric values
 * @returns {number} Skewness value
 */
function skewness(values) {
  if (!values || values.length === 0) return 0;

  const filtered = values.filter(v => v != null && !isNaN(v));
  if (filtered.length === 0) return 0;

  const avg = mean(filtered);
  const sd = standardDeviation(filtered);

  if (sd === 0) return 0;

  const n = filtered.length;
  const cubedDiffs = filtered.map(v => Math.pow((v - avg) / sd, 3));
  return (n / ((n - 1) * (n - 2))) * cubedDiffs.reduce((sum, val) => sum + val, 0);
}

/**
 * Calculate kurtosis (measure of distribution tailedness)
 * @param {number[]} values - Array of numeric values
 * @returns {number} Kurtosis value
 */
function kurtosis(values) {
  if (!values || values.length === 0) return 0;

  const filtered = values.filter(v => v != null && !isNaN(v));
  if (filtered.length === 0) return 0;

  const avg = mean(filtered);
  const sd = standardDeviation(filtered);

  if (sd === 0) return 0;

  const n = filtered.length;
  const fourthPowers = filtered.map(v => Math.pow((v - avg) / sd, 4));
  const sumFourthPowers = fourthPowers.reduce((sum, val) => sum + val, 0);

  return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sumFourthPowers -
         (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
}

// ============================================
// TREND ANALYSIS
// ============================================

/**
 * Calculate simple linear regression
 * @param {number[]} x - Independent variable
 * @param {number[]} y - Dependent variable
 * @returns {Object} Slope, intercept, r-squared
 */
function linearRegression(x, y) {
  if (!x || !y || x.length !== y.length || x.length === 0) {
    return { slope: 0, intercept: 0, rSquared: 0 };
  }

  const pairs = x.map((xVal, i) => ({ x: xVal, y: y[i] }))
    .filter(pair => pair.x != null && pair.y != null && !isNaN(pair.x) && !isNaN(pair.y));

  if (pairs.length === 0) {
    return { slope: 0, intercept: 0, rSquared: 0 };
  }

  const xVals = pairs.map(p => p.x);
  const yVals = pairs.map(p => p.y);
  const n = pairs.length;

  const xMean = mean(xVals);
  const yMean = mean(yVals);

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    const xDiff = xVals[i] - xMean;
    numerator += xDiff * (yVals[i] - yMean);
    denominator += xDiff * xDiff;
  }

  const slope = denominator === 0 ? 0 : numerator / denominator;
  const intercept = yMean - slope * xMean;

  // Calculate R-squared
  const r = pearsonCorrelation(xVals, yVals);
  const rSquared = r * r;

  return { slope, intercept, rSquared };
}

/**
 * Predict value using linear regression
 * @param {Object} regression - Result from linearRegression()
 * @param {number} x - Input value
 * @returns {number} Predicted y value
 */
function predict(regression, x) {
  return regression.slope * x + regression.intercept;
}

/**
 * Calculate moving average
 * @param {number[]} values - Array of numeric values
 * @param {number} window - Window size
 * @returns {number[]} Moving averages
 */
function movingAverage(values, window = 5) {
  if (!values || values.length === 0 || window <= 0) return [];

  const result = [];
  for (let i = 0; i < values.length; i++) {
    if (i < window - 1) {
      result.push(null);
    } else {
      const slice = values.slice(i - window + 1, i + 1);
      result.push(mean(slice));
    }
  }

  return result;
}

/**
 * Detect trend direction
 * @param {number[]} values - Array of numeric values
 * @returns {Object} Trend direction and strength
 */
function detectTrend(values) {
  if (!values || values.length < 2) {
    return { direction: "insufficient data", strength: 0 };
  }

  const indices = values.map((_, i) => i);
  const { slope, rSquared } = linearRegression(indices, values);

  let direction;
  if (Math.abs(slope) < 0.01) direction = "stable";
  else if (slope > 0) direction = "increasing";
  else direction = "decreasing";

  return {
    direction,
    strength: rSquared,
    slope,
    interpretation: interpretTrend(slope, rSquared)
  };
}

/**
 * Interpret trend
 * @param {number} slope - Regression slope
 * @param {number} rSquared - R-squared value
 * @returns {string} Human-readable interpretation
 */
function interpretTrend(slope, rSquared) {
  if (rSquared < 0.3) return "No clear trend";

  const direction = slope > 0 ? "improving" : "declining";
  const strength = rSquared >= 0.7 ? "strong" : "moderate";

  return `${strength} ${direction} trend`;
}

// ============================================
// CONSISTENCY METRICS
// ============================================

/**
 * Calculate consistency score (inverse of CV)
 * @param {number[]} values - Array of numeric values
 * @returns {number} Consistency score (0-100)
 */
function consistencyScore(values) {
  const cv = coefficientOfVariation(values);
  return Math.max(0, 100 - cv);
}

/**
 * Calculate rolling consistency
 * @param {number[]} values - Array of numeric values
 * @param {number} window - Window size
 * @returns {number[]} Consistency scores over time
 */
function rollingConsistency(values, window = 5) {
  if (!values || values.length === 0 || window <= 0) return [];

  const result = [];
  for (let i = 0; i < values.length; i++) {
    if (i < window - 1) {
      result.push(null);
    } else {
      const slice = values.slice(i - window + 1, i + 1);
      result.push(consistencyScore(slice));
    }
  }

  return result;
}

// ============================================
// COMPARATIVE ANALYSIS
// ============================================

/**
 * Compare two groups using t-test approximation
 * @param {number[]} group1 - First group
 * @param {number[]} group2 - Second group
 * @returns {Object} Comparison statistics
 */
function compareGroups(group1, group2) {
  if (!group1 || !group2 || group1.length === 0 || group2.length === 0) {
    return { significant: false, difference: 0 };
  }

  const mean1 = mean(group1);
  const mean2 = mean(group2);
  const difference = mean1 - mean2;

  const sd1 = standardDeviation(group1);
  const sd2 = standardDeviation(group2);

  // Simple comparison (not full t-test)
  const pooledSD = Math.sqrt((sd1 * sd1 + sd2 * sd2) / 2);
  const effectSize = pooledSD === 0 ? 0 : Math.abs(difference) / pooledSD;

  return {
    mean1,
    mean2,
    difference,
    percentDifference: mean2 === 0 ? 0 : (difference / mean2) * 100,
    effectSize,
    significant: effectSize > 0.5, // Cohen's d threshold
    interpretation: interpretEffectSize(effectSize)
  };
}

/**
 * Interpret effect size (Cohen's d)
 * @param {number} d - Effect size
 * @returns {string} Interpretation
 */
function interpretEffectSize(d) {
  const absD = Math.abs(d);
  if (absD < 0.2) return "negligible difference";
  if (absD < 0.5) return "small difference";
  if (absD < 0.8) return "medium difference";
  return "large difference";
}

// ============================================
// PERCENTILES & RANKINGS
// ============================================

/**
 * Calculate percentile
 * @param {number[]} values - Array of numeric values
 * @param {number} percentile - Percentile to calculate (0-100)
 * @returns {number} Value at percentile
 */
function percentile(values, percentile) {
  if (!values || values.length === 0) return 0;

  const sorted = values.filter(v => v != null && !isNaN(v)).sort((a, b) => a - b);
  if (sorted.length === 0) return 0;

  const index = (percentile / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;

  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

/**
 * Calculate percentile rank of a value
 * @param {number[]} values - Array of numeric values
 * @param {number} value - Value to rank
 * @returns {number} Percentile rank (0-100)
 */
function percentileRank(values, value) {
  if (!values || values.length === 0) return 0;

  const sorted = values.filter(v => v != null && !isNaN(v)).sort((a, b) => a - b);
  const countBelow = sorted.filter(v => v < value).length;

  return (countBelow / sorted.length) * 100;
}

// ============================================
// FREQUENCY ANALYSIS
// ============================================

/**
 * Calculate frequency distribution
 * @param {any[]} values - Array of values
 * @returns {Object} Frequency counts
 */
function frequencyDistribution(values) {
  if (!values || values.length === 0) return {};

  const frequency = {};
  values.forEach(val => {
    if (val != null) {
      frequency[val] = (frequency[val] || 0) + 1;
    }
  });

  return frequency;
}

/**
 * Get top N most frequent values
 * @param {any[]} values - Array of values
 * @param {number} n - Number of top items to return
 * @returns {Array} Top N items with counts
 */
function topN(values, n = 5) {
  const freq = frequencyDistribution(values);
  const sorted = Object.entries(freq)
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);

  return sorted.slice(0, n);
}

// ============================================
// EXPORT MODULE
// ============================================

module.exports = {
  // Descriptive statistics
  mean,
  median,
  mode,
  standardDeviation,
  variance,
  coefficientOfVariation,
  quartiles,
  findOutliers,

  // Correlation
  pearsonCorrelation,
  interpretCorrelation,
  correlationMatrix,

  // Distribution
  histogram,
  skewness,
  kurtosis,

  // Trend analysis
  linearRegression,
  predict,
  movingAverage,
  detectTrend,
  interpretTrend,

  // Consistency
  consistencyScore,
  rollingConsistency,

  // Comparison
  compareGroups,
  interpretEffectSize,

  // Percentiles
  percentile,
  percentileRank,

  // Frequency
  frequencyDistribution,
  topN
};
