import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Order, OrderItem } from '@/types'

// Define the store state and actions
interface OrderState {
  orders: Order[]
  addOrder: (order: Omit<Order, 'id'>) => void
  updateOrder: (id: string, updates: Partial<Order>) => void
  deleteOrder: (id: string) => void
  addItemToOrder: (orderId: string, item: Omit<OrderItem, 'id'>) => void
  updateItemInOrder: (orderId: string, itemId: string, updates: Partial<OrderItem>) => void
  deleteItemFromOrder: (orderId: string, itemId: string) => void
}

// Create Zustand store with persistence
export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      
      // Add a new order
      addOrder: (order) => set((state) => ({
        orders: [
          ...state.orders,
          { ...order, id: crypto.randomUUID() }
        ]
      })),
      
      // Update an existing order
      updateOrder: (id, updates) => set((state) => ({
        orders: state.orders.map(order => 
          order.id === id 
            ? { ...order, ...updates } 
            : order
        )
      })),
      
      // Delete an order
      deleteOrder: (id) => set((state) => ({
        orders: state.orders.filter(order => order.id !== id)
      })),
      
      // Add an item to an order
      addItemToOrder: (orderId, item) => set((state) => ({
        orders: state.orders.map(order => 
          order.id === orderId
            ? {
                ...order,
                items: [
                  ...order.items,
                  { ...item, id: crypto.randomUUID() }
                ]
              }
            : order
        )
      })),
      
      // Update an item in an order
      updateItemInOrder: (orderId, itemId, updates) => set((state) => ({
        orders: state.orders.map(order => 
          order.id === orderId
            ? {
                ...order,
                items: order.items.map(item => 
                  item.id === itemId
                    ? { ...item, ...updates }
                    : item
                )
              }
            : order
        )
      })),
      
      // Delete an item from an order
      deleteItemFromOrder: (orderId, itemId) => set((state) => ({
        orders: state.orders.map(order => 
          order.id === orderId
            ? {
                ...order,
                items: order.items.filter(item => item.id !== itemId)
              }
            : order
        )
      })),
    }),
    {
      name: 'orders-storage',
    }
  )
)