import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { IS_DEV } from '@/utils/env'

// Create Query Client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Common defaults for all queries
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1, // Retry failed queries once
      refetchOnWindowFocus: true,
    },
    mutations: {
      // Common defaults for all mutations
      retry: 0, // Don't retry failed mutations
    },
  },
})

interface QueryProviderProps {
  children: ReactNode
}

/**
 * React Query Provider with sensible defaults
 */
export const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

export default QueryProvider