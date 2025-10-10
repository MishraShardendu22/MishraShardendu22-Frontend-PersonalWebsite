import { ApiResponse, Blog, CreateBlogRequest, UpdateBlogRequest, PaginationParams } from '../types'
import axios from 'axios'

const localAPI = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const blogsService = {
  getBlogs: async (params?: PaginationParams): Promise<ApiResponse<Blog[]>> => {
    const response = await localAPI.get('/blogs', { params })
    return response.data
  },

  getBlogById: async (id: string): Promise<ApiResponse<Blog>> => {
    const response = await localAPI.get(`/blogs/${id}`)
    return response.data
  },

  createBlog: async (blogData: CreateBlogRequest): Promise<ApiResponse<Blog>> => {
    const response = await localAPI.post('/blogs', blogData)
    return response.data
  },

  updateBlog: async (id: string, blogData: UpdateBlogRequest): Promise<ApiResponse<Blog>> => {
    const response = await localAPI.put(`/blogs/${id}`, blogData)
    return response.data
  },

  deleteBlog: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await localAPI.delete(`/blogs/${id}`)
    return response.data
  },

  getBlogComments: async (id: string, params?: PaginationParams): Promise<ApiResponse<any[]>> => {
    const response = await localAPI.get(`/blogs/${id}/comments`, { params })
    return response.data
  },

  addBlogComment: async (
    id: string,
    commentData: { content: string; userId: string }
  ): Promise<ApiResponse<any>> => {
    const response = await localAPI.post(`/blogs/${id}/comments`, commentData)
    return response.data
  },

  getBlogStats: async (): Promise<ApiResponse<any>> => {
    const response = await localAPI.get('/blogs/stats')
    return response.data
  },
}
