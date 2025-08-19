import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { getActiveRateCard } from '@/lib/catalog/read';
import { getCurrentFXRate, createFXSnapshot, formatCurrency as formatCurrencyUnified } from '@/lib/pricing/fx';

// Types
interface ClientData {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  [key: string]: unknown;
}

interface DeliverableItem {
  subcategoryNameAr?: string;
  subcategory?: string;
  quantity?: number;
  processing?: string;
  totalIQD?: number;
  totalUSD?: number;
  assignedToName?: string;
  conditions?: {
    isRush?: boolean;
    locationZone?: string;
  };
  [key: string]: unknown;
}

interface ProjectData {
  deliverables?: DeliverableItem[];
  totalIQD?: number;
  totalUSD?: number;
  title?: string;
  clientId?: string;
  fxSnapshot?: {
    rate?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

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

    // فحص Guardrails - وفق Rate Card
    const activeRateCard = await getActiveRateCard();
    const minMarginHardStop = Math.round((activeRateCard?.guardrails?.minMarginHardStop ?? 0.45) * 100);


    const projectMargin = projectData.margin || 0;
    if (projectMargin < minMarginHardStop) {
      return NextResponse.json({ 
        success: false, 
        error: `الهامش (${projectMargin}%) أقل من الحد الأدنى المطلوب (${minMarginHardStop}%)`,
        guardrailError: true,
        currentMargin: projectMargin,
        requiredMargin: minMarginHardStop
      }, { status: 400 });
    }

    // جلب بيانات العميل من النظام الموحد
    let clientData: ClientData = {};
    if (projectData.clientId) {
      try {
        const clientDoc = await adminDb.collection('users').doc(projectData.clientId).get();
        if (clientDoc.exists) {
          const c = clientDoc.data() as { role?: string; name?: string; email?: string; clientProfile?: { company?: string; phone?: string } };
          if (c.role === 'client') {
            clientData = {
              name: c.name,
              company: c.clientProfile?.company,
              email: c.email,
              phone: c.clientProfile?.phone
            };
          }
        }
      } catch (e) {
        console.warn('Failed unified client fetch', e);
      }
    }

    const fxRate = getCurrentFXRate(activeRateCard?.fxPolicy || undefined);

    // إنشاء FX Snapshot للإجمالي بالدينار
    const totalIQD = Number(projectData.totalIQD || 0);
    const fxSnapshot = createFXSnapshot(totalIQD, fxRate, 'admin');

    // إعادة حساب الإجمالي بالدولار حسب الـ snapshot (تثبيت)
    const totalUSD = fxSnapshot.quotedUSD;

    // إنشاء محتوى العرض (يعتمد على locationZone و processing الموحّد)
    const quoteContent = generateQuoteContent({
      ...projectData,
      totalIQD,
      totalUSD,
      fxSnapshot: fxSnapshot as unknown as Record<string, unknown>,
    }, clientData);

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

    // تحديث حالة المشروع + حفظ FX Snapshot ومرجع نسخة التسعير
    await adminDb
      .collection('projects')
      .doc(projectId)
      .update({
        status: 'quote_sent',
        quoteSentAt: new Date().toISOString(),
        quoteSentBy: session.user.email,
        quoteSentMethod: method,
        totalUSD,
        snapshot: {
          ...(projectData.snapshot || {}),
          rateCardVersionId: activeRateCard?.versionId || null,
          fx: fxSnapshot,
        },
        updatedAt: new Date().toISOString()
      });

    // تسجيل في Audit Log
    await adminDb
      .collection('audit_log')
      .add({
        action: 'quote_sent',
        entityType: 'project',
        entityId: projectId,
        userId: session.user.email,
        details: {
          method,
          projectTitle: projectData.title,
          clientEmail: projectData.clientEmail,
          totalIQD,
          totalUSD,
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
function generateQuoteContent(projectData: ProjectData, clientData: ClientData) {
  const clientName = clientData.name || clientData.company || 'العميل المحترم';
  const deliverables = projectData.deliverables || [];
  
  let deliverablesList = '';
  deliverables.forEach((del: DeliverableItem, index: number) => {
    deliverablesList += `
${index + 1}. ${del.subcategoryNameAr || del.subcategory || 'غير محدد'}
   - الكمية: ${del.quantity || 0}
   - المعالجة: ${getProcessingText(del.processing || '')}
   - السعر: ${formatCurrencyUnified(del.totalIQD || 0)} (${formatCurrencyUnified(del.totalUSD || 0, 'USD')})
   ${del.conditions?.isRush ? '   - عاجل (Rush)' : ''}
   ${del.conditions?.locationZone ? `   - المنطقة: ${getLocationZoneText(del.conditions.locationZone)}` : ''}
`;
  });

  const content = `
السلام عليكم ${clientName}،

نتشرف بتقديم عرض السعر التالي لمشروع "${projectData.title}":

التسليمات المطلوبة:
${deliverablesList}

الإجمالي:
- بالدينار العراقي: ${formatCurrencyUnified(projectData.totalIQD || 0)}
- بالدولار الأمريكي: ${formatCurrencyUnified(projectData.totalUSD || 0, 'USD')} (مثبّت بسعر صرف ${projectData?.fxSnapshot?.rate || '1300'})

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
async function sendEmailQuote(projectData: ProjectData, clientData: ClientData, content: string) {
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
async function sendWhatsAppQuote(projectData: ProjectData, clientData: ClientData, content: string) {
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
    case 'raw_basic': return 'RAW + Basic Color';
    case 'full_retouch': return 'Full Retouch';
    default: return processing;
  }
}

function getLocationZoneText(zone: string) {
  switch (zone) {
    case 'baghdad_center': return 'بغداد — مركز';
    case 'baghdad_outer': return 'بغداد — أطراف';
    case 'provinces_near': return 'محافظات — قريبة';
    case 'provinces_far': return 'محافظات — بعيدة';
    default: return zone;
  }
}
