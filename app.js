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
    }

    // Check current screen size
    checkScreenSize() {
        const width = window.innerWidth;
        this.isLargeDesktop = width >= 1400;
        this.isDesktop = width >= 1024;
        this.isTablet = width >= 768 && width < 1024;
        this.isMobile = width < 768;
        this.updateContentPadding();
    }

    // Initialize sidebar state based on screen size
    initializeSidebarState() {
        const sidebar = document.getElementById('sidebar');
        const contentWrapper = document.querySelector('.content-wrapper');
        const mainContent = document.querySelector('.main-content');
        
        // All devices: sidebar closed by default
        this.sidebarOpen = false;
        sidebar.classList.remove('active');
        // Ensure the visual state matches the breakpoint behavior
        if (this.isDesktop || this.isLargeDesktop) {
            // On desktop, hide the sidebar with a class so content doesn't get overlapped
            sidebar.classList.add('sidebar-closed');
        } else {
            sidebar.classList.remove('sidebar-closed');
        }
        if (contentWrapper) contentWrapper.classList.add('sidebar-closed');
        if (mainContent) mainContent.classList.add('sidebar-closed');
    if (mainContent) mainContent.classList.remove('pushed');
        
        this.updateBurgerButton();
    }

    // Setup all event listeners
    setupEventListeners() {
        // Burger menu
        document.getElementById('burger-btn').addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Sidebar close button
        document.getElementById('sidebar-close').addEventListener('click', () => {
            this.closeSidebar();
        });

        // Sidebar overlay
        document.getElementById('sidebar-overlay').addEventListener('click', () => {
            this.closeSidebar();
        });

        // Close sidebar when clicking or touching outside it (mobile & desktop)
        const outsideClose = (event) => {
            if (!this.sidebarOpen) return;
            const sidebar = document.getElementById('sidebar');
            const burger = document.getElementById('burger-btn');
            const isInsideSidebar = sidebar.contains(event.target);
            const isBurger = burger.contains(event.target);
            if (!isInsideSidebar && !isBurger) {
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
                
                // Re-initialize if screen category changed
                if (oldDesktop !== this.isDesktop || oldLargeDesktop !== this.isLargeDesktop) {
                    this.initializeSidebarState();
                }
            }, 250);
        });
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
    }

    // Handle routing
    handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        this.currentPath = hash;
        
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
            
            // Check if content exists in pageContent first
            if (pageContent[path]) {
                const content = pageContent[path];
                const docContent = document.getElementById('doc-content');
                docContent.innerHTML = content;
                UIComponents.generateTOC(docContent);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            
            // If not found, try to load .md file
            const filePath = path.substring(1);
            const mdPath = `./${filePath}.md`;
            
            console.log('Loading file:', mdPath);
            
            const response = await fetch(mdPath);
            
            if (!response.ok) {
                throw new Error(`الصفحة غير موجودة: ${path}`);
            }
            
            const markdown = await response.text();
            const html = marked.parse(markdown);
            const cleanHtml = DOMPurify.sanitize(html);
            
            const docContent = document.getElementById('doc-content');
            docContent.innerHTML = cleanHtml;
            
            UIComponents.generateTOC(docContent);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
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