# 🧩 مكتبة المكونات (Component Library) - منصة Depth

> Status: Skeleton — قائمة شاملة للمكونات مع مربعات تحقق لكل مكوّن

## � قرار المكتبة الموحدة (Final Decision)

- المكتبة الرسمية لكل المكوّنات الموحدة: `@mantine/core` + `@mantine/hooks`.
- الأسباب باختصار:
  - RTL مضبوط وجاهز، مناسب للواجهة العربية.
  - SSR مستقر مع Next.js، ووصوليّة a11y افتراضيًا جيدة.
  - تغطية مكوّنات واسعة (Forms, Modal/Drawer, Date/Time, Notifications, Tabs…).
  - ثيم بـ CSS vars ينربط بسهولة ويا التوكنز الحالية (`tokens.css`/`semantic-tokens.css`).
- بدائل مسموحة فقط حسب الحاجة:
  - `@mui/material` لسيناريوهات Enterprise خاصّة (مثل DataGrid ثقيل) ضمن نطاق شاشة/ميزة محددة.
  - بقاء `@radix-ui/*` مؤقّتًا كـ primitives للحالات الخاصة أثناء الانتقال فقط.

### سياسة التبنّي والتنفيذ
- البدء بتحويل زر `Button` فقط إلى `@mantine/core` مع Adapter داخلي يحافظ على API الحالي (variant/size/disabled…)
- تفعيل `MantineProvider` على مستوى التطبيق وStorybook، وربط الألوان والمسافات مع متغيراتنا:
  - استخدام `dir="rtl"` افتراضيًا.
  - ربط الألوان إلى `--color-…` من `semantic-tokens.css`.
- بعد تثبيت الزر، ننتقل لمكونات النماذج والـ Overlay تدريجيًا، بعدها تنظيف أي اعتماد قديم لا حاجة له.

### سياسة الحذف
- عدم اعتماد مكتبات UI أخرى (مثل `@nextui-org/react` أو shadcn) للمكونات الموحدة.
- الإبقاء على `@radix-ui/*` فقط إذا أكو مكوّن لسه ما تحوّل (مرحلة انتقالية)، ثم يُحذف بعد اكتمال الهجرة.

### أوامر التثبيت المعيارية (للتنفيذ عند بدء الهجرة)
- تثبيت:
  - `npm install @mantine/core @mantine/hooks`
- إبقاء/إزالة:
  - إبقاء `@radix-ui/*` مؤقتًا لحين استبدال نظائرها.
  - لا يتم إضافة UI libraries أخرى بدون مبرر واضح.


## �📋 نظرة عامة

هذه الوثيقة تحدد جميع مكونات الواجهة الأمامية المطلوبة لمنصة Depth. كل مكون يتضمن حالاته المختلفة، الدعائم (Props)، وأمثلة الاستخدام.

## 🎯 معايير المكونات

### معايير القبول لكل مكون
- ✅ دعم الأوضاع Light/Dark
- ✅ دعم RTL/LTR
- ✅ إمكانية الوصول (WCAG 2.1 AA)
- ✅ حالات تفاعلية (Hover, Focus, Active, Disabled)
- ✅ اختبارات وحدة
- ✅ توثيق Storybook

## 🧱 المكونات الأساسية (Basic Components)

### [ ] Buttons (الأزرار)
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: ReactNode;
  onClick?: () => void;
}
```

**الحالات المطلوبة:**
- [ ] Primary Button
- [ ] Secondary Button  
- [ ] Outline Button
- [ ] Ghost Button
- [ ] Destructive Button
- [ ] Icon Button
- [ ] Loading State
- [ ] Disabled State

### [x] Inputs & Textareas (الحقول النصية)
```typescript
interface InputProps {
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  size: 'sm' | 'md' | 'lg';
  variant: 'default' | 'filled' | 'flushed';
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
}
```

**الحقول المطلوبة:**
- [x] Text Input (Mantine TextInput + توكنز مركزية)
- [ ] Email Input
- [ ] Password Input (مع toggle visibility)
- [ ] Number Input
- [ ] Phone Input (مع قائمة البلدان)
- [ ] Search Input
- [ ] Textarea
- [ ] Auto-resize Textarea

### [ ] Selects & Combobox (القوائم المنسدلة)
```typescript
interface SelectProps {
  options: Array<{value: string, label: string, disabled?: boolean}>;
  value?: string | string[];
  multiple?: boolean;
  searchable?: boolean;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  size: 'sm' | 'md' | 'lg';
}
```

**الأنواع المطلوبة:**
- [ ] Simple Select
- [ ] Multi-select
- [ ] Searchable Select (Combobox)
- [ ] Grouped Options
- [ ] Custom Option Rendering
- [ ] Async Options Loading

## 🎭 مكونات التفاعل (Interactive Components)

### [ ] Modal/Drawer (النوافذ المنبثقة)
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  title?: string;
  showCloseButton?: boolean;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  children: ReactNode;
}
```

