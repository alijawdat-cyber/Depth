// Client Portal - Files API
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

// GET: Fetch project files
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' }, 
        { status: 400 }
      );
    }

    // Verify access: allow owner client or admin to upload metadata
    const projectDoc = await adminDb.collection('projects').doc(projectId).get();
    const isAdmin = (session.user as unknown as { role?: string })?.role === 'admin';
    if (!projectDoc.exists) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    if (!isAdmin && projectDoc.data()?.clientEmail !== session.user.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get project files
    const filesRef = adminDb.collection('files');
    const snapshot = await filesRef
      .where('projectId', '==', projectId)
      .where('status', '!=', 'deleted')
      .orderBy('createdAt', 'desc')
      .get();

    const files = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
    }));

    return NextResponse.json({ 
      success: true, 
      files,
      total: files.length 
    });

  } catch (error) {
    console.error('Files API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files' }, 
      { status: 500 }
    );
  }
}

// POST: Upload file metadata (actual file upload handled separately)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, type, size, projectId, url, description } = await req.json();

    // Validation
    if (!name || !type || !projectId || !url) {
      return NextResponse.json(
        { error: 'Name, type, project ID, and URL are required' }, 
        { status: 400 }
      );
    }

    // Verify client has access to this project
    const projectDoc = await adminDb.collection('projects').doc(projectId).get();
    
    if (!projectDoc.exists || projectDoc.data()?.clientEmail !== session.user.email) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Create file record in Firestore
    const fileData = {
      name,
      type,
      size: size || 0,
      projectId,
      url,
      description: description || '',
      status: 'uploaded',
      uploadedBy: session.user.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await adminDb.collection('files').add(fileData);

    return NextResponse.json({ 
      success: true, 
      fileId: docRef.id,
      message: 'File uploaded successfully' 
    });

  } catch (error) {
    console.error('Upload File Error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' }, 
      { status: 500 }
    );
  }
}
