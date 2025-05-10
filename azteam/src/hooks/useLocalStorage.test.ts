import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  const key = 'test-key'
  const initialValue = 'test-value'
  
  // Mock localStorage API
  const mockLocalStorage = (() => {
    let store: Record<string, string> = {}
    
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value
      }),
      clear: () => {
        store = {}
      }
    }
  })()
  
  // Replace the real localStorage with our mock before each test
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    })
    
    // Clear mock calls and mock storage
    vi.clearAllMocks()
    mockLocalStorage.clear()
  })
  
  it('should use the initial value if localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage(key, initialValue))
    
    expect(result.current[0]).toBe(initialValue)
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith(key)
  })
  
  it('should use value from localStorage if it exists', () => {
    const existingValue = 'existing-value'
    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(existingValue))
    
    const { result } = renderHook(() => useLocalStorage(key, initialValue))
    
    expect(result.current[0]).toBe(existingValue)
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith(key)
  })
  
  it('should update localStorage and state when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage(key, initialValue))
    const newValue = 'new-value'
    
    act(() => {
      result.current[1](newValue)
    })
    
    expect(result.current[0]).toBe(newValue)
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      key, 
      JSON.stringify(newValue)
    )
  })
  
  it('should accept a function to update the value', () => {
    const { result } = renderHook(() => useLocalStorage(key, initialValue))
    
    act(() => {
      result.current[1]((prev) => `${prev}-updated`)
    })
    
    expect(result.current[0]).toBe(`${initialValue}-updated`)
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      key, 
      JSON.stringify(`${initialValue}-updated`)
    )
  })
})