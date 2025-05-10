import { ReactNode } from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProvider } from './ThemeContext'
import { QueryProvider } from './QueryProvider'
import { Toaster } from '@/components/ui/sonner'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { errorService } from '@/services'

interface AppProviderProps {
  children: ReactNode
}

/**
 * Main application provider that wraps all context providers
 */
export const AppProvider = ({ children }: AppProviderProps) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    errorService.logComponentError(error, errorInfo, {
      context: 'App Root',
    })
  }

  return (
    <ErrorBoundary onError={handleError}>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        <ThemeProvider>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </NextThemesProvider>
    </ErrorBoundary>
  )
}

export default AppProvider