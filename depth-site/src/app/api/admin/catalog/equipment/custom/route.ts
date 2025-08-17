// API لإدارة المعدات المخصصة من لوحة الأدمن
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

// جلب جميع المعدات المخصصة للمراجعة
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'غير مسموح - يتطلب صلاحيات أدمن' },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const status = url.searchParams.get('status') || 'pending_review';
    const category = url.searchParams.get('category');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    let query = adminDb.collection('custom_equipment');
    
    if (status) {
      query = query.where('status', '==', status);
    }
    
    if (category) {
      query = query.where('category', '==', category);
    }
    
    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    
    const customEquipment = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // إحصائيات
    const stats = {
      pending: 0,
      approved: 0,
      rejected: 0,
      total: customEquipment.length
    };

    customEquipment.forEach(item => {
      if (item.status === 'pending_review') stats.pending++;
      else if (item.status === 'approved') stats.approved++;
      else if (item.status === 'rejected') stats.rejected++;
    });

    return NextResponse.json({
      success: true,
      data: customEquipment,
      stats,
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

// الموافقة على معدة مخصصة أو رفضها
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'غير مسموح - يتطلب صلاحيات أدمن' },
        { status: 401 }
      );
    }

    const { equipmentId, action, feedback, modifications } = await req.json();

    if (!equipmentId || !action || !['approve', 'reject', 'request_changes'].includes(action)) {
      return NextResponse.json(
        { error: 'معرف المعدة والإجراء مطلوبان' },
        { status: 400 }
      );
    }

    const equipmentRef = adminDb.collection('custom_equipment').doc(equipmentId);
    const equipmentDoc = await equipmentRef.get();

    if (!equipmentDoc.exists) {
      return NextResponse.json(
        { error: 'المعدة غير موجودة' },
        { status: 404 }
      );
    }

    const equipmentData = equipmentDoc.data();
    const now = new Date().toISOString();

    let updateData: any = {
      updatedAt: now,
      reviewedBy: session.user.email,
      reviewedAt: now
    };

    if (action === 'approve') {
      updateData.status = 'approved';
      
      // إضافة المعدة للكاتالوج الرسمي إذا تم الموافقة عليها
      const catalogData = {
        id: `approved_${equipmentId}`,
        name: modifications?.name || equipmentData?.name,
        brand: modifications?.brand || equipmentData?.brand,
        model: modifications?.model || equipmentData?.model,
        category: equipmentData?.category,
        description: modifications?.description || equipmentData?.description,
        isApproved: true,
        addedFromCustom: true,
        originalCustomId: equipmentId,
        approvedBy: session.user.email,
        approvedAt: now,
        createdAt: now,
        updatedAt: now
      };

      await adminDb.collection('equipment_catalog').doc(`approved_${equipmentId}`).set(catalogData);
      
    } else if (action === 'reject') {
      updateData.status = 'rejected';
      updateData.rejectionReason = feedback;
      
    } else if (action === 'request_changes') {
      updateData.status = 'changes_requested';
      updateData.changeRequests = feedback;
    }

    // إضافة التعديلات إذا كانت موجودة
    if (modifications) {
      updateData.adminModifications = modifications;
    }

    await equipmentRef.update(updateData);

    // تسجيل في audit log
    await adminDb.collection('audit_log').add({
      action: `custom_equipment_${action}`,
      entityType: 'custom_equipment',
      entityId: equipmentId,
      userId: session.user.email,
      timestamp: now,
      details: {
        originalName: equipmentData?.name,
        action,
        feedback,
        modifications
      }
    });

    return NextResponse.json({
      success: true,
      message: action === 'approve' ? 'تم اعتماد المعدة وإضافتها للكاتالوج' :
               action === 'reject' ? 'تم رفض المعدة' :
               'تم طلب تعديلات على المعدة',
      data: {
        equipmentId,
        status: updateData.status,
        catalogId: action === 'approve' ? `approved_${equipmentId}` : null
      }
    });

  } catch (error) {
    console.error('Update custom equipment error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في تحديث حالة المعدة' },
      { status: 500 }
    );
  }
}
