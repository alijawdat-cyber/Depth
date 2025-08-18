import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

// دالة تحديد دور المستخدم (نسخة محلية)
async function determineUserRole(email: string): Promise<string> {
  if (!email) return 'client';
  
  const emailLower = email.toLowerCase();
  
  try {
    // تحقق من قائمة الأدمن في متغيرات البيئة أولاً
    const adminList = (process.env.ADMIN_EMAILS || 'admin@depth-agency.com')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);
    if (adminList.includes(emailLower)) return 'admin';
    
    // افتراضي: client
    return 'client';
  } catch (error) {
    console.error('[determineUserRole] Error:', error);
    return 'client';
  }
}

// POST /api/admin/users/[id]/status - تحديث حالة المستخدم
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || session.user.role !== 'admin') {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مسموح' 
      }, { status: 401 });
    }

    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ 
        success: false, 
        error: 'الحالة مطلوبة' 
      }, { status: 400 });
    }

    // البحث عن المستخدم في مجموعة users الموحدة أولاً
    try {
      const userDoc = await adminDb.collection('users').doc(id).get();
      if (userDoc.exists) {
        await adminDb.collection('users').doc(id).update({
          status,
          updatedAt: new Date(),
          updatedBy: session.user.email
        });

        return NextResponse.json({
          success: true,
          message: 'تم تحديث الحالة بنجاح'
        });
      }
    } catch (error) {
      console.error('Error updating in users collection:', error);
    }

    // احتياطي: البحث في المجموعات المنفصلة (للتوافق مع النظام القديم)
    const collections = ['creators', 'clients', 'employees', 'admins'];
    let userFound = false;
    let userCollection = '';

    for (const collection of collections) {
      try {
        const userDoc = await adminDb.collection(collection).doc(id).get();
        if (userDoc.exists) {
          userFound = true;
          userCollection = collection;
          
          await adminDb.collection(collection).doc(id).update({
            status,
            updatedAt: new Date(),
            updatedBy: session.user.email
          });
          break;
        }
      } catch (error) {
        console.error(`Error checking ${collection}:`, error);
      }
    }

    if (!userFound) {
      return NextResponse.json({
        success: false,
        error: 'المستخدم غير موجود'
      }, { status: 404 });
    }

    // تسجيل في Audit Log
    try {
      await adminDb.collection('audit_logs').add({
        action: 'user_status_updated',
        entityType: 'user',
        entityId: id,
        userId: session.user.email,
        details: {
          newStatus: status,
          collection: userCollection || 'users'
        },
        timestamp: new Date()
      });
    } catch (logError) {
      console.warn('Failed to log audit:', logError);
    }

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الحالة بنجاح'
    });

  } catch (error) {
    console.error('[admin.users.status.POST] Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'خطأ في الخادم' 
    }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id]/status - حذف المستخدم
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || session.user.role !== 'admin') {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مسموح' 
      }, { status: 401 });
    }

    // البحث عن المستخدم في مجموعة users الموحدة أولاً
    try {
      const userDoc = await adminDb.collection('users').doc(id).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        
        // نقل إلى مجموعة المحذوفات قبل الحذف
        await adminDb.collection('deleted_users').add({
          ...userData,
          originalId: id,
          deletedAt: new Date(),
          deletedBy: session.user.email
        });

        // حذف المستخدم
        await adminDb.collection('users').doc(id).delete();

        return NextResponse.json({
          success: true,
          message: 'تم حذف المستخدم بنجاح'
        });
      }
    } catch (error) {
      console.error('Error deleting from users collection:', error);
    }

    // احتياطي: البحث في المجموعات المنفصلة
    const collections = ['creators', 'clients', 'employees', 'admins'];
    let userFound = false;
    let userData = null;
    let userCollection = '';

    for (const collection of collections) {
      try {
        const userDoc = await adminDb.collection(collection).doc(id).get();
        if (userDoc.exists) {
          userFound = true;
          userData = userDoc.data();
          userCollection = collection;
          
          // نقل إلى مجموعة المحذوفات
          await adminDb.collection('deleted_users').add({
            ...userData,
            originalId: id,
            originalCollection: collection,
            deletedAt: new Date(),
            deletedBy: session.user.email
          });

          // حذف المستخدم
          await adminDb.collection(collection).doc(id).delete();
          break;
        }
      } catch (error) {
        console.error(`Error deleting from ${collection}:`, error);
      }
    }

    if (!userFound) {
      return NextResponse.json({
        success: false,
        error: 'المستخدم غير موجود'
      }, { status: 404 });
    }

    // تسجيل في Audit Log
    try {
      await adminDb.collection('audit_logs').add({
        action: 'user_deleted',
        entityType: 'user',
        entityId: id,
        userId: session.user.email,
        details: {
          collection: userCollection || 'users',
          userData: userData
        },
        timestamp: new Date()
      });
    } catch (logError) {
      console.warn('Failed to log audit:', logError);
    }

    return NextResponse.json({
      success: true,
      message: 'تم حذف المستخدم بنجاح'
    });

  } catch (error) {
    console.error('[admin.users.status.DELETE] Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'خطأ في الخادم' 
    }, { status: 500 });
  }
}
