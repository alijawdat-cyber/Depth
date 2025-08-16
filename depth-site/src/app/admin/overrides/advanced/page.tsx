"use client";

// نظام التعديلات المتقدم - متوافق مع docs/roles/admin/05-Rate-Override-Policy.md
// الغرض: إدارة طلبات تعديل الأسعار مع سير عمل الموافقات وتتبع الأسباب

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Dropdown from '@/components/ui/Dropdown';
import SectionHeading from '@/components/ui/SectionHeading';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
// import ResponsiveTable, { DefaultCard } from '@/components/ui/ResponsiveTable'; // TODO: سيتم تطبيقها لاحقاً
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  User,
  TrendingDown,
  Eye,
  Send,
  ArrowLeft,
  Filter
} from 'lucide-react';

interface PriceOverrideRequest {
  id: string;
  quoteId: string;
  clientName: string;
  requestedBy: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  
  // Override Details
  originalPrice: number;
  requestedPrice: number;
  discountAmount: number;
  discountPercentage: number;
  
  // Justification
  reason: 'competitive_match' | 'volume_discount' | 'strategic_client' | 'market_penetration' | 'relationship_building' | 'other';
  justification: string;
  competitorPrice?: number;
  expectedVolume?: number;
  strategicValue?: string;
  
  // Risk Assessment
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  marginImpact: number;
  profitabilityRisk: string;
  
  // Approval Workflow
  approvals: {
    level: 'manager' | 'director' | 'ceo';
    approver: string;
    status: 'pending' | 'approved' | 'rejected';
    timestamp?: string;
    notes?: string;
  }[];
  
  // Conditions & Limitations
  conditions: string[];
  expiryDate?: string;
  usageLimit?: number;
  usageCount?: number;
  
  // Audit Trail
  auditLog: {
    action: string;
    user: string;
    timestamp: string;
    details: Record<string, unknown>;
  }[];
}

const OVERRIDE_REASONS = [
  { value: 'competitive_match', label: 'مطابقة المنافسين' },
  { value: 'volume_discount', label: 'تخفيض الكمية' },
  { value: 'strategic_client', label: 'عميل استراتيجي' },
  { value: 'market_penetration', label: 'اختراق السوق' },
  { value: 'relationship_building', label: 'بناء العلاقات' },
  { value: 'other', label: 'أخرى' }
];

const RISK_LEVELS = [
  { value: 'low', label: 'منخفض', color: 'text-green-600' },
  { value: 'medium', label: 'متوسط', color: 'text-yellow-600' },
  { value: 'high', label: 'عالي', color: 'text-orange-600' },
  { value: 'critical', label: 'حرج', color: 'text-red-600' }
];

