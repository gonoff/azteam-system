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
 * Order item interface
 * Represents a single item within an order
 */
export interface OrderItem {
  id: string
  size: Size
  quantity: number
  description: string
  productionMethod: ProductionMethod
  status: OrderStatus
}

/**
 * Order interface
 * Represents a complete customer order
 */
export interface Order {
  id: string
  clientName: string
  clientPhone: string
  orderDate: string
  dueDate: string
  isPriority: boolean
  items: OrderItem[]
  status: OrderStatus
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