import { OrderStatus, ProductionMethod, TaskType } from './enums'

/**
 * Base time estimates for each production method and task (in minutes per unit)
 */
export const TIME_ESTIMATES = {
  [ProductionMethod.HEAT_TRANSFER_VINYL]: {
    [TaskType.CUT_VINYL]: 5,
    [TaskType.WEED_VINYL]: 3,
    [TaskType.PRESS_SHIRTS]: 2,
    setup: 10, // Additional setup time regardless of quantity
    total: 10 // Total time per unit (sum of all tasks)
  },
  [ProductionMethod.SUBLIMATION]: {
    [TaskType.PRINT_DESIGN]: 1,
    [TaskType.PRESS]: 2,
    setup: 15,
    total: 3
  },
  [ProductionMethod.EMBROIDERY]: {
    [TaskType.DIGITIZE]: 15,
    [TaskType.PRODUCTION]: 30,
    setup: 20,
    total: 45
  }
}

/**
 * Scale factors for larger quantities
 * These represent efficiency gains for larger batches
 */
export const QUANTITY_SCALE_FACTORS = [
  { max: 5, factor: 1.0 },    // 1-5 items: no efficiency gain
  { max: 20, factor: 0.9 },   // 6-20 items: 10% efficiency gain
  { max: 50, factor: 0.8 },   // 21-50 items: 20% efficiency gain
  { max: 100, factor: 0.7 },  // 51-100 items: 30% efficiency gain
  { max: Infinity, factor: 0.6 } // 100+ items: 40% efficiency gain
]

/**
 * Get the scale factor based on quantity
 */
export function getQuantityScaleFactor(quantity: number): number {
  for (const { max, factor } of QUANTITY_SCALE_FACTORS) {
    if (quantity <= max) {
      return factor
    }
  }
  return QUANTITY_SCALE_FACTORS[QUANTITY_SCALE_FACTORS.length - 1].factor
}

/**
 * Calculates estimated production time for an item based on its production method and quantity
 * Includes setup time and efficiency scaling for larger quantities
 *
 * @param productionMethod The method used to produce the item
 * @param taskType The specific task type (null for total time)
 * @param quantity The number of items
 * @returns Time in minutes
 */
export function calculateEstimatedTime(
  productionMethod: ProductionMethod,
  taskType: TaskType | null,
  quantity: number
): number {
  // Get the method-specific time estimates
  const methodTimes = TIME_ESTIMATES[productionMethod]
  if (!methodTimes) return 0

  // Get the scale factor based on quantity
  const scaleFactor = getQuantityScaleFactor(quantity)

  // If taskType is null, calculate total time for all tasks
  if (taskType === null) {
    // Setup time + (time per unit * quantity * scale factor)
    return Math.round(methodTimes.setup + (methodTimes.total * quantity * scaleFactor))
  }

  // Otherwise, calculate time for the specific task
  const taskTime = methodTimes[taskType]
  if (!taskTime) return 0

  // For specific tasks, we don't include setup time in the calculation
  return Math.round(taskTime * quantity * scaleFactor)
}

/**
 * Holiday configuration (month is 0-based, e.g., January = 0)
 * These are non-business days in addition to weekends
 */
export const HOLIDAYS = [
  { month: 0, day: 1 },   // New Year's Day
  { month: 4, day: 31 },  // Memorial Day (simplified to May 31)
  { month: 6, day: 4 },   // Independence Day (July 4)
  { month: 8, day: 4 },   // Labor Day (simplified to September 4)
  { month: 10, day: 24 }, // Thanksgiving (simplified to November 24)
  { month: 11, day: 25 }, // Christmas Day
]

/**
 * Checks if a date is a weekend (Saturday or Sunday)
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6 // 0 = Sunday, 6 = Saturday
}

/**
 * Checks if a date is a holiday based on the HOLIDAYS configuration
 */
export function isHoliday(date: Date): boolean {
  const month = date.getMonth()
  const day = date.getDate()

  return HOLIDAYS.some(holiday => holiday.month === month && holiday.day === day)
}

/**
 * Checks if a date is a business day (not weekend, not holiday)
 */
