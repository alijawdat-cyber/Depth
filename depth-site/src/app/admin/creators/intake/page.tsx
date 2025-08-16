"use client";

// نموذج إدخال المبدعين الشامل - متوافق مع docs/catalog/03-Creator-Intake-Form.md
// الغرض: نموذج متعدد الخطوات لجمع معلومات المبدع الكاملة
// التدفق: معلومات أساسية → مهارات → معدات → سعة → محاور → معرض أعمال → تسعير

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Dropdown from '@/components/ui/Dropdown';
import SectionHeading from '@/components/ui/SectionHeading';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Stepper from '@/components/ui/Stepper';
import { 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Camera, 
  Palette, 
  Settings,
  Star,
  Upload,
  CheckCircle,
  AlertCircle,
  Save,
  Send
} from 'lucide-react';

// Types based on documentation
interface CreatorIntakeForm {
  // Step 1: Basic Information
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    whatsapp: string;
    instagram?: string;
    city: string;
    canTravel: boolean;
    languages: string[];
  };
  
  // Step 2: Professional Info
  professionalInfo: {
    role: 'photographer' | 'videographer' | 'designer' | 'producer';
    experienceYears: number;
    education?: string;
    certifications: string[];
    previousWork?: string;
  };

  // Step 3: Skills Matrix
  skills: {
    [category: string]: {
      [skill: string]: {
        level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
        experienceYears: number;
        description?: string;
      };
    };
  };

  // Step 4: Equipment Inventory  
  equipment: {
    cameras: EquipmentItem[];
    lenses: EquipmentItem[];
    lighting: EquipmentItem[];
    audio: EquipmentItem[];
    accessories: EquipmentItem[];
    specialSetups: EquipmentItem[];
  };

  // Step 5: Capacity & Availability
  capacity: {
    maxAssetsPerDay: number;
    workingDays: string[];
    standardSLA: number; // hours
    rushSLA: number; // hours
    preferredHours: { start: string; end: string };
    peakSeasons?: string[];
  };

  // Step 6: Verticals & Specializations
  verticals: {
    id: string;
    experience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    yearsOfExperience: number;
    portfolioSamples: string[];
    notes?: string;
  }[];

  // Step 7: Portfolio
  portfolio: {
    category: string;
    vertical: string;
    title: string;
    description: string;
    imageUrl: string;
    clientType?: string;
    year: number;
  }[];

  // Step 8: Internal Pricing
  internalCost: {
    [subcategory: string]: {
      [processing: string]: number; // IQD
    };
  };

  // Step 9: Compliance & Legal
  compliance: {
    clinicsTraining: boolean;
    ndaSigned: boolean;
    equipmentAgreement: boolean;
    backgroundCheck?: boolean;
  };
}

interface EquipmentItem {
  type: string;
  brand: string;
  model: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  owned: boolean;
  quantity?: number;
  notes?: string;
}

const STEPS = [
  { 
    id: '1', 
    title: 'المعلومات الأساسية', 
    description: 'الاسم والتواصل والموقع',
    icon: User 
  },
  { 
    id: '2', 
    title: 'المعلومات المهنية', 
    description: 'التخصص والخبرة',
    icon: Star 
  },
  { 
    id: '3', 
    title: 'المهارات التقنية', 
    description: 'البرامج والتقنيات',
    icon: Settings 
  },
  { 
    id: '4', 
    title: 'المعدات والأدوات', 
    description: 'الكاميرات والأدوات',
    icon: Camera 
  },
  { 
    id: '5', 
    title: 'السعة والتوفر', 
    description: 'الجدولة والطاقة',
    icon: CheckCircle 
  },
  { 
    id: '6', 
    title: 'المحاور التجارية', 
    description: 'التخصص التجاري',
    icon: Palette 
  },
  { 
    id: '7', 
    title: 'معرض الأعمال', 
    description: 'أمثلة سابقة',
    icon: Upload 
  },
  { 
    id: '8', 
    title: 'التسعير الداخلي', 
    description: 'الأسعار والشروط',
    icon: Settings 
  },
  { 
    id: '9', 
    title: 'الامتثال والقانون', 
    description: 'الوثائق القانونية',
    icon: AlertCircle 
  }
];

