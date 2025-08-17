"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import Loader from "@/components/loaders/Loader";
import { useSession } from "next-auth/react";
import { 
  GitBranch, 
  Calendar, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Eye,
  Archive,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Plus
} from "lucide-react";
import { 
  RateCardVersion, 
  GovernanceStats, 
  VersionDiff,
  AuditLogEntry 
} from "@/types/governance";
import CreateVersionModal from "@/components/governance/CreateVersionModal";

interface GovernancePageState {
  versions: RateCardVersion[];
  stats: GovernanceStats | null;
  selectedVersions: string[];
  diff: VersionDiff | null;
  auditLog: AuditLogEntry[];
  loading: boolean;
  error: string | null;
  showCreateForm: boolean;
}

export default function GovernancePage() {
  const { data: session, status } = useSession();
  const [state, setState] = useState<GovernancePageState>({
    versions: [],
    stats: null,
    selectedVersions: [],
    diff: null,
    auditLog: [],
    loading: true,
    error: null,
    showCreateForm: false
  });

  const userRole = (session?.user && (session.user as { role?: string })?.role) || 'client';
  const isAdmin = userRole === 'admin';

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Load versions and stats
      const versionsResponse = await fetch('/api/governance/versions');
      if (!versionsResponse.ok) {
        if (versionsResponse.status === 401) {
          throw new Error('صلاحيات غير كافية للوصول إلى صفحة الحوكمة');
        } else if (versionsResponse.status === 500) {
          const errorData = await versionsResponse.json().catch(() => ({}));
          throw new Error(`خطأ في الخادم: ${errorData.error || 'مشكلة تقنية'}`);
        }
        const errorData = await versionsResponse.json().catch(() => ({}));
        throw new Error(errorData.error || `خطأ HTTP ${versionsResponse.status}`);
      }
      const versionsData = await versionsResponse.json();

      // Load recent audit log
      const auditResponse = await fetch('/api/governance/audit?limit=20');
      const auditData = auditResponse.ok ? await auditResponse.json() : { entries: [] };

      setState(prev => ({
        ...prev,
        versions: versionsData.versions || [],
        stats: versionsData.stats || null,
        auditLog: auditData.entries || [],
        loading: false
      }));

    } catch (err) {
      console.error('Error loading governance data:', err);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'خطأ غير معروف',
        loading: false
      }));
    }
  };

  const handleVersionSelect = (versionId: string) => {
    setState(prev => {
      const selected = prev.selectedVersions.includes(versionId)
        ? prev.selectedVersions.filter(id => id !== versionId)
        : [...prev.selectedVersions, versionId].slice(-2); // Max 2 selections for diff

      return { ...prev, selectedVersions: selected };
    });
  };

  const handleCompareVersions = async () => {
    if (state.selectedVersions.length !== 2) return;

    try {
      setState(prev => ({ ...prev, loading: true }));

      const response = await fetch('/api/governance/versions/diff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromVersionId: state.selectedVersions[0],
          toVersionId: state.selectedVersions[1]
        })
      });

      if (!response.ok) {
        throw new Error('فشل في مقارنة الإصدارات');
      }

      const diffData = await response.json();
      setState(prev => ({ ...prev, diff: diffData.diff, loading: false }));

    } catch (err) {
      console.error('Error comparing versions:', err);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'خطأ في المقارنة',
        loading: false
      }));
    }
  };

  const handleVersionStatusChange = async (versionId: string, newStatus: 'active' | 'archived') => {
    try {
      const response = await fetch('/api/governance/versions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: versionId,
          status: newStatus,
          reason: newStatus === 'active' ? 'تفعيل الإصدار' : 'أرشفة الإصدار'
        })
      });

      if (!response.ok) {
        throw new Error('فشل في تحديث حالة الإصدار');
      }

      // Reload data
      await loadData();

    } catch (err) {
      console.error('Error updating version status:', err);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'خطأ في التحديث'
      }));
    }
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
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'draft': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'archived': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} />;
      case 'draft': return <Clock size={16} />;
      case 'archived': return <Archive size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  // تحقق من حالة تسجيل الدخول والصلاحيات
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-[var(--muted)]">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2">تسجيل الدخول مطلوب</h2>
          <p className="text-[var(--muted)]">يجب تسجيل الدخول للوصول إلى صفحة الحوكمة</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2">غير مسموح</h2>
          <p className="text-[var(--muted)]">هذه الصفحة مخصصة للإدمن فقط</p>
        </div>
      </div>
    );
  }

  if (state.loading && state.versions.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader />
            <p className="mt-4 text-[var(--muted)]">جاري تحميل بيانات الحوكمة...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">الحوكمة والإصدارات</h1>
          <p className="text-[var(--muted)]">إدارة إصدارات جدول الأسعار ومراجعة التغييرات</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={loadData} disabled={state.loading}>
            <RefreshCw size={16} className={state.loading ? "animate-spin" : ""} />
            تحديث
          </Button>
          <Button onClick={() => setState(prev => ({ ...prev, showCreateForm: true }))}>
            <Plus size={16} />
            إصدار جديد
          </Button>
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
              <GitBranch className="text-[var(--accent-500)]" size={20} />
              <div>
                <p className="text-sm text-[var(--muted)]">الإصدار النشط</p>
                <p className="font-bold text-[var(--text)]">{state.stats.activeVersion}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card)] p-4 rounded-[var(--radius)] border border-[var(--elev)]">
            <div className="flex items-center gap-3">
              <Calendar className="text-[var(--accent-500)]" size={20} />
              <div>
                <p className="text-sm text-[var(--muted)]">إجمالي الإصدارات</p>
                <p className="font-bold text-[var(--text)]">{state.stats.totalVersions}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card)] p-4 rounded-[var(--radius)] border border-[var(--elev)]">
            <div className="flex items-center gap-3">
              <Clock className="text-[var(--accent-500)]" size={20} />
              <div>
                <p className="text-sm text-[var(--muted)]">العروض المعلقة</p>
                <p className="font-bold text-[var(--text)]">{state.stats.pendingQuotes}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card)] p-4 rounded-[var(--radius)] border border-[var(--elev)]">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-[var(--accent-500)]" size={20} />
              <div>
                <p className="text-sm text-[var(--muted)]">نشاط الأسبوع</p>
                <p className="font-bold text-[var(--text)]">{state.stats.recentAuditCount}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Version Comparison */}
      {state.selectedVersions.length === 2 && (
        <div className="mb-8 p-4 bg-[var(--accent-200)] border border-[var(--accent-300)] rounded-[var(--radius)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-[var(--accent-700)]" />
              <span className="text-[var(--accent-700)] font-medium">
                مقارنة إصدارين محددين
              </span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCompareVersions}
              disabled={state.loading}
            >
              مقارنة الآن
            </Button>
          </div>
        </div>
      )}

      {/* Version Diff Display */}
      {state.diff && (
        <div className="mb-8 bg-[var(--card)] border border-[var(--elev)] rounded-[var(--radius)]">
          <div className="p-4 border-b border-[var(--elev)]">
            <h3 className="font-bold text-[var(--text)] mb-2">مقارنة الإصدارات</h3>
            <p className="text-sm text-[var(--muted)]">
              من {state.diff.versionFrom} إلى {state.diff.versionTo}
            </p>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-[var(--text)]">{state.diff.summary.totalChanges}</p>
                <p className="text-sm text-[var(--muted)]">إجمالي التغييرات</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{state.diff.summary.increasedCount}</p>
                <p className="text-sm text-[var(--muted)]">زيادات</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{state.diff.summary.decreasedCount}</p>
                <p className="text-sm text-[var(--muted)]">انخفاضات</p>
              </div>
            </div>

            {/* Changes List */}
            {state.diff.changes.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-[var(--text)] mb-2">تفاصيل التغييرات:</h4>
                {state.diff.changes.slice(0, 10).map((change, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-[var(--bg)] rounded">
                    <div className="flex items-center gap-2">
                      {change.changePercent > 0 ? (
                        <TrendingUp size={16} className="text-green-600" />
                      ) : (
                        <TrendingDown size={16} className="text-red-600" />
                      )}
                      <span className="text-sm text-[var(--text)]">
                        {change.subcategoryId || change.vertical || change.processing}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-[var(--muted)]">{change.oldValue} →</span>
                      <span className="font-medium text-[var(--text)] mx-1">{change.newValue}</span>
                      <span className={change.changePercent > 0 ? "text-green-600" : "text-red-600"}>
                        ({change.changePercent > 0 ? '+' : ''}{change.changePercent.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Versions List */}
      <div className="bg-[var(--card)] border border-[var(--elev)] rounded-[var(--radius)]">
        <div className="p-4 border-b border-[var(--elev)]">
          <h3 className="font-bold text-[var(--text)]">قائمة الإصدارات</h3>
          <p className="text-sm text-[var(--muted)]">
            اختر إصدارين لمقارنتهما، أو قم بتغيير حالة الإصدار
          </p>
        </div>
        
        <div className="divide-y divide-[var(--elev)]">
          {state.versions.map((version) => (
            <div key={version.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={state.selectedVersions.includes(version.id)}
                    onChange={() => handleVersionSelect(version.id)}
                    className="rounded border-[var(--elev)]"
                    disabled={state.selectedVersions.length >= 2 && !state.selectedVersions.includes(version.id)}
                  />
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[var(--text)]">{version.versionId}</span>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(version.status)}`}>
                        {getStatusIcon(version.status)}
                        <span className="mr-1">
                          {version.status === 'active' ? 'نشط' : 
                           version.status === 'draft' ? 'مسودة' : 'مؤرشف'}
                        </span>
                      </span>
                    </div>
                    
                    <p className="text-sm text-[var(--muted)] mb-1">
                      {version.reason || 'لا يوجد سبب محدد'}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
                      <span>تاريخ الإنشاء: {formatDate(version.createdAt)}</span>
                      <span>بواسطة: {version.createdBy}</span>
                      {version.effectiveFrom && (
                        <span>سريان من: {formatDate(version.effectiveFrom)}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {version.status === 'draft' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleVersionStatusChange(version.id, 'active')}
                    >
                      تفعيل
                    </Button>
                  )}
                  
                  {version.status === 'active' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVersionStatusChange(version.id, 'archived')}
                    >
                      أرشفة
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {state.versions.length === 0 && !state.loading && (
          <div className="p-8 text-center">
            <GitBranch size={48} className="mx-auto mb-4 text-[var(--muted)]" />
            <h3 className="text-lg font-medium text-[var(--text)] mb-2">لا توجد إصدارات</h3>
            <p className="text-[var(--muted)] mb-4">ابدأ بإنشاء أول إصدار لجدول الأسعار</p>
            <Button onClick={() => setState(prev => ({ ...prev, showCreateForm: true }))}>
              إنشاء إصدار جديد
            </Button>
          </div>
        )}
      </div>

      {/* Create Version Modal */}
      <CreateVersionModal
        isOpen={state.showCreateForm}
        onClose={() => setState(prev => ({ ...prev, showCreateForm: false }))}
        onSuccess={loadData}
      />
    </div>
  );
}
