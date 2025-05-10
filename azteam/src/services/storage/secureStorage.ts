import { LocalStorageService, StorageItem } from './localStorage';

/**
 * Encryption methods for the secure storage service
 * In a real production app, use a more robust encryption library
 */
const crypto = {
  /**
   * Generate a key from the secret
   */
  generateKey(secret: string): string {
    // In a real app, use a proper key derivation function
    // This is a simplified version for demo purposes
    let hash = 0;
    for (let i = 0; i < secret.length; i++) {
      const char = secret.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36).padStart(16, '0');
  },

  /**
   * Encrypt a string using XOR with the key
   */
  encrypt(text: string, key: string): string {
    try {
      // In a real app, use a proper encryption algorithm
      // This is a simple XOR encryption for demo purposes
      let result = '';
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        result += String.fromCharCode(charCode);
      }
      // Convert to base64 to ensure safe storage
      return btoa(result);
    } catch (error) {
      console.error('[SecureStorage] Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  },

  /**
   * Decrypt a string using XOR with the key
   */
  decrypt(encryptedText: string, key: string): string {
    try {
      // Convert from base64
      const text = atob(encryptedText);
      // In a real app, use a proper decryption algorithm
      // This is a simple XOR decryption for demo purposes
      let result = '';
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        result += String.fromCharCode(charCode);
      }
      return result;
    } catch (error) {
      console.error('[SecureStorage] Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }
};

interface SecureStorageOptions {
  /**
   * Secret key used for encryption
   * If not provided, a warning will be logged
   */
  secret?: string;
  
  /**
   * Version of the schema for the stored data
   */
  version?: number | string;
  
  /**
   * Namespace to prevent collisions with other apps
   */
  namespace?: string;
  
  /**
   * TTL in milliseconds for cached items
   */
  ttl?: number;
}

/**
 * Secure storage service for sensitive data
 * Encrypts data before storing it in localStorage
 */
export class SecureStorageService {
  private readonly storage: LocalStorageService;
  private readonly encryptionKey: string;
  private readonly isEncryptionEnabled: boolean;

  constructor(options: SecureStorageOptions = {}) {
    const { secret, ...storageOptions } = options;
    
    this.storage = new LocalStorageService({
      ...storageOptions,
      namespace: `${options.namespace || 'app'}_secure`,
    });
    
    this.isEncryptionEnabled = !!secret;
    this.encryptionKey = secret ? crypto.generateKey(secret) : '';
    
    if (!this.isEncryptionEnabled) {
      console.warn(
        '[SecureStorage] No encryption secret provided. ' +
        'Data will be stored without encryption. ' +
        'This is not recommended for sensitive data.'
      );
    }
  }

  /**
   * Get a value from secure storage
   */
  public get<T>(key: string): T | undefined {
    try {
      const encryptedData = this.storage.get<string>(key);
      
      if (encryptedData === undefined) {
        return undefined;
      }
      
      if (!this.isEncryptionEnabled) {
        return JSON.parse(encryptedData) as T;
      }
      
      const decryptedJson = crypto.decrypt(encryptedData, this.encryptionKey);
      return JSON.parse(decryptedJson) as T;
    } catch (error) {
      console.error('[SecureStorage] Error getting item:', error);
      return undefined;
    }
  }

  /**
   * Set a value in secure storage
   */
  public set<T>(key: string, value: T, ttl?: number): void {
    try {
      const jsonValue = JSON.stringify(value);
      
      if (!this.isEncryptionEnabled) {
        this.storage.set(key, jsonValue, ttl);
        return;
      }
      
      const encryptedValue = crypto.encrypt(jsonValue, this.encryptionKey);
      this.storage.set(key, encryptedValue, ttl);
    } catch (error) {
      console.error('[SecureStorage] Error setting item:', error);
    }
  }

  /**
   * Remove an item from secure storage
   */
  public remove(key: string): void {
    this.storage.remove(key);
  }

  /**
   * Check if an item exists in secure storage
   */
  public has(key: string): boolean {
    return this.storage.has(key);
  }

  /**
   * Clear all items from secure storage
   */
  public clear(): void {
    this.storage.clear();
  }

  /**
   * Get all keys in secure storage
   */
  public keys(): string[] {
    return this.storage.keys();
  }

  /**
   * Get remaining time to live for a key
   */
  public getTtl(key: string): number | undefined {
    return this.storage.getTtl(key);
  }

  /**
   * Extend the TTL of an item
   */
  public extendTtl(key: string, ttl: number): boolean {
    return this.storage.extendTtl(key, ttl);
  }

  /**
   * Update an existing item
   */
  public update<T>(key: string, value: T): boolean {
    const existingValue = this.get(key);
    
    if (existingValue === undefined) {
      return false;
    }
    
    try {
      const jsonValue = JSON.stringify(value);
      
      if (!this.isEncryptionEnabled) {
        return this.storage.update(key, jsonValue);
      }
      
      const encryptedValue = crypto.encrypt(jsonValue, this.encryptionKey);
      return this.storage.update(key, encryptedValue);
    } catch (error) {
      console.error('[SecureStorage] Error updating item:', error);
      return false;
    }
  }
}

// Export a singleton instance with default options
// NOTE: In a real app, the secret should be securely managed, 
// possibly retrieved from environment variables or a secure configuration
export const secureStorageService = new SecureStorageService({
  namespace: 'azteam',
  version: 1,
  // In a real app, generate a strong random secret
  secret: process.env.STORAGE_SECRET || 'default-secret-key-change-in-production',
});

// Convenience accessors
export const secureStorage = {
  get: <T>(key: string) => secureStorageService.get<T>(key),
  set: <T>(key: string, value: T, ttl?: number) => secureStorageService.set(key, value, ttl),
  remove: (key: string) => secureStorageService.remove(key),
  clear: () => secureStorageService.clear(),
  has: (key: string) => secureStorageService.has(key),
};