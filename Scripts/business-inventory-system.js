#!/usr/bin/env node

/**
 * Business Inventory System for Coffee Vault
 * Enterprise-grade inventory tracking for coffee businesses
 *
 * Features:
 * - Multi-category inventory (beans, equipment, supplies)
 * - Automated alerts (low stock, expiration, maintenance)
 * - Cost tracking and valuation
 * - Supplier management
 * - Reorder point calculations
 * - Inventory reports and analytics
 */

import { glob } from 'glob';
import matter from 'gray-matter';
import fs from 'fs/promises';
import path from 'path';

const VAULT_ROOT = process.cwd();

const BUSINESS_CONFIG = {
  // Reorder thresholds
  beans: {
    minimumKg: 2.0,
    reorderPoint: 5.0,
    optimalStock: 15.0,
  },
  equipment: {
    maintenanceIntervalDays: 90,
    warrantyAlertDays: 60,
  },
  supplies: {
    cupsMinimum: 100,
    lidsMinimum: 100,
    sleevesMinimum: 50,
  },

  // Alert priorities
  alertLevels: {
    critical: 'Immediate action required',
    high: 'Action required within 7 days',
    medium: 'Action required within 30 days',
    low: 'Informational',
  },
};

class BusinessInventorySystem {
  constructor(config = BUSINESS_CONFIG) {
    this.config = config;
    this.inventory = {
      beans: [],
      equipment: [],
      supplies: [],
    };
    this.alerts = [];
    this.stats = {
      totalValue: 0,
      totalItems: 0,
      categoryCounts: {},
      alertCounts: { critical: 0, high: 0, medium: 0, low: 0 },
    };
  }

  async loadInventory() {
    console.log('📦 Loading business inventory...');

    await this.loadBeans();
    await this.loadEquipment();
    await this.loadSupplies();

    console.log(`✓ Loaded ${this.inventory.beans.length} bean items`);
    console.log(`✓ Loaded ${this.inventory.equipment.length} equipment items`);
    console.log(`✓ Loaded ${this.inventory.supplies.length} supply items`);
  }

  async loadBeans() {
    const files = await glob('Beans/**/*.md', {
      cwd: VAULT_ROOT,
      ignore: ['**/00-*.md', '**/_*.md'],
    });

    for (const file of files) {
      try {
        const content = await fs.readFile(path.join(VAULT_ROOT, file), 'utf-8');
        const { data } = matter(content);

        if (data.type === 'bean' || file.startsWith('Beans/')) {
          this.inventory.beans.push({
            id: path.basename(file, '.md'),
            name: data.name || path.basename(file, '.md'),
            category: 'beans',
            origin: data.origin || 'Unknown',
            roaster: data.roaster || 'Unknown',
            quantity: parseFloat(data.quantity) || 0,
            unit: 'kg',
            costPerUnit: parseFloat(data.costPerKg) || parseFloat(data.price) / 0.34 || 0,
            totalCost: (parseFloat(data.quantity) || 0) * (parseFloat(data.costPerKg) || 0),
            purchaseDate: data.purchaseDate || data.dateAcquired || null,
            roastDate: data.roastDate || null,
            expirationDate: data.expirationDate || this.calculateExpirationDate(data.roastDate),
            supplier: data.supplier || data.roaster || null,
            location: data.location || 'Main Storage',
            sku: data.sku || null,
            filePath: file,
          });
        }
      } catch (error) {
        // Skip invalid files
      }
    }
  }

  async loadEquipment() {
    const files = await glob('Equipment/**/*.md', {
      cwd: VAULT_ROOT,
      ignore: ['**/00-*.md'],
    });

    for (const file of files) {
      try {
        const content = await fs.readFile(path.join(VAULT_ROOT, file), 'utf-8');
        const { data } = matter(content);

        this.inventory.equipment.push({
          id: path.basename(file, '.md'),
          name: data.name || path.basename(file, '.md'),
          category: 'equipment',
          subcategory: data.category || 'general',
          purchaseDate: data.purchaseDate || null,
          purchaseCost: parseFloat(data.purchaseCost) || parseFloat(data.price) || 0,
          currentValue: this.calculateDepreciatedValue(
            parseFloat(data.purchaseCost) || 0,
            data.purchaseDate
          ),
          lastMaintenance: data.lastMaintenance || null,
          nextMaintenance: data.nextMaintenance || this.calculateNextMaintenance(data.lastMaintenance),
          warrantyExpires: data.warrantyExpires || null,
          condition: data.condition || 'good',
          manufacturer: data.manufacturer || data.brand || null,
          model: data.model || null,
          serialNumber: data.serialNumber || null,
          location: data.location || 'Main Location',
          filePath: file,
        });
      } catch (error) {
        // Skip invalid files
      }
    }
  }

