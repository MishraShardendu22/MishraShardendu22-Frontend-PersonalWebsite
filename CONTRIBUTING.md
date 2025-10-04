# Contributing to Shardendu Mishra's Portfolio Website

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and encourage diverse perspectives
- Focus on constructive feedback
- Accept responsibility and apologize for mistakes
- Prioritize what is best for the community

### Unacceptable Behavior

- Harassment, discriminatory language, or personal attacks
- Publishing others' private information
- Trolling or deliberately inflammatory comments
- Other conduct which could reasonably be considered inappropriate

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v8 or higher) - Recommended package manager
- **PostgreSQL** (v13 or higher)
- **Git** for version control

### Initial Setup

1. **Fork the Repository**

   Click the "Fork" button at the top right of the repository page.

2. **Clone Your Fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/MishraShardendu22-Frontend-PersonalWebsite.git
   cd MishraShardendu22-Frontend-PersonalWebsite
   ```

3. **Add Upstream Remote**

   ```bash
   git remote add upstream https://github.com/MishraShardendu22/MishraShardendu22-Frontend-PersonalWebsite.git
   ```

4. **Install Dependencies**

   ```bash
   pnpm install
   ```

5. **Set Up Environment Variables**

   Copy `.env.example` to `.env.local` and configure:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/portfolio"
   BACKEND_1="http://localhost:8080"
   BACKEND_2="http://localhost:8081"
   BACKEND_3="http://localhost:8082"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

6. **Set Up the Database**

   ```bash
   pnpm drizzle-kit push
   ```

7. **Start Development Server**

   ```bash
   pnpm dev
   ```

   The application should now be running at `http://localhost:3000`

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes
- `refactor/*` - Code refactoring
- `docs/*` - Documentation updates

### Creating a Feature Branch

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create and checkout a new feature branch
git checkout -b feature/your-feature-name
```

### Making Changes

1. Make your changes in the feature branch
2. Test your changes thoroughly
3. Ensure code follows the project's coding standards
4. Update documentation if necessary
5. Commit your changes following commit guidelines

### Keeping Your Branch Updated

```bash
# Fetch latest changes from upstream
git fetch upstream

# Rebase your branch on top of the latest main
git rebase upstream/main

# If there are conflicts, resolve them and continue
git rebase --continue
```

## Coding Standards

### TypeScript Guidelines

- **Strict Type Checking**: Enable strict mode in TypeScript
- **Explicit Types**: Prefer explicit type annotations over inferred types for function parameters and return values
- **Avoid `any`**: Use proper types instead of `any` whenever possible
- **Interfaces over Types**: Use interfaces for object shapes, types for unions/intersections

Example:

```typescript
// Good
interface UserProfile {
  id: string
  name: string
  email: string
}

function getUserProfile(userId: string): Promise<UserProfile> {
  // implementation
}

// Avoid
function getUserProfile(userId): any {
  // implementation
}
```

### React Component Guidelines

- **Functional Components**: Use functional components with hooks
- **Component Naming**: Use PascalCase for component names
- **Props Interface**: Define props interface for all components
- **Default Props**: Use destructuring with default values

Example:

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({
  label,
  onClick,
  variant = 'primary',
  disabled = false
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
}
```

### Styling Guidelines

- **Tailwind CSS**: Use Tailwind utility classes
- **Custom Classes**: Minimize custom CSS; use Tailwind's configuration
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Ensure all components support dark mode

Example:

```typescript
<div className="flex flex-col md:flex-row gap-4 p-4 bg-white dark:bg-gray-900">
  <div className="flex-1">Content</div>
</div>
```

### File Naming Conventions

- **Components**: PascalCase - `UserProfile.tsx`
- **Utilities**: camelCase - `formatDate.ts`
- **Hooks**: camelCase with 'use' prefix - `useAuth.ts`
- **Types**: PascalCase - `User.types.ts`
- **Constants**: UPPER_SNAKE_CASE - `API_ENDPOINTS.ts`

### Code Organization

- **One component per file**: Each component should be in its own file
- **Index files**: Use index files for cleaner imports
- **Folder structure**: Group related files together
- **Separation of concerns**: Separate business logic from UI components

### API Service Guidelines

- **Service Layer**: All API calls should go through the service layer
- **Error Handling**: Properly handle and propagate errors
- **Type Safety**: Define request/response types
- **Consistent Patterns**: Follow existing patterns for API calls

Example:

