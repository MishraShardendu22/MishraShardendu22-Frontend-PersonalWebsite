import { MetadataRoute } from 'next'
import { BASE_URL } from '@/constants/url'
import { projectsAPI } from '@/util/apiResponse.util'
import { blogsService } from '@/services/blogs'

async function getProjects() {
  try {
    const response = await projectsAPI.getAllProjects()
    return Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error)
    return []
  }
}

async function getBlogPosts() {
  try {
    const response = await blogsService.getBlogs()
    return Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
    return []
  }
}

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = BASE_URL
  const currentDate = new Date()

  // Fetch dynamic data
  const [projects, blogPosts] = await Promise.all([getProjects(), getBlogPosts()])

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/experience`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/volunteer`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/certifications`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // Add project routes
  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.inline?.id || project.inline.id}`,
    lastModified: project.inline?.updated_at ? new Date(project.inline.updated_at) : currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Add blog post routes
  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...projectRoutes, ...blogRoutes]
}
