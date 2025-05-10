import { IS_DEV } from '@/utils/env'

// Error logging interface
export interface ErrorLoggerOptions {
  context?: string
  tags?: Record<string, string>
  user?: {
    id?: string
    name?: string
    email?: string
  }
  metadata?: Record<string, any>
}

/**
 * Error logging service for centralized error handling
 * In a real application, this would send errors to a service like Sentry or LogRocket
 */
class ErrorService {
  private isEnabled: boolean
  private previousErrors: Set<string> = new Set()
  
  constructor() {
    this.isEnabled = !IS_DEV
  }
  
  /**
   * Enable or disable error logging
   */
  enable(enabled: boolean = true) {
    this.isEnabled = enabled
  }
  
  /**
   * Log an error to the console and potentially to an external service
   */
  logError(error: Error | string, options: ErrorLoggerOptions = {}) {
    const errorMessage = typeof error === 'string' ? error : error.message
    const errorStack = typeof error === 'string' ? new Error().stack : error.stack
    
    // Create an error ID to prevent duplicate reports
    const errorId = `${errorMessage}::${
      options.context || ''
    }::${JSON.stringify(options.metadata || {})}`
    
    // Skip if we've already logged this exact error recently
    if (this.previousErrors.has(errorId)) {
      return
    }
    
    // Add to recent errors
    this.previousErrors.add(errorId)
    if (this.previousErrors.size > 100) {
      // Prevent memory leaks by limiting the size
      this.previousErrors.clear()
    }
    
    // Always log to console in development
    if (IS_DEV || !this.isEnabled) {
      console.error(`[ERROR${options.context ? ` - ${options.context}` : ''}]`, error)
      
      if (options.metadata) {
        console.error('Error metadata:', options.metadata)
      }
      
      return
    }
    
    // In production, we would send this to an error monitoring service
    // Example with a hypothetical API:
    // this.reportToErrorService(errorMessage, errorStack, options)
    
    // For now, just log to console in production as well
    console.error(`[ERROR]`, error)
  }
  
  /**
   * Log an error from a React component with component stack
   */
  logComponentError(error: Error, errorInfo: React.ErrorInfo, options: ErrorLoggerOptions = {}) {
    this.logError(error, {
      ...options,
      context: options.context || 'React Component',
      metadata: {
        ...options.metadata,
        componentStack: errorInfo.componentStack
      }
    })
  }
  
  /**
   * Log an API error with request details
   */
  logApiError(error: any, url: string, method: string, options: ErrorLoggerOptions = {}) {
    this.logError(error, {
      ...options,
      context: options.context || 'API Request',
      metadata: {
        ...options.metadata,
        url,
        method
      }
    })
  }
  
  /**
   * Hypothetical method to send errors to an external service
   * Would be implemented with actual error reporting service
   */
  // private reportToErrorService(
  //   message: string,
  //   stack?: string,
  //   options?: ErrorLoggerOptions
  // ) {
  //   // Implementation would depend on the service used
  //   // Example: Sentry.captureException(...)
  // }
}

// Create singleton instance
export const errorService = new ErrorService()

export default errorService