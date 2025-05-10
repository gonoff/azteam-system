import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { KanbanCard, KanbanStage } from '@/types'

// Define the store state and actions
interface ShirtKanbanState {
  cards: KanbanCard[]
  addCard: (card: Omit<KanbanCard, 'id'>) => string
  updateCard: (id: string, updates: Partial<KanbanCard>) => void
  moveCard: (id: string, targetStage: KanbanStage) => void
  deleteCard: (id: string) => void
  getCardsByStage: (stage: KanbanStage) => KanbanCard[]
}

// Create Zustand store with persistence
export const useShirtKanbanStore = create<ShirtKanbanState>()(
  persist(
    (set, get) => ({
      cards: [],
      
      // Add a new card
      addCard: (card) => {
        const id = crypto.randomUUID()
        set((state) => ({
          cards: [...state.cards, { ...card, id }]
        }))
        return id
      },
      
      // Update an existing card
      updateCard: (id, updates) => set((state) => ({
        cards: state.cards.map(card => 
          card.id === id 
            ? { ...card, ...updates } 
            : card
        )
      })),
      
      // Move a card to a different stage
      moveCard: (id, targetStage) => set((state) => ({
        cards: state.cards.map(card => 
          card.id === id 
            ? { ...card, stage: targetStage } 
            : card
        )
      })),
      
      // Delete a card
      deleteCard: (id) => set((state) => ({
        cards: state.cards.filter(card => card.id !== id)
      })),
      
      // Get cards by stage
      getCardsByStage: (stage) => {
        return get().cards.filter(card => card.stage === stage)
      }
    }),
    {
      name: 'shirt-kanban-storage',
    }
  )
)