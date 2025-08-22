// Main Application Logic
class DepthDocs {
    constructor() {
        this.currentPath = '/';
        this.sidebarOpen = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderSidebar();
        this.handleRoute();
        this.setupScrollEffects();
        this.loadTheme();
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
            if (e.key === 'Escape' && this.sidebarOpen) {
                this.closeSidebar();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.sidebarOpen) {
                this.closeSidebar();
            }
        });
    }

    // Toggle sidebar
    toggleSidebar() {
        this.sidebarOpen = !this.sidebarOpen;
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const burger = document.getElementById('burger-btn');

        if (this.sidebarOpen) {
            sidebar.classList.add('active');
            overlay.classList.add('active');
            burger.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            this.closeSidebar();
        }
    }

    // Close sidebar
    closeSidebar() {
        this.sidebarOpen = false;
        document.getElementById('sidebar').classList.remove('active');
        document.getElementById('sidebar-overlay').classList.remove('active');
        document.getElementById('burger-btn').classList.remove('active');
        document.body.style.overflow = '';
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
        
        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 768) {
            this.closeSidebar();
        }
    }

    // Update active navigation item
    updateActiveNavItem(path) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${path}`) {
                item.classList.add('active');
            }
        });
    }

    // Load page content
    async loadContent(path) {
        try {
            UIComponents.showLoading();
            
            // تحديد مسار الملف الصحيح
            if (path === '/') {
                // عرض الصفحة الرئيسية من pageContent
                const content = pageContent['/'];
                const docContent = document.getElementById('doc-content');
                docContent.innerHTML = content;
                UIComponents.generateTOC(docContent);
                return;
            }
            
            // تحديد مسار الملف
            const filePath = path.substring(1); // إزالة الـ / من البداية
            const mdPath = `${filePath}.md`;
            
            console.log('Loading file:', mdPath);
            
            // جلب المحتوى من الملف
            const response = await fetch(mdPath);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const markdown = await response.text();
            
            // تحويل Markdown إلى HTML
            const html = marked.parse(markdown);
            
            // تنظيف HTML للأمان
            const cleanHtml = DOMPurify.sanitize(html);
            
            // عرض المحتوى
            const docContent = document.getElementById('doc-content');
            docContent.innerHTML = cleanHtml;
            
            // إنشاء جدول المحتويات
            UIComponents.generateTOC(docContent);
            
            // التمرير للأعلى
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
        } catch (error) {
            console.error('خطأ في تحميل المحتوى:', error);
            UIComponents.showError(`فشل في تحميل المحتوى: ${path}`);
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
        window.app.handleRoute();
    });
} else {
    setTimeout(() => {
        if (window.app) {
            window.app.handleRoute();
        }
    }, 100);
}
