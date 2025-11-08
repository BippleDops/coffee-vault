---
type: documentation
category: configuration
version: 7.0.0
created: 2025-11-08
tags: [search, tips, productivity, qol]
---

# Coffee Vault Search Tips & Tricks

**Version**: 7.0.0
**Purpose**: Master Obsidian search to find information faster
**Target Audience**: All users (Novice, Enthusiast, Professional)

> **Quick Access**: Press `Cmd/Ctrl + Shift + F` to search entire vault
> **Pro Tip**: Most searches support regex and boolean operators

---

## Table of Contents

1. [Basic Search](#basic-search)
2. [Boolean Operators](#boolean-operators)
3. [Wildcards & Patterns](#wildcards--patterns)
4. [Tag Search](#tag-search)
5. [Property Search](#property-search)
6. [Fuzzy Search](#fuzzy-search)
7. [Regular Expressions](#regular-expressions)
8. [Search Modifiers](#search-modifiers)
9. [Advanced Combinations](#advanced-combinations)
10. [Coffee Vault Specific Searches](#coffee-vault-specific-searches)

---

## Basic Search

### Simple Text Search

Just type what you're looking for:

```
ethiopian
```
→ Finds all notes containing "ethiopian" (case-insensitive)

```
"pour over"
```
→ Finds exact phrase "pour over" (with quotes for exact match)

### Search in Current File

`Cmd/Ctrl + F` - Search within the current note only

### Search Entire Vault

`Cmd/Ctrl + Shift + F` - Search across all notes in vault

---

## Boolean Operators

Combine search terms to create powerful queries.

### AND Operator

Find notes containing ALL terms:

```
ethiopian AND fruity
```
→ Notes that mention both "ethiopian" AND "fruity"

**Alternative syntax**:
```
ethiopian fruity
```
→ Space between terms = implicit AND

### OR Operator

Find notes containing ANY of the terms:

```
ethiopian OR colombian
```
→ Notes mentioning either "ethiopian" OR "colombian" (or both)

### NOT Operator

Exclude terms from search:

```
coffee -instant
```
→ Notes with "coffee" but NOT "instant"

**Alternative syntax**:
```
coffee NOT instant
```

### Combining Operators

Use parentheses to group:

```
(ethiopian OR kenyan) AND (fruity OR floral)
```
→ Notes about Ethiopian or Kenyan coffee with fruity or floral notes

---

## Wildcards & Patterns

Use wildcards to match variations of words.

### Asterisk (*) - Multiple Characters

```
brew*
```
→ Matches: brew, brewing, brewed, brewer, brewers, etc.

```
*press
```
→ Matches: AeroPress, espresso, French press, etc.

### Question Mark (?) - Single Character

```
caf?
```
→ Matches: cafe, café

### Combining Wildcards

```
*ethiopia*
```
→ Matches: ethiopia, ethiopian, Ethiopian, etc.

---

## Tag Search

Search for notes with specific tags.

### Basic Tag Search

```
tag:#coffee-log
```
→ All notes tagged with #coffee-log

### Multiple Tags (AND)

```
tag:#coffee-log tag:#v60
```
→ Notes with BOTH #coffee-log AND #v60 tags

### Multiple Tags (OR)

```
tag:#v60 OR tag:#aeropress
```
→ Notes with EITHER #v60 OR #aeropress

### Tag Hierarchy

```
tag:#brewing/advanced
```
→ Notes with #brewing/advanced (nested tag)

### Exclude Tag

```
-tag:#archived
```
→ Exclude archived notes from results

---

## Property Search

Search notes by frontmatter properties (metadata).

### Basic Property Search

```
[rating:5]
```
→ Notes with rating property = 5

### Property Comparisons

**Greater than**:
```
[rating:>4]
```
→ Notes with rating greater than 4

**Less than**:
```
[dose:<15]
```
→ Notes with dose less than 15g

**Range**:
```
[rating:>=4] [rating:<=5]
```
→ Notes with rating between 4 and 5

### Property Exists

```
[tds]
```
→ Notes that have a "tds" property (any value)

### Property Value Contains

```
[origin:*ethiopia*]
```
→ Notes where origin contains "ethiopia"

### Multiple Properties

```
[rating:>4] [brew-method:v60]
```
→ High-rated V60 brews

---

## Fuzzy Search

Find notes even with typos or approximate matches.

### Tilde (~) - Fuzzy Matching

```
etiopia~
```
→ Matches: ethiopia, ethiopian (allows small spelling differences)

**Adjust fuzziness** (number = edit distance):
```
etiopia~2
```
→ Allows up to 2 character differences

### Use Cases

- Searching with typos
- Finding similar words
- Handling variations in spelling

---

## Regular Expressions

Advanced pattern matching using regex.

### Enable Regex Mode

Click the `.*` icon in search bar to enable regex mode.

### Common Patterns

**Match email addresses**:
```
\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b
```

**Match dates (YYYY-MM-DD)**:
```
\d{4}-\d{2}-\d{2}
```

**Match temperature (e.g., 93°C, 200°F)**:
```
\d{2,3}°[CF]
```

**Match brew ratios**:
```
1:\d{1,2}
```
→ Matches: 1:15, 1:16, 1:17, etc.

**Match TDS values**:
```
\d\.\d{2}%
```
→ Matches: 1.25%, 1.40%, etc.

### Regex Groups

**Capture groups** for complex patterns:
```
(ethiopian|kenyan|colombian).*(fruity|floral)
```
→ Find specific origins with specific flavor profiles

---

## Search Modifiers

Refine searches with special modifiers.

### File Name Only

```
file:coffee-log
```
→ Search only in file names, not content

### Path Search

```
path:"Coffee Logs"
```
→ Search only in specific folder

### Ignore Case

```
/ethiopian/i
```
→ Case-insensitive regex search

### Line-Based Search

```
line:(dose water temperature)
```
→ Find lines containing all terms

---

## Advanced Combinations

Powerful search queries combining multiple techniques.

### Example 1: High-Rated Ethiopian V60 Brews

```
[rating:>4] [origin:*ethiopia*] [brew-method:v60]
```

### Example 2: Recent Fruity Coffees (This Month)

```
[date:>2025-11-01] fruity tag:#coffee-log
```

### Example 3: Find Underextracted Brews

```
(sour OR weak OR thin) [rating:<3] -tag:#archived
```

### Example 4: Equipment Maintenance Due

```
path:"Equipment Models" [last-maintenance:<2025-10-01]
```

### Example 5: Competition-Level Logs

```
[tds] [extraction-yield] [rating:>=4.5] tag:#competition
```

---

## Coffee Vault Specific Searches

Pre-built searches optimized for Coffee Vault.

### Find Your Best Brews

```
[rating:5] tag:#coffee-log
```

### Find Specific Bean Origin

```
[origin:*ethiopia*] OR [origin:*kenya*] OR [origin:*colombia*]
```

### Find Brewing Method

```
[brew-method:v60] OR tag:#v60
```

### Find By Date Range

**This week**:
```
[date:>2025-11-01] [date:<2025-11-08]
```

**This month**:
```
[date:>2025-11-01] [date:<2025-12-01]
```

### Find High TDS (Strong Coffee)

```
[tds:>1.4] tag:#coffee-log
```

### Find Underextracted Coffee

```
[extraction-yield:<18] tag:#coffee-log
```

### Find Overextracted Coffee

```
[extraction-yield:>22] tag:#coffee-log
```

### Find Specific Equipment

```
[grinder:*comandante*] OR [grinder:*1zpresso*]
```

### Find By Roast Level

```
[roast-level:light] OR [roast-level:medium-light]
```

### Find By Processing Method

```
[processing:washed] OR [processing:natural] OR [processing:honey]
```

### Find Notes Without Rating

```
tag:#coffee-log -[rating]
```

### Find Incomplete Logs

```
tag:#coffee-log (-[dose] OR -[water] OR -[rating])
```

### Find All Scientific References

```
path:"Scientific References"
```

### Find Brewing Guides for Beginners

```
path:"Brewing Guides" [difficulty:beginner]
```

### Find Goals In Progress

```
path:"Coffee Goals" [status:in-progress]
```

### Find Recent Events

```
path:"Coffee Events" [date:>2025-10-01]
```

---

## Search Tips & Best Practices

### 1. Start Broad, Then Narrow

**Bad approach**:
```
[rating:5] [brew-method:v60] [origin:ethiopian] [dose:15] [water:250]
```
→ Too specific, might return no results

**Good approach**:
```
[rating:5]
```
→ Start here, then refine

### 2. Use Saved Searches

Save frequently-used searches:
1. Perform search
2. Click "Save" icon
3. Name your search
4. Access from saved searches panel

### 3. Leverage Search History

Use up/down arrows in search box to access previous searches.

### 4. Combine with Dataview

For complex queries, use Dataview in dashboards:

````markdown
```dataview
TABLE rating, beans, brew-method
FROM "Coffee Logs"
WHERE rating >= 4 AND brew-method = "v60"
SORT rating DESC
```
````

### 5. Export Search Results

After search:
1. Select all results (Cmd/Ctrl + A)
2. Copy (Cmd/Ctrl + C)
3. Create new note
4. Paste as links

---

## Common Search Patterns

### Daily Review Searches

**Yesterday's brews**:
```
[date:2025-11-07] tag:#coffee-log
```

**This week's logs**:
```
[date:>2025-11-01] tag:#coffee-log
```

### Quality Improvement Searches

**Low-rated brews to learn from**:
```
[rating:<3] tag:#coffee-log
```

**Inconsistent results with same beans**:
```
[beans:*ethiopia*] [rating:>0]
```
→ Then compare ratings to find inconsistencies

### Inventory Searches

**Current beans**:
```
path:"Beans Library" [is-current:true]
```

**Beans running low**:
```
path:"Beans Library" [amount-remaining:<50]
```

### Learning Searches

**Beginner-friendly content**:
```
[difficulty:beginner] OR tag:#beginner
```

**Advanced techniques**:
```
[difficulty:advanced] OR tag:#advanced
```

---

## Troubleshooting Search

### Search Returns No Results

1. **Check spelling**: Use fuzzy search (`~`) for typos
2. **Too specific**: Remove some conditions
3. **Wrong property name**: Verify property exists in frontmatter
4. **Case sensitivity**: Some searches are case-sensitive

### Search Returns Too Many Results

1. **Add more conditions**: Narrow with AND operators
2. **Use exact phrases**: Add quotes `"exact phrase"`
3. **Filter by date**: Add `[date:>YYYY-MM-DD]`
4. **Exclude irrelevant**: Use `-` to exclude terms

### Property Search Not Working

1. **Verify frontmatter**: Check property name matches exactly
2. **Check data type**: Numbers vs. strings (use quotes for strings)
3. **Array properties**: May need special handling

---

## Quick Reference Card

```
╔══════════════════════════════════════════════════════════╗
║           SEARCH QUICK REFERENCE                         ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  OPERATORS:                                              ║
║  AND            Both terms (implicit with space)         ║
║  OR             Either term                              ║
║  NOT / -        Exclude term                             ║
║                                                          ║
║  WILDCARDS:                                              ║
║  *              Multiple characters                      ║
║  ?              Single character                         ║
║  ~              Fuzzy match                              ║
║                                                          ║
║  SPECIAL:                                                ║
║  "phrase"       Exact phrase                             ║
║  tag:#tag       Search tags                              ║
║  [prop:value]   Search properties                        ║
║  [prop:>4]      Property comparison                      ║
║  path:"folder"  Search specific folder                   ║
║  file:name      Search file names                        ║
║                                                          ║
║  EXAMPLES:                                               ║
║  [rating:5]                 5-star brews                 ║
║  ethiopian fruity           Both terms                   ║
║  v60 OR aeropress           Either method                ║
║  coffee -instant            Exclude instant              ║
║  [date:>2025-11-01]         Recent logs                  ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

---

## Practice Exercises

Test your search skills with these exercises:

### Beginner Level

1. Find all coffee logs from November 2025
2. Find all notes tagged with #v60
3. Find all notes mentioning "Ethiopian"
4. Find notes with rating of 4 or higher

### Intermediate Level

1. Find V60 brews rated 4+ from Ethiopian beans
2. Find all logs where you used more than 15g of coffee
3. Find fruity coffees that aren't Ethiopian
4. Find incomplete logs (missing rating or dose)

### Advanced Level

1. Find brews with TDS between 1.3 and 1.5
2. Find underextracted logs from last month
3. Find all washed Ethiopian coffees rated 4+ brewed with V60
4. Find equipment maintenance logs older than 30 days

---

## Related Documentation

- [[Configuration/KEYBOARD-SHORTCUTS|Keyboard Shortcuts]]
- [[Configuration/User-Configuration-Guide|User Configuration]]
- [[Documentation/Coffee-Terminology-Glossary|Coffee Glossary]]
- [[HOME-DASHBOARD|Home Dashboard]]

---

## External Resources

- [Obsidian Search Documentation](https://help.obsidian.md/Plugins/Search)
- [Regular Expressions Tutorial](https://regexr.com/)
- [Dataview Query Language](https://blacksmithgu.github.io/obsidian-dataview/)

---

**Pro Tips Summary**:
- Start broad, refine incrementally
- Save frequently-used searches
- Combine search with Dataview for complex queries
- Use regex mode for advanced patterns
- Export results for later reference

---

*Last Updated: 2025-11-08*
*Coffee Vault v7.0 - Quality of Life Edition*
