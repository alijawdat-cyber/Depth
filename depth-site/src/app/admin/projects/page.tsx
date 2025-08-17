"use client";

// صفحة إدارة المشاريع المتقدمة - Admin
// الوثيقة المرجعية: docs/roles/admin/02-Role-Workflows.md - القسم 3
// الغرض: إدارة شاملة للمشاريع مع حساب التسعير وفحص Guardrails وإرسال العروض

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { 
  Plus, 
  Search, 
  Filter,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Mail,
  MessageSquare,
  Camera,
  RefreshCw,
  Target,
  Users,
  Calendar,
  TrendingUp,
  AlertCircle
} from "lucide-react";

// واجهات البيانات حسب الوثائق
interface Project {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  status: 'draft' | 'quote_sent' | 'approved' | 'in_progress' | 'completed' | 'delivered';
  priority: 'normal' | 'high' | 'rush';
  vertical: string;
  deliverables: Deliverable[];
  totalIQD: number;
  totalUSD: number;
  margin: number;
  guardrailStatus: 'safe' | 'warning' | 'danger';
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  description?: string;
  // Version Snapshot عند الموافقة
  snapshot?: {
    version: string;
    fxRate: number;
    fxDate: string;
    fxSource: string;
    catalogVersion: string;
  };
}

interface Deliverable {
  id: string;
  subcategory: string;
  subcategoryNameAr: string;
  quantity: number;
  processing: 'raw_only' | 'raw_color' | 'full_retouch';
  conditions: {
    isRush: boolean;
    location: 'studio' | 'outdoor_baghdad' | 'provinces';
    speedBonus: boolean;
  };
  assignedTo?: string; // Creator/Employee ID
  assignedToName?: string;
  pricePerUnitIQD: number;
  pricePerUnitUSD: number;
  totalIQD: number;
  totalUSD: number;
  margin: number;
}

interface ProjectStats {
  total: number;
  draft: number;
  quoteSent: number;
  approved: number;
  inProgress: number;
  completed: number;
  totalValueIQD: number;
  totalValueUSD: number;
  averageMargin: number;
}

interface Creator {
  id: string;
  name: string;
  email: string;
  skills: string[];
  tier: string;
  modifier: number;
}

