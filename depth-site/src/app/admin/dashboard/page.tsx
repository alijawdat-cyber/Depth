"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { 
  RefreshCw, 
  Users, 
  FileText, 
  DollarSign,
  Briefcase,
  Camera
} from "lucide-react";

interface AdminStats {
  totalClients: number;
  totalProjects: number;
  totalContracts: number;
  totalQuotes: number;
  totalCreators: number;
}

interface AdminData {
  clients: { stats: { total: number; pending: number; approved: number; rejected: number } };
  projects: { stats: { total: number; active: number; completed: number; pending: number } };
  contracts: { stats: { total: number; active: number; completed: number; pending: number } };
  quotes: { stats: { total: number; draft: number; sent: number; approved: number; rejected: number } };
  creators: { stats: { total: number; active: number; pending: number } };
  summary: AdminStats;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/dashboard');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'خطأ في جلب البيانات');
      }
      
      const result = await response.json();
      setData(result.data);
    } catch (err) {
      console.error('خطأ في جلب البيانات:', err);
      setError(err instanceof Error ? err.message : 'خطأ غير معروف');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-500)] mx-auto mb-4"></div>
            <p className="text-[var(--muted)]">جاري تحميل بيانات لوحة الإدارة...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[var(--text)] mb-2">حدث خطأ</h3>
          <p className="text-[var(--muted)] mb-6">{error}</p>
          <Button onClick={fetchData}>
            <RefreshCw size={16} className="mr-2" />
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs />
      
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)] mb-2">لوحة التحكم الإدارية</h1>
          <p className="text-[var(--muted)]">نظرة شاملة على النظام والإحصائيات</p>
        </div>
        <Button onClick={fetchData} variant="secondary">
          <RefreshCw size={16} className="mr-2" />
          تحديث البيانات
        </Button>
      </div>

      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {/* العملاء */}
        <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)] hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users size={24} className="text-blue-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[var(--text)]">{data.clients.stats.total}</div>
              <div className="text-sm text-[var(--muted)]">العملاء</div>
            </div>
          </div>
          <div className="text-sm text-[var(--muted)]">
            في الانتظار: {data.clients.stats.pending} | معتمد: {data.clients.stats.approved}
          </div>
        </div>

        {/* المشاريع */}
        <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)] hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FileText size={24} className="text-green-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[var(--text)]">{data.projects.stats.total}</div>
              <div className="text-sm text-[var(--muted)]">المشاريع</div>
            </div>
          </div>
          <div className="text-sm text-[var(--muted)]">
            نشط: {data.projects.stats.active} | مكتمل: {data.projects.stats.completed}
          </div>
        </div>

        {/* العقود */}
        <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)] hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Briefcase size={24} className="text-purple-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[var(--text)]">{data.contracts.stats.total}</div>
              <div className="text-sm text-[var(--muted)]">العقود</div>
            </div>
          </div>
          <div className="text-sm text-[var(--muted)]">
            نشط: {data.contracts.stats.active} | مكتمل: {data.contracts.stats.completed}
          </div>
        </div>

        {/* العروض */}
        <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)] hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <DollarSign size={24} className="text-orange-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[var(--text)]">{data.quotes.stats.total}</div>
              <div className="text-sm text-[var(--muted)]">العروض</div>
            </div>
          </div>
          <div className="text-sm text-[var(--muted)]">
            مُرسل: {data.quotes.stats.sent} | معتمد: {data.quotes.stats.approved}
          </div>
        </div>

        {/* المبدعين */}
        <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)] hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
              <Camera size={24} className="text-pink-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[var(--text)]">{data.creators.stats.total}</div>
              <div className="text-sm text-[var(--muted)]">المبدعين</div>
            </div>
          </div>
          <div className="text-sm text-[var(--muted)]">
            نشط: {data.creators.stats.active} | انتظار: {data.creators.stats.pending}
          </div>
        </div>
      </div>

      {/* روابط سريعة للصفحات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)]">
          <h3 className="text-lg font-semibold text-[var(--text)] mb-4">إدارة العملاء</h3>
          <p className="text-[var(--muted)] mb-4">مراجعة طلبات العضوية وإدارة العملاء</p>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => window.location.href = '/admin/users'}
            >
              عرض العملاء
            </Button>
          </div>
        </div>

        <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)]">
          <h3 className="text-lg font-semibold text-[var(--text)] mb-4">المشاريع والعروض</h3>
          <p className="text-[var(--muted)] mb-4">إدارة المشاريع وعروض الأسعار</p>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => window.location.href = '/admin/projects'}
            >
              المشاريع
            </Button>
            <Button 
              size="sm" 
              variant="secondary"
              onClick={() => window.location.href = '/admin/quotes'}
            >
              العروض
            </Button>
          </div>
        </div>

        <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)]">
          <h3 className="text-lg font-semibold text-[var(--text)] mb-4">النظام والإعدادات</h3>
          <p className="text-[var(--muted)] mb-4">إدارة الكتالوج والتسعير والعقود</p>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => window.location.href = '/admin/catalog'}
            >
              الكتالوج
            </Button>
            <Button 
              size="sm" 
              variant="secondary"
              onClick={() => window.location.href = '/admin/pricing'}
            >
              التسعير
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
