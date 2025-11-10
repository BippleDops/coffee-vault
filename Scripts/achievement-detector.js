#!/usr/bin/env node

/**
 * Achievement Detector for Coffee Vault
 * Automatically detects and tracks user achievements based on brewing data
 */

import { glob } from 'glob';
import matter from 'gray-matter';
import fs from 'fs/promises';
import path from 'path';

const VAULT_ROOT = process.cwd();

// Achievement definitions
const ACHIEVEMENTS = {
  // Brewing Milestones
  first_brew: {
    id: 'first_brew',
    name: 'First Brew',
    description: 'Log your first coffee',
    category: 'brewing_milestones',
    tier: 'bronze',
    check: (stats) => stats.totalBrews >= 1
  },
  ten_brew_club: {
    id: 'ten_brew_club',
    name: '10 Brew Club',
    description: 'Log 10 coffees',
    category: 'brewing_milestones',
    tier: 'bronze',
    check: (stats) => stats.totalBrews >= 10
  },
  fifty_brew_milestone: {
    id: 'fifty_brew_milestone',
    name: '50 Brew Milestone',
    description: 'Log 50 coffees',
    category: 'brewing_milestones',
    tier: 'silver',
    check: (stats) => stats.totalBrews >= 50
  },
  century: {
    id: 'century',
    name: 'Century',
    description: 'Log 100 coffees',
    category: 'brewing_milestones',
    tier: 'gold',
    check: (stats) => stats.totalBrews >= 100
  },

  // Quality Achievements
  perfect_score: {
    id: 'perfect_score',
    name: 'First Perfect Score',
    description: 'Achieve a rating of 95+',
    category: 'quality',
    tier: 'silver',
    check: (stats) => stats.perfectScores >= 1
  },
  ten_perfect_scores: {
    id: 'ten_perfect_scores',
    name: '10 Perfect Scores',
    description: 'Achieve 10 ratings of 95+',
    category: 'quality',
    tier: 'gold',
    check: (stats) => stats.perfectScores >= 10
  },
  excellence_streak: {
    id: 'excellence_streak',
    name: 'Excellence Streak',
    description: 'Log 10 consecutive brews rated 85+',
    category: 'quality',
    tier: 'gold',
    check: (stats) => stats.excellenceStreak >= 10
  },

  // Exploration Achievements
  five_origins: {
    id: 'five_origins',
    name: '5 Origins',
    description: 'Try coffee from 5 different origins',
    category: 'exploration',
    tier: 'bronze',
    check: (stats) => stats.originsExplored >= 5
  },
  ten_origins: {
    id: 'ten_origins',
    name: '10 Origins',
    description: 'Try coffee from 10 different origins',
    category: 'exploration',
    tier: 'silver',
    check: (stats) => stats.originsExplored >= 10
  },
  world_traveler: {
    id: 'world_traveler',
    name: 'World Traveler',
    description: 'Try coffee from 20+ origins',
    category: 'exploration',
    tier: 'gold',
    check: (stats) => stats.originsExplored >= 20
  },
  process_explorer: {
    id: 'process_explorer',
    name: 'Process Explorer',
    description: 'Try all 3 main processes (washed, natural, honey)',
    category: 'exploration',
    tier: 'silver',
    check: (stats) => {
      const processes = new Set(stats.processesExplored.map(p => p.toLowerCase()));
      return processes.has('washed') && processes.has('natural') && processes.has('honey');
    }
  },

  // Method Mastery
  five_methods: {
    id: 'five_methods',
    name: '5 Methods',
    description: 'Brew with 5 different methods',
    category: 'method_mastery',
    tier: 'bronze',
    check: (stats) => stats.methodsUsed >= 5
  },
  v60_specialist: {
    id: 'v60_specialist',
    name: 'V60 Specialist',
    description: 'Brew 50+ V60s',
    category: 'method_mastery',
    tier: 'silver',
    check: (stats) => {
      const v60Count = stats.methodCounts['v60'] || stats.methodCounts['V60'] || 0;
      return v60Count >= 50;
    }
  },
  espresso_master: {
    id: 'espresso_master',
    name: 'Espresso Master',
    description: 'Brew 100+ espressos',
    category: 'method_mastery',
    tier: 'gold',
    check: (stats) => {
      const espressoCount = stats.methodCounts['espresso'] || stats.methodCounts['Espresso'] || 0;
      return espressoCount >= 100;
    }
  },
};

