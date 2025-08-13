// Client Portal - Approvals API
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-admin';

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
    let approvalsQuery = adminDb.collection('approvals')
      .where('status', 'in', ['pending', 'reviewing']);

    if (projectId && clientProjectIds.includes(projectId)) {
      approvalsQuery = approvalsQuery.where('projectId', '==', projectId);
    } else {
      approvalsQuery = approvalsQuery.where('projectId', 'in', clientProjectIds);
    }

    const snapshot = await approvalsQuery
      .orderBy('deadline', 'asc')
      .get();

    const approvals = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
      deadline: doc.data().deadline?.toDate?.()?.toISOString() || null,
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
