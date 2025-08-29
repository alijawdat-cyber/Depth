import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx,mdx,css}', './.storybook/**/*.{ts,tsx}'],
  theme: {
    screens: {
      // الأساسية - Mobile-first
      'xs': '360px',     /* Android الشائع */
      'sm': '390px',     /* iPhone 12/13/14 */
      'md': '768px',     /* iPad Portrait */
      'lg': '1024px',    /* لابتوب / iPad Landscape */
      'xl': '1280px',    /* Desktop قياسي */
      '2xl': '1536px',   /* Desktop كبير */
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