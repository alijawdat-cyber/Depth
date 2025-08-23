# 🔗 خريطة الروابط القديمة → الجديدة (Legacy Link Mapping)

هذا الملف يهدف للحفاظ على التوافق المرجعي مع أي مستندات أو ملاحظات خارجية قديمة تشير إلى أسماء ملفات لم تعد موجودة في الهيكل الحالي.

## سياسة
- لا تُنشأ ملفات جديدة بالأسماء القديمة إلا عند الضرورة القصوى.
- التفضيل: تحديث الروابط في المستندات الحالية.
- عند الحاجة المؤقتة: يمكن إنشاء Stub في مجلد `_link-aliases/` لاحقاً.

| الاسم القديم (Legacy) | الملف الحالي الصحيح | ملاحظات |
|------------------------|----------------------|---------|
| 02-creators-api.md | 03-api/features/01-creators.md | تم إعادة التنظيم تحت features |
| 02b-salaried-employees-api.md | 03-api/features/08-salaried-employees.md | لاحقة b أزيلت |
| 04-projects-api.md | 03-api/features/03-projects.md | توحيد رقم التسلسل |
| 05-pricing-api.md | 03-api/features/04-pricing.md | تسعير ضمن features |
| 14-seeds-management-api.md | 03-api/admin/03-seeds-management.md | نقل إلى admin |
| data-dictionary-and-domain-model.md | 02-database/00-data-dictionary.md | تم الدمج في ملف موحد |

## توصيات تطبيق
1. إجراء بحث شامل عن الأسماء القديمة واستبدالها بالمسارات الجديدة.
2. تشغيل Link Checker بعد الإصلاح.
3. إن وُجد استهلاك خارجي (مثلاً URL منشور): إنشاء Stub إعادة توجيه.

## فحص مستقبلي (Example Script فكرة)
```bash
# pseudo
rg '02-creators-api.md|02b-salaried-employees-api.md|04-projects-api.md|05-pricing-api.md|14-seeds-management-api.md|data-dictionary-and-domain-model.md' documentation/
```

> آخر تحديث: 2025-08-23
