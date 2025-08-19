// بسيط: Rate limiting باستخدام Firestore (نافذة زمنية قصيرة)
// ملاحظة: حل أولي؛ للأداء والإستقرار في الإنتاج يفضل Redis أو Upstash.
import { adminDb } from '@/lib/firebase/admin';

interface RateLimitOptions {
  key: string;            // مفتاح فريد (ip:route)
  limit: number;          // عدد الطلبات المسموحة داخل النافذة
  windowMs: number;       // طول النافذة بالمللي ثانية
}

export async function checkRateLimit(opts: RateLimitOptions): Promise<{ allowed: boolean; remaining: number; resetAt: number; count: number; }>{
  const now = Date.now();
  const windowStart = now - opts.windowMs;
  const ref = adminDb.collection('rate_limits').doc(opts.key);
  const snap = await ref.get();

  let data: { count: number; firstHit: number };
  if (!snap.exists) {
    data = { count: 1, firstHit: now };
    await ref.set(data);
    return { allowed: true, remaining: opts.limit - 1, resetAt: now + opts.windowMs, count: 1 };
  }
  data = snap.data() as { count: number; firstHit: number };
  if (data.firstHit < windowStart) {
    // نافذة جديدة
    data = { count: 1, firstHit: now };
    await ref.set(data);
    return { allowed: true, remaining: opts.limit - 1, resetAt: now + opts.windowMs, count: 1 };
  }
  if (data.count >= opts.limit) {
    return { allowed: false, remaining: 0, resetAt: data.firstHit + opts.windowMs, count: data.count };
  }
  data.count += 1;
  await ref.update({ count: data.count });
  return { allowed: true, remaining: opts.limit - data.count, resetAt: data.firstHit + opts.windowMs, count: data.count };
}

export function extractClientIp(headers: Headers): string {
  const xf = headers.get('x-forwarded-for');
  if (xf) return xf.split(',')[0].trim();
  return 'unknown';
}
