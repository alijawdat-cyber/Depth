import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import bcrypt from 'bcryptjs';

// POST /api/creators/signup
// تسجيل مبدع جديد
export async function POST(req: NextRequest) {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  
  try {
    const body = await req.json();
    const { fullName, email, phone, password, role, city } = body;

    // Validation
    if (!fullName?.trim()) {
      return NextResponse.json({ 
        success: false, 
        error: 'الاسم الكامل مطلوب', 
        requestId 
      }, { status: 400 });
    }

    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ 
        success: false, 
        error: 'البريد الإلكتروني غير صحيح', 
        requestId 
      }, { status: 400 });
    }

    if (!phone?.trim()) {
      return NextResponse.json({ 
        success: false, 
        error: 'رقم الهاتف مطلوب', 
        requestId 
      }, { status: 400 });
    }

    if (!password || password.length < 8) {
      return NextResponse.json({ 
        success: false, 
        error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل', 
        requestId 
      }, { status: 400 });
    }

    if (!['photographer', 'videographer', 'designer', 'producer'].includes(role)) {
      return NextResponse.json({ 
        success: false, 
        error: 'التخصص غير صحيح', 
        requestId 
      }, { status: 400 });
    }

    if (!city?.trim()) {
      return NextResponse.json({ 
        success: false, 
        error: 'المدينة مطلوبة', 
        requestId 
      }, { status: 400 });
    }

    // التحقق من عدم وجود بريد مكرر
    const existingCreatorQuery = await adminDb
      .collection('creators')
      .where('contact.email', '==', email.toLowerCase())
      .limit(1)
      .get();

    if (!existingCreatorQuery.empty) {
      return NextResponse.json({ 
        success: false, 
        error: 'البريد الإلكتروني مستخدم بالفعل', 
        requestId 
      }, { status: 409 });
    }

    // التحقق من عدم وجود هاتف مكرر
    const existingPhoneQuery = await adminDb
      .collection('creators')
      .where('contact.phone', '==', phone)
      .limit(1)
      .get();

    if (!existingPhoneQuery.empty) {
      return NextResponse.json({ 
        success: false, 
        error: 'رقم الهاتف مستخدم بالفعل', 
        requestId 
      }, { status: 409 });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 12);

    // إنشاء بيانات المبدع
    const now = new Date().toISOString();
    const creatorData = {
      // معلومات أساسية
      fullName: fullName.trim(),
      role,
      city,
      contact: {
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        whatsapp: phone.trim(), // افتراضي نفس رقم الهاتف
        instagram: ''
      },
      
      // كلمة المرور المشفرة
      password: hashedPassword,
      
      // حالة المبدع
      status: 'registered', // حالة أولية - يحتاج لملء نموذج الانضمام
      
      // بيانات فارغة ستملأ في نموذج الانضمام
      skills: [],
      verticals: [],
      equipment: {
        cameras: [],
        lenses: [],
        lighting: [],
        audio: [],
        accessories: [],
        specialSetups: []
      },
      capacity: {
        maxAssetsPerDay: 0,
        availableDays: [],
        standardSLA: 48,
        rushSLA: 24
      },
      compliance: {
        clinicsTraining: false,
        ndaSigned: false,
        equipmentAgreement: false
      },
      internalCost: {},
      
      // بيانات النظام
      canTravel: false,
      languages: ['ar'],
      score: null,
      tier: null,
      evaluation: null,
      intakeCompleted: false,
      
      // timestamps
      createdAt: now,
      updatedAt: now,
      lastLoginAt: null,
      
      // audit
      createdBy: 'self-registration',
      source: 'web-signup'
    };

    // حفظ في قاعدة البيانات
    const docRef = await adminDb.collection('creators').add(creatorData);

    // تسجيل العملية في audit log
    await adminDb.collection('audit_log').add({
      action: 'creator_registration',
      entityType: 'creator',
      entityId: docRef.id,
      userId: email,
      timestamp: now,
      details: {
        fullName,
        role,
        city,
        source: 'web-signup'
      }
    });

    // إنشاء حساب في NextAuth users collection (إذا كان موجود)
    try {
      await adminDb.collection('users').doc(email).set({
        email: email.toLowerCase(),
        name: fullName,
        role: 'creator',
        creatorId: docRef.id,
        image: null,
        emailVerified: null,
        createdAt: now,
        updatedAt: now
      });
    } catch (userError) {
      console.warn('Could not create user record:', userError);
      // لا نفشل العملية بسبب هذا
    }

    return NextResponse.json({ 
      success: true, 
      requestId,
      creatorId: docRef.id,
      message: 'تم إنشاء الحساب بنجاح. يمكنك الآن ملء نموذج الانضمام.',
      nextStep: 'intake_form'
    });

  } catch (error) {
    console.error('[creators.signup] POST error', { requestId, error });
    
    return NextResponse.json({ 
      success: false, 
      error: 'حدث خطأ في إنشاء الحساب. يرجى المحاولة مرة أخرى.', 
      requestId 
    }, { status: 500 });
  }
}
