import { MetadataRoute } from 'next'

// You can fetch dynamic content from your API here if needed
async function getProjects() {
  // This would typically fetch from your backend API
  // For now, returning static routes - you can enhance this later
  return []
}

async function getBlogPosts() {
  // This would typically fetch from your backend API
  // For now, returning static routes - you can enhance this later
  return []
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mishrashardendu22.is-a.dev'
  const currentDate = new Date()

  // Static pages with high priority
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

  // You can uncomment and enhance these when you want dynamic content
  /*
  // Dynamic project pages
  const projects = await getProjects()
  const projectRoutes: MetadataRoute.Sitemap = projects.map((project: any) => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: new Date(project.updatedAt || project.createdAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Dynamic blog posts
  const blogPosts = await getBlogPosts()
  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...projectRoutes, ...blogRoutes]
  */

  return staticRoutes
}
