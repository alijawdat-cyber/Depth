# ⚠️ رموز الأخطاء - Depth API v2.0

> SSOT — مصدر الحقيقة الوحيد (سياسة ورموز الأخطاء): هذا الملف يعد المرجع الرسمي ويُستشهد به عبر النظام.
> ✅ **تم إضافة شارة SSOT (2025-08-23):** تأكيد الدور المرجعي لهذا الملف في نظام معالجة الأخطاء

---

## المحتويات
- [هيكل الاستجابة للأخطاء](#هيكل-الاستجابة-للأخطاء)
- [رموز HTTP](#رموز-http)
- [رموز الأخطاء المخصصة](#رموز-الأخطاء-المخصصة)
- [أمثلة على الأخطاء](#أمثلة-على-الأخطاء)
- [معالجة الأخطاء](#معالجة-الأخطاء)

---

## هيكل الاستجابة للأخطاء

جميع الأخطاء تتبع هيكل موحد:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "رسالة الخطأ باللغة العربية",
    "messageEn": "Error message in English",
    "type": "validation|authentication|authorization|business|system",
    "field": "field_name", // للأخطاء المرتبطة بحقل محدد
    "details": {
      // تفاصيل إضافية حسب نوع الخطأ
    },
    "timestamp": "2025-09-02T20:00:00.000Z",
    "requestId": "req_123abc456def",
    "documentation": "https://docs.depth-agency.com/errors/ERROR_CODE"
  }
}
```

---

## رموز HTTP

### 400 - Bad Request
- **INVALID_REQUEST_FORMAT**: تنسيق الطلب غير صحيح
- **MISSING_REQUIRED_FIELD**: حقل مطلوب مفقود
- **INVALID_FIELD_VALUE**: قيمة الحقل غير صحيحة
- **VALIDATION_FAILED**: فشل في التحقق من صحة البيانات

### 401 - Unauthorized
- **AUTHENTICATION_REQUIRED**: المصادقة مطلوبة
- **INVALID_CREDENTIALS**: بيانات الاعتماد غير صحيحة
- **TOKEN_EXPIRED**: انتهت صلاحية الرمز المميز
- **TOKEN_INVALID**: الرمز المميز غير صحيح
- **SESSION_EXPIRED**: انتهت صلاحية الجلسة

### 403 - Forbidden
- **INSUFFICIENT_PERMISSIONS**: صلاحيات غير كافية
- **RESOURCE_ACCESS_DENIED**: الوصول للمورد مرفوض
- **ACCOUNT_SUSPENDED**: الحساب معلق
- **FEATURE_NOT_AVAILABLE**: الميزة غير متاحة

### 404 - Not Found
- **RESOURCE_NOT_FOUND**: المورد غير موجود
- **ENDPOINT_NOT_FOUND**: نقطة النهاية غير موجودة
- **USER_NOT_FOUND**: المستخدم غير موجود
- **PROJECT_NOT_FOUND**: المشروع غير موجود

### 409 - Conflict
- **RESOURCE_ALREADY_EXISTS**: المورد موجود بالفعل
- **CONCURRENT_MODIFICATION**: تعديل متزامن
- **STATE_CONFLICT**: تضارب في الحالة
- **DUPLICATE_ENTRY**: إدخال مكرر

### 422 - Unprocessable Entity
- **BUSINESS_LOGIC_ERROR**: خطأ في منطق العمل
- **INVALID_STATE_TRANSITION**: انتقال حالة غير صحيح
- **CONSTRAINT_VIOLATION**: انتهاك قيد
- **DEPENDENCY_ERROR**: خطأ في التبعية

### 429 - Too Many Requests
- **RATE_LIMIT_EXCEEDED**: تجاوز حد المعدل
- **QUOTA_EXCEEDED**: تجاوز الحصة
- **CONCURRENT_LIMIT_EXCEEDED**: تجاوز حد التزامن

### 500 - Internal Server Error
- **INTERNAL_SERVER_ERROR**: خطأ داخلي في الخادم
- **DATABASE_ERROR**: خطأ في قاعدة البيانات
- **EXTERNAL_SERVICE_ERROR**: خطأ في خدمة خارجية
- **UNEXPECTED_ERROR**: خطأ غير متوقع

### 502 - Bad Gateway
- **UPSTREAM_SERVICE_ERROR**: خطأ في الخدمة العلوية
- **CLOUDFLARE_ERROR**: خطأ في Cloudflare
- **FIREBASE_ERROR**: خطأ في Firebase

### 503 - Service Unavailable
- **SERVICE_MAINTENANCE**: صيانة الخدمة
- **SERVICE_OVERLOADED**: الخدمة محملة زائد
- **TEMPORARY_UNAVAILABLE**: غير متاح مؤقتاً

---

## رموز الأخطاء المخصصة

### أخطاء المصادقة (AUTH_*)

| الرمز | الرسالة | التفاصيل |
|------|---------|----------|
| `AUTH_INVALID_EMAIL` | البريد الإلكتروني غير صحيح | تنسيق البريد الإلكتروني غير صالح |
| `AUTH_WEAK_PASSWORD` | كلمة المرور ضعيفة | كلمة المرور لا تلبي متطلبات الأمان |
| `AUTH_EMAIL_NOT_VERIFIED` | البريد الإلكتروني غير محقق | يجب تأكيد البريد الإلكتروني أولاً |
| `AUTH_ACCOUNT_LOCKED` | الحساب مقفل | تم قفل الحساب بسبب محاولات فاشلة |
| `AUTH_MFA_REQUIRED` | المصادقة الثنائية مطلوبة | يجب استكمال المصادقة الثنائية |
| `AUTH_INVALID_OTP` | رمز التحقق غير صحيح | رمز OTP المدخل غير صالح |
| `AUTH_OTP_EXPIRED` | انتهت صلاحية رمز التحقق | انتهت صلاحية رمز OTP |
| `AUTH_TOO_MANY_ATTEMPTS` | محاولات كثيرة جداً | تجاوز عدد المحاولات المسموح |

### أخطاء المستخدمين (USER_*)

| الرمز | الرسالة | التفاصيل |
|------|---------|----------|
| `USER_NOT_FOUND` | المستخدم غير موجود | لا يوجد مستخدم بهذا المعرف |
| `USER_EMAIL_EXISTS` | البريد الإلكتروني موجود بالفعل | البريد مسجل لمستخدم آخر |
| `USER_PHONE_EXISTS` | رقم الهاتف موجود بالفعل | الرقم مسجل لمستخدم آخر |
| `USER_INCOMPLETE_PROFILE` | الملف الشخصي غير مكتمل | يجب استكمال البيانات المطلوبة |
| `USER_INVALID_ROLE` | الدور غير صحيح | الدور المحدد غير متاح |
| `USER_PERMISSION_DENIED` | الصلاحية مرفوضة | المستخدم لا يملك الصلاحية المطلوبة |

### أخطاء المشاريع (PROJECT_*)

| الرمز | الرسالة | التفاصيل |
|------|---------|----------|
| `PROJECT_NOT_FOUND` | المشروع غير موجود | لا يوجد مشروع بهذا المعرف |
| `PROJECT_INVALID_STATUS` | حالة المشروع غير صحيحة | لا يمكن تغيير الحالة الحالية |
| `PROJECT_CREATOR_BUSY` | المبدع مشغول | المبدع مشغول في مشاريع أخرى |
| `PROJECT_BUDGET_EXCEEDED` | تجاوز الميزانية | التكلفة تتجاوز الميزانية المحددة |
| `PROJECT_DEADLINE_INVALID` | الموعد النهائي غير صحيح | الموعد لا يلبي الحد الأدنى المطلوب |
| `PROJECT_EQUIPMENT_UNAVAILABLE` | المعدات غير متاحة | المعدات المطلوبة غير متوفرة |
| `PROJECT_LOCATION_INVALID` | الموقع غير صحيح | الموقع المحدد غير مدعوم |

### أخطاء المبدعين (CREATOR_*)

| الرمز | الرسالة | التفاصيل |
|------|---------|----------|
| `CREATOR_NOT_FOUND` | المبدع غير موجود | لا يوجد مبدع بهذا المعرف |
| `CREATOR_NOT_AVAILABLE` | المبدع غير متاح | المبدع غير متاح في التواريخ المطلوبة |
| `CREATOR_INCOMPLETE_ONBOARDING` | الانضمام غير مكتمل | يجب استكمال عملية الانضمام |
| `CREATOR_INSUFFICIENT_RATING` | التقييم غير كافي | تقييم المبدع أقل من المطلوب |
| `CREATOR_SKILL_MISMATCH` | عدم تطابق المهارات | مهارات المبدع لا تناسب المشروع |
| `CREATOR_PORTFOLIO_EMPTY` | المعرض فارغ | يجب إضافة أعمال للمعرض أولاً |

### أخطاء العملاء (CLIENT_*)

| الرمز | الرسالة | التفاصيل |
|------|---------|----------|
| `CLIENT_NOT_FOUND` | العميل غير موجود | لا يوجد عميل بهذا المعرف |
| `CLIENT_PAYMENT_FAILED` | فشل الدفع | لم تتم معالجة الدفعة بنجاح |
| `CLIENT_INSUFFICIENT_BALANCE` | الرصيد غير كافي | رصيد العميل غير كافي |
| `CLIENT_PAYMENT_METHOD_INVALID` | طريقة الدفع غير صحيحة | طريقة الدفع المحددة غير صالحة |
| `CLIENT_INVOICE_OVERDUE` | الفاتورة متأخرة | يوجد فواتير متأخرة الدفع |

### أخطاء الملفات (FILE_*)

| الرمز | الرسالة | التفاصيل |
|------|---------|----------|
| `FILE_NOT_FOUND` | الملف غير موجود | لا يوجد ملف بهذا المعرف |
| `FILE_TOO_LARGE` | الملف كبير جداً | حجم الملف يتجاوز الحد المسموح |
| `FILE_INVALID_TYPE` | نوع الملف غير صحيح | نوع الملف غير مدعوم |
| `FILE_UPLOAD_FAILED` | فشل رفع الملف | حدث خطأ أثناء رفع الملف |
| `FILE_PROCESSING_FAILED` | فشل معالجة الملف | حدث خطأ أثناء معالجة الملف |
| `FILE_VIRUS_DETECTED` | تم اكتشاف فيروس | الملف يحتوي على تهديد أمني |
| `FILE_QUOTA_EXCEEDED` | تجاوز حصة التخزين | تم تجاوز الحد المسموح للتخزين |

### أخطاء التسعير (PRICING_*)

| الرمز | الرسالة | التفاصيل |
|------|---------|----------|
| `PRICING_INVALID_PACKAGE` | الباقة غير صحيحة | الباقة المحددة غير متاحة |
| `PRICING_DISCOUNT_EXPIRED` | انتهت صلاحية الخصم | رمز الخصم منتهي الصلاحية |
| `PRICING_INVALID_DISCOUNT` | رمز الخصم غير صحيح | رمز الخصم غير صالح |
| `PRICING_CALCULATION_ERROR` | خطأ في حساب السعر | حدث خطأ أثناء حساب التكلفة |
| `PRICING_MINIMUM_NOT_MET` | الحد الأدنى غير محقق | المبلغ أقل من الحد الأدنى |

### أخطاء النظام (SYSTEM_*)

| الرمز | الرسالة | التفاصيل |
|------|---------|----------|
| `SYSTEM_MAINTENANCE` | النظام تحت الصيانة | النظام غير متاح حالياً للصيانة |
| `SYSTEM_OVERLOAD` | النظام محمل زائد | النظام يواجه حمولة عالية |
| `SYSTEM_DATABASE_ERROR` | خطأ في قاعدة البيانات | حدث خطأ في قاعدة البيانات |
| `SYSTEM_CACHE_ERROR` | خطأ في الذاكرة المؤقتة | حدث خطأ في نظام التخزين المؤقت |
| `SYSTEM_EXTERNAL_API_ERROR` | خطأ في خدمة خارجية | خدمة خارجية غير متاحة |

---

## أمثلة على الأخطاء

### مثال 1: خطأ في التحقق من صحة البيانات

**الطلب:**
```json
POST /api/creators/register
{
  "email": "invalid-email",
  "password": "123",
  "specialties": []
}
```

**الاستجابة (400):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "فشل في التحقق من صحة البيانات",
    "messageEn": "Validation failed",
    "type": "validation",
    "details": {
      "errors": [
        {
          "field": "email",
          "code": "AUTH_INVALID_EMAIL",
          "message": "البريد الإلكتروني غير صحيح",
          "messageEn": "Invalid email format"
        },
        {
          "field": "password",
          "code": "AUTH_WEAK_PASSWORD",
          "message": "كلمة المرور ضعيفة",
          "messageEn": "Password is too weak",
          "requirements": {
            "minLength": 8,
            "requireNumbers": true,
            "requireSpecialChars": true,
            "requireUppercase": true
          }
        },
        {
          "field": "specialties",
          "code": "MISSING_REQUIRED_FIELD",
          "message": "يجب تحديد تخصص واحد على الأقل",
          "messageEn": "At least one specialty is required"
        }
      ]
    },
    "timestamp": "2025-09-02T20:30:00.000Z",
    "requestId": "req_validation_001",
    "documentation": "https://docs.depth-agency.com/errors/VALIDATION_FAILED"
  }
}
```

### مثال 2: خطأ في الصلاحيات

**الطلب:**
```json
DELETE /api/admin/users/user_123
```

**الاستجابة (403):**
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "صلاحيات غير كافية",
    "messageEn": "Insufficient permissions",
    "type": "authorization",
    "details": {
      "requiredPermission": "users.delete",
      "userRole": "project_manager",
      "userPermissions": [
        "projects.create",
        "projects.edit",
        "projects.assign",
        "creators.view",
        "clients.view"
      ],
      "action": "delete_user",
      "resource": "user_123"
    },
    "timestamp": "2025-09-02T20:35:00.000Z",
    "requestId": "req_auth_002",
    "documentation": "https://docs.depth-agency.com/errors/INSUFFICIENT_PERMISSIONS"
  }
}
```

### مثال 3: خطأ في منطق العمل

**الطلب:**
```json
POST /api/projects/project_123/assign
{
  "creatorId": "creator_456"
}
```

**الاستجابة (422):**
```json
{
  "success": false,
  "error": {
    "code": "PROJECT_CREATOR_BUSY",
    "message": "المبدع مشغول في مشاريع أخرى",
    "messageEn": "Creator is busy with other projects",
    "type": "business",
    "details": {
      "creatorId": "creator_456",
      "creatorName": "فاطمة أحمد الصالح",
      "currentProjects": [
        {
          "id": "project_789",
          "title": "تصوير حفل زفاف",
          "status": "active",
          "deadline": "2025-09-05T18:00:00.000Z"
        },
        {
          "id": "project_101",
          "title": "تصوير منتجات تجارية",
          "status": "assigned",
          "startDate": "2025-09-03T09:00:00.000Z"
        }
      ],
      "availableFrom": "2025-09-06T09:00:00.000Z",
      "alternativeCreators": [
        {
          "id": "creator_789",
          "name": "أحمد محمد علي",
          "specialties": ["food_photography", "product_photography"],
          "rating": 4.8,
          "available": true
        }
      ]
    },
    "timestamp": "2025-09-02T20:40:00.000Z",
    "requestId": "req_business_003",
    "documentation": "https://docs.depth-agency.com/errors/PROJECT_CREATOR_BUSY"
  }
}
```

### مثال 4: خطأ في النظام

**الطلب:**
```json
GET /api/projects
```

**الاستجابة (503):**
```json
{
  "success": false,
  "error": {
    "code": "SYSTEM_DATABASE_ERROR",
    "message": "خطأ في قاعدة البيانات",
    "messageEn": "Database error",
    "type": "system",
    "details": {
      "service": "firestore",
      "errorType": "connection_timeout",
      "retryAfter": 30,
      "estimatedResolution": "2025-09-02T21:00:00.000Z",
      "statusPage": "https://status.depth-agency.com"
    },
    "timestamp": "2025-09-02T20:45:00.000Z",
    "requestId": "req_system_004",
    "documentation": "https://docs.depth-agency.com/errors/SYSTEM_DATABASE_ERROR"
  }
}
```

---

## معالجة الأخطاء

### الممارسات الأفضل للعملاء

#### 1. التحقق من رمز الحالة HTTP
```javascript
if (response.status >= 400) {
  const error = await response.json();
  handleError(error);
}
```

#### 2. معالجة الأخطاء بناءً على النوع
```javascript
function handleError(errorResponse) {
  const { error } = errorResponse;
  
  switch (error.type) {
    case 'validation':
      showValidationErrors(error.details.errors);
      break;
    case 'authentication':
      redirectToLogin();
      break;
    case 'authorization':
      showPermissionDeniedMessage();
      break;
    case 'business':
      showBusinessLogicError(error.message);
      break;
    case 'system':
      showSystemErrorMessage(error.details.retryAfter);
      break;
    default:
      showGenericError();
  }
}
```

#### 3. إعادة المحاولة الذكية
```javascript
async function apiCallWithRetry(url, options, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      if (response.ok) {
        return response;
      }
      
      const error = await response.json();
      
      // لا تعيد المحاولة للأخطاء التي لا يمكن إصلاحها
      if (error.error.type === 'validation' || 
          error.error.type === 'authorization') {
        throw error;
      }
      
      // إعادة المحاولة للأخطاء المؤقتة
      if (attempt < maxRetries && 
          (response.status === 503 || response.status === 502)) {
        await sleep(Math.pow(2, attempt) * 1000); // Exponential backoff
        continue;
      }
      
      throw error;
    } catch (networkError) {
      if (attempt === maxRetries) throw networkError;
      await sleep(Math.pow(2, attempt) * 1000);
    }
  }
}
```

#### 4. رسائل خطأ محلية
```javascript
const errorMessages = {
  ar: {
    'AUTH_INVALID_EMAIL': 'البريد الإلكتروني غير صحيح',
    'AUTH_WEAK_PASSWORD': 'كلمة المرور ضعيفة جداً',
    'PROJECT_NOT_FOUND': 'المشروع غير موجود',
    'SYSTEM_MAINTENANCE': 'النظام تحت الصيانة حالياً'
  },
  en: {
    'AUTH_INVALID_EMAIL': 'Invalid email address',
    'AUTH_WEAK_PASSWORD': 'Password is too weak',
    'PROJECT_NOT_FOUND': 'Project not found',
    'SYSTEM_MAINTENANCE': 'System is under maintenance'
  }
};

