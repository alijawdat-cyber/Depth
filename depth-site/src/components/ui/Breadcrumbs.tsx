"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

// خريطة المسارات للوحة الإدارة
const getBreadcrumbsFromPath = (pathname: string): BreadcrumbItem[] => {
  const breadcrumbsMap: Record<string, BreadcrumbItem[]> = {
    '/admin': [
      { label: 'لوحة التحكم', href: '/admin', icon: Home }
    ],
    '/admin/creators': [
      { label: 'لوحة التحكم', href: '/admin', icon: Home },
      { label: 'المبدعين', href: '/admin/creators' }
    ],
    '/admin/creators/intake': [
      { label: 'لوحة التحكم', href: '/admin', icon: Home },
      { label: 'المبدعين', href: '/admin/creators' },
      { label: 'تسجيل مبدع جديد', href: '/admin/creators/intake' }
    ],
    '/admin/catalog': [
      { label: 'لوحة التحكم', href: '/admin', icon: Home },
      { label: 'الكتالوج', href: '/admin/catalog' }
    ],
    '/admin/pricing': [
      { label: 'لوحة التحكم', href: '/admin', icon: Home },
      { label: 'التسعير', href: '/admin/pricing' }
    ],
    '/admin/pricing/rate-card': [
      { label: 'لوحة التحكم', href: '/admin', icon: Home },
      { label: 'التسعير', href: '/admin/pricing' },
      { label: 'جدول الأسعار', href: '/admin/pricing/rate-card' }
    ],
    '/admin/quotes': [
      { label: 'لوحة التحكم', href: '/admin', icon: Home },
      { label: 'العروض', href: '/admin/quotes' }
    ],
    '/admin/governance': [
      { label: 'لوحة التحكم', href: '/admin', icon: Home },
      { label: 'الحوكمة', href: '/admin/governance' }
    ],
    '/admin/overrides': [
      { label: 'لوحة التحكم', href: '/admin', icon: Home },
      { label: 'التعديلات', href: '/admin/overrides' }
    ],
    '/admin/overrides/advanced': [
      { label: 'لوحة التحكم', href: '/admin', icon: Home },
      { label: 'التعديلات', href: '/admin/overrides' },
      { label: 'التعديلات المتقدمة', href: '/admin/overrides/advanced' }
    ]
  };

  // البحث عن مطابقة دقيقة أولاً
  if (breadcrumbsMap[pathname]) {
    return breadcrumbsMap[pathname];
  }

  // البحث عن مطابقة جزئية للمسارات الديناميكية
  for (const [path, breadcrumbs] of Object.entries(breadcrumbsMap)) {
    if (pathname.startsWith(path) && path !== '/admin') {
      // إضافة الصفحة الحالية إذا لم تكن موجودة
      const currentPageName = pathname.split('/').pop() || '';
      const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
      
      if (!lastBreadcrumb.href.includes(currentPageName)) {
        return [
          ...breadcrumbs,
          { label: currentPageName, href: pathname }
        ];
      }
      return breadcrumbs;
    }
  }

  // العودة إلى الافتراضي
  return [{ label: 'لوحة التحكم', href: '/admin', icon: Home }];
};

export default function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const pathname = usePathname();
  const breadcrumbs = items || getBreadcrumbsFromPath(pathname);

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className={`flex items-center space-x-1 text-sm mb-6 ${className}`} aria-label="Breadcrumb">
      <div className="flex items-center space-x-reverse space-x-1">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const Icon = crumb.icon;

          return (
            <div key={crumb.href} className="flex items-center">
              {index > 0 && (
                <ChevronLeft 
                  size={16} 
                  className="mx-2 text-[var(--muted)] transform rotate-180" 
                />
              )}
              
              <div className="flex items-center gap-1">
                {Icon && index === 0 && (
                  <Icon size={16} className="text-[var(--muted)]" />
                )}
                
                {isLast ? (
                  <span className="text-[var(--text)] font-medium">
                    {crumb.label}
                  </span>
                ) : (
                  <Link 
                    href={crumb.href}
                    className="text-[var(--muted)] hover:text-[var(--text)] transition-colors duration-200 hover:underline"
                  >
                    {crumb.label}
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

// Hook لاستخدام breadcrumbs مخصصة
export const useBreadcrumbs = () => {
  const pathname = usePathname();
  return getBreadcrumbsFromPath(pathname);
};
