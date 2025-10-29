# Kanban Integration for Coffee Vault

**Purpose**: Visual workflow boards for coffee bean acquisition, equipment planning, and technique development.

## Overview

This configuration provides pre-configured Kanban boards specifically designed for managing coffee-related workflows. Track your coffee journey from bean research to equipment mastery with visual, drag-and-drop boards.

## Installation Steps

1. **Install Kanban Plugin**
   - Open Obsidian Settings → Community Plugins
   - Browse and search for "Kanban"
   - Install and enable the plugin

2. **Configure Plugin Settings**
   - Go to Settings → Kanban
   - Enable: "Date trigger"
   - Enable: "Link cards to notes"
   - Set default archive location: `Archives/Kanban/`
   - Date format: `YYYY-MM-DD`

3. **Import Board Templates**
   - Copy board files from this folder
   - Place in your vault root or preferred location
   - Open and customize for your needs

## Board Templates

### 1. Bean Acquisition Pipeline

**File**: `Bean-Acquisition-Board.md`

Track your coffee bean journey from discovery to review.

**Columns**:
- **Research** - Beans you're investigating
- **Purchase Planned** - Decided to buy, waiting for order
- **In Transit** - Ordered, awaiting arrival
- **Testing** - Recently arrived, first brews
- **In Rotation** - Active beans in regular use
- **Finished** - Bag complete, reviewed

**Labels**:
- Priority: 🔴 High, 🟡 Medium, 🟢 Low
- Price: 💰 Budget, 💰💰 Mid-range, 💰💰💰 Premium
- Type: 🌍 Single Origin, 🌀 Blend, ☕ Espresso
- Roast: ☀️ Light, 🌤️ Medium, 🌙 Dark

**Usage**:
1. Add beans to Research column when you discover them
2. Move to Purchase Planned when you've decided to buy
3. Track through Testing phase (first 3-5 brews)
4. Keep active beans in Rotation
5. Move to Finished when bag is empty
6. Link cards to Bean Profile notes

### 2. Equipment Upgrade Planning

**File**: `Equipment-Planning-Board.md`

Plan and track equipment purchases and upgrades.

**Columns**:
- **Wishlist** - Items you'd like to have someday
- **Consideration** - Actively researching and comparing
- **Budget Approved** - Ready to purchase
- **Purchased** - Ordered, awaiting arrival
- **Testing** - Learning and evaluating
- **In Use** - Part of regular setup
- **Archived** - Retired or sold equipment

**Labels**:
- Category: 🫘 Grinder, 🌊 Brewer, ⚖️ Scale, 🔥 Kettle, 📊 Accessories
- Investment: $ <$50, $$ $50-200, $$$ $200-500, $$$$ $500+
- Priority: ⭐ Must-have, ⭐⭐ Nice-to-have, ⭐⭐⭐ Luxury
- Status: 🎁 Gift idea, 💳 Self-purchase, 👥 Shared

**Usage**:
1. Add equipment dreams to Wishlist
2. Move to Consideration when seriously researching
3. Budget Approved when money is allocated
4. Track purchase and delivery
5. Test period for new gear (30 days recommended)
6. Graduate to In Use for proven equipment
7. Archive when retired/sold

### 3. Technique Development

**File**: `Technique-Development-Board.md`

Master coffee brewing techniques systematically.

**Columns**:
- **To Learn** - Techniques you want to try
- **Learning** - Currently studying and reading
- **Practice** - Actively practicing with guidance
- **Refinement** - Improving consistency and quality
- **Mastered** - Confident, consistent execution
- **Teaching** - Able to teach others

**Labels**:
- Method: ☕ Pour-over, ⚡ Espresso, 🥖 French Press, 💨 AeroPress
- Skill: 🟢 Beginner, 🟡 Intermediate, 🔴 Advanced
- Focus: 📏 Consistency, 🎯 Precision, 🌈 Flavor, ⚙️ Equipment
- Time: ⏱️ Quick (1-2 weeks), ⏲️ Medium (1-2 months), ⏰ Long (3+ months)

**Usage**:
1. List techniques To Learn (e.g., "Perfect bloom timing")
2. Move to Learning when studying resources
3. Practice with deliberate focus
4. Refinement phase for consistency
5. Mastered when you can teach it
6. Document in Brewing Guides
7. Share with others in Teaching

### 4. Weekly Coffee Planning

**File**: `Weekly-Coffee-Planning-Board.md`

Plan your week's coffee activities and priorities.

**Columns**:
- **Monday** through **Sunday** (7 columns)
- **Backlog** - Tasks not yet scheduled
- **Completed** - Finished this week

**Labels**:
- Type: ☕ Brewing, 🧹 Maintenance, 📖 Learning, 🛒 Shopping
- Duration: ⚡ Quick (15min), ⏱️ Medium (30-60min), ⏰ Long (1hr+)
- Importance: 🔴 Must do, 🟡 Should do, 🟢 Nice to do

**Usage**:
1. Sunday planning: Distribute tasks across week
2. Daily: Check your column, complete tasks
3. Move completed cards to Completed column
4. Friday: Review week, plan next week
5. Archive completed cards weekly

## Board Configuration Details

### Archive Settings

