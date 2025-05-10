import { format } from 'date-fns'
import { AlertTriangleIcon, Calendar, CheckCircle2, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ArtworkStatus, KanbanCard } from '@/types'
import { Badge } from '@/components/ui/badge'

interface KanbanCardComponentProps {
  card: KanbanCard
  onDragStart: () => void
  onDragEnd: () => void
  onClick?: () => void
  className?: string
}

/**
 * Card component for the kanban board
 */
export function KanbanCardComponent({
  card,
  onDragStart,
  onDragEnd,
  onClick,
  className,
}: KanbanCardComponentProps) {
  // Is due date in the past?
  const isPastDue = new Date(card.dueDate) < new Date()

  // Is due date within 2 days?
  const isDueSoon = !isPastDue && 
    (new Date(card.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) <= 2

  // Get artwork status badge
  const getArtworkBadge = () => {
    switch (card.artworkStatus) {
      case ArtworkStatus.NEEDS_CREATION:
        return (
          <Badge variant="outline" className="border-red-500 text-red-500">
            Needs Artwork
          </Badge>
        )
      case ArtworkStatus.AWAITING_APPROVAL:
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-500">
            Awaiting Approval
          </Badge>
        )
      case ArtworkStatus.APPROVED:
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            Artwork Approved
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div
      className={cn(
        'p-3 bg-card rounded-md border shadow-sm cursor-pointer hover:shadow-md transition-shadow',
        card.isPriority ? 'border-l-4 border-l-red-500' : '',
        className
      )}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="font-medium truncate">{card.clientName}</div>
        {card.isPriority && <AlertTriangleIcon className="h-4 w-4 text-red-500" />}
      </div>

      <div className="text-sm space-y-1">
        <div className="flex items-center text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          <span>
            {format(new Date(card.orderDate), 'MMM d')}
          </span>
        </div>

        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
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

        <div className="flex flex-wrap gap-1 mt-2">
          {getArtworkBadge()}
        </div>
      </div>
    </div>
  )
}