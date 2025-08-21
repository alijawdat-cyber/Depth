/**
 * Tocbot Unified System - نظام TOC موحد للمشروع
 * يعمل مع Docsify + Next.js + أي نظام آخر
 */

// تحميل Tocbot
import tocbot from 'tocbot';

/**
 * إعدادات Tocbot الموحدة لكامل المشروع
 */
const UNIFIED_TOC_CONFIG = {
  // أين سيتم وضع TOC
  tocSelector: '.js-toc',
  
  // العناوين المستهدفة
  contentSelector: '.js-toc-content',
  headingSelector: 'h1, h2, h3, h4',
  
  // التصفية والترتيب
  orderedList: false,
  skipHeadingsFilter: function(heading, selectedHeadings) {
    // تجاهل العناوين الفارغة أو الخاصة
    return heading.textContent.trim() === '' || 
           heading.classList.contains('no-toc');
  },
  
  // إعدادات العرض
  headingLabelCallback: function(string) {
    return string
      .replace(/\s+/g, ' ')           // تنظيف المسافات
      .replace(/^#+\s*/, '')          // إزالة رموز #
      .trim();
  },
  
  // CSS Classes للتخصيص
  listClass: 'toc-list',
  listItemClass: 'toc-list-item',
  linkClass: 'toc-link',
  activeListItemClass: 'is-active-li', 
  activeLinkClass: 'is-active-link',
  
  // إعدادات التمرير
  scrollSmooth: true,
  scrollSmoothDuration: 420,
  scrollSmoothOffset: -80,
  
  // التحديث التلقائي
  hasInnerContainers: true,
  
  // إعدادات الأداء
  throttleTimeout: 50,
  includeHtml: false,
  
  // دعم العناوين الديناميكية
  headingObjectCallback: function(obj, ele) {
    return {
      ...obj,
      anchor: obj.anchor,
      classes: ele.className || '',
      level: parseInt(ele.tagName.charAt(1)),
      text: ele.textContent.trim()
    };
  }
};

/**
 * نظام TOC الموحد الذكي
 */
class UnifiedTocSystem {
  constructor(customConfig = {}) {
    this.config = { ...UNIFIED_TOC_CONFIG, ...customConfig };
    this.isInitialized = false;
    this.currentBreakpoint = null;
    this.tocContainer = null;
  }

  /**
   * تهيئة النظام حسب البيئة
   */
  init() {
    // إنشاء container إذا لم يوجد
    this.createTocContainer();
    
    // تطبيق الأنماط المتجاوبة
    this.applyResponsiveStyles();
    
    // تهيئة Tocbot
    this.initializeTocbot();
    
    // إعداد المراقبة المتجاوبة
    this.setupResponsiveHandling();
    
    this.isInitialized = true;
    console.log('✅ Unified TOC System initialized');
  }

  /**
   * إنشاء TOC container تلقائياً
   */
  createTocContainer() {
    // البحث عن container موجود
    let container = document.querySelector(this.config.tocSelector);
    
    if (!container) {
      container = document.createElement('div');
      container.className = 'js-toc unified-toc';
      
      // إضافة العنوان
      const title = document.createElement('div');
      title.className = 'toc-title';
      title.textContent = 'في هذه الصفحة';
      container.appendChild(title);
      
      // إضافة container للقائمة
      const listContainer = document.createElement('div');
      listContainer.className = 'toc-content';
      container.appendChild(listContainer);
      
      // إدراج في المكان المناسب
      this.insertTocContainer(container);
    }
    
    this.tocContainer = container;
    
    // تأكيد وجود content selector
    const content = document.querySelector(this.config.contentSelector);
    if (!content) {
      // إضافة class للمحتوى الأساسي
      const mainContent = document.querySelector('.markdown-section') || 
                         document.querySelector('main') ||
                         document.querySelector('article') ||
                         document.body;
      
      if (mainContent) {
        mainContent.classList.add('js-toc-content');
      }
    }
  }

  /**
   * إدراج TOC container في المكان المناسب حسب حجم الشاشة
   */
  insertTocContainer(container) {
    const breakpoint = this.getBreakpoint();
    
    switch(breakpoint) {
      case 'mobile':
        // إنشاء FAB button
        this.createMobileFAB(container);
        break;
        
      case 'tablet':
        // إدراج في المحتوى
        const content = document.querySelector('.markdown-section') || 
                       document.querySelector('main');
        if (content) {
          content.insertBefore(container, content.firstChild);
        }
        break;
        
      case 'desktop':
      default:
        // floating في الجانب
        document.body.appendChild(container);
        break;
    }
  }

  /**
   * إنشاء زر FAB للموبايل
   */
  createMobileFAB(tocContainer) {
    // إنشاء FAB button
    const fab = document.createElement('button');
    fab.className = 'toc-fab';
    fab.innerHTML = `
      <svg viewBox="0 0 24 24" width="24" height="24">
        <path fill="currentColor" d="M3,9H17V7H3V9M3,13H17V11H3V13M3,17H17V15H3V17Z"/>
      </svg>
    `;
    fab.setAttribute('aria-label', 'فهرس المحتويات');
    
    // إنشاء modal
    const modal = document.createElement('div');
    modal.className = 'toc-modal';
    modal.innerHTML = `
      <div class="toc-modal-backdrop"></div>
      <div class="toc-modal-content">
        <div class="toc-modal-header">
          <h3>فهرس المحتويات</h3>
          <button class="toc-modal-close">&times;</button>
        </div>
        <div class="toc-modal-body"></div>
      </div>
    `;
    
    // نقل TOC إلى modal
    modal.querySelector('.toc-modal-body').appendChild(tocContainer);
    
    // إضافة للصفحة
    document.body.appendChild(fab);
    document.body.appendChild(modal);
    
    // إعداد التفاعل
    fab.addEventListener('click', () => modal.classList.add('open'));
    modal.querySelector('.toc-modal-close').addEventListener('click', () => modal.classList.remove('open'));
    modal.querySelector('.toc-modal-backdrop').addEventListener('click', () => modal.classList.remove('open'));
    
    // إغلاق عند النقر على رابط
    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('toc-link')) {
        modal.classList.remove('open');
      }
    });
  }

  /**
   * تطبيق الأنماط المتجاوبة
   */
  applyResponsiveStyles() {
    // إنشاء stylesheet إذا لم يوجد
    let styleSheet = document.getElementById('unified-toc-styles');
    if (!styleSheet) {
      styleSheet = document.createElement('style');
      styleSheet.id = 'unified-toc-styles';
      document.head.appendChild(styleSheet);
    }
    
    styleSheet.textContent = this.getResponsiveCSS();
  }

  /**
   * تهيئة Tocbot بالإعدادات الموحدة
   */
  initializeTocbot() {
    // تنظيف أي TOC سابق
    tocbot.destroy();
    
    // التحقق من وجود محتوى
    const content = document.querySelector(this.config.contentSelector);
    const headings = content ? content.querySelectorAll(this.config.headingSelector) : [];
    
    if (headings.length < 2) {
      // إخفاء TOC إذا لم يكن هناك عناوين كافية
      if (this.tocContainer) {
        this.tocContainer.style.display = 'none';
      }
      return;
    }
    
    // إظهار TOC
    if (this.tocContainer) {
      this.tocContainer.style.display = 'block';
    }
    
    // تهيئة Tocbot
    tocbot.init(this.config);
    
    console.log(`📋 TOC generated for ${headings.length} headings`);
  }

  /**
   * إعداد المراقبة المتجاوبة
   */
  setupResponsiveHandling() {
    // مراقبة تغيير حجم الشاشة
    const resizeObserver = new ResizeObserver(() => {
      const newBreakpoint = this.getBreakpoint();
      
      if (newBreakpoint !== this.currentBreakpoint) {
        this.currentBreakpoint = newBreakpoint;
        this.handleBreakpointChange();
      }
    });
    
    resizeObserver.observe(document.body);
    
    // مراقبة تغيير المحتوى (للصفحات الديناميكية)
    const contentObserver = new MutationObserver(() => {
      // إعادة تهيئة بعد تغيير المحتوى
      setTimeout(() => this.refresh(), 100);
    });
    
    const content = document.querySelector(this.config.contentSelector);
    if (content) {
      contentObserver.observe(content, {
        childList: true,
        subtree: true
      });
    }
  }

  /**
   * تحديد نقطة الكسر الحالية
   */
  getBreakpoint() {
    const width = window.innerWidth;
    
    if (width < 768) return 'mobile';
    if (width < 1200) return 'tablet';
    return 'desktop';
  }

  /**
   * التعامل مع تغيير نقطة الكسر
   */
  handleBreakpointChange() {
    console.log(`📱 Breakpoint changed to: ${this.currentBreakpoint}`);
    
    // إعادة ترتيب TOC container
    if (this.tocContainer) {
      // حفظ المحتوى
      const tocContent = this.tocContainer.innerHTML;
      
      // إزالة من الموقع الحالي
      this.tocContainer.remove();
      
      // إنشاء جديد في الموقع المناسب
      this.createTocContainer();
      
      // استعادة المحتوى
      this.tocContainer.innerHTML = tocContent;
      
      // إعادة تهيئة Tocbot
      this.initializeTocbot();
    }
  }

  /**
   * CSS متجاوب للنظام
   */
  getResponsiveCSS() {
    return `
      /* Base TOC Styles */
      .unified-toc {
        background: var(--bg-secondary, #ffffff);
        border: 1px solid var(--border-primary, #e5e7eb);
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
      }

      .toc-title {
        padding: 1rem;
        font-weight: 600;
        font-size: 0.9rem;
        color: var(--text-primary, #1f2937);
        background: var(--bg-tertiary, #f9fafb);
        border-bottom: 1px solid var(--border-primary, #e5e7eb);
      }

      .toc-content {
        padding: 0.5rem;
        max-height: 60vh;
        overflow-y: auto;
      }

      .toc-list {
        list-style: none !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      .toc-list-item {
        margin: 0 !important;
        padding: 0 !important;
      }

      .toc-link {
        display: block !important;
        padding: 0.5rem 0.75rem !important;
        font-size: 0.875rem !important;
        color: var(--text-secondary, #6b7280) !important;
        text-decoration: none !important;
        border-radius: 6px !important;
        transition: all 0.2s ease !important;
        line-height: 1.4 !important;
      }

      .toc-link:hover {
        background: var(--bg-tertiary, #f3f4f6) !important;
        color: var(--text-primary, #1f2937) !important;
      }

      .is-active-link {
        background: var(--interactive-primary, #3b82f6) !important;
        color: white !important;
        font-weight: 600 !important;
      }

      /* Heading levels */
      .toc-list .toc-list {
        margin-right: 1rem !important;
        border-right: 2px solid var(--border-secondary, #f3f4f6);
      }

      .toc-list .toc-list .toc-link {
        font-size: 0.8125rem !important;
        color: var(--text-tertiary, #9ca3af) !important;
      }

      /* Desktop: Floating TOC */
      @media (min-width: 1200px) {
        .unified-toc {
          position: fixed;
          right: 2rem;
          top: 50%;
          transform: translateY(-50%);
          width: 280px;
          max-height: 70vh;
          z-index: 100;
          opacity: 0.95;
        }

        .unified-toc:hover {
          opacity: 1;
          transform: translateY(-50%) scale(1.02);
        }
      }

      /* Tablet: Embedded TOC */
      @media (min-width: 768px) and (max-width: 1199px) {
        .unified-toc {
          position: sticky;
          top: 2rem;
          margin-bottom: 2rem;
          width: 100%;
          max-width: 320px;
        }
      }

      /* Mobile: FAB + Modal */
      @media (max-width: 767px) {
        .unified-toc {
          display: none;
        }

        .toc-fab {
          position: fixed;
          bottom: 5rem;
          right: 1.5rem;
          width: 56px;
          height: 56px;
          background: var(--interactive-primary, #3b82f6);
          color: white;
          border: none;
          border-radius: 50%;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .toc-fab:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6);
        }

        .toc-modal {
          position: fixed;
          inset: 0;
          z-index: 2000;
          display: flex;
          align-items: flex-end;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .toc-modal.open {
          opacity: 1;
          visibility: visible;
        }

        .toc-modal-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
        }

        .toc-modal-content {
          position: relative;
          width: 100%;
          background: var(--bg-primary, #ffffff);
          border-radius: 1rem 1rem 0 0;
          max-height: 70vh;
          transform: translateY(100%);
          transition: transform 0.3s ease;
        }

        .toc-modal.open .toc-modal-content {
          transform: translateY(0);
        }

        .toc-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border-primary, #e5e7eb);
        }

        .toc-modal-header h3 {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary, #1f2937);
        }

        .toc-modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: var(--text-tertiary, #9ca3af);
          cursor: pointer;
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
        }

        .toc-modal-close:hover {
          background: var(--bg-tertiary, #f3f4f6);
          color: var(--text-primary, #1f2937);
        }

        .toc-modal-body {
          padding: 0;
          max-height: calc(70vh - 5rem);
          overflow-y: auto;
        }

        .toc-modal .unified-toc {
          display: block;
          border: none;
          border-radius: 0;
          box-shadow: none;
        }

        .toc-modal .toc-title {
          display: none;
        }
      }

      /* RTL Support */
      [dir="rtl"] .toc-list .toc-list {
        margin-right: 0 !important;
        margin-left: 1rem !important;
        border-right: none !important;
        border-left: 2px solid var(--border-secondary, #f3f4f6) !important;
      }

      [dir="rtl"] .unified-toc {
        right: auto;
        left: 2rem;
      }

      [dir="rtl"] .toc-fab {
        right: auto;
        left: 1.5rem;
      }

      /* Smooth Scrollbar */
      .toc-content::-webkit-scrollbar {
        width: 4px;
      }

      .toc-content::-webkit-scrollbar-track {
        background: transparent;
      }

      .toc-content::-webkit-scrollbar-thumb {
        background: var(--border-secondary, #d1d5db);
        border-radius: 2px;
      }

      .toc-content::-webkit-scrollbar-thumb:hover {
        background: var(--border-primary, #9ca3af);
      }
    `;
  }

  /**
   * إعادة تحديث TOC
   */
  refresh() {
    if (this.isInitialized) {
      this.initializeTocbot();
    }
  }

  /**
   * تدمير النظام
   */
  destroy() {
    tocbot.destroy();
    
    // إزالة العناصر المُنشأة
    const elements = [
      '.toc-fab',
      '.toc-modal',
      '#unified-toc-styles'
    ];
    
    elements.forEach(selector => {
      const el = document.querySelector(selector);
      if (el) el.remove();
    });
    
    this.isInitialized = false;
    console.log('🗑️ Unified TOC System destroyed');
  }
}

/**
 * إنشاء instance عام للاستخدام
 */
window.UnifiedTOC = UnifiedTocSystem;

/**
 * تصدير للاستخدام مع ES6 modules
 */
export default UnifiedTocSystem;
export { UnifiedTocSystem, UNIFIED_TOC_CONFIG };

/**
 * تهيئة تلقائية إذا كان في بيئة browser
 */
if (typeof window !== 'undefined' && document.readyState !== 'loading') {
  // تهيئة تلقائية بعد تحميل الصفحة
  setTimeout(() => {
    const autoToc = new UnifiedTocSystem();
    autoToc.init();
    
    // حفظ في window للوصول العام
    window.currentTOC = autoToc;
  }, 100);
} else if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const autoToc = new UnifiedTocSystem();
    autoToc.init();
    
    // حفظ في window للوصول العام
    window.currentTOC = autoToc;
  });
}
