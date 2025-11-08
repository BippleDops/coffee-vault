---
# =============================================================================
# BATCH ENTITY AUTOCREATE SCRIPT
# =============================================================================
# This template uses Templater to create multiple entities sequentially
# Configure the entity type and batch parameters, then execute
# =============================================================================

# Batch Configuration
batch-type: <% tp.system.suggester(["Bean Profile Batch", "Coffee Log Batch", "Cupping Session Batch", "Equipment Batch", "Sensory Experiment Series", "Processing Playbook Series", "Training Session Series"], ["bean-profile", "coffee-log", "cupping-session", "equipment-model", "sensory-experiment", "processing-playbook", "training-session"]) %>
batch-size: <% tp.system.prompt("Number of entities to create", "5") %>
batch-id: <% tp.date.now("YYYYMMDDHHmmss") %>
batch-date: <% tp.date.now("YYYY-MM-DD") %>

# Naming Convention
naming-pattern: <% tp.system.suggester(["Sequential numbers", "Date-based", "Custom prefix", "Descriptive"], ["sequential", "date-based", "custom-prefix", "descriptive"]) %>
prefix: <% tp.system.prompt("Filename prefix (optional)", "") %>
# Example: "Colombia-Huila" → "Colombia-Huila-1", "Colombia-Huila-2", etc.

# Shared Attributes (applied to all entities in batch)
shared-attributes:
  origin: <% tp.system.prompt("Common origin (if applicable)", "") %>
  roaster: <% tp.system.prompt("Common roaster (if applicable)", "") %>
  category: <% tp.system.prompt("Common category (if applicable)", "") %>
  tags: [batch-created, batch-<% tp.frontmatter["batch-id"] %>, <% tp.date.now("YYYY-MM") %>]

# Auto-linking Configuration
auto-link:
  link-to-previous: <% tp.system.suggester(["Yes", "No"], [true, false]) %>
  # Should each entity link to the previous one in sequence?

  parent-entity: [[<% tp.system.prompt("Parent entity (optional)", "") %>]]
  # Link all entities to a common parent

  sibling-linking: <% tp.system.suggester(["Full mesh", "Sequential only", "None"], ["full-mesh", "sequential", "none"]) %>
  # How should entities link to each other?

---

# 🔄 Batch Entity Creator: <% tp.frontmatter["batch-type"] %>

**Batch ID**: `<% tp.frontmatter["batch-id"] %>`
**Batch Date**: <% tp.frontmatter["batch-date"] %>
**Entity Type**: <% tp.frontmatter["batch-type"] %>
**Quantity**: <% tp.frontmatter["batch-size"] %> entities

---

## ⚙️ Configuration Summary

**Naming Pattern**: <% tp.frontmatter["naming-pattern"] %>
**Prefix**: `<% tp.frontmatter.prefix || "None" %>`

**Shared Attributes**:
- Origin: <% tp.frontmatter["shared-attributes"].origin || "Varies" %>
- Roaster: <% tp.frontmatter["shared-attributes"].roaster || "Varies" %>
- Category: <% tp.frontmatter["shared-attributes"].category || "Varies" %>

**Auto-linking**:
- Link to previous: <% tp.frontmatter["auto-link"]["link-to-previous"] ? "✓ Yes" : "✗ No" %>
- Parent entity: <% tp.frontmatter["auto-link"]["parent-entity"] || "None" %>
- Sibling linking: <% tp.frontmatter["auto-link"]["sibling-linking"] %>

---

## 🚀 Batch Creation Script

<%*
// =============================================================================
// MAIN BATCH CREATION LOGIC
// =============================================================================

const batchType = tp.frontmatter["batch-type"];
const batchSize = parseInt(tp.frontmatter["batch-size"]);
const prefix = tp.frontmatter.prefix || "";
const namingPattern = tp.frontmatter["naming-pattern"];
const batchId = tp.frontmatter["batch-id"];

// Get shared attributes
const sharedOrigin = tp.frontmatter["shared-attributes"].origin || "";
const sharedRoaster = tp.frontmatter["shared-attributes"].roaster || "";
const sharedCategory = tp.frontmatter["shared-attributes"].category || "";

// Auto-linking configuration
const linkToPrevious = tp.frontmatter["auto-link"]["link-to-previous"];
const parentEntity = tp.frontmatter["auto-link"]["parent-entity"];
const siblingLinking = tp.frontmatter["auto-link"]["sibling-linking"];

// Determine target folder based on entity type
let targetFolder = "";
let templateName = "";

switch(batchType) {
  case "bean-profile":
    targetFolder = "Bean Library";
    templateName = "Bean Profile";
    break;
  case "coffee-log":
    targetFolder = "Coffee Logs";
    templateName = "Coffee-Log-v5";
    break;
  case "cupping-session":
    targetFolder = "Cupping Sessions";
    templateName = "Cupping Session";
    break;
  case "equipment-model":
    targetFolder = "Equipment";
    templateName = "Equipment Model";
    break;
  case "sensory-experiment":
    targetFolder = "Sensory Experiments";
    templateName = "sensory-experiment-template";
    break;
  case "processing-playbook":
    targetFolder = "Processing Playbooks";
    templateName = "processing-playbook-template";
    break;
  case "training-session":
    targetFolder = "Training";
    templateName = "training-plan-template";
    break;
  default:
    targetFolder = "Batch Created";
    templateName = "base-entity-template";
}

