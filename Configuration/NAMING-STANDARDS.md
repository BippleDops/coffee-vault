# Coffee Vault 5.1 - Naming Standards

**Uniform naming conventions for files, properties, and code across the entire vault.**

---

## File Naming Conventions

### Rule: kebab-case for all files

**Format**: `lowercase-with-hyphens.extension`

**Examples**:
- `coffee-log-v3.md` ✅
- `Coffee Log v3.md` ❌
- `brewing-optimizer.js` ✅
- `Brewing Optimizer.js` ❌

**Exceptions**:
- Root documentation files use UPPERCASE: `README.md`, `START-HERE.md`
- Technical documentation: `VAULT-ARCHITECTURE-REFERENCE.md`

### Directory Names

**Use Title Case with Spaces** for human-readable folder names:
- `Coffee Logs/` ✅
- `coffee-logs/` ❌
- `Scientific References/` ✅
- `scientific-references/` ❌

---

## Property Naming in YAML Frontmatter

### Rule: kebab-case for all properties

**Format**: `lowercase-with-hyphens: value`

**Examples**:
```yaml
---
type: coffee-log
brew-method: v60          ✅
brewMethod: v60            ❌
water-temperature: 94      ✅
waterTemperature: 94       ❌
roast-level: medium        ✅
roastLevel: medium         ❌
---
```

**Why**: Datacore queries use kebab-case, consistency prevents errors.

---

## JavaScript Property Access

### Rule: Use bracket notation with kebab-case strings

**Correct**:
```javascript
const method = log["brew-method"];
const temp = log["water-temperature"];
const level = log["roast-level"];
```

**Incorrect**:
```javascript
const method = log.brewMethod;  // Undefined!
const temp = log.waterTemperature;  // Undefined!
```

**Why**: JavaScript identifiers can't contain hyphens, so use brackets.

### Variable Names

**Use camelCase** for JavaScript variables:
```javascript
const brewMethod = log["brew-method"];  ✅
const waterTemp = log["water-temperature"];  ✅
const roastLevel = log["roast-level"];  ✅
```

---

## File Organization Standards

### Analytics Dashboards

**Pattern**: `[Number]-[Title]-[Type].md`

**Examples**:
- `1-Monthly-Analytics-Dashboard.md`
- `2-Brewing-Optimization-Engine.md`
- `3-Cost-Intelligence-System.md`

### Visualizations

**Pattern**: `[feature]-[type].html`

**Examples**:
- `flavor-compass.html`
- `brewing-triangle.html`
- `grind-size-calculator.html`

### Scripts

**Pattern**: `[feature]-[type].js`

**Examples**:
- `weekly-summary-generator.js`
- `brewing-optimizer.js`
- `inventory-manager.js`
- `stats-utils.js`

### Templates

**Pattern**: `[Type]-[Version].md` or `[Type].md`

**Examples**:
- `Coffee-Log-v3.md`
- `Bean-Profile.md`
- `Brewing-Guide.md`

---

## Documentation Standards

### Root Level Files

**Only 2 files** at root:
1. `README.md` - Project overview and quick links
2. `START-HERE.md` - User quick start guide

### Documentation Folder

**Technical and reference documentation**:
- `COFFEE-VAULT-4.0-COMPLETE-DELIVERY.md` - Complete delivery report
- `VAULT-ARCHITECTURE-REFERENCE.md` - Technical architecture
- Plus reference guides moved from root

### Configuration Folder

**System configuration and standards**:
- `Property-Schema.md` - Authoritative property definitions
- `Template-Framework-Standards.md` - Template development guide
- `User-Configuration-Guide.md` - End-user setup
- `NAMING-STANDARDS.md` - This file

---

## Code Style Standards

### JavaScript

**Module Exports**:
```javascript
module.exports = {
  functionName,
  CONSTANT_NAME,
  ClassName
};
```

**Functions**: Use camelCase
```javascript
function calculateRatio(dose, water) { }
function generateSampleLogs(count) { }
```

