"use client";

// محرر جدول الأسعار المتقدم - متوافق مع docs/catalog/06-Rate-Card-Strategy.md
// الغرض: إدارة شاملة لجدول الأسعار مع الحواجز والهوامش والتحكم في الإصدارات

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Dropdown from '@/components/ui/Dropdown';
import SectionHeading from '@/components/ui/SectionHeading';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ResponsiveTable, { DefaultCard } from '@/components/ui/ResponsiveTable';
import { LoadingRateCard } from '@/components/ui/LoadingStates';
import { DEFAULT_GUARDRAILS, type GuardrailsConfig } from '@/lib/pricing/guardrails-engine';
import { 
  Save, 
  Upload, 
  Download, 
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

interface RateCardItem {
  id: string;
  category: string;
  subcategory: string;
  processing: string;
  basePrice: number;
  creatorCost: {
    T1: number;
    T2: number;
    T3: number;
  };
  margin: number;
  priceFloor: number;
  lastUpdated: string;
  updatedBy: string;
  [key: string]: unknown;
}

interface RateCardVersion {
  id: string;
  version: string;
  status: 'draft' | 'active' | 'archived';
  createdAt: string;
  createdBy: string;
  items: RateCardItem[];
  guardrails: GuardrailsConfig;
  notes?: string;
}

export default function RateCardEditorPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Rate card state
  const [currentVersion, setCurrentVersion] = useState<RateCardVersion | null>(null);
  const [, setVersions] = useState<RateCardVersion[]>([]);
  const [editingItem, setEditingItem] = useState<RateCardItem | null>(null);
  const [showGuardrails, setShowGuardrails] = useState(false);

  // Filters and view
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Guardrails config
  const [guardrailsConfig, setGuardrailsConfig] = useState<GuardrailsConfig>(DEFAULT_GUARDRAILS);

  useEffect(() => {
    loadRateCardData();
  }, []);

  const loadRateCardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pricing/rate-card/active');
      if (!response.ok) throw new Error('فشل في تحميل جدول الأسعار');
      
      const data = await response.json();
      setCurrentVersion(data.rateCard);
      setVersions(data.versions || []);
      
      if (data.rateCard?.guardrails) {
        setGuardrailsConfig(data.rateCard.guardrails);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ في التحميل');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRateCard = async (isDraft = true) => {
    if (!currentVersion) return;

    try {
      setSaving(true);
      setError(null);

      const response = await fetch('/api/pricing/rate-card', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rateCard: {
            ...currentVersion,
            guardrails: guardrailsConfig,
            status: isDraft ? 'draft' : 'active'
          }
        })
      });

      if (!response.ok) throw new Error('فشل في حفظ جدول الأسعار');

      const result = await response.json();
      setCurrentVersion(result.rateCard);
      setSuccess(isDraft ? 'تم حفظ المسودة' : 'تم تفعيل جدول الأسعار');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateItem = (updatedItem: RateCardItem) => {
    if (!currentVersion) return;

    const updatedItems = currentVersion.items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );

    setCurrentVersion({
      ...currentVersion,
      items: updatedItems
    });

    setEditingItem(null);
  };

  

  const filteredItems = currentVersion?.items.filter(item => {
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSearch = searchTerm === '' || 
      item.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  }) || [];

  const categories = [...new Set(currentVersion?.items.map(item => item.category) || [])];

  // تعريف أعمدة الجدول
  const tableColumns = [
    {
      key: 'subcategory' as keyof RateCardItem,
      label: 'البند',
      render: (item: RateCardItem) => (
        <div>
          <div className="font-medium text-[var(--text)]">{item.subcategory}</div>
          <div className="text-sm text-[var(--muted)]">{item.processing}</div>
        </div>
      )
    },
    {
      key: 'category' as keyof RateCardItem,
      label: 'الفئة',
      hideOnMobile: true
    },
    {
      key: 'basePrice' as keyof RateCardItem,
      label: 'السعر الأساسي',
      render: (item: RateCardItem) => (
        <div className="font-medium text-[var(--text)]">
          {item.basePrice.toLocaleString()} د.ع
        </div>
      )
    },
    {
      key: 'margin' as keyof RateCardItem,
      label: 'الهامش',
      render: (item: RateCardItem) => (
        <span className={`px-2 py-1 rounded text-xs ${
          item.margin >= guardrailsConfig.profitMargins.standard
            ? 'bg-green-100 text-green-800'
            : item.margin >= guardrailsConfig.profitMargins.minimum
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {(item.margin * 100).toFixed(1)}%
        </span>
      ),
      hideOnMobile: true
    },
    {
      key: 'priceFloor' as keyof RateCardItem,
      label: 'أرضية السعر',
      render: (item: RateCardItem) => (
        <span className="text-[var(--text)]">
          {item.priceFloor.toLocaleString()} د.ع
        </span>
      ),
      hideOnMobile: true
    },
    {
      key: 'id' as keyof RateCardItem,
      label: 'الإجراءات',
      render: (item: RateCardItem) => (
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
  const renderItemCard = (item: RateCardItem) => (
    <DefaultCard
      key={item.id}
      item={item}
      title={item.subcategory}
      subtitle={`${item.category} • ${item.processing}`}
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
        { 
          label: 'الهامش', 
          value: (
            <span className={`px-2 py-1 rounded text-xs ${
              item.margin >= guardrailsConfig.profitMargins.standard
                ? 'bg-green-100 text-green-800'
                : item.margin >= guardrailsConfig.profitMargins.minimum
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {(item.margin * 100).toFixed(1)}%
            </span>
          )
        },
        { label: 'أرضية السعر', value: `${item.priceFloor.toLocaleString()} د.ع` }
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
      {currentVersion && (
        <div className="mb-6 bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)]">
                إصدار {currentVersion.version}
              </h3>
              <p className="text-sm text-[var(--muted)]">
                الحالة: {currentVersion.status === 'active' ? 'نشط' : currentVersion.status === 'draft' ? 'مسودة' : 'مؤرشف'}
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
              <div className="text-2xl font-bold text-[var(--text)]">{currentVersion.items.length}</div>
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

          <div className="flex items-center gap-2 lg:hidden">
            <span className="text-sm text-[var(--muted)]">العرض:</span>
            <Button
              size="sm"
              variant={viewMode === 'table' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('table')}
            >
              جدول
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'cards' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('cards')}
            >
              بطاقات
            </Button>
          </div>
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
      />

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--elev)]">
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <Upload size={16} />
            استيراد
          </Button>
          <Button variant="secondary">
            <Download size={16} />
            تصدير
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="secondary" 
            onClick={() => handleSaveRateCard(true)}
            disabled={saving}
          >
            <Save size={16} />
            {saving ? 'جاري الحفظ...' : 'حفظ مسودة'}
          </Button>
          
          <Button 
            onClick={() => handleSaveRateCard(false)}
            disabled={saving}
          >
            <CheckCircle size={16} />
            {saving ? 'جاري التفعيل...' : 'تفعيل الإصدار'}
          </Button>
        </div>
      </div>

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-[var(--text)] mb-4">
              تعديل البند: {editingItem.subcategory}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">السعر الأساسي</label>
                <input
                  type="number"
                  value={editingItem.basePrice}
                  onChange={(e) => setEditingItem(prev => prev ? {
                    ...prev,
                    basePrice: parseFloat(e.target.value) || 0
                  } : null)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">أرضية السعر</label>
                <input
                  type="number"
                  value={editingItem.priceFloor}
                  onChange={(e) => setEditingItem(prev => prev ? {
                    ...prev,
                    priceFloor: parseFloat(e.target.value) || 0
                  } : null)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">تكلفة T1</label>
                <input
                  type="number"
                  value={editingItem.creatorCost.T1}
                  onChange={(e) => setEditingItem(prev => prev ? {
                    ...prev,
                    creatorCost: { ...prev.creatorCost, T1: parseFloat(e.target.value) || 0 }
                  } : null)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">تكلفة T2</label>
                <input
                  type="number"
                  value={editingItem.creatorCost.T2}
                  onChange={(e) => setEditingItem(prev => prev ? {
                    ...prev,
                    creatorCost: { ...prev.creatorCost, T2: parseFloat(e.target.value) || 0 }
                  } : null)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">تكلفة T3</label>
                <input
                  type="number"
                  value={editingItem.creatorCost.T3}
                  onChange={(e) => setEditingItem(prev => prev ? {
                    ...prev,
                    creatorCost: { ...prev.creatorCost, T3: parseFloat(e.target.value) || 0 }
                  } : null)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">هامش الربح (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={(editingItem.margin * 100).toFixed(1)}
                  onChange={(e) => setEditingItem(prev => prev ? {
                    ...prev,
                    margin: parseFloat(e.target.value) / 100 || 0
                  } : null)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button variant="secondary" onClick={() => setEditingItem(null)}>
                إلغاء
              </Button>
              <Button onClick={() => editingItem && handleUpdateItem(editingItem)}>
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
