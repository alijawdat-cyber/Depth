// Client Portal - Approvals API
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

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

    const { approvalId, status, feedback } = await req.json();

    // Validation
    if (!approvalId || !status) {
      return NextResponse.json(
        { error: 'Approval ID and status are required' }, 
        { status: 400 }
      );
    }

    if (!['approved', 'rejected', 'needs_revision'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' }, 
        { status: 400 }
      );
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

    // Update approval
    const updateData = {
      status,
      feedback: feedback || '',
      reviewedBy: session.user.email,
      reviewedAt: new Date(),
      updatedAt: new Date(),
    };

    await adminDb.collection('approvals').doc(approvalId).update(updateData);

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
