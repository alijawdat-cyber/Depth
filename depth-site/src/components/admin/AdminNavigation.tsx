"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Calculator, 
  FileText, 
  Settings, 
  GitBranch,
  Users,
  DollarSign,
  Bell
} from "lucide-react";
import { clsx } from "clsx";

interface AdminNavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description?: string;
  badge?: string | number;
}

const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    href: '/admin',
    label: 'لوحة التحكم',
    icon: LayoutDashboard,
    description: 'نظرة عامة على النشاط والإحصائيات'
  },
  {
    href: '/admin/catalog',
    label: 'الكتالوج',
    icon: Users, // سنستخدم Users مؤقتاً حتى نضيف Grid3x3
    description: 'إدارة الفئات والمحاور والتصنيفات'
  },
  {
    href: '/admin/pricing',
    label: 'التسعير',
    icon: Calculator,
    description: 'إدارة الأسعار وحاسبة التكلفة'
  },
  {
    href: '/admin/quotes',
    label: 'العروض',
    icon: FileText,
    description: 'إنشاء وإدارة عروض الأسعار'
  },
  {
    href: '/admin/governance',
    label: 'الحوكمة',
    icon: GitBranch,
    description: 'إدارة الإصدارات والمراجعة'
  },
  {
    href: '/admin/overrides',
    label: 'التعديلات',
    icon: DollarSign,
    description: 'طلبات تعديل الأسعار من المبدعين'
  }
];

interface AdminNavigationProps {
  className?: string;
  compact?: boolean;
}

export default function AdminNavigation({ className, compact = false }: AdminNavigationProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname?.startsWith(href);
  };

  if (compact) {
    return (
      <nav className={clsx("flex items-center gap-1 overflow-x-auto", className)}>
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-2 px-3 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-colors whitespace-nowrap",
                active 
                  ? "bg-[var(--accent-500)] text-white" 
                  : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]"
              )}
              title={item.description}
            >
              <Icon size={16} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="bg-[var(--accent-200)] text-[var(--accent-700)] text-xs px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className={clsx("space-y-1", className)}>
      {ADMIN_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex items-center gap-3 px-4 py-3 rounded-[var(--radius)] transition-colors group",
              active 
                ? "bg-[var(--accent-500)] text-white" 
                : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]"
            )}
          >
            <Icon size={20} className={active ? "text-white" : "text-[var(--muted)] group-hover:text-[var(--text)]"} />
            <div className="flex-1">
              <div className="font-medium">{item.label}</div>
              {item.description && (
                <div className={clsx(
                  "text-xs mt-0.5",
                  active ? "text-white/80" : "text-[var(--muted)]"
                )}>
                  {item.description}
                </div>
              )}
            </div>
            {item.badge && (
              <span className={clsx(
                "text-xs px-2 py-0.5 rounded-full",
                active 
                  ? "bg-white/20 text-white" 
                  : "bg-[var(--accent-200)] text-[var(--accent-700)]"
              )}>
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
