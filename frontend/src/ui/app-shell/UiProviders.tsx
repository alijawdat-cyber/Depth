"use client"; // مكوّن عميل
import React from "react"; // React
import { MantineProvider, createTheme, type CSSVariablesResolver } from "@mantine/core"; // Mantine
import { Notifications } from "@mantine/notifications"; // إشعارات
import { ThemeProvider, useTheme } from "@/shared/theme"; // ثيم محلي
import { ShellGate } from "./ShellGate"; // غلاف الشيل

type Props = { children: React.ReactNode }; // خصائص المزود

const brandScale = [ // سُلّم ألوان brand من التوكنز (Mantine يتطلب 10 درجات)
  'var(--color-primary-light)',
  'var(--color-primary-light)',
  'var(--color-primary-light)',
  'var(--color-primary)',
  'var(--color-primary)',
  'var(--color-primary)',
  'var(--color-primary)',
  'var(--color-primary-hover)',
  'var(--color-primary-hover)',
  'var(--color-primary-hover)'
 ] as const;

const infoScale = [
  'var(--color-info)',
  'var(--color-info)',
  'var(--color-info)',
  'var(--color-info)',
  'var(--color-info)',
  'var(--color-info)',
  'var(--color-info)',
  'var(--color-info)',
  'var(--color-info)',
  'var(--color-info)'
 ] as const;

