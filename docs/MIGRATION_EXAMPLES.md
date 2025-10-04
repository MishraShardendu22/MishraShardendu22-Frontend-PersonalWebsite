# Migration Examples: Updating Components

This file shows practical examples of how to update your existing components to use the new `static.tsx` file.

---

## Example 1: Update SEO Components

### File: `src/lib/seo-config.ts`

**Before:**

```typescript
import {
  XProfile,
  GitHubProject,
  LinkedInProfile,
  YouTubeChannel,
  LeetCodeProfile,
} from '@/data/static_link'
import { BASE_URL } from '@/constants/url'

export const seoConfig = {
  baseUrl: BASE_URL,
  siteName: 'Shardendu Mishra Portfolio',
  // ... hardcoded data
}
```

**After:**

```typescript
import { seoMetadata, socialLinks } from '@/data/static'
import { BASE_URL } from '@/constants/url'

export const seoConfig = seoMetadata

// Or if you need to merge with BASE_URL
export const seoConfig = {
  ...seoMetadata,
  baseUrl: BASE_URL,
}
```

---

## Example 2: Update StructuredData Component

### File: `src/components/seo/StructuredData.tsx`

**Before:**

```typescript
import {
  XProfile,
  GitHubProject,
  LinkedInProfile,
  YouTubeChannel,
  LeetCodeProfile,
  CodeChefProfile,
  CodeforcesProfile,
} from '@/data/static_link'
import { BASE_URL } from '@/constants/url'

export function PersonJsonLd() {
  const personData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Shardendu Mishra',
    email: 'shardendumishra01@gmail.com',
    // ... hardcoded data
  }
}
```

**After:**

```typescript
import {
  personalInfo,
  socialLinks,
  alumniOf,
  professionalInfo
} from '@/data/static'
import { BASE_URL } from '@/constants/url'

export function PersonJsonLd() {
  const personData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${BASE_URL}/#person`,
    name: personalInfo.name,
    email: personalInfo.email,
    image: {
      '@type': 'ImageObject',
      url: `${BASE_URL}${personalInfo.image.profile}`,
      width: personalInfo.image.width,
      height: personalInfo.image.height,
    },
    sameAs: [
      socialLinks.linkedin.url,
      socialLinks.github.personal,
      socialLinks.twitter.url,
      socialLinks.youtube.url,
      socialLinks.leetcode.url,
    ],
    jobTitle: personalInfo.jobTitle,
    knowsAbout: professionalInfo.knowsAbout,
    alumniOf: alumniOf,
    address: {
      '@type': 'PostalAddress',
      addressLocality: personalInfo.address.locality,
      addressRegion: personalInfo.address.region,
      addressCountry: personalInfo.address.country,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personData) }}
    />
  )
}
```

---

## Example 3: Update Education Component

### File: `src/components/main/education.tsx`

**Before:**

```typescript
import { resumeLink } from '@/data/static_link'

const educationData = {
  CollegeBatch: '2023-2027',
  CollegeWebsite: 'https://www.iiitdwd.ac.in/',
  CollegeLocation: 'Dharwad, Karnataka, India',
  CollegeName: 'Indian Institute of Information Technology, Dharwad',
  // ... more hardcoded data
}

const EducationSection = () => {
  return (
    <div>
      <h1>{educationData.CollegeName}</h1>
      <p>{educationData.CollegeBatch}</p>
      <a href={resumeLink}>Download Resume</a>
    </div>
  )
}
```

**After:**

```typescript
import { educationData, socialLinks } from '@/data/static'

const EducationSection = () => {
  return (
    <div>
      <h1>{educationData.college.name}</h1>
      <p>{educationData.college.batch}</p>
      <p>{educationData.college.location}</p>
      <a href={educationData.college.website} target="_blank">
        Visit College Website
      </a>
      <a href={socialLinks.resume}>Download Resume</a>

      {/* School section */}
      <h2>{educationData.school.name}</h2>
      <p>Class 12th: {educationData.school.class12.percentage}</p>
      <p>Stream: {educationData.school.class12.stream}</p>

      {/* Languages */}
      <div>
        <h3>Languages</h3>
        {educationData.languages.map((lang) => (
          <span key={lang}>{lang}</span>
        ))}
      </div>
    </div>
  )
}
```

---

## Example 4: Update Sidebar Component

### File: `src/components/extra/sidebar.tsx`

**Before:**

```typescript
import { navItems } from '@/data/static_link'

