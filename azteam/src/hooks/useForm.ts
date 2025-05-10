import { useState } from "react"
import { FieldValues, UseFormProps, UseFormReturn, useForm as useHookForm } from "react-hook-form"
import { ZodType, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toastService } from "@/utils/toast"

interface UseZodFormProps<T extends FieldValues> extends Omit<UseFormProps<T>, "resolver"> {
  schema: ZodType;
  showToastOnError?: boolean;
  defaultValues?: UseFormProps<T>["defaultValues"];
}

/**
 * A wrapper around react-hook-form with automatic Zod validation
 * 
 * @example
 * const { register, handleSubmit, formState } = useZodForm({
 *   schema: loginFormSchema,
 *   defaultValues: { email: "", password: "" },
 * })
 */
export const useZodForm = <T extends FieldValues>({
  schema,
  showToastOnError = false,
  defaultValues = {},
  ...formConfig
}: UseZodFormProps<T>): UseFormReturn<T> => {
  
  const form = useHookForm<T>({
    ...formConfig,
    defaultValues,
    resolver: zodResolver(schema),
  })

  const originalHandleSubmit = form.handleSubmit
  
  // Override the handleSubmit method to catch and display errors
  form.handleSubmit = (onValid, onInvalid) => 
    originalHandleSubmit((data) => {
      return onValid(data)
    }, (errors) => {
      if (showToastOnError) {
        // Get the first error message to display in toast
        const errorFields = Object.keys(errors)
        if (errorFields.length > 0) {
          const firstError = errors[errorFields[0]]
          // @ts-ignore - TypeScript doesn't understand the structure here
          const errorMessage = firstError?.message || "Please fix form errors and try again"
          toastService.error(errorMessage)
        }
      }
      
      if (onInvalid) {
        return onInvalid(errors)
      }
    })
  
  return form
}

/**
 * Custom hook for handling form submission with loading state
 * 
 * @example
 * const { isSubmitting, submitHandler } = useFormSubmit(async (data) => {
 *   await apiCall(data)
 * })
 */
export const useFormSubmit = <T extends FieldValues>(
  submitFn: (data: T) => Promise<void>,
  options: {
    onSuccess?: () => void
    onError?: (error: unknown) => void
    toastSuccess?: string
    toastError?: string
  } = {}
) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { onSuccess, onError, toastSuccess, toastError } = options
  
  const submitHandler = async (data: T) => {
    setIsSubmitting(true)
    try {
      await submitFn(data)
      
      if (toastSuccess) {
        toastService.success(toastSuccess)
      }
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Form submission error:", error)
      
      if (toastError) {
        toastService.error(toastError)
      } else if (error instanceof Error) {
        toastService.error(error.message)
      } else {
        toastService.error("An error occurred. Please try again.")
      }
      
      if (onError) {
        onError(error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return { isSubmitting, submitHandler }
}

/**
 * Custom hook that combines useZodForm and useFormSubmit for a streamlined form handling experience
 * 
 * @example
 * const { form, isSubmitting, onSubmit } = useValidatedForm({
 *   schema: loginFormSchema,
 *   defaultValues: { email: "", password: "" },
 *   onSubmit: async (data) => {
 *     await login(data)
 *   },
 *   onSuccess: () => navigate("/dashboard")
 * })
 */
export const useValidatedForm = <T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  ...options
}: UseZodFormProps<T> & {
  onSubmit: (data: T) => Promise<void>
  onSuccess?: () => void
  onError?: (error: unknown) => void
  toastSuccess?: string
  toastError?: string
}) => {
  const form = useZodForm<T>({ schema, defaultValues })
  const { isSubmitting, submitHandler } = useFormSubmit<T>(onSubmit, options)
  
  const onSubmitHandler = form.handleSubmit(submitHandler)
  
  return {
    form,
    isSubmitting,
    onSubmit: onSubmitHandler
  }
}