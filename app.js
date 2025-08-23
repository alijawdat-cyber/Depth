// requestIdleCallback polyfill for iOS Safari and older browsers
if (typeof window !== 'undefined') {
    if (typeof window.requestIdleCallback !== 'function') {
        window.requestIdleCallback = (cb, opts) => {
            const start = Date.now();
            const delay = opts && typeof opts.timeout === 'number' ? Math.min(opts.timeout, 50) : 1;
            return setTimeout(() => cb({
                didTimeout: false,
                timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
            }), delay);
        };
    }
    if (typeof window.cancelIdleCallback !== 'function') {
        window.cancelIdleCallback = (id) => clearTimeout(id);
    }
}

// Main Application Logic
class DepthDocs {
    constructor() {
        this.currentPath = '/';
        this.sidebarOpen = false;
        this.isDesktop = false;
        this.isLargeDesktop = false;
        this.isTablet = false;
        this.isMobile = false;
    // lightweight page cache and preload tracking (LRU 5)
    this.pageCache = new LRUCache(5);
    this.preloadQueue = new Set();
        this.init();
    }

    init() {
        this.checkScreenSize();
        this.initializeSidebarState();
        this.setupEventListeners();
        this.renderSidebar();
        this.handleRoute();
        this.setupScrollEffects();
        this.loadTheme();
        this.initMobileOptimizations(); // إضافة تحسينات الهاتف
        
        // Initialize AOS with iOS/Safari awareness
        const ua = navigator.userAgent || '';
        const isIOS = (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
        const isIOSSafari = isIOS && isSafari;
        if (window.AOS) {
            const isMobile = window.innerWidth < 768;
            if (isIOSSafari) {
                window.AOS.init({ disable: true });
                // Use custom iOS animations via components
                try { UIComponents.applyIOSAnimations(document.getElementById('doc-content') || document.body); } catch (_) {}
            } else {
                window.AOS.init({
                    once: true,
                    duration: isMobile ? 200 : 400,
                    easing: 'ease-out',
                    offset: isMobile ? 50 : 120,
                    delay: 0,
                    anchorPlacement: 'top-bottom',
                    throttleDelay: 80,
                    debounceDelay: 40,
                    disable: false
                });
                // Post-init refresh (throttled)
                setTimeout(() => {
                    try { window.AOS && window.AOS.refresh && window.AOS.refresh(); } catch (_) {}
                    let ticking = false;
                    const onScroll = () => {
                        if (!ticking) {
                            requestAnimationFrame(() => {
                                try { window.AOS && window.AOS.refresh && window.AOS.refresh(); } catch (_) {}
                                ticking = false;
                            });
                            ticking = true;
                        }
                    };
                    window.addEventListener('scroll', onScroll, { passive: true });
                }, 100);
            }
        }
        // Initialize Mermaid once
        try {
            if (window.mermaid && typeof window.mermaid.initialize === 'function') {
                window.mermaid.initialize({ startOnLoad: false, securityLevel: 'loose', theme: 'default', fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial' });
            }
        } catch (_) {}
    }

    // Schedule work during idle time with safe fallback
    scheduleIdle(cb, timeout = 500) {
        if (typeof window.requestIdleCallback === 'function') {
            window.requestIdleCallback(cb, { timeout });
        } else {
            setTimeout(cb, 0);
        }
    }

    // Check current screen size
    checkScreenSize() {
        const width = window.innerWidth;
        this.isLargeDesktop = width >= 1400;
        this.isDesktop = width >= 1024;
        this.isTablet = width >= 768 && width < 1024;
        this.isMobile = width < 768;
        this.updateContentPadding();
        // Toggle mobile TOC visibility per breakpoint
        const mt = document.getElementById('mobile-toc');
        if (mt) {
            if (this.isMobile) mt.classList.remove('hidden'); else mt.classList.add('hidden');
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Burger/open toggle
        const burger = document.getElementById('burger-btn');
        if (burger) burger.addEventListener('click', (e) => { e.preventDefault(); this.toggleSidebar(); });
        // Close button in sidebar
        const closeBtn = document.getElementById('sidebar-close');
        if (closeBtn) closeBtn.addEventListener('click', (e) => { e.preventDefault(); this.closeSidebar(); });
        // Click on overlay closes on mobile/tablet
        const overlay = document.getElementById('sidebar-overlay');
        if (overlay) overlay.addEventListener('click', () => this.closeSidebar());

        const outsideClose = (e) => {
            const sidebar = document.getElementById('sidebar');
            const ov = document.getElementById('sidebar-overlay');
            if (!sidebar) return;
            const isClickInside = sidebar.contains(e.target) || (ov && ov.contains(e.target));
            if (!isClickInside && this.sidebarOpen && !this.isDesktop) {
                this.closeSidebar();
            }
        };

        document.addEventListener('click', outsideClose, { capture: true });
        document.addEventListener('pointerdown', outsideClose, { capture: true });

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) themeToggle.addEventListener('click', () => this.toggleTheme());

        // Handle browser navigation
        window.addEventListener('popstate', () => this.handleRoute());
        // Handle hash changes
        window.addEventListener('hashchange', () => this.handleRoute());

        // Close sidebar on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.sidebarOpen && !this.isDesktop) {
                this.closeSidebar();
            }
        });

        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const oldDesktop = this.isDesktop;
                const oldLargeDesktop = this.isLargeDesktop;

                this.checkScreenSize();
                // Always clear any stale transform caused by previous mobile push
                const mc = document.querySelector('.main-content');
                if (mc) {
                    mc.classList.remove('pushed');
                    mc.style.transform = '';
                }

                // Re-initialize if screen category changed
                if (oldDesktop !== this.isDesktop || oldLargeDesktop !== this.isLargeDesktop) {
                    this.initializeSidebarState();
                    // Re-wire mobile TOC on breakpoint change
                    const dc = document.getElementById('doc-content');
                    if (dc) UIComponents.generateTOC(dc);
                }
            }, 250);
        });
    }

    // Initialize sidebar state for current breakpoint
    initializeSidebarState() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const contentWrapper = document.querySelector('.content-wrapper');
        const mainContent = document.querySelector('.main-content');
        if (!sidebar) return;

        this.sidebarOpen = false;
        sidebar.classList.remove('active');
        document.body.classList.remove('sidebar-open');
        if (overlay) overlay.classList.remove('active');

        if (this.isDesktop || this.isLargeDesktop) {
            sidebar.classList.add('sidebar-closed');
            if (contentWrapper) contentWrapper.classList.add('sidebar-closed');
            if (mainContent) mainContent.classList.add('sidebar-closed');
            if (mainContent) { mainContent.classList.remove('pushed'); mainContent.style.transform = ''; }
            document.body.style.overflow = '';
        } else {
            sidebar.style.width = '';
            document.body.style.overflow = '';
            if (contentWrapper) contentWrapper.classList.remove('sidebar-closed');
            if (mainContent) { mainContent.classList.remove('sidebar-closed'); mainContent.classList.remove('pushed'); mainContent.style.transform = ''; }
        }

        this.updateBurgerButton();
    }

    updateContentPadding() {
        // Reserved for future layout adjustments. Currently handled via CSS classes.
    }

    updateBurgerButton() {
        const burger = document.getElementById('burger-btn');
        if (!burger) return;
        burger.setAttribute('aria-expanded', String(!!this.sidebarOpen));
        burger.classList.toggle('is-open', !!this.sidebarOpen);
    }

    openSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const contentWrapper = document.querySelector('.content-wrapper');
        const mainContent = document.querySelector('.main-content');
        if (!sidebar) return;
        this.sidebarOpen = true;
        sidebar.classList.add('active');
        sidebar.classList.remove('sidebar-closed');
        document.body.classList.add('sidebar-open');
        if (this.isDesktop || this.isLargeDesktop) {
            if (contentWrapper) contentWrapper.classList.remove('sidebar-closed');
            if (mainContent) mainContent.classList.remove('sidebar-closed');
            if (overlay) overlay.classList.remove('active');
        } else {
            if (overlay) overlay.classList.remove('active'); // keep no overlay on phones
            if (mainContent) mainContent.classList.add('pushed');
        }
        this.updateBurgerButton();
    }

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const contentWrapper = document.querySelector('.content-wrapper');
        const mainContent = document.querySelector('.main-content');
        if (!sidebar) return;
        this.sidebarOpen = false;
        sidebar.classList.remove('active');
        document.body.classList.remove('sidebar-open');
        if (overlay) overlay.classList.remove('active');
        if (this.isDesktop || this.isLargeDesktop) {
            sidebar.classList.add('sidebar-closed');
            if (contentWrapper) contentWrapper.classList.add('sidebar-closed');
            if (mainContent) mainContent.classList.add('sidebar-closed');
        } else {
            if (mainContent) { mainContent.classList.remove('pushed'); mainContent.style.transform = ''; }
        }
        this.updateBurgerButton();
    }

    // Toggle sidebar with proper handling for all screen sizes
    toggleSidebar() {
        if (this.sidebarOpen) this.closeSidebar(); else this.openSidebar();
    }

    // Build sidebar navigation from sidebarData
    renderSidebar() {
        try {
            const nav = document.getElementById('sidebar-nav');
            if (!nav) return;
            nav.innerHTML = '';
            const sections = window.sidebarData || (typeof sidebarData !== 'undefined' ? sidebarData : []);
            sections.forEach(section => {
                const sec = UIComponents.createNavSection(section);
                nav.appendChild(sec);
            });
            if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
        } catch (_) {}
    }

    // Navigate to path
    navigate(path) {
        window.location.hash = path;
    }

    // Handle route changes
    async handleRoute() {
        try {
            const hash = window.location.hash || '#/';
            let path = hash.replace(/^#/, '');
            if (!path) path = '/';
            this.currentPath = path;
            // Update breadcrumbs
            UIComponents.updateBreadcrumbs(path);
            // Highlight active nav item
            try {
                const nav = document.getElementById('sidebar-nav');
                if (nav) {
                    nav.querySelectorAll('.nav-item').forEach(a => a.classList.remove('active'));
                    const active = Array.from(nav.querySelectorAll('.nav-item')).find(a => a.getAttribute('href') === `#${path}`);
                    if (active) active.classList.add('active');
                }
            } catch (_) {}
            // Load content
            await this.loadContent(path);
            // Close sidebar on mobile after navigation
            if (this.isMobile) this.closeSidebar();
        } catch (err) {
            console.error('Routing error', err);
            UIComponents.showError('حدث خطأ أثناء الانتقال للصفحة');
        }
    }

    // Fetch content via multiple strategies and return sanitized HTML
    async fetchContent(path) {
        if (path === '/' && typeof pageContent !== 'undefined' && pageContent['/']) {
            return pageContent['/'];
        }
        const filePath = path.replace(/^\//, '');
        const version = 'v=2.5';
        const tryUrl = async (url) => {
            const res = await fetch(url, { cache: 'no-store' });
            if (!res.ok) return null;
            const markdown = await res.text();
            const html = marked.parse(markdown);
            return DOMPurify.sanitize(html);
        };
        // 1) Relative path
        let clean = await tryUrl(`./${filePath}.md?${version}`);
        if (clean) return clean;
        // 2) Absolute path for GH pages
        const base = `${window.location.origin}${window.location.pathname.replace(/index\.html?$/, '')}`;
        clean = await tryUrl(`${base}${filePath}.md?${version}`);
        if (clean) return clean;
        // 3) Raw GitHub
        const host = window.location.host;
        const owner = host.split('.')[0] || 'alijawdat-cyber';
        const repo = (window.location.pathname.split('/').filter(Boolean)[0]) || 'Depth';
        clean = await tryUrl(`https://raw.githubusercontent.com/${owner}/${repo}/main/${filePath}.md?${version}`);
        if (clean) return clean;
        // 4) Inline stub
        if (typeof pageContent !== 'undefined' && pageContent[path]) return pageContent[path];
        throw new Error(`المحتوى غير متاح: ${path}`);
    }

    // Apply content HTML into the page and enhance progressively
    async applyContent(cleanHtml, path) {
        const docContent = document.getElementById('doc-content');
        docContent.innerHTML = cleanHtml;
        UIComponents.sanitizeHeadings(docContent);
        UIComponents.generateTOC(docContent);
        UIComponents.injectPrevNextAndRelated(path);
        UIComponents.enhanceJSONBlocks(docContent);
        UIComponents.enhanceCodeBlocks(docContent);
        UIComponents.enhanceTables(docContent);
        UIComponents.addHeadingAnchors(docContent);
        UIComponents.enhanceInlineTOC(docContent);
        UIComponents.enhanceCallouts(docContent);
        UIComponents.enhanceImagesAndLinks(docContent);
        UIComponents.injectPageTitleIcon(path);
        UIComponents.applyAutoDirection(docContent);
        if (window.UIComponents && UIComponents.applyAOSAttributes) UIComponents.applyAOSAttributes(docContent);
        try { await this.renderMermaid(docContent); } catch (_) {}
        if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
        const wrapper = document.querySelector('.content-wrapper');
        if (wrapper) wrapper.classList.remove('home-full');
    // Avoid AOS refresh on iOS Safari where custom animations are used
    const ua = navigator.userAgent || '';
    const isIOS = (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    const isIOSSafari = isIOS && isSafari;
    if (window.AOS && !isIOSSafari) setTimeout(() => window.AOS.refreshHard && window.AOS.refreshHard(), 50);
        if (window.UIComponents && UIComponents.fixMobileStickyColumns) UIComponents.fixMobileStickyColumns();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Load content with cache and idle rendering
    async loadContent(path) {
        try {
            UIComponents.showLoading();
            if (this.pageCache.get(path)) {
                const cached = this.pageCache.get(path);
                await this.applyContent(cached, path);
                this.preloadAdjacentPages(path);
                return;
            }
            this.scheduleIdle(async () => {
                try {
                    const cleanHtml = await this.fetchContent(path);
                    this.pageCache.set(path, cleanHtml);
                    requestAnimationFrame(() => this.applyContent(cleanHtml, path));
                    this.preloadAdjacentPages(path);
                } catch (error) {
                    console.error('خطأ في تحميل المحتوى:', error);
                    UIComponents.showError(`لم يتم العثور على الصفحة: ${path}`);
                }
            }, 500);
        } catch (error) {
            console.error('خطأ في تحميل المحتوى:', error);
            UIComponents.showError(`لم يتم العثور على الصفحة: ${path}`);
        }
    }

    // Determine adjacent paths (prev/next) from sidebar to preload
    getAdjacentPaths(currentPath) {
        const sections = window.sidebarData || (typeof sidebarData !== 'undefined' ? sidebarData : []);
        let secIndex = -1, itemIndex = -1, paths = [];
        for (let s = 0; s < sections.length; s++) {
            const items = sections[s].items || [];
            const idx = items.findIndex(it => it.path === currentPath);
            if (idx !== -1) { secIndex = s; itemIndex = idx; break; }
        }
        if (secIndex === -1) return paths;
        const curSection = (window.sidebarData || [])[secIndex];
        const curItems = (curSection && curSection.items) ? curSection.items : [];
        if (itemIndex > 0) paths.push(curItems[itemIndex - 1].path);
        if (itemIndex < curItems.length - 1) paths.push(curItems[itemIndex + 1].path);
        return paths;
    }

    // Preload adjacent pages during idle time
    preloadAdjacentPages(currentPath) {
        const adj = this.getAdjacentPaths(currentPath);
        adj.forEach(path => {
        if (this.pageCache.get(path) || this.preloadQueue.has(path)) return;
            this.preloadQueue.add(path);
            this.scheduleIdle(async () => {
                try {
                    const html = await this.fetchContent(path);
            this.pageCache.set(path, html);
                } catch (_) {}
                this.preloadQueue.delete(path);
            }, 2000);
        });
    }

    // Render Mermaid diagrams inside a simple static container (no animations/tools)
    async renderMermaid(root) {
        if (!window.mermaid || !root) return;
        const blocks = root.querySelectorAll('pre > code.language-mermaid, code.mermaid, .language-mermaid');
        if (!blocks.length) return;
        for (const codeEl of blocks) {
            try {
                const parentPre = codeEl.closest('pre');
                const code = codeEl.textContent || '';
                const { svg } = await window.mermaid.render(`m-${Math.random().toString(36).slice(2)}`, code);
                const container = document.createElement('div');
                container.className = 'diagram mermaid-diagram';
                container.innerHTML = svg;
                if (parentPre) parentPre.replaceWith(container); else codeEl.replaceWith(container);
            } catch (_) { /* skip broken diagram */ }
        }
    }

    // Setup scroll effects
    setupScrollEffects() {
        let scrolled = false;
        const header = document.getElementById('main-header');

        window.addEventListener('scroll', () => {
            const shouldScroll = window.scrollY > 10;

            if (shouldScroll !== scrolled) {
                scrolled = shouldScroll;
                if (scrolled) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        });
    }

    // Toggle theme
    toggleTheme() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    // Load saved theme
    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
    }

    // تحسين أداء التمرير على الهاتف + passive listeners عامة
    initMobileOptimizations() {
        const passiveSupported = (() => {
            let passive = false;
            try {
                const opts = Object.defineProperty({}, 'passive', { get: () => { passive = true; } });
                window.addEventListener('test', null, opts);
            } catch (_) {}
            return passive;
        })();
        const passiveOpt = passiveSupported ? { passive: true } : false;

        // Passive listeners
        document.addEventListener('touchstart', () => {}, passiveOpt);
        document.addEventListener('touchmove', () => {}, passiveOpt);
        window.addEventListener('scroll', () => {}, passiveOpt);
        window.addEventListener('wheel', () => {}, passiveOpt);

        if (window.innerWidth > 768) return;

        // تحسين التمرير للجداول
        const setupTableScroll = () => {
            document.querySelectorAll('.table-wrap').forEach(wrap => {
                const onScroll = () => {
                    requestAnimationFrame(() => {
                        // تحديث موضع sticky columns (تعويض ثنائي)
                        const stickyEls = wrap.querySelectorAll('.mobile-sticky-first td:first-child, .mobile-sticky-first th:first-child');
                        stickyEls.forEach(el => {
                            el.style.webkitTransform = `translateX(${wrap.scrollLeft}px)`;
                            el.style.transform = `translateX(${wrap.scrollLeft}px)`;
                        });
                    });
                };
                wrap.addEventListener('scroll', onScroll, passiveOpt);
            });
        };

        // تشغيل فوري ومع تأخير للجداول المحملة لاحقاً
        setupTableScroll();
        setTimeout(setupTableScroll, 1000);
    }
}

// بسيط: LRU Cache للاحتفاظ بآخر N صفحات
class LRUCache {
    constructor(maxSize = 5) {
        this.maxSize = maxSize;
        this.cache = new Map();
    }
    get(key) {
        if (!this.cache.has(key)) return null;
        const val = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, val);
        return val;
    }
    set(key, val) {
        if (this.cache.has(key)) this.cache.delete(key);
        this.cache.set(key, val);
        if (this.cache.size > this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new DepthDocs();
});

// Handle initial route
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (window.app) {
            window.app.handleRoute();
        }
    });
} else {
    setTimeout(() => {
        if (window.app) {
            window.app.handleRoute();
        }
    }, 100);
}

// Debug stats panel (اختياري) - يعمل فقط إذا كانت مكتبة Stats متاحة وهاش #debug
try {
    if (window.location.hash === '#debug' && typeof Stats !== 'undefined') {
        const stats = new Stats();
        stats.showPanel(0);
        document.body.appendChild(stats.dom);
        function animate() {
            stats.begin();
            stats.end();
            requestAnimationFrame(animate);
        }
        animate();
    }
} catch (_) {}