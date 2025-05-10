import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Order, OrderItem, OrderStatus, StatusHistoryEntry, ProductionMethod } from '@/types'
import { CreateOrderInput } from '@/lib/validations/orderSchema'

// Filter type for order filtering
export type OrderFilter = {
  status?: OrderStatus[]
  productionMethod?: ProductionMethod[]
  priorityOnly?: boolean
  search?: string
  dateRange?: {
    start?: string
    end?: string
  }
  clientName?: string
}

// Sort options for order sorting
export type OrderSortOption = 'orderDate' | 'dueDate' | 'clientName' | 'status' | 'priority'
export type OrderSortDirection = 'asc' | 'desc'

// Define the store state and actions
interface OrderState {
  // Data
  orders: Order[]

  // Filters and sorting
  filter: OrderFilter
  sortBy: OrderSortOption
  sortDirection: OrderSortDirection

  // Filter and sort actions
  setFilter: (filter: OrderFilter) => void
  setSorting: (sortBy: OrderSortOption, direction?: OrderSortDirection) => void
  clearFilters: () => void

  // CRUD operations
  addOrder: (order: CreateOrderInput) => string
  updateOrder: (id: string, updates: Partial<Order>) => void
  deleteOrder: (id: string) => void
  duplicateOrder: (id: string) => string

  // Item operations
  addItemToOrder: (orderId: string, item: Omit<OrderItem, 'id'>) => string
  updateItemInOrder: (orderId: string, itemId: string, updates: Partial<OrderItem>) => void
  deleteItemFromOrder: (orderId: string, itemId: string) => void

  // Status operations
  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => void
  getPreviousStatuses: (orderId: string) => StatusHistoryEntry[]

  // Utility getters
  getFilteredOrders: () => Order[]
  getOrderById: (id: string) => Order | undefined
  getTotalOrders: () => number
  getOrdersByStatus: (status: OrderStatus) => Order[]
  getOrdersByClient: (clientId: string) => Order[]
}

// Helper function to calculate total quantity and estimated time
const calculateOrderTotals = (order: Order): Pick<Order, 'totalQuantity' | 'totalEstimatedTime'> => {
  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0)
  const totalEstimatedTime = order.items.reduce((sum, item) => sum + (item.estimatedTime || 0), 0)

  return { totalQuantity, totalEstimatedTime }
}

// Helper function to generate a new order number
const generateOrderNumber = (existingOrders: Order[]): string => {
  const today = new Date()
  const year = today.getFullYear().toString().slice(-2)
  const month = (today.getMonth() + 1).toString().padStart(2, '0')

  // Find the highest order number with the same prefix
  const prefix = `${year}${month}-`
  const existingNumbers = existingOrders
    .map(order => order.orderNumber || '')
    .filter(num => num.startsWith(prefix))
    .map(num => {
      const sequence = num.split('-')[1]
      return sequence ? parseInt(sequence, 10) : 0
    })

  const nextSequence = existingNumbers.length > 0
    ? Math.max(...existingNumbers) + 1
    : 1

  return `${prefix}${nextSequence.toString().padStart(3, '0')}`
}

