"use client";
import React from "react";
import { MantineProvider, createTheme, type CSSVariablesResolver } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ThemeProvider, useTheme } from "@/shared/theme";
import { ShellGate } from "./ShellGate";

type Props = { children: React.ReactNode };

// ثيم Mantine مربوط بالتوكنز المركزية (عميل) - الخط من --font-primary في tokens.css
const mantineTheme = createTheme({
  fontFamily: 'var(--font-primary)',
  primaryColor: 'brand',
  defaultRadius: 'md',
  colors: {
    // اللون الأساسي (بنفسجي الهوية)
    brand: [
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
    ],
    // أزرق (نربطه بالـ primary)
    blue: [
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
    ],
    // بنفسجي Mantine (violet) نفس primary للاتساق
    violet: [
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
    ],
    // أخضر نجاح
    green: [
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
    // برتقالي تحذير
    orange: [
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
    // أحمر خطأ
    red: [
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
    // رمادي موحّد للاستخدامات الثانوية/الحدود
    gray: [
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
    Button: {
      defaultProps: { size: 'md' },
      styles: {
        root: {
          '--button-radius': 'var(--radius-md)',
          '--button-bg': 'var(--color-primary)',
          '--button-color': 'var(--color-text-inverse)',
          // ربط خلفية light بالتوكن المركزي للتحكم من tokens.css
          '&[data-variant="light"]': {
            backgroundColor: 'var(--color-bg-tertiary) !important',
            color: 'var(--color-text-primary)',
            borderColor: 'var(--color-border-primary)'
          },
          '&[data-variant="light"][data-color]': {
            backgroundColor: 'var(--color-bg-tertiary) !important'
          },
          '&[data-variant="light"][data-color="brand"], &[data-variant="light"][data-color="blue"], &[data-variant="light"][data-color="violet"]': {
            color: 'var(--color-primary)'
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
    ThemeIcon: {
      styles: {
        root: {
          // ربط خلفية light بالتوكن المركزي
          '&[data-variant="light"]': {
            backgroundColor: 'var(--color-bg-tertiary) !important'
          },
          '&[data-variant="light"][data-color]': {
            backgroundColor: 'var(--color-bg-tertiary) !important'
          },
          // لون الأيقونة حسب النطاق اللوني من التوكنز
          '&[data-variant="light"][data-color="brand"], &[data-variant="light"][data-color="blue"], &[data-variant="light"][data-color="violet"]': {
            color: 'var(--color-primary)'
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
    ActionIcon: {
      styles: {
        root: {
          // ربط خلفية light بالتوكن المركزي
          '&[data-variant="light"]': {
            backgroundColor: 'var(--color-bg-tertiary) !important',
            borderColor: 'var(--color-border-primary)'
          },
          '&[data-variant="light"][data-color]': {
            backgroundColor: 'var(--color-bg-tertiary) !important'
          },
          '&[data-variant="light"][data-color="brand"], &[data-variant="light"][data-color="blue"], &[data-variant="light"][data-color="violet"]': {
            color: 'var(--color-primary)'
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
    Card: {
      defaultProps: { withBorder: true },
      styles: {
        root: {
          backgroundColor: 'var(--color-bg-secondary)',
          borderColor: 'var(--color-border-primary)',
          '--card-radius': 'var(--radius-lg)',
        }
      }
    },
    Container: {
      defaultProps: { size: 'xl' },
      styles: {
        root: {
          padding: 'var(--space-lg)',
        }
      }
    },
    Text: {
      styles: {
        root: {
          // افتراضياً: النصوص العامة تُعتبر سرد/ثانوية إذا لم يحدد لون عبر prop c
          '&:not([c]):not([data-c])': {
            color: 'var(--color-text-secondary)'
          },
          // استثناءات واضحة: نص كبير أو عريض يبقى primary
          '&:not([c]):not([data-c])[size="lg"],&:not([c]):not([data-c])[size="xl"],&:not([c]):not([data-c])[fw="600"],&:not([c]):not([data-c])[fw="700"]': {
            color: 'var(--color-text-primary)'
          },
          // dimmed يبقى ثانوي بقوة
          '&[data-c="dimmed"], &[c="dimmed"]': {
            color: 'var(--color-text-secondary) !important'
          },
        }
      }
    },
    Title: {
      styles: {
        root: {
          // العناوين الرئيسية (صفحات/أقسام)
          '&[data-order="1"], &[order="1"], &[data-order="2"], &[order="2"]': {
            color: 'var(--color-text-primary)'
          },
          // عناوين فرعية/سرد
          '&[data-order="3"], &[order="3"], &[data-order="4"], &[order="4"], &[data-order="5"], &[order="5"], &[data-order="6"], &[order="6"]': {
            color: 'var(--color-text-secondary)'
          }
        }
      }
    },
    Badge: {
      styles: {
        root: {
          '&[data-color="gray"], &[color="gray"]': {
            backgroundColor: 'var(--color-bg-tertiary)',
            color: 'var(--color-text-secondary)',
          },
        }
      }
    }
  },
});

// ربط متغيرات Mantine الداخلية بالتوكنز للفاتح/الداكن (عميل)
const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {},
  light: {
    '--mantine-color-body': 'var(--color-bg-primary)',
    '--mantine-color-text': 'var(--color-text-primary)',
    '--mantine-color-dimmed': 'var(--color-text-secondary)',
  '--mantine-color-anchor': 'var(--color-primary)',
  // فرض خلفية variant=light لكل الألوان من التوكن المركزي
  '--mantine-color-brand-light': 'var(--color-bg-tertiary)',
  '--mantine-color-blue-light': 'var(--color-bg-tertiary)',
  '--mantine-color-violet-light': 'var(--color-bg-tertiary)',
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
  // نفس الشي بالوضع الداكن
  '--mantine-color-brand-light': 'var(--color-bg-tertiary)',
  '--mantine-color-blue-light': 'var(--color-bg-tertiary)',
  '--mantine-color-violet-light': 'var(--color-bg-tertiary)',
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
