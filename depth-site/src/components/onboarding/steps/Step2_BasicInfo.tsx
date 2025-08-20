// الخطوة الثانية: المعلومات الأساسية
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Globe, CheckCircle, Plus } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { InputField, CheckboxField, SelectField } from '../shared/FormField';
import RoleSelector from '../shared/RoleSelector';
import CategorySelector from '../shared/CategorySelector';
import { StepHeader } from '../OnboardingLayout';
import { telemetry } from '@/lib/telemetry/client';

export default function Step2_BasicInfo() {
  const { formData, updateBasicInfo, updateAvailability, getFieldError, getFieldErrorV2 } = useOnboarding();
  // V2 validation, timezone in step 2, and max 4 languages are permanently enabled
  const getError = getFieldErrorV2 || getFieldError;
  const { basicInfo } = formData;

  // Phase 3: Custom language input state
  const [newLanguageInput, setNewLanguageInput] = useState('');

  const handleLanguageToggle = (lang: string) => {
    const currentLanguages = [...basicInfo.languages];
    const index = currentLanguages.indexOf(lang);
    
    if (index > -1) {
      // لا يمكن إزالة العربية (مطلوبة)
      if (lang !== 'ar') {
        currentLanguages.splice(index, 1);
      }
    } else {
      // Prevent adding if at max capacity (4 languages max permanently enabled)
      if (currentLanguages.length >= 4) {
        return; // Block silently
      }
      currentLanguages.push(lang);
    }
    
    updateBasicInfo({ languages: currentLanguages });
  };

  // Phase 3: Add custom language handler
  const handleAddCustomLanguage = () => {
    if (!newLanguageInput.trim()) return;
    
    const normalized = newLanguageInput.trim().toLowerCase();
    const currentLanguages = [...basicInfo.languages];
    
    // Check for duplicates (case-insensitive)
    if (currentLanguages.some(lang => lang.toLowerCase() === normalized)) {
      setNewLanguageInput(''); // Clear but don't add
      return;
    }
    
    // Check against preset languages too
    const presetLanguages = ['ar', 'en', 'ku', 'tr'];
    if (presetLanguages.includes(normalized)) {
      setNewLanguageInput(''); // Clear but don't add
      return;
    }
    
    if (currentLanguages.length < 4) {
      currentLanguages.push(normalized);
      updateBasicInfo({ languages: currentLanguages });
      
      // Track custom language addition
      telemetry.customLanguageAdded(normalized);
    }
    
    setNewLanguageInput('');
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
            error={getError('basicInfo.role') || getFieldError('التخصص')}
          />
        </div>

        {/* الموقع والسفر + المنطقة الزمنية (تحت العلم) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <InputField
            label="المدينة"
            value={basicInfo.city}
            onChange={(value) => updateBasicInfo({ city: value })}
            placeholder="بغداد"
            icon={<MapPin size={18} />}
            required
            error={getError('basicInfo.city') || getFieldError('المدينة')}
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

          {/* Timezone selection is permanently enabled */}
          <SelectField
            label="المنطقة الزمنية"
            value={formData.availability.timeZone}
            onChange={(value) => updateAvailability({ timeZone: value })}
            options={[
              { value: 'Asia/Baghdad', label: 'بغداد (GMT+3)' },
              { value: 'Asia/Erbil', label: 'أربيل (GMT+3)' },
              { value: 'Asia/Kuwait', label: 'الكويت (GMT+3)' },
              { value: 'Asia/Riyadh', label: 'الرياض (GMT+3)' }
            ]}
            description="منطقتك الزمنية الأساسية"
          />
        </div>

        {/* اللغات */}
        <div>
          <h3 className="text-lg font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
            <Globe size={20} />
            اللغات التي تتحدث بها
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[
              { id: 'ar', label: 'العربية', required: true },
              { id: 'en', label: 'الإنجليزية', required: false },
              { id: 'ku', label: 'الكردية', required: false },
              { id: 'tr', label: 'التركية', required: false }
            ].map((lang) => {
              const isSelected = basicInfo.languages.includes(lang.id);
              const isDisabled = !isSelected && basicInfo.languages.length >= 4; // Max 4 languages permanently enabled
              
              return (
                <motion.div
                  key={lang.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`
                    flex items-center gap-3 p-4 rounded-xl border transition-all
                    ${isSelected 
                      ? 'border-[var(--accent-500)] bg-[var(--accent-50)]' 
                      : 'border-[var(--border)] bg-[var(--card)]'
                    }
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[var(--accent-300)]'}
                    ${lang.required ? 'opacity-100' : ''}
                  `}
                  onClick={() => !lang.required && !isDisabled && handleLanguageToggle(lang.id)}
                >
                  <div className={`
                    w-5 h-5 rounded border-2 transition-all flex items-center justify-center
                    ${isSelected 
                      ? 'border-[var(--accent-500)] bg-[var(--accent-500)]' 
                      : 'border-[var(--border)]'
                    }
                  `}>
                    {isSelected && (
                      <CheckCircle size={12} className="text-white" />
                    )}
                  </div>
                  <span className={`font-medium ${
                    isSelected 
                      ? 'text-[var(--accent-700)]' 
                      : 'text-[var(--text)]'
                  }`}>
                    {lang.label}
                    {lang.required && <span className="text-[var(--muted)] text-sm mr-2">(مطلوبة)</span>}
                  </span>
                </motion.div>
              );
            })}
            
            {/* Display custom languages */}
            {basicInfo.languages
              .filter(lang => !['ar', 'en', 'ku', 'tr'].includes(lang))
              .map((customLang) => (
                <motion.div
                  key={customLang}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 p-4 rounded-xl border border-[var(--accent-500)] bg-[var(--accent-50)] cursor-pointer"
                  onClick={() => handleLanguageToggle(customLang)}
                >
                  <div className="w-5 h-5 rounded border-2 border-[var(--accent-500)] bg-[var(--accent-500)] flex items-center justify-center">
                    <CheckCircle size={12} className="text-white" />
                  </div>
                  <span className="font-medium text-[var(--accent-700)]">
                    {customLang.charAt(0).toUpperCase() + customLang.slice(1)}
                    <span className="text-[var(--muted)] text-sm mr-2">(مخصصة)</span>
                  </span>
                </motion.div>
              ))}
          </div>

          {/* Custom language input - enabled when under 4 languages */}
          {basicInfo.languages.length < 4 && (
            <div className="mt-4 p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="text-sm font-medium text-[var(--text)] mb-2 block">
                    إضافة لغة أخرى
                  </label>
                  <input
                    type="text"
                    value={newLanguageInput}
                    onChange={(e) => setNewLanguageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustomLanguage()}
                    placeholder="أضف لغة..."
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)]/50"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomLanguage}
                  disabled={!newLanguageInput.trim()}
                  className="px-4 py-2 bg-[var(--accent-500)] text-white rounded-lg hover:bg-[var(--accent-600)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  <Plus size={16} />
                  إضافة
                </button>
              </div>
              <p className="text-xs text-[var(--muted)] mt-2">
                يمكن إضافة حتى {4 - basicInfo.languages.length} لغة إضافية
              </p>
            </div>
          )}

          {getError('basicInfo.languages') && (
            <p className="text-sm text-red-600 mt-2">{getError('basicInfo.languages')}</p>
          )}
        </div>

        {/* المجالات الأساسية */}
        <div>
          <h3 className="text-lg font-semibold text-[var(--text)] mb-4">
            ما هي مجالات عملك الأساسية؟
          </h3>
          <CategorySelector
            value={basicInfo.primaryCategories}
            onChange={(categories) => updateBasicInfo({ primaryCategories: categories as ('photo' | 'video' | 'design')[] })}
            error={getError('basicInfo.primaryCategories') || getFieldError('مجال')}
            maxSelections={2}
          />
          {getError('basicInfo.primaryCategories') && (
            <p className="text-sm text-red-600 mt-2">{getError('basicInfo.primaryCategories')}</p>
          )}
        </div>
      </div>

      {/* إضافات تحفيزية */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
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
