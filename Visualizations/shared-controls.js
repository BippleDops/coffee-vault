/**
 * Coffee Vault 7.0 - Shared Visualization Controls
 * Version: 1.0.0
 *
 * Provides unified control panel, data loading, export, accessibility,
 * and theme management for all Coffee Vault visualizations.
 */

// ============================================================================
// DATA LOADER - Fetch real data from JSON files
// ============================================================================

class DataLoader {
  static basePath = '../Data/extracted/';
  static cache = new Map();
  static cacheExpiry = 5 * 60 * 1000; // 5 minutes

  /**
   * Load coffee logs with optional filtering
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} Coffee log entries
   */
  static async loadCoffeeLogs(filters = {}) {
    const data = await this._fetchJSON('coffee-logs.json');
    return this._applyFilters(data, filters);
  }

  /**
   * Load bean profiles
   * @returns {Promise<Array>} Bean profiles
   */
  static async loadBeans() {
    return await this._fetchJSON('beans.json');
  }

  /**
   * Load origin profiles
   * @returns {Promise<Array>} Origin data
   */
  static async loadOrigins() {
    return await this._fetchJSON('origins.json');
  }

  /**
   * Load recipes
   * @returns {Promise<Array>} Recipe data
   */
  static async loadRecipes() {
    return await this._fetchJSON('recipes.json');
  }

  /**
   * Load equipment data
   * @returns {Promise<Array>} Equipment profiles
   */
  static async loadEquipment() {
    return await this._fetchJSON('equipment.json');
  }

  /**
   * Load brewing methods
   * @returns {Promise<Array>} Brewing methods
   */
  static async loadMethods() {
    return await this._fetchJSON('methods.json');
  }

