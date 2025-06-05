import { BrowserStorage } from './BrowserStorage';
import { PluginStorage } from './PluginStorage';
import { isFigmaPlugin } from '../utils/environment';

/**
 * Get the appropriate storage implementation based on the environment
 * @param {string} [prefix='app:'] - Optional prefix for storage keys
 * @returns {BrowserStorage|PluginStorage} Storage implementation
 */
export function createStorage(prefix = 'app:') {
  return isFigmaPlugin() ? new PluginStorage(prefix) : new BrowserStorage(prefix);
}

/**
 * Default storage instance - automatically uses the correct implementation
 * based on the environment (Figma plugin vs browser)
 *
 * Usage:
 * ```js
 * import { storage } from '../lib/storage';
 *
 * // Store data
 * await storage.set('key', value);
 *
 * // Get data
 * const value = await storage.get('key');
 * ```
 */
export const storage = createStorage();

// Export classes and interfaces for custom usage
export { StorageInterface } from './StorageInterface';
export { BrowserStorage } from './BrowserStorage';
export { PluginStorage } from './PluginStorage';
