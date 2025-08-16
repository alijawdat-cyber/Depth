"use client";

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import Loader from '@/components/loaders/Loader';
import { formatCurrency } from '@/lib/pricing/fx';
import { Quote, QuoteCreateRequest, Subcategory, Vertical } from '@/types/catalog';

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

      // تحميل الفئات الفرعية والمحاور (إذا لم تكن محملة)
      if (subcategories.length === 0) {
        const [subcatResponse, verticalResponse] = await Promise.all([
          fetch('/api/catalog/subcategories'),
          fetch('/api/catalog/verticals')
        ]);

        if (subcatResponse.ok) {
          const subcatData = await subcatResponse.json();
          setSubcategories(subcatData.data || []);
        }

        if (verticalResponse.ok) {
          const verticalData = await verticalResponse.json();
          setVerticals(verticalData.data || []);
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
    if (!newQuote.clientEmail || !newQuote.lines?.[0]?.subcategoryId || !newQuote.lines?.[0]?.vertical) {
      setError('يرجى ملء جميع الحقول المطلوبة');
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
    <AdminLayout
      title="إدارة العروض"
      description="إنشاء وإدارة عروض الأسعار للعملاء"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={loadData} disabled={loading}>
            تحديث
          </Button>
          <Button onClick={() => setShowCreateForm(true)}>
            عرض جديد
          </Button>
        </div>
      }
    >
      <div className="max-w-7xl mx-auto">

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* الإحصائيات */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">إجمالي العروض</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
                <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
                <div className="text-sm text-gray-600">مسودات</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.sent}</div>
                <div className="text-sm text-gray-600">مُرسلة</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                <div className="text-sm text-gray-600">معتمدة</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                <div className="text-sm text-gray-600">مرفوضة</div>
              </div>
            </div>
          )}

          {/* أدوات التحكم */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4 space-x-reverse">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">جميع العروض</option>
                <option value="draft">مسودات</option>
                <option value="sent">مُرسلة</option>
                <option value="approved">معتمدة</option>
                <option value="rejected">مرفوضة</option>
              </select>
              
              <Button onClick={loadData} disabled={loading}>
                تحديث
              </Button>
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
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">إنشاء عرض جديد</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    بريد العميل *
                  </label>
                  <input
                    type="email"
                    value={newQuote.clientEmail || ''}
                    onChange={(e) => setNewQuote(prev => ({ ...prev, clientEmail: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="client@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    معرف المشروع (اختياري)
                  </label>
                  <input
                    type="text"
                    value={newQuote.projectId || ''}
                    onChange={(e) => setNewQuote(prev => ({ ...prev, projectId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="PROJECT_001"
                  />
                </div>
              </div>

              {/* تفاصيل السطر الأول */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-3">تفاصيل الخدمة</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الفئة الفرعية *
                    </label>
                    <select
                      value={newQuote.lines?.[0]?.subcategoryId || ''}
                      onChange={(e) => setNewQuote(prev => ({
                        ...prev,
                        lines: [{
                          ...prev.lines![0],
                          subcategoryId: e.target.value
                        }]
                      }))}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المحور *
                    </label>
                    <select
                      value={newQuote.lines?.[0]?.vertical || ''}
                      onChange={(e) => setNewQuote(prev => ({
                        ...prev,
                        lines: [{
                          ...prev.lines![0],
                          vertical: e.target.value
                        }]
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">اختر المحور</option>
                      {verticals.map(vertical => (
                        <option key={vertical.id} value={vertical.id}>
                          {vertical.nameAr} {vertical.nameEn && `(${vertical.nameEn})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظات إضافية
                  </label>
                  <textarea
                    value={newQuote.notes || ''}
                    onChange={(e) => setNewQuote(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                العروض ({quotes.length})
              </h3>
            </div>

            {quotes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">لا توجد عروض</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        العميل
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        المبلغ
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الحالة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        تاريخ الإنشاء
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        إجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {quotes.map((quote) => (
                      <tr key={quote.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {quote.clientEmail}
                          </div>
                          {quote.projectId && (
                            <div className="text-sm text-gray-500">
                              {quote.projectId}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(quote.totals.iqd, 'IQD')}
                          </div>
                          {quote.totals.usd && (
                            <div className="text-sm text-gray-500">
                              {formatCurrency(quote.totals.usd, 'USD')}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(quote.status)}`}>
                            {getStatusText(quote.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
    </AdminLayout>
  );
}
