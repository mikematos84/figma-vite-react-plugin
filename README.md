# Figma Plugin with React + Vite

This is a template/scaffolding project that demonstrates how to build Figma plugins using React and Vite. It provides a fast and efficient development environment with features like Hot Module Replacement (HMR), ESLint configuration, and proper build setup for Figma plugins.

## Using this Template

This repository serves as a starting point for building your own Figma plugin. To use it properly:

1. **Create your plugin in Figma first**:

   - Open Figma Desktop
   - Go to Plugins > Development > New Plugin
   - Choose "Create a new plugin"
   - Fill in your plugin details
   - Save the manifest file somewhere temporary (you only need the `id` and `name` from it)
   - You can discard the rest of the files Figma creates

2. Fork this repository or use it as a template

3. Update the `manifest.json` in this project with your plugin's information:
   ```json
   {
     "name": "Your Plugin Name",    // Copy from your Figma-generated manifest
     "id": "your-plugin-id",        // Copy from your Figma-generated manifest
     ...
   }
   ```

> **Important**: Always initialize your plugin through Figma first to get a proper plugin ID. This ensures your plugin ID is unique and properly registered in Figma's system. Do not make up your own ID or copy from other plugins.

4. Follow the development instructions below to start building your plugin

## Features

- ⚡️ **Vite** - Lightning fast development with HMR
- ⚛️ **React** - A JavaScript library for building user interfaces
- 🔧 **ESLint** - Linting with auto-fix on save
- 🎨 **Figma Plugin API** - Full access to Figma's plugin API
- 📦 **Build Optimization** - Optimized build process for Figma plugins

## Development

To get started with development:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build the plugin
npm run build
```

## Project Structure

```
figma-plugin-react/
├── src/                # Source files
│   ├── assets/        # Static assets
│   ├── App.jsx        # Main React component
│   └── main.jsx       # React entry point
├── code.js            # Figma plugin main code
├── ui.html            # Plugin UI entry point
├── manifest.json      # Figma plugin manifest
└── vite.config.js     # Vite configuration
```

## Building and Usage

1. Build the plugin using `npm run build`
2. In Figma desktop app:
   - Go to Plugins > Development > Import plugin from manifest
   - Choose the `manifest.json` file from this project

## Contributing

Feel free to submit issues and enhancement requests.

## License

[MIT](LICENSE)
