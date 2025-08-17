"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
// motion و Container غير مستخدمين في هذا الإصدار - تم حذفهما
import { Button } from '@/components/ui/Button';
import { WeeklyAvailability } from '@/types/creators';
import { 
  User, 
  Award, 
  Settings, 
  DollarSign, 
  FileText, 
  CheckCircle,
  ArrowLeft,
  ArrowRight,

  Briefcase,
  Clock,
  Shield,
  TrendingUp,
  AlertCircle,

  Star
} from 'lucide-react';

// 1) بنية البيانات الكاملة حسب التوثيق
interface IntakeFormData {
  // 1) الهوية والتواصل (مكتملة من التسجيل)
  personalInfo: {
    fullName: string;
    role: 'photographer' | 'videographer' | 'designer' | 'producer';
    city: string;
    canTravel: boolean;
    languages: string[]; // ['ar', 'en']
    contact: {
      email: string;
      whatsapp: string;
      instagram?: string;
    };
  };

  // 2) Skills Matrix (حسب الكتالوغ)
  skills: {
    [subcategoryId: string]: {
      level: 'beginner' | 'intermediate' | 'pro';
      notes?: string;
    };
  };

  // 3) المحاور المفضلة (Verticals)
  verticals: string[]; // معرفات المحاور من الكتالوغ

  // 4) المعدات (Equipment Inventory)
  equipment: {
    cameras: EquipmentItem[];
    lenses: EquipmentItem[];
    lighting: EquipmentItem[];
    audio: EquipmentItem[];
    accessories: EquipmentItem[];
    specialSetups: EquipmentItem[];
  };

  // 5) السعة والزمن (Capacity & Time)
  capacity: {
    maxAssetsPerDay: number;
    weeklyAvailability: WeeklyAvailability[]; // جدول أسبوعي مفصل
    standardSLA: number; // بالساعات
    rushSLA: number; // بالساعات
  };

  // 6) الامتثال (Compliance)
  compliance: {
    clinicsTraining: boolean;
    ndaSigned: boolean;
    equipmentAgreement: boolean;
  };

  // 7) الكلفة الداخلية (Internal Cost Baseline)
  internalCost: {
    photoPerAsset?: number; // IQD
    reelPerAsset?: number; // IQD
    dayRate?: number; // IQD
  };

  // 8) التسعير الفردي (Rate Overrides) - Draft
  rateOverrides: {
    [key: string]: {
      deliverable: string;
      vertical?: string;
      processing: 'raw_only' | 'raw_basic' | 'full_retouch';
      conditions: 'studio' | 'location';
      priority: 'standard' | 'rush';
      priceIQD: number;
      priceUSD?: number; // للعرض فقط
      notes?: string;
    };
  };

  // 9) الجودة والانضباط (Self-Assessment)
  selfAssessment: {
    onTimePercentage: number; // آخر 90 يوم
    firstPassPercentage: number; // قبول من أول نسخة
    notes?: string;
    risks?: string;
  };

  // 10) مرفقات (Portfolio)
  portfolio: {
    portfolioLinks: string[];
    certificates: string[];
    samples: {
      url: string;
      description: string;
      category: string;
    }[];
  };
}

interface EquipmentItem {
  name: string;
  model: string;
  quantity: number;
  condition: 'excellent' | 'good' | 'fair';
  notes?: string;
}

// خطوات النموذج الـ 10 حسب التوثيق
const STEPS = [
  { id: 1, title: 'الهوية والتواصل', icon: User, description: 'المعلومات الشخصية والتواصل' },
  { id: 2, title: 'Skills Matrix', icon: Award, description: 'المهارات حسب الكتالوغ' },
  { id: 3, title: 'المحاور المفضلة', icon: Briefcase, description: 'Verticals والتخصصات' },
  { id: 4, title: 'المعدات', icon: Settings, description: 'Equipment Inventory مفصل' },
  { id: 5, title: 'السعة والزمن', icon: Clock, description: 'Capacity & Time Management' },
  { id: 6, title: 'الامتثال', icon: Shield, description: 'Compliance والموافقات' },
  { id: 7, title: 'الكلفة الداخلية', icon: DollarSign, description: 'Internal Cost Baseline' },
  { id: 8, title: 'التسعير الفردي', icon: TrendingUp, description: 'Rate Overrides Draft' },
  { id: 9, title: 'الجودة والانضباط', icon: Star, description: 'Self-Assessment' },
  { id: 10, title: 'المرفقات', icon: FileText, description: 'Portfolio والشهادات' }
];

