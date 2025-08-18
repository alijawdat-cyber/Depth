// مؤقت: سكريبت لنقل البيانات من المجموعات المنفصلة إلى users الموحدة
// تشغيل مرة واحدة فقط للتأكد من وجود البيانات في مجموعة users

import { adminDb } from '@/lib/firebase/admin';

async function migrateUsersToUnified() {
  console.log('📋 بدء نقل المستخدمين إلى مجموعة users الموحدة...');
  
  const collections = [
    { name: 'admins', role: 'admin' },
    { name: 'employees', role: 'employee' },
    { name: 'creators', role: 'creator' },
    { name: 'clients', role: 'client' }
  ];

  let totalMigrated = 0;

  for (const { name: collectionName, role } of collections) {
    try {
      console.log(`📂 معالجة مجموعة ${collectionName}...`);
      const snapshot = await adminDb.collection(collectionName).get();
      
      for (const doc of snapshot.docs) {
        const data = doc.data();
        const email = data.email || data.contact?.email;
        
        if (!email) {
          console.warn(`⚠️ تم تخطي مستند بدون بريد إلكتروني في ${collectionName}: ${doc.id}`);
          continue;
        }

        // تحقق من عدم وجود المستخدم في users
        const existingUser = await adminDb
          .collection('users')
          .where('email', '==', email.toLowerCase())
          .limit(1)
          .get();

        if (existingUser.empty) {
          // إنشاء المستخدم في مجموعة users
          await adminDb.collection('users').add({
            email: email.toLowerCase(),
            name: data.name || data.fullName || data.displayName || '',
            role: role,
            status: data.status || 'active',
            phone: data.phone || data.contact?.phone || null,
            company: data.company || null,
            department: data.department || null,
            position: data.position || null,
            skills: data.skills || null,
            tier: data.tier || null,
            modifier: data.modifier || null,
            portfolio: data.portfolio || null,
            avatar: data.avatar || data.photoURL || null,
            image: data.image || data.avatar || data.photoURL || null,
            emailVerified: data.emailVerified || false,
            twoFactorEnabled: data.twoFactorEnabled || false,
            createdAt: data.createdAt || new Date(),
            updatedAt: data.updatedAt || new Date(),
            lastLoginAt: data.lastLoginAt || null,
            loginAttempts: data.loginAttempts || 0,
            lockedUntil: data.lockedUntil || null,
            // الاحتفاظ بمعرف المستند الأصلي للمرجعية
            originalId: doc.id,
            originalCollection: collectionName
          });
          
          totalMigrated++;
          console.log(`✅ تم نقل ${email} من ${collectionName}`);
        } else {
          console.log(`ℹ️ المستخدم ${email} موجود مسبقاً في users`);
        }
      }
    } catch (error) {
      console.error(`❌ خطأ في معالجة ${collectionName}:`, error);
    }
  }

  console.log(`🎉 تم الانتهاء! تم نقل ${totalMigrated} مستخدم إلى مجموعة users الموحدة`);
  
  // إحصائيات نهائية
  const usersCount = await adminDb.collection('users').get();
  console.log(`📊 العدد الإجمالي في مجموعة users: ${usersCount.size}`);
}

// تصدير للاستخدام في API endpoint مؤقت
export { migrateUsersToUnified };
