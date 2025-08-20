// Client - Files API
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { env } from '@/lib/env';
import { FILE_STATUSES, FILE_TYPES } from '@/types/entities';

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
    const allowedStatuses = FILE_STATUSES.filter(s => s !== 'deleted');
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
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ ok: false, code: 'UNAUTHORIZED', message: 'Unauthorized', requestId }, { status: 401 });
    }

    const body = await req.json();
    const { name, type, size, projectId, url, description, imageId, videoId, contentType, checksum } = body || {};

    // Validation (400)
    if (!name || !type || !projectId) {
      return NextResponse.json({ ok: false, code: 'VALIDATION_ERROR', message: 'Name, type, and projectId are required', requestId }, { status: 400 });
    }
    if (!FILE_TYPES.includes(type)) {
      return NextResponse.json({ ok: false, code: 'VALIDATION_ERROR', message: 'Invalid file type', requestId }, { status: 400 });
    }
    if (type === 'document' && !url) {
      return NextResponse.json({ ok: false, code: 'VALIDATION_ERROR', message: 'Document URL is required', requestId }, { status: 400 });
    }

    // Derive final URL when not provided for media types
    let finalUrl: string | undefined = url;
    if (!finalUrl) {
      if (type === 'image' && imageId && env.CF_IMAGES_ACCOUNT_HASH) {
        const variant = env.CF_IMAGES_VARIANT_PREVIEW || 'public';
        finalUrl = `https://imagedelivery.net/${env.CF_IMAGES_ACCOUNT_HASH}/${imageId}/${variant}`;
      } else if (type === 'video' && videoId) {
        finalUrl = `https://iframe.videodelivery.net/${videoId}`;
      }
    }

    // Access check (403/404)
    const projectDoc = await adminDb.collection('projects').doc(projectId).get();
    const isAdmin = (session.user as unknown as { role?: string })?.role === 'admin';
    if (!projectDoc.exists) {
      return NextResponse.json({ ok: false, code: 'PROJECT_NOT_FOUND', message: 'Project not found', requestId }, { status: 404 });
    }
    if (!isAdmin && projectDoc.data()?.clientEmail !== session.user.email) {
      return NextResponse.json({ ok: false, code: 'FORBIDDEN_PROJECT', message: 'You do not have access to this project', requestId }, { status: 403 });
    }

    // Create file record in Firestore
    // Build Firestore document without undefined values
    const baseData = {
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
    } as Record<string, unknown>;
    if (typeof contentType === 'string') baseData.contentType = contentType;
    if (typeof checksum === 'string') baseData.checksum = checksum;
    if (typeof imageId === 'string') baseData.imageId = imageId;
    if (typeof videoId === 'string') baseData.videoId = videoId;
    const fileData = baseData;

    const docRef = await adminDb.collection('files').add(fileData);

    // Notification (best-effort)
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

    return NextResponse.json({ ok: true, code: 'SAVED', fileId: docRef.id, message: 'File uploaded successfully', requestId });

  } catch (error) {
    // When metadata saving fails but upload already succeeded (client provides imageId/videoId), return 202 to allow client retry
    try {
      const body = await req.clone().json().catch(() => ({}));
      const hasExternalUploadId = typeof body?.imageId === 'string' || typeof body?.videoId === 'string';
      const payload = { ok: false as const, requestId, code: hasExternalUploadId ? 'UPLOAD_OK_METADATA_PENDING' : 'SERVER_ERROR', message: hasExternalUploadId ? 'Upload completed. Metadata pending to be saved.' : 'Failed to upload file' };
      console.error('Upload File Error:', { requestId, error });
      return NextResponse.json(payload, { status: hasExternalUploadId ? 202 : 500 });
    } catch {
      console.error('Upload File Error (no body parse):', { requestId, error });
      return NextResponse.json({ ok: false, code: 'SERVER_ERROR', message: 'Failed to upload file', requestId }, { status: 500 });
    }
  }
}
