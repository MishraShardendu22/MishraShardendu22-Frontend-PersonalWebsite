'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BookOpen,
  Search,
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  ArrowRight,
  BarChart3,
  Activity,
  Target,
  Award,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { blogsService } from '@/services/blogs'
import { Blog } from '@/services/types'
import { authClient } from '@/lib/authClient'
import { StatCard } from '@/components/blog/StatCard'

const OWNER_EMAIL = 'mishrashardendu22@gmail.com'

interface BlogStats {
  totalPosts: number
  totalComments: number
  averageCommentsPerPost: number
  topPerformingPost: Blog | null
  recentPosts: Blog[]
  postsByTag: Record<string, number>
  postsByAuthor: Record<string, number>
}

const BlogStatsPage = () => {
  const router = useRouter()
  const session = authClient.useSession()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [sortBy, setSortBy] = useState('comments')
  const [error, setError] = useState('')
  const [apiStats, setApiStats] = useState<any>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await blogsService.getBlogStats()

      if (response.success && response.data) {
        setApiStats(response.data)
        const blogsResponse = await blogsService.getBlogs()
        if (blogsResponse.success && blogsResponse.data) {
          setBlogs(Array.isArray(blogsResponse.data) ? blogsResponse.data : [])
        }
      } else {
        setError(response.error || 'Failed to fetch statistics')
        console.error('Stats fetch failed:', response.error)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      setError('Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }

  // Access control - only allow owner to view stats
  useEffect(() => {
    if (session?.data?.user?.email && session.data.user.email !== OWNER_EMAIL) {
      router.push('/blog')
    }
  }, [session, router])

  useEffect(() => {
    fetchStats()
  }, [])

  // Don't render if not the owner
  if (!session?.data?.user || session.data.user.email !== OWNER_EMAIL) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don&apos;t have permission to view analytics.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const calculateStats = (): BlogStats => {
    if (!apiStats) {
      return {
        totalPosts: 0,
        totalComments: 0,
        averageCommentsPerPost: 0,
        topPerformingPost: null,
        recentPosts: [],
        postsByTag: {},
        postsByAuthor: {},
      }
    }

    const postsByTag: Record<string, number> = {}
    if (apiStats.tagStats) {
      apiStats.tagStats.forEach((tagStat: any) => {
        postsByTag[tagStat.tag] = tagStat.count
      })
    }

    const postsByAuthor: Record<string, number> = {}
    if (apiStats.authorStats) {
      apiStats.authorStats.forEach((authorStat: any) => {
        const authorName =
          authorStat.firstName && authorStat.lastName
            ? `${authorStat.firstName} ${authorStat.lastName}`
            : authorStat.authorEmail || 'Unknown Author'

        postsByAuthor[authorName] = authorStat.postCount
      })
    }

    return {
      totalPosts: apiStats.totalPosts || 0,
      totalComments: apiStats.totalComments || 0,
      averageCommentsPerPost: apiStats.averageCommentsPerPost || 0,
      topPerformingPost: apiStats.topPerformingPost || null,
      recentPosts: apiStats.recentPosts || [],
      postsByTag,
      postsByAuthor,
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatNumber = (num: number | undefined | null) => {
    // Handle undefined, null, or NaN
    if (num == null || isNaN(num)) {
      return '0'
    }

    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const getGrowthIndicator = (current: number, previous: number) => {
    if (current > previous) {
      return {
        icon: ArrowUpRight,
        color: 'text-green-500',
        text: `+${(((current - previous) / previous) * 100).toFixed(1)}%`,
      }
    } else if (current < previous) {
      return {
        icon: ArrowDownRight,
        color: 'text-red-500',
        text: `${(((current - previous) / previous) * 100).toFixed(1)}%`,
      }
    } else {
      return { icon: Minus, color: 'text-gray-500', text: '0%' }
    }
  }

  const sortBlogs = (blogs: Blog[]) => {
    switch (sortBy) {
      case 'comments':
        return [...blogs].sort((a, b) => {
          const aComments = Array.isArray(a.comments) ? a.comments.length : a.comments || 0
          const bComments = Array.isArray(b.comments) ? b.comments.length : b.comments || 0
          return bComments - aComments
        })
      case 'newest':
        return [...blogs].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      case 'oldest':
        return [...blogs].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      default:
        return blogs
    }
  }

  const filteredAndSortedBlogs = sortBlogs(
    blogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.author.name &&
          blog.author.name &&
          `${blog.author.name} ${blog.author.name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
      return matchesSearch
    })
  )

  const calculatedStats = calculateStats()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-6">
              <div className="h-6 w-24 bg-muted/50 rounded animate-pulse mb-2" />
              <div className="h-8 w-16 bg-muted/50 rounded animate-pulse mb-1" />
              <div className="h-4 w-32 bg-muted/50 rounded animate-pulse" />
            </div>
          ))}
        </div>

        <div className="flex space-x-1 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 w-24 bg-muted/50 rounded-lg animate-pulse" />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
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
                  </div>
                  <div className="h-8 w-20 bg-muted/50 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
          <p className="text-destructive text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Posts"
          value={formatNumber(calculatedStats.totalPosts)}
          description="Published articles"
          icon={BookOpen}
          variant="primary"
        />

        <StatCard
          title="Total Comments"
          value={formatNumber(calculatedStats.totalComments)}
          description="User engagement"
          icon={MessageCircle}
          variant="accent"
        />

        <StatCard
          title="Avg Engagement"
          value={calculatedStats.averageCommentsPerPost.toFixed(1)}
          description="Comments per post"
          icon={Activity}
          variant="blue"
        />

        <StatCard
          title="Top Post"
          value={
            calculatedStats.topPerformingPost?.comments
              ? Array.isArray(calculatedStats.topPerformingPost.comments)
                ? calculatedStats.topPerformingPost.comments.length
                : calculatedStats.topPerformingPost.comments
              : 0
          }
          description="Most comments"
          icon={Award}
          variant="green"
        />
      </div>

      {calculatedStats.topPerformingPost && (
        <Card className="bg-card/40 backdrop-blur-sm border-border/70 hover:border-primary/30 transition-all shadow-sm mb-8">
          <CardHeader className="pb-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold font-heading">
                  Top Performing Post
                </CardTitle>
                <CardDescription className="text-sm">Most engaging content</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <Avatar className="w-12 h-12 flex-shrink-0 border border-border/50">
                  <AvatarImage src={calculatedStats.topPerformingPost.author?.avatar || ''} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    {calculatedStats.topPerformingPost.author?.name
                      ? calculatedStats.topPerformingPost.author.name.charAt(0).toUpperCase()
                      : calculatedStats.topPerformingPost.author?.email?.charAt(0).toUpperCase() ||
                        'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground mb-1.5 line-clamp-1 text-lg">
                    {calculatedStats.topPerformingPost.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    by{' '}
                    {calculatedStats.topPerformingPost.author?.name ||
                      calculatedStats.topPerformingPost.author?.email ||
                      'Unknown Author'}{' '}
                    • {formatDate(calculatedStats.topPerformingPost.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 flex-shrink-0">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent mb-1">
                    {formatNumber(
                      Array.isArray(calculatedStats.topPerformingPost.comments)
                        ? calculatedStats.topPerformingPost.comments.length
                        : calculatedStats.topPerformingPost.comments || 0
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">Comments</div>
                </div>
                <Button
                  onClick={() => router.push(`/blog/${calculatedStats.topPerformingPost?.id}`)}
                  variant="outline"
                  size="sm"
                  className="h-10 px-4 border-border/70 hover:bg-primary/5 hover:border-primary/50 transition-all gap-2"
                >
                  View Post
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="inline-flex h-11 items-center justify-center rounded-xl bg-muted/60 p-1.5 text-foreground shadow-sm border border-border/30">
          <TabsTrigger
            value="overview"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/60"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="posts"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/60"
          >
            All Posts
          </TabsTrigger>
          <TabsTrigger
            value="tags"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/60"
          >
            By Tags
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-heading">Recent Posts</CardTitle>
                <CardDescription className="text-sm">Latest published posts</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {calculatedStats.recentPosts.map((blog) => (
                    <div
                      key={blog.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <Avatar className="w-10 h-10 border-2 border-primary/20">
                          <AvatarImage
                            src={blog.author?.avatar || '/Professional.webp'}
                            alt={blog.author?.name || blog.author?.email || 'Author'}
                          />
                          <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                            {blog.author?.name
                              ? blog.author.name.charAt(0).toUpperCase()
                              : blog.author?.email?.charAt(0).toUpperCase() || 'M'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{blog.title}</p>
                          <p className="text-xs text-foreground">{formatDate(blog.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="posts" className="mt-4">
          <div className="mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground w-4 h-4" />
                  <Input
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 bg-background border-border"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-10 px-3 bg-background border border-border rounded-md text-sm"
                  >
                    <option value="views">Most Views</option>
                    <option value="likes">Most Likes</option>
                    <option value="comments">Most Comments</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>

                  <div className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm">
                    {filteredAndSortedBlogs.length} of {blogs.length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredAndSortedBlogs.map((blog) => (
              <Card
                key={blog.id}
                className="bg-card border-border hover:bg-accent/5 hover:border-primary/20 transition-all group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10 border-2 border-primary/20">
                      <AvatarImage
                        src={blog.author?.avatar || '/Professional.webp'}
                        alt={blog.author?.name || blog.author?.email || 'Author'}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                        {blog.author?.name
                          ? blog.author.name.charAt(0).toUpperCase()
                          : blog.author?.email?.charAt(0).toUpperCase() || 'M'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {blog.author?.name
                          ? blog.author.name
                          : blog.author?.email || 'Unknown Author'}
                      </p>
                      <p className="text-xs text-foreground flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(blog.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <CardTitle className="text-base mb-3 line-clamp-2 group-hover:text-primary transition-colors font-heading">
                    {blog.title}
                  </CardTitle>

                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {blog.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {blog.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{blog.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-foreground">
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>
                          {formatNumber(
                            Array.isArray(blog.comments) ? blog.comments.length : blog.comments || 0
                          )}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/blog/${blog.id}`)}
                      className="text-primary hover:text-primary-foreground hover:bg-primary h-8 px-3"
                    >
                      View
                      <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAndSortedBlogs.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-heading text-foreground mb-2">
                {searchTerm ? 'No posts found' : 'No posts yet'}
              </h3>
              <p className="text-foreground text-sm max-w-md mx-auto">
                {searchTerm
                  ? 'Try adjusting your search terms'
                  : 'Create your first blog post to get started'}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tags" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-heading">Tag Statistics</CardTitle>
              <CardDescription className="text-sm">Posts by category</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(calculatedStats.postsByTag)
                  .sort(([, a], [, b]) => b - a)
                  .map(([tag, count]) => (
                    <div
                      key={tag}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <Badge variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                      <div className="text-right">
                        <div className="text-sm font-bold">{count}</div>
                        <div className="text-xs text-foreground">posts</div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default BlogStatsPage
