# UI Components Guide

Complete guide to custom UI components used throughout the portfolio website.

## Table of Contents

1. [CanvasCard Component](#canvascard-component)
2. [Toast Notifications](#toast-notifications)
3. [Theme System](#theme-system)

---

## CanvasCard Component

### Overview

The CanvasCard is a reusable component with animated canvas reveal effects on hover. Used extensively in:

- Experience detail pages (sidebar)
- Volunteer detail pages (sidebar)
- Certification detail pages (sidebar)
- Project detail pages (sidebar)

### Variants

#### Certificate/Experience Variant

**Location:** `/src/components/certificate/canva.tsx`

**Usage:**

```tsx
<CanvasCard
  title="Company Info"
  icon={<Building2 className="h-6 w-6 text-blue-400" />}
  animationSpeed={4}
  containerClassName="bg-blue-900"
  colors={[
    [59, 130, 246],
    [147, 197, 253],
  ]}
  dotSize={2}
>
  {/* Content */}
</CanvasCard>
```

**Styling:**

- **Light Mode:** Pure white background (`bg-white`)
- **Dark Mode:** Complete black background (`dark:bg-black`)
- **On Hover:** Animated canvas with specified colors

**Props:**

- `title`: Card title
- `icon`: React icon component
- `animationSpeed`: Speed of canvas animation (default: 3)
- `containerClassName`: Background color for canvas animation
- `colors`: RGB color array for canvas dots
- `dotSize`: Size of canvas dots (default: 2)

#### Projects Variant

**Location:** `/src/components/projects/canva.tsx`

**Usage:**

```tsx
<CanvasCard
  title="Get Involved"
  icon={<Star className="h-6 w-6" />}
  canvasProps={{
    animationSpeed: 2.5,
    containerClassName: 'bg-emerald-900 dark:bg-emerald-900',
    colors: [
      [34, 197, 94],
      [16, 185, 129],
    ],
    dotSize: 2,
  }}
>
  {/* Content */}
</CanvasCard>
```

**Differences:**

- Uses `canvasProps` object instead of individual props
- Maintains dark mode with specific container class

### Visibility Pattern

All CanvasCard components use the `group-hover/canvas-card:` prefix for conditional styling:

**Buttons:**

```tsx
className="border-border hover:bg-accent
  group-hover/canvas-card:border-white/30
  group-hover/canvas-card:text-white
  group-hover/canvas-card:hover:bg-white/20"
```

**Badges:**

```tsx
className="border-border bg-secondary
  group-hover/canvas-card:bg-white/20
  group-hover/canvas-card:text-white
  group-hover/canvas-card:border-white/30"
```

**Text:**

```tsx
className="text-foreground
  group-hover/canvas-card:text-white"
```

**Opacity Classes:**

```tsx
className="opacity-80
  group-hover/canvas-card:text-white/80"
```

### Components Using CanvasCard

| Component             | Location                                           | Sections                                                                                     |
| --------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Experience Sidebar    | `/src/components/experience/ExperienceSidebar.tsx` | Company Info, Tech Stack, Quick Actions, Experience Highlights                               |
| Volunteer Sidebar     | `/src/components/volunteer/ExperienceSidebar.tsx`  | Organization Info, Tech Stack, Quick Actions, Highlights, Timeline Legend, Position Timeline |
| Certification Sidebar | `/src/app/certifications/[id]/page.tsx`            | Certification Info, Skills Overview, Quick Actions, Achievement Highlights                   |
| Projects Sidebar      | `/src/app/projects/[id]/page.tsx`                  | Get Involved, Interested in This Project, Project Highlights, Explore All                    |

---

## Toast Notifications

### Overview

Custom toast notifications using `react-hot-toast` with Lucide React icons.

**Location:** `/src/lib/toast.tsx`

### Configuration

**Position:** Top-right
**Duration:** 3000ms (3 seconds)
**Icon Type:** Lucide React components

### Usage

```tsx
import { showToast } from '@/lib/toast'

// Success
showToast.success('Operation completed successfully!')

// Error
showToast.error('Something went wrong')

// Info
showToast.info('Here is some information')

// Warning
showToast.warning('Please be careful')

// Loading
showToast.loading('Processing...')
```

### Styling

**Success:**

- Background: `#00c896` (teal green)
- Icon: `CheckCircle`
- Text: White

**Error:**

- Background: `#ef4444` (red)
- Icon: `XCircle`
- Text: White

**Info:**

- Background: `#3b82f6` (blue)
- Icon: `Info`
- Text: White

**Warning:**

- Background: `#f59e0b` (amber)
- Icon: `AlertTriangle`
- Text: White

**Loading:**

- Background: `#6b7280` (gray)
- Icon: Spinner animation
- Text: White

### Toaster Client

**Location:** `/src/components/extra/ToasterClient.tsx`

```tsx
<Toaster
  position="top-right"
  reverseOrder={false}
  gutter={8}
  toastOptions={{
    duration: 3000,
    style: {
      background: 'var(--background)',
      color: 'var(--foreground)',
      border: '1px solid var(--border)',
    },
  }}
/>
```

---

## Theme System

### CSS Variables

**Light Mode:**

```css
--background: #fef7f0;
--foreground: #1c1c1e;
--card: #ffffff;
--border: #e5e7eb;
--primary: #00c896;
--secondary: #7cb342;
--accent: #3b82f6;
```

**Dark Mode:**

```css
--background: #09090b;
--foreground: #ffffff;
--card: #111111;
--border: #27272a;
--primary: #00c896;
--secondary: #7cb342;
--accent: #3b82f6;
```

### Best Practices

1. **Always use CSS variables** instead of hardcoded colors
2. **Use `text-foreground`** for text that adapts to theme
3. **Use `bg-background`** for backgrounds that adapt to theme
4. **Use conditional classes** for specific dark/light mode needs:
   ```tsx
   className = 'bg-white dark:bg-black'
   ```

### Common Patterns

**Cards:**

```tsx
className = 'bg-card border border-border/50'
```

**Text:**

```tsx
className = 'text-foreground'
```

**Muted Text:**

```tsx
className = 'text-muted-foreground'
```

**Primary Action:**

```tsx
className = 'bg-primary text-primary-foreground'
```

---

## Project Count Calculation

### Formula

Throughout the application, project counts include both regular projects and iframe embeds:

```tsx
{
  experience.projects.length + experience.images.length
}
```

### Locations Updated

1. Experience Sidebar - Highlights card
2. Volunteer Sidebar - Highlights card
3. Experience Description - Quick Facts
4. Volunteer Description - Quick Facts
5. Experience Timeline - Header stats
6. Experience Timeline - Timeline cards
7. Volunteer Timeline - Header stats
8. Volunteer Timeline - Timeline cards

**Rationale:** iframes display embedded content (LinkedIn posts, etc.) which are also projects being showcased.

---

## Migration Notes

### React 19 Compatibility

- All components use React 19 features
- `use client` directive for client components
- Server components by default
- Proper TypeScript types for all props

### Next.js 15

- App Router structure
- Metadata API for SEO
- Streaming and Suspense support
- Route handlers for API endpoints

---

## File Structure

```
src/
├── components/
│   ├── certificate/
│   │   └── canva.tsx          # Certificate/Experience CanvasCard
│   ├── projects/
│   │   └── canva.tsx          # Projects CanvasCard variant
│   ├── experience/
│   │   └── ExperienceSidebar.tsx
│   ├── volunteer/
│   │   └── ExperienceSidebar.tsx
│   ├── extra/
│   │   └── ToasterClient.tsx
│   └── ui/
│       └── [shadcn components]
├── lib/
│   └── toast.tsx              # Toast utility functions
└── app/
    ├── globals.css            # Theme variables
    └── layout.tsx             # Root layout with Toaster
```

---

## Future Improvements

- [ ] Add keyboard shortcuts for toast notifications
- [ ] Implement toast queue management for multiple toasts
- [ ] Add animation variants for CanvasCard
- [ ] Create CanvasCard playground/demo page
- [ ] Add more theme color schemes
- [ ] Implement theme switcher animation
