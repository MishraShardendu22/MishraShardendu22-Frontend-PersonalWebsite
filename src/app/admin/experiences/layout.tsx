import { ReactNode } from 'react'
import { BASE_URL } from '@/constants/url'

export const metadata = {
  title: 'Admin | Experiences | Mishra Shardendu Portfolio',
  description: 'Admin panel for managing professional experiences in the portfolio.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: 'Admin | Experiences | Mishra Shardendu Portfolio',
    description: 'Admin panel for managing professional experiences in the portfolio.',
    url: `${BASE_URL}/admin/experiences`,
    type: 'website',
    siteName: 'Shardendu Mishra Portfolio',
  },
  twitter: {
    card: 'summary',
    title: 'Admin | Experiences | Mishra Shardendu Portfolio',
    description: 'Admin panel for managing professional experiences in the portfolio.',
  },
}

export default function AdminExperiencesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
