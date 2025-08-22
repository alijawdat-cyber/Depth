# 📘 المستند الرئيسي الموحّد (Master Document) - Depth V2.0 (مغلق)

هذا الملف يجمع العناصر الحرجة المعتمدة للإصدار 2.0 في مكان واحد للرجوع السريع. أي تغيير جوهري يتطلب الانتقال إلى 2.1 وفق `VERSION-LOCK-V2.0.md`.

## 1. نظرة عامة
منصة Depth لإدارة إنتاج المحتوى: تربط (الوكالة ← المبدعين ← العملاء ← الموظفين). تسعير ديناميكي بهامش وكالة 10–50%. دعم محتوى تصوير/فيديو/تصميم/مونتاج (والكتابة مؤجلة).

## 2. الأدوار الأساسية
- Admin: إدارة كاملة.
- Creator: مبدع فريلانسر.
- Client: إنشاء ومتابعة المشاريع.
- Salaried Employee: موظف لا يرى الأسعار.

## 3. دورة حياة المشروع (مختصرة)
Draft → Pending → Active → Completed / Cancelled.
Request (اختياري) يمكن تحويله إلى Project.

## 4. نموذج التسعير (المعادلات)
(من `99-reference/02-enums-standard.md` معادلات محسومة)
```
BaseCreatorPrice = BasePrice × OwnershipFactor × ProcessingMod × ExperienceMod × EquipmentMod
CreatorPrice = BaseCreatorPrice × RushMod + LocationAddition
ClientPrice = CreatorPrice + (CreatorPrice × AgencyMarginPercent)  // أو + AgencyMarginFixed
```
الحدود: AgencyMarginPercent بين 0.10 و 0.50.

## 5. التعدادات الرئيسية (ملخص)
خبرة: fresh | experienced | expert
معالجة: raw | basic | color_correction | full_retouch | advanced_composite
معدات: silver | gold | platinum
استعجال: normal | rush
موقع: studio | client | nearby | outskirts | far

## 6. حقول رئيسية (Project)
```
id, clientId, creatorId, categoryId, subcategoryId,
basePrice, processingMod, experienceMod, equipmentMod,
ownershipFactor, rushMod, locationAddition,
creatorPrice, agencyMarginPercent | agencyMarginFixed, clientPrice,
status, approvedBy, createdAt
```

## 7. سياسات أساسية
- لا هامش خارج 10–50%.
- لا تعديل في Enumerations داخل 2.0.
- لا إضافة فئة رئيسية جديدة (writing مؤجلة).
- صلاحيات RBAC مرجعية في ملف الأدوار (لاحق إضافة جدول رسمي).

## 8. الأمن (ملخص تطبيقي)
- Auth: Firebase + JWT (Access ~1h, Refresh ~30d).
- MFA اختياري (OTP SMS) للعمليات الحساسة.
- تشفير: AES-256 للحقول الحساسة، TLS 1.3 للنقل.
- تحديد معدل: طبقات تخص المصادقة والـ API العام والرفع.

## 9. البيانات (مبادئ)
- Firestore كمخزن أساسي.
- عدم تكرار محرّف المشروع عبر التجميع.
- Logs تشغيلية تحفظ 90 يوم.
- PII تعامل بالتشفير ومراقبة الوصول.

## 10. المخاطر (مختصر)
| الخطر | التخفيف |
|-------|---------|
| تسعير غير متسق | مصدر واحد للتعدادات + قفل الإصدار |
| تضارب أدوار | توحيد RBAC لاحقاً في Matrix |
| تسرب مفاتيح | Rotation + .env segregated |
| تضخم Firestore | فهارس مدروسة + أرشفة مستقبلية |

## 11. حدود الأداء المستهدفة
- استجابة API حساسة < 400ms (P95)
- رفع ملفات حتى 50MB (قابل للزيادة لاحقاً)
- توفر خدمة > 99% شهرياً

## 12. مسار فتح 2.1 (مؤشرات)
- إضافة writing كفئة رئيسية
- توسيع Webhooks رسمياً
- نموذج تسعير مركب (Margins tiers)

## 13. سلامة / بصمة مرجعية
عند اكتمال اعتماد كافة الملفات، يُولد Hash للملفات الأساسية ويضاف هنا.
```
راجع بصمة السلامة في: VERSION-LOCK-V2.0.md (الحقل INTEGRITY_SHA256)
```

## 14. نطاق المستند
يغطي: المتطلبات الجوهرية + التسعير + التعدادات + المبادئ الأمنية + دورة المشروع.
لا يغطي: تفاصيل التنفيذ البرمجي (انظر ملفات التطوير المنفصلة) أو سيناريوهات فشل متقدمة (سيضاف في Threat Model لاحقاً).

> آخر تحديث: 2025-08-21
