import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';
import { Creator } from '@/types/creators';

// Schema للتحديث
const UpdateCreatorSchema = z.object({
  fullName: z.string().min(1).optional(),
  role: z.enum(['photographer', 'videographer', 'designer', 'producer']).optional(),
  contact: z.object({
    email: z.string().email().optional(),
    whatsapp: z.string().min(1).optional(),
    instagram: z.string().optional()
  }).optional(),
  city: z.string().min(1).optional(),
  canTravel: z.boolean().optional(),
  languages: z.array(z.string()).optional(),
  status: z.enum(['registered', 'intake_submitted', 'under_review', 'approved', 'rejected', 'restricted']).optional(),
  skills: z.array(z.object({
    subcategoryId: z.string(),
    proficiency: z.enum(['beginner', 'intermediate', 'pro']),
    notes: z.string().optional(),
    verified: z.boolean().optional()
  })).optional(),
  verticals: z.array(z.string()).optional(),
  equipment: z.array(z.object({
    catalogId: z.string(),
    owned: z.boolean(),
    quantity: z.number().min(1),
    condition: z.enum(['excellent', 'good', 'fair', 'poor']),
    notes: z.string().optional()
  })).optional(),
  capacity: z.object({
    maxAssetsPerDay: z.number().min(1).optional(),
    weeklyAvailability: z.array(z.object({
      day: z.enum(['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']),
      available: z.boolean(),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      breakStart: z.string().optional(),
      breakEnd: z.string().optional()
    })).optional(),
    standardSLA: z.number().min(1).optional(),
    rushSLA: z.number().min(1).optional()
  }).optional(),
  compliance: z.object({
    clinicsTraining: z.boolean().optional(),
    ndaSigned: z.boolean().optional(),
    equipmentAgreement: z.boolean().optional()
  }).optional(),
  internalCost: z.object({
    photoPerAsset: z.number().min(0).optional(),
    reelPerAsset: z.number().min(0).optional(),
    dayRate: z.number().min(0).optional()
  }).optional(),
  tier: z.enum(['T1', 'T2', 'T3']).optional(),
  modifier: z.number().optional(),
  score: z.number().min(0).max(100).optional()
});

// الحصول على مبدع واحد
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

    const docRef = adminDb.collection('creators').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return NextResponse.json({ 
        success: false, 
        code: 'NOT_FOUND', 
        message: 'المبدع غير موجود', 
        requestId 
      }, { status: 404 });
    }

    const creator: Creator = { id: doc.id, ...doc.data() } as Creator;

    return NextResponse.json({ 
      success: true, 
      requestId, 
      creator
    });

  } catch (error) {
    console.error('[admin.creators.get] error', { requestId, error });
    return NextResponse.json({ 
      success: false, 
      code: 'SERVER_ERROR', 
      message: 'Failed to fetch creator', 
      requestId 
    }, { status: 500 });
  }
}

// تحديث مبدع
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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
    const validatedData = UpdateCreatorSchema.parse(body);

    // التحقق من وجود المبدع
    const docRef = adminDb.collection('creators').doc(id);
    const existingDoc = await docRef.get();
    
    if (!existingDoc.exists) {
      return NextResponse.json({ 
        success: false, 
        code: 'NOT_FOUND', 
        message: 'المبدع غير موجود', 
        requestId 
      }, { status: 404 });
    }

    // التحقق من البريد الإلكتروني إذا تم تغييره
    if (validatedData.contact?.email) {
      const existingCreator = existingDoc.data() as Creator;
      if (validatedData.contact.email !== existingCreator.contact.email) {
        const duplicateEmailQuery = await adminDb
          .collection('creators')
          .where('contact.email', '==', validatedData.contact.email)
          .limit(1)
          .get();

        if (!duplicateEmailQuery.empty) {
          return NextResponse.json({ 
            success: false, 
            code: 'DUPLICATE_EMAIL', 
            message: 'بريد إلكتروني موجود مسبقاً', 
            requestId 
          }, { status: 400 });
        }
      }
    }

    // تحديث البيانات
    const updateData = {
      ...validatedData,
      updatedAt: new Date().toISOString(),
      updatedBy: session.user.email
    };

    // دمج البيانات الحالية مع الجديدة للحقول المعقدة
    const currentData = existingDoc.data() as Creator;
    if (validatedData.contact) {
      updateData.contact = { ...currentData.contact, ...validatedData.contact };
    }
    if (validatedData.equipment) {
      updateData.equipment = validatedData.equipment; // equipment صار array، لا نحتاج دمج
    }
    if (validatedData.capacity) {
      updateData.capacity = { ...currentData.capacity, ...validatedData.capacity };
    }
    if (validatedData.compliance) {
      updateData.compliance = { ...currentData.compliance, ...validatedData.compliance };
    }
    if (validatedData.internalCost) {
      updateData.internalCost = { ...currentData.internalCost, ...validatedData.internalCost };
    }

    await docRef.update(updateData);

    // الحصول على البيانات المحدثة
    const updatedDoc = await docRef.get();
    const updatedCreator: Creator = { id: updatedDoc.id, ...updatedDoc.data() } as Creator;

    return NextResponse.json({ 
      success: true, 
      requestId, 
      creator: updatedCreator,
      message: 'تم تحديث المبدع بنجاح'
    });

  } catch (error) {
    console.error('[admin.creators.update] error', { requestId, error });
    
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
      message: 'Failed to update creator', 
      requestId 
    }, { status: 500 });
  }
}

// حذف مبدع
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

    // التحقق من وجود المبدع
    const docRef = adminDb.collection('creators').doc(id);
    const existingDoc = await docRef.get();
    
    if (!existingDoc.exists) {
      return NextResponse.json({ 
        success: false, 
        code: 'NOT_FOUND', 
        message: 'المبدع غير موجود', 
        requestId 
      }, { status: 404 });
    }

    // التحقق من عدم وجود عروض أسعار مرتبطة بهذا المبدع
    const quotesSnapshot = await adminDb
      .collectionGroup('lines')
      .where('assignedTo', '==', id)
      .limit(1)
      .get();

    if (!quotesSnapshot.empty) {
      return NextResponse.json({ 
        success: false, 
        code: 'CONSTRAINT_VIOLATION', 
        message: 'لا يمكن حذف المبدع لوجود عروض أسعار مرتبطة به', 
        requestId 
      }, { status: 400 });
    }

    // حذف المبدع
    await docRef.delete();

    return NextResponse.json({ 
      success: true, 
      requestId, 
      message: 'تم حذف المبدع بنجاح'
    });

  } catch (error) {
    console.error('[admin.creators.delete] error', { requestId, error });
    return NextResponse.json({ 
      success: false, 
      code: 'SERVER_ERROR', 
      message: 'Failed to delete creator', 
      requestId 
    }, { status: 500 });
  }
}
