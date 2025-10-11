import { Blog } from '@/services/types'

/**
 * Owner email constant - single source of truth for blog owner authentication
 */
export const OWNER_EMAIL = 'mishrashardendu22@gmail.com'

/**
 * Format date string to localized date format
 * @param dateString - ISO date string
 * @param options - Intl.DateTimeFormatOptions for customization
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string => {
  return new Date(dateString).toLocaleDateString('en-US', options)
}

/**
 * Truncate text to specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation (default: 120)
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number = 120): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Sort blogs by different criteria
 * @param blogs - Array of blogs to sort
 * @param sortBy - Sorting criteria
 * @returns Sorted array of blogs
 */
export const sortBlogs = (blogs: Blog[], sortBy: string): Blog[] => {
  switch (sortBy) {
    case 'newest':
      return [...blogs].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    case 'oldest':
      return [...blogs].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    case 'title':
      return [...blogs].sort((a, b) => a.title.localeCompare(b.title))
    case 'comments':
      return [...blogs].sort((a, b) => {
        const aComments = Array.isArray(a.comments) ? a.comments.length : a.comments || 0
        const bComments = Array.isArray(b.comments) ? b.comments.length : b.comments || 0
        return bComments - aComments
      })
    default:
      return blogs
  }
}

/**
 * Format large numbers with K/M suffixes
 * @param num - Number to format
 * @returns Formatted number string
 */
export const formatNumber = (num: number | undefined | null): string => {
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

/**
 * Calculate reading time for blog content
 * @param content - Blog content text
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Reading time string
 */
export const getReadingTime = (content: string, wordsPerMinute: number = 200): string => {
  const wordCount = content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / wordsPerMinute)
  return `${readingTime} min read`
}

/**
 * Get initials from first and last name
 * @param firstName - First name
 * @param lastName - Last name
 * @returns Uppercase initials
 */
export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
}

/**
 * Filter blogs by search term
 * @param blogs - Array of blogs to filter
 * @param searchTerm - Search query
 * @returns Filtered blogs
 */
export const filterBlogs = (blogs: Blog[], searchTerm: string): Blog[] => {
  if (!searchTerm.trim()) return blogs

  const term = searchTerm.toLowerCase()
  return blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(term) ||
      blog.content.toLowerCase().includes(term) ||
      (blog.author?.name && blog.author.name.toLowerCase().includes(term)) ||
      (blog.author?.email && blog.author.email.toLowerCase().includes(term))
  )
}

/**
 * Get total comment count from blogs
 * @param blogs - Array of blogs
 * @returns Total number of comments
 */
export const getTotalComments = (blogs: Blog[]): number => {
  return blogs.reduce((sum, blog) => {
    const comments = Array.isArray(blog.comments) ? blog.comments.length : blog.comments || 0
    return sum + comments
  }, 0)
}

/**
 * Check if user is the blog owner
 * @param userEmail - User's email address
 * @returns Boolean indicating if user is owner
 */
export const isOwner = (userEmail: string | undefined): boolean => {
  return userEmail === OWNER_EMAIL
}

/**
 * Get comment count for a single blog
 * @param blog - Blog object
 * @returns Number of comments
 */
export const getCommentCount = (blog: Blog): number => {
  return Array.isArray(blog.comments) ? blog.comments.length : blog.comments || 0
}
