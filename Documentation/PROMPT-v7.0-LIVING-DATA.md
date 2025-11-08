---
type: transformation-prompt
version: 7.0.0
codename: Living Data
depends-on: 6.0.0
created: 2025-11-06
---

# ☕ Coffee Vault 7.0: Living Data Transformation

**Mission**: Connect static content to dynamic data through real-time integration, enhanced visualizations, and advanced automation. Make the vault feel "alive" with actual user data flowing through every interface.

**Timebox**: 16-hour intensive build sprint
**Approach**: Maximum parallel agent processing (5 concurrent agents)
**Quality Standard**: Production-ready, tested, documented

---

## 🎯 PRIME DIRECTIVE

Transform Coffee Vault from a static knowledge base into a dynamic, data-driven intelligence system where:
1. **Visualizations display real user data** (not sample data)
2. **Dashboards update automatically** when logs change
3. **Automation is intelligent** and context-aware
4. **Performance is optimized** (<2s data extraction, <200ms queries)
5. **User experience is seamless** (no manual data exports)

---

## 📋 PARALLEL EXECUTION PLAN

### Agent 1: Real-Time Data Extraction System (Priority: CRITICAL)

**Your Mission**: Create comprehensive data extraction pipeline from markdown vault to queryable JSON.

**Deliverables**:

1. **`Scripts/data-loader.js`** (Production-ready Node.js script)
   - Scan all Coffee Logs, Beans, Origins, Recipes, Equipment
   - Parse frontmatter and extract structured data
   - Generate JSON files in `Data/extracted/`
   - Implement smart caching (only re-parse changed files)
   - Performance target: <2s full extraction, <200ms incremental
   - Handle edge cases (missing frontmatter, malformed YAML)
   - Include dry-run mode and verbose logging

2. **`Data/extracted/` structure**:
   ```
   Data/extracted/
   ├── coffee-logs.json (all logs with full metadata)
   ├── beans.json (all bean profiles)
   ├── origins.json (all origin profiles)
   ├── recipes.json (all brewing recipes)
   ├── equipment.json (all equipment)
   ├── metadata.json (extraction timestamp, file counts, version)
   └── cache/ (file hashes for change detection)
   ```

3. **`Scripts/data-loader-lib.js`** (Reusable library)
   - parseMarkdownFile(path) → {frontmatter, content}
   - extractEntity(file, entityType) → structured object
   - cacheManager.isChanged(file) → boolean
   - jsonExporter.write(data, filename)
   - performanceMonitor.logMetrics()

4. **Configuration**: Add to `automation-config.json`
   - extractionPaths: which folders to scan
   - outputPath: where to write JSON
   - cacheStrategy: "aggressive" | "normal" | "minimal"
   - includeContent: whether to include full note content

5. **Testing**: Create `Scripts/test-data-loader.js`
   - Test with small dataset (10 files)
   - Test with full vault (900+ files)
   - Test incremental updates
   - Verify JSON structure validity
   - Performance benchmarking

6. **Documentation**: `Documentation/DATA-EXTRACTION-GUIDE.md`
   - How the system works
   - Running extractions (manual, automated, scheduled)
   - JSON schema documentation
   - Troubleshooting guide
   - Performance tuning tips

