// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const defaultConfig = getDefaultConfig(__dirname);

// Define the extraNodeModules to map Node.js core modules to React Native polyfills
defaultConfig.resolver.extraNodeModules = {
  // Aliases defined in babel.config.js
  crypto: path.resolve(__dirname, "node_modules/react-native-quick-crypto"),
  // Add more modules here if needed
};

// Include any additional resolver configurations if necessary
defaultConfig.resolver.sourceExts.push("cjs"); // Include CommonJS modules if required

// Optional: Define asset extensions if you use any custom asset types
// defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg');

// Configure transformer to handle additional module types if necessary
// For example, enabling inline requires can improve performance
defaultConfig.transformer.enableBabelRCLookup = false;

// Export the modified configuration
module.exports = defaultConfig;
