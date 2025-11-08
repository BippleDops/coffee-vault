---
type: script
title: Tag Inference Script
version: 5.0.0
date: 2025-10-28
tags: [script, automation, tagging, coffee-vault-5.0]
---

/**
 * Coffee Vault 5.0 - Smart Tag Inference Script
 * 
 * Automatically generates hierarchical tags from entity properties
 * Adds tags based on entity type, properties, and relationships
 */

/**
 * Generate tags for a coffee log entity
 */
function generateCoffeeLogTags(log) {
  const tags = ['category:coffee-log'];
  
  // Method tag
  if (log['brew-method']) {
    tags.push(`method:${log['brew-method'].toLowerCase()}`);
  }
  
  // Origin tag
  if (log.origin) {
    const originTag = log.origin.toLowerCase().replace(/\s+/g, '-');
    tags.push(`origin:${originTag}`);
  }
  
  // Roast level tag
  if (log['roast-level']) {
    tags.push(`roast:${log['roast-level'].toLowerCase().replace(/\s+/g, '-')}`);
  }
  
  // Processing tag
  if (log.processing) {
    tags.push(`processing:${log.processing.toLowerCase()}`);
  }
  
  // Quality tags
  if (log.rating) {
    if (log.rating >= 4.5) tags.push('quality:excellent');
    else if (log.rating >= 4.0) tags.push('quality:good');
    else if (log.rating >= 3.0) tags.push('quality:fair');
    else tags.push('quality:poor');
  }
  
  // Dialed-in tag
  if (log['is-dialed-in']) {
    tags.push('dialed-in:true');
  }
  
  // Favorite tag
  if (log['is-favorite']) {
    tags.push('personal:favorite');
  }
  
  // Temporal tags
  if (log.date) {
    const date = new Date(log.date);
    const month = date.toISOString().slice(0, 7); // YYYY-MM
    const year = date.getFullYear();
    tags.push(`month:${month}`, `year:${year}`);
    
    // Season
    const monthNum = date.getMonth() + 1;
    if (monthNum >= 3 && monthNum <= 5) tags.push('season:spring');
    else if (monthNum >= 6 && monthNum <= 8) tags.push('season:summer');
    else if (monthNum >= 9 && monthNum <= 11) tags.push('season:fall');
    else tags.push('season:winter');
  }
  
  return tags;
}

/**
 * Generate tags for a bean profile entity
 */
function generateBeanProfileTags(bean) {
  const tags = ['category:bean-profile'];
  
  // Origin tag
  if (bean.origin) {
    const originTag = bean.origin.toLowerCase().replace(/\s+/g, '-');
    tags.push(`origin:${originTag}`);
  }
  
  // Roaster tag
  if (bean.roaster) {
    const roasterTag = typeof bean.roaster === 'string' 
      ? bean.roaster.toLowerCase().replace(/\s+/g, '-')
      : bean.roaster.path.split('/').pop().toLowerCase().replace(/\s+/g, '-');
    tags.push(`roaster:${roasterTag}`);
  }
  
  // Roast level tag
  if (bean['roast-level']) {
    tags.push(`roast:${bean['roast-level'].toLowerCase().replace(/\s+/g, '-')}`);
  }
  
  // Processing tag
  if (bean.processing) {
    tags.push(`processing:${bean.processing.toLowerCase()}`);
  }
  
  // Variety tag
  if (bean.variety) {
    tags.push(`variety:${bean.variety.toLowerCase()}`);
  }
  
  // Quality tags
  if (bean.score) {
    if (bean.score >= 90) tags.push('quality:excellent', 'specialty-grade:true');
    else if (bean.score >= 85) tags.push('quality:excellent', 'specialty-grade:true');
    else if (bean.score >= 80) tags.push('quality:good', 'specialty-grade:true');
    else tags.push('quality:fair');
  }
  
  // Status tags
  if (bean['is-current']) tags.push('status:current');
  if (bean['is-favorite']) tags.push('personal:favorite');
  if (bean['would-rebuy']) tags.push('personal:to-rebuy');
  if (bean['is-archived']) tags.push('status:archived');
  
  // Certification tags
  if (bean.certifications && bean.certifications.length > 0) {
    bean.certifications.forEach(cert => {
      tags.push(`certification:${cert.toLowerCase().replace(/\s+/g, '-')}`);
    });
  }
  
  // Temporal tags
  if (bean.date) {
    const date = new Date(bean.date);
    const month = date.toISOString().slice(0, 7);
    const year = date.getFullYear();
    tags.push(`month:${month}`, `year:${year}`);
  }
  
  return tags;
}

/**
 * Generate tags for a recipe profile entity
 */
function generateRecipeProfileTags(recipe) {
  const tags = ['category:recipe-profile'];
  
  // Method tag
  if (recipe['brew-method']) {
    tags.push(`method:${recipe['brew-method'].toLowerCase()}`);
  }
  
  // Target origin tag
  if (recipe['target-origin']) {
    const originTag = typeof recipe['target-origin'] === 'string'
      ? recipe['target-origin'].toLowerCase().replace(/\s+/g, '-')
      : recipe['target-origin'].path.split('/').pop().toLowerCase().replace(/\s+/g, '-');
    tags.push(`origin:${originTag}`);
  }
  
  // Target roast tag
  if (recipe['target-roast-level']) {
    tags.push(`roast:${recipe['target-roast-level'].toLowerCase().replace(/\s+/g, '-')}`);
  }
  
  // Quality tags
  if (recipe['success-rate']) {
    if (recipe['success-rate'] >= 80) tags.push('quality:excellent');
    else if (recipe['success-rate'] >= 60) tags.push('quality:good');
    else tags.push('quality:fair');
  }
  
  // Usage tags
  if (recipe['times-used'] && recipe['times-used'] > 10) {
    tags.push('personal:favorite');
  }
  
  // Temporal tags
  if (recipe['created-date']) {
    const date = new Date(recipe['created-date']);
    const month = date.toISOString().slice(0, 7);
    const year = date.getFullYear();
    tags.push(`month:${month}`, `year:${year}`);
  }
  
  return tags;
}

