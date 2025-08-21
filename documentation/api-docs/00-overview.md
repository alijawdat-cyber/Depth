# 📋 نظرة عامة على API - Depth v2.0
## منصة Depth للتطبيقات المحمولة والويب

---

## 🌐 معلومات عامة

### المنصة والنسخة
- **اسم المنصة**: Depth Creative Agency Platform
- **النسخة**: 2.0 (Final)
- **تاريخ الإنشاء**: 21 أغسطس 2025
- **نوع التطبيق**: Web + Mobile (Android + iOS)
- **اللغة الأساسية**: العربية (مع دعم الإنجليزية)

### عنوان الخادم الأساسي
```
Base URL: https://api.depth-agency.com/v2
Mobile API: https://api.depth-agency.com/v2/mobile
Admin API: https://api.depth-agency.com/v2/admin
```

### معايير التطوير
- **مبدأ REST**: جميع الـ APIs تتبع معايير RESTful
- **تشفير الاتصال**: HTTPS إجباري
- **تنسيق البيانات**: JSON
- **ترميز الأحرف**: UTF-8
- **المنطقة الزمنية**: UTC مع تحويل محلي للمستخدم

---

## 🔧 البيئة التقنية

### تقنيات الخادم الخلفي
```javascript
const techStack = {
  // قاعدة البيانات
  database: {
    primary: "Firebase Firestore",
    type: "NoSQL Document Store",
    realtime: "Firebase Realtime Database",
    search: "Algolia Search (مستقبلي)"
  },
  
  // المصادقة
  authentication: {
    provider: "Firebase Authentication",
    methods: ["Google OAuth", "Email/Password", "Phone/OTP"],
    customClaims: ["role", "status", "permissions"]
  },
  
  // التخزين
  storage: {
    files: "Cloudflare R2",
    cdn: "Cloudflare CDN",
    images: "Cloudflare Images",
    videos: "Cloudflare Stream"
  },
  
  // الإشعارات
  notifications: {
    push: "Firebase Cloud Messaging (FCM)",
    email: "Resend", // محرك البريد الإلكتروني الأساسي
    sms: "Firebase Phone Auth + MessageBird", // نظام هجين للـ SMS
    whatsapp: "Twilio Business API (مستقبلي)"
  },
  
  // المعالجة
  processing: {
    images: "Cloudflare Images Transform",
    videos: "Cloudflare Stream",
    thumbnails: "Auto-generated",
    watermarks: "Dynamic overlay"
  }
};
```

### معلومات الأمان
```javascript
const security = {
  ssl: "TLS 1.3",
  cors: "configured for allowed origins",
  rateLimit: "100 requests/minute per IP",
  authentication: "JWT tokens with Firebase",
  validation: "Joi schema validation",
  sanitization: "Input sanitization enabled"
};
```

### تكامل Cloudflare للمعالجة التلقائية

#### Cloudflare R2 للتخزين
```javascript
const cloudflareR2Config = {
  storage: {
    bucket: "depth-platform-storage",
    region: "auto",
    publicUrl: "https://cdn.depth-agency.com",
    features: [
      "automatic_backups",
      "global_distribution", 
      "zero_egress_fees",
      "s3_compatible_api"
    ]
  },
  
  imageTransforms: {
    thumbnails: {
      width: [150, 300, 600, 1200],
      format: "webp",
      quality: 85,
      fallback: "jpeg"
    },
    watermarks: {
      position: "bottom-right",
      opacity: 0.7,
      scale: 0.1
    },
    optimization: {
      autoCompress: true,
      stripMetadata: true,
      lossless: false
    }
  },
  
  videoStreaming: {
    provider: "Cloudflare Stream",
    features: [
      "adaptive_bitrate",
      "global_cdn",
      "thumbnail_generation",
      "video_analytics"
    ],
    formats: ["mp4", "hls", "dash"],
    resolutions: ["720p", "1080p", "4K"]
  }
};
```

---

## 📊 هيكل استجابة API

### استجابة ناجحة
```json
{
  "success": true,
  "data": {
    // البيانات المطلوبة
  },
  "message": "تم تنفيذ العملية بنجاح",
  "timestamp": "2025-08-21T14:30:00.000Z",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### استجابة خطأ
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "البيانات المدخلة غير صحيحة",
    "details": {
      "field": "email",
      "reason": "البريد الإلكتروني مطلوب"
    }
  },
  "timestamp": "2025-08-21T14:30:00.000Z"
}
```

---

## 🌐 دعم متعدد اللغات

### تحديد اللغة
جميع الطلبات تدعم تحديد اللغة عبر:
- **Header**: `Accept-Language: ar-IQ` أو `Accept-Language: en-US`
- **Query Parameter**: `?lang=ar` أو `?lang=en`

### الاستجابات متعددة اللغات
```json
{
  "success": true,
  "data": {
    "title": {
      "ar": "مشروع تصوير منتجات",
      "en": "Product Photography Project"
    },
    "description": {
      "ar": "تصوير احترافي لمنتجات المطعم",
      "en": "Professional photography for restaurant products"
    }
  },
  "message": {
    "ar": "تم إنشاء المشروع بنجاح",
    "en": "Project created successfully"
  }
}
```

---

## 📞 معلومات الدعم والاتصال

### معلومات الاتصال
- **الدعم الفني**: support@depth-agency.com
- **طوارئ النظام**: emergency@depth-agency.com  
- **وثائق المطورين**: https://docs.depth-agency.com
- **حالة النظام**: https://status.depth-agency.com

### أوقات الدعم
- **الدعم العادي**: الأحد - الخميس (9:00 ص - 6:00 م)
- **الطوارئ**: 24/7 للمشاكل الحرجة
- **المنطقة الزمنية**: بغداد (UTC+3)

### إصدار المواصفات
- **الإصدار**: 2.0
- **تاريخ التحديث**: 26 أغسطس 2025
- **التوافق**: يدعم الإصدارات 1.8+ للتطبيقات المحمولة

---

## 🔗 الملفات ذات الصلة

- [المصادقة والأمان](./01-authentication.md)
- [نظام المبدعين](./02-creators-api.md)
- [نظام العملاء](./03-clients-api.md)
- [إدارة المشاريع](./04-projects-api.md)
- [نظام التسعير](./05-pricing-api.md)
- [رفع الملفات](./06-files-api.md)
- [نظام الإشعارات](./07-notifications-api.md)
- [لوحة الأدمن](./08-admin-api.md)
- [تطبيقات الموبايل](./09-mobile-api.md)
- [نظام الموظفين](./10-employees-api.md)
- [Webhooks والتكاملات](./11-webhooks.md)
- [رموز الأخطاء](./12-error-codes.md)

---

*تم إنشاء هذا الملف كجزء من تجزئة وثيقة API الشاملة لمنصة Depth v2.0*
