# 🖼️ شاشات الموظف براتب (Salaried Employee UI) — HTML تفاعلي فقط

## الفهرس
- [تسجيل/OTP + Dashboard](#salaried-auth)
- [مهامي اليوم](#salaried-today)
- [رفع ملفات/تحديث حالة (بدون أسعار)](#salaried-uploads)

<a id="salaried-auth"></a>
## تسجيل/OTP + Dashboard

<div class="screen-mockup">
  <div class="screen-header"><button class="back-btn">⬅</button><h3>تسجيل الموظف</h3><button class="close-btn">❌</button></div>
  <div class="screen-content">
    <div class="form-grid">
      <label>الهاتف/الايميل<br><input class="ui-input" placeholder="0770... أو name@site.com"></label>
      <label>OTP<br><input class="ui-input" placeholder="6-digits"></label>
      <label>&nbsp;<br><button class="primary-btn">تحقق</button></label>
    </div>
  </div>
  <div class="screen-content dashboard">
    <h4>مهامي اليوم (مفتوحة)</h4>
    <div class="project-list">
      <div class="project-card"><div><strong>#p_12</strong> — due 14:00</div><div>📷 تجهيز معدات — موقع العميل</div></div>
      <div class="project-card"><div><strong>#p_13</strong> — due 16:00</div><div>🎬 تسليم ملفات الفيديو</div></div>
    </div>
  </div>
</div>

<a id="salaried-today"></a>
## مهامي اليوم

<div class="screen-mockup">
  <div class="screen-header"><button class="back-btn">⬅</button><h3>قائمة المهام</h3><button class="close-btn">🔄</button></div>
  <div class="screen-content">
    <div class="review-grid">
      <div class="review-card"><strong>#1 p_12</strong><div>due 14:00 — <button class="secondary-btn">Open</button></div></div>
      <div class="review-card"><strong>#2 p_13</strong><div>due 16:00 — <button class="secondary-btn">Open</button></div></div>
    </div>
  </div>
</div>

<a id="salaried-uploads"></a>
## رفع ملفات/تحديث حالة (بدون أسعار)

<div class="screen-mockup">
  <div class="screen-header"><button class="back-btn">⬅</button><h3>رفع الملفات</h3><button class="close-btn">💾</button></div>
  <div class="screen-content">
    <div class="dropzone">📁 اسحب الملفات هنا — 2GB/ملف — فحص فيروس/MIME — denylist</div>
    <div class="uploads">
      <div class="row">⏳ report.pdf (456KB) — 42%</div>
    </div>
    <div class="form-grid" style="margin-top:12px">
      <label>الحالة<br><input class="ui-input" placeholder="pending|active|completed|cancelled"></label>
      <label>&nbsp;<br><button class="primary-btn">حفظ</button></label>
    </div>
  </div>
</div>
