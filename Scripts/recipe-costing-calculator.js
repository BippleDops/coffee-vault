#!/usr/bin/env node

/**
 * Recipe Costing Calculator for Coffee Businesses
 * Calculate true cost per cup including labor, overhead, and waste
 */

import { glob } from 'glob';
import matter from 'gray-matter';
import fs from 'fs/promises';
import path from 'path';

const VAULT_ROOT = process.cwd();

// Business configuration (can be customized)
const BUSINESS_CONFIG = {
  // Labor costs
  baristaHourlyWage: 15.00,  // $/hour
  averageBrewTime: 3.0,       // minutes per drink

  // Overhead costs
  monthlyRent: 3000,          // $
  monthlyUtilities: 500,      // $
  monthlyInsurance: 300,      // $
  monthlyMisc: 700,           // $
  drinksPerMonth: 3000,       // expected volume

  // Waste factors
  coffeeWasteFactor: 0.05,    // 5% waste
  milkWasteFactor: 0.03,      // 3% waste

  // Markup targets
  targetMargin: 0.65,         // 65% margin
  competitorPricing: true,
};

class RecipeCostingCalculator {
  constructor(config = BUSINESS_CONFIG) {
    this.config = config;
    this.recipes = [];
    this.ingredients = new Map();

    // Calculate overhead cost per drink
    const monthlyOverhead = config.monthlyRent + config.monthlyUtilities +
                           config.monthlyInsurance + config.monthlyMisc;
    this.overheadPerDrink = monthlyOverhead / config.drinksPerMonth;
  }

  // Set ingredient prices
  setIngredientPrices() {
    // Coffee ($/gram)
    this.ingredients.set('coffee_specialty', 0.04);  // $18/lb premium
    this.ingredients.set('coffee_standard', 0.03);   // $12/lb standard
    this.ingredients.set('coffee_commercial', 0.02); // $8/lb commercial

    // Milk ($/ml)
    this.ingredients.set('milk_whole', 0.0015);      // $6/gallon
    this.ingredients.set('milk_oat', 0.0025);        // $10/gallon
    this.ingredients.set('milk_almond', 0.0023);     // $9/gallon

    // Syrups & additives ($/ml)
    this.ingredients.set('syrup_flavored', 0.015);   // $3/200ml
    this.ingredients.set('chocolate', 0.02);         // $4/200ml

    // Disposables (per unit)
    this.ingredients.set('cup_12oz', 0.15);
    this.ingredients.set('cup_16oz', 0.18);
    this.ingredients.set('cup_20oz', 0.22);
    this.ingredients.set('lid', 0.05);
    this.ingredients.set('sleeve', 0.03);
    this.ingredients.set('stir_stick', 0.01);
  }

  async loadRecipes() {
    console.log('📋 Loading recipes...');

    const files = await glob('Recipes/**/*.md', {
      cwd: VAULT_ROOT,
    });

    for (const file of files) {
      try {
        const content = await fs.readFile(path.join(VAULT_ROOT, file), 'utf-8');
        const { data } = matter(content);

        if (data.type === 'recipe') {
          this.recipes.push({
            name: data.name || path.basename(file, '.md'),
            ...data
          });
        }
      } catch (error) {
        // Skip files with errors
      }
    }

    console.log(`✓ Loaded ${this.recipes.length} recipes`);
  }

  calculateRecipeCost(recipe) {
    let cost = {
      ingredients: 0,
      labor: 0,
      overhead: this.overheadPerDrink,
      total: 0,
      breakdown: []
    };

    // Coffee cost
    const coffeeDose = recipe.coffeeDose || recipe.dose || 18; // grams
    const coffeeType = recipe.coffeeQuality || 'specialty';
    const coffeeKey = `coffee_${coffeeType}`;
    const coffeeCost = coffeeDose * (this.ingredients.get(coffeeKey) || 0.03);
    const coffeeWithWaste = coffeeCost * (1 + this.config.coffeeWasteFactor);

    cost.ingredients += coffeeWithWaste;
    cost.breakdown.push({
      item: 'Coffee',
      amount: `${coffeeDose}g`,
      cost: coffeeWithWaste
    });

    // Milk cost (if applicable)
    if (recipe.milkVolume) {
      const milkVolume = recipe.milkVolume; // ml
      const milkType = recipe.milkType || 'whole';
      const milkKey = `milk_${milkType}`;
      const milkCost = milkVolume * (this.ingredients.get(milkKey) || 0.0015);
      const milkWithWaste = milkCost * (1 + this.config.milkWasteFactor);

      cost.ingredients += milkWithWaste;
      cost.breakdown.push({
        item: `Milk (${milkType})`,
        amount: `${milkVolume}ml`,
        cost: milkWithWaste
      });
    }

    // Syrups/additives
    if (recipe.syrupVolume) {
      const syrupCost = recipe.syrupVolume * (this.ingredients.get('syrup_flavored') || 0.015);
      cost.ingredients += syrupCost;
      cost.breakdown.push({
        item: 'Syrup',
        amount: `${recipe.syrupVolume}ml`,
        cost: syrupCost
      });
    }

    // Disposables
    const cupSize = recipe.cupSize || '16oz';
    const cupCost = this.ingredients.get(`cup_${cupSize}`) || 0.18;
    const disposablesCost = cupCost +
                           (this.ingredients.get('lid') || 0.05) +
                           (this.ingredients.get('sleeve') || 0.03);

    cost.ingredients += disposablesCost;
    cost.breakdown.push({
      item: 'Disposables',
      amount: `${cupSize} cup + lid + sleeve`,
      cost: disposablesCost
    });

    // Labor cost
    const brewTime = recipe.brewTime || this.config.averageBrewTime;
    cost.labor = (brewTime / 60) * this.config.baristaHourlyWage;

    // Total cost
    cost.total = cost.ingredients + cost.labor + cost.overhead;

    return cost;
  }

