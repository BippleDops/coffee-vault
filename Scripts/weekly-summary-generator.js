/**
 * Weekly Summary Generator for Coffee Vault
 * Version: 3.0.0
 *
 * Automatically generates comprehensive weekly coffee brewing summaries
 * with statistics, trends, and recommendations.
 *
 * Usage: Can be called from Templater, Datacore, or run directly
 */

const stats = require('./stats-utils.js');

/**
 * Generate complete weekly summary
 * @param {Object} dv - Dataview API instance
 * @param {Date} weekStart - Start date of the week
 * @param {Date} weekEnd - End date of the week
 * @returns {Object} Complete weekly summary data
 */
function generateWeeklySummary(dv, weekStart, weekEnd) {
  // Query all coffee logs for the week
  const logs = dv.pages('"Coffee Logs"')
    .where(p =>
      p.type === "coffee-log" &&
      p.date >= weekStart.toISOString().split('T')[0] &&
      p.date <= weekEnd.toISOString().split('T')[0]
    )
    .array();

  if (logs.length === 0) {
    return {
      error: "No coffee logs found for this week",
      weekStart,
      weekEnd,
      totalSessions: 0
    };
  }

  // Extract data arrays
  const ratings = logs.map(l => l.rating).filter(r => r != null);
  const doses = logs.map(l => l.dose).filter(d => d != null);
  const brewTimes = logs.map(l => l["brew-time"]).filter(t => t);
  const brewMethods = logs.map(l => l["brew-method"]).filter(m => m);
  const beans = logs.map(l => l.beans).filter(b => b);
  const origins = logs.map(l => l.origin).filter(o => o);

  // Calculate statistics
  const summary = {
    // Basic info
    weekStart: weekStart.toISOString().split('T')[0],
    weekEnd: weekEnd.toISOString().split('T')[0],
    totalSessions: logs.length,

    // Rating statistics
    ratings: {
      average: stats.mean(ratings),
      median: stats.median(ratings),
      min: Math.min(...ratings),
      max: Math.max(...ratings),
      std: stats.standardDeviation(ratings),
      consistency: stats.consistencyScore(ratings)
    },

    // Dose statistics
    doses: {
      average: stats.mean(doses),
      median: stats.median(doses),
      total: doses.reduce((sum, d) => sum + d, 0)
    },

    // Frequency analysis
    topBrewMethods: stats.topN(brewMethods, 3),
    topBeans: stats.topN(beans, 3),
    topOrigins: stats.topN(origins, 3),

    // Best sessions
    bestSessions: logs
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3)
      .map(l => ({
        date: l.date,
        beans: l.beans,
        rating: l.rating,
        method: l["brew-method"]
      })),

    // Trends (if we have previous week data)
    trends: calculateTrends(dv, logs, weekStart)
  };

  // Generate recommendations
  summary.recommendations = generateRecommendations(summary, logs);

  return summary;
}

/**
 * Calculate trends by comparing to previous week
 */
function calculateTrends(dv, currentLogs, weekStart) {
  const prevWeekStart = new Date(weekStart);
  prevWeekStart.setDate(prevWeekStart.getDate() - 7);
  const prevWeekEnd = new Date(weekStart);
  prevWeekEnd.setDate(prevWeekEnd.getDate() - 1);

  const prevLogs = dv.pages('"Coffee Logs"')
    .where(p =>
      p.type === "coffee-log" &&
      p.date >= prevWeekStart.toISOString().split('T')[0] &&
      p.date <= prevWeekEnd.toISOString().split('T')[0]
    )
    .array();

  if (prevLogs.length === 0) {
    return { available: false };
  }

  const currentRatings = currentLogs.map(l => l.rating).filter(r => r);
  const prevRatings = prevLogs.map(l => l.rating).filter(r => r);

  const currentAvg = stats.mean(currentRatings);
  const prevAvg = stats.mean(prevRatings);

  return {
    available: true,
    ratingChange: currentAvg - prevAvg,
    ratingChangePercent: ((currentAvg - prevAvg) / prevAvg) * 100,
    sessionCountChange: currentLogs.length - prevLogs.length,
    consistency: {
      current: stats.consistencyScore(currentRatings),
      previous: stats.consistencyScore(prevRatings)
    }
  };
}

/**
 * Generate personalized recommendations
 */
