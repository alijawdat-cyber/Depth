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
- **Version**: 2.0.1
- **تاريخ الإصدار**: 2025-08-21
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
    'X-App-Version': '2.0.1'
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
X-App-Version: 2.0.1
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
- **Version**: 2.0.1

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

- [الفهرس الشامل](./00-index.md)
- [المصادقة والأمان](./01-authentication.md)
- [نظام المبدعين](./02-creators-api.md)
- [نظام العملاء](./03-clients-api.md)
- [إدارة المشاريع](./04-projects-api.md)
- [رموز الأخطاء](./12-error-codes.md)
- [قاموس البيانات](../data-dictionary-and-domain-model.md)

---

*آخر تحديث: 2025-08-21 | النسخة: 2.0.1 | الحالة: Production Ready*