```typescript
// services/users/index.ts
interface GetUserResponse {
  user: User
  success: boolean
}

export async function getUser(userId: string): Promise<GetUserResponse> {
  try {
    const response = await fetch(`/api/users/${userId}`)
    if (!response.ok) throw new Error('Failed to fetch user')
    return await response.json()
  } catch (error) {
    console.error('Error fetching user:', error)
    throw error
  }
}
```

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```text
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semi-colons, etc.)
- **refactor**: Code refactoring without changing functionality
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependency updates
- **ci**: CI/CD configuration changes

### Examples

```bash
feat(blog): add comment threading functionality

fix(auth): resolve session timeout issue

docs(readme): update installation instructions

refactor(api): simplify error handling logic

perf(images): implement lazy loading for gallery

test(auth): add unit tests for login flow

chore(deps): update dependencies to latest versions
```

### Commit Best Practices

- Write clear, concise commit messages
- Use present tense ("add feature" not "added feature")
- Keep the subject line under 50 characters
- Use the body to explain what and why, not how
- Reference issues and pull requests when applicable

## Pull Request Process

### Before Submitting

1. **Self-Review**: Review your own code first
2. **Test**: Ensure all tests pass
3. **Lint**: Run linter and fix any issues
4. **Documentation**: Update relevant documentation
5. **Rebase**: Rebase on the latest main branch

```bash
# Run tests
pnpm test

# Run linter
pnpm lint

# Run type checking
pnpm type-check

# Format code
pnpm format
```

### Creating a Pull Request

1. **Push Your Branch**

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open Pull Request**
   - Navigate to the repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

3. **PR Title Format**

   Follow the same convention as commit messages:

   ```text
   feat(blog): add comment threading functionality
   ```

4. **PR Description Should Include**
   - **What**: Description of changes
   - **Why**: Reason for changes
   - **How**: Implementation approach (if complex)
   - **Testing**: How you tested the changes
   - **Screenshots**: For UI changes
   - **Related Issues**: Reference any related issues

### PR Template Example

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

How have you tested this?

## Screenshots (if applicable)

Add screenshots here

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests passing
```

### Review Process

1. **Automated Checks**: All CI checks must pass
2. **Code Review**: At least one approval required
3. **Address Feedback**: Respond to review comments
4. **Final Review**: Maintainer final review
5. **Merge**: Maintainer will merge the PR

### After Your PR is Merged

1. Delete your feature branch
2. Pull the latest changes from main
3. Update your local repository

```bash
git checkout main
git pull upstream main
git branch -d feature/your-feature-name
```

## Project Structure

Understanding the project structure will help you contribute effectively:

```text
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── admin/             # Admin panel
│   ├── api/               # API routes
│   ├── blog/              # Blog pages
│   └── ...                # Other pages
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── admin/            # Admin components
│   ├── blog/             # Blog components
│   └── main/             # Main portfolio components
├── db/                   # Database schemas
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── services/             # API service layer
└── util/                 # Utility functions
```

### Adding New Components

1. Create component in appropriate directory
2. Define TypeScript interface for props
3. Implement component with proper typing
4. Add to index file if needed
5. Document complex components

### Adding New API Routes

1. Create route handler in `app/api/`
2. Define request/response types
3. Implement error handling
4. Add to service layer
5. Update API documentation

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Writing Tests

- Write tests for all new features
- Maintain test coverage above 80%
- Use meaningful test descriptions
- Test edge cases and error scenarios

### Test Structure

```typescript
describe('Component/Feature Name', () => {
  it('should perform expected behavior', () => {
    // Arrange
    const input = setupTestData()

    // Act
    const result = performAction(input)

    // Assert
    expect(result).toBe(expected)
  })
})
```

## Documentation

### Code Comments

- Add comments for complex logic
- Explain "why" not "what"
- Keep comments up to date with code changes
- Use JSDoc for function documentation

Example:

```typescript
/**
 * Calculates the reading time for a blog post
 * @param content - The blog post content in markdown
 * @returns Reading time in minutes
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}
```

### README Updates

- Update README for new features
- Keep installation steps current
- Document new environment variables
- Update screenshots if UI changes

### API Documentation

- Document all API endpoints
- Include request/response examples
- Document error responses
- Keep OpenAPI/Swagger specs updated

## Questions or Need Help?

- **GitHub Issues**: Open an issue for bugs or feature requests
- **Email**: [mishrashardendu22@gmail.com](mailto:mishrashardendu22@gmail.com)
- **Discussions**: Use GitHub Discussions for questions

## Recognition

Contributors will be recognized in:

- Project README
- Release notes
- Contributors page (if applicable)

Thank you for contributing to this project! Your efforts help make this portfolio website better for everyone.
