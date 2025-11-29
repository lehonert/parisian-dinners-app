
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Optimisations pour le web
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    compress: {
      drop_console: process.env.NODE_ENV === 'production',
    },
  },
};

// Support pour les fichiers web
config.resolver = {
  ...config.resolver,
  sourceExts: [...config.resolver.sourceExts, 'web.tsx', 'web.ts', 'web.jsx', 'web.js'],
  assetExts: [...config.resolver.assetExts.filter((ext) => ext !== 'svg'), 'db'],
};

module.exports = config;
