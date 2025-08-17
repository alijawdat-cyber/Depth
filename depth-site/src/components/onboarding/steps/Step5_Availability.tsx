// الخطوة الخامسة: التوفر والجدولة
'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, Zap, CheckCircle, AlertTriangle, Briefcase, Timer, Target, RefreshCw } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { SelectField, InputField, CheckboxField } from '../shared/FormField';
import { StepHeader } from '../OnboardingLayout';
import EnhancedAvailabilityGrid from '../shared/EnhancedAvailabilityGrid';
import type { AvailabilityType } from '@/types/onboarding';
import { toast } from 'sonner';

export default function Step5_Availability() {
  const { formData, updateAvailability, getFieldError } = useOnboarding();
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

  const WORKDAYS = [
    { id: 'sunday', label: 'الأحد' },
    { id: 'monday', label: 'الإثنين' },
    { id: 'tuesday', label: 'الثلاثاء' },
    { id: 'wednesday', label: 'الأربعاء' },
    { id: 'thursday', label: 'الخميس' },
    { id: 'friday', label: 'الجمعة' },
    { id: 'saturday', label: 'السبت' }
  ];

  const handleAvailabilityChange = (value: string) => {
    updateAvailability({ availability: value as AvailabilityType });
    
    // تحديث الساعات الأسبوعية حسب نوع التوفر
    const option = AVAILABILITY_OPTIONS.find(opt => opt.value === value);
    if (option) {
      const hours = option.value === 'full-time' ? 40 : 
                   option.value === 'part-time' ? 25 : 
                   option.value === 'weekends' ? 16 : 20;
      updateAvailability({ weeklyHours: hours });
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

          {getFieldError('التوفر') && (
            <p className="text-sm text-red-600 mt-2">{getFieldError('التوفر')}</p>
          )}
        </div>

        {/* الساعات الأسبوعية */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <InputField
            label="عدد الساعات الأسبوعية"
            type="number"
            value={availability.weeklyHours.toString()}
            onChange={(value) => updateAvailability({ weeklyHours: parseInt(value) || 0 })}
            placeholder="25"
            icon={<Clock size={18} />}
            required
            error={getFieldError('الساعات')}
            description="كم ساعة يمكنك العمل أسبوعياً؟"
            min="1"
            max="60"
          />

          <SelectField
            label="المنطقة الزمنية"
            value={availability.timeZone}
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

        {/* جدول التوفر الأسبوعي المحسن */}
        <div>
          <EnhancedAvailabilityGrid
            value={availability.weeklyAvailability || []}
            onChange={(weeklyAvailability) => {
              // تحديث البيانات الجديدة
              updateAvailability({ weeklyAvailability });
              
              // تحديث الأيام المفضلة للتوافق مع النظام القديم
              const preferredWorkdays = weeklyAvailability
                .filter(day => day.available)
                .map(day => day.day);
              updateAvailability({ preferredWorkdays });
            }}
            error={getFieldError('التوفر')}
            disabled={false}
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
        {availability.availability && availability.preferredWorkdays.length > 0 && (
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
                    <p className="font-medium mb-1">الساعات الأسبوعية:</p>
                    <p>{availability.weeklyHours} ساعة</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">أيام العمل:</p>
                    <p>{availability.preferredWorkdays.length} أيام في الأسبوع</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">العمل العاجل:</p>
                    <p>{availability.urgentWork ? 'متاح' : 'غير متاح'}</p>
                  </div>
                </div>
                
                {/* أيام العمل المختارة */}
                <div className="mt-4">
                  <p className="font-medium mb-2">الأيام المختارة:</p>
                  <div className="flex flex-wrap gap-2">
                    {availability.preferredWorkdays.map(dayId => {
                      const day = WORKDAYS.find(d => d.id === dayId);
                      return (
                        <span
                          key={dayId}
                          className="px-3 py-1 bg-[var(--accent-100)] text-[var(--accent-700)] rounded-full text-xs font-medium"
                        >
                          {day?.label}
                        </span>
                      );
                    })}
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
