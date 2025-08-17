"use client";

// صفحة التقارير والـ KPIs - Admin
// الوثيقة المرجعية: docs/roles/admin/08-KPIs-and-Reporting.md
// الغرض: مؤشرات الأداء الرئيسية والتقارير التفصيلية

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Dropdown from "@/components/ui/Dropdown";
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { 
  BarChart3,
  LineChart,
  Activity,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Target,
  Calendar,
  Download,
  RefreshCw,
  AlertCircle,
  Filter,
  FileText,
  Eye,
  ArrowUp,
  ArrowDown,
  Minus,
  Star,
  Zap,
  Timer
} from "lucide-react";

// واجهات البيانات
interface KPIMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  description: string;
}

interface ReportData {
  id: string;
  type: 'weekly' | 'monthly' | 'quality' | 'financial' | 'performance';
  title: string;
  period: string;
  generatedAt: string;
  data: Record<string, unknown>;
  insights: string[];
  alerts: ReportAlert[];
}

interface ReportAlert {
  id: string;
  type: 'margin_breach' | 'sla_delay' | 'override_red' | 'fx_change';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details: string;
  timestamp: string;
  resolved: boolean;
}

interface PerformanceData {
  margins: {
    overall: number;
    byVertical: { [key: string]: number };
    target: number;
  };
  delivery: {
    onTime: number;
    delayed: number;
    averageDelay: number; // hours
  };
  firstPass: {
    overall: number;
    byCreator: { [key: string]: number };
    byCategory: { [key: string]: number };
  };
  creators: {
    totalActive: number;
    averageScore: number;
    utilization: number;
  };
  financial: {
    revenue: number;
    costs: number;
    profit: number;
    fxImpact: number;
  };
}

