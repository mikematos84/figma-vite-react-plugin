import { StorageInterface } from './StorageInterface';

/**
 * Browser storage implementation using localStorage
 */
export class BrowserStorage extends StorageInterface {
  constructor(prefix = 'app:') {
    super();
    this.prefix = prefix;
  }

  /**
   * Get the prefixed key
   * @private
   * @param {string} key - The original key
   * @returns {string} The prefixed key
   */
  _getPrefixedKey(key) {
    return `${this.prefix}${key}`;
  }

  /**
   * Get a value from storage
   * @param {string} key - The key to get
   * @returns {Promise<any>} The value from storage
   */
  async get(key) {
    const prefixedKey = this._getPrefixedKey(key);
    const value = localStorage.getItem(prefixedKey);
    return value ? JSON.parse(value) : null;
  }

  /**
   * Set a value in storage
   * @param {string} key - The key to set
   * @param {any} value - The value to store
   * @returns {Promise<void>}
   */
  async set(key, value) {
    const prefixedKey = this._getPrefixedKey(key);
    localStorage.setItem(prefixedKey, JSON.stringify(value));
  }

  /**
   * Delete a value from storage
   * @param {string} key - The key to delete
   * @returns {Promise<void>}
   */
  async delete(key) {
    const prefixedKey = this._getPrefixedKey(key);
    localStorage.removeItem(prefixedKey);
  }

  /**
   * Clear all values from storage that match our prefix
   * @returns {Promise<void>}
   */
  async clear() {
    const keys = await this.keys();
    for (const key of keys) {
      await this.delete(key);
    }
  }

  /**
   * Get all keys in storage that match our prefix
   * @returns {Promise<string[]>}
   */
  async keys() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(this.prefix)) {
        keys.push(key.slice(this.prefix.length));
      }
    }
    return keys;
  }

  /**
   * Check if a key exists in storage
   * @param {string} key - The key to check
   * @returns {Promise<boolean>}
   */
  async has(key) {
    const prefixedKey = this._getPrefixedKey(key);
    return localStorage.getItem(prefixedKey) !== null;
  }
}