**Success Criteria**:
- ✅ Extracts all entities from vault successfully
- ✅ Full extraction completes in <2 seconds
- ✅ Incremental extraction in <200ms
- ✅ JSON is valid and queryable
- ✅ Caching works (doesn't re-parse unchanged files)
- ✅ npm run extract-data works reliably
- ✅ Complete documentation

---

### Agent 2: Visualization Enhancement & Accessibility (Priority: HIGH)

**Your Mission**: Upgrade all 25 existing visualizations with unified controls, accessibility fixes, and real data integration.

**Deliverables**:

1. **`Visualizations/shared-controls.js`** (Reusable UI library)
   - StandardControlPanel class (filters, time range, export)
   - ExportManager (PNG, SVG, CSV, PDF)
   - AccessibilityHelper (ARIA labels, keyboard nav, screen reader support)
   - ThemeManager (light/dark mode toggle)
   - DataLoader (fetch from extracted JSON)
   - ResponsiveHelper (mobile/tablet optimizations)

2. **Update All 25 Visualizations**:
   
   **3D Visualizations (7 files)**:
   - 3d-flavor-space.html
   - 3d-coffee-universe.html
   - 3d-extraction-landscape.html
   - 3d-brewing-parameter-space.html
   - 3d-origin-globe.html
   - 3d-quality-timeline.html
   - 3d-bean-network.html
   
   **Changes per file**:
   - Import shared-controls.js
   - Replace sample data with DataLoader.loadCoffeeLogs()
   - Add StandardControlPanel with filters
   - Add ExportManager for screenshots
   - Fix all accessibility issues (from audit report)
   - Add keyboard controls (arrow keys, zoom, reset)
   - Implement dark mode support
   - Add loading states and error handling
   - Optimize performance (60 FPS target)

   **2D Analytics (10 files)**:
   - interactive-brewing-dashboard.html
   - flavor-compass.html
   - brewing-triangle.html
   - cost-performance-dashboard.html
   - brewing-methods-radar.html
   - (Continue for all Chart.js visualizations)
   
   **Tools & Calculators (8 files)**:
   - grind-size-calculator.html
   - water-chemistry-calculator.html
   - extraction-zone-mapper.html
   - (Continue for all calculator tools)

3. **`Visualizations/shared-styles.css`** (Unified styling)
   - Consistent color palette matching Coffee Vault 6.0
   - Unified control panel styling
   - Dark mode CSS variables
   - Responsive breakpoints
   - Accessibility improvements (focus states, high contrast)

4. **Accessibility Fixes** (56 issues from audit):
   - Add ARIA labels to all interactive elements
   - Implement proper heading hierarchy
   - Add alt text to all images/charts
   - Ensure 4.5:1 contrast ratios
   - Add keyboard navigation support
   - Create skip links
   - Test with screen readers (NVDA/VoiceOver)

5. **Documentation**:
   - Update `Visualizations/README.md` with:
     - How to use real data (not sample data)
     - Control panel features
     - Export functionality
     - Keyboard shortcuts
     - Accessibility features
     - Mobile usage tips
   - Add `Visualizations/DEVELOPMENT-GUIDE.md`:
     - How to create new visualizations
     - Using shared-controls.js
     - Performance best practices
     - Testing checklist

**Success Criteria**:
- ✅ All 25 visualizations updated and functional
- ✅ All load real user data (when available, sample as fallback)
- ✅ Unified control panel across all visualizations
- ✅ Export works (PNG, SVG, CSV)
- ✅ Accessibility score >95 (from 70)
- ✅ Mobile usability score >90
- ✅ Dark mode works consistently
- ✅ 60 FPS maintained on reference hardware
- ✅ Complete documentation

---

### Agent 3: Advanced Automation Scripts (Priority: MEDIUM)

**Your Mission**: Create intelligent automation tools for content management and quality improvement.

**Deliverables**:

1. **`Scripts/link-suggester-ai.js`** (Smart link recommendations)
   - Analyze note content using NLP techniques
   - Find related notes based on content similarity
   - Suggest bidirectional links (with confidence scores)
   - Identify missing links in knowledge graph
   - Generate report with actionable suggestions
   - CLI options: --file, --all, --min-confidence, --auto-add

2. **`Scripts/duplicate-detector.js`** (Find similar content)
   - Compare all notes for similarity (fuzzy matching)
   - Detect near-duplicate notes (>80% similar)
   - Find redundant scientific references
   - Suggest merges with diff preview
   - CLI options: --threshold, --ignore-templates, --report-only

3. **`Scripts/content-quality-scorer.js`** (Rate note quality)
   - Score notes 0-100 based on:
     - Completeness (all required fields)
     - Word count (meets minimums)
     - Link density (well-connected)
     - Citation presence (scientific content)
     - Freshness (recently updated)
     - Engagement (query frequency if trackable)
   - Generate quality report with improvement suggestions
   - Highlight top 10 and bottom 10 notes
   - CLI options: --threshold, --entity-type, --detailed

4. **`Scripts/auto-tagger.js`** (Intelligent tag suggestions)
   - Analyze note content and extract keywords
   - Suggest relevant tags based on:
     - Existing tag hierarchy
     - Content analysis
     - Entity type patterns
     - Related note tags
   - Respect 6-level tag hierarchy
   - CLI options: --dry-run, --auto-apply, --confidence-threshold

5. **Enhanced `automation-config.json`**:
   - Add scheduling configuration (cron expressions)
   - Link suggestion settings (confidence thresholds)
   - Duplicate detection sensitivity
   - Quality score weights
   - Auto-tagging rules
   - Notification preferences

6. **`Scripts/scheduled-maintenance.js`** (Automation orchestrator)
   - Run daily/weekly/monthly maintenance tasks
   - Execute in sequence: extract-data → vault-ci → quality-check → link-suggest
   - Generate combined report
   - Send notifications (if configured)
   - CLI options: --schedule, --tasks, --report-email

7. **Documentation**: `Configuration/ADVANCED-AUTOMATION-GUIDE.md`
   - Comprehensive guide to all automation scripts
   - Setting up scheduled tasks (cron, Task Scheduler, GitHub Actions)
   - Configuring notification systems
   - Best practices for automation
   - Troubleshooting common issues

**Success Criteria**:
- ✅ All 4 new scripts working and tested
- ✅ Link suggestions are accurate and helpful
- ✅ Duplicate detection finds true duplicates
- ✅ Quality scores correlate with actual quality
- ✅ Auto-tagging respects hierarchy and patterns
- ✅ Scheduled maintenance runs reliably
- ✅ npm scripts added for easy execution
- ✅ Complete documentation

---

### Agent 4: Quality of Life Improvements (Priority: MEDIUM)

**Your Mission**: Reduce friction in daily workflows through CSS, UI, and UX enhancements.

**Deliverables**:

1. **Floating Action Bar** (`CSS/floating-actions.css`)
   - Sticky bottom-right floating action button (FAB)
   - Expandable menu with common actions:
     - New Coffee Log (quick capture)
     - Search vault
     - Recent files (last 10)
     - Quick navigation (jump to dashboard)
     - Extract data (trigger data-loader)
   - Mobile-optimized (larger touch targets)
   - Keyboard accessible (Shift+Space to open)
   - Customizable (show/hide actions based on user config)

2. **Recent Items Sidebar** (Update existing CSS)
   - Add right sidebar component
   - Show last 10 viewed/edited notes
   - Click to open
   - Drag to reorder
   - Pin favorites to top
   - Clear recent history button
   - Persists across sessions (localStorage)

3. **Keyboard Shortcuts Documentation** (`Configuration/KEYBOARD-SHORTCUTS.md`)
   - Document all existing Obsidian shortcuts
   - Add Coffee Vault specific shortcuts:
     - Cmd/Ctrl+Shift+L: Quick log coffee
     - Cmd/Ctrl+Shift+E: Extract data
     - Cmd/Ctrl+Shift+V: Open visualization hub
     - Cmd/Ctrl+Shift+D: Open persona dashboard
     - Cmd/Ctrl+Shift+A: Open automation panel
     - Shift+Space: Toggle floating actions
   - Create printable cheat sheet (PDF)
   - Add in-app keyboard shortcut help (press ?)

4. **Enhanced Search** (CSS + documentation)
   - Style search results for better scanning
   - Add search result previews (show context)
   - Implement fuzzy search documentation
   - Search tips and tricks guide
   - Advanced search operators reference

5. **Template Variants**:
   - **`Templates/Coffee-Log-Quick.md`** (Light - 5 fields)
     - Date, Beans, Method, Rating, Quick Notes
   - **`Templates/Coffee-Log-Standard.md`** (Medium - 12 fields)
     - Current template level
   - **`Templates/Coffee-Log-Detailed.md`** (Heavy - 25+ fields)
     - Complete data capture including photos, environment, equipment details

6. **Dashboard Quick Actions**:
   - Add action buttons to all persona dashboards
   - "Log Coffee", "View Analytics", "Explore Science"
   - Links to most common tasks
   - Keyboard accessible
   - Mobile-optimized

7. **CSS Enhancements**:
   - Improve loading states (skeleton screens)
   - Add smooth page transitions
   - Enhance hover effects
   - Improve mobile navigation
   - Add toast notifications (success, error, info)

8. **Documentation**: Update workspace guides with QoL features

**Success Criteria**:
- ✅ Floating action bar works on all dashboards
- ✅ Recent items sidebar functional and persistent
- ✅ All keyboard shortcuts documented and working
- ✅ Search improvements visible and helpful
- ✅ 3 template variants available and functional
- ✅ Dashboard quick actions on all personas
- ✅ CSS polish applied and rendering correctly
- ✅ User satisfaction: "Faster, smoother, easier"

---

### Agent 5: Testing, QA & Documentation (Priority: CRITICAL)

**Your Mission**: Ensure all v7.0 work is tested, integrated, documented, and production-ready.

**Deliverables**:

1. **Integration Testing**:
   - Test data-loader → visualization pipeline end-to-end
   - Verify all 25 visualizations load real data
   - Test automation scripts on full vault
   - Check QoL features across all personas
   - Validate mobile experience on actual devices
   - Test keyboard navigation throughout vault
   - Screen reader testing (NVDA, VoiceOver)

2. **Performance Benchmarking**:
   - Data extraction: Measure full and incremental times
   - Visualization rendering: FPS monitoring on 10 hardware configs
   - Dashboard load times: Target <1s confirmed
   - Script execution: All automation <5s confirmed
   - Generate performance report comparing v6.0 vs v7.0

3. **Accessibility Validation**:
   - Run accessibility-audit.js on all HTML files
   - Manual testing with screen readers
   - Keyboard navigation through all interfaces
   - Color contrast verification (4.5:1 minimum)
   - Generate accessibility compliance report
   - Target: 95+ score (from v6.0's 70)

4. **User Journey Testing**:
   - Update user-journey-simulator.js with v7.0 journeys
   - Add new journeys:
     - Journey 5: Log coffee → See it in visualization → Export chart
     - Journey 6: Run automation scripts → Review reports → Fix issues
     - Journey 7: Mobile: Quick log → View dashboard → Navigate vault
   - Validate all journeys complete successfully
   - Measure completion times

5. **Documentation Audit**:
   - Review all new documentation for completeness
   - Ensure all code has inline comments
   - Verify all scripts have --help output
   - Check all README files are up-to-date
   - Create comprehensive v7.0 changelog
   - Update root README with v7.0 features

6. **Release Preparation**:
   - Run complete QA suite (vault-ci, accessibility, user-journeys)
   - Fix any critical issues found
   - Generate v7.0 release notes (comprehensive)
   - Update version.json to 7.0.0
   - Create migration guide (6.0 → 7.0)
   - Prepare commit messages (detailed, organized)

7. **`Documentation/RELEASE-NOTES-v7.0.md`**:
   - Executive summary of changes
   - Feature breakdown by category
   - Before/after comparisons
   - Performance improvements
   - Known issues and workarounds
   - Migration instructions
   - Future roadmap preview (v8.0)

8. **Final QA Report**: `qe.vault-meta/reports/v7.0-qa-final.md`
   - All tests passed/failed summary
   - Performance benchmarks
   - Accessibility compliance
   - Known issues log
   - Sign-off checklist

**Success Criteria**:
- ✅ All integration tests pass
- ✅ Performance targets met
- ✅ Accessibility score >95
- ✅ All user journeys complete in ≤3 clicks
- ✅ Documentation complete and accurate
- ✅ Release notes comprehensive
- ✅ No critical bugs
- ✅ Ready for production deployment

---

## 🚀 EXECUTION WORKFLOW

### Phase 1: Launch Parallel Agents (Hour 0-1)

**Simultaneously launch all 5 agents** with their respective prompts. Each agent works independently on their deliverables.

```bash
# Launch all agents in parallel
Task Agent1: Real-time data extraction
Task Agent2: Visualization enhancement
Task Agent3: Advanced automation
Task Agent4: Quality of life improvements
Task Agent5: Testing & documentation (starts after Hour 4)
```

### Phase 2: Development Sprint (Hours 2-12)

Agents work concurrently. Sync points at:
- Hour 4: First integration checkpoint
- Hour 8: Mid-point review and adjustments
- Hour 12: Final integration

### Phase 3: Integration & Testing (Hours 13-14)

Agent 5 takes over:
- Integrate all agent work
- Run complete QA suite
- Fix critical issues
- Finalize documentation

### Phase 4: Release (Hours 15-16)

- Generate release notes
- Update version metadata
- Commit with detailed messages
- Push to branch
- Tag v7.0.0

---

## ✅ SUCCESS CRITERIA (Must All Pass)

### Technical Criteria
- ✅ Data extraction works (<2s full, <200ms incremental)
- ✅ All 25 visualizations display real data
- ✅ 4 new automation scripts operational
- ✅ Floating action bar and QoL features working
- ✅ Performance: Dashboards <1s, visualizations 60 FPS
- ✅ Accessibility score >95 (up from 70)
- ✅ Mobile usability >90 (up from 65)

### Quality Criteria
- ✅ No critical bugs
- ✅ All documentation complete
- ✅ All code commented and readable
- ✅ npm scripts for all new features
- ✅ Backward compatible with v6.0
- ✅ User journeys validated

### User Experience Criteria
- ✅ "Data feels alive" - visualizations show MY data
- ✅ "Faster and smoother" - QoL improvements noticeable
- ✅ "Intelligent automation" - scripts provide value
- ✅ "Everything just works" - no friction in workflows

---

## 📊 DELIVERABLES CHECKLIST

### Code & Scripts (9 new files)
- [ ] Scripts/data-loader.js (production-ready)
- [ ] Scripts/data-loader-lib.js (reusable library)
- [ ] Scripts/link-suggester-ai.js
- [ ] Scripts/duplicate-detector.js
- [ ] Scripts/content-quality-scorer.js
- [ ] Scripts/auto-tagger.js
- [ ] Scripts/scheduled-maintenance.js
- [ ] Scripts/test-data-loader.js
- [ ] Visualizations/shared-controls.js

### Data & Configuration
- [ ] Data/extracted/ (JSON files with real vault data)
- [ ] automation-config.json (enhanced with new settings)
- [ ] package.json (updated with new npm scripts)

### Visualizations (25 updated files)
- [ ] All 3D visualizations (7) updated
- [ ] All 2D analytics (10) updated
- [ ] All tools/calculators (8) updated
- [ ] shared-styles.css created
- [ ] All using real data from Data/extracted/

### CSS & UI (3 new files)
- [ ] CSS/floating-actions.css
- [ ] CSS enhancements for recent items sidebar
- [ ] Updated design system with new components

### Templates (3 variants)
- [ ] Templates/Coffee-Log-Quick.md
- [ ] Templates/Coffee-Log-Standard.md
- [ ] Templates/Coffee-Log-Detailed.md

### Documentation (6 new/updated files)
- [ ] Documentation/DATA-EXTRACTION-GUIDE.md
- [ ] Documentation/RELEASE-NOTES-v7.0.md
- [ ] Documentation/ADVANCED-AUTOMATION-GUIDE.md
- [ ] Configuration/KEYBOARD-SHORTCUTS.md
- [ ] Visualizations/README.md (updated)
- [ ] Visualizations/DEVELOPMENT-GUIDE.md (new)

### Testing & QA
- [ ] All integration tests pass
- [ ] Performance benchmarks documented
- [ ] Accessibility audit passed (>95 score)
- [ ] User journey tests passed
- [ ] .vault-meta/reports/v7.0-qa-final.md

---

## 🎯 AGENT COORDINATION

**Agent Dependencies**:
- Agent 2 depends on Agent 1 (needs Data/extracted/ for visualizations)
- Agent 5 depends on Agents 1-4 (integration testing)
- Agents 1, 3, 4 can run fully in parallel

**Communication Protocol**:
- Each agent reports progress hourly
- Agents post deliverables to shared location as completed
- Agent 5 monitors and identifies integration issues early

---

## 📝 FINAL COMMIT MESSAGE TEMPLATE

```
Release Coffee Vault 7.0 - Living Data

MAJOR RELEASE: Real-time data integration, enhanced visualizations,
advanced automation, and quality of life improvements.

KEY FEATURES:
✅ Real-time data extraction (900+ files → JSON in <2s)
✅ All 25 visualizations now use real user data
✅ 4 new intelligent automation scripts
✅ Floating action bar and QoL UI improvements
✅ Accessibility score 95+ (from 70)
✅ Mobile usability 90+ (from 65)

METRICS:
- Data extraction: 2s → <2s ✅
- Visualization accessibility: 70 → 95 (+35%)
- Automation scripts: 4 → 9 (+125%)
- Mobile experience: 65 → 90 (+38%)
- User satisfaction: "Data feels alive"

DELIVERABLES:
- 9 new scripts (data-loader, automation, QoL)
- 25 visualizations upgraded to real data
- 3 coffee log template variants
- 6 comprehensive documentation files
- Complete QA validation

Version: 7.0.0
Release: [Date]
Build: Production-ready
```

---

**Coffee Vault 7.0: Living Data**
**Status**: Ready for Execution
**Agent Count**: 5 parallel agents
**Timeline**: 16 hours
**Vision**: "Data feels alive, automation is intelligent, experience is seamless"

**Execute this prompt to transform Coffee Vault from static to dynamic.**
