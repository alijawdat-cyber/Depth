// Firebase Admin Configuration for Server-side operations
import * as admin from 'firebase-admin';
import { env } from '@/lib/env';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.FIREBASE_PROJECT_ID,
      privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();

export { adminDb, adminAuth };
