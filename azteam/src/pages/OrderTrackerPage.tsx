import { useState } from 'react'
import { OrderList, OrderForm } from '@/components/order-tracker'
import { useOrderStore } from '@/store/orderStore'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

/**
 * Order Tracker Page Component
 * Main interface for managing orders
 */
const OrderTrackerPage = () => {
  // Local state
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('list')

  // Get order store actions
  const getOrderById = useOrderStore(state => state.getOrderById)

  // Get selected order if any
  const selectedOrder = selectedOrderId ? getOrderById(selectedOrderId) : null

  // Handlers
  const handleCreateOrder = () => {
    setIsCreateOrderOpen(true)
  }

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrderId(orderId)
    setActiveTab('details')
  }

  const handleCloseForm = () => {
    setIsCreateOrderOpen(false)
    setSelectedOrderId(null)
    setActiveTab('list')
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-3xl font-bold">Order Tracker</h1>
      <p className="text-muted-foreground mb-6">
        Create and manage orders with suppliers, calculate delivery times, and track status.
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">Orders List</TabsTrigger>
          <TabsTrigger
            value="details"
            disabled={!selectedOrder}
            className={!selectedOrder ? 'opacity-50 cursor-not-allowed' : ''}
          >
            Order Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <OrderList
                onCreateOrder={handleCreateOrder}
                onOrderSelect={handleOrderSelect}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          {selectedOrder && (
            <Card>
              <CardContent className="p-6">
                <OrderForm
                  order={selectedOrder}
                  onCancel={() => {
                    setSelectedOrderId(null)
                    setActiveTab('list')
                  }}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Order Dialog */}
      <Dialog open={isCreateOrderOpen} onOpenChange={setIsCreateOrderOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
            <DialogDescription>
              Fill in the order details below to create a new order.
            </DialogDescription>
          </DialogHeader>
          <OrderForm onCancel={handleCloseForm} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default OrderTrackerPage