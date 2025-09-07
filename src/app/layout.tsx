import './globals.css'
import { ThemeProvider } from 'next-themes'
import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import PWARegister from '@/components/extra/PWARegister'
import { SpeedInsights } from '@vercel/speed-insights/next'
import ToasterClient from '@/components/extra/ToasterClient'
import ThemeToggleClient from '@/components/extra/ThemeToggleClient'

export const metadata: Metadata = {
  title: {
    template: '%s | Shardendu Mishra',
    default: 'Shardendu Mishra | Software Developer and Engineer',
  },
  description:
    'Software Developer and Engineer passionate about building impactful applications with modern technologies. Specializing in Go, React, and cloud-native solutions.',
  keywords: [
    'Shardendu Mishra',
    'Software Developer and Engineer',
    'Go',
    'React',
    'Portfolio',
    'Software Engineer',
  ],
  authors: [{ name: 'Shardendu Mishra' }],
  creator: 'Shardendu Mishra',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/icons/icon-192.png',
    other: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        url: '/favicon.ico',
      },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mishrashardendu22.is-a.dev',
    title: 'Shardendu Mishra - Software Developer and Engineer',
    description:
      'Software Developer and Engineer passionate about building impactful applications with modern technologies.',
    siteName: 'Shardendu Mishra Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shardendu Mishra - Software Developer and Engineer',
    description:
      'Software Developer and Engineer passionate about building impactful applications with modern technologies.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Shardendu Portfolio',
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Shardendu Portfolio',
    'application-name': 'Shardendu Portfolio',
    'msapplication-TileColor': '#000000',
    'msapplication-config': '/browserconfig.xml',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background text-foreground">
            <div className="fixed top-4 right-4 z-50">
              <ThemeToggleClient />
            </div>
            {children}
            <ToasterClient />
            {/* <PWAInstallBanner /> */}
            <PWARegister />
            <Analytics />
            <SpeedInsights />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
