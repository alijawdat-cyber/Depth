// الخطوة الثانية: المعلومات الأساسية
'use client';

import { motion } from 'framer-motion';
import { Briefcase, MapPin, Globe, CheckCircle } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { InputField, CheckboxField } from '../shared/FormField';
import RoleSelector from '../shared/RoleSelector';
import CategorySelector from '../shared/CategorySelector';
import { StepHeader } from '../OnboardingLayout';

export default function Step2_BasicInfo() {
  const { formData, updateBasicInfo, getFieldError } = useOnboarding();
  const { basicInfo } = formData;

  const handleLanguageToggle = (lang: string) => {
    const currentLanguages = [...basicInfo.languages];
    const index = currentLanguages.indexOf(lang);
    
    if (index > -1) {
      // لا يمكن إزالة العربية (مطلوبة)
      if (lang !== 'ar') {
        currentLanguages.splice(index, 1);
      }
    } else {
      currentLanguages.push(lang);
    }
    
    updateBasicInfo({ languages: currentLanguages });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <StepHeader
        title="المعلومات الأساسية"
        subtitle="أخبرنا عن تخصصك وموقعك والمجالات التي تفضل العمل بها"
        icon={Briefcase}
        step={2}
        totalSteps={5}
      />

      <div className="space-y-8 max-w-3xl mx-auto">
        {/* التخصص */}
        <div>
          <h3 className="text-lg font-semibold text-[var(--text)] mb-4">ما هو تخصصك الأساسي؟</h3>
          <RoleSelector
            value={basicInfo.role}
            onChange={(role) => updateBasicInfo({ role })}
            error={getFieldError('التخصص')}
          />
        </div>

        {/* الموقع والسفر */}
        <div className="grid md:grid-cols-2 gap-6">
          <InputField
            label="المدينة"
            value={basicInfo.city}
            onChange={(value) => updateBasicInfo({ city: value })}
            placeholder="بغداد"
            icon={<MapPin size={18} />}
            required
            error={getFieldError('المدينة')}
            description="المدينة التي تقيم فيها حالياً"
          />

          <div className="flex items-center">
            <CheckboxField
              label="يمكنني السفر للمحافظات الأخرى"
              value={basicInfo.canTravel}
              onChange={(checked) => updateBasicInfo({ canTravel: checked })}
              description="هل تستطيع السفر لمواقع التصوير في محافظات أخرى؟"
            />
          </div>
        </div>

        {/* اللغات */}
        <div>
          <h3 className="text-lg font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
            <Globe size={20} />
            اللغات التي تتحدث بها
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { id: 'ar', label: 'العربية', required: true },
              { id: 'en', label: 'الإنجليزية', required: false },
              { id: 'ku', label: 'الكردية', required: false },
              { id: 'tr', label: 'التركية', required: false }
            ].map((lang) => (
              <motion.div
                key={lang.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`
                  flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer
                  ${basicInfo.languages.includes(lang.id) 
                    ? 'border-[var(--accent-500)] bg-[var(--accent-50)]' 
                    : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent-300)]'
                  }
                  ${lang.required ? 'opacity-100' : ''}
                `}
                onClick={() => !lang.required && handleLanguageToggle(lang.id)}
              >
                <div className={`
                  w-5 h-5 rounded border-2 transition-all flex items-center justify-center
                  ${basicInfo.languages.includes(lang.id) 
                    ? 'border-[var(--accent-500)] bg-[var(--accent-500)]' 
                    : 'border-[var(--border)]'
                  }
                `}>
                  {basicInfo.languages.includes(lang.id) && (
                    <CheckCircle size={12} className="text-white" />
                  )}
                </div>
                <span className={`font-medium ${
                  basicInfo.languages.includes(lang.id) 
                    ? 'text-[var(--accent-700)]' 
                    : 'text-[var(--text)]'
                }`}>
                  {lang.label}
                  {lang.required && <span className="text-[var(--muted)] text-sm mr-2">(مطلوبة)</span>}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* المجالات الأساسية */}
        <div>
          <h3 className="text-lg font-semibold text-[var(--text)] mb-4">
            ما هي مجالات عملك الأساسية؟
          </h3>
          <CategorySelector
            value={basicInfo.primaryCategories}
            onChange={(categories) => updateBasicInfo({ primaryCategories: categories as ('photo' | 'video' | 'design')[] })}
            error={getFieldError('مجال')}
            maxSelections={2}
          />
        </div>
      </div>

      {/* إضافات تحفيزية */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xl">🎯</span>
            </div>
            <div>
              <h4 className="font-bold text-green-800 mb-2">لماذا نحتاج هذه المعلومات؟</h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• لمطابقتك مع المشاريع المناسبة لمهاراتك</li>
                <li>• لتحديد المسافة والتكلفة للمشاريع في منطقتك</li>
                <li>• لضمان التواصل الفعال مع العملاء</li>
                <li>• لبناء ملف شخصي احترافي يجذب العملاء</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
