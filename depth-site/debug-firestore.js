// Debug script لفحص مجموعات Firestore باستخدام Firebase CLI
// هذا الملف يتطلب تشغيل عبر Next.js API للوصول لمتغيرات البيئة

console.log('⚠️ هذا ملف debug يجب تشغيله من خلال API endpoint');
console.log('💡 الحل: إنشاء API endpoint للتشخيص');

// دالة مساعدة لعرض معلومات المجموعة
function logCollectionInfo(name, docs) {
  console.log(`📂 مجموعة: ${name}`);
  if (docs.length === 0) {
    console.log('   ❌ فارغة أو غير موجودة');
  } else {
    console.log(`   ✅ تحتوي على ${docs.length} وثيقة`);
    const firstDoc = docs[0];
    console.log('   📄 مثال على البنية:');
    Object.keys(firstDoc).slice(0, 5).forEach(key => {
      console.log(`   - ${key}: ${typeof firstDoc[key]}`);
    });
  }
  console.log('');
}

async function debugFirestore() {
  console.log('🔍 فحص مجموعات Firestore...\n');

  try {
    // قائمة المجموعات المحتملة
    const collections = ['users', 'clients', 'creators', 'employees', 'admins'];
    
    for (const collectionName of collections) {
      try {
        console.log(`📂 فحص مجموعة: ${collectionName}`);
        
        // أخذ أول 3 وثائق فقط لفهم البنية
        const snapshot = await db.collection(collectionName).limit(3).get();
        
        if (snapshot.empty) {
          console.log(`   ❌ فارغة أو غير موجودة\n`);
        } else {
          console.log(`   ✅ تحتوي على ${snapshot.size} وثيقة(+)`);
          
          // عرض أول وثيقة كمثال على البنية
          const firstDoc = snapshot.docs[0];
          const data = firstDoc.data();
          
          console.log(`   📄 مثال على البنية:`);
          console.log(`   - ID: ${firstDoc.id}`);
          
          // عرض الحقول الأساسية فقط
          const fields = Object.keys(data);
          fields.slice(0, 5).forEach(field => {
            let value = data[field];
            if (typeof value === 'object' && value !== null) {
              value = Array.isArray(value) ? '[Array]' : '[Object]';
            }
            console.log(`   - ${field}: ${value}`);
          });
          
          if (fields.length > 5) {
            console.log(`   ... و ${fields.length - 5} حقل آخر`);
          }
          console.log('');
        }
      } catch (err) {
        console.log(`   ❌ خطأ في الوصول: ${err.message}\n`);
      }
    }
    
    console.log('✅ انتهى الفحص');
    
  } catch (error) {
    console.error('❌ خطأ عام:', error);
  }
  
  process.exit(0);
}

debugFirestore();
