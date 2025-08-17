// مكوّن إدارة التوفر في لوحة المبدع
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Save, RefreshCw, AlertCircle, Settings } from 'lucide-react';
import WeeklyAvailabilityGrid from '@/components/onboarding/shared/WeeklyAvailabilityGrid';
import type { WeeklyAvailability } from '@/types/creators';

interface AvailabilityManagerProps {
  creatorId?: string; // للإدارة
  className?: string;
}

interface AvailabilityData {
  weeklyAvailability: WeeklyAvailability[];
  timeZone: string;
  urgentWork: boolean;
  lastUpdated?: string;
}

export default function AvailabilityManager({ 
  creatorId, 
  className = '' 
}: AvailabilityManagerProps) {
  const [availability, setAvailability] = useState<AvailabilityData>({
    weeklyAvailability: [],
    timeZone: 'Asia/Baghdad',
    urgentWork: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // جلب بيانات التوفر الحالية
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const url = creatorId 
          ? `/api/creators/${creatorId}/availability` 
          : '/api/creators/availability';
          
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
          setAvailability(data.data);
        } else {
          setError(data.error || 'فشل في تحميل بيانات التوفر');
        }
      } catch (err) {
        console.error('Error fetching availability:', err);
        setError('خطأ في الاتصال بالخادم');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [creatorId]);

  // حفظ التغييرات
  const saveChanges = async (): Promise<boolean> => {
    try {
      setSaving(true);
      setError(null);
      
      const url = creatorId 
        ? `/api/creators/${creatorId}/availability` 
        : '/api/creators/availability';
        
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(availability)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setHasUnsavedChanges(false);
        setAvailability(prev => ({
          ...prev,
          lastUpdated: new Date().toISOString()
        }));
        return true;
      } else {
        setError(data.error || 'فشل في حفظ التغييرات');
        return false;
      }
    } catch (err) {
      console.error('Error saving availability:', err);
      setError('خطأ في الاتصال بالخادم');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // تحديث التوفر الأسبوعي
  const handleAvailabilityChange = (weeklyAvailability: WeeklyAvailability[]) => {
    setAvailability(prev => ({ ...prev, weeklyAvailability }));
    setHasUnsavedChanges(true);
  };

  // تحديث الإعدادات العامة
  const handleSettingsChange = (updates: Partial<Pick<AvailabilityData, 'timeZone' | 'urgentWork'>>) => {
    setAvailability(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  // إعادة تحميل البيانات
  const refreshData = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // تأخير بصري
    window.location.reload();
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw size={32} className="animate-spin text-[var(--accent-500)] mx-auto mb-4" />
            <p className="text-[var(--muted)]">جاري تحميل بيانات التوفر...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text)] flex items-center gap-3">
            <Calendar size={28} />
            إدارة التوفر
          </h2>
          <p className="text-[var(--muted)] mt-1">
            حدد أوقات توفرك الأسبوعية وإعداداتك العامة
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* مؤشر التغييرات غير المحفوظة */}
          {hasUnsavedChanges && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg"
            >
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-amber-700">تغييرات غير محفوظة</span>
            </motion.div>
          )}
          
          {/* آخر تحديث */}
          {availability.lastUpdated && (
            <div className="text-sm text-[var(--muted)]">
              آخر تحديث: {new Date(availability.lastUpdated).toLocaleDateString('ar-IQ')}
            </div>
          )}
          
          <button
            type="button"
            onClick={refreshData}
            className="p-2 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            title="إعادة تحميل"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* خطأ عام */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-red-600" />
            <div>
              <p className="font-medium text-red-800">حدث خطأ</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* الإعدادات العامة */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
          <Settings size={20} />
          الإعدادات العامة
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">
              المنطقة الزمنية
            </label>
            <select
              value={availability.timeZone}
              onChange={(e) => handleSettingsChange({ timeZone: e.target.value })}
              disabled={saving}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:border-[var(--accent-500)] focus:outline-none"
            >
              <option value="Asia/Baghdad">بغداد (GMT+3)</option>
              <option value="Asia/Erbil">أربيل (GMT+3)</option>
              <option value="Asia/Kuwait">الكويت (GMT+3)</option>
              <option value="Asia/Riyadh">الرياض (GMT+3)</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={availability.urgentWork}
                onChange={(e) => handleSettingsChange({ urgentWork: e.target.checked })}
                disabled={saving}
                className="w-5 h-5 text-[var(--accent-500)] border-[var(--border)] rounded focus:ring-[var(--accent-500)]"
              />
              <div>
                <span className="font-medium text-[var(--text)]">أقبل المشاريع العاجلة</span>
                <p className="text-sm text-[var(--muted)]">تسليم خلال 24-48 ساعة مقابل أجر إضافي</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* جدول التوفر الأسبوعي */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <WeeklyAvailabilityGrid
          value={availability.weeklyAvailability}
          onChange={handleAvailabilityChange}
          autoSave={false} // نحفظ يدوياً من هنا
          onSave={async () => {
            const success = await saveChanges();
            return success;
          }}
          disabled={saving}
        />
      </div>

      {/* أزرار الحفظ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {hasUnsavedChanges && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-amber-600"
            >
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="text-sm">لديك تغييرات غير محفوظة</span>
            </motion.div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={refreshData}
            disabled={saving}
            className="px-4 py-2 border border-[var(--border)] text-[var(--text)] rounded-lg hover:border-[var(--accent-500)] hover:bg-[var(--accent-50)] disabled:opacity-50 transition-all"
          >
            <RefreshCw size={16} className="inline mr-2" />
            إعادة تحميل
          </button>
          
          <button
            type="button"
            onClick={saveChanges}
            disabled={saving || !hasUnsavedChanges}
            className="px-6 py-2 bg-[var(--accent-500)] text-white rounded-lg hover:bg-[var(--accent-600)] disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {saving ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>حفظ التغييرات</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-[var(--accent-bg)] border border-[var(--accent-border)] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--accent-500)] rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-[var(--accent-fg)] opacity-80">إجمالي الساعات</p>
              <p className="text-xl font-bold text-[var(--accent-fg)]">
                {availability.weeklyAvailability.reduce((total, day) => {
                  if (!day.available || !day.startTime || !day.endTime) return total;
                  const start = new Date(`2000-01-01T${day.startTime}`);
                  const end = new Date(`2000-01-01T${day.endTime}`);
                  return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                }, 0).toFixed(1)} ساعة/أسبوع
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Calendar size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-green-700 opacity-80">أيام العمل</p>
              <p className="text-xl font-bold text-green-800">
                {availability.weeklyAvailability.filter(day => day.available).length} من 7 أيام
              </p>
            </div>
          </div>
        </div>
        
        <div className={`border rounded-xl p-4 ${
          availability.urgentWork 
            ? 'bg-orange-50 border-orange-200' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              availability.urgentWork 
                ? 'bg-orange-500' 
                : 'bg-gray-400'
            }`}>
              <span className="text-white">⚡</span>
            </div>
            <div>
              <p className={`text-sm opacity-80 ${
                availability.urgentWork ? 'text-orange-700' : 'text-gray-600'
              }`}>
                المشاريع العاجلة
              </p>
              <p className={`text-xl font-bold ${
                availability.urgentWork ? 'text-orange-800' : 'text-gray-700'
              }`}>
                {availability.urgentWork ? 'متاح' : 'غير متاح'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* جدول التوفر */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw size={32} className="animate-spin text-[var(--accent-500)]" />
          </div>
        ) : (
          <WeeklyAvailabilityGrid
            value={availability.weeklyAvailability}
            onChange={handleAvailabilityChange}
            autoSave={false} // نحفظ يدوياً من خلال الزر
            disabled={saving}
          />
        )}
      </div>

      {/* تحذير عند المغادرة مع تغييرات غير محفوظة */}
      {hasUnsavedChanges && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 bg-amber-500 text-white px-6 py-4 rounded-xl shadow-lg z-50"
        >
          <div className="flex items-center gap-3">
            <AlertCircle size={20} />
            <div>
              <p className="font-medium">تغييرات غير محفوظة</p>
              <p className="text-sm opacity-90">لا تنس حفظ تغييراتك قبل المغادرة</p>
            </div>
            <button
              onClick={saveChanges}
              disabled={saving}
              className="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors"
            >
              حفظ الآن
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
