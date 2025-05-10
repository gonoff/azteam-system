/**
 * Type-safe environment variables
 * This module centralizes access to environment variables with proper typing and defaults
 */

// App metadata
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'AZ Team Order Tracker'
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0'
export const APP_DESCRIPTION = import.meta.env.VITE_APP_DESCRIPTION || 'Order tracking application'

// Environment settings
export const NODE_ENV = import.meta.env.MODE
export const IS_DEV = NODE_ENV === 'development'
export const IS_PROD = NODE_ENV === 'production'
export const IS_TEST = NODE_ENV === 'test'
export const APP_ENV = import.meta.env.VITE_APP_ENV || 'development'
export const DEBUG = import.meta.env.VITE_APP_DEBUG === 'true' || import.meta.env.VITE_APP_DEBUG === true

// API settings (for future use)
export const API_URL = import.meta.env.VITE_API_URL || ''
export const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT || 30000)

// Feature flags
export const FEATURE_BUSINESS_CARDS = 
  import.meta.env.VITE_FEATURE_BUSINESS_CARDS === 'true' || 
  import.meta.env.VITE_FEATURE_BUSINESS_CARDS === true

// Time calculation settings
export const TIME_CONFIG = {
  heatTransferVinyl: {
    cut: Number(import.meta.env.VITE_TIME_HEAT_TRANSFER_VINYL_CUT || 5),
    weed: Number(import.meta.env.VITE_TIME_HEAT_TRANSFER_VINYL_WEED || 3),
    press: Number(import.meta.env.VITE_TIME_HEAT_TRANSFER_VINYL_PRESS || 2),
  },
  sublimation: {
    print: Number(import.meta.env.VITE_TIME_SUBLIMATION_PRINT || 1),
    press: Number(import.meta.env.VITE_TIME_SUBLIMATION_PRESS || 2),
  },
  embroidery: {
    digitize: Number(import.meta.env.VITE_TIME_EMBROIDERY_DIGITIZE || 15),
    production: Number(import.meta.env.VITE_TIME_EMBROIDERY_PRODUCTION || 30),
  },
}