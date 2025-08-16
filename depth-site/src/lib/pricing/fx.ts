/**
 * نظام FX Snapshot - لحفظ أسعار الصرف عند الموافقة على العروض
 * يضمن ثبات الأسعار بعد الموافقة حتى لو تغير سعر الصرف
 */

export interface FXSnapshot {
  rate: number; // سعر الصرف IQD/USD
  date: string; // تاريخ التثبيت ISO
  source: string; // مصدر السعر (admin, api, manual)
  quotedIQD: number; // المبلغ بالدينار العراقي
  quotedUSD: number; // المبلغ بالدولار (للعرض)
}

export interface FXPolicy {
  mode?: 'manual' | 'source'; // يدوي أم من مصدر خارجي
  lastRate?: number | null;
  lastDate?: string | null;
  source?: string | null;
}

/**
 * إنشاء snapshot للعملة عند الموافقة
 */
export function createFXSnapshot(
  amountIQD: number,
  fxRate: number = 1300,
  source: string = 'admin'
): FXSnapshot {
  const quotedUSD = Math.round((amountIQD / fxRate) * 100) / 100;
  
  return {
    rate: fxRate,
    date: new Date().toISOString(),
    source,
    quotedIQD: amountIQD,
    quotedUSD
  };
}

/**
 * حساب قيمة USD للعرض (بدون تثبيت)
 */
export function calculateUSDPreview(
  amountIQD: number,
  fxRate: number = 1300
): number {
  return Math.round((amountIQD / fxRate) * 100) / 100;
}

/**
 * الحصول على سعر الصرف الحالي
 */
export function getCurrentFXRate(fxPolicy?: FXPolicy): number {
  // في هذه المرحلة نستخدم سعر ثابت
  // لاحقاً يمكن ربطه بـ API خارجي
  const defaultRate = 1300;
  
  if (fxPolicy?.mode === 'manual' && fxPolicy.lastRate) {
    return fxPolicy.lastRate;
  }
  
  return defaultRate;
}

/**
 * تحديث سعر الصرف يدوياً
 */
export function updateManualFXRate(
  currentPolicy: FXPolicy,
  newRate: number,
  source: string = 'admin'
): FXPolicy {
  return {
    ...currentPolicy,
    mode: 'manual',
    lastRate: newRate,
    lastDate: new Date().toISOString(),
    source
  };
}

/**
 * فحص إذا كان سعر الصرف قديم ويحتاج تحديث
 */
export function isFXRateStale(fxPolicy?: FXPolicy, maxAgeHours: number = 24): boolean {
  if (!fxPolicy?.lastDate) return true;
  
  const lastUpdate = new Date(fxPolicy.lastDate);
  const now = new Date();
  const ageHours = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
  
  return ageHours > maxAgeHours;
}

/**
 * حساب تأثير تغيير سعر الصرف على العروض
 */
export function analyzeFXImpact(
  quotesIQD: number[],
  oldRate: number,
  newRate: number
): {
  oldTotalUSD: number;
  newTotalUSD: number;
  differenceUSD: number;
  differencePercent: number;
  impact: 'minimal' | 'moderate' | 'significant';
} {
  const oldTotalUSD = quotesIQD.reduce((sum, iqd) => sum + calculateUSDPreview(iqd, oldRate), 0);
  const newTotalUSD = quotesIQD.reduce((sum, iqd) => sum + calculateUSDPreview(iqd, newRate), 0);
  
  const differenceUSD = newTotalUSD - oldTotalUSD;
  const differencePercent = oldTotalUSD > 0 ? (differenceUSD / oldTotalUSD) * 100 : 0;
  
  let impact: 'minimal' | 'moderate' | 'significant' = 'minimal';
  const absPercent = Math.abs(differencePercent);
  
  if (absPercent > 10) {
    impact = 'significant';
  } else if (absPercent > 5) {
    impact = 'moderate';
  }
  
  return {
    oldTotalUSD,
    newTotalUSD,
    differenceUSD,
    differencePercent,
    impact
  };
}

/**
 * تنسيق عرض العملة
 */
export function formatCurrency(amount: number, currency: 'IQD' | 'USD' = 'IQD'): string {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }
  
  // تنسيق الدينار العراقي
  return new Intl.NumberFormat('ar-IQ', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount) + ' د.ع';
}

/**
 * التحقق من صحة سعر الصرف
 */
export function validateFXRate(rate: number): { valid: boolean; error?: string } {
  if (rate <= 0) {
    return { valid: false, error: 'سعر الصرف يجب أن يكون أكبر من صفر' };
  }
  
  if (rate < 1000 || rate > 2000) {
    return { valid: false, error: 'سعر الصرف خارج النطاق المعقول (1000-2000)' };
  }
  
  return { valid: true };
}

/**
 * إنشاء تقرير FX للعروض
 */
export function generateFXReport(snapshots: FXSnapshot[]): {
  totalIQD: number;
  totalUSD: number;
  averageRate: number;
  rateRange: { min: number; max: number };
  oldestSnapshot: string;
  newestSnapshot: string;
  rateStability: 'stable' | 'volatile';
} {
  if (snapshots.length === 0) {
    return {
      totalIQD: 0,
      totalUSD: 0,
      averageRate: 0,
      rateRange: { min: 0, max: 0 },
      oldestSnapshot: '',
      newestSnapshot: '',
      rateStability: 'stable'
    };
  }
  
  const totalIQD = snapshots.reduce((sum, s) => sum + s.quotedIQD, 0);
  const totalUSD = snapshots.reduce((sum, s) => sum + s.quotedUSD, 0);
  const rates = snapshots.map(s => s.rate);
  const averageRate = rates.reduce((sum, r) => sum + r, 0) / rates.length;
  const minRate = Math.min(...rates);
  const maxRate = Math.max(...rates);
  
  const dates = snapshots.map(s => s.date).sort();
  const oldestSnapshot = dates[0];
  const newestSnapshot = dates[dates.length - 1];
  
  // تحديد استقرار السعر
  const rateVariation = (maxRate - minRate) / averageRate;
  const rateStability = rateVariation > 0.05 ? 'volatile' : 'stable'; // 5% threshold
  
  return {
    totalIQD,
    totalUSD,
    averageRate,
    rateRange: { min: minRate, max: maxRate },
    oldestSnapshot,
    newestSnapshot,
    rateStability
  };
}

/**
 * تحويل العملة مع حفظ التاريخ
 */
export function convertWithHistory(
  amountIQD: number,
  fromRate: number,
  toRate: number
): {
  originalUSD: number;
  newUSD: number;
  difference: number;
  percentChange: number;
} {
  const originalUSD = calculateUSDPreview(amountIQD, fromRate);
  const newUSD = calculateUSDPreview(amountIQD, toRate);
  const difference = newUSD - originalUSD;
  const percentChange = originalUSD > 0 ? (difference / originalUSD) * 100 : 0;
  
  return {
    originalUSD,
    newUSD,
    difference,
    percentChange
  };
}
