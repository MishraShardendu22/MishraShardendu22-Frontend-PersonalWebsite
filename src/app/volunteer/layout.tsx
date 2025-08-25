import { LoadingState } from '@/components/experience/load-error'
import { Suspense } from 'react'

export const metadata = {
  title: 'Volunteer Experience | Mishra Shardendu Portfolio',
  description:
    'Explore the volunteer experiences and community contributions by Mishra Shardendu, including social impact work and community service.',
  openGraph: {
    title: 'Volunteer Experience | Mishra Shardendu Portfolio',
    description:
      'Explore the volunteer experiences and community contributions by Mishra Shardendu, including social impact work and community service.',
    url: 'https://mishrashardendu22.is-a.dev/volunteer',
    type: 'website',
    siteName: 'Shardendu Mishra Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Volunteer Experience | Mishra Shardendu Portfolio',
    description:
      'Explore the volunteer experiences and community contributions by Mishra Shardendu, including social impact work and community service.',
  },
}

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<LoadingState />}>{children}</Suspense>
    </>
  )
}
