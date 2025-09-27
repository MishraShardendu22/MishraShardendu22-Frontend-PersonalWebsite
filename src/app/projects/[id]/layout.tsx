import { projectsAPI } from '../../../util/apiResponse.util'
import { Metadata } from 'next'
import { ReactNode } from 'react'
import { BASE_URL } from '@/constants/url'

interface Props {
  params: Promise<{ id: string }>
  children: ReactNode
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  try {
    const { id } = await params
    const response = await projectsAPI.getProjectById(id)
    const project = response.data

    if (!project) {
      return {
        title: 'Project Not Found | Shardendu Mishra',
        description: 'The requested project could not be found.',
      }
    }

    return {
      title: `${project.project_name} | Project | Shardendu Mishra Portfolio`,
      description: project.small_description || 'View this project by Shardendu Mishra',
      openGraph: {
        title: `${project.project_name} | Project | Shardendu Mishra Portfolio`,
        description: project.small_description || 'View this project by Shardendu Mishra',
        url: `${BASE_URL}/projects/${id}`,
        type: 'article',
        siteName: 'Shardendu Mishra Portfolio',
        images: project.images ? project.images.map((img) => ({ url: img })) : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${project.project_name} | Project | Shardendu Mishra Portfolio`,
        description: project.small_description || 'View this project by Shardendu Mishra',
        images: project.images || [],
      },
    }
  } catch (error) {
    console.error('Error generating metadata for project:', error)
    return {
      title: 'Project | Shardendu Mishra',
      description: 'View projects by Shardendu Mishra',
    }
  }
}

export default function ProjectDetailLayout({ children }: Props) {
  return <>{children}</>
}
