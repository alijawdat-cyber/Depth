// مكوّن لاختيار وإدارة جرد المعدات
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Mic, 
  Lightbulb, 
  Settings, 
  Plus, 
  Check, 
  AlertCircle, 
  Loader2, 
  Search,
  Filter,
  Package,
  Star,
  X
} from 'lucide-react';
import type { EquipmentInventory, CreatorEquipmentItem, EquipmentCatalogItem } from '@/types/creators';

interface EquipmentSelectorProps {
  value: EquipmentInventory;
  onChange: (equipment: EquipmentInventory) => void;
  selectedCategories: string[]; // لفلترة المعدات حسب المجال
  error?: string;
  disabled?: boolean;
}

interface EquipmentFilters {
  category?: string;
  brand?: string;
  search?: string;
}

const EQUIPMENT_CATEGORIES = [
  { id: 'camera', label: 'كاميرات', icon: Camera, color: 'blue' },
  { id: 'lens', label: 'عدسات', icon: Camera, color: 'green' },
  { id: 'lighting', label: 'إضاءة', icon: Lightbulb, color: 'yellow' },
  { id: 'audio', label: 'صوت', icon: Mic, color: 'purple' },
  { id: 'accessory', label: 'ملحقات', icon: Settings, color: 'gray' },
  { id: 'special_setup', label: 'إعدادات خاصة', icon: Package, color: 'orange' }
];

