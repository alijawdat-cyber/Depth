// مكوّن محسن لجدول التوفر الأسبوعي مع UI متطور
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Calendar, 
  Settings, 
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import TimePicker from '@/components/ui/TimePicker';
import { DayToggleGroup } from '@/components/ui/DayToggle';
import type { WeeklyAvailability } from '@/types/creators';
// Phase 2: 30-minute unified grid is permanently enabled

interface EnhancedAvailabilityGridProps {
  value: WeeklyAvailability[];
  onChange: (availability: WeeklyAvailability[]) => void;
  error?: string;
  disabled?: boolean;
}

const DAYS_CONFIG = [
  { id: 'sunday', label: 'الأحد', shortLabel: 'أحد', emoji: '🌞' },
  { id: 'monday', label: 'الإثنين', shortLabel: 'إثنين', emoji: '💼' },
  { id: 'tuesday', label: 'الثلاثاء', shortLabel: 'ثلاثاء', emoji: '📅' },
  { id: 'wednesday', label: 'الأربعاء', shortLabel: 'أربعاء', emoji: '⭐' },
  { id: 'thursday', label: 'الخميس', shortLabel: 'خميس', emoji: '🎯' },
  { id: 'friday', label: 'الجمعة', shortLabel: 'جمعة', emoji: '🕌' },
  { id: 'saturday', label: 'السبت', shortLabel: 'سبت', emoji: '🎉' }
] as const;

const TIME_TEMPLATES = [
  { 
    name: 'دوام صباحي', 
    times: { startTime: '08:00', endTime: '14:00' },
    description: '8 صباحاً - 2 ظهراً'
  },
  { 
    name: 'دوام عادي', 
    times: { startTime: '09:00', endTime: '17:00' },
    description: '9 صباحاً - 5 مساءً'
  },
  { 
    name: 'دوام مسائي', 
    times: { startTime: '14:00', endTime: '22:00' },
    description: '2 ظهراً - 10 مساءً'
  },
  { 
    name: 'دوام مرن', 
    times: { startTime: '10:00', endTime: '18:00' },
    description: '10 صباحاً - 6 مساءً'
  }
];

