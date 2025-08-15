import { env } from '@/lib/env';

export type CFDirectUploadResponse = {
  success: boolean;
  result?: { uploadURL: string; id: string };
  errors?: unknown[];
};
export type CFStreamDirectUploadResponse = {
  success: boolean;
  result?: { uploadURL: string; uid: string };
  errors?: unknown[];
};

export async function createCloudflareDirectUpload(metadata?: Record<string, unknown>) {
  if (!env.CF_ACCOUNT_ID || !env.CF_API_TOKEN) {
    throw new Error('Cloudflare credentials are missing');
  }
  
  // Additional validation
  if (!env.CF_IMAGES_ACCOUNT_HASH) {
    console.warn('CF_IMAGES_ACCOUNT_HASH is missing - image URLs may not work properly');
  }
  const url = `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/images/v1/direct_upload`;
  
  // v1 API works with simple POST request, no form-data needed for direct upload URL creation
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.CF_API_TOKEN}`,
    },
    cache: 'no-store',
  });
  const data = (await res.json()) as CFDirectUploadResponse;
  if (!data?.success || !data.result?.uploadURL) {
    throw new Error('Failed to create Cloudflare direct upload URL');
  }
  const result = data.result;
  // attach metadata if provided (no-op for v1; kept for future auditing)
  if (metadata && typeof metadata === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    metadata;
  }
  return result;
}

export function cloudflareImageUrl(imageId: string, variant: 'thumb' | 'preview' | 'hero' = 'preview') {
  if (!env.CF_IMAGES_ACCOUNT_HASH) return '';
  return `https://imagedelivery.net/${env.CF_IMAGES_ACCOUNT_HASH}/${imageId}/${variant}`;
}

export async function createCloudflareStreamDirectUpload(name?: string) {
  if (!env.CF_ACCOUNT_ID || !env.CF_STREAM_API_TOKEN) {
    throw new Error('Cloudflare Stream credentials are missing');
  }
  const url = `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/stream/direct_upload`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.CF_STREAM_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ maxDurationSeconds: 3600, meta: name ? { name } : undefined }),
    cache: 'no-store',
  });
  const data = (await res.json()) as CFStreamDirectUploadResponse;
  if (!data?.success || !data.result?.uploadURL || !data.result?.uid) {
    throw new Error('Failed to create Cloudflare Stream direct upload URL');
  }
  return { uploadURL: data.result.uploadURL, videoId: data.result.uid };
}

export function cloudflareStreamIframeUrl(videoId: string) {
  // Public playback URL (no secret): https://iframe.videodelivery.net/<videoId>
  return `https://iframe.videodelivery.net/${videoId}`;
}


