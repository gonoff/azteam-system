import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: ReactNode
  sidebar?: ReactNode
  header?: ReactNode
  className?: string
}

/**
 * Dashboard layout with optional sidebar and header
 */
export const DashboardLayout = ({
  children,
  sidebar,
  header,
  className
}: DashboardLayoutProps) => {
  return (
    <div className={cn('flex h-screen flex-col', className)}>
      {header && (
        <header className="border-b">
          {header}
        </header>
      )}
      
      <div className="flex flex-1 overflow-hidden">
        {sidebar && (
          <aside className="w-64 border-r overflow-y-auto bg-sidebar text-sidebar-foreground">
            {sidebar}
          </aside>
        )}
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout