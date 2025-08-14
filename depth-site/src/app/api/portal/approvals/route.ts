// Client Portal - Approvals API
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { APPROVAL_STATUSES } from '@/types/entities';
import { FieldValue } from 'firebase-admin/firestore';

// Helpers to work safely with Firestore Timestamps without using `any`
function toEpochMs(value: unknown): number {
  if (
    value &&
    typeof value === 'object' &&
    'toDate' in (value as Record<string, unknown>) &&
    typeof (value as { toDate: () => Date }).toDate === 'function'
  ) {
    const d = (value as { toDate: () => Date }).toDate();
    return typeof d.getTime === 'function' ? d.getTime() : 0;
  }
  return 0;
}

function toIsoString(value: unknown): string | null {
  if (
    value &&
    typeof value === 'object' &&
    'toDate' in (value as Record<string, unknown>) &&
    typeof (value as { toDate: () => Date }).toDate === 'function'
  ) {
    const d = (value as { toDate: () => Date }).toDate();
    return typeof d.toISOString === 'function' ? d.toISOString() : null;
  }
  return null;
}

// GET: Fetch pending approvals
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    // Get client's projects first
    const projectsRef = adminDb.collection('projects');
    const projectsSnapshot = await projectsRef
      .where('clientEmail', '==', session.user.email)
      .get();

    const clientProjectIds = projectsSnapshot.docs.map(doc => doc.id);

    if (clientProjectIds.length === 0) {
      return NextResponse.json({ 
        success: true, 
        approvals: [],
        total: 0 
      });
    }

    // Build query for approvals
    const baseQuery = adminDb.collection('approvals')
      .where('status', 'in', ['pending', 'reviewing', 'needs_revision']);

    let docs: Array<
      FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
    > = [];
    if (projectId && clientProjectIds.includes(projectId)) {
      const snapshot = await baseQuery
        .where('projectId', '==', projectId)
        .orderBy('deadline', 'asc')
        .get();
      docs = snapshot.docs;
    } else {
      // Firestore 'in' has limit 10 values; chunk project ids
      const chunkSize = 10;
      for (let i = 0; i < clientProjectIds.length; i += chunkSize) {
        const chunk = clientProjectIds.slice(i, i + chunkSize);
        const snapshot = await baseQuery
          .where('projectId', 'in', chunk)
          .orderBy('deadline', 'asc')
          .get();
        docs = docs.concat(snapshot.docs);
      }
      // De-duplicate by doc id if overlaps
      const map = new Map<
        string,
        FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
      >(docs.map(d => [d.id, d]));
      docs = Array.from(map.values());
      // Sort by deadline ascending
      docs.sort((a, b) => toEpochMs(a.data().deadline) - toEpochMs(b.data().deadline));
    }

    const approvals = docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: toIsoString(doc.data().createdAt),
      updatedAt: toIsoString(doc.data().updatedAt),
      deadline: toIsoString(doc.data().deadline),
    }));

    return NextResponse.json({ 
      success: true, 
      approvals,
      total: approvals.length 
    });

  } catch (error) {
    console.error('Approvals API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch approvals' }, 
      { status: 500 }
    );
  }
}

// PUT: Update approval status
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { approvalId, status, feedback, comment, attachments } = await req.json();

    // Validation
    if (!approvalId || (!status && !comment && !attachments)) {
      return NextResponse.json(
        { error: 'Approval ID and (status or comment/attachments) are required' }, 
        { status: 400 }
      );
    }

    if (status && !APPROVAL_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Get approval document
    const approvalDoc = await adminDb.collection('approvals').doc(approvalId).get();
    
    if (!approvalDoc.exists) {
      return NextResponse.json({ error: 'Approval not found' }, { status: 404 });
    }

    // Verify client has access to this approval
    const projectId = approvalDoc.data()?.projectId;
    const projectDoc = await adminDb.collection('projects').doc(projectId).get();
    
    if (!projectDoc.exists || projectDoc.data()?.clientEmail !== session.user.email) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Build update
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };
    if (status) {
      updateData.status = status;
      updateData.feedback = feedback || '';
      updateData.reviewedBy = session.user.email;
      updateData.reviewedAt = new Date();
    }
    if (comment && typeof comment === 'string' && comment.trim()) {
      const commentObj = {
        author: session.user.email,
        message: comment.trim(),
        createdAt: new Date().toISOString(),
      };
      updateData.comments = FieldValue.arrayUnion(commentObj);
    }
    if (Array.isArray(attachments) && attachments.length > 0) {
      type InAttachment = { url?: unknown; label?: unknown; type?: unknown; size?: unknown };
      const safe = (attachments as InAttachment[])
        .filter((a) => a && typeof a.url === 'string')
        .map((a) => ({
          url: a.url as string,
          label: typeof a.label === 'string' ? (a.label as string) : undefined,
          type: typeof a.type === 'string' && ['link', 'image', 'video', 'document'].includes(a.type as string) ? (a.type as 'link'|'image'|'video'|'document') : 'link',
          size: typeof a.size === 'number' ? (a.size as number) : undefined,
        }));
      if (safe.length > 0) {
        updateData.attachments = FieldValue.arrayUnion(...safe);
      }
    }

    await adminDb.collection('approvals').doc(approvalId).update(updateData);

    // Create a notification about the approval update (best-effort)
    try {
      const approvalData = approvalDoc.data() as Record<string, unknown>;
      const notifTitle = 'تم تحديث حالة الموافقة';
      const statusLabel = typeof status === 'string' ? status : (approvalData?.status as string);
      const notifMessage = `${(approvalData?.title as string) || 'موافقة'} — الحالة: ${statusLabel || 'محدّثة'}`;
      await adminDb.collection('notifications').add({
        title: notifTitle,
        message: notifMessage,
        type: 'approval_update',
        priority: 'medium',
        clientEmail: projectDoc.data()?.clientEmail || session.user.email,
        projectId,
        read: false,
        createdAt: new Date(),
      });
    } catch {}

    return NextResponse.json({ 
      success: true, 
      message: 'Approval updated successfully' 
    });

  } catch (error) {
    console.error('Update Approval Error:', error);
    return NextResponse.json(
      { error: 'Failed to update approval' }, 
      { status: 500 }
    );
  }
}
