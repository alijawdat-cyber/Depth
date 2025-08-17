// API للإجراءات على طلب تعديل محدد

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';
import { PriceOverride, OverrideActionRequest } from '@/types/governance';

const actionSchema = z.object({
  action: z.enum(['approve', 'reject', 'counter']),
  reason: z.string().min(5),
  counterPrice: z.number().positive().optional(),
  conditions: z.array(z.string()).optional(),
  expiryDate: z.string().optional(),
  usageLimit: z.number().positive().optional(),
});

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// PUT: Update override status (approve/reject/counter)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const requestId = crypto.randomUUID();
  
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as { role?: string } | undefined)?.role;
    
    if (!session?.user || role !== 'admin') {
      return NextResponse.json({ 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = actionSchema.parse(body) as OverrideActionRequest;

    // الحصول على الطلب الحالي
    const overrideRef = adminDb.collection('overrides').doc(id);
    const overrideDoc = await overrideRef.get();

    if (!overrideDoc.exists) {
      return NextResponse.json(
        { error: 'طلب التعديل غير موجود' },
        { status: 404 }
      );
    }

    const override = { id: overrideDoc.id, ...overrideDoc.data() } as PriceOverride;

    // التحقق من حالة الطلب
    if (override.status !== 'pending') {
      return NextResponse.json(
        { error: 'لا يمكن تعديل طلب تم التعامل معه مسبقاً' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const adminEmail = session.user.email || '';

    const updateData: Partial<PriceOverride> = {
      updatedAt: now
    };

    // معالجة الإجراء حسب النوع
    switch (validatedData.action) {
      case 'approve':
        updateData.status = 'approved';
        break;

      case 'reject':
        updateData.status = 'rejected';
        break;

      case 'counter':
        if (!validatedData.counterPrice) {
          return NextResponse.json(
            { error: 'السعر المقابل مطلوب للعرض المضاد' },
            { status: 400 }
          );
        }
        updateData.status = 'countered';
        break;
    }

    // تحديث استجابة الإدارة للنوع الأساسي
    if (override.type === 'basic') {
      updateData.adminResponse = {
        adminEmail,
        decision: validatedData.action,
        counterPriceIQD: validatedData.counterPrice,
        reason: validatedData.reason,
        decidedAt: now
      };
    }

    // تحديث الموافقات للنوع المتقدم
    if (override.type === 'advanced' && override.approvals) {
      updateData.approvals = override.approvals.map(approval => {
        if (approval.status === 'pending') {
          return {
            ...approval,
            approver: adminEmail,
            status: validatedData.action === 'approve' ? 'approved' : 'rejected',
            timestamp: now,
            notes: validatedData.reason
          };
        }
        return approval;
      });
    }

    // إضافة الشروط للمتقدم
    if (override.type === 'advanced') {
      if (validatedData.conditions) updateData.conditions = validatedData.conditions;
      if (validatedData.expiryDate) updateData.expiryDate = validatedData.expiryDate;
      if (validatedData.usageLimit) updateData.usageLimit = validatedData.usageLimit;
    }

    // تحديث سجل التدقيق
    const auditEntry = {
      action: `override_${validatedData.action}`,
      user: adminEmail,
      timestamp: now,
      details: {
        decision: validatedData.action,
        reason: validatedData.reason,
        counterPrice: validatedData.counterPrice,
        conditions: validatedData.conditions,
        expiryDate: validatedData.expiryDate,
        usageLimit: validatedData.usageLimit
      }
    };

    updateData.auditLog = [...(override.auditLog || []), auditEntry];

    // حفظ التحديثات
    await overrideRef.update(updateData);

    const updatedOverride = { ...override, ...updateData };

    return NextResponse.json({
      success: true,
      override: updatedOverride,
      requestId
    });

  } catch (error) {
    console.error('Error updating override:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'بيانات الإجراء غير صحيحة', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'فشل في تحديث طلب التعديل' },
      { status: 500 }
    );
  }
}

// GET: Get specific override details
export async function GET(request: NextRequest, { params }: RouteParams) {
  const requestId = crypto.randomUUID();
  
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as { role?: string } | undefined)?.role;
    
    if (!session?.user || role !== 'admin') {
      return NextResponse.json({ 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    const { id } = await params;
    const overrideRef = adminDb.collection('overrides').doc(id);
    const overrideDoc = await overrideRef.get();

    if (!overrideDoc.exists) {
      return NextResponse.json(
        { error: 'طلب التعديل غير موجود' },
        { status: 404 }
      );
    }

    const override = { id: overrideDoc.id, ...overrideDoc.data() } as PriceOverride;

    return NextResponse.json({
      success: true,
      override,
      requestId
    });

  } catch (error) {
    console.error('Error fetching override:', error);
    return NextResponse.json(
      { error: 'فشل في تحميل طلب التعديل' },
      { status: 500 }
    );
  }
}

// DELETE: Delete override request
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const requestId = crypto.randomUUID();
  
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as { role?: string } | undefined)?.role;
    
    if (!session?.user || role !== 'admin') {
      return NextResponse.json({ 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    const { id } = await params;
    const overrideRef = adminDb.collection('overrides').doc(id);
    const overrideDoc = await overrideRef.get();

    if (!overrideDoc.exists) {
      return NextResponse.json(
        { error: 'طلب التعديل غير موجود' },
        { status: 404 }
      );
    }

    const override = { id: overrideDoc.id, ...overrideDoc.data() } as PriceOverride;

    // التحقق من إمكانية الحذف
    if (override.status === 'approved') {
      return NextResponse.json(
        { error: 'لا يمكن حذف طلب تعديل مُوافق عليه' },
        { status: 400 }
      );
    }

    await overrideRef.delete();

    return NextResponse.json({
      success: true,
      message: 'تم حذف طلب التعديل بنجاح',
      requestId
    });

  } catch (error) {
    console.error('Error deleting override:', error);
    return NextResponse.json(
      { error: 'فشل في حذف طلب التعديل' },
      { status: 500 }
    );
  }
}
