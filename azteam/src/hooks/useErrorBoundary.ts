import { useState, useCallback } from 'react'

interface UseErrorBoundaryProps {
  onError?: (error: Error, info: { componentStack: string }) => void
}

/**
 * Hook to use ErrorBoundary functionality within functional components
 * @param options - Error handling options
 * @returns - Error handling utilities
 */
export function useErrorBoundary(options: UseErrorBoundaryProps = {}) {
  const [error, setError] = useState<Error | null>(null)

  const resetBoundary = useCallback(() => {
    setError(null)
  }, [])

  const showBoundary = useCallback((error: Error) => {
    setError(error)
    
    if (options.onError) {
      options.onError(error, { componentStack: error.stack || '' })
    }
  }, [options])

  return {
    error,
    resetBoundary,
    showBoundary,
  }
}

export default useErrorBoundary