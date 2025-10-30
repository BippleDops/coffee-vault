---
type: configuration-guide
title: Coffee Vault Folder Architecture 5.1
version: 5.1.0
date: 2025-10-28
status: active
summary: Overview of the layout-aligned folder structure introduced in Coffee Vault 5.1.
---

# 📁 Coffee Vault Folder Architecture (Layout-Aligned)

The Coffee Vault now organizes analytical assets according to the four curated Obsidian workspace layouts. This guide explains the new structure and how each bundle relates to the saved layouts.

## 1. Layout-Aligned Topology

```
Analytics/
  Analytics-Analysis-Layout/
  Daily-Brewing-Layout/
  Learning-Education-Layout/
  Supply-Chain-Layout/
Views/
  Analytics-Analysis-Layout/
  Daily-Brewing-Layout/
  Learning-Education-Layout/
  Supply-Chain-Layout/
  Shared-Resources/
Workspaces/
  Analytics-Analysis/
  Daily-Brewing/
  Learning-Education/
  Supply-Chain/
```

Each workspace folder contains an `INDEX.md` launch note with curated links to dashboards, Datacore bases, templates, Kanban boards, and automation scripts.

## 2. Layout Crosswalk

| Workspace Layout | Analytics Subfolder | Views Subfolder | Workspace Index |
| --- | --- | --- | --- |
| Daily Brewing Layout | `Analytics/Daily-Brewing-Layout/` | `Views/Daily-Brewing-Layout/` | `Workspaces/Daily-Brewing/INDEX.md` |
| Analytics & Analysis Layout | `Analytics/Analytics-Analysis-Layout/` | `Views/Analytics-Analysis-Layout/` | `Workspaces/Analytics-Analysis/INDEX.md` |
| Learning & Education Layout | `Analytics/Learning-Education-Layout/` | `Views/Learning-Education-Layout/` | `Workspaces/Learning-Education/INDEX.md` |
| Supply Chain & Transparency Layout | `Analytics/Supply-Chain-Layout/` | `Views/Supply-Chain-Layout/` | `Workspaces/Supply-Chain/INDEX.md` |

## 3. Navigation Enhancements

- `HOME-DASHBOARD` now presents dashboards grouped by workspace.
- Command palette search surfaced as `"Daily Brewing Workspace"`, `"Analytics Workspace"`, etc. via the new index notes.
- Workspace layouts in `.obsidian/workspace-layouts/` point directly to the new folder locations.

## 4. Migration Checklist

1. Update any personal backlinks pointing to old `Analytics/*.md` or `Views/*.md` paths.
2. Re-pin dashboard tabs in Obsidian if they show the "File moved" indicator.
3. Review workflows referencing automation scripts to ensure context still accurate.
4. Bookmark the `Workspaces/` directory for instant workspace switching.

## 5. Future Consolidation Ideas

- Populate `Views/Shared-Resources/` with reusable components (e.g., tables, callouts).
- Add Datacore query snippets per workspace in `Workspaces/<workspace>/Snippets/`.
- Automate path updates via a pre-commit hook to prevent regressions.

---

**Result:** Folder hierarchy now mirrors the mental model established by Obsidian layouts, reducing cognitive load and simplifying onboarding.