  /**
   * Internal fetch with caching and fallback
   * @private
   */
  static async _fetchJSON(filename) {
    const cacheKey = filename;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      const response = await fetch(this.basePath + filename);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();

      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.warn(`Failed to load ${filename}, using fallback data:`, error);
      return this._getFallbackData(filename);
    }
  }

  /**
   * Get fallback sample data when real data unavailable
   * @private
   */
  static _getFallbackData(filename) {
    const fallbacks = {
      'coffee-logs.json': this._generateSampleLogs(),
      'beans.json': this._generateSampleBeans(),
      'origins.json': this._generateSampleOrigins(),
      'recipes.json': this._generateSampleRecipes(),
      'equipment.json': this._generateSampleEquipment(),
      'methods.json': this._generateSampleMethods()
    };

    return fallbacks[filename] || [];
  }

  static _generateSampleLogs() {
    return [
      { id: 1, date: '2024-11-01', beans: 'Ethiopian Yirgacheffe', method: 'V60', rating: 4.7, acidity: 9, body: 4, sweetness: 8, complexity: 9, notes: 'Floral, bergamot' },
      { id: 2, date: '2024-11-02', beans: 'Colombian Supremo', method: 'AeroPress', rating: 4.3, acidity: 6, body: 7, sweetness: 7, complexity: 6, notes: 'Chocolate, caramel' },
      { id: 3, date: '2024-11-03', beans: 'Kenya AA', method: 'V60', rating: 4.8, acidity: 10, body: 8, sweetness: 8, complexity: 9, notes: 'Blackcurrant, grapefruit' },
      { id: 4, date: '2024-11-04', beans: 'Guatemala Antigua', method: 'Chemex', rating: 4.5, acidity: 7, body: 8, sweetness: 7, complexity: 7, notes: 'Chocolate, apple' },
      { id: 5, date: '2024-11-05', beans: 'Brazilian Santos', method: 'French Press', rating: 4.0, acidity: 4, body: 9, sweetness: 6, complexity: 5, notes: 'Chocolate, nutty' }
    ];
  }

  static _generateSampleBeans() {
    return [
      { name: 'Ethiopian Yirgacheffe', origin: 'Ethiopia', processing: 'washed', roast: 'light', price: 18, rating: 4.7 },
      { name: 'Colombian Supremo', origin: 'Colombia', processing: 'washed', roast: 'medium', price: 15, rating: 4.3 },
      { name: 'Kenya AA', origin: 'Kenya', processing: 'washed', roast: 'light', price: 20, rating: 4.8 },
      { name: 'Guatemala Antigua', origin: 'Guatemala', processing: 'washed', roast: 'medium', price: 16, rating: 4.5 },
      { name: 'Brazilian Santos', origin: 'Brazil', processing: 'natural', roast: 'medium-dark', price: 12, rating: 4.0 }
    ];
  }

  static _generateSampleOrigins() {
    return [
      { name: 'Ethiopia', region: 'Yirgacheffe', altitude: '1700-2200m', characteristics: 'Floral, fruity, wine-like' },
      { name: 'Colombia', region: 'Huila', altitude: '1200-2000m', characteristics: 'Balanced, sweet, nutty' },
      { name: 'Kenya', region: 'Nyeri', altitude: '1400-2000m', characteristics: 'Bright, complex, berry notes' },
      { name: 'Guatemala', region: 'Antigua', altitude: '1500-1700m', characteristics: 'Chocolate, spice, full body' },
      { name: 'Brazil', region: 'Cerrado', altitude: '800-1300m', characteristics: 'Low acidity, chocolate, nutty' }
    ];
  }

  static _generateSampleRecipes() {
    return [
      { method: 'V60', dose: 20, water: 300, grind: 'medium-fine', time: '3:00', temp: 93, ratio: '1:15' },
      { method: 'AeroPress', dose: 17, water: 250, grind: 'fine', time: '2:30', temp: 85, ratio: '1:14.7' },
      { method: 'Chemex', dose: 42, water: 700, grind: 'medium-coarse', time: '4:30', temp: 93, ratio: '1:16.7' }
    ];
  }

  static _generateSampleEquipment() {
    return [
      { name: 'Baratza Encore', type: 'grinder', price: 169, rating: 4.5 },
      { name: 'Hario V60', type: 'brewer', price: 25, rating: 4.8 },
      { name: 'Fellow Stagg EKG', type: 'kettle', price: 149, rating: 4.7 }
    ];
  }

  static _generateSampleMethods() {
    return [
      { name: 'V60', category: 'pour-over', difficulty: 'intermediate', time: '3-4 min' },
      { name: 'AeroPress', category: 'immersion', difficulty: 'beginner', time: '2-3 min' },
      { name: 'Espresso', category: 'pressure', difficulty: 'advanced', time: '30 sec' }
    ];
  }

  /**
   * Apply filters to dataset
   * @private
   */
  static _applyFilters(data, filters) {
    let filtered = [...data];

    if (filters.timeRange) {
      const now = Date.now();
      const ranges = {
        '7days': 7 * 24 * 60 * 60 * 1000,
        '30days': 30 * 24 * 60 * 60 * 1000,
        '90days': 90 * 24 * 60 * 60 * 1000
      };
      const cutoff = now - (ranges[filters.timeRange] || 0);

      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date).getTime();
        return itemDate >= cutoff;
      });
    }

    if (filters.method) {
      filtered = filtered.filter(item => item.method === filters.method);
    }

    if (filters.minRating) {
      filtered = filtered.filter(item => item.rating >= filters.minRating);
    }

    if (filters.origin) {
      filtered = filtered.filter(item =>
        item.origin === filters.origin ||
        item.beans?.toLowerCase().includes(filters.origin.toLowerCase())
      );
    }

    return filtered;
  }

  /**
   * Clear cache (useful for testing or manual refresh)
   */
  static clearCache() {
    this.cache.clear();
  }
}

// ============================================================================
// STANDARD CONTROL PANEL - Unified controls for all visualizations
// ============================================================================

class StandardControlPanel {
  constructor(container, options = {}) {
    this.container = typeof container === 'string'
      ? document.getElementById(container)
      : container;

    this.options = {
      filters: options.filters || ['time', 'method', 'rating', 'origin'],
      export: options.export !== false,
      theme: options.theme !== false,
      title: options.title || 'Visualization Controls',
      customControls: options.customControls || []
    };

    this.callbacks = [];
    this.currentFilters = {};

    this.render();
  }