  async loadSupplies() {
    // Create synthetic supply entries from business data
    this.inventory.supplies = [
      {
        id: 'cups-12oz',
        name: '12oz Paper Cups',
        category: 'supplies',
        subcategory: 'disposables',
        quantity: 0,
        unit: 'units',
        costPerUnit: 0.15,
        reorderPoint: this.config.supplies.cupsMinimum,
        location: 'Supply Closet',
      },
      {
        id: 'cups-16oz',
        name: '16oz Paper Cups',
        category: 'supplies',
        subcategory: 'disposables',
        quantity: 0,
        unit: 'units',
        costPerUnit: 0.18,
        reorderPoint: this.config.supplies.cupsMinimum,
        location: 'Supply Closet',
      },
      {
        id: 'lids',
        name: 'Cup Lids',
        category: 'supplies',
        subcategory: 'disposables',
        quantity: 0,
        unit: 'units',
        costPerUnit: 0.05,
        reorderPoint: this.config.supplies.lidsMinimum,
        location: 'Supply Closet',
      },
      {
        id: 'sleeves',
        name: 'Cup Sleeves',
        category: 'supplies',
        subcategory: 'disposables',
        quantity: 0,
        unit: 'units',
        costPerUnit: 0.03,
        reorderPoint: this.config.supplies.sleevesMinimum,
        location: 'Supply Closet',
      },
    ];
  }

  calculateExpirationDate(roastDate) {
    if (!roastDate) return null;
    const date = new Date(roastDate);
    date.setDate(date.getDate() + 60); // 60 days after roast
    return date.toISOString().split('T')[0];
  }

  calculateNextMaintenance(lastMaintenance) {
    if (!lastMaintenance) return null;
    const date = new Date(lastMaintenance);
    date.setDate(date.getDate() + this.config.equipment.maintenanceIntervalDays);
    return date.toISOString().split('T')[0];
  }

  calculateDepreciatedValue(purchaseCost, purchaseDate, depreciationRate = 0.20) {
    if (!purchaseDate || !purchaseCost) return purchaseCost;

    const now = new Date();
    const purchase = new Date(purchaseDate);
    const yearsOwned = (now - purchase) / (1000 * 60 * 60 * 24 * 365);

    // Straight-line depreciation
    const currentValue = purchaseCost * Math.pow(1 - depreciationRate, yearsOwned);
    return Math.max(0, currentValue);
  }

  analyzeInventory() {
    console.log('\n🔍 Analyzing inventory...');

    this.analyzeBeans();
    this.analyzeEquipment();
    this.analyzeSupplies();
    this.calculateStats();

    console.log(`✓ Generated ${this.alerts.length} alerts`);
  }

  analyzeBeans() {
    for (const bean of this.inventory.beans) {
      // Low stock alert
      if (bean.quantity > 0 && bean.quantity < this.config.beans.minimumKg) {
        this.addAlert({
          level: bean.quantity < this.config.beans.minimumKg / 2 ? 'critical' : 'high',
          category: 'beans',
          item: bean.name,
          type: 'low_stock',
          message: `Low stock: ${bean.quantity.toFixed(2)}kg remaining`,
          action: `Reorder to reach ${this.config.beans.optimalStock}kg`,
          quantity: bean.quantity,
          reorderQuantity: this.config.beans.optimalStock - bean.quantity,
        });
      }

      // Expiration alert
      if (bean.expirationDate) {
        const daysUntilExpiration = this.getDaysUntil(bean.expirationDate);
        if (daysUntilExpiration >= 0 && daysUntilExpiration <= 14) {
          this.addAlert({
            level: daysUntilExpiration <= 7 ? 'high' : 'medium',
            category: 'beans',
            item: bean.name,
            type: 'expiring',
            message: `Expires in ${daysUntilExpiration} days`,
            action: 'Use soon or mark for clearance',
            daysRemaining: daysUntilExpiration,
          });
        }
      }

      // Staleness alert (based on roast date)
      if (bean.roastDate) {
        const daysSinceRoast = this.getDaysSince(bean.roastDate);
        if (daysSinceRoast > 35 && bean.quantity > 0) {
          this.addAlert({
            level: 'medium',
            category: 'beans',
            item: bean.name,
            type: 'stale',
            message: `${daysSinceRoast} days since roast date`,
            action: 'Consider discounting or alternative use',
            daysSinceRoast,
          });
        }
      }
    }
  }