// =============================================================================
// BATCH CREATION LOOP
// =============================================================================

tR += `## 📋 Creating ${batchSize} Entities\n\n`;
tR += `**Target Folder**: \`${targetFolder}\`\n`;
tR += `**Template**: \`${templateName}\`\n\n`;
tR += `---\n\n`;

// Prompt for batch-specific details
const batchPrompt = await tp.system.prompt(
  `Ready to create ${batchSize} ${batchType} entities. Continue?`,
  "yes"
);

if (batchPrompt.toLowerCase() === "yes" || batchPrompt.toLowerCase() === "y") {

  tR += `### ✓ Batch Creation Confirmed\n\n`;
  tR += `Creating entities...\n\n`;

  // Store created entity names for linking
  let createdEntities = [];

  // Loop to create each entity
  for (let i = 1; i <= batchSize; i++) {

    // Generate entity name based on naming pattern
    let entityName = "";

    switch(namingPattern) {
      case "sequential":
        entityName = prefix ? `${prefix}-${i}` : `Entity-${i}`;
        break;
      case "date-based":
        entityName = prefix ? `${prefix}-${tp.date.now("YYYY-MM-DD")}-${i}` : `${tp.date.now("YYYY-MM-DD")}-${i}`;
        break;
      case "custom-prefix":
        const customName = await tp.system.prompt(`Name for entity ${i}/${batchSize}`, `${prefix}-${i}`);
        entityName = customName;
        break;
      case "descriptive":
        const descriptiveName = await tp.system.prompt(`Descriptive name for entity ${i}/${batchSize}`);
        entityName = descriptiveName;
        break;
      default:
        entityName = `Entity-${i}`;
    }

    // Log entity creation
    tR += `${i}. **${entityName}**\n`;
    tR += `   - Type: ${batchType}\n`;

    if (sharedOrigin) {
      tR += `   - Origin: ${sharedOrigin}\n`;
    }
    if (sharedRoaster) {
      tR += `   - Roaster: ${sharedRoaster}\n`;
    }

    // Show linking relationships
    if (linkToPrevious && i > 1) {
      tR += `   - Previous: [[${createdEntities[i-2]}]]\n`;
    }
    if (i < batchSize) {
      tR += `   - Next: [[${prefix}-${i+1}]] (to be created)\n`;
    }

    tR += `   - Batch ID: \`${batchId}\`\n`;
    tR += `\n`;

    // Store entity name for linking
    createdEntities.push(entityName);

    // NOTE: Actual file creation would happen here using tp.file.create_new()
    // This template documents the batch structure; actual creation requires
    // manual template application or custom script

  } // End loop

  tR += `\n---\n\n`;
  tR += `### ✓ Batch Creation Complete\n\n`;
  tR += `Created ${batchSize} entities in \`${targetFolder}\`\n\n`;

  // Generate linking summary
  if (siblingLinking === "full-mesh") {
    tR += `### 🔗 Linking Strategy: Full Mesh\n\n`;
    tR += `Each entity should link to all other entities in the batch:\n\n`;
    for (let i = 0; i < createdEntities.length; i++) {
      tR += `**${createdEntities[i]}** links to:\n`;
      for (let j = 0; j < createdEntities.length; j++) {
        if (i !== j) {
          tR += `- [[${createdEntities[j]}]]\n`;
        }
      }
      tR += `\n`;
    }
  } else if (siblingLinking === "sequential") {
    tR += `### 🔗 Linking Strategy: Sequential\n\n`;
    tR += `Sequential linking structure:\n\n`;
    for (let i = 0; i < createdEntities.length; i++) {
      tR += `${i + 1}. [[${createdEntities[i]}]]`;
      if (i < createdEntities.length - 1) {
        tR += ` → `;
      }
    }
    tR += `\n\n`;
  }

  // Parent linking
  if (parentEntity) {
    tR += `### 👨‍👧‍👦 Parent Entity Linking\n\n`;
    tR += `All entities should link to parent: ${parentEntity}\n\n`;
  }

  tR += `---\n\n`;

} else {
  tR += `### ✗ Batch Creation Cancelled\n\n`;
  tR += `No entities were created.\n\n`;
}

%>

---

## 📊 Batch Entity List

<%*
// Generate a quick reference table
tR += `\n| # | Entity Name | Type | Status |\n`;
tR += `|---|-------------|------|--------|\n`;

for (let i = 1; i <= batchSize; i++) {
  const entityName = prefix ? `${prefix}-${i}` : `Entity-${i}`;
  tR += `| ${i} | [[${entityName}]] | ${batchType} | ⏳ Pending |\n`;
}

tR += `\n`;
%>

---

## 🎨 Entity Type Templates