  /**
   * Render the control panel
   */
  render() {
    this.container.className = 'cv-control-panel';
    this.container.innerHTML = `
      <div class="cv-panel-header">
        <h2 class="cv-panel-title">${this.options.title}</h2>
        <div class="cv-panel-actions">
          ${this.options.theme ? '<button class="cv-btn cv-theme-toggle" id="cv-theme-toggle" aria-label="Toggle theme"><span class="cv-icon">🌓</span></button>' : ''}
          ${this.options.export ? '<button class="cv-btn cv-export-btn" id="cv-export-btn" aria-label="Export visualization"><span class="cv-icon">💾</span> Export</button>' : ''}
          <button class="cv-btn cv-settings-btn" id="cv-settings-btn" aria-label="Settings"><span class="cv-icon">⚙️</span></button>
        </div>
      </div>

      <div class="cv-panel-body">
        ${this._renderFilters()}
        ${this._renderCustomControls()}
      </div>
    `;

    this._attachEventListeners();
  }

  /**
   * Render filter controls
   * @private
   */
  _renderFilters() {
    let html = '<div class="cv-filters">';

    if (this.options.filters.includes('time')) {
      html += `
        <div class="cv-control-group">
          <label for="cv-time-filter">Time Range</label>
          <select id="cv-time-filter" class="cv-select" aria-label="Filter by time range">
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>
      `;
    }

    if (this.options.filters.includes('method')) {
      html += `
        <div class="cv-control-group">
          <label for="cv-method-filter">Brewing Method</label>
          <select id="cv-method-filter" class="cv-select" aria-label="Filter by brewing method">
            <option value="all">All Methods</option>
            <option value="V60">V60</option>
            <option value="AeroPress">AeroPress</option>
            <option value="Chemex">Chemex</option>
            <option value="French Press">French Press</option>
            <option value="Espresso">Espresso</option>
          </select>
        </div>
      `;
    }

    if (this.options.filters.includes('rating')) {
      html += `
        <div class="cv-control-group">
          <label for="cv-rating-filter">Minimum Rating</label>
          <select id="cv-rating-filter" class="cv-select" aria-label="Filter by rating">
            <option value="0">All Ratings</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
          </select>
        </div>
      `;
    }

    if (this.options.filters.includes('origin')) {
      html += `
        <div class="cv-control-group">
          <label for="cv-origin-filter">Origin</label>
          <select id="cv-origin-filter" class="cv-select" aria-label="Filter by origin">
            <option value="all">All Origins</option>
            <option value="Ethiopia">Ethiopia</option>
            <option value="Colombia">Colombia</option>
            <option value="Kenya">Kenya</option>
            <option value="Guatemala">Guatemala</option>
            <option value="Brazil">Brazil</option>
          </select>
        </div>
      `;
    }

    html += '</div>';
    return html;
  }

  /**
   * Render custom controls
   * @private
   */
  _renderCustomControls() {
    if (this.options.customControls.length === 0) return '';

    let html = '<div class="cv-custom-controls">';

    this.options.customControls.forEach(control => {
      html += `
        <div class="cv-control-group">
          <label for="cv-custom-${control.id}">${control.label}</label>
          ${this._renderCustomControl(control)}
        </div>
      `;
    });

    html += '</div>';
    return html;
  }

  /**
   * Render individual custom control
   * @private
   */
  _renderCustomControl(control) {
    switch (control.type) {
      case 'select':
        return `
          <select id="cv-custom-${control.id}" class="cv-select">
            ${control.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
          </select>
        `;
      case 'range':
        return `
          <input type="range" id="cv-custom-${control.id}" class="cv-range"
                 min="${control.min}" max="${control.max}" value="${control.value}"
                 step="${control.step || 1}">
          <span class="cv-range-value">${control.value}</span>
        `;
      case 'checkbox':
        return `
          <input type="checkbox" id="cv-custom-${control.id}" class="cv-checkbox"
                 ${control.checked ? 'checked' : ''}>
        `;
      default:
        return '';
    }
  }

