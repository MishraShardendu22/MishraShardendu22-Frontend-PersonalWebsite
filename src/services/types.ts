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
  comments?: Comment[]
  createdAt: string
  updatedAt: string
}

export interface CreateBlogRequest {
  title: string
  content: string
  excerpt?: string
  published?: boolean
  tags?: string[]
  authorId: string
}

export interface UpdateBlogRequest {
  title?: string
  content?: string
  excerpt?: string
  published?: boolean
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
