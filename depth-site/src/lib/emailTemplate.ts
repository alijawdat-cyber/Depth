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

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


