# 🚀 دليل النشر (Deployment Runbook) - Depth V2.0

> مصطلحات هذا المستند:
> - التكامل/التسليم المستمران: Continuous Integration / Continuous Delivery — CI/CD
> - من الطرف إلى الطرف: End-to-End — E2E
> - هدف زمن الاستعادة: Recovery Time Objective — RTO
> - هدف نقطة الاستعادة: Recovery Point Objective — RPO
> - مؤشر أداء رئيسي: Key Performance Indicator — KPI
> (انظر أيضًا: `99-reference/06-terminology-glossary-ar.md`)

## 1. الهدف
توفير مسار موحد، قابل للتدقيق وآمن لنشر المنصة عبر البيئات (Dev → Staging → Production) مع آليات فحص ما قبل وما بعد النشر وخطة تراجع (Rollback).

## 2. البيئات
| البيئة | الفرع | الغرض | القيود | أدوات الرصد |
|--------|-------|-------|--------|-------------|
| Dev | feature/* + PR | تجارب وتطوير | قد تكون غير مستقرة | Local DevTools |
| Staging | develop | اختبار تكاملي / قبول | لا يوجد بيانات حقيقية | Sentry (stg), Vercel Preview |
| Production | main | مستخدمين حقيقيين | تغييرات حرجة فقط | Sentry, Vercel Analytics |

## 3. شروط قبول النشر إلى Staging
- ✅ جميع اختبارات الوحدة + التكامل خضراء
- ✅ التغطية ≥ 70% (مؤقت) – هدف 85%
- ✅ فحص ESLint و Type Check بلا أخطاء
- ✅ لا توجد تحذيرات أمن تبعيات حرجة (High/Critical)
- ✅ فحص Link Integrity للوثائق (اختياري حالياً)

## 4. شروط قبول النشر إلى Production
| فئة | المعيار | أداة/مصدر |
|-----|---------|-----------|
| الاختبارات | 100% نجاح آخر Pipeline | GitHub Actions |
| الهجرة/الفهارس | لا تغييرات كاسرة (Firestore) | مراجعة يدوية |
| الأداء | زمن بناء < 8 دقائق | Actions Logs |
| الأخطاء | معدل أخطاء Sentry (Staging) منخفض (<1%) | Sentry |
| الأمن | لا أسرار مكشوفة | سرية المتغيرات + مراجعة |
| الموافقات | موافقة Tech + Product | PR Review |

## 5. سير العمل (Workflow)
1. تطوير في فرع feature/*
2. فتح PR إلى develop → اختبارات تلقائية
3. دمج → نشر تلقائي Staging (Preview)
4. اختبار قبول (QA + UAT)
5. فتح PR من develop إلى main (Release PR)
6. وسم/Tag (اختياري) v2.0.x (Patch)
7. دمج → نشر تلقائي Production
8. مراقبة Post-Deploy (30 دقيقة حرجة)

## 6. فحوص ما قبل النشر (Pre-Deploy Checklist)
- [ ] npm audit (لا Critical)
- [ ] npm run lint & type-check
- [ ] npm run test
- [ ] مراجعة CHANGELOG.md محدث
- [ ] لا تغييرات في الملفات المحمية تخالف `VERSION-LOCK-V2.0.md`

## 7. فحوص ما بعد النشر (Post-Deploy)
| الزمن | الفحص | الإجراء في حال الفشل |
|-------|-------|----------------------|
| +5m | صحة الصفحة الرئيسية (200) | إعادة النشر أو التراجع |
| +10m | معدلات الخطأ Sentry | فتح حادث Incident |
| +15m | أداء LCP / FCP | إنشاء بطاقة تحسين |
| +30m | التأكد من عدم وجود شكاوى دعم | تحديث سجل النشر |

## 8. إستراتيجية التراجع (Rollback)
| السيناريو | آلية | زمن القرار |
|-----------|-------|-------------|
| خطأ حرج (500 متكرر) | إعادة نشر الإصدار السابق (Vercel Re-deploy Previous) | ≤ 10 دقائق |
| تسعير خاطئ | تعطيل المسار المتأثر + Hotfix Patch | ≤ 30 دقيقة |
| كشف سر | تدوير السر + إبطال الجلسات | فوري |

خطوات عملية:
1. تحديد آخر Deploy ID مستقر في Vercel
2. تنفيذ Redeploy
3. توثيق السبب في Incident Log
4. فتح تذكرة جذر السبب (RCA)

## 9. إدارة الإصدارات (Versioning)
- Patch: إصلاحات وثائق أو UI بسيطة (v2.0.x)
- Minor (2.1): تتبع معايير فتح الإصدار (انظر Version Lock)
- لا Major قبل جمع مؤشرات تأثير متعددة

## 10. المتغيرات والأسرار (Secrets)
| الفئة | المصدر | التخزين | التدوير |
|-------|--------|---------|---------|
| Firebase Keys | Console | متغيرات Vercel | نصف سنوي |
| Vercel Tokens | Vercel | GitHub Secrets | ربع سنوي |
| Webhook Secrets | توليد داخلي | Firestore (مشفر) | عند الشك |
| API Internal Keys | توليد داخلي | Secret Manager (مستقبلاً) | سنوي |

## 11. اختبارات الدخان (Smoke Tests)
تشغيل (آلي مستقبلاً):
- GET /health
- GET /version
- استعلام Firestore بسيط
- رفع ملف صغير

## 12. مراقبة ما بعد الإصدار (30 دقيقة أولى)
| مؤشر | حد تنبيه | قناة |
|------|----------|-------|
| أخطاء Sentry | >5 في 5 دقائق | #alerts |
| زمن استجابة Projects API | >800ms P95 | #alerts |
| أخطاء رفع Storage | >2% | #alerts |

## 13. السجلات (Logs)
- GitHub Actions: سجل البناء/الاختبارات
- Vercel Logs: طلبات HTTP
- Sentry: أخطاء + أداء

## 14. تحسينات مستقبلية
- [ ] اعتماد Canary Releases
- [ ] فحص تلقائي لمستوى تغطية الكود
- [ ] نشر أزرق/أخضر (Blue/Green) للوظائف الحساسة

> آخر تحديث: 2025-08-21
