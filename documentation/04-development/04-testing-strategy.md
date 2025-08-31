# 🧪 إستراتيجية الاختبار (Testing Strategy) - V2.0

> مصطلحات هذا المستند (Document Terms):
> - من الطرف إلى الطرف: End-to-End — E2E
> - التكامل المستمر: Continuous Integration — CI
> - طلب السحب: Pull Request — PR
> - التحقق من الجودة: Quality Gate
> (انظر أيضًا: `99-reference/06-terminology-glossary-ar.md`)

تهدف هذه الوثيقة لضمان جودة مستقرة عبر طبقات المنصة.

## 1. أنواع الاختبارات (Test Types)
| النوع | الهدف | الأدوات | التكرار |
|-------|-------|---------|---------|
| Unit | اختبار دوال ووحدات صغيرة | Jest | مستمر (Local + CI) |
| Integration | تفاعل وحدات (API + DB Emulators) | Jest + Firebase Emulator | عند PR |
| E2E | مسارات حرجة (تدفق مستخدم) | Playwright | ليلي / قبل الإصدار |
| Performance (مستقبلي) | قياس زمن استجابة | k6 (محتمل) | عند تغييرات بنيوية |
| Security (مستقبلي) | التحقق من OWASP أساسي | ZAP Proxy يدوي | ربع سنوي |

## 2. نطاق التغطية المستهدفة (Coverage Targets)
| الطبقة | النسبة الدنيا |
|--------|--------------|
| وحدات التسعير | 95% |
| الحسابات (التسجيل/الدخول) | 90% |
| إدارة المشاريع | 85% |
| المراسلة/الإشعارات | 70% (بدءاً) |

## 3. معايير كتابة الاختبارات (Test Writing Standards)
1. GIVEN / WHEN / THEN في الوصف.
2. لا اختبارات متعددة الأهداف في نفس الـ test.
3. محاكاة (Mocks) فقط للـ: الشبكة، التخزين الخارجي، الوقت.
4. يمنع الاعتماد على ترتيب تنفيذ الاختبارات.

## 4. مثال اختبار وحدات (Unit Test Example - تسعير)
```ts
// pricing.test.ts
import { calculateCreatorPrice } from '../pricing';

describe('calculateCreatorPrice', () => {
  it('calculates price with ownership and modifiers', () => {
    const result = calculateCreatorPrice({
      basePrice: 10000,
      ownershipFactor: 1.0,
      processingMod: 1.3,
      experienceMod: 1.1,
      equipmentMod: 1.1,
      rushMod: 1.0,
      locationAddition: 0
    });
    expect(result).toBe(15730);
  });
});
```

## 5. تشغيل محلي (Local Execution)
1. `npm run test`
2. `npm run test:watch`
3. `npm run test:coverage`

## 6. معايير القبول (PR Quality Gate)
| فحص | شرط |
|-----|------|
| Lint | بدون أخطاء حرجة |
| Type Check | اجتياز كامل |
| Unit Tests | نجاح 100% |
| تغطية | ≥ المستوى الأدنى للطبقة |

## 7. E2E حرجة (Critical End-to-End - أمثلة مبدئية)
| السيناريو | المسار |
|----------|-------|
| تسجيل عميل جديد واعتماد مشروع | client signup → request → approve → project active |
| تسجيل مبدع واعتماد ثم إسناد مشروع | creator onboarding → approve → assign project |
| حساب تسعير مشروع وتصعيد هامش | create project → compute price → set margin |

## 8. بيانات الاختبار (Test Data)
- استخدم سكربت الزرع الخارجي مع ملفات JSON لتهيئة البيانات الأساسية (idempotent) بدون المرور عبر الواجهة.
- لبيانات مؤقتة داخل الاختبارات، أنشئها برمجياً ضد الـ Emulator ثم نظّفها في teardown.

## 9. منع التداخل (Test Isolation)
- لكل Suite قاعدة بيانات Emulator جديدة إن أمكن.
- يمنع الاعتماد على توقيت فعلي (استخدم Fake Timers).

## 10. خارطة مستقبلية (Future Roadmap)
| عنصر | حالة |
|------|------|
| اختبار تحميل (Load Testing) | مؤجل |
| Chaos Testing | مؤجل |
| Test Containers بديلة | قيد التقييم |

> آخر تحديث: 2025-08-21
