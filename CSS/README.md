---
type: documentation
version: 6.0.0
tags: [css, design-system, documentation, styling, obsidian]
created: 2025-11-06
---

# Coffee Vault Design System Documentation

**Version**: 6.0.0
**Status**: Production Ready
**Last Updated**: 2025-11-06

## Overview

The Coffee Vault Design System is a comprehensive CSS framework implementing evidence-based UX principles from the [UX Research Summary](/UX/UX-RESEARCH-SUMMARY.md). It provides a complete design language for building beautiful, accessible, and consistent coffee tracking interfaces in Obsidian.

### Design Philosophy

1. **Accessibility First** - WCAG 2.1 AA compliance, 4.5:1 contrast ratios, keyboard navigation
2. **Mobile-First** - Responsive design starting from mobile (320px) to desktop (1920px+)
3. **Progressive Enhancement** - Core functionality works everywhere, enhancements layer on
4. **Performance** - Optimized for 60 FPS animations and fast page loads
5. **Coffee-Themed** - Warm browns, earthy tones, and coffee-inspired aesthetics

---

## Table of Contents

1. [Installation](#installation)
2. [Quick Start](#quick-start)
3. [Design Tokens](#design-tokens)
4. [Components](#components)
5. [Utilities](#utilities)
6. [Animations](#animations)
7. [Responsive Design](#responsive-design)
8. [Accessibility](#accessibility)
9. [Customization](#customization)
10. [Troubleshooting](#troubleshooting)
11. [Examples](#examples)

---

## Installation

### Step 1: Copy Files to Obsidian

Copy the following CSS files to your Obsidian vault's snippets folder:

```
.obsidian/snippets/
├── coffee-vault-design-system-v6.css
├── coffee-vault-animations.css
└── coffee-vault-utilities.css
```

**Folder Location**: `.obsidian/snippets/` (inside your vault root)

### Step 2: Enable CSS Snippets

1. Open Obsidian Settings (`Cmd/Ctrl + ,`)
2. Navigate to **Appearance** → **CSS snippets**
3. Click the refresh icon to detect new snippets
4. Enable the three Coffee Vault snippets:
   - ✅ `coffee-vault-design-system-v6`
   - ✅ `coffee-vault-animations`
   - ✅ `coffee-vault-utilities`

### Step 3: Verify Installation

Create a test note with this HTML:

```html
<div class="cv-card">
  <div class="cv-card-header">
    <h3 class="cv-card-title">Test Card</h3>
  </div>
  <div class="cv-card-body">
    <p>If you see a styled card with shadows and coffee-themed colors, the design system is working!</p>
  </div>
  <div class="cv-card-footer">
    <button class="cv-btn cv-btn-primary">Success!</button>
  </div>
</div>
```

**Expected Result**: A styled card with coffee brown colors, shadows, and a hover effect.

---

## Quick Start

### Basic HTML Structure

```html
<!-- Container for centered content -->
<div class="cv-container">

  <!-- Dashboard Header -->
  <div class="cv-dashboard-header">
    <h1 class="cv-dashboard-title">My Coffee Dashboard</h1>
    <p class="cv-dashboard-description">Track your brewing journey</p>
  </div>

  <!-- Card Grid -->
  <div class="cv-dashboard-grid">

    <!-- Card 1 -->
    <div class="cv-card">
      <div class="cv-card-header">
        <h3 class="cv-card-title">Recent Brews</h3>
      </div>
      <div class="cv-card-body">
        <p>Your last 5 coffee logs...</p>
      </div>
    </div>

    <!-- Card 2 -->
    <div class="cv-card">
      <div class="cv-card-header">
        <h3 class="cv-card-title">Statistics</h3>
      </div>
      <div class="cv-card-body">
        <div class="stat-tile">
          <div class="stat-value">127</div>
          <div class="stat-label">Total Brews</div>
        </div>
      </div>
    </div>

  </div>

</div>
```

### Using Utility Classes

```html
<!-- Flexbox layout with spacing -->
<div class="cv-flex cv-items-center cv-justify-between cv-gap-4 cv-mb-6">
  <h2 class="cv-text-xl cv-font-bold cv-text-primary cv-m-0">Section Title</h2>
  <button class="cv-btn cv-btn-accent">Add New</button>
</div>

<!-- Responsive grid -->
<div class="cv-grid cv-grid-cols-1 md:cv-grid-cols-2 lg:cv-grid-cols-3 cv-gap-6">
  <div class="cv-card">Card 1</div>
  <div class="cv-card">Card 2</div>
  <div class="cv-card">Card 3</div>
</div>
```

---

## Design Tokens

Design tokens are CSS custom properties (variables) that define the visual language.

### Color Palette

```css
/* Primary Coffee Colors */
--cv-primary: #5D4037;              /* Coffee brown */
--cv-primary-light: #8D6E63;        /* Light brown */
--cv-primary-dark: #3E2723;         /* Dark brown */

/* Accent Colors */
--cv-accent: #FF6F00;               /* Orange */
--cv-accent-light: #FFA726;
--cv-accent-dark: #E65100;

/* Semantic Colors */
--cv-success: #4CAF50;              /* Green */
--cv-warning: #FFC107;              /* Yellow */
--cv-error: #F44336;                /* Red */
--cv-info: #2196F3;                 /* Blue */

/* Neutrals */
--cv-text-primary: #212121;         /* 15.8:1 contrast */
--cv-text-secondary: #757575;       /* 4.6:1 contrast */
--cv-bg: #FAFAFA;
--cv-surface: #FFFFFF;
--cv-divider: #E0E0E0;
```

### Typography Scale

Based on **Major Third (1.250)** modular scale:

```css
--cv-text-xs: 0.75rem;              /* 12px */
--cv-text-sm: 0.875rem;             /* 14px */
--cv-text-base: 1rem;               /* 16px - default */
--cv-text-lg: 1.25rem;              /* 20px */
--cv-text-xl: 1.5rem;               /* 24px */
--cv-text-2xl: 2rem;                /* 32px */
--cv-text-3xl: 2.5rem;              /* 40px */
```

### Spacing Scale

Based on **8px grid system**:

```css
--cv-space-1: 0.25rem;              /* 4px */
--cv-space-2: 0.5rem;               /* 8px - base unit */
--cv-space-3: 0.75rem;              /* 12px */
--cv-space-4: 1rem;                 /* 16px */
--cv-space-5: 1.5rem;               /* 24px */
--cv-space-6: 2rem;                 /* 32px */
--cv-space-8: 3rem;                 /* 48px */
--cv-space-10: 4rem;                /* 64px */
```

### Customizing Tokens

Override tokens in your own CSS snippet:

```css
/* custom-theme.css */
:root {
  /* Change primary color to a darker brown */
  --cv-primary: #3E2723;

  /* Increase spacing */
  --cv-space-4: 1.25rem;

  /* Larger text */
  --cv-text-base: 18px;
}
```

---

## Components

### Buttons

```html
<!-- Primary button -->
<button class="cv-btn cv-btn-primary">Primary Action</button>

<!-- Secondary button (outline) -->
<button class="cv-btn cv-btn-secondary">Secondary</button>

<!-- Accent button -->
<button class="cv-btn cv-btn-accent">Accent CTA</button>

<!-- Button sizes -->
<button class="cv-btn cv-btn-primary cv-btn-sm">Small</button>
<button class="cv-btn cv-btn-primary">Default</button>
<button class="cv-btn cv-btn-primary cv-btn-lg">Large</button>

<!-- Full-width button -->
<button class="cv-btn cv-btn-primary cv-btn-block">Full Width</button>
```

**Features**:
- 44x44px minimum touch target (Fitts's Law)
- Hover elevation animation (2px translateY)
- Ripple effect on click
- Focus state with 2px outline

### Cards

```html
<div class="cv-card">
  <!-- Header (optional) -->
  <div class="cv-card-header">
    <div>
      <h3 class="cv-card-title">Card Title</h3>
      <p class="cv-card-subtitle">Subtitle text</p>
    </div>
  </div>

  <!-- Body -->
  <div class="cv-card-body">
    <p>Main content goes here...</p>
  </div>

  <!-- Footer (optional) -->
  <div class="cv-card-footer">
    <button class="cv-btn cv-btn-secondary">Cancel</button>
    <button class="cv-btn cv-btn-primary">Save</button>
  </div>
</div>

<!-- Glass card variant -->
<div class="cv-card cv-card-glass">
  <p>Glassmorphism effect with backdrop blur</p>
</div>
```

**Features**:
- Shadow elevation on hover
- 12px border radius
- Responsive padding (mobile: 16px, desktop: 24px)

### Dashboard Layouts

```html
<div class="home-dashboard">
  <!-- Hero Section -->
  <div class="home-hero">
    <h1 class="home-hero-title">Welcome to Coffee Vault</h1>
    <p class="home-hero-subtitle">Your personal coffee tracking system</p>
  </div>

  <!-- Persona Selector -->
  <div class="persona-selector">
    <div class="cv-persona-card">
      <div class="cv-persona-card-icon">🌱</div>
      <h3 class="cv-persona-card-title">Novice Brewer</h3>
      <p class="cv-persona-card-description">0-20 brews</p>
    </div>
    <div class="cv-persona-card active">
      <div class="cv-persona-card-icon">☕</div>
      <h3 class="cv-persona-card-title">Enthusiast</h3>
      <p class="cv-persona-card-description">20-100 brews</p>
    </div>
  </div>

  <!-- Stats Grid -->
  <div class="stats-grid">
    <div class="stat-tile">
      <div class="stat-value">127</div>
      <div class="stat-label">Total Brews</div>
    </div>
    <div class="stat-tile">
      <div class="stat-value">4.2</div>
      <div class="stat-label">Avg Rating</div>
    </div>
  </div>
</div>
```

### Callouts (Coffee-themed)

```markdown
> [!coffee] Coffee Tip
> Always preheat your brewing equipment for consistent temperature.

> [!brew] Brewing Note
> This method works best with medium roast beans.

> [!science] Scientific Insight
> Water temperature affects extraction rates exponentially.
```

**Features**:
- Color-coded borders (coffee: brown, brew: orange, science: blue)
- Automatic icon rendering
- 4px left border accent

---

## Utilities

### Spacing

```html
<!-- Margin -->
<div class="cv-mt-4">Margin top 16px</div>
<div class="cv-mb-6">Margin bottom 32px</div>
<div class="cv-mx-auto">Centered horizontally</div>

<!-- Padding -->
<div class="cv-p-4">Padding 16px all sides</div>
<div class="cv-px-6 cv-py-4">Padding 32px horizontal, 16px vertical</div>
```

### Flexbox

```html
<!-- Horizontal layout -->
<div class="cv-flex cv-items-center cv-gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Space between -->
<div class="cv-flex cv-justify-between">
  <div>Left</div>
  <div>Right</div>
</div>

<!-- Vertical layout -->
<div class="cv-flex cv-flex-col cv-gap-3">
  <div>Top</div>
  <div>Bottom</div>
</div>
```

### Grid

```html
<!-- Auto-fit grid -->
<div class="cv-grid cv-grid-cols-auto cv-gap-6">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>

<!-- Responsive grid -->
<div class="cv-grid cv-grid-cols-1 md:cv-grid-cols-2 lg:cv-grid-cols-3 cv-gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

### Text

```html
<!-- Size -->
<p class="cv-text-sm">Small text (14px)</p>
<p class="cv-text-base">Base text (16px)</p>
<p class="cv-text-xl">Large text (24px)</p>

<!-- Weight -->
<p class="cv-font-normal">Normal weight</p>
<p class="cv-font-semibold">Semibold</p>
<p class="cv-font-bold">Bold</p>

<!-- Color -->
<p class="cv-text-primary">Primary text</p>
<p class="cv-text-secondary">Secondary text</p>
<p class="cv-text-accent">Accent color</p>

<!-- Alignment -->
<p class="cv-text-left">Left aligned</p>
<p class="cv-text-center">Center aligned</p>
<p class="cv-text-right">Right aligned</p>
```

### Responsive Utilities

```html
<!-- Hide on mobile, show on tablet+ -->
<div class="cv-hidden md:cv-block">Desktop content</div>

<!-- Show on mobile only -->
<div class="mobile:cv-block md:cv-hidden">Mobile content</div>

<!-- Responsive grid -->
<div class="cv-grid-cols-1 md:cv-grid-cols-2 lg:cv-grid-cols-4">...</div>
```

---

## Animations

### Fade In

```html
<div class="cv-card cv-animate-fade-in">
  Fades in smoothly
</div>
```

### Slide In

```html
<div class="cv-animate-slide-in-up">Slides in from bottom</div>
<div class="cv-animate-slide-in-down">Slides in from top</div>
<div class="cv-animate-slide-in-left">Slides in from left</div>
<div class="cv-animate-slide-in-right">Slides in from right</div>
```

### Staggered Entrance

```html
<div class="cv-dashboard-grid">
  <div class="cv-card cv-card-enter">Card 1 (0ms delay)</div>
  <div class="cv-card cv-card-enter">Card 2 (100ms delay)</div>
  <div class="cv-card cv-card-enter">Card 3 (200ms delay)</div>
</div>
```

### Loading Spinners

```html
<!-- Coffee bean spinner -->
<div class="cv-loading-coffee"></div>

<!-- Circular spinner -->
<div class="cv-loading-spinner"></div>

<!-- Dots loader -->
<div class="cv-loading-dots">
  <span></span>
  <span></span>
  <span></span>
</div>
```

### Progress Bars

```html
<div class="cv-progress-bar">
  <div class="cv-progress-fill" style="width: 75%;"></div>
</div>

<!-- Indeterminate progress -->
<div class="cv-progress-bar cv-progress-indeterminate"></div>
```

### Hover Effects

```html
<div class="cv-card cv-hover-lift">Lifts on hover</div>
<div class="cv-hover-glow">Glows on hover</div>
<div class="cv-hover-scale">Scales on hover</div>
<a href="#" class="cv-hover-underline">Underline on hover</a>
```

---

## Responsive Design

### Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| Mobile | < 768px | Base styles (mobile-first) |
| Tablet | 768px - 1024px | 2-column layouts |
| Desktop | > 1024px | 3-4 column layouts |

### Mobile-First Approach

```css
/* Base styles apply to mobile */
.element {
  font-size: 14px;
  padding: 8px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .element {
    font-size: 16px;
    padding: 12px;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .element {
    font-size: 18px;
    padding: 16px;
  }
}
```

### Touch Target Optimization

All interactive elements meet **44x44px minimum** (iOS HIG, Material Design):

- Buttons: 44px height
- Links: 44px tap area
- Form inputs: 48px height
- Rating stars: 48px tap area

### Responsive Grids

```html
<!-- 1 column mobile, 2 tablet, 3 desktop -->
<div class="cv-grid cv-grid-cols-1 md:cv-grid-cols-2 lg:cv-grid-cols-3 cv-gap-6">
  <div>Item</div>
</div>

<!-- Auto-fit responsive -->
<div class="cv-dashboard-grid">
  <!-- Automatically adjusts columns based on screen width -->
</div>
```

---

## Accessibility

### WCAG 2.1 AA Compliance

✅ **Color Contrast**:
- Primary text: 15.8:1 (exceeds 4.5:1 requirement)
- Secondary text: 4.6:1 (meets requirement)
- All interactive elements: ≥4.5:1

✅ **Keyboard Navigation**:
- Focus states: 2px solid accent outline
- Tab order: logical flow
- Skip links: available for screen readers

✅ **Screen Reader Support**:
- Semantic HTML encouraged
- ARIA labels where needed
- Alt text for images

### Focus States

```css
/* All interactive elements have visible focus */
*:focus-visible {
  outline: 2px solid var(--cv-accent);
  outline-offset: 2px;
}
```

### Skip Links

```html
<a href="#main-content" class="cv-skip-link">Skip to main content</a>
```

### Screen Reader Only Content

```html
<span class="cv-sr-only">Hidden from visual users, read by screen readers</span>
```

### Reduced Motion

Users who prefer reduced motion will see:
- No animations (duration: 0.01ms)
- No transitions
- No hover transforms

```css
@media (prefers-reduced-motion: reduce) {
  /* All animations disabled */
}
```

---

## Customization

### Method 1: Override CSS Variables

Create a custom snippet (`.obsidian/snippets/custom-theme.css`):

```css
:root {
  /* Change primary color */
  --cv-primary: #4E342E;

  /* Adjust spacing */
  --cv-space-4: 20px;

  /* Larger text */
  --cv-text-base: 18px;

  /* Different accent */
  --cv-accent: #D84315;
}
```

### Method 2: Add Custom Classes

```css
/* custom-components.css */

/* Custom button variant */
.cv-btn-success {
  background-color: var(--cv-success);
  color: white;
}

/* Custom card variant */
.cv-card-highlight {
  border: 2px solid var(--cv-accent);
  background: linear-gradient(135deg, #FFF8E1, #FFFFFF);
}
```

### Method 3: Extend Components

```css
/* Extend existing card */
.cv-card.coffee-log {
  border-left: 4px solid var(--cv-accent);
}

.cv-card.coffee-log .cv-card-title::before {
  content: '☕ ';
}
```

---

## Troubleshooting

### Issue: CSS Not Loading

**Solution**:
1. Check file location: `.obsidian/snippets/`
2. Refresh CSS snippets: Settings → Appearance → CSS snippets → Refresh
3. Enable snippets: Toggle on all three Coffee Vault snippets
4. Restart Obsidian

### Issue: Styles Not Applying

**Solution**:
1. Verify class names (check for typos: `cv-btn` not `cv-button`)
2. Check specificity (custom theme might be overriding)
3. Inspect element in DevTools (`Cmd/Ctrl + Shift + I`)

### Issue: Colors Look Different in Dark Mode

**Expected**: Design system automatically adjusts colors for dark mode.

**Verify**: Check if `.theme-dark` overrides are loading:

```css
.theme-dark {
  --cv-primary: #8D6E63; /* Lighter in dark mode */
}
```

### Issue: Animations Not Working

**Check**:
1. Is `coffee-vault-animations.css` enabled?
2. Does user have "Reduce motion" enabled? (Animations disabled for accessibility)
3. Verify class names: `cv-animate-fade-in` not `fade-in`

### Issue: Responsive Layout Breaking

**Solutions**:
- Use `cv-dashboard-grid` instead of manual grids
- Add `cv-container` wrapper for max-width constraint
- Test breakpoints: resize browser to < 768px, 768-1024px, > 1024px

---

## Examples

### Example 1: Coffee Log Card

```html
<div class="cv-card cv-animate-slide-in-up">
  <div class="cv-card-header">
    <div>
      <h3 class="cv-card-title">Ethiopian Yirgacheffe</h3>
      <p class="cv-card-subtitle">V60 Pour Over • 2025-11-06</p>
    </div>
    <div class="cv-text-2xl">⭐⭐⭐⭐⭐</div>
  </div>

  <div class="cv-card-body">
    <div class="cv-flex cv-gap-2 cv-mb-3">
      <span class="cv-text-sm cv-text-secondary">Roast:</span>
      <span class="cv-text-sm cv-font-medium">Light</span>
    </div>
    <p class="cv-text-sm cv-text-secondary">
      Bright acidity, floral notes, hint of blueberry.
      Perfect brew this morning!
    </p>
  </div>

  <div class="cv-card-footer">
    <button class="cv-btn cv-btn-secondary cv-btn-sm">View Details</button>
    <button class="cv-btn cv-btn-accent cv-btn-sm">Brew Again</button>
  </div>
</div>
```

### Example 2: Stats Dashboard

```html
<div class="home-dashboard">
  <div class="cv-dashboard-header">
    <h1 class="cv-dashboard-title">My Coffee Stats</h1>
    <p class="cv-dashboard-description">Your brewing journey at a glance</p>
  </div>

  <div class="stats-grid">
    <div class="stat-tile cv-animate-fade-in">
      <div class="stat-value">127</div>
      <div class="stat-label">Total Brews</div>
    </div>
    <div class="stat-tile cv-animate-fade-in cv-animate-delay-100">
      <div class="stat-value">4.2</div>
      <div class="stat-label">Avg Rating</div>
    </div>
    <div class="stat-tile cv-animate-fade-in cv-animate-delay-200">
      <div class="stat-value">18</div>
      <div class="stat-label">Unique Beans</div>
    </div>
    <div class="stat-tile cv-animate-fade-in cv-animate-delay-300">
      <div class="stat-value">$247</div>
      <div class="stat-label">Total Spent</div>
    </div>
  </div>
</div>
```

### Example 3: Persona Selector

```html
<div class="persona-selector">
  <div class="cv-persona-card cv-hover-lift">
    <div class="cv-persona-card-icon">🌱</div>
    <h3 class="cv-persona-card-title">Novice Brewer</h3>
    <p class="cv-persona-card-description">
      Just starting your specialty coffee journey
    </p>
  </div>

  <div class="cv-persona-card cv-hover-lift active">
    <div class="cv-persona-card-icon">☕</div>
    <h3 class="cv-persona-card-title">Enthusiast</h3>
    <p class="cv-persona-card-description">
      Exploring different methods and origins
    </p>
  </div>

  <div class="cv-persona-card cv-hover-lift">
    <div class="cv-persona-card-icon">🎓</div>
    <h3 class="cv-persona-card-title">Professional</h3>
    <p class="cv-persona-card-description">
      Advanced cupping and sensory analysis
    </p>
  </div>
</div>
```

### Example 4: Loading State

```html
<div class="cv-card">
  <div class="cv-card-body cv-flex cv-flex-col cv-items-center cv-gap-4">
    <div class="cv-loading-coffee"></div>
    <p class="cv-text-secondary">Brewing your dashboard...</p>
  </div>
</div>
```

---

## Best Practices

### 1. Use Semantic HTML

```html
<!-- Good -->
<article class="cv-card">
  <header class="cv-card-header">
    <h2 class="cv-card-title">Title</h2>
  </header>
  <main class="cv-card-body">...</main>
</article>

<!-- Avoid -->
<div class="cv-card">
  <div class="cv-card-header">
    <div class="cv-card-title">Title</div>
  </div>
</div>
```

### 2. Combine Utilities Wisely

```html
<!-- Good: Readable grouping -->
<div class="cv-flex cv-items-center cv-gap-4
            cv-p-6 cv-mb-4
            cv-bg-surface cv-rounded-lg cv-shadow-md">
  Content
</div>

<!-- Avoid: Too many utilities, use component class -->
<div class="cv-card cv-flex cv-items-center cv-gap-4">
  Content
</div>
```

### 3. Respect Mobile-First

```css
/* Good */
.element {
  padding: 16px; /* Mobile default */
}
@media (min-width: 768px) {
  .element { padding: 24px; }
}

/* Avoid */
.element {
  padding: 24px; /* Desktop first */
}
@media (max-width: 767px) {
  .element { padding: 16px; }
}
```

### 4. Use Design Tokens

```css
/* Good */
.custom-element {
  color: var(--cv-primary);
  padding: var(--cv-space-4);
}

/* Avoid */
.custom-element {
  color: #5D4037; /* Hard-coded */
  padding: 16px;
}
```

---

## Performance Tips

1. **Lazy Load Animations**: Use `cv-animate-*` only on visible elements
2. **Limit Shadow Complexity**: Stick to `cv-shadow-sm/md/lg` (pre-optimized)
3. **Use `will-change` Sparingly**: Already applied to animated components
4. **Prefer Transforms**: Use `translateY()` instead of `top/bottom` for animations

---

## Resources

- **UX Research Summary**: `/UX/UX-RESEARCH-SUMMARY.md`
- **Design Principles**: Jakob's Law, Fitts's Law, Hick's Law
- **Accessibility Standards**: WCAG 2.1 AA
- **Browser Support**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)

---

## Version History

### v6.0.0 (2025-11-06)
- 🎨 Complete design system overhaul
- ✅ WCAG 2.1 AA compliance
- 📱 Mobile-first responsive design
- 🎭 Animation library
- 🧩 Comprehensive component library
- 🛠️ Utility class system

---

## Support

For issues, questions, or feature requests:
1. Check this documentation
2. Review `/UX/UX-RESEARCH-SUMMARY.md`
3. Inspect elements with browser DevTools
4. Search existing GitHub issues (if applicable)

---

**Made with ☕ by the Coffee Vault Team**
**Version 6.0.0** | **2025-11-06**
