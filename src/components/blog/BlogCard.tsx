'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MessageCircle, Calendar, ArrowRight, User } from 'lucide-react'
import { Blog } from '@/services/types'

interface BlogCardProps {
  blog: Blog
  onReadMore?: (blogId: string) => void
  showActions?: boolean
  customActions?: React.ReactNode
}

const BlogCard: React.FC<BlogCardProps> = ({
  blog,
  onReadMore,
  showActions = true,
  customActions,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <div className="rounded-lg border border-border bg-card p-3 sm:p-4">
      <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
          <Avatar className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0">
            <AvatarImage src={blog.author.avatar || ''} className="object-cover" />
            <AvatarFallback className="bg-muted text-foreground text-xs">
              {blog.author.name && blog.author.name
                ? getInitials(blog.author.name, blog.author.name)
                : blog.author.email?.charAt(0).toUpperCase() || (
                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              {blog.author?.name ? blog.author.name : blog.author?.email || 'Unknown Author'}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span className="hidden sm:inline">{formatDate(blog.createdAt)}</span>
              <span className="sm:hidden">
                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-muted-foreground flex-shrink-0">
          <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="text-xs">
            {Array.isArray(blog.comments) ? blog.comments.length : (blog.comments ?? 0)}
          </span>
        </div>
      </div>

      <h4 className="text-sm sm:text-base font-semibold text-foreground mb-2 sm:mb-3 line-clamp-2">
        {blog.title}
      </h4>

      {blog.tags && blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2 sm:mb-3">
          {blog.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs px-1.5 sm:px-2 py-0.5">
              {tag}
            </Badge>
          ))}
          {blog.tags.length > 3 && (
            <Badge variant="outline" className="text-xs px-1.5 sm:px-2 py-0.5">
              +{blog.tags.length - 3}
            </Badge>
          )}
        </div>
      )}

      {customActions ? (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReadMore?.(blog.id.toString())}
            className="flex-1 text-xs sm:text-sm group/btn relative overflow-hidden h-8 sm:h-9"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
            <span className="relative flex items-center justify-center gap-1.5 sm:gap-2">
              <span className="hidden sm:inline">Continue Reading</span>
              <span className="sm:hidden">Read</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
            </span>
          </Button>
          {customActions}
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onReadMore?.(blog.id.toString())}
          className="w-full text-xs sm:text-sm group/btn relative overflow-hidden h-8 sm:h-9"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
          <span className="relative flex items-center justify-center gap-1.5 sm:gap-2">
            <span className="hidden sm:inline">Continue Reading</span>
            <span className="sm:hidden">Read More</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
          </span>
        </Button>
      )}
    </div>
  )
}

export default BlogCard
