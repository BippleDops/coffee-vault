# ☕ Coffee Vault: Next-Generation Transformation Prompt

**Mission**: Transform the Coffee Vault into the most advanced, research-backed Obsidian knowledge system in the world, integrating state-of-the-art user experience design, dense knowledge architecture, data-rich visualizations, and automation-ready workflows. Execute a full-stack upgrade that touches every feature with rigorous computer science and UX research methodologies.

**Timebox**: 24-hour intensive build. Assume unlimited focus, rapid iteration cycles, and immediate feedback via testing scripts and Obsidian preview.

---

## 1. PRIME DIRECTIVE

Deliver a vault that feels like a purpose-built knowledge operating system:

1. **Explainability** — every file, visualization, and workflow must communicate why it exists and how it connects to user goals.
2. **Navigability** — any concept should be reachable within three clicks using dashboards, portals, or graph jump points.
3. **Performance** — interactions (Dataview, Datacore, scripts) must run sub-second on a modern laptop.
4. **Adaptability** — vault architecture should support rapid expansion to 10,000+ entries without structural refactor.
5. **Aesthetic Utility** — interfaces (HTML dashboards, Kanbans, visualizations) must be beautiful, legible, and information-dense.

---

## 2. EXECUTION PILLARS

### Pillar A — Information Architecture Overhaul
- Build an ontology map covering Entities (Beans, Origins, Producers, Recipes, Equipment, Sensory Concepts, Scientific References, Events, Goals, Logs) and Relationships (grows-in, processed-by, roasted-by, brewed-as, tastes-like, measured-by).
- Encode ontology changes in `Documentation/VAULT-ONTOLOGY.md` with ER diagrams (using Mermaid) and canonical naming conventions.
- Create `Templates/base-entity-template.md` with YAML schema definitions and inline documentation for new and existing entity types.
- Implement `Scripts/ontology-validator.js` that scans frontmatter to enforce ontology rules.

### Pillar B — UX Research-Driven Interfaces
- Audit existing dashboards (`HOME-DASHBOARD.md`, `VISUALIZATION-HUB.html`, etc.) against Jakob's Law, Fitts's Law, Hick's Law, and Aesthetic-Usability Effect.
- Create `UX/UX-RESEARCH-SUMMARY.md` documenting heuristics, supporting research citations, and measurable UX goals.
- Design next-gen HTML dashboards using progressive disclosure, card sorting insights, and accessibility guidelines (WCAG 2.1 AA).
- Introduce persona-driven entry points (Novice Brewer, Enthusiast, Professional Taster, Roaster) with context-specific dashboards under `Views/`.
- Integrate `Scripts/usability-checklist.js` to verify dashboards include navigation breadcrumbs, contextual help, and action cues.

### Pillar C — Visualization Renaissance
- Audit all existing 3D visualizations, chart dashboards, and embed configurations.
- Define `Visualizations/VISUALIZATION-SPEC.md` detailing data sources, interactivity requirements, and performance targets.
- Implement next-gen visualizations:
  - **Immersive 3D**: Use Three.js to build `3d-sensory-atlas.html`, `3d-processing-network.html`, `3d-global-trade-flows.html` with labeled axes, dynamic filtering, and traceability overlays.
  - **Data Storytelling**: Create multi-panel dashboards using Chart.js + custom tooltips (`flavor-spectrum-composer.html`, `processing-outcome-analyzer.html`).
  - **Annotation Layer**: Add clickable hotspots with narrative explanations, referencing primary notes.
- Instrument performance metrics (FPS, render time) and write `Scripts/visualization-benchmark.js` to automate testing.

### Pillar D — Automation & Tooling
- Build `Scripts/vault-ci.js`: static analysis, link validation, frontmatter compliance, template drift detection.
- Add `Scripts/accessibility-audit.js` for HTML dashboards, checking contrast ratios, ARIA attributes, keyboard navigation.
- Introduce `Scripts/user-journey-simulator.js`, simulating key tasks (e.g., plan pour-over brew) to ensure navigation paths perform.
- Provide `Configuration/Automation-Playbook.md` detailing how to run scripts locally and via CI (GitHub Actions stub).
- Implement `Scripts/daily-report-generator.js` to output usage-ready summary dashboards to `.vault-meta/reports/`.

