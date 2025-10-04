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
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{emptyMessage}</h3>
        <p className="text-sm text-muted-foreground">Start creating your first blog post</p>
      </div>
    )
  }

  if (layout === 'list') {
    return (
      <div className="space-y-4">
        {blogs.map((blog) => (
          <Card
            key={blog.id}
            className="bg-card border hover:border-primary/50 transition-colors duration-200"
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <Avatar className="w-11 h-11 flex-shrink-0 ring-1 ring-border">
                  <AvatarImage src={blog.author?.avatar || ''} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                    {getInitials(blog.author)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground mb-1 line-clamp-1 text-lg">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {blog.author?.name || blog.author?.email || 'Unknown Author'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2 leading-relaxed">
                    {truncateText(blog.content, 200)}
                  </p>

                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.slice(0, 4).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-medium"
                        >
                          #{tag}
                        </Badge>
                      ))}
                      {blog.tags.length > 4 && (
                        <Badge
                          variant="outline"
                          className="text-xs px-2.5 py-0.5 rounded-md font-medium"
                        >
                          +{blog.tags.length - 4}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    {showStats && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted">
                        <MessageCircle className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {Array.isArray(blog.comments) ? blog.comments.length : blog.comments || 0}
                        </span>
                      </div>
                    )}

                    {onReadMore && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onReadMore(blog.id.toString())}
                        className="text-primary hover:bg-primary/10 font-medium"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1.5" />
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {blogs.map((blog) => (
        <Card
          key={blog.id}
          className="bg-card border hover:border-primary/50 transition-colors duration-200 h-full flex flex-col"
        >
          <CardHeader className="pb-4">
            <div className="flex items-start gap-3">
              <Avatar className="w-11 h-11 ring-1 ring-border">
                <AvatarImage src={blog.author?.avatar || ''} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                  {getInitials(blog.author)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm truncate">
                  {blog.author?.name || blog.author?.email || 'Unknown Author'}
                </p>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {formatDate(blog.createdAt)}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pb-5 flex-1 flex flex-col gap-4">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold mb-2.5 line-clamp-2 leading-tight">
                {blog.title}
              </CardTitle>
              <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                {truncateText(blog.content)}
              </CardDescription>
            </div>

            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-medium"
                  >
                    #{tag}
                  </Badge>
                ))}
                {blog.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs px-2.5 py-0.5 rounded-md font-medium">
                    +{blog.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mt-auto pt-4 border-t">
              {showStats && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted">
                  <MessageCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {Array.isArray(blog.comments) ? blog.comments.length : blog.comments || 0}
                  </span>
                </div>
              )}

              {onReadMore && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReadMore(blog.id.toString())}
                  className="text-primary hover:bg-primary/10 font-medium"
                >
                  Read More
                  <ArrowRight className="w-4 h-4 ml-1.5" />
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
