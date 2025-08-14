// Client-safe Cloudflare helpers (no server env imports)

export function cloudflareImageUrl(
  imageId: string,
  variant: 'thumb' | 'preview' | 'hero' = 'preview'
) {
  const hash =
    process.env.NEXT_PUBLIC_CF_IMAGES_ACCOUNT_HASH || '';
  if (!hash) return '';
  return `https://imagedelivery.net/${hash}/${imageId}/${variant}`;
}

export function cloudflareStreamIframeUrl(videoId: string) {
  return `https://iframe.videodelivery.net/${videoId}`;
}