export default function AdvancedOverridesPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Data state
  const [overrideRequests, setOverrideRequests] = useState<PriceOverrideRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<PriceOverrideRequest | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  // New request form
  const [newRequest, setNewRequest] = useState<Partial<PriceOverrideRequest>>({
    reason: 'competitive_match',
    justification: '',
    conditions: [],
    riskLevel: 'medium'
  });

  const loadOverrideRequests = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: statusFilter,
        riskLevel: riskFilter,
        dateRange
      });

      const response = await fetch(`/api/admin/overrides/advanced?${params}`);
      if (!response.ok) throw new Error('فشل في تحميل طلبات التعديل');
      
      const data = await response.json();
      setOverrideRequests(data.requests);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ في التحميل');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, riskFilter, dateRange]);

  useEffect(() => {
    loadOverrideRequests();
  }, [loadOverrideRequests]);



  const handleCreateRequest = async () => {
    try {
      setSaving(true);
      setError(null);

      // Calculate risk assessment
      const riskAssessment = calculateRiskAssessment(newRequest);

      const requestData = {
        ...newRequest,
        ...riskAssessment,
        requestedBy: session?.user?.email,
        requestedAt: new Date().toISOString(),
        status: 'pending',
        approvals: determineApprovalWorkflow(riskAssessment.riskLevel),
        auditLog: [{
          action: 'request_created',
          user: session?.user?.email || '',
          timestamp: new Date().toISOString(),
          details: { reason: newRequest.reason }
        }]
      };

      const response = await fetch('/api/admin/overrides/advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request: requestData })
      });

      if (!response.ok) throw new Error('فشل في إنشاء طلب التعديل');

      const result = await response.json();
      setOverrideRequests(prev => [result.request, ...prev]);
      setShowCreateForm(false);
      setNewRequest({
        reason: 'competitive_match',
        justification: '',
        conditions: [],
        riskLevel: 'medium'
      });
      setSuccess('تم إنشاء طلب التعديل بنجاح');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setSaving(false);
    }
  };

  const handleApproveRequest = async (requestId: string, level: string, notes?: string) => {
    try {
      setSaving(true);
      
      const response = await fetch(`/api/admin/overrides/advanced/${requestId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          level, 
          notes,
          approver: session?.user?.email 
        })
      });

      if (!response.ok) throw new Error('فشل في الموافقة على الطلب');

      const result = await response.json();
      setOverrideRequests(prev => 
        prev.map(req => req.id === requestId ? result.request : req)
      );
      setSuccess('تم الموافقة على الطلب');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setSaving(false);
    }
  };

  const handleRejectRequest = async (requestId: string, level: string, notes: string) => {
    try {
      setSaving(true);
      
      const response = await fetch(`/api/admin/overrides/advanced/${requestId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          level, 
          notes,
          approver: session?.user?.email 
        })
      });

      if (!response.ok) throw new Error('فشل في رفض الطلب');

      const result = await response.json();
      setOverrideRequests(prev => 
        prev.map(req => req.id === requestId ? result.request : req)
      );
      setSuccess('تم رفض الطلب');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setSaving(false);
    }
  };

  const calculateRiskAssessment = (request: Partial<PriceOverrideRequest>) => {
    const originalPrice = request.originalPrice || 0;
    const requestedPrice = request.requestedPrice || 0;
    const discountAmount = originalPrice - requestedPrice;
    const discountPercentage = originalPrice > 0 ? (discountAmount / originalPrice) : 0;
    
    // Calculate margin impact
    const marginImpact = discountPercentage;
    
    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (discountPercentage > 0.30) riskLevel = 'critical';
    else if (discountPercentage > 0.20) riskLevel = 'high';
    else if (discountPercentage > 0.10) riskLevel = 'medium';

    // Generate profitability risk assessment
    const profitabilityRisk = discountPercentage > 0.25 
      ? 'خطر عالي على الربحية - قد يؤثر على الهوامش'
      : discountPercentage > 0.15
      ? 'خطر متوسط - مراقبة مطلوبة'
      : 'خطر منخفض - ضمن الحدود المقبولة';

    return {
      discountAmount,
      discountPercentage,
      marginImpact,
      riskLevel,
      profitabilityRisk
    };
  };

  const determineApprovalWorkflow = (riskLevel: string) => {
    const approvals: { level: 'manager' | 'director' | 'ceo'; approver: string; status: 'pending' }[] = [
      { level: 'manager' as const, approver: '', status: 'pending' as const }
    ];

    if (riskLevel === 'high' || riskLevel === 'critical') {
      approvals.push({ level: 'director' as const, approver: '', status: 'pending' as const });
    }

    if (riskLevel === 'critical') {
      approvals.push({ level: 'ceo' as const, approver: '', status: 'pending' as const });
    }

    return approvals;
  };

  const getRiskLevelDisplay = (level: string) => {
    const risk = RISK_LEVELS.find(r => r.value === level);
    return risk || { value: level, label: level, color: 'text-gray-600' };
  };

  const getStatusDisplay = (status: string) => {
    const displays = {
      'pending': { label: 'في الانتظار', color: 'text-yellow-600', bg: 'bg-yellow-100' },
      'approved': { label: 'معتمد', color: 'text-green-600', bg: 'bg-green-100' },
      'rejected': { label: 'مرفوض', color: 'text-red-600', bg: 'bg-red-100' },
      'expired': { label: 'منتهي الصلاحية', color: 'text-gray-600', bg: 'bg-gray-100' }
    };
    return displays[status as keyof typeof displays] || displays.pending;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-500)] mx-auto mb-4"></div>
          <p className="text-[var(--muted)]">جاري تحميل طلبات التعديل...</p>
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
        title="نظام التعديلات المتقدم"
        description="إدارة طلبات تعديل الأسعار مع سير عمل الموافقات المتقدم"
        actions={
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowCreateForm(true)}>
              <DollarSign size={16} />
              طلب تعديل جديد
            </Button>
            <Button variant="secondary" onClick={() => router.push('/admin/overrides')}>
              <ArrowLeft size={16} />
              العودة
            </Button>
          </div>
        }
      />

      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 bg-[var(--danger-bg)] border border-[var(--danger-border)] rounded-[var(--radius)]">
          <div className="flex items-center gap-2 text-[var(--danger-fg)]">
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-[var(--success-bg)] border border-[var(--success-border)] rounded-[var(--radius)]">
          <div className="flex items-center gap-2 text-[var(--success-fg)]">
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[var(--muted)]" />
            <span className="text-sm font-medium text-[var(--text)]">تصفية:</span>
          </div>

          <Dropdown
            options={[
              { value: 'all', label: 'جميع الحالات' },
              { value: 'pending', label: 'في الانتظار' },
              { value: 'approved', label: 'معتمد' },
              { value: 'rejected', label: 'مرفوض' },
              { value: 'expired', label: 'منتهي الصلاحية' }
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="الحالة"
          />

          <Dropdown
            options={[
              { value: 'all', label: 'جميع المستويات' },
              ...RISK_LEVELS.map(risk => ({ value: risk.value, label: risk.label }))
            ]}
            value={riskFilter}
            onChange={setRiskFilter}
            placeholder="مستوى المخاطر"
          />

          <Dropdown
            options={[
              { value: 'all', label: 'جميع الفترات' },
              { value: 'today', label: 'اليوم' },
              { value: 'week', label: 'هذا الأسبوع' },
              { value: 'month', label: 'هذا الشهر' },
              { value: 'quarter', label: 'هذا الربع' }
            ]}
            value={dateRange}
            onChange={setDateRange}
            placeholder="الفترة الزمنية"
          />
        </div>
      </div>

      {/* Override Requests Table */}
      <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--elev)]">
              <tr>
                <th className="text-right p-4 font-medium text-[var(--text)]">العميل</th>
                <th className="text-right p-4 font-medium text-[var(--text)]">السعر الأصلي</th>
                <th className="text-right p-4 font-medium text-[var(--text)]">السعر المطلوب</th>
                <th className="text-right p-4 font-medium text-[var(--text)]">التخفيض</th>
                <th className="text-right p-4 font-medium text-[var(--text)]">السبب</th>
                <th className="text-right p-4 font-medium text-[var(--text)]">المخاطر</th>
                <th className="text-right p-4 font-medium text-[var(--text)]">الحالة</th>
                <th className="text-right p-4 font-medium text-[var(--text)]">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {overrideRequests.map((request) => {
                const statusDisplay = getStatusDisplay(request.status);
                const riskDisplay = getRiskLevelDisplay(request.riskLevel);
                
                return (
                  <tr key={request.id} className="border-t border-[var(--elev)]">
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-[var(--text)]">{request.clientName}</div>
                        <div className="text-sm text-[var(--muted)]">طلب: {request.quoteId}</div>
                      </div>
                    </td>
                    <td className="p-4 text-[var(--text)]">
                      {request.originalPrice.toLocaleString()} د.ع
                    </td>
                    <td className="p-4 text-[var(--text)]">
                      {request.requestedPrice.toLocaleString()} د.ع
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <TrendingDown size={14} className="text-red-500" />
                        <span className="font-medium text-red-600">
                          {(request.discountPercentage * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-sm text-[var(--muted)]">
                        {request.discountAmount.toLocaleString()} د.ع
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-[var(--text)]">
                        {OVERRIDE_REASONS.find(r => r.value === request.reason)?.label || request.reason}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${riskDisplay.color} bg-opacity-10`}>
                        {riskDisplay.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusDisplay.color} ${statusDisplay.bg}`}>
                        {statusDisplay.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Eye size={14} />
                          عرض
                        </Button>
                        
                        {request.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-600 hover:bg-green-50"
                              onClick={() => handleApproveRequest(request.id, 'manager')}
                            >
                              <CheckCircle size={14} />
                              موافقة
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => handleRejectRequest(request.id, 'manager', 'مرفوض')}
                            >
                              <AlertTriangle size={14} />
                              رفض
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Request Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-[var(--text)] mb-4">
              طلب تعديل سعر جديد
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">العميل</label>
                  <input
                    type="text"
                    value={newRequest.clientName || ''}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, clientName: e.target.value }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
                    placeholder="اسم العميل"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">رقم العرض</label>
                  <input
                    type="text"
                    value={newRequest.quoteId || ''}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, quoteId: e.target.value }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
                    placeholder="Q-2024-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">السعر الأصلي (د.ع)</label>
                  <input
                    type="number"
                    value={newRequest.originalPrice || ''}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, originalPrice: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">السعر المطلوب (د.ع)</label>
                  <input
                    type="number"
                    value={newRequest.requestedPrice || ''}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, requestedPrice: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">سبب التعديل</label>
                <Dropdown
                  options={OVERRIDE_REASONS}
                  value={newRequest.reason || 'competitive_match'}
                  onChange={(value) => setNewRequest(prev => ({
                    ...prev,
                    reason: value as PriceOverrideRequest['reason']
                  }))}
                  placeholder="اختر السبب"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">التبرير التفصيلي</label>
                <textarea
                  value={newRequest.justification || ''}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, justification: e.target.value }))}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
                  rows={4}
                  placeholder="اشرح بالتفصيل أسباب طلب التعديل..."
                />
              </div>

              {/* Risk Assessment Preview */}
              {newRequest.originalPrice && newRequest.requestedPrice && (
                <div className="p-4 bg-[var(--bg)] rounded-[var(--radius)] border border-[var(--border)]">
                  <h4 className="font-medium text-[var(--text)] mb-2">تقييم المخاطر</h4>
                  {(() => {
                    const assessment = calculateRiskAssessment(newRequest);
                    const riskDisplay = getRiskLevelDisplay(assessment.riskLevel);
                    
                    return (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[var(--muted)]">مبلغ التخفيض:</span>
                          <span className="font-medium text-[var(--text)]">
                            {assessment.discountAmount.toLocaleString()} د.ع
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--muted)]">نسبة التخفيض:</span>
                          <span className="font-medium text-[var(--text)]">
                            {(assessment.discountPercentage * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--muted)]">مستوى المخاطر:</span>
                          <span className={`font-medium ${riskDisplay.color}`}>
                            {riskDisplay.label}
                          </span>
                        </div>
                        <div className="text-xs text-[var(--muted)] mt-2">
                          {assessment.profitabilityRisk}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowCreateForm(false)}>
                إلغاء
              </Button>
              <Button 
                onClick={handleCreateRequest}
                disabled={saving || !newRequest.clientName || !newRequest.originalPrice || !newRequest.requestedPrice}
              >
                <Send size={16} />
                {saving ? 'جاري الإرسال...' : 'إرسال الطلب'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[var(--text)]">
                تفاصيل طلب التعديل: {selectedRequest.quoteId}
              </h3>
              <Button variant="secondary" onClick={() => setSelectedRequest(null)}>
                إغلاق
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Request Info */}
              <div className="space-y-4">
                <div className="p-4 bg-[var(--bg)] rounded-[var(--radius)]">
                  <h4 className="font-medium text-[var(--text)] mb-3">معلومات الطلب</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">العميل:</span>
                      <span className="font-medium text-[var(--text)]">{selectedRequest.clientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">مقدم الطلب:</span>
                      <span className="font-medium text-[var(--text)]">{selectedRequest.requestedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">تاريخ الطلب:</span>
                      <span className="font-medium text-[var(--text)]">
                        {new Date(selectedRequest.requestedAt).toLocaleDateString('ar')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[var(--bg)] rounded-[var(--radius)]">
                  <h4 className="font-medium text-[var(--text)] mb-3">تفاصيل السعر</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">السعر الأصلي:</span>
                      <span className="font-medium text-[var(--text)]">
                        {selectedRequest.originalPrice.toLocaleString()} د.ع
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">السعر المطلوب:</span>
                      <span className="font-medium text-[var(--text)]">
                        {selectedRequest.requestedPrice.toLocaleString()} د.ع
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">مبلغ التخفيض:</span>
                      <span className="font-medium text-red-600">
                        {selectedRequest.discountAmount.toLocaleString()} د.ع
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">نسبة التخفيض:</span>
                      <span className="font-medium text-red-600">
                        {(selectedRequest.discountPercentage * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Approval Workflow */}
              <div className="space-y-4">
                <div className="p-4 bg-[var(--bg)] rounded-[var(--radius)]">
                  <h4 className="font-medium text-[var(--text)] mb-3">سير عمل الموافقات</h4>
                  <div className="space-y-3">
                    {selectedRequest.approvals.map((approval, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border border-[var(--border)] rounded">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-[var(--muted)]" />
                          <span className="text-sm font-medium text-[var(--text)]">
                            {approval.level === 'manager' ? 'مدير' : approval.level === 'director' ? 'مدير عام' : 'الرئيس التنفيذي'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {approval.status === 'approved' && (
                            <CheckCircle size={16} className="text-green-600" />
                          )}
                          {approval.status === 'rejected' && (
                            <AlertTriangle size={16} className="text-red-600" />
                          )}
                          {approval.status === 'pending' && (
                            <Clock size={16} className="text-yellow-600" />
                          )}
                          <span className="text-xs text-[var(--muted)]">
                            {approval.status === 'approved' ? 'موافق' : 
                             approval.status === 'rejected' ? 'مرفوض' : 'في الانتظار'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-[var(--bg)] rounded-[var(--radius)]">
                  <h4 className="font-medium text-[var(--text)] mb-3">التبرير</h4>
                  <p className="text-sm text-[var(--text)]">{selectedRequest.justification}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
