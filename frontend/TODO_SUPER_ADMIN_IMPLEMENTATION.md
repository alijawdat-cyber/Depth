# خ**آخر تحديث**: 30 أغسطس 2025  
**المرجع**: SUPER_ADMIN_SCREENS_STRUCTURE.md  
**الموك المرتبط**: 18 ملف TypeScript مع نظام LineItems متكامل  
**المشاريع المرجعية**: 4 مشاريع حقيقية (34 LineItem إجمالي)  

---

## ⚠️ **تعليمات حاسمة للتطوير - إلزامية التطبيق**

### 🛑 **قاعدة ذهبية: مكتبة Mantine حصرياً + تخصيص مركزي فقط**

> **تحذير مهم**: أي مخالفة لهذه القواعد ستؤدي لرفض العمل وإعادة التطوير

#### 🎨 **استخدام المكونات - القواعد الصارمة:**

##### ✅ **المسموح (إلزامي)**:
```typescript
// المكونات الأساسية من Mantine فقط - لا غير
import {
  Button, Input, Select, Table, Card, Grid, Text, Title,
  Modal, Drawer, Tabs, Badge, Avatar, Group, Stack,
  Paper, ActionIcon, Menu, Notification, LoadingOverlay,
  Container, Box, Flex, Space, Divider, Loader
} from '@mantine/core';

// استخدام مباشر بدون تعديل
<Button variant="filled" color="blue">حفظ</Button>
<Card shadow="sm" padding="lg" radius="md">المحتوى</Card>
<Table striped highlightOnHover>الجدول</Table>
```

##### 🚫 **الممنوع تماماً**:
```typescript
// ❌ إنشاء أزرار مخصصة
const CustomButton = styled(Button)`...`
const MyButton = ({ children }) => <button className="my-btn">{children}</button>

// ❌ تخصيص في ملفات المكونات
<Button style={{ background: 'red' }}>ممنوع</Button>
<Card className="my-custom-card">ممنوع</Card>

// ❌ CSS modules في المكونات
import styles from './Component.module.css'

// ❌ إنشاء مكونات UI أساسية جديدة
const MyInput = () => <input />
const MyTable = () => <table />
```

#### 🎨 **التخصيص المركزي - حصرياً:**

##### ✅ **globals.css فقط**:
```css
/* كل التخصيص هنا حصرياً */
.mantine-Button-root {
  font-family: var(--font-family-primary);
  border-radius: var(--border-radius-md);
  transition: var(--transition-base);
}

.mantine-Card-root {
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.mantine-Table-root {
  --table-border-color: var(--border-color);
  --table-hover-color: var(--surface-hover);
}

/* تخصيصات الأدمن */
.admin-layout { background: var(--admin-bg-color); }
.admin-sidebar { background: var(--admin-sidebar-bg); }
.admin-header { background: var(--admin-header-bg); }
```

##### ✅ **tokens.css للمتغيرات**:
```css
/* متغيرات الألوان */
:root {
  --primary-color: #1c7ed6;
  --secondary-color: #495057;
  --admin-bg-color: #f8f9fa;
  --admin-sidebar-bg: #343a40;
  --admin-header-bg: #ffffff;
  --admin-border-color: #dee2e6;
}
```

#### 🧩 **المكونات المركبة المسموحة**:
```typescript
// مكون مركب لوظيفة معقدة - مسموح
export function AdminDashboard() {
  return (
    <Container size="xl">
      <Grid>
        <Grid.Col span={12}>
          <KPIGrid data={kpiData} />
        </Grid.Col>
        <Grid.Col span={8}>
          <AlertsList alerts={alerts} />
        </Grid.Col>
        <Grid.Col span={4}>
          <QuickActions actions={quickActions} />
        </Grid.Col>
      </Grid>
    </Container>
  );
}

// مكون لعرض البيانات - مسموح  
export function InvoicesTable({ invoices }: InvoicesTableProps) {
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>رقم الفاتورة</Table.Th>
          <Table.Th>العميل</Table.Th>
          <Table.Th>المبلغ</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {invoices.map((invoice) => (
          <Table.Tr key={invoice.id}>
            <Table.Td>{invoice.number}</Table.Td>
            <Table.Td>{invoice.clientName}</Table.Td>
            <Table.Td>{invoice.amount}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
```

#### 🚨 **عواقب المخالفة:**
- **رفض فوري** لأي كود يخالف هذه القواعد
- **إعادة كتابة كاملة** للمكونات المخالفة  
- **تأخير المشروع** بسبب إعادة العمل
- **عدم قبول** أي تخصيص خارج globals.css

#### 📋 **قائمة مراجعة قبل كل commit:**
- [ ] كل المكونات تستخدم Mantine حصرياً
- [ ] لا توجد أي ملفات .module.css
- [ ] لا توجد أي styled-components  
- [ ] لا توجد أي style props في JSX
- [ ] كل التخصيص في globals.css فقط
- [ ] جميع المتغيرات من tokens.cssطوير السوبر أدمن - منصة Depth
## قائمة مهام شاملة للتطوير والتنفيذ

> **آخر تحديث**: 30 أغسطس 2025  
> **المرجع**: SUPER_ADMIN_SCREENS_STRUCTURE.md  
> **الموك المرتبط**: 18 ملف TypeScript مع نظام LineItems متكامل  
> **المشاريع المرجعية**: 4 مشاريع حقيقية (34 LineItem إجمالي)  

---

## 🎯 ملخص التحليل الشامل

### 📊 الإحصائيات العامة:
- **🏗️ الشاشات الرئيسية**: 25 شاشة موزعة على 6 أقسام
- **🧩 الشاشات الفرعية**: 70+ شاشة تفصيلية  
- **📁 ملفات Next.js المطلوبة**: 89 ملف صفحة
- **🎨 المكونات React**: 45+ مكون مركب
- **💾 ارتباط الموك**: مرتبط بـ 18 ملف TypeScript
- **📋 نظام LineItems**: مطبق على 4 مشاريع حقيقية
- **💰 البيانات المالية**: 4 فواتير بمبالغ حقيقية
- **👥 المستخدمون**: 2 أدمن، 4 عملاء، مبدعون متعددون