**Constants**: Use UPPER_SNAKE_CASE
```javascript
const BEANS = [...];
const BREW_METHODS = [...];
const FLAVOR_NOTES = [...];
```

**Classes**: Use PascalCase
```javascript
class PredictiveQualityModel { }
class BrewingOptimizer { }
```

### Template Code (Templater)

**Variables**: Use camelCase
```javascript
<%*
const currentDate = tp.file.creation_date("YYYY-MM-DD");
const beanName = await tp.system.prompt("Bean name");
const brewMethod = await tp.system.prompt("Brew method");
%>
```

**Properties**: Use kebab-case in output
```markdown
---
brew-method: <%= brewMethod %>
water-temperature: <%= waterTemp %>
---
```

---

## Query Standards

### Datacore Queries

**Always use kebab-case** for property access:
```javascript
dv.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .where(p => p["brew-method"] === "v60")
  .where(p => p["water-temperature"] >= 90)
```

**Always use .limit()** for performance:
```javascript
const logs = dv.pages('"Coffee Logs"')
  .limit(100)  // CRITICAL
  .array();
```

**Always use optional chaining**:
```javascript
const method = log?.["brew-method"] ?? "unknown";
const rating = log?.rating ?? 3.0;
const beans = log?.beans ?? "Unknown";
```

---

## Common Patterns

### Property Mapping

**YAML → JavaScript**:
```yaml
# In frontmatter
brew-method: v60
water-temperature: 94
roast-level: medium
```

```javascript
// In code
const method = log["brew-method"];     // "v60"
const temp = log["water-temperature"]; // 94
const roast = log["roast-level"];      // "medium"
```

### Safe Property Access

**Always defensive**:
```javascript
// ✅ Safe
const rating = log?.rating ?? 3.0;
const method = log?.["brew-method"] ?? "unknown";

// ❌ Unsafe
const rating = log.rating;  // May be undefined!
const method = log["brew-method"];  // May be undefined!
```

---

## Migration Guidelines

### Updating Old Files

If you encounter old naming styles:

**Space-separated → kebab-case**:
- `Coffee Log.md` → `coffee-log.md`
- `Brewing Optimizer.md` → `brewing-optimizer.md`

**camelCase → kebab-case**:
- `brewMethod` → `brew-method`
- `waterTemperature` → `water-temperature`

**Process**:
1. Rename file using kebab-case
2. Update all property names to kebab-case
3. Update all references to use brackets: `log["brew-method"]`
4. Test queries to ensure they work

---

## Exceptions and Special Cases

### Proper Nouns

Keep original casing for:
- Bean names: "Ethiopian Yirgacheffe", "Kenya AA"
- Roaster names: "Onyx Coffee Lab", "Blue Bottle"
- Geographic origins: "Guatemala", "Colombia"

### Acronyms

Use uppercase:
- `SCA` (Specialty Coffee Association)
- `TDS` (Total Dissolved Solids)
- `HTML`, `CSS`, `JSON`

### Version Numbers

Suffix with `-v[number]`:
- `Coffee-Log-v3.md`
- `Bean-Profile-v2.md`

---

## Validation Checklist

Before committing new files:

- [ ] File name uses kebab-case (except root docs)
- [ ] All YAML properties use kebab-case
- [ ] JavaScript accesses properties with brackets
- [ ] Variables use camelCase
- [ ] Constants use UPPER_SNAKE_CASE
- [ ] Classes use PascalCase
- [ ] Queries use optional chaining (?.)
- [ ] Queries include .limit() where appropriate
- [ ] Documentation links updated if file moved

---

## Benefits of Uniform Standards

1. **Consistency** - Predictable patterns across entire vault
2. **Fewer Errors** - No confusion about property names
3. **Better Queries** - Datacore works reliably
4. **Easier Maintenance** - Find and update files quickly
5. **Onboarding** - New users/developers understand structure
6. **Automation** - Scripts can rely on predictable names
7. **Refactoring** - Batch operations work smoothly

---

**Version**: 1.0.0
**Last Updated**: 2025-10-26
**Status**: Authoritative Standard

**All vault files must follow these conventions.**
