// الخطوة الخامسة: التوفر والجدولة
'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, Zap, CheckCircle, AlertTriangle, Briefcase, Timer, Target, RefreshCw } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { CheckboxField } from '../shared/FormField';
import { StepHeader } from '../OnboardingLayout';
import EnhancedAvailabilityGrid from '../shared/EnhancedAvailabilityGrid';
import type { AvailabilityType } from '@/types/onboarding';

export default function Step5_Availability() {
  const { formData, updateAvailability, getFieldError, getFieldErrorV2 } = useOnboarding();
  // V2 validation is permanently enabled
  const getError = getFieldErrorV2 || getFieldError;
  const { availability } = formData;

  const AVAILABILITY_OPTIONS = [
    {
      value: 'full-time',
      label: 'دوام كامل',
      description: 'متاح يومياً لساعات طويلة',
      hours: '40+ ساعة/أسبوع',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      value: 'part-time',
      label: 'دوام جزئي',
      description: 'متاح عدة أيام في الأسبوع',
      hours: '20-35 ساعة/أسبوع',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      value: 'weekends',
      label: 'نهايات الأسبوع',
      description: 'متاح في الجمعة والسبت فقط',
      hours: '15-20 ساعة/أسبوع',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      value: 'flexible',
      label: 'مرن',
      description: 'حسب المشروع والظروف',
      hours: 'متغير',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  const handleAvailabilityChange = (value: string) => {
    updateAvailability({ availability: value as AvailabilityType });
    
    // تحديث الساعات الأسبوعية حسب نوع التوفر
    const option = AVAILABILITY_OPTIONS.find(opt => opt.value === value);
    if (option) {
      // Weekly hours are now derived automatically - no manual setting needed
      // Unified 30M grid is permanently enabled
      
      // No need to set default workdays with unified grid
      console.log('[Step5] Availability type selected:', value);
    }
  };



  return (
    <div className="space-y-8">
      {/* Header */}
      <StepHeader
        title="التوفر والجدولة"
        subtitle="حدد أوقات عملك المفضلة ومدى توفرك للمشاريع"
        icon={Calendar}
        step={5}
        totalSteps={5}
      />

      <div className="space-y-8 max-w-3xl mx-auto">
        {/* نوع التوفر */}
        <div>
          <h3 className="text-lg font-semibold text-[var(--text)] mb-4">ما هو نوع توفرك للعمل؟</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AVAILABILITY_OPTIONS.map((option, index) => {
              const isSelected = availability.availability === option.value;
              
              return (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    relative cursor-pointer transition-all duration-200 hover:scale-105
                    ${isSelected ? 'ring-2 ring-[var(--accent-500)]' : ''}
                  `}
                  onClick={() => handleAvailabilityChange(option.value)}
                >
                  <div className={`
                    p-6 rounded-2xl border-2 transition-all
                    ${isSelected 
                      ? `${option.borderColor} ${option.bgColor}` 
                      : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent-300)]'
                    }
                  `}>
                    {/* Selection Indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <CheckCircle size={14} className="text-white" />
                      </motion.div>
                    )}

                    <div className="text-center">
                      <div className={`mb-3 flex justify-center ${option.color}`}>
                        {option.value === 'full-time' && <Timer size={28} />}
                        {option.value === 'part-time' && <Briefcase size={28} />}
                        {option.value === 'weekends' && <Target size={28} />}
                        {option.value === 'flexible' && <RefreshCw size={28} />}
                      </div>
                      <h4 className={`font-bold text-lg mb-2 ${isSelected ? option.color : 'text-[var(--text)]'}`}>
                        {option.label}
                      </h4>
                      <p className={`text-sm mb-3 ${isSelected ? option.color : 'text-[var(--muted)]'}`}>
                        {option.description}
                      </p>
                      <div className={`text-xs font-medium ${isSelected ? option.color : 'text-[var(--muted)]'}`}>
                        {option.hours}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {(getError('availability.availability') || getFieldError('التوفر')) && (
            <p className="text-sm text-red-600 mt-2">{getError('availability.availability') || getFieldError('التوفر')}</p>
          )}
        </div>

        {/* الساعات الأسبوعية - مشتقة من Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[var(--text)]">الساعات الأسبوعية (مشتقة)</label>
            <div className="px-4 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--accent-600)] font-semibold">
              {availability.weeklyHours.toFixed(1)} ساعة
            </div>
            <p className="text-xs text-[var(--muted)]">يتم حسابها تلقائياً من الفترات المختارة</p>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[var(--text)]">المنطقة الزمنية</label>
            <div className="px-4 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--accent-600)] font-semibold">
              {availability.timeZone}
            </div>
            <p className="text-xs text-[var(--muted)]">يمكن تعديل المنطقة الزمنية من الخطوة 2</p>
          </div>
        </div>

        {/* جدول التوفر الأسبوعي المحسن */}
        <div>
          <EnhancedAvailabilityGrid
            value={availability.weeklyAvailability || []}
            onChange={(weeklyAvailability) => {
              updateAvailability({ weeklyAvailability });
              // Auto-calculate weekly hours from grid
              const totalAvailableHours = weeklyAvailability
                .filter(day => day.available)
                .reduce((total, day) => {
                  if (day.available && day.startTime && day.endTime) {
                    try {
                      const start = new Date(`2000-01-01T${day.startTime}`);
                      const end = new Date(`2000-01-01T${day.endTime}`);
                      const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                      return total + diffHours;
                    } catch {
                      return total;
                    }
                  }
                  return total;
                }, 0);
              updateAvailability({ weeklyHours: Math.round(totalAvailableHours * 10) / 10 });
            }}
          />
        </div>

        {/* العمل العاجل */}
        <div>
          <CheckboxField
            label="أستطيع قبول المشاريع العاجلة"
            value={availability.urgentWork}
            onChange={(checked) => updateAvailability({ urgentWork: checked })}
            description="المشاريع التي تحتاج تسليم سريع (خلال 24-48 ساعة) مقابل أجر إضافي"
          />
        </div>

        {/* ملخص التوفر */}
  {availability.availability && (availability.weeklyAvailability || []).some(d=>d.available) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--accent-bg)] border border-[var(--accent-border)] rounded-xl p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[var(--accent-500)] rounded-xl flex items-center justify-center flex-shrink-0">
                <Calendar size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-[var(--accent-fg)] mb-3 flex items-center gap-2"><Calendar size={16}/> ملخص توفرك</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm text-[var(--accent-fg)]">
                  <div>
                    <p className="font-medium mb-1">نوع التوفر:</p>
                    <p>{AVAILABILITY_OPTIONS.find(opt => opt.value === availability.availability)?.label}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">الساعات الأسبوعية (مشتقة):</p>
                    <p>{availability.weeklyHours.toFixed(1)} ساعة</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">العمل العاجل:</p>
                    <p>{availability.urgentWork ? 'متاح' : 'غير متاح'}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* نصائح التوفر */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap size={24} className="text-white" />
            </div>
            <div>
              <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2"><Zap size={16}/> نصائح لزيادة فرص العمل</h4>
              <div className="text-sm text-emerald-700">
                <div>
                  <p className="font-medium mb-2 flex items-center gap-2"><CheckCircle size={14}/> توفر أكثر = فرص أكثر:</p>
                  <ul className="space-y-1">
                    <li>• المرونة في الأوقات تزيد الطلب</li>
                    <li>• العمل العاجل له أجر إضافي</li>
                    <li>• التوفر في نهايات الأسبوع مطلوب</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2 flex items-center gap-2"><AlertTriangle size={14}/> كن واقعياً:</p>
                  <ul className="space-y-1">
                    <li>• لا تلتزم بأكثر من طاقتك</li>
                    <li>• يمكن تعديل التوفر لاحقاً</li>
                    <li>• جودة العمل أهم من الكمية</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* تحذير إذا كان التوفر قليل */}
      {availability.weeklyHours < 10 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle size={20} className="text-amber-600" />
              <div className="text-sm text-amber-700">
                <p className="font-medium">توفر محدود</p>
                <p>التوفر أقل من 10 ساعات أسبوعياً قد يقلل من فرص الحصول على مشاريع.</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* تأكيد الإكمال */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="bg-[var(--accent-500)] text-white rounded-xl p-6">
          <CheckCircle size={48} className="mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2 flex items-center justify-center gap-2"><CheckCircle size={20}/> أكملت جميع الخطوات الأساسية!</h3>
          <p className="text-white/90 mb-4">
            أصبح ملفك الشخصي جاهزاً للمراجعة. اضغط &quot;إرسال النموذج&quot; لإرسال طلبك للموافقة.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} />
              <span>معلومات كاملة</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} />
              <span>جاهز للمراجعة</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>مراجعة خلال 24-48 ساعة</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