Each board supports automatic archiving:
- Completed cards can be archived
- Archive preserves card history
- Restoration available if needed
- Archive location: `Archives/Kanban/[Board-Name]/`

### Card Linking

Link Kanban cards to vault notes:
```markdown
[[Bean Name]]
```

This connects your workflow to your knowledge base:
- Bean cards link to Bean Profiles
- Equipment cards link to equipment reviews
- Technique cards link to Brewing Guides

### Date Triggers

Boards support date-based automation:
- Add date to card: `@date(2025-10-25)`
- Card highlights when date arrives
- Useful for: Bean arrival dates, order deadlines, review schedules

### Search and Filter

Use board search to:
- Find specific cards: Type in search box
- Filter by label: Click label to filter
- Find linked notes: Search by note name

## Best Practices

### Card Creation
1. **Be Specific**: "Buy Blue Bottle Ethiopia Guji" not "Buy beans"
2. **Add Context**: Include key details in card description
3. **Link Notes**: Connect to relevant vault notes
4. **Use Labels**: Tag appropriately for filtering
5. **Set Dates**: Add dates for time-sensitive items

### Board Maintenance
- **Weekly Review**: Sunday evening planning session
- **Archive Regularly**: Keep boards clean
- **Update Labels**: Refine as you learn your workflow
- **Link to Notes**: Connect cards to detailed notes
- **Celebrate Progress**: Move cards to completion!

### Multiple Boards Strategy
- Keep boards focused on one workflow
- Don't over-complicate with too many columns
- Archive completed boards periodically
- Create seasonal boards (e.g., "2025 Coffee Goals")

### Integration with Vault

Link boards in your vault:
```markdown
## Current Projects
- [[Bean-Acquisition-Board|Bean Pipeline]]
- [[Equipment-Planning-Board|Equipment Plans]]
- [[Technique-Development-Board|Technique Progress]]
```

### Mobile Usage
- Cards are mobile-friendly
- Drag-and-drop works on mobile
- Quick edits on the go
- Sync across devices

## Workflow Examples

### Example 1: New Bean Discovery
1. Hear about interesting bean on podcast
2. Create card in Bean Acquisition → Research
3. Add label: 🌍 Single Origin, 💰💰 Mid-range
4. Link to origin country note
5. Research roaster, add notes to card
6. Move to Purchase Planned
7. Order, move to In Transit with arrival date
8. Arrives, move to Testing
9. Create Bean Profile note, link to card
10. After testing, move to In Rotation
11. When finished, move to Finished and archive

### Example 2: Learning Pour-Over
1. Add "Master V60 technique" to To Learn
2. Move to Learning, add resources to card
3. Practice column: Daily brewing for 2 weeks
4. Refinement: Focus on consistency
5. Mastered: Confident in technique
6. Create Brewing Guide note
7. Teaching: Help friend learn

### Example 3: Equipment Upgrade
1. Wishlist: "Baratza Encore ESP"
2. Research: Compare to other grinders
3. Budget Approved: Allocate funds
4. Purchased: Order placed
5. Testing: 30-day evaluation period
6. In Use: Part of daily setup
7. Document in equipment notes

## Customization

### Adding Custom Labels
1. Click "Settings" icon on board
2. Select "Labels"
3. Add new label with name and color
4. Apply to cards

### Changing Column Names
1. Click column title
2. Edit name
3. Press Enter

### Creating New Boards
1. Create new markdown file
2. Add YAML frontmatter:
```yaml
---

kanban-plugin: basic

---
```
3. Add columns:
```markdown
## Column Name

- [ ] Task item
```

### Automation Rules

Set up automation with templates:
- When card moves to column X, add tag Y
- When date reaches Z, highlight card
- When linked note updates, notify

## Troubleshooting

**Board not rendering**
- Ensure Kanban plugin is enabled
- Check YAML frontmatter is correct
- Restart Obsidian if needed

**Cards not dragging**
- Clear cache (Settings → Kanban → Clear cache)
- Check for plugin conflicts
- Try desktop app if on mobile web

**Links not working**
- Use double-bracket syntax: `[[Note Name]]`
- Ensure target note exists
- Check file paths

**Labels not showing colors**
- Edit label settings
- Assign color to label
- Refresh board

## Advanced Features

### Nested Cards
Create sub-tasks within cards:
```markdown
- [ ] Main task
  - [ ] Sub-task 1
  - [ ] Sub-task 2
```

### Card Metadata
Add metadata to cards:
```markdown
- [ ] Card title
  - Tags: #coffee, #beans
  - Priority: High
  - Due: 2025-10-30
```

### Board Templates
Create board templates for recurring workflows:
- Quarterly coffee goals
- Monthly bean orders
- Weekly maintenance schedules

### Integration with Dataview
Query Kanban cards from other notes:
```dataview
TASK
WHERE contains(file.path, "Kanban")
```

## Resources

- [Kanban Plugin Documentation](https://github.com/mgmeyers/obsidian-kanban)
- [Kanban Methodology Guide](https://www.atlassian.com/agile/kanban)
- Coffee Vault Documentation/Plugin-Setup-Guide.md

---

**Version**: 1.0.0
**Last Updated**: 2025-10-25
**Maintained by**: Coffee Vault Plugin Integration Sub-Agent
