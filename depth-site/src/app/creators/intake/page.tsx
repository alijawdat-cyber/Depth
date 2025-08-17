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

import { CreatorEquipmentItem, EquipmentCatalogItem, EquipmentPresetKit } from '@/types/creators';

interface IntakeFormData {
  // معلومات إضافية
  bio: string;
  experience: string;
  equipment: CreatorEquipmentItem[]; // محدث: مرتبط بالكتالوج
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

  const updateFormData = (field: keyof IntakeFormData, value: string | number | string[] | CreatorEquipmentItem[]) => {
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

  // وظائف إدارة المعدات الجديدة
  const addEquipmentItem = (catalogId: string) => {
    const catalogItem = equipmentCatalog.find(item => item.id === catalogId);
    if (!catalogItem) return;

    // تحقق من عدم الإضافة المكررة
    const exists = formData.equipment.find(item => item.catalogId === catalogId);
    if (exists) return;

    const newItem: CreatorEquipmentItem = {
      catalogId,
      owned: true,
      condition: 'excellent',
      quantity: 1,
      notes: ''
    };

    updateFormData('equipment', [...formData.equipment, newItem]);
  };

  const removeEquipmentItem = (catalogId: string) => {
    updateFormData('equipment', formData.equipment.filter(item => item.catalogId !== catalogId));
  };

  const updateEquipmentItem = (catalogId: string, updates: Partial<CreatorEquipmentItem>) => {
    const updatedEquipment = formData.equipment.map(item =>
      item.catalogId === catalogId ? { ...item, ...updates } : item
    );
    updateFormData('equipment', updatedEquipment);
  };

  const loadPresetKit = (presetId: string) => {
    const preset = equipmentPresets.find(p => p.id === presetId);
    if (!preset) return;

    const newItems: CreatorEquipmentItem[] = preset.items
      .filter(catalogId => !formData.equipment.find(item => item.catalogId === catalogId))
      .map(catalogId => ({
        catalogId,
        owned: true,
        condition: 'excellent' as const,
        quantity: 1,
        notes: `من ${preset.nameAr}`
      }));

    updateFormData('equipment', [...formData.equipment, ...newItems]);
  };

  // تصفية المعدات حسب الفئة
  const getFilteredEquipment = () => {
    if (!selectedCategory) return equipmentCatalog;
    return equipmentCatalog.filter(item => item.category === selectedCategory);
  };

  // التحقق من متطلبات المعدات
  const checkEquipmentRequirements = () => {
    // الحصول على دور المبدع (من session أو تخمين)
    const creatorRole = session?.user.role || 'photographer'; // افتراضي
    
    // متطلبات أساسية
    const requirements = {
      photographer: {
        camera: 1,
        lens: 1
      },
      videographer: {
        camera: 1,
        audio: 1
      },
      designer: {},
      producer: {}
    };

    const currentCounts = formData.equipment.reduce((counts, item) => {
      const catalogItem = equipmentCatalog.find(eq => eq.id === item.catalogId);
      if (catalogItem) {
        counts[catalogItem.category] = (counts[catalogItem.category] || 0) + item.quantity;
      }
      return counts;
    }, {} as Record<string, number>);

    const roleRequirements = requirements[creatorRole as keyof typeof requirements] || {};
    const missingRequirements: string[] = [];

    Object.entries(roleRequirements).forEach(([category, required]) => {
      const current = currentCounts[category] || 0;
      const requiredCount = typeof required === 'number' ? required : 0;
      if (current < requiredCount) {
        missingRequirements.push(`${category}: ${requiredCount - current} مطلوب`);
      }
    });

    return missingRequirements;
  };

  // مصادر اختيار ثابتة محسّنة (سيتم استخدامها لاحقاً)
  // const LANGUAGE_OPTIONS = ['ar', 'en', 'fr', 'tr', 'ku'];

  // جلب فئات فرعية (skills) + معدات (equipment) من الكتالوج الحقيقي
  const [skillsOptions, setSkillsOptions] = useState<Array<{ id: string; nameAr: string }>>([]);
  const [equipmentCatalog, setEquipmentCatalog] = useState<EquipmentCatalogItem[]>([]);
  const [equipmentPresets, setEquipmentPresets] = useState<EquipmentPresetKit[]>([]);
  // Loading states سيتم استخدامها لاحقاً
  // const [equipmentLoading, setEquipmentLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [subsRes, eqRes] = await Promise.all([
        fetch('/api/catalog/subcategories?includeDefaults=true'),
        fetch('/api/catalog/equipment?includePresets=true&limit=100'),
      ]);
      
              if (subsRes.ok) {
          const data = await subsRes.json();
          setSkillsOptions((data.items || []).map((i: { id: string; nameAr: string }) => ({ id: i.id, nameAr: i.nameAr })));
        }
      
      if (eqRes.ok) {
        const data = await eqRes.json();
        setEquipmentCatalog(data.items || []);
        setEquipmentPresets(data.presets || []);
      }
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

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
            
            {/* المجموعات الجاهزة */}
            {equipmentPresets.length > 0 && (
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4">
                <h3 className="font-semibold text-[var(--text)] mb-3">مجموعات جاهزة لدورك</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {equipmentPresets
                    .filter(preset => !session?.user.role || preset.targetRole === session.user.role)
                    .map(preset => (
                      <button
                        key={preset.id}
                        onClick={() => loadPresetKit(preset.id)}
                        className="p-3 text-left border border-[var(--border)] rounded-lg hover:bg-[var(--accent-50)] transition-colors"
                      >
                        <div className="font-medium text-[var(--text)]">{preset.nameAr}</div>
                        <div className="text-sm text-[var(--muted)] mt-1">
                          {preset.capabilities.slice(0, 3).join(', ')}
                          {preset.capabilities.length > 3 && '...'}
                        </div>
                        <div className="text-xs text-[var(--accent-600)] mt-2">
                          {preset.items.length} قطعة
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* فلترة بالفئة */}
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">فلترة حسب الفئة</label>
              <Dropdown
                value={selectedCategory}
                onChange={(v) => setSelectedCategory(String(v))}
                options={[
                  { value: '', label: 'جميع الفئات' },
                  { value: 'camera', label: '📷 كاميرات' },
                  { value: 'lens', label: '🔍 عدسات' },
                  { value: 'lighting', label: '💡 إضاءة' },
                  { value: 'audio', label: '🎤 صوتيات' },
                  { value: 'accessory', label: '🛠️ إكسسوارات' },
                  { value: 'special_setup', label: '⚙️ تجهيزات خاصة' }
                ]}
                placeholder="اختر فئة"
              />
            </div>

            {/* اختيار المعدات */}
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">إضافة معدات من الكتالوج</label>
              <div className="max-h-64 overflow-y-auto border border-[var(--border)] rounded-lg">
                {getFilteredEquipment().map(item => (
                  <div key={item.id} className="p-3 border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--bg-alt)] transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-[var(--text)]">
                          {item.brand} {item.model}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.capabilities.slice(0, 4).map(cap => (
                            <span key={cap} className="px-2 py-0.5 bg-[var(--accent-100)] text-[var(--accent-700)] text-xs rounded">
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => addEquipmentItem(item.id)}
                        disabled={formData.equipment.some(eq => eq.catalogId === item.id)}
                        className="px-3 py-1 bg-[var(--accent-500)] text-white text-sm rounded hover:bg-[var(--accent-600)] disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {formData.equipment.some(eq => eq.catalogId === item.id) ? 'مضاف' : 'إضافة'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* المعدات المختارة */}
            {formData.equipment.length > 0 && (
              <div>
                <h3 className="font-semibold text-[var(--text)] mb-3">المعدات المختارة ({formData.equipment.length})</h3>
                <div className="space-y-3">
                  {formData.equipment.map(item => {
                    const catalogItem = equipmentCatalog.find(eq => eq.id === item.catalogId);
                    if (!catalogItem) return null;
                    
                    return (
                      <div key={item.catalogId} className="p-3 border border-[var(--border)] rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-medium text-[var(--text)]">
                              {catalogItem.brand} {catalogItem.model}
                            </div>
                            <div className="text-sm text-[var(--muted)]">{catalogItem.category}</div>
                          </div>
                          <button
                            onClick={() => removeEquipmentItem(item.catalogId)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            إزالة
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <label className="block text-[var(--muted)] mb-1">الكمية</label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateEquipmentItem(item.catalogId, { quantity: parseInt(e.target.value) || 1 })}
                              className="w-full px-2 py-1 border border-[var(--border)] rounded text-[var(--text)]"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-[var(--muted)] mb-1">الحالة</label>
                            <select
                              value={item.condition}
                              onChange={(e) => updateEquipmentItem(item.catalogId, { condition: e.target.value as 'excellent' | 'good' | 'fair' | 'poor' })}
                              className="w-full px-2 py-1 border border-[var(--border)] rounded text-[var(--text)]"
                            >
                              <option value="excellent">ممتاز</option>
                              <option value="good">جيد</option>
                              <option value="fair">مقبول</option>
                              <option value="poor">ضعيف</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-[var(--muted)] mb-1">الملكية</label>
                            <select
                              value={item.owned ? 'owned' : 'borrowed'}
                              onChange={(e) => updateEquipmentItem(item.catalogId, { owned: e.target.value === 'owned' })}
                              className="w-full px-2 py-1 border border-[var(--border)] rounded text-[var(--text)]"
                            >
                              <option value="owned">ملكي</option>
                              <option value="borrowed">مستعار</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-[var(--muted)] mb-1">ملاحظات</label>
                            <input
                              type="text"
                              value={item.notes || ''}
                              onChange={(e) => updateEquipmentItem(item.catalogId, { notes: e.target.value })}
                              placeholder="اختياري"
                              className="w-full px-2 py-1 border border-[var(--border)] rounded text-[var(--text)]"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* تحذيرات المتطلبات */}
            {(() => {
              const missingRequirements = checkEquipmentRequirements();
              if (missingRequirements.length > 0) {
                return (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-yellow-800 mb-2">
                      <AlertCircle size={20} />
                      <span className="font-medium">متطلبات ناقصة</span>
                    </div>
                    <ul className="text-sm text-yellow-700 list-disc list-inside">
                      {missingRequirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                );
              }
              return null;
            })()}
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
