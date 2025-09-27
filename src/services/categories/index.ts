import backendAPI from '../api'
import {
  ApiResponse,
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  PaginationParams,
  PaginatedResponse,
} from '../types'

export const categoriesService = {
  getCategories: async (
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Category>>> => {
    const response = await backendAPI.get('/categories', { params })
    return response.data
  },

  getCategoryByParam: async (param: string): Promise<ApiResponse<Category>> => {
    const response = await backendAPI.get(`/categories/${param}`)
    return response.data
  },

  createCategory: async (categoryData: CreateCategoryRequest): Promise<ApiResponse<Category>> => {
    const response = await backendAPI.post('/categories', categoryData)
    return response.data
  },

  updateCategory: async (
    id: string,
    categoryData: UpdateCategoryRequest
  ): Promise<ApiResponse<Category>> => {
    const response = await backendAPI.put(`/categories/${id}`, categoryData)
    return response.data
  },

  deleteCategory: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await backendAPI.delete(`/categories/${id}`)
    return response.data
  },
}
