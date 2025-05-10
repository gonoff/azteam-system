import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { SignupForm } from '@/components/examples/SignupForm'

export default function SignupPage() {
  const navigate = useNavigate()

  const handleSignupSuccess = () => {
    // In a real app, this would handle post-signup actions
    // like email verification or immediate login
    navigate('/login?registered=true')
  }

  const handleCancel = () => {
    navigate('/')
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-10rem)] py-8">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              Enter your information to create a new account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <SignupForm 
              onSuccess={handleSignupSuccess}
              onCancel={handleCancel}
            />
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <div className="text-sm text-muted-foreground text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}