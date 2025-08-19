// نظام الإشعارات المركزي - Sonner wrapper
// الغرض: توحيد جميع الإشعارات في المشروع مع تخصيص للعربية

import { toast } from 'sonner';

// تخصيص التصميم للعربية
const defaultOptions = {
  style: {
    fontFamily: 'Dubai, -apple-system, sans-serif',
    direction: 'rtl' as const,
  },
  position: 'top-center' as const,
};

// دوال مبسطة للاستخدام
export const showSuccess = (message: string, description?: string) => {
  return toast.success(message, {
    description,
    ...defaultOptions,
    duration: 4000,
  });
};

export const showError = (message: string, description?: string) => {
  return toast.error(message, {
    description,
    ...defaultOptions,
    duration: 6000,
  });
};

export const showWarning = (message: string, description?: string) => {
  return toast.warning(message, {
    description,
    ...defaultOptions,
    duration: 5000,
  });
};

export const showInfo = (message: string, description?: string) => {
  return toast.info(message, {
    description,
    ...defaultOptions,
    duration: 4000,
  });
};

export const showLoading = (message: string) => {
  return toast.loading(message, {
    ...defaultOptions,
  });
};

// دالة لإغلاق toast محدد
export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId);
};

// دالة لإغلاق جميع الإشعارات
export const dismissAll = () => {
  toast.dismiss();
};

// إعادة تصدير toast الأصلي للاستخدامات المتقدمة
export { toast };