  analyzeEquipment() {
    for (const item of this.inventory.equipment) {
      // Maintenance alert
      if (item.nextMaintenance) {
        const daysUntilMaintenance = this.getDaysUntil(item.nextMaintenance);
        if (daysUntilMaintenance <= 14) {
          this.addAlert({
            level: daysUntilMaintenance <= 0 ? 'high' : 'medium',
            category: 'equipment',
            item: item.name,
            type: 'maintenance',
            message: daysUntilMaintenance <= 0
              ? `Maintenance overdue by ${Math.abs(daysUntilMaintenance)} days`
              : `Maintenance due in ${daysUntilMaintenance} days`,
            action: 'Schedule service appointment',
            daysUntilDue: daysUntilMaintenance,
          });
        }
      }

      // Warranty alert
      if (item.warrantyExpires) {
        const daysUntilExpiration = this.getDaysUntil(item.warrantyExpires);
        if (daysUntilExpiration >= 0 && daysUntilExpiration <= this.config.equipment.warrantyAlertDays) {
          this.addAlert({
            level: daysUntilExpiration <= 30 ? 'medium' : 'low',
            category: 'equipment',
            item: item.name,
            type: 'warranty',
            message: `Warranty expires in ${daysUntilExpiration} days`,
            action: 'Review extended warranty options',
            daysRemaining: daysUntilExpiration,
          });
        }
      }

      // Condition alert
      if (item.condition === 'poor' || item.condition === 'needs-repair') {
        this.addAlert({
          level: 'high',
          category: 'equipment',
          item: item.name,
          type: 'condition',
          message: `Equipment condition: ${item.condition}`,
          action: 'Repair or replace',
        });
      }
    }
  }

  analyzeSupplies() {
    for (const supply of this.inventory.supplies) {
      if (supply.quantity < supply.reorderPoint) {
        this.addAlert({
          level: supply.quantity === 0 ? 'critical' : 'high',
          category: 'supplies',
          item: supply.name,
          type: 'low_stock',
          message: `${supply.quantity} ${supply.unit} remaining`,
          action: `Reorder to ${supply.reorderPoint * 3} ${supply.unit}`,
          quantity: supply.quantity,
          reorderQuantity: (supply.reorderPoint * 3) - supply.quantity,
        });
      }
    }
  }

  addAlert(alert) {
    this.alerts.push(alert);
    this.stats.alertCounts[alert.level]++;
  }

