import { ReactNode, FormHTMLAttributes } from "react"
import { 
  FieldValues, 
  SubmitHandler, 
  UseFormReturn, 
  FormProvider
} from "react-hook-form"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { FormErrorSummary } from "./FormError"

export interface FormProps<TFormValues extends FieldValues>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  form: UseFormReturn<TFormValues>
  onSubmit: SubmitHandler<TFormValues>
  children: ReactNode
  className?: string
  isLoading?: boolean
  submitLabel?: string
  submitProps?: React.ComponentPropsWithoutRef<typeof Button>
  showErrorSummary?: boolean
  errorSummaryProps?: React.ComponentPropsWithoutRef<typeof FormErrorSummary>
}

/**
 * A reusable form component that manages form state and handles submissions
 * 
 * @example
 * const form = useZodForm({ schema: loginSchema })
 * 
 * <Form 
 *   form={form} 
 *   onSubmit={handleLogin} 
 *   isLoading={isLoading}
 *   submitLabel="Log In"
 * >
 *   <FormField
 *     control={form.control}
 *     name="email"
 *     render={({ field }) => (
 *       <FormItem>
 *         <FormLabel>Email</FormLabel>
 *         <FormControl>
 *           <Input placeholder="Email" {...field} />
 *         </FormControl>
 *         <FormError error={form.formState.errors.email} />
 *       </FormItem>
 *     )}
 *   />
 * </Form>
 */
export function Form<TFormValues extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
  isLoading = false,
  submitLabel = "Submit",
  submitProps,
  showErrorSummary = false,
  errorSummaryProps,
  ...props
}: FormProps<TFormValues>) {
  return (
    <FormProvider {...form}>
      <form
        className={cn("space-y-4", className)}
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        {children}
        
        {showErrorSummary && (
          <FormErrorSummary
            errors={form.formState.errors}
            {...errorSummaryProps}
          />
        )}
        
        <Button
          type="submit"
          disabled={isLoading}
          {...submitProps}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </form>
    </FormProvider>
  )
}