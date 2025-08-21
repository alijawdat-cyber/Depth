'use client';

import { useEffect, useRef } from 'react';
import tocbot from 'tocbot';

/**
 * مكون TOC موحد لـ Next.js
 * يستخدم نفس نظام Tocbot المطبق في Docsify
 */
interface UnifiedTOCProps {
  content?: string;
  className?: string;
  headingSelector?: string;
  minHeadings?: number;
}

export default function UnifiedTOC({ 
  content, 
  className = '',
  headingSelector = 'h1, h2, h3, h4',
  minHeadings = 2
}: UnifiedTOCProps) {
  const tocRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // تنظيف أي TOC سابق
    if (isInitialized.current) {
      tocbot.destroy();
    }

    // التحقق من وجود محتوى وعناوين
    const contentElement = document.querySelector('.js-toc-content') || 
                          document.querySelector('article') ||
                          document.querySelector('main');
    
    if (!contentElement) {
      console.warn('UnifiedTOC: No content element found');
      return;
    }

    // إضافة class للمحتوى إذا لم يوجد
    if (!contentElement.classList.contains('js-toc-content')) {
      contentElement.classList.add('js-toc-content');
    }

    const headings = contentElement.querySelectorAll(headingSelector);
    
    if (headings.length < minHeadings) {
      // إخفاء TOC إذا لم يكن هناك عناوين كافية
      if (tocRef.current) {
        tocRef.current.style.display = 'none';
      }
      return;
    }

    // إظهار TOC
    if (tocRef.current) {
      tocRef.current.style.display = 'block';
    }

    // تهيئة Tocbot بنفس الإعدادات الموحدة
    tocbot.init({
      tocSelector: '.js-toc',
      contentSelector: '.js-toc-content',
      headingSelector,
      orderedList: false,
      
      // تنسيق النصوص
      headingLabelCallback: function(string: string) {
        return string
          .replace(/\s+/g, ' ')
          .replace(/^#+\s*/, '')
          .trim();
      },
      
      // CSS Classes
      listClass: 'toc-list',
      listItemClass: 'toc-list-item',
      linkClass: 'toc-link',
      activeListItemClass: 'is-active-li',
      activeLinkClass: 'is-active-link',
      
      // إعدادات التمرير
      scrollSmooth: true,
      scrollSmoothDuration: 420,
      scrollSmoothOffset: -80,
      
      // الأداء
      throttleTimeout: 50,
      includeHtml: false,
      hasInnerContainers: true
    });

    isInitialized.current = true;
    console.log(`✅ UnifiedTOC initialized for ${headings.length} headings`);

    // تنظيف عند الإلغاء
    return () => {
      tocbot.destroy();
      isInitialized.current = false;
    };
  }, [content, headingSelector, minHeadings]);

  // إضافة الأنماط المتجاوبة
  useEffect(() => {
    // التحقق من وجود الأنماط
    const existingStyles = document.getElementById('unified-toc-nextjs-styles');
    if (existingStyles) return;

    const styleSheet = document.createElement('style');
    styleSheet.id = 'unified-toc-nextjs-styles';
    styleSheet.textContent = `
      /* Next.js Unified TOC Styles - متطابقة مع Docsify */
      .unified-toc {
        background: var(--card, #ffffff);
        border: 1px solid var(--elev, #e5e7eb);
        border-radius: var(--radius-lg, 12px);
        overflow: hidden;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
      }

      .toc-title {
        padding: 1rem;
        font-weight: 600;
        font-size: 0.9rem;
        color: var(--text, #1f2937);
        background: var(--bg-alt, #f9fafb);
        border-bottom: 1px solid var(--elev, #e5e7eb);
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
        color: var(--muted, #6b7280) !important;
        text-decoration: none !important;
        border-radius: 6px !important;
        transition: all 0.2s ease !important;
        line-height: 1.4 !important;
      }

      .toc-link:hover {
        background: var(--bg-alt, #f3f4f6) !important;
        color: var(--text, #1f2937) !important;
      }

      .is-active-link {
        background: var(--primary, #3b82f6) !important;
        color: white !important;
        font-weight: 600 !important;
      }

      /* Nested headings */
      .toc-list .toc-list {
        margin-right: 1rem !important;
        border-right: 2px solid var(--elev, #f3f4f6);
      }

      .toc-list .toc-list .toc-link {
        font-size: 0.8125rem !important;
        color: var(--slate-500, #9ca3af) !important;
      }

      /* Responsive Behavior - متطابق مع النظام الموحد */
      @media (min-width: 1200px) {
        .unified-toc.floating {
          position: fixed;
          right: 2rem;
          top: 50%;
          transform: translateY(-50%);
          width: 280px;
          max-height: 70vh;
          z-index: 100;
          opacity: 0.95;
        }

        .unified-toc.floating:hover {
          opacity: 1;
          transform: translateY(-50%) scale(1.02);
        }
      }

      @media (min-width: 768px) and (max-width: 1199px) {
        .unified-toc {
          position: sticky;
          top: 2rem;
          margin-bottom: 2rem;
          width: 100%;
          max-width: 320px;
        }
      }

      @media (max-width: 767px) {
        .unified-toc {
          margin-bottom: 1.5rem;
          width: 100%;
        }

        .toc-content {
          max-height: 300px;
        }
      }

      /* RTL Support */
      [dir="rtl"] .toc-list .toc-list {
        margin-right: 0 !important;
        margin-left: 1rem !important;
        border-right: none !important;
        border-left: 2px solid var(--elev, #f3f4f6) !important;
      }

      [dir="rtl"] .unified-toc.floating {
        right: auto;
        left: 2rem;
      }

      /* Scrollbar */
      .toc-content::-webkit-scrollbar {
        width: 4px;
      }

      .toc-content::-webkit-scrollbar-track {
        background: transparent;
      }

      .toc-content::-webkit-scrollbar-thumb {
        background: var(--elev, #d1d5db);
        border-radius: 2px;
      }

      .toc-content::-webkit-scrollbar-thumb:hover {
        background: var(--border, #9ca3af);
      }
    `;
    
    document.head.appendChild(styleSheet);

    // تنظيف عند الإلغاء
    return () => {
      const styles = document.getElementById('unified-toc-nextjs-styles');
      if (styles) styles.remove();
    };
  }, []);

  return (
    <div 
      ref={tocRef}
      className={`unified-toc js-toc ${className}`}
    >
      <div className="toc-title">محتويات المقال</div>
      <div className="toc-content">
        {/* Tocbot will populate this */}
      </div>
    </div>
  );
}
