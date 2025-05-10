import { Card } from "@/components/ui/card"

const HomePage = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">AZ Team Order Tracker</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Order Tracker</h2>
          <p className="text-muted-foreground">Create and manage orders with suppliers</p>
        </Card>
        
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Shirt Production</h2>
          <p className="text-muted-foreground">Track shirt production through kanban workflow</p>
        </Card>
        
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Task Manager</h2>
          <p className="text-muted-foreground">Manage and prioritize production tasks</p>
        </Card>
        
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Business Cards</h2>
          <p className="text-muted-foreground">Track business card design and ordering</p>
        </Card>
      </div>
    </div>
  )
}

export default HomePage