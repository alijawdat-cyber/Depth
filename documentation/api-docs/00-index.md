# 📚 فهرس شامل - Depth API v2.0 Documentation

---

## 📖 دليل التوثيق الكامل

### الملفات الأساسية
| الملف | الوصف | أهم الأقسام |
|-------|--------|-------------|
| [نظرة عامة](./00-overview.md) | مقدمة شاملة للمنصة والـ API | البنية العامة، أهداف المنصة، التقنيات المستخدمة |
| [المصادقة والأمان](./01-authentication.md) | أنظمة المصادقة والأدوار | Firebase Auth، JWT Tokens، نظام الصلاحيات |
| [نظام المبدعين](./02-creators-api.md) | إدارة ملفات المبدعين والتوفر | تسجيل المبدعين، إدارة المعدات، نظام التوفر |
| [نظام العملاء](./03-clients-api.md) | إدارة حسابات العملاء | تسجيل العملاء، طلبات المشاريع، إدارة الحسابات |
| [إدارة المشاريع](./04-projects-api.md) | دورة حياة المشاريع الكاملة | إنشاء المشاريع، تتبع التقدم، تسليم الملفات |
| [التسعير والفوترة](./05-pricing-api.md) | حساب التكاليف والدفع | نظام الهامش المتغير، العروض، الفواتير |
| [الملفات والتخزين](./06-storage-api.md) | رفع وإدارة الملفات | Cloudflare R2، معالجة الصور، الفيديو |
| [الإشعارات](./07-notifications-api.md) | النظام الشامل للإشعارات | Push Notifications، Email، SMS |
| [لوحة الأدمن](./08-admin-api.md) | أدوات الإدارة والتحكم | إدارة المستخدمين، الإحصائيات، التقارير |
| [المراسلة](./09-messaging-api.md) | نظام التواصل الداخلي | الرسائل، التعليقات، الملاحظات |
| [التكاملات](./10-integrations-api.md) | ربط الأنظمة الخارجية | وسائل التواصل، البنوك، الخدمات |
| [الحوكمة](./11-governance-api.md) | إدارة الجودة والمراجعة | مراجعة المشاريع، ضمان الجودة، التقييمات |
| [رموز الأخطاء](./12-error-codes.md) | دليل الأخطاء والحلول | تصنيف الأخطاء، رسائل واضحة، إجراءات الحل |
| [التقنيات المتقدمة](./13-advanced-technical.md) | المواضيع التقنية المتقدمة | Performance، Security، Scaling |

---

## 🏗️ المعايير الموحدة للتوثيق

### تنسيق التواريخ والأوقات
```json
{
  "standardDateFormat": "ISO 8601",
  "examples": {
    "createdAt": "2025-08-26T15:30:00.000Z",
    "updatedAt": "2025-08-26T15:30:00.000Z",
    "scheduledFor": "2025-08-28T09:00:00.000Z"
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
    "usdEquivalent": 1010.10,
    "exchangeRate": 1485,
    "rateUpdatedAt": "2025-08-26T12:00:00.000Z"
  }
}
```

---

## 🚀 أدلة الاستخدام السريع

