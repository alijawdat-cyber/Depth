"use client";

// صفحة لوحة التحكم الإدارية المحدثة - متوافقة مع التخطيط الجديد
// الغرض: لوحة تحكم شاملة ومتقدمة مع إحصائيات في الوقت الفعلي وإدارة العملاء والمشاريع
// التطوير: واجهة احترافية مع بطاقات تفاعلية وجداول متقدمة

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/Button";
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { 
  CheckCircle, 
  XCircle, 
  Users, 
  Mail, 
  Phone, 
  Building, 
  RefreshCw, 
  AlertCircle,
  TrendingUp,
  DollarSign,
  FileText,
  Activity,
  Plus,
  Search,
  Filter
} from "lucide-react";
import UnifiedUploader from "@/components/features/portal/files/UnifiedUploader";
import { useSession } from "next-auth/react";
import Dropdown from "@/components/ui/Dropdown";

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// إحصائيات متقدمة للوحة التحكم
interface DashboardStats {
  clients: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    growth: number;
  };
  projects: {
    total: number;
    active: number;
    completed: number;
    growth: number;
  };
  quotes: {
    total: number;
    sent: number;
    approved: number;
    revenue: number;
  };
  revenue: {
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const createProjectRef = useRef<HTMLDivElement | null>(null);
  
  // حالات البيانات
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [inviteEmail, setInviteEmail] = useState('');
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Projects
  type ProjectRow = { id: string; title: string; clientEmail: string; status: string; createdAt?: string };
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectClientEmail, setNewProjectClientEmail] = useState('');
  const [newProjectStatus, setNewProjectStatus] = useState('active');
  const [newProjectBudget, setNewProjectBudget] = useState<number>(0);
  const [newProjectProgress, setNewProjectProgress] = useState<number>(0);
  const [newProjectDescription, setNewProjectDescription] = useState<string>('');
  const [selectedProjectIdForUpload, setSelectedProjectIdForUpload] = useState('');
  const [fileFilter, setFileFilter] = useState<'all'|'image'|'video'|'document'>('all');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const userRole = (session?.user && (session.user as { role?: string })?.role) || 'client';

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const url = `/api/portal/admin/clients?_=${Date.now()}`;
      console.log('[admin.ui] fetching clients', url);
      const response = await fetch(url, { cache: 'no-store' });
      
      if (response.ok) {
        const data = await response.json();
        console.log('[admin.ui] clients payload', { count: (data?.clients||[]).length });
        setClients(data.clients || []);
      } else {
        throw new Error('Failed to fetch clients');
      }
    } catch (err) {
      setError('فشل في تحميل بيانات العملاء');
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);





  const updateClientStatus = async (clientId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch('/api/portal/admin/clients', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId,
          status,
        }),
      });

      if (response.ok) {
        // Update local state
        setClients(clients.map(client => 
          client.id === clientId 
            ? { ...client, status }
            : client
        ));
        setFlash({ type: 'success', message: `تم ${status === 'approved' ? 'قبول' : 'رفض'} العميل بنجاح` });
      } else {
        throw new Error('Failed to update client');
      }
    } catch (err) {
      setFlash({ type: 'error', message: 'حدث خطأ في تحديث حالة العميل' });
      console.error('Update error:', err);
    }
  };

  const inviteClient = async () => {
    try {
      setFlash(null);
      const res = await fetch('/api/portal/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'invite', email: inviteEmail.trim() })
      });
      if (!res.ok) throw new Error('invite failed');
      setInviteEmail('');
      setFlash({ type: 'success', message: 'تم إرسال الدعوة بالبريد الإلكتروني' });
    } catch {
      setFlash({ type: 'error', message: 'فشل إرسال الدعوة' });
    }
  };

  const fetchProjects = useCallback(async () => {
    try {
      setProjectsLoading(true);
      setProjectsError(null);
      const res = await fetch('/api/portal/admin/projects');
      if (!res.ok) throw new Error('failed');
      type FirestoreTimestampLike = { toDate?: () => Date } | string | null | undefined;
      type ProjectsPayload = { projects?: Array<{ id: string; title: string; clientEmail: string; status: string; createdAt?: FirestoreTimestampLike }> };
      const data: ProjectsPayload = await res.json();
      const toIso = (v: FirestoreTimestampLike): string | undefined => {
        if (!v) return undefined;
        if (typeof v === 'string') return v;
        const d = typeof v.toDate === 'function' ? v.toDate() : undefined;
        return d ? d.toISOString() : undefined;
      };
      const mapped: ProjectRow[] = (data.projects || []).map((p) => ({
        id: p.id,
        title: p.title,
        clientEmail: p.clientEmail,
        status: p.status,
        createdAt: toIso(p.createdAt),
      }));
      setProjects(mapped);
    } catch {
      setProjectsError('فشل في تحميل المشاريع');
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  const createProject = async () => {
    try {
      setFlash(null);
      const res = await fetch('/api/portal/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newProjectTitle.trim(),
          clientEmail: newProjectClientEmail.trim(),
          status: newProjectStatus,
          budget: Number.isFinite(newProjectBudget) ? newProjectBudget : 0,
          progress: Math.min(100, Math.max(0, newProjectProgress)),
          description: newProjectDescription.trim(),
        })
      });
      if (!res.ok) throw new Error('failed');
      setNewProjectTitle('');
      setNewProjectClientEmail('');
      setNewProjectStatus('active');
      setNewProjectBudget(0);
      setNewProjectProgress(0);
      setNewProjectDescription('');
      await fetchProjects();
      setFlash({ type: 'success', message: 'تم إنشاء المشروع' });
    } catch {
      setFlash({ type: 'error', message: 'فشل إنشاء المشروع' });
    }
  };



  // تحميل الإحصائيات المتقدمة
  const fetchDashboardStats = useCallback(async () => {
    try {
      // محاكاة بيانات الإحصائيات - يمكن استبدالها بـ API حقيقي
      const mockStats: DashboardStats = {
        clients: {
          total: clients.length,
          pending: clients.filter(c => c.status === 'pending').length,
          approved: clients.filter(c => c.status === 'approved').length,
          rejected: clients.filter(c => c.status === 'rejected').length,
          growth: 12.5
        },
        projects: {
          total: projects.length,
          active: projects.filter(p => p.status === 'active').length,
          completed: projects.filter(p => p.status === 'completed').length,
          growth: 8.3
        },
        quotes: {
          total: 45,
          sent: 28,
          approved: 17,
          revenue: 125000
        },
        revenue: {
          thisMonth: 85000,
          lastMonth: 72000,
          growth: 18.1
        }
      };
      
      setStats(mockStats);
    } catch (err) {
      console.error('خطأ في تحميل الإحصائيات:', err);
    }
  }, [clients, projects]);

  // Trigger initial fetch when user becomes authenticated admin
  useEffect(() => {
    if (session) {
      fetchClients();
      fetchProjects();
    }
  }, [session, fetchClients, fetchProjects]);

  // تحميل الإحصائيات عند تحديث البيانات
  useEffect(() => {
    if (clients.length > 0 || projects.length > 0) {
      fetchDashboardStats();
    }
  }, [clients, projects, fetchDashboardStats]);

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs />
      
      {/* رأس لوحة التحكم المحدث */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)] mb-2">لوحة التحكم الرئيسية</h1>
          <p className="text-[var(--muted)]">نظرة شاملة على الأعمال والإحصائيات</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            onClick={() => {
              fetchClients();
              fetchProjects();
              fetchDashboardStats();
            }}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            تحديث البيانات
          </Button>
          <Button onClick={() => setInviteEmail('')}>
            <Plus size={16} />
            دعوة عميل جديد
          </Button>
        </div>
      </div>

      {/* الإحصائيات المتقدمة */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* إحصائيات العملاء */}
          <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)] hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text)]">العملاء</h3>
                  <p className="text-sm text-[var(--muted)]">إجمالي المسجلين</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[var(--text)]">{stats.clients.total}</div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp size={14} />
                  +{stats.clients.growth}%
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--muted)]">في الانتظار: {stats.clients.pending}</span>
              <span className="text-[var(--muted)]">معتمد: {stats.clients.approved}</span>
            </div>
          </div>

          {/* إحصائيات المشاريع */}
          <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)] hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <FileText size={24} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text)]">المشاريع</h3>
                  <p className="text-sm text-[var(--muted)]">المشاريع النشطة</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[var(--text)]">{stats.projects.total}</div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp size={14} />
                  +{stats.projects.growth}%
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--muted)]">نشط: {stats.projects.active}</span>
              <span className="text-[var(--muted)]">مكتمل: {stats.projects.completed}</span>
            </div>
          </div>

          {/* إحصائيات العروض */}
          <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)] hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FileText size={24} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text)]">العروض</h3>
                  <p className="text-sm text-[var(--muted)]">عروض الأسعار</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[var(--text)]">{stats.quotes.total}</div>
                <div className="flex items-center gap-1 text-sm text-purple-600">
                  <Activity size={14} />
                  {stats.quotes.sent} مُرسل
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--muted)]">معتمد: {stats.quotes.approved}</span>
              <span className="text-[var(--muted)]">قيمة: ${stats.quotes.revenue.toLocaleString()}</span>
            </div>
          </div>

          {/* إحصائيات الإيرادات */}
          <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)] hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <DollarSign size={24} className="text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text)]">الإيرادات</h3>
                  <p className="text-sm text-[var(--muted)]">هذا الشهر</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[var(--text)]">
                  ${stats.revenue.thisMonth.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp size={14} />
                  +{stats.revenue.growth}%
                </div>
              </div>
            </div>
            <div className="text-sm text-[var(--muted)]">
              الشهر الماضي: ${stats.revenue.lastMonth.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* رسائل التنبيه */}
      {flash && (
        <div className={`p-4 rounded-[var(--radius-lg)] border ${
          flash.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {flash.type === 'success' ? 
              <CheckCircle size={20} /> : 
              <AlertCircle size={20} />
            }
            <span className="font-medium">{flash.message}</span>
          </div>
        </div>
      )}

      {/* حالات التحميل والخطأ */}
      {loading && (
        <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-500)] mx-auto mb-4"></div>
            <p className="text-[var(--muted)]">جاري تحميل البيانات...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] p-12">
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
            <h3 className="text-xl font-semibold text-[var(--text)] mb-2">حدث خطأ</h3>
            <p className="text-[var(--muted)] mb-6">{error}</p>
            <Button onClick={fetchClients}>
              <RefreshCw size={16} />
              إعادة المحاولة
            </Button>
          </div>
        </div>
      )}

      {/* أدوات البحث والفلترة المحدثة */}
      <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--text)]">إدارة العملاء</h2>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              <Filter size={16} />
              فلاتر متقدمة
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--muted)]" />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="بحث بالاسم، البريد، أو الهاتف..." 
              className="w-full pr-10 pl-4 py-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent transition-all" 
            />
          </div>
          
          <Dropdown
            value={statusFilter}
            onChange={(v) => setStatusFilter(v as typeof statusFilter)}
            options={[
              { value: 'all', label: 'جميع الحالات' },
              { value: 'pending', label: 'في الانتظار' },
              { value: 'approved', label: 'معتمد' },
              { value: 'rejected', label: 'مرفوض' },
            ]}
            placeholder="فلترة حسب الحالة"
          />
          
          <div className="flex gap-2">
            <input 
              value={inviteEmail} 
              onChange={e => setInviteEmail(e.target.value)} 
              placeholder="دعوة عميل جديد..." 
              className="flex-1 px-4 py-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent transition-all" 
            />
            <Button onClick={inviteClient} disabled={!inviteEmail.trim()}>
              <Plus size={16} />
              دعوة
            </Button>
          </div>
        </div>
      </div>

          {/* Clients Table */}
          {!loading && !error && (
            <div className="bg-[var(--card)] rounded-lg border border-[var(--elev)] overflow-hidden">
              <div className="scroll-xy">
                <table className="w-full">
                  <thead className="bg-[var(--bg)] border-b border-[var(--elev)]">
                    <tr>
                      <th className="text-right p-4 font-semibold text-[var(--text)]">العميل</th>
                      <th className="text-right p-4 font-semibold text-[var(--text)]">الشركة</th>
                      <th className="text-right p-4 font-semibold text-[var(--text)]">التواصل</th>
                      <th className="text-right p-4 font-semibold text-[var(--text)]">الحالة</th>
                      <th className="text-right p-4 font-semibold text-[var(--text)]">تاريخ التسجيل</th>
                      <th className="text-center p-4 font-semibold text-[var(--text)]">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients
                      .filter(c => statusFilter === 'all' ? true : c.status === statusFilter)
                      .filter(c => {
                        const q = search.trim().toLowerCase();
                        if (!q) return true;
                        return (
                          c.name?.toLowerCase().includes(q) ||
                          c.email?.toLowerCase().includes(q) ||
                          c.company?.toLowerCase().includes(q) ||
                          c.phone?.toLowerCase().includes(q)
                        );
                      })
                      .map((client) => (
                      <tr key={client.id} className="border-b border-[var(--elev)] hover:bg-[var(--bg)]">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[var(--accent-500)]/10 rounded-full flex items-center justify-center">
                              <Users size={16} className="text-[var(--accent-500)]" />
                            </div>
                            <div>
                              <div className="font-semibold text-[var(--text)]">{client.name}</div>
                              <div className="text-sm text-[var(--slate-600)]">{client.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-[var(--slate-600)]">
                            <Building size={16} />
                            {client.company}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-[var(--slate-600)]">
                              <Mail size={14} />
                              <a href={`mailto:${client.email}`} className="hover:underline">
                                {client.email}
                              </a>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[var(--slate-600)]">
                              <Phone size={14} />
                              <a href={`tel:${client.phone}`} className="hover:underline">
                                {client.phone}
                              </a>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            client.status === 'approved' 
                              ? 'bg-[var(--success-bg)] text-[var(--success-fg)]'
                              : client.status === 'rejected'
                              ? 'bg-[var(--danger-bg)] text-[var(--danger-fg)]'
                              : 'bg-[var(--warning-bg)] text-[var(--warning-fg)]'
                          }`}>
                            {client.status === 'approved' ? 'معتمد' : 
                             client.status === 'rejected' ? 'مرفوض' : 'في الانتظار'}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-[var(--slate-600)]">
                          {new Date(client.createdAt).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="p-4">
                          {client.status === 'pending' && (
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => updateClientStatus(client.id, 'approved')}
                                className="bg-[var(--success-fg)]/90 hover:bg-[var(--success-fg)] text-[var(--text-dark)]"
                              >
                                <CheckCircle size={14} className="mr-1" />
                                قبول
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateClientStatus(client.id, 'rejected')}
                                className="text-[var(--danger-fg)] hover:bg-[var(--danger-bg)]"
                              >
                                <XCircle size={14} className="mr-1" />
                                رفض
                              </Button>
                            </div>
                          )}
                          {client.status !== 'pending' && (
                            <span className="text-sm text-[var(--slate-500)]">
                              {client.status === 'approved' ? 'تم القبول' : 'تم الرفض'}
                            </span>
                          )}
                          {client.status === 'approved' && (
                            <div className="mt-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setNewProjectClientEmail(client.email);
                                  if (createProjectRef.current) {
                                    createProjectRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                  }
                                }}
                              >
                                إنشاء مشروع لهذا العميل
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {clients.length === 0 && (
                <div className="text-center py-12">
                  <Users size={48} className="mx-auto mb-4 text-[var(--slate-400)]" />
                  <h3 className="text-lg font-semibold text-[var(--text)] mb-2">لا توجد طلبات</h3>
                  <p className="text-[var(--slate-600)]">لم يتم استلام أي طلبات عضوية حتى الآن</p>
                </div>
              )}
            </div>
          )}

          {/* Projects Section */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-[var(--text)] mb-1">المشاريع</h2>
                <p className="text-[var(--slate-600)]">قائمة المشاريع المرتبطة بالعملاء</p>
              </div>
              <Button onClick={fetchProjects} className="flex items-center gap-2"><RefreshCw size={16}/>تحديث</Button>
            </div>

            {/* Create Project */}
            <div ref={createProjectRef} className="bg-[var(--card)] p-6 rounded-lg border border-[var(--elev)] mb-6">
              <h3 className="text-lg font-semibold text-[var(--text)] mb-4">إنشاء مشروع جديد</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">عنوان المشروع</label>
                    <input 
                      value={newProjectTitle} 
                      onChange={e => setNewProjectTitle(e.target.value)} 
                      placeholder="مثل: حملة تسويقية شتوية" 
                      className="w-full px-3 py-2 rounded-md border border-[var(--elev)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">العميل</label>
                    <Dropdown
                      value={newProjectClientEmail || ''}
                      onChange={(v) => setNewProjectClientEmail(String(v))}
                      options={[{ value: '', label: 'اختر العميل' }, ...clients.filter(c => c.status === 'approved').map(c => ({ value: c.email, label: `${c.name} - ${c.company}` }))]}
                    />
                    <p className="text-xs text-[var(--slate-600)] mt-1">فقط العملاء المعتمدون يظهرون هنا</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">حالة المشروع</label>
                    <Dropdown
                      value={newProjectStatus as 'active' | 'pending' | 'completed'}
                      onChange={(v) => setNewProjectStatus(String(v))}
                      options={[{ value: 'active', label: 'نشط' }, { value: 'pending', label: 'انتظار' }, { value: 'completed', label: 'مكتمل' }]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">الميزانية (USD)</label>
                    <input type="number" min={0} value={newProjectBudget} onChange={e => setNewProjectBudget(Number(e.target.value))} className="w-full px-3 py-2 rounded-md border border-[var(--elev)] bg-[var(--bg)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">نسبة التقدم %</label>
                    <input type="number" min={0} max={100} value={newProjectProgress} onChange={e => setNewProjectProgress(Number(e.target.value))} className="w-full px-3 py-2 rounded-md border border-[var(--elev)] bg-[var(--bg)]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">وصف المشروع</label>
                  <textarea value={newProjectDescription} onChange={e => setNewProjectDescription(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-md border border-[var(--elev)] bg-[var(--bg)]" placeholder="نبذة عن المشروع" />
                </div>
                <div className="flex justify-end">
                  <Button onClick={createProject} disabled={!newProjectTitle.trim() || !newProjectClientEmail.trim()} className="px-6 py-2">إنشاء المشروع</Button>
                </div>
              </div>
            </div>

            {/* Projects Table / States */}
            {projectsLoading && (
              <div className="text-center py-8 text-[var(--slate-600)]">جاري تحميل المشاريع…</div>
            )}
            {projectsError && (
              <div className="text-center py-8 text-red-600">{projectsError}</div>
            )}
            {!projectsLoading && !projectsError && (
              <div className="bg-[var(--card)] rounded-lg border border-[var(--elev)] overflow-hidden">
                <div className="scroll-xy">
                  <table className="w-full">
                    <thead className="bg-[var(--bg)] border-b border-[var(--elev)]">
                      <tr>
                        <th className="text-right p-4 font-semibold text-[var(--text)]">العنوان</th>
                        <th className="text-right p-4 font-semibold text-[var(--text)]">البريد المرتبط</th>
                        <th className="text-right p-4 font-semibold text-[var(--text)]">الحالة</th>
                        <th className="text-right p-4 font-semibold text-[var(--text)]">تاريخ الإنشاء</th>
                        <th className="text-right p-4 font-semibold text-[var(--text)]">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map(p => (
                        <tr key={p.id} className="border-b border-[var(--elev)] hover:bg-[var(--bg)]">
                          <td className="p-4">{p.title}</td>
                          <td className="p-4 text-sm text-[var(--slate-700)]">{p.clientEmail}</td>
                          <td className="p-4 text-sm">
                            <span className="px-2 py-1 rounded-full bg-[var(--bg)]">{p.status}</span>
                          </td>
                          <td className="p-4 text-sm text-[var(--slate-600)]">{p.createdAt ? new Date(p.createdAt).toLocaleDateString('ar-SA') : '-'}</td>
                          <td className="p-4 text-sm">
                            {/* ربط قديم → جديد: زر سريع لإنشاء عرض مرتبط بالمشروع المحدد */}
                            <Button
                              size="sm"
                              onClick={() => {
                                const params = new URLSearchParams({
                                  openCreate: '1',
                                  clientEmail: p.clientEmail,
                                  projectId: p.id
                                });
                                location.assign(`/admin/quotes?${params.toString()}`);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1"
                            >
                              إنشاء عرض
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {projects.length === 0 && (
                  <div className="text-center py-8 text-[var(--slate-600)]">لا توجد مشاريع حتى الآن</div>
                )}
              </div>
            )}
          </div>

          {/* Admin File Upload Section */}
          <div className="mt-10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[var(--text)] mb-2">رفع الملفات</h2>
              <p className="text-[var(--slate-600)]">ارفع الملفات للمشاريع بالنيابة عن العملاء</p>
            </div>
            
            <div className="bg-[var(--card)] p-6 rounded-lg border border-[var(--elev)] mb-6">
              <div className="mb-4 grid gap-3 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">اختر المشروع</label>
                  <Dropdown
                    value={selectedProjectIdForUpload || ''}
                    onChange={(v) => setSelectedProjectIdForUpload(String(v))}
                    options={[{ value: '', label: 'اختر المشروع للرفع' }, ...projects.map(p => ({ value: p.id, label: `${(p as unknown as { name?: string; title?: string }).name || (p as unknown as { title?: string }).title || 'بدون عنوان'} - ${p.clientEmail}` }))]}
                    className="w-full max-w-md"
                  />
                  {!selectedProjectIdForUpload && (
                    <p className="text-xs text-amber-600 mt-1">⚠️ يجب اختيار مشروع أولاً</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">فلترة الملفات</label>
                  <Dropdown
                    value={fileFilter}
                    onChange={(v)=> setFileFilter(v as typeof fileFilter)}
                    options={[
                      { value: 'all', label: 'الكل' },
                      { value: 'image', label: 'صور' },
                      { value: 'video', label: 'فيديو' },
                      { value: 'document', label: 'مستندات' },
                    ]}
                    className="w-full max-w-md"
                  />
                </div>
              </div>
              
              <UnifiedUploader projectId={selectedProjectIdForUpload || ''} onUploaded={() => { fetchProjects(); }} />
            </div>
          </div>
    </div>
  );
}
