/**
 * Secure localStorage wrapper with error handling
 */

export class SecureStorage {
  private static prefix = 'favicongen_';

  /**
   * Safely set an item in localStorage
   */
  static set<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serialized);
      return true;
    } catch (error) {
      console.error('SecureStorage: Failed to save data', error);
      return false;
    }
  }

  /**
   * Safely get an item from localStorage with fallback
   */
  static get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return defaultValue;

      const parsed = JSON.parse(item) as T;
      return parsed;
    } catch (error) {
      console.error('SecureStorage: Failed to retrieve data', error);
      return defaultValue;
    }
  }

  /**
   * Remove an item from localStorage
   */
  static remove(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.error('SecureStorage: Failed to remove data', error);
    }
  }

  /**
   * Clear all app-specific items from localStorage
   */
  static clear(): void {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(this.prefix))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('SecureStorage: Failed to clear data', error);
    }
  }

  /**
   * Check if localStorage is available
   */
  static isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }
}
