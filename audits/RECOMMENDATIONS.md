# خطة التحسين المتدرجة - Depth Agency

**تاريخ التحديث:** 10 أغسطس 2025  
**الحالة:** جاهزة للتنفيذ  
**الأولويات:** High → Medium → Low Risk

---

## High Priority (تنفيذ فوري - خلال أسبوع)

### لا توجد مشاكل حرجة ✅
جميع الأنظمة الأساسية تعمل بشكل مثالي. النظام آمن ومستقر.

---

## Medium Priority (تنفيذ خلال 2-4 أسابيع)

### 1. تفعيل Collaborative Inbox للمجموعات الرئيسية

**المشكلة:** إدارة الرسائل ستصبح صعبة مع نمو الحجم  
**التأثير:** فقدان رسائل، ردود مكررة، عدم وضوح المسؤوليات  
**الحل:**

```bash
# تفعيل Collaborative Inbox
gam update group hello@depth-agency.com settings enableCollaborativeInbox true
gam update group support@depth-agency.com settings enableCollaborativeInbox true
```

**الفوائد:**
- ✅ تعيين الرسائل لأعضاء فريق محددين
- ✅ تتبع حالة الردود (مفتوح/قيد المراجعة/تم الحل)
- ✅ تجنب الردود المكررة
- ✅ إحصائيات أداء الفريق

**المتطلبات:** تدريب الفريق على واجهة Gmail الجديدة (10 دقائق)

---

### 2. إعداد توجيه ذكي للنماذج حسب النوع

**المشكلة:** جميع النماذج ترسل إلى hello@ مما يخلط الأولويات  
**التأثير:** بطء في الرد، خلط بين الاستفسارات العامة والمبيعات  

**الحل المرحلي (سريع):**
```javascript
// في /api/contact/route.ts
const getDestinationEmail = (message, source) => {
  if (message.includes('عرض') || message.includes('باقة') || message.includes('سعر')) {
    return 'sales@depth-agency.com';
  }
  if (message.includes('مشكلة') || message.includes('خطأ') || message.includes('لا يعمل')) {
    return 'support@depth-agency.com';
  }
  if (message.includes('وظيفة') || message.includes('انضمام') || message.includes('cv')) {
    return 'jobs@depth-agency.com';
  }
  return 'hello@depth-agency.com'; // default
};
```

**الحل الشامل (مستقبلي):**
- إضافة dropdown "نوع الاستفسار" في النموذج
- نماذج منفصلة: `/contact/sales`, `/contact/support`, `/contact/careers`
- صفحة careers متخصصة مع upload CV

---

### 3. تحسين إعدادات الرد للمجموعات الداخلية

**المشكلة:** المجموعات الداخلية مضبوطة على `replyTo: IGNORE`  
**التأثير:** ارتباك إذا وصلت رسائل خارجية بالخطأ  

**الحل:**
```bash
# تحسين إعدادات الرد للمجموعات الداخلية
gam update group billing@depth-agency.com replyTo REPLY_TO_MANAGERS
gam update group invoices@depth-agency.com replyTo REPLY_TO_MANAGERS  
gam update group legal@depth-agency.com replyTo REPLY_TO_MANAGERS
gam update group studio@depth-agency.com replyTo REPLY_TO_MANAGERS
```

**الفائدة:** رد تلقائي مهذب بدلاً من "لا رد"

---

## Low Priority (تنفيذ خلال 1-3 أشهر)

### 1. ترقية DMARC إلى سياسة صارمة

**الوضع الحالي:** `p=quarantine` (يحجر الرسائل المشبوهة)  
**الهدف:** `p=reject` (يرفض تماماً)  

**الخطة المرحلية:**
```bash
# المرحلة 1: مراقبة التقارير (أسبوعين)
# مراجعة تقارير DMARC في dmarc@depth-agency.com
# التأكد من عدم وجود رسائل مشروعة مرفوضة

# المرحلة 2: الترقية (بعد التأكد)
# dig TXT _dmarc.depth-agency.com
# تحديث النطاق من quarantine إلى reject
```

**المخاطر:** قد يرفض رسائل مشروعة إذا كانت الإعدادات غير دقيقة  
**التخفيف:** مراقبة دقيقة لأسبوعين قبل التغيير

---

### 2. إنشاء صفحة careers متخصصة

**الهدف:** `/careers` مع نموذج متخصص للوظائف  

**المكونات المطلوبة:**
```
- عرض الوظائف المتاحة
- نموذج طلب عمل (يرسل إلى jobs@)
- رفع CV/Portfolio
- وصف ثقافة الشركة
- خطوات عملية التوظيف
```

**التأثير:** تنظيم أفضل لطلبات الوظائف وتحسين صورة الشركة

---

### 3. إعداد مزود إرسال بديل للطوارئ

**الوضع الحالي:** Resend فقط  
**المقترح:** إضافة SendGrid أو Mailgun كبديل  

**الفوائد:**
- ✅ موثوقية أعلى
- ✅ معدلات تسليم أفضل  
- ✅ backup في حالة انقطاع Resend

**التنفيذ:**
```javascript
// إضافة fallback provider
const sendEmail = async (data) => {
  try {
    await resend.send(data);
  } catch (error) {
    console.warn('Resend failed, trying backup...');
    await sendgrid.send(data);
  }
};
```

---

## خطة التنفيذ الزمنية

### الأسبوع 1
- [x] **تم:** إنشاء جميع المجموعات
- [ ] تفعيل Collaborative Inbox
- [ ] تحسين replyTo للمجموعات الداخلية

### الأسبوع 2-3  
- [ ] إضافة توجيه ذكي للنماذج
- [ ] اختبار التوجيه الجديد
- [ ] تدريب الفريق على الأنظمة الجديدة

### الأسبوع 4-6
- [ ] مراقبة تقارير DMARC
- [ ] تحليل أداء النظام الجديد
- [ ] تحسينات طفيفة

### الشهر 2-3
- [ ] ترقية DMARC إلى reject
- [ ] إنشاء صفحة careers
- [ ] إعداد مزود إرسال بديل

---

## مؤشرات الأداء (KPIs)

### مؤشرات النجاح
| المؤشر | الوضع الحالي | الهدف |
|---------|---------------|--------|
| متوسط وقت الرد | غير محدد | < 4 ساعات |
| تصنيف الاستفسارات | 0% | 80% |
| رضا العملاء | غير محدد | > 4.5/5 |
| معدل تسليم الإيميل | 95% | 98% |

### متابعة أسبوعية
- عدد الرسائل لكل مجموعة
- متوسط وقت الرد
- نسبة الرسائل المصنفة صحيحاً
- تقارير DMARC

---

## تكلفة التنفيذ

### الموارد المطلوبة
| العنصر | الوقت | التكلفة |
|---------|--------|---------|
| تفعيل Collaborative Inbox | 30 دقيقة | مجاني |
| توجيه النماذج الذكي | 3-4 ساعات برمجة | تطوير داخلي |
| تحسين إعدادات المجموعات | 20 دقيقة | مجاني |
| صفحة careers | 8-12 ساعة | تطوير داخلي |
| مزود إرسال بديل | 2-3 ساعات | ~$10/شهر |

**إجمالي:** معظم التحسينات مجانية أو منخفضة التكلفة

---

*خطة تم إعدادها بناءً على التدقيق الشامل | جاهزة للتنفيذ المرحلي*
