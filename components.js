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
            // Use a widely available Lucide icon for schema to avoid CDN version gaps
            schema: 'git-branch',
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
    const isPhone = window.innerWidth < 768;
    const chip = document.getElementById('mobile-heading-chip');
    const mobileToc = document.getElementById('mobile-toc');
    const thumb = document.querySelector('.mobile-v-thumb');
    const track = document.querySelector('.mobile-v-track');
    const markersHost = document.getElementById('mobile-toc-markers');
    // container for small labels next to the rail
    let labelsHost = document.getElementById('mobile-toc-labels');
    if (!labelsHost) {
        labelsHost = document.createElement('div');
        labelsHost.id = 'mobile-toc-labels';
        labelsHost.style.position = 'absolute';
        labelsHost.style.left = '0';
        labelsHost.style.top = '0';
        labelsHost.style.bottom = '0';
        labelsHost.style.width = '100%';
        labelsHost.style.pointerEvents = 'none';
        mobileToc?.querySelector('.mobile-v-rail')?.appendChild(labelsHost);
    }
        if (!chip) return;

    // Show minimal rail on phones
    if (mobileToc) mobileToc.classList.remove('hidden');

        if (!isPhone || h2Headings.length === 0) {
            chip.classList.remove('is-visible');
            chip.style.display = 'none';
            return;
        }
        chip.style.display = 'block';

    // Helpers
        const currentIndex = () => {
            let idx = 0;
            for (let i = 0; i < h2Headings.length; i++) {
                const r = h2Headings[i].getBoundingClientRect();
                if (r.top <= window.innerHeight * 0.25) idx = i; else break;
            }
            return idx;
        };

        const setChip = (idx) => {
            chip.textContent = (h2Headings[idx].textContent || '').trim();
        };

        // Show chip while scrolling, hide after idle
        let hideTimer = null;
        const showChip = () => {
            chip.classList.add('is-visible');
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => chip.classList.remove('is-visible'), 900);
        };

    // Initial state
    setChip(currentIndex());

        // Build markers (one per H2)
        const ensureMarkers = () => {
            if (!markersHost) return;
            markersHost.innerHTML = '';
            labelsHost && (labelsHost.innerHTML = '');
            for (let i = 0; i < h2Headings.length; i++) {
                const m = document.createElement('div');
                m.className = 'mobile-v-marker';
                m.dataset.index = String(i);
                markersHost.appendChild(m);
                // create label node (hidden unless dragging)
                const label = document.createElement('div');
                label.className = 'mobile-v-label';
                label.dataset.index = String(i);
                label.textContent = (h2Headings[i].textContent || '').trim();
                labelsHost && labelsHost.appendChild(label);
            }
        };

        // Position markers according to heading positions
    const positionMarkers = () => {
            if (!markersHost || !track) return;
            const tr = track.getBoundingClientRect();
            const docH = Math.max(0, document.body.scrollHeight - window.innerHeight);
            const range = tr.height - 18; // thumb travel range
            const markers = markersHost.querySelectorAll('.mobile-v-marker');
            h2Headings.forEach((h, i) => {
                const yDoc = Math.max(0, Math.min(docH, h.offsetTop));
                const ratio = docH ? (yDoc / docH) : 0;
                const y = 9 + ratio * range; // center of thumb path
                const el = markers[i];
                if (el) el.style.top = `${y}px`;
        // position label vertically aligned with marker
        const label = labelsHost?.querySelector(`.mobile-v-label[data-index="${i}"]`);
        if (label) label.style.top = `${y}px`;
            });
        };

        // Scroll sync
        let ticking = false;
        const syncVisual = () => {
            // Move thumb and chip along track proportionally to scroll position
            const docH = Math.max(0, document.body.scrollHeight - window.innerHeight);
            const progress = docH ? Math.min(1, Math.max(0, window.scrollY / docH)) : 0;
            const tr = track?.getBoundingClientRect();
            if (tr && thumb) {
                const range = tr.height - 18;
                const y = progress * range;
                thumb.style.transform = `translateY(${y}px)`;
                // Chip follows thumb
                const chipY = tr.top + y + 9; // center
                chip.style.top = `${chipY}px`;
                chip.style.transform = `translateY(-50%)`;
            }
            // Highlight current marker
            if (markersHost) {
                const idx = currentIndex();
                markersHost.querySelectorAll('.mobile-v-marker').forEach((m, i) => {
                    m.classList.toggle('is-current', i === idx);
                });
                // emphasize the current label
                labelsHost?.querySelectorAll('.mobile-v-label').forEach((l, i) => {
                    l.classList.toggle('is-current', i === idx);
                });
            }
        };

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setChip(currentIndex());
                    syncVisual();
                    showChip();
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.removeEventListener('scroll', UIComponents._mobileChipScroll);
        UIComponents._mobileChipScroll = onScroll;
        window.addEventListener('scroll', onScroll, { passive: true });

        // Drag to scrub: works from chip, thumb, or track; show markers only during drag
        let dragging = false;
        const onStart = (e) => {
            dragging = true;
            chip.classList.add('is-visible');
            mobileToc?.classList.add('dragging');
            e.preventDefault();
            handle(e);
        };
        const handle = (e) => {
            if (!dragging) return;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const tr = track?.getBoundingClientRect();
            if (!tr) return;
            const y = Math.min(tr.bottom - 9, Math.max(tr.top + 9, clientY));
            const ratio = (y - (tr.top + 9)) / (tr.height - 18);
            const docH = Math.max(0, document.body.scrollHeight - window.innerHeight);
            const target = ratio * docH;
            window.scrollTo({ top: target, behavior: 'auto' });
            syncVisual();
        };
        const onEnd = () => { dragging = false; mobileToc?.classList.remove('dragging'); showChip(); };
        // Bind events
        chip.addEventListener('touchstart', onStart, { passive: false });
        chip.addEventListener('mousedown', onStart);
        thumb?.addEventListener('touchstart', onStart, { passive: false });
        thumb?.addEventListener('mousedown', onStart);
        track?.addEventListener('touchstart', onStart, { passive: false });
        track?.addEventListener('mousedown', onStart);
        window.addEventListener('touchmove', handle, { passive: false });
        window.addEventListener('mousemove', handle);
        window.addEventListener('touchend', onEnd, { passive: true });
        window.addEventListener('mouseup', onEnd);

        // Init markers and sync visuals
        ensureMarkers();
        positionMarkers();
        syncVisual();

        // Reposition markers on resize/content changes
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                positionMarkers();
                syncVisual();
            }, 150);
        });

        // Click navigates to the current heading (center it)
        chip.onclick = () => {
            const idx = currentIndex();
            h2Headings[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
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

    // Inject page icon into the first H1 heading based on current route for visual unity
    static injectPageTitleIcon(currentPath) {
        try {
            const container = document.getElementById('doc-content');
            if (!container) return;
            const h1 = container.querySelector('h1');
            if (!h1) return;

            // Find matching sidebar item to decide icon
            let sectionId = '';
            let item = null;
            for (const section of (window.sidebarData || [])) {
                const it = (section.items || []).find(x => x.path === currentPath);
                if (it) { sectionId = section.id || ''; item = it; break; }
            }
            // If not found, fall back to path heuristics
            if (!item) item = { path: currentPath, name: h1.textContent || '' };

            const iconKey = UIComponents.getItemIconKey(item, sectionId);
            const lucideName = UIComponents.getLucideFromKey(iconKey);

            // Avoid duplicate injection on re-renders
            if (h1.querySelector('.page-title-icon')) return;

            // Use a wrapper so styles persist after Lucide replaces <i>
            const wrap = document.createElement('span');
            wrap.className = 'page-title-icon';
            const i = document.createElement('i');
            i.setAttribute('data-lucide', lucideName);
            wrap.appendChild(i);
            // Prepend before text; in RTL this will appear at the right visually
            h1.insertBefore(wrap, h1.firstChild);
        } catch (_) { /* noop */ }
    }

    // Remove emoji icons from headings (H1-H4) across documentation pages
    static sanitizeHeadings(rootEl) {
        const root = rootEl || document.getElementById('doc-content');
        if (!root) return;
        const reLeadingEmoji = /^\s*(?:\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?)*)+/u;
        const cleanNode = (el) => {
            // find first non-empty text node child
            for (let n of el.childNodes) {
                if (n.nodeType === Node.TEXT_NODE) {
                    const orig = n.nodeValue || '';
                    const cleaned = orig.replace(reLeadingEmoji, '').replace(/^\s+/, '');
                    if (cleaned !== orig) n.nodeValue = cleaned;
                    break;
                }
            }
        };
        root.querySelectorAll('h1, h2, h3, h4').forEach(cleanNode);
    }

    // =============== Footer navigation (Prev/Next + Related) ===============
    static injectPrevNextAndRelated(currentPath) {
        try {
            const host = document.getElementById('doc-content');
            if (!host || currentPath === '/') return;

            // Get sections from global (non-module) script: const does not attach to window
            const sections = (window.sidebarData || (typeof sidebarData !== 'undefined' ? sidebarData : []));
            if (!sections || !sections.length) return;

            // locate current item in sidebarData
            let secIndex = -1, itemIndex = -1;
            for (let s = 0; s < sections.length; s++) {
                const items = (sections[s].items || []);
                const idx = items.findIndex(it => it.path === currentPath);
                if (idx !== -1) { secIndex = s; itemIndex = idx; break; }
            }
            if (secIndex === -1) return; // not found

            const curSection = sections[secIndex];
            const curItems = curSection.items || [];

            const prev = (() => {
                if (itemIndex > 0) return { sec: secIndex, idx: itemIndex - 1 };
                // previous section last item
                for (let s = secIndex - 1; s >= 0; s--) {
                    const itms = sections[s].items || [];
                    if (itms.length) return { sec: s, idx: itms.length - 1 };
                }
                return null;
            })();

            const next = (() => {
                if (itemIndex < curItems.length - 1) return { sec: secIndex, idx: itemIndex + 1 };
                // next section first item
                for (let s = secIndex + 1; s < sections.length; s++) {
                    const itms = sections[s].items || [];
                    if (itms.length) return { sec: s, idx: 0 };
                }
                return null;
            })();

            const related = (curItems.filter((_, i) => i !== itemIndex).slice(0, 3));

            const wrap = document.createElement('div');
            wrap.className = 'doc-footer';

            const nav = document.createElement('div');
            nav.className = 'doc-footer-nav';
            if (prev) {
                const p = sections[prev.sec].items[prev.idx];
                const a = document.createElement('a');
                a.className = 'doc-nav-link prev';
                a.href = `#${p.path}`;
                a.innerHTML = `<span class="dir">السابق</span><span class="title">${p.name}</span>`;
                a.onclick = (e) => { e.preventDefault(); window.app.navigate(p.path); };
                nav.appendChild(a);
            } else {
                const span = document.createElement('span');
                span.className = 'doc-nav-spacer';
                nav.appendChild(span);
            }
            if (next) {
                const n = sections[next.sec].items[next.idx];
                const a = document.createElement('a');
                a.className = 'doc-nav-link next';
                a.href = `#${n.path}`;
                a.innerHTML = `<span class="dir">التالي</span><span class="title">${n.name}</span>`;
                a.onclick = (e) => { e.preventDefault(); window.app.navigate(n.path); };
                nav.appendChild(a);
            }

            wrap.appendChild(nav);

            if (related && related.length) {
                const rel = document.createElement('div');
                rel.className = 'doc-related';
                const label = document.createElement('div');
                label.className = 'doc-related-label';
                label.textContent = 'روابط ذات صلة';
                rel.appendChild(label);
                const list = document.createElement('div');
                list.className = 'doc-related-links';
                related.forEach(r => {
                    const a = document.createElement('a');
                    a.href = `#${r.path}`;
                    a.textContent = r.name;
                    a.onclick = (e) => { e.preventDefault(); window.app.navigate(r.path); };
                    list.appendChild(a);
                });
                rel.appendChild(list);
                wrap.appendChild(rel);
            }

            host.appendChild(wrap);

            // Also create mobile-only floating prev/next controls
            try {
                const isPhone = window.innerWidth < 768;
                // Clean up any previous instance
                document.getElementById('mobile-doc-nav')?.remove();
                if (isPhone) {
                    const mnav = document.createElement('div');
                    mnav.id = 'mobile-doc-nav';
                    const makeBtn = (label, path, dirIcon) => {
                        const a = document.createElement('a');
                        a.href = `#${path}`;
                        a.className = 'mobile-doc-btn';
                        a.innerHTML = `<span class="icon" data-lucide="${dirIcon}"></span><span>${label}</span>`;
                        a.onclick = (e) => { e.preventDefault(); window.app.navigate(path); };
                        return a;
                    };
                    if (prev) {
                        const p = sections[prev.sec].items[prev.idx];
                        mnav.appendChild(makeBtn('السابق', p.path, 'arrow-right'));
                    }
                    if (next) {
                        const n = sections[next.sec].items[next.idx];
                        mnav.appendChild(makeBtn('التالي', n.path, 'arrow-left'));
                    }
                    document.body.appendChild(mnav);
                    // hydrate icons
                    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
                }
            } catch (_) {}
        } catch (_) { /* noop */ }
    }

    // =============== Enhance code blocks with Copy button ===============
    static enhanceCodeBlocks(rootEl) {
        const root = rootEl || document.getElementById('doc-content');
        if (!root) return;
        const blocks = root.querySelectorAll('pre > code');
        blocks.forEach(code => {
            const pre = code.parentElement;
            if (!pre || pre.querySelector('.code-copy-btn')) return;
            // button
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'code-copy-btn';
            btn.setAttribute('aria-label', 'نسخ');
            const icon = document.createElement('i');
            icon.setAttribute('data-lucide', 'copy');
            btn.appendChild(icon);
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                try {
                    await navigator.clipboard.writeText(code.innerText);
                    btn.classList.add('copied');
                    btn.innerHTML = '<i data-lucide="check"></i>';
                    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
                    setTimeout(() => {
                        btn.classList.remove('copied');
                        btn.innerHTML = '<i data-lucide="copy"></i>';
                        if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
                    }, 1200);
                } catch (_) { /* ignore */ }
            });
            pre.appendChild(btn);
        });
    }

    // =============== Enhance JSON blocks into interactive viewer ===============
    static enhanceJSONBlocks(rootEl) {
        const root = rootEl || document.getElementById('doc-content');
        if (!root) return;
        const codeBlocks = Array.from(root.querySelectorAll('pre > code'));

        const isLikelyJSON = (text, lang) => {
            const lower = (lang || '').toLowerCase();
            if (lower.includes('json')) return true;

            const trimmed = (text || '').trim();
            const looksWrapped = (trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'));
            if (!looksWrapped) return false;

            try {
                // quick structure hints even before parse
                const hasQuotes = trimmed.includes('"') || trimmed.includes("'");
                const hasColon = trimmed.includes(':');
                const hasComma = trimmed.includes(',') || trimmed.length < 50;
                return hasQuotes || hasColon || hasComma;
            } catch {
                return false;
            }
        };

        const tryParse = (text) => {
            try { return { ok: true, value: JSON.parse(text) }; } catch (_) { return { ok: false }; }
        };

        // Render helpers
        const makeBadge = (label) => {
            const b = document.createElement('span');
            b.className = 'json-badge';
            b.textContent = label;
            return b;
        };

        const createNode = (key, value, depth = 0) => {
            const isObj = value && typeof value === 'object' && !Array.isArray(value);
            const isArr = Array.isArray(value);
            const hasChildren = (isObj && Object.keys(value).length) || (isArr && value.length);
            const node = document.createElement('div');
            node.className = 'json-node';

            // Row
            const row = document.createElement('div');
            row.className = 'json-row';

            // caret
            let caret = null;
            if (hasChildren) {
                caret = document.createElement('button');
                caret.type = 'button';
                caret.className = 'json-caret';
                caret.setAttribute('aria-label', 'توسيع/طي');
                row.appendChild(caret);
            } else {
                const spacer = document.createElement('span');
                spacer.className = 'json-caret-spacer';
                row.appendChild(spacer);
            }

            // key
            if (key !== null && key !== undefined) {
                const keyEl = document.createElement('span');
                keyEl.className = 'json-key';
                keyEl.textContent = String(key);
                row.appendChild(keyEl);
                const colon = document.createElement('span');
                colon.className = 'json-colon';
                colon.textContent = ': ';
                row.appendChild(colon);
            }

            if (isObj) {
                const prev = document.createElement('span');
                prev.className = 'json-preview';
                const count = Object.keys(value).length;
                prev.appendChild(makeBadge('Object'));
                prev.appendChild(document.createTextNode(` { … ${count} keys }`));
                row.appendChild(prev);
            } else if (isArr) {
                const prev = document.createElement('span');
                prev.className = 'json-preview';
                const count = value.length;
                prev.appendChild(makeBadge('Array'));
                prev.appendChild(document.createTextNode(` [ … ${count} items ]`));
                row.appendChild(prev);
            } else {
                // primitive value token
                const val = document.createElement('span');
                const t = value === null ? 'null' : typeof value;
                val.className = `json-value ${t}`;
                if (t === 'string') val.textContent = `"${value}"`;
                else if (t === 'number') val.textContent = String(value);
                else if (t === 'boolean') val.textContent = value ? 'true' : 'false';
                else if (t === 'null') val.textContent = 'null';
                else val.textContent = String(value);
                row.appendChild(val);
            }

            node.appendChild(row);

            if (hasChildren) {
                const children = document.createElement('div');
                children.className = 'json-children';
                const entries = isArr ? value.map((v, i) => [i, v]) : Object.entries(value);
                entries.forEach(([k, v]) => {
                    children.appendChild(createNode(k, v, depth + 1));
                });
                node.appendChild(children);

                // collapsed by default beyond depth 1
                const startCollapsed = depth >= 1;
                if (startCollapsed) node.classList.add('collapsed');
                caret && caret.addEventListener('click', () => {
                    node.classList.toggle('collapsed');
                });
            }

            return node;
        };

        const buildViewer = (json, rawText) => {
            const wrap = document.createElement('div');
            wrap.className = 'json-viewer';
            // Toolbar
            const bar = document.createElement('div');
            bar.className = 'json-toolbar';
            const title = document.createElement('div');
            title.className = 'json-title';
            title.textContent = Array.isArray(json) ? 'JSON Array' : 'JSON Object';
            bar.appendChild(title);
            const actions = document.createElement('div');
            actions.className = 'json-actions';

            const mkBtn = (icon, label) => {
                const b = document.createElement('button');
                b.type = 'button';
                b.className = 'json-action';
                b.setAttribute('aria-label', label);
                const i = document.createElement('i');
                i.setAttribute('data-lucide', icon);
                b.appendChild(i);
                return b;
            };

            const btnExpand = mkBtn('chevrons-down-up', 'توسيع الكل');
            const btnCollapse = mkBtn('chevrons-up-down', 'طي الكل');
            const btnCopy = mkBtn('copy', 'نسخ JSON');
            actions.appendChild(btnExpand);
            actions.appendChild(btnCollapse);
            actions.appendChild(btnCopy);
            bar.appendChild(actions);
            wrap.appendChild(bar);

            // Body
            const body = document.createElement('div');
            body.className = 'json-body';
            body.appendChild(createNode(null, json, 0));
            wrap.appendChild(body);

            // Actions handlers
            btnExpand.addEventListener('click', () => {
                body.querySelectorAll('.json-node.collapsed').forEach(n => n.classList.remove('collapsed'));
            });
            btnCollapse.addEventListener('click', () => {
                body.querySelectorAll('.json-node').forEach((n, idx) => {
                    // keep top root expanded
                    if (idx === 0) return; 
                    n.classList.add('collapsed');
                });
            });
            btnCopy.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(rawText);
                    btnCopy.classList.add('copied');
                    btnCopy.innerHTML = '<i data-lucide="check"></i>';
                    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
                    setTimeout(() => {
                        btnCopy.classList.remove('copied');
                        btnCopy.innerHTML = '<i data-lucide="copy"></i>';
                        if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
                    }, 1200);
                } catch (_) {}
            });

            return wrap;
        };

        codeBlocks.forEach(code => {
            const lang = (code.className || '').toLowerCase();
            const text = code.textContent || '';
            if (!isLikelyJSON(text, lang)) return;
            const res = tryParse(text);
            if (!res.ok) return; // keep original if not valid JSON
            const pre = code.closest('pre');
            if (!pre) return;

            const viewer = buildViewer(res.value, JSON.stringify(res.value, null, 2));
            pre.replaceWith(viewer);
        });

        // hydrate icons in toolbar
        if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
    }

    // =============== Enhance tables: wrap, sticky head, optional sticky first column ===============
    static enhanceTables(rootEl) {
        const root = rootEl || document.getElementById('doc-content');
        if (!root) return;
        const tables = Array.from(root.querySelectorAll('table'));
        const isPhone = window.innerWidth < 768;
        // Mobile-only: remove inline width that may block horizontal growth
        if (isPhone) {
            tables.forEach((t) => {
                const inlineWidth = t.getAttribute('width') || (t.style ? t.style.width : '') || '';
                if (inlineWidth) {
                    t.removeAttribute('width');
                    try { if (t.style) t.style.removeProperty('width'); } catch (_) {}
                }
            });
        }
        tables.forEach((table) => {
            // Skip if already wrapped
            let wrap = table.closest('.table-wrap');
            if (!wrap) {
                wrap = document.createElement('div');
                wrap.className = 'table-wrap';
                table.parentNode.insertBefore(wrap, table);
                wrap.appendChild(table);
            }
            // tag wraps on phones for CSS targeting (overflow-x only on phones)
            if (isPhone) {
                wrap.classList.add('mobile-scrollable');
            } else {
                wrap.classList.remove('mobile-scrollable');
            }
            // Add sticky header support via class
            table.classList.add('sticky-head');
            // If table has many columns, make first column sticky for readability
            try {
                const firstRow = table.querySelector('tr');
                const cols = firstRow ? (firstRow.children ? firstRow.children.length : 0) : 0;
                if (isPhone) {
                    // On phones, apply a dedicated mobile sticky class only for 4+ columns
                    if (cols >= 4) {
                        table.classList.add('mobile-sticky-first');
                        wrap && wrap.classList.add('has-sticky-col');
                    } else {
                        table.classList.remove('mobile-sticky-first');
                        wrap && wrap.classList.remove('has-sticky-col');
                    }
                    // Do not add desktop sticky-col on phones
                    table.classList.remove('sticky-col');
                } else {
                    // Desktop/tablet: use sticky-col for wider tables
                    if (cols >= 5) table.classList.add('sticky-col');
                    else table.classList.remove('sticky-col');
                    // Remove mobile flags just in case of resize
                    table.classList.remove('mobile-sticky-first');
                    wrap && wrap.classList.remove('has-sticky-col');
                }
            } catch (_) {}

            // Keep original table shape; scrolling handled by wrapper for phones
        });
    }

    // تحسين sticky columns للهاتف: Observer to activate mobile sticky styling only when in view
    static fixMobileStickyColumns() {
        if (window.innerWidth > 768) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const wrap = entry.target;
                const table = wrap.querySelector('table');
                if (!table) return;
                if (entry.isIntersecting) {
                    table.classList.add('mobile-sticky-active');
                } else {
                    table.classList.remove('mobile-sticky-active');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.table-wrap').forEach(wrap => observer.observe(wrap));
    }

    // =============== Markdown polish: anchors, callouts, images, links ===============
    static addHeadingAnchors(rootEl) {
        const root = rootEl || document.getElementById('doc-content');
        if (!root) return;
        const heads = root.querySelectorAll('h2, h3, h4');
        let idx = 0;
        heads.forEach(h => {
            if (!h.id) { h.id = `sec-${idx++}`; }
            if (h.querySelector('.heading-anchor')) return;
            const a = document.createElement('a');
            a.className = 'heading-anchor';
            a.href = `#${h.id}`;
            a.setAttribute('aria-label', 'نسخ رابط العنوان');
            const i = document.createElement('i');
            i.setAttribute('data-lucide', 'link-2');
            a.appendChild(i);
            h.appendChild(a);
        });
    }

    // =============== Inline TOC (inside markdown) -> make links scroll to real headings ===============
    static enhanceInlineTOC(rootEl) {
        const root = rootEl || document.getElementById('doc-content');
        if (!root) return;

        const isTOCTitle = (t) => {
            const s = (t || '').trim().toLowerCase();
            return s === 'فهرس المحتويات' || s === 'المحتويات' || s === 'table of contents' || s === 'contents';
        };

        const normalize = (txt) => (txt || '')
            .replace(/\[[^\]]*\]/g, '') // remove [..]
            .replace(/[0-9٠-٩]+[\.|\-ـ)]?\s*/g, '') // strip leading numbers (Arabic & Latin)
            .replace(/[:\.،,…]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();

        const allHeads = Array.from(root.querySelectorAll('h2, h3, h4'));
        if (!allHeads.length) return;

        // Find TOC heading and its following list
        const titles = Array.from(root.querySelectorAll('h1, h2, h3'))
            .filter(h => isTOCTitle(h.textContent));
        titles.forEach(title => {
            // mark title
            title.classList.add('inline-toc-title');
            // locate next UL/OL sibling
            let el = title.nextElementSibling;
            let list = null;
            while (el && !(el.tagName === 'UL' || el.tagName === 'OL')) {
                // stop if hit a heading or a table
                if (/^H[1-6]$/.test(el.tagName) || el.tagName === 'TABLE') break;
                el = el.nextElementSibling;
            }
            if (el && (el.tagName === 'UL' || el.tagName === 'OL')) list = el;
            if (!list) return;

            list.classList.add('inline-toc');
            const links = Array.from(list.querySelectorAll('a'));
            links.forEach(a => {
                const label = normalize(a.textContent || '');
                // find best match by normalized text
                const target = allHeads.find(h => normalize(h.textContent || '') === label);
                if (!target) return;

                // store and wire smooth scroll; don't change main hash route
                a.setAttribute('data-target', target.id);
                a.setAttribute('href', '#');
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    target.classList.add('heading-flash');
                    setTimeout(() => target.classList.remove('heading-flash'), 900);
                });
            });
        });
    }

    static enhanceCallouts(rootEl) {
        const root = rootEl || document.getElementById('doc-content');
        if (!root) return;
        const bqs = Array.from(root.querySelectorAll('blockquote'));
        const map = {
            '[!NOTE]': { cls: 'note', label: 'ملاحظة', icon: 'info' },
            '[!TIP]': { cls: 'tip', label: 'نصيحة', icon: 'lightbulb' },
            '[!WARNING]': { cls: 'warning', label: 'تحذير', icon: 'triangle-alert' },
            '[!IMPORTANT]': { cls: 'important', label: 'مهم', icon: 'alert-octagon' },
            '[!INFO]': { cls: 'info', label: 'معلومة', icon: 'info' }
        };
        bqs.forEach(bq => {
            const text = (bq.textContent || '').trim();
            const key = Object.keys(map).find(k => text.startsWith(k));
            if (!key) return;
            const cfg = map[key];
            // Extract inner HTML after the key
            const html = bq.innerHTML.replace(key, '').trim();
            const wrap = document.createElement('div');
            wrap.className = `callout ${cfg.cls}`;
            wrap.innerHTML = `
                <div class="callout-icon"><i data-lucide="${cfg.icon}"></i></div>
                <div class="callout-body">
                    <div class="callout-title">${cfg.label}</div>
                    <div class="callout-content">${html}</div>
                </div>
            `;
            bq.replaceWith(wrap);
        });
    }

    static enhanceImagesAndLinks(rootEl) {
        const root = rootEl || document.getElementById('doc-content');
        if (!root) return;
        // Images responsive + optional caption from alt
        const imgs = Array.from(root.querySelectorAll('img'));
        imgs.forEach(img => {
            img.loading = img.loading || 'lazy';
            if (img.closest('figure')) return;
            const fig = document.createElement('figure');
            fig.className = 'md-figure';
            const clone = img.cloneNode(true);
            clone.classList.add('md-image');
            img.replaceWith(fig);
            fig.appendChild(clone);
            if (clone.alt && clone.alt.trim()) {
                const cap = document.createElement('figcaption');
                cap.textContent = clone.alt;
                fig.appendChild(cap);
            }
        });
        // External links open in new tab
        const links = Array.from(root.querySelectorAll('a[href]'));
        links.forEach(a => {
            const href = a.getAttribute('href') || '';
            const isAnchor = href.startsWith('#');
            const isMail = href.startsWith('mailto:') || href.startsWith('tel:');
            try {
                const url = new URL(href, window.location.href);
                const isExternal = url.origin !== window.location.origin;
                if (!isAnchor && !isMail && isExternal) {
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                }
            } catch (_) { /* ignore */ }
        });

        // Lazy-load images for performance
        try { UIComponents.lazyLoadImages(root); } catch (_) {}
    }

    // Lazy loading for images using IntersectionObserver
    static lazyLoadImages(root) {
        const images = root.querySelectorAll('img');
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                obs.unobserve(img);
            });
        }, { rootMargin: '50px' });

        images.forEach(img => {
            if (!img.complete) {
                img.dataset.src = img.src;
                img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E';
            }
            obs.observe(img);
        });
    }

    // =============== Auto direction: set LTR on pure-English blocks only ===============
    static applyAutoDirection(rootEl) {
        const root = rootEl || document.getElementById('doc-content');
        if (!root) return;
        const ARABIC_RE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
        const LATIN_RE = /[A-Za-z]/;

        // Candidate blocks (exclude code/diagram/json viewers)
        const selectors = [
            'p', 'li', 'blockquote', 'figcaption', 'dd', 'dt', 'h1', 'h2', 'h3', 'h4',
            'td', 'th', '.callout-content', '.doc-related a'
        ];
        const nodes = Array.from(root.querySelectorAll(selectors.join(',')))
            .filter(el => !el.closest('pre, code, .json-viewer, .diagram, .mermaid-diagram'));

        const isPureEnglish = (text) => {
            const t = (text || '').replace(/\s+/g, ' ').trim();
            if (!t) return false;
            if (ARABIC_RE.test(t)) return false; // any Arabic -> keep RTL
            return LATIN_RE.test(t); // has latin letters and no Arabic
        };

        nodes.forEach(el => {
            // don't override explicit dir
            if (el.hasAttribute('dir')) return;
            const text = el.innerText || el.textContent || '';
            if (isPureEnglish(text)) {
                el.setAttribute('dir', 'ltr');
                el.classList.add('dir-ltr');
            }
        });
    }

    // =============== AOS: Apply attributes responsively across content (with iOS routing) ===============
    static applyAOSAttributes(rootEl) {
        const root = rootEl || document.getElementById('doc-content');
        if (!root) return;

        const isMobile = window.innerWidth < 768;
        const isDesktop = window.innerWidth >= 1024;
    const ua = navigator.userAgent || '';
    const isiPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    const isIOS = (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) || isiPadOS;
        const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
        const isIOSSafari = isIOS && isSafari;

        if (isIOSSafari) {
            // Use custom iOS animation system to avoid AOS quirks
            UIComponents.applyIOSAnimations(root);
            return;
        }

        if (!window.AOS) return;

        // Clear previous AOS attributes to avoid duplication when re-rendering
        root.querySelectorAll('[data-aos]').forEach(el => {
            el.removeAttribute('data-aos');
            el.removeAttribute('data-aos-duration');
            el.removeAttribute('data-aos-delay');
            el.removeAttribute('data-aos-anchor-placement');
        });

        if (isMobile) {
            // Varied, smooth animations for mobile with light timings
            root.querySelectorAll('h1, h2').forEach((el, i) => {
                el.setAttribute('data-aos', 'fade-right');
                el.setAttribute('data-aos-duration', '500');
                el.setAttribute('data-aos-delay', `${i * 30}`);
                el.setAttribute('data-aos-offset', '30');
            });
            root.querySelectorAll('h3, h4').forEach((el) => {
                el.setAttribute('data-aos', 'fade-up');
                el.setAttribute('data-aos-duration', '400');
            });
            root.querySelectorAll('p').forEach((el, i) => {
                el.setAttribute('data-aos', 'fade-up');
                el.setAttribute('data-aos-duration', '400');
                el.setAttribute('data-aos-delay', `${Math.min(i * 20, 200)}`);
                el.setAttribute('data-aos-anchor-placement', 'top-bottom');
            });
            root.querySelectorAll('ul, ol').forEach(el => {
                el.setAttribute('data-aos', 'fade-left');
                el.setAttribute('data-aos-duration', '450');
            });
            root.querySelectorAll('.table-wrap').forEach(el => {
                el.setAttribute('data-aos', 'zoom-in-up');
                el.setAttribute('data-aos-duration', '400');
            });
            root.querySelectorAll('pre').forEach(el => {
                el.setAttribute('data-aos', 'flip-left');
                el.setAttribute('data-aos-duration', '500');
            });
            root.querySelectorAll('img, figure').forEach(el => {
                el.setAttribute('data-aos', 'zoom-in-up');
                el.setAttribute('data-aos-duration', '450');
            });
            root.querySelectorAll('blockquote').forEach(el => {
                el.setAttribute('data-aos', 'fade-left');
                el.setAttribute('data-aos-duration', '450');
            });
        } else if (isDesktop) {
            // Rich animations on desktop
            root.querySelectorAll('h1').forEach(el => {
                el.setAttribute('data-aos', 'fade-up');
                el.setAttribute('data-aos-duration', '700');
            });
            root.querySelectorAll('h2').forEach((el, i) => {
                el.setAttribute('data-aos', 'fade-up');
                el.setAttribute('data-aos-duration', '600');
                el.setAttribute('data-aos-delay', `${i * 50}`);
            });
            root.querySelectorAll('p').forEach((el, i) => {
                el.setAttribute('data-aos', i % 2 === 0 ? 'fade-left' : 'fade-right');
                el.setAttribute('data-aos-duration', '500');
                el.setAttribute('data-aos-delay', `${i * 30}`);
            });
            root.querySelectorAll('ul, ol').forEach(el => {
                el.setAttribute('data-aos', 'fade-left');
                el.setAttribute('data-aos-duration', '600');
                el.setAttribute('data-aos-anchor-placement', 'center-bottom');
            });
            root.querySelectorAll('.table-wrap').forEach(el => {
                el.setAttribute('data-aos', 'zoom-in');
                el.setAttribute('data-aos-duration', '500');
            });
            root.querySelectorAll('pre').forEach(el => {
                el.setAttribute('data-aos', 'flip-up');
                el.setAttribute('data-aos-duration', '600');
            });
            root.querySelectorAll('img, figure').forEach(el => {
                el.setAttribute('data-aos', 'zoom-in-up');
                el.setAttribute('data-aos-duration', '700');
            });
            root.querySelectorAll('blockquote').forEach(el => {
                el.setAttribute('data-aos', 'fade-left');
                el.setAttribute('data-aos-duration', '600');
            });
        } else {
            // Tablet: mild fade-ups with moderate durations
            root.querySelectorAll('h1, h2, h3, h4, p, ul, ol, blockquote, .table-wrap, pre, img, figure').forEach(el => {
                el.setAttribute('data-aos', 'fade-up');
                el.setAttribute('data-aos-duration', '500');
            });
        }

        // Refresh AOS to pick up attributes
        try { window.AOS.refresh(); } catch (_) {}
    }

    // iOS-specific animation system using IntersectionObserver + CSS classes
    static applyIOSAnimations(root) {
        // Respect user reduced-motion preference
        const reduceMotion = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) {
            root.querySelectorAll('h1, h2, p, ul, ol, .table-wrap, pre').forEach(el => { el.style.visibility = ''; });
            return;
        }
        const opts = { root: null, rootMargin: '0px 0px -10% 0px', threshold: [0.1, 0.5, 1.0] };
        const animate = (el, cls, delay = 0) => {
            el.style.visibility = 'hidden';
            setTimeout(() => { el.classList.add(cls); el.style.visibility = 'visible'; }, delay);
        };
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting || entry.intersectionRatio < 0.1) return;
                const el = entry.target;
                const a = el.dataset.iosAnimation;
                const d = parseInt(el.dataset.iosDelay || '0', 10);
                if (a && !el.classList.contains(a)) animate(el, a, d);
                io.unobserve(el);
            });
        }, opts);

    // Titles
    root.querySelectorAll('h1').forEach(el => { el.style.visibility = 'hidden'; el.dataset.iosAnimation = 'ios-animate-bounce'; el.dataset.iosDelay = '0'; io.observe(el); });
    root.querySelectorAll('h2').forEach((el, i) => { el.style.visibility = 'hidden'; el.dataset.iosAnimation = 'ios-animate-up'; el.dataset.iosDelay = String(i * 50); io.observe(el); });
    // Paragraphs
    root.querySelectorAll('p').forEach((el, i) => { el.style.visibility = 'hidden'; el.dataset.iosAnimation = (i % 2 === 0 ? 'ios-animate-right' : 'ios-animate-left'); el.dataset.iosDelay = String(Math.min(i * 30, 200)); io.observe(el); });
    // Lists
    root.querySelectorAll('ul, ol').forEach((el, i) => { el.style.visibility = 'hidden'; el.dataset.iosAnimation = 'ios-animate-zoom'; el.dataset.iosDelay = String(i * 40); io.observe(el); });
    // Tables
    root.querySelectorAll('.table-wrap').forEach((el, i) => { el.style.visibility = 'hidden'; el.dataset.iosAnimation = 'ios-animate-flip'; el.dataset.iosDelay = String(i * 60); io.observe(el); });
    // Code blocks
    root.querySelectorAll('pre').forEach((el, i) => { el.style.visibility = 'hidden'; el.dataset.iosAnimation = 'ios-animate-bounce'; el.dataset.iosDelay = String(i * 50); io.observe(el); });
    }
}

// Export for use
window.UIComponents = UIComponents;
