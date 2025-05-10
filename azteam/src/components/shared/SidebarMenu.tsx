import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

export interface SidebarMenuItem {
  title: string
  href: string
  icon?: ReactNode
  badge?: string | number
}

interface SidebarMenuProps {
  items: SidebarMenuItem[]
  className?: string
}

/**
 * Sidebar menu component with active state indicators
 */
export const SidebarMenu = ({ items, className }: SidebarMenuProps) => {
  return (
    <nav className={cn('flex flex-col space-y-1 p-2', className)}>
      {items.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            cn(
              'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
              'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              isActive
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground'
            )
          }
          end={item.href === '/'}
        >
          {item.icon && <span className="mr-2">{item.icon}</span>}
          <span>{item.title}</span>
          {item.badge && (
            <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {item.badge}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export default SidebarMenu