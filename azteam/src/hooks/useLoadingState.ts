import { useState, useCallback } from 'react'

/**
 * Hook for managing loading states with a minimum loading time
 * to prevent flickering for fast operations
 */
export function useLoadingState(initialState = false, minLoadingTime = 500) {
  const [isLoading, setIsLoading] = useState(initialState)
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null)

  /**
   * Start loading with a guaranteed minimum duration
   */
  const startLoading = useCallback(() => {
    setIsLoading(true)
    setLoadingStartTime(Date.now())
  }, [])

  /**
   * End loading, respecting the minimum loading time
   */
  const endLoading = useCallback(() => {
    const currentTime = Date.now()
    const timeElapsed = loadingStartTime ? currentTime - loadingStartTime : 0

    if (timeElapsed >= minLoadingTime) {
      // If minimum time has passed, end loading immediately
      setIsLoading(false)
      setLoadingStartTime(null)
    } else {
      // Otherwise, wait for the remaining time
      const remainingTime = minLoadingTime - timeElapsed
      setTimeout(() => {
        setIsLoading(false)
        setLoadingStartTime(null)
      }, remainingTime)
    }
  }, [loadingStartTime, minLoadingTime])

  /**
   * Reset loading state
   */
  const resetLoading = useCallback(() => {
    setIsLoading(false)
    setLoadingStartTime(null)
  }, [])

  /**
   * Wrap an async function with loading state
   */
  const withLoading = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T> => {
      try {
        startLoading()
        const result = await fn()
        endLoading()
        return result
      } catch (error) {
        endLoading()
        throw error
      }
    },
    [startLoading, endLoading]
  )

  return {
    isLoading,
    startLoading,
    endLoading,
    resetLoading,
    withLoading,
  }
}

export default useLoadingState