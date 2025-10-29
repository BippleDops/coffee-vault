# Excalidraw Integration for Coffee Vault

**Purpose**: Visual diagram templates for coffee brewing setups, equipment layouts, and technique documentation.

## Overview

This configuration provides a library of reusable Excalidraw components and templates specifically designed for the Coffee Vault. Create professional brewing diagrams, equipment layouts, and annotated technique guides.

## Installation Steps

1. **Install Excalidraw Plugin**
   - Open Obsidian Settings → Community Plugins
   - Browse and search for "Excalidraw"
   - Install and enable the plugin

2. **Configure Plugin Settings**
   - Go to Settings → Excalidraw
   - Set default folder: `Visualizations/`
   - Enable: "Auto-export SVG" for better integration
   - Enable: "Auto-export PNG" for mobile viewing
   - Set template folder: `Plugin Configurations/Excalidraw/`

3. **Import Templates**
   - Templates are ready to use in this folder
   - Access via Excalidraw → Insert Template menu
   - Or copy template files to your drawings

## Template Library

### Equipment Components

**File**: `Equipment-Components-Library.excalidraw.md`

Pre-drawn equipment components with standardized sizing and styling:
- Kettles (gooseneck, standard, electric)
- Grinders (hand grinder, burr grinder, blade grinder)
- Scales (basic, precision)
- Brewers (V60, Chemex, French press, AeroPress, espresso machine)
- Cups and vessels (various sizes)
- Accessories (timers, thermometers, spoons)

**Usage**: Copy components from this library into your diagrams.

### Brewing Setup Templates

#### Pour Over Setup Template
**File**: `Pour-Over-Setup-Template.excalidraw.md`

Complete pour-over station layout showing:
- Equipment placement (scale, dripper, kettle, server)
- Water flow direction
- Parameter annotation areas
- Timer placement

#### Espresso Station Template
**File**: `Espresso-Station-Template.excalidraw.md`

Espresso workflow diagram showing:
- Grinder → portafilter → machine → cup flow
- Pressure and temperature indicators
- Timing annotations
- Shot parameter boxes

#### French Press Template
**File**: `French-Press-Template.excalidraw.md`

Step-by-step French press process:
- Equipment layout
- Sequential steps with timing
- Water temperature zones
- Bloom and plunge phases

### Technique Annotation Templates

#### Recipe Card Template
**File**: `Recipe-Card-Template.excalidraw.md`

Visual recipe card with:
- Equipment diagram
- Parameter boxes (dose, temp, time, ratio)
- Step-by-step annotations
- Notes section

#### Troubleshooting Flowchart
**File**: `Troubleshooting-Flowchart-Template.excalidraw.md`

Decision tree template for:
- Problem identification
- Cause analysis
- Solution pathways
- Parameter adjustments

## Using Templates

### Method 1: Insert Template (Recommended)
1. Create new Excalidraw drawing
2. Click "Insert Template" in Excalidraw menu
3. Select desired template
4. Customize for your needs

### Method 2: Copy Template File
1. Duplicate template file in file explorer
2. Rename to your desired name
3. Open and edit

### Method 3: Copy Components
1. Open Equipment Components Library
2. Select components you need (Ctrl/Cmd + click)
3. Copy (Ctrl/Cmd + C)
4. Open your drawing
5. Paste (Ctrl/Cmd + V)

## Styling Standards

All templates follow consistent styling:

**Colors**:
- Coffee brown: `#8B4513` - Primary equipment
- Water blue: `#4A90E2` - Water and liquids
- Heat red: `#E74C3C` - Temperature indicators
- Time green: `#27AE60` - Timing elements
- Notes yellow: `#F39C12` - Annotation boxes
- Background: `#FFFFFF` - Clean white canvas

**Line Weights**:
- Equipment outlines: 2px
- Flow arrows: 3px
- Annotation lines: 1px
- Emphasis lines: 4px

**Text Sizes**:
- Title: 24pt, bold
- Headers: 18pt, bold
- Body: 14pt, regular
- Annotations: 12pt, regular

## Best Practices

### Creating Brewing Diagrams
1. Start with Equipment Components Library
2. Arrange components in logical flow (left to right)
3. Add arrows showing process flow
4. Annotate with parameters using text boxes
5. Include timing indicators
6. Add notes for key observations

### Documenting Techniques
1. Use Recipe Card Template as base
2. Add visual representations of each step
3. Annotate critical parameters
4. Include troubleshooting notes
5. Export as PNG for easy sharing

### Equipment Layout Planning
1. Draw to scale when possible
2. Include measurements
3. Show clearances and spacing
4. Label power requirements
5. Note workflow efficiency

## Integration with Coffee Vault

### Linking Diagrams to Notes
Embed diagrams in your notes using:
```markdown
![[Your-Diagram-Name.excalidraw]]
```

### Recommended Uses
- **Brewing Guides**: Illustrate technique steps
- **Coffee Logs**: Document unique setups
- **Equipment Notes**: Show station layouts
- **Bean Profiles**: Visualize recommended brewing methods
- **Troubleshooting**: Create decision trees

### Naming Conventions
- Brewing setups: `Setup-[Method]-[Date].excalidraw.md`
- Equipment layouts: `Layout-[Location]-[Date].excalidraw.md`
- Recipes: `Recipe-[Bean]-[Method].excalidraw.md`
- Techniques: `Technique-[Name].excalidraw.md`

## Tips and Tricks

### Quick Component Creation
- Group related components (Ctrl/Cmd + G)
- Save as custom library
- Reuse across drawings

### Mobile Viewing
- Always enable PNG auto-export
- PNG previews show on mobile
- Full editing requires desktop

### Collaboration
- Export SVG for sharing
- Include parameter annotations
- Use consistent styling
- Document assumptions

### Performance
- Keep drawings under 100 elements
- Use groups to organize
- Separate complex diagrams into multiple files
- Link related diagrams

## Troubleshooting

**Template not appearing**
- Verify Excalidraw plugin is enabled
- Check template folder path in settings
- Restart Obsidian

**Components look different**
- Check color settings in Excalidraw
- Verify font is available
- Reset to default theme

**Export not working**
- Enable auto-export in settings
- Check Visualizations folder exists
- Verify write permissions

**Slow performance**
- Reduce number of elements
- Simplify complex shapes
- Break into multiple drawings

## Advanced Techniques

### Creating Custom Component Libraries
1. Draw your custom components
2. Save as separate .excalidraw.md file
3. Add to library folder
4. Reference in your diagrams

### Animated Sequences
1. Create multiple versions of same diagram
2. Show progression through steps
3. Link in sequence in notes
4. Use for tutorials

### Data Visualization
1. Create custom charts
2. Annotate with Dataview results
3. Update periodically
4. Show trends over time

## Resources

- [Excalidraw Official Docs](https://docs.excalidraw.com/)
- [Obsidian Excalidraw Plugin Docs](https://github.com/zsviczian/obsidian-excalidraw-plugin)
- [Drawing Tips and Tricks](https://excalidraw.com/#tips)

## Support

For Coffee Vault specific questions:
- Check Documentation/Plugin-Setup-Guide.md
- Review Examples/ folder for inspiration
- Consult Brewing Guides for technique illustrations

---

**Version**: 1.0.0
**Last Updated**: 2025-10-25
**Maintained by**: Coffee Vault Plugin Integration Sub-Agent
