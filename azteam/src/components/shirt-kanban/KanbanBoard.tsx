import { useState } from 'react'
import { cn } from '@/lib/utils'
import { KanbanCard, KanbanStage } from '@/types'
import { KanbanColumn } from './KanbanColumn'

interface KanbanBoardProps {
  cards: KanbanCard[]
  onCardMove: (cardId: string, targetStage: KanbanStage) => void
  onCardClick?: (cardId: string) => void
  className?: string
}

/**
 * Kanban board for shirt production workflow
 */
export function KanbanBoard({
  cards,
  onCardMove,
  onCardClick,
  className,
}: KanbanBoardProps) {
  // Define all board columns and their titles
  const columns: { id: KanbanStage; title: string }[] = [
    { id: KanbanStage.NEW_ORDER, title: 'New Order' },
    { id: KanbanStage.ORDER_PLACED, title: 'Order Placed' },
    { id: KanbanStage.SHIRTS_ARRIVING, title: 'Shirts Arriving' },
    { id: KanbanStage.MATERIALS_READY, title: 'Materials Ready' },
    { id: KanbanStage.UNIFORM_COMPLETED, title: 'Uniform Completed' },
  ]

  // Filter cards by stage
  const getCardsForStage = (stage: KanbanStage) => {
    return cards.filter((card) => card.stage === stage)
  }

  // Handle drag and drop functionality
  const [draggedCard, setDraggedCard] = useState<string | null>(null)

  const handleDragStart = (cardId: string) => {
    setDraggedCard(cardId)
  }

  const handleDragEnd = () => {
    setDraggedCard(null)
  }

  const handleDrop = (targetStage: KanbanStage) => {
    if (draggedCard) {
      onCardMove(draggedCard, targetStage)
      setDraggedCard(null)
    }
  }

  return (
    <div
      className={cn('grid grid-cols-1 md:grid-cols-5 gap-4 h-full overflow-hidden', className)}
    >
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          title={column.title}
          cards={getCardsForStage(column.id)}
          stage={column.id}
          onCardDragStart={handleDragStart}
          onCardDragEnd={handleDragEnd}
          onDrop={handleDrop}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  )
}