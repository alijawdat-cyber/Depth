// UI Components
class UIComponents {
    // Generate navigation item
    static createNavItem(item, isActive = false, sectionId = '') {
        const a = document.createElement('a');
        a.href = `#${item.path}`;
        const iconKey = UIComponents.getItemIconKey(item, sectionId);
        const lucideName = UIComponents.getLucideFromKey(iconKey);
        a.className = `nav-item ${isActive ? 'active' : ''}`;

        // icon
        const icon = document.createElement('i');
        icon.className = 'nav-icon';
        icon.setAttribute('data-lucide', lucideName);
        a.appendChild(icon);

        // text
        const text = document.createElement('span');
        text.className = 'nav-text';
        text.textContent = item.name;
        a.appendChild(text);
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
    if (section.id) div.setAttribute('data-id', section.id);
        
    const title = document.createElement('div');
    title.className = 'nav-section-title';
    // icon
    const sectionIcon = document.createElement('i');
    sectionIcon.className = 'nav-icon';
    sectionIcon.setAttribute('data-lucide', UIComponents.getSectionLucide(section.id));
    title.appendChild(sectionIcon);
    // text
    const sectionText = document.createElement('span');
    sectionText.textContent = section.title;
    title.appendChild(sectionText);
        title.onclick = () => {
            title.classList.toggle('collapsed');
            items.classList.toggle('collapsed');
        };
        
        const items = document.createElement('div');
        items.className = 'nav-section-items';
        
        section.items.forEach(item => {
            items.appendChild(this.createNavItem(item, false, section.id));
        });
        
        div.appendChild(title);
        div.appendChild(items);
        return div;
    }

    // Map item to icon key based on its path or name
    static getItemIconKey(item, sectionId = '') {
        const p = (item.path || '').toLowerCase();
        const n = (item.name || '').toLowerCase();

        const has = (s) => p.includes(s) || n.includes(s);

        if (has('00-overview') || has('introduction') || has('نظرة')) return 'overview';
        if (has('requirements') || has('المتطلبات')) return 'requirements';
        if (has('data-dictionary') || has('قاموس')) return 'dictionary';
        if (has('database-schema') || has('schema') || has('مخطط')) return 'schema';
        if (has('indexes') || has('استعلام') || has('فهارس')) return 'indexes';
        if (has('authentication') || has('auth') || has('مصاد')) return 'auth';
        if (has('rate-limiting') || has('المعدل')) return 'rate-limit';
        if (has('websockets')) return 'websocket';
        if (has('error-handling') || has('أخطاء') || has('خطأ')) return 'error';

        if (has('creators') || has('المبدعين')) return 'creator';
        if (has('clients') || has('العملاء')) return 'clients';
        if (has('projects') || has('المشاريع')) return 'projects';
        if (has('pricing') || has('التسعير')) return 'pricing';
        if (has('storage') || has('التخزين')) return 'storage';
        if (has('notifications') || has('الإشعارات')) return 'notifications';
        if (has('messaging') || has('المراسلة')) return 'messaging';
        if (has('salaried') || has('الموظ')) return 'employees';

        if (has('admin-panel') || has('لوحة')) return 'dashboard';
        if (has('governance') || has('الحوكمة')) return 'governance';
        if (has('seeds') || has('إدارة البيانات')) return 'seeds';

        if (has('external-services')) return 'plug';
        if (has('webhooks')) return 'webhook';
        if (has('advanced')) return 'flask';

        if (has('getting-started') || has('دليل')) return 'rocket';
        if (has('local-setup') || has('الإعداد')) return 'laptop';
        if (has('environment-variables') || has('متغيرات')) return 'key';
        if (has('workflow') || has('العمل')) return 'flow';
        if (has('testing') || has('الاختبار')) return 'test';

        if (has('mobile') || has('الجوال')) return 'phone';
        if (has('frontend') || has('الويب')) return 'monitor';

        if (has('security-overview') || has('الأمان') || has('security')) return 'shield';
        if (has('threat-model')) return 'target';
        if (has('key-management')) return 'key';

        if (has('operations-overview') || has('العمليات') || has('operations')) return 'cogs';
        if (has('deployment')) return 'cloud-upload';
        if (has('incident-response')) return 'alert';

        if (has('resources')) return 'book';
        if (has('glossary')) return 'book-open';
        if (has('enums-standard') || has('المعايير')) return 'braces';
        if (has('link-alias-mapping')) return 'link';
        if (has('naming-conventions')) return 'text';
        if (has('roles-matrix')) return 'grid';

        // fallback by section
        switch (sectionId) {
            case 'database': return 'database';
            case 'core': return 'cog';
            case 'features': return 'sparkles';
            case 'admin': return 'shield-check';
            case 'integrations': return 'plug';
            case 'development': return 'code';
            case 'interfaces': return 'devices';
            case 'security': return 'shield';
            case 'operations': return 'cogs';
            case 'reference': return 'book';
            default: return 'dot';
        }
    }

