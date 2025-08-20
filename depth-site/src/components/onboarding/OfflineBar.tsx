// شريط الاتصال المفقود مع إعادة المحاولة
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Loader2, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface OfflineBarProps {
  isOffline: boolean;
  hasUnsavedChanges?: boolean;
  onRetryConnection?: () => void;
  retryStatus?: 'idle' | 'retrying' | 'success' | 'failed';
}

export default function OfflineBar({ 
  isOffline, 
  hasUnsavedChanges = false,
  onRetryConnection,
  retryStatus = 'idle' 
}: OfflineBarProps) {
  const handleRetry = () => {
    if (onRetryConnection && retryStatus === 'idle') {
      onRetryConnection();
    }
  };

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-[73px] left-0 right-0 z-40 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
        >
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              {/* حالة الاتصال */}
              <div className="flex items-center gap-3">
                <WifiOff size={20} className="animate-pulse" />
                <div>
                  <div className="font-semibold text-sm">
                    انقطع الاتصال بالإنترنت
                  </div>
                  <div className="text-xs opacity-90">
                    {hasUnsavedChanges 
                      ? 'لديك تغييرات غير محفوظة • سيتم الحفظ عند إعادة الاتصال'
                      : 'تأكد من اتصالك بالإنترنت للمتابعة'
                    }
                  </div>
                </div>
              </div>

              {/* أزرار التحكم */}
              <div className="flex items-center gap-2">
                {/* مؤشر حالة إعادة المحاولة */}
                {retryStatus === 'retrying' && (
                  <div className="flex items-center gap-2 text-xs">
                    <Loader2 size={16} className="animate-spin" />
                    <span>جاري إعادة الاتصال...</span>
                  </div>
                )}
                
                {retryStatus === 'success' && (
                  <div className="flex items-center gap-2 text-xs text-green-200">
                    <CheckCircle size={16} />
                    <span>تم الاتصال بنجاح</span>
                  </div>
                )}
                
                {retryStatus === 'failed' && (
                  <div className="flex items-center gap-2 text-xs text-red-200">
                    <AlertTriangle size={16} />
                    <span>فشل في الاتصال</span>
                  </div>
                )}

                {/* زر إعادة المحاولة */}
                {onRetryConnection && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRetry}
                    disabled={retryStatus === 'retrying'}
                    className="text-white hover:bg-white/20 border-white/30 border"
                  >
                    <RefreshCw 
                      size={14} 
                      className={retryStatus === 'retrying' ? 'animate-spin' : ''} 
                    />
                    إعادة المحاولة
                  </Button>
                )}
              </div>
            </div>

            {/* شريط تقدم الاتصال */}
            {retryStatus === 'retrying' && (
              <div className="mt-2">
                <div className="w-full bg-white/20 rounded-full h-1">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3, ease: 'easeInOut' }}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
