import { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { IS_DEV } from '@/utils/env'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  resetKeys?: any[]
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Error Boundary component to catch JavaScript errors in child components
 * and display a fallback UI instead of crashing the whole application
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can also log the error to an error reporting service
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
    
    // Log to console in development
    if (IS_DEV) {
      console.error('Error caught by ErrorBoundary:', error, errorInfo)
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    // If resetKeys change, reset the error boundary
    if (
      this.state.hasError &&
      this.props.resetKeys &&
      prevProps.resetKeys &&
      this.props.resetKeys.some((key, i) => key !== prevProps.resetKeys?.[i])
    ) {
      this.reset()
    }
  }

  reset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <Card className="w-full max-w-md mx-auto mt-8 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertCircle className="mr-2 h-5 w-5" />
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-2">
              An error occurred while rendering this component.
            </p>
            {IS_DEV && this.state.error && (
              <div className="mt-4 p-3 bg-muted rounded-md overflow-auto text-sm">
                <p className="font-mono text-red-500">{this.state.error.toString()}</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={this.reset} variant="outline" className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Button>
          </CardFooter>
        </Card>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary