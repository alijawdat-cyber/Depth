# 🎨 نظام التصميم (Design System) - منصة Depth

> Status: Skeleton — فلسفة التصميم والأسس المرئية الأساسية

## 🧠 فلسفة التصميم

### المبادئ الأساسية
1. **البساطة أولاً** - التصميم النظيف والوضوح في التواصل البصري
2. **الثقافة المحلية** - احترام التوقعات المحلية مع الحداثة العالمية
3. **إمكانية الوصول** - تصميم شامل يخدم جميع المستخدمين
4. **التنوع الوظيفي** - مرونة النظام لخدمة أدوار متعددة

### القيم البصرية
- **الاحترافية**: ألوان هادئة ومتوازنة، خطوط واضحة
- **الودية**: زوايا ناعمة، مسافات مريحة للعين
- **الثقة**: اتساق في العناصر، تسلسل هرمي واضح
- **الكفاءة**: تنظيم معلومات محسّن لسرعة الإنجاز

## 🏗️ الشبكة والتخطيط (Grid System)

### نظام الشبكة
```css
/* Mobile First Grid */
.container {
  max-width: 100%;
  padding: 0 16px; /* space-4 */
}

/* Tablet: 768px+ */
.container {
  max-width: 768px;
  padding: 0 24px; /* space-6 */
}

/* Desktop: 1024px+ */
.container {
  max-width: 1024px;
  padding: 0 32px; /* space-8 */
}

/* Wide: 1400px+ */
.container {
  max-width: 1200px;
  margin: 0 auto;
}
```

### نظام الأعمدة
- **Mobile**: 4 أعمدة مع هامش 16px
- **Tablet**: 8 أعمدة مع هامش 24px  
- **Desktop**: 12 عمود مع هامش 32px

## 🎨 الألوان (Color Palette)

### الألوان الأساسية (Brand Colors)
```css
:root {
  /* Primary Brand */
  --primary-50: #F4F3FF;
  --primary-100: #EBE9FE; 
  --primary-200: #D8D6FD;
  --primary-300: #BDB8FB;
  --primary-400: #9E95F8;
  --primary-500: #6C2BFF; /* المرجع الأساسي */
  --primary-600: #4A1FC9;
  --primary-700: #3B1A9E;
  --primary-800: #2D1373;
  --primary-900: #1F0D4A;
  
  /* Alternate Brand */
  --alternate-500: #3E5BFF; /* اللون البديل */
}
```

### الألوان الوظيفية (Semantic Colors)
```css
:root {
  /* Success */
  --success-50: #ECFDF5;
  --success-500: #10B981;
  --success-900: #064E3B;
  
  /* Warning */
  --warning-50: #FFFBEB;
  --warning-500: #F59E0B;
  --warning-900: #78350F;
  
  /* Error */
  --error-50: #FEF2F2;
  --error-500: #EF4444;
  --error-900: #7F1D1D;
}
```

### الألوان المحايدة (Neutral Colors)
```css
:root {
  /* Light Theme */
  --neutral-0: #FFFFFF;
  --neutral-50: #F9FAFB;
  --neutral-100: #F3F4F6;
  --neutral-200: #E5E7EB;
  --neutral-300: #D1D5DB;
  --neutral-400: #9CA3AF;
  --neutral-500: #6B7280;
  --neutral-600: #4B5563;
  --neutral-700: #374151;
  --neutral-800: #1F2937;
  --neutral-900: #111827;
}
```

## ✍️ التايبوغرافي (Typography)

### مجموعات الخطوط
```css
:root {
  /* Arabic Typography */
  --font-ar: 'Dubai', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif;
  --font-ar-weight-regular: 400;
  --font-ar-weight-medium: 500;
  --font-ar-weight-bold: 700;
  
  /* English Typography */
  --font-en: 'Inter', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif;
  --font-en-weight-regular: 400;
  --font-en-weight-medium: 500;
  --font-en-weight-semibold: 600;
  --font-en-weight-bold: 700;
  
  /* Monospace */
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
}
```