export default function AdminReportsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  // States
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports' | 'alerts' | 'analytics'>('dashboard');
  const [kpis, setKpis] = useState<KPIMetric[]>([]);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [alerts, setAlerts] = useState<ReportAlert[]>([]);
  const [performance, setPerformance] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [periodFilter, setPeriodFilter] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [alertFilter, setAlertFilter] = useState<string>('all');
  const [reportTypeFilter, setReportTypeFilter] = useState<string>('all');

  // التحقق من صلاحيات الإدمن
  const isAdmin = (session?.user as { role?: string })?.role === 'admin';

  // تحميل البيانات
  const loadReportsData = useCallback(async () => {
    try {
      setLoading(true);
      
      // تحميل البيانات بشكل متوازي
      const [kpisRes, reportsRes, alertsRes, performanceRes] = await Promise.all([
        fetch(`/api/admin/reports/kpis?period=${periodFilter}`),
        fetch(`/api/admin/reports/list?period=${periodFilter}`),
        fetch('/api/admin/reports/alerts'),
        fetch(`/api/admin/reports/performance?period=${periodFilter}`)
      ]);

      if (kpisRes.ok) {
        const kpisData = await kpisRes.json();
        setKpis(kpisData.kpis || []);
      }

      if (reportsRes.ok) {
        const reportsData = await reportsRes.json();
        setReports(reportsData.reports || []);
      }

      if (alertsRes.ok) {
        const alertsData = await alertsRes.json();
        setAlerts(alertsData.alerts || []);
      }

      if (performanceRes.ok) {
        const performanceData = await performanceRes.json();
        setPerformance(performanceData.performance || null);
      }

    } catch (err) {
      setError('فشل في تحميل بيانات التقارير');
      console.error('Load reports data error:', err);
    } finally {
      setLoading(false);
    }
  }, [periodFilter]);

  useEffect(() => {
    if (isAdmin) {
      loadReportsData();
    }
  }, [isAdmin, loadReportsData]);

  // توليد تقرير جديد
  const handleGenerateReport = async (type: string) => {
    try {
      const response = await fetch('/api/admin/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, period: periodFilter })
      });

      if (response.ok) {
        const result = await response.json();
        setReports(prev => [result.report, ...prev]);
        alert('تم توليد التقرير بنجاح');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'فشل في توليد التقرير');
      }
    } catch (err) {
      setError('خطأ في الاتصال');
      console.error('Generate report error:', err);
    }
  };

  // تحميل تقرير
  const handleDownloadReport = async (reportId: string) => {
    try {
      const response = await fetch(`/api/admin/reports/${reportId}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${reportId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Failed to download report');
      }
    } catch (err) {
      setError('فشل في تحميل التقرير');
      console.error('Download report error:', err);
    }
  };

  // حل تنبيه
  const handleResolveAlert = async (alertId: string) => {
    try {
      const response = await fetch(`/api/admin/reports/alerts/${alertId}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setAlerts(prev => prev.map(a => 
          a.id === alertId ? { ...a, resolved: true } : a
        ));
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'فشل في حل التنبيه');
      }
    } catch (err) {
      setError('خطأ في الاتصال');
      console.error('Resolve alert error:', err);
    }
  };

  // تصفية التقارير والتنبيهات
  const filteredReports = reports.filter(report => {
    return reportTypeFilter === 'all' || report.type === reportTypeFilter;
  });

  const filteredAlerts = alerts.filter(alert => {
    if (alertFilter === 'all') return true;
    if (alertFilter === 'unresolved') return !alert.resolved;
    return alert.severity === alertFilter;
  });

  // دوال المساعدة
  const getKPIStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'good':
        return 'text-[var(--success-fg)] bg-[var(--success-bg)] border-[var(--success-border)]';
      case 'warning':
        return 'text-[var(--warning-fg)] bg-[var(--warning-bg)] border-[var(--warning-border)]';
      case 'critical':
        return 'text-[var(--danger-fg)] bg-[var(--danger-bg)] border-[var(--danger-border)]';
      default:
        return 'text-[var(--muted)] bg-[var(--panel)] border-[var(--elev)]';
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <ArrowUp size={16} className="text-green-500" />;
    if (trend === 'down') return <ArrowDown size={16} className="text-red-500" />;
    return <Minus size={16} className="text-gray-500" />;
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'text-[var(--muted)] bg-[var(--panel)] border-[var(--elev)]';
      case 'medium':
      case 'high':
        return 'text-[var(--warning-fg)] bg-[var(--warning-bg)] border-[var(--warning-border)]';
      case 'critical':
        return 'text-[var(--danger-fg)] bg-[var(--danger-bg)] border-[var(--danger-border)]';
      default:
        return 'text-[var(--muted)] bg-[var(--panel)] border-[var(--elev)]';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-IQ').format(amount) + ' د.ع';
  };

  const formatPercentage = (value: number) => {
    return value.toFixed(1) + '%';
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-500)] mx-auto mb-4"></div>
          <p className="text-[var(--muted)]">جاري تحميل التقارير...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)] mb-2">التقارير والـ KPIs</h1>
          <p className="text-[var(--muted)]">مؤشرات الأداء الرئيسية والتقارير التفصيلية</p>
        </div>
        <div className="flex items-center gap-3">
          <Dropdown
            value={periodFilter}
            onChange={(v) => setPeriodFilter(String(v) as 'week' | 'month' | 'quarter' | 'year')}
            options={[
              { value: 'week', label: 'أسبوعي' },
              { value: 'month', label: 'شهري' },
              { value: 'quarter', label: 'ربعي' },
              { value: 'year', label: 'سنوي' },
            ]}
            placeholder="الفترة"
          />
          <Button 
            variant="secondary" 
            onClick={loadReportsData}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            تحديث
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-lg p-4 bg-[var(--danger-bg)] border border-[var(--danger-border)]">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} className="text-[var(--danger-fg)]" />
            <span className="text-[var(--danger-fg)]">{error}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setError(null)}
              className="mr-auto"
            >
              إغلاق
            </Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-[var(--card)] rounded-lg border border-[var(--border)]">
        <div className="flex border-b border-[var(--border)]">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'dashboard'
                ? 'text-[var(--accent-500)] border-b-2 border-[var(--accent-500)]'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            <div className="flex items-center gap-2">
              <BarChart3 size={16} />
              لوحة القيادة
            </div>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'reports'
                ? 'text-[var(--accent-500)] border-b-2 border-[var(--accent-500)]'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText size={16} />
              التقارير
            </div>
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'alerts'
                ? 'text-[var(--accent-500)] border-b-2 border-[var(--accent-500)]'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} />
              التنبيهات
              {filteredAlerts.filter(a => !a.resolved).length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {filteredAlerts.filter(a => !a.resolved).length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'analytics'
                ? 'text-[var(--accent-500)] border-b-2 border-[var(--accent-500)]'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            <div className="flex items-center gap-2">
              <LineChart size={16} />
              التحليلات
            </div>
          </button>
        </div>

        <div className="p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* KPIs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi) => (
                  <div key={kpi.id} className={`p-4 rounded-lg border ${getKPIStatusColor(kpi.status)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{kpi.name}</span>
                      {getTrendIcon(kpi.trend)}
                    </div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl font-bold">
                        {kpi.unit === '%' ? formatPercentage(kpi.value) : kpi.value}
                      </span>
                      <span className="text-sm text-[var(--muted)]">
                        / {kpi.unit === '%' ? formatPercentage(kpi.target) : kpi.target}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      {getTrendIcon(kpi.trend)}
                      <span className={
                        kpi.trend === 'up' ? 'text-green-600' :
                        kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }>
                        {Math.abs(kpi.trendValue)}{kpi.unit}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--muted)] mt-2">{kpi.description}</p>
                  </div>
                ))}
              </div>

              {/* Performance Overview */}
              {performance && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Margins */}
                  <div className="bg-[var(--bg)] rounded-lg border border-[var(--border)] p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Target size={20} className="text-green-500" />
                      <h3 className="text-lg font-semibold text-[var(--text)]">الهوامش</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--muted)]">الهامش الإجمالي</span>
                        <span className={`font-semibold ${
                          performance.margins.overall >= performance.margins.target 
                            ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatPercentage(performance.margins.overall)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--muted)]">الهدف</span>
                        <span className="text-[var(--text)]">
                          {formatPercentage(performance.margins.target)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            performance.margins.overall >= performance.margins.target 
                              ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(performance.margins.overall, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Performance */}
                  <div className="bg-[var(--bg)] rounded-lg border border-[var(--border)] p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Timer size={20} className="text-blue-500" />
                      <h3 className="text-lg font-semibold text-[var(--text)]">أداء التسليم</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--muted)]">في الموعد</span>
                        <span className="text-green-600 font-semibold">{performance.delivery.onTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--muted)]">متأخر</span>
                        <span className="text-red-600 font-semibold">{performance.delivery.delayed}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--muted)]">متوسط التأخير</span>
                        <span className="text-[var(--text)]">{performance.delivery.averageDelay} ساعة</span>
                      </div>
                    </div>
                  </div>

                  {/* First Pass Rate */}
                  <div className="bg-[var(--bg)] rounded-lg border border-[var(--border)] p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap size={20} className="text-yellow-500" />
                      <h3 className="text-lg font-semibold text-[var(--text)]">معدل القبول الأول</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--muted)]">المعدل الإجمالي</span>
                        <span className="text-[var(--text)] font-semibold">
                          {formatPercentage(performance.firstPass.overall)}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--muted)]">
                        الهدف: 70% أو أكثر
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            performance.firstPass.overall >= 70 
                              ? 'bg-green-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${Math.min(performance.firstPass.overall, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Financial Overview */}
                  <div className="bg-[var(--bg)] rounded-lg border border-[var(--border)] p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <DollarSign size={20} className="text-purple-500" />
                      <h3 className="text-lg font-semibold text-[var(--text)]">النظرة المالية</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--muted)]">الإيرادات</span>
                        <span className="text-green-600 font-semibold">
                          {formatCurrency(performance.financial.revenue)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--muted)]">التكاليف</span>
                        <span className="text-red-600 font-semibold">
                          {formatCurrency(performance.financial.costs)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--muted)]">الربح</span>
                        <span className="text-[var(--text)] font-semibold">
                          {formatCurrency(performance.financial.profit)}
                        </span>
                      </div>
                      {performance.financial.fxImpact !== 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[var(--muted)]">تأثير FX</span>
                          <span className={performance.financial.fxImpact > 0 ? 'text-green-600' : 'text-red-600'}>
                            {performance.financial.fxImpact > 0 ? '+' : ''}{formatCurrency(performance.financial.fxImpact)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              {/* Report Generation */}
              <div className="bg-[var(--bg)] rounded-lg border border-[var(--border)] p-6">
                <h3 className="text-lg font-semibold text-[var(--text)] mb-4">توليد تقرير جديد</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => handleGenerateReport('weekly')}
                    className="flex flex-col items-center gap-2 h-auto p-4"
                  >
                    <Calendar size={24} />
                    <span>تقرير أسبوعي</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleGenerateReport('monthly')}
                    className="flex flex-col items-center gap-2 h-auto p-4"
                  >
                    <BarChart3 size={24} />
                    <span>تقرير شهري</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleGenerateReport('quality')}
                    className="flex flex-col items-center gap-2 h-auto p-4"
                  >
                    <Star size={24} />
                    <span>تقرير جودة</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleGenerateReport('financial')}
                    className="flex flex-col items-center gap-2 h-auto p-4"
                  >
                    <DollarSign size={24} />
                    <span>تقرير مالي</span>
                  </Button>
                </div>
              </div>

              {/* Reports Filter */}
              <div className="flex items-center gap-4">
                <Filter size={16} className="text-[var(--muted)]" />
                <Dropdown
                  value={reportTypeFilter}
                  onChange={(v) => setReportTypeFilter(String(v))}
                  options={[
                    { value: 'all', label: 'جميع التقارير' },
                    { value: 'weekly', label: 'أسبوعي' },
                    { value: 'monthly', label: 'شهري' },
                    { value: 'quality', label: 'جودة' },
                    { value: 'financial', label: 'مالي' },
                    { value: 'performance', label: 'أداء' },
                  ]}
                  placeholder="نوع التقرير"
                />
              </div>

              {/* Reports List */}
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div key={report.id} className="bg-[var(--bg)] rounded-lg border border-[var(--border)] p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-[var(--text)] mb-2">{report.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
                          <span>الفترة: {report.period}</span>
                          <span>تم التوليد: {new Date(report.generatedAt).toLocaleDateString('ar-EG')}</span>
                          <span className="px-2 py-1 bg-[var(--panel)] text-[var(--text)] border border-[var(--elev)] rounded text-xs">
                            {report.type}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/admin/reports/${report.id}`)}
                        >
                          <Eye size={16} />
                          عرض
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadReport(report.id)}
                        >
                          <Download size={16} />
                          تحميل
                        </Button>
                      </div>
                    </div>

                    {/* Report Insights */}
                    {report.insights && report.insights.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-medium text-[var(--text)] mb-2">النتائج الرئيسية:</h5>
                        <ul className="space-y-1">
                          {report.insights.slice(0, 3).map((insight, index) => (
                            <li key={index} className="text-sm text-[var(--muted)] flex items-start gap-2">
                              <span className="text-[var(--accent-500)] mt-1">•</span>
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Report Alerts */}
                    {report.alerts && report.alerts.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {report.alerts.slice(0, 3).map((alert, index) => (
                          <span key={index} className={`px-2 py-1 rounded text-xs ${getAlertSeverityColor(alert.severity)}`}>
                            {alert.message}
                          </span>
                        ))}
                        {report.alerts.length > 3 && (
                          <span className="px-2 py-1 bg-[var(--panel)] text-[var(--text)] border border-[var(--elev)] rounded text-xs">
                            +{report.alerts.length - 3} تنبيه إضافي
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alerts Tab */}
          {activeTab === 'alerts' && (
            <div className="space-y-6">
              {/* Alerts Filter */}
              <div className="flex items-center gap-4">
                <Filter size={16} className="text-[var(--muted)]" />
                <Dropdown
                  value={alertFilter}
                  onChange={(v) => setAlertFilter(String(v))}
                  options={[
                    { value: 'all', label: 'جميع التنبيهات' },
                    { value: 'unresolved', label: 'غير محلولة' },
                    { value: 'critical', label: 'حرجة' },
                    { value: 'high', label: 'عالية' },
                    { value: 'medium', label: 'متوسطة' },
                    { value: 'low', label: 'منخفضة' },
                  ]}
                  placeholder="تصفية التنبيهات"
                />
              </div>

              {/* Alerts List */}
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg border ${getAlertSeverityColor(alert.severity)} ${alert.resolved ? 'opacity-60' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle size={16} />
                          <span className="font-medium">{alert.message}</span>
                          {alert.resolved && (
                            <CheckCircle size={16} className="text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-[var(--muted)] mb-2">{alert.details}</p>
                        <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
                          <span>{new Date(alert.timestamp).toLocaleString('ar-EG')}</span>
                          <span className={`px-2 py-1 rounded ${getAlertSeverityColor(alert.severity)}`}>
                            {alert.severity}
                          </span>
                        </div>
                      </div>
                      
                      {!alert.resolved && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleResolveAlert(alert.id)}
                          className="text-green-600"
                        >
                          <CheckCircle size={16} />
                          حل
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <LineChart size={64} className="text-[var(--muted)] mx-auto mb-4" />
                <h3 className="text-xl font-medium text-[var(--text)] mb-2">التحليلات المتقدمة</h3>
                <p className="text-[var(--muted)] mb-4">الرسوم البيانية والتحليلات التفاعلية قيد التطوير</p>
                <Button variant="outline">
                  <Activity size={16} />
                  عرض التحليلات التفاعلية
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
