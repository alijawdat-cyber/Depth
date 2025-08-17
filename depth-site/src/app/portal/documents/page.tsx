'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Container } from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import Loader from '@/components/loaders/Loader';
import { Quote, SOWLight } from '@/types/catalog';

export default function ClientDocumentsPage() {
  const { status } = useSession();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [sows, setSows] = useState<SOWLight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // تحميل البيانات
  useEffect(() => {
    if (status === 'authenticated') {
      loadData();
    }
  }, [status]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // تحميل العروض المعتمدة
      const quotesResponse = await fetch('/api/pricing/quote?status=approved&limit=50');
      if (!quotesResponse.ok) {
        const errorData = await quotesResponse.json();
        throw new Error(errorData.error || 'فشل في تحميل العروض');
      }

      const quotesData = await quotesResponse.json();
      const approvedQuotes = quotesData.quotes || [];
      setQuotes(approvedQuotes);

      // محاكاة تحميل SOWs (في الواقع نحتاج API منفصل)
      // للـ MVP، نفترض أن كل عرض معتمد له SOW
      const mockSOWs: SOWLight[] = approvedQuotes.map((quote: Quote) => ({
        id: `sow_${quote.id}`,
        quoteId: quote.id!,
        projectId: quote.projectId,
        status: 'generated' as const,
        pdfUrl: `r2://depth-documents/sow/${quote.id}_generated.pdf`,
        createdAt: quote.updatedAt || quote.createdAt
      }));
      
      setSows(mockSOWs);

    } catch (err) {
      console.error('خطأ في تحميل البيانات:', err);
      setError(err instanceof Error ? err.message : 'خطأ غير معروف');
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = async (url: string, filename: string) => {
    try {
      // للـ MVP، نعرض رسالة بدلاً من التنزيل الفعلي
      // في الإنتاج، نحتاج presigned URL أو proxy endpoint
      alert(`تنزيل المستند: ${filename}\n\nرابط المستند: ${url}\n\nملاحظة: في النسخة التجريبية، يتم عرض الرابط فقط. في الإنتاج سيتم التنزيل التلقائي.`);
    } catch (err) {
      console.error('خطأ في تنزيل المستند:', err);
      setError('فشل في تنزيل المستند');
    }
  };

  const signDocument = async (sowId: string) => {
    try {
      setError(null);
      const response = await fetch('/api/contracts/sow/sign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sowId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في توقيع المستند');
      }

      await response.json();
      // إعادة تحميل البيانات لإظهار التحديث
      await loadData();
      
      alert('تم توقيع المستند بنجاح! سيتم إشعار الفريق بالتوقيع.');
    } catch (err) {
      console.error('خطأ في توقيع المستند:', err);
      setError(err instanceof Error ? err.message : 'فشل في توقيع المستند');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated': return 'bg-blue-100 text-blue-800';
      case 'sent': return 'bg-yellow-100 text-yellow-800';
      case 'signed': return 'bg-green-100 text-green-800';
      case 'pending_signature': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'generated': return 'جاهز للتوقيع';
      case 'sent': return 'مُرسل';
      case 'signed': return 'موقع';
      case 'pending_signature': return 'في انتظار التوقيع';
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
          <p className="text-gray-600 mb-4">يجب تسجيل الدخول لعرض المستندات</p>
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
            title="المستندات"
            subtitle="جميع المستندات والعقود الخاصة بمشاريعك"
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
              <Button onClick={loadData} disabled={loading}>
                تحديث
              </Button>
            </div>

            <div className="text-sm text-gray-600">
              إجمالي المستندات: {sows.length}
            </div>
          </div>

          {/* قسم بيانات العمل (SOW) */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              بيانات العمل (Statement of Work)
            </h3>

            {sows.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">لا توجد مستندات متاحة</p>
                <p className="text-gray-400 text-sm mt-2">ستظهر بيانات العمل هنا بعد اعتماد العروض</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sows.map((sow) => {
                  const relatedQuote = quotes.find(q => q.id === sow.quoteId);
                  
                  return (
                    <div key={sow.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">
                              بيان العمل #{sow.id?.slice(-8)}
                            </h4>
                            {sow.projectId && (
                              <p className="text-sm text-gray-600">المشروع: {sow.projectId}</p>
                            )}
                            <p className="text-sm text-gray-500">
                              تاريخ الإنشاء: {sow.createdAt ? new Date(sow.createdAt).toLocaleDateString('ar-IQ') : '-'}
                            </p>
                          </div>
                          
                          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(sow.status)}`}>
                            {getStatusText(sow.status)}
                          </span>
                        </div>

                        {/* معلومات العرض المرتبط */}
                        {relatedQuote && (
                          <div className="bg-gray-50 rounded p-3 mb-4">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">العرض المرتبط:</span> #{relatedQuote.id?.slice(-8)}
                            </p>
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">قيمة المشروع:</span> {relatedQuote.totals.iqd.toLocaleString()} د.ع
                              {relatedQuote.totals.usd && (
                                <span className="text-gray-500"> ({relatedQuote.totals.usd.toLocaleString()} $)</span>
                              )}
                            </p>
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">عدد الخدمات:</span> {relatedQuote.lines.length}
                            </p>
                          </div>
                        )}

                        {/* أزرار الإجراءات */}
                        <div className="flex justify-end space-x-3 space-x-reverse pt-4 border-t border-gray-200">
                          <Button
                            onClick={() => downloadDocument(sow.pdfUrl || '', `SOW_${sow.id}.pdf`)}
                            disabled={!sow.pdfUrl || sow.pdfUrl.startsWith('r2://')}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm px-4 py-2"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {(!sow.pdfUrl || sow.pdfUrl.startsWith('r2://')) ? 'سيظهر الرابط بعد الإنشاء' : 'تحميل PDF'}
                          </Button>
                          
                          <Button
                            onClick={() => {
                              // معاينة تفاصيل SOW
                              console.log('SOW preview:', sow);
                            }}
                            className="bg-gray-600 hover:bg-gray-700 text-sm px-4 py-2"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            معاينة
                          </Button>

                          {/* زر التوقيع الإلكتروني */}
                          {sow.status === 'generated' && (
                            <Button
                              onClick={() => {
                                if (window.confirm('هل أنت متأكد من توقيع هذا المستند؟ لا يمكن التراجع عن التوقيع بعد تأكيده.')) {
                                  signDocument(sow.id!);
                                }
                              }}
                              className="bg-green-600 hover:bg-green-700 text-sm px-4 py-2"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              توقيع إلكتروني
                            </Button>
                          )}

                          {sow.status === 'signed' && (
                            <div className="flex items-center text-green-600 text-sm px-4 py-2">
                              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              تم التوقيع
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* قسم العقود الأخرى (للمستقبل) */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              اتفاقيات أخرى
            </h3>

            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">قريباً</p>
              <p className="text-gray-400 text-sm mt-2">
                ستتوفر هنا الاتفاقيات الإضافية مثل MSA وعقود الحماية والسرية
              </p>
            </div>
          </div>

          {/* معلومات إضافية */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-medium text-blue-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              معلومات مهمة حول المستندات
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-medium mb-2">بيان العمل (SOW):</h4>
                <ul className="space-y-1">
                  <li>• يتم إنشاؤه تلقائياً بعد اعتماد العرض</li>
                  <li>• يحتوي على تفاصيل الخدمات والأسعار</li>
                  <li>• يُعتبر العقد الرسمي للمشروع</li>
                  <li>• متاح للتحميل بصيغة PDF</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">الأمان والخصوصية:</h4>
                <ul className="space-y-1">
                  <li>• جميع المستندات محمية ومشفرة</li>
                  <li>• يمكنك الوصول إليها في أي وقت</li>
                  <li>• نحتفظ بنسخ احتياطية آمنة</li>
                  <li>• للمساعدة، تواصل مع فريق الدعم</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
