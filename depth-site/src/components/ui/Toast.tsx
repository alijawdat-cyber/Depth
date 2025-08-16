"use client";

// مكون Toast محسن للرسائل والإشعارات
// الغرض: عرض رسائل تفاعلية مع animations وإغلاق تلقائي

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';
import { clsx } from 'clsx';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
  className?: string;
  showCloseButton?: boolean;
}

const getToastStyles = (type: ToastType) => {
  const styles = {
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: 'text-green-500',
      IconComponent: CheckCircle
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: 'text-red-500',
      IconComponent: XCircle
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: 'text-yellow-500',
      IconComponent: AlertCircle
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: 'text-blue-500',
      IconComponent: Info
    }
  };
  return styles[type];
};

export default function Toast({
  type,
  title,
  message,
  duration = 5000,
  onClose,
  className = '',
  showCloseButton = true
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  const styles = getToastStyles(type);
  const { IconComponent } = styles;

  const handleClose = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  if (!isVisible) return null;

  return (
    <div
      className={clsx(
        'relative p-4 border rounded-lg shadow-sm transition-all duration-300 ease-in-out',
        styles.container,
        isLeaving ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0',
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <IconComponent size={20} className={clsx('flex-shrink-0 mt-0.5', styles.icon)} />
        
        <div className="flex-1 min-w-0">
          {title && (
            <div className="font-medium text-sm mb-1">{title}</div>
          )}
          <div className="text-sm">{message}</div>
        </div>

        {showCloseButton && (
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 hover:bg-black/10 rounded transition-colors"
            aria-label="إغلاق"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

// Hook لإدارة Toast notifications
export function useToast() {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    type: ToastType;
    title?: string;
    message: string;
    duration?: number;
  }>>([]);

  const addToast = (toast: Omit<typeof toasts[0], 'id'>) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message: string, title?: string) => {
    addToast({ type: 'success', message, title });
  };

  const showError = (message: string, title?: string) => {
    addToast({ type: 'error', message, title, duration: 7000 });
  };

  const showWarning = (message: string, title?: string) => {
    addToast({ type: 'warning', message, title });
  };

  const showInfo = (message: string, title?: string) => {
    addToast({ type: 'info', message, title });
  };

  return {
    toasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast
  };
}

// مكون ToastContainer لعرض جميع التوست
interface ToastContainerProps {
  toasts: ReturnType<typeof useToast>['toasts'];
  onRemove: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function ToastContainer({ 
  toasts, 
  onRemove, 
  position = 'top-right' 
}: ToastContainerProps) {
  const positionClasses = {
    'top-right': 'fixed top-4 right-4 z-50',
    'top-left': 'fixed top-4 left-4 z-50',
    'bottom-right': 'fixed bottom-4 right-4 z-50',
    'bottom-left': 'fixed bottom-4 left-4 z-50'
  };

  return (
    <div className={clsx(positionClasses[position], 'space-y-2')}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}
