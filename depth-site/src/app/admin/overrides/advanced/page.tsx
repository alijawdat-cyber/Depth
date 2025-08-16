"use client";

// صفحة التعديلات المتقدمة - متوافقة مع docs/roles/admin/05-Rate-Override-Policy.md
// الغرض: إدارة متقدمة لطلبات تعديل الأسعار مع نظام موافقات متعدد المستويات
// المرحلة: إدارة شاملة للتعديلات المعقدة والاستراتيجية

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Dropdown from '@/components/ui/Dropdown';
import SectionHeading from '@/components/ui/SectionHeading';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Loader from '@/components/loaders/Loader';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingDown,
  FileText,
  Shield,
  Eye,
  Edit3,
  Plus,
  RefreshCw,
  Filter,
  Search,
  Download
} from 'lucide-react';

interface PriceOverrideRequest {
  id: string;
  quoteId: string;
  clientName: string;
  requestedBy: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  
  originalPrice: number;
  requestedPrice: number;
  discountAmount: number;
  discountPercentage: number;
  
  reason: string;
  justification: string;
  competitorPrice?: number;
  expectedVolume?: number;
  strategicValue?: string;
  
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  marginImpact: number;
  profitabilityRisk: string;
  
  approvals: Array<{
    level: 'manager' | 'director' | 'ceo';
    approver: string;
    status: 'pending' | 'approved' | 'rejected';
    timestamp?: string;
    notes?: string;
  }>;
  
  conditions: string[];
  expiryDate?: string;
  usageLimit?: number;
  usageCount?: number;
}

interface AdvancedOverridesStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  expired: number;
  totalDiscountValue: number;
  avgDiscountPercentage: number;
  highRiskCount: number;
}

interface PageState {
  overrides: PriceOverrideRequest[];
  stats: AdvancedOverridesStats | null;
  loading: boolean;
  error: string | null;
  selectedStatus: string;
  selectedRiskLevel: string;
  selectedApprovalLevel: string;
  viewMode: 'overview' | 'detailed' | 'analytics';
  searchTerm: string;
  showCreateForm: boolean;
}

