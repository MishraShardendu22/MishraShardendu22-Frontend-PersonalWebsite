import { ReactNode } from 'react'
import { BASE_URL } from '@/constants/url'

export const metadata = {
  title: 'Admin | Projects | Mishra Shardendu Portfolio',
  description: 'Admin panel for managing projects in the portfolio.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: 'Admin | Projects | Mishra Shardendu Portfolio',
    description: 'Admin panel for managing projects in the portfolio.',
    url: `${BASE_URL}/admin/projects`,
    type: 'website',
    siteName: 'Shardendu Mishra Portfolio',
  },
  twitter: {
    card: 'summary',
    title: 'Admin | Projects | Mishra Shardendu Portfolio',
    description: 'Admin panel for managing projects in the portfolio.',
  },
}

export default function AdminProjectsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