export default function EnhancedAvailabilityGrid({
  value,
  onChange,
  error,
  disabled = false
}: EnhancedAvailabilityGridProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [showTemplates, setShowTemplates] = useState(false);

  // الحصول على بيانات يوم محدد
  const getDayData = (dayId: string): WeeklyAvailability => {
    return value.find(item => item.day === dayId) || {
      day: dayId as WeeklyAvailability['day'],
      available: false,
      startTime: '09:00',
      endTime: '17:00'
    };
  };

  // تحديث بيانات يوم محدد
  const updateDayData = (dayId: string, updates: Partial<WeeklyAvailability>) => {
    const updatedValue = value.filter(item => item.day !== dayId);
    if (updates.available !== false) {
      const existingData = getDayData(dayId);
      let startTime = updates.startTime ?? existingData.startTime ?? '09:00';
      let endTime = updates.endTime ?? existingData.endTime ?? '17:00';
      
      // 30-minute rounding is permanently enabled
      const roundTo30 = (t: string) => {
        const [h,m] = t.split(':').map(Number);
        const total = h*60 + m;
        const rem = total % 30;
        // nearest 30m: <15 down, >=15 up
        let adjusted = rem < 15 ? total - rem : total + (30 - rem);
        if (adjusted >= 24*60) adjusted = (23*60) + 30; // clamp to 23:30
        const hh = Math.floor(adjusted/60);
        const mm = adjusted % 60;
        return `${hh.toString().padStart(2,'0')}:${mm.toString().padStart(2,'0')}`;
      };
      const origStart = startTime;
      const origEnd = endTime;
      startTime = roundTo30(startTime);
      endTime = roundTo30(endTime);
      // zero-length guard
        if (startTime === endTime) {
          const [sh,sm] = startTime.split(':').map(Number);
          let minutes = sh*60 + sm + 30;
          if (minutes >= 24*60) minutes = (23*60)+30; // clamp
          const hh = Math.floor(minutes/60);
          const mm = minutes % 60;
          endTime = `${hh.toString().padStart(2,'0')}:${mm.toString().padStart(2,'0')}`;
        }
        if (origStart !== startTime || origEnd !== endTime) {
          console.log('[EnhancedAvailabilityGrid] Rounded times', { day: dayId, from: { origStart, origEnd }, to: { startTime, endTime } });
        }
      
      const newDayData: WeeklyAvailability = {
        day: dayId as WeeklyAvailability['day'],
        available: updates.available ?? true,
        startTime,
        endTime
      };
      updatedValue.push(newDayData);
      console.log('[EnhancedAvailabilityGrid] Updated day data:', newDayData);
    }
    onChange(updatedValue);
    console.log('[EnhancedAvailabilityGrid] Full availability data:', updatedValue);
  };

  // تطبيق قالب على الأيام المحددة
  const applyTemplate = (templateName: string, selectedDays: string[]) => {
    const template = TIME_TEMPLATES.find(t => t.name === templateName);
    if (!template || selectedDays.length === 0) return;

    const updatedValue = [...value];
    selectedDays.forEach(dayId => {
      const existingIndex = updatedValue.findIndex(item => item.day === dayId);
      const dayData: WeeklyAvailability = {
        day: dayId as WeeklyAvailability['day'],
        available: true,
        ...template.times
      };

      if (existingIndex > -1) {
        updatedValue[existingIndex] = dayData;
      } else {
        updatedValue.push(dayData);
      }
    });

    onChange(updatedValue);
    setShowTemplates(false);
  };



  // حساب إجمالي ساعات العمل الأسبوعية
  const calculateTotalHours = (): number => {
    return value.reduce((total, day) => {
      if (!day.available) return total;
      
      const start = new Date(`2000-01-01T${day.startTime}`);
      const end = new Date(`2000-01-01T${day.endTime}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      
      return total + Math.max(0, hours);
    }, 0);
  };

  // الحصول على الأيام النشطة
  const getActiveDays = (): string[] => {
    return value.filter(day => day.available).map(day => day.day);
  };

  // تبديل حالة اليوم
  const toggleDayAvailability = (dayIds: string[]) => {
    dayIds.forEach(dayId => {
      const dayData = getDayData(dayId);
      updateDayData(dayId, { available: !dayData.available });
    });
  };

  return (
    <div className="space-y-8">
      {/* Header مع الإحصائيات */}
      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-[var(--text)] flex items-center gap-2">
              <Calendar size={24} />
              جدول التوفر الأسبوعي
            </h3>
            <p className="text-sm text-[var(--muted)] mt-1">
              حدد أوقات عملك بدقة لكل يوم من أيام الأسبوع
            </p>
          </div>
          
          <div className="text-left">
            <div className="text-2xl font-bold text-[var(--accent-500)]">
              {calculateTotalHours().toFixed(1)} ساعة
            </div>
            <div className="text-sm text-[var(--muted)]">إجمالي أسبوعي</div>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[var(--accent-50)] rounded-lg p-3">
            <div className="text-lg font-bold text-[var(--accent-600)]">
              {getActiveDays().length}
            </div>
            <div className="text-xs text-[var(--accent-700)]">أيام العمل</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-lg font-bold text-green-600">
              {(calculateTotalHours() / 7).toFixed(1)}
            </div>
            <div className="text-xs text-green-700">متوسط يومي</div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-lg font-bold text-blue-600">
              {Math.round((getActiveDays().length / 7) * 100)}%
            </div>
            <div className="text-xs text-blue-700">نسبة التوفر</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-lg font-bold text-purple-600">
              {calculateTotalHours() >= 40 ? 'كامل' : calculateTotalHours() >= 20 ? 'جزئي' : 'محدود'}
            </div>
            <div className="text-xs text-purple-700">نوع الدوام</div>
          </div>
        </div>
      </div>

      {/* أدوات سريعة */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setShowTemplates(!showTemplates)}
          disabled={disabled}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-500)] text-white rounded-lg hover:bg-[var(--accent-600)] disabled:opacity-50 transition-all"
        >
          <Settings size={16} />
          قوالب سريعة
        </button>
        
        <button
          type="button"
          onClick={() => onChange([])}
          disabled={disabled}
          className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] text-[var(--text)] rounded-lg hover:bg-[var(--bg-alt)] disabled:opacity-50 transition-all"
        >
          <RotateCcw size={16} />
          مسح الكل
        </button>


      </div>

      {/* قوالب سريعة */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6"
          >
            <h4 className="font-bold text-[var(--text)] mb-4">اختر قالب وطبقه على الأيام:</h4>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* القوالب */}
              <div>
                <h5 className="font-medium text-[var(--text)] mb-3">القوالب المتاحة:</h5>
                <div className="space-y-2">
                  {TIME_TEMPLATES.map((template) => (
                    <button
                      key={template.name}
                      type="button"
                      onClick={() => setSelectedTemplate(template.name)}
                      className={`
                        w-full text-right p-3 rounded-lg border transition-all
                        ${selectedTemplate === template.name
                          ? 'border-[var(--accent-500)] bg-[var(--accent-50)]'
                          : 'border-[var(--border)] hover:border-[var(--accent-300)]'
                        }
                      `}
                    >
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-[var(--muted)]">{template.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* اختيار الأيام */}
              <div>
                <h5 className="font-medium text-[var(--text)] mb-3">طبق على الأيام:</h5>
                <DayToggleGroup
                  days={DAYS_CONFIG.map(day => ({
                    id: day.id,
                    label: day.label,
                    shortLabel: day.shortLabel,
                    emoji: day.emoji
                  }))}
                  selectedDays={[]}
                  onChange={(selectedDays) => {
                    if (selectedTemplate) {
                      applyTemplate(selectedTemplate, selectedDays);
                    }
                  }}
                  size="sm"
                  variant="compact"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* جدول الأيام */}
      <div className="space-y-4">
        {DAYS_CONFIG.map((day, index) => {
          const dayData = getDayData(day.id);
          
          return (
            <motion.div
              key={day.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                bg-[var(--card)] rounded-2xl border-2 transition-all
                ${dayData.available 
                  ? 'border-[var(--accent-500)] shadow-lg shadow-[var(--accent-500)]/10' 
                  : 'border-[var(--border)]'
                }
              `}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-[var(--accent-100)] flex items-center justify-center">
                      <Calendar size={18} className="text-[var(--accent-600)]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--text)]">{day.label}</h4>
                      <p className="text-sm text-[var(--muted)]">
                        {dayData.available 
                          ? `${dayData.startTime} - ${dayData.endTime}`
                          : 'غير متاح'
                        }
                      </p>
                    </div>
                  </div>

                  {/* مفتاح التفعيل */}
                  <button
                    type="button"
                    onClick={() => toggleDayAvailability([day.id])}
                    disabled={disabled}
                    className={`
                      relative w-16 h-8 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)]/50
                      ${dayData.available 
                        ? 'bg-[var(--accent-500)]' 
                        : 'bg-[var(--border)]'
                      }
                    `}
                  >
                    <motion.div
                      animate={{ x: dayData.available ? 32 : 4 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                    />
                  </button>
                </div>                {/* أوقات العمل */}
                {dayData.available && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid md:grid-cols-2 gap-4"
                  >
                    <TimePicker
                      label="وقت البداية"
                      value={dayData.startTime || '09:00'}
                      onChange={(time) => updateDayData(day.id, { startTime: time })}
                      disabled={disabled}
                      step={30}
                    />
                    
                    <TimePicker
                      label="وقت النهاية"
                      value={dayData.endTime || '17:00'}
                      onChange={(time) => updateDayData(day.id, { endTime: time })}
                      disabled={disabled}
                      step={30}
                      minTime={dayData.startTime || '09:00'}
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* رسائل الخطأ */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </motion.div>
      )}

      {/* نصائح */}
      <div className="bg-[var(--accent-50)] border border-[var(--accent-200)] rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[var(--accent-500)] rounded-xl flex items-center justify-center flex-shrink-0">
            <Clock size={24} className="text-white" />
          </div>
          <div>
            <h4 className="font-bold text-[var(--accent-800)] mb-2 flex items-center gap-2"><Clock size={16}/> نصائح لتحسين التوفر</h4>
            <ul className="space-y-1 text-sm text-[var(--accent-700)]">
              <li>• استخدم القوالب السريعة لتوفير الوقت</li>
              <li>• حدد أوقات واقعية تناسب ظروفك</li>
              <li>• يمكنك تعديل الجدول في أي وقت من لوحة التحكم</li>
              <li>• التوفر الأكثر يعني فرص عمل أكثر</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
