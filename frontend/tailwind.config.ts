import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx,mdx,css}', './.storybook/**/*.{ts,tsx}'],
  theme: {
    screens: {
      // الأساسية - Mobile-first - موحدة مع tokens.css
      'xs': '360px',     /* Android الشائع */
      'sm': '430px',     /* iPhone 12/13/14/15 Pro Max */
  'md': '640px',     /* حد الموبايل الحقيقي - موحد مع --bp-mobile */
  'lg': '768px',     /* iPad Portrait - موحد مع --bp-tablet */
  'xl': '1024px',    /* لابتوب / iPad Landscape - موحد مع --bp-desktop */
      '2xl': '1280px',   /* Desktop قياسي */
  // Aliases واضحة بالأسماء لسهولة القراءة والاستخدام
  'mobile': '640px',   /* == md */
  'tablet': '768px',   /* == lg */
  'desktop': '1024px', /* == xl */
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-primary)']
      },
      fontSize: {
        xs: 'var(--fs-xs)',
        sm: 'var(--fs-sm)',
        base: 'var(--fs-md)',
        lg: 'var(--fs-lg)',
        xl: 'var(--fs-xl)'
      },
      colors: {
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          inverse: 'var(--color-text-inverse)'
        },
        brand: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          light: 'var(--color-primary-light)'
        },
        bg: {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          tertiary: 'var(--color-bg-tertiary)'
        },
        border: {
          primary: 'var(--color-border-primary)',
          secondary: 'var(--color-border-secondary)'
        },
        state: {
          success: 'var(--color-success)',
          warning: 'var(--color-warning)',
          error: 'var(--color-error)',
          info: 'var(--color-info)'
        }
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)'
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        full: 'var(--radius-full)'
      }
    }
  },
  plugins: [],
} satisfies Config