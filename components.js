// UI Components
class UIComponents {
    // Generate navigation item
    static createNavItem(item, isActive = false) {
        const a = document.createElement('a');
        a.href = `#${item.path}`;
        a.className = `nav-item ${isActive ? 'active' : ''}`;
        a.textContent = item.name;
        a.onclick = (e) => {
            e.preventDefault();
            window.app.navigate(item.path);
        };
        return a;
    }

    // Generate navigation section
    static createNavSection(section) {
        const div = document.createElement('div');
        div.className = 'nav-section';
        
        const title = document.createElement('div');
        title.className = 'nav-section-title';
        title.textContent = section.title;
        title.onclick = () => {
            title.classList.toggle('collapsed');
            items.classList.toggle('collapsed');
        };
        
        const items = document.createElement('div');
        items.className = 'nav-section-items';
        
        section.items.forEach(item => {
            items.appendChild(this.createNavItem(item));
        });
        
        div.appendChild(title);
        div.appendChild(items);
        return div;
    }

    // Generate breadcrumb
    static updateBreadcrumbs(path) {
        const breadcrumbs = document.getElementById('breadcrumbs');
        if (!breadcrumbs) return;

        // بناء DOM آمن لفتات الخبز
        breadcrumbs.innerHTML = '';

        const addLink = (text, href, disabled = false) => {
            const a = document.createElement('a');
            a.textContent = text;
            a.href = href || '#';
            if (disabled) {
                a.classList.add('disabled');
                a.setAttribute('tabindex', '-1');
            }
            breadcrumbs.appendChild(a);
        };

        const addSpan = (text) => {
            const s = document.createElement('span');
            s.textContent = text;
            breadcrumbs.appendChild(s);
        };

        // الرئيسية
        addLink('الرئيسية', '#/');

        // ابحث عن العنصر المطابق للمسار داخل السايدبار
        let foundSection = null;
        let foundItem = null;
        try {
            for (const section of sidebarData) {
                const item = (section.items || []).find(it => it.path === path);
                if (item) {
                    foundSection = section;
                    foundItem = item;
                    break;
                }
            }
        } catch (_) {}

        if (foundSection && foundItem) {
            // أضف عنوان القسم كرابط لأول عنصر ضمن نفس القسم
            const firstItem = (foundSection.items && foundSection.items[0]) ? foundSection.items[0] : null;
            if (firstItem) {
                addLink(foundSection.title, `#${firstItem.path}`);
            } else {
                addLink(foundSection.title, '#', true);
            }
            // أضف اسم الصفحة الحالية كنص ثابت
            addSpan(foundItem.name);
            return;
        }

        // في حال لم نجد العنصر في السايدبار، اعرض اسم أخير جزء من المسار بشكل مبسّط
        const parts = path.split('/').filter(Boolean);
        if (parts.length) addSpan(this.formatPathName(parts[parts.length - 1]));
    }

