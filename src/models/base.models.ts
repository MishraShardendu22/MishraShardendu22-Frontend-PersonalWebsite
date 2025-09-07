/**
 * Base shared types and interfaces
 */

/**
 * Standard entity metadata included in all database entities
 */
export interface EntityMetadata {
  id: string
  created_at: string
  updated_at: string
}

/**
 * Wrapper for entity data with metadata
 */
export interface EntityWithMetadata<T = Record<string, unknown>> {
  inline: EntityMetadata
  data?: T
}

/**
 * Generic timeline interface for experiences, volunteer work, etc.
 */
export interface Timeline {
  position: string
  start_date: string
  end_date: string
}

/**
 * Common properties for content entities (projects, experiences, certifications)
 */
export interface ContentEntity {
  images: string[]
  projects: string[]
  description: string
  technologies: string[]
}

/**
 * Organization-related entity properties
 */
export interface OrganizationEntity {
  name: string
  logo: string
  url?: string
}
