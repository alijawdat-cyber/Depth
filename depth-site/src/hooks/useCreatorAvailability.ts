// Hook لإدارة توفر المبدع مع التزامن الحقيقي
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { WeeklyAvailability } from '@/types/creators';

interface AvailabilityData {
  weeklyAvailability: WeeklyAvailability[];
  timeZone: string;
  urgentWork: boolean;
  lastUpdated?: string;
}

interface UseCreatorAvailabilityOptions {
  creatorId?: string; // للإدارة
  autoSave?: boolean;
  onSave?: (data: AvailabilityData) => Promise<boolean>;
  onError?: (error: string) => void;
}

interface UseCreatorAvailabilityReturn {
  availability: AvailabilityData;
  loading: boolean;
  saving: boolean;
  error: string | null;
  hasUnsavedChanges: boolean;
  
  // Actions
  updateAvailability: (updates: Partial<AvailabilityData>) => void;
  saveChanges: () => Promise<boolean>;
  refreshData: () => Promise<void>;
  resetChanges: () => void;
  
  // Computed values
  totalWeeklyHours: number;
  availableDaysCount: number;
  isValidSchedule: boolean;
}

export function useCreatorAvailability({
  creatorId,
  autoSave = false,
  onSave,
  onError
}: UseCreatorAvailabilityOptions = {}): UseCreatorAvailabilityReturn {
  
  const [availability, setAvailability] = useState<AvailabilityData>({
    weeklyAvailability: [],
    timeZone: 'Asia/Baghdad',
    urgentWork: false
  });
  
  const [originalData, setOriginalData] = useState<AvailabilityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // جلب البيانات من الخادم
  const fetchAvailability = useCallback(async () => {
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
        setOriginalData(data.data);
      } else {
        const errorMsg = data.error || 'فشل في تحميل بيانات التوفر';
        setError(errorMsg);
        onError?.(errorMsg);
      }
    } catch (err) {
      const errorMsg = 'خطأ في الاتصال بالخادم';
      setError(errorMsg);
      onError?.(errorMsg);
      console.error('Error fetching availability:', err);
    } finally {
      setLoading(false);
    }
  }, [creatorId, onError]);

  // تحميل البيانات عند التحميل الأولي
  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  // حفظ التغييرات
  const saveChanges = useCallback(async (): Promise<boolean> => {
    try {
      setSaving(true);
      setError(null);
      
      if (onSave) {
        const success = await onSave(availability);
        if (success) {
          setOriginalData(availability);
          setAvailability(prev => ({
            ...prev,
            lastUpdated: new Date().toISOString()
          }));
        }
        return success;
      } else {
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
          setOriginalData(availability);
          setAvailability(prev => ({
            ...prev,
            lastUpdated: new Date().toISOString()
          }));
          return true;
        } else {
          const errorMsg = data.error || 'فشل في حفظ التغييرات';
          setError(errorMsg);
          onError?.(errorMsg);
          return false;
        }
      }
    } catch (err) {
      const errorMsg = 'خطأ في الاتصال بالخادم';
      setError(errorMsg);
      onError?.(errorMsg);
      console.error('Error saving availability:', err);
      return false;
    } finally {
      setSaving(false);
    }
  }, [availability, creatorId, onSave, onError]);

  // تحديث البيانات
  const updateAvailability = useCallback((updates: Partial<AvailabilityData>) => {
    setAvailability(prev => ({ ...prev, ...updates }));
    
    // حفظ تلقائي إذا مفعل
    if (autoSave) {
      setTimeout(() => saveChanges(), 1000); // تأخير لتجميع التغييرات
    }
  }, [autoSave, saveChanges]);

  // إعادة تحميل البيانات
  const refreshData = useCallback(async () => {
    await fetchAvailability();
  }, [fetchAvailability]);

  // إعادة تعيين التغييرات
  const resetChanges = useCallback(() => {
    if (originalData) {
      setAvailability(originalData);
      setError(null);
    }
  }, [originalData]);

  // حساب القيم المشتقة
  const totalWeeklyHours = availability.weeklyAvailability.reduce((total, dayData) => {
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

  const availableDaysCount = availability.weeklyAvailability.filter(day => day.available).length;
  
  const isValidSchedule = availableDaysCount > 0 && totalWeeklyHours >= 5; // حد أدنى 5 ساعات أسبوعياً

  // التحقق من وجود تغييرات غير محفوظة
  const hasUnsavedChanges = originalData ? 
    JSON.stringify(availability) !== JSON.stringify(originalData) : 
    false;

  return {
    availability,
    loading,
    saving,
    error,
    hasUnsavedChanges,
    
    // Actions
    updateAvailability,
    saveChanges,
    refreshData,
    resetChanges,
    
    // Computed values
    totalWeeklyHours,
    availableDaysCount,
    isValidSchedule
  };
}

// Hook مبسط للاستخدام في الـ onboarding
export function useOnboardingAvailability(
  initialData: WeeklyAvailability[] = []
): {
  availability: WeeklyAvailability[];
  updateAvailability: (data: WeeklyAvailability[]) => void;
  totalHours: number;
  availableDays: number;
} {
  const [availability, setAvailability] = useState<WeeklyAvailability[]>(initialData);

  const totalHours = availability.reduce((total, dayData) => {
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

  const availableDays = availability.filter(day => day.available).length;

  return {
    availability,
    updateAvailability: setAvailability,
    totalHours,
    availableDays
  };
}
