import { ReactNode } from 'react'
import { volunteerExperiencesAPI } from '../../../util/apiResponse.util'

export async function generateMetadata({ params }: { params: any }) {
  const { id } = await params
  const response = await volunteerExperiencesAPI.getVolunteerExperienceById(id)
  const exp = response.data
  if (!exp) return {}
  const position = exp.volunteer_time_line?.[0]?.position ?? ''

  return {
    title: `${position} at ${exp.organisation} | Experience | Mishra Shardendu Portfolio`,
    description: exp.description,
    openGraph: {
      title: `${position} at ${exp.organisation} | Experience | Mishra Shardendu Portfolio`,
      description: exp.description,
      url: `https://mishrashardendu22.is-a.dev/experiences/${id}`,
      type: 'article',
      siteName: 'Shardendu Mishra Portfolio',
      images: exp.images ? exp.images.map((img) => ({ url: img })) : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${position} at ${exp.organisation} | Experience | Mishra Shardendu Portfolio`,
      description: exp.description,
      images: exp.images || [],
    },
  }
}

export default function ExperienceDetailLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
