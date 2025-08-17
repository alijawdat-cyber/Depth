"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Dropdown from '@/components/ui/Dropdown';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { 
  Settings, 
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  User,
  Briefcase,
  Award,
  DollarSign,
  FileText,
  AlertCircle
} from 'lucide-react';

interface IntakeFormData {
  // معلومات إضافية
  bio: string;
  experience: string;
  equipment: string[];
  skills: string[];
  portfolio: string;
  
  // معلومات التسعير
  hourlyRate: number;
  dayRate: number;
  travelRate: number;
  
  // التوفر
  availability: string;
  workingHours: string;
  
  // معلومات إضافية
  languages: string[];
  specializations: string[];
}

const STEPS = [
  { id: 1, title: 'المعلومات الشخصية', icon: User },
  { id: 2, title: 'الخبرة والمهارات', icon: Award },
  { id: 3, title: 'المعدات والأدوات', icon: Settings },
  { id: 4, title: 'التسعير', icon: DollarSign },
  { id: 5, title: 'التوفر والتخصص', icon: Briefcase },
  { id: 6, title: 'المراجعة والإرسال', icon: CheckCircle }
];

export default function CreatorIntakePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<IntakeFormData>({
    bio: '',
    experience: '',
    equipment: [],
    skills: [],
    portfolio: '',
    hourlyRate: 0,
    dayRate: 0,
    travelRate: 0,
    availability: '',
    workingHours: '',
    languages: ['العربية'],
    specializations: []
  });

  const isWelcome = searchParams?.get('welcome') === 'true';

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin?from=creators');
      return;
    }

    if (session.user.role !== 'creator') {
      router.push('/portal');
      return;
    }
  }, [session, status, router]);

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/creators/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        router.push('/creators?intake=completed');
      } else {
        throw new Error('فشل في إرسال النموذج');
      }
    } catch (error) {
      console.error('Intake submission error:', error);
      alert('حدث خطأ أثناء إرسال النموذج. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof IntakeFormData, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addToArray = (field: keyof IntakeFormData, value: string) => {
    const currentArray = formData[field] as string[];
    if (!currentArray.includes(value) && value.trim()) {
      updateFormData(field, [...currentArray, value.trim()]);
    }
  };

  const removeFromArray = (field: keyof IntakeFormData, value: string) => {
    const currentArray = formData[field] as string[];
    updateFormData(field, currentArray.filter(item => item !== value));
  };

  // مصادر اختيار ثابتة محسّنة
  const LANGUAGE_OPTIONS = ['ar', 'en', 'fr', 'tr', 'ku'];

  // جلب فئات فرعية (skills) + معدات (equipment)
  const [skillsOptions, setSkillsOptions] = useState<Array<{ id: string; nameAr: string }>>([]);
  const [equipmentOptions, setEquipmentOptions] = useState<Record<string, Array<{ id: string; name: string }>>>({});

  useEffect(() => {
    (async () => {
      try {
        const [subsRes, eqRes] = await Promise.all([
          fetch('/api/catalog/subcategories?includeDefaults=true'),
          fetch('/api/catalog/equipment'),
        ]);
        if (subsRes.ok) {
          const data = await subsRes.json();
          setSkillsOptions((data.items || []).map((i: any) => ({ id: i.id, nameAr: i.nameAr })));
        }
        if (eqRes.ok) {
          const data = await eqRes.json();
          setEquipmentOptions(data.items || {});
        }
      } catch {}
    })();
  }, []);

  // إزالة التكرار غير المقصود أعلاه

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--text)] mb-4">المعلومات الشخصية</h2>
            
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">
                نبذة عنك *
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => updateFormData('bio', e.target.value)}
                className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent transition-all"
                rows={4}
                placeholder="اكتب نبذة مختصرة عن نفسك وخبرتك في مجال عملك..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">
                رابط معرض الأعمال (Portfolio)
              </label>
              <input
                type="url"
                value={formData.portfolio}
                onChange={(e) => updateFormData('portfolio', e.target.value)}
                className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent transition-all"
                placeholder="https://behance.net/yourusername"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--text)] mb-4">الخبرة والمهارات</h2>
            
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">
                سنوات الخبرة *
              </label>
              <Dropdown
                value={formData.experience || ''}
                onChange={(v) => updateFormData('experience', String(v))}
                options={[
                  { value: 'less-than-1', label: 'أقل من سنة' },
                  { value: '1-2', label: '1-2 سنة' },
                  { value: '3-5', label: '3-5 سنوات' },
                  { value: '6-10', label: '6-10 سنوات' },
                  { value: 'more-than-10', label: 'أكثر من 10 سنوات' },
                ]}
                placeholder="اختر سنوات الخبرة"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">المهارات الأساسية (من الكتالوج)</label>
              <Dropdown
                value={''}
                onChange={(id) => {
                  const name = skillsOptions.find((s) => s.id === id)?.nameAr || String(id);
                  if (id) addToArray('skills', name);
                }}
                options={skillsOptions.map((s) => ({ value: s.id, label: s.nameAr }))}
                placeholder="اختر مهارة من الفئات الفرعية"
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.skills.map((skill, index) => (
                  <span key={index} className="bg-[var(--accent-100)] text-[var(--accent-700)] px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {skill}
                    <button type="button" onClick={() => removeFromArray('skills', skill)} className="text-red-500 hover:text-red-700">×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--text)] mb-4">المعدات والأدوات</h2>
            
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">المعدات المتوفرة لديك (قائمة قياسية)</label>
              <div className="grid md:grid-cols-2 gap-3">
                {Object.entries(equipmentOptions).map(([cat, items]) => (
                  <div key={cat}>
                    <div className="text-sm text-[var(--muted)] mb-1">{cat}</div>
                    <Dropdown
                      value={''}
                      onChange={(v) => {
                        const name = (items || []).find((it: any) => String(it.id) === String(v))?.name || String(v);
                        if (name) addToArray('equipment', name);
                      }}
                      options={(items || []).map((it: any) => ({ value: it.id, label: it.name }))}
                      placeholder={`اختر من ${cat}`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.equipment.map((item, index) => (
                  <span key={index} className="bg-[var(--accent-100)] text-[var(--accent-700)] px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {item}
                    <button type="button" onClick={() => removeFromArray('equipment', item)} className="text-red-500 hover:text-red-700">×</button>
                  </span>
                ))}
              </div>
              <div className="text-xs text-[var(--muted)] mt-2">لا ترى معدّة؟ يمكنك اقتراح عنصر جديد وسيتم اعتماده من الإدارة.</div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--text)] mb-4">التسعير</h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  السعر بالساعة (USD)
                </label>
                <input
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => updateFormData('hourlyRate', parseInt(e.target.value) || 0)}
                  className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent transition-all"
                  placeholder="50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  السعر باليوم (USD)
                </label>
                <input
                  type="number"
                  value={formData.dayRate}
                  onChange={(e) => updateFormData('dayRate', parseInt(e.target.value) || 0)}
                  className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent transition-all"
                  placeholder="300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  رسوم السفر (USD)
                </label>
                <input
                  type="number"
                  value={formData.travelRate}
                  onChange={(e) => updateFormData('travelRate', parseInt(e.target.value) || 0)}
                  className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent transition-all"
                  placeholder="100"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--text)] mb-4">التوفر والتخصص</h2>
            
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">
                التوفر العام
              </label>
              <Dropdown
                value={formData.availability || ''}
                onChange={(v) => updateFormData('availability', String(v))}
                options={[
                  { value: 'full-time', label: 'متفرغ بدوام كامل' },
                  { value: 'part-time', label: 'بدوام جزئي' },
                  { value: 'weekends', label: 'عطل نهاية الأسبوع فقط' },
                  { value: 'flexible', label: 'مرن حسب المشروع' },
                ]}
                placeholder="اختر مستوى التوفر"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">ساعات العمل (تبسيط مبدئي)</label>
              <input
                type="text"
                value={formData.workingHours}
                onChange={(e) => updateFormData('workingHours', e.target.value)}
                className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent transition-all"
                placeholder="مثال: 09:00-17:00 | سيتم استبداله بواجهة أسبوعية لاحقاً"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--text)] mb-4">مراجعة البيانات</h2>
            
            <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--border)]">
              <h3 className="font-semibold text-[var(--text)] mb-4">ملخص المعلومات:</h3>
              
              <div className="space-y-3 text-sm">
                <div><strong>النبذة:</strong> {formData.bio || 'غير محدد'}</div>
                <div><strong>الخبرة:</strong> {formData.experience || 'غير محدد'}</div>
                <div><strong>المهارات:</strong> {formData.skills.join(', ') || 'غير محدد'}</div>
                <div><strong>المعدات:</strong> {formData.equipment.join(', ') || 'غير محدد'}</div>
                <div><strong>السعر بالساعة:</strong> ${formData.hourlyRate}</div>
                <div><strong>السعر باليوم:</strong> ${formData.dayRate}</div>
                <div><strong>التوفر:</strong> {formData.availability || 'غير محدد'}</div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-800 mb-2">
                <AlertCircle size={20} />
                <span className="font-medium">ملاحظة مهمة</span>
              </div>
              <p className="text-blue-700 text-sm">
                بعد إرسال النموذج، سيتم مراجعة طلبك من قبل فريقنا خلال 2-3 أيام عمل. 
                سنتواصل معك عبر البريد الإلكتروني لإعلامك بنتيجة المراجعة.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-500)]" />
      </div>
    );
  }

  return (
    <Container>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            {isWelcome && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <CheckCircle size={24} className="text-green-600 mx-auto mb-2" />
                <h2 className="text-lg font-semibold text-green-800 mb-1">🎉 مرحباً بك!</h2>
                <p className="text-green-700 text-sm">
                  تم إنشاء حسابك بنجاح. الآن أكمل نموذج التفاصيل المهنية للبدء في استلام المشاريع.
                </p>
              </div>
            )}
            
            <h1 className="text-3xl font-bold text-[var(--text)] mb-2">نموذج التفاصيل المهنية</h1>
            <p className="text-[var(--muted)]">
              أكمل معلوماتك المهنية لنتمكن من ربطك بالمشاريع المناسبة
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              {STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center ${index < STEPS.length - 1 ? 'flex-1' : ''}`}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                    ${currentStep >= step.id 
                      ? 'bg-[var(--accent-500)] text-white' 
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}>
                    {currentStep > step.id ? (
                      <CheckCircle size={20} />
                    ) : (
                      <step.icon size={20} />
                    )}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`
                      flex-1 h-0.5 mx-2
                      ${currentStep > step.id ? 'bg-[var(--accent-500)]' : 'bg-gray-200'}
                    `} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <span className="text-sm text-[var(--muted)]">
                الخطوة {currentStep} من {STEPS.length}: {STEPS[currentStep - 1].title}
              </span>
            </div>
          </motion.div>

          {/* Form Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] shadow-lg mb-8"
          >
            {renderStep()}
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-between"
          >
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              السابق
            </Button>

            {currentStep === STEPS.length ? (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <FileText size={16} />
                    إرسال النموذج
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                className="flex items-center gap-2"
              >
                التالي
                <ArrowRight size={16} />
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </Container>
  );
}