  /**
   * Attach event listeners
   * @private
   */
  _attachEventListeners() {
    // Filter changes
    const filterSelects = this.container.querySelectorAll('.cv-select');
    filterSelects.forEach(select => {
      select.addEventListener('change', () => this._handleFilterChange());
    });

    // Export button
    const exportBtn = this.container.querySelector('#cv-export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this._handleExport());
    }

    // Theme toggle
    const themeBtn = this.container.querySelector('#cv-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => ThemeManager.toggleTheme());
    }

    // Settings button
    const settingsBtn = this.container.querySelector('#cv-settings-btn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => this._showSettings());
    }

    // Custom controls
    this.options.customControls.forEach(control => {
      const element = this.container.querySelector(`#cv-custom-${control.id}`);
      if (element) {
        element.addEventListener('change', (e) => {
          if (control.onChange) {
            control.onChange(e.target.value);
          }
        });
      }
    });
  }

  /**
   * Handle filter changes
   * @private
   */
  _handleFilterChange() {
    this.currentFilters = this.getFilters();
    this.callbacks.forEach(callback => callback(this.currentFilters));
  }

  /**
   * Handle export button click
   * @private
   */
  _handleExport() {
    const exportEvent = new CustomEvent('cv-export', {
      detail: { filters: this.currentFilters }
    });
    window.dispatchEvent(exportEvent);
  }

  /**
   * Show settings dialog
   * @private
   */
  _showSettings() {
    alert('Settings functionality - customize visualization preferences here');
  }

  /**
   * Get current filter values
   * @returns {Object} Current filter state
   */
  getFilters() {
    const filters = {};

    const timeFilter = this.container.querySelector('#cv-time-filter');
    if (timeFilter && timeFilter.value !== 'all') {
      filters.timeRange = timeFilter.value;
    }

    const methodFilter = this.container.querySelector('#cv-method-filter');
    if (methodFilter && methodFilter.value !== 'all') {
      filters.method = methodFilter.value;
    }

    const ratingFilter = this.container.querySelector('#cv-rating-filter');
    if (ratingFilter && ratingFilter.value !== '0') {
      filters.minRating = parseFloat(ratingFilter.value);
    }

    const originFilter = this.container.querySelector('#cv-origin-filter');
    if (originFilter && originFilter.value !== 'all') {
      filters.origin = originFilter.value;
    }

    return filters;
  }

  /**
   * Register callback for filter changes
   * @param {Function} callback - Function to call when filters change
   */
  onChange(callback) {
    this.callbacks.push(callback);
  }
}

// ============================================================================
// EXPORT MANAGER - Export visualizations in various formats
// ============================================================================

class ExportManager {
  /**
   * Export canvas as PNG
   * @param {HTMLCanvasElement} canvas - Canvas element to export
   * @param {string} filename - Output filename
   */
  static exportPNG(canvas, filename = 'visualization.png') {
    canvas.toBlob(blob => {
      this._downloadBlob(blob, filename);
    });
  }

  /**
   * Export SVG element
   * @param {SVGElement} svgElement - SVG to export
   * @param {string} filename - Output filename
   */
  static exportSVG(svgElement, filename = 'visualization.svg') {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    this._downloadBlob(blob, filename);
  }

  /**
   * Export data as CSV
   * @param {Array} data - Array of objects to export
   * @param {string} filename - Output filename
   */
  static exportCSV(data, filename = 'data.csv') {
    if (data.length === 0) {
      console.warn('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',')
            ? `"${value}"`
            : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    this._downloadBlob(blob, filename);
  }

  /**
   * Export HTML element as PDF (requires html2canvas)
   * @param {HTMLElement} element - Element to export
   * @param {string} filename - Output filename
   */
  static async exportPDF(element, filename = 'visualization.pdf') {
    if (typeof html2canvas === 'undefined') {
      console.error('html2canvas library required for PDF export');
      alert('PDF export requires html2canvas library. Please include it in your HTML.');
      return;
    }

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');

    // For a simple implementation, export as image
    // For full PDF, would need jsPDF library
    const link = document.createElement('a');
    link.download = filename.replace('.pdf', '.png');
    link.href = imgData;
    link.click();
  }

  /**
   * Download blob as file
   * @private
   */
  static _downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Show export options dialog
   * @param {Object} options - Export configuration
   */
  static showExportDialog(options = {}) {
    const formats = options.formats || ['png', 'svg', 'csv'];
    const onExport = options.onExport || (() => {});

    const dialog = document.createElement('div');
    dialog.className = 'cv-export-dialog';
    dialog.innerHTML = `
      <div class="cv-dialog-overlay"></div>
      <div class="cv-dialog-content">
        <h3>Export Visualization</h3>
        <div class="cv-export-formats">
          ${formats.map(format => `
            <button class="cv-btn cv-export-format-btn" data-format="${format}">
              ${format.toUpperCase()}
            </button>
          `).join('')}
        </div>
        <button class="cv-btn cv-dialog-close">Cancel</button>
      </div>
    `;

    document.body.appendChild(dialog);

    dialog.querySelectorAll('.cv-export-format-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        onExport(btn.dataset.format);
        document.body.removeChild(dialog);
      });
    });