### تسلسل النصوص الهرمي
```css
/* Headings */
.text-h1 { font-size: 48px; line-height: 1.2; font-weight: 700; } /* Desktop */
.text-h1-mobile { font-size: 32px; line-height: 1.3; font-weight: 700; }

.text-h2 { font-size: 40px; line-height: 1.25; font-weight: 600; }
.text-h2-mobile { font-size: 28px; line-height: 1.3; font-weight: 600; }

.text-h3 { font-size: 32px; line-height: 1.3; font-weight: 600; }
.text-h3-mobile { font-size: 24px; line-height: 1.4; font-weight: 600; }

.text-h4 { font-size: 24px; line-height: 1.4; font-weight: 600; }
.text-h4-mobile { font-size: 20px; line-height: 1.4; font-weight: 600; }

/* Body Text */
.text-body-lg { font-size: 18px; line-height: 1.6; font-weight: 400; }
.text-body { font-size: 16px; line-height: 1.6; font-weight: 400; }
.text-body-sm { font-size: 14px; line-height: 1.5; font-weight: 400; }
.text-body-xs { font-size: 12px; line-height: 1.4; font-weight: 400; }

/* Labels & UI */
.text-label-lg { font-size: 16px; line-height: 1.5; font-weight: 500; }
.text-label { font-size: 14px; line-height: 1.4; font-weight: 500; }
.text-label-sm { font-size: 12px; line-height: 1.3; font-weight: 500; }
```

## 🌓 الأوضاع (Light/Dark Themes)

### Light Theme (الوضع النهاري)
```css
[data-theme="light"] {
  --bg-primary: var(--neutral-0);
  --bg-secondary: var(--neutral-50);
  --bg-tertiary: var(--neutral-100);
  
  --text-primary: var(--neutral-900);
  --text-secondary: var(--neutral-600);
  --text-tertiary: var(--neutral-500);
  
  --border-primary: var(--neutral-200);
  --border-secondary: var(--neutral-100);
}
```

### Dark Theme (الوضع الليلي)
```css
[data-theme="dark"] {
  --bg-primary: #0A0B0D;
  --bg-secondary: #1A1B1E;
  --bg-tertiary: #2A2B2E;
  
  --text-primary: var(--neutral-0);
  --text-secondary: var(--neutral-300);
  --text-tertiary: var(--neutral-400);
  
  --border-primary: var(--neutral-700);
  --border-secondary: var(--neutral-800);
}
```

## 🎭 حالات التفاعل (Interactive States)

### حالات الأزرار والروابط
```css
/* Default Button States */
.btn {
  transition: all 0.2s ease-in-out;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--elevation-2);
}

.btn:active {
  transform: translateY(0);
}

.btn:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

### حالات الحقول (Form Fields)
```css
.form-field {
  transition: border-color 0.2s ease-in-out;
}

.form-field:focus {
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(108, 43, 255, 0.1);
}

.form-field.error {
  border-color: var(--error-500);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-field.success {
  border-color: var(--success-500);
}
```

## 🌍 دعم الاتجاهات (RTL/LTR Support)

### منطق الاتجاه
```css
/* RTL Support */
[dir="rtl"] .icon-chevron-right {
  transform: scaleX(-1);
}

[dir="rtl"] .text-align-start {
  text-align: right;
}

[dir="ltr"] .text-align-start {
  text-align: left;
}

/* Logical Properties */
.margin-inline-start {
  margin-inline-start: var(--space-4);
}

.padding-inline {
  padding-inline: var(--space-6);
}
```

## 📐 المسافات والأحجام (Spacing & Sizing)

### نظام المسافات
```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
}
```

### الزوايا والانحناءات
```css
:root {
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --radius-full: 9999px;
}
```

## 🌊 الظلال والارتفاعات (Elevation)

```css
:root {
  --elevation-1: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  --elevation-2: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06);
  --elevation-3: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
  --elevation-4: 0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04);
}

/* Dark Theme Elevations */
[data-theme="dark"] {
  --elevation-1: 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
  --elevation-2: 0 4px 6px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2);
  --elevation-3: 0 10px 15px rgba(0, 0, 0, 0.4), 0 4px 6px rgba(0, 0, 0, 0.2);
  --elevation-4: 0 20px 25px rgba(0, 0, 0, 0.4), 0 10px 10px rgba(0, 0, 0, 0.15);
}
```

## 🎬 الحركات والانتقالات (Animations)

### مدد الانتقالات
```css
:root {
  --duration-fast: 0.15s;
  --duration-normal: 0.2s;
  --duration-slow: 0.3s;
  --duration-slower: 0.5s;
}
```

### منحنيات التسهيل
```css
:root {
  --ease-out: cubic-bezier(0.0, 0.0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0.0, 1, 1);
  --ease-in-out: cubic-bezier(0.4, 0.0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

---

> SSOT — مصدر الحقيقة الوحيد: الألوان والخطوط مستمدة من depth-site/docs/brand-identity/Depth‑Brand‑Identity/02-Color-Palettes-Spec.html

*آخر تحديث: 2025-08-23*
