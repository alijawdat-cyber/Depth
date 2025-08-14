// NextAuth Configuration
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { FirestoreAdapter } from '@auth/firebase-adapter';
import { cert } from 'firebase-admin/app';
import { resend } from '@/lib/email/resend';

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
        // Always derive role from the CURRENT user's email to avoid leaking previous sessions' roles
        token.role = emailFirst === 'admin@depth-agency.com' ? 'admin' : 'client';
      }
      // Ensure role is derived even when `user` is undefined (subsequent JWT calls)
      if (!token.role && token.email) {
        const emailFallback = String(token.email).toLowerCase();
        token.role = emailFallback === 'admin@depth-agency.com' ? 'admin' : 'client';
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
    async signIn({ user, account, profile, email, credentials }) {
      // Always allow sign-in; redirect logic handled in redirect callback
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
};