**الأنواع المطلوبة:**
- [ ] Basic Modal
- [ ] Confirmation Dialog
- [ ] Form Modal
- [ ] Full Screen Modal
- [ ] Side Drawer
- [ ] Bottom Sheet (Mobile)

### [ ] Tabs (التبويبات)
```typescript
interface TabsProps {
  tabs: Array<{id: string, label: string, disabled?: boolean}>;
  defaultTab?: string;
  variant: 'line' | 'enclosed' | 'soft-rounded' | 'solid-rounded';
  size: 'sm' | 'md' | 'lg';
  orientation: 'horizontal' | 'vertical';
  children: ReactNode;
}
```

**الحالات المطلوبة:**
- [ ] Horizontal Tabs
- [ ] Vertical Tabs
- [ ] Icon Tabs
- [ ] Badge Tabs
- [ ] Scrollable Tabs

### [ ] Table (الجداول)
```typescript
interface TableProps {
  data: Array<Record<string, any>>;
  columns: Array<{
    key: string;
    label: string;
    sortable?: boolean;
    width?: string;
    render?: (value: any, row: any) => ReactNode;
  }>;
  sortable?: boolean;
  selectable?: boolean;
  pagination?: boolean;
  loading?: boolean;
  empty?: ReactNode;
}
```

**الميزات المطلوبة:**
- [ ] Basic Table
- [ ] Sortable Columns
- [ ] Selectable Rows
- [ ] Expandable Rows
- [ ] Sticky Header
- [ ] Loading State
- [ ] Empty State
- [ ] Pagination
- [ ] Responsive Table

## 📢 مكونات التواصل (Feedback Components)

### [ ] Toast/Alert (الإشعارات)
```typescript
interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  description: string;
  duration?: number;
  closable?: boolean;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top' | 'bottom';
}
```

**الأنواع المطلوبة:**
- [ ] Success Toast
- [ ] Error Toast
- [ ] Warning Toast
- [ ] Info Toast
- [ ] Loading Toast
- [ ] Toast با Action Button

### [ ] Alert Banner (لافتات التنبيه)
```typescript
interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  description: string;
  closable?: boolean;
  action?: {label: string, onClick: () => void};
}
```

**الحالات المطلوبة:**
- [ ] Inline Alert
- [ ] Banner Alert
- [ ] Card Alert
- [ ] Toast Alert

## 🧭 مكونات التنقل (Navigation Components)

### [ ] Breadcrumbs (فتات الخبز)
```typescript
interface BreadcrumbsProps {
  items: Array<{
    label: string;
    href?: string;
    current?: boolean;
  }>;
  separator?: ReactNode;
  maxItems?: number;
}
```

**الحالات المطلوبة:**
- [ ] Basic Breadcrumbs
- [ ] Breadcrumbs مع Icons
- [ ] Collapsed Breadcrumbs
- [ ] Custom Separator

### [ ] Pagination (تقسيم الصفحات)
```typescript
interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean;
  onChange: (page: number, pageSize?: number) => void;
}
```

**الأنواع المطلوبة:**
- [ ] Basic Pagination
- [ ] Mini Pagination
- [ ] Simple Pagination
- [ ] Size Changer
- [ ] Quick Jumper

## 🎴 مكونات المحتوى (Content Components)

### [ ] Cards (البطاقات)
```typescript
interface CardProps {
  variant: 'elevated' | 'outline' | 'filled';
  padding: 'none' | 'sm' | 'md' | 'lg';
  clickable?: boolean;
  loading?: boolean;
  children: ReactNode;
}
```

**الأنواع المطلوبة:**
- [ ] Basic Card
- [ ] Media Card
- [ ] User Card  
- [ ] Project Card
- [ ] Stats Card
- [ ] Loading Card

### [ ] Avatar (الصورة الشخصية)
```typescript
interface AvatarProps {
  src?: string;
  alt?: string;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  name?: string; // للـ initials
  shape: 'circle' | 'square';
  border?: boolean;
  online?: boolean;
}
```

