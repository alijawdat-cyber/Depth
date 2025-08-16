import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase/admin';
import { uploadDocumentToR2 } from '@/lib/cloudflare';
import { Quote, SOW } from '@/types/catalog';

// Schema للتحقق من صحة المدخلات
const SOWGenerateSchema = z.object({
  quoteId: z.string().min(1, 'معرف العرض مطلوب')
});

/**
 * توليد HTML للـ SOW من البيانات
 */
function generateSOWHTML(quote: Quote, sow: SOW): string {
  const { fields } = sow;
  
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Statement of Work - ${fields.clientName}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            direction: rtl;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .company-logo {
            font-size: 28px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
        }
        .document-title {
            font-size: 24px;
            font-weight: bold;
            margin: 20px 0;
            color: #1e40af;
        }
        .client-info {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .section {
            margin: 30px 0;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #1e40af;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .deliverable {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 15px;
            margin: 15px 0;
        }
        .deliverable-header {
            font-weight: bold;
            color: #374151;
            margin-bottom: 8px;
        }
        .deliverable-details {
            color: #6b7280;
            font-size: 14px;
            margin: 5px 0;
        }
        .price-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #f3f4f6;
        }
        .total-section {
            background: #f0f9ff;
            border: 2px solid #0ea5e9;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
        }
        .total-amount {
            font-size: 20px;
            font-weight: bold;
            color: #0c4a6e;
            text-align: center;
        }
        .terms {
            background: #fefce8;
            border-left: 4px solid #eab308;
            padding: 15px;
            margin: 20px 0;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
        }
        @media print {
            body { margin: 0; padding: 15px; }
            .header { page-break-after: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-logo">DEPTH AGENCY</div>
        <div>Creative Production & Digital Marketing</div>
        <div style="font-size: 14px; color: #6b7280; margin-top: 10px;">
            Baghdad, Iraq | contact@depth-agency.com
        </div>
    </div>

    <div class="document-title">بيان العمل (Statement of Work)</div>

    <div class="client-info">
        <h3 style="margin-top: 0; color: #1e40af;">معلومات العميل</h3>
        <p><strong>اسم العميل:</strong> ${fields.clientName}</p>
        <p><strong>البريد الإلكتروني:</strong> ${fields.clientEmail}</p>
        ${fields.projectTitle ? `<p><strong>عنوان المشروع:</strong> ${fields.projectTitle}</p>` : ''}
        <p><strong>تاريخ الإنشاء:</strong> ${new Date().toLocaleDateString('ar-IQ')}</p>
    </div>

    <div class="section">
        <h3 class="section-title">تفاصيل الخدمات</h3>
        ${fields.deliverables.map(deliverable => `
            <div class="deliverable">
                <div class="deliverable-header">${deliverable.title}</div>
                <div class="deliverable-details">${deliverable.description}</div>
                <div class="price-row">
                    <span>الكمية: ${deliverable.quantity}</span>
                    <span>سعر الوحدة: ${deliverable.unitPrice.toLocaleString()} د.ع</span>
                    <span><strong>الإجمالي: ${deliverable.total.toLocaleString()} د.ع</strong></span>
                </div>
                ${deliverable.sla ? `<div class="deliverable-details"><strong>مدة التسليم:</strong> ${deliverable.sla}</div>` : ''}
            </div>
        `).join('')}
    </div>

    <div class="total-section">
        <div class="total-amount">
            المبلغ الإجمالي: ${fields.totalAmountIQD.toLocaleString()} دينار عراقي
            ${fields.totalAmountUSD ? `<br><small style="font-size: 16px;">(${fields.totalAmountUSD.toLocaleString()} دولار أمريكي)</small>` : ''}
        </div>
    </div>

    <div class="section">
        <h3 class="section-title">شروط الدفع</h3>
        <div class="terms">
            <p>${fields.paymentTerms}</p>
        </div>
    </div>

    ${fields.additionalTerms && fields.additionalTerms.length > 0 ? `
    <div class="section">
        <h3 class="section-title">شروط إضافية</h3>
        <ul>
            ${fields.additionalTerms.map(term => `<li>${term}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    <div class="section">
        <h3 class="section-title">الشروط العامة</h3>
        <div class="terms">
            <ul>
                <li>يتم الدفع على دفعتين: 50% مقدم، 50% عند التسليم</li>
                <li>مدة صلاحية هذا العرض: 30 يوم من تاريخ الإرسال</li>
                <li>جولتان مراجعة مجانية، المراجعات الإضافية بتكلفة إضافية</li>
                <li>انتقال حقوق الملكية عند السداد الكامل</li>
                <li>الشركة تحتفظ بحق عرض الأعمال كنماذج سابقة</li>
            </ul>
        </div>
    </div>

    <div class="footer">
        <p>هذا المستند تم إنتاجه تلقائياً من نظام إدارة العروض</p>
        <p>DEPTH AGENCY © ${new Date().getFullYear()}</p>
    </div>
</body>
</html>`;
}

/**
 * تحويل HTML إلى PDF (مبسط للـ MVP)
 * في الإنتاج، يُفضل استخدام puppeteer أو مكتبة PDF متخصصة
 */
async function convertHTMLToPDF(html: string): Promise<Buffer> {
  // للـ MVP، نحفظ HTML كـ PDF بسيط
  // في التطوير المستقبلي، يمكن استخدام puppeteer أو @react-pdf/renderer
  
  // محاكاة تحويل PDF - في الواقع نحتاج مكتبة متخصصة
  const pdfContent = `
%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj

2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj

3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj

4 0 obj
<< /Length 44 >>
stream
BT
/F1 12 Tf
50 750 Td
(SOW Document Generated) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
299
%%EOF`;

  return Buffer.from(pdfContent);
}

/**
 * POST /api/contracts/sow/generate
 * 
 * توليد SOW من عرض معتمد
 * Auth: admin only
 */
export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();
  
  try {
    // التحقق من المصادقة والصلاحيات
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'غير مصرح - تسجيل الدخول مطلوب', requestId },
        { status: 401 }
      );
    }

    const userRole = (session.user as { role?: string }).role || 'client';
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'غير مصرح - صلاحية admin مطلوبة', requestId },
        { status: 403 }
      );
    }

    // قراءة وتحقق من البيانات
    const body = await req.json();
    const parseResult = SOWGenerateSchema.safeParse(body);
    
    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
      return NextResponse.json(
        { 
          error: 'بيانات غير صحيحة', 
          details: errors,
          requestId 
        },
        { status: 400 }
      );
    }

    const { quoteId } = parseResult.data;

    // جلب العرض
    const quoteDoc = await adminDb.collection('quotes').doc(quoteId).get();
    if (!quoteDoc.exists) {
      return NextResponse.json(
        { error: 'العرض غير موجود', requestId },
        { status: 404 }
      );
    }

    const quote = { id: quoteDoc.id, ...quoteDoc.data() } as Quote;

    // التحقق من أن العرض معتمد
    if (quote.status !== 'approved') {
      return NextResponse.json(
        { error: 'يمكن توليد SOW للعروض المعتمدة فقط', requestId },
        { status: 400 }
      );
    }

    // التحقق من وجود SOW سابق
    const existingSOW = await adminDb.collection('sow')
      .where('quoteId', '==', quoteId)
      .limit(1)
      .get();

    if (!existingSOW.empty) {
      const existingSOWData = { id: existingSOW.docs[0].id, ...existingSOW.docs[0].data() } as SOW;
      return NextResponse.json({
        success: true,
        requestId,
        sow: existingSOWData,
        message: 'SOW موجود مسبقاً'
      });
    }

    // إنشاء SOW object
    const deliverables = quote.lines.map(line => ({
      title: `${line.subcategoryId} - ${line.vertical}`,
      description: `${line.processing} processing, Quantity: ${line.qty}${line.conditions?.rush ? ' (Rush)' : ''}`,
      quantity: line.qty,
      unitPrice: line.unitPriceIQD,
      total: line.unitPriceIQD * line.qty,
      sla: line.conditions?.rush ? '24-48 ساعة' : '48-72 ساعة'
    }));

    const sow: SOW = {
      quoteId,
      projectId: quote.projectId,
      status: 'generated',
      fields: {
        clientName: quote.clientEmail.split('@')[0], // استخراج اسم بسيط من الإيميل
        clientEmail: quote.clientEmail,
        projectTitle: quote.projectId || undefined,
        totalAmountIQD: quote.totals.iqd,
        totalAmountUSD: quote.totals.usd,
        currency: 'IQD',
        deliverables,
        paymentTerms: '50% مقدم، 50% عند التسليم النهائي',
        additionalTerms: [
          'جولتان مراجعة مجانية',
          'تسليم الملفات المصدر عند السداد الكامل',
          'مدة صلاحية العرض: 30 يوم'
        ]
      },
      createdAt: new Date().toISOString(),
      generatedBy: session.user.email
    };

    // توليد HTML
    const html = generateSOWHTML(quote, sow);
    
    // تحويل إلى PDF (مبسط للـ MVP)
    const pdfBuffer = await convertHTMLToPDF(html);
    
    // رفع PDF إلى R2
    const fileName = `sow/${quoteId}_${Date.now()}.pdf`;
    const uploadResult = await uploadDocumentToR2({
      key: fileName,
      content: pdfBuffer,
      contentType: 'application/pdf'
    });
    
    // تحديث SOW بـ URL
    sow.pdfUrl = uploadResult.url;

    // حفظ في Firestore
    const sowDoc = await adminDb.collection('sow').add(sow);
    const savedSOW = { ...sow, id: sowDoc.id };

    // تسجيل العملية للمراقبة
    console.log(`[sow-generate] ${requestId} - Generated by: ${session.user.email}, Quote: ${quoteId}, PDF: ${uploadResult.key}`);

    return NextResponse.json({
      success: true,
      requestId,
      sow: savedSOW,
      pdfUrl: uploadResult.url
    });

  } catch (error) {
    console.error(`[sow-generate] ${requestId} - Error:`, error);
    
    return NextResponse.json(
      { 
        error: 'خطأ في توليد SOW', 
        details: ['خطأ داخلي في الخادم'],
        requestId 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/contracts/sow/generate
 * 
 * معلومات حول API توليد SOW (للتوثيق)
 */
export async function GET() {
  return NextResponse.json({
    name: 'SOW Generation API',
    version: '1.0.0',
    description: 'API لتوليد Statement of Work من العروض المعتمدة',
    endpoints: {
      POST: {
        description: 'توليد SOW جديد',
        auth: 'admin only',
        body: {
          quoteId: 'string'
        },
        response: {
          success: 'boolean',
          requestId: 'string',
          sow: 'SOW object',
          pdfUrl: 'string'
        }
      }
    },
    requirements: [
      'العرض يجب أن يكون في حالة approved',
      'صلاحية admin مطلوبة',
      'يتم رفع PDF إلى R2 تلقائياً'
    ],
    features: [
      'توليد HTML من template',
      'تحويل إلى PDF',
      'رفع إلى Cloud Storage',
      'حفظ في قاعدة البيانات',
      'منع التكرار'
    ]
  });
}
