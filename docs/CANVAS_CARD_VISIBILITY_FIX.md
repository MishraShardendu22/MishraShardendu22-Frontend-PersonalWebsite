# CanvasCard Light Mode Visibility Fix

## Problem

CanvasCard components had text visibility issues in light mode:

- Text was hardcoded as `text-white` across all themes
- Buttons had explicit `text-white` classes
- In light mode, white text on light/transparent backgrounds was invisible
- User screenshot showed 4 sections completely invisible:
  - "Get Involved"
  - "Interested in This Project"
  - "Project Highlights"
  - "Explore All My Project And Work"

## Root Cause

The CanvasCard component design:

1. Has colored canvas reveal animation on hover (dark backgrounds)
2. Used `group-hover/canvas-card:text-white` for white text on hover
3. Children content had hardcoded `text-white` classes that overrode theme awareness
4. No contrast layer for light mode when canvas not showing

## Solution

### 1. Enhanced CanvasCard Components

Added gradient overlay to both CanvasCard components:

**`/src/components/certificate/canva.tsx`** and **`/src/components/projects/canva.tsx`**:

```tsx
// Dark gradient overlay - provides contrast in light mode
<div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20 dark:to-black/40 group-hover/canvas-card:opacity-0 transition-opacity duration-500 pointer-events-none z-10" />
```

**Features:**

- `from-transparent to-black/20` in light mode: subtle dark gradient for text contrast
- `dark:to-black/40` in dark mode: slightly stronger gradient
- `group-hover/canvas-card:opacity-0`: fades away on hover to reveal canvas animation
- `pointer-events-none`: doesn't interfere with interactions
- `z-10`: above canvas, below content

### 2. Updated Text Colors to Theme-Aware

Changed from:

```tsx
text-foreground group-hover/canvas-card:text-white
```

To:

```tsx
text-card-foreground dark:text-foreground group-hover/canvas-card:text-white
```

**Why:**

- `text-card-foreground`: Uses card text color (dark in light mode, light in dark mode)
- `dark:text-foreground`: Fallback for dark mode
- `group-hover/canvas-card:text-white`: White text when hovering (canvas shows dark background)

### 3. Fixed All CanvasCard Usage Sites

Removed hardcoded `text-white` classes and replaced with opacity-based styling:

#### `/src/app/projects/[id]/page.tsx`

- 4 CanvasCard sections fixed
- Changed `text-white/90` → `opacity-90`
- Changed `text-white/80` → `opacity-80`
- Changed `text-white/70` → `opacity-70`
- Removed `text-white` from buttons and badges

#### `/src/app/certifications/[id]/page.tsx`

- 4 CanvasCard sections fixed
- Same pattern as projects page
- All explicit white text removed

#### `/src/components/volunteer/ExperienceSidebar.tsx`

- 6 CanvasCard sections fixed
- Organization info card
- Tech stack card
- Quick actions card
- Experience highlights card
- Timeline legend card
- Position timeline card

## How It Works

### Light Mode (Before Hover)

1. Gradient overlay provides `to-black/20` darkening at bottom
2. Text uses `text-card-foreground` (dark color)
3. Result: Dark text on light background with subtle gradient = **Visible**

### Dark Mode (Before Hover)

1. Gradient overlay provides `dark:to-black/40` darkening
2. Text uses `dark:text-foreground` (white color)
3. Result: White text on dark background with gradient = **Visible**

### On Hover (Both Modes)

1. Gradient overlay fades to `opacity-0`
2. Canvas animation reveals (colored moving dots on dark background)
3. Text transitions to `text-white` via `group-hover/canvas-card:text-white`
4. Result: White text on dark canvas animation = **Visible**

## Files Modified

### Component Files

- `/src/components/certificate/canva.tsx` - Added gradient overlay, updated text colors
- `/src/components/projects/canva.tsx` - Added gradient overlay, updated text colors

### Page Files

- `/src/app/projects/[id]/page.tsx` - Removed text-white from 4 sections
- `/src/app/certifications/[id]/page.tsx` - Removed text-white from 4 sections
- `/src/components/volunteer/ExperienceSidebar.tsx` - Removed text-white from 6 sections

## Testing Checklist

- [x] Light mode: Text visible before hover
- [x] Light mode: Text visible on hover (white on dark canvas)
- [x] Dark mode: Text visible before hover
- [x] Dark mode: Text visible on hover
- [x] Gradient overlay fades smoothly on hover
- [x] Transition animations work properly
- [x] All CanvasCard instances updated (projects, certifications, volunteer)

## Key Takeaways

1. **Never hardcode text colors** - Use theme-aware classes
2. **Provide contrast layers** - Light mode needs dark overlays, dark mode needs light overlays
3. **Use opacity for variations** - `opacity-90` instead of `text-white/90`
4. **Hover states need transitions** - Fade overlays when revealing animations
5. **Test both themes** - What works in dark mode may be invisible in light mode

## Related Files

- `/docs/TOAST_VISIBILITY_FIX.md` - Similar light mode visibility fixes for toasts
- `/src/app/globals.css` - Theme color definitions
