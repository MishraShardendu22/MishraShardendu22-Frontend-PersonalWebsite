import api from './api'
import {
  Project,
  Experience,
  ApiResponse,
  Certification,
  UpdateProjectRequest,
  CreateProjectRequest,
  UpdateExperienceRequest,
  CreateExperienceRequest,
  UpdateCertificationRequest,
  CreateCertificationRequest,
  UpdateVolunteerExperienceRequest,
  CreateVolunteerExperienceRequest,
  SkillsRequest,
  SkillsResponse,
  ProjectDetail,
  ProjectDetailKanban,
  VolunteerExperience,
  AuthRequest,
} from '../data/types.data'

export const authAPI = {
  login: async (credentials: AuthRequest): Promise<any> => {
    const response = await api.post('/admin/auth', credentials)
    return response.data
  },
}

export const skillsAPI = {
  getSkills: async (): Promise<ApiResponse<SkillsResponse>> => {
    const response = await api.get('/skills')
    return response.data
  },

  addSkills: async (skills: SkillsRequest): Promise<ApiResponse<SkillsResponse>> => {
    const response = await api.post('/skills', skills)
    return response.data
  },
}

export const projectsAPI = {
  getAllProjectsKanban: async (): Promise<ApiResponse<ProjectDetail[]>> => {
    const response = await api.get('/projects/kanban')
    return response.data
  },

  updateOrder: async (
    details: ProjectDetailKanban[]
  ): Promise<ApiResponse<ProjectDetailKanban[]>> => {
    // For very large updates (>50 items), consider batch processing
    if (details.length > 50) {
      console.warn(`Large update detected: ${details.length} items. This may take longer.`)
    }

    try {
      // Use extended timeout for bulk operations
      const response = await api.post('/projects/updateOrder', details, {
        timeout: 30000, // 30 seconds for bulk updates
      })
      return response.data
    } catch (error: any) {
      // If timeout occurs with large batches, suggest batch processing
      if (error.code === 'ECONNABORTED' && details.length > 20) {
        console.warn('Large batch update timed out, consider implementing batch processing')
        throw new Error(
          `Update timed out. Try updating fewer items at once (current: ${details.length} items).`
        )
      }
      throw error
    }
  },

  getAllProjects: async (): Promise<ApiResponse<Project[]>> => {
    const response = await api.get('/projects')
    return response.data
  },

  getProjectById: async (id: string): Promise<ApiResponse<Project>> => {
    const response = await api.get(`/projects/${id}`)
    return response.data
  },

  createProject: async (project: CreateProjectRequest): Promise<ApiResponse<Project>> => {
    const response = await api.post('/projects', project)
    return response.data
  },

  updateProject: async (
    id: string,
    project: UpdateProjectRequest
  ): Promise<ApiResponse<Project>> => {
    const response = await api.put(`/projects/${id}`, project)
    return response.data
  },

  deleteProject: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete(`/projects/${id}`)
    return response.data
  },
}

export const experiencesAPI = {
  getAllExperiences: async (): Promise<ApiResponse<Experience[]>> => {
    const response = await api.get('/experiences')
    return response.data
  },

  getExperienceById: async (id: string): Promise<ApiResponse<Experience>> => {
    const response = await api.get(`/experiences/${id}`)
    return response.data
  },

  createExperience: async (
    experience: CreateExperienceRequest
  ): Promise<ApiResponse<Experience>> => {
    const response = await api.post('/experiences', experience)
    return response.data
  },

  updateExperience: async (
    id: string,
    experience: UpdateExperienceRequest
  ): Promise<ApiResponse<Experience>> => {
    const response = await api.put(`/experiences/${id}`, experience)
    return response.data
  },

  deleteExperience: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete(`/experiences/${id}`)
    return response.data
  },
}

export const certificationsAPI = {
  getAllCertifications: async (): Promise<ApiResponse<Certification[]>> => {
    const response = await api.get('/certifications')
    return response.data
  },

  getCertificationById: async (id: string): Promise<ApiResponse<Certification>> => {
    const response = await api.get(`/certifications/${id}`)
    return response.data
  },

  createCertification: async (
    cert: CreateCertificationRequest
  ): Promise<ApiResponse<Certification>> => {
    const response = await api.post('/certifications', cert)
    return response.data
  },

  updateCertification: async (
    id: string,
    cert: UpdateCertificationRequest
  ): Promise<ApiResponse<Certification>> => {
    const response = await api.put(`/certifications/${id}`, cert)
    return response.data
  },

  deleteCertification: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete(`/certifications/${id}`)
    return response.data
  },
}

export const volunteerExperiencesAPI = {
  getAllVolunteerExperiences: async (): Promise<ApiResponse<VolunteerExperience[]>> => {
    const response = await api.get('/volunteer/experiences')
    return response.data
  },

  getVolunteerExperienceById: async (id: string): Promise<ApiResponse<VolunteerExperience>> => {
    const response = await api.get(`/volunteer/experiences/${id}`)
    return response.data
  },

  createVolunteerExperience: async (
    experience: CreateVolunteerExperienceRequest
  ): Promise<ApiResponse<VolunteerExperience>> => {
    const response = await api.post('/volunteer/experiences', experience)
    return response.data
  },

  updateVolunteerExperience: async (
    id: string,
    experience: UpdateVolunteerExperienceRequest
  ): Promise<ApiResponse<VolunteerExperience>> => {
    const response = await api.put(`/volunteer/experiences/${id}`, experience)
    return response.data
  },

  deleteVolunteerExperience: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete(`/volunteer/experiences/${id}`)
    return response.data
  },
}

export const achievementsAPI = certificationsAPI

export const testAPI = {
  testEndpoint: async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.get('/test')
    return response.data
  },
}

export const TimelineAPI = {
  getAllEndpoints: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get('/timeline')
    return response.data
  },
}
