import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from '@/components/examples/LoginForm'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const handleLoginSuccess = () => {
    // In a real app, this would redirect to dashboard
    console.log('Login successful')
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-10rem)] py-8">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Log in</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <LoginForm onSuccess={handleLoginSuccess} />
          </CardContent>
          
          <CardFooter className="flex flex-col gap-2">
            <div className="text-sm text-muted-foreground text-center">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
            
            <div className="text-sm text-muted-foreground text-center">
              <Link to="/forgot-password" className="text-primary hover:underline">
                Forgot your password?
              </Link>
            </div>
            
            <div className="mt-4 text-center">
              <Button variant="outline" asChild>
                <Link to="/">Back to home</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}