### 🎨 تحليل التوافق مع الملف المرجعي:
- **✅ التطابق الكامل**: كل الـ25 شاشة من `SUPER_ADMIN_SCREENS_STRUCTURE.md` مغطاة في خطة التنفيذ
- **✅ الشاشات الفرعية**: كل الـ70+ شاشة فرعية محددة في المراحل الثمانية
- **✅ البنية التقنية**: مطابقة تامة لهيكل Next.js المقترح في الملف المرجعي
- **✅ نظام الصلاحيات**: متوافق مع التوثيق الأصلي (سوبر أدمن vs أدمن عادي)
- **✅ ارتباط الموك**: كل مهمة مربوطة بالملفات الصحيحة حسب الملف المرجعي

---

## 🚀 خطة التنفيذ حسب الأولوية

### 📋 **المرحلة الأولى: البنية الأساسية والتخطيط** (أولوية عالية)

#### 🏗️ إعداد هيكل المشروع
- [ ] **إنشاء مجلد admin الرئيسي**
  - **مسار**: `src/app/admin/`
  - **ارتباط التوثيق**: الهيكل الشجري للفرونت إند (صفحة 8)
  - **ارتباط الموك**: يستخدم جميع ملفات الموك الـ18

- [ ] **ملفات التخطيط الأساسية**
  - **مسار**: `src/app/admin/layout.tsx`
  - **ارتباط التوثيق**: تخطيط عام للأدمن
  - **ارتباط الموك**: يعرض بيانات المستخدم الحالي (علي جواد الربيعي)

- [ ] **شاشة التحميل الموحدة**
  - **مسار**: `src/app/admin/loading.tsx`
  - **ارتباط التوثيق**: شاشة تحميل موحدة
  - **ارتباط الموك**: لا يحتاج موك

- [ ] **شاشة الخطأ الموحدة**
  - **مسار**: `src/app/admin/error.tsx`
  - **ارتباط التوثيق**: شاشة خطأ موحدة
  - **ارتباط الموك**: لا يحتاج موك

#### 🎨 المكونات الأساسية المشتركة
- [ ] **تخطيط الأدمن الأساسي**
  - **مسار**: `src/components/admin/shared/AdminLayout.tsx`
  - **ارتباط التوثيق**: تخطيط الأدمن الأساسي
  - **ارتباط الموك**: يستخدم admins.ts للصلاحيات

- [ ] **الشريط الجانبي**
  - **مسار**: `src/components/admin/shared/AdminSidebar.tsx`
  - **ارتباط التوثيق**: الشريط الجانبي
  - **ارتباط الموك**: يعرض قائمة الـ25 شاشة حسب الصلاحيات

- [ ] **رأس الصفحة**
  - **مسار**: `src/components/admin/shared/AdminHeader.tsx`
  - **ارتباط التوثيق**: رأس الصفحة
  - **ارتباط الموك**: يعرض بيانات المستخدم من admins.ts

- [ ] **مسار التنقل**
  - **مسار**: `src/components/admin/shared/AdminBreadcrumb.tsx`
  - **ارتباط التوثيق**: مسار التنقل
  - **ارتباط الموك**: لا يحتاج موك

- [ ] **غلاف الصفحة مع الصلاحيات**
  - **مسار**: `src/components/admin/shared/AdminPageWrapper.tsx`
  - **ارتباط التوثيق**: غلاف الصفحة + نظام الصلاحيات
  - **ارتباط الموك**: يستخدم admins.ts للتحقق من الصلاحيات

---

### 📊 **المرحلة الثانية: Dashboard الرئيسي** (أولوية عالية)

#### 🏠 لوحة التحكم الرئيسية
- [ ] **Dashboard الرئيسي**
  - **مسار**: `src/app/admin/page.tsx`
  - **ارتباط التوثيق**: لوحة التحكم الرئيسية (4 مؤشرات)
  - **ارتباط الموك**: يحسب KPIs من projects.ts, invoicing.ts, clients.ts

- [ ] **مكون Dashboard الرئيسي**
  - **مسار**: `src/components/admin/dashboard/AdminDashboard.tsx`
  - **ارتباط التوثيق**: Dashboard الرئيسي
  - **ارتباط الموك**: يعرض إحصائيات الـ4 مشاريع والـ4 فواتير

- [ ] **شبكة المؤشرات (KPIs)**
  - **مسار**: `src/components/admin/dashboard/KPIGrid.tsx`
  - **ارتباط التوثيق**: شبكة المؤشرات
  - **ارتباط الموك**: يحسب من LineItems الـ34 بند

- [ ] **قائمة التنبيهات**
  - **مسار**: `src/components/admin/dashboard/AlertsList.tsx`
  - **ارتباط التوثيق**: التنبيهات العاجلة
  - **ارتباط الموك**: يعرض طلبات معلقة من مختلف الملفات

- [ ] **الإجراءات السريعة**
  - **مسار**: `src/components/admin/dashboard/QuickActions.tsx`
  - **ارتباط التوثيق**: الروابط السريعة
  - **ارتباط الموك**: روابط للشاشات الـ25

---

### 👥 **المرحلة الثالثة: إدارة المستخدمين والأدوار** (5 شاشات - أولوية عالية)

#### 🧑‍💼 1. إدارة الأدمنز (السوبر أدمن فقط)
- [ ] **قائمة الأدمنز**
  - **مسار**: `src/app/admin/users/admins/page.tsx`
  - **ارتباط التوثيق**: قائمة الأدمنز الحالية (2 أدمن)
  - **ارتباط الموك**: admins.ts (علي جواد + أحمد محمد)

