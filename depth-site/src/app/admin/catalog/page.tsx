"use client";

// صفحة إدارة الكتالوج - الفئات والمحاور والتصنيفات
// الغرض: توفير واجهة إدارية شاملة لإدارة كتالوج الخدمات والفئات
// تحديث: عمليات CRUD كاملة مع نماذج تفاعلية

import { useState, useEffect, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import Dropdown from '@/components/ui/Dropdown';
import Loader from '@/components/loaders/Loader';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { 
  RefreshCw, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye,
  Grid3x3,
  Tag,
  Settings,
  AlertCircle,
  Package,
  Save,
  X,
  DollarSign,
  ExternalLink,
} from 'lucide-react';
import { Category, Subcategory, Vertical } from '@/types/catalog';

interface CatalogStats {
  totalCategories: number;
  totalSubcategories: number;
  totalVerticals: number;
  lastUpdated: string;
}

interface FormData {
  id: string;
  categoryId?: string;
  nameAr: string;
  nameEn: string;
  desc?: string;
  priceRangeKey?: string;
  modifierPct?: number;
}

interface CatalogPageState {
  categories: Category[];
  subcategories: Subcategory[];
  verticals: Vertical[];
  stats: CatalogStats | null;
  loading: boolean;
  error: string | null;
  selectedCategory: string;
  viewMode: 'overview' | 'categories' | 'subcategories' | 'verticals';
  
  // نماذج وحوارات
  showCreateForm: boolean;
  showEditForm: boolean;
  showDeleteConfirm: boolean;
  formType: 'subcategory' | 'vertical' | null;
  formData: FormData;
  itemToDelete: (Subcategory | Vertical) & { type: 'subcategory' | 'vertical' } | null;
  
  // حالات العمليات
  submitting: boolean;
  deleting: boolean;

  // بيانات التسعير
  rateCard: { basePricesIQD?: Record<string, number> } | null;
  loadingPrices: boolean;
}

export default function AdminCatalogPage() {
  const { data: session, status } = useSession();
  const [state, setState] = useState<CatalogPageState>({
    categories: [],
    subcategories: [],
    verticals: [],
    stats: null,
    loading: true,
    error: null,
    selectedCategory: 'all',
    viewMode: 'overview',
    
    // نماذج وحوارات
    showCreateForm: false,
    showEditForm: false,
    showDeleteConfirm: false,
    formType: null,
    formData: {
      id: '',
      nameAr: '',
      nameEn: '',
      desc: '',
      categoryId: 'photo',
      priceRangeKey: '',
      modifierPct: 0
    },
    itemToDelete: null,
    
    // حالات العمليات
    submitting: false,
    deleting: false,

    // بيانات التسعير
    rateCard: null,
    loadingPrices: false
  });

  // التحقق من الجلسة والدور
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'admin';

  const loadCatalogData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // تحميل الفئات الفرعية والمحاور وجدول الأسعار بشكل متوازي
      const [subcatResponse, verticalResponse, rateCardResponse] = await Promise.all([
        fetch('/api/catalog/subcategories'),
        fetch('/api/catalog/verticals'),
        fetch('/api/pricing/rate-card/active')
      ]);

      if (!subcatResponse.ok || !verticalResponse.ok) {
        throw new Error('فشل في تحميل بيانات الكتالوج');
      }

      const [subcatData, verticalData] = await Promise.all([
        subcatResponse.json(),
        verticalResponse.json()
      ]);

      // تحميل جدول الأسعار (اختياري)
      let rateCardData = null;
      if (rateCardResponse.ok) {
        const rateData = await rateCardResponse.json();
        rateCardData = rateData.rateCard;
      }

      // استخراج الفئات الرئيسية من الفئات الفرعية
      const subcategories = subcatData.items || [];
      const uniqueCategories: Category[] = Array.from(
        new Set(subcategories.map((sub: Subcategory) => sub.categoryId))
      ).map(categoryId => {
        // تحديد الأسماء العربية للفئات الرئيسية
        const categoryNames: Record<string, string> = {
          photo: 'صورة',
          video: 'فيديو', 
          design: 'تصميم'
        };
        return {
          id: categoryId as string,
          nameAr: categoryNames[categoryId as string] || (categoryId as string),
          nameEn: categoryId as string
        };
      });

      // حساب الإحصائيات
      const stats: CatalogStats = {
        totalCategories: uniqueCategories.length,
        totalSubcategories: subcategories.length,
        totalVerticals: (verticalData.items || []).length,
        lastUpdated: new Date().toISOString()
      };

      setState(prev => ({
        ...prev,
        categories: uniqueCategories,
        subcategories,
        verticals: verticalData.items || [],
        stats,
        rateCard: rateCardData,
        loading: false
      }));

    } catch (err) {
      console.error('خطأ في تحميل بيانات الكتالوج:', err);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'خطأ غير معروف',
        loading: false
      }));
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated' && isAdmin) {
      loadCatalogData();
    }
  }, [status, isAdmin, loadCatalogData]);

  // دالة فتح محرر جدول الأسعار مع التركيز على فئة فرعية محددة
  const openPriceEditor = useCallback((subcategoryId?: string) => {
    const url = subcategoryId 
      ? `/admin/pricing/rate-card?focus=${subcategoryId}`
      : '/admin/pricing/rate-card';
    window.open(url, '_blank');
  }, []);

  // دالة للحصول على السعر الأساسي لفئة فرعية
  const getSubcategoryPrice = useCallback((subcategoryId: string): number | null => {
    return state.rateCard?.basePricesIQD?.[subcategoryId] || null;
  }, [state.rateCard]);

  // دالة لفتح نموذج الإنشاء
  const openCreateForm = useCallback((type: 'subcategory' | 'vertical') => {
    setState(prev => ({
      ...prev,
      showCreateForm: true,
      formType: type,
      formData: {
        id: '',
        nameAr: '',
        nameEn: '',
        desc: '',
        categoryId: 'photo',
        priceRangeKey: '',
        modifierPct: 0
      }
    }));
  }, []);

  // دالة لفتح نموذج التعديل
  const openEditForm = useCallback((item: Subcategory | Vertical, type: 'subcategory' | 'vertical') => {
    setState(prev => ({
      ...prev,
      showEditForm: true,
      formType: type,
      formData: {
        id: item.id,
        nameAr: item.nameAr,
        nameEn: item.nameEn || '',
        desc: 'desc' in item ? item.desc || '' : '',
        categoryId: 'categoryId' in item ? item.categoryId : undefined,
        priceRangeKey: 'priceRangeKey' in item ? item.priceRangeKey || '' : '',
        modifierPct: 'modifierPct' in item ? item.modifierPct || 0 : 0
      }
    }));
  }, []);

  // دالة لفتح تأكيد الحذف
  const openDeleteConfirm = useCallback((item: Subcategory | Vertical, type: 'subcategory' | 'vertical') => {
    setState(prev => ({
      ...prev,
      showDeleteConfirm: true,
      itemToDelete: { ...item, type }
    }));
  }, []);

  // دالة لإغلاق جميع النماذج
  const closeAllForms = useCallback(() => {
    setState(prev => ({
      ...prev,
      showCreateForm: false,
      showEditForm: false,
      showDeleteConfirm: false,
      formType: null,
      itemToDelete: null,
      submitting: false,
      deleting: false
    }));
  }, []);

  // دالة لحفظ العنصر (إنشاء أو تعديل)
  const handleSave = useCallback(async () => {
    if (!state.formType) return;

    try {
      setState(prev => ({ ...prev, submitting: true, error: null }));

      const endpoint = state.formType === 'subcategory' 
        ? '/api/catalog/subcategories' 
        : '/api/catalog/verticals';

      const method = state.showEditForm ? 'PUT' : 'POST';
      const url = state.showEditForm 
        ? `${endpoint}/${state.formData.id}`
        : endpoint;

      // تحضير البيانات حسب النوع
      const requestData = state.formType === 'subcategory' 
        ? {
            id: state.formData.id,
            categoryId: state.formData.categoryId,
            nameAr: state.formData.nameAr,
            nameEn: state.formData.nameEn,
            desc: state.formData.desc,
            priceRangeKey: state.formData.priceRangeKey
          }
        : {
            id: state.formData.id,
            nameAr: state.formData.nameAr,
            nameEn: state.formData.nameEn,
            modifierPct: (state.formData.modifierPct || 0) / 100 // تحويل من نسبة مئوية
          };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'فشل في حفظ البيانات');
      }

      // إعادة تحميل البيانات
      await loadCatalogData();
      closeAllForms();

    } catch (err) {
      console.error('خطأ في حفظ البيانات:', err);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'خطأ في حفظ البيانات',
        submitting: false
      }));
    }
  }, [state.formType, state.showEditForm, state.formData, loadCatalogData, closeAllForms]);

  // دالة لحذف العنصر
  const handleDelete = useCallback(async () => {
    if (!state.itemToDelete) return;

    try {
      setState(prev => ({ ...prev, deleting: true, error: null }));

      const endpoint = state.itemToDelete.type === 'subcategory'
        ? '/api/catalog/subcategories'
        : '/api/catalog/verticals';

      const response = await fetch(`${endpoint}/${state.itemToDelete.id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'فشل في حذف العنصر');
      }

      // إعادة تحميل البيانات
      await loadCatalogData();
      closeAllForms();

    } catch (err) {
      console.error('خطأ في حذف العنصر:', err);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'خطأ في حذف العنصر',
        deleting: false
      }));
    }
  }, [state.itemToDelete, loadCatalogData, closeAllForms]);

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
          <p className="text-[var(--muted)] mb-6">يجب تسجيل الدخول للوصول إلى لوحة إدارة الكتالوج</p>
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
          <p className="text-[var(--muted)]">لا تملك صلاحية الوصول إلى إدارة الكتالوج</p>
        </div>
      </div>
    );
  }

  // فلترة الفئات الفرعية حسب الفئة المختارة
  const filteredSubcategories = state.selectedCategory === 'all' 
    ? state.subcategories 
    : state.subcategories.filter(sub => sub.categoryId === state.selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* مسار التنقل */}
      <Breadcrumbs />
      
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)] mb-2">إدارة الكتالوج</h1>
          <p className="text-[var(--muted)]">إدارة الفئات والمحاور والتصنيفات</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={loadCatalogData}
            disabled={state.loading}
          >
            <RefreshCw size={16} className={state.loading ? "animate-spin" : ""} />
            تحديث
          </Button>
          
          {/* أزرار الإضافة حسب العرض الحالي */}
          {state.viewMode === 'subcategories' && (
            <Button onClick={() => openCreateForm('subcategory')}>
              <Plus size={16} />
              إضافة فئة فرعية
            </Button>
          )}
          
          {state.viewMode === 'verticals' && (
            <Button onClick={() => openCreateForm('vertical')}>
            <Plus size={16} />
              إضافة محور
          </Button>
          )}
        </div>
      </div>

      {/* عرض الأخطاء */}
      {state.error && (
        <div className="mb-6 p-4 bg-[var(--danger-bg)] border border-[var(--danger-border)] rounded-[var(--radius)]">
          <div className="flex items-center gap-2 text-[var(--danger-fg)]">
            <AlertCircle size={20} />
            <span className="font-medium">{state.error}</span>
          </div>
        </div>
      )}

      {/* شريط التنقل بين الأقسام */}
      <div className="mb-6">
        <div className="flex items-center gap-2 p-1 bg-[var(--bg)] rounded-[var(--radius)] border border-[var(--elev)]">
          {[
            { key: 'overview', label: 'نظرة عامة', icon: Grid3x3 },
            { key: 'categories', label: 'الفئات الرئيسية', icon: Package },
            { key: 'subcategories', label: 'الفئات الفرعية', icon: Tag },
            { key: 'verticals', label: 'المحاور', icon: Settings }
          ].map(({ key, label, icon: Icon }: { key: string; label: string; icon: React.ComponentType<{ size?: number }> }) => (
            <button
              key={key}
              onClick={() => setState(prev => ({ ...prev, viewMode: key as 'overview' | 'categories' | 'subcategories' | 'verticals' }))}
              className={`flex items-center gap-2 px-4 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-colors ${
                state.viewMode === key
                  ? 'bg-[var(--accent-500)] text-white'
                  : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      {state.loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      ) : (
        <>
          {/* نظرة عامة */}
          {state.viewMode === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)]">
                <div className="flex items-center gap-3 mb-4">
                  <Package className="text-[var(--accent-500)]" size={24} />
                  <h3 className="text-lg font-semibold text-[var(--text)]">الفئات الرئيسية</h3>
                </div>
                <div className="text-3xl font-bold text-[var(--text)] mb-2">
                  {state.stats?.totalCategories || 0}
                </div>
                <p className="text-[var(--muted)] text-sm">صورة، فيديو، تصميم</p>
              </div>

              <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)]">
                <div className="flex items-center gap-3 mb-4">
                  <Tag className="text-[var(--accent-500)]" size={24} />
                  <h3 className="text-lg font-semibold text-[var(--text)]">الفئات الفرعية</h3>
                </div>
                <div className="text-3xl font-bold text-[var(--text)] mb-2">
                  {state.stats?.totalSubcategories || 0}
                </div>
                <p className="text-[var(--muted)] text-sm">تصنيفات مفصلة للخدمات</p>
              </div>

              <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--elev)]">
                <div className="flex items-center gap-3 mb-4">
                  <Settings className="text-[var(--accent-500)]" size={24} />
                  <h3 className="text-lg font-semibold text-[var(--text)]">المحاور</h3>
                </div>
                <div className="text-3xl font-bold text-[var(--text)] mb-2">
                  {state.stats?.totalVerticals || 0}
                </div>
                <p className="text-[var(--muted)] text-sm">القطاعات التجارية</p>
              </div>
            </div>
          )}

          {/* الفئات الرئيسية */}
          {state.viewMode === 'categories' && (
            <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] overflow-hidden">
              <div className="p-6 border-b border-[var(--elev)]">
                <h2 className="text-xl font-semibold text-[var(--text)]">الفئات الرئيسية</h2>
                <p className="text-[var(--muted)] mt-1">الفئات الأساسية للخدمات</p>
              </div>
              <div className="admin-scroll-container border border-[var(--elev)] rounded-[var(--radius)]">
                <div className="admin-scroll-content scroll-y">
                  <table className="w-full min-w-full table-auto">
                  <thead className="bg-[var(--bg)] border-b border-[var(--elev)] sticky top-0 z-10">
                    <tr>
                      <th className="text-right p-4 md:p-4 sm:p-2 font-medium text-[var(--text)] text-xs md:text-sm">المعرف</th>
                      <th className="text-right p-4 md:p-4 sm:p-2 font-medium text-[var(--text)] text-xs md:text-sm">الاسم العربي</th>
                      <th className="text-right p-4 md:p-4 sm:p-2 font-medium text-[var(--text)] text-xs md:text-sm">الاسم الإنجليزي</th>
                      <th className="text-right p-4 md:p-4 sm:p-2 font-medium text-[var(--text)] text-xs md:text-sm hidden sm:table-cell">عدد الفئات الفرعية</th>
                      <th className="text-right p-4 md:p-4 sm:p-2 font-medium text-[var(--text)] text-xs md:text-sm">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.categories.map((category) => {
                      const subcategoryCount = state.subcategories.filter(
                        sub => sub.categoryId === category.id
                      ).length;
                      
                      return (
                        <tr key={category.id} className="border-b border-[var(--elev)] hover:bg-[var(--bg)]">
                          <td className="p-4 md:p-4 sm:p-2 text-xs md:text-sm text-[var(--text)] font-mono truncate max-w-[60px] md:max-w-none">{category.id}</td>
                          <td className="p-4 md:p-4 sm:p-2 text-xs md:text-sm text-[var(--text)] font-medium truncate max-w-[80px] md:max-w-none">{category.nameAr}</td>
                          <td className="p-4 md:p-4 sm:p-2 text-xs md:text-sm text-[var(--muted)] truncate max-w-[80px] md:max-w-none">{category.nameEn}</td>
                          <td className="p-4 md:p-4 sm:p-2 text-xs md:text-sm text-[var(--text)] hidden sm:table-cell">{subcategoryCount}</td>
                          <td className="p-4 md:p-4 sm:p-2">
                            <div className="flex items-center gap-1 md:gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setState(prev => ({ 
                                  ...prev, 
                                  viewMode: 'subcategories',
                                  selectedCategory: category.id 
                                }))}
                                className="text-xs md:text-sm p-1 md:p-2"
                              >
                                <Eye size={12} className="md:w-4 md:h-4" />
                                <span className="hidden sm:inline">عرض الفئات الفرعية</span>
                                <span className="sm:hidden">عرض</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* الفئات الفرعية */}
          {state.viewMode === 'subcategories' && (
            <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] overflow-hidden">
              <div className="p-6 border-b border-[var(--elev)]">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--text)]">الفئات الفرعية</h2>
                    <p className="text-[var(--muted)] mt-1">
                      {state.selectedCategory === 'all' 
                        ? 'جميع الفئات الفرعية' 
                        : `فئات فرعية لـ ${state.categories.find(c => c.id === state.selectedCategory)?.nameAr}`
                      }
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => openPriceEditor()}
                      className="text-sm px-4 py-2 border-[var(--accent-500)] text-[var(--accent-500)] hover:bg-[var(--accent-bg)]"
                    >
                      <DollarSign size={16} className="mr-2" />
                      محرر جدول الأسعار
                      <ExternalLink size={14} className="ml-2" />
                    </Button>
                    <div className="w-48">
                      <Dropdown
                        options={[
                          { value: 'all', label: 'جميع الفئات' },
                          ...state.categories.map(cat => ({
                            value: cat.id,
                            label: cat.nameAr
                          }))
                        ]}
                        value={state.selectedCategory}
                        onChange={(value: string) => setState(prev => ({ ...prev, selectedCategory: value }))}
                        placeholder="اختر فئة"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="admin-scroll-container border border-[var(--elev)] rounded-[var(--radius)]">
                <div className="admin-scroll-content scroll-y">
                  <table className="w-full min-w-full table-auto">
                  <thead className="bg-[var(--bg)] border-b border-[var(--elev)] sticky top-0 z-10">
                    <tr>
                      <th className="text-right p-4 md:p-4 sm:p-2 font-medium text-[var(--text)] text-xs md:text-sm">المعرف</th>
                      <th className="text-right p-4 md:p-4 sm:p-2 font-medium text-[var(--text)] text-xs md:text-sm">الاسم العربي</th>
                      <th className="text-right p-4 md:p-4 sm:p-2 font-medium text-[var(--text)] text-xs md:text-sm">الاسم الإنجليزي</th>
                      <th className="text-right p-4 md:p-4 sm:p-2 font-medium text-[var(--text)] text-xs md:text-sm hidden md:table-cell">الفئة الرئيسية</th>
                      <th className="text-right p-4 md:p-4 sm:p-2 font-medium text-[var(--text)] text-xs md:text-sm hidden lg:table-cell">الوصف</th>
                      <th className="text-right p-4 md:p-4 sm:p-2 font-medium text-[var(--text)] text-xs md:text-sm">السعر الأساسي</th>
                      <th className="text-right p-4 md:p-4 sm:p-2 font-medium text-[var(--text)] text-xs md:text-sm">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubcategories.map((subcategory) => (
                      <tr key={subcategory.id} className="border-b border-[var(--elev)] hover:bg-[var(--bg)]">
                        <td className="p-4 md:p-4 sm:p-2 text-xs md:text-sm text-[var(--text)] font-mono truncate max-w-[60px] md:max-w-none">{subcategory.id}</td>
                        <td className="p-4 md:p-4 sm:p-2 text-xs md:text-sm text-[var(--text)] font-medium truncate max-w-[80px] md:max-w-none">{subcategory.nameAr}</td>
                        <td className="p-4 md:p-4 sm:p-2 text-xs md:text-sm text-[var(--muted)] truncate max-w-[80px] md:max-w-none">{subcategory.nameEn}</td>
                        <td className="p-4 md:p-4 sm:p-2 text-xs md:text-sm text-[var(--text)] hidden md:table-cell">
                          {state.categories.find(c => c.id === subcategory.categoryId)?.nameAr}
                        </td>
                        <td className="p-4 md:p-4 sm:p-2 text-xs md:text-sm text-[var(--muted)] max-w-xs truncate hidden lg:table-cell">
                          {subcategory.desc || '-'}
                        </td>
                        <td className="p-4 md:p-4 sm:p-2">
                          {(() => {
                            const price = getSubcategoryPrice(subcategory.id);
                            return (
                              <div className="flex items-center gap-2">
                                {price !== null ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs md:text-sm font-medium text-[var(--success)]">
                                      {price.toLocaleString()} د.ع
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => openPriceEditor(subcategory.id)}
                                      className="text-xs p-1 opacity-60 hover:opacity-100"
                                      title="تعديل السعر"
                                    >
                                      <Edit3 size={12} />
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => openPriceEditor(subcategory.id)}
                                    className="text-xs px-2 py-1 text-[var(--warning)] border-[var(--warning)] hover:bg-[var(--warning-bg)]"
                                  >
                                    <DollarSign size={12} className="mr-1" />
                                    تحديد السعر
                                  </Button>
                                )}
                              </div>
                            );
                          })()}
                        </td>
                        <td className="p-4 md:p-4 sm:p-2">
                          <div className="flex items-center gap-1 md:gap-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => openEditForm(subcategory, 'subcategory')}
                              className="text-xs md:text-sm p-1 md:p-2"
                            >
                              <Edit3 size={12} className="md:w-4 md:h-4" />
                              <span className="hidden sm:inline">تعديل</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-[var(--danger)] hover:bg-[var(--danger-bg)] text-xs md:text-sm p-1 md:p-2"
                              onClick={() => openDeleteConfirm(subcategory, 'subcategory')}
                            >
                              <Trash2 size={12} className="md:w-4 md:h-4" />
                              <span className="hidden sm:inline">حذف</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* المحاور */}
          {state.viewMode === 'verticals' && (
            <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] overflow-hidden">
              <div className="p-6 border-b border-[var(--elev)]">
                <h2 className="text-xl font-semibold text-[var(--text)]">المحاور التجارية</h2>
                <p className="text-[var(--muted)] mt-1">القطاعات والأسواق المستهدفة</p>
              </div>
              <div className="admin-scroll-container border border-[var(--elev)] rounded-[var(--radius)]">
                <div className="admin-scroll-content scroll-y">
                  <table className="w-full min-w-full table-auto">
                  <thead className="bg-[var(--bg)] border-b border-[var(--elev)] sticky top-0 z-10">
                    <tr>
                      <th className="text-right p-4 md:p-4 sm:p-2 font-medium text-[var(--text)] text-xs md:text-sm">المعرف</th>
                      <th className="text-right p-4 md:p-4 sm:p-2 font-medium text-[var(--text)] text-xs md:text-sm">الاسم العربي</th>
                      <th className="text-right p-4 md:p-4 sm:p-2 font-medium text-[var(--text)] text-xs md:text-sm">الاسم الإنجليزي</th>
                      <th className="text-right p-4 md:p-4 sm:p-2 font-medium text-[var(--text)] text-xs md:text-sm hidden sm:table-cell">معامل التسعير</th>
                      <th className="text-right p-4 md:p-4 sm:p-2 font-medium text-[var(--text)] text-xs md:text-sm">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.verticals.map((vertical) => (
                      <tr key={vertical.id} className="border-b border-[var(--elev)] hover:bg-[var(--bg)]">
                        <td className="p-4 md:p-4 sm:p-2 text-xs md:text-sm text-[var(--text)] font-mono truncate max-w-[60px] md:max-w-none">{vertical.id}</td>
                        <td className="p-4 md:p-4 sm:p-2 text-xs md:text-sm text-[var(--text)] font-medium truncate max-w-[80px] md:max-w-none">{vertical.nameAr}</td>
                        <td className="p-4 md:p-4 sm:p-2 text-xs md:text-sm text-[var(--muted)] truncate max-w-[80px] md:max-w-none">{vertical.nameEn}</td>
                        <td className="p-4 md:p-4 sm:p-2 text-xs md:text-sm text-[var(--text)] hidden sm:table-cell">
                          {vertical.modifierPct ? `${(vertical.modifierPct * 100).toFixed(1)}%` : '-'}
                        </td>
                        <td className="p-4 md:p-4 sm:p-2">
                          <div className="flex items-center gap-1 md:gap-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => openEditForm(vertical, 'vertical')}
                              className="text-xs md:text-sm p-1 md:p-2"
                            >
                              <Edit3 size={12} className="md:w-4 md:h-4" />
                              <span className="hidden sm:inline">تعديل</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-[var(--danger)] hover:bg-[var(--danger-bg)] text-xs md:text-sm p-1 md:p-2"
                              onClick={() => openDeleteConfirm(vertical, 'vertical')}
                            >
                              <Trash2 size={12} className="md:w-4 md:h-4" />
                              <span className="hidden sm:inline">حذف</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* نموذج الإنشاء */}
      {state.showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--bg)] rounded-[var(--radius-lg)] border border-[var(--elev)] p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[var(--text)]">
                {state.formType === 'subcategory' ? 'إضافة فئة فرعية جديدة' : 'إضافة محور جديد'}
              </h3>
              <Button size="sm" variant="ghost" onClick={closeAllForms}>
                <X size={16} />
              </Button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
              {/* معرف العنصر */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  المعرف *
                </label>
                <input
                  type="text"
                  value={state.formData.id}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    formData: { ...prev.formData, id: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-[var(--elev)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)]"
                  placeholder="مثال: portrait-photography"
                  required
                />
              </div>

              {/* الفئة الرئيسية (للفئات الفرعية فقط) */}
              {state.formType === 'subcategory' && (
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">
                    الفئة الرئيسية *
                  </label>
                  <Dropdown
                    value={state.formData.categoryId as string}
                    onChange={(v) => setState(prev => ({
                      ...prev,
                      formData: { ...prev.formData, categoryId: String(v) }
                    }))}
                    options={[
                      { value: 'photo', label: 'صورة' },
                      { value: 'video', label: 'فيديو' },
                      { value: 'design', label: 'تصميم' },
                    ]}
                    placeholder="اختر الفئة"
                  />
                </div>
              )}

              {/* الاسم العربي */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  الاسم العربي *
                </label>
                <input
                  type="text"
                  value={state.formData.nameAr}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    formData: { ...prev.formData, nameAr: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-[var(--elev)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)]"
                  placeholder="الاسم باللغة العربية"
                  required
                />
              </div>

              {/* الاسم الإنجليزي */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  الاسم الإنجليزي
                </label>
                <input
                  type="text"
                  value={state.formData.nameEn}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    formData: { ...prev.formData, nameEn: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-[var(--elev)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)]"
                  placeholder="الاسم باللغة الإنجليزية"
                />
              </div>

              {/* الوصف (للفئات الفرعية فقط) */}
              {state.formType === 'subcategory' && (
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">
                    الوصف
                  </label>
                  <textarea
                    value={state.formData.desc}
                    onChange={(e) => setState(prev => ({
                      ...prev,
                      formData: { ...prev.formData, desc: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-[var(--elev)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)]"
                    rows={3}
                    placeholder="وصف مختصر للفئة الفرعية"
                  />
                </div>
              )}

              {/* معامل التسعير (للمحاور فقط) */}
              {state.formType === 'vertical' && (
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">
                    معامل التسعير (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={state.formData.modifierPct}
                    onChange={(e) => setState(prev => ({
                      ...prev,
                      formData: { ...prev.formData, modifierPct: parseFloat(e.target.value) || 0 }
                    }))}
                    className="w-full px-3 py-2 border border-[var(--elev)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)]"
                    placeholder="0.0"
                  />
                  <p className="text-xs text-[var(--muted)] mt-1">
                    معامل يؤثر على السعر النهائي (مثال: 10 = زيادة 10%)
                  </p>
                </div>
              )}

              {/* أزرار العمل */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeAllForms}
                  disabled={state.submitting}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={state.submitting || !state.formData.id || !state.formData.nameAr}
                >
                  {state.submitting ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {state.submitting ? 'جاري الحفظ...' : 'حفظ'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نموذج التعديل */}
      {state.showEditForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--bg)] rounded-[var(--radius-lg)] border border-[var(--elev)] p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[var(--text)]">
                {state.formType === 'subcategory' ? 'تعديل فئة فرعية' : 'تعديل محور'}
              </h3>
              <Button size="sm" variant="ghost" onClick={closeAllForms}>
                <X size={16} />
              </Button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
              {/* معرف العنصر (للقراءة فقط) */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  المعرف
                </label>
                <input
                  type="text"
                  value={state.formData.id}
                  className="w-full px-3 py-2 border border-[var(--elev)] rounded-[var(--radius)] bg-[var(--muted-bg)] text-[var(--muted)] cursor-not-allowed"
                  readOnly
                />
              </div>

              {/* الفئة الرئيسية (للفئات الفرعية فقط) */}
              {state.formType === 'subcategory' && (
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">
                    الفئة الرئيسية *
                  </label>
                  <Dropdown
                    value={state.formData.categoryId as string}
                    onChange={(v) => setState(prev => ({
                      ...prev,
                      formData: { ...prev.formData, categoryId: String(v) }
                    }))}
                    options={[
                      { value: 'photo', label: 'صورة' },
                      { value: 'video', label: 'فيديو' },
                      { value: 'design', label: 'تصميم' },
                    ]}
                    placeholder="اختر الفئة"
                  />
                </div>
              )}

              {/* الاسم العربي */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  الاسم العربي *
                </label>
                <input
                  type="text"
                  value={state.formData.nameAr}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    formData: { ...prev.formData, nameAr: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-[var(--elev)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)]"
                  placeholder="الاسم باللغة العربية"
                  required
                />
              </div>

              {/* الاسم الإنجليزي */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  الاسم الإنجليزي
                </label>
                <input
                  type="text"
                  value={state.formData.nameEn}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    formData: { ...prev.formData, nameEn: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-[var(--elev)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)]"
                  placeholder="الاسم باللغة الإنجليزية"
                />
              </div>

              {/* الوصف (للفئات الفرعية فقط) */}
              {state.formType === 'subcategory' && (
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">
                    الوصف
                  </label>
                  <textarea
                    value={state.formData.desc}
                    onChange={(e) => setState(prev => ({
                      ...prev,
                      formData: { ...prev.formData, desc: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-[var(--elev)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)]"
                    rows={3}
                    placeholder="وصف مختصر للفئة الفرعية"
                  />
                </div>
              )}

              {/* معامل التسعير (للمحاور فقط) */}
              {state.formType === 'vertical' && (
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">
                    معامل التسعير (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={state.formData.modifierPct}
                    onChange={(e) => setState(prev => ({
                      ...prev,
                      formData: { ...prev.formData, modifierPct: parseFloat(e.target.value) || 0 }
                    }))}
                    className="w-full px-3 py-2 border border-[var(--elev)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)]"
                    placeholder="0.0"
                  />
                  <p className="text-xs text-[var(--muted)] mt-1">
                    معامل يؤثر على السعر النهائي (مثال: 10 = زيادة 10%)
                  </p>
                </div>
              )}

              {/* أزرار العمل */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeAllForms}
                  disabled={state.submitting}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={state.submitting || !state.formData.nameAr}
                >
                  {state.submitting ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {state.submitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* تأكيد الحذف */}
      {state.showDeleteConfirm && state.itemToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--bg)] rounded-[var(--radius-lg)] border border-[var(--elev)] p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[var(--danger-bg)] rounded-full flex items-center justify-center">
                <AlertCircle className="text-[var(--danger-fg)]" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text)]">تأكيد الحذف</h3>
                <p className="text-[var(--muted)] text-sm">هذا الإجراء لا يمكن التراجع عنه</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-[var(--text)] mb-2">
                هل أنت متأكد من حذف {state.itemToDelete.type === 'subcategory' ? 'الفئة الفرعية' : 'المحور'}:
              </p>
              <div className="bg-[var(--bg)] p-3 rounded-[var(--radius)] border border-[var(--elev)]">
                <p className="font-medium text-[var(--text)]">{state.itemToDelete.nameAr}</p>
                <p className="text-sm text-[var(--muted)]">المعرف: {state.itemToDelete.id}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                variant="secondary"
                onClick={closeAllForms}
                disabled={state.deleting}
              >
                إلغاء
              </Button>
            <Button 
                className="bg-[var(--danger)] text-white hover:bg-[var(--danger-hover)]"
                onClick={handleDelete}
                disabled={state.deleting}
              >
                {state.deleting ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                {state.deleting ? 'جاري الحذف...' : 'حذف'}
            </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
