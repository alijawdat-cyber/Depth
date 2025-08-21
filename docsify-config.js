// docsify-config.js - Advanced Docsify Configuration

// RTL Detection and Language Switching
(function() {
  'use strict';
  
  // Language configuration
  const languages = {
    'ar': {
      name: 'العربية',
      direction: 'rtl',
      fallback: 'documentation/README.md'
    },
    'en': {
      name: 'English', 
      direction: 'ltr',
      fallback: 'documentation/README.md'
    }
  };
  
  // Get current language from localStorage or default to Arabic
  const getCurrentLanguage = () => {
    return localStorage.getItem('language') || 'ar';
  };
  
  // Set language and direction
  const setLanguage = (lang) => {
    const config = languages[lang];
    if (config) {
      document.documentElement.setAttribute('lang', lang);
      document.documentElement.setAttribute('dir', config.direction);
      localStorage.setItem('language', lang);
      
      // Update page title
      const titles = {
        'ar': 'منصة العمق - التوثيق الشامل',
        'en': 'Depth Platform - Complete Documentation'
      };
      document.title = titles[lang];
    }
  };
  
  // Initialize language on page load
  window.addEventListener('DOMContentLoaded', () => {
    setLanguage(getCurrentLanguage());
  });
  
  // Advanced search configuration
  window.searchConfig = {
    placeholder: {
      '/': '🔍 ابحث في التوثيق...',
      '/en/': '🔍 Search documentation...'
    },
    noData: {
      '/': '❌ لا توجد نتائج!',
      '/en/': '❌ No Results!'
    },
    depth: 6,
    maxAge: 86400000, // 24 hours
    namespace: 'depth-docs-v2',
    hideOtherSidebarContent: false,
    pathNamespaces: ['/ar', '/en']
  };
  
  // Advanced pagination configuration
  window.paginationConfig = {
    previousText: {
      '/': 'السابق',
      '/en/': 'Previous'
    },
    nextText: {
      '/': 'التالي', 
      '/en/': 'Next'
    },
    crossChapter: true,
    crossChapterText: true
  };
  
  // Copy code configuration
  window.copyCodeConfig = {
    buttonText: {
      '/': 'نسخ الكود',
      '/en/': 'Copy Code'
    },
    errorText: {
      '/': 'خطأ في النسخ',
      '/en/': 'Copy Error'
    },
    successText: {
      '/': '✅ تم النسخ',
      '/en/': '✅ Copied'
    }
  };
  
  // Tabs configuration
  window.tabsConfig = {
    persist: true,
    sync: true,
    theme: 'material',
    tabComments: true,
    tabHeadings: true
  };
  
  // Custom plugin for enhanced functionality
  window.enhancedPlugin = function(hook, vm) {
    // Before initialization
    hook.init(function() {
      console.log('🚀 Depth Platform Documentation Initialized');
      
      // Add loading animation
      const loading = document.getElementById('loading');
      if (loading) {
        setTimeout(() => {
          loading.style.opacity = '0';
          setTimeout(() => {
            loading.style.display = 'none';
            // Show success message
            showNotification('📚 تم تحميل التوثيق بنجاح!', 'success');
          }, 500);
        }, 1500);
      }
    });
    
    // Before each page render
    hook.beforeEach(function(content) {
      const lang = getCurrentLanguage();
      
      // Add RTL wrapper for Arabic content
      if (lang === 'ar') {
        content = `<div class="rtl-content">${content}</div>`;
      }
      
      // Add last updated info
      const lastUpdated = new Date().toLocaleDateString(
        lang === 'ar' ? 'ar-SA' : 'en-US',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }
      );
      
      const updateInfo = lang === 'ar' 
        ? `<div class="last-updated">آخر تحديث: ${lastUpdated}</div>`
        : `<div class="last-updated">Last updated: ${lastUpdated}</div>`;
      
      return content + updateInfo;
    });
    
    // After each page render
    hook.doneEach(function() {
      // Add copy buttons to code blocks
      addCopyButtons();
      
      // Add scroll progress indicator
      addScrollProgress();
      
      // Add table of contents
      addTableOfContents();
      
      // Enhance images with lightbox
      enhanceImages();
      
      // Add print styles
      addPrintButton();
      
      // Initialize tooltips
      initializeTooltips();
    });
    
    // Ready callback
    hook.ready(function() {
      console.log('✅ Documentation ready!');
      
      // Add keyboard shortcuts
      addKeyboardShortcuts();
      
      // Initialize search analytics
      initializeAnalytics();
    });
  };
  
  // Helper Functions
  
  function addCopyButtons() {
    document.querySelectorAll('pre:not(.copy-added)').forEach(function(pre) {
      const button = document.createElement('button');
      button.className = 'copy-code-button';
      button.innerHTML = '<i class="fas fa-copy"></i>';
      button.title = getCurrentLanguage() === 'ar' ? 'نسخ الكود' : 'Copy Code';
      
      button.onclick = function() {
        const code = pre.querySelector('code').textContent;
        navigator.clipboard.writeText(code).then(() => {
          button.innerHTML = '<i class="fas fa-check"></i>';
          button.style.background = 'var(--success-color)';
          
          setTimeout(() => {
            button.innerHTML = '<i class="fas fa-copy"></i>';
            button.style.background = 'var(--primary-color)';
          }, 2000);
          
          showNotification('تم نسخ الكود!', 'success');
        }).catch(() => {
          showNotification('خطأ في نسخ الكود!', 'error');
        });
      };
      
      pre.appendChild(button);
      pre.classList.add('copy-added');
    });
  }
  
  function addScrollProgress() {
    let progressBar = document.getElementById('scroll-progress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = 'scroll-progress';
      progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: var(--progress, 0%);
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
        z-index: 9999;
        transition: width 0.3s ease;
      `;
      document.body.appendChild(progressBar);
    }
    
    function updateProgress() {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      
      document.documentElement.style.setProperty('--progress', scrolled + '%');
      progressBar.style.width = scrolled + '%';
    }
    
    window.removeEventListener('scroll', updateProgress);
    window.addEventListener('scroll', updateProgress);
  }
  
  function addTableOfContents() {
    const headings = document.querySelectorAll('.markdown-section h2, .markdown-section h3');
    if (headings.length === 0) return;
    
    let tocContainer = document.getElementById('table-of-contents');
    if (tocContainer) tocContainer.remove();
    
    tocContainer = document.createElement('div');
    tocContainer.id = 'table-of-contents';
    tocContainer.className = 'table-of-contents';
    
    const lang = getCurrentLanguage();
    const tocTitle = lang === 'ar' ? '📑 جدول المحتويات' : '📑 Table of Contents';
    
    let tocHTML = `<h4>${tocTitle}</h4><ul>`;
    
    headings.forEach(function(heading, index) {
      const id = `heading-${index}`;
      heading.id = id;
      
      const level = heading.tagName === 'H2' ? 'toc-h2' : 'toc-h3';
      tocHTML += `<li class="${level}"><a href="#${id}">${heading.textContent}</a></li>`;
    });
    
    tocHTML += '</ul>';
    tocContainer.innerHTML = tocHTML;
    
    // Insert TOC after first heading
    const firstHeading = document.querySelector('.markdown-section h1, .markdown-section h2');
    if (firstHeading && firstHeading.nextElementSibling) {
      firstHeading.parentNode.insertBefore(tocContainer, firstHeading.nextElementSibling);
    }
  }
  
  function enhanceImages() {
    document.querySelectorAll('.markdown-section img').forEach(function(img) {
      if (!img.parentNode.classList.contains('image-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'image-wrapper';
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
        
        // Add zoom functionality
        img.addEventListener('click', function() {
          const overlay = document.createElement('div');
          overlay.className = 'image-overlay';
          overlay.innerHTML = `
            <div class="image-modal">
              <span class="close-modal">&times;</span>
              <img src="${img.src}" alt="${img.alt}">
            </div>
          `;
          
          document.body.appendChild(overlay);
          
          overlay.querySelector('.close-modal').onclick = () => overlay.remove();
          overlay.onclick = (e) => {
            if (e.target === overlay) overlay.remove();
          };
        });
      }
    });
  }
  
  function addPrintButton() {
    let printBtn = document.getElementById('print-button');
    if (!printBtn) {
      printBtn = document.createElement('button');
      printBtn.id = 'print-button';
      printBtn.innerHTML = '<i class="fas fa-print"></i>';
      printBtn.className = 'print-button';
      printBtn.title = getCurrentLanguage() === 'ar' ? 'طباعة الصفحة' : 'Print Page';
      printBtn.onclick = () => window.print();
      
      document.body.appendChild(printBtn);
    }
  }
  
  function initializeTooltips() {
    document.querySelectorAll('[title]').forEach(function(element) {
      element.addEventListener('mouseenter', function(e) {
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = e.target.title;
        
        document.body.appendChild(tooltip);
        
        const rect = e.target.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        
        e.target.addEventListener('mouseleave', () => tooltip.remove());
      });
    });
  }
  
  function addKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search input');
        if (searchInput) searchInput.focus();
      }
      
      // ESC to close modals
      if (e.key === 'Escape') {
        const modal = document.querySelector('.image-overlay');
        if (modal) modal.remove();
      }
      
      // Alt + T for theme toggle
      if (e.altKey && e.key === 't') {
        e.preventDefault();
        toggleTheme();
      }
      
      // Alt + L for language toggle
      if (e.altKey && e.key === 'l') {
        e.preventDefault();
        toggleLanguage();
      }
    });
  }
  
  function initializeAnalytics() {
    // Track search queries
    const searchInput = document.querySelector('.search input');
    if (searchInput) {
      searchInput.addEventListener('input', debounce(function() {
        console.log('Search query:', this.value);
        // Add your analytics tracking here
      }, 300));
    }
  }
  
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      background: var(--${type === 'success' ? 'success' : type === 'error' ? 'error' : 'info'}-color);
      box-shadow: var(--shadow-lg);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
  
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
})();
