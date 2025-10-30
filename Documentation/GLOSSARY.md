---
type: reference
title: Coffee Vault Glossary
version: 5.0.0
date: 2025-10-28
tags: [glossary, reference, terms]
---

# 📖 Coffee Vault Glossary

**Complete glossary of coffee and Coffee Vault terms**

---

## Coffee Terms

**Acidity**: Bright, tangy quality in coffee (citric, malic, etc.). Higher in light roasts and high-altitude coffees.

**Agtron**: Roast color measurement system (25-95 scale, lower = darker).

**Anaerobic Fermentation**: Processing method where coffee ferments in sealed, oxygen-free tanks. Creates unique, intense flavors.

**Arabica**: Primary coffee species. Higher quality, more complex flavors than Robusta. ~60% of world production.

**Barometric Pressure**: Atmospheric pressure affecting extraction (measured in mbar). Can influence brewing.

**Bloom**: Initial saturation phase in pour-over brewing. Releases CO₂, enables even extraction.

**Body**: Mouthfeel/weight of coffee. Ranges from light (tea-like) to full (syrupy).

**Burr Grinder**: Grinder using burrs (conical or flat) to crush beans uniformly. Essential for quality.

**Carbonic Maceration**: Processing inspired by wine-making. Coffee cherries ferment whole in CO₂ environment.

**Channeling**: Water finding paths of least resistance through coffee bed. Causes uneven extraction.

**Coffee Belt**: Geographic band 25°N to 25°S where coffee grows. Tropical/subtropical climates.

**Cupping**: Professional coffee tasting/evaluation method. Uses standardized SCA protocol.

**Direct Trade**: Purchasing model where roaster buys directly from producer/farm. Bypasses middlemen.

**Extraction Yield (EY%)**: Percentage of coffee solubles extracted. Optimal: 18-22%.

**Fair Trade**: Certification ensuring minimum prices, democratic cooperatives, community development.

**Fermentation**: Processing step where mucilage breaks down. Affects flavor significantly.

**First Crack**: Audible popping during roasting (~395°F). Marks light roast boundary.

**Gesha/Geisha**: Ultra-premium coffee variety. Known for floral, tea-like character. Expensive.

**Heirloom**: Traditional/indigenous coffee varieties. Common in Ethiopia.

**Honey Process**: Processing where some/all mucilage left on bean during drying. Sweet, fruity.

**Lot Number**: Batch identifier for traceability. Enables tracking specific harvests.

**Mucilage**: Sticky, sweet layer under coffee cherry skin. Removed (washed) or left (natural/honey).

**Natural Process**: Drying whole cherries (fruit on). Creates fruity, wine-like flavors.

**Organic**: Certification for coffee grown without synthetic chemicals. 3-year transition required.

**Processing**: Post-harvest method (washed, natural, honey, etc.). Hugely impacts flavor.

**Q Grader**: Certified professional coffee taster. Completes CQI training and exam.

**Roast Level**: Degree of roasting (light, medium, dark). Affects flavor dramatically.

**Robusta**: Secondary coffee species. Higher caffeine, bitter, used in blends. ~40% of production.

**SCA**: Specialty Coffee Association. Sets standards for specialty coffee (80+ cupping score).

**Second Crack**: Later popping in roasting (~425°F). Marks dark roast beginning.

**Specialty Grade**: Coffee scoring 80+ on SCA scale with <5 defects per 300g.

**TDS (Total Dissolved Solids)**: Brew strength measurement (percentage). Optimal: 1.15-1.55%.

**Terroir**: Geographic factors affecting coffee flavor (altitude, soil, climate, etc.).

**Varietal/Variety**: Coffee plant genetics (Bourbon, Typica, Caturra, etc.).

**Washed Process**: Removes fruit/mucilage before drying. Clean, bright, acidic flavors.

**Wet-Hulled (Giling Basah)**: Indonesian processing. Removes parchment while wet. Earthy flavors.

---

## Coffee Vault Terms

**Analytics Dashboard**: ML-powered data analysis pages in `Analytics/` folder.

