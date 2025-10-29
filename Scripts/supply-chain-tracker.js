/**
 * Supply Chain Tracker - Coffee Vault 5.0
 * Version: 1.0.0
 * 
 * Track and visualize coffee supply chains:
 * - Producer relationship monitoring
 * - Certification tracking
 * - Supply chain visualization
 * - Transparency scoring
 * 
 * Usage:
 *   const tracker = require('./supply-chain-tracker.js');
 *   const chain = tracker.buildSupplyChain(beanProfile);
 */

/**
 * Build complete supply chain for a bean
 * @param {Object} bean - Bean profile with supply chain data
 * @returns {Object} Complete supply chain map
 */
function buildSupplyChain(bean) {
  const chain = {
    bean: bean.name,
    completeness: 0,
    verified: bean['supply-chain-verified'] || false,
    links: []
  };
  
  // Build chain from producer to consumer
  const chainLinks = [];
  
  // 1. Producer/Farm
  if (bean['producer-link'] || bean.producer) {
    chainLinks.push({
      step: 1,
      entity: 'Producer/Farm',
      name: bean['producer-link'] || bean.producer,
      verified: !!bean['producer-link'],
      data: extractProducerData(bean)
    });
    chain.completeness += 16.7;
  }
  
  // 2. Washing Station/Processing
  if (bean['washing-station']) {
    chainLinks.push({
      step: 2,
      entity: 'Washing Station',
      name: bean['washing-station'],
      verified: true,
      data: { processing: bean.processing }
    });
    chain.completeness += 16.7;
  }
  
  // 3. Exporter
  if (bean['export-company'] || bean.exporter) {
    chainLinks.push({
      step: 3,
      entity: 'Exporter',
      name: bean['export-company'] || bean.exporter,
      verified: !!bean['export-company'],
      data: {}
    });
    chain.completeness += 16.7;
  }
  
  // 4. Importer
  if (bean['import-company'] || bean.importer) {
    chainLinks.push({
      step: 4,
      entity: 'Importer',
      name: bean['import-company'] || bean.importer,
      verified: !!bean['import-company'],
      data: {}
    });
    chain.completeness += 16.7;
  }
  
  // 5. Roaster
  if (bean.roaster) {
    chainLinks.push({
      step: 5,
      entity: 'Roaster',
      name: bean.roaster,
      verified: true,
      data: {
        roastDate: bean['roast-date'],
        roastLevel: bean['roast-level']
      }
    });
    chain.completeness += 16.7;
  }
  
  // 6. You (Consumer)
  chainLinks.push({
    step: 6,
    entity: 'Consumer',
    name: 'You',
    verified: true,
    data: {
      purchaseDate: bean['purchase-date'],
      purchasePrice: bean['purchase-price']
    }
  });
  chain.completeness += 16.7;
  
  chain.links = chainLinks;
  chain.completeness = Math.round(chain.completeness);
  
  return chain;
}

/**
 * Extract producer data from bean
 */
function extractProducerData(bean) {
  return {
    farm: bean.farm,
    producer: bean.producer,
    altitude: bean.altitude,
    variety: bean.variety,
    processing: bean.processing,
    certifications: bean.certification
  };
}

/**
 * Calculate transparency score
 * @param {Object} bean - Bean profile
 * @returns {Number} Transparency score (0-10)
 */
function calculateTransparencyScore(bean) {
  let score = 0;
  
  // Producer information (3 points)
  if (bean['producer-link']) score += 2;
  else if (bean.producer) score += 1;
  if (bean.farm) score += 1;
  
  // Supply chain links (3 points)
  if (bean['washing-station']) score += 1;
  if (bean['export-company'] || bean.exporter) score += 1;
  if (bean['import-company'] || bean.importer) score += 1;
  
  // Lot/traceability (2 points)
  if (bean['lot-number']) score += 1;
  if (bean['harvest-year-season']) score += 1;
  
  // Contract/pricing (2 points)
  if (bean['contract-type']) score += 1;
  if (bean['price-paid-to-farmer'] || bean['price-premium-vs-commodity']) score += 1;
  
  return score;
}

/**
 * Monitor producer relationships
 * @param {Array} beans - All beans in vault
 * @param {Array} producers - All producer profiles
 * @returns {Object} Relationship analysis
 */
