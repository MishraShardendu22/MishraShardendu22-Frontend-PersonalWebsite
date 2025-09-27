import { Project } from '../../data/types.data'
import { BASE_URL } from '@/constants/url'

interface ProjectJsonLdProps {
  project: Project
}

export function ProjectJsonLd({ project }: ProjectJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.project_name,
    description: project.small_description,
    url: `${BASE_URL}/projects/${project.project_name}`,
    creator: {
      '@type': 'Person',
      name: 'Shardendu Mishra',
    },
    dateCreated: project.inline?.created_at,
    keywords: project.skills,
    image: project.images || [],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
