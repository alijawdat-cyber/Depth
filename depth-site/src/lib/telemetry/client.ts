// 🔇 TELEMETRY PERMANENTLY DISABLED
// All telemetry collection has been permanently disabled per user request
'use client';

// نوع الحدث (للتوافق مع الكود الموجود)
interface TelemetryEvent {
  event: string;
  properties?: Record<string, unknown>;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

interface TrackOptions {
  critical?: boolean;
  immediate?: boolean;
}

// دالة التتبع الرئيسية - PERMANENTLY DISABLED
export function track(
  event: string, 
  properties: Record<string, unknown> = {}, 
  options: TrackOptions = {}
): void {
  // Telemetry permanently disabled - no data collection
  return;
}

// دوال مساعدة - ALL DISABLED
export function stepStarted(step: number): void { return; }
export function stepCompleted(step: number): void { return; }
export function stepView(step: number): void { return; }
export function fieldFocused(field: string): void { return; }
export function fieldCompleted(field: string): void { return; }
export function validationFailed(field: string, error: string): void { return; }
export function formSubmitted(): void { return; }
export function formError(error: string): void { return; }
export function pageView(page: string): void { return; }
export function toastShown(type: string, coalesced: boolean, count?: number): void { return; }
export function userInteraction(action: string, element: string): void { return; }
export function saveRetry(attempt: number): void { return; }
export function saveSuccess(): void { return; }
export function saveError(error: string): void { return; }
export function customLanguageAdded(language: string): void { return; }
export function offlineStart(): void { return; }
export function offlineEnd(): void { return; }
export function validationFail(step: number, field: string, code: string): void { return; }
export function availabilityOverlap(day: string, startTime: string, endTime: string): void { return; }
export function submitSuccess(): void { return; }
export function submitFail(error: string): void { return; }

// حماية الخصوصية - للتوافق مع الكود الموجود
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return 'invalid_email';
  const [local, domain] = email.split('@');
  const maskedLocal = local.length > 2 
    ? local.substring(0, 2) + '*'.repeat(local.length - 2)
    : '**';
  return `${maskedLocal}@${domain}`;
}

export function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return '***';
  return '***' + phone.slice(-4);
}

export function hash(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    const char = value.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// الكائن المُصدّر النهائي
export const telemetry = {
  track,
  stepStarted,
  stepCompleted,
  stepView,
  fieldFocused,
  fieldCompleted,
  validationFailed,
  formSubmitted,
  formError,
  pageView,
  toastShown,
  userInteraction,
  saveRetry,
  saveSuccess,
  saveError,
  customLanguageAdded,
  offlineStart,
  offlineEnd,
  validationFail,
  availabilityOverlap,
  submitSuccess,
  submitFail
};

export default telemetry;
