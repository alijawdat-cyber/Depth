import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

// POST /api/admin/contracts/[id]/send
// إرسال العقد للعميل عبر البريد أو واتساب
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
    const contractId = params.id;
    const body = await req.json();
    const { method } = body; // 'email' | 'whatsapp'

    // التحقق من صحة البيانات
    if (!method || !['email', 'whatsapp'].includes(method)) {
      return NextResponse.json({ 
        success: false, 
        error: 'طريقة الإرسال غير صحيحة' 
      }, { status: 400 });
    }

    // جلب العقد
    const contractDoc = await adminDb
      .collection('contracts')
      .doc(contractId)
      .get();

    if (!contractDoc.exists) {
      return NextResponse.json({ 
        success: false, 
        error: 'العقد غير موجود' 
      }, { status: 404 });
    }

    const contractData = contractDoc.data()!;

    // التحقق من أن العقد في حالة مسودة
    if (contractData.status !== 'draft') {
      return NextResponse.json({ 
        success: false, 
        error: 'يمكن إرسال العقود في حالة المسودة فقط' 
      }, { status: 400 });
    }

    // جلب بيانات العميل
    let clientData: any = {};
    if (contractData.clientId) {
      try {
        const clientDoc = await adminDb
          .collection('clients')
          .doc(contractData.clientId)
          .get();
        
        if (clientDoc.exists) {
          clientData = clientDoc.data() || {};
        }
      } catch (error) {
        console.warn('Failed to fetch client data:', error);
      }
    }

    // إنشاء محتوى الإرسال
    const contractContent = generateContractContent(contractData, clientData);

    // إرسال العقد حسب الطريقة المحددة
    let sendResult;
    if (method === 'email') {
      sendResult = await sendEmailContract(contractData, clientData, contractContent, contractId);
    } else if (method === 'whatsapp') {
      sendResult = await sendWhatsAppContract(contractData, clientData, contractContent);
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'طريقة إرسال غير صحيحة' 
      }, { status: 400 });
    }

    if (!sendResult || !sendResult.success) {
      return NextResponse.json({ 
        success: false, 
        error: sendResult?.error || 'فشل في إرسال العقد' 
      }, { status: 500 });
    }

    // تحديث حالة العقد
    await adminDb
      .collection('contracts')
      .doc(contractId)
      .update({
        status: 'pending_client',
        sentAt: new Date().toISOString(),
        sentBy: session.user.email,
        sentMethod: method,
        updatedAt: new Date().toISOString()
      });

    // تسجيل في Audit Log
    await adminDb
      .collection('audit_logs')
      .add({
        action: 'contract_sent',
        entityType: 'contract',
        entityId: contractId,
        userId: session.user.email,
        details: {
          method,
          contractType: contractData.type,
          contractTitle: contractData.title,
          clientEmail: contractData.clientEmail,
          value: contractData.value || 0,
          currency: contractData.currency || 'IQD'
        },
        timestamp: new Date().toISOString()
      });

    return NextResponse.json({
      success: true,
      message: `تم إرسال العقد بنجاح عبر ${method === 'email' ? 'البريد الإلكتروني' : 'واتساب'}`,
      sentAt: new Date().toISOString(),
      method
    });

  } catch (error) {
    console.error('Send contract error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'خطأ في إرسال العقد' 
    }, { status: 500 });
  }
}

