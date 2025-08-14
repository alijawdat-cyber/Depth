import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createCloudflareDirectUpload } from '@/lib/cloudflare';

// POST /api/media/images/direct-upload
// Returns: { uploadURL, id }
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, contentType, size } = await req.json();

    // Basic server-side validation (final enforcement is at Cloudflare)
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (contentType && !allowed.includes(contentType)) {
      return NextResponse.json({ error: 'نوع الملف غير مدعوم' }, { status: 400 });
    }
    if (size && Number(size) > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'الحجم أكبر من 50MB' }, { status: 400 });
    }

    const meta = {
      owner: session.user.email,
      projectId: projectId || 'unknown',
    };
    const { uploadURL, id } = await createCloudflareDirectUpload(meta);
    return NextResponse.json({ uploadURL, id });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create upload URL' }, { status: 500 });
  }
}


