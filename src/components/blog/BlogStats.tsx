'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PenTool, MessageCircle } from 'lucide-react'

interface BlogStatsProps {
  totalPosts: number
  totalComments: number
}

const BlogStats: React.FC<BlogStatsProps> = ({ totalPosts, totalComments }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-foreground">Posts</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <PenTool className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">{formatNumber(totalPosts)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-foreground">Comments</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-accent" />
              </div>
              <span className="text-xl font-bold text-foreground">
                {formatNumber(totalComments)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">Engagement</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 gap-2">
              <div className="text-center">
                <div className="text-lg font-bold text-secondary">
                  {totalPosts > 0 ? (totalComments / totalPosts).toFixed(1) : '0'}
                </div>
                <p className="text-xs text-foreground">Avg. Comments per Post</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default BlogStats
