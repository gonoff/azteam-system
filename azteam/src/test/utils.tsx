import { ReactElement, ReactNode } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from '@/context'

// Interface for custom render options
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string
}

/**
 * All providers wrapper for testing
 */
const AllTheProviders = ({ children, route = '/' }: { children: ReactNode, route?: string }) => {
  // Mock window.location for router
  window.history.pushState({}, 'Test page', route)
  
  return (
    <AppProvider>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </AppProvider>
  )
}

/**
 * Custom render method that includes global providers
 */
const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => {
  const { route, ...renderOptions } = options || {}
  
  return {
    user: userEvent.setup(),
    ...render(ui, {
      wrapper: (props) => <AllTheProviders {...props} route={route} />,
      ...renderOptions,
    }),
  }
}

// Re-export everything from testing-library
export * from '@testing-library/react'

// Override render method
export { customRender as render }