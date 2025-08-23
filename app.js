// Main Application Logic
class DepthDocs {
    constructor() {
        this.currentPath = '/';
        this.sidebarOpen = false;
        this.isDesktop = false;
        this.isLargeDesktop = false;
        this.isTablet = false;
        this.isMobile = false;
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
        // Initialize AOS if available
        if (window.AOS) {
            window.AOS.init({ once: true, duration: 600, easing: 'ease-out' });
        }
        // Initialize Mermaid once
        try {
            if (window.mermaid && typeof window.mermaid.initialize === 'function') {
                window.mermaid.initialize({ startOnLoad: false, securityLevel: 'loose', theme: 'default', fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial' });
            }
        } catch (_) {}
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

    // Load content by fetching markdown or using inline fallback
    async loadContent(path) {
        try {
            UIComponents.showLoading();
            if (path === '/' && typeof pageContent !== 'undefined' && pageContent['/']) {
                const docContent = document.getElementById('doc-content');
                docContent.innerHTML = pageContent['/'];
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
                try { await this.renderMermaid(docContent); } catch (_) {}
                if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
                const wrapper = document.querySelector('.content-wrapper');
                if (wrapper) wrapper.classList.remove('home-full');
                if (window.AOS) setTimeout(() => window.AOS.refreshHard && window.AOS.refreshHard(), 50);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            // Markdown-first loader
            const filePath = path.replace(/^\//, '');
            const version = 'v=2.5';
            let rendered = false;

            const attemptRender = async (url) => {
                const res = await fetch(url, { cache: 'no-store' });
                if (!res.ok) return false;
                const markdown = await res.text();
                const html = marked.parse(markdown);
                const cleanHtml = DOMPurify.sanitize(html);
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
                try { await this.renderMermaid(docContent); } catch (_) {}
                if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
                const wrapper = document.querySelector('.content-wrapper');
                if (wrapper) wrapper.classList.remove('home-full');
                if (window.AOS) setTimeout(() => window.AOS.refreshHard && window.AOS.refreshHard(), 50);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return true;
            };

            // 1) Relative path
            try {
                const mdPath = `./${filePath}.md?${version}`;
                rendered = await attemptRender(mdPath);
            } catch (_) {}

            // 2) Absolute path (GitHub Pages nested routes)
            if (!rendered) {
                try {
                    const base = `${window.location.origin}${window.location.pathname.replace(/index\.html?$/, '')}`;
                    const absUrl = `${base}${filePath}.md?${version}`;
                    rendered = await attemptRender(absUrl);
                } catch (_) {}
            }

            // 3) Raw GitHub fallback
            if (!rendered) {
                try {
                    const host = window.location.host; // e.g., username.github.io
                    const owner = host.split('.')[0] || 'alijawdat-cyber';
                    const repo = (window.location.pathname.split('/').filter(Boolean)[0]) || 'Depth';
                    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${filePath}.md?${version}`;
                    rendered = await attemptRender(rawUrl);
                } catch (_) {}
            }

            // 4) Inline stub fallback
            if (!rendered && typeof pageContent !== 'undefined' && pageContent[path]) {
                const docContent = document.getElementById('doc-content');
                docContent.innerHTML = pageContent[path];
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
                try { await this.renderMermaid(docContent); } catch (_) {}
                if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
                const wrapper = document.querySelector('.content-wrapper');
                if (wrapper) wrapper.classList.remove('home-full');
                if (window.AOS) setTimeout(() => window.AOS.refreshHard && window.AOS.refreshHard(), 50);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            if (!rendered) {
                throw new Error(`المحتوى غير متاح: ${path}`);
            }
        } catch (error) {
            console.error('خطأ في تحميل المحتوى:', error);
            UIComponents.showError(`لم يتم العثور على الصفحة: ${path}`);
        }
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