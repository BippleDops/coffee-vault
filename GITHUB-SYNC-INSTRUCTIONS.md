---
title: GitHub Sync Instructions
date: 2025-10-28
type: setup-guide
---

# 🔄 GitHub Sync Setup Instructions

**Repository Created**: https://github.com/BippleDops/coffee-vault  
**Status**: Local commit ready, authentication needed for push

---

## ✅ **Quick Setup (Personal Access Token)**

### Step 1: Create GitHub Personal Access Token

1. Go to **https://github.com/settings/tokens**
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. **Note**: "Coffee Vault Sync"
4. **Expiration**: 90 days (or "No expiration" for permanent)
5. **Scopes**: Check these boxes:
   - ✅ `repo` (all repo permissions)
6. Click **"Generate token"** at bottom
7. **COPY THE TOKEN** (you'll only see it once!)

### Step 2: Push Using Token

Run this command (replace YOUR_TOKEN with the token you copied):

```bash
cd "/Users/jonsussmanstudio/Desktop/Coffee Vault"

# Push using token (replace YOUR_TOKEN)
git push https://YOUR_TOKEN@github.com/BippleDops/coffee-vault.git main
```

**That's it!** Your Coffee Vault will be on GitHub.

---

## 🔄 **For Future Updates**

After initial push, set up credential helper:

```bash
# Store credentials (Mac)
git config --global credential.helper osxkeychain

# Then just use regular push
git push origin main
```

---

## 📝 **Quick Reference**

**Your Repository**: https://github.com/BippleDops/coffee-vault

**Common Git Commands**:
```bash
# Check status
git status

# Add new/changed files
git add .

# Commit changes
git commit -m "Update: description of changes"

# Push to GitHub
git push origin main

# Pull updates (if editing on multiple devices)
git pull origin main
```

---

## ⚡ **Even Easier: GitHub Desktop**

Alternatively, install **GitHub Desktop** (https://desktop.github.com):
1. Download and install GitHub Desktop
2. Sign in with GitHub account
3. **Add Existing Repository** → Select Coffee Vault folder
4. Click **"Publish repository"**
5. Done! GUI for all git operations

---

## 🎯 **What's in the Repository**

Your initial commit includes:
- ✅ **713 files** (230,040 lines)
- ✅ **100 bean variety profiles**
- ✅ **65 origin country profiles**
- ✅ **51 brewing method guides**
- ✅ **156 scientific references**
- ✅ **70 roaster profiles**
- ✅ **21 interactive visualizations**
- ✅ **Complete templates, examples, documentation**
- ✅ **540,000+ words of coffee knowledge**

**Everything is ready - just need authentication to push!**

---

**Repository**: https://github.com/BippleDops/coffee-vault  
**Local Status**: ✅ Committed and ready to push  
**Next**: Authenticate and push (follow steps above)