function getLocalizedMessage(code, language = 'ar') {
  return errorMessages[language][code] || 'حدث خطأ غير متوقع';
}
```

### إرشادات لفريق التطوير

#### 1. إنشاء أخطاء جديدة
```javascript
// استخدم مصنع الأخطاء
const createError = (code, httpStatus, message, details) => {
  return {
    code,
    httpStatus,
    message,
    messageEn: translations[code],
    type: getErrorType(code),
    details,
    timestamp: new Date().toISOString()
  };
};

// مثال
throw createError(
  'PROJECT_DEADLINE_INVALID',
  422,
  'الموعد النهائي يجب أن يكون خلال 7 أيام على الأقل',
  {
    providedDeadline: '2025-09-03T10:00:00.000Z',
    minimumDeadline: '2025-09-09T10:00:00.000Z',
    projectType: 'food_photography'
  }
);
```

#### 2. تسجيل الأخطاء
```javascript
logger.error('Database connection failed', {
  code: 'SYSTEM_DATABASE_ERROR',
  requestId: req.id,
  userId: req.user?.id,
  endpoint: req.path,
  method: req.method,
  timestamp: new Date().toISOString(),
  stack: error.stack
});
```

#### 3. مراقبة الأخطاء
- راقب معدلات الأخطاء لكل نقطة نهاية
- اعرض تنبيهات عند زيادة الأخطاء عن الحد الطبيعي
- حلل أنماط الأخطاء لتحسين النظام

---

## 🔗 الملفات ذات الصلة

- [نظرة عامة](../../00-overview/00-introduction.md)
- [المصادقة والأمان](./01-authentication.md)
- [الأمان والحوكمة](../admin/02-governance.md)
- [قاموس البيانات](../../02-database/00-data-dictionary.md)
- [متطلبات النظام](../../01-requirements/00-requirements-v2.0.md)

