// UI Components
class UIComponents {
    // ===== Utilities for layout offsets =====
    static getHeaderOffset() {
        try {
            const cs = getComputedStyle(document.documentElement);
            const v = cs.getPropertyValue('--header-total-height') || cs.getPropertyValue('--header-height') || '64px';
            const n = parseFloat(String(v).trim());
            return isNaN(n) ? 64 : n;
        } catch (_) { return 64; }
    }
    static scrollToHeading(h) {
        if (!h) return;
        const offset = UIComponents.getHeaderOffset() + 8; // small breathing room
        const top = window.scrollY + h.getBoundingClientRect().top - offset;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
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

    // =============== Diagram Viewer (Mermaid) with pan/zoom/fit ===============
    static upgradeMermaidViewers(rootEl) {
        const root = rootEl || document.getElementById('doc-content');
        if (!root) return;
        const diagrams = Array.from(root.querySelectorAll('.diagram.mermaid-diagram'));
        diagrams.forEach(diagram => {
            // لا تكرر التغليف
            if (diagram.closest('.diagram-viewer')) return;
            const title = (diagram.getAttribute('data-title') || '').trim();
            const viewer = document.createElement('div');
            viewer.className = 'diagram-viewer';
            // شريط الأدوات
            const toolbar = document.createElement('div');
            toolbar.className = 'diagram-toolbar';
            toolbar.innerHTML = `
                <div class="dt-left">
                  <div class="dt-title">${title || 'Diagram'}</div>
                </div>
                <div class="dt-right">
                  <button class="diagram-btn" data-zoom="out" aria-label="تصغير"><i data-lucide="zoom-out"></i></button>
                  <button class="diagram-btn" data-zoom="in" aria-label="تكبير"><i data-lucide="zoom-in"></i></button>
                  <button class="diagram-btn" data-fit aria-label="ملاءمة"><i data-lucide="maximize"></i></button>
                  <button class="diagram-btn" data-reset aria-label="إعادة"><i data-lucide="rotate-ccw"></i></button>
                </div>`;
            const stage = document.createElement('div');
            stage.className = 'diagram-stage';
            const content = document.createElement('div');
            content.className = 'diagram-content';
            // انقل الـSVG داخل المحتوى
            content.appendChild(diagram);
            stage.appendChild(content);
            viewer.appendChild(toolbar);
            viewer.appendChild(stage);
            // تعليق اختياري من عنوان العنصر الأب
            const captionText = diagram.getAttribute('alt') || '';
            if (captionText) {
                const cap = document.createElement('div');
                cap.className = 'diagram-caption';
                cap.textContent = captionText;
                viewer.appendChild(cap);
            }
            // استبدال
            const host = content.parentNode;
            const parent = host.parentNode;
            parent.replaceChild(viewer, host);

            // حالة التحويل
            let scale = 1, tx = 0, ty = 0;
            const apply = () => { content.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`; };
            const fit = () => {
                try {
                    const svg = content.querySelector('svg');
                    if (!svg) return;
                    const vb = (svg.getAttribute('viewBox') || '').split(/\s+/).map(Number);
                    const stageRect = stage.getBoundingClientRect();
                    const svgW = isFinite(vb[2]) ? vb[2] : svg.clientWidth || 800;
                    const svgH = isFinite(vb[3]) ? vb[3] : svg.clientHeight || 600;
                    const sx = (stageRect.width - 24) / svgW;
                    const sy = (stageRect.height - 24) / svgH;
                    scale = Math.max(0.2, Math.min(1.2, Math.min(sx, sy)));
                    tx = 12; ty = 12; apply();
                } catch(_) { /* silent */ }
            };
            const reset = () => { scale = 1; tx = 0; ty = 0; apply(); };
            // أزرار
            toolbar.addEventListener('click', (e) => {
                const btn = e.target.closest('button'); if (!btn) return;
                if (btn.hasAttribute('data-zoom')) {
                    const dir = btn.getAttribute('data-zoom');
                    scale = Math.max(0.2, Math.min(2.5, scale * (dir === 'in' ? 1.2 : 1/1.2)));
                    apply();
                } else if (btn.hasAttribute('data-fit')) {
                    fit();
                } else if (btn.hasAttribute('data-reset')) {
                    reset();
                }
            });
            // سحب للتحريك
            let dragging = false; let sx = 0, sy = 0, ox = 0, oy = 0;
            const start = (clientX, clientY) => { dragging = true; viewer.classList.add('dragging'); sx = clientX; sy = clientY; ox = tx; oy = ty; };
            const move = (clientX, clientY) => { if (!dragging) return; tx = ox + (clientX - sx); ty = oy + (clientY - sy); apply(); };
            const end = () => { dragging = false; viewer.classList.remove('dragging'); };
            stage.addEventListener('mousedown', (e)=>{ if (e.button!==0) return; start(e.clientX,e.clientY); e.preventDefault(); });
            window.addEventListener('mousemove', (e)=> move(e.clientX,e.clientY));
            window.addEventListener('mouseup', end);
            stage.addEventListener('touchstart', (e)=>{ const t=e.touches[0]; if (!t) return; start(t.clientX,t.clientY); }, { passive: true });
            window.addEventListener('touchmove', (e)=>{ const t=e.touches[0]; if (!t) return; move(t.clientX,t.clientY); }, { passive: true });
            window.addEventListener('touchend', end, { passive: true });
            // ملاءمة أولية بعد رسم
            setTimeout(fit, 30);
        });
        if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
    }

    // =============== Flow links & connectors (same-page + cross-doc chips) ===============
    static enhanceFlowLinks(rootEl) {
        const root = rootEl || document.getElementById('doc-content');
        if (!root) return;
        // ابحث عن كتل code من نوع flowmap
        const blocks = Array.from(root.querySelectorAll('pre > code.language-flowmap, pre > code.language-flow, pre > code.language-graph'));
        if (!blocks.length) return;
        // طبقة رسم للأسهم داخل الصفحة
        let layer = root.querySelector('.flow-connector-layer');
        if (!layer) {
            layer = document.createElement('svg');
            layer.className = 'flow-connector-layer';
            layer.setAttribute('width', '100%');
            layer.setAttribute('height', '0');
            layer.setAttribute('viewBox', `0 0 100 100`);
            layer.setAttribute('preserveAspectRatio', 'none');
            root.appendChild(layer);
        }

        const pairs = [];
        blocks.forEach(code => {
            const text = (code.textContent || '').trim();
            const lines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            // صيغة: fromId -> toId  |  أو  /path#id -> /path#id
            lines.forEach(ln => {
                const m = ln.split(/\s*->\s*/);
                if (m.length !== 2) return;
                pairs.push({ from: m[0], to: m[1] });
            });
            // حوّل الكتلة إلى قائمة روابط أنيقة
            const pre = code.closest('pre');
            const box = document.createElement('div');
            box.className = 'flow-links';
            const title = document.createElement('div'); title.className = 'flow-links-title'; title.textContent = 'تدفق مترابط';
            const list = document.createElement('div'); list.className = 'flow-links-list';
            pairs.forEach(p => {
                const a = document.createElement('a'); a.className = 'flow-link-chip';
                const isCross = /\//.test(p.to) || /\//.test(p.from);
                const label = `${p.from} → ${p.to}`;
                a.textContent = label;
                if (isCross) {
                    // استعمل الرابط كما هو، لو يحتوي path
                    const href = p.to.startsWith('#') ? p.to : `#${p.to.replace(/^#/, '')}`;
                    a.href = href;
                    a.onclick = (e) => { /* خلي المتصفح يروح */ };
                } else {
                    a.href = '#';
                    a.addEventListener('click', (e) => {
                        e.preventDefault();
                        const tgt = root.querySelector(p.to.startsWith('#') ? p.to : `#${p.to}`);
                        if (tgt) UIComponents.scrollToHeading(tgt);
                    });
                }
                list.appendChild(a);
            });
            box.appendChild(title); box.appendChild(list);
            pre.replaceWith(box);
        });

