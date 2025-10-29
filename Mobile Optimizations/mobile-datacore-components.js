/**
 * Mobile-Optimized Datacore Components
 * Version: 1.0.0
 * Purpose: Transform desktop table views into mobile-friendly card layouts
 *
 * Features:
 * - Automatic table-to-card transformation on mobile
 * - Touch-optimized interaction patterns
 * - Expandable detail views
 * - Swipe actions for common operations
 * - Responsive chart reorientation
 * - Performance-optimized rendering
 */

(function() {
  'use strict';

  // ============================================
  // MOBILE DETECTION
  // ============================================

  const MobileDetect = {
    isMobile: () => window.innerWidth <= 767,
    isTablet: () => window.innerWidth >= 768 && window.innerWidth <= 1023,
    isDesktop: () => window.innerWidth >= 1024,

    // Check if touch device
    isTouch: () => {
      return (('ontouchstart' in window) ||
              (navigator.maxTouchPoints > 0) ||
              (navigator.msMaxTouchPoints > 0));
    },

    // Get viewport size
    getViewportWidth: () => window.innerWidth,
    getViewportHeight: () => window.innerHeight
  };

  // ============================================
  // CARD VIEW RENDERER
  // ============================================

  class MobileCardRenderer {
    constructor(data, options = {}) {
      this.data = data;
      this.options = {
        showRating: true,
        showDate: true,
        showActions: false,
        expandable: true,
        swipeable: false,
        ...options
      };
    }

    /**
     * Render coffee log as mobile card
     */
    renderLogCard(log) {
      const rating = this.renderRating(log.rating || 0);
      const date = this.formatDate(log.date);

      return `
        <div class="mobile-log-card" data-id="${log.id || ''}" ${this.options.swipeable ? 'data-swipeable="true"' : ''}>
          <div class="mobile-log-card-header">
            <div class="mobile-log-card-title">${this.escapeHtml(log.beans || 'Unknown Beans')}</div>
            <div class="mobile-log-card-rating">${rating}</div>
          </div>

          <div class="mobile-log-card-meta">
            ${log.date ? `<div class="mobile-log-card-meta-item">📅 ${date}</div>` : ''}
            ${log['brew-method'] ? `<div class="mobile-log-card-meta-item">☕ ${this.formatBrewMethod(log['brew-method'])}</div>` : ''}
            ${log.origin ? `<div class="mobile-log-card-meta-item">🌍 ${log.origin}</div>` : ''}
          </div>

          ${log['flavor-notes'] && log['flavor-notes'].length > 0 ? `
            <div class="mobile-log-card-body">
              <strong>Flavors:</strong> ${log['flavor-notes'].join(', ')}
            </div>
          ` : ''}

          ${this.options.expandable ? this.renderExpandableDetails(log) : ''}

          ${this.options.showActions ? this.renderActions(log) : ''}
        </div>
      `;
    }

    /**
     * Render expandable details section
     */
    renderExpandableDetails(log) {
      return `
        <div class="mobile-collapsible">
          <div class="mobile-collapsible-header" onclick="this.parentElement.classList.toggle('expanded')">
            <span class="mobile-collapsible-title">View Details</span>
            <span class="mobile-collapsible-icon">▼</span>
          </div>
          <div class="mobile-collapsible-content">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; font-size: 14px;">
              ${log['grind-size'] ? `<div><strong>Grind:</strong><br>${log['grind-size']}</div>` : ''}
              ${log['water-temp'] ? `<div><strong>Water:</strong><br>${log['water-temp']}°F</div>` : ''}
              ${log['brew-time'] ? `<div><strong>Time:</strong><br>${log['brew-time']} min</div>` : ''}
              ${log.ratio ? `<div><strong>Ratio:</strong><br>${log.ratio}</div>` : ''}
              ${log.roaster ? `<div><strong>Roaster:</strong><br>${log.roaster}</div>` : ''}
              ${log['roast-level'] ? `<div><strong>Roast:</strong><br>${this.formatRoastLevel(log['roast-level'])}</div>` : ''}
            </div>
            ${log.notes ? `<div style="margin-top: 12px;"><strong>Notes:</strong><br>${log.notes}</div>` : ''}
          </div>
        </div>
      `;
    }

    /**
     * Render action buttons
     */
    renderActions(log) {
      return `
        <div class="mobile-log-card-footer">
          <button class="coffee-button outline" onclick="window.location.href='obsidian://open?vault=${encodeURIComponent(log.vault || 'Coffee Vault')}&file=${encodeURIComponent(log.file || '')}'">
            Open
          </button>
          <button class="coffee-button outline" onclick="navigator.share({title: '${this.escapeHtml(log.beans)}', text: 'Rating: ${log.rating}/5'})">
            Share
          </button>
        </div>
      `;
    }

    /**
     * Render star rating
     */
    renderRating(rating) {
      const fullStars = Math.floor(rating);
      const hasHalf = (rating % 1) >= 0.5;
      let stars = '';

      for (let i = 0; i < fullStars; i++) {
        stars += '⭐';
      }
      if (hasHalf) {
        stars += '✨';
      }

      return stars || '☆';
    }

    /**
     * Format helpers
     */
    formatDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    formatBrewMethod(method) {
      const methods = {
        'pour-over': 'Pour Over',
        'french-press': 'French Press',
        'espresso': 'Espresso',
        'aeropress': 'Aeropress',
        'cold-brew': 'Cold Brew',
        'moka-pot': 'Moka Pot',
        'chemex': 'Chemex',
        'siphon': 'Siphon'
      };
      return methods[method] || method;
    }

    formatRoastLevel(level) {
      const levels = {
        'light': '☕ Light',
        'medium-light': '☕☕ Medium-Light',
        'medium': '☕☕☕ Medium',
        'medium-dark': '☕☕☕☕ Medium-Dark',
        'dark': '☕☕☕☕☕ Dark'
      };
      return levels[level] || level;
    }

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    /**
     * Render collection of cards
     */
    renderCollection(logs) {
      if (!logs || logs.length === 0) {
        return '<div style="padding: 40px; text-align: center; color: var(--text-muted);">No logs found</div>';
      }

      return `
        <div class="mobile-card-view">
          ${logs.map(log => this.renderLogCard(log)).join('')}
        </div>
      `;
    }
  }

  // ============================================
  // BEAN PROFILE CARD RENDERER
  // ============================================

  class BeanCardRenderer {
    renderBeanCard(bean) {
      const statusBadge = this.getStatusBadge(bean.status);
      const daysSinceRoast = bean['roast-date'] ? this.calculateDaysSince(bean['roast-date']) : null;

      return `
        <div class="mobile-log-card">
          <div class="mobile-log-card-header">
            <div class="mobile-log-card-title">🫘 ${bean['bean-name'] || 'Unknown Bean'}</div>
            <div>${statusBadge}</div>
          </div>

          <div class="mobile-log-card-meta">
            ${bean.roaster ? `<div class="mobile-log-card-meta-item">☕ ${bean.roaster}</div>` : ''}
            ${bean.origin ? `<div class="mobile-log-card-meta-item">🌍 ${bean.origin}</div>` : ''}
            ${bean['roast-level'] ? `<div class="mobile-log-card-meta-item">${bean['roast-level']}</div>` : ''}
          </div>

          ${bean.price && bean.weight ? `
            <div class="mobile-stat-grid" style="margin-top: 12px;">
              <div class="mobile-stat-card">
                <div class="mobile-stat-value">$${bean.price}</div>
                <div class="mobile-stat-label">${bean.weight}g</div>
              </div>
              ${daysSinceRoast !== null ? `
                <div class="mobile-stat-card">
                  <div class="mobile-stat-value">${daysSinceRoast}</div>
                  <div class="mobile-stat-label">Days Old</div>
                </div>
              ` : ''}
            </div>
          ` : ''}

          ${bean['flavor-profile'] && bean['flavor-profile'].length > 0 ? `
            <div class="mobile-log-card-body" style="margin-top: 12px;">
              <strong>Flavors:</strong> ${bean['flavor-profile'].join(', ')}
            </div>
          ` : ''}
        </div>
      `;
    }

    getStatusBadge(status) {
      const badges = {
        'active': '<span class="coffee-badge active">Active</span>',
        'finished': '<span class="coffee-badge finished">Finished</span>',
        'aging': '<span class="coffee-badge aging">Aging</span>',
        'archived': '<span class="coffee-badge">Archived</span>'
      };
      return badges[status] || '';
    }

    calculateDaysSince(dateStr) {
      const date = new Date(dateStr);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }

    renderCollection(beans) {
      if (!beans || beans.length === 0) {
        return '<div style="padding: 40px; text-align: center; color: var(--text-muted);">No beans found</div>';
      }

      return `
        <div class="mobile-card-view">
          ${beans.map(bean => this.renderBeanCard(bean)).join('')}
        </div>
      `;
    }
  }

  // ============================================
  // LIST VIEW RENDERER
  // ============================================

  class MobileListRenderer {
    renderListItem(item, options = {}) {
      const icon = options.icon || '☕';
      const title = item.title || item.name || 'Untitled';
      const subtitle = item.subtitle || item.date || '';
      const actionIcon = options.actionIcon || '›';

      return `
        <li class="mobile-list-item" data-id="${item.id || ''}" onclick="${options.onClick || ''}">
          <div class="mobile-list-item-icon">${icon}</div>
          <div class="mobile-list-item-content">
            <div class="mobile-list-item-title">${title}</div>
            ${subtitle ? `<div class="mobile-list-item-subtitle">${subtitle}</div>` : ''}
          </div>
          <div class="mobile-list-item-action">${actionIcon}</div>
        </li>
      `;
    }

    renderList(items, options = {}) {
      if (!items || items.length === 0) {
        return '<div style="padding: 40px; text-align: center; color: var(--text-muted);">No items found</div>';
      }

      return `
        <ul class="mobile-list">
          ${items.map(item => this.renderListItem(item, options)).join('')}
        </ul>
      `;
    }
  }

  // ============================================
  // STATS CARD RENDERER
  // ============================================

  class StatsRenderer {
    renderStatCard(label, value, trend = null) {
      return `
        <div class="mobile-stat-card">
          <div class="mobile-stat-value">${value}</div>
          <div class="mobile-stat-label">${label}</div>
          ${trend ? `<div class="mobile-stat-trend ${trend > 0 ? 'up' : 'down'}">${trend > 0 ? '↑' : '↓'} ${Math.abs(trend)}%</div>` : ''}
        </div>
      `;
    }

    renderStatGrid(stats) {
      if (!stats || stats.length === 0) return '';

      return `
        <div class="mobile-stat-grid">
          ${stats.map(stat => this.renderStatCard(stat.label, stat.value, stat.trend)).join('')}
        </div>
      `;
    }
  }

  // ============================================
  // FILTER BAR RENDERER
  // ============================================

  class FilterBarRenderer {
    renderFilterChip(label, value, active = false) {
      return `
        <button
          class="mobile-filter-chip ${active ? 'active' : ''}"
          data-filter="${value}"
          onclick="this.classList.toggle('active')"
        >
          ${label}
        </button>
      `;
    }

    renderFilterBar(filters) {
      if (!filters || filters.length === 0) return '';

      return `
        <div class="mobile-filter-bar">
          ${filters.map(filter => this.renderFilterChip(filter.label, filter.value, filter.active)).join('')}
        </div>
      `;
    }
  }

  // ============================================
  // SEARCH BAR RENDERER
  // ============================================

  class SearchBarRenderer {
    render(placeholder = 'Search coffee logs...', onInput = '') {
      return `
        <div class="mobile-search-container">
          <div class="mobile-search-icon">🔍</div>
          <input
            type="search"
            class="mobile-search-input"
            placeholder="${placeholder}"
            oninput="${onInput}"
          />
          <button class="mobile-search-clear" onclick="this.previousElementSibling.value = ''; this.previousElementSibling.dispatchEvent(new Event('input'))">✕</button>
        </div>
      `;
    }
  }

  // ============================================
  // RESPONSIVE CHART ADAPTER
  // ============================================

  class ResponsiveChartAdapter {
    /**
     * Adapt chart configuration for mobile
     */
    adaptChartConfig(config, chartType) {
      if (!MobileDetect.isMobile()) return config;

      const mobileConfig = JSON.parse(JSON.stringify(config));

      // Common mobile adaptations
      mobileConfig.options = mobileConfig.options || {};
      mobileConfig.options.responsive = true;
      mobileConfig.options.maintainAspectRatio = false;

      // Font sizes
      if (mobileConfig.options.plugins) {
        if (mobileConfig.options.plugins.legend) {
          mobileConfig.options.plugins.legend.labels = {
            ...mobileConfig.options.plugins.legend.labels,
            font: { size: 12 }
          };
        }
        if (mobileConfig.options.plugins.title) {
          mobileConfig.options.plugins.title.font = {
            ...mobileConfig.options.plugins.title.font,
            size: 14
          };
        }
      }

      // Axis labels
      if (mobileConfig.options.scales) {
        Object.keys(mobileConfig.options.scales).forEach(axis => {
          mobileConfig.options.scales[axis].ticks = {
            ...mobileConfig.options.scales[axis].ticks,
            font: { size: 10 }
          };
        });
      }

      // Chart-specific adaptations
      switch (chartType) {
        case 'bar':
          // Reduce bar thickness
          if (mobileConfig.data.datasets) {
            mobileConfig.data.datasets.forEach(dataset => {
              dataset.barThickness = 20;
            });
          }
          break;

        case 'line':
          // Reduce point radius
          if (mobileConfig.data.datasets) {
            mobileConfig.data.datasets.forEach(dataset => {
              dataset.pointRadius = 3;
              dataset.pointHoverRadius = 5;
            });
          }
          break;

        case 'pie':
        case 'doughnut':
          // Move legend to bottom
          if (mobileConfig.options.plugins && mobileConfig.options.plugins.legend) {
            mobileConfig.options.plugins.legend.position = 'bottom';
          }
          break;
      }

      return mobileConfig;
    }

    /**
     * Create scrollable container for wide charts
     */
    wrapChartForMobile(chartElement) {
      if (!MobileDetect.isMobile()) return chartElement;

      const wrapper = document.createElement('div');
      wrapper.className = 'mobile-chart-scroll';
      wrapper.style.maxHeight = '300px';
      wrapper.appendChild(chartElement);
      return wrapper;
    }
  }

  // ============================================
  // AUTO-TRANSFORM UTILITY
  // ============================================

  class AutoTransform {
    /**
     * Automatically transform tables to cards on mobile
     */
    static transformTables() {
      if (!MobileDetect.isMobile()) return;

      const tables = document.querySelectorAll('.coffee-table');
      tables.forEach(table => {
        const data = this.extractTableData(table);
        const renderer = new MobileCardRenderer(data);
        const cards = renderer.renderCollection(data);

        // Create card container
        const container = document.createElement('div');
        container.innerHTML = cards;
        container.className = 'mobile-card-view';

        // Replace table
        table.style.display = 'none';
        table.parentNode.insertBefore(container, table);
      });
    }

    /**
     * Extract data from HTML table
     */
    static extractTableData(table) {
      const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());
      const rows = Array.from(table.querySelectorAll('tbody tr'));

      return rows.map(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        const obj = {};
        headers.forEach((header, index) => {
          obj[header.toLowerCase()] = cells[index]?.textContent.trim() || '';
        });
        return obj;
      });
    }

    /**
     * Setup resize listener
     */
    static setupResizeListener() {
      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          this.transformTables();
        }, 250);
      });
    }
  }

  // ============================================
  // EXPORT API
  // ============================================

  window.MobileCoffeeComponents = {
    // Utilities
    MobileDetect,

    // Renderers
    MobileCardRenderer,
    BeanCardRenderer,
    MobileListRenderer,
    StatsRenderer,
    FilterBarRenderer,
    SearchBarRenderer,

    // Adapters
    ResponsiveChartAdapter,

    // Auto-transform
    AutoTransform,

    // Initialize mobile optimizations
    init: function() {
      if (MobileDetect.isMobile() || MobileDetect.isTablet()) {
        AutoTransform.transformTables();
        AutoTransform.setupResizeListener();
        console.log('Mobile Coffee Components initialized');
      }
    }
  };

  // Auto-initialize when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.MobileCoffeeComponents.init();
    });
  } else {
    window.MobileCoffeeComponents.init();
  }

})();