// Create Zustand store with persistence
export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      // Initial state
      orders: [],
      filter: {},
      sortBy: 'dueDate',
      sortDirection: 'asc',

      // Filter and sort actions
      setFilter: (filter) => set({ filter }),

      setSorting: (sortBy, direction) => set((state) => ({
        sortBy,
        sortDirection: direction || (sortBy === state.sortBy && state.sortDirection === 'asc' ? 'desc' : 'asc')
      })),

      clearFilters: () => set({ filter: {} }),

      // Add a new order
      addOrder: (orderData) => {
        const id = crypto.randomUUID()
        const timestamp = new Date().toISOString()

        set((state) => {
          // Generate a unique order number
          const orderNumber = generateOrderNumber(state.orders)

          // Create the new order with timestamps and IDs
          const newOrder: Order = {
            ...orderData,
            id,
            orderNumber,
            createdAt: timestamp,
            updatedAt: timestamp,
            status: orderData.status || OrderStatus.PENDING,
            items: (orderData.items || []).map(item => ({
              ...item,
              id: crypto.randomUUID(),
              status: item.status || OrderStatus.PENDING
            })),
            statusHistory: [
              {
                status: orderData.status || OrderStatus.PENDING,
                timestamp,
                notes: 'Order created'
              }
            ]
          }

          // Calculate totals
          const totals = calculateOrderTotals(newOrder)

          return {
            orders: [
              ...state.orders,
              {
                ...newOrder,
                ...totals
              }
            ]
          }
        })

        return id
      },

      // Update an existing order
      updateOrder: (id, updates) => {
        const timestamp = new Date().toISOString()

        set((state) => {
          const orders = state.orders.map(order => {
            if (order.id !== id) return order

            // Create updated order with new timestamp
            const updatedOrder = {
              ...order,
              ...updates,
              updatedAt: timestamp
            }

            // If status was updated, add to history
            if (updates.status && updates.status !== order.status) {
              const historyEntry: StatusHistoryEntry = {
                status: updates.status,
                timestamp,
                notes: updates.notes || `Status changed to ${updates.status}`
              }

              updatedOrder.statusHistory = [
                ...(order.statusHistory || []),
                historyEntry
              ]
            }

            // Recalculate totals if items were updated
            if (updates.items) {
              const totals = calculateOrderTotals(updatedOrder)
              return { ...updatedOrder, ...totals }
            }

            return updatedOrder
          })

          return { orders }
        })
      },

      // Delete an order
      deleteOrder: (id) => set((state) => ({
        orders: state.orders.filter(order => order.id !== id)
      })),

      // Duplicate an order
      duplicateOrder: (id) => {
        const order = get().getOrderById(id)
        if (!order) return ''

        const timestamp = new Date().toISOString()
        const newId = crypto.randomUUID()

        set((state) => {
          // Generate a unique order number
          const orderNumber = generateOrderNumber(state.orders)

          // Create duplicate but with new IDs and timestamps
          const duplicatedOrder: Order = {
            ...order,
            id: newId,
            orderNumber,
            createdAt: timestamp,
            updatedAt: timestamp,
            status: OrderStatus.PENDING,
            items: order.items.map(item => ({
              ...item,
              id: crypto.randomUUID(),
              status: OrderStatus.PENDING
            })),
            statusHistory: [
              {
                status: OrderStatus.PENDING,
                timestamp,
                notes: 'Order duplicated from #' + (order.orderNumber || order.id)
              }
            ]
          }

          return {
            orders: [...state.orders, duplicatedOrder]
          }
        })

        return newId
      },

      // Add an item to an order
      addItemToOrder: (orderId, item) => {
        const itemId = crypto.randomUUID()

        set((state) => {
          const orders = state.orders.map(order => {
            if (order.id !== orderId) return order

            const updatedOrder = {
              ...order,
              updatedAt: new Date().toISOString(),
              items: [
                ...order.items,
                {
                  ...item,
                  id: itemId,
                  status: item.status || OrderStatus.PENDING
                }
              ]
            }

            // Recalculate totals
            const totals = calculateOrderTotals(updatedOrder)
            return { ...updatedOrder, ...totals }
          })

          return { orders }
        })

        return itemId
      },

      // Update an item in an order
      updateItemInOrder: (orderId, itemId, updates) => {
        set((state) => {
          const orders = state.orders.map(order => {
            if (order.id !== orderId) return order

            const updatedOrder = {
              ...order,
              updatedAt: new Date().toISOString(),
              items: order.items.map(item =>
                item.id === itemId
                  ? { ...item, ...updates }
                  : item
              )
            }

            // Recalculate totals
            const totals = calculateOrderTotals(updatedOrder)
            return { ...updatedOrder, ...totals }
          })

          return { orders }
        })
      },

      // Delete an item from an order
      deleteItemFromOrder: (orderId, itemId) => {
        set((state) => {
          const orders = state.orders.map(order => {
            if (order.id !== orderId) return order

            const updatedOrder = {
              ...order,
              updatedAt: new Date().toISOString(),
              items: order.items.filter(item => item.id !== itemId)
            }

            // Recalculate totals
            const totals = calculateOrderTotals(updatedOrder)
            return { ...updatedOrder, ...totals }
          })

          return { orders }
        })
      },

      // Update order status with history tracking
      updateOrderStatus: (orderId, status, notes) => {
        const timestamp = new Date().toISOString()

        set((state) => {
          const orders = state.orders.map(order => {
            if (order.id !== orderId) return order

            // Create history entry
            const historyEntry: StatusHistoryEntry = {
              status,
              timestamp,
              notes: notes || `Status changed to ${status}`
            }

            return {
              ...order,
              status,
              updatedAt: timestamp,
              statusHistory: [
                ...(order.statusHistory || []),
                historyEntry
              ]
            }
          })

          return { orders }
        })
      },

      // Get status history for an order
      getPreviousStatuses: (orderId) => {
        const order = get().getOrderById(orderId)
        return order?.statusHistory || []
      },

      // Get filtered and sorted orders
      getFilteredOrders: () => {
        const { orders, filter, sortBy, sortDirection } = get()

        // Apply filters
        let filtered = [...orders]

        if (filter.status && filter.status.length > 0) {
          filtered = filtered.filter(order => filter.status!.includes(order.status))
        }

        if (filter.priorityOnly) {
          filtered = filtered.filter(order => order.isPriority)
        }

        if (filter.productionMethod && filter.productionMethod.length > 0) {
          filtered = filtered.filter(order =>
            order.items.some(item =>
              filter.productionMethod!.includes(item.productionMethod)
            )
          )
        }

        if (filter.search) {
          const search = filter.search.toLowerCase()
          filtered = filtered.filter(order =>
            order.client.name.toLowerCase().includes(search) ||
            order.orderNumber?.toLowerCase().includes(search) ||
            order.notes?.toLowerCase().includes(search) ||
            order.items.some(item =>
              item.description.toLowerCase().includes(search)
            )
          )
        }

        if (filter.dateRange?.start) {
          const startDate = new Date(filter.dateRange.start)
          filtered = filtered.filter(order => new Date(order.orderDate) >= startDate)
        }

        if (filter.dateRange?.end) {
          const endDate = new Date(filter.dateRange.end)
          filtered = filtered.filter(order => new Date(order.orderDate) <= endDate)
        }

        if (filter.clientName) {
          filtered = filtered.filter(order =>
            order.client.name.toLowerCase().includes(filter.clientName!.toLowerCase())
          )
        }

        // Apply sorting
        filtered.sort((a, b) => {
          const direction = sortDirection === 'asc' ? 1 : -1

          switch (sortBy) {
            case 'clientName':
              return a.client.name.localeCompare(b.client.name) * direction
            case 'orderDate':
              return (new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()) * direction
            case 'dueDate':
              return (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * direction
            case 'status':
              return a.status.localeCompare(b.status) * direction
            case 'priority':
              return ((a.isPriority === b.isPriority) ? 0 : a.isPriority ? -1 : 1) * direction
            default:
              return 0
          }
        })

        return filtered
      },

      // Get a single order by ID
      getOrderById: (id) => {
        return get().orders.find(order => order.id === id)
      },

      // Get total count of orders
      getTotalOrders: () => {
        return get().orders.length
      },

      // Get orders by status
      getOrdersByStatus: (status) => {
        return get().orders.filter(order => order.status === status)
      },

      // Get orders by client
      getOrdersByClient: (clientId) => {
        return get().orders.filter(order => order.client.id === clientId)
      },
    }),
    {
      name: 'orders-storage',
      // Add a version number for future migrations
      version: 1,
      // Partial serialization/deserialization if needed
      partialize: (state) => ({
        orders: state.orders,
        // Don't persist filters and sorting
      }),
    }
  )
)