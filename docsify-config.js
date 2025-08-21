/**
 * Depth Documentation - Unified Configuration v2.0
 * ملف موحد لجميع التحسينات والوظائف
 */

// ============================================
// Global Configuration
// ============================================
window.DepthDocs = {
  version: '2.0',
  language: 'ar',
  theme: localStorage.getItem('theme') || 'light',
  sidebarState: JSON.parse(localStorage.getItem('sidebarState') || '[]'),
  recentSearches: JSON.parse(localStorage.getItem('recentSearches') || '[]'),
  scrollPositions: {},
  eventCleanupFunctions: [], // لتنظيف Event Listeners
  
  // Configuration options
  config: {
    enableKeyboardShortcuts: true,
    enableFloatingTOC: true,
    enableFeedback: true,
    enableReadingProgress: true,
    enableSmoothScroll: true,
    tocMinHeadings: 3,
    readingWordsPerMinute: 200
  }
};

// ============================================
// Icon Library - مكتبة واحدة موحدة
// ============================================
window.DepthDocs.icons = {
  home: '<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>',
  requirements: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  database: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
  api: '<svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>',
  features: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>',
  admin: '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
  integrations: '<svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  development: '<svg viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
  mobile: '<svg viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
  security: '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  operations: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 12h6m6 6l4.24 4.24"/></svg>',
  reference: '<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>',
  arrow: '<svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>',
  copy: '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>',
  check: '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
  sun: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
  moon: '<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>'
};

// ============================================
// Utility Functions
// ============================================
window.DepthDocs.utils = {
  debounce: function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  throttle: function(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  getIcon: function(name) {
    return window.DepthDocs.icons[name] || window.DepthDocs.icons.home;
  },
  
  getIconByText: function(text) {
    const t = text.toLowerCase();
    if (t.includes('الرئيسية') || t.includes('home')) return 'home';
    if (t.includes('البداية') || t.includes('المتطلبات')) return 'requirements';
    if (t.includes('قاعدة البيانات') || t.includes('database')) return 'database';
    if (t.includes('الأساسيات') || t.includes('api')) return 'api';
    if (t.includes('المميزات') || t.includes('features')) return 'features';
    if (t.includes('الإدارة') || t.includes('admin')) return 'admin';
    if (t.includes('التكاملات') || t.includes('integration')) return 'integrations';
    if (t.includes('التطوير') || t.includes('development')) return 'development';
    if (t.includes('الجوال') || t.includes('mobile')) return 'mobile';
    if (t.includes('الواجهات') || t.includes('frontend')) return 'mobile';
    if (t.includes('الأمان') || t.includes('security')) return 'security';
    if (t.includes('العمليات') || t.includes('operations')) return 'operations';
    if (t.includes('المراجع') || t.includes('reference')) return 'reference';
    return 'home';
  },
  
  calculateReadingTime: function(text) {
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / window.DepthDocs.config.readingWordsPerMinute);
    return { words, minutes };
  },
  
  copyToClipboard: function(text) {
    return navigator.clipboard.writeText(text);
  },
  
  cleanupEventListeners: function() {
    // تنظيف جميع Event Listeners المسجلة
    window.DepthDocs.eventCleanupFunctions.forEach(cleanup => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    });
    window.DepthDocs.eventCleanupFunctions = [];
  }
};

// ============================================
// UI Components
// ============================================
window.DepthDocs.ui = {
  showToast: function(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer') || this.createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },
  
  createToastContainer: function() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
  },
  
  toggleModal: function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      const isVisible = modal.style.display !== 'none';
      modal.style.display = isVisible ? 'none' : 'flex';
      document.body.style.overflow = isVisible ? '' : 'hidden';
    }
  },
  
  showLoading: function(message = 'جاري التحميل...') {
    const existing = document.getElementById('loading-screen');
    if (existing) return;
    
    const loader = document.createElement('div');
    loader.id = 'loading-screen';
    loader.className = 'loading-screen';
    loader.innerHTML = `
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <div class="loading-text">${message}</div>
      </div>
    `;
    document.body.appendChild(loader);
  },
  
  hideLoading: function() {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 300);
    }
  }
};

