import { LoadingState } from '@/components/certificate/load-error'
import { Suspense } from 'react'
import { BASE_URL } from '@/constants/url'

export const metadata = {
  title: 'Certifications | Mishra Shardendu Portfolio',
  description:
    'View the certifications and achievements earned by Mishra Shardendu in various domains.',
  openGraph: {
    title: 'Certifications | Mishra Shardendu Portfolio',
    description:
      'View the certifications and achievements earned by Mishra Shardendu in various domains.',
    url: `${BASE_URL}/certifications`,
    type: 'website',
    siteName: 'Shardendu Mishra Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Certifications | Mishra Shardendu Portfolio',
    description:
      'View the certifications and achievements earned by Mishra Shardendu in various domains.',
  },
}

export default function CertificationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<LoadingState />}>{children}</Suspense>
    </>
  )
}
