import { createContext, useContext, ReactNode, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

// Define the type for theme context
type ThemeContextType = {
  theme: string | undefined
  setTheme: (theme: string) => void
  isDarkMode: boolean
  toggleTheme: () => void
}

// Create the context with an initial default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Custom hook to use theme context
export function useThemeContext() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }
  return context
}

// Theme provider component
export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme()
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Set isDarkMode state based on theme
  useEffect(() => {
    setIsDarkMode(
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    )
  }, [theme])

  // Toggle between light and dark theme
  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark')
  }

  // Provide theme context to children
  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}