  calculatePricing(cost) {
    const pricing = {
      cost: cost.total,
      targetMargin: this.config.targetMargin,
      suggestedPrice: 0,
      actualMargin: 0,
      competitorPrice: 0,
      recommendedPrice: 0
    };

    // Calculate price for target margin
    // Price = Cost / (1 - Margin)
    pricing.suggestedPrice = cost.total / (1 - this.config.targetMargin);

    // Round to nearest $0.25
    pricing.suggestedPrice = Math.ceil(pricing.suggestedPrice * 4) / 4;

    // Recalculate actual margin
    pricing.actualMargin = (pricing.suggestedPrice - cost.total) / pricing.suggestedPrice;

    // Recommended price (same as suggested for now)
    pricing.recommendedPrice = pricing.suggestedPrice;

    return pricing;
  }

  async generateReport() {
    console.log('\n💰 Generating costing report...\n');

    const reportPath = path.join(VAULT_ROOT, 'Business', 'recipe-costing-report.md');
    await fs.mkdir(path.join(VAULT_ROOT, 'Business'), { recursive: true });

    let content = `---
type: business-report
category: recipe-costing
generated: ${new Date().toISOString().split('T')[0]}
---

# Recipe Costing Report

**Generated**: ${new Date().toLocaleString()}
**Recipes Analyzed**: ${this.recipes.length}

---

## Business Configuration

- **Barista Wage**: $${this.config.baristaHourlyWage}/hour
- **Overhead per Drink**: $${this.overheadPerDrink.toFixed(2)}
- **Target Margin**: ${(this.config.targetMargin * 100).toFixed(0)}%
- **Monthly Volume**: ${this.config.drinksPerMonth} drinks

---

## Recipe Costs

`;

    // Calculate costs for all recipes
    for (const recipe of this.recipes) {
      const cost = this.calculateRecipeCost(recipe);
      const pricing = this.calculatePricing(cost);

      content += `\n### ${recipe.name}\n\n`;
      content += `**Cost Breakdown**:\n`;
      cost.breakdown.forEach(item => {
        content += `- ${item.item} (${item.amount}): $${item.cost.toFixed(2)}\n`;
      });
      content += `- Labor: $${cost.labor.toFixed(2)}\n`;
      content += `- Overhead: $${cost.overhead.toFixed(2)}\n`;
      content += `\n**Total Cost**: $${cost.total.toFixed(2)}\n\n`;
      content += `**Pricing**:\n`;
      content += `- Recommended Price: **$${pricing.recommendedPrice.toFixed(2)}**\n`;
      content += `- Actual Margin: ${(pricing.actualMargin * 100).toFixed(1)}%\n`;
      content += `- Profit per Drink: $${(pricing.recommendedPrice - cost.total).toFixed(2)}\n\n`;
      content += `---\n`;
    }

    // Summary statistics
    const avgCost = this.recipes.reduce((sum, recipe) => {
      return sum + this.calculateRecipeCost(recipe).total;
    }, 0) / this.recipes.length;

    const avgPrice = this.recipes.reduce((sum, recipe) => {
      const cost = this.calculateRecipeCost(recipe);
      const pricing = this.calculatePricing(cost);
      return sum + pricing.recommendedPrice;
    }, 0) / this.recipes.length;

    content += `\n## Summary Statistics\n\n`;
    content += `- **Average Cost per Drink**: $${avgCost.toFixed(2)}\n`;
    content += `- **Average Recommended Price**: $${avgPrice.toFixed(2)}\n`;
    content += `- **Average Profit**: $${(avgPrice - avgCost).toFixed(2)}\n`;
    content += `- **Monthly Revenue Potential**: $${(avgPrice * this.config.drinksPerMonth).toLocaleString()}\n`;
    content += `- **Monthly Profit Potential**: $${((avgPrice - avgCost) * this.config.drinksPerMonth).toLocaleString()}\n`;

    content += `\n---\n\n*Generated by Coffee Vault Business Suite v10.0*\n`;

    await fs.writeFile(reportPath, content, 'utf-8');
    console.log(`✓ Report saved to ${reportPath}`);

    return { avgCost, avgPrice };
  }

  printSummary(summary) {
    console.log('\n' + '='.repeat(60));
    console.log('        Recipe Costing Summary');
    console.log('='.repeat(60));
    console.log(`\n📊 Analysis:\n`);
    console.log(`  Recipes Analyzed:     ${this.recipes.length}`);
    console.log(`  Average Cost:         $${summary.avgCost.toFixed(2)}`);
    console.log(`  Average Price:        $${summary.avgPrice.toFixed(2)}`);
    console.log(`  Average Profit:       $${(summary.avgPrice - summary.avgCost).toFixed(2)}`);
    console.log(`  Target Margin:        ${(this.config.targetMargin * 100).toFixed(0)}%`);
    console.log(`\n💼 Monthly Projections:\n`);
    console.log(`  Expected Volume:      ${this.config.drinksPerMonth} drinks`);
    console.log(`  Revenue:              $${(summary.avgPrice * this.config.drinksPerMonth).toLocaleString()}`);
    console.log(`  Profit:               $${((summary.avgPrice - summary.avgCost) * this.config.drinksPerMonth).toLocaleString()}`);
    console.log(`\n✅ Costing analysis complete!\n`);
  }
}

async function main() {
  console.log('☕ Coffee Vault - Recipe Costing Calculator\n');

  const calculator = new RecipeCostingCalculator();

  calculator.setIngredientPrices();
  await calculator.loadRecipes();

  const summary = await calculator.generateReport();
  calculator.printSummary(summary);
}

main().catch(console.error);