// ============================================
// USAGE EXAMPLES
// ============================================

/*
// Example 1: Render coffee logs as cards
const logs = [
  {
    id: '1',
    beans: 'Ethiopian Yirgacheffe',
    rating: 4.5,
    date: '2025-10-20',
    'brew-method': 'pour-over',
    origin: 'Ethiopia',
    'flavor-notes': ['Blueberry', 'Floral', 'Citrus'],
    roaster: 'Blue Bottle',
    'grind-size': 'medium-fine',
    'water-temp': 200,
    'brew-time': 3.5,
    ratio: '1:16'
  }
];

const renderer = new MobileCoffeeComponents.MobileCardRenderer(logs);
const html = renderer.renderCollection(logs);
document.querySelector('.container').innerHTML = html;

// Example 2: Render stats grid
const stats = [
  { label: 'Total Logs', value: '156', trend: 12 },
  { label: 'Avg Rating', value: '4.2', trend: 5 },
  { label: 'This Month', value: '23', trend: -3 },
  { label: 'Spent', value: '$285', trend: 8 }
];

const statsRenderer = new MobileCoffeeComponents.StatsRenderer();
const statsHtml = statsRenderer.renderStatGrid(stats);
document.querySelector('.stats').innerHTML = statsHtml;

// Example 3: Adapt chart for mobile
const chartConfig = {
  type: 'bar',
  data: { ... },
  options: { ... }
};

const adapter = new MobileCoffeeComponents.ResponsiveChartAdapter();
const mobileConfig = adapter.adaptChartConfig(chartConfig, 'bar');

// Example 4: Render filter bar
const filters = [
  { label: 'All', value: 'all', active: true },
  { label: 'Pour Over', value: 'pour-over', active: false },
  { label: 'Espresso', value: 'espresso', active: false },
  { label: '4+ Stars', value: 'high-rated', active: false }
];

const filterRenderer = new MobileCoffeeComponents.FilterBarRenderer();
const filterHtml = filterRenderer.renderFilterBar(filters);
document.querySelector('.filters').innerHTML = filterHtml;
*/