**الحالات المطلوبة:**
- [ ] Image Avatar
- [ ] Initials Avatar
- [ ] Icon Avatar
- [ ] Avatar Group
- [ ] Avatar مع Online Indicator

## 📊 مكونات البيانات (Data Components)

### [ ] Charts (الرسوم البيانية)
**ملاحظة:** سيتم استخدام مكتبة Recharts أو Chart.js

**الأنواع المطلوبة:**
- [ ] Line Chart
- [ ] Bar Chart  
- [ ] Pie Chart
- [ ] Donut Chart
- [ ] Area Chart

### [ ] Progress Indicators (مؤشرات التقدم)
```typescript
interface ProgressProps {
  value: number; // 0-100
  max?: number;
  size: 'sm' | 'md' | 'lg';
  variant: 'linear' | 'circular';
  color?: 'primary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
}
```

**الأنواع المطلوبة:**
- [ ] Linear Progress
- [ ] Circular Progress  
- [ ] Step Progress
- [ ] Indeterminate Progress

## 📝 مكونات النماذج (Form Components)

### [ ] Form Layout (تخطيط النماذج)
```typescript
interface FormProps {
  layout: 'vertical' | 'horizontal' | 'inline';
  spacing: 'sm' | 'md' | 'lg';
  children: ReactNode;
}
```

**المكونات المطلوبة:**
- [ ] Form Container
- [ ] Form Section
- [ ] Form Row
- [ ] Form Column
- [ ] Form Group

### [ ] Validation (التحقق)
**التكامل مع Zod للتحقق**

**الميزات المطلوبة:**
- [ ] Field Validation
- [ ] Form Validation
- [ ] Real-time Validation
- [ ] Custom Validators
- [ ] Error Display

## 🎛️ مكونات التحكم المتقدمة (Advanced Controls)

### [ ] File Upload (رفع الملفات)
```typescript
interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  onUpload: (files: File[]) => void;
  preview?: boolean;
  disabled?: boolean;
}
```

**الأنواع المطلوبة:**
- [ ] Drag & Drop Upload
- [ ] Button Upload
- [ ] Image Preview
- [ ] Progress Upload
- [ ] Multiple Files

### [ ] Date/Time Pickers (منتقي التاريخ والوقت)
```typescript
interface DatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  format?: string;
  minDate?: Date;
  maxDate?: Date;
  showTime?: boolean;
  disabled?: boolean;
}
```

**الأنواع المطلوبة:**
- [ ] Date Picker
- [ ] Time Picker
- [ ] DateTime Picker
- [ ] Date Range Picker
- [ ] Calendar View

## 📱 مكونات خاصة بالموبايل (Mobile-Specific)

### [ ] Mobile Navigation
**الأنواع المطلوبة:**
- [ ] Bottom Navigation
- [ ] Hamburger Menu
- [ ] Pull to Refresh
- [ ] Swipe Gestures

### [ ] Mobile Inputs
**الأنواع المطلوبة:**
- [ ] Mobile Keyboard
- [ ] Touch Optimized
- [ ] Swipe Actions

## ✅ معايير إكمال المكون

لكل مكون يجب أن يكون:
- [ ] **التصميم**: Figma designs مكتملة
- [ ] **التطوير**: React component مُنفذ
- [ ] **الاختبار**: Unit tests مكتوبة
- [ ] **التوثيق**: Storybook stories جاهزة
- [ ] **إمكانية الوصول**: ARIA attributes مُطبقة
- [ ] **Responsiveness**: يعمل على جميع الشاشات
- [ ] **Theming**: يدعم Light/Dark themes
- [ ] **RTL**: يعمل بالاتجاهين

## 📈 خطة التطوير

### أولويات المرحلة الأولى
1. **أساسيات**: Buttons, Inputs, Selects
2. **تخطيط**: Cards, Grid, Spacing
3. **تنقل**: Breadcrumbs, Tabs, Pagination
4. **تفاعل**: Modal, Toast, Loading

### أولويات المرحلة الثانية
1. **بيانات**: Tables, Charts, Progress
2. **نماذج**: Validation, File Upload, Date Picker
3. **محتوى**: Avatar, Media, Empty States
4. **متقدم**: Search, Filters, Complex Forms

---

> SSOT — مصدر الحقيقة الوحيد: Design tokens وألوان مستمدة من 02-design-system.md

*آخر تحديث: 2025-08-23*