**Base (Datacore)**: Reusable database view/query. Files ending in `.base` or in `Views/`.

**Bean Profile**: Entity type documenting coffee beans. Template: `Templates/Bean Profile.md`.

**Breadcrumbs**: Navigation trail showing current location in vault hierarchy.

**Coffee Log**: Primary entity - single brewing session record. Core data for all analytics.

**Cupping Session**: Formal cupping evaluation session. New in 5.0.

**Datacore**: Obsidian plugin powering queries and analytics. Required for Coffee Vault.

**Entity Type**: Category of note (coffee-log, bean-profile, etc.). 17 total in 5.0.

**Equipment Model**: Research database for equipment specifications. New in 5.0.

**Graph Relationship**: Explicit connection between entities. New in 5.0.

**Hierarchical Tags**: 6-level tag system (category, subcategory, attributes, quality, personal, temporal).

**Kanban Board**: Visual workflow board for tasks and processes.

**ML Model**: Machine learning algorithm (KNN, K-Means, etc.) for predictions.

**Producer Profile**: Farm/cooperative documentation. Supply chain transparency. New in 5.0.

**Property**: Data field in frontmatter (e.g., `brew-method`, `rating`). 500+ total.

**Recipe Profile**: Reusable brewing recipe with success tracking. New in 5.0.

**Relationship Type**: Standardized connection type (uses-bean, similar-to, etc.).

**Supply Chain**: Complete path from producer to consumer.

**Templater**: Obsidian plugin enabling smart templates with JavaScript.

**Transparency Score**: 1-10 rating of supply chain knowledge completeness.

**Visualization Hub**: Central webapp dashboard linking all visualization tools.

**Workspace Layout**: Saved window arrangement for different workflows (4 pre-configured).

---

## Technical Terms

**Dataviewjs**: JavaScript-based query language in Datacore/Dataview plugins.

**Frontmatter**: YAML metadata at top of markdown file (between `---` markers).

**Kebab-case**: Naming convention with hyphens (`brew-method`, not `brewMethod`).

**Progressive Disclosure**: UX pattern showing features when user is ready (beginner → expert).

**Property Schema**: Authoritative specification of all properties. See [[Configuration/Property-Schema]].

**Query**: Database-style search of vault data using Datacore syntax.

**Wikilink**: Internal link format `[[Page Name]]` or `[[Page|Display Text]]`.

---

## Acronyms

**AI**: Artificial Intelligence  
**API**: Application Programming Interface  
**COE**: Cup of Excellence (competition)  
**CQI**: Coffee Quality Institute  
**CSS**: Cascading Style Sheets (styling)  
**CSV**: Comma-Separated Values (export format)  
**EY**: Extraction Yield (percentage)  
**FAQ**: Frequently Asked Questions  
**GPS**: Global Positioning System  
**JSON**: JavaScript Object Notation (data format)  
**KNN**: K-Nearest Neighbors (ML algorithm)  
**ML**: Machine Learning  
**PDF**: Portable Document Format  
**PWA**: Progressive Web App  
**QR**: Quick Response (code)  
**ROI**: Return on Investment  
**SCA**: Specialty Coffee Association  
**SHB**: Strictly Hard Bean (high altitude grade)  
**SPC**: Statistical Process Control  
**TDS**: Total Dissolved Solids  
**UI/UX**: User Interface/User Experience  
**YAML**: Data serialization language (frontmatter format)

---

## Coffee Vault Abbreviations

**5.0**: Coffee Vault version 5.0.0  
**Avg**: Average  
**DB**: Database  
**Desc**: Description  
**Max**: Maximum  
**Min**: Minimum  
**Pct**: Percent/Percentage  
**Qty**: Quantity  
**Std Dev (σ)**: Standard Deviation  
**Temp**: Temperature  
**Viz**: Visualization

---

**Coffee Vault 5.0** - Know your terms, master your craft

**Total Terms**: 100+  
**Categories**: Coffee, Coffee Vault, Technical, Acronyms  
**Always Expanding**: Add your own!

