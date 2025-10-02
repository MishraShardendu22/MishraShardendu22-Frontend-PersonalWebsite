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
    try {
      // Temporarily connect directly to backend to bypass proxy issues
      const response = await fetch(
        'https://mishrashardendu22-backend-personalwebsite.onrender.com/api/admin/auth',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        }
      )

      const data = await response.json()

      return data
    } catch (error: any) {
      console.error('authAPI.login error:', error)
      console.error('Error message:', error?.message)
      throw error
    }
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
    const response = await api.post('/projects/updateOrder', details)
    return response.data
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
