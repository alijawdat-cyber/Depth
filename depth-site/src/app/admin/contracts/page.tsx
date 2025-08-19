"use client";

// صفحة إدارة العقود - Admin
// الوثيقة المرجعية: docs/core/1-Contract-Pack(MSA-SOW-NDA)-Brief.md
// الغرض: إدارة MSA + SOW + NDA وجميع الملحقات

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Dropdown from "@/components/ui/Dropdown";
import { showSuccess, showError } from '@/lib/toast';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Download,
  FileText,
  CheckCircle,
  Clock,
  Users,
  Calendar,
  DollarSign,
  Shield,
  Briefcase,
  Camera,
  RefreshCw,
  AlertCircle,
  Mail,
  Printer,
  Copy
} from "lucide-react";

// واجهات البيانات حسب الوثائق
interface Contract {
  id: string;
  type: 'msa' | 'sow' | 'nda' | 'equipment' | 'model_release' | 'influencer' | 'media_buying' | 'clinica_compliance';
  status: 'draft' | 'pending_client' | 'signed' | 'executed' | 'expired' | 'terminated';
  title: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  projectId?: string; // للـ SOW
  parentContractId?: string; // للملحقات
  
  // معلومات العقد
  value?: number; // القيمة بالدينار العراقي
  currency: 'IQD' | 'USD';
  fxRate?: number;
  fxDate?: string;
  
  // التواريخ
  createdAt: string;
  updatedAt: string;
  signedAt?: string;
  expiresAt?: string;
  effectiveDate?: string;
  
  // المحتوى والشروط
  content: ContractContent;
  
  // التواقيع
  signatures: ContractSignature[];
  
  // الملحقات
  annexes?: ContractAnnex[];
  
  // Version Snapshot للـ SOW
  snapshot?: {
    version: string;
    fxRate: number;
    fxDate: string;
    catalogVersion: string;
  };
}

interface ContractContent {
  // MSA Content
  scope?: string;
  paymentTerms?: {
    advance: number; // نسبة مئوية
    onDelivery: number;
    killFee: number;
  };
  liability?: {
    limit: string;
    period: string;
  };
  
  // SOW Content
  deliverables?: SOWDeliverable[];
  timeline?: {
    startDate: string;
    milestones: Milestone[];
    finalDelivery: string;
  };
  budget?: {
    fees: number;
    thirdPartyExpenses: number;
    total: number;
  };
  revisionRounds?: number;
  acceptanceTarget?: number; // نسبة مئوية
  
  // NDA Content
  confidentialityPeriod?: string;
  
  // تفاصيل خاصة بكل نوع ملحق
  equipmentDetails?: EquipmentDetails;
  modelDetails?: ModelDetails;
  influencerDetails?: InfluencerDetails;
  mediaBuyingDetails?: MediaBuyingDetails;
  clinicaDetails?: ClinicaDetails;
}

interface SOWDeliverable {
  type: string;
  quantity: number;
  dimensions?: string;
  format: string;
  specifications: string;
}

// أنواع تفصيلية للملحقات بدل any
type SocialPlatform = 'instagram' | 'tiktok' | 'youtube' | 'snapchat' | 'facebook' | 'x' | 'other';

interface EquipmentItem {
  name: string;
  quantity: number;
  specification?: string;
}

interface EquipmentDetails {
  items?: EquipmentItem[];
  rentalDays?: number;
  insuranceIncluded?: boolean;
  deliveryNotes?: string;
  notes?: string;
  [key: string]: unknown;
}

interface ModelDetails {
  modelName?: string;
  modelId?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  ratePerHour?: number;
  hours?: number;
  notes?: string;
  [key: string]: unknown;
}

interface InfluencerDetails {
  handle?: string;
  platform?: SocialPlatform;
  followers?: number;
  cpmUsd?: number;
  deliverables?: string[];
  briefLink?: string;
  [key: string]: unknown;
}

interface MediaBuyingChannel {
  platform: SocialPlatform | string;
  budget: number;
  objective: 'reach' | 'traffic' | 'conversions' | 'awareness' | string;
}

interface MediaBuyingDetails {
  channels?: MediaBuyingChannel[];
  totalBudget?: number;
  durationDays?: number;
  [key: string]: unknown;
}

