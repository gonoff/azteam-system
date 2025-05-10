import { cn } from '@/lib/utils'
import { KanbanCard, KanbanStage } from '@/types'
import { KanbanCardComponent } from './KanbanCard'

interface KanbanColumnProps {
  title: string
  cards: KanbanCard[]
  stage: KanbanStage
  onCardDragStart: (cardId: string) => void
  onCardDragEnd: () => void
  onDrop: (targetStage: KanbanStage) => void
  onCardClick?: (cardId: string) => void
  className?: string
}

/**
 * Kanban column component representing a single stage in the workflow
 */
export function KanbanColumn({
  title,
  cards,
  stage,
  onCardDragStart,
  onCardDragEnd,
  onDrop,
  onCardClick,
  className,
}: KanbanColumnProps) {
  // Handle drag and drop events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    onDrop(stage)
  }

  return (
    <div
      className={cn('flex flex-col h-full', className)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h3 className="font-medium text-sm p-2 text-center bg-muted rounded-t-md">
        {title}
        <span className="ml-1 text-xs font-normal text-muted-foreground">
          ({cards.length})
        </span>
      </h3>
      
      <div className="flex-1 overflow-y-auto p-2 bg-muted/30 rounded-b-md space-y-2">
        {cards.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            No cards
          </div>
        ) : (
          cards.map((card) => (
            <KanbanCardComponent
              key={card.id}
              card={card}
              onDragStart={() => onCardDragStart(card.id)}
              onDragEnd={onCardDragEnd}
              onClick={() => onCardClick && onCardClick(card.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}