"use client";

import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation"; // محجوز للاستخدام المستقبلي
import { Button } from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Dropdown from "@/components/ui/Dropdown";
import Loader from "@/components/loaders/Loader";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  Plus,
  Search
} from "lucide-react";
import { PriceOverride, OverrideStats, OverrideListResponse } from "@/types/governance";

interface OverridesPageState {
  overrides: PriceOverride[];
  stats: OverrideStats | null;
  loading: boolean;
  error: string | null;

  // فلاتر موحدة للنوعين
  selectedType: 'all' | 'basic' | 'advanced';
  selectedStatus: string;
  selectedRiskLevel: string;
  searchTerm: string;
  
  // العمليات
  updating: string | null;
  showCreateForm: boolean;
}

export default function OverridesPage() {
  // const router = useRouter(); // محجوز للاستخدام المستقبلي

  const [state, setState] = useState<OverridesPageState>({
    overrides: [],
    stats: null,
    loading: true,
    error: null,
    selectedType: 'all',
    selectedStatus: 'all',
    selectedRiskLevel: 'all',
    searchTerm: '',
    updating: null,
    showCreateForm: false
  });

  // Load data on mount
  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedType, state.selectedStatus, state.selectedRiskLevel, state.searchTerm]);

  const loadData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const queryParams = new URLSearchParams();
      if (state.selectedType !== 'all') queryParams.set('type', state.selectedType);
      if (state.selectedStatus !== 'all') queryParams.set('status', state.selectedStatus);
      if (state.selectedRiskLevel !== 'all') queryParams.set('riskLevel', state.selectedRiskLevel);
      if (state.searchTerm) queryParams.set('search', state.searchTerm);

      const response = await fetch(`/api/admin/overrides?${queryParams}`);
      if (!response.ok) {
        throw new Error('فشل في تحميل طلبات التعديل');
      }
      
      const data: OverrideListResponse = await response.json();
      if (!data.success) {
        throw new Error('فشل في تحميل طلبات التعديل');
      }

      setState(prev => ({
        ...prev,
        overrides: data.overrides || [],
        stats: data.stats || null,
        loading: false
      }));

    } catch (err) {
      console.error('Error loading overrides:', err);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'خطأ غير معروف',
        loading: false
      }));
    }
  };

  const handleOverrideAction = async (overrideId: string, action: 'approve' | 'reject' | 'counter', counterPrice?: number, reason?: string) => {
    try {
      setState(prev => ({ ...prev, updating: overrideId }));

      const response = await fetch(`/api/admin/overrides/${overrideId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          counterPrice,
          reason: reason || `${action === 'approve' ? 'موافقة' : action === 'reject' ? 'رفض' : 'اقتراح بديل'} على طلب التعديل`
        })
      });

      if (!response.ok) {
        throw new Error('فشل في تحديث طلب التعديل');
      }

      // Reload data
      await loadData();

    } catch (err) {
      console.error('Error updating override:', err);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'خطأ في التحديث'
      }));
    } finally {
      setState(prev => ({ ...prev, updating: null }));
    }
  };

  // دالة للانتقال للعرض المتقدم (محجوزة للاستخدام المستقبلي)
  // const goToAdvancedView = () => {
  //   router.push('/admin/overrides/advanced');
  // };

  // دالة للتبديل بين الأنواع
  const switchToType = (type: 'basic' | 'advanced') => {
    setState(prev => ({ ...prev, selectedType: type }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'approved': return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      case 'countered': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'approved': return <CheckCircle size={16} />;
      case 'rejected': return <XCircle size={16} />;
      case 'countered': return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  if (state.loading && state.overrides.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader />
            <p className="mt-4 text-[var(--muted)]">جاري تحميل طلبات التعديل...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <Breadcrumbs />
      
      {/* Header */}
      <SectionHeading
        title="التعديلات المتقدمة"
        description="إدارة متقدمة لطلبات تعديل الأسعار والموافقات متعددة المستويات"
        actions={
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => switchToType('basic')}
              className={state.selectedType === 'basic' ? 'bg-[var(--accent-bg)] border-[var(--accent-500)]' : ''}
            >
              <DollarSign size={16} />
              التعديلات الأساسية
            </Button>
            <Button 
              variant="outline"
              onClick={() => switchToType('advanced')}
              className={state.selectedType === 'advanced' ? 'bg-[var(--accent-bg)] border-[var(--accent-500)]' : ''}
            >
              <AlertTriangle size={16} />
              التعديلات المتقدمة
            </Button>
            <Button variant="secondary" onClick={loadData} disabled={state.loading}>
              <RefreshCw size={16} className={state.loading ? "animate-spin" : ""} />
              تحديث
            </Button>
          </div>
        }
      />

      {/* فلاتر البحث */}
      <div className="mb-6 bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">الحالة</label>
            <Dropdown
              options={[
                { value: 'all', label: 'جميع الحالات' },
                { value: 'pending', label: 'في الانتظار' },
                { value: 'approved', label: 'مُوافق عليه' },
                { value: 'rejected', label: 'مرفوض' },
                { value: 'countered', label: 'عرض مضاد' },
                { value: 'expired', label: 'منتهي الصلاحية' }
              ]}
              value={state.selectedStatus}
              onChange={(value) => setState(prev => ({ ...prev, selectedStatus: value }))}
              placeholder="اختر الحالة"
            />
          </div>
          
          {(state.selectedType === 'advanced' || state.selectedType === 'all') && (
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">مستوى المخاطر</label>
              <Dropdown
                options={[
                  { value: 'all', label: 'جميع المستويات' },
                  { value: 'low', label: 'منخفض' },
                  { value: 'medium', label: 'متوسط' },
                  { value: 'high', label: 'عالي' },
                  { value: 'critical', label: 'حرج' }
                ]}
                value={state.selectedRiskLevel}
                onChange={(value) => setState(prev => ({ ...prev, selectedRiskLevel: value }))}
                placeholder="اختر المستوى"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">البحث</label>
            <div className="relative">
              <Search size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--muted)]" />
              <input
                type="text"
                placeholder="البحث في الطلبات..."
                value={state.searchTerm}
                onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="w-full pr-10 pl-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
              />
            </div>
          </div>

          <div className="flex items-end">
            <Button
              variant="primary"
              onClick={() => setState(prev => ({ ...prev, showCreateForm: true }))}
              className="w-full"
            >
              <Plus size={16} />
              طلب جديد
            </Button>
          </div>
        </div>
      </div>
      {/* Error Display */}
      {state.error && (
        <div className="mb-6 p-4 bg-[var(--danger-bg)] border border-[var(--danger-border)] rounded-[var(--radius)]">
          <div className="flex items-center gap-2 text-[var(--danger-fg)]">
            <AlertCircle size={20} />
            <span className="font-medium">{state.error}</span>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      {state.stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[var(--card)] p-4 rounded-[var(--radius)] border border-[var(--elev)]">
            <div className="flex items-center gap-3">
              <Clock className="text-yellow-500" size={20} />
              <div>
                <p className="text-sm text-[var(--muted)]">معلق</p>
                <p className="font-bold text-[var(--text)]">{state.stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card)] p-4 rounded-[var(--radius)] border border-[var(--elev)]">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-500" size={20} />
              <div>
                <p className="text-sm text-[var(--muted)]">موافق عليه</p>
                <p className="font-bold text-[var(--text)]">{state.stats.approved}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card)] p-4 rounded-[var(--radius)] border border-[var(--elev)]">
            <div className="flex items-center gap-3">
              <XCircle className="text-red-500" size={20} />
              <div>
                <p className="text-sm text-[var(--muted)]">مرفوض</p>
                <p className="font-bold text-[var(--text)]">{state.stats.rejected}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card)] p-4 rounded-[var(--radius)] border border-[var(--elev)]">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-[var(--accent-500)]" size={20} />
              <div>
                <p className="text-sm text-[var(--muted)]">متوسط التغيير</p>
                <p className="font-bold text-[var(--text)]">
                  {state.stats.avgChangePercent > 0 ? '+' : ''}{state.stats.avgChangePercent.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Filter */}
      <div className="mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-[var(--text)]">تصفية حسب الحالة:</span>
          {['all', 'pending', 'approved', 'rejected', 'countered'].map((status) => (
            <button
              key={status}
              onClick={() => setState(prev => ({ ...prev, selectedStatus: status }))}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                state.selectedStatus === status
                  ? 'bg-[var(--accent-500)] text-white'
                  : 'bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--elev)] border border-[var(--elev)]'
              }`}
            >
              {status === 'all' ? 'الكل' :
               status === 'pending' ? 'معلق' :
               status === 'approved' ? 'موافق عليه' :
               status === 'rejected' ? 'مرفوض' :
               'اقتراح بديل'}
            </button>
          ))}
        </div>
      </div>

      {/* Overrides List */}
      <div className="bg-[var(--card)] border border-[var(--elev)] rounded-[var(--radius)]">
        <div className="p-4 border-b border-[var(--elev)]">
          <h3 className="font-bold text-[var(--text)]">طلبات التعديل</h3>
          <p className="text-sm text-[var(--muted)]">
            مراجعة طلبات المبدعين لتعديل الأسعار
          </p>
        </div>
        
        <div className="divide-y divide-[var(--elev)]">
          {state.overrides.map((override) => (
            <div key={override.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-[var(--text)]">
                      {override.creatorEmail}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(override.status)}`}>
                      {getStatusIcon(override.status)}
                      <span className="mr-1">
                        {override.status === 'pending' ? 'معلق' :
                         override.status === 'approved' ? 'موافق عليه' :
                         override.status === 'rejected' ? 'مرفوض' :
                         'اقتراح بديل'}
                      </span>
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-[var(--muted)] mb-1">الفئة الفرعية:</p>
                      <p className="text-sm text-[var(--text)]">{override.subcategoryId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--muted)] mb-1">المحور:</p>
                      <p className="text-sm text-[var(--text)]">{override.vertical}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mb-3">
                    <div>
                      <p className="text-xs text-[var(--muted)]">السعر الحالي:</p>
                      <p className="font-medium text-[var(--text)]">
                        {override.currentPriceIQD.toLocaleString('ar-IQ')} د.ع
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {override.changePercent > 0 ? (
                        <TrendingUp size={16} className="text-green-600" />
                      ) : (
                        <TrendingDown size={16} className="text-red-600" />
                      )}
                      <div>
                        <p className="text-xs text-[var(--muted)]">السعر المطلوب:</p>
                        <p className="font-bold text-[var(--text)]">
                          {override.requestedPriceIQD.toLocaleString('ar-IQ')} د.ع
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--muted)]">نسبة التغيير:</p>
                      <p className={`font-bold ${override.changePercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {override.changePercent > 0 ? '+' : ''}{override.changePercent.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="bg-[var(--bg)] p-3 rounded border mb-3">
                    <p className="text-xs text-[var(--muted)] mb-1">سبب الطلب:</p>
                    <p className="text-sm text-[var(--text)]">{override.reason}</p>
                  </div>

                  {override.adminResponse && (
                    <div className="bg-blue-50 p-3 rounded border border-blue-200 mb-3">
                      <p className="text-xs text-blue-600 mb-1">رد الإدارة:</p>
                      <p className="text-sm text-blue-800">{override.adminResponse.reason}</p>
                      {override.adminResponse.counterPriceIQD && (
                        <p className="text-sm font-medium text-blue-800 mt-1">
                          السعر المقترح: {override.adminResponse.counterPriceIQD.toLocaleString('ar-IQ')} د.ع
                        </p>
                      )}
                    </div>
                  )}

                  <div className="text-xs text-[var(--muted)]">
                    تاريخ الطلب: {formatDate(override.createdAt)}
                    {override.adminResponse && (
                      <span className="mr-4">
                        رد الإدارة: {formatDate(override.adminResponse.decidedAt)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {override.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOverrideAction(override.id, 'approve')}
                      disabled={state.updating === override.id}
                    >
                      <CheckCircle size={14} />
                      موافقة
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOverrideAction(override.id, 'reject', undefined, 'لا يتوافق مع سياسة التسعير')}
                      disabled={state.updating === override.id}
                    >
                      <XCircle size={14} />
                      رفض
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {state.overrides.length === 0 && !state.loading && (
          <div className="p-8 text-center">
            <DollarSign size={48} className="mx-auto mb-4 text-[var(--muted)]" />
            <h3 className="text-lg font-medium text-[var(--text)] mb-2">لا توجد طلبات تعديل</h3>
            <p className="text-[var(--muted)]">
              {state.selectedStatus === 'all' 
                ? 'لم يتم تقديم أي طلبات تعديل حتى الآن'
                : `لا توجد طلبات ${
                    state.selectedStatus === 'pending' ? 'معلقة' :
                    state.selectedStatus === 'approved' ? 'موافق عليها' :
                    state.selectedStatus === 'rejected' ? 'مرفوضة' :
                    'مقترحة بديلة'
                  }`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
