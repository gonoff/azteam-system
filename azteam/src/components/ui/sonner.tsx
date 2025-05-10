import { useTheme } from "next-themes"
import { Toaster as Sonner, toast, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          error:
            "group-[.toaster]:bg-destructive group-[.toaster]:text-destructive-foreground group-[.toaster]:border-destructive",
          success:
            "group-[.toaster]:text-green-800 group-[.toaster]:bg-green-50 group-[.toaster]:border-green-200 dark:group-[.toaster]:text-green-300 dark:group-[.toaster]:bg-green-950 dark:group-[.toaster]:border-green-800",
          warning:
            "group-[.toaster]:text-amber-800 group-[.toaster]:bg-amber-50 group-[.toaster]:border-amber-200 dark:group-[.toaster]:text-amber-300 dark:group-[.toaster]:bg-amber-950 dark:group-[.toaster]:border-amber-800",
          info:
            "group-[.toaster]:text-blue-800 group-[.toaster]:bg-blue-50 group-[.toaster]:border-blue-200 dark:group-[.toaster]:text-blue-300 dark:group-[.toaster]:bg-blue-950 dark:group-[.toaster]:border-blue-800",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
