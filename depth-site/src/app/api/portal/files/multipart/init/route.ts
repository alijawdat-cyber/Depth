import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { env } from '@/lib/env';
import crypto from 'crypto';

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
    const allowed = ['application/pdf', 'application/zip'];
    if (!allowed.includes(contentType)) return NextResponse.json({ error: 'نوع الملف غير مدعوم' }, { status: 400 });
    if (Number(size) > 1_000 * 1024 * 1024) return NextResponse.json({ error: 'الحجم أكبر من 1GB' }, { status: 400 });

    if (!env.R2_ACCOUNT_ID || !env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY || !env.R2_BUCKET) {
      return NextResponse.json({ error: 'R2 not configured' }, { status: 500 });
    }

    const host = `${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
    const key = `${projectId || 'common'}/${Date.now()}-${encodeURIComponent(filename)}`;
    const urlPath = `/${env.R2_BUCKET}/${key}`;

    const region = 'auto';
    const service = 's3';
    const algorithm = 'AWS4-HMAC-SHA256';
    const iso = new Date().toISOString();
    const amzDate = iso.replace(/[:\-]/g, '').replace(/\..+Z$/, 'Z');
    const dateStamp = amzDate.slice(0, 8);

    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const signedHeaders = 'host';

    // Create presigned URL to initiate multipart: POST ?uploads
    const baseQuery: Record<string, string> = {
      'X-Amz-Algorithm': algorithm,
      'X-Amz-Credential': `${env.R2_ACCESS_KEY_ID}/${credentialScope}`,
      'X-Amz-Date': amzDate,
      'X-Amz-Expires': '300',
      'X-Amz-SignedHeaders': signedHeaders,
      'uploads': '',
    };
    const canonicalQuery = Object.keys(baseQuery)
      .sort()
      .map(k => (baseQuery[k] === '' ? `${encodeURIComponent(k)}=` : `${encodeURIComponent(k)}=${encodeURIComponent(baseQuery[k])}`))
      .join('&');

    const canonicalRequest = [
      'POST',
      urlPath,
      canonicalQuery,
      `host:${host}`,
      '',
      signedHeaders,
      'UNSIGNED-PAYLOAD',
    ].join('\n');

    const canonicalRequestHash = sha256(canonicalRequest, 'hex');
    const stringToSign = [algorithm, amzDate, credentialScope, canonicalRequestHash].join('\n');
    const kDate = hmac(`AWS4${env.R2_SECRET_ACCESS_KEY}`, dateStamp);
    const kRegion = hmac(kDate, region);
    const kService = hmac(kRegion, service);
    const kSigning = hmac(kService, 'aws4_request');
    const signature = hmac(kSigning, stringToSign, 'hex');

    // Preserve byte-for-byte canonical query in final URL (uploads must include trailing '=')
    const signedUrl = `https://${host}${urlPath}?${canonicalQuery}&X-Amz-Signature=${signature}`;

    // Call initiate URL to get UploadId (XML)
    const initResp = await fetch(signedUrl, { method: 'POST' });
    if (!initResp.ok) {
      const t = await initResp.text();
      return NextResponse.json({ error: 'Failed to initiate multipart', details: t }, { status: 500 });
    }
    const xml = await initResp.text();
    const match = xml.match(/<UploadId>(.+?)<\/UploadId>/i);
    const uploadId = match?.[1];
    if (!uploadId) return NextResponse.json({ error: 'No UploadId returned' }, { status: 500 });

    return NextResponse.json({ key, uploadId });
  } catch (error) {
    console.error('multipart init error', error);
    return NextResponse.json({ error: 'Failed to init multipart' }, { status: 500 });
  }
}


