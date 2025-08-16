import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
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

    // التحقق من عدم وجود بريد مكرر
    const existingClientQuery = await adminDb
      .collection('clients')
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

    // إنشاء بيانات العميل
    const now = new Date().toISOString();
    const clientData = {
      // معلومات أساسية
      name: fullName.trim(),
      company: company?.trim() || '',
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      
      // كلمة المرور المشفرة
      password: hashedPassword,
      
      // حالة العميل
      status: 'pending', // في انتظار الموافقة
      role: 'client',
      
      // بيانات النظام
      createdAt: now,
      updatedAt: now,
      lastLoginAt: null,
      
      // audit
      createdBy: 'self-registration',
      source: 'web-signup'
    };

    // حفظ في قاعدة البيانات
    const docRef = await adminDb.collection('clients').add(clientData);

    // تسجيل العملية في audit log
    await adminDb.collection('audit_log').add({
      action: 'client_registration',
      entityType: 'client',
      entityId: docRef.id,
      userId: email,
      timestamp: now,
      details: {
        fullName,
        company,
        source: 'web-signup'
      }
    });

    // إنشاء حساب في NextAuth users collection إذا كان موجود
    try {
      await adminDb.collection('users').add({
        name: fullName.trim(),
        email: email.toLowerCase().trim(),
        role: 'client',
        clientId: docRef.id,
        createdAt: now
      });
    } catch (error) {
      console.warn('[client.signup] Failed to create user record:', error);
      // لا نفشل التسجيل إذا فشل إنشاء سجل المستخدم
    }

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء حساب العميل بنجاح',
      clientId: docRef.id,
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
