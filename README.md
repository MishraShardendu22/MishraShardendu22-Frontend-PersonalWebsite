# Personal Website - Next.js 15 Portfolio Application

Professional portfolio application showcasing projects, experiences, skills, and certifications. Built with Next.js 15 App Router and modern web technologies.

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Development](#development)
- [Database Schema](#database-schema)
- [API Routes](#api-routes)
- [Authentication](#authentication)
- [Deployment](#deployment)
- [Performance Optimization](#performance-optimization)
- [Testing](#testing)
- [Contributing](#contributing)

## Overview

This is the main portfolio application of the monorepo, serving as the primary web presence. It provides a comprehensive showcase of professional work, technical skills, and career achievements through an intuitive and performant interface.

**Key Characteristics**:
- Server-side rendering with Next.js 15 App Router
- Type-safe database operations with Drizzle ORM
- Modern authentication with Better-auth
- Progressive Web App capabilities
- Optimized for Core Web Vitals

## Technology Stack

### Core Framework
- **Next.js 15.5.3**: React framework with App Router, Server Components, and Server Actions
- **React 19.2.0**: UI library with concurrent features and improved hydration
- **TypeScript 5.8**: Static type checking and enhanced developer experience

### Styling & UI
- **Tailwind CSS 4**: Utility-first CSS framework with JIT compilation
- **shadcn/ui**: High-quality accessible component library built on Radix UI
- **Radix UI**: Unstyled, accessible component primitives
- **Lucide React**: Beautiful and consistent icon library
- **Framer Motion**: Production-ready animation library

### Database & ORM
- **PostgreSQL 15+**: Relational database for structured data
- **Drizzle ORM**: Type-safe SQL ORM with excellent TypeScript support
- **Better-auth**: Modern authentication library with session management

### Data Visualization
- **Nivo**: Rich data visualization library
- **Recharts**: Composable charting library built on D3

### Form Management
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: TypeScript-first schema validation
- **@hookform/resolvers**: Integration between React Hook Form and Zod

### Additional Libraries
- **Axios**: HTTP client for API requests
- **date-fns**: Modern date utility library
- **React Markdown**: Markdown rendering component
- **remark-gfm**: GitHub Flavored Markdown support
- **Three.js**: 3D graphics library for interactive elements

## Features

### Portfolio Showcase
- **Dynamic Project Gallery**: Filterable and searchable project showcase with live statistics
- **Project Details**: Comprehensive project pages with descriptions, technologies, and links
- **GitHub Integration**: Real-time repository statistics and contribution data
- **Category Filtering**: Projects organized by type (web, mobile, AI/ML, backend)
- **Technology Tags**: Visual representation of tech stack for each project

### Professional Experience
- **Timeline View**: Chronological display of work experience
- **Achievement Highlights**: Key accomplishments and responsibilities
- **Skills Matrix**: Interactive visualization of technical proficiencies
- **Certifications**: Verified credentials with validation links
- **Volunteer Work**: Community contributions and open-source involvement

### Content Management
- **Blog Integration**: Seamless connection with blog application
- **Rich Text Support**: Markdown and HTML content rendering
- **Comment System**: Engagement through threaded discussions
- **SEO Optimization**: Meta tags, Open Graph, and structured data
- **Analytics Dashboard**: Performance metrics and visitor insights

### User Experience
- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Dark/Light Mode**: System preference detection with manual toggle
- **Progressive Web App**: Offline support and app-like experience
- **Fast Navigation**: Optimistic UI updates and prefetching
- **Accessibility**: WCAG 2.1 AA compliance with keyboard navigation

### Technical Features
- **Server Components**: Optimal data fetching and reduced client bundle
- **Streaming SSR**: Progressive page rendering for faster perceived performance
- **Image Optimization**: WebP/AVIF formats with lazy loading
- **Code Splitting**: Automatic bundle optimization per route
- **Edge Caching**: CDN integration for global performance

## Architecture

### Application Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (main)/                   # Main application routes
│   │   ├── page.tsx             # Home page
│   │   ├── projects/            # Project showcase
│   │   ├── experiences/         # Work experience
│   │   ├── certifications/      # Certifications
│   │   └── volunteer/           # Volunteer work
│   ├── api/                     # API routes
│   │   ├── auth/                # Authentication endpoints
│   │   ├── blogs/               # Blog API
│   │   ├── proxy/               # Backend proxy routes
│   │   └── health/              # Health check
│   ├── layout.tsx               # Root layout
│   └── providers.tsx            # Context providers
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── layout/                  # Layout components
│   ├── home/                    # Home page components
│   └── shared/                  # Shared components
├── lib/                         # Utility libraries
│   ├── db/                      # Database configuration
│   ├── auth/                    # Authentication setup
│   └── utils.ts                 # Helper functions
├── hooks/                       # Custom React hooks
├── types/                       # TypeScript type definitions
└── styles/                      # Global styles

drizzle/                         # Database migrations
├── migrations/                  # SQL migration files
└── schema.ts                    # Database schema definitions

public/                          # Static assets
├── icons/                       # App icons
├── images/                      # Image assets
└── manifest.json               # PWA manifest
```

### Data Flow

1. **Client Request**: User navigates to a route
2. **Server Component**: Next.js renders server component with data
3. **Database Query**: Drizzle ORM fetches data from PostgreSQL
4. **Data Transformation**: Server processes and formats data
5. **HTML Streaming**: Progressive HTML sent to client
6. **Client Hydration**: React hydrates interactive components
7. **Client-side Navigation**: Subsequent navigation via client router

### State Management

- **Server State**: React Server Components for data fetching
- **Client State**: React hooks (useState, useReducer) for local state
- **URL State**: Search params and pathname for shareable state
- **Form State**: React Hook Form for complex form management
- **Auth State**: Better-auth for authentication state

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- PNPM >= 9.0.0
- PostgreSQL >= 15
- Git

### Installation

```bash
# Navigate to the project directory
cd apps/MishraShardendu22-Frontend-PersonalWebsite

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local

# Configure your .env.local file with required values
# (See Environment Configuration section)

# Generate Drizzle client
pnpm db:generate

# Push database schema
pnpm db:push

# (Optional) Seed database with sample data
pnpm db:seed

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`

## Environment Configuration

Create a `.env.local` file in the project root with the following variables:

### Database Configuration

```env
# PostgreSQL Database URL
DATABASE_URL="postgresql://username:password@localhost:5432/portfolio_db"

# Direct database connection (for migrations)
DIRECT_URL="postgresql://username:password@localhost:5432/portfolio_db"
```

### Authentication

```env
# Better-auth configuration
BETTER_AUTH_SECRET="your-secret-key-min-32-characters"
BETTER_AUTH_URL="http://localhost:3000"

# JWT Configuration
JWT_SECRET="your-jwt-secret-matching-backend"
JWT_EXPIRATION="7d"
```

### API Configuration

```env
# Next.js base URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Backend API URL (Go Fiber service)
NEXT_PUBLIC_API_BASE_URL="http://localhost:5000"

# API timeout settings
API_TIMEOUT="30000"
```

### External Services

```env
# Email service (Resend)
RESEND_API_KEY="re_your_resend_api_key"
SMTP_FROM="noreply@yourdomain.com"

# GitHub Integration
GITHUB_TOKEN="ghp_your_github_token"
GITHUB_USERNAME="your_github_username"

# Analytics
VERCEL_ANALYTICS_ID="your_analytics_id"
GOOGLE_ANALYTICS_ID="G-YOUR-GA-ID"
```

### Feature Flags

```env
# Enable/disable features
NEXT_PUBLIC_ENABLE_COMMENTS="true"
NEXT_PUBLIC_ENABLE_ANALYTICS="true"
NEXT_PUBLIC_MAINTENANCE_MODE="false"
```

## Development

### Available Scripts

```bash
# Development server with hot reload
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Run ESLint
pnpm lint

# Fix ESLint errors
pnpm lint:fix

# Format code with Prettier
pnpm format

# Type checking
pnpm typecheck

# Database operations
pnpm db:generate      # Generate migration files
pnpm db:push         # Push schema to database
pnpm db:studio       # Open Drizzle Studio
pnpm db:seed         # Seed database with sample data

# Testing
pnpm test            # Run unit tests
pnpm test:watch      # Run tests in watch mode
pnpm test:coverage   # Generate coverage report
pnpm test:e2e        # Run end-to-end tests
```

### Development Workflow

1. **Feature Development**:
   - Create feature branch from `main`
   - Implement feature with tests
   - Run `pnpm lint` and `pnpm typecheck`
   - Submit pull request

2. **Database Changes**:
   - Modify schema in `drizzle/schema.ts`
   - Run `pnpm db:generate` to create migration
   - Run `pnpm db:push` to apply changes
   - Test changes locally

3. **Component Development**:
   - Create component in appropriate directory
   - Add TypeScript types
   - Include unit tests
   - Document props and usage

## Database Schema

### Core Tables

#### Projects Table
```typescript
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  longDescription: text('long_description'),
  technologies: text('technologies').array(),
  category: varchar('category', { length: 50 }),
  demoUrl: varchar('demo_url', { length: 500 }),
  repositoryUrl: varchar('repository_url', { length: 500 }),
  imageUrl: varchar('image_url', { length: 500 }),
  featured: boolean('featured').default(false),
  status: varchar('status', { length: 50 }).default('active'),
  displayOrder: integer('display_order'),
  githubStars: integer('github_stars'),
  githubForks: integer('github_forks'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});
```

#### Experiences Table
```typescript
export const experiences = pgTable('experiences', {
  id: serial('id').primaryKey(),
  company: varchar('company', { length: 255 }).notNull(),
  position: varchar('position', { length: 255 }).notNull(),
  description: text('description'),
  responsibilities: text('responsibilities').array(),
  achievements: text('achievements').array(),
  technologies: text('technologies').array(),
  location: varchar('location', { length: 255 }),
  employmentType: varchar('employment_type', { length: 50 }),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  current: boolean('current').default(false),
  companyUrl: varchar('company_url', { length: 500 }),
  companyLogo: varchar('company_logo', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});
```

#### Certifications Table
```typescript
export const certifications = pgTable('certifications', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  issuer: varchar('issuer', { length: 255 }).notNull(),
  description: text('description'),
  issueDate: date('issue_date').notNull(),
  expirationDate: date('expiration_date'),
  credentialId: varchar('credential_id', { length: 255 }),
  credentialUrl: varchar('credential_url', { length: 500 }),
  skills: text('skills').array(),
  imageUrl: varchar('image_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});
```

### Relationships

- Projects can have multiple comments (one-to-many)
- Users can create multiple projects (one-to-many)
- Experiences belong to users (many-to-one)
- Certifications belong to users (many-to-one)

## API Routes

### Authentication Endpoints

```
POST   /api/auth/sign-in          # User sign in
POST   /api/auth/sign-up          # User registration
POST   /api/auth/sign-out         # User sign out
GET    /api/auth/session          # Get current session
POST   /api/auth/refresh          # Refresh access token
```

### Blog Endpoints

```
GET    /api/blogs                 # List all blogs
GET    /api/blogs/:id             # Get blog by ID
POST   /api/blogs                 # Create new blog
PUT    /api/blogs/:id             # Update blog
DELETE /api/blogs/:id             # Delete blog
GET    /api/blogs/:id/comments    # Get blog comments
POST   /api/blogs/:id/comments    # Add comment
GET    /api/blogs/stats           # Get blog statistics
```

### Proxy Endpoints (Backend Integration)

```
GET    /api/proxy/projects        # Fetch projects from backend
GET    /api/proxy/projects/:id    # Get project details
POST   /api/proxy/projects        # Create project
PUT    /api/proxy/projects/:id    # Update project
DELETE /api/proxy/projects/:id    # Delete project

GET    /api/proxy/experiences     # Fetch experiences
GET    /api/proxy/certifications  # Fetch certifications
GET    /api/proxy/skills          # Fetch skills
```

### Health Check

```
GET    /api/health                # Application health status
```

## Authentication

### Better-auth Integration

The application uses Better-auth for modern, secure authentication:

**Features**:
- Email/password authentication
- Session management with secure cookies
- CSRF protection
- Rate limiting on auth endpoints
- Password hashing with bcrypt
- JWT token generation for API access

**Configuration** (`lib/auth.ts`):
```typescript
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "./db"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg"
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24 // 24 hours
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8
  }
})
```

### Protected Routes

Protected routes use middleware to verify authentication:

```typescript
// middleware.ts
import { authMiddleware } from "@/lib/auth"

export default authMiddleware({
  publicRoutes: ["/", "/projects", "/experiences"],
  protectedRoutes: ["/api/admin/*"]
})
```

## Deployment

### Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Environment Variables on Vercel

Add all required environment variables in Vercel dashboard:
1. Go to Project Settings > Environment Variables
2. Add each variable from `.env.local`
3. Set scope (Production, Preview, Development)
4. Deploy changes

### Build Configuration

**vercel.json**:
```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "outputDirectory": ".next"
}
```

### Database Setup for Production

Use managed PostgreSQL service:
- **Vercel Postgres**: Integrated solution
- **Neon**: Serverless PostgreSQL
- **Supabase**: PostgreSQL with additional features
- **Railway**: Simple PostgreSQL hosting

## Performance Optimization

### Core Web Vitals Targets

- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Contentful Paint (FCP)**: < 1.8s
- **Time to Interactive (TTI)**: < 3.8s

### Optimization Strategies

1. **Image Optimization**:
   - Next.js Image component for automatic optimization
   - WebP/AVIF format with fallback
   - Lazy loading for below-fold images
   - Responsive images with srcset

2. **Code Splitting**:
   - Route-based code splitting
   - Dynamic imports for large components
   - Tree shaking for unused code
   - Vendor bundle optimization

3. **Caching Strategy**:
   - Static page generation where possible
   - Incremental Static Regeneration (ISR)
   - CDN caching with proper headers
   - Browser caching for assets

4. **Server Components**:
   - Data fetching in server components
   - Reduced client-side JavaScript
   - Streaming for progressive rendering
   - Parallel data fetching

## Testing

### Unit Testing

```bash
# Run unit tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage
```

### End-to-End Testing

```bash
# Run E2E tests
pnpm test:e2e

# Run specific test file
pnpm test:e2e tests/projects.spec.ts
```

### Testing Stack

- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **Playwright**: E2E testing
- **MSW**: API mocking for tests

## Contributing

For contribution guidelines, please refer to the [main repository CONTRIBUTING.md](../../docs/CONTRIBUTING.md).

### Quick Guidelines

1. Follow TypeScript strict mode conventions
2. Write tests for new features
3. Use conventional commits
4. Update documentation
5. Ensure all checks pass before PR

## Support

For issues, questions, or contributions:
- **Issues**: [GitHub Issues](https://github.com/MishraShardendu22/MishraShardendu/issues)
- **Documentation**: [Root Docs](../../docs)
- **Email**: mishrashardendu22@gmail.com

## License

This project is part of the MishraShardendu monorepo and is licensed under the MIT License.
