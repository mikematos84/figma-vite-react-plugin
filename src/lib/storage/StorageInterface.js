/**
 * Abstract base class defining the storage interface
 * All storage implementations must extend this class
 */
export class StorageInterface {
  /**
   * Get a value from storage
   * @param {string} key - The key to get
   * @returns {Promise<any>} The value from storage
   */
  async get(key) {
    throw new Error('Method not implemented');
  }

  /**
   * Set a value in storage
   * @param {string} key - The key to set
   * @param {any} value - The value to store
   * @returns {Promise<void>}
   */
  async set(key, value) {
    throw new Error('Method not implemented');
  }

  /**
   * Delete a value from storage
   * @param {string} key - The key to delete
   * @returns {Promise<void>}
   */
  async delete(key) {
    throw new Error('Method not implemented');
  }

  /**
   * Clear all values from storage
   * @returns {Promise<void>}
   */
  async clear() {
    throw new Error('Method not implemented');
  }

  /**
   * Get all keys in storage
   * @returns {Promise<string[]>}
   */
  async keys() {
    throw new Error('Method not implemented');
  }

  /**
   * Check if a key exists in storage
   * @param {string} key - The key to check
   * @returns {Promise<boolean>}
   */
  async has(key) {
    throw new Error('Method not implemented');
  }
}
