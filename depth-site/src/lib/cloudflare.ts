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
  const url = `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/images/v2/direct_upload`;
  const body = new URLSearchParams();
  body.set('requireSignedURLs', 'false');
  if (metadata) {
    body.set('metadata', JSON.stringify(metadata));
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.CF_API_TOKEN}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
    cache: 'no-store',
  });
  const data = (await res.json()) as CFDirectUploadResponse;
  if (!data?.success || !data.result?.uploadURL) {
    throw new Error('Failed to create Cloudflare direct upload URL');
  }
  return data.result;
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


