# Documentation

# Portfolio Website Documentation

Welcome to the documentation for MishraShardendu22's Portfolio Website.

## Documentation Index

### 📚 Core Guides

- **[UI Components Guide](./UI_COMPONENTS_GUIDE.md)** - Complete guide to CanvasCard, Toast notifications, and theme system
- **[Development Guide](./DEVELOPMENT_GUIDE.md)** - Setup, workflow, and best practices for development
- **[Migration Examples](./MIGRATION_EXAMPLES.md)** - Migration guides and examples for React 19 and Next.js 15
- **[Static Data Summary](./STATIC_DATA_SUMMARY.md)** - Overview of static data structure and usage

### 🔧 Component Fixes

- **[Canvas Card White Background Fix](./CANVAS_CARD_WHITE_BACKGROUND_FIX.md)** - Pure white backgrounds in light mode
- **[Canvas Card Visibility Fix](./CANVAS_CARD_VISIBILITY_FIX.md)** - Button and badge visibility improvements
- **[Experience Sidebar Fix](./EXPERIENCE_SIDEBAR_FIX.md)** - Experience page sidebar fixes
- **[Media Projects Button Fix](./MEDIA_PROJECTS_BUTTON_FIX.md)** - MediaSection and ProjectsSection button visibility
- **[Toast Guide](./TOAST_GUIDE.md)** - Toast notification system documentation

## Quick Links

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Common Tasks](#common-tasks)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

\`\`\`bash

# Install dependencies

pnpm install

# Run development server

pnpm dev
\`\`\`

Visit [Development Guide](./DEVELOPMENT_GUIDE.md) for detailed setup instructions.

## Project Structure

\`\`\`
src/
├── app/ # Next.js 15 App Router pages
├── components/ # React components
├── lib/ # Utilities and helpers
├── services/ # API services
├── hooks/ # Custom React hooks
├── data/ # Static data and types
└── constants/ # Application constants
\`\`\`

## Common Tasks

### Creating New Components

See [Development Guide - Adding New Component](./DEVELOPMENT_GUIDE.md#adding-a-new-component)

### Using CanvasCard

See [UI Components Guide - CanvasCard](./UI_COMPONENTS_GUIDE.md#canvascard-component)

### Working with Toasts

See [Toast Guide](./TOAST_GUIDE.md) or [UI Components Guide - Toast Notifications](./UI_COMPONENTS_GUIDE.md#toast-notifications)

## Tech Stack

- **Framework:** Next.js 15
- **React:** 19.2.0
- **TypeScript:** 5.7+
- **Styling:** Tailwind CSS 4.0
- **UI Library:** shadcn/ui + Radix UI
- **Icons:** Lucide React
- **Animations:** Framer Motion

## Recent Updates

### Dark Mode Fix (Latest)

- CanvasCard components now have complete black backgrounds in dark mode
- Maintains white backgrounds in light mode
- Canvas animation reveals colored gradients on hover

### Project Count Updates

- Project counts now include both regular projects AND iframe embeds
- Updated across all experience, volunteer, certification, and timeline components

### Visibility Improvements

- All buttons and badges now visible in both light and dark modes
- Conditional styling using `group-hover/canvas-card:` prefix
- Pure white CanvasCards in light mode as requested

## Contributing

1. Create feature branch
2. Make changes following code style guidelines
3. Test locally
4. Submit pull request

See [Development Guide - Development Workflow](./DEVELOPMENT_GUIDE.md#development-workflow) for details.

## Support

For questions or issues:

- Review documentation in this folder
- Check GitHub issues
- Contact: MishraShardendu22

## Available Documentation

### [METADATA_ERROR_FIX.md](./METADATA_ERROR_FIX.md)

Comprehensive documentation of the StreamingMetadataOutletImpl error fix in Next.js 15, including:

- Problem analysis
- Solution implementation
- Code examples
- Best practices
- Reference links

### [QUICK_FIX_SUMMARY.md](./QUICK_FIX_SUMMARY.md)

Quick reference guide for the metadata error fix with:

- 4-step solution
- Before/after code comparisons
- Files changed
- Key reference links

### [STREAMING_METADATA_FIX.md](./STREAMING_METADATA_FIX.md)

Detailed technical documentation with:

- In-depth problem analysis
- Complete code examples
- Migration checklist
- Performance considerations

### [ESLINT_TRIPLE_SLASH_FIX.md](./ESLINT_TRIPLE_SLASH_FIX.md)

ESLint configuration fix for Next.js generated files:

- Triple slash reference error resolution
- ESLint rule configuration
- Alternative solutions comparison
- Next.js specific linting best practices

## Quick Links

- [Next.js 15 Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)
- [Metadata API Reference](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Dynamic Routes Documentation](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
