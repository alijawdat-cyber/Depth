# 🖼️ شاشات الموظف براتب (Salaried Employee UI)

## الفهرس
- [شاشة: مهامي (Salaried)](#شاشة-مهامي-salaried)
- [شاشة: رفع ملفات (Salaried)](#شاشة-رفع-ملفات-salaried)
- [شاشة: تحديث حالة مهمة (Salaried)](#شاشة-تحديث-حالة-مهمة-salaried)

## شاشة: مهامي (Salaried)
- الشاشة/الدور: مهامي — Salaried
- الخطوات: عرض قائمة المهام.
- شنو يشوف/أزرار: جدول مهام مع تواريخ.
- حالات: فارغ/تحميل.
- التحقق: صلاحيات.
- البيانات/الـAPI: assignments (type: salaried) — `documentation/02-database/01-database-schema.md:250–259`.
- ملاحظات UI: ماكو أسعار.
- قبل/بعد: لا تغيير.

## شاشة: رفع ملفات (Salaried)
- الشاشة/الدور: رفع — Salaried
- الخطوات: اختيار ملفات كبيرة (chunked) → رفع.
- شنو يشوف/أزرار: شريط تقدم، ملاحظات أمان.
- حالات: حجم/نوع/كوتا/نجاح/فشل.
- التحقق: denylist + MIME sniffing + virus scanning.
- البيانات/الـAPI: سياسة الرفع — `documentation/03-api/features/05-storage.md:88`, `documentation/03-api/core/01-authentication.md:445–451`.
- ملاحظات UI: رسالة “لا تعرض الأسعار”.
- قبل/بعد: تثبيت السياسة الجديدة.

## شاشة: تحديث حالة مهمة (Salaried)
- الشاشة/الدور: تحديث — Salaried
- الخطوات: اختيار مهمة → تغيير status.
- شنو يشوف/أزرار: Dropdown حالة.
- حالات: نجاح/فشل.
- التحقق: الصلاحيات.
- البيانات/الـAPI: assignments.role/type — `documentation/02-database/01-database-schema.md:250–259`.
- ملاحظات UI: أظهر إشعار نجاح.
- قبل/بعد: لا تغيير.
