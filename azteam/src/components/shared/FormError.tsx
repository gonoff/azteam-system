import { ReactNode } from 'react'
import { AlertCircle, XCircle } from 'lucide-react'
import { FieldError, FieldErrors } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { toast } from '@/utils'

interface FormErrorProps {
  error?: FieldError | string
  className?: string
}

/**
 * Component for displaying form field errors
 */
export function FormError({ error, className }: FormErrorProps) {
  if (!error) return null

  const errorMessage = typeof error === 'string' ? error : error.message

  return (
    <div
      className={cn(
        'flex items-center text-sm font-medium text-destructive mt-1',
        className
      )}
    >
      <AlertCircle className="h-3.5 w-3.5 mr-1" />
      <span>{errorMessage}</span>
    </div>
  )
}

interface FormErrorSummaryProps {
  errors: FieldErrors
  title?: string
  className?: string
  children?: ReactNode
  showToast?: boolean
}

/**
 * Component for displaying a summary of form errors
 */
export function FormErrorSummary({
  errors,
  title = 'Form contains errors',
  className,
  children,
  showToast = false,
}: FormErrorSummaryProps) {
  // Don't show anything if there are no errors
  if (Object.keys(errors).length === 0) return null

  // Collect error messages
  const errorMessages: string[] = []
  
  // Recursive function to collect error messages from nested errors
  const collectErrors = (
    errors: FieldErrors,
    prefix = ''
  ) => {
    Object.entries(errors).forEach(([key, error]) => {
      const fieldName = prefix ? `${prefix}.${key}` : key
      
      // Handle nested errors
      if (error.type === 'object' && error.message) {
        errorMessages.push(`${fieldName}: ${error.message}`)
      } else if (error.message) {
        errorMessages.push(`${fieldName}: ${error.message}`)
      }
      
      // Recursively handle nested field errors
      if (error.type === 'object' && error.message === undefined) {
        collectErrors(error as unknown as FieldErrors, fieldName)
      }
    })
  }
  
  collectErrors(errors)
  
  // Show toast if requested
  if (showToast && errorMessages.length > 0) {
    toast.error(title, {
      description: errorMessages.join(', ')
    })
  }
  
  return (
    <div
      className={cn(
        'bg-destructive/15 text-destructive px-4 py-3 rounded-md mt-4 mb-6',
        className
      )}
    >
      <div className="flex items-center mb-2">
        <XCircle className="h-5 w-5 mr-2" />
        <h5 className="font-medium">{title}</h5>
      </div>
      
      {children ? (
        children
      ) : (
        <ul className="list-disc ml-5 text-sm space-y-1">
          {errorMessages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

/**
 * Utility function to format form error messages
 */
export function formatFormErrors(errors: FieldErrors): string {
  const errorMessages: string[] = []
  
  // Recursive function to collect error messages from nested errors
  const collectErrors = (
    errors: FieldErrors,
    prefix = ''
  ) => {
    Object.entries(errors).forEach(([key, error]) => {
      const fieldName = prefix ? `${prefix}.${key}` : key
      
      if (error.message) {
        errorMessages.push(`${fieldName}: ${error.message}`)
      }
      
      // Recursively handle nested field errors
      if (error.type === 'object' && !error.message) {
        collectErrors(error as unknown as FieldErrors, fieldName)
      }
    })
  }
  
  collectErrors(errors)
  return errorMessages.join(', ')
}

export default FormError