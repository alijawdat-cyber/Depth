// NextAuth Configuration
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { FirestoreAdapter } from '@auth/firebase-adapter';
import { cert } from 'firebase-admin/app';
import { adminDb } from '@/lib/firebase/admin';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  }),
  providers: [
    // Credentials Provider for Email + Password
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
          // البحث في جميع المجموعات
          const collections = ['clients', 'creators', 'employees'];
          
          for (const collectionName of collections) {
            const userQuery = await adminDb
              .collection(collectionName)
              .where('email', '==', email)
              .limit(1)
              .get();

            if (!userQuery.empty) {
              const userDoc = userQuery.docs[0];
              const userData = userDoc.data();
              
              // التحقق من كلمة المرور
              if (userData.password && await bcrypt.compare(credentials.password, userData.password)) {
                return {
                  id: userDoc.id,
                  email: userData.email,
                  name: userData.name || userData.fullName,
                  role: userData.role || collectionName.slice(0, -1) // clients -> client
                };
              }
            }
          }
          
          // البحث في creators collection للبريد في contact.email
          const creatorQuery = await adminDb
            .collection('creators')
            .where('contact.email', '==', email)
            .limit(1)
            .get();

          if (!creatorQuery.empty) {
            const creatorDoc = creatorQuery.docs[0];
            const creatorData = creatorDoc.data();
            
            if (creatorData.password && await bcrypt.compare(credentials.password, creatorData.password)) {
              return {
                id: creatorDoc.id,
                email: creatorData.contact.email,
                name: creatorData.fullName,
                role: 'creator'
              };
            }
          }
        } catch (error) {
          console.error('[auth.credentials] Error:', error);
        }
        
        return null;
      }
    }),
    
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
  ],
  session: {
    strategy: 'jwt',
    // إبقاء الجلسة فعّالة لفترة أطول لتجنب طلب تسجيل الدخول المتكرر
    maxAge: 60 * 60 * 24 * 60, // 60 يوماً
    updateAge: 60 * 60 * 24,   // حدّث التوكن كل 24 ساعة أثناء الاستخدام
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Set role on first sign-in
      if (user) {
        token.userId = user.id;
        token.role = (user as any).role || await determineUserRole(user.email || '');
      }
      
      // Ensure role is derived even when `user` is undefined (subsequent JWT calls)
      if (!token.role && token.email) {
        token.role = await determineUserRole(String(token.email));
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
        
        // للمصادقة بـ Google، تحقق من وجود المستخدم في النظام
        if (provider === 'google') {
          const userRole = await determineUserRole(email);
          
          // إذا لم يكن موجود في أي مجموعة، أنشئ عميل جديد
          if (userRole === 'client') {
            const clientSnap = await adminDb
              .collection('clients')
              .where('email', '==', email)
              .limit(1)
              .get();
              
            if (clientSnap.empty) {
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
          }
        }
        
        return true;
      } catch (e) {
        console.error('[auth.signIn] provisioning error', e);
        return true; // لا نفشل تسجيل الدخول بسبب أخطاء provisioning
      }
    },
    async redirect({ url, baseUrl }) {
      try {
        // If absolute url to same origin, keep it
        if (url.startsWith(baseUrl)) {
          return url;
        }
        
        // For external URLs, redirect to portal by default
        return `${baseUrl}/portal`;
      } catch {
        return `${baseUrl}/portal`;
      }
    }
  },
  events: {},
};

// دالة تحديد دور المستخدم بناءً على البريد الإلكتروني
async function determineUserRole(email: string): Promise<string> {
  if (!email) return 'client';
  
  const emailLower = email.toLowerCase();
  
  try {
    // 1. تحقق من الأدمن
    const adminList = (process.env.ADMIN_EMAILS || 'admin@depth-agency.com')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);
    if (adminList.includes(emailLower)) return 'admin';
    
    // 2. تحقق من المبدعين
    const creatorSnap = await adminDb
      .collection('creators')
      .where('contact.email', '==', emailLower)
      .limit(1)
      .get();
    if (!creatorSnap.empty) return 'creator';
    
    // 3. تحقق من الموظفين
    const employeeSnap = await adminDb
      .collection('employees')
      .where('email', '==', emailLower)
      .limit(1)
      .get();
    if (!employeeSnap.empty) return 'employee';
    
    // 4. تحقق من العملاء
    const clientSnap = await adminDb
      .collection('clients')
      .where('email', '==', emailLower)
      .limit(1)
      .get();
    if (!clientSnap.empty) return 'client';
    
    // 5. افتراضي: عميل جديد
    return 'client';
  } catch (error) {
    console.error('[determineUserRole] Error:', error);
    return 'client';
  }
}