    dialog.querySelector('.cv-dialog-close').addEventListener('click', () => {
      document.body.removeChild(dialog);
    });
  }
}

// ============================================================================
// ACCESSIBILITY HELPER - WCAG 2.1 AA+ compliance utilities
// ============================================================================

class AccessibilityHelper {
  /**
   * Add ARIA attributes to element
   * @param {HTMLElement} element - Target element
   * @param {string} role - ARIA role
   * @param {string} label - ARIA label
   * @param {string} describedBy - ID of describing element
   */
  static addARIA(element, role, label, describedBy = null) {
    element.setAttribute('role', role);
    element.setAttribute('aria-label', label);
    if (describedBy) {
      element.setAttribute('aria-describedby', describedBy);
    }
  }

  /**
   * Announce message to screen readers
   * @param {string} message - Message to announce
   * @param {string} priority - 'polite' or 'assertive'
   */
  static announceToScreenReader(message, priority = 'polite') {
    const announcer = this._getOrCreateAnnouncer();
    announcer.setAttribute('aria-live', priority);
    announcer.textContent = message;

    // Clear after announcement
    setTimeout(() => {
      announcer.textContent = '';
    }, 1000);
  }

  /**
   * Get or create screen reader announcer element
   * @private
   */
  static _getOrCreateAnnouncer() {
    let announcer = document.getElementById('cv-sr-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'cv-sr-announcer';
      announcer.className = 'cv-sr-only';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      document.body.appendChild(announcer);
    }
    return announcer;
  }

  /**
   * Setup keyboard navigation for element
   * @param {HTMLElement} element - Target element
   * @param {Object} handlers - Key to handler function map
   */
  static setupKeyboardNav(element, handlers) {
    element.setAttribute('tabindex', '0');

    element.addEventListener('keydown', (e) => {
      const handler = handlers[e.key] || handlers[e.code];
      if (handler) {
        e.preventDefault();
        handler(e);
        this.announceToScreenReader(`Activated: ${e.key}`);
      }
    });

    // Add focus indicator
    element.addEventListener('focus', () => {
      element.classList.add('cv-keyboard-focus');
    });

    element.addEventListener('blur', () => {
      element.classList.remove('cv-keyboard-focus');
    });
  }

