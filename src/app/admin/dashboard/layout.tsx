import { ReactNode } from 'react'
import { BASE_URL } from '@/constants/url'

export const metadata = {
  title: 'Admin | Dashboard | Mishra Shardendu Portfolio',
  description: 'Admin dashboard for managing the Mishra Shardendu portfolio.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: 'Admin | Dashboard | Mishra Shardendu Portfolio',
    description: 'Admin dashboard for managing the Mishra Shardendu portfolio.',
    url: `${BASE_URL}/admin/dashboard`,
    type: 'website',
    siteName: 'Shardendu Mishra Portfolio',
  },
  twitter: {
    card: 'summary',
    title: 'Admin | Dashboard | Mishra Shardendu Portfolio',
    description: 'Admin dashboard for managing the Mishra Shardendu portfolio.',
  },
}

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
