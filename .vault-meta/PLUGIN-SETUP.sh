#!/bin/bash
# Coffee Vault - Plugin Setup Script
# This script helps verify and set up Obsidian plugins

echo "☕ Coffee Vault Plugin Setup"
echo "=============================="
echo ""

echo "Plugin Installation Status:"
echo "=========================="

# Check for Datacore
if [ -d ".obsidian/plugins/datacore" ]; then
    echo "✓ Datacore installed"
else
    echo "✗ Datacore not installed"
    echo "  Install from: Settings → Community Plugins → Browse → 'Datacore'"
fi

# Check for Templater
if [ -d ".obsidian/plugins/templater-obsidian" ]; then
    echo "✓ Templater installed"
else
    echo "✗ Templater not installed"
    echo "  Install from: Settings → Community Plugins → Browse → 'Templater'"
fi

# Check for Calendar
if [ -d ".obsidian/plugins/calendar" ]; then
    echo "✓ Calendar installed"
else
    echo "✗ Calendar not installed (optional)"
fi

echo ""
echo "Next Steps:"
echo "==========="
echo "1. Open Obsidian"
echo "2. Open this vault"
echo "3. Follow the guide: PLUGIN-INSTALLATION-GUIDE.md"