  /**
   * Check color contrast ratio
   * @param {string} fg - Foreground color (hex)
   * @param {string} bg - Background color (hex)
   * @returns {number} Contrast ratio
   */
  static checkContrast(fg, bg) {
    const fgLuminance = this._getLuminance(fg);
    const bgLuminance = this._getLuminance(bg);

    const lighter = Math.max(fgLuminance, bgLuminance);
    const darker = Math.min(fgLuminance, bgLuminance);

    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Calculate relative luminance
   * @private
   */
  static _getLuminance(hex) {
    const rgb = this._hexToRgb(hex);
    const [r, g, b] = rgb.map(val => {
      val = val / 255;
      return val <= 0.03928
        ? val / 12.92
        : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * Convert hex color to RGB
   * @private
   */
  static _hexToRgb(hex) {
    hex = hex.replace('#', '');
    return [
      parseInt(hex.substr(0, 2), 16),
      parseInt(hex.substr(2, 2), 16),
      parseInt(hex.substr(4, 2), 16)
    ];
  }

  /**
   * Validate WCAG compliance
   * @param {string} fg - Foreground color
   * @param {string} bg - Background color
   * @param {string} level - 'AA' or 'AAA'
   * @param {string} size - 'normal' or 'large'
   * @returns {boolean} Whether contrast meets WCAG standards
   */
  static meetsWCAG(fg, bg, level = 'AA', size = 'normal') {
    const ratio = this.checkContrast(fg, bg);

    const requirements = {
      'AA': { normal: 4.5, large: 3 },
      'AAA': { normal: 7, large: 4.5 }
    };

    return ratio >= requirements[level][size];
  }

  /**
   * Add skip link for keyboard navigation
   * @param {string} targetId - ID of main content
   * @param {string} label - Skip link label
   */
  static addSkipLink(targetId, label = 'Skip to main content') {
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.className = 'cv-skip-link';
    skipLink.textContent = label;
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
}

// ============================================================================
// THEME MANAGER - Dark/light mode support
// ============================================================================

class ThemeManager {
  static STORAGE_KEY = 'cv-theme-preference';
  static THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto'
  };

  /**
   * Get current theme
   * @returns {string} Current theme ('light' or 'dark')
   */
  static getCurrentTheme() {
    const stored = localStorage.getItem(this.STORAGE_KEY);

    if (stored === this.THEMES.AUTO || !stored) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? this.THEMES.DARK
        : this.THEMES.LIGHT;
    }

    return stored;
  }

  /**
   * Set theme
   * @param {string} theme - 'light', 'dark', or 'auto'
   */
  static setTheme(theme) {
    localStorage.setItem(this.STORAGE_KEY, theme);
    this.applyTheme(theme);
  }

  /**
   * Toggle between light and dark
   */
  static toggleTheme() {
    const current = this.getCurrentTheme();
    const next = current === this.THEMES.LIGHT ? this.THEMES.DARK : this.THEMES.LIGHT;
    this.setTheme(next);
  }

  /**
   * Apply theme to document
   * @param {string} theme - Theme to apply
   */
  static applyTheme(theme) {
    const actualTheme = theme === this.THEMES.AUTO
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? this.THEMES.DARK : this.THEMES.LIGHT)
      : theme;

    document.documentElement.setAttribute('data-theme', actualTheme);

    // Update CSS variables
    if (actualTheme === this.THEMES.DARK) {
      this._applyDarkTheme();
    } else {
      this._applyLightTheme();
    }

    // Announce to screen readers
    AccessibilityHelper.announceToScreenReader(`Theme changed to ${actualTheme} mode`);
  }

  /**
   * Apply dark theme colors
   * @private
   */
  static _applyDarkTheme() {
    const root = document.documentElement;
    root.style.setProperty('--cv-bg-primary', '#1a1a1a');
    root.style.setProperty('--cv-bg-secondary', '#2d2d2d');
    root.style.setProperty('--cv-text-primary', '#e8e8e8');
    root.style.setProperty('--cv-text-secondary', '#b8b8b8');
    root.style.setProperty('--cv-accent', '#d4a574');
    root.style.setProperty('--cv-border', 'rgba(139, 69, 19, 0.3)');
  }

  /**
   * Apply light theme colors
   * @private
   */
  static _applyLightTheme() {
    const root = document.documentElement;
    root.style.setProperty('--cv-bg-primary', '#ffffff');
    root.style.setProperty('--cv-bg-secondary', '#f5f5f5');
    root.style.setProperty('--cv-text-primary', '#2d2d2d');
    root.style.setProperty('--cv-text-secondary', '#666666');
    root.style.setProperty('--cv-accent', '#8b4513');
    root.style.setProperty('--cv-border', 'rgba(139, 69, 19, 0.2)');
  }

  /**
   * Initialize theme on page load
   */
  static init() {
    const theme = this.getCurrentTheme();
    this.applyTheme(theme);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (localStorage.getItem(this.STORAGE_KEY) === this.THEMES.AUTO) {
        this.applyTheme(this.THEMES.AUTO);
      }
    });
  }
}