export function isBusinessDay(date: Date): boolean {
  return !isWeekend(date) && !isHoliday(date)
}

/**
 * Calculates business days between two dates
 * @param startDate The start date
 * @param endDate The end date
 * @returns Number of business days
 */
export function calculateBusinessDaysBetween(startDate: Date, endDate: Date): number {
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)

  const end = new Date(endDate)
  end.setHours(0, 0, 0, 0)

  // Early return for same day
  if (start.getTime() === end.getTime()) {
    return isBusinessDay(start) ? 1 : 0
  }

  // Ensure start date is before end date
  if (start > end) {
    return calculateBusinessDaysBetween(end, start)
  }

  let days = 0
  const tempDate = new Date(start)

  // Count business days between dates
  while (tempDate <= end) {
    if (isBusinessDay(tempDate)) {
      days++
    }
    tempDate.setDate(tempDate.getDate() + 1)
  }

  return days
}

/**
 * Calculates business days from today to a target date
 * @param targetDate The target date
 * @returns Number of business days
 */
export function calculateBusinessDays(targetDate: Date): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return calculateBusinessDaysBetween(today, targetDate)
}

/**
 * Adds a specific number of business days to a date
 * @param date The starting date
 * @param businessDays Number of business days to add
 * @returns New date with business days added
 */
export function addBusinessDays(date: Date, businessDays: number): Date {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)

  let daysToAdd = businessDays
  while (daysToAdd > 0) {
    result.setDate(result.getDate() + 1)
    if (isBusinessDay(result)) {
      daysToAdd--
    }
  }

  return result
}

/**
 * Gets the number of business days based on quantity tiers and production methods
 * @param quantity The total quantity of items
 * @param methods Array of production methods used
 * @returns Number of business days
 */
export function getBusinessDaysFromQuantity(
  quantity: number,
  methods: ProductionMethod[] = []
): number {
  // Base business days based on quantity
  let businessDays: number

  if (quantity <= 10) {
    businessDays = 5 // 1-10 items: 5 business days
  } else if (quantity <= 50) {
    businessDays = 10 // 11-50 items: 10 business days
  } else {
    businessDays = 15 // Over 50 items: 15 business days
  }

  // Additional days for complex production methods
  if (methods.includes(ProductionMethod.EMBROIDERY)) {
    businessDays += 5 // Embroidery adds 5 business days
  } else if (methods.includes(ProductionMethod.HEAT_TRANSFER_VINYL)) {
    businessDays += 2 // Heat transfer vinyl adds 2 business days
  }

  return businessDays
}

/**
 * Calculates a due date based on the quantity of items and production methods
 * @param orderDate The date the order was placed
 * @param quantity The total quantity of items
 * @param methods Array of production methods used
 * @param isPriority Whether the order is marked as priority
 * @returns Due date
 */
export function calculateDueDate(
  orderDate: Date,
  quantity: number,
  methods: ProductionMethod[] = [],
  isPriority: boolean = false
): Date {
  // Get business days based on quantity and methods
  let businessDays = getBusinessDaysFromQuantity(quantity, methods)

  // Priority orders get expedited (reduce by 30%, minimum 1 day reduction)
  if (isPriority) {
    const reduction = Math.max(Math.ceil(businessDays * 0.3), 1)
    businessDays = Math.max(businessDays - reduction, 1)
  }

  // Add business days to the order date
  return addBusinessDays(orderDate, businessDays)
}

/**
 * Returns a human-readable status label
 * @param status The status enum value
 * @returns Human-readable status label
 */
export function getStatusLabel(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.PENDING:
      return 'Pending'
    case OrderStatus.CONFIRMED:
      return 'Confirmed'
    case OrderStatus.AWAITING:
      return 'Awaiting'
    case OrderStatus.ORDER_PLACED:
      return 'Order Placed'
    case OrderStatus.SHIRTS_ARRIVED:
      return 'Shirts Arrived'
    case OrderStatus.IN_PRODUCTION:
      return 'In Production'
    case OrderStatus.COMPLETED:
      return 'Completed'
    case OrderStatus.DELIVERED:
      return 'Delivered'
    case OrderStatus.CANCELLED:
      return 'Cancelled'
    default:
      return status
  }
}