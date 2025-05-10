import { Outlet, NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useThemeContext } from '@/context'
import { MoonIcon, SunIcon } from 'lucide-react'

const MainLayout = () => {
  const { isDarkMode, toggleTheme } = useThemeContext()

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16">
          <div className="font-bold text-xl">AZ Team System</div>
          <nav className="flex items-center space-x-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground transition-colors"
              }
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                isActive
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground transition-colors"
              }
            >
              Order Tracker
            </NavLink>
            <NavLink
              to="/shirt-kanban"
              className={({ isActive }) =>
                isActive
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground transition-colors"
              }
            >
              Shirt Kanban
            </NavLink>
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                isActive
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground transition-colors"
              }
            >
              Tasks
            </NavLink>
            <NavLink
              to="/business-cards"
              className={({ isActive }) =>
                isActive
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground transition-colors"
              }
            >
              Business Cards
            </NavLink>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="border-t py-4">
        <div className="container text-center text-sm text-muted-foreground">
          AZ Team Order Tracker © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  )
}

export default MainLayout