const mantineTheme = createTheme({
  fontFamily: 'var(--font-primary)', // خط من التوكنز
  primaryColor: 'brand', // اللون الأساسي
  defaultRadius: 'md', // نصف قطر افتراضي
  colors: {
  brand: brandScale, // أساسي
  blue: infoScale, // معلوماتي
  green: [ // ثبات عبر الدرجات من نفس التوكن
      'var(--color-success)',
      'var(--color-success)',
      'var(--color-success)',
      'var(--color-success)',
      'var(--color-success)',
      'var(--color-success)',
      'var(--color-success)',
      'var(--color-success)',
      'var(--color-success)',
      'var(--color-success)'
    ],
  orange: [ // تحذير
      'var(--color-warning)',
      'var(--color-warning)',
      'var(--color-warning)',
      'var(--color-warning)',
      'var(--color-warning)',
      'var(--color-warning)',
      'var(--color-warning)',
      'var(--color-warning)',
      'var(--color-warning)',
      'var(--color-warning)'
    ],
  red: [ // خطأ
      'var(--color-error)',
      'var(--color-error)',
      'var(--color-error)',
      'var(--color-error)',
      'var(--color-error)',
      'var(--color-error)',
      'var(--color-error)',
      'var(--color-error)',
      'var(--color-error)',
      'var(--color-error)'
    ],
  gray: [ // رمادي للاستخدامات الثانوية/الحدود
      'var(--color-bg-tertiary)',
      'var(--color-bg-tertiary)',
      'var(--color-bg-secondary)',
      'var(--color-border-secondary)',
      'var(--color-border-primary)',
      'var(--color-text-secondary)',
      'var(--color-text-secondary)',
      'var(--color-text-primary)',
      'var(--color-text-primary)',
      'var(--color-text-primary)'
    ],
  },
  components: {
    Notifications: {
      styles: {
        root: {
      zIndex: 'var(--z-notification)' // طبقة الإشعارات
        }
      }
    },
    Modal: {
      styles: {
        content: {
      zIndex: 'var(--z-modal)' // طبقة المودال
        }
      }
    },
    Button: {
      defaultProps: { size: 'md' }, // حجم افتراضي
      styles: {
        root: {
          '--button-radius': 'var(--radius-md)',
          '--button-bg': 'var(--color-primary)',
          '--button-color': 'var(--color-text-inverse)',
          '&[data-variant="light"]': { // خلفية light من التوكنز
            backgroundColor: 'var(--color-bg-tertiary) !important',
            color: 'var(--color-text-primary)',
            borderColor: 'var(--color-border-primary)'
          },
          '&[data-variant="light"][data-color]': {
            backgroundColor: 'var(--color-bg-tertiary) !important'
          },
          '&[data-variant="light"][data-color="brand"]': {
            color: 'var(--color-primary)'
          },
          '&[data-variant="light"][data-color="blue"]': {
            color: 'var(--color-info)'
          },
          '&[data-variant="light"][data-color="green"]': {
            color: 'var(--color-success)'
          },
          '&[data-variant="light"][data-color="orange"], &[data-variant="light"][data-color="yellow"]': {
            color: 'var(--color-warning)'
          },
          '&[data-variant="light"][data-color="red"]': {
            color: 'var(--color-error)'
          },
          '&[data-variant="light"][data-color="gray"]': {
            color: 'var(--color-text-secondary)'
          }
        }
      }
    },
  Badge: { styles: { root: { '&[data-color="gray"], &[color="gray"]': { backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' } } } }, // شارة رمادية
  ThemeIcon: { styles: { root: { '&[data-variant="light"]': { backgroundColor: 'var(--color-bg-tertiary) !important' }, '&[data-variant="light"][data-color]': { backgroundColor: 'var(--color-bg-tertiary) !important' }, '&[data-variant="light"][data-color="brand"]': { color: 'var(--color-primary)' }, '&[data-variant="light"][data-color="blue"]': { color: 'var(--color-info)' }, '&[data-variant="light"][data-color="green"]': { color: 'var(--color-success)' }, '&[data-variant="light"][data-color="orange"], &[data-variant="light"][data-color="yellow"]': { color: 'var(--color-warning)' }, '&[data-variant="light"][data-color="red"]': { color: 'var(--color-error)' }, '&[data-variant="light"][data-color="gray"]': { color: 'var(--color-text-secondary)' } } } }, // light ties to tokens
  ActionIcon: { styles: { root: { '&[data-variant="light"]': { backgroundColor: 'var(--color-bg-tertiary) !important', borderColor: 'var(--color-border-primary)' }, '&[data-variant="light"][data-color]': { backgroundColor: 'var(--color-bg-tertiary) !important' }, '&[data-variant="light"][data-color="brand"]': { color: 'var(--color-primary)' }, '&[data-variant="light"][data-color="blue"]': { color: 'var(--color-info)' }, '&[data-variant="light"][data-color="green"]': { color: 'var(--color-success)' }, '&[data-variant="light"][data-color="orange"], &[data-variant="light"][data-color="yellow"]': { color: 'var(--color-warning)' }, '&[data-variant="light"][data-color="red"]': { color: 'var(--color-error)' }, '&[data-variant="light"][data-color="gray"]': { color: 'var(--color-text-secondary)' } } } }, // light ties + borders
    Card: {
      defaultProps: { withBorder: true }, // حدود افتراضيًا
      styles: {
        root: {
          backgroundColor: 'var(--color-bg-secondary)',
          borderColor: 'var(--color-border-primary)',
          '--card-radius': 'var(--radius-lg)',
        }
      }
    },
    Container: {
      defaultProps: { size: 'xl' }, // عرض الحاوية
      styles: {
        root: {
          padding: 'var(--space-lg)',
        }
      }
    },
    Text: {
      styles: {
        root: {
          '&:not([c]):not([data-c])': { color: 'var(--color-text-secondary)' }, // نص ثانوي افتراضي
          '&:not([c]):not([data-c])[size="lg"],&:not([c]):not([data-c])[size="xl"],&:not([c]):not([data-c])[fw="600"],&:not([c]):not([data-c])[fw="700"]': { color: 'var(--color-text-primary)' },
          '&[data-c="dimmed"], &[c="dimmed"]': { color: 'var(--color-text-secondary) !important' } // dimmed ثابت
        }
      }
    },
    Title: {
      styles: {
        root: {
          '&[data-order="1"], &[order="1"], &[data-order="2"], &[order="2"]': {
            color: 'var(--color-text-primary)'
          },
          '&[data-order="3"], &[order="3"], &[data-order="4"], &[order="4"], &[data-order="5"], &[order="5"], &[data-order="6"], &[order="6"]': { color: 'var(--color-text-secondary)' }
        }
      }
    },
  },
});

const cssVariablesResolver: CSSVariablesResolver = () => ({ // ربط Mantine vars بالتوكنز
  variables: {},
  light: {
    '--mantine-color-body': 'var(--color-bg-primary)',
    '--mantine-color-text': 'var(--color-text-primary)',
    '--mantine-color-dimmed': 'var(--color-text-secondary)',
  '--mantine-color-anchor': 'var(--color-primary)',
  '--mantine-color-gray-7': 'var(--color-text-secondary)',
  '--mantine-color-gray-6': 'var(--color-border-primary)',
  // فرض خلفية variant=light لكل الألوان من التوكن المركزي
  '--mantine-color-brand-light': 'var(--color-bg-tertiary)',
  '--mantine-color-blue-light': 'var(--color-bg-tertiary)',
  // '--mantine-color-violet-light': 'var(--color-bg-tertiary)',
  '--mantine-color-green-light': 'var(--color-bg-tertiary)',
  '--mantine-color-orange-light': 'var(--color-bg-tertiary)',
  '--mantine-color-yellow-light': 'var(--color-bg-tertiary)',
  '--mantine-color-red-light': 'var(--color-bg-tertiary)',
  '--mantine-color-gray-light': 'var(--color-bg-tertiary)'
  },
  dark: {
    '--mantine-color-body': 'var(--color-bg-primary)',
    '--mantine-color-text': 'var(--color-text-primary)',
    '--mantine-color-dimmed': 'var(--color-text-secondary)',
  '--mantine-color-anchor': 'var(--color-primary)',
  '--mantine-color-gray-7': 'var(--color-text-secondary)',
  '--mantine-color-gray-6': 'var(--color-border-primary)',
  // نفس الشي بالوضع الداكن
  '--mantine-color-brand-light': 'var(--color-bg-tertiary)',
  '--mantine-color-blue-light': 'var(--color-bg-tertiary)',
  // '--mantine-color-violet-light': 'var(--color-bg-tertiary)',
  '--mantine-color-green-light': 'var(--color-bg-tertiary)',
  '--mantine-color-orange-light': 'var(--color-bg-tertiary)',
  '--mantine-color-yellow-light': 'var(--color-bg-tertiary)',
  '--mantine-color-red-light': 'var(--color-bg-tertiary)',
  '--mantine-color-gray-light': 'var(--color-bg-tertiary)'
  }
});

function MantineBridge({ children }: Props){
  const { theme } = useTheme();
  const colorScheme = theme === 'system' ? 'auto' : theme; // 'light' | 'dark' | 'auto'
  return (
    <MantineProvider theme={mantineTheme} defaultColorScheme={colorScheme} cssVariablesResolver={cssVariablesResolver}>
      <Notifications position="top-left" />
      <ShellGate>{children}</ShellGate>
    </MantineProvider>
  );
}

export function UiProviders({ children }: Props){
  return (
    <ThemeProvider defaultTheme="system">
      <MantineBridge>{children}</MantineBridge>
    </ThemeProvider>
  );
}
