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
<div class="screen-mockup">
    <div class="screen-header">
        <button class="header-btn">
            <span class="icon">🌐</span> AR
        </button>
        <h3>منصة Depth</h3>
        <button class="header-btn" data-theme-toggle>
            <span class="theme-icon">🌙</span>
        </button>
    </div>
    <div class="screen-content">
        <div class="auth-container">
            <div class="logo-section">
                <img src="/logo.svg" alt="Depth" class="logo">
                <h2>مرحباً بك في منصة Depth</h2>
                <p class="subtitle">منصة الإبداع الرقمي الأولى في العراق</p>
            </div>
            
            <form class="auth-form" data-validate>
                <div class="form-tabs">
                    <button type="button" class="tab active" data-tab="login">
                        تسجيل دخول
                    </button>
                    <button type="button" class="tab" data-tab="register">
                        حساب جديد
                    </button>
                </div>
                
                <div class="form-group">
                    <label class="form-label">رقم الهاتف أو البريد الإلكتروني</label>
                    <div class="input-with-icon">
                        <span class="input-icon">📱</span>
                        <input type="text" 
                               class="form-input" 
                               placeholder="750XXXXXXX أو email@example.com"
                               data-validate="required,phone|email">
                    </div>
                </div>
                
                <div class="form-group" data-tab-content="register">
                    <label class="form-label">اسم الشركة</label>
                    <div class="input-with-icon">
                        <span class="input-icon">🏢</span>
                        <input type="text" 
                               class="form-input" 
                               placeholder="اسم شركتك أو مؤسستك"
                               data-validate="required,minLength:3">
                    </div>
                </div>
                
                <button type="submit" class="btn btn-primary btn-lg w-full">
                    <span class="btn-text">إرسال رمز التحقق</span>
                    <span class="btn-icon">←</span>
                </button>
                
                <div class="divider">
                    <span>أو</span>
                </div>
                
                <div class="social-login">
                    <button type="button" class="btn btn-secondary social-btn">
                        <img src="/google.svg" alt="Google">
                        تسجيل بواسطة Google
                    </button>
                </div>
                
                <div class="form-footer">
                    <p class="text-sm text-muted">
                        بالمتابعة، أنت توافق على 
                        <a href="#terms">الشروط والأحكام</a>
                        و
                        <a href="#privacy">سياسة الخصوصية</a>
                    </p>
                </div>
            </form>
        </div>
    </div>
</div>
```

### شاشة التحقق OTP المطورة

```html
<div class="screen-mockup">
    <div class="screen-header">
        <button class="header-btn back-btn">⬅ رجوع</button>
        <h3>تأكيد رقم الهاتف</h3>
        <button class="header-btn close-btn">❌</button>
    </div>
    <div class="screen-content">
        <div class="otp-container">
            <div class="otp-icon animate-bounce">🔐</div>
            <h2>أدخل رمز التحقق</h2>
            <p class="otp-description">
                أرسلنا رمز التحقق المكوّن من 6 أرقام إلى
                <strong class="phone-number">+964 750 123 4567</strong>
            </p>
            
            <div class="otp-inputs" data-otp-container>
                <input type="text" class="otp-input" maxlength="1" inputmode="numeric" data-index="0">
                <input type="text" class="otp-input" maxlength="1" inputmode="numeric" data-index="1">
                <input type="text" class="otp-input" maxlength="1" inputmode="numeric" data-index="2">
                <input type="text" class="otp-input" maxlength="1" inputmode="numeric" data-index="3">
                <input type="text" class="otp-input" maxlength="1" inputmode="numeric" data-index="4">
                <input type="text" class="otp-input" maxlength="1" inputmode="numeric" data-index="5">
            </div>
            
            <div class="otp-timer">
                <span class="timer-icon">⏰</span>
                <span class="timer-text">باقي <span data-otp-timer data-seconds="300">5:00</span> دقيقة</span>
            </div>
            
            <button class="btn btn-primary btn-lg w-full" data-otp-submit disabled>
                <span class="btn-text">تأكيد وإكمال التسجيل</span>
                <span class="spinner spinner-sm hidden"></span>
            </button>
            
            <div class="otp-resend">
                <p>لم تستلم الرمز؟</p>
                <button class="btn btn-ghost" data-otp-resend disabled>
                    🔄 إعادة الإرسال
                </button>
            </div>
            
            <div class="otp-help">
                <details class="help-accordion">
                    <summary>تحتاج مساعدة؟</summary>
                    <div class="help-content">
                        <p>تأكد من:</p>
                        <ul>
                            <li>رقمك صحيح ومن شبكة عراقية</li>
                            <li>لديك تغطية شبكة جيدة</li>
                            <li>تحقق من رسائل SMS المحظورة</li>
                        </ul>
                        <button class="btn btn-sm btn-secondary">
                            💬 تواصل مع الدعم
                        </button>
                    </div>
                </details>
            </div>
        </div>
    </div>
</div>
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
        <h3>رفع