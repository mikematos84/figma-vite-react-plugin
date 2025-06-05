import { BrowserStorage } from './BrowserStorage';
import { PluginStorage } from './PluginStorage';
import { isFigmaPlugin, isDevelopment } from '../utils/environment';

/**
 * Get the appropriate storage implementation based on the environment
 * @param {string} [prefix='app:'] - Optional prefix for storage keys
 * @returns {BrowserStorage|PluginStorage} Storage implementation
 */
export function createStorage(prefix = 'app:') {
  const isPlugin = isFigmaPlugin();

  if (isDevelopment()) {
    console.log('Storage Environment:', {
      isFigmaPlugin: isPlugin,
      location: window.location.href,
      isIframe: window.parent !== window,
    });
  }

  const storage = isPlugin ? new PluginStorage(prefix) : new BrowserStorage(prefix);

  if (isDevelopment()) {
    console.log('Using storage implementation:', isPlugin ? 'PluginStorage' : 'BrowserStorage');
  }

  return storage;
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
