# قالب رد تلقائي - الدعم الفني (support@)

## الموضوع
```
تذكرة دعم #{ticket_id} - مستلمة | Depth Support
```

## جسم الرسالة

### العربية
```html
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<body style="font-family: Dubai, Arial, sans-serif; direction: rtl; text-align: right;">

<p>أهلاً <strong>{name}</strong>!</p>

<p>🎫 تم إنشاء تذكرة دعم برقم: <strong>#{ticket_id}</strong></p>

<div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3;">
<h3 style="margin: 0 0 10px 0; color: #1976d2;">ملخص طلبك:</h3>
<p style="margin: 0;"><strong>الموضوع:</strong> {subject}</p>
<p style="margin: 5px 0 0 0;"><strong>الأولوية:</strong> متوسطة</p>
<p style="margin: 5px 0 0 0;"><strong>الرد المتوقع:</strong> خلال 4-6 ساعات</p>
</div>

<p><strong>ماذا يحدث الآن؟</strong></p>
<ol>
  <li>📋 مراجعة فورية للطلب</li>
  <li>🔍 تحليل المشكلة وإيجاد الحل</li>
  <li>📞 التواصل معك بالحل أو طلب تفاصيل إضافية</li>
</ol>

<p><strong>حالة عاجلة؟</strong><br>
📱 واتساب: <a href="https://wa.me/">[رابط واتساب]</a><br>
✉️ جاوب على هذا الإيميل مباشرة لإضافة معلومات</p>

<p>تحياتنا،<br>
فريق الدعم الفني — Depth</p>

<hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">

<p style="font-size: 14px; color: #666;">
<strong>Depth Support</strong><br>
support@depth-agency.com | تذكرة: #{ticket_id}<br>
لمراجعة حالة تذكرتك: <a href="https://depth-agency.com/portal">بوابة العميل</a>
</p>

</body>
</html>
```

## CTA رئيسية
- رد على الإيميل لإضافة تفاصيل
- التواصل العاجل عبر واتساب
- زيارة بوابة العميل لمتابعة التذكرة

## متغيرات ديناميكية
- `{name}` - اسم المرسل
- `{ticket_id}` - رقم التذكرة التلقائي
- `{subject}` - موضوع المشكلة
- `{priority}` - أولوية التذكرة (منخفضة/متوسطة/عالية)
