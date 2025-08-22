# 🚦 تحديد المعدل والتحكم في الطلبات - Rate Limiting

## نظرة عامة
يحمي نظام تحديد المعدل منصة Depth من إساءة الاستخدام ويضمن التوزيع العادل للموارد بين جميع المستخدمين.

## إعدادات تحديد المعدل

### الحدود العامة
```typescript
interface RateLimitConfig {
  windowMs: number;      // النافذة الزمنية بالميلي ثانية
  maxRequests: number;   // الحد الأقصى للطلبات لكل نافذة
  message: string;       // رسالة الخطأ عند تجاوز الحد
  statusCode: number;    // رمز حالة HTTP (429)
}
```

### الحدود حسب المستوى

| مستوى المستخدم | طلبات/ساعة | حد الاندفاع | الاتصالات المتزامنة |
|---------------|-----------|------------|-------------------|
| مجاني | 100 | 10/دقيقة | 2 |
| أساسي | 1,000 | 50/دقيقة | 5 |
| احترافي | 5,000 | 200/دقيقة | 10 |
| مؤسسي | غير محدود* | 1000/دقيقة | 50 |

*خاضع لسياسة الاستخدام العادل

## التنفيذ

### برمجية Express الوسيطة
```javascript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from './redis-client';

// محدد معدل API القياسي
export const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:api:',
  }),
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100, // حد كل IP إلى 100 طلب لكل نافذة زمنية
  message: {
    error: 'طلبات كثيرة جداً',
    error_en: 'Too many requests',
    retryAfter: '15 دقيقة'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// محدد معدل نقاط نهاية المصادقة (أكثر صرامة)
export const authLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:auth:',
  }),
  windowMs: 15 * 60 * 1000,
  max: 5, // فقط 5 محاولات مصادقة لكل 15 دقيقة
  skipSuccessfulRequests: true,
});

// محدد معدل رفع الملفات
export const uploadLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:upload:',
  }),
  windowMs: 60 * 60 * 1000, // ساعة واحدة
  max: 20, // 20 رفعة لكل ساعة
  skipFailedRequests: true,
});
```

### تحديد المعدل في Firebase Functions
```javascript
import * as functions from 'firebase-functions';

export const rateLimitedFunction = functions
  .runWith({
    minInstances: 0,
    maxInstances: 10,
    timeoutSeconds: 30,
  })
  .https.onRequest(async (req, res) => {
    // التحقق من حد المعدل في Firestore
    const userId = req.auth?.uid || req.ip;
    const limitsRef = admin.firestore()
      .collection('rateLimits')
      .doc(userId);
    
    await admin.firestore().runTransaction(async (transaction) => {
      const doc = await transaction.get(limitsRef);
      const data = doc.data() || { count: 0, resetAt: Date.now() };
      
      if (Date.now() > data.resetAt) {
        // إعادة تعيين العداد
        transaction.set(limitsRef, {
          count: 1,
          resetAt: Date.now() + (15 * 60 * 1000)
        });
      } else if (data.count >= 100) {
        throw new functions.https.HttpsError(
          'resource-exhausted',
          'تجاوز حد المعدل'
        );
      } else {
        transaction.update(limitsRef, {
          count: admin.firestore.FieldValue.increment(1)
        });
      }
    });
    
    // معالجة الطلب
  });
```

## رؤوس الاستجابة

جميع نقاط النهاية المحددة بمعدل ترجع هذه الرؤوس:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200000
Retry-After: 900
```

## استجابة تجاوز حد المعدل

```json
{
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "طلبات كثيرة جداً. يرجى المحاولة بعد 15 دقيقة.",
  "message_en": "Too many requests. Please retry after 15 minutes.",
  "retryAfter": 900,
  "resetAt": "2025-01-01T12:00:00.000Z"
}
```

## تحديد المعدل الديناميكي

### الحدود المبنية على المستخدم
```javascript
export const dynamicLimiter = async (req, res, next) => {
  const user = await getUserFromToken(req.headers.authorization);
  const tier = user?.subscription?.tier || 'free';
  
  const limits = {
    free: { windowMs: 3600000, max: 100 },
    basic: { windowMs: 3600000, max: 1000 },
    professional: { windowMs: 3600000, max: 5000 },
    enterprise: { windowMs: 3600000, max: 100000 }
  };
  
  const userLimit = limits[tier];
  const limiter = rateLimit({
    ...userLimit,
    keyGenerator: (req) => user?.id || req.ip,
  });
  
  limiter(req, res, next);
};
```

### حدود خاصة بنقاط النهاية
```javascript
const endpointLimits = {
  '/api/auth/login': { max: 5, windowMs: 900000 },
  '/api/auth/register': { max: 3, windowMs: 3600000 },
  '/api/upload': { max: 20, windowMs: 3600000 },
  '/api/search': { max: 30, windowMs: 60000 },
  '/api/ai/generate': { max: 10, windowMs: 3600000 },
};
```

## تجاوز حدود المعدل

### تجاوز المسؤول
```javascript
export const adminBypass = (req, res, next) => {
  if (req.user?.role === 'admin' || req.headers['x-admin-key'] === process.env.ADMIN_KEY) {
    req.rateLimit = { bypass: true };
    return next();
  }
  apiLimiter(req, res, next);
};
```

### القائمة البيضاء لعناوين IP
```javascript
const whitelist = process.env.WHITELIST_IPS?.split(',') || [];

export const ipWhitelist = (req) => {
  return whitelist.includes(req.ip);
};
```

## المراقبة والتنبيهات

### مقاييس حد المعدل
```javascript
// تتبع إصابات حد المعدل
export const trackRateLimit = async (userId, endpoint, exceeded) => {
  await admin.firestore().collection('metrics').add({
    type: 'rate_limit',
    userId,
    endpoint,
    exceeded,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  // التنبيه إذا كان المستخدم يصل للحدود باستمرار
  if (exceeded) {
    const recentHits = await admin.firestore()
      .collection('metrics')
      .where('userId', '==', userId)
      .where('type', '==', 'rate_limit')
      .where('exceeded', '==', true)
      .where('timestamp', '>', new Date(Date.now() - 3600000))
      .get();
    
    if (recentHits.size > 10) {
      // إرسال تنبيه للمسؤول
      await sendAdminAlert({
        type: 'RATE_LIMIT_ABUSE',
        userId,
        hits: recentHits.size,
      });
    }
  }
};
```

## أفضل الممارسات

1. **التراجع التدريجي**: تنفيذ تراجع أسي للانتهاكات المتكررة
2. **ملاحظات المستخدم**: رسائل خطأ واضحة مع معلومات إعادة المحاولة
3. **المراقبة**: تتبع الأنماط لتحديد إساءة الاستخدام المحتملة
4. **التكوين المرن**: تكوين الحدود بناءً على البيئة
5. **التخزين المؤقت**: استخدام Redis لتحديد المعدل الموزع

## اختبار حدود المعدل

```bash
# اختبار تحديد المعدل
for i in {1..110}; do
  curl -X GET "https://api.depth.so/v1/test" \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -w "\n%{http_code} - طلب رقم $i\n"
  sleep 0.5
done
```

## الوثائق ذات الصلة
- [المصادقة](./01-authentication.md)
- [معالجة الأخطاء](./04-error-handling.md)
- [نظرة عامة على الأمان](../../07-security/00-security-overview.md)
