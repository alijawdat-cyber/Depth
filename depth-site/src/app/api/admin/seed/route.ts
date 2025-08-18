import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

// Seed API للأدمن الافتراضي
// يستخدم مفتاح سري لأمان إضافي
export async function POST(req: NextRequest) {
  try {
    const seedKey = req.headers.get('x-seed-key');
    const internalKey = process.env.SEED_INTERNAL_KEY || 'depth-admin-seed-2025';
    
    // التحقق من مفتاح الأمان
    if (!seedKey || seedKey !== internalKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مسموح - مفتاح خاطئ' 
      }, { status: 401 });
    }

    // بيانات الأدمن الافتراضي (موحدة مع النظام)
    const adminData = {
      id: 'default-admin',
      email: 'admin@depth-agency.com',
      name: 'مدير النظام',
      fullName: 'مدير النظام', // للتوافق مع واجهات المبدعين
      role: 'admin', // دور النظام
      userRole: 'admin', // للتوحيد
      status: 'active',
      permissions: ['all'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      emailVerified: true,
      twoFactorEnabled: false,
      department: 'إدارة',
      position: 'مدير عام',
      
      // معلومات إضافية للنظام الموحد
      avatar: null,
      phone: null,
      location: 'العراق - بغداد',
      company: 'Depth Agency',
      lastLoginAt: new Date().toISOString(),
      
      // إعدادات الأمان
      loginAttempts: 0,
      lockedUntil: null,
      
      // البيانات الوصفية
      metadata: {
        createdBy: 'system',
        seedVersion: '1.0.0',
        isDefaultAdmin: true
      }
    };

    // التحقق من وجود الأدمن مسبقاً
    const existingAdmin = await adminDb
      .collection('admins')
      .where('email', '==', adminData.email)
      .limit(1)
      .get();

    if (!existingAdmin.empty) {
      // تحديث البيانات الموجودة للتوافق مع النظام الموحد
      const docId = existingAdmin.docs[0].id;
      await adminDb.collection('admins').doc(docId).update({
        ...adminData,
        updatedAt: new Date().toISOString(),
        metadata: {
          ...adminData.metadata,
          lastSeeded: new Date().toISOString()
        }
      });

      return NextResponse.json({
        success: true,
        message: 'تم تحديث بيانات الأدمن للنظام الموحد',
        admin: { ...adminData, id: docId }
      });
    }

    // إنشاء وثيقة أدمن جديدة
    const adminRef = await adminDb.collection('admins').add(adminData);

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الأدمن الافتراضي بنجاح',
      admin: { ...adminData, id: adminRef.id }
    });

  } catch (error) {
    console.error('Error seeding admin:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'خطأ في زراعة بيانات الأدمن' 
    }, { status: 500 });
  }
}

// GET لاختبار وجود الأدمن
export async function GET() {
  try {
    const adminList = (process.env.ADMIN_EMAILS || 'admin@depth-agency.com')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);

    const adminChecks = [];

    for (const email of adminList) {
      const adminDoc = await adminDb
        .collection('admins')
        .where('email', '==', email)
        .limit(1)
        .get();

      adminChecks.push({
        email,
        exists: !adminDoc.empty,
        docId: adminDoc.empty ? null : adminDoc.docs[0].id,
        data: adminDoc.empty ? null : adminDoc.docs[0].data()
      });
    }

    return NextResponse.json({
      success: true,
      adminEmails: adminList,
      checks: adminChecks,
      summary: {
        total: adminList.length,
        existing: adminChecks.filter(c => c.exists).length,
        missing: adminChecks.filter(c => !c.exists).length
      }
    });

  } catch (error) {
    console.error('Error checking admin:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'خطأ في فحص الأدمن' 
    }, { status: 500 });
  }
}
