import {
  OrderStatus,
  ProductionMethod,
  Size,
  KanbanStage,
  ArtworkStatus,
  TaskStatus,
  TaskType,
  BusinessCardStage
} from './enums'

/**
 * Client information interface
 * Represents customer details for an order
 */
export interface ClientInfo {
  id?: string
  name: string
  phone: string
  email?: string
  address?: string
  company?: string
  notes?: string
}

/**
 * Order item interface
 * Represents a single item within an order
 */
export interface OrderItem {
  id: string
  size: Size
  quantity: number
  color?: string
  description: string
  productionMethod: ProductionMethod
  status: OrderStatus
  artworkStatus?: ArtworkStatus
  artworkUrl?: string
  notes?: string
  estimatedTime?: number
  taskIds?: string[]
}

/**
 * Order interface
 * Represents a complete customer order
 */
export interface Order {
  id: string
  orderNumber?: string
  client: ClientInfo
  orderDate: string
  dueDate: string
  estimatedCompletionDate?: string
  isPriority: boolean
  items: OrderItem[]
  status: OrderStatus
  totalQuantity?: number
  totalEstimatedTime?: number
  notes?: string
  paymentStatus?: 'UNPAID' | 'PARTIAL' | 'PAID'
  paymentAmount?: number
  createdAt: string
  updatedAt: string
  statusHistory?: StatusHistoryEntry[]
}

/**
 * Status history entry interface
 * Tracks changes to order status
 */
export interface StatusHistoryEntry {
  status: OrderStatus
  timestamp: string
  notes?: string
  updatedBy?: string
}

/**
 * Kanban card interface for shirt production
 */
export interface KanbanCard {
  id: string
  orderId: string
  clientName: string
  orderDate: string
  dueDate: string
  productionMethods: ProductionMethod[]
  description: string
  isPriority: boolean
  artworkStatus: ArtworkStatus
  stage: KanbanStage
}

/**
 * Task interface
 */
export interface Task {
  id: string
  kanbanCardId: string
  orderId: string
  clientName: string
  taskType: TaskType
  productionMethod: ProductionMethod
  description: string
  estimatedMinutes: number
  isPriority: boolean
  status: TaskStatus
  createdAt: string
  completedAt: string | null
}

/**
 * Business card interface
 */
export interface BusinessCard {
  id: string
  clientName: string
  contactInfo: string
  orderDate: string
  dueDate: string
  designSpecs: string
  quantity: number
  isPriority: boolean
  notes: string
  designFileUrl?: string
  stage: BusinessCardStage
}