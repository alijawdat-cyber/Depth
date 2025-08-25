// =============================================
// Formatting Utilities — أرقام/تواريخ/عملات بشكل موحّد
// الشروط: الأرقام دوم إنكليزية، التاريخ بصيغة YYYY/MM/DD، العملة IQD افتراضي
// =============================================

const enNumber = new Intl.NumberFormat('en', { useGrouping: true });

export function formatNumber(value: number | string): string {
  const num = typeof value === 'string' ? Number(value) : value;
  if (!Number.isFinite(num)) return '0';
  return enNumber.format(num);
}

export function formatDateYMD(input: Date | string | number): string {
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  // صيغة مطلوبة: YYYY/MM/DD وبأرقام إنكليزية
  return `${y}/${m}/${day}`;
}

// IQD — لا نعرض كسور، ونستخدم رمز العملة عند الحاجة لاحقاً
const iqdFmt = new Intl.NumberFormat('en', {
  style: 'currency', currency: 'IQD', currencyDisplay: 'code', maximumFractionDigits: 0,
});

// USD — نعرض كسور (2)
const usdFmt = new Intl.NumberFormat('en', {
  style: 'currency', currency: 'USD', currencyDisplay: 'symbol', minimumFractionDigits: 2, maximumFractionDigits: 2,
});

export function formatCurrencyIQD(value: number): string {
  const v = Number.isFinite(value) ? value : 0;
  return iqdFmt.format(v); // مثال: IQD 1,250,000
}

export function formatCurrencyUSD(value: number): string {
  const v = Number.isFinite(value) ? value : 0;
  return usdFmt.format(v); // مثال: $1,234.56
}