interface ClinicaDetails {
  complianceOfficer?: string;
  licenseNo?: string;
  approvalRefs?: string[];
  restrictions?: string[];
  notes?: string;
  [key: string]: unknown;
}

interface Milestone {
  name: string;
  date: string;
  description: string;
  completed: boolean;
}

interface ContractSignature {
  party: 'depth' | 'client';
  signerName: string;
  signerTitle: string;
  signedAt?: string;
  ipAddress?: string;
  status: 'pending' | 'signed';
}

interface ContractAnnex {
  type: string;
  title: string;
  required: boolean;
  status: 'pending' | 'completed';
}

interface ContractStats {
  total: number;
  draft: number;
  pendingClient: number;
  signed: number;
  executed: number;
  expired: number;
  totalValue: number;
  averageValue: number;
}

export default function AdminContractsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  // States
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [stats, setStats] = useState<ContractStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Contract Creation
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'msa' as Contract['type'],
    clientEmail: '',
    title: '',
    value: 0,
    currency: 'IQD' as 'IQD' | 'USD',
    effectiveDate: '',
    expiresAt: ''
  });
  
  // Operations
  const [submitting, setSubmitting] = useState(false);

  // التحقق من صلاحيات الإدمن
  const isAdmin = (session?.user as { role?: string })?.role === 'admin';

  // تحميل البيانات
  const loadContracts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/contracts');
      if (response.ok) {
        const data = await response.json();
        setContracts(data.contracts || []);
        setStats(data.stats || null);
      } else {
        throw new Error('Failed to fetch contracts');
      }
    } catch (err) {
      setError('فشل في تحميل العقود');
      showError('فشل في تحميل العقود');
      console.error('Load contracts error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadContracts();
    }
  }, [isAdmin, loadContracts]);

  // إنشاء عقد جديد
  const handleCreateContract = async () => {
    try {
      setSubmitting(true);
      const response = await fetch('/api/admin/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        setContracts(prev => [result.contract, ...prev]);
        setShowCreateForm(false);
        setFormData({
          type: 'msa',
          clientEmail: '',
          title: '',
          value: 0,
          currency: 'IQD',
          effectiveDate: '',
          expiresAt: ''
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'فشل في إنشاء العقد');
      }
    } catch (err) {
      setError('خطأ في الاتصال');
      console.error('Create contract error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // توليد SOW من عرض معتمد
  const handleGenerateSOW = async (quoteId: string) => {
    try {
      setSubmitting(true);
      const response = await fetch('/api/admin/contracts/sow/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteId })
      });

      if (response.ok) {
        const result = await response.json();
        // إضافة SOW الجديد للقائمة
        setContracts(prev => [result.sow, ...prev]);
        showSuccess(`تم توليد SOW بنجاح! سيتم تحميل PDF تلقائياً.`);
        
        // فتح PDF في تبويب جديد
        if (result.pdfUrl) {
          window.open(result.pdfUrl, '_blank');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'فشل في توليد SOW');
      }
    } catch (err) {
      setError('خطأ في الاتصال أثناء توليد SOW');
      console.error('Generate SOW error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // توقيع SOW (للعملاء)
  const handleSignSOW = async (sowId: string) => {
    try {
      setSubmitting(true);
      const response = await fetch('/api/admin/contracts/sow/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sowId })
      });

      if (response.ok) {
        await response.json();
        // تحديث حالة العقد
        setContracts(prev => prev.map(contract => 
          contract.id === sowId 
            ? { ...contract, status: 'signed' as const, signedAt: new Date().toISOString() }
            : contract
        ));
        showSuccess('تم توقيع المستند بنجاح!');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'فشل في توقيع المستند');
      }
    } catch (err) {
      setError('خطأ في الاتصال أثناء التوقيع');
      console.error('Sign SOW error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // إرسال العقد للعميل
  const handleSendContract = async (contractId: string, method: 'email' | 'whatsapp') => {
    try {
      const response = await fetch(`/api/admin/contracts/${contractId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method })
      });

      if (response.ok) {
        setContracts(prev => prev.map(c => 
          c.id === contractId 
            ? { ...c, status: 'pending_client' as const }
            : c
        ));
        
        showSuccess(`تم إرسال العقد بنجاح عبر ${method === 'email' ? 'البريد الإلكتروني' : 'واتساب'}`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'فشل في إرسال العقد');
      }
    } catch (err) {
      setError('خطأ في الاتصال');
      console.error('Send contract error:', err);
    }
  };

  // تحميل العقد كـ PDF
  const handleDownloadContract = async (contractId: string) => {
    try {
      const response = await fetch(`/api/admin/contracts/${contractId}/pdf`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contract-${contractId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Failed to download contract');
      }
    } catch (err) {
      setError('فشل في تحميل العقد');
      console.error('Download contract error:', err);
    }
  };

  // تصفية العقود
  const filteredContracts = contracts.filter(contract => {
    const matchesType = typeFilter === 'all' || contract.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    const matchesSearch = searchQuery === '' || 
      contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesStatus && matchesSearch;
  });

  // دوال المساعدة
  const getTypeText = (type: string) => {
    switch (type) {
      case 'msa': return 'اتفاقية خدمات رئيسية';
      case 'sow': return 'بيان العمل';
      case 'nda': return 'اتفاقية السرية';
      case 'equipment': return 'اتفاقية المعدات';
      case 'model_release': return 'موافقة النموذج';
      case 'influencer': return 'اتفاقية المؤثر';
      case 'media_buying': return 'ملحق شراء الوسائط';
      case 'clinica_compliance': return 'امتثال طبي';
      default: return type;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'مسودة';
      case 'pending_client': return 'في انتظار العميل';
      case 'signed': return 'موقع';
      case 'executed': return 'منفذ';
      case 'expired': return 'منتهي الصلاحية';
      case 'terminated': return 'منتهي';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed':
      case 'executed':
        return 'text-[var(--success-fg)] bg-[var(--success-bg)] border-[var(--success-border)]';
      case 'pending_client':
        return 'text-[var(--warning-fg)] bg-[var(--warning-bg)] border-[var(--warning-border)]';
      case 'expired':
        return 'text-[var(--danger-fg)] bg-[var(--danger-bg)] border-[var(--danger-border)]';
      case 'draft':
      case 'terminated':
      default:
        return 'text-[var(--muted)] bg-[var(--panel)] border-[var(--elev)]';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'msa': return <Briefcase size={16} className="text-[var(--text)]" />;
      case 'sow': return <FileText size={16} className="text-[var(--text)]" />;
      case 'nda': return <Shield size={16} className="text-[var(--text)]" />;
      case 'equipment': return <Camera size={16} className="text-[var(--text)]" />;
      case 'model_release': return <Users size={16} className="text-[var(--text)]" />;
      case 'influencer': return <Users size={16} className="text-[var(--text)]" />;
      case 'media_buying': return <DollarSign size={16} className="text-[var(--text)]" />;
      case 'clinica_compliance': return <Shield size={16} className="text-[var(--text)]" />;
      default: return <FileText size={16} className="text-[var(--text)]" />;
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
          <p className="text-[var(--muted)]">جاري تحميل العقود...</p>
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
          <h1 className="text-3xl font-bold text-[var(--text)] mb-2">إدارة العقود</h1>
          <p className="text-[var(--muted)]">MSA + SOW + NDA وجميع الملحقات والاتفاقيات</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            onClick={loadContracts}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            تحديث
          </Button>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus size={16} />
            عقد جديد
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

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">إجمالي العقود</p>
                <p className="text-2xl font-bold text-[var(--text)]">{stats.total}</p>
              </div>
              <FileText size={24} className="text-[var(--accent-500)]" />
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">في انتظار التوقيع</p>
                <p className="text-2xl font-bold text-[var(--text)]">{stats.pendingClient}</p>
              </div>
              <Clock size={24} className="text-blue-500" />
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">موقعة</p>
                <p className="text-2xl font-bold text-[var(--text)]">{stats.signed}</p>
              </div>
              <CheckCircle size={24} className="text-green-500" />
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">القيمة الإجمالية</p>
                <p className="text-lg font-bold text-[var(--text)]">
                  {formatCurrency(stats.totalValue, 'IQD')}
                </p>
              </div>
              <DollarSign size={24} className="text-green-500" />
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
                placeholder="البحث في العقود..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[var(--muted)]" />
            <div className="min-w-[220px]">
              <Dropdown
                value={typeFilter}
                onChange={(v) => setTypeFilter(String(v))}
                options={[
                  { value: 'all', label: 'جميع الأنواع' },
                  { value: 'msa', label: 'اتفاقية خدمات رئيسية' },
                  { value: 'sow', label: 'بيان العمل' },
                  { value: 'nda', label: 'اتفاقية السرية' },
                  { value: 'equipment', label: 'اتفاقية المعدات' },
                  { value: 'model_release', label: 'موافقة النموذج' },
                  { value: 'influencer', label: 'اتفاقية المؤثر' },
                  { value: 'media_buying', label: 'ملحق شراء الوسائط' },
                  { value: 'clinica_compliance', label: 'امتثال طبي' },
                ]}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[var(--muted)]" />
            <div className="min-w-[200px]">
              <Dropdown
                value={statusFilter}
                onChange={(v) => setStatusFilter(String(v))}
                options={[
                  { value: 'all', label: 'جميع الحالات' },
                  { value: 'draft', label: 'مسودة' },
                  { value: 'pending_client', label: 'في انتظار العميل' },
                  { value: 'signed', label: 'موقع' },
                  { value: 'executed', label: 'منفذ' },
                  { value: 'expired', label: 'منتهي الصلاحية' },
                  { value: 'terminated', label: 'منتهي' },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contracts List */}
      {filteredContracts.length === 0 ? (
        <div className="text-center py-12">
          <FileText size={64} className="text-[var(--muted)] mx-auto mb-4" />
          <h3 className="text-xl font-medium text-[var(--text)] mb-2">لا توجد عقود</h3>
          <p className="text-[var(--muted)] mb-4">ابدأ بإنشاء عقد جديد</p>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus size={16} />
            إنشاء عقد جديد
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredContracts.map((contract) => (
            <div key={contract.id} className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getTypeIcon(contract.type)}
                    <h3 className="text-xl font-semibold text-[var(--text)]">{contract.title}</h3>
                    
                    {/* Status Badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(contract.status)}`}>
                      {getStatusText(contract.status)}
                    </span>

                    {/* Type Badge */}
                    <span className="px-2 py-1 rounded text-xs font-medium bg-[var(--panel)] text-[var(--text)] border border-[var(--elev)]">
                      {getTypeText(contract.type)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      {contract.clientName}
                    </div>
                    {contract.value && (
                      <div className="flex items-center gap-1">
                        <DollarSign size={16} />
                        {formatCurrency(contract.value, contract.currency)}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      {new Date(contract.createdAt).toLocaleDateString('ar-EG')}
                    </div>
                    {contract.expiresAt && (
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        ينتهي: {new Date(contract.expiresAt).toLocaleDateString('ar-EG')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/admin/contracts/${contract.id}`)}
                  >
                    <Eye size={16} />
                    عرض
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadContract(contract.id)}
                  >
                    <Download size={16} />
                    تحميل PDF
                  </Button>

                  {/* SOW Actions */}
                  {contract.type === 'sow' && (
                    <>
                      {contract.status === 'draft' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleGenerateSOW(contract.projectId || contract.id)}
                          disabled={submitting}
                        >
                          <FileText size={16} />
                          توليد SOW
                        </Button>
                      )}
                      
                      {contract.status === 'pending_client' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSignSOW(contract.id)}
                          disabled={submitting}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Shield size={16} />
                          توقيع المستند
                        </Button>
                      )}
                    </>
                  )}

                  {contract.status === 'draft' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSendContract(contract.id, 'email')}
                        disabled={submitting}
                      >
                        <Mail size={16} />
                        إرسال بالإيميل
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSendContract(contract.id, 'whatsapp')}
                        disabled={submitting}
                      >
                        <Mail size={16} />
                        إرسال بواتساب
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Contract Details */}
              {contract.content && (
                <div className="bg-[var(--bg)] rounded-lg p-4 mb-4">
                  {contract.type === 'sow' && contract.content.deliverables && (
                    <div className="mb-3">
                      <h4 className="font-medium text-[var(--text)] mb-2">التسليمات:</h4>
                      <div className="space-y-1">
                        {contract.content.deliverables.slice(0, 3).map((deliverable, index) => (
                          <div key={index} className="text-sm text-[var(--muted)]">
                            • {deliverable.type} - {deliverable.quantity} قطعة ({deliverable.format})
                          </div>
                        ))}
                        {contract.content.deliverables.length > 3 && (
                          <div className="text-sm text-[var(--muted)]">
                            ... و {contract.content.deliverables.length - 3} تسليمات أخرى
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {contract.content.paymentTerms && (
                    <div className="mb-3">
                      <h4 className="font-medium text-[var(--text)] mb-2">شروط الدفع:</h4>
                      <div className="text-sm text-[var(--muted)]">
                        {contract.content.paymentTerms.advance}% مقدماً، {contract.content.paymentTerms.onDelivery}% عند التسليم
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Signatures */}
              {contract.signatures && contract.signatures.length > 0 && (
                <div className="bg-[var(--bg)] rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-[var(--text)] mb-2">التواقيع:</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {contract.signatures.map((signature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          signature.status === 'signed' ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                        <div className="text-sm">
                          <div className="font-medium text-[var(--text)]">
                            {signature.party === 'depth' ? 'Depth Studio' : 'العميل'}
                          </div>
                          <div className="text-[var(--muted)]">
                            {signature.signerName} - {signature.signerTitle}
                          </div>
                          {signature.signedAt && (
                            <div className="text-xs text-[var(--muted)]">
                              وُقع في: {new Date(signature.signedAt).toLocaleDateString('ar-EG')}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {contract.status === 'draft' && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSendContract(contract.id, 'email')}
                      className="flex items-center gap-1"
                    >
                      <Mail size={16} />
                      إرسال بالبريد
                    </Button>
                    
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => router.push(`/admin/contracts/${contract.id}/edit`)}
                      className="flex items-center gap-1"
                    >
                      <Edit size={16} />
                      تعديل
                    </Button>
                  </>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownloadContract(contract.id)}
                  className="flex items-center gap-1"
                >
                  <Printer size={16} />
                  طباعة
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/contracts/${contract.id}`)}
                  className="flex items-center gap-1"
                >
                  <Copy size={16} />
                  نسخ الرابط
                </Button>
              </div>

              {/* Version Snapshot Info */}
              {contract.snapshot && (
                <div className="mt-4 p-3 bg-[var(--panel)] border border-[var(--elev)] rounded-lg">
                  <div className="flex items-center gap-2 text-[var(--text)] text-sm">
                    <Camera size={16} />
                    <span>
                      Version Snapshot: {contract.snapshot.version} | 
                      FX: {contract.snapshot.fxRate} | 
                      Catalog: {contract.snapshot.catalogVersion}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Contract Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--card)] rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-[var(--text)] mb-4">إنشاء عقد جديد</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  نوع العقد
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Contract['type'] }))}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
                >
                  <option value="msa">اتفاقية خدمات رئيسية (MSA)</option>
                  <option value="sow">بيان العمل (SOW)</option>
                  <option value="nda">اتفاقية السرية (NDA)</option>
                  <option value="equipment">اتفاقية المعدات</option>
                  <option value="model_release">موافقة النموذج</option>
                  <option value="influencer">اتفاقية المؤثر</option>
                  <option value="media_buying">ملحق شراء الوسائط</option>
                  <option value="clinica_compliance">امتثال طبي</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  عنوان العقد
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
                  placeholder="مثال: MSA - شركة XYZ"
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1">
                    القيمة
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, value: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1">
                    العملة
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value as 'IQD' | 'USD' }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
                  >
                    <option value="IQD">دينار عراقي</option>
                    <option value="USD">دولار أمريكي</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  تاريخ السريان
                </label>
                <input
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, effectiveDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  تاريخ انتهاء الصلاحية (اختياري)
                </label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <Button
                onClick={handleCreateContract}
                disabled={submitting || !formData.title || !formData.clientEmail}
                className="flex-1"
              >
                {submitting ? 'جاري الإنشاء...' : 'إنشاء العقد'}
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
    </div>
  );
}
