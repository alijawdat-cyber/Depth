import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

// Types
interface UserData {
  name?: string;
  displayName?: string;
  email?: string;
  [key: string]: unknown;
}

// PATCH /api/admin/users/[id]/status
// تغيير حالة المستخدم - للإدمن فقط
export async function PATCH(
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
    const userId = params.id;
    const body = await req.json();
    const { status } = body;

    // التحقق من صحة البيانات
    const validStatuses = ['active', 'inactive', 'pending', 'suspended', 'banned'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ 
        success: false, 
        error: 'حالة غير صحيحة' 
      }, { status: 400 });
    }

    // البحث عن المستخدم في جميع المجموعات
    const collections = ['admins', 'employees', 'creators', 'clients'];
    let userDoc = null;
    let userCollection = null;
    let userData = null;

    for (const collection of collections) {
      try {
        const doc = await adminDb
          .collection(collection)
          .doc(userId)
          .get();
        
        if (doc.exists) {
          userDoc = doc;
          userCollection = collection;
          userData = doc.data();
          break;
        }
      } catch (error) {
        console.warn(`Failed to check ${collection}:`, error);
      }
    }

    if (!userDoc || !userData || !userCollection) {
      return NextResponse.json({ 
        success: false, 
        error: 'المستخدم غير موجود' 
      }, { status: 404 });
    }

    // منع تعديل حالة الإدمن الحالي
    if (userCollection === 'admins' && userId === session.user.id) {
      return NextResponse.json({ 
        success: false, 
        error: 'لا يمكن تعديل حالة حسابك الخاص' 
      }, { status: 400 });
    }

    // تحديث حالة المستخدم
    await adminDb
      .collection(userCollection)
      .doc(userId)
      .update({
        status,
        updatedAt: new Date().toISOString(),
        updatedBy: session.user.email,
        ...(status === 'suspended' && { suspendedAt: new Date().toISOString() }),
        ...(status === 'banned' && { bannedAt: new Date().toISOString() }),
        ...(status === 'active' && { 
          activatedAt: new Date().toISOString(),
          suspendedAt: null,
          bannedAt: null
        })
      });

    // تسجيل في Audit Log
    await adminDb
      .collection('audit_logs')
      .add({
        action: 'user_status_changed',
        entityType: 'user',
        entityId: userId,
        userId: session.user.email,
        details: {
          previousStatus: userData.status || 'unknown',
          newStatus: status,
          userName: userData.name || userData.displayName || 'غير محدد',
          userEmail: userData.email || '',
          userRole: getUserRole(userCollection),
          collection: userCollection
        },
        timestamp: new Date().toISOString()
      });

    // إرسال إشعار للمستخدم حسب الحالة الجديدة
    await sendStatusChangeNotification(userData, status, userCollection);

    return NextResponse.json({
      success: true,
      message: `تم تغيير حالة المستخدم إلى: ${getStatusText(status)}`,
      status,
      updatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('User status change error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'خطأ في تغيير حالة المستخدم' 
    }, { status: 500 });
  }
}

// دالة إرسال إشعار تغيير الحالة
async function sendStatusChangeNotification(userData: UserData, newStatus: string, collection: string) {
  try {
    const userRole = getUserRole(collection);

    const userName = userData.name || userData.displayName || 'المستخدم';
    const userEmail = userData.email;

    if (!userEmail) return;

    let subject = '';
    let message = '';

    switch (newStatus) {
      case 'active':
        subject = 'تم تفعيل حسابك - Depth Studio';
        message = `
مرحباً ${userName},

تم تفعيل حسابك في Depth Studio بنجاح!

يمكنك الآن الوصول إلى جميع الميزات المتاحة لدورك كـ${userRole}.

للدخول إلى حسابك: ${process.env.NEXTAUTH_URL}/auth/signin

مع تحياتنا،
فريق Depth Studio
        `;
        break;

      case 'suspended':
        subject = 'تم تعليق حسابك مؤقتاً - Depth Studio';
        message = `
مرحباً ${userName},

تم تعليق حسابك في Depth Studio مؤقتاً.

للاستفسار عن سبب التعليق أو لطلب إعادة التفعيل، يرجى التواصل مع فريق الدعم.

مع تحياتنا،
فريق Depth Studio
        `;
        break;

      case 'banned':
        subject = 'تم حظر حسابك - Depth Studio';
        message = `
مرحباً ${userName},

تم حظر حسابك في Depth Studio نهائياً.

للاستفسار عن أسباب الحظر، يرجى التواصل مع فريق الدعم.

مع تحياتنا،
فريق Depth Studio
        `;
        break;

      default:
        return; // لا نرسل إشعار للحالات الأخرى
    }

    // هنا يتم الإرسال الفعلي عبر خدمة البريد الإلكتروني
    console.log('Sending status change notification:', {
      to: userEmail,
      subject,
      message
    });

  } catch (error) {
    console.warn('Failed to send status change notification:', error);
  }
}

// دوال مساعدة
function getUserRole(collection: string) {
  switch (collection) {
    case 'admins': return 'إدمن';
    case 'employees': return 'موظف';
    case 'creators': return 'مبدع';
    case 'clients': return 'عميل';
    default: return 'مستخدم';
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'active': return 'نشط';
    case 'inactive': return 'غير نشط';
    case 'pending': return 'في الانتظار';
    case 'suspended': return 'معلق';
    case 'banned': return 'محظور';
    default: return status;
  }
}
