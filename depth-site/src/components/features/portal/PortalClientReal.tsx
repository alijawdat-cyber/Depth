"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Calendar, FileText, CheckCircle, BarChart3, Download, Eye, Clock, DollarSign, RefreshCw, MessageCircle, Settings, User, LogOut, TrendingUp, Target, Briefcase, Copy } from "lucide-react";
import ImageUploader from "./files/ImageUploader";
import VideoUploader from "./files/VideoUploader";
import DocumentUploader from "./files/DocumentUploader";
import { Button } from "@/components/ui/Button";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import NotificationBell from "@/components/ui/NotificationBell";
import PendingApprovalScreen from "./PendingApprovalScreen";
import WelcomeOnboarding from "./WelcomeOnboarding";
import InteractiveOnboarding from "@/components/ui/InteractiveOnboarding";
import { StateLoading, StateError, StateEmpty } from "@/components/ui/States";

type Tab = "summary" | "files" | "approvals" | "reports";

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  budget: number;
  spent?: number;
  createdAt: string;
  updatedAt: string;
}

interface ProjectFile {
  id: string;
  name: string;
  type: string;
  size: string;
  status: string;
  createdAt: string;
  url: string;
}

interface Approval {
  id: string;
  title: string;
  type: string;
  deadline: string;
  priority: string;
  status: string;
  description?: string;
}

