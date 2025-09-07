/**
 * Legacy types file - maintained for backward compatibility
 * @deprecated Prefer importing from @/models instead
 * This file re-exports from the new consolidated models
 */

// Re-export all types from the new consolidated models
export * from '@/models'

// Legacy experience types with backward compatibility
export interface Experience {
  inline: {
    id: string
    created_at: string
    updated_at: string
  }
  images: string[]
  projects: string[]
  created_by: string
  description: string
  technologies: string[]
  company_name: string
  company_logo: string
  certificate_url: string
  experience_time_line: ExperienceTimeLine[]
}

export interface VolunteerExperience {
  inline: {
    id: string
    created_at: string
    updated_at: string
  }
  images: string[]
  projects: string[]
  created_by: string
  description: string
  technologies: string[]
  organisation: string
  organisation_logo: string
  volunteer_time_line: VolunteerExperienceTimeLine[]
}

// Legacy timeline types
export interface ExperienceTimeLine {
  position: string
  start_date: string
  end_date: string
}

export interface VolunteerExperienceTimeLine {
  position: string
  start_date: string
  end_date: string
}

// Legacy API Response Types
export interface ExperienceListResponse {
  data: Experience[]
  message: string
  status: number
}

export interface ExperienceResponse {
  data: Experience
  message: string
  status: number
}
