import backendAPI from '../api'
import {
  ApiResponse,
  Report,
  CreateReportRequest,
  UpdateReportStatusRequest,
  PaginationParams,
  PaginatedResponse,
} from '../types'

export const reportsService = {
  getReports: async (params: PaginationParams = {}): Promise<ApiResponse> => {
    const response = await backendAPI.get('/reports', { params })
    return response.data
  },

  getReport: async (reportId: string): Promise<ApiResponse> => {
    const response = await backendAPI.get(`/reports/${reportId}`)
    return response.data
  },

  createReport: async (reportData: CreateReportRequest): Promise<ApiResponse<Report>> => {
    const response = await backendAPI.post('/reports', reportData)
    return response.data
  },

  updateReportStatus: async (
    id: string,
    statusData: UpdateReportStatusRequest
  ): Promise<ApiResponse<Report>> => {
    const response = await backendAPI.put(`/reports/${id}/status`, statusData)
    return response.data
  },
}
