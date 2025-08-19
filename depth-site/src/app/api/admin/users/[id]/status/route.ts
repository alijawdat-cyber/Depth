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
  const { status, reason } = body;

    if (!status) {
      return NextResponse.json({ 
        success: false, 
        error: 'الحالة مطلوبة' 
      }, { status: 400 });
    }

    const userRef = adminDb.collection('users').doc(id);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return NextResponse.json({ success: false, error: 'المستخدم غير موجود' }, { status: 404 });
    }

    // خريطة تبسيط للتحكم بالحالات (مثلاً قبول = active, رفض = suspended مع تعليق بالسبب)
    const nowIso = new Date().toISOString();
    const updateData: Record<string, unknown> = {
      status,
      updatedAt: nowIso,
      updatedBy: session.user.email
    };
    if (reason) {
      updateData['adminDecision'] = {
        reason,
        decidedAt: nowIso,
        decidedBy: session.user.email
      };
    }

    await userRef.update(updateData);

    try {
      await adminDb.collection('audit_log').add({
        action: 'user_status_updated',
        entityType: 'user',
        entityId: id,
        userId: session.user.email,
        details: { newStatus: status, reason },
        timestamp: nowIso
      });
    } catch (e) {
      console.warn('audit_log write failed', e);
    }

    return NextResponse.json({ success: true, message: 'تم تحديث الحالة بنجاح' });

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

    const userRef = adminDb.collection('users').doc(id);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return NextResponse.json({ success: false, error: 'المستخدم غير موجود' }, { status: 404 });
    }

    const data = userDoc.data();
    await adminDb.collection('deleted_users').add({
      ...data,
      originalId: id,
      deletedAt: new Date().toISOString(),
      deletedBy: session.user.email
    });
    await userRef.delete();

    try {
      await adminDb.collection('audit_log').add({
        action: 'user_deleted',
        entityType: 'user',
        entityId: id,
        userId: session.user.email,
        details: { userData: data },
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      console.warn('audit_log write failed', e);
    }

    return NextResponse.json({ success: true, message: 'تم حذف المستخدم بنجاح' });

  } catch (error) {
    console.error('[admin.users.status.DELETE] Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'خطأ في الخادم' 
    }, { status: 500 });
  }
}
