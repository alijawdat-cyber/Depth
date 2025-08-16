'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import Loader from '@/components/loaders/Loader';
import { formatCurrency } from '@/lib/pricing/fx';

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
      const rateResponse = await fetch('/api/pricing/rate-card/active');
      if (!rateResponse.ok) {
        throw new Error('فشل في تحميل جدول الأسعار');
      }
      const rateData = await rateResponse.json();
      setRateCard(rateData.rateCard ?? null);

      // تحميل الفئات الفرعية
      const subcatResponse = await fetch('/api/catalog/subcategories');
      if (!subcatResponse.ok) {
        throw new Error('فشل في تحميل الفئات الفرعية');
      }
      const subcatData = await subcatResponse.json();
      setSubcategories(subcatData.data || []);

      // تحميل المحاور
      const verticalResponse = await fetch('/api/catalog/verticals');
      if (!verticalResponse.ok) {
        throw new Error('فشل في تحميل المحاور');
      }
      const verticalData = await verticalResponse.json();
      setVerticals(verticalData.data || []);

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

      const response = await fetch('/api/pricing/quote/preview', {
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

  return (
    <AdminLayout
      title="محرك التسعير"
      description="حساب وتجربة أسعار العروض"
      actions={
        <Button onClick={loadData} disabled={loading}>
          تحديث البيانات
        </Button>
      }
    >
      <div className="max-w-4xl mx-auto">

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* نموذج الإدخال */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">بيانات العرض</h3>
              
              <div className="space-y-4">
                {/* الفئة الفرعية */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الفئة الفرعية *
                  </label>
                  <select
                    value={formData.subcategoryId}
                    onChange={(e) => setFormData(prev => ({ ...prev, subcategoryId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">اختر الفئة الفرعية</option>
                    {subcategories.map(sub => (
                      <option key={sub.id} value={sub.id}>
                        {sub.nameAr} {sub.nameEn && `(${sub.nameEn})`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* الكمية */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الكمية *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.qty}
                    onChange={(e) => setFormData(prev => ({ ...prev, qty: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* المحور */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المحور *
                  </label>
                  <select
                    value={formData.vertical}
                    onChange={(e) => setFormData(prev => ({ ...prev, vertical: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">اختر المحور</option>
                    {verticals.map(vertical => (
                      <option key={vertical.id} value={vertical.id}>
                        {vertical.nameAr} {vertical.nameEn && `(${vertical.nameEn})`}
                        {vertical.modifierPct && ` - ${(vertical.modifierPct * 100).toFixed(0)}%`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* نوع المعالجة */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع المعالجة *
                  </label>
                  <select
                    value={formData.processing}
                    onChange={(e) => setFormData(prev => ({ ...prev, processing: e.target.value as 'raw_only' | 'raw_basic' | 'full_retouch' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="raw_only">Raw Only (-10%)</option>
                    <option value="raw_basic">Raw + Basic (0%)</option>
                    <option value="full_retouch">Full Retouch (+35%)</option>
                  </select>
                </div>

                {/* إعدادات إضافية */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700">إعدادات إضافية</h4>
                  
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
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="rush" className="ml-2 text-sm text-gray-700">
                      Rush (+25%)
                    </label>
                  </div>

                  {/* Creator Tier */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      مستوى المبدع
                    </label>
                    <select
                      value={formData.tier || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, tier: (e.target.value as 'T1' | 'T2' | 'T3') || undefined }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">بدون تخصص</option>
                      <option value="T1">T1 - مبتدئ</option>
                      <option value="T2">T2 - متوسط (+15%)</option>
                      <option value="T3">T3 - خبير (+30%)</option>
                    </select>
                  </div>

                  {/* التكلفة المقدرة */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="للحساب الهامش"
                    />
                  </div>

                  {/* السعر المخصص */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">نتائج التسعير</h3>
              
              {result ? (
                <div className="space-y-6">
                  {/* الإجماليات */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">الإجماليات</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">المبلغ بالدينار:</span>
                        <span className="font-semibold">{formatCurrency(result.totals.iqd, 'IQD')}</span>
                      </div>
                      {result.totals.usd && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">المبلغ بالدولار:</span>
                          <span className="font-semibold">{formatCurrency(result.totals.usd, 'USD')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* تفاصيل الأسطر */}
                  {result.lines.map((line, index) => (
                    <div key={index} className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-gray-600">السطر {index + 1}</span>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(line.lineTotalIQD, 'IQD')}</div>
                          <div className="text-sm text-gray-500">
                            {formatCurrency(line.unitPriceIQD, 'IQD')} × {line.qty}
                          </div>
                        </div>
                      </div>
                      
                      {line.warnings && line.warnings.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-2">
                          <h5 className="text-sm font-medium text-yellow-800 mb-1">تحذيرات:</h5>
                          {line.warnings.map((warning, i) => (
                            <p key={i} className="text-sm text-yellow-700">{warning}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* فحص الهوامش */}
                  {result.guardrails && (
                    <div className={`rounded-lg p-4 ${
                      result.guardrails.status === 'hard_stop' ? 'bg-red-50 border border-red-200' :
                      result.guardrails.status === 'warn' ? 'bg-yellow-50 border border-yellow-200' :
                      'bg-green-50 border border-green-200'
                    }`}>
                      <h4 className={`font-medium mb-2 ${
                        result.guardrails.status === 'hard_stop' ? 'text-red-800' :
                        result.guardrails.status === 'warn' ? 'text-yellow-800' :
                        'text-green-800'
                      }`}>
                        فحص الهوامش
                      </h4>
                      
                      {result.guardrails.margin !== undefined && (
                        <div className="mb-2">
                          <span className="text-sm text-gray-600">الهامش: </span>
                          <span className="font-semibold">
                            {(result.guardrails.margin * 100).toFixed(1)}%
                          </span>
                        </div>
                      )}
                      
                      {result.guardrails.warnings && result.guardrails.warnings.map((warning, i) => (
                        <p key={i} className={`text-sm ${
                          result.guardrails?.status === 'hard_stop' ? 'text-red-700' :
                          result.guardrails?.status === 'warn' ? 'text-yellow-700' :
                          'text-green-700'
                        }`}>
                          {warning}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>أدخل بيانات العرض واضغط &quot;احسب التسعير&quot; لرؤية النتائج</p>
                </div>
              )}
            </div>
          </div>

          {/* معلومات جدول الأسعار */}
          {rateCard && (
            <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات جدول الأسعار النشط</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">الإصدار:</span>
                  <div className="font-semibold">{rateCard.versionId}</div>
                </div>
                <div>
                  <span className="text-gray-600">الحالة:</span>
                  <div className="font-semibold text-green-600">{rateCard.status}</div>
                </div>
                <div>
                  <span className="text-gray-600">ساري من:</span>
                  <div className="font-semibold">{rateCard.effectiveFrom}</div>
                </div>
                <div>
                  <span className="text-gray-600">العملة:</span>
                  <div className="font-semibold">{rateCard.currency}</div>
                </div>
              </div>
            </div>
          )}
      </div>
    </AdminLayout>
  );
}