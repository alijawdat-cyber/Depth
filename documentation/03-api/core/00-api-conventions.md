# اتفاقيات واجهة برمجة التطبيقات (API Conventions) - Final V2.0

> مصطلحات هذا المستند:
> - واجهة برمجة التطبيقات: Application Programming Interface — API
> - رمز ويب بصيغة JSON: JSON Web Token — JWT
> - التحكم بالوصول المعتمد على الأدوار: Role-Based Access Control — RBAC
> (انظر أيضًا: `99-reference/06-terminology-glossary-ar.md`)

Status: Final — aligned with V2.0 (آخر تحديث: 2025-08-24)

## إصدارات واجهة برمجة التطبيقات والمسار الأساسي (Versioning & Base)
- المسار الأساسي: `/api/v2` (مثال)
- التغييرات الدلالية تتطلب رفع إصدار فرعي/رئيسي وفق `VERSION-LOCK-V2.0.md`

## قواعد التسمية (Naming Conventions)
- Kebab-case للمسارات: `/auth/sign-in`, `/projects/{id}`
- camelCase لحقول JSON وخصائص النماذج والقيم (enums) بصيغة lowerCamel
- الجمع للمجموعات `/projects` والمفرد للموارد `/projects/{id}`

## رؤوس الطلبات المطلوبة (Required Headers)
```
Authorization: Bearer {firebase_id_token}
Content-Type: application/json
X-Platform: android|ios|web
X-App-Version: {semver}
X-Device-ID: {uuid}
```

## الأخطاء الموحدة (Unified Errors)
```json
{
  "success": false,
  "error": {
  "code": "AUTH_INVALID_TOKEN",
    "message": "Session expired",
    "details": {"retryAfter": 30}
  }
}
```
- ربط رموز الأخطاء في `03-api/core/04-error-handling.md`

## تقسيم الصفحات (Pagination)
- استعلام: `?page=1&limit=20`
- البيانات الوصفية للاستجابة: `{ "page": 1, "limit": 20, "total": 134 }`

## تحديد المعدل (Rate Limiting)
- رؤوس الاستجابة: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`
- انظر `02-rate-limiting.md`

## عدم التأثر بالتكرار (Idempotency) - عند الحاجة
- رأس: `Idempotency-Key: {uuid}` للـ POSTs القابلة للإعادة

## الأمان (Security)
- فرض فحوصات الأدوار/الصلاحيات وفق `99-reference/05-roles-matrix.md`
- تسجيل `X-Device-ID` والمنصة في جدول الجلسات
