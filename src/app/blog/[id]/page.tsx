'use client'

import { authClient } from '@/lib/authClient'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  ArrowLeft,
  MessageCircle,
  Share2,
  Calendar,
  Send,
  BookOpen,
  Clock,
  Check,
} from 'lucide-react'
import { blogsService } from '@/services/blogs'
import { Blog } from '@/services/types'
import ReactMarkdown from 'react-markdown'

interface Comment {
  id: number
  content: string
  createdAt: string
  user: {
    id: string
    email: string
    avatar: string
    name: string
  }
  userProfile: {
    firstName: string
    lastName: string
    avatar: string
  }
}

const BlogPostPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = React.use(params)
  const session = authClient.useSession()
  const router = useRouter()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [commentsCount, setCommentsCount] = useState(0)
  const [shareSuccess, setShareSuccess] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)

  // Reading progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100
      setReadingProgress(Math.min(progress, 100))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fetchBlogPost = useCallback(async () => {
    try {
      setLoading(true)
      const response = await blogsService.getBlogById(resolvedParams.id)
      if (response.success && response.data) {
        setBlog(response.data)
        setCommentsCount(typeof response.data.comments === 'number' ? response.data.comments : 0)
      }
    } catch (error) {
      console.error('Error fetching blog:', error)
    } finally {
      setLoading(false)
    }
  }, [resolvedParams.id])

  const fetchComments = useCallback(async () => {
    try {
      const response = await blogsService.getBlogComments(resolvedParams.id)
      if (response.success && response.data) {
        setComments(Array.isArray(response.data) ? response.data : [])
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }, [resolvedParams.id])

  useEffect(() => {
    if (resolvedParams.id) {
      fetchBlogPost()
      fetchComments()
    }
  }, [resolvedParams.id, fetchBlogPost, fetchComments])

  const handleShare = async () => {
    try {
      const currentUrl = window.location.href
      await navigator.clipboard.writeText(currentUrl)

      setShareSuccess(true)
      setTimeout(() => setShareSuccess(false), 2000)
    } catch (error) {
      console.error('Failed to copy URL:', error)
      const textArea = document.createElement('textarea')
      textArea.value = window.location.href
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        setShareSuccess(true)
        setTimeout(() => setShareSuccess(false), 2000)
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError)
      }
      document.body.removeChild(textArea)
    }
  }

  const handleAddComment = async () => {
    if (!session?.data?.user?.id || !newComment.trim()) return

    try {
      const response = await blogsService.addBlogComment(resolvedParams.id, {
        content: newComment.trim(),
        userId: session.data.user.id,
      })

      if (response.success) {
        setNewComment('')
        fetchComments()
        setCommentsCount((prev) => prev + 1)
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readingTime} min read`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="w-full space-y-8 px-6 py-8">
          <div className="space-y-6">
            <div className="h-16 w-2/3 bg-muted/50 rounded animate-pulse" />
            <div className="flex items-center space-x-6">
              <div className="w-12 h-12 bg-muted/50 rounded-full animate-pulse" />
              <div>
                <div className="h-5 w-40 bg-muted/50 rounded animate-pulse mb-2" />
                <div className="h-4 w-32 bg-muted/50 rounded animate-pulse" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-5 w-full bg-muted/50 rounded animate-pulse" />
            ))}
          </div>

          <div className="flex items-center space-x-6 pt-8 border-t">
            <div className="h-12 w-24 bg-muted/50 rounded-lg animate-pulse" />
            <div className="h-12 w-24 bg-muted/50 rounded-lg animate-pulse" />
            <div className="h-12 w-24 bg-muted/50 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-20 h-20 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-foreground mb-4">Blog not found</h2>
          <p className="text-foreground text-base mb-8">
            The blog post you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button size="lg" onClick={() => router.push('/blog/landing')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted/20 z-50">
        <div
          className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-300 shadow-sm shadow-primary/50"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <header className="border-b border-border/40 bg-card/50 backdrop-blur-xl sticky top-0 z-10 shadow-sm mt-1">
        <div className="w-full px-6 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              size="default"
              className="hover:bg-primary/10 hover:text-primary transition-all gap-2.5 font-medium rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="default"
                onClick={handleShare}
                className={`transition-all duration-300 gap-2 rounded-xl font-medium ${
                  shareSuccess
                    ? 'bg-green-50 border-green-300 text-green-700 dark:bg-green-950/30 dark:border-green-700 dark:text-green-400 shadow-lg shadow-green-500/20'
                    : 'hover:bg-primary/5 hover:border-primary/50 border-border/60'
                }`}
              >
                {shareSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    Share
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            {/* Tags Section - Moved to Top */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2.5 mb-8">
                {blog.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-4 py-1.5 text-sm font-semibold bg-gradient-to-r from-primary/15 to-accent/15 text-primary border border-primary/20 hover:bg-primary/20 transition-all rounded-full shadow-sm"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Title with improved spacing */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground font-heading mb-8 leading-[1.1] tracking-tight">
              {blog.title}
            </h1>

            {/* Metadata Section with improved styling */}
            <div className="flex items-center gap-6 mb-10 pb-10 border-b border-border/40">
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14 border-2 border-primary/20 ring-4 ring-background shadow-md">
                  <AvatarImage src={blog.author?.avatar || '/Professional.webp'} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/30 to-primary/20 text-primary-foreground font-bold text-lg">
                    {blog.author?.name
                      ? blog.author.name.charAt(0).toUpperCase()
                      : blog.author?.email?.charAt(0).toUpperCase() || 'M'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground text-lg">
                    {blog.author?.name || blog.author?.email || 'Unknown Author'}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1.5">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(blog.createdAt)}
                    </span>
                    <span className="text-border">•</span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {getReadingTime(blog.content)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content with improved typography */}
          <div className="mb-16">
            <div
              className="prose prose-lg max-w-none dark:prose-invert 
              prose-headings:font-heading prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight
              prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-12
              prose-h2:text-3xl prose-h2:mb-5 prose-h2:mt-10
              prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8
              prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base
              prose-li:text-foreground/90 prose-li:leading-relaxed
              prose-strong:text-foreground prose-strong:font-semibold
              prose-em:text-foreground/80
              prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-a:underline-offset-4
              prose-code:text-primary prose-code:bg-primary/10 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:text-sm prose-code:font-medium
              prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border/60 prose-pre:rounded-xl prose-pre:shadow-inner
              prose-blockquote:border-l-primary prose-blockquote:border-l-4 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-foreground/80
              prose-img:rounded-2xl prose-img:shadow-2xl prose-img:border prose-img:border-border/50
              prose-hr:border-border/40 prose-hr:my-10
              prose-ul:my-6 prose-ol:my-6
            "
            >
              <ReactMarkdown>{blog.content}</ReactMarkdown>
            </div>
          </div>

          {/* Comments Section with improved design */}
          <div className="bg-gradient-to-br from-card/40 via-card/30 to-card/40 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg overflow-hidden">
            <div className="p-8 pb-6 border-b border-border/40 bg-card/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center shadow-sm">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-heading text-foreground">Discussion</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {session?.data?.user && (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-11 h-11 border-2 border-primary/20 ring-2 ring-background shadow-sm">
                      <AvatarImage src={session.data.user.image || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/30 to-primary/20 text-primary-foreground font-bold">
                        {getInitials(
                          session.data.user.name?.split(' ')[0] || '',
                          session.data.user.name?.split(' ')[1] || ''
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <Textarea
                        placeholder="Share your thoughts..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[120px] bg-background/60 border-border/60 focus:border-primary/40 hover:border-border resize-none text-base rounded-xl transition-all shadow-sm"
                      />
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground font-medium">
                          Markdown is supported
                        </p>
                        <Button
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                          size="default"
                          className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all font-semibold rounded-xl"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {session?.data?.user && <Separator className="bg-border/40" />}

              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-4 group">
                    <Avatar className="w-11 h-11 border-2 border-border/40 group-hover:border-primary/30 transition-all shadow-sm">
                      <AvatarImage src={comment.user?.avatar || ''} />
                      <AvatarFallback className="bg-muted text-muted-foreground text-sm font-semibold">
                        {getInitials(
                          comment.user?.name?.split(' ')[0] || '',
                          comment.user?.name?.split(' ')[1] || ''
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-muted/40 rounded-xl p-5 border border-border/40 group-hover:border-border/60 group-hover:shadow-sm transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <p className="font-semibold text-foreground text-base">
                          {comment.user?.name}
                        </p>
                        <span className="text-xs text-muted-foreground">•</span>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                      <p className="text-foreground/90 leading-relaxed text-base">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}

                {comments.length === 0 && (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <MessageCircle className="w-12 h-12 text-primary/70" />
                    </div>
                    <h4 className="text-xl font-bold font-heading text-foreground mb-2">
                      No comments yet
                    </h4>
                    <p className="text-muted-foreground text-base">
                      Be the first to share your thoughts!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default BlogPostPage
