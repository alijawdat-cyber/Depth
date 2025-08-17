// مكوّن جدول التوفر الأسبوعي المفصل مع نطاقات الوقت
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, ToggleLeft, ToggleRight, AlertCircle, Coffee, Save, Loader2 } from 'lucide-react';
import type { WeeklyAvailability } from '@/types/creators';

interface WeeklyAvailabilityGridProps {
  value: WeeklyAvailability[];
  onChange: (availability: WeeklyAvailability[]) => void;
  error?: string;
  disabled?: boolean;
  autoSave?: boolean; // للحفظ التلقائي في لوحة المبدع
  onSave?: (availability: WeeklyAvailability[]) => Promise<boolean>; // دالة حفظ مخصصة
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

const TIME_PRESETS = [
  { label: 'صباحي (8-12)', start: '08:00', end: '12:00' },
  { label: 'ظهري (12-16)', start: '12:00', end: '16:00' },
  { label: 'مسائي (16-20)', start: '16:00', end: '20:00' },
  { label: 'دوام كامل (8-17)', start: '08:00', end: '17:00' },
  { label: 'مرن (9-18)', start: '09:00', end: '18:00' }
];

export default function WeeklyAvailabilityGrid({ 
  value, 
  onChange, 
  error, 
  disabled,
  autoSave = false,
  onSave
}: WeeklyAvailabilityGridProps) {
  const [showBreaks, setShowBreaks] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // الحصول على بيانات يوم محدد
  const getDayData = (dayId: string): WeeklyAvailability => {
    return value.find(item => item.day === dayId) || {
      day: dayId as WeeklyAvailability['day'],
      available: false,
      startTime: '09:00',
      endTime: '17:00'
    };
  };

  // حفظ البيانات في قاعدة البيانات
  const saveToDatabase = async (availability: WeeklyAvailability[]) => {
    if (!autoSave && !onSave) return true;
    
    setSaving(true);
    setSaveError(null);
    
    try {
      if (onSave) {
        const success = await onSave(availability);
        if (success) {
          setLastSaved(new Date());
        }
        return success;
      } else {
        // الحفظ التلقائي للـ API
        const response = await fetch('/api/creators/availability', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            weeklyAvailability: availability,
            timeZone: 'Asia/Baghdad', // يمكن جعلها ديناميكية
            urgentWork: false // يمكن جعلها ديناميكية
          })
        });
        
        if (response.ok) {
          setLastSaved(new Date());
          return true;
        } else {
          const errorData = await response.json();
          setSaveError(errorData.error || 'فشل في الحفظ');
          return false;
        }
      }
    } catch (error) {
      console.error('Error saving availability:', error);
      setSaveError('خطأ في الاتصال بالخادم');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // تحديث بيانات يوم
  const updateDay = async (dayId: string, updates: Partial<WeeklyAvailability>) => {
    const currentData = [...value];
    const existingIndex = currentData.findIndex(item => item.day === dayId);
    
    const baseDayData = getDayData(dayId);
    const dayData = {
      ...baseDayData,
      ...updates,
      day: dayId as WeeklyAvailability['day']
    };
    
    if (existingIndex > -1) {
      currentData[existingIndex] = dayData;
    } else {
      currentData.push(dayData);
    }
    
    onChange(currentData);
    
    // حفظ تلقائي إذا مفعل
    if (autoSave) {
      await saveToDatabase(currentData);
    }
  };

  // تطبيق preset على يوم
  const applyPresetToDay = async (dayId: string, preset: typeof TIME_PRESETS[0]) => {
    await updateDay(dayId, {
      available: true,
      startTime: preset.start,
      endTime: preset.end
    });
  };

  // تطبيق preset على جميع الأيام المتاحة
  const applyPresetToAll = async (preset: typeof TIME_PRESETS[0]) => {
    const updatedData = value.map(dayData => ({
      ...dayData,
      ...(dayData.available ? {
        startTime: preset.start,
        endTime: preset.end
      } : {})
    }));
    onChange(updatedData);
    
    if (autoSave) {
      await saveToDatabase(updatedData);
    }
  };

  // تفعيل/إلغاء جميع الأيام
  const toggleAllDays = async (available: boolean) => {
    const updatedData = DAYS_CONFIG.map(day => ({
      day: day.id as WeeklyAvailability['day'],
      available,
      startTime: '09:00',
      endTime: '17:00'
    }));
    onChange(updatedData);
    
    if (autoSave) {
      await saveToDatabase(updatedData);
    }
  };

  // حفظ يدوي
  const handleManualSave = async () => {
    await saveToDatabase(value);
  };

  // حساب إجمالي الساعات الأسبوعية
  const calculateWeeklyHours = (): number => {
    return value.reduce((total, dayData) => {
      if (!dayData.available || !dayData.startTime || !dayData.endTime) return total;
      
      const start = new Date(`2000-01-01T${dayData.startTime}`);
      const end = new Date(`2000-01-01T${dayData.endTime}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      
      // خصم وقت الاستراحة إذا موجود
      let breakHours = 0;
      if (dayData.breakStart && dayData.breakEnd) {
        const breakStart = new Date(`2000-01-01T${dayData.breakStart}`);
        const breakEnd = new Date(`2000-01-01T${dayData.breakEnd}`);
        breakHours = (breakEnd.getTime() - breakStart.getTime()) / (1000 * 60 * 60);
      }
      
      return total + Math.max(0, hours - breakHours);
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* العنوان والإعدادات */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text)] mb-1">
            جدول التوفر الأسبوعي
          </h3>
          <p className="text-sm text-[var(--muted)]">
            حدد أوقات توفرك بدقة لكل يوم من أيام الأسبوع
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* زر الحفظ اليدوي */}
          {!autoSave && (
            <button
              type="button"
              onClick={handleManualSave}
              disabled={saving || disabled}
              className="flex items-center gap-2 px-3 py-2 bg-[var(--accent-500)] text-white rounded-lg hover:bg-[var(--accent-600)] disabled:opacity-50 transition-all text-sm"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>حفظ</span>
                </>
              )}
            </button>
          )}
          
          <button
            type="button"
            onClick={() => setShowBreaks(!showBreaks)}
            className="flex items-center gap-2 text-sm text-[var(--accent-600)] hover:text-[var(--accent-700)]"
          >
            <Coffee size={16} />
            <span>{showBreaks ? 'إخفاء' : 'إظهار'} الاستراحات</span>
          </button>
        </div>
      </div>

      {/* مؤشر الحفظ التلقائي */}
      {autoSave && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-[var(--muted)]">
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin text-[var(--accent-500)]" />
                <span>جاري الحفظ التلقائي...</span>
              </>
            ) : lastSaved ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>آخر حفظ: {lastSaved.toLocaleTimeString('ar-IQ')}</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span>لم يتم الحفظ بعد</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* خطأ الحفظ */}
      {saveError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className="text-sm text-red-600 flex items-center gap-2">
            <AlertCircle size={16} />
            خطأ في الحفظ: {saveError}
          </p>
        </motion.div>
      )}

      {/* أزرار سريعة */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => toggleAllDays(true)}
          className="px-3 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          تفعيل جميع الأيام
        </button>
        <button
          type="button"
          onClick={() => toggleAllDays(false)}
          className="px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          إلغاء جميع الأيام
        </button>
        
        <div className="border-r border-[var(--border)] mx-2"></div>
        
        {TIME_PRESETS.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => applyPresetToAll(preset)}
            className="px-3 py-2 text-sm border border-[var(--border)] rounded-lg hover:border-[var(--accent-500)] hover:bg-[var(--accent-50)] transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* جدول الأيام */}
      <div className="space-y-3">
        {DAYS_CONFIG.map((day, index) => {
          const dayData = getDayData(day.id);
          
          return (
            <motion.div
              key={day.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                p-4 rounded-xl border-2 transition-all duration-200
                ${dayData.available 
                  ? 'border-[var(--accent-500)] bg-[var(--accent-50)]' 
                  : 'border-[var(--border)] bg-[var(--card)]'
                }
              `}
            >
              {/* رأس اليوم */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{day.emoji}</span>
                  <div>
                    <h4 className="font-semibold text-[var(--text)]">{day.label}</h4>
                    <p className="text-xs text-[var(--muted)]">{day.shortLabel}</p>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => updateDay(day.id, { available: !dayData.available })}
                  disabled={disabled}
                  className="flex items-center gap-2"
                >
                  {dayData.available ? (
                    <ToggleRight size={24} className="text-[var(--accent-500)]" />
                  ) : (
                    <ToggleLeft size={24} className="text-[var(--muted)]" />
                  )}
                </button>
              </div>

              {/* أوقات العمل */}
              {dayData.available && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {/* أوقات البداية والنهاية */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text)] mb-2">
                        وقت البداية
                      </label>
                      <input
                        type="time"
                        value={dayData.startTime || '09:00'}
                        onChange={(e) => updateDay(day.id, { startTime: e.target.value })}
                        disabled={disabled}
                        className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:border-[var(--accent-500)] focus:outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[var(--text)] mb-2">
                        وقت النهاية
                      </label>
                      <input
                        type="time"
                        value={dayData.endTime || '17:00'}
                        onChange={(e) => updateDay(day.id, { endTime: e.target.value })}
                        disabled={disabled}
                        className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:border-[var(--accent-500)] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* أوقات الاستراحة (اختيارية) */}
                  {showBreaks && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border)]"
                    >
                      <div>
                        <label className="block text-sm font-medium text-[var(--text)] mb-2 flex items-center gap-1">
                          <Coffee size={14} />
                          بداية الاستراحة
                        </label>
                        <input
                          type="time"
                          value={dayData.breakStart || ''}
                          onChange={(e) => updateDay(day.id, { breakStart: e.target.value || undefined })}
                          disabled={disabled}
                          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:border-[var(--accent-500)] focus:outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[var(--text)] mb-2">
                          نهاية الاستراحة
                        </label>
                        <input
                          type="time"
                          value={dayData.breakEnd || ''}
                          onChange={(e) => updateDay(day.id, { breakEnd: e.target.value || undefined })}
                          disabled={disabled}
                          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:border-[var(--accent-500)] focus:outline-none"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* presets سريعة لليوم */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="text-xs text-[var(--muted)] self-center">أوقات جاهزة:</span>
                    {TIME_PRESETS.slice(0, 3).map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => applyPresetToDay(day.id, preset)}
                        disabled={disabled}
                        className="px-2 py-1 text-xs border border-[var(--border)] rounded hover:border-[var(--accent-500)] hover:bg-[var(--accent-50)] transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ملخص الساعات */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--accent-bg)] border border-[var(--accent-border)] rounded-xl p-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--accent-500)] rounded-lg flex items-center justify-center">
            <Clock size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-[var(--accent-fg)]">
              إجمالي الساعات الأسبوعية: {calculateWeeklyHours().toFixed(1)} ساعة
            </p>
            <p className="text-sm text-[var(--accent-fg)] opacity-80">
              أيام العمل: {value.filter(d => d.available).length} من 7 أيام
            </p>
          </div>
        </div>
      </motion.div>

      {/* رسالة الخطأ */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className="text-sm text-red-600 flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </p>
        </motion.div>
      )}

      {/* نصائح */}
      {value.filter(d => d.available).length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar size={16} className="text-white" />
            </div>
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">📅 ابدأ بتحديد توفرك</p>
              <ul className="space-y-1">
                <li>• فعّل الأيام التي تستطيع العمل فيها</li>
                <li>• حدد أوقات البداية والنهاية لكل يوم</li>
                <li>• يمكنك إضافة فترات استراحة اختيارية</li>
                <li>• استخدم الأوقات الجاهزة للإعداد السريع</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
