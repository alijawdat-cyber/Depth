// أدوات تنسيق موحّدة: أرقام/تواريخ/عملات — الأرقام إنكليزية، التاريخ YYYY/MM/DD، العملة الافتراضية IQD

const enNumber = new Intl.NumberFormat('en', { useGrouping: true }); // تنسيق أرقام

export function formatNumber(value: number | string): string { // تنسيق رقم
  const num = typeof value === 'string' ? Number(value) : value; // تحويل إذا سترنغ
  if (!Number.isFinite(num)) return '0'; // حماية
  return enNumber.format(num); // إخراج منسق
}

export function formatDateYMD(input: Date | string | number): string { // تنسيق تاريخ YYYY/MM/DD
  const d = input instanceof Date ? input : new Date(input); // تحويل
  if (Number.isNaN(d.getTime())) return ''; // تاريخ غير صالح
  const y = d.getFullYear(); // سنة
  const m = String(d.getMonth() + 1).padStart(2, '0'); // شهر
  const day = String(d.getDate()).padStart(2, '0'); // يوم
  return `${y}/${m}/${day}`; // الناتج
}

const iqdFmt = new Intl.NumberFormat('en', { style: 'currency', currency: 'IQD', currencyDisplay: 'code', maximumFractionDigits: 0 }); // IQD بدون كسور
const usdFmt = new Intl.NumberFormat('en', { style: 'currency', currency: 'USD', currencyDisplay: 'symbol', minimumFractionDigits: 2, maximumFractionDigits: 2 }); // USD مع كسور

export function formatCurrencyIQD(value: number): string { // تنسيق IQD
  const v = Number.isFinite(value) ? value : 0; // حماية
  return iqdFmt.format(v); // مثال: IQD 1,250,000
}

export function formatCurrencyUSD(value: number): string { // تنسيق USD
  const v = Number.isFinite(value) ? value : 0; // حماية
  return usdFmt.format(v); // مثال: $1,234.56
}
