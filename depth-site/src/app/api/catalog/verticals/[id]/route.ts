import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';

// Schema للتحديث
const VerticalUpdateSchema = z.object({
  nameAr: z.string().min(1).optional(),
  nameEn: z.string().optional(),
  modifierPct: z.number().optional()
});

// تحديث محور
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  try {
    // التحقق من الصلاحيات
    const session = await getServerSession(authOptions);
    const role = (session?.user as { role?: string } | undefined)?.role;
    if (!session?.user || role !== 'admin') {
      return NextResponse.json({ 
        success: false, 
        code: 'UNAUTHORIZED', 
        message: 'Admin access required', 
        requestId 
      }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const validatedData = VerticalUpdateSchema.parse(body);

    // التحقق من وجود المحور
    const docRef = adminDb.collection('catalog_verticals').doc(id);
    const existingDoc = await docRef.get();
    
    if (!existingDoc.exists) {
      return NextResponse.json({ 
        success: false, 
        code: 'NOT_FOUND', 
        message: 'المحور غير موجود', 
        requestId 
      }, { status: 404 });
    }

    // تحديث البيانات
    const updateData = {
      ...validatedData,
      updatedAt: new Date().toISOString(),
      updatedBy: session.user.email
    };

    await docRef.update(updateData);

    // الحصول على البيانات المحدثة
    const updatedDoc = await docRef.get();
    const updatedVertical = { id: updatedDoc.id, ...updatedDoc.data() };

    return NextResponse.json({ 
      success: true, 
      requestId, 
      vertical: updatedVertical,
      message: 'تم تحديث المحور بنجاح'
    });

  } catch (error) {
    console.error('[catalog.verticals.update] error', { requestId, error });
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        code: 'VALIDATION_ERROR', 
        message: 'بيانات غير صحيحة',
        errors: error.issues.map((issue) => issue.message),
        requestId 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: false, 
      code: 'SERVER_ERROR', 
      message: 'Failed to update vertical', 
      requestId 
    }, { status: 500 });
  }
}

// حذف محور
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  try {
    // التحقق من الصلاحيات
    const session = await getServerSession(authOptions);
    const role = (session?.user as { role?: string } | undefined)?.role;
    if (!session?.user || role !== 'admin') {
      return NextResponse.json({ 
        success: false, 
        code: 'UNAUTHORIZED', 
        message: 'Admin access required', 
        requestId 
      }, { status: 401 });
    }

    const { id } = await params;

    // التحقق من وجود المحور
    const docRef = adminDb.collection('catalog_verticals').doc(id);
    const existingDoc = await docRef.get();
    
    if (!existingDoc.exists) {
      return NextResponse.json({ 
        success: false, 
        code: 'NOT_FOUND', 
        message: 'المحور غير موجود', 
        requestId 
      }, { status: 404 });
    }

    // التحقق من عدم وجود عروض أسعار مرتبطة بهذا المحور
    // نعتمد على فهرس مسطّح `quote_lines` بدلاً من collectionGroup غير الموجود
    const linkedLinesSnap = await adminDb
      .collection('quote_lines')
      .where('vertical', '==', id)
      .limit(1)
      .get();

    if (!linkedLinesSnap.empty) {
      return NextResponse.json({ 
        success: false, 
        code: 'CONSTRAINT_VIOLATION', 
        message: 'لا يمكن حذف المحور لوجود عروض أسعار مرتبطة به', 
        requestId 
      }, { status: 400 });
    }

    // حذف المحور
    await docRef.delete();

    return NextResponse.json({ 
      success: true, 
      requestId, 
      message: 'تم حذف المحور بنجاح'
    });

  } catch (error) {
    console.error('[catalog.verticals.delete] error', { requestId, error });
    return NextResponse.json({ 
      success: false, 
      code: 'SERVER_ERROR', 
      message: 'Failed to delete vertical', 
      requestId 
    }, { status: 500 });
  }
}

// الحصول على محور واحد
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  try {
    const { id } = await params;

    const docRef = adminDb.collection('catalog_verticals').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return NextResponse.json({ 
        success: false, 
        code: 'NOT_FOUND', 
        message: 'المحور غير موجود', 
        requestId 
      }, { status: 404 });
    }

    const vertical = { id: doc.id, ...doc.data() };

    return NextResponse.json({ 
      success: true, 
      requestId, 
      vertical
    });

  } catch (error) {
    console.error('[catalog.verticals.get] error', { requestId, error });
    return NextResponse.json({ 
      success: false, 
      code: 'SERVER_ERROR', 
      message: 'Failed to fetch vertical', 
      requestId 
    }, { status: 500 });
  }
}
