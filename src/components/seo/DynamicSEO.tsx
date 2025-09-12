import { Project } from '@/data/types.data'

interface ProjectSEOProps {
  project: Project
  baseUrl?: string
}

export function generateProjectMetadata(
  project: Project,
  baseUrl = 'https://mishrashardendu22.is-a.dev'
) {
  const projectUrl = `${baseUrl}/projects/${project.inline?.id || ''}`

  return {
    title: `${project.project_name} | Shardendu Mishra`,
    description: project.small_description,
    keywords: [
      project.project_name,
      'Shardendu Mishra',
      'Software Project',
      'Portfolio',
      ...(project.skills || []),
      'Programming',
      'Development',
      'Open Source',
    ],
    openGraph: {
      title: `${project.project_name} | Shardendu Mishra`,
      description: project.small_description,
      url: projectUrl,
      type: 'article',
      images: project.images || ['/og-image.png'],
      article: {
        author: 'Shardendu Mishra',
        publishedTime: project.inline?.created_at,
        modifiedTime: project.inline?.updated_at,
        tags: project.skills || [],
      },
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.project_name} | Shardendu Mishra`,
      description: project.small_description,
      images: project.images || ['/og-image.png'],
      creator: '@Shardendu_M',
    },
    alternates: {
      canonical: projectUrl,
    },
  }
}

export function ProjectPageJsonLd({
  project,
  baseUrl = 'https://mishrashardendu22.is-a.dev',
}: ProjectSEOProps) {
  const projectUrl = `${baseUrl}/projects/${project.inline?.id || ''}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': projectUrl,
    name: project.project_name,
    description: project.small_description,
    url: projectUrl,
    creator: {
      '@type': 'Person',
      '@id': `${baseUrl}/#person`,
      name: 'Shardendu Mishra',
    },
    author: {
      '@type': 'Person',
      '@id': `${baseUrl}/#person`,
      name: 'Shardendu Mishra',
    },
    dateCreated: project.inline?.created_at,
    dateModified: project.inline?.updated_at,
    keywords: project.skills?.join(', '),
    image: project.images || [],
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      name: 'Shardendu Mishra Portfolio',
    },
    mainEntity: {
      '@type': 'SoftwareApplication',
      name: project.project_name,
      description: project.small_description,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Cross-platform',
      programmingLanguage: project.skills || [],
      downloadUrl: project.project_repository,
      codeRepository: project.project_repository,
      author: {
        '@type': 'Person',
        name: 'Shardendu Mishra',
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function BlogPostJsonLd({
  title,
  description,
  slug,
  publishedDate,
  modifiedDate,
  tags = [],
  baseUrl = 'https://mishrashardendu22.is-a.dev',
}: {
  title: string
  description: string
  slug: string
  publishedDate: string
  modifiedDate?: string
  tags?: string[]
  baseUrl?: string
}) {
  const postUrl = `${baseUrl}/blog/${slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': postUrl,
    headline: title,
    description: description,
    url: postUrl,
    datePublished: publishedDate,
    dateModified: modifiedDate || publishedDate,
    author: {
      '@type': 'Person',
      '@id': `${baseUrl}/#person`,
      name: 'Shardendu Mishra',
    },
    publisher: {
      '@type': 'Person',
      '@id': `${baseUrl}/#person`,
      name: 'Shardendu Mishra',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    keywords: tags.join(', '),
    articleSection: 'Technology',
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'Blog',
      '@id': `${baseUrl}/blog`,
      name: 'Shardendu Mishra Blog',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