// ============================================
// Navigation Enhancement Functions
// ============================================
window.DepthDocs.navigation = {
  updateBreadcrumbs: function() {
    const breadcrumbsEl = document.getElementById('breadcrumbs');
    if (!breadcrumbsEl) return;
    
    const hash = window.location.hash.replace('#/', '');
    const segments = hash.split('/').filter(Boolean);
    
    let html = '<a href="#/">الرئيسية</a>';
    let currentPath = '#/';
    
    segments.forEach((segment, index) => {
      currentPath += segment + '/';
      const name = segment.replace(/-/g, ' ').replace(/_/g, ' ');
      
      if (index === segments.length - 1) {
        html += ` › <span class="current">${name}</span>`;
      } else {
        html += ` › <a href="${currentPath}">${name}</a>`;
      }
    });
    
    breadcrumbsEl.innerHTML = html;
  },
  
  setupFloatingTOC: function() {
    if (!window.DepthDocs.config.enableFloatingTOC) return;
    
    // تنظيف TOC السابق
    const existingTOC = document.getElementById('floating-toc');
    if (existingTOC) existingTOC.remove();
    
    const content = document.querySelector('.markdown-section');
    if (!content) return;
    
    const headings = content.querySelectorAll('h2, h3');
    if (headings.length < window.DepthDocs.config.tocMinHeadings) return;
    
    // إنشاء TOC جديد
    const toc = document.createElement('div');
    toc.id = 'floating-toc';
    toc.className = 'floating-toc';
    
    const tocTitle = document.createElement('div');
    tocTitle.className = 'toc-title';
    tocTitle.textContent = 'في هذه الصفحة';
    toc.appendChild(tocTitle);
    
    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';
    
    headings.forEach((heading, index) => {
      const id = heading.id || `heading-${index}`;
      heading.id = id;
      
      const li = document.createElement('li');
      li.className = heading.tagName.toLowerCase();
      
      const a = document.createElement('a');
      a.href = `#${id}`;
      a.textContent = heading.textContent.replace('#', '').trim();
      a.onclick = (e) => {
        e.preventDefault();
        heading.scrollIntoView({ 
          behavior: window.DepthDocs.config.enableSmoothScroll ? 'smooth' : 'auto',
          block: 'start' 
        });
      };
      
      li.appendChild(a);
      tocList.appendChild(li);
    });
    
    toc.appendChild(tocList);
    content.appendChild(toc);
    
    // Highlight active section with cleanup
    const updateActiveLink = window.DepthDocs.utils.throttle(() => {
      const scrollPos = window.scrollY + 100;
      
      headings.forEach((heading, index) => {
        const link = tocList.children[index]?.querySelector('a');
        if (!link) return;
        
        const isActive = heading.offsetTop <= scrollPos && 
                        (!headings[index + 1] || headings[index + 1].offsetTop > scrollPos);
        
        link.classList.toggle('active', isActive);
      });
    }, 100);
    
    const scrollHandler = () => updateActiveLink();
    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    // حفظ دالة التنظيف
    window.DepthDocs.eventCleanupFunctions.push(() => {
      window.removeEventListener('scroll', scrollHandler);
    });
    
    updateActiveLink();
  },
  
  enhanceHeadings: function() {
    const headings = document.querySelectorAll('.markdown-section h1, .markdown-section h2, .markdown-section h3, .markdown-section h4');
    
    headings.forEach(heading => {
      if (heading.querySelector('.heading-anchor')) return;
      
      const anchor = document.createElement('a');
      anchor.className = 'heading-anchor';
      anchor.href = '#' + (heading.id || '');
      anchor.innerHTML = '#';
      anchor.title = 'انقر لنسخ الرابط';
      
      anchor.onclick = async (e) => {
        e.preventDefault();
        const url = window.location.href.split('#')[0] + anchor.getAttribute('href');
        
        try {
          await window.DepthDocs.utils.copyToClipboard(url);
          window.DepthDocs.ui.showToast('تم نسخ الرابط!', 'success', 2000);
        } catch (err) {
          window.DepthDocs.ui.showToast('فشل نسخ الرابط', 'error', 2000);
        }
      };
      
      heading.appendChild(anchor);
    });
  },
  
  updateReadingProgress: function() {
    if (!window.DepthDocs.config.enableReadingProgress) return;
    
    const progressBar = document.getElementById('readingProgress');
    if (!progressBar) return;
    
    const updateProgress = window.DepthDocs.utils.throttle(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = Math.min((scrollTop / scrollHeight) * 100, 100);
      progressBar.style.width = progress + '%';
    }, 50);
    
    const scrollHandler = () => updateProgress();
    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    // حفظ دالة التنظيف
    window.DepthDocs.eventCleanupFunctions.push(() => {
      window.removeEventListener('scroll', scrollHandler);
    });
    
    updateProgress();
  }
};

