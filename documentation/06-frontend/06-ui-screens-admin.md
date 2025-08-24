# 🖼️ شاشات الأدمن (Admin UI)

## الفهرس
- [تسجيل/OTP + Dashboard](#admin-auth)
- [طلبات جديدة → تحويل لمشروع](#admin-requests)
- [تعيين مبدع/إعادة ترشيح](#admin-assign)
- [إعداد الهامش + إصدار Quote](#admin-quote)
- [لوحة المشاريع (lineItems + assignments + isArchived)](#admin-projects)
- [تقارير أولية (٣ تقارير)](#admin-reports)

<a id="admin-auth"></a>
## شاشة: تسجيل/OTP + Dashboard (Admin)
- الخطوات: تسجيل → OTP → دخول للوحة.
- أزرار: إرسال OTP، تحقق.
- حالات: pending/active.
- مراجع: OTP — `documentation/00-overview/00-introduction.md:110,635`؛ صلاحيات الأدمن — `documentation/02-database/01-database-schema.md:592–602`.

```text
[ email/phone ] [ Send OTP ]  OTP: [    ] [ Verify ]
Dashboard: بطاقات (طلبات جديدة، مشاريع نشطة)
```

<a id="admin-requests"></a>
## شاشة: الطلبات الجديدة → تحويل لمشروع (Admin)
- الخطوات: فتح pending → مراجعة → تحويل مشروع بدون تغيير subcategory.
- أزرار: "تحويل لمشروع".
- حالات: فارغ/تحميل/نجاح.
- مراجع: لا تغيّر subcategory — `documentation/02-database/01-database-schema.md:241`; lineItems — `documentation/02-database/01-database-schema.md:244–259`.

```text
Requests (status=pending)
#1029  subcategory=portrait/editing   [ فتح ] [ تحويل لمشروع ]
note: لا تغيّر Subcategory بعد التحويل
```

<a id="admin-assign"></a>
## شاشة: تعيين مبدع/إعادة ترشيح (Admin)
- الخطوات: فلترة subcategoryId + processingLevel + isAvailable → sort rating desc → تعيين.
- أزرار: Assign، Re-nominate.
- حالات: قبول/رفض.
- مراجع: فلاتر المؤشرات — `documentation/02-database/02-indexes-and-queries.md:74–84,94`; علاقات الربط — `documentation/02-database/01-database-schema.md:512–519`.

```text
[ subcategoryId v ] [ processingLevel v ] [ isAvailable: ✓ ]
Sort: rating ↓
Ali (4.8) [ Assign ]   Sara (4.6) [ Assign ]
[ Re-nominate ]
```

<a id="admin-quote"></a>
## شاشة: إعداد الهامش + إصدار Quote (Admin)
- الخطوات: أدخل Margin% (10–50) → Publish.
- عرض العميل: الإجماليات فقط.
- مراجع: التسعير والمعاملات — `documentation/02-database/01-database-schema.md:261–268,273`; rounding 500 — `documentation/03-api/features/04-pricing.md:185`.

```text
Creator Base: 15,730   (after mods + location)
Margin %: [ 30 ]
Client Total: 20,500   (rounded to 500)
[ Publish Quote ]
```

<a id="admin-projects"></a>
## شاشة: لوحة المشاريع (lineItems + assignments + isArchived)
- العرض: جدول بالمشاريع وخانات isArchived.
- أزرار: أرشفة/إلغاء.
- مراجع: lineItems/assignments/isArchived — `documentation/02-database/01-database-schema.md:244–259`.

```text
#ID    Client   Status     isArchived  Actions
p_12   cl_1     active     [ ]         [Open] [Archive]
p_13   cl_2     completed  [✓]         [Open] [Unarchive]
```

<a id="admin-reports"></a>
## شاشة: تقارير أولية (٣ تقارير)
- 1) ملخص المشاريع: أعداد حسب الحالة.
- 2) أداء المبدعين: rating, completedProjects.
- 3) نجاح الإشعارات: sent/delivered/read، وقنوات fallback.
- مراجع: حالات المشروع — `documentation/02-database/01-database-schema.md:257–258`; تقييمات — `documentation/02-database/01-database-schema.md:163,470`; إشعارات — `documentation/02-database/01-database-schema.md:419–447`.

```text
Reports
- Projects by Status: draft/pending/active/completed/cancelled
- Creators Performance: rating, totalReviews, completedProjects
- Notifications: by channel, fallback sms→email
```
