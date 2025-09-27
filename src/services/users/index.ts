import backendAPI from '../api'
import {
  ApiResponse,
  User,
  CreateUserRequest,
  UpdateUserRequest,
  Profile,
  UpdateProfileRequest,
  PaginationParams,
  PaginatedResponse,
} from '../types'

export const usersService = {
  getUsers: async (params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<User>>> => {
    const response = await backendAPI.get('/users', { params })
    return response.data
  },

  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await backendAPI.get(`/users/${id}`)
    return response.data
  },

  createUser: async (userData: CreateUserRequest): Promise<ApiResponse<User>> => {
    const response = await backendAPI.post('/users', userData)
    return response.data
  },

  updateUser: async (id: string, userData: UpdateUserRequest): Promise<ApiResponse<User>> => {
    const response = await backendAPI.put(`/users/${id}`, userData)
    return response.data
  },

  deleteUser: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await backendAPI.delete(`/users/${id}`)
    return response.data
  },

  getUserProfile: async (id: string): Promise<ApiResponse<Profile>> => {
    const response = await backendAPI.get(`/users/${id}/profile`)
    return response.data
  },

  updateUserProfile: async (
    id: string,
    profileData: UpdateProfileRequest
  ): Promise<ApiResponse<Profile>> => {
    const response = await backendAPI.put(`/users/${id}/profile`, profileData)
    return response.data
  },

  getUserBookmarks: async (
    id: string,
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<any>>> => {
    const response = await backendAPI.get(`/users/${id}/bookmarks`, { params })
    return response.data
  },

  getUserHistory: async (
    id: string,
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<any>>> => {
    const response = await backendAPI.get(`/users/${id}/history`, { params })
    return response.data
  },

  getUserNotifications: async (
    id: string,
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<any>>> => {
    const response = await backendAPI.get(`/users/${id}/notifications`, { params })
    return response.data
  },

  followUser: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await backendAPI.post(`/users/${id}/follow`)
    return response.data
  },

  unfollowUser: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await backendAPI.post(`/users/${id}/unfollow`)
    return response.data
  },

  getUserFollowers: async (
    id: string,
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<any>>> => {
    const response = await backendAPI.get(`/users/${id}/followers`, { params })
    return response.data
  },

  getUserFollowing: async (
    id: string,
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<any>>> => {
    const response = await backendAPI.get(`/users/${id}/following`, { params })
    return response.data
  },
}
