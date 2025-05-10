import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function ErrorPage() {
  const error = useRouteError()
  
  let errorMessage = 'An unexpected error has occurred.'
  let statusCode = 500
  
  if (isRouteErrorResponse(error)) {
    statusCode = error.status
    errorMessage = error.statusText || errorMessage
    
    if (error.data?.message) {
      errorMessage = error.data.message
    }
  } else if (error instanceof Error) {
    errorMessage = error.message
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6">
          <AlertTriangle className="h-8 w-8 text-muted-foreground" />
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          {statusCode === 404 ? 'Page not found' : 'Something went wrong'}
        </h1>
        
        <p className="text-muted-foreground max-w-lg mx-auto mb-8">
          {statusCode === 404 
            ? "Sorry, we couldn't find the page you're looking for."
            : errorMessage}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link to="/">Go back home</Link>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Try again
          </Button>
        </div>
      </div>
    </div>
  )
}