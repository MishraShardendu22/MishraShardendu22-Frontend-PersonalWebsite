# Development Guide

Complete development guide for the portfolio website.

## Quick Start

### Prerequisites

- Node.js 18+ (preferably 20+)
- pnpm 8+
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/MishraShardendu22/MishraShardendu22-Frontend-PersonalWebsite.git

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

### Environment Setup

Create `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

---

## Project Structure

```
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── globals.css        # Global styles + theme
│   │   ├── blog/              # Blog routes
│   │   ├── projects/          # Projects routes
│   │   ├── experiences/       # Experience routes
│   │   ├── volunteer/         # Volunteer routes
│   │   └── certifications/    # Certification routes
│   │
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── blog/             # Blog-specific
│   │   ├── projects/         # Project-specific
│   │   ├── experience/       # Experience-specific
│   │   ├── volunteer/        # Volunteer-specific
│   │   ├── certificate/      # Certificate-specific
│   │   ├── auth/             # Authentication
│   │   └── extra/            # Shared/misc
│   │
│   ├── lib/                   # Utilities
│   │   ├── utils.ts          # General utilities
│   │   ├── toast.tsx         # Toast notifications
│   │   ├── auth.ts           # Auth helpers
│   │   └── seo-config.ts     # SEO configuration
│   │
│   ├── services/              # API services
│   │   ├── api.ts            # Base API client
│   │   ├── blogs/            # Blog API
│   │   ├── categories/       # Category API
│   │   └── users/            # User API
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── use-auth.ts       # Authentication hook
│   │   └── use-mobile.ts     # Mobile detection
│   │
│   ├── data/                  # Static data & types
│   │   ├── static.tsx        # Static content
│   │   └── types.data.ts     # TypeScript types
│   │
│   └── constants/             # Constants
│       └── url.ts            # URL constants
│
├── public/                    # Static assets
│   ├── icons/                # App icons
│   ├── favicon.ico
│   └── manifest.json
│
├── docs/                      # Documentation
│   ├── README.md             # Main docs index
│   ├── UI_COMPONENTS_GUIDE.md # Component guide
│   ├── DEVELOPMENT_GUIDE.md   # This file
│   ├── MIGRATION_EXAMPLES.md  # Migration guides
│   └── STATIC_DATA_SUMMARY.md # Static data info
│
└── config files
    ├── next.config.ts        # Next.js config
    ├── tailwind.config.ts    # Tailwind config
    ├── tsconfig.json         # TypeScript config
    └── package.json          # Dependencies
```

---

## Tech Stack

### Core

- **Framework:** Next.js 15 (App Router)
- **React:** 19.2.0
- **TypeScript:** 5.7+
- **Styling:** Tailwind CSS 4.0 (beta)
- **Package Manager:** pnpm

### UI Libraries

- **shadcn/ui:** Customizable component library
- **Radix UI:** Headless UI primitives
- **Lucide React:** Icon library
- **Framer Motion:** Animations
- **React Hot Toast:** Notifications

### Data & State

- **React Query:** Server state management (if used)
- **Zustand:** Client state management (if used)
- **Custom Hooks:** For reusable logic

### Development Tools

- **ESLint:** Code linting
- **Prettier:** Code formatting (if configured)
- **TypeScript:** Type checking

---

## Development Workflow

### Creating New Features

1. **Create branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Develop feature:**
   - Follow existing file structure
   - Use TypeScript for type safety
   - Follow component naming conventions
   - Add proper error handling

3. **Test locally:**

   ```bash
   pnpm dev
   ```

4. **Build check:**

   ```bash
   pnpm build
   ```

5. **Commit & push:**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

### Code Style Guidelines

#### Components

```tsx
// Use named exports
export function ComponentName() {
  return <div>Content</div>
}

// Props interface
interface ComponentProps {
  title: string
  description?: string
}

export function Component({ title, description }: ComponentProps) {
  return <div>{title}</div>
}
```

#### File Naming

- **Components:** PascalCase - `ExperienceSidebar.tsx`
- **Utilities:** camelCase - `toast.tsx`, `utils.ts`
- **Pages:** kebab-case - `[id]/page.tsx`
- **Styles:** kebab-case - `globals.css`

#### Import Order

```tsx
// 1. External packages
import { useState } from 'react'
import Link from 'next/link'

// 2. Internal components
import { Button } from '@/components/ui/button'
import { CanvasCard } from '@/components/certificate/canva'

// 3. Utilities and helpers
import { cn } from '@/lib/utils'
import { showToast } from '@/lib/toast'

// 4. Types
import { Experience } from '@/data/types.data'

// 5. Constants
import { API_URL } from '@/constants/url'
```

---

## Common Tasks

### Adding a New Page

1. Create route folder in `/src/app/`
2. Add `page.tsx` for the page component
3. Add `layout.tsx` if custom layout needed
4. Export metadata for SEO

```tsx
// src/app/new-page/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
}

export default function NewPage() {
  return <div>Content</div>
}
```

### Adding a New Component

1. Create component file in appropriate `/src/components/` subfolder
2. Define TypeScript interface for props
3. Use proper naming conventions
4. Add to component index if needed

```tsx
// src/components/feature/NewComponent.tsx
interface NewComponentProps {
  title: string
  onClick?: () => void
}

export function NewComponent({ title, onClick }: NewComponentProps) {
  return <button onClick={onClick}>{title}</button>
}
```

### Adding New API Endpoint

1. Create route handler in `/src/app/api/`
2. Use proper HTTP methods
3. Add error handling
4. Return proper status codes

```tsx
// src/app/api/example/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const data = await fetchData()
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}
```

### Updating Styles

1. Prefer Tailwind utility classes
2. Use CSS variables for theming
3. Add custom classes to `globals.css` if needed
4. Use `cn()` helper for conditional classes

```tsx
import { cn } from '@/lib/utils'

;<div
  className={cn('base-classes', isActive && 'active-classes', isPending && 'pending-classes')}
/>
```

---

## Build & Deployment

### Development Build

```bash
pnpm dev
```

Runs on `http://localhost:3000`

### Production Build

```bash
# Build
pnpm build

# Start production server
pnpm start
```

### Linting

```bash
# Check for lint errors
pnpm lint

# Auto-fix lint errors (if configured)
pnpm lint:fix
```

### Type Checking

```bash
# Type check
pnpm type-check
```

---

## Troubleshooting

### Clear Build Cache

```bash
rm -rf .next
pnpm dev
```

### Clear Node Modules

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
pnpm dev -p 3001
```

### TypeScript Errors

1. Check `tsconfig.json` configuration
2. Ensure all dependencies have type definitions
3. Clear TypeScript cache: `rm -rf .next tsconfig.tsbuildinfo`

---

## Performance Optimization

### Image Optimization

- Use Next.js `<Image>` component
- Specify width and height
- Use appropriate image formats (WebP)
- Lazy load images below the fold

### Code Splitting

- Use dynamic imports for heavy components
- Lazy load routes with `next/dynamic`
- Split large bundles

### Caching

- Leverage Next.js caching strategies
- Use `revalidate` for static pages
- Implement API response caching

---

## Security Best Practices

1. **Never commit secrets** - Use `.env.local`
2. **Validate user input** - Sanitize all inputs
3. **Use HTTPS** in production
4. **Implement rate limiting** for APIs
5. **Keep dependencies updated** - Regular security audits

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## Getting Help

- Check existing documentation in `/docs`
- Review similar components in codebase
- Check GitHub issues
- Contact maintainer: MishraShardendu22
