'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BookOpen, Plus, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { blogsService } from '@/services/blogs'
import { Blog } from '@/services/types'
import { authClient } from '@/lib/authClient'
import BlogCard from '@/components/blog/BlogCard'

const OWNER_EMAIL = 'mishrashardendu22@gmail.com'

const BlogPage = () => {
  const router = useRouter()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const session = authClient.useSession()

  // Check if current user is the owner
  const isOwner = useMemo(() => {
    return session?.data?.user?.email === OWNER_EMAIL
  }, [session?.data?.user?.email])

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      setError('')

      const startTime = Date.now()
      const minLoadingTime = 800

      const response = await blogsService.getBlogs()

      if (response.success && response.data) {
        setBlogs(Array.isArray(response.data) ? response.data : [])
      } else {
        setError(response.error || 'Failed to fetch blogs')
        console.error('Blog fetch failed:', response.error)
      }

      const elapsedTime = Date.now() - startTime
      if (elapsedTime < minLoadingTime) {
        await new Promise((resolve) => setTimeout(resolve, minLoadingTime - elapsedTime))
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
      setError('Failed to load blogs')
    } finally {
      setLoading(false)
      setInitialLoad(false)
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

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const showLoadingSkeleton = initialLoad && loading && blogs.length === 0

  return (
    <div className="space-y-6 md:space-y-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 md:mb-10">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 sm:left-5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
          <Input
            placeholder="Search blogs by title, content, or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 sm:pl-14 pr-4 sm:pr-32 h-12 sm:h-14 bg-card/60 backdrop-blur-sm border-border/60 focus:border-primary/40 hover:border-border focus:ring-2 focus:ring-primary/10 rounded-xl text-sm sm:text-base text-foreground placeholder:text-muted-foreground transition-all duration-300 shadow-sm"
          />
          <div className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2">
            {loading && searchTerm ? (
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-muted-foreground bg-muted/80 px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-lg border border-border/60 shadow-sm">
                <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <span className="hidden sm:inline">Searching...</span>
              </div>
            ) : (
              <span className="text-xs font-semibold bg-primary/15 text-primary px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-primary/30 shadow-sm">
                {filteredBlogs.length} {filteredBlogs.length === 1 ? 'result' : 'results'}
              </span>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 md:mb-8 p-4 md:p-5 bg-destructive/10 border border-destructive/30 rounded-xl max-w-xl mx-auto shadow-sm">
          <p className="text-destructive text-sm text-center font-medium">{error}</p>
        </div>
      )}

      {loading && !showLoadingSkeleton && (
        <div className="mb-6 md:mb-8 text-center">
          <div className="inline-flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm text-muted-foreground bg-muted/30 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border border-border/50">
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <span className="font-medium">Updating blogs...</span>
          </div>
        </div>
      )}

      {showLoadingSkeleton ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm"
            >
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full animate-pulse ring-2 ring-border" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-20 sm:w-28 bg-muted/50 rounded animate-pulse" />
                    <div className="h-3 w-16 sm:w-20 bg-muted/50 rounded animate-pulse" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-5 sm:h-6 w-5/6 bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 rounded animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted/50 rounded animate-pulse" />
                    <div className="h-4 w-4/5 bg-muted/50 rounded animate-pulse" />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <div className="h-6 w-16 bg-primary/10 rounded-full animate-pulse" />
                  <div className="h-6 w-20 bg-primary/10 rounded-full animate-pulse" />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="h-8 w-16 bg-accent/10 rounded-full animate-pulse" />
                  <div className="h-9 w-24 sm:w-28 bg-muted/50 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-12 sm:py-16 md:py-24 px-4">
          <div className="relative w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-6 sm:mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/10 rounded-3xl blur-2xl animate-pulse"></div>
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/5 rounded-3xl flex items-center justify-center shadow-xl border border-primary/10">
              <BookOpen className="w-10 h-10 sm:w-14 sm:h-14 text-primary" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-heading text-foreground mb-3 sm:mb-4">
            {searchTerm ? 'No blogs found' : 'No blogs yet'}
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base mb-8 sm:mb-10 max-w-md mx-auto leading-relaxed px-4">
            {searchTerm
              ? 'Try adjusting your search terms or browse all blogs'
              : 'Create your first blog post to share your thoughts and insights with the world'}
          </p>
          {!searchTerm && isOwner && (
            <Button
              onClick={() => router.push('/blog/create')}
              className="h-11 sm:h-12 px-6 sm:px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl shadow-primary/20 transition-all duration-300 gap-2 sm:gap-2.5 rounded-xl text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Create First Post
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {filteredBlogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              onReadMore={(blogId) => router.push(`/blog/${blogId}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default BlogPage
