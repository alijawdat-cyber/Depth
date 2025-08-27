# خطة تطبيق شاشات الادمن - منصة Depth

## 1. الهيكل الأساسي للمشروع

### المجلدات الرئيسية
```
frontend/src/
├── app/
│   └── admin/                    # شاشات الادمن
│       ├── layout.tsx           # Layout موحد للادمن
│       ├── page.tsx             # Dashboard الرئيسي
│       ├── users/              # إدارة المستخدمين
│       ├── projects/           # إدارة المشاريع
│       ├── quotes/             # إدارة عروض الأسعار
│       ├── payments/           # إدارة المدفوعات
│       └── settings/           # الإعدادات
├── components/
│   ├── admin/                  # مكونات خاصة بالادمن
│   ├── ui/                     # مكونات UI عامة
│   └── forms/                  # مكونات الفورم
└── styles/
    └── admin.css              # استايلات خاصة بالادمن
```

## 2. الشاشات الـ16 المطلوبة

### أ. إدارة المستخدمين (6 شاشات)
1. **قائمة المستخدمين** `/admin/users`
2. **تفاصيل المستخدم** `/admin/users/[id]`
3. **إنشاء مستخدم** `/admin/users/new`
4. **تعديل مستخدم** `/admin/users/[id]/edit`
5. **إدارة الأدوار** `/admin/users/roles`
6. **سجل النشاط** `/admin/users/activity-log`

### ب. إدارة المشاريع (4 شاشات)
7. **قائمة المشاريع** `/admin/projects`
8. **تفاصيل المشروع** `/admin/projects/[id]`
9. **إنشاء مشروع** `/admin/projects/new`
10. **تعديل مشروع** `/admin/projects/[id]/edit`

### ج. إدارة العروض والمالية (3 شاشات)
11. **إدارة عروض الأسعار** `/admin/quotes`
12. **إدارة المدفوعات** `/admin/payments`
13. **التقارير المالية** `/admin/reports/financial`

### د. الإعدادات والنظام (3 شاشات)
14. **إعدادات النظام** `/admin/settings`
15. **إدارة المحتوى** `/admin/content`
16. **لوحة التحكم الرئيسية** `/admin` (Dashboard)

## 3. مكونات Mantine المستخدمة

### مكونات الجداول والبيانات
- `Table` - عرض قوائم المستخدمين والمشاريع
- `Pagination` - تقسيم البيانات
- `TextInput` - حقول البحث والفلترة
- `Select` - القوائم المنسدلة
- `DateInput` - اختيار التواريخ

### مكونات التخطيط والتنظيم
- `AppShell` - الهيكل الرئيسي للادمن
- `NavLink` - روابط التنقل الجانبي
- `Breadcrumbs` - مسار التنقل
- `Grid` - تنظيم المحتوى
- `Card` - عرض المعلومات المجمعة

### مكونات التفاعل
- `Button` - الأزرار الرئيسية
- `ActionIcon` - أزرار الإجراءات السريعة
- `Menu` - القوائم المنسدلة للإجراءات
- `Modal` - النوافذ المنبثقة للتأكيد
- `Notifications` - رسائل النجاح والخطأ

## 4. نظام الألوان والتصميم

### ألوان العلامة التجارية
```css
--primary-500: #4C3AFF;    /* اللون الأساسي */
--primary-600: #3D2BCC;    /* تدرج أغمق */
--primary-700: #2F1F99;    /* تدرج أكثر غمقاً */
```

### ألوان وظيفية
```css
--success-500: #10B981;    /* أخضر للنجاح */
--warning-500: #F59E0B;    /* أصفر للتحذير */
--error-500: #EF4444;      /* أحمر للخطأ */
```

### ألوان محايدة
```css
--neutral-0: #FFFFFF;      /* خلفية بيضاء */
--neutral-100: #F3F4F6;    /* خلفية فاتحة */
--neutral-500: #6B7280;    /* نص ثانوي */
--neutral-800: #1F2937;    /* نص أساسي */
```

## 5. نظام الخطوط

### الخط العربي
```css
font-family: 'Dubai', system-ui, sans-serif;
--font-ar-weight-regular: 400;
--font-ar-weight-medium: 500;
--font-ar-weight-bold: 700;
```

### أحجام النصوص
```css
.text-h1: 48px (32px mobile) - العناوين الرئيسية
.text-h2: 40px (28px mobile) - عناوين الأقسام
.text-h3: 32px (24px mobile) - عناوين فرعية
.text-body: 16px - النص العادي
.text-small: 14px - النص الصغير
```

## 6. استراتيجية Responsive Design

### نقاط التوقف (Breakpoints)
```css
mobile: < 768px
tablet: 768px - 1024px
desktop: > 1024px
```

