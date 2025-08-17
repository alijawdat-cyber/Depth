import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

// POST /api/admin/projects/[id]/send-quote
// إرسال العرض مع فحص Guardrails - حسب الوثائق
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مسموح - يتطلب تسجيل الدخول' 
      }, { status: 401 });
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مسموح - مخصص للإدمن فقط' 
      }, { status: 403 });
    }

    const params = await context.params;
    const projectId = params.id;
    const body = await req.json();
    const { method } = body; // 'email' | 'whatsapp'

    // التحقق من صحة البيانات
    if (!method || !['email', 'whatsapp'].includes(method)) {
      return NextResponse.json({ 
        success: false, 
        error: 'طريقة الإرسال غير صحيحة' 
      }, { status: 400 });
    }

    // جلب المشروع
    const projectDoc = await adminDb
      .collection('projects')
      .doc(projectId)
      .get();

    if (!projectDoc.exists) {
      return NextResponse.json({ 
        success: false, 
        error: 'المشروع غير موجود' 
      }, { status: 404 });
    }

    const projectData = projectDoc.data()!;

    // التحقق من وجود تسليمات
    if (!projectData.deliverables || projectData.deliverables.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'لا يمكن إرسال عرض بدون تسليمات' 
      }, { status: 400 });
    }

    // فحص Guardrails - حسب الوثائق (هامش ≥ 45%)
    const projectMargin = projectData.margin || 0;
    const minMarginHardStop = 45; // حسب الوثائق

    if (projectMargin < minMarginHardStop) {
      return NextResponse.json({ 
        success: false, 
        error: `الهامش (${projectMargin}%) أقل من الحد الأدنى المطلوب (${minMarginHardStop}%)`,
        guardrailError: true,
        currentMargin: projectMargin,
        requiredMargin: minMarginHardStop
      }, { status: 400 });
    }

    // جلب بيانات العميل
    let clientData: any = {};
    if (projectData.clientId) {
      try {
        const clientDoc = await adminDb
          .collection('clients')
          .doc(projectData.clientId)
          .get();
        
        if (clientDoc.exists) {
          clientData = clientDoc.data() || {};
        }
      } catch (error) {
        console.warn('Failed to fetch client data:', error);
      }
    }

    // إنشاء محتوى العرض
    const quoteContent = generateQuoteContent(projectData, clientData);

    // إرسال العرض حسب الطريقة المحددة
    let sendResult;
    if (method === 'email') {
      sendResult = await sendEmailQuote(projectData, clientData, quoteContent);
    } else if (method === 'whatsapp') {
      sendResult = await sendWhatsAppQuote(projectData, clientData, quoteContent);
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'طريقة إرسال غير صحيحة' 
      }, { status: 400 });
    }

    if (!sendResult || !sendResult.success) {
      return NextResponse.json({ 
        success: false, 
        error: sendResult?.error || 'فشل في إرسال العرض' 
      }, { status: 500 });
    }

    // تحديث حالة المشروع
    await adminDb
      .collection('projects')
      .doc(projectId)
      .update({
        status: 'quote_sent',
        quoteSentAt: new Date().toISOString(),
        quoteSentBy: session.user.email,
        quoteSentMethod: method,
        updatedAt: new Date().toISOString()
      });

    // تسجيل في Audit Log
    await adminDb
      .collection('audit_logs')
      .add({
        action: 'quote_sent',
        entityType: 'project',
        entityId: projectId,
        userId: session.user.email,
        details: {
          method,
          projectTitle: projectData.title,
          clientEmail: projectData.clientEmail,
          totalIQD: projectData.totalIQD,
          totalUSD: projectData.totalUSD,
          margin: projectMargin
        },
        timestamp: new Date().toISOString()
      });

    return NextResponse.json({
      success: true,
      message: `تم إرسال العرض بنجاح عبر ${method === 'email' ? 'البريد الإلكتروني' : 'واتساب'}`,
      sentAt: new Date().toISOString(),
      method
    });

  } catch (error) {
    console.error('Send quote error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'خطأ في إرسال العرض' 
    }, { status: 500 });
  }
}

// دالة إنشاء محتوى العرض
function generateQuoteContent(projectData: any, clientData: any) {
  const clientName = clientData.name || clientData.company || 'العميل المحترم';
  const deliverables = projectData.deliverables || [];
  
  let deliverablesList = '';
  deliverables.forEach((del: any, index: number) => {
    deliverablesList += `
${index + 1}. ${del.subcategoryNameAr || del.subcategory}
   - الكمية: ${del.quantity}
   - المعالجة: ${getProcessingText(del.processing)}
   - السعر: ${formatCurrency(del.totalIQD)} (${formatCurrency(del.totalUSD, 'USD')})
   ${del.conditions.isRush ? '   - عاجل (Rush)' : ''}
   ${del.conditions.location !== 'studio' ? `   - الموقع: ${getLocationText(del.conditions.location)}` : ''}
`;
  });

  const content = `
السلام عليكم ${clientName}،

نتشرف بتقديم عرض السعر التالي لمشروع "${projectData.title}":

التسليمات المطلوبة:
${deliverablesList}

الإجمالي:
- بالدينار العراقي: ${formatCurrency(projectData.totalIQD)}
- بالدولار الأمريكي: ${formatCurrency(projectData.totalUSD, 'USD')}

ملاحظات:
- الأسعار شاملة جميع الخدمات المذكورة
- مدة التسليم: حسب SLA المتفق عليه
- الأسعار صالحة لمدة 30 يوم

للموافقة على العرض أو الاستفسار، يرجى التواصل معنا.

مع تحياتنا،
فريق Depth Studio
  `;

  return content.trim();
}

// دالة إرسال العرض بالبريد الإلكتروني
async function sendEmailQuote(projectData: any, clientData: any, content: string) {
  try {
    // هنا يتم الإرسال الفعلي عبر خدمة البريد الإلكتروني
    // مؤقتاً نسجل فقط في console
    console.log('Sending email quote:', {
      to: projectData.clientEmail,
      subject: `عرض سعر - ${projectData.title}`,
      content
    });

    // محاكاة نجاح الإرسال
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: 'فشل في إرسال البريد الإلكتروني' };
  }
}

// دالة إرسال العرض عبر واتساب
async function sendWhatsAppQuote(projectData: any, clientData: any, content: string) {
  try {
    // هنا يتم الإرسال الفعلي عبر واتساب API
    // مؤقتاً نسجل فقط في console
    console.log('Sending WhatsApp quote:', {
      to: clientData.phone || 'غير محدد',
      content
    });

    // محاكاة نجاح الإرسال
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true };
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return { success: false, error: 'فشل في إرسال رسالة واتساب' };
  }
}

// دوال مساعدة
function getProcessingText(processing: string) {
  switch (processing) {
    case 'raw_only': return 'RAW Only';
    case 'raw_color': return 'RAW + Color';
    case 'full_retouch': return 'Full Retouch';
    default: return processing;
  }
}

function getLocationText(location: string) {
  switch (location) {
    case 'studio': return 'الاستوديو';
    case 'outdoor_baghdad': return 'خارجي - بغداد';
    case 'provinces': return 'المحافظات';
    default: return location;
  }
}

function formatCurrency(amount: number, currency: 'IQD' | 'USD' = 'IQD') {
  if (currency === 'IQD') {
    return new Intl.NumberFormat('ar-IQ').format(amount) + ' د.ع';
  } else {
    return '$' + new Intl.NumberFormat('en-US').format(amount);
  }
}
