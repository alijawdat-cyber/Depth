// API endpoint للموافقة على طلبات تعديل الأسعار

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

type PriceOverrideApproval = {
  level: string;
  status: string;
  approver?: string;
  timestamp?: string;
  notes?: string;
};

type AuditLogEntry = {
  action: string;
  user: string;
  timestamp: string;
  details: Record<string, unknown>;
};

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
      notes?: string;
      approver: string;
    };
    const { level, notes, approver } = body;

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
          status: 'approved',
          approver,
          timestamp: new Date().toISOString(),
          notes
        };
      }
      return approval;
    });

    // Check if all required approvals are complete
    const allApproved = updatedApprovals.every((approval) => approval.status === 'approved');
    const newStatus = allApproved ? 'approved' : 'pending';

    // Update audit log
    const updatedAuditLog: AuditLogEntry[] = [
      ...(requestData.auditLog as AuditLogEntry[] | undefined ?? []),
      {
        action: 'approval_granted',
        user: approver,
        timestamp: new Date().toISOString(),
        details: {
          level,
          notes,
          allApproved
        }
      }
    ];

    // Update the document
    const updateData: {
      approvals: PriceOverrideApproval[];
      status: string;
      auditLog: AuditLogEntry[];
      updatedAt: string;
      updatedBy: string;
      approvedAt?: string;
      finalApprover?: string;
    } = {
      approvals: updatedApprovals,
      status: newStatus,
      auditLog: updatedAuditLog,
      updatedAt: new Date().toISOString(),
      updatedBy: approver
    };

    if (allApproved) {
      updateData.approvedAt = new Date().toISOString();
      updateData.finalApprover = approver;
    }

    await adminDb.collection('price_overrides').doc(id).update(updateData);

    // Log the action
    await adminDb.collection('audit_log').add({
      action: 'override_approved',
      entityType: 'price_override',
      entityId: id,
      userId: approver,
      timestamp: new Date().toISOString(),
      details: {
        level,
        finalApproval: allApproved,
        quoteId: requestData.quoteId,
        discountPercentage: (requestData.discountPercentage * 100).toFixed(1)
      }
    });

    // If fully approved, update the quote with the new price
    if (allApproved) {
      try {
        await updateQuoteWithApprovedPrice(requestData.quoteId, requestData.requestedPrice);
      } catch (error) {
        console.warn('Failed to update quote price:', error);
        // Don't fail the approval if quote update fails
      }
    }

    return NextResponse.json({
      success: true,
      request: { id, ...requestData, ...updateData },
      message: allApproved ? 'تم اعتماد طلب التعديل نهائياً' : 'تم الموافقة على المستوى المطلوب'
    });

  } catch (error) {
    console.error('Error approving override request:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الموافقة على الطلب' }, 
      { status: 500 }
    );
  }
}

// Helper function to update quote price
async function updateQuoteWithApprovedPrice(quoteId: string, approvedPrice: number) {
  try {
    // Find the quote
    const quoteSnapshot = await adminDb
      .collection('quotes')
      .where('quoteId', '==', quoteId)
      .limit(1)
      .get();

    if (!quoteSnapshot.empty) {
      const quoteDoc = quoteSnapshot.docs[0];
      await quoteDoc.ref.update({
        overrideApplied: true,
        overriddenPrice: approvedPrice,
        originalPrice: quoteDoc.data().totalPrice,
        totalPrice: approvedPrice,
        updatedAt: new Date().toISOString(),
        updatedBy: 'system_override'
      });

      // Log quote update
      await adminDb.collection('audit_log').add({
        action: 'quote_price_overridden',
        entityType: 'quote',
        entityId: quoteDoc.id,
        userId: 'system',
        timestamp: new Date().toISOString(),
        details: {
          quoteId,
          originalPrice: quoteDoc.data().totalPrice,
          overriddenPrice: approvedPrice
        }
      });
    }
  } catch (error) {
    console.error('Error updating quote with approved price:', error);
    throw error;
  }
}
