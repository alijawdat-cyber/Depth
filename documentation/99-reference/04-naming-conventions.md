# 🏷️ معايير التسمية (Naming Conventions) - Depth V2.1

هذا المستند يحدد معايير التسمية الموحدة عبر المنصة (ملفات، فروع، متغيرات، Slugs)، لضمان الاتساق وتقليل الالتباس، مع دعم نظام المشاريع متعددة المهام.

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
| تكامل خارجي | SERVICE_IDENTIFIER | EXTERNAL_SERVICE_KEY | وضوح الخدمة |
| حساسة | بدون NEXT_PUBLIC_ | JWT_SECRET | لا تُرفع علناً |

## 4. فروع Git
| السيناريو | النمط | مثال |
|----------|-------|------|
| ميزة | feature/<slug> | feature/multi-task-projects |
| إصلاح | fix/<slug> | fix/tasks-validation |
| تحسين | chore/<slug> | chore/update-deps |
| توثيق | docs/<slug> | docs/v2.1-specifications |
| تجربة / spike | spike/<slug> | spike/smart-recommendations |

## 5. أسماء الدوال (TypeScript)
| النوع | النمط | مثال |
|-------|-------|------|
| دوال عادية | camelCase | calculateRecommendationScore |
| مكونات React | PascalCase | TasksManager |
| أنواع/واجهات | PascalCase | ProjectTask |
| ثوابت | UPPER_SNAKE_CASE | MAX_TASKS_PER_PROJECT |
| خطافات مخصصة | use + PascalCase | useSmartRecommendations |

## 6. أسماء المجموعات (Firestore Collections)
| الكيان | الاسم | سبب |
|-------|------|------|
| Users | users | بصيغة جمع صغيرة |
| Creators | creators | اتساق |
| Projects | projects | واضح |
| Project Requests | projectRequests | camelCase بسيط |
| Project Tasks | tasks | V2.1 - مهام المشاريع |
| Creator Recommendations | creatorRecommendations | V2.1 - التوصيات الذكية |
| Sessions | sessions | |
| Notifications | notifications | |
| Messages | messages | |
| Seeds (البيانات الأساسية) | seeds | تُزرع عبر سكربت خارجي |

## 7. مفاتيح الحقول المشتركة
| الحقل | الوصف | ملاحظات |
|-------|-------|---------|
| createdAt | طابع زمني للإنشاء | timestamp معيار UTC |
| updatedAt | آخر تحديث | دائماً يحدث عند التعديل |
| approvedAt | وقت الموافقة | إن وجد سير موافقات |
| approvedBy | معرف/إيميل المُعتمد | مرجع للأدمن |
| isActive | حالة تفعيل | boolean |
| status | الحالة العامة | enum منضبط |

## 8. مصطلحات V2.1 الجديدة
| المصطلح | الترجمة | الاستخدام |
|---------|---------|-----------|
| Tasks | المهام | مهام فردية داخل المشروع |
| Smart Recommendations | التوصيات الذكية | نظام SCR لمطابقة المبدعين |
| Unified Template | القالب الموحد | UPT - قالب واحد لجميع الأدوار |
| Multi-Task Project | مشروع متعدد المهام | نوع المشروع الجديد |
| Recommendation Score | نقاط التوصية | درجة التطابق (0.0-1.0) |
| Industry Matching | المطابقة الصناعية | ربط المشاريع بالمجالات |

| intelligentRecommendations | التوصيات الذكية | boolean flag |
| templateType | نوع القالب | unified/role_based |

## 9. أنماط JSON في الاستجابات (Responses)
- الجذر: `{ success: boolean, data?: object, error?: { code, message, details? } }`
- الأخطاء: `error.code` بصيغة SCREAMING_SNAKE_CASE (مثال: `INVALID_TOKEN`).
- القوائم: داخل `data.items` + `data.pagination` عند الحاجة.

## 10. تنسيق الأسعار والأرقام
| السياق | التنسيق | مثال |
|--------|---------|-------|
| العملات الداخلية | عدد صحيح (IQD) | 15730 |
| النسب | float (0.10) | 0.30 = 30% |
| نقاط التوصية | float (0.0-1.0) | 0.92 = 92% |
| التخزين | وحدات SI | 50MB |

## 11. مفاتيح التعدادات في الواجهة الأمامية
تُستهلك كما هي من `02-enums-standard.md` دون إعادة اشتقاق.

## 12. التعليقات (Code Comments)
- عربية حيث القيمة توثيقية للمجال (Domain Logic).
- إنجليزية في التعليقات التقنية القصيرة (Parsing, Encoding...).

## 13. التزامات التحديث
أي انحراف عن هذه المعايير:
1. يوثق استثناء في قسم خاص.
2. يُناقش في مراجعة الكود.
3. يُضاف تعديل للملف إذا أصبح تكرارياً.

> آخر تحديث: 2025-09-04 (V2.1)
