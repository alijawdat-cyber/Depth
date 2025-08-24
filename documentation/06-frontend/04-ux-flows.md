# ♻️ UX Flows – Depth V2.0

## الفهرس
- [فلو: إنشاء طلب (Client)](#فلو-إنشاء-طلب-client)
- [فلو: تحويل طلب إلى مشروع (Admin)](#فلو-تحويل-طلب-إلى-مشروع-admin)
- [فلو: تعيين مبدع/إعادة ترشيح (Admin)](#فلو-تعيين-مبدع-إعادة-ترشيح-admin)
- [فلو: إعداد عرض السعر (Admin→Client)](#فلو-إعداد-عرض-السعر-admin→client)
- [فلو: تنفيذ المشروع وتسليم (Creator→Client)](#فلو-تنفيذ-المشروع-وتسليم-creator→client)
- [فلو: مهام الموظف (SalariedEmployee)](#فلو-مهام-الموظف-salariedemployee)

## فلو: إنشاء طلب (Client)
- الخطوات (1→2→3): يختار Category/Subcategory → وصف اختياري + Rush (off) + ProcessingLevel → يرفع مرفقات ويضغط إرسال.
- تفريعات: Rush on/off.
- شنو يطلع بالشاشة: بانر تأكيد “تم استلام طلبك — الحالة: pending. لما الأدمن يفتح الطلب تصير reviewing”.
- الملفات المرجعية:
  - status: 'pending'|'reviewing' — `documentation/02-database/01-database-schema.md:306`
  - description اختياري + rush — `documentation/02-database/00-data-dictionary.md:200–240`

## فلو: تحويل طلب إلى مشروع (Admin)
- الخطوات: فتح طلب pending → مراجعة → تحويل إلى مشروع بدون تغيير subcategory → إنشاء lineItems.
- تفريعات: تعدد lineItems.
- شنو يطلع: رسالة “تم إنشاء المشروع”.
- مراجع: عدم تغيير subcategory — `documentation/03-api/features/03-projects.md:365`

## فلو: تعيين مبدع/إعادة ترشيح (Admin)
- الخطوات: تصفية حسب subcategoryId + processingLevel → اختيار مبدع → إذا رفض يعاد الترشيح تلقائياً.
- تفريعات: رفض/قبول.
- شنو يطلع: توست “تم التعيين/رفض — جاري إعادة الترشيح”.
- مراجع: الفلترة — `documentation/02-database/02-indexes-and-queries.md:1–120`, `documentation/03-api/features/01-creators.md:…`

## فلو: إعداد عرض السعر (Admin→Client)
- الخطوات: تثبيت الهامش → نشر Quote → يشوف العميل lineItemTotal + الإجمالي فقط.
- تفريعات: تعديل الهامش قبل النشر.
- شنو يطلع: “العرض جاهز”.
- مراجع: Quote للرؤية المحدودة — `documentation/03-api/features/03-projects.md:598`, `documentation/01-requirements/00-requirements-v2.0.md:160–168`

## فلو: تنفيذ المشروع وتسليم (Creator→Client)
- الخطوات: المبدع يرفع مسودّات/نهائي → العميل يوافق.
- تفريعات: Ready for Review.
- شنو يطلع: إشعارات In-App/Email.
- مراجع: Storage سياسة الرفع الكبيرة — `documentation/03-api/features/05-storage.md:88`, `documentation/03-api/core/01-authentication.md:445–451`

## فلو: مهام الموظف (SalariedEmployee)
- الخطوات: يشوف مهامه → يرفع ملفات → يحدث حالة المهمة.
- تفريعات: لا يرى الأسعار.
- شنو يطلع: حالات قائمة المهام.
- مراجع: لا يرى الأسعار — `documentation/99-reference/02-enums-standard.md:12–20`
