# Microfrontends Setup Documentation

This document explains the microfrontends setup for the Portfolio project.

## Overview

The portfolio is split into three microfrontend applications:

- **mishrashardendu22** (PersonalWebsite) - Main/Default app (Next.js)
- **mishrashardendu22-admin** (AdminWebsite) - Admin dashboard (Vite + Preact)
- **mishrashardendu22-blog** (BlogWebsite) - Blog section (Astro)

## Architecture

### Default Application

The PersonalWebsite (`mishrashardendu22`) serves as the default application and contains the `microfrontends.json` configuration file that controls routing for all microfrontends.

### Routing Configuration

The `microfrontends.json` file defines how requests are routed:

```json
{
  "$schema": "https://openapi.vercel.sh/microfrontends.json",
  "applications": {
    "mishrashardendu22": {
      "development": {
        "fallback": "https://mishrashardendu22.is-a.dev"
      }
    },
    "mishrashardendu22-admin": {
      "routing": [
        {
          "group": "admin",
          "paths": ["/admin", "/admin/:path*"]
        }
      ]
    },
    "mishrashardendu22-blog": {
      "routing": [
        {
          "group": "blog",
          "paths": ["/blog", "/blog/:path*"]
        }
      ]
    }
  }
}
```

### Key Configuration Details

1. **Application Names**: Must match Vercel project names
2. **Group Property**: Required for each routing configuration (e.g., "admin", "blog")
3. **Path Patterns**: Use `:path*` for wildcard matching (not `/*`)
4. **Fallback URL**: Must be a full production URL with https://

### Asset Prefixes

Each microfrontend automatically gets an asset prefix:

- Admin: `/vc-ap-mishrashardendu22-admin/`
- Blog: `/vc-ap-mishrashardendu22-blog/`

The format is `/vc-ap-<application-name>/` (in version 2.0.0, or `/vc-ap-<hash>` in earlier versions)

## Setup Details

### 1. PersonalWebsite (Next.js - Default App)

**Package**: `@vercel/microfrontends` installed

**next.config.ts**:

```typescript
import { withMicrofrontends } from '@vercel/microfrontends/next/config'

export default withMicrofrontends(nextConfig)
```

**package.json scripts**:

```json
{
  "dev": "next dev --port $(microfrontends port)",
  "proxy": "microfrontends proxy --local-apps mishrashardendu22"
}
```

### 2. AdminWebsite (Vite + Preact)

**Package**: `@vercel/microfrontends` installed

**vite.config.ts**:

```typescript
export default defineConfig({
  // ... other config
  base: '/vc-ap-mishrashardendu22-admin/',
})
```

**package.json scripts**:

```json
{
  "dev": "vite --port $(microfrontends port)",
  "proxy": "microfrontends proxy --local-apps mishrashardendu22-admin"
}
```

### 3. BlogWebsite (Astro)

**Package**: `@vercel/microfrontends` installed

**astro.config.mjs**:

```javascript
export default defineConfig({
  vite: {
    base: '/vc-ap-mishrashardendu22-blog/',
  },
})
```

**package.json scripts**:

```json
{
  "dev": "astro dev --port $(microfrontends port)",
  "proxy": "microfrontends proxy --local-apps mishrashardendu22-blog"
}
```

## Local Development

### Running Locally

For each application you want to run locally:

1. **Start the proxy** (in one terminal):

   ```bash
   pnpm proxy
   ```

2. **Start the dev server** (in another terminal):
   ```bash
   pnpm dev
   ```

The proxy will automatically:

- Run your local microfrontend on a dynamically assigned port
- Route requests to your local app or the production fallback
- Provide a "Microfrontends Proxy" URL to visit

### Without Turborepo

If not using Turborepo, you need to run both commands manually:

- Terminal 1: `pnpm proxy`
- Terminal 2: `pnpm dev`

### With Turborepo (Recommended)

If you set up Turborepo, it will automatically run both the proxy and dev server when you run the dev task.

## Deployment

### Prerequisites

1. All three projects must be deployed to Vercel
2. Projects must be added to a microfrontends group in Vercel dashboard
3. The default app (PersonalWebsite) must be designated in the group

### Deployment Steps

1. Deploy the `microfrontends.json` file to the default app (PersonalWebsite)
2. Deploy all microfrontend applications
3. Test in Preview environment first
4. Deploy to Production

### Testing in Preview

- Push changes to a branch
- Create a PR
- Vercel will create preview deployments
- Test microfrontends routing in the preview URL

## Path Routing Rules

### Correct Path Patterns

```json
{
  "paths": ["/admin", "/admin/:path*"] // ✅ Correct
}
```

### Incorrect Path Patterns

```json
{
  "paths": ["/admin", "/admin/*"] // ❌ Wrong - use :path* instead
}
```

## Common Issues and Solutions

### Issue 1: Missing 'group' Property

**Error**: Routing configuration missing group
**Solution**: Add `"group": "unique-name"` to each routing object

### Issue 2: Invalid Fallback URL

**Error**: Fallback URL not working
**Solution**: Use full URL with protocol: `https://mishrashardendu22.is-a.dev`

### Issue 3: Assets Not Loading

**Error**: CSS/JS not loading correctly
**Solution**:

- For Next.js: Ensure `withMicrofrontends` wrapper is applied
- For Vite/Astro: Ensure `base` path is configured correctly

### Issue 4: Wrong Path Pattern

**Error**: Nested routes not working
**Solution**: Use `:path*` instead of `/*` for wildcards

## Static Assets

For static assets (images, fonts, etc.) not covered by the framework configuration:

1. Move them to a path prefixed with the application's asset prefix, OR
2. Add them to the microfrontends.json routing configuration

## Environment Variables

Each microfrontend can have its own environment variables in Vercel:

- Set per-project in Vercel dashboard
- Use appropriate prefix if needed (e.g., `VITE_`, `NEXT_PUBLIC_`)

## Monitoring

Use Vercel Toolbar for:

- Debugging microfrontends in development
- Viewing which microfrontend served each request
- Inspecting routing decisions

Enable in Vercel dashboard under Microfrontends settings.

## Resources

- [Vercel Microfrontends Documentation](https://vercel.com/docs/microfrontends)
- [Path Routing Guide](https://vercel.com/docs/microfrontends/path-routing)
- [Local Development Guide](https://vercel.com/docs/microfrontends/local-development)
- [Vercel Toolbar Setup](https://vercel.com/docs/microfrontends/managing-microfrontends/vercel-toolbar)

## Next Steps

1. ✅ Configuration files updated
2. ✅ Packages installed in all apps
3. ✅ Dev scripts configured
4. 🔄 Test local development
5. 🔄 Create microfrontends group in Vercel dashboard
6. 🔄 Deploy to Preview environment
7. 🔄 Test routing in Preview
8. 🔄 Deploy to Production

## Support

For issues specific to your setup:

1. Check Vercel build logs
2. Verify project names match in `microfrontends.json`
3. Ensure all apps are in the same Vercel team/organization
4. Test in Preview before Production
