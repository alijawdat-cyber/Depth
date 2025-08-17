import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';
import type { WeeklyAvailability } from '@/types/creators';

// Schema للتحقق من بيانات التوفر الأسبوعي
const WeeklyAvailabilitySchema = z.object({
  day: z.enum(['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']),
  available: z.boolean(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  breakStart: z.string().optional(),
  breakEnd: z.string().optional()
});

const UpdateAvailabilitySchema = z.object({
  weeklyAvailability: z.array(WeeklyAvailabilitySchema),
  timeZone: z.string().default('Asia/Baghdad'),
  urgentWork: z.boolean().default(false)
});

// GET /api/creators/[id]/availability - جلب التوفر لمبدع محدد (للإدارة)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح', requestId },
        { status: 401 }
      );
    }

    // التحقق من صلاحيات الإدارة
    const user = await adminDb.collection('users').doc(session.user.email).get();
    const isAdmin = user.exists && user.data()?.role === 'admin';
    
    const { id: creatorId } = await params;

    // إذا لم يكن إدارياً، تحقق من أنه المبدع نفسه
    if (!isAdmin) {
      const creatorDoc = await adminDb.collection('creators').doc(creatorId).get();
      if (!creatorDoc.exists || creatorDoc.data()?.contact?.email !== session.user.email) {
        return NextResponse.json(
          { success: false, error: 'غير مصرح للوصول لهذا المبدع', requestId },
          { status: 403 }
        );
      }
    }

    // جلب بيانات المبدع
    const creatorDoc = await adminDb.collection('creators').doc(creatorId).get();
    
    if (!creatorDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'المبدع غير موجود', requestId },
        { status: 404 }
      );
    }

    const creatorData = creatorDoc.data();

    // استخراج بيانات التوفر
    const weeklyAvailability = creatorData?.capacity?.weeklyAvailability || [];
    const timeZone = creatorData?.timeZone || 'Asia/Baghdad';
    const urgentWork = creatorData?.urgentWork || false;

    return NextResponse.json({
      success: true,
      requestId,
      data: {
        creatorId,
        weeklyAvailability,
        timeZone,
        urgentWork,
        lastUpdated: creatorData?.updatedAt,
        creatorName: creatorData?.fullName
      }
    });

  } catch (error) {
    console.error('[GET /api/creators/[id]/availability] Error:', error);
    return NextResponse.json(
      { success: false, error: 'خطأ في الخادم', requestId },
      { status: 500 }
    );
  }
}

// PUT /api/creators/[id]/availability - تحديث التوفر لمبدع محدد
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح', requestId },
        { status: 401 }
      );
    }

    const { id: creatorId } = await params;
    const body = await req.json();
    const validatedData = UpdateAvailabilitySchema.parse(body);

    // التحقق من صلاحيات الإدارة أو الملكية
    const user = await adminDb.collection('users').doc(session.user.email).get();
    const isAdmin = user.exists && user.data()?.role === 'admin';
    
    if (!isAdmin) {
      const creatorDoc = await adminDb.collection('creators').doc(creatorId).get();
      if (!creatorDoc.exists || creatorDoc.data()?.contact?.email !== session.user.email) {
        return NextResponse.json(
          { success: false, error: 'غير مصرح للتعديل على هذا المبدع', requestId },
          { status: 403 }
        );
      }
    }

    // حساب إجمالي الساعات الأسبوعية
    const calculateWeeklyHours = (availability: WeeklyAvailability[]): number => {
      return availability.reduce((total, dayData) => {
        if (!dayData.available || !dayData.startTime || !dayData.endTime) return total;
        
        const start = new Date(`2000-01-01T${dayData.startTime}`);
        const end = new Date(`2000-01-01T${dayData.endTime}`);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        
        // خصم وقت الاستراحة إذا موجود
        let breakHours = 0;
        if (dayData.breakStart && dayData.breakEnd) {
          const breakStart = new Date(`2000-01-01T${dayData.breakStart}`);
          const breakEnd = new Date(`2000-01-01T${dayData.breakEnd}`);
          breakHours = (breakEnd.getTime() - breakStart.getTime()) / (1000 * 60 * 60);
        }
        
        return total + Math.max(0, hours - breakHours);
      }, 0);
    };

    const weeklyHours = calculateWeeklyHours(validatedData.weeklyAvailability);

    // تحديث بيانات المبدع
    const updateData = {
      'capacity.weeklyAvailability': validatedData.weeklyAvailability,
      'capacity.weeklyHours': weeklyHours,
      'timeZone': validatedData.timeZone,
      'urgentWork': validatedData.urgentWork,
      'updatedAt': new Date().toISOString(),
      'lastAvailabilityUpdate': new Date().toISOString()
    };

    await adminDb.collection('creators').doc(creatorId).update(updateData);

    // إنشاء سجل في تاريخ التحديثات
    await adminDb.collection('creator_availability_history').add({
      creatorId,
      weeklyAvailability: validatedData.weeklyAvailability,
      weeklyHours,
      timeZone: validatedData.timeZone,
      urgentWork: validatedData.urgentWork,
      updatedAt: new Date().toISOString(),
      updatedBy: session.user.email,
      source: isAdmin ? 'admin_dashboard' : 'creator_dashboard',
      isAdminUpdate: isAdmin
    });

    return NextResponse.json({
      success: true,
      requestId,
      data: {
        creatorId,
        weeklyAvailability: validatedData.weeklyAvailability,
        weeklyHours,
        timeZone: validatedData.timeZone,
        urgentWork: validatedData.urgentWork,
        message: 'تم تحديث التوفر بنجاح'
      }
    });

  } catch (error) {
    console.error('[PUT /api/creators/[id]/availability] Error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'بيانات غير صحيحة', 
          details: error.issues,
          requestId 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'خطأ في الخادم', requestId },
      { status: 500 }
    );
  }
}
