import { StorageInterface } from './StorageInterface';
import { isDevelopment } from '../utils/environment';

/**
 * Plugin storage implementation using Figma's clientStorage via message passing
 */
export class PluginStorage extends StorageInterface {
  constructor(prefix = 'app:') {
    super();
    this.prefix = prefix;
    this._pendingRequests = new Map();
    this._setupMessageHandler();
  }

  /**
   * Set up message handler for responses from the plugin main thread
   * @private
   */
  _setupMessageHandler() {
    window.addEventListener('message', (event) => {
      const msg = event.data.pluginMessage;
      if (!msg) return;

      if (isDevelopment()) {
        console.log('PluginStorage received message:', msg);
      }

      switch (msg.type) {
        case 'load-config':
          const loadResolver = this._pendingRequests.get('load-config');
          if (loadResolver) {
            this._pendingRequests.delete('load-config');
            loadResolver({
              githubConfig: msg.githubConfig,
              airtableConfig: msg.airtableConfig,
            });
          }
          break;

        case 'save-success':
          if (isDevelopment()) {
            console.log('Save success received');
          }
          const saveResolver = this._pendingRequests.get('save-config');
          if (saveResolver) {
            this._pendingRequests.delete('save-config');
            saveResolver();
          } else if (isDevelopment()) {
            console.warn('Received save-success but no pending request found');
          }
          break;

        case 'save-error':
          if (isDevelopment()) {
            console.error('Save error received:', msg.message);
          }
          const saveRejector = this._pendingRequests.get('save-config');
          if (saveRejector) {
            this._pendingRequests.delete('save-config');
            saveRejector(new Error(msg.message || 'Failed to save configuration'));
          }
          break;
      }
    });
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
   * Create a promise that will be resolved when the plugin responds
   * @private
   * @param {string} requestType - The type of request
   * @returns {Promise} Promise that will be resolved with the response
   */
  _createRequest(requestType) {
    if (isDevelopment()) {
      console.log(`Creating ${requestType} request`);
    }

    // Clear any existing request of the same type
    if (this._pendingRequests.has(requestType)) {
      if (isDevelopment()) {
        console.warn(`Clearing existing ${requestType} request`);
      }
      this._pendingRequests.delete(requestType);
    }

    return new Promise((resolve, reject) => {
      this._pendingRequests.set(requestType, resolve);

      // Add timeout to prevent hanging
      setTimeout(() => {
        if (this._pendingRequests.has(requestType)) {
          this._pendingRequests.delete(requestType);
          const error = new Error('Request timed out');
          if (isDevelopment()) {
            console.error(`${requestType} request timed out`);
          }
          reject(error);
        }
      }, 5000);
    });
  }

  /**
   * Get a value from storage
   * @param {string} key - The key to get
   * @returns {Promise<any>} The value from storage
   */
  async get(key) {
    const prefixedKey = this._getPrefixedKey(key);

    if (isDevelopment()) {
      console.log('Getting storage value:', { key: prefixedKey });
    }

    // Create the request before sending the message
    const loadPromise = this._createRequest('load-config');

    // Request configuration from main thread
    parent.postMessage(
      {
        pluginMessage: {
          type: 'load-config',
        },
      },
      '*'
    );

    try {
      const configs = await loadPromise;

      if (isDevelopment()) {
        console.log('Received configs:', configs);
      }

      // Return the specific config based on the key
      switch (prefixedKey) {
        case 'app:githubConfig':
          return configs.githubConfig || null;
        case 'app:airtableConfig':
          return configs.airtableConfig || null;
        default:
          return null;
      }
    } catch (error) {
      if (isDevelopment()) {
        console.error('Error getting storage value:', error);
      }
      throw error;
    }
  }

  /**
   * Set a value in storage
   * @param {string} key - The key to set
   * @param {any} value - The value to store
   * @returns {Promise<void>}
   */
  async set(key, value) {
    const prefixedKey = this._getPrefixedKey(key);

    if (isDevelopment()) {
      console.log('Setting storage value:', { key: prefixedKey, value });
    }

    // Determine which config to update
    let message;
    switch (prefixedKey) {
      case 'app:githubConfig':
        message = {
          type: 'save-config',
          githubConfig: value,
          airtableConfig: (await this.get('airtableConfig')) || {},
        };
        break;
      case 'app:airtableConfig':
        message = {
          type: 'save-config',
          airtableConfig: value,
          githubConfig: (await this.get('githubConfig')) || {},
        };
        break;
      default:
        throw new Error('Invalid storage key');
    }

    if (isDevelopment()) {
      console.log('Sending save request:', message);
    }

    // Create the request before sending the message
    const savePromise = this._createRequest('save-config');

    // Send save request to main thread
    parent.postMessage({ pluginMessage: message }, '*');

    // Wait for response
    try {
      await savePromise;
      if (isDevelopment()) {
        console.log('Save completed successfully');
      }
    } catch (error) {
      if (isDevelopment()) {
        console.error('Save failed:', error);
      }
      throw error;
    }
  }

  /**
   * Delete a value from storage
   * @param {string} key - The key to delete
   * @returns {Promise<void>}
   */
  async delete(key) {
    // For this implementation, "deleting" means setting to null/empty
    await this.set(key, null);
  }

  /**
   * Clear all values from storage
   * @returns {Promise<void>}
   */
  async clear() {
    const message = {
      type: 'save-config',
      githubConfig: {},
      airtableConfig: {},
    };

    parent.postMessage({ pluginMessage: message }, '*');
    await this._createRequest('save-config');
  }

  /**
   * Get all keys in storage
   * @returns {Promise<string[]>}
   */
  async keys() {
    // In this implementation, we only have two possible keys
    return ['githubConfig', 'airtableConfig'].map((key) => key.slice(this.prefix.length));
  }

  /**
   * Check if a key exists in storage
   * @param {string} key - The key to check
   * @returns {Promise<boolean>}
   */
  async has(key) {
    const value = await this.get(key);
    return value !== null && value !== undefined;
  }
}