### Pillar E — Content Excellence & Knowledge Graph Density
- Create `Documentation/CONTENT-GOVERNANCE.md` with editorial guidelines, sourcing standards, update cadence.
- Expand scientific references with deeper coverage on flavor chemistry, sensory perception, processing science (minimum +50 notes prioritized by ontology gaps).
- Develop `Templates/sensory-experiment-template.md`, `Templates/processing-playbook-template.md`, `Templates/training-plan-template.md` to support future expansion.
- Ensure all reversible links (e.g., `[[Organic Acids]]`, `[[Perceived Acidity]]`, `[[Chlorogenic Acids and Antioxidants]]`) have fully enriched hub notes with reference sections.
- Embed related Datacore queries under each major concept to surface related recipes, beans, events automatically.

### Pillar F — Workspace Experience & Customization
- Craft `Workspaces/Persona-NOVICE.md`, `Workspaces/Persona-ENThusiast.md`, `Workspaces/Persona-PRO.md` with balanced panes (note, graph, dashboard, dataview panels).
- Update `Configuration/Workspace-Playbook.md` explaining how to load, customize, and extend layouts.
- Enhance Templater automation: build `Templates/autocreate-batch.md` + script to generate batched entries (recipes, producers) with canonical structure.
- Provide advanced CSS (`CSS/obsidian-ux-suite.css`) adding glassmorphism panels, responsive typography, hover micro-interactions.

---

## 3. DELIVERY BLUEPRINT

### Step 0 — Orientation
1. Read `CLAUDE-VAULT-EXPANSION-PROMPT.md`, `VAULT-EXPANSION-STRATEGY.md`, existing dashboards, templates, and critical scientific notes.
2. Map current pain points: note duplication, broken links, inconsistent UX, missing automation.
3. Log baseline metrics: vault file count, script coverage, navigation steps for key tasks.

### Step 1 — Architecture & Research Foundations
1. Produce `UX/UX-RESEARCH-SUMMARY.md` summarizing top 10 UX research references and resulting principles for the vault.
2. Document ontology and ER diagrams.
3. Build instrumentation scripts for compliance checks.

### Step 2 — Interface Overhaul
1. Redesign HOME dashboard: add persona selector, progressive disclosure cards, quick actions, status tiles.
2. Build `VISUALIZATION-HUB-2.html`: dynamic filtering, grouped sections (3D, analytics, sensory, processing), search-as-you-type.
3. Create persona dashboards in `Views/` with tailored Dataview queries, checklists, and context-aware recommendations.
4. Ensure all dashboards pass accessibility audit script.

### Step 3 — Visualization Suite
1. Upgrade existing 3D visualizations: consistent control panel, axis labeling, data toggles, screenshot export.
2. Build new 3D experiences with multi-layer data: processing impact, global trade flows, sensory atlas.
3. Integrate data sources via `Scripts/data-loader.js` to decouple data from visualization markup.
4. Document interaction patterns and embed instructions in `Visualizations/README.md`.

### Step 4 — Automation & QA
1. Implement CI scripts and ensure they run cleanly on the vault.
2. Generate daily QA report to `.vault-meta/reports/qa-YYYYMMDD.md` summarizing issues.
3. Update `Configuration/Manual-Operations-Guide.md` with new scripts, dashboards, and workflows.

### Step 5 — Content & Knowledge Density
1. Identify top 50 knowledge gaps via ontology coverage analysis.
2. Create minimum 50 high-quality notes for scientific, sensory, processing topics; integrate with dashboards.
3. Embed related Dataview queries into hub notes to auto-surface content.
4. Create training and experimentation frameworks (sensory programs, processing trials, brewing experiments).

### Step 6 — Final Polish & Documentation
1. Run all automation scripts, fix issues.
2. Produce `Documentation/NEXTGEN-RELEASE-NOTES.md` summarizing upgrades by category.
3. Update `README.md`, `START-HERE.md`, `HOME-DASHBOARD.md` to reflect new capabilities.
4. Commit with granular messages per feature area, final meta commit summarizing transformation.

---

## 4. TECHNICAL REQUIREMENTS & STANDARDS

