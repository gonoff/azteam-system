import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const NotFoundPage = () => {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <h1 className="text-5xl font-bold mb-6">404</h1>
      <p className="text-xl text-muted-foreground mb-8">Page not found</p>
      <Button asChild>
        <Link to="/">Go Home</Link>
      </Button>
    </div>
  )
}

export default NotFoundPage