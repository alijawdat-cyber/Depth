const config = {
  plugins: [
    'postcss-media-variables', // حل var(--bp-*) داخل media أولاً
    'postcss-custom-media', // بعدها نوسّع @custom-media
    '@tailwindcss/postcss',
  ],
};

export default config;
