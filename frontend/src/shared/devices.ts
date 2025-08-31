// =============================================
// Device Matrix — مصفوفة الأجهزة القياسية للسناپشوت/المعاينة
// الهدف: توحيد المقاسات عبر أدوات المعاينة والـ Playwright حتى اللقطات ثابتة
// =============================================

export type DevicePreset = {
  id: string;               // معرف الجهاز
  label: string;            // الاسم المقروء
  width: number;            // العرض المنطقي
  height?: number;          // الارتفاع (اختياري للسناپشوت)
  category: 'mobile' | 'tablet' | 'laptop' | 'desktop';
};

export const DEVICE_MATRIX: DevicePreset[] = [
  // iPhone — قياسي وكبير
  { id: 'iphone-14/15/16', label: 'iPhone 393w', width: 393, category: 'mobile' },
  { id: 'iphone-pro-max',   label: 'iPhone 430w', width: 430, category: 'mobile' },

  // Android — شائع
  { id: 'android-compact',  label: 'Android 360w', width: 360, category: 'mobile' },
  { id: 'android-large',    label: 'Android 412w', width: 412, category: 'mobile' },

  // Mobile threshold — مطابق لـ md=640px في Tailwind/tokens
  { id: 'mobile-threshold', label: 'Mobile 640w', width: 640, category: 'mobile' },

  // Tablets
  { id: 'tablet-portrait',  label: 'Tablet 768w', width: 768, category: 'tablet' },
  { id: 'tablet-landscape', label: 'Tablet 1024w', width: 1024, category: 'tablet' },

  // Laptops / Desktop
  { id: 'laptop-13',        label: 'Laptop 1280w', width: 1280, category: 'laptop' },
  { id: 'laptop-15',        label: 'Laptop 1440w', width: 1440, category: 'laptop' },
  { id: 'desktop-fullhd',   label: 'Desktop 1920w', width: 1920, category: 'desktop' },
];

// ملاحظات:
// - نقدر نضيف ارتفاعات مخصصة للـ Playwright screenshots إذا نريد تثبيت التأطير.
// - نفس القائمة ممكن تُستخدم لتعريف Viewports في أي أداة معاينة مستقبلية.
