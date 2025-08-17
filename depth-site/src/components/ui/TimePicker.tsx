// مكون Time Picker احترافي ومتجاوب
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface TimePickerProps {
  value: string; // format: "HH:MM"
  onChange: (time: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  format24?: boolean; // true for 24h, false for 12h
  step?: number; // minutes step (5, 10, 15, 30)
  minTime?: string; // minimum selectable time
  maxTime?: string; // maximum selectable time
}

export default function TimePicker({
  value,
  onChange,
  label,
  placeholder = "اختر الوقت",
  disabled = false,
  error,
  required = false,
  format24 = true,
  step = 15,
  minTime,
  maxTime
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState('09');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // تحديث القيم المحلية عند تغيير value
  useEffect(() => {
    if (value) {
      const [hours, minutes] = value.split(':');
      if (format24) {
        setSelectedHour(hours.padStart(2, '0'));
        setSelectedMinute(minutes.padStart(2, '0'));
      } else {
        const hour24 = parseInt(hours);
        const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
        setSelectedHour(hour12.toString().padStart(2, '0'));
        setSelectedMinute(minutes.padStart(2, '0'));
        setPeriod(hour24 >= 12 ? 'PM' : 'AM');
      }
    }
  }, [value, format24]);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // تحديث الوقت
  const updateTime = (hour: string, minute: string, newPeriod?: 'AM' | 'PM') => {
    let finalHour = hour;
    
    if (!format24) {
      const currentPeriod = newPeriod || period;
      const hour12 = parseInt(hour);
      if (currentPeriod === 'PM' && hour12 !== 12) {
        finalHour = (hour12 + 12).toString();
      } else if (currentPeriod === 'AM' && hour12 === 12) {
        finalHour = '00';
      }
    }

    const timeString = `${finalHour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
    
    // التحقق من الحد الأدنى والأقصى
    if (minTime && timeString < minTime) return;
    if (maxTime && timeString > maxTime) return;
    
    onChange(timeString);
  };

  // تنسيق العرض
  const formatDisplayTime = () => {
    if (!value) return placeholder;
    
    const [hours, minutes] = value.split(':');
    if (format24) {
      return `${hours}:${minutes}`;
    } else {
      const hour24 = parseInt(hours);
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
      const period = hour24 >= 12 ? 'مساءً' : 'صباحاً';
      return `${hour12}:${minutes} ${period}`;
    }
  };

  // إنتاج قائمة الساعات
  const generateHours = () => {
    const hours = [];
    const maxHour = format24 ? 23 : 12;
    const minHour = format24 ? 0 : 1;
    
    for (let i = minHour; i <= maxHour; i++) {
      const hourStr = i.toString().padStart(2, '0');
      hours.push(hourStr);
    }
    return hours;
  };

  // إنتاج قائمة الدقائق
  const generateMinutes = () => {
    const minutes = [];
    for (let i = 0; i < 60; i += step) {
      minutes.push(i.toString().padStart(2, '0'));
    }
    return minutes;
  };

  const hours = generateHours();
  const minutes = generateMinutes();

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[var(--text)]">
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}

      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full px-4 py-3 text-right bg-[var(--card)] border rounded-xl 
            transition-all duration-200 flex items-center justify-between
            ${disabled 
              ? 'opacity-50 cursor-not-allowed bg-[var(--bg-alt)]' 
              : 'hover:border-[var(--accent-300)] focus:border-[var(--accent-500)] focus:ring-2 focus:ring-[var(--accent-500)]/20'
            }
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-[var(--border)]'
            }
            ${isOpen ? 'border-[var(--accent-500)] ring-2 ring-[var(--accent-500)]/20' : ''}
          `}
        >
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-[var(--muted)]" />
            <span className={value ? 'text-[var(--text)]' : 'text-[var(--muted)]'}>
              {formatDisplayTime()}
            </span>
          </div>
          <ChevronDown 
            size={18} 
            className={`text-[var(--muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-[var(--border)] rounded-xl shadow-xl z-50 overflow-hidden"
            >
              <div className="flex">
                {/* Hours */}
                <div className="flex-1 border-l border-[var(--border)]">
                  <div className="p-3 bg-[var(--bg-alt)] text-center text-sm font-medium text-[var(--text)]">
                    الساعة
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {hours.map((hour) => (
                      <button
                        key={hour}
                        type="button"
                        onClick={() => {
                          setSelectedHour(hour);
                          updateTime(hour, selectedMinute);
                        }}
                        className={`
                          w-full px-4 py-2 text-center hover:bg-[var(--accent-50)] transition-colors
                          ${selectedHour === hour 
                            ? 'bg-[var(--accent-500)] text-white' 
                            : 'text-[var(--text)]'
                          }
                        `}
                      >
                        {hour}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Minutes */}
                <div className="flex-1 border-l border-[var(--border)]">
                  <div className="p-3 bg-[var(--bg-alt)] text-center text-sm font-medium text-[var(--text)]">
                    الدقيقة
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {minutes.map((minute) => (
                      <button
                        key={minute}
                        type="button"
                        onClick={() => {
                          setSelectedMinute(minute);
                          updateTime(selectedHour, minute);
                        }}
                        className={`
                          w-full px-4 py-2 text-center hover:bg-[var(--accent-50)] transition-colors
                          ${selectedMinute === minute 
                            ? 'bg-[var(--accent-500)] text-white' 
                            : 'text-[var(--text)]'
                          }
                        `}
                      >
                        {minute}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AM/PM for 12h format */}
                {!format24 && (
                  <div className="w-20">
                    <div className="p-3 bg-[var(--bg-alt)] text-center text-sm font-medium text-[var(--text)]">
                      الفترة
                    </div>
                    <div>
                      {['AM', 'PM'].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => {
                            setPeriod(p as 'AM' | 'PM');
                            updateTime(selectedHour, selectedMinute, p as 'AM' | 'PM');
                          }}
                          className={`
                            w-full px-2 py-3 text-center hover:bg-[var(--accent-50)] transition-colors text-sm
                            ${period === p 
                              ? 'bg-[var(--accent-500)] text-white' 
                              : 'text-[var(--text)]'
                            }
                          `}
                        >
                          {p === 'AM' ? 'ص' : 'م'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick presets */}
              <div className="border-t border-[var(--border)] p-3">
                <div className="text-xs font-medium text-[var(--muted)] mb-2">اختصارات سريعة:</div>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { label: 'صباحاً', time: '09:00' },
                    { label: 'ظهراً', time: '12:00' },
                    { label: 'عصراً', time: '15:00' },
                    { label: 'مساءً', time: '18:00' }
                  ].map((preset) => (
                    <button
                      key={preset.time}
                      type="button"
                      onClick={() => {
                        onChange(preset.time);
                        setIsOpen(false);
                      }}
                      className="px-3 py-1 text-xs bg-[var(--accent-50)] text-[var(--accent-600)] rounded-full hover:bg-[var(--accent-100)] transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 flex items-center gap-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
