/**
 * Project-related models and types
 */

import { EntityWithMetadata } from './base.models'
import { CreateRequest, UpdateRequest } from './api.models'

/**
 * Project entity with complete data structure
 */
export interface Project extends EntityWithMetadata {
  images: string[]
  stats?: Record<string, unknown>
  project_name: string
  title?: string
  small_description: string
  description: string
  skills: string[]
  project_repository: string
  project_live_link: string
  project_video: string
}

/**
 * Simplified project interface for hero/showcase components
 */
export interface HeroProject {
  title: string
  description: string
  link: string
  thumbnail: string
  skills?: string[]
}

/**
 * Request types for project CRUD operations
 */
export type CreateProjectRequest = CreateRequest<Project>
export type UpdateProjectRequest = UpdateRequest<Project>
