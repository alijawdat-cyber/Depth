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
    },
    extend: {
      screens: {
        // إضافية للدقة
        'xs-legacy': '320px',    /* iPhone SE القديم */
        'android-lg': '412px',   /* Pixel devices */
        'iphone-pm': '430px',    /* iPhone 15 Pro Max */
        'tab-compact': '600px',  /* Android Medium start */
        'tab-air': '820px',      /* iPad Air 11" */
        'tab-pro': '834px',      /* iPad Pro 11" */
        'tab-expanded': '840px', /* Android Expanded */
        'fhd': '1920px',         /* Full HD */
        'qhd': '2560px',         /* QHD/1440p */
        '4k': '3840px',          /* 4K UHD */
      }
    }
  },
  plugins: [],
} satisfies Config