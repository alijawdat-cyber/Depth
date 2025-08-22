# 🪝 مواصفات الـ Webhooks - Depth V2.0

## 1. الهدف
تمكين الأنظمة الخارجية من الاشتراك في أحداث المنصة (Projects, Creators, Pricing Adjustments) بطريقة آمنة، موثوقة وقابلة لإعادة المحاولة.

## 2. الحالة
Draft (مسموح ضمن 2.0 لأنه ملف مرجعي لا يغير سلوك الإنتاج المقفل).

## 3. الأحداث (Events)
| المفتاح | الوصف | نموذج الحمولة (Payload) |
|---------|-------|-------------------------|
| project.created | إنشاء مشروع | project.basic |
| project.status.changed | تغيير حالة | project.statusChange |
| creator.approved | اعتماد مبدع | creator.approval |
| pricing.formula.version | تغيير (مستقبلي) | pricing.version |

## 4. النماذج (Schemas)
```jsonc
// project.basic
{
  "id": "p_123",
  "clientId": "cl_1",
  "creatorId": "c_9",
  "status": "pending",
  "createdAt": "2025-08-21T12:00:00Z"
}

// project.statusChange
{
  "id": "p_123",
  "oldStatus": "pending",
  "newStatus": "active",
  "changedAt": "2025-08-21T13:00:00Z"
}

// creator.approval
{
  "id": "c_9",
  "approvedAt": "2025-08-21T12:30:00Z",
  "experience": "experienced",
  "equipmentTier": "gold"
}
```

## 5. الإعداد (Subscription Flow)
1. العميل يطلب إنشاء Endpoint (من لوحة مستقبلية)
2. توليد `webhookId` + `signingSecret`
3. اختبار (Ping) → يجب إعادة 200 خلال 5 ثوانٍ
4. تفعيل الاشتراك

## 6. التوقيع (Signing)
يُرسل رأس:
```
X-Depth-Signature: v1=<HMAC_SHA256_HEX>
X-Depth-Timestamp: <unix_epoch_seconds>
```
خوارزمية البناء:
```
baseString = timestamp + "." + body
signature = HMAC_SHA256(signingSecret, baseString)
```
رفض إذا:
- فرق الزمن > 5 دقائق
- مفقود أي رأس
- التوقيع لا يطابق

## 7. إعادة المحاولة (Retries)
| المحاولة | التأخير (ثوانٍ) |
|----------|-----------------|
| 1 | 0 |
| 2 | 30 |
| 3 | 120 |
| 4 | 600 |

يتوقف بعد 4 محاولات أو HTTP 2xx.

## 8. التسليم المعتمد (Idempotency)
إرسال رأس:
```
X-Depth-Delivery-ID: <uuid4>
```
على المستقبل حفظ ID لمدة 24 ساعة لتجنب المعالجة المكررة.

## 9. الأمن
- توقيع إلزامي
- IP Allowlist (مستقبلي)
- تسجيل فشل التوقيع

## 10. إدارة الإصدارات
إصدار الحدث v1 داخل 2.0 ثابت (لا كسر). أي تعديل جوهري يتبع فتح 2.1.

## 11. المراقبة
تجميع الإحصاءات:
```
webhookDeliveries/{id}:
  status, attempts, lastAttemptAt, latencyMs
```

## 12. حدود (Limits)
| نوع | قيمة |
|-----|------|
| حجم الحمولة | 64KB |
| زمن الاستجابة | ≤ 5s |
| معدل الحد الأدنى | 60/د لكل Endpoint |

## 13. أمثلة طلب
```http
POST /webhooks/project.status.changed HTTP/1.1
Host: client-endpoint.io
Content-Type: application/json
X-Depth-Signature: v1=abc123...
X-Depth-Timestamp: 1724245200
X-Depth-Delivery-ID: 550e8400-e29b-41d4-a716-446655440000

{"id":"p_123","oldStatus":"pending","newStatus":"active","changedAt":"2025-08-21T13:00:00Z"}
```

## 14. أخطاء شائعة
| رمز | سبب | حل |
|-----|-----|----|
| 400 | Timestamp قديم | تحقق من الساعة |
| 401 | توقيع غير صحيح | تأكد من السر |
| 429 | معدل مرتفع | Backoff |

## 15. تحسينات مستقبلية
- [ ] تشفير على مستوى الحقل
- [ ] Event Version Header
- [ ] Self-serve Portal

> آخر تحديث: 2025-08-21
