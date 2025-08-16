import { z } from 'zod';

// Sanitize helper: trim and normalize, but preserve `undefined` for optional vars
const sanitize = (value?: string) => {
  if (value == null) return undefined;
  const trimmed = String(value).replace(/\r/g, '').trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const EnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  // NextAuth
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(1).optional(),
  // Firebase Admin
  FIREBASE_PROJECT_ID: z.string().min(1),
  FIREBASE_CLIENT_EMAIL: z.string().email(),
  FIREBASE_PRIVATE_KEY: z.string().min(1),
  // Firebase Client (public)
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().optional(),
  // Resend (optional in development)
  RESEND_API_KEY: z.string().min(1).optional(),
  EMAIL_FROM: z.string().optional(),
  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  // Cloudflare Images/Stream
  CF_ACCOUNT_ID: z.string().optional(),
  CF_IMAGES_ACCOUNT_HASH: z.string().optional(),
  CF_API_TOKEN: z.string().optional(),
  // Cloudflare Images variants (optional; defaults applied if missing)
  CF_IMAGES_VARIANT_THUMB: z.string().optional(),
  CF_IMAGES_VARIANT_PREVIEW: z.string().optional(),
  CF_IMAGES_VARIANT_HERO: z.string().optional(),
  // Cloudflare Stream
  CF_STREAM_API_TOKEN: z.string().optional(),
  CF_STREAM_CUSTOMER_SUBDOMAIN: z.string().optional(),
  // R2 (S3-compatible)
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET: z.string().optional(),
  // Debug
  DEBUG_PRESIGN: z.string().optional(),
  // Upstash Redis (Rate limiting)
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  // SMTP (optional depending on provider)
  EMAIL_SERVER_HOST: z.string().optional(),
  EMAIL_SERVER_PORT: z.coerce.number().optional(),
  EMAIL_SERVER_USER: z.string().optional(),
  EMAIL_SERVER_PASSWORD: z.string().optional(),
});

export const env = EnvSchema.parse({
  NEXT_PUBLIC_SITE_URL: sanitize(process.env.NEXT_PUBLIC_SITE_URL),
  NEXTAUTH_URL: sanitize(process.env.NEXTAUTH_URL),
  NEXTAUTH_SECRET: sanitize(process.env.NEXTAUTH_SECRET),
  FIREBASE_PROJECT_ID: sanitize(process.env.FIREBASE_PROJECT_ID),
  FIREBASE_CLIENT_EMAIL: sanitize(process.env.FIREBASE_CLIENT_EMAIL),
  FIREBASE_PRIVATE_KEY: sanitize(process.env.FIREBASE_PRIVATE_KEY),
  NEXT_PUBLIC_FIREBASE_API_KEY: sanitize(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: sanitize(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: sanitize(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: sanitize(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: sanitize(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  NEXT_PUBLIC_FIREBASE_APP_ID: sanitize(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
  RESEND_API_KEY: sanitize(process.env.RESEND_API_KEY) || undefined,
  EMAIL_FROM: sanitize(process.env.EMAIL_FROM),
  GOOGLE_CLIENT_ID: sanitize(process.env.GOOGLE_CLIENT_ID),
  GOOGLE_CLIENT_SECRET: sanitize(process.env.GOOGLE_CLIENT_SECRET),
  CF_ACCOUNT_ID: sanitize(process.env.CF_ACCOUNT_ID),
  CF_IMAGES_ACCOUNT_HASH: sanitize(process.env.CF_IMAGES_ACCOUNT_HASH),
  CF_API_TOKEN: sanitize(process.env.CF_API_TOKEN),
  CF_IMAGES_VARIANT_THUMB: sanitize(process.env.CF_IMAGES_VARIANT_THUMB),
  CF_IMAGES_VARIANT_PREVIEW: sanitize(process.env.CF_IMAGES_VARIANT_PREVIEW),
  CF_IMAGES_VARIANT_HERO: sanitize(process.env.CF_IMAGES_VARIANT_HERO),
  CF_STREAM_API_TOKEN: sanitize(process.env.CF_STREAM_API_TOKEN),
  CF_STREAM_CUSTOMER_SUBDOMAIN: sanitize(process.env.CF_STREAM_CUSTOMER_SUBDOMAIN),
  R2_ACCOUNT_ID: sanitize(process.env.R2_ACCOUNT_ID),
  R2_ACCESS_KEY_ID: sanitize(process.env.R2_ACCESS_KEY_ID),
  R2_SECRET_ACCESS_KEY: sanitize(process.env.R2_SECRET_ACCESS_KEY),
  R2_BUCKET: sanitize(process.env.R2_BUCKET),
  DEBUG_PRESIGN: sanitize(process.env.DEBUG_PRESIGN),
  UPSTASH_REDIS_REST_URL: sanitize(process.env.UPSTASH_REDIS_REST_URL),
  UPSTASH_REDIS_REST_TOKEN: sanitize(process.env.UPSTASH_REDIS_REST_TOKEN),
  EMAIL_SERVER_HOST: sanitize(process.env.EMAIL_SERVER_HOST),
  EMAIL_SERVER_PORT: sanitize(process.env.EMAIL_SERVER_PORT),
  EMAIL_SERVER_USER: sanitize(process.env.EMAIL_SERVER_USER),
  EMAIL_SERVER_PASSWORD: sanitize(process.env.EMAIL_SERVER_PASSWORD),
});


