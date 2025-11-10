---
type: documentation
title: Coffee Vault FAQ - Frequently Asked Questions
version: 5.0.0
date: 2025-10-28
tags: [faq, help, questions]
---

# ❓ Coffee Vault FAQ

**Frequently Asked Questions and Answers**

---

## 🚀 Getting Started

### Q: What is Coffee Vault?
**A**: Coffee Vault is a comprehensive Obsidian-based coffee intelligence platform that tracks your complete coffee journey from producer to cup, with advanced ML analytics, supply chain transparency, and personal development tracking.

### Q: Do I need any paid plugins?
**A**: No. Coffee Vault works with free community plugins (Datacore, Templater, Calendar). Obsidian itself has a free version that works perfectly.

### Q: How long does setup take?
**A**: 10-15 minutes for basic setup (install plugins, configure templates). You can start logging immediately and explore advanced features over time.

### Q: Can I use Coffee Vault on mobile?
**A**: Yes! Obsidian has mobile apps (iOS/Android). Coffee Vault includes mobile-optimized templates and responsive visualizations.

---

## 📊 Features & Functionality

### Q: How many brews do I need to log before analytics work?
**A**:
- Basic stats: 1 brew
- Patterns emerge: 10 brews
- Correlations: 20 brews
- ML predictions accurate: 50+ brews
- Full power: 100+ brews

### Q: What's new in Coffee Vault 5.0?
**A**: 6 new entity types (Producer, Recipe, Cupping, Event, Goal, Equipment Model), graph relationships, supply chain transparency, 5 new analytics dashboards, enhanced properties, hierarchical tagging, and much more. See [[COFFEE-VAULT-5.0-RELEASE-NOTES]].

### Q: Is Coffee Vault 5.0 compatible with 4.0?
**A**: Yes, 100% backward compatible. All 4.0 content works unchanged. New features are additive and optional.

### Q: Can I customize Coffee Vault?
**A**: Absolutely! Modify templates, create custom queries, add properties, build custom dashboards. See [[Property-Schema]] for extensibility.

---

## 🔧 Technical Questions

### Q: Why aren't my queries showing data?
**A**: Check:
1. Datacore plugin installed and enabled
2. Notes have `type:` property in frontmatter
3. Property names use kebab-case (`brew-method` not `brewMethod`)
4. Folder names match query paths exactly

### Q: Templates aren't working - why?
**A**: Check:
1. Templater plugin installed
2. Template folder set to "Templates" in settings
3. "Trigger on file creation" enabled
4. Template syntax is correct

### Q: Visualizations won't load - help!
**A**: 
1. Open HTML files in external browser (recommended)
2. Enable JavaScript in browser
3. Check browser console for errors
4. Some features limited in Obsidian's embedded browser

### Q: How do I back up my data?
**A**: Coffee Vault is just markdown files:
1. Copy entire folder to backup location
2. Use Git for version control
3. Use Obsidian Sync (paid)
4. Use any cloud service (Dropbox, iCloud, etc.)

---

## 📱 Mobile & Sync

### Q: Does Coffee Vault work offline?
**A**: Yes, completely! Obsidian is local-first. All data stored on your device. Visualizations work offline (except CDN-loaded libraries).

### Q: Can I sync between devices?
**A**: Yes, options:
1. Obsidian Sync (paid, official)
2. Git (free, technical)
3. iCloud/Dropbox (free, simple)
4. Syncthing (free, privacy-focused)

### Q: How do I log coffee on mobile?
**A**: Use `Templates/Mobile Quick Capture.md` or `Templates/Quick Coffee Capture.md` for fast mobile logging.

---

## 💰 Cost & Value

### Q: Is Coffee Vault free?
**A**: Yes, completely free and open source (MIT license). Obsidian itself is free for personal use.

### Q: What does Obsidian Sync cost?
**A**: $10/month (optional, not required). You can sync free with Git or cloud storage.

### Q: Are there any hidden costs?
**A**: No. Everything is free. Optional purchases:
- Obsidian Sync ($10/month)
- Obsidian Publish ($20/month, if sharing)
- TDS meter ($30-200, if measuring extraction)

---

## 🫘 Coffee Questions

### Q: What beans should I start with?
**A**: Start with Ethiopian (Yirgacheffe), Colombian, or Guatemalan washed coffees. Light to medium roast. These are forgiving and showcase quality. See [[Beans Library/]] for profiles.

### Q: What brewing method is best for beginners?
**A**: V60 or Aeropress. Both are forgiving, versatile, and teach fundamental skills. See [[Brewing Guide]].

### Q: How do I find transparent coffee?
**A**: Check [[10-Supply-Chain-Transparency-Dashboard]], look for Direct Trade roasters, create [[Producers/]] profiles. Target transparency score 7+.

### Q: What equipment do I really need?
**A**: Minimum: Quality burr grinder ($100+), brewing method ($20-50), scale ($15-30), kettle ($30-80). See [[Coffee-Equipment-Buying-Guide]].

