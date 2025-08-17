// Component مشترك لاختيار المجالات الأساسية
'use client';

import { motion } from 'framer-motion';
import { Camera, Video, Palette, Check, AlertCircle } from 'lucide-react';

interface CategorySelectorProps {
  value: ('photo' | 'video' | 'design')[];
  onChange: (categories: ('photo' | 'video' | 'design')[]) => void;
  error?: string;
  disabled?: boolean;
  maxSelections?: number;
}

const CATEGORIES = [
  {
    id: 'photo' as const,
    title: 'التصوير الفوتوغرافي',
    description: 'صور المنتجات، البورتريه، الفعاليات، والتصوير التجاري',
    icon: Camera,
    gradient: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    examples: ['صور منتجات', 'بورتريه', 'فعاليات', 'تصوير تجاري']
  },
  {
    id: 'video' as const,
    title: 'إنتاج الفيديو',
    description: 'ريلز، فيديوهات ترويجية، محتوى اجتماعي، ومونتاج',
    icon: Video,
    gradient: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    examples: ['ريلز انستغرام', 'فيديو ترويجي', 'محتوى تيك توك', 'مونتاج']
  },
  {
    id: 'design' as const,
    title: 'التصميم الجرافيكي',
    description: 'تصميم الهوية البصرية، الإعلانات، والمحتوى الرقمي',
    icon: Palette,
    gradient: 'from-purple-500 to-indigo-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    examples: ['لوغو وهوية', 'إعلانات', 'سوشيال ميديا', 'مطبوعات']
  }
];

export default function CategorySelector({ 
  value, 
  onChange, 
  error, 
  disabled, 
  maxSelections = 3 
}: CategorySelectorProps) {
  
  const handleToggle = (categoryId: 'photo' | 'video' | 'design') => {
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
        {CATEGORIES.map((category, index) => {
          const isSelected = value.includes(category.id);
          const canSelect = value.length < maxSelections || isSelected;
          const Icon = category.icon;
          
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
                  ? `${category.borderColor} ${category.bgColor} shadow-lg ring-4 ring-opacity-20 ring-current` 
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
                      ? `bg-gradient-to-br ${category.gradient} text-white shadow-lg` 
                      : 'bg-[var(--bg-alt)] text-[var(--muted)]'
                    }
                  `}>
                    <Icon size={32} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h4 className={`text-xl font-bold mb-2 transition-colors ${
                      isSelected ? category.textColor : 'text-[var(--text)]'
                    }`}>
                      {category.title}
                    </h4>
                    
                    <p className={`text-sm mb-4 leading-relaxed ${
                      isSelected ? category.textColor : 'text-[var(--muted)]'
                    }`}>
                      {category.description}
                    </p>

                    {/* أمثلة */}
                    <div className="flex flex-wrap gap-2">
                      {category.examples.map((example, idx) => (
                        <span
                          key={idx}
                          className={`
                            px-3 py-1 rounded-full text-xs font-medium transition-colors
                            ${isSelected 
                              ? `${category.bgColor} ${category.textColor} border ${category.borderColor}` 
                              : 'bg-[var(--bg-alt)] text-[var(--muted)] border border-[var(--border)]'
                            }
                          `}
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Checkbox */}
                  <div className="flex-shrink-0 mt-2">
                    <div className={`
                      w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center
                      ${isSelected 
                        ? `bg-gradient-to-br ${category.gradient} border-transparent` 
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
                  const category = CATEGORIES.find(c => c.id === categoryId);
                  return (
                    <span
                      key={categoryId}
                      className="px-2 py-1 bg-[var(--accent-100)] text-[var(--accent-700)] rounded-full text-xs font-medium"
                    >
                      {category?.title}
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
