// الخطوة الثالثة: الخبرة والمهارات
'use client';

import { motion } from 'framer-motion';
import { Award, TrendingUp, Users, Plus, X, Package } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { SelectField, InputField } from '../shared/FormField';
import { StepHeader } from '../OnboardingLayout';
import SubcategorySelector from '../shared/SubcategorySelector';
import EquipmentSelector from '../shared/EquipmentSelector';
import { useState } from 'react';
import type { ExperienceLevel } from '@/types/onboarding';

export default function Step3_Experience() {
  const { formData, updateExperience, updateEquipment, getStepErrors } = useOnboarding();
  const { experience } = formData;
  const errors = getStepErrors(3);
  
  const [newClient, setNewClient] = useState('');

  const getFieldError = (field: string) => {
    return errors.find(error => error.includes(field)) || undefined;
  };

  const addPreviousClient = () => {
    if (newClient.trim() && !experience.previousClients?.includes(newClient.trim())) {
      updateExperience({
        previousClients: [...(experience.previousClients || []), newClient.trim()]
      });
      setNewClient('');
    }
  };

  const removePreviousClient = (client: string) => {
    updateExperience({
      previousClients: experience.previousClients?.filter(c => c !== client) || []
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <StepHeader
        title="خبرتك ومهاراتك والمعدات"
        subtitle="أخبرنا عن مستوى خبرتك والتخصصات والمعدات التي تملكها"
        icon={Award}
        step={3}
        totalSteps={5}
      />

      <div className="space-y-8 max-w-2xl mx-auto">
        {/* مستوى الخبرة */}
        <div className="grid md:grid-cols-2 gap-6">
          <SelectField
            label="مستوى خبرتك"
            value={experience.experienceLevel}
            onChange={(value) => updateExperience({ experienceLevel: value as ExperienceLevel })}
            options={[
              { value: 'beginner', label: '🌱 مبتدئ - أقل من سنتين' },
              { value: 'intermediate', label: '💼 متوسط - 2-5 سنوات' },
              { value: 'professional', label: '🏆 محترف - أكثر من 5 سنوات' }
            ]}
            required
            error={getFieldError('الخبرة')}
            description="اختر المستوى الذي يناسب خبرتك الفعلية"
          />

          <SelectField
            label="سنوات الخبرة"
            value={experience.experienceYears}
            onChange={(value) => updateExperience({ experienceYears: value })}
            options={[
              { value: '0-1', label: 'أقل من سنتين' },
              { value: '2-3', label: '2-3 سنوات' },
              { value: '4-5', label: '4-5 سنوات' },
              { value: '6-10', label: '6-10 سنوات' },
              { value: '10+', label: 'أكثر من 10 سنوات' }
            ]}
            required
            error={getFieldError('سنوات')}
          />
        </div>

        {/* التخصصات والمهارات */}
        <div>
          <SubcategorySelector
            selectedCategories={formData.basicInfo.primaryCategories}
            value={experience.skills || []}
            onChange={(skills) => updateExperience({ skills })}
            error={getFieldError('تخصص')}
            disabled={formData.basicInfo.primaryCategories.length === 0}
          />
        </div>

        {/* المعدات والأدوات */}
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[var(--text)] mb-2 flex items-center gap-2">
              <Package size={20} />
              معداتك وأدواتك
            </h3>
            <p className="text-sm text-[var(--muted)]">
              أضف المعدات التي تملكها لتحسين فرص المطابقة مع المشاريع المناسبة
            </p>
          </div>
          
          <EquipmentSelector
            value={formData.equipment || {
              cameras: [],
              lenses: [],
              lighting: [],
              audio: [],
              accessories: [],
              specialSetups: []
            }}
            onChange={updateEquipment}
            selectedCategories={formData.basicInfo.primaryCategories}
            disabled={formData.basicInfo.primaryCategories.length === 0}
          />
        </div>

        {/* العملاء السابقون (اختياري) */}
        <div>
          <h3 className="text-lg font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
            <Users size={20} />
            العملاء السابقون (اختياري)
          </h3>
          
          <div className="flex gap-2 mb-4">
            <InputField
              label=""
              value={newClient}
              onChange={setNewClient}
              placeholder="اسم العميل أو الشركة..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addPreviousClient();
                }
              }}
            />
            <button
              type="button"
              onClick={addPreviousClient}
              disabled={!newClient.trim()}
              className="px-4 py-3 bg-[var(--accent-500)] text-white rounded-xl hover:bg-[var(--accent-600)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* العملاء المضافون */}
          {experience.previousClients && experience.previousClients.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <p className="text-sm font-medium text-[var(--text)]">
                العملاء السابقون ({experience.previousClients.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {experience.previousClients.map((client, index) => (
                  <motion.div
                    key={client}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-full text-sm"
                  >
                    <span>{client}</span>
                    <button
                      type="button"
                      onClick={() => removePreviousClient(client)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* نصائح الخبرة */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div>
              <h4 className="font-bold text-amber-800 mb-2">💡 نصائح لتحسين ملفك الشخصي</h4>
              <ul className="space-y-1 text-sm text-amber-700">
                <li>• كن صادقاً في تقييم مستوى خبرتك</li>
                <li>• أضف تخصصات محددة بدلاً من عامة</li>
                <li>• ذكر العملاء السابقين يزيد من مصداقيتك</li>
                <li>• يمكنك تحديث معلومات الخبرة لاحقاً</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