// دالة إنشاء محتوى العقد للإرسال
function generateContractContent(contractData: any, clientData: any) {
  const clientName = clientData.name || clientData.company || 'العميل المحترم';
  const contractType = getContractTypeText(contractData.type);
  
  let specificContent = '';
  
  // محتوى خاص بكل نوع عقد
  switch (contractData.type) {
    case 'msa':
      specificContent = `
الخدمات المشمولة:
- ${contractData.content?.scope || 'إنتاج وإدارة محتوى وتسويق أداء'}

شروط الدفع:
- ${contractData.content?.paymentTerms?.advance || 50}% مقدماً عند توقيع SOW
- ${contractData.content?.paymentTerms?.onDelivery || 50}% عند التسليم

حد المسؤولية:
- ${contractData.content?.liability?.limit || 'لا يتجاوز مجموع الأتعاب المدفوعة آخر 3 أشهر'}
`;
      break;
      
    case 'sow':
      const deliverables = contractData.content?.deliverables || [];
      let deliverablesList = '';
      deliverables.forEach((del: any, index: number) => {
        deliverablesList += `${index + 1}. ${del.type} - ${del.quantity} قطعة (${del.format})\n`;
      });
      
      specificContent = `
التسليمات:
${deliverablesList}

الميزانية:
- الأتعاب: ${formatCurrency(contractData.content?.budget?.fees || 0)}
- مصاريف طرف ثالث: ${formatCurrency(contractData.content?.budget?.thirdPartyExpenses || 0)}
- الإجمالي: ${formatCurrency(contractData.content?.budget?.total || 0)}

جولات المراجعة: ${contractData.content?.revisionRounds || 2} جولة مشمولة
نسبة القبول المستهدفة: ${contractData.content?.acceptanceTarget || 70}%
`;
      break;
      
    case 'nda':
      specificContent = `
نطاق السرية:
- ${contractData.content?.scope || 'حماية معلومات الطرفين المتعلقة بالمشاريع'}

مدة السرية:
- ${contractData.content?.confidentialityPeriod || '3 سنوات من تاريخ آخر إفشاء'}

الالتزامات:
- ${contractData.content?.obligations || 'استخدام للمشروع فقط؛ منع الإفشاء؛ حماية معقولة'}
`;
      break;
      
    default:
      specificContent = 'تفاصيل العقد متاحة في المرفق.';
  }

  const content = `
السلام عليكم ${clientName}،

نتشرف بإرسال ${contractType} للمراجعة والتوقيع:

العقد: ${contractData.title}
${contractData.value ? `القيمة: ${formatCurrency(contractData.value, contractData.currency)}` : ''}
${contractData.effectiveDate ? `تاريخ السريان: ${new Date(contractData.effectiveDate).toLocaleDateString('ar-EG')}` : ''}
${contractData.expiresAt ? `تاريخ انتهاء الصلاحية: ${new Date(contractData.expiresAt).toLocaleDateString('ar-EG')}` : ''}

${specificContent}

للمراجعة والتوقيع الإلكتروني، يرجى الضغط على الرابط المرفق.

في حال وجود أي استفسارات، لا تترددوا في التواصل معنا.

مع تحياتنا،
فريق Depth Studio
  `;

  return content.trim();
}

// دالة إرسال العقد بالبريد الإلكتروني
async function sendEmailContract(contractData: any, clientData: any, content: string, contractId: string) {
  try {
    const contractType = getContractTypeText(contractData.type);
    const subject = `${contractType} - ${contractData.title}`;
    const signatureUrl = `${process.env.NEXTAUTH_URL}/contracts/${contractId}/sign`;
    
    const emailContent = `${content}\n\nرابط التوقيع الإلكتروني:\n${signatureUrl}`;
    
    // هنا يتم الإرسال الفعلي عبر خدمة البريد الإلكتروني
    console.log('Sending email contract:', {
      to: contractData.clientEmail,
      subject,
      content: emailContent,
      signatureUrl
    });

    // محاكاة نجاح الإرسال
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: 'فشل في إرسال البريد الإلكتروني' };
  }
}

// دالة إرسال العقد عبر واتساب
async function sendWhatsAppContract(contractData: any, clientData: any, content: string) {
  try {
    // هنا يتم الإرسال الفعلي عبر واتساب API
    console.log('Sending WhatsApp contract:', {
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
function getContractTypeText(type: string) {
  switch (type) {
    case 'msa': return 'اتفاقية خدمات رئيسية (MSA)';
    case 'sow': return 'بيان العمل (SOW)';
    case 'nda': return 'اتفاقية السرية (NDA)';
    case 'equipment': return 'اتفاقية المعدات';
    case 'model_release': return 'موافقة النموذج';
    case 'influencer': return 'اتفاقية المؤثر';
    case 'media_buying': return 'ملحق شراء الوسائط';
    case 'clinica_compliance': return 'امتثال طبي';
    default: return 'عقد';
  }
}

function formatCurrency(amount: number, currency: 'IQD' | 'USD' = 'IQD') {
  if (currency === 'IQD') {
    return new Intl.NumberFormat('ar-IQ').format(amount) + ' د.ع';
  } else {
    return '$' + new Intl.NumberFormat('en-US').format(amount);
  }
}
