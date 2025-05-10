export { LocalStorageService, localStorageService, storage } from './localStorage';
export { SecureStorageService, secureStorageService, secureStorage } from './secureStorage';

// Convenience wrapper that combines both storage types
export const appStorage = {
  // Regular localStorage
  standard: storage,
  
  // Secure storage for sensitive data
  secure: secureStorage,
  
  // Clear both storages
  clearAll: () => {
    storage.clear();
    secureStorage.clear();
  }
};