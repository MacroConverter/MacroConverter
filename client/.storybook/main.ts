// .storybook/main.ts

// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/react-webpack5';
const config: StorybookConfig = {
  // Required
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  // Optional
  addons: ['@storybook/addon-essentials', '@storybook/addon-storysource', '@storybook/addon-links', '@storybook/preset-create-react-app', '@storybook/addon-interactions', '@storybook/addon-mdx-gfm'],
  docs: {
    autodocs: 'tag'
  },
  staticDirs: ['../public']
};
export default config;