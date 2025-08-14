import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createCloudflareStreamDirectUpload } from '@/lib/cloudflare';

// POST /api/media/videos/direct-upload
// Returns: { uploadURL, videoId }
export async function POST(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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


