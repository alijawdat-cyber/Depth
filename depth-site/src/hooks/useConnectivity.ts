// Hook بسيط لمراقبة حالة الاتصال
'use client';

import { useState, useEffect, useCallback } from 'react';
import { telemetry } from '@/lib/telemetry/client';

interface ConnectivityHook {
  isOnline: boolean;
  onReconnect: (callback: () => void) => void;
  addReconnectCallback: (callback: () => void) => void;
}

export function useConnectivity(): ConnectivityHook {
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof window !== 'undefined') {
      return navigator.onLine;
    }
    return true; // Default to online during SSR
  });

  const [reconnectCallbacks, setReconnectCallbacks] = useState<(() => void)[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      console.log('[CONNECTIVITY] Back online');
      setIsOnline(true);
      
      // Phase 7: تتبع عودة الاتصال
      telemetry.offlineEnd();
      
      // Execute reconnect callbacks
      reconnectCallbacks.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.warn('[useConnectivity] Reconnect callback error:', error);
        }
      });
      // Clear callbacks after execution
      setReconnectCallbacks([]);
    };

    const handleOffline = () => {
      console.log('[CONNECTIVITY] Gone offline');
      setIsOnline(false);
      
      // Phase 7: تتبع انقطاع الاتصال
      telemetry.offlineStart();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [reconnectCallbacks]);

  const onReconnect = useCallback((callback: () => void) => {
    setReconnectCallbacks(prev => [...prev, callback]);
  }, []);

  return {
    isOnline,
    onReconnect,
    addReconnectCallback: onReconnect
  };
}
