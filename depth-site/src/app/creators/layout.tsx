"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
// Container غير مستخدم في هذا التخطيط - تم حذفه
import { Button } from '@/components/ui/Button';
import { 
  Menu,
  X,
  Home,
  User,
  Briefcase,
  DollarSign,
  FileText,
  Star,
  Settings,
  MessageSquare,
  Bell,
  LogOut,
  ChevronDown,
  Camera,
  Video,
  Palette,
  Cog,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';
import { signOut } from 'next-auth/react';

// تعريف عناصر التنقل للمبدعين
const CREATOR_NAV_ITEMS = [
  {
    href: '/creators',
    label: 'الرئيسية',
    icon: Home,
    description: 'لوحة التحكم الرئيسية'
  },
  {
    href: '/creators/projects',
    label: 'المشاريع',
    icon: Briefcase,
    description: 'المشاريع المُسندة إليك',
    children: [
      {
        href: '/creators/projects',
        label: 'جميع المشاريع',
        icon: Briefcase,
        description: 'عرض كافة المشاريع'
      },
      {
        href: '/creators/projects?status=active',
        label: 'المشاريع النشطة',
        icon: Clock,
        description: 'المشاريع قيد التنفيذ'
      },
      {
        href: '/creators/projects?status=completed',
        label: 'المشاريع المكتملة',
        icon: Target,
        description: 'المشاريع المنجزة'
      }
    ]
  },
  {
    href: '/creators/overrides',
    label: 'طلبات الأسعار',
    icon: DollarSign,
    description: 'طلبات Override للأسعار الخاصة'
  },
  {
    href: '/creators/profile',
    label: 'الملف الشخصي',
    icon: User,
    description: 'إدارة معلوماتك الشخصية',
    children: [
      {
        href: '/creators/profile',
        label: 'المعلومات الأساسية',
        icon: User,
        description: 'البيانات الشخصية'
      },
      {
        href: '/creators/onboarding',
        label: 'الملف المهني الكامل',
        icon: FileText,
        description: 'النموذج التفصيلي'
      },
      {
        href: '/creators/onboarding',
        label: 'النموذج البسيط',
        icon: Settings,
        description: 'النموذج الأساسي'
      }
    ]
  },
  {
    href: '/creators/earnings',
    label: 'الأرباح',
    icon: TrendingUp,
    description: 'تتبع أرباحك والمدفوعات'
  },
  {
    href: '/creators/reviews',
    label: 'التقييمات',
    icon: Star,
    description: 'آراء العملاء وتقييماتهم'
  },
  {
    href: '/creators/support',
    label: 'الدعم',
    icon: MessageSquare,
    description: 'تواصل مع فريق الدعم'
  }
];

interface CreatorLayoutProps {
  children: React.ReactNode;
}

export default function CreatorLayout({ children }: CreatorLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isOnboardingRoute = pathname?.startsWith('/creators/onboarding');
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [creatorData, setCreatorData] = useState<{
    fullName?: string;
    role?: string;
    status?: string;
  } | null>(null);
  const [notifications, setNotifications] = useState(0);

  // التحقق من صلاحية الوصول
  useEffect(() => {
    if (status === 'loading') return;
    
    // السماح بالوصول لصفحة الانضمام للمبدعين بدون تسجيل دخول
    if (!session) {
      if (isOnboardingRoute) {
        return;
      }
      router.push('/auth/signin?from=' + encodeURIComponent(pathname));
      return;
    }

    if (session.user.role !== 'creator') {
      router.push('/portal');
      return;
    }

    // تحميل بيانات المبدع
    loadCreatorData();
  }, [session, status, router, pathname, isOnboardingRoute]);

  const loadCreatorData = async () => {
    try {
      const response = await fetch('/api/creators/profile');
      if (response.ok) {
        const data = await response.json();
        setCreatorData(data.creator);
        // تحديث عدد الإشعارات من الاستجابة
        if (data.notificationCount !== undefined) {
          setNotifications(data.notificationCount);
        }
      }
    } catch (error) {
      console.error('Failed to load creator data:', error);
    }
  };

  // التحكم في توسيع العناصر
  const toggleExpanded = (href: string) => {
    setExpandedItems(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  // التحقق من النشاط
  const isActive = (href: string) => {
    if (href === '/creators') {
      return pathname === '/creators';
    }
    return pathname.startsWith(href);
  };

  // الحصول على أيقونة التخصص
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'photographer': return <Camera size={20} className="text-blue-600" />;
      case 'videographer': return <Video size={20} className="text-red-600" />;
      case 'designer': return <Palette size={20} className="text-purple-600" />;
      case 'producer': return <Cog size={20} className="text-green-600" />;
      default: return <Camera size={20} className="text-blue-600" />;
    }
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      photographer: 'مصور',
      videographer: 'مصور فيديو',
      designer: 'مصمم',
      producer: 'منتج'
    };
    return labels[role as keyof typeof labels] || role;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50';
      case 'under_review': return 'text-yellow-600 bg-yellow-50';
      case 'intake_submitted': return 'text-blue-600 bg-blue-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'معتمد';
      case 'under_review': return 'قيد المراجعة';
      case 'intake_submitted': return 'تم تقديم النموذج';
      case 'rejected': return 'مرفوض';
      default: return 'في الانتظار';
    }
  };

  // عرض التحميل
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-500)]" />
      </div>
    );
  }

  // في مسار الانضمام: اعرض المحتوى مباشرة بدون تخطيط المبدعين
  if (isOnboardingRoute && !session) {
    return <>{children}</>;
  }

  // التحقق من الجلسة
  if (!session || session.user.role !== 'creator') {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-[var(--card)] border-r border-[var(--border)] transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-[var(--border)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--accent-100)] rounded-lg flex items-center justify-center">
                  {creatorData?.role ? getRoleIcon(creatorData.role) : <Camera size={20} className="text-blue-600" />}
                </div>
                <div>
                  <h2 className="font-semibold text-[var(--text)] text-lg">بوابة المبدع</h2>
                  <p className="text-sm text-[var(--muted)]">
                    {creatorData?.role ? getRoleLabel(creatorData.role) : 'مبدع'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg)] transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* معلومات المبدع */}
            {creatorData && (
              <div className="bg-[var(--bg)] rounded-lg p-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-[var(--accent-500)] rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {creatorData.fullName?.charAt(0) || 'م'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--text)] text-sm truncate">
                      {creatorData.fullName || 'مبدع'}
                    </p>
                    <p className="text-xs text-[var(--muted)] truncate">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                
                {creatorData.status && (
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(creatorData.status)}`}>
                    {getStatusText(creatorData.status)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-2">
              {CREATOR_NAV_ITEMS.map((item) => (
                <div key={item.href}>
                  <div className="relative">
                    <Link
                      href={item.children ? '#' : item.href}
                      onClick={(e) => {
                        if (item.children) {
                          e.preventDefault();
                          toggleExpanded(item.href);
                        } else {
                          setSidebarOpen(false);
                        }
                      }}
                      className={`
                        w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
                        ${isActive(item.href) 
                          ? 'bg-[var(--accent-100)] text-[var(--accent-700)] shadow-sm' 
                          : 'text-[var(--muted)] hover:bg-[var(--bg)] hover:text-[var(--text)]'
                        }
                      `}
                    >
                      <item.icon size={20} />
                      <span className="flex-1">{item.label}</span>
                      {item.children && (
                        <ChevronDown 
                          size={16} 
                          className={`transform transition-transform duration-200 ${
                            expandedItems.includes(item.href) ? 'rotate-180' : ''
                          }`} 
                        />
                      )}
                    </Link>
                  </div>

                  {/* Sub-items */}
                  <AnimatePresence>
                    {item.children && expandedItems.includes(item.href) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-8 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setSidebarOpen(false)}
                              className={`
                                flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200
                                ${pathname === child.href 
                                  ? 'bg-[var(--accent-50)] text-[var(--accent-600)] font-medium' 
                                  : 'text-[var(--muted)] hover:bg-[var(--bg)] hover:text-[var(--text)]'
                                }
                              `}
                            >
                              <child.icon size={16} />
                              <span>{child.label}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[var(--border)]">
            <div className="space-y-2">
              <button
                onClick={() => router.push('/creators/notifications')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--muted)] hover:bg-[var(--bg)] hover:text-[var(--text)] transition-colors"
              >
                <div className="relative">
                  <Bell size={20} />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </div>
                <span>الإشعارات</span>
              </button>
              
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={20} />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Top bar */}
        <div className="bg-[var(--card)] border-b border-[var(--border)] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg)] transition-colors"
              >
                <Menu size={20} />
              </button>
              
              <div>
                <h1 className="text-xl font-semibold text-[var(--text)]">
                  {creatorData?.fullName ? `مرحباً، ${creatorData.fullName}` : 'بوابة المبدع'}
                </h1>
                <p className="text-sm text-[var(--muted)]">
                  إدارة مشاريعك ومتابعة أدائك
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/creators/notifications')}
                className="relative"
              >
                <Bell size={20} />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/creators/profile')}
              >
                <User size={20} />
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
