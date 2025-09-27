import { ReactNode } from 'react'
import { volunteerExperiencesAPI } from '../../../util/apiResponse.util'
import { Metadata } from 'next'
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
    const response = await volunteerExperiencesAPI.getVolunteerExperienceById(id)
    const exp = response.data

    if (!exp) {
      return {
        title: 'Volunteer Experience Not Found | Shardendu Mishra',
        description: 'The requested volunteer experience could not be found.',
      }
    }

    const position = exp.volunteer_time_line?.[0]?.position ?? ''

    return {
      title: `${position} at ${exp.organisation} | Volunteer Experience | Shardendu Mishra Portfolio`,
      description: exp.description || 'View this volunteer experience by Shardendu Mishra',
      openGraph: {
        title: `${position} at ${exp.organisation} | Volunteer Experience | Shardendu Mishra Portfolio`,
        description: exp.description || 'View this volunteer experience by Shardendu Mishra',
        url: `${BASE_URL}/volunteer/${id}`,
        type: 'article',
        siteName: 'Shardendu Mishra Portfolio',
        images: exp.images ? exp.images.map((img: string) => ({ url: img })) : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${position} at ${exp.organisation} | Volunteer Experience | Shardendu Mishra Portfolio`,
        description: exp.description || 'View this volunteer experience by Shardendu Mishra',
        images: exp.images || [],
      },
    }
  } catch (error) {
    console.error('Error generating metadata for volunteer experience:', error)
    return {
      title: 'Volunteer Experience | Shardendu Mishra',
      description: 'View volunteer experiences by Shardendu Mishra',
    }
  }
}

export default function VolunteerDetailLayout({ children }: Props) {
  return <>{children}</>
}