class AchievementDetector {
  constructor() {
    this.stats = {
      totalBrews: 0,
      originsExplored: 0,
      methodsUsed: 0,
      perfectScores: 0,
      excellenceStreak: 0,
      methodCounts: {},
      processesExplored: [],
      recentRatings: [],
    };
    this.earnedAchievements = [];
    this.logs = [];
  }

  async loadBrewingData() {
    console.log('📊 Loading brewing data...');

    const files = await glob('Coffee Logs/**/*.md', {
      cwd: VAULT_ROOT,
    });

    for (const file of files) {
      try {
        const content = await fs.readFile(path.join(VAULT_ROOT, file), 'utf-8');
        const { data } = matter(content);

        if (data.type === 'coffee-log') {
          this.logs.push(data);
        }
      } catch (error) {
        // Skip files with errors
      }
    }

    console.log(`✓ Loaded ${this.logs.length} coffee logs`);
  }

  calculateStatistics() {
    console.log('🔢 Calculating statistics...');

    // Sort logs by date
    this.logs.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Total brews
    this.stats.totalBrews = this.logs.length;

    // Origins explored
    const origins = new Set(this.logs.map(log => log.origin || log.bean).filter(Boolean));
    this.stats.originsExplored = origins.size;

    // Methods used
    const methods = new Set(this.logs.map(log => log.brewingMethod || log.method).filter(Boolean));
    this.stats.methodsUsed = methods.size;

    // Method counts
    this.logs.forEach(log => {
      const method = log.brewingMethod || log.method;
      if (method) {
        this.stats.methodCounts[method] = (this.stats.methodCounts[method] || 0) + 1;
      }
    });

    // Processes explored
    const processes = [...new Set(this.logs.map(log => log.processing || log.process).filter(Boolean))];
    this.stats.processesExplored = processes;

    // Perfect scores (95+)
    this.stats.perfectScores = this.logs.filter(log => {
      const rating = log.overallRating || log.rating;
      return rating && parseFloat(rating) >= 95;
    }).length;

    // Excellence streak (consecutive 85+)
    let currentStreak = 0;
    let maxStreak = 0;

    this.logs.forEach(log => {
      const rating = log.overallRating || log.rating;
      if (rating && parseFloat(rating) >= 85) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });

    this.stats.excellenceStreak = maxStreak;

    // Recent ratings (for trend analysis)
    this.stats.recentRatings = this.logs
      .filter(log => log.overallRating || log.rating)
      .map(log => parseFloat(log.overallRating || log.rating))
      .slice(-10);
  }

