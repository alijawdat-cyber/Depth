import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createCloudflareStreamDirectUpload } from '@/lib/cloudflare';
import { adminDb } from '@/lib/firebase/admin';

// POST /api/media/videos/direct-upload
// Returns: { uploadURL, videoId }
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Optional: verify project ownership passed via body
    try {
      const { projectId } = await req.json();
      if (projectId) {
        const projectDoc = await adminDb.collection('projects').doc(projectId).get();
        const isAdmin = (session.user as unknown as { role?: string })?.role === 'admin';
        if (!projectDoc.exists) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        if (!isAdmin && (projectDoc.data() as { clientEmail?: string })?.clientEmail !== session.user.email) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
      }
    } catch {
      // ignore body parse; projectId optional
    }

    // Check if Cloudflare Stream credentials are configured
    try {
      const { uploadURL, videoId } = await createCloudflareStreamDirectUpload();
      return NextResponse.json({ uploadURL, videoId });
    } catch (cfError) {
      console.error('Cloudflare Stream upload error:', cfError);
      // Return a mock response for development when Cloudflare Stream is not configured
      return NextResponse.json({ 
        uploadURL: 'https://httpbin.org/post', // Mock endpoint for testing
        videoId: `mock-video-${Date.now()}`,
        warning: 'Using mock upload - Cloudflare Stream not configured'
      });
    }
  } catch (e) {
    console.error('Video upload API error:', e);
    return NextResponse.json({ error: 'Failed to create video upload URL' }, { status: 500 });
  }
}