    // Format path name for display
    static formatPathName(path) {
        const nameMap = {
            // Main sections
            'documentation': 'التوثيق',
            
            // Overview
            '00-overview': 'نظرة عامة',
            '00-introduction': 'مقدمة',
            
            // Requirements
            '01-requirements': 'المتطلبات',
            '00-requirements-v2.0': 'المتطلبات v2.0',
            
            // Database
            '02-database': 'قاعدة البيانات',
            '00-data-dictionary': 'قاموس البيانات',
            '01-database-schema': 'مخطط قاعدة البيانات',
            '02-indexes-and-queries': 'الفهارس والاستعلامات',
            
            // API Core
            '03-api': 'واجهات البرمجة',
            'core': 'الأساسيات',
            '01-authentication': 'المصادقة',
            '02-rate-limiting': 'تحديد المعدل',
            '03-websockets': 'WebSockets',
            '04-error-handling': 'معالجة الأخطاء',
            
            // Features
            'features': 'المميزات',
            '01-creators': 'المبدعون',
            '02-clients': 'العملاء',
            '03-projects': 'المشاريع',
            '04-pricing': 'التسعير',
            '05-storage': 'التخزين',
            '06-notifications': 'الإشعارات',
            '07-messaging': 'المراسلة',
            '08-salaried-employees': 'الموظفون',
            
            // Admin
            'admin': 'الإدارة',
            '01-admin-panel': 'لوحة المدير',
            '02-governance': 'الحوكمة',
            '03-seeds-management': 'إدارة البيانات',
            
            // Integrations
            'integrations': 'التكاملات',
            '01-external-services': 'الخدمات الخارجية',
            '02-webhooks': 'Webhooks',
            '03-advanced-technical': 'التقنيات المتقدمة',
            
            // Development
            '04-development': 'التطوير',
            '00-getting-started': 'دليل المطورين',
            '01-local-setup': 'الإعداد المحلي',
            '02-environment-variables': 'متغيرات البيئة',
            '03-development-workflow': 'سير العمل',
            '04-testing-strategy': 'استراتيجية الاختبار',
            
            // Mobile & Frontend
            '05-mobile': 'الجوال',
            '00-mobile-overview': 'نظرة عامة - الجوال',
            '06-frontend': 'الواجهات',
            '00-frontend-overview': 'نظرة عامة - الويب',
            
            // Security
            '07-security': 'الأمان',
            '00-security-overview': 'نظرة عامة - الأمان',
            '01-threat-model': 'نموذج التهديدات',
            '02-key-management': 'إدارة المفاتيح',
            
            // Operations
            '08-operations': 'العمليات',
            '00-operations-overview': 'نظرة عامة - العمليات',
            '01-deployment': 'النشر',
            '02-incident-response': 'الاستجابة للحوادث',
            
            // Reference
            '99-reference': 'المراجع',
            '00-resources': 'الموارد',
            '01-glossary': 'المصطلحات',
            '02-enums-standard': 'المعايير',
            '03-link-alias-mapping': 'ربط الروابط',
            '04-naming-conventions': 'قواعد التسمية',
            '05-roles-matrix': 'مصفوفة الأدوار'
        };
        return nameMap[path] || path;
    }

    // Generate TOC from content
    static generateTOC(content) {
        const toc = document.getElementById('toc-list');
        const headings = content.querySelectorAll('h2, h3');
        
        if (headings.length === 0) {
            document.getElementById('floating-toc').style.display = 'none';
            return;
        }
        
        document.getElementById('floating-toc').style.display = 'block';
        toc.innerHTML = '';
        
    headings.forEach((heading, index) => {
            const id = `heading-${index}`;
            heading.id = id;
            
            const item = document.createElement('div');
            item.className = `toc-item ${heading.tagName.toLowerCase()}`;
            
            const link = document.createElement('a');
            link.href = `#${id}`;
            link.textContent = heading.textContent;
            link.onclick = (e) => {
                e.preventDefault();
                heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Update active state
                toc.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                link.classList.add('active');
            };
            
            item.appendChild(link);
            toc.appendChild(item);
        });
        
        // Highlight active heading on scroll
    this.observeHeadings(headings);
    }

    // Observe headings for active state
    static observeHeadings(headings) {
        const options = {
            rootMargin: '-20% 0% -70% 0%',
            threshold: 0
        };
        
        const toc = document.getElementById('toc-list');
        const scrollIntoViewCentered = (el) => {
            if (!toc || !el) return;
            const elTop = el.offsetTop;
            const target = elTop - (toc.clientHeight / 2) + (el.clientHeight / 2);
            toc.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    const tocLinks = document.querySelectorAll('.toc-item a');
                    
                    tocLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                            // اجعل عنصر TOC الحالي في المنتصف أثناء التمرير
                            scrollIntoViewCentered(link);
                        }
                    });
                }
            });
        }, options);
        
        headings.forEach(heading => observer.observe(heading));
    }

    // Show loading state
    static showLoading() {
        const content = document.getElementById('doc-content');
        content.innerHTML = '<div class="loading">جاري التحميل...</div>';
    }

    // Show error state
    static showError(message = 'حدث خطأ في تحميل المحتوى') {
        const content = document.getElementById('doc-content');
        content.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                <h2>⚠️ خطأ</h2>
                <p>${message}</p>
                <a href="#/" style="color: var(--primary);">العودة للرئيسية</a>
            </div>
        `;
    }
}

// Export for use
window.UIComponents = UIComponents;
