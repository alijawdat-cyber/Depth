# 🖼️ شاشات العميل (Client UI)

## الفهرس
- [Onboarding + تسجيل/OTP](#client-onboarding)
- [Dashboard](#client-dashboard)
- [إنشاء طلب](#client-create-request)
- [تتبّع الطلب/المشروع](#client-tracking)
- [معاينة & موافقة (watermark للمعاينة)](#client-approve)
- [فواتير PDF (عرض فقط)](#client-invoices)
- [إعدادات الإشعارات (In-App/Email/SMS + fallback)](#client-notifications)

<a id="client-onboarding"></a>
## شاشة: Onboarding + تسجيل/OTP (Client)
- الخطوات (1→2→3): إدخال هاتف/إيميل → OTP → تفعيل.
- شنو يشوف/أزرار: حقل OTP، زر إعادة إرسال.
- حالات: pending/active/فشل OTP.
- صلاحيات: عام قبل تسجيل، بعدها client فقط.
- مراجع: OTP — `documentation/00-overview/00-introduction.md:110,635`; otpCodes — `documentation/02-database/01-database-schema.md:478`.
- حالة البيانات: status=user.active.

```text
+---------------------------+
| Register                  |
| email/phone  [        ]   |
|          [ Send OTP ]     |
| OTP        [      ] [↻]   |
|        [ Verify & Continue]|
+---------------------------+
```

<a id="client-dashboard"></a>
## شاشة: Dashboard (Client)
- الخطوات: فتح اللوحة → نظرة على المشاريع والطلبات.
- شنو يشوف/أزرار: إحصائيات، أحدث مشاريع، زر "إنشاء طلب".
- حالات: فارغ/تحميل/نجاح.
- مراجع: projects status — `documentation/02-database/01-database-schema.md:257–258`.
- حالة البيانات: يظهر مشاريع status in ['draft','pending','active']، isArchived=false.

```text
+--------------------------------------------------+
| Dashboard                                        |
| [ + إنشاء طلب ]                                 |
| Cards: Pending (3) | Active (2) | Completed (8) |
| Table: آخر المشاريع                              |
+--------------------------------------------------+
```

<a id="client-create-request"></a>
## شاشة: إنشاء طلب (Client)
- الخطوات (1→2→3): Category/Subcategory إلزامي → ProcessingLevel + Rush(off) → مرفقات → إرسال.
- أزرار: "إرسال الطلب"، Upload.
- حالات خاصة: فارغ/تحميل/نجاح/خطأ (حجم/نوع/كوتا).
- تحقق: Subcategory وProcessingLevel إلزامي.
- مراجع: request→project statuses — `documentation/02-database/01-database-schema.md:306`; lineItems fields — `documentation/02-database/01-database-schema.md:244–247`.
- حالة البيانات: status=pending ثم reviewing.

```text
[Category v][Subcategory v*]
[ProcessingLevel v] Rush: [ Off ]
[Description ≤1000]
[ + Files ]  [ Upload ]
[ إرسال الطلب ]
Banner: pending → reviewing
```

<a id="client-tracking"></a>
## شاشة: تتبّع الطلب/المشروع (Client)
- الخطوات: فتح الطلب → يشوف الحالة timeline.
- أزرار: لاشيء سوى إشعارات.
- حالات: فارغ/تحميل/نجاح.
- مراجع: projectRequests status — `documentation/02-database/01-database-schema.md:306`.
- حالة البيانات: status in ['pending','reviewing','approved','rejected'].

```text
Request #RQ-1029   Status: reviewing
[──── pending ────● reviewing ───── approved ○]
Notifications: In-App | Email
```

<a id="client-approve"></a>
## شاشة: المعاينة & الموافقة (Client)
- الخطوات: فتح المعرض → معاينة بالـwatermark (افتراضي) → موافقة/رفض.
- أزرار: "موافقة نهائية"، "طلب تعديل".
- حالات: Draft/Final.
- مراجع: التخزين 2GB/chunked/denylist/MIME/virus — `documentation/03-api/features/05-storage.md:88`; watermark إعداد قابل للتغيير.
- حالة البيانات: عند readyForReview، ثم completed عند الموافقة.

```text
Gallery (Preview - watermark: ON)
[ ◀ ] [ ▶ ]   [ تنزيل Preview ]  [ تنزيل Original ]
[ موافقة نهائية ]  [ طلب تعديل ]
Note: النهائي بدون watermark
```

<a id="client-invoices"></a>
## شاشة: فواتير PDF (عرض فقط V2.0)
- الخطوات: فتح الفاتورة → تنزيل PDF.
- أزرار: Download PDF.
- حالات: تحميل/فشل.
- مراجع: عرض الإجماليات فقط — `documentation/01-requirements/00-requirements-v2.0.md:160–168`; التقريب لأقرب 500 — `documentation/03-api/features/04-pricing.md:185`; أمثلة — `documentation/02-database/01-database-schema.md:636–638`.
- حالة البيانات: invoices مرتبطة بالمشاريع، isArchived لا يؤثر على الرؤية التاريخية.

```text
Invoice #INV-22014
Subtotal:    20,000
Tax:          2,000
Total:       22,000  (rounded to nearest 500)
[ Download PDF ]
```

<a id="client-notifications"></a>
## شاشة: إعدادات الإشعارات (Client)
- الخطوات: اختيار القنوات: In-App/Email/SMS.
- أزرار: حفظ التفضيلات.
- حالات: نجاح/فشل.
- مراجع: القنوات — `documentation/02-database/01-database-schema.md:426`; fallback — `documentation/02-database/02-indexes-and-queries.md:23–24,62`; نظرة — `documentation/00-overview/00-introduction.md:370`.
- سياسة fallback: فشل SMS → Email تلقائي.
- حالة البيانات: NotificationSettings لكل user.

```text
[✓] In-App   [✓] Email   [ ] SMS
[ حفظ ]
Hint: إذا فشل SMS يتحول تلقائياً إلى Email مع تسجيل السبب.
```
