import backendAPI from '../api'
import { ApiResponse } from '../types'

export const bookmarksService = {
  bookmarkBlog: async (blogId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await backendAPI.post(`/blogs/${blogId}/bookmark`)
    return response.data
  },

  unbookmarkBlog: async (blogId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await backendAPI.post(`/blogs/${blogId}/unbookmark`)
    return response.data
  },
}
