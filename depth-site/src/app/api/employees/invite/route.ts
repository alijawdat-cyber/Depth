import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';

interface EmployeeInviteDoc {
  email: string;
  name: string;
  position: string;
  department: string;
  salary: number;
  permissions: string[];
  inviteToken: string;
  used: boolean;
  expiresAt: string | { toDate?: () => Date };
  invitedAt: string | { toDate?: () => Date };
}

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

    // التحقق من صلاحيات الإدارة في النظام الموحد
    const adminQuery = await adminDb.collection('users')
      .where('email', '==', session.user.email.toLowerCase())
      .where('role', '==', 'admin')
      .limit(1)
      .get();
    if (adminQuery.empty) {
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

    // التحقق من عدم وجود الموظف مسبقاً في النظام الموحد
    const existingUnified = await adminDb.collection('users')
      .where('email', '==', email.toLowerCase())
      .where('role', '==', 'employee')
      .limit(1)
      .get();
    if (!existingUnified.empty) {
      return NextResponse.json({ error: 'البريد الإلكتروني مستخدم بالفعل' }, { status: 409 });
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
    const nowIso = new Date().toISOString();
    const inviteData = {
      email: email.toLowerCase(),
      name,
      position,
      department,
      salary,
      permissions,
      inviteToken,
      used: false,
      expiresAt: expiresAt.toISOString(),
      invitedBy: session.user.email,
      invitedAt: nowIso,
      createdAt: nowIso,
      updatedAt: nowIso
    } as const;

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
    const adminQuery = await adminDb.collection('users')
      .where('email', '==', session.user.email.toLowerCase())
      .where('role', '==', 'admin')
      .limit(1)
      .get();
    if (adminQuery.empty) {
      return NextResponse.json({ error: 'صلاحيات غير كافية' }, { status: 403 });
    }

    // جلب الدعوات المعلقة
    // جلب الدعوات النشطة (التحقق يدوياً من الانتهاء بواسطة ISO)
    const invitesSnapshot = await adminDb.collection('employee_invites')
      .where('used', '==', false)
      .orderBy('invitedAt', 'desc')
      .get();

    const now = Date.now();
    const invites = invitesSnapshot.docs.map(doc => {
      const d = doc.data() as EmployeeInviteDoc;
      const expiresAtIso = typeof d.expiresAt === 'string' ? d.expiresAt : d.expiresAt?.toDate?.()?.toISOString();
      const valid = !!(expiresAtIso && Date.parse(expiresAtIso) > now);
      if (!valid) return null;
      return {
        id: doc.id,
        email: d.email,
        name: d.name,
        position: d.position,
        department: d.department,
        salary: d.salary,
        permissions: d.permissions,
        invitedAt: typeof d.invitedAt === 'string' ? d.invitedAt : d.invitedAt?.toDate?.()?.toISOString(),
        expiresAt: expiresAtIso
      };
    }).filter((v): v is Exclude<typeof v, null> => Boolean(v));

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
