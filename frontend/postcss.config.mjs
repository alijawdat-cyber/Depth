const config = {
  plugins: {
    'postcss-custom-media': {}, // توسعة @custom-media إلى شروط media عادية
    'postcss-media-variables': {}, // حل var(--bp-*) داخل media
    '@tailwindcss/postcss': {},
  },
};

export default config;
