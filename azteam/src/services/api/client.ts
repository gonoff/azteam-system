import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { API_URL, API_TIMEOUT, IS_DEV } from '@/utils/env'
import { toast } from 'sonner'

// Define error types for better handling
export interface ApiError {
  status: number
  message: string
  code?: string
  errors?: Record<string, string[]>
  timestamp?: string
  path?: string
}

// Create a default config for the API client
const defaultConfig: AxiosRequestConfig = {
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
}

/**
 * Creates an Axios instance with interceptors for consistent error handling
 * @param config - Custom axios config to override defaults
 * @returns Configured Axios instance
 */
export const createApiClient = (config: AxiosRequestConfig = {}): AxiosInstance => {
  // Create a new axios instance with merged configs
  const client = axios.create({
    ...defaultConfig,
    ...config,
  })

  // Request interceptor - modify requests before they're sent
  client.interceptors.request.use(
    (config) => {
      // Get the auth token from somewhere (will be implemented in auth service)
      // const token = getToken()
      // if (token) {
      //   config.headers.Authorization = `Bearer ${token}`
      // }
      
      // Log requests in development
      if (IS_DEV) {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
      }
      
      return config
    },
    (error) => {
      if (IS_DEV) {
        console.error('❌ Request Error:', error)
      }
      return Promise.reject(error)
    }
  )

  // Response interceptor - process responses/errors before they reach the calling code
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Add additional response processing here if needed
      if (IS_DEV) {
        console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, 
          response.status)
      }
      return response
    },
    (error: AxiosError) => {
      // Transform error for consistent handling
      const apiError = parseApiError(error)
      
      // Log detailed errors in development
      if (IS_DEV) {
        console.error('❌ API Error:', apiError)
      }
      
      // Handle authentication errors
      if (apiError.status === 401) {
        // Will be implemented in auth service
        // refreshTokenOrLogout()
      }
      
      // Show toast for server errors (5xx) if not handled by the component
      if (apiError.status >= 500 && error.config?.headers?.['suppress-error-toast'] !== 'true') {
        toast.error('Server error occurred. Please try again later.')
      }
      
      return Promise.reject(apiError)
    }
  )

  return client
}

/**
 * Parse Axios errors into a consistent format
 */
export const parseApiError = (error: AxiosError): ApiError => {
  // Network errors
  if (error.code === 'ECONNABORTED') {
    return {
      status: 0,
      message: 'Request timed out. Please check your connection.',
    }
  }
  
  if (!error.response) {
    return {
      status: 0,
      message: 'Network error. Please check your connection.',
    }
  }
  
  // Server returned an error response (4xx, 5xx)
  const { status } = error.response
  
  // Try to parse response data
  let errorData = {} as any
  
  try {
    errorData = error.response.data || {}
  } catch (e) {
    errorData = {}
  }
  
  // Standard API error format
  return {
    status,
    message: errorData.message || getDefaultErrorMessage(status),
    code: errorData.code,
    errors: errorData.errors,
    timestamp: errorData.timestamp,
    path: errorData.path,
  }
}

/**
 * Get a default error message for HTTP status codes
 */
const getDefaultErrorMessage = (status: number): string => {
  switch (status) {
    case 400:
      return 'Bad request. Please check your input.'
    case 401:
      return 'You need to be logged in to access this resource.'
    case 403:
      return 'You do not have permission to access this resource.'
    case 404:
      return 'The requested resource was not found.'
    case 422:
      return 'Validation error. Please check your input.'
    case 429:
      return 'Too many requests. Please try again later.'
    case 500:
      return 'Server error occurred. Please try again later.'
    case 503:
      return 'Service unavailable. Please try again later.'
    default:
      return 'An error occurred. Please try again.'
  }
}

// Export default API client instance
export const apiClient = createApiClient()