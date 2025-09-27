import backendAPI from '../api'
import {
  ApiResponse,
  Notification,
  CreateNotificationRequest,
  PaginationParams,
  PaginatedResponse,
} from '../types'

export const notificationsService = {
  getNotificationById: async (id: string): Promise<ApiResponse<Notification>> => {
    const response = await backendAPI.get(`/notifications/${id}`)
    return response.data
  },

  markNotificationRead: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await backendAPI.post(`/notifications/${id}/read`)
    return response.data
  },

  deleteNotification: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await backendAPI.delete(`/notifications/${id}`)
    return response.data
  },

  createNotification: async (
    notificationData: CreateNotificationRequest
  ): Promise<ApiResponse<Notification>> => {
    const response = await backendAPI.post('/notifications', notificationData)
    return response.data
  },
}