- [ ] **تفاصيل أدمن محدد**
  - **مسار**: `src/app/admin/users/admins/[id]/page.tsx`
  - **ارتباط التوثيق**: تفاصيل أدمن
  - **ارتباط الموك**: admins.ts بالـID المحدد

- [ ] **إضافة أدمن جديد**
  - **مسار**: `src/app/admin/users/admins/new/page.tsx`
  - **ارتباط التوثيق**: إضافة أدمن جديد
  - **ارتباط الموك**: يضيف للـadmins.ts

- [ ] **مكون قائمة الأدمنز**
  - **مسار**: `src/components/admin/users/AdminsList.tsx`
  - **ارتباط التوثيق**: قائمة الأدمنز
  - **ارتباط الموك**: admins.ts

- [ ] **بطاقة تفاصيل أدمن**
  - **مسار**: `src/components/admin/users/AdminDetailsCard.tsx`
  - **ارتباط التوثيق**: بطاقة تفاصيل أدمن
  - **ارتباط الموك**: admins.ts

#### 🎨 2. إدارة المبدعين مع نظام الطلبات الشامل
- [ ] **قائمة المبدعين الرئيسية**
  - **مسار**: `src/app/admin/users/creators/page.tsx`
  - **ارتباط التوثيق**: قائمة المبدعين (فاطمة، علي، مريم، كريم)
  - **ارتباط الموك**: creators.ts

- [ ] **تفاصيل مبدع محدد**
  - **مسار**: `src/app/admin/users/creators/[id]/page.tsx`
  - **ارتباط التوثيق**: تفاصيل مبدع + البورتفوليو
  - **ارتباط الموك**: creators.ts بالـID المحدد

- [ ] **طلبات الانضمام المعلقة**
  - **مسار**: `src/app/admin/users/creators/pending/page.tsx`
  - **ارتباط التوثيق**: طلبات الانضمام المعلقة
  - **ارتباط الموك**: يحتاج إنشاء creator_requests.ts

- [ ] **طلبات تعديل المعدات**
  - **مسار**: `src/app/admin/users/creators/equipment-requests/page.tsx`
  - **ارتباط التوثيق**: طلبات إضافة معدات جديدة
  - **ارتباط الموك**: يحتاج إنشاء equipment_requests.ts

- [ ] **طلبات تعديل الأوقات**
  - **مسار**: `src/app/admin/users/creators/schedule-requests/page.tsx`
  - **ارتباط التوثيق**: طلبات تعديل الأوقات المتاحة
  - **ارتباط الموك**: يحتاج إنشاء schedule_requests.ts

- [ ] **طلبات تعديل الفئات الرئيسية**
  - **مسار**: `src/app/admin/users/creators/category-requests/page.tsx`
  - **ارتباط التوثيق**: طلبات إضافة/تعديل الفئات الرئيسية
  - **ارتباط الموك**: يحتاج إنشاء category_requests.ts

- [ ] **طلبات تعديل الفئات الفرعية**
  - **مسار**: `src/app/admin/users/creators/subcategory-requests/page.tsx`
  - **ارتباط التوثيق**: طلبات إضافة/تعديل الفئات الفرعية
  - **ارتباط الموك**: يحتاج إنشاء subcategory_requests.ts

- [ ] **مكون قائمة المبدعين**
  - **مسار**: `src/components/admin/users/CreatorsList.tsx`
  - **ارتباط التوثيق**: قائمة المبدعين
  - **ارتباط الموك**: creators.ts

- [ ] **ملف المبدع**
  - **مسار**: `src/components/admin/users/CreatorProfile.tsx`
  - **ارتباط التوثيق**: ملف المبدع
  - **ارتباط الموك**: creators.ts

- [ ] **نظام طلبات المبدعين الشامل**
  - **مسار**: `src/components/admin/users/CreatorRequests.tsx`
  - **ارتباط التوثيق**: نظام طلبات المبدعين الشامل (5 أنواع)
  - **ارتباط الموك**: جميع ملفات الطلبات الجديدة

#### 🏢 3. إدارة العملاء مع طلبات الانضمام
- [ ] **قائمة العملاء النشطين**
  - **مسار**: `src/app/admin/users/clients/page.tsx`
  - **ارتباط التوثيق**: قائمة العملاء النشطين (4 عملاء)
  - **ارتباط الموك**: clients.ts

- [ ] **تفاصيل عميل محدد**
  - **مسار**: `src/app/admin/users/clients/[id]/page.tsx`
  - **ارتباط التوثيق**: تفاصيل عميل كامل
  - **ارتباط الموك**: clients.ts بالـID المحدد

- [ ] **طلبات انضمام العملاء المعلقة**
  - **مسار**: `src/app/admin/users/clients/pending-registrations/page.tsx`
  - **ارتباط التوثيق**: طلبات انضمام العملاء الجدد
  - **ارتباط الموك**: يحتاج إنشاء client_registrations.ts

- [ ] **مكون قائمة العملاء**
  - **مسار**: `src/components/admin/users/ClientsList.tsx`
  - **ارتباط التوثيق**: قائمة العملاء
  - **ارتباط الموك**: clients.ts

- [ ] **بطاقة تفاصيل عميل**
  - **مسار**: `src/components/admin/users/ClientDetailsCard.tsx`
  - **ارتباط التوثيق**: بطاقة تفاصيل عميل
  - **ارتباط الموك**: clients.ts

- [ ] **طلبات انضمام العملاء**
  - **مسار**: `src/components/admin/users/ClientRegistrationRequests.tsx`
  - **ارتباط التوثيق**: طلبات انضمام العملاء
  - **ارتباط الموك**: client_registrations.ts

#### 👔 4. إدارة الموظفين بالراتب (نظام الدعوات)
- [ ] **قائمة الموظفين**
  - **مسار**: `src/app/admin/users/employees/page.tsx`
  - **ارتباط التوثيق**: قائمة الموظفين الحاليين
  - **ارتباط الموك**: يحتاج إنشاء employees.ts

