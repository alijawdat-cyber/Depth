// مكوّن لاختيار الفئات الفرعية والمهارات مع مستوى الإتقان
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Check, AlertCircle, Loader2, Badge, Target, X } from 'lucide-react';
import type { CreatorSkill } from '@/types/creators';

interface SubcategorySelectorProps {
  selectedCategories: string[]; // الفئات الرئيسية المختارة
  value: CreatorSkill[]; // المهارات المختارة
  onChange: (skills: CreatorSkill[]) => void;
  error?: string;
  disabled?: boolean;
}

interface Subcategory {
  id: string;
  categoryId: string;
  nameAr: string;
  nameEn?: string;
  desc?: string;
  priceRangeKey?: string;
}

const PROFICIENCY_LEVELS = [
  { 
    value: 'beginner' as const, 
    label: 'مبتدئ', 
    icon: '🌱', 
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  { 
    value: 'intermediate' as const, 
    label: 'متوسط', 
    icon: '⭐', 
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  { 
    value: 'pro' as const, 
    label: 'محترف', 
    icon: '🏆', 
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  }
];

export default function SubcategorySelector({ 
  selectedCategories, 
  value, 
  onChange, 
  error, 
  disabled 
}: SubcategorySelectorProps) {
  const [subcategoriesByCategory, setSubcategoriesByCategory] = useState<Record<string, Subcategory[]>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // جلب الفئات الفرعية لكل فئة رئيسية
  useEffect(() => {
    if (selectedCategories.length === 0) {
      setSubcategoriesByCategory({});
      return;
    }

    const fetchSubcategories = async () => {
      try {
        setLoading(true);
        setApiError(null);
        
        const subcategoriesData: Record<string, Subcategory[]> = {};
        
        // جلب الفئات الفرعية لكل فئة رئيسية
        await Promise.all(
          selectedCategories.map(async (categoryId) => {
            try {
              const response = await fetch(`/api/catalog/subcategories?categoryId=${categoryId}`);
              if (!response.ok) {
                console.warn('Subcategories fetch failed', categoryId, response.status);
                return; // skip this category
              }
              interface SubcategoriesResponse { success: boolean; items?: Subcategory[] }
              let data: unknown = null;
              try { data = await response.json(); } catch { /* ignore parse error */ }
              const isSubcategoriesResponse = (val: unknown): val is SubcategoriesResponse => !!val && typeof val === 'object' && 'success' in val;
              if (isSubcategoriesResponse(data) && data.success && Array.isArray(data.items)) {
                subcategoriesData[categoryId] = data.items;
              }
            } catch (e) {
              console.warn('Subcategories fetch error', categoryId, e);
            }
          })
        );
        
        setSubcategoriesByCategory(subcategoriesData);
        
        // تعيين الفئة النشطة للأولى إذا لم تكن محددة
        if (!activeCategory && selectedCategories.length > 0) {
          setActiveCategory(selectedCategories[0]);
        }
        
      } catch (err) {
        console.error('Error fetching subcategories:', err);
        setApiError('خطأ في تحميل التخصصات الفرعية');
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, [selectedCategories, activeCategory]);

  // التحقق من اختيار مهارة
  const isSkillSelected = (subcategoryId: string): CreatorSkill | undefined => {
    return value.find(skill => skill.subcategoryId === subcategoryId);
  };

  // تحديث مهارة
  const updateSkill = (subcategoryId: string, proficiency: 'beginner' | 'intermediate' | 'pro') => {
    const currentSkills = [...value];
    const existingIndex = currentSkills.findIndex(skill => skill.subcategoryId === subcategoryId);
    
    if (existingIndex > -1) {
      // تحديث المهارة الموجودة
      currentSkills[existingIndex] = { 
        ...currentSkills[existingIndex], 
        proficiency 
      };
    } else {
      // إضافة مهارة جديدة
      currentSkills.push({
        subcategoryId,
        proficiency,
        verified: false
      });
    }
    
    onChange(currentSkills);
  };

  // إزالة مهارة
  const removeSkill = (subcategoryId: string) => {
    const updatedSkills = value.filter(skill => skill.subcategoryId !== subcategoryId);
    onChange(updatedSkills);
  };

  // عرض التحميل
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-[var(--accent-500)] mx-auto mb-4" />
          <p className="text-[var(--muted)]">جاري تحميل التخصصات...</p>
        </div>
      </div>
    );
  }

  // عرض الخطأ
  if (apiError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 text-red-700">
          <AlertCircle size={20} />
          <span>{apiError}</span>
        </div>
      </div>
    );
  }

  // عدم وجود فئات مختارة
  if (selectedCategories.length === 0) {
    return (
      <div className="text-center py-12">
        <Target size={48} className="mx-auto mb-4 text-[var(--muted)] opacity-50" />
        <p className="text-[var(--muted)]">
          اختر مجالاتك الأساسية أولاً لعرض التخصصات الفرعية
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* العنوان */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
          اختر تخصصاتك الفرعية ومستوى إتقانك
        </h3>
        <p className="text-sm text-[var(--muted)]">
          حدد التخصصات التي تتقنها ومستوى خبرتك في كل منها
        </p>
      </div>

      {/* تبويبات الفئات الرئيسية */}
      {selectedCategories.length > 1 && (
        <div className="flex gap-2 p-1 bg-[var(--bg-alt)] rounded-xl">
          {selectedCategories.map((categoryId) => {
            const isActive = activeCategory === categoryId;
            const categorySubcategories = subcategoriesByCategory[categoryId] || [];
            const skillsInCategory = value.filter(skill => 
              categorySubcategories.some(sub => sub.id === skill.subcategoryId)
            );
            
            return (
              <button
                key={categoryId}
                onClick={() => setActiveCategory(categoryId)}
                className={`
                  flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200
                  ${isActive 
                    ? 'bg-[var(--accent-500)] text-white shadow-md' 
                    : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--bg)]'
                  }
                `}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="capitalize">{categoryId}</span>
                  {skillsInCategory.length > 0 && (
                    <Badge className="w-5 h-5 bg-white/20 text-white rounded-full flex items-center justify-center text-xs">
                      {skillsInCategory.length}
                    </Badge>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* الفئات الفرعية للفئة النشطة */}
      <AnimatePresence mode="wait">
        {activeCategory && (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {subcategoriesByCategory[activeCategory]?.map((subcategory, index) => {
              const selectedSkill = isSkillSelected(subcategory.id);
              const isSelected = !!selectedSkill;
              
              return (
                <motion.div
                  key={subcategory.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all duration-200
                    ${isSelected 
                      ? 'border-[var(--accent-500)] bg-[var(--accent-50)]' 
                      : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent-300)]'
                    }
                  `}
                >
                  {/* معلومات التخصص */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-[var(--text)] mb-1">
                        {subcategory.nameAr}
                      </h4>
                      {subcategory.nameEn && (
                        <p className="text-sm text-[var(--muted)] mb-2">
                          {subcategory.nameEn}
                        </p>
                      )}
                      {subcategory.desc && (
                        <p className="text-xs text-[var(--muted)]">
                          {subcategory.desc}
                        </p>
                      )}
                    </div>
                    
                    {/* زر الإزالة */}
                    {isSelected && (
                      <button
                        type="button"
                        onClick={() => removeSkill(subcategory.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                        disabled={disabled}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {/* مستويات الإتقان */}
                  <div className="grid grid-cols-3 gap-2">
                    {PROFICIENCY_LEVELS.map((level) => {
                      const isLevelSelected = selectedSkill?.proficiency === level.value;
                      
                      return (
                        <button
                          key={level.value}
                          type="button"
                          onClick={() => updateSkill(subcategory.id, level.value)}
                          disabled={disabled}
                          className={`
                            p-3 rounded-lg border transition-all duration-200 text-center
                            ${isLevelSelected 
                              ? `${level.borderColor} ${level.bgColor} ${level.color} shadow-md` 
                              : 'border-[var(--border)] bg-[var(--bg)] text-[var(--muted)] hover:border-[var(--accent-300)]'
                            }
                            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                          `}
                        >
                          <div className="text-lg mb-1">{level.icon}</div>
                          <div className="text-xs font-medium">{level.label}</div>
                          
                          {isLevelSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                            >
                              <Check size={10} className="text-white" />
                            </motion.div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
            
            {/* رسالة إذا لم تكن هناك فئات فرعية */}
            {(!subcategoriesByCategory[activeCategory] || subcategoriesByCategory[activeCategory].length === 0) && (
              <div className="text-center py-8 text-[var(--muted)]">
                <Star size={48} className="mx-auto mb-3 opacity-50" />
                <p>لا توجد تخصصات فرعية متاحة لهذا المجال حالياً</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ملخص المهارات المختارة */}
      {value.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--accent-bg)] border border-[var(--accent-border)] rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-[var(--accent-500)] rounded-lg flex items-center justify-center">
              <Check size={16} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-[var(--accent-fg)]">
                تم اختيار {value.length} تخصص
              </p>
            </div>
          </div>
          
          <div className="grid gap-2">
            {selectedCategories.map(categoryId => {
              const categorySubcategories = subcategoriesByCategory[categoryId] || [];
              const categorySkills = value.filter(skill => 
                categorySubcategories.some(sub => sub.id === skill.subcategoryId)
              );
              
              if (categorySkills.length === 0) return null;
              
              return (
                <div key={categoryId} className="space-y-2">
                  <p className="text-sm font-medium text-[var(--accent-fg)] capitalize">
                    {categoryId} ({categorySkills.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map(skill => {
                      const subcategory = categorySubcategories.find(sub => sub.id === skill.subcategoryId);
                      const proficiencyLevel = PROFICIENCY_LEVELS.find(level => level.value === skill.proficiency);
                      
                      return (
                        <span
                          key={skill.subcategoryId}
                          className="px-3 py-1 bg-[var(--accent-100)] text-[var(--accent-700)] rounded-full text-xs font-medium flex items-center gap-1"
                        >
                          <span>{subcategory?.nameAr}</span>
                          <span className="opacity-70">({proficiencyLevel?.icon})</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
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
      {selectedCategories.length > 0 && value.length === 0 && (
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
              <p>اختر التخصصات التي تتقنها وحدد مستوى خبرتك بصدق. هذا يساعد في مطابقتك مع المشاريع المناسبة.</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
