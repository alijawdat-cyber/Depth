# 🛡️ مصفوفة الأدوار والصلاحيات (RBAC Matrix) - V2.0

هذا الملف هو المرجع الرسمي لصلاحيات الأدوار في الإصدار 2.0. أي تعديل جوهري يتطلب إصدار 2.1.

## 1. الأدوار
| الدور | الوصف | ملاحظات |
|-------|-------|---------|
| super_admin | مدير النظام الرئيسي | وصول شامل + إدارة أدمنز |
| admin | مدير عادي | وصول إداري (بدون إدارة أدمنز) |
| creator | مبدع فريلانسر | وصول مقيد بمشاريعه |
| client | عميل | ينشئ الطلبات ويتابعها |
| salariedEmployee | موظف براتب | لا يرى الأسعار |

## 2. نطاقات الموارد (Resources)
| المورد | الوصف |
|--------|-------|
| users | حسابات المستخدمين |
| creators | بيانات المبدعين |
| clients | بيانات العملاء |
| projects | المشاريع النشطة |
| projectRequests | طلبات المشاريع الأولية |
| pricing | معادلات ونتائج التسعير |
| seeds | الفئات والفئات الفرعية والأسعار الأساسية |
| notifications | الإشعارات |
| messages | المراسلة |
| files | إدارة الملفات |
| system | إعدادات عامة / مراقبة |

## 3. عمليات قياسية (Actions)
CRUD مبسطة:
| الفعل | المعنى |
|-------|--------|
| read | قراءة |
| create | إنشاء |
| update | تعديل |
| delete | حذف منطقي/أرشفة |
| approve | موافقة / اعتماد |
| assign | إسناد موارد |
| upload | رفع ملفات |

## 4. جدول الصلاحيات (مبسّط)
| Resource → Role ↓ | super_admin | admin | creator | client | salariedEmployee |
|-------------------|-------------|-------|---------|--------|------------------|
| users.read | ✔ | ✔ | ✖ | ✖ | ✖ |
| users.update (self) | ✔ | ✔ | ✔ (ذاتياً) | ✔ (ذاتياً) | ✔ (ذاتياً) |
| admins.create | ✔ | ✖ | ✖ | ✖ | ✖ |
| admins.read | ✔ | ✔ | ✖ | ✖ | ✖ |
| creators.read | ✔ | ✔ | ✔ (ذاتياً/معلنة) | ✖ | ✖ |
| creators.update | ✔ | ✔ | ✔ (ذاتياً) | ✖ | ✖ |
| clients.read | ✔ | ✔ | ✖ | ✔ (ذاتياً) | ✖ |
| clients.create | ✔ | ✔ | ✖ | ✔ | ✖ |
| projects.create | ✔ | ✔ | ✖ | ✔ (بعد اعتماد) | ✖ |
| projects.read | ✔ | ✔ | ✔ (مُسندة) | ✔ (مملوكة) | ✔ (مُسندة) |
| projects.update | ✔ | ✔ (نطاق التنفيذ) | محدود (تعليقات) | ✔ (نطاق التنفيذ) |
| projects.approve | ✔ | ✖ | ✖ | ✖ |
| pricing.read | ✔ | ✔ (بعد الموافقة) | ✔ (فقط ClientPrice) | ✖ |
| pricing.update | ✔ | ✖ | ✖ | ✖ |
| seeds.read | ✔ | ✖ | ✖ | ✖ |
| seeds.update | ✔ | ✖ | ✖ | ✖ |
| notifications.read | ✔ | ✔ (مُخصّصة) | ✔ (مُخصّصة) | ✔ (مُخصّصة) |
| messages.read | ✔ | ✔ (محادثات مشارك) | ✔ (محادثات مشارك) | ✔ (محادثات مشارك) |
| messages.create | ✔ | ✔ | ✔ | ✔ |
| files.upload | ✔ | ✔ (حسب السياق) | ✔ (مخرجات/مرفقات) | ✔ (حسب الدور) |
| system.monitor | ✔ | ✖ | ✖ | ✖ |

## 5. قواعد خاصة
1. المبدع لا يرى `creatorPrice` حتى اعتماد المشروع.
2. الموظف براتب ثابت لا يرى أي أسعار (`creatorPrice`, `clientPrice`).
3. العميل لا يرى `agencyMarginPercent` بل فقط السعر النهائي.
4. حذف (delete) = أرشفة منطقية (soft delete) إن أمكن.
5. جميع العمليات الحساسة (approve / pricing.update) تُسجل في سجل تدقيق (Audit Log).

## 6. أحداث تتطلب تسجيل تدقيق (Audit Events)
| الحدث | من يشغله | وصف |
|-------|----------|-----|
| PROJECT_APPROVED | admin | اعتماد مشروع |
| PRICE_OVERRIDE | admin | تعديل هامش يدوي |
| CREATOR_APPROVED | admin | اعتماد مبدع جديد |
| CLIENT_APPROVED | admin | اعتماد عميل |
| ROLE_CHANGED | admin | تغيير دور مستخدم |
| SEED_MODIFIED | admin | تعديل فئة/سعر أساسي |

## 7. نموذج JSON للصلاحيات (مثال)
```json
{
  "role": "creator",
  "permissions": [
    "profile:update:self",
    "projects:read:assigned",
    "projects:update:assigned:limited",
    "pricing:read:after-approval",
    "files:upload:scoped",
    "messages:read:participant",
    "messages:create:participant"
  ]
}
```

## 8. سياسة التعديل
- أي توسيع في الصلاحيات = إصدار 2.1 إلا إذا كان توضيحاً لا يغير السلوك.
- مراجعة أمنية فصلية للتأكد من عدم الانزلاق (Privilege Creep).

> آخر تحديث: 2025-08-21
