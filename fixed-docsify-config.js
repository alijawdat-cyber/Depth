/**
 * Depth Documentation - FIXED Unified Configuration v2.1
 * حل مشكلة الهدر والسايدبار
 */

// ============================================
// Global Configuration - مبسط
// ============================================
window.DepthDocs = {
  version: '2.1',
  language: 'ar',
  theme: localStorage.getItem('theme') || 'light',
  
  // تهيئة الوثائق
  init: function() {
    console.log('🚀 Depth Documentation v' + this.version + ' - Fixed');
    this.setupMobileToggle();
    this.setupThemeToggle();
    this.addSidebarHeader();
    this.hideLoadingScreen();
  },
  
  // إضافة زر التبديل للموبايل
  setupMobileToggle: function() {
    if (window.innerWidth <= 768) {
      const existingToggle = document.querySelector('.mobile-sidebar-toggle');
      if (existingToggle) return;
      
      const toggle = document.createElement('button');
      toggle.className = 'mobile-sidebar-toggle';
      toggle.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
      `;
      toggle.setAttribute('aria-label', 'فتح/إغلاق القائمة');
      
      document.body.appendChild(toggle);
      
      toggle.addEventListener('click', () => {
        document.body.classList.toggle('close');
      });
    }
  },
  
  // إضافة header للسايدبار
  addSidebarHeader: function() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar || sidebar.querySelector('.sidebar-header')) return;
    
    const header = document.createElement('div');
    header.className = 'sidebar-header';
    header.innerHTML = `
      <h2 class="sidebar-title">Depth Documentation</h2>
      <div class="sidebar-version">
        <span class="version-badge">v${this.version}</span>
        <span class="version-badge">RTL</span>
      </div>
    `;
    
    sidebar.insertBefore(header, sidebar.firstChild);
  },
  
  // تبديل الثيم
  setupThemeToggle: function() {
    const toggle = document.createElement('button');
    toggle.innerHTML = '🌙';
    toggle.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 50%;
      background: var(--depth-purple-500);
      color: white;
      cursor: pointer;
      z-index: 1000;
      font-size: 18px;
      transition: all 0.3s ease;
    `;
    
    document.body.appendChild(toggle);
    
    toggle.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      toggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
    });
    
    // تطبيق الثيم المحفوظ
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.body.setAttribute('data-theme', savedTheme);
      toggle.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
    }
  },
  
  // إخفاء شاشة التحميل
  hideLoadingScreen: function() {
    setTimeout(() => {
      document.body.classList.add('ready');
    }, 500);
  }
};

// ============================================
// Docsify Plugin - مبسط ومحسن
// ============================================
window.$docsify = {
  name: 'Depth Documentation',
  repo: 'https://github.com/depth-platform/docs',
  homepage: 'main.md',
  loadSidebar: true,
  loadNavbar: false,
  subMaxLevel: 3,
  auto2top: true,
  maxLevel: 4,
  
  // Search Configuration
  search: {
    paths: 'auto',
    placeholder: 'ابحث في التوثيق...',
    noData: 'لم يتم العثور على نتائج',
    depth: 6
  },
  
  // Copy Code Configuration
  copyCode: {
    buttonText: 'نسخ',
    errorText: 'خطأ',
    successText: 'تم النسخ!'
  },
  
  // Pagination
  pagination: {
    previousText: 'السابق',
    nextText: 'التالي',
    crossChapter: true
  },
  
  // Plugin للتهيئة
  plugins: [
    function(hook, vm) {
      hook.init(() => {
        console.log('Docsify initialized');
      });
      
      hook.doneEach(() => {
        // تشغيل تهيئة Depth بعد كل صفحة
        setTimeout(() => {
          window.DepthDocs.addSidebarHeader();
          window.DepthDocs.setupMobileToggle();
        }, 100);
      });
      
      hook.ready(() => {
        // تشغيل التهيئة الكاملة عند جاهزية الصفحة
        window.DepthDocs.init();
      });
    }
  ]
};

// ============================================
// تشغيل فوري عند تحميل الصفحة
// ============================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.DepthDocs.setupThemeToggle();
  });
} else {
  window.DepthDocs.setupThemeToggle();
}
