import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageContainerProps {
  children: ReactNode
  title?: string
  description?: string
  className?: string
  headerAction?: ReactNode
}

/**
 * Standard page container with consistent header and padding
 */
export const PageContainer = ({
  children,
  title,
  description,
  className,
  headerAction
}: PageContainerProps) => {
  return (
    <div className={cn('container py-6', className)}>
      {(title || description || headerAction) && (
        <div className="mb-6 flex items-center justify-between">
          <div>
            {title && <h1 className="text-3xl font-bold">{title}</h1>}
            {description && <p className="mt-2 text-muted-foreground">{description}</p>}
          </div>
          
          {headerAction && (
            <div className="ml-auto">
              {headerAction}
            </div>
          )}
        </div>
      )}
      
      {children}
    </div>
  )
}

export default PageContainer