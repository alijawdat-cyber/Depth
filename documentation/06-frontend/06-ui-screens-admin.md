# 🎛️ شاشات الأدمن - عرض تفاعلي حديث

> الحالة: نهائي ✅ — HTML/CSS/JS فقط بدون مخططات ASCII

## فهرس
- [OTP الأدمن](#admin-auth)
- [Dashboard الأدمن](#admin-dashboard)
- [إدارة الطلبات](#admin-requests)
- [تعيين المبدعين](#admin-assign)
- [التسعير والهوامش](#admin-pricing)
- [لوحة المشاريع](#admin-projects)
- [التقارير](#admin-reports)
- [إدارة النظام](#admin-system)
 - [إدارة الأدمنز (Super Admin)](#admin-manage-admins)

---

<a id="admin-auth"></a>
## 🔐 OTP الأدمن

<div class="screen-mockup otp-screen">
  <div class="screen-header">
    <button class="back-btn">⬅</button>
    <h3>تسجيل دخول الأدمن</h3>
    <button class="close-btn">❌</button>
  </div>
  <div class="screen-content">
    <div class="icon">🛡️</div>
    <p>أدخل رمز التحقق المكوّن من 6 أرقام</p>
    <div class="otp-inputs"><input/><input/><input/><input/><input/><input/></div>
    <div class="timer">⏰ باقي <span data-seconds="60">60</span> ثانية</div>
    <button class="primary-btn" disabled>✅ دخول اللوحة</button>
    <div class="resend-section">لم يصلك؟ <button class="link-btn resend-btn" disabled>🔄 إعادة الإرسال</button></div>
    <div class="otp-output" aria-live="polite"></div>
  </div>
</div>

---

<a id="admin-dashboard"></a>
## 🏠 Dashboard الأدمن

<div class="screen-mockup">
  <div class="screen-header">
    <button class="back-btn">☰</button>
    <h3>لوحة الأدمن</h3>
    <button class="close-btn">⚙️</button>
  </div>
  <div class="screen-content dashboard">
    <div class="kpis">
      <div class="kpi"><div class="title">طلبات جديدة</div><div class="value">12</div></div>
      <div class="kpi"><div class="title">مشاريع نشطة</div><div class="value">34</div></div>
      <div class="kpi"><div class="title">مبدعون نشطون</div><div class="value">23</div></div>
      <div class="kpi"><div class="title">إيرادات الشهر</div><div class="value">28.45M IQD</div></div>
    </div>
    <h4 style="margin:14px 0 8px">تنبيهات عاجلة</h4>
    <div class="notif-list">
      <div class="notif-item">⚠️ فاتورة متأخرة: INV-2025-001198 — 5 أيام</div>
      <div class="notif-item">🔴 طلب مستعجل: RQ-2025-1042 يتطلب تعيين خلال ساعتين</div>
      <div class="notif-item">📋 مبدع جديد بانتظار المراجعة</div>
    </div>
  </div>
</div>

---

<a id="admin-requests"></a>
## 📋 إدارة الطلبات

<div class="screen-mockup">
  <div class="screen-header">
    <button class="back-btn">⬅</button>
    <h3>الطلبات الجديدة</h3>
    <button class="close-btn">🔍</button>
  </div>
  <div class="screen-content">
    <div class="kpis" style="grid-template-columns:repeat(5,1fr)">
      <div class="kpi"><div class="title">جديد</div><div class="value">12 🔴</div></div>
      <div class="kpi"><div class="title">مراجعة</div><div class="value">5 🟡</div></div>
      <div class="kpi"><div class="title">معتمد</div><div class="value">5 🟢</div></div>
      <div class="kpi"><div class="title">مرفوض</div><div class="value">2 ⚫</div></div>
      <div class="kpi"><div class="title">الإجمالي</div><div class="value">28</div></div>
    </div>
    <h4 style="margin:14px 0 8px">قائمة الطلبات</h4>
    <table class="invoice-table">
      <thead><tr><th>#</th><th>العميل</th><th>النوع</th><th>الحالة</th><th>تاريخ</th><th>إجراءات</th></tr></thead>
      <tbody>
        <tr><td>1042</td><td>مطعم البرج</td><td>📷 تصوير/طعام</td><td>🔴 جديد</td><td>منذ ساعة</td><td><button class="primary-btn">فتح</button> <button class="secondary-btn">تحويل</button></td></tr>
        <tr><td>1041</td><td>شركة الأمل</td><td>🎬 فيديو/دعائي</td><td>🟡 مراجعة</td><td>منذ 3 ساعات</td><td><button class="primary-btn">فتح</button> <button class="secondary-btn">رفض</button></td></tr>
        <tr><td>1039</td><td>فندق بابل</td><td>📷 تصوير/معماري</td><td>🟢 معتمد</td><td>أمس</td><td><button class="secondary-btn">عرض</button> <button class="primary-btn">تعيين</button></td></tr>
      </tbody>
    </table>
  </div>
</div>

---

<a id="admin-assign"></a>
## 👥 تعيين المبدعين

<div class="screen-mockup">
  <div class="screen-header">
    <button class="back-btn">⬅</button>
    <h3>تعيين لمشروع #DP2025-0142</h3>
    <button class="close-btn">💡</button>
  </div>
  <div class="screen-content">
    <div class="review-grid">
      <div class="review-card"><strong>المتطلبات</strong><div>فئة: تصوير طعام — الموقع: بغداد — التسليم: 26/أغسطس</div></div>
      <div class="review-card"><strong>فلترة</strong><div>فئة فرعية/خبرة/معدات/توفر/موقع</div></div>
    </div>
    <h4 style="margin:12px 0 8px">مرشحين مناسبين</h4>
    <div class="review-grid">
      <div class="review-card"><strong>#1 فاطمة الزهراء</strong><div>⭐ 4.9 — 🟢 متاحة — السعر: 380k — يقبل مستعجل</div><div><button class="primary-btn">تعيين</button> <button class="secondary-btn">مراسلة</button></div></div>
      <div class="review-card"><strong>#2 علي حسين</strong><div>⭐ 4.7 — 🟡 غداً — السعر: 320k</div><div><button class="primary-btn">تعيين</button> <button class="secondary-btn">مراسلة</button></div></div>
    </div>
  </div>
</div>

---

<a id="admin-pricing"></a>
## 💰 التسعير والهوامش

<div class="screen-mockup">
  <div class="screen-header">
    <button class="back-btn">⬅</button>
    <h3>إعداد عرض السعر</h3>
    <button class="close-btn">💾</button>
  </div>
  <div class="screen-content">
    <div class="review-grid">
      <div class="review-card">
        <strong>سعر المبدع</strong>
        <div>Base: 380,000 × Exp 1.2 × Equip 1.1 × Rush 1.2 = 550,560 → 551,000</div>
      </div>
      <div class="review-card">
        <strong>هامش الوكالة</strong>
        <div>النطاق 10% - 50% — المقترح: 36%</div>
      </div>
      <div class="review-card"><strong>السعر النهائي</strong><div>749,500 د.ع</div></div>
    </div>
    <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
      <button class="secondary-btn">💾 حفظ مسودة</button>
      <button class="primary-btn">📤 نشر واعتماد</button>
    </div>
  </div>
</div>

---

<a id="admin-projects"></a>
## 📊 لوحة المشاريع

<div class="screen-mockup">
  <div class="screen-header">
    <button class="back-btn">⬅</button>
    <h3>إدارة المشاريع</h3>
    <button class="close-btn">📤</button>
  </div>
  <div class="screen-content">
    <table class="invoice-table">
      <thead><tr><th>ID</th><th>العميل</th><th>المبدع</th><th>الحالة</th><th>التقدم</th><th>إجراءات</th></tr></thead>
      <tbody>
        <tr><td>p_142</td><td>مطعم البرج</td><td>فاطمة</td><td>🔄 نشط</td><td>35%</td><td><button class="secondary-btn">فتح</button> <button class="secondary-btn">أرشفة</button></td></tr>
        <tr><td>p_141</td><td>شركة الأمل</td><td>علي</td><td>🔄 نشط</td><td>68%</td><td><button class="secondary-btn">فتح</button> <button class="secondary-btn">تعديل</button></td></tr>
        <tr><td>p_140</td><td>فندق بابل</td><td>سارة</td><td>✅ مكتمل</td><td>100%</td><td><button class="secondary-btn">فتح</button> <button class="secondary-btn">أرشفة</button></td></tr>
      </tbody>
    </table>
  </div>
</div>

---

<a id="admin-reports"></a>
## 📈 التقارير

<div class="screen-mockup">
  <div class="screen-header">
    <button class="back-btn">⬅</button>
    <h3>التقارير والإحصائيات</h3>
    <button class="close-btn">📅</button>
  </div>
  <div class="screen-content">
    <div class="review-grid">
      <div class="review-card"><strong>ملخص المشاريع</strong><div>مكتمل 68% — نشط 15% — مؤرشف 10%</div></div>
      <div class="review-card"><strong>أداء المبدعين</strong><div>متوسط التقييم 4.6/5 — إنجاز 94%</div></div>
      <div class="review-card"><strong>نجاح الإشعارات</strong><div>In-App 100% — Email 98.4% — SMS 87.1%</div></div>
    </div>
    <div style="margin-top:12px"><button class="secondary-btn">📥 تصدير PDF</button></div>
  </div>
</div>

---

<a id="admin-system"></a>
## 🔧 إدارة النظام

<div class="screen-mockup">
  <div class="screen-header">
    <button class="back-btn">⬅</button>
    <h3>المستخدمون والصلاحيات</h3>
    <button class="close-btn">＋</button>
  </div>
  <div class="screen-content">
    <table class="invoice-table">
      <thead><tr><th>ID</th><th>الاسم</th><th>الدور</th><th>الحالة</th><th>آخر دخول</th><th>إجراءات</th></tr></thead>
      <tbody>
        <tr><td>u_001</td><td>Super Admin</td><td>super_admin</td><td>🟢 نشط</td><td>الآن</td><td><button class="secondary-btn">عرض</button></td></tr>
        <tr><td>u_002</td><td>أحمد محمد</td><td>admin</td><td>🟢 نشط</td><td>منذ ساعة</td><td><button class="secondary-btn">عرض</button></td></tr>
        <tr><td>c_789</td><td>فاطمة زهراء</td><td>creator</td><td>🟢 نشط</td><td>منذ 3 ساعات</td><td><button class="secondary-btn">عرض</button></td></tr>
      </tbody>
    </table>
    <div class="review-card" style="margin-top:12px"><strong>RBAC</strong>
      <div>users.*: ✅ super_admin/admin</div>
      <div>pricing.*: ✅ super_admin/admin</div>
      <div>reports.*: ✅ super_admin/admin — محدود للآخرين</div>
    </div>
  </div>
</div>

---

<a id="admin-manage-admins"></a>
## 🧑‍💼 إدارة الأدمنز (Super Admin)

<div class="screen-mockup">
  <div class="screen-header">
    <button class="back-btn">⬅</button>
    <h3>إدارة الأدمنز</h3>
    <button class="close-btn">➕</button>
  </div>
  <div class="screen-content">
    <div class="banner warning">هذه الشاشة متاحة فقط لحساب Super Admin</div>
    <table class="invoice-table">
      <thead><tr><th>الاسم</th><th>البريد</th><th>الحالة</th><th>إجراءات</th></tr></thead>
      <tbody>
        <tr><td>علي الربيعي</td><td>admin@depth-agency.com</td><td>نشط</td><td><button class="secondary-btn">تعطيل</button> <button class="secondary-btn">إعادة تعيين كلمة مرور</button></td></tr>
      </tbody>
    </table>
  </div>
  <div class="screen-footer">
    <div class="banner info">إذا دخل Admin عادي هنا يظهر له: "هذه الشاشة متاحة فقط لسوبر أدمن"</div>
  </div>
 </div>


### توافق المتطلبات
- OTP: إلزامي — 6 أرقام — 5 دقائق — 3 محاولات — Audit Log
- تحويل الطلب: لا تغيير subcategory بعد التحويل
- التسعير: نطاق الهامش 10%-50% + التقريب لأقرب 500
- التقارير: 3 تقارير أساسية حسب المواصفات