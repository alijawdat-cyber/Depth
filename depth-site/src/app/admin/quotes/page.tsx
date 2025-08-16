"use client";

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
// ملاحظة: نستغني عن AdminLayout القديم لأن الغلاف الموحد موجود في app/admin/layout.tsx
import { Button } from '@/components/ui/Button';
import Loader from '@/components/loaders/Loader';
import { formatCurrency } from '@/lib/pricing/fx';
import Dropdown from '@/components/ui/Dropdown';
import { Quote, QuoteCreateRequest, Subcategory, Vertical, RateCard } from '@/types/catalog';

interface QuoteStats {
  draft: number;
  sent: number;
  approved: number;
  rejected: number;
  total: number;
}

export default function AdminQuotesPage() {
  const { data: session, status } = useSession();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [stats, setStats] = useState<QuoteStats | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [rateCard, setRateCard] = useState<RateCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // بيانات نموذج إنشاء العرض
  const [newQuote, setNewQuote] = useState<Partial<QuoteCreateRequest>>({
    clientEmail: '',
    projectId: '',
    lines: [{
      subcategoryId: '',
      qty: 1,
      vertical: '',
      processing: 'raw_basic',
      conditions: { rush: false, locationZone: '' },
      tier: undefined,
      overrideIQD: undefined,
      estimatedCostIQD: undefined,
      notes: ''
    }],
    notes: ''
  });

  // تحميل البيانات عند بداية الصفحة
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStatus]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // تحميل العروض
      const qs = selectedStatus === 'all' ? '?limit=50' : `?status=${selectedStatus}&limit=50`;
      const quotesResponse = await fetch(`/api/pricing/quote${qs}`);
      if (!quotesResponse.ok) {
        throw new Error('فشل في تحميل العروض');
      }
      const quotesData = await quotesResponse.json();
      setQuotes(quotesData.quotes || []);
      setStats(quotesData.stats);

      // تحميل الفئات الفرعية والمحاور والريت كارد (إذا لم تكن محملة)
      if (subcategories.length === 0 || verticals.length === 0 || !rateCard) {
        const [subcatResponse, verticalResponse, rateResponse] = await Promise.all([
          fetch('/api/catalog/subcategories'),
          fetch('/api/catalog/verticals'),
          fetch('/api/pricing/rate-card/active')
        ]);

        if (subcatResponse.ok) {
          const subcatData = await subcatResponse.json();
          setSubcategories(subcatData.data || subcatData.items || []);
        }

        if (verticalResponse.ok) {
          const verticalData = await verticalResponse.json();
          setVerticals(verticalData.data || verticalData.items || []);
        }

        if (rateResponse.ok) {
          const rateData = await rateResponse.json();
          setRateCard(rateData.rateCard ?? null);
        }
      }

    } catch (err) {
      console.error('خطأ في تحميل البيانات:', err);
      setError(err instanceof Error ? err.message : 'خطأ غير معروف');
    } finally {
      setLoading(false);
    }
  };

  const createQuote = async () => {
    if (!newQuote.clientEmail || !newQuote.lines || newQuote.lines.length === 0) {
      setError('يرجى ملء بريد العميل وإضافة سطر واحد على الأقل');
      return;
    }
    const invalid = newQuote.lines.some(l => !l.subcategoryId || !l.vertical || !l.qty || l.qty <= 0);
    if (invalid) {
      setError('يرجى إكمال الحقول المطلوبة لكل سطر (الفئة، المحور، الكمية)');
      return;
    }

    try {
      setCreating(true);
      setError(null);

      const response = await fetch('/api/pricing/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuote)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في إنشاء العرض');
      }

      const data = await response.json();
      setQuotes(prev => [data.quote, ...prev]);
      setShowCreateForm(false);
      
      // إعادة تعيين النموذج
      setNewQuote({
        clientEmail: '',
        projectId: '',
        lines: [{
          subcategoryId: '',
          qty: 1,
          vertical: '',
          processing: 'raw_basic',
          conditions: { rush: false, locationZone: '' },
          tier: undefined,
          overrideIQD: undefined,
          estimatedCostIQD: undefined,
          notes: ''
        }],
        notes: ''
      });

      // إعادة تحميل الإحصائيات
      loadData();

    } catch (err) {
      console.error('خطأ في إنشاء العرض:', err);
      setError(err instanceof Error ? err.message : 'خطأ في إنشاء العرض');
    } finally {
      setCreating(false);
    }
  };

  const updateQuoteStatus = async (quoteId: string, action: 'send' | 'approve' | 'reject', reason?: string) => {
    try {
      setUpdating(quoteId);
      setError(null);

      const response = await fetch('/api/pricing/quote', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: quoteId, action, reason })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في تحديث العرض');
      }

      await response.json();
      // إعادة تحميل البيانات (تحديث القائمة + الإحصائيات)
      await loadData();

    } catch (err) {
      console.error('خطأ في تحديث العرض:', err);
      setError(err instanceof Error ? err.message : 'خطأ في تحديث العرض');
    } finally {
      setUpdating(null);
    }
  };
  // حراسة الوصول: تسجيل الدخول والأدمن فقط
  const userRole = (session?.user && (session.user as { role?: string })?.role) || 'client';
  if (status !== 'authenticated') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg border p-6 text-center">
            <h1 className="text-2xl font-bold mb-3">لوحة إدارة العروض</h1>
            <p className="text-gray-600 mb-4">سجّل الدخول بحساب الأدمن للوصول.</p>
            <Button onClick={() => signIn('google', { callbackUrl: '/admin/quotes' })}>
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

  // Helpers to manage multiple quote lines - TODO: للاستخدام المستقبلي
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addLine = () => {
    setNewQuote(prev => ({
      ...prev,
      lines: [
        ...(prev.lines || []),
        {
          subcategoryId: '',
          qty: 1,
          vertical: '',
          processing: 'raw_basic',
          conditions: { rush: false, locationZone: '' },
          tier: undefined,
          overrideIQD: undefined,
          estimatedCostIQD: undefined,
          notes: ''
        }
      ]
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const removeLine = (index: number) => {
    setNewQuote(prev => ({
      ...prev,
      lines: (prev.lines || []).filter((_, i) => i !== index)
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const duplicateLine = (index: number) => {
    setNewQuote(prev => {
      const lines = prev.lines ? [...prev.lines] : [];
      const source = lines[index];
      if (!source) return prev;
      lines.splice(index + 1, 0, { ...source });
      return { ...prev, lines };
    });
  };

  // TODO: سيتم استخدام هذه الدالة عند إضافة ميزة الأسطر المتعددة في المرحلة القادمة
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateLineField = <K extends keyof QuoteCreateRequest['lines'][number]>(
    index: number,
    key: K,
    value: QuoteCreateRequest['lines'][number][K]
  ) => {
    setNewQuote(prev => {
      const lines = prev.lines ? [...prev.lines] : [];
      const current = lines[index] || {
        subcategoryId: '', qty: 1, vertical: '', processing: 'raw_basic', conditions: { rush: false, locationZone: '' }
      };
      lines[index] = { ...current, [key]: value } as QuoteCreateRequest['lines'][number];
      return { ...prev, lines };
    });
  };

  // TODO: سيتم استخدام هذه الدالة عند إضافة ميزة الأسطر المتعددة في المرحلة القادمة  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateLineConditions = (
    index: number,
    partial: NonNullable<QuoteCreateRequest['lines'][number]['conditions']>
  ) => {
    setNewQuote(prev => {
      const lines = prev.lines ? [...prev.lines] : [];
      const current = lines[index] || {
        subcategoryId: '', qty: 1, vertical: '', processing: 'raw_basic', conditions: { rush: false, locationZone: '' }
      };
      lines[index] = { 
        ...current, 
        conditions: { ...(current.conditions || {}), ...partial }
      } as QuoteCreateRequest['lines'][number];
      return { ...prev, lines };
    });
  };

  const generateSOW = async (quoteId: string) => {
    try {
      setUpdating(quoteId);
      setError(null);

      const response = await fetch('/api/contracts/sow/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quoteId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في توليد SOW');
      }

      const data = await response.json();
      alert(`تم توليد SOW بنجاح!\nرابط الملف: ${data.pdfUrl}`);

    } catch (err) {
      console.error('خطأ في توليد SOW:', err);
      setError(err instanceof Error ? err.message : 'خطأ في توليد SOW');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'مسودة';
      case 'sent': return 'مُرسل';
      case 'approved': return 'معتمد';
      case 'rejected': return 'مرفوض';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* رأس الصفحة الإداري (بديل خفيف لـ AdminLayout) */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">إدارة العروض</h1>
          <p className="text-[var(--slate-600)]">إنشاء وإدارة عروض الأسعار للعملاء</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={loadData} disabled={loading}>تحديث</Button>
          <Button onClick={() => setShowCreateForm(true)}>عرض جديد</Button>
        </div>
      </div>

          {error && (
            <div className="bg-[var(--danger-bg)] border border-[var(--danger-border)] rounded-[var(--radius)] p-4 mb-6">
              <p className="text-[var(--danger-fg)] text-sm">{error}</p>
            </div>
          )}

          {/* الإحصائيات */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-[var(--card)] rounded-[var(--radius)] border border-[var(--elev)] p-4 text-center">
                <div className="text-2xl font-bold text-[var(--text)]">{stats.total}</div>
                <div className="text-sm text-[var(--muted)]">إجمالي العروض</div>
              </div>
              <div className="bg-[var(--card)] rounded-[var(--radius)] border border-[var(--elev)] p-4 text-center">
                <div className="text-2xl font-bold text-[var(--text)]">{stats.draft}</div>
                <div className="text-sm text-[var(--muted)]">مسودات</div>
              </div>
              <div className="bg-[var(--card)] rounded-[var(--radius)] border border-[var(--elev)] p-4 text-center">
                <div className="text-2xl font-bold text-[var(--text)]">{stats.sent}</div>
                <div className="text-sm text-[var(--muted)]">مُرسلة</div>
              </div>
              <div className="bg-[var(--card)] rounded-[var(--radius)] border border-[var(--elev)] p-4 text-center">
                <div className="text-2xl font-bold text-[var(--text)]">{stats.approved}</div>
                <div className="text-sm text-[var(--muted)]">معتمدة</div>
              </div>
              <div className="bg-[var(--card)] rounded-[var(--radius)] border border-[var(--elev)] p-4 text-center">
                <div className="text-2xl font-bold text-[var(--text)]">{stats.rejected}</div>
                <div className="text-sm text-[var(--muted)]">مرفوضة</div>
              </div>
            </div>
          )}

          {/* أدوات التحكم */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="min-w-[200px]">
                <Dropdown
                  value={selectedStatus}
                  onChange={(v) => setSelectedStatus(String(v))}
                  options={[
                    { value: 'all', label: 'جميع العروض' },
                    { value: 'draft', label: 'مسودات' },
                    { value: 'sent', label: 'مُرسلة' },
                    { value: 'approved', label: 'معتمدة' },
                    { value: 'rejected', label: 'مرفوضة' },
                  ]}
                />
              </div>
              <Button onClick={loadData} disabled={loading}>تحديث</Button>
            </div>

            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              + إنشاء عرض جديد
            </Button>
          </div>

          {/* نموذج إنشاء العرض */}
          {showCreateForm && (
            <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] p-6 mb-6">
              <h3 className="text-lg font-semibold text-[var(--text)] mb-4">إنشاء عرض جديد</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">
                    بريد العميل *
                  </label>
                  <input
                    type="email"
                    value={newQuote.clientEmail || ''}
                    onChange={(e) => setNewQuote(prev => ({ ...prev, clientEmail: e.target.value }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                    placeholder="client@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">
                    معرف المشروع (اختياري)
                  </label>
                  <input
                    type="text"
                    value={newQuote.projectId || ''}
                    onChange={(e) => setNewQuote(prev => ({ ...prev, projectId: e.target.value }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                    placeholder="PROJECT_001"
                  />
                </div>
              </div>

              {/* تفاصيل السطر الأول */}
              <div className="border-t border-[var(--elev)] pt-4">
                <h4 className="font-medium text-[var(--text)] mb-3">تفاصيل الخدمة</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">الفئة الفرعية *</label>
                    <Dropdown
                      value={newQuote.lines?.[0]?.subcategoryId || ''}
                      onChange={(v) => setNewQuote(prev => ({
                        ...prev,
                        lines: [{
                          ...prev.lines![0],
                          subcategoryId: String(v)
                        }]
                      }))}
                      options={[{ value: '', label: 'اختر الفئة الفرعية' }, ...subcategories.map(sub => ({ value: sub.id, label: `${sub.nameAr}${sub.nameEn ? ` (${sub.nameEn})` : ''}` }))]}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">المحور *</label>
                    <Dropdown
                      value={newQuote.lines?.[0]?.vertical || ''}
                      onChange={(v) => setNewQuote(prev => ({
                        ...prev,
                        lines: [{
                          ...prev.lines![0],
                          vertical: String(v)
                        }]
                      }))}
                      options={[{ value: '', label: 'اختر المحور' }, ...verticals.map(vertical => ({ value: vertical.id, label: `${vertical.nameAr}${vertical.nameEn ? ` (${vertical.nameEn})` : ''}` }))]}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">
                      الكمية *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newQuote.lines?.[0]?.qty || 1}
                      onChange={(e) => setNewQuote(prev => ({
                        ...prev,
                        lines: [{
                          ...prev.lines![0],
                          qty: parseInt(e.target.value) || 1
                        }]
                      }))}
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* إعدادات متقدمة للسطر */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {/* نوع المعالجة */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">نوع المعالجة</label>
                    <Dropdown
                      value={newQuote.lines?.[0]?.processing || 'raw_basic'}
                      onChange={(v) => setNewQuote(prev => ({
                        ...prev,
                        lines: [{
                          ...prev.lines![0],
                          processing: v as 'raw_only' | 'raw_basic' | 'full_retouch'
                        }]
                      }))}
                      options={[
                        { value: 'raw_only', label: 'Raw Only' },
                        { value: 'raw_basic', label: 'Raw + Basic' },
                        { value: 'full_retouch', label: 'Full Retouch' },
                      ]}
                      className="w-full"
                    />
                  </div>

                  {/* Rush */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Rush</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newQuote.lines?.[0]?.conditions?.rush || false}
                        onChange={(e) => setNewQuote(prev => ({
                          ...prev,
                          lines: [{
                            ...prev.lines![0],
                            conditions: { ...(prev.lines![0].conditions || {}), rush: e.target.checked }
                          }]
                        }))}
                        className="h-4 w-4 text-[var(--accent-500)] focus:ring-[var(--accent-500)] border-[var(--border)] rounded"
                      />
                      <span className="text-sm text-[var(--text)]">تسليم عاجل</span>
                    </div>
                  </div>

                  {/* Location Zone */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">منطقة الموقع</label>
                    <input
                      type="text"
                      value={newQuote.lines?.[0]?.conditions?.locationZone || ''}
                      onChange={(e) => setNewQuote(prev => ({
                        ...prev,
                        lines: [{
                          ...prev.lines![0],
                          conditions: { ...(prev.lines![0].conditions || {}), locationZone: e.target.value }
                        }]
                      }))}
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                      placeholder="مثال: baghdad_center"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">
                    ملاحظات إضافية
                  </label>
                  <textarea
                    value={newQuote.notes || ''}
                    onChange={(e) => setNewQuote(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                    rows={3}
                    placeholder="أي ملاحظات أو متطلبات خاصة..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 space-x-reverse mt-6">
                <Button
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-500 hover:bg-gray-600"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={createQuote}
                  disabled={creating}
                >
                  {creating ? 'جاري الإنشاء...' : 'إنشاء العرض'}
                </Button>
              </div>
            </div>
          )}

          {/* قائمة العروض */}
          <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--elev)]">
              <h3 className="text-lg font-semibold text-[var(--text)]">
                العروض ({quotes.length})
              </h3>
            </div>

            {quotes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">لا توجد عروض</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[var(--elev)]">
                  <thead className="bg-[var(--bg)]">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                        العميل
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                        المبلغ
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                        الحالة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                        تاريخ الإنشاء
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                        إجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-[var(--card)] divide-y divide-[var(--elev)]">
                    {quotes.map((quote) => (
                      <tr key={quote.id} className="hover:bg-[var(--bg)]">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-[var(--text)]">
                            {quote.clientEmail}
                          </div>
                          {quote.projectId && (
                            <div className="text-sm text-[var(--muted)]">
                              {quote.projectId}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-[var(--text)]">
                            {formatCurrency(quote.totals.iqd, 'IQD')}
                          </div>
                          {quote.totals.usd && (
                            <div className="text-sm text-[var(--muted)]">
                              {formatCurrency(quote.totals.usd, 'USD')}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(quote.status)}`}>
                            {getStatusText(quote.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--muted)]">
                          {quote.createdAt ? new Date(quote.createdAt).toLocaleDateString('ar-IQ') : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 space-x-reverse">
                          {quote.status === 'draft' && (
                            <Button
                              onClick={() => updateQuoteStatus(quote.id!, 'send')}
                              disabled={updating === quote.id}
                              className="bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1"
                            >
                              إرسال
                            </Button>
                          )}
                          
                          {quote.status === 'approved' && (
                            <Button
                              onClick={() => generateSOW(quote.id!)}
                              disabled={updating === quote.id}
                              className="bg-green-600 hover:bg-green-700 text-xs px-3 py-1"
                            >
                              توليد SOW
                            </Button>
                          )}

                          {quote.status === 'sent' && (
                            <>
                              <Button
                                onClick={() => updateQuoteStatus(quote.id!, 'approve')}
                                disabled={updating === quote.id}
                                className="bg-green-600 hover:bg-green-700 text-xs px-3 py-1"
                              >
                                اعتماد
                              </Button>
                              <Button
                                onClick={() => updateQuoteStatus(quote.id!, 'reject')}
                                disabled={updating === quote.id}
                                className="bg-red-600 hover:bg-red-700 text-xs px-3 py-1"
                              >
                                رفض
                              </Button>
                            </>
                          )}

                          <Button
                            onClick={() => {
                              // عرض تفاصيل العرض
                              console.log('Quote details:', quote);
                            }}
                            className="bg-gray-600 hover:bg-gray-700 text-xs px-3 py-1"
                          >
                            التفاصيل
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
    </div>
  );
}
