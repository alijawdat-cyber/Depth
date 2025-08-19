"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { showSuccess, showError } from '@/lib/toast';
import Image from "next/image";
import Link from "next/link";
import { cloudflareImageUrl } from "@/lib/cloudflare-public";

const CF_HASH = process.env.NEXT_PUBLIC_CF_IMAGES_ACCOUNT_HASH || '';
const CF_PREVIEW = process.env.NEXT_PUBLIC_CF_IMAGES_VARIANT_PREVIEW || 'public';

function normalizeCfUrl(url?: string, imageId?: string) {
  if (!url && imageId && CF_HASH) return cloudflareImageUrl(imageId, 'preview');
  if (!url) return '';
  try {
    const u = new URL(url);
    if (u.hostname === 'imagedelivery.net') {
      // path: /<hash>/<id>/<variant>
      const parts = u.pathname.split('/').filter(Boolean);
      if (parts.length === 3) {
        const [hash, id] = parts;
        if (hash === CF_HASH) {
          u.pathname = `/${hash}/${id}/${CF_PREVIEW}`;
          return u.toString();
        }
      }
    }
  } catch {}
  return url;
}
import { useRouter, usePathname } from "next/navigation";
import { Calendar, FileText, CheckCircle, BarChart3, Download, Eye, Clock, DollarSign, RefreshCw, MessageCircle, Settings, User, LogOut, TrendingUp, Target, Briefcase, Copy } from "lucide-react";
import UnifiedUploader from "./files/UnifiedUploader";
import { Button } from "@/components/ui/Button";
// Types are centralized in src/types; local state not used for these now
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import PendingApprovalScreen from "./PendingApprovalScreen";
import WelcomeOnboarding from "./WelcomeOnboarding";
import InteractiveOnboarding from "@/components/ui/InteractiveOnboarding";
import { StateLoading, StateError, StateEmpty, StatCardSkeleton, FileCardSkeleton } from "@/components/ui/States";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { useProjects, useFiles, useApprovals } from "@/hooks/usePortalData";
import NotificationBell from "@/components/ui/NotificationBell";
import { BRAND } from "@/lib/constants/brand";
import { profilePathForRole } from "@/lib/roles";

type Tab = "summary" | "files" | "approvals" | "reports";

  // Using SWR hooks for data; no local interfaces needed here

