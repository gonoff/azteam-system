import { AxiosRequestConfig } from 'axios'
import { setupCache } from 'axios-cache-adapter'
import { createApiClient } from './client'
import { nanoid } from 'nanoid'

// Define cache configuration options
export interface CacheOptions {
  // Time to keep the cache in milliseconds
  ttl?: number
  // If true, the cache will be excluded for this request
  exclude?: boolean
  // A function to generate a custom cache key
  key?: (config: AxiosRequestConfig) => string
  // If true, the cache will be updated after the request
  update?: boolean
}

/**
 * Create a unique cache key based on request parameters
 */
const createCacheKey = (config: AxiosRequestConfig): string => {
  const { method, url, params, data } = config
  
  // Generate a stable key for GET requests with query params
  if (method?.toLowerCase() === 'get') {
    return `${method}:${url}:${JSON.stringify(params || {})}`
  }
  
  // For POST/PUT/PATCH requests with body
  if (data && ['post', 'put', 'patch'].includes(method?.toLowerCase() || '')) {
    return `${method}:${url}:${JSON.stringify(data)}`
  }
  
  // Default
  return `${method}:${url}:${nanoid(6)}`
}

// Set up cache adapter with default settings
const cache = setupCache({
  // Default 5 minutes cache
  maxAge: 5 * 60 * 1000,
  // Exclude PUT, POST, DELETE, PATCH by default
  exclude: {
    methods: ['put', 'post', 'delete', 'patch']
  },
  // Use our custom cache key generator
  key: createCacheKey,
  // Log cache operations in dev mode
  debug: process.env.NODE_ENV !== 'production',
  // Clear cache when browser is closed
  clearOnStale: true,
  // Handle cache errors gracefully
  clearOnError: true,
})

/**
 * Create a cached API client with custom cache options
 * @param options - Cache configuration options
 * @returns An axios instance with caching enabled
 */
export const createCachedApiClient = (options: CacheOptions = {}) => {
  const { ttl, exclude, key, update } = options
  
  const cacheConfig = {
    adapter: cache.adapter,
    cache: {
      maxAge: ttl || 5 * 60 * 1000, // Default 5 minutes
      exclude: { 
        // Never cache 4xx/5xx responses
        statusCode: exclude ? false : excludeErrorResponses, 
      },
      key: key || createCacheKey,
      update: update || false,
    }
  }
  
  return createApiClient(cacheConfig)
}

/**
 * Exclude 4xx and 5xx responses from being cached
 */
const excludeErrorResponses = (response: any) => {
  return response.status >= 400
}

// Export default cached client with default settings
export const cachedApiClient = createCachedApiClient()

/**
 * Clear the API cache
 * @param filter - Optional URL pattern to selectively clear cache
 */
export const clearApiCache = (filter?: string) => {
  if (filter) {
    // Clear only matching cache entries
    Object.keys(cache.store.store)
      .filter(key => key.includes(filter))
      .forEach(key => {
        cache.store.remove(key)
      })
  } else {
    // Clear entire cache
    cache.store.clear()
  }
}