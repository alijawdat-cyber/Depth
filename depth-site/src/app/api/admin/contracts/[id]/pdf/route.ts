import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

/**
 * GET /api/admin/contracts/[id]/pdf
 * 
 * تحميل PDF للعقد
 * Auth: admin only
 */
export async function GET(
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

    const contract = { id: contractDoc.id, ...contractDoc.data() } as any;

    // التحقق من وجود PDF
    if (!contract.pdfUrl) {
      return NextResponse.json(
        { error: 'ملف PDF غير متوفر لهذا العقد', requestId },
        { status: 404 }
      );
    }

    // إعادة توجيه إلى URL الفعلي للـ PDF
    // في التطبيق الحقيقي، يمكن تقديم الملف مباشرة أو توليده
    return NextResponse.redirect(contract.pdfUrl);

  } catch (error) {
    console.error(`[contract-pdf] ${requestId} - Error:`, error);
    
    return NextResponse.json(
      { 
        error: 'خطأ في تحميل ملف PDF', 
        details: ['خطأ داخلي في الخادم'],
        requestId 
      },
      { status: 500 }
    );
  }
}