/**
 * Generate tags for a cupping session entity
 */
function generateCuppingSessionTags(session) {
  const tags = ['category:cupping-session'];
  
  // Protocol tag
  if (session.protocol) {
    tags.push(`protocol:${session.protocol.toLowerCase()}`);
  }
  
  // Session type tag
  if (session['session-type']) {
    tags.push(`session-type:${session['session-type'].toLowerCase().replace(/\s+/g, '-')}`);
  }
  
  // Quality tags
  if (session['top-score']) {
    if (session['top-score'] >= 90) tags.push('quality:excellent');
    else if (session['top-score'] >= 85) tags.push('quality:excellent');
    else if (session['top-score'] >= 80) tags.push('quality:good');
  }
  
  // Temporal tags
  if (session.date) {
    const date = new Date(session.date);
    const month = date.toISOString().slice(0, 7);
    const year = date.getFullYear();
    tags.push(`month:${month}`, `year:${year}`);
  }
  
  return tags;
}

/**
 * Generate tags for a producer profile entity
 */
function generateProducerProfileTags(producer) {
  const tags = ['category:producer-profile'];
  
  // Category tag
  if (producer.category) {
    tags.push(`producer-type:${producer.category.toLowerCase().replace(/\s+/g, '-')}`);
  }
  
  // Country tag
  if (producer.country) {
    tags.push(`origin:${producer.country.toLowerCase()}`);
  }
  
  // Certification tags
  if (producer.certifications && producer.certifications.length > 0) {
    producer.certifications.forEach(cert => {
      tags.push(`certification:${cert.toLowerCase().replace(/\s+/g, '-')}`);
    });
  }
  
  // Sustainability tag
  if (producer['sustainability-rating']) {
    tags.push(`sustainability:${producer['sustainability-rating'].toLowerCase()}`);
  }
  
  return tags;
}

/**
 * Generate tags for a coffee event entity
 */
function generateCoffeeEventTags(event) {
  const tags = ['category:coffee-event'];
  
  // Event type tag
  if (event['event-type']) {
    tags.push(`event-type:${event['event-type'].toLowerCase().replace(/\s+/g, '-')}`);
  }
  
  // Quality tags
  if (event['overall-rating']) {
    if (event['overall-rating'] >= 4.5) tags.push('quality:excellent');
    else if (event['overall-rating'] >= 4.0) tags.push('quality:good');
    else if (event['overall-rating'] >= 3.0) tags.push('quality:fair');
  }
  
  // Temporal tags
  if (event.date) {
    const date = new Date(event.date);
    const month = date.toISOString().slice(0, 7);
    const year = date.getFullYear();
    tags.push(`month:${month}`, `year:${year}`);
  }
  
  return tags;
}

/**
 * Generate tags for a coffee goal entity
 */
function generateCoffeeGoalTags(goal) {
  const tags = ['category:coffee-goal'];
  
  // Goal type tag
  if (goal['goal-type']) {
    tags.push(`goal-type:${goal['goal-type'].toLowerCase().replace(/\s+/g, '-')}`);
  }
  
  // Status tag
  if (goal.status) {
    tags.push(`status:${goal.status.toLowerCase().replace(/\s+/g, '-')}`);
  }
  
  // Priority tag
  if (goal.priority) {
    tags.push(`priority:${goal.priority.toLowerCase()}`);
  }
  
  // Completed tag
  if (goal.completed) {
    tags.push('status:completed', 'personal:achievement');
  }
  
  return tags;
}

/**
 * Main tag inference function
 * Determines entity type and calls appropriate tag generator
 */
function inferTags(entity) {
  if (!entity.type) {
    return [];
  }
  
  switch (entity.type) {
    case 'coffee-log':
      return generateCoffeeLogTags(entity);
    case 'bean-profile':
      return generateBeanProfileTags(entity);
    case 'recipe-profile':
      return generateRecipeProfileTags(entity);
    case 'cupping-session':
      return generateCuppingSessionTags(entity);
    case 'producer-profile':
      return generateProducerProfileTags(entity);
    case 'coffee-event':
      return generateCoffeeEventTags(entity);
    case 'coffee-goal':
      return generateCoffeeGoalTags(entity);
    default:
      return [`category:${entity.type}`];
  }
}

/**
 * Merge existing tags with inferred tags
 * Preserves existing tags, adds inferred ones
 */
function mergeTags(existingTags, inferredTags) {
  const existing = new Set(existingTags || []);
  inferredTags.forEach(tag => existing.add(tag));
  return Array.from(existing).sort();
}

// Export for use in templates and scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    inferTags,
    mergeTags,
    generateCoffeeLogTags,
    generateBeanProfileTags,
    generateRecipeProfileTags,
    generateCuppingSessionTags,
    generateProducerProfileTags,
    generateCoffeeEventTags,
    generateCoffeeGoalTags
  };
}

