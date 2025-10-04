'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BookOpen,
  Plus,
  Search,
  MessageCircle,
  ArrowRight,
  Trash2,
  BarChart3,
  AlertTriangle,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { blogsService } from '@/services/blogs'
import { Blog } from '@/services/types'
import { authClient } from '@/lib/authClient'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import toast from 'react-hot-toast'
import { StatCard } from '@/components/blog/StatCard'
import BlogCard from '@/components/blog/BlogCard'

const OWNER_EMAIL = 'mishrashardendu22@gmail.com'

const BlogDashboardPage = () => {
  const router = useRouter()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [error, setError] = useState('')
  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null)
  const session = authClient.useSession()

  // Access control - only allow owner to access this page
  useEffect(() => {
    if (session?.data?.user?.email && session.data.user.email !== OWNER_EMAIL) {
      router.push('/blog')
    }
  }, [session, router])

  // Fetch blogs on mount
  useEffect(() => {
    fetchBlogs()
  }, [])

  const currentUser = session.data?.user

  const isAuthor = (blogAuthorId: string) => {
    return currentUser?.id === blogAuthorId
  }

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await blogsService.getBlogs()

      if (response.success && response.data) {
        const blogsArray = Array.isArray(response.data) ? response.data : []
        setBlogs(blogsArray)
      } else {
        const errorMsg = response.error || 'Failed to fetch blogs'
        setError(errorMsg)
        console.error('Blog fetch failed:', errorMsg)
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
      setError('Failed to load blogs. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const sortBlogs = (blogs: Blog[]) => {
    switch (sortBy) {
      case 'newest':
        return [...blogs].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      case 'oldest':
        return [...blogs].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      case 'title':
        return [...blogs].sort((a, b) => a.title.localeCompare(b.title))
      case 'comments':
        return [...blogs].sort((a, b) => {
          const aComments = Array.isArray(a.comments) ? a.comments.length : a.comments || 0
          const bComments = Array.isArray(b.comments) ? b.comments.length : b.comments || 0
          return bComments - aComments
        })
      default:
        return blogs
    }
  }

  const filteredAndSortedBlogs = sortBlogs(
    blogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesTab = activeTab === 'all' || blog.tags?.includes(activeTab)
      return matchesSearch && matchesTab
    })
  )

  const getTotalStats = () => {
    const totalComments = blogs.reduce((sum, blog) => {
      const comments = Array.isArray(blog.comments) ? blog.comments.length : blog.comments || 0
      return sum + comments
    }, 0)

    return { totalComments }
  }

  const stats = getTotalStats()

  const handleDeleteBlog = async (blogId: string) => {
    try {
      setDeletingBlogId(blogId)
      const response = await blogsService.deleteBlog(blogId)

      if (response.success) {
        toast.success('Blog post deleted successfully')
        setBlogs(blogs.filter((blog) => String(blog.id) !== String(blogId)))
      } else {
        toast.error(response.error || 'Failed to delete blog post')
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
      toast.error('Failed to delete blog post')
    } finally {
      setDeletingBlogId(null)
    }
  }

  // Don't render dashboard if not the owner
  if (!session?.data?.user || session.data.user.email !== OWNER_EMAIL) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-destructive/20">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Access Denied</h2>
          <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
            You don&apos;t have permission to access the blog dashboard. This area is restricted to
            authorized users only.
          </p>
          <Button
            onClick={() => router.push('/blog')}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Blogs
          </Button>
        </div>
      </div>
    )
  }

  if (loading || session.isPending) {
    return (
      <div className="min-h-screen bg-background">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 w-48 bg-muted/50 rounded animate-pulse mb-2" />
              <div className="h-4 w-64 bg-muted/50 rounded animate-pulse" />
            </div>
            <div className="h-10 w-32 bg-muted/50 rounded-lg animate-pulse" />
          </div>

          <div className="flex space-x-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 w-20 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>

          <div className="max-w-2xl">
            <div className="h-10 w-full bg-muted/50 rounded-lg animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg">
                <div className="aspect-[16/10] bg-muted/50 relative overflow-hidden rounded-t-lg" />

                <div className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-muted/50 rounded-full animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-muted/50 rounded animate-pulse mb-1" />
                      <div className="h-3 w-16 bg-muted/50 rounded animate-pulse" />
                    </div>
                  </div>

                  <div className="h-6 w-3/4 bg-muted/50 rounded animate-pulse mb-2" />
                  <div className="h-4 w-full bg-muted/50 rounded animate-pulse mb-1" />
                  <div className="h-4 w-5/6 bg-muted/50 rounded animate-pulse mb-3" />

                  <div className="flex flex-wrap gap-1 mb-4">
                    <div className="h-5 w-12 bg-muted/50 rounded-full animate-pulse" />
                    <div className="h-5 w-16 bg-muted/50 rounded-full animate-pulse" />
                    <div className="h-5 w-14 bg-muted/50 rounded-full animate-pulse" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 bg-muted/50 rounded animate-pulse" />
                        <div className="h-3 w-8 bg-muted/50 rounded animate-pulse" />
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 bg-muted/50 rounded animate-pulse" />
                        <div className="h-3 w-8 bg-muted/50 rounded animate-pulse" />
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 bg-muted/50 rounded animate-pulse" />
                        <div className="h-3 w-8 bg-muted/50 rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="h-8 w-20 bg-muted/50 rounded-lg animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!session.data?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold font-heading text-foreground mb-2">
            Authentication Required
          </h2>
          <p className="text-foreground mb-6 text-sm">
            Please log in to access your blog dashboard.
          </p>
          <Button
            onClick={() => authClient.signIn.social({ provider: 'google' })}
            className="h-10 px-6"
          >
            Login with Google
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Stat Cards */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            title="Total Posts"
            value={blogs.length}
            description="Published articles"
            icon={BookOpen}
            variant="primary"
          />

          <StatCard
            title="Comments"
            value={stats.totalComments}
            description="User engagement"
            icon={MessageCircle}
            variant="accent"
          />
        </div>

        {/* Search and Filters */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search your blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 h-10 bg-background/60 border-border/70 focus:border-primary/50 rounded-lg text-sm transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 px-3 bg-background/60 border border-border/70 rounded-lg text-sm font-medium text-foreground focus:border-primary/50 focus:outline-none transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Alphabetical</option>
                <option value="comments">Most Comments</option>
              </select>

              <div className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-semibold border border-primary/20 whitespace-nowrap">
                {filteredAndSortedBlogs.length} of {blogs.length}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="inline-flex h-9 items-center justify-start rounded-lg bg-muted/50 p-1 text-foreground shadow-sm w-full">
                <TabsTrigger
                  value="all"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50"
                >
                  All Posts
                </TabsTrigger>
                <TabsTrigger
                  value="technology"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50"
                >
                  Technology
                </TabsTrigger>
                <TabsTrigger
                  value="lifestyle"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50"
                >
                  Lifestyle
                </TabsTrigger>
                <TabsTrigger
                  value="tutorial"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50"
                >
                  Tutorial
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsContent value={activeTab} className="mt-0">
          {filteredAndSortedBlogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-heading text-foreground mb-2">
                {searchTerm ? 'No blogs found' : 'No blogs yet'}
              </h3>
              <p className="text-foreground text-sm max-w-md mx-auto mb-6">
                {searchTerm
                  ? 'Try adjusting your search terms'
                  : 'Start your blogging journey by creating your first post'}
              </p>
              {!searchTerm && (
                <Button onClick={() => router.push('/blog/create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Post
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredAndSortedBlogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  onReadMore={(blogId) => router.push(`/blog/${blogId}`)}
                  customActions={
                    isAuthor(blog.authorId) ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 w-9 p-0 text-destructive"
                            disabled={deletingBlogId === String(blog.id)}
                          >
                            {deletingBlogId === String(blog.id) ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-destructive" />
                              Delete Blog Post
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete &quot;{blog.title}&quot;? This action
                              cannot be undone and will permanently remove the blog post and all its
                              associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteBlog(blog.id.toString())}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete Post
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : undefined
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default BlogDashboardPage
