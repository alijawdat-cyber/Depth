export function renderContactEmail(params: {
  name: string;
  email: string;
  message: string;
  source?: string;
}) {
  const { name, email, message, source } = params;
  return `
  <table dir="rtl" lang="ar" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8fa;padding:24px;font-family:'Dubai',Tahoma,Arial,sans-serif;color:#0B0F14">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.08);overflow:hidden">
          <tr>
            <td style="padding:20px 24px;background:#6C2BFF;color:#fff;font-weight:700;font-size:18px">
              Depth — رسالة تواصل جديدة
            </td>
          </tr>
          <tr>
            <td style="padding:24px">
              <p style="margin:0 0 8px 0"><strong>الاسم:</strong> ${name}</p>
              <p style="margin:0 0 8px 0"><strong>البريد:</strong> <a href="mailto:${email}">${email}</a></p>
              <p style="margin:0 0 8px 0"><strong>المصدر:</strong> ${source ?? 'غير محدد'}</p>
              <hr style="border:none;border-top:1px solid #EDF2F6;margin:16px 0"/>
              <p style="margin:0 0 8px 0"><strong>نص الرسالة:</strong></p>
              <div style="white-space:pre-wrap;line-height:1.8">${escapeHtml(message)}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px;background:#FAFBFC;color:#6A7D8F;font-size:12px">
              هذه الرسالة أُرسلت من نموذج التواصل على الموقع.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

// Autoreply Templates with SLA
export function renderAutoreplyEmail(params: {
  name: string;
  type: "general" | "pricing" | "support" | "press" | "jobs";
}) {
  const { name, type } = params;
  
  const templates = {
    general: {
      subject: "شكرًا لك - سنعود إليك خلال 24 ساعة",
      sla: "24 ساعة",
      content: `
        <p>شكرًا لك على تواصلك معنا!</p>
        <p>استلمنا استفسارك وسيقوم فريقنا بالرد عليك خلال <strong>24 ساعة</strong>.</p>
        <p>إذا كان الأمر عاجلاً، يمكنك التواصل معنا على:</p>
        <p>📧 hello@depth-agency.com</p>
        <p>📱 WhatsApp: سيتم إضافة الرقم لاحقاً</p>
      `
    },
    pricing: {
      subject: "طلب عرض أسعار - سنعود إليك خلال 8 ساعات",
      sla: "8 ساعات",
      content: `
        <p>شكرًا لاهتمامك بخدماتنا!</p>
        <p>استلمنا طلب عرض الأسعار وسيقوم فريق المبيعات بالتواصل معك خلال <strong>8 ساعات عمل</strong>.</p>
        <p>سنرسل لك عرضًا مفصلاً يناسب احتياجاتك.</p>
        <p>للاستفسارات العاجلة:</p>
        <p>📧 sales@depth-agency.com</p>
        <p>📱 WhatsApp: سيتم إضافة الرقم لاحقاً</p>
      `
    },
    support: {
      subject: "طلب دعم فني - سنعود إليك خلال 6 ساعات",
      sla: "6 ساعات",
      content: `
        <p>شكرًا لتواصلك مع الدعم الفني!</p>
        <p>استلمنا طلب الدعم وسيقوم فريقنا المختص بحل مشكلتك خلال <strong>6 ساعات عمل</strong>.</p>
        <p>سنعمل على حل المشكلة بأسرع وقت ممكن.</p>
        <p>للمشاكل العاجلة:</p>
        <p>📧 support@depth-agency.com</p>
        <p>📱 WhatsApp: سيتم إضافة الرقم لاحقاً</p>
      `
    },
    press: {
      subject: "استفسار إعلامي - سنعود إليك خلال 24 ساعة",
      sla: "24 ساعة",
      content: `
        <p>شكرًا لاهتمامك الإعلامي بـ Depth!</p>
        <p>استلمنا استفسارك وسيقوم فريق العلاقات الإعلامية بالرد عليك خلال <strong>24 ساعة</strong>.</p>
        <p>سنوفر لك جميع المعلومات والموارد المطلوبة.</p>
        <p>للاستفسارات الإعلامية:</p>
        <p>📧 press@depth-agency.com</p>
        <p>📱 WhatsApp: سيتم إضافة الرقم لاحقاً</p>
      `
    },
    jobs: {
      subject: "طلب وظيفة - سنعود إليك خلال 72 ساعة",
      sla: "72 ساعة",
      content: `
        <p>شكرًا لاهتمامك بالانضمام لفريق Depth!</p>
        <p>استلمنا طلبك وسيقوم فريق الموارد البشرية بمراجعة طلبك خلال <strong>72 ساعة</strong>.</p>
        <p>إذا كان ملفك مناسبًا، سنتواصل معك لترتيب مقابلة.</p>
        <p>للاستفسارات حول الوظائف:</p>
        <p>📧 jobs@depth-agency.com</p>
        <p>📱 WhatsApp: سيتم إضافة الرقم لاحقاً</p>
      `
    }
  };

  const template = templates[type];
  
  return `
  <table dir="rtl" lang="ar" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8fa;padding:24px;font-family:'Dubai',Tahoma,Arial,sans-serif;color:#0B0F14">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.08);overflow:hidden">
          <tr>
            <td style="padding:20px 24px;background:#6C2BFF;color:#fff;font-weight:700;font-size:18px">
              Depth — تم استلام رسالتك
            </td>
          </tr>
          <tr>
            <td style="padding:24px">
              <h2 style="margin:0 0 16px 0;color:#0B0F14">مرحباً ${escapeHtml(name)}!</h2>
              ${template.content}
              <div style="margin-top:24px;padding:16px;background:#f8f9fa;border-radius:8px;border-left:4px solid #6C2BFF">
                <p style="margin:0;font-size:14px;color:#495057">
                  <strong>وقت الاستجابة المتوقع:</strong> ${template.sla}
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px;background:#FAFBFC;color:#6A7D8F;font-size:12px">
              فريق Depth — نبني تجارب رقمية استثنائية
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Quote Email Templates
export function renderQuoteNotificationEmail(params: {
  type: 'new_quote' | 'quote_approved' | 'quote_rejected';
  recipientName: string;
  recipientEmail: string;
  quoteId: string;
  projectTitle?: string;
  totalAmountIQD: number;
  totalAmountUSD?: number;
  clientMessage?: string;
  adminMessage?: string;
  quoteUrl: string;
}) {
  const { 
    type, 
    recipientName, 
    recipientEmail, 
    quoteId, 
    projectTitle, 
    totalAmountIQD, 
    totalAmountUSD, 
    clientMessage, 
    adminMessage, 
    quoteUrl 
  } = params;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getSubject = () => {
    switch (type) {
      case 'new_quote':
        return `عرض سعر جديد من Depth Agency - ${quoteId}`;
      case 'quote_approved':
        return `تم قبول عرض السعر - ${quoteId}`;
      case 'quote_rejected':
        return `تم رفض عرض السعر - ${quoteId}`;
      default:
        return `تحديث عرض السعر - ${quoteId}`;
    }
  };

  const getHeading = () => {
    switch (type) {
      case 'new_quote':
        return 'عرض سعر جديد';
      case 'quote_approved':
        return 'تم قبول عرض السعر';
      case 'quote_rejected':
        return 'تم رفض عرض السعر';
      default:
        return 'تحديث عرض السعر';
    }
  };

  const getMessage = () => {
    switch (type) {
      case 'new_quote':
        return `مرحباً ${recipientName}، تم إرسال عرض سعر جديد لمشروعك. يمكنك مراجعة التفاصيل والموافقة عليه من خلال البوابة.`;
      case 'quote_approved':
        return `شكراً لك ${recipientName} على موافقتك على عرض السعر. سنبدأ العمل على مشروعك قريباً وسنرسل لك بيان العمل (SOW).`;
      case 'quote_rejected':
        return `تم رفض عرض السعر بنجاح. يمكنك التواصل معنا لمناقشة التعديلات المطلوبة.`;
      default:
        return `تم تحديث عرض السعر الخاص بك.`;
    }
  };

  const getButtonText = () => {
    switch (type) {
      case 'new_quote':
        return 'مراجعة العرض';
      case 'quote_approved':
        return 'عرض المستندات';
      case 'quote_rejected':
        return 'عرض التفاصيل';
      default:
        return 'عرض العرض';
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'new_quote':
        return '#6C2BFF';
      case 'quote_approved':
        return '#10B981';
      case 'quote_rejected':
        return '#EF4444';
      default:
        return '#6C2BFF';
    }
  };

  return `
  <table dir="rtl" lang="ar" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8fa;padding:24px;font-family:'Dubai',Tahoma,Arial,sans-serif;color:#0B0F14">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.08);overflow:hidden">
          <tr>
            <td style="padding:20px 24px;background:${getButtonColor()};color:#fff;font-weight:700;font-size:18px;text-align:center">
              <div style="margin-bottom:8px">
                <img src="https://depth-agency.com/brand/logo-wordmark.svg" alt="Depth Agency" style="height:32px;filter:brightness(0) invert(1)"/>
              </div>
              ${getHeading()}
            </td>
          </tr>
          <tr>
            <td style="padding:24px">
              <h2 style="margin:0 0 16px 0;color:#0B0F14">${getMessage()}</h2>
              
              <div style="background:#f8f9fa;border-radius:8px;padding:16px;margin:16px 0">
                <p style="margin:0 0 8px 0;font-size:14px;color:#6A7D8F"><strong>رقم العرض:</strong> ${quoteId}</p>
                ${projectTitle ? `<p style="margin:0 0 8px 0;font-size:14px;color:#6A7D8F"><strong>المشروع:</strong> ${escapeHtml(projectTitle)}</p>` : ''}
                <p style="margin:0 0 8px 0;font-size:16px;color:#0B0F14"><strong>المبلغ:</strong> ${totalAmountIQD.toLocaleString('ar-IQ')} د.ع</p>
                ${totalAmountUSD ? `<p style="margin:0;font-size:14px;color:#6A7D8F">المبلغ بالدولار: $${totalAmountUSD.toLocaleString('en-US')}</p>` : ''}
              </div>

              ${(clientMessage || adminMessage) ? `
              <div style="background:#e3f2fd;border-right:4px solid #2196f3;padding:16px;margin:16px 0">
                <p style="margin:0 0 8px 0;font-size:14px;color:#1976d2;font-weight:600">
                  ${clientMessage ? 'رسالة من العميل:' : 'ملاحظات إضافية:'}
                </p>
                <p style="margin:0;color:#1976d2">${escapeHtml(clientMessage || adminMessage || '')}</p>
              </div>
              ` : ''}

              <div style="text-align:center;margin-top:32px">
                <a href="${quoteUrl}" style="display:inline-block;padding:12px 24px;background:${getButtonColor()};color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600">
                  ${getButtonText()}
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px;background:#FAFBFC;color:#6A7D8F;font-size:12px;text-align:center">
              <p style="margin:0 0 8px 0">تم إرسال هذا الإيميل إلى ${escapeHtml(recipientEmail)}</p>
              <p style="margin:0">© 2025 Depth Agency. جميع الحقوق محفوظة.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}


