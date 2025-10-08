'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, MessageCircle, ArrowRight, BookOpen } from 'lucide-react'
import { Blog } from '@/services/types'

interface BlogListProps {
  blogs: Blog[]
  onReadMore?: (blogId: string) => void
  layout?: 'grid' | 'list'
  showStats?: boolean
  emptyMessage?: string
}

const BlogList: React.FC<BlogListProps> = ({
  blogs,
  onReadMore,
  layout = 'grid',
  showStats = true,
  emptyMessage = 'No blogs found',
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const getInitials = (author: Blog['author']) => {
    if (author?.name) {
      return author.name
        .split(' ')
        .map((n) => n.charAt(0))
        .join('')
        .toUpperCase()
    }
    return author?.email?.charAt(0).toUpperCase() || 'U'
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 md:py-20 px-4">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">{emptyMessage}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Start creating your first blog post
        </p>
      </div>
    )
  }

  if (layout === 'list') {
    return (
      <div className="space-y-3 sm:space-y-4">
        {blogs.map((blog) => (
          <Card
            key={blog.id}
            className="bg-card border hover:border-primary/50 transition-colors duration-200"
          >
            <CardContent className="p-3 sm:p-4 md:p-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <Avatar className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 flex-shrink-0 ring-1 ring-border">
                  <AvatarImage src={blog.author?.avatar || ''} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs sm:text-sm">
                    {getInitials(blog.author)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4 mb-2">
                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                      <h3 className="font-bold text-foreground mb-1 line-clamp-1 text-base sm:text-lg">
                        {blog.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {blog.author?.name || blog.author?.email || 'Unknown Author'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0">
                      <Calendar className="w-3 h-3" />
                      <span className="hidden sm:inline">{formatDate(blog.createdAt)}</span>
                      <span className="sm:hidden">
                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 leading-relaxed">
                    {truncateText(blog.content, 200)}
                  </p>

                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                      {blog.tags.slice(0, 4).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs px-2 sm:px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-medium"
                        >
                          #{tag}
                        </Badge>
                      ))}
                      {blog.tags.length > 4 && (
                        <Badge
                          variant="outline"
                          className="text-xs px-2 sm:px-2.5 py-0.5 rounded-md font-medium"
                        >
                          +{blog.tags.length - 4}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                    {showStats && (
                      <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-md bg-muted">
                        <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                        <span className="text-xs sm:text-sm font-medium">
                          {Array.isArray(blog.comments) ? blog.comments.length : blog.comments || 0}
                        </span>
                      </div>
                    )}

                    {onReadMore && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onReadMore(blog.id.toString())}
                        className="text-primary hover:bg-primary/10 font-medium text-xs sm:text-sm h-8 sm:h-9"
                      >
                        <span className="hidden sm:inline">Read More</span>
                        <span className="sm:hidden">Read</span>
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 sm:ml-1.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {blogs.map((blog) => (
        <Card
          key={blog.id}
          className="bg-card border hover:border-primary/50 transition-colors duration-200 h-full flex flex-col"
        >
          <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
            <div className="flex items-start gap-2 sm:gap-3">
              <Avatar className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 ring-1 ring-border">
                <AvatarImage src={blog.author?.avatar || ''} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs sm:text-sm">
                  {getInitials(blog.author)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-xs sm:text-sm truncate">
                  {blog.author?.name || blog.author?.email || 'Unknown Author'}
                </p>
                <div className="flex items-center gap-1 sm:gap-1.5 mt-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span className="hidden sm:inline">{formatDate(blog.createdAt)}</span>
                  <span className="sm:hidden">
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pb-4 sm:pb-5 px-4 sm:px-6 flex-1 flex flex-col gap-3 sm:gap-4">
            <div className="flex-1">
              <CardTitle className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-2.5 line-clamp-2 leading-tight">
                {blog.title}
              </CardTitle>
              <CardDescription className="line-clamp-3 text-xs sm:text-sm leading-relaxed">
                {truncateText(blog.content)}
              </CardDescription>
            </div>

            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {blog.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 sm:px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-medium"
                  >
                    #{tag}
                  </Badge>
                ))}
                {blog.tags.length > 3 && (
                  <Badge
                    variant="outline"
                    className="text-xs px-2 sm:px-2.5 py-0.5 rounded-md font-medium"
                  >
                    +{blog.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-auto pt-3 sm:pt-4 border-t gap-2 sm:gap-0">
              {showStats && (
                <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-md bg-muted">
                  <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                  <span className="text-xs sm:text-sm font-medium">
                    {Array.isArray(blog.comments) ? blog.comments.length : blog.comments || 0}
                  </span>
                </div>
              )}

              {onReadMore && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReadMore(blog.id.toString())}
                  className="text-primary hover:bg-primary/10 font-medium text-xs sm:text-sm h-8 sm:h-9 w-full sm:w-auto"
                >
                  <span className="hidden sm:inline">Read More</span>
                  <span className="sm:hidden">Read</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 sm:ml-1.5" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default BlogList
