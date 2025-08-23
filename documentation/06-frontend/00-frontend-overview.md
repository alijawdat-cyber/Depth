# 🎨 نظرة عامة على الواجهة الأمامية - منصة Depth

## 🏗️ البنية التقنية

### التقنيات المستخدمة
- **Next.js 15** - إطار العمل الرئيسي
- **React 18** - مكتبة الواجهة الأمامية
- **TypeScript** - لضمان جودة الكود
- **Tailwind CSS** - لتنسيق الواجهة
- **Framer Motion** - للحركات والانتقالات
- **React Hook Form** - لإدارة النماذج
- **Zod** - للتحقق من صحة البيانات

## 🎯 المبادئ الأساسية

### 1. تجربة المستخدم (UX)
- تصميم responsive لجميع الشاشات
- تحميل سريع وأداء محسّن
- إمكانية الوصول (Accessibility) للجميع
- واجهة متعددة اللغات (عربي/إنجليزي)

### 2. الهوية البصرية (موحدة وفق SSOT)
- الألوان الرئيسية: Purple 2025 — accent-500 = #6C2BFF (Primary)، Indigo 2025 — accent-500 = #3E5BFF (Alternate)
- الخطوط: Dubai للعربية، Inter للإنجليزية
- مرجع التوكِنز الرسمي: depth-site/docs/brand-identity/Depth‑Brand‑Identity/02-Color-Palettes-Spec.html (SSOT)

> ✅ **تم التحديث (2025-08-23):** استبدال Tajawal → Dubai (AR) وتثبيت Inter (EN) + إزالة اللون القديم #1e3a8a، وتوحيد الألوان وفق SSOT.

## 📱 الصفحات الرئيسية

### للعامة
- `/` - الصفحة الرئيسية
- `/about` - من نحن
- `/services` - الخدمات
- `/contact` - اتصل بنا
- `/portfolio` - معرض الأعمال

### لوحة التحكم
- `/dashboard` - لوحة التحكم الرئيسية
- `/projects` - إدارة المشاريع
- `/creators` - إدارة المبدعين
- `/clients` - إدارة العملاء
- `/reports` - التقارير والإحصائيات

## 🔧 هيكل المكونات

```
src/
├── components/
│   ├── ui/              # مكونات الواجهة الأساسية
│   ├── forms/           # نماذج التطبيق
│   ├── layout/          # مكونات التخطيط
│   └── features/        # مكونات الميزات الخاصة
├── pages/               # صفحات التطبيق
├── hooks/               # React Hooks مخصصة
├── utils/               # دوال مساعدة
└── styles/              # ملفات التنسيق
```

## 🎨 نظام التصميم

### الألوان
```css
:root {
  /* Brand (SSOT) */
  --color-primary: #6C2BFF; /* Purple 2025 */
  --color-primary-600: #4A1FC9;
  --color-alternate: #3E5BFF; /* Indigo 2025 */

  /* Base */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --gray-50: #f9fafb;
  --gray-900: #111827;
}
```

### الخطوط
- **عناوين**: Dubai Bold للعربية
- **نصوص**: Dubai Regular للعربية  
- **كود**: JetBrains Mono

## 📐 إرشادات التطوير

### 1. تسمية الملفات
```
PascalCase للمكونات: UserProfile.tsx
camelCase للدوال: getUserData.ts
kebab-case للصفحات: user-profile.tsx
```

### 2. بنية المكونات
```tsx
// مثال على مكون React
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  onEdit 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold">{user.name}</h3>
      <p className="text-gray-600">{user.email}</p>
      {onEdit && (
        <button 
          onClick={() => onEdit(user)}
          className="mt-4 btn-primary"
        >
          تعديل
        </button>
      )}
    </div>
  );
};
```

## 🔍 الاختبار والجودة

### أدوات الاختبار
- **Jest** - اختبار الوحدات
- **React Testing Library** - اختبار المكونات
- **Playwright** - اختبار التكامل
- **ESLint** - فحص جودة الكود
- **Prettier** - تنسيق الكود

### معايير الجودة
- تغطية اختبارات لا تقل عن 80%
- زمن تحميل الصفحة أقل من 3 ثوان
- درجة Lighthouse أعلى من 90
- دعم كامل لمعايير الوصول WCAG 2.1

## 📚 المراجع والموارد

### التوثيق التقني
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)

### أدلة التطوير الداخلية
- [دليل الإعداد المحلي](../04-development/01-local-setup.md)
- [متغيرات البيئة](../04-development/02-environment-variables.md)
- [سير عمل التطوير](../04-development/03-development-workflow.md)

---

> SSOT — مصدر الحقيقة الوحيد: الألوان والخطوط مستمدة حصراً من 02-Color-Palettes-Spec.html

**آخر تحديث:** 2025-08-23
**الإصدار:** 2.0
