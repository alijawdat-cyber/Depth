import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import type { UnifiedUser } from '@/types/unified-user';
import bcrypt from 'bcryptjs';

// POST /api/clients/signup
// تسجيل عميل جديد
export async function POST(req: NextRequest) {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  
  try {
    const body = await req.json();
    const { fullName, company, email, phone, password } = body;

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

    // التحقق من عدم وجود بريد مكرر في النظام الموحد
    const existingClientQuery = await adminDb
      .collection('users')
      .where('email', '==', email.toLowerCase())
      .limit(1)
      .get();

    if (!existingClientQuery.empty) {
      return NextResponse.json({ 
        success: false, 
        error: 'البريد الإلكتروني مستخدم مسبقاً', 
        requestId 
      }, { status: 400 });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 12);

    // إنشاء بيانات العميل الموحد
    const now = new Date().toISOString();
    const unifiedUser: Omit<UnifiedUser, 'id'> = {
      email: email.toLowerCase().trim(),
      name: fullName.trim(),
      role: 'client',
      status: 'pending',
      emailVerified: false,
      twoFactorEnabled: false,
      phone: phone.trim(),
      avatar: undefined,
      clientProfile: {
        company: company?.trim() || '',
        industry: undefined,
        website: undefined,
        size: undefined,
        preferredLanguage: 'ar',
        timeZone: 'Asia/Baghdad',
        msaOnFile: false,
        preferredCommunication: 'email',
        typicalBudgetRange: undefined,
        preferredDeliveryMethod: undefined
      },
      createdAt: now,
      updatedAt: now,
      lastLoginAt: undefined,
      source: 'web-signup',
      originalId: undefined,
      originalCollection: undefined,
      loginAttempts: 0,
      lockedUntil: undefined,
      preferences: { language: 'ar', notifications: true, theme: 'light' }
    };

    const userRef = await adminDb.collection('users').add(unifiedUser);

    // تخزين بيانات الاعتماد في مجموعة منفصلة
    await adminDb.collection('user_credentials').doc(userRef.id).set({
      userId: userRef.id,
      email: unifiedUser.email,
      hashedPassword,
      createdAt: now,
      lastPasswordChange: now
    });

    // تسجيل العملية في audit log
    await adminDb.collection('audit_log').add({
      action: 'client_registration',
      entityType: 'user',
      entityId: userRef.id,
      userId: unifiedUser.email,
      timestamp: now,
      details: {
        fullName,
        company,
        source: 'web-signup'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء حساب العميل بنجاح',
  clientId: userRef.id,
      requestId
    }, { status: 201 });

  } catch (error) {
    console.error('[client.signup] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في الخادم',
      requestId
    }, { status: 500 });
  }
}
