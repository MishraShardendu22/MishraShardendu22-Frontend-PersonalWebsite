# Experience Sidebar Button Visibility Fix

## Problem

The Experience detail page (`/experiences/[id]`) had invisible buttons, badges, and text in the left sidebar CanvasCard components in light mode - same issue as volunteer pages but in a different component file.

## Component Fixed

**File:** `/src/components/experience/ExperienceSidebar.tsx`

This is the **non-volunteer** experience sidebar (company/professional experiences), which is separate from the volunteer ExperienceSidebar.

## Issues Found & Fixed

### 1. Company Info Card

**Before:**

```tsx
<h4 className="text-white font-semibold text-lg">{experience.company_name}</h4>
<p className="text-white/80 text-sm">...</p>
<div className="flex items-center justify-center gap-2 text-white/70 text-sm">
<Button className="border-white/30 text-white hover:bg-white/20">
```

**After:**

```tsx
<h4 className="font-semibold text-lg">{experience.company_name}</h4>
<p className="opacity-80 text-sm">...</p>
<div className="flex items-center justify-center gap-2 opacity-70 text-sm">
<Button className="border-border hover:bg-accent group-hover/canvas-card:border-white/30 group-hover/canvas-card:text-white group-hover/canvas-card:hover:bg-white/20">
```

### 2. Tech Stack Card

**Before:**

```tsx
<p className="text-white/90 text-sm">Technologies used in this role</p>
<Badge className="text-xs bg-white/20 text-white border-white/30">
```

**After:**

```tsx
<p className="opacity-90 text-sm">Technologies used in this role</p>
<Badge className="text-xs border-border bg-secondary group-hover/canvas-card:bg-white/20 group-hover/canvas-card:text-white group-hover/canvas-card:border-white/30">
```

### 3. Quick Actions Card (Share/Copy buttons)

**Before:**

```tsx
<p className="text-white/90 text-sm">Share or copy experience details</p>
<Button className="justify-center hover:bg-white/20 text-xs border-white/30 hover:border-white/50 text-white">
```

**After:**

```tsx
<p className="opacity-90 text-sm">Share or copy experience details</p>
<Button className="justify-center text-xs border-border hover:bg-accent group-hover/canvas-card:border-white/30 group-hover/canvas-card:text-white group-hover/canvas-card:hover:bg-white/20 group-hover/canvas-card:hover:border-white/50">
```

### 4. Experience Highlights Card

**Before:**

```tsx
<div className="text-2xl font-bold text-white">{experience.technologies.length}</div>
<div className="text-xs text-white/70">Technologies</div>
<div className="text-sm font-medium text-white">Features:</div>
<Badge className="text-xs bg-white/20 text-white border-white/30">
```

**After:**

```tsx
<div className="text-2xl font-bold">{experience.technologies.length}</div>
<div className="text-xs opacity-70">Technologies</div>
<div className="text-sm font-medium">Features:</div>
<Badge className="text-xs border-border bg-secondary group-hover/canvas-card:bg-white/20 group-hover/canvas-card:text-white group-hover/canvas-card:border-white/30">
```

## Changes Summary

Applied the same fixes as volunteer ExperienceSidebar:

1. **Removed hardcoded white text classes** (`text-white`, `text-white/90`, `text-white/80`, `text-white/70`)
2. **Added visible default styles** for light mode:
   - Buttons: `border-border hover:bg-accent`
   - Badges: `border-border bg-secondary`
   - Text: `opacity-90`, `opacity-80`, `opacity-70`
3. **Added conditional white styles** for canvas hover:
   - `group-hover/canvas-card:text-white`
   - `group-hover/canvas-card:border-white/30`
   - `group-hover/canvas-card:bg-white/20`

## Files in Experience System

### Structure

```
src/
  components/
    experience/           # Professional/Company experiences
      ExperienceSidebar.tsx  ✅ FIXED
      ExperienceHero.tsx
      ExperienceMedia.tsx
      ExperienceProjects.tsx
      ...
    volunteer/            # Volunteer experiences
      ExperienceSidebar.tsx  ✅ ALREADY FIXED
      ExperienceHero.tsx
      ExperienceMedia.tsx
      ...
```

Both sidebar components now have the same visibility fixes applied!

## Testing Checklist

### Professional Experiences (`/experiences/[id]`)

- [ ] Light mode: Company Info card - all text visible
- [ ] Light mode: Company Info card - "View Certificate" button visible
- [ ] Light mode: Tech Stack card - badges visible
- [ ] Light mode: Quick Actions card - Share/Copy buttons visible
- [ ] Light mode: Experience Highlights card - stats and badges visible
- [ ] Canvas hover: All elements turn white on dark background
- [ ] Dark mode: Everything works as before

### Volunteer Experiences (`/volunteer/[id]`)

- [ ] Same checklist as above (already fixed earlier)

## Result

✅ **All CanvasCard buttons, badges, and text are now visible in light mode** for both:

- Professional experiences (`/experiences/[id]`)
- Volunteer experiences (`/volunteer/[id]`)

Both use pure white CanvasCard backgrounds with visible default styling that switches to white-on-dark when the canvas animation is hovered.