  getDaysUntil(dateString) {
    const target = new Date(dateString);
    const now = new Date();
    const diffTime = target - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDaysSince(dateString) {
    const past = new Date(dateString);
    const now = new Date();
    const diffTime = now - past;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  calculateStats() {
    // Calculate total value
    let beanValue = this.inventory.beans.reduce((sum, b) => sum + (b.totalCost || 0), 0);
    let equipmentValue = this.inventory.equipment.reduce((sum, e) => sum + (e.currentValue || 0), 0);
    let suppliesValue = this.inventory.supplies.reduce((sum, s) => sum + (s.quantity * s.costPerUnit), 0);

    this.stats.totalValue = beanValue + equipmentValue + suppliesValue;
    this.stats.totalItems = this.inventory.beans.length + this.inventory.equipment.length + this.inventory.supplies.length;

    this.stats.categoryCounts = {
      beans: this.inventory.beans.length,
      equipment: this.inventory.equipment.length,
      supplies: this.inventory.supplies.length,
    };

    this.stats.values = {
      beans: beanValue,
      equipment: equipmentValue,
      supplies: suppliesValue,
    };
  }

  async generateReport() {
    console.log('\n📊 Generating business inventory report...\n');

    const reportPath = path.join(VAULT_ROOT, 'Business', 'business-inventory-report.md');
    await fs.mkdir(path.join(VAULT_ROOT, 'Business'), { recursive: true });

    let content = `---
type: business-report
category: inventory
generated: ${new Date().toISOString().split('T')[0]}
---

# Business Inventory Report

**Generated**: ${new Date().toLocaleString()}
**Total Items**: ${this.stats.totalItems}
**Total Value**: $${this.stats.totalValue.toFixed(2)}

---

## Executive Summary

- **Bean Inventory**: ${this.stats.categoryCounts.beans} items, $${this.stats.values.beans.toFixed(2)} value
- **Equipment Assets**: ${this.stats.categoryCounts.equipment} items, $${this.stats.values.equipment.toFixed(2)} value
- **Supplies Stock**: ${this.stats.categoryCounts.supplies} items, $${this.stats.values.supplies.toFixed(2)} value
- **Active Alerts**: ${this.alerts.length} (${this.stats.alertCounts.critical} critical, ${this.stats.alertCounts.high} high priority)

---

## 🚨 Priority Alerts

`;

    // Group alerts by level
    const critical = this.alerts.filter(a => a.level === 'critical');
    const high = this.alerts.filter(a => a.level === 'high');
    const medium = this.alerts.filter(a => a.level === 'medium');
    const low = this.alerts.filter(a => a.level === 'low');

    if (critical.length > 0) {
      content += `\n### 🔴 Critical (${critical.length})\n\n`;
      critical.forEach(alert => {
        content += `- **${alert.item}** [${alert.category}]: ${alert.message}\n`;
        content += `  *Action*: ${alert.action}\n\n`;
      });
    }

    if (high.length > 0) {
      content += `\n### 🟠 High Priority (${high.length})\n\n`;
      high.forEach(alert => {
        content += `- **${alert.item}** [${alert.category}]: ${alert.message}\n`;
        content += `  *Action*: ${alert.action}\n\n`;
      });
    }

    if (medium.length > 0) {
      content += `\n### 🟡 Medium Priority (${medium.length})\n\n`;
      medium.forEach(alert => {
        content += `- **${alert.item}**: ${alert.message} - ${alert.action}\n`;
      });
      content += `\n`;
    }

    if (low.length > 0) {
      content += `\n### ℹ️ Informational (${low.length})\n\n`;
      low.forEach(alert => {
        content += `- **${alert.item}**: ${alert.message}\n`;
      });
      content += `\n`;
    }

    if (this.alerts.length === 0) {
      content += `✅ No active alerts - inventory status is healthy\n\n`;
    }

    content += `---

## 📦 Bean Inventory

| Bean | Origin | Roaster | Quantity | Value | Status |
|------|--------|---------|----------|-------|--------|
`;

    for (const bean of this.inventory.beans) {
      const status = bean.quantity < this.config.beans.minimumKg ? '⚠️ Low' :
                     bean.quantity < this.config.beans.reorderPoint ? '🟡 Reorder' : '✅ OK';
      content += `| ${bean.name} | ${bean.origin} | ${bean.roaster} | ${bean.quantity.toFixed(2)}kg | $${bean.totalCost.toFixed(2)} | ${status} |\n`;
    }

    const totalBeanKg = this.inventory.beans.reduce((sum, b) => sum + b.quantity, 0);
    content += `\n**Total Bean Stock**: ${totalBeanKg.toFixed(2)} kg ($${this.stats.values.beans.toFixed(2)})\n`;

    content += `\n---

## 🔧 Equipment Assets

| Equipment | Category | Purchase Cost | Current Value | Next Maintenance |
|-----------|----------|---------------|---------------|------------------|
`;

    for (const item of this.inventory.equipment) {
      content += `| ${item.name} | ${item.subcategory} | $${item.purchaseCost.toFixed(2)} | $${item.currentValue.toFixed(2)} | ${item.nextMaintenance || 'N/A'} |\n`;
    }

    content += `\n**Total Equipment Value**: $${this.stats.values.equipment.toFixed(2)}\n`;

    content += `\n---

## 📋 Reorder Recommendations

`;

    const reorderItems = this.alerts.filter(a => a.type === 'low_stock');
    if (reorderItems.length > 0) {
      reorderItems.forEach(item => {
        content += `- **${item.item}**: Reorder ${item.reorderQuantity?.toFixed(2) || 'N/A'} units\n`;
      });
    } else {
      content += `✅ All items adequately stocked\n`;
    }

    content += `\n---

*Generated by Coffee Vault Business Inventory System v10.1*
`;

    await fs.writeFile(reportPath, content, 'utf-8');
    console.log(`✓ Report saved to ${reportPath}`);

    return this.stats;
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('        Business Inventory Summary');
    console.log('='.repeat(60));
    console.log(`\n📊 Overview:\n`);
    console.log(`  Total Items:          ${this.stats.totalItems}`);
    console.log(`  Total Value:          $${this.stats.totalValue.toFixed(2)}`);
    console.log(`  Beans:                ${this.stats.categoryCounts.beans} ($${this.stats.values.beans.toFixed(2)})`);
    console.log(`  Equipment:            ${this.stats.categoryCounts.equipment} ($${this.stats.values.equipment.toFixed(2)})`);
    console.log(`  Supplies:             ${this.stats.categoryCounts.supplies} ($${this.stats.values.supplies.toFixed(2)})`);
    console.log(`\n🚨 Alerts:\n`);
    console.log(`  Critical:             ${this.stats.alertCounts.critical}`);
    console.log(`  High:                 ${this.stats.alertCounts.high}`);
    console.log(`  Medium:               ${this.stats.alertCounts.medium}`);
    console.log(`  Low:                  ${this.stats.alertCounts.low}`);
    console.log(`\n✅ Inventory analysis complete!\n`);
  }
}

async function main() {
  console.log('☕ Coffee Vault - Business Inventory System\n');

  const system = new BusinessInventorySystem();

  await system.loadInventory();
  system.analyzeInventory();
  await system.generateReport();
  system.printSummary();
}

main().catch(console.error);
