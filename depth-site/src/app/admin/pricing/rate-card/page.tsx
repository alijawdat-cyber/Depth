"use client";

// محرر جدول الأسعار المتقدم - متوافق مع docs/catalog/06-Rate-Card-Strategy.md
// الغرض: إدارة شاملة لجدول الأسعار مع الحواجز والهوامش والتحكم في الإصدارات

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Dropdown from '@/components/ui/Dropdown';
import SectionHeading from '@/components/ui/SectionHeading';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ResponsiveTable, { DefaultCard } from '@/components/ui/ResponsiveTable';
import { LoadingRateCard } from '@/components/ui/LoadingStates';
import { DEFAULT_GUARDRAILS, type GuardrailsConfig } from '@/lib/pricing/guardrails-engine';
import { 
  Save, 
  AlertTriangle,
  CheckCircle,
  Edit3,
  Copy,
  History,
  Shield,
  Percent,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';

// نوع واحد لكل فئة فرعية مع سعرها
interface SubcategoryPriceItem {
  id: string; // للتوافق مع ResponsiveTable
  subcategoryId: string;
  nameAr: string;
  nameEn?: string;
  categoryId: string;
  basePrice: number;
  priceFloor?: number;
  [key: string]: unknown; // للتوافق مع ResponsiveTable
}

// هيكل Rate Card الصحيح
interface RateCardData {
  versionId: string;
  status: 'draft' | 'active' | 'archived';
  effectiveFrom?: string;
  currency: string;
  basePricesIQD: Record<string, number>;
  baseRangesIQD?: Record<string, [number, number]>;
  processingLevels?: {
    raw_only?: number;
    raw_basic?: number;
    full_retouch?: number | [number, number];
  };
  modifiers?: {
    rushPct?: number;
    creatorTierPct?: Record<string, number>;
  };
  verticalModifiers?: Record<string, number>;
  locationZonesIQD?: Record<string, number>;
  overrideCapPercent?: number;
  guardrails?: {
    minMarginDefault?: number;
    minMarginHardStop?: number;
  };
  roundingIQD?: number;
}

interface Subcategory {
  id: string;
  nameAr: string;
  nameEn?: string;
  categoryId: string;
}

export default function RateCardEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Rate card state
  const [rateCard, setRateCard] = useState<RateCardData | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [editingItem, setEditingItem] = useState<SubcategoryPriceItem | null>(null);
  const [showGuardrails, setShowGuardrails] = useState(false);

  // Filters and view
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedSubcategory, setFocusedSubcategory] = useState<string | null>(null);

  // Guardrails config
  const [guardrailsConfig, setGuardrailsConfig] = useState<GuardrailsConfig>(DEFAULT_GUARDRAILS);

  useEffect(() => {
    // التحقق من معامل التركيز في URL
    const focusParam = searchParams.get('focus');
    if (focusParam) {
      setFocusedSubcategory(focusParam);
    }
    loadRateCardData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // دالة إنشاء Rate Card جديد
  const createNewRateCard = () => {
    const newRateCard: RateCardData = {
      versionId: `draft-${new Date().toISOString().split('T')[0]}-${Math.random().toString(36).substr(2, 5)}`,
      status: 'draft',
      effectiveFrom: new Date().toISOString().split('T')[0],
      currency: 'IQD',
      basePricesIQD: {}, // بداية فارغة
      baseRangesIQD: {},
      modifiers: {
        rushPct: 0.25,
        creatorTierPct: {}
      },
      guardrails: {
        minMarginDefault: DEFAULT_GUARDRAILS.profitMargins.standard,
        minMarginHardStop: DEFAULT_GUARDRAILS.profitMargins.minimum
      },
      roundingIQD: 1000
    };
    setRateCard(newRateCard);
    setGuardrailsConfig(DEFAULT_GUARDRAILS);
  };

  const loadRateCardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // تحميل الفئات الفرعية من API
      const subcatResponse = await fetch('/api/catalog/subcategories');
      if (!subcatResponse.ok) {
        throw new Error('فشل في تحميل الفئات الفرعية - تأكد من تشغيل الخادم وإعداد قاعدة البيانات');
      }
      
      const subcatData = await subcatResponse.json();
      const loadedSubcategories = subcatData.items || subcatData.data || [];
      
      if (loadedSubcategories.length === 0) {
        throw new Error('لا توجد فئات فرعية في قاعدة البيانات - يرجى تحميل البيانات الأولية أولاً');
      }
      
      setSubcategories(loadedSubcategories);

      // محاولة تحميل Rate Card النشط (اختياري)
      try {
        const rateResponse = await fetch('/api/pricing/rate-card/active');
        if (rateResponse.ok) {
          const rateData = await rateResponse.json();
          if (rateData?.rateCard) {
            setRateCard(rateData.rateCard);
            if (rateData.rateCard?.guardrails) {
              setGuardrailsConfig(rateData.rateCard.guardrails);
            }
          } else {
            createNewRateCard();
          }
        } else {
          // لا يوجد جدول أسعار نشط حالياً → إنشاء واحد جديد
          createNewRateCard();
        }
      } catch {
        // في حال فشل الاتصال، إنشاء Rate Card جديد
        createNewRateCard();
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ في التحميل');
    } finally {
      setLoading(false);
    }
  };



  const handleSaveRateCard = async (isDraft = true) => {
    if (!rateCard) {
      setError('لا يمكن الحفظ: لم يتم إنشاء جدول أسعار بعد');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const response = await fetch('/api/pricing/rate-card', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rateCard: {
            ...rateCard,
            guardrails: guardrailsConfig,
            status: isDraft ? 'draft' : 'active'
          }
        })
      });

      if (!response.ok) throw new Error('فشل في حفظ جدول الأسعار');

      const result = await response.json();
      setRateCard(result.rateCard);
      setSuccess(isDraft ? 'تم حفظ المسودة' : 'تم تفعيل جدول الأسعار');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في الحفظ');
    } finally {
      setSaving(false);
    }
  };



  const handleUpdatePrice = (subcategoryId: string, newPrice: number) => {
    if (!rateCard) {
      // إذا لم يكن هنالك رَيت كارد، أنشئ واحد جديد
      createNewRateCard();
      // بعد الإنشاء، سوف يحدث re-render وسيتم استدعاء هذه الدالة مرة أخرى
      return;
    }
    const step = 1000;
    const normalized = Math.max(0, Math.round(newPrice / step) * step);
    setRateCard({
      ...rateCard,
      basePricesIQD: {
        ...rateCard.basePricesIQD,
        [subcategoryId]: normalized
      }
    });
  };

  // تحويل البيانات إلى صفوف عرض:
  // نعرض جميع الفئات الفرعية مع أسعارها (أو 0 كافتراضي)
  const priceItems: SubcategoryPriceItem[] = subcategories.map((sub) => {
    const basePrice = rateCard?.basePricesIQD?.[sub.id] ?? 0; // افتراضي 0 إذا لم يكن موجود
    const priceFloor = rateCard?.baseRangesIQD?.[sub.id]?.[0];
    return {
      id: sub.id,
      subcategoryId: sub.id,
      nameAr: sub.nameAr,
      nameEn: sub.nameEn,
      categoryId: sub.categoryId,
      basePrice,
      priceFloor
    };
  });

  const filteredItems = priceItems.filter(item => {
    const matchesCategory = categoryFilter === 'all' || item.categoryId === categoryFilter;
    const matchesSearch = searchTerm === '' || 
      item.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subcategoryId.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const categories = [...new Set(priceItems.map(item => item.categoryId))];

  // تعريف أعمدة الجدول
  const tableColumns = [
    {
      key: 'id' as const,
      label: 'اسم الفئة الفرعية',
      render: (item: SubcategoryPriceItem) => (
        <div className={`${focusedSubcategory === item.subcategoryId ? 'p-2 bg-[var(--accent-bg)] border border-[var(--accent-500)] rounded-lg shadow-sm' : ''}`}>
          <div className="font-medium text-[var(--text)]">{item.nameAr}</div>
          <div className="text-sm text-[var(--muted)]">{item.subcategoryId}</div>
          {item.nameEn && <div className="text-xs text-[var(--muted)]">{item.nameEn}</div>}
          {focusedSubcategory === item.subcategoryId && (
            <div className="text-xs text-[var(--accent-600)] font-medium mt-1 flex items-center gap-1">
              🎯 مُركز عليه من صفحة الكتالوج
            </div>
          )}
        </div>
      )
    },
    {
      key: 'id' as const,
      label: 'الفئة',
      render: (item: SubcategoryPriceItem) => item.categoryId,
      hideOnMobile: true
    },
    {
      key: 'id' as const,
      label: 'السعر الأساسي',
      render: (item: SubcategoryPriceItem) => (
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            step={1000}
            value={item.basePrice || 0}
            onChange={(e) => {
              const v = Number(e.target.value);
              handleUpdatePrice(item.subcategoryId, isNaN(v) ? 0 : v);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowUp') {
                e.preventDefault();
                handleUpdatePrice(item.subcategoryId, (item.basePrice || 0) + 1000);
              }
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                handleUpdatePrice(item.subcategoryId, Math.max(0, (item.basePrice || 0) - 1000));
              }
            }}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
            className="w-32 px-3 py-2 border border-[var(--border)] rounded bg-[var(--bg)] text-[var(--text)] text-right"
          />
          <span className="text-sm text-[var(--muted)]">د.ع</span>
        </div>
      )
    },
    {
      key: 'id' as const,
      label: 'أرضية السعر',
      render: (item: SubcategoryPriceItem) => (
        <span className="text-[var(--text)]">
          {item.priceFloor ? `${item.priceFloor.toLocaleString()} د.ع` : 'غير محدد'}
        </span>
      ),
      hideOnMobile: true
    },
    {
      key: 'id' as const,
      label: 'الإجراءات',
      render: (item: SubcategoryPriceItem) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setEditingItem(item)}
        >
          <Edit3 size={14} />
          تعديل
        </Button>
      )
    }
  ];

  // دالة رندر البطاقة للشاشات الصغيرة
  const renderItemCard = (item: SubcategoryPriceItem) => (
    <DefaultCard
      key={item.id}
      item={item}
      title={item.nameAr}
      subtitle={`${item.categoryId} • ${item.subcategoryId}`}
      actions={
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setEditingItem(item)}
        >
          <Edit3 size={14} />
          تعديل
        </Button>
      }
      fields={[
        { label: 'السعر الأساسي', value: `${item.basePrice.toLocaleString()} د.ع` },
        { label: 'أرضية السعر', value: item.priceFloor ? `${item.priceFloor.toLocaleString()} د.ع` : 'غير محدد' }
      ]}
    />
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumbs />
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--text)]">محرر جدول الأسعار</h1>
          <p className="text-[var(--muted)] mt-1">جاري التحميل...</p>
        </div>
        <LoadingRateCard />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <Breadcrumbs />
      
      {/* Header */}
      <SectionHeading
        title="محرر جدول الأسعار"
        description="إدارة شاملة لجدول الأسعار مع الحواجز والهوامش"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => setShowGuardrails(!showGuardrails)}>
              <Shield size={16} />
              الحواجز والهوامش
            </Button>
            <Button variant="secondary" onClick={() => router.push('/admin/pricing')}>
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

      {/* Version Info */}
      {rateCard && (
        <div className="mb-6 bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)]">
                إصدار {rateCard.versionId}
              </h3>
              <p className="text-sm text-[var(--muted)]">
                الحالة: {rateCard.status === 'active' ? 'نشط' : rateCard.status === 'draft' ? 'مسودة' : 'مؤرشف'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary">
                <History size={14} />
                الإصدارات السابقة
              </Button>
              <Button size="sm" variant="secondary">
                <Copy size={14} />
                نسخ الإصدار
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-[var(--bg)] rounded-[var(--radius)]">
              <div className="text-2xl font-bold text-[var(--text)]">{priceItems.length}</div>
              <div className="text-xs text-[var(--muted)]">إجمالي البنود</div>
            </div>
            <div className="text-center p-3 bg-[var(--bg)] rounded-[var(--radius)]">
              <div className="text-2xl font-bold text-green-600">{categories.length}</div>
              <div className="text-xs text-[var(--muted)]">الفئات</div>
            </div>
            <div className="text-center p-3 bg-[var(--bg)] rounded-[var(--radius)]">
              <div className="text-2xl font-bold text-blue-600">
                {(guardrailsConfig.profitMargins.standard * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-[var(--muted)]">هامش الربح المعياري</div>
            </div>
            <div className="text-center p-3 bg-[var(--bg)] rounded-[var(--radius)]">
              <div className="text-2xl font-bold text-purple-600">
                {(guardrailsConfig.discountLimits.maxDiscountPercent * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-[var(--muted)]">الحد الأقصى للتخفيض</div>
            </div>
          </div>
        </div>
      )}

      {/* Guardrails Panel */}
      {showGuardrails && (
        <div className="mb-6 bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-[var(--accent-500)]" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)]">إعدادات الحواجز والهوامش</h3>
              <p className="text-sm text-[var(--muted)]">تحكم في حدود الأسعار والتخفيضات</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profit Margins */}
            <div className="space-y-4">
              <h4 className="font-medium text-[var(--text)] flex items-center gap-2">
                <Percent size={16} />
                هوامش الربح
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-[var(--text)] mb-1">الحد الأدنى (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={(guardrailsConfig.profitMargins.minimum * 100).toFixed(0)}
                    onChange={(e) => setGuardrailsConfig(prev => ({
                      ...prev,
                      profitMargins: {
                        ...prev.profitMargins,
                        minimum: parseFloat(e.target.value) / 100
                      }
                    }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[var(--text)] mb-1">المعياري (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={(guardrailsConfig.profitMargins.standard * 100).toFixed(0)}
                    onChange={(e) => setGuardrailsConfig(prev => ({
                      ...prev,
                      profitMargins: {
                        ...prev.profitMargins,
                        standard: parseFloat(e.target.value) / 100
                      }
                    }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[var(--text)] mb-1">المميز (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={(guardrailsConfig.profitMargins.premium * 100).toFixed(0)}
                    onChange={(e) => setGuardrailsConfig(prev => ({
                      ...prev,
                      profitMargins: {
                        ...prev.profitMargins,
                        premium: parseFloat(e.target.value) / 100
                      }
                    }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
                  />
                </div>
              </div>
            </div>

            {/* Discount Limits */}
            <div className="space-y-4">
              <h4 className="font-medium text-[var(--text)] flex items-center gap-2">
                <TrendingUp size={16} />
                حدود التخفيض
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-[var(--text)] mb-1">الحد الأقصى (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={(guardrailsConfig.discountLimits.maxDiscountPercent * 100).toFixed(0)}
                    onChange={(e) => setGuardrailsConfig(prev => ({
                      ...prev,
                      discountLimits: {
                        ...prev.discountLimits,
                        maxDiscountPercent: parseFloat(e.target.value) / 100
                      }
                    }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[var(--text)] mb-1">يتطلب موافقة (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={(guardrailsConfig.discountLimits.requiresApproval * 100).toFixed(0)}
                    onChange={(e) => setGuardrailsConfig(prev => ({
                      ...prev,
                      discountLimits: {
                        ...prev.discountLimits,
                        requiresApproval: parseFloat(e.target.value) / 100
                      }
                    }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[var(--text)] mb-1">تخفيض الطوارئ (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={(guardrailsConfig.discountLimits.emergencyDiscount * 100).toFixed(0)}
                    onChange={(e) => setGuardrailsConfig(prev => ({
                      ...prev,
                      discountLimits: {
                        ...prev.discountLimits,
                        emergencyDiscount: parseFloat(e.target.value) / 100
                      }
                    }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Controls */}
      <div className="mb-6 bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="البحث في البنود..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
            />
          </div>
          
          <Dropdown
            options={[
              { value: 'all', label: 'جميع الفئات' },
              ...categories.map(cat => ({ value: cat, label: cat }))
            ]}
            value={categoryFilter}
            onChange={setCategoryFilter}
            placeholder="تصفية حسب الفئة"
          />
        </div>
      </div>

      {/* Rate Card Items */}
      <ResponsiveTable
        data={filteredItems}
        columns={tableColumns}
        renderCard={renderItemCard}
        loading={loading}
        emptyMessage="لا توجد بنود في جدول الأسعار"
        showViewToggle={true}
        defaultView="table"
        className={focusedSubcategory ? "focused-table" : ""}
      />

                    {/* Action Buttons */}
       <div className="flex items-center justify-end mt-8 pt-6 border-t border-[var(--elev)]">
         <div className="flex items-center gap-2">
           <Button 
             variant="secondary" 
             onClick={() => handleSaveRateCard(true)}
             disabled={saving || !rateCard}
           >
             <Save size={16} />
             {saving ? 'جاري الحفظ...' : 'حفظ مسودة'}
           </Button>
           
           <Button 
             onClick={() => handleSaveRateCard(false)}
             disabled={saving || !rateCard}
           >
             <CheckCircle size={16} />
             {saving ? 'جاري التفعيل...' : 'تفعيل الإصدار'}
           </Button>
         </div>
       </div>

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--bg)] rounded-[var(--radius-lg)] p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-[var(--text)] mb-4">
              تعديل السعر: {editingItem.nameAr}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">السعر الأساسي (د.ع)</label>
                <input
                  type="number"
                  min="0"
                  value={editingItem.basePrice}
                  onChange={(e) => setEditingItem(prev => prev ? {
                    ...prev,
                    basePrice: parseFloat(e.target.value) || 0
                  } : null)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">أرضية السعر (د.ع)</label>
                <input
                  type="number"
                  min="0"
                  value={editingItem.priceFloor || ''}
                  onChange={(e) => setEditingItem(prev => prev ? {
                    ...prev,
                    priceFloor: e.target.value ? parseFloat(e.target.value) : undefined
                  } : null)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
                  placeholder="اختياري"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--text)] mb-2">معرف الفئة الفرعية</label>
                <input
                  type="text"
                  value={editingItem.subcategoryId}
                  disabled
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--elev)] text-[var(--muted)]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button variant="secondary" onClick={() => setEditingItem(null)}>
                إلغاء
              </Button>
              <Button onClick={() => {
                if (editingItem) {
                  handleUpdatePrice(editingItem.subcategoryId, editingItem.basePrice);
                  setEditingItem(null);
                }
              }}>
                <Save size={16} />
                حفظ التغييرات
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}