- [ ] **تفاصيل موظف محدد**
  - **مسار**: `src/app/admin/users/employees/[id]/page.tsx`
  - **ارتباط التوثيق**: تفاصيل الموظف والراتب
  - **ارتباط الموك**: employees.ts

- [ ] **دعوة موظف جديد**
  - **مسار**: `src/app/admin/users/employees/invite/page.tsx`
  - **ارتباط التوثيق**: دعوة موظف براتب جديد (عبر الإيميل)
  - **ارتباط الموك**: يحتاج إنشاء employee_invitations.ts

- [ ] **متابعة حالة الدعوات**
  - **مسار**: `src/app/admin/users/employees/invitations/page.tsx`
  - **ارتباط التوثيق**: متابعة حالة الدعوة
  - **ارتباط الموك**: employee_invitations.ts

- [ ] **مكون قائمة الموظفين**
  - **مسار**: `src/components/admin/users/EmployeesList.tsx`
  - **ارتباط التوثيق**: قائمة الموظفين
  - **ارتباط الموك**: employees.ts

- [ ] **نظام دعوة الموظفين**
  - **مسار**: `src/components/admin/users/EmployeeInvitation.tsx`
  - **ارتباط التوثيق**: نظام دعوة الموظفين
  - **ارتباط الموك**: employee_invitations.ts

#### 📋 5. مركز إدارة جميع الطلبات
- [ ] **مركز الطلبات الشامل**
  - **مسار**: `src/app/admin/users/requests-center/page.tsx`
  - **ارتباط التوثيق**: مركز إدارة جميع الطلبات
  - **ارتباط الموك**: يجمع من جميع ملفات الطلبات

- [ ] **مكون مركز إدارة جميع الطلبات**
  - **مسار**: `src/components/admin/users/RequestsCenter.tsx`
  - **ارتباط التوثيق**: عرض موحد لجميع الطلبات المعلقة
  - **ارتباط الموك**: يجمع من جميع أنواع الطلبات

---

### 🎯 **المرحلة الرابعة: إدارة الخدمات والتصنيفات** (4 شاشات - أولوية متوسطة)

#### 📂 6. إدارة الفئات الرئيسية
- [ ] **قائمة الفئات الرئيسية**
  - **مسار**: `src/app/admin/services/categories/page.tsx`
  - **ارتباط التوثيق**: إدارة الفئات الرئيسية (4 فئات)
  - **ارتباط الموك**: categories.ts

- [ ] **تفاصيل فئة محددة**
  - **مسار**: `src/app/admin/services/categories/[id]/page.tsx`
  - **ارتباط التوثيق**: تفاصيل فئة
  - **ارتباط الموك**: categories.ts

- [ ] **إضافة فئة جديدة**
  - **مسار**: `src/app/admin/services/categories/new/page.tsx`
  - **ارتباط التوثيق**: إضافة فئة جديدة
  - **ارتباط الموك**: categories.ts

#### 📋 7. إدارة الفئات الفرعية (28 فئة)
- [ ] **قائمة الفئات الفرعية**
  - **مسار**: `src/app/admin/services/subcategories/page.tsx`
  - **ارتباط التوثيق**: إدارة الفئات الفرعية (28 فئة)
  - **ارتباط الموك**: subcategories.ts

- [ ] **تفاصيل فئة فرعية محددة**
  - **مسار**: `src/app/admin/services/subcategories/[id]/page.tsx`
  - **ارتباط التوثيق**: تفاصيل فئة فرعية
  - **ارتباط الموك**: subcategories.ts

- [ ] **إضافة فئة فرعية جديدة**
  - **مسار**: `src/app/admin/services/subcategories/new/page.tsx`
  - **ارتباط التوثيق**: إضافة فئة فرعية جديدة
  - **ارتباط الموك**: subcategories.ts

#### 🏭 8. إدارة المجالات الصناعية
- [ ] **قائمة المجالات الصناعية**
  - **مسار**: `src/app/admin/services/industries/page.tsx`
  - **ارتباط التوثيق**: إدارة المجالات الصناعية (10 مجالات)
  - **ارتباط الموك**: industries.ts

- [ ] **تفاصيل مجال محدد**
  - **مسار**: `src/app/admin/services/industries/[id]/page.tsx`
  - **ارتباط التوثيق**: تفاصيل مجال
  - **ارتباط الموك**: industries.ts

- [ ] **إضافة مجال جديد**
  - **مسار**: `src/app/admin/services/industries/new/page.tsx`
  - **ارتباط التوثيق**: إضافة مجال جديد
  - **ارتباط الموك**: industries.ts

#### 🔗 9. ربط الفئات بالصناعات
- [ ] **مصفوفة الربط**
  - **مسار**: `src/app/admin/services/mappings/page.tsx`
  - **ارتباط التوثيق**: ربط الفئات بالصناعات
  - **ارتباط الموك**: يحتاج إنشاء service_mappings.ts

#### 🎨 مكونات إدارة الخدمات
- [ ] **شبكة الفئات**
  - **مسار**: `src/components/admin/services/CategoriesGrid.tsx`
  - **ارتباط التوثيق**: شبكة الفئات
  - **ارتباط الموك**: categories.ts

- [ ] **نموذج الفئة**
  - **مسار**: `src/components/admin/services/CategoryForm.tsx`
  - **ارتباط التوثيق**: نموذج الفئة
  - **ارتباط الموك**: categories.ts

- [ ] **جدول الفئات الفرعية**
  - **مسار**: `src/components/admin/services/SubcategoriesTable.tsx`
  - **ارتباط التوثيق**: جدول الفئات الفرعية
  - **ارتباط الموك**: subcategories.ts

- [ ] **محرر الأسعار**
  - **مسار**: `src/components/admin/services/PricingEditor.tsx`
  - **ارتباط التوثيق**: محرر الأسعار
  - **ارتباط الموك**: subcategories.ts + pricing_modifiers.ts

