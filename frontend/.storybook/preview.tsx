import type { Preview } from "@storybook/react";
import React from "react";
import '../src/app/globals.css';
import { DEVICE_MATRIX } from '../src/shared/devices';

const viewports = Object.fromEntries(
  DEVICE_MATRIX.map(d => [
    d.id,
    {
      name: d.label,
      styles: { width: `${d.width}px`, height: d.height ? `${d.height}px` : '100%' },
      type: d.category,
    }
  ])
);

const preview: Preview = {
  parameters: {
    viewport: { viewports },
    options: { storySort: { order: ['Tokens', 'Primitives', 'Components', 'Screens'] } },
  },
  decorators: [
    (Story) => {
      return (
        <html lang="ar" dir="rtl" data-theme="light">
          <body>
            <div dir="rtl">
              <Story />
            </div>
          </body>
        </html>
      );
    }
  ],
};

export default preview;
