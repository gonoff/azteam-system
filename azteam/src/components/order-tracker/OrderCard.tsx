import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Order, OrderStatus, ProductionMethod } from '@/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  CalendarIcon,
  ClockIcon,
  Edit2Icon,
  TrashIcon,
  AlertTriangleIcon,
  CopyIcon,
  ShirtIcon,
  PrinterIcon,
  ScissorsIcon,
  StampIcon
} from 'lucide-react'
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
  onDuplicate?: (orderId: string) => void
  onClick?: (orderId: string) => void
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
  onDuplicate,
  onClick,
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

  // Get unique production methods from all items
  const productionMethods = [...new Set(order.items.map(item => item.productionMethod))]

  // Get status badge variant based on order status
  const getStatusVariant = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'secondary'
      case OrderStatus.CONFIRMED:
        return 'default'
      case OrderStatus.AWAITING:
        return 'outline'
      case OrderStatus.ORDER_PLACED:
        return 'secondary'
      case OrderStatus.SHIRTS_ARRIVED:
        return 'outline'
      case OrderStatus.IN_PRODUCTION:
        return 'default'
      case OrderStatus.COMPLETED:
        return 'success'
      case OrderStatus.DELIVERED:
        return 'success'
      case OrderStatus.CANCELLED:
        return 'destructive'
      default:
        return 'default'
    }
  }

  // Get status label for display
  const getStatusLabel = (status: OrderStatus): string => {
    return status.replace(/_/g, ' ')
  }

  // Get icon for production method
  const getMethodIcon = (method: ProductionMethod) => {
    switch (method) {
      case ProductionMethod.SCREEN_PRINTING:
        return <PrinterIcon className="h-3 w-3" />
      case ProductionMethod.EMBROIDERY:
        return <ScissorsIcon className="h-3 w-3" />
      case ProductionMethod.HEAT_TRANSFER_VINYL:
        return <StampIcon className="h-3 w-3" />
      default:
        return <ShirtIcon className="h-3 w-3" />
    }
  }

  // Handle card click
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on buttons or select
    if (
      e.target instanceof HTMLElement &&
      (e.target.closest('button') || e.target.closest('select'))
    ) {
      return
    }

    onClick?.(order.id)
  }

  return (
    <Card
      className={cn(
        'transition-all duration-200 hover:shadow-md cursor-pointer',
        expanded ? 'shadow-md border-primary/50' : '',
        order.isPriority ? 'border-l-4 border-l-red-500' : '',
        className
      )}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold truncate">
            {order.client.name}
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
              <SelectTrigger className="w-[130px]" onClick={(e) => e.stopPropagation()}>
                <Badge variant={getStatusVariant(order.status)}>
                  {getStatusLabel(order.status)}
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
            <Badge variant={getStatusVariant(order.status)}>
              {getStatusLabel(order.status)}
            </Badge>
          )}
        </div>

        {order.orderNumber && (
          <div className="text-sm text-muted-foreground">
            #{order.orderNumber}
          </div>
        )}
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

        <div className="mt-3 flex items-center justify-between">
          <Badge variant="outline">
            {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
          </Badge>

          <div className="flex gap-1">
            {productionMethods.map((method) => (
              <Badge key={method} variant="outline" className="flex items-center gap-1">
                {getMethodIcon(method)}
                <span className="sr-only">{method.replace(/_/g, ' ')}</span>
              </Badge>
            ))}
          </div>
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
                      {item.productionMethod.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <Badge variant={getStatusVariant(item.status)}>
                    {getStatusLabel(item.status)}
                  </Badge>
                </div>
                <p className="mt-1">
                  <span className="text-muted-foreground">Description:</span>
                  <span className="ml-1">{item.description}</span>
                </p>
              </div>
            ))}

            {order.notes && (
              <div className="mt-2">
                <h4 className="text-sm font-medium mb-1">Notes</h4>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            setExpanded(!expanded)
          }}
        >
          {expanded ? 'Show Less' : 'Show More'}
        </Button>

        <div className="flex gap-1">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(order.id)
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <Edit2Icon className="h-4 w-4" />
            </Button>
          )}

          {onDuplicate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onDuplicate(order.id)
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <CopyIcon className="h-4 w-4" />
            </Button>
          )}

          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(order.id)
              }}
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

export default OrderCard