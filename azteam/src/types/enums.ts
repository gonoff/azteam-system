/**
 * Order status enum
 * Represents the possible states of an order in the system
 */
export enum OrderStatus {
  AWAITING = 'AWAITING',
  ORDER_PLACED = 'ORDER_PLACED',
  SHIRTS_ARRIVED = 'SHIRTS_ARRIVED',
  DELIVERED = 'DELIVERED'
}

/**
 * Production method enum
 * Represents the different production methods available
 */
export enum ProductionMethod {
  HEAT_TRANSFER_VINYL = 'HEAT_TRANSFER_VINYL',
  SUBLIMATION = 'SUBLIMATION',
  EMBROIDERY = 'EMBROIDERY'
}

/**
 * Product size enum
 */
export enum Size {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L', 
  XL = 'XL',
  XXL = 'XXL',
  XXXL = 'XXXL'
}

/**
 * Kanban stages for shirt production
 */
export enum KanbanStage {
  NEW_ORDER = 'NEW_ORDER',
  ORDER_PLACED = 'ORDER_PLACED',
  SHIRTS_ARRIVING = 'SHIRTS_ARRIVING',
  MATERIALS_READY = 'MATERIALS_READY',
  UNIFORM_COMPLETED = 'UNIFORM_COMPLETED'
}

/**
 * Artwork status enum
 */
export enum ArtworkStatus {
  NEEDS_CREATION = 'NEEDS_CREATION',
  AWAITING_APPROVAL = 'AWAITING_APPROVAL',
  APPROVED = 'APPROVED'
}

/**
 * Task status enum
 */
export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

/**
 * Task type enum
 */
export enum TaskType {
  CUT_VINYL = 'CUT_VINYL',
  WEED_VINYL = 'WEED_VINYL',
  PRESS_SHIRTS = 'PRESS_SHIRTS',
  PRINT_DESIGN = 'PRINT_DESIGN',
  PRESS = 'PRESS',
  DIGITIZE = 'DIGITIZE',
  PRODUCTION = 'PRODUCTION'
}

/**
 * Business card kanban stages
 */
export enum BusinessCardStage {
  ART_NEEDS_TO_BE_DONE = 'ART_NEEDS_TO_BE_DONE',
  WAITING_FOR_APPROVAL = 'WAITING_FOR_APPROVAL',
  APPROVED = 'APPROVED',
  ORDERED_ONLINE = 'ORDERED_ONLINE'
}