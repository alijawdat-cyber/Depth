'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import Loader from '@/components/loaders/Loader';
import { formatCurrency } from '@/lib/pricing/fx';
import Dropdown from '@/components/ui/Dropdown';

interface RateCard {
  versionId: string;
  status: string;
  effectiveFrom: string;
  currency: string;
  basePricesIQD: Record<string, number>;
  verticalModifiers: Record<string, number>;
  processingLevels: Record<string, number | number[]>;
  modifiers: {
    rushPct: number;
    creatorTierPct: Record<string, number>;
  };
  locationZonesIQD: Record<string, number>;
  overrideCapPercent: number;
  roundingIQD: number;
  guardrails: {
    minMarginDefault: number;
    minMarginHardStop: number;
  };
}

interface Subcategory {
  id: string;
  nameAr: string;
  nameEn?: string;
  categoryId: string;
  defaults?: { complianceTags?: string[] };
}

interface Vertical {
  id: string;
  nameAr: string;
  nameEn?: string;
  modifierPct?: number;
}

interface QuoteLineInput {
  subcategoryId: string;
  qty: number;
  vertical: string;
  processing: 'raw_only' | 'raw_basic' | 'full_retouch';
  conditions?: {
    rush?: boolean;
    locationZone?: string;
  };
  tier?: 'T1' | 'T2' | 'T3';
  overrideIQD?: number;
  estimatedCostIQD?: number;
}

interface QuotePreviewResult {
  lines: Array<{
    subcategoryId: string;
    qty: number;
    unitPriceIQD: number;
    lineTotalIQD: number;
    warnings?: string[];
  }>;
  totals: { iqd: number; usd?: number };
  guardrails?: {
    margin?: number;
    status?: 'ok' | 'warn' | 'hard_stop';
    warnings?: string[];
  };
}

