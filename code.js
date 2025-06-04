// Storage keys
const STORAGE_KEYS = {
  GITHUB_CONFIG: 'githubConfig',
  AIRTABLE_CONFIG: 'airtableConfig'
};

figma.showUI(__html__, {
  width: 600,
  height: 600,
  themeColors: true,
  title: 'Figma Vite React Plugin',
  visible: true,
});

// Load initial configuration when the plugin starts
async function loadInitialConfig() {
  try {
    const [githubConfig, airtableConfig] = await Promise.all([
      figma.clientStorage.getAsync(STORAGE_KEYS.GITHUB_CONFIG),
      figma.clientStorage.getAsync(STORAGE_KEYS.AIRTABLE_CONFIG)
    ]);

    // Send the loaded configuration to the UI
    figma.ui.postMessage({
      type: 'load-config',
      githubConfig: githubConfig || {},
      airtableConfig: airtableConfig || {}
    });
  } catch (error) {
    console.error('Error loading configuration:', error);
    // Send empty configuration if there's an error
    figma.ui.postMessage({
      type: 'load-config',
      githubConfig: {},
      airtableConfig: {}
    });
  }
}

// Handle messages from the UI
figma.ui.onmessage = async (msg) => {
  switch (msg.type) {
    case 'save-config':
      try {
        // Save configurations to client storage
        await Promise.all([
          figma.clientStorage.setAsync(STORAGE_KEYS.GITHUB_CONFIG, msg.githubConfig),
          figma.clientStorage.setAsync(STORAGE_KEYS.AIRTABLE_CONFIG, msg.airtableConfig)
        ]);

        // Notify UI of successful save
        figma.ui.postMessage({
          type: 'save-success',
          message: 'Configuration saved successfully'
        });
      } catch (error) {
        console.error('Error saving configuration:', error);
        // Notify UI of save error
        figma.ui.postMessage({
          type: 'save-error',
          message: 'Failed to save configuration'
        });
      }
      break;

    case 'load-config':
      await loadInitialConfig();
      break;

    case 'create-rectangles':
      const nodes = [];
      for (let i = 0; i < msg.count; i++) {
        const rect = figma.createRectangle();
        rect.x = i * 150;
        rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
        figma.currentPage.appendChild(rect);
        nodes.push(rect);
      }
      figma.currentPage.selection = nodes;
      figma.viewport.scrollAndZoomIntoView(nodes);
      break;
  }
};

// Load initial configuration when the plugin starts
loadInitialConfig();
