type StorageOptions = {
  /**
   * Version of the schema for the stored data
   * When version changes, previous data will be cleared
   */
  version?: number | string;
  
  /**
   * Namespace to prevent collisions with other apps using localStorage
   * All keys will be prefixed with this namespace
   */
  namespace?: string;
  
  /**
   * TTL in milliseconds for cached items
   * If not provided, items will not expire
   */
  ttl?: number;
};

export interface StorageItem<T> {
  value: T;
  version: number | string;
  timestamp: number;
  expiry?: number;
}

/**
 * Enhanced localStorage service with versioning, namespacing, and TTL support
 */
export class LocalStorageService {
  private readonly version: number | string;
  private readonly namespace: string;
  private readonly defaultTtl?: number;
  private readonly keyPrefix: string;

  constructor(options: StorageOptions = {}) {
    this.version = options.version || 1;
    this.namespace = options.namespace || 'app';
    this.defaultTtl = options.ttl;
    this.keyPrefix = `${this.namespace}:`;
    
    // Migrate/clear storage when version changes
    this.migrateStorage();
  }

  /**
   * Get a value from localStorage
   * Returns undefined if the key doesn't exist or the version doesn't match
   */
  public get<T>(key: string): T | undefined {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const storedValue = localStorage.getItem(prefixedKey);
      
      if (!storedValue) {
        return undefined;
      }
      
      const item = JSON.parse(storedValue) as StorageItem<T>;
      
      // Check if version matches
      if (item.version !== this.version) {
        this.remove(key);
        return undefined;
      }
      
      // Check if item is expired
      if (item.expiry && item.expiry < Date.now()) {
        this.remove(key);
        return undefined;
      }
      
      return item.value;
    } catch (error) {
      console.error('[LocalStorageService] Error getting item:', error);
      return undefined;
    }
  }

  /**
   * Set a value in localStorage
   */
  public set<T>(key: string, value: T, ttl?: number): void {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const now = Date.now();
      
      const expiry = ttl || this.defaultTtl 
        ? now + (ttl || this.defaultTtl || 0) 
        : undefined;
      
      const storageItem: StorageItem<T> = {
        value,
        version: this.version,
        timestamp: now,
        expiry,
      };
      
      localStorage.setItem(prefixedKey, JSON.stringify(storageItem));
    } catch (error) {
      console.error('[LocalStorageService] Error setting item:', error);
    }
  }

  /**
   * Remove an item from localStorage
   */
  public remove(key: string): void {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      localStorage.removeItem(prefixedKey);
    } catch (error) {
      console.error('[LocalStorageService] Error removing item:', error);
    }
  }

  /**
   * Check if an item exists and is not expired
   */
  public has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Clear all items for this namespace and version
   */
  public clear(): void {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.keyPrefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('[LocalStorageService] Error clearing storage:', error);
    }
  }

  /**
   * Get all keys for this namespace
   */
  public keys(): string[] {
    try {
      return Object.keys(localStorage)
        .filter(key => key.startsWith(this.keyPrefix))
        .map(key => key.replace(this.keyPrefix, ''));
    } catch (error) {
      console.error('[LocalStorageService] Error getting keys:', error);
      return [];
    }
  }

  /**
   * Get remaining time to live for a key in milliseconds
   * Returns undefined if the key doesn't exist or doesn't have an expiry
   */
  public getTtl(key: string): number | undefined {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const storedValue = localStorage.getItem(prefixedKey);
      
      if (!storedValue) {
        return undefined;
      }
      
      const item = JSON.parse(storedValue) as StorageItem<unknown>;
      
      if (!item.expiry) {
        return undefined;
      }
      
      const remainingTime = item.expiry - Date.now();
      return remainingTime > 0 ? remainingTime : 0;
    } catch (error) {
      console.error('[LocalStorageService] Error getting TTL:', error);
      return undefined;
    }
  }

  /**
   * Extend the TTL of an item
   */
  public extendTtl(key: string, ttl: number): boolean {
    try {
      const value = this.get(key);
      
      if (value === undefined) {
        return false;
      }
      
      this.set(key, value, ttl);
      return true;
    } catch (error) {
      console.error('[LocalStorageService] Error extending TTL:', error);
      return false;
    }
  }

  /**
   * Update an existing item without changing its expiry time
   */
  public update<T>(key: string, value: T): boolean {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const storedValue = localStorage.getItem(prefixedKey);
      
      if (!storedValue) {
        return false;
      }
      
      const item = JSON.parse(storedValue) as StorageItem<T>;
      
      // Keep the same expiry
      const updatedItem: StorageItem<T> = {
        ...item,
        value,
        timestamp: Date.now(),
      };
      
      localStorage.setItem(prefixedKey, JSON.stringify(updatedItem));
      return true;
    } catch (error) {
      console.error('[LocalStorageService] Error updating item:', error);
      return false;
    }
  }

  /**
   * Clean up expired items
   */
  public cleanExpired(): void {
    try {
      Object.keys(localStorage).forEach(key => {
        if (!key.startsWith(this.keyPrefix)) {
          return;
        }
        
        const storedValue = localStorage.getItem(key);
        if (!storedValue) {
          return;
        }
        
        const item = JSON.parse(storedValue) as StorageItem<unknown>;
        
        if (item.expiry && item.expiry < Date.now()) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('[LocalStorageService] Error cleaning expired items:', error);
    }
  }

  /**
   * Migrate storage when version changes
   * Clears items from old versions
   */
  private migrateStorage(): void {
    try {
      // Get the metadata key where we store version info
      const metaKey = this.getPrefixedKey('__meta__');
      const storedMeta = localStorage.getItem(metaKey);
      
      // If metadata exists, check if version has changed
      if (storedMeta) {
        const meta = JSON.parse(storedMeta);
        
        if (meta.version !== this.version) {
          // Version changed, clear all items for this namespace
          this.clear();
          
          // Update metadata with new version
          localStorage.setItem(metaKey, JSON.stringify({
            version: this.version,
            updatedAt: Date.now(),
          }));
        }
      } else {
        // No metadata exists, set it for the first time
        localStorage.setItem(metaKey, JSON.stringify({
          version: this.version,
          createdAt: Date.now(),
        }));
      }
    } catch (error) {
      console.error('[LocalStorageService] Error during migration:', error);
    }
  }

  /**
   * Get prefixed key to avoid collisions
   */
  private getPrefixedKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }
}

// Export a singleton instance with default options
export const localStorageService = new LocalStorageService({
  namespace: 'azteam',
  version: 1,
});

// Convenience accessors
export const storage = {
  get: <T>(key: string) => localStorageService.get<T>(key),
  set: <T>(key: string, value: T, ttl?: number) => localStorageService.set(key, value, ttl),
  remove: (key: string) => localStorageService.remove(key),
  clear: () => localStorageService.clear(),
  has: (key: string) => localStorageService.has(key),
};