- [ ] **شبكة الصناعات**
  - **مسار**: `src/components/admin/services/IndustriesGrid.tsx`
  - **ارتباط التوثيق**: شبكة الصناعات
  - **ارتباط الموك**: industries.ts

- [ ] **مصفوفة الربط**
  - **مسار**: `src/components/admin/services/MappingMatrix.tsx`
  - **ارتباط التوثيق**: مصفوفة الربط
  - **ارتباط الموك**: service_mappings.ts

---

### 💰 **المرحلة الخامسة: إدارة التسعير والماليات** (6 شاشات - أولوية عالية)

#### 💵 8. نظام التسعير المتقدم
- [ ] **إدارة معدلات التسعير**
  - **مسار**: `src/app/admin/pricing/modifiers/page.tsx`
  - **ارتباط التوثيق**: إدارة معدلات التسعير (6 فئات)
  - **ارتباط الموك**: pricing_modifiers.ts

- [ ] **معدلات فئة محددة**
  - **مسار**: `src/app/admin/pricing/modifiers/[category]/page.tsx`
  - **ارتباط التوثيق**: معدلات فئة محددة
  - **ارتباط الموك**: pricing_modifiers.ts

- [ ] **حاسبة التسعير**
  - **مسار**: `src/app/admin/pricing/modifiers/calculator/page.tsx`
  - **ارتباط التوثيق**: حاسبة التسعير التفاعلية
  - **ارتباط الموك**: يستخدم calculations.ts الجديد

#### 📈 10. إدارة هوامش الوكالة
- [ ] **إدارة الهوامش**
  - **مسار**: `src/app/admin/pricing/margins/page.tsx`
  - **ارتباط التوثيق**: إدارة هوامش الوكالة (2.25× للمشاريع متعددة الخدمات)
  - **ارتباط الموك**: يحتاج إنشاء agency_margins.ts

- [ ] **تفاصيل هامش محدد**
  - **مسار**: `src/app/admin/pricing/margins/[id]/page.tsx`
  - **ارتباط التوثيق**: تفاصيل هامش
  - **ارتباط الموك**: agency_margins.ts

#### 🧾 11. إدارة الفواتير (مع نظام LineItems)
- [ ] **قائمة الفواتير**
  - **مسار**: `src/app/admin/pricing/invoices/page.tsx`
  - **ارتباط التوثيق**: قائمة الفواتير مع المبالغ الحقيقية
  - **ارتباط الموك**: invoicing.ts (4 فواتير محدثة)

- [ ] **تفاصيل فاتورة محددة**
  - **مسار**: `src/app/admin/pricing/invoices/[id]/page.tsx`
  - **ارتباط التوثيق**: تفاصيل فاتورة مع حساب لكل بند منفصل
  - **ارتباط الموك**: invoicing.ts بالـID المحدد

- [ ] **إنشاء فاتورة جديدة**
  - **مسار**: `src/app/admin/pricing/invoices/new/page.tsx`
  - **ارتباط التوثيق**: إنشاء فاتورة جديدة مع نظام الكمية
  - **ارتباط الموك**: invoicing.ts

#### 💳 12. إدارة المدفوعات
- [ ] **إدارة المدفوعات**
  - **مسار**: `src/app/admin/pricing/payments/page.tsx`
  - **ارتباط التوثيق**: إدارة المدفوعات مع ربط بـ LineItems المحددة
  - **ارتباط الموك**: invoicing.ts (3 مدفوعات)

- [ ] **تفاصيل دفعة محددة**
  - **مسار**: `src/app/admin/pricing/payments/[id]/page.tsx`
  - **ارتباط التوثيق**: تفاصيل دفعة
  - **ارتباط الموك**: invoicing.ts

#### 📊 13. التقارير المالية
- [ ] **التقارير المالية**
  - **مسار**: `src/app/admin/pricing/reports/financial/page.tsx`
  - **ارتباط التوثيق**: التقارير المالية مع تحليل LineItems
  - **ارتباط الموك**: invoicing.ts + projects.ts

#### 🎨 مكونات التسعير والماليات
- [ ] **شبكة المعدلات**
  - **مسار**: `src/components/admin/pricing/ModifiersGrid.tsx`
  - **ارتباط التوثيق**: شبكة المعدلات
  - **ارتباط الموك**: pricing_modifiers.ts

- [ ] **حاسبة التسعير**
  - **مسار**: `src/components/admin/pricing/PricingCalculator.tsx`
  - **ارتباط التوثيق**: حاسبة التسعير
  - **ارتباط الموك**: calculations.ts

- [ ] **محرر الهوامش**
  - **مسار**: `src/components/admin/pricing/MarginEditor.tsx`
  - **ارتباط التوثيق**: محرر الهوامش
  - **ارتباط الموك**: agency_margins.ts

- [ ] **جدول الفواتير**
  - **مسار**: `src/components/admin/pricing/InvoicesTable.tsx`
  - **ارتباط التوثيق**: جدول الفواتير
  - **ارتباط الموك**: invoicing.ts

- [ ] **بطاقة تفاصيل الفاتورة**
  - **مسار**: `src/components/admin/pricing/InvoiceDetailsCard.tsx`
  - **ارتباط التوثيق**: بطاقة تفاصيل الفاتورة
  - **ارتباط الموك**: invoicing.ts مع LineItems

- [ ] **جدول المدفوعات**
  - **مسار**: `src/components/admin/pricing/PaymentsTable.tsx`
  - **ارتباط التوثيق**: جدول المدفوعات
  - **ارتباط الموك**: invoicing.ts

- [ ] **التقارير المالية**
  - **مسار**: `src/components/admin/pricing/FinancialReports.tsx`
  - **ارتباط التوثيق**: التقارير المالية
  - **ارتباط الموك**: جميع الملفات المالية

---

### 🎯 **المرحلة السادسة: إدارة المشاريع والطلبات** (5 شاشات - أولوية عالية)

