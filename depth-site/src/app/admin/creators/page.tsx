"use client";

// صفحة إدارة المبدعين - تنفيذ كامل لتوثيق docs/catalog/03-Creator-Intake-Form.md
// الغرض: إدارة شاملة للمبدعين مع نماذج الإدخال والتقييم والمهارات والمعدات
// المرحلة 1: عرض وإدارة المبدعين الحاليين + إضافة مبدعين جدد

import { useState, useEffect, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import Dropdown from '@/components/ui/Dropdown';
import Loader from '@/components/loaders/Loader';
import SectionHeading from '@/components/ui/SectionHeading';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
// import { LoadingCreators } from '@/components/ui/LoadingStates'; // TODO: سيتم استخدامها لاحقاً
import { 
  RefreshCw, 
  Plus, 
  Edit3, 
  Eye,
  User,
  Camera,
  Video,
  Palette,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Star,
  Award,
  Users
} from 'lucide-react';
import { Creator, CreatorsStats, CreateCreatorRequest } from '@/types/creators';

interface CreatorsPageState {
  creators: Creator[];
  stats: CreatorsStats | null;
  loading: boolean;
  error: string | null;
  selectedStatus: string;
  selectedRole: string;
  viewMode: 'overview' | 'list' | 'create' | 'edit';
  showCreateForm: boolean;
  editingCreator: Creator | null;
}

export default function AdminCreatorsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [state, setState] = useState<CreatorsPageState>({
    creators: [],
    stats: null,
    loading: true,
    error: null,
    selectedStatus: 'all',
    selectedRole: 'all',
    viewMode: 'overview',
    showCreateForm: false,
    editingCreator: null
  });

  // بيانات نموذج المبدع الجديد
  const [newCreator, setNewCreator] = useState<Partial<CreateCreatorRequest>>({
    fullName: '',
    role: 'photographer',
    contact: {
      email: '',
      whatsapp: '',
      instagram: ''
    },
    city: '',
    canTravel: false,
    languages: ['ar'],
    skills: [],
    verticals: [],
    equipment: [],
    capacity: {
      maxAssetsPerDay: 10,
      weeklyAvailability: [],
      standardSLA: 48,
      rushSLA: 24
    },
    compliance: {
      clinicsTraining: false,
      ndaSigned: false,
      equipmentAgreement: false
    },
    internalCost: {}
  });

  // التحقق من الجلسة والدور
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'admin';

  const loadCreatorsData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const queryParams = new URLSearchParams();
      if (state.selectedStatus !== 'all') {
        queryParams.set('status', state.selectedStatus);
      }
      if (state.selectedRole !== 'all') {
        queryParams.set('role', state.selectedRole);
      }
      queryParams.set('limit', '50');

      const response = await fetch(`/api/admin/creators?${queryParams}`);
      if (!response.ok) {
        throw new Error('فشل في تحميل بيانات المبدعين');
      }

      const data = await response.json();
      setState(prev => ({ 
        ...prev, 
        creators: data.creators || [],
        stats: data.stats || null,
        loading: false 
      }));

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'خطأ في التحميل',
        loading: false 
      }));
    }
  }, [state.selectedStatus, state.selectedRole]);

  useEffect(() => {
    if (status === 'authenticated' && isAdmin) {
      loadCreatorsData();
    }
  }, [status, isAdmin, loadCreatorsData]);



  const handleCreateCreator = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));

      const response = await fetch('/api/admin/creators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCreator)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل في إنشاء المبدع');
      }

      // إعادة تحميل البيانات
      await loadCreatorsData();
      
      // إغلاق النموذج وإعادة تعيين البيانات
      setState(prev => ({ ...prev, showCreateForm: false }));
      setNewCreator({
        fullName: '',
        role: 'photographer',
        contact: { email: '', whatsapp: '', instagram: '' },
        city: '',
        canTravel: false,
        languages: ['ar']
      });
      toast.success('تم إنشاء المبدع بنجاح');

    } catch (err) {
      console.error('خطأ في إنشاء المبدع:', err);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'خطأ في الإنشاء'
      }));
      toast.error('فشل في إنشاء المبدع');
    }
  };

  const handleUpdateCreatorStatus = async (creatorId: string, newStatus: Creator['status']) => {
    try {
      const response = await fetch(`/api/admin/creators/${creatorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('فشل في تحديث حالة المبدع');
      }

      // إعادة تحميل البيانات
      await loadCreatorsData();
      toast.success('تم تحديث حالة المبدع');

    } catch (err) {
      console.error('خطأ في تحديث حالة المبدع:', err);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'خطأ في التحديث'
      }));
      toast.error('فشل تحديث الحالة');
    }
  };

  // التحقق من الصلاحيات
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (status !== 'authenticated') {
    return (
      <div className="max-w-md mx-auto mt-20">
        <div className="bg-[var(--card)] p-8 rounded-[var(--radius-lg)] border border-[var(--elev)] text-center">
          <h2 className="text-xl font-bold text-[var(--text)] mb-4">تسجيل الدخول مطلوب</h2>
          <p className="text-[var(--muted)] mb-6">يجب تسجيل الدخول للوصول إلى لوحة إدارة المبدعين</p>
          <Button onClick={() => signIn()} className="w-full">
            تسجيل الدخول
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto mt-20">
        <div className="bg-[var(--card)] p-8 rounded-[var(--radius-lg)] border border-[var(--elev)] text-center">
          <AlertCircle size={48} className="mx-auto text-[var(--danger)] mb-4" />
          <h2 className="text-xl font-bold text-[var(--text)] mb-4">غير مصرح</h2>
          <p className="text-[var(--muted)]">لا تملك صلاحية الوصول إلى إدارة المبدعين</p>
        </div>
      </div>
    );
  }

  const getRoleIcon = (role: Creator['role']) => {
    switch (role) {
      case 'photographer': return <Camera size={16} className="text-[var(--accent-500)]" />;
      case 'videographer': return <Video size={16} className="text-[var(--accent-500)]" />;
      case 'designer': return <Palette size={16} className="text-[var(--accent-500)]" />;
      case 'producer': return <Settings size={16} className="text-[var(--accent-500)]" />;
      default: return <User size={16} className="text-[var(--muted)]" />;
    }
  };

  const getStatusIcon = (status: Creator['status']) => {
    switch (status) {
      case 'approved': return <CheckCircle size={16} className="text-green-500" />;
      case 'under_review': return <Clock size={16} className="text-yellow-500" />;
      case 'rejected': return <XCircle size={16} className="text-red-500" />;
      case 'restricted': return <AlertCircle size={16} className="text-orange-500" />;
      default: return <User size={16} className="text-[var(--muted)]" />;
    }
  };

  const getStatusLabel = (status: Creator['status']) => {
    const labels = {
      registered: 'مسجل',
      intake_submitted: 'تم تقديم الطلب',
      under_review: 'قيد المراجعة',
      approved: 'معتمد',
      rejected: 'مرفوض',
      restricted: 'مقيد'
    };
    return labels[status] || status;
  };

  const getRoleLabel = (role: Creator['role']) => {
    const labels = {
      photographer: 'مصور',
      videographer: 'مصور فيديو',
      designer: 'مصمم',
      producer: 'منتج'
    };
    return labels[role] || role;
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Breadcrumbs */}
      <Breadcrumbs />
      
      {/* رأس الصفحة */}
      <SectionHeading
        title="إدارة المبدعين"
        description="إدارة المصورين والمصممين والمنتجين"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={loadCreatorsData}
              disabled={state.loading}
            >
              <RefreshCw size={16} className={state.loading ? "animate-spin" : ""} />
              تحديث
            </Button>
            <Button onClick={() => setState(prev => ({ ...prev, showCreateForm: true }))}>
              <Plus size={16} />
              إضافة مبدع
            </Button>
          </div>
        }
      />

      {/* عرض الأخطاء */}
      {state.error && (
        <div className="mb-6 p-4 bg-[var(--danger-bg)] border border-[var(--danger-border)] rounded-[var(--radius)]">
          <div className="flex items-center gap-2 text-[var(--danger-fg)]">
            <AlertCircle size={20} />
            <span className="font-medium">{state.error}</span>
          </div>
        </div>
      )}

      {/* الإحصائيات */}
      {state.stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)]">
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-[var(--accent-500)]" size={24} />
              <h3 className="text-lg font-semibold text-[var(--text)]">إجمالي المبدعين</h3>
            </div>
            <div className="text-3xl font-bold text-[var(--text)] mb-2">
              {state.stats.total}
            </div>
            <div className="text-sm text-[var(--muted)]">
              معتمد: {state.stats.byStatus.approved} | قيد المراجعة: {state.stats.byStatus.under_review}
            </div>
          </div>

          <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)]">
            <div className="flex items-center gap-3 mb-4">
              <Camera className="text-[var(--accent-500)]" size={24} />
              <h3 className="text-lg font-semibold text-[var(--text)]">المصورون</h3>
            </div>
            <div className="text-3xl font-bold text-[var(--text)] mb-2">
              {state.stats.byRole.photographer}
            </div>
            <div className="text-sm text-[var(--muted)]">
              فيديو: {state.stats.byRole.videographer}
            </div>
          </div>

          <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)]">
            <div className="flex items-center gap-3 mb-4">
              <Award className="text-[var(--accent-500)]" size={24} />
              <h3 className="text-lg font-semibold text-[var(--text)]">متوسط النقاط</h3>
            </div>
            <div className="text-3xl font-bold text-[var(--text)] mb-2">
              {state.stats.averageScore || 0}
            </div>
            <div className="text-sm text-[var(--muted)]">
              من 100
            </div>
          </div>

          <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)]">
            <div className="flex items-center gap-3 mb-4">
              <Star className="text-[var(--accent-500)]" size={24} />
              <h3 className="text-lg font-semibold text-[var(--text)]">الدرجات</h3>
            </div>
            <div className="text-sm text-[var(--text)] space-y-1">
              <div>T1: {state.stats.byTier.T1}</div>
              <div>T2: {state.stats.byTier.T2}</div>
              <div>T3: {state.stats.byTier.T3}</div>
            </div>
          </div>
        </div>
      )}

      {/* الفلاتر */}
      <div className="mb-6">
        <div className="flex items-center gap-4 p-4 bg-[var(--card)] rounded-[var(--radius)] border border-[var(--elev)]">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-[var(--text)]">الحالة:</label>
            <div className="w-40">
              <Dropdown
                options={[
                  { value: 'all', label: 'جميع الحالات' },
                  { value: 'registered', label: 'مسجل' },
                  { value: 'intake_submitted', label: 'تم تقديم الطلب' },
                  { value: 'under_review', label: 'قيد المراجعة' },
                  { value: 'approved', label: 'معتمد' },
                  { value: 'rejected', label: 'مرفوض' },
                  { value: 'restricted', label: 'مقيد' }
                ]}
                value={state.selectedStatus}
                onChange={(value: string) => setState(prev => ({ ...prev, selectedStatus: value }))}
                placeholder="اختر الحالة"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-[var(--text)]">الدور:</label>
            <div className="w-40">
              <Dropdown
                options={[
                  { value: 'all', label: 'جميع الأدوار' },
                  { value: 'photographer', label: 'مصور' },
                  { value: 'videographer', label: 'مصور فيديو' },
                  { value: 'designer', label: 'مصمم' },
                  { value: 'producer', label: 'منتج' }
                ]}
                value={state.selectedRole}
                onChange={(value: string) => setState(prev => ({ ...prev, selectedRole: value }))}
                placeholder="اختر الدور"
              />
            </div>
          </div>
        </div>
      </div>

      {/* قائمة المبدعين */}
      {state.loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      ) : (
        <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] overflow-hidden">
          <div className="p-6 border-b border-[var(--elev)]">
            <h2 className="text-xl font-semibold text-[var(--text)]">المبدعون ({state.creators.length})</h2>
          </div>
          
          {state.creators.length === 0 ? (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-[var(--muted)] mb-4" />
              <p className="text-[var(--muted)]">لا يوجد مبدعون</p>
            </div>
          ) : (
            <div className="admin-scroll-container">
              <div className="admin-scroll-content">
                <table className="w-full">
                <thead className="bg-[var(--bg)] border-b border-[var(--elev)]">
                  <tr>
                    <th className="text-right p-4 font-medium text-[var(--text)]">المبدع</th>
                    <th className="text-right p-4 font-medium text-[var(--text)]">الدور</th>
                    <th className="text-right p-4 font-medium text-[var(--text)]">المدينة</th>
                    <th className="text-right p-4 font-medium text-[var(--text)]">الحالة</th>
                    <th className="text-right p-4 font-medium text-[var(--text)]">النقاط</th>
                    <th className="text-right p-4 font-medium text-[var(--text)]">الدرجة</th>
                    <th className="text-right p-4 font-medium text-[var(--text)]">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {state.creators.map((creator) => (
                    <tr key={creator.id} className="border-b border-[var(--elev)] hover:bg-[var(--bg)]">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {getRoleIcon(creator.role)}
                          <div>
                            <div className="font-medium text-[var(--text)]">{creator.fullName}</div>
                            <div className="text-sm text-[var(--muted)]">{creator.contact?.email || '-'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-[var(--text)]">{getRoleLabel(creator.role)}</td>
                      <td className="p-4 text-sm text-[var(--text)]">{creator.city}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(creator.status)}
                          <span className="text-sm">{getStatusLabel(creator.status)}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-[var(--text)]">
                        {creator.score ? `${creator.score}/100` : '-'}
                      </td>
                      <td className="p-4 text-sm text-[var(--text)]">
                        {creator.tier ? (
                          <span className="px-2 py-1 bg-[var(--accent-100)] text-[var(--accent-700)] rounded text-xs">
                            {creator.tier}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => router.push(`/admin/creators/${creator.id}/profile`)}
                          >
                            <Eye size={14} />
                            عرض
                          </Button>
                          
                          {(creator.status === 'registered' || creator.status === 'intake_submitted') && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => router.push(`/admin/creators/intake?creatorId=${creator.id}`)}
                            >
                              <Edit3 size={14} />
                              نموذج الإدخال
                            </Button>
                          )}
                          
                          {(creator.status === 'intake_submitted' || creator.status === 'under_review' || creator.status === 'approved') && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => router.push(`/admin/creators/${creator.id}/evaluate`)}
                            >
                              <Star size={14} />
                              تقييم
                            </Button>
                          )}

                          {(creator.status === 'intake_submitted' || creator.status === 'under_review') && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="text-blue-600 hover:bg-blue-50"
                              onClick={() => router.push(`/admin/creators/${creator.id}/evaluate`)}
                            >
                              <Star size={14} />
                              تقييم
                            </Button>
                          )}

                          {creator.status === 'under_review' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="text-green-600 hover:bg-green-50"
                                onClick={() => handleUpdateCreatorStatus(creator.id, 'approved')}
                              >
                                <CheckCircle size={14} />
                                اعتماد
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="text-red-600 hover:bg-red-50"
                                onClick={() => handleUpdateCreatorStatus(creator.id, 'rejected')}
                              >
                                <XCircle size={14} />
                                رفض
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* نموذج إضافة مبدع */}
      {state.showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--bg)] rounded-[var(--radius-lg)] border border-[var(--elev)] p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-[var(--text)] mb-6">إضافة مبدع جديد</h3>
            
            <div className="space-y-6">
              {/* المعلومات الأساسية */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    value={newCreator.fullName || ''}
                    onChange={(e) => setNewCreator(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                    placeholder="أدخل الاسم الكامل"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">
                    الدور *
                  </label>
                  <Dropdown
                    options={[
                      { value: 'photographer', label: 'مصور' },
                      { value: 'videographer', label: 'مصور فيديو' },
                      { value: 'designer', label: 'مصمم' },
                      { value: 'producer', label: 'منتج' }
                    ]}
                    value={newCreator.role || 'photographer'}
                    onChange={(value: string) => setNewCreator(prev => ({ ...prev, role: value as Creator['role'] }))}
                    placeholder="اختر الدور"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    value={newCreator.contact?.email || ''}
                    onChange={(e) => setNewCreator(prev => ({ 
                      ...prev, 
                      contact: { ...prev.contact!, email: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                    placeholder="example@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">
                    واتساب *
                  </label>
                  <input
                    type="text"
                    value={newCreator.contact?.whatsapp || ''}
                    onChange={(e) => setNewCreator(prev => ({ 
                      ...prev, 
                      contact: { ...prev.contact!, whatsapp: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                    placeholder="+964xxxxxxxxx"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">
                    المدينة *
                  </label>
                  <input
                    type="text"
                    value={newCreator.city || ''}
                    onChange={(e) => setNewCreator(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                    placeholder="بغداد"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="canTravel"
                    checked={newCreator.canTravel || false}
                    onChange={(e) => setNewCreator(prev => ({ ...prev, canTravel: e.target.checked }))}
                    className="mr-3"
                  />
                  <label htmlFor="canTravel" className="text-sm text-[var(--text)]">
                    يمكن السفر للمحافظات
                  </label>
                </div>
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex items-center gap-3 pt-4 border-t border-[var(--elev)]">
                <Button
                  onClick={handleCreateCreator}
                  disabled={!newCreator.fullName || !newCreator.contact?.email || !newCreator.contact?.whatsapp || !newCreator.city}
                >
                  إنشاء المبدع
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setState(prev => ({ ...prev, showCreateForm: false }))}
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