export default function CompleteCreatorIntakePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isWelcome = searchParams.get('welcome') === 'true';
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // بيانات النموذج الكاملة
  const [formData, setFormData] = useState<IntakeFormData>({
    personalInfo: {
      fullName: '',
      role: 'photographer',
      city: '',
      canTravel: false,
      languages: ['ar'],
      contact: {
        email: '',
        whatsapp: '',
        instagram: ''
      }
    },
    skills: {},
    verticals: [],
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
      weeklyAvailability: [],
      standardSLA: 48,
      rushSLA: 24
    },
    compliance: {
      clinicsTraining: false,
      ndaSigned: false,
      equipmentAgreement: false
    },
    internalCost: {},
    rateOverrides: {},
    selfAssessment: {
      onTimePercentage: 95,
      firstPassPercentage: 90
    },
    portfolio: {
      portfolioLinks: [],
      certificates: [],
      samples: []
    }
  });

  const loadExistingData = useCallback(async () => {
    try {
      const response = await fetch('/api/creators/profile');
      if (response.ok) {
        const data = await response.json();
        if (data.creator) {
          // تحديث البيانات الشخصية
          if (data.creator.fullName || data.creator.role || data.creator.city) {
            setFormData(prev => ({
              ...prev,
              personalInfo: {
                ...prev.personalInfo,
                fullName: data.creator.fullName || prev.personalInfo.fullName,
                role: data.creator.role || prev.personalInfo.role,
                city: data.creator.city || prev.personalInfo.city,
                canTravel: data.creator.canTravel !== undefined ? data.creator.canTravel : prev.personalInfo.canTravel,
                languages: data.creator.languages || prev.personalInfo.languages,
                contact: {
                  ...prev.personalInfo.contact,
                  email: data.creator.email || prev.personalInfo.contact.email,
                  whatsapp: data.creator.whatsapp || prev.personalInfo.contact.whatsapp,
                  instagram: data.creator.instagram || prev.personalInfo.contact.instagram,
                }
              }
            }));
          }
          
          // تحديث المهارات إذا وجدت
          if (data.creator.skills) {
            setFormData(prev => ({
              ...prev,
              skills: data.creator.skills
            }));
          }
          
          // تحديث المحاور المفضلة
          if (data.creator.verticals) {
            setFormData(prev => ({
              ...prev,
              verticals: data.creator.verticals
            }));
          }
        }
      }
    } catch (loadError) {
      console.error('Failed to load existing data:', loadError);
      setError('فشل في تحميل البيانات الموجودة');
    }
  }, []);

  // التحقق من الجلسة
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin?from=creators/intake-complete');
      return;
    }

    if (session.user.role !== 'creator') {
      router.push('/portal');
      return;
    }

      // تحميل البيانات الحالية إذا وجدت
  loadExistingData();
}, [session, status, router, loadExistingData]);

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
    setError(null);

    try {
      const response = await fetch('/api/creators/intake-complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/creators?intake=completed');
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'فشل في إرسال النموذج');
      }
    } catch (submitError) {
      console.error('Submit error:', submitError);
      setError('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  // عرض الخطوة الحالية
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfoStep();
      case 2:
        return renderSkillsMatrixStep();
      case 3:
        return renderVerticalsStep();
      case 4:
        return renderEquipmentStep();
      case 5:
        return renderCapacityStep();
      case 6:
        return renderComplianceStep();
      case 7:
        return renderInternalCostStep();
      case 8:
        return renderRateOverridesStep();
      case 9:
        return renderSelfAssessmentStep();
      case 10:
        return renderPortfolioStep();
      default:
        return null;
    }
  };

  // 1) الهوية والتواصل
  const renderPersonalInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[var(--text)] mb-2">الهوية والتواصل</h2>
        <p className="text-[var(--muted)]">المعلومات الشخصية وبيانات التواصل</p>
      </div>

      <div className="space-y-4">
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
            className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
            placeholder="أحمد محمد علي"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">
            التخصص *
          </label>
          <select
            value={formData.personalInfo.role}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, role: e.target.value as 'photographer' | 'videographer' | 'designer' | 'producer' }
            }))}
            className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
          >
            <option value="photographer">📸 مصور</option>
            <option value="videographer">🎥 مصور فيديو</option>
            <option value="designer">🎨 مصمم</option>
            <option value="producer">⚙️ منتج</option>
          </select>
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
            className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
            placeholder="بغداد"
            required
          />
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
            className="w-5 h-5 text-[var(--accent-500)] bg-[var(--bg)] border-[var(--border)] rounded focus:ring-[var(--accent-500)]"
          />
          <label htmlFor="canTravel" className="text-sm font-medium text-[var(--text)]">
            أستطيع السفر للمحافظات الأخرى
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">
            رقم الواتساب *
          </label>
          <input
            type="tel"
            value={formData.personalInfo.contact.whatsapp}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              personalInfo: {
                ...prev.personalInfo,
                contact: { ...prev.personalInfo.contact, whatsapp: e.target.value }
              }
            }))}
            className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
            placeholder="+964 770 123 4567"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">
            حساب الإنستغرام (اختياري)
          </label>
          <input
            type="text"
            value={formData.personalInfo.contact.instagram || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              personalInfo: {
                ...prev.personalInfo,
                contact: { ...prev.personalInfo.contact, instagram: e.target.value }
              }
            }))}
            className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
            placeholder="@username"
          />
        </div>
      </div>
    </div>
  );

  // 2) Skills Matrix - سيتم تطويرها لاحقاً مع ربط الكتالوغ
  const renderSkillsMatrixStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[var(--text)] mb-2">Skills Matrix</h2>
        <p className="text-[var(--muted)]">اختر المهارات التي تتقنها من الكتالوغ</p>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-yellow-800">
          <AlertCircle size={20} />
          <span className="font-medium">قيد التطوير</span>
        </div>
        <p className="text-sm text-yellow-700 mt-1">
          سيتم ربط هذا القسم مع كتالوغ الخدمات لاختيار المهارات المحددة
        </p>
      </div>
    </div>
  );

  // باقي الخطوات - مبسطة مؤقتاً
  const renderVerticalsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[var(--text)] mb-2">المحاور المفضلة</h2>
        <p className="text-[var(--muted)]">اختر المجالات التي تفضل العمل بها</p>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-800">
          <AlertCircle size={20} />
          <span className="font-medium">قيد التطوير</span>
        </div>
        <p className="text-sm text-blue-700 mt-1">
          سيتم إضافة قائمة المحاور: Fashion, Beauty/Clinics, F&B, إلخ...
        </p>
      </div>
    </div>
  );

  const renderEquipmentStep = () => {
    const equipmentCategories = [
      { id: 'cameras', nameAr: 'الكاميرات', icon: '📷' },
      { id: 'lenses', nameAr: 'العدسات', icon: '🔍' },
      { id: 'lighting', nameAr: 'الإضاءة', icon: '💡' },
      { id: 'audio', nameAr: 'الصوتيات', icon: '🎤' },
      { id: 'accessories', nameAr: 'الإكسسوارات', icon: '🛠️' },
      { id: 'specialSetups', nameAr: 'التجهيزات الخاصة', icon: '⚙️' }
    ];

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--text)] mb-2">المعدات والأدوات</h2>
          <p className="text-[var(--muted)]">Equipment Inventory مفصل</p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-800 mb-2">
            <Settings size={20} />
            <span className="font-medium">نموذج مطور</span>
          </div>
          <p className="text-sm text-blue-700">
            هذا النموذج المطور يستخدم كتالوج المعدات الجديد. يمكنك إضافة معدات مفصلة لكل فئة.
          </p>
        </div>

        <div className="space-y-6">
          {equipmentCategories.map(category => {
            const categoryEquipment = formData.equipment[category.id as keyof typeof formData.equipment] as EquipmentItem[];
            
            return (
              <div key={category.id} className="border border-[var(--border)] rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[var(--text)] flex items-center gap-2">
                    <span>{category.icon}</span>
                    {category.nameAr}
                    {categoryEquipment?.length > 0 && (
                      <span className="text-sm bg-[var(--accent-100)] text-[var(--accent-700)] px-2 py-1 rounded">
                        {categoryEquipment.length}
                      </span>
                    )}
                  </h3>
                  <button
                    onClick={() => {
                      // إضافة عنصر فارغ جديد
                      const newItem: EquipmentItem = {
                        name: '',
                        model: '',
                        quantity: 1,
                        condition: 'excellent',
                        notes: ''
                      };
                      setFormData(prev => ({
                        ...prev,
                        equipment: {
                          ...prev.equipment,
                          [category.id]: [...(categoryEquipment || []), newItem]
                        }
                      }));
                    }}
                    className="px-3 py-1 bg-[var(--accent-500)] text-white text-sm rounded hover:bg-[var(--accent-600)]"
                  >
                    + إضافة
                  </button>
                </div>

                {categoryEquipment && categoryEquipment.length > 0 ? (
                  <div className="space-y-3">
                    {categoryEquipment.map((item, index) => (
                      <div key={index} className="grid md:grid-cols-6 gap-3 p-3 bg-[var(--bg)] rounded border">
                        <div>
                          <label className="block text-xs text-[var(--muted)] mb-1">النوع/الاسم</label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => {
                              const updated = [...categoryEquipment];
                              updated[index] = { ...updated[index], name: e.target.value };
                              setFormData(prev => ({
                                ...prev,
                                equipment: { ...prev.equipment, [category.id]: updated }
                              }));
                            }}
                            placeholder="Canon, Sony..."
                            className="w-full px-2 py-1 text-sm border border-[var(--border)] rounded text-[var(--text)]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-[var(--muted)] mb-1">الموديل</label>
                          <input
                            type="text"
                            value={item.model || ''}
                            onChange={(e) => {
                              const updated = [...categoryEquipment];
                              updated[index] = { ...updated[index], model: e.target.value };
                              setFormData(prev => ({
                                ...prev,
                                equipment: { ...prev.equipment, [category.id]: updated }
                              }));
                            }}
                            placeholder="5D Mark IV..."
                            className="w-full px-2 py-1 text-sm border border-[var(--border)] rounded text-[var(--text)]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-[var(--muted)] mb-1">العدد</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const updated = [...categoryEquipment];
                              updated[index] = { ...updated[index], quantity: parseInt(e.target.value) || 1 };
                              setFormData(prev => ({
                                ...prev,
                                equipment: { ...prev.equipment, [category.id]: updated }
                              }));
                            }}
                            className="w-full px-2 py-1 text-sm border border-[var(--border)] rounded text-[var(--text)]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-[var(--muted)] mb-1">الحالة</label>
                          <select
                            value={item.condition}
                            onChange={(e) => {
                              const updated = [...categoryEquipment];
                              updated[index] = { ...updated[index], condition: e.target.value as EquipmentItem['condition'] };
                              setFormData(prev => ({
                                ...prev,
                                equipment: { ...prev.equipment, [category.id]: updated }
                              }));
                            }}
                            className="w-full px-2 py-1 text-sm border border-[var(--border)] rounded text-[var(--text)]"
                          >
                            <option value="excellent">ممتاز</option>
                            <option value="good">جيد</option>
                            <option value="fair">مقبول</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs text-[var(--muted)] mb-1">ملاحظات</label>
                          <input
                            type="text"
                            value={item.notes || ''}
                            onChange={(e) => {
                              const updated = [...categoryEquipment];
                              updated[index] = { ...updated[index], notes: e.target.value };
                              setFormData(prev => ({
                                ...prev,
                                equipment: { ...prev.equipment, [category.id]: updated }
                              }));
                            }}
                            placeholder="اختياري"
                            className="w-full px-2 py-1 text-sm border border-[var(--border)] rounded text-[var(--text)]"
                          />
                        </div>

                        <div className="flex items-end">
                          <button
                            onClick={() => {
                              const updated = categoryEquipment.filter((_, i) => i !== index);
                              setFormData(prev => ({
                                ...prev,
                                equipment: { ...prev.equipment, [category.id]: updated }
                              }));
                            }}
                            className="px-2 py-1 text-red-500 hover:text-red-700 text-sm"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-[var(--muted)] py-8">
                    لا توجد معدات في هذه الفئة
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* تحذير إذا لم تكن هناك معدات كافية */}
        {(() => {
          const totalEquipment = Object.values(formData.equipment).flat().length;
          if (totalEquipment === 0) {
            return (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-800 mb-2">
                  <AlertCircle size={20} />
                  <span className="font-medium">لا توجد معدات</span>
                </div>
                <p className="text-sm text-yellow-700">
                  يُنصح بإضافة المعدات الأساسية التي تملكها لتحسين فرص الحصول على مشاريع مناسبة.
                </p>
              </div>
            );
          }
          return null;
        })()}
      </div>
    );
  };

  const renderCapacityStep = () => {
    const daysOfWeek = [
      { id: 'sunday', nameAr: 'الأحد' },
      { id: 'monday', nameAr: 'الإثنين' },
      { id: 'tuesday', nameAr: 'الثلاثاء' },
      { id: 'wednesday', nameAr: 'الأربعاء' },
      { id: 'thursday', nameAr: 'الخميس' },
      { id: 'friday', nameAr: 'الجمعة' },
      { id: 'saturday', nameAr: 'السبت' }
    ];

    const addTimeRange = (dayId: string) => {
      const newRange = { start: '09:00', end: '17:00' };
      const dayAvailability = formData.capacity.weeklyAvailability.find(d => d.day === dayId);
      
      if (dayAvailability) {
        // تحديث اليوم الموجود
        setFormData(prev => ({
          ...prev,
          capacity: {
            ...prev.capacity,
            weeklyAvailability: prev.capacity.weeklyAvailability.map(d =>
              d.day === dayId 
                ? { ...d, timeRanges: [...d.timeRanges, newRange] }
                : d
            )
          }
        }));
      } else {
        // إضافة يوم جديد
        setFormData(prev => ({
          ...prev,
          capacity: {
            ...prev.capacity,
            weeklyAvailability: [...prev.capacity.weeklyAvailability, {
              day: dayId as WeeklyAvailability['day'],
              timeRanges: [newRange]
            }]
          }
        }));
      }
    };

    const removeTimeRange = (dayId: string, rangeIndex: number) => {
      setFormData(prev => ({
        ...prev,
        capacity: {
          ...prev.capacity,
          weeklyAvailability: prev.capacity.weeklyAvailability.map(d =>
            d.day === dayId
              ? { ...d, timeRanges: d.timeRanges.filter((_, i) => i !== rangeIndex) }
              : d
          ).filter(d => d.timeRanges.length > 0) // إزالة الأيام الفارغة
        }
      }));
    };

    const updateTimeRange = (dayId: string, rangeIndex: number, field: 'start' | 'end', value: string) => {
      setFormData(prev => ({
        ...prev,
        capacity: {
          ...prev.capacity,
          weeklyAvailability: prev.capacity.weeklyAvailability.map(d =>
            d.day === dayId
              ? {
                  ...d,
                  timeRanges: d.timeRanges.map((range, i) =>
                    i === rangeIndex ? { ...range, [field]: value } : range
                  )
                }
              : d
          )
        }
      }));
    };

    const copyToAllDays = (sourceDay: string) => {
      const sourceAvailability = formData.capacity.weeklyAvailability.find(d => d.day === sourceDay);
      if (!sourceAvailability || sourceAvailability.timeRanges.length === 0) return;

      const newWeeklyAvailability: WeeklyAvailability[] = daysOfWeek.map(day => ({
        day: day.id as WeeklyAvailability['day'],
        timeRanges: [...sourceAvailability.timeRanges]
      }));

      setFormData(prev => ({
        ...prev,
        capacity: {
          ...prev.capacity,
          weeklyAvailability: newWeeklyAvailability
        }
      }));
    };

    const clearDay = (dayId: string) => {
      setFormData(prev => ({
        ...prev,
        capacity: {
          ...prev.capacity,
          weeklyAvailability: prev.capacity.weeklyAvailability.filter(d => d.day !== dayId)
        }
      }));
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--text)] mb-2">السعة والزمن</h2>
          <p className="text-[var(--muted)]">Capacity & Time Management</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">
              أقصى عدد أصول/اليوم *
            </label>
            <input
              type="number"
              value={formData.capacity.maxAssetsPerDay}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                capacity: { ...prev.capacity, maxAssetsPerDay: parseInt(e.target.value) || 10 }
              }))}
              className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
              min="1"
              max="100"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">
                SLA عادي (بالساعات) *
              </label>
              <input
                type="number"
                value={formData.capacity.standardSLA}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  capacity: { ...prev.capacity, standardSLA: parseInt(e.target.value) || 48 }
                }))}
                className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                min="1"
                max="168"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">
                SLA سريع (بالساعات) *
              </label>
              <input
                type="number"
                value={formData.capacity.rushSLA}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  capacity: { ...prev.capacity, rushSLA: parseInt(e.target.value) || 24 }
                }))}
                className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                min="1"
                max="72"
              />
            </div>
          </div>

          {/* جدول التوافق الأسبوعي */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-4">
              التوافق الأسبوعي (من/إلى لكل يوم)
            </label>
            
            <div className="space-y-4">
              {daysOfWeek.map(day => {
                const dayAvailability = formData.capacity.weeklyAvailability.find(d => d.day === day.id);
                
                return (
                  <div key={day.id} className="border border-[var(--border)] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-[var(--text)]">{day.nameAr}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => addTimeRange(day.id)}
                          className="px-3 py-1 bg-[var(--accent-500)] text-white text-sm rounded hover:bg-[var(--accent-600)]"
                        >
                          + إضافة فترة
                        </button>
                        {dayAvailability && (
                          <>
                            <button
                              onClick={() => copyToAllDays(day.id)}
                              className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                            >
                              نسخ لجميع الأيام
                            </button>
                            <button
                              onClick={() => clearDay(day.id)}
                              className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                            >
                              مسح
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {dayAvailability && dayAvailability.timeRanges.length > 0 ? (
                      <div className="space-y-2">
                        {dayAvailability.timeRanges.map((range, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <label className="text-sm text-[var(--muted)]">من:</label>
                              <input
                                type="time"
                                value={range.start}
                                onChange={(e) => updateTimeRange(day.id, index, 'start', e.target.value)}
                                className="px-2 py-1 border border-[var(--border)] rounded text-[var(--text)]"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-sm text-[var(--muted)]">إلى:</label>
                              <input
                                type="time"
                                value={range.end}
                                onChange={(e) => updateTimeRange(day.id, index, 'end', e.target.value)}
                                className="px-2 py-1 border border-[var(--border)] rounded text-[var(--text)]"
                              />
                            </div>
                            <button
                              onClick={() => removeTimeRange(day.id, index)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              إزالة
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-[var(--muted)] py-4">
                        غير متاح في هذا اليوم
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderComplianceStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[var(--text)] mb-2">الامتثال والموافقات</h2>
        <p className="text-[var(--muted)]">Compliance والالتزامات المطلوبة</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="clinicsTraining"
            checked={formData.compliance.clinicsTraining}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              compliance: { ...prev.compliance, clinicsTraining: e.target.checked }
            }))}
            className="w-5 h-5 text-[var(--accent-500)] bg-[var(--bg)] border-[var(--border)] rounded focus:ring-[var(--accent-500)] mt-1"
          />
          <div>
            <label htmlFor="clinicsTraining" className="text-sm font-medium text-[var(--text)]">
              تدريب العيادات والتجميل
            </label>
            <p className="text-xs text-[var(--muted)] mt-1">
              التزام بسياسات المنصات للمحتوى الطبي والتجميلي
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="ndaSigned"
            checked={formData.compliance.ndaSigned}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              compliance: { ...prev.compliance, ndaSigned: e.target.checked }
            }))}
            className="w-5 h-5 text-[var(--accent-500)] bg-[var(--bg)] border-[var(--border)] rounded focus:ring-[var(--accent-500)] mt-1"
          />
          <div>
            <label htmlFor="ndaSigned" className="text-sm font-medium text-[var(--text)]">
              توقيع اتفاقية السرية (NDA)
            </label>
            <p className="text-xs text-[var(--muted)] mt-1">
              الالتزام بسرية معلومات العملاء والمشاريع
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="equipmentAgreement"
            checked={formData.compliance.equipmentAgreement}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              compliance: { ...prev.compliance, equipmentAgreement: e.target.checked }
            }))}
            className="w-5 h-5 text-[var(--accent-500)] bg-[var(--bg)] border-[var(--border)] rounded focus:ring-[var(--accent-500)] mt-1"
          />
          <div>
            <label htmlFor="equipmentAgreement" className="text-sm font-medium text-[var(--text)]">
              اتفاقية استخدام المعدات
            </label>
            <p className="text-xs text-[var(--muted)] mt-1">
              الالتزام بصيانة وحماية المعدات المستعارة
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInternalCostStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[var(--text)] mb-2">الكلفة الداخلية</h2>
        <p className="text-[var(--muted)]">Internal Cost Baseline</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">
            سعر الصورة الواحدة (د.ع)
          </label>
          <input
            type="number"
            value={formData.internalCost.photoPerAsset || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              internalCost: { ...prev.internalCost, photoPerAsset: parseInt(e.target.value) || undefined }
            }))}
            className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
            placeholder="25000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">
            سعر الريل الواحد (د.ع)
          </label>
          <input
            type="number"
            value={formData.internalCost.reelPerAsset || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              internalCost: { ...prev.internalCost, reelPerAsset: parseInt(e.target.value) || undefined }
            }))}
            className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
            placeholder="150000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">
            سعر اليوم الكامل (د.ع)
          </label>
          <input
            type="number"
            value={formData.internalCost.dayRate || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              internalCost: { ...prev.internalCost, dayRate: parseInt(e.target.value) || undefined }
            }))}
            className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
            placeholder="300000"
          />
        </div>
      </div>
    </div>
  );

  const renderRateOverridesStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[var(--text)] mb-2">التسعير الفردي</h2>
        <p className="text-[var(--muted)]">Rate Overrides Draft - طلبات أسعار خاصة</p>
      </div>
      
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-purple-800">
          <TrendingUp size={20} />
          <span className="font-medium">قيد التطوير</span>
        </div>
        <p className="text-sm text-purple-700 mt-1">
          سيتم إضافة نظام متقدم لطلب أسعار خاصة لكل Deliverable + Vertical
        </p>
      </div>
    </div>
  );

  const renderSelfAssessmentStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[var(--text)] mb-2">الجودة والانضباط</h2>
        <p className="text-[var(--muted)]">Self-Assessment - تقييم ذاتي للأداء</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">
            نسبة التسليم في الوقت المحدد (%) - آخر 90 يوم
          </label>
          <input
            type="number"
            value={formData.selfAssessment.onTimePercentage}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              selfAssessment: { ...prev.selfAssessment, onTimePercentage: parseInt(e.target.value) || 95 }
            }))}
            className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
            min="0"
            max="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">
            نسبة القبول من أول نسخة (%)
          </label>
          <input
            type="number"
            value={formData.selfAssessment.firstPassPercentage}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              selfAssessment: { ...prev.selfAssessment, firstPassPercentage: parseInt(e.target.value) || 90 }
            }))}
            className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
            min="0"
            max="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">
            ملاحظات إضافية (اختياري)
          </label>
          <textarea
            value={formData.selfAssessment.notes || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              selfAssessment: { ...prev.selfAssessment, notes: e.target.value }
            }))}
            className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
            rows={3}
            placeholder="أي ملاحظات حول الأداء أو التحديات..."
          />
        </div>
      </div>
    </div>
  );

  const renderPortfolioStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[var(--text)] mb-2">المرفقات والمعرض</h2>
        <p className="text-[var(--muted)]">Portfolio والشهادات</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">
            روابط المعرض
          </label>
          <textarea
            value={formData.portfolio.portfolioLinks.join('\n')}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              portfolio: { ...prev.portfolio, portfolioLinks: e.target.value.split('\n').filter(Boolean) }
            }))}
            className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
            rows={4}
            placeholder="ضع كل رابط في سطر منفصل&#10;https://instagram.com/username&#10;https://behance.net/username&#10;https://portfolio-website.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">
            روابط الشهادات (اختياري)
          </label>
          <textarea
            value={formData.portfolio.certificates.join('\n')}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              portfolio: { ...prev.portfolio, certificates: e.target.value.split('\n').filter(Boolean) }
            }))}
            className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
            rows={3}
            placeholder="روابط الشهادات والاعتمادات..."
          />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-500)] mx-auto mb-4"></div>
          <p className="text-[var(--muted)]">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[var(--text)] mb-2">تم الإرسال بنجاح!</h2>
          <p className="text-[var(--muted)]">جاري توجيهك للوحة التحكم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-[var(--text)]">نموذج المبدع الكامل</h1>
              <div className="text-sm text-[var(--muted)]">
                الخطوة {currentStep} من {STEPS.length}
              </div>
            </div>
            
            {/* Welcome Message */}
            {isWelcome && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <CheckCircle size={20} className="text-green-600 inline mr-2" />
                <span className="text-green-800">🎉 مرحباً بك! تم إنشاء حسابك بنجاح.</span>
              </div>
            )}
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <AlertCircle size={20} className="text-red-600 inline mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
            )}
            
            <div className="w-full bg-[var(--border)] rounded-full h-2">
              <div 
                className="bg-[var(--accent-500)] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between mt-2 text-xs text-[var(--muted)]">
              {STEPS.map((step, index) => (
                <div 
                  key={step.id}
                  className={`text-center ${currentStep >= step.id ? 'text-[var(--accent-500)]' : ''}`}
                  style={{ flex: `1 1 ${100 / STEPS.length}%` }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                    currentStep >= step.id 
                      ? 'bg-[var(--accent-500)] text-white' 
                      : 'bg-[var(--border)] text-[var(--muted)]'
                  }`}>
                    {currentStep > step.id ? <CheckCircle size={16} /> : (index + 1)}
                  </div>
                  <div className="hidden md:block">{step.title}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle size={20} />
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Current Step Content */}
          <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-8 mb-8">
            {renderCurrentStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              السابق
            </Button>

            {currentStep === STEPS.length ? (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    إرسال النموذج
                    <CheckCircle size={20} />
                  </>
                )}
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={nextStep}
                className="flex items-center gap-2"
              >
                التالي
                <ArrowRight size={20} />
              </Button>
            )}
          </div>
        </div>
      </div>
  );
}
