import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      );
    }

    const userRole = (session.user as { role?: string })?.role || 'client';
    if (userRole !== 'client') {
      return NextResponse.json(
        { error: 'هذه الوظيفة متاحة للعملاء فقط' },
        { status: 403 }
      );
    }

    const { sowId } = await request.json();

    if (!sowId) {
      return NextResponse.json(
        { error: 'معرف المستند مطلوب' },
        { status: 400 }
      );
    }

    // TODO: Implement actual digital signature logic
    // For MVP, we'll just mark the document as signed
    
    // في التطبيق الحقيقي، نحتاج:
    // 1. التحقق من وجود المستند وملكية العميل له
    // 2. إنشاء توقيع رقمي
    // 3. تحديث حالة المستند في قاعدة البيانات
    // 4. إرسال إشعارات للفريق

    console.log(`Client ${session.user.email} signed SOW: ${sowId}`);

    // محاكاة عملية التوقيع
    const signatureData = {
      id: sowId,
      signedBy: session.user.email,
      signedAt: new Date().toISOString(),
      signatureHash: `sign_${Date.now()}_${sowId}`,
      status: 'signed'
    };

    return NextResponse.json({
      success: true,
      message: 'تم توقيع المستند بنجاح',
      signature: signatureData
    });

  } catch (error) {
    console.error('Error signing document:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء توقيع المستند' },
      { status: 500 }
    );
  }
}
