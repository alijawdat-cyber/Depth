import type { Preview } from '@storybook/react';
import React from 'react';
import '../src/app/globals.css';
import '../src/styles/storybook.css';
import { DEVICE_MATRIX } from '../src/shared/devices';

// Toolbar عالمي لاختيار الثيم حتى نضبط data-theme داخل Storybook
export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Light/Dark/System theme',
    defaultValue: 'light',
    toolbar: {
      icon: 'contrast',
      items: [
        { value: 'light', title: 'Light' },
        { value: 'dark', title: 'Dark' },
        { value: 'system', title: 'System' },
      ],
      dynamicTitle: true,
    },
  },
} as const;

function applyTheme(mode: 'light'|'dark'|'system'){
  const root = document.documentElement;
  if (mode === 'system') {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    root.setAttribute('data-theme', mode);
  }
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  // خلي الخلفية تتبع التوكنز بدل سويتش Storybook حتى ما يصير تعارض
  backgrounds: { disable: true },
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
  (Story, context) => {
      React.useEffect(() => {
        const mode = (context.globals?.theme as 'light'|'dark'|'system'|undefined) ?? 'light';
        applyTheme(mode);
    // نزامن خلفية/نص الـ <body> مع التوكنز حتى الكانفس يطلع صحيح بالـ Docs
    const root = document.documentElement;
    const styles = getComputedStyle(root);
    const bg = styles.getPropertyValue('--color-bg-surface').trim();
    const fg = styles.getPropertyValue('--color-fg-primary').trim();
    document.body.style.background = bg || '';
    document.body.style.color = fg || '';

        // نطبّق نفس الخلفية/النص على غلاف الـ Docs preview حتى ما يبقى داكن افتراضياً
        const css = `
          .sbdocs-preview, .sbdocs, .sbdocs-wrapper, .sb-show-main, .docs-story {
            background: var(--color-bg-surface) !important;
            color: var(--color-fg-primary) !important;
          }
          .sbdocs-preview .sb-story, .sbdocs-preview .docs-story, .docs-story .sb-story {
            background: var(--color-bg-surface) !important;
          }
        `;
        let tag = document.getElementById('depth-docs-theme') as HTMLStyleElement | null;
        if (!tag) {
          tag = document.createElement('style');
          tag.id = 'depth-docs-theme';
          document.head.appendChild(tag);
        }
        tag.textContent = css;
      }, [context.globals]);
      return (
        <div className="sb-depth-surface" style={{ padding: 'var(--space-6)' }}>
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
