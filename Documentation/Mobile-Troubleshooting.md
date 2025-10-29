# 🔧 Mobile Coffee Vault Troubleshooting

**Version**: 1.0.0
**Last Updated**: 2025-10-25
**Purpose**: Comprehensive troubleshooting guide for mobile issues

This guide helps you diagnose and fix common mobile-specific issues with Coffee Vault.

---

## Quick Diagnostic Checklist

Before diving into specific issues, run through this checklist:

- [ ] Obsidian mobile app is up to date
- [ ] Vault is fully synced to device
- [ ] Required plugins are installed and enabled
- [ ] `mobile-responsive.css` snippet is enabled
- [ ] Device has sufficient storage (100MB+ free)
- [ ] Device is running supported OS version
- [ ] App has necessary permissions (storage, camera)

---

## Common Issues & Solutions

### 1. Mobile Quick Capture Template Not Working

**Symptoms**:
- Template doesn't load
- Prompts don't appear
- Template creates empty note

**Diagnosis**:
```
Check Settings > Community Plugins > Templater
Status should be "Enabled"
```

**Solutions**:

**Solution A: Enable Templater**
1. Open Settings (⚙️)
2. Navigate to Community Plugins
3. Find "Templater"
4. Toggle to enable
5. Restart Obsidian app

**Solution B: Configure Templater Settings**
1. Open Settings > Templater
2. Set "Template folder location" to `Templates`
3. Enable "Trigger Templater on new file creation"
4. Enable "Enable System Commands"
5. Save and restart

**Solution C: Fix Template Syntax**
1. Open `Templates/Mobile Quick Capture.md`
2. Check for syntax errors in Templater code
3. Ensure all `<% %>` tags are properly closed
4. Verify suggester options are valid arrays
5. Test template on desktop first

**Verification**:
- Create new note using template
- Should see prompts for bean, method, rating
- All fields should populate correctly

---

### 2. Dashboard Sections Not Loading

**Symptoms**:
- Empty dashboard sections
- "No results" message
- Spinning loader never completes

**Diagnosis**:
```
Check Settings > Community Plugins > Dataview
Status should be "Enabled"
Check Settings > Dataview > Enable JavaScript Queries
Should be checked
```

**Solutions**:

**Solution A: Enable Dataview**
1. Settings > Community Plugins
2. Enable "Dataview" plugin
3. Restart app
4. Reload dashboard

**Solution B: Enable JavaScript Queries**
1. Settings > Dataview
2. Check "Enable JavaScript Queries"
3. Check "Enable Inline JavaScript Queries"
4. Save and reload

**Solution C: Fix Query Syntax**
1. Open dashboard in edit mode
2. Check dataviewjs code blocks
3. Look for syntax errors in console
4. Common issues:
   - Missing semicolons
   - Undefined variables
   - Incorrect property names
5. Test queries individually

**Solution D: Check Data**
1. Verify coffee logs exist in "Coffee Logs" folder
2. Check that logs have required properties (date, rating, etc.)
3. Ensure property names match schema exactly
4. Run validation query:
```dataview
TABLE type, date, rating
FROM "Coffee Logs"
LIMIT 5
```

**Verification**:
- Dashboard sections should load within 2-3 seconds
- Stats should show accurate numbers
- Cards should display properly

---

### 3. Touch Gestures Not Responding

**Symptoms**:
- Swipe actions don't trigger
- Long press doesn't work
- Pinch zoom not functioning

**Diagnosis**:
```
Check browser console for JavaScript errors
Check if gesture-handlers.js is loaded
```

**Solutions**:

**Solution A: Load Gesture Handlers**
1. Verify file exists: `Mobile Optimizations/gesture-handlers.js`
2. Add to note that needs gestures:
```html
<script src="app://local/Mobile Optimizations/gesture-handlers.js"></script>
```
3. Or load globally in CSS snippet

**Solution B: Check Touch Events**
1. Settings > Appearance
2. Ensure "Native scrollbars" is disabled
3. Check "Hardware acceleration" is enabled
4. Restart app

**Solution C: Clear App Cache**
1. iOS: Delete and reinstall app (vault syncs back)
2. Android: Settings > Apps > Obsidian > Clear Cache
3. Re-sync vault
4. Test gestures again

**Solution D: Test Systematically**
```javascript
// Add to note to test touch detection
document.addEventListener('touchstart', (e) => {
  console.log('Touch detected:', e.touches[0]);
});
```

**Verification**:
- Swipe left/right on cards should show actions
- Long press should vibrate (if supported)
- Pinch zoom should scale charts

---

### 4. Mobile Responsive Styles Not Applied

**Symptoms**:
- Desktop layout on mobile
- Text too small to read
- Elements overlapping
- Horizontal scrolling required

