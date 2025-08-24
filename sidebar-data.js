// Sidebar Navigation Data
const sidebarData = [
    {
        title: 'الرئيسية',
        id: 'home',
        items: [
            { name: 'نظرة عامة', path: '/documentation/00-overview/00-introduction' }
        ]
    },
    {
        title: 'البداية',
        id: 'getting-started',
        items: [
            { name: 'المتطلبات', path: '/documentation/01-requirements/00-requirements-v2.0' }
        ]
    },
    {
        title: 'قاعدة البيانات',
        id: 'database',
        items: [
            { name: 'قاموس البيانات', path: '/documentation/02-database/00-data-dictionary' },
            { name: 'مخطط قاعدة البيانات', path: '/documentation/02-database/01-database-schema' },
            { name: 'الفهارس والاستعلامات', path: '/documentation/02-database/02-indexes-and-queries' }
        ]
    },
    {
        title: 'الأساسيات',
        id: 'core',
        items: [
            { name: 'المصادقة', path: '/documentation/03-api/core/01-authentication' },
            { name: 'تحديد المعدل', path: '/documentation/03-api/core/02-rate-limiting' },
            { name: 'WebSockets', path: '/documentation/03-api/core/03-websockets' },
            { name: 'معالجة الأخطاء', path: '/documentation/03-api/core/04-error-handling' }
        ]
    },
    {
        title: 'المميزات',
        id: 'features',
        items: [
            { name: 'المبدعون', path: '/documentation/03-api/features/01-creators' },
            { name: 'العملاء', path: '/documentation/03-api/features/02-clients' },
            { name: 'المشاريع', path: '/documentation/03-api/features/03-projects' },
            { name: 'التسعير', path: '/documentation/03-api/features/04-pricing' },
            { name: 'التخزين', path: '/documentation/03-api/features/05-storage' },
            { name: 'الإشعارات', path: '/documentation/03-api/features/06-notifications' },
            { name: 'المراسلة', path: '/documentation/03-api/features/07-messaging' },
            { name: 'الموظفون', path: '/documentation/03-api/features/08-salaried-employees' }
        ]
    },
    {
        title: 'الإدارة',
        id: 'admin',
        items: [
            { name: 'لوحة المدير', path: '/documentation/03-api/admin/01-admin-panel' },
            { name: 'الحوكمة', path: '/documentation/03-api/admin/02-governance' },
            { name: 'إدارة البيانات', path: '/documentation/03-api/admin/03-seeds-management' }
        ]
    },
    {
        title: 'التكاملات',
        id: 'integrations',
        items: [
            { name: 'الخدمات الخارجية', path: '/documentation/03-api/integrations/01-external-services' },
            { name: 'Webhooks', path: '/documentation/03-api/integrations/02-webhooks' },
            { name: 'التقنيات المتقدمة', path: '/documentation/03-api/integrations/03-advanced-technical' }
        ]
    },
    {
        title: 'التطوير',
        id: 'development',
        items: [
            { name: 'دليل المطورين', path: '/documentation/04-development/00-getting-started' },
            { name: 'الإعداد المحلي', path: '/documentation/04-development/01-local-setup' },
            { name: 'متغيرات البيئة', path: '/documentation/04-development/02-environment-variables' },
            { name: 'سير العمل', path: '/documentation/04-development/03-development-workflow' },
            { name: 'استراتيجية الاختبار', path: '/documentation/04-development/04-testing-strategy' }
        ]
    },
    {
        title: 'الواجهات',
        id: 'interfaces',
        items: [
            { name: 'الجوال', path: '/documentation/05-mobile/00-mobile-overview' },
            { name: 'الويب', path: '/documentation/06-frontend/00-frontend-overview' }
        ]
    },
    {
        title: 'Frontend',
        id: 'frontend',
        items: [
            { name: 'UX Flows', path: '/documentation/06-frontend/04-ux-flows' },
            { name: 'Client Screens', path: '/documentation/06-frontend/05-ui-screens-client' },
            { name: 'Admin Screens', path: '/documentation/06-frontend/06-ui-screens-admin' },
            { name: 'Creator Screens', path: '/documentation/06-frontend/07-ui-screens-creator' },
            { name: 'Salaried Screens', path: '/documentation/06-frontend/08-ui-screens-salaried' }
        ]
    },
    {
        title: 'الأمان',
        id: 'security',
        items: [
            { name: 'نظرة عامة', path: '/documentation/07-security/00-security-overview' },
            { name: 'نموذج التهديدات', path: '/documentation/07-security/01-threat-model' },
            { name: 'إدارة المفاتيح', path: '/documentation/07-security/02-key-management' }
        ]
    },
    {
        title: 'العمليات',
        id: 'operations',
        items: [
            { name: 'نظرة عامة', path: '/documentation/08-operations/00-operations-overview' },
            { name: 'النشر', path: '/documentation/08-operations/01-deployment' },
            { name: 'الاستجابة للحوادث', path: '/documentation/08-operations/02-incident-response' }
        ]
    },
    {
        title: 'المراجع',
        id: 'reference',
        items: [
            { name: 'الموارد', path: '/documentation/99-reference/00-resources' },
            { name: 'المصطلحات', path: '/documentation/99-reference/01-glossary' },
            { name: 'المعايير', path: '/documentation/99-reference/02-enums-standard' },
            { name: 'ربط الروابط', path: '/documentation/99-reference/03-link-alias-mapping' },
            { name: 'قواعد التسمية', path: '/documentation/99-reference/04-naming-conventions' },
            { name: 'مصفوفة الأدوار', path: '/documentation/99-reference/05-roles-matrix' }
        ]
    }
];