#### 📋 14. إدارة الطلبات الجديدة
- [ ] **قائمة الطلبات الجديدة**
  - **مسار**: `src/app/admin/projects/requests/page.tsx`
  - **ارتباط التوثيق**: إدارة الطلبات الجديدة
  - **ارتباط الموك**: يحتاج إنشاء project_requests.ts

- [ ] **تفاصيل طلب محدد**
  - **مسار**: `src/app/admin/projects/requests/[id]/page.tsx`
  - **ارتباط التوثيق**: تفاصيل الطلب كاملة
  - **ارتباط الموك**: project_requests.ts

#### 🎯 15. لوحة إدارة المشاريع (مع نظام LineItems)
- [ ] **المشاريع النشطة**
  - **مسار**: `src/app/admin/projects/active/page.tsx`
  - **ارتباط التوثيق**: لوحة إدارة المشاريع مع LineItems
  - **ارتباط الموك**: projects.ts (4 مشاريع، 34 LineItem)

- [ ] **تفاصيل مشروع محدد**
  - **مسار**: `src/app/admin/projects/active/[id]/page.tsx`
  - **ارتباط التوثيق**: تفاصيل مشروع مع جدول LineItems
  - **ارتباط الموك**: projects.ts بالـID المحدد

#### 👥 16. تعيين المبدعين للمشاريع
- [ ] **تعيين المبدعين**
  - **مسار**: `src/app/admin/projects/assignment/page.tsx`
  - **ارتباط التوثيق**: تعيين المبدعين لكل LineItem
  - **ارتباط الموك**: projects.ts + creators.ts

#### 💰 17. إدارة عروض الأسعار
- [ ] **قائمة عروض الأسعار**
  - **مسار**: `src/app/admin/projects/quotes/page.tsx`
  - **ارتباط التوثيق**: إدارة عروض الأسعار
  - **ارتباط الموك**: يحتاج إنشاء quotes.ts

- [ ] **تفاصيل عرض سعر محدد**
  - **مسار**: `src/app/admin/projects/quotes/[id]/page.tsx`
  - **ارتباط التوثيق**: تفاصيل عرض
  - **ارتباط الموك**: quotes.ts

- [ ] **إنشاء عرض سعر جديد**
  - **مسار**: `src/app/admin/projects/quotes/new/page.tsx`
  - **ارتباط التوثيق**: إنشاء عرض سعر جديد
  - **ارتباط الموك**: quotes.ts

#### 📄 18. إدارة العقود
- [ ] **قائمة العقود**
  - **مسار**: `src/app/admin/projects/contracts/page.tsx`
  - **ارتباط التوثيق**: إدارة العقود
  - **ارتباط الموك**: يحتاج إنشاء contracts.ts

- [ ] **تفاصيل عقد محدد**
  - **مسار**: `src/app/admin/projects/contracts/[id]/page.tsx`
  - **ارتباط التوثيق**: تفاصيل العقد والبنود
  - **ارتباط الموك**: contracts.ts

- [ ] **إنشاء عقد جديد**
  - **مسار**: `src/app/admin/projects/contracts/new/page.tsx`
  - **ارتباط التوثيق**: إنشاء عقد جديد
  - **ارتباط الموك**: contracts.ts

#### 🎨 مكونات إدارة المشاريع
- [ ] **قائمة الطلبات**
  - **مسار**: `src/components/admin/projects/RequestsList.tsx`
  - **ارتباط التوثيق**: قائمة الطلبات
  - **ارتباط الموك**: project_requests.ts

- [ ] **بطاقة تفاصيل طلب**
  - **مسار**: `src/components/admin/projects/RequestDetailsCard.tsx`
  - **ارتباط التوثيق**: بطاقة تفاصيل طلب
  - **ارتباط الموك**: project_requests.ts

- [ ] **لوحة المشاريع**
  - **مسار**: `src/components/admin/projects/ProjectsBoard.tsx`
  - **ارتباط التوثيق**: لوحة المشاريع
  - **ارتباط الموك**: projects.ts

- [ ] **بطاقة تفاصيل مشروع**
  - **مسار**: `src/components/admin/projects/ProjectDetailsCard.tsx`
  - **ارتباط التوثيق**: بطاقة تفاصيل مشروع مع LineItems
  - **ارتباط الموك**: projects.ts

- [ ] **تعيين المبدعين**
  - **مسار**: `src/components/admin/projects/CreatorAssignment.tsx`
  - **ارتباط التوثيق**: تعيين المبدعين
  - **ارتباط الموك**: projects.ts + creators.ts

- [ ] **جدول عروض الأسعار**
  - **مسار**: `src/components/admin/projects/QuotesTable.tsx`
  - **ارتباط التوثيق**: جدول عروض الأسعار
  - **ارتباط الموك**: quotes.ts

- [ ] **نموذج عرض السعر**
  - **مسار**: `src/components/admin/projects/QuoteForm.tsx`
  - **ارتباط التوثيق**: نموذج عرض السعر
  - **ارتباط الموك**: quotes.ts

- [ ] **جدول العقود**
  - **مسار**: `src/components/admin/projects/ContractsTable.tsx`
  - **ارتباط التوثيق**: جدول العقود
  - **ارتباط الموك**: contracts.ts

---

### 🔧 **المرحلة السابعة: إدارة النظام والإعدادات** (4 شاشات - أولوية متوسطة)

#### ⚙️ 19. إعدادات النظام العامة
- [ ] **الإعدادات العامة**
  - **مسار**: `src/app/admin/system/settings/page.tsx`
  - **ارتباط التوثيق**: إعدادات النظام العامة
  - **ارتباط الموك**: يحتاج إنشاء system_settings.ts

#### 📝 20. إدارة المحتوى والقوالب
- [ ] **إدارة المحتوى**
  - **مسار**: `src/app/admin/system/content/page.tsx`
  - **ارتباط التوثيق**: إدارة المحتوى والقوالب
  - **ارتباط الموك**: يحتاج إنشاء content_templates.ts