export default function PortalClientReal() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [tab, setTab] = useState<Tab>("summary");
  const { projects = [], isLoading: isLoadingProjects, refresh: refreshProjects } = useProjects();
  const activeProjectId = projects?.[0]?.id;
  const { files = [], isLoading: isLoadingFiles, refresh: refreshFiles } = useFiles(activeProjectId);
  const { approvals = [], isLoading: isLoadingApprovals, refresh: refreshApprovals } = useApprovals(activeProjectId);
  const [commentById, setCommentById] = useState<Record<string, string>>({});
  const [attachUrlById, setAttachUrlById] = useState<Record<string, string>>({});
  // skeleton state not needed now; SWR provides isLoading if needed
  const [clientStatus, setClientStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const tabs = [
    { id: "summary", label: "ملخص", icon: BarChart3 },
    { id: "files", label: "الملفات", icon: FileText },
    { id: "approvals", label: "الموافقات", icon: CheckCircle },
    { id: "reports", label: "التقارير", icon: Calendar }
  ] as const;

  // Onboarding flags on first load
  useEffect(() => {
    if (status !== 'authenticated') return;
    const hasSeenOnboarding = typeof window !== 'undefined' ? localStorage.getItem(`onboarding-${session?.user?.email}`) : '1';
    if (!hasSeenOnboarding && (projects?.length || 0) > 0) {
      setTimeout(() => setShowOnboarding(true), 2000);
    }
    const welcomeDone = typeof window !== 'undefined' ? localStorage.getItem(`welcome-done-${session?.user?.email}`) : '1';
    if (welcomeDone) setShowWelcome(false);
  }, [status, session?.user?.email, projects?.length]);

  const fetchData = async () => {
    try {
      setError(null);
      const clientResponse = await fetch('/api/portal/clients');
      if (clientResponse.ok) {
        const clientData = await clientResponse.json();
        const client = clientData.client;
        setClientStatus(client?.status || 'pending');
        if (client?.status !== 'approved') return;
        await Promise.all([
          refreshProjects(),
          activeProjectId ? refreshFiles() : Promise.resolve(),
          activeProjectId ? refreshApprovals() : Promise.resolve(),
        ]);
      } else {
        setClientStatus('pending');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('فشل في تحميل البيانات. يرجى المحاولة مرة أخرى.');
    } finally {
      // noop
    }
  };

  const handleApprovalUpdate = async (approvalId: string, status?: string, feedback?: string, comment?: string, attachmentUrl?: string) => {
    try {
      const response = await fetch('/api/portal/approvals', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approvalId,
          status,
          feedback: feedback || '',
          comment: comment || '',
          attachments: (() => {
            const input = (attachmentUrl || '').trim();
            if (!input) return undefined;
            const parts = input.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
            const valid = parts.filter(p => /^https?:\/\//i.test(p));
            if (valid.length === 0) return undefined;
            return valid.map(u => ({ url: u, type: 'link' as const }));
          })(),
        }),
      });

      if (response.ok) {
        // Refresh approvals
        fetchData();
        // reset inputs for this approval
        setCommentById(prev => ({ ...prev, [approvalId]: '' }));
        setAttachUrlById(prev => ({ ...prev, [approvalId]: '' }));
        
        // إشعار نجاح بناء على الحالة
        if (status === 'approved') {
          showSuccess('تم اعتماد التسليمة بنجاح');
        } else if (status === 'rejected') {
          showSuccess('تم رفض التسليمة');
        } else if (status === 'needs_revision') {
          showSuccess('تم طلب المراجعة');
        } else {
          showSuccess('تم تحديث التسليمة بنجاح');
        }
      } else {
        setError('فشل في تحديث الموافقة');
        showError('فشل في تحديث الموافقة');
      }
    } catch (err) {
      console.error('Error updating approval:', err);
      setError('فشل في تحديث الموافقة');
      showError('فشل في تحديث الموافقة');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": 
      case "completed": 
      case "active": 
        return "text-[var(--success-fg)] bg-[var(--success-bg)]";
      case "reviewing": 
      case "pending": 
        return "text-[var(--warning-fg)] bg-[var(--warning-bg)]";
      case "rejected":
      case "high":
        return "text-[var(--danger-fg)] bg-[var(--danger-bg)]";
      case "medium":
        return "text-[var(--slate-600)] bg-[var(--bg)]";
      default: 
        return "text-[var(--slate-600)] bg-[var(--card)]";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '-';
    try { return new Date(dateString).toLocaleDateString('ar-SA'); } catch { return '-'; }
  };

  const formatBytes = (bytes?: number) => {
    if (!bytes || bytes <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0; let v = bytes;
    while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
    return `${v.toFixed(1)} ${units[i]}`;
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem(`onboarding-${session?.user?.email}`, 'completed');
    // بعد إنهاء الجولة، انقل المستخدم إلى التبويب الرئيسي "الملفات" إذا لم يكن لديه مشاريع معتمدة، وإلا اتركه بالملخص
    const hasProjects = projects && projects.length > 0;
    if (hasProjects) {
      setTab('summary');
    } else {
      setTab('files');
    }
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem(`onboarding-${session?.user?.email}`, 'skipped');
  };

  // Show loading state للمصادقة فقط؛ أثناء تحميل البيانات نعرض Skeletons داخل الصفحة
  if (status === 'loading') {
    return <StateLoading text="جاري تحميل البيانات..." className="min-h-[300px]"/>;
  }

  // Show authentication required
  if (status === 'unauthenticated') {
    return (
      <StateEmpty text="تسجيل الدخول مطلوب للوصول إلى بوابتك">
        <Button onClick={() => router.push('/auth/signin')}>تسجيل الدخول</Button>
      </StateEmpty>
    );
  }

  // Show error state
  if (error) {
    return (
      <StateError text={error}>
        <Button onClick={fetchData}>إعادة المحاولة</Button>
      </StateError>
    );
  }

  // Show pending approval screen if client is not approved (تُستخدم أيضاً كشاشة انتظار عامة)
  if (clientStatus === 'pending' || clientStatus === 'rejected') {
    return (
      <PendingApprovalScreen 
        userEmail={session?.user?.email || ''} 
        userName={session?.user?.name || ''} 
      />
    );
  }

  // Show welcome onboarding for approved clients with no projects
  if (clientStatus === 'approved' && projects.length === 0 && showWelcome) {
    return (
      <WelcomeOnboarding 
        userName={session?.user?.name || ''} 
        userEmail={session?.user?.email || ''}
        onRefresh={() => {
          // Mark welcome as completed and move user into the portal UI
          localStorage.setItem(`welcome-done-${session?.user?.email}`,'1');
          setShowWelcome(false);
          setTab('files');
          // Optionally refresh data
          fetchData();
        }}
      />
    );
  }

  // Calculate summary stats
  const activeProject = projects?.[0];
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const averageProgress = projects.length > 0 
    ? projects.reduce((sum, p) => sum + p.progress, 0) / projects.length 
    : 0;

  return (
    <ErrorBoundary>
    <div className="space-y-6">
      {/* Interactive Onboarding */}
      <InteractiveOnboarding
        isActive={showOnboarding}
        currentTab={tab}
        setTab={(t)=>setTab(t as Tab)}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
      
      {/* Enhanced Portal Header */}
      <div id="portal-header" className="bg-[var(--panel-strong)] p-6 rounded-[var(--radius-lg)] text-[var(--text)] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-20 h-20 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-4 right-4 w-16 h-16 border border-white/20 rounded-full"></div>
          <div className="absolute top-1/2 right-1/3 w-12 h-12 border border-white/20 rounded-full"></div>
        </div>
        
        <div className="relative flex items-center justify-between">
          {/* Center brand logo linking to public site */}
          <Link href="https://depth-agency.com/" prefetch={false} className="absolute left-1/2 -translate-x-1/2 inline-flex items-center opacity-90 hover:opacity-100 transition-opacity" aria-label="Depth Home">
            <Image src={BRAND.wordmark} alt="Depth" width={120} height={24} priority />
          </Link>
          <div className="flex items-center gap-4">
            <div className="bg-[var(--neutral-0)]/10 p-3 rounded-full">
              <User size={24} className="text-[var(--text)]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">
                أهلاً وسهلاً {session?.user?.name || 'بك'}! 👋
              </h2>
              <p className="text-[var(--text)]/80 flex items-center gap-2">
                <span>{session?.user?.email}</span>
                <span className="text-xs bg-[var(--neutral-0)]/20 px-2 py-1 rounded-full">عميل مفعل</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell highlight={pathname === '/portal' || pathname?.startsWith('/portal/notifications')} />
            <Button 
              variant="ghost" 
              onClick={() => router.push(profilePathForRole(((session?.user as { role?: string } | undefined)?.role)))}
              className="text-[var(--text)] hover:bg-[var(--neutral-0)]/10 border-[var(--neutral-0)]/20"
            >
              <Settings size={16} className="mr-2" />
              الحساب
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-[var(--text)] hover:bg-[var(--neutral-0)]/10 border-[var(--neutral-0)]/20"
            >
              <LogOut size={16} className="mr-2" />
              خروج
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Stats */}
      {tab === "summary" && (
        <div id="quick-stats" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {isLoadingProjects ? (
            Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <div className="bg-[var(--panel-strong)] p-6 rounded-[var(--radius-lg)] text-[var(--text)] relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute top-2 right-2 opacity-20">
                  <TrendingUp size={40} />
                </div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp size={20} />
                    <span className="text-sm font-medium text-blue-100">التقدم العام</span>
                  </div>
                  <div className="text-3xl font-bold mb-1">{Math.round(averageProgress)}%</div>
                  <div className="text-xs text-blue-100">متوسط جميع المشاريع</div>
                </div>
              </div>
              
              <div className="bg-[var(--panel-strong)] p-6 rounded-[var(--radius-lg)] text-[var(--text)] relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute top-2 right-2 opacity-20">
                  <DollarSign size={40} />
                </div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign size={20} />
                    <span className="text-sm font-medium text-green-100">إجمالي الميزانية</span>
                  </div>
                  <div className="text-3xl font-bold mb-1">{formatCurrency(totalBudget)}</div>
                  <div className="text-xs text-green-100">جميع المشاريع النشطة</div>
                </div>
              </div>
              
              <div className="bg-[var(--panel-strong)] p-6 rounded-[var(--radius-lg)] text-[var(--text)] relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute top-2 right-2 opacity-20">
                  <Briefcase size={40} />
                </div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase size={20} />
                    <span className="text-sm font-medium text-purple-100">المشاريع النشطة</span>
                  </div>
                  <div className="text-3xl font-bold mb-1">{projects.length}</div>
                  <div className="text-xs text-purple-100">{projects.filter(p => p.status === 'active').length} قيد التنفيذ</div>
                </div>
              </div>
              
              <div className="bg-[var(--panel-strong)] p-6 rounded-[var(--radius-lg)] text-[var(--text)] relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute top-2 right-2 opacity-20">
                  <Target size={40} />
                </div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <Target size={20} />
                    <span className="text-sm font-medium text-orange-100">المهام المعلقة</span>
                  </div>
                  <div className="text-3xl font-bold mb-1">{approvals.filter(a => a.status === 'pending').length}</div>
                  <div className="text-xs text-orange-100">من أصل {approvals.length} موافقة</div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Main Portal Card */}
      <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-[var(--elev)] bg-[var(--bg)]">
          <div id="portal-tabs" className="flex gap-1 p-2">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id as Tab)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-[var(--radius-sm)] text-sm font-medium transition-colors ${
                    tab === t.id 
                      ? "bg-[var(--brand-500)] text-[var(--text)]" 
                      : "text-[var(--slate-600)] hover:bg-[var(--elev)] hover:text-[var(--text)]"
                  }`}
                >
                  <Icon size={16} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Summary Tab */}
          {tab === "summary" && (
            <div className="space-y-6">
              {activeProject ? (
                <>
                  {/* Project Overview Enhanced */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold text-[var(--text)] mb-4">تفاصيل المشروع</h3>
                      <div className="bg-[var(--bg)] p-4 rounded-[var(--radius)] space-y-3">
                        <div className="flex justify-between">
                          <span className="text-[var(--slate-600)]">اسم المشروع:</span>
                          <span className="font-medium text-[var(--text)]">{activeProject.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--slate-600)]">رقم المشروع:</span>
                          <span className="font-medium text-[var(--text)]">#{activeProject.id?.slice(-8)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--slate-600)]">الحالة:</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activeProject.status)}`}>
                            {activeProject.status === 'active' ? 'نشط' : 
                             activeProject.status === 'completed' ? 'مكتمل' :
                             activeProject.status === 'pending' ? 'قيد الانتظار' : activeProject.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--slate-600)]">الميزانية الإجمالية:</span>
                          <span className="font-medium text-[var(--text)]">{formatCurrency(activeProject.budget)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--slate-600)]">المبلغ المستخدم:</span>
                          <span className="font-medium text-[var(--text)]">{formatCurrency(activeProject.budget * (activeProject.progress / 100))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--slate-600)]">تاريخ البداية:</span>
                          <span className="font-medium text-[var(--text)]">{formatDate(activeProject.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--slate-600)]">آخر تحديث:</span>
                          <span className="font-medium text-[var(--text)]">{formatDate(activeProject.updatedAt)}</span>
                        </div>
                        {activeProject.estimatedDays && (
                          <div className="flex justify-between">
                            <span className="text-[var(--slate-600)]">المدة المتوقعة:</span>
                            <span className="font-medium text-[var(--text)]">{activeProject.estimatedDays} يوم</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-[var(--text)] mb-4">معلومات إضافية</h3>
                      <div className="space-y-4">
                        {/* وصف المشروع */}
                        <div className="bg-[var(--bg)] p-4 rounded-[var(--radius)]">
                          <h4 className="font-medium text-[var(--text)] mb-2">الوصف:</h4>
                          <p className="text-[var(--slate-600)] text-sm leading-relaxed">
                        {activeProject.description || 'لا يوجد وصف متاح للمشروع'}
                      </p>
                        </div>

                        {/* إحصائيات سريعة */}
                        <div className="bg-[var(--bg)] p-4 rounded-[var(--radius)]">
                          <h4 className="font-medium text-[var(--text)] mb-3">إحصائيات سريعة:</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-[var(--slate-600)]">الملفات:</span>
                              <span className="font-medium">{files.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[var(--slate-600)]">الموافقات:</span>
                              <span className="font-medium">{approvals.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[var(--slate-600)]">المعلقة:</span>
                              <span className="font-medium text-orange-600">{approvals.filter(a => a.status === 'pending').length}</span>
                            </div>
                          </div>
                        </div>

                        {/* أعضاء الفريق */}
                        {activeProject.team && activeProject.team.length > 0 && (
                          <div className="bg-[var(--bg)] p-4 rounded-[var(--radius)]">
                            <h4 className="font-medium text-[var(--text)] mb-3">فريق العمل:</h4>
                            <div className="space-y-2">
                              {activeProject.team.map((member, index: number) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <div className="w-6 h-6 bg-[var(--accent-500)] rounded-full flex items-center justify-center text-white text-xs">
                                    {member.name?.charAt(0) || 'م'}
                                  </div>
                                  <span className="text-[var(--text)]">{member.name}</span>
                                  <span className="text-[var(--slate-500)] text-xs">({member.role})</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-[var(--text)]">تقدم المشروع</span>
                      <span className="text-sm text-[var(--slate-600)]">{activeProject.progress}%</span>
                    </div>
                    <div className="w-full bg-[var(--elev)] rounded-full h-2">
                      <div 
                        className="bg-[var(--brand-500)] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${activeProject.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 size={48} className="mx-auto mb-4 text-[var(--slate-400)]" />
                  <p className="text-[var(--slate-600)]">لا توجد مشاريع متاحة</p>
                </div>
              )}

              {/* Enhanced Quick Actions */}
              <div id="quick-actions" className="border-t border-[var(--elev)] pt-6">
                <h3 className="text-lg font-semibold text-[var(--text)] mb-4">إجراءات سريعة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <WhatsAppButton
                    messageOptions={{
                      type: 'general',
                      details: `لدي استفسار حول مشروع ${activeProject?.name || 'الحالي'}`
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white border-none flex items-center justify-center gap-2 p-4 rounded-[var(--radius-lg)] font-medium transition-all hover:scale-105"
                  >
                    <MessageCircle size={20} />
                    تواصل مع الفريق
                  </WhatsAppButton>
                  
                  <Button 
                    variant="secondary" 
                    className="flex items-center justify-center gap-2 p-4 rounded-[var(--radius-lg)] font-medium transition-all hover:scale-105 bg-blue-50 hover:bg-blue-100 text-blue-700" 
                    onClick={fetchData}
                  >
                    <RefreshCw size={20} />
                    تحديث البيانات
                  </Button>

                  {activeProject ? (
                    <Button 
                      variant="primary" 
                      className="flex items-center justify-center gap-2 p-4 rounded-[var(--radius-lg)] font-medium transition-all hover:scale-105"
                      onClick={() => { setTab('files'); setTimeout(() => document.getElementById('uploaders')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
                    >
                      رفع أول ملف
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      className="flex items-center justify-center gap-2 p-4 rounded-[var(--radius-lg)] font-medium transition-all hover:scale-105 bg-purple-50 hover:bg-purple-100 text-purple-700"
                      onClick={() => router.push(profilePathForRole(((session?.user as { role?: string } | undefined)?.role)))}
                    >
                      <Settings size={20} />
                      حدّث بيانات حسابك
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    className="flex items-center justify-center gap-2 p-4 rounded-[var(--radius-lg)] font-medium transition-all hover:scale-105 bg-yellow-50 hover:bg-yellow-100 text-yellow-700"
                    onClick={() => setShowOnboarding(true)}
                  >
                    🎯 جولة في البوابة
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Files Tab */}
          {tab === "files" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text)]">ملفات المشروع</h3>
                  <p className="text-sm text-[var(--slate-600)]">جميع الملفات والمرفقات الخاصة بمشاريعك</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="primary" onClick={fetchData} className="flex items-center gap-2">
                    <RefreshCw size={16} />
                    تحديث القائمة
                  </Button>
                </div>
              </div>

              {/* Unified Uploader */}
              <div id="uploaders" className={`${!activeProject ? 'opacity-50 pointer-events-none' : ''}`}>
                <UnifiedUploader projectId={activeProject?.id || ''} onUploaded={fetchData} />
              </div>
              {!activeProject && (
                <div className="text-xs text-amber-600">⚠️ لا يمكن الرفع دون وجود مشروع نشط. يرجى الانتظار حتى يتم إنشاء مشروع لك.</div>
              )}

              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
                {isLoadingFiles ? (
                  Array.from({ length: 4 }).map((_, i) => <FileCardSkeleton key={i} />)
                ) : files.length > 0 ? files.map((file) => (
                  <div key={file.id} className="group bg-[var(--card)] p-4 rounded-[var(--radius-lg)] border border-[var(--elev)] hover:shadow-lg transition-all duration-200 hover:border-[var(--brand-500)]/20">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-[var(--text)] truncate" title={file.name}>{file.name}</div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(file.status)}`}>
                          {file.status === 'uploaded' ? 'مرفوع' : file.status === 'processing' ? 'قيد المعالجة' : file.status}
                        </span>
                      </div>

                      {/* Preview area */}
                      {file.type === 'image' ? (
                        <div className="relative w-full h-40 rounded-md overflow-hidden border border-[var(--elev)]">
                          <Image src={normalizeCfUrl(file.url, (file as unknown as { imageId?: string }).imageId)} alt={file.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                        </div>
                      ) : file.type === 'video' ? (
                        <div className="aspect-video w-full rounded-md overflow-hidden border border-[var(--elev)]">
                          <iframe title={file.name} src={file.url} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                        </div>
                      ) : (
                        <div className="text-sm text-[var(--slate-600)]">وثيقة</div>
                      )}

                      <div className="flex items-center justify-between text-xs text-[var(--slate-600)]">
                        <div className="flex items-center gap-2">
                          <span className="bg-[var(--bg)] px-2 py-1 rounded">{file.type}</span>
                          <span>•</span>
                          <span>{formatBytes(file.size)}</span>
                          <span>•</span>
                          <span>{formatDate(file.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(file.url);
                              } catch {}
                            }}
                          >
                            <Copy size={14} className="mr-1" />نسخ
                          </Button>
                          {file.type === 'document' ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={async () => {
                                try {
                                  const getRes = await fetch(`/api/portal/files/presign?key=${encodeURIComponent(file.url)}&filename=${encodeURIComponent(file.name)}`);
                                  const getJson = await getRes.json();
                                  if (getRes.ok && getJson.url) {
                                    const a = document.createElement('a');
                                    a.href = getJson.url;
                                    a.download = file.name;
                                    a.click();
                                  }
                                } catch {}
                              }}
                            >
                              <Download size={14} className="mr-1" />تنزيل
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(file.url, '_blank')}
                            >
                              <Eye size={14} className="mr-1" />عرض
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-12 bg-[var(--bg)] rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--elev)]">
                    <FileText size={64} className="mx-auto mb-4 text-[var(--slate-400)]" />
                    <h4 className="text-lg font-semibold text-[var(--text)] mb-2">لا توجد ملفات متاحة</h4>
                    <p className="text-[var(--slate-600)] mb-4">سيتم عرض ملفات مشاريعك هنا عند توفرها</p>
                    <Button variant="secondary" onClick={fetchData}>
                      <RefreshCw size={16} className="mr-2" />
                      تحقق من التحديثات
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Approvals Tab */}
          {tab === "approvals" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[var(--text)]">الموافقات المطلوبة</h3>
              
              <div className="space-y-3">
                {isLoadingApprovals ? (
                  Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
                ) : approvals.length > 0 ? approvals.map((approval) => (
                  <div key={approval.id} className="p-4 bg-[var(--bg)] rounded-[var(--radius)] border border-[var(--elev)]">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-[var(--text)]">{approval.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(approval.priority)}`}>
                        {approval.priority === 'high' ? 'عالية' : approval.priority === 'medium' ? 'متوسطة' : approval.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-[var(--slate-600)]">
                        <Clock size={14} />
                        <span>الموعد النهائي: {formatDate(approval.deadline)}</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(approval.status)}`}>
                          {approval.status === 'pending' ? 'قيد الانتظار' : approval.status === 'reviewing' ? 'قيد المراجعة' : approval.status === 'approved' ? 'معتمد' : approval.status === 'rejected' ? 'مرفوض' : approval.status}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={async () => {
                            const feedback = window.prompt('أدخل ملاحظة المراجعة (اختياري):', '');
                            if (feedback === null) return; // cancel
                            const confirmMsg = 'تأكيد إرسال الحالة إلى "يحتاج مراجعة"؟';
                            if (!window.confirm(confirmMsg)) return;
                            await handleApprovalUpdate(approval.id, 'needs_revision', feedback || '');
                          }}
                        >
                          مراجعة
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={async () => {
                            const feedback = window.prompt('أدخل ملاحظة (اختياري):', '');
                            if (!window.confirm('تأكيد الموافقة النهائية؟')) return;
                            await handleApprovalUpdate(approval.id, 'approved', feedback || '');
                          }}
                        >
                          موافقة
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={async () => {
                            const feedback = window.prompt('سبب الرفض (اختياري):', '');
                            if (!window.confirm('هل أنت متأكد من الرفض؟')) return;
                            await handleApprovalUpdate(approval.id, 'rejected', feedback || '');
                          }}
                          className="text-red-600 hover:bg-red-50"
                        >
                          رفض
                        </Button>
                      </div>
                    </div>

                    {/* Comments composer */}
                    <div className="mt-3 grid gap-2 md:grid-cols-[1fr_auto] items-start">
                      <input
                        value={commentById[approval.id] || ''}
                        onChange={(e) => setCommentById(prev => ({ ...prev, [approval.id]: e.target.value }))}
                        placeholder="أضف تعليقًا..."
                        className="w-full px-3 py-2 rounded-md border border-[var(--elev)] bg-[var(--card)] text-[var(--text)]"
                      />
                      <Button
                        variant="secondary"
                        onClick={() => handleApprovalUpdate(approval.id, undefined, '', commentById[approval.id] || '', attachUrlById[approval.id])}
                      >
                        نشر التعليق
                      </Button>
                      <input
                        value={attachUrlById[approval.id] || ''}
                        onChange={(e) => setAttachUrlById(prev => ({ ...prev, [approval.id]: e.target.value }))}
                        placeholder="رابط مرفق (اختياري)"
                        className="md:col-span-2 w-full px-3 py-2 rounded-md border border-[var(--elev)] bg-[var(--card)] text-[var(--text)]"
                      />
                    </div>

                    {/* Comments list */}
                    {Array.isArray((approval as unknown as { comments?: Array<{ author: string; message: string; createdAt: string }> }).comments) && (approval as unknown as { comments?: Array<{ author: string; message: string; createdAt: string }> }).comments!.length > 0 && (
                      <div className="mt-3 border-t border-[var(--elev)] pt-3 space-y-2">
                        {((approval as unknown as { comments: Array<{ author: string; message: string; createdAt: string }> }).comments).map((c, idx) => (
                          <div key={idx} className="text-sm">
                            <span className="font-medium text-[var(--text)]">{c.author}</span>
                            <span className="mx-1 text-[var(--slate-500)]">•</span>
                            <span className="text-[var(--slate-600)]">{formatDate(c.createdAt)}</span>
                            <div className="text-[var(--slate-700)]">{c.message}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="text-center py-8 text-[var(--slate-600)]">
                    <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
                    <p>لا توجد موافقات معلقة حالياً</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {tab === "reports" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-[var(--text)]">التقارير والتحليلات</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="primary" 
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/portal/reports/export', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ 
                            type: 'project_summary',
                            projectId: activeProject?.id,
                            format: 'pdf'
                          })
                        });
                        
                        if (response.ok) {
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `تقرير_المشروع_${activeProject?.name || 'الحالي'}_${new Date().toISOString().split('T')[0]}.pdf`;
                          a.click();
                          window.URL.revokeObjectURL(url);
                        } else {
                          showError('فشل في تصدير التقرير. يرجى المحاولة مرة أخرى.');
                        }
                      } catch (error) {
                        console.error('Export error:', error);
                        showError('حدث خطأ أثناء تصدير التقرير.');
                      }
                    }}
                    className="flex items-center gap-2"
                    disabled={!activeProject}
                  >
                    <Download size={16} />
                    تصدير PDF
                  </Button>
                </div>
              </div>

              {/* تقارير المشروع */}
              {activeProject ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ملخص الأداء */}
                  <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)]">
                    <h4 className="text-lg font-semibold text-[var(--text)] mb-4">ملخص الأداء</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-[var(--slate-600)]">التقدم الحالي:</span>
                        <span className="font-medium text-[var(--text)]">{activeProject.progress}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--slate-600)]">الميزانية المستخدمة:</span>
                        <span className="font-medium text-[var(--text)]">{formatCurrency(activeProject.budget * (activeProject.progress / 100))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--slate-600)]">الملفات المسلمة:</span>
                        <span className="font-medium text-[var(--text)]">{files.filter(f => f.status === 'uploaded').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--slate-600)]">الموافقات المعلقة:</span>
                        <span className="font-medium text-[var(--text)]">{approvals.filter(a => a.status === 'pending').length}</span>
                      </div>
                    </div>
                  </div>

                  {/* الجدول الزمني */}
                  <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)]">
                    <h4 className="text-lg font-semibold text-[var(--text)] mb-4">الجدول الزمني</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-[var(--slate-600)]">تاريخ البداية:</span>
                        <span className="font-medium text-[var(--text)]">{formatDate(activeProject.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--slate-600)]">المدة المقدرة:</span>
                                                    <span className="font-medium text-[var(--text)]">{activeProject.estimatedDays || 'غير محدد'} يوم</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--slate-600)]">الوقت المنقضي:</span>
                        <span className="font-medium text-[var(--text)]">
                          {activeProject.createdAt ? Math.ceil((Date.now() - new Date(activeProject.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0} يوم
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--slate-600)]">الحالة:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activeProject.status)}`}>
                          {activeProject.status === 'active' ? 'نشط' : activeProject.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* احصائيات الملفات */}
                  <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)]">
                    <h4 className="text-lg font-semibold text-[var(--text)] mb-4">احصائيات الملفات</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-[var(--slate-600)]">إجمالي الملفات:</span>
                        <span className="font-medium text-[var(--text)]">{files.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--slate-600)]">الصور:</span>
                        <span className="font-medium text-[var(--text)]">{files.filter(f => f.type === 'image').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--slate-600)]">الفيديوهات:</span>
                        <span className="font-medium text-[var(--text)]">{files.filter(f => f.type === 'video').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--slate-600)]">المستندات:</span>
                        <span className="font-medium text-[var(--text)]">{files.filter(f => f.type === 'document').length}</span>
                      </div>
                    </div>
                  </div>

                  {/* حالة الموافقات */}
                  <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)]">
                    <h4 className="text-lg font-semibold text-[var(--text)] mb-4">حالة الموافقات</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-[var(--slate-600)]">إجمالي الموافقات:</span>
                        <span className="font-medium text-[var(--text)]">{approvals.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--slate-600)]">معتمدة:</span>
                        <span className="font-medium text-green-600">{approvals.filter(a => a.status === 'approved').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--slate-600)]">قيد الانتظار:</span>
                        <span className="font-medium text-yellow-600">{approvals.filter(a => a.status === 'pending').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--slate-600)]">مرفوضة:</span>
                        <span className="font-medium text-red-600">{approvals.filter(a => a.status === 'rejected').length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
              <div className="text-center py-8 text-[var(--slate-600)]">
                <BarChart3 size={48} className="mx-auto mb-4 text-[var(--slate-400)]" />
                  <p>لا توجد مشاريع لعرض التقارير</p>
                  <p className="text-sm mt-2">سيتم عرض التقارير التفصيلية هنا عند وجود مشاريع نشطة</p>
              </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
