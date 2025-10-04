export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ProjectHeaderProps {
  totalProjects: number
  totalPages: number
  currentPage: number
}

export interface ProjectFiltersProps {
  selectedSkill: string
  setSelectedSkill: (skill: string) => void
  searchTerm: string
  onSearchChange: (value: string) => void
  allSkills: string[]
}

export interface ProjectCardProps {
  title: string
  description: string
  link: string
  skills?: string[]
  repository?: string
  liveLink?: string
  video?: string
  isHovered: boolean
}

export interface ProjectGridProps {
  items: {
    title: string
    description: string
    link: string
    skills?: string[]
    repository?: string
    liveLink?: string
    video?: string
  }[]
  className?: string
}

export interface ProjectPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  startIndex: number
  endIndex: number
  totalItems: number
}

export interface User {
  id: string
  email: string
  username?: string
  name?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateUserRequest {
  email: string
  username: string
  password: string
}

export interface UpdateUserRequest {
  email?: string
  username?: string
}

export interface Profile {
  id: number
  userId: number
  bio?: string
  avatar?: string
  website?: string
  location?: string
  createdAt: string
  updatedAt: string
}

export interface UpdateProfileRequest {
  bio?: string
  avatar?: string
  website?: string
  location?: string
}

export interface Blog {
  id: number
  title: string
  content: string
  excerpt?: string
  published?: boolean
  authorId: string
  author: {
    id: string
    email: string
    name: string
    avatar: string
  }
  tags?: string[]
  categories?: Category[]
  comments?: Comment[]
  createdAt: string
  updatedAt: string
}

export interface CreateBlogRequest {
  title: string
  content: string
  excerpt?: string
  published?: boolean
  categoryIds?: number[]
  tags?: string[]
  authorId: string
}

export interface UpdateBlogRequest {
  title?: string
  content?: string
  excerpt?: string
  published?: boolean
  categoryIds?: number[]
}

export interface Comment {
  id: number
  content: string
  blogId: number
  userId: string
  user?: {
    id: string
    email: string
  }
  userProfile?: {
    firstName?: string
    lastName?: string
    avatar?: string
  }
  createdAt: string
  updatedAt?: string
}

export interface CreateCommentRequest {
  content: string
  userId: string
  blogId?: number
}

export interface UpdateCommentRequest {
  content: string
}

export interface Like {
  id: number
  blogId: number
  userId: number
  createdAt: string
}

export interface Bookmark {
  id: number
  blogId: number
  userId: number
  createdAt: string
}

export interface History {
  id: number
  blogId: number
  userId: number
  createdAt: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryRequest {
  name: string
  slug: string
  description?: string
}

export interface UpdateCategoryRequest {
  name?: string
  slug?: string
  description?: string
}

export interface Follower {
  id: number
  followerId: number
  followingId: number
  follower?: User
  following?: User
  createdAt: string
}

export interface BlogView {
  id: number
  blogId: number
  userId?: number
  ipAddress?: string
  userAgent?: string
  createdAt: string
}

export interface Notification {
  id: number
  userId: number
  type: 'like' | 'comment' | 'follow' | 'mention'
  title: string
  message: string
  read: boolean
  relatedId?: number
  createdAt: string
}

export interface CreateNotificationRequest {
  userId: number
  type: 'like' | 'comment' | 'follow' | 'mention'
  title: string
  message: string
  relatedId?: number
}

export interface Report {
  id: number
  reporterId: number
  reporter?: User
  type: 'blog' | 'comment' | 'user'
  reason: string
  status: 'pending' | 'resolved' | 'dismissed'
  relatedId: number
  createdAt: string
  updatedAt: string
}

export interface CreateReportRequest {
  type: 'blog' | 'comment' | 'user'
  reason: string
  relatedId: number
}

export interface UpdateReportStatusRequest {
  status: 'pending' | 'resolved' | 'dismissed'
}

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
