// Client-safe Cloudflare helpers (no server env imports)

const VAR_THUMB = process.env.NEXT_PUBLIC_CF_IMAGES_VARIANT_THUMB || 'thumb';
const VAR_PREVIEW = process.env.NEXT_PUBLIC_CF_IMAGES_VARIANT_PREVIEW || 'public';
const VAR_HERO = process.env.NEXT_PUBLIC_CF_IMAGES_VARIANT_HERO || 'hero';

export function cloudflareImageUrl(
  imageId: string,
  variant: 'thumb' | 'preview' | 'hero' = 'preview'
) {
  const hash = process.env.NEXT_PUBLIC_CF_IMAGES_ACCOUNT_HASH || '';
  if (!hash) return '';
  const map: Record<string, string> = { thumb: VAR_THUMB, preview: VAR_PREVIEW, hero: VAR_HERO };
  const v = map[variant] || variant;
  return `https://imagedelivery.net/${hash}/${imageId}/${v}`;
}

export function cloudflareStreamIframeUrl(videoId: string) {
  return `https://iframe.videodelivery.net/${videoId}`;
}


