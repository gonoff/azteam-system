import { format } from 'date-fns'
import { AlertTriangleIcon, CalendarIcon, ClockIcon, FileIcon } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { BusinessCard, BusinessCardStage } from '@/types'

interface BusinessCardComponentProps {
  card: BusinessCard
  onEdit?: (cardId: string) => void
  onUpload?: (cardId: string) => void
  className?: string
}

/**
 * Card component for the business card kanban board
 */
export function BusinessCardComponent({
  card,
  onEdit,
  onUpload,
  className,
}: BusinessCardComponentProps) {
  // Is due date in the past?
  const isPastDue = new Date(card.dueDate) < new Date()

  // Is due date within 2 days?
  const isDueSoon = !isPastDue && 
    (new Date(card.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) <= 2

  // Get badge based on stage
  const getStageBadge = (stage: BusinessCardStage) => {
    switch (stage) {
      case BusinessCardStage.ART_NEEDS_TO_BE_DONE:
        return <Badge variant="outline">Art Needed</Badge>
      case BusinessCardStage.WAITING_FOR_APPROVAL:
        return <Badge variant="secondary">Awaiting Approval</Badge>
      case BusinessCardStage.APPROVED:
        return <Badge variant="success">Approved</Badge>
      case BusinessCardStage.ORDERED_ONLINE:
        return <Badge variant="primary">Ordered</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <Card
      className={cn(
        card.isPriority ? 'border-l-4 border-l-red-500' : '',
        className
      )}
    >
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium flex items-center">
              {card.clientName}
              {card.isPriority && (
                <AlertTriangleIcon className="h-4 w-4 text-red-500 ml-1" />
              )}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {card.contactInfo}
            </p>
          </div>
          {getStageBadge(card.stage as BusinessCardStage)}
        </div>

        <div className="mt-2 text-sm space-y-1">
          <div className="flex items-center">
            <CalendarIcon className="h-3 w-3 mr-1 text-muted-foreground" />
            <span className="text-muted-foreground">
              Order Date: {format(new Date(card.orderDate), 'MMM d')}
            </span>
          </div>

          <div className="flex items-center">
            <ClockIcon className="h-3 w-3 mr-1" />
            <span
              className={cn(
                'text-xs',
                isPastDue ? 'text-destructive font-medium' : 
                isDueSoon ? 'text-amber-500 font-medium' : 'text-muted-foreground'
              )}
            >
              Due: {format(new Date(card.dueDate), 'MMM d')}
            </span>
          </div>

          <div className="flex items-center">
            <span className="text-muted-foreground text-xs">
              Quantity: {card.quantity}
            </span>
          </div>

          {card.designFileUrl && (
            <div className="flex items-center text-primary text-xs">
              <FileIcon className="h-3 w-3 mr-1" />
              <span>Design file attached</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex justify-end gap-2">
        {onEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(card.id)}
          >
            Edit
          </Button>
        )}
        
        {onUpload && (
          <Button
            variant={card.designFileUrl ? "outline" : "secondary"}
            size="sm"
            onClick={() => onUpload(card.id)}
          >
            {card.designFileUrl ? 'Update File' : 'Upload Design'}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}