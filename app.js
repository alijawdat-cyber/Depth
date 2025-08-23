// Main Application Logic
class DepthDocs {
    constructor() {
        this.currentPath = '/';
        this.sidebarOpen = false;
        this.isDesktop = false;
        this.isLargeDesktop = false;
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
            const overlay = document.getElementById('sidebar-overlay');
            const isClickInside = sidebar.contains(e.target) || overlay.contains(e.target);
            if (!isClickInside && this.sidebarOpen) {
                this.closeSidebar();
            }
        };

        document.addEventListener('click', outsideClose, { capture: true });
        document.addEventListener('pointerdown', outsideClose, { capture: true });

        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Handle browser navigation
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });

        // Handle hash changes
        window.addEventListener('hashchange', () => {
            this.handleRoute();
        });

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
                // Always clear any stale transform caused by previous mobile push after zooming
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

    // Toggle sidebar with proper handling for all screen sizes
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const contentWrapper = document.querySelector('.content-wrapper');
        const mainContent = document.querySelector('.main-content');
        
        this.sidebarOpen = !this.sidebarOpen;
        
        if (this.sidebarOpen) {
            // Opening sidebar
            sidebar.classList.add('active');
            sidebar.classList.remove('sidebar-closed');
            document.body.classList.add('sidebar-open');
            
            if (this.isDesktop || this.isLargeDesktop) {
                // Desktop: push content
                if (contentWrapper) contentWrapper.classList.remove('sidebar-closed');
                if (mainContent) mainContent.classList.remove('sidebar-closed');
            } else {
                // Mobile/Tablet: push content (no overlay)
                overlay.classList.remove('active');
                sidebar.style.width = '';
                // احسب عرض السايدبار الفعلي لدفع المحتوى بشكل دقيق
                requestAnimationFrame(() => {
                    const sidebarWidth = sidebar.getBoundingClientRect().width;
                    if (mainContent) {
                        mainContent.classList.add('pushed');
                        mainContent.style.transform = `translateX(-${sidebarWidth}px)`;
                    }
                });
                document.body.style.overflow = '';
            }
        } else {
            // Closing sidebar
            this.closeSidebar();
        }
        
        this.updateBurgerButton();
    }

    // Close sidebar
    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const contentWrapper = document.querySelector('.content-wrapper');
        const mainContent = document.querySelector('.main-content');
        
        this.sidebarOpen = false;
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    document.body.classList.remove('sidebar-open');
        sidebar.style.width = '';
        document.body.style.overflow = '';
        
        if (this.isDesktop || this.isLargeDesktop) {
            // Desktop: add sidebar-closed class to stop pushing content
            sidebar.classList.add('sidebar-closed');
            if (contentWrapper) contentWrapper.classList.add('sidebar-closed');
            if (mainContent) mainContent.classList.add('sidebar-closed');
        } else {
            // Mobile/Tablet: remove push translation
            if (mainContent) {
                mainContent.classList.remove('pushed');
                mainContent.style.transform = '';
            }
        }
        
        this.updateBurgerButton();
    }

    // Update content padding based on screen size
    updateContentPadding() {
        const contentWrapper = document.querySelector('.content-wrapper');
        if (contentWrapper) {
            if (this.isMobile) {
                contentWrapper.style.padding = '20px';
            } else {
                contentWrapper.style.padding = '40px 20px';
            }
        }
    }

    // Update burger button state
    updateBurgerButton() {
        const burger = document.getElementById('burger-btn');
        if (this.sidebarOpen) {
            burger.classList.add('active');
        } else {
            burger.classList.remove('active');
        }
    }

    // Render sidebar navigation
    renderSidebar() {
        const nav = document.getElementById('sidebar-nav');
        nav.innerHTML = '';
        
        sidebarData.forEach(section => {
            nav.appendChild(UIComponents.createNavSection(section));
        });

        // Enhance icons via Lucide
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    // Handle routing
    handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        this.currentPath = hash;
        // Reset any mobile push transform that might persist across pages after zoom
        const mc = document.querySelector('.main-content');
        if (mc) {
            mc.classList.remove('pushed');
            mc.style.transform = '';
        }
    // mark home route on body
    if (hash === '/') document.body.classList.add('is-home'); else document.body.classList.remove('is-home');
        
        // Update breadcrumbs
        UIComponents.updateBreadcrumbs(hash);
        
        // Update active nav item
        this.updateActiveNavItem(hash);
        
        // Load content
        this.loadContent(hash);
        
        // Close sidebar on mobile/tablet after navigation
        if (this.isMobile || this.isTablet) {
            this.closeSidebar();
        }

        // Hide mobile TOC on home route
        const mt = document.getElementById('mobile-toc');
        if (mt) {
            if (hash === '/') mt.classList.add('hidden');
        }
    }

    // Update active navigation item
    updateActiveNavItem(path) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${path}`) {
                item.classList.add('active');
                
                // Expand parent section if collapsed
                const section = item.closest('.nav-section');
                if (section) {
                    const title = section.querySelector('.nav-section-title');
                    const items = section.querySelector('.nav-section-items');
                    if (title && items && items.classList.contains('collapsed')) {
                        title.classList.remove('collapsed');
                        items.classList.remove('collapsed');
                    }
                }
            }
        });
    }

    // Load page content
    async loadContent(path) {
        try {
            UIComponents.showLoading();

            // 1) Render homepage from inline content only
            if (path === '/') {
                const content = (typeof pageContent !== 'undefined' && pageContent['/']) ? pageContent['/'] : '<h1>Depth</h1>';
                const docContent = document.getElementById('doc-content');
                docContent.innerHTML = content;
                UIComponents.sanitizeHeadings(docContent);
                const tocElHome = document.getElementById('floating-toc');
                if (tocElHome) tocElHome.style.display = 'none';
                const wrapperHome = document.querySelector('.content-wrapper');
                if (wrapperHome) wrapperHome.classList.add('home-full');
                UIComponents.injectPrevNextAndRelated(path);
                UIComponents.enhanceCodeBlocks(docContent);
                UIComponents.injectPageTitleIcon(path);
                if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
                if (window.AOS) setTimeout(() => window.AOS.refreshHard && window.AOS.refreshHard(), 50);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            // 2) Try fetching the markdown file first
            const filePath = path.substring(1);
            // Prefer relative path; add version to bypass caches on GH Pages
            const version = 'v=2.3.1';
            const mdPath = `./${filePath}.md?${version}`;
            let rendered = false;
            try {
                const response = await fetch(mdPath, { cache: 'no-store' });
                if (response.ok) {
                    const markdown = await response.text();
                    const html = marked.parse(markdown);
                    const cleanHtml = DOMPurify.sanitize(html);
                    const docContent = document.getElementById('doc-content');
                    docContent.innerHTML = cleanHtml;
                    UIComponents.sanitizeHeadings(docContent);
                    UIComponents.generateTOC(docContent);
                    UIComponents.injectPrevNextAndRelated(path);
                    UIComponents.enhanceCodeBlocks(docContent);
                    UIComponents.injectPageTitleIcon(path);
                    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
                    const wrapper = document.querySelector('.content-wrapper');
                    if (wrapper) wrapper.classList.remove('home-full');
                    if (window.AOS) setTimeout(() => window.AOS.refreshHard && window.AOS.refreshHard(), 50);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    rendered = true;
                }
            } catch (_) { /* ignore and try alt fetch */ }

            // 2b) On GitHub Pages some nested routes may need an absolute path
            if (!rendered) {
                try {
                    // Build absolute URL based on current origin and repo name
                    const base = `${window.location.origin}${window.location.pathname.replace(/index\.html?$/, '')}`;
                    const absUrl = `${base}${filePath}.md?${version}`;
                    const response2 = await fetch(absUrl, { cache: 'no-store' });
                    if (response2.ok) {
                        const markdown = await response2.text();
                        const html = marked.parse(markdown);
                        const cleanHtml = DOMPurify.sanitize(html);
                        const docContent = document.getElementById('doc-content');
                        docContent.innerHTML = cleanHtml;
                        UIComponents.sanitizeHeadings(docContent);
                        UIComponents.generateTOC(docContent);
                        UIComponents.injectPrevNextAndRelated(path);
                        UIComponents.enhanceCodeBlocks(docContent);
                        UIComponents.injectPageTitleIcon(path);
                        if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
                        const wrapper = document.querySelector('.content-wrapper');
                        if (wrapper) wrapper.classList.remove('home-full');
                        if (window.AOS) setTimeout(() => window.AOS.refreshHard && window.AOS.refreshHard(), 50);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        rendered = true;
                    }
                } catch (__) { /* ignore */ }
            }

            // 2c) Fallback to raw.githubusercontent.com (CORS-enabled) if still not rendered
            if (!rendered) {
                try {
                    const host = window.location.host; // e.g., alijawdat-cyber.github.io
                    const owner = host.split('.')[0] || 'alijawdat-cyber';
                    // Derive repo name from first segment of pathname (e.g., /Depth/ → Depth)
                    const repo = (window.location.pathname.split('/').filter(Boolean)[0]) || 'Depth';
                    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${filePath}.md?${version}`;
                    const response3 = await fetch(rawUrl, { cache: 'no-store' });
                    if (response3.ok) {
                        const markdown = await response3.text();
                        const html = marked.parse(markdown);
                        const cleanHtml = DOMPurify.sanitize(html);
                        const docContent = document.getElementById('doc-content');
                        docContent.innerHTML = cleanHtml;
                        UIComponents.sanitizeHeadings(docContent);
                        UIComponents.generateTOC(docContent);
                        UIComponents.injectPrevNextAndRelated(path);
                        UIComponents.enhanceCodeBlocks(docContent);
                        UIComponents.injectPageTitleIcon(path);
                        if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
                        const wrapper = document.querySelector('.content-wrapper');
                        if (wrapper) wrapper.classList.remove('home-full');
                        if (window.AOS) setTimeout(() => window.AOS.refreshHard && window.AOS.refreshHard(), 50);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        rendered = true;
                    }
                } catch (___) { /* ignore */ }
            }

            // 3) Fallback to inline stub content (if exists)
            if (!rendered && typeof pageContent !== 'undefined' && pageContent[path]) {
                const content = pageContent[path];
                const docContent = document.getElementById('doc-content');
                docContent.innerHTML = content;
                UIComponents.sanitizeHeadings(docContent);
                UIComponents.generateTOC(docContent);
                UIComponents.injectPrevNextAndRelated(path);
                UIComponents.enhanceCodeBlocks(docContent);
                UIComponents.injectPageTitleIcon(path);
                if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
                const wrapper = document.querySelector('.content-wrapper');
                if (wrapper) wrapper.classList.remove('home-full');
                if (window.AOS) setTimeout(() => window.AOS.refreshHard && window.AOS.refreshHard(), 50);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            // 4) If nothing rendered, show error
            if (!rendered) throw new Error(`المحتوى غير متاح: ${path}`);
        } catch (error) {
            console.error('خطأ في تحميل المحتوى:', error);
            UIComponents.showError(`لم يتم العثور على الصفحة: ${path}`);
        }
    }

    // Navigate to path
    navigate(path) {
        window.location.hash = path;
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