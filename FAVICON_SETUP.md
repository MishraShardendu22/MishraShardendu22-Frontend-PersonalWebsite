# Favicon Setup Guide

## Issue Fixed

The application had a favicon conflict error:

```
⨯ A conflicting public file and page file was found for path /favicon.ico
```

## Root Cause

- `favicon.ico` existed in both `/public/favicon.ico` and `/src/app/favicon.ico`
- In Next.js 13+ with App Router, favicon should only be in the `public` directory

## Solution Applied

### 1. Removed Conflicting File

- Deleted `/src/app/favicon.ico`
- Kept `/public/favicon.ico` as the single source of truth

### 2. Updated Metadata in layout.tsx

Added proper favicon metadata to ensure correct favicon loading:

```typescript
export const metadata: Metadata = {
  // ... other metadata
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/icons/icon-192.png',
    other: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        url: '/favicon.ico',
      },
    ],
  },
  // ... rest of metadata
}
```

### 3. File Structure

```
public/
├── favicon.ico          ✅ Main favicon (correct location)
├── icons/
│   ├── icon-192.png    ✅ PWA icon 192x192
│   └── icon-512.png    ✅ PWA icon 512x512
└── manifest.json       ✅ PWA manifest

src/app/
├── layout.tsx          ✅ Contains favicon metadata
└── (no favicon.ico)    ✅ Removed to prevent conflict
```

## Verification

- Server starts without favicon conflicts
- Favicon loads correctly in browser
- PWA icons are properly configured
- Manifest.json references correct icon paths

## Best Practices

1. **Single Source**: Keep favicon only in `/public/` directory
2. **Metadata**: Always define favicon in layout.tsx metadata
3. **Multiple Formats**: Provide different sizes for various use cases
4. **PWA Support**: Include proper PWA icons in manifest.json
