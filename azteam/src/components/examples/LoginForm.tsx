import { useState } from "react"
import { loginFormSchema, type LoginFormValues } from "@/lib/validations"
import { useZodForm } from "@/hooks/useForm"
import { Form } from "@/components/shared/Form"
import { FormField } from "@/components/shared/FormField"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { handleApiFormErrors } from "@/utils/formUtils"
import { toastService } from "@/utils/toast"

interface LoginFormProps {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

/**
 * Example login form using our form validation system
 */
export function LoginForm({ onSuccess, onError }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const form = useZodForm({
    schema: loginFormSchema,
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })
  
  const handleSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    
    try {
      // This would be replaced with actual API call
      console.log("Logging in with:", data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo purposes, show success toast
      toastService.success("Login successful")
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Login error:", error)
      
      // Handle form-specific API errors (field validation, etc.)
      handleApiFormErrors(error, form.setError)
      
      if (onError) {
        onError(error)
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Form
      form={form}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitLabel="Log In"
      className="space-y-4"
      showErrorSummary={true}
    >
      <FormField
        name="email"
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        required
      />
      
      <FormField
        name="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        required
      />
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="rememberMe"
          checked={form.watch("rememberMe")}
          onCheckedChange={(checked) => 
            form.setValue("rememberMe", checked as boolean)
          }
        />
        <Label
          htmlFor="rememberMe"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Remember me
        </Label>
      </div>
    </Form>
  )
}