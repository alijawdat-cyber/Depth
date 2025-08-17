// API لإضافة معدات مخصصة من المبدعين
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { Query, DocumentData } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || session.user.role !== 'creator') {
      return NextResponse.json(
        { error: 'غير مسموح - يتطلب حساب مبدع' },
        { status: 401 }
      );
    }

    const data = await req.json();
    const { name, brand, model, category, description, condition } = data;

    // التحقق من البيانات الأساسية
    if (!name?.trim() || !brand?.trim() || !category) {
      return NextResponse.json(
        { error: 'اسم المعدة والماركة والفئة مطلوبة' },
        { status: 400 }
      );
    }

    // إنشاء معرف فريد
    const customId = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // إضافة المعدة المخصصة لقاعدة البيانات
    const customEquipmentData = {
      id: customId,
      name: name.trim(),
      brand: brand.trim(),
      model: model?.trim() || '',
      category,
      description: description?.trim() || '',
      condition: condition || 'good',
      status: 'pending_review',
      isCustom: true,
      submittedBy: session.user.email,
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await adminDb.collection('custom_equipment').doc(customId).set(customEquipmentData);

    // تسجيل في audit log
    await adminDb.collection('audit_log').add({
      action: 'custom_equipment_submitted',
      entityType: 'custom_equipment',
      entityId: customId,
      userId: session.user.email,
      timestamp: new Date().toISOString(),
      details: {
        name,
        brand,
        model,
        category,
        status: 'pending_review'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم إرسال المعدة للمراجعة بنجاح',
      data: {
        id: customId,
        status: 'pending_review'
      }
    });

  } catch (error) {
    console.error('Custom equipment submission error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في إرسال المعدة للمراجعة' },
      { status: 500 }
    );
  }
}

// جلب المعدات المخصصة للمبدع
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'غير مسموح - يتطلب تسجيل الدخول' },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const status = url.searchParams.get('status');

    let query: Query<DocumentData> = adminDb.collection('custom_equipment');
    
    // للمبدعين: عرض معداتهم المخصصة فقط
    if (session.user.role === 'creator') {
      query = query.where('submittedBy', '==', session.user.email);
    }
    
    // فلترة حسب الحالة إذا كانت محددة
    if (status) {
      query = query.where('status', '==', status);
    }
    
    const snapshot = await query.orderBy('createdAt', 'desc').get();
    
    interface CustomEquipmentData {
      id: string;
      name: string;
      brand?: string;
      model?: string;
      category: string;
      description?: string;
      status: 'pending_review' | 'approved' | 'rejected' | 'changes_requested';
      submittedBy: string;
      createdAt: string;
      updatedAt?: string;
    }

    const customEquipment: CustomEquipmentData[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as CustomEquipmentData));

    return NextResponse.json({
      success: true,
      data: customEquipment,
      total: customEquipment.length
    });

  } catch (error) {
    console.error('Get custom equipment error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب المعدات المخصصة' },
      { status: 500 }
    );
  }
}