// Sample content for pages
const pageContent = {
    '/': `
        <section class="home-hero" data-aos="fade-up" data-aos-duration="700">
            <div class="home-hero-inner">
                <h1 class="home-title">دليل Depth — وثائق منظمة لتفهم المنصة خلال دقائق</h1>
                <p class="home-subtitle">مرجع موحد يشرح أهداف المنصة، أقسام التوثيق، ومسارات التعلم خطوة بخطوة. تصميم هادئ ومركز يساعدك على الوصول بسرعة.</p>
                <div class="home-cta">
                    <a class="btn btn-primary" href="#/documentation/00-overview/00-introduction">ابدأ من النظرة العامة</a>
                    <a class="btn btn-ghost" href="#/documentation/01-requirements/00-requirements-v2.0">المتطلبات</a>
                </div>
            </div>
        </section>

        <section class="home-grid" data-aos="fade-up" data-aos-delay="100">
            <div class="home-card" tabindex="0">
                <div class="icon"><i class="home-icon" data-lucide="grid-2x2"></i></div>
                <h3>هيكلة التوثيق</h3>
                <p>نظرة شاملة على أقسام الدليل وكيف ترتبط ببعضها لضمان رحلة تعلم واضحة.</p>
                <div class="home-links">
                    <a href="#/documentation/00-overview/00-introduction">النظرة العامة</a>
                    <a href="#/documentation/99-reference/01-glossary">المصطلحات</a>
                    <a href="#/documentation/99-reference/04-naming-conventions">قواعد التسمية</a>
                </div>
            </div>

            <div class="home-card" tabindex="0" data-aos="fade-up" data-aos-delay="150">
                <div class="icon"><i class="home-icon" data-lucide="database"></i></div>
                <h3>قلب البيانات</h3>
                <p>تعرف على القاموس والمخطط والفهارس لتحصل على أداء واستعلامات فعالة.</p>
                <div class="home-links">
                    <a href="#/documentation/02-database/00-data-dictionary">قاموس البيانات</a>
                    <a href="#/documentation/02-database/01-database-schema">مخطط قاعدة البيانات</a>
                    <a href="#/documentation/02-database/02-indexes-and-queries">الفهارس والاستعلامات</a>
                </div>
            </div>

            <div class="home-card" tabindex="0" data-aos="fade-up" data-aos-delay="200">
                <div class="icon"><i class="home-icon" data-lucide="code-2"></i></div>
                <h3>واجهات البرمجة</h3>
                <p>مصادقة، تحديد معدل، WebSockets، ومعالجة أخطاء — أساس واجهات مرنة وآمنة.</p>
                <div class="home-links">
                    <a href="#/documentation/03-api/core/01-authentication">المصادقة</a>
                    <a href="#/documentation/03-api/core/02-rate-limiting">تحديد المعدل</a>
                    <a href="#/documentation/03-api/core/03-websockets">WebSockets</a>
                </div>
            </div>

            <div class="home-card" tabindex="0" data-aos="fade-up" data-aos-delay="250">
                <div class="icon"><i class="home-icon" data-lucide="sparkles"></i></div>
                <h3>قدرات المنصة</h3>
                <p>المبدعون والعملاء والمشاريع والتسعير والتخزين والإشعارات والمراسلة.</p>
                <div class="home-links">
                    <a href="#/documentation/03-api/features/01-creators">المبدعون</a>
                    <a href="#/documentation/03-api/features/03-projects">المشاريع</a>
                    <a href="#/documentation/03-api/features/04-pricing">التسعير</a>
                </div>
            </div>

            <div class="home-card" tabindex="0" data-aos="fade-up" data-aos-delay="300">
                <div class="icon"><i class="home-icon" data-lucide="shield"></i></div>
                <h3>الأمان</h3>
                <p>نموذج التهديدات، إدارة المفاتيح، وأفضل ممارسات الحماية.</p>
                <div class="home-links">
                    <a href="#/documentation/07-security/00-security-overview">نظرة عامة</a>
                    <a href="#/documentation/07-security/01-threat-model">نموذج التهديدات</a>
                    <a href="#/documentation/07-security/02-key-management">إدارة المفاتيح</a>
                </div>
            </div>

            <div class="home-card" tabindex="0" data-aos="fade-up" data-aos-delay="350">
                <div class="icon"><i class="home-icon" data-lucide="settings-2"></i></div>
                <h3>التشغيل والنشر</h3>
                <p>التشغيل، النشر، والاستجابة للحوادث — بوثائق عملية ومباشرة.</p>
                <div class="home-links">
                    <a href="#/documentation/08-operations/01-deployment">النشر</a>
                    <a href="#/documentation/08-operations/02-incident-response">الاستجابة للحوادث</a>
                </div>
            </div>
        </section>

        <section class="home-steps" data-aos="fade-up" data-aos-delay="150">
            <h2>ابدأ خلال 3 خطوات</h2>
            <ol>
                <li><a href="#/documentation/00-overview/00-introduction">اقرأ النظرة العامة</a></li>
                <li><a href="#/documentation/04-development/00-getting-started">أعد بيئة التطوير</a></li>
                <li><a href="#/documentation/03-api/core/01-authentication">جرّب أول طلب API</a></li>
            </ol>
        </section>
    `,
    '/documentation/00-overview/00-introduction': `
        <h1>نظرة عامة على المنصة</h1>
        <p>منصة Depth هي نظام متكامل لإدارة المشاريع الإبداعية يربط بين المبدعين والعملاء في بيئة عمل متطورة.</p>
        
        <h2>الرؤية</h2>
        <p>نسعى لتوفير بيئة عمل متكاملة تربط بين المبدعين والعملاء، وتسهل إدارة المشاريع الإبداعية من البداية حتى التسليم.</p>
        
        <h2>الأهداف الرئيسية</h2>
        <ul>
            <li>تسهيل التواصل بين المبدعين والعملاء</li>
            <li>أتمتة العمليات الإدارية والمالية</li>
            <li>توفير أدوات قوية للتتبع والتحليل</li>
            <li>ضمان الجودة والالتزام بالمواعيد</li>
            <li>تحسين تجربة جميع المستخدمين</li>
        </ul>
        
        <h3>البنية العامة</h3>
        <p>تتكون المنصة من عدة أنظمة فرعية متكاملة:</p>
        <ul>
            <li><strong>نظام إدارة المستخدمين:</strong> يدعم المبدعين، العملاء، والموظفين</li>
            <li><strong>نظام إدارة المشاريع:</strong> من التخطيط حتى التسليم</li>
            <li><strong>نظام التسعير:</strong> مرن وقابل للتخصيص</li>
            <li><strong>نظام الإشعارات:</strong> متعدد القنوات</li>
            <li><strong>نظام التقارير:</strong> تحليلات شاملة</li>
        </ul>

        <h3>واجهات Frontend — روابط سريعة</h3>
        <ul>
            <li><a href="#/documentation/06-frontend/04-ux-flows">UX Flows</a></li>
            <li><a href="#/documentation/06-frontend/05-ui-screens-client">Client Screens</a></li>
            <li><a href="#/documentation/06-frontend/06-ui-screens-admin">Admin Screens</a></li>
            <li><a href="#/documentation/06-frontend/07-ui-screens-creator">Creator Screens</a></li>
            <li><a href="#/documentation/06-frontend/08-ui-screens-salaried">Salaried Screens</a></li>
        </ul>
    `,
    '/documentation/03-api/core/01-authentication': `
        <h1>نظام المصادقة</h1>
        <p>يوفر نظام المصادقة في Depth آلية آمنة ومرنة للتحقق من هوية المستخدمين وإدارة الأذونات.</p>
        
        <h2>أنواع المصادقة</h2>
        
        <h3>1. JWT Tokens</h3>
        <p>نستخدم JSON Web Tokens للمصادقة الأساسية مع الميزات التالية:</p>
        <ul>
            <li>توكينات آمنة مع تشفير قوي</li>
            <li>انتهاء صلاحية قابل للتخصيص</li>
            <li>تجديد تلقائي للتوكينات</li>
            <li>إبطال فوري عند الحاجة</li>
        </ul>
        
        <h3>2. OAuth 2.0</h3>
        <p>دعم كامل لـ OAuth للتكامل مع خدمات خارجية مثل:</p>
        <ul>
            <li>Google OAuth</li>
            <li>Apple Sign In</li>
            <li>Microsoft Azure AD</li>
            <li>LinkedIn</li>
        </ul>
        
        <h2>نقاط النهاية الأساسية</h2>
        <p>جميع نقاط النهاية الخاصة بالمصادقة:</p>
        
        <h3>تسجيل الدخول</h3>
        <pre><code>POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}</code></pre>
        
        <h3>إنشاء حساب جديد</h3>
        <pre><code>POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password",
  "role": "creator|client|admin"
}</code></pre>
        
        <h3>تجديد التوكين</h3>
        <pre><code>POST /api/auth/refresh
Authorization: Bearer {refresh_token}</code></pre>
        
        <h3>تسجيل الخروج</h3>
        <pre><code>POST /api/auth/logout
Authorization: Bearer {access_token}</code></pre>
        
        <h2>أنواع المستخدمين</h2>
        <ul>
            <li><strong>المبدعون (Creators):</strong> المصممون والمطورون</li>
            <li><strong>العملاء (Clients):</strong> أصحاب المشاريع</li>
            <li><strong>الموظفون (Staff):</strong> فريق إدارة المنصة</li>
            <li><strong>المديرون (Admins):</strong> مديرو النظام</li>
        </ul>
    `,
    '/documentation/02-database/00-data-dictionary': `
        <h1>قاموس البيانات</h1>
        <p>دليل شامل لجميع الجداول والحقول في قاعدة بيانات منصة Depth.</p>
        
        <h2>الجداول الأساسية</h2>
        
    <h3>جدول المستخدمين (users)</h3>
    <table style="border-collapse: collapse; margin: 16px 0;">
            <thead>
                <tr style="background: var(--bg-secondary);">
                    <th style="border: 1px solid var(--border); padding: 8px; text-align: right;">الحقل</th>
                    <th style="border: 1px solid var(--border); padding: 8px; text-align: right;">النوع</th>
                    <th style="border: 1px solid var(--border); padding: 8px; text-align: right;">الوصف</th>
                    <th style="border: 1px solid var(--border); padding: 8px; text-align: center;">مطلوب</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: 1px solid var(--border); padding: 8px;">id</td>
                    <td style="border: 1px solid var(--border); padding: 8px;">UUID</td>
                    <td style="border: 1px solid var(--border); padding: 8px;">المعرف الفريد</td>
                    <td style="border: 1px solid var(--border); padding: 8px; text-align: center;">✓</td>
                </tr>
                <tr>
                    <td style="border: 1px solid var(--border); padding: 8px;">email</td>
                    <td style="border: 1px solid var(--border); padding: 8px;">VARCHAR(255)</td>
                    <td style="border: 1px solid var(--border); padding: 8px;">البريد الإلكتروني</td>
                    <td style="border: 1px solid var(--border); padding: 8px; text-align: center;">✓</td>
                </tr>
                <tr>
                    <td style="border: 1px solid var(--border); padding: 8px;">role</td>
                    <td style="border: 1px solid var(--border); padding: 8px;">ENUM</td>
                    <td style="border: 1px solid var(--border); padding: 8px;">نوع المستخدم</td>
                    <td style="border: 1px solid var(--border); padding: 8px; text-align: center;">✓</td>
                </tr>
                <tr>
                    <td style="border: 1px solid var(--border); padding: 8px;">created_at</td>
                    <td style="border: 1px solid var(--border); padding: 8px;">TIMESTAMP</td>
                    <td style="border: 1px solid var(--border); padding: 8px;">تاريخ الإنشاء</td>
                    <td style="border: 1px solid var(--border); padding: 8px; text-align: center;">✓</td>
                </tr>
            </tbody>
        </table>
        
        <h3>جدول المشاريع (projects)</h3>
        <p>يحتوي على معلومات جميع المشاريع في المنصة</p>
        <ul>
            <li><strong>id:</strong> المعرف الفريد للمشروع</li>
            <li><strong>title:</strong> عنوان المشروع</li>
            <li><strong>description:</strong> وصف تفصيلي</li>
            <li><strong>status:</strong> حالة المشروع</li>
            <li><strong>budget:</strong> الميزانية المخصصة</li>
            <li><strong>deadline:</strong> الموعد النهائي</li>
            <li><strong>client_id:</strong> معرف العميل</li>
            <li><strong>creator_id:</strong> معرف المبدع المسؤول</li>
        </ul>
        
        <h2>الفهارس المستخدمة</h2>
        <p>لتحسين الأداء، تم إنشاء الفهارس التالية:</p>
        <ul>
            <li>فهرس فريد على البريد الإلكتروني</li>
            <li>فهرس مركب على (project_id, user_id)</li>
            <li>فهرس على تاريخ الإنشاء للتصفية السريعة</li>
            <li>فهرس النص الكامل على عناوين المشاريع</li>
        </ul>
    `
};
