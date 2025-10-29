/**
 * Goal Manager - Coffee Vault 5.0
 * Version: 1.0.0
 * 
 * Goal tracking, progress monitoring, and achievement system:
 * - Track goal progress automatically
 * - Suggest goal completion steps
 * - Celebrate achievements
 * - Generate progress reports
 * 
 * Usage:
 *   const manager = require('./goal-manager.js');
 *   const progress = manager.updateGoalProgress(goalId, logsData);
 */

const fs = require('fs');
const path = require('path');

/**
 * Update goal progress based on coffee logs
 * @param {Object} goal - Goal profile
 * @param {Array} logs - Related coffee logs
 * @returns {Object} Updated goal with progress
 */
function updateGoalProgress(goal, logs) {
  const {
    'goal-type': goalType,
    'target-date': targetDate,
    status
  } = goal;
  
  // Skip if goal already completed or abandoned
  if (status === 'completed' || status === 'abandoned') {
    return goal;
  }
  
  // Calculate progress based on goal type
  let progress = 0;
  let milestones = [];
  
  switch (goalType) {
    case 'learn-method':
      progress = calculateLearnMethodProgress(goal, logs);
      milestones = generateLearnMethodMilestones(goal, logs);
      break;
      
    case 'explore-origin':
      progress = calculateExploreOriginProgress(goal, logs);
      milestones = generateExploreOriginMilestones(goal, logs);
      break;
      
    case 'achieve-rating':
      progress = calculateAchieveRatingProgress(goal, logs);
      milestones = generateAchieveRatingMilestones(goal, logs);
      break;
      
    case 'try-beans-count':
      progress = calculateTryBeansProgress(goal, logs);
      milestones = generateTryBeansMilestones(goal, logs);
      break;
      
    default:
      progress = calculateGenericProgress(goal, logs);
  }
  
  // Update goal
  const updated = {
    ...goal,
    'progress-percentage': Math.min(100, Math.round(progress)),
    'current-progress': progress,
    'last-update': new Date().toISOString().split('T')[0],
    milestones: milestones,
    'checkpoints-completed': milestones.filter(m => m.completed).length,
    'checkpoints-total': milestones.length
  };
  
  // Check if goal completed
  if (progress >= 100) {
    updated.status = 'completed';
    updated['completion-date'] = new Date().toISOString().split('T')[0];
    updated['achievement-level'] = 'met';
  }
  
  return updated;
}

/**
 * Calculate progress for learn-method goals
 */
function calculateLearnMethodProgress(goal, logs) {
  const methodToLearn = goal['method-to-learn'];
  const requiredSessions = goal['practice-sessions-required'] || 10;
  
  const methodLogs = logs.filter(l => l['brew-method'] === methodToLearn);
  const completed = methodLogs.length;
  
  goal['practice-sessions-completed'] = completed;
  
  return (completed / requiredSessions) * 100;
}

/**
 * Calculate progress for explore-origin goals
 */
function calculateExploreOriginProgress(goal, logs) {
  const originToExplore = goal['origin-to-explore'];
  const beansTarget = goal['beans-to-try-count'] || 5;
  
  const originLogs = logs.filter(l => l.origin === originToExplore);
  const uniqueBeans = new Set(originLogs.map(l => l.beans)).size;
  
  goal['beans-tried-count'] = uniqueBeans;
  goal['beans-discovered'] = [...new Set(originLogs.map(l => l.beans))];
  
  return (uniqueBeans / beansTarget) * 100;
}

/**
 * Calculate progress for achieve-rating goals
 */
function calculateAchieveRatingProgress(goal, logs) {
  const targetRating = goal['target-rating'] || 4.5;
  const currentBest = Math.max(...logs.map(l => l.rating || 0));
  
  goal['current-best-rating'] = currentBest;
  
  // Calculate how close to target
  if (currentBest >= targetRating) {
    return 100;
  }
  
  // Assume starting from 3.0, target is 4.5
  const startRating = 3.0;
  const progress = ((currentBest - startRating) / (targetRating - startRating)) * 100;
  
  return Math.max(0, Math.min(100, progress));
}

/**
 * Calculate progress for try-beans-count goals
 */
function calculateTryBeansProgress(goal, logs) {
  const target = goal['beans-to-try-count'] || 10;
  const uniqueBeans = new Set(logs.map(l => l.beans)).size;
  
  goal['beans-tried-count'] = uniqueBeans;
  
  return (uniqueBeans / target) * 100;
}

/**
 * Calculate generic progress
 */
function calculateGenericProgress(goal, logs) {
  // Use manual progress if available
  return goal['progress-percentage'] || 0;
}

/**
 * Generate milestone checkpoints
 */
function generateLearnMethodMilestones(goal, logs) {
  const method = goal['method-to-learn'];
  const methodLogs = logs.filter(l => l['brew-method'] === method);
  
  return [
    { name: 'First brew', completed: methodLogs.length >= 1 },
    { name: '5 brews completed', completed: methodLogs.length >= 5 },
    { name: 'First excellent brew (4.5+)', completed: methodLogs.some(l => l.rating >= 4.5) },
    { name: '10 brews completed', completed: methodLogs.length >= 10 },
    { name: 'Consistent excellence (3 consecutive 4.5+)', completed: checkConsecutiveExcellence(methodLogs, 3) }
  ];
}

/**
 * Generate explore origin milestones
 */