    // Map internal keys to Lucide icon names
    static getLucideFromKey(key) {
        const map = {
            overview: 'list',
            requirements: 'file-check-2',
            dictionary: 'book',
            schema: 'sitemap',
            indexes: 'list-filter',
            database: 'database',
            auth: 'shield',
            'rate-limit': 'gauge',
            websocket: 'network',
            error: 'triangle-alert',
            creator: 'pen-tool',
            clients: 'users',
            projects: 'folder-kanban',
            pricing: 'receipt',
            storage: 'hard-drive',
            notifications: 'bell',
            messaging: 'message-square',
            employees: 'user-cog',
            dashboard: 'layout-dashboard',
            governance: 'landmark',
            seeds: 'sprout',
            plug: 'plug',
            webhook: 'webhook',
            flask: 'flask-conical',
            rocket: 'rocket',
            laptop: 'laptop',
            key: 'key',
            flow: 'workflow',
            test: 'beaker',
            phone: 'smartphone',
            monitor: 'monitor',
            shield: 'shield',
            target: 'target',
            cogs: 'cog',
            'cloud-upload': 'cloud-upload',
            alert: 'triangle-alert',
            book: 'book',
            'book-open': 'book-open',
            braces: 'braces',
            link: 'link',
            text: 'type',
            grid: 'grid-2x2',
            cog: 'cog',
            sparkles: 'sparkles',
            'shield-check': 'shield-check',
            code: 'code-2',
            devices: 'monitor-smartphone',
            dot: 'dot'
        };
        return map[key] || 'dot';
    }

    static getSectionLucide(id = '') {
        const map = {
            home: 'home',
            'getting-started': 'rocket',
            database: 'database',
            core: 'layers-3',
            features: 'sparkles',
            admin: 'shield-check',
            integrations: 'plug',
            development: 'code-2',
            interfaces: 'monitor-smartphone',
            security: 'shield',
            operations: 'settings-2',
            reference: 'book'
        };
        return map[id] || 'dot';
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
            UIComponents.setupMobileTOC([]);
            return;
        }

        document.getElementById('floating-toc').style.display = 'block';
        toc.innerHTML = '';

        // Build grouped structure: H2 groups with nested H3 items
        let currentGroup = null; // { group: HTMLElement, sublist: HTMLElement }

