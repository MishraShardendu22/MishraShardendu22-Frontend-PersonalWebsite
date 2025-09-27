import backendAPI from '../api'
import { ApiResponse } from '../types'

export const likesService = {
  likeBlog: async (blogId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await backendAPI.post(`/blogs/${blogId}/like`)
    return response.data
  },

  unlikeBlog: async (blogId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await backendAPI.post(`/blogs/${blogId}/unlike`)
    return response.data
  },
}
