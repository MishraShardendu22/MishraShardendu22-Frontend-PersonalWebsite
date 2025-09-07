/**
 * API response and request patterns
 */

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
  message: string
  data: T
  error?: string
  status?: number
}

/**
 * List response with pagination support
 */
export interface ApiListResponse<T = unknown> extends ApiResponse<T[]> {
  pagination?: {
    total: number
    page: number
    limit: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

/**
 * Generic CRUD request types
 */
export type CreateRequest<T> = Omit<T, 'inline'>
export type UpdateRequest<T> = Partial<CreateRequest<T>>
export type DeleteRequest = {
  id: string
}

/**
 * Authentication request/response types
 */
export interface AuthRequest {
  email: string
  password: string
  admin_pass: string
}

export interface AuthResponse {
  token: string
  data: {
    _id: string
    email: string
    skills: string[]
    projects: string[]
    experiences: string[]
  }
}
