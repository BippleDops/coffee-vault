/**
 * Real-Time Quality Monitor - Coffee Vault 5.0
 * Version: 1.0.0
 * 
 * Advanced quality anomaly detection during brewing:
 * - Statistical process control (SPC)
 * - Real-time parameter monitoring
 * - Deviation alerts
 * - Corrective action suggestions
 * 
 * Usage:
 *   const monitor = require('./real-time-quality-monitor.js');
 *   const alert = monitor.checkParameters(currentParams, optimalParams);
 */

/**
 * Parameter control limits
 * Based on statistical process control theory
 */
const CONTROL_LIMITS = {
  ratio: {
    target: 16.5,
    lowerControlLimit: 15.0,
    upperControlLimit: 18.0,
    lowerWarningLimit: 15.5,
    upperWarningLimit: 17.5
  },
  temperature: {
    target: 93,
    lowerControlLimit: 88,
    upperControlLimit: 98,
    lowerWarningLimit: 90,
    upperWarningLimit: 96
  },
  grindSize: {
    target: 'medium-fine',
    acceptable: ['fine', 'medium-fine', 'medium']
  },
  brewTime: {
    target: 165, // seconds (2:45)
    lowerControlLimit: 120,
    upperControlLimit: 240,
    lowerWarningLimit: 150,
    upperWarningLimit: 210
  },
  extractionYield: {
    target: 20,
    lowerControlLimit: 17,
    upperControlLimit: 23,
    lowerWarningLimit: 18,
    upperWarningLimit: 22
  }
};

/**
 * Check parameters against control limits
 * @param {Object} currentParams - Current brewing parameters
 * @param {Object} optimalParams - Optimal parameters for this bean
 * @returns {Object} Alert information
 */
function checkParameters(currentParams, optimalParams = {}) {
  const alerts = [];
  
  // Check ratio
  const ratio = currentParams.water / currentParams.dose;
  const ratioAlert = checkControlLimit(
    ratio,
    optimalParams.ratio || CONTROL_LIMITS.ratio,
    'Brew Ratio',
    currentParams
  );
  if (ratioAlert) alerts.push(ratioAlert);
  
  // Check temperature
  const tempAlert = checkControlLimit(
    currentParams.waterTemperature,
    optimalParams.temperature || CONTROL_LIMITS.temperature,
    'Water Temperature',
    currentParams
  );
  if (tempAlert) alerts.push(tempAlert);
  
  // Check brew time (if completed)
  if (currentParams.brewTime) {
    const brewSeconds = parseBrewTime(currentParams.brewTime);
    const timeAlert = checkControlLimit(
      brewSeconds,
      optimalParams.brewTime || CONTROL_LIMITS.brewTime,
      'Brew Time',
      currentParams
    );
    if (timeAlert) alerts.push(timeAlert);
  }
  
  // Check extraction yield (if measured)
  if (currentParams.extractionYield) {
    const eyAlert = checkControlLimit(
      currentParams.extractionYield,
      CONTROL_LIMITS.extractionYield,
      'Extraction Yield',
      currentParams
    );
    if (eyAlert) alerts.push(eyAlert);
  }
  
  // Overall status
  const status = alerts.length === 0 ? 'optimal' :
                 alerts.some(a => a.severity === 'critical') ? 'critical' :
                 alerts.some(a => a.severity === 'warning') ? 'warning' : 'caution';
  
  return {
    status: status,
    alerts: alerts,
    overallScore: calculateOverallScore(alerts),
    recommendations: generateRecommendations(alerts, currentParams)
  };
}

/**
 * Check single parameter against control limits
 */
function checkControlLimit(value, limits, paramName, currentParams) {
  const {
    target,
    lowerControlLimit,
    upperControlLimit,
    lowerWarningLimit,
    upperWarningLimit
  } = limits;
  
  // Critical deviations (outside control limits)
  if (value < lowerControlLimit) {
    return {
      severity: 'critical',
      parameter: paramName,
      value: value,
      target: target,
      message: `${paramName} critically low: ${value} (limit: ${lowerControlLimit})`,
      action: `Increase ${paramName.toLowerCase()} immediately`,
      impact: 'Under-extraction risk'
    };
  }
  
  if (value > upperControlLimit) {
    return {
      severity: 'critical',
      parameter: paramName,
      value: value,
      target: target,
      message: `${paramName} critically high: ${value} (limit: ${upperControlLimit})`,
      action: `Decrease ${paramName.toLowerCase()} immediately`,
      impact: 'Over-extraction risk'
    };
  }
  
  // Warning deviations (outside warning limits)
  if (value < lowerWarningLimit) {
    return {
      severity: 'warning',
      parameter: paramName,
      value: value,
      target: target,
      message: `${paramName} below optimal: ${value} (target: ${target})`,
      action: `Consider increasing ${paramName.toLowerCase()}`,
      impact: 'May result in weak extraction'
    };
  }
  
  if (value > upperWarningLimit) {
    return {
      severity: 'warning',
      parameter: paramName,
      value: value,
      target: target,
      message: `${paramName} above optimal: ${value} (target: ${target})`,
      action: `Consider decreasing ${paramName.toLowerCase()}`,
      impact: 'May result in bitter/harsh notes'
    };
  }
  
  // Within acceptable range
  return null;
}

