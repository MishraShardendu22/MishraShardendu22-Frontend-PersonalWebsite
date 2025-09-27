import { ReactNode } from 'react'
import { experiencesAPI } from '../../../util/apiResponse.util'
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
    const response = await experiencesAPI.getExperienceById(id)
    const exp = response.data

    if (!exp) {
      return {
        title: 'Experience Not Found | Shardendu Mishra',
        description: 'The requested experience could not be found.',
      }
    }

    const position = exp.experience_time_line?.[0]?.position ?? ''
    const start = exp.experience_time_line?.[0]?.start_date ?? ''
    const end = exp.experience_time_line?.[0]?.end_date ?? ''

    return {
      title: `${position} at ${exp.company_name} | Experience | Shardendu Mishra Portfolio`,
      description: exp.description || 'View this experience by Shardendu Mishra',
      openGraph: {
        title: `${position} at ${exp.company_name} | Experience | Shardendu Mishra Portfolio`,
        description: exp.description || 'View this experience by Shardendu Mishra',
        url: `${BASE_URL}/experiences/${id}`,
        type: 'article',
        siteName: 'Shardendu Mishra Portfolio',
        images: exp.images ? exp.images.map((img) => ({ url: img })) : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${position} at ${exp.company_name} | Experience | Shardendu Mishra Portfolio`,
        description: exp.description || 'View this experience by Shardendu Mishra',
        images: exp.images || [],
      },
    }
  } catch (error) {
    console.error('Error generating metadata for experience:', error)
    return {
      title: 'Experience | Shardendu Mishra',
      description: 'View experiences by Shardendu Mishra',
    }
  }
}
export default function ExperienceDetailLayout({ children }: Props) {
  return <>{children}</>
}
