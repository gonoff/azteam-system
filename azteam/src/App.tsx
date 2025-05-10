import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { ErrorBoundary } from '@/components/shared'
import { errorService } from '@/services/errorService'
import './App.css'

/**
 * Main application component
 * Provides router, error boundary, and global providers
 */
function App() {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="container py-8 flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold text-center mb-4">Something went wrong</h1>
          <div className="bg-red-50 text-red-500 p-4 rounded-md max-w-xl w-full mb-4 overflow-auto">
            <pre className="text-sm">{error.message}</pre>
          </div>
          <button
            onClick={resetError}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Try again
          </button>
        </div>
      )}
      onError={(error, errorInfo) => {
        errorService.logComponentError(error, errorInfo)
      }}
    >
      <RouterProvider router={router} />
    </ErrorBoundary>
  )
}

export default App
