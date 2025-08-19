// API موحد لنظام الـ Onboarding الاحترافي - النظام الموحد
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import type {
  OnboardingFormData,
  SubmitOnboardingRequest,
  OnboardingApiResponse
} from '@/types/onboarding';
import type { UnifiedUser, Availability, Equipment, Portfolio, CreatorSpecialty, ExperienceLevel, AvailabilityType } from '@/types/unified-user';

// POST /api/creators/onboarding
// إرسال نموذج الـ Onboarding الكامل
export async function POST(req: NextRequest) {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  
  console.log('[ONBOARDING] Starting POST request', { requestId });
  
  try {
    console.log('[ONBOARDING] Parsing request body...');
    const body: SubmitOnboardingRequest = await req.json();
    const { formData, skipOptionalSteps } = body;
    
    console.log('[ONBOARDING] Request data received', {
      requestId,
      hasFormData: !!formData,
      currentStep: formData?.currentStep,
      fullName: formData?.account?.fullName,
      email: formData?.account?.email,
      skipOptionalSteps
    });

    // التحقق من البيانات الأساسية
    console.log('[ONBOARDING] Validating basic data...');
    if (!formData.account.fullName?.trim()) {
      console.log('[ONBOARDING] Validation failed: fullName missing');
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

  // لاحقاً سنقرر التحقق من كلمة المرور فقط إذا كان المستخدم جديد فعلياً (لم تُنشأ وثيقة من قبل)

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

  // تم التحقق من availability أعلاه (نوع التوفر)، لا نكرر الشرط

    console.log('[ONBOARDING] Starting database operations...');
    const email = formData.account.email.toLowerCase().trim();
    const now = new Date().toISOString();

    // التحقق من عدم وجود بريد مكرر في النظام الموحد
    console.log('[ONBOARDING] Checking for existing user with email:', email);
    const existingUserQuery = await adminDb
      .collection('users')
      .where('email', '==', email)
      .where('role', '==', 'creator')
      .limit(1)
      .get();

    let userDoc;
    const isNewUser = existingUserQuery.empty;
    console.log('[ONBOARDING] Is new user:', isNewUser);

    if (isNewUser) {
      // نرفض الآن الإنشاء هنا لإجبار المرور بمسار create-account لضمان تهيئة Auth + بيانات أساسية موحدة
      return NextResponse.json({
        success: false,
        error: 'يجب إنشاء الحساب أولاً عبر الخطوة الأولى قبل إكمال النموذج',
        requestId
      } as OnboardingApiResponse, { status: 400 });

      // تجهيز بيانات المعدات (تحويل العناصر المخصصة إلى نص)
      const equipment: Equipment = {
        cameras: formData.equipment?.cameras?.map(item =>
          item.isCustom ? `${item.customData?.brand || ''} ${item.customData?.name || ''}`.trim() || 'Custom Camera' : item.catalogId
        ) || [],
        lenses: formData.equipment?.lenses?.map(item =>
          item.isCustom ? `${item.customData?.brand || ''} ${item.customData?.name || ''}`.trim() || 'Custom Lens' : item.catalogId
        ) || [],
        lighting: formData.equipment?.lighting?.map(item =>
          item.isCustom ? `${item.customData?.brand || ''} ${item.customData?.name || ''}`.trim() || 'Custom Lighting' : item.catalogId
        ) || [],
        audio: formData.equipment?.audio?.map(item =>
          item.isCustom ? `${item.customData?.brand || ''} ${item.customData?.name || ''}`.trim() || 'Custom Audio' : item.catalogId
        ) || [],
        accessories: formData.equipment?.accessories?.map(item =>
          item.isCustom ? `${item.customData?.brand || ''} ${item.customData?.name || ''}`.trim() || 'Custom Accessory' : item.catalogId
        ) || [],
        specialSetups: formData.equipment?.specialSetups?.map(item =>
          item.isCustom ? `${item.customData?.brand || ''} ${item.customData?.name || ''}`.trim() || 'Custom Setup' : item.catalogId
        ) || []
      };

      const availability: Availability = {
        availability: formData.availability.availability as AvailabilityType,
        weeklyHours: formData.availability.weeklyHours,
        preferredWorkdays: formData.availability.preferredWorkdays || [],
        weeklyAvailability: formData.availability.weeklyAvailability || [],
        timeZone: formData.availability.timeZone || 'Asia/Baghdad',
        urgentWork: formData.availability.urgentWork || false
      };

      const portfolio: Portfolio = {
        workSamples: formData.portfolio.workSamples || [],
        socialMedia: formData.portfolio.socialMedia || {},
        portfolioUrl: formData.portfolio.portfolioUrl
      };

      // بناء المستخدم الموحد مع كامل بيانات المبدع
      const unifiedUserData: Omit<UnifiedUser, 'id'> = {
        // البيانات الأساسية
        email: email,
        name: formData.account.fullName.trim(),
        role: 'creator',
        status: 'intake_submitted',
        phone: formData.account.phone.trim(),
        avatar: undefined,
        emailVerified: false,
        twoFactorEnabled: false,

        // ملف المبدع الكامل
        creatorProfile: {
          // التخصص والموقع
          specialty: formData.basicInfo.role as CreatorSpecialty,
          city: formData.basicInfo.city.trim(),
          canTravel: formData.basicInfo.canTravel,
          
          // الخبرة والمهارات
          experienceLevel: formData.experience.experienceLevel as ExperienceLevel,
          experienceYears: formData.experience.experienceYears,
          skills: formData.experience.skills.map(skill => ({
            subcategoryId: skill.subcategoryId,
            level: skill.level,
            experienceYears: skill.experienceYears || 1,
            verified: false,
            notes: skill.notes || ''
          })),
          previousClients: formData.experience.previousClients || [],
          
          // اللغات والمجالات
          languages: formData.basicInfo.languages,
          primaryCategories: formData.basicInfo.primaryCategories as ('photo' | 'video' | 'design')[],
          
          // معرض الأعمال
          portfolio,
          
          // التوفر والجدولة
          availability,
          
          // المعدات - تحويل من CreatorEquipmentItem[] إلى string[]
          equipment,
          
          // حالة الانضمام
          onboardingStatus: 'completed',
          onboardingStep: 5,
          onboardingData: {
            completedSteps: formData.completedSteps,
            skipOptionalSteps: skipOptionalSteps || false,
            onboardingVersion: 'unified_v1'
          },
          onboardingCompletedAt: now,
          
          // تقييم الإدارة (قيم افتراضية)
          tier: 'starter',
          modifier: 1.0,
          approvedCategories: formData.basicInfo.primaryCategories,
          
          // معلومات إضافية
          bio: '',
          preferredVerticals: [],
          rateOverrides: []
        },

        // التوقيتات والمتابعة
        createdAt: now,
        updatedAt: now,
        lastLoginAt: undefined,
        source: formData.metadata?.source || 'web',
        originalId: undefined,
        originalCollection: undefined,
        loginAttempts: 0,
        lockedUntil: undefined,
        
        // الإعدادات
        preferences: {
          language: formData.basicInfo.languages?.[0] || 'ar',
          theme: 'light',
          notifications: true
        }
      };

      // حفظ في النظام الموحد (سجل واحد فقط)
      userDoc = await adminDb.collection('users').add(unifiedUserData);

      // حفظ كلمة المرور في مجموعة credentials المنفصلة
  console.log('[ONBOARDING] Unified creator user created (legacy path should be unreachable now)', { userId: userDoc.id, email });

    } else {
      // تحديث مستخدم موجود
      userDoc = existingUserQuery.docs[0];
      
      // إعادة بناء المعدات والتوفر والمهارات في التحديث كذلك
  const equipmentUpdate: Equipment = {
        cameras: formData.equipment?.cameras?.map(item =>
          item.isCustom ? `${item.customData?.brand || ''} ${item.customData?.name || ''}`.trim() || 'Custom Camera' : item.catalogId
        ) || [],
        lenses: formData.equipment?.lenses?.map(item =>
          item.isCustom ? `${item.customData?.brand || ''} ${item.customData?.name || ''}`.trim() || 'Custom Lens' : item.catalogId
        ) || [],
        lighting: formData.equipment?.lighting?.map(item =>
          item.isCustom ? `${item.customData?.brand || ''} ${item.customData?.name || ''}`.trim() || 'Custom Lighting' : item.catalogId
        ) || [],
        audio: formData.equipment?.audio?.map(item =>
          item.isCustom ? `${item.customData?.brand || ''} ${item.customData?.name || ''}`.trim() || 'Custom Audio' : item.catalogId
        ) || [],
        accessories: formData.equipment?.accessories?.map(item =>
          item.isCustom ? `${item.customData?.brand || ''} ${item.customData?.name || ''}`.trim() || 'Custom Accessory' : item.catalogId
        ) || [],
        specialSetups: formData.equipment?.specialSetups?.map(item =>
          item.isCustom ? `${item.customData?.brand || ''} ${item.customData?.name || ''}`.trim() || 'Custom Setup' : item.catalogId
        ) || []
      };

      const availabilityUpdate: Availability = {
        availability: formData.availability.availability as AvailabilityType,
        weeklyHours: formData.availability.weeklyHours,
        preferredWorkdays: formData.availability.preferredWorkdays || [],
        weeklyAvailability: formData.availability.weeklyAvailability || [],
        timeZone: formData.availability.timeZone || 'Asia/Baghdad',
        urgentWork: formData.availability.urgentWork || false
      };

      const portfolioUpdate: Portfolio = {
        workSamples: formData.portfolio.workSamples || [],
        socialMedia: formData.portfolio.socialMedia || {},
        portfolioUrl: formData.portfolio.portfolioUrl
      };

      await userDoc.ref.update({
        name: formData.account.fullName.trim(),
        phone: formData.account.phone.trim(),
        'creatorProfile.specialty': formData.basicInfo.role,
        'creatorProfile.city': formData.basicInfo.city.trim(),
        'creatorProfile.canTravel': formData.basicInfo.canTravel,
        'creatorProfile.languages': formData.basicInfo.languages,
        'creatorProfile.primaryCategories': formData.basicInfo.primaryCategories,
        'creatorProfile.experienceLevel': formData.experience.experienceLevel,
        'creatorProfile.experienceYears': formData.experience.experienceYears,
        'creatorProfile.skills': formData.experience.skills.map(skill => ({
          subcategoryId: skill.subcategoryId,
          level: skill.level,
          experienceYears: skill.experienceYears || 1,
          verified: false,
          notes: skill.notes || ''
        })),
        'creatorProfile.previousClients': formData.experience.previousClients || [],
        'creatorProfile.portfolio': portfolioUpdate,
        'creatorProfile.availability': availabilityUpdate,
        'creatorProfile.equipment': equipmentUpdate,
        'creatorProfile.onboardingStatus': 'completed',
        'creatorProfile.onboardingStep': 5,
        'creatorProfile.onboardingData': {
          completedSteps: formData.completedSteps,
          skipOptionalSteps: skipOptionalSteps || false,
          onboardingVersion: 'unified_v1'
        },
        'creatorProfile.onboardingCompletedAt': now,
        status: 'intake_submitted',
        updatedAt: now
      });
    }

    // تسجيل في audit log
    await adminDb.collection('audit_log').add({
      action: isNewUser ? 'creator_onboarding_completed' : 'creator_onboarding_updated',
      entityType: 'user',
      entityId: userDoc.id,
      userId: email,
      timestamp: now,
      requestId,
      details: {
        isNewUser,
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
      // لا ترسل إشعاراً جديداً إذا كانت الحالة مكتملة مسبقاً ولم يتغير specialty أو المدينة
      const prevData = !isNewUser ? existingUserQuery.docs[0].data() as UnifiedUser : null;
      const wasCompleted = prevData?.creatorProfile?.onboardingStatus === 'completed';
      const profileChanged = wasCompleted && (
        prevData?.creatorProfile?.specialty !== formData.basicInfo.role ||
        prevData?.creatorProfile?.city !== formData.basicInfo.city
      );
      if (!wasCompleted || profileChanged) {
        await adminDb.collection('notifications').add({
          type: 'creator_onboarding_completed',
          title: isNewUser ? 'مبدع جديد أكمل التسجيل' : 'مبدع حدّث ملفه الشخصي',
          message: `${formData.account.fullName} أكمل نموذج الانضمام وجاهز للمراجعة`,
          targetRole: 'admin',
          entityType: 'user',
          entityId: userDoc.id,
          priority: 'high',
          createdAt: now,
          read: false,
          metadata: {
            creatorRole: formData.basicInfo.role,
            creatorCity: formData.basicInfo.city,
            isNewUser,
            profileChanged
          }
        });
      }
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
      message: isNewUser 
        ? 'تم إنشاء حسابك وإرسال النموذج بنجاح! سيتم مراجعة طلبك خلال 24-48 ساعة.'
        : 'تم تحديث ملفك الشخصي بنجاح! سيتم مراجعة التحديثات خلال 24-48 ساعة.',
      data: {
        creatorId: userDoc.id,
        nextStep: 5,
        completionPercentage: 100
      },
      requestId
    } as OnboardingApiResponse, { status: isNewUser ? 201 : 200 });

  } catch (error) {
    console.error('[ONBOARDING] Critical error:', {
      requestId,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
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
    const unifiedQuery = await adminDb
      .collection('users')
      .where('email', '==', email)
      .where('role', '==', 'creator')
      .limit(1)
      .get();

    if (unifiedQuery.empty) {
      return NextResponse.json({
        success: true,
        message: 'لم يتم العثور على بيانات سابقة',
        data: { hasExistingData: false, formData: null, completionPercentage: 0 },
        requestId
      } as OnboardingApiResponse);
    }

    const userDoc = unifiedQuery.docs[0];
    const userData = userDoc.data() as UnifiedUser;
    const cp = userData.creatorProfile;

    if (!cp) {
      return NextResponse.json({
        success: true,
        message: 'لم يتم العثور على بيانات سابقة',
        data: { hasExistingData: false, formData: null, completionPercentage: 0 },
        requestId
      } as OnboardingApiResponse);
    }

    // استخراج خطوات الإكمال مع ضمان النوع (نفترض الخطوات 1..5)
    const rawSteps = Array.isArray((cp.onboardingData as Record<string, unknown>)?.completedSteps)
      ? ((cp.onboardingData as { completedSteps?: Array<number | string> }).completedSteps || [])
          .map(s => (typeof s === 'number' ? s : parseInt(String(s), 10)))
          .filter(n => [1,2,3,4,5].includes(n))
      : [];

    const completedStepsTyped = rawSteps as unknown as OnboardingFormData['completedSteps'];

  const stepRaw: number = cp.onboardingStatus === 'completed' ? 5 : (cp.onboardingStep || 1);
  const allowedSteps = [1,2,3,4,5] as const;
  const stepClamped = (allowedSteps as readonly number[]).includes(stepRaw) ? (stepRaw as (typeof allowedSteps)[number]) : 1;

    const formData: Partial<OnboardingFormData> = {
      currentStep: stepClamped,
      completedSteps: completedStepsTyped,
      account: {
        fullName: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        password: '',
        confirmPassword: '',
        agreeToTerms: true
      },
      basicInfo: {
  role: cp.specialty || 'photographer',
        city: cp.city || '',
        canTravel: cp.canTravel || false,
        languages: cp.languages || ['ar'],
        primaryCategories: cp.primaryCategories || []
      },
      experience: {
        experienceLevel: cp.experienceLevel || 'beginner',
        experienceYears: cp.experienceYears || '0-1',
        skills: cp.skills || [],
        previousClients: cp.previousClients || []
      },
      portfolio: {
        portfolioUrl: cp.portfolio?.portfolioUrl,
        workSamples: cp.portfolio?.workSamples || [],
        socialMedia: cp.portfolio?.socialMedia || {}
      },
      availability: {
  availability: cp.availability?.availability || 'flexible',
        weeklyHours: cp.availability?.weeklyHours || 20,
        preferredWorkdays: cp.availability?.preferredWorkdays || [],
        timeZone: cp.availability?.timeZone || 'Asia/Baghdad',
        urgentWork: cp.availability?.urgentWork || false
      },
      metadata: {
        startedAt: userData.createdAt || new Date().toISOString(),
        lastSavedAt: userData.updatedAt,
  source: (userData.source === 'admin' || userData.source === 'mobile' ? userData.source : 'web')
      }
    };

    const completionPercentage = cp.onboardingStatus === 'completed'
      ? 100
      : ((formData.completedSteps?.length || 0) * 20);

    return NextResponse.json({
      success: true,
      message: 'تم جلب البيانات بنجاح',
      data: {
        hasExistingData: true,
        formData,
        completionPercentage,
  status: userData.status,
  onboardingCompleted: cp.onboardingStatus === 'completed'
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
