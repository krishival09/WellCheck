const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Enable require.context for Expo
config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
};

// Map lucide-react to lucide-react-native for native builds
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'lucide-react': path.resolve(__dirname, 'node_modules/lucide-react-native'),
};

module.exports = config;
