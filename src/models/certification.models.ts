/**
 * Certification and achievement models
 */

import { EntityWithMetadata } from './base.models'
import { CreateRequest, UpdateRequest } from './api.models'

/**
 * Certification/Achievement entity
 */
export interface Certification extends EntityWithMetadata {
  title: string
  description: string
  projects: string[]
  skills: string[]
  certificate_url: string
  images: string[]
  issuer: string
  issue_date: string
  expiry_date: string
}

/**
 * Request types for certification CRUD operations
 */
export type CreateCertificationRequest = CreateRequest<Certification>
export type UpdateCertificationRequest = UpdateRequest<Certification>

/**
 * Achievement type aliases (same as Certification)
 */
export type Achievement = Certification
export type CreateAchievementRequest = CreateCertificationRequest
export type UpdateAchievementRequest = UpdateCertificationRequest
