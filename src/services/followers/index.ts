import backendAPI from '../api'
import { ApiResponse } from '../types'

export const followersService = {
  followUser: async (userId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await backendAPI.post(`/users/${userId}/follow`)
    return response.data
  },

  unfollowUser: async (userId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await backendAPI.post(`/users/${userId}/unfollow`)
    return response.data
  },
}
