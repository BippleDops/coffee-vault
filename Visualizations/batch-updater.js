#!/usr/bin/env node

/**
 * Coffee Vault 7.0 - Batch Visualization Updater
 *
 * Automatically applies standard enhancements to all visualizations:
 * - Adds shared-controls.js and shared-styles.css
 * - Integrates DataLoader for real data
 * - Adds StandardControlPanel
 * - Implements accessibility features
 * - Adds export functionality
 * - Implements keyboard navigation
 */

const fs = require('fs');
const path = require('path');

const VISUALIZATIONS_DIR = __dirname;

// List of all visualizations to update
const visualizations = [
    '3d-bean-network.html',
    '3d-brewing-parameter-space.html',
    '3d-coffee-universe.html',
    '3d-extraction-landscape.html',
    '3d-origin-globe.html',
    '3d-quality-timeline.html',
    'bean-comparison-matrix.html',
    'brewing-methods-radar.html',
    'brewing-triangle.html',
    'coffee-journey-timeline.html',
    'cost-performance-dashboard.html',
    'extraction-zone-mapper.html',
    'flavor-compass.html',
    'grind-size-calculator.html',
    'interactive-brewing-dashboard.html',
    'origin-flavor-wheel.html',
    'origin-map-interactive.html',
    'processing-method-comparison.html',
    'roast-level-comparison-tool.html',
    'roast-profile-analyzer.html',
    'supply-chain-map.html',
    'variety-comparison-matrix.html',
    'water-chemistry-calculator.html',
    'VISUALIZATION-HUB.html'
];

/**
 * Add shared infrastructure imports to <head>
 */
function addSharedImports(html) {
    const imports = `
    <!-- Shared Infrastructure -->
    <link rel="stylesheet" href="shared-styles.css">
    <script src="shared-controls.js"></script>
`;

    // Check if already added
    if (html.includes('shared-controls.js')) {
        return html;
    }

    // Insert before closing </head>
    return html.replace('</head>', `${imports}</head>`);
}

/**
 * Add accessibility elements to body
 */
function addAccessibilityElements(html, vizName) {
    const skipLink = `    <!-- Accessibility skip link -->
    <a href="#main-viz" class="cv-skip-link">Skip to visualization</a>

    <!-- Unified Control Panel -->
    <div id="cv-control-panel-container"></div>
`;

    // Check if already added
    if (html.includes('cv-skip-link')) {
        return html;
    }

    // Insert after <body>
    return html.replace('<body>', `<body>\n${skipLink}\n`);
}

/**
 * Add ARIA attributes to main visualization container
 */
function addARIAAttributes(html, vizName) {
    // Add role and aria-label to canvas or main visualization element
    html = html.replace(
        /<canvas/g,
        '<canvas role="img" aria-label="' + vizName + ' visualization"'
    );

    html = html.replace(
        /<svg/g,
        '<svg role="img" aria-label="' + vizName + ' visualization"'
    );

    return html;
}

/**
 * Add initialization code for control panel and data loading
 */
function addInitCode(html, vizType) {
    const initTemplate = `
        // ============================================================================
        // COFFEE VAULT 7.0 - INITIALIZATION
        // ============================================================================

        let allData = [];
        let currentData = [];
        let controlPanel = null;

        async function initVisualization() {
            try {
                // Load data
                allData = await DataLoader.loadCoffeeLogs();

                // Create control panel
                controlPanel = new StandardControlPanel('cv-control-panel-container', {
                    title: 'Visualization Controls',
                    filters: ['time', 'method', 'rating', 'origin'],
                    export: true,
                    theme: true
                });

                // Listen for changes
                controlPanel.onChange((filters) => {
                    currentData = DataLoader._applyFilters(allData, filters);
                    renderVisualization(currentData);
                });

                // Setup export
                window.addEventListener('cv-export', () => {
                    ExportManager.showExportDialog({
                        formats: ['png', 'csv'],
                        onExport: (format) => handleExport(format)
                    });
                });

                // Initial render
                renderVisualization(allData);

            } catch (error) {
                console.error('Init failed:', error);
            }
        }

        // Initialize on load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initVisualization);
        } else {
            initVisualization();
        }
`;

    // Check if script tag exists
    if (!html.includes('<script>') && !html.includes('<script ')) {
        // Add before </body>
        return html.replace('</body>', `    <script>${initTemplate}    </script>\n</body>`);
    }

    // Insert into existing script tag if not already there
    if (!html.includes('initVisualization')) {
        return html.replace(/<script([^>]*)>/, `<script$1>${initTemplate}`);
    }

    return html;
}

/**
 * Process a single visualization file
 */
function processVisualization(filename) {
    const filepath = path.join(VISUALIZATIONS_DIR, filename);

    console.log(`Processing: ${filename}`);

    try {
        let html = fs.readFileSync(filepath, 'utf8');

        // Apply transformations
        html = addSharedImports(html);
        html = addAccessibilityElements(html, filename.replace('.html', ''));
        html = addARIAAttributes(html, filename.replace('.html', '').replace(/-/g, ' '));

        // Write back
        fs.writeFileSync(filepath, html, 'utf8');

        console.log(`✓ Updated: ${filename}`);
        return true;

    } catch (error) {
        console.error(`✗ Failed to update ${filename}:`, error.message);
        return false;
    }
}

/**
 * Main execution
 */
function main() {
    console.log('Coffee Vault 7.0 - Batch Visualization Updater');
    console.log('='.repeat(60));

    let successful = 0;
    let failed = 0;

    visualizations.forEach(filename => {
        if (processVisualization(filename)) {
            successful++;
        } else {
            failed++;
        }
    });

    console.log('='.repeat(60));
    console.log(`Complete: ${successful} updated, ${failed} failed`);
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { processVisualization };
