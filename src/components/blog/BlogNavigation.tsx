'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BookOpen, BarChart3, Plus, LogOut, Menu, X, Glasses, User2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/authClient'

const OWNER_EMAIL = 'mishrashardendu22@gmail.com'

const navigationItems = [
  {
    name: 'Read Blogs',
    href: '/blog',
    icon: Glasses,
    description: 'Read the latest blog posts',
    showForAll: true,
  },
  {
    name: 'Dashboard',
    href: '/blog/dashboard',
    icon: BookOpen,
    description: 'Manage your blog posts',
    showForAll: false,
  },
  {
    name: 'Analytics',
    href: '/blog/stats',
    icon: BarChart3,
    description: 'View blog statistics',
    showForAll: false,
  },
  {
    name: 'Create Post',
    href: '/blog/create',
    icon: Plus,
    description: 'Write a new blog post',
    showForAll: false,
  },
  {
    name: 'Main Website',
    href: '/',
    icon: User2Icon,
    description: 'Go back to the main website',
    showForAll: true,
  },
]

export default function BlogNavigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()
  const session = authClient.useSession()

  const isOwner = useMemo(() => {
    const userEmail = session?.data?.user?.email
    return userEmail === OWNER_EMAIL
  }, [session?.data?.user?.email])

  const visibleNavItems = useMemo(() => {
    const filtered = navigationItems.filter((item) => {
      if (item.showForAll) return true
      return isOwner
    })
    return filtered
  }, [isOwner])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await authClient.signOut()
      router.push('/blog')
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-background border-border"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background">
          <div className="flex flex-col justify-center items-center h-full space-y-3 p-6">
            {visibleNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 w-full max-w-xs p-4 rounded-lg border transition-colors duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card border-border hover:border-primary/50'
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{item.name}</div>
                    <div className="text-xs opacity-80">{item.description}</div>
                  </div>
                </Link>
              )
            })}

            {session.data ? (
              <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
                variant="outline"
                className="w-full max-w-xs border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                {isLoggingOut ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                ) : (
                  <LogOut className="h-4 w-4 mr-2" />
                )}
                {isLoggingOut ? 'Signing out...' : 'Sign Out'}
              </Button>
            ) : (
              <Button
                onClick={async () => {
                  try {
                    await authClient.signIn.social({ provider: 'google' })
                    router.push('/blog')
                  } catch (error) {
                    console.error('Login error:', error)
                  }
                }}
                className="w-full max-w-xs"
              >
                Login with Google
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50">
        <div className="flex flex-col flex-grow bg-background border-r">
          <div className="flex items-center gap-3 p-6 border-b">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-lg text-foreground">Blog Hub</h1>
              <p className="text-sm text-muted-foreground">Share your thoughts</p>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {visibleNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs opacity-70 truncate">{item.description}</div>
                  </div>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t">
            {session.data ? (
              <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
                variant="outline"
                className="w-full border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                {isLoggingOut ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                ) : (
                  <LogOut className="h-4 w-4 mr-2" />
                )}
                {isLoggingOut ? 'Signing out...' : 'Sign Out'}
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground text-center">
                  Please log in to continue
                </p>
                <Button
                  onClick={async () => {
                    try {
                      await authClient.signIn.social({
                        provider: 'google',
                        callbackURL: '/blog',
                        errorCallbackURL: '/login?error=oauth',
                      })
                    } catch (error) {
                      console.error('Login error:', error)
                    }
                  }}
                  className="w-full"
                >
                  Login with Google
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
