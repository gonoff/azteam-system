import { ReactNode } from "react"
import { Controller, FieldPath, FieldValues } from "react-hook-form"
import {
  FormControl,
  FormField as ShadcnFormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FormError } from "./FormError"
import { cn } from "@/lib/utils"

interface BaseFormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> {
  name: TName
  label?: string
  description?: string
  required?: boolean
  className?: string
  render?: (props: { field: any; error: any }) => ReactNode
}

interface InputFormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> extends BaseFormFieldProps<TFieldValues, TName> {
  type?: "text" | "email" | "password" | "number" | "tel" | "url"
  placeholder?: string
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  render?: never
}

export type FormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = InputFormFieldProps<TFieldValues, TName> | BaseFormFieldProps<TFieldValues, TName>

/**
 * A streamlined form field component that integrates with react-hook-form
 * Handles both basic input types and custom renderers
 * 
 * @example
 * <FormField
 *   name="email"
 *   label="Email Address"
 *   type="email"
 *   required
 * />
 * 
 * @example
 * <FormField
 *   name="role"
 *   label="Role"
 *   render={({ field, error }) => (
 *     <>
 *       <Select
 *         {...field}
 *         options={roleOptions}
 *       />
 *       <FormError error={error} />
 *     </>
 *   )}
 * />
 */
export function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  name,
  label,
  description,
  required,
  className,
  type = "text",
  placeholder,
  inputProps,
  render,
}: FormFieldProps<TFieldValues, TName>) {
  return (
    <ShadcnFormField
      name={name}
      render={({ field, formState }) => {
        const error = formState.errors[name]
        
        return (
          <FormItem className={cn("space-y-1", className)}>
            {label && (
              <FormLabel className={required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}>
                {label}
              </FormLabel>
            )}
            
            <FormControl>
              {render ? (
                render({ field, error })
              ) : (
                <Input
                  type={type}
                  placeholder={placeholder}
                  {...field}
                  {...inputProps}
                />
              )}
            </FormControl>
            
            <FormError error={error} />
            
            {description && (
              <FormDescription>
                {description}
              </FormDescription>
            )}
          </FormItem>
        )
      }}
    />
  )
}

/**
 * A controlled form field component for advanced form control
 * 
 * @example
 * <ControlledFormField
 *   name="tags"
 *   label="Tags"
 *   control={form.control}
 *   render={({ field, error }) => (
 *     <>
 *       <TagInput
 *         value={field.value}
 *         onChange={field.onChange}
 *       />
 *       <FormError error={error} />
 *     </>
 *   )}
 * />
 */
export function ControlledFormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  name,
  label,
  description,
  required,
  control,
  render,
  className,
}: {
  control: any
  render: (props: { field: any; error: any }) => ReactNode
} & Omit<BaseFormFieldProps<TFieldValues, TName>, "render"> & {
  render: (props: { field: any; error: any }) => ReactNode
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, formState }) => {
        const error = formState.errors[name]
        
        return (
          <FormItem className={cn("space-y-1", className)}>
            {label && (
              <FormLabel className={required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}>
                {label}
              </FormLabel>
            )}
            
            {render({ field, error })}
            
            {description && (
              <FormDescription>
                {description}
              </FormDescription>
            )}
          </FormItem>
        )
      }}
    />
  )
}