export default function PortalClientReal() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("summary");
  const [projects, setProjects] = useState<Project[]>([]);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [clientStatus, setClientStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const tabs = [
    { id: "summary", label: "ملخص", icon: BarChart3 },
    { id: "files", label: "الملفات", icon: FileText },
    { id: "approvals", label: "الموافقات", icon: CheckCircle },
    { id: "reports", label: "التقارير", icon: Calendar }
  ] as const;

  // Fetch data on component mount
  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
      
      // Check if user has seen onboarding
      const hasSeenOnboarding = localStorage.getItem(`onboarding-${session?.user?.email}`);
      if (!hasSeenOnboarding && projects.length > 0) {
        setTimeout(() => setShowOnboarding(true), 2000); // Show after 2 seconds
      }
    } else if (status === 'unauthenticated') {
      // Ensure we don't keep showing the spinner when user is not signed in
      setLoading(false);
    }
  }, [status, projects.length, session?.user?.email]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // First, check client status
      const clientResponse = await fetch('/api/portal/clients');
      if (clientResponse.ok) {
        const clientData = await clientResponse.json();
        const client = clientData.client;
        setClientStatus(client?.status || 'pending');
        
        // If client is not approved, don't fetch project data
        if (client?.status !== 'approved') {
          setLoading(false);
          return;
        }
      } else {
        // Client not found, probably pending
        setClientStatus('pending');
        setLoading(false);
        return;
      }

      // Fetch projects only if client is approved
      const projectsResponse = await fetch('/api/portal/projects');
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setProjects(projectsData.projects || []);

        // If we have projects, fetch files and approvals for the first project
        if (projectsData.projects?.length > 0) {
          const firstProjectId = projectsData.projects[0].id;
          
          // Fetch files
          const filesResponse = await fetch(`/api/portal/files?projectId=${firstProjectId}`);
          if (filesResponse.ok) {
            const filesData = await filesResponse.json();
            setFiles(filesData.files || []);
          }

          // Fetch approvals
          const approvalsResponse = await fetch(`/api/portal/approvals?projectId=${firstProjectId}`);
          if (approvalsResponse.ok) {
            const approvalsData = await approvalsResponse.json();
            setApprovals(approvalsData.approvals || []);
          }
        }
        // Fetch all projects for quick reference
        const allProjectsRes = await fetch('/api/portal/projects');
        if (allProjectsRes.ok) {
          const allProjectsData = await allProjectsRes.json();
          setProjectsList(allProjectsData.projects || []);
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('فشل في تحميل البيانات. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalUpdate = async (approvalId: string, status: string, feedback?: string) => {
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
        }),
      });

      if (response.ok) {
        // Refresh approvals
        fetchData();
      } else {
        setError('فشل في تحديث الموافقة');
      }
    } catch (err) {
      console.error('Error updating approval:', err);
      setError('فشل في تحديث الموافقة');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": 
      case "completed": 
      case "active": 
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
      case "reviewing": 
      case "pending": 
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
      case "rejected":
      case "high":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
      case "medium":
        return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20";
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem(`onboarding-${session?.user?.email}`, 'completed');
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem(`onboarding-${session?.user?.email}`, 'skipped');
  };

  // Show loading state
  if (status === 'loading' || loading) {
    return <StateLoading text="جاري تحميل البيانات..." className="min-h-[300px]"/>;
  }

  // Show authentication required
  if (status === 'unauthenticated') {
    return (
      <StateEmpty text="تسجيل الدخول مطلوب للوصول إلى بوابتك">
        <Button onClick={() => router.push('/portal/auth/signin')}>تسجيل الدخول</Button>
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

  // Show pending approval screen if client is not approved
  if (clientStatus === 'pending' || clientStatus === 'rejected') {
    return (
      <PendingApprovalScreen 
        userEmail={session?.user?.email || ''} 
        userName={session?.user?.name || ''} 
      />
    );
  }

  // Show welcome onboarding for approved clients with no projects
  if (clientStatus === 'approved' && projects.length === 0) {
    return (
      <WelcomeOnboarding 
        userName={session?.user?.name || ''} 
        userEmail={session?.user?.email || ''}
        onRefresh={fetchData}
      />
    );
  }

  // Calculate summary stats
  const activeProject = projects[0];
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const averageProgress = projects.length > 0 
    ? projects.reduce((sum, p) => sum + p.progress, 0) / projects.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Interactive Onboarding */}
      <InteractiveOnboarding
        isActive={showOnboarding}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
      
      {/* Enhanced Portal Header */}
      <div id="portal-header" className="bg-gradient-to-r from-[var(--accent-500)] to-[var(--accent-600)] p-6 rounded-[var(--radius-lg)] text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-20 h-20 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-4 right-4 w-16 h-16 border border-white/20 rounded-full"></div>
          <div className="absolute top-1/2 right-1/3 w-12 h-12 border border-white/20 rounded-full"></div>
        </div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-full">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">
                أهلاً وسهلاً {session?.user?.name || 'بك'}! 👋
              </h2>
              <p className="text-white/80 flex items-center gap-2">
                <span>{session?.user?.email}</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">عميل مفعل</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div id="notification-bell" className="relative">
              <NotificationBell />
            </div>
            <Button 
              variant="ghost" 
              onClick={() => router.push('/portal/profile')}
              className="text-white hover:bg-white/10 border-white/20"
            >
              <Settings size={16} className="mr-2" />
              الحساب
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-white hover:bg-white/10 border-white/20"
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
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-[var(--radius-lg)] text-white relative overflow-hidden">
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
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-[var(--radius-lg)] text-white relative overflow-hidden">
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
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-[var(--radius-lg)] text-white relative overflow-hidden">
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
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-[var(--radius-lg)] text-white relative overflow-hidden">
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
                      ? "bg-[var(--accent-500)] text-white" 
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
                  {/* Project Overview */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--text)] mb-4">تفاصيل المشروع</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-[var(--slate-600)]">اسم المشروع:</span>
                          <span className="font-medium text-[var(--text)]">{activeProject.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--slate-600)]">الحالة:</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activeProject.status)}`}>
                            {activeProject.status === 'active' ? 'نشط' : activeProject.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--slate-600)]">الميزانية:</span>
                          <span className="font-medium text-[var(--text)]">{formatCurrency(activeProject.budget)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--slate-600)]">تاريخ البداية:</span>
                          <span className="font-medium text-[var(--text)]">{formatDate(activeProject.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-[var(--text)] mb-4">وصف المشروع</h3>
                      <p className="text-[var(--slate-600)] leading-relaxed">
                        {activeProject.description || 'لا يوجد وصف متاح للمشروع'}
                      </p>
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
                        className="bg-[var(--accent-500)] h-2 rounded-full transition-all duration-300"
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

                  <Button 
                    variant="ghost" 
                    className="flex items-center justify-center gap-2 p-4 rounded-[var(--radius-lg)] font-medium transition-all hover:scale-105 bg-purple-50 hover:bg-purple-100 text-purple-700"
                    onClick={() => router.push('/portal/profile')}
                  >
                    <Settings size={20} />
                    إعدادات الحساب
                  </Button>
                  
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

              {/* Uploaders */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <ImageUploader projectId={activeProject?.id || 'demo'} onUploaded={fetchData} />
                <VideoUploader projectId={activeProject?.id || 'demo'} onUploaded={fetchData} />
                <DocumentUploader projectId={activeProject?.id || 'demo'} onUploaded={fetchData} />
              </div>

              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
                {files.length > 0 ? files.map((file) => (
                  <div key={file.id} className="group bg-[var(--card)] p-4 rounded-[var(--radius-lg)] border border-[var(--elev)] hover:shadow-lg transition-all duration-200 hover:border-[var(--accent-500)]/20">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-[var(--text)] truncate" title={file.name}>{file.name}</div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(file.status)}`}>
                          {file.status === 'uploaded' ? 'مرفوع' : file.status === 'processing' ? 'قيد المعالجة' : file.status}
                        </span>
                      </div>

                      {/* Preview area */}
                      {file.type === 'image' ? (
                        <img src={file.url} alt={file.name} className="w-full h-40 object-cover rounded-md border border-[var(--elev)]" />
                      ) : file.type === 'video' ? (
                        <div className="aspect-video w-full rounded-md overflow-hidden border border-[var(--elev)]">
                          <iframe src={file.url} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                        </div>
                      ) : (
                        <div className="text-sm text-[var(--slate-600)]">وثيقة</div>
                      )}

                      <div className="flex items-center justify-between text-xs text-[var(--slate-600)]">
                        <div className="flex items-center gap-2">
                          <span className="bg-[var(--bg)] px-2 py-1 rounded">{file.type}</span>
                          <span>•</span>
                          <span>{file.size}</span>
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
                                  const getRes = await fetch(`/api/portal/files/presign?key=${encodeURIComponent(file.url)}`);
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
                {approvals.length > 0 ? approvals.map((approval) => (
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
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleApprovalUpdate(approval.id, 'needs_revision', 'يحتاج مراجعة')}
                        >
                          مراجعة
                        </Button>
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => handleApprovalUpdate(approval.id, 'approved', 'موافق عليه')}
                        >
                          موافقة
                        </Button>
                      </div>
                    </div>
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
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[var(--text)]">التقارير والتحليلات</h3>
              
              <div className="text-center py-8 text-[var(--slate-600)]">
                <BarChart3 size={48} className="mx-auto mb-4 text-[var(--slate-400)]" />
                <p>التقارير قيد التطوير</p>
                <p className="text-sm mt-2">سيتم إضافة التقارير والتحليلات قريباً</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
