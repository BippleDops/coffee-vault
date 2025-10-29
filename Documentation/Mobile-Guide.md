# 📱 Mobile Coffee Vault Guide

**Version**: 1.0.0
**Last Updated**: 2025-10-25
**Purpose**: Complete guide to using Coffee Vault on mobile devices

This guide covers everything you need to know to use your Coffee Vault effectively on iOS and Android devices, from quick logging to advanced mobile workflows.

---

## Table of Contents

1. [Getting Started on Mobile](#getting-started-on-mobile)
2. [Mobile Quick Capture](#mobile-quick-capture)
3. [Touch Gestures](#touch-gestures)
4. [Mobile Dashboard](#mobile-dashboard)
5. [Offline Usage](#offline-usage)
6. [Best Practices](#best-practices)
7. [Performance Tips](#performance-tips)
8. [Troubleshooting](#troubleshooting)

---

## Getting Started on Mobile

### First-Time Setup

1. **Install Obsidian Mobile**
   - iOS: Download from App Store
   - Android: Download from Google Play Store

2. **Sync Your Vault**
   - Use Obsidian Sync (recommended)
   - Or use iCloud/Google Drive sync
   - Or manually copy vault to device

3. **Enable Mobile CSS**
   - Open Settings > Appearance > CSS snippets
   - Enable `mobile-responsive.css`

4. **Install Required Plugins**
   - Templater (essential for quick capture)
   - Dataview (for dashboards)
   - Datacore (for mobile components - optional)

5. **Pin Mobile Dashboard**
   - Open `Mobile Optimizations/mobile-dashboard.md`
   - Tap ⋯ menu > Pin to top
   - Or add to favorites for quick access

### Recommended Settings for Mobile

**Appearance**:
- Base font size: 16px (prevents zoom on iOS)
- Line width: Readable line length
- Enable "Readable line length" for better mobile reading

**Editor**:
- Enable "Auto pair brackets"
- Enable "Auto pair markdown syntax"
- Enable "Smart indent lists"

**Files & Links**:
- New file location: "Coffee Logs" folder
- Default location for attachments: "Attachments" folder

**Mobile-Specific**:
- Enable "Quick switcher" for fast navigation
- Enable "Command palette" for actions
- Set default template folder to "Templates"

---

## Mobile Quick Capture

The Mobile Quick Capture template is optimized for logging coffee on the go with minimal typing.

### Using Mobile Quick Capture

1. **Open Quick Capture**
   - Tap "Create new note" button
   - Select "Mobile Quick Capture" template
   - Or use quick action widget (iOS)

2. **Fill Essential Fields**
   - **Bean**: Select from recent or type new
   - **Method**: Tap brewing method (large buttons)
   - **Rating**: Tap 1-5 stars
   - Roaster, origin, and roast level are optional

3. **Add Quick Notes**
   - Use voice dictation for tasting notes
   - Take photo of bag or setup
   - Check flavor descriptors (optional)

4. **Save and Done**
   - All parameters auto-filled with smart defaults
   - Ready to view in dashboards immediately
   - Upgrade to full log later if desired

### Quick Capture Tips

**Voice Input**:
- iOS: Tap microphone on keyboard
- Android: Tap mic in keyboard
- Perfect for tasting notes while brewing

**Photo Capture**:
- Tap camera icon or paste from clipboard
- Best lighting: Natural, indirect
- Capture bag label for later reference

**Smart Defaults**:
- Morning logs default to pour-over, 200°F
- Afternoon logs default to espresso, 195°F
- Grind, ratio, and time pre-filled based on method

**Save Time**:
- Rating is most important field
- Other fields can be added later
- Use checkboxes for quick flavor notes

---

## Touch Gestures

Coffee Vault supports intuitive touch gestures for common actions.

### Swipe Gestures

**On Coffee Log Cards**:
- **Swipe left**: Archive log
- **Swipe right**: Share log
- **Swipe threshold**: 100px

**On Navigation**:
- **Swipe from left edge**: Open sidebar
- **Swipe from right edge**: Open outline

**In Lists**:
- **Swipe left**: Delete item
- **Swipe right**: Mark as favorite

### Long Press

**On Cards**:
- Long press (500ms) to open context menu
- Shows options: Edit, Share, Delete, Archive

**On Links**:
- Long press to preview without opening
- Quick view of linked note

**On Images**:
- Long press to save to device
- Or open in external app

### Double Tap

**On Cards**:
- Double tap to toggle favorite
- Quick star/unstar

**On Images**:
- Double tap to zoom
- Double tap again to reset zoom

### Pinch to Zoom

**On Charts**:
- Pinch out to zoom in
- Pinch in to zoom out
- Works on all visualizations

**On Images**:
- Pinch to zoom photos
- Smooth scaling animation

### Pull to Refresh

**On Dashboard**:
- Pull down from top to refresh data
- Updates all queries and stats
- Visual refresh indicator

---

## Mobile Dashboard

The mobile dashboard provides a scrollable, touch-optimized overview of your coffee journey.

### Dashboard Sections

All sections are collapsible for easy navigation:

**Quick Stats** (always visible):
- Total logs
- This month's logs
- Average rating
- Methods used

**Recent Favorites** (4+ stars):
- Last 5 highly-rated logs
- Card layout with full details
- Tap to expand brewing parameters

**Active Beans**:
- Current bean inventory
- Days since roast
- Price and weight info

**Brewing Methods**:
- Usage statistics
- Most-used methods
- Tap for method-specific logs

**Origins Explored**:
- Countries tried
- Average rating per origin
- Log count per origin

**This Week**:
- Last 7 days of logs
- Chronological order
- Quick overview of recent activity

**Quick Actions**:
- Large touch buttons
- Quick log, view all logs, view beans
- One-tap access to common tasks

### Using the Dashboard

**Expand/Collapse Sections**:
- Tap section header to toggle
- All sections collapsed on mobile by default
- Expand what you need

**Scroll Performance**:
- Dashboard uses lazy loading
- Cards render on demand
- Smooth scrolling on all devices

**Refresh Data**:
- Pull down from top
- Or tap refresh in menu
- Updates all statistics

---

## Offline Usage

Coffee Vault works fully offline on mobile devices.

### What Works Offline

**Full Functionality**:
- Create new logs (Mobile Quick Capture)
- Edit existing notes
- View all notes and dashboards
- Search across vault
- Navigate between notes

**Dataview Queries**:
- All queries work offline
- Statistics update in real-time
- No internet required

**Templates**:
- All templates work offline
- Templater functions execute locally
- No cloud dependency

### Sync When Online

**Automatic Sync**:
- Changes queue while offline
- Auto-sync when connection restored
- Conflict resolution if needed

**Manual Sync**:
- Pull down to refresh when online
- Ensures latest data
- Resolves any sync conflicts

### Offline Best Practices

1. **Pre-download vault**: Ensure full vault is on device
2. **Enable local storage**: Don't rely on cloud-only files
3. **Check sync status**: Green indicator = synced
4. **Resolve conflicts**: Review merge conflicts when they occur
5. **Regular backups**: Export vault periodically

---

## Best Practices

### Quick Logging Workflow

**The 30-Second Log**:
1. Open Mobile Quick Capture (5 sec)
2. Select bean, method, rating (15 sec)
3. Voice dictate quick note (10 sec)
4. Done!

**The 2-Minute Log**:
1. Use Quick Capture template
2. Add photo of bag/setup
3. Check flavor descriptors
4. Add voice-dictated tasting notes
5. Review and save

### Photo Management

**Best Practices**:
- Take photos in good lighting
- Capture bag labels for reference
- Show grind consistency
- Document brew setup
- Before/after shots

**Photo Organization**:
- All photos go to Attachments folder
- Name photos descriptively
- Link from logs with `![[photo-name.jpg]]`
- Resize large photos before import

### Voice Input Tips

**For Tasting Notes**:
- Speak clearly and slowly
- Say "comma" for punctuation
- Use simple descriptors
- Edit typos after dictation

**Common Phrases**:
- "Bright acidity"
- "Full body"
- "Sweet finish"
- "Complex flavors"
- "Smooth and balanced"

### Battery Conservation

**Extend Battery Life**:
- Use dark mode (OLED screens)
- Reduce screen brightness
- Close unused tabs
- Disable live preview when editing
- Use reader mode for long notes

---

## Performance Tips

### Optimize Mobile Experience

**Faster Loading**:
- Keep vault under 50MB for best performance
- Archive old logs to separate vault
- Compress large images
- Limit embedded queries on single notes

**Smooth Scrolling**:
- Use card layouts instead of tables
- Collapse unused dashboard sections
- Limit query results to 10-20 items
- Enable hardware acceleration in settings

**Reduce Memory Usage**:
- Close background tabs
- Restart app periodically
- Clear app cache monthly
- Use native Obsidian sync (fastest)

### Network Optimization

**Minimize Data Usage**:
- Sync only when on WiFi (Settings)
- Disable automatic attachment sync
- Download full vault for offline use
- Use compressed image formats

**Faster Sync**:
- Use Obsidian Sync (optimized)
- Sync during off-peak hours
- Exclude large files from sync
- Review sync settings regularly

---

## Troubleshooting

### Common Issues

**Template Not Working**:
- Ensure Templater plugin is enabled
- Check template folder setting
- Verify template syntax
- Restart Obsidian app

**Dashboard Not Loading**:
- Check if Dataview plugin is enabled
- Verify JavaScript is allowed
- Check for query syntax errors
- Clear app cache and reload

**Gestures Not Responding**:
- Ensure `gesture-handlers.js` is loaded
- Check browser console for errors
- Verify touch events are enabled
- Try reloading the note

**Images Not Displaying**:
- Check file path is correct
- Ensure image is in Attachments folder
- Verify image file extension
- Try re-linking image

**Slow Performance**:
- Archive old logs
- Reduce active plugins
- Clear app cache
- Restart device

**Sync Conflicts**:
- Review conflict file
- Choose correct version
- Merge changes manually if needed
- Delete conflict file after resolution

### Getting Help

**Resources**:
- [[Mobile-Troubleshooting|Mobile Troubleshooting Guide]]
- [[Documentation/Mobile-Offline-Guide|Offline Guide]]
- Obsidian Forum: forum.obsidian.md
- Obsidian Discord: discord.gg/obsidian

**Report Issues**:
1. Check troubleshooting guide first
2. Search community forum
3. Ask in Discord #mobile channel
4. Include device, OS version, Obsidian version

---

## Mobile-Specific Features

### iOS Features

**Widgets**:
- Add Obsidian widget to home screen
- Quick access to Mobile Quick Capture
- View recent logs at a glance

**Shortcuts**:
- Create Siri shortcut for quick logging
- "Hey Siri, log my coffee"
- Automated workflows

**Share Sheet**:
- Share coffee photos to Obsidian
- Save links to read later
- Quick capture from other apps

### Android Features

**Widgets**:
- Add quick capture widget
- View stats widget
- Open vault widget

**Share Intent**:
- Share to Obsidian from any app
- Quick note creation
- Photo import from gallery

**Tasker Integration**:
- Automate logging workflows
- Location-based templates
- Time-based reminders

---

## Keyboard Shortcuts on Mobile

**iOS with External Keyboard**:
- `⌘N`: New note
- `⌘O`: Quick switcher
- `⌘P`: Command palette
- `⌘F`: Search in note
- `⌘⇧F`: Search in vault

**Android with Keyboard**:
- `Ctrl+N`: New note
- `Ctrl+O`: Quick switcher
- `Ctrl+P`: Command palette
- `Ctrl+F`: Search in note
- `Ctrl+Shift+F`: Search in vault

---

## Advanced Mobile Workflows

### Morning Coffee Routine

1. Wake up, open mobile dashboard
2. Review yesterday's logs
3. Check active beans
4. Brew coffee
5. Use Mobile Quick Capture while brewing
6. Rate and add quick notes
7. Photo of cup (optional)
8. Dashboard auto-updates

### Coffee Shop Visit

1. Use quick capture on arrival
2. Photo of menu/bag
3. Voice dictate tasting notes
4. Rate while fresh in mind
5. Add location tag
6. Share to social media

### Experiment Tracking

1. Start with full Coffee Log template
2. Document all parameters carefully
3. Take multiple photos (grind, bloom, final cup)
3. Detailed tasting notes via voice
4. Compare to previous experiments
5. Note what to change next time

---

## Mobile-First Design Principles

All mobile features follow these principles:

**Touch-First**:
- Minimum 44x44px touch targets
- Large, thumb-friendly buttons
- Tap, don't hover

**Content-First**:
- Important info at top
- Progressive disclosure
- Collapsible sections

**Performance-First**:
- Fast loading
- Smooth animations
- Minimal battery drain

**Offline-First**:
- Works without internet
- Local data storage
- Sync when available

**Context-Aware**:
- Time-based defaults
- Location awareness (if enabled)
- Previous behavior learning

---

## Mobile Comparison: iOS vs Android

| Feature | iOS | Android | Notes |
|---------|-----|---------|-------|
| App Performance | Excellent | Excellent | Native on both |
| Sync Speed | Very Fast | Very Fast | Using Obsidian Sync |
| Gesture Support | Full | Full | All gestures work |
| Widgets | Yes | Yes | Different implementations |
| Voice Input | Excellent | Excellent | Platform-native |
| Photo Capture | Excellent | Excellent | Native camera integration |
| Offline Mode | Full | Full | Complete offline support |
| Battery Usage | Low | Low | Optimized for mobile |
| Dark Mode | Yes | Yes | System-wide support |

---

## Recommended Mobile Devices

**Minimum Requirements**:
- iOS 13+ or Android 7+
- 2GB RAM
- 100MB free storage
- Touch screen

**Optimal Experience**:
- iOS 15+ or Android 11+
- 4GB+ RAM
- 500MB+ free storage
- High-resolution display (for photos)

**Device-Specific Tips**:
- **iPhone SE/Mini**: Portrait mode, collapsed sections
- **iPhone Pro Max**: Landscape for two-column layout
- **iPad**: Full desktop-like experience
- **Android Phones**: Use gestures, customize widgets
- **Android Tablets**: Split-screen with brewing guides

---

## Future Mobile Enhancements

**Planned Features** (check for updates):
- [ ] Apple Watch companion app
- [ ] Android Wear support
- [ ] NFC tag scanning for quick bean lookup
- [ ] Camera ML for grind size estimation
- [ ] Bluetooth scale integration
- [ ] Timer integration with brewingmethods
- [ ] Calendar integration
- [ ] Location-based cafe logging

---

## Conclusion

The Coffee Vault is designed to be as powerful on mobile as on desktop. Use the Mobile Quick Capture for daily logging, leverage touch gestures for efficient navigation, and enjoy full offline functionality wherever you brew.

**Quick Start Checklist**:
- [ ] Install Obsidian mobile app
- [ ] Sync vault to device
- [ ] Enable mobile CSS snippet
- [ ] Install Templater plugin
- [ ] Bookmark mobile dashboard
- [ ] Try Mobile Quick Capture
- [ ] Test offline functionality
- [ ] Customize for your workflow

Happy mobile coffee logging!

---

**Related Guides**:
- [[Mobile-Troubleshooting|Troubleshooting Guide]]
- [[Documentation/Mobile-Offline-Guide|Offline Guide]]
- [[Templates/Mobile Quick Capture|Quick Capture Template]]
- [[Mobile Optimizations/mobile-dashboard|Mobile Dashboard]]

---

*For desktop features and full vault capabilities, see [[README|Main Documentation]]*
