import type { Config } from 'tailwindcss'

// Tailwind v4 config — شاشات موحّدة تغطي موبايل/تابلت/لابتوب/ديسكتوب
export default {
  content: ['./src/**/*.{ts,tsx,mdx,css}', './.storybook/**/*.{ts,tsx}'],
  theme: {
    extend: {},
    screens: {
      xs: '360px',  // Android compact
      sm: '390px',  // iPhone قياسي
      md: '768px',  // iPad Portrait
      lg: '1024px', // iPad Landscape / لابتوب صغير
      xl: '1440px', // لابتوب 15"
      '2xl': '1920px', // ديسكتوب كبير
    },
  },
  plugins: [],
} satisfies Config
