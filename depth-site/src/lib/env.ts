import { z } from 'zod';

// Sanitize helper to remove accidental newlines/CR and surrounding whitespace
const sanitize = (value?: string) =>
  (value ?? '')
    .replace(/\r/g, '')
    .trim();

const EnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  // Firebase Admin
  FIREBASE_PROJECT_ID: z.string().min(1),
  FIREBASE_CLIENT_EMAIL: z.string().email(),
  FIREBASE_PRIVATE_KEY: z.string().min(1),
  // Resend
  RESEND_API_KEY: z.string().min(1),
  // SMTP (optional depending on provider)
  EMAIL_SERVER_HOST: z.string().optional(),
  EMAIL_SERVER_PORT: z.coerce.number().optional(),
  EMAIL_SERVER_USER: z.string().optional(),
  EMAIL_SERVER_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
});

export const env = EnvSchema.parse({
  NEXT_PUBLIC_SITE_URL: sanitize(process.env.NEXT_PUBLIC_SITE_URL),
  FIREBASE_PROJECT_ID: sanitize(process.env.FIREBASE_PROJECT_ID),
  FIREBASE_CLIENT_EMAIL: sanitize(process.env.FIREBASE_CLIENT_EMAIL),
  FIREBASE_PRIVATE_KEY: sanitize(process.env.FIREBASE_PRIVATE_KEY),
  RESEND_API_KEY: sanitize(process.env.RESEND_API_KEY),
  EMAIL_SERVER_HOST: sanitize(process.env.EMAIL_SERVER_HOST),
  EMAIL_SERVER_PORT: sanitize(process.env.EMAIL_SERVER_PORT),
  EMAIL_SERVER_USER: sanitize(process.env.EMAIL_SERVER_USER),
  EMAIL_SERVER_PASSWORD: sanitize(process.env.EMAIL_SERVER_PASSWORD),
  EMAIL_FROM: sanitize(process.env.EMAIL_FROM),
});


