import { useQuery, useMutation, useQueryClient, QueryKey, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { AxiosRequestConfig } from 'axios'
import apiService from './apiService'
import { ApiError } from './client'
import { CacheOptions } from './caching'
import { toast } from 'sonner'

/**
 * Collection of React Query hooks for API operations
 * These hooks provide type-safe, consistent API interactions with React Query
 */

/**
 * Hook for fetching data with React Query
 */
export const useFetchQuery = <TData = unknown, TError = ApiError>(
  queryKey: QueryKey,
  url: string,
  params?: any,
  options?: UseQueryOptions<TData, TError>,
  axiosConfig?: AxiosRequestConfig,
  cacheOptions?: CacheOptions
) => {
  return useQuery<TData, TError>({
    queryKey,
    queryFn: async () => apiService.fetch<TData>(url, params, axiosConfig, cacheOptions),
    ...options,
  })
}

/**
 * Hook for creating data with React Query mutations
 */
export const useCreateMutation = <TData = unknown, TError = ApiError, TVariables = any, TContext = unknown>(
  url: string,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>,
  axiosConfig?: AxiosRequestConfig
) => {
  const queryClient = useQueryClient()
  
  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn: (data) => apiService.create<TVariables, TData>(url, data, axiosConfig),
    onSuccess: (data, variables, context) => {
      // Show success toast if not disabled
      if (axiosConfig?.headers?.['suppress-success-toast'] !== 'true') {
        toast.success('Successfully created')
      }
      
      // Call user provided onSuccess callback
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

/**
 * Hook for updating data with React Query mutations
 */
export const useUpdateMutation = <TData = unknown, TError = ApiError, TVariables = any, TContext = unknown>(
  url: string,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>,
  axiosConfig?: AxiosRequestConfig
) => {
  const queryClient = useQueryClient()
  
  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn: (data) => apiService.update<TVariables, TData>(url, data, axiosConfig),
    onSuccess: (data, variables, context) => {
      // Show success toast if not disabled
      if (axiosConfig?.headers?.['suppress-success-toast'] !== 'true') {
        toast.success('Successfully updated')
      }
      
      // Call user provided onSuccess callback
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

/**
 * Hook for patching data with React Query mutations
 */
export const usePatchMutation = <TData = unknown, TError = ApiError, TVariables = any, TContext = unknown>(
  url: string,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>,
  axiosConfig?: AxiosRequestConfig
) => {
  const queryClient = useQueryClient()
  
  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn: (data) => apiService.patch<TVariables, TData>(url, data, axiosConfig),
    onSuccess: (data, variables, context) => {
      // Show success toast if not disabled
      if (axiosConfig?.headers?.['suppress-success-toast'] !== 'true') {
        toast.success('Successfully updated')
      }
      
      // Call user provided onSuccess callback
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

/**
 * Hook for deleting data with React Query mutations
 */
export const useDeleteMutation = <TData = unknown, TError = ApiError, TVariables = any, TContext = unknown>(
  url: string,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>,
  axiosConfig?: AxiosRequestConfig
) => {
  const queryClient = useQueryClient()
  
  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn: () => apiService.delete<TData>(url, axiosConfig),
    onSuccess: (data, variables, context) => {
      // Show success toast if not disabled
      if (axiosConfig?.headers?.['suppress-success-toast'] !== 'true') {
        toast.success('Successfully deleted')
      }
      
      // Call user provided onSuccess callback
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}