"use client";

// توثيق: قشرة (Shell) موحّدة ومتقدمة لكل صفحات الأدمن
// الغرض: واجهة إدارية احترافية مع تنقل ذكي وتجربة مستخدم متسقة
// يحقق الانتقال من النظام القديم إلى نظام إداري موحّد ومتطور

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { 
  AlertCircle, 
  AlertTriangle,
  LayoutDashboard, 
  Calculator, 
  FileText, 
  Settings, 
  GitBranch,
  DollarSign,
  UserCheck,
  Menu,
  X,
  ChevronDown,
  Bell,
  User,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { clsx } from "clsx";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { ToastContainer, useToast } from "@/components/ui/Toast";
import { profilePathForRole } from "@/lib/roles";
import { BRAND } from "@/lib/constants/brand";

// تعريف عناصر التنقل الإداري المتقدم
interface AdminNavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description?: string;
  badge?: string | number;
  children?: AdminNavItem[];
}

const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    href: '/admin',
    label: 'لوحة التحكم',
    icon: LayoutDashboard,
    description: 'نظرة عامة على النشاط والإحصائيات'
  },
  {
    href: '/admin/projects',
    label: 'المشاريع',
    icon: FileText,
    description: 'إدارة المشاريع مع حساب التسعير وفحص Guardrails'
  },
  {
    href: '/admin/creators',
    label: 'المبدعين',
    icon: UserCheck,
    description: 'إدارة المصورين والمصممين والمنتجين'
  },
  {
    href: '/admin/catalog',
    label: 'الكتالوج',
    icon: Settings,
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
    description: 'طلبات تعديل الأسعار من المبدعين',
    children: [
      {
        href: '/admin/overrides',
        label: 'التعديلات الأساسية',
        icon: DollarSign,
        description: 'طلبات التعديل العادية'
      },
      {
        href: '/admin/overrides/advanced',
        label: 'التعديلات المتقدمة',
        icon: AlertTriangle,
        description: 'التعديلات المعقدة والاستراتيجية'
      }
    ]
  }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { toasts, removeToast } = useToast();
  
  const userRole = (session?.user && (session.user as { role?: string })?.role) || 'client';
  const isAdmin = userRole === 'admin';

  // إغلاق القوائم عند تغيير المسار
  useEffect(() => {
    setSidebarOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // دالة للتحقق من النشاط
  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname?.startsWith(href);
  };

  // حالات التحميل والتحقق
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-500)] mx-auto mb-4"></div>
          <p className="mt-2 text-[var(--muted)]">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="max-w-md mx-auto bg-[var(--card)] p-8 rounded-[var(--radius-lg)] border border-[var(--elev)] text-center shadow-lg">
          <AlertCircle size={48} className="mx-auto mb-4 text-[var(--accent-500)]" />
          <h1 className="text-xl font-bold text-[var(--text)] mb-2">يجب تسجيل الدخول</h1>
          <p className="text-[var(--muted)] mb-6">تحتاج إلى تسجيل الدخول للوصول إلى لوحة الإدارة</p>
          <Button onClick={() => router.push('/portal/auth/signin')} className="w-full">
            تسجيل الدخول
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="max-w-md mx-auto bg-[var(--card)] p-8 rounded-[var(--radius-lg)] border border-[var(--elev)] text-center shadow-lg">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
          <h1 className="text-xl font-bold text-[var(--text)] mb-2">لا تملك صلاحية الوصول</h1>
          <p className="text-[var(--muted)] mb-6">هذه الصفحة خاصة بمدراء النظام. استخدم بوابتك لمتابعة مشاريعك.</p>
          <Button onClick={() => router.push('/portal')} className="w-full">
            الانتقال إلى البوابة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* التخطيط الرئيسي: شريط علوي + شريط جانبي + محتوى */}
      <div className="flex min-h-screen">
        
        {/* الشريط الجانبي للتنقل - مخفي في الموبايل */}
        <div className={clsx(
          "fixed inset-y-0 right-0 z-50 w-72 bg-[var(--card)] border-l border-[var(--elev)] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="flex flex-col h-full">
            {/* رأس الشريط الجانبي */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--elev)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[var(--accent-500)] rounded-lg flex items-center justify-center">
                  <LayoutDashboard size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-[var(--text)]">لوحة الإدارة</h1>
                  <p className="text-xs text-[var(--muted)]">نظام إدارة المحتوى</p>
                </div>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-[var(--elev)] rounded-lg"
              >
                <X size={20} className="text-[var(--muted)]" />
              </button>
            </div>

            {/* قائمة التنقل */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {ADMIN_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const hasChildren = item.children && item.children.length > 0;
                
                return (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      className={clsx(
                        "flex items-center gap-3 px-4 py-3 rounded-[var(--radius)] transition-all duration-200 group",
                        active 
                          ? "bg-[var(--accent-500)] text-white shadow-lg" 
                          : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--elev)]"
                      )}
                    >
                      <Icon 
                        size={20} 
                        className={clsx(
                          "transition-colors",
                          active ? "text-white" : "text-[var(--muted)] group-hover:text-[var(--accent-500)]"
                        )} 
                      />
                      <div className="flex-1">
                        <div className="font-medium">{item.label}</div>
                        {item.description && (
                          <div className={clsx(
                            "text-xs mt-0.5 transition-colors",
                            active ? "text-white/80" : "text-[var(--muted)]"
                          )}>
                            {item.description}
                          </div>
                        )}
                      </div>
                      {item.badge && (
                        <span className={clsx(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          active 
                            ? "bg-white/20 text-white" 
                            : "bg-[var(--accent-100)] text-[var(--accent-700)]"
                        )}>
                          {item.badge}
                        </span>
                      )}
                      {hasChildren && (
                        <ChevronDown 
                          size={16} 
                          className={clsx(
                            "transition-transform",
                            active ? "text-white" : "text-[var(--muted)]"
                          )}
                        />
                      )}
                    </Link>
                    
                    {/* Sub-items */}
                    {hasChildren && (
                      <div className="mt-2 mr-8 space-y-1">
                        {item.children!.map((child) => {
                          const ChildIcon = child.icon;
                          const childActive = isActive(child.href);
                          
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={clsx(
                                "flex items-center gap-3 px-3 py-2 rounded-[var(--radius)] transition-all duration-200 group text-sm",
                                childActive 
                                  ? "bg-[var(--accent-100)] text-[var(--accent-700)] border-r-2 border-[var(--accent-500)]" 
                                  : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--elev)]"
                              )}
                            >
                              <ChildIcon 
                                size={16} 
                                className={clsx(
                                  "transition-colors",
                                  childActive ? "text-[var(--accent-600)]" : "text-[var(--muted)] group-hover:text-[var(--accent-500)]"
                                )} 
                              />
                              <div className="flex-1">
                                <div className="font-medium">{child.label}</div>
                                {child.description && (
                                  <div className="text-xs mt-0.5 text-[var(--muted)]">
                                    {child.description}
                                  </div>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* معلومات المستخدم */}
            <div className="p-4 border-t border-[var(--elev)]">
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-[var(--elev)] rounded-[var(--radius)] transition-colors"
                >
                  <div className="w-8 h-8 bg-[var(--accent-500)] rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <div className="flex-1 text-right">
                    <div className="text-sm font-medium text-[var(--text)]">
                      {session?.user?.name || 'المدير'}
                    </div>
                    <div className="text-xs text-[var(--muted)]">
                      {session?.user?.email}
                    </div>
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={clsx(
                      "text-[var(--muted)] transition-transform",
                      userMenuOpen && "rotate-180"
                    )} 
                  />
                </button>

                {/* قائمة المستخدم المنسدلة */}
                {userMenuOpen && (
                  <div className="absolute bottom-full right-0 left-0 mb-2 bg-[var(--card)] border border-[var(--elev)] rounded-[var(--radius)] shadow-lg py-2">
                    <button 
                      onClick={() => router.push(profilePathForRole(userRole))}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--elev)] transition-colors"
                    >
                      <User size={16} />
                      الملف الشخصي
                    </button>
                    <button 
                      onClick={() => router.push('/api/auth/signout')}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="flex-1 flex flex-col">
          {/* الشريط العلوي */}
          <header className="bg-[var(--card)] border-b border-[var(--elev)] px-6 py-4 flex-shrink-0">
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-[var(--elev)] rounded-lg"
                >
                  <Menu size={20} className="text-[var(--muted)]" />
                </button>
                
                {/* مسار التنقل (Breadcrumb) */}
                <div className="flex items-center gap-2 text-sm">
                  <Link href="/admin" className="text-[var(--muted)] hover:text-[var(--text)]">
                    الرئيسية
                  </Link>
                  {pathname !== '/admin' && (
                    <>
                      <span className="text-[var(--muted)]">/</span>
                      <span className="text-[var(--text)] font-medium">
                        {ADMIN_NAV_ITEMS.find(item => isActive(item.href))?.label || 'الصفحة'}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* شعار في الوسط يعيد للموقع العام */}
              <Link href="https://depth-agency.com/" prefetch={false} className="absolute left-1/2 -translate-x-1/2 inline-flex items-center opacity-90 hover:opacity-100 transition-opacity" aria-label="Depth Home">
                <Image src={BRAND.wordmark} alt="Depth" width={120} height={24} priority />
              </Link>

              <div className="flex items-center gap-4">
                {/* زر الإشعارات */}
                <button className="relative p-2 hover:bg-[var(--elev)] rounded-lg">
                  <Bell size={20} className="text-[var(--muted)]" />
                  <span className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>

                {/* معلومات المستخدم المبسطة */}
                <div className="hidden md:flex items-center gap-2 text-sm">
                  <span className="text-[var(--muted)]">مرحباً،</span>
                  <span className="text-[var(--text)] font-medium">
                    {session?.user?.name || 'المدير'}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* محتوى الصفحة */}
          <main className="flex-1 p-6 min-h-0">
            <div className="h-full max-w-7xl mx-auto">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </div>
          </main>
        </div>
      </div>

      {/* خلفية التعتيم للموبايل */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} position="top-right" />
    </div>
  );
}