        // ارسم أسهم داخل الصفحة فقط (لو الطرفين موجودين هنا)
        const computeAndDraw = () => {
            // امسح
            while (layer.firstChild) layer.removeChild(layer.firstChild);
            const hostRect = root.getBoundingClientRect();
            const width = hostRect.width; const height = root.scrollHeight; // تقريب
            layer.setAttribute('width', `${width}`);
            layer.style.height = `${height}px`;
            layer.setAttribute('viewBox', `0 0 ${width} ${height}`);
            const mkMarker = () => {
                const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
                marker.setAttribute('id', 'arrowhead');
                marker.setAttribute('orient', 'auto');
                marker.setAttribute('markerWidth', '8');
                marker.setAttribute('markerHeight', '6');
                marker.setAttribute('refX', '8');
                marker.setAttribute('refY', '3');
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 'M0,0 L8,3 L0,6 Z');
                path.setAttribute('fill', 'currentColor');
                marker.appendChild(path);
                defs.appendChild(marker);
                layer.appendChild(defs);
            };
            mkMarker();

            const curPairs = pairs.filter(p => !(/[\/]/.test(p.from) || /[\/]/.test(p.to)));
            curPairs.forEach(p => {
                const fromEl = root.querySelector(p.from.startsWith('#') ? p.from : `#${p.from}`);
                const toEl = root.querySelector(p.to.startsWith('#') ? p.to : `#${p.to}`);
                if (!fromEl || !toEl) return;
                const fr = fromEl.getBoundingClientRect();
                const tr = toEl.getBoundingClientRect();
                const sx = (fr.right - hostRect.left); // RTL: من اليمين
                const sy = (fr.top - hostRect.top) + fr.height / 2;
                const ex = (tr.right - hostRect.left);
                const ey = (tr.top - hostRect.top) + tr.height / 2;
                const dx = (sx - ex);
                const c = Math.max(40, Math.min(160, Math.abs(dx) * 0.6));
                const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                pathEl.setAttribute('d', `M ${sx} ${sy} C ${sx - c} ${sy}, ${ex + c} ${ey}, ${ex} ${ey}`);
                pathEl.setAttribute('fill', 'none');
                pathEl.setAttribute('stroke', 'var(--primary)');
                pathEl.setAttribute('stroke-width', '2');
                pathEl.setAttribute('marker-end', 'url(#arrowhead)');
                pathEl.setAttribute('opacity', '0.7');
                layer.appendChild(pathEl);
            });
        };

        const throttled = (()=>{ let raf=null; return ()=>{ if (raf) return; raf=requestAnimationFrame(()=>{ computeAndDraw(); raf=null; }); }; })();
        window.addEventListener('scroll', throttled, { passive: true });
        window.addEventListener('resize', throttled);
        setTimeout(computeAndDraw, 80);
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
    if (has('api-conventions') || has('conventions') || has('اتفاقيات')) return 'conventions';
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
    if (has('design-tokens')) return 'tokens';
    if (has('design-system')) return 'design-system';
    if (has('performance-and-a11y') || has('performance') || has('a11y')) return 'performance';
    if (has('component-library')) return 'components';

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
            conventions: 'file-cog',
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
            tokens: 'layers',
            'design-system': 'shapes',
            performance: 'gauge',
            components: 'boxes',
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
            frontend: 'monitor',
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
            '00-api-conventions': 'اتفاقيات API',
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
            '01-design-tokens': 'Design Tokens',
            '02-design-system': 'Design System',
            '02-performance-and-a11y': 'الأداء وقابلية الوصول',
            '03-component-library': 'مكتبة المكونات',
            '04-ux-flows': 'UX Flows',
            '05-ui-screens-client': 'شاشات العميل',
            '06-ui-screens-admin': 'شاشات المدير',
            '07-ui-screens-creator': 'شاشات المبدع',
            '08-ui-screens-salaried': 'شاشات الموظف',
            
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
            '03-monitoring': 'المراقبة',
            '04-backup-and-restore': 'النسخ الاحتياطي والاستعادة',
            '05-disaster-recovery': 'التعافي من الكوارث',
            
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
                    UIComponents.scrollToHeading(heading);
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
                    UIComponents.scrollToHeading(heading);
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
        // Enhance floating TOC behavior for large screens
        try { UIComponents.enhanceFloatingTOC(); } catch (_) {}
    }

    // تحسين سلوك TOC الطافي على الشاشات الكبيرة
    static enhanceFloatingTOC() {
        const toc = document.querySelector('.floating-toc');
        if (!toc || window.innerWidth < 1024) return;

        let lastY = window.scrollY;
        let ticking = false;
        const rafUpdate = () => {
            const y = window.scrollY;
            // حركة خفيفة لامتصاص التقطيع
            const delta = Math.max(0, y - lastY);
            toc.style.willChange = 'transform';
            toc.style.transform = `translateY(${delta}px)`;
            requestAnimationFrame(() => {
                toc.style.transform = '';
                toc.style.willChange = '';
            });
            lastY = y;
            ticking = false;
        };
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(rafUpdate);
                ticking = true;
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Observe headings for active state
    static observeHeadings(headings) {
        const topOff = UIComponents.getHeaderOffset();
        const options = {
            // push the observer top boundary below the fixed header
            rootMargin: `${-Math.round(topOff + 8)}px 0px -60% 0px`,
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
    const headerOff = UIComponents.getHeaderOffset();
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
        // consider a heading active once its top passes under the header edge
        if ((r.top - headerOff) <= 8) idx = i; else break;
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

        let lastRun = 0;
        const onScroll = () => {
            const now = performance.now();
            if (now - lastRun < 16) return; // ~60fps throttle
            lastRun = now;
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
            UIComponents.scrollToHeading(h2Headings[idx]);
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

    // =============== Design Tokens Enhancer (Colors / Shadows / Typography) ===============
    static enhanceDesignTokens(rootEl) {
        const root = rootEl || document.getElementById('doc-content');
        if (!root) return;

        // Helper: find the first <pre><code> after a heading that matches a label
        const findCodeAfterHeading = (includesText) => {
            const heads = Array.from(root.querySelectorAll('h2, h3'));
            const target = heads.find(h => (h.textContent || '').toLowerCase().includes(includesText));
            if (!target) return null;
            // walk next siblings until we hit a pre>code
            let el = target.nextElementSibling;
            while (el) {
                if (el.matches('pre') && el.querySelector('code')) return el.querySelector('code');
                // stop when another heading encountered
                if (/^H[1-6]$/.test(el.tagName)) break;
                el = el.nextElementSibling;
            }
            return null;
        };

        // Colors
        try {
            const colorCode = findCodeAfterHeading('tokens — colors');
            if (colorCode) {
                const text = colorCode.textContent || '';
                const colors = UIComponents.extractColorTokens(text);
                if (colors.length) {
                    const palette = UIComponents.renderColorPalette(colors);
                    const hostPre = colorCode.closest('pre');
                    hostPre && hostPre.after(palette);
                }
            }
        } catch (_) {}

        // Typography
        try {
            const typoCode = findCodeAfterHeading('tokens — typography');
            if (typoCode) {
                const text = typoCode.textContent || '';
                const stacks = UIComponents.extractTypographyStacks(text);
                if (stacks && (stacks.ar || stacks.en)) {
                    const demo = UIComponents.renderTypographyPreview(stacks);
                    const hostPre = typoCode.closest('pre');
                    hostPre && hostPre.after(demo);
                }
            } else {
                // fallback: from bullet list lines that include Arabic:/English:
                const lis = Array.from(root.querySelectorAll('li'));
                const stacks = { ar: '', en: '' };
                lis.forEach(li => {
                    const t = (li.textContent || '').trim();
                    if (t.toLowerCase().startsWith('arabic:')) stacks.ar = t.split(':').slice(1).join(':').trim();
                    if (t.toLowerCase().startsWith('english:')) stacks.en = t.split(':').slice(1).join(':').trim();
                });
                if (stacks.ar || stacks.en) {
                    const demo = UIComponents.renderTypographyPreview(stacks);
                    // append after the list block
                    const anyLi = lis[0] && lis[0].closest('ul, ol');
                    anyLi && anyLi.after(demo);
                }
            }
        } catch (_) {}

        // Shadows / Elevation
        try {
            const elevCode = findCodeAfterHeading('tokens — spacing & radius') || findCodeAfterHeading('tokens — elevation') || findCodeAfterHeading('elevation');
            const firstCssCode = elevCode || root.querySelector('pre code.language-css, pre code[class*="css"]');
            if (firstCssCode) {
                const text = firstCssCode.textContent || '';
                const shadows = UIComponents.extractShadowTokens(text);
                if (shadows.length) {
                    const grid = UIComponents.renderShadowGrid(shadows);
                    const hostPre = firstCssCode.closest('pre');
                    hostPre && hostPre.after(grid);
                }
                // Spacing & Radius
                const spaces = UIComponents.extractSpacingTokens(text);
                if (spaces.length) {
                    const grid = UIComponents.renderSpacingGrid(spaces);
                    const hostPre = firstCssCode.closest('pre');
                    hostPre && hostPre.after(grid);
                }
                const radii = UIComponents.extractRadiusTokens(text);
                if (radii.length) {
                    const grid = UIComponents.renderRadiusGrid(radii);
                    const hostPre = firstCssCode.closest('pre');
                    hostPre && hostPre.after(grid);
                }
            }
        } catch (_) {}

        // Breakpoints
        try {
            const bpCode = findCodeAfterHeading('tokens — breakpoints') || root.querySelector('pre code.language-css, pre code[class*="css"]');
            if (bpCode) {
                const text = bpCode.textContent || '';
                const bps = UIComponents.extractBreakpoints(text);
                if (bps.length) {
                    const row = UIComponents.renderBreakpoints(bps);
                    const hostPre = bpCode.closest('pre');
                    hostPre && hostPre.after(row);
                }
            }
        } catch (_) {}
    }

    // ---- Parsers ----
    static extractColorTokens(cssText) {
        const colors = [];
        const lines = (cssText || '').split(/\n|;|\r/);
        const colorRe = /(#[0-9a-fA-F]{3,8})|rgb[a]?\([^\)]*\)|hsl[a]?\([^\)]*\)/;
        lines.forEach(line => {
            const m = colorRe.exec(line);
            if (!m) return;
            // try extract var name like --color-primary: #...
            const nameMatch = /(--[\w-]+)\s*:/.exec(line);
            const name = nameMatch ? nameMatch[1] : (line.trim().split(':')[0] || '').trim();
            const value = m[0];
            if (value) colors.push({ name, value });
        });
        // dedupe by value+name
        const seen = new Set();
        return colors.filter(c => {
            const k = `${c.name}|${c.value}`;
            if (seen.has(k)) return false;
            seen.add(k);
            return true;
        }).slice(0, 64);
    }

    static extractTypographyStacks(cssText) {
        const stacks = { ar: '', en: '' };
        // e.g. ; font-ar: 'Dubai', system-ui, ...; font-en: 'Inter', ...
        const ar = /font-ar\s*:\s*([^;\n]+)/i.exec(cssText);
        const en = /font-en\s*:\s*([^;\n]+)/i.exec(cssText);
        if (ar) stacks.ar = ar[1].trim();
        if (en) stacks.en = en[1].trim();
        return stacks;
    }

    static extractShadowTokens(cssText) {
        const res = [];
        const lines = (cssText || '').split(/\n|;|\r/);
        lines.forEach(line => {
            if (/shadow\s*:\s*/i.test(line)) {
                const nameMatch = /(--[\w-]+)\s*:/.exec(line);
                const name = nameMatch ? nameMatch[1] : 'shadow';
                const value = line.split(':').slice(1).join(':').trim();
                if (value) res.push({ name, value });
            }
        });
        // no tokens? fall back to typical small shadow var
        if (!res.length) {
            const m = /--shadow\s*:\s*([^;\n]+)/i.exec(cssText || '');
            if (m) res.push({ name: '--shadow', value: m[1].trim() });
        }
        return res.slice(0, 12);
    }

    static extractSpacingTokens(cssText) {
        const res = [];
        const lines = (cssText || '').split(/\n|;|\r/);
        lines.forEach(line => {
            const m = /(\-\-space[-\w]*)\s*:\s*([0-9.]+)px/i.exec(line);
            if (!m) return;
            const name = m[1];
            const px = parseFloat(m[2]);
            if (!isNaN(px)) res.push({ name, px });
        });
        return res.sort((a,b)=>a.px-b.px).slice(0, 16);
    }

    static extractRadiusTokens(cssText) {
        const res = [];
        const lines = (cssText || '').split(/\n|;|\r/);
        lines.forEach(line => {
            const m = /(\-\-radius[-\w]*)\s*:\s*([0-9.]+)px/i.exec(line);
            if (!m) return;
            const name = m[1];
            const px = parseFloat(m[2]);
            if (!isNaN(px)) res.push({ name, px });
        });
        return res.sort((a,b)=>a.px-b.px).slice(0, 12);
    }

    static extractBreakpoints(cssText) {
        const res = [];
        const lines = (cssText || '').split(/\n|;|\r/);
        lines.forEach(line => {
            const m = /(\-\-bp[-\w]*)\s*:\s*([0-9.]+)px/i.exec(line);
            if (!m) return;
            const name = m[1];
            const px = parseFloat(m[2]);
            if (!isNaN(px)) res.push({ name, px });
        });
        return res.sort((a,b)=>a.px-b.px).slice(0, 8);
    }

    // ---- Renderers ----
    static renderColorPalette(colors) {
        const grid = document.createElement('div');
        grid.className = 'token-palette';

        const contrastRatio = (hex) => {
            // compute contrast vs white/black quickly
            const parse = (c) => {
                // supports #RGB, #RRGGBB, rgba(), hsl() via canvas
                const ctx = UIComponents._c2d || (UIComponents._c2d = document.createElement('canvas').getContext('2d'));
                try { ctx.fillStyle = c; } catch { ctx.fillStyle = '#000'; }
                const s = ctx.fillStyle; // normalized rgb(a)
                const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(s);
                if (!m) return { r: 0, g: 0, b: 0 };
                const r = parseInt(m[1]);
                const g = parseInt(m[2]);
                const b = parseInt(m[3]);
                return { r, g, b };
            };
            const { r, g, b } = parse(hex);
            const lum = (v) => {
                v /= 255;
                return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
            };
            const L = 0.2126 * lum(r) + 0.7152 * lum(g) + 0.0722 * lum(b);
            const Lwhite = 1, Lblack = 0;
            const cW = (Lwhite + 0.05) / (L + 0.05);
            const cB = (L + 0.05) / (Lblack + 0.05);
            return cB > cW ? { color: '#000', ratio: cB } : { color: '#fff', ratio: cW };
        };

        colors.forEach(({ name, value }) => {
            const card = document.createElement('div');
            card.className = 'token-swatch';
            const header = document.createElement('div');
            header.className = 'swatch-color';
            header.style.background = value;
            const cr = contrastRatio(value);
            header.style.color = cr.color;
            header.textContent = value;
            const body = document.createElement('div');
            body.className = 'swatch-meta';
            const n = document.createElement('div');
            n.className = 'swatch-name';
            n.textContent = name || 'color';
            const copy = document.createElement('button');
            copy.type = 'button';
            copy.className = 'swatch-copy';
            copy.setAttribute('aria-label', 'نسخ اللون');
            copy.innerHTML = '<i data-lucide="copy"></i>';
            copy.addEventListener('click', async (e) => {
                e.preventDefault();
                try { await navigator.clipboard.writeText(value); copy.classList.add('copied'); setTimeout(()=>copy.classList.remove('copied'), 1000); } catch(_) {}
            });
            body.appendChild(n);
            body.appendChild(copy);
            card.appendChild(header);
            card.appendChild(body);
            grid.appendChild(card);
        });

        if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
        return grid;
    }

    static renderShadowGrid(shadows) {
        const grid = document.createElement('div');
        grid.className = 'shadow-grid';
        shadows.forEach(({ name, value }) => {
            const card = document.createElement('div');
            card.className = 'shadow-card';
            const box = document.createElement('div');
            box.className = 'shadow-box';
            box.style.boxShadow = value;
            const meta = document.createElement('div');
            meta.className = 'shadow-meta';
            meta.textContent = `${name}: ${value}`;
            card.appendChild(box);
            card.appendChild(meta);
            grid.appendChild(card);
        });
        return grid;
    }

    static renderTypographyPreview(stacks) {
        const wrap = document.createElement('div');
        wrap.className = 'typography-preview';
        const mk = (label, stack, sample, dir = 'rtl') => {
            if (!stack) return null;
            const card = document.createElement('div');
            card.className = 'typo-card';
            const title = document.createElement('div');
            title.className = 'typo-title';
            title.textContent = `${label}`;
            const text = document.createElement('div');
            text.className = 'typo-sample';
            text.textContent = sample;
            text.style.fontFamily = stack;
            text.setAttribute('dir', dir);
            const stackEl = document.createElement('div');
            stackEl.className = 'typo-stack';
            stackEl.textContent = stack;
            card.appendChild(title);
            card.appendChild(text);
            card.appendChild(stackEl);
            return card;
        };
        const ar = mk('Arabic', stacks.ar, 'مثال نص عربي — وزن عادي 16px، للمعاينة.', 'rtl');
        const en = mk('English', stacks.en, 'The quick brown fox jumps over the lazy dog. 16px regular.', 'ltr');
        ar && wrap.appendChild(ar);
        en && wrap.appendChild(en);
        return wrap;
    }

    static renderSpacingGrid(spaces) {
        const wrap = document.createElement('div');
        wrap.className = 'spacing-grid';
        const max = Math.max(...spaces.map(s=>s.px), 1);
        spaces.forEach(({ name, px }) => {
            const row = document.createElement('div');
            row.className = 'spacing-item';
            const label = document.createElement('div');
            label.className = 'spacing-label';
            label.textContent = `${name}`;
            const bar = document.createElement('div');
            bar.className = 'spacing-bar';
            bar.style.width = `${Math.max(8, (px/max)*100)}%`;
            const val = document.createElement('div');
            val.className = 'spacing-value';
            val.textContent = `${px}px`;
            row.appendChild(label);
            row.appendChild(bar);
            row.appendChild(val);
            wrap.appendChild(row);
        });
        return wrap;
    }

    static renderRadiusGrid(radii) {
        const grid = document.createElement('div');
        grid.className = 'radius-grid';
        radii.forEach(({ name, px }) => {
            const card = document.createElement('div');
            card.className = 'radius-card';
            const box = document.createElement('div');
            box.className = 'radius-box';
            box.style.borderRadius = `${px}px`;
            const meta = document.createElement('div');
            meta.className = 'radius-meta';
            meta.textContent = `${name}: ${px}px`;
            card.appendChild(box);
            card.appendChild(meta);
            grid.appendChild(card);
        });
        return grid;
    }

    static renderBreakpoints(bps) {
        const row = document.createElement('div');
        row.className = 'bp-chips';
        const max = Math.max(...bps.map(b=>b.px), 1);
        bps.forEach(({ name, px }) => {
            const chip = document.createElement('div');
            chip.className = 'bp-chip';
            const title = document.createElement('div');
            title.className = 'bp-name';
            title.textContent = name;
            const preview = document.createElement('div');
            preview.className = 'bp-preview';
            preview.style.width = `${Math.max(20, (px/max)*100)}%`;
            const v = document.createElement('div');
            v.className = 'bp-value';
            v.textContent = `${px}px`;
            chip.appendChild(title);
            chip.appendChild(preview);
            chip.appendChild(v);
            row.appendChild(chip);
        });
        return row;
    }

    // =============== Design System Page Enhancer ===============
    static enhanceDesignSystemBlocks(rootEl, path = '') {
        const root = rootEl || document.getElementById('doc-content');
        if (!root) return;
        const isDS = /06-frontend\/02-design-system/.test(path) || /design system/i.test((root.querySelector('h1')?.textContent||''));
        if (!isDS) return;

        // 1) Image grids: جمع الـfigures المتجاورة إلى شبكة
        const figs = Array.from(root.querySelectorAll('figure.md-figure'));
        let group = [];
        const flushGroup = () => {
            if (group.length <= 1) { group = []; return; }
            const wrap = document.createElement('div');
            wrap.className = 'ds-image-grid';
            group[0].parentNode.insertBefore(wrap, group[0]);
            group.forEach(f => wrap.appendChild(f));
            group = [];
        };
        figs.forEach((f, idx) => {
            const prev = figs[idx-1];
            if (!prev) { group = [f]; return; }
            const gap = f.offsetTop - prev.offsetTop;
            if (Math.abs(gap) < 600) group.push(f); else { flushGroup(); group = [f]; }
        });
        flushGroup();

        // 2) قوائم بعد h3/h4 إلى بطاقات
        Array.from(root.querySelectorAll('h3 + ul, h3 + ol, h4 + ul, h4 + ol')).forEach(list => {
            list.classList.add('ds-card-list');
            Array.from(list.children).forEach(li => li.classList.add('ds-card-li'));
        });

        // 3) Spec cards للكود القصير
        Array.from(root.querySelectorAll('pre > code')).forEach(code => {
            const txt = (code.textContent||'').trim();
            const isStub = txt.startsWith('/*') || txt.length < 40;
            if (!isStub) return;
            const pre = code.closest('pre');
            if (!pre || pre.classList.contains('spec-card')) return;
            pre.classList.add('spec-card');
            const badge = document.createElement('div');
            badge.className = 'spec-badge';
            badge.textContent = 'Spec';
            pre.insertBefore(badge, pre.firstChild);
        });

        // 4) Grid preview بسيط
        const gridHead = Array.from(root.querySelectorAll('h2, h3')).find(h => /(grid system|نظام الشبكة|الشبكة والتخطيط)/i.test(h.textContent||''));
        if (gridHead) {
            const existing = gridHead.parentElement.querySelector('.grid-preview');
            if (!existing) {
                const demo = document.createElement('div');
                demo.className = 'grid-preview';
                for (let i=1;i<=12;i++) {
                    const col = document.createElement('div');
                    col.className = 'grid-col';
                    col.textContent = String(i);
                    demo.appendChild(col);
                }
                gridHead.after(demo);
            }
        }
    }

    // =============== User Flows & Frontend Preview Enhancer ===============
    static enhanceUserFlowsAndFrontPreview(rootEl, path = '') {
        const root = rootEl || document.getElementById('doc-content');
        if (!root) return;
        const isFrontend = /06-frontend\//.test(path) || /frontend|واجهات|واجهة/i.test(root.textContent||'');

        // Viewport toolbar (mobile/tablet/desktop/full)
        const ensureToolbar = () => {
            if (root.querySelector('.viewport-toolbar')) return;
            const tb = document.createElement('div');
            tb.className = 'viewport-toolbar';
            tb.innerHTML = `
                <span class="vp-label">Viewport:</span>
                <button data-vp="mobile">Mobile</button>
                <button data-vp="tablet">Tablet</button>
                <button data-vp="desktop">Desktop</button>
                <button data-vp="full" class="active">Full</button>
            `;
            const host = root.querySelector('h1') || root.firstChild;
            if (host) host.after(tb); else root.prepend(tb);
            tb.addEventListener('click', (e) => {
                const b = e.target.closest('button[data-vp]');
                if (!b) return;
                tb.querySelectorAll('button').forEach(x=>x.classList.remove('active'));
                b.classList.add('active');
                const mode = b.getAttribute('data-vp');
                if (mode === 'full') root.removeAttribute('data-vp');
                else root.setAttribute('data-vp', mode);
            });
        };
        ensureToolbar();

        // Device frames: based على alt يتضمن [mobile]/[tablet]/[desktop]
        const figures = Array.from(root.querySelectorAll('figure.md-figure, img.md-image, img'));
        figures.forEach(el => {
            const img = el.tagName.toLowerCase() === 'img' ? el : el.querySelector('img');
            if (!img) return;
            const alt = (img.getAttribute('alt')||'').toLowerCase();
            let type = null;
            if (alt.includes('[mobile]')) type = 'mobile';
            else if (alt.includes('[tablet]')) type = 'tablet';
            else if (alt.includes('[desktop]')) type = 'desktop';
            if (!type) return;
            // Skip if already framed
            const currentFrame = el.closest('.device-frame');
            if (currentFrame) { currentFrame.classList.add('viewport-target'); return; }
            const frame = document.createElement('div');
            frame.className = `device-frame device-${type} viewport-target`;
            if (el.tagName.toLowerCase() === 'figure') {
                el.parentNode.insertBefore(frame, el);
                frame.appendChild(el);
            } else {
                // bare img
                img.parentNode.insertBefore(frame, img);
                frame.appendChild(img);
            }
        });

        // Flow steps: ul/ol كل عنصر بيه صورة/شكل يتحول ستبر أفقي
        const lists = Array.from(root.querySelectorAll('ol, ul'));
        lists.forEach(list => {
            // only if every li contains an img/figure
            const items = Array.from(list.children);
            if (!items.length) return;
            const ok = items.every(li => li.querySelector('img, figure, .md-figure'));
            if (!ok) return;
            list.classList.add('flow-steps');
            items.forEach((li, idx) => {
                li.classList.add('flow-step');
                const n = document.createElement('div');
                n.className = 'flow-step-num';
                n.textContent = String(idx+1);
                li.prepend(n);
                const img = li.querySelector('img');
                if (img && !img.closest('.flow-thumb')) {
                    const wrap = document.createElement('div');
                    wrap.className = 'flow-thumb';
                    img.parentNode.insertBefore(wrap, img);
                    wrap.appendChild(img);
                }
            });
        });

        // Mark obvious frontend pages for defaults
        if (isFrontend && !root.hasAttribute('data-vp')) {
            root.setAttribute('data-vp', 'desktop');
        }
    }

    // =============== Component Library Enhancer ===============
    static enhanceComponentLibrary(rootEl, path = '') {
        const root = rootEl || document.getElementById('doc-content');
        if (!root) return;
        const isCL = /06-frontend\/03-component-library/.test(path) || /(component library|مكتبة المكونات)/i.test((root.querySelector('h1')?.textContent||''));
        if (!isCL) return;

        const findHeading = (regex) => Array.from(root.querySelectorAll('h2, h3')).find(h => regex.test(h.textContent||''));

        const injectAfter = (el, block) => { if (!el) { root.appendChild(block); } else { el.after(block); } };

        // Buttons Demo
        const buttonsHead = findHeading(/buttons|الأزرار/i);
        if (buttonsHead && !buttonsHead.nextElementSibling?.classList?.contains('comp-demo')) {
            const demo = document.createElement('div');
            demo.className = 'comp-demo';
            const title = document.createElement('div');
            title.className = 'demo-title';
            title.textContent = 'Buttons — الأحجام والأنماط';
            const grid = document.createElement('div');
            grid.className = 'btn-grid';
            const variants = ['primary','secondary','outline','ghost','destructive'];
            const sizes = ['xs','sm','md','lg','xl'];
            sizes.forEach(sz => {
                variants.forEach(v => {
                    const b = document.createElement('button');
                    b.className = `ui-btn ui-${v} ui-${sz}`;
                    b.textContent = `${v} ${sz}`;
                    grid.appendChild(b);
                });
                // full width sample per size
                const bw = document.createElement('button');
                bw.className = `ui-btn ui-primary ui-${sz} ui-block`;
                bw.textContent = `Full Width (${sz})`;
                grid.appendChild(bw);
            });
            // disabled + loading
            const disabled = document.createElement('button'); disabled.className = 'ui-btn ui-secondary ui-md'; disabled.disabled = true; disabled.textContent = 'Disabled';
            const loading = document.createElement('button'); loading.className = 'ui-btn ui-primary ui-md is-loading'; loading.textContent = 'Loading...';
            grid.appendChild(disabled); grid.appendChild(loading);
            demo.appendChild(title); demo.appendChild(grid);
            injectAfter(buttonsHead, demo);
        }

        // Inputs Demo
        const inputsHead = findHeading(/inputs|حقول|textareas|النصية/i);
        if (inputsHead && !inputsHead.nextElementSibling?.classList?.contains('comp-demo')) {
            const demo = document.createElement('div'); demo.className='comp-demo';
            const title = document.createElement('div'); title.className='demo-title'; title.textContent='Inputs & Textareas — الحالات';
            const grid = document.createElement('div'); grid.className='input-grid';
            const makeRow = (label, inner) => { const w=document.createElement('div'); w.className='form-field'; const l=document.createElement('label'); l.textContent=label; w.appendChild(l); w.appendChild(inner); return w; };
            const in1 = document.createElement('input'); in1.className='ui-input'; in1.placeholder='Default';
            const in2 = document.createElement('input'); in2.className='ui-input is-invalid'; in2.placeholder='Invalid';
            const in3 = document.createElement('input'); in3.className='ui-input'; in3.placeholder='Disabled'; in3.disabled = true;
            const ta = document.createElement('textarea'); ta.className='ui-textarea'; ta.rows=3; ta.placeholder='Textarea';
            grid.appendChild(makeRow('افتراضي', in1));
            grid.appendChild(makeRow('خطأ/Invalid', in2));
            grid.appendChild(makeRow('معطل', in3));
            grid.appendChild(makeRow('Textarea', ta));
            demo.appendChild(title); demo.appendChild(grid);
            injectAfter(inputsHead, demo);
        }

        // Selection Controls (Checkbox, Radio, Switch)
        const selHead = findHeading(/checkbox|radio|switch|الاختيار|الراديو|سويتش/i);
        if (selHead && !selHead.nextElementSibling?.classList?.contains('comp-demo')) {
            const demo = document.createElement('div'); demo.className='comp-demo';
            const title = document.createElement('div'); title.className='demo-title'; title.textContent='Selection Controls';
            const row = document.createElement('div'); row.className='selection-row';
            row.innerHTML = `
                <label class="ui-check"><input type="checkbox" checked><span>Checkbox</span></label>
                <label class="ui-radio"><input type="radio" name="r1" checked><span>Radio A</span></label>
                <label class="ui-radio"><input type="radio" name="r1"><span>Radio B</span></label>
                <label class="ui-switch"><input type="checkbox" checked><span class="track"><span class="thumb"></span></span><span class="sw-label">Switch</span></label>
            `;
            demo.appendChild(title); demo.appendChild(row);
            injectAfter(selHead, demo);
        }

        // Alerts
        const alertsHead = findHeading(/alert|toast|تنبيه|تحذير|ملاحظة/i);
        if (alertsHead && !alertsHead.nextElementSibling?.classList?.contains('comp-demo')) {
            const demo = document.createElement('div'); demo.className='comp-demo';
            const title = document.createElement('div'); title.className='demo-title'; title.textContent='Alerts';
            const grid = document.createElement('div'); grid.className='alert-grid';
            ['info','success','warning','error'].forEach(v => {
                const a = document.createElement('div'); a.className = `ui-alert ${v}`; a.textContent = `${v[0].toUpperCase()+v.slice(1)} message for users.`; grid.appendChild(a);
            });
            demo.appendChild(title); demo.appendChild(grid);
            injectAfter(alertsHead, demo);
        }

        // Cards
        const cardsHead = findHeading(/card|بطاقات/i);
        if (cardsHead && !cardsHead.nextElementSibling?.classList?.contains('comp-demo')) {
            const demo = document.createElement('div'); demo.className='comp-demo';
            const title = document.createElement('div'); title.className='demo-title'; title.textContent='Card';
            const card = document.createElement('div'); card.className='ui-card';
            card.innerHTML = `
                <div class="card-header">عنوان البطاقة</div>
                <div class="card-body">نص تجريبي قصير يوضح محتوى البطاقة وتخطيطها.</div>
                <div class="card-footer"><button class="ui-btn ui-secondary ui-sm">إجراء</button></div>
            `;
            demo.appendChild(title); demo.appendChild(card);
            injectAfter(cardsHead, demo);
        }

        // Tabs
        const tabsHead = findHeading(/tabs|التبويبات/i);
        if (tabsHead && !tabsHead.nextElementSibling?.classList?.contains('comp-demo')) {
            const demo = document.createElement('div'); demo.className='comp-demo';
            const title = document.createElement('div'); title.className='demo-title'; title.textContent='Tabs';
            const tabs = document.createElement('div'); tabs.className='ui-tabs';
            tabs.innerHTML = `
                <div class="tab-list" role="tablist">
                    <button class="tab active" role="tab" data-tab="one">الأول</button>
                    <button class="tab" role="tab" data-tab="two">الثاني</button>
                    <button class="tab" role="tab" data-tab="three">الثالث</button>
                </div>
                <div class="tab-panels">
                    <div class="tab-panel active" data-panel="one">محتوى تبويب 1</div>
                    <div class="tab-panel" data-panel="two">محتوى تبويب 2</div>
                    <div class="tab-panel" data-panel="three">محتوى تبويب 3</div>
                </div>`;
            tabs.addEventListener('click', (e) => {
                const btn = e.target.closest('.tab'); if (!btn) return;
                const name = btn.getAttribute('data-tab');
                tabs.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active', t===btn));
                tabs.querySelectorAll('.tab-panel').forEach(p=>p.classList.toggle('active', p.getAttribute('data-panel')===name));
            });
            demo.appendChild(title); demo.appendChild(tabs); injectAfter(tabsHead, demo);
        }

        // Modal & Drawer
        const modalHead = findHeading(/modal|drawer|مودال|سحب/i);
        if (modalHead && !modalHead.nextElementSibling?.classList?.contains('comp-demo')) {
            const demo = document.createElement('div'); demo.className='comp-demo';
            const title = document.createElement('div'); title.className='demo-title'; title.textContent='Modal & Drawer';
            const row = document.createElement('div'); row.className='selection-row';
            row.innerHTML = `
                <button class="ui-btn ui-primary ui-sm" data-open="modal">فتح Modal</button>
                <button class="ui-btn ui-secondary ui-sm" data-open="drawer">فتح Drawer</button>
                <div class="ui-modal" hidden>
                  <div class="ui-overlay" data-close></div>
                  <div class="ui-dialog">
                    <div class="ui-dialog-h">عنوان</div>
                    <div class="ui-dialog-b">نص داخل مودال بسيط للتجربة.</div>
                    <div class="ui-dialog-f"><button class="ui-btn ui-secondary ui-sm" data-close>إغلاق</button></div>
                  </div>
                </div>
                <div class="ui-drawer" hidden>
                  <div class="ui-overlay" data-close></div>
                  <div class="ui-drawer-p">
                    <div class="ui-drawer-h">القائمة الجانبية</div>
                    <div class="ui-drawer-b">محتوى السحب الجانبي</div>
                  </div>
                </div>`;
            row.addEventListener('click', (e) => {
                const btn = e.target.closest('button[data-open]');
                if (btn) {
                    const kind = btn.getAttribute('data-open');
                    const el = row.querySelector(kind==='modal'?'.ui-modal':'.ui-drawer');
                    el.hidden = false;
                    return;
                }
                if (e.target.closest('[data-close]')) {
                    row.querySelectorAll('.ui-modal,.ui-drawer').forEach(x=>x.hidden=true);
                }
            });
            demo.appendChild(title); demo.appendChild(row); injectAfter(modalHead, demo);
        }

        // Table
        const tableHead = findHeading(/table|جدول/i);
        if (tableHead && !tableHead.nextElementSibling?.classList?.contains('comp-demo')) {
            const demo = document.createElement('div'); demo.className='comp-demo';
            const title = document.createElement('div'); title.className='demo-title'; title.textContent='Table';
            const wrap = document.createElement('div'); wrap.className='table-wrap';
            const tbl = document.createElement('table'); tbl.className='ui-table';
            tbl.innerHTML = `
                <thead><tr><th>الاسم</th><th>الدور</th><th>الحالة</th></tr></thead>
                <tbody>
                  <tr><td>أحمد</td><td>مدير</td><td><span class="ui-badge success">نشط</span></td></tr>
                  <tr><td>نور</td><td>مصمم</td><td><span class="ui-badge warning">معلّق</span></td></tr>
                  <tr><td>سارة</td><td>مهندسة</td><td><span class="ui-badge error">موقوف</span></td></tr>
                </tbody>`;
            wrap.appendChild(tbl); demo.appendChild(title); demo.appendChild(wrap); injectAfter(tableHead, demo);
        }

        // Breadcrumbs
        const bcHead = findHeading(/breadcrumbs|فتات الخبز|مسار التنقل/i);
        if (bcHead && !bcHead.nextElementSibling?.classList?.contains('comp-demo')) {
            const demo = document.createElement('div'); demo.className='comp-demo';
            const title = document.createElement('div'); title.className='demo-title'; title.textContent='Breadcrumbs';
            const bc = document.createElement('nav'); bc.className='ui-breadcrumbs';
            bc.innerHTML = `<a href="#">الرئيسية</a><span>/</span><a href="#">Frontend</a><span>/</span><span class="current">Component Library</span>`;
            demo.appendChild(title); demo.appendChild(bc); injectAfter(bcHead, demo);
        }

        // Pagination
        const pagHead = findHeading(/pagination|التقسيم الصفحات/i);
        if (pagHead && !pagHead.nextElementSibling?.classList?.contains('comp-demo')) {
            const demo = document.createElement('div'); demo.className='comp-demo';
            const title = document.createElement('div'); title.className='demo-title'; title.textContent='Pagination';
            const p = document.createElement('div'); p.className='ui-pagination';
            p.innerHTML = `<button class="ui-btn ui-outline ui-sm">◄</button>
                           <button class="ui-btn ui-sm">1</button>
                           <button class="ui-btn ui-sm ui-primary">2</button>
                           <button class="ui-btn ui-sm">3</button>
                           <button class="ui-btn ui-outline ui-sm">►</button>`;
            demo.appendChild(title); demo.appendChild(p); injectAfter(pagHead, demo);
        }

        // Badges & Chips & Tooltip
        const badgeHead = findHeading(/badge|chip|وسم|شيب|تولتيب|tooltip/i);
        if (badgeHead && !badgeHead.nextElementSibling?.classList?.contains('comp-demo')) {
            const demo = document.createElement('div'); demo.className='comp-demo';
            const title = document.createElement('div'); title.className='demo-title'; title.textContent='Badges/Chips/Tooltip';
            const row = document.createElement('div'); row.className='selection-row';
            row.innerHTML = `
                <span class="ui-badge info">Info</span>
                <span class="ui-badge success">Success</span>
                <span class="ui-badge warning">Warning</span>
                <span class="ui-badge error">Error</span>
                <span class="ui-chip">Tag <button class="x">×</button></span>
                <button class="ui-btn ui-secondary ui-sm ui-tooltip" data-tip="معلومة سريعة">Hover</button>`;
            row.addEventListener('click', (e)=>{
                if (e.target.matches('.ui-chip .x')) e.target.closest('.ui-chip').remove();
            });
            demo.appendChild(title); demo.appendChild(row); injectAfter(badgeHead, demo);
        }

        // Progress & Skeleton
        const progHead = findHeading(/progress|skeleton|تحميل|شريط/i);
        if (progHead && !progHead.nextElementSibling?.classList?.contains('comp-demo')) {
            const demo = document.createElement('div'); demo.className='comp-demo';
            const title = document.createElement('div'); title.className='demo-title'; title.textContent='Progress & Skeleton';
            const box = document.createElement('div'); box.innerHTML = `
                <div class="ui-progress"><div class="bar" style="--p:65%"></div></div>
                <div class="ui-skeleton" style="height: 12px; width: 60%"></div>
                <div class="ui-skeleton" style="height: 12px; width: 40%"></div>`;
            demo.appendChild(title); demo.appendChild(box); injectAfter(progHead, demo);
        }

        // Avatars & Toast
        const avatarHead = findHeading(/avatar|صورة|هوية/i);
        if (avatarHead && !avatarHead.nextElementSibling?.classList?.contains('comp-demo')) {
            const demo = document.createElement('div'); demo.className='comp-demo';
            const title = document.createElement('div'); title.className='demo-title'; title.textContent='Avatars & Toast';
            const row = document.createElement('div'); row.className='selection-row';
            row.innerHTML = `
                <span class="ui-avatar" data-initials="AJ"></span>
                <span class="ui-avatar" data-initials="DZ"></span>
                <button class="ui-btn ui-primary ui-sm" id="toast-btn">إظهار Toast</button>
                <div class="ui-toast-stack" aria-live="polite"></div>`;
            row.querySelectorAll('.ui-avatar').forEach(a=>{
                const init = a.getAttribute('data-initials')||'';
                a.textContent = init;
            });
            row.addEventListener('click', (e)=>{
                if (e.target.id==='toast-btn') {
                    const stack = row.querySelector('.ui-toast-stack');
                    const t = document.createElement('div'); t.className='ui-toast'; t.textContent='تم تنفيذ العملية بنجاح';
                    stack.appendChild(t);
                    setTimeout(()=>{ t.classList.add('show'); }, 10);
                    setTimeout(()=>{ t.classList.remove('show'); t.addEventListener('transitionend', ()=> t.remove(), {once:true}); }, 2500);
                }
            });
            demo.appendChild(title); demo.appendChild(row); injectAfter(avatarHead, demo);
        }
    }

    // =============== Color Chips Annotator ===============
    static annotateColorChips(rootEl) {
        const root = rootEl || document.getElementById('doc-content');
        if (!root) return;
        const targets = Array.from(root.querySelectorAll('.comp-demo, pre code'));
        const colorRe = /(#[0-9a-fA-F]{3,8}\b|rgba?\([^\)]+\)|hsla?\([^\)]+\))/g;
        targets.forEach(t => {
            const walker = document.createTreeWalker(t, NodeFilter.SHOW_TEXT, null);
            const texts = [];
            let n; while ((n = walker.nextNode())) { if ((n.nodeValue||'').match(colorRe)) texts.push(n); }
            texts.forEach(textNode => {
                const frag = document.createDocumentFragment();
                const parts = (textNode.nodeValue||'').split(colorRe);
                for (let i=0; i<parts.length; i++) {
                    const part = parts[i];
                    if (!part) continue;
                    if (colorRe.test(part)) {
                        const span = document.createElement('span');
                        span.className='color-chip';
                        const dot = document.createElement('i'); dot.style.background = part; span.appendChild(dot);
                        const label = document.createElement('span'); label.className='t'; label.textContent = part; span.appendChild(label);
                        frag.appendChild(span);
                    } else {
                        frag.appendChild(document.createTextNode(part));
                    }
                }
                textNode.parentNode.replaceChild(frag, textNode);
            });
        });
    }
    

    // =============== Enhance tables: wrap, sticky head, optional sticky first column ===============
    static enhanceTables(rootEl) {
        const root = rootEl || document.getElementById('doc-content');
        if (!root) return;
        const tables = Array.from(root.querySelectorAll('table'));
        const isPhone = window.innerWidth < 768;
        
        // تنظيف أي أنماط inline قديمة
        tables.forEach((t) => {
            const cells = t.querySelectorAll('th, td');
            cells.forEach(cell => {
                cell.style.removeProperty('width');
                cell.style.removeProperty('min-width');
                cell.style.removeProperty('max-width');
            });
            
            const inlineWidth = t.getAttribute('width') || (t.style ? t.style.width : '') || '';
            if (inlineWidth) {
                t.removeAttribute('width');
                try { if (t.style) t.style.removeProperty('width'); } catch (_) {}
            }
        });
        
        tables.forEach((table) => {
            // إضافة wrapper إذا لم يكن موجود
            let wrap = table.closest('.table-wrap');
            if (!wrap) {
                wrap = document.createElement('div');
                wrap.className = 'table-wrap';
                
                // إضافة classes حسب الجهاز
                if (isPhone) {
                    wrap.classList.add('mobile-scrollable');
                    wrap.setAttribute('role', 'region');
                    wrap.setAttribute('aria-label', 'جدول قابل للتمرير');
                    wrap.setAttribute('tabindex', '0');
                }
                
                table.parentNode.insertBefore(wrap, table);
                wrap.appendChild(table);
            }
            
            // تطبيق sticky columns للهاتف فقط
            const firstRow = table.querySelector('tr');
            const cols = firstRow ? firstRow.children.length : 0;
            
            if (isPhone && cols >= 4) {
                table.classList.add('mobile-sticky-first');
                wrap.classList.add('has-sticky-col');
            } else {
                table.classList.remove('mobile-sticky-first');
                wrap.classList.remove('has-sticky-col');
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

    // =============== ASCII UI Diagrams Enhancer ===============
    static enhanceAsciiDiagrams(rootEl) {
        const root = rootEl || document.getElementById('doc-content');
        if (!root) return;
        // اختبر إن كانت كتلة code مرسومة بخطوط صندوقية أو ASCII box-drawing
        const isAsciiDiagram = (text, langClass) => {
            const t = (text || '').trim();
            if (!t) return false;
            const lang = (langClass || '').toLowerCase();
            // لو محدد لغة برمجية معروفة، نتجنبه
            if (/json|js|ts|html|css|sql|bash|sh|yaml|yml|mermaid|flow|graph|bash|shell/.test(lang)) return false;
            // حروف الرسم الشائعة
            const BOX_RE = /[┌┐└┘├┤┬┴┼─│╭╮╯╰╱╲]/;
            // وجود أكثر من سطرين + عرض أسطر متقارب ووجود خطوط أفقية طويلة
            const lines = t.split(/\r?\n/);
            if (lines.length < 3) return false;
            const hasBoxChars = BOX_RE.test(t);
            const longHoriz = lines.some(l => /[─\-]{6,}/.test(l));
            return hasBoxChars || longHoriz;
        };

        const candidates = Array.from(root.querySelectorAll('pre > code'));
        candidates.forEach(code => {
            const pre = code.closest('pre');
            if (!pre) return;
            // لا تكرر التغليف
            if (pre.closest('.ascii-viewer')) return;
            const langClass = Array.from(code.classList).join(' ');
            const text = code.textContent || '';
            if (!isAsciiDiagram(text, langClass)) return;

            // أنشئ العارض
            const viewer = document.createElement('div');
            viewer.className = 'ascii-viewer';
            viewer.setAttribute('data-vp', 'desktop');

            const toolbar = document.createElement('div');
            toolbar.className = 'ascii-toolbar';
            toolbar.innerHTML = `
                <div class="at-left">
                  <div class="at-title">UI Mock</div>
                </div>
                <div class="at-right">
                  <div class="vp-group" role="group" aria-label="Viewport">
                    <button class="vp-btn" data-vp="mobile" title="Mobile">Mobile</button>
                    <button class="vp-btn" data-vp="tablet" title="Tablet">Tablet</button>
                    <button class="vp-btn active" data-vp="desktop" title="Desktop">Desktop</button>
                    <button class="vp-btn" data-vp="full" title="Full">Full</button>
                  </div>
                  <button class="az-btn" data-zoom="out" title="تصغير"><i data-lucide="zoom-out"></i></button>
                  <button class="az-btn" data-zoom="in" title="تكبير"><i data-lucide="zoom-in"></i></button>
                  <button class="az-btn" data-fit title="ملاءمة"><i data-lucide="maximize"></i></button>
                  <button class="az-btn" data-reset title="إعادة"><i data-lucide="rotate-ccw"></i></button>
                </div>`;

            const stage = document.createElement('div');
            stage.className = 'ascii-stage';
            const content = document.createElement('div');
            content.className = 'ascii-content';

            // انقل الـpre داخل المحتوى مع الحفاظ على النسخ
            content.appendChild(pre.cloneNode(true));

            // استبدل الـpre الأصلي بالعارض
            pre.replaceWith(viewer);
            viewer.appendChild(toolbar);
            viewer.appendChild(stage);
            stage.appendChild(content);

            // حالة التحويل (تكبير/تصغير/تحريك)
            let scale = 1, tx = 0, ty = 0;
            const apply = () => { content.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`; };
            const fit = () => {
                try {
                    // قياس المحتوى الفعلي داخل pre
                    const preEl = content.querySelector('pre');
                    if (!preEl) return;
                    // حدد المقاس
                    const box = preEl.getBoundingClientRect();
                    const host = stage.getBoundingClientRect();
                    if (box.width <= 0 || box.height <= 0 || host.width <= 0 || host.height <= 0) return;
                    const sx = (host.width - 24) / box.width;
                    const sy = (host.height - 24) / Math.max(box.height, 200);
                    scale = Math.max(0.5, Math.min(1.15, Math.min(sx, sy)));
                    tx = 12; ty = 12; apply();
                } catch (_) {}
            };
            const reset = () => { scale = 1; tx = 0; ty = 0; apply(); };

            // أزرار التولبار
            toolbar.addEventListener('click', (e) => {
                const btn = e.target.closest('button');
                if (!btn) return;
                if (btn.classList.contains('vp-btn')) {
                    const mode = btn.getAttribute('data-vp');
                    viewer.setAttribute('data-vp', mode);
                    toolbar.querySelectorAll('.vp-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    setTimeout(fit, 10);
                    return;
                }
                if (btn.hasAttribute('data-zoom')) {
                    const dir = btn.getAttribute('data-zoom');
                    scale = Math.max(0.3, Math.min(2.5, scale * (dir === 'in' ? 1.2 : 1/1.2)));
                    apply();
                } else if (btn.hasAttribute('data-fit')) {
                    fit();
                } else if (btn.hasAttribute('data-reset')) {
                    reset();
                }
            });

            // سحب للتحريك
            let dragging = false; let sx = 0, sy = 0, ox = 0, oy = 0;
            const start = (clientX, clientY) => { dragging = true; viewer.classList.add('dragging'); sx = clientX; sy = clientY; ox = tx; oy = ty; };
            const move = (clientX, clientY) => { if (!dragging) return; tx = ox + (clientX - sx); ty = oy + (clientY - sy); apply(); };
            const end = () => { dragging = false; viewer.classList.remove('dragging'); };
            stage.addEventListener('mousedown', (e)=>{ if (e.button!==0) return; start(e.clientX,e.clientY); e.preventDefault(); });
            window.addEventListener('mousemove', (e)=> move(e.clientX,e.clientY));
            window.addEventListener('mouseup', end);
            stage.addEventListener('touchstart', (e)=>{ const t=e.touches[0]; if (!t) return; start(t.clientX,t.clientY); }, { passive: true });
            window.addEventListener('touchmove', (e)=>{ const t=e.touches[0]; if (!t) return; move(t.clientX,t.clientY); }, { passive: true });
            window.addEventListener('touchend', end, { passive: true });

            // ملاءمة أولية
            setTimeout(fit, 30);

            // حدّث الأيقونات
            if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
        });
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
