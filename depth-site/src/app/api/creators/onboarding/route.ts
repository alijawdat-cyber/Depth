// API موحد لنظام الـ Onboarding الاحترافي
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
// import { FieldValue } from 'firebase-admin/firestore'; // غير مستخدم حالياً
import bcrypt from 'bcryptjs';
import type { 
  OnboardingFormData, 
  SubmitOnboardingRequest,
  OnboardingApiResponse 
} from '@/types/onboarding';

// POST /api/creators/onboarding
// إرسال نموذج الـ Onboarding الكامل
export async function POST(req: NextRequest) {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  
  try {
    const body: SubmitOnboardingRequest = await req.json();
    const { formData, skipOptionalSteps } = body;

    // التحقق من البيانات الأساسية
    if (!formData.account.fullName?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'الاسم الكامل مطلوب',
        requestId
      } as OnboardingApiResponse, { status: 400 });
    }

    if (!formData.account.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.account.email)) {
      return NextResponse.json({
        success: false,
        error: 'البريد الإلكتروني غير صحيح',
        requestId
      } as OnboardingApiResponse, { status: 400 });
    }

    if (!formData.account.password || formData.account.password.length < 8) {
      return NextResponse.json({
        success: false,
        error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
        requestId
      } as OnboardingApiResponse, { status: 400 });
    }

    if (formData.account.password !== formData.account.confirmPassword) {
      return NextResponse.json({
        success: false,
        error: 'كلمات المرور غير متطابقة',
        requestId
      } as OnboardingApiResponse, { status: 400 });
    }

    if (!formData.account.agreeToTerms) {
      return NextResponse.json({
        success: false,
        error: 'يجب الموافقة على شروط الخدمة',
        requestId
      } as OnboardingApiResponse, { status: 400 });
    }

    // التحقق من بيانات التوفر
    if (!formData.availability?.availability) {
      return NextResponse.json({
        success: false,
        error: 'نوع التوفر مطلوب',
        requestId
      } as OnboardingApiResponse, { status: 400 });
    }

    if (!formData.availability.weeklyHours || formData.availability.weeklyHours <= 0) {
      return NextResponse.json({
        success: false,
        error: 'عدد الساعات الأسبوعية مطلوب',
        requestId
      } as OnboardingApiResponse, { status: 400 });
    }

    // التحقق من وجود أيام عمل
    const hasWeeklyAvailability = formData.availability.weeklyAvailability && 
      formData.availability.weeklyAvailability.some(day => day.available);
    const hasPreferredWorkdays = formData.availability.preferredWorkdays && 
      formData.availability.preferredWorkdays.length > 0;
    
    if (!hasWeeklyAvailability && !hasPreferredWorkdays) {
      return NextResponse.json({
        success: false,
        error: 'يجب اختيار يوم واحد على الأقل للعمل',
        requestId
      } as OnboardingApiResponse, { status: 400 });
    }

    // التحقق من المعلومات الأساسية
    if (!formData.basicInfo.role || !formData.basicInfo.city?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'التخصص والمدينة مطلوبان',
        requestId
      } as OnboardingApiResponse, { status: 400 });
    }

    if (formData.basicInfo.primaryCategories.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'يجب اختيار مجال واحد على الأقل',
        requestId
      } as OnboardingApiResponse, { status: 400 });
    }

    // التحقق من الخبرة (اجعل التخصصات اختيارية)
    if (!formData.experience.experienceLevel) {
      return NextResponse.json({
        success: false,
        error: 'مستوى الخبرة مطلوب',
        requestId
      } as OnboardingApiResponse, { status: 400 });
    }

    // المعرض اختياري حالياً: لا نمنع الإرسال إذا كانت العينات أقل من 2

    // التحقق من التوفر (مطلوب: النوع + على الأقل يوم واحد سواء من الشبكة أو preferredWorkdays)
    if (!formData.availability.availability) {
      return NextResponse.json({
        success: false,
        error: 'معلومات التوفر مطلوبة',
        requestId
      } as OnboardingApiResponse, { status: 400 });
    }

    const email = formData.account.email.toLowerCase().trim();
    const now = new Date().toISOString();

    // التحقق من عدم وجود بريد مكرر
    const existingCreatorQuery = await adminDb
      .collection('creators')
      .where('email', '==', email)
      .limit(1)
      .get();

    let creatorDoc;
    const isNewCreator = existingCreatorQuery.empty;

    if (isNewCreator) {
      // إنشاء مبدع جديد
      const hashedPassword = await bcrypt.hash(formData.account.password, 12);

      const creatorData = {
        // 1) معلومات الحساب
        fullName: formData.account.fullName.trim(),
        email: email,
        phone: formData.account.phone.trim(),
        password: hashedPassword,

        // 2) المعلومات الأساسية
        role: formData.basicInfo.role,
        city: formData.basicInfo.city.trim(),
        canTravel: formData.basicInfo.canTravel,
        languages: formData.basicInfo.languages,
        primaryCategories: formData.basicInfo.primaryCategories,

        // 3) الخبرة والمهارات
        experienceLevel: formData.experience.experienceLevel,
        experienceYears: formData.experience.experienceYears,
        skills: formData.experience.skills || [], // البنية الجديدة
        specializations: formData.experience.specializations || [], // احتفظ للتوافق
        previousClients: formData.experience.previousClients || [],

        // 4) معرض الأعمال
        portfolio: {
          workSamples: formData.portfolio.workSamples,
          socialMedia: formData.portfolio.socialMedia,
          portfolioUrl: formData.portfolio.portfolioUrl
        },

        // 5) التوفر والسعة
        availability: formData.availability.availability,
        timeZone: formData.availability.timeZone,
        urgentWork: formData.availability.urgentWork,
        capacity: {
          weeklyHours: formData.availability.weeklyHours,
          weeklyAvailability: formData.availability.weeklyAvailability || [],
          maxAssetsPerDay: 10, // قيمة افتراضية
          standardSLA: 72, // 3 أيام
          rushSLA: 24 // يوم واحد
        },
        // احتفظ بالقديم للتوافق
        weeklyHours: formData.availability.weeklyHours,
        preferredWorkdays: formData.availability.preferredWorkdays,

        // 6) المعدات
        equipment: formData.equipment || {
          cameras: [],
          lenses: [],
          lighting: [],
          audio: [],
          accessories: [],
          specialSetups: []
        },

        // معلومات النظام
        status: 'intake_submitted',
        onboardingCompleted: true,
        onboardingCompletedAt: now,
        onboardingVersion: 'unified_v1',
        createdAt: now,
        updatedAt: now,
        createdBy: 'self-onboarding',
        source: formData.metadata.source || 'web',

        // Metadata
        completedSteps: formData.completedSteps,
        skipOptionalSteps: skipOptionalSteps || false
      };

      creatorDoc = await adminDb.collection('creators').add(creatorData);

      console.log('[onboarding] Creator document created successfully:', {
        creatorId: creatorDoc.id,
        email: email,
        weeklyAvailability: creatorData.capacity.weeklyAvailability,
        preferredWorkdays: creatorData.preferredWorkdays
      });

      // إنشاء حساب في NextAuth users collection
      try {
        await adminDb.collection('users').add({
          name: formData.account.fullName.trim(),
          email: email,
          role: 'creator',
          creatorId: creatorDoc.id,
          onboardingStatus: 'completed',
          createdAt: now
        });
        console.log('[onboarding] User record created successfully for:', email);
      } catch (error) {
        console.warn('[onboarding] Failed to create user record:', error);
      }

    } else {
      // تحديث مبدع موجود
      creatorDoc = existingCreatorQuery.docs[0];
      
      const updateData = {
        // تحديث المعلومات (بدون كلمة المرور إذا كان موجود)
        fullName: formData.account.fullName.trim(),
        phone: formData.account.phone.trim(),
        role: formData.basicInfo.role,
        city: formData.basicInfo.city.trim(),
        canTravel: formData.basicInfo.canTravel,
        languages: formData.basicInfo.languages,
        primaryCategories: formData.basicInfo.primaryCategories,
        experienceLevel: formData.experience.experienceLevel,
        experienceYears: formData.experience.experienceYears,
        specializations: formData.experience.specializations,
        previousClients: formData.experience.previousClients || [],
        portfolio: {
          workSamples: formData.portfolio.workSamples,
          socialMedia: formData.portfolio.socialMedia,
          portfolioUrl: formData.portfolio.portfolioUrl
        },
        availability: formData.availability.availability,
        weeklyHours: formData.availability.weeklyHours,
        preferredWorkdays: formData.availability.preferredWorkdays,
        timeZone: formData.availability.timeZone,
        urgentWork: formData.availability.urgentWork,
        status: 'intake_submitted',
        onboardingCompleted: true,
        onboardingCompletedAt: now,
        onboardingVersion: 'unified_v1',
        updatedAt: now,
        completedSteps: formData.completedSteps,
        skipOptionalSteps: skipOptionalSteps || false
      };

      await creatorDoc.ref.update(updateData);
    }

    // تسجيل في audit log
    await adminDb.collection('audit_log').add({
      action: isNewCreator ? 'creator_onboarding_completed' : 'creator_onboarding_updated',
      entityType: 'creator',
      entityId: creatorDoc.id,
      userId: email,
      timestamp: now,
      requestId,
      details: {
        isNewCreator,
        fullName: formData.account.fullName,
        role: formData.basicInfo.role,
        city: formData.basicInfo.city,
        experienceLevel: formData.experience.experienceLevel,
        workSamplesCount: formData.portfolio.workSamples.length,
        weeklyHours: formData.availability.weeklyHours,
        completedSteps: formData.completedSteps.length,
        skipOptionalSteps: skipOptionalSteps || false,
        source: formData.metadata.source || 'web'
      }
    });

    // إشعار الأدمن
    try {
      await adminDb.collection('notifications').add({
        type: 'creator_onboarding_completed',
        title: isNewCreator ? 'مبدع جديد أكمل التسجيل' : 'مبدع حديث ملفه الشخصي',
        message: `${formData.account.fullName} أكمل نموذج الانضمام وجاهز للمراجعة`,
        targetRole: 'admin',
        entityType: 'creator',
        entityId: creatorDoc.id,
        priority: 'high',
        createdAt: now,
        read: false,
        metadata: {
          creatorRole: formData.basicInfo.role,
          creatorCity: formData.basicInfo.city,
          isNewCreator
        }
      });
    } catch (error) {
      console.warn('[onboarding] Failed to create notification:', error);
    }

    // حذف أي بيانات مؤقتة من النماذج القديمة
    try {
      await adminDb.collection('creators_basic').doc(email).delete();
    } catch {
      // لا مشكلة إذا لم يكن موجود
    }

    return NextResponse.json({
      success: true,
      message: isNewCreator 
        ? 'تم إنشاء حسابك وإرسال النموذج بنجاح! سيتم مراجعة طلبك خلال 24-48 ساعة.'
        : 'تم تحديث ملفك الشخصي بنجاح! سيتم مراجعة التحديثات خلال 24-48 ساعة.',
      data: {
        creatorId: creatorDoc.id,
        nextStep: 5,
        completionPercentage: 100
      },
      requestId
    } as OnboardingApiResponse, { status: isNewCreator ? 201 : 200 });

  } catch (error) {
    console.error('[creators.onboarding] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى.',
      requestId
    } as OnboardingApiResponse, { status: 500 });
  }
}

