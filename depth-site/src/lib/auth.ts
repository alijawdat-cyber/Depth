// NextAuth Configuration - النظام الموحد
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { FirestoreAdapter } from '@auth/firebase-adapter';
import { cert } from 'firebase-admin/app';
import { adminDb } from '@/lib/firebase/admin';
import bcrypt from 'bcryptjs';
import type { UnifiedUser } from '@/types/unified-user';

export const authOptions: NextAuthOptions = {
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  }),
  providers: [
    // Credentials Provider - النظام الموحد
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.toLowerCase();
        
        try {
          // البحث في النظام الموحد فقط
          const userQuery = await adminDb
            .collection('users')
            .where('email', '==', email)
            .limit(1)
            .get();

          if (userQuery.empty) {
            console.log(`[auth] لم يتم العثور على المستخدم: ${email}`);
            return null;
          }

          const userDoc = userQuery.docs[0];
          const userData = userDoc.data() as UnifiedUser;

          // التحقق من حالة الحساب
          if (userData.status === 'suspended' || userData.status === 'deleted') {
            console.log(`[auth] الحساب غير فعال: ${email} - الحالة: ${userData.status}`);
            return null;
          }

          // الحصول على كلمة المرور المشفرة من المجموعة المنفصلة
          const credentialDoc = await adminDb
            .collection('user_credentials')
            .doc(userDoc.id)
            .get();

          if (!credentialDoc.exists) {
            console.log(`[auth] لم يتم العثور على بيانات الاعتماد للمستخدم: ${email}`);
            return null;
          }

          const credentialData = credentialDoc.data();
          const hashedPassword = credentialData?.hashedPassword;

          if (!hashedPassword) {
            console.log(`[auth] كلمة المرور غير موجودة للمستخدم: ${email}`);
            return null;
          }

          // التحقق من كلمة المرور
          const isValidPassword = await bcrypt.compare(credentials.password, hashedPassword);
          
          if (!isValidPassword) {
            console.log(`[auth] كلمة مرور خاطئة للمستخدم: ${email}`);
            
            // زيادة عدد محاولات تسجيل الدخول الفاشلة
            const newAttempts = (userData.loginAttempts || 0) + 1;
            await adminDb.collection('users').doc(userDoc.id).update({
              loginAttempts: newAttempts,
              updatedAt: new Date().toISOString()
            });
            
            return null;
          }

          // تسجيل الدخول الناجح - تحديث البيانات
          await adminDb.collection('users').doc(userDoc.id).update({
            lastLoginAt: new Date().toISOString(),
            loginAttempts: 0,
            updatedAt: new Date().toISOString()
          });

          console.log(`✅ تسجيل دخول ناجح: ${email} - الدور: ${userData.role}`);

          return {
            id: userDoc.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            image: userData.avatar || null
          };

        } catch (error) {
          console.error('[auth.credentials] خطأ في التحقق:', error);
          return null;
        }
      }
    }),
    
    // Google Provider
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
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 30, // 30 يوماً
    updateAge: 60 * 60 * 24,   // تحديث كل 24 ساعة
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // عند تسجيل الدخول الأول
      if (user) {
        token.userId = user.id;
        token.role = (user as { role?: string }).role;
      }
      
      // ضمان وجود الدور حتى في الاستدعاءات اللاحقة
      if (!token.role && token.email) {
        token.role = await getUserRole(String(token.email));
      }
      
      // السماح بتحديث الدور من العميل إذا لزم الأمر
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
    }
  }
};

// دالة مساعدة للحصول على دور المستخدم من النظام الموحد
async function getUserRole(email: string): Promise<string> {
  try {
    const userQuery = await adminDb
      .collection('users')
      .where('email', '==', email.toLowerCase())
      .limit(1)
      .get();

    if (!userQuery.empty) {
      const userData = userQuery.docs[0].data() as UnifiedUser;
      return userData.role;
    }
    
    return 'guest'; // دور افتراضي
  } catch (error) {
    console.error('[auth] خطأ في الحصول على دور المستخدم:', error);
    return 'guest';
  }
}

export { getUserRole };
