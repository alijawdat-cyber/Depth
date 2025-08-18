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
          const collections = ['clients', 'creators', 'employees'] as const;
          const collectionRoleMap: Record<(typeof collections)[number], 'client' | 'creator' | 'employee'> = {
            clients: 'client',
            creators: 'creator',
            employees: 'employee',
          };

          for (const collectionName of collections) {
            const userQuery = await adminDb
              .collection(collectionName)
              .where('email', '==', email)
              .limit(1)
              .get();

            if (!userQuery.empty) {
              const userDoc = userQuery.docs[0];
              const userData = userDoc.data();

              // التحقق من كلمة المرور (password أو hashedPassword)
              const passwordHash = userData.password || userData.hashedPassword;
              if (passwordHash && await bcrypt.compare(credentials.password, passwordHash)) {
                return {
                  id: userDoc.id,
                  email: userData.email,
                  name: userData.name || userData.fullName,
                  // لا نستخدم حقل role في وثيقة المبدع لأنه يحمل التخصص (photographer...) وليس دور الوصول
                  role: collectionRoleMap[collectionName],
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
            
            const passwordHash = creatorData.password || creatorData.hashedPassword;
            if (passwordHash && await bcrypt.compare(credentials.password, passwordHash)) {
              return {
                id: creatorDoc.id,
                email: creatorData.contact.email,
                name: creatorData.fullName,
                role: 'creator'
              };
            }
          }

          return null; // لا توجد مطابقة
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
        const candidate = (user as { role?: string }).role;
        // نضمن أن الدور واحد من الأدوار المسموحة، وإلا نحدده من قاعدة البيانات
        if (candidate === 'admin' || candidate === 'client' || candidate === 'creator' || candidate === 'employee') {
          token.role = candidate;
        } else {
          token.role = await determineUserRole(user.email || '');
        }
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
        console.log('[auth.signIn] start', { email, provider, userId: user?.id });
        
        if (!email) return true;
        
        // للمصادقة بـ Google، تحقق من وجود المستخدم في النظام
        if (provider === 'google') {
          const userRole = await determineUserRole(email);
          console.log('[auth.signIn] determined role:', userRole);
          
          // فقط أنشئ عميل جديد إذا لم يكن موجود في أي مجموعة
          if (userRole === 'client') {
            const clientSnap = await adminDb
              .collection('clients')
              .where('email', '==', email)
              .limit(1)
              .get();
              
            if (clientSnap.empty) {
              console.log('[auth.signIn] creating new client document for:', email);
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
            } else {
              console.log('[auth.signIn] client document already exists for:', email);
            }
          } else {
            console.log('[auth.signIn] user has existing role:', userRole, 'for email:', email);
            // Admin, creator, employee users لا نحتاج لإنشاء documents إضافية
            // FirestoreAdapter سينشئ documents في users و accounts تلقائياً
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
        // احترام الروابط النسبية (مثل /creators/intake)
        if (url.startsWith('/')) {
          return `${baseUrl}${url}`;
        }
        // إذا كان رابط مطلق على نفس الأصل، اتركه كما هو
        if (url.startsWith(baseUrl)) {
          return url;
        }
        // روابط خارجية → أعد للتطبيق إلى البوابة
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
    // 1. تحقق من قائمة الأدمن في متغيرات البيئة أولاً (أولوية قصوى)
    const adminList = (process.env.ADMIN_EMAILS || 'admin@depth-agency.com')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);
    if (adminList.includes(emailLower)) return 'admin';
    
    // 2. تحقق من مجموعة users الموحدة أولاً (الأولوية الأعلى)
    const userSnap = await adminDb
      .collection('users')
      .where('email', '==', emailLower)
      .limit(1)
      .get();
    
    if (!userSnap.empty) {
      const userData = userSnap.docs[0].data();
      // إذا كان للمستخدم دور محدد في البيانات، استخدمه
      if (userData.role && ['admin', 'employee', 'creator', 'client'].includes(userData.role)) {
        return userData.role;
      }
    }
    
    // 3. احتياطي: تحقق من المجموعات المنفصلة (للتوافق مع النظام القديم)
    // البحث بترتيب الأولوية: admin > employee > creator > client
    
    const adminDocSnap = await adminDb
      .collection('admins')
      .where('email', '==', emailLower)
      .limit(1)
      .get();
    if (!adminDocSnap.empty) return 'admin';
    
    const employeeSnap = await adminDb
      .collection('employees')
      .where('email', '==', emailLower)
      .limit(1)
      .get();
    if (!employeeSnap.empty) return 'employee';
    
    // البحث في creators (لديهم contact.email)
    const creatorSnap = await adminDb
      .collection('creators')
      .where('contact.email', '==', emailLower)
      .limit(1)
      .get();
    if (!creatorSnap.empty) return 'creator';
    
    // البحث في creators بـ email مباشر (احتياطي)
    const creatorTop = await adminDb
      .collection('creators')
      .where('email', '==', emailLower)
      .limit(1)
      .get();
    if (!creatorTop.empty) return 'creator';
    
    const clientSnap = await adminDb
      .collection('clients')
      .where('email', '==', emailLower)
      .limit(1)
      .get();
    if (!clientSnap.empty) return 'client';
    
    // 4. افتراضي: عميل جديد
    return 'client';
  } catch (error) {
    console.error('[determineUserRole] Error:', error);
    return 'client';
  }
}
