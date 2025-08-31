# 🖼️ شاشات المبدع (Creator UI) — HTML تفاعلي فقط

## الفهرس
- [Onboarding + OTP](#creator-onboarding)
- [Dashboard](#creator-dashboard)
- [تفاصيل مشروع](#creator-project-details)
- [الرفع والموافقة](#creator-uploads)
- [البروفايل (≤10 صور)](#creator-profile)
- [التوفر والإشعارات](#creator-availability)

<a id="creator-onboarding"></a>
## Onboarding + OTP

<div class="screen-mockup">
  <div class="screen-header"><button class="back-btn">⬅</button><h3>Onboarding المبدع</h3><button class="close-btn">❓</button></div>
  <div class="screen-content">
    <h4>اختيار الفئات والمعدات</h4>
    <div class="choices-grid">
      <label><input type="checkbox" checked> 📷 تصوير</label>
      <label><input type="checkbox"> 🎬 فيديو</label>
      <label><input type="checkbox"> 🎨 تصميم</label>
      <label><input type="checkbox"> ✂️ مونتاج</label>
    </div>
    <div class="form-grid" style="margin-top:10px">
      <label>الخبرة<br><input class="ui-input" placeholder="expert"></label>
      <label>المعدات<br><input class="ui-input" placeholder="gold"></label>
      <label>التوفر<br><input class="ui-input" placeholder="Mon-Thu"></label>
    </div>
  </div>
</div>

<div class="screen-mockup otp-screen">
  <div class="screen-header"><button class="back-btn">⬅</button><h3>OTP تفعيل الحساب</h3><button class="close-btn">❌</button></div>
  <div class="screen-content">
    <div class="icon">🔐</div>
    <p>أدخل رمز التحقق (6 أرقام)</p>
    <div class="otp-inputs"><input/><input/><input/><input/><input/><input/></div>
    <div class="timer">⏰ باقي <span data-seconds="60">60</span> ثانية</div>
    <button class="primary-btn" disabled>✅ تفعيل</button>
    <div class="resend-section">لم يصلك؟ <button class="link-btn resend-btn" disabled>🔄 إعادة الإرسال</button></div>
  </div>
</div>

<a id="creator-dashboard"></a>
## Dashboard

<div class="screen-mockup">
  <div class="screen-header"><button class="back-btn">☰</button><h3>مشاريعي</h3><button class="close-btn">⚙️</button></div>
  <div class="screen-content dashboard">
    <div class="kpis">
  <div class="kpi"><div class="title">نشط</div><div class="value">2</div></div>
      <div class="kpi"><div class="title">بانتظار</div><div class="value">1</div></div>
      <div class="kpi"><div class="title">مكتمل</div><div class="value">8</div></div>
      <div class="kpi"><div class="title">تقييم</div><div class="value">4.8/5</div></div>
    </div>
    <h4 style="margin:14px 0 8px">المشاريع</h4>
    <div class="project-list">
  <div class="project-card"><div><strong>#p_123</strong> — 🔄 نشط</div><div>📷 تصوير منتجات — التسليم: 2/سبتمبر</div><div class="progress" style="--p:68%"><div class="bar"></div></div></div>
      <div class="project-card"><div><strong>#p_122</strong> — ⏳ بانتظار</div><div>🎬 فيديو دعائي — ينتظر المصادر</div><div class="progress" style="--p:20%"><div class="bar"></div></div></div>
    </div>
  </div>
</div>

<a id="creator-project-details"></a>
## تفاصيل مشروع + Ready for Review

<div class="screen-mockup">
  <div class="screen-header"><button class="back-btn">⬅</button><h3>مشروع #p_123</h3><button class="close-btn">📝</button></div>
  <div class="screen-content">
    <div class="review-grid">
      <div class="review-card"><strong>Line Items</strong><div>subcategory: product | processing: basic | qty: 25</div></div>
      <div class="review-card"><strong>Assignments</strong><div>type=creator | assignee=c_123 | status=active</div></div>
    </div>
    <div style="margin-top:12px"><button class="primary-btn">✅ Mark Ready for Review</button></div>
  </div>
</div>

<a id="creator-uploads"></a>
## الرفع والموافقة

<div class="screen-mockup">
  <div class="screen-header"><button class="back-btn">⬅</button><h3>رفع الملفات</h3><button class="close-btn">💾</button></div>
  <div class="screen-content">
    <div class="dropzone">📁 اسحب الملفات هنا — 2GB/ملف — فحص فيروس/MIME — denylist</div>
    <div class="uploads">
      <div class="row">✅ draft_01.jpg (1.2MB) <span>🗑️ حذف</span></div>
      <div class="row">⏳ draft_02.jpg (856KB) — 68%</div>
    </div>
    <div style="margin-top:12px"><button class="primary-btn">📤 Submit Final</button></div>
  </div>
</div>

<a id="creator-profile"></a>
## البروفايل (≤10 صور)

<div class="screen-mockup gallery">
  <div class="screen-header"><button class="back-btn">⬅</button><h3>Portfolio (≤10)</h3><button class="close-btn">👁️</button></div>
  <div class="screen-content">
    <div class="thumbs">
      <div class="thumb">1</div><div class="thumb">2</div><div class="thumb">3</div><div class="thumb">4</div><div class="thumb">5</div>
      <div class="thumb">6</div><div class="thumb">7</div><div class="thumb">8</div><div class="thumb">9</div><div class="thumb">10</div>
    </div>
  </div>
</div>

<a id="creator-availability"></a>
## التوفر والإشعارات

<div class="screen-mockup">
  <div class="screen-header"><button class="back-btn">⬅</button><h3>التوفر + الإشعارات</h3><button class="close-btn">💾</button></div>
  <div class="screen-content">
    <div class="form-grid">
      <label>Mon am<br><input type="checkbox" checked></label>
      <label>Mon pm<br><input type="checkbox"></label>
      <label>Tue am<br><input type="checkbox" checked></label>
    </div>
    <div class="review-card" style="margin-top:12px">
      <strong>قنوات الإشعار</strong>
      <div><label><input type="checkbox" checked> In-App</label> <label><input type="checkbox" checked> Email</label> <label><input type="checkbox"> SMS</label></div>
      <div style="margin-top:8px"><button class="secondary-btn">حفظ</button></div>
    </div>
  </div>
</div>
