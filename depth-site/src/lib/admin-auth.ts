import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

// دالة مساعدة للتحقق من صلاحيات الأدمن
export async function checkAdminAuth() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return {
        isAuthorized: false,
        response: NextResponse.json({ 
          success: false, 
          error: 'غير مسموح - يتطلب تسجيل الدخول' 
        }, { status: 401 }),
        session: null
      };
    }

    // تحديد دور المستخدم - إما من session أو من قاعدة البيانات
    let userRole = session.user.role;
    
    if (!userRole || !['admin', 'employee', 'creator', 'client'].includes(userRole)) {
      // إذا لم يكن الدور محدد في session، احصل عليه من قاعدة البيانات
      const { determineUserRole } = await import('@/lib/auth');
      userRole = await determineUserRole(session.user.email);
    }

    console.log(`[checkAdminAuth] Email: ${session.user.email}, Role: ${userRole}`);

    if (userRole !== 'admin') {
      return {
        isAuthorized: false,
        response: NextResponse.json({ 
          success: false, 
          error: 'غير مسموح - مخصص للإدمن فقط' 
        }, { status: 403 }),
        session: session
      };
    }

    return {
      isAuthorized: true,
      response: null,
      session: session,
      userRole: userRole
    };
  } catch (error) {
    console.error('[checkAdminAuth] Error:', error);
    return {
      isAuthorized: false,
      response: NextResponse.json({ 
        success: false, 
        error: 'خطأ في التحقق من الصلاحيات' 
      }, { status: 500 }),
      session: null
    };
  }
}

// نوع TypeScript للاستجابة
export type AdminAuthResult = {
  isAuthorized: boolean;
  response: NextResponse | null;
  session: any;
  userRole?: string;
};