const CONDITION_OPTIONS = [
  { value: 'excellent', label: 'ممتاز', color: 'text-green-600', bgColor: 'bg-green-50' },
  { value: 'good', label: 'جيد', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { value: 'fair', label: 'مقبول', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  { value: 'poor', label: 'ضعيف', color: 'text-red-600', bgColor: 'bg-red-50' }
];

const EQUIPMENT_CATEGORY_MAPPING = {
  camera: 'cameras',
  lens: 'lenses', 
  lighting: 'lighting',
  audio: 'audio',
  accessory: 'accessories',
  special_setup: 'specialSetups'
} as const;

export default function EquipmentSelector({ 
  value, 
  onChange, 
  selectedCategories,
  error, 
  disabled 
}: EquipmentSelectorProps) {
  const [availableEquipment, setAvailableEquipment] = useState<EquipmentCatalogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('camera');
  const [filters, setFilters] = useState<EquipmentFilters>({});
  const [brands, setBrands] = useState<string[]>([]);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customEquipment, setCustomEquipment] = useState({
    name: '',
    brand: '',
    model: '',
    category: activeCategory,
    description: '',
    condition: 'good' as 'excellent' | 'good' | 'fair' | 'poor'
  });

  // جلب المعدات المتاحة
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        setApiError(null);
        
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.brand) params.append('brand', filters.brand);
        if (filters.search) params.append('q', filters.search);
        params.append('limit', '100');
        
        const response = await fetch(`/api/catalog/equipment?${params.toString()}`);
        const data = await response.json();
        
        if (data.success) {
          setAvailableEquipment(data.items || []);
          setBrands(data.metadata?.brands || []);
        } else {
          setApiError('فشل في تحميل المعدات');
        }
      } catch (err) {
        console.error('Error fetching equipment:', err);
        setApiError('خطأ في الاتصال بالخادم');
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [filters]);

  // التحقق من ملكية معدة
  const isEquipmentOwned = (catalogId: string): CreatorEquipmentItem | undefined => {
    const categoryKey = EQUIPMENT_CATEGORY_MAPPING[activeCategory as keyof typeof EQUIPMENT_CATEGORY_MAPPING];
    if (!categoryKey) return undefined;
    
    return value[categoryKey]?.find(item => item.catalogId === catalogId);
  };

  // إضافة/تحديث معدة
  const updateEquipmentItem = (catalogId: string, updates: Partial<CreatorEquipmentItem>) => {
    const categoryKey = EQUIPMENT_CATEGORY_MAPPING[activeCategory as keyof typeof EQUIPMENT_CATEGORY_MAPPING];
    if (!categoryKey) return;
    
    const currentItems = [...(value[categoryKey] || [])];
    const existingIndex = currentItems.findIndex(item => item.catalogId === catalogId);
    
    if (existingIndex > -1) {
      // تحديث العنصر الموجود
      currentItems[existingIndex] = { ...currentItems[existingIndex], ...updates };
    } else {
      // إضافة عنصر جديد
      currentItems.push({
        catalogId,
        owned: true,
        condition: 'good',
        quantity: 1,
        ...updates
      });
    }
    
    onChange({
      ...value,
      [categoryKey]: currentItems
    });
  };

  // إزالة معدة
  const removeEquipmentItem = (catalogId: string) => {
    const categoryKey = EQUIPMENT_CATEGORY_MAPPING[activeCategory as keyof typeof EQUIPMENT_CATEGORY_MAPPING];
    if (!categoryKey) return;
    
    const updatedItems = (value[categoryKey] || []).filter(item => item.catalogId !== catalogId);
    
    onChange({
      ...value,
      [categoryKey]: updatedItems
    });
  };

  // إضافة معدة مخصصة
  const addCustomEquipment = async () => {
    if (!customEquipment.name.trim() || !customEquipment.brand.trim()) {
      console.log('Missing required fields:', { name: customEquipment.name, brand: customEquipment.brand });
      return;
    }

    console.log('Adding custom equipment:', customEquipment);
    console.log('Active category:', activeCategory);

    try {
      // إرسال المعدة المخصصة للمراجعة
      const response = await fetch('/api/catalog/equipment/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...customEquipment,
          category: activeCategory,
          status: 'pending_review',
          submittedBy: 'creator',
          submittedAt: new Date().toISOString()
        })
      });

      console.log('API Response status:', response.status);
      const result = await response.json();
      console.log('API Response data:', result);

      if (response.ok && result.success) {
        // إضافة المعدة للمبدع مع حالة "مراجعة معلقة"
        const categoryKey = EQUIPMENT_CATEGORY_MAPPING[activeCategory as keyof typeof EQUIPMENT_CATEGORY_MAPPING];
        console.log('Category key:', categoryKey);
        
        if (categoryKey) {
          const newItem: CreatorEquipmentItem = {
            catalogId: result.data.id,
            owned: true,
            condition: customEquipment.condition,
            quantity: 1,
            isCustom: true,
            status: 'pending_review',
            customData: {
              name: customEquipment.name,
              brand: customEquipment.brand,
              model: customEquipment.model,
              description: customEquipment.description
            }
          };

          console.log('New item to add:', newItem);
          console.log('Current equipment value:', value);

          const updatedInventory = {
            ...value,
            [categoryKey]: [...(value[categoryKey] || []), newItem]
          };
          
          console.log('Updated inventory:', updatedInventory);
          onChange(updatedInventory);
        }

        // إعادة تعيين النموذج
        setCustomEquipment({
          name: '',
          brand: '',
          model: '',
          category: activeCategory,
          description: '',
          condition: 'good'
        });
        setShowCustomForm(false);
        
        console.log('Custom equipment added successfully');
      } else {
        console.error('API returned error:', result);
      }
    } catch (error) {
      console.error('Error adding custom equipment:', error);
    }
  };

  // حساب إجمالي المعدات
  const getTotalEquipmentCount = (): number => {
    return Object.values(value).reduce((total, items) => total + (items?.length || 0), 0);
  };

  // فلترة المعدات حسب الفئة النشطة + المعدات المخصصة المملوكة
  const getCustomEquipmentForCategory = () => {
    const categoryKey = EQUIPMENT_CATEGORY_MAPPING[activeCategory as keyof typeof EQUIPMENT_CATEGORY_MAPPING];
    if (!categoryKey) return [];
    
    return (value[categoryKey] || []).filter(item => item.isCustom && item.customData);
  };

  const filteredEquipment = availableEquipment.filter(item => 
    item.category === activeCategory
  );

  const customEquipmentForCategory = getCustomEquipmentForCategory();
  
  console.log('Filtered equipment:', filteredEquipment.length);
  console.log('Custom equipment for category:', customEquipmentForCategory.length);
  console.log('Custom equipment items:', customEquipmentForCategory);

  if (selectedCategories.length === 0) {
    return (
      <div className="text-center py-12">
        <Package size={48} className="mx-auto mb-4 text-[var(--muted)] opacity-50" />
        <p className="text-[var(--muted)]">
          اختر مجالاتك الأساسية أولاً لعرض المعدات المناسبة
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* العنوان */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
          جرد المعدات والأدوات
        </h3>
        <p className="text-sm text-[var(--muted)]">
          أضف المعدات التي تملكها لتحسين فرص الحصول على المشاريع المناسبة
        </p>
      </div>

      {/* ملخص المعدات */}
      {getTotalEquipmentCount() > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--accent-bg)] border border-[var(--accent-border)] rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--accent-500)] rounded-lg flex items-center justify-center">
              <Package size={16} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-[var(--accent-fg)]">
                إجمالي المعدات: {getTotalEquipmentCount()} قطعة
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {EQUIPMENT_CATEGORIES.map(cat => {
                  const categoryKey = EQUIPMENT_CATEGORY_MAPPING[cat.id as keyof typeof EQUIPMENT_CATEGORY_MAPPING];
                  const count = value[categoryKey]?.length || 0;
                  if (count === 0) return null;
                  
                  return (
                    <span
                      key={cat.id}
                      className="px-2 py-1 bg-[var(--accent-100)] text-[var(--accent-700)] rounded-full text-xs font-medium"
                    >
                      {cat.label}: {count}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* فئات المعدات */}
      <div className="flex gap-2 p-1 bg-[var(--bg-alt)] rounded-xl overflow-x-auto">
        {EQUIPMENT_CATEGORIES.map((category) => {
          const isActive = activeCategory === category.id;
          const categoryKey = EQUIPMENT_CATEGORY_MAPPING[category.id as keyof typeof EQUIPMENT_CATEGORY_MAPPING];
          const count = value[categoryKey]?.length || 0;
          
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`
                flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap
                ${isActive 
                  ? 'bg-[var(--accent-500)] text-white shadow-md' 
                  : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--bg)]'
                }
              `}
            >
              <category.icon size={16} />
              <span>{category.label}</span>
              {count > 0 && (
                <span className="bg-white/20 text-white rounded-full px-2 py-0.5 text-xs">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* فلاتر البحث */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="ابحث عن معدة..."
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--bg)] text-[var(--text)] focus:border-[var(--accent-500)] focus:outline-none transition-colors"
          />
        </div>
        
        <select
          value={filters.brand || ''}
          onChange={(e) => setFilters({ ...filters, brand: e.target.value || undefined })}
          className="px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--bg)] text-[var(--text)] focus:border-[var(--accent-500)] focus:outline-none transition-colors"
        >
          <option value="">جميع البرندات</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
        
        <button
          onClick={() => setFilters({ category: activeCategory })}
          className="flex items-center justify-center gap-2 px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--bg)] text-[var(--text)] hover:border-[var(--accent-500)] transition-colors"
        >
          <Filter size={16} />
          فلترة
        </button>
      </div>

      {/* قائمة المعدات */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 size={32} className="animate-spin text-[var(--accent-500)] mx-auto mb-4" />
              <p className="text-[var(--muted)]">جاري تحميل المعدات...</p>
            </div>
          </div>
        ) : apiError ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle size={20} />
              <span>{apiError}</span>
            </div>
          </div>
        ) : (filteredEquipment.length === 0 && customEquipmentForCategory.length === 0) ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto mb-4 text-[var(--muted)] opacity-50" />
            <p className="text-[var(--muted)]">
              لا توجد معدات متاحة في هذه الفئة
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* المعدات العادية من الكاتالوج */}
            {filteredEquipment.map((equipment) => {
              const ownedItem = isEquipmentOwned(equipment.id);
              const isOwned = !!ownedItem;
              const isCustom = ownedItem?.isCustom;
              const pending = ownedItem?.status === 'pending_review';
              
              return (
                <motion.div
                  key={equipment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all duration-200
                    ${isOwned ? (
                      isCustom && pending
                        ? 'border-amber-400 bg-amber-50/70'
                        : 'border-[var(--accent-500)] bg-[var(--accent-50)]'
                    ) : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent-300)]'}
                  `}
                >
                  {isCustom && (
                    <div className={`absolute -top-2 -left-2 px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide shadow ${pending ? 'bg-amber-500 text-white' : 'bg-green-600 text-white'}`}>
                      {pending ? 'معدة مخصصة (قيد المراجعة)' : 'معدة مخصصة'}
                    </div>
                  )}
                  {/* معلومات المعدة */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-[var(--text)] mb-1">
                      {equipment.brand} {equipment.model}
                    </h4>
                    <p className="text-sm text-[var(--muted)] mb-2">
                      فئة: {EQUIPMENT_CATEGORIES.find(c => c.id === equipment.category)?.label}
                    </p>
                    
                    {/* المواصفات */}
                    {equipment.capabilities && equipment.capabilities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {equipment.capabilities.slice(0, 3).map((capability, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-[var(--bg-alt)] text-[var(--muted)] rounded text-xs"
                          >
                            {capability}
                          </span>
                        ))}
                        {equipment.capabilities.length > 3 && (
                          <span className="px-2 py-1 bg-[var(--bg-alt)] text-[var(--muted)] rounded text-xs">
                            +{equipment.capabilities.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* أزرار التحكم */}
                  {!isOwned ? (
                    <button
                      type="button"
                      onClick={() => updateEquipmentItem(equipment.id, { owned: true, condition: 'good' })}
                      disabled={disabled}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[var(--accent-500)] text-white rounded-lg hover:bg-[var(--accent-600)] disabled:opacity-50 transition-all"
                    >
                      <Plus size={16} />
                      أضف إلى جردي
                    </button>
                  ) : (
                    <div className="space-y-3">
                      {/* مؤشر الملكية */}
                      <div className="flex items-center gap-2">
                        <Check size={16} className={pending ? 'text-amber-600' : 'text-green-600'} />
                        <span className={`text-sm font-medium ${pending ? 'text-amber-700' : 'text-green-600'}`}>
                          {pending ? 'مملوك (قيد المراجعة)' : 'مملوك'}
                        </span>
                      </div>
                      
                      {/* حالة المعدة */}
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-[var(--text)]">حالة المعدة:</p>
                        <div className="grid grid-cols-2 gap-1">
                          {CONDITION_OPTIONS.map((condition) => {
                            const isSelected = ownedItem?.condition === condition.value;
                            
                            return (
                              <button
                                key={condition.value}
                                type="button"
                                onClick={() => updateEquipmentItem(equipment.id, { condition: condition.value as CreatorEquipmentItem['condition'] })}
                                disabled={disabled}
                                className={`
                                  px-2 py-1 rounded text-xs font-medium transition-all
                                  ${isSelected 
                                    ? `${condition.bgColor} ${condition.color} border border-current` 
                                    : 'bg-[var(--bg-alt)] text-[var(--muted)] hover:bg-[var(--accent-50)]'
                                  }
                                `}
                              >
                                {condition.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* زر الإزالة */}
                      <button
                        type="button"
                        onClick={() => removeEquipmentItem(equipment.id)}
                        disabled={disabled}
                        className="w-full px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-all text-sm"
                      >
                        إزالة من الجرد
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
            
            {/* المعدات المخصصة المملوكة */}
            {customEquipmentForCategory.map((customItem) => {
              const pending = customItem.status === 'pending_review';
              
              return (
                <motion.div
                  key={`custom-${customItem.catalogId}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all duration-200
                    ${pending
                      ? 'border-amber-400 bg-amber-50/70'
                      : 'border-green-500 bg-green-50'
                    }
                  `}
                >
                  <div className={`absolute -top-2 -left-2 px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide shadow ${pending ? 'bg-amber-500 text-white' : 'bg-green-600 text-white'}`}>
                    {pending ? 'معدة مخصصة (قيد المراجعة)' : 'معدة مخصصة (مُعتمدة)'}
                  </div>

                  {/* معلومات المعدة المخصصة */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-[var(--text)] mb-1">
                      {customItem.customData?.brand} {customItem.customData?.model}
                    </h4>
                    <p className="text-sm text-[var(--muted)] mb-2">
                      {customItem.customData?.name}
                    </p>
                    {customItem.customData?.description && (
                      <p className="text-xs text-[var(--muted)] mb-3">
                        {customItem.customData.description}
                      </p>
                    )}
                  </div>

                  {/* حالة المعدة والتحكم */}
                  <div className="space-y-3">
                    {/* مؤشر الملكية */}
                    <div className="flex items-center gap-2">
                      <Check size={16} className={pending ? 'text-amber-600' : 'text-green-600'} />
                      <span className={`text-sm font-medium ${pending ? 'text-amber-700' : 'text-green-600'}`}>
                        {pending ? 'مملوك (قيد المراجعة)' : 'مملوك (مُعتمد)'}
                      </span>
                    </div>
                    
                    {/* حالة المعدة */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-[var(--text)]">حالة المعدة:</p>
                      <div className="grid grid-cols-2 gap-1">
                        {CONDITION_OPTIONS.map((condition) => {
                          const isSelected = customItem.condition === condition.value;
                          
                          return (
                            <button
                              key={condition.value}
                              type="button"
                              onClick={() => updateEquipmentItem(customItem.catalogId, { condition: condition.value as CreatorEquipmentItem['condition'] })}
                              disabled={disabled}
                              className={`
                                px-2 py-1 rounded text-xs font-medium transition-all
                                ${isSelected 
                                  ? `${condition.bgColor} ${condition.color} border border-current` 
                                  : 'bg-[var(--bg-alt)] text-[var(--muted)] hover:bg-[var(--accent-50)]'
                                }
                              `}
                            >
                              {condition.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* زر الإزالة */}
                    <button
                      type="button"
                      onClick={() => removeEquipmentItem(customItem.catalogId)}
                      disabled={disabled}
                      className="w-full px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-all text-sm"
                    >
                      إزالة من الجرد
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* زر إضافة معدة مخصصة */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setShowCustomForm(true)}
            disabled={disabled}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-500)] text-white rounded-lg hover:bg-[var(--accent-600)] disabled:opacity-50 transition-all"
          >
            <Plus size={16} />
            أضف معدة غير موجودة
          </button>
          <p className="text-xs text-[var(--muted)] mt-1">
            ستتم مراجعة المعدة من قبل فريقنا قبل إضافتها للكاتالوج
          </p>
        </div>
      </div>

      {/* نموذج إضافة معدة مخصصة */}
      {showCustomForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setShowCustomForm(false)}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[var(--text)]">إضافة معدة مخصصة</h3>
              <button
                type="button"
                onClick={() => setShowCustomForm(false)}
                className="text-[var(--muted)] hover:text-[var(--text)]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  اسم المعدة *
                </label>
                <input
                  type="text"
                  value={customEquipment.name}
                  onChange={(e) => setCustomEquipment(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="مثال: Canon EOS R5"
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  الماركة *
                </label>
                <input
                  type="text"
                  value={customEquipment.brand}
                  onChange={(e) => setCustomEquipment(prev => ({ ...prev, brand: e.target.value }))}
                  placeholder="مثال: Canon"
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  الموديل
                </label>
                <input
                  type="text"
                  value={customEquipment.model}
                  onChange={(e) => setCustomEquipment(prev => ({ ...prev, model: e.target.value }))}
                  placeholder="مثال: Mark IV"
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  حالة المعدة
                </label>
                <select
                  value={customEquipment.condition}
                  onChange={(e) => setCustomEquipment(prev => ({ ...prev, condition: e.target.value as 'excellent' | 'good' | 'fair' | 'poor' }))}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                >
                  {CONDITION_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  وصف إضافي
                </label>
                <textarea
                  value={customEquipment.description}
                  onChange={(e) => setCustomEquipment(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="معلومات إضافية عن المعدة..."
                  rows={3}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent resize-none"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-700">
                  <strong>ملاحظة:</strong> ستتم مراجعة المعدة من قبل فريقنا وإضافتها للكاتالوج بعد الموافقة. 
                  ستظهر في ملفك الشخصي مع حالة &quot;قيد المراجعة&quot; حتى يتم اعتمادها.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowCustomForm(false)}
                className="flex-1 px-4 py-2 border border-[var(--border)] text-[var(--text)] rounded-lg hover:bg-[var(--bg-alt)] transition-all"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={addCustomEquipment}
                disabled={!customEquipment.name.trim() || !customEquipment.brand.trim()}
                className="flex-1 px-4 py-2 bg-[var(--accent-500)] text-white rounded-lg hover:bg-[var(--accent-600)] disabled:opacity-50 transition-all"
              >
                إضافة للمراجعة
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* رسالة الخطأ */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className="text-sm text-red-600 flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </p>
        </motion.div>
      )}

      {/* نصائح */}
      {getTotalEquipmentCount() === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Star size={16} className="text-white" />
            </div>
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">💡 نصيحة</p>
              <p>
                إضافة معداتك يساعد العملاء في معرفة إمكانياتك التقنية ويزيد من فرص الحصول على مشاريع متخصصة.
                يمكنك إضافة المعدات تدريجياً وتحديث الجرد لاحقاً.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