#### 🛠️ 21. الأدوات المساعدة
- [ ] **الأدوات المساعدة**
  - **مسار**: `src/app/admin/system/tools/page.tsx`
  - **ارتباط التوثيق**: الأدوات المساعدة
  - **ارتباط الموك**: لا يحتاج موك خاص

#### 📊 22. سجلات النشاط والمراقبة
- [ ] **المراقبة والسجلات**
  - **مسار**: `src/app/admin/system/monitoring/page.tsx`
  - **ارتباط التوثيق**: المراقبة والسجلات
  - **ارتباط الموك**: يحتاج إنشاء activity_logs.ts

#### 🎨 مكونات إدارة النظام
- [ ] **نموذج الإعدادات**
  - **مسار**: `src/components/admin/system/SettingsForm.tsx`
  - **ارتباط التوثيق**: نموذج الإعدادات
  - **ارتباط الموك**: system_settings.ts

- [ ] **محرر المحتوى**
  - **مسار**: `src/components/admin/system/ContentEditor.tsx`
  - **ارتباط التوثيق**: محرر المحتوى
  - **ارتباط الموك**: content_templates.ts

- [ ] **أدوات النظام**
  - **مسار**: `src/components/admin/system/SystemTools.tsx`
  - **ارتباط التوثيق**: أدوات النظام
  - **ارتباط الموك**: لا يحتاج موك

- [ ] **مراقب النشاط**
  - **مسار**: `src/components/admin/system/ActivityMonitor.tsx`
  - **ارتباط التوثيق**: مراقب النشاط
  - **ارتباط الموك**: activity_logs.ts

---

### 📈 **المرحلة الثامنة: التقارير والتحليلات** (3 شاشات - أولوية متوسطة)

#### 📊 23. تقارير الأداء العامة
- [ ] **تقارير الأداء**
  - **مسار**: `src/app/admin/analytics/performance/page.tsx`
  - **ارتباط التوثيق**: تقارير الأداء العامة
  - **ارتباط الموك**: يحسب من جميع الملفات الموجودة

#### 🔍 24. تحليلات متقدمة
- [ ] **التحليلات المتقدمة**
  - **مسار**: `src/app/admin/analytics/advanced/page.tsx`
  - **ارتباط التوثيق**: التحليلات المتقدمة
  - **ارتباط الموك**: يحسب من جميع الملفات الموجودة

#### 📤 25. التصدير والمشاركة
- [ ] **التصدير والمشاركة**
  - **مسار**: `src/app/admin/analytics/export/page.tsx`
  - **ارتباط التوثيق**: التصدير والمشاركة
  - **ارتباط الموك**: لا يحتاج موك خاص

#### 🎨 مكونات التحليلات
- [ ] **رسوم بيانية الأداء**
  - **مسار**: `src/components/admin/analytics/PerformanceCharts.tsx`
  - **ارتباط التوثيق**: رسوم بيانية الأداء
  - **ارتباط الموك**: جميع الملفات للحسابات

- [ ] **التحليلات المتقدمة**
  - **مسار**: `src/components/admin/analytics/AdvancedAnalytics.tsx`
  - **ارتباط التوثيق**: التحليلات المتقدمة
  - **ارتباط الموك**: جميع الملفات للحسابات

- [ ] **أدوات التصدير**
  - **مسار**: `src/components/admin/analytics/ExportTools.tsx`
  - **ارتباط التوثيق**: أدوات التصدير
  - **ارتباط الموك**: لا يحتاج موك

---

## 📂 **ملفات الموك الجديدة المطلوبة**

### 🆕 ملفات موك جديدة يجب إنشاؤها
- [ ] **creator_requests.ts** - طلبات انضمام المبدعين
- [ ] **equipment_requests.ts** - طلبات تعديل المعدات  
- [ ] **schedule_requests.ts** - طلبات تعديل الأوقات
- [ ] **category_requests.ts** - طلبات تعديل الفئات الرئيسية
- [ ] **subcategory_requests.ts** - طلبات تعديل الفئات الفرعية
- [ ] **client_registrations.ts** - طلبات انضمام العملاء
- [ ] **employees.ts** - بيانات الموظفين بالراتب
- [ ] **employee_invitations.ts** - دعوات الموظفين
- [ ] **service_mappings.ts** - ربط الفئات بالصناعات
- [ ] **agency_margins.ts** - إدارة هوامش الوكالة
- [ ] **project_requests.ts** - طلبات المشاريع الجديدة
- [ ] **quotes.ts** - عروض الأسعار
- [ ] **contracts.ts** - العقود
- [ ] **system_settings.ts** - إعدادات النظام
- [ ] **content_templates.ts** - قوالب المحتوى
- [ ] **activity_logs.ts** - سجلات النشاط

### ✅ ملفات الموك الموجودة والمحدثة
- [x] **admins.ts** - بيانات الأدمنز (2 أدمن)
- [x] **creators.ts** - بيانات المبدعين  
- [x] **clients.ts** - بيانات العملاء (4 عملاء)
- [x] **categories.ts** - الفئات الرئيسية (4 فئات)
- [x] **subcategories.ts** - الفئات الفرعية (28 فئة)
- [x] **industries.ts** - المجالات الصناعية (10 مجالات)
- [x] **pricing_modifiers.ts** - معدلات التسعير
- [x] **projects.ts** - المشاريع مع نظام LineItems (4 مشاريع، 34 بند)
- [x] **invoicing.ts** - الفواتير والمدفوعات (4 فواتير، 3 مدفوعات)
- [x] **calculations.ts** - حسابات التسعير المتقدمة
- [x] **types.ts** - واجهات TypeScript محدثة

---

## 🎨 **إعدادات CSS والتصميم**

### 🎯 ملفات التصميم المركزية
- [ ] **تحديث globals.css** - إضافة تصميمات الأدمن
  - **ارتباط التوثيق**: التخصيص المركزي في CSS
  - **المحتوى**: تصميمات admin-layout, admin-sidebar, admin-header

