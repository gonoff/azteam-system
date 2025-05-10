import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { apiClient } from './client'
import { cachedApiClient, CacheOptions } from './caching'

/**
 * Generic API service with typed request and response
 * Provides methods for common HTTP operations with consistent error handling
 */

/**
 * Fetch data with GET request
 * @param url - API endpoint URL
 * @param params - Query parameters
 * @param config - Additional axios config
 * @param cache - Cache options
 * @returns Promise with response data
 */
export const fetchData = async <T>(
  url: string,
  params?: any,
  config?: AxiosRequestConfig,
  cache?: CacheOptions
): Promise<T> => {
  const client = cache ? cachedApiClient : apiClient
  const response = await client.get<T>(url, { ...config, params })
  return response.data
}

/**
 * Create data with POST request
 * @param url - API endpoint URL
 * @param data - Data to create
 * @param config - Additional axios config
 * @returns Promise with response data
 */
export const createData = async <T, R = T>(
  url: string,
  data: T,
  config?: AxiosRequestConfig
): Promise<R> => {
  const response = await apiClient.post<T, AxiosResponse<R>>(url, data, config)
  return response.data
}

/**
 * Update data with PUT request
 * @param url - API endpoint URL
 * @param data - Data to update
 * @param config - Additional axios config
 * @returns Promise with response data
 */
export const updateData = async <T, R = T>(
  url: string,
  data: Partial<T>,
  config?: AxiosRequestConfig
): Promise<R> => {
  const response = await apiClient.put<Partial<T>, AxiosResponse<R>>(url, data, config)
  return response.data
}

/**
 * Update data partially with PATCH request
 * @param url - API endpoint URL
 * @param data - Partial data to update
 * @param config - Additional axios config
 * @returns Promise with response data
 */
export const patchData = async <T, R = T>(
  url: string,
  data: Partial<T>,
  config?: AxiosRequestConfig
): Promise<R> => {
  const response = await apiClient.patch<Partial<T>, AxiosResponse<R>>(url, data, config)
  return response.data
}

/**
 * Delete data
 * @param url - API endpoint URL
 * @param config - Additional axios config
 * @returns Promise with response data or void
 */
export const deleteData = async <T = void>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.delete<T>(url, config)
  return response.data
}

// Export default object with all methods
const apiService = {
  fetch: fetchData,
  create: createData,
  update: updateData,
  patch: patchData,
  delete: deleteData,
}

export default apiService