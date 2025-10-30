---
type: handbook
title: Manual Operations Guide
version: 5.1.0
date: 2025-10-28
status: active
summary: Central reference for every manual (non-scriptable) task required to operate and maintain the Coffee Vault inside Obsidian.
---

# Manual Operations Guide

This guide consolidates every manual task you need to perform inside Obsidian or related tooling. Use it alongside the scripted checklist (`Scripts/manual-review-checklist.js`) to ensure nothing is missed after structural changes, plugin updates, or onboarding a new device.

## 1. Quick Start

1. **Run the scripted checklist**:
   ```bash
   node Scripts/manual-review-checklist.js --markdown Reports/manual-review-latest.md
   ```
   This prints the full checklist to the console and optionally saves a Markdown copy for record keeping.
2. **Open this guide** (`Configuration/Manual-Operations-Guide.md`) in Obsidian for detailed context while you complete each section.
3. **Work through the sections below** in order. Mark progress in your personal task manager or annotate the saved report.

---

## 2. Preflight & Environment

- [ ] Confirm you are on the latest `main` branch and `git status` is clean.
- [ ] Update community plugins (Settings → Community Plugins → Check for updates).
- [ ] Verify Obsidian core version meets project minimum (1.6+ recommended).
- [ ] Ensure required files exist:
  - `Workspaces/Daily-Brewing/INDEX.md`
  - `Workspaces/Analytics-Analysis/INDEX.md`
  - `Workspaces/Learning-Education/INDEX.md`
  - `Workspaces/Supply-Chain/INDEX.md`
  - `.obsidian/workspace-layouts/*.json`
  - `Configuration/Folder-Architecture.md`
  - This guide 😄

---

## 3. Workspace Layout Verification

Perform for each saved layout (Settings → Workspaces → Load):

### Daily Brewing Layout
- [ ] Load layout; confirm panes show `HOME-DASHBOARD`, `Templates/Coffee-Log-v5`, and `Analytics/Daily-Brewing-Layout/9-Real-Time-Brewing-Assistant`.
- [ ] Ensure Equipment Maintenance Dashboard renders without "File moved" warnings.
- [ ] Re-pin panels if Obsidian shows missing references.

### Analytics & Analysis Layout
- [ ] Verify all analytics dashboards open from the left tab stack (1–8).
- [ ] Confirm `Views/Analytics-Analysis-Layout/Advanced-Analytics-Base.md` loads in the side pane.
- [ ] Scroll through Datacore tables to check for missing property warnings.

### Learning & Education Layout
- [ ] Validate Scientific Reference index and Extraction science notes open.
- [ ] Confirm Goals Dashboard and Palate tracker display data.
- [ ] Check `Goals` template shortcuts if you have personal ones configured.

### Supply Chain & Transparency Layout
- [ ] Ensure Supply Chain dashboard and visualization base render.
- [ ] Review pinned producer profile for accuracy.
- [ ] Confirm Kanban board shows correct swim-lanes.

---

## 4. Favorites, Pins, and Quick Access

- [ ] Refresh Starred notes with new workspace indexes (`Workspaces/.../INDEX`).
- [ ] Update Command Palette favorites for frequently used dashboards.
- [ ] Clear outdated pins (right-click tab → Close) and re-pin using the new paths.
- [ ] If you use the Bookmarks plugin, update bookmarked paths accordingly.

---

## 5. Plugin Configuration Alignment

### Templater
- [ ] Folder: `Templates/`
- [ ] Trigger Templater reload (Command Palette → `Templater: Reload Templates`).
- [ ] Re-run any user scripts tied to templater buttons to confirm no errors.

### Datacore / Dataview
- [ ] Command Palette → `Datacore: Rebuild indices`.
- [ ] Review the console for warnings (View → Toggle Developer Tools → Console).
- [ ] Test a few commonly used queries (see Section 6).

### Buttons & QuickAdd (if installed)
- [ ] Update commands referencing old analytics/view paths.
- [ ] Test each button/quick-add recipe to ensure it still launches the correct note or script.

### Kanban
- [ ] Open each board in `Plugin Configurations/Kanban/` and confirm column names/tags remain intact.

---

## 6. Datacore & Dashboard Validation

Open the following views and confirm they render expected data:

- `Views/Analytics-Analysis-Layout/Advanced-Analytics-Base.md`
- `Views/Daily-Brewing-Layout/Live-Weekly-Summary.md`
- `Views/Daily-Brewing-Layout/Live-Inventory-Status.md`
- `Views/Learning-Education-Layout/Enhanced-Bean-Library-Base.md`
- `Views/Supply-Chain-Layout/Producer-Database-View.md`
- `Views/Supply-Chain-Layout/Supply-Chain-Visualization-Base.md`

Troubleshooting tips:
- Use Datacore’s `inspect` command to view raw query output.
- Cross-check property schemas in `Configuration/Property-Schema.md`.
- Re-run the automated scripts if data appears stale (`Scripts/weekly-summary-generator.js`, etc.).

---

## 7. Visualization Hub Sanity Check

- [ ] Open `Visualizations/VISUALIZATION-HUB.html` in a browser.
- [ ] Click through each visualization to ensure URLs match the renamed analytics/view paths.
- [ ] Verify help overlays, axis labels, and rotation toggles behave correctly.
- [ ] If any visualization fails to load assets, confirm CDN access or local fallback files.

---

## 8. Automation Scripts & Scheduled Jobs

Manual check cadence (weekly recommended):

- [ ] Run `node Scripts/weekly-summary-generator.js`
- [ ] Run `node Scripts/monthly-report-generator.js`
- [ ] Run `node Scripts/supply-chain-tracker.js`
- [ ] Review outputs saved in `Reports/` or configured destination folders.
- [ ] Update cron or external schedulers if file paths changed.

After each run, inspect logs for warnings and commit generated reports if desired.

---

## 9. Post-Flight Wrap-Up

- [ ] Review `Reports/manual-review-latest.md` or console output for noted issues.
- [ ] Commit any Obsidian `.obsidian/workspace` updates you wish to keep.
- [ ] Push changes to GitHub (`git push`) or stash if experimenting.
- [ ] Record lessons learned or adjustments directly in the relevant `Workspaces/.../INDEX.md` note.

---

## 10. Periodic & Onboarding Tasks

Use this section for rare but important manual operations:

- **New Device Setup**: Repeat Sections 2–9 and ensure plugin settings sync via your preferred method.
- **Plugin Addition**: Document configuration steps in `Configuration/Manual-Operations-Guide.md` under the appropriate section.
- **Workspace Creation**: After saving a new layout, add its index note under `Workspaces/` and update `Configuration/Folder-Architecture.md`.
- **Obsidian Updates**: After major version upgrades, re-run the scripted checklist to catch regressions.

---

## 11. Keeping This Guide Current

- Update this document whenever you discover a new manual step.
- If you script a manual process, note the script in Section 8 and remove the corresponding checkbox from earlier sections.
- Reference `Configuration/Folder-Architecture.md` whenever you reorganize the vault.

---

**All manual tasks are now centralized.** Run the checklist script, work through these sections, and you’ll never miss a step.
