# Shardendu Mishra - Personal Website

A modern, full-stack portfolio website built with Next.js 15, featuring a blog system, admin panel, and dual backend architecture with load balancing.

![Portfolio Preview](https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.11-38B2AC?style=for-the-badge&logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-336791?style=for-the-badge&logo=postgresql)

## Features

### Portfolio Sections

- **Hero Section** - Animated introduction with modern design
- **Education** - Academic background and achievements
- **Skills** - Interactive skill showcase with pagination
- **Projects** - Portfolio projects with detailed descriptions
- **Experience** - Professional work history
- **Certifications** - Professional certifications and achievements
- **Contact** - Contact information and social links

### Blog System

- **Rich Text Editor** - TipTap-based markdown editor
- **Categories & Tags** - Organized content management
- **Comments System** - User interaction and engagement
- **Like & Bookmark** - Social features for content
- **View Tracking** - Analytics and engagement metrics
- **Search & Filtering** - Advanced content discovery
- **Revision History** - Content version control
- **Reporting System** - Content moderation tools

### Admin Panel

- **Authentication** - Secure admin login system
- **Dashboard** - Overview of site statistics
- **Content Management** - CRUD operations for all content
- **User Management** - User profiles and permissions
- **Analytics** - Detailed performance metrics
- **Moderation** - Report handling and content review

### Technical Features

- **Dual Backend Architecture** - Next.js API + Go backend with load balancing
- **Real-time Updates** - Live content synchronization
- **Responsive Design** - Mobile-first approach
- **Dark/Light Theme** - Theme switching with system preference
- **SEO Optimized** - Meta tags, structured data, and performance
- **Performance Optimized** - Image optimization, lazy loading, caching

## Architecture

### Frontend (Next.js 15)

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel routes
│   ├── api/               # Next.js API routes
│   ├── blog/              # Blog system routes
│   ├── projects/          # Project pages
│   ├── experiences/       # Experience pages
│   └── certifications/    # Certification pages
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── admin/            # Admin-specific components
│   ├── blog/             # Blog-specific components
│   └── main/             # Portfolio section components
├── db/                   # Database schemas
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── services/             # API service layer
└── util/                 # Utility functions
```

### Backend Architecture

- **Next.js API Routes** - Blog system, user management, authentication
- **Go Backend** - Portfolio data (projects, experiences, skills, certifications)
- **Load Balancer** - Round-robin distribution between backends
- **PostgreSQL** - Primary database with Drizzle ORM

### Database Schema

```sql
-- Core Tables
users, sessions, accounts, verifications
blog, comments, likes, bookmarks, views
categories, blog_categories
followers, notifications, reports
user_profiles, blog_revisions
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 13+
- Go 1.21+ (for backend)
- pnpm (recommended) or npm

### Environment Variables

Create a `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio"

# Backend URLs (Load Balancer)
BACKEND_1="http://localhost:8080"
BACKEND_2="http://localhost:8081"
BACKEND_3="http://localhost:8082"

# Next.js
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Analytics
NEXT_PUBLIC_GA_ID="your-ga-id"
```

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/ShardenduMishra22/portfolio-frontend.git
cd portfolio-frontend
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up the database**

```bash
# Run database migrations
pnpm drizzle-kit push

# Generate types (optional)
pnpm drizzle-kit generate
```

4. **Start the development server**

```bash
pnpm dev
```

5. **Access the application**

- Frontend: http://localhost:3000
- Admin Panel: http://localhost:3000/admin
- API Documentation: http://localhost:3000/api

### Backend Setup

The Go backend is available at: https://github.com/ShardenduMishra22/portfolio-backend

Follow the setup instructions in the backend repository to complete the full-stack setup.

## Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
pnpm type-check   # Run TypeScript type checking
```

### Code Structure

#### API Routes

- `/api/blogs/*` - Blog system endpoints
- `/api/users/*` - User management
- `/api/proxy/*` - Load balancer proxy to Go backend
- `/api/auth/*` - Authentication endpoints

#### Components

- **UI Components** - Reusable shadcn/ui components
- **Admin Components** - Admin panel specific components
- **Blog Components** - Blog system components
- **Main Components** - Portfolio section components

#### Services

- **API Services** - Centralized API calls
- **Auth Services** - Authentication and authorization
- **Backend Services** - Go backend integration

### Database Management

```bash
# Generate migration
pnpm drizzle-kit generate

# Push schema changes
pnpm drizzle-kit push

# Studio (database GUI)
pnpm drizzle-kit studio
```

## Styling

### Design System

- **Tailwind CSS 4** - Utility-first CSS framework
- **Custom CSS Variables** - Theme-aware design tokens
- **shadcn/ui** - High-quality React components
- **Custom Animations** - Smooth transitions and micro-interactions

### Theme Support

- **Light Theme** - Clean, professional appearance
- **Dark Theme** - Modern, eye-friendly design
- **System Preference** - Automatic theme switching
- **Custom Colors** - Brand-specific color palette

## Performance

### Optimization Features

- **Next.js 15** - Latest performance improvements
- **Turbopack** - Fast development builds
- **Image Optimization** - Automatic image compression
- **Code Splitting** - Lazy loading of components
- **Caching** - Strategic caching strategies
- **CDN Ready** - Optimized for content delivery

### Analytics

- **Vercel Analytics** - Performance monitoring
- **Speed Insights** - Core Web Vitals tracking
- **Custom Metrics** - Blog engagement analytics

## Security

### Authentication

- **Better Auth** - Modern authentication library
- **JWT Tokens** - Secure token-based authentication
- **Session Management** - Secure session handling
- **Role-based Access** - Admin and user permissions

### Data Protection

- **Input Validation** - Zod schema validation
- **SQL Injection Prevention** - Parameterized queries
- **XSS Protection** - Content sanitization
- **CSRF Protection** - Cross-site request forgery prevention

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Setup

1. Set up PostgreSQL database
2. Configure environment variables
3. Deploy Go backend
4. Configure load balancer
5. Deploy Next.js frontend

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] CDN configured
- [ ] Monitoring set up
- [ ] Backup strategy implemented

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for detailed guidelines on how to contribute to this project.

### Quick Start

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

### Shardendu Mishra

- Email: [mishrashardendu22@gmail.com](mailto:mishrashardendu22@gmail.com)
- GitHub: [@ShardenduMishra22](https://github.com/MishraShardendu22)
- LinkedIn: [Shardendu Mishra](https://linkedin.com/in/shardendumishra22/)
- Portfolio: [mishrashardendu22.is-a.dev](https://mishrashardendu22.is-a.dev)

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [TipTap](https://tiptap.dev/) - Rich text editor
- [Vercel](https://vercel.com/) - Deployment platform

## Support

If you have any questions or need help:

- Create an issue on GitHub
- Contact via email: [mishrashardendu22@gmail.com](mailto:mishrashardendu22@gmail.com)
- Connect on LinkedIn: [Shardendu Mishra](https://linkedin.com/in/shardendumishra22/)

---

If you found this project helpful, please consider giving it a star on GitHub!