export default function AdvancedOverridesPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [state, setState] = useState<PageState>({
    overrides: [],
    stats: null,
    loading: true,
    error: null,
    selectedStatus: 'all',
    selectedRiskLevel: 'all',
    selectedApprovalLevel: 'all',
    viewMode: 'overview',
    searchTerm: '',
    showCreateForm: false
  });

  // التحقق من الصلاحيات
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'admin';

  const loadOverridesData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const params = new URLSearchParams();
      if (state.selectedStatus !== 'all') params.append('status', state.selectedStatus);
      if (state.selectedRiskLevel !== 'all') params.append('riskLevel', state.selectedRiskLevel);
      if (state.searchTerm) params.append('search', state.searchTerm);

      const response = await fetch(`/api/admin/overrides/advanced?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'فشل في تحميل البيانات');
      }

      setState(prev => ({
        ...prev,
        overrides: data.overrides || [],
        stats: data.stats || null,
        loading: false
      }));

    } catch (error) {
      console.error('Error loading overrides:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'حدث خطأ غير متوقع',
        loading: false
      }));
    }
  }, [state.selectedStatus, state.selectedRiskLevel, state.searchTerm]);

  useEffect(() => {
    if (isAdmin) {
      loadOverridesData();
    }
  }, [isAdmin, loadOverridesData]);

  // Helper functions
  const getRiskLevelColor = (level: string) => {
    const colors = {
      low: 'text-green-600 bg-green-50',
      medium: 'text-yellow-600 bg-yellow-50',
      high: 'text-orange-600 bg-orange-50',
      critical: 'text-red-600 bg-red-50'
    };
    return colors[level as keyof typeof colors] || 'text-gray-600 bg-gray-50';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <Clock size={16} className="text-yellow-500" />,
      approved: <CheckCircle size={16} className="text-green-500" />,
      rejected: <XCircle size={16} className="text-red-500" />,
      expired: <AlertTriangle size={16} className="text-gray-500" />
    };
    return icons[status as keyof typeof icons] || <Clock size={16} />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-IQ', {
      style: 'currency',
      currency: 'IQD',
      minimumFractionDigits: 0
    }).format(amount);
  };



  // التحقق من الصلاحيات
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">غير مصرح</h2>
          <p className="text-[var(--muted)] mb-4">ليس لديك صلاحية للوصول إلى هذه الصفحة</p>
          <Button onClick={() => router.push('/admin')}>
            العودة للوحة التحكم
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Breadcrumbs />
      <SectionHeading
          title="التعديلات المتقدمة"
          description="إدارة متقدمة لطلبات تعديل الأسعار والموافقات متعددة المستويات"
        />
      </div>

      {/* Stats Cards */}
      {state.stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--elev)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">إجمالي الطلبات</p>
                <p className="text-2xl font-bold text-[var(--text)]">{state.stats.total}</p>
              </div>
              <FileText className="text-[var(--accent-500)]" size={24} />
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--elev)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">قيد المراجعة</p>
                <p className="text-2xl font-bold text-yellow-600">{state.stats.pending}</p>
              </div>
              <Clock className="text-yellow-500" size={24} />
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--elev)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">عالية المخاطر</p>
                <p className="text-2xl font-bold text-red-600">{state.stats.highRiskCount}</p>
              </div>
              <AlertTriangle className="text-red-500" size={24} />
          </div>
        </div>

          <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--elev)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">قيمة الخصومات</p>
                <p className="text-2xl font-bold text-[var(--text)]">
                  {formatCurrency(state.stats.totalDiscountValue)}
                </p>
              </div>
              <TrendingDown className="text-[var(--accent-500)]" size={24} />
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--elev)]">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative">
              <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
              <input
                type="text"
                placeholder="البحث في الطلبات..."
                value={state.searchTerm}
                onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="pr-10 pl-4 py-2 border border-[var(--elev)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)] placeholder-[var(--muted)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
              />
            </div>

      {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[var(--muted)]" />
          <Dropdown
            options={[
              { value: 'all', label: 'جميع الحالات' },
                  { value: 'pending', label: 'قيد المراجعة' },
                  { value: 'approved', label: 'موافق عليها' },
                  { value: 'rejected', label: 'مرفوضة' },
                  { value: 'expired', label: 'منتهية الصلاحية' }
                ]}
                value={state.selectedStatus}
                onChange={(value: string) => setState(prev => ({ ...prev, selectedStatus: value }))}
              />
            </div>

          <Dropdown
            options={[
                { value: 'all', label: 'جميع مستويات المخاطر' },
                { value: 'low', label: 'منخفضة' },
                { value: 'medium', label: 'متوسطة' },
                { value: 'high', label: 'عالية' },
                { value: 'critical', label: 'حرجة' }
              ]}
              value={state.selectedRiskLevel}
              onChange={(value: string) => setState(prev => ({ ...prev, selectedRiskLevel: value }))}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={loadOverridesData}
              disabled={state.loading}
            >
              <RefreshCw size={16} className={state.loading ? 'animate-spin' : ''} />
              تحديث
            </Button>
            
            <Button variant="outline">
              <Download size={16} />
              تصدير
            </Button>

            <Button onClick={() => setState(prev => ({ ...prev, showCreateForm: true }))}>
              <Plus size={16} />
              طلب جديد
            </Button>
          </div>
        </div>
      </div>

      {/* Overrides Table */}
      <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] overflow-hidden">
        <div className="p-6 border-b border-[var(--elev)]">
          <h2 className="text-xl font-semibold text-[var(--text)]">
            طلبات التعديل ({state.overrides.length})
          </h2>
        </div>

        {state.loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader />
          </div>
        ) : state.error ? (
          <div className="text-center py-12">
            <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
            <p className="text-red-600 mb-4">{state.error}</p>
            <Button onClick={loadOverridesData} variant="outline">
              <RefreshCw size={16} />
              إعادة المحاولة
            </Button>
          </div>
        ) : state.overrides.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-[var(--muted)] mb-4" />
            <p className="text-[var(--muted)]">لا توجد طلبات تعديل</p>
          </div>
        ) : (
          <div className="scroll-xy">
          <table className="w-full">
              <thead className="bg-[var(--bg)] border-b border-[var(--elev)]">
              <tr>
                <th className="text-right p-4 font-medium text-[var(--text)]">العميل</th>
                <th className="text-right p-4 font-medium text-[var(--text)]">السعر الأصلي</th>
                <th className="text-right p-4 font-medium text-[var(--text)]">السعر المطلوب</th>
                  <th className="text-right p-4 font-medium text-[var(--text)]">الخصم</th>
                  <th className="text-right p-4 font-medium text-[var(--text)]">مستوى المخاطر</th>
                <th className="text-right p-4 font-medium text-[var(--text)]">الحالة</th>
                  <th className="text-right p-4 font-medium text-[var(--text)]">الموافقات</th>
                <th className="text-right p-4 font-medium text-[var(--text)]">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
                {state.overrides.map((override) => (
                  <tr key={override.id} className="border-b border-[var(--elev)] hover:bg-[var(--bg)]">
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-[var(--text)]">{override.clientName}</div>
                        <div className="text-sm text-[var(--muted)]">ID: {override.quoteId}</div>
                      </div>
                    </td>
                    <td className="p-4 text-[var(--text)]">
                      {formatCurrency(override.originalPrice)}
                    </td>
                    <td className="p-4 text-[var(--text)]">
                      {formatCurrency(override.requestedPrice)}
                    </td>
                    <td className="p-4">
                      <div className="text-red-600 font-medium">
                        -{override.discountPercentage}%
                      </div>
                      <div className="text-sm text-[var(--muted)]">
                        {formatCurrency(override.discountAmount)}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(override.riskLevel)}`}>
                        {override.riskLevel === 'low' && 'منخفضة'}
                        {override.riskLevel === 'medium' && 'متوسطة'}
                        {override.riskLevel === 'high' && 'عالية'}
                        {override.riskLevel === 'critical' && 'حرجة'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(override.status)}
                        <span className="text-sm">
                          {override.status === 'pending' && 'قيد المراجعة'}
                          {override.status === 'approved' && 'موافق عليه'}
                          {override.status === 'rejected' && 'مرفوض'}
                          {override.status === 'expired' && 'منتهي الصلاحية'}
                      </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        {override.approvals.map((approval, index) => (
                          <div
                            key={index}
                            className={`w-3 h-3 rounded-full ${
                              approval.status === 'approved' ? 'bg-green-500' :
                              approval.status === 'rejected' ? 'bg-red-500' :
                              'bg-gray-300'
                            }`}
                            title={`${approval.level}: ${approval.status}`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye size={14} />
                          عرض
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit3 size={14} />
                          تحرير
                            </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
}