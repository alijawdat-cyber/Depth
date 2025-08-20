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
import type { ExperienceLevel, UnifiedCreatorSkill } from '@/types/onboarding';

export default function Step3_Experience() {
  const { formData, updateExperience, updateEquipment, getFieldError, getFieldErrorV2 } = useOnboarding();
  // V2 validation and skill processing capture are permanently enabled
  const getError = getFieldErrorV2 || getFieldError;
  const { experience } = formData;
  const [newClient, setNewClient] = useState('');

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
        {/* مستوى الخبرة الموحد */}
        <div className="max-w-md mx-auto">
          <SelectField
            label="مستوى خبرتك"
            value={experience.experienceLevel}
            onChange={(value) => {
              const level = value as ExperienceLevel;
              updateExperience({ 
                experienceLevel: level,
                // تحديث سنوات الخبرة تلقائياً حسب المستوى
                experienceYears: level === 'beginner' ? '0-1' : 
                                level === 'intermediate' ? '2-5' : '6+'
              });
            }}
            options={[
              { value: 'beginner', label: '🌱 مبتدئ (أقل من سنتين)' },
              { value: 'intermediate', label: '💼 متوسط (2-5 سنوات)' },
              { value: 'professional', label: '🏆 محترف (أكثر من 5 سنوات)' }
            ]}
            required
            error={getError('experience.experienceLevel') || getFieldError('الخبرة')}
            description="اختر المستوى الذي يناسب خبرتك الفعلية - سيتم تحديد سنوات الخبرة تلقائياً"
          />
        </div>

        {/* التخصصات والمهارات */}
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
              تخصصاتك ومهاراتك (اختياري)
            </h3>
            <p className="text-sm text-[var(--muted)]">
              يمكنك إضافة تخصصاتك الآن أو تخطي هذا القسم وإضافتها لاحقاً من الملف الشخصي
            </p>
          </div>
          <SubcategorySelector
            selectedCategories={formData.basicInfo.primaryCategories}
            value={experience.skills?.map(skill => ({
              subcategoryId: skill.subcategoryId,
              proficiency: (skill.level === 'expert' ? 'pro' : 
                          skill.level === 'advanced' ? 'intermediate' : 'beginner') as 'beginner' | 'intermediate' | 'pro',
              notes: skill.notes,
              verified: skill.verified
            })) || []}
            onChange={(skills) => {
              const unifiedSkills: UnifiedCreatorSkill[] = skills.map(skill => ({
                subcategoryId: skill.subcategoryId,
                level: (skill.proficiency === 'pro' ? 'expert' : 
                       skill.proficiency === 'intermediate' ? 'advanced' : 'beginner') as 'beginner' | 'intermediate' | 'advanced' | 'expert',
                experienceYears: experience.experienceLevel === 'beginner' ? 1 : 
                                experience.experienceLevel === 'intermediate' ? 3 : 6,
                notes: skill.notes,
                verified: skill.verified,
                // ✨ Sprint 3: Processing term permanently enabled (raw_basic default)
                processing: 'raw_basic' as const
              }));
              updateExperience({ skills: unifiedSkills });
            }}
            error={getFieldError('تخصص')}
            disabled={formData.basicInfo.primaryCategories.length === 0}
          />
          
          {/* Phase 4: Output levels for each skill - permanently enabled */}
          {experience.skills && experience.skills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl"
            >
              <h4 className="font-semibold text-[var(--text)] mb-4">مستوى الإخراج لكل مهارة</h4>
              <div className="space-y-4">
                {experience.skills.map((skill, index) => (
                  <div key={skill.subcategoryId} className="flex items-center justify-between p-3 bg-[var(--bg-alt)] rounded-lg">
                    <div className="flex-1">
                      <span className="font-medium text-[var(--text)]">
                        {skill.subcategoryId} ({skill.level})
                      </span>
                    </div>
                    <div className="w-48">
                      <SelectField
                        label=""
                        value={skill.processing || 'raw_basic'}
                        onChange={(value) => {
                          const updatedSkills = [...experience.skills];
                          updatedSkills[index] = {
                            ...updatedSkills[index],
                            processing: value as 'raw' | 'raw_basic' | 'full_retouch'
                          };
                          updateExperience({ skills: updatedSkills });
                        }}
                        options={[
                          { value: 'raw', label: '📸 خام فقط' },
                          { value: 'raw_basic', label: '✨ خام + تعديل أساسي' },
                          { value: 'full_retouch', label: '🎨 إنتاج كامل' }
                        ]}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[var(--muted)] mt-3">
                حدد نوع المعالجة المطلوب لكل مهارة (يؤثر على السعر)
              </p>
              {getError('experience.skills[0].processing') && (
                <p className="text-sm text-red-600 mt-2">{getError('experience.skills[0].processing')}</p>
              )}
            </motion.div>
          )}
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
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
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