/**
 * Calculate overall quality score (0-100)
 */
function calculateOverallScore(alerts) {
  let score = 100;
  
  alerts.forEach(alert => {
    if (alert.severity === 'critical') score -= 20;
    else if (alert.severity === 'warning') score -= 10;
    else if (alert.severity === 'caution') score -= 5;
  });
  
  return Math.max(0, score);
}

/**
 * Generate corrective action recommendations
 */
function generateRecommendations(alerts, currentParams) {
  const recommendations = [];
  
  alerts.forEach(alert => {
    recommendations.push({
      parameter: alert.parameter,
      currentValue: alert.value,
      targetValue: alert.target,
      action: alert.action,
      timing: alert.severity === 'critical' ? 'immediate' : 'next-brew',
      reasoning: alert.impact
    });
  });
  
  // Add positive reinforcement if no alerts
  if (alerts.length === 0) {
    recommendations.push({
      message: 'All parameters optimal! Continue with current technique.',
      action: 'none',
      timing: 'none'
    });
  }
  
  return recommendations;
}

/**
 * Monitor extraction in real-time
 * For use during brewing with live measurements
 */
function monitorExtraction(params, targetMetrics = {}) {
  const {
    currentTime, // seconds elapsed
    currentOutput, // grams extracted so far
    dose,
    targetTime,
    targetOutput
  } = params;
  
  const alerts = [];
  
  // Check extraction rate
  const extractionRate = currentOutput / currentTime; // g/s
  const targetRate = targetOutput / targetTime;
  
  if (extractionRate < targetRate * 0.8) {
    alerts.push({
      severity: 'warning',
      message: 'Extraction slower than expected',
      action: 'Check for channeling or clogging',
      timing: 'now'
    });
  }
  
  if (extractionRate > targetRate * 1.2) {
    alerts.push({
      severity: 'warning',
      message: 'Extraction faster than expected',
      action: 'Grind finer next time, may result in under-extraction',
      timing: 'next-brew'
    });
  }
  
  return {
    extractionRate: extractionRate.toFixed(2),
    progress: ((currentTime / targetTime) * 100).toFixed(1),
    onTrack: alerts.length === 0,
    alerts: alerts
  };
}

/**
 * Detect trending degradation in brew quality
 */
function detectQualityTrend(recentLogs) {
  if (recentLogs.length < 5) {
    return { trend: 'insufficient-data', alert: false };
  }
  
  // Take last 10 brews
  const recent = recentLogs.slice(-10);
  const ratings = recent.map(l => l.rating);
  
  // Calculate moving average
  const firstHalf = ratings.slice(0, 5);
  const secondHalf = ratings.slice(5);
  
  const firstAvg = firstHalf.reduce((sum, r) => sum + r, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, r) => sum + r, 0) / secondHalf.length;
  
  const trend = secondAvg - firstAvg;
  
  if (trend < -0.5) {
    return {
      trend: 'declining',
      alert: true,
      message: 'Quality declining in recent brews',
      action: 'Review recent parameter changes, check equipment maintenance'
    };
  }
  
  if (trend > 0.5) {
    return {
      trend: 'improving',
      alert: false,
      message: 'Quality improving - keep up current approach!'
    };
  }
  
  return {
    trend: 'stable',
    alert: false
  };
}

/**
 * Helper: Parse brew time string to seconds
 */
function parseBrewTime(timeString) {
  const parts = timeString.split(':');
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }
  return 0;
}

/**
 * Export all functions
 */
module.exports = {
  checkParameters,
  monitorExtraction,
  detectQualityTrend,
  optimizeParameters,
  CONTROL_LIMITS
};

