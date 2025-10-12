import { ReactNode } from 'react'
import { BASE_URL } from '@/constants/url'

export const metadata = {
  title: 'Kanban | Mishra Shardendu Portfolio',
  description: 'Manage your tasks and projects in the Kanban board.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: 'Kanban | Mishra Shardendu Portfolio',
    description: 'Manage your tasks and projects in the Kanban board.',
    url: `${BASE_URL}/admin/kanban`,
    type: 'website',
    siteName: 'Shardendu Mishra Portfolio',
  },
  twitter: {
    card: 'summary',
    title: 'Kanban Login | Mishra Shardendu Portfolio',
    description: 'Login to the admin panel of the Mishra Shardendu portfolio.',
  },
}

export default function AdminKanbanLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
