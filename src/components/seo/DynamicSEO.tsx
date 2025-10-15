import { Project } from '@/data/types.data'
import { BASE_URL } from '@/constants/url'

interface ProjectSEOProps {
  project: Project
  baseUrl?: string
}

export function generateProjectMetadata(project: Project, baseUrl = BASE_URL) {
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

export function ProjectPageJsonLd({ project, baseUrl = BASE_URL }: ProjectSEOProps) {
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


