"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { CheckCircle, XCircle, Users, Clock, Mail, Phone, Building, RefreshCw, AlertCircle } from "lucide-react";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userRole = (session?.user && (session.user as { role?: string })?.role) || 'client';
  const isAdmin = userRole === 'admin';

  // Note: we will trigger initial fetch from a button to avoid use-before-define lints.

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
        alert(`تم ${status === 'approved' ? 'قبول' : 'رفض'} العميل بنجاح`);
      } else {
        throw new Error('Failed to update client');
      }
    } catch (err) {
      alert('حدث خطأ في تحديث حالة العميل');
      console.error('Update error:', err);
    }
  };

  // Enforce Google sign-in for admin
  if (status !== 'authenticated' || !isAdmin) {
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
                    {clients.map((client) => (
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
        </Container>
      </main>
      
      <Footer />
    </div>
  );
}