### تكيف الشاشات
- **Mobile**: تبديل Sidebar لـ Drawer
- **Tablet**: Sidebar مطوي
- **Desktop**: Sidebar مفتوح كامل

## 7. نظام المصادقة

### Google OAuth للادمن
- تسجيل دخول موحد عبر Firebase Auth
- التحقق من صلاحية الادمن بعد المصادقة
- إعادة توجيه للداشبورد بعد النجاح

### حماية الشاشات
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // تحقق من وجود admin token
    const token = request.cookies.get('admin-token');
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
}
```

## 8. إدارة عروض الأسعار

### سير العمل
1. الادمن ينشئ عرض سعر جديد
2. يرسل العرض للعميل عبر الايميل
3. العميل يراجع ويوافق أو يرفض
4. بعد الموافقة يتحول العرض لمشروع

### API المطلوبة
```typescript
POST /api/admin/quotes - إنشاء عرض جديد
PUT /api/admin/quotes/[id] - تحديث عرض
GET /api/admin/quotes - قائمة العروض
DELETE /api/admin/quotes/[id] - حذف عرض
```

## 9. جداول البيانات المتقدمة

### مميزات الجداول
- **البحث**: بحث فوري في كل الأعمدة
- **الفلترة**: فلترة حسب الحالة والتاريخ والنوع
- **الترتيب**: ترتيب حسب أي عمود
- **التصدير**: تصدير البيانات CSV/PDF
- **التحديد المتعدد**: اختيار عدة صفوف للإجراءات المجمعة

### تطبيق الجدول
```typescript
<DataTable
  columns={[
    { accessor: 'name', title: 'الاسم' },
    { accessor: 'email', title: 'الايميل' },
    { accessor: 'role', title: 'الدور' },
    { accessor: 'status', title: 'الحالة' },
    { accessor: 'actions', title: 'الإجراءات' }
  ]}
  records={users}
  fetching={loading}
  onRowClick={handleRowClick}
/>
```

## 10. النماذج والتحقق

### مكتبة التحقق
```bash
npm install react-hook-form @hookform/resolvers zod
```

### مثال نموذج مستخدم
```typescript
const userSchema = z.object({
  name: z.string().min(2, 'الاسم قصير جداً'),
  email: z.string().email('ايميل غير صحيح'),
  role: z.enum(['admin', 'client', 'creator']),
  phone: z.string().min(10, 'رقم الهاتف غير صحيح')
});
```

## 11. إدارة الحالة

### Zustand Store
```typescript
interface AdminStore {
  users: User[];
  projects: Project[];
  quotes: Quote[];
  loading: boolean;
  fetchUsers: () => Promise<void>;
  createUser: (user: CreateUserDto) => Promise<void>;
  updateUser: (id: string, user: UpdateUserDto) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}
```

## 12. التنفيذ المرحلي

### المرحلة الأولى (الأساسيات)
1. Layout الادمن الأساسي
2. نظام المصادقة
3. داشبورد رئيسي بالإحصائيات
4. قائمة المستخدمين الأساسية

### المرحلة الثانية (الإدارة)
5. إدارة المستخدمين كاملة
6. إدارة المشاريع الأساسية
7. قائمة عروض الأسعار

### المرحلة الثالثة (المتقدم)
8. إنشاء وتعديل عروض الأسعار
9. إدارة المدفوعات
10. التقارير المالية
11. إدارة المحتوى

### المرحلة الرابعة (التحسينات)
12. سجل النشاط المتقدم
13. إدارة الأدوار المعقدة
14. التصدير والتقارير المتقدمة
15. الإشعارات المباشرة
16. التحسينات والتلميعات النهائية

## 13. اختبار الجودة

### اختبار كل شاشة
```
Given: ادمن مصادق عليه
When: يدخل شاشة المستخدمين
Then: يشوف قائمة كل المستخدمين ويقدر يبحث ويفلتر
```

## 14. قاعدة الأكواد المطلوبة

### هيكل الملفات
```
frontend/src/app/admin/
├── layout.tsx (AppShell + NavLinks)
├── page.tsx (Dashboard)
├── users/
│   ├── page.tsx (قائمة المستخدمين)
│   ├── [id]/
│   │   ├── page.tsx (تفاصيل المستخدم)
│   │   └── edit/page.tsx (تعديل المستخدم)
│   ├── new/page.tsx (إنشاء مستخدم)
│   ├── roles/page.tsx (إدارة الأدوار)
│   └── activity/page.tsx (سجل النشاط)
├── projects/ (نفس الهيكل)
├── quotes/ (نفس الهيكل)
├── payments/page.tsx
├── reports/
│   └── financial/page.tsx
├── settings/page.tsx
└── content/page.tsx
```

هاي الخطة الشاملة، تحتاج حوالي 4-6 أسابيع عمل لتطبيق كامل مع الاختبار.
