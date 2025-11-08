# Coffee Vault 7.0 - Visualization Development Guide

## Table of Contents

1. [Quick Start](#quick-start)
2. [Updating Existing Visualizations](#updating-existing-visualizations)
3. [Creating New Visualizations](#creating-new-visualizations)
4. [Shared Infrastructure API](#shared-infrastructure-api)
5. [Accessibility Checklist](#accessibility-checklist)
6. [Performance Guidelines](#performance-guidelines)
7. [Testing](#testing)

---

## Quick Start

### Required Files

All visualizations must include:

```html
<head>
    <!-- Shared Infrastructure -->
    <link rel="stylesheet" href="shared-styles.css">
    <script src="shared-controls.js"></script>
</head>
```

### Minimal Visualization Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Visualization - Coffee Vault 7.0</title>

    <!-- Shared Infrastructure -->
    <link rel="stylesheet" href="shared-styles.css">
    <script src="shared-controls.js"></script>
</head>
<body>
    <!-- Skip link for accessibility -->
    <a href="#main-viz" class="cv-skip-link">Skip to visualization</a>

    <!-- Control Panel -->
    <div id="control-panel"></div>

    <!-- Main visualization -->
    <div id="main-viz" role="main">
        <canvas id="canvas"></canvas>
    </div>

    <script>
        let data = [];
        let controlPanel = null;

        async function init() {
            // Load data
            data = await DataLoader.loadCoffeeLogs();

            // Create control panel
            controlPanel = new StandardControlPanel('control-panel', {
                title: 'My Visualization',
                filters: ['time', 'method', 'rating'],
                export: true,
                theme: true
            });

            // Handle filter changes
            controlPanel.onChange((filters) => {
                render(DataLoader._applyFilters(data, filters));
            });

            // Handle exports
            window.addEventListener('cv-export', () => {
                ExportManager.showExportDialog({
                    formats: ['png', 'csv'],
                    onExport: (fmt) => handleExport(fmt)
                });
            });

            // Initial render
            render(data);
        }

        function render(data) {
            // Your visualization code here
        }

        // Initialize on load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    </script>
</body>
</html>
```

---

## Updating Existing Visualizations

### Step-by-Step Update Process

#### 1. Add Shared Infrastructure (5 minutes)

**Before:**
```html
<head>
    <title>My Viz</title>
    <style>...</style>
</head>
```

**After:**
```html
<head>
    <title>My Viz - Coffee Vault 7.0</title>

    <!-- Shared Infrastructure -->
    <link rel="stylesheet" href="shared-styles.css">
    <script src="shared-controls.js"></script>

    <style>...</style>
</head>
```

#### 2. Add Accessibility Elements (10 minutes)

**Add skip link and ARIA labels:**

```html
<body>
    <!-- Skip link -->
    <a href="#canvas" class="cv-skip-link">Skip to visualization</a>

    <!-- Control panel container -->
    <div id="cv-control-panel-container"></div>

    <!-- Main visualization with ARIA -->
    <canvas id="canvas"
            role="img"
            aria-label="Coffee flavor visualization"
            aria-describedby="viz-desc">
    </canvas>

    <!-- Screen reader description -->
    <div id="viz-desc" class="cv-sr-only">
        This visualization shows coffee flavors in 3D space.
        Use arrow keys to navigate.
    </div>
</body>
```

#### 3. Replace Sample Data with DataLoader (15 minutes)

**Before:**
```javascript
const sampleData = [
    { name: 'Coffee 1', rating: 4.5 },
    { name: 'Coffee 2', rating: 4.2 }
];

renderVisualization(sampleData);
```

**After:**
```javascript
let allData = [];

async function initVisualization() {
    try {
        // Load real data
        allData = await DataLoader.loadCoffeeLogs();

        // Render with data
        renderVisualization(allData);

    } catch (error) {
        console.error('Data load failed:', error);
        LoadingStateManager.showError(
            document.getElementById('container'),
            'Failed to load data',
            () => initVisualization()
        );
    }
}

initVisualization();
```

#### 4. Add Control Panel (15 minutes)

```javascript
// Create control panel
const controlPanel = new StandardControlPanel('cv-control-panel-container', {
    title: 'Visualization Controls',
    filters: ['time', 'method', 'rating', 'origin'],
    export: true,
    theme: true,
    customControls: [
        {
            id: 'axis-selection',
            label: 'X-Axis',
            type: 'select',
            options: [
                { value: 'acidity', label: 'Acidity' },
                { value: 'body', label: 'Body' }
            ],
            onChange: (value) => {
                updateAxis(value);
            }
        }
    ]
});

// Listen for filter changes
controlPanel.onChange((filters) => {
    const filteredData = DataLoader._applyFilters(allData, filters);
    renderVisualization(filteredData);
});
```

#### 5. Add Export Functionality (10 minutes)

```javascript
// Listen for export events
window.addEventListener('cv-export', () => {
    ExportManager.showExportDialog({
        formats: ['png', 'csv'],
        onExport: (format) => {
            if (format === 'png') {
                const canvas = document.getElementById('canvas');
                ExportManager.exportPNG(canvas, 'my-viz.png');
            } else if (format === 'csv') {
                ExportManager.exportCSV(currentData, 'my-viz-data.csv');
            }
            AccessibilityHelper.announceToScreenReader('Export complete');
        }
    });
});
```

#### 6. Add Keyboard Navigation (15 minutes)

```javascript
// Setup keyboard navigation
AccessibilityHelper.setupKeyboardNav(document.body, {
    'ArrowLeft': () => {
        panLeft();
        AccessibilityHelper.announceToScreenReader('Panned left');
    },
    'ArrowRight': () => {
        panRight();
        AccessibilityHelper.announceToScreenReader('Panned right');
    },
    '+': () => {
        zoomIn();
        AccessibilityHelper.announceToScreenReader('Zoomed in');
    },
    '-': () => {
        zoomOut();
        AccessibilityHelper.announceToScreenReader('Zoomed out');
    },
    'r': () => {
        reset();
        AccessibilityHelper.announceToScreenReader('View reset');
    }
});
```

#### 7. Add Loading States (10 minutes)

```javascript
async function loadData() {
    // Show loading
    LoadingStateManager.showLoading(
        document.getElementById('container'),
        'Loading your coffee data...'
    );

    try {
        const data = await DataLoader.loadCoffeeLogs();

        // Hide loading
        LoadingStateManager.hideLoading(document.getElementById('container'));

        return data;

    } catch (error) {
        // Show error
        LoadingStateManager.showError(
            document.getElementById('container'),
            'Failed to load data',
            () => loadData()
        );
    }
}
```

---

## Shared Infrastructure API

### DataLoader

```javascript
// Load coffee logs
const logs = await DataLoader.loadCoffeeLogs();
const filteredLogs = await DataLoader.loadCoffeeLogs({ minRating: 4.5 });

// Load other data types
const beans = await DataLoader.loadBeans();
const origins = await DataLoader.loadOrigins();
const recipes = await DataLoader.loadRecipes();
const equipment = await DataLoader.loadEquipment();
const methods = await DataLoader.loadMethods();

// Apply filters manually
const filtered = DataLoader._applyFilters(data, {
    timeRange: '30days',
    method: 'V60',
    minRating: 4.0,
    origin: 'Ethiopia'
});

// Clear cache
DataLoader.clearCache();
```

### StandardControlPanel

```javascript
const panel = new StandardControlPanel(container, {
    title: 'My Controls',
    filters: ['time', 'method', 'rating', 'origin'],
    export: true,
    theme: true,
    customControls: [
        {
            id: 'my-select',
            label: 'Custom Select',
            type: 'select',
            options: [
                { value: 'opt1', label: 'Option 1' },
                { value: 'opt2', label: 'Option 2' }
            ]
        },
        {
            id: 'my-range',
            label: 'Custom Range',
            type: 'range',
            min: 0,
            max: 100,
            value: 50,
            step: 1
        },
        {
            id: 'my-checkbox',
            label: 'Enable Feature',
            type: 'checkbox',
            checked: true
        }
    ]
});

// Get current filter state
const filters = panel.getFilters();

// Listen for changes
panel.onChange((filters) => {
    console.log('Filters changed:', filters);
});
```

### ExportManager

```javascript
// Export canvas as PNG
ExportManager.exportPNG(canvasElement, 'visualization.png');

// Export SVG
ExportManager.exportSVG(svgElement, 'chart.svg');

// Export data as CSV
ExportManager.exportCSV(data, 'coffee-data.csv');

// Show export dialog
ExportManager.showExportDialog({
    formats: ['png', 'svg', 'csv'],
    onExport: (format) => {
        console.log('Exporting as:', format);
    }
});
```

### AccessibilityHelper

```javascript
// Add ARIA attributes
AccessibilityHelper.addARIA(
    element,
    'button',
    'Export visualization',
    'export-desc'
);

// Announce to screen readers
AccessibilityHelper.announceToScreenReader('Data loaded', 'polite');

// Setup keyboard navigation
AccessibilityHelper.setupKeyboardNav(element, {
    'Enter': () => activate(),
    'Escape': () => close()
});

// Check color contrast
const ratio = AccessibilityHelper.checkContrast('#FFD700', '#000000');
const meetsAA = AccessibilityHelper.meetsWCAG('#FFD700', '#000000', 'AA', 'normal');

// Add skip link
AccessibilityHelper.addSkipLink('main-content', 'Skip to visualization');
```

### ThemeManager

```javascript
// Get current theme
const theme = ThemeManager.getCurrentTheme(); // 'light' or 'dark'

// Set theme
ThemeManager.setTheme('dark');

// Toggle theme
ThemeManager.toggleTheme();

// Initialize (done automatically)
ThemeManager.init();
```

### LoadingStateManager

```javascript
// Show loading
LoadingStateManager.showLoading(container, 'Loading...');

// Show error
LoadingStateManager.showError(
    container,
    'Failed to load',
    () => retry()
);

// Show empty state
LoadingStateManager.showEmpty(container, 'No data available');

// Hide loading
LoadingStateManager.hideLoading(container);
```

---

## Accessibility Checklist

Use this checklist for every visualization:

### Semantic HTML
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Semantic elements (`<nav>`, `<main>`, `<section>`)
- [ ] `<button>` for buttons, not `<div onclick>`

### ARIA Attributes
- [ ] `role` on interactive elements
- [ ] `aria-label` on all controls
- [ ] `aria-describedby` for complex elements
- [ ] `aria-live` for dynamic content

### Keyboard Navigation
- [ ] All features accessible via keyboard
- [ ] Visible focus indicators
- [ ] Logical tab order
- [ ] Skip link to main content
- [ ] Escape closes dialogs/modals

### Color & Contrast
- [ ] 4.5:1 minimum for normal text (AA)
- [ ] 3:1 minimum for large text (AA)
- [ ] Not relying on color alone
- [ ] Patterns/icons in addition to color

### Screen Readers
- [ ] Descriptive alt text
- [ ] Screen reader only descriptions
- [ ] Announcements for dynamic changes
- [ ] Proper label associations

### Motion & Animation
- [ ] Respects `prefers-reduced-motion`
- [ ] Auto-rotate disabled by default
- [ ] Option to disable animations

---

## Performance Guidelines

### Target Metrics

- **60 FPS** for 3D visualizations
- **< 16ms** render time for 2D
- **< 100ms** data loading
- **< 3s** total page load

### Optimization Techniques

#### 1. Data Optimization
```javascript
// ✓ GOOD: Filter data before rendering
const filtered = data.filter(d => d.rating >= 4.5);
render(filtered);

// ✗ BAD: Render all then hide
render(data);
hideElements(data.filter(d => d.rating < 4.5));
```

#### 2. Debounce Expensive Operations
```javascript
let debounceTimer;
function handleResize() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        recalculateLayout();
    }, 250);
}
```

#### 3. Use Performance Monitor
```javascript
const measureId = PerformanceMonitor.start('render');
// ... rendering code ...
PerformanceMonitor.end(measureId);

// Get report
const report = PerformanceMonitor.getReport();
console.log('Average render time:', report[0].average);
```

#### 4. Lazy Load Heavy Resources
```javascript
// Load THREE.js only when needed
async function init3D() {
    if (!window.THREE) {
        await loadScript('three.min.js');
    }
    // ... initialize 3D ...
}
```

---

## Testing

### Manual Testing Checklist

1. **Data Loading**
   - [ ] Loads with real data
   - [ ] Falls back to sample data if unavailable
   - [ ] Shows loading state
   - [ ] Shows error state on failure

2. **Filters**
   - [ ] Time range filter works
   - [ ] Method filter works
   - [ ] Rating filter works
   - [ ] Origin filter works
   - [ ] Combining filters works
   - [ ] Empty state when no matches

3. **Export**
   - [ ] PNG export downloads
   - [ ] CSV export downloads
   - [ ] SVG export works (if applicable)
   - [ ] Exported data is correct

4. **Theme**
   - [ ] Light mode displays correctly
   - [ ] Dark mode displays correctly
   - [ ] Theme toggle works
   - [ ] Theme persists on reload

5. **Keyboard Navigation**
   - [ ] Tab navigation works
   - [ ] All shortcuts functional
   - [ ] Focus visible
   - [ ] Screen reader announces

6. **Responsive**
   - [ ] Mobile (< 640px) works
   - [ ] Tablet (640-1024px) works
   - [ ] Desktop (> 1024px) works
   - [ ] Touch controls work

### Browser Testing

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Accessibility Testing

Tools:
- **axe DevTools** - Automated accessibility testing
- **NVDA/JAWS** - Screen reader testing
- **Keyboard only** - No mouse navigation

---

## Common Patterns & Examples

### Example: 3D Visualization Update

See `/home/user/coffee-vault/Visualizations/3d-flavor-space.html` for complete example.

Key patterns:
1. THREE.js scene setup
2. DataLoader integration
3. Control panel with custom axis selectors
4. Keyboard camera controls
5. Export canvas to PNG

### Example: Chart Visualization

```javascript
// Use Chart.js with real data
async function createChart() {
    const data = await DataLoader.loadCoffeeLogs();

    const ctx = document.getElementById('chart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.beans),
            datasets: [{
                label: 'Rating',
                data: data.map(d => d.rating)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Export chart
    window.addEventListener('cv-export', () => {
        ExportManager.exportPNG(chart.canvas, 'chart.png');
    });
}
```

---

## Anti-Patterns (Avoid These)

### ❌ Hardcoded Data
```javascript
// DON'T
const data = [{ name: 'Coffee 1' }, { name: 'Coffee 2' }];
```

### ❌ Missing Accessibility
```javascript
// DON'T
<div onclick="doSomething()">Click me</div>

// DO
<button onclick="doSomething()" aria-label="Perform action">Click me</button>
```

### ❌ No Error Handling
```javascript
// DON'T
const data = await fetch('data.json').then(r => r.json());

// DO
try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
} catch (error) {
    LoadingStateManager.showError(container, error.message);
}
```

### ❌ Blocking the Main Thread
```javascript
// DON'T
for (let i = 0; i < 1000000; i++) {
    processData(i);
}

// DO
async function processInChunks(data, chunkSize = 100) {
    for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        processData(chunk);
        await new Promise(resolve => setTimeout(resolve, 0));
    }
}
```

---

## Resources

- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **MDN Accessibility**: https://developer.mozilla.org/en-US/docs/Web/Accessibility
- **THREE.js Docs**: https://threejs.org/docs/
- **Chart.js Docs**: https://www.chartjs.org/docs/

---

## Support

Questions or issues? Check:
1. This development guide
2. `README.md` for user documentation
3. Example visualizations in this directory
4. Coffee Vault GitHub issues

---

*Coffee Vault 7.0 Development Guide*
*Last updated: 2024-11-08*
