"use client";

// صفحة إدارة الكتالوج - الفئات والمحاور والتصنيفات
// الغرض: توفير واجهة إدارية شاملة لإدارة كتالوج الخدمات والفئات
// المرحلة 1: عرض البيانات الحالية مع إمكانية التحديث والمعاينة

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import Dropdown from '@/components/ui/Dropdown';
import Loader from '@/components/loaders/Loader';
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
  Package
} from 'lucide-react';
import { Category, Subcategory, Vertical } from '@/types/catalog';

interface CatalogStats {
  totalCategories: number;
  totalSubcategories: number;
  totalVerticals: number;
  lastUpdated: string;
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
  showCreateForm: boolean;
  editingItem: Subcategory | Vertical | null;
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
    showCreateForm: false,
    editingItem: null
  });

  // التحقق من الجلسة والدور
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'admin';

  useEffect(() => {
    if (status === 'authenticated' && isAdmin) {
      loadCatalogData();
    }
  }, [status, isAdmin]);

  const loadCatalogData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // تحميل الفئات الفرعية والمحاور بشكل متوازي
      const [subcatResponse, verticalResponse] = await Promise.all([
        fetch('/api/catalog/subcategories'),
        fetch('/api/catalog/verticals')
      ]);

      if (!subcatResponse.ok || !verticalResponse.ok) {
        throw new Error('فشل في تحميل بيانات الكتالوج');
      }

      const [subcatData, verticalData] = await Promise.all([
        subcatResponse.json(),
        verticalResponse.json()
      ]);

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
          <Button onClick={() => setState(prev => ({ ...prev, showCreateForm: true }))}>
            <Plus size={16} />
            إضافة عنصر
          </Button>
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
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--bg)] border-b border-[var(--elev)]">
                    <tr>
                      <th className="text-right p-4 font-medium text-[var(--text)]">المعرف</th>
                      <th className="text-right p-4 font-medium text-[var(--text)]">الاسم العربي</th>
                      <th className="text-right p-4 font-medium text-[var(--text)]">الاسم الإنجليزي</th>
                      <th className="text-right p-4 font-medium text-[var(--text)]">عدد الفئات الفرعية</th>
                      <th className="text-right p-4 font-medium text-[var(--text)]">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.categories.map((category) => {
                      const subcategoryCount = state.subcategories.filter(
                        sub => sub.categoryId === category.id
                      ).length;
                      
                      return (
                        <tr key={category.id} className="border-b border-[var(--elev)] hover:bg-[var(--bg)]">
                          <td className="p-4 text-sm text-[var(--text)] font-mono">{category.id}</td>
                          <td className="p-4 text-sm text-[var(--text)] font-medium">{category.nameAr}</td>
                          <td className="p-4 text-sm text-[var(--muted)]">{category.nameEn}</td>
                          <td className="p-4 text-sm text-[var(--text)]">{subcategoryCount}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setState(prev => ({ 
                                  ...prev, 
                                  viewMode: 'subcategories',
                                  selectedCategory: category.id 
                                }))}
                              >
                                <Eye size={14} />
                                عرض الفئات الفرعية
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
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--bg)] border-b border-[var(--elev)]">
                    <tr>
                      <th className="text-right p-4 font-medium text-[var(--text)]">المعرف</th>
                      <th className="text-right p-4 font-medium text-[var(--text)]">الاسم العربي</th>
                      <th className="text-right p-4 font-medium text-[var(--text)]">الاسم الإنجليزي</th>
                      <th className="text-right p-4 font-medium text-[var(--text)]">الفئة الرئيسية</th>
                      <th className="text-right p-4 font-medium text-[var(--text)]">الوصف</th>
                      <th className="text-right p-4 font-medium text-[var(--text)]">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubcategories.map((subcategory) => (
                      <tr key={subcategory.id} className="border-b border-[var(--elev)] hover:bg-[var(--bg)]">
                        <td className="p-4 text-sm text-[var(--text)] font-mono">{subcategory.id}</td>
                        <td className="p-4 text-sm text-[var(--text)] font-medium">{subcategory.nameAr}</td>
                        <td className="p-4 text-sm text-[var(--muted)]">{subcategory.nameEn}</td>
                        <td className="p-4 text-sm text-[var(--text)]">
                          {state.categories.find(c => c.id === subcategory.categoryId)?.nameAr}
                        </td>
                        <td className="p-4 text-sm text-[var(--muted)] max-w-xs truncate">
                          {subcategory.desc || '-'}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost">
                              <Edit3 size={14} />
                              تعديل
                            </Button>
                            <Button size="sm" variant="ghost" className="text-[var(--danger)] hover:bg-[var(--danger-bg)]">
                              <Trash2 size={14} />
                              حذف
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--bg)] border-b border-[var(--elev)]">
                    <tr>
                      <th className="text-right p-4 font-medium text-[var(--text)]">المعرف</th>
                      <th className="text-right p-4 font-medium text-[var(--text)]">الاسم العربي</th>
                      <th className="text-right p-4 font-medium text-[var(--text)]">الاسم الإنجليزي</th>
                      <th className="text-right p-4 font-medium text-[var(--text)]">معامل التسعير</th>
                      <th className="text-right p-4 font-medium text-[var(--text)]">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.verticals.map((vertical) => (
                      <tr key={vertical.id} className="border-b border-[var(--elev)] hover:bg-[var(--bg)]">
                        <td className="p-4 text-sm text-[var(--text)] font-mono">{vertical.id}</td>
                        <td className="p-4 text-sm text-[var(--text)] font-medium">{vertical.nameAr}</td>
                        <td className="p-4 text-sm text-[var(--muted)]">{vertical.nameEn}</td>
                        <td className="p-4 text-sm text-[var(--text)]">
                          {vertical.modifierPct ? `${(vertical.modifierPct * 100).toFixed(1)}%` : '-'}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost">
                              <Edit3 size={14} />
                              تعديل
                            </Button>
                            <Button size="sm" variant="ghost" className="text-[var(--danger)] hover:bg-[var(--danger-bg)]">
                              <Trash2 size={14} />
                              حذف
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* نموذج الإنشاء (المرحلة القادمة) */}
      {state.showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[var(--text)] mb-4">إضافة عنصر جديد</h3>
            <p className="text-[var(--muted)] mb-4">ستتوفر هذه الميزة في المرحلة القادمة</p>
            <Button 
              onClick={() => setState(prev => ({ ...prev, showCreateForm: false }))}
              className="w-full"
            >
              إغلاق
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