// ============================================================================
// LOADING STATE MANAGER - Handle async data loading states
// ============================================================================

class LoadingStateManager {
  /**
   * Show loading state
   * @param {HTMLElement} container - Container element
   * @param {string} message - Loading message
   */
  static showLoading(container, message = 'Loading data...') {
    container.innerHTML = `
      <div class="cv-loading-state">
        <div class="cv-spinner"></div>
        <p class="cv-loading-message">${message}</p>
      </div>
    `;
    container.setAttribute('aria-busy', 'true');
  }

  /**
   * Show error state
   * @param {HTMLElement} container - Container element
   * @param {string} message - Error message
   * @param {Function} onRetry - Retry callback
   */
  static showError(container, message = 'Failed to load data', onRetry = null) {
    container.innerHTML = `
      <div class="cv-error-state">
        <div class="cv-error-icon">⚠️</div>
        <p class="cv-error-message">${message}</p>
        ${onRetry ? '<button class="cv-btn cv-retry-btn">Retry</button>' : ''}
      </div>
    `;
    container.setAttribute('aria-busy', 'false');

    if (onRetry) {
      container.querySelector('.cv-retry-btn').addEventListener('click', onRetry);
    }
  }

  /**
   * Show empty state
   * @param {HTMLElement} container - Container element
   * @param {string} message - Empty state message
   */
  static showEmpty(container, message = 'No data available') {
    container.innerHTML = `
      <div class="cv-empty-state">
        <div class="cv-empty-icon">📊</div>
        <p class="cv-empty-message">${message}</p>
      </div>
    `;
    container.setAttribute('aria-busy', 'false');
  }

  /**
   * Hide loading state and show content
   * @param {HTMLElement} container - Container element
   */
  static hideLoading(container) {
    container.setAttribute('aria-busy', 'false');
    const loadingEl = container.querySelector('.cv-loading-state');
    if (loadingEl) {
      loadingEl.remove();
    }
  }
}

// ============================================================================
// PERFORMANCE MONITOR - Track visualization performance
// ============================================================================

class PerformanceMonitor {
  static metrics = [];
  static targetFPS = 60;

  /**
   * Start performance measurement
   * @param {string} label - Measurement label
   * @returns {number} Measurement ID
   */
  static start(label) {
    const id = Date.now();
    this.metrics.push({
      id,
      label,
      startTime: performance.now(),
      endTime: null,
      duration: null
    });
    return id;
  }

  /**
   * End performance measurement
   * @param {number} id - Measurement ID
   */
  static end(id) {
    const metric = this.metrics.find(m => m.id === id);
    if (metric) {
      metric.endTime = performance.now();
      metric.duration = metric.endTime - metric.startTime;

      if (metric.duration > 16) { // 60 FPS = 16.67ms per frame
        console.warn(`Performance warning: ${metric.label} took ${metric.duration.toFixed(2)}ms`);
      }
    }
  }

  /**
   * Get average duration for a label
   * @param {string} label - Measurement label
   * @returns {number} Average duration in ms
   */
  static getAverage(label) {
    const matching = this.metrics.filter(m => m.label === label && m.duration !== null);
    if (matching.length === 0) return 0;

    const sum = matching.reduce((acc, m) => acc + m.duration, 0);
    return sum / matching.length;
  }

  /**
   * Get performance report
   * @returns {Object} Performance statistics
   */
  static getReport() {
    const labels = [...new Set(this.metrics.map(m => m.label))];

    return labels.map(label => ({
      label,
      count: this.metrics.filter(m => m.label === label).length,
      average: this.getAverage(label),
      max: Math.max(...this.metrics.filter(m => m.label === label).map(m => m.duration || 0))
    }));
  }

  /**
   * Clear all metrics
   */
  static clear() {
    this.metrics = [];
  }
}

// ============================================================================
// AUTO-INITIALIZATION
// ============================================================================

// Initialize theme on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
} else {
  ThemeManager.init();
}

// Export for use in visualizations
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DataLoader,
    StandardControlPanel,
    ExportManager,
    AccessibilityHelper,
    ThemeManager,
    LoadingStateManager,
    PerformanceMonitor
  };
}