---

## 🔬 Analytics & ML

### Q: How accurate are the ML predictions?
**A**: Accuracy improves with data:
- 20 logs: ~60% accuracy
- 50 logs: ~75% accuracy
- 100+ logs: ~85% accuracy
Confidence scores provided with each prediction.

### Q: Can I export my data?
**A**: Yes! 
- CSV export from visualizations
- JSON export from scripts
- PDF export from Obsidian
- All data is in plain markdown (always accessible)

### Q: What programming knowledge do I need?
**A**: None for basic use. Some JavaScript helpful for:
- Custom scripts
- Advanced queries
- Modifying visualizations
But templates and queries work out-of-box.

---

## 🎯 Goals & Development

### Q: How do goals work?
**A**: Create goals with `Templates/Coffee Goal.md`. Progress auto-updates from your coffee logs. Track in [[Goals-Dashboard-View]] and [[11-Learning-Development-Dashboard]].

### Q: Can Coffee Vault help me improve?
**A**: Yes! Through:
- Real-time brewing guidance
- ML-powered optimization
- Pattern recognition
- Learning path generation
- Skill tracking
- Goal progress monitoring

### Q: How do I get SCA certified?
**A**: Coffee Vault can help prepare:
1. Set goal with `Templates/Coffee Goal.md`
2. Practice cupping with `Templates/Cupping Session.md`
3. Study [[Scientific References/]]
4. Track progress in [[11-Learning-Development-Dashboard]]
5. Enroll in SCA courses when ready

---

## 🌱 Supply Chain & Ethics

### Q: Why track supply chains?
**A**: Know where your coffee comes from, support ethical practices, verify certifications, ensure farmers get fair prices. Coffee Vault makes transparency easy.

### Q: How do I create a producer profile?
**A**: Use `Templates/Producer Profile.md`. Add information from:
- Roaster websites
- Bag labels
- Direct trade documentation
- Origin trip reports

### Q: What's a good transparency score?
**A**:
- 7-8: Good (most info available)
- 9-10: Excellent (complete chain documented)
- Target: 80% of beans with score 7+

---

## 🔄 Workflow Questions

### Q: How often should I log?
**A**: Every brew! Logging immediately (2 minutes) while details are fresh yields best data. Consistency is key.

### Q: What if I miss logging a brew?
**A**: Log retroactively if you remember details. Better late than never. But aim for immediate logging.

### Q: Should I use Coffee Log v3 or v5?
**A**: 
- **v3**: Simpler, works great, proven
- **v5**: More features, context-aware, enhanced properties
Both work perfectly. Try v5, fall back to v3 if preferred.

### Q: How do I generate a recipe?
**A**: After 3+ successful brews (4.5+ rating) with same bean:
```bash
node Scripts/auto-recipe-generator.js
```
Or create manually with `Templates/Recipe Profile.md`.

---

## 🎨 Customization

### Q: Can I change the colors/theme?
**A**: Yes! Edit CSS files in `CSS/` folder or create custom snippets in `.obsidian/snippets/`.

### Q: Can I add custom properties?
**A**: Yes! Follow guidelines in [[Property-Schema]]. Use kebab-case naming, document in personal schema extension.

### Q: Can I create custom dashboards?
**A**: Yes! Copy existing dashboards from `Analytics/` or `Views/` and modify queries. Datacore/Dataviewjs documentation helps.

---

## 🐛 Troubleshooting

### Q: Everything is slow - help!
**A**:
- Close unused tabs
- Use `.limit()` in all queries
- Disable unused plugins
- Clear Obsidian cache (restart)
- Check for large files

### Q: Links are broken - why?
**A**: Check:
- File moved? Update links or enable auto-update in settings
- Typo in link? Use autocomplete (type [[Coffee Log]] or [[Advanced-Analytics-Base]] - sorted by average rating.

### Q: How do I improve my brewing?
**A**: 
1. Use [[9-Real-Time-Brewing-Assistant]]
2. Check [[2-Brewing-Optimization-Engine]]
3. Study [[Scientific References/Extraction Science/]]
4. Practice consistently
5. Measure and adjust

### Q: What if I just want to track basics?
**A**: Use simple Coffee Log template, ignore advanced features. Coffee Vault scales to your needs. Start simple, add complexity when ready.

---

## 🎯 Next Steps

**Still have questions?**
- Check [[Documentation/]] for detailed guides
- Search vault (Cmd/Ctrl+Shift+F)
- Explore [[HOME-DASHBOARD]] for navigation
- Review [[START-HERE]] for fundamentals

**Need help?**
- Check GitHub Issues
- Review documentation
- Explore examples in each folder

---

**Coffee Vault 5.0** - Your questions answered

**Version**: 5.0.0  
**Last Updated**: 2025-10-28  
**Always Growing**: Add your own Q&A!