export default function AdminProjectsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  // States
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Project Creation/Edit
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    clientEmail: '',
    vertical: 'fashion',
    description: '',
    deadline: '',
    priority: 'normal' as 'normal' | 'high' | 'rush'
  });
  
  // Deliverables Management
  const [showDeliverableForm, setShowDeliverableForm] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [deliverableData, setDeliverableData] = useState({
    subcategory: '',
    quantity: 1,
    processing: 'raw_color' as 'raw_only' | 'raw_color' | 'full_retouch',
    isRush: false,
    location: 'studio' as 'studio' | 'outdoor_baghdad' | 'provinces',
    assignedTo: ''
  });
  
  // Operations
  const [submitting, setSubmitting] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [sending, setSending] = useState(false);

  // التحقق من صلاحيات الإدمن
  const isAdmin = (session?.user as { role?: string })?.role === 'admin';

  // تحميل البيانات
  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/portal/admin/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
        setStats(data.stats || null);
      } else {
        throw new Error('Failed to fetch projects');
      }
    } catch (err) {
      setError('فشل في تحميل المشاريع');
      console.error('Load projects error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCreators = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/creators');
      if (response.ok) {
        const data = await response.json();
        setCreators(data.creators || []);
      }
    } catch (err) {
      console.error('Load creators error:', err);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadProjects();
      loadCreators();
    }
  }, [isAdmin, loadProjects, loadCreators]);

  // إنشاء مشروع جديد
  const handleCreateProject = async () => {
    try {
      setSubmitting(true);
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        setProjects(prev => [result.project, ...prev]);
        setShowCreateForm(false);
        setFormData({
          title: '',
          clientEmail: '',
          vertical: 'fashion',
          description: '',
          deadline: '',
          priority: 'normal'
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'فشل في إنشاء المشروع');
      }
    } catch (err) {
      setError('خطأ في الاتصال');
      console.error('Create project error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // إضافة تسليمة (Deliverable) - حسب الوثائق
  const handleAddDeliverable = async () => {
    if (!currentProjectId) return;
    
    try {
      setSubmitting(true);
      setCalculating(true);
      
      const response = await fetch(`/api/admin/projects/${currentProjectId}/deliverables`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deliverableData)
      });

      if (response.ok) {
        const data = await response.json();
        // تحديث المشروع مع التسليمة الجديدة والحسابات
        setProjects(prev => prev.map(p => 
          p.id === currentProjectId 
            ? { ...p, deliverables: data.deliverables, totalIQD: data.totalIQD, totalUSD: data.totalUSD, margin: data.margin, guardrailStatus: data.guardrailStatus }
            : p
        ));
        
        setShowDeliverableForm(false);
        setDeliverableData({
          subcategory: '',
          quantity: 1,
          processing: 'raw_color',
          isRush: false,
          location: 'studio',
          assignedTo: ''
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'فشل في إضافة التسليمة');
      }
    } catch (err) {
      setError('خطأ في الاتصال');
      console.error('Add deliverable error:', err);
    } finally {
      setSubmitting(false);
      setCalculating(false);
    }
  };

  // فحص Guardrails وإرسال العرض - حسب الوثائق
  const handleSendQuote = async (projectId: string, method: 'email' | 'whatsapp') => {
    try {
      setSending(true);
      
      const response = await fetch(`/api/admin/projects/${projectId}/send-quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method })
      });

      if (response.ok) {
        // تحديث حالة المشروع
        setProjects(prev => prev.map(p => 
          p.id === projectId 
            ? { ...p, status: 'quote_sent' as const }
            : p
        ));
        
        alert(`تم إرسال العرض بنجاح عبر ${method === 'email' ? 'البريد الإلكتروني' : 'واتساب'}`);
      } else {
        const errorData = await response.json();
        if (errorData.guardrailError) {
          alert(`⚠️ فحص Guardrails: ${errorData.error}\nالهامش الحالي: ${errorData.currentMargin}%\nالحد الأدنى المطلوب: 45%`);
        } else {
          setError(errorData.error || 'فشل في إرسال العرض');
        }
      }
    } catch (err) {
      setError('خطأ في الاتصال');
      console.error('Send quote error:', err);
    } finally {
      setSending(false);
    }
  };

  // إنشاء Version Snapshot عند الموافقة - حسب الوثائق
  const handleApproveProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        
        // تحديث المشروع مع Snapshot
        setProjects(prev => prev.map(p => 
          p.id === projectId 
            ? { ...p, status: 'approved' as const, snapshot: data.snapshot }
            : p
        ));
        
        alert('تم اعتماد المشروع وإنشاء Version Snapshot بنجاح');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'فشل في اعتماد المشروع');
      }
    } catch (err) {
      setError('خطأ في الاتصال');
      console.error('Approve project error:', err);
    }
  };

  // تصفية المشاريع
  const filteredProjects = projects.filter(project => {
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
    const matchesSearch = searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  // دوال المساعدة
  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'مسودة';
      case 'quote_sent': return 'عرض مُرسل';
      case 'approved': return 'معتمد';
      case 'in_progress': return 'قيد التنفيذ';
      case 'completed': return 'مكتمل';
      case 'delivered': return 'مُسلم';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'quote_sent': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'approved': return 'text-green-600 bg-green-50 border-green-200';
      case 'in_progress': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'completed': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'delivered': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'rush': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'normal': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getGuardrailColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'danger': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatCurrency = (amount: number, currency: 'IQD' | 'USD') => {
    if (currency === 'IQD') {
      return new Intl.NumberFormat('ar-IQ').format(amount) + ' د.ع';
    } else {
      return '$' + new Intl.NumberFormat('en-US').format(amount);
    }
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
          <p className="text-[var(--muted)]">جاري تحميل المشاريع...</p>
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
          <h1 className="text-3xl font-bold text-[var(--text)] mb-2">إدارة المشاريع</h1>
          <p className="text-[var(--muted)]">إنشاء وإدارة المشاريع مع حساب التسعير وفحص Guardrails</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            onClick={loadProjects}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            تحديث
          </Button>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus size={16} />
            مشروع جديد
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} className="text-red-600" />
            <span className="text-red-800">{error}</span>
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

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">إجمالي المشاريع</p>
                <p className="text-2xl font-bold text-[var(--text)]">{stats.total}</p>
              </div>
              <FileText size={24} className="text-[var(--accent-500)]" />
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">قيد التنفيذ</p>
                <p className="text-2xl font-bold text-[var(--text)]">{stats.inProgress}</p>
              </div>
              <Clock size={24} className="text-orange-500" />
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">القيمة الإجمالية</p>
                <p className="text-lg font-bold text-[var(--text)]">
                  {formatCurrency(stats.totalValueIQD, 'IQD')}
                </p>
              </div>
              <DollarSign size={24} className="text-green-500" />
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">متوسط الهامش</p>
                <p className="text-2xl font-bold text-[var(--text)]">{stats.averageMargin}%</p>
              </div>
              <TrendingUp size={24} className="text-blue-500" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--muted)]" />
              <input
                type="text"
                placeholder="البحث في المشاريع..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[var(--muted)]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
            >
              <option value="all">الكل</option>
              <option value="draft">مسودة</option>
              <option value="quote_sent">عرض مُرسل</option>
              <option value="approved">معتمد</option>
              <option value="in_progress">قيد التنفيذ</option>
              <option value="completed">مكتمل</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Target size={16} className="text-[var(--muted)]" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
            >
              <option value="all">الكل</option>
              <option value="normal">عادي</option>
              <option value="high">عالي</option>
              <option value="rush">عاجل</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <FileText size={64} className="text-[var(--muted)] mx-auto mb-4" />
          <h3 className="text-xl font-medium text-[var(--text)] mb-2">لا توجد مشاريع</h3>
          <p className="text-[var(--muted)] mb-4">ابدأ بإنشاء مشروع جديد</p>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus size={16} />
            إنشاء مشروع جديد
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-[var(--text)]">{project.title}</h3>
                    
                    {/* Status Badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>

                    {/* Priority Badge */}
                    {project.priority !== 'normal' && (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(project.priority)}`}>
                        {project.priority === 'rush' ? 'عاجل' : 'عالي'}
                      </span>
                    )}

                    {/* Guardrail Status */}
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getGuardrailColor(project.guardrailStatus)}`}>
                      هامش {project.margin}%
                    </span>
                  </div>

                  <p className="text-[var(--muted)] mb-2">{project.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      {project.clientName}
                    </div>
                    <div className="flex items-center gap-1">
                      <Target size={16} />
                      {project.vertical}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText size={16} />
                      {project.deliverables.length} تسليمة
                    </div>
                    {project.deadline && (
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        {new Date(project.deadline).toLocaleDateString('ar-EG')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/admin/projects/${project.id}`)}
                  >
                    <Eye size={16} />
                    عرض
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCurrentProjectId(project.id);
                      setShowDeliverableForm(true);
                    }}
                  >
                    <Plus size={16} />
                    إضافة تسليمة
                  </Button>
                </div>
              </div>

              {/* Project Totals */}
              <div className="bg-[var(--bg)] rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm text-[var(--muted)]">المجموع (د.ع)</p>
                    <p className="text-lg font-semibold text-[var(--text)]">
                      {formatCurrency(project.totalIQD, 'IQD')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--muted)]">المجموع ($)</p>
                    <p className="text-lg font-semibold text-[var(--text)]">
                      {formatCurrency(project.totalUSD, 'USD')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--muted)]">الهامش</p>
                    <p className={`text-lg font-semibold ${
                      project.margin >= 50 ? 'text-green-600' : 
                      project.margin >= 45 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {project.margin}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--muted)]">التسليمات</p>
                    <p className="text-lg font-semibold text-[var(--text)]">
                      {project.deliverables.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {project.status === 'draft' && project.deliverables.length > 0 && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSendQuote(project.id, 'email')}
                      disabled={sending || project.guardrailStatus === 'danger'}
                      className="flex items-center gap-1"
                    >
                      <Mail size={16} />
                      إرسال بالبريد
                    </Button>
                    
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSendQuote(project.id, 'whatsapp')}
                      disabled={sending || project.guardrailStatus === 'danger'}
                      className="flex items-center gap-1"
                    >
                      <MessageSquare size={16} />
                      إرسال بواتساب
                    </Button>
                  </>
                )}
                
                {project.status === 'quote_sent' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApproveProject(project.id)}
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle size={16} />
                    اعتماد المشروع
                  </Button>
                )}

                {project.guardrailStatus === 'danger' && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertTriangle size={16} />
                    <span>الهامش أقل من 45% - يجب المراجعة</span>
                  </div>
                )}
              </div>

              {/* Version Snapshot Info */}
              {project.snapshot && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-800 text-sm">
                    <Camera size={16} />
                    <span>
                      Version Snapshot: {project.snapshot.version} | 
                      FX: {project.snapshot.fxRate} | 
                      تاريخ: {new Date(project.snapshot.fxDate).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--card)] rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-[var(--text)] mb-4">إنشاء مشروع جديد</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  عنوان المشروع
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
                  placeholder="مثال: Lookbook FW25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  بريد العميل
                </label>
                <input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
                  placeholder="client@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  المحور (Vertical)
                </label>
                <select
                  value={formData.vertical}
                  onChange={(e) => setFormData(prev => ({ ...prev, vertical: e.target.value }))}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
                >
                  <option value="fashion">Fashion</option>
                  <option value="beauty">Beauty</option>
                  <option value="food">Food & Beverage</option>
                  <option value="clinics">Clinics</option>
                  <option value="corporate">Corporate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  الأولوية
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as 'normal' | 'high' | 'rush' }))}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
                >
                  <option value="normal">عادي</option>
                  <option value="high">عالي</option>
                  <option value="rush">عاجل (Rush)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  الموعد النهائي (اختياري)
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  الوصف (اختياري)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
                  rows={3}
                  placeholder="وصف المشروع..."
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <Button
                onClick={handleCreateProject}
                disabled={submitting || !formData.title || !formData.clientEmail}
                className="flex-1"
              >
                {submitting ? 'جاري الإنشاء...' : 'إنشاء المشروع'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowCreateForm(false)}
                disabled={submitting}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Deliverable Modal */}
      {showDeliverableForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--card)] rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-[var(--text)] mb-4">إضافة تسليمة</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  الفئة الفرعية
                </label>
                <select
                  value={deliverableData.subcategory}
                  onChange={(e) => setDeliverableData(prev => ({ ...prev, subcategory: e.target.value }))}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
                >
                  <option value="">اختر الفئة الفرعية</option>
                  <option value="photo-flat-lay">Photo — Flat Lay</option>
                  <option value="photo-lifestyle">Photo — Lifestyle</option>
                  <option value="photo-portrait">Photo — Portrait</option>
                  <option value="reel-try-on">Reel — Try-On</option>
                  <option value="reel-lifestyle">Reel — Lifestyle</option>
                  <option value="design-carousel">Design — Carousel</option>
                  <option value="design-story">Design — Story</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  الكمية
                </label>
                <input
                  type="number"
                  min="1"
                  value={deliverableData.quantity}
                  onChange={(e) => setDeliverableData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  المعالجة
                </label>
                <select
                  value={deliverableData.processing}
                  onChange={(e) => setDeliverableData(prev => ({ ...prev, processing: e.target.value as 'raw_only' | 'raw_color' | 'full_retouch' }))}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
                >
                  <option value="raw_only">RAW Only (-10%)</option>
                  <option value="raw_color">RAW + Color (0%)</option>
                  <option value="full_retouch">Full Retouch (+30-40%)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  الموقع
                </label>
                <select
                  value={deliverableData.location}
                  onChange={(e) => setDeliverableData(prev => ({ ...prev, location: e.target.value as 'studio' | 'outdoor_baghdad' | 'provinces' }))}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
                >
                  <option value="studio">الاستوديو (0 رسوم)</option>
                  <option value="outdoor_baghdad">خارجي - بغداد</option>
                  <option value="provinces">المحافظات</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={deliverableData.isRush}
                    onChange={(e) => setDeliverableData(prev => ({ ...prev, isRush: e.target.checked }))}
                    className="w-4 h-4 text-[var(--accent-500)] border-[var(--border)] rounded focus:ring-[var(--accent-500)]"
                  />
                  <span className="text-sm text-[var(--text)]">عاجل (Rush) - زيادة 35%</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  مُسند إلى
                </label>
                <select
                  value={deliverableData.assignedTo}
                  onChange={(e) => setDeliverableData(prev => ({ ...prev, assignedTo: e.target.value }))}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
                >
                  <option value="">اختر المبدع/الموظف</option>
                  {creators.map(creator => (
                    <option key={creator.id} value={creator.id}>
                      {creator.name} ({creator.tier})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <Button
                onClick={handleAddDeliverable}
                disabled={submitting || calculating || !deliverableData.subcategory}
                className="flex-1"
              >
                {calculating ? 'جاري الحساب...' : submitting ? 'جاري الإضافة...' : 'إضافة التسليمة'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowDeliverableForm(false)}
                disabled={submitting || calculating}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
