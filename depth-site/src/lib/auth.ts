// NextAuth Configuration
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { FirestoreAdapter } from '@auth/firebase-adapter';
import { cert } from 'firebase-admin/app';
import { resend } from '@/lib/email/resend';
import { adminDb } from '@/lib/firebase/admin';

export const authOptions: NextAuthOptions = {
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  }),
  providers: [
    // Google provider is added only when valid credentials exist
    ...(process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    !process.env.GOOGLE_CLIENT_ID.startsWith('demo-')
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          }),
        ]
      : []),
    // Magic Link via Resend (no SMTP server required)
    EmailProvider({
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier, url, provider }) {
        const brandName = 'Depth Portal';
        const signInUrl = url;
        const html = `
          <div dir="rtl" lang="ar" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,'Dubai',sans-serif;background:#f7fafc;padding:24px">
            <table role="presentation" width="100%" style="max-width:560px;margin:auto;background:#ffffff;border:1px solid #e6eef5;border-radius:12px;overflow:hidden">
              <tr>
                <td style="padding:24px 24px 8px;color:#0f172a;font-size:18px;font-weight:700">${brandName}</td>
              </tr>
              <tr>
                <td style="padding:0 24px 8px;color:#475569;font-size:14px">الرابط صالح لمدة 15 دقيقة</td>
              </tr>
              <tr>
                <td style="padding:16px 24px;color:#0f172a;font-size:16px;line-height:1.7">
                  لإكمال تسجيل الدخول إلى البوابة، يُرجى الضغط على الزر التالي.
                </td>
              </tr>
              <tr>
                <td style="padding:8px 24px 24px">
                  <a href="${signInUrl}" style="display:inline-block;background:#6C4CF5;color:#fff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:600">تسجيل الدخول</a>
                </td>
              </tr>
              <tr>
                <td style="padding:0 24px 24px;color:#475569;font-size:13px;line-height:1.7">
                  إذا لم يعمل الزر، استخدم الرابط التالي خلال مدة الصلاحية:
                  <div style="margin-top:6px;word-break:break-all"><a href="${signInUrl}" style="color:#2563eb;text-decoration:underline">${signInUrl}</a></div>
                </td>
              </tr>
            </table>
            <div style="max-width:560px;margin:12px auto 0;text-align:center;color:#64748b;font-size:12px">
              إذا لم تطلب هذا البريد، يُرجى تجاهله.
            </div>
          </div>`;

        await resend.emails.send({
          from: provider.from ?? 'Depth <hello@depth-agency.com>',
          to: [identifier],
          subject: 'رابط تسجيل الدخول - Depth Portal',
          html,
        });
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    // إبقاء الجلسة فعّالة لفترة أطول لتجنب طلب تسجيل الدخول المتكرر
    maxAge: 60 * 60 * 24 * 60, // 60 يوماً
    updateAge: 60 * 60 * 24,   // حدّث التوكن كل 24 ساعة أثناء الاستخدام
  },
  pages: {
    signIn: '/portal/auth/signin',
    error: '/portal/auth/error',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Set role on first sign-in
      if (user) {
        token.userId = user.id;
        const emailFirst = (user.email || '').toLowerCase();
        // Derive role from env ADMIN_EMAILS (comma-separated), fallback to default admin
        const adminList = (process.env.ADMIN_EMAILS || 'admin@depth-agency.com')
          .split(',')
          .map(e => e.trim().toLowerCase())
          .filter(Boolean);
        token.role = adminList.includes(emailFirst) ? 'admin' : 'client';
      }
      // Ensure role is derived even when `user` is undefined (subsequent JWT calls)
      if (!token.role && token.email) {
        const emailFallback = String(token.email).toLowerCase();
        const adminList = (process.env.ADMIN_EMAILS || 'admin@depth-agency.com')
          .split(',')
          .map(e => e.trim().toLowerCase())
          .filter(Boolean);
        token.role = adminList.includes(emailFallback) ? 'admin' : 'client';
      }
      // allow role update from client if needed
      if (trigger === 'update' && session?.role) {
        token.role = session.role as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as Record<string, unknown>).id = token.userId as string;
        (session.user as Record<string, unknown>).role = token.role as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      try {
        const email = String(user?.email || '').toLowerCase();
        const provider = account?.provider || 'unknown';
        console.log('[auth.signIn] start', { email, provider });
        if (!email) return true;
        const adminList = (process.env.ADMIN_EMAILS || 'admin@depth-agency.com')
          .split(',')
          .map(e => e.trim().toLowerCase())
          .filter(Boolean);
        if (adminList.includes(email)) return true;
        // Ensure client exists (single source of truth)
        const snap = await adminDb
          .collection('clients')
          .where('email', '==', email)
          .limit(1)
          .get();
        if (snap.empty) {
          await adminDb.collection('clients').add({
            email,
            name: user?.name || '',
            phone: '',
            company: '',
            status: 'pending',
            role: 'client',
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      } catch (e) {
        console.error('[auth.signIn] provisioning error', e);
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      try {
        // If absolute url to same origin, keep
        const isInternal = url.startsWith(baseUrl);
        // For post-auth default, route admin to /admin, others to /portal
        if (isInternal && (url === baseUrl || url === `${baseUrl}/`)) {
          // We cannot read token here directly; rely on default route for admin via callbackUrl
          return `${baseUrl}/portal`;
        }
        return url;
      } catch {
        return `${baseUrl}/portal`;
      }
    }
  },
  events: {},
};