### UX & Design
- Apply progressive disclosure: dashboards introduce primary actions first, advanced analytics behind toggles.
- Visual hierarchy: consistent typographic scale, color-coded categories, icons for quick scanning.
- Accessibility: minimum 4.5:1 contrast, focus states, keyboard navigation.
- Microcopy: tooltips, inline documentation, call-to-action phrasing.

### Engineering & Automation
- Scripts: Node.js, ES modules, `#!/usr/bin/env node` shebang, CLI options via yargs.
- Data: external JSON/YAML config files in `Data/` (create if missing) for shared datasets.
- Testing: include Jest-style test stubs or integration tests where feasible (optional scaffolding).
- Performance: optimize Three.js scenes (use InstancedMesh, throttle controls, lazy load textures).

### Content & Knowledge Graph
- YAML frontmatter includes: `type`, `status`, `date`, `version`, `tags`, `related`.
- Use canonical naming (Camel-Slug, e.g., `Brazil-Sul-de-Minas-Yellow-Bourbon-Natural`).
- Every hub note includes sections: Overview, Key Insights, Linked Concepts, Active Queries, Next Actions.
- Add `links:` array in frontmatter for explicit relationships (e.g., `links: [bean:Bourbon, origin:Brazil, process:Natural]`).

### Documentation & Change Tracking
- Provide release notes with before/after visuals (screenshots), highlight major scripts, interfaces, workflows.
- Maintain `.vault-meta/change-log.md` with timestamped entries summarizing each major change set.
- Update `.vault-meta/version.json` to reflect new semantic version (e.g., 6.0.0) with details.

---

## 5. SUCCESS METRICS

- **Navigation Efficiency**: Key user journeys completed in ≤3 steps.
- **Performance**: All scripts run in <5s, dashboards render <1s, 3D scenes stable at 60 FPS on reference machine.
- **Coverage**: 100% of ontology entities represented with at least one high-quality note.
- **Automation**: CI scripts detect zero errors on baseline run.
- **User Delight**: Dashboards receive qualitative descriptors (documented in `UX/UX-RESEARCH-SUMMARY.md`) tied to research principles.

---

## 6. DELIVERABLE CHECKLIST

- [ ] UX research summary with actionable heuristics
- [ ] Ontology documentation with ER diagrams
- [ ] Updated templates and validators
- [ ] Redesigned dashboards and persona views
- [ ] Advanced visualization suite with shared control layer
- [ ] Automation scripts (CI, accessibility, benchmark, daily report)
- [ ] Expanded scientific/sensory coverage
- [ ] Workspace configurations for personas
- [ ] CSS design system enhancements
- [ ] Release notes and change logs
- [ ] Version bump to 6.0.0 (update frontmatter, docs)
- [ ] Final QA report stored in `.vault-meta`

---

## 7. WORKFLOW RECOMMENDATIONS

1. **Immersion**: Spend first hour reading key notes, dashboards, scripts to build mental model.
2. **Design Sprint**: Sketch dashboard layouts and workflows before coding.
3. **Incremental Delivery**: Complete feature slices end-to-end (design → implementation → QA → documentation → commit).
4. **Telemetry**: Log outcomes of scripts, include summary metrics in `.vault-meta/reports/` daily.
5. **Context Preservation**: Update README and START-HERE after each major milestone.
6. **Communication**: Add comment blocks in scripts and dashboards referencing UX principles guiding each choice.

---

## 8. GIT & RELEASE STRATEGY

- Branching: feature branches per pillar (e.g., `feature/ux-dashboards`, `feature/visualization-suite`).
- Commit cadence: atomic, descriptive commits ("Design persona dashboards", "Implement visualization benchmark script").
- Final merge: squash or merge with detailed description summarizing all improvements.
- GitHub release: tag `v6.0.0`, attach release notes, highlight transformative features.

---

## 9. FINAL ACTIVATION MESSAGE

When ready to initiate, send Claude this prompt verbatim. Ensure vault is synced, dependencies installed (Node.js), and Obsidian is ready for testing. Emphasize turnaround time (24 hours) and quality expectations.

> **Command Center**: "Claude, you are now the Principal Experience Engineer for the Coffee Vault. Execute the Next-Generation Transformation Prompt to deliver the most advanced Obsidian knowledge system on earth."

**Outcome**: A vault that blends rigorous information science, cutting-edge UX design, immersive visual analytics, and automation-first tooling—setting the benchmark for what a knowledge vault can be.