export function DesktopSidebar({ activeSection }: Props) {
  return (
    <nav>
      {navItems.map((item) => (
        <a key={item.href} href={item.href}>
          <item.icon className="w-5 h-5" />
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  )
}
```

**After (No changes needed!):**

```typescript
import { navItems } from '@/data/static'

export function DesktopSidebar({ activeSection }: Props) {
  return (
    <nav>
      {navItems.map((item) => (
        <a key={item.href} href={item.href}>
          <item.icon className="w-5 h-5" />
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  )
}
```

---

## Example 5: Update Hero Component

### File: `src/components/main/hero.tsx`

**Before:**

```typescript
export default function HeroSection() {
  return (
    <div>
      <h1>Hi, I'm Shardendu Mishra</h1>
      <p>Software Developer passionate about Go and React</p>
    </div>
  )
}
```

**After:**

```typescript
import { heroData, personalInfo } from '@/data/static'

export default function HeroSection() {
  return (
    <div>
      <h1>
        {heroData.greeting} {personalInfo.name}
      </h1>
      <div>
        {heroData.titles.map((title, index) => (
          <span key={index}>{title}</span>
        ))}
      </div>
      <p>{personalInfo.description}</p>

      {/* CTA Buttons */}
      <div>
        <a href={heroData.cta.primary.href}>
          {heroData.cta.primary.text}
        </a>
        <a href={heroData.cta.secondary.href}>
          {heroData.cta.secondary.text}
        </a>
      </div>
    </div>
  )
}
```

---

## Example 6: Update Contact Component

### File: `src/components/main/contact.tsx`

**Before:**

```typescript
import { GitHubProject, LinkedInProfile } from '@/data/static_link'

export default function ContactSection() {
  return (
    <div>
      <h2>Contact Me</h2>
      <a href="mailto:shardendumishra01@gmail.com">Email</a>
      <a href={GitHubProject}>GitHub</a>
      <a href={LinkedInProfile}>LinkedIn</a>
    </div>
  )
}
```

**After:**

```typescript
import { contactInfo, socialLinks } from '@/data/static'

export default function ContactSection() {
  return (
    <div>
      <h2>Contact Me</h2>
      <p>Status: {contactInfo.availability.status}</p>
      <p>{contactInfo.availability.message}</p>

      <div>
        <a href={`mailto:${contactInfo.email}`}>
          Email: {contactInfo.email}
        </a>
        <a href={socialLinks.github.personal}>
          GitHub: {socialLinks.github.username}
        </a>
        <a href={socialLinks.linkedin.url}>
          LinkedIn
        </a>
        <a href={socialLinks.twitter.url}>
          Twitter: {socialLinks.twitter.handle}
        </a>
      </div>

      <p>Working Hours: {contactInfo.workingHours.preferredHours}</p>
      <p>Timezone: {contactInfo.workingHours.timezone}</p>
    </div>
  )
}
```

---

## Example 7: Update Footer Component

### File: `src/components/main/FooterSection.tsx`

**Before:**

```typescript
export default function FooterSection() {
  return (
    <footer>
      <p>© 2024 Shardendu Mishra. All rights reserved.</p>
      <div>
        <a href="/">Home</a>
        <a href="/projects">Projects</a>
        <a href="/blog">Blog</a>
      </div>
    </footer>
  )
}
```

**After:**

```typescript
import { footerData, socialLinks } from '@/data/static'

export default function FooterSection() {
  return (
    <footer>
      <p>{footerData.copyright.message}</p>

      {/* Footer Sections */}
      <div>
        {footerData.sections.map((section) => (
          <div key={section.title}>
            <h3>{section.title}</h3>
            <ul>
              {section.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Legal Links */}
      <div>
        {footerData.legal.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>

      {/* Built With */}
      <p>{footerData.builtWith.message}</p>
    </footer>
  )
}
```

---

## Example 8: Update Layout Metadata

### File: `src/app/layout.tsx`

**Before:**

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shardendu Mishra | Software Developer',
  description: 'Software Developer passionate about Go and React',
  keywords: ['software developer', 'go', 'react'],
}
```

**After:**

```typescript
import type { Metadata } from 'next'
import { seoMetadata, personalInfo } from '@/data/static'

export const metadata: Metadata = {
  title: seoMetadata.pages.home.title,
  description: seoMetadata.pages.home.description,
  keywords: [
    ...seoMetadata.keywords.general,
    ...seoMetadata.keywords.technologies,
    ...seoMetadata.keywords.skills,
  ],
  authors: [{ name: personalInfo.name, url: seoMetadata.baseUrl }],
  creator: personalInfo.name,
  openGraph: {
    title: seoMetadata.pages.home.title,
    description: seoMetadata.pages.home.description,
    url: seoMetadata.baseUrl,
    siteName: seoMetadata.siteName,
    images: [
      {
        url: seoMetadata.baseUrl + personalInfo.image.ogImage,
        width: personalInfo.image.width,
        height: personalInfo.image.height,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: seoMetadata.pages.home.title,
    description: seoMetadata.pages.home.description,
    creator: seoMetadata.author.twitter,
    images: [seoMetadata.baseUrl + personalInfo.image.ogImage],
  },
}
```

---

## Example 9: Custom Icons Usage

**Before:**

```typescript
import { GoLangIcon, FedoraIcon } from '@/data/static_link'

export function TechStack() {
  return (
    <div>
      <GoLangIcon className="h-16 w-16 text-blue-500" />
      <FedoraIcon className="h-12 w-12" />
    </div>
  )
}
```

**After (No changes needed!):**

```typescript
import { GoLangIcon, FedoraIcon } from '@/data/static'

export function TechStack() {
  return (
    <div>
      <GoLangIcon className="h-16 w-16 text-blue-500" />
      <FedoraIcon className="h-12 w-12" />
    </div>
  )
}
```

---

## Example 10: Using Theme Configuration

**New Feature:**

```typescript
import { themeConfig } from '@/data/static'

export function LanguageChart({ language }: { language: string }) {
  const color = themeConfig.languageColors[language] || themeConfig.colors.primary

  return (
    <div style={{ backgroundColor: color }}>
      {language}
    </div>
  )
}
```

---

## Quick Migration Checklist

For each component file:

1. [ ] Find all imports from `@/data/static_link`
2. [ ] Check if data is hardcoded in the component
3. [ ] Replace imports with `@/data/static`
4. [ ] Update variable references to use new structure
5. [ ] Test the component
6. [ ] Remove hardcoded data from component

---

## Search & Replace Patterns

Use these patterns to quickly update imports:

### Pattern 1: Update imports

```bash
# Find
from '@/data/static_link'

# Replace with
from '@/data/static'
```

### Pattern 2: Update social links

```bash
# Find
GitHubProject

# Replace with
socialLinks.github.personal
```

### Pattern 3: Update personal info

```bash
# Find hardcoded
'Shardendu Mishra'

# Replace with
personalInfo.name
```

---

## Testing After Migration

After updating a component:

1. **Visual Check**: Load the page and verify it looks correct
2. **Console Check**: Check browser console for errors
3. **Link Check**: Click all links to ensure they work
4. **TypeScript Check**: Run `npm run type-check` or `tsc --noEmit`
5. **Build Check**: Run `npm run build` to ensure no build errors

---

## Common Issues & Solutions

### Issue 1: Import Error

```
Error: Cannot find module '@/data/static'
```

**Solution:** Ensure the file is named `static.tsx` (not `static.ts`)

### Issue 2: Type Error

```
Error: Property 'github' does not exist
```

**Solution:** Use `socialLinks.github.personal` instead of `socialLinks.github`

### Issue 3: Undefined Data

```
Error: Cannot read property 'name' of undefined
```

**Solution:** Check that you're accessing the correct nested property

---

## Need Help?

- Check `src/data/README.md` for detailed documentation
- Review `src/data/static.tsx` to see all available data
- Look at `src/data/types.data.ts` for type definitions
- Follow examples in this file

Happy migrating! 🚀
