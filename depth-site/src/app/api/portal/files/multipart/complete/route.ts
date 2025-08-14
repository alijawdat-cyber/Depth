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

    const { key, uploadId, parts } = await req.json();
    if (!key || !uploadId || !Array.isArray(parts) || parts.length === 0) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    if (!env.R2_ACCOUNT_ID || !env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY || !env.R2_BUCKET) {
      return NextResponse.json({ error: 'R2 not configured' }, { status: 500 });
    }

    const host = `${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
    const urlPath = `/${env.R2_BUCKET}/${key}`;

    const region = 'auto';
    const service = 's3';
    const algorithm = 'AWS4-HMAC-SHA256';
    const iso = new Date().toISOString();
    const amzDate = iso.replace(/[:\-]/g, '').replace(/\..+Z$/, 'Z');
    const dateStamp = amzDate.slice(0, 8);

    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const signedHeaders = 'host';

    const baseQuery: Record<string, string> = {
      'X-Amz-Algorithm': algorithm,
      'X-Amz-Credential': `${env.R2_ACCESS_KEY_ID}/${credentialScope}`,
      'X-Amz-Date': amzDate,
      'X-Amz-Expires': '300',
      'X-Amz-SignedHeaders': signedHeaders,
      'uploadId': uploadId,
    };
    const canonicalQuery = Object.keys(baseQuery)
      .sort()
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(baseQuery[k])}`)
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

    const signedUrl = new URL(`https://${host}${urlPath}`);
    canonicalQuery.split('&').forEach(kv => {
      const [k, v] = kv.split('=');
      signedUrl.searchParams.set(decodeURIComponent(k), decodeURIComponent(v));
    });
    signedUrl.searchParams.set('X-Amz-Signature', signature as string);

    // Build XML body for CompleteMultipartUpload
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<CompleteMultipartUpload>` +
      parts.map((p: { PartNumber: number; ETag: string }) => `<Part><PartNumber>${p.PartNumber}</PartNumber><ETag>${p.ETag}</ETag></Part>`).join('') +
      `</CompleteMultipartUpload>`;

    const completeResp = await fetch(signedUrl.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
      body: xml,
    });
    if (!completeResp.ok) {
      const t = await completeResp.text();
      return NextResponse.json({ error: 'Failed to complete multipart', details: t }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to complete multipart' }, { status: 500 });
  }
}


