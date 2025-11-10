---
type: guide
tags: [web-clipper, templates, research, setup]
---

# 🌐 Web Clipper Templates

**Capture coffee research directly into your vault**

The Obsidian Web Clipper (browser extension) saves web content as markdown notes. These custom templates optimize clipping for coffee-related research.

**Install**: [Obsidian Web Clipper](https://obsidian.md/clipper) - Available for Chrome, Firefox, Safari, iOS, Android

---

## 🎯 Template Overview

We'll create 5 specialized templates:

1. **Roaster Website** - Capture roaster info and offerings
2. **Coffee Review** - Save professional reviews and ratings
3. **Brewing Tutorial** - Document technique guides
4. **Origin/Farm Page** - Preserve producer information
5. **YouTube Coffee Video** - Clip videos with transcripts

---

## ⚙️ Setup Instructions

### 1. Install Web Clipper

1. Visit [Obsidian Web Clipper page](https://obsidian.md/clipper)
2. Add extension to your browser
3. Click Obsidian icon in toolbar
4. Connect to your vault (first time only)

### 2. Access Templates

In Web Clipper interface:
- Click settings icon (⚙️)
- Navigate to "Templates"
- Click "+ New Template"

### 3. Create Each Template

Follow templates below, creating one at a time.

---

## ☕ Template 1: Roaster Website

**Use For**: Coffee roaster websites, roastery pages, online shops

### Template Code

```yaml
---
type: roaster-clip
source: {{url}}
title: {{title}}
author: {{byline}}
clipped: {{date:YYYY-MM-DD}}
tags: [web-clip, roaster, coffee]
roaster-name: 
location: 
website: {{url}}
specialty: 
tags: [roaster, coffee, web-clip]
---

# ☕ {{title}}

**Source**: [{{title}}]({{url}})  
**Clipped**: {{date:YYYY-MM-DD}}

---

## 📖 About the Roaster

{{contentMarkdown}}

---

## 🫘 Coffees Offered

[Extract from page - update manually]

- Coffee 1: Origin, Price, Tasting Notes
- Coffee 2: Origin, Price, Tasting Notes
- Coffee 3: Origin, Price, Tasting Notes

---

## 📍 Details to Extract

**Location**: [Find and paste]  
**Founded**: [Find and paste]  
**Roasting Philosophy**: [Find and paste]  
**Direct Trade?**: [Yes/No]  
**Shipping**: [Info]

---

## 🔗 Links

**Website**: {{url}}  
**Shop**: [Find shop URL]  
**Instagram**: [Find if available]  
**Subscription**: [Find if available]

---

## 💭 My Notes

[Personal observations and interest level]

---

## ✅ Next Actions

- [ ] Create roaster profile: [[Roasters/{{title}}]]
- [ ] Browse coffee offerings
- [ ] Compare to other roasters
- [ ] Consider purchase

---

**Tags**: {{tags}}  
**Related**: [[Roasters/|All Roasters]]
```

### Usage

1. Visit roaster website
2. Click Obsidian clipper
3. Select "Roaster Website" template
4. Clip
5. Open note in Obsidian
6. Fill in extracted details
7. Link to roaster profile

---

## ⭐ Template 2: Coffee Review

**Use For**: Coffee review websites, blog posts, professional tastings

### Template Code

```yaml
---
type: coffee-review-clip
source: {{url}}
title: {{title}}
author: {{byline}}
clipped: {{date:YYYY-MM-DD}}
tags: [web-clip, review, coffee]
reviewer: {{byline}}
rating-system: 
origin: 
roaster: 
---

# ⭐ Coffee Review: {{title}}

**Source**: [{{title}}]({{url}})  
**Reviewer**: {{byline}}  
**Clipped**: {{date:YYYY-MM-DD}}

---

## 📋 Review Content

{{contentMarkdown}}

---

## ☕ Coffee Details

**Coffee**: [Extract name]  
**Roaster**: [Extract roaster]  
**Origin**: [Extract origin]  
**Process**: [Extract processing method]  
**Roast Level**: [Extract roast level]

---

## 🎯 Reviewer's Rating

**Overall Score**: [Extract rating]  
**Rating System**: [e.g., 0-100, 1-5 stars]

**Flavor Notes** (from review):
- [Note 1]
- [Note 2]
- [Note 3]

**Reviewer's Opinion**:
[Extract key positive/negative points]

---

## 💭 My Thoughts

[Do I agree? Want to try this coffee?]

Interest Level: ⭐⭐⭐⭐⭐ (X/5)

---

## 🔗 Related

**Original Review**: {{url}}  
**Roaster Page**: [Find if available]  
**Purchase Link**: [Find if available]

**My Logs of Similar Coffee**:
```datacore
const logs = dc.pages('"Coffee Logs"')
  .where(p => p.origin === "[ORIGIN]" || p.roaster === "[ROASTER]");
return logs.length > 0 ? <dc.List items={logs.map(log => ({content: log.$link}))} /> : <p>None yet - try this coffee!</p>
```

---

## ✅ Actions

- [ ] Consider purchasing this coffee
- [ ] Add roaster to [[Roasters/|tracking]]
- [ ] Compare to similar origins in [[Origins/|profiles]]
- [ ] Bookmark for future reference

---

**Tags**: {{tags}}  
**Saved from**: {{url}}
```

### Usage

1. Find professional review (Coffee Review, Perfect Daily Grind, etc.)
2. Clip with this template
3. Extract ratings and notes
4. Compare to your own experiences
5. Add to shopping wishlist

---

## 🔧 Template 3: Brewing Tutorial

**Use For**: Brewing guides, technique articles, how-to posts

### Template Code

```yaml
---
type: brewing-tutorial-clip
source: {{url}}
title: {{title}}
author: {{byline}}
clipped: {{date:YYYY-MM-DD}}
tags: [web-clip, brewing, tutorial]
brew-method: 
difficulty: 
---

# 🔧 Brewing Tutorial: {{title}}

**Source**: [{{title}}]({{url}})  
**Author**: {{byline}}  
**Clipped**: {{date:YYYY-MM-DD}}

---

## 📖 Tutorial Content

{{contentMarkdown}}

---

## ⚙️ Recipe Summary

**Method**: [Extract method - Pour Over, Espresso, etc.]  
**Difficulty**: [Beginner/Intermediate/Advanced]  
**Time**: [Extract time]

**Basic Recipe**:
- Coffee: [Extract dose]
- Water: [Extract amount]
- Ratio: [Extract ratio]
- Grind: [Extract grind size]
- Temperature: [Extract temp]
- Time: [Extract brew time]

---

## 📝 Key Takeaways

[Extract 3-5 main points from tutorial]

1. 
2. 
3. 
4. 
5. 

---

## 💡 Tips & Tricks

[Extract notable tips mentioned]

- Tip 1
- Tip 2
- Tip 3

---

## 🔗 Related Resources

**Original Article**: {{url}}  
**Related Guide**: [[Brewing Guides/[Method] Guide]]

**Video Tutorials** (if mentioned):
- [Link 1]
- [Link 2]

---

## 🧪 Try This

**Experiment**: [Describe what to test based on tutorial]

- [ ] Try this technique next brew
- [ ] Note differences from my usual method
- [ ] Log results in [[Coffee Log]]

---

## 💭 My Experience

[After trying - did it work? What changed?]

---

**Tags**: {{tags}}  
**Method**: [[Brewing Guide|All Guides]]
```

### Usage

1. Find brewing tutorial or technique article
2. Clip using this template
3. Extract recipe and key points
4. Cross-reference with your brewing guides
5. Experiment and log results

---

## 🌍 Template 4: Origin/Farm Page

**Use For**: Coffee farm pages, origin information, producer stories

### Template Code

```yaml
---
type: origin-clip
source: {{url}}
title: {{title}}
clipped: {{date:YYYY-MM-DD}}
tags: [web-clip, origin, producer]
origin-country: 
farm-name: 
---

# 🌍 Origin Research: {{title}}

**Source**: [{{title}}]({{url}})  
**Clipped**: {{date:YYYY-MD}}

---

## 📖 Content

{{contentMarkdown}}

---

## 📍 Location Details

**Country**: [Extract]  
**Region**: [Extract]  
**Farm/Producer**: [Extract]  
**Altitude**: [Extract MASL]  
**Varietal**: [Extract]

---

## 🌱 Growing Details

**Climate**: [Extract climate info]  
**Soil**: [Extract soil type]  
**Processing**: [Extract methods used]  
**Harvest Season**: [Extract]  
**Annual Production**: [Extract if available]

---

## 🏆 Quality & Certifications

**Certifications**:
- [ ] Organic
- [ ] Fair Trade
- [ ] Rainforest Alliance
- [ ] Direct Trade
- [ ] Other: [Specify]

**Awards/Recognition**: [Extract]

---

## ☕ Flavor Profile

**Expected Notes** (from producer):
- [Note 1]
- [Note 2]
- [Note 3]

**Recommended Brewing**: [Extract]

---

## 🔗 Sourcing Information

**Who Imports This?**: [Extract roasters carrying this coffee]  
**Availability**: [Extract season/availability]  
**Price Range**: [Extract if available]

**Purchase Options**:
- [Roaster 1]
- [Roaster 2]

---

## 💭 Research Notes

[Why I'm interested in this origin/farm]

---

## 🔗 Related

**Origin Profile**: [[Origins/[Country]]]  
**Roasters Using**: [List roasters]

---

## ✅ Actions

- [ ] Look for this coffee at roasters
- [ ] Read origin profile: [[Origins/[Country]]]
- [ ] Compare to coffees I've tried from this region
- [ ] Add to wishlist

---

**Tags**: {{tags}}  
**Source**: {{url}}
```

### Usage

1. Research coffee farms, cooperatives, or regions
2. Clip information
3. Link to origin profiles
4. Track sourcing at roasters
5. Inform purchase decisions

---

## 📺 Template 5: YouTube Coffee Video

**Use For**: YouTube tutorials, coffee education, interviews

### Template Code

```yaml
---
type: video-clip
source: {{url}}
title: {{title}}
creator: {{byline}}
clipped: {{date:YYYY-MM-DD}}
tags: [web-clip, video, youtube]
video-type: 
---

# 📺 Video: {{title}}

**Creator**: {{byline}}  
**Source**: [Watch on YouTube]({{url}})  
**Clipped**: {{date:YYYY-MM-DD}}

---

## 🎥 Video Description

{{contentMarkdown}}

---

## 📝 Key Points

[Extract or note main topics covered]

**Topics**:
1. 
2. 
3. 
4. 
5. 

---

## ⏱️ Timestamps

[Add important timestamps as you watch]

- 0:00 - Introduction
- X:XX - [Topic]
- X:XX - [Topic]
- X:XX - [Topic]
- X:XX - Conclusion

---

## 💡 Actionable Insights

[What can I apply from this video?]

**Try**:
- [ ] [Action 1]
- [ ] [Action 2]
- [ ] [Action 3]

---

## 🔗 Resources Mentioned

[Links/products/roasters mentioned in video]

- Resource 1
- Resource 2
- Resource 3

---

## 💭 My Notes

[Thoughts while watching or after]

---

## 🔗 Related Content

**Creator's Channel**: [Link if available]  
**Related Videos**: [List related]  
**Related Guide**: [[Brewing Guide|Brewing Guides]]

**Related Logs**: [If implementing technique]
```datacore
const logs = dc.pages('"Coffee Logs"')
  .where(p => p.notes && p.notes.includes("[VIDEO TOPIC]"))
  .sort(p => p.date, 'desc');
return logs.length > 0 ? <dc.List items={logs.map(log => ({content: log.$link}))} /> : <p>Try this technique and log it!</p>
```

---

## ✅ Actions

- [ ] Watch full video
- [ ] Take detailed notes
- [ ] Implement technique
- [ ] Log results

---

**Video**: {{url}}  
**Tags**: {{tags}}
```

### Usage with YTranscript Plugin

For videos with transcripts:

1. Copy YouTube URL
2. In Obsidian: Cmd/Ctrl + P → "YTranscript: Get Youtube transcript"
3. Transcript with timestamps added to note
4. Combine with web clipper template info

---

## 🎨 Template Customization

### Adding Fields

Modify templates to track additional information:

**Example additions**:
```yaml
purchase-price: 
purchase-date: 
tried: false
rating-my-scale: 
```

### Folder Organization

Configure Web Clipper to save to specific folders:

- Roaster clips → `Roasters/Clipped/`
- Reviews → `Reviews & Articles/`
- Tutorials → `Brewing Guides/Clipped/`
- Origins → `Origins/Research/`

### Auto-Tagging

Add automatic tags based on content:

```yaml
tags: [web-clip, {{date:YYYY/MM}}, coffee]
```

---

## 🔗 Integration with Vault

### Linking Clipped Research

**From Coffee Log**:
```markdown
## Research
Based on [[Ethiopia]]
```

**From Bean Profile**:
```markdown
## Producer Information
See [[Origins/Research/Farm Profile Name]]
```

**From Roaster Profile**:
```markdown
## Website
Clipped: [[Roasters/Clipped/Roaster Website]]
```

### Using Clipped Data

**In Bases Views**:
- Add "source" property column
- Filter by web-clip tag
- Track research sources

**In Datacore Queries**:
```datacore
const clips = dc.pages('#web-clip')
  .where(p => p.clipped >= "2025-10-01")
  .sort(p => p.clipped, 'desc');

return <dc.Table rows={clips} columns={[
  {id: "Title", value: c => c.$link},
  {id: "Type", value: c => c.type},
  {id: "Clipped", value: c => c.clipped}
]} />
```

---

## 💡 Pro Tips

### Clipping Strategy

**Before Purchasing**:
1. Clip roaster website
2. Clip any reviews of their beans
3. Clip origin information
4. Compare all in vault
5. Make informed decision

**Learning Technique**:
1. Clip tutorial
2. Clip video if available
3. Extract key steps
4. Practice and log results
5. Update brewing guide with learnings

**Research Archive**:
- Clip now, read later
- Tag by priority
- Review weekly
- Extract to main notes

### Mobile Clipping

Web Clipper works on mobile:
- iOS: Share → Obsidian
- Android: Share → Obsidian
- Uses same templates
- Syncs across devices

### Cleanup Routine

**Weekly**:
- Review clipped notes
- Extract important info to main notes
- Delete unnecessary clips
- Update links and tags

---

## 📋 Quick Reference

### Template Selection Guide

| Content Type | Template | Save Location |
|--------------|----------|---------------|
| Roaster website | Roaster Website | `Roasters/Clipped/` |
| Coffee review | Coffee Review | `Reviews & Articles/` |
| Brewing tutorial | Brewing Tutorial | `Brewing Guides/Clipped/` |
| Farm/origin info | Origin/Farm Page | `Origins/Research/` |
| YouTube video | YouTube Video | `Reviews & Articles/Videos/` |

### Common Actions After Clipping

- [ ] Read clipped content
- [ ] Extract key information
- [ ] Update main vault notes
- [ ] Add links to related notes
- [ ] Delete clip or move to archive

---

## 🆘 Troubleshooting

**Clipper Not Working?**
- Check extension is installed and active
- Verify vault connection in clipper settings
- Try refreshing page and re-clipping

**Template Not Applying?**
- Check template is saved in clipper settings
- Verify template syntax is correct
- Try default template first, then customize

**Content Not Formatting Correctly?**
- Use "Reader Mode" on cluttered pages
- Manually select content before clipping
- Edit markdown after clipping

**Missing Information?**
- Templates use available metadata
- Some sites don't provide all fields
- Manually add missing info after clipping

---

## 🔗 Resources

**Official**:
- [Obsidian Web Clipper Documentation](https://help.obsidian.md/Web+clipper)
- [Web Clipper Template Syntax](https://help.obsidian.md/Web+clipper/Template+format)

**Community**:
- [Obsidian Forum - Web Clipper](https://forum.obsidian.md/tag/web-clipper)
- [Template Sharing Thread](https://forum.obsidian.md/)

**Related Guides**:
- [[Plugin Installation Guide]] - Setup
- [[Bases Configuration Guide]] - Query clipped notes
- [[Datacore Examples]] - Analyze clipped research

---

## ✅ Setup Checklist

- [ ] Install Obsidian Web Clipper extension
- [ ] Connect to your coffee vault
- [ ] Create Roaster Website template
- [ ] Create Coffee Review template
- [ ] Create Brewing Tutorial template
- [ ] Create Origin/Farm template
- [ ] Create YouTube Video template
- [ ] Configure save folders
- [ ] Test clip a roaster website
- [ ] Practice with a coffee review

---

**Last Updated**: 2025-10-24  
**Web Clipper**: Available for all major browsers  
**Compatible**: Obsidian v1.0.0+

---

**Capture your coffee research effortlessly!** 🌐☕

