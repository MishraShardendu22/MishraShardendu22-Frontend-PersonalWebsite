import React from 'react'

interface BlogGridSkeletonProps {
  count?: number
  className?: string
}

export const BlogGridSkeleton: React.FC<BlogGridSkeletonProps> = ({
  count = 6,
  className = '',
}) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => (
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
  )
}

export default BlogGridSkeleton