        headings.forEach((heading, index) => {
            const id = `heading-${index}`;
            heading.id = id;

            if (heading.tagName.toLowerCase() === 'h2') {
                // New group
                const group = document.createElement('div');
                group.className = 'toc-group';

                const headerItem = document.createElement('div');
                headerItem.className = 'toc-item h2';

                const caret = document.createElement('button');
                caret.className = 'toc-caret';
                caret.type = 'button';
                caret.setAttribute('aria-expanded', 'true');
                caret.setAttribute('aria-label', 'طي/فتح');

                const link = document.createElement('a');
                link.href = `#${id}`;
                link.textContent = heading.textContent;
                link.onclick = (e) => {
                    e.preventDefault();
                    heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    toc.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                    link.classList.add('active');
                };

                headerItem.appendChild(caret);
                headerItem.appendChild(link);
                group.appendChild(headerItem);

                const sublist = document.createElement('div');
                sublist.className = 'toc-sublist';
                group.appendChild(sublist);

                // Toggle collapse for this group
                caret.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isCollapsed = group.classList.toggle('collapsed');
                    caret.setAttribute('aria-expanded', String(!isCollapsed));
                });

                toc.appendChild(group);
                currentGroup = { group, sublist };
            } else {
                // H3 item
                const item = document.createElement('div');
                item.className = 'toc-item h3';

                const link = document.createElement('a');
                link.href = `#${id}`;
                link.textContent = heading.textContent;
                link.onclick = (e) => {
                    e.preventDefault();
                    heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    toc.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                    link.classList.add('active');
                };

                item.appendChild(link);
                if (currentGroup && currentGroup.sublist) {
                    currentGroup.sublist.appendChild(item);
                } else {
                    toc.appendChild(item); // fallback in case H3 appears before any H2
                }
            }
        });

        // Highlight active heading on scroll
    this.observeHeadings(headings);
    // Build mobile TOC from h2s only for concise chips
    const h2s = Array.from(headings).filter(h => h.tagName.toLowerCase() === 'h2');
    UIComponents.setupMobileTOC(h2s);
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
                            // Ensure its group is expanded if collapsed
                            const group = link.closest('.toc-group');
                            if (group && group.classList.contains('collapsed')) {
                                group.classList.remove('collapsed');
                                const caret = group.querySelector('.toc-caret');
                                if (caret) caret.setAttribute('aria-expanded', 'true');
                            }
                        }
                    });
                }
            });
        }, options);
        
        headings.forEach(heading => observer.observe(heading));
    }

    // =============== Mobile TOC (phones) ===============
    static setupMobileTOC(h2Headings) {
        const mobileToc = document.getElementById('mobile-toc');
        const list = document.getElementById('mobile-toc-list');
        const thumb = document.querySelector('.mobile-toc-thumb');
        const track = document.querySelector('.mobile-toc-track');

        // Hide on desktop/tablet or when no headings
        const isPhone = window.innerWidth < 768;
        if (!mobileToc) return;
        if (!isPhone || h2Headings.length === 0) {
            mobileToc.classList.add('hidden');
            return;
        }
        mobileToc.classList.remove('hidden');

        // Build chips
        list.innerHTML = '';
        const items = h2Headings.map((h, idx) => {
            const a = document.createElement('button');
            a.type = 'button';
            a.className = 'mobile-toc-chip';
            a.textContent = h.textContent.trim();
            a.dataset.target = h.id;
            a.addEventListener('click', () => {
                document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            list.appendChild(a);
            return { el: a, heading: h, idx };
        });

        // Sync active chip and thumb with scroll
        const sync = () => {
            if (!track || !thumb) return;
            const scrollTop = window.scrollY;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
            const trackRect = track.getBoundingClientRect();
            const minX = 4; const maxX = trackRect.width - 4 - 14; // paddings and thumb width
            const x = minX + progress * (maxX - minX);
            thumb.style.transform = `translateX(${x}px)`;

            // Find nearest heading in view and set active
            let activeIdx = 0;
            for (let i = 0; i < items.length; i++) {
                const rect = items[i].heading.getBoundingClientRect();
                if (rect.top <= 120) activeIdx = i; else break;
            }
            items.forEach((it, i) => it.el.classList.toggle('active', i === activeIdx));
            // Auto-scroll chips list to keep active centered
            const activeEl = items[activeIdx]?.el;
            if (activeEl) {
                const listRect = list.getBoundingClientRect();
                const elRect = activeEl.getBoundingClientRect();
                const target = (elRect.left + elRect.right) / 2 - (listRect.left + listRect.right) / 2;
                list.scrollBy({ left: target, behavior: 'smooth' });
            }
        };
        sync();

        // Throttled scroll listener
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => { sync(); ticking = false; });
                ticking = true;
            }
        };
        window.removeEventListener('scroll', UIComponents._mobileTocScroll);
        UIComponents._mobileTocScroll = onScroll;
        window.addEventListener('scroll', onScroll, { passive: true });

        // Drag to scrub
        let dragging = false;
        const onPointerDown = (e) => {
            dragging = true;
            thumb.setPointerCapture?.(e.pointerId);
            e.preventDefault();
        };
        const onPointerMove = (e) => {
            if (!dragging) return;
            const tr = track.getBoundingClientRect();
            const px = Math.min(tr.right - 4 - 14, Math.max(tr.left + 4, e.clientX)) - (tr.left + 4);
            const ratio = Math.min(1, Math.max(0, px / (tr.width - 8 - 14)));
            const y = ratio * (document.body.scrollHeight - window.innerHeight);
            window.scrollTo({ top: y, behavior: 'auto' });
        };
        const onPointerUp = (e) => {
            dragging = false;
            try { thumb.releasePointerCapture?.(e.pointerId); } catch (_) {}
        };
        thumb?.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerup', onPointerUp, { passive: true });
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
