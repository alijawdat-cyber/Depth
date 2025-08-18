import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

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

    // البحث عن المستخدم في جميع المجموعات
    const collections = ['creators', 'clients', 'employees', 'admins'];
    let userFound = false;
    let userCollection = '';

    for (const collection of collections) {
      try {
        const userDoc = await adminDb.collection(collection).doc(id).get();
        if (userDoc.exists) {
          userFound = true;
          userCollection = collection;
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

    // تحديث الحالة
    await adminDb.collection(userCollection).doc(id).update({
      status,
      updatedAt: new Date().toISOString(),
      updatedBy: session.user.email
    });

    return NextResponse.json({ 
      success: true, 
      message: 'تم تحديث الحالة بنجاح' 
    });

  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'خطأ في الخادم' 
    }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id] - حذف المستخدم
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

    // البحث عن المستخدم في جميع المجموعات
    const collections = ['creators', 'clients', 'employees', 'admins'];
    let userFound = false;
    let userCollection = '';

    for (const collection of collections) {
      try {
        const userDoc = await adminDb.collection(collection).doc(id).get();
        if (userDoc.exists) {
          userFound = true;
          userCollection = collection;
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

    // حذف المستخدم
    await adminDb.collection(userCollection).doc(id).delete();

    return NextResponse.json({ 
      success: true, 
      message: 'تم حذف المستخدم بنجاح' 
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'خطأ في الخادم' 
    }, { status: 500 });
  }
}