// ============================================
// Sidebar Enhancement Functions
// ============================================
window.DepthDocs.sidebar = {
  enhance: function() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    
    this.addHeader(sidebar);
    this.enhanceNavItems();
    this.restoreState();
    this.setupSearch();
    this.setupRouteListener();
  },
  
  addHeader: function(sidebar) {
    if (sidebar.querySelector('.sidebar-header')) return;
    
    const header = document.createElement('div');
    header.className = 'sidebar-header';
    header.innerHTML = `
      <div class="sidebar-logo">
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="white"/>
          <circle cx="12" cy="12" r="3" fill="var(--depth-purple-500)"/>
        </svg>
      </div>
      <div class="sidebar-title">Depth Documentation</div>
      <div class="sidebar-controls">
        <div class="sidebar-version">
          <span class="version-badge">v${window.DepthDocs.version}</span>
          <span class="version-badge">RTL</span>
        </div>
        <button class="sidebar-theme-toggle" id="sidebarThemeToggle" aria-label="تبديل الوضع">
          <svg class="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
            <path d="M12 1v2m0 18v2m9-11h-2M5 12H3m16.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0l-1.414-1.414M7.05 7.05L5.636 5.636" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <svg class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" style="display: none;">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    `;
    
    sidebar.insertBefore(header, sidebar.firstChild);
    
    // إعداد أيقونة تبديل الوضع في السايدبار
    this.setupSidebarThemeToggle();
  },

  // وظيفة جديدة لإعداد أيقونة تبديل الوضع في السايدبار
  setupSidebarThemeToggle: function() {
    const btn = document.getElementById('sidebarThemeToggle');
    if (!btn) return;
    
    const clickHandler = () => {
      window.DepthDocs.features.toggleTheme();
    };
    
    btn.addEventListener('click', clickHandler);
    
    // تحديث الأيقونة حسب الوضع الحالي
    window.DepthDocs.features.updateThemeIcon(window.DepthDocs.theme, btn);
    
    // حفظ دالة التنظيف
    window.DepthDocs.eventCleanupFunctions.push(() => {
      btn.removeEventListener('click', clickHandler);
    });
  },
  
  enhanceNavItems: function() {
    const navRoot = document.querySelector('.sidebar-nav > ul');
    if (!navRoot) return;
    
    // تنظيف التحسينات السابقة
    navRoot.querySelectorAll('.nav-icon, .section-arrow, .nav-badge').forEach(el => el.remove());
    
    // معالجة كل عنصر
    navRoot.querySelectorAll(':scope > li').forEach((li, index) => {
      this.processNavItem(li, navRoot, index);
    });
    
    // فتح القسم النشط تلقائياً
    this.openActiveSection(navRoot);
  },
  
  processNavItem: function(li, navRoot, index) {
    const hasSubmenu = li.querySelector('ul');
    let link = li.querySelector(':scope > a');
    let sectionLabel = li.querySelector(':scope > .section-label');
    
    const text = (link?.textContent || sectionLabel?.textContent || '').trim();
    const iconName = window.DepthDocs.utils.getIconByText(text);
    const icon = window.DepthDocs.utils.getIcon(iconName);
    
    // إنشاء تسمية القسم إذا لزم الأمر
    if (!link && !sectionLabel && hasSubmenu) {
      sectionLabel = this.createSectionLabel(li, icon, text);
    }
    
    // إضافة أيقونة للرابط
    if (link && !link.querySelector('.nav-icon')) {
      this.addIconToLink(link, icon);
    }
    
    // إضافة سهم الطي للأقسام
    if (hasSubmenu) {
      this.addCollapseArrow(li, sectionLabel || link, navRoot);
    }
  },
  
  createSectionLabel: function(li, icon, defaultText) {
    let titleText = '';
    
    Array.from(li.childNodes).forEach(node => {
      if (node.nodeType === 3) {
        titleText += node.textContent.trim();
        node.textContent = '';
      } else if (node.nodeType === 1 && node.tagName !== 'UL' && node.tagName !== 'A') {
        titleText += (node.textContent || '').trim();
        node.remove();
      }
    });
    
    const label = document.createElement('span');
    label.className = 'section-label';
    label.innerHTML = `
      <span class="nav-icon">${icon}</span>
      <span>${titleText || defaultText || 'قسم'}</span>
    `;
    
    const submenu = li.querySelector('ul');
    li.insertBefore(label, submenu);
    
    return label;
  },
  
  addIconToLink: function(link, icon) {
    const linkText = link.textContent;
    link.innerHTML = `
      <span class="nav-icon">${icon}</span>
      <span>${linkText}</span>
    `;
  },
  
  addCollapseArrow: function(li, clickTarget, navRoot) {
    const arrow = document.createElement('span');
    arrow.className = 'section-arrow';
    arrow.innerHTML = window.DepthDocs.icons.arrow;
    
    clickTarget.appendChild(arrow);
    clickTarget.style.cursor = 'pointer';
    
    const clickHandler = (e) => {
      const isArrowClick = e.target.closest('.section-arrow');
      const isLink = clickTarget.tagName === 'A';
      
      if (!isLink || isArrowClick) {
        e.preventDefault();
        li.classList.toggle('open');
        this.saveState(navRoot);
      }
    };
    
    clickTarget.addEventListener('click', clickHandler);
    
    // حفظ دالة التنظيف
    window.DepthDocs.eventCleanupFunctions.push(() => {
      clickTarget.removeEventListener('click', clickHandler);
    });
  },
  
  openActiveSection: function(navRoot) {
    // محاولة العثور على الرابط النشط بعدة طرق
    let activeLink = navRoot.querySelector('a.active');
    
    // إذا لم يتم العثور على active link، ابحث بناءً على URL
    if (!activeLink) {
      activeLink = this.findActiveLinkByUrl(navRoot);
    }
    
    if (!activeLink) return;
    
    // إضافة active class يدوياً للتأكد
    navRoot.querySelectorAll('a.active').forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
    
    // فتح جميع الأقسام الأب
    let parent = activeLink.parentElement;
    while (parent && parent !== navRoot) {
      if (parent.tagName === 'LI') {
        parent.classList.add('open');
      }
      parent = parent.parentElement;
    }
  },

  // وظيفة جديدة للعثور على الرابط النشط بناءً على URL
  findActiveLinkByUrl: function(navRoot) {
    const currentPath = this.getCurrentPath();
    if (!currentPath) return null;
    
    // البحث عن رابط يطابق المسار الحالي تماماً
    let exactMatch = navRoot.querySelector(`a[href="${currentPath}"]`);
    if (exactMatch) return exactMatch;
    
    // البحث عن رابط يطابق المسار بدون البادئة #/
    const pathWithoutHash = currentPath.replace(/^#?\/?/, '');
    exactMatch = navRoot.querySelector(`a[href="${pathWithoutHash}"]`);
    if (exactMatch) return exactMatch;
    
    // البحث عن رابط يحتوي على جزء من المسار
    const links = Array.from(navRoot.querySelectorAll('a[href]'));
    return links.find(link => {
      const linkPath = link.getAttribute('href').replace(/^#?\/?/, '');
      return linkPath && pathWithoutHash.includes(linkPath);
    }) || null;
  },

  // وظيفة للحصول على المسار الحالي
  getCurrentPath: function() {
    const hash = window.location.hash;
    if (hash.startsWith('#/')) {
      return hash.substring(2);
    }
    return hash || window.location.pathname;
  },

  // وظيفة لتحديث active state عند تغيير الصفحة
  updateActiveState: function() {
    const navRoot = document.querySelector('.sidebar-nav > ul');
    if (!navRoot) return;
    
    this.openActiveSection(navRoot);
  },
  
  saveState: function(navRoot) {
    const openSections = Array.from(navRoot.querySelectorAll('li.open')).map(el => {
      return Array.from(navRoot.querySelectorAll('li')).indexOf(el);
    });
    
    localStorage.setItem('sidebarState', JSON.stringify(openSections));
    window.DepthDocs.sidebarState = openSections;
  },
  
  restoreState: function() {
    const navRoot = document.querySelector('.sidebar-nav > ul');
    if (!navRoot) return;
    
    const savedState = window.DepthDocs.sidebarState;
    if (!savedState || !savedState.length) return;
    
    const allItems = Array.from(navRoot.querySelectorAll('li'));
    savedState.forEach(index => {
      if (allItems[index]) {
        allItems[index].classList.add('open');
      }
    });
  },
  
  setupSearch: function() {
    const searchInput = document.querySelector('.search input');
    if (!searchInput) return;
    
    // إضافة أيقونة البحث
    const searchBox = searchInput.parentElement;
    if (!searchBox.querySelector('.search-icon')) {
      const icon = document.createElement('span');
      icon.className = 'search-icon';
      icon.innerHTML = window.DepthDocs.icons.search;
      searchBox.appendChild(icon);
    }
    
    // تتبع استعلامات البحث
    const inputHandler = window.DepthDocs.utils.debounce((e) => {
      const query = e.target.value.trim();
      if (query.length > 2) {
        this.saveSearchQuery(query);
      }
    }, 500);
    
    searchInput.addEventListener('input', inputHandler);
    
    // حفظ دالة التنظيف
    window.DepthDocs.eventCleanupFunctions.push(() => {
      searchInput.removeEventListener('input', inputHandler);
    });
  },
  
  saveSearchQuery: function(query) {
    const searches = window.DepthDocs.recentSearches;
    searches.unshift(query);
    const uniqueSearches = [...new Set(searches)].slice(0, 5);
    
    localStorage.setItem('recentSearches', JSON.stringify(uniqueSearches));
    window.DepthDocs.recentSearches = uniqueSearches;
  },

  // إعداد مراقبة تغيير الصفحات
  setupRouteListener: function() {
    // مراقبة تغيير hash
    const hashChangeHandler = () => {
      setTimeout(() => {
        this.updateActiveState();
      }, 100); // تأخير قصير للتأكد من أن docsify انتهى من التحديث
    };
    
    window.addEventListener('hashchange', hashChangeHandler);
    
    // مراقبة popstate للتنقل بالأزرار
    const popStateHandler = () => {
      setTimeout(() => {
        this.updateActiveState();
      }, 100);
    };
    
    window.addEventListener('popstate', popStateHandler);
    
    // حفظ دوال التنظيف
    window.DepthDocs.eventCleanupFunctions.push(() => {
      window.removeEventListener('hashchange', hashChangeHandler);
      window.removeEventListener('popstate', popStateHandler);
    });
    
    // تحديث فوري للحالة الحالية
    setTimeout(() => {
      this.updateActiveState();
    }, 200);
  }
};

// ============================================
// Interactive Features
// ============================================
window.DepthDocs.features = {
  setupKeyboardShortcuts: function() {
    if (!window.DepthDocs.config.enableKeyboardShortcuts) return;
    
    let lastKey = '';
    
    const keyHandler = (e) => {
      const activeElement = document.activeElement;
      const isTyping = activeElement.tagName === 'INPUT' || 
                      activeElement.tagName === 'TEXTAREA';
      
      // البحث: / أو Ctrl+K
      if (!isTyping && (e.key === '/' || (e.ctrlKey && e.key === 'k'))) {
        e.preventDefault();
        this.focusSearch();
      }
      
      // الصفحة الرئيسية: G ثم H
      if (lastKey === 'g' && e.key === 'h') {
        e.preventDefault();
        window.location.hash = '/';
      }
      
      // التنقل بالأسهم
      if (e.key === 'ArrowLeft' && !isTyping) {
        this.navigateNext();
      }
      if (e.key === 'ArrowRight' && !isTyping) {
        this.navigatePrev();
      }
      
      // تبديل الثيم: T
      if (e.key === 't' && !isTyping && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        this.toggleTheme();
      }
      
      // عرض الاختصارات: ?
      if (e.key === '?' && !isTyping) {
        e.preventDefault();
        this.toggleShortcutsModal();
      }
      
      // ESC لإغلاق النوافذ
      if (e.key === 'Escape') {
        this.closeModals();
      }
      
      lastKey = e.key.toLowerCase();
    };
    
    document.addEventListener('keydown', keyHandler);
    
    // حفظ دالة التنظيف
    window.DepthDocs.eventCleanupFunctions.push(() => {
      document.removeEventListener('keydown', keyHandler);
    });
  },
  
  focusSearch: function() {
    const searchInput = document.querySelector('.search input');
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
  },
  
  navigateNext: function() {
    const nextBtn = document.querySelector('.pagination-item-next a');
    if (nextBtn) nextBtn.click();
  },
  
  navigatePrev: function() {
    const prevBtn = document.querySelector('.pagination-item-prev a');
    if (prevBtn) prevBtn.click();
  },
  
  toggleTheme: function() {
    const currentTheme = window.DepthDocs.theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    window.DepthDocs.theme = newTheme;
    
    this.updateThemeIcon(newTheme);
    window.DepthDocs.ui.showToast(
      `تم التبديل إلى الوضع ${newTheme === 'dark' ? 'الليلي' : 'النهاري'}`,
      'success',
      2000
    );
  },
  
  updateThemeIcon: function(theme, customBtn = null) {
    // تحديث الأيقونة في الأعلى
    const btn = document.getElementById('themeToggle');
    if (btn) {
      const sunIcon = btn.querySelector('.sun-icon');
      const moonIcon = btn.querySelector('.moon-icon');
      
      if (theme === 'dark') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      }
    }
    
    // تحديث الأيقونة في السايدبار
    const sidebarBtn = customBtn || document.getElementById('sidebarThemeToggle');
    if (sidebarBtn) {
      const sunIcon = sidebarBtn.querySelector('.sun-icon');
      const moonIcon = sidebarBtn.querySelector('.moon-icon');
      
      if (sunIcon && moonIcon) {
        if (theme === 'dark') {
          sunIcon.style.display = 'none';
          moonIcon.style.display = 'block';
        } else {
          sunIcon.style.display = 'block';
          moonIcon.style.display = 'none';
        }
      }
    }
  },
  
  toggleShortcutsModal: function() {
    window.DepthDocs.ui.toggleModal('shortcutsModal');
  },
  
  closeModals: function() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.style.display = 'none';
    });
    document.body.style.overflow = '';
  },
  
  setupBackToTop: function() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    
    const scrollHandler = window.DepthDocs.utils.throttle(() => {
      const shouldShow = window.pageYOffset > 500;
      btn.classList.toggle('visible', shouldShow);
    }, 200);
    
    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    const clickHandler = () => {
      window.scrollTo({ 
        top: 0, 
        behavior: window.DepthDocs.config.enableSmoothScroll ? 'smooth' : 'auto'
      });
    };
    
    btn.addEventListener('click', clickHandler);
    
    // حفظ دوال التنظيف
    window.DepthDocs.eventCleanupFunctions.push(() => {
      window.removeEventListener('scroll', scrollHandler);
      btn.removeEventListener('click', clickHandler);
    });
  },
  
  setupMobileMenu: function() {
    const btn = document.getElementById('menuToggle');
    if (!btn) {
      // إعادة محاولة بعد قليل إذا لم يُعثر على العنصر
      setTimeout(() => this.setupMobileMenu(), 100);
      return;
    }
    
    // التأكد من أن الزر مرئي وقابل للنقر
    btn.style.pointerEvents = 'auto';
    btn.style.visibility = 'visible';
    btn.style.display = 'flex';
    
    // إزالة أي event listeners قديمة
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    
    const toggleHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Mobile menu toggled'); // للـ debugging
      
      const body = document.body;
      const sidebar = document.querySelector('.sidebar');
      
      if (body.classList.contains('sidebar-open')) {
        body.classList.remove('sidebar-open');
      } else {
        body.classList.add('sidebar-open');
      }
    };
    
    // إضافة click وtouch handlers
    newBtn.addEventListener('click', toggleHandler, { passive: false });
    newBtn.addEventListener('touchstart', toggleHandler, { passive: false });
    
    console.log('Mobile menu setup completed'); // للـ debugging
    
    // إغلاق عند النقر على رابط (موبايل)
    const linkClickHandler = (e) => {
      if (e.target.matches('.sidebar a') && window.innerWidth < 768) {
        setTimeout(() => {
          document.body.classList.remove('sidebar-open');
        }, 300);
      }
    };
    
    document.addEventListener('click', linkClickHandler);
    
    // إغلاق عند النقر خارج السايدبار
    const outsideClickHandler = (e) => {
      if (document.body.classList.contains('sidebar-open') &&
          !e.target.closest('.sidebar') &&
          !e.target.closest('#menuToggle')) {
        document.body.classList.remove('sidebar-open');
      }
    };
    
    document.addEventListener('click', outsideClickHandler);
    
    // حفظ دوال التنظيف
    window.DepthDocs.eventCleanupFunctions.push(() => {
      btn.removeEventListener('click', toggleHandler);
      document.removeEventListener('click', linkClickHandler);
      document.removeEventListener('click', outsideClickHandler);
    });
  },
  
  setupFeedbackWidget: function() {
    if (!window.DepthDocs.config.enableFeedback) return;
    
    const content = document.querySelector('.markdown-section');
    if (!content || document.getElementById('feedback-widget')) return;
    
    const widget = document.createElement('div');
    widget.id = 'feedback-widget';
    widget.className = 'feedback-widget';
    widget.innerHTML = `
      <div class="feedback-question">هل كانت هذه الصفحة مفيدة؟</div>
      <div class="feedback-buttons">
        <button class="feedback-btn positive" data-value="positive">
          👍 نعم
        </button>
        <button class="feedback-btn negative" data-value="negative">
          👎 لا
        </button>
      </div>
    `;
    
    content.appendChild(widget);
    
    // إضافة معالجات الأحداث
    widget.querySelectorAll('.feedback-btn').forEach(btn => {
      const clickHandler = () => {
        this.submitFeedback(btn.dataset.value === 'positive');
      };
      
      btn.addEventListener('click', clickHandler);
      
      // حفظ دالة التنظيف
      window.DepthDocs.eventCleanupFunctions.push(() => {
        btn.removeEventListener('click', clickHandler);
      });
    });
  },
  
  submitFeedback: function(isPositive) {
    const widget = document.getElementById('feedback-widget');
    if (!widget) return;
    
    widget.innerHTML = '<div class="feedback-thanks">شكراً لك على رأيك! 💜</div>';
    
    const feedback = {
      page: window.location.hash,
      positive: isPositive,
      timestamp: new Date().toISOString()
    };
    
    console.log('Feedback submitted:', feedback);
    
    // إرسال للتحليلات إن وجدت
    if (window.gtag) {
      window.gtag('event', 'feedback', {
        event_category: 'engagement',
        event_label: isPositive ? 'positive' : 'negative',
        value: isPositive ? 1 : 0
      });
    }
  }
};

