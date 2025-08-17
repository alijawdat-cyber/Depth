// الخطوة الرابعة: معرض الأعمال
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, X, ExternalLink, Instagram, Globe, Eye, CheckCircle, Camera, Video, Palette } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { InputField, TextareaField } from '../shared/FormField';
import { StepHeader } from '../OnboardingLayout';
import { useState } from 'react';
import type { WorkSample } from '@/types/onboarding';

export default function Step4_Portfolio() {
  const { formData, updatePortfolio, getStepErrors } = useOnboarding();
  const { portfolio } = formData;
  const errors = getStepErrors(4);
  
  const [newSampleUrl, setNewSampleUrl] = useState('');
  const [newSampleTitle, setNewSampleTitle] = useState('');
  const [newSampleCategory, setNewSampleCategory] = useState<'photo' | 'video' | 'design'>('photo');
  const [newSampleDescription, setNewSampleDescription] = useState('');

  const getFieldError = (field: string) => {
    return errors.find(error => error.includes(field)) || undefined;
  };

  const addWorkSample = () => {
    if (newSampleUrl.trim() && newSampleTitle.trim()) {
      const newSample: WorkSample = {
        url: newSampleUrl.trim(),
        title: newSampleTitle.trim(),
        category: newSampleCategory,
        description: newSampleDescription.trim() || undefined
      };

      updatePortfolio({
        workSamples: [...portfolio.workSamples, newSample]
      });

      // إعادة تعيين الحقول
      setNewSampleUrl('');
      setNewSampleTitle('');
      setNewSampleDescription('');
    }
  };

  const removeWorkSample = (index: number) => {
    updatePortfolio({
      workSamples: portfolio.workSamples.filter((_, i) => i !== index)
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'photo': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'video': return 'bg-red-100 text-red-700 border-red-200';
      case 'design': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'photo': return 'صورة';
      case 'video': return 'فيديو';
      case 'design': return 'تصميم';
      default: return category;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <StepHeader
        title="معرض أعمالك"
        subtitle="اعرض أفضل أعمالك وحساباتك الاجتماعية لجذب العملاء"
        icon={FileText}
        step={4}
        totalSteps={5}
      />

      <div className="space-y-8 max-w-3xl mx-auto">
        {/* الحسابات الاجتماعية والمواقع */}
        <div>
          <h3 className="text-lg font-semibold text-[var(--text)] mb-4">
            حساباتك الاجتماعية والمواقع
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <InputField
              label="حساب الإنستغرام"
              value={portfolio.socialMedia.instagram || ''}
              onChange={(value) => updatePortfolio({
                socialMedia: { ...portfolio.socialMedia, instagram: value }
              })}
              placeholder="@username"
              icon={<Instagram size={18} />}
              description="حسابك على إنستغرام لعرض أعمالك"
            />

            <InputField
              label="حساب Behance"
              value={portfolio.socialMedia.behance || ''}
              onChange={(value) => updatePortfolio({
                socialMedia: { ...portfolio.socialMedia, behance: value }
              })}
              placeholder="https://behance.net/username"
              icon={<Globe size={18} />}
              description="معرض أعمالك على Behance"
            />
          </div>

          <div className="mt-4">
            <InputField
              label="موقعك الشخصي"
              value={portfolio.socialMedia.website || ''}
              onChange={(value) => updatePortfolio({
                socialMedia: { ...portfolio.socialMedia, website: value }
              })}
              placeholder="https://your-portfolio.com"
              icon={<Globe size={18} />}
              description="موقعك الشخصي أو معرض أعمالك الخاص"
            />
          </div>
        </div>

        {/* عينات الأعمال */}
        <div>
          <h3 className="text-lg font-semibold text-[var(--text)] mb-4">
            عينات من أعمالك *
          </h3>
          
          {/* نموذج إضافة عينة جديدة */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 mb-6">
            <h4 className="font-medium text-[var(--text)] mb-4">إضافة عينة عمل جديدة</h4>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <InputField
                label="رابط العينة"
                value={newSampleUrl}
                onChange={setNewSampleUrl}
                placeholder="https://instagram.com/p/... أو Google Drive"
                description="رابط مباشر للعمل"
              />

              <InputField
                label="عنوان العمل"
                value={newSampleTitle}
                onChange={setNewSampleTitle}
                placeholder="مثال: تصوير منتجات لمتجر الأزياء"
                description="وصف مختصر للعمل"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  نوع العمل
                </label>
                <div className="flex gap-2">
                  {(['photo', 'video', 'design'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewSampleCategory(cat)}
                      className={`
                        px-3 py-2 rounded-lg text-sm font-medium transition-all
                        ${newSampleCategory === cat 
                          ? 'bg-[var(--accent-500)] text-white' 
                          : 'bg-[var(--bg-alt)] text-[var(--muted)] hover:bg-[var(--accent-100)]'
                        }
                      `}
                    >
                      {getCategoryName(cat)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addWorkSample}
                  disabled={!newSampleUrl.trim() || !newSampleTitle.trim()}
                  className="w-full px-4 py-3 bg-[var(--accent-500)] text-white rounded-xl hover:bg-[var(--accent-600)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  إضافة العينة
                </button>
              </div>
            </div>

            {newSampleUrl.trim() && newSampleTitle.trim() && (
              <TextareaField
                label="وصف العمل (اختياري)"
                value={newSampleDescription}
                onChange={setNewSampleDescription}
                placeholder="تفاصيل إضافية عن العمل، التحديات، النتائج..."
                rows={3}
              />
            )}
          </div>

          {/* عرض العينات المضافة */}
          <AnimatePresence>
            {portfolio.workSamples.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-[var(--text)]">
                    عيناتك المضافة ({portfolio.workSamples.length})
                  </h4>
                  {portfolio.workSamples.length >= 2 && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle size={16} />
                      <span className="text-sm">الحد الأدنى مكتمل</span>
                    </div>
                  )}
                </div>

                <div className="grid gap-4">
                  {portfolio.workSamples.map((sample, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-[var(--bg-alt)] border border-[var(--border)] rounded-xl"
                    >
                      {/* Preview/Icon */}
                      <div className={`
                        w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0
                        ${getCategoryColor(sample.category)}
                      `}>
                        {sample.category === 'photo' && <Camera size={24} />}
                        {sample.category === 'video' && <Video size={24} />}
                        {sample.category === 'design' && <Palette size={24} />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h5 className="font-medium text-[var(--text)] mb-1">
                              {sample.title}
                            </h5>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`
                                px-2 py-1 rounded-full text-xs font-medium border
                                ${getCategoryColor(sample.category)}
                              `}>
                                {getCategoryName(sample.category)}
                              </span>
                            </div>
                            {sample.description && (
                              <p className="text-sm text-[var(--muted)] leading-relaxed">
                                {sample.description}
                              </p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <a
                              href={sample.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-[var(--accent-500)] hover:text-[var(--accent-600)] hover:bg-[var(--accent-50)] rounded-lg transition-all"
                              title="عرض العمل"
                            >
                              <Eye size={16} />
                            </a>
                            <button
                              type="button"
                              onClick={() => removeWorkSample(index)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                              title="حذف العينة"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>

                        {/* URL */}
                        <a
                          href={sample.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[var(--accent-600)] hover:underline flex items-center gap-1 mt-2 truncate"
                        >
                          <ExternalLink size={12} />
                          {sample.url}
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* رسالة إذا لم تكن هناك عينات */}
          {portfolio.workSamples.length === 0 && (
            <div className="text-center py-12 text-[var(--muted)]">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">لم تضف أي عينات بعد</p>
              <p className="text-sm">أضف على الأقل عينتين من أعمالك لإكمال هذه الخطوة</p>
            </div>
          )}

          {getFieldError('عينات') && (
            <p className="text-sm text-red-600 mt-2">{getFieldError('عينات')}</p>
          )}
        </div>
      </div>

      {/* نصائح المعرض */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xl">💎</span>
            </div>
            <div>
              <h4 className="font-bold text-indigo-800 mb-3">نصائح لمعرض أعمال مميز</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-indigo-700">
                <div>
                  <p className="font-medium mb-2">✨ جودة العينات:</p>
                  <ul className="space-y-1">
                    <li>• اختر أفضل أعمالك فقط</li>
                    <li>• تأكد من وضوح الصور/الفيديوهات</li>
                    <li>• تنويع في أنواع المشاريع</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">🔗 الروابط المقبولة:</p>
                  <ul className="space-y-1">
                    <li>• Instagram posts/reels</li>
                    <li>• Google Drive/Dropbox</li>
                    <li>• Behance projects</li>
                    <li>• YouTube videos</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
