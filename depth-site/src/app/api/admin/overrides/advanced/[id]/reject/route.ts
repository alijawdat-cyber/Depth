// API endpoint لرفض طلبات تعديل الأسعار

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json() as {
      level: 'manager' | 'director' | 'ceo';
      notes: string;
      approver: string;
    };
    const { level, notes, approver } = body;

    if (!notes || notes.trim().length === 0) {
      return NextResponse.json(
        { error: 'سبب الرفض مطلوب' }, 
        { status: 400 }
      );
    }

    // Get the override request
    const doc = await adminDb.collection('price_overrides').doc(id).get();
    if (!doc.exists) {
      return NextResponse.json(
        { error: 'طلب التعديل غير موجود' }, 
        { status: 404 }
      );
    }

    const requestData = doc.data();
    if (!requestData) {
      return NextResponse.json(
        { error: 'بيانات الطلب غير صالحة' }, 
        { status: 400 }
      );
    }

    // Update the specific approval level
    const updatedApprovals = (requestData.approvals as Array<{
      level: string;
      status: string;
      approver?: string;
      timestamp?: string;
      notes?: string;
    }>).map((approval) => {
      if (approval.level === level) {
        return {
          ...approval,
          status: 'rejected',
          approver,
          timestamp: new Date().toISOString(),
          notes
        };
      }
      return approval;
    });

    // Update audit log
    const updatedAuditLog = [
      ...requestData.auditLog,
      {
        action: 'approval_rejected',
        user: approver,
        timestamp: new Date().toISOString(),
        details: {
          level,
          notes,
          reason: 'Request rejected at approval level'
        }
      }
    ];

    // Update the document - rejection at any level means overall rejection
    const updateData = {
      approvals: updatedApprovals,
      status: 'rejected',
      auditLog: updatedAuditLog,
      rejectedAt: new Date().toISOString(),
      rejectedBy: approver,
      rejectionReason: notes,
      updatedAt: new Date().toISOString(),
      updatedBy: approver
    };

    await adminDb.collection('price_overrides').doc(id).update(updateData);

    // Log the action
    await adminDb.collection('audit_log').add({
      action: 'override_rejected',
      entityType: 'price_override',
      entityId: id,
      userId: approver,
      timestamp: new Date().toISOString(),
      details: {
        level,
        rejectionReason: notes,
        quoteId: requestData.quoteId,
        discountPercentage: (requestData.discountPercentage * 100).toFixed(1)
      }
    });

    // Notify the original requester
    try {
      await notifyRequestRejection(requestData.requestedBy, {
        quoteId: requestData.quoteId,
        clientName: requestData.clientName,
        rejectionReason: notes,
        rejectedBy: approver,
        rejectedAt: new Date().toISOString()
      });
    } catch (error) {
      console.warn('Failed to send rejection notification:', error);
      // Don't fail the rejection if notification fails
    }

    return NextResponse.json({
      success: true,
      request: { id, ...requestData, ...updateData },
      message: 'تم رفض طلب التعديل'
    });

  } catch (error) {
    console.error('Error rejecting override request:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في رفض الطلب' }, 
      { status: 500 }
    );
  }
}

// Helper function to notify requester of rejection
async function notifyRequestRejection(requesterEmail: string, rejectionDetails: {
  quoteId: string;
  clientName: string;
  rejectionReason: string;
  rejectedBy: string;
  rejectedAt: string;
}) {
  try {
    // Create notification record
    await adminDb.collection('notifications').add({
      type: 'override_rejected',
      recipient: requesterEmail,
      title: 'تم رفض طلب تعديل السعر',
      message: `تم رفض طلب تعديل السعر للعرض ${rejectionDetails.quoteId} للعميل ${rejectionDetails.clientName}`,
      data: rejectionDetails,
      status: 'unread',
      createdAt: new Date().toISOString()
    });

    // Here you could also send email notification
    // await sendEmailNotification(requesterEmail, rejectionDetails);

  } catch (error) {
    console.error('Error creating rejection notification:', error);
    throw error;
  }
}