function generateExploreOriginMilestones(goal, logs) {
  const origin = goal['origin-to-explore'];
  const originLogs = logs.filter(l => l.origin === origin);
  const uniqueBeans = new Set(originLogs.map(l => l.beans)).size;
  
  return [
    { name: 'First coffee from origin', completed: originLogs.length >= 1 },
    { name: '3 different beans tried', completed: uniqueBeans >= 3 },
    { name: 'Washed processing tried', completed: originLogs.some(l => l.processing === 'washed') },
    { name: 'Natural processing tried', completed: originLogs.some(l => l.processing === 'natural') },
    { name: 'Excellent brew achieved (4.5+)', completed: originLogs.some(l => l.rating >= 4.5) },
    { name: `${goal['beans-to-try-count']} beans goal reached`, completed: uniqueBeans >= goal['beans-to-try-count'] }
  ];
}

/**
 * Generate rating achievement milestones
 */
function generateAchieveRatingMilestones(goal, logs) {
  const target = goal['target-rating'];
  const currentBest = Math.max(...logs.map(l => l.rating || 0));
  
  return [
    { name: `Rating ${target - 0.5}+ achieved`, completed: currentBest >= target - 0.5 },
    { name: `Rating ${target}+ achieved`, completed: currentBest >= target },
    { name: `Rating ${target}+ achieved twice`, completed: logs.filter(l => l.rating >= target).length >= 2 },
    { name: `Consistent ${target}+ (3 of last 5)`, completed: checkConsecutentTarget(logs, target, 5, 3) }
  ];
}

/**
 * Generate try-beans milestones
 */
function generateTryBeansMilestones(goal, logs) {
  const target = goal['beans-to-try-count'];
  const uniqueBeans = new Set(logs.map(l => l.beans)).size;
  
  const milestones = [];
  const checkpoints = [
    Math.round(target * 0.25),
    Math.round(target * 0.5),
    Math.round(target * 0.75),
    target
  ];
  
  checkpoints.forEach(checkpoint => {
    milestones.push({
      name: `${checkpoint} beans tried`,
      completed: uniqueBeans >= checkpoint
    });
  });
  
  return milestones;
}

/**
 * Check consecutive excellence
 */
function checkConsecutiveExcellence(logs, requiredCount) {
  if (logs.length < requiredCount) return false;
  
  const recent = logs.slice(-requiredCount);
  return recent.every(l => l.rating >= 4.5);
}

/**
 * Check consecutive target achievement
 */
function checkConsecutentTarget(logs, target, window, required) {
  if (logs.length < window) return false;
  
  const recent = logs.slice(-window);
  const meetingTarget = recent.filter(l => l.rating >= target).length;
  
  return meetingTarget >= required;
}

/**
 * Generate next steps for goal
 */
function generateNextSteps(goal, progress) {
  const steps = [];
  
  if (progress < 25) {
    steps.push('Get started with first action');
    steps.push('Set up necessary resources');
  } else if (progress < 50) {
    steps.push('Continue building momentum');
    steps.push('Review progress and adjust approach');
  } else if (progress < 75) {
    steps.push('You\'re over halfway - keep going!');
    steps.push('Focus on quality over quantity');
  } else if (progress < 100) {
    steps.push('Final push - goal almost reached!');
    steps.push('Review what worked well');
    steps.push('Prepare for completion celebration');
  }
  
  return steps;
}

/**
 * Celebrate goal completion
 */
function celebrateGoalCompletion(goal) {
  return {
    message: `🎉 Congratulations! Goal "${goal.title}" completed!`,
    achievement: goal.title,
    completionDate: goal['completion-date'],
    duration: calculateDuration(goal['start-date'], goal['completion-date']),
    suggestions: {
      nextGoal: suggestNextGoal(goal),
      celebration: 'Brew a special coffee to celebrate!',
      share: 'Consider sharing your achievement with the community'
    }
  };
}

/**
 * Suggest next goal based on completed goal
 */
function suggestNextGoal(completedGoal) {
  const suggestions = {
    'learn-method': 'Try learning another brewing method or master advanced techniques',
    'explore-origin': 'Explore a different origin or dive deeper into processing methods',
    'achieve-rating': 'Set a higher rating target or focus on consistency',
    'try-beans-count': 'Double your bean exploration target',
    'complete-course': 'Move to next level course or certification'
  };
  
  return suggestions[completedGoal['goal-type']] || 'Set a new challenging goal!';
}

/**
 * Calculate duration between dates
 */
function calculateDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.floor((end - start) / (1000 * 60 * 60 * 24));
  
  if (days < 30) return `${days} days`;
  if (days < 365) return `${Math.round(days / 30)} months`;
  return `${(days / 365).toFixed(1)} years`;
}

/**
 * Generate progress report for all goals
 */
function generateProgressReport(goals) {
  const report = {
    totalGoals: goals.length,
    active: goals.filter(g => g.status === 'in-progress').length,
    completed: goals.filter(g => g.status === 'completed').length,
    planned: goals.filter(g => g.status === 'planned').length,
    overdue: goals.filter(g => {
      return new Date(g['target-date']) < new Date() && g.status !== 'completed';
    }).length,
    completionRate: goals.length > 0 
      ? Math.round(goals.filter(g => g.status === 'completed').length / goals.length * 100)
      : 0
  };
  
  return report;
}

/**
 * Export all functions
 */
module.exports = {
  updateGoalProgress,
  generateNextSteps,
  celebrateGoalCompletion,
  suggestNextGoal,
  findRecipeCandidates: findRecipeCandidates,
  generateProgressReport
};
