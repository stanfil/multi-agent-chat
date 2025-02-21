const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// 添加 Realm 支持
config.resolver.sourceExts.push('cjs');

// 配置 resolver
config.resolver = {
  ...config.resolver,
  assetExts: [...config.resolver.assetExts, 'realm'],
  sourceExts: [...config.resolver.sourceExts, 'cjs'],
  resolverMainFields: ['react-native', 'browser', 'main'],
};

module.exports = config; 