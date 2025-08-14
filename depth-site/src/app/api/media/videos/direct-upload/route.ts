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
    const { uploadURL, videoId } = await createCloudflareStreamDirectUpload();
    return NextResponse.json({ uploadURL, videoId });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create video upload URL' }, { status: 500 });
  }
}


