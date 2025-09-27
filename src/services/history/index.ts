import backendAPI from '../api'
import { ApiResponse } from '../types'

export const historyService = {
  addToHistory: async (blogId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await backendAPI.post(`/blogs/${blogId}/history`)
    return response.data
  },
}
