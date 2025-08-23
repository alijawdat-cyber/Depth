# 🚀 نظرة عامة - Depth API v2.0

---

## 📋 المحتويات
- [مقدمة عن المنصة](#مقدمة-عن-المنصة)
- [الأهداف والرؤية](#الأهداف-والرؤية)
- [البنية التقنية](#البنية-التقنية)
- [المكونات الرئيسية](#المكونات-الرئيسية)
- [دليل البدء السريع](#دليل-البدء-السريع)
- [المعايير والمواصفات](#المعايير-والمواصفات)

---

## مقدمة عن المنصة

**Depth** هي منصة رقمية متكاملة لإدارة إنتاج المحتوى الإبداعي، تعمل كحلقة وصل بين:
- 🏢 **الوكالة**: المحرك الرئيسي لإدارة العمليات
- 🎨 **المبدعين**: مصورين ومصممين فريلانسرز
- 💼 **العملاء**: شركات من مختلف القطاعات
- 👥 **الموظفين**: فريق داخلي براتب ثابت

### الإصدار الحالي
- **Version**: V2.0
- **تاريخ الإصدار**: 2025-08-23
- **حالة API**: Production Ready
- **التوافق**: iOS 14+, Android 8+, Web Modern Browsers

---

## الأهداف والرؤية

### الرؤية
> "محتوى يحرّك النتائج — بسرعة، بهامش مضبوط، وقياس واضح"

### الأهداف الرئيسية
1. **أتمتة العمليات**: تقليل الوقت المطلوب لإدارة المشاريع بنسبة 70%
2. **ضمان الجودة**: نظام مراجعة متعدد المستويات
3. **الشفافية المالية**: تسعير واضح وعادل لجميع الأطراف
4. **النمو المستدام**: دعم توسع الوكالة والمبدعين

---

## البنية التقنية

### التقنيات المستخدمة

```javascript
const techStack = {
  backend: {
    runtime: "Node.js 18+",
    framework: "Next.js 14",
    language: "TypeScript",
    api: "RESTful + GraphQL (selective)"
  },
  database: {
    primary: "Firebase Firestore",
    cache: "Redis",
    analytics: "BigQuery"
  },
  storage: {
    files: "Cloudflare R2",
    cdn: "Cloudflare CDN",
    backup: "Google Cloud Storage"
  },
  authentication: {
    provider: "Firebase Auth",
    methods: ["Email/Password", "Google OAuth", "Phone OTP"],
    sessions: "JWT Tokens"
  },
  infrastructure: {
    hosting: "Vercel",
    domain: "depth-agency.com",
    monitoring: "Vercel Analytics + Custom Logging"
  }
};
```

### معمارية النظام

```
┌─────────────────────────────────────────────────────┐
│                   Client Apps                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐     │
│  │   iOS    │  │ Android  │  │  Web Portal  │     │
│  └────┬─────┘  └────┬─────┘  └──────┬───────┘     │
└───────┼─────────────┼───────────────┼──────────────┘
        │             │               │
        └─────────────┼───────────────┘
                      │
              ┌───────▼────────┐
              │   API Gateway   │
              │  (Next.js API)  │
              └───────┬────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
   ┌────▼────┐  ┌────▼────┐  ┌────▼────┐
   │Firebase │  │Cloudflare│  │External │
   │Services │  │    R2    │  │Services │
   └─────────┘  └──────────┘  └─────────┘
```

---

## المكونات الرئيسية

### 1. نظام المستخدمين
- **4 أدوار رئيسية**: Admin, Creator, Client, Employee
- **مصادقة متعددة**: Email, Google OAuth, Phone OTP
- **إدارة الصلاحيات**: Role-based Access Control (RBAC)

### 2. إدارة المشاريع
- **دورة حياة كاملة**: من الطلب حتى التسليم
- **تتبع مباشر**: Real-time updates
- **نظام المراحل**: Milestones & Deliverables

### 3. النظام المالي
- **تسعير ديناميكي**: هامش متغير 10-50%
- **فوترة آلية**: إنشاء وإرسال الفواتير
- **تتبع المدفوعات**: Multiple payment methods

### 4. إدارة المحتوى
- **رفع الملفات**: حتى 100MB للملف الواحد
- **معالجة آلية**: تحسين الصور والفيديو
- **معارض تفاعلية**: عرض احترافي للأعمال

---

## دليل البدء السريع

### 1. الحصول على مفتاح API
```bash
# للبيئة التطويرية
curl -X POST https://api.depth-agency.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@example.com","password":"SecurePass123","role":"developer"}'
```

### 2. المصادقة
```javascript
// مثال JavaScript/TypeScript
const response = await fetch('https://api.depth-agency.com/auth/signin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Platform': 'web',
  'X-App-Version': '{semver}'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { data } = await response.json();
const token = data.tokens.idToken;
```

### 3. أول طلب API
```javascript
// جلب المشاريع
const projects = await fetch('https://api.depth-agency.com/projects', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

---

## المعايير والمواصفات

### معايير الاستجابة

#### استجابة ناجحة
```json
{
  "success": true,
  "data": {
    // البيانات المطلوبة
  },
  "message": "رسالة نجاح بالعربية",
  "timestamp": "2025-08-26T15:30:00.000Z",
  "requestId": "req_123abc"
}
```

#### استجابة خطأ
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "وصف الخطأ بالعربية",
    "details": {
      // تفاصيل إضافية
    }
  },
  "timestamp": "2025-08-26T15:30:00.000Z",
  "requestId": "req_123abc"
}
```

### معدلات الطلبات (Rate Limiting)

| نوع المستخدم | الحد الأقصى | النافذة الزمنية |
|--------------|-------------|-----------------|
| غير مصادق | 60 طلب | دقيقة |
| مستخدم عادي | 600 طلب | دقيقة |
| مستخدم Premium | 1200 طلب | دقيقة |
| Admin | غير محدود | - |

### الأمان

#### Headers المطلوبة
```http
Authorization: Bearer {token}
Content-Type: application/json
X-Platform: android|ios|web
X-App-Version: {semver}
X-Device-ID: unique_device_id
X-Request-ID: unique_request_id (optional)
```

#### تشفير البيانات
- **النقل**: TLS 1.3
- **التخزين**: AES-256
- **كلمات المرور**: bcrypt (rounds: 10)
- **Tokens**: RS256 signed JWT

### حدود البيانات

| النوع | الحد الأقصى |
|-------|------------|
| حجم الطلب | 10MB |
| حجم الملف | 100MB |
| عدد الملفات/دفعة | 20 |
| طول النص | 5000 حرف |
| عمق JSON | 10 مستويات |

---

## البيئات المتاحة

### Production
- **URL**: `https://api.depth-agency.com`
- **Status**: ✅ Active
- **Version**: V2.0

### Staging
- **URL**: `https://staging-api.depth-agency.com`
- **Status**: ✅ Active
- **Version**: 2.1.0-beta

### Development
- **URL**: `http://localhost:3000/api`
- **Status**: Local only
- **Version**: Development

---

## الدعم والمساعدة

### قنوات الدعم
- **التوثيق**: [docs.depth-agency.com](https://docs.depth-agency.com)
- **البريد الإلكتروني**: support@depth-agency.com
- **Slack**: depth-dev.slack.com
- **GitHub Issues**: github.com/depth-agency/api/issues

### أوقات الاستجابة
- **Critical**: خلال ساعة
- **High**: خلال 4 ساعات
- **Medium**: خلال 24 ساعة
- **Low**: خلال 3 أيام عمل

---

## التحديثات والإصدارات

### سياسة الإصدارات
- **Major (X.0.0)**: تغييرات جذرية، قد تكسر التوافق
- **Minor (2.X.0)**: ميزات جديدة، متوافقة مع السابق
- **Patch (2.0.X)**: إصلاحات وتحسينات طفيفة

### جدول التحديثات
- **إصلاحات أمنية**: فورية
- **إصلاحات عادية**: أسبوعية (الثلاثاء)
- **ميزات جديدة**: شهرية (أول خميس)
- **إصدارات رئيسية**: ربع سنوية

---

## 🔗 الملفات ذات الصلة

- [المصادقة والأمان](../03-api/core/01-authentication.md)
- [نظام المبدعين](../03-api/features/01-creators.md)
- [نظام العملاء](../03-api/features/02-clients.md)
- [إدارة المشاريع](../03-api/features/03-projects.md)
- [رموز الأخطاء](../03-api/core/04-error-handling.md)
- [قاموس البيانات](../02-database/00-data-dictionary.md)

---

*آخر تحديث: 2025-08-23 | النسخة: V2.0 | الحالة: Production Ready*

# 📚 فهرس شامل - Depth API Documentation V2.0

� **نسبة التوافق الحالية: 100%** - تم حل جميع التعارضات

---

## 📋 الملفات الأساسية

### 🌟 نظرة عامة
- [`00-introduction.md`](./00-introduction.md) - النظرة العامة والمقدمة الشاملة
- [`02-database/00-data-dictionary.md`](../02-database/00-data-dictionary.md) - قاموس البيانات ونموذج النطاق
- [`01-requirements/00-requirements-v2.0.md`](../01-requirements/00-requirements-v2.0.md) - **المرجع الأساسي** لجميع المتطلبات

---

## 🔐 الأمان والمصادقة
- [`01-authentication.md`](../03-api/core/01-authentication.md) - نظام المصادقة والتسجيل
- [`02-governance.md`](../03-api/admin/02-governance.md) - الأمان والحوكمة والأدوار

---

## 👥 إدارة المستخدمين

### المبدعون (Freelance Creators)
- [`01-creators.md`](../03-api/features/01-creators.md) - **نظام المبدعين الفريلانسرز**
  - تسجيل وإعداد المبدعين الجدد (Onboarding)
  - إدارة المعدات والمهارات
  - نظام التوفر والجدولة

### الموظفون براتب ثابت
- [`08-salaried-employees.md`](../03-api/features/08-salaried-employees.md) - **نظام الموظفين براتب ثابت**
  - إدارة المهام الداخلية
  - عدم عرض الأسعار (ضمن الراتب)
  - التكامل مع نظام المشاريع

### العملاء
- [`02-clients.md`](../03-api/features/02-clients.md) - **نظام العملاء**
  - تسجيل العملاء وإدارة الملفات
  - طلبات المشاريع والفواتير

---

## 💼 إدارة الأعمال

### المشاريع
- [`03-projects.md`](../03-api/features/03-projects.md) - **إدارة المشاريع المتكاملة**
  - إنشاء المشاريع من طلبات العملاء
  - تعيين المبدعين الفريلانسرز **أو** الموظفين براتب ثابت
  - متابعة التقدم والتسليم

### التسعير والفوترة
- [`04-pricing.md`](../03-api/features/04-pricing.md) - **نظام التسعير الديناميكي**
  - ✅ **هامش متغير 10%-50%** (متوافق مع requirements)
  - ✅ **إضافات موقع ثابتة** (بدلاً من معاملات نسبية)
  - معادلات التسعير المُوحدة
---

## 🔧 الأنظمة التقنية

### التخزين والملفات
- [`05-storage.md`](../03-api/features/05-storage.md) - **إدارة الملفات والتخزين**
  - رفع ملفات المشاريع
  - معالجة الصور تلقائياً
  - التكامل مع Cloudflare

### التواصل والإشعارات
- [`06-notifications.md`](../03-api/features/06-notifications.md) - **نظام الإشعارات الشامل**
  - 4 قنوات: Push, Email, SMS, In-App
  - إشعارات ذكية حسب الدور
- [`07-messaging.md`](../03-api/features/07-messaging.md) - **نظام المراسلة**
  - محادثات المشاريع
  - الرسائل الجماعية

---

## ⚙️ الإدارة والتحكم

### لوحة الأدمن
- [`01-admin-panel.md`](../03-api/admin/01-admin-panel.md) - **لوحة تحكم الأدمن**
  - إحصائيات شاملة
  - إدارة المستخدمين
  - مراقبة النظام

### إدارة البذور (Seeds)
- [`03-seeds-management.md`](../03-api/admin/03-seeds-management.md) - **إدارة البيانات الأساسية**
  - الفئات الرئيسية والفرعية
  - الأسعار الأساسية
  - ربط الفئات بالمجالات
  - **🔒 أدمن فقط**

---

## 🔗 التكاملات الخارجية
- [`01-external-services.md`](../03-api/integrations/01-external-services.md) - **التكاملات**
  - Firebase Authentication
  - Cloudflare Storage  
  - وسائل الدفع الإلكتروني

---

## 📖 المراجع التقنية

### الأخطاء والمعالجة
- [`04-error-handling.md`](../03-api/core/04-error-handling.md) - **دليل الأخطاء الشامل**
  - رموز الأخطاء الموحدة
  - حلول للمشاكل الشائعة

### التقنيات المتقدمة
- [`03-advanced-technical.md`](../03-api/integrations/03-advanced-technical.md) - **الجوانب التقنية المتقدمة**
  - البنية التقنية
  - مراقبة الأداء
  - النشر والتحديث

---

## 🎯 التوافق والاتساق

### ✅ التحسينات المطبقة:

1. **وحدة المصطلحات:**
   - "مبدع (Creator)" بدلاً من خليط فريلانسر/مبدع
   - "موظف براتب ثابت (Salaried Employee)" محدد بوضوح

2. **حل التعارضات:**
   - ✅ هامش الوكالة موحد: **10% إلى 50%**
   - ✅ معاملات الموقع: **إضافات ثابتة** بدلاً من نسبية
   - ✅ معادلات التسعير متوافقة 100%

3. **التكامل المحسن:**
   - 🔗 ربط الموظفين براتب ثابت مع نظام المشاريع
   - 🔗 تكامل نظام البذور مع التسعير
   - 🔗 إشارات متبادلة بين جميع الأنظمة

4. **الأمثلة العراقية:**
   - 🇮🇶 أسماء عراقية واقعية
   - 🇮🇶 أمثلة شركات محلية  
   - 🇮🇶 عناوين وأرقام هواتف عراقية

---

## � دليل التنقل السريع

### حسب نوع المستخدم:

**👨‍💼 أدمن الوكالة:**
- [`01-admin-panel.md`](../03-api/admin/01-admin-panel.md) - لوحة التحكم
- [`03-seeds-management.md`](../03-api/admin/03-seeds-management.md) - إدارة البذور
- [`04-pricing.md`](../03-api/features/04-pricing.md) - تحديد الهوامش

**🎨 مبدع فريلانسر:**
- [`01-creators.md`](../03-api/features/01-creators.md) - إدارة الملف الشخصي
- [`03-projects.md`](../03-api/features/03-projects.md) - استلام المشاريع

**👷 موظف راتب ثابت:**
- [`08-salaried-employees.md`](../03-api/features/08-salaried-employees.md) - إدارة المهام
- [`03-projects.md`](../03-api/features/03-projects.md) - تنفيذ المهام

**🏢 عميل:**
- [`02-clients.md`](../03-api/features/02-clients.md) - إدارة الحساب
- [`03-projects.md`](../03-api/features/03-projects.md) - طلب مشاريع

---

## 📊 إحصائيات التوثيق

- **إجمالي الملفات:** 16 ملف
- **نسبة التوافق:** 100% ✅
- **التعارضات المحلولة:** 3/3 ✅
- **الأمثلة العراقية:** متوفرة ✅
- **المصطلحات موحدة:** نعم ✅

---

**آخر تحديث:** 2025-08-21  
**الحالة:** مكتمل ومتوافق 100% ✅
  },
  "timezone": "UTC (جميع التواريخ)",
  "localDisplay": "يتم التحويل في العميل حسب التوقيت المحلي"
}
```

### تنسيق الأرقام التعريفية (IDs)
```json
{
  "idPatterns": {
    "user": "u_[6-char-base62]",
    "creator": "c_[6-char-base62]", 
    "client": "cl_[6-char-base62]",
    "project": "p_[6-char-base62]",
    "employee": "e_[6-char-base62]",
    "invoice": "inv_[6-char-base62]",
    "quote": "quote_[6-char-base62]",
    "message": "msg_[6-char-base62]",
    "notification": "notif_[6-char-base62]"
  },
  "examples": {
    "userIds": ["u_123abc", "u_789xyz"],
    "creatorIds": ["c_456def", "c_123ghi"],
    "clientIds": ["cl_789abc", "cl_456def"],
    "projectIds": ["p_123xyz", "p_789abc"]
  }
}
```

### تنسيق الاستجابات الموحد
```json
{
  "successResponse": {
    "success": true,
    "data": { /* المحتوى الأساسي */ },
    "message": "رسالة واضحة بالعربية",
    "timestamp": "2025-08-26T15:30:00.000Z",
    "meta": { /* معلومات إضافية إن وُجدت */ }
  },
  "errorResponse": {
    "success": false,
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "رسالة الخطأ بالعربية",
      "details": { /* تفاصيل إضافية */ }
    },
    "timestamp": "2025-08-26T15:30:00.000Z"
  }
}
```

### تنسيق بيانات المستخدمين
```json
{
  "userDataStandard": {
    "id": "u_123abc",
    "name": "الاسم الكامل بالعربية",
    "email": "email@example.com",
    "phone": "07XXXXXXXXX",
    "avatar": "https://cdn.cloudflare.com/avatars/filename.jpg",
    "role": "creator|client|admin|employee",
    "status": "active|inactive|pending|suspended",
    "createdAt": "2025-08-26T15:30:00.000Z",
    "updatedAt": "2025-08-26T15:30:00.000Z",
    "lastActiveAt": "2025-08-26T15:30:00.000Z"
  }
}
```

### تنسيق الأموال والعملات
```json
{
  "currencyStandard": {
    "baseCurrency": "IQD",
    "amount": 1500000,
    "formattedAmount": "1,500,000 IQD",
    "rateUpdatedAt": "2025-08-26T12:00:00.000Z"
  }
}
```

---

## 🚀 أدلة الاستخدام السريع

### للمطورين الجدد
1. **ابدأ هنا**: [نظرة عامة](./00-introduction.md)
2. **المصادقة**: [نظام المصادقة](../03-api/core/01-authentication.md)
3. **أول API call**: [إنشاء مشروع](../03-api/features/03-projects.md#إنشاء-مشروع-جديد)

### حسب نوع المستخدم
#### للمبدعين (Creators)
- [تسجيل مبدع جديد](../03-api/features/01-creators.md#تسجيل-مبدع-جديد-onboarding)
- [إدارة التوفر](../03-api/features/01-creators.md#إدارة-التوفر)
- [تسليم المشاريع](../03-api/features/03-projects.md#تسليم-المشاريع)

#### للعملاء (Clients)
- [تسجيل عميل جديد](../03-api/features/02-clients.md#تسجيل-عميل-جديد)
- [طلب مشروع](../03-api/features/02-clients.md#طلبات-المشاريع)
- [متابعة الفواتير](../03-api/features/04-pricing.md#الفوترة-والدفع)

#### للإدارة (Admins)
- [لوحة التحكم](../03-api/admin/01-admin-panel.md)
- [إدارة المستخدمين](../03-api/admin/01-admin-panel.md#إدارة-المستخدمين)
- [التقارير المالية](../03-api/features/04-pricing.md#التقارير-المالية)

### حسب المهمة
#### إدارة المشاريع
- [إنشاء مشروع](../03-api/features/03-projects.md#إنشاء-مشروع-جديد)
- [تتبع التقدم](../03-api/features/03-projects.md#تتبع-تقدم-المشروع)
- [معالجة المراجعات](../03-api/features/03-projects.md#نظام-المراجعات)

#### التعامل مع الملفات
- [رفع الملفات](../03-api/features/05-storage.md#رفع-الملفات)
- [معالجة الصور](../03-api/features/05-storage.md#معالجة-الصور)
- [إدارة الفيديو](../03-api/features/05-storage.md#معالجة-الفيديو)

#### النظام المالي
- [حساب الأسعار](../03-api/features/04-pricing.md#حساب-التكاليف)
- [إنشاء عروض الأسعار](../03-api/features/04-pricing.md#إدارة-العروض)
- [إدارة الفواتير](../03-api/features/04-pricing.md#الفوترة-والدفع)

---

## 🔍 فهرس المواضيع التفصيلي

### A-C
- **Authentication** → [المصادقة والأمان](../03-api/core/01-authentication.md)
- **Admin Panel** → [لوحة الأدمن](../03-api/admin/01-admin-panel.md)
- **API Keys** → [المصادقة والأمان](../03-api/core/01-authentication.md#رموز-المصادقة)
- **Availability Management** → [إدارة التوفر](../03-api/features/01-creators.md#إدارة-التوفر)
- **Billing** → [التسعير والفوترة](../03-api/features/04-pricing.md#الفوترة-والدفع)
- **Clients** → [نظام العملاء](../03-api/features/02-clients.md)
- **Cloudflare R2** → [الملفات والتخزين](../03-api/features/05-storage.md)
- **Creators** → [نظام المبدعين](../03-api/features/01-creators.md)

### D-F
- **Data Dictionary** → [قاموس البيانات](../02-database/00-data-dictionary.md)
- **Error Codes** → [رموز الأخطاء](../03-api/core/04-error-handling.md)
- **FCM Notifications** → [الإشعارات](../03-api/features/06-notifications.md)
- **File Upload** → [الملفات والتخزين](../03-api/features/05-storage.md#رفع-الملفات)
- **Firebase Auth** → [المصادقة والأمان](../03-api/core/01-authentication.md)

### G-I
- **Governance** → [الحوكمة](../03-api/admin/02-governance.md)
- **Google OAuth** → [تسجيل دخول عبر Google](../03-api/core/01-authentication.md#تسجيل-دخول-عبر-google)
- **Image Processing** → [معالجة الصور](../03-api/features/05-storage.md#معالجة-الصور)
- **Integrations** → [التكاملات](../03-api/integrations/01-external-services.md)
- **Invoicing** → [الفواتير](../03-api/features/04-pricing.md#الفوترة-والدفع)

### J-M
- **JWT Tokens** → [رموز المصادقة](../03-api/core/01-authentication.md#رموز-المصادقة)
- **Messaging** → [المراسلة](../03-api/features/07-messaging.md)

### N-P
- **Notifications** → [الإشعارات](../03-api/features/06-notifications.md)
- **OAuth** → [تسجيل دخول عبر Google](../03-api/core/01-authentication.md#تسجيل-دخول-عبر-google)
- **OTP Verification** → [التحقق من الهاتف](../03-api/core/01-authentication.md#نظام-التحقق-من-الهاتف-otp)
- **Permissions** → [أنواع الأدوار والصلاحيات](../03-api/core/01-authentication.md#أنواع-الأدوار-والصلاحيات)
- **Pricing** → [التسعير والفوترة](../03-api/features/04-pricing.md)
- **Projects** → [إدارة المشاريع](../03-api/features/03-projects.md)

### Q-S
- **Quotes** → [إدارة العروض](../03-api/features/04-pricing.md#إدارة-العروض)
- **Reports** → [التقارير المالية](../03-api/features/04-pricing.md#التقارير-المالية)
- **Roles** → [أنواع الأدوار والصلاحيات](../03-api/core/01-authentication.md#أنواع-الأدوار-والصلاحيات)
- **Security** → [أمان الملفات](../03-api/core/01-authentication.md#أمان-الملفات)
- **Storage** → [الملفات والتخزين](../03-api/features/05-storage.md)

### T-Z
- **Technical Advanced** → [التقنيات المتقدمة](../03-api/integrations/03-advanced-technical.md)
- **User Management** → [إدارة المستخدمين](../03-api/admin/01-admin-panel.md#إدارة-المستخدمين)
- **Video Processing** → [معالجة الفيديو](../03-api/features/05-storage.md#معالجة-الفيديو)
- **Webhooks** → [التكاملات](../03-api/integrations/02-webhooks.md)

---

## 📊 إحصائيات التوثيق

| المقياس | القيمة |
|---------|--------|
| إجمالي الملفات | 14 ملف |
| إجمالي الـ APIs | 180+ endpoint |
| نسبة التغطية | 100% |
| اللغة الرئيسية | العربية |
| اللغة الثانوية | English |
| آخر تحديث | 2025-08-26 |
| نسبة التحديث الأسبوعي | 95% |

---

## 🤝 المساهمة في التوثيق

### لتحديث التوثيق:
1. اتبع [المعايير الموحدة](#🏗️-المعايير-الموحدة-للتوثيق) المذكورة أعلاه
2. استخدم أمثلة واقعية مع بيانات عربية
3. تأكد من تحديث جميع الملفات المرتبطة
4. اختبر جميع الأمثلة قبل النشر

### للإبلاغ عن مشاكل:
- **الأخطاء التقنية**: [التقنيات المتقدمة](../03-api/integrations/03-advanced-technical.md)
- **أخطاء في الأمثلة**: [رموز الأخطاء](../03-api/core/04-error-handling.md)
- **طلبات التحسين**: تواصل مع فريق التطوير

---

## 🔗 روابط سريعة

- [🏠 العودة للصفحة الرئيسية](../README.md)
- [📋 متطلبات النظام](../01-requirements/00-requirements-v2.0.md)
- [📊 قاموس البيانات](../02-database/00-data-dictionary.md)
- [🔧 دليل API](./00-introduction.md)

---

*تم إنشاء هذا الفهرس لتسهيل التنقل في توثيق Depth API v2.0 الشامل*