// ============================================
// Scroll Position Management
// ============================================
window.DepthDocs.scroll = {
  savePosition: function() {
    const key = `scrollPos_${window.location.hash}`;
    const position = window.pageYOffset;
    
    sessionStorage.setItem(key, position);
    window.DepthDocs.scrollPositions[window.location.hash] = position;
  },
  
  restorePosition: function() {
    const key = `scrollPos_${window.location.hash}`;
    const position = sessionStorage.getItem(key) || 
                    window.DepthDocs.scrollPositions[window.location.hash];
    
    if (position) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(position));
      }, 100);
    }
  }
};

// ============================================
// Initialization
// ============================================
window.DepthDocs.init = {
  start: function() {
    // تعيين الثيم الأولي
    document.body.setAttribute('data-theme', window.DepthDocs.theme);
    
    // عرض شاشة التحميل
    window.DepthDocs.ui.showLoading();
    
    // إعداد معالجات الأحداث عند جاهزية DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupFeatures());
    } else {
      this.setupFeatures();
    }
    
    // إخفاء التحميل عند جاهزية Docsify
    window.addEventListener('load', () => {
      setTimeout(() => {
        window.DepthDocs.ui.hideLoading();
        this.showWelcomeMessage();
        // إعادة إعداد mobile menu بعد إخفاء loading screen
        setTimeout(() => {
          window.DepthDocs.features.setupMobileMenu();
        }, 100);
      }, 500);
    });
  },
  
  setupFeatures: function() {
    // الميزات الأساسية
    window.DepthDocs.features.setupKeyboardShortcuts();
    window.DepthDocs.features.setupBackToTop();
    window.DepthDocs.features.setupMobileMenu();
    
    // زر تبديل الثيم
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
      const clickHandler = () => {
        window.DepthDocs.features.toggleTheme();
      };
      
      themeBtn.addEventListener('click', clickHandler);
      window.DepthDocs.features.updateThemeIcon(window.DepthDocs.theme);
      
      // حفظ دالة التنظيف
      window.DepthDocs.eventCleanupFunctions.push(() => {
        themeBtn.removeEventListener('click', clickHandler);
      });
    }
    
    // زر إغلاق النافذة المنبثقة
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
      const clickHandler = () => {
        window.DepthDocs.features.closeModals();
      };
      
      modalClose.addEventListener('click', clickHandler);
      
      // حفظ دالة التنظيف
      window.DepthDocs.eventCleanupFunctions.push(() => {
        modalClose.removeEventListener('click', clickHandler);
      });
    }
    
    // حفظ موضع التمرير قبل التفريغ
    const beforeUnloadHandler = () => {
      window.DepthDocs.scroll.savePosition();
    };
    
    window.addEventListener('beforeunload', beforeUnloadHandler);
    
    // حفظ دالة التنظيف
    window.DepthDocs.eventCleanupFunctions.push(() => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    });
  },
  
  showWelcomeMessage: function() {
    if (!localStorage.getItem('welcomed')) {
      window.DepthDocs.ui.showToast(
        'مرحباً بك في توثيق Depth! استخدم / للبحث السريع',
        'info',
        5000
      );
      localStorage.setItem('welcomed', 'true');
    }
  }
};