- [ ] **تحديث tokens.css** - إضافة متغيرات خاصة بالأدمن
  - **ارتباط التوثيق**: نظام المتغيرات المركزي
  - **المحتوى**: متغيرات الألوان والمسافات الخاصة بالأدمن

- [ ] **مكتبة Mantine** - التأكد من التثبيت والإعداد
  - **ارتباط التوثيق**: قواعد استخدام مكتبة Mantine
  - **المحتوى**: Button, Input, Select, Table, Card, Grid وغيرها

---

## 🔐 **نظام الصلاحيات والأمان**

### 🛡️ hooks الصلاحيات
- [ ] **useAdminPermissions.ts**
  - **مسار**: `src/hooks/useAdminPermissions.ts`
  - **ارتباط التوثيق**: نظام الصلاحيات في الكود
  - **ارتباط الموك**: admins.ts

- [ ] **middleware المصادقة**
  - **مسار**: `src/middleware/adminAuth.ts`
  - **ارتباط التوثيق**: التحقق من الصلاحيات
  - **ارتباط الموك**: admins.ts

---

## 📱 **التجاوب والأداء**

### 📐 إعدادات التجاوب
- [ ] **تحديث tailwind.config.ts** - إضافة breakpoints خاصة بالأدمن
- [ ] **إعدادات Grid للأدمن** - استخدام نظام Grid من Mantine
- [ ] **تحسين الأداء** - lazy loading للمكونات الكبيرة

---

## 🧪 **الاختبارات والتحقق**

### ✅ اختبارات الوحدة
- [ ] **اختبارات المكونات الأساسية**
- [ ] **اختبارات حسابات التسعير**
- [ ] **اختبارات نظام الصلاحيات**
- [ ] **اختبارات التكامل مع الموك**

---

## 📊 **إحصائيات التقدم**

### 📈 ملخص المهام:
- **إجمالي الملفات المطلوبة**: 134 ملف
- **ملفات الصفحات (Next.js)**: 89 ملف
- **المكونات (React)**: 45 مكون  
- **ملفات الموك الجديدة**: 16 ملف
- **ملفات CSS والتصميم**: 4 ملفات
- **ملفات الصلاحيات**: 2 ملف

### 🎯 توزيع الأولويات:
- **أولوية عالية**: 78 مهمة (58%)
- **أولوية متوسطة**: 42 مهمة (31%)  
- **أولوية منخفضة**: 14 مهمة (11%)

---

## ✅ **جدول متابعة المراحل**

| المرحلة | المهام | مكتملة | النسبة |
|---------|-------|--------|--------|
| البنية الأساسية | 5 | ☐ | 0% |
| Dashboard | 5 | ☐ | 0% |
| إدارة المستخدمين | 25 | ☐ | 0% |
| إدارة الخدمات | 15 | ☐ | 0% |
| التسعير والماليات | 18 | ☐ | 0% |
| إدارة المشاريع | 20 | ☐ | 0% |
| إدارة النظام | 8 | ☐ | 0% |
| التقارير والتحليلات | 6 | ☐ | 0% |
| الموك الجديد | 16 | ☐ | 0% |
| CSS والتصميم | 4 | ☐ | 0% |
| الصلاحيات والأمان | 2 | ☐ | 0% |
| التجاوب والأداء | 3 | ☐ | 0% |
| الاختبارات | 4 | ☐ | 0% |

---

## 🔗 **روابط مهمة**

- **📋 الملف المرجعي**: `SUPER_ADMIN_SCREENS_STRUCTURE.md`
- **💾 الموك الحالي**: `src/data/mock/` (18 ملف)
- **📊 تقرير التنفيذ**: `QUANTITY_SYSTEM_IMPLEMENTATION_REPORT.md`
- **🎯 المشاريع المرجعية**: 4 مشاريع بـ34 LineItem
- **💰 الفواتير المرجعية**: 4 فواتير بمبالغ حقيقية

---

## 📝 **ملاحظات التطوير**

### ⚠️ نقاط مهمة:
1. **نظام LineItems**: كل مشروع يحتوي على عدة بنود منفصلة
2. **الحسابات الدقيقة**: هامش 2.25× مطبق على كل بند
3. **المبالغ الحقيقية**: فواتير بقيم فعلية من السوق العراقي  
4. **الصلاحيات**: سوبر أدمن له صلاحيات كاملة، أدمن عادي محدود
5. **التصميم المركزي**: كل التخصيص في globals.css فقط

### 🎯 مبادئ التطوير:
- **Mantine حصرياً**: استخدام مكونات Mantine الأساسية فقط بدون أي تخصيص محلي
- **تخصيص مركزي**: كل التخصيص في globals.css وtokens.css حصرياً - ممنوع أي CSS خارجهما
- **مكونات مركبة محدودة**: إنشاء مكونات مركبة فقط للوظائف المعقدة، ليس للتصميم
- **ربط دقيق بالموك**: كل مكون يجب أن يرتبط بالملفات الصحيحة من الـ18 ملف الحالي والـ16 الجديد
- **صلاحيات صارمة**: تطبيق نظام الصلاحيات في كل صفحة (سوبر أدمن vs أدمن عادي)
- **دعم LineItems**: كل المكونات المالية والمشاريع يجب أن تدعم نظام الكمية المتقدم
- **لا تخصيص محلي**: ممنوع استخدام style props، CSS modules، styled-components، أو أي تخصيص خارج الملفات المركزية
- **اتباع القواعد الصارمة**: أي مخالفة للقواعد أعلاه ستؤدي لرفض العمل وإعادة التطوير

---

**آخر تحديث**: 30 أغسطس 2025  
**حالة المشروع**: جاهز للتطوير  
**المطور المسؤول**: علي جواد الربيعي  
**نوع المشروع**: منصة Depth - إدارة السوبر أدمن الشاملة
