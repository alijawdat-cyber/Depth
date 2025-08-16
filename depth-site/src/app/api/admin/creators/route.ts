import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';
import { 
  Creator, 
  CreatorsListResponse, 
  CreateCreatorRequest,
  CreatorsStats 
} from '@/types/creators';

// Schema للتحقق من صحة بيانات المبدع
const CreateCreatorSchema = z.object({
  fullName: z.string().min(1, 'الاسم الكامل مطلوب'),
  role: z.enum(['photographer', 'videographer', 'designer', 'producer']),
  contact: z.object({
    email: z.string().email('بريد إلكتروني غير صحيح'),
    whatsapp: z.string().min(1, 'رقم واتساب مطلوب'),
    instagram: z.string().optional()
  }),
  city: z.string().min(1, 'المدينة مطلوبة'),
  canTravel: z.boolean(),
  languages: z.array(z.string()).min(1, 'يجب تحديد لغة واحدة على الأقل'),
  skills: z.array(z.object({
    subcategoryId: z.string(),
    proficiency: z.enum(['beginner', 'intermediate', 'pro']),
    notes: z.string().optional(),
    verified: z.boolean().optional()
  })).optional(),
  verticals: z.array(z.string()).optional(),
  equipment: z.object({
    cameras: z.array(z.object({
      name: z.string(),
      model: z.string().optional(),
      quantity: z.number().min(1),
      condition: z.enum(['excellent', 'good', 'fair']),
      notes: z.string().optional()
    })).optional(),
    lenses: z.array(z.object({
      name: z.string(),
      model: z.string().optional(),
      quantity: z.number().min(1),
      condition: z.enum(['excellent', 'good', 'fair']),
      notes: z.string().optional()
    })).optional(),
    lighting: z.array(z.object({
      name: z.string(),
      model: z.string().optional(),
      quantity: z.number().min(1),
      condition: z.enum(['excellent', 'good', 'fair']),
      notes: z.string().optional()
    })).optional(),
    audio: z.array(z.object({
      name: z.string(),
      model: z.string().optional(),
      quantity: z.number().min(1),
      condition: z.enum(['excellent', 'good', 'fair']),
      notes: z.string().optional()
    })).optional(),
    accessories: z.array(z.object({
      name: z.string(),
      model: z.string().optional(),
      quantity: z.number().min(1),
      condition: z.enum(['excellent', 'good', 'fair']),
      notes: z.string().optional()
    })).optional(),
    specialSetups: z.array(z.string()).optional()
  }).optional(),
  capacity: z.object({
    maxAssetsPerDay: z.number().min(1).optional(),
    availableDays: z.array(z.string()).optional(),
    peakHours: z.string().optional(),
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
  }).optional()
});

// الحصول على قائمة المبدعين مع الإحصائيات
export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const role_filter = searchParams.get('role') || undefined;
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // بناء الاستعلام
    let query = adminDb.collection('creators')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .offset(offset);

    if (status) {
      query = query.where('status', '==', status);
    }
    if (role_filter) {
      query = query.where('role', '==', role_filter);
    }

    // تنفيذ الاستعلام
    const snapshot = await query.get();
    const creators: Creator[] = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      creators.push({
        id: doc.id,
        ...data
      } as Creator);
    });

    // حساب الإحصائيات
    const stats = await calculateCreatorsStats();

    const response: CreatorsListResponse = {
      creators,
      total: stats.total,
      stats
    };

    return NextResponse.json({ 
      success: true, 
      requestId,
      ...response
    });

  } catch (error) {
    console.error('[admin.creators] GET error', { requestId, error });
    return NextResponse.json({ 
      success: false, 
      code: 'SERVER_ERROR', 
      message: 'Failed to fetch creators', 
      requestId 
    }, { status: 500 });
  }
}

