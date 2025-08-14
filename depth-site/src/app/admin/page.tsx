"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { CheckCircle, XCircle, Users, Clock, Mail, Phone, Building, RefreshCw, AlertCircle } from "lucide-react";
import ImageUploader from "@/components/features/portal/files/ImageUploader";
import VideoUploader from "@/components/features/portal/files/VideoUploader";
import DocumentUploader from "@/components/features/portal/files/DocumentUploader";
import { signIn, useSession } from "next-auth/react";

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [inviteEmail, setInviteEmail] = useState('');

  // Projects
  type ProjectRow = { id: string; title: string; clientEmail: string; status: string; createdAt?: string };
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectClientEmail, setNewProjectClientEmail] = useState('');
  const [newProjectStatus, setNewProjectStatus] = useState('active');
  const [selectedProjectIdForUpload, setSelectedProjectIdForUpload] = useState('');
  const userRole = (session?.user && (session.user as { role?: string })?.role) || 'client';
  const isAdmin = userRole === 'admin';

  // Trigger initial fetch when user becomes authenticated admin
  useEffect(() => {
    if (status !== 'authenticated' || !isAdmin) return;
    const key = '__admin_clients_fetched__';
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, '1');
      // Start loading and fetch
      fetchClients();
      fetchProjects();
    }
  }, [status, isAdmin]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/portal/admin/clients');
      
      if (response.ok) {
        const data = await response.json();
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
  };

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

  const createDemoClient = async () => {
    try {
      setFlash(null);
      const res = await fetch('/api/portal/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-demo-client' })
      });
      if (!res.ok) throw new Error('create demo failed');
      await fetchClients();
      setFlash({ type: 'success', message: 'تم إنشاء عميل تجريبي' });
    } catch {
      setFlash({ type: 'error', message: 'فشل إنشاء العميل التجريبي' });
    }
  };

  const fetchProjects = async () => {
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
  };

  const createProject = async () => {
    try {
      setFlash(null);
      const res = await fetch('/api/portal/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newProjectTitle.trim(), clientEmail: newProjectClientEmail.trim(), status: newProjectStatus })
      });
      if (!res.ok) throw new Error('failed');
      setNewProjectTitle('');
      setNewProjectClientEmail('');
      setNewProjectStatus('active');
      await fetchProjects();
      setFlash({ type: 'success', message: 'تم إنشاء المشروع' });
    } catch {
      setFlash({ type: 'error', message: 'فشل إنشاء المشروع' });
    }
  };

  // Enforce Google sign-in for admin
  if (status !== 'authenticated') {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <Header />
        <main className="py-12 md:py-20">
          <Container>
            <div className="max-w-md mx-auto">
              <div className="bg-[var(--card)] p-8 rounded-[var(--radius-lg)] border border-[var(--elev)]">
                <div className="text-center mb-8">
                  <Users size={48} className="mx-auto mb-4 text-[var(--accent-500)]" />
                  <h1 className="text-2xl font-bold text-[var(--text)] mb-2">لوحة إدارة العملاء</h1>
                  <p className="text-[var(--slate-600)]">سجّل الدخول عبر Google باستخدام حساب الأدمن <span className="font-mono text-[var(--text)]">admin@depth-agency.com</span></p>
                </div>
                
                <div className="space-y-4">
                  <Button onClick={() => signIn('google', { callbackUrl: '/admin' })} className="w-full">
                    تسجيل الدخول عبر Google
                  </Button>
                  <p className="text-xs text-center text-[var(--slate-600)]">بعد تسجيل الدخول الناجح، ستظهر لك لوحة الإدارة بدلاً من صفحة انتظار العميل.</p>
                </div>
              </div>
            </div>
          </Container>
        </main>
      </div>
    );
  }
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <Header />
        <main className="py-12 md:py-20">
          <Container>
            <div className="max-w-xl mx-auto bg-[var(--card)] p-8 rounded-[var(--radius-lg)] border border-[var(--elev)] text-center">
              <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
              <h1 className="text-2xl font-bold text-[var(--text)] mb-2">لا تملك صلاحية الوصول</h1>
              <p className="text-[var(--slate-600)] mb-6">هذه الصفحة خاصة بمدراء النظام. استخدم بوابتك لمتابعة مشاريعك.</p>
              <div className="flex justify-center gap-2">
                <Button onClick={() => location.assign('/portal')}>الانتقال إلى البوابة</Button>
              </div>
            </div>
          </Container>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Header />
      
      <main className="py-12 md:py-20">
        <Container>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text)] mb-2">لوحة إدارة العملاء</h1>
              <p className="text-[var(--slate-600)]">إدارة طلبات العضوية والموافقات</p>
            </div>
            <Button onClick={fetchClients} className="flex items-center gap-2">
              <RefreshCw size={16} />
              تحديث البيانات
            </Button>
          </div>

          {/* Flash messages */}
          {flash && (
            <div className={`mb-6 p-3 rounded-md border ${flash.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
              {flash.message}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[var(--card)] p-6 rounded-lg border border-[var(--elev)]">
              <div className="flex items-center gap-3">
                <Users size={24} className="text-[var(--accent-500)]" />
                <div>
                  <div className="text-2xl font-bold text-[var(--text)]">{clients.length}</div>
                  <div className="text-sm text-[var(--slate-600)]">إجمالي العملاء</div>
                </div>
              </div>
            </div>
            
            <div className="bg-[var(--card)] p-6 rounded-lg border border-[var(--elev)]">
              <div className="flex items-center gap-3">
                <Clock size={24} className="text-orange-500" />
                <div>
                  <div className="text-2xl font-bold text-[var(--text)]">
                    {clients.filter(c => c.status === 'pending').length}
                  </div>
                  <div className="text-sm text-[var(--slate-600)]">في الانتظار</div>
                </div>
              </div>
            </div>
            
            <div className="bg-[var(--card)] p-6 rounded-lg border border-[var(--elev)]">
              <div className="flex items-center gap-3">
                <CheckCircle size={24} className="text-green-500" />
                <div>
                  <div className="text-2xl font-bold text-[var(--text)]">
                    {clients.filter(c => c.status === 'approved').length}
                  </div>
                  <div className="text-sm text-[var(--slate-600)]">معتمد</div>
                </div>
              </div>
            </div>
            
            <div className="bg-[var(--card)] p-6 rounded-lg border border-[var(--elev)]">
              <div className="flex items-center gap-3">
                <XCircle size={24} className="text-red-500" />
                <div>
                  <div className="text-2xl font-bold text-[var(--text)]">
                    {clients.filter(c => c.status === 'rejected').length}
                  </div>
                  <div className="text-sm text-[var(--slate-600)]">مرفوض</div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-500)] mx-auto mb-4"></div>
              <p className="text-[var(--slate-600)]">جاري تحميل البيانات...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
              <h3 className="text-xl font-semibold text-[var(--text)] mb-2">حدث خطأ</h3>
              <p className="text-[var(--slate-600)] mb-6">{error}</p>
              <Button onClick={fetchClients}>
                إعادة المحاولة
              </Button>
            </div>
          )}

          {/* Controls: search / filters / invite / create demo */}
          <div className="bg-[var(--card)] p-4 rounded-lg border border-[var(--elev)] mb-6 grid gap-3 md:grid-cols-2">
            <div className="flex gap-2">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم/البريد/الهاتف" className="flex-1 px-3 py-2 rounded-md border border-[var(--elev)] bg-[var(--bg)]" />
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as 'all' | 'pending' | 'approved' | 'rejected')} className="px-3 py-2 rounded-md border border-[var(--elev)] bg-[var(--bg)]">
                <option value="all">الكل</option>
                <option value="pending">في الانتظار</option>
                <option value="approved">معتمد</option>
                <option value="rejected">مرفوض</option>
              </select>
            </div>
            <div className="flex gap-2">
              <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="دعوة عميل عبر البريد" className="flex-1 px-3 py-2 rounded-md border border-[var(--elev)] bg-[var(--bg)]" />
              <Button onClick={inviteClient}>إرسال دعوة</Button>
              <Button variant="secondary" onClick={createDemoClient}>عميل تجريبي</Button>
            </div>
          </div>

          {/* Clients Table */}
          {!loading && !error && (
            <div className="bg-[var(--card)] rounded-lg border border-[var(--elev)] overflow-hidden">
              <div className="overflow-x-auto">
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
                              ? 'bg-green-100 text-green-800'
                              : client.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-orange-100 text-orange-800'
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
                                className="bg-green-500 hover:bg-green-600"
                              >
                                <CheckCircle size={14} className="mr-1" />
                                قبول
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateClientStatus(client.id, 'rejected')}
                                className="text-red-600 hover:bg-red-50"
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
            <div className="bg-[var(--card)] p-4 rounded-lg border border-[var(--elev)] mb-4 grid gap-2 md:grid-cols-3">
              <input value={newProjectTitle} onChange={e => setNewProjectTitle(e.target.value)} placeholder="عنوان المشروع" className="px-3 py-2 rounded-md border border-[var(--elev)] bg-[var(--bg)]" />
              <select value={newProjectClientEmail} onChange={e => setNewProjectClientEmail(e.target.value)} className="px-3 py-2 rounded-md border border-[var(--elev)] bg-[var(--bg)]">
                <option value="">اختر بريد العميل</option>
                {clients.map(c => (
                  <option key={c.id} value={c.email}>{c.email}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <select value={newProjectStatus} onChange={e => setNewProjectStatus(e.target.value)} className="px-3 py-2 rounded-md border border-[var(--elev)] bg-[var(--bg)]">
                  <option value="active">نشط</option>
                  <option value="pending">انتظار</option>
                  <option value="completed">مكتمل</option>
                </select>
                <Button onClick={createProject}>إنشاء مشروع</Button>
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
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[var(--bg)] border-b border-[var(--elev)]">
                      <tr>
                        <th className="text-right p-4 font-semibold text-[var(--text)]">العنوان</th>
                        <th className="text-right p-4 font-semibold text-[var(--text)]">البريد المرتبط</th>
                        <th className="text-right p-4 font-semibold text-[var(--text)]">الحالة</th>
                        <th className="text-right p-4 font-semibold text-[var(--text)]">تاريخ الإنشاء</th>
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

          {/* Admin Uploads Section (reuse client uploaders) */}
          <div className="mt-10">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-[var(--text)] mb-1">رفع الملفات (للأدمن)</h2>
              <p className="text-[var(--slate-600)]">اختر مشروعاً ثم ارفع صور/فيديو/وثائق بالنيابة عن العميل</p>
            </div>
            <div className="bg-[var(--card)] p-4 rounded-lg border border-[var(--elev)] mb-4 grid gap-3 md:grid-cols-3">
              <select value={selectedProjectIdForUpload} onChange={e => setSelectedProjectIdForUpload(e.target.value)} className="px-3 py-2 rounded-md border border-[var(--elev)] bg-[var(--bg)]">
                <option value="">اختر مشروعاً للرفع</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.title} — {p.clientEmail}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <ImageUploader projectId={selectedProjectIdForUpload || 'demo'} onUploaded={() => { fetchProjects(); }} />
              <VideoUploader projectId={selectedProjectIdForUpload || 'demo'} onUploaded={() => { fetchProjects(); }} />
              <DocumentUploader projectId={selectedProjectIdForUpload || 'demo'} onUploaded={() => { fetchProjects(); }} />
            </div>
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
}
