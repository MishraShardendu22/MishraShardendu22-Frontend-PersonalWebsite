'use client'
import { JSX, ReactNode, useMemo } from 'react'
import BlogNavigation from '@/components/blog/BlogNavigation'
import { DynamicBlogHeader, BlogHeaderProvider, useBlogHeader } from '@/components/blog'
import { authClient } from '@/lib/authClient'

const OWNER_EMAIL = 'mishrashardendu22@gmail.com'

function BlogLayoutContent({ children }: { children: ReactNode }): JSX.Element {
  const session = authClient.useSession()
  const headerContext = useBlogHeader()

  const isOwner = useMemo(() => {
    return session?.data?.user?.email === OWNER_EMAIL
  }, [session?.data?.user?.email])

  return (
    <div className="min-h-screen bg-background">
      <BlogNavigation />
      <div className="lg:pl-64">
        <DynamicBlogHeader
          isOwner={isOwner}
          customTitle={headerContext.title}
          customSubtitle={headerContext.subtitle}
          onPreview={headerContext.onPreview}
          onPublish={headerContext.onPublish}
          isPublishing={headerContext.isPublishing}
          canPublish={headerContext.canPublish}
        />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}

export default function Layout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <BlogHeaderProvider>
      <BlogLayoutContent>{children}</BlogLayoutContent>
    </BlogHeaderProvider>
  )
}