function monitorProducerRelationships(beans, producers) {
  const relationships = [];
  
  producers.forEach(producer => {
    const beansFromProducer = beans.filter(b => 
      b['producer-link'] === producer.name ||
      b.producer === producer.name
    );
    
    const avgRating = beansFromProducer.length > 0
      ? beansFromProducer.reduce((sum, b) => sum + (b.avgRating || 0), 0) / beansFromProducer.length
      : 0;
    
    const totalSpent = beansFromProducer.reduce((sum, b) => 
      sum + (b['purchase-price'] || 0), 0
    );
    
    relationships.push({
      producer: producer.name,
      country: producer.country,
      beansCount: beansFromProducer.length,
      avgRating: avgRating.toFixed(2),
      totalSpent: totalSpent.toFixed(2),
      relationshipStrength: producer['relationship-strength'],
      certifications: producer.certifications || [],
      sustainabilityRating: producer['sustainability-rating']
    });
  });
  
  return relationships.sort((a, b) => b.beansCount - a.beansCount);
}

/**
 * Track certification status
 * @param {Array} beans - All beans
 * @returns {Object} Certification analysis
 */
function trackCertifications(beans) {
  const certificationCounts = {};
  const certifiedBeans = [];
  
  beans.forEach(bean => {
    const certs = bean.certification || [];
    if (certs.length > 0) {
      certifiedBeans.push(bean);
      certs.forEach(cert => {
        certificationCounts[cert] = (certificationCounts[cert] || 0) + 1;
      });
    }
  });
  
  const certificationPercentage = beans.length > 0
    ? Math.round((certifiedBeans.length / beans.length) * 100)
    : 0;
  
  return {
    totalBeans: beans.length,
    certifiedBeans: certifiedBeans.length,
    certificationPercentage: certificationPercentage,
    byCertification: certificationCounts,
    topCertifications: Object.entries(certificationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cert, count]) => ({ certification: cert, count: count }))
  };
}

/**
 * Generate supply chain report
 * @param {Array} beans - All beans
 * @param {Array} producers - All producers
 * @returns {String} Markdown report
 */
function generateSupplyChainReport(beans, producers) {
  const report = [];
  
  report.push('# Supply Chain Transparency Report');
  report.push('');
  report.push(`**Generated**: ${new Date().toISOString().split('T')[0]}`);
  report.push(`**Total Beans**: ${beans.length}`);
  report.push(`**Total Producers**: ${producers.length}`);
  report.push('');
  
  // Overall transparency
  const avgTransparency = beans.reduce((sum, b) => {
    return sum + (calculateTransparencyScore(b) || 0);
  }, 0) / beans.length;
  
  report.push(`## Overall Transparency: ${avgTransparency.toFixed(1)}/10`);
  report.push('');
  
  // Certification summary
  const certTracking = trackCertifications(beans);
  report.push(`## Certifications: ${certTracking.certificationPercentage}% of beans certified`);
  report.push('');
  
  certTracking.topCertifications.forEach(cert => {
    report.push(`- ${cert.certification}: ${cert.count} beans`);
  });
  report.push('');
  
  // Producer relationships
  const relationships = monitorProducerRelationships(beans, producers);
  report.push(`## Producer Relationships: ${relationships.length} producers`);
  report.push('');
  
  relationships.forEach(rel => {
    report.push(`### ${rel.producer}`);
    report.push(`- **Beans**: ${rel.beansCount}`);
    report.push(`- **Avg Rating**: ${rel.avgRating}⭐`);
    report.push(`- **Total Spent**: $${rel.totalSpent}`);
    report.push('');
  });
  
  // Recommendations
  report.push('## Recommendations');
  report.push('');
  
  if (avgTransparency < 5) {
    report.push('- **Improve transparency**: Ask roasters for more supply chain information');
  }
  
  if (certTracking.certificationPercentage < 50) {
    report.push('- **Increase certified coffees**: Look for organic, fair-trade, or rainforest alliance certifications');
  }
  
  if (relationships.length < 3) {
    report.push('- **Build producer relationships**: Track producer information for beans you purchase');
  }
  
  return report.join('\n');
}

/**
 * Export all functions
 */
module.exports = {
  buildSupplyChain,
  calculateTransparencyScore,
  monitorProducerRelationships,
  trackCertifications,
  generateSupplyChainReport
};
