/**
 * Consolidated experience models for both work and volunteer experiences
 */

import { EntityWithMetadata, Timeline, ContentEntity, OrganizationEntity } from './base.models'
import { CreateRequest, UpdateRequest } from './api.models'

/**
 * Generic experience entity that can represent both work and volunteer experiences
 */
export interface BaseExperience extends EntityWithMetadata, ContentEntity {
  created_by: string
  organization: OrganizationEntity
  timeline: Timeline[]
  type: 'work' | 'volunteer'
  certificate_url?: string
}

/**
 * Work experience with company-specific properties
 */
export interface WorkExperience extends BaseExperience {
  type: 'work'
  organization: OrganizationEntity & {
    name: string // company_name
    logo: string // company_logo
  }
  certificate_url: string
}

/**
 * Volunteer experience with organization-specific properties
 */
export interface VolunteerExperience extends BaseExperience {
  type: 'volunteer'
  organization: OrganizationEntity & {
    name: string // organisation
    logo: string // organisation_logo
  }
}

/**
 * Union type for all experience types
 */
export type Experience = WorkExperience | VolunteerExperience

/**
 * Request types for creating/updating experiences
 */
export type CreateWorkExperienceRequest = CreateRequest<WorkExperience>
export type UpdateWorkExperienceRequest = UpdateRequest<WorkExperience>
export type CreateVolunteerExperienceRequest = CreateRequest<VolunteerExperience>
export type UpdateVolunteerExperienceRequest = UpdateRequest<VolunteerExperience>

/**
 * Generic experience request types
 */
export type CreateExperienceRequest = CreateWorkExperienceRequest | CreateVolunteerExperienceRequest
export type UpdateExperienceRequest = UpdateWorkExperienceRequest | UpdateVolunteerExperienceRequest

/**
 * Legacy type aliases for backward compatibility
 * @deprecated Use the new consolidated types instead
 */
export type ExperienceTimeLine = Timeline
export type VolunteerExperienceTimeLine = Timeline
