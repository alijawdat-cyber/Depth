import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getVerticals } from '@/lib/catalog/read';
import { adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';

// Schema للتحقق من صحة بيانات المحور
const VerticalCreateSchema = z.object({
  id: z.string().min(1, 'معرف المحور مطلوب'),
  nameAr: z.string().min(1, 'الاسم العربي مطلوب'),
  nameEn: z.string().optional(),
  modifierPct: z.number().optional()
});

export async function GET() {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  try {
    const items = await getVerticals();
    
    return NextResponse.json({ 
      success: true, 
      requestId, 
      items,
      total: items.length,
      metadata: {
        lastUpdated: new Date().toISOString(),
        source: 'catalog_verticals'
      }
    });
  } catch (error) {
    console.error('[catalog.verticals] error', { requestId, error });
    return NextResponse.json({ success: false, code: 'SERVER_ERROR', message: 'Failed to fetch verticals', requestId }, { status: 500 });
  }
}

// إنشاء محور جديد
export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const validatedData = VerticalCreateSchema.parse(body);

    // التحقق من عدم وجود معرف مكرر
    const existingDoc = await adminDb.collection('catalog_verticals').doc(validatedData.id).get();
    if (existingDoc.exists) {
      return NextResponse.json({ 
        success: false, 
        code: 'DUPLICATE_ID', 
        message: 'معرف المحور موجود مسبقاً', 
        requestId 
      }, { status: 400 });
    }

    // إنشاء المحور
    const verticalData = {
      ...validatedData,
      createdAt: new Date().toISOString(),
      createdBy: session.user.email,
      updatedAt: new Date().toISOString()
    };

    await adminDb.collection('catalog_verticals').doc(validatedData.id).set(verticalData);

    return NextResponse.json({ 
      success: true, 
      requestId, 
      vertical: { ...verticalData },
      message: 'تم إنشاء المحور بنجاح'
    });

  } catch (error) {
    console.error('[catalog.verticals.create] error', { requestId, error });
    
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
      message: 'Failed to create vertical', 
      requestId 
    }, { status: 500 });
  }
}


