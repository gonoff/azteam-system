import { OrderStatus, ProductionMethod, TaskType } from './enums'

/**
 * Calculates estimated production time for an item based on its production method and quantity
 * @param productionMethod The method used to produce the item
 * @param taskType The specific task type
 * @param quantity The number of items
 * @returns Time in minutes
 */
export function calculateEstimatedTime(
  productionMethod: ProductionMethod,
  taskType: TaskType | null,
  quantity: number
): number {
  switch (productionMethod) {
    case ProductionMethod.HEAT_TRANSFER_VINYL:
      switch (taskType) {
        case TaskType.CUT_VINYL:
          return 5 * quantity
        case TaskType.WEED_VINYL:
          return 3 * quantity
        case TaskType.PRESS_SHIRTS:
          return 2 * quantity
        default:
          return (5 + 3 + 2) * quantity // Sum of all tasks
      }
      
    case ProductionMethod.SUBLIMATION:
      switch (taskType) {
        case TaskType.PRINT_DESIGN:
          return 1 * quantity
        case TaskType.PRESS:
          return 2 * quantity
        default:
          return (1 + 2) * quantity // Sum of all tasks
      }
      
    case ProductionMethod.EMBROIDERY:
      switch (taskType) {
        case TaskType.DIGITIZE:
          return 15 * quantity
        case TaskType.PRODUCTION:
          return 30 * quantity
        default:
          return (15 + 30) * quantity // Sum of all tasks
      }
      
    default:
      return 0
  }
}

/**
 * Calculates business days from now to a target date (excluding weekends)
 * @param targetDate The target date
 * @returns Number of business days
 */
export function calculateBusinessDays(targetDate: Date): number {
  const current = new Date()
  current.setHours(0, 0, 0, 0)
  
  const target = new Date(targetDate)
  target.setHours(0, 0, 0, 0)
  
  // Early return for same day
  if (current.getTime() === target.getTime()) return 0
  
  let days = 0
  const tempDate = new Date(current)
  
  while (tempDate < target) {
    tempDate.setDate(tempDate.getDate() + 1)
    const dayOfWeek = tempDate.getDay()
    
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      days++
    }
  }
  
  return days
}

/**
 * Calculates a due date based on the quantity of items
 * @param orderDate The date the order was placed
 * @param quantity The total quantity of items
 * @returns Due date
 */
export function calculateDueDate(orderDate: Date, quantity: number): Date {
  const dueDate = new Date(orderDate)
  const businessDays = getBusinessDaysFromQuantity(quantity)
  
  // Add business days
  let daysAdded = 0
  while (daysAdded < businessDays) {
    dueDate.setDate(dueDate.getDate() + 1)
    const dayOfWeek = dueDate.getDay()
    
    // Skip weekends
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      daysAdded++
    }
  }
  
  return dueDate
}

/**
 * Gets the number of business days based on quantity tiers
 * @param quantity The total quantity of items
 * @returns Number of business days
 */
function getBusinessDaysFromQuantity(quantity: number): number {
  if (quantity <= 10) {
    return 5 // 1-10 shirts: 5 business days
  } else if (quantity <= 50) {
    return 10 // 10-50 shirts: 10 business days
  } else {
    return 15 // Over 50 shirts: 15 business days
  }
}

/**
 * Returns a human-readable status label
 * @param status The status enum value
 * @returns Human-readable status label
 */
export function getStatusLabel(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.AWAITING:
      return 'Awaiting'
    case OrderStatus.ORDER_PLACED:
      return 'Order Placed'
    case OrderStatus.SHIRTS_ARRIVED:
      return 'Shirts Arrived'
    case OrderStatus.DELIVERED:
      return 'Delivered'
    default:
      return status
  }
}