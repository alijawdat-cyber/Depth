import { Resend } from 'resend';
import { env } from '@/lib/env';

// Safe Resend instance for build/runtime without API key (no-op in dev/staging)
type ResendLike = Resend | { emails: { send: (...args: unknown[]) => Promise<unknown> } };

export const resend: ResendLike = env.RESEND_API_KEY
  ? new Resend(env.RESEND_API_KEY)
  : {
      emails: {
        // no-op sender to avoid build-time failures when key is missing
        async send() {
          return { id: 'resend-dry-run', skipped: true };
        },
      },
    };


