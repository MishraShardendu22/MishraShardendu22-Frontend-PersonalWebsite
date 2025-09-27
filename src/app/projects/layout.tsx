import { BASE_URL } from '@/constants/url'

export const metadata = {
  title: 'Projects | Mishra Shardendu Portfolio',
  description:
    'Discover projects completed by Mishra Shardendu, featuring technologies used, goals, and outcomes.',
  openGraph: {
    title: 'Projects | Mishra Shardendu Portfolio',
    description:
      'Discover projects completed by Mishra Shardendu, featuring technologies used, goals, and outcomes.',
    url: `${BASE_URL}/projects`,
    type: 'website',
    siteName: 'Shardendu Mishra Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | Mishra Shardendu Portfolio',
    description:
      'Discover projects completed by Mishra Shardendu, featuring technologies used, goals, and outcomes.',
  },
}

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
