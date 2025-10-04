import backendAPI from '../api'
import {
  ApiResponse,
  Blog,
  CreateBlogRequest,
  UpdateBlogRequest,
  PaginationParams,
  PaginatedResponse,
} from '../types'
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

  getBlogCategories: async (id: string): Promise<ApiResponse<any[]>> => {
    const response = await localAPI.get(`/blogs/${id}/categories`)
    return response.data
  },

  addBlogCategory: async (
    id: string,
    categoryId: number
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await localAPI.post(`/blogs/${id}/categories`, { categoryId })
    return response.data
  },

  removeBlogCategory: async (
    id: string,
    categoryId: number
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await localAPI.delete(`/blogs/${id}/categories/${categoryId}`)
    return response.data
  },

  getBlogRevisions: async (
    id: string,
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<any>>> => {
    const response = await localAPI.get(`/blogs/${id}/revisions`, { params })
    return response.data
  },

  createBlogRevision: async (
    id: string,
    revisionData: { content: string; version: string }
  ): Promise<ApiResponse<any>> => {
    const response = await localAPI.post(`/blogs/${id}/revisions`, revisionData)
    return response.data
  },

  getBlogRevision: async (id: string, version: string): Promise<ApiResponse<any>> => {
    const response = await localAPI.get(`/blogs/${id}/revisions/${version}`)
    return response.data
  },

  getBlogStats: async (): Promise<ApiResponse<any>> => {
    const response = await localAPI.get('/blogs/stats')
    return response.data
  },
}
