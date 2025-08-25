import type { Preview } from '@storybook/react';
import React from 'react';
import '../src/app/globals.css';
import { DEVICE_MATRIX } from '../src/shared/devices';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: Object.fromEntries(
        DEVICE_MATRIX.map(d => [d.id, { name: d.label, styles: { width: `${d.width}px`, height: `${d.height ?? 900}px` } }])
      ),
      defaultViewport: 'iphone-14/15/16',
    },
    nextjs: {
      appDirectory: true,
      navigation: { pathname: '/' },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)' }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
