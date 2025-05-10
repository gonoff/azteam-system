import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Order, OrderStatus, getStatusLabel } from '@/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CalendarIcon, ClockIcon, Edit2Icon, TrashIcon, AlertTriangleIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface OrderCardProps {
  order: Order
  onStatusChange?: (orderId: string, status: OrderStatus) => void
  onEdit?: (orderId: string) => void
  onDelete?: (orderId: string) => void
  className?: string
}

/**
 * Card component for displaying order information
 */
export function OrderCard({ 
  order, 
  onStatusChange, 
  onEdit,
  onDelete,
  className 
}: OrderCardProps) {
  const [expanded, setExpanded] = useState(false)
  
  // Calculate if order is past due date
  const isPastDue = new Date(order.dueDate) < new Date()
  
  // Calculate if due date is approaching (within 2 days)
  const isDueSoon = !isPastDue && 
    (new Date(order.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) <= 2
  
  // Get total quantity of items
  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0)
  
  // Get status badge variant based on order status
  const getStatusVariant = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.AWAITING:
        return 'default'
      case OrderStatus.ORDER_PLACED:
        return 'secondary'
      case OrderStatus.SHIRTS_ARRIVED:
        return 'outline'
      case OrderStatus.DELIVERED:
        return 'success'
      default:
        return 'default'
    }
  }
  
  return (
    <Card 
      className={cn(
        'transition-all',
        expanded ? 'border-primary/50' : '',
        order.isPriority ? 'border-l-4 border-l-red-500' : '',
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold truncate">
            {order.clientName}
            {order.isPriority && (
              <AlertTriangleIcon className="h-4 w-4 text-red-500 inline ml-1" />
            )}
          </CardTitle>
          
          {/* Order Status Selector */}
          {onStatusChange ? (
            <Select 
              defaultValue={order.status} 
              onValueChange={(value) => onStatusChange(order.id, value as OrderStatus)}
            >
              <SelectTrigger className="w-36">
                <Badge variant={getStatusVariant(order.status as OrderStatus)}>
                  {getStatusLabel(order.status as OrderStatus)}
                </Badge>
              </SelectTrigger>
              <SelectContent>
                {Object.values(OrderStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    <Badge variant={getStatusVariant(status)}>
                      {getStatusLabel(status)}
                    </Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Badge variant={getStatusVariant(order.status as OrderStatus)}>
              {getStatusLabel(order.status as OrderStatus)}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <CalendarIcon className="mr-1 h-3 w-3" />
            <span>Order Date:</span>
          </div>
          <div className="text-right">
            {format(new Date(order.orderDate), 'MMM d, yyyy')}
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <ClockIcon className="mr-1 h-3 w-3" />
            <span>Due Date:</span>
          </div>
          <div 
            className={cn(
              "text-right",
              isPastDue ? "text-destructive font-medium" : 
              isDueSoon ? "text-amber-500 font-medium" : ""
            )}
          >
            {format(new Date(order.dueDate), 'MMM d, yyyy')}
          </div>
        </div>
        
        <div className="mt-2">
          <Badge variant="outline">
            {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
          </Badge>
        </div>
        
        {/* Expandable Items Section */}
        {expanded && (
          <div className="mt-4 border-t pt-4 space-y-3">
            <h4 className="text-sm font-medium">Order Items</h4>
            
            {order.items.map((item) => (
              <div key={item.id} className="border rounded-md p-2 text-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p><span className="text-muted-foreground">Size:</span> {item.size}</p>
                    <p><span className="text-muted-foreground">Qty:</span> {item.quantity}</p>
                    <p>
                      <span className="text-muted-foreground">Method:</span> 
                      {item.productionMethod.replace('_', ' ')}
                    </p>
                  </div>
                  <Badge variant={getStatusVariant(item.status as OrderStatus)}>
                    {getStatusLabel(item.status as OrderStatus)}
                  </Badge>
                </div>
                <p className="mt-1">
                  <span className="text-muted-foreground">Description:</span>
                  <span className="ml-1">{item.description}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show Less' : 'Show More'}
        </Button>
        
        <div className="flex gap-1">
          {onEdit && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(order.id)}
            >
              <Edit2Icon className="h-4 w-4" />
            </Button>
          )}
          
          {onDelete && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDelete(order.id)}
              className="text-destructive hover:text-destructive"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}