// ============================================
// Docsify Plugin Hooks
// ============================================
window.DepthDocs.docsifyPlugin = function(hook, vm) {
  // Initialize
  hook.init(function() {
    console.log('🚀 Depth Documentation v' + window.DepthDocs.version);
  });
  
  // قبل عرض كل صفحة
  hook.beforeEach(function(content) {
    // إضافة placeholder للـ breadcrumbs
    const breadcrumbs = '<div id="breadcrumbs" class="breadcrumbs"></div>';
    
    // حساب وقت القراءة
    const { words, minutes } = window.DepthDocs.utils.calculateReadingTime(content);
    const readingMeta = `
      <div class="reading-meta">
        <span class="reading-time">⏱️ ${minutes} دقائق قراءة</span>
        <span class="word-count">📝 ${words} كلمة</span>
      </div>
    `;
    
    return breadcrumbs + readingMeta + content;
  });
  
  // بعد عرض كل صفحة
  hook.doneEach(function() {
    // تنظيف Event Listeners القديمة
    window.DepthDocs.utils.cleanupEventListeners();
    
    // تحسينات التنقل
    window.DepthDocs.navigation.updateBreadcrumbs();
    window.DepthDocs.navigation.setupFloatingTOC();
    window.DepthDocs.navigation.enhanceHeadings();
    window.DepthDocs.navigation.updateReadingProgress();
    
    // تحسينات السايدبار
    window.DepthDocs.sidebar.enhance();
    
    // تحديث إضافي للـ active state بعد قليل
    setTimeout(() => {
      window.DepthDocs.sidebar.updateActiveState();
    }, 150);
    
    // الميزات التفاعلية
    window.DepthDocs.features.setupFeedbackWidget();
    
    // استعادة موضع التمرير
    window.DepthDocs.scroll.restorePosition();
  });
  
  // عند التركيب
  hook.mounted(function() {
    // لا نحتاج لمحدد الإصدار
    console.log('✅ Documentation mounted successfully!');
  });
  
  // عند الجاهزية
  hook.ready(function() {
    console.log('✅ Documentation ready!');
  });
};

// ============================================
// Start Application
// ============================================
window.DepthDocs.init.start();

// تصدير للوصول العام
window.toggleTheme = () => window.DepthDocs.features.toggleTheme();
window.toggleShortcuts = () => window.DepthDocs.features.toggleShortcutsModal();
window.submitFeedback = (isPositive) => window.DepthDocs.features.submitFeedback(isPositive);
window.showToast = (message, type, duration) => window.DepthDocs.ui.showToast(message, type, duration);