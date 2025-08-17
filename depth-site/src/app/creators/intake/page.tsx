'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Dropdown from '@/components/ui/Dropdown';
import PageLayout from '@/components/layout/PageLayout';
import Loader from '@/components/loaders/Loader';
import {
  User,
  Award,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// النموذج البسيط - الأساسيات فقط للتسجيل الأولي
interface BasicIntakeFormData {
  // المعلومات الأساسية فقط
  role: 'photographer' | 'videographer' | 'designer' | 'producer';
  primaryCategories: ('photo' | 'video' | 'design')[]; // الفئات الرئيسية
  city: string;
  canTravel: boolean;
  
  // خبرة أساسية
  experienceLevel: 'beginner' | 'intermediate' | 'professional';
  experienceYears: string; // '0-1', '2-3', '4-7', '8+'
  
  // معرض أعمال بسيط
  portfolioUrl?: string;
  workSamples: string[]; // روابط مباشرة لعينات العمل (3-5 عينات)
  
  // التوفر الأساسي
  availability: 'full-time' | 'part-time' | 'weekends' | 'flexible';
  
  // معلومات التواصل المحدثة (اختيارية)
  whatsapp?: string;
  instagram?: string;
}

// خطوات مبسطة للتسجيل الأولي
const SIMPLE_STEPS = [
  { id: 1, title: 'المعلومات الأساسية', icon: User },
  { id: 2, title: 'التخصص والخبرة', icon: Award },
  { id: 3, title: 'معرض الأعمال', icon: FileText },
  { id: 4, title: 'التوفر والإرسال', icon: CheckCircle }
];

export default function CreatorIntakePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BasicIntakeFormData>({
    role: (session?.user?.role as BasicIntakeFormData['role']) || 'photographer',
    primaryCategories: [],
    city: '',
    canTravel: false,
    experienceLevel: 'beginner',
    experienceYears: '0-1',
    portfolioUrl: '',
    workSamples: [],
    availability: 'flexible',
    whatsapp: '',
    instagram: ''
  });

  const isWelcome = searchParams?.get('welcome') === 'true';

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }

    if (session.user.role !== 'creator') {
      router.push('/portal');
      return;
    }
  }, [session, status, router]);

  const nextStep = () => {
    if (currentStep < SIMPLE_STEPS.length) {
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
      const response = await fetch('/api/creators/intake-basic', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // توجيه للنموذج المتقدم لاستكمال التفاصيل
        router.push('/creators/intake-complete?step=professional');
      } else {
        throw new Error('فشل في إرسال النموذج');
      }
    } catch (error) {
      console.error('Basic intake submission error:', error);
      alert('حدث خطأ أثناء إرسال النموذج. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof BasicIntakeFormData, value: BasicIntakeFormData[keyof BasicIntakeFormData]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addWorkSample = (url: string) => {
    if (url.trim() && !formData.workSamples.includes(url.trim()) && formData.workSamples.length < 5) {
      updateFormData('workSamples', [...formData.workSamples, url.trim()]);
    }
  };

  const removeWorkSample = (url: string) => {
    updateFormData('workSamples', formData.workSamples.filter(item => item !== url));
  };

  const handleCategoryChange = (categoryId: 'photo' | 'video' | 'design', checked: boolean) => {
    const newCategories = checked 
      ? [...formData.primaryCategories, categoryId]
      : formData.primaryCategories.filter(id => id !== categoryId);
    updateFormData('primaryCategories', newCategories);
  };

  // دالة مساعدة لأسماء الفئات
  const getCategoryName = (categoryId: string) => {
    const names = {
      photo: 'التصوير الفوتوغرافي',
      video: 'إنتاج الفيديو',
      design: 'التصميم الجرافيكي'
    };
    return names[categoryId as keyof typeof names] || categoryId;
  };

  // التحقق من صحة البيانات حسب الخطوة
  const validateStep = (stepId: number): boolean => {
    switch (stepId) {
      case 1:
        return !!formData.role && !!formData.city.trim() && formData.primaryCategories.length > 0;
      case 2:
        return !!formData.experienceLevel && !!formData.experienceYears;
      case 3:
        return formData.workSamples.length >= 2; // على الأقل عينتان من العمل
      case 4:
        return !!formData.availability;
      default:
        return true;
    }
  };

  // دالة لإضافة عينة عمل جديدة
  const [newSampleUrl, setNewSampleUrl] = useState('');

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--text)] mb-4">المعلومات الأساسية</h2>
            
            {/* دور المبدع */}
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">
                دورك الأساسي *
              </label>
              <Dropdown
                value={formData.role}
                onChange={(v: string) => updateFormData('role', v as BasicIntakeFormData['role'])}
                options={[
                  { value: 'photographer', label: 'مصور فوتوغرافي' },
                  { value: 'videographer', label: 'مصور فيديو' },
                  { value: 'designer', label: 'مصمم جرافيكي' },
                  { value: 'producer', label: 'منتج محتوى' }
                ]}
                placeholder="اختر دورك"
              />
            </div>

            {/* الفئات الرئيسية */}
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">
                مجالات عملك الرئيسية * (يمكن اختيار أكثر من مجال)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(['photo', 'video', 'design'] as const).map(categoryId => (
                  <label key={categoryId} className="flex items-center gap-3 p-3 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-alt)] cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.primaryCategories.includes(categoryId)}
                      onChange={(e) => handleCategoryChange(categoryId, e.target.checked)}
                      className="w-4 h-4 text-[var(--accent-500)] rounded"
                    />
                    <span className="text-[var(--text)]">{getCategoryName(categoryId)}</span>
                  </label>
                ))}
              </div>
              {formData.primaryCategories.length === 0 && (
                <p className="text-sm text-[var(--error-fg)] mt-1">يجب اختيار مجال واحد على الأقل</p>
              )}
            </div>

            {/* الموقع */}
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">
                المدينة *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => updateFormData('city', e.target.value)}
                className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent transition-all"
                placeholder="مثال: بغداد"
                required
              />
            </div>

            {/* السفر */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.canTravel}
                  onChange={(e) => updateFormData('canTravel', e.target.checked)}
                  className="w-4 h-4 text-[var(--accent-500)] rounded"
                />
                <span className="text-[var(--text)]">أستطيع السفر لمواقع التصوير</span>
              </label>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--text)] mb-4">التخصص والخبرة</h2>
            
            {/* مستوى الخبرة */}
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">
                مستوى خبرتك *
              </label>
              <Dropdown
                value={formData.experienceLevel}
                onChange={(v: string) => updateFormData('experienceLevel', v as BasicIntakeFormData['experienceLevel'])}
                options={[
                  { value: 'beginner', label: 'مبتدئ - بدأت حديثاً' },
                  { value: 'intermediate', label: 'متوسط - لدي خبرة جيدة' },
                  { value: 'professional', label: 'محترف - خبرة واسعة' }
                ]}
                placeholder="اختر مستوى خبرتك"
              />
            </div>

            {/* سنوات الخبرة */}
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">
                عدد سنوات الخبرة *
              </label>
              <Dropdown
                value={formData.experienceYears}
                onChange={(v: string) => updateFormData('experienceYears', v)}
                options={[
                  { value: '0-1', label: 'أقل من سنتين' },
                  { value: '2-3', label: '2-3 سنوات' },
                  { value: '4-7', label: '4-7 سنوات' },
                  { value: '8+', label: '8 سنوات أو أكثر' }
                ]}
                placeholder="اختر عدد سنوات الخبرة"
              />
            </div>

            {/* معلومات التواصل الإضافية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  رقم الواتساب (اختياري)
                </label>
                <input
                  type="tel"
                  value={formData.whatsapp || ''}
                  onChange={(e) => updateFormData('whatsapp', e.target.value)}
                  className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent transition-all"
                  placeholder="مثال: +964 770 123 4567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  حساب الإنستقرام (اختياري)
                </label>
                <input
                  type="text"
                  value={formData.instagram || ''}
                  onChange={(e) => updateFormData('instagram', e.target.value)}
                  className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent transition-all"
                  placeholder="مثال: @yourusername"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--text)] mb-4">معرض الأعمال</h2>
            
            {/* رابط المعرض الرئيسي */}
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">
                رابط معرض أعمالك (Portfolio)
              </label>
              <input
                type="url"
                value={formData.portfolioUrl || ''}
                onChange={(e) => updateFormData('portfolioUrl', e.target.value)}
                className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent transition-all"
                placeholder="https://behance.net/yourusername"
              />
              <p className="text-sm text-[var(--muted)] mt-1">
                اختياري - يمكنك إضافة رابط لمعرض أعمالك على Behance، Instagram، أو موقعك الشخصي
              </p>
            </div>

            {/* عينات العمل */}
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">
                عينات من أعمالك * (2-5 عينات)
              </label>
              
              {/* إضافة عينة جديدة */}
              <div className="flex gap-2 mb-3">
                <input
                  type="url"
                  value={newSampleUrl}
                  onChange={(e) => setNewSampleUrl(e.target.value)}
                  className="flex-1 p-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent transition-all"
                  placeholder="الصق رابط عينة من عملك هنا..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addWorkSample(newSampleUrl);
                      setNewSampleUrl('');
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    addWorkSample(newSampleUrl);
                    setNewSampleUrl('');
                  }}
                  disabled={!newSampleUrl.trim() || formData.workSamples.length >= 5}
                >
                  إضافة
                </Button>
              </div>

              {/* عرض العينات المضافة */}
              {formData.workSamples.length > 0 && (
                <div className="space-y-2">
                  {formData.workSamples.map((url, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-[var(--bg-alt)] rounded-lg">
                      <FileText size={16} className="text-[var(--accent-500)]" />
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 text-sm text-[var(--accent-600)] hover:underline truncate"
                      >
                        {url}
                      </a>
                      <button
                        type="button"
                        onClick={() => removeWorkSample(url)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-[var(--accent-bg)] border border-[var(--accent-border)] rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-[var(--accent-fg)] mt-0.5" />
                  <div className="text-sm text-[var(--accent-fg)]">
                    <p className="font-medium mb-1">نصائح لعينات العمل:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>استخدم روابط من Instagram، Behance، أو Google Drive</li>
                      <li>تأكد أن الروابط تعمل ويمكن عرضها</li>
                      <li>اختر أفضل أعمالك التي تمثل مهاراتك</li>
                    </ul>
                  </div>
                </div>
              </div>

              {formData.workSamples.length < 2 && (
                <p className="text-sm text-[var(--error-fg)] mt-1">يجب إضافة عينتين على الأقل من أعمالك</p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--text)] mb-4">التوفر والإرسال</h2>
            
            {/* التوفر الأساسي */}
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">
                مدى توفرك للعمل *
              </label>
              <Dropdown
                value={formData.availability}
                onChange={(v: string) => updateFormData('availability', v as BasicIntakeFormData['availability'])}
                options={[
                  { value: 'full-time', label: 'دوام كامل - متاح يومياً' },
                  { value: 'part-time', label: 'دوام جزئي - عدة أيام بالأسبوع' },
                  { value: 'weekends', label: 'نهايات الأسبوع فقط' },
                  { value: 'flexible', label: 'مرن - حسب المشروع' }
                ]}
                placeholder="اختر مدى توفرك"
              />
            </div>

            {/* ملخص البيانات */}
            <div className="bg-[var(--bg-alt)] border border-[var(--border)] rounded-lg p-4">
              <h3 className="font-semibold text-[var(--text)] mb-3">ملخص بياناتك:</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">الدور:</span> {formData.role === 'photographer' ? 'مصور فوتوغرافي' : formData.role === 'videographer' ? 'مصور فيديو' : formData.role === 'designer' ? 'مصمم جرافيكي' : 'منتج محتوى'}</p>
                <p><span className="font-medium">المجالات:</span> {formData.primaryCategories.map(getCategoryName).join(', ')}</p>
                <p><span className="font-medium">المدينة:</span> {formData.city}</p>
                <p><span className="font-medium">الخبرة:</span> {formData.experienceLevel === 'beginner' ? 'مبتدئ' : formData.experienceLevel === 'intermediate' ? 'متوسط' : 'محترف'} ({formData.experienceYears})</p>
                <p><span className="font-medium">عينات العمل:</span> {formData.workSamples.length} عينة</p>
                <p><span className="font-medium">التوفر:</span> {formData.availability === 'full-time' ? 'دوام كامل' : formData.availability === 'part-time' ? 'دوام جزئي' : formData.availability === 'weekends' ? 'نهايات الأسبوع' : 'مرن'}</p>
              </div>
            </div>

            <div className="bg-[var(--success-bg)] border border-[var(--success-border)] rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-[var(--success-fg)] mt-0.5" />
                <div className="text-sm text-[var(--success-fg)]">
                  <p className="font-medium mb-1">الخطوات التالية:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>بعد الإرسال، ستنتقل لاستكمال التفاصيل المهنية</li>
                    <li>سيتم مراجعة طلبك خلال 24-48 ساعة</li>
                    <li>ستحصل على تأكيد القبول عبر البريد الإلكتروني</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-[var(--bg)] py-8">
        <div className="max-w-2xl mx-auto px-4">
          
          {/* رأس الصفحة */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[var(--text)] mb-2">
              {isWelcome ? 'مرحباً! لنبدأ رحلتك معنا' : 'تسجيل المبدع - النموذج البسيط'}
            </h1>
            <p className="text-[var(--muted)] max-w-md mx-auto">
              سجل المعلومات الأساسية للبدء، ويمكنك استكمال التفاصيل المهنية لاحقاً
            </p>
          </div>

          {/* مؤشر التقدم */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {SIMPLE_STEPS.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-2 ${
                    currentStep >= step.id ? 'text-[var(--accent-500)]' : 'text-[var(--muted)]'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                    currentStep >= step.id 
                      ? 'bg-[var(--accent-500)] text-white border-[var(--accent-500)]'
                      : 'border-[var(--border)] text-[var(--muted)]'
                  }`}>
                    {currentStep > step.id ? <CheckCircle size={16} /> : step.id}
                  </div>
                  <span className="text-sm font-medium hidden md:block">{step.title}</span>
                </div>
              ))}
            </div>
            <div className="w-full bg-[var(--border)] rounded-full h-2">
              <div 
                className="bg-[var(--accent-500)] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / SIMPLE_STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* محتوى النموذج */}
          <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-6 mb-6">
            {renderStep()}
          </div>

          {/* أزرار التنقل */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              السابق
            </Button>
            
            <div className="flex gap-2">
              {currentStep < SIMPLE_STEPS.length ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                >
                  التالي
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || !validateStep(currentStep)}
                  className="min-w-[120px]"
                >
                  {loading ? <Loader /> : 'إرسال والمتابعة'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}