import { ReactNode, Suspense } from 'react'
import { ErrorBoundary } from './ErrorBoundary'
import { Spinner } from './Spinner' // We'll create this in the UI section

interface AsyncBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  errorFallback?: ReactNode
  suspenseFallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  resetKeys?: any[]
}

/**
 * Component that combines ErrorBoundary and Suspense for handling both
 * error states and loading states in async components
 */
export function AsyncBoundary({
  children,
  fallback,
  errorFallback,
  suspenseFallback,
  onError,
  resetKeys
}: AsyncBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={errorFallback || fallback}
      onError={onError}
      resetKeys={resetKeys}
    >
      <Suspense fallback={suspenseFallback || fallback || <Spinner />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

export default AsyncBoundary