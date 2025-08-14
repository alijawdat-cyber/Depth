// Client Portal - Files API
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { env } from '@/lib/env';

// Helpers to safely handle Firestore Timestamp values without `any`
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
    // Avoid inequality on status; filter inclusive statuses instead
    const allowedStatuses = ['uploaded', 'processing', 'approved', 'reviewing'];
    const snapshot = await filesRef
      .where('projectId', '==', projectId)
      .where('status', 'in', allowedStatuses)
      .orderBy('createdAt', 'desc')
      .get();

    const files = snapshot.docs.map(doc => {
      const data = doc.data() as Record<string, unknown>;
      return {
        id: doc.id,
        ...data,
        size: typeof data.size === 'number' ? data.size : Number(data.size || 0),
        createdAt: toIsoString(data.createdAt),
        updatedAt: toIsoString(data.updatedAt),
      };
    });

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

    const { name, type, size, projectId, url, description, imageId, videoId } = await req.json();

    // Derive final URL when not provided for media types
    let finalUrl: string | undefined = url;
    if (!finalUrl) {
      if (type === 'image' && imageId && env.CF_IMAGES_ACCOUNT_HASH) {
        finalUrl = `https://imagedelivery.net/${env.CF_IMAGES_ACCOUNT_HASH}/${imageId}/preview`;
      } else if (type === 'video' && videoId) {
        finalUrl = `https://iframe.videodelivery.net/${videoId}`;
      }
    }

    // Validation
    if (!name || !type || !projectId) {
      return NextResponse.json(
        { error: 'Name, type, and project ID are required' },
        { status: 400 }
      );
    }
    // For documents we must have a direct URL/key
    if (type === 'document' && !url) {
      return NextResponse.json(
        { error: 'Document URL is required' },
        { status: 400 }
      );
    }

    // Verify access to this project: allow owner client or admin
    const projectDoc = await adminDb.collection('projects').doc(projectId).get();
    const isAdmin = (session.user as unknown as { role?: string })?.role === 'admin';
    if (!projectDoc.exists) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    if (!isAdmin && projectDoc.data()?.clientEmail !== session.user.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Create file record in Firestore
    const fileData = {
      name,
      type,
      size: typeof size === 'number' ? size : Number(size || 0),
      projectId,
      url: finalUrl || url || '',
      description: description || '',
      status: 'uploaded',
      uploadedBy: session.user.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await adminDb.collection('files').add(fileData);

    // Create a notification for the client about the new file upload
    try {
      const projectOwnerEmail = (projectDoc.data() as { clientEmail?: string })?.clientEmail || session.user.email;
      await adminDb.collection('notifications').add({
        title: 'تم رفع ملف جديد',
        message: `${name}`,
        type: 'file_upload',
        priority: 'medium',
        clientEmail: projectOwnerEmail,
        projectId,
        read: false,
        createdAt: new Date(),
      });
    } catch {}

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
