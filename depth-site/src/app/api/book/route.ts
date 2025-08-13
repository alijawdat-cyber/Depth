import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/email/resend';
import { ORG } from '@/lib/constants/org';

export async function POST(req: NextRequest) {
  try {
    const { 
      name, 
      email, 
      phone, 
      sessionType, 
      preferredTime, 
      message,
      company,
      projectType 
    } = await req.json();

    // التحقق من البيانات المطلوبة
    if (!name || !email || !phone || !sessionType) {
      return NextResponse.json(
        { error: 'البيانات المطلوبة مفقودة' }, 
        { status: 400 }
      );
    }

    // إرسال بريد للإدارة
    await resend.emails.send({
      from: 'Depth Booking <booking@depth-agency.com>',
      to: ['admin@depth-agency.com', 'sales@depth-agency.com'],
      subject: `🗓️ طلب حجز جديد - ${sessionType}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #2563eb; margin-bottom: 20px; text-align: center;">📅 طلب حجز جديد</h2>
            
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #334155; margin-top: 0;">معلومات العميل:</h3>
              <p><strong>الاسم:</strong> ${name}</p>
              <p><strong>البريد الإلكتروني:</strong> ${email}</p>
              <p><strong>رقم الهاتف:</strong> ${phone}</p>
              ${company ? `<p><strong>الشركة:</strong> ${company}</p>` : ''}
            </div>

            <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #065f46; margin-top: 0;">تفاصيل الجلسة:</h3>
              <p><strong>نوع الجلسة:</strong> ${sessionType}</p>
              <p><strong>الوقت المفضل:</strong> ${preferredTime || 'غير محدد'}</p>
              ${projectType ? `<p><strong>نوع المشروع:</strong> ${projectType}</p>` : ''}
            </div>

            ${message ? `
              <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #92400e; margin-top: 0;">رسالة إضافية:</h3>
                <p style="line-height: 1.6;">${message}</p>
              </div>
            ` : ''}

            <div style="text-align: center; margin-top: 30px;">
              <a href="https://wa.me/${ORG.phoneIntl.replace(/\D/g,'')}?text=مرحباً، بخصوص طلب الحجز من ${name} - ${sessionType}" 
                 style="background: #25d366; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block;">
                الرد عبر الواتساب
              </a>
            </div>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
            
            <div style="text-align: center; color: #64748b; font-size: 14px;">
              <p>تم الإرسال من موقع Depth Agency</p>
              <p>depth-agency.com</p>
            </div>
          </div>
        </div>
      `
    });

    // رد تلقائي للعميل
    await resend.emails.send({
      from: 'Depth Agency <hello@depth-agency.com>',
      to: [email],
      subject: 'تأكيد طلب الحجز - Depth Agency',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #2563eb; margin-bottom: 10px;">شكراً ${name}! 🎉</h2>
              <p style="color: #64748b; font-size: 18px;">تم استلام طلب حجزك بنجاح</p>
            </div>

            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #334155; margin-top: 0;">تفاصيل الحجز:</h3>
              <p><strong>نوع الجلسة:</strong> ${sessionType}</p>
              <p><strong>الوقت المفضل:</strong> ${preferredTime || 'سيتم التنسيق معك'}</p>
            </div>

            <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #065f46; margin-top: 0;">الخطوات التالية:</h3>
              <ul style="margin: 0; padding-right: 20px; line-height: 1.8;">
                <li>سنتواصل معك خلال <strong>24 ساعة</strong> لتأكيد الموعد</li>
                <li>ستصلك رسالة واتساب مع تفاصيل اللقاء</li>
                <li>يمكنك التحضير بتحديد أهدافك من الجلسة</li>
              </ul>
            </div>

            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #92400e; margin-top: 0;">💡 نصيحة للاستعداد:</h3>
              <p style="margin: 0; line-height: 1.6;">
                فكر في أهدافك الرئيسية، ميزانيتك المبدئية، والجدول الزمني المطلوب. 
                هذا سيساعدنا في تقديم أفضل الحلول لك.
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #64748b; margin-bottom: 15px;">للاستفسارات العاجلة:</p>
              <a href="https://wa.me/${ORG.phoneIntl.replace(/\D/g,'')}?text=مرحباً، لدي استفسار بخصوص الحجز" 
                 style="background: #25d366; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 0 10px;">
                واتساب
              </a>
              <a href="mailto:hello@depth-agency.com" 
                 style="background: #6366f1; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 0 10px;">
                بريد إلكتروني
              </a>
            </div>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
            
            <div style="text-align: center; color: #64748b; font-size: 14px;">
              <p><strong>Depth Agency</strong></p>
              <p>🎬 Performance + Content Marketing</p>
              <p>📍 Baghdad - Equipped Studio</p>
              <p>🌐 depth-agency.com</p>
            </div>
          </div>
        </div>
      `
    });

    return NextResponse.json({ 
      success: true, 
      message: 'تم إرسال طلب الحجز بنجاح' 
    });

  } catch (error) {
    console.error('خطأ في API الحجز:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في إرسال طلب الحجز. يرجى المحاولة مرة أخرى.' }, 
      { status: 500 }
    );
  }
}

// دعم استعلامات GET للتحقق من حالة API
export async function GET() {
  return NextResponse.json({ 
    status: 'active',
    message: 'Depth Agency Booking API is running',
    version: '1.0.0'
  });
}
