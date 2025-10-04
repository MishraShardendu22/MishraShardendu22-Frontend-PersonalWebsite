import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export const BlogCardSkeleton = () => {
  return (
    <Card className="group relative bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
      <div className="relative p-7 space-y-4">
        {/* Author Section */}
        <div className="flex items-center gap-3.5">
          <Skeleton className="w-12 h-12 rounded-full ring-2 ring-border" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
        </div>

        {/* Title & Content */}
        <div className="space-y-3 pt-1">
          <Skeleton className="h-6 w-5/6 rounded-md" />
          <Skeleton className="h-6 w-3/4 rounded-md" />
          <div className="space-y-2 pt-1">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-11/12 rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-5 border-t border-border/40">
          <Skeleton className="h-9 w-16 rounded-full" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>
    </Card>
  )
}

export const BlogListSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  )
}

export const BlogDashboardSkeleton = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-56 rounded-lg" />
          <Skeleton className="h-5 w-72 rounded" />
        </div>
        <Skeleton className="h-11 w-36 rounded-xl" />
      </div>

      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-xl" />
        ))}
      </div>

      <div className="max-w-2xl">
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>

      <BlogListSkeleton count={9} />
    </div>
  )
}

export const BlogPostSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Tags */}
      <div className="flex gap-2.5">
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-28 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>

      {/* Title */}
      <div className="space-y-4">
        <Skeleton className="h-14 w-11/12 rounded-lg" />
        <Skeleton className="h-14 w-4/5 rounded-lg" />
      </div>

      {/* Author Meta */}
      <div className="flex items-center gap-4 pb-10 border-b border-border/40">
        <Skeleton className="w-14 h-14 rounded-full ring-4 ring-background" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-40 rounded" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-5 w-full rounded" />
            <Skeleton className="h-5 w-11/12 rounded" />
            <Skeleton className="h-5 w-10/12 rounded" />
          </div>
        ))}
      </div>

      {/* Comments Section */}
      <div className="bg-card/40 rounded-2xl border border-border/50 overflow-hidden">
        <div className="p-8 pb-6 border-b border-border/40">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32 rounded" />
              <Skeleton className="h-4 w-24 rounded" />
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="text-center py-16">
            <Skeleton className="w-24 h-24 rounded-3xl mx-auto mb-6" />
            <Skeleton className="h-6 w-48 mx-auto mb-3 rounded" />
            <Skeleton className="h-4 w-64 mx-auto rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

export const BlogCommentsSkeleton = () => {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-start gap-4">
          <Skeleton className="w-11 h-11 rounded-full flex-shrink-0 ring-2 ring-border" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-11/12 rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
