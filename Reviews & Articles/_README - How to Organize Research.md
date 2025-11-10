---
type: guide
tags: [organization, research, guide]
---

# 📂 How to Organize Your Coffee Research

**System for managing clipped articles, videos, and resources**

This folder (`Reviews & Articles/`) is your research library. Use this guide to maintain organization as you collect coffee content.

---

## 📁 Folder Structure

### Subfolders Explained

**Professional Reviews/** - Coffee Review, roaster reviews, professional tastings  
**Brewing Tutorials/** - Technique articles, how-to guides, method explanations  
**Science & Research/** - Academic papers, technical analysis, chemistry  
**Industry News/** - Sprudge, Daily Coffee News, market updates  
**Equipment/** - Grinder reviews, brewer comparisons, gear guides  
**Producer Stories/** - Farm features, cooperative profiles, origin stories  
**Videos/** - YouTube transcripts, video summaries

### When to Use Each

**Professional Reviews**: When you clip Coffee Review ratings, roaster reviews, cupping notes

**Brewing Tutorials**: Articles or videos explaining brewing techniques

**Science & Research**: Technical articles, academic papers, chemistry explanations

**Industry News**: Current events, new café openings, industry trends

**Equipment**: Reviews of grinders, brewers, accessories you own or want

**Producer Stories**: Farm profiles, cooperative features, origin country articles

**Videos**: YouTube transcripts (use YTranscript plugin), video summaries

---

## 🏷️ Tagging System

### Required Tags

Every clipped article should have:

```yaml
tags: [web-clip, YYYY/MM, source, topic]
```

**Examples**:
```yaml
tags: [web-clip, 2025/10, james-hoffmann, v60]
tags: [web-clip, 2025/10, perfect-daily-grind, ethiopia]
tags: [web-clip, 2025/10, barista-hustle, espresso]
```

### Additional Useful Tags

**By Status**:
- `#to-read` - Clipped but not yet read
- `#reading` - Currently reading
- `#reference` - Read and keeping for future
- `#archived` - Read, no longer need

**By Priority**:
- `#high-priority` - Read soon
- `#low-priority` - Eventually

**By Application**:
- `#actionable` - Something to implement
- `#informational` - Background knowledge

---

## 📋 Frontmatter Template

### Standard Frontmatter for Clipped Content

```yaml
---
type: web-clip
source: [URL]
title: [Article Title]
author: [Author/Site]
clipped: YYYY-MM-DD
tags: [web-clip, YYYY/MM, source, topic]
status: to-read
priority: medium
---
```

### With Web Clipper Variables

```yaml
---
type: web-clip
source: {{url}}
title: {{title}}
author: {{byline}}
clipped: {{date:YYYY-MM-DD}}
tags: [web-clip, {{date:YYYY/MM}}, source-name, topic]
status: to-read
---

# {{title}}

**Source**: [{{title}}]({{url}})  
**Author**: {{byline}}  
**Clipped**: {{date:YYYY-MM-DD}}

---

{{contentMarkdown}}

---

## My Notes

[Your thoughts and how this applies to your coffee journey]

---

## Related

[Links to related vault notes - logs, beans, guides, etc.]
```

---

## 🔗 Linking Strategy

### Connect Research to Practice

**From Clipped Article to Vault**:
```markdown
## Related Brewing Guide
[[Brewing Guide]]

## Try This With
[[Ethiopia]]

## Log My Attempt
[[Coffee Log]]
```

**From Brewing Guide to Research**:
```markdown
## Additional Resources
- [[Reviews & Articles/Brewing Tutorials/Hoffmann V60 Method]]
- [[Reviews & Articles/Science & Research/V60 Extraction Study]]
```

**From Coffee Log to Research**:
```markdown
## Technique Reference
Based on [[Reviews & Articles/Brewing Tutorials/Tetsu Kasuya 4-6 Method]]
```

---

## 📊 Query Your Research

### All Unread Articles

```datacore
const unread = dc.pages('"Reviews & Articles"')
  .where(p => p.status === "to-read")
  .sort(p => p.clipped, 'desc');

return <dc.Table rows={unread} columns={[
  {id: "Title", value: c => c.$link},
  {id: "Source", value: c => c.author || c.source},
  {id: "Clipped", value: c => c.clipped}
]} />
```

### Research by Topic

```datacore
const topic = "espresso"; // Change to your topic

const articles = dc.pages('"Reviews & Articles"')
  .where(p => p.tags && p.tags.some(t => t.includes(topic)))
  .sort(p => p.clipped, 'desc');

return <dc.Table rows={articles} columns={[
  {id: "Title", value: c => c.$link},
  {id: "Type", value: c => c.type},
  {id: "Date", value: c => c.clipped}
]} />
```

### Recently Clipped (Last 30 Days)

```datacore
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

const recent = dc.pages('"Reviews & Articles"')
  .where(p => p.clipped && new Date(p.clipped) >= thirtyDaysAgo)
  .sort(p => p.clipped, 'desc');

return <dc.Table rows={recent} columns={[
  {id: "Title", value: c => c.$link},
  {id: "Folder", value: c => c.file.folder},
  {id: "Clipped", value: c => c.clipped}
]} />
```

---

## 🧹 Maintenance Routine

### Weekly Cleanup (15 minutes)

**Review New Clips**:
1. Query recent clips (last 7 days)
2. Read top 3-5 priority items
3. Extract key insights to main vault notes
4. Update status tags
5. Delete if no longer needed

**Organize**:
1. Move misplaced files to correct subfolders
2. Fix tags if inconsistent
3. Add links to related notes
4. Update priority levels

**Integrate**:
1. Update brewing guides with new techniques
2. Enhance origin profiles with new info
3. Add references to coffee logs
4. Connect to bean profiles

### Monthly Archive (30 minutes)

**Review All Clips**:
1. Query all clips from previous month
2. Status: Read → Reference or Archived
3. Extract valuable info to permanent notes
4. Delete duplicates or low-value clips

**Synthesize**:
1. Create summary notes from multiple clips
2. Update main guides with learnings
3. Add to [[Master Coffee Reference]]
4. Link related research together

---

## 💡 Pro Tips

**Quality Over Quantity**:
- Clip selectively (not everything you read)
- Focus on high-value, actionable content
- Better to have 10 great articles than 100 mediocre

**Active Processing**:
- Don't just collect, actually read
- Extract key insights immediately
- Connect to existing knowledge
- Apply to your brewing

**Systematic Approach**:
- One topic at a time (this month: espresso)
- Build comprehensive collection on that topic
- Move to next topic when saturated

**Link Liberally**:
- Connect clips to related notes
- Cross-reference frequently
- Build knowledge web

**Regular Cleanup**:
- Weekly review prevents overwhelm
- Delete freely (can always re-clip)
- Keep only what's valuable

---

## 📈 Track Your Research Habit

### Research Statistics

```datacore
const clips = dc.pages('#web-clip');
const thisMonth = clips.where(p => {
  const clipDate = new Date(p.clipped);
  const now = new Date();
  return clipDate.getMonth() === now.getMonth() && clipDate.getFullYear() === now.getFullYear();
});

return <div className="stat-card">
  <h4>Your Research This Month</h4>
  <p>📰 {thisMonth.length} articles clipped</p>
  <p>📚 {clips.length} total in library</p>
  <p>📊 {clips.where(p => p.status === "reference").length} marked as reference</p>
</div>
```

---

**Last Updated**: 2025-10-24  
**Folder**: `Reviews & Articles/`  
**Purpose**: Research organization system  
**Related**: [[Curated Coffee Resources]], [[Web Clipper Templates]]

