import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import crypto from 'crypto';
import { env } from '@/lib/env';

// Simple S3-compatible presign for R2 using Signature V4
function hmac(key: Buffer | string, str: string, encoding?: crypto.BinaryToTextEncoding) {
  return crypto.createHmac('sha256', key).update(str).digest(encoding as crypto.BinaryToTextEncoding);
}

function sha256(str: string, encoding?: crypto.BinaryToTextEncoding) {
  return crypto.createHash('sha256').update(str).digest(encoding as crypto.BinaryToTextEncoding);
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { filename, contentType, size, projectId } = await req.json();
    const allowed = ['application/pdf', 'application/zip', 'image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
    if (!allowed.includes(contentType)) return NextResponse.json({ error: 'نوع الملف غير مدعوم' }, { status: 400 });
    if (Number(size) > 50 * 1024 * 1024) return NextResponse.json({ error: 'الحجم أكبر من 50MB' }, { status: 400 });

    if (!env.R2_ACCOUNT_ID || !env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY || !env.R2_BUCKET) {
      return NextResponse.json({ error: 'R2 not configured' }, { status: 500 });
    }

    const host = `${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
    const key = `${projectId || 'common'}/${Date.now()}-${encodeURIComponent(filename)}`;
    const urlPath = `/${env.R2_BUCKET}/${key}`;

    const region = 'auto';
    const service = 's3';
    const algorithm = 'AWS4-HMAC-SHA256';
    // Format amzDate as YYYYMMDDThhmmssZ (strip separators and milliseconds)
    const iso = new Date().toISOString(); // e.g. 2025-08-14T12:34:56.789Z
    const amzDate = iso.replace(/[:\-]/g, '').replace(/\..+Z$/, 'Z'); // 20250814T123456Z
    const dateStamp = amzDate.slice(0, 8);

    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';
    const payloadHashHex = sha256('', 'hex');

    const canonicalRequest = [
      'PUT',
      urlPath,
      '',
      `host:${host}`,
      `x-amz-content-sha256:${payloadHashHex}`,
      `x-amz-date:${amzDate}`,
      '',
      signedHeaders,
      payloadHashHex,
    ].join('\n');

    const canonicalRequestHash = sha256(canonicalRequest, 'hex');
    const stringToSign = [algorithm, amzDate, credentialScope, canonicalRequestHash].join('\n');
    const kDate = hmac(`AWS4${env.R2_SECRET_ACCESS_KEY}`, dateStamp);
    const kRegion = hmac(kDate, region);
    const kService = hmac(kRegion, service);
    const kSigning = hmac(kService, 'aws4_request');
    const signature = hmac(kSigning, stringToSign, 'hex');

    const signedUrl = new URL(`https://${host}${urlPath}`);
    signedUrl.searchParams.set('X-Amz-Algorithm', algorithm);
    signedUrl.searchParams.set('X-Amz-Credential', `${env.R2_ACCESS_KEY_ID}/${credentialScope}`);
    signedUrl.searchParams.set('X-Amz-Date', amzDate);
    signedUrl.searchParams.set('X-Amz-Expires', '300');
    signedUrl.searchParams.set('X-Amz-SignedHeaders', 'host;x-amz-content-sha256;x-amz-date');
    signedUrl.searchParams.set('X-Amz-Signature', signature as string);

    return NextResponse.json({ url: signedUrl.toString(), key });
  } catch {
    return NextResponse.json({ error: 'Failed to presign' }, { status: 500 });
  }
}


