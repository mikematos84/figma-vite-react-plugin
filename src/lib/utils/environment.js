/**
 * Check if code is running in Figma plugin environment
 * @returns {boolean}
 */
export const isFigmaPlugin = () => {
  try {
    // Check for parent and pluginMessage support
    return !!(window.parent && window.parent !== window && 'pluginMessage' in window);
  } catch (e) {
    // If accessing window.parent throws a security error, we're in a cross-origin iframe
    // This is not a Figma plugin
    return false;
  }
};

/**
 * Check if code is running in development mode
 * @returns {boolean}
 */
export const isDevelopment = () => {
  return import.meta.env.DEV;
};

/**
 * Send message to Figma plugin main thread
 * @param {Object} message - Message to send
 * @returns {void}
 */
export const sendToFigma = (message) => {
  if (isFigmaPlugin()) {
    parent.postMessage({ pluginMessage: message }, '*');
  } else {
    console.log('Figma message (development):', message);
  }
};

/**
 * Add a message listener for Figma plugin messages
 * @param {Function} callback - Callback function to handle messages
 * @returns {Function} Cleanup function to remove the listener
 */
export const addFigmaMessageListener = (callback) => {
  const handler = (event) => {
    const message = event.data.pluginMessage;
    if (message) {
      callback(message);
    }
  };

  window.addEventListener('message', handler);
  return () => window.removeEventListener('message', handler);
};
