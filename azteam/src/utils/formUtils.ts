import { FieldErrors, FieldValues } from "react-hook-form"
import { ZodError } from "zod"
import { toastService } from "./toast"

/**
 * Maps a ZodError to React Hook Form errors format
 */
export const mapZodErrorToFormErrors = <T extends FieldValues>(
  zodError: ZodError
): FieldErrors<T> => {
  const formErrors: FieldErrors<T> = {}
  
  zodError.errors.forEach((error) => {
    const path = error.path.join(".")
    if (path) {
      // @ts-ignore - TypeScript doesn't understand the dynamic path assignment
      formErrors[path] = {
        type: "validation",
        message: error.message,
      }
    }
  })
  
  return formErrors
}

/**
 * Gets all error messages from form errors object
 */
export const getFormErrorMessages = <T extends FieldValues>(
  errors: FieldErrors<T>
): string[] => {
  const messages: string[] = []
  
  const extractErrors = (obj: any, prefix = ""): void => {
    for (const key in obj) {
      if (obj[key]) {
        const fullPath = prefix ? `${prefix}.${key}` : key
        
        if (obj[key].message) {
          messages.push(obj[key].message)
        } else if (typeof obj[key] === "object") {
          extractErrors(obj[key], fullPath)
        }
      }
    }
  }
  
  extractErrors(errors)
  return messages
}

/**
 * Shows form errors in a toast notification
 */
export const showFormErrorsToast = <T extends FieldValues>(
  errors: FieldErrors<T>,
  options: {
    title?: string,
    limit?: number
  } = {}
): void => {
  const { title = "Form validation failed", limit = 3 } = options
  const messages = getFormErrorMessages(errors)
  
  if (messages.length === 0) {
    return
  }
  
  let toastMessage = title
  
  // Add up to 'limit' error messages to the toast
  const displayedErrors = messages.slice(0, limit)
  if (displayedErrors.length > 0) {
    toastMessage += ":\n• " + displayedErrors.join("\n• ")
    
    // Indicate there are more errors
    if (messages.length > limit) {
      toastMessage += `\n\nAnd ${messages.length - limit} more errors...`
    }
  }
  
  toastService.error(toastMessage)
}

/**
 * Handles API errors in forms
 * Processes server-side validation errors and maps them to form fields
 */
export const handleApiFormErrors = <T extends FieldValues>(
  error: any,
  setError: (name: string, error: { type: string, message: string }) => void,
  options: {
    showToast?: boolean,
    fieldMapping?: Record<string, string>
  } = {}
): void => {
  const { showToast = true, fieldMapping = {} } = options
  
  if (!error || !error.response) {
    if (showToast) {
      toastService.error("An unexpected error occurred. Please try again.")
    }
    return
  }
  
  const { data, status } = error.response
  
  // Handle validation errors (typically 400 status code)
  if (status === 400 && data && data.errors) {
    const serverErrors = data.errors
    
    // Map server error fields to form fields
    Object.keys(serverErrors).forEach((fieldName) => {
      // Use field mapping if available, otherwise use the original field name
      const formField = fieldMapping[fieldName] || fieldName
      const errorMessage = Array.isArray(serverErrors[fieldName])
        ? serverErrors[fieldName][0]
        : serverErrors[fieldName]
      
      setError(formField, {
        type: "server",
        message: errorMessage,
      })
    })
    
    if (showToast) {
      toastService.error("Please correct the form errors and try again.")
    }
    
    return
  }
  
  // Handle other common status codes
  if (status === 401) {
    if (showToast) {
      toastService.error("You are not authorized to perform this action.")
    }
    return
  }
  
  if (status === 403) {
    if (showToast) {
      toastService.error("You don't have permission to perform this action.")
    }
    return
  }
  
  if (status === 404) {
    if (showToast) {
      toastService.error("The requested resource was not found.")
    }
    return
  }
  
  if (status === 422 && data && data.message) {
    if (showToast) {
      toastService.error(data.message)
    }
    return
  }
  
  if (status >= 500) {
    if (showToast) {
      toastService.error("A server error occurred. Please try again later.")
    }
    return
  }
  
  // Handle any other error
  if (showToast) {
    const message = data?.message || "An error occurred. Please try again."
    toastService.error(message)
  }
}

/**
 * Parses form data from FormData object to regular object
 * Handles arrays and nested objects in form data
 */
export const parseFormData = (formData: FormData): Record<string, any> => {
  const result: Record<string, any> = {}
  
  for (const [key, value] of formData.entries()) {
    // Handle array inputs (e.g., "tags[]")
    if (key.endsWith("[]")) {
      const arrayKey = key.slice(0, -2)
      
      if (!result[arrayKey]) {
        result[arrayKey] = []
      }
      
      result[arrayKey].push(value)
      continue
    }
    
    // Handle nested objects (e.g., "address.street")
    if (key.includes(".")) {
      const keys = key.split(".")
      let current = result
      
      for (let i = 0; i < keys.length - 1; i++) {
        const nestedKey = keys[i]
        current[nestedKey] = current[nestedKey] || {}
        current = current[nestedKey]
      }
      
      current[keys[keys.length - 1]] = value
      continue
    }
    
    // Handle boolean checkboxes
    if (key.startsWith("checkbox-") && (value === "on" || value === "off")) {
      const checkboxKey = key.replace("checkbox-", "")
      result[checkboxKey] = value === "on"
      continue
    }
    
    // Handle standard inputs
    result[key] = value
  }
  
  return result
}