import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';

// Schema لإنشاء دعوة موظف
const createInviteSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  name: z.string().min(2, 'الاسم مطلوب'),
  position: z.enum(['photographer', 'admin', 'marketing', 'editor'], {
    message: 'يرجى اختيار منصب صالح'
  }),
  department: z.string().min(2, 'القسم مطلوب'),
  salary: z.number().positive('الراتب يجب أن يكون أكبر من صفر'),
  permissions: z.array(z.string()).default([]),
});

// POST: إرسال دعوة موظف جديد
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // التحقق من أن المستخدم admin
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    // التحقق من صلاحيات الإدارة
    const adminUser = await adminDb.collection('admins')
      .where('email', '==', session.user.email)
      .limit(1)
      .get();

    if (adminUser.empty) {
      return NextResponse.json({ error: 'صلاحيات غير كافية' }, { status: 403 });
    }

    const body = await request.json();
    const validation = createInviteSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({
        error: 'بيانات غير صالحة',
        details: validation.error.issues
      }, { status: 400 });
    }

    const { email, name, position, department, salary, permissions } = validation.data;

    // التحقق من عدم وجود الموظف مسبقاً
    const existingEmployee = await adminDb.collection('employees')
      .where('email', '==', email.toLowerCase())
      .limit(1)
      .get();

    if (!existingEmployee.empty) {
      return NextResponse.json({
        error: 'البريد الإلكتروني مستخدم بالفعل'
      }, { status: 409 });
    }

    // التحقق من وجود دعوة سابقة لم تستخدم
    const existingInvite = await adminDb.collection('employee_invites')
      .where('email', '==', email.toLowerCase())
      .where('used', '==', false)
      .limit(1)
      .get();

    if (!existingInvite.empty) {
      return NextResponse.json({
        error: 'توجد دعوة سابقة لم تستخدم لهذا البريد الإلكتروني'
      }, { status: 409 });
    }

    // إنشاء رمز الدعوة
    const inviteToken = typeof crypto?.randomUUID === 'function' 
      ? crypto.randomUUID() 
      : `invite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // تاريخ انتهاء الصلاحية (7 أيام)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // حفظ الدعوة في قاعدة البيانات
    const inviteData = {
      email: email.toLowerCase(),
      name,
      position,
      department,
      salary,
      permissions,
      inviteToken,
      used: false,
      expiresAt,
      invitedBy: session.user.email,
      invitedAt: new Date(),
    };

    const inviteRef = await adminDb.collection('employee_invites').add(inviteData);

    // رابط الدعوة
    const inviteUrl = `${process.env.NEXTAUTH_URL}/employees/signup?token=${inviteToken}`;
    
    console.log(`دعوة موظف جديد:
      الاسم: ${name}
      الإيميل: ${email}
      المنصب: ${position}
      رابط التسجيل: ${inviteUrl}
    `);

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء دعوة الموظف بنجاح',
      inviteId: inviteRef.id,
      inviteUrl, // مؤقت للاختبار
      data: {
        name,
        email,
        position,
        department,
        expiresAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating employee invite:', error);
    return NextResponse.json({
      error: 'حدث خطأ في إنشاء الدعوة'
    }, { status: 500 });
  }
}

// GET: جلب قائمة الدعوات المعلقة
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    // التحقق من صلاحيات الإدارة
    const adminUser = await adminDb.collection('admins')
      .where('email', '==', session.user.email)
      .limit(1)
      .get();

    if (adminUser.empty) {
      return NextResponse.json({ error: 'صلاحيات غير كافية' }, { status: 403 });
    }

    // جلب الدعوات المعلقة
    const invitesSnapshot = await adminDb.collection('employee_invites')
      .where('used', '==', false)
      .where('expiresAt', '>', new Date())
      .orderBy('invitedAt', 'desc')
      .get();

    const invites = invitesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // إخفاء الرمز من الاستجابة
      inviteToken: undefined,
      invitedAt: doc.data().invitedAt?.toDate?.()?.toISOString(),
      expiresAt: doc.data().expiresAt?.toDate?.()?.toISOString()
    }));

    return NextResponse.json({
      success: true,
      invites
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching employee invites:', error);
    return NextResponse.json({
      error: 'حدث خطأ في جلب الدعوات'
    }, { status: 500 });
  }
}
