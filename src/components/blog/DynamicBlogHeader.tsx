'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { BookOpen, Plus, ArrowLeft, BarChart3, Eye, Save, PenSquare, Home } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface DynamicBlogHeaderProps {
  isOwner?: boolean
  onPreview?: () => void
  onPublish?: () => void
  isPublishing?: boolean
  canPublish?: boolean
  customTitle?: string
  customSubtitle?: string
}

interface HeaderConfig {
  title: string
  subtitle: string
  icon: LucideIcon
  showCreateButton: boolean
  showBackButton: boolean
  customButton?: {
    label: string
    icon: LucideIcon
    onClick: () => void
    variant?: 'default' | 'outline'
  }
}

export const DynamicBlogHeader: React.FC<DynamicBlogHeaderProps> = ({
  isOwner = false,
  onPreview,
  onPublish,
  isPublishing = false,
  canPublish = true,
  customTitle,
  customSubtitle,
}) => {
  const pathname = usePathname()
  const router = useRouter()

  const getHeaderConfig = (): HeaderConfig => {
    if (pathname === '/blog') {
      return {
        title: customTitle || 'All Blogs',
        subtitle: customSubtitle || 'Discover amazing stories and insights',
        icon: BookOpen,
        showCreateButton: isOwner,
        showBackButton: false,
      }
    }

    if (pathname === '/blog/dashboard') {
      return {
        title: customTitle || 'Blog Dashboard',
        subtitle: customSubtitle || 'Manage and track your content',
        icon: BarChart3,
        showCreateButton: isOwner,
        showBackButton: false,
      }
    }

    if (pathname === '/blog/create') {
      return {
        title: customTitle || 'Create New Post',
        subtitle: customSubtitle || 'Share your thoughts',
        icon: PenSquare,
        showCreateButton: false,
        showBackButton: true,
      }
    }

    if (pathname === '/blog/stats') {
      return {
        title: customTitle || 'Blog Analytics',
        subtitle: customSubtitle || 'Performance insights and metrics',
        icon: BarChart3,
        showCreateButton: false,
        showBackButton: false,
        customButton: {
          label: 'Dashboard',
          icon: Home,
          onClick: () => router.push('/blog/dashboard'),
          variant: 'outline',
        },
      }
    }

    if (pathname.startsWith('/blog/') && pathname !== '/blog') {
      return {
        title: customTitle || 'Blog Post',
        subtitle: customSubtitle || 'Reading mode',
        icon: BookOpen,
        showCreateButton: false,
        showBackButton: true,
      }
    }

    return {
      title: customTitle || 'Blog',
      subtitle: customSubtitle || 'Welcome to the blog',
      icon: BookOpen,
      showCreateButton: isOwner,
      showBackButton: false,
    }
  }

  const config = getHeaderConfig()
  const Icon = config.icon
  const isCreatePage = pathname === '/blog/create'

  return (
    <header className="border-b bg-background sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto min-w-0">
            {config.showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            )}

            <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-initial">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="min-w-0 flex-1 sm:flex-initial">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                  {config.title}
                </h1>
                <p className="text-sm text-muted-foreground truncate">{config.subtitle}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isCreatePage && onPreview && onPublish ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPreview}
                  className="flex-1 sm:flex-initial"
                >
                  <Eye className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Preview</span>
                </Button>
                <Button
                  size="sm"
                  onClick={onPublish}
                  disabled={isPublishing || !canPublish}
                  className="flex-1 sm:flex-initial"
                >
                  <Save className="w-4 h-4 sm:mr-2" />
                  <span>{isPublishing ? 'Publishing...' : 'Publish'}</span>
                </Button>
              </>
            ) : config.customButton ? (
              <Button
                variant={config.customButton.variant || 'outline'}
                size="sm"
                onClick={config.customButton.onClick}
                className="gap-2"
              >
                <config.customButton.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{config.customButton.label}</span>
              </Button>
            ) : config.showCreateButton ? (
              <Button onClick={() => router.push('/blog/create')} className="gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Post</span>
                <span className="sm:hidden">Create</span>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}