**Diagnosis**:
```
Check Settings > Appearance > CSS Snippets
Verify mobile-responsive.css is enabled
```

**Solutions**:

**Solution A: Enable CSS Snippet**
1. Settings > Appearance > CSS snippets
2. Find `mobile-responsive.css`
3. Toggle to enable (should show checkmark)
4. Close settings (auto-applies)

**Solution B: Verify CSS File**
1. Check file exists: `CSS/mobile-responsive.css`
2. Open file and check for syntax errors
3. Ensure no missing closing braces `}`
4. Verify media queries are correct

**Solution C: Force Reload Styles**
1. Disable CSS snippet
2. Close Obsidian app completely
3. Reopen app
4. Re-enable CSS snippet
5. Reload current note

**Solution D: Check Viewport Meta**
```html
<!-- Should be in note or global CSS -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**Verification**:
- Text should be minimum 16px (no zoom required)
- Touch targets should be large (44x44px minimum)
- Single column layout on phone
- No horizontal scrolling

---

### 5. Images Not Displaying

**Symptoms**:
- Broken image icons
- Image placeholders only
- Photos uploaded but not visible

**Diagnosis**:
```
Check attachment folder setting
Verify image file exists
Check image file path
```

**Solutions**:

**Solution A: Fix File Path**
1. Correct syntax: `![[image-name.jpg]]`
2. Not: `![](image-name.jpg)` (wrong syntax)
3. Include extension (.jpg, .png, .heic)
4. Case-sensitive on Android

**Solution B: Move to Attachments Folder**
1. Settings > Files & Links
2. Check "Default location for new attachments"
3. Should be set to `Attachments` folder
4. Move existing images to Attachments folder
5. Update links in notes

**Solution C: Convert HEIC to JPG (iOS)**
1. iOS photos often save as HEIC
2. Convert to JPG before importing:
   - iOS Shortcuts app
   - Convert to JPEG action
   - Save to Files
3. Or change iPhone settings:
   - Settings > Camera > Formats
   - Select "Most Compatible"

**Solution D: Check File Size**
1. Large images (>5MB) may not load on mobile
2. Resize before importing:
   - iOS: Use built-in editor
   - Android: Use gallery app
3. Recommended: <2MB per image
4. Use image compression apps

**Verification**:
- Images should load within 2 seconds
- Photos should display full-width on mobile
- Zoom should work with pinch gesture

---

### 6. Slow Performance

**Symptoms**:
- App takes long to open
- Scrolling is laggy
- Queries take forever
- Battery drains quickly

**Diagnosis**:
```
Check vault size
Count active plugins
Check device storage
Monitor app memory usage
```

**Solutions**:

**Solution A: Optimize Vault Size**
1. Archive old logs (>1 year) to separate vault
2. Compress large images
3. Remove unused attachments
4. Target vault size: <50MB for best mobile performance

**Solution B: Reduce Active Plugins**
1. Settings > Community Plugins
2. Disable plugins you don't use
3. Essential only: Templater, Dataview
4. Optional: Datacore (only if needed)
5. Restart app

**Solution C: Limit Query Results**
1. Add `LIMIT 10` to Dataview queries
2. Don't load all logs on one page
3. Use pagination for large result sets
4. Example:
```dataview
TABLE rating, beans, date
FROM "Coffee Logs"
SORT date DESC
LIMIT 10
```

**Solution D: Enable Hardware Acceleration**
1. Settings > Appearance
2. Enable "Hardware acceleration"
3. Restart app
4. Should see smoother animations

**Solution E: Clear Cache**
1. iOS: Delete app, reinstall, re-sync
2. Android: Clear cache in app settings
3. Rebuild search index
4. Restart device

**Verification**:
- App should open in <3 seconds
- Scrolling should be 60fps smooth
- Queries complete in <2 seconds
- Battery usage <5% per hour of active use

---

### 7. Sync Issues

**Symptoms**:
- Changes not syncing
- Conflict files appearing
- "Sync failed" errors
- Old data showing

**Diagnosis**:
```
Check sync status icon
Verify internet connection
Check Obsidian Sync subscription
Review sync settings
```

**Solutions**:

**Solution A: Force Manual Sync**
1. Pull down on any note to refresh
2. Or: Tap sync icon in sidebar
3. Wait for green checkmark
4. Verify changes appear

**Solution B: Resolve Sync Conflicts**
1. Look for files ending in `-sync-conflict`
2. Open both versions
3. Manually merge important changes
4. Delete conflict file
5. Re-sync

**Solution C: Check Sync Settings**
1. Settings > Sync
2. Verify "Sync on startup" is enabled
3. Check "Sync automatically" is on
4. Ensure device has sync permissions
5. Check excluded folders don't include important data

**Solution D: Reset Sync**
1. Settings > Sync
2. "Disconnect" from remote vault
3. "Connect" again
4. Wait for full re-sync
5. May take several minutes

**Solution E: Switch Sync Method**
- If using iCloud: Try Obsidian Sync (faster, more reliable)
- If using Google Drive: Try Obsidian Sync
- Obsidian Sync is optimized for mobile

**Verification**:
- Changes should sync within 30 seconds
- No conflict files appear
- Sync icon shows green checkmark
- Same data on all devices

---

### 8. Offline Mode Not Working

**Symptoms**:
- Can't create notes without internet
- "No connection" errors
- Queries don't run offline
- Features disabled

**Diagnosis**:
```
Check if vault is downloaded locally
Verify plugin settings
Test in airplane mode
```

**Solutions**:

**Solution A: Download Full Vault**
1. Connect to WiFi
2. Settings > Sync
3. Enable "Sync attachments"
4. Wait for complete download
5. Verify all files present

**Solution B: Enable Offline Plugins**
1. Templater: Works offline by default
2. Dataview: Works offline (no external queries)
3. Disable plugins that require internet

**Solution C: Test Offline Functionality**
1. Enable airplane mode
2. Open Obsidian
3. Create new note with template
4. Should work normally
5. Edit existing notes
6. Run queries

**Verification**:
- All features work in airplane mode
- Can create and edit notes
- Queries execute normally
- Sync resumes when online

---

### 9. Voice Input Not Working

**Symptoms**:
- Microphone button missing
- Voice input not transcribing
- Wrong language detected
- Dictation errors

**Diagnosis**:
```
Check keyboard settings
Verify microphone permissions
Test in other apps
Check language settings
```

**Solutions**:

**Solution A: Enable Dictation (iOS)**
1. Settings (iPhone) > General > Keyboard
2. Enable "Enable Dictation"
3. Select language
4. Restart Obsidian

**Solution B: Enable Voice Input (Android)**
1. Settings > System > Languages & input
2. On-screen keyboard > Google Keyboard
3. Enable "Voice typing"
4. Grant microphone permission

**Solution C: Grant Microphone Permission**
1. iOS: Settings > Obsidian > Microphone > Allow
2. Android: Settings > Apps > Obsidian > Permissions > Microphone
3. Restart app

**Solution D: Check Language**
1. Ensure keyboard language matches dictation language
2. iOS: Settings > General > Keyboard > Keyboards
3. Android: Keyboard settings > Languages
4. Select correct language

**Verification**:
- Microphone icon appears on keyboard
- Tap to start dictation
- Spoken words appear as text
- Punctuation works ("comma", "period")

---

### 10. Battery Draining Quickly

**Symptoms**:
- Obsidian uses >10% battery per hour
- Device gets warm
- Battery drain even when app closed

**Diagnosis**:
```
Check battery usage stats
Monitor app background activity
Review active features
```

**Solutions**:

**Solution A: Enable Dark Mode**
1. Settings > Appearance > Theme
2. Select "Dark mode"
3. Saves battery on OLED screens
4. Reduce screen brightness

**Solution B: Disable Auto-Sync**
1. Settings > Sync
2. Disable "Sync automatically"
3. Use manual sync (pull to refresh)
4. Sync only on WiFi

**Solution C: Reduce Visual Effects**
1. Settings > Appearance
2. Disable animations
3. Reduce transparency
4. Use simpler theme

**Solution D: Close Background Tabs**
1. Don't leave many notes open
2. Close unused notes
3. Clear workspace regularly
4. Use "Close all" command

**Solution E: Limit Background Activity**
1. iOS: Settings > General > Background App Refresh > Obsidian > Off
2. Android: Settings > Apps > Obsidian > Battery > Optimize
3. Prevent background sync

**Verification**:
- Battery usage <5% per hour active use
- Device stays cool
- Battery drain stops when app closed

---

## Platform-Specific Issues

### iOS-Specific Issues

**Issue: Widget Not Updating**
- Solution: Remove widget, re-add
- Solution: Restart iPhone
- Solution: Check Obsidian permissions

**Issue: iCloud Sync Slow**
- Solution: Switch to Obsidian Sync
- Solution: Check iCloud storage
- Solution: Force iCloud sync (Settings > Apple ID > iCloud)

**Issue: Share Sheet Not Working**
- Solution: Grant all permissions
- Solution: Reinstall app
- Solution: Update to latest iOS

### Android-Specific Issues

**Issue: Widget Not Appearing**
- Solution: Update Android System WebView
- Solution: Clear launcher cache
- Solution: Restart device

**Issue: File Access Permission**
- Solution: Grant storage permission
- Solution: Use scoped storage location
- Solution: Move vault to internal storage

**Issue: Back Button Closes App**
- Solution: Expected behavior
- Solution: Use in-app navigation
- Solution: Create custom back button workflow

---

## Advanced Diagnostics

### Enable Debug Mode

**For Templater Issues**:
1. Settings > Templater > Log level
2. Set to "Debug"
3. Check console for detailed errors
4. Share logs when reporting issues

**For Dataview Issues**:
1. Open Developer Console:
   - iOS: Connect to Mac, use Safari Web Inspector
   - Android: Use Chrome DevTools via USB debugging
2. Check for JavaScript errors
3. Verify query execution

### Check Component Loading

```javascript
// Add to note to verify components loaded
console.log('Mobile Components:', window.MobileCoffeeComponents);
console.log('Gestures:', window.CoffeeGestures);
console.log('Viewport:', window.innerWidth + 'x' + window.innerHeight);
```

### Test Touch Events

```javascript
// Verify touch is working
document.addEventListener('touchstart', (e) => {
  console.log('Touch at:', e.touches[0].clientX, e.touches[0].clientY);
});
```

### Monitor Performance

```javascript
// Check query performance
console.time('query');
// Run Dataview query here
console.timeEnd('query');
// Should be <1000ms
```

---

## When to Reinstall

Consider reinstalling Obsidian mobile if:
- Multiple issues persist after troubleshooting
- App crashes frequently
- Data corruption suspected
- Major version update available
- Clean start needed

**Reinstall Process**:
1. Ensure vault is fully synced to cloud
2. Export any unsaved local changes
3. Take screenshots of settings
4. Delete Obsidian app
5. Reinstall from App Store/Play Store
6. Sign in and re-sync vault
7. Reconfigure settings
8. Re-enable plugins and CSS

---

## Getting Additional Help

### Before Asking for Help

Gather this information:
- Device model and OS version
- Obsidian mobile version
- Active plugins list
- Steps to reproduce issue
- Screenshots of problem
- Console error messages (if any)

### Where to Get Help

**Obsidian Forum**:
- forum.obsidian.md
- #mobile category
- Search before posting

**Obsidian Discord**:
- discord.gg/obsidian
- #mobile channel
- Real-time help

**Coffee Vault Specific**:
- Check [[Mobile-Guide|Mobile Guide]]
- Review [[Documentation/Mobile-Offline-Guide|Offline Guide]]
- Consult [[Configuration/Property Schema|Property Schema]]

### Reporting Bugs

When reporting bugs:
1. Use clear, descriptive title
2. List steps to reproduce
3. Include expected vs actual behavior
4. Attach screenshots
5. Share relevant console errors
6. Mention Coffee Vault version

---

## Preventive Maintenance

### Weekly

- [ ] Sync vault fully
- [ ] Check for app updates
- [ ] Review battery usage
- [ ] Clear app cache if slow

### Monthly

- [ ] Archive old logs (>6 months)
- [ ] Compress large images
- [ ] Review and disable unused plugins
- [ ] Check vault size (<50MB ideal)
- [ ] Update mobile CSS if available

### Quarterly

- [ ] Export vault backup
- [ ] Review sync settings
- [ ] Update all plugins
- [ ] Clean up unused attachments
- [ ] Optimize queries for performance

---

## Quick Reference: Error Messages

| Error Message | Likely Cause | Quick Fix |
|---------------|--------------|-----------|
| "Template not found" | Wrong template path | Check Settings > Templater > Template folder |
| "Query failed" | Dataview not enabled | Enable Dataview plugin |
| "No results" | Empty folder or wrong path | Verify folder name and path |
| "Sync conflict" | Simultaneous edits | Open conflict file, merge, delete |
| "Permission denied" | Storage access | Grant storage permission in OS settings |
| "JavaScript error" | Syntax error in code | Check console, fix syntax |
| "File not found" | Wrong attachment path | Use correct path: `![[image.jpg]]` |
| "Out of memory" | Vault too large | Archive old content, reduce size |

---

## Still Having Issues?

If you've tried everything in this guide and still experiencing problems:

1. **Start Fresh**: Create test vault with Mobile Quick Capture only
2. **Test Incrementally**: Add one feature at a time
3. **Isolate Problem**: Disable all plugins, re-enable one by one
4. **Check Basics**: Verify device has enough storage, is up to date
5. **Seek Help**: Post in Obsidian forum with detailed information

Remember: Most mobile issues are caused by:
- Missing or misconfigured plugins (60%)
- Sync settings (20%)
- Vault size/performance (15%)
- Device-specific issues (5%)

---

**Happy troubleshooting!**

← Back to [[Mobile-Guide|Mobile Guide]]
