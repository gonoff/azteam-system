import { z } from 'zod'
import { OrderStatus, ProductionMethod, Size, ArtworkStatus } from '@/types/enums'

/**
 * Client information validation schema
 */
export const clientInfoSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Client name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  company: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal(''))
})

/**
 * Order item validation schema
 */
export const orderItemSchema = z.object({
  id: z.string(),
  size: z.nativeEnum(Size, {
    errorMap: () => ({ message: 'Please select a size' })
  }),
  quantity: z.number().int().positive('Quantity must be at least 1'),
  color: z.string().optional().or(z.literal('')),
  description: z.string().min(1, 'Description is required'),
  productionMethod: z.nativeEnum(ProductionMethod, {
    errorMap: () => ({ message: 'Please select a production method' })
  }),
  status: z.nativeEnum(OrderStatus).default(OrderStatus.PENDING),
  artworkStatus: z.nativeEnum(ArtworkStatus).optional(),
  artworkUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  estimatedTime: z.number().optional(),
  taskIds: z.array(z.string()).optional()
})

/**
 * Status history entry validation schema
 */
export const statusHistoryEntrySchema = z.object({
  status: z.nativeEnum(OrderStatus),
  timestamp: z.string(),
  notes: z.string().optional().or(z.literal('')),
  updatedBy: z.string().optional().or(z.literal(''))
})

/**
 * Full order validation schema
 */
export const orderSchema = z.object({
  id: z.string(),
  orderNumber: z.string().optional(),
  client: clientInfoSchema,
  orderDate: z.string(),
  dueDate: z.string(),
  estimatedCompletionDate: z.string().optional(),
  isPriority: z.boolean().default(false),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  status: z.nativeEnum(OrderStatus).default(OrderStatus.PENDING),
  totalQuantity: z.number().optional(),
  totalEstimatedTime: z.number().optional(),
  notes: z.string().optional().or(z.literal('')),
  paymentStatus: z.enum(['UNPAID', 'PARTIAL', 'PAID']).optional(),
  paymentAmount: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  statusHistory: z.array(statusHistoryEntrySchema).optional()
})

/**
 * Order creation schema (subset of fields required for creating a new order)
 */
export const createOrderSchema = orderSchema.omit({
  id: true,
  orderNumber: true,
  createdAt: true,
  updatedAt: true,
  statusHistory: true,
  totalQuantity: true,
  totalEstimatedTime: true
}).extend({
  id: z.string().optional(),
  orderDate: z.string().optional().default(() => new Date().toISOString()),
  status: z.nativeEnum(OrderStatus).default(OrderStatus.PENDING)
})

/**
 * Order update schema (all fields optional for partial updates)
 */
export const updateOrderSchema = orderSchema.partial()

// Type exports
export type ClientInfo = z.infer<typeof clientInfoSchema>
export type OrderItem = z.infer<typeof orderItemSchema>
export type Order = z.infer<typeof orderSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>
export type StatusHistoryEntry = z.infer<typeof statusHistoryEntrySchema>