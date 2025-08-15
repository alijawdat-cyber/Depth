import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
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
    const allowed = ['application/pdf', 'application/zip'];
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
    // Keep presign minimal: sign only the host header. Payload hash stays UNSIGNED-PAYLOAD
    const signedHeaders = 'host';
    const payloadHashHex = 'UNSIGNED-PAYLOAD';

    // Build canonical query for presigned PUT
    const baseQuery: Record<string, string> = {
      'X-Amz-Algorithm': algorithm,
      'X-Amz-Credential': `${env.R2_ACCESS_KEY_ID}/${credentialScope}`,
      'X-Amz-Date': amzDate,
      'X-Amz-Expires': '300',
      'X-Amz-SignedHeaders': signedHeaders,
    };
    const canonicalQuery = Object.keys(baseQuery)
      .sort()
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(baseQuery[k])}`)
      .join('&');

    const canonicalRequest = [
      'PUT',
      urlPath,
      canonicalQuery,
      `host:${host}`,
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

    // Preserve byte-for-byte canonical query in final URL
    const signedUrl = `https://${host}${urlPath}?${canonicalQuery}&X-Amz-Signature=${signature}`;

    return NextResponse.json({ url: signedUrl, key });
  } catch {
    return NextResponse.json({ error: 'Failed to presign' }, { status: 500 });
  }
}


// GET: Presign a GET URL for downloading a key
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    const expires = searchParams.get('expires') || '300';
    const filename = searchParams.get('filename') || undefined;
    if (!key) return NextResponse.json({ error: 'Key is required' }, { status: 400 });

    // Verify ownership: find file by key (stored as url for documents), then check project ownership
    const fileSnap = await adminDb
      .collection('files')
      .where('url', '==', key)
      .limit(1)
      .get();
    if (fileSnap.empty) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    const fileData = fileSnap.docs[0].data() as { projectId?: string };
    const projectId = fileData?.projectId;
    if (!projectId) {
      return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
    }
    const projectDoc = await adminDb.collection('projects').doc(projectId).get();
    if (!projectDoc.exists) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    const isAdmin = (session.user as unknown as { role?: string })?.role === 'admin';
    const projectOwner = (projectDoc.data() as { clientEmail?: string })?.clientEmail;
    if (!isAdmin && projectOwner !== session.user.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

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

    // Build canonical query with response-content-disposition if filename provided
    const disposition = filename
      ? `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`
      : undefined;
    const baseQuery: Record<string, string> = {
      'X-Amz-Algorithm': algorithm,
      'X-Amz-Credential': `${env.R2_ACCESS_KEY_ID}/${credentialScope}`,
      'X-Amz-Date': amzDate,
      'X-Amz-Expires': String(expires),
      'X-Amz-SignedHeaders': 'host',
    };
    if (disposition) baseQuery['response-content-disposition'] = disposition;

    const canonicalQuery = Object.keys(baseQuery)
      .sort()
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(baseQuery[k])}`)
      .join('&');

    const canonicalRequest = [
      'GET',
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

    // Preserve byte-for-byte canonical query in final URL
    const signedUrl = `https://${host}${urlPath}?${canonicalQuery}&X-Amz-Signature=${signature}`;

    return NextResponse.json({ url: signedUrl });
  } catch {
    return NextResponse.json({ error: 'Failed to presign (GET)' }, { status: 500 });
  }
}