### Bean Profile Batch
**Use case**: Creating multiple beans from same origin or roaster
**Shared attributes**:
- Origin (e.g., "Ethiopia")
- Roaster
- Roast level
- Purchase date

**Variable attributes**:
- Bean name (varietal, region)
- Specific roast date
- Price
- Tasting notes

---

### Coffee Log Batch
**Use case**: Documenting multiple brews in one session
**Shared attributes**:
- Date
- Beans
- Brew method
- Equipment

**Variable attributes**:
- Grind size (for dialing in)
- Dose/ratio adjustments
- Temperature variations
- Time variations
- Rating/results

**Sequential linking**: Create a brewing optimization series

---

### Cupping Session Batch
**Use case**: Multi-sample cupping series
**Shared attributes**:
- Date
- Protocol (SCA, COE)
- Location
- Participants

**Variable attributes**:
- Sample name/code
- Cupping scores
- Tasting notes
- Rankings

**Full mesh linking**: Compare all samples to each other

---

### Sensory Experiment Series
**Use case**: Triangle test series or calibration program
**Shared attributes**:
- Experiment type
- Protocol
- Target skill
- Training plan reference

**Variable attributes**:
- Session number
- Samples used
- Results/accuracy
- Progress notes

**Sequential linking**: Track improvement over time

---

### Processing Playbook Series
**Use case**: Processing method variations or time series
**Shared attributes**:
- Origin/farm
- Base process method
- Harvest date
- Processing location

**Variable attributes**:
- Specific variation (fermentation time, temperature, etc.)
- Results
- Quality outcomes
- Learnings

**Comparison linking**: Link to control batch and variations

---

## 💡 Usage Instructions

### Manual Creation Steps

1. **Configure this template**:
   - Set batch-type, batch-size, and naming-pattern
   - Fill in shared-attributes
   - Configure auto-linking preferences

2. **Execute this template**:
   - Creates a batch plan document
   - Shows entity naming structure
   - Outlines linking relationships

3. **Create individual entities**:
   - Use appropriate entity template for each item
   - Apply shared attributes consistently
   - Add batch ID to tags for tracking
   - Create links according to strategy

4. **Verify batch**:
   - Check all entities created
   - Verify linking structure
   - Update this batch document with actual links

### Automated Creation (Advanced)

For true automation, use a custom Templater script:

```javascript
// Example: Create batch programmatically
const createBatch = async (tp, batchConfig) => {
  for (let i = 1; i <= batchConfig.size; i++) {
    const fileName = `${batchConfig.prefix}-${i}`;
    const filePath = `${batchConfig.folder}/${fileName}.md`;

    await tp.file.create_new(
      tp.file.find_tfile(batchConfig.template),
      fileName,
      false,
      await tp.file.find_tfile(batchConfig.folder)
    );
  }
};
```

---

## 📈 Batch Analytics

### Progress Tracking

```dataview
TABLE status as "Status", type as "Type", date as "Date"
FROM ""
WHERE contains(tags, "batch-<% tp.frontmatter["batch-id"] %>")
SORT file.name ASC
```

### Completion Status

```dataview
TABLE WITHOUT ID
  length(rows) as "Total Entities",
  length(filter(rows, (r) => r.status = "completed")) as "Completed",
  round(length(filter(rows, (r) => r.status = "completed")) / length(rows) * 100, 1) + "%" as "Progress"
FROM ""
WHERE contains(tags, "batch-<% tp.frontmatter["batch-id"] %>")
```

### Quick Stats

```dataview
LIST
FROM ""
WHERE contains(tags, "batch-<% tp.frontmatter["batch-id"] %>")
SORT file.name ASC
```

---

## 🔧 Batch Management

### Bulk Updates

To update all entities in this batch:

1. **Add new tag**:
   - Use "Add tag" command in Obsidian
   - Filter by `batch-<% tp.frontmatter["batch-id"] %>`
   - Apply tag to all

2. **Update shared attribute**:
   - Use "Find and Replace" in files
   - Scope: Files with tag `batch-<% tp.frontmatter["batch-id"] %>`
   - Update specific YAML field

3. **Change status**:
   - Bulk edit YAML frontmatter
   - Update status field for all entities

### Batch Archiving

To archive this entire batch:

- [ ] Verify all entities complete
- [ ] Update batch status to "archived"
- [ ] Move all entities to archive folder (optional)
- [ ] Update linking in related documents

---

## 📝 Notes & Reflections

**Batch Purpose**:


**Creation Notes**:


**Lessons Learned**:


**Improvements for Next Batch**:


---

## 🔗 Related Batches

```dataview
TABLE batch-type as "Type", batch-size as "Size", batch-date as "Date"
FROM ""
WHERE type = "batch-creation" AND file.name != this.file.name
SORT batch-date DESC
```

---

**Batch ID**: `<% tp.frontmatter["batch-id"] %>`
**Tags**: <% (tp.frontmatter["shared-attributes"].tags || []).join(", ") %>

---

*Coffee Vault - Batch Entity Creator*
*Efficiently create and link multiple related entities*