export default function CreatorIntakePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const creatorId = searchParams.get('creatorId');

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form data
  const [formData, setFormData] = useState<CreatorIntakeForm>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      whatsapp: '',
      instagram: '',
      city: '',
      canTravel: false,
      languages: ['ar']
    },
    professionalInfo: {
      role: 'photographer',
      experienceYears: 0,
      education: '',
      certifications: [],
      previousWork: ''
    },
    skills: {},
    equipment: {
      cameras: [],
      lenses: [],
      lighting: [],
      audio: [],
      accessories: [],
      specialSetups: []
    },
    capacity: {
      maxAssetsPerDay: 10,
      workingDays: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
      standardSLA: 48,
      rushSLA: 24,
      preferredHours: { start: '09:00', end: '17:00' }
    },
    verticals: [],
    portfolio: [],
    internalCost: {},
    compliance: {
      clinicsTraining: false,
      ndaSigned: false,
      equipmentAgreement: false
    }
  });

  const loadCreatorData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/creators/${creatorId}/intake`);
      if (response.ok) {
        const data = await response.json();
        setFormData(data.intakeForm || formData);
      }
    } catch (error) {
      console.error('Error loading creator data:', error);
      setError('فشل في تحميل بيانات المبدع');
    } finally {
      setLoading(false);
    }
  }, [creatorId, formData]);

  // Load existing data if editing
  useEffect(() => {
    if (creatorId) {
      loadCreatorData();
    }
  }, [creatorId, loadCreatorData]);

  const handleSave = async (isDraft = true) => {
    try {
      setSaving(true);
      setError(null);

      const endpoint = creatorId 
        ? `/api/admin/creators/${creatorId}/intake`
        : '/api/admin/creators/intake';

      const response = await fetch(endpoint, {
        method: creatorId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intakeForm: formData,
          status: isDraft ? 'intake_draft' : 'intake_submitted'
        })
      });

      if (!response.ok) {
        throw new Error('فشل في حفظ البيانات');
      }

      await response.json();
      setSuccess(isDraft ? 'تم حفظ المسودة' : 'تم إرسال النموذج للمراجعة');

      if (!isDraft) {
        setTimeout(() => {
          router.push('/admin/creators');
        }, 2000);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setSaving(false);
    }
  };

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

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.personalInfo.fullName && 
                 formData.personalInfo.email && 
                 formData.personalInfo.phone && 
                 formData.personalInfo.city);
      case 2:
        return !!(formData.professionalInfo.role && 
                 formData.professionalInfo.experienceYears > 0);
      // Add validation for other steps
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfoStep();
      case 2:
        return renderProfessionalInfoStep();
      case 3:
        return renderSkillsStep();
      case 4:
        return renderEquipmentStep();
      case 5:
        return renderCapacityStep();
      case 6:
        return renderVerticalsStep();
      case 7:
        return renderPortfolioStep();
      case 8:
        return renderPricingStep();
      case 9:
        return renderComplianceStep();
      default:
        return null;
    }
  };

  const renderPersonalInfoStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">
            الاسم الكامل *
          </label>
          <input
            type="text"
            value={formData.personalInfo.fullName}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, fullName: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
            placeholder="أدخل الاسم الكامل"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">
            البريد الإلكتروني *
          </label>
          <input
            type="email"
            value={formData.personalInfo.email}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, email: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
            placeholder="example@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">
            رقم الهاتف *
          </label>
          <input
            type="tel"
            value={formData.personalInfo.phone}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, phone: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
            placeholder="+964xxxxxxxxx"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">
            واتساب *
          </label>
          <input
            type="tel"
            value={formData.personalInfo.whatsapp}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, whatsapp: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
            placeholder="+964xxxxxxxxx"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">
            إنستغرام (اختياري)
          </label>
          <input
            type="text"
            value={formData.personalInfo.instagram || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, instagram: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
            placeholder="@username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">
            المدينة *
          </label>
          <input
            type="text"
            value={formData.personalInfo.city}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, city: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
            placeholder="بغداد"
            required
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="canTravel"
          checked={formData.personalInfo.canTravel}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, canTravel: e.target.checked }
          }))}
          className="w-4 h-4 text-[var(--accent-500)]"
        />
        <label htmlFor="canTravel" className="text-sm text-[var(--text)]">
          أستطيع السفر للمحافظات الأخرى
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text)] mb-2">
          اللغات المتقنة
        </label>
        <div className="flex flex-wrap gap-2">
          {['ar', 'en', 'ku'].map(lang => (
            <label key={lang} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.personalInfo.languages.includes(lang)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData(prev => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        languages: [...prev.personalInfo.languages, lang]
                      }
                    }));
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        languages: prev.personalInfo.languages.filter(l => l !== lang)
                      }
                    }));
                  }
                }}
                className="w-4 h-4"
              />
              <span className="text-sm">
                {lang === 'ar' ? 'العربية' : lang === 'en' ? 'الإنجليزية' : 'الكردية'}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfessionalInfoStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">
            الدور الأساسي *
          </label>
          <Dropdown
            options={[
              { value: 'photographer', label: 'مصور' },
              { value: 'videographer', label: 'مصور فيديو' },
              { value: 'designer', label: 'مصمم' },
              { value: 'producer', label: 'منتج' }
            ]}
            value={formData.professionalInfo.role}
            onChange={(value) => setFormData(prev => ({
              ...prev,
              professionalInfo: { ...prev.professionalInfo, role: value as 'photographer' | 'videographer' | 'designer' | 'producer' }
            }))}
            placeholder="اختر الدور"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">
            سنوات الخبرة *
          </label>
          <input
            type="number"
            min="0"
            max="50"
            value={formData.professionalInfo.experienceYears}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              professionalInfo: { ...prev.professionalInfo, experienceYears: parseInt(e.target.value) || 0 }
            }))}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[var(--text)] mb-2">
            التعليم والمؤهلات
          </label>
          <textarea
            value={formData.professionalInfo.education || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              professionalInfo: { ...prev.professionalInfo, education: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
            rows={3}
            placeholder="بكالوريوس فنون جميلة، دورات تدريبية، شهادات..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[var(--text)] mb-2">
            الخبرة السابقة
          </label>
          <textarea
            value={formData.professionalInfo.previousWork || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              professionalInfo: { ...prev.professionalInfo, previousWork: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
            rows={4}
            placeholder="اذكر أهم الشركات أو العملاء الذين عملت معهم..."
          />
        </div>
      </div>
    </div>
  );

  // Additional step renderers would go here...
  const renderSkillsStep = () => (
    <div className="space-y-6">
      <div className="text-center py-8">
        <Settings size={48} className="mx-auto text-[var(--muted)] mb-4" />
        <h3 className="text-lg font-medium text-[var(--text)] mb-2">مصفوفة المهارات</h3>
        <p className="text-[var(--muted)]">سيتم تطوير هذا القسم في المرحلة القادمة</p>
      </div>
    </div>
  );

  const renderEquipmentStep = () => (
    <div className="space-y-6">
      <div className="text-center py-8">
        <Camera size={48} className="mx-auto text-[var(--muted)] mb-4" />
        <h3 className="text-lg font-medium text-[var(--text)] mb-2">جرد المعدات</h3>
        <p className="text-[var(--muted)]">سيتم تطوير هذا القسم في المرحلة القادمة</p>
      </div>
    </div>
  );

  const renderCapacityStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">
            الحد الأقصى للأصول يومياً
          </label>
          <input
            type="number"
            min="1"
            value={formData.capacity.maxAssetsPerDay}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              capacity: { ...prev.capacity, maxAssetsPerDay: parseInt(e.target.value) || 1 }
            }))}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">
            SLA عادي (ساعة)
          </label>
          <input
            type="number"
            min="1"
            value={formData.capacity.standardSLA}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              capacity: { ...prev.capacity, standardSLA: parseInt(e.target.value) || 48 }
            }))}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">
            SLA عاجل (ساعة)
          </label>
          <input
            type="number"
            min="1"
            value={formData.capacity.rushSLA}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              capacity: { ...prev.capacity, rushSLA: parseInt(e.target.value) || 24 }
            }))}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
          />
        </div>
      </div>
    </div>
  );

  // Placeholder renderers for remaining steps
  const renderVerticalsStep = () => (
    <div className="text-center py-8">
      <Palette size={48} className="mx-auto text-[var(--muted)] mb-4" />
      <h3 className="text-lg font-medium text-[var(--text)] mb-2">المحاور التجارية</h3>
      <p className="text-[var(--muted)]">سيتم تطوير هذا القسم في المرحلة القادمة</p>
    </div>
  );

  const renderPortfolioStep = () => (
    <div className="text-center py-8">
      <Upload size={48} className="mx-auto text-[var(--muted)] mb-4" />
      <h3 className="text-lg font-medium text-[var(--text)] mb-2">معرض الأعمال</h3>
      <p className="text-[var(--muted)]">سيتم تطوير هذا القسم في المرحلة القادمة</p>
    </div>
  );

  const renderPricingStep = () => (
    <div className="text-center py-8">
      <Settings size={48} className="mx-auto text-[var(--muted)] mb-4" />
      <h3 className="text-lg font-medium text-[var(--text)] mb-2">التسعير الداخلي</h3>
      <p className="text-[var(--muted)]">سيتم تطوير هذا القسم في المرحلة القادمة</p>
    </div>
  );

  const renderComplianceStep = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="ndaSigned"
            checked={formData.compliance.ndaSigned}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              compliance: { ...prev.compliance, ndaSigned: e.target.checked }
            }))}
            className="w-4 h-4 text-[var(--accent-500)]"
          />
          <label htmlFor="ndaSigned" className="text-sm text-[var(--text)]">
            تم توقيع اتفاقية عدم الإفشاء (NDA)
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="equipmentAgreement"
            checked={formData.compliance.equipmentAgreement}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              compliance: { ...prev.compliance, equipmentAgreement: e.target.checked }
            }))}
            className="w-4 h-4 text-[var(--accent-500)]"
          />
          <label htmlFor="equipmentAgreement" className="text-sm text-[var(--text)]">
            تم توقيع اتفاقية المعدات
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="clinicsTraining"
            checked={formData.compliance.clinicsTraining}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              compliance: { ...prev.compliance, clinicsTraining: e.target.checked }
            }))}
            className="w-4 h-4 text-[var(--accent-500)]"
          />
          <label htmlFor="clinicsTraining" className="text-sm text-[var(--text)]">
            تم إكمال تدريب العيادات (مطلوب للعمل في القطاع الطبي)
          </label>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-500)] mx-auto mb-4"></div>
          <p className="text-[var(--muted)]">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <Breadcrumbs />
      
      {/* Header */}
      <SectionHeading
        title="نموذج إدخال المبدع"
        description="نموذج شامل لجمع معلومات المبدع وتقييم قدراته"
      />

      {/* Progress Stepper */}
      <div className="mb-8">
        <Stepper
          steps={STEPS}
          currentStep={currentStep}
          onStepClick={setCurrentStep}
          orientation="horizontal"
          showDescription={true}
          className="mb-6"
        />
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 bg-[var(--danger-bg)] border border-[var(--danger-border)] rounded-[var(--radius)]">
          <div className="flex items-center gap-2 text-[var(--danger-fg)]">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-[var(--success-bg)] border border-[var(--success-border)] rounded-[var(--radius)]">
          <div className="flex items-center gap-2 text-[var(--success-fg)]">
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] p-6 mb-6">
        <h2 className="text-xl font-semibold text-[var(--text)] mb-6">
          {STEPS[currentStep - 1]?.title}
        </h2>
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {currentStep > 1 && (
            <Button variant="secondary" onClick={prevStep}>
              <ArrowRight size={16} />
              السابق
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="secondary" 
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            <Save size={16} />
            {saving ? 'جاري الحفظ...' : 'حفظ مسودة'}
          </Button>

          {currentStep < STEPS.length ? (
            <Button 
              onClick={nextStep}
              disabled={!isStepValid(currentStep)}
            >
              التالي
              <ArrowLeft size={16} />
            </Button>
          ) : (
            <Button 
              onClick={() => handleSave(false)}
              disabled={saving || !isStepValid(currentStep)}
            >
              <Send size={16} />
              {saving ? 'جاري الإرسال...' : 'إرسال للمراجعة'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
