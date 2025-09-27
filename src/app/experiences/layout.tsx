import { LoadingState } from '@/components/experience/load-error'
import { Suspense } from 'react'
import { BASE_URL } from '@/constants/url'

export const metadata = {
  title: 'Experiences | Mishra Shardendu Portfolio',
  description:
    'Explore the professional experiences and roles held by Mishra Shardendu, including responsibilities and accomplishments.',
  openGraph: {
    title: 'Experiences | Mishra Shardendu Portfolio',
    description:
      'Explore the professional experiences and roles held by Mishra Shardendu, including responsibilities and accomplishments.',
    url: `${BASE_URL}/experiences`,
    type: 'website',
    siteName: 'Shardendu Mishra Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Experiences | Mishra Shardendu Portfolio',
    description:
      'Explore the professional experiences and roles held by Mishra Shardendu, including responsibilities and accomplishments.',
  },
}

export default function ExperiencesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<LoadingState />}>{children}</Suspense>
    </>
  )
}
