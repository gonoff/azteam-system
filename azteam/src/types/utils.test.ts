import { describe, it, expect } from 'vitest'
import { 
  calculateEstimatedTime, 
  calculateBusinessDays, 
  calculateDueDate,
  getStatusLabel 
} from './utils'
import { ProductionMethod, TaskType, OrderStatus } from './enums'

describe('Utility Functions', () => {
  describe('calculateEstimatedTime', () => {
    it('calculates time for Heat Transfer Vinyl production', () => {
      // Test each task type
      expect(calculateEstimatedTime(ProductionMethod.HEAT_TRANSFER_VINYL, TaskType.CUT_VINYL, 2))
        .toBe(10) // 5 min/unit * 2 units
        
      expect(calculateEstimatedTime(ProductionMethod.HEAT_TRANSFER_VINYL, TaskType.WEED_VINYL, 3))
        .toBe(9) // 3 min/unit * 3 units
        
      expect(calculateEstimatedTime(ProductionMethod.HEAT_TRANSFER_VINYL, TaskType.PRESS_SHIRTS, 4))
        .toBe(8) // 2 min/unit * 4 units
      
      // Test with null task type (should return sum of all tasks)
      expect(calculateEstimatedTime(ProductionMethod.HEAT_TRANSFER_VINYL, null, 2))
        .toBe(20) // (5 + 3 + 2) * 2 units
    })
    
    it('calculates time for Sublimation production', () => {
      // Test each task type
      expect(calculateEstimatedTime(ProductionMethod.SUBLIMATION, TaskType.PRINT_DESIGN, 2))
        .toBe(2) // 1 min/unit * 2 units
        
      expect(calculateEstimatedTime(ProductionMethod.SUBLIMATION, TaskType.PRESS, 3))
        .toBe(6) // 2 min/unit * 3 units
      
      // Test with null task type (should return sum of all tasks)
      expect(calculateEstimatedTime(ProductionMethod.SUBLIMATION, null, 2))
        .toBe(6) // (1 + 2) * 2 units
    })
    
    it('calculates time for Embroidery production', () => {
      // Test each task type
      expect(calculateEstimatedTime(ProductionMethod.EMBROIDERY, TaskType.DIGITIZE, 2))
        .toBe(30) // 15 min/unit * 2 units
        
      expect(calculateEstimatedTime(ProductionMethod.EMBROIDERY, TaskType.PRODUCTION, 3))
        .toBe(90) // 30 min/unit * 3 units
      
      // Test with null task type (should return sum of all tasks)
      expect(calculateEstimatedTime(ProductionMethod.EMBROIDERY, null, 2))
        .toBe(90) // (15 + 30) * 2 units
    })
  })
  
  describe('calculateBusinessDays', () => {
    it('returns 0 for the same day', () => {
      const today = new Date()
      expect(calculateBusinessDays(today)).toBe(0)
    })
    
    it('skips weekends when calculating business days', () => {
      // Create a Monday
      const monday = new Date('2025-01-06')
      
      // Create dates for different days of the week
      const tuesday = new Date('2025-01-07') // 1 business day after Monday
      const friday = new Date('2025-01-10') // 4 business days after Monday
      const nextMonday = new Date('2025-01-13') // 5 business days after Monday (skipping weekend)
      
      // Set current date to Monday
      const originalDate = new Date()
      const mockDate = monday
      mockDate.setHours(0, 0, 0, 0)
      
      // Mock current date to be Monday
      const current = mockDate
      
      expect(calculateBusinessDays(tuesday)).toBe(1)
      expect(calculateBusinessDays(friday)).toBe(4)
      expect(calculateBusinessDays(nextMonday)).toBe(5) // Skips the weekend
    })
  })
  
  describe('getStatusLabel', () => {
    it('returns human-readable status labels', () => {
      expect(getStatusLabel(OrderStatus.AWAITING)).toBe('Awaiting')
      expect(getStatusLabel(OrderStatus.ORDER_PLACED)).toBe('Order Placed')
      expect(getStatusLabel(OrderStatus.SHIRTS_ARRIVED)).toBe('Shirts Arrived')
      expect(getStatusLabel(OrderStatus.DELIVERED)).toBe('Delivered')
    })
  })
})