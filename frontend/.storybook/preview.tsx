import type { Preview } from '@storybook/react';
import React from 'react';
import '../src/app/globals.css';
import '../src/styles/storybook.css';
import { DEVICE_MATRIX } from '../src/shared/devices';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

// إعدادات الثيم العالمية
export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Light/Dark theme',
    defaultValue: 'light',
    toolbar: {
      icon: 'contrast',
      items: [
        { value: 'light', title: 'Light' },
        { value: 'dark', title: 'Dark' },
      ],
      dynamicTitle: true,
    },
  },
  previewMode: {
    name: 'Preview',
    description: 'Preview layout mode',
    defaultValue: 'centered',
    toolbar: {
      icon: 'grow',
      items: [
        { value: 'auto', title: 'Auto' },
        { value: 'centered', title: 'Centered' },
        { value: 'fullscreen', title: 'Fullscreen' },
        { value: 'wide', title: 'Wide' },
      ],
      dynamicTitle: true,
    },
  },
} as const;

// تطبيق الثيم على الجذر
function applyTheme(mode: 'light' | 'dark') {
  const root = document.documentElement;
  root.setAttribute('data-theme', mode);
  root.style.colorScheme = mode;
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'padded',
    backgrounds: { disable: true }, // نعتمد على التوكنز بدلاً من خلفيات Storybook
    viewport: {
      viewports: Object.fromEntries(
        DEVICE_MATRIX.map(d => [d.id, { name: d.label, styles: { width: `${d.width}px`, height: `${d.height ?? 900}px` } }])
      ),
      defaultViewport: 'responsive',
    },
    nextjs: {
      appDirectory: true,
      navigation: { pathname: '/' },
    },
  },
  decorators: [
    (Story, context) => {
      React.useEffect(() => {
        const mode = (context.globals?.theme as 'light' | 'dark' | undefined) ?? 'light';
        applyTheme(mode);

        // تطبيق ألوان التوكنز على body
        const styles = getComputedStyle(document.documentElement);
        const bgSurface = styles.getPropertyValue('--color-bg-surface').trim();
        const fgPrimary = styles.getPropertyValue('--color-fg-primary').trim();
        
        if (bgSurface && fgPrimary) {
          document.body.style.backgroundColor = bgSurface;
          document.body.style.color = fgPrimary;
        }

        // CSS بسيط لتحسين Docs
        const css = `
          /* خلفية ونص Docs */
          .sbdocs, .sbdocs-wrapper, .sbdocs-content {
            background-color: var(--color-bg-surface) !important;
            color: var(--color-fg-primary) !important;
          }

          /* تمركز أمثلة المكونات */
          .sbdocs-preview .sb-story, .docs-story .sb-story {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            min-height: 200px;
            padding: var(--space-6);
          }

          /* جداول الخصائص */
          .sbdocs .docblock-argstable {
            background: var(--color-bg-surface) !important;
            color: var(--color-fg-primary) !important;
            border: 1px solid var(--color-bd-default) !important;
          }

          .sbdocs .docblock-argstable td,
          .sbdocs .docblock-argstable th {
            background: var(--color-bg-surface) !important;
            color: var(--color-fg-primary) !important;
            border-color: var(--color-bd-default) !important;
          }

          /* Controls RTL */
          .sbdocs .docblock-argstable input,
          .sbdocs .docblock-argstable select {
            direction: rtl !important;
            text-align: right !important;
            background: var(--color-bg-elevated) !important;
            color: var(--color-fg-primary) !important;
            border: 1px solid var(--color-bd-default) !important;
          }
        `;

        let styleTag = document.getElementById('depth-theme') as HTMLStyleElement | null;
        if (!styleTag) {
          styleTag = document.createElement('style');
          styleTag.id = 'depth-theme';
          document.head.appendChild(styleTag);
        }
        styleTag.textContent = css;
      }, [context.globals]);

      const previewMode = (context.globals?.previewMode as 'auto' | 'centered' | 'fullscreen' | 'wide' | undefined) ?? 'centered';
      const themeMode = (context.globals?.theme as 'light' | 'dark' | undefined) ?? 'light';

      // غلاف المكونات
      const Frame: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ children, className, style }) => (
        <MantineProvider forceColorScheme={themeMode}>
          <div dir="rtl" className={`sb-depth-surface ${className ?? ''}`} style={style}>
            {children}
          </div>
        </MantineProvider>
      );

      // أوضاع العرض
      if (context.viewMode === 'docs') {
        return (
          <Frame style={{ padding: 'var(--space-4)' }}>
            <Story />
          </Frame>
        );
      }

      switch (previewMode) {
        case 'centered':
          return (
            <Frame className="sb-center" style={{ padding: 'var(--space-6)' }}>
              <Story />
            </Frame>
          );
        case 'fullscreen':
          return (
            <Frame className="sb-fullscreen">
              <Story />
            </Frame>
          );
        case 'wide':
          return (
            <Frame className="sb-wide" style={{ padding: 'var(--space-6)' }}>
              <Story />
            </Frame>
          );
        default: // auto
          return (
            <Frame className="sb-auto" style={{ padding: 'var(--space-4)' }}>
              <Story />
            </Frame>
          );
      }
    },
  ],
};

export default preview;