import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';

// Schema للتحديث
const SubcategoryUpdateSchema = z.object({
  categoryId: z.enum(['photo', 'video', 'design']).optional(),
  nameAr: z.string().min(1).optional(),
  nameEn: z.string().optional(),
  desc: z.string().optional(),
  priceRangeKey: z.string().optional()
});

// تحديث فئة فرعية
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
    const validatedData = SubcategoryUpdateSchema.parse(body);

    // التحقق من وجود الفئة الفرعية
    const docRef = adminDb.collection('catalog_subcategories').doc(id);
    const existingDoc = await docRef.get();
    
    if (!existingDoc.exists) {
      return NextResponse.json({ 
        success: false, 
        code: 'NOT_FOUND', 
        message: 'الفئة الفرعية غير موجودة', 
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
    const updatedSubcategory = { id: updatedDoc.id, ...updatedDoc.data() };

    return NextResponse.json({ 
      success: true, 
      requestId, 
      subcategory: updatedSubcategory,
      message: 'تم تحديث الفئة الفرعية بنجاح'
    });

  } catch (error) {
    console.error('[catalog.subcategories.update] error', { requestId, error });
    
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
      message: 'Failed to update subcategory', 
      requestId 
    }, { status: 500 });
  }
}

// حذف فئة فرعية
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

    // التحقق من وجود الفئة الفرعية
    const docRef = adminDb.collection('catalog_subcategories').doc(id);
    const existingDoc = await docRef.get();
    
    if (!existingDoc.exists) {
      return NextResponse.json({ 
        success: false, 
        code: 'NOT_FOUND', 
        message: 'الفئة الفرعية غير موجودة', 
        requestId 
      }, { status: 404 });
    }

    // التحقق من عدم وجود عروض أسعار مرتبطة بهذه الفئة
    // نعتمد على فهرس مسطّح `quote_lines` بدلاً من collectionGroup غير الموجود
    const linkedLinesSnap = await adminDb
      .collection('quote_lines')
      .where('subcategoryId', '==', id)
      .limit(1)
      .get();

    if (!linkedLinesSnap.empty) {
      return NextResponse.json({ 
        success: false, 
        code: 'CONSTRAINT_VIOLATION', 
        message: 'لا يمكن حذف الفئة الفرعية لوجود عروض أسعار مرتبطة بها', 
        requestId 
      }, { status: 400 });
    }

    // حذف الفئة الفرعية
    await docRef.delete();

    return NextResponse.json({ 
      success: true, 
      requestId, 
      message: 'تم حذف الفئة الفرعية بنجاح'
    });

  } catch (error) {
    console.error('[catalog.subcategories.delete] error', { requestId, error });
    return NextResponse.json({ 
      success: false, 
      code: 'SERVER_ERROR', 
      message: 'Failed to delete subcategory', 
      requestId 
    }, { status: 500 });
  }
}

// الحصول على فئة فرعية واحدة
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  try {
    const { id } = await params;

    const docRef = adminDb.collection('catalog_subcategories').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return NextResponse.json({ 
        success: false, 
        code: 'NOT_FOUND', 
        message: 'الفئة الفرعية غير موجودة', 
        requestId 
      }, { status: 404 });
    }

    const subcategory = { id: doc.id, ...doc.data() };

    return NextResponse.json({ 
      success: true, 
      requestId, 
      subcategory
    });

  } catch (error) {
    console.error('[catalog.subcategories.get] error', { requestId, error });
    return NextResponse.json({ 
      success: false, 
      code: 'SERVER_ERROR', 
      message: 'Failed to fetch subcategory', 
      requestId 
    }, { status: 500 });
  }
}
