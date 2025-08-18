import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

/**
 * POST /api/admin/contracts/[id]/send
 * 
 * إرسال عقد للعميل عبر البريد الإلكتروني
 * Auth: admin only
 */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const requestId = crypto.randomUUID();
  const { id: contractId } = await context.params;
  
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

    // جلب العقد
    const contractDoc = await adminDb.collection('contracts').doc(contractId).get();
    if (!contractDoc.exists) {
      return NextResponse.json(
        { error: 'العقد غير موجود', requestId },
        { status: 404 }
      );
    }

    const contract = { id: contractDoc.id, ...contractDoc.data() } as {
      id: string;
      status: string;
      clientEmail: string;
      [key: string]: any;
    };

    // التحقق من حالة العقد
    if (contract.status === 'draft') {
      return NextResponse.json(
        { error: 'لا يمكن إرسال عقد في حالة مسودة', requestId },
        { status: 400 }
      );
    }

    // محاكاة إرسال البريد الإلكتروني
    // في التطبيق الحقيقي، نستخدم Resend أو خدمة أخرى
    console.log(`[contract-send] ${requestId} - Sending contract ${contractId} to ${contract.clientEmail}`);

    // تحديث حالة العقد
    await adminDb.collection('contracts').doc(contractId).update({
      status: 'pending_client',
      sentAt: new Date().toISOString(),
      sentBy: session.user.email,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      requestId,
      message: `تم إرسال العقد إلى ${contract.clientEmail} بنجاح`
    });

  } catch (error) {
    console.error(`[contract-send] ${requestId} - Error:`, error);
    
    return NextResponse.json(
      { 
        error: 'خطأ في إرسال العقد', 
        details: ['خطأ داخلي في الخادم'],
        requestId 
      },
      { status: 500 }
    );
  }
}
