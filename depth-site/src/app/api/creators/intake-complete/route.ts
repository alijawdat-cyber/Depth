import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

// POST /api/creators/intake-complete
// إرسال نموذج التفاصيل المهنية الكامل للمبدع حسب التوثيق
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مسموح - يتطلب تسجيل الدخول' 
      }, { status: 401 });
    }

    if (session.user.role !== 'creator') {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مسموح - مخصص للمبدعين فقط' 
      }, { status: 403 });
    }

    const body = await req.json();
    const {
      personalInfo,
      skills,
      verticals,
      equipment,
      capacity,
      compliance,
      internalCost,
      rateOverrides,
      selfAssessment,
      portfolio
    } = body;

    // التحقق من صحة البيانات الأساسية
    if (!personalInfo?.fullName?.trim()) {
      return NextResponse.json({ 
        success: false, 
        error: 'الاسم الكامل مطلوب' 
      }, { status: 400 });
    }

    if (!personalInfo?.contact?.whatsapp?.trim()) {
      return NextResponse.json({ 
        success: false, 
        error: 'رقم الواتساب مطلوب' 
      }, { status: 400 });
    }

    if (!capacity?.maxAssetsPerDay || capacity.maxAssetsPerDay <= 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'السعة اليومية مطلوبة' 
      }, { status: 400 });
    }

    // التحقق من الامتثال المطلوب
    if (!compliance?.ndaSigned) {
      return NextResponse.json({ 
        success: false, 
        error: 'توقيع اتفاقية السرية (NDA) مطلوب' 
      }, { status: 400 });
    }

    if (!compliance?.equipmentAgreement) {
      return NextResponse.json({ 
        success: false, 
        error: 'الموافقة على اتفاقية استخدام المعدات مطلوبة' 
      }, { status: 400 });
    }

    const email = session.user.email.toLowerCase();

    // البحث عن المبدع
    const creatorQuery = await adminDb
      .collection('creators')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (creatorQuery.empty) {
      return NextResponse.json({ 
        success: false, 
        error: 'لم يتم العثور على بيانات المبدع' 
      }, { status: 404 });
    }

    const creatorDoc = creatorQuery.docs[0];
    const now = new Date().toISOString();

    // تحديث بيانات المبدع مع النموذج الكامل
    const updateData = {
      // 1) الهوية والتواصل
      fullName: personalInfo.fullName.trim(),
      role: personalInfo.role,
      city: personalInfo.city.trim(),
      canTravel: personalInfo.canTravel || false,
      languages: personalInfo.languages || ['ar'],
      contact: {
        email: email,
        whatsapp: personalInfo.contact.whatsapp.trim(),
        instagram: personalInfo.contact.instagram?.trim() || null
      },

      // 2) Skills Matrix (حسب الكتالوغ)
      skills: skills || {},

      // 3) المحاور المفضلة
      verticals: verticals || [],

      // 4) المعدات
      equipment: {
        cameras: equipment?.cameras || [],
        lenses: equipment?.lenses || [],
        lighting: equipment?.lighting || [],
        audio: equipment?.audio || [],
        accessories: equipment?.accessories || [],
        specialSetups: equipment?.specialSetups || []
      },

      // 5) السعة والزمن
      capacity: {
        maxAssetsPerDay: capacity.maxAssetsPerDay,
        availableDays: capacity.availableDays || [],
        peakHours: capacity.peakHours || null,
        standardSLA: capacity.standardSLA || 48,
        rushSLA: capacity.rushSLA || 24
      },

      // 6) الامتثال
      compliance: {
        clinicsTraining: compliance.clinicsTraining || false,
        ndaSigned: compliance.ndaSigned,
        equipmentAgreement: compliance.equipmentAgreement
      },

      // 7) الكلفة الداخلية
      internalCost: {
        photoPerAsset: internalCost?.photoPerAsset || null,
        reelPerAsset: internalCost?.reelPerAsset || null,
        dayRate: internalCost?.dayRate || null
      },

      // 8) التسعير الفردي (Draft)
      rateOverrides: rateOverrides || {},

      // 9) الجودة والانضباط
      selfAssessment: {
        onTimePercentage: selfAssessment?.onTimePercentage || 95,
        firstPassPercentage: selfAssessment?.firstPassPercentage || 90,
        notes: selfAssessment?.notes?.trim() || null,
        risks: selfAssessment?.risks?.trim() || null
      },

      // 10) مرفقات
      portfolio: {
        portfolioLinks: portfolio?.portfolioLinks || [],
        certificates: portfolio?.certificates || [],
        samples: portfolio?.samples || []
      },

      // معلومات النظام
      status: 'intake_submitted',
      updatedAt: now,
      intakeFormCompleted: true,
      intakeCompletedAt: now,
      intakeVersion: 'complete_v1' // للتمييز عن النموذج القديم
    };

    await creatorDoc.ref.update(updateData);

    // تسجيل العملية في audit log
    await adminDb.collection('audit_log').add({
      action: 'creator_intake_complete_submitted',
      entityType: 'creator',
      entityId: creatorDoc.id,
      userId: email,
      timestamp: now,
      details: {
        fullName: personalInfo.fullName,
        role: personalInfo.role,
        city: personalInfo.city,
        skillsCount: Object.keys(skills || {}).length,
        verticalsCount: (verticals || []).length,
        equipmentCategories: Object.keys(equipment || {}).length,
        maxAssetsPerDay: capacity.maxAssetsPerDay,
        complianceComplete: compliance.ndaSigned && compliance.equipmentAgreement,
        portfolioLinksCount: (portfolio?.portfolioLinks || []).length
      }
    });

    // إشعار الأدمن بالنموذج الجديد
    try {
      await adminDb.collection('notifications').add({
        type: 'creator_intake_complete',
        title: 'نموذج مبدع كامل جديد',
        message: `${personalInfo.fullName} أكمل النموذج الكامل وجاهز للمراجعة`,
        targetRole: 'admin',
        entityType: 'creator',
        entityId: creatorDoc.id,
        createdAt: now,
        read: false,
        priority: 'high'
      });
    } catch (error) {
      console.warn('[intake-complete] Failed to create notification:', error);
    }

    return NextResponse.json({
      success: true,
      message: 'تم إرسال النموذج الكامل بنجاح',
      creatorId: creatorDoc.id,
      status: 'intake_submitted'
    }, { status: 200 });

  } catch (error) {
    console.error('[creators.intake-complete] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في الخادم'
    }, { status: 500 });
  }
}