// إنشاء مبدع جديد
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
    const validatedData = CreateCreatorSchema.parse(body);

    // التحقق من عدم وجود بريد مكرر
    const existingCreatorQuery = await adminDb
      .collection('creators')
      .where('contact.email', '==', validatedData.contact.email)
      .limit(1)
      .get();

    if (!existingCreatorQuery.empty) {
      return NextResponse.json({ 
        success: false, 
        code: 'DUPLICATE_EMAIL', 
        message: 'بريد إلكتروني موجود مسبقاً', 
        requestId 
      }, { status: 400 });
    }

    // إنشاء المبدع الجديد
    const now = new Date().toISOString();
    const newCreator: Omit<Creator, 'id'> = {
      ...validatedData,
      skills: validatedData.skills || [],
      verticals: validatedData.verticals || [],
      equipment: {
        cameras: validatedData.equipment?.cameras || [],
        lenses: validatedData.equipment?.lenses || [],
        lighting: validatedData.equipment?.lighting || [],
        audio: validatedData.equipment?.audio || [],
        accessories: validatedData.equipment?.accessories || [],
        specialSetups: validatedData.equipment?.specialSetups || []
      },
      capacity: {
        maxAssetsPerDay: validatedData.capacity?.maxAssetsPerDay || 10,
        availableDays: validatedData.capacity?.availableDays || [],
        peakHours: validatedData.capacity?.peakHours,
        standardSLA: validatedData.capacity?.standardSLA || 48,
        rushSLA: validatedData.capacity?.rushSLA || 24
      },
      compliance: {
        clinicsTraining: validatedData.compliance?.clinicsTraining || false,
        ndaSigned: validatedData.compliance?.ndaSigned || false,
        equipmentAgreement: validatedData.compliance?.equipmentAgreement || false
      },
      internalCost: validatedData.internalCost || {},
      status: 'registered',
      createdAt: now,
      updatedAt: now,
      createdBy: session.user.email
    };

    // حفظ في قاعدة البيانات
    const docRef = await adminDb.collection('creators').add(newCreator);

    return NextResponse.json({ 
      success: true, 
      requestId,
      creator: { id: docRef.id, ...newCreator },
      message: 'تم إنشاء المبدع بنجاح'
    });

  } catch (error) {
    console.error('[admin.creators] POST error', { requestId, error });
    
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
      message: 'Failed to create creator', 
      requestId 
    }, { status: 500 });
  }
}

// حساب إحصائيات المبدعين
async function calculateCreatorsStats(): Promise<CreatorsStats> {
  try {
    const snapshot = await adminDb.collection('creators').get();
    const creators = snapshot.docs.map(doc => doc.data() as Creator);

    const stats: CreatorsStats = {
      total: creators.length,
      byStatus: {
        registered: 0,
        intake_submitted: 0,
        under_review: 0,
        approved: 0,
        rejected: 0,
        restricted: 0
      },
      byRole: {
        photographer: 0,
        videographer: 0,
        designer: 0,
        producer: 0
      },
      byTier: {
        T1: 0,
        T2: 0,
        T3: 0,
        unassigned: 0
      },
      averageScore: 0,
      lastUpdated: new Date().toISOString()
    };

    let totalScore = 0;
    let scoredCreators = 0;

    creators.forEach(creator => {
      // حساب الحالات
      stats.byStatus[creator.status]++;
      
      // حساب الأدوار
      stats.byRole[creator.role]++;
      
      // حساب الدرجات
      if (creator.tier) {
        stats.byTier[creator.tier]++;
      } else {
        stats.byTier.unassigned++;
      }
      
      // حساب متوسط النقاط
      if (creator.score) {
        totalScore += creator.score;
        scoredCreators++;
      }
    });

    if (scoredCreators > 0) {
      stats.averageScore = Math.round(totalScore / scoredCreators);
    }

    return stats;
  } catch (error) {
    console.error('Error calculating creators stats:', error);
    return {
      total: 0,
      byStatus: {
        registered: 0,
        intake_submitted: 0,
        under_review: 0,
        approved: 0,
        rejected: 0,
        restricted: 0
      },
      byRole: {
        photographer: 0,
        videographer: 0,
        designer: 0,
        producer: 0
      },
      byTier: {
        T1: 0,
        T2: 0,
        T3: 0,
        unassigned: 0
      },
      averageScore: 0,
      lastUpdated: new Date().toISOString()
    };
  }
}