export default function AdminPricingPage() {
  const { data: session, status } = useSession();
  const [rateCard, setRateCard] = useState<RateCard | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QuotePreviewResult | null>(null);

  // بيانات النموذج
  const [formData, setFormData] = useState<QuoteLineInput>({
    subcategoryId: '',
    qty: 1,
    vertical: '',
    processing: 'raw_basic',
    conditions: {
      rush: false,
      locationZone: ''
    },
    tier: undefined,
    overrideIQD: undefined,
    estimatedCostIQD: undefined
  });

  // تحميل البيانات عند بداية الصفحة
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // تحميل جدول الأسعار النشط
      const rateResponse = await fetch('/api/admin/pricing/rate-card/active');
      if (!rateResponse.ok) {
        throw new Error('فشل في تحميل جدول الأسعار');
      }
      const rateData = await rateResponse.json();
      setRateCard(rateData.rateCard ?? null);

      // تحميل الفئات الفرعية
      const subcatResponse = await fetch('/api/admin/catalog/subcategories');
      if (!subcatResponse.ok) {
        throw new Error('فشل في تحميل الفئات الفرعية');
      }
      const subcatData = await subcatResponse.json();
      setSubcategories(subcatData.items || subcatData.data || []);

      // تحميل المحاور
      const verticalResponse = await fetch('/api/admin/catalog/verticals');
      if (!verticalResponse.ok) {
        throw new Error('فشل في تحميل المحاور');
      }
      const verticalData = await verticalResponse.json();
      setVerticals(verticalData.items || verticalData.data || []);

    } catch (err) {
      console.error('خطأ في تحميل البيانات:', err);
      setError(err instanceof Error ? err.message : 'خطأ غير معروف');
    } finally {
      setLoading(false);
    }
  };

  const calculateQuote = async () => {
    if (!formData.subcategoryId || !formData.vertical) {
      setError('يرجى تحديد الفئة الفرعية والمحور');
      return;
    }

    try {
      setCalculating(true);
      setError(null);
      setResult(null);

      const response = await fetch('/api/admin/pricing/quote/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          lines: [formData],
          includeFX: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في حساب التسعير');
      }

      const data = await response.json();
      setResult(data);

    } catch (err) {
      console.error('خطأ في حساب التسعير:', err);
      setError(err instanceof Error ? err.message : 'خطأ في حساب التسعير');
    } finally {
      setCalculating(false);
    }
  };

  // حراسة الوصول: تسجيل الدخول والأدمن فقط
  const userRole = (session?.user && (session.user as { role?: string })?.role) || 'client';
  if (status !== 'authenticated') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg border p-6 text-center">
            <h1 className="text-2xl font-bold mb-3">لوحة التسعير</h1>
            <p className="text-gray-600 mb-4">سجّل الدخول بحساب الأدمن للوصول.</p>
            <Button onClick={() => signIn('google', { callbackUrl: '/admin/pricing' })}>
              تسجيل الدخول عبر Google
            </Button>
          </div>
        </div>
      </div>
    );
  }
  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg border p-6 text-center">
            <h1 className="text-2xl font-bold mb-3">لا تملك صلاحية الوصول</h1>
            <p className="text-gray-600 mb-4">هذه الصفحة خاصة بمدراء النظام.</p>
            <Button onClick={() => location.assign('/portal')}>الانتقال إلى البوابة</Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Helpers for dynamic labels without using 'any'
  const rawOnlyPctLabel = (() => {
    const raw = rateCard?.processingLevels?.['raw_only'];
    const pct = typeof raw === 'number' ? Math.round(raw * 100) : -10;
    return `${pct}%`;
  })();

  const fullRetouchPctLabel = (() => {
    const fr = rateCard?.processingLevels?.['full_retouch'];
    if (Array.isArray(fr)) {
      const avg = Math.round(((fr[0] + fr[1]) / 2) * 100);
      return `~${avg}%`;
    }
    const pct = typeof fr === 'number' ? Math.round(fr * 100) : 35;
    return `+${pct}%`;
  })();

  const rushPctLabel = `+${Math.round(((rateCard?.modifiers?.rushPct ?? 0.35) * 100))}%`;

  const tierPctLabel = (tier: 'T1'|'T2'|'T3') => {
    const pctMap = rateCard?.modifiers?.creatorTierPct || {};
    const pct = Math.round(((pctMap[tier] ?? (tier === 'T2' ? 0.10 : tier === 'T3' ? 0.20 : 0)) * 100));
    const sign = pct > 0 ? '+' : '';
    return `${sign}${pct}%`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">محرك التسعير</h1>
          <p className="text-[var(--muted)]">حساب وتجربة أسعار العروض</p>
        </div>
        <Button onClick={loadData} disabled={loading}>تحديث البيانات</Button>
      </div>

      <div className="max-w-4xl mx-auto">

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* نموذج الإدخال */}
            <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] p-6">
              <h3 className="text-lg font-semibold text-[var(--text)] mb-6">بيانات العرض</h3>
              
              <div className="space-y-4">
                {/* الفئة الفرعية */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الفئة الفرعية *</label>
                  <Dropdown
                    value={formData.subcategoryId}
                    onChange={(v) => setFormData(prev => ({ ...prev, subcategoryId: String(v) }))}
                    options={[{ value: '', label: 'اختر الفئة الفرعية' }, ...subcategories.map(sub => ({ value: sub.id, label: `${sub.nameAr}${sub.nameEn ? ` (${sub.nameEn})` : ''}` }))]}
                    className="w-full"
                  />
                </div>

                {/* الكمية */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">
                    الكمية *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.qty}
                    onChange={(e) => setFormData(prev => ({ ...prev, qty: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                    required
                  />
                </div>

                {/* المحور */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">المحور *</label>
                  <Dropdown
                    value={formData.vertical}
                    onChange={(v) => setFormData(prev => ({ ...prev, vertical: String(v) }))}
                    options={[{ value: '', label: 'اختر المحور' }, ...verticals.map(vertical => ({ value: vertical.id, label: `${vertical.nameAr}${vertical.nameEn ? ` (${vertical.nameEn})` : ''}${vertical.modifierPct ? ` - ${(vertical.modifierPct * 100).toFixed(0)}%` : ''}` }))]}
                    className="w-full"
                  />
                </div>

                {/* نوع المعالجة */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">نوع المعالجة *</label>
                  <Dropdown
                    value={formData.processing}
                    onChange={(v) => setFormData(prev => ({ ...prev, processing: v as 'raw_only' | 'raw_basic' | 'full_retouch' }))}
                    options={[
                      { value: 'raw_only', label: `Raw Only (${rawOnlyPctLabel})` },
                      { value: 'raw_basic', label: 'Raw + Basic (0%)' },
                      { value: 'full_retouch', label: `Full Retouch (${fullRetouchPctLabel})` },
                    ]}
                    className="w-full"
                  />
                </div>

                {/* إعدادات إضافية */}
                <div className="space-y-3 pt-4 border-t border-[var(--elev)]">
                  <h4 className="text-sm font-medium text-[var(--text)]">إعدادات إضافية</h4>
                  
                  {/* Rush */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rush"
                      checked={formData.conditions?.rush || false}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        conditions: { ...prev.conditions, rush: e.target.checked }
                      }))}
                      className="h-4 w-4 text-[var(--accent-500)] focus:ring-[var(--accent-500)] border-[var(--border)] rounded"
                    />
                    <label htmlFor="rush" className="ml-2 text-sm text-[var(--text)]">
                      {`Rush (${rushPctLabel})`}
                    </label>
                  </div>

                  {/* Location Zone */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-1">منطقة الموقع (Location Zone)</label>
                    <Dropdown
                      value={formData.conditions?.locationZone || ''}
                      onChange={(v) => setFormData(prev => ({ ...prev, conditions: { ...prev.conditions, locationZone: String(v) } }))}
                      options={[
                        { value: '', label: 'بدون رسوم موقع' },
                        ...(
                          rateCard?.locationZonesIQD
                            ? Object.entries(rateCard.locationZonesIQD).map(([key, amount]) => ({ value: key, label: `${key} (+${formatCurrency(amount, 'IQD')})` }))
                            : []
                        )
                      ]}
                      className="w-full"
                    />
                  </div>

                  {/* Creator Tier */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-1">مستوى المبدع</label>
                    <Dropdown
                      value={formData.tier || ''}
                      onChange={(v) => setFormData(prev => ({ ...prev, tier: (v as 'T1' | 'T2' | 'T3') || undefined }))}
                      options={[
                        { value: '', label: 'بدون تخصص' },
                        { value: 'T1', label: `T1 - مبتدئ (${tierPctLabel('T1')})` },
                        { value: 'T2', label: `T2 - متوسط (${tierPctLabel('T2')})` },
                        { value: 'T3', label: `T3 - خبير (${tierPctLabel('T3')})` },
                      ]}
                      className="w-full"
                    />
                  </div>

                  {/* التكلفة المقدرة */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-1">
                      التكلفة المقدرة (د.ع)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.estimatedCostIQD || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        estimatedCostIQD: e.target.value ? parseFloat(e.target.value) : undefined 
                      }))}
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                      placeholder="للحساب الهامش"
                    />
                  </div>

                  {/* السعر المخصص */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-1">
                      السعر المخصص (د.ع)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.overrideIQD || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        overrideIQD: e.target.value ? parseFloat(e.target.value) : undefined 
                      }))}
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                      placeholder="تخصص السعر"
                    />
                  </div>
                </div>

                {/* زر الحساب */}
                <Button
                  onClick={calculateQuote}
                  disabled={calculating || !formData.subcategoryId || !formData.vertical}
                  className="w-full mt-6"
                >
                  {calculating ? 'جاري الحساب...' : 'احسب التسعير'}
                </Button>
              </div>
            </div>

            {/* النتائج */}
            <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] p-6">
              <h3 className="text-lg font-semibold text-[var(--text)] mb-6">نتائج التسعير</h3>
              
              {result ? (
                <div className="space-y-6">
                  {/* الإجماليات */}
                  <div className="bg-[var(--bg)] rounded-[var(--radius)] p-4 border border-[var(--elev)]">
                    <h4 className="font-medium text-[var(--text)] mb-3">الإجماليات</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[var(--muted)]">المبلغ بالدينار:</span>
                        <span className="font-semibold">{formatCurrency(result.totals.iqd, 'IQD')}</span>
                      </div>
                      {result.totals.usd && (
                        <div className="flex justify-between">
                          <span className="text-[var(--muted)]">المبلغ بالدولار:</span>
                          <span className="font-semibold">{formatCurrency(result.totals.usd, 'USD')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* تفاصيل الأسطر */}
                  {result.lines.map((line, index) => (
                    <div key={index} className="border-t border-[var(--elev)] pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-[var(--muted)]">السطر {index + 1}</span>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(line.lineTotalIQD, 'IQD')}</div>
                          <div className="text-sm text-[var(--muted)]">
                            {formatCurrency(line.unitPriceIQD, 'IQD')} × {line.qty}
                          </div>
                        </div>
                      </div>
                      
                      {/* تحذير امتثال Clinics */}
                      {(() => {
                        const sub = subcategories.find(s => s.id === line.subcategoryId);
                        const hasClinics = sub?.defaults?.complianceTags?.includes('clinics_policy');
                        if (!hasClinics) return null;
                        return (
                          <div className="bg-[var(--warning-bg)] border border-[var(--warning-border)] rounded p-3 mt-2">
                            <h5 className="text-sm font-medium text-[var(--warning-fg)] mb-1">تنبيه امتثال (عيادات):</h5>
                            <p className="text-sm text-[var(--warning-fg)]">
                              يتطلب هذا التسليم سياسة قبل/بعد للعيادات. الرجاء تضمين نص الإخلاء:
                              &quot;النتائج قد تختلف من شخص لآخر. المحتوى لأغراض توعوية فقط.&quot;
                            </p>
                          </div>
                        );
                      })()}

                      {line.warnings && line.warnings.length > 0 && (
                        <div className="bg-[var(--warning-bg)] border border-[var(--warning-border)] rounded p-3 mt-2">
                          <h5 className="text-sm font-medium text-[var(--warning-fg)] mb-1">تحذيرات:</h5>
                          {line.warnings.map((warning, i) => (
                            <p key={i} className="text-sm text-[var(--warning-fg)]">{warning}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* فحص الهوامش */}
                  {result.guardrails && (
                    <div className={`rounded-lg p-4 ${
                      result.guardrails.status === 'hard_stop' ? 'bg-[var(--danger-bg)] border border-[var(--danger-border)]' :
                      result.guardrails.status === 'warn' ? 'bg-[var(--warning-bg)] border border-[var(--warning-border)]' :
                      'bg-[var(--success-bg)] border border-[var(--success-border)]'
                    }`}>
                      <h4 className={`font-medium mb-2 ${
                        result.guardrails.status === 'hard_stop' ? 'text-[var(--danger-fg)]' :
                        result.guardrails.status === 'warn' ? 'text-[var(--warning-fg)]' :
                        'text-[var(--success-fg)]'
                      }`}>
                        فحص الهوامش
                      </h4>
                      
                      {result.guardrails.margin !== undefined && (
                        <div className="mb-2">
                          <span className="text-sm text-[var(--muted)]">الهامش: </span>
                          <span className="font-semibold">
                            {(result.guardrails.margin * 100).toFixed(1)}%
                          </span>
                        </div>
                      )}
                      
                      {result.guardrails.warnings && result.guardrails.warnings.map((warning, i) => (
                        <p key={i} className={`text-sm ${
                          result.guardrails?.status === 'hard_stop' ? 'text-[var(--danger-fg)]' :
                          result.guardrails?.status === 'warn' ? 'text-[var(--warning-fg)]' :
                          'text-[var(--success-fg)]'
                        }`}>
                          {warning}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-[var(--muted)] py-8">
                  <p>أدخل بيانات العرض واضغط &quot;احسب التسعير&quot; لرؤية النتائج</p>
                </div>
              )}
            </div>
          </div>

          {/* معلومات جدول الأسعار */}
          {rateCard && (
            <div className="mt-8 bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] p-6">
              <h3 className="text-lg font-semibold text-[var(--text)] mb-4">معلومات جدول الأسعار النشط</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-[var(--text)]">
                <div>
                  <span className="text-[var(--muted)]">الإصدار:</span>
                  <div className="font-semibold">{rateCard.versionId}</div>
                </div>
                <div>
                  <span className="text-[var(--muted)]">الحالة:</span>
                  <div className="font-semibold text-[var(--text)]">{rateCard.status}</div>
                </div>
                <div>
                  <span className="text:[var(--muted)]">ساري من:</span>
                  <div className="font-semibold">{rateCard.effectiveFrom}</div>
                </div>
                <div>
                  <span className="text-[var(--muted)]">العملة:</span>
                  <div className="font-semibold">{rateCard.currency}</div>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}