### للمطورين الجدد
1. **ابدأ هنا**: [نظرة عامة](./00-overview.md)
2. **المصادقة**: [نظام المصادقة](./01-authentication.md)
3. **أول API call**: [إنشاء مشروع](./04-projects-api.md#إنشاء-مشروع-جديد)

### حسب نوع المستخدم
#### للمبدعين (Creators)
- [تسجيل مبدع جديد](./02-creators-api.md#تسجيل-مبدع-جديد-onboarding)
- [إدارة التوفر](./02-creators-api.md#إدارة-التوفر)
- [تسليم المشاريع](./04-projects-api.md#تسليم-المشاريع)

#### للعملاء (Clients)
- [تسجيل عميل جديد](./03-clients-api.md#تسجيل-عميل-جديد)
- [طلب مشروع](./03-clients-api.md#طلبات-المشاريع)
- [متابعة الفواتير](./05-pricing-api.md#الفوترة-والدفع)

#### للإدارة (Admins)
- [لوحة التحكم](./08-admin-api.md)
- [إدارة المستخدمين](./08-admin-api.md#إدارة-المستخدمين)
- [التقارير المالية](./05-pricing-api.md#التقارير-المالية)

### حسب المهمة
#### إدارة المشاريع
- [إنشاء مشروع](./04-projects-api.md#إنشاء-مشروع-جديد)
- [تتبع التقدم](./04-projects-api.md#تتبع-تقدم-المشروع)
- [معالجة المراجعات](./04-projects-api.md#نظام-المراجعات)

#### التعامل مع الملفات
- [رفع الملفات](./06-storage-api.md#رفع-الملفات)
- [معالجة الصور](./06-storage-api.md#معالجة-الصور)
- [إدارة الفيديو](./06-storage-api.md#معالجة-الفيديو)

#### النظام المالي
- [حساب الأسعار](./05-pricing-api.md#حساب-التكاليف)
- [إنشاء عروض الأسعار](./05-pricing-api.md#إدارة-العروض)
- [إدارة الفواتير](./05-pricing-api.md#الفوترة-والدفع)

---

## 🔍 فهرس المواضيع التفصيلي

### A-C
- **Authentication** → [المصادقة والأمان](./01-authentication.md)
- **Admin Panel** → [لوحة الأدمن](./08-admin-api.md)
- **API Keys** → [المصادقة والأمان](./01-authentication.md#رموز-المصادقة)
- **Availability Management** → [إدارة التوفر](./02-creators-api.md#إدارة-التوفر)
- **Billing** → [التسعير والفوترة](./05-pricing-api.md#الفوترة-والدفع)
- **Clients** → [نظام العملاء](./03-clients-api.md)
- **Cloudflare R2** → [الملفات والتخزين](./06-storage-api.md)
- **Creators** → [نظام المبدعين](./02-creators-api.md)

### D-F
- **Data Dictionary** → [قاموس البيانات](../data-dictionary-and-domain-model.md)
- **Error Codes** → [رموز الأخطاء](./12-error-codes.md)
- **FCM Notifications** → [الإشعارات](./07-notifications-api.md)
- **File Upload** → [الملفات والتخزين](./06-storage-api.md#رفع-الملفات)
- **Firebase Auth** → [المصادقة والأمان](./01-authentication.md)

### G-I
- **Governance** → [الحوكمة](./11-governance-api.md)
- **Google OAuth** → [تسجيل دخول عبر Google](./01-authentication.md#تسجيل-دخول-عبر-google)
- **Image Processing** → [معالجة الصور](./06-storage-api.md#معالجة-الصور)
- **Integrations** → [التكاملات](./10-integrations-api.md)
- **Invoicing** → [الفواتير](./05-pricing-api.md#الفوترة-والدفع)

### J-M
- **JWT Tokens** → [رموز المصادقة](./01-authentication.md#رموز-المصادقة)
- **Messaging** → [المراسلة](./09-messaging-api.md)

### N-P
- **Notifications** → [الإشعارات](./07-notifications-api.md)
- **OAuth** → [تسجيل دخول عبر Google](./01-authentication.md#تسجيل-دخول-عبر-google)
- **OTP Verification** → [التحقق من الهاتف](./01-authentication.md#نظام-التحقق-من-الهاتف-otp)
- **Permissions** → [أنواع الأدوار والصلاحيات](./01-authentication.md#أنواع-الأدوار-والصلاحيات)
- **Pricing** → [التسعير والفوترة](./05-pricing-api.md)
- **Projects** → [إدارة المشاريع](./04-projects-api.md)

### Q-S
- **Quotes** → [إدارة العروض](./05-pricing-api.md#إدارة-العروض)
- **Reports** → [التقارير المالية](./05-pricing-api.md#التقارير-المالية)
- **Roles** → [أنواع الأدوار والصلاحيات](./01-authentication.md#أنواع-الأدوار-والصلاحيات)
- **Security** → [أمان الملفات](./01-authentication.md#أمان-الملفات)
- **Storage** → [الملفات والتخزين](./06-storage-api.md)

### T-Z
- **Technical Advanced** → [التقنيات المتقدمة](./13-advanced-technical.md)
- **User Management** → [إدارة المستخدمين](./08-admin-api.md#إدارة-المستخدمين)
- **Video Processing** → [معالجة الفيديو](./06-storage-api.md#معالجة-الفيديو)
- **Webhooks** → [التكاملات](./10-integrations-api.md)

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
- **الأخطاء التقنية**: [التقنيات المتقدمة](./13-advanced-technical.md)
- **أخطاء في الأمثلة**: [رموز الأخطاء](./12-error-codes.md)
- **طلبات التحسين**: تواصل مع فريق التطوير

---

## 🔗 روابط سريعة

- [🏠 العودة للصفحة الرئيسية](../README.md)
- [📋 متطلبات النظام](../requirements-v2.0.md)
- [📊 قاموس البيانات](../data-dictionary-and-domain-model.md)
- [🔧 دليل API](./00-overview.md)

---

*تم إنشاء هذا الفهرس لتسهيل التنقل في توثيق Depth API v2.0 الشامل*
