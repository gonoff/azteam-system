import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

/**
 * Loading spinner component with various sizes
 */
export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    xs: 'h-3 w-3 border-[1.5px]',
    sm: 'h-4 w-4 border-[1.5px]',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-2',
    xl: 'h-12 w-12 border-[3px]',
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-solid border-t-transparent',
        'border-primary',
        sizeClasses[size],
        className
      )}
    />
  )
}

export default Spinner