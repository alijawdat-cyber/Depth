"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { 
  DollarSign,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  RefreshCw,
  Eye,
  Edit3,
  Calendar,
  Target,
  TrendingUp,
  FileText,
  Star,
  Timer
} from 'lucide-react';

interface CreatorOverride {
  id: string;
  deliverable: string;
  deliverableName: string;
  vertical?: string;
  verticalName: string;
  processing: string;
  conditions: string;
  priority: string;
  currentPriceIQD: number | null;
  requestedPriceIQD: number;
  requestedPriceUSD: number | null;
  reason: string;
  justification?: string;
  validUntil?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  maxUsage?: number;
  isActive: boolean;
}

interface OverrideStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  active: number;
}

export default function CreatorOverridesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [overrides, setOverrides] = useState<CreatorOverride[]>([]);
  const [stats, setStats] = useState<OverrideStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    active: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // فلاتر
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadOverrides = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      params.append('limit', '50');
      
      const response = await fetch(`/api/creators/overrides?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setOverrides(data.overrides || []);
        setStats(data.stats || { total: 0, pending: 0, approved: 0, rejected: 0, active: 0 });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'فشل في جلب طلبات التعديل');
      }
    } catch (error) {
      setError('حدث خطأ في الاتصال');
      console.error('Failed to load overrides:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  // التحقق من الجلسة
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin?from=creators/overrides');
      return;
    }

    if (session.user.role !== 'creator') {
      router.push('/portal');
      return;
    }

    loadOverrides();
  }, [session, status, router, statusFilter, loadOverrides]);

  // فلترة طلبات Override
  const filteredOverrides = overrides.filter(override => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return override.deliverableName.toLowerCase().includes(searchLower) ||
             override.verticalName.toLowerCase().includes(searchLower) ||
             override.reason.toLowerCase().includes(searchLower);
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'approved': return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'قيد المراجعة';
      case 'approved': return 'معتمد';
      case 'rejected': return 'مرفوض';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'approved': return <CheckCircle size={16} />;
      case 'rejected': return <XCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'rush': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'normal': return 'text-blue-600 bg-blue-50';
      case 'low': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'rush': return 'عاجل';
      case 'high': return 'عالي';
      case 'normal': return 'عادي';
      case 'low': return 'منخفض';
      default: return priority;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-EG').format(amount) + ' د.ع';
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const calculatePriceChange = (current: number | null, requested: number) => {
    if (!current) return { percentage: 0, isIncrease: true };
    const change = ((requested - current) / current) * 100;
    return {
      percentage: Math.abs(change),
      isIncrease: change > 0
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] py-8">
        <Container>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-500)] mx-auto mb-4"></div>
            <p className="text-[var(--muted)]">جاري تحميل طلبات التعديل...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <Container>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-[var(--text)] mb-2">طلبات تعديل الأسعار</h1>
                <p className="text-[var(--muted)]">إدارة طلبات Override للأسعار الخاصة</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={loadOverrides}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                  تحديث
                </Button>
                <Button
                  variant="primary"
                  onClick={() => router.push('/creators/overrides/new')}
                  className="flex items-center gap-2"
                >
                  <Plus size={20} />
                  طلب جديد
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-[var(--card)] p-4 rounded-lg border border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <FileText size={24} className="text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-[var(--text)]">{stats.total}</p>
                    <p className="text-sm text-[var(--muted)]">إجمالي الطلبات</p>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--card)] p-4 rounded-lg border border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <Clock size={24} className="text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-[var(--text)]">{stats.pending}</p>
                    <p className="text-sm text-[var(--muted)]">قيد المراجعة</p>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--card)] p-4 rounded-lg border border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <CheckCircle size={24} className="text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-[var(--text)]">{stats.approved}</p>
                    <p className="text-sm text-[var(--muted)]">معتمدة</p>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--card)] p-4 rounded-lg border border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <Star size={24} className="text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-[var(--text)]">{stats.active}</p>
                    <p className="text-sm text-[var(--muted)]">نشطة</p>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--card)] p-4 rounded-lg border border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <XCircle size={24} className="text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-[var(--text)]">{stats.rejected}</p>
                    <p className="text-sm text-[var(--muted)]">مرفوضة</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center mb-6">
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-[var(--muted)]" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="pending">قيد المراجعة</option>
                  <option value="approved">معتمدة</option>
                  <option value="rejected">مرفوضة</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Search size={20} className="text-[var(--muted)]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                  placeholder="البحث في الطلبات..."
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle size={20} />
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Overrides List */}
          {filteredOverrides.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign size={64} className="text-[var(--muted)] mx-auto mb-4" />
              <h3 className="text-xl font-medium text-[var(--text)] mb-2">لا توجد طلبات تعديل</h3>
              <p className="text-[var(--muted)] mb-6">
                {statusFilter === 'all' 
                  ? 'لم تقم بإنشاء أي طلبات تعديل للأسعار بعد'
                  : `لا توجد طلبات ${getStatusText(statusFilter)}`
                }
              </p>
              <Button
                variant="primary"
                onClick={() => router.push('/creators/overrides/new')}
                className="flex items-center gap-2"
              >
                <Plus size={20} />
                إنشاء طلب جديد
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOverrides.map((override, index) => {
                const priceChange = calculatePriceChange(override.currentPriceIQD, override.requestedPriceIQD);
                
                return (
                  <motion.div
                    key={override.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-[var(--text)]">
                            {override.deliverableName}
                          </h3>
                          
                          {override.verticalName !== 'عام' && (
                            <span className="px-2 py-1 rounded text-xs font-medium text-blue-600 bg-blue-50">
                              {override.verticalName}
                            </span>
                          )}
                          
                          {/* Status Badge */}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(override.status)}`}>
                            {getStatusIcon(override.status)}
                            {getStatusText(override.status)}
                          </span>

                          {/* Priority Badge */}
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(override.priority)}`}>
                            {getPriorityText(override.priority)}
                          </span>

                          {/* Active Badge */}
                          {override.isActive && (
                            <span className="px-2 py-1 rounded text-xs font-medium text-green-600 bg-green-50">
                              نشط
                            </span>
                          )}
                        </div>

                        <p className="text-[var(--muted)] mb-3">{override.reason}</p>

                        <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
                          <div className="flex items-center gap-1">
                            <Target size={16} />
                            {override.processing} - {override.conditions}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            {formatDate(override.createdAt)}
                          </div>

                          {override.validUntil && (
                            <div className="flex items-center gap-1">
                              <Timer size={16} />
                              صالح حتى: {formatDate(override.validUntil)}
                            </div>
                          )}

                          {override.maxUsage && (
                            <div className="flex items-center gap-1">
                              <TrendingUp size={16} />
                              {override.usageCount}/{override.maxUsage} استخدام
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/creators/overrides/${override.id}`)}
                          className="flex items-center gap-1"
                        >
                          <Eye size={16} />
                          عرض
                        </Button>
                        
                        {override.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/creators/overrides/${override.id}/edit`)}
                            className="flex items-center gap-1"
                          >
                            <Edit3 size={16} />
                            تعديل
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Price Comparison */}
                    <div className="bg-[var(--bg)] rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-[var(--muted)] mb-1">السعر الحالي</p>
                          <p className="text-lg font-semibold text-[var(--text)]">
                            {override.currentPriceIQD ? formatCurrency(override.currentPriceIQD) : 'غير محدد'}
                          </p>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <TrendingUp 
                              size={16} 
                              className={priceChange.isIncrease ? 'text-red-500' : 'text-green-500'} 
                            />
                            <span className={`text-sm font-medium ml-1 ${
                              priceChange.isIncrease ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {priceChange.isIncrease ? '+' : '-'}{priceChange.percentage.toFixed(1)}%
                            </span>
                          </div>
                          <p className="text-xs text-[var(--muted)]">التغيير</p>
                        </div>

                        <div className="text-center">
                          <p className="text-sm text-[var(--muted)] mb-1">السعر المطلوب</p>
                          <p className="text-lg font-semibold text-[var(--accent-600)]">
                            {formatCurrency(override.requestedPriceIQD)}
                          </p>
                          {override.requestedPriceUSD && (
                            <p className="text-xs text-[var(--muted)]">
                              ~${override.requestedPriceUSD}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Admin Notes */}
                    {override.adminNotes && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                        <div className="flex items-start gap-2">
                          <AlertCircle size={16} className="text-yellow-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-yellow-800">ملاحظات الإدارة:</p>
                            <p className="text-sm text-yellow-700 mt-1">{override.adminNotes}</p>
                            {override.reviewedBy && override.reviewedAt && (
                              <p className="text-xs text-yellow-600 mt-2">
                                بواسطة {override.reviewedBy} - {formatDate(override.reviewedAt)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Justification */}
                    {override.justification && (
                      <div className="border-t border-[var(--border)] pt-3">
                        <p className="text-sm text-[var(--muted)] mb-1">التبرير:</p>
                        <p className="text-sm text-[var(--text)]">{override.justification}</p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
