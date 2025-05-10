import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  Clipboard,
  Layers,
  ListChecks,
  ShoppingBag,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Main navigation component
 * Displays the primary navigation links for the application
 */
export function Navigation() {
  const location = useLocation()
  
  // Navigation items
  const navItems = [
    {
      label: 'Orders',
      href: '/orders',
      icon: ShoppingBag,
    },
    {
      label: 'Shirt Kanban',
      href: '/kanban/shirts',
      icon: Layers,
    },
    {
      label: 'Business Cards',
      href: '/kanban/business-cards',
      icon: Clipboard,
    },
    {
      label: 'Tasks',
      href: '/tasks',
      icon: ListChecks,
    },
  ]
  
  return (
    <nav className="flex items-center space-x-1">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href
        
        return (
          <Button
            key={item.href}
            asChild
            variant={isActive ? 'secondary' : 'ghost'}
            size="sm"
            className={cn(
              "h-9",
              isActive ? "bg-secondary text-secondary-foreground" : ""
            )}
          >
            <Link to={item.href} className="flex items-center gap-1">
              <item.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          </Button>
        )
      })}
      
      <Button asChild variant="ghost" size="sm" className="h-9">
        <Link to="/login" className="flex items-center gap-1">
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">Login</span>
        </Link>
      </Button>
    </nav>
  )
}

export default Navigation