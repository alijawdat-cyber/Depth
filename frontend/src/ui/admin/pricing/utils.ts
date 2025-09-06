import { formatDateYMD, formatNumber } from '@/shared/format';

export function formatDate(date?: string | Date) {
  if (!date) return '-';
  try { return formatDateYMD(date); } catch { return String(date); }
}

export function formatEN(n: number | string) {
  return formatNumber(n);
}
