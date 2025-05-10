import { useState } from "react"
import { signupFormSchema, type SignupFormValues } from "@/lib/validations"
import { useValidatedForm } from "@/hooks/useForm"
import { Form } from "@/components/shared/Form"
import { FormField } from "@/components/shared/FormField"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { showFormErrorsToast } from "@/utils/formUtils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface SignupFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

/**
 * Example signup form with more complex validation
 */
export function SignupForm({ onSuccess, onCancel }: SignupFormProps) {
  // Using our combined form hook that handles both validation and submission
  const { form, isSubmitting, onSubmit } = useValidatedForm({
    schema: signupFormSchema,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    onSubmit: async (data) => {
      // This would be replaced with actual API call
      console.log("Signing up with:", data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // We don't need to handle success/error here as it's managed by the hook
    },
    onSuccess,
    toastSuccess: "Account created successfully!",
    toastError: "Could not create your account. Please try again.",
  })
  
  // Show form errors when the form is submitted but invalid
  const handleInvalidSubmit = () => {
    showFormErrorsToast(form.formState.errors, {
      title: "Please fix the following errors:",
      limit: 3,
    })
  }
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information to create a new account
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form
          form={form}
          onSubmit={onSubmit}
          isLoading={isSubmitting}
          submitLabel="Create Account"
          className="space-y-4"
          showErrorSummary={true}
          // This callback runs when the form is invalid
          onInvalid={handleInvalidSubmit}
        >
          <FormField
            name="name"
            label="Full Name"
            placeholder="Enter your full name"
            required
          />
          
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
            placeholder="Create a password"
            description="Password must be at least 8 characters with uppercase, lowercase and numbers"
            required
          />
          
          <FormField
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            required
          />
          
          <div className="flex items-start space-x-2 pt-2">
            <Checkbox
              id="acceptTerms"
              checked={form.watch("acceptTerms")}
              onCheckedChange={(checked) => 
                form.setValue("acceptTerms", checked as boolean)
              }
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="acceptTerms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I accept the terms and conditions
              </Label>
              <p className="text-sm text-muted-foreground">
                By checking this box, you agree to our{" "}
                <a href="#" className="text-primary underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
          
          {/* The Form component handles the submit button */}
        </Form>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        
        <Button onClick={() => form.handleSubmit(onSubmit)()} disabled={isSubmitting}>
          Create Account
        </Button>
      </CardFooter>
    </Card>
  )
}