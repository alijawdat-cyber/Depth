# 🏷️ معايير التسمية (Naming Conventions) - Depth V2.0

هذا المستند يحدد معايير التسمية الموحدة عبر المنصة (ملفات، فروع، متغيرات، Slugs)، لضمان الاتساق وتقليل الالتباس.

## 1. أسماء الملفات التوثيقية
| النوع | النمط | مثال | ملاحظات |
|-------|-------|------|---------|
| مجلد رئيسي | رقم ثنائي-وصف | 03-api/ | يضبط الترتيب الهرمي |
| ملف رئيسي داخل مجلد | رقم ثنائي-وصف.md | 01-creators.md | يبدأ من 00 عند الحاجة لفهرس |
| ملف مرجعي عام | وصف-كلمات-قصيرة.md | development-workflow.md | بدون أرقام إن لم يكن ترتيب مطلوب |

## 2. Slugs (الفئات / الفئات الفرعية)
- حروف صغيرة.
- فاصل شرطة سفلية للكلمات المركبة: `color_correction`.
- ممنوع المسافات أو الأحرف العربية في المفاتيح الداخلية (تُخزن الترجمة منفصلة).

## 3. متغيرات البيئة (Environment Variables)
| المعيار | مثال | ملاحظة |
|---------|-------|--------|
| بادئة عامة للواجهة | NEXT_PUBLIC_ | NEXT_PUBLIC_API_URL | فقط ما يحتاج المتصفح |
| تكامل خارجي | SERVICE_IDENTIFIER | STRIPE_PUBLIC_KEY | وضوح الخدمة |
| حساسة | بدون NEXT_PUBLIC_ | JWT_SECRET | لا تُرفع علناً |

## 4. فروع Git
| السيناريو | النمط | مثال |
|----------|-------|------|
| ميزة | feature/<slug> | feature/pricing-endpoint |
| إصلاح | fix/<slug> | fix/auth-refresh-token |
| تحسين | chore/<slug> | chore/update-deps |
| توثيق | docs/<slug> | docs/add-glossary |
| تجربة / spike | spike/<slug> | spike/r2-benchmark |

## 5. أسماء الدوال (TypeScript)
| النوع | النمط | مثال |
|-------|-------|------|
| دوال عادية | camelCase | calculateCreatorPrice |
| مكونات React | PascalCase | CreatorCard |
| أنواع/واجهات | PascalCase | ProjectStatus |
| ثوابت | UPPER_SNAKE_CASE | DEFAULT_MARGIN_PERCENT |

## 6. أسماء المجموعات (Firestore Collections)
| الكيان | الاسم | سبب |
|-------|------|------|
| Users | users | بصيغة جمع صغيرة |
| Creators | creators | اتساق |
| Projects | projects | واضح |
| Project Requests | projectRequests | camelCase بسيط |
| Sessions | sessions | |
| Notifications | notifications | |
| Messages | messages | |
| Seeds (التعدادات) | seeds | يمكن تفصيلها لاحقاً |

## 7. مفاتيح الحقول المشتركة
| الحقل | الوصف | ملاحظات |
|-------|-------|---------|
| createdAt | طابع زمني للإنشاء | timestamp معيار UTC |
| updatedAt | آخر تحديث | دائماً يحدث عند التعديل |
| approvedAt | وقت الموافقة | إن وجد سير موافقات |
| approvedBy | معرف/إيميل المُعتمد | مرجع للأدمن |
| isActive | حالة تفعيل | boolean |
| status | الحالة العامة | enum منضبط |

## 8. أنماط JSON في الاستجابات (Responses)
- الجذر: `{ success: boolean, data?: object, error?: { code, message, details? } }`
- الأخطاء: `error.code` بصيغة SCREAMING_SNAKE_CASE (مثال: `INVALID_TOKEN`).
- القوائم: داخل `data.items` + `data.pagination` عند الحاجة.

## 9. تنسيق الأسعار والأرقام
| السياق | التنسيق | مثال |
|--------|---------|-------|
| العملات الداخلية | عدد صحيح (IQD) | 15730 |
| النسب | float (0.10) | 0.30 = 30% |
| التخزين | وحدات SI | 50MB |

## 10. مفاتيح التعدادات في الواجهة الأمامية
تُستهلك كما هي من `02-enums-standard.md` دون إعادة اشتقاق.

## 11. التعليقات (Code Comments)
- عربية حيث القيمة توثيقية للمجال (Domain Logic).
- إنجليزية في التعليقات التقنية القصيرة (Parsing, Encoding...).

## 12. التزامات التحديث
أي انحراف عن هذه المعايير:
1. يوثق استثناء في قسم خاص.
2. يُناقش في مراجعة الكود.
3. يُضاف تعديل للملف إذا أصبح تكرارياً.

> آخر تحديث: 2025-08-21
