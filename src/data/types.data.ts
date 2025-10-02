export interface CommitData {
  date: string
  count: number
}

export interface GitHubData {
  name?: string
  location?: string
  bio?: string
  followers: number
  public_repos: number
}

export interface LeetCodeData {
  profile: {
    realName?: string
    ranking: number
  }
  submitStats: {
    acSubmissionNum: Array<{ count: number }>
  }
}

export interface Repository {
  name: string
  url: string
  stars: number
}

export interface DashboardData {
  github?: GitHubData
  leetcode?: LeetCodeData
  commits?: CommitData[]
  languages?: Record<string, number>
  stars?: number
  topRepos?: Repository[]
}

export interface ChartTheme {
  text: string
  grid: string
  background: string
  primary: string
}

export interface ApiResponse<T> {
  message: string
  data: T
  error?: string
  status?: number
}

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

export interface User {
  email: string
  skills: string[]
  projects: string[]
  experiences: string[]
  certifications: string[]
}

export interface SkillsRequest {
  skills: string[]
}

export interface SkillsResponse {
  skills: string[]
}

export interface ProfileData {
  inline: {
    id: string
    created_at: string
    updated_at: string
  }
  email: string
  password: string
  admin_pass: string
  skills: string[]
  projects: string[]
  experiences: string[]
  certifications?: string[] | null
}

export interface ExperienceFormData {
  company_name: string
  position: string
  start_date: string
  end_date: string
  description: string
  technologies: string[]
  company_logo: string
  certificate_url: string
  projects: string[]
  images: string
}

export interface Project {
  inline: {
    id: string
    created_at: string
    updated_at: string
  }
  order: number
  images: string[]
  stats?: any
  project_name: string
  title?: string
  small_description: string
  description: string
  skills: string[]
  project_repository: string
  project_live_link: string
  project_video: string
}

export interface CreateProjectRequest {
  project_name: string
  small_description: string
  description: string
  skills: string[]
  project_repository: string
  project_live_link: string
  project_video: string
}

export interface ExperienceTimeLine {
  position: string
  start_date: string
  end_date: string
}

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

export interface CreateExperienceRequest {
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

export interface Certification {
  inline: {
    id: string
    created_at: string
    updated_at: string
  }
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

export interface CreateCertificationRequest {
  title: string
  description: string
  issuer: string
  skills: string[]
  projects: string[]
  certificate_url: string
  images: string[]
  issue_date: string
  expiry_date: string
}

export interface VolunteerExperienceTimeLine {
  position: string
  start_date: string
  end_date: string
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

export interface CreateVolunteerExperienceRequest {
  images: string[]
  projects: string[]
  created_by: string
  description: string
  technologies: string[]
  organisation: string
  organisation_logo: string
  volunteer_time_line: VolunteerExperienceTimeLine[]
}

export interface ProjectDetail {
  order: number
  project_id: string
  project_title: string
}

export interface ProjectDetailKanban {
  order: number
  project_id: string
}

export type Achievement = Certification
export type UpdateProjectRequest = CreateProjectRequest
export type UpdateExperienceRequest = CreateExperienceRequest
export type CreateAchievementRequest = CreateCertificationRequest
export type UpdateAchievementRequest = UpdateCertificationRequest
export type UpdateCertificationRequest = CreateCertificationRequest
export type UpdateVolunteerExperienceRequest = CreateVolunteerExperienceRequest
