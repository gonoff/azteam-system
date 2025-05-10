import { useState, useEffect, useCallback } from 'react';
import { storage, secureStorage } from '@/services/storage';

interface UseStorageOptions {
  /**
   * Use secure storage for sensitive data
   */
  secure?: boolean;
  
  /**
   * Time to live in milliseconds
   */
  ttl?: number;
  
  /**
   * Default value if key doesn't exist
   */
  defaultValue?: any;
  
  /**
   * Callback when value changes
   */
  onChange?: (newValue: any) => void;
}

/**
 * React hook for using localStorage/secureStorage with state sync
 * 
 * @example
 * // Basic usage
 * const [token, setToken, removeToken] = useStorage('auth:token');
 * 
 * @example
 * // With secure storage for sensitive data
 * const [apiKey, setApiKey, removeApiKey] = useStorage('apiKey', { secure: true });
 * 
 * @example
 * // With expiration
 * const [sessionData, setSessionData, removeSessionData] = useStorage('session', { 
 *   ttl: 30 * 60 * 1000, // 30 minutes
 *   defaultValue: {}
 * });
 */
export function useStorage<T = any>(
  key: string,
  options: UseStorageOptions = {}
): [T | undefined, (value: T) => void, () => void] {
  const {
    secure = false,
    ttl,
    defaultValue,
    onChange,
  } = options;
  
  // Choose the storage implementation
  const storageImpl = secure ? secureStorage : storage;
  
  // Get initial value from storage or use default
  const getInitialValue = (): T | undefined => {
    const storedValue = storageImpl.get<T>(key);
    return storedValue !== undefined ? storedValue : defaultValue;
  };
  
  // State to hold the current value
  const [value, setValue] = useState<T | undefined>(getInitialValue);
  
  // Update the stored value
  const updateValue = useCallback((newValue: T) => {
    setValue(newValue);
    storageImpl.set(key, newValue, ttl);
    
    if (onChange) {
      onChange(newValue);
    }
  }, [key, ttl, onChange]);
  
  // Remove the value from storage
  const removeValue = useCallback(() => {
    setValue(undefined);
    storageImpl.remove(key);
    
    if (onChange) {
      onChange(undefined);
    }
  }, [key, onChange]);
  
  // Sync state with storage when component mounts
  useEffect(() => {
    setValue(getInitialValue());
  }, [key]);
  
  return [value, updateValue, removeValue];
}

/**
 * Hook for working with secure storage
 */
export function useSecureStorage<T = any>(
  key: string,
  options: Omit<UseStorageOptions, 'secure'> = {}
): [T | undefined, (value: T) => void, () => void] {
  return useStorage<T>(key, { ...options, secure: true });
}

/**
 * Hook that persists an object in localStorage while maintaining
 * reactive access to its properties
 * 
 * @example
 * const [user, setUser, updateUser, resetUser] = useStorageObject('user', {
 *   defaultValue: { name: '', email: '' }
 * });
 * 
 * // Update a single property
 * updateUser({ name: 'John' }); // Only updates the name property
 */
export function useStorageObject<T extends object>(
  key: string,
  options: UseStorageOptions = {}
): [T, React.Dispatch<React.SetStateAction<T>>, (partial: Partial<T>) => void, () => void] {
  const defaultValue = (options.defaultValue || {}) as T;
  
  const [value, setStoredValue] = useStorage<T>(key, {
    ...options,
    defaultValue,
  });
  
  const currentValue = value || defaultValue;
  
  // Wrapper around setStoredValue to handle undefined
  const setValue = (newValue: React.SetStateAction<T>) => {
    const resolvedValue = newValue instanceof Function
      ? newValue(currentValue)
      : newValue;
      
    setStoredValue(resolvedValue);
  };
  
  // Update only specific properties
  const updateValue = (partial: Partial<T>) => {
    setStoredValue({ ...currentValue, ...partial });
  };
  
  // Reset to default value
  const resetValue = () => {
    setStoredValue(defaultValue);
  };
  
  return [currentValue, setValue, updateValue, resetValue];
}

/**
 * Hook for using secureStorage with object values
 */
export function useSecureStorageObject<T extends object>(
  key: string,
  options: Omit<UseStorageOptions, 'secure'> = {}
): [T, React.Dispatch<React.SetStateAction<T>>, (partial: Partial<T>) => void, () => void] {
  return useStorageObject<T>(key, { ...options, secure: true });
}