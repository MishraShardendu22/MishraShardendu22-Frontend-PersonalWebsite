/**
 * User and profile-related models
 */

import { EntityMetadata } from './base.models'

/**
 * User profile data
 */
export interface User {
  email: string
  skills: string[]
  projects: string[]
  experiences: string[]
  certifications: string[]
}

/**
 * Complete profile data with metadata
 */
export interface ProfileData {
  inline: EntityMetadata
  email: string
  password: string
  admin_pass: string
  skills: string[]
  projects: string[]
  experiences: string[]
  certifications?: string[] | null
}

/**
 * Skills-related request/response types
 */
export interface SkillsRequest {
  skills: string[]
}

export interface SkillsResponse {
  skills: string[]
}
