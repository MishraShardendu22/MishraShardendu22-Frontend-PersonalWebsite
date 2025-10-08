# Media & Projects Section Button Visibility Fix

## Problem

Buttons in the certification page's **MediaSection** (YouTube videos/iframes) and **ProjectsSection** were invisible in light mode because they had hardcoded white colors that don't show on white CanvasCard backgrounds.

## Components Fixed

### 1. MediaSection Component

**File:** `/src/components/certificate/MediaSection.tsx`

**Issues Found:**

- "View Full" button had `border-white/30 text-white hover:bg-white/20`
- "Copy" button had same white styling
- Link wrapper had `text-white/90 hover:text-white`
- Description text had `text-white/70`

**Fixed:**

```tsx
// Buttons - Before
className = 'border-white/30 text-white hover:bg-white/20 text-xs'

// Buttons - After
className =
  'text-xs border-border hover:bg-accent group-hover/canvas-card:border-white/30 group-hover/canvas-card:text-white group-hover/canvas-card:hover:bg-white/20'

// Link wrapper - Before
className = 'text-white/90 hover:text-white transition-colors'

// Link wrapper - After
className =
  'group-hover/canvas-card:text-white/90 group-hover/canvas-card:hover:text-white transition-colors'

// Description - Before
className = 'text-white/70 text-xs'

// Description - After
className = 'opacity-70 text-xs group-hover/canvas-card:text-white/70'
```

### 2. ProjectsSection Component

**File:** `/src/components/certificate/ProjectsSection.tsx`

**Issues Found:**

- "Implementation" and "Featured" badges had `bg-white/20 text-white border-white/30`
- Description text had `text-white/80`
- "Explore Project" button had `border-white/30 text-white hover:bg-white/20`

**Fixed:**

```tsx
// Badges - Before
className = 'text-xs bg-white/20 text-white border-white/30'

// Badges - After
className =
  'text-xs border-border bg-secondary group-hover/canvas-card:bg-white/20 group-hover/canvas-card:text-white group-hover/canvas-card:border-white/30'

// Description - Before
className = 'text-white/80 text-sm'

// Description - After
className = 'opacity-80 text-sm group-hover/canvas-card:text-white/80'

// Button - Before
className = 'w-full border-white/30 text-white hover:bg-white/20'

// Button - After
className =
  'w-full border-border hover:bg-accent group-hover/canvas-card:border-white/30 group-hover/canvas-card:text-white group-hover/canvas-card:hover:bg-white/20'
```

## Visual Behavior

### MediaSection (YouTube Videos/iFrames)

**Light Mode - Not Hovered:**

- ✅ "View Full" button: Visible with `border-border` and standard text
- ✅ "Copy" button: Visible with `border-border` and standard text
- ✅ Description text: Dark text with opacity

**Light Mode - Hovered (Canvas Animation Showing):**

- ✅ Buttons: White borders and white text on dark canvas background
- ✅ Description: White text with opacity on dark canvas background

### ProjectsSection

**Light Mode - Not Hovered:**

- ✅ "Implementation" & "Featured" badges: Visible with `bg-secondary` and `border-border`
- ✅ Description: Dark text with opacity
- ✅ "Explore Project" button: Visible with `border-border`

**Light Mode - Hovered (Canvas Animation Showing):**

- ✅ Badges: White/transparent style on dark canvas background
- ✅ Description: White text with opacity
- ✅ Button: White border and text on dark canvas background

## Testing Checklist

- [ ] MediaSection: YouTube video cards show visible buttons in light mode
- [ ] MediaSection: "View Full" button is clickable and visible
- [ ] MediaSection: "Copy" button is clickable and visible
- [ ] MediaSection: Buttons turn white on canvas hover
- [ ] ProjectsSection: Project cards show visible badges in light mode
- [ ] ProjectsSection: "Explore Project" button is visible
- [ ] ProjectsSection: All elements turn white on canvas hover
- [ ] Dark mode: All elements remain visible in both states

## Summary

All buttons, badges, and text in MediaSection and ProjectsSection components now:

1. Have **visible default styling** for light mode (white background)
2. Use **theme-aware colors** (`border-border`, `bg-secondary`, `opacity-*`)
3. Switch to **white styling only on canvas hover** using `group-hover/canvas-card:`
4. Work correctly in both **light and dark modes**

The iframe content itself (YouTube player controls, embedded page buttons) is controlled by the embedded content and cannot be styled from our application.
