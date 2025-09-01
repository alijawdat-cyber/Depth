// أدوات تنسيق موحّدة — English-only output (digits and separators)
// ICU-safe: نستخدم try/catch لمنع أعطال SSR إذا ICU ناقص

let _numberFmt: Intl.NumberFormat | null = null;
function getEnNumberFormatter() {
  if (!_numberFmt) {
    try { _numberFmt = new Intl.NumberFormat('en', { useGrouping: true }); }
    catch { _numberFmt = new Intl.NumberFormat(); }
  }
  return _numberFmt;
}

export function formatNumber(value: number | string): string {
  const num = typeof value === 'string' ? Number(value) : value;
  if (!Number.isFinite(num)) return '0';
  try { return getEnNumberFormatter().format(num); }
  catch { return String(num); }
}

export function formatDateYMD(input: Date | string | number): string { // تنسيق تاريخ YYYY/MM/DD
  const d = input instanceof Date ? input : new Date(input); // تحويل
  if (Number.isNaN(d.getTime())) return ''; // تاريخ غير صالح
  const y = d.getFullYear(); // سنة
  const m = String(d.getMonth() + 1).padStart(2, '0'); // شهر
  const day = String(d.getDate()).padStart(2, '0'); // يوم
  return `${y}/${m}/${day}`; // الناتج
}

let _iqdFmt: Intl.NumberFormat | null = null;
let _usdFmt: Intl.NumberFormat | null = null;
function getIqdFmt(){ if (!_iqdFmt){ try { _iqdFmt = new Intl.NumberFormat('en', { style: 'currency', currency: 'IQD', currencyDisplay: 'code', maximumFractionDigits: 0 }); } catch { _iqdFmt = new Intl.NumberFormat('en'); } } return _iqdFmt; }
function getUsdFmt(){ if (!_usdFmt){ try { _usdFmt = new Intl.NumberFormat('en', { style: 'currency', currency: 'USD', currencyDisplay: 'symbol', minimumFractionDigits: 2, maximumFractionDigits: 2 }); } catch { _usdFmt = new Intl.NumberFormat('en'); } } return _usdFmt; }

export function formatCurrencyIQD(value: number): string { // تنسيق IQD
  const v = Number.isFinite(value) ? value : 0; // حماية
  return getIqdFmt().format(v); // مثال: IQD 1,250,000
}

export function formatCurrencyUSD(value: number): string { // تنسيق USD
  const v = Number.isFinite(value) ? value : 0; // حماية
  return getUsdFmt().format(v); // مثال: $1,234.56
}
