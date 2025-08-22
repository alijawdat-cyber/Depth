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

### 2. هوية الشركة
- الألوان الرئيسية: أزرق داكن (#1e3a8a) وذهبي (#f59e0b)
- الخط الرئيسي: Tajawal للعربية، Inter للإنجليزية
- أسلوب بصري احترافي وأنيق

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
  --primary: #1e3a8a;     /* أزرق داكن */
  --secondary: #f59e0b;   /* ذهبي */
  --success: #10b981;     /* أخضر */
  --warning: #f59e0b;     /* برتقالي */
  --error: #ef4444;       /* أحمر */
  --gray-50: #f9fafb;     /* رمادي فاتح */
  --gray-900: #111827;    /* رمادي داكن */
}
```

### الخطوط
- **عناوين**: Tajawal Bold للعربية
- **نصوص**: Tajawal Regular للعربية  
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

**آخر تحديث:** 2025-08-21
**الإصدار:** 2.0