  detectAchievements() {
    console.log('\n🏆 Detecting achievements...\n');

    for (const [key, achievement] of Object.entries(ACHIEVEMENTS)) {
      if (achievement.check(this.stats)) {
        this.earnedAchievements.push(achievement);
      }
    }

    // Sort by tier and category
    const tierOrder = { bronze: 1, silver: 2, gold: 3, platinum: 4 };
    this.earnedAchievements.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return tierOrder[b.tier] - tierOrder[a.tier];
    });
  }

  async saveProgress() {
    const progressPath = path.join(VAULT_ROOT, 'Progress', 'achievements.md');

    // Create Progress directory if it doesn't exist
    await fs.mkdir(path.join(VAULT_ROOT, 'Progress'), { recursive: true });

    let content = `---
type: achievement-tracker
last-updated: ${new Date().toISOString().split('T')[0]}
total-achievements: ${this.earnedAchievements.length}
total-possible: ${Object.keys(ACHIEVEMENTS).length}
completion: ${((this.earnedAchievements.length / Object.keys(ACHIEVEMENTS).length) * 100).toFixed(1)}%
---

# ☕ My Coffee Achievements

**Progress**: ${this.earnedAchievements.length}/${Object.keys(ACHIEVEMENTS).length} achievements earned

---

## 🏆 Earned Achievements (${this.earnedAchievements.length})

`;

    // Group by category
    const byCategory = this.earnedAchievements.reduce((acc, achievement) => {
      if (!acc[achievement.category]) {
        acc[achievement.category] = [];
      }
      acc[achievement.category].push(achievement);
      return acc;
    }, {});

    for (const [category, achievements] of Object.entries(byCategory)) {
      const categoryName = category.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');

      content += `\n### ${categoryName}\n\n`;

      achievements.forEach(achievement => {
        const emoji = {
          bronze: '🥉',
          silver: '🥈',
          gold: '🥇',
          platinum: '💎'
        }[achievement.tier];

        content += `- ${emoji} **${achievement.name}** - ${achievement.description}\n`;
      });
    }

    // Add locked achievements
    const lockedAchievements = Object.values(ACHIEVEMENTS).filter(achievement =>
      !this.earnedAchievements.find(earned => earned.id === achievement.id)
    );

    if (lockedAchievements.length > 0) {
      content += `\n## 🔒 Locked Achievements (${lockedAchievements.length})\n\n`;

      const lockedByCategory = lockedAchievements.reduce((acc, achievement) => {
        if (!acc[achievement.category]) {
          acc[achievement.category] = [];
        }
        acc[achievement.category].push(achievement);
        return acc;
      }, {});

      for (const [category, achievements] of Object.entries(lockedByCategory)) {
        const categoryName = category.split('_').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');

        content += `\n### ${categoryName}\n\n`;

        achievements.forEach(achievement => {
          content += `- ⬜ **${achievement.name}** - ${achievement.description}\n`;
        });
      }
    }

    // Add statistics
    content += `\n---

## 📊 Your Statistics

- **Total Brews**: ${this.stats.totalBrews}
- **Origins Explored**: ${this.stats.originsExplored}
- **Methods Used**: ${this.stats.methodsUsed}
- **Perfect Scores** (95+): ${this.stats.perfectScores}
- **Excellence Streak**: ${this.stats.excellenceStreak} consecutive 85+ brews

### Top Methods

${Object.entries(this.stats.methodCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .map(([method, count]) => `- ${method}: ${count} brews`)
  .join('\n')}

---

*Achievement tracking powered by Coffee Vault v9.0*
*Last updated: ${new Date().toLocaleString()}*
`;

    await fs.writeFile(progressPath, content, 'utf-8');
    console.log(`✓ Saved progress to ${progressPath}`);
  }

  printReport() {
    console.log('\n' + '='.repeat(60));
    console.log('        Achievement Detection Report');
    console.log('='.repeat(60));
    console.log(`\n📊 Statistics:\n`);
    console.log(`  Total Brews:        ${this.stats.totalBrews}`);
    console.log(`  Origins Explored:   ${this.stats.originsExplored}`);
    console.log(`  Methods Used:       ${this.stats.methodsUsed}`);
    console.log(`  Perfect Scores:     ${this.stats.perfectScores}`);
    console.log(`  Excellence Streak:  ${this.stats.excellenceStreak}`);
    console.log(`\n🏆 Achievements:\n`);
    console.log(`  Earned:             ${this.earnedAchievements.length}/${Object.keys(ACHIEVEMENTS).length}`);
    console.log(`  Completion:         ${((this.earnedAchievements.length / Object.keys(ACHIEVEMENTS).length) * 100).toFixed(1)}%`);

    if (this.earnedAchievements.length > 0) {
      console.log(`\n🎉 Recent Unlocks:\n`);
      this.earnedAchievements.slice(0, 5).forEach(achievement => {
        const emoji = {
          bronze: '🥉',
          silver: '🥈',
          gold: '🥇',
          platinum: '💎'
        }[achievement.tier];
        console.log(`  ${emoji} ${achievement.name} - ${achievement.description}`);
      });
    }

    console.log(`\n✅ Achievement detection complete!\n`);
  }
}

async function main() {
  console.log('☕ Coffee Vault - Achievement Detector\n');

  const detector = new AchievementDetector();

  await detector.loadBrewingData();
  detector.calculateStatistics();
  detector.detectAchievements();
  await detector.saveProgress();
  detector.printReport();
}

main().catch(console.error);
