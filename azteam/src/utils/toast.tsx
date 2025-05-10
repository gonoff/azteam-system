import { toast, ToastT } from 'sonner'
import React from 'react'

/**
 * Toast types for consistent styling
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning'

/**
 * Options for toast notifications
 */
export interface ToastOptions extends Omit<ToastT, 'id'> {
  title?: string
  description?: string
  duration?: number
}

/**
 * Default durations for different types of toasts (in milliseconds)
 */
const DEFAULT_DURATIONS = {
  success: 3000,
  error: 5000,
  info: 4000,
  warning: 4000,
}

/**
 * Centralized toast utility for consistent notifications
 */

/**
 * Show a success toast
 * @param message - Success message
 * @param options - Toast options
 */
function success(message: string, options?: ToastOptions) {
  return toast.success(message, {
    duration: DEFAULT_DURATIONS.success,
    ...options,
  })
}

/**
 * Show an error toast
 * @param message - Error message
 * @param options - Toast options
 */
function error(message: string, options?: ToastOptions) {
  return toast.error(message, {
    duration: DEFAULT_DURATIONS.error,
    ...options,
  })
}

/**
 * Show an info toast
 * @param message - Info message
 * @param options - Toast options
 */
function info(message: string, options?: ToastOptions) {
  return toast.info(message, {
    duration: DEFAULT_DURATIONS.info,
    ...options,
  })
}

/**
 * Show a warning toast
 * @param message - Warning message
 * @param options - Toast options
 */
function warning(message: string, options?: ToastOptions) {
  return toast.warning(message, {
    duration: DEFAULT_DURATIONS.warning,
    ...options,
  })
}

/**
 * Show a promise toast with loading, success, and error states
 */
function promise<T>(
  promise: Promise<T>,
  {
    loading,
    success,
    error,
    ...options
  }: {
    loading: string
    success: string | ((data: T) => string)
    error: string | ((error: any) => string)
  } & ToastOptions
) {
  return toast.promise(promise, {
    loading,
    success,
    error,
    ...options,
  })
}

/**
 * Dismiss all toasts or a specific toast by ID
 */
function dismiss(toastId?: string | number) {
  if (toastId) {
    toast.dismiss(toastId)
  } else {
    toast.dismiss()
  }
}

/**
 * Custom toast with title and description
 */
function custom(
  type: ToastType,
  title: string,
  description?: string,
  options?: ToastOptions
) {
  const method = toast[type] || toast
  
  return method(
    <div>
      <p className="font-medium">{title}</p>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>,
    {
      duration: DEFAULT_DURATIONS[type],
      ...options,
    }
  )
}

// Export toast utilities
export const toastService = {
  success,
  error,
  info,
  warning,
  promise,
  dismiss,
  custom,
  
  // Re-export raw toast for advanced usage
  raw: toast,
}

export default toastService