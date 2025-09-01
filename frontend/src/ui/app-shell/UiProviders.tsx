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
  // أحجام الخط الافتراضية (xs..xl) مربوطة بالتوكنز
  fontSizes: {
    xs: 'var(--fs-xs)',
    sm: 'var(--fs-sm)',
    md: 'var(--fs-md)',
    lg: 'var(--fs-lg)',
    xl: 'var(--fs-xl)'
  },
  // مسافات موحّدة من التوكنز
  spacing: {
    xs: 'var(--space-xs)',
    sm: 'var(--space-sm)',
    md: 'var(--space-md)',
    lg: 'var(--space-lg)',
    xl: 'var(--space-xl)'
  },
  // دوائر الزوايا وفق التوكنز (تعيين xs=sm حتى نبقى ضمن القيم المتاحة)
  radius: {
    xs: 'var(--radius-sm)',
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-lg)'
  },
  // ربط الظلال بقيم التوكنز المركزية
  shadows: {
    xs: 'var(--shadow-sm)',
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
    xl: 'var(--shadow-lg)'
  },
  // ربط عناوين h1..h6 مباشرة بأحجام/أسطر من التوكنز
  headings: {
    fontFamily: 'var(--font-primary)',
    sizes: {
  h1: { fontSize: 'var(--fs-xl)', lineHeight: 'var(--line-height-tight)', fontWeight: 'var(--font-weight-bold)' },
  h2: { fontSize: 'var(--fs-lg)', lineHeight: 'var(--line-height-normal)', fontWeight: 'var(--font-weight-bold)' },
  h3: { fontSize: 'var(--fs-md)', lineHeight: 'var(--line-height-normal)', fontWeight: 'var(--font-weight-medium)' },
      h4: { fontSize: 'var(--fs-md)', lineHeight: 'var(--line-height-normal)', fontWeight: 'var(--font-weight-medium)' },
      h5: { fontSize: 'var(--fs-sm)', lineHeight: 'var(--line-height-normal)', fontWeight: 'var(--font-weight-medium)' },
      h6: { fontSize: 'var(--fs-xs)', lineHeight: 'var(--line-height-tight)', fontWeight: 'var(--font-weight-medium)' }
    }
  },
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
  yellow: [ // أصفر موحّد مرتبط بالتحذير
      'var(--color-warning)', // درجة 0
      'var(--color-warning)', // درجة 1
      'var(--color-warning)', // درجة 2
      'var(--color-warning)', // درجة 3
      'var(--color-warning)', // درجة 4
      'var(--color-warning)', // درجة 5
      'var(--color-warning)', // درجة 6
      'var(--color-warning)', // درجة 7
      'var(--color-warning)', // درجة 8
      'var(--color-warning)'  // درجة 9
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
          '--button-color': 'var(--color-text-inverse)'
        }
      }
    },
    // نقل قواعد variant="light" والألوان للـ CSS overrides
    Badge: { },
    ThemeIcon: { },
    ActionIcon: { },
  Card: {
      defaultProps: { withBorder: true }, // حدود افتراضيًا
      styles: {
        root: {
          backgroundColor: 'var(--color-bg-secondary)',
          borderColor: 'var(--color-border-primary)',
      '--card-radius': 'var(--radius-lg)',
          // نخلي الظل الافتراضي من Mantine (shadow prop)
          // التحكم بظل hover/focus مقفول من overrides/card.css حسب سياسة المشروع
          transition: 'box-shadow .15s ease'
        }
      }
    },
    Container: {
      defaultProps: { size: 'xl' }, // عرض الحاوية
      styles: {
        root: {
          padding: 'var(--space-lg)',
          maxInlineSize: 'var(--container-max-w)',
        }
      }
    },
    // Text و Title مُغطّاة بقواعد CSS في overrides/typography.css
  },
});

const cssVariablesResolver: CSSVariablesResolver = () => ({ // ربط Mantine vars بالتوكنز
  variables: {
  // ربط عائلات الخطوط الخاصة بـ Mantine بخط التوكنز الأساسي
  '--mantine-font-family': 'var(--font-primary)',
  '--mantine-font-family-headings': 'var(--font-primary)',
  // يمكن إضافة monospace عند الحاجة
  // '--mantine-font-family-monospace': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    // أحجام الخطوط العامة
    '--mantine-font-size-xs': 'var(--fs-xs)',
    '--mantine-font-size-sm': 'var(--fs-sm)',
    '--mantine-font-size-md': 'var(--fs-md)',
    '--mantine-font-size-lg': 'var(--fs-lg)',
    '--mantine-font-size-xl': 'var(--fs-xl)',
    // مسافات موحّدة
    '--mantine-spacing-xs': 'var(--space-xs)',
    '--mantine-spacing-sm': 'var(--space-sm)',
    '--mantine-spacing-md': 'var(--space-md)',
    '--mantine-spacing-lg': 'var(--space-lg)',
    '--mantine-spacing-xl': 'var(--space-xl)',
    // أنصاف الأقطار (زوايا)
    '--mantine-radius-xs': 'var(--radius-sm)',
    '--mantine-radius-sm': 'var(--radius-sm)',
    '--mantine-radius-md': 'var(--radius-md)',
    '--mantine-radius-lg': 'var(--radius-lg)',
    '--mantine-radius-xl': 'var(--radius-lg)',
    '--mantine-radius-default': 'var(--radius-md)'
  },
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
