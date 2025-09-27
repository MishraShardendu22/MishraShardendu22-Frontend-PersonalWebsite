import { ReactNode } from 'react'
import { certificationsAPI } from '../../../util/apiResponse.util'
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
    const response = await certificationsAPI.getCertificationById(id)
    const cert = response.data

    if (!cert) {
      return {
        title: 'Certification Not Found | Shardendu Mishra',
        description: 'The requested certification could not be found.',
      }
    }

    return {
      title: `${cert.title} | Certification | Shardendu Mishra Portfolio`,
      description: cert.description || 'View this certification by Shardendu Mishra',
      openGraph: {
        title: `${cert.title} | Certification | Shardendu Mishra Portfolio`,
        description: cert.description || 'View this certification by Shardendu Mishra',
        url: `${BASE_URL}/certifications/${id}`,
        type: 'article',
        siteName: 'Shardendu Mishra Portfolio',
        images: cert.images ? cert.images.map((img) => ({ url: img })) : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${cert.title} | Certification | Shardendu Mishra Portfolio`,
        description: cert.description || 'View this certification by Shardendu Mishra',
        images: cert.images || [],
      },
    }
  } catch (error) {
    console.error('Error generating metadata for certification:', error)
    return {
      title: 'Certification | Shardendu Mishra',
      description: 'View certifications by Shardendu Mishra',
    }
  }
}

export default function CertificationDetailLayout({ children }: Props) {
  return <>{children}</>
}
