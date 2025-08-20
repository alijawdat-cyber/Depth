// طبقة تجميع التوستات لتقليل الضجيج
'use client';

import { showSuccess, showError } from './toast';
import { logger } from './logger';
import { telemetry } from '@/lib/telemetry/client';

// رسائل حرجة لا تُجمّع (تمر فوراً)
const CRITICAL_BYPASS = [
  'فشل في إنشاء الحساب',
  'حدث خطأ في إرسال النموذج', 
  'فشل في إرسال النموذج',
  'تم إرسال طلبك بنجاح ووضعه قيد المراجعة',
  'create-account',
  'final-submit'
];

interface CoalescedGroup {
  type: 'success' | 'error';
  messages: string[];
  timer: ReturnType<typeof setTimeout>;
}

const COALESCE_WINDOW_MS = 1500;
const activeGroups = new Map<string, CoalescedGroup>();

function getGroupKey(type: 'success' | 'error'): string {
  // Simple grouping by type for now
  return type;
}

function isCriticalMessage(message: string): boolean {
  return CRITICAL_BYPASS.some(pattern => 
    message.toLowerCase().includes(pattern.toLowerCase())
  );
}

function flushGroup(key: string) {
  const group = activeGroups.get(key);
  if (!group) return;

  const { type, messages } = group;
  const uniqueMessages = Array.from(new Set(messages));
  
  let finalMessage: string;
  if (uniqueMessages.length === 1) {
    finalMessage = uniqueMessages[0];
  } else {
    finalMessage = `${uniqueMessages[0]} +${uniqueMessages.length - 1}`;
  }

  // Log coalescing activity
  logger.onboardingDebug(`toasts_coalesced:${messages.length}`, { type, finalMessage });

  // Show the coalesced toast
  if (type === 'success') {
    showSuccess(finalMessage);
  } else {
    showError(finalMessage);
  }

  // Phase 7: تتبع التوست المُعروض
  telemetry.toastShown(type, messages.length > 1, messages.length);

  activeGroups.delete(key);
}

export function enqueueSuccess(message: string): void {
  // Toast coalescing is permanently enabled
  if (isCriticalMessage(message)) {
    showSuccess(message);
    // Phase 7: تتبع التوست العادي
    telemetry.toastShown('success', false);
    return;
  }

  const key = getGroupKey('success');
  const existing = activeGroups.get(key);

  if (existing) {
    // Add to existing group
    existing.messages.push(message);
  } else {
    // Create new group
    const timer = setTimeout(() => flushGroup(key), COALESCE_WINDOW_MS);
    activeGroups.set(key, {
      type: 'success',
      messages: [message],
      timer
    });
  }
}

export function enqueueError(message: string): void {
  // Toast coalescing is permanently enabled
  if (isCriticalMessage(message)) {
    showError(message);
    // Phase 7: تتبع التوست العادي
    telemetry.toastShown('error', false);
    return;
  }

  const key = getGroupKey('error');
  const existing = activeGroups.get(key);

  if (existing) {
    // Add to existing group
    existing.messages.push(message);
  } else {
    // Create new group
    const timer = setTimeout(() => flushGroup(key), COALESCE_WINDOW_MS);
    activeGroups.set(key, {
      type: 'error',
      messages: [message],
      timer
    });
  }
}

// Flush all pending groups immediately (useful for testing)
export function flushAllPendingToasts(): void {
  const keys = Array.from(activeGroups.keys());
  keys.forEach(key => flushGroup(key));
}
