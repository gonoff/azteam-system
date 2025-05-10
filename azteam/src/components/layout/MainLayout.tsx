import React from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'

interface MainLayoutProps {
  children?: React.ReactNode
}

/**
 * Main layout component used for the application
 * Includes global components like Toaster, ErrorBoundary, etc.
 */
export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 border-b bg-background">
          <div className="container flex h-16 items-center px-4 sm:px-6">
            <div className="mr-4 flex">
              <a href="/" className="mr-6 flex items-center font-bold">
                AZ Team
              </a>
            </div>
            <div className="flex flex-1 items-center justify-end">
              {/* Add navigation components here */}
            </div>
          </div>
        </header>
        <main className="flex-1">
          {/* Display either children or outlet from React Router */}
          {children || <Outlet />}
        </main>
        <footer className="border-t py-6 md:py-0">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AZ Team. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
      
      {/* Global toast container */}
      <Toaster position="top-right" />
    </div>
  )
}