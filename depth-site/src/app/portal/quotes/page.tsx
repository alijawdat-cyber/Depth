"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Container } from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import Loader from '@/components/loaders/Loader';
import { formatCurrency } from '@/lib/pricing/fx';
import { Quote } from '@/types/catalog';

export default function ClientQuotesPage() {
  const { status } = useSession();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const loadQuotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const qs = selectedStatus === 'all' ? '?limit=50' : `?status=${selectedStatus}&limit=50`;
      const response = await fetch(`/api/pricing/quote${qs}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في تحميل العروض');
      }

      const data = await response.json();
      setQuotes(data.quotes || []);

    } catch (err) {
      console.error('خطأ في تحميل العروض:', err);
      setError(err instanceof Error ? err.message : 'خطأ غير معروف');
    } finally {
      setLoading(false);
    }
  }, [selectedStatus]);

  // تحميل العروض
  useEffect(() => {
    if (status === 'authenticated') {
      loadQuotes();
    }
  }, [status, selectedStatus, loadQuotes]);

  const updateQuoteStatus = async (quoteId: string, action: 'approve' | 'reject', reason?: string) => {
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
      // إعادة تحميل القائمة لتفادي عدم الاتساق اللحظي
      await loadQuotes();

    } catch (err) {
      console.error('خطأ في تحديث العرض:', err);
      setError(err instanceof Error ? err.message : 'خطأ في تحديث العرض');
    } finally {
      setUpdating(null);
    }
  };

  const handleReject = (quoteId: string) => {
    const reason = prompt('يرجى ذكر سبب الرفض (اختياري):');
    if (reason !== null) { // المستخدم لم يضغط إلغاء
      updateQuoteStatus(quoteId, 'reject', reason || undefined);
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
      case 'sent': return 'في انتظار الرد';
      case 'approved': return 'معتمد';
      case 'rejected': return 'مرفوض';
      default: return status;
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">يجب تسجيل الدخول لعرض العروض</p>
          <Button onClick={() => window.location.href = '/portal/auth/signin'}>
            تسجيل الدخول
          </Button>
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
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="عروض الأسعار"
            subtitle="عروض الأسعار المرسلة إليك من DEPTH AGENCY"
            className="text-center mb-12"
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm">{error}</p>
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
                <option value="sent">في انتظار الرد</option>
                <option value="approved">معتمدة</option>
                <option value="rejected">مرفوضة</option>
              </select>
              
              <Button onClick={loadQuotes} disabled={loading}>
                تحديث
              </Button>
            </div>

            <div className="text-sm text-gray-600">
              إجمالي العروض: {quotes.length}
            </div>
          </div>

          {/* قائمة العروض */}
          {quotes.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">لا توجد عروض أسعار</p>
              <p className="text-gray-400 text-sm mt-2">ستظهر عروض الأسعار المرسلة إليك هنا</p>
            </div>
          ) : (
            <div className="space-y-6">
              {quotes.map((quote) => (
                <div key={quote.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="p-6">
                    {/* رأس العرض */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          عرض سعر #{quote.id?.slice(-8)}
                        </h3>
                        {quote.projectId && (
                          <p className="text-sm text-gray-600">المشروع: {quote.projectId}</p>
                        )}
                        <p className="text-sm text-gray-500">
                          تاريخ الإرسال: {quote.createdAt ? new Date(quote.createdAt).toLocaleDateString('ar-IQ') : '-'}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(quote.status)}`}>
                          {getStatusText(quote.status)}
                        </span>
                      </div>
                    </div>

                    {/* تفاصيل الخدمات */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-3">تفاصيل الخدمات:</h4>
                      <div className="space-y-2">
                        {quote.lines.map((line, index) => (
                          <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                            <div>
                              <span className="font-medium">{line.subcategoryId}</span>
                              <span className="text-gray-500 mx-2">•</span>
                              <span className="text-gray-600">{line.vertical}</span>
                              <span className="text-gray-500 mx-2">•</span>
                              <span className="text-sm text-gray-500">
                                {line.processing} × {line.qty}
                                {line.conditions?.rush && <span className="text-orange-600 mr-2">(Rush)</span>}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">{formatCurrency(line.unitPriceIQD * line.qty, 'IQD')}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* الإجماليات */}
                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">المبلغ الإجمالي:</span>
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">
                            {formatCurrency(quote.totals.iqd, 'IQD')}
                          </div>
                          {quote.totals.usd && (
                            <div className="text-sm text-gray-500">
                              {formatCurrency(quote.totals.usd, 'USD')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* تحذيرات الهوامش (للمعلومات) */}
                    {quote.guardrails && quote.guardrails.warnings && quote.guardrails.warnings.length > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                        <h5 className="text-sm font-medium text-yellow-800 mb-1">ملاحظات:</h5>
                        {quote.guardrails.warnings.map((warning, i) => (
                          <p key={i} className="text-sm text-yellow-700">{warning}</p>
                        ))}
                      </div>
                    )}

                    {/* ملاحظات إضافية */}
                    {quote.notes && (
                      <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                        <h5 className="text-sm font-medium text-blue-800 mb-1">ملاحظات:</h5>
                        <p className="text-sm text-blue-700">{quote.notes}</p>
                      </div>
                    )}

                    {/* أزرار الإجراءات */}
                    {quote.status === 'sent' && (
                      <div className="flex justify-end space-x-3 space-x-reverse pt-4 border-t border-gray-200">
                        <Button
                          onClick={() => handleReject(quote.id!)}
                          disabled={updating === quote.id}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          رفض العرض
                        </Button>
                        <Button
                          onClick={() => updateQuoteStatus(quote.id!, 'approve')}
                          disabled={updating === quote.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {updating === quote.id ? 'جاري المعالجة...' : 'الموافقة على العرض'}
                        </Button>
                      </div>
                    )}

                    {/* رسالة للعروض المعتمدة */}
                    {quote.status === 'approved' && (
                      <div className="bg-green-50 border border-green-200 rounded p-4 mt-4">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-green-800">تم اعتماد العرض بنجاح</p>
                            <p className="text-sm text-green-700">سيتم التواصل معك قريباً لبدء تنفيذ المشروع</p>
                            <a href="/portal/documents" className="text-blue-600 underline text-xs mt-2 inline-block">عرض المستندات (SOW)</a>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* رسالة للعروض المرفوضة */}
                    {quote.status === 'rejected' && (
                      <div className="bg-red-50 border border-red-200 rounded p-4 mt-4">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-red-800">تم رفض العرض</p>
                            <p className="text-sm text-red-700">يمكنك التواصل معنا لمناقشة عرض جديد</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* معلومات إضافية */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">معلومات مهمة:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• العروض صالحة لمدة 30 يوم من تاريخ الإرسال</li>
              <li>• بعد الموافقة، سيتم إنشاء بيان العمل (SOW) تلقائياً</li>
              <li>• يمكنك تحميل المستندات من قسم &quot;المستندات&quot; بعد الموافقة</li>
              <li>• للاستفسارات، تواصل معنا عبر WhatsApp أو البريد الإلكتروني</li>
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
}
