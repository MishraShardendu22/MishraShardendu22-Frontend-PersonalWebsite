'use client'

import { authClient } from '@/lib/authClient'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  MessageCircle,
  Share2,
  Calendar,
  Send,
  BookOpen,
  Clock,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { blogsService } from '@/services/blogs'
import { Blog } from '@/services/types'
import ReactMarkdown from 'react-markdown'
import Image from 'next/image'
import { cn } from '@/lib/utils'

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
  const [showComments, setShowComments] = useState(false)
  const [showTags, setShowTags] = useState(false)

  // Markdown components for blog content styling
  const markdownComponents = useMemo(
    () => ({
      h1: ({ children, className: _className, ...props }: any) => (
        <h1
          className={cn(
            'text-4xl md:text-5xl font-extrabold mb-6 mt-8 text-foreground font-heading',
            _className
          )}
          {...props}
        >
          {children}
        </h1>
      ),
      h2: ({ children, className: _className, ...props }: any) => (
        <h2
          className={cn(
            'text-3xl md:text-4xl font-bold mb-5 mt-8 text-foreground font-heading border-b-2 border-border/40 pb-3',
            _className
          )}
          {...props}
        >
          {children}
        </h2>
      ),
      h3: ({ children, className: _className, ...props }: any) => (
        <h3
          className={cn(
            'text-2xl md:text-3xl font-semibold mb-4 mt-6 text-foreground font-heading',
            _className
          )}
          {...props}
        >
          {children}
        </h3>
      ),
      h4: ({ children, className: _className, ...props }: any) => (
        <h4
          className={cn('text-xl md:text-2xl font-semibold mb-3 mt-5 text-foreground', _className)}
          {...props}
        >
          {children}
        </h4>
      ),
      h5: ({ children, className: _className, ...props }: any) => (
        <h5
          className={cn('text-lg md:text-xl font-semibold mb-3 mt-4 text-foreground', _className)}
          {...props}
        >
          {children}
        </h5>
      ),
      h6: ({ children, className: _className, ...props }: any) => (
        <h6
          className={cn(
            'text-base md:text-lg font-semibold mb-2 mt-3 text-muted-foreground',
            _className
          )}
          {...props}
        >
          {children}
        </h6>
      ),

      p: ({ children, className: _className, ...props }: any) => (
        <p className={cn('mb-6 text-lg text-foreground/90 leading-relaxed', _className)} {...props}>
          {children}
        </p>
      ),

      ul: ({ children, className: _className, ...props }: any) => (
        <ul className={cn('list-disc pl-8 mb-6 space-y-2', _className)} {...props}>
          {children}
        </ul>
      ),
      ol: ({ children, className: _className, ...props }: any) => (
        <ol className={cn('list-decimal pl-8 mb-6 space-y-2', _className)} {...props}>
          {children}
        </ol>
      ),
      li: ({ children, className: _className, ...props }: any) => (
        <li className={cn('text-lg text-foreground/90 leading-relaxed', _className)} {...props}>
          {children}
        </li>
      ),

      code: ({ children, className: _className, inline, ...props }: any) => {
        if (inline) {
          return (
            <code
              className={cn(
                'bg-muted/80 px-2 py-1 rounded-md text-sm font-mono text-accent border border-border/40',
                _className
              )}
              {...props}
            >
              {children}
            </code>
          )
        }
        return (
          <code className={cn('font-mono text-sm', _className)} {...props}>
            {children}
          </code>
        )
      },
      pre: ({ children, className: _className, ...props }: any) => (
        <pre
          className={cn(
            'bg-muted/60 p-6 rounded-xl overflow-x-auto mb-6 border-2 border-border/40 shadow-sm',
            _className
          )}
          {...props}
        >
          {children}
        </pre>
      ),

      blockquote: ({ children, className: _className, ...props }: any) => (
        <blockquote
          className={cn(
            'border-l-4 border-primary pl-6 py-2 italic mb-6 bg-primary/5 rounded-r-lg',
            _className
          )}
          {...props}
        >
          {children}
        </blockquote>
      ),

      a: ({ children, className: _className, href, ...props }: any) => (
        <a
          href={href}
          className={cn(
            'text-primary underline underline-offset-4 hover:text-primary-hover transition-colors',
            _className
          )}
          {...props}
        >
          {children}
        </a>
      ),

      strong: ({ children, className: _className, ...props }: any) => (
        <strong className={cn('font-bold text-foreground', _className)} {...props}>
          {children}
        </strong>
      ),

      em: ({ children, className: _className, ...props }: any) => (
        <em className={cn('italic', _className)} {...props}>
          {children}
        </em>
      ),

      hr: ({ className: _className, ...props }: any) => (
        <hr className={cn('my-8 border-t-2 border-border/40', _className)} {...props} />
      ),

      img: ({ src, alt, className: _className, ...props }: any) => {
        const imgSrc = typeof src === 'string' ? src : ''
        if (!imgSrc) return null

        return (
          <Image
            src={imgSrc}
            alt={alt || 'Blog image'}
            width={800}
            height={500}
            className={cn(
              'w-full rounded-2xl mb-8 shadow-xl border-2 border-border/40',
              _className
            )}
            {...props}
          />
        )
      },

      table: ({ children, className: _className, ...props }: any) => (
        <div className="overflow-x-auto mb-6">
          <table
            className={cn(
              'w-full border-collapse border-2 border-border/40 rounded-lg',
              _className
            )}
            {...props}
          >
            {children}
          </table>
        </div>
      ),

      th: ({ children, className: _className, ...props }: any) => (
        <th
          className={cn(
            'border border-border/40 px-4 py-3 bg-muted font-semibold text-left',
            _className
          )}
          {...props}
        >
          {children}
        </th>
      ),

      td: ({ children, className: _className, ...props }: any) => (
        <td className={cn('border border-border/40 px-4 py-3', _className)} {...props}>
          {children}
        </td>
      ),
    }),
    []
  )

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
        <div className="w-full space-y-10 px-6 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header skeleton */}
            <div className="space-y-6 animate-pulse">
              <div className="h-8 w-1/4 bg-gradient-to-r from-muted/60 via-muted/40 to-muted/60 rounded-xl" />
              <div className="h-20 w-full bg-gradient-to-r from-muted/60 via-muted/40 to-muted/60 rounded-2xl" />
              <div className="h-16 w-5/6 bg-gradient-to-r from-muted/60 via-muted/40 to-muted/60 rounded-2xl" />
            </div>

            {/* Author info skeleton */}
            <div className="flex items-center space-x-6 animate-pulse">
              <div className="w-16 h-16 bg-gradient-to-br from-muted/60 to-muted/40 rounded-full" />
              <div className="space-y-3">
                <div className="h-6 w-48 bg-gradient-to-r from-muted/60 via-muted/40 to-muted/60 rounded-lg" />
                <div className="h-4 w-36 bg-gradient-to-r from-muted/60 via-muted/40 to-muted/60 rounded-lg" />
              </div>
            </div>

            {/* Content skeleton */}
            <div className="space-y-4 pt-8 animate-pulse">
              <div className="h-5 w-full bg-gradient-to-r from-muted/60 via-muted/40 to-muted/60 rounded-lg" />
              <div className="h-5 w-11/12 bg-gradient-to-r from-muted/60 via-muted/40 to-muted/60 rounded-lg" />
              <div className="h-5 w-10/12 bg-gradient-to-r from-muted/60 via-muted/40 to-muted/60 rounded-lg" />
              <div className="h-5 w-full bg-gradient-to-r from-muted/60 via-muted/40 to-muted/60 rounded-lg" />
              <div className="h-5 w-9/12 bg-gradient-to-r from-muted/60 via-muted/40 to-muted/60 rounded-lg" />
              <div className="h-5 w-11/12 bg-gradient-to-r from-muted/60 via-muted/40 to-muted/60 rounded-lg" />
              <div className="h-5 w-10/12 bg-gradient-to-r from-muted/60 via-muted/40 to-muted/60 rounded-lg" />
              <div className="h-5 w-full bg-gradient-to-r from-muted/60 via-muted/40 to-muted/60 rounded-lg" />
              <div className="h-5 w-10/12 bg-gradient-to-r from-muted/60 via-muted/40 to-muted/60 rounded-lg" />
              <div className="h-5 w-11/12 bg-gradient-to-r from-muted/60 via-muted/40 to-muted/60 rounded-lg" />
              <div className="h-5 w-9/12 bg-gradient-to-r from-muted/60 via-muted/40 to-muted/60 rounded-lg" />
              <div className="h-5 w-full bg-gradient-to-r from-muted/60 via-muted/40 to-muted/60 rounded-lg" />
              <div className="h-5 w-10/12 bg-gradient-to-r from-muted/60 via-muted/40 to-muted/60 rounded-lg" />
              <div className="h-5 w-11/12 bg-gradient-to-r from-muted/60 via-muted/40 to-muted/60 rounded-lg" />
              <div className="h-5 w-9/12 bg-gradient-to-r from-muted/60 via-muted/40 to-muted/60 rounded-lg" />
            </div>

            {/* Action buttons skeleton */}
            <div className="flex items-center space-x-6 pt-12 border-t border-border/30 animate-pulse">
              <div className="h-12 w-32 bg-gradient-to-r from-muted/60 via-muted/40 to-muted/60 rounded-xl" />
              <div className="h-12 w-32 bg-gradient-to-r from-muted/60 via-muted/40 to-muted/60 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gradient-to-br from-destructive/20 via-destructive/15 to-destructive/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-destructive/20">
            <BookOpen className="w-12 h-12 text-destructive" />
          </div>
          <h2 className="text-3xl font-extrabold font-heading text-foreground mb-5">
            Blog not found
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed mb-10">
            The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 z-50">
        <div
          className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-300 shadow-md shadow-primary/50"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-[1600px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-8 xl:gap-12">
          {/* Main Content - Centered */}
          <main className="min-w-0">
            <article className="bg-gradient-to-br from-card/40 via-card/30 to-card/40 backdrop-blur-sm rounded-3xl border-2 border-border/40 shadow-2xl p-8 md:p-12 lg:p-16">
              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-foreground font-heading mb-8 leading-[1.05] tracking-tight">
                {blog.title}
              </h1>

              <Separator className="my-10 bg-border/30" />

              {/* Content */}
              <div className="prose max-w-none dark:prose-invert">
                <ReactMarkdown components={markdownComponents}>
                  {blog.content || 'No content available.'}
                </ReactMarkdown>
              </div>
            </article>
          </main>

          {/* Right Sidebar - Sticky */}
          <aside className="lg:sticky lg:top-24 lg:h-fit space-y-6">
            {/* Author Card */}
            <div className="bg-gradient-to-br from-card/80 via-card/60 to-card/80 backdrop-blur-md rounded-2xl border-2 border-border/40 p-6 shadow-xl">
              <div className="text-center mb-6">
                <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-primary/30 ring-4 ring-primary/10 shadow-xl">
                  <AvatarImage src={blog.author?.avatar || '/Professional.webp'} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/40 to-primary/30 text-primary-foreground font-extrabold text-2xl">
                    {blog.author?.name
                      ? blog.author.name.charAt(0).toUpperCase()
                      : blog.author?.email?.charAt(0).toUpperCase() || 'M'}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-lg text-foreground mb-1">
                  {blog.author?.name || blog.author?.email || 'Unknown Author'}
                </h3>
                <p className="text-sm text-muted-foreground">Author</p>
              </div>

              <Separator className="my-4 bg-border/30" />

              {/* Metadata */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">{formatDate(blog.createdAt)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">{getReadingTime(blog.content)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">
                    {commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}
                  </span>
                </div>
              </div>

              <Separator className="my-4 bg-border/30" />

              {/* Share Button */}
              <Button
                variant="outline"
                size="default"
                onClick={handleShare}
                className={`w-full transition-all duration-300 gap-2.5 rounded-xl font-semibold shadow-sm ${
                  shareSuccess
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-700 dark:text-emerald-400 shadow-lg shadow-emerald-500/20'
                    : 'hover:bg-primary/10 hover:border-primary/50 hover:text-primary hover:shadow-md border-border/60'
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
                    Share Article
                  </>
                )}
              </Button>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="bg-gradient-to-br from-card/80 via-card/60 to-card/80 backdrop-blur-md rounded-2xl border-2 border-border/40 shadow-xl overflow-hidden">
                <button
                  onClick={() => setShowTags(!showTags)}
                  className="w-full p-6 flex items-center justify-between hover:bg-card/50 transition-colors"
                >
                  <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
                    Tags ({blog.tags.length})
                  </h4>
                  {showTags ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>

                {showTags && (
                  <div className="px-6 pb-6 pt-0">
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/30 hover:bg-primary/25 hover:scale-105 transition-all duration-300 rounded-full"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Comments Section - Always Visible with Scrollable Area */}
            <div className="bg-gradient-to-br from-card/80 via-card/60 to-card/80 backdrop-blur-md rounded-2xl border-2 border-border/40 shadow-xl overflow-hidden">
              <div className="p-6 pb-4 border-b-2 border-border/30">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <h4 className="font-bold text-base text-foreground">
                    Comments ({commentsCount})
                  </h4>
                </div>
              </div>

              <div className="p-6 pt-4 space-y-6">
                {/* Add Comment */}
                {session?.data?.user && (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Share your thoughts..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[100px] bg-background/80 border-2 border-border/50 focus:border-primary/50 resize-none text-sm rounded-xl transition-all"
                    />
                    <Button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      size="sm"
                      className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 font-bold rounded-xl"
                    >
                      <Send className="w-3.5 h-3.5 mr-2" />
                      Post
                    </Button>
                  </div>
                )}

                {session?.data?.user && comments.length > 0 && (
                  <Separator className="bg-border/30" />
                )}

                {/* Comments List - Scrollable */}
                <div className="space-y-4 max-h-[calc(100vh-32rem)] overflow-y-auto pr-2 custom-scrollbar">
                  {comments.map((comment) => (
                    <div key={comment.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8 border-2 border-border/40">
                          <AvatarImage src={comment.user?.avatar || ''} />
                          <AvatarFallback className="bg-muted text-xs font-bold">
                            {getInitials(
                              comment.user?.name?.split(' ')[0] || '',
                              comment.user?.name?.split(' ')[1] || ''
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">
                            {comment.user?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(comment.createdAt)}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-foreground/90 leading-relaxed pl-10">
                        {comment.content}
                      </p>
                    </div>
                  ))}

                  {comments.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-8">
                      No comments yet. Be the first!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default BlogPostPage
