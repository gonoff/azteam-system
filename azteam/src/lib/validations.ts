import { z } from "zod"

/**
 * Common validation schemas for form inputs
 */

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email format")

export const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters")
  .refine(
    (password) => /[A-Z]/.test(password),
    "Password must contain at least one uppercase letter"
  )
  .refine(
    (password) => /[a-z]/.test(password),
    "Password must contain at least one lowercase letter"
  )
  .refine(
    (password) => /[0-9]/.test(password),
    "Password must contain at least one number"
  )

export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(100, "Name must be less than 100 characters")

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(50, "Username must be less than 50 characters")
  .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens")

export const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number format")

export const urlSchema = z
  .string()
  .url("Invalid URL format")
  .optional()
  .or(z.literal(""))

export const dateSchema = z
  .string()
  .refine(
    (date) => !isNaN(Date.parse(date)),
    "Invalid date format"
  )

export const numberSchema = z
  .number()
  .or(z.string().regex(/^\d+$/).transform(Number))
  .refine(value => !isNaN(value), "Must be a valid number")

/**
 * Complex validation schemas
 */

export const confirmPasswordSchema = (passwordFieldName: string) => 
  z.object({
    [passwordFieldName]: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  }).refine(
    (data) => data[passwordFieldName] === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  )

/**
 * Common form schemas
 */

export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
})

export const signupFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, "Please confirm your password"),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
)

export const profileFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  username: usernameSchema.optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  website: urlSchema,
  phone: phoneSchema.optional(),
})

export const passwordResetRequestSchema = z.object({
  email: emailSchema,
})

export const passwordResetConfirmSchema = confirmPasswordSchema("newPassword").extend({
  newPassword: passwordSchema,
  token: z.string().min(1, "Reset token is required"),
})

export type LoginFormValues = z.infer<typeof loginFormSchema>
export type SignupFormValues = z.infer<typeof signupFormSchema>
export type ProfileFormValues = z.infer<typeof profileFormSchema>
export type PasswordResetRequestValues = z.infer<typeof passwordResetRequestSchema>
export type PasswordResetConfirmValues = z.infer<typeof passwordResetConfirmSchema>

/**
 * Helper functions for validation
 */

export const getZodErrorMessage = (error: z.ZodError): string => {
  return error.errors.map(err => err.message).join(", ")
}

export const validateFormData = <T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; error: z.ZodError } => {
  try {
    const validData = schema.parse(data)
    return { success: true, data: validData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error }
    }
    throw error
  }
}