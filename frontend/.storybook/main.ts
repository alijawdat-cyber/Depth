/// <reference types="node" />
import path from 'path';

const config = {
  stories: [
    '../src/components/**/*.mdx',
    '../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],

  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links'
  ],

  framework: {
    name: '@storybook/nextjs',
    options: {
      builder: {
        useSWC: true,
      }
    }
  },

  staticDirs: ['../public'],

  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript'
  },

  webpackFinal: async (config) => {
    config!.resolve = config!.resolve || {};
    config!.resolve.alias = {
      ...(config!.resolve.alias || {}),
      '@': path.resolve(__dirname, '../src'),
      '@/components': path.resolve(__dirname, '../src/components'),
      '@/lib': path.resolve(__dirname, '../src/lib'),
      '@/styles': path.resolve(__dirname, '../src/styles'),
    };
    return config;
  },

  docs: {
    autodocs: 'tag'
  }
};

export default config;