// GET /api/creators/onboarding
// جلب بيانات الـ Onboarding للمبدع (للاستكمال أو التعديل)
export async function GET() {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'غير مسموح - يتطلب تسجيل الدخول',
        requestId
      } as OnboardingApiResponse, { status: 401 });
    }

    const email = session.user.email.toLowerCase();

    // البحث عن المبدع
    const creatorQuery = await adminDb
      .collection('creators')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (creatorQuery.empty) {
      // لا يوجد بيانات - إرجاع النموذج الفارغ
      return NextResponse.json({
        success: true,
        message: 'لم يتم العثور على بيانات سابقة',
        data: {
          hasExistingData: false,
          formData: null,
          completionPercentage: 0
        },
        requestId
      } as OnboardingApiResponse);
    }

    const creatorDoc = creatorQuery.docs[0];
    const creatorData = creatorDoc.data();

    // تحويل بيانات قاعدة البيانات إلى تنسيق النموذج
    const formData: Partial<OnboardingFormData> = {
      currentStep: creatorData.onboardingCompleted ? 5 : 1,
      completedSteps: creatorData.completedSteps || [],
      
      account: {
        fullName: creatorData.fullName || '',
        email: creatorData.email || '',
        phone: creatorData.phone || '',
        password: '', // لا نرجع كلمة المرور
        confirmPassword: '',
        agreeToTerms: true // افتراض الموافقة إذا كان مسجل
      },
      
      basicInfo: {
        role: creatorData.role || 'photographer',
        city: creatorData.city || '',
        canTravel: creatorData.canTravel || false,
        languages: creatorData.languages || ['ar'],
        primaryCategories: creatorData.primaryCategories || []
      },
      
      experience: {
        experienceLevel: creatorData.experienceLevel || 'beginner',
        experienceYears: creatorData.experienceYears || '0-1',
        skills: creatorData.skills || [],
        specializations: creatorData.specializations || [],
        previousClients: creatorData.previousClients || []
      },
      
      portfolio: {
        portfolioUrl: creatorData.portfolio?.portfolioUrl,
        workSamples: creatorData.portfolio?.workSamples || [],
        socialMedia: creatorData.portfolio?.socialMedia || {}
      },
      
      availability: {
        availability: creatorData.availability || 'flexible',
        weeklyHours: creatorData.weeklyHours || 20,
        preferredWorkdays: creatorData.preferredWorkdays || [],
        timeZone: creatorData.timeZone || 'Asia/Baghdad',
        urgentWork: creatorData.urgentWork || false
      },
      
      metadata: {
        startedAt: creatorData.createdAt || new Date().toISOString(),
        lastSavedAt: creatorData.updatedAt,
        source: creatorData.source || 'web'
      }
    };

    const completionPercentage = creatorData.onboardingCompleted ? 100 : 
                                (formData.completedSteps?.length || 0) * 20;

    return NextResponse.json({
      success: true,
      message: 'تم جلب البيانات بنجاح',
      data: {
        hasExistingData: true,
        formData,
        completionPercentage,
        status: creatorData.status,
        onboardingCompleted: creatorData.onboardingCompleted || false
      },
      requestId
    } as OnboardingApiResponse);

  } catch (error) {
    console.error('[creators.onboarding.get] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في الخادم',
      requestId
    } as OnboardingApiResponse, { status: 500 });
  }
}