// GET /api/creators/intake-complete
// جلب بيانات النموذج الكامل للمبدع (للتعديل)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مسموح - يتطلب تسجيل الدخول' 
      }, { status: 401 });
    }

    if (session.user.role !== 'creator') {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مسموح - مخصص للمبدعين فقط' 
      }, { status: 403 });
    }

    const email = session.user.email.toLowerCase();

    // البحث عن المبدع
    const creatorQuery = await adminDb
      .collection('creators')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (creatorQuery.empty) {
      return NextResponse.json({ 
        success: false, 
        error: 'لم يتم العثور على بيانات المبدع' 
      }, { status: 404 });
    }

    const creatorDoc = creatorQuery.docs[0];
    const creatorData = creatorDoc.data();

    // إرجاع البيانات بالتنسيق المطلوب للنموذج
    const formData = {
      personalInfo: {
        fullName: creatorData.fullName || '',
        role: creatorData.role || 'photographer',
        city: creatorData.city || '',
        canTravel: creatorData.canTravel || false,
        languages: creatorData.languages || ['ar'],
        contact: {
          email: creatorData.contact?.email || email,
          whatsapp: creatorData.contact?.whatsapp || '',
          instagram: creatorData.contact?.instagram || ''
        }
      },
      skills: creatorData.skills || {},
      verticals: creatorData.verticals || [],
      equipment: creatorData.equipment || {
        cameras: [],
        lenses: [],
        lighting: [],
        audio: [],
        accessories: [],
        specialSetups: []
      },
      capacity: creatorData.capacity || {
        maxAssetsPerDay: 10,
        availableDays: [],
        standardSLA: 48,
        rushSLA: 24
      },
      compliance: creatorData.compliance || {
        clinicsTraining: false,
        ndaSigned: false,
        equipmentAgreement: false
      },
      internalCost: creatorData.internalCost || {},
      rateOverrides: creatorData.rateOverrides || {},
      selfAssessment: creatorData.selfAssessment || {
        onTimePercentage: 95,
        firstPassPercentage: 90
      },
      portfolio: creatorData.portfolio || {
        portfolioLinks: [],
        certificates: [],
        samples: []
      }
    };

    return NextResponse.json({
      success: true,
      formData,
      status: creatorData.status,
      intakeFormCompleted: creatorData.intakeFormCompleted || false,
      intakeCompletedAt: creatorData.intakeCompletedAt || null
    });

  } catch (error) {
    console.error('[creators.intake-complete.get] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في الخادم'
    }, { status: 500 });
  }
}
