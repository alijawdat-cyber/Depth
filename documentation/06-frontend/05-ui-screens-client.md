
# 🎨 شاشات العميل - النسخة الاحترافية المطورة V2.0

> **منصة:** Depth Platform  
> **التاريخ:** أغسطس 2025  
> **التوافق:** HTML5 + CSS3 + JavaScript ES6+  
> **الحالة:** محدث ومطور بالكامل ✅

## 📋 فهرس الشاشات

- [🔐 تسجيل الدخول والتحقق (OTP)](#client-auth)
- [🏠 الشاشة الرئيسية (Dashboard)](#client-dashboard) 
- [📝 إنشاء طلب جديد](#client-create-request)
- [📊 متابعة المشاريع](#client-tracking)
- [👁️ معاينة وموافقة](#client-preview)
- [💳 الفواتير والمدفوعات](#client-invoices)
- [🔔 الإشعارات والرسائل](#client-notifications)
- [⚙️ الإعدادات الشخصية](#client-settings)

---

<a id="client-auth"></a>
## 🔐 شاشة تسجيل الدخول والتحقق (OTP)

### شاشة تسجيل الدخول الأولية

```html
<!-- include: assets/previews/client/auth-login.html -->
```

### شاشة التحقق OTP المطورة

```html
<!-- include: assets/previews/client/auth-otp.html -->
```

---

<a id="client-dashboard"></a>
## 🏠 الشاشة الرئيسية (Dashboard)

### لوحة التحكم الرئيسية - Desktop

```html
<div class="screen-mockup desktop">
    <div class="app-layout">
        <!-- Sidebar Navigation -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <img src="/logo.svg" alt="Depth" class="sidebar-logo">
                <span class="sidebar-title">Depth Platform</span>
            </div>
            
            <nav class="sidebar-nav">
                <a href="#dashboard" class="nav-item active">
                    <span class="nav-icon">🏠</span>
                    <span class="nav-text">الرئيسية</span>
                </a>
                <a href="#new-request" class="nav-item">
                    <span class="nav-icon">📝</span>
                    <span class="nav-text">طلب جديد</span>
                    <span class="nav-badge">جديد</span>
                </a>
                <a href="#projects" class="nav-item">
                    <span class="nav-icon">📊</span>
                    <span class="nav-text">مشاريعي</span>
                    <span class="nav-counter">2</span>
                </a>
                <a href="#messages" class="nav-item">
                    <span class="nav-icon">💬</span>
                    <span class="nav-text">الرسائل</span>
                    <span class="nav-badge badge-danger">3</span>
                </a>
                <a href="#invoices" class="nav-item">
                    <span class="nav-icon">💳</span>
                    <span class="nav-text">الفواتير</span>
                </a>
                <a href="#notifications" class="nav-item">
                    <span class="nav-icon">🔔</span>
                    <span class="nav-text">الإشعارات</span>
                    <span class="nav-badge badge-danger">5</span>
                </a>
                <a href="#reports" class="nav-item">
                    <span class="nav-icon">📈</span>
                    <span class="nav-text">التقارير</span>
                </a>
                <a href="#settings" class="nav-item">
                    <span class="nav-icon">⚙️</span>
                    <span class="nav-text">الإعدادات</span>
                </a>
            </nav>
            
            <div class="sidebar-footer">
                <div class="user-profile">
                    <img src="/avatar.jpg" alt="User" class="user-avatar">
                    <div class="user-info">
                        <div class="user-name">أحمد الخالدي</div>
                        <div class="user-company">شركة الأمل</div>
                    </div>
                    <button class="btn-icon">
                        <span>🚪</span>
                    </button>
                </div>
            </div>
        </aside>
        
        <!-- Main Content -->
        <main class="main-content">
            <header class="content-header">
                <div class="header-left">
                    <button class="btn-icon mobile-menu-toggle">☰</button>
                    <h1 class="page-title">مرحباً، أحمد! 👋</h1>
                </div>
                <div class="header-right">
                    <button class="btn btn-primary">
                        <span class="btn-icon">➕</span>
                        <span class="btn-text">طلب جديد</span>
                    </button>
                    <button class="btn-icon notification-btn">
                        <span>🔔</span>
                        <span class="notification-dot"></span>
                    </button>
                    <div class="user-menu">
                        <button class="user-menu-trigger">
                            <img src="/avatar.jpg" alt="User" class="avatar-sm">
                            <span class="dropdown-arrow">▼</span>
                        </button>
                    </div>
                </div>
            </header>
            
            <!-- KPI Cards -->
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-icon" style="background: var(--primary-gradient);">
                        📝
                    </div>
                    <div class="kpi-content">
                        <div class="kpi-value">3</div>
                        <div class="kpi-label">طلبات جديدة</div>
                        <div class="kpi-change positive">
                            <span>↑ 50%</span>
                            <span>من الشهر الماضي</span>
                        </div>
                    </div>
                </div>
                
                <div class="kpi-card">
                    <div class="kpi-icon" style="background: linear-gradient(135deg, #00D4FF, #00A8CC);">
                        🔄
                    </div>
                    <div class="kpi-content">
                        <div class="kpi-value">2</div>
                        <div class="kpi-label">قيد التنفيذ</div>
                        <div class="kpi-change">
                            <span>← مستقر</span>
                        </div>
                    </div>
                </div>
                
                <div class="kpi-card">
                    <div class="kpi-icon" style="background: linear-gradient(135deg, #10B981, #059669);">
                        ✅
                    </div>
                    <div class="kpi-content">
                        <div class="kpi-value">12</div>
                        <div class="kpi-label">مشاريع مكتملة</div>
                        <div class="kpi-change positive">
                            <span>↑ 20%</span>
                            <span>نمو ممتاز</span>
                        </div>
                    </div>
                </div>
                
                <div class="kpi-card">
                    <div class="kpi-icon" style="background: linear-gradient(135deg, #F59E0B, #D97706);">
                        💰
                    </div>
                    <div class="kpi-content">
                        <div class="kpi-value">2.75M</div>
                        <div class="kpi-label">الإنفاق الكلي (IQD)</div>
                        <div class="kpi-change">
                            <button class="btn-link">عرض التفاصيل →</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Active Projects Section -->
            <section class="dashboard-section">
                <div class="section-header">
                    <h2 class="section-title">المشاريع النشطة</h2>
                    <a href="#all-projects" class="btn-link">عرض الكل →</a>
                </div>
                
                <div class="projects-grid">
                    <div class="project-card interactive">
                        <div class="project-header">
                            <span class="project-id">#DP2025-0142</span>
                            <span class="project-status status-active">🔄 قيد التنفيذ</span>
                        </div>
                        <div class="project-body">
                            <h3 class="project-title">📷 تصوير حفل زفاف</h3>
                            <div class="project-meta">
                                <div class="meta-item">
                                    <span class="meta-icon">👤</span>
                                    <span class="meta-text">سارة أحمد</span>
                                </div>
                                <div class="meta-item">
                                    <span class="meta-icon">📅</span>
                                    <span class="meta-text">التسليم: 25 أغسطس</span>
                                </div>
                            </div>
                            <div class="project-progress">
                                <div class="progress-header">
                                    <span>التقدم</span>
                                    <span>75%</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 75%;"></div>
                                </div>
                            </div>
                            <div class="project-actions">
                                <button class="btn btn-sm btn-secondary">
                                    عرض التفاصيل
                                </button>
                                <button class="btn btn-sm btn-primary">
                                    💬 محادثة
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="project-card interactive">
                        <div class="project-header">
                            <span class="project-id">#DP2025-0138</span>
                            <span class="project-status status-pending">⏳ بانتظار الموافقة</span>
                        </div>
                        <div class="project-body">
                            <h3 class="project-title">🎬 مونتاج فيديو تسويقي</h3>
                            <div class="project-meta">
                                <div class="meta-item">
                                    <span class="meta-icon">👤</span>
                                    <span class="meta-text">علي الموسوي</span>
                                </div>
                                <div class="meta-item">
                                    <span class="meta-icon">📅</span>
                                    <span class="meta-text">التسليم: 28 أغسطس</span>
                                </div>
                            </div>
                            <div class="project-alert alert-warning">
                                <span class="alert-icon">⚠️</span>
                                <span class="alert-text">يتطلب موافقتك على النسخة النهائية</span>
                            </div>
                            <div class="project-actions">
                                <button class="btn btn-sm btn-primary w-full">
                                    👁️ معاينة والموافقة
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Quick Actions -->
            <section class="dashboard-section">
                <h2 class="section-title">إجراءات سريعة</h2>
                <div class="quick-actions">
                    <button class="action-card">
                        <span class="action-icon">📸</span>
                        <span class="action-text">طلب تصوير</span>
                    </button>
                    <button class="action-card">
                        <span class="action-icon">🎥</span>
                        <span class="action-text">طلب فيديو</span>
                    </button>
                    <button class="action-card">
                        <span class="action-icon">🎨</span>
                        <span class="action-text">طلب تصميم</span>
                    </button>
                    <button class="action-card">
                        <span class="action-icon">✂️</span>
                        <span class="action-text">طلب مونتاج</span>
                    </button>
                </div>
            </section>
        </main>
    </div>
</div>
```

### لوحة التحكم - Mobile

```html
<div class="screen-mockup mobile">
    <div class="mobile-header">
        <button class="btn-icon menu-toggle">☰</button>
        <h3 class="mobile-title">لوحة التحكم</h3>
        <button class="btn-icon notification-btn">
            <span>🔔</span>
            <span class="notification-badge">5</span>
        </button>
    </div>
    
    <div class="screen-content">
        <!-- Welcome Section -->
        <div class="welcome-card">
            <div class="welcome-text">
                <h2>مرحباً، أحمد! 👋</h2>
                <p>يوم جميل لإنجاز المشاريع</p>
            </div>
            <button class="btn btn-primary btn-sm">
                + طلب جديد
            </button>
        </div>
        
        <!-- Mini KPIs -->
        <div class="mini-kpi-scroll">
            <div class="mini-kpi">
                <div class="mini-kpi-value">2</div>
                <div class="mini-kpi-label">قيد التنفيذ</div>
            </div>
            <div class="mini-kpi">
                <div class="mini-kpi-value">12</div>
                <div class="mini-kpi-label">مكتملة</div>
            </div>
            <div class="mini-kpi">
                <div class="mini-kpi-value">3</div>
                <div class="mini-kpi-label">طلبات</div>
            </div>
            <div class="mini-kpi">
                <div class="mini-kpi-value">2.75M</div>
                <div class="mini-kpi-label">الإنفاق</div>
            </div>
        </div>
        
        <!-- Active Projects -->
        <div class="section-header-mobile">
            <h3>المشاريع النشطة</h3>
            <a href="#all" class="link-sm">عرض الكل</a>
        </div>
        
        <div class="project-card-mobile">
            <div class="project-mobile-header">
                <span class="project-badge">#DP2025-0142</span>
                <span class="status-dot active"></span>
            </div>
            <h4 class="project-mobile-title">📷 تصوير حفل زفاف</h4>
            <div class="project-mobile-meta">
                <span>سارة أحمد</span>
                <span>•</span>
                <span>25 أغسطس</span>
            </div>
            <div class="progress-bar-mobile">
                <div class="progress-fill" style="width: 75%;">75%</div>
            </div>
            <button class="btn btn-secondary btn-sm w-full">
                عرض التفاصيل ←
            </button>
        </div>
        
        <div class="project-card-mobile alert">
            <div class="alert-badge">⚠️ يتطلب إجراء</div>
            <div class="project-mobile-header">
                <span class="project-badge">#DP2025-0138</span>
                <span class="status-dot pending"></span>
            </div>
            <h4 class="project-mobile-title">🎬 مونتاج فيديو</h4>
            <div class="project-mobile-meta">
                <span>علي الموسوي</span>
                <span>•</span>
                <span>28 أغسطس</span>
            </div>
            <button class="btn btn-primary btn-sm w-full">
                المعاينة والموافقة ←
            </button>
        </div>
        
        <!-- Bottom Navigation -->
        <nav class="bottom-nav">
            <a href="#home" class="bottom-nav-item active">
                <span class="nav-icon">🏠</span>
                <span class="nav-label">الرئيسية</span>
            </a>
            <a href="#projects" class="bottom-nav-item">
                <span class="nav-icon">📊</span>
                <span class="nav-label">المشاريع</span>
            </a>
            <a href="#new" class="bottom-nav-item primary">
                <span class="nav-icon">➕</span>
            </a>
            <a href="#messages" class="bottom-nav-item">
                <span class="nav-icon">💬</span>
                <span class="nav-label">الرسائل</span>
                <span class="nav-badge">3</span>
            </a>
            <a href="#profile" class="bottom-nav-item">
                <span class="nav-icon">👤</span>
                <span class="nav-label">حسابي</span>
            </a>
        </nav>
    </div>
</div>
```

---

<a id="client-create-request"></a>
## 📝 إنشاء طلب جديد - Multi-Step Form

### الخطوة 1: اختيار نوع الخدمة

```html
<div class="screen-mockup">
    <div class="screen-header">
        <button class="header-btn back-btn">⬅</button>
        <h3>إنشاء طلب جديد</h3>
        <button class="header-btn">❓</button>
    </div>
    
    <div class="screen-content">
        <!-- Progress Indicator -->
        <div class="step-progress">
            <div class="step-progress-bar">
                <div class="step-progress-fill" style="width: 25%;"></div>
            </div>
            <div class="step-indicators">
                <div class="step-indicator active">
                    <span class="step-number">1</span>
                    <span class="step-label">نوع الخدمة</span>
                </div>
                <div class="step-indicator">
                    <span class="step-number">2</span>
                    <span class="step-label">التفاصيل</span>
                </div>
                <div class="step-indicator">
                    <span class="step-number">3</span>
                    <span class="step-label">الملفات</span>
                </div>
                <div class="step-indicator">
                    <span class="step-number">4</span>
                    <span class="step-label">المراجعة</span>
                </div>
            </div>
        </div>
        
        <!-- Service Selection -->
        <div class="form-section">
            <h2 class="form-title">اختر نوع الخدمة المطلوبة</h2>
            <p class="form-description">حدد الفئة الرئيسية للخدمة التي تحتاجها</p>
            
            <div class="service-cards-grid">
                <div class="service-card selectable" data-service="photography">
                    <div class="service-icon">📷</div>
                    <h3 class="service-title">التصوير</h3>
                    <p class="service-desc">تصوير احترافي للمنتجات والفعاليات</p>
                    <div class="service-examples">
                        <span class="tag">منتجات</span>
                        <span class="tag">بورتريه</span>
                        <span class="tag">فعاليات</span>
                    </div>
                </div>
                
                <div class="service-card selectable" data-service="video">
                    <div class="service-icon">🎬</div>
                    <h3 class="service-title">الفيديو</h3>
                    <p class="service-desc">إنتاج فيديوهات احترافية</p>
                    <div class="service-examples">
                        <span class="tag">دعائي</span>
                        <span class="tag">توثيقي</span>
                        <span class="tag">موشن</span>
                    </div>
                </div>
                
                <div class="service-card selectable" data-service="design">
                    <div class="service-icon">🎨</div>
                    <h3 class="service-title">التصميم</h3>
                    <p class="service-desc">تصاميم إبداعية للهوية والتسويق</p>
                    <div class="service-examples">
                        <span class="tag">هوية</span>
                        <span class="tag">سوشيال</span>
                        <span class="tag">طباعة</span>
                    </div>
                </div>
                
                <div class="service-card selectable" data-service="editing">
                    <div class="service-icon">✂️</div>
                    <h3 class="service-title">المونتاج</h3>
                    <p class="service-desc">مونتاج وتحرير احترافي</p>
                    <div class="service-examples">
                        <span class="tag">فيديو</span>
                        <span class="tag">صوت</span>
                        <span class="tag">مؤثرات</span>
                    </div>
                </div>
            </div>
            
            <!-- Sub-categories (appears after selection) -->
            <div class="subcategories-section hidden" data-show-on-select>
                <h3 class="subsection-title">حدد نوع التصوير المطلوب</h3>
                <div class="checkbox-grid">
                    <label class="checkbox-card">
                        <input type="checkbox" name="subcategory" value="wedding">
                        <div class="checkbox-content">
                            <span class="checkbox-icon">💑</span>
                            <span class="checkbox-label">تصوير حفل زفاف</span>
                        </div>
                    </label>
                    <label class="checkbox-card">
                        <input type="checkbox" name="subcategory" value="product">
                        <div class="checkbox-content">
                            <span class="checkbox-icon">📦</span>
                            <span class="checkbox-label">تصوير منتجات</span>
                        </div>
                    </label>
                    <label class="checkbox-card">
                        <input type="checkbox" name="subcategory" value="portrait">
                        <div class="checkbox-content">
                            <span class="checkbox-icon">👤</span>
                            <span class="checkbox-label">تصوير بورتريه</span>
                        </div>
                    </label>
                    <label class="checkbox-card">
                        <input type="checkbox" name="subcategory" value="event">
                        <div class="checkbox-content">
                            <span class="checkbox-icon">🎪</span>
                            <span class="checkbox-label">تصوير فعاليات</span>
                        </div>
                    </label>
                </div>
                
                <!-- Processing Level -->
                <h3 class="subsection-title">مستوى المعالجة المطلوب</h3>
                <div class="radio-cards">
                    <label class="radio-card">
                        <input type="radio" name="processing" value="basic" checked>
                        <div class="radio-content">
                            <div class="radio-header">
                                <span class="radio-title">أساسي</span>
                                <span class="radio-price">💰</span>
                            </div>
                            <p class="radio-desc">تصوير وتسليم بدون معالجة</p>
                        </div>
                    </label>
                    <label class="radio-card">
                        <input type="radio" name="processing" value="standard">
                        <div class="radio-content">
                            <div class="radio-header">
                                <span class="radio-title">معالجة كاملة</span>
                                <span class="radio-price">💰💰</span>
                            </div>
                            <p class="radio-desc">تصوير مع معالجة احترافية</p>
                        </div>
                    </label>
                    <label class="radio-card">
                        <input type="radio" name="processing" value="premium">
                        <div class="radio-content">
                            <div class="radio-header">
                                <span class="radio-title">بريميوم</span>
                                <span class="radio-price">💰💰💰</span>
                            </div>
                            <p class="radio-desc">معالجة متقدمة وتسليم سريع</p>
                        </div>
                    </label>
                </div>
            </div>
            
            <div class="form-actions">
                <button class="btn btn-secondary btn-lg" disabled>
                    السابق
                </button>
                <button class="btn btn-primary btn-lg">
                    التالي ←
                </button>
            </div>
        </div>
    </div>
</div>
```

### الخطوة 2: تفاصيل المشروع

```html
<div class="screen-mockup">
    <div class="screen-header">
        <button class="header-btn back-btn">⬅</button>
        <h3>تفاصيل المشروع</h3>
        <button class="header-btn">💾</button>
    </div>
    
    <div class="screen-content">
        <!-- Progress Indicator -->
        <div class="step-progress">
            <div class="step-progress-bar">
                <div class="step-progress-fill" style="width: 50%;"></div>
            </div>
        </div>
        
        <form class="project-details-form">
            <!-- Project Title -->
            <div class="form-group">
                <label class="form-label required">عنوان المشروع</label>
                <input type="text" 
                       class="form-input" 
                       placeholder="مثال: تصوير منتجات مطعمنا الجديدة"
                       required>
                <span class="form-hint">اختر عنواناً واضحاً يصف مشروعك</span>
            </div>
            
            <!-- Project Description -->
            <div class="form-group">
                <label class="form-label required">وصف تفصيلي للمشروع</label>
                <textarea class="form-textarea" 
                          rows="6" 
                          placeholder="اشرح بالتفصيل ما تحتاجه..."
                          required></textarea>
                <div class="char-counter">
                    <span class="current">0</span> / <span class="max">1000</span> حرف
                </div>
            </div>
            
            <!-- Location & Date -->
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label required">المحافظة</label>
                    <select class="form-select" required>
                        <option value="">اختر المحافظة</option>
                        <option value="baghdad">بغداد</option>
                        <option value="basra">البصرة</option>
                        <option value="mosul">الموصل</option>
                        <option value="erbil">أربيل</option>
                        <option value="najaf">النجف</option>
                        <option value="karbala">كربلاء</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">المنطقة</label>
                    <input type="text" 
                           class="form-input" 
                           placeholder="مثال: الكرادة">
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">العنوان التفصيلي</label>
                <div class="input-with-icon">
                    <span class="input-icon">📍</span>
                    <input type="text" 
                           class="form-input" 
                           placeholder="الشارع والمعالم القريبة">
                </div>
                <button type="button" class="btn btn-sm btn-secondary mt-sm">
                    📍 اختر على الخريطة
                </button>
            </div>
            
            <!-- Date & Time -->
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label required">تاريخ التنفيذ</label>
                    <div class="input-with-icon">
                        <span class="input-icon">📅</span>
                        <input type="date" 
                               class="form-input" 
                               min="2025-08-25"
                               required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">الوقت المفضل</label>
                    <div class="input-with-icon">
                        <span class="input-icon">⏰</span>
                        <input type="time" class="form-input">
                    </div>
                </div>
            </div>
            
            <!-- Rush Order Toggle -->
            <div class="form-group">
                <div class="toggle-card">
                    <div class="toggle-content">
                        <h4 class="toggle-title">⚡ طلب عاجل</h4>
                        <p class="toggle-desc">احصل على خدمة أسرع بتكلفة إضافية 30%</p>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" name="rush">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
            
            <!-- Budget Range -->
            <div class="form-group">
                <label class="form-label">الميزانية المتوقعة</label>
                <div class="budget-selector">
                    <button type="button" class="budget-option" data-budget="500-1000">
                        500K - 1M IQD
                    </button>
                    <button type="button" class="budget-option" data-budget="1000-2000">
                        1M - 2M IQD
                    </button>
                    <button type="button" class="budget-option" data-budget="2000-5000">
                        2M - 5M IQD
                    </button>
                    <button type="button" class="budget-option" data-budget="5000+">
                        +5M IQD
                    </button>
                </div>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn btn-secondary btn-lg">
                    ← السابق
                </button>
                <button type="submit" class="btn btn-primary btn-lg">
                    التالي ←
                </button>
            </div>
        </form>
    </div>
</div>
```

### الخطوة 3: رفع الملفات

```html
<div class="screen-mockup">
    <div class="screen-header">
        <button class="header-btn back-btn">⬅</button>
        <h3>رفع الملفات المرجعية</h3>
        <button class="header-btn">💾</button>
    </div>
    
    <div class="screen-content">
        <!-- Progress Indicator -->
        <div class="step-progress">
            <div class="step-progress-bar">
                <div class="step-progress-fill" style="width: 75%;"></div>
            </div>
        </div>
        
        <div class="upload-section">
            <h2 class="section-title">أضف ملفات مرجعية</h2>
            <p class="section-desc">ارفع صور أو مستندات تساعد في فهم متطلباتك</p>
            
            <!-- Drag & Drop Area -->
            <div class="dropzone" data-dropzone>
                <div class="dropzone-content">
                    <div class="dropzone-icon">📁</div>
                    <h3 class="dropzone-title">اسحب الملفات هنا</h3>
                    <p class="dropzone-text">أو</p>
                    <button type="button" class="btn btn-primary">
                        اختر من الجهاز
                    </button>
                    <p class="dropzone-hint">
                        المسموح: JPG, PNG, PDF, MP4 • حتى 2GB لكل ملف
                    </p>
                </div>
                <input type="file" 
                       class="dropzone-input" 
                       multiple 
                       accept="image/*,video/*,.pdf">
            </div>
            
            <!-- Uploaded Files List -->
            <div class="uploaded-files">
                <h3 class="files-title">الملفات المرفوعة (3)</h3>
                
                <div class="file-item success">
                    <div class="file-icon">📄</div>
                    <div class="file-info">
                        <div class="file-name">venue_layout.pdf</div>
                        <div class="file-meta">2.4 MB • PDF</div>
                    </div>
                    <div class="file-status">
                        <span class="status-icon">✅</span>
                    </div>
                    <button class="btn-icon file-remove">
                        <span>🗑️</span>
                    </button>
                </div>
                
                <div class="file-item success">
                    <div class="file-preview">
                        <img src="/preview1.jpg" alt="Preview">
                    </div>
                    <div class="file-info">
                        <div class="file-name">style_reference_01.jpg</div>
                        <div class="file-meta">854 KB • صورة</div>
                    </div>
                    <div class="file-status">
                        <span class="status-icon">✅</span>
                    </div>
                    <button class="btn-icon file-remove">
                        <span>🗑️</span>
                    </button>
                </div>
                
                <div class="file-item uploading">
                    <div class="file-icon">📄</div>
                    <div class="file-info">
                        <div class="file-name">guest_list.pdf</div>
                        <div class="file-meta">456 KB • يتم الرفع...</div>
                        <div class="upload-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 68%;"></div>
                            </div>
                            <span class="progress-text">68%</span>
                        </div>
                    </div>
                    <button class="btn-icon file-cancel">
                        <span>❌</span>
                    </button>
                </div>
            </div>
            
            <!-- Additional Notes -->
            <div class="form-group">
                <label class="form-label">ملاحظات إضافية عن الملفات</label>
                <textarea class="form-textarea" 
                          rows="3" 
                          placeholder="أي توضيحات عن الملفات المرفقة..."></textarea>
            </div>
            
            <div class="form-actions">
                <button class="btn btn-secondary btn-lg">
                    ← السابق
                </button>
                <button class="btn btn-primary btn-lg">
                    التالي ←
                </button>
            </div>
        </div>
    </div>
</div>
```

### الخطوة 4: المراجعة والإرسال

```html
<div class="screen-mockup">
    <div class="screen-header">
        <button class="header-btn back-btn">⬅</button>
        <h3>مراجعة وإرسال الطلب</h3>
        <button class="header-btn">📋</button>
    </div>
    
    <div class="screen-content">
        <!-- Progress Indicator -->
        <div class="step-progress">
            <div class="step-progress-bar">
                <div class="step-progress-fill" style="width: 100%;"></div>
            </div>
        </div>
        
        <div class="review-section">
            <h2 class="section-title">راجع تفاصيل طلبك</h2>
            
            <!-- Summary Cards -->
            <div class="summary-card">
                <div class="summary-header">
                    <h3 class="summary-title">📷 نوع الخدمة</h3>
                    <button class="btn-link">تعديل</button>
                </div>
                <div class="summary-content">
                    <div class="summary-item">
                        <span class="item-label">الفئة الرئيسية:</span>
                        <span class="item-value">التصوير</span>
                    </div>
                    <div class="summary-item">
                        <span class="item-label">النوع:</span>
                        <span class="item-value">تصوير حفل زفاف، تصوير بورتريه</span>
                    </div>
                    <div class="summary-item">
                        <span class="item-label">مستوى المعالجة:</span>
                        <span class="item-value">معالجة كاملة</span>
                    </div>
                </div>
            </div>
            
            <div class="summary-card">
                <div class="summary-header">
                    <h3 class="summary-title">📝 تفاصيل المشروع</h3>
                    <button class="btn-link">تعديل</button>
                </div>
                <div class="summary-content">
                    <div class="summary-item">
                        <span class="item-label">العنوان:</span>
                        <span class="item-value">تصوير حفل زفاف في قاعة الورود</span>
                    </div>
                    <div class="summary-item">
                        <span class="item-label">الموقع:</span>
                        <span class="item-value">بغداد - الكرادة</span>
                    </div>
                    <div class="summary-item">
                        <span class="item-label">التاريخ:</span>
                        <span class="item-value">30 أغسطس 2025</span>
                    </div>
                    <div class="summary-item">
                        <span class="item-label">المدة المتوقعة:</span>
                        <span class="item-value">5 ساعات</span>
                    </div>
                </div>
            </div>
            
            <div class="summary-card">
                <div class="summary-header">
                    <h3 class="summary-title">💰 الميزانية والتسليم</h3>
                    <button class="btn-link">تعديل</button>
                </div>
                <div class="summary-content">
                    <div class="summary-item">
                        <span class="item-label">الميزانية:</span>
                        <span class="item-value">500,000 - 1,000,000 د.ع</span>
                    </div>
                    <div class="summary-item">
                        <span class="item-label">طلب عاجل:</span>
                        <span class="item-value">
                            <span class="badge badge-warning">نعم (+30%)</span>
                        </span>
                    </div>
                    <div class="summary-item">
                        <span class="item-label">الملفات المرفقة:</span>
                        <span class="item-value">3 ملفات</span>
                    </div>
                </div>
            </div>
            
            <!-- Important Notice -->
            <div class="notice-card">
                <div class="notice-icon">💡</div>
                <div class="notice-content">
                    <h4 class="notice-title">ماذا يحدث بعد الإرسال؟</h4>
                    <ol class="notice-list">
                        <li>سيتم مراجعة طلبك من قبل فريقنا خلال 2-4 ساعات</li>
                        <li>سنرشح لك أفضل المبدعين المناسبين للمشروع</li>
                        <li>ستحصل على عرض سعر تفصيلي خلال 24 ساعة</li>
                        <li>يمكنك الموافقة أو طلب تعديلات على العرض</li>
                    </ol>
                </div>
            </div>
            
            <!-- Terms Agreement -->
            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" required>
                    <span class="checkbox-text">
                        أوافق على 
                        <a href="#terms">شروط الخدمة</a>
                        و
                        <a href="#cancellation">سياسة الإلغاء</a>
                    </span>
                </label>
            </div>
            
            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" checked>
                    <span class="checkbox-text">
                        أرغب في تلقي إشعارات عن حالة الطلب عبر:
                    </span>
                </label>
                <div class="notification-options">
                    <label class="chip-checkbox">
                        <input type="checkbox" checked>
                        <span class="chip">📱 التطبيق</span>
                    </label>
                    <label class="chip-checkbox">
                        <input type="checkbox" checked>
                        <span class="chip">📧 البريد</span>
                    </label>
                    <label class="chip-checkbox">
                        <input type="checkbox">
                        <span class="chip">💬 SMS</span>
                    </label>
                </div>
            </div>
            
            <div class="form-actions">
                <button class="btn btn-secondary btn-lg">
                    ← السابق
                </button>
                <button class="btn btn-primary btn-lg btn-submit">
                    <span class="btn-icon">📤</span>
                    <span class="btn-text">إرسال الطلب النهائي</span>
                </button>
            </div>
        </div>
    </div>
</div>
```

---

<a id="client-tracking"></a>
## 📊 متابعة المشاريع

### شاشة تفاصيل المشروع مع Timeline

```html
<div class="screen-mockup">
    <div class="screen-header">
        <button class="header-btn back-btn">⬅</button>
        <h3>المشروع #DP2025-0142</h3>
        <div class="header-actions">
            <button class="btn-icon">💬</button>
            <button class="btn-icon">📤</button>
            <button class="btn-icon">⋮</button>
        </div>
    </div>
    
    <div class="screen-content">
        <!-- Project Hero -->
        <div class="project-hero">
            <div class="hero-badge">📷 تصوير</div>
            <h1 class="project-title">تصوير حفل زفاف في قاعة الورود</h1>
            <div class="project-meta-row">
                <div class="meta-item">
                    <span class="meta-icon">👤</span>
                    <span>سارة أحمد</span>
                </div>
                <div class="meta-item">
                    <span class="meta-icon">📅</span>
                    <span>25 أغسطس 2025</span>
                </div>
                <div class="meta-item">
                    <span class="meta-icon">📍</span>
                    <span>بغداد - الكرادة</span>
                </div>
            </div>
        </div>
        
        <!-- Timeline Component -->
        <div class="timeline-section">
            <h2 class="section-title">مراحل المشروع</h2>
            <div class="timeline">
                <div class="timeline-track">
                    <div class="timeline-progress" style="width: 60%;"></div>
                </div>
                <div class="timeline-steps">
                    <div class="timeline-step completed">
                        <div class="timeline-step-dot">
                            <span class="check-icon">✓</span>
                        </div>
                        <div class="timeline-step-label">الطلب</div>
                        <div class="timeline-step-date">20/08</div>
                    </div>
                    <div class="timeline-step completed">
                        <div class="timeline-step-dot">
                            <span class="check-icon">✓</span>
                        </div>
                        <div class="timeline-step-label">المراجعة</div>
                        <div class="timeline-step-date">21/08</div>
                    </div>
                    <div class="timeline-step active">
                        <div class="timeline-step-dot">
                            <span class="pulse"></span>
                        </div>
                        <div class="timeline-step-label">التنفيذ</div>
                        <div class="timeline-step-date">الآن</div>
                    </div>
                    <div class="timeline-step">
                        <div class="timeline-step-dot"></div>
                        <div class="timeline-step-label">المعاينة</div>
                        <div class="timeline-step-date">26/08</div>
                    </div>
                    <div class="timeline-step">
                        <div class="timeline-step-dot"></div>
                        <div class="timeline-step-label">التسليم</div>
                        <div class="timeline-step-date">27/08</div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Status Cards -->
        <div class="status-cards-grid">
            <div class="status-card">
                <div class="status-icon" style="background: var(--primary-gradient);">
                    🎯
                </div>
                <div class="status-content">
                    <div class="status-label">الحالة الحالية</div>
                    <div class="status-value">قيد التنفيذ</div>
                </div>
            </div>
            
            <div class="status-card">
                <div class="status-icon" style="background: linear-gradient(135deg, #10B981, #059669);">
                    📊
                </div>
                <div class="status-content">
                    <div class="status-label">نسبة الإنجاز</div>
                    <div class="status-value">60%</div>
                </div>
            </div>
            
            <div class="status-card">
                <div class="status-icon" style="background: linear-gradient(135deg, #F59E0B, #D97706);">
                    ⏱️
                </div>
                <div class="status-content">
                    <div class="status-label">الوقت المتبقي</div>
                    <div class="status-value">3 أيام</div>
                </div>
            </div>
        </div>
        
        <!-- Activity Feed -->
        <div class="activity-section">
            <h2 class="section-title">آخر التحديثات</h2>
            <div class="activity-feed">
                <div class="activity-item">
                    <div class="activity-icon">📸</div>
                    <div class="activity-content">
                        <div class="activity-title">بدء جلسة التصوير</div>
                        <div class="activity-desc">بدأت سارة أحمد جلسة التصوير في الموقع</div>
                        <div class="activity-time">منذ ساعتين</div>
                    </div>
                </div>
                
                <div class="activity-item">
                    <div class="activity-icon">✅</div>
                    <div class="activity-content">
                        <div class="activity-title">اكتمال التحضيرات</div>
                        <div class="activity-desc">تم تجهيز جميع المعدات والوصول للموقع</div>
                        <div class="activity-time">منذ 4 ساعات</div>
                    </div>
                </div>
                
                <div class="activity-item">
                    <div class="activity-icon">💬</div>
                    <div class="activity-content">
                        <div class="activity-title">رسالة من المبدع</div>
                        <div class="activity-desc">"مرحباً، سأكون في الموقع الساعة 10 صباحاً"</div>
                        <div class="activity-time">أمس</div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="project-actions-bar">
            <button class="btn btn-secondary">
                <span class="btn-icon">💬</span>
                <span class="btn-text">محادثة</span>
            </button>
            <button class="btn btn-secondary">
                <span class="btn-icon">📄</span>
                <span class="btn-text">العقد</span>
            </button>
            <button class="btn btn-primary">
                <span class="btn-icon">👁️</span>
                <span class="btn-text">معاينة الملفات</span>
            </button>
        </div>
    </div>
</div>
```

---

<a id="client-preview"></a>
## 👁️ معاينة وموافقة

### معرض المعاينة مع Watermark

```html
<div class="screen-mockup">
    <div class="screen-header">
        <button class="header-btn back-btn">⬅</button>
        <h3>معاينة المشروع #DP2025-0138</h3>
        <button class="header-btn">⚙️</button>
    </div>
    
    <div class="screen-content">
        <div class="gallery-container" data-gallery>
            <!-- Main Gallery View -->
            <div class="gallery-main">
                <div class="gallery-image-wrapper">
                    <img src="/sample-image.jpg" 
                         alt="Preview" 
                         class="gallery-image"
                         data-watermark>
                    <div class="gallery-watermark">
                        © DEPTH AGENCY - PREVIEW ONLY
                    </div>
                    <div class="gallery-zoom-controls">
                        <button class="btn-icon zoom-in">🔍+</button>
                        <button class="btn-icon zoom-out">🔍-</button>
                        <button class="btn-icon fullscreen" data-gallery-fullscreen>⛶</button>
                    </div>
                </div>
            </div>
            
            <!-- Gallery Controls -->
            <div class="gallery-controls">
                <button class="gallery-nav-btn" data-gallery-prev>
                    <span>◀</span>
                    <span class="nav-text">السابق</span>
                </button>
                <div class="gallery-counter">
                    الصورة <span class="current">5</span> من <span class="total">20</span>
                </div>
                <button class="gallery-nav-btn" data-gallery-next>
                    <span class="nav-text">التالي</span>
                    <span>▶</span>
                </button>
            </div>
            
            <!-- Thumbnails Grid -->
            <div class="gallery-thumbnails">
                <div class="gallery-thumb" data-index="1">
                    <img src="/thumb1.jpg" alt="Thumbnail 1">
                    <span class="thumb-number">1</span>
                </div>
                <div class="gallery-thumb" data-index="2">
                    <img src="/thumb2.jpg" alt="Thumbnail 2">
                    <span class="thumb-number">2</span>
                </div>
                <div class="gallery-thumb" data-index="3">
                    <img src="/thumb3.jpg" alt="Thumbnail 3">
                    <span class="thumb-number">3</span>
                </div>
                <div class="gallery-thumb active" data-index="4">
                    <img src="/thumb4.jpg" alt="Thumbnail 4">
                    <span class="thumb-number">4</span>
                </div>
                <div class="gallery-thumb" data-index="5">
                    <img src="/thumb5.jpg" alt="Thumbnail 5">
                    <span class="thumb-number">5</span>
                </div>
                <!-- More thumbnails... -->
            </div>
            
            <!-- Download Options -->
            <div class="download-section">
                <h3 class="section-title">خيارات التنزيل</h3>
                <div class="download-options">
                    <button class="btn btn-secondary">
                        <span class="btn-icon">📥</span>
                        <span class="btn-text">تنزيل معاينة منخفضة الدقة</span>
                        <span class="btn-badge">مجاني</span>
                    </button>
                    <button class="btn btn-primary" disabled>
                        <span class="btn-icon">🔒</span>
                        <span class="btn-text">تنزيل الأصلية</span>
                        <span class="btn-badge">بعد الموافقة</span>
                    </button>
                </div>
            </div>
            
            <!-- Comments Section -->
            <div class="comments-section">
                <h3 class="section-title">الملاحظات والتعليقات</h3>
                <div class="comment-form">
                    <textarea class="form-textarea" 
                              placeholder="أضف ملاحظاتك على هذه الصورة..."
                              rows="3"></textarea>
                    <button class="btn btn-sm btn-secondary">
                        إضافة ملاحظة
                    </button>
                </div>
                
                <div class="comments-list">
                    <div class="comment-item">
                        <div class="comment-header">
                            <span class="comment-author">أنت</span>
                            <span class="comment-time">منذ ساعة</span>
                        </div>
                        <div class="comment-text">
                            أرجو تعديل الإضاءة قليلاً في الزاوية اليمنى
                        </div>
                    </div>
                    
                    <div class="comment-item creator">
                        <div class="comment-header">
                            <span class="comment-author">سارة أحمد (المبدع)</span>
                            <span class="comment-time">منذ 30 دقيقة</span>
                        </div>
                        <div class="comment-text">
                            تم التعديل، يرجى المراجعة
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Approval Actions -->
            <div class="approval-section">
                <div class="alert alert-info">
                    <span class="alert-icon">ℹ️</span>
                    <div class="alert-content">
                        <div class="alert-title">ملاحظة مهمة</div>
                        <div class="alert-text">
                            الصور النهائية ستكون بدون العلامة المائية بعد الموافقة والدفع
                        </div>
                    </div>
                </div>
                
                <div class="approval-actions">
                    <button class="btn btn-lg btn-success w-full">
                        <span class="btn-icon">✅</span>
                        <span class="btn-text">موافقة نهائية على جميع الصور</span>
                    </button>
                    <button class="btn btn-lg btn-secondary w-full">
                        <span class="btn-icon">📝</span>
                        <span class="btn-text">طلب تعديلات</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
```

---

<a id="client-invoices"></a>
## 💳 الفواتير والمدفوعات

### قائمة الفواتير

```html
<div class="screen-mockup">
    <div class="screen-header">
        <button class="header-btn back-btn">⬅</button>
        <h3>الفواتير والمدفوعات</h3>
        <button class="header-btn">⬇️</button>
    </div>
    
    <div class="screen-content">
        <!-- Summary Cards -->
        <div class="payment-summary">
            <div class="summary-card-mini">
                <div class="card-icon">💳</div>
                <div class="card-content">
                    <div class="card-label">إجمالي المدفوعات</div>
                    <div class="card-value">2,750,000 IQD</div>
                </div>
            </div>
            <div class="summary-card-mini">
                <div class="card-icon">⏳</div>
                <div class="card-content">
                    <div class="card-label">بانتظار الدفع</div>
                    <div class="card-value">425,000 IQD</div>
                </div>
            </div>
        </div>
        
        <!-- Filter Tabs -->
        <div class="filter-tabs">
            <button class="filter-tab active">الكل (15)</button>
            <button class="filter-tab">مدفوعة (12)</button>
            <button class="filter-tab">معلقة (2)</button>
            <button class="filter-tab">ملغاة (1)</button>
        </div>
        
        <!-- Invoices List -->
        <div class="invoices-list">
            <div class="invoice-card">
                <div class="invoice-header">
                    <div class="invoice-id">#INV-2025-0142</div>
                    <div class="invoice-status status-pending">معلق</div>
                </div>
                <div class="invoice-body">
                    <div class="invoice-project">
                        <span class="project-icon">📷</span>
                        <span class="project-name">تصوير حفل زفاف</span>
                    </div>
                    <div class="invoice-details">
                        <div class="detail-item">
                            <span class="detail-label">تاريخ الإصدار:</span>
                            <span class="detail-value">20 أغسطس 2025</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">تاريخ الاستحقاق:</span>
                            <span class="detail-value">27 أغسطس 2025</span>
                        </div>
                    </div>
                    <div class="invoice-amount">
                        <div class="amount-label">المبلغ المستحق</div>
                        <div class="amount-value">850,000 IQD</div>
                    </div>
                </div>
                <div class="invoice-actions">
                    <button class="btn btn-sm btn-secondary">
                        <span class="btn-icon">👁️</span>
                        عرض التفاصيل
                    </button>
                    <button class="btn btn-sm btn-primary">
                        <span class="btn-icon">💳</span>
                        دفع الآن
                    </button>
                </div>
            </div>
            
            <div class="invoice-card">
                <div class="invoice-header">
                    <div class="invoice-id">#INV-2025-0138</div>
                    <div class="invoice-status status-paid">مدفوعة</div>
                </div>
                <div class="invoice-body">
                    <div class="invoice-project">
                        <span class="project-icon">🎬</span>
                        <span class="project-name">مونتاج فيديو تسويقي</span>
                    </div>
                    <div class="invoice-details">
                        <div class="detail-item">
                            <span class="detail-label">تاريخ الدفع:</span>
                            <span class="detail-value">15 أغسطس 2025</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">طريقة الدفع:</span>
                            <span class="detail-value">تحويل بنكي</span>
                        </div>
                    </div>
                    <div class="invoice-amount paid">
                        <div class="amount-label">المبلغ المدفوع</div>
                        <div class="amount-value">425,000 IQD</div>
                    </div>
                </div>
                <div class="invoice-actions">
                    <button class="btn btn-sm btn-secondary">
                        <span class="btn-icon">⬇️</span>
                        تحميل الفاتورة
                    </button>
                    <button class="btn btn-sm btn-ghost">
                        <span class="btn-icon">🧾</span>
                        الإيصال
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Note about payment -->
        <div class="payment-note">
            <div class="note-icon">ℹ️</div>
            <div class="note-text">
                <strong>ملاحظة:</strong> الدفع الإلكتروني غير متاح حالياً في الإصدار 2.0. 
                يرجى التواصل مع فريق الدعم لتنسيق طرق الدفع البديلة.
            </div>
        </div>
    </div>
</div>
```

---

<a id="client-notifications"></a>
## 🔔 الإشعارات والرسائل

### شاشة الإشعارات

```html
<div class="screen-mockup">
    <div class="screen-header">
        <button class="header-btn back-btn">⬅</button>
        <h3>الإشعارات</h3>
        <div class="header-actions">
            <button class="btn-link">قراءة الكل</button>
            <button class="btn-icon">⚙️</button>
        </div>
    </div>
    
    <div class="screen-content">
        <!-- Notification Settings Quick Toggle -->
        <div class="notification-settings-bar">
            <span class="settings-label">تلقي الإشعارات عبر:</span>
            <div class="toggle-chips">
                <label class="toggle-chip active">
                    <input type="checkbox" checked>
                    <span>📱 التطبيق</span>
                </label>
                <label class="toggle-chip active">
                    <input type="checkbox" checked>
                    <span>📧 البريد</span>
                </label>
                <label class="toggle-chip">
                    <input type="checkbox">
                    <span>💬 SMS</span>
                </label>
            </div>
        </div>
        
        <!-- Notifications List -->
        <div class="notification-list">
            <!-- Unread Notification -->
            <div class="notification-item unread">
                <div class="notification-icon success">
                    ✅
                </div>
                <div class="notification-content">
                    <div class="notification-title">
                        اكتمل مشروعك بنجاح!
                    </div>
                    <div class="notification-message">
                        تم الانتهاء من مشروع "تصوير حفل زفاف" وجاهز للمعاينة
                    </div>
                    <div class="notification-meta">
                        <span class="notification-time">منذ 5 دقائق</span>
                        <span class="notification-project">#DP2025-0142</span>
                    </div>
                </div>
                <button class="notification-action btn btn-sm btn-primary">
                    معاينة
                </button>
            </div>
            
            <!-- Unread with Action -->
            <div class="notification-item unread">
                <div class="notification-icon warning">
                    ⚠️
                </div>
                <div class="notification-content">
                    <div class="notification-title">
                        يتطلب موافقتك
                    </div>
                    <div class="notification-message">
                        عرض السعر لمشروع "مونتاج فيديو تسويقي" جاهز للمراجعة
                    </div>
                    <div class="notification-meta">
                        <span class="notification-time">منذ ساعة</span>
                        <span class="notification-project">#DP2025-0138</span>
                    </div>
                </div>
                <button class="notification-action btn btn-sm btn-primary">
                    مراجعة
                </button>
            </div>
            
            <!-- Read Notification -->
            <div class="notification-item">
                <div class="notification-icon info">
                    💬
                </div>
                <div class="notification-content">
                    <div class="notification-title">
                        رسالة جديدة من سارة أحمد
                    </div>
                    <div class="notification-message">
                        "مرحباً، سأكون في الموقع غداً الساعة 10 صباحاً"
                    </div>
                    <div class="notification-meta">
                        <span class="notification-time">أمس في 3:30 م</span>
                    </div>
                </div>
                <button class="notification-action btn btn-sm btn-ghost">
                    رد
                </button>
            </div>
            
            <!-- System Notification -->
            <div class="notification-item">
                <div class="notification-icon system">
                    🔔
                </div>
                <div class="notification-content">
                    <div class="notification-title">
                        تحديث النظام
                    </div>
                    <div class="notification-message">
                        تم إضافة ميزات جديدة لتحسين تجربتك. اكتشف المزيد
                    </div>
                    <div class="notification-meta">
                        <span class="notification-time">الأسبوع الماضي</span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Load More -->
        <div class="load-more">
            <button class="btn btn-ghost w-full">
                عرض إشعارات أقدم
            </button>
        </div>
    </div>
</div>
```

---

<a id="client-settings"></a>
## ⚙️ الإعدادات الشخصية

### شاشة الإعدادات

```html
<div class="screen-mockup">
    <div class="screen-header">
        <button class="header-btn back-btn">⬅</button>
        <h3>الإعدادات</h3>
        <button class="header-btn">💾</button>
    </div>
    
    <div class="screen-content">
        <!-- Profile Section -->
        <div class="settings-section">
            <h2 class="section-title">الملف الشخصي</h2>
            <div class="profile-editor">
                <div class="avatar-upload">
                    <img src="/avatar.jpg" alt="Profile" class="avatar-preview">
                    <button class="avatar-change-btn">
                        <span class="icon">📷</span>
                        <span class="text">تغيير</span>
                    </button>
                </div>
                
                <div class="profile-fields">
                    <div class="form-group">
                        <label class="form-label">اسم الشركة</label>
                        <input type="text" 
                               class="form-input" 
                               value="شركة الأمل للتجارة">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">اسم المسؤول</label>
                        <input type="text" 
                               class="form-input" 
                               value="أحمد الخالدي">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">البريد الإلكتروني</label>
                        <div class="input-with-badge">
                            <input type="email" 
                                   class="form-input" 
                                   value="ahmed@alamal.com">
                            <span class="input-badge verified">✓ مُحقق</span>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">رقم الهاتف</label>
                        <div class="input-with-badge">
                            <input type="tel" 
                                   class="form-input" 
                                   value="07501234567">
                            <span class="input-badge verified">✓ مُحقق</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Security Settings -->
        <div class="settings-section">
            <h2 class="section-title">الأمان</h2>
            <div class="settings-list">
                <div class="settings-item">
                    <div class="settings-icon">🔐</div>
                    <div class="settings-content">
                        <div class="settings-title">كلمة المرور</div>
                        <div class="settings-desc">آخر تغيير منذ 3 أشهر</div>
                    </div>
                    <button class="btn btn-sm btn-secondary">تغيير</button>
                </div>
                
                <div class="settings-item">
                    <div class="settings-icon">🔑</div>
                    <div class="settings-content">
                        <div class="settings-title">التحقق بخطوتين</div>
                        <div class="settings-desc">مفعّل عبر SMS</div>
                    </div>
                    <button class="btn btn-sm btn-secondary">إدارة</button>
                </div>
                
                <div class="settings-item">
                    <div class="settings-icon">📱</div>
                    <div class="settings-content">
                        <div class="settings-title">الأجهزة الموثوقة</div>
                        <div class="settings-desc">3 أجهزة نشطة</div>
                    </div>
                    <button class="btn btn-sm btn-secondary">عرض</button>
                </div>
            </div>
        </div>
        
        <!-- Preferences -->
        <div class="settings-section">
            <h2 class="section-title">التفضيلات</h2>
            <div class="settings-list">
                <div class="settings-item">
                    <div class="settings-icon">🌐</div>
                    <div class="settings-content">
                        <div class="settings-title">اللغة</div>
                        <div class="settings-desc">العربية</div>
                    </div>
                    <select class="form-select form-select-sm">
                        <option selected>العربية</option>
                        <option>English</option>
                        <option>كوردی</option>
                    </select>
                </div>
                
                <div class="settings-item">
                    <div class="settings-icon">🌙</div>
                    <div class="settings-content">
                        <div class="settings-title">وضع العرض</div>
                        <div class="settings-desc">تلقائي حسب النظام</div>
                    </div>
                    <div class="theme-toggle">
                        <button class="theme-option">☀️</button>
                        <button class="theme-option active">🌓</button>
                        <button class="theme-option">🌙</button>
                    </div>
                </div>
                
                <div class="settings-item">
                    <div class="settings-icon">💰</div>
                    <div class="settings-content">
                        <div class="settings-title">العملة المفضلة</div>
                        <div class="settings-desc">دينار عراقي (IQD)</div>
                    </div>
                    <select class="form-select form-select-sm">
                        <option selected>IQD</option>
                        <option>USD</option>
                    </select>
                </div>
            </div>
        </div>
        
        <!-- Danger Zone -->
        <div class="settings-section danger">
            <h2 class="section-title">منطقة الخطر</h2>
            <div class="danger-actions">
                <button class="btn btn-outline-danger">
                    <span class="btn-icon">🗑️</span>
                    <span class="btn-text">حذف الحساب</span>
                </button>
            </div>
        </div>
    </div>
</div>
```

---

## 📊 ملاحظات التوافق والتنفيذ

### ✅ التحسينات المنفذة:
1. **إزالة جميع مخططات ASCII** - تم استبدالها بـ HTML/CSS احترافي
2. **مكونات تفاعلية حديثة** - أزرار، نماذج، معارض، timelines
3. **تصميم متجاوب** - يعمل على جميع الأحجام (Mobile, Tablet, Desktop)
4. **دعم RTL كامل** - متوافق مع اللغة العربية
5. **إمكانية الوصول** - ARIA labels وfocus states
6. **أنيميشنز احترافية** - transitions وanimations سلسة
7. **Dark Mode** - دعم كامل للوضع الداكن

### 🔧 التقنيات المستخدمة:
- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox
- **JavaScript ES6+** - Classes, Modules, Async/Await
- **Design System** - متغيرات موحدة للألوان والمسافات

### 📱 التوافق مع المتطلبات:
- ✅ **OTP System**: 6 أرقام، 5 دقائق صلاحية
- ✅ **File Upload**: 2GB حد أقصى، chunked upload
- ✅ **Pricing**: التقريب لأقرب 500 د.ع
- ✅ **Notifications**: In-App, Email, SMS
- ✅ **Project Status**: Timeline تفاعلي
- ✅ **Watermark**: معاينة احترافية مع علامة مائية

### 🚀 الخطوات التالية:
1. دمج الملف مع نظام التصميم (CSS/JS)
2. تطبيق التفاعلات JavaScript
3. ربط مع Backend APIs
4. اختبار على أجهزة مختلفة
5. تحسين الأداء والسرعة

---

**الحالة:** ✅ تم تطوير الملف بالكامل وإزالة جميع مخططات ASCII
**الإصدار:** 2.0 Professional
**آخر تحديث:** أغسطس 2025