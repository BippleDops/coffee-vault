#!/usr/bin/env node
/**
 * Coffee Vault Manual Review Checklist Generator
 * ----------------------------------------------
 * Provides a scripted walkthrough of all manual UI actions that
 * cannot be automated. Run this before/after major structural
 * changes to make sure Obsidian layouts and plugins stay aligned.
 *
 * Usage:
 *   node Scripts/manual-review-checklist.js
 *   node Scripts/manual-review-checklist.js --markdown Reports/manual-review.md
 */

const fs = require('fs');
const path = require('path');

const VAULT_ROOT = process.cwd();

const REQUIRED_FILES = [
  'Workspaces/Daily-Brewing/INDEX.md',
  'Workspaces/Analytics-Analysis/INDEX.md',
  'Workspaces/Learning-Education/INDEX.md',
  'Workspaces/Supply-Chain/INDEX.md',
  '.obsidian/workspace-layouts/daily-brewing-layout.json',
  '.obsidian/workspace-layouts/analytics-layout.json',
  '.obsidian/workspace-layouts/learning-layout.json',
  '.obsidian/workspace-layouts/supply-chain-layout.json',
  'Configuration/Manual-Operations-Guide.md',
  'Configuration/Folder-Architecture.md'
];

const TASKS = [
  {
    id: 'preflight',
    title: 'Preflight Validation',
    steps: [
      'Confirm you are inside the Coffee Vault root before launching Obsidian.',
      'Check for plugin updates (Settings → Community Plugins → Check for updates).',
      'Verify the vault is synced with Git (`git status` should be clean).'
    ]
  },
  {
    id: 'workspace-load',
    title: 'Workspace Layout Verification',
    steps: [
      'Open Obsidian and load `Daily Brewing Layout` from Workspaces.',
      'Ensure HOME-DASHBOARD, Coffee Log v5, and Real-Time Assistant panes resolve.',
      'Switch to `Analytics & Analysis Layout`; confirm each analytics tab opens (no “File moved” notices).',
      'Load `Learning & Education Layout` and review the Goals dashboard and Scientific references.',
      'Load `Supply Chain & Transparency Layout`; confirm producer and supply dashboards resolve.'
    ]
  },
  {
    id: 'pin-refresh',
    title: 'Pinned Tabs & Favorites Refresh',
    steps: [
      'Re-pin frequently used notes if Obsidian shows a “missing file” indicator.',
      'Add new workspace index notes to the Starred panel or Command Palette favorites.',
      'Update Quick Switcher history by opening each primary dashboard once.'
    ]
  },
  {
    id: 'plugin-alignment',
    title: 'Plugin Configuration Alignment',
    steps: [
      'Templater: confirm template folder is `Templates/` and re-run cache refresh.',
      'Datacore: run `Datacore: Rebuild indices` from the command palette.',
      'Buttons & QuickAdd: update any custom buttons that referenced old analytics paths.'
    ]
  },
  {
    id: 'dataview-validation',
    title: 'Datacore/Dataview Query Validation',
    steps: [
      'Open `Views/Analytics-Analysis-Layout/Advanced-Analytics-Base.md` and ensure tables render.',
      'Open `Views/Daily-Brewing-Layout/Live-Weekly-Summary.md` and confirm weekly stats appear.',
      'Review `Views/Supply-Chain-Layout/Producer-Database-View.md` for any missing properties warnings.'
    ]
  },
  {
    id: 'visualization-check',
    title: 'Visualization Hub Sanity Check',
    steps: [
      'Open `Visualizations/VISUALIZATION-HUB.html` in the default browser.',
      'Ensure each 3D visualization link resolves (especially the renamed dashboards).',
      'Confirm axis labels and auto-rotation toggles behave as expected.'
    ]
  },
  {
    id: 'post-flight',
    title: 'Post-Flight Wrap-up',
    steps: [
      'Commit any manual UI preference files Obsidian updates (workspace state, etc.).',
      'Run `git status` to confirm no unexpected changes remain.',
      'Document discoveries or issues in `Workspaces/<layout>/INDEX.md` notes or open tasks.'
    ]
  }
];

function checkRequiredFiles() {
  return REQUIRED_FILES.map((relPath) => {
    const absolute = path.join(VAULT_ROOT, relPath);
    const exists = fs.existsSync(absolute);
    return { relPath, exists };
  });
}

function renderChecklist() {
  let output = '';
  output += '# Coffee Vault Manual Review Checklist\n\n';
  output += `Vault root: ${VAULT_ROOT}\n\n`;

  output += '## Required Assets\n\n';
  checkRequiredFiles().forEach(({ relPath, exists }) => {
    output += `${exists ? '[OK]   ' : '[MISS]'} ${relPath}\n`;
  });

  output += '\n## Manual Tasks\n\n';
  TASKS.forEach((task, index) => {
    output += `${index + 1}. ${task.title}\n`;
    task.steps.forEach((step) => {
      output += `   - ${step}\n`;
    });
    output += '\n';
  });

  output += '---\n';
  output += 'Use \`Configuration/Manual-Operations-Guide.md\` for detailed explanations.\n';
  return output;
}

function writeOutput(content, targetPath) {
  const absolute = path.isAbsolute(targetPath)
    ? targetPath
    : path.join(VAULT_ROOT, targetPath);
  const dir = path.dirname(absolute);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(absolute, content, 'utf8');
  console.log(`Checklist written to ${absolute}`);
}

function main() {
  const args = process.argv.slice(2);
  let markdownTarget = null;

  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--markdown') {
      markdownTarget = args[i + 1];
      i += 1;
    }
  }

  const checklist = renderChecklist();
  console.log(checklist);

  if (markdownTarget) {
    writeOutput(checklist, markdownTarget);
  }
}

if (require.main === module) {
  main();
}
