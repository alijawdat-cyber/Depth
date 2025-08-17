// Component مشترك لاختيار المجالات الأساسية - محدث ليكون ديناميكي
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Video, Palette, Check, AlertCircle, Loader2, Mic, Sparkles, Monitor } from 'lucide-react';

interface CategorySelectorProps {
  value: string[];
  onChange: (categories: string[]) => void;
  error?: string;
  disabled?: boolean;
  maxSelections?: number;
}

interface Category {
  id: string;
  nameAr: string;
  nameEn?: string;
  subcategoryCount?: number;
}

// أيقونات الفئات
const getCategoryIcon = (categoryId: string) => {
  switch (categoryId) {
    case 'photo': return Camera;
    case 'video': return Video;
    case 'design': return Palette;
    case 'audio': return Mic;
    case 'interactive': return Monitor;
    case 'ai_automation': return Sparkles;
    default: return Camera;
  }
};

// ألوان الفئات
const getCategoryStyle = (categoryId: string) => {
  const styles = {
    photo: {
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700'
    },
    video: {
      gradient: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700'
    },
    design: {
      gradient: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700'
    },
    audio: {
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700'
    },
    interactive: {
      gradient: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700'
    },
    ai_automation: {
      gradient: 'from-violet-500 to-purple-500',
      bgColor: 'bg-violet-50',
      borderColor: 'border-violet-200',
      textColor: 'text-violet-700'
    }
  };
  
  return styles[categoryId as keyof typeof styles] || styles.photo;
};

export default function CategorySelector({ 
  value, 
  onChange, 
  error, 
  disabled, 
  maxSelections = 3 
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // جلب الفئات من قاعدة البيانات
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/catalog/categories');
        const data = await response.json();
        
        if (data.success && data.items) {
          setCategories(data.items);
        } else {
          setApiError('فشل في تحميل الفئات');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setApiError('خطأ في الاتصال بالخادم');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  
  const handleToggle = (categoryId: string) => {
    if (disabled) return;
    
    const currentCategories = [...value];
    const index = currentCategories.indexOf(categoryId);
    
    if (index > -1) {
      // إزالة الفئة
      currentCategories.splice(index, 1);
    } else {
      // إضافة الفئة (مع التحقق من الحد الأقصى)
      if (currentCategories.length < maxSelections) {
        currentCategories.push(categoryId);
      }
    }
    
    onChange(currentCategories);
  };

  // عرض التحميل
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-[var(--accent-500)] mx-auto mb-4" />
          <p className="text-[var(--muted)]">جاري تحميل الفئات...</p>
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

  return (
    <div className="space-y-6">
      {/* العنوان والوصف */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
          اختر مجالات عملك الأساسية
        </h3>
        <p className="text-sm text-[var(--muted)]">
          يمكنك اختيار حتى {maxSelections} مجالات • اختر ما تتقنه أكثر
        </p>
      </div>

      {/* الفئات */}
      <div className="grid gap-4">
        {categories.map((category, index) => {
          const isSelected = value.includes(category.id);
          const canSelect = value.length < maxSelections || isSelected;
          const Icon = getCategoryIcon(category.id);
          const style = getCategoryStyle(category.id);
          
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative cursor-pointer transition-all duration-200
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${!canSelect ? 'opacity-60' : ''}
                ${canSelect && !disabled ? 'hover:scale-[1.02]' : ''}
              `}
              onClick={() => canSelect && handleToggle(category.id)}
            >
              <div className={`
                relative p-6 rounded-2xl border-2 transition-all duration-200
                ${isSelected 
                  ? `${style.borderColor} ${style.bgColor} shadow-lg ring-4 ring-opacity-20 ring-current` 
                  : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent-300)] hover:shadow-md'
                }
              `}>
                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg z-10"
                  >
                    <Check size={16} className="text-white" />
                  </motion.div>
                )}

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200
                    ${isSelected 
                      ? `bg-gradient-to-br ${style.gradient} text-white shadow-lg` 
                      : 'bg-[var(--bg-alt)] text-[var(--muted)]'
                    }
                  `}>
                    <Icon size={32} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h4 className={`text-xl font-bold mb-2 transition-colors ${
                      isSelected ? style.textColor : 'text-[var(--text)]'
                    }`}>
                      {category.nameAr}
                    </h4>
                    
                    <p className={`text-sm mb-2 leading-relaxed ${
                      isSelected ? style.textColor : 'text-[var(--muted)]'
                    }`}>
                      {category.nameEn}
                    </p>

                    {/* عدد الفئات الفرعية */}
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`
                          px-3 py-1 rounded-full text-xs font-medium transition-colors
                          ${isSelected 
                            ? `${style.bgColor} ${style.textColor} border ${style.borderColor}` 
                            : 'bg-[var(--bg-alt)] text-[var(--muted)] border border-[var(--border)]'
                          }
                        `}
                      >
                        {category.subcategoryCount} تخصص فرعي
                      </span>
                    </div>
                  </div>

                  {/* Checkbox */}
                  <div className="flex-shrink-0 mt-2">
                    <div className={`
                      w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center
                      ${isSelected 
                        ? `bg-gradient-to-br ${style.gradient} border-transparent` 
                        : 'border-[var(--border)] bg-[var(--bg)]'
                      }
                    `}>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          <Check size={14} className="text-white" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selection Summary */}
      {value.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--accent-bg)] border border-[var(--accent-border)] rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--accent-500)] rounded-lg flex items-center justify-center">
              <Check size={16} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-[var(--accent-fg)]">
                تم اختيار {value.length} من {maxSelections} مجالات
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {value.map(categoryId => {
                  const category = categories.find(c => c.id === categoryId);
                  return (
                    <span
                      key={categoryId}
                      className="px-2 py-1 bg-[var(--accent-100)] text-[var(--accent-700)] rounded-full text-xs font-medium"
                    >
                      {category?.nameAr}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
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

      {/* Selection Limit Warning */}
      {value.length >= maxSelections && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-amber-50 border border-amber-200 rounded-lg"
        >
          <p className="text-sm text-amber-700 flex items-center gap-2">
            <AlertCircle size={16} />
            وصلت للحد الأقصى من المجالات ({maxSelections}). يمكنك إلغاء اختيار مجال لإضافة آخر.
          </p>
        </motion.div>
      )}
    </div>
  );
}
