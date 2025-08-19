import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';
import type { UnifiedUser } from '@/types/unified-user';

// نوع محلي للتوفر الأسبوعي يدعم فترات الاستراحة
interface ExtendedWeeklyAvailability {
  day: string;
  available: boolean;
  startTime?: string;
  endTime?: string;
  breakStart?: string;
  breakEnd?: string;
}

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

// GET /api/creators/availability - جلب التوفر الأسبوعي للمبدع
export async function GET() {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح', requestId },
        { status: 401 }
      );
    }

    // البحث في مجموعة المستخدمين الموحدة
    const userSnap = await adminDb.collection('users')
      .where('email', '==', session.user.email.toLowerCase())
      .where('role', '==', 'creator')
      .limit(1)
      .get();

    if (userSnap.empty) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود أو ليس مبدعاً', requestId },
        { status: 404 }
      );
    }

    const userDoc = userSnap.docs[0];
    const userData = userDoc.data() as UnifiedUser;
    const availabilityObj = userData.creatorProfile?.availability;
    const weeklyAvailability = availabilityObj?.weeklyAvailability || [];
    const timeZone = availabilityObj?.timeZone || 'Asia/Baghdad';
    const urgentWork = availabilityObj?.urgentWork || false;

    return NextResponse.json({
      success: true,
      requestId,
      data: {
        weeklyAvailability,
        timeZone,
        urgentWork
      }
    });

  } catch (error) {
    console.error('[GET /api/creators/availability] Error:', error);
    return NextResponse.json(
      { success: false, error: 'خطأ في الخادم', requestId },
      { status: 500 }
    );
  }
}

// PUT /api/creators/availability - تحديث التوفر الأسبوعي
export async function PUT(req: NextRequest) {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح', requestId },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = UpdateAvailabilitySchema.parse(body);

    // البحث عن المبدع في النظام الموحد
    const userSnap = await adminDb.collection('users')
      .where('email', '==', session.user.email.toLowerCase())
      .where('role', '==', 'creator')
      .limit(1)
      .get();

    if (userSnap.empty) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود أو ليس مبدعاً', requestId },
        { status: 404 }
      );
    }
    const userDoc = userSnap.docs[0];
    const creatorId = userDoc.id;

    // حساب إجمالي الساعات الأسبوعية
  const calculateWeeklyHours = (availability: ExtendedWeeklyAvailability[]): number => {
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

    // تحديث بيانات المبدع في النظام الموحد
    const updateData = {
      'creatorProfile.availability.weeklyAvailability': validatedData.weeklyAvailability,
      'creatorProfile.availability.weeklyHours': weeklyHours,
      'creatorProfile.availability.timeZone': validatedData.timeZone,
      'creatorProfile.availability.urgentWork': validatedData.urgentWork,
      'updatedAt': new Date().toISOString(),
      'creatorProfile.lastAvailabilityUpdate': new Date().toISOString()
    } as Record<string, unknown>;

    await adminDb.collection('users').doc(creatorId).update(updateData);

    // إنشاء سجل في تاريخ التحديثات
    await adminDb.collection('creator_availability_history').add({
      creatorId,
      weeklyAvailability: validatedData.weeklyAvailability,
      weeklyHours,
      timeZone: validatedData.timeZone,
      urgentWork: validatedData.urgentWork,
      updatedAt: new Date().toISOString(),
      updatedBy: session.user.email,
      source: 'creator_dashboard'
    });

    return NextResponse.json({
      success: true,
      requestId,
      data: {
        weeklyAvailability: validatedData.weeklyAvailability,
        weeklyHours,
        timeZone: validatedData.timeZone,
        urgentWork: validatedData.urgentWork,
        message: 'تم تحديث التوفر بنجاح'
      }
    });

  } catch (error) {
    console.error('[PUT /api/creators/availability] Error:', error);
    
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

// POST /api/creators/availability/bulk - تحديث مجمع للتوفر (للإدارة)
export async function POST(req: NextRequest) {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح', requestId },
        { status: 401 }
      );
    }

    // التحقق من صلاحيات الإدارة عبر المستخدم الموحد
    const adminSnap = await adminDb.collection('users')
      .where('email', '==', session.user.email.toLowerCase())
      .where('role', '==', 'admin')
      .limit(1)
      .get();
    if (adminSnap.empty) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح - صلاحيات إدارية مطلوبة', requestId },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { creatorIds, weeklyAvailability, timeZone, urgentWork } = body;

    if (!Array.isArray(creatorIds) || creatorIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'معرفات المبدعين مطلوبة', requestId },
        { status: 400 }
      );
    }

    // تحديث مجمع للمبدعين
    const batch = adminDb.batch();
    const results = [];

  for (const creatorId of creatorIds) {
      const creatorRef = adminDb.collection('users').doc(creatorId);
      const weeklyHours = calculateWeeklyHours(weeklyAvailability);

      batch.update(creatorRef, {
        'creatorProfile.availability.weeklyAvailability': weeklyAvailability,
        'creatorProfile.availability.weeklyHours': weeklyHours,
        'creatorProfile.availability.timeZone': timeZone,
        'creatorProfile.availability.urgentWork': urgentWork,
        'updatedAt': new Date().toISOString(),
        'creatorProfile.lastAvailabilityUpdate': new Date().toISOString()
      });

      results.push({ creatorId, weeklyHours });
    }

    await batch.commit();

    return NextResponse.json({
      success: true,
      requestId,
      data: {
        updatedCreators: results.length,
        results,
        message: `تم تحديث التوفر لـ ${results.length} مبدع`
      }
    });

  } catch (error) {
    console.error('[POST /api/creators/availability/bulk] Error:', error);
    return NextResponse.json(
      { success: false, error: 'خطأ في الخادم', requestId },
      { status: 500 }
    );
  }
}

// دالة مساعدة لحساب الساعات الأسبوعية
function calculateWeeklyHours(availability: ExtendedWeeklyAvailability[]): number {
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
}