function generateRecommendations(summary, logs) {
  const recs = [];

  // Rating-based recommendations
  if (summary.ratings.average < 3.5) {
    recs.push({
      type: "improvement",
      priority: "high",
      message: "Your average rating is below 3.5. Consider revisiting brewing fundamentals or trying different beans."
    });
  } else if (summary.ratings.average >= 4.5) {
    recs.push({
      type: "celebration",
      priority: "low",
      message: "Excellent week! Your average rating is 4.5+. You're dialing in your technique beautifully."
    });
  }

  // Consistency recommendations
  if (summary.ratings.consistency < 70) {
    recs.push({
      type: "consistency",
      priority: "medium",
      message: `Consistency score is ${summary.ratings.consistency.toFixed(1)}%. Focus on standardizing your process (grind size, water temp, timing).`
    });
  }

  // Variety recommendations
  if (summary.topBeans.length === 1 && summary.totalSessions > 5) {
    recs.push({
      type: "variety",
      priority: "low",
      message: "You brewed only one type of bean this week. Consider exploring different origins or roasts."
    });
  }

  // Method recommendations
  if (summary.topBrewMethods.length === 1) {
    const method = summary.topBrewMethods[0].value;
    recs.push({
      type: "exploration",
      priority: "low",
      message: `You used ${method} exclusively. Try experimenting with a different brew method this week.`
    });
  }

  // Trend-based recommendations
  if (summary.trends.available) {
    if (summary.trends.ratingChange < -0.5) {
      recs.push({
        type: "alert",
        priority: "high",
        message: `Ratings dropped by ${Math.abs(summary.trends.ratingChange).toFixed(1)} points from last week. Review your recent parameter changes.`
      });
    } else if (summary.trends.ratingChange > 0.5) {
      recs.push({
        type: "celebration",
        priority: "low",
        message: `Great improvement! Ratings up ${summary.trends.ratingChange.toFixed(1)} points from last week. Keep it up!`
      });
    }
  }

  // Session frequency
  if (summary.totalSessions < 3) {
    recs.push({
      type: "engagement",
      priority: "medium",
      message: "Only a few sessions this week. More data will help you track patterns and improve."
    });
  }

  return recs;
}

/**
 * Format summary as Markdown
 */
function formatAsMarkdown(summary) {
  let md = `# ☕ Weekly Coffee Summary\n\n`;
  md += `**Week**: ${summary.weekStart} to ${summary.weekEnd}\n`;
  md += `**Total Sessions**: ${summary.totalSessions}\n\n`;

  md += `---\n\n`;

  md += `## 📊 Performance Metrics\n\n`;
  md += `### Ratings\n`;
  md += `- **Average**: ${summary.ratings.average.toFixed(2)} ⭐\n`;
  md += `- **Median**: ${summary.ratings.median.toFixed(2)}\n`;
  md += `- **Range**: ${summary.ratings.min} - ${summary.ratings.max}\n`;
  md += `- **Consistency**: ${summary.ratings.consistency.toFixed(1)}%\n\n`;

  md += `### Coffee Consumption\n`;
  md += `- **Average Dose**: ${summary.doses.average.toFixed(1)}g\n`;
  md += `- **Total Coffee Used**: ${summary.doses.total.toFixed(0)}g\n`;
  md += `- **Cups Brewed**: ${summary.totalSessions}\n\n`;

  md += `---\n\n`;

  md += `## 🏆 Top Performers\n\n`;

  md += `### Best Brew Methods\n`;
  summary.topBrewMethods.forEach((method, i) => {
    md += `${i + 1}. **${method.value}** (${method.count} sessions)\n`;
  });

  md += `\n### Favorite Beans\n`;
  summary.topBeans.forEach((bean, i) => {
    md += `${i + 1}. ${bean.value} (${bean.count}x)\n`;
  });

  md += `\n### Top Origins\n`;
  summary.topOrigins.forEach((origin, i) => {
    md += `${i + 1}. ${origin.value} (${origin.count} brews)\n`;
  });

  md += `\n---\n\n`;

  md += `## ⭐ Best Sessions\n\n`;
  summary.bestSessions.forEach((session, i) => {
    md += `${i + 1}. **${session.beans}** - ${session.rating}/5.0 (${session.method})\n`;
    md += `   - Date: ${session.date}\n\n`;
  });

  md += `---\n\n`;

  if (summary.trends.available) {
    md += `## 📈 Trends\n\n`;
    const change = summary.trends.ratingChange >= 0 ? '↑' : '↓';
    md += `- **Rating Change**: ${change} ${Math.abs(summary.trends.ratingChange).toFixed(2)} (${summary.trends.ratingChangePercent >= 0 ? '+' : ''}${summary.trends.ratingChangePercent.toFixed(1)}%)\n`;
    md += `- **Session Count**: ${summary.trends.sessionCountChange >= 0 ? '+' : ''}${summary.trends.sessionCountChange} vs last week\n`;
    md += `- **Consistency**: ${summary.trends.consistency.current.toFixed(1)}% (was ${summary.trends.consistency.previous.toFixed(1)}%)\n\n`;
  }

  md += `---\n\n`;

  md += `## 💡 Recommendations\n\n`;
  summary.recommendations.forEach(rec => {
    const icon = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
    md += `${icon} **${rec.type.toUpperCase()}**: ${rec.message}\n\n`;
  });

  return md;
}

/**
 * Helper to get week start/end dates
 */
function getWeekDates(dateString) {
  const date = dateString ? new Date(dateString) : new Date();
  const day = date.getDay();
  const diff = date.getDate() - day; // Adjust to Sunday

  const weekStart = new Date(date);
  weekStart.setDate(diff);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return { weekStart, weekEnd };
}

// Export functions
module.exports = {
  generateWeeklySummary,
  formatAsMarkdown,
  getWeekDates,
  calculateTrends,
  